import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Check, 
  X, 
  User, 
  Briefcase, 
  ShieldCheck, 
  BookOpen, 
  Utensils, 
  Trophy, 
  Award, 
  Calculator, 
  Layers, 
  GraduationCap, 
  Laptop, 
  Globe,
  Sliders,
  CheckCheck
} from 'lucide-react';
import { Language } from '../types';

export type UserRole =
  | 'peeo'
  | 'principal'
  | 'lecturer'
  | 'sr_teacher'
  | 'teacher_l2'
  | 'teacher_l1'
  | 'pti'
  | 'clerk'
  | 'other';

export type UserCharge =
  | 'all'
  | 'peeo'
  | 'exam'
  | 'shaladarpan'
  | 'mdm'
  | 'sports'
  | 'scholarship'
  | 'salary'
  | 'library'
  | 'classteacher';

export interface UserProfileState {
  name: string;
  role: UserRole;
  charges: UserCharge[];
  hasCompletedOnboarding: boolean;
  filterMode?: 'charges' | 'all';
}

export const USER_PROFILE_STORAGE_KEY = 'shala_sahayak_user_profile';

export const getStoredUserProfile = (): UserProfileState => {
  try {
    const raw = localStorage.getItem(USER_PROFILE_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        return {
          name: parsed.name || '',
          role: parsed.role || 'peeo',
          charges: Array.isArray(parsed.charges) && parsed.charges.length > 0 ? parsed.charges : ['all'],
          hasCompletedOnboarding: !!parsed.hasCompletedOnboarding,
          filterMode: parsed.filterMode || (parsed.charges?.includes('all') ? 'all' : 'charges')
        };
      }
    }
  } catch (e) {
    console.error('Error loading stored user profile', e);
  }
  return {
    name: '',
    role: 'peeo',
    charges: ['all'],
    hasCompletedOnboarding: false,
    filterMode: 'all'
  };
};

export const saveStoredUserProfile = (profile: UserProfileState) => {
  try {
    localStorage.setItem(USER_PROFILE_STORAGE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error('Error saving user profile', e);
  }
};

export const getRoleLabel = (role: UserRole, lang: Language): string => {
  const isHi = lang === 'hi';
  switch (role) {
    case 'peeo': return isHi ? 'पीईईओ / यूसीईईओ' : 'PEEO / UCEEO';
    case 'principal': return isHi ? 'प्रधानाचार्य / संस्था प्रधान' : 'Principal / HM';
    case 'lecturer': return isHi ? 'प्राध्यापक / व्याख्याता' : 'School Lecturer';
    case 'sr_teacher': return isHi ? 'वरिष्ठ अध्यापक (2nd Grade)' : 'Senior Teacher';
    case 'teacher_l2': return isHi ? 'अध्यापक Level-2' : 'Teacher Level-2';
    case 'teacher_l1': return isHi ? 'अध्यापक Level-1' : 'Teacher Level-1';
    case 'pti': return isHi ? 'शारीरिक शिक्षक (PTI)' : 'Physical Teacher (PTI)';
    case 'clerk': return isHi ? 'कनिष्ठ सहायक / लिपिक' : 'Office Assistant';
    case 'other': return isHi ? 'अन्य कार्मिक' : 'Staff Member';
    default: return isHi ? 'शिक्षक साथी' : 'Educator';
  }
};

export const getChargeLabel = (charge: UserCharge, lang: Language): string => {
  const isHi = lang === 'hi';
  switch (charge) {
    case 'all': return isHi ? 'सभी प्रभार (All)' : 'All Charges';
    case 'peeo': return isHi ? 'पीईईओ प्रभार' : 'PEEO Charge';
    case 'exam': return isHi ? 'परीक्षा प्रभारी' : 'Exam Incharge';
    case 'shaladarpan': return isHi ? 'शाला दर्पण' : 'Shala Darpan';
    case 'mdm': return isHi ? 'एमडीएम व दुग्ध' : 'MDM & Milk';
    case 'sports': return isHi ? 'क्रीड़ा / खेलकूद (PTI)' : 'Sports & PTI';
    case 'salary': return isHi ? 'वेतन व बिल' : 'Salary & DDO';
    case 'scholarship': return isHi ? 'छात्रवृत्ति व वाउचर' : 'Scholarship';
    case 'library': return isHi ? 'पुस्तकालय व ICT' : 'Library & ICT';
    case 'classteacher': return isHi ? 'कक्षा अध्यापक' : 'Class Teacher';
    default: return charge;
  }
};

interface UserOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (profile: UserProfileState) => void;
  lang: Language;
  initialProfile?: UserProfileState;
  isFirstTime?: boolean;
}

export const UserOnboardingModal: React.FC<UserOnboardingModalProps> = ({
  isOpen,
  onClose,
  onSave,
  lang,
  initialProfile,
  isFirstTime = false
}) => {
  const isHi = lang === 'hi';

  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('peeo');
  const [charges, setCharges] = useState<UserCharge[]>(['all']);

  const outerOverlayRef = React.useRef<HTMLDivElement>(null);
  const scrollableContentRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialProfile) {
      setName(initialProfile.name || '');
      setRole(initialProfile.role || 'peeo');
      setCharges(initialProfile.charges && initialProfile.charges.length > 0 ? initialProfile.charges : ['all']);
    } else {
      const stored = getStoredUserProfile();
      setName(stored.name || '');
      setRole(stored.role || 'peeo');
      setCharges(stored.charges && stored.charges.length > 0 ? stored.charges : ['all']);
    }
  }, [initialProfile, isOpen]);

  useEffect(() => {
    if (isOpen) {
      // Force page and modal to top immediately - user doesn't have to scroll
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      requestAnimationFrame(() => {
        window.scrollTo(0, 0);
        if (outerOverlayRef.current) outerOverlayRef.current.scrollTop = 0;
        if (scrollableContentRef.current) scrollableContentRef.current.scrollTop = 0;
      });
      const timer = setTimeout(() => {
        window.scrollTo(0, 0);
        if (outerOverlayRef.current) outerOverlayRef.current.scrollTop = 0;
        if (scrollableContentRef.current) scrollableContentRef.current.scrollTop = 0;
      }, 50);

      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        clearTimeout(timer);
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const roleOptions: { id: UserRole; labelHi: string; labelEn: string; icon: any; color: string }[] = [
    { id: 'peeo', labelHi: 'पीईईओ / यूसीईईओ', labelEn: 'PEEO / UCEEO', icon: ShieldCheck, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 dark:text-emerald-300' },
    { id: 'principal', labelHi: 'प्रधानाचार्य / संस्था प्रधान', labelEn: 'Principal / Headmaster', icon: Award, color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/50 dark:text-amber-300' },
    { id: 'lecturer', labelHi: 'प्राध्यापक / व्याख्याता', labelEn: 'School Lecturer', icon: GraduationCap, color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/50 dark:text-blue-300' },
    { id: 'sr_teacher', labelHi: 'वरिष्ठ अध्यापक (2nd Grade)', labelEn: 'Senior Teacher', icon: BookOpen, color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 dark:text-indigo-300' },
    { id: 'teacher_l2', labelHi: 'अध्यापक लेवल-2 (6-8)', labelEn: 'Teacher Level 2', icon: User, color: 'text-teal-600 bg-teal-50 dark:bg-teal-950/50 dark:text-teal-300' },
    { id: 'teacher_l1', labelHi: 'अध्यापक लेवल-1 (1-5)', labelEn: 'Teacher Level 1', icon: User, color: 'text-cyan-600 bg-cyan-50 dark:bg-cyan-950/50 dark:text-cyan-300' },
    { id: 'pti', labelHi: 'शारीरिक शिक्षक (PTI)', labelEn: 'Physical Teacher / PTI', icon: Trophy, color: 'text-orange-600 bg-orange-50 dark:bg-orange-950/50 dark:text-orange-300' },
    { id: 'clerk', labelHi: 'कनिष्ठ सहायक / एलडीसी / यूडीसी', labelEn: 'Office Assistant / Clerk', icon: Briefcase, color: 'text-purple-600 bg-purple-50 dark:bg-purple-950/50 dark:text-purple-300' },
    { id: 'other', labelHi: 'अन्य कार्मिक / कर्मचारी', labelEn: 'Other Educator', icon: Globe, color: 'text-slate-600 bg-slate-100 dark:bg-slate-800 dark:text-slate-300' },
  ];

  const chargeOptions: { id: UserCharge; labelHi: string; labelEn: string; descHi: string; descEn: string; icon: any; isSpecialAll?: boolean }[] = [
    {
      id: 'all',
      labelHi: '✨ सभी प्रभार (All Charges) - सम्पूर्ण विद्यालय',
      labelEn: '✨ All Charges & Portals (Complete Suite)',
      descHi: 'सभी टूल्स, मॉड्यूल व सरकारी लिंक एक साथ मुख्य स्क्रीन पर उपलब्ध रहें',
      descEn: 'Display all 14+ modules without filtering',
      icon: CheckCheck,
      isSpecialAll: true
    },
    {
      id: 'peeo',
      labelHi: 'पीईईओ / संस्था प्रधान प्रभार',
      labelEn: 'PEEO / Principal Orders',
      descHi: 'वेतन वृद्धि आदेश, समय-सारणी, दैनिक स्थानापन्न, APAR व दस्तावेज सत्यापन',
      descEn: 'Increment orders, school timetable, daily substitute & APAR',
      icon: ShieldCheck
    },
    {
      id: 'exam',
      labelHi: 'परीक्षा प्रभारी (Exam Incharge)',
      labelEn: 'Examination Incharge',
      descHi: 'परीक्षा समय-सारणी, परीक्षा बैठक व्यवस्था (A-B-A-B), वीक्षक ड्यूटी आवंटन व ग्रीनशीट',
      descEn: 'Seating plan, exam schedule, invigilator duty roster & marksheet',
      icon: Layers
    },
    {
      id: 'shaladarpan',
      labelHi: 'शाला दर्पण व पोर्टल प्रभारी',
      labelEn: 'Shala Darpan / Portals Incharge',
      descHi: 'शाला दर्पण, स्टाफ कॉर्नर, पीएसपी पोर्टल, छात्र प्रविष्टि व विभागीय प्रारूप',
      descEn: 'Shala Darpan, Staff Corner, PSP & department forms',
      icon: Globe
    },
    {
      id: 'mdm',
      labelHi: 'मिड-डे मील (MDM) व दुग्ध योजना',
      labelEn: 'MDM & Milk Scheme Incharge',
      descHi: 'दैनिक खाद्यान्न (गेहूँ/चावल) गणना, कुकिंग कन्वर्जन कॉस्ट व दुग्ध योजना रजिस्टर',
      descEn: 'Daily grain consumption, cooking cost calculator & milk scheme',
      icon: Utensils
    },
    {
      id: 'sports',
      labelHi: 'क्रीड़ा / खेलकूद प्रभारी (PTI)',
      labelEn: 'Sports & PT Incharge',
      descHi: 'क्रीड़ा शुल्क (Sports Fee) मेकर, खेलकूद उपकरण स्टॉक, पीटी ग्रेडिंग व बीएमआई',
      descEn: 'Sports fee calculator, goods stock register & fitness grading',
      icon: Trophy
    },
    {
      id: 'salary',
      labelHi: 'वेतन, 7वां वेतन आयोग व DDO सहायता',
      labelEn: 'Salary, 7th Pay & DDO Tools',
      descHi: 'मूल वेतन, डीए, एचआरए, 7वें वेतन आयोग की मैट्रिक्स गणना व पे-मैनेजर लिंक',
      descEn: 'Basic pay, DA/HRA calculator, 7th Pay matrix & PayManager',
      icon: Calculator
    },
    {
      id: 'scholarship',
      labelHi: 'छात्रवृत्ति व निःशुल्क पाठ्यपुस्तक',
      labelEn: 'Scholarship & Textbooks Incharge',
      descHi: 'छात्रवृत्ति ट्रैकर, ट्रांसपोर्ट वाउचर व निःशुल्क पुस्तक वितरण रजिस्टर',
      descEn: 'Pre/post matric scholarship status & transport vouchers',
      icon: Award
    },
    {
      id: 'library',
      labelHi: 'पुस्तकालय व आईसीटी लैब प्रभारी',
      labelEn: 'Library & ICT Lab Incharge',
      descHi: 'पुस्तकालय एक्सेस रजिस्टर, पुस्तक लेनदेन व कंप्यूटर लैब उपकरण स्टॉक',
      descEn: 'Library catalogue, book issuing & ICT computer lab register',
      icon: Laptop
    },
    {
      id: 'classteacher',
      labelHi: 'कक्षा अध्यापक प्रभार (Class Teacher)',
      labelEn: 'Class Teacher Portfolio',
      descHi: 'ग्रीन शीट रिजल्ट, अंकतालिका, दैनिक शिक्षक दैनन्दिनी (डायरी) व आधार सत्यापन',
      descEn: 'Marksheet generation, daily teacher diary & student verification',
      icon: GraduationCap
    },
  ];

  const toggleCharge = (chargeId: UserCharge) => {
    if (chargeId === 'all') {
      if (charges.includes('all')) {
        // Deselecting all -> fallback to peeo and exam
        setCharges(['peeo', 'exam']);
      } else {
        // Selecting all -> exclusive or includes all
        setCharges(['all']);
      }
      return;
    }

    let next = charges.filter(c => c !== 'all');
    if (next.includes(chargeId)) {
      next = next.filter(c => c !== chargeId);
      if (next.length === 0) {
        next = ['all'];
      }
    } else {
      next.push(chargeId);
    }
    setCharges(next);
  };

  const handleSave = () => {
    const finalCharges = charges.length > 0 ? charges : ['all'];
    const updated: UserProfileState = {
      name: name.trim() || (isHi ? 'शिक्षक साथी' : 'Teacher'),
      role,
      charges: finalCharges,
      hasCompletedOnboarding: true,
      filterMode: finalCharges.includes('all') ? 'all' : 'charges'
    };
    saveStoredUserProfile(updated);
    onSave(updated);
    onClose();
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  };

  const handleSkip = () => {
    const fallback: UserProfileState = {
      name: name.trim() || (isHi ? 'शिक्षक साथी' : 'Teacher'),
      role: 'peeo',
      charges: ['all'],
      hasCompletedOnboarding: true,
      filterMode: 'all'
    };
    saveStoredUserProfile(fallback);
    onSave(fallback);
    onClose();
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  };

  const honorifics = isHi ? ['श्री', 'श्रीमती', 'सुश्री', 'डॉ.'] : ['Mr.', 'Mrs.', 'Ms.', 'Dr.'];

  return (
    <div 
      ref={outerOverlayRef}
      className="fixed inset-0 z-[2000] flex items-start justify-center p-2 sm:p-4 pt-1 sm:pt-3 md:pt-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto animate-fadeIn"
    >
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-2xl max-h-[calc(100dvh-0.5rem)] sm:max-h-[calc(100dvh-1.5rem)] md:max-h-[92vh] flex flex-col overflow-hidden text-slate-900 dark:text-slate-100 my-0">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20 shrink-0 shadow-inner">
              <Sliders className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg leading-tight flex items-center gap-1.5">
                <span>{isHi ? 'डैशबोर्ड निजीकरण एवं प्रभार चयन' : 'Personalize Your Dashboard'}</span>
                <span className="text-[10px] uppercase font-black px-1.5 py-0.5 rounded bg-amber-400 text-slate-950">
                  {isHi ? 'स्मार्ट प्रोफाइल' : 'Smart'}
                </span>
              </h3>
              <p className="text-xs text-emerald-100/90 font-medium mt-0.5">
                {isHi ? 'आपके पद व प्रभार अनुसार उपयोगी टूल्स स्वतः व्यवस्थित होंगे' : 'Your role & charges tailor your dashboard view'}
              </p>
            </div>
          </div>

          {!isFirstTime && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Scrollable Content */}
        <div 
          ref={scrollableContentRef}
          className="p-4 sm:p-6 overflow-y-auto space-y-6 text-xs divide-y divide-slate-100 dark:divide-slate-800"
        >
          
          {/* Section 1: User Name */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="font-black text-xs sm:text-sm text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <User className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>1. {isHi ? 'आपका नाम (Your Name)' : '1. Your Name'}</span>
              </label>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                {isHi ? '(अभिवादन हेतु)' : '(For personalized greeting)'}
              </span>
            </div>

            {/* Quick prefix chips */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] text-slate-400 font-semibold">{isHi ? 'उपाधि:' : 'Prefix:'}</span>
              {honorifics.map(pref => (
                <button
                  key={pref}
                  type="button"
                  onClick={() => {
                    const cleanName = name.replace(/^(श्री|श्रीमती|सुश्री|डॉ\.|Mr\.|Mrs\.|Ms\.|Dr\.)\s*/, '');
                    setName(`${pref} ${cleanName}`.trim());
                  }}
                  className="px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-emerald-100 dark:bg-slate-800 dark:hover:bg-emerald-950/60 text-slate-700 dark:text-slate-300 text-[11px] font-bold border border-slate-200 dark:border-slate-700 transition-colors"
                >
                  {pref}
                </button>
              ))}
            </div>

            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder={isHi ? 'उदा. श्री रमेश कुमार शर्मा / Smt. Sunita Verma' : 'e.g. Ramesh Kumar Sharma'}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 font-bold text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            />
          </div>

          {/* Section 2: You Are (Designation / Role) */}
          <div className="pt-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="font-black text-xs sm:text-sm text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>2. {isHi ? 'आप हैं (Your Designation / Role)' : '2. You Are'}</span>
              </label>
              <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-bold">
                {roleOptions.find(r => r.id === role)?.[isHi ? 'labelHi' : 'labelEn']}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {roleOptions.map((opt) => {
                const Icon = opt.icon;
                const isSelected = role === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setRole(opt.id)}
                    className={`p-2.5 rounded-2xl border text-left flex items-center space-x-2 transition-all cursor-pointer active:scale-95 ${
                      isSelected
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 dark:border-emerald-500 shadow-sm ring-2 ring-emerald-500/20'
                        : 'bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${opt.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={`font-extrabold text-[11px] sm:text-xs truncate ${isSelected ? 'text-emerald-900 dark:text-emerald-200' : 'text-slate-800 dark:text-slate-200'}`}>
                        {isHi ? opt.labelHi : opt.labelEn}
                      </p>
                      <p className="text-[9.5px] text-slate-400 truncate">
                        {isHi ? opt.labelEn : opt.labelHi}
                      </p>
                    </div>
                    {isSelected && (
                      <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 font-bold" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: You Have Charge (Multiple Selection + All) */}
          <div className="pt-4 space-y-2.5">
            <div className="flex items-center justify-between flex-wrap gap-1">
              <label className="font-black text-xs sm:text-sm text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>3. {isHi ? 'आपके पास प्रभार / जिम्मेदारियां (You Have Charge)' : '3. You Have Charge'}</span>
              </label>
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                {isHi ? 'एक या एकाधिक प्रभार चुनें' : 'Multiple options allowed'}
              </span>
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              {isHi 
                ? 'जिस-जिस प्रभार का चयन करेंगे, डैशबोर्ड पर वे मॉड्यूल व टूल्स सीधे सबसे आगे दिखाई देंगे:' 
                : 'Selected charges will configure and prioritize your dashboard tools:'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {chargeOptions.map((opt) => {
                const Icon = opt.icon;
                const isSelected = charges.includes(opt.id);
                const isSpecial = opt.isSpecialAll;

                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => toggleCharge(opt.id)}
                    className={`p-3 rounded-2xl border text-left flex items-start space-x-2.5 transition-all cursor-pointer active:scale-98 ${
                      isSpecial
                        ? isSelected
                          ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-500 text-amber-950 dark:text-amber-100 ring-2 ring-amber-400/30 sm:col-span-2'
                          : 'bg-slate-50 dark:bg-slate-800/60 border-slate-300 dark:border-slate-700 hover:border-amber-400 sm:col-span-2'
                        : isSelected
                        ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500 text-emerald-950 dark:text-emerald-100 ring-1 ring-emerald-500/20'
                        : 'bg-white dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                      isSelected 
                        ? isSpecial ? 'bg-amber-500 text-slate-950' : 'bg-emerald-600 text-white' 
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className={`font-black text-xs ${isSelected ? (isSpecial ? 'text-amber-900 dark:text-amber-200 font-black' : 'text-emerald-900 dark:text-emerald-200') : 'text-slate-800 dark:text-slate-200'}`}>
                          {isHi ? opt.labelHi : opt.labelEn}
                        </span>
                        <div className={`w-4 h-4 rounded-md flex items-center justify-center border transition-all ${
                          isSelected
                            ? isSpecial ? 'bg-amber-500 border-amber-600 text-slate-950' : 'bg-emerald-600 border-emerald-600 text-white'
                            : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                        }`}>
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </div>

                      <p className="text-[10.5px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">
                        {isHi ? opt.descHi : opt.descEn}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={handleSkip}
            className="px-3.5 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 text-xs font-extrabold hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            {isHi ? 'डिफ़ॉल्ट रखें (Skip / Show All)' : 'Skip / Default All'}
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs sm:text-sm flex items-center space-x-2 shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{isHi ? 'डैशबोर्ड कस्टमाइज़ करें' : 'Personalize Dashboard'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
