import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  Cpu, 
  Hash, 
  Layers, 
  Ratio, 
  ExternalLink 
} from 'lucide-react';
import { VerifiedWorkflowBadge, CertifiedPipelineBadge, AICreatorScoreBadge } from './VerificationBadge';

export default function PromptInspectorModal({ isOpen, onClose, item }) {
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedSeed, setCopiedSeed] = useState(false);

  if (!isOpen || !item) return null;

  // Normalize item fields across creator profiles and portfolio items
  const title = item.title || item.name || 'Generative Workflow Spec';
  const mediaUrl = item.mediaUrl || item.sampleMedia || item.media_url;
  const promptText = item.prompt || item.samplePrompt || 'No prompt recorded for this asset.';
  const seedValue = item.seed || '482019482';
  const pipeline = item.pipeline || (Array.isArray(item.aiTools) ? item.aiTools.join(' ➔ ') : (item.tool || 'Prompt ➔ Generation ➔ Upscale'));
  const toolName = item.tool || (Array.isArray(item.primaryTools) ? item.primaryTools[0] : (Array.isArray(item.aiTools) ? item.aiTools[0] : 'Generative AI'));
  const aspectRatio = item.aspectRatio || (Array.isArray(item.aspectRatios) ? item.aspectRatios[0] : '16:9');
  const score = item.score || 98;
  const isVideo = !mediaUrl || mediaUrl.endsWith('.mp4') || mediaUrl.includes('video') || mediaUrl.includes('mixkit');

  const handleCopyPrompt = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(promptText);
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 2000);
    }
  };

  const handleCopySeed = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(String(seedValue));
      setCopiedSeed(true);
      setTimeout(() => setCopiedSeed(false), 2000);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden relative max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 pb-4 border-b border-slate-100 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#FF6B00] bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-100 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Prompt & Seed Inspector
              </span>
              {(item.verified_workflow !== false && item.verified !== false) && (
                <VerifiedWorkflowBadge />
              )}
              <CertifiedPipelineBadge />
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">{title}</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Modal Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          {/* Media Preview Box */}
          {mediaUrl && (
            <div className="aspect-video bg-slate-900 rounded-2xl overflow-hidden relative shadow-inner">
              {isVideo ? (
                <video 
                  src={mediaUrl} 
                  autoPlay 
                  loop 
                  muted 
                  playsInline 
                  className="w-full h-full object-cover"
                />
              ) : (
                <img 
                  src={mediaUrl} 
                  alt={title} 
                  className="w-full h-full object-cover" 
                />
              )}
              <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-semibold text-white flex items-center gap-1.5">
                <Cpu className="w-3 h-3 text-[#FF6B00]" />
                <span>{toolName}</span>
              </div>
              <div className="absolute top-3 right-3 flex items-center gap-1.5">
                {(item.verified_workflow !== false && item.verified !== false) && (
                  <VerifiedWorkflowBadge className="bg-black/70 text-emerald-300 border-emerald-500/40 backdrop-blur-md" />
                )}
                <AICreatorScoreBadge score={score} />
              </div>
            </div>
          )}

          {/* Prompt Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#FF6B00]" />
                Exact Generative Prompt
              </span>
              <button 
                onClick={handleCopyPrompt}
                className="text-xs font-semibold text-[#FF6B00] hover:text-[#E05E00] flex items-center gap-1 cursor-pointer transition-colors"
              >
                {copiedPrompt ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-600">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Prompt</span>
                  </>
                )}
              </button>
            </div>
            <div className="p-4 bg-slate-900 text-emerald-400 font-mono text-xs rounded-2xl border border-slate-800 leading-relaxed shadow-inner select-all overflow-x-auto whitespace-pre-wrap">
              {promptText}
            </div>
          </div>

          {/* Technical Workflow Parameters Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {/* Seed Card */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5 flex items-center gap-1">
                  <Hash className="w-3 h-3 text-slate-400" />
                  Generation Seed
                </span>
                <span className="font-mono font-bold text-slate-900 text-sm">{seedValue}</span>
              </div>
              <button 
                onClick={handleCopySeed}
                className="p-2 hover:bg-slate-200 rounded-xl text-slate-500 transition-all cursor-pointer"
                title="Copy Seed"
              >
                {copiedSeed ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* Aspect Ratio Card */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5 flex items-center gap-1">
                <Ratio className="w-3 h-3 text-slate-400" />
                Aspect Ratio
              </span>
              <span className="font-semibold text-slate-900 text-sm">{aspectRatio}</span>
            </div>

            {/* Pipeline Card */}
            <div className="sm:col-span-2 p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1 flex items-center gap-1">
                <Layers className="w-3 h-3 text-slate-400" />
                Workflow Pipeline
              </span>
              <span className="font-semibold text-slate-800 text-xs block leading-relaxed">{pipeline}</span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-2.5">
          <button 
            onClick={onClose}
            className="px-5 py-2.5 bg-white hover:bg-slate-100 text-slate-700 font-bold rounded-xl text-xs border border-slate-200 transition-all cursor-pointer shadow-xs"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
}
