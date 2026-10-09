import React from 'react';

export default function GenLancerLogo({ 
  className = "w-10 h-10", 
  showText = true, 
  textColor = "text-slate-900",
  layout = "horizontal", // "horizontal" | "stacked"
  textSize = "text-2xl"
}) {
  const isStacked = layout === "stacked";

  return (
    <div className={`flex ${isStacked ? 'flex-col items-center gap-4' : 'items-center gap-3'}`}>
      {/* SVG Emblem matching GenLancer brand identity */}
      <svg 
        viewBox="0 0 400 400" 
        className={className} 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Sparkle Star at Top Right */}
        <path 
          d="M305 92 C305 105 308 115 320 118 C308 121 305 131 305 144 C305 131 302 121 290 118 C302 115 305 105 305 92 Z" 
          fill="#FF6B00" 
        />

        {/* Top Orbital Arcs */}
        <path 
          d="M 120 175 C 120 120 160 88 215 88" 
          stroke="#FF6B00" 
          strokeWidth="14" 
          strokeLinecap="round" 
        />
        <path 
          d="M 146 175 C 146 138 174 116 210 116" 
          stroke="#FF6B00" 
          strokeWidth="12" 
          strokeLinecap="round" 
        />

        {/* AI Neural Network Nodes & Constellation Lines */}
        <g stroke="#FF6B00" strokeWidth="5" strokeLinecap="round">
          <line x1="200" y1="120" x2="225" y2="100" />
          <line x1="225" y1="100" x2="260" y2="108" />
          <line x1="225" y1="100" x2="242" y2="132" />
          <line x1="260" y1="108" x2="285" y2="132" />
          <line x1="242" y1="132" x2="285" y2="132" />
          <line x1="242" y1="132" x2="250" y2="155" />
        </g>
        <circle cx="200" cy="120" r="8.5" fill="#FF6B00" />
        <circle cx="225" cy="100" r="9.5" fill="#FF6B00" />
        <circle cx="260" cy="108" r="8.5" fill="#FF6B00" />
        <circle cx="242" cy="132" r="8.5" fill="#FF6B00" />
        <circle cx="285" cy="132" r="9.5" fill="#FF6B00" />
        <circle cx="250" cy="155" r="8.5" fill="#FF6B00" />

        {/* Prompt Caret & Terminal Line */}
        <path 
          d="M 102 182 L 120 196 L 102 210" 
          stroke="#FF6B00" 
          strokeWidth="11" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />
        <path 
          d="M 122 210 L 140 210" 
          stroke="#FF6B00" 
          strokeWidth="11" 
          strokeLinecap="round" 
        />

        {/* Central G Inward Shelf */}
        <path 
          d="M 188 210 L 252 210 L 236 222 L 194 222 Z" 
          fill="#FF6B00" 
        />

        {/* Upward Momentum Arrow Head */}
        <path 
          d="M 318 132 L 248 185 L 282 185 L 268 238 L 305 178 L 290 178 Z" 
          fill="#FF6B00" 
        />

        {/* Bottom Swooping Multi-Ribbon 'G' Curves */}
        <path 
          d="M 104 224 C 104 285 160 315 228 290 C 265 275 292 235 305 180" 
          stroke="#FF6B00" 
          strokeWidth="18" 
          strokeLinecap="round" 
        />
        <path 
          d="M 136 224 C 136 265 175 285 220 268 C 248 256 270 228 280 195" 
          stroke="#FF6B00" 
          strokeWidth="14" 
          strokeLinecap="round" 
        />
        <path 
          d="M 198 300 C 235 298 268 275 285 245" 
          stroke="#FF6B00" 
          strokeWidth="8" 
          strokeLinecap="round" 
        />
      </svg>

      {showText && (
        <span className={`${textSize} font-black tracking-tight ${textColor}`}>
          {isStacked ? (
            <span className="text-[#FF6B00] tracking-normal">GenLancer</span>
          ) : (
            <>Gen<span className="text-[#FF6B00]">Lancer</span></>
          )}
        </span>
      )}
    </div>
  );
}
