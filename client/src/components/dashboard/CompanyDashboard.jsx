import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Sparkles, 
  Bot, 
  Users, 
  MessageSquare, 
  Building2, 
  Plus, 
  CheckCircle2, 
  Zap, 
  Star, 
  Clock, 
  DollarSign, 
  Ratio, 
  ShieldCheck, 
  Send, 
  X, 
  ExternalLink, 
  Layers, 
  Play, 
  ChevronRight, 
  LogOut, 
  Award,
  Video,
  FileText,
  RotateCcw,
  SlidersHorizontal,
  Briefcase,
  Loader2,
  Wand2,
  AlertCircle,
  AlertTriangle,
  Edit2
} from 'lucide-react';
import GenLancerLogo from '../auth/GenLancerLogo';
import { supabase } from '../../lib/supabase';
import { sendChatMessage, fetchChatMessages } from '../../lib/chatService';
import PromptInspectorModal from '../common/PromptInspectorModal';
import MatchingReportModal from '../common/MatchingReportModal';
import ChatLockoutOverlay from '../common/ChatLockoutOverlay';
import VerificationBadge, { VerifiedWorkflowBadge, CertifiedPipelineBadge, AICreatorScoreBadge } from '../common/VerificationBadge';
import BriefVersionBadge from '../common/BriefVersionBadge';

// Static Fallback Creators Database
const MOCK_CREATORS = [
  {
    id: 'c1',
    name: 'Alex Smith',
    title: 'AI Film Director & Motion Specialist',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300',
    location: 'San Francisco, CA / Remote',
    score: 98,
    rating: 4.98,
    completedGigs: 42,
    hourlyRate: '$120/hr',
    specialization: 'AI Filmmaking',
    skills: ['Cinematography', 'Prompt Engineering', 'Fluid Sim'],
    aiTools: ['Runway Gen-3 Alpha', 'Midjourney v6', 'Topaz 4K'],
    primaryTools: ['Runway Gen-3 Alpha', 'Midjourney v6', 'Topaz 4K'],
    visualStyles: ['Cyberpunk', 'Cinematic 8K'],
    contentTypes: ['Video'],
    contentType: 'Video',
    aspectRatios: ['16:9', '9:16'],
    sampleMedia: 'https://assets.mixkit.co/videos/preview/mixkit-cyberpunk-neon-city-street-41804-large.mp4',
    pipeline: 'Midjourney v6 ➔ Runway Gen-3 ➔ Topaz 4K',
    samplePrompt: '/imagine prompt: futuristic mega-city at night, neon reflections in rainwater, anamorphic cinematic 8k --ar 16:9',
    seed: '482019482',
    verified: true,
    portfolio: []
  },
  {
    id: 'c2',
    name: 'Maya Lin',
    title: 'Generative Visual Architect & LoRA Specialist',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300',
    location: 'New York, NY / Remote',
    score: 96,
    rating: 4.95,
    completedGigs: 38,
    hourlyRate: '$110/hr',
    specialization: 'Generative Architecture & LoRA',
    skills: ['LoRA Training', 'ControlNet Depth', 'ComfyUI Pipelines'],
    aiTools: ['Flux.1 Dev', 'ComfyUI', 'SDXL'],
    primaryTools: ['Flux.1 Dev', 'ComfyUI', 'SDXL'],
    visualStyles: ['Minimalist Surrealism', 'Macro Photography'],
    contentTypes: ['Static Graphics'],
    contentType: 'Static Graphics',
    aspectRatios: ['1:1', '4:5'],
    sampleMedia: 'https://assets.mixkit.co/videos/preview/mixkit-hand-holding-a-glowing-futuristic-device-41805-large.mp4',
    pipeline: 'Flux.1 Dev ➔ ControlNet Depth ➔ Blender Compositor',
    samplePrompt: 'close-up portrait of android with exposed copper neural cables, volumetric amber lighting, macro photography',
    seed: '99102412',
    verified: true,
    portfolio: []
  },
  {
    id: 'c3',
    name: 'Carlos Rivera',
    title: '3D Synthetic Media & Animatics Lead',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
    location: 'Austin, TX / Remote',
    score: 95,
    rating: 4.92,
    completedGigs: 29,
    hourlyRate: '$135/hr',
    specialization: '3D Synthetic Media',
    skills: ['Blender Integration', 'Camera Projections', 'VFX Motion'],
    aiTools: ['Kling AI 1.5', 'Luma Dream Machine', 'Blender'],
    primaryTools: ['Kling AI 1.5', 'Luma Dream Machine', 'Blender'],
    visualStyles: ['Sci-Fi Cityscapes', 'Hyper-Speed Drone Views'],
    contentTypes: ['Video'],
    contentType: 'Video',
    aspectRatios: ['16:9', '9:16', '1:1'],
    sampleMedia: 'https://assets.mixkit.co/videos/preview/mixkit-futuristic-flying-car-in-a-cyberpunk-city-41807-large.mp4',
    pipeline: 'Blender ➔ Kling AI 1.5 ➔ After Effects',
    samplePrompt: 'cinematic drone follow shot of high-tech flying vehicle gliding over glowing obsidian skyscrapers',
    seed: '772183921',
    verified: true,
    portfolio: []
  },
  {
    id: 'c4',
    name: 'Sophia Chen',
    title: 'Commercial AI Creative Director',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300',
    location: 'London, UK / Remote',
    score: 99,
    rating: 5.0,
    completedGigs: 56,
    hourlyRate: '$160/hr',
    specialization: 'Commercial AI Direction',
    skills: ['Art Direction', '4K Commercial Mastering', 'High-Speed Fluid Splashes'],
    aiTools: ['Sora', 'Runway Gen-3 Alpha', 'Topaz 4K'],
    primaryTools: ['Sora', 'Runway Gen-3 Alpha', 'Topaz 4K'],
    visualStyles: ['Luxury Commercial', 'Fluid Dynamics'],
    contentTypes: ['Video'],
    contentType: 'Video',
    aspectRatios: ['16:9', '9:16'],
    sampleMedia: 'https://assets.mixkit.co/videos/preview/mixkit-abstract-laser-light-show-41808-large.mp4',
    pipeline: 'Sora ➔ Topaz AI ➔ DaVinci Resolve',
    samplePrompt: 'photorealistic cinematic commercial shot, fluid amber beverage splashing with hyper-detailed crystal droplets',
    seed: '10928374',
    verified: true,
    portfolio: []
  }
];

export default function CompanyDashboard({ onLogout, onSwitchToCreator }) {
  const [activeTab, setActiveTab] = useState('directory'); // 'directory' | 'matchmaker' | 'contracts' | 'messages'
  
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTool, setSelectedTool] = useState('all');
  const [selectedScore, setSelectedScore] = useState('all');
  const [selectedContentType, setSelectedContentType] = useState('all');
  const [selectedAspectRatio, setSelectedAspectRatio] = useState('all');
  const [excludedKeywords, setExcludedKeywords] = useState([]);
  const [currentExclusionInput, setCurrentExclusionInput] = useState('');

  // Modals
  const [showCreateBriefModal, setShowCreateBriefModal] = useState(false);
  const [selectedCreatorForModal, setSelectedCreatorForModal] = useState(null);
  const [selectedAssetForInspect, setSelectedAssetForInspect] = useState(null);

  // AI Matching Agent State
  const [isMatching, setIsMatching] = useState(false);
  const [matchResults, setMatchResults] = useState(null);
  const [matchingReport, setMatchingReport] = useState(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [campaignGoal, setCampaignGoal] = useState('15s Cyberpunk Beverage Ad Campaign');
  const [targetStyle, setTargetStyle] = useState('Photorealistic Neon Cyberpunk with Fluid Dynamics');
  const [preferredTool, setPreferredTool] = useState('Runway Gen-3 Alpha');
  const [targetAspect, setTargetAspect] = useState('16:9');
  const [budgetTier, setBudgetTier] = useState('$4,500');

  // Raw Idea & AI Brief Generation States
  const [rawIdea, setRawIdea] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [lastGeneratedBrief, setLastGeneratedBrief] = useState(null);
  const [briefStatus, setBriefStatus] = useState(null); // { type: 'success' | 'error', message: string } | null

  // New Brief Form State
  const [newBrief, setNewBrief] = useState({
    title: '',
    company: 'Apex Creative Agency',
    budget: '$3,500',
    deadline: 'Nov 30, 2026',
    aspectRatio: '16:9',
    targetAudience: '',
    deliverables: '',
    style: '',
    requiredTools: 'Runway Gen-3 Alpha, Midjourney v6'
  });

  // Live Creators State & Loading Flag
  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Live Creators from Supabase freelancers table
  useEffect(() => {
    let isMounted = true;

    async function fetchCreators() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('freelancers')
          .select('*');

        if (error) {
          console.warn('Supabase fetch returned error, falling back to local dataset:', error.message);
          if (isMounted) setCreators(MOCK_CREATORS);
          return;
        }

        if (data && data.length > 0) {
          const mapped = data.map((creator) => {
            const specialization = 
              (Array.isArray(creator.specializations) && creator.specializations[0]) || 
              creator.specialization || 
              'AI Creator';

            const skills = Array.isArray(creator.skills) 
              ? creator.skills 
              : (creator.skills ? [creator.skills] : []);

            const aiTools = Array.isArray(creator.ai_tools_models) 
              ? creator.ai_tools_models 
              : (Array.isArray(creator.specializations) ? creator.specializations : ['Runway Gen-3 Alpha', 'Midjourney v6']);

            const visualStyles = Array.isArray(creator.visual_styles) 
              ? creator.visual_styles 
              : ['Photorealistic', 'Cinematic'];

            const contentTypes = Array.isArray(creator.content_types) 
              ? creator.content_types 
              : ['Video'];

            const portfolio = Array.isArray(creator.portfolio_items) 
              ? creator.portfolio_items 
              : [];

            const hourlyRate = creator.hourly_rate_usd 
              ? (typeof creator.hourly_rate_usd === 'number' ? `$${creator.hourly_rate_usd}/hr` : creator.hourly_rate_usd)
              : (creator.hourlyRate || '$120/hr');

            return {
              id: creator.id || `c-${Date.now()}-${Math.random()}`,
              name: creator.full_name || creator.name || 'AI Creator',
              title: creator.title || specialization,
              specialization,
              skills,
              aiTools,
              primaryTools: aiTools.length > 0 ? aiTools : ['Runway Gen-3 Alpha', 'Midjourney v6'],
              visualStyles,
              contentTypes,
              contentType: contentTypes[0] || 'Video',
              portfolio,
              hourlyRate,
              rating: creator.rating || 4.9,
              avatar: creator.avatar_url || creator.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300',
              location: creator.location || 'San Francisco, CA / Remote',
              score: creator.reputation_score || creator.score || 96,
              completedGigs: creator.completed_gigs || creator.completedGigs || 28,
              aspectRatios: Array.isArray(creator.aspect_ratios) && creator.aspect_ratios.length > 0 ? creator.aspect_ratios : ['16:9', '9:16'],
              sampleMedia: (portfolio[0] && portfolio[0].media_url) || creator.sample_media || creator.sampleMedia || 'https://assets.mixkit.co/videos/preview/mixkit-cyberpunk-neon-city-street-41804-large.mp4',
              pipeline: creator.pipeline || (aiTools.length > 0 ? aiTools.join(' ➔ ') : 'Runway Gen-3 ➔ Topaz 4K'),
              samplePrompt: (portfolio[0] && portfolio[0].prompt) || creator.sample_prompt || creator.samplePrompt || '/imagine prompt: futuristic cinematic composition 8k',
              seed: creator.seed || '482019482',
              verified: creator.verified ?? true
            };
          });

          if (isMounted) setCreators(mapped);
        } else {
          // If Supabase table is unpopulated, fetch canonical dataset from Express API
          try {
            const apiRes = await fetch('http://localhost:3001/api/creators');
            if (apiRes.ok) {
              const apiData = await apiRes.json();
              if (apiData.creators && apiData.creators.length > 0 && isMounted) {
                setCreators(apiData.creators.map(c => ({
                  ...c,
                  primaryTools: c.ai_tools_models || c.aiTools || ['Runway Gen-3 Alpha', 'Midjourney v6'],
                  aspectRatios: c.output_formats || c.aspectRatios || ['16:9'],
                  contentType: (c.content_types && c.content_types[0]) || 'Video',
                  sampleMedia: (c.portfolio_items && c.portfolio_items[0]?.media_url) || c.sampleMedia,
                  samplePrompt: (c.portfolio_items && c.portfolio_items[0]?.prompt) || c.samplePrompt,
                  pipeline: (c.portfolio_items && c.portfolio_items[0]?.pipeline) || c.pipeline,
                  seed: (c.portfolio_items && c.portfolio_items[0]?.seed) || '482019482',
                  hourlyRate: c.hourly_rate_usd ? `$${c.hourly_rate_usd}/hr` : (c.hourlyRate || '$120/hr')
                })));
                return;
              }
            }
          } catch (apiErr) {
            console.warn('Backend creators API fallback check failed:', apiErr);
          }
          if (isMounted) setCreators(MOCK_CREATORS);
        }
      } catch (err) {
        console.error('Network or query error fetching freelancers from Supabase:', err);
        // Try server API fallback
        try {
          const apiRes = await fetch('http://localhost:3001/api/creators');
          if (apiRes.ok) {
            const apiData = await apiRes.json();
            if (apiData.creators && isMounted) {
              setCreators(apiData.creators.map(c => ({
                ...c,
                primaryTools: c.ai_tools_models || c.aiTools || ['Runway Gen-3 Alpha', 'Midjourney v6'],
                aspectRatios: c.output_formats || c.aspectRatios || ['16:9'],
                contentType: (c.content_types && c.content_types[0]) || 'Video',
                sampleMedia: (c.portfolio_items && c.portfolio_items[0]?.media_url) || c.sampleMedia,
                samplePrompt: (c.portfolio_items && c.portfolio_items[0]?.prompt) || c.samplePrompt,
                pipeline: (c.portfolio_items && c.portfolio_items[0]?.pipeline) || c.pipeline,
                seed: (c.portfolio_items && c.portfolio_items[0]?.seed) || '482019482',
                hourlyRate: c.hourly_rate_usd ? `$${c.hourly_rate_usd}/hr` : (c.hourlyRate || '$120/hr')
              })));
              return;
            }
          }
        } catch (_) {}
        if (isMounted) setCreators(MOCK_CREATORS);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchCreators();

    return () => {
      isMounted = false;
    };
  }, []);

  // Active Contracts State
  const [activeContracts, setActiveContracts] = useState([
    {
      id: 'cnt-1',
      requestId: 'req-alex-001',
      creatorName: 'Alex Smith',
      creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300',
      campaignTitle: 'Volt Energy Cyberpunk Beverage Ad',
      budget: '$4,500',
      deadline: 'Nov 15, 2026',
      progress: 65,
      milestone: 'Video Render In Progress',
      licensing: 'Full Commercial Ownership Verified',
      chatId: 'alex-smith',
      briefVersion: 1,
      revisionCount: 1,
      status: 'confirmed'
    },
    {
      id: 'cnt-2',
      requestId: 'req-sophia-002',
      creatorName: 'Sophia Chen',
      creatorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300',
      campaignTitle: 'Luxury Autumn Skincare 4K Stills',
      budget: '$3,200',
      deadline: 'Nov 20, 2026',
      progress: 40,
      milestone: 'Scope Clarification In Review',
      licensing: 'Full Commercial Ownership Verified',
      chatId: 'sophia-chen',
      briefVersion: 1,
      revisionCount: 1,
      status: 'clarification_requested',
      clarificationQuestions: 'Does the 4K still package require transparent PNG alphas and ComfyUI workflow metadata?'
    }
  ]);

  // Brief Revision & Update Modal State
  const [updateBriefModalContract, setUpdateBriefModalContract] = useState(null);
  const [updateBriefForm, setUpdateBriefForm] = useState({
    budget: '',
    deadline: '',
    deliverables: '',
    clarification_notes: ''
  });
  const [isUpdatingBrief, setIsUpdatingBrief] = useState(false);
  const [updateBriefError, setUpdateBriefError] = useState(null);

  const handleOpenUpdateBrief = (contract) => {
    setUpdateBriefModalContract(contract);
    setUpdateBriefForm({
      budget: contract.budget || '$3,200',
      deadline: contract.deadline || 'Nov 20, 2026',
      deliverables: '4K Master Stills with alpha transparency PNGs and exported ComfyUI pipeline JSON.',
      clarification_notes: 'Addressed creator inquiry: Alpha channels and reproducible ComfyUI workflow metadata are approved and included.'
    });
    setUpdateBriefError(null);
  };

  const handleSaveBriefUpdate = async (e) => {
    e.preventDefault();
    if (!updateBriefModalContract) return;

    setIsUpdatingBrief(true);
    setUpdateBriefError(null);

    const reqId = updateBriefModalContract.requestId || updateBriefModalContract.id;
    const nextVersion = (updateBriefModalContract.briefVersion || 1) + 1;

    try {
      if (reqId) {
        await fetch(`http://localhost:3001/api/collaboration/${reqId}/update-brief`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            project_brief: {
              title: updateBriefModalContract.campaignTitle,
              budget: updateBriefForm.budget,
              deadline: updateBriefForm.deadline,
              deliverables: updateBriefForm.deliverables,
              clarification_notes: updateBriefForm.clarification_notes
            },
            actor: 'company',
            actor_id: 'COMP001'
          })
        });
      }

      setActiveContracts(prev => prev.map(c => {
        if (c.id === updateBriefModalContract.id || c.requestId === updateBriefModalContract.requestId) {
          return {
            ...c,
            budget: updateBriefForm.budget,
            deadline: updateBriefForm.deadline,
            briefVersion: nextVersion,
            revisionCount: (c.revisionCount || 1) + 1,
            status: 'pending',
            milestone: `Revision v${nextVersion} Dispatched to Creator`,
            clarificationQuestions: null
          };
        }
        return c;
      }));

      setUpdateBriefModalContract(null);
    } catch (err) {
      console.error('Failed to update brief terms:', err);
      setUpdateBriefError(err.message || 'Failed to update brief terms.');
    } finally {
      setIsUpdatingBrief(false);
    }
  };

  const handleConfirmActiveTerms = async (contract) => {
    const reqId = contract.requestId || contract.id;
    try {
      if (reqId) {
        await fetch(`http://localhost:3001/api/collaboration/${reqId}/confirm`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            actor: 'company',
            brief_version: contract.briefVersion || 1,
            actor_id: 'COMP001'
          })
        });
      }

      setActiveContracts(prev => prev.map(c => {
        if (c.id === contract.id || c.requestId === contract.requestId) {
          return {
            ...c,
            status: 'confirmed',
            milestone: 'Active Terms Confirmed & Escrow Active'
          };
        }
        return c;
      }));

      if (contract.chatId && chatThreads[contract.chatId]) {
        setChatThreads(prev => ({
          ...prev,
          [contract.chatId]: {
            ...prev[contract.chatId],
            status: 'confirmed'
          }
        }));
      }
    } catch (err) {
      console.error('Failed to confirm active terms:', err);
    }
  };

  // Chat / Messaging State
  const [activeChatCreatorId, setActiveChatCreatorId] = useState('alex-smith');
  const [chatInput, setChatInput] = useState('');
  const [chatThreads, setChatThreads] = useState({
    'alex-smith': {
      creatorName: 'Alex Smith',
      creatorTitle: 'AI Film Director',
      creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300',
      campaign: 'Volt Energy Cyberpunk Beverage Ad',
      unread: false,
      status: 'confirmed',
      messages: [
        { id: 1, sender: 'brand', author: 'Apex Creative', text: 'Hi Alex! We loved your Runway Gen-3 reel. Can you ensure the liquid simulation matches the 16:9 ratio in the brief?', time: '10:15 AM' },
        { id: 2, sender: 'creator', author: 'Alex Smith', text: 'Hey team! Absolutely. I have cached the Midjourney seed and configured the Runway motion bucket for fluid dynamics.', time: '10:42 AM' },
        { id: 3, sender: 'brand', author: 'Apex Creative', text: 'Perfect! First milestone escrow ($2,250) has been funded.', time: '11:00 AM' }
      ]
    },
    'sophia-chen': {
      creatorName: 'Sophia Chen',
      creatorTitle: 'Commercial AI Director',
      creatorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300',
      campaign: 'Luxury Autumn Skincare 4K Stills',
      unread: false,
      status: 'accepted',
      messages: [
        { id: 1, sender: 'creator', author: 'Sophia Chen', text: 'Hi Apex team! The Topaz 4K upscales for the 10 skincare keyframes have been uploaded to the shared escrow vault.', time: 'Yesterday' },
        { id: 2, sender: 'brand', author: 'Apex Creative', text: 'Reviewing now Sophia! The lighting in frame #4 is spectacular.', time: 'Yesterday' }
      ]
    },
    'marcus-vance': {
      creatorName: 'Marcus Vance',
      creatorTitle: 'Runway & Sora Specialist',
      creatorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
      campaign: 'Holographic Automotive Teaser',
      unread: true,
      status: 'pending',
      messages: [
        { id: 1, sender: 'brand', author: 'Apex Creative', text: 'Hi Marcus! Campaign brief has been sent for your review.', time: 'Today' }
      ]
    }
  });

  // Exclusion Tag Helpers
  const handleAddExclusion = () => {
    const trimmed = currentExclusionInput.trim();
    if (trimmed && !excludedKeywords.some(k => k.toLowerCase() === trimmed.toLowerCase())) {
      setExcludedKeywords(prev => [...prev, trimmed]);
      setCurrentExclusionInput('');
    }
  };

  const handleRemoveExclusion = (tagToRemove) => {
    setExcludedKeywords(prev => prev.filter(t => t !== tagToRemove));
  };

  // Filter Logic with safe array guards
  const filteredCreators = creators.filter((c) => {
    // Search query match
    const matchesQuery = 
      (c.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.primaryTools || []).some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (c.samplePrompt || '').toLowerCase().includes(searchQuery.toLowerCase());

    // Negative exclusion filters
    const matchesExclusions = excludedKeywords.every((excluded) => {
      const ex = excluded.toLowerCase();
      const tools = (c.primaryTools || c.ai_tools_models || []).map(t => String(t).toLowerCase());
      const skills = (c.skills || []).map(s => String(s).toLowerCase());
      const specializations = (c.specializations || [c.specialization || '']).map(s => String(s).toLowerCase());
      const title = (c.title || '').toLowerCase();
      const name = (c.name || '').toLowerCase();

      return !tools.some(t => t.includes(ex)) &&
             !skills.some(s => s.includes(ex)) &&
             !specializations.some(s => s.includes(ex)) &&
             !title.includes(ex) &&
             !name.includes(ex);
    });

    // Tool filter
    const matchesTool = selectedTool === 'all' || (c.primaryTools || []).some(t => t.toLowerCase().includes(selectedTool.toLowerCase()));

    // Score filter
    const matchesScore = 
      selectedScore === 'all' || 
      (selectedScore === '90' && (c.score || 0) >= 90) ||
      (selectedScore === '95' && (c.score || 0) >= 95) ||
      (selectedScore === '98' && (c.score || 0) >= 98);

    // Content Type filter
    const matchesContentType = selectedContentType === 'all' || c.contentType === selectedContentType;

    // Aspect Ratio filter
    const matchesAspectRatio = selectedAspectRatio === 'all' || (c.aspectRatios || []).includes(selectedAspectRatio);

    return matchesQuery && matchesTool && matchesScore && matchesContentType && matchesAspectRatio && matchesExclusions;
  });

  // Run AI Recommendation Matcher Engine via Backend Explainable Scoring
  const runAIMatchingAgent = async () => {
    setIsMatching(true);
    try {
      const budgetNum = budgetTier.includes('1,000') ? 130 : (budgetTier.includes('3,000') ? 150 : 250);
      const res = await fetch('http://localhost:3001/api/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brief: {
            project_title: campaignGoal,
            target_tools: [preferredTool],
            output_format: targetAspect,
            content_type: 'Video',
            max_budget: budgetNum,
            excluded_tools: excludedKeywords,
            excluded_skills: excludedKeywords
          },
          excluded_tools: excludedKeywords,
          excluded_skills: excludedKeywords
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.ranked_candidates)) {
          const ranked = data.ranked_candidates.map((cand) => {
            const c = cand.creator || {};
            return {
              ...c,
              id: cand.freelancer_id || c.id,
              name: c.name || 'AI Creator',
              avatar: c.avatar,
              title: c.title,
              hourlyRate: c.hourlyRate || (c.hourly_rate_usd ? `$${c.hourly_rate_usd}/hr` : '$120/hr'),
              matchPercentage: cand.overall_score || cand.match_percentage || 80,
              matchReason: cand.strengths && cand.strengths.length > 0 
                ? cand.strengths.join(' • ') 
                : (cand.reasons && cand.reasons.length > 0 ? cand.reasons.join(' • ') : `7-Dimension Match: ${cand.overall_score}%`),
              dimensionScores: cand.dimension_scores || {},
              eligibilityStatus: cand.eligibility_status || 'Eligible',
              strengths: cand.strengths || [],
              gaps: cand.gaps || [],
              reasons: cand.reasons || []
            };
          });
          setMatchResults(ranked);

          // Generate or fetch comprehensive matching report
          if (data.search_results) {
            try {
              const repRes = await fetch('http://localhost:3001/api/report/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  search_results: data.search_results,
                  scoring_results: data
                })
              });
              if (repRes.ok) {
                const repData = await repRes.json();
                if (repData.success && repData.report) {
                  setMatchingReport(repData.report);
                }
              }
            } catch (repErr) {
              console.warn('Matching report generation warning:', repErr);
            }
          }

          setIsMatching(false);
          return;
        }
      }
    } catch (err) {
      console.warn('Backend scoring endpoint error, using local fallback:', err);
    }

    // Client-side fallback if server unreachable
    setTimeout(() => {
      setIsMatching(false);
      const ranked = creators.map((c) => {
        let matchScore = 80;
        let reasons = [];
        if ((c.primaryTools || []).includes(preferredTool)) {
          matchScore += 12;
          reasons.push(`Specialized in ${preferredTool}`);
        }
        if ((c.aspectRatios || []).includes(targetAspect)) {
          matchScore += 5;
          reasons.push(`${targetAspect} format verified`);
        }
        return {
          ...c,
          matchPercentage: Math.min(99, matchScore),
          matchReason: `⚡ ${matchScore}% Match: ${reasons.join(' & ') || 'Verified Creator'}`,
          eligibilityStatus: 'Eligible',
          dimensionScores: { tools: 100, format: 100 }
        };
      }).sort((a, b) => b.matchPercentage - a.matchPercentage);
      setMatchResults(ranked);
    }, 600);
  };

  // Instant Hire / Offer Action
  const handleSendOffer = async (creator) => {
    const newContract = {
      id: `cnt-${Date.now()}`,
      requestId: reqUuid,
      creatorName: creator.name,
      creatorAvatar: creator.avatar,
      campaignTitle: campaignGoal,
      budget: budgetTier,
      deadline: 'Dec 1, 2026',
      progress: 10,
      milestone: 'Brief Accepted & Escrow Created',
      licensing: 'Full Commercial Ownership Verified',
      chatId: creator.id,
      briefVersion: 1,
      revisionCount: 1,
      status: 'pending'
    };

    setActiveContracts(prev => [newContract, ...prev]);

    // Create Chat Thread if not existing
    if (!chatThreads[creator.id]) {
      setChatThreads(prev => ({
        ...prev,
        [creator.id]: {
          creatorName: creator.name,
          creatorTitle: creator.title,
          creatorAvatar: creator.avatar,
          campaign: campaignGoal,
          unread: false,
          status: 'pending',
          messages: [
            { id: 1, sender: 'brand', author: 'Apex Creative', text: `Hi ${creator.name}! We were matched with your profile via GenLancer AI Matcher. We have funded a ${budgetTier} escrow for "${campaignGoal}". Looking forward to collaborating!`, time: 'Just now' }
          ]
        }
      }));
    }

    // Persist offer to Supabase collaboration_requests
    await handlePublishBrief(
      lastGeneratedBrief || {
        title: campaignGoal,
        budget: budgetTier,
        style: targetStyle,
        preferredTool: preferredTool,
        aspectRatio: targetAspect
      },
      creator.id
    );

    setActiveChatCreatorId(creator.id);
    setActiveTab('messages');
  };

  // Determine active conversation requestId for Supabase chat sync
  const activeRequestId = activeChatCreatorId === 'alex-smith' || activeChatCreatorId === 'c1' || activeChatCreatorId === 'FL001'
    ? 'REQ-DEMO-001'
    : activeChatCreatorId === 'sophia-chen' || activeChatCreatorId === 'c4' || activeChatCreatorId === 'FL002'
      ? 'REQ-DEMO-002'
      : `REQ-${activeChatCreatorId}`;

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
      sender: 'brand',
      author: 'Apex Creative',
      text: text,
      time: 'Just now'
    };

    setChatThreads(prev => ({
      ...prev,
      [activeChatCreatorId]: {
        ...prev[activeChatCreatorId],
        messages: [
          ...(prev[activeChatCreatorId]?.messages || []),
          localMsg
        ]
      }
    }));

    // Perform Supabase messages table insert
    const result = await sendChatMessage(activeRequestId, 'COMP001', 'company', text);
    if (result?.success) {
      const fresh = await fetchChatMessages(activeRequestId);
      if (fresh && fresh.length > 0) {
        setChatMessages(fresh);
      }
    }
  };

  // Auto-populate the active brief form state with the structured AI brief data
  const setBriefForm = (data) => {
    const brief = data?.brief || data || {};

    // Auto-fill Title: prefer first suggested brand name + tagline, or fallback to brief title or raw idea
    let titleVal = '';
    if (Array.isArray(brief.brandNameSuggestions) && brief.brandNameSuggestions.length > 0) {
      const topName = brief.brandNameSuggestions[0]?.name || '';
      titleVal = topName ? `${topName} – ${brief.tagline || 'Campaign'}` : '';
    } else if (brief.title) {
      titleVal = brief.title;
    } else if (rawIdea.trim()) {
      titleVal = rawIdea.trim().slice(0, 50);
    }

    // Auto-fill Budget: extract from brief if available, or keep existing / fallback
    const budgetVal = brief.budget || newBrief.budget || '$4,500';

    // Auto-fill Target Audience: format nicely from primaryAudience / demographics
    let audienceVal = '';
    if (typeof brief.targetAudience === 'object' && brief.targetAudience !== null) {
      const parts = [
        brief.targetAudience.primaryAudience,
        brief.targetAudience.demographics ? `Demographics: ${brief.targetAudience.demographics}` : null
      ].filter(Boolean);
      audienceVal = parts.join(' | ');
    } else if (typeof brief.targetAudience === 'string') {
      audienceVal = brief.targetAudience;
    }

    // Auto-fill Deliverables: format keyDeliverables list
    let deliverablesVal = '';
    if (Array.isArray(brief.keyDeliverables)) {
      deliverablesVal = brief.keyDeliverables
        .map(item => typeof item === 'string' ? item : `${item.item || ''}${item.description ? `: ${item.description}` : ''}`)
        .filter(Boolean)
        .join('; ');
    } else if (typeof brief.deliverables === 'string') {
      deliverablesVal = brief.deliverables;
    }

    // Auto-fill Style & Directives:
    let styleVal = '';
    if (brief.visualIdentity) {
      const aesthetic = brief.visualIdentity.designAesthetic || '';
      const mood = brief.visualIdentity.typographyMood || '';
      const tone = Array.isArray(brief.toneAndVoice) ? brief.toneAndVoice.join(', ') : (brief.toneAndVoice || '');
      styleVal = [
        aesthetic ? `Aesthetic: ${aesthetic}` : null,
        mood ? `Typography/Mood: ${mood}` : null,
        tone ? `Tone & Voice: ${tone}` : null
      ].filter(Boolean).join('\n');
    } else if (brief.style || brief.executiveSummary) {
      styleVal = brief.style || brief.executiveSummary;
    }

    setNewBrief(prev => ({
      ...prev,
      title: titleVal || prev.title,
      budget: budgetVal || prev.budget,
      targetAudience: audienceVal || prev.targetAudience,
      deliverables: deliverablesVal || prev.deliverables,
      style: styleVal || prev.style
    }));
  };

  // API Call to Express Gemini Proxy
  const handleGenerateBrief = async () => {
    if (!rawIdea.trim()) return;
    setIsGenerating(true);
    setBriefStatus(null);
    try {
      const response = await fetch('http://localhost:3001/api/generate-brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea: rawIdea })
      });
      const data = await response.json();
      if (response.ok) {
        // Auto-populate the active brief form state with the structured AI brief data:
        setBriefForm(data);
        setLastGeneratedBrief(data?.brief || data);
        setBriefStatus({
          type: 'success',
          message: '✨ AI Brief structured successfully with Gemini! Review and customize the form below.'
        });
      } else {
        console.error("Error from backend:", data.error);
        setBriefStatus({
          type: 'error',
          message: data.error || 'Failed to generate brief from backend.'
        });
      }
    } catch (error) {
      console.error("Network error connecting to backend:", error);
      setBriefStatus({
        type: 'error',
        message: 'Network error connecting to Gemini proxy at http://localhost:3001'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Publish / Save Brief to Supabase and Backend Collaboration Store
  const handlePublishBrief = async (generatedBriefData, selectedFreelancerId) => {
    setIsPublishing(true);
    try {
      const briefPayload = generatedBriefData || lastGeneratedBrief || {
        title: newBrief.title,
        budget: newBrief.budget,
        aspectRatio: newBrief.aspectRatio,
        targetAudience: newBrief.targetAudience,
        deliverables: newBrief.deliverables,
        style: newBrief.style,
        requiredTools: newBrief.requiredTools
      };

      const reqUuid = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `req-${Date.now()}`;
      let saved = false;

      // 1. Attempt Supabase direct write
      try {
        const { data, error } = await supabase
          .from('collaboration_requests')
          .insert([
            {
              request_id: reqUuid,
              company_id: 'COMP001',
              freelancer_id: selectedFreelancerId || 'c1',
              project_brief: briefPayload,
              brief_version: 1,
              status: 'pending',
              audit_history: [{ action: 'created', by: 'COMP001', timestamp: new Date().toISOString() }]
            }
          ]);
        if (!error) saved = true;
      } catch (err) {
        console.warn('Supabase direct insert error, syncing with Express proxy:', err.message);
      }

      // 2. Sync to Backend Collaboration Service
      try {
        const res = await fetch('http://localhost:3001/api/collaboration', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            request_id: reqUuid,
            company_id: 'COMP001',
            freelancer_id: selectedFreelancerId || 'c1',
            project_brief: briefPayload,
            brief_version: 1,
            status: 'pending'
          })
        });
        if (res.ok) saved = true;
      } catch (backendErr) {
        console.warn('Express collaboration route error:', backendErr);
      }

      setBriefStatus({
        type: 'success',
        message: '🎉 Campaign brief published and sent to Creator dashboard!'
      });
      return { success: true };
    } catch (err) {
      console.error('Error saving brief:', err);
      setBriefStatus({
        type: 'error',
        message: 'Failed to publish brief. Check console.'
      });
      return { success: false, error: err };
    } finally {
      setIsPublishing(false);
    }
  };

  // Handle Create Brief
  const handleCreateBrief = async (e) => {
    e.preventDefault();
    await handlePublishBrief(lastGeneratedBrief || newBrief, selectedCreatorForModal?.id || 'FL001');
    setShowCreateBriefModal(false);
    setNewBrief({
      title: '',
      company: 'Apex Creative Agency',
      budget: '$3,500',
      deadline: 'Nov 30, 2026',
      aspectRatio: '16:9',
      targetAudience: '',
      deliverables: '',
      style: '',
      requiredTools: 'Runway Gen-3 Alpha, Midjourney v6'
    });
    setRawIdea('');
    setBriefStatus(null);
    setLastGeneratedBrief(null);
  };

  const currentChat = chatThreads[activeChatCreatorId] || Object.values(chatThreads)[0];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col items-center p-3 sm:p-6 md:p-8 relative">
      {/* Background dot grid pattern */}
      <div className="fixed inset-0 bg-[radial-gradient(#CBD5E1_1.2px,transparent_1.2px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

      {/* Main Elevated Enterprise Dashboard Container */}
      <div className="relative w-full max-w-7xl bg-white border border-slate-200/90 rounded-[28px] shadow-[0_20px_50px_rgba(15,23,42,0.06)] overflow-hidden flex flex-col min-h-[820px] z-10">

        {/* ================= TOP ENTERPRISE NAVIGATION BAR ================= */}
        <header className="px-6 py-4 bg-white border-b border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <GenLancerLogo className="w-9 h-9" textColor="text-slate-900" />
            <div className="h-6 w-px bg-slate-200 hidden sm:block" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#FF6B00] text-white font-black text-xs flex items-center justify-center shadow-sm">
                AC
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block leading-tight">Apex Creative Agency</span>
                <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Verified Commercial Client
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions & Role Switcher */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => setShowCreateBriefModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-[#FF6B00] hover:bg-[#E05E00] active:bg-[#c2410c] text-white text-xs font-bold rounded-xl shadow-md shadow-orange-500/20 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Post Campaign Brief</span>
            </button>

            <button
              onClick={onSwitchToCreator}
              className="flex items-center gap-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              title="Switch to Creator View"
            >
              <span>Switch to Creator Hub</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onLogout}
              className="p-2 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer rounded-xl hover:bg-slate-100"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* ================= SECONDARY TAB NAVIGATION BAR ================= */}
        <div className="px-6 bg-slate-50 border-b border-slate-200/80 flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('directory')}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'directory'
                ? 'border-[#FF6B00] text-[#FF6B00] bg-white shadow-sm rounded-t-xl'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>1. Creator Directory & Search</span>
          </button>

          <button
            onClick={() => setActiveTab('matchmaker')}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'matchmaker'
                ? 'border-[#FF6B00] text-[#FF6B00] bg-white shadow-sm rounded-t-xl'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Bot className="w-4 h-4 text-[#FF6B00]" />
            <span>2. AI Recommendation Agent</span>
            <span className="text-[10px] bg-orange-100 text-[#FF6B00] px-1.5 py-0.2 rounded font-mono">Smart</span>
          </button>

          <button
            onClick={() => setActiveTab('contracts')}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'contracts'
                ? 'border-[#FF6B00] text-[#FF6B00] bg-white shadow-sm rounded-t-xl'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>3. Active Contracts</span>
            <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded font-bold">
              {activeContracts.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('messages')}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'messages'
                ? 'border-[#FF6B00] text-[#FF6B00] bg-white shadow-sm rounded-t-xl'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>4. Brand Communications</span>
            <span className="w-2 h-2 rounded-full bg-[#FF6B00]" />
          </button>
        </div>

        {/* ================= MAIN CONTENT AREA ================= */}
        <main className="p-6 md:p-8 flex-1 overflow-y-auto">

          {/* ================= TAB 1: CREATOR DIRECTORY ================= */}
          {activeTab === 'directory' && (
            <div className="space-y-6">
              {/* Top Filter & Search Controls */}
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-4">
                <div className="flex flex-col md:flex-row gap-3">
                  {/* Search Bar */}
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input 
                      type="text"
                      placeholder="Search AI creators by name, prompt keywords (e.g. Cyberpunk, Sora, Topaz)..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-white border border-slate-200 focus:border-[#FF6B00] focus:ring-2 focus:ring-orange-500/20 rounded-xl py-2 pl-10 pr-4 text-xs text-slate-900 placeholder:text-slate-400 outline-none transition-all"
                    />
                    {searchQuery && (
                      <button 
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Reset Button */}
                  {(searchQuery || selectedTool !== 'all' || selectedScore !== 'all' || selectedContentType !== 'all' || selectedAspectRatio !== 'all' || excludedKeywords.length > 0) && (
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedTool('all');
                        setSelectedScore('all');
                        setSelectedContentType('all');
                        setSelectedAspectRatio('all');
                        setExcludedKeywords([]);
                        setCurrentExclusionInput('');
                      }}
                      className="px-3.5 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset Filters</span>
                    </button>
                  )}
                </div>

                {/* Filter Dropdowns */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1 border-t border-slate-200/60">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">AI Pipeline Tool</label>
                    <select
                      value={selectedTool}
                      onChange={(e) => setSelectedTool(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 outline-none focus:border-[#FF6B00] cursor-pointer"
                    >
                      <option value="all">All Model Tools</option>
                      <option value="Runway">Runway Gen-3 Alpha</option>
                      <option value="Midjourney">Midjourney v6</option>
                      <option value="Flux.1">Flux.1 Dev</option>
                      <option value="Kling">Kling AI 1.5</option>
                      <option value="Sora">Sora</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Min AI Score</label>
                    <select
                      value={selectedScore}
                      onChange={(e) => setSelectedScore(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 outline-none focus:border-[#FF6B00] cursor-pointer"
                    >
                      <option value="all">Any Score</option>
                      <option value="90">90+ Score (Verified)</option>
                      <option value="95">95+ Score (Elite)</option>
                      <option value="98">98+ Score (Top 1%)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Content Type</label>
                    <select
                      value={selectedContentType}
                      onChange={(e) => setSelectedContentType(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 outline-none focus:border-[#FF6B00] cursor-pointer"
                    >
                      <option value="all">All Content</option>
                      <option value="Video">Video / Motion</option>
                      <option value="Static Graphics">Static Key Visuals</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Aspect Ratio</label>
                    <select
                      value={selectedAspectRatio}
                      onChange={(e) => setSelectedAspectRatio(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 outline-none focus:border-[#FF6B00] cursor-pointer"
                    >
                      <option value="all">Any Ratio</option>
                      <option value="16:9">16:9 (Landscape)</option>
                      <option value="9:16">9:16 (Vertical/Reel)</option>
                      <option value="1:1">1:1 (Square)</option>
                    </select>
                  </div>
                </div>

                {/* Exclude Tools or Skills Section */}
                <div className="pt-3 border-t border-slate-200/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Exclude Tools or Skills (Negative Constraints)
                    </label>
                    {excludedKeywords.length > 0 && (
                      <span className="text-[10px] font-semibold text-[#FF6B00] bg-orange-500/10 px-2 py-0.5 rounded-full border border-orange-500/20">
                        {excludedKeywords.length} Active Exclusion{excludedKeywords.length > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={currentExclusionInput}
                        onChange={(e) => setCurrentExclusionInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddExclusion();
                          }
                        }}
                        placeholder="Type tool or skill to exclude (e.g. Blender, Midjourney, 3D Modeling)..."
                        className="w-full bg-white border border-slate-200 focus:border-[#FF6B00] focus:ring-2 focus:ring-orange-500/20 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 outline-none transition-all"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleAddExclusion}
                      disabled={!currentExclusionInput.trim()}
                      className="px-4 py-2 bg-[#FF6B00] hover:bg-[#E05E00] active:bg-[#c2410c] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Exclusion</span>
                    </button>
                  </div>

                  {/* Active Exclusion Badges */}
                  {excludedKeywords.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      {excludedKeywords.map((tag) => (
                        <span
                          key={tag}
                          className="bg-orange-500/10 text-[#FF6B00] border border-orange-500/20 px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5"
                        >
                          <span>{tag}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveExclusion(tag)}
                            className="hover:bg-orange-500/20 rounded-full p-0.5 transition-colors cursor-pointer text-[#FF6B00]"
                            title={`Remove exclusion for ${tag}`}
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                      <button
                        type="button"
                        onClick={() => setExcludedKeywords([])}
                        className="text-[11px] text-slate-400 hover:text-slate-600 underline ml-1 cursor-pointer"
                      >
                        Clear exclusions
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Creators Grid / Loading Indicator */}
              {loading ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col items-center justify-center">
                  <Loader2 className="w-8 h-8 text-[#FF6B00] animate-spin mb-3" />
                  <h3 className="font-bold text-sm text-slate-800">Connecting to Supabase Database...</h3>
                  <p className="text-xs text-slate-400 mt-1">Loading verified AI creators, model pipelines & portfolio reels</p>
                </div>
              ) : filteredCreators.length === 0 ? (
                <div className="text-center py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <Search className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <h3 className="font-bold text-sm text-slate-700">No creators matched your search query</h3>
                  <p className="text-xs text-slate-400 mt-1">Try broadening your model tool or score criteria.</p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedTool('all');
                      setSelectedScore('all');
                      setSelectedContentType('all');
                      setSelectedAspectRatio('all');
                      setExcludedKeywords([]);
                      setCurrentExclusionInput('');
                    }}
                    className="mt-4 px-4 py-2 bg-[#FF6B00] hover:bg-[#E05E00] text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer"
                  >
                    Clear All Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredCreators.map((creator) => (
                    <div 
                      key={creator.id} 
                      className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-sm hover:border-orange-300 hover:shadow-md transition-all flex flex-col justify-between"
                    >
                      <div>
                        {/* Video Reel Preview */}
                        <div className="aspect-video bg-slate-900 relative group overflow-hidden">
                          <video 
                            src={creator.sampleMedia} 
                            autoPlay 
                            loop 
                            muted 
                            playsInline 
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-semibold text-white flex items-center gap-1.5">
                            <Zap className="w-3 h-3 text-[#FF6B00]" />
                            <span>{creator.contentType}</span>
                          </div>
                          <div className="absolute top-3 right-3 flex items-center gap-1.5 flex-wrap">
                            {creator.verified !== false && (
                              <VerifiedWorkflowBadge className="bg-black/70 text-emerald-300 border-emerald-500/40 backdrop-blur-md" />
                            )}
                            <AICreatorScoreBadge score={creator.score} />
                          </div>
                          <button
                            onClick={() => setSelectedAssetForInspect({
                              ...creator,
                              title: `${creator.name} – Verified Reel & Workflow`,
                              prompt: creator.samplePrompt,
                              mediaUrl: creator.sampleMedia
                            })}
                            className="absolute bottom-3 right-3 bg-black/70 hover:bg-black/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-semibold text-white hover:text-orange-300 flex items-center gap-1 transition-all cursor-pointer shadow-sm"
                          >
                            🔍 Inspect Workflow
                          </button>
                        </div>

                        {/* Creator Bio Header */}
                        <div className="p-4">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="flex items-center gap-3">
                              <img 
                                src={creator.avatar} 
                                alt={creator.name} 
                                className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-sm"
                              />
                              <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1">
                                    {creator.name}
                                  </h3>
                                  <VerificationBadge type="workflow" size="sm" />
                                  {(creator.ai_creator_score || creator.score) && (
                                    <VerificationBadge type="score" score={creator.ai_creator_score || creator.score || 96} size="sm" />
                                  )}
                                  <VerificationBadge type="certified_pipeline" size="sm" />
                                </div>
                                <p className="text-[11px] text-slate-500 mt-0.5">{creator.title}</p>
                              </div>
                            </div>
                            <div className="text-right flex flex-col items-end gap-1">
                              <span className="text-xs font-black text-slate-900">{creator.hourlyRate}</span>
                              <div className="flex items-center gap-1.5 flex-wrap justify-end">
                                <div className="flex items-center gap-0.5 text-amber-500 text-[10px] font-bold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60">
                                  <Star className="w-3 h-3 fill-amber-500" />
                                  <span>{creator.rating}</span>
                                  <span className="text-slate-400 font-normal">({creator.completedGigs})</span>
                                </div>
                                <AICreatorScoreBadge score={creator.score} />
                              </div>
                            </div>
                          </div>

                          {/* Tools & Pipeline tags */}
                          <div className="flex flex-wrap gap-1.5 my-3">
                            {creator.primaryTools.map((t, idx) => (
                              <span key={idx} className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-orange-50 text-[#FF6B00] border border-orange-100">
                                {t}
                              </span>
                            ))}
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                              {creator.aspectRatios.join(', ')}
                            </span>
                          </div>

                          {/* Prompt Preview Snippet */}
                          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/60 mb-2">
                            <div className="flex items-center justify-between mb-0.5">
                              <span className="text-[10px] font-bold text-slate-400 uppercase">Verified Prompt Snippet</span>
                              <button 
                                onClick={() => setSelectedAssetForInspect({
                                  ...creator,
                                  title: `${creator.name} – Verified Reel & Workflow`,
                                  prompt: creator.samplePrompt,
                                  mediaUrl: creator.sampleMedia
                                })} 
                                className="text-xs text-[#FF6B00] flex items-center gap-1 font-semibold hover:underline cursor-pointer"
                              >
                                🔍 Inspect Prompt & Seed
                              </button>
                            </div>
                            <p className="text-[11px] font-mono text-slate-600 line-clamp-2">
                              {creator.samplePrompt}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Card Action Buttons */}
                      <div className="p-4 pt-0 grid grid-cols-2 gap-2">
                        <button
                          onClick={() => setSelectedAssetForInspect({
                            ...creator,
                            title: `${creator.name} – Verified Reel & Workflow`,
                            prompt: creator.samplePrompt,
                            mediaUrl: creator.sampleMedia
                          })}
                          className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1"
                        >
                          🔍 Inspect Prompt & Seed
                        </button>
                        <button
                          onClick={() => handleSendOffer(creator)}
                          className="w-full py-2 bg-[#FF6B00] hover:bg-[#E05E00] text-white text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1"
                        >
                          <Send className="w-3 h-3" />
                          <span>Send Offer</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ================= TAB 2: AI RECOMMENDATION AGENT ================= */}
          {activeTab === 'matchmaker' && (
            <div className="space-y-6">
              {/* Campaign Requirement Builder Card */}
              <div className="p-6 bg-gradient-to-br from-orange-50/60 via-white to-slate-50 rounded-2xl border border-orange-200/80 shadow-sm">
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-8 h-8 rounded-xl bg-[#FF6B00] text-white flex items-center justify-center shadow-sm">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-extrabold text-slate-900">AI Match & Recommendation Agent</h2>
                    <p className="text-xs text-slate-500">Define campaign specs to score and rank verified creators automatically.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Campaign Goal / Brief Title</label>
                    <input 
                      type="text"
                      value={campaignGoal}
                      onChange={(e) => setCampaignGoal(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-[#FF6B00]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Target Visual Style</label>
                    <input 
                      type="text"
                      value={targetStyle}
                      onChange={(e) => setTargetStyle(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-[#FF6B00]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Preferred Model Pipeline</label>
                    <select
                      value={preferredTool}
                      onChange={(e) => setPreferredTool(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-[#FF6B00] cursor-pointer"
                    >
                      <option>Runway Gen-3 Alpha</option>
                      <option>Flux.1 Dev</option>
                      <option>Kling AI 1.5</option>
                      <option>Sora</option>
                      <option>Midjourney v6</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Target Aspect Ratio</label>
                    <select
                      value={targetAspect}
                      onChange={(e) => setTargetAspect(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-[#FF6B00] cursor-pointer"
                    >
                      <option>16:9</option>
                      <option>9:16</option>
                      <option>1:1</option>
                      <option>4:5</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Agreed Campaign Escrow Budget</label>
                    <select
                      value={budgetTier}
                      onChange={(e) => setBudgetTier(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-[#FF6B00] cursor-pointer"
                    >
                      <option>$2,200 (Standard)</option>
                      <option>$3,500 (Commercial)</option>
                      <option>$4,500 (Enterprise Tier)</option>
                      <option>$7,500 (Full Campaign Suite)</option>
                    </select>
                  </div>

                  <div className="flex items-end">
                    <button
                      onClick={runAIMatchingAgent}
                      disabled={isMatching}
                      className="w-full py-2.5 bg-[#FF6B00] hover:bg-[#E05E00] active:bg-[#c2410c] text-white text-xs font-bold rounded-xl shadow-md shadow-orange-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                    >
                      <Sparkles className={`w-3.5 h-3.5 ${isMatching ? 'animate-spin' : ''}`} />
                      <span>{isMatching ? 'Calculating AI Match Scores...' : 'Run AI Matching Agent →'}</span>
                    </button>
                  </div>

                  {excludedKeywords.length > 0 && (
                    <div className="col-span-1 md:col-span-3 pt-2 border-t border-orange-200/40 flex items-center gap-2 text-xs text-slate-600 flex-wrap">
                      <span className="font-bold text-slate-700">Enforced Search Exclusions:</span>
                      <div className="flex flex-wrap gap-1.5 items-center">
                        {excludedKeywords.map((tag) => (
                          <span key={tag} className="bg-orange-500/10 text-[#FF6B00] border border-orange-500/20 px-2 py-0.5 rounded text-[11px] font-semibold flex items-center gap-1">
                            <span>{tag}</span>
                            <button 
                              type="button" 
                              onClick={() => handleRemoveExclusion(tag)} 
                              className="hover:text-red-500 cursor-pointer text-xs"
                              title={`Remove ${tag}`}
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Recommendations Ranked List */}
              {matchResults && (
                <div className="space-y-4 animate-fade-in">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-slate-200 gap-2">
                    <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                      <span>Ranked Recommendations for "{campaignGoal}"</span>
                      <span className="text-xs text-[#FF6B00] bg-orange-100 px-2 py-0.5 rounded-full font-bold">
                        {matchResults.length} Matches Found
                      </span>
                    </h3>

                    {matchingReport && (
                      <button
                        onClick={() => setIsReportModalOpen(true)}
                        className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                      >
                        <FileText className="w-3.5 h-3.5 text-[#FF6B00]" />
                        <span>View Matching & Requirements Report</span>
                      </button>
                    )}
                  </div>

                  <div className="space-y-3">
                    {matchResults.map((creator, idx) => (
                      <div 
                        key={creator.id}
                        className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-orange-300 transition-all"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-slate-900 text-white font-black text-xs flex items-center justify-center shrink-0">
                            #{idx + 1}
                          </div>
                          <img 
                            src={creator.avatar} 
                            alt={creator.name} 
                            className="w-12 h-12 rounded-full object-cover border border-slate-200 shadow-sm"
                          />
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="font-bold text-sm text-slate-900">{creator.name}</h4>
                              <VerificationBadge type="workflow" size="sm" />
                              {(creator.ai_creator_score || creator.score) && (
                                <VerificationBadge type="score" score={creator.ai_creator_score || creator.score || 96} size="sm" />
                              )}
                              <VerificationBadge type="certified_pipeline" size="sm" />
                              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                                {creator.matchPercentage}% Match
                              </span>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                creator.eligibilityStatus === 'Eligible'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : creator.eligibilityStatus === 'Requires Verification'
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-rose-100 text-rose-800'
                              }`}>
                                {creator.eligibilityStatus || 'Eligible'}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">{creator.title} • {creator.hourlyRate}</p>
                            
                            {/* Dimensional Breakdown Chips */}
                            {creator.dimensionScores && Object.keys(creator.dimensionScores).length > 0 && (
                              <div className="flex flex-wrap gap-1.5 mt-1.5 text-[10px]">
                                {creator.dimensionScores.skills !== undefined && (
                                  <span className="bg-slate-100 px-2 py-0.5 rounded font-mono text-slate-700">Skills: {creator.dimensionScores.skills}%</span>
                                )}
                                {creator.dimensionScores.tools !== undefined && (
                                  <span className="bg-slate-100 px-2 py-0.5 rounded font-mono text-slate-700">Tools: {creator.dimensionScores.tools}%</span>
                                )}
                                {creator.dimensionScores.style_and_format !== undefined && (
                                  <span className="bg-slate-100 px-2 py-0.5 rounded font-mono text-slate-700">Format: {creator.dimensionScores.style_and_format}%</span>
                                )}
                              </div>
                            )}

                            {/* Strengths & Gaps */}
                            {creator.strengths && creator.strengths.length > 0 && (
                              <div className="text-[11px] text-emerald-700 mt-1 flex items-center gap-1 font-medium">
                                <CheckCircle2 className="w-3 h-3 shrink-0" />
                                <span>{creator.strengths[0]}</span>
                              </div>
                            )}
                            {creator.gaps && creator.gaps.length > 0 && (
                              <div className="text-[11px] text-rose-600 mt-0.5 flex items-center gap-1 font-medium">
                                <AlertCircle className="w-3 h-3 shrink-0" />
                                <span>{creator.gaps[0]}</span>
                              </div>
                            )}
                            <span className="text-[10px] text-slate-400 font-normal block mt-1">
                              Weighted 7-dimension match (Explainable AI Engine v1)
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => setSelectedCreatorForModal(creator)}
                            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-all cursor-pointer"
                          >
                            Inspect Pipeline
                          </button>
                          <button
                            onClick={() => handleSendOffer(creator)}
                            className="px-4 py-2 bg-[#FF6B00] hover:bg-[#E05E00] text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>Instant Campaign Offer ({budgetTier})</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================= TAB 3: ACTIVE CONTRACTS ================= */}
          {activeTab === 'contracts' && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">Active Creator Engagements</h2>
                  <p className="text-xs text-slate-500">Live milestones, verified licensing rights, and commercial escrow deliveries.</p>
                </div>
                <span className="text-xs font-bold text-[#FF6B00] bg-orange-100 px-3 py-1 rounded-full">
                  {activeContracts.length} Active Contracts
                </span>
              </div>

              <div className="space-y-4">
                {activeContracts.map((contract) => (
                  <div 
                    key={contract.id} 
                    className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-start justify-between gap-4 hover:border-orange-200 transition-all"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <img 
                          src={contract.creatorAvatar} 
                          alt={contract.creatorName} 
                          className="w-10 h-10 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-extrabold text-sm text-slate-900">{contract.creatorName}</h3>
                            <BriefVersionBadge 
                              version={contract.briefVersion || 1} 
                              revisionCount={contract.revisionCount || 1} 
                              status={contract.status || 'pending'} 
                            />
                          </div>
                          <p className="text-xs text-slate-500 font-medium">{contract.campaignTitle}</p>
                        </div>
                      </div>

                      {/* Milestone Progress Bar */}
                      <div className="w-full max-w-md pt-2">
                        <div className="flex justify-between text-[11px] text-slate-600 mb-1 font-semibold">
                          <span>Milestone: {contract.milestone}</span>
                          <span className="text-[#FF6B00]">{contract.progress}%</span>
                        </div>
                        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                          <div 
                            className="bg-[#FF6B00] h-full rounded-full transition-all duration-500" 
                            style={{ width: `${contract.progress}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-3 text-[11px] text-slate-500 pt-1">
                        <span className="flex items-center gap-1 font-bold text-slate-800 bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-md border border-emerald-200">
                          <DollarSign className="w-3.5 h-3.5 text-emerald-600" /> Escrow: {contract.budget}
                        </span>
                        <span className="flex items-center gap-1 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                          <Clock className="w-3.5 h-3.5 text-slate-400" /> Deadline: {contract.deadline}
                        </span>
                        <span className="flex items-center gap-1 bg-white px-2 py-0.5 rounded-md border border-slate-200 font-semibold text-slate-700">
                          <ShieldCheck className="w-3.5 h-3.5 text-[#FF6B00]" /> {contract.licensing}
                        </span>
                      </div>

                      {/* Amber Banner when Creator Requests Clarification */}
                      {contract.status === 'clarification_requested' && (
                        <div className="mt-3 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                          <div className="flex items-start gap-2 text-amber-900">
                            <span className="text-base leading-none">⚠️</span>
                            <div>
                              <span className="font-bold">Creator requested clarification:</span>
                              <p className="text-amber-800 text-[11px] mt-0.5 font-medium italic">
                                "{contract.clarificationQuestions || 'Please review deliverable parameters and ComfyUI workflow format.'}"
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleOpenUpdateBrief(contract)}
                            className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-bold rounded-lg text-xs shadow-xs transition-all cursor-pointer shrink-0 flex items-center gap-1.5"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            <span>Update Brief Terms</span>
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="shrink-0 flex md:flex-col gap-2">
                      {contract.status === 'clarification_requested' && (
                        <button
                          onClick={() => handleOpenUpdateBrief(contract)}
                          className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Update Brief Terms</span>
                        </button>
                      )}

                      {contract.status !== 'confirmed' && (
                        <button
                          onClick={() => handleConfirmActiveTerms(contract)}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Confirm Active Terms</span>
                        </button>
                      )}

                      {contract.status === 'confirmed' && (
                        <span className="px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Terms Confirmed</span>
                        </span>
                      )}

                      <button
                        onClick={() => {
                          setActiveChatCreatorId(contract.chatId);
                          setActiveTab('messages');
                        }}
                        className="px-4 py-2.5 bg-[#FF6B00] hover:bg-[#E05E00] text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Open Workspace Chat</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= TAB 4: BRAND COMMUNICATIONS ================= */}
          {activeTab === 'messages' && (
            <div className="flex flex-col h-full min-h-[520px]">
              <div className="pb-4 mb-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">Brand-to-Creator Communications</h2>
                  <p className="text-xs text-slate-500">Live conversation threads with contracted and shortlisted talent.</p>
                </div>
                <span className="text-xs text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full font-semibold">
                  Active Direct Sessions
                </span>
              </div>

              {/* 2-Column Chat Layout */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 border border-slate-200/80 rounded-2xl overflow-hidden bg-slate-50/50 min-h-[440px]">
                {/* Left: Chat list */}
                <div className="border-r border-slate-200/80 bg-white p-3 space-y-1.5 overflow-y-auto">
                  <span className="text-[10px] font-bold uppercase text-slate-400 px-2 block mb-2">Active Creators</span>
                  {Object.entries(chatThreads).map(([chatId, chat]) => (
                    <button
                      key={chatId}
                      onClick={() => setActiveChatCreatorId(chatId)}
                      className={`w-full text-left p-3 rounded-xl transition-all cursor-pointer flex items-center gap-3 ${
                        activeChatCreatorId === chatId 
                          ? 'bg-orange-50 border border-orange-200 shadow-sm' 
                          : 'hover:bg-slate-50 border border-transparent'
                      }`}
                    >
                      <img 
                        src={chat.creatorAvatar} 
                        alt={chat.creatorName} 
                        className="w-10 h-10 rounded-full object-cover border border-slate-200"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-xs text-slate-900 truncate">{chat.creatorName}</h4>
                          {chat.unread && <span className="w-2 h-2 rounded-full bg-[#FF6B00]" />}
                        </div>
                        <p className="text-[11px] text-slate-500 truncate">{chat.campaign}</p>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Right: Live Chat Stream */}
                <div className="relative md:col-span-2 p-4 flex flex-col justify-between bg-slate-50 min-h-[420px]">
                  {currentChat ? (
                    <>
                      {/* Accepted-Only Communication Lockout Overlay */}
                      <ChatLockoutOverlay
                        status={currentChat.status || 'confirmed'}
                        role="company"
                        campaignTitle={currentChat.campaign}
                        onTriggerAction={() => setActiveTab('contracts')}
                      />

                      <div className="pb-3 mb-3 border-b border-slate-200/80 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img 
                            src={currentChat.creatorAvatar} 
                            alt={currentChat.creatorName} 
                            className="w-9 h-9 rounded-full object-cover border border-slate-200"
                          />
                          <div>
                            <h3 className="font-extrabold text-xs text-slate-900">{currentChat.creatorName}</h3>
                            <p className="text-[10px] text-slate-500">{currentChat.campaign}</p>
                          </div>
                        </div>
                        <div className={`text-[10px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5 ${
                          (currentChat.status === 'accepted' || currentChat.status === 'confirmed')
                            ? 'text-emerald-600 bg-emerald-50 border border-emerald-100'
                            : 'text-amber-700 bg-amber-50 border border-amber-200'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            (currentChat.status === 'accepted' || currentChat.status === 'confirmed')
                              ? 'bg-emerald-500 animate-pulse'
                              : 'bg-amber-500'
                          }`} />
                          <span>
                            {(currentChat.status === 'accepted' || currentChat.status === 'confirmed')
                              ? 'Connected Session'
                              : 'Pending Acceptance'}
                          </span>
                        </div>
                      </div>

                      {/* Messages Stream */}
                      <div className="flex-1 space-y-3 overflow-y-auto max-h-[300px] p-2">
                        {(chatMessages.length > 0
                          ? chatMessages.map((m) => ({
                              id: m.message_id || m.id,
                              sender: m.sender_role === 'company' ? 'brand' : 'creator',
                              author: m.sender_role === 'company' ? 'Apex Creative' : currentChat.creatorName,
                              text: m.text_content || m.content || m.text,
                              time: m.timestamp ? new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'
                            }))
                          : (currentChat?.messages || [])
                        ).map((m) => (
                          <div key={m.id} className={`flex flex-col ${m.sender === 'brand' ? 'items-end' : 'items-start'}`}>
                            <span className="text-[10px] text-slate-400 font-medium mb-1">{m.author} • {m.time}</span>
                            <div className={`p-3 rounded-2xl text-xs max-w-md ${
                              m.sender === 'brand' 
                                ? 'bg-[#FF6B00] text-white rounded-tr-none shadow-sm font-medium' 
                                : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none shadow-sm'
                            }`}>
                              {m.text}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Chat Input */}
                      <form onSubmit={handleSendMessage} className="mt-3 flex gap-2 pt-2 border-t border-slate-200/80">
                        <input 
                          type="text"
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          disabled={currentChat.status !== 'accepted' && currentChat.status !== 'confirmed'}
                          placeholder={
                            (currentChat.status !== 'accepted' && currentChat.status !== 'confirmed')
                              ? "Chat is locked until proposal is accepted"
                              : `Message ${currentChat.creatorName}...`
                          }
                          className="flex-1 bg-white border border-slate-200 focus:border-[#FF6B00] focus:ring-2 focus:ring-orange-500/20 rounded-xl px-4 py-2.5 text-xs text-slate-900 outline-none transition-all disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed"
                        />
                        <button
                          type="submit"
                          disabled={currentChat.status !== 'accepted' && currentChat.status !== 'confirmed'}
                          className="bg-[#FF6B00] hover:bg-[#E05E00] text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Send</span>
                        </button>
                      </form>
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-full text-slate-400 text-xs">
                      Select a creator thread to view messages.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ================= MODAL: CREATE CAMPAIGN BRIEF ================= */}
      {showCreateBriefModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full border border-slate-200 shadow-2xl relative max-h-[92vh] overflow-y-auto">
            <button 
              onClick={() => setShowCreateBriefModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center text-[#FF6B00]">
                <FileText className="w-4 h-4" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Post Campaign Creative Brief</h3>
            </div>
            <p className="text-xs text-slate-500 mb-5">Publish your requirements to match with verified generative artists.</p>

            {/* AI Brief Assistant (Gemini) Card */}
            <div className="mb-5 p-4 rounded-2xl bg-gradient-to-br from-orange-50/90 via-amber-50/40 to-slate-50 border border-orange-200 shadow-xs space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-[#FF6B00] text-white flex items-center justify-center">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">AI Brief Builder (Gemini 1.5 Flash)</h4>
                </div>
                <span className="text-[10px] font-semibold text-[#FF6B00] bg-orange-100 px-2 py-0.5 rounded-full">
                  Auto-Structures Ideas
                </span>
              </div>
              <p className="text-[11px] text-slate-600">
                Type or paste your messy campaign thoughts, product notes, or client goals. Gemini will convert them into Title, Budget, Target Audience, and Deliverables.
              </p>

              <div className="space-y-2">
                <textarea
                  id="raw-idea-input"
                  rows={3}
                  placeholder="e.g. Launching a high-end zero-sugar sparkling energy drink called 'Nova Surge'. Need 3x 15s cinematic cyberpunk video ads with fluid simulations, neon cityscapes, targeting Gen Z gamers. Total budget $4,500."
                  value={rawIdea}
                  onChange={(e) => setRawIdea(e.target.value)}
                  className="w-full bg-white border border-orange-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 outline-none focus:border-[#FF6B00] placeholder:text-slate-400 resize-none shadow-2xs"
                />

                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] text-slate-400">
                    {rawIdea.length > 0 ? `${rawIdea.length} characters` : 'Paste unformatted notes'}
                  </span>

                  <button
                    type="button"
                    id="generate-brief-btn"
                    onClick={handleGenerateBrief}
                    disabled={isGenerating || !rawIdea.trim()}
                    className="px-4 py-2 bg-[#FF6B00] hover:bg-[#E05E00] active:bg-[#c2410c] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Gemini is building your brief...</span>
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-3.5 h-3.5" />
                        <span>Generate with Gemini</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Status / Alert Feedback */}
              {briefStatus && (
                <div className={`p-2.5 rounded-xl text-xs flex items-center gap-2 ${
                  briefStatus.type === 'success' 
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                    : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}>
                  {briefStatus.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  )}
                  <span className="text-[11px] font-medium">{briefStatus.message}</span>
                </div>
              )}

              {/* Completeness & Clarifications Card */}
              {lastGeneratedBrief && (
                <div className="p-3 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                      <Sparkles className="w-3.5 h-3.5 text-[#FF6B00]" />
                      <span>Brief Quality & Completeness Audit</span>
                    </div>
                    <span className="text-xs font-black px-2 py-0.5 rounded-full bg-white border border-orange-200 text-[#FF6B00]">
                      Completeness: {lastGeneratedBrief.completeness_score ?? 85}/100
                    </span>
                  </div>

                  {Array.isArray(lastGeneratedBrief.missing_information) && lastGeneratedBrief.missing_information.length > 0 && (
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Identified Gaps:</span>
                      <div className="flex flex-wrap gap-1">
                        {lastGeneratedBrief.missing_information.map((item, i) => (
                          <span key={i} className="text-[10px] bg-white border border-orange-200 text-orange-800 px-2 py-0.5 rounded-md font-medium">
                            ⚠️ {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {Array.isArray(lastGeneratedBrief.clarification_questions) && lastGeneratedBrief.clarification_questions.length > 0 && (
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Recommended Follow-ups:</span>
                      <div className="text-[11px] text-slate-700 italic space-y-1 bg-white/80 p-2 rounded-lg border border-orange-100">
                        {lastGeneratedBrief.clarification_questions.slice(0, 2).map((q, i) => (
                          <p key={i}>• {q}</p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Campaign Form */}
            <form onSubmit={handleCreateBrief} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Campaign Title</label>
                <input 
                  type="text"
                  id="brief-title-input"
                  placeholder="e.g. 15s Cyberpunk Video Commercial"
                  value={newBrief.title}
                  onChange={(e) => setNewBrief(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 outline-none focus:border-[#FF6B00]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Budget Escrow</label>
                  <input 
                    type="text"
                    id="brief-budget-input"
                    placeholder="e.g. $4,500"
                    value={newBrief.budget}
                    onChange={(e) => setNewBrief(prev => ({ ...prev, budget: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-[#FF6B00]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Aspect Ratio</label>
                  <select
                    id="brief-aspect-ratio-select"
                    value={newBrief.aspectRatio}
                    onChange={(e) => setNewBrief(prev => ({ ...prev, aspectRatio: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none focus:border-[#FF6B00] cursor-pointer"
                  >
                    <option>16:9 (Cinematic 4K)</option>
                    <option>9:16 (Vertical Reels/TikTok)</option>
                    <option>1:1 (Square)</option>
                    <option>4:5 (Social)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Target Audience</label>
                <input 
                  type="text"
                  id="brief-target-audience-input"
                  placeholder="e.g. Gen Z competitive gamers and esports fans (16-25)"
                  value={newBrief.targetAudience}
                  onChange={(e) => setNewBrief(prev => ({ ...prev, targetAudience: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 outline-none focus:border-[#FF6B00]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Key Deliverables</label>
                <textarea 
                  rows={2}
                  id="brief-deliverables-input"
                  placeholder="e.g. 3x 15s 4K video ads, 5x teaser stills, prompt files"
                  value={newBrief.deliverables}
                  onChange={(e) => setNewBrief(prev => ({ ...prev, deliverables: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 outline-none focus:border-[#FF6B00] resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Required AI Tools / Models</label>
                <input 
                  type="text"
                  id="brief-required-tools-input"
                  placeholder="e.g. Runway Gen-3, Midjourney v6, Topaz 4K"
                  value={newBrief.requiredTools}
                  onChange={(e) => setNewBrief(prev => ({ ...prev, requiredTools: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 outline-none focus:border-[#FF6B00]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Detailed Style Guide & Prompt Directives</label>
                <textarea 
                  rows={3}
                  id="brief-style-input"
                  placeholder="Describe lighting, mood, camera trajectories, and commercial guidelines..."
                  value={newBrief.style}
                  onChange={(e) => setNewBrief(prev => ({ ...prev, style: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 outline-none focus:border-[#FF6B00] resize-none"
                  required
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  disabled={isPublishing}
                  className="flex-1 py-2.5 bg-[#FF6B00] hover:bg-[#E05E00] text-white font-bold rounded-xl text-xs transition-all shadow-sm cursor-pointer disabled:opacity-60 flex items-center justify-center gap-1.5"
                >
                  {isPublishing ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Publishing to Supabase...</span>
                    </>
                  ) : (
                    <span>Publish Campaign Brief</span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateBriefModal(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-all cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: VIEW PROMPTS & PIPELINE ================= */}
      {selectedCreatorForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-slate-200 shadow-2xl relative">
            <button 
              onClick={() => setSelectedCreatorForModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <img 
                src={selectedCreatorForModal.avatar} 
                alt={selectedCreatorForModal.name} 
                className="w-12 h-12 rounded-full object-cover border border-slate-200 shadow-sm"
              />
              <div>
                <h3 className="font-bold text-base text-slate-900">{selectedCreatorForModal.name}</h3>
                <p className="text-xs text-slate-500">{selectedCreatorForModal.title}</p>
              </div>
            </div>

            {/* Video preview */}
            <div className="aspect-video bg-slate-900 rounded-xl overflow-hidden mb-4 relative">
              <video 
                src={selectedCreatorForModal.sampleMedia} 
                autoPlay 
                loop 
                muted 
                playsInline 
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Full Generation Pipeline</span>
                <span className="font-bold text-slate-800">{selectedCreatorForModal.pipeline}</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Exact Verified Prompt</span>
                <p className="font-mono text-slate-700 text-[11px] leading-relaxed bg-white p-2 rounded-lg border border-slate-200/80">
                  {selectedCreatorForModal.samplePrompt}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-400 block text-[10px]">Generation Seed</span>
                  <span className="font-mono font-bold text-slate-800">{selectedCreatorForModal.seed}</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-400 block text-[10px]">AI Quality Score</span>
                  <span className="font-bold text-[#FF6B00]">{selectedCreatorForModal.score}/100</span>
                </div>
              </div>
            </div>

            <div className="pt-4 flex gap-2">
              <button
                onClick={() => {
                  handleSendOffer(selectedCreatorForModal);
                  setSelectedCreatorForModal(null);
                }}
                className="flex-1 py-2.5 bg-[#FF6B00] hover:bg-[#E05E00] text-white font-bold rounded-xl text-xs transition-all shadow-sm cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Campaign Offer</span>
              </button>
              <button
                onClick={() => setSelectedCreatorForModal(null)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Prompt & Seed Inspector Modal */}
      <PromptInspectorModal 
        isOpen={!!selectedAssetForInspect} 
        onClose={() => setSelectedAssetForInspect(null)} 
        item={selectedAssetForInspect} 
      />

      {/* AI Matching & Requirements Analysis Report Modal */}
      <MatchingReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        report={matchingReport}
      />

      {/* Update Brief Terms Modal */}
      {updateBriefModalContract && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in"
          onClick={() => setUpdateBriefModalContract(null)}
        >
          <div 
            className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setUpdateBriefModalContract(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-[#FF6B00] flex items-center justify-center shadow-xs">
                <Edit2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900 tracking-tight">Update Campaign Brief Terms</h3>
                <p className="text-xs text-slate-500">Revise deliverables or terms to address creator clarification.</p>
              </div>
            </div>

            {/* Creator Question Callout */}
            {updateBriefModalContract.clarificationQuestions && (
              <div className="my-3 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs space-y-1">
                <span className="font-bold text-amber-900 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  Creator's Clarification Query:
                </span>
                <p className="text-amber-800 text-[11px] italic pl-5.5">
                  "{updateBriefModalContract.clarificationQuestions}"
                </p>
              </div>
            )}

            <form onSubmit={handleSaveBriefUpdate} className="space-y-3.5 mt-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Deliverables & Format Specifications:
                </label>
                <textarea
                  rows={3}
                  value={updateBriefForm.deliverables}
                  onChange={(e) => setUpdateBriefForm({ ...updateBriefForm, deliverables: e.target.value })}
                  placeholder="e.g. 4K ProRes 422 master export, PNG alpha channels included, ComfyUI API seed workflows bundled."
                  className="w-full bg-slate-50 border border-slate-200 focus:border-[#FF6B00] focus:ring-2 focus:ring-orange-500/20 rounded-xl p-3 text-xs text-slate-900 outline-none resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Revised Budget:
                  </label>
                  <input
                    type="text"
                    value={updateBriefForm.budget}
                    onChange={(e) => setUpdateBriefForm({ ...updateBriefForm, budget: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-[#FF6B00] rounded-xl px-3 py-2 text-xs text-slate-900 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Revised Deadline:
                  </label>
                  <input
                    type="text"
                    value={updateBriefForm.deadline}
                    onChange={(e) => setUpdateBriefForm({ ...updateBriefForm, deadline: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-[#FF6B00] rounded-xl px-3 py-2 text-xs text-slate-900 outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Clarification Notes & Guidelines:
                </label>
                <input
                  type="text"
                  value={updateBriefForm.clarification_notes}
                  onChange={(e) => setUpdateBriefForm({ ...updateBriefForm, clarification_notes: e.target.value })}
                  placeholder="e.g. Approved transparent PNG alphas and full commercial buyout rights."
                  className="w-full bg-slate-50 border border-slate-200 focus:border-[#FF6B00] rounded-xl px-3 py-2 text-xs text-slate-900 outline-none"
                />
              </div>

              {updateBriefError && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{updateBriefError}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setUpdateBriefModalContract(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdatingBrief}
                  className="px-5 py-2.5 bg-[#FF6B00] hover:bg-[#E05E00] text-white text-xs font-bold rounded-xl shadow-md shadow-orange-500/25 flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>
                    {isUpdatingBrief 
                      ? 'Updating...' 
                      : `Save & Increment to v${(updateBriefModalContract.briefVersion || 1) + 1}`}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
