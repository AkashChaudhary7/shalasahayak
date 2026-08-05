import React, { useState, useEffect } from 'react';
import { Language, SchoolProfile, Teacher, InchargeAssignment, StudentResult, StudentAnomaly, ICTEquipment, LibraryBook, MDMLog } from './types';
import { storage } from './utils/storage';
import { Header } from './components/Header';
import { SocialHeaderBar } from './components/SocialHeaderBar';
import { SchoolProfileModal } from './components/SchoolProfileModal';
import { PwaInstallBanner } from './components/PwaInstallBanner';
import { DirectoryDashboard } from './components/DirectoryDashboard';
import { FeedbackModal } from './components/FeedbackModal';
import { Footer } from './components/Footer';

export default function App() {
  const [lang, setLang] = useState<Language>('hi');
  const [darkMode, setDarkMode] = useState<boolean>(false);

  // App Data State
  const [schoolProfile, setSchoolProfile] = useState<SchoolProfile>(storage.getSchoolProfile);
  const [teachers, setTeachers] = useState<Teacher[]>(storage.getTeachers);
  const [incharges, setIncharges] = useState<InchargeAssignment[]>(storage.getIncharges);
  const [students, setStudents] = useState<StudentResult[]>(storage.getStudents);
  const [anomalies, setAnomalies] = useState<StudentAnomaly[]>(storage.getAnomalies);
  const [ictItems, setIctItems] = useState<ICTEquipment[]>(storage.getIctItems);
  const [libraryBooks, setLibraryBooks] = useState<LibraryBook[]>(storage.getLibraryBooks);
  const [mdmLogs, setMdmLogs] = useState<MDMLog[]>(storage.getMdmLogs);

  // Modals
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  // PWA Install Event Prompt
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Register Service Worker with cache-busting strategy
    if ('serviceWorker' in navigator) {
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

  // Sync Data to LocalStorage
  const handleSaveProfile = (updated: SchoolProfile) => {
    setSchoolProfile(updated);
    storage.setSchoolProfile(updated);
  };

  const handleUpdateTeachers = (updated: Teacher[]) => {
    setTeachers(updated);
    storage.setTeachers(updated);
  };

  const handleUpdateIncharges = (updated: InchargeAssignment[]) => {
    setIncharges(updated);
    storage.setIncharges(updated);
  };

  const handleUpdateStudents = (updated: StudentResult[]) => {
    setStudents(updated);
    storage.setStudents(updated);
  };

  const handleUpdateAnomalies = (updated: StudentAnomaly[]) => {
    setAnomalies(updated);
    storage.setAnomalies(updated);
  };

  const handleUpdateIctItems = (updated: ICTEquipment[]) => {
    setIctItems(updated);
    storage.setIctItems(updated);
  };

  const handleUpdateLibraryBooks = (updated: LibraryBook[]) => {
    setLibraryBooks(updated);
    storage.setLibraryBooks(updated);
  };

  const handleUpdateMdmLogs = (updated: MDMLog[]) => {
    setMdmLogs(updated);
    storage.setMdmLogs(updated);
  };

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
        <DirectoryDashboard
          schoolProfile={schoolProfile}
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

    </div>
  );
}
