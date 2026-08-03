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

  // Navigation Controller & State Shared with top Header
  const [currentNav, setCurrentNav] = useState<any>({ type: 'home' });
  const [navController, setNavController] = useState<{
    updateNav: (newNav: any) => void;
    goBack: () => void;
    goHome: () => void;
  } | null>(null);

  // PWA Install Event Prompt
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  // Helper to resolve page title dynamically for the top action bar
  const getPageTitle = (nav: any, lang: Language): string => {
    if (!nav || nav.type === 'home') return '';
    const isHi = lang === 'hi';
    
    if (nav.type === 'category') {
      const catId = nav.id;
      if (catId === 'peeo') return isHi ? 'पीईईओ / प्रधानाचार्य कार्यालय' : 'PEEO Tools';
      if (catId === 'teacher') return isHi ? 'शिक्षक एवं अकादमिक मॉड्यूल' : 'Teacher Tools';
      if (catId === 'incharge') return isHi ? 'कार्य व योजना प्रभारी' : 'Incharge Modules';
      if (catId === 'portals') return isHi ? 'सरकारी शिक्षा पोर्टल्स' : 'Gov Portals';
      if (catId === 'student') return isHi ? 'विद्यार्थी पोर्टल' : 'Student App';
    }
    
    if (nav.type === 'tool') {
      const cat = nav.category;
      const sub = nav.subtab;
      const subComp = nav.subComponent;
      
      if (cat === 'teacher' && sub === 'pti') {
        if (subComp === 'kridaShulk') return isHi ? 'क्रीड़ा शुल्क (Sports Fee)' : 'Sports Fee Maker';
        if (subComp === 'healthBmi') return isHi ? 'विद्यार्थी स्वास्थ्य एवं बीएमआई' : 'Student Health & BMI';
        if (subComp === 'sportsStock') return isHi ? 'खेलकूद सामग्री स्टॉक' : 'Sports Goods Stock';
        if (subComp === 'ptGrading') return isHi ? 'शारीरिक शिक्षा ग्रेडिंग' : 'PT Exam Grading';
        return isHi ? 'शारीरिक शिक्षक (PTI) टूल' : 'PTI Tools';
      }
      
      if (cat === 'teacher' && sub === 'marksheet') return isHi ? 'अंकतालिका जनरेटर' : 'Marksheet Generator';
      if (cat === 'teacher' && sub === 'diary') return isHi ? 'शिक्षक दैनन्दिनी (Diary)' : 'Teacher Diary';
      if (cat === 'teacher' && sub === 'library') return isHi ? 'पुस्तकालय अध्यक्ष' : 'Librarian Register';
      if (cat === 'teacher' && sub === 'computer') return isHi ? 'कंप्यूटर शिक्षक / आईसीटी लैब' : 'Computer Lab Tracker';
      if (cat === 'teacher' && sub === 'anomaly') return isHi ? 'आधार / जन-आधार सत्यापन' : 'Aadhaar Verification';
      
      if (cat === 'incharge' && sub === 'mdm') return isHi ? 'मिड-डे मील (MDM)' : 'Mid-Day Meal Register';
      if (cat === 'incharge' && sub === 'transport') return isHi ? 'ट्रांसपोर्ट वाउचर' : 'Transport Voucher';
      if (cat === 'incharge' && sub === 'scholarship') return isHi ? 'छात्रवृत्ति ट्रैकर' : 'Scholarship Tracker';
      if (cat === 'incharge' && sub === 'exam') return isHi ? 'परीक्षा सिटिंग प्लान' : 'Seating & Room Matrix';
      if (cat === 'incharge' && sub === 'remuneration') return isHi ? 'बोर्ड परीक्षा मानदेय' : 'Exam Remuneration';
      if (cat === 'incharge' && sub === 'resizer') return isHi ? 'फोटो व साइन रिसाइज़र' : 'Image Resizer';
      if (cat === 'incharge' && sub === 'qrcode') return isHi ? 'क्यूआर कोड जनरेटर' : 'QR Code Generator';
      
      if (cat === 'peeo' && sub === 'increment') return isHi ? 'वार्षिक वेतन वृद्धि' : 'Increment Calculator';
      if (cat === 'peeo' && sub === 'timetable') return isHi ? 'समय-सारणी जनरेटर' : 'Time Table Generator';
      if (cat === 'peeo' && sub === 'incharge') return isHi ? 'प्रभारी मैपिंग' : 'Incharge Mapping';
      if (cat === 'peeo' && sub === 'substitution') return isHi ? 'दैनिक स्थानापन्न' : 'Substitution Tracker';
      if (cat === 'peeo' && sub === 'apar') return isHi ? 'APAR अनुमोदन' : 'APAR Approval';
      if (cat === 'peeo' && sub === 'satyapan') return isHi ? 'दस्तावेज़ सत्यापन' : 'Verification Checklist';
      
      if (cat === 'portals' && sub === 'calculator') return isHi ? 'वेतन व आयकर कैलकुलेटर' : 'Salary Calculator';
      if (cat === 'portals' && sub === 'formats') return isHi ? 'विभागीय प्रपत्र (Formats)' : 'Official Formats';
      if (cat === 'portals' && sub === 'portals') return isHi ? 'शिक्षा विभाग पोर्टल्स' : 'Gov Portals';
      
      if (cat === 'student' && sub === 'timetable') return isHi ? 'कक्षा समय-सारणी' : 'Class Timetable';
      if (cat === 'student' && sub === 'homework') return isHi ? 'गृहकार्य व असाइनमेंट' : 'Homework & Assignments';
      if (cat === 'student' && sub === 'datesheet') return isHi ? 'बोर्ड परीक्षा टाइम टेबल' : 'Board Exam Datesheet';
      if (cat === 'student' && sub === 'syllabus') return isHi ? 'पाठ्यक्रम व मॉडल पेपर्स' : 'Syllabus & Papers';
      if (cat === 'student' && sub === 'doubts') return isHi ? 'शंका समाधान व क्विज़' : 'Ask Doubts & Quiz';
    }
    
    if (nav.type === 'shivira') return isHi ? 'शिविरा पंचांग 2026' : 'Shivira Calendar 2026';
    if (nav.type === 'invitation') return isHi ? 'निमंत्रण पत्र जनरेटर' : 'Invitation Card Maker';
    if (nav.type === 'help') return isHi ? 'उपयोग मार्गदर्शिकाएँ व सहायता केंद्र' : 'Help Guides Center';
    if (nav.type === 'hub') return isHi ? 'राजस्थान शिक्षा मास्टर पिलर हब' : 'Teacher & PEEO Master Resource Hub';
    if (nav.type === 'legal') {
      if (nav.subtab === 'privacy') return isHi ? 'गोपनीयता नीति' : 'Privacy Policy';
      if (nav.subtab === 'terms') return isHi ? 'नियम व शर्तें' : 'Terms & Conditions';
      if (nav.subtab === 'disclaimer') return isHi ? 'अस्वीकरण' : 'Disclaimer';
      return isHi ? 'नीति एवं शर्तें' : 'Policies & Terms';
    }
    if (nav.type === 'about-us') return isHi ? 'हमारे बारे में' : 'About Us';
    if (nav.type === 'contact-us') return isHi ? 'संपर्क करें' : 'Contact Us';
    
    return '';
  };

  useEffect(() => {
    // Register Service Worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(err => {
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
          currentNav={currentNav}
          onGoBack={() => navController?.goBack()}
          onGoHome={() => navController?.goHome()}
          pageTitle={getPageTitle(currentNav, lang)}
        />
      </div>

      {/* Main Responsive Webview Container */}
      <main className="flex-1 max-w-7xl mx-auto p-3 sm:p-6 lg:p-8 space-y-6 w-full transition-all duration-300 pt-20 sm:pt-24 pb-16 md:pb-12 app-main-content">
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
          onNavChange={setCurrentNav}
          onRegisterController={setNavController}
        />

        {/* Bottom Footer & Social Media Banner Bar at Lowest Level */}
        <div className="w-full mt-auto app-footer-container no-print">
          <Footer
            lang={lang}
            onOpenFeedback={() => setIsFeedbackOpen(true)}
          />

          <div className="hidden md:block">
            <SocialHeaderBar />
          </div>
        </div>
      </main>

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
