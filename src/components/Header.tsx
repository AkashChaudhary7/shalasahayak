import React from 'react';
import { Language, SchoolProfile } from '../types';
import { t } from '../utils/i18n';
import { Settings } from 'lucide-react';

interface HeaderProps {
  lang: Language;
  onToggleLang: () => void;
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
  schoolProfile: SchoolProfile;
  onOpenSettings: () => void;
  onNavigate?: (hash: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  lang,
  onToggleLang,
  schoolProfile,
  onOpenSettings,
  onNavigate
}) => {
  const isHi = lang === 'hi';

  const navigateTo = (hash: string, e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (onNavigate) {
      onNavigate(hash);
    } else {
      window.location.hash = hash;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-[1000] backdrop-blur-md bg-emerald-900/95 text-white border-b border-emerald-700/60 shadow-lg transition-all duration-300 app-header">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 md:py-3.5 flex items-center justify-between transition-all duration-300">
        
        {/* Title & Emblem (Clickable to go Home) */}
        <a
          href="#home"
          onClick={(e) => navigateTo('', e)}
          className="flex items-center space-x-2.5 group cursor-pointer shrink-0"
        >
          <div className="w-9 h-9 md:w-11 md:h-11 rounded-xl bg-white p-1 flex items-center justify-center shadow-md border border-emerald-400/40 shrink-0 overflow-hidden group-hover:scale-105 transition-transform">
            <img src="/logo.svg" alt="Shala Sahayak Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <h1 className="font-extrabold text-sm sm:text-lg md:text-xl leading-tight tracking-tight flex items-center gap-1.5">
              {t('appTitle', lang)}
            </h1>
            <p className="text-[10px] sm:text-xs text-emerald-200/90 font-medium truncate max-w-[150px] xs:max-w-[200px] sm:max-w-[320px]">
              {schoolProfile.schoolNameHindi || schoolProfile.schoolName}
            </p>
          </div>
        </a>

        {/* Right Header Action Controls */}
        <div className="flex items-center space-x-2 shrink-0">
          
          {/* Language Switcher */}
          <button
            onClick={onToggleLang}
            className="flex items-center space-x-1 px-2.5 sm:px-3 py-1.5 rounded-xl bg-emerald-800/90 hover:bg-emerald-700 text-xs font-black border border-emerald-600/60 text-white transition-all shadow-sm cursor-pointer"
            title="Switch Language"
          >
            <span>{isHi ? 'EN' : 'हिंदी'}</span>
          </button>

          {/* Settings Modal Toggle */}
          <button
            onClick={onOpenSettings}
            className="p-1.5 sm:p-2 rounded-xl bg-emerald-800/90 hover:bg-emerald-700 text-amber-300 border border-emerald-600/60 transition-all shadow-sm cursor-pointer"
            title="School Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};


