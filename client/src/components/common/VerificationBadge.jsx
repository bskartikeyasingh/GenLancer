import React from 'react';
import { CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

/**
 * Universal AI Trust & Verification Badge Component
 * Types:
 * - 'workflow' | 'verified_workflow': "✓ Verified Workflow" (green)
 * - 'certified_pipeline' | 'pipeline': "Certified Pipeline" (blue)
 * - 'score' | 'ai_creator_score': "AI Score: {score}/100" (orange gradient)
 */
export default function VerificationBadge({ 
  type = 'workflow', 
  score = 96, 
  size = 'sm', 
  className = '' 
}) {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm font-extrabold'
  }[size] || 'px-2 py-0.5 text-[10px]';

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4'
  }[size] || 'w-3 h-3';

  if (type === 'score' || type === 'ai_creator_score') {
    return (
      <span className={`inline-flex items-center gap-1 rounded-full font-black bg-gradient-to-r from-[#FF6B00] to-amber-500 text-white shadow-xs tracking-tight ${sizeClasses} ${className}`}>
        <Sparkles className={`${iconSizes} text-white shrink-0`} />
        <span>AI Score: {score || 96}/100</span>
      </span>
    );
  }

  if (type === 'certified_pipeline' || type === 'pipeline') {
    return (
      <span className={`inline-flex items-center gap-1 rounded-full font-bold bg-blue-50 text-blue-700 border border-blue-200/90 shadow-xs tracking-tight ${sizeClasses} ${className}`}>
        <ShieldCheck className={`${iconSizes} text-blue-600 shrink-0`} />
        <span>Certified Pipeline</span>
      </span>
    );
  }

  // Default: type === 'workflow' || type === 'verified_workflow'
  return (
    <span className={`inline-flex items-center gap-1 rounded-full font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/90 shadow-xs tracking-tight ${sizeClasses} ${className}`}>
      <CheckCircle2 className={`${iconSizes} text-emerald-600 shrink-0`} />
      <span>✓ Verified Workflow</span>
    </span>
  );
}

// Named exports for backwards compatibility
export function VerifiedWorkflowBadge({ className = '', size = 'sm' }) {
  return <VerificationBadge type="workflow" size={size} className={className} />;
}

export function CertifiedPipelineBadge({ className = '', size = 'sm' }) {
  return <VerificationBadge type="certified_pipeline" size={size} className={className} />;
}

export function AICreatorScoreBadge({ score = 98, className = '', size = 'sm' }) {
  return <VerificationBadge type="score" score={score} size={size} className={className} />;
}
