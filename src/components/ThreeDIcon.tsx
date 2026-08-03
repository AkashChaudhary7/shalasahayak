import React from 'react';

export type Icon3DName =
  | 'calculator'
  | 'coin'
  | 'money-bag'
  | 'bell'
  | 'chart'
  | 'cash-stack'
  | 'lock'
  | 'wallet'
  | 'target'
  | 'coupon'
  | 'gold'
  | 'calendar'
  | 'building'
  | 'graduation'
  | 'briefcase'
  | 'bus'
  | 'utensils'
  | 'book'
  | 'award'
  | 'shield'
  | 'link'
  | 'sparkles'
  | 'users'
  | 'send';

interface ThreeDIconProps {
  name: Icon3DName | string;
  size?: number | string;
  className?: string;
}

export const ThreeDIcon: React.FC<ThreeDIconProps> = ({ name, size = 36, className = '' }) => {
  const width = typeof size === 'number' ? `${size}px` : size;
  const height = width;

  const renderSvg = () => {
    switch (name) {
      case 'calculator':
      return (
        <svg
          style={{ width, height }}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`drop-shadow-md transition-transform hover:scale-105 ${className}`}
        >
          <defs>
            <linearGradient id="calcBody" x1="15" y1="10" x2="85" y2="90" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="50%" stopColor="#0284C7" />
              <stop offset="100%" stopColor="#0369A1" />
            </linearGradient>
            <linearGradient id="calcScreen" x1="25" y1="20" x2="75" y2="38" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#1E293B" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>
            <filter id="softShadow" x="-10%" y="-10%" width="130%" height="130%">
              <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#000" floodOpacity="0.15" />
            </filter>
          </defs>
          {/* 3D Base Shadow */}
          <rect x="18" y="16" width="64" height="74" rx="16" fill="#0284C7" opacity="0.4" />
          {/* Main Body */}
          <rect x="18" y="12" width="64" height="74" rx="16" fill="url(#calcBody)" filter="url(#softShadow)" />
          {/* Inner Highlight Rim */}
          <rect x="20" y="14" width="60" height="70" rx="14" stroke="#7DD3FC" strokeWidth="1.5" strokeOpacity="0.6" fill="none" />
          {/* LCD Screen */}
          <rect x="26" y="20" width="48" height="18" rx="6" fill="url(#calcScreen)" />
          <rect x="28" y="22" width="44" height="14" rx="4" stroke="#334155" strokeWidth="1" fill="none" />
          <text x="68" y="33" fill="#38BDF8" fontSize="10" fontFamily="sans-serif" fontWeight="bold" textAnchor="end">888</text>
          {/* Round Buttons */}
          {/* Row 1 */}
          <circle cx="34" cy="48" r="5" fill="#FFFFFF" opacity="0.9" />
          <circle cx="50" cy="48" r="5" fill="#FFFFFF" opacity="0.9" />
          <circle cx="66" cy="48" r="5" fill="#FFFFFF" opacity="0.9" />
          {/* Row 2 */}
          <circle cx="34" cy="62" r="5" fill="#FFFFFF" opacity="0.9" />
          <circle cx="50" cy="62" r="5" fill="#FFFFFF" opacity="0.9" />
          <circle cx="66" cy="62" r="5" fill="#FFFFFF" opacity="0.9" />
          {/* Row 3 Equals Key (Wide Pill) */}
          <rect x="29" y="72" width="18" height="8" rx="4" fill="#FFFFFF" opacity="0.9" />
          <rect x="53" y="72" width="20" height="8" rx="4" fill="#0284C7" stroke="#BAE6FD" strokeWidth="1" />
        </svg>
      );

    case 'coin':
      return (
        <svg
          style={{ width, height }}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`drop-shadow-md transition-transform hover:scale-105 ${className}`}
        >
          <defs>
            <radialGradient id="coinGrad" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#FB7185" />
              <stop offset="60%" stopColor="#E11D48" />
              <stop offset="100%" stopColor="#9F1239" />
            </radialGradient>
          </defs>
          <circle cx="50" cy="53" r="38" fill="#881337" opacity="0.3" />
          <circle cx="50" cy="50" r="38" fill="url(#coinGrad)" />
          <circle cx="50" cy="50" r="32" stroke="#FDA4AF" strokeWidth="3" fill="none" opacity="0.6" />
          <text x="50" y="62" fill="#FFFFFF" fontSize="34" fontFamily="Arial, sans-serif" fontWeight="900" textAnchor="middle">P</text>
        </svg>
      );

    case 'money-bag':
      return (
        <svg
          style={{ width, height }}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`drop-shadow-md transition-transform hover:scale-105 ${className}`}
        >
          <defs>
            <linearGradient id="bagGrad" x1="20" y1="20" x2="80" y2="90" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FDBA74" />
              <stop offset="50%" stopColor="#F97316" />
              <stop offset="100%" stopColor="#C2410C" />
            </linearGradient>
            <linearGradient id="ribbonGrad" x1="30" y1="30" x2="70" y2="40" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#F43F5E" />
              <stop offset="100%" stopColor="#BE123C" />
            </linearGradient>
          </defs>
          {/* Sack Body */}
          <path d="M 50 15 C 40 15 35 25 35 32 C 20 40 15 65 25 80 C 35 92 65 92 75 80 C 85 65 80 40 65 32 C 65 25 60 15 50 15 Z" fill="url(#bagGrad)" />
          {/* Top Frill */}
          <path d="M 40 22 C 45 18 55 18 60 22 C 65 28 35 28 40 22 Z" fill="#FED7AA" />
          {/* Red Tie Ribbon */}
          <rect x="34" y="32" width="32" height="7" rx="3.5" fill="url(#ribbonGrad)" />
          {/* Currency Symbol */}
          <text x="50" y="68" fill="#FFFFFF" fontSize="28" fontFamily="sans-serif" fontWeight="900" textAnchor="middle">₹</text>
        </svg>
      );

    case 'bell':
      return (
        <svg
          style={{ width, height }}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`drop-shadow-md transition-transform hover:scale-105 ${className}`}
        >
          <defs>
            <linearGradient id="bellGrad" x1="20" y1="10" x2="80" y2="80" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FDE047" />
              <stop offset="50%" stopColor="#EAB308" />
              <stop offset="100%" stopColor="#CA8A04" />
            </linearGradient>
          </defs>
          {/* Top Loop */}
          <circle cx="50" cy="18" r="8" fill="none" stroke="#CA8A04" strokeWidth="4" />
          {/* Bell Body */}
          <path d="M 50 20 C 32 20 28 45 22 65 C 20 72 25 76 30 76 L 70 76 C 75 76 80 72 78 65 C 72 45 68 20 50 20 Z" fill="url(#bellGrad)" />
          {/* Rim */}
          <rect x="18" y="72" width="64" height="8" rx="4" fill="#FACC15" stroke="#CA8A04" strokeWidth="1.5" />
          {/* Clapper */}
          <circle cx="50" cy="84" r="7" fill="#A16207" />
        </svg>
      );

    case 'chart':
      return (
        <svg
          style={{ width, height }}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`drop-shadow-md transition-transform hover:scale-105 ${className}`}
        >
          {/* Pillar 1 - Blue */}
          <line x1="26" y1="20" x2="26" y2="80" stroke="#0284C7" strokeWidth="3" strokeLinecap="round" />
          <rect x="20" y="32" width="12" height="34" rx="6" fill="#38BDF8" stroke="#0284C7" strokeWidth="2" />
          {/* Pillar 2 - Magenta / Pink */}
          <line x1="50" y1="12" x2="50" y2="88" stroke="#BE123C" strokeWidth="3" strokeLinecap="round" />
          <rect x="43" y="24" width="14" height="48" rx="7" fill="#F43F5E" stroke="#BE123C" strokeWidth="2" />
          {/* Pillar 3 - Teal */}
          <line x1="74" y1="30" x2="74" y2="76" stroke="#0F766E" strokeWidth="3" strokeLinecap="round" />
          <rect x="68" y="42" width="12" height="22" rx="6" fill="#2DD4BF" stroke="#0F766E" strokeWidth="2" />
        </svg>
      );

    case 'cash-stack':
      return (
        <svg
          style={{ width, height }}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`drop-shadow-md transition-transform hover:scale-105 ${className}`}
        >
          <defs>
            <linearGradient id="cashGrad" x1="10" y1="30" x2="90" y2="80" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#4ADE80" />
              <stop offset="50%" stopColor="#22C55E" />
              <stop offset="100%" stopColor="#15803D" />
            </linearGradient>
          </defs>
          {/* Stack Layers */}
          <rect x="20" y="48" width="60" height="30" rx="8" fill="#14532D" opacity="0.5" />
          <rect x="20" y="42" width="60" height="30" rx="8" fill="#15803D" opacity="0.8" />
          <rect x="20" y="36" width="60" height="30" rx="8" fill="url(#cashGrad)" />
          {/* White Paper Band */}
          <rect x="42" y="36" width="16" height="30" fill="#FFFFFF" opacity="0.9" />
          {/* Banknote Dots */}
          <circle cx="28" cy="51" r="3" fill="#BBF7D0" />
          <circle cx="72" cy="51" r="3" fill="#BBF7D0" />
          <circle cx="50" cy="51" r="5" fill="#15803D" />
        </svg>
      );

    case 'lock':
      return (
        <svg
          style={{ width, height }}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`drop-shadow-md transition-transform hover:scale-105 ${className}`}
        >
          <defs>
            <linearGradient id="lockBody" x1="20" y1="40" x2="80" y2="90" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#0284C7" />
            </linearGradient>
            <linearGradient id="shackle" x1="30" y1="15" x2="70" y2="45" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#E2E8F0" />
              <stop offset="100%" stopColor="#94A3B8" />
            </linearGradient>
          </defs>
          {/* Shackle */}
          <path d="M 32 45 L 32 28 C 32 18 68 18 68 28 L 68 45" stroke="url(#shackle)" strokeWidth="10" strokeLinecap="round" fill="none" />
          {/* Lock Body */}
          <rect x="22" y="42" width="56" height="46" rx="12" fill="url(#lockBody)" />
          {/* Keyhole */}
          <circle cx="50" cy="60" r="5" fill="#0F172A" />
          <polygon points="47,63 53,63 52,74 48,74" fill="#0F172A" />
        </svg>
      );

    case 'wallet':
      return (
        <svg
          style={{ width, height }}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`drop-shadow-md transition-transform hover:scale-105 ${className}`}
        >
          <defs>
            <linearGradient id="walletGrad" x1="15" y1="30" x2="85" y2="85" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FBBF24" />
              <stop offset="50%" stopColor="#D97706" />
              <stop offset="100%" stopColor="#B45309" />
            </linearGradient>
          </defs>
          {/* Cards sticking out */}
          <rect x="28" y="16" width="44" height="25" rx="5" fill="#0284C7" transform="rotate(-6 50 25)" />
          <rect x="30" y="18" width="44" height="25" rx="5" fill="#22C55E" transform="rotate(4 50 25)" />
          {/* Wallet Base */}
          <rect x="16" y="32" width="68" height="52" rx="14" fill="url(#walletGrad)" />
          {/* Fold Flap */}
          <path d="M 16 46 L 70 46 C 78 46 84 52 84 60 C 84 68 78 74 70 74 L 16 74" fill="#B45309" opacity="0.2" />
          {/* Clasp Button */}
          <circle cx="70" cy="58" r="6" fill="#FACC15" stroke="#92400E" strokeWidth="2" />
        </svg>
      );

    case 'target':
      return (
        <svg
          style={{ width, height }}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`drop-shadow-md transition-transform hover:scale-105 ${className}`}
        >
          {/* Outer Ring */}
          <circle cx="50" cy="50" r="40" fill="#F43F5E" />
          <circle cx="50" cy="50" r="30" fill="#FFFFFF" />
          <circle cx="50" cy="50" r="20" fill="#F43F5E" />
          <circle cx="50" cy="50" r="10" fill="#FFFFFF" />
          <circle cx="50" cy="50" r="4" fill="#BE123C" />
          {/* Dart */}
          <path d="M 20 20 L 46 46" stroke="#0284C7" strokeWidth="5" strokeLinecap="round" />
          <polygon points="12,12 24,18 18,24" fill="#38BDF8" />
          <circle cx="48" cy="48" r="3" fill="#38BDF8" />
        </svg>
      );

    case 'coupon':
      return (
        <svg
          style={{ width, height }}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`drop-shadow-md transition-transform hover:scale-105 ${className}`}
        >
          <rect x="25" y="30" width="50" height="30" rx="6" fill="#FDA4AF" transform="rotate(12 50 45)" />
          <rect x="25" y="30" width="50" height="30" rx="6" fill="#F43F5E" transform="rotate(-6 50 45)" />
          <rect x="22" y="32" width="56" height="32" rx="8" fill="#FB7185" stroke="#FFF" strokeWidth="1.5" />
          <text x="50" y="54" fill="#FFF" fontSize="22" fontFamily="sans-serif" fontWeight="900" textAnchor="middle">%</text>
        </svg>
      );

    case 'gold':
      return (
        <svg
          style={{ width, height }}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`drop-shadow-md transition-transform hover:scale-105 ${className}`}
        >
          {/* Bottom Layer Gold Bars */}
          <polygon points="15,75 35,60 65,60 45,75" fill="#EAB308" />
          <rect x="15" y="75" width="30" height="10" fill="#CA8A04" />
          <polygon points="45,75 65,60 95,60 75,75" fill="#FACC15" />
          <rect x="45" y="75" width="30" height="10" fill="#EAB308" />
          {/* Top Gold Bar */}
          <polygon points="30,55 50,40 80,40 60,55" fill="#FDE047" />
          <rect x="30" y="55" width="30" height="10" fill="#EAB308" />
        </svg>
      );

    case 'calendar':
      return (
        <svg
          style={{ width, height }}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`drop-shadow-md transition-transform hover:scale-105 ${className}`}
        >
          <defs>
            <linearGradient id="calHeader" x1="15" y1="15" x2="85" y2="35" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#0284C7" />
            </linearGradient>
          </defs>
          {/* Stacked Pages */}
          <rect x="20" y="22" width="60" height="66" rx="10" fill="#CBD5E1" />
          <rect x="18" y="18" width="64" height="66" rx="10" fill="#FFFFFF" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.1))" />
          {/* Top Blue Header Banner */}
          <path d="M 18 28 C 18 22.477 22.477 18 28 18 L 72 18 C 77.523 18 82 22.477 82 28 L 82 38 L 18 38 Z" fill="url(#calHeader)" />
          {/* Binder Rings */}
          <rect x="30" y="12" width="6" height="12" rx="3" fill="#64748B" />
          <rect x="64" y="12" width="6" height="12" rx="3" fill="#64748B" />
          {/* Blue Checkmark */}
          <path d="M 36 56 L 46 66 L 66 46" stroke="#0284C7" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
      );

    case 'building':
      return (
        <svg
          style={{ width, height }}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`drop-shadow-md transition-transform hover:scale-105 ${className}`}
        >
          <defs>
            <linearGradient id="bldGrad" x1="20" y1="20" x2="80" y2="90" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#34D399" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
          </defs>
          {/* Building Main Body */}
          <rect x="22" y="32" width="56" height="56" rx="8" fill="url(#bldGrad)" />
          {/* Roof Pediment */}
          <polygon points="16,32 50,14 84,32" fill="#047857" />
          {/* Windows Grid */}
          <rect x="30" y="42" width="10" height="12" rx="2" fill="#A7F3D0" />
          <rect x="60" y="42" width="10" height="12" rx="2" fill="#A7F3D0" />
          <rect x="30" y="60" width="10" height="12" rx="2" fill="#A7F3D0" />
          <rect x="60" y="60" width="10" height="12" rx="2" fill="#A7F3D0" />
          {/* Door */}
          <rect x="44" y="66" width="12" height="22" rx="3" fill="#064E3B" />
        </svg>
      );

    case 'graduation':
      return (
        <svg
          style={{ width, height }}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`drop-shadow-md transition-transform hover:scale-105 ${className}`}
        >
          <defs>
            <linearGradient id="gradCap" x1="10" y1="30" x2="90" y2="60" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>
          </defs>
          {/* Skull Cap Base */}
          <path d="M 30 50 L 30 68 C 30 76 70 76 70 68 L 70 50 Z" fill="#92400E" />
          {/* Diamond Top */}
          <polygon points="50,20 90,38 50,56 10,38" fill="url(#gradCap)" />
          {/* Tassel String */}
          <path d="M 50 38 L 80 52 L 80 72" stroke="#FDE047" strokeWidth="3" fill="none" strokeLinecap="round" />
          <circle cx="80" cy="74" r="4" fill="#FACC15" />
        </svg>
      );

    case 'briefcase':
      return (
        <svg
          style={{ width, height }}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`drop-shadow-md transition-transform hover:scale-105 ${className}`}
        >
          <defs>
            <linearGradient id="caseGrad" x1="15" y1="30" x2="85" y2="85" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#818CF8" />
              <stop offset="100%" stopColor="#4F46E5" />
            </linearGradient>
          </defs>
          {/* Handle */}
          <path d="M 38 30 L 38 20 C 38 16 62 16 62 20 L 62 30" stroke="#3730A3" strokeWidth="5" fill="none" />
          {/* Main Case Body */}
          <rect x="16" y="30" width="68" height="52" rx="12" fill="url(#caseGrad)" />
          {/* Metallic Straps */}
          <rect x="30" y="30" width="6" height="52" fill="#3730A3" opacity="0.3" />
          <rect x="64" y="30" width="6" height="52" fill="#3730A3" opacity="0.3" />
          {/* Gold Buckles */}
          <rect x="28" y="52" width="10" height="8" rx="2" fill="#FACC15" />
          <rect x="62" y="52" width="10" height="8" rx="2" fill="#FACC15" />
        </svg>
      );

    case 'bus':
      return (
        <svg
          style={{ width, height }}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`drop-shadow-md transition-transform hover:scale-105 ${className}`}
        >
          <rect x="20" y="20" width="60" height="56" rx="14" fill="#FACC15" stroke="#CA8A04" strokeWidth="2" />
          <rect x="26" y="28" width="48" height="20" rx="6" fill="#0284C7" />
          <circle cx="34" cy="62" r="6" fill="#1E293B" />
          <circle cx="66" cy="62" r="6" fill="#1E293B" />
          <rect x="36" y="76" width="10" height="8" rx="2" fill="#334155" />
          <rect x="54" y="76" width="10" height="8" rx="2" fill="#334155" />
        </svg>
      );

    case 'utensils':
      return (
        <svg
          style={{ width, height }}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`drop-shadow-md transition-transform hover:scale-105 ${className}`}
        >
          <circle cx="50" cy="54" r="32" fill="#FBBF24" />
          <circle cx="50" cy="54" r="26" fill="#F59E0B" />
          <path d="M 30 20 L 30 45 M 36 20 L 36 45 M 24 20 L 24 45 M 30 45 L 30 80" stroke="#78350F" strokeWidth="4" strokeLinecap="round" />
          <path d="M 70 20 C 60 30 60 45 70 50 L 70 80" stroke="#78350F" strokeWidth="4" strokeLinecap="round" />
        </svg>
      );

    case 'book':
      return (
        <svg
          style={{ width, height }}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`drop-shadow-md transition-transform hover:scale-105 ${className}`}
        >
          <path d="M 18 20 Q 50 28 82 20 L 82 72 Q 50 80 18 72 Z" fill="#FB923C" />
          <path d="M 18 20 Q 50 28 82 20 L 82 26 Q 50 34 18 26 Z" fill="#EA580C" />
          <line x1="50" y1="28" x2="50" y2="76" stroke="#9A3412" strokeWidth="3" />
        </svg>
      );

    case 'award':
      return (
        <svg
          style={{ width, height }}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`drop-shadow-md transition-transform hover:scale-105 ${className}`}
        >
          <circle cx="50" cy="42" r="28" fill="#FACC15" stroke="#CA8A04" strokeWidth="3" />
          <circle cx="50" cy="42" r="22" fill="#FDE047" />
          <polygon points="50,22 56,34 68,36 59,45 61,57 50,51 39,57 41,45 32,36 44,34" fill="#CA8A04" />
          <path d="M 38 66 L 30 90 L 48 80 L 52 80 L 70 90 L 62 66" fill="#DC2626" />
        </svg>
      );

    case 'shield':
      return (
        <svg
          style={{ width, height }}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`drop-shadow-md transition-transform hover:scale-105 ${className}`}
        >
          <path d="M 50 15 L 82 25 L 82 52 C 82 72 50 88 50 88 C 50 88 18 72 18 52 L 18 25 Z" fill="#38BDF8" stroke="#0284C7" strokeWidth="3" />
          <path d="M 36 48 L 46 58 L 66 38" stroke="#FFFFFF" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    case 'link':
      return (
        <svg
          style={{ width, height }}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`drop-shadow-md transition-transform hover:scale-105 ${className}`}
        >
          <circle cx="50" cy="50" r="36" fill="#60A5FA" />
          <ellipse cx="50" cy="50" rx="36" ry="14" stroke="#FFFFFF" strokeWidth="4" fill="none" />
          <line x1="50" y1="14" x2="50" y2="86" stroke="#FFFFFF" strokeWidth="4" />
        </svg>
      );

    case 'sparkles':
    default:
      return (
        <svg
          style={{ width, height }}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`drop-shadow-md transition-transform hover:scale-105 ${className}`}
        >
          <path d="M 50 10 Q 50 50 90 50 Q 50 50 50 90 Q 50 50 10 50 Q 50 50 50 10 Z" fill="#FACC15" stroke="#CA8A04" strokeWidth="2" />
        </svg>
      );
    }
  };

  return (
    <div
      className="inline-flex items-center justify-center rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:scale-105 active:scale-95 cursor-pointer select-none"
      style={{
        background: 'rgba(255, 255, 255, 0.85)',
        borderRadius: '16px',
        boxShadow: '0 10px 20px rgba(0,0,0,0.06), inset 0 1px 1px rgba(255,255,255,0.8)',
        transformStyle: 'preserve-3d',
        padding: '6px',
      }}
    >
      {renderSvg()}
    </div>
  );
};

export interface ThreeDCardProps {
  icon: string | React.ReactNode;
  label: string;
  onClick?: () => void;
  className?: string;
  bgTint?: string;
  active?: boolean;
  ariaLabel?: string;
  description?: string;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDragEnd?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
  onDragEnter?: (e: React.DragEvent) => void;
  onDragLeave?: (e: React.DragEvent) => void;
  isDragging?: boolean;
  isDragOver?: boolean;
  delayIndex?: number;
}

export const ThreeDCard: React.FC<ThreeDCardProps> = ({
  icon,
  label,
  onClick,
  className = '',
  bgTint = 'bg-slate-50 dark:bg-slate-800',
  active = false,
  ariaLabel,
  description,
  draggable = false,
  onDragStart,
  onDragOver,
  onDragEnd,
  onDrop,
  onDragEnter,
  onDragLeave,
  isDragging = false,
  isDragOver = false,
  delayIndex
}) => {
  const activeClass = active 
    ? 'border-emerald-500 dark:border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20 ring-2 ring-emerald-500/20' 
    : isDragOver
    ? 'border-emerald-500 dark:border-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/40 ring-2 ring-emerald-400/40 scale-105'
    : isDragging
    ? 'border-dashed border-emerald-400 dark:border-emerald-600 bg-slate-100/50 dark:bg-slate-800/50 opacity-40 scale-95'
    : 'border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900';

  const accessibleLabel = ariaLabel || label;

  const animationStyle = delayIndex !== undefined 
    ? { animationDelay: `${delayIndex * 40}ms` } 
    : undefined;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={accessibleLabel}
      title={accessibleLabel}
      draggable={draggable}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
      onDrop={onDrop}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      className={`w-full aspect-square rounded-[14px] sm:rounded-[20px] p-2 sm:p-[16px_10px] border shadow-[0_4px_12px_rgba(0,0,0,0.03)] sm:shadow-[0_8px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.08)] hover:-translate-y-1 active:translate-y-0.5 active:scale-[0.93] active:shadow-inner active:brightness-95 flex flex-col items-center justify-center text-center transition-all duration-150 cursor-grab active:cursor-grabbing group select-none relative animate-card-entrance touch-manipulation ${activeClass} ${className}`}
      style={{ contentVisibility: 'auto', ...animationStyle }}
    >
      <div 
        aria-hidden="true"
        className={`w-10 h-10 sm:w-[58px] sm:h-[58px] rounded-lg sm:rounded-[16px] ${active ? 'bg-emerald-100 dark:bg-emerald-900/50' : bgTint} flex items-center justify-center group-hover:scale-110 group-active:scale-90 transition-transform duration-150 shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),_0_2px_5px_rgba(0,0,0,0.02)] shrink-0`}
      >
        {typeof icon === 'string' ? (
          <ThreeDIcon name={icon} size="100%" className="bg-transparent p-1.5 sm:p-0" />
        ) : (
          icon
        )}
      </div>
      <span className={`hidden sm:line-clamp-2 text-[0.82rem] font-bold mt-[10px] leading-[1.2] tracking-normal max-w-full px-1 ${active ? 'text-emerald-800 dark:text-emerald-200' : 'text-slate-800 dark:text-slate-100'}`}>
        {label}
      </span>
      <span className="sr-only">
        {description || `${label} - click to open module, drag to reorder`}
      </span>
    </button>
  );
};

export const renderCard = (props: ThreeDCardProps) => {
  return <ThreeDCard {...props} />;
};

