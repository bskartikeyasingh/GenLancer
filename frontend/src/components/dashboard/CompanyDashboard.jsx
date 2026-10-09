import React, { useState } from 'react';
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
  Briefcase
} from 'lucide-react';
import GenLancerLogo from '../auth/GenLancerLogo';

export default function CompanyDashboard({ onLogout, onSwitchToCreator }) {
  const [activeTab, setActiveTab] = useState('directory'); // 'directory' | 'matchmaker' | 'contracts' | 'messages'
  
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTool, setSelectedTool] = useState('all');
  const [selectedScore, setSelectedScore] = useState('all');
  const [selectedContentType, setSelectedContentType] = useState('all');
  const [selectedAspectRatio, setSelectedAspectRatio] = useState('all');

  // Modals
  const [showCreateBriefModal, setShowCreateBriefModal] = useState(false);
  const [selectedCreatorForModal, setSelectedCreatorForModal] = useState(null);

  // AI Matching Agent State
  const [isMatching, setIsMatching] = useState(false);
  const [matchResults, setMatchResults] = useState(null);
  const [campaignGoal, setCampaignGoal] = useState('15s Cyberpunk Beverage Ad Campaign');
  const [targetStyle, setTargetStyle] = useState('Photorealistic Neon Cyberpunk with Fluid Dynamics');
  const [preferredTool, setPreferredTool] = useState('Runway Gen-3 Alpha');
  const [targetAspect, setTargetAspect] = useState('16:9');
  const [budgetTier, setBudgetTier] = useState('$4,500');

  // New Brief Form State
  const [newBrief, setNewBrief] = useState({
    title: '',
    company: 'Apex Creative Agency',
    budget: '$3,500',
    deadline: 'Nov 30, 2026',
    aspectRatio: '16:9',
    style: '',
    requiredTools: 'Runway Gen-3 Alpha, Midjourney v6'
  });

  // Mock Creators Database
  const [creators, setCreators] = useState([
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
      primaryTools: ['Runway Gen-3 Alpha', 'Midjourney v6', 'Topaz 4K'],
      contentType: 'Video',
      aspectRatios: ['16:9', '9:16'],
      sampleMedia: 'https://assets.mixkit.co/videos/preview/mixkit-cyberpunk-neon-city-street-41804-large.mp4',
      pipeline: 'Midjourney v6 ➔ Runway Gen-3 ➔ Topaz 4K',
      samplePrompt: '/imagine prompt: futuristic mega-city at night, neon reflections in rainwater, anamorphic cinematic 8k --ar 16:9',
      seed: '482019482',
      verified: true
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
      primaryTools: ['Flux.1 Dev', 'ComfyUI', 'SDXL'],
      contentType: 'Static Graphics',
      aspectRatios: ['1:1', '4:5'],
      sampleMedia: 'https://assets.mixkit.co/videos/preview/mixkit-hand-holding-a-glowing-futuristic-device-41805-large.mp4',
      pipeline: 'Flux.1 Dev ➔ ControlNet Depth ➔ Blender Compositor',
      samplePrompt: 'close-up portrait of android with exposed copper neural cables, volumetric amber lighting, macro photography',
      seed: '99102412',
      verified: true
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
      primaryTools: ['Kling AI 1.5', 'Luma Dream Machine', 'Blender'],
      contentType: 'Video',
      aspectRatios: ['16:9', '9:16', '1:1'],
      sampleMedia: 'https://assets.mixkit.co/videos/preview/mixkit-futuristic-flying-car-in-a-cyberpunk-city-41807-large.mp4',
      pipeline: 'Blender ➔ Kling AI 1.5 ➔ After Effects',
      samplePrompt: 'cinematic drone follow shot of high-tech flying vehicle gliding over glowing obsidian skyscrapers',
      seed: '772183921',
      verified: true
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
      primaryTools: ['Sora', 'Runway Gen-3 Alpha', 'Topaz 4K'],
      contentType: 'Video',
      aspectRatios: ['16:9', '9:16'],
      sampleMedia: 'https://assets.mixkit.co/videos/preview/mixkit-abstract-laser-light-show-41808-large.mp4',
      pipeline: 'Sora ➔ Topaz AI ➔ DaVinci Resolve',
      samplePrompt: 'photorealistic cinematic commercial shot, fluid amber beverage splashing with hyper-detailed crystal droplets',
      seed: '10928374',
      verified: true
    }
  ]);

  // Active Contracts State
  const [activeContracts, setActiveContracts] = useState([
    {
      id: 'cnt-1',
      creatorName: 'Alex Smith',
      creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300',
      campaignTitle: 'Volt Energy Cyberpunk Beverage Ad',
      budget: '$4,500',
      deadline: 'Nov 15, 2026',
      progress: 65,
      milestone: 'Video Render In Progress',
      licensing: 'Full Commercial Ownership Verified',
      chatId: 'alex-smith'
    },
    {
      id: 'cnt-2',
      creatorName: 'Sophia Chen',
      creatorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300',
      campaignTitle: 'Luxury Autumn Skincare 4K Stills',
      budget: '$3,200',
      deadline: 'Nov 20, 2026',
      progress: 90,
      milestone: 'Final Commercial Approval',
      licensing: 'Full Commercial Ownership Verified',
      chatId: 'sophia-chen'
    }
  ]);

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
      unread: true,
      messages: [
        { id: 1, sender: 'creator', author: 'Sophia Chen', text: 'Hi Apex team! The Topaz 4K upscales for the 10 skincare keyframes have been uploaded to the shared escrow vault.', time: 'Yesterday' },
        { id: 2, sender: 'brand', author: 'Apex Creative', text: 'Reviewing now Sophia! The lighting in frame #4 is spectacular.', time: 'Yesterday' }
      ]
    }
  });

  // Filter Logic
  const filteredCreators = creators.filter((c) => {
    // Search query match
    const matchesQuery = 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.primaryTools.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      c.samplePrompt.toLowerCase().includes(searchQuery.toLowerCase());

    // Tool filter
    const matchesTool = selectedTool === 'all' || c.primaryTools.some(t => t.toLowerCase().includes(selectedTool.toLowerCase()));

    // Score filter
    const matchesScore = 
      selectedScore === 'all' || 
      (selectedScore === '90' && c.score >= 90) ||
      (selectedScore === '95' && c.score >= 95) ||
      (selectedScore === '98' && c.score >= 98);

    // Content Type filter
    const matchesContentType = selectedContentType === 'all' || c.contentType === selectedContentType;

    // Aspect Ratio filter
    const matchesAspectRatio = selectedAspectRatio === 'all' || c.aspectRatios.includes(selectedAspectRatio);

    return matchesQuery && matchesTool && matchesScore && matchesContentType && matchesAspectRatio;
  });

  // Run AI Recommendation Matcher Engine
  const runAIMatchingAgent = () => {
    setIsMatching(true);
    setTimeout(() => {
      setIsMatching(false);
      // Client-side intelligent scoring
      const ranked = creators.map((c) => {
        let matchScore = 80;
        let reasons = [];

        if (c.primaryTools.includes(preferredTool)) {
          matchScore += 12;
          reasons.push(`Specialized in ${preferredTool}`);
        }
        if (c.aspectRatios.includes(targetAspect)) {
          matchScore += 5;
          reasons.push(`${targetAspect} format verified`);
        }
        if (c.score >= 95) {
          matchScore += Math.floor((c.score - 90) / 2);
          reasons.push(`Top-tier ${c.score}/100 quality rating`);
        }

        matchScore = Math.min(99, matchScore);

        return {
          ...c,
          matchPercentage: matchScore,
          matchReason: `⚡ ${matchScore}% Match: ${reasons.join(' & ')}`
        };
      }).sort((a, b) => b.matchPercentage - a.matchPercentage);

      setMatchResults(ranked);
    }, 1000);
  };

  // Instant Hire / Offer Action
  const handleSendOffer = (creator) => {
    const newContract = {
      id: `cnt-${Date.now()}`,
      creatorName: creator.name,
      creatorAvatar: creator.avatar,
      campaignTitle: campaignGoal,
      budget: budgetTier,
      deadline: 'Dec 1, 2026',
      progress: 10,
      milestone: 'Brief Accepted & Escrow Created',
      licensing: 'Full Commercial Ownership Verified',
      chatId: creator.id
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
          messages: [
            { id: 1, sender: 'brand', author: 'Apex Creative', text: `Hi ${creator.name}! We were matched with your profile via GenLancer AI Matcher. We have funded a ${budgetTier} escrow for "${campaignGoal}". Looking forward to collaborating!`, time: 'Just now' }
          ]
        }
      }));
    }

    setActiveChatCreatorId(creator.id);
    setActiveTab('messages');
  };

  // Handle Send Chat
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    setChatThreads(prev => ({
      ...prev,
      [activeChatCreatorId]: {
        ...prev[activeChatCreatorId],
        messages: [
          ...prev[activeChatCreatorId].messages,
          { id: Date.now(), sender: 'brand', author: 'Apex Creative', text: chatInput, time: 'Just now' }
        ]
      }
    }));
    setChatInput('');
  };

  // Handle Create Brief
  const handleCreateBrief = (e) => {
    e.preventDefault();
    alert(`🎉 Campaign Brief "${newBrief.title}" created successfully! It is now live on the GenLancer marketplace.`);
    setShowCreateBriefModal(false);
    setNewBrief({
      title: '',
      company: 'Apex Creative Agency',
      budget: '$3,500',
      deadline: 'Nov 30, 2026',
      aspectRatio: '16:9',
      style: '',
      requiredTools: 'Runway Gen-3 Alpha, Midjourney v6'
    });
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
                  {(searchQuery || selectedTool !== 'all' || selectedScore !== 'all' || selectedContentType !== 'all' || selectedAspectRatio !== 'all') && (
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedTool('all');
                        setSelectedScore('all');
                        setSelectedContentType('all');
                        setSelectedAspectRatio('all');
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
              </div>

              {/* Creators Grid */}
              {filteredCreators.length === 0 ? (
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
                          <div className="absolute top-3 right-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-2.5 py-0.5 rounded-full text-[10px] font-black shadow-sm">
                            Score: {creator.score}/100
                          </div>
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
                                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1">
                                  {creator.name}
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                </h3>
                                <p className="text-[11px] text-slate-500">{creator.title}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="text-xs font-black text-slate-900">{creator.hourlyRate}</span>
                              <div className="flex items-center gap-0.5 text-amber-500 text-[10px] font-bold">
                                <Star className="w-3 h-3 fill-amber-500" />
                                <span>{creator.rating}</span>
                                <span className="text-slate-400 font-normal">({creator.completedGigs})</span>
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
                            <span className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">Verified Prompt Snippet</span>
                            <p className="text-[11px] font-mono text-slate-600 line-clamp-2">
                              {creator.samplePrompt}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Card Action Buttons */}
                      <div className="p-4 pt-0 grid grid-cols-2 gap-2">
                        <button
                          onClick={() => setSelectedCreatorForModal(creator)}
                          className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-all cursor-pointer"
                        >
                          View Prompts & Seeds
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
                </div>
              </div>

              {/* Recommendations Ranked List */}
              {matchResults && (
                <div className="space-y-4 animate-fade-in">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                    <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                      <span>Ranked Recommendations for "{campaignGoal}"</span>
                      <span className="text-xs text-[#FF6B00] bg-orange-100 px-2 py-0.5 rounded-full font-bold">
                        {matchResults.length} Matches Found
                      </span>
                    </h3>
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
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-sm text-slate-900">{creator.name}</h4>
                              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                                {creator.matchPercentage}% Match
                              </span>
                            </div>
                            <p className="text-xs text-slate-500">{creator.title} • {creator.hourlyRate}</p>
                            <span className="text-[11px] text-[#FF6B00] font-semibold block mt-1">
                              {creator.matchReason}
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
                    className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-orange-200 transition-all"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <img 
                          src={contract.creatorAvatar} 
                          alt={contract.creatorName} 
                          className="w-10 h-10 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <h3 className="font-extrabold text-sm text-slate-900">{contract.creatorName}</h3>
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
                    </div>

                    <div className="shrink-0 flex md:flex-col gap-2">
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
                <div className="md:col-span-2 p-4 flex flex-col justify-between bg-slate-50">
                  {currentChat ? (
                    <>
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
                        <div className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span>Connected Session</span>
                        </div>
                      </div>

                      {/* Messages Stream */}
                      <div className="flex-1 space-y-3 overflow-y-auto max-h-[300px] p-2">
                        {currentChat.messages.map((m) => (
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
                          placeholder={`Message ${currentChat.creatorName}...`}
                          className="flex-1 bg-white border border-slate-200 focus:border-[#FF6B00] focus:ring-2 focus:ring-orange-500/20 rounded-xl px-4 py-2.5 text-xs text-slate-900 outline-none transition-all"
                        />
                        <button
                          type="submit"
                          className="bg-[#FF6B00] hover:bg-[#E05E00] text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
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
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-slate-200 shadow-2xl relative">
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

            <form onSubmit={handleCreateBrief} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Campaign Title</label>
                <input 
                  type="text"
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
                <label className="block text-xs font-bold text-slate-700 mb-1">Required AI Tools / Models</label>
                <input 
                  type="text"
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
                  className="flex-1 py-2.5 bg-[#FF6B00] hover:bg-[#E05E00] text-white font-bold rounded-xl text-xs transition-all shadow-sm cursor-pointer"
                >
                  Publish Campaign Brief
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

    </div>
  );
}
