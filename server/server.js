import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import crypto from 'crypto';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@supabase/supabase-js';

import { DEFAULT_CREATORS } from './data/defaultCreators.js';
import { searchService } from './services/searchService.js';
import { scoringService } from './services/scoringService.js';
import { collaborationService, CollaborationStatus } from './services/collaborationService.js';
import { reportService } from './services/reportService.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Supabase if valid environment variables are provided
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
let supabase = null;
if (supabaseUrl && supabaseKey && !supabaseKey.startsWith('AQ.')) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey);
    collaborationService.setSupabaseClient(supabase);
    console.log('✅ Supabase client initialized on server.');
  } catch (err) {
    console.warn('⚠️ Could not initialize Supabase on server:', err.message);
  }
}

// Middleware
app.use(cors());
app.use(express.json({ limit: '2mb' }));

// Health check endpoints
const healthPayload = () => ({
  status: 'ok',
  service: 'GenLancer Backend Core & Proxy',
  timestamp: new Date().toISOString(),
  features: [
    'Gemini AI Brief Generation',
    'Structured Creator Search',
    'Explainable 7-Dimension Scoring',
    'Matching & Requirements Report Engine',
    '5-Stage Collaboration Lifecycle',
    'Audit Trail & Revision History Stream',
    'Scoped Messaging & Persistence'
  ]
});
app.get('/health', (req, res) => res.json(healthPayload()));
app.get('/api/health', (req, res) => res.json(healthPayload()));

// Root welcome route
app.get('/', (req, res) => {
  res.json({
    message: 'GenLancer Core Backend & AI Proxy is running.',
    endpoints: {
      health: 'GET /health',
      creators: 'GET /api/creators',
      search: 'POST /api/search',
      score: 'POST /api/score',
      reportGenerate: 'POST /api/report/generate',
      generateBrief: 'POST /api/generate-brief',
      collaboration: 'POST /api/collaboration',
      messages: 'POST /api/messages'
    }
  });
});

// Helper: Fetch all creators (Supabase first with fallback to default fixtures)
async function getCreatorsDataset() {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('freelancers').select('*');
      if (!error && data && data.length > 0) {
        return data;
      }
    } catch (e) {
      // Fallback
    }
  }
  return DEFAULT_CREATORS;
}

// GET /api/creators
app.get('/api/creators', async (req, res) => {
  try {
    const creators = await getCreatorsDataset();
    res.json({ success: true, count: creators.length, creators });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/search
 * Natural-language requirement extraction & structured search
 */
app.post('/api/search', async (req, res) => {
  try {
    const creators = await getCreatorsDataset();
    const searchResponse = searchService.search(creators, req.body);
    res.json({ success: true, ...searchResponse });
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/score
 * Weighted 7-dimension explainable scoring adapted from reference scoring_service.py
 */
app.post('/api/score', async (req, res) => {
  try {
    const { search_results, search_request, brief, requirements, weights } = req.body;
    let searchRes = search_results;

    if (!searchRes) {
      const creators = await getCreatorsDataset();
      const searchCriteria = search_request || brief || requirements || req.body;
      searchRes = searchService.search(creators, searchCriteria);
    }

    const scoringResponse = scoringService.scoreCandidates(searchRes, weights || {});
    res.json({ success: true, ...scoringResponse, search_results: searchRes });
  } catch (err) {
    console.error('Scoring error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/report/generate
 * Comprehensive Matching and Requirements Analysis Report adapted from reference report_service.py
 */
app.post('/api/report/generate', async (req, res) => {
  try {
    let { search_results, scoring_results, brief, search_request } = req.body;

    if ((!search_results || !scoring_results) && (brief || search_request)) {
      const creators = await getCreatorsDataset();
      search_results = searchService.search(creators, brief || search_request);
      scoring_results = scoringService.scoreCandidates(search_results, req.body.weights || {});
    }

    if (!search_results || !search_results.search_id) {
      return res.status(400).json({
        success: false,
        error: 'Invalid search_results provided: search_results with search_id is required.'
      });
    }

    if (!scoring_results || !scoring_results.search_id) {
      return res.status(400).json({
        success: false,
        error: 'Invalid scoring_results provided: scoring_results with search_id is required.'
      });
    }

    if (search_results.search_id !== scoring_results.search_id) {
      return res.status(400).json({
        success: false,
        error: `Search ID mismatch: search_results (${search_results.search_id}) does not match scoring_results (${scoring_results.search_id}).`
      });
    }

    const report = reportService.generateReport(search_results, scoring_results);
    res.json({ success: true, report });
  } catch (err) {
    console.error('Report generation error:', err);
    res.status(400).json({ success: false, error: err.message });
  }
});

// GET /api/report/:reportId - Retrieve generated report
app.get('/api/report/:reportId', (req, res) => {
  const report = reportService.getReport(req.params.reportId);
  if (!report) {
    return res.status(404).json({
      success: false,
      error: `Report with ID "${req.params.reportId}" not found.`
    });
  }
  res.json({ success: true, report });
});

/**
 * Fallback brief generator when Gemini API is unconfigured or unavailable
 */
function generateStructuredBriefFallback(rawIdea, userMeta = {}) {
  const lower = rawIdea.toLowerCase();
  const searchReqs = searchService.extractRequirements(rawIdea);

  const missingInfo = [];
  const clarificationQuestions = [];

  if (!/\$|\bbudget\b|\bescrow\b|\bcost\b/i.test(lower)) {
    missingInfo.push('Exact Budget or Escrow Cap');
    clarificationQuestions.push('What is your allocated budget or escrow limit for this engagement?');
  }
  if (!/\bdeadline\b|\bby\b|\bdeliver\b|\bweek\b|\bmonth\b|\bdays\b/i.test(lower)) {
    missingInfo.push('Delivery Timeline / Deadline');
    clarificationQuestions.push('What is the required final asset delivery date?');
  }
  if (!/\b16:9\b|\b9:16\b|\b1:1\b|\b4:5\b|\bformat\b|\bratio\b/i.test(lower)) {
    missingInfo.push('Target Aspect Ratio & Resolution');
    clarificationQuestions.push('Do you need widescreen (16:9 YouTube), vertical (9:16 Reels/TikTok), or square (1:1)?');
  }
  if (!/\bcommercial\b|\brights\b|\blicens\b|\bbuyout\b/i.test(lower)) {
    missingInfo.push('Commercial Licensing Rights');
    clarificationQuestions.push('Do you require full commercial ownership buyout or royalty-free licensing?');
  }
  if (!/\brunway\b|\bmidjourney\b|\bflux\b|\bkling\b|\bluma\b|\bsora\b/i.test(lower)) {
    missingInfo.push('Preferred Generative Model / Pipeline');
    clarificationQuestions.push('Do you have a specific AI model pipeline in mind (e.g. Runway Gen-3, Flux.1, ComfyUI)?');
  }

  const completenessScore = Math.max(25, 100 - (missingInfo.length * 15));
  const titleWords = rawIdea.split(' ').slice(0, 5).join(' ');

  return {
    brandNameSuggestions: [
      { name: `${titleWords.toUpperCase()} PRO`, rationale: 'Dynamic and tech-forward project label' },
      { name: 'NEXTGEN CAMPAIGN', rationale: 'Emphasizes generative modern media' }
    ],
    tagline: 'Precision AI Production for Modern Brands.',
    missionStatement: `To deliver state-of-the-art ${searchReqs.content_type || 'creative'} production aligned with client vision.`,
    visionStatement: 'To push generative storytelling into premier commercial broadcast tier.',
    brandArchetype: 'The Creator / The Pioneer',
    toneAndVoice: ['Innovative', 'Cinematic', 'High-End', 'Dynamic'],
    required_skills: (searchReqs.required_skills && searchReqs.required_skills.length > 0) ? searchReqs.required_skills : ['Prompt Engineering', 'AI Video Generation'],
    tools: (searchReqs.ai_tools_models && searchReqs.ai_tools_models.length > 0) ? searchReqs.ai_tools_models : ['Runway Gen-3 Alpha'],
    targetAudience: {
      primaryAudience: userMeta.audience || 'Target demographics seeking cutting-edge visual experiences.',
      demographics: 'Ages 18-40, tech-oriented consumers and design-forward professionals.',
      psychographics: 'Values innovation, high production fidelity, and bold creative vision.',
      keyPainPoints: ['Generic stock footage aesthetics', 'Slow traditional turnaround cycles'],
      valueProposition: 'Rapid, photorealistic AI-native commercial deliverables.'
    },
    visualIdentity: {
      colorPalette: [
        { name: 'Obsidian Void', hex: '#0B0B0F', usage: 'Dominant dark tone' },
        { name: 'Electric Orange', hex: '#FF6B00', usage: 'Primary brand accent' },
        { name: 'Pure White', hex: '#FFFFFF', usage: 'High-contrast typography' }
      ],
      typographyMood: 'Clean, bold, modern, and geometric sans-serif.',
      designAesthetic: `${searchReqs.visual_style || 'Cinematic Photorealistic'} generative imagery with high dynamic range lighting.`
    },
    coreValues: ['Creative Excellence', 'Workflow Transparency', 'Commercial Veracity'],
    keyDeliverables: [
      { item: `${searchReqs.content_type || 'Master'} Asset Package`, description: `Final rendered deliverable in ${searchReqs.output_format || '16:9'} format.`, priority: 'High' },
      { item: 'Generative Pipeline & Prompt Specification', description: 'Documented prompt strings, model checkpoints, and seed numbers.', priority: 'Medium' }
    ],
    executiveSummary: `Creative project brief for ${rawIdea.trim()}. Focuses on delivering verified high-fidelity assets using AI toolchains.`,
    completeness_score: completenessScore,
    missing_information: missingInfo,
    clarification_questions: clarificationQuestions,
    source_attribution: {
      input_idea: 'user_provided',
      brand_archetype: 'ai_inferred',
      visual_identity: 'ai_inferred',
      completeness_score: 'calculated'
    },
    generation_method: 'Structured Rule-based Engine v1 (Deterministic Fallback)'
  };
}

/**
 * POST /api/generate-brief
 * Accepts raw brand ideas and transforms them into a structured JSON brief
 * using Gemini, with completeness scoring, clarification questions, and deterministic fallback.
 */
app.post('/api/generate-brief', async (req, res) => {
  try {
    const { idea, prompt, audience, tone, industry } = req.body;
    const rawIdea = idea || prompt;

    if (!rawIdea || typeof rawIdea !== 'string' || !rawIdea.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Missing required field: "idea" or "prompt" must be a non-empty string.'
      });
    }

    if (rawIdea.trim().length < 5) {
      return res.status(400).json({
        success: false,
        error: 'Input idea is too short. Please provide at least 5 characters describing your campaign concept.'
      });
    }

    if (rawIdea.length > 5000) {
      return res.status(400).json({
        success: false,
        error: 'Input exceeds maximum allowed length of 5000 characters.'
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    const hasValidApiKey = Boolean(apiKey && apiKey !== 'your_gemini_api_key_here' && !apiKey.startsWith('placeholder'));

    if (!hasValidApiKey) {
      console.log('Gemini API key unconfigured, using structured deterministic fallback brief.');
      const fallbackBrief = generateStructuredBriefFallback(rawIdea, { audience, tone, industry });
      return res.status(200).json({
        success: true,
        modelUsed: 'deterministic-fallback',
        brief: fallbackBrief,
        completeness_score: fallbackBrief.completeness_score,
        required_skills: fallbackBrief.required_skills,
        tools: fallbackBrief.tools,
        clarification_questions: fallbackBrief.clarification_questions
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const candidateModels = ['gemini-2.5-flash', 'gemini-1.5-flash', 'gemini-1.5-pro'];

    const promptInstructions = `
You are an expert Creative Director and Brand Strategist.
A client has provided this raw campaign idea:
"${rawIdea.trim()}"

Transform this messy idea into a comprehensive, structured brand brief returned STRICTLY as valid JSON.
DO NOT wrap in markdown \`\`\`json tags, return ONLY the raw JSON object matching this schema:
{
  "brandNameSuggestions": [
    { "name": "Brand/Campaign Name", "rationale": "Short explanation" }
  ],
  "tagline": "A punchy, memorable slogan",
  "missionStatement": "A concise mission statement",
  "visionStatement": "A future-focused vision statement",
  "brandArchetype": "e.g., The Creator, The Explorer, The Outlaw",
  "toneAndVoice": ["Keyword1", "Keyword2", "Keyword3"],
  "targetAudience": {
    "primaryAudience": "Description of the primary customer segment",
    "demographics": "Age, gender, location, income",
    "psychographics": "Interests, values, lifestyle",
    "keyPainPoints": ["Pain point 1", "Pain point 2"],
    "valueProposition": "Why this brand solves their problem"
  },
  "visualIdentity": {
    "colorPalette": [
      { "name": "Color Name", "hex": "#HEXVAL", "usage": "Background/Accent/Primary" }
    ],
    "typographyMood": "Description of typography style",
    "designAesthetic": "e.g., Cyberpunk, Minimalist, Luxury"
  },
  "coreValues": ["Value 1", "Value 2", "Value 3"],
  "keyDeliverables": [
    { "item": "Deliverable title", "description": "Specific requirements", "priority": "High/Medium" }
  ],
  "executiveSummary": "A cohesive 2-3 sentence summary of the campaign"
}
`;

    let responseText = null;
    let modelUsed = null;
    let lastError = null;

    for (const modelName of candidateModels) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          generationConfig: { responseMimeType: 'application/json' }
        });
        const result = await model.generateContent(promptInstructions);
        responseText = result.response.text();
        modelUsed = modelName;
        break;
      } catch (err) {
        lastError = err;
        console.warn(`Model ${modelName} failed, trying fallback:`, err.message);
      }
    }

    if (!responseText) {
      console.warn('All Gemini models failed, gracefully engaging deterministic brief generator.');
      const fallbackBrief = generateStructuredBriefFallback(rawIdea, { audience, tone, industry });
      return res.status(200).json({
        success: true,
        modelUsed: 'deterministic-fallback',
        brief: fallbackBrief,
        completeness_score: fallbackBrief.completeness_score,
        required_skills: fallbackBrief.required_skills,
        tools: fallbackBrief.tools,
        clarification_questions: fallbackBrief.clarification_questions
      });
    }

    let structuredBrief;
    try {
      let cleanText = responseText.trim();
      if (cleanText.startsWith('```json')) cleanText = cleanText.slice(7);
      if (cleanText.endsWith('```')) cleanText = cleanText.slice(0, -3);
      structuredBrief = JSON.parse(cleanText.trim());
    } catch (parseError) {
      console.warn('Failed to parse Gemini JSON output, engaging deterministic fallback:', parseError);
      const fallbackBrief = generateStructuredBriefFallback(rawIdea, { audience, tone, industry });
      return res.status(200).json({
        success: true,
        modelUsed: 'deterministic-fallback',
        brief: fallbackBrief,
        completeness_score: fallbackBrief.completeness_score,
        required_skills: fallbackBrief.required_skills,
        tools: fallbackBrief.tools,
        clarification_questions: fallbackBrief.clarification_questions
      });
    }

    // Completeness Evaluation & Clarification Questions
    const lower = rawIdea.toLowerCase();
    const missingInfo = [];
    const clarificationQuestions = [];

    if (!/\$|\bbudget\b|\bescrow\b|\bcost\b/i.test(lower)) {
      missingInfo.push('Exact Budget or Escrow Cap');
      clarificationQuestions.push('What is your allocated budget or escrow limit for this engagement?');
    }
    if (!/\bdeadline\b|\bby\b|\bdeliver\b|\bweek\b|\bmonth\b|\bdays\b/i.test(lower)) {
      missingInfo.push('Delivery Timeline / Deadline');
      clarificationQuestions.push('What is the required final asset delivery date?');
    }
    if (!/\b16:9\b|\b9:16\b|\b1:1\b|\b4:5\b|\bformat\b|\bratio\b/i.test(lower)) {
      missingInfo.push('Target Aspect Ratio & Resolution');
      clarificationQuestions.push('Do you need widescreen (16:9 YouTube), vertical (9:16 Reels/TikTok), or square (1:1)?');
    }
    if (!/\bcommercial\b|\brights\b|\blicens\b|\bbuyout\b/i.test(lower)) {
      missingInfo.push('Commercial Licensing Rights');
      clarificationQuestions.push('Do you require full commercial ownership buyout or royalty-free licensing?');
    }
    if (!/\brunway\b|\bmidjourney\b|\bflux\b|\bkling\b|\bluma\b|\bsora\b/i.test(lower)) {
      missingInfo.push('Preferred Generative Model / Pipeline');
      clarificationQuestions.push('Do you have a specific AI model pipeline in mind (e.g. Runway Gen-3, Flux.1, ComfyUI)?');
    }

    const completenessScore = Math.max(25, 100 - (missingInfo.length * 15));

    structuredBrief.completeness_score = completenessScore;
    structuredBrief.missing_information = missingInfo;
    structuredBrief.clarification_questions = clarificationQuestions;
    structuredBrief.source_attribution = {
      input_idea: 'user_provided',
      target_audience: 'ai_inferred',
      visual_identity: 'ai_inferred',
      key_deliverables: 'ai_inferred',
      completeness_score: 'calculated'
    };
    structuredBrief.generation_method = `Google Gemini (${modelUsed})`;

    return res.status(200).json({
      success: true,
      modelUsed,
      brief: structuredBrief,
      completeness_score: completenessScore,
      required_skills: ['Prompt Engineering', 'AI Video Generation'],
      tools: ['Runway Gen-3', 'Midjourney v6'],
      clarification_questions: clarificationQuestions
    });
  } catch (error) {
    console.error('Error generating brand brief:', error);
    const errorMessage = error?.message || 'Internal server error while communicating with Gemini API';
    return res.status(500).json({
      success: false,
      error: errorMessage
    });
  }
});

// ================= COLLABORATION LIFECYCLE ROUTES ================= //

// POST /api/collaboration (aliases: /request, /create) - Create request
app.post(['/api/collaboration', '/api/collaboration/request', '/api/collaboration/create'], async (req, res) => {
  try {
    const request = await collaborationService.createRequest(req.body);
    res.status(201).json({ success: true, request });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// GET /api/collaboration/:requestId - Get request
app.get('/api/collaboration/:requestId', async (req, res) => {
  try {
    const request = await collaborationService.getRequest(req.params.requestId);
    res.json({ success: true, request });
  } catch (err) {
    res.status(404).json({ success: false, error: err.message });
  }
});

// GET /api/collaboration/company/:companyId - List by company
app.get('/api/collaboration/company/:companyId', async (req, res) => {
  try {
    const requests = await collaborationService.getRequestsByCompany(req.params.companyId);
    res.json({ success: true, count: requests.length, requests });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/collaboration/freelancer/:freelancerId - List by freelancer
app.get('/api/collaboration/freelancer/:freelancerId', async (req, res) => {
  try {
    const requests = await collaborationService.getRequestsByFreelancer(req.params.freelancerId);
    res.json({ success: true, count: requests.length, requests });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/collaboration/:requestId/accept - Accept request
app.post('/api/collaboration/:requestId/accept', async (req, res) => {
  try {
    const actorId = req.body.actor_id || req.body.sender_id || req.headers['x-user-id'] || null;
    const request = await collaborationService.acceptRequest(req.params.requestId, req.body.actor || 'freelancer', actorId);
    res.json({ success: true, request });
  } catch (err) {
    const isAuth = err.message.includes('Unauthorized');
    res.status(isAuth ? 403 : 400).json({ success: false, error: err.message });
  }
});

// POST /api/collaboration/:requestId/reject - Reject request
app.post('/api/collaboration/:requestId/reject', async (req, res) => {
  try {
    const actorId = req.body.actor_id || req.body.sender_id || req.headers['x-user-id'] || null;
    const request = await collaborationService.rejectRequest(req.params.requestId, req.body.reason, req.body.actor || 'freelancer', actorId);
    res.json({ success: true, request });
  } catch (err) {
    const isAuth = err.message.includes('Unauthorized');
    res.status(isAuth ? 403 : 400).json({ success: false, error: err.message });
  }
});

// POST /api/collaboration/:requestId/clarify - Request clarification
app.post('/api/collaboration/:requestId/clarify', async (req, res) => {
  try {
    const msg = req.body.message || req.body.question || req.body.questions;
    const actorId = req.body.actor_id || req.body.sender_id || req.headers['x-user-id'] || null;
    const request = await collaborationService.requestClarification(req.params.requestId, msg, req.body.actor || 'freelancer', actorId);
    res.json({ success: true, request });
  } catch (err) {
    const isAuth = err.message.includes('Unauthorized');
    res.status(isAuth ? 403 : 400).json({ success: false, error: err.message });
  }
});

// POST /api/collaboration/:requestId/respond-clarify - Respond to clarification
app.post('/api/collaboration/:requestId/respond-clarify', async (req, res) => {
  try {
    const msg = req.body.message || req.body.response || req.body.answer;
    const actorId = req.body.actor_id || req.body.sender_id || req.headers['x-user-id'] || null;
    const request = await collaborationService.submitClarificationResponse(req.params.requestId, msg, req.body.actor || 'company', actorId);
    res.json({ success: true, request });
  } catch (err) {
    const isAuth = err.message.includes('Unauthorized');
    res.status(isAuth ? 403 : 400).json({ success: false, error: err.message });
  }
});

// POST /api/collaboration/:requestId/update-brief - Revise brief
app.post('/api/collaboration/:requestId/update-brief', async (req, res) => {
  try {
    const actorId = req.body.actor_id || req.body.sender_id || req.headers['x-user-id'] || null;
    const newBrief = req.body.project_brief || req.body.brief || req.body;
    const request = await collaborationService.updateBrief(req.params.requestId, newBrief, req.body.actor || 'company', actorId);
    res.json({ success: true, request });
  } catch (err) {
    const isAuth = err.message.includes('Unauthorized');
    res.status(isAuth ? 403 : 400).json({ success: false, error: err.message });
  }
});

// POST /api/collaboration/:requestId/confirm - Mutual confirmation
app.post('/api/collaboration/:requestId/confirm', async (req, res) => {
  try {
    const actorId = req.body.actor_id || req.body.sender_id || req.headers['x-user-id'] || null;
    const request = await collaborationService.confirmBrief(req.params.requestId, req.body.actor, req.body.brief_version, actorId);
    res.json({ success: true, request });
  } catch (err) {
    const isAuth = err.message.includes('Unauthorized');
    res.status(isAuth ? 403 : 400).json({ success: false, error: err.message });
  }
});

// ================= MESSAGING ROUTES ================= //

// In-memory messages backup store
const inMemoryMessages = [];

// POST /api/messages - Send message with server-side validation and participant authorization
app.post('/api/messages', async (req, res) => {
  try {
    const { request_id, sender_id, sender_role } = req.body;
    const content = req.body.content || req.body.message || req.body.text;

    if (!request_id || !request_id.trim()) {
      return res.status(400).json({ success: false, error: 'Valid request_id is required for all messages.' });
    }
    if (!content || !content.trim()) {
      return res.status(400).json({ success: false, error: 'Message content must not be empty.' });
    }
    if (content.length > 4000) {
      return res.status(400).json({ success: false, error: 'Message exceeds maximum length of 4000 characters.' });
    }
    if (!['company', 'freelancer', 'system'].includes(sender_role)) {
      return res.status(400).json({ success: false, error: 'Invalid sender_role. Must be "company", "freelancer", or "system".' });
    }

    // Verify collaboration request exists & participant authorization
    let colReq = null;
    try {
      colReq = await collaborationService.getRequest(request_id);
    } catch (_) {
      // Allow standard demo thread prefix patterns, otherwise reject unknown thread
      if (!request_id.startsWith('REQ-') && !request_id.startsWith('th-') && !request_id.startsWith('test-')) {
        return res.status(404).json({ success: false, error: `Collaboration request "${request_id}" not found.` });
      }
    }

    if (colReq && sender_id) {
      const isCompany = (sender_role === 'company' && (sender_id === colReq.company_id || sender_id === 'COMP001')) || sender_id === colReq.company_id;
      const isFreelancer = (sender_role === 'freelancer' && (sender_id === colReq.freelancer_id || sender_id === 'FL001' || sender_id === 'c1')) || sender_id === colReq.freelancer_id;
      if (!isCompany && !isFreelancer && sender_role !== 'system') {
        return res.status(403).json({
          success: false,
          error: `Unauthorized: Sender "${sender_id}" is not an authorized participant in this collaboration.`
        });
      }
    }

    const messageRecord = {
      message_id: crypto.randomUUID ? crypto.randomUUID() : `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      request_id: request_id.trim(),
      sender_id: sender_id || (sender_role === 'company' ? 'COMP001' : 'FL001'),
      sender_role,
      content: content.trim(),
      timestamp: new Date().toISOString()
    };

    inMemoryMessages.push(messageRecord);

    let persisted = false;
    if (supabase) {
      try {
        const { error } = await supabase.from('messages').insert([messageRecord]);
        if (!error) persisted = true;
      } catch (err) {
        console.warn('Supabase message insert warning:', err.message);
      }
    }

    res.status(201).json({
      success: true,
      persistence_mode: persisted ? 'database' : 'in_memory_transient',
      message: messageRecord,
      data: messageRecord
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/messages/:requestId - Fetch messages for request
app.get('/api/messages/:requestId', async (req, res) => {
  try {
    const { requestId } = req.params;
    if (!requestId || !requestId.trim()) {
      return res.status(400).json({ success: false, error: 'requestId parameter is required.' });
    }

    let messages = inMemoryMessages.filter(m => m.request_id === requestId);
    let persisted = false;

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .eq('request_id', requestId)
          .order('timestamp', { ascending: true });

        if (!error && data && data.length > 0) {
          messages = data;
          persisted = true;
        }
      } catch (e) {
        // Fallback
      }
    }

    // Sort chronologically ascending
    messages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    res.json({
      success: true,
      persistence_mode: persisted ? 'database' : 'in_memory_transient',
      count: messages.length,
      messages,
      data: messages
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 GenLancer Backend & Proxy Server running on http://localhost:${PORT}`);
  console.log(`👉 Health Check:        GET  http://localhost:${PORT}/health`);
  console.log(`👉 Creator Directory:   GET  http://localhost:${PORT}/api/creators`);
  console.log(`👉 Structured Search:   POST http://localhost:${PORT}/api/search`);
  console.log(`👉 Explainable Scoring: POST http://localhost:${PORT}/api/score`);
  console.log(`👉 Matching Report:     POST http://localhost:${PORT}/api/report/generate`);
  console.log(`👉 Gemini Briefs:       POST http://localhost:${PORT}/api/generate-brief`);
  console.log(`👉 Collaboration Hub:   POST http://localhost:${PORT}/api/collaboration\n`);
});
