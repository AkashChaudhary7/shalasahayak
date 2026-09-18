import React, { useState, useEffect } from 'react';
import { Language } from './types';
import { useSchoolData } from './hooks/useSchoolData';
import { Header } from './components/Header';
import { SocialHeaderBar } from './components/SocialHeaderBar';
import { SchoolProfileModal } from './components/SchoolProfileModal';
import { PwaInstallBanner } from './components/PwaInstallBanner';
import { DirectoryDashboard } from './components/DirectoryDashboard';
import { FeedbackModal } from './components/FeedbackModal';
import { Footer } from './components/Footer';
import { BottomNavigation } from './components/BottomNavigation';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { 
  UserOnboardingModal, 
  UserProfileState, 
  getStoredUserProfile 
} from './components/UserOnboardingModal';

export default function App() {
  const [lang, setLang] = useState<Language>('hi');
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Global shortcut for Search: Ctrl+K or Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // User Onboarding & Personalized Profile State
  const [userProfile, setUserProfile] = useState<UserProfileState>(getStoredUserProfile);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(false);

  useEffect(() => {
    // Check if user has completed onboarding
    const profile = getStoredUserProfile();
    if (!profile.hasCompletedOnboarding) {
      // In mobile view (screen < 768px), prompt onboarding modal
      const isMobile = window.innerWidth < 768;
      if (isMobile) {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        setIsOnboardingOpen(true);
      }
    }
  }, []);

  // App Data State managed via modular hook
  const {
    schoolProfile,
    teachers,
    incharges,
    students,
    anomalies,
    ictItems,
    libraryBooks,
    mdmLogs,
    handleSaveProfile,
    handleUpdateTeachers,
    handleUpdateIncharges,
    handleUpdateStudents,
    handleUpdateAnomalies,
    handleUpdateIctItems,
    handleUpdateLibraryBooks,
    handleUpdateMdmLogs,
  } = useSchoolData();

  // Modals
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  // PWA Install Event Prompt
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Register Service Worker with cache-busting strategy in production only
    if ('serviceWorker' in navigator && import.meta.env.PROD) {
      const swUrl = `/sw.js?v=3.0.4-cb-${new Date().toDateString().replace(/\s+/g, '-')}`;
      navigator.serviceWorker.register(swUrl, { updateViaCache: 'none' }).then((reg) => {
        reg.update();
      }).catch(err => {
        console.log('Service Worker Registration failed', err);
      });
    }

    // Capture PWA beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // Sync Dark Mode with root documentElement for consistent rendering across devices
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleInstallPwa = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted PWA prompt');
        }
        setDeferredPrompt(null);
      });
    }
  };

  return (
    <div className={`min-h-screen flex flex-col justify-between ${darkMode ? 'dark text-slate-100 bg-slate-950/70' : 'text-slate-900 bg-slate-50/60'} backdrop-blur-[1px] transition-colors font-sans app-root-container`}>
      
      {/* Header */}
      <div className="app-header-container no-print">
        {/* Top Glassmorphic Header */}
        <Header
          lang={lang}
          onToggleLang={() => setLang(prev => prev === 'hi' ? 'en' : 'hi')}
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode(!darkMode)}
          schoolProfile={schoolProfile}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenSearch={() => setIsSearchOpen(true)}
          onNavigate={(path) => {
            let cleanPath = path;
            if (path.startsWith('#')) {
              cleanPath = path.replace('#', '/');
            }
            if (!cleanPath.startsWith('/')) {
              cleanPath = '/' + cleanPath;
            }
            window.history.pushState(null, '', cleanPath);
            window.dispatchEvent(new PopStateEvent('popstate'));
          }}
        />
      </div>

      {/* Main Responsive Webview Container */}
      <main className="flex-1 max-w-7xl mx-auto px-3 pb-10 pt-20 sm:px-6 sm:pt-24 md:pt-28 lg:px-8 space-y-6 w-full transition-all duration-300 app-main-content">
        {deferredPrompt && (
          <div className="no-print mb-2">
            <PwaInstallBanner onInstall={handleInstallPwa} lang={lang} />
          </div>
        )}

        <DirectoryDashboard
          schoolProfile={schoolProfile}
          onUpdateSchoolProfile={handleSaveProfile}
          teachers={teachers}
          onUpdateTeachers={handleUpdateTeachers}
          incharges={incharges}
          onUpdateIncharges={handleUpdateIncharges}
          students={students}
          onUpdateStudents={handleUpdateStudents}
          anomalies={anomalies}
          onUpdateAnomalies={handleUpdateAnomalies}
          ictItems={ictItems}
          onUpdateIctItems={handleUpdateIctItems}
          libraryBooks={libraryBooks}
          onUpdateLibraryBooks={handleUpdateLibraryBooks}
          mdmLogs={mdmLogs}
          onUpdateMdmLogs={handleUpdateMdmLogs}
          lang={lang}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenFeedback={() => setIsFeedbackOpen(true)}
          userProfile={userProfile}
          onOpenOnboarding={() => {
            window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
            setIsOnboardingOpen(true);
          }}
          onUpdateUserProfile={(profile) => setUserProfile(profile)}
        />
      </main>

      {/* Bottom Footer & Social Media Banner Bar at Lowest Level */}
      <div className="w-full mt-auto app-footer-container no-print">
        {/* Social Media Bar ABOVE Footer */}
        <SocialHeaderBar />

        {/* Footer */}
        <Footer
          lang={lang}
          onOpenFeedback={() => setIsFeedbackOpen(true)}
          onNavigate={(path) => {
            let cleanPath = path;
            if (path.startsWith('#')) {
              cleanPath = path.replace('#', '/');
            }
            if (!cleanPath.startsWith('/')) {
              cleanPath = '/' + cleanPath;
            }
            window.history.pushState(null, '', cleanPath);
            window.dispatchEvent(new PopStateEvent('popstate'));
          }}
        />
      </div>

      {/* Mobile Sticky Bottom Navigation Bar */}
      <BottomNavigation
        lang={lang}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onNavigate={(path) => {
          let cleanPath = path;
          if (path.startsWith('#')) {
            cleanPath = path.replace('#', '/');
          }
          if (!cleanPath.startsWith('/')) {
            cleanPath = '/' + cleanPath;
          }
          window.history.pushState(null, '', cleanPath);
          window.dispatchEvent(new PopStateEvent('popstate'));
        }}
      />

      {/* Settings Modal */}
      <SchoolProfileModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        schoolProfile={schoolProfile}
        onSave={handleSaveProfile}
        lang={lang}
      />

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
        lang={lang}
      />

      {/* User Onboarding & Personalized Dashboard Modal */}
      <UserOnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onSave={(updated) => {
          setUserProfile(updated);
          setIsOnboardingOpen(false);
        }}
        lang={lang}
        initialProfile={userProfile}
        isFirstTime={!userProfile.hasCompletedOnboarding}
      />

      {/* Global Fuzzy Search Modal (Ctrl + K) */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        lang={lang}
        onNavigate={(path) => {
          setIsSearchOpen(false);
          let cleanPath = path;
          if (path.startsWith('#')) {
            cleanPath = path.replace('#', '/');
          }
          if (!cleanPath.startsWith('/')) {
            cleanPath = '/' + cleanPath;
          }
          window.history.pushState(null, '', cleanPath);
          window.dispatchEvent(new PopStateEvent('popstate'));
        }}
      />

    </div>
  );
}
