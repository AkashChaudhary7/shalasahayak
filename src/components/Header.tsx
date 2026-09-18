import React, { useState, useEffect, useRef } from 'react';
import { Language, SchoolProfile } from '../types';
import { t } from '../utils/i18n';
import { 
  Menu, 
  X, 
  ChevronDown, 
  Home, 
  ShieldCheck, 
  UserCheck, 
  GraduationCap, 
  Calendar, 
  FileText, 
  BookOpen, 
  PhoneCall, 
  Info,
  Sparkles,
  Search
} from 'lucide-react';

interface HeaderProps {
  lang: Language;
  onToggleLang: () => void;
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
  schoolProfile: SchoolProfile;
  onOpenSettings?: () => void;
  onNavigate?: (hash: string) => void;
  onOpenSearch?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  lang,
  onToggleLang,
  schoolProfile,
  onNavigate,
  onOpenSearch
}) => {
  const isHi = lang === 'hi';
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState('/');
  const menuRef = useRef<HTMLDivElement>(null);

  // Sync active path with window location
  useEffect(() => {
    const updatePath = () => {
      const path = window.location.pathname.toLowerCase();
      if (path.includes('peeo')) {
        setCurrentPath('/peeo-tools');
      } else if (path.includes('incharge')) {
        setCurrentPath('/incharge-portal');
      } else if (path.includes('teacher')) {
        setCurrentPath('/teacher-tools');
      } else if (path.includes('shivira')) {
        setCurrentPath('/shivira');
      } else if (path.includes('format')) {
        setCurrentPath('/formats');
      } else if (path.includes('blog')) {
        setCurrentPath('/blogs');
      } else if (path.includes('contact')) {
        setCurrentPath('/contact');
      } else if (path.includes('about')) {
        setCurrentPath('/about');
      } else {
        setCurrentPath('/');
      }
    };

    updatePath();
    window.addEventListener('popstate', updatePath);
    return () => {
      window.removeEventListener('popstate', updatePath);
    };
  }, []);

  // Close menu on click outside or Escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false);
      }
    };
    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMobileMenuOpen]);

  const navigateTo = (path: string, e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setIsMobileMenuOpen(false);
    setCurrentPath(path);
    if (onNavigate) {
      onNavigate(path);
    } else {
      window.history.pushState(null, '', path);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navMenuItems = [
    { path: '/', labelHi: 'मुख्य डैशबोर्ड', labelEn: 'Main Dashboard', icon: Home },
    { path: '/peeo-tools', labelHi: 'पीईईओ पोर्टल', labelEn: 'PEEO Portal', icon: ShieldCheck },
    { path: '/incharge-portal', labelHi: 'प्रभारी पोर्टल', labelEn: 'Incharge Portal', icon: UserCheck },
    { path: '/teacher-tools', labelHi: 'शिक्षक टूल्स', labelEn: 'Teacher Tools', icon: GraduationCap },
    { path: '/shivira', labelHi: 'शिविरा पंचांग 2026', labelEn: 'Shivira 2026', icon: Calendar },
    { path: '/formats', labelHi: 'प्रारूप व आवेदन', labelEn: 'Formats & Letters', icon: FileText },
    { path: '/blogs', labelHi: 'सहायता ब्लॉग', labelEn: 'Guides & Blogs', icon: BookOpen },
    { path: '/contact', labelHi: 'संपर्क व सहायता', labelEn: 'Contact Support', icon: PhoneCall },
    { path: '/about', labelHi: 'हमारे बारे में', labelEn: 'About Us', icon: Info },
  ];

  const activeItem = navMenuItems.find(item => item.path === currentPath) || navMenuItems[0];
  const ActiveIcon = activeItem.icon;

  return (
    <header className="fixed top-0 left-0 right-0 z-[1000] backdrop-blur-md bg-emerald-900/95 text-white border-b border-emerald-700/60 shadow-lg transition-all duration-300 app-header" ref={menuRef}>
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 py-2 md:py-3.5 flex items-center justify-between transition-all duration-300 gap-2 app-header-container">
        
        {/* Title & Emblem Branding (Clickable to go Home) */}
        <a
          href="/"
          onClick={(e) => navigateTo('/', e)}
          className="flex items-center space-x-2 group cursor-pointer shrink-0"
          aria-label="Go to Home"
        >
          <div className="w-8 h-8 md:w-11 md:h-11 rounded-xl bg-white p-1 flex items-center justify-center shadow-md border border-emerald-400/40 shrink-0 overflow-hidden group-hover:scale-105 transition-transform">
            <img src="/logo.svg" alt="Shala Sahayak Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <h1 className="font-extrabold text-sm sm:text-base md:text-xl leading-tight tracking-tight flex items-center gap-1">
              {t('appTitle', lang)}
            </h1>
            {/* Subtitle text is hidden on mobile (<768px) to maximize screen real estate */}
            <p className="hidden md:block text-xs text-emerald-200/90 font-medium truncate max-w-[320px]">
              {schoolProfile.schoolNameHindi || schoolProfile.schoolName || (isHi ? 'राजस्थान शाला सहायक पोर्टल' : 'Rajasthan School Portal')}
            </p>
          </div>
        </a>

        {/* Right Controls & Mobile Dropdown Navigation Selector */}
        <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
          
          {/* Mobile Navigation Dropdown Selector Button (<768px) */}
          <div className="md:hidden relative">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-extrabold transition-all shadow-xs cursor-pointer ${
                isMobileMenuOpen
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                  : 'bg-emerald-800/90 hover:bg-emerald-700 border-emerald-600/70 text-white'
              }`}
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle Portal Navigation Dropdown"
            >
              <ActiveIcon className={`w-4 h-4 ${isMobileMenuOpen ? 'text-slate-950' : 'text-amber-300'}`} />
              <span className="hidden xs:inline text-[11px] max-w-[90px] truncate">
                {isHi ? activeItem.labelHi : activeItem.labelEn}
              </span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isMobileMenuOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Global Fuzzy Search Button (Desktop & Mobile) */}
          <button
            onClick={onOpenSearch}
            className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-[11px] sm:text-xs font-black border border-white/20 text-white transition-all shadow-xs cursor-pointer group active:scale-95"
            title="Search Tools, Guides & Circulars (Ctrl + K)"
            aria-label="Search Tools & Guides"
          >
            <Search className="w-3.5 h-3.5 text-amber-300 group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline">{isHi ? 'खोजें' : 'Search'}</span>
            <kbd className="hidden md:inline-flex items-center text-[10px] px-1 py-0.2 rounded bg-black/30 border border-white/20 font-mono text-emerald-200">
              ⌘K
            </kbd>
          </button>

          {/* Language Toggle Button */}
          <button
            onClick={onToggleLang}
            className="flex items-center justify-center px-2 py-1 sm:px-3 sm:py-1.5 rounded-xl bg-emerald-800/90 hover:bg-emerald-700 text-[11px] sm:text-xs font-black border border-emerald-600/60 text-white transition-all shadow-xs cursor-pointer"
            title="Switch Language"
            aria-label="Toggle Language"
          >
            <span>{isHi ? 'EN' : 'हिंदी'}</span>
          </button>

          {/* Mobile Menu Icon Toggle Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden p-1.5 rounded-xl border transition-all cursor-pointer ${
              isMobileMenuOpen
                ? 'bg-amber-500 text-slate-950 border-amber-400'
                : 'bg-emerald-800/90 hover:bg-emerald-700 text-white border-emerald-600/60'
            }`}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? <X className="w-4 h-4 font-bold" /> : <Menu className="w-4 h-4 text-emerald-100" />}
          </button>
        </div>
      </div>

      {/* Robust Mobile Dropdown Menu Panel Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-emerald-950/98 border-b-2 border-emerald-700 shadow-2xl backdrop-blur-xl animate-fadeIn z-[1050] divide-y divide-emerald-800/60">
          <div className="px-3 py-2 bg-emerald-900/80 flex items-center justify-between text-[11px] font-bold text-emerald-200">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{isHi ? 'पोर्टल नेविगेशन (Select Section)' : 'Portal Navigation Menu'}</span>
            </span>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-xs font-bold text-emerald-300 hover:text-white transition-colors cursor-pointer"
            >
              {isHi ? 'बंद करें ✕' : 'Close ✕'}
            </button>
          </div>

          <div className="p-2 space-y-1 max-h-[75vh] overflow-y-auto">
            {navMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.path;
              return (
                <button
                  key={item.path}
                  onClick={(e) => navigateTo(item.path, e)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-between transition-all cursor-pointer ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'text-emerald-100 hover:bg-emerald-800/80 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <div className={`p-1.5 rounded-lg ${isActive ? 'bg-slate-950/20 text-slate-950' : 'bg-emerald-800/70 text-emerald-300'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="font-bold">{isHi ? item.labelHi : item.labelEn}</span>
                  </div>
                  {isActive && (
                    <span className="px-2 py-0.5 text-[10px] bg-slate-950 text-amber-300 font-extrabold rounded-md shadow-xs">
                      {isHi ? 'सक्रिय' : 'Active'}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};




