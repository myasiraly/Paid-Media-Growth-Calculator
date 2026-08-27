import React from 'react';

interface GHLArmyLogoProps {
  className?: string;
  size?: number | string;
  variant?: 'icon-only' | 'full' | 'badge';
  dark?: boolean;
}

export const GHLArmyLogo: React.FC<GHLArmyLogoProps> = ({
  className = '',
  size = 36,
  variant = 'icon-only',
  dark = false,
}) => {
  // Exact 3-arrow brand vector: Gold (#C59A27), Deep Navy (#20223A), Teal (#00B69B)
  const icon = (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className || `w-${typeof size === 'number' ? `[${size}px]` : size} h-${typeof size === 'number' ? `[${size}px]` : size}`}
      style={typeof size === 'number' ? { width: size, height: size } : undefined}
      aria-label="Brand Logo"
    >
      {/* 1. Left Arrow (Warm Gold / Ochre) */}
      <path
        d="M 28 170 L 56 170 L 76 112 L 88 112 L 67 78 L 46 112 L 58 112 Z"
        fill="#C59A27"
      />

      {/* 2. Middle Arrow (Dark Navy Slate) */}
      <path
        d="M 68 170 L 96 170 L 124 78 L 138 78 L 115 44 L 92 78 L 106 78 Z"
        fill={dark ? "#F1F5F9" : "#20223A"}
      />

      {/* 3. Right Arrow (Vibrant Teal / Emerald Cyan) */}
      <path
        d="M 108 170 L 136 170 L 168 48 L 182 48 L 159 14 L 136 48 L 150 48 Z"
        fill="#00B69B"
      />
    </svg>
  );

  if (variant === 'icon-only') {
    return icon;
  }

  if (variant === 'badge') {
    return (
      <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-xl ${dark ? 'bg-slate-900 border border-slate-800 text-white' : 'bg-white border border-slate-200 text-slate-900 shadow-2xs'}`}>
        <div className="shrink-0">{icon}</div>
        <div className="flex flex-col">
          <span className="text-xs font-bold tracking-wider uppercase text-slate-900 leading-none">
            Paid Media
          </span>
          <span className="text-[9px] font-semibold text-[#00B69B] tracking-tight">
            Growth Engine
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2.5">
      <div className="shrink-0 p-1 bg-white rounded-xl shadow-xs border border-slate-100 flex items-center justify-center">
        {icon}
      </div>
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className="text-base font-bold tracking-tight text-slate-900 leading-none">
            Growth Calculator
          </span>
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#00B69B]/10 text-[#00927C] border border-[#00B69B]/30">
            PRO
          </span>
        </div>
        <span className="text-[11px] font-medium text-slate-500 tracking-tight mt-0.5">
          Paid Media Funnel Engine
        </span>
      </div>
    </div>
  );
};
