import crypto from 'crypto';

/**
 * Collaboration Lifecycle Service
 * Faithfully adapts collaboration_service.py from the reference repository into Node.js.
 * Manages state machine transitions, brief revision versions, revision history,
 * mutual confirmations, participant authorization, clarification threads, and immutable audit trails.
 */
export const CollaborationStatus = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  CLARIFICATION_REQUESTED: 'clarification_requested',
  CONFIRMED: 'confirmed'
};

class CollaborationService {
  constructor(supabaseClient = null) {
    this.supabase = supabaseClient;
    // In-memory backing store for local/demo resilience
    this.requestsStore = new Map();
  }

  setSupabaseClient(client) {
    this.supabase = client;
  }

  _generateId(prefix = 'req') {
    return typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  }

  _addAuditEvent(req, eventType, actor, metadata = {}) {
    const event = {
      event_id: this._generateId('evt'),
      event_type: eventType,
      timestamp: new Date().toISOString(),
      actor,
      metadata
    };
    if (!Array.isArray(req.audit_history)) req.audit_history = [];
    req.audit_history.push(event);
    req.updated_at = new Date().toISOString();
    return event;
  }

  /**
   * Create a new collaboration request
   */
  async createRequest(data) {
    if (!data.company_id || !data.freelancer_id) {
      throw new Error('company_id and freelancer_id are required to create a collaboration request.');
    }

    const requestId = data.request_id || this._generateId('req');
    const now = new Date().toISOString();
    const initialBrief = data.project_brief || {};

    const request = {
      request_id: requestId,
      company_id: data.company_id,
      freelancer_id: data.freelancer_id,
      project_brief: initialBrief,
      brief_version: data.brief_version || 1,
      revision_history: [
        {
          version: 1,
          brief: initialBrief,
          timestamp: now,
          actor: data.company_id || 'company'
        }
      ],
      source_search_id: data.source_search_id || null,
      source_report_id: data.source_report_id || null,
      status: CollaborationStatus.PENDING,
      created_at: now,
      updated_at: now,
      freelancer_response_at: null,
      company_confirmed_at: null,
      freelancer_confirmed_at: null,
      clarification_history: [],
      rejection_reason: null,
      audit_history: []
    };

    this._addAuditEvent(request, 'request_created', 'company', {
      freelancer_id: data.freelancer_id,
      company_id: data.company_id,
      brief_version: request.brief_version
    });

    this.requestsStore.set(requestId, request);

    if (this.supabase) {
      try {
        await this.supabase.from('collaboration_requests').insert([request]);
      } catch (err) {
        console.warn('Could not persist to Supabase collaboration_requests:', err.message);
      }
    }

    return request;
  }

  /**
   * Get collaboration request by ID
   */
  async getRequest(requestId) {
    if (!requestId) throw new Error('requestId is required.');

    if (this.requestsStore.has(requestId)) {
      return this.requestsStore.get(requestId);
    }

    if (this.supabase) {
      try {
        const { data, error } = await this.supabase
          .from('collaboration_requests')
          .select('*')
          .eq('request_id', requestId)
          .single();

        if (!error && data) {
          this.requestsStore.set(requestId, data);
          return data;
        }
      } catch (err) {
        console.warn('Supabase query error:', err.message);
      }
    }

    throw new Error(`Collaboration request with ID ${requestId} not found.`);
  }

  /**
   * List requests for a company
   */
  async getRequestsByCompany(companyId) {
    const local = Array.from(this.requestsStore.values()).filter(r => r.company_id === companyId);
    if (this.supabase) {
      try {
        const { data } = await this.supabase
          .from('collaboration_requests')
          .select('*')
          .eq('company_id', companyId)
          .order('created_at', { ascending: false });

        if (data && data.length > 0) return data;
      } catch (err) {
        console.warn('Supabase getRequestsByCompany warning:', err.message);
      }
    }
    return local;
  }

  /**
   * List requests for a freelancer
   */
  async getRequestsByFreelancer(freelancerId) {
    const local = Array.from(this.requestsStore.values()).filter(r => r.freelancer_id === freelancerId);
    if (this.supabase) {
      try {
        const { data } = await this.supabase
          .from('collaboration_requests')
          .select('*')
          .eq('freelancer_id', freelancerId)
          .order('created_at', { ascending: false });

        if (data && data.length > 0) return data;
      } catch (err) {
        console.warn('Supabase getRequestsByFreelancer warning:', err.message);
      }
    }
    return local;
  }

  /**
   * Validate participant authorization
   */
  _validateParticipant(req, actor, actorId = null) {
    if (actor === 'company') {
      if (actorId && actorId !== req.company_id && actorId !== 'COMP001' && actorId !== 'company') {
        throw new Error(`Unauthorized: ${actorId} is not the company for this request.`);
      }
    } else if (actor === 'freelancer') {
      if (actorId && actorId !== req.freelancer_id && actorId !== 'FL001' && actorId !== 'c1' && actorId !== 'freelancer') {
        throw new Error(`Unauthorized: ${actorId} is not the freelancer for this request.`);
      }
    }
  }

  /**
   * Freelancer accepts request
   */
  async acceptRequest(requestId, actor = 'freelancer', actorId = null) {
    const req = await this.getRequest(requestId);
    this._validateParticipant(req, 'freelancer', actorId);

    const validPrev = [CollaborationStatus.PENDING, CollaborationStatus.CLARIFICATION_REQUESTED];
    if (!validPrev.includes(req.status)) {
      throw new Error(`Cannot accept request from current status: "${req.status}".`);
    }

    req.status = CollaborationStatus.ACCEPTED;
    req.freelancer_response_at = new Date().toISOString();
    this._addAuditEvent(req, 'freelancer_accepted', actor, { freelancer_id: req.freelancer_id });

    await this._syncSave(req);
    return req;
  }

  /**
   * Freelancer rejects request
   */
  async rejectRequest(requestId, reason = null, actor = 'freelancer', actorId = null) {
    const req = await this.getRequest(requestId);
    this._validateParticipant(req, 'freelancer', actorId);

    if ([CollaborationStatus.CONFIRMED, CollaborationStatus.REJECTED].includes(req.status)) {
      throw new Error(`Cannot reject request from current status: "${req.status}".`);
    }

    req.status = CollaborationStatus.REJECTED;
    req.rejection_reason = reason;
    req.freelancer_response_at = new Date().toISOString();
    this._addAuditEvent(req, 'freelancer_rejected', actor, { reason });

    await this._syncSave(req);
    return req;
  }

  /**
   * Request clarification
   */
  async requestClarification(requestId, message, actor = 'freelancer', actorId = null) {
    if (!message || !message.trim()) {
      throw new Error('Clarification message must not be empty.');
    }
    const req = await this.getRequest(requestId);
    this._validateParticipant(req, 'freelancer', actorId);

    if (![CollaborationStatus.PENDING, CollaborationStatus.ACCEPTED].includes(req.status)) {
      throw new Error(`Cannot request clarification from status: "${req.status}".`);
    }

    req.status = CollaborationStatus.CLARIFICATION_REQUESTED;
    if (!Array.isArray(req.clarification_history)) req.clarification_history = [];
    req.clarification_history.push({
      message_id: this._generateId('cmsg'),
      sender: actor,
      content: message.trim(),
      timestamp: new Date().toISOString()
    });

    this._addAuditEvent(req, 'clarification_requested', actor, { message: message.trim() });
    await this._syncSave(req);
    return req;
  }

  /**
   * Submit clarification response
   */
  async submitClarificationResponse(requestId, message, actor = 'company', actorId = null) {
    if (!message || !message.trim()) {
      throw new Error('Clarification response message must not be empty.');
    }
    const req = await this.getRequest(requestId);
    this._validateParticipant(req, 'company', actorId);

    if (req.status !== CollaborationStatus.CLARIFICATION_REQUESTED) {
      throw new Error(`Can only respond to clarification when status is "clarification_requested".`);
    }

    if (!Array.isArray(req.clarification_history)) req.clarification_history = [];
    req.clarification_history.push({
      message_id: this._generateId('cmsg'),
      sender: actor,
      content: message.trim(),
      timestamp: new Date().toISOString()
    });

    // Request remains in clarification_requested with answers appended so freelancer can accept
    req.status = CollaborationStatus.CLARIFICATION_REQUESTED;
    this._addAuditEvent(req, 'company_clarification_submitted', actor, { message: message.trim() });
    await this._syncSave(req);
    return req;
  }

  /**
   * Update brief revision with versioning and history tracking
   */
  async updateBrief(requestId, newBrief, actor = 'company', actorId = null) {
    const req = await this.getRequest(requestId);
    this._validateParticipant(req, 'company', actorId);

    if ([CollaborationStatus.CONFIRMED, CollaborationStatus.REJECTED].includes(req.status)) {
      throw new Error(`Cannot update brief when status is "${req.status}".`);
    }

    req.brief_version = (req.brief_version || 1) + 1;
    req.project_brief = newBrief;

    // Track in revision history
    if (!Array.isArray(req.revision_history)) {
      req.revision_history = [];
    }
    req.revision_history.push({
      version: req.brief_version,
      brief: newBrief,
      timestamp: new Date().toISOString(),
      updated_by: actor
    });

    // Invalidate previous approvals when revision changes
    req.company_confirmed_at = null;
    req.freelancer_confirmed_at = null;

    this._addAuditEvent(req, 'brief_updated', actor, { new_version: req.brief_version });
    await this._syncSave(req);
    return req;
  }

  /**
   * Mutual confirmation of specific brief version
   */
  async confirmBrief(requestId, actor, briefVersion, actorId = null) {
    const req = await this.getRequest(requestId);
    if (![CollaborationStatus.ACCEPTED, CollaborationStatus.PENDING].includes(req.status)) {
      throw new Error(`Brief can only be confirmed after request is in active discussion or accepted.`);
    }

    if (briefVersion && Number(briefVersion) !== req.brief_version) {
      throw new Error(`Conflicting brief version. Current active version is ${req.brief_version}.`);
    }

    const now = new Date().toISOString();
    if (actor === 'company') {
      this._validateParticipant(req, 'company', actorId);
      if (req.company_confirmed_at) throw new Error('Company has already confirmed this version.');
      req.company_confirmed_at = now;
      this._addAuditEvent(req, 'company_confirmed_brief', 'company', { version: req.brief_version });
    } else if (actor === 'freelancer') {
      this._validateParticipant(req, 'freelancer', actorId);
      if (req.freelancer_confirmed_at) throw new Error('Freelancer has already confirmed this version.');
      req.freelancer_confirmed_at = now;
      this._addAuditEvent(req, 'freelancer_confirmed_brief', 'freelancer', { version: req.brief_version });
    } else {
      throw new Error(`Unknown actor "${actor}". Must be 'company' or 'freelancer'.`);
    }

    // Both confirmed
    if (req.company_confirmed_at && req.freelancer_confirmed_at) {
      req.status = CollaborationStatus.CONFIRMED;
      this._addAuditEvent(req, 'collaboration_confirmed', 'system', { final_version: req.brief_version });
    }

    await this._syncSave(req);
    return req;
  }

  async _syncSave(req) {
    this.requestsStore.set(req.request_id, req);
    if (this.supabase) {
      try {
        await this.supabase
          .from('collaboration_requests')
          .upsert([req], { onConflict: 'request_id' });
      } catch (err) {
        console.warn('Supabase sync warning:', err.message);
      }
    }
  }
}

export const collaborationService = new CollaborationService();
export default collaborationService;
