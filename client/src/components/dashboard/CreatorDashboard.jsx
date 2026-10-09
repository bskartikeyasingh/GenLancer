import React, { useState, useEffect } from 'react';
import { 
  LayoutGrid, 
  FileText, 
  MessageSquare, 
  Briefcase, 
  Settings, 
  Bell, 
  HelpCircle, 
  Sparkles, 
  CheckCircle2, 
  Send, 
  Clock, 
  DollarSign, 
  Ratio, 
  Zap,
  Building,
  UserCheck,
  Plus,
  X,
  UploadCloud,
  Edit2,
  LogOut,
  ChevronRight,
  Award,
  Video,
  Loader2
} from 'lucide-react';
import GenLancerLogo from '../auth/GenLancerLogo';
import { supabase } from '../../lib/supabase';
import { sendChatMessage, fetchChatMessages } from '../../lib/chatService';
import PromptInspectorModal from '../common/PromptInspectorModal';
import ChatLockoutOverlay from '../common/ChatLockoutOverlay';
import VerificationBadge, { VerifiedWorkflowBadge, CertifiedPipelineBadge, AICreatorScoreBadge } from '../common/VerificationBadge';
import ClarificationModal from '../common/ClarificationModal';
import BriefVersionBadge from '../common/BriefVersionBadge';

export default function CreatorDashboard({ onLogout, onSwitchToCompany }) {
  const [activeTab, setActiveTab] = useState('portfolio'); // 'portfolio' | 'requests' | 'messages' | 'work'
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditScore, setAuditScore] = useState(94);
  const [auditNotification, setAuditNotification] = useState(null);
  const [selectedAssetForInspect, setSelectedAssetForInspect] = useState(null);

  // Settings Modal State
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Upload Work Modal State
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Clarification Modal State
  const [clarifyModalReq, setClarifyModalReq] = useState(null);
  const [clarifyText, setClarifyText] = useState('');
  const [isSubmittingClarify, setIsSubmittingClarify] = useState(false);

  // Creator Info State (Editable via Settings)
  const [creator, setCreator] = useState({
    name: "Alex Smith",
    title: "AI Film Director & Creative Technologist",
    currentCompany: "Nexus Synthetic Media Studio",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300"
  });

  const [editForm, setEditForm] = useState({ ...creator });

  // Portfolio Items State
  const [portfolioItems, setPortfolioItems] = useState([
    {
      id: "p1",
      title: "Neon Monolith - Cyberpunk Commercial",
      mediaUrl: "https://assets.mixkit.co/videos/preview/mixkit-cyberpunk-neon-city-street-41804-large.mp4",
      tool: "Runway Gen-3 Alpha",
      aspectRatio: "16:9",
      pipeline: "Midjourney v6 ➔ Runway Gen-3 ➔ Topaz 4K",
      prompt: "/imagine prompt: futuristic mega-city at night, neon reflections in rainwater, anamorphic cinematic 8k --ar 16:9",
      seed: "482019482",
      verified: true
    },
    {
      id: "p2",
      title: "Biomechanical Android Concept",
      mediaUrl: "https://assets.mixkit.co/videos/preview/mixkit-hand-holding-a-glowing-futuristic-device-41805-large.mp4",
      tool: "Flux.1 Dev + ComfyUI",
      aspectRatio: "1:1",
      pipeline: "Flux.1 ➔ ControlNet Depth ➔ Blender Compositor",
      prompt: "close-up portrait of android with exposed copper neural cables, volumetric amber lighting, macro photography",
      seed: "99102412",
      verified: true
    }
  ]);

  // New Work Form State
  const [newWork, setNewWork] = useState({
    title: '',
    mediaUrl: '',
    tool: 'Runway Gen-3 Alpha',
    aspectRatio: '16:9',
    pipeline: '',
    prompt: '',
    seed: ''
  });

  // Default mock requests for offline resilience
  const DEFAULT_REQUESTS = [
    {
      id: "req-1",
      request_id: "req-1",
      company: "Volt Energy Co.",
      campaignTitle: "Cyberpunk Beverage Ad Campaign",
      budget: "$4,500",
      deadline: "Nov 15, 2026",
      aspectRatio: "9:16 (TikTok & Reels)",
      style: "High-octane cyberpunk with hyper-realistic liquid simulations",
      status: "pending"
    },
    {
      id: "req-2",
      request_id: "req-2",
      company: "Aura Skincare",
      campaignTitle: "Organic Botanical AI Render Series",
      budget: "$2,200",
      deadline: "Nov 22, 2026",
      aspectRatio: "4:5 (Instagram)",
      style: "Soft luxury lighting, pastel botanicals, minimalist studio",
      status: "pending"
    }
  ];

  // Incoming Requests from Brands (Live Supabase State)
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(true);

  // Fetch Live Briefs from Supabase collaboration_requests with Polling
  useEffect(() => {
    let isMounted = true;

    async function fetchRequests() {
      try {
        // Query collaboration_requests ordered by newest first
        const { data, error } = await supabase
          .from('collaboration_requests')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.warn('Error fetching collaboration requests from Supabase:', error.message);
          if (isMounted) {
            setIncomingRequests(prev => prev.length > 0 ? prev : DEFAULT_REQUESTS);
          }
          return;
        }

        if (data && data.length > 0) {
          // Fetch incoming briefs for freelancer_id = 'FL001'
          const targeted = data.filter(r => !r.freelancer_id || r.freelancer_id === 'FL001' || r.freelancer_id === 'c1' || r.freelancer_id === 'alex-smith');
          const pending = targeted.filter(r => r.status === 'pending');
          const targetRows = pending.length > 0 ? pending : (targeted.length > 0 ? targeted : data);

          const formatted = targetRows.map((row, idx) => {
            const brief = row.project_brief || {};
            const campaignTitle = 
              brief.title || 
              brief.project_name || 
              (Array.isArray(brief.brandNameSuggestions) && brief.brandNameSuggestions[0]?.name ? `${brief.brandNameSuggestions[0].name} Campaign` : null) || 
              `Campaign Brief #${row.request_id ? row.request_id.slice(0, 8) : idx + 1}`;

            const company = row.company_id === 'COMP001' ? 'Apex Creative Agency' : (row.company_id || 'Brand Partner');
            const budget = brief.budget || (typeof brief.budgetTier === 'string' ? brief.budgetTier : '$4,500');
            const deadline = brief.deadline || 'Dec 1, 2026';
            const aspectRatio = brief.aspectRatio || brief.targetAspect || '16:9';
            const style = brief.style || (brief.visualIdentity && brief.visualIdentity.designAesthetic) || 'Cinematic Generative AI Production';

            return {
              id: row.id || row.request_id || `req-${idx}`,
              request_id: row.request_id,
              company,
              campaignTitle,
              budget,
              deadline,
              aspectRatio,
              style,
              status: row.status || 'pending',
              brief_version: row.brief_version || 1,
              clarification_history: row.clarification_history || [],
              project_brief: brief,
              raw: row
            };
          });

          if (isMounted) {
            setIncomingRequests(formatted);
          }
        } else {
          // Table empty, try backend API
          try {
            const apiRes = await fetch('http://localhost:3001/api/collaboration/freelancer/c1');
            if (apiRes.ok) {
              const apiData = await apiRes.json();
              if (apiData.requests && apiData.requests.length > 0 && isMounted) {
                setIncomingRequests(apiData.requests.map((r, idx) => ({
                  id: r.request_id || `req-${idx}`,
                  request_id: r.request_id,
                  company: r.company_id === 'COMP001' ? 'Apex Creative Agency' : (r.company_id || 'Brand Partner'),
                  campaignTitle: r.project_brief?.title || `Campaign #${idx + 1}`,
                  budget: r.project_brief?.budget || '$4,500',
                  deadline: r.project_brief?.deadline || 'Dec 1, 2026',
                  aspectRatio: r.project_brief?.aspectRatio || '16:9',
                  style: r.project_brief?.style || 'Cinematic Generative Production',
                  status: r.status || 'pending',
                  brief_version: r.brief_version || 1,
                  clarification_history: r.clarification_history || [],
                  project_brief: r.project_brief || {},
                  raw: r
                })));
                return;
              }
            }
          } catch (_) {}
          if (isMounted) {
            setIncomingRequests(prev => prev.length > 0 ? prev : DEFAULT_REQUESTS);
          }
        }
      } catch (err) {
        console.error('Failed to query collaboration_requests:', err);
        if (isMounted) {
          setIncomingRequests(prev => prev.length > 0 ? prev : DEFAULT_REQUESTS);
        }
      } finally {
        if (isMounted) setLoadingRequests(false);
      }
    }

    // Initial fetch on mount
    fetchRequests();

    // 3-second polling interval for real-time live demo updates
    const pollInterval = setInterval(() => {
      fetchRequests();
    }, 3000);

    return () => {
      isMounted = false;
      clearInterval(pollInterval);
    };
  }, []);

  // Companies with ACCEPTED Briefs (Only these show in Communications)
  const [acceptedCompanies, setAcceptedCompanies] = useState([
    {
      id: "comp-1",
      name: "Volt Energy Co.",
      campaign: "Cyberpunk Beverage Ad",
      avatar: "⚡",
      status: "confirmed",
      unread: true,
      messages: [
        { id: 1, sender: 'brand', author: 'Marcus (Volt Energy)', text: 'Hi Alex! We reviewed your Runway Gen-3 reel. Can you deliver the 16:9 cut by Friday?', time: '10:45 AM' },
        { id: 2, sender: 'creator', author: 'Alex Smith', text: 'Hey Marcus! Yes, the prompt pipeline is cached. First delivery in 48 hours.', time: '11:12 AM' }
      ]
    },
    {
      id: "comp-2",
      name: "Nike Digital",
      campaign: "3D Generative Product Animation",
      avatar: "✔️",
      status: "accepted",
      unread: false,
      messages: [
        { id: 1, sender: 'brand', author: 'Elena (Nike)', text: 'The Blender + Topaz renders look exceptional. Final approval granted!', time: 'Yesterday' },
        { id: 2, sender: 'creator', author: 'Alex Smith', text: 'Thanks Elena! Full commercial master files uploaded to the drive.', time: 'Yesterday' }
      ]
    },
    {
      id: "comp-3",
      name: "Prada Future",
      campaign: "Hyper-Real Luxury Commercial",
      avatar: "💎",
      status: "pending",
      unread: false,
      messages: [
        { id: 1, sender: 'brand', author: 'Prada Creative', text: 'We have dispatched our creative brief and escrow deposit for your review.', time: 'Yesterday' }
      ]
    }
  ]);

  const [activeCompanyId, setActiveCompanyId] = useState("comp-1");
  const [chatInput, setChatInput] = useState('');

  // Handle Accept Brief
  const handleAcceptBrief = async (req) => {
    const compName = req.company || req.name;

    // Check if company already in accepted
    if (!acceptedCompanies.some(c => c.name === compName || c.id === req.id)) {
      const newAccepted = {
        id: req.id || `comp-${Date.now()}`,
        name: compName,
        campaign: req.campaignTitle || req.campaign,
        avatar: "🏢",
        status: "accepted",
        unread: false,
        messages: [
          { id: 1, sender: 'brand', author: compName, text: `Thank you for accepting the brief for ${req.campaignTitle || req.campaign}! Let's finalize the deliverables here.`, time: 'Just now' }
        ]
      };
      setAcceptedCompanies(prev => [newAccepted, ...prev]);
      setActiveCompanyId(newAccepted.id);
    } else {
      setAcceptedCompanies(prev => prev.map(c => 
        (c.name === compName || c.id === req.id) ? { ...c, status: 'accepted' } : c
      ));
    }

    // Update status in Supabase and Backend Collaboration Service
    try {
      if (req.request_id) {
        // Backend API
        await fetch(`http://localhost:3001/api/collaboration/${req.request_id}/accept`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ actor: 'freelancer' })
        }).catch(() => {});

        // Direct Supabase
        await supabase
          .from('collaboration_requests')
          .update({ 
            status: 'accepted',
            audit_history: [
              ...(req.raw?.audit_history || []),
              { action: 'accepted', by: 'FL001', timestamp: new Date().toISOString() }
            ]
          })
          .match({ request_id: req.request_id });
      }
    } catch (err) {
      console.warn('Could not update brief status:', err);
    }

    // Update status locally to accepted
    setIncomingRequests(prev => prev.map(r => (r.id === req.id || r.request_id === req.request_id) ? { ...r, status: 'accepted' } : r));
    setActiveTab('messages');
  };

  // Handle Decline / Reject Brief
  const handleRejectBrief = async (req) => {
    try {
      if (req.request_id) {
        await fetch(`http://localhost:3001/api/collaboration/${req.request_id}/reject`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ actor: 'freelancer', reason: 'Capacity constraints' })
        }).catch(() => {});

        await supabase
          .from('collaboration_requests')
          .update({ status: 'rejected' })
          .match({ request_id: req.request_id });
      }
    } catch (_) {}

    setIncomingRequests(prev => prev.filter(r => r.id !== req.id && r.request_id !== req.request_id));
  };

  // Submit Clarification Question
  const handleSubmitClarification = async (questions) => {
    if (!questions || !clarifyModalReq) return;
    const currentFreelancerId = 'FL001';

    try {
      const reqId = clarifyModalReq.request_id || clarifyModalReq.id;
      if (reqId) {
        await fetch(`http://localhost:3001/api/collaboration/${reqId}/clarify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            questions: questions.trim(), 
            message: questions.trim(), 
            actor: 'freelancer',
            actor_id: currentFreelancerId 
          })
        });
      }

      setIncomingRequests(prev => prev.map(r => {
        if (r.id === clarifyModalReq.id || r.request_id === clarifyModalReq.request_id) {
          const history = Array.isArray(r.clarification_history) ? [...r.clarification_history] : [];
          history.push({
            sender: 'freelancer',
            content: questions.trim(),
            timestamp: new Date().toISOString()
          });
          return {
            ...r,
            status: 'clarification_requested',
            clarification_history: history
          };
        }
        return r;
      }));

      setClarifyModalReq(null);
    } catch (err) {
      console.error('Failed to submit clarification:', err);
      throw err;
    }
  };

  // Handle Mutual Confirmation
  const handleConfirmBrief = async (req) => {
    try {
      if (req.request_id) {
        const res = await fetch(`http://localhost:3001/api/collaboration/${req.request_id}/confirm`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ actor: 'freelancer', brief_version: req.brief_version || 1 })
        });
        const data = await res.json();
        if (data.request) {
          setIncomingRequests(prev => prev.map(r => (r.id === req.id || r.request_id === req.request_id) ? { ...r, status: data.request.status } : r));
          return;
        }
      }
    } catch (_) {}

    setIncomingRequests(prev => prev.map(r => (r.id === req.id || r.request_id === req.request_id) ? { ...r, status: 'confirmed' } : r));
  };

  // Handle Settings Save
  const handleSaveSettings = (e) => {
    e.preventDefault();
    setCreator({ ...editForm });
    setShowSettingsModal(false);
  };

  // Handle New Work Upload
  const handleAddWork = (e) => {
    e.preventDefault();
    if (!newWork.title || !newWork.prompt) return;
    const item = {
      id: `p-${Date.now()}`,
      title: newWork.title,
      mediaUrl: newWork.mediaUrl || "https://assets.mixkit.co/videos/preview/mixkit-cyberpunk-neon-city-street-41804-large.mp4",
      tool: newWork.tool,
      aspectRatio: newWork.aspectRatio,
      pipeline: newWork.pipeline || `${newWork.tool} ➔ Upscaler`,
      prompt: newWork.prompt,
      seed: newWork.seed || Math.floor(100000000 + Math.random() * 900000000).toString(),
      verified: true
    };
    setPortfolioItems(prev => [item, ...prev]);
    setAuditScore(prev => Math.min(100, prev + 2));
    setShowUploadModal(false);
    setNewWork({
      title: '',
      mediaUrl: '',
      tool: 'Runway Gen-3 Alpha',
      aspectRatio: '16:9',
      pipeline: '',
      prompt: '',
      seed: ''
    });
  };

  // Run AI Portfolio Audit
  const runAIAudit = () => {
    setIsAuditing(true);
    setTimeout(() => {
      setIsAuditing(false);
      setAuditScore(98);
      setAuditNotification({
        title: "AI Portfolio Audit Completed!",
        score: "98/100",
        details: [
          "Prompt Complexity: 99/100",
          "Model Pipeline Diversity: 97/100",
          "Commercial Fidelity: 98/100"
        ]
      });
      setTimeout(() => setAuditNotification(null), 6000);
    }, 1000);
  };

  const activeCompany = acceptedCompanies.find(c => c.id === activeCompanyId) || acceptedCompanies[0];

  // Active conversation requestId for Supabase sync
  const activeRequestId = activeCompany?.id === 'comp-1'
    ? 'REQ-DEMO-001'
    : activeCompany?.id === 'comp-2'
      ? 'REQ-DEMO-002'
      : (activeCompany?.requestId || `REQ-${activeCompany?.id || 'DEMO'}`);

  // Live Supabase Chat State
  const [chatMessages, setChatMessages] = useState([]);

  // Fetch live chat messages from Supabase with 2-second interval polling
  useEffect(() => {
    let isMounted = true;

    async function loadLiveMessages() {
      if (!activeRequestId) return;
      const msgs = await fetchChatMessages(activeRequestId);
      if (isMounted && msgs && msgs.length > 0) {
        setChatMessages(msgs);
      }
    }

    loadLiveMessages();

    // 2-second interval live polling
    const pollInterval = setInterval(() => {
      loadLiveMessages();
    }, 2000);

    return () => {
      isMounted = false;
      clearInterval(pollInterval);
    };
  }, [activeRequestId]);

  // Handle Send Chat (Sends to Supabase public.messages)
  const handleSendMessage = async (e) => {
    e.preventDefault();
    const text = chatInput.trim();
    if (!text) return;

    setChatInput('');

    // Optimistically update local thread state
    const localMsg = {
      id: Date.now(),
      sender: 'creator',
      author: creator.name,
      text: text,
      time: 'Just now'
    };

    setAcceptedCompanies(prev => prev.map(comp => {
      if (comp.id === activeCompanyId) {
        return {
          ...comp,
          messages: [
            ...(comp.messages || []),
            localMsg
          ]
        };
      }
      return comp;
    }));

    // Perform Supabase messages table insert
    const result = await sendChatMessage(activeRequestId, 'FL001', 'freelancer', text);
    if (result?.success) {
      const fresh = await fetchChatMessages(activeRequestId);
      if (fresh && fresh.length > 0) {
        setChatMessages(fresh);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 flex items-center justify-center text-slate-900 relative">
      {/* Background dot grid pattern */}
      <div className="fixed inset-0 bg-[radial-gradient(#CBD5E1_1.2px,transparent_1.2px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

      {/* Main App Container */}
      <div className="relative w-full max-w-7xl bg-white border border-slate-200/90 rounded-[28px] shadow-[0_20px_50px_rgba(15,23,42,0.06)] overflow-hidden flex flex-col md:flex-row min-h-[780px] z-10">

        {/* ================= LEFT SIDEBAR ================= */}
        <aside className="w-full md:w-72 bg-gradient-to-b from-white to-slate-50 border-r border-slate-200/80 p-6 flex flex-col justify-between shrink-0">
          <div>
            {/* Logo */}
            <div className="mb-6 pb-4 border-b border-slate-100 flex items-center justify-between">
              <GenLancerLogo className="w-9 h-9" textColor="text-slate-900" />
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-orange-100 text-[#FF6B00]">
                Creator v1.0
              </span>
            </div>

            {/* Profile Card */}
            <div className="text-center pb-6 border-b border-slate-100 relative">
              <div className="relative inline-block mx-auto mb-3">
                <img 
                  src={creator.avatar} 
                  alt={creator.name} 
                  className="w-20 h-20 rounded-full object-cover border-2 border-[#FF6B00] shadow-md p-0.5 bg-white"
                />
                <button 
                  onClick={() => { setEditForm({ ...creator }); setShowSettingsModal(true); }}
                  className="absolute bottom-0 right-0 bg-slate-900 hover:bg-[#FF6B00] text-white p-1.5 rounded-full shadow transition-colors cursor-pointer"
                  title="Edit Profile"
                >
                  <Edit2 className="w-3 h-3" />
                </button>
              </div>

              <h2 className="text-base font-extrabold text-slate-900 leading-tight">
                {creator.name}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">{creator.title}</p>

              {/* Verified Trust Badges */}
              <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5">
                <VerificationBadge type="workflow" size="sm" />
                <VerificationBadge type="score" score={auditScore || 96} size="sm" />
                <VerificationBadge type="certified_pipeline" size="sm" />
              </div>

              {/* Status Pill */}
              <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 text-white text-[11px] font-medium shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Open for Contracts</span>
              </div>

              {/* Current Company Affiliation */}
              <div className="mt-3 flex items-center justify-center gap-1 text-[11px] text-slate-600 bg-orange-50/70 py-1.5 px-2 rounded-lg border border-orange-100">
                <Building className="w-3 h-3 text-[#FF6B00]" />
                <span className="truncate font-medium">{creator.currentCompany}</span>
              </div>

              {/* Utility Icons */}
              <div className="flex items-center justify-center gap-4 mt-4 text-slate-400">
                <button 
                  onClick={() => { setEditForm({ ...creator }); setShowSettingsModal(true); }}
                  title="Profile & Account Settings" 
                  className="hover:text-slate-700 transition-colors cursor-pointer p-1 rounded-md hover:bg-slate-100"
                >
                  <Settings className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setActiveTab('requests')}
                  title="Notifications" 
                  className="relative hover:text-slate-700 transition-colors cursor-pointer p-1 rounded-md hover:bg-slate-100"
                >
                  <Bell className="w-4 h-4" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#FF6B00] rounded-full" />
                </button>
                <button 
                  onClick={() => alert("GenLancer Creator Hub v1.4 Documentation")}
                  title="Help & Docs" 
                  className="hover:text-slate-700 transition-colors cursor-pointer p-1 rounded-md hover:bg-slate-100"
                >
                  <HelpCircle className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Nav Menu */}
            <nav className="mt-6 space-y-1.5">
              <button
                onClick={() => setActiveTab('portfolio')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'portfolio' ? 'bg-[#FF6B00] text-white shadow-md shadow-orange-500/20' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <LayoutGrid className="w-4 h-4" />
                  <span>AI Portfolio</span>
                </div>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${activeTab === 'portfolio' ? 'bg-orange-600 text-white' : 'bg-slate-200 text-slate-700'}`}>
                  {portfolioItems.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('requests')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'requests' ? 'bg-[#FF6B00] text-white shadow-md shadow-orange-500/20' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4" />
                  <span>Brand Requests</span>
                </div>
                {incomingRequests.length > 0 && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-amber-500 text-white font-bold">
                    {incomingRequests.length} New
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('messages')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'messages' ? 'bg-[#FF6B00] text-white shadow-md shadow-orange-500/20' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <MessageSquare className="w-4 h-4" />
                  <span>Communication</span>
                </div>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-slate-200 text-slate-700">
                  {acceptedCompanies.length} Active
                </span>
              </button>

              <button
                onClick={() => setActiveTab('work')}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'work' ? 'bg-[#FF6B00] text-white shadow-md shadow-orange-500/20' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Briefcase className="w-4 h-4" />
                <span>Work History & Studio</span>
              </button>
            </nav>
          </div>

          {/* Footer Navigation & Logout */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            {onSwitchToCompany && (
              <button
                onClick={onSwitchToCompany}
                className="w-full text-center text-xs text-slate-700 hover:text-[#FF6B00] bg-slate-100 hover:bg-orange-50 py-2 px-3 rounded-xl transition-all cursor-pointer font-bold flex items-center justify-center gap-1 border border-slate-200/60"
              >
                <span>Switch to Brand Hub</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#FF6B00]" />
              </button>
            )}
            <button
              onClick={onLogout}
              className="w-full text-center text-xs text-slate-400 hover:text-rose-600 transition-colors cursor-pointer py-1.5 flex items-center justify-center gap-1.5 font-medium"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out of GenLancer</span>
            </button>
          </div>
        </aside>

        {/* ================= RIGHT MAIN PANEL ================= */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto bg-white flex flex-col justify-between">

          {/* TAB 1: AI PORTFOLIO */}
          {activeTab === 'portfolio' && (
            <div>
              {/* Audit Success Banner */}
              {auditNotification && (
                <div className="mb-6 p-4 rounded-2xl bg-orange-50 border border-orange-200 text-slate-900 shadow-sm animate-fade-in flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#FF6B00] text-white flex items-center justify-center shrink-0 shadow-sm">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{auditNotification.title}</h4>
                      <p className="text-xs text-slate-600">{auditNotification.details.join(' • ')}</p>
                    </div>
                  </div>
                  <div className="px-3 py-1 bg-white rounded-xl border border-orange-200 font-extrabold text-[#FF6B00] text-sm self-start sm:self-auto">
                    Score: {auditNotification.score}
                  </div>
                </div>
              )}

              {/* Header with AI Audit Banner */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                      AI Portfolio & Workflow Proof
                    </h1>
                    <VerificationBadge type="workflow" size="sm" />
                    <VerificationBadge type="score" score={auditScore || 96} size="sm" />
                    <VerificationBadge type="certified_pipeline" size="sm" />
                  </div>
                  <p className="text-xs text-slate-500">
                    Upload generations with prompts, seeds, and models to pass automated AI scoring.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowUploadModal(true)}
                    className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2 px-3.5 rounded-xl shadow-sm transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#FF6B00]" />
                    <span>Upload Work</span>
                  </button>

                  <div className="flex items-center gap-3 bg-gradient-to-r from-orange-50 via-white to-orange-50 p-2 px-3.5 rounded-2xl border border-orange-200">
                    <AICreatorScoreBadge score={auditScore} />
                    <button
                      onClick={runAIAudit}
                      disabled={isAuditing}
                      className="flex items-center gap-1.5 bg-[#FF6B00] hover:bg-[#E05E00] active:bg-[#c2410c] text-white text-xs font-bold py-1.5 px-3 rounded-xl shadow-sm transition-all cursor-pointer disabled:opacity-60"
                    >
                      <Sparkles className={`w-3.5 h-3.5 ${isAuditing ? 'animate-spin' : ''}`} />
                      <span>{isAuditing ? 'Auditing...' : 'Run AI Audit'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Portfolio Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {portfolioItems.map((item) => (
                  <div key={item.id} className="bg-slate-50 rounded-2xl border border-slate-200/80 overflow-hidden hover:border-orange-300 transition-all shadow-sm flex flex-col justify-between">
                    <div className="aspect-video bg-slate-900 relative group overflow-hidden">
                      <video 
                        src={item.mediaUrl} 
                        autoPlay 
                        loop 
                        muted 
                        playsInline 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-semibold text-white flex items-center gap-1.5">
                        <Zap className="w-3 h-3 text-[#FF6B00]" />
                        <span>{item.tool}</span>
                      </div>
                      <div className="absolute top-3 right-3 flex items-center gap-1.5 flex-wrap">
                        <VerificationBadge type="workflow" size="sm" className="bg-black/70 text-emerald-300 border-emerald-500/40 backdrop-blur-md" />
                        <VerificationBadge type="certified_pipeline" size="sm" className="bg-black/70 text-blue-300 border-blue-500/40 backdrop-blur-md" />
                      </div>
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm mb-1">{item.title}</h3>
                        <p className="text-[11px] font-mono text-slate-500 bg-white p-2.5 rounded-xl border border-slate-200/70 mb-3 line-clamp-2 leading-relaxed">
                          <span className="text-[#FF6B00] font-bold">Prompt: </span>
                          {item.prompt}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 border-t border-slate-200/60 pt-3">
                        <div>
                          <span className="text-slate-400 block text-[10px] font-semibold uppercase">Pipeline:</span>
                          <span className="font-semibold text-slate-800">{item.pipeline}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px] font-semibold uppercase">Seed & Ratio:</span>
                          <span className="font-mono text-slate-700">{item.seed} | {item.aspectRatio}</span>
                        </div>
                      </div>

                      <div className="pt-3 mt-3 border-t border-slate-200/60 flex items-center justify-between">
                        <button
                          onClick={() => setSelectedAssetForInspect(item)}
                          className="text-xs text-[#FF6B00] flex items-center gap-1 font-semibold hover:underline cursor-pointer"
                        >
                          🔍 Inspect Prompt & Seed
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: BRAND REQUESTS */}
          {activeTab === 'requests' && (
            <div>
              <div className="pb-6 mb-6 border-b border-slate-100">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                  Incoming Brand Briefs
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                  Accept briefs to start live communication and contract milestones with companies.
                </p>
              </div>

              {loadingRequests && incomingRequests.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col items-center justify-center">
                  <Loader2 className="w-8 h-8 text-[#FF6B00] animate-spin mb-3" />
                  <p className="text-xs font-bold text-slate-800">Checking Supabase for Live Brand Briefs...</p>
                  <p className="text-[11px] text-slate-400 mt-1">Polling collaboration_requests feed every 2.5s</p>
                </div>
              ) : incomingRequests.length === 0 ? (
                <div className="text-center py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                  <p className="text-sm font-bold text-slate-700">All brand briefs have been reviewed and accepted!</p>
                  <button 
                    onClick={() => setActiveTab('messages')}
                    className="mt-3 text-xs text-[#FF6B00] font-bold hover:underline cursor-pointer inline-flex items-center gap-1"
                  >
                    <span>Go to Accepted Communications</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {incomingRequests.map((req) => (
                    <div key={req.id} className="p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-orange-300 transition-all flex flex-col md:flex-row md:items-start justify-between gap-4 shadow-xs">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold text-[#FF6B00] bg-orange-100/70 px-2.5 py-0.5 rounded-full">
                            {req.company}
                          </span>
                          <BriefVersionBadge 
                            version={req.brief_version || 1}
                            revisionCount={Array.isArray(req.clarification_history) ? req.clarification_history.length + 1 : (req.raw?.revision_history?.length || 1)}
                            status={req.status || 'pending'}
                          />
                          {req.request_id && (
                            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              Live Sync
                            </span>
                          )}
                        </div>
                        <h3 className="font-extrabold text-base text-slate-900">{req.campaignTitle}</h3>
                        <p className="text-xs text-slate-600 max-w-xl">
                          <span className="font-semibold text-slate-800">Style Requirement: </span>{req.style}
                        </p>
                        {req.project_brief?.targetAudience && (
                          <p className="text-[11px] text-slate-500 max-w-xl">
                            <span className="font-semibold text-slate-700">Target Audience: </span>
                            {typeof req.project_brief.targetAudience === 'object' 
                              ? (req.project_brief.targetAudience.primaryAudience || JSON.stringify(req.project_brief.targetAudience))
                              : req.project_brief.targetAudience}
                          </p>
                        )}
                        <div className="flex flex-wrap gap-3 text-[11px] text-slate-500 pt-1">
                          <span className="flex items-center gap-1 font-bold text-slate-800 bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-md border border-emerald-200/60">
                            <DollarSign className="w-3.5 h-3.5 text-emerald-600" /> {req.budget}
                          </span>
                          <span className="flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200">
                            <Clock className="w-3.5 h-3.5 text-slate-400" /> Timeline: {req.deadline}
                          </span>
                          <span className="flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200">
                            <Ratio className="w-3.5 h-3.5 text-slate-400" /> {req.aspectRatio}
                          </span>
                        </div>

                        {/* Clarification History Thread */}
                        {Array.isArray(req.clarification_history) && req.clarification_history.length > 0 && (
                          <div className="mt-3 p-3 bg-purple-50/60 border border-purple-200 rounded-xl space-y-1.5 text-xs">
                            <span className="text-[10px] uppercase font-bold text-purple-700 block tracking-wider">
                              Clarification History ({req.clarification_history.length}):
                            </span>
                            {req.clarification_history.map((c, i) => (
                              <div key={i} className="flex items-start gap-2 text-[11px]">
                                <span className="font-bold text-slate-900 capitalize shrink-0">{c.sender}:</span>
                                <span className="text-slate-700">{c.content}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Interactive Actions per Collaboration Lifecycle State */}
                      <div className="flex md:flex-col gap-2 shrink-0">
                        {(!req.status || req.status === 'pending' || req.status === 'clarification_requested') && (
                          <>
                            <button 
                              onClick={() => handleAcceptBrief(req)}
                              className="px-4 py-2 bg-[#FF6B00] hover:bg-[#E05E00] text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Accept Scope</span>
                            </button>
                            <button 
                              onClick={() => setClarifyModalReq(req)}
                              className="px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                            >
                              <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                              <span>Request Clarification</span>
                            </button>
                            <button 
                              onClick={() => handleRejectBrief(req)}
                              className="px-4 py-1.5 bg-white hover:bg-slate-100 text-slate-500 border border-slate-200 text-xs font-medium rounded-xl transition-all cursor-pointer"
                            >
                              Decline Offer
                            </button>
                          </>
                        )}

                        {req.status === 'accepted' && (
                          <>
                            <button 
                              onClick={() => handleConfirmBrief(req)}
                              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Confirm Terms & Lock</span>
                            </button>
                            <button 
                              onClick={() => setActiveTab('messages')}
                              className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                              <span>Open Chat</span>
                            </button>
                          </>
                        )}

                        {req.status === 'confirmed' && (
                          <button 
                            onClick={() => setActiveTab('messages')}
                            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <MessageSquare className="w-3.5 h-3.5 text-[#FF6B00]" />
                            <span>Active Project Room</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: COMMUNICATION (Accepted Companies Only) */}
          {activeTab === 'messages' && (
            <div className="flex-1 flex flex-col h-full min-h-[500px]">
              <div className="pb-4 mb-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-black text-slate-900 tracking-tight">
                    Client Communications
                  </h1>
                  <p className="text-xs text-slate-500">Showing only verified companies with accepted contracts.</p>
                </div>
                <div className="text-[11px] text-slate-600 bg-slate-100 px-3 py-1 rounded-full font-semibold">
                  {acceptedCompanies.length} Active Workspaces
                </div>
              </div>

              {/* 2-Column Chat Layout */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 border border-slate-200/80 rounded-2xl overflow-hidden bg-slate-50/50 min-h-[460px]">
                {/* Left: Accepted Company List */}
                <div className="border-r border-slate-200/80 bg-white p-3 space-y-1.5 overflow-y-auto">
                  <span className="text-[10px] font-bold uppercase text-slate-400 px-2 block mb-2">Accepted Companies</span>
                  {acceptedCompanies.map(comp => (
                    <button
                      key={comp.id}
                      onClick={() => setActiveCompanyId(comp.id)}
                      className={`w-full text-left p-3 rounded-xl transition-all cursor-pointer flex items-center gap-3 ${
                        comp.id === activeCompanyId 
                          ? 'bg-orange-50 border border-orange-200 shadow-sm' 
                          : 'hover:bg-slate-50 border border-transparent'
                      }`}
                    >
                      <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
                        {comp.avatar}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-xs text-slate-900 truncate">{comp.name}</h4>
                          {comp.unread && <span className="w-2 h-2 rounded-full bg-[#FF6B00]" />}
                        </div>
                        <p className="text-[11px] text-slate-500 truncate">{comp.campaign}</p>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Right: Live Thread with Selected Company */}
                <div className="relative md:col-span-2 p-4 flex flex-col justify-between bg-slate-50 min-h-[420px]">
                  {activeCompany ? (
                    <>
                      {/* Accepted-Only Communication Lockout Overlay */}
                      <ChatLockoutOverlay
                        status={activeCompany.status || 'accepted'}
                        role="creator"
                        campaignTitle={activeCompany.campaign}
                        onTriggerAction={() => handleAcceptBrief(activeCompany)}
                      />

                      <div className="pb-3 mb-3 border-b border-slate-200/80 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                            {activeCompany.avatar}
                          </div>
                          <div>
                            <h3 className="font-extrabold text-xs text-slate-900">{activeCompany.name}</h3>
                            <p className="text-[10px] text-slate-500">{activeCompany.campaign}</p>
                          </div>
                        </div>
                        <div className={`text-[10px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5 ${
                          (activeCompany.status === 'accepted' || activeCompany.status === 'confirmed')
                            ? 'text-emerald-600 bg-emerald-50 border border-emerald-100'
                            : 'text-amber-700 bg-amber-50 border border-amber-200'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            (activeCompany.status === 'accepted' || activeCompany.status === 'confirmed')
                              ? 'bg-emerald-500 animate-pulse'
                              : 'bg-amber-500'
                          }`} />
                          <span>
                            {(activeCompany.status === 'accepted' || activeCompany.status === 'confirmed')
                              ? 'Active Thread'
                              : 'Pending Scope Acceptance'}
                          </span>
                        </div>
                      </div>

                      {/* Messages Stream */}
                      <div className="flex-1 space-y-3 overflow-y-auto max-h-[320px] p-2">
                        {(chatMessages.length > 0
                          ? chatMessages.map((m) => ({
                              id: m.message_id || m.id,
                              sender: m.sender_role === 'freelancer' ? 'creator' : 'brand',
                              author: m.sender_role === 'freelancer' ? creator.name : (activeCompany?.name || 'Brand Partner'),
                              text: m.text_content || m.content || m.text,
                              time: m.timestamp ? new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'
                            }))
                          : (activeCompany?.messages || [])
                        ).map((m) => (
                          <div key={m.id} className={`flex flex-col ${m.sender === 'creator' ? 'items-end' : 'items-start'}`}>
                            <span className="text-[10px] text-slate-400 font-medium mb-1">{m.author} • {m.time}</span>
                            <div className={`p-3 rounded-2xl text-xs max-w-md ${
                              m.sender === 'creator' 
                                ? 'bg-[#FF6B00] text-white rounded-tr-none shadow-sm' 
                                : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none shadow-sm'
                            }`}>
                              {m.text}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Send Box */}
                      <form onSubmit={handleSendMessage} className="mt-3 flex gap-2 pt-2 border-t border-slate-200/80">
                        <input 
                          type="text"
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          disabled={activeCompany.status !== 'accepted' && activeCompany.status !== 'confirmed'}
                          placeholder={
                            (activeCompany.status !== 'accepted' && activeCompany.status !== 'confirmed')
                              ? "Chat is locked until proposal is accepted"
                              : `Message ${activeCompany.name}...`
                          }
                          className="flex-1 bg-white border border-slate-200 focus:border-[#FF6B00] focus:ring-2 focus:ring-orange-500/20 rounded-xl px-4 py-2.5 text-xs text-slate-900 outline-none transition-all disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed"
                        />
                        <button
                          type="submit"
                          disabled={activeCompany.status !== 'accepted' && activeCompany.status !== 'confirmed'}
                          className="bg-[#FF6B00] hover:bg-[#E05E00] text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Send</span>
                        </button>
                      </form>
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-full text-slate-400 text-xs">
                      Select a company workspace to start chatting.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: WORK HISTORY & AFFILIATION */}
          {activeTab === 'work' && (
            <div>
              <div className="pb-6 mb-6 border-b border-slate-100">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                  Company Affiliation & Experience
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                  Verified studio associations, ongoing enterprise retainers, and delivered campaigns.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="p-5 rounded-2xl bg-orange-50/70 border border-orange-200/80 shadow-sm">
                  <span className="text-[10px] uppercase font-bold text-[#FF6B00] block mb-1">Current Studio Role</span>
                  <h3 className="font-extrabold text-base text-slate-900">{creator.currentCompany}</h3>
                  <p className="text-xs text-slate-600 mt-1">{creator.title} (2024 - Present)</p>
                  <div className="mt-3 inline-flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-100/70 px-2.5 py-1 rounded-md font-semibold">
                    <UserCheck className="w-3.5 h-3.5" /> Verified Employment Record
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 shadow-sm">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Performance Stats</span>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    <div>
                      <span className="text-xl font-black text-slate-900">42</span>
                      <p className="text-[11px] text-slate-500">Delivered Campaigns</p>
                    </div>
                    <div>
                      <span className="text-xl font-black text-emerald-600">100%</span>
                      <p className="text-[11px] text-slate-500">Licensing Compliance</p>
                    </div>
                  </div>
                </div>
              </div>

              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Past Brand Engagements</h4>
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs hover:border-orange-200 transition-colors">
                  <div>
                    <span className="font-bold text-slate-900">Nike Digital</span> — 3D Generative Product Animation
                    <p className="text-[11px] text-slate-400">Delivered via Runway Gen-3 & Blender • 5-Star Review</p>
                  </div>
                  <span className="text-[10px] font-bold text-slate-600 bg-white border border-slate-200 px-2.5 py-1 rounded-md shadow-sm">
                    Full Commercial License
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs hover:border-orange-200 transition-colors">
                  <div>
                    <span className="font-bold text-slate-900">Red Bull Media</span> — Extreme Sports Visuals
                    <p className="text-[11px] text-slate-400">Stable Diffusion XL LoRA Tuning • 5-Star Review</p>
                  </div>
                  <span className="text-[10px] font-bold text-slate-600 bg-white border border-slate-200 px-2.5 py-1 rounded-md shadow-sm">
                    Broadcast License
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Persistent Footer */}
          <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
            <span>GenLancer Creator Hub</span>
            <span className="text-[#FF6B00] font-semibold">⚡ Powered by Applied AI Architecture</span>
          </div>
        </main>

      </div>

      {/* ================= MODAL: EDIT PROFILE SETTINGS ================= */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 shadow-2xl relative">
            <button 
              onClick={() => setShowSettingsModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-slate-900 mb-1">Edit Creator Profile</h3>
            <p className="text-xs text-slate-500 mb-6">Update your name, title, and current studio affiliation.</p>

            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Creator Name</label>
                <input 
                  type="text" 
                  value={editForm.name}
                  onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:border-[#FF6B00]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Title / Specialization</label>
                <input 
                  type="text" 
                  value={editForm.title}
                  onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:border-[#FF6B00]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Studio / Affiliation</label>
                <input 
                  type="text" 
                  value={editForm.currentCompany}
                  onChange={(e) => setEditForm(prev => ({ ...prev, currentCompany: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:border-[#FF6B00]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Avatar Image URL</label>
                <input 
                  type="url" 
                  value={editForm.avatar}
                  onChange={(e) => setEditForm(prev => ({ ...prev, avatar: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:border-[#FF6B00]"
                  required
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#FF6B00] hover:bg-[#E05E00] text-white font-bold rounded-xl text-xs transition-all shadow-sm cursor-pointer"
                >
                  Save Profile Changes
                </button>
                <button
                  type="button"
                  onClick={() => setShowSettingsModal(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-all cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: UPLOAD NEW WORK ================= */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-slate-200 shadow-2xl relative">
            <button 
              onClick={() => setShowUploadModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-1">
              <div className="w-7 h-7 rounded-lg bg-orange-100 flex items-center justify-center text-[#FF6B00]">
                <UploadCloud className="w-4 h-4" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Upload Generation Proof</h3>
            </div>
            <p className="text-xs text-slate-500 mb-5">Add prompt, seed, and model metadata to pass AI verification.</p>

            <form onSubmit={handleAddWork} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Project Title</label>
                <input 
                  type="text"
                  placeholder="e.g. Hyper-realistic Liquid Simulation"
                  value={newWork.title}
                  onChange={(e) => setNewWork(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 outline-none focus:border-[#FF6B00]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Primary Model Tool</label>
                  <select
                    value={newWork.tool}
                    onChange={(e) => setNewWork(prev => ({ ...prev, tool: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-[#FF6B00] cursor-pointer"
                  >
                    <option>Runway Gen-3 Alpha</option>
                    <option>Flux.1 Dev / Schnell</option>
                    <option>Midjourney v6.1</option>
                    <option>Kling AI 1.5</option>
                    <option>Luma Dream Machine</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Aspect Ratio</label>
                  <select
                    value={newWork.aspectRatio}
                    onChange={(e) => setNewWork(prev => ({ ...prev, aspectRatio: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-[#FF6B00] cursor-pointer"
                  >
                    <option>16:9 (Cinematic)</option>
                    <option>9:16 (Vertical Reel)</option>
                    <option>1:1 (Square)</option>
                    <option>4:5 (Portrait)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Generation Pipeline</label>
                <input 
                  type="text"
                  placeholder="e.g. Midjourney v6 ➔ Runway Gen-3 ➔ Topaz 4K"
                  value={newWork.pipeline}
                  onChange={(e) => setNewWork(prev => ({ ...prev, pipeline: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 outline-none focus:border-[#FF6B00]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Exact Generation Prompt</label>
                <textarea 
                  rows={2}
                  placeholder="Paste the exact prompt including weights, tags, and seeds..."
                  value={newWork.prompt}
                  onChange={(e) => setNewWork(prev => ({ ...prev, prompt: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 outline-none focus:border-[#FF6B00] font-mono resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Seed Number (Optional)</label>
                <input 
                  type="text"
                  placeholder="e.g. 482019482"
                  value={newWork.seed}
                  onChange={(e) => setNewWork(prev => ({ ...prev, seed: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 outline-none focus:border-[#FF6B00] font-mono"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#FF6B00] hover:bg-[#E05E00] text-white font-bold rounded-xl text-xs transition-all shadow-sm cursor-pointer"
                >
                  Upload & Verify with AI
                </button>
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-all cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Clarification Request Modal */}
      <ClarificationModal
        isOpen={!!clarifyModalReq}
        onClose={() => setClarifyModalReq(null)}
        request={clarifyModalReq}
        onSubmit={handleSubmitClarification}
      />

      {/* Prompt & Seed Inspector Modal */}
      <PromptInspectorModal 
        isOpen={!!selectedAssetForInspect} 
        onClose={() => setSelectedAssetForInspect(null)} 
        item={selectedAssetForInspect} 
      />

    </div>
  );
}
