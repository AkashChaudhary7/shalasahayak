import React, { useState } from 'react';
import { Language, SchoolProfile } from '../types';
import { t } from '../utils/i18n';
import { Settings, ArrowLeft, Home, Share2, Check } from 'lucide-react';

interface HeaderProps {
  lang: Language;
  onToggleLang: () => void;
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
  schoolProfile: SchoolProfile;
  onOpenSettings: () => void;
  currentNav?: any;
  onGoBack?: () => void;
  onGoHome?: () => void;
  pageTitle?: string;
}

export const Header: React.FC<HeaderProps> = ({
  lang,
  onToggleLang,
  schoolProfile,
  onOpenSettings,
  currentNav,
  onGoBack,
  onGoHome,
  pageTitle
}) => {
  const isHi = lang === 'hi';
  const [copiedLink, setCopiedLink] = useState(false);

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: 'शाला सहायक 2026 - Rajasthan School Helper',
        text: 'PEEO, Teachers, Exam Incharge and Rajasthan School Management Portal App',
        url: url
      }).catch(() => {
        // Fallback to clipboard
        navigator.clipboard.writeText(url);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
      });
    } else {
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const isHome = !currentNav || currentNav.type === 'home';

  return (
    <header className="fixed top-0 left-0 right-0 z-[1000] backdrop-blur-md bg-emerald-900/95 text-white border-b border-emerald-700/60 shadow-lg transition-all duration-300 app-header">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 md:h-16 flex items-center justify-between transition-all duration-300">
        
        {/* Left Section: Nav / Back or Brand Logo */}
        <div className="flex items-center space-x-2 min-w-0">
          {!isHome ? (
            <div className="flex items-center space-x-1.5 mr-1 sm:mr-2 shrink-0">
              <button
                onClick={onGoBack}
                className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-800/90 hover:bg-emerald-700 text-white border border-emerald-700 transition-all active:scale-95"
                title={isHi ? 'पीछे जाएं' : 'Go Back'}
                aria-label="Go Back"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>

              <button
                onClick={onGoHome}
                className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-800/90 hover:bg-emerald-700 text-white border border-emerald-700 transition-all active:scale-95"
                title={isHi ? 'मुख्य होम' : 'Home'}
                aria-label="Home"
              >
                <Home className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onGoHome}
              className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-white p-1 flex items-center justify-center shadow-md border border-emerald-400/40 shrink-0 overflow-hidden hover:scale-105 transition-transform"
              title={isHi ? 'मुख्य होम' : 'Home'}
            >
              <img src="/logo.svg" alt="Shala Sahayak Logo" className="w-full h-full object-contain" />
            </button>
          )}

          {/* Dynamic Titles */}
          <div className="min-w-0 flex flex-col justify-center">
            {isHome ? (
              <>
                <h1 className="font-extrabold text-xs sm:text-base md:text-lg leading-tight tracking-tight truncate">
                  {t('appTitle', lang)}
                </h1>
                <p className="text-[9px] sm:text-[11px] text-emerald-200/90 font-medium truncate max-w-[140px] xs:max-w-[180px] sm:max-w-[320px]">
                  {schoolProfile.schoolNameHindi || schoolProfile.schoolName}
                </p>
              </>
            ) : (
              <>
                <h1 className="font-extrabold text-xs sm:text-base text-white leading-tight truncate">
                  {pageTitle}
                </h1>
                <p className="text-[9px] sm:text-[11px] text-emerald-200/90 font-medium truncate max-w-[140px] xs:max-w-[180px] sm:max-w-[320px]">
                  {schoolProfile.schoolNameShort || schoolProfile.schoolNameHindi || 'शाला सहायक'}
                </p>
              </>
            )}
          </div>
        </div>

        {/* Right Section: Actions (Share, Lang, Settings) */}
        <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
          
          {/* Share Link (Only visible when not on home) */}
          {!isHome && (
            <button
              onClick={handleShare}
              className="flex items-center justify-center gap-1 h-8 px-2 sm:px-2.5 rounded-lg bg-emerald-800/90 hover:bg-emerald-700 text-emerald-200 border border-emerald-700 transition-all text-[10px] sm:text-xs font-bold active:scale-95 cursor-pointer shrink-0"
              title={isHi ? 'इस पेज का सीधा लिंक शेयर करें' : 'Share direct link to this page'}
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden sm:inline">{isHi ? 'कॉपी हुआ' : 'Copied'}</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{isHi ? 'शेयर लिंक' : 'Share'}</span>
                </>
              )}
            </button>
          )}
          
          {/* Language Switcher */}
          <button
            onClick={onToggleLang}
            className="flex items-center justify-center h-8 px-2.5 rounded-lg bg-emerald-800/90 hover:bg-emerald-700 text-xs font-black border border-emerald-700 text-white transition-all shadow-sm cursor-pointer shrink-0"
            title="Switch Language"
          >
            <span>{isHi ? 'EN' : 'हिंदी'}</span>
          </button>

          {/* Settings Modal Toggle */}
          <button
            onClick={onOpenSettings}
            className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-800/90 hover:bg-emerald-700 text-amber-300 border border-emerald-700 transition-all shadow-sm cursor-pointer shrink-0"
            title="School Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
