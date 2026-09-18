import React, { useState } from 'react';
import { 
  Award, 
  Sparkles, 
  ArrowLeft, 
  CheckCircle2, 
  FileText, 
  Printer, 
  Download, 
  Search, 
  Plus, 
  Trash2, 
  ExternalLink, 
  Play, 
  Lightbulb, 
  BookOpen, 
  UserCheck, 
  Building2, 
  Share2, 
  HelpCircle,
  X,
  Check
} from 'lucide-react';
import { SchoolProfile } from '../../types';
import { ThreeDIcon, ThreeDCard } from '../ThreeDIcon';

interface InspireAwardInchargeModuleProps {
  schoolProfile: SchoolProfile;
  lang: 'en' | 'hi';
  onBack: () => void;
}

interface NominatedStudent {
  id: string;
  name: string;
  fatherName: string;
  className: string;
  gender: 'Boy' | 'Girl';
  projectTitle: string;
  category: string;
  synopsis: string;
  bankVerified: boolean;
  dbtStatus: 'Pending' | 'Nominated' | 'Selected' | 'DBT Received';
  applicationNo: string;
}

export const InspireAwardInchargeModule: React.FC<InspireAwardInchargeModuleProps> = ({
  schoolProfile,
  lang,
  onBack
}) => {
  const isHi = lang === 'hi';
  // Active Main Category Tab under Inspire Award (null = Overview Dashboard)
  type InspireSubTab = 'guidelines' | 'nominations' | 'ideabank' | 'pramani' | 'youtube';
  const [activeTab, setActiveTab] = useState<InspireSubTab | null>(null);

  // Path Sync
  React.useEffect(() => {
    const syncPathToTab = () => {
      const path = window.location.pathname.toLowerCase();
      if (path.includes('inspire')) {
        if (path.includes('nomination') || path.includes('student')) setActiveTab('nominations');
        else if (path.includes('idea')) setActiveTab('ideabank');
        else if (path.includes('pramani') || path.includes('certificate')) setActiveTab('pramani');
        else if (path.includes('guideline') || path.includes('rule')) setActiveTab('guidelines');
        else if (path.includes('youtube') || path.includes('help')) setActiveTab('youtube');
        else setActiveTab(null);
      }
    };

    syncPathToTab();
    window.addEventListener('popstate', syncPathToTab);
    return () => window.removeEventListener('popstate', syncPathToTab);
  }, []);

  const navigateToSubTab = (tab: InspireSubTab | null) => {
    setActiveTab(tab);
    const newPath = tab ? `/incharge-portal/inspire/${tab}` : `/incharge-inspire`;
    if (window.location.pathname !== newPath) {
      window.history.pushState(null, '', newPath);
    }
  };

  // YouTube Video Modal State
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [activeVideoUrl, setActiveVideoUrl] = useState<string>('');
  const [activeVideoTitle, setActiveVideoTitle] = useState<string>('');

  // Search & Filter for Nominations
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState('All');

  // Nominated Students State
  const [students, setStudents] = useState<NominatedStudent[]>([
    {
      id: 'insp-1',
      name: 'राहुल शर्मा (Rahul Sharma)',
      fatherName: 'सुरेश कुमार शर्मा',
      className: 'Class 8',
      gender: 'Boy',
      projectTitle: 'स्मार्ट वाटर लीक डिटेक्टर एवं ऑटो कट-ऑफ सिस्टम',
      category: 'Water Conservation',
      synopsis: 'पाइपलाइन में पानी रिसाव का त्वरित पता लगाकर स्वचालित रूप से मोटर बंद करने वाला किफायती सेंसर युक्त मॉडल।',
      bankVerified: true,
      dbtStatus: 'Nominated',
      applicationNo: 'INS-2026-8921'
    },
    {
      id: 'insp-2',
      name: 'अंजली मीणा (Anjali Meena)',
      fatherName: 'रामखिलाड़ी मीणा',
      className: 'Class 9',
      gender: 'Girl',
      projectTitle: 'सोलर चालित पोर्टेबल कृषि निंदाई मशीन',
      category: 'Agriculture',
      synopsis: 'छोटे किसानों हेतु सौर ऊर्जा आधारित कम लागत की निंदाई व गुड़ाई सहायता मशीन।',
      bankVerified: true,
      dbtStatus: 'Selected',
      applicationNo: 'INS-2026-8922'
    },
    {
      id: 'insp-3',
      name: 'विकास गुर्जर (Vikas Gurjar)',
      fatherName: 'हनुमान गुर्जर',
      className: 'Class 10',
      gender: 'Boy',
      projectTitle: 'दृष्टिबाधित हेतु स्मार्ट ब्लाइंड स्टिक (अल्ट्रासोनिक अलर्ट)',
      category: 'Assistive Tech',
      synopsis: 'बाधाओं से 2 मीटर दूर बजर एवं वाइब्रेशन अलर्ट देने वाली स्मार्ट छड़ी।',
      bankVerified: false,
      dbtStatus: 'Pending',
      applicationNo: 'INS-2026-8923'
    }
  ]);

  // Form State for Adding Nomination
  const [formName, setFormName] = useState('');
  const [formFather, setFormFather] = useState('');
  const [formClass, setFormClass] = useState('Class 8');
  const [formGender, setFormGender] = useState<'Boy' | 'Girl'>('Boy');
  const [formProject, setFormProject] = useState('');
  const [formCategory, setFormCategory] = useState('Eco-Friendly');
  const [formSynopsis, setFormSynopsis] = useState('');

  // Certificate / Report Form State
  const [certType, setCertType] = useState<'inchargeToPrincipal' | 'principalToOfficer'>('inchargeToPrincipal');
  const [certInchargeName, setCertInchargeName] = useState('रामअवतार यादव (वरिष्ठ अध्यापक)');
  const [certDispatchNo, setCertDispatchNo] = useState(`INS/2026/${Math.floor(1000 + Math.random() * 9000)}`);
  const [certDate, setCertDate] = useState(new Date().toISOString().split('T')[0]);

  // Handle Add Student
  const handleAddNomination = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formProject.trim()) return;

    const newStudent: NominatedStudent = {
      id: `insp-${Date.now()}`,
      name: formName,
      fatherName: formFather || 'अज्ञात',
      className: formClass,
      gender: formGender,
      projectTitle: formProject,
      category: formCategory,
      synopsis: formSynopsis || 'प्रोजेक्ट विवरण प्रस्तुत किया गया।',
      bankVerified: true,
      dbtStatus: 'Nominated',
      applicationNo: `INS-2026-${Math.floor(1000 + Math.random() * 9000)}`
    };

    setStudents([newStudent, ...students]);
    setFormName('');
    setFormFather('');
    setFormProject('');
    setFormSynopsis('');
    alert(isHi ? 'विद्यार्थी नामांकन सफलतापूर्क जोड़ा गया!' : 'Nomination added successfully!');
  };

  const handleDelete = (id: string) => {
    if (confirm(isHi ? 'क्या आप इस नामांकन को हटाना चाहते हैं?' : 'Delete this nomination?')) {
      setStudents(students.filter(s => s.id !== id));
    }
  };

  const openVideo = (url: string, title: string) => {
    setActiveVideoUrl(url);
    setActiveVideoTitle(title);
    setShowVideoModal(true);
  };

  const filteredStudents = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          s.projectTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.applicationNo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = classFilter === 'All' || s.className === classFilter;
    return matchesSearch && matchesClass;
  });

  const ideaBank = [
    {
      title: 'स्मार्ट वाटर लीक डिटेक्टर (Smart Water Leak Detector)',
      category: 'पर्यावरण व जल संरक्षण',
      synopsis: 'पाइपलाइन में पानी का रिसाव होते ही अलार्म बजाने एवं मोटर पंप को खुद बंद करने वाली स्वचालित तकनीक।',
      suitableClass: 'Class 6 - 8'
    },
    {
      title: 'सोलर आधारित बीजोपचार व सुखाने का यंत्र (Solar Seed Dryer)',
      category: 'कृषि एवं ग्रामीण तकनीक',
      synopsis: 'सौर ऊर्जा की मदद से अनाजों को नमी-मुक्त रखने व कीटाणुशोधन करने हेतु पोर्टेबल चेम्बर।',
      suitableClass: 'Class 9 - 10'
    },
    {
      title: 'दृष्टिबाधितों हेतु अल्ट्रासोनिक स्मार्ट चश्मा (Smart Glasses for Blind)',
      category: 'सहायक तकनीक (Assistive Tech)',
      synopsis: 'अल्ट्रासोनिक सेंसर से गड्ढे व दीवार आने पर बीप साउंड देने वाला किफायती चश्मा।',
      suitableClass: 'Class 8 - 10'
    },
    {
      title: 'ऑटोमैटिक डस्टबिन सह प्लास्टिक सेपरेटर (Smart Dustbin)',
      category: 'स्वच्छता व अपशिष्ट प्रबंधन',
      synopsis: 'गीले व सूखे कचरे तथा प्लास्टिक की पहचान कर अलग-अलग कम्पार्टमेन्ट में डालने वाला डस्टबिन।',
      suitableClass: 'Class 6 - 9'
    },
    {
      title: 'ब्लैकबोर्ड डस्ट कलेक्टर चौक होल्डर (Dustless Chalk Eraser)',
      category: 'विद्यालय व स्वास्थ्य सुरक्षा',
      synopsis: 'ब्लैकबोर्ड से चौक मिटाते समय उड़ने वाली धूल को वैक्यूम से सोखने वाला पोर्टेबल डस्टर।',
      suitableClass: 'Class 7 - 10'
    }
  ];

  return (
    <div className="space-y-5 animate-fadeIn pb-12">
      {/* ---------------- OVERVIEW DASHBOARD PAGE (When activeTab === null) ---------------- */}
      {activeTab === null && (
        <>
          {/* Top Header Card */}
          <div className="bg-gradient-to-r from-amber-900 via-amber-800 to-amber-950 rounded-3xl p-5 text-white shadow-xl border border-amber-700/60 relative overflow-hidden">
            <div className="absolute right-3 top-3 opacity-10 pointer-events-none">
              <Award className="w-44 h-44 text-amber-200" />
            </div>
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <button
                  onClick={onBack}
                  className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-all backdrop-blur-md border border-white/20 active:scale-95 cursor-pointer"
                  title={isHi ? 'पीछे जाएँ' : 'Go Back'}
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 p-2 flex items-center justify-center shadow-lg border border-amber-300/40 shrink-0">
                  <Award className="w-7 h-7 text-slate-950" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-200 text-[11px] font-black border border-amber-400/30">
                      DST / NIF India Govt
                    </span>
                    <span className="text-xs text-amber-200/80 font-medium">Session 2026-27</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-0.5">
                    {isHi ? 'इंस्पायर अवार्ड मानक योजना प्रभारी' : 'Inspire Award MANAK Portal'}
                  </h2>
                  <p className="text-xs text-amber-100/90 font-medium max-w-xl">
                    {isHi 
                      ? 'कक्षा 6 से 10 के बाल वैज्ञानिकों के मौलिक विचारों का ऑनलाइन नामांकन, ₹10,000 डीबीटी एवं प्रमाणीकरण पत्र जनरेटर।' 
                      : 'Nominate innovative student projects, verify DBT accounts & generate official verification certificates.'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => openVideo('https://www.youtube.com/embed/dQw4w9WgXcQ', isHi ? 'इंस्पायर अवार्ड नामांकन कैसे करें?' : 'How to submit Inspire Award Nomination')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-lg transition-all transform active:scale-95 shrink-0 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-slate-950" />
                <span>{isHi ? 'यूट्यूब ट्यूटोरियल देखें' : 'Watch YouTube Tutorial'}</span>
              </button>
            </div>

            {/* Quick Stats Banner */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-5 pt-4 border-t border-amber-700/50">
              <div className="bg-amber-950/60 p-2.5 rounded-2xl border border-amber-700/40 text-center">
                <span className="text-[10px] text-amber-300/90 font-bold block">{isHi ? 'कुल नामांकित छात्र' : 'Total Nominated'}</span>
                <span className="text-lg font-black text-amber-200">{students.length}</span>
              </div>
              <div className="bg-amber-950/60 p-2.5 rounded-2xl border border-amber-700/40 text-center">
                <span className="text-[10px] text-amber-300/90 font-bold block">{isHi ? 'बैंक खाता सत्यापित' : 'Bank Verified'}</span>
                <span className="text-lg font-black text-emerald-400">{students.filter(s => s.bankVerified).length}</span>
              </div>
              <div className="bg-amber-950/60 p-2.5 rounded-2xl border border-amber-700/40 text-center">
                <span className="text-[10px] text-amber-300/90 font-bold block">{isHi ? 'चयनित (Selected)' : 'Selected'}</span>
                <span className="text-lg font-black text-amber-300">{students.filter(s => s.dbtStatus === 'Selected').length}</span>
              </div>
              <div className="bg-amber-950/60 p-2.5 rounded-2xl border border-amber-700/40 text-center">
                <span className="text-[10px] text-amber-300/90 font-bold block">{isHi ? 'अवार्ड राशि प्रति छात्र' : 'Award Amount'}</span>
                <span className="text-lg font-black text-white">₹10,000</span>
              </div>
            </div>
          </div>

          {/* 3D Icon Modules Grid Section */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-4.5 shadow-md border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <ThreeDIcon name="award" size={26} />
                <div>
                  <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight">
                    {isHi ? 'इंस्पायर अवार्ड मुख्य प्रभाग (3D Modules)' : 'Inspire Award Key Modules'}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    {isHi ? 'मॉड्यूल कार्ड पर क्लिक करके नए पेज पर प्रविष्टि खोलें व रिपोर्ट जनरेट करें' : 'Click any module below to open its dedicated page'}
                  </p>
                </div>
              </div>
              <span className="hidden sm:inline-flex px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 text-xs font-black border border-amber-200 dark:border-amber-800">
                {isHi ? 'DST / NIF पोर्टल' : 'DST/NIF Portal'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-1">
              <ThreeDCard
                onClick={() => navigateToSubTab('guidelines')}
                icon="book"
                bgTint="bg-amber-50 dark:bg-amber-950/40"
                label={isHi ? '1. पात्रता व नियम' : '1. Guidelines'}
                badge="Rules"
              />
              <ThreeDCard
                onClick={() => navigateToSubTab('nominations')}
                icon="users"
                bgTint="bg-emerald-50 dark:bg-emerald-950/40"
                label={isHi ? '2. छात्र नामांकन' : '2. Nominations'}
                badge={`${students.length} Students`}
              />
              <ThreeDCard
                onClick={() => navigateToSubTab('ideabank')}
                icon="sparkles"
                bgTint="bg-purple-50 dark:bg-purple-950/40"
                label={isHi ? '3. आइडिया बैंक' : '3. Idea Bank'}
                badge="Ideas"
              />
              <ThreeDCard
                onClick={() => navigateToSubTab('pramani')}
                icon="award"
                bgTint="bg-blue-50 dark:bg-blue-950/40"
                label={isHi ? '4. प्रमाणीकरण पत्र' : '4. Certificate'}
                badge="A4 Letter"
              />
              <ThreeDCard
                onClick={() => navigateToSubTab('youtube')}
                icon="calculator"
                bgTint="bg-rose-50 dark:bg-rose-950/40"
                label={isHi ? '5. सहायता व गाइड' : '5. Help & Videos'}
                badge="YouTube"
              />
            </div>
          </div>
        </>
      )}

      {/* ---------------- DEDICATED SUB-MODULE PAGE VIEW (When activeTab !== null) ---------------- */}
      {activeTab !== null && (
        <div className="space-y-4 animate-fadeIn">
          {/* Sub-Module Header Bar */}
          <div className="bg-slate-100 dark:bg-slate-800/90 p-3.5 rounded-3xl border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigateToSubTab(null)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-amber-50 dark:hover:bg-amber-950/50 hover:text-amber-700 text-xs font-black shadow-sm border border-slate-200 dark:border-slate-700 transition-all cursor-pointer active:scale-95 shrink-0"
              >
                <ArrowLeft className="w-4 h-4 text-amber-600" />
                <span>{isHi ? '← इंस्पायर मुख्य डैशबोर्ड' : '← Back to Inspire Overview'}</span>
              </button>

              <div className="flex items-center gap-2">
                <ThreeDIcon 
                  name={
                    activeTab === 'guidelines' ? 'book' :
                    activeTab === 'nominations' ? 'users' :
                    activeTab === 'ideabank' ? 'sparkles' :
                    activeTab === 'pramani' ? 'award' : 'calculator'
                  } 
                  size={22} 
                />
                <div>
                  <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 leading-tight">
                    {activeTab === 'guidelines' && (isHi ? '1. दिशानिर्देश व पात्रता' : '1. Guidelines & Rules')}
                    {activeTab === 'nominations' && (isHi ? '2. विद्यार्थी नामांकन सूची' : '2. Student Nominations')}
                    {activeTab === 'ideabank' && (isHi ? '3. नवाचार आइडिया बैंक' : '3. Innovation Idea Bank')}
                    {activeTab === 'pramani' && (isHi ? '4. संस्थाप्रधान प्रमाणीकरण पत्र' : '4. Verification Certificate')}
                    {activeTab === 'youtube' && (isHi ? '5. यूट्यूब गाइड व सहायता' : '5. Help & Tutorials')}
                  </h3>
                  <p className="text-[10px] text-slate-500 font-bold">
                    Inspire Award Portal • Session 2026-27
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Sub-Module Switcher Pills */}
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
              {[
                { id: 'guidelines', labelHi: '1. नियम', labelEn: '1. Rules', icon3D: 'book' },
                { id: 'nominations', labelHi: '2. नामांकन', labelEn: '2. Nominate', icon3D: 'users' },
                { id: 'ideabank', labelHi: '3. आइडिया बैंक', labelEn: '3. Ideas', icon3D: 'sparkles' },
                { id: 'pramani', labelHi: '4. प्रमाण पत्र', labelEn: '4. Certificate', icon3D: 'award' },
                { id: 'youtube', labelHi: '5. सहायता', labelEn: '5. Help', icon3D: 'calculator' },
              ].map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => navigateToSubTab(tab.id as InspireSubTab)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all shrink-0 cursor-pointer ${
                      isActive
                        ? 'bg-amber-600 text-white shadow-md'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    <ThreeDIcon name={tab.icon3D} size={16} />
                    <span>{isHi ? tab.labelHi : tab.labelEn}</span>
                  </button>
                );
              })}
            </div>
          </div>

      {/* Navigation Sub-Tabs Bar */}
      <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-x-auto no-scrollbar">
        {[
          { id: 'guidelines', labelHi: 'दिशानिर्देश व पात्रता', labelEn: 'Guidelines', icon: BookOpen, icon3D: 'book' },
          { id: 'nominations', labelHi: 'विद्यार्थी नामांकन सूची', labelEn: 'Nominations', icon: UserCheck, icon3D: 'users' },
          { id: 'ideabank', labelHi: 'नवाचार आइडिया बैंक', labelEn: 'Idea Bank', icon: Lightbulb, icon3D: 'sparkles' },
          { id: 'pramani', labelHi: 'प्रमाणीकरण पत्र (Certificate)', labelEn: 'Certificate', icon: FileText, icon3D: 'award' },
          { id: 'youtube', labelHi: 'यूट्यूब व गाइड हेल्प', labelEn: 'YouTube & Help', icon: Play, icon3D: 'calculator' },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-black transition-all shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <ThreeDIcon name={tab.icon3D} size={18} />
              <span>{isHi ? tab.labelHi : tab.labelEn}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: GUIDELINES & ELIGIBILITY */}
      {activeTab === 'guidelines' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-md border border-slate-200 dark:border-slate-800 space-y-5 animate-fadeIn">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-600" />
                <span>{isHi ? 'इंस्पायर अवार्ड मानक योजना - मुख्य नियम व दिशानिर्देश' : 'Inspire Award MANAK Scheme Guidelines'}</span>
              </h3>
              <p className="text-xs text-slate-500">
                {isHi ? 'विज्ञान एवं प्रौद्योगिकी विभाग (DST) तथा नेशनल इनोवेशन फाउंडेशन (NIF) की संयुक्त पहल' : 'Joint initiative of Department of Science & Technology (DST) and NIF India'}
              </p>
            </div>
            <a
              href="https://www.inspireawards-dst.gov.in/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 text-xs font-bold border border-amber-200 dark:border-amber-800 hover:bg-amber-100 transition-all"
            >
              <span>E-MIAS Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/50 space-y-2.5">
              <h4 className="font-bold text-amber-900 dark:text-amber-200 text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-600" />
                <span>{isHi ? 'पात्रता एवं नामांकन नियम' : 'Eligibility Criteria'}</span>
              </h4>
              <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1.5 list-disc pl-4">
                <li><strong>कक्षा सीमा:</strong> कक्षा 6 से 10 में अध्ययनरत छात्र-छात्राएं पात्र हैं।</li>
                <li><strong>आयु सीमा:</strong> 10 से 15 वर्ष की आयु वर्ग के विद्यार्थी।</li>
                <li><strong>नामांकन संख्या:</strong> उच्च प्राथमिक विद्यालय अधिकतम 3 विचार एवं माध्यमिक/उच्च माध्यमिक विद्यालय अधिकतम 5 विचार प्रेषित कर सकते हैं।</li>
                <li><strong>डीबीटी प्रोत्साहन राशि:</strong> चयनित विद्यार्थी को मॉडल निर्माण हेतु ₹10,000 सीधे बैंक खाते (DBT) में हस्तांतरित।</li>
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/50 space-y-2.5">
              <h4 className="font-bold text-emerald-900 dark:text-emerald-200 text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{isHi ? 'आवश्यक दस्तावेज एवं प्रक्रिया' : 'Required Documents'}</span>
              </h4>
              <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1.5 list-disc pl-4">
                <li><strong>विद्यार्थी बैंक खाता:</strong> स्वयं या माता-पिता का एक्टिव बैंक खाता एवं आईएफएससी (IFSC) कोड।</li>
                <li><strong>आइडिया सिनॉप्सिस:</strong> 100-150 शब्दों में प्रोजेक्ट विचार का संक्षिप्त विवरण (हिंदी/अंग्रेजी)।</li>
                <li><strong>चित्र/स्केच:</strong> प्रोजेक्ट विचार का हस्तनिर्मित चित्र या आरेख (JPEG format)।</li>
                <li><strong>संस्थाप्रधान प्रमाणीकरण:</strong> नामांकित सूची पर विद्यालय की मुहर व हस्ताक्षर।</li>
              </ul>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
            <h4 className="font-bold text-slate-800 dark:text-slate-200 text-xs">
              {isHi ? 'प्रभारी शिक्षक दायित्व चेकलॉग (Action Checklist):' : 'Incharge Teacher Action Steps:'}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="font-bold text-amber-600">1. विचार संकलन</span>
                <p className="text-[11px] text-slate-500 mt-0.5">कक्षा 6-10 के छात्रों से नवोन्मेषी वैज्ञानिक विचारों के आवेदन प्राप्त करना।</p>
              </div>
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="font-bold text-amber-600">2. पोर्टल एंट्री</span>
                <p className="text-[11px] text-slate-500 mt-0.5">E-MIAS पोर्टल पर स्कूल लॉगिन कोड से विचारों का ऑनलाइन इन्द्राज।</p>
              </div>
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="font-bold text-amber-600">3. डीबीटी ट्रैकिंग</span>
                <p className="text-[11px] text-slate-500 mt-0.5">चयनित छात्रों के बैंक खातों में ₹10,000 राशि प्राप्ति की पुष्टि करना।</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: NOMINATIONS LIST & ADD FORM */}
      {activeTab === 'nominations' && (
        <div className="space-y-5 animate-fadeIn">
          {/* Add Nomination Form */}
          <form onSubmit={handleAddNomination} className="bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-md border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
              <Plus className="w-4 h-4 text-amber-600" />
              <span>{isHi ? 'नया छात्र नामांकन प्रविष्ट करें' : 'Add New Student Nomination'}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {isHi ? 'विद्यार्थी का नाम *' : 'Student Name *'}
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="उदा. अमित कुमार"
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {isHi ? 'पिता/अभिभावक का नाम' : 'Father Name'}
                </label>
                <input
                  type="text"
                  value={formFather}
                  onChange={(e) => setFormFather(e.target.value)}
                  placeholder="उदा. मोहन लाल"
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {isHi ? 'कक्षा (Class) *' : 'Class *'}
                </label>
                <select
                  value={formClass}
                  onChange={(e) => setFormClass(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-amber-500 outline-none"
                >
                  <option value="Class 6">Class 6</option>
                  <option value="Class 7">Class 7</option>
                  <option value="Class 8">Class 8</option>
                  <option value="Class 9">Class 9</option>
                  <option value="Class 10">Class 10</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {isHi ? 'प्रोजेक्ट श्रेणी (Category)' : 'Category'}
                </label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-amber-500 outline-none"
                >
                  <option value="Eco-Friendly">Eco-Friendly / Green Energy</option>
                  <option value="Water Conservation">Water Conservation</option>
                  <option value="Agriculture">Agriculture & Farming</option>
                  <option value="Assistive Tech">Assistive Tech & Safety</option>
                  <option value="Hygiene & Sanitation">Hygiene & Sanitation</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {isHi ? 'प्रोजेक्ट विचार / मॉडल का नाम (Project Title) *' : 'Project Title *'}
                </label>
                <input
                  type="text"
                  required
                  value={formProject}
                  onChange={(e) => setFormProject(e.target.value)}
                  placeholder="उदा. सौर ऊर्जा संचालित स्वचालित सिंचाई प्रणाली"
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {isHi ? 'संक्षिप्त विवरण (Synopsis)' : 'Synopsis'}
                </label>
                <input
                  type="text"
                  value={formSynopsis}
                  onChange={(e) => setFormSynopsis(e.target.value)}
                  placeholder="उदा. मिट्टी की नमी कम होते ही स्वतः पानी देने वाला सेंसर मॉडल"
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-black text-xs shadow-md transition-all cursor-pointer"
              >
                {isHi ? '+ नामांकित विद्यार्थी जोड़ें' : '+ Add Nomination'}
              </button>
            </div>
          </form>

          {/* Nominations Roster Table */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-md border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-emerald-600" />
                <span>{isHi ? 'नामांकित बाल वैज्ञानिकों की सूची' : 'Nominated Students List'}</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-xs font-bold">
                  {filteredStudents.length}
                </span>
              </h3>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-48">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={isHi ? 'खोजें...' : 'Search...'}
                    className="w-full pl-8 pr-3 py-1.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 outline-none"
                  />
                </div>

                <select
                  value={classFilter}
                  onChange={(e) => setClassFilter(e.target.value)}
                  className="px-2.5 py-1.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 outline-none"
                >
                  <option value="All">All Classes</option>
                  <option value="Class 6">Class 6</option>
                  <option value="Class 7">Class 7</option>
                  <option value="Class 8">Class 8</option>
                  <option value="Class 9">Class 9</option>
                  <option value="Class 10">Class 10</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[650px]">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800/60 text-[11px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    <th className="p-3 rounded-l-xl"># App No</th>
                    <th className="p-3">विद्यार्थी व पिता</th>
                    <th className="p-3">कक्षा</th>
                    <th className="p-3">प्रोजेक्ट विचार व श्रेणी</th>
                    <th className="p-3 text-center">बैंक विवरण</th>
                    <th className="p-3 text-center">डीबीटी स्टेटस</th>
                    <th className="p-3 text-right rounded-r-xl">कार्रवाई</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-xs">
                  {filteredStudents.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="p-3 font-mono font-bold text-amber-700 dark:text-amber-400">
                        {s.applicationNo}
                      </td>
                      <td className="p-3">
                        <p className="font-extrabold text-slate-800 dark:text-slate-100">{s.name}</p>
                        <p className="text-[11px] text-slate-500">पिता: {s.fatherName}</p>
                      </td>
                      <td className="p-3 font-bold text-slate-700 dark:text-slate-300">
                        {s.className}
                      </td>
                      <td className="p-3 max-w-[220px]">
                        <p className="font-bold text-slate-800 dark:text-slate-200 line-clamp-1">{s.projectTitle}</p>
                        <p className="text-[10px] text-amber-700 dark:text-amber-400 font-semibold">{s.category}</p>
                      </td>
                      <td className="p-3 text-center">
                        {s.bankVerified ? (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-bold">
                            ✓ Verified
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 text-[10px] font-bold">
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          s.dbtStatus === 'Selected' 
                            ? 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200 border border-amber-300'
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                        }`}>
                          {s.dbtStatus}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleDelete(s.id)}
                          className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-400 transition-colors cursor-pointer"
                          title="हटाएं"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredStudents.length === 0 && (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-xs text-slate-500">
                        कोई नामांकन रिकॉर्ड नहीं मिला।
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: IDEA BANK */}
      {activeTab === 'ideabank' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-md border border-slate-200 dark:border-slate-800 space-y-4 animate-fadeIn">
          <div className="pb-3 border-b border-slate-200 dark:border-slate-800">
            <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-500" />
              <span>{isHi ? 'विज्ञान एवं नवोन्मेषी प्रोजेक्ट आइडिया बैंक' : 'Science & Innovation Project Idea Bank'}</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {isHi ? 'छात्रों को प्रेरित करने हेतु उपयोगी व्यावहारिक प्रोजेक्ट विचार एवं सिनॉप्सिस नमूने' : 'Curated project ideas and synopsis templates for student inspiration'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {ideaBank.map((item, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/70 dark:border-amber-800/50 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-amber-200 text-amber-900 text-[10px] font-black">
                    {item.category}
                  </span>
                  <span className="text-[10px] text-slate-500 font-bold">{item.suitableClass}</span>
                </div>
                <h4 className="font-black text-xs text-slate-900 dark:text-slate-100">{item.title}</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{item.synopsis}</p>
                <button
                  onClick={() => {
                    setFormProject(item.title);
                    setFormSynopsis(item.synopsis);
                    setActiveTab('nominations');
                  }}
                  className="mt-1 text-[11px] font-bold text-amber-700 dark:text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>इस विचार को फॉर्म में उपयोग करें →</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: CERTIFICATE & REPORT GENERATOR */}
      {activeTab === 'pramani' && (
        <div className="space-y-5 animate-fadeIn">
          {/* Certificate Type Selection & Form Controls */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-md border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
              <FileText className="w-4 h-4 text-emerald-600" />
              <span>{isHi ? 'नामांकन प्रमाणीकरण प्रपत्र जनरेटर' : 'Generate Nomination Verification Certificate'}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setCertType('inchargeToPrincipal')}
                className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer ${
                  certType === 'inchargeToPrincipal'
                    ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-500 text-amber-900 dark:text-amber-200 font-extrabold shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <span className="text-xs block text-amber-700 dark:text-amber-400 font-bold">प्रारूप - अ (Option A)</span>
                <span className="text-xs sm:text-sm">प्रभारी द्वारा संस्थाप्रधान को सम्प्रेषित प्रमाणीकरण पत्र</span>
              </button>

              <button
                type="button"
                onClick={() => setCertType('principalToOfficer')}
                className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer ${
                  certType === 'principalToOfficer'
                    ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-500 text-amber-900 dark:text-amber-200 font-extrabold shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <span className="text-xs block text-amber-700 dark:text-amber-400 font-bold">प्रारूप - ब (Option B)</span>
                <span className="text-xs sm:text-sm">संस्थाप्रधान द्वारा जिला नोडल/डीईओ कार्यालय को सम्प्रेषित प्रपत्र</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  जावक क्रमांक (Dispatch No)
                </label>
                <input
                  type="text"
                  value={certDispatchNo}
                  onChange={(e) => setCertDispatchNo(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  दिनांक (Date)
                </label>
                <input
                  type="date"
                  value={certDate}
                  onChange={(e) => setCertDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  प्रभारी/संस्थाप्रधान नाम
                </label>
                <input
                  type="text"
                  value={certInchargeName}
                  onChange={(e) => setCertInchargeName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs shadow-md transition-all cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>{isHi ? 'प्रमाणीकरण पत्र प्रिंट / पीडीएफ डाउनलोड करें' : 'Print / Download Certificate'}</span>
              </button>
            </div>
          </div>

          {/* PRINTABLE OFFICIAL CERTIFICATE TEMPLATE */}
          <div className="bg-white text-slate-900 rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-amber-800 space-y-6 printable-area">
            {/* Header */}
            <div className="text-center space-y-1 pb-4 border-b-2 border-slate-900">
              <h2 className="text-base sm:text-lg font-black tracking-wide uppercase">
                {schoolProfile.schoolNameHindi || schoolProfile.schoolName || 'राजकीय उच्च माध्यमिक विद्यालय'}
              </h2>
              <p className="text-xs font-bold text-slate-700">
                यू-डाइस कोड: {schoolProfile.udiseCode || '30000000000'} | ब्लॉक: {schoolProfile.block || 'शिक्षा ब्लॉक'} | जिला: {schoolProfile.district || 'राजस्थान'}
              </p>
              <div className="mt-2 inline-block px-4 py-1 rounded-full bg-amber-100 text-amber-950 font-black text-xs border border-amber-400">
                {certType === 'inchargeToPrincipal'
                  ? 'इंस्पायर अवार्ड मानक योजना - नामांकन प्रमाणीकरण पत्र (प्रभारी प्रस्तुत)'
                  : 'इंस्पायर अवार्ड मानक योजना - आधिकारिक अग्रेशन पत्र (संस्थाप्रधान)'}
              </div>
            </div>

            {/* Letter Metadata */}
            <div className="flex justify-between items-center text-xs font-bold">
              <span>क्रमांक: {certDispatchNo}</span>
              <span>दिनांक: {certDate}</span>
            </div>

            {/* Subject Body */}
            <div className="space-y-3 text-xs leading-relaxed text-justify">
              <p>
                <strong>विषय:</strong> सत्र 2026-27 हेतु इंस्पायर अवार्ड्स-मानक (INSPIRE Awards - MANAK) योजनांतर्गत बाल वैज्ञानिकों के विचार ऑनलाइन पोर्टल पर सफलतापूर्वक प्रविष्ट करने बाबत।
              </p>
              <p>
                महोदय/महोदया,
              </p>
              <p>
                उपरोक्त विषयांतर्गत प्रमाणित किया जाता है कि हमारे विद्यालय के कक्षा 6 से 10 में अध्ययनरत योग्य विद्यार्थियों में से नवोन्मेषी वैज्ञानिक सोच वाले निम्नलिखित <strong>{students.length}</strong> विद्यार्थियों के विचार/मॉडल का चयन कर इंस्पायर अवार्ड्स-मानक (E-MIAS) पोर्टल पर ऑनलाइन इन्द्राज किया जा चुका है।
              </p>

              {/* Table of Nominated Students */}
              <div className="mt-3 overflow-x-auto">
                <table className="w-full border-collapse border border-slate-900 text-xs">
                  <thead>
                    <tr className="bg-slate-100 text-center font-bold">
                      <th className="border border-slate-900 p-2">क्र.सं.</th>
                      <th className="border border-slate-900 p-2">आवेदन संख्या</th>
                      <th className="border border-slate-900 p-2">विद्यार्थी नाम</th>
                      <th className="border border-slate-900 p-2">कक्षा</th>
                      <th className="border border-slate-900 p-2">प्रोजेक्ट विचार (Project Title)</th>
                      <th className="border border-slate-900 p-2">बैंक खाता स्थिति</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((st, i) => (
                      <tr key={st.id} className="text-center">
                        <td className="border border-slate-900 p-2">{i + 1}</td>
                        <td className="border border-slate-900 p-2 font-mono">{st.applicationNo}</td>
                        <td className="border border-slate-900 p-2 text-left font-bold">{st.name}</td>
                        <td className="border border-slate-900 p-2">{st.className}</td>
                        <td className="border border-slate-900 p-2 text-left">{st.projectTitle}</td>
                        <td className="border border-slate-900 p-2">{st.bankVerified ? 'सत्यापित' : 'लंबित'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p className="mt-3">
                उक्त विद्यार्थियों के बैंक खातों एवं IFSC कोड का सत्यापन कर लिया गया है। समस्त प्रविष्टियां पूर्णतः सत्य एवं प्रामाणिक हैं।
              </p>
            </div>

            {/* Signatures */}
            <div className="pt-12 grid grid-cols-2 gap-8 text-center text-xs font-bold">
              <div>
                <p>____________________</p>
                <p className="mt-1">{certInchargeName}</p>
                <p className="text-[11px] text-slate-600">इंस्पायर अवार्ड प्रभारी</p>
              </div>
              <div>
                <p>____________________</p>
                <p className="mt-1">हस्ताक्षर एवं मुहर संस्थाप्रधान</p>
                <p className="text-[11px] text-slate-600">{schoolProfile.schoolNameShort || 'राउमावि'}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: YOUTUBE & HELP */}
      {activeTab === 'youtube' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-md border border-slate-200 dark:border-slate-800 space-y-4 animate-fadeIn">
          <div className="pb-3 border-b border-slate-200 dark:border-slate-800">
            <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Play className="w-5 h-5 text-red-600 fill-red-600" />
              <span>{isHi ? 'इंस्पायर अवार्ड्स यूट्यूब वीडियो गाइड एवं ट्यूटोरियल्स' : 'Inspire Award Video Tutorials'}</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {isHi ? 'पोर्टल रजिस्ट्रेशन, स्टूडेंट नॉमिनेशन, फोटो अपलोड व पासवर्ड रीसेट हेतु स्पष्ट वीडियो गाइड' : 'Complete step-by-step video tutorials for E-MIAS registration & idea submission'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
            {[
              { title: 'इंस्पायर अवार्ड पोर्टल पर नया स्कूल रजिस्ट्रेशन कैसे करें?', duration: '8 मिनट', views: '25K views' },
              { title: 'बाल वैज्ञानिक विचार व सिनॉप्सिस कैसे लिखें और अपलोड करें?', duration: '12 मिनट', views: '40K views' },
              { title: 'छात्र बैंक खाता विवरण व आईएफएससी कोड सत्यापन विधि', duration: '6 मिनट', views: '18K views' },
              { title: 'E-MIAS पोर्टल पासवर्ड रीसेट व संस्थाप्रधान विवरण अपडेट', duration: '5 मिनट', views: '15K views' },
              { title: 'इंस्पायर अवार्ड ₹10,000 डीबीटी राशि प्राप्ति स्टेटस कैसे चेक करें?', duration: '7 मिनट', views: '32K views' },
              { title: 'जिला व राज्य स्तरीय विज्ञान प्रदर्शनी हेतु मॉडल निर्माण टिप्स', duration: '15 मिनट', views: '50K views' },
            ].map((v, i) => (
              <div key={i} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <div className="w-full h-24 rounded-xl bg-slate-900 text-white flex items-center justify-center relative overflow-hidden group cursor-pointer" onClick={() => openVideo('https://www.youtube.com/embed/dQw4w9WgXcQ', v.title)}>
                    <Play className="w-10 h-10 text-red-500 fill-red-500 group-hover:scale-110 transition-transform" />
                    <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/80 text-[10px] font-mono font-bold">
                      {v.duration}
                    </span>
                  </div>
                  <h4 className="font-bold text-xs text-slate-800 dark:text-slate-100 leading-snug">{v.title}</h4>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                  <span>{v.views}</span>
                  <button
                    onClick={() => openVideo('https://www.youtube.com/embed/dQw4w9WgXcQ', v.title)}
                    className="font-bold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
                  >
                    चलाएं (Play) →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
        </div>
      )}

      {/* YOUTUBE EMBED MODAL */}
      {showVideoModal && (
        <div className="fixed inset-0 z-[2000] bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full p-4 space-y-3 relative shadow-2xl">
            <div className="flex items-center justify-between text-white pb-2 border-b border-slate-800">
              <h3 className="font-bold text-sm truncate max-w-[85%]">{activeVideoTitle}</h3>
              <button
                onClick={() => setShowVideoModal(false)}
                className="p-1 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black flex items-center justify-center">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                title={activeVideoTitle}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
