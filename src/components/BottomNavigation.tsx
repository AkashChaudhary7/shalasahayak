import React, { useState, useEffect } from 'react';
import { Home, ShieldCheck, UserCheck, GraduationCap, Calendar, Settings } from 'lucide-react';
import { Language } from '../types';

interface BottomNavigationProps {
  lang: Language;
  onOpenSettings: () => void;
  onNavigate?: (path: string) => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  lang,
  onOpenSettings,
  onNavigate
}) => {
  const isHi = lang === 'hi';
  const [activeTab, setActiveTab] = useState<string>('home');

  useEffect(() => {
    const handleUrlCheck = () => {
      const path = window.location.pathname.toLowerCase();

      if (path.includes('peeo')) {
        setActiveTab('peeo');
      } else if (path.includes('incharge')) {
        setActiveTab('incharge');
      } else if (path.includes('teacher')) {
        setActiveTab('teacher');
      } else if (path.includes('shivira')) {
        setActiveTab('shivira');
      } else {
        setActiveTab('home');
      }
    };

    handleUrlCheck();
    window.addEventListener('popstate', handleUrlCheck);

    return () => {
      window.removeEventListener('popstate', handleUrlCheck);
    };
  }, []);

  const handleNavClick = (tabKey: string, targetPath: string) => {
    setActiveTab(tabKey);
    if (onNavigate) {
      onNavigate(targetPath);
    } else {
      window.history.pushState(null, '', targetPath);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navItems = [
    {
      key: 'home',
      labelHi: 'होम',
      labelEn: 'Home',
      icon: Home,
      path: '/'
    },
    {
      key: 'peeo',
      labelHi: 'PEEO',
      labelEn: 'PEEO',
      icon: ShieldCheck,
      path: '/peeo-tools'
    },
    {
      key: 'incharge',
      labelHi: 'प्रभारी',
      labelEn: 'Incharge',
      icon: UserCheck,
      path: '/incharge-portal'
    },
    {
      key: 'teacher',
      labelHi: 'शिक्षक',
      labelEn: 'Teacher',
      icon: GraduationCap,
      path: '/teacher-tools'
    },
    {
      key: 'shivira',
      labelHi: 'शिविरा',
      labelEn: 'Shivira',
      icon: Calendar,
      path: '/shivira'
    }
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-[990] bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 shadow-lg px-2 py-1.5 transition-all no-print">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.key;
          return (
            <button
              key={item.key}
              onClick={() => handleNavClick(item.key, item.path)}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
                isActive
                  ? 'text-emerald-600 dark:text-emerald-400 font-extrabold scale-105'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium'
              }`}
            >
              <div className={`p-1 rounded-lg ${isActive ? 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400' : ''}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] tracking-tight mt-0.5 leading-none">
                {isHi ? item.labelHi : item.labelEn}
              </span>
            </button>
          );
        })}

        {/* Settings button */}
        <button
          onClick={onOpenSettings}
          className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium transition-all cursor-pointer"
        >
          <div className="p-1">
            <Settings className="w-5 h-5" />
          </div>
          <span className="text-[10px] tracking-tight mt-0.5 leading-none">
            {isHi ? 'सेटिंग्स' : 'Settings'}
          </span>
        </button>
      </div>
    </div>
  );
};
