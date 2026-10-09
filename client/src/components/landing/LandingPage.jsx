import React from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Layers, 
  Cpu, 
  Play, 
  CheckCircle2, 
  Star, 
  Zap, 
  Search, 
  Bot, 
  Coins, 
  Building2, 
  ChevronRight,
  TrendingUp,
  Award
} from 'lucide-react';
import GenLancerLogo from '../auth/GenLancerLogo';

export default function LandingPage({ 
  onNavigateToLogin, 
  onNavigateToRegister,
  onNavigateToBrandRegister,
  onNavigateToCreatorRegister
}) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 selection:bg-[#FF6B00] selection:text-white relative overflow-x-hidden">
      {/* Background delicate dot grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#CBD5E1_1.2px,transparent_1.2px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

      {/* Warm ambient glows in background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-orange-200/25 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-[800px] right-0 w-[500px] h-[500px] bg-amber-200/20 rounded-full blur-[120px] pointer-events-none" />

      {/* ================= HEADER / NAVBAR ================= */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <div className="cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <GenLancerLogo className="w-10 h-10" textColor="text-slate-900" />
          </div>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-bold text-slate-600">
            <a href="#features" className="hover:text-[#FF6B00] transition-colors">Features</a>
            <a href="#marketplace" className="hover:text-[#FF6B00] transition-colors">Creator Directory</a>
            <a href="#workflow" className="hover:text-[#FF6B00] transition-colors">AI Matchmaker</a>
            <a href="#guarantee" className="hover:text-[#FF6B00] transition-colors">Commercial Escrow</a>
          </nav>

          {/* Auth Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={onNavigateToLogin}
              className="px-4 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
            >
              Log In
            </button>
            <button
              onClick={() => onNavigateToRegister ? onNavigateToRegister('freelancer') : (onNavigateToCreatorRegister ? onNavigateToCreatorRegister() : null)}
              className="px-4 py-2 bg-[#FF6B00] hover:bg-[#E05E00] active:bg-[#c2410c] text-white text-xs font-bold rounded-xl shadow-md shadow-orange-500/25 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>Sign Up</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* ================= HERO SECTION ================= */}
      <section className="relative z-10 pt-12 pb-20 md:pt-18 md:pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Hero Typography & Actions */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100/80 border border-orange-200 text-[#FF6B00] text-xs font-bold shadow-sm">
              <Zap className="w-3.5 h-3.5 fill-[#FF6B00]" />
              <span>The Premier Generative AI Talent Standard</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
              Hire Verified <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B00] via-orange-500 to-amber-500">
                Generative AI
              </span> Creators.
            </h1>

            {/* Subtitle */}
            <p className="text-slate-600 text-sm sm:text-base md:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Connect with top 1% AI filmmakers, prompt engineers, and synthetic media directors. Every deliverable includes verified model pipelines, seeds, and full commercial copyright indemnification.
            </p>

            {/* Dual CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <button
                onClick={() => onNavigateToBrandRegister ? onNavigateToBrandRegister() : (onNavigateToRegister && onNavigateToRegister('company'))}
                className="w-full sm:w-auto px-6 py-3.5 bg-[#FF6B00] hover:bg-[#E05E00] active:bg-[#c2410c] text-white font-bold rounded-2xl text-sm transition-all shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Find AI Creators</span>
                <ArrowRight className="w-4 h-4 font-bold" />
              </button>

              <button
                onClick={() => onNavigateToCreatorRegister ? onNavigateToCreatorRegister() : (onNavigateToRegister && onNavigateToRegister('freelancer'))}
                className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-800 border-2 border-slate-200 hover:border-orange-300 font-bold rounded-2xl text-sm transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#FF6B00]" />
                <span>Join as Creator</span>
              </button>
            </div>

            {/* Trust Badges Strip */}
            <div className="pt-6 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-500">
              <div className="flex items-center gap-1.5 font-semibold text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Verified Prompt Metadata</span>
              </div>
              <div className="flex items-center gap-1.5 font-semibold text-slate-700">
                <ShieldCheck className="w-4 h-4 text-[#FF6B00]" />
                <span>100% Commercial Escrow</span>
              </div>
              <div className="flex items-center gap-1.5 font-semibold text-slate-700">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>4.98/5 Agency Rating</span>
              </div>
            </div>
          </div>

          {/* Right Hero Visual: GenLancer Master Logo Emblem */}
          <div className="lg:col-span-5 flex items-center justify-center relative py-4 lg:py-8">
            {/* Subtle ambient warm glow aura */}
            <div className="absolute w-72 h-72 sm:w-96 sm:h-96 bg-gradient-to-tr from-orange-300/30 to-amber-200/25 rounded-full blur-[100px] -z-10 pointer-events-none" />

            {/* Master Brand Emblem Container */}
            <div className="relative flex items-center justify-center p-4 sm:p-8 transition-transform duration-500 hover:scale-105 select-none">
              <GenLancerLogo 
                className="w-64 h-64 sm:w-80 sm:h-80 md:w-[380px] md:h-[380px] drop-shadow-2xl" 
                showText={false}
              />
            </div>
          </div>

        </div>
      </section>

      {/* ================= STATS COUNTER STRIP ================= */}
      <section className="border-y border-slate-200 bg-white py-8 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">$4.2M+</div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Paid to Generative Artists</p>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-[#FF6B00]">2,400+</div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Verified AI Creators</p>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">100%</div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Commercial IP Indemnification</p>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-600">4 Hours</div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Average Match-to-Hire Time</p>
          </div>
        </div>
      </section>

      {/* ================= VALUE PROPOSITIONS (3-COLUMN GRID) ================= */}
      <section id="features" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#FF6B00] block mb-2">
            Why GenLancer
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Built from scratch for <br />
            the Generative Era.
          </h2>
          <p className="text-slate-500 text-sm mt-3">
            Traditional freelance platforms fail when evaluating synthetic media. GenLancer inspects model versions, seeds, and reproducible prompt pipelines.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="p-8 bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:border-orange-200 hover:shadow-xl transition-all flex flex-col justify-between group">
            <div>
              <div className="w-14 h-14 rounded-full bg-orange-50 border border-orange-200 text-[#FF6B00] flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[#FF6B00] group-hover:text-white group-hover:border-[#FF6B00] transition-all shadow-sm">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Verified Workflows & Prompts</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Inspect generation seeds, custom LoRA weights, and multi-model pipelines across Runway Gen-3, Midjourney v6, Flux.1, and Sora.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center text-xs font-bold text-[#FF6B00]">
              <span>Zero hallucination guarantee →</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="p-8 bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:border-orange-200 hover:shadow-xl transition-all flex flex-col justify-between group">
            <div>
              <div className="w-14 h-14 rounded-full bg-orange-50 border border-orange-200 text-[#FF6B00] flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[#FF6B00] group-hover:text-white group-hover:border-[#FF6B00] transition-all shadow-sm">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">AI-Powered Smart Briefs</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Convert a 1-sentence prompt idea into a comprehensive commercial brief with aspect ratios, camera trajectory directives, and model recommendations.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center text-xs font-bold text-[#FF6B00]">
              <span>Auto-structured briefs →</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="p-8 bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:border-orange-200 hover:shadow-xl transition-all flex flex-col justify-between group">
            <div>
              <div className="w-14 h-14 rounded-full bg-orange-50 border border-orange-200 text-[#FF6B00] flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[#FF6B00] group-hover:text-white group-hover:border-[#FF6B00] transition-all shadow-sm">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Commercial License Cleared</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Full intellectual property assignment, copyright indemnification escrow, and milestone-based release for all commercial deliverables.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center text-xs font-bold text-[#FF6B00]">
              <span>Enterprise SAML & SLA →</span>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FINAL CALL TO ACTION BANNER ================= */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 rounded-[32px] p-8 sm:p-12 md:p-16 text-white text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF6B00]/15 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-[#FF6B00] bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20 inline-block">
              Ready to create?
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              Bring your next AI campaign to reality today.
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm max-w-lg mx-auto">
              Join thousands of brands and certified generative artists collaborating on GenLancer.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <button
                onClick={() => onNavigateToRegister ? onNavigateToRegister('company') : null}
                className="w-full sm:w-auto px-8 py-3.5 bg-[#FF6B00] hover:bg-[#E05E00] text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-orange-500/30 cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Hire AI Creators</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onNavigateToLogin}
                className="w-full sm:w-auto px-8 py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-sm transition-all cursor-pointer"
              >
                Sign In to Console
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-slate-200 bg-white py-10 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <GenLancerLogo className="w-8 h-8" textColor="text-slate-900" />
            <span className="text-xs text-slate-500 font-medium">
              &copy; {new Date().getFullYear()} GenLancer Inc. All rights reserved.
            </span>
          </div>

          <div className="flex items-center gap-6 text-xs font-semibold text-slate-500">
            <a href="#features" className="hover:text-[#FF6B00] transition-colors">Features</a>
            <a href="#guarantee" className="hover:text-[#FF6B00] transition-colors">Licensing Terms</a>
            <a href="#privacy" className="hover:text-[#FF6B00] transition-colors">Privacy Policy</a>
            <button 
              onClick={onNavigateToLogin}
              className="text-[#FF6B00] hover:underline font-bold cursor-pointer"
            >
              Portal Login
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
