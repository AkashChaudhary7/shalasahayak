import React, { useState, useEffect, lazy, Suspense } from 'react';
import { SchoolProfile, Teacher, StudentResult, StudentAnomaly, ICTEquipment, LibraryBook, MDMLog, InchargeAssignment, Language } from '../types';
import { QuickViewSection } from './QuickViewSection';
import { TopPromoBanner } from './TopPromoBanner';
import { ThreeDIcon, ThreeDCard, renderCard } from './ThreeDIcon';
import { storage } from '../utils/storage';
import { ALL_TOOLS, DEFAULT_PINNED_TOOL_IDS } from '../data/allTools';
import { SeoManager } from './SeoManager';
import { Breadcrumbs } from './Breadcrumbs';
import { LegalDocs } from './LegalDocs';
import { SocialHeaderBar } from './SocialHeaderBar';
import { AboutUsView } from './AboutUsView';
import { ContactUsView } from './ContactUsView';
import { AdSense } from './AdSense';
import { DashboardSkeleton, TableSkeleton } from './SkeletonLoader';

// Code splitting major dashboard modules using React.lazy & Suspense for high performance
const SectionPeeoTools = lazy(() => import('./SectionPeeoTools').then(m => ({ default: m.SectionPeeoTools })));
const SectionTeacherTools = lazy(() => import('./SectionTeacherTools').then(m => ({ default: m.SectionTeacherTools })));
const WorkInchargeModule = lazy(() => import('./modules/WorkInchargeModule').then(m => ({ default: m.WorkInchargeModule })));
const ResultsGridModule = lazy(() => import('./modules/ResultsGridModule').then(m => ({ default: m.ResultsGridModule })));
const SectionQuickAccess = lazy(() => import('./SectionQuickAccess').then(m => ({ default: m.SectionQuickAccess })));
const ShiviraWidget = lazy(() => import('./ShiviraWidget').then(m => ({ default: m.ShiviraWidget })));
const InvitationMaker = lazy(() => import('./InvitationMaker').then(m => ({ default: m.InvitationMaker })));
const HelpCenterModule = lazy(() => import('./modules/HelpCenterModule').then(m => ({ default: m.HelpCenterModule })));
const BlogsView = lazy(() => import('./BlogsView').then(m => ({ default: m.BlogsView })));

const ModuleLoadingFallback: React.FC = () => (
  <div className="p-8 my-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md flex flex-col items-center justify-center space-y-3 animate-pulse">
    <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-600 flex items-center justify-center animate-spin">
      <Sparkles className="w-5 h-5" />
    </div>
    <p className="text-xs font-bold text-slate-600 dark:text-slate-300">
      मॉड्यूल लोड हो रहा है... (Loading Module...)
    </p>
  </div>
);
import {
  Building2,
  GraduationCap,
  Briefcase,
  Zap,
  TrendingUp,
  Calendar,
  Users,
  Clock,
  Award,
  Send,
  CheckCircle2,
  ShieldAlert,
  Monitor,
  BookOpen,
  Utensils,
  Image,
  Layers,
  FileText,
  Bus,
  ExternalLink,
  Calculator,
  ArrowLeft,
  Home,
  ChevronRight,
  Share2,
  MessageSquare,
  Settings,
  HelpCircle,
  FileCheck,
  CheckSquare,
  Sparkles,
  BookMarked,
  UserCheck,
  Check,
  Pin,
  Bell,
  BellRing,
  Search,
  X,
  GripVertical,
  RotateCcw,
  Sliders
} from 'lucide-react';

interface DirectoryDashboardProps {
  schoolProfile: SchoolProfile;
  teachers: Teacher[];
  onUpdateTeachers: (teachers: Teacher[]) => void;
  incharges: InchargeAssignment[];
  onUpdateIncharges: (incharges: InchargeAssignment[]) => void;
  students: StudentResult[];
  onUpdateStudents: (students: StudentResult[]) => void;
  anomalies: StudentAnomaly[];
  onUpdateAnomalies: (anomalies: StudentAnomaly[]) => void;
  ictItems: ICTEquipment[];
  onUpdateIctItems: (items: ICTEquipment[]) => void;
  libraryBooks: LibraryBook[];
  onUpdateLibraryBooks: (books: LibraryBook[]) => void;
  mdmLogs: MDMLog[];
  onUpdateMdmLogs: (logs: MDMLog[]) => void;
  lang: Language;
  onOpenSettings: () => void;
  onOpenFeedback: () => void;
  onNavigate?: (type: 'dashboard' | 'peeo' | 'teacher' | 'incharge' | 'quick' | 'shivira' | 'mdm' | 'exam' | 'work-incharge', subTab?: string | null) => void;
}

type NavLocation = 
  | { type: 'home' }
  | { type: 'category'; id: 'peeo' | 'teacher' | 'incharge' | 'portals' | 'student' }
  | { type: 'tool'; category: 'peeo'; subtab: 'increment' | 'timetable' | 'incharge' | 'substitution' | 'apar' | 'notice' | 'satyapan' | 'pramanikaran' }
  | { type: 'tool'; category: 'teacher'; subtab: 'classTeacher' | 'subjectTeacher' | 'librarian' | 'pti' | 'computer' | 'marksheet' | 'anomaly' | 'ict' | 'library' | 'diary'; subComponent?: string }
  | { type: 'tool'; category: 'incharge'; subtab: 'mdm' | 'transport' | 'lado' | 'scholarship' | 'elc' | 'exam' | 'resizer' | 'remuneration' | 'qrcode' | 'dutyroster' }
  | { type: 'tool'; category: 'portals'; subtab: 'portals' | 'calculator' | 'formats' }
  | { type: 'tool'; category: 'student'; subtab: 'timetable' | 'homework' | 'datesheet' | 'syllabus' | 'doubts' }
  | { type: 'shivira' }
  | { type: 'invitation'; template?: 'independence' | 'republic' | 'ptm' | 'annual' | 'admission' | 'sports' }
  | { type: 'help'; blogId?: string }
  | { type: 'hub' }
  | { type: 'blogs'; subtab?: 'guides' | 'hub' | 'videos'; blogId?: string }
  | { type: 'legal'; subtab?: 'privacy' | 'terms' | 'disclaimer' }
  | { type: 'about-us' }
  | { type: 'contact-us' };

export interface DashboardCardConfig {
  id: string;
  type: 'shivira' | 'category' | 'tool' | 'invitation' | 'help' | 'action';
  categoryId?: 'peeo' | 'teacher' | 'incharge' | 'portals' | 'student';
  toolCat?: 'peeo' | 'teacher' | 'incharge' | 'portals' | 'student';
  subtab?: string;
  action?: 'share' | 'feedback' | 'settings';
  icon: string | React.ReactNode;
  bgTint: string;
  labelHi: string;
  labelEn: string;
  ariaHi: string;
  ariaEn: string;
  descHi: string;
  descEn: string;
  keywords?: string[];
}

const CARD_ORDER_STORAGE_KEY = 'shala_sahayak_card_order_v2';

const DEFAULT_DASHBOARD_CARDS: DashboardCardConfig[] = [
  {
    id: 'shivira',
    type: 'shivira',
    icon: 'calendar',
    bgTint: 'bg-sky-50 dark:bg-sky-950/40',
    labelHi: 'शिविरा प्रोफाइल',
    labelEn: 'Shivira Profile',
    ariaHi: 'शिविरा पंचांग एवं अकादमिक कैलेंडर',
    ariaEn: 'Shivira Academic Calendar and Profile',
    descHi: 'शिविरा पंचांग 2026, अवकाश सूची एवं महत्वपूर्ण तिथियां देखें',
    descEn: 'View Shivira Calendar 2026, holidays and key dates',
    keywords: ['shivira', 'शिविरा', 'calendar', 'पंचांग', 'holidays', 'अवकाश']
  },
  {
    id: 'peeo',
    type: 'category',
    categoryId: 'peeo',
    icon: 'building',
    bgTint: 'bg-emerald-50 dark:bg-emerald-950/40',
    labelHi: 'पीईईओ / प्रधानाचार्य',
    labelEn: 'PEEO / Principal',
    ariaHi: 'पीईईओ एवं प्रधानाचार्य मॉड्यूल',
    ariaEn: 'PEEO and Principal Administration Module',
    descHi: 'पीईईओ आदेश, विद्यालय प्रबंधन एवं प्रशासनिक टूल',
    descEn: 'PEEO orders, school management and administrative tools',
    keywords: ['peeo', 'पीईईओ', 'principal', 'प्रधानाचार्य', 'increment', 'वार्षिक वृद्धि', 'timetable', 'समय सारणी']
  },
  {
    id: 'teacher',
    type: 'category',
    categoryId: 'teacher',
    icon: 'graduation',
    bgTint: 'bg-amber-50 dark:bg-amber-950/40',
    labelHi: 'शिक्षक',
    labelEn: 'Teachers',
    ariaHi: 'शिक्षक एवं अकादमिक टूल',
    ariaEn: 'Teacher Academic Tools',
    descHi: 'शिक्षक कार्यसूची, आईसीटी एवं पुस्तकालय प्रबंधन',
    descEn: 'Teacher tasklist, ICT and library management',
    keywords: ['teacher', 'शिक्षक', 'diary', 'दैनन्दिनी', 'library', 'पुस्तकालय', 'ict', 'computer', 'pti']
  },
  {
    id: 'incharge',
    type: 'category',
    categoryId: 'incharge',
    icon: 'briefcase',
    bgTint: 'bg-indigo-50 dark:bg-indigo-950/40',
    labelHi: 'कार्य प्रभारी',
    labelEn: 'Work Incharge',
    ariaHi: 'कार्य प्रभारी दायित्व',
    ariaEn: 'Work Incharge Responsibilities',
    descHi: 'एमडीएम, परीक्षा, परिसर विकास व अन्य प्रभारी प्रपत्र',
    descEn: 'MDM, examination, campus & charge formats',
    keywords: ['incharge', 'प्रभारी', 'mdm', 'एमडीएम', 'exam', 'परीक्षा', 'remuneration', 'मानदेय', 'resizer', 'रिसाइज़र']
  },
  {
    id: 'portals',
    type: 'tool',
    toolCat: 'portals',
    subtab: 'portals',
    icon: 'link',
    bgTint: 'bg-blue-50 dark:bg-blue-950/40',
    labelHi: 'पोर्टल्स',
    labelEn: 'Portals',
    ariaHi: 'शिक्षा विभाग पोर्टल्स',
    ariaEn: 'Education Portals Directory',
    descHi: 'शाला दर्पण, पे-मैनेजर, एसएसओ व अन्य विभागीय लिंक',
    descEn: 'Shala Darpan, PayManager, SSO and department portals',
    keywords: ['portals', 'पोर्टल', 'shala darpan', 'शाला दर्पण', 'paymanager', 'पे मैनेजर', 'sso']
  },
  {
    id: 'result',
    type: 'tool',
    toolCat: 'teacher',
    subtab: 'marksheet',
    icon: 'award',
    bgTint: 'bg-teal-50 dark:bg-teal-950/40',
    labelHi: 'परीक्षा परिणाम',
    labelEn: 'Result',
    ariaHi: 'परीक्षा परिणाम एवं अंकसूची',
    ariaEn: 'Exam Results and Marksheet Generator',
    descHi: 'विद्यार्थी अंक तालिका एवं प्रगति पत्रक जनरेटर',
    descEn: 'Student marksheet generation and progress reports',
    keywords: ['result', 'परिणाम', 'marksheet', 'अंकतालिका', 'progress report', 'प्रगति पत्रक']
  },
  {
    id: 'invitation',
    type: 'invitation',
    icon: 'coupon',
    bgTint: 'bg-pink-50 dark:bg-pink-950/40',
    labelHi: 'निमंत्रण',
    labelEn: 'Invitation',
    ariaHi: 'निमंत्रण पत्र जनरेटर',
    ariaEn: 'Invitation Card Maker',
    descHi: 'वार्षिकोत्सव एवं बाल सभा हेतु निमंत्रण पत्र तैयार करें',
    descEn: 'Create digital invitation cards for school events',
    keywords: ['invitation', 'निमंत्रण', 'card', 'कार्ड', 'bal sabha', 'बाल सभा']
  },
  {
    id: 'formats',
    type: 'tool',
    toolCat: 'portals',
    subtab: 'formats',
    icon: 'book',
    bgTint: 'bg-indigo-50 dark:bg-indigo-950/40',
    labelHi: 'विभागीय प्रपत्र (Formats)',
    labelEn: 'Official Formats',
    ariaHi: 'विभागीय प्रपत्र डाउनलोड',
    ariaEn: 'Official Department Formats',
    descHi: 'राजस्थान शिक्षा विभाग के आधिकारिक आवेदन प्रपत्र',
    descEn: 'Download official Rajasthan Education Department formats',
    keywords: ['formats', 'प्रपत्र', 'forms', 'आवेदन', 'application']
  },
  {
    id: 'calculator',
    type: 'tool',
    toolCat: 'portals',
    subtab: 'calculator',
    icon: 'calculator',
    bgTint: 'bg-amber-50 dark:bg-amber-950/40',
    labelHi: '7वां वेतन कैलकुलेटर',
    labelEn: '7th Salary Calc',
    ariaHi: '7वां वेतन आयोग वेतन कैलकुलेटर',
    ariaEn: '7th Pay Commission Salary Calculator',
    descHi: 'मूल वेतन, डीए, एचआरए एवं कुल वेतन गणना',
    descEn: 'Calculate basic pay, DA, HRA and gross salary',
    keywords: ['calculator', 'कैलकुलेटर', 'salary', 'वेतन', 'pay matrix', '7th pay', 'da', 'hra']
  },
  {
    id: 'blogs',
    type: 'help', // Keep as 'help' or any custom type so layout works correctly
    icon: 'book',
    bgTint: 'bg-emerald-50 dark:bg-emerald-950/40',
    labelHi: 'ब्लॉग व रिसोर्स हब',
    labelEn: 'Blogs & Resources',
    ariaHi: 'मार्गदर्शिका ब्लॉग, मास्टर पिलर हब एवं वीडियो लाइब्रेरी',
    ariaEn: 'Help Guides, Master Resource Hub, and Video Tutorials',
    descHi: 'शाला दर्पण प्रविष्टि, क्रीड़ा शुल्क, वेतन मैट्रिक्स गाइड व वीडियो',
    descEn: 'Shala Darpan, sports fee, pay matrix guides and training videos',
    keywords: ['blogs', 'help', 'resource-hub', 'guides', 'videos', 'ब्लॉग', 'सहायता', 'वीडियो', 'यूट्यूब', 'youtube', 'hub', 'pillar']
  },
  {
    id: 'share',
    type: 'action',
    action: 'share',
    icon: 'sparkles',
    bgTint: 'bg-orange-50 dark:bg-orange-950/40',
    labelHi: 'साझा करें',
    labelEn: 'Share',
    ariaHi: 'शाला सहायक ऐप साझा करें',
    ariaEn: 'Share Shala Sahayak App',
    descHi: 'अन्य शिक्षकों के साथ ऐप साझा करें',
    descEn: 'Share app link with fellow educators',
    keywords: ['share', 'साझा करें', 'whatsapp', 'telegram']
  },
  {
    id: 'feedback',
    type: 'action',
    action: 'feedback',
    icon: 'bell',
    bgTint: 'bg-rose-50 dark:bg-rose-950/40',
    labelHi: 'सुझाव',
    labelEn: 'Feedback',
    ariaHi: 'सुझाव एवं सहायता',
    ariaEn: 'Send App Feedback',
    descHi: 'ऐप सुधार हेतु अपने सुझाव भेजें',
    descEn: 'Send feedback or report an issue',
    keywords: ['feedback', 'सुझाव', 'support', 'सहायता', 'issue']
  },
  {
    id: 'settings',
    type: 'action',
    action: 'settings',
    icon: 'settings',
    bgTint: 'bg-slate-100 dark:bg-slate-800/80',
    labelHi: 'सेटिंग्स व अन्य',
    labelEn: 'Settings',
    ariaHi: 'ऐप सेटिंग्स एवं प्रोफ़ाइल',
    ariaEn: 'App Settings and Configuration',
    descHi: 'भाषा परिवर्तन, थीम एवं विद्यालय प्रोफ़ाइल',
    descEn: 'Change language, theme and school profile',
    keywords: ['settings', 'सेटिंग्स', 'language', 'भाषा', 'theme', 'प्रोफ़ाइल']
  }
];

const getInitialCardOrder = (): DashboardCardConfig[] => {
  try {
    const savedOrderJson = localStorage.getItem(CARD_ORDER_STORAGE_KEY);
    if (savedOrderJson) {
      const savedIds: string[] = JSON.parse(savedOrderJson);
      if (Array.isArray(savedIds) && savedIds.length > 0) {
        const itemMap = new Map(DEFAULT_DASHBOARD_CARDS.map(item => [item.id, item]));
        const orderedItems: DashboardCardConfig[] = [];
        
        savedIds.forEach(id => {
          if (itemMap.has(id)) {
            orderedItems.push(itemMap.get(id)!);
            itemMap.delete(id);
          }
        });
        
        itemMap.forEach(item => {
          orderedItems.push(item);
        });
        
        return orderedItems;
      }
    }
  } catch (e) {
    console.error('Failed to load card order', e);
  }
  return DEFAULT_DASHBOARD_CARDS;
};

export const DirectoryDashboard: React.FC<DirectoryDashboardProps> = ({
  schoolProfile,
  teachers,
  onUpdateTeachers,
  incharges,
  onUpdateIncharges,
  students,
  onUpdateStudents,
  anomalies,
  onUpdateAnomalies,
  ictItems,
  onUpdateIctItems,
  libraryBooks,
  onUpdateLibraryBooks,
  mdmLogs,
  onUpdateMdmLogs,
  lang,
  onOpenSettings,
  onOpenFeedback,
  onNavigate
}) => {
  const [nav, setNav] = useState<NavLocation>({ type: 'home' });
  const [copiedLink, setCopiedLink] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // Simulated professional database state / API data hydration check
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 850);
    return () => clearTimeout(timer);
  }, []);

  // Sync state back to URL hash/path in a single unified function
  const updateNav = (newNav: NavLocation) => {
    setNav(newNav);
    
    let path = '/';
    if (newNav.type === 'category') {
      if (newNav.id === 'incharge') path = '/work-incharge';
      else if (newNav.id === 'portals') path = '/quick';
      else path = `/${newNav.id}`;
    } else if (newNav.type === 'tool') {
      const cat = newNav.category;
      const sub = newNav.subtab;
      const subComp = 'subComponent' in newNav ? newNav.subComponent : undefined;
      
      if (cat === 'teacher' && sub === 'pti' && subComp === 'kridaShulk') {
        path = '/teacher/pti/kridashulk';
      } else if (cat === 'teacher' && sub === 'pti' && subComp === 'healthBmi') {
        path = '/teacher-pti/healthbmi';
      } else if (cat === 'teacher' && sub === 'pti' && subComp === 'sportsStock') {
        path = '/teacher-pti/sportsstock';
      } else if (cat === 'teacher' && sub === 'pti' && subComp === 'ptGrading') {
        path = '/teacher-pti/ptgrading';
      } else if (cat === 'teacher' && sub === 'marksheet') {
        path = '/teacher-marksheet/greensheet';
      } else if (cat === 'teacher' && sub === 'anomaly' && subComp === 'verification') {
        path = '/teacher-anomaly/verification';
      } else if (cat === 'teacher' && sub === 'diary') {
        path = '/teacher-diary/lessonplanner';
      } else if (cat === 'teacher' && sub === 'library' && subComp === 'catalogue') {
        path = '/teacher-library/catalogue';
      } else if (cat === 'teacher' && sub === 'computer' && subComp === 'equipmentStock') {
        path = '/teacher-computer/equipmentstock';
      } else if (cat === 'incharge' && sub === 'mdm') {
        path = '/incharge-mdm/calculator';
      } else if (cat === 'incharge' && sub === 'transport') {
        path = '/incharge-transport/voucher';
      } else if (cat === 'incharge' && sub === 'scholarship') {
        path = '/incharge-scholarship/calculator';
      } else if (cat === 'incharge' && sub === 'exam') {
        path = '/incharge-exam/roster';
      } else if (cat === 'peeo' && sub === 'timetable') {
        path = '/peeo-timetable/generator';
      } else if (cat === 'peeo' && sub === 'increment') {
        path = '/peeo-increment/calculator';
      } else if (cat === 'peeo' && sub === 'substitution') {
        path = '/peeo-substitution/tracker';
      } else if (cat === 'peeo' && sub === 'apar') {
        path = '/peeo-apar/appraisal';
      } else if (cat === 'portals' && sub === 'calculator') {
        path = '/portals-calculator/salary';
      } else if (cat === 'portals' && sub === 'formats') {
        path = '/portals-formats/download';
      } else {
        path = `/${cat}-${sub}`;
        if (subComp) {
          path = `/${cat}-${sub}/${subComp}`;
        }
      }
    } else if (newNav.type === 'shivira') {
      path = '/shivira';
    } else if (newNav.type === 'about-us') {
      path = '/about-us';
    } else if (newNav.type === 'contact-us') {
      path = '/contact-us';
    } else if (newNav.type === 'invitation') {
      if (newNav.template === 'independence') {
        path = '/invitation/independence';
      } else {
        path = '/invitation';
      }
    } else if (newNav.type === 'blogs') {
      path = '/blogs';
      if (newNav.subtab) {
        path = `/blogs/${newNav.subtab}`;
      }
    } else if (newNav.type === 'legal') {
      if (newNav.subtab === 'privacy') path = '/privacy-policy';
      else if (newNav.subtab === 'terms') path = '/terms';
      else if (newNav.subtab === 'disclaimer') path = '/disclaimer';
      else path = '/privacy-policy';
    }

    if (window.location.pathname !== path) {
      window.history.pushState(null, '', path);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Sync state on hash change or query search param or pathname
  useEffect(() => {
    const handleUrlSync = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const helpBlogId = urlParams.get('help');

      if (helpBlogId) {
        setNav({ type: 'help', blogId: helpBlogId });
        return;
      }

      const pathName = window.location.pathname.replace(/^\//, '').toLowerCase();
      const hashRaw = window.location.hash.replace('#', '').toLowerCase();
      const hash = pathName || hashRaw || 'dashboard';
      let newNav: NavLocation = { type: 'home' };

      // Friendly SEO-optimized hierarchical aliases
      if (hash === 'about-us' || hash === 'about-us.html') {
        newNav = { type: 'about-us' };
      } else if (hash === 'contact-us' || hash === 'contact-us.html') {
        newNav = { type: 'contact-us' };
      } else if (hash === 'privacy-policy' || hash === 'privacy') {
        newNav = { type: 'legal', subtab: 'privacy' };
      } else if (hash === 'terms' || hash === 'terms-and-conditions') {
        newNav = { type: 'legal', subtab: 'terms' };
      } else if (hash === 'disclaimer') {
        newNav = { type: 'legal', subtab: 'disclaimer' };
      } else if (hash === 'teacher/pti/kridashulk' || hash === 'teachers/pti/krida-shulk' || hash === 'teacher-pti/sportfeemaker' || hash === 'krida-shulk' || hash === 'krida-shulk-maker' || hash === 'sports-fee-maker') {
        newNav = { type: 'tool', category: 'teacher', subtab: 'pti', subComponent: 'kridaShulk' };
      } else if (hash === 'teacher-pti/healthbmi' || hash === 'student-health-bmi' || hash === 'health-bmi') {
        newNav = { type: 'tool', category: 'teacher', subtab: 'pti', subComponent: 'healthBmi' };
      } else if (hash === 'teacher-pti/sportsstock' || hash === 'sports-goods-stock' || hash === 'sports-stock') {
        newNav = { type: 'tool', category: 'teacher', subtab: 'pti', subComponent: 'sportsStock' };
      } else if (hash === 'teacher-pti/ptgrading' || hash === 'pt-grading' || hash === 'sports-grading') {
        newNav = { type: 'tool', category: 'teacher', subtab: 'pti', subComponent: 'ptGrading' };
      } else if (hash === 'teacher-marksheet/greensheet' || hash === 'greensheet-maker' || hash === 'marksheet-maker' || hash === 'results-greensheet') {
        newNav = { type: 'tool', category: 'teacher', subtab: 'marksheet' };
      } else if (hash === 'teacher-anomaly/verification' || hash === 'student-verification' || hash === 'verification-anomaly') {
        newNav = { type: 'tool', category: 'teacher', subtab: 'anomaly', subComponent: 'verification' };
      } else if (hash === 'teacher-diary/lessonplanner' || hash === 'teacher-diary' || hash === 'lesson-planner') {
        newNav = { type: 'tool', category: 'teacher', subtab: 'diary' };
      } else if (hash === 'teacher-library/catalogue' || hash === 'library-catalogue' || hash === 'library-books') {
        newNav = { type: 'tool', category: 'teacher', subtab: 'library', subComponent: 'catalogue' };
      } else if (hash === 'teacher-computer/equipmentstock' || hash === 'ict-lab-stock' || hash === 'computer-lab-stock') {
        newNav = { type: 'tool', category: 'teacher', subtab: 'computer', subComponent: 'equipmentStock' };
      } else if (hash === 'incharge-mdm/calculator' || hash === 'mid-day-meal' || hash === 'mdm-calculator') {
        newNav = { type: 'tool', category: 'incharge', subtab: 'mdm' };
      } else if (hash === 'incharge-transport/voucher' || hash === 'transport-voucher' || hash === 'transport-calculator') {
        newNav = { type: 'tool', category: 'incharge', subtab: 'transport' };
      } else if (hash === 'incharge-scholarship/calculator' || hash === 'scholarship-calculator' || hash === 'scholarship-selector') {
        newNav = { type: 'tool', category: 'incharge', subtab: 'scholarship' };
      } else if (hash === 'incharge-exam/roster' || hash === 'exam-roster' || hash === 'exam-duty-roster') {
        newNav = { type: 'tool', category: 'incharge', subtab: 'exam' };
      } else if (hash === 'peeo-timetable/generator' || hash === 'peeo-timetable' || hash === 'school-timetable') {
        newNav = { type: 'tool', category: 'peeo', subtab: 'timetable' };
      } else if (hash === 'peeo-increment/calculator' || hash === 'staff-increment' || hash === 'salary-increment-calculator') {
        newNav = { type: 'tool', category: 'peeo', subtab: 'increment' };
      } else if (hash === 'peeo-substitution/tracker' || hash === 'teacher-substitution' || hash === 'substitution-tracker') {
        newNav = { type: 'tool', category: 'peeo', subtab: 'substitution' };
      } else if (hash === 'peeo-apar/appraisal' || hash === 'apar-appraisal' || hash === 'apar-evaluator') {
        newNav = { type: 'tool', category: 'peeo', subtab: 'apar' };
      } else if (hash === 'portals-calculator/salary' || hash === 'salary-calculator' || hash === 'calculator') {
        newNav = { type: 'tool', category: 'portals', subtab: 'calculator' };
      } else if (hash === 'portals-formats/download' || hash === 'interactive-formats' || hash === 'formats') {
        newNav = { type: 'tool', category: 'portals', subtab: 'formats' };
      } else if (hash === 'invitation/independence' || hash === 'independence-day-invitation' || hash === 'independence-day-invitation-maker') {
        newNav = { type: 'invitation', template: 'independence' };
      } else if (hash === 'blogs' || hash === 'blogs/guides' || hash === 'blogs-guides') {
        newNav = { type: 'blogs', subtab: 'guides' };
      } else if (hash === 'blogs/hub' || hash === 'blogs-hub') {
        newNav = { type: 'blogs', subtab: 'hub' };
      } else if (hash === 'blogs/videos' || hash === 'blogs-videos') {
        newNav = { type: 'blogs', subtab: 'videos' };
      } else if (hash === 'help' || hash === 'resource-hub' || hash === 'hub' || hash === 'teacher-resource-hub') {
        newNav = { type: 'blogs', subtab: 'hub' };
      } else if (hash === 'legal') {
        newNav = { type: 'legal', subtab: 'privacy' };
      } else if (hash === 'peeo') {
        newNav = { type: 'category', id: 'peeo' };
      } else if (hash === 'teacher') {
        newNav = { type: 'category', id: 'teacher' };
      } else if (hash === 'work-incharge' || hash === 'incharge') {
        newNav = { type: 'category', id: 'incharge' };
      } else if (hash === 'quick' || hash === 'portals') {
        newNav = { type: 'category', id: 'portals' };
      } else if (hash === 'student') {
        newNav = { type: 'category', id: 'student' };
      } else if (hash === 'shivira') {
        newNav = { type: 'shivira' };
      } else if (hash === 'invitation') {
        newNav = { type: 'invitation' };
      } else if (hash === 'independence-day-invitation-maker' || hash === 'independence-invitation') {
        newNav = { type: 'invitation', template: 'independence' };
      } else if (hash === 'mdm') {
        newNav = { type: 'tool', category: 'incharge', subtab: 'mdm' };
      } else if (hash === 'exam') {
        newNav = { type: 'tool', category: 'incharge', subtab: 'exam' };
      } else if (hash.includes('/') || hash.includes('-')) {
        const separator = hash.includes('/') ? '/' : '-';
        const parts = hash.split(separator);
        const cat = parts[0];
        const sub = parts[1];
        if (cat === 'peeo' || cat === 'teacher' || cat === 'incharge' || cat === 'portals' || cat === 'student') {
          newNav = { 
            type: 'tool', 
            category: cat as any, 
            subtab: sub as any,
            subComponent: parts[2] || undefined
          };
        }
      }

      setNav(newNav);
    };

    window.addEventListener('hashchange', handleUrlSync);
    window.addEventListener('popstate', handleUrlSync);
    handleUrlSync(); // Run initially on load

    return () => {
      window.removeEventListener('hashchange', handleUrlSync);
      window.removeEventListener('popstate', handleUrlSync);
    };
  }, []);

  // Pinned Tools State (Customizable Quick-View)
  const [pinnedToolIds, setPinnedToolIds] = useState<string[]>(() =>
    storage.getPinnedTools(DEFAULT_PINNED_TOOL_IDS)
  );

  // Hidden Modules Filtering
  const hiddenModules = schoolProfile.hiddenModules || storage.getHiddenModules() || [];

  // Search & Drag-Reorder State
  const [searchQuery, setSearchQuery] = useState('');
  const [dashboardCards, setDashboardCards] = useState<DashboardCardConfig[]>(getInitialCardOrder);
  const visibleDashboardCards = dashboardCards.filter(card => !hiddenModules.includes(card.id));
  const [draggedCardIndex, setDraggedCardIndex] = useState<number | null>(null);
  const [dragOverCardIndex, setDragOverCardIndex] = useState<number | null>(null);

  // Card click executor
  const executeCardClick = (card: DashboardCardConfig) => {
    if (card.id === 'resource-hub') {
      updateNav({ type: 'blogs', subtab: 'hub' });
    } else if (card.id === 'blogs') {
      updateNav({ type: 'blogs', subtab: 'guides' });
    } else if (card.type === 'shivira') {
      updateNav({ type: 'shivira' });
    } else if (card.type === 'category' && card.categoryId) {
      updateNav({ type: 'category', id: card.categoryId });
    } else if (card.type === 'tool' && card.toolCat && card.subtab) {
      updateNav({ type: 'tool', category: card.toolCat, subtab: card.subtab as any });
    } else if (card.type === 'invitation') {
      updateNav({ type: 'invitation' });
    } else if (card.type === 'help') {
      updateNav({ type: 'blogs', subtab: 'guides' });
    } else if (card.type === 'action') {
      if (card.action === 'share') handleShare();
      else if (card.action === 'feedback') onOpenFeedback();
      else if (card.action === 'settings') onOpenSettings();
    }
  };

  // Drag and drop card handlers
  const handleCardDragStart = (e: React.DragEvent, index: number) => {
    setDraggedCardIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleCardDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverCardIndex !== index) {
      setDragOverCardIndex(index);
    }
  };

  const handleCardDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedCardIndex === null || draggedCardIndex === targetIndex) return;

    const newOrder = [...dashboardCards];
    const [draggedItem] = newOrder.splice(draggedCardIndex, 1);
    newOrder.splice(targetIndex, 0, draggedItem);

    setDashboardCards(newOrder);
    setDraggedCardIndex(null);
    setDragOverCardIndex(null);

    try {
      const orderIds = newOrder.map(c => c.id);
      localStorage.setItem(CARD_ORDER_STORAGE_KEY, JSON.stringify(orderIds));
    } catch (err) {
      console.error('Failed to save card order', err);
    }
  };

  const handleCardDragEnd = () => {
    setDraggedCardIndex(null);
    setDragOverCardIndex(null);
  };

  const handleResetCardOrder = () => {
    setDashboardCards(DEFAULT_DASHBOARD_CARDS);
    try {
      localStorage.removeItem(CARD_ORDER_STORAGE_KEY);
    } catch (err) {}
  };

  const isCustomCardOrder = JSON.stringify(dashboardCards.map(c => c.id)) !== JSON.stringify(DEFAULT_DASHBOARD_CARDS.map(c => c.id));

  // Fuzzy Search Result Calculation
  const searchResults = React.useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];

    const results: {
      id: string;
      title: string;
      description: string;
      categoryLabel: string;
      icon: string | React.ReactNode;
      bgTint: string;
      onClick: () => void;
    }[] = [];

    // Match Top-Level Dashboard Cards
    dashboardCards.forEach(card => {
      const labelHi = card.labelHi;
      const labelEn = card.labelEn;
      const desc = lang === 'hi' ? card.descHi : card.descEn;
      const kwMatch = card.keywords?.some(kw => kw.toLowerCase().includes(q));

      if (labelHi.toLowerCase().includes(q) || labelEn.toLowerCase().includes(q) || desc.toLowerCase().includes(q) || kwMatch) {
        results.push({
          id: `card-${card.id}`,
          title: `${card.labelHi} (${card.labelEn})`,
          description: desc,
          categoryLabel: lang === 'hi' ? 'मुख्य मॉड्यूल' : 'Main Module',
          icon: card.icon === 'settings' ? <Settings className="w-5 h-5 text-slate-500" /> : card.icon,
          bgTint: card.bgTint,
          onClick: () => {
            setSearchQuery('');
            executeCardClick(card);
          }
        });
      }
    });

    // Match All Sub-Tools from ALL_TOOLS
    ALL_TOOLS.forEach(tool => {
      const title = lang === 'hi' ? tool.titleHindi : tool.title;
      const desc = lang === 'hi' ? tool.descriptionHindi : tool.description;
      
      if (
        tool.title.toLowerCase().includes(q) ||
        tool.titleHindi.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q) ||
        tool.descriptionHindi.toLowerCase().includes(q) ||
        tool.category.toLowerCase().includes(q) ||
        tool.subtab.toLowerCase().includes(q)
      ) {
        if (!results.some(r => r.id === `tool-${tool.id}`)) {
          results.push({
            id: `tool-${tool.id}`,
            title: `${tool.titleHindi} (${tool.title})`,
            description: desc,
            categoryLabel: tool.category === 'peeo' ? 'पीईईओ' : tool.category === 'teacher' ? 'शिक्षक' : tool.category === 'incharge' ? 'कार्य प्रभारी' : 'पोर्टल्स',
            icon: 'link',
            bgTint: 'bg-emerald-50 dark:bg-emerald-950/40',
            onClick: () => {
              setSearchQuery('');
              updateNav({ type: 'tool', category: tool.category, subtab: tool.subtab as any });
            }
          });
        }
      }
    });

    return results;
  }, [searchQuery, dashboardCards, lang]);

  const handleTogglePin = (toolId: string) => {
    setPinnedToolIds(prev => {
      const updated = prev.includes(toolId)
        ? prev.filter(id => id !== toolId)
        : [...prev, toolId];
      storage.setPinnedTools(updated);
      return updated;
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'शाला सहायक 2026 - Rajasthan School Helper',
        text: 'PEEO, Teachers, Exam Incharge and Rajasthan School Management Portal App',
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    }
  };

  const goBack = () => {
    if (nav.type === 'tool') {
      updateNav({ type: 'category', id: nav.category as any });
    } else {
      updateNav({ type: 'home' });
    }
  };

  // Clean, Minimalistic Top Navigation Header (No redundant top category scrollable selector)
  const renderTopHeader = (title: string, _activeCategory?: string) => {
    return (
      <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-2.5 px-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm gap-2">
        
        {/* Action Navigation Buttons */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={goBack}
            className="flex items-center justify-center w-9 h-9 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white transition-all shadow-sm active:scale-95"
            title={lang === 'hi' ? 'पीछे जाएं' : 'Go Back'}
            aria-label="Go Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <button
            onClick={() => setNav({ type: 'home' })}
            className="flex items-center justify-center w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-all active:scale-95"
            title={lang === 'hi' ? 'मुख्य होम' : 'Home'}
            aria-label="Home"
          >
            <Home className="w-5 h-5" />
          </button>
        </div>

        {/* Current Page Title / Breadcrumb */}
        <div className="flex items-center gap-1 min-w-0 truncate">
          <span className="font-extrabold text-xs sm:text-sm text-slate-800 dark:text-slate-100 truncate">
            {title}
          </span>
        </div>

        {/* Right Action Icons: School Badge & Copy Direct Share Link */}
        <div className="shrink-0 flex items-center space-x-1.5">
          <button
            onClick={() => {
              const url = window.location.href;
              navigator.clipboard.writeText(url);
              setCopiedLink(true);
              setTimeout(() => setCopiedLink(false), 2500);
            }}
            className="flex items-center justify-center gap-1 px-2 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/40 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800/50 transition-all text-[10px] sm:text-xs font-black active:scale-95 cursor-pointer"
            title={lang === 'hi' ? 'इस पेज का सीधा लिंक कॉपी करें (गूगल सर्च रैंक फ्रेंडली)' : 'Copy direct link to this page (SEO friendly)'}
          >
            {copiedLink ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>{lang === 'hi' ? 'कॉपी हुआ!' : 'Copied!'}</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span>{lang === 'hi' ? 'शेयर लिंक' : 'Copy Link'}</span>
              </>
            )}
          </button>

          <span className="hidden sm:inline-block text-[10px] font-black px-2 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60 truncate max-w-[120px]">
            {schoolProfile.schoolNameShort || 'शाला सहायक'}
          </span>
        </div>
      </div>
    );
  };

  // Render Tool Views
  let content: React.ReactNode = null;

  const isHomeActive = nav.type === 'home' || nav.type === 'shivira' || nav.type === 'invitation';
  const isPeeoActive = (nav.type === 'category' && nav.id === 'peeo') || (nav.type === 'tool' && nav.category === 'peeo');
  const isTeacherActive = (nav.type === 'category' && nav.id === 'teacher') || (nav.type === 'tool' && nav.category === 'teacher');
  const isInchargeActive = (nav.type === 'category' && nav.id === 'incharge') || (nav.type === 'tool' && nav.category === 'incharge');
  const isPortalsActive = (nav.type === 'category' && nav.id === 'portals') || (nav.type === 'tool' && nav.category === 'portals');

  const handleNavigateToToolFromHelp = (toolId: string) => {
    if (toolId === 'peeo-orders') {
      updateNav({ type: 'tool', category: 'peeo', subtab: 'notice' });
    } else if (toolId === 'mdm') {
      updateNav({ type: 'tool', category: 'incharge', subtab: 'mdm' });
    } else if (toolId === 'exam') {
      updateNav({ type: 'tool', category: 'incharge', subtab: 'exam' });
    } else if (toolId === 'peeo-paymatrix') {
      updateNav({ type: 'tool', category: 'portals', subtab: 'calculator' });
    } else if (toolId === 'work-incharge-qrcode') {
      updateNav({ type: 'tool', category: 'incharge', subtab: 'qrcode' as any });
    } else if (toolId === 'work-incharge-dutyroster') {
      updateNav({ type: 'tool', category: 'peeo', subtab: 'substitution' });
    } else {
      updateNav({ type: 'category', id: 'peeo' });
    }
  };

  if (nav.type === 'help') {
    content = (
      <div className="space-y-4 animate-fadeIn">
        {renderTopHeader(lang === 'hi' ? 'सहायता एवं मार्गदर्शिका ब्लॉग' : 'Help & User Guides', 'help')}
        <Suspense fallback={<ModuleLoadingFallback />}>
          <HelpCenterModule
            lang={lang}
            initialBlogId={nav.blogId}
            onNavigateToTool={handleNavigateToToolFromHelp}
          />
        </Suspense>
      </div>
    );
  } else if (nav.type === 'tool') {
    const categoryNames: Record<string, string> = {
      peeo: lang === 'hi' ? 'पीईईओ / प्रधानाचार्य कार्यालय' : 'PEEO / Principal Tools',
      teacher: lang === 'hi' ? 'शिक्षक एवं अकादमिक मॉड्यूल' : 'Teacher Tools',
      incharge: lang === 'hi' ? 'कार्य व योजना प्रभारी' : 'Incharge Modules',
      portals: lang === 'hi' ? 'सरकारी शिक्षा पोर्टल्स' : 'Gov Portals',
      student: lang === 'hi' ? 'विद्यार्थी पोर्टल' : 'Student App'
    };

    content = (
      <div className="space-y-4 animate-fadeIn">
        {!(nav.category === 'teacher' && nav.subtab === 'pti' && 'subComponent' in nav && nav.subComponent === 'kridaShulk') && (
          renderTopHeader(categoryNames[nav.category] || 'Module', nav.category)
        )}

        <Suspense fallback={<ModuleLoadingFallback />}>
          {/* PEEO Tools */}
          {nav.category === 'peeo' && (
            <SectionPeeoTools
              schoolProfile={schoolProfile}
              teachers={teachers}
              onUpdateTeachers={onUpdateTeachers}
              incharges={incharges}
              onUpdateIncharges={onUpdateIncharges}
              lang={lang}
              initialSubTab={nav.subtab}
              onNavigate={updateNav}
            />
          )}

          {/* Teacher Tools & Results Grid */}
          {nav.category === 'teacher' && nav.subtab === 'marksheet' ? (
            <ResultsGridModule
              schoolProfile={schoolProfile}
              students={students}
              lang={lang}
              onBack={goBack}
            />
          ) : nav.category === 'teacher' && (
            <SectionTeacherTools
              schoolProfile={schoolProfile}
              students={students}
              onUpdateStudents={onUpdateStudents}
              anomalies={anomalies}
              onUpdateAnomalies={onUpdateAnomalies}
              ictItems={ictItems}
              onUpdateIctItems={onUpdateIctItems}
              libraryBooks={libraryBooks}
              onUpdateLibraryBooks={onUpdateLibraryBooks}
              lang={lang}
              initialSubTab={nav.subtab}
              initialSubComponent={nav.type === 'tool' && 'subComponent' in nav ? nav.subComponent : undefined}
              onNavigate={updateNav}
            />
          )}

          {/* Incharge Tools */}
          {nav.category === 'incharge' && (
            <WorkInchargeModule
              schoolProfile={schoolProfile}
              teachers={teachers}
              mdmLogs={mdmLogs}
              onUpdateMdmLogs={onUpdateMdmLogs}
              lang={lang}
              initialSubTab={nav.subtab as any}
              onBack={goBack}
              onNavigate={onNavigate}
            />
          )}

          {/* Portals & Calculators */}
          {nav.category === 'portals' && (
            <SectionQuickAccess
              schoolProfile={schoolProfile}
              lang={lang}
              initialSubTab={nav.subtab}
              onBack={goBack}
            />
          )}
        </Suspense>

        {/* Student's App Sub-modules */}
        {nav.category === 'student' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-md border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="font-black text-base text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-emerald-600" />
                  <span>
                    {nav.subtab === 'timetable' && (lang === 'hi' ? 'कक्षा समय-सारणी' : 'Class Timetable')}
                    {nav.subtab === 'homework' && (lang === 'hi' ? 'गृहकार्य व असाइनमेंट' : 'Homework & Daily Work')}
                    {nav.subtab === 'datesheet' && (lang === 'hi' ? 'बोर्ड परीक्षा टाइम टेबल 2026' : 'Exam Datesheet 2026')}
                    {nav.subtab === 'syllabus' && (lang === 'hi' ? 'पाठ्यक्रम व मॉडल पेपर्स' : 'Syllabus & Model Papers')}
                    {nav.subtab === 'doubts' && (lang === 'hi' ? 'शंका समाधान व क्विज़' : 'Ask Doubts & Quiz')}
                  </span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {lang === 'hi' ? 'विद्यार्थियों के उपयोग हेतु राजस्थान बोर्ड परीक्षा सामग्री' : 'Rajasthan Board Student Resources 2026'}
                </p>
              </div>
            </div>

            {nav.subtab === 'timetable' && (
              <div className="space-y-3">
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  {lang === 'hi' ? 'कक्षा 10अ दैनिक 8-कालांश समय सारणी:' : 'Class 10-A 8-Period Daily Schedule:'}
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <span className="font-bold text-emerald-700 dark:text-emerald-300">1st Period (10:00 - 10:45)</span>
                    <p className="font-extrabold text-slate-800 dark:text-slate-100">Mathematics (गणित)</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <span className="font-bold text-emerald-700 dark:text-emerald-300">2nd Period (10:45 - 11:30)</span>
                    <p className="font-extrabold text-slate-800 dark:text-slate-100">Science (विज्ञान)</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <span className="font-bold text-emerald-700 dark:text-emerald-300">3rd Period (11:30 - 12:15)</span>
                    <p className="font-extrabold text-slate-800 dark:text-slate-100">English (अंग्रेजी)</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <span className="font-bold text-emerald-700 dark:text-emerald-300">4th Period (12:15 - 01:00)</span>
                    <p className="font-extrabold text-slate-800 dark:text-slate-100">Hindi (हिंदी)</p>
                  </div>
                </div>
              </div>
            )}

            {nav.subtab === 'homework' && (
              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs space-y-2">
                  <h4 className="font-bold text-amber-900 dark:text-amber-200 text-sm">आज का गृहकार्य (Class 10)</h4>
                  <p className="text-slate-700 dark:text-slate-300">• <strong>गणित:</strong> अध्याय 5 समांतर श्रेढ़ी - प्रश्नावली 5.2 प्रश्न 1 से 10 हल करें।</p>
                  <p className="text-slate-700 dark:text-slate-300">• <strong>विज्ञान:</strong> प्रकाश - परावर्तन तथा अपवर्तन के नियम चित्र सहित लिखें।</p>
                </div>
              </div>
            )}

            {nav.subtab === 'datesheet' && (
              <div className="space-y-2 text-xs">
                <h4 className="font-bold text-slate-800 dark:text-slate-200">RBSE Board Exam 2026 Schedule</h4>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex justify-between">
                  <span className="font-bold">Class 10 English</span>
                  <span className="text-emerald-600 font-bold">12 March 2026</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex justify-between">
                  <span className="font-bold">Class 10 Mathematics</span>
                  <span className="text-emerald-600 font-bold">18 March 2026</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex justify-between">
                  <span className="font-bold">Class 10 Science</span>
                  <span className="text-emerald-600 font-bold">24 March 2026</span>
                </div>
              </div>
            )}

            {nav.subtab === 'syllabus' && (
              <div className="space-y-3 text-xs">
                <p className="text-slate-600 dark:text-slate-400">राजस्थान माध्यमिक शिक्षा बोर्ड (RBSE) अजमेर द्वारा जारी नवीन पाठ्यक्रम 2026:</p>
                <div className="grid grid-cols-2 gap-2">
                  <a href="https://rajeduboard.rajasthan.gov.in" target="_blank" rel="noopener noreferrer" className="p-3 rounded-2xl bg-emerald-50 text-emerald-800 font-bold flex items-center justify-between border border-emerald-200">
                    <span>Class 10 Syllabus</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <a href="https://rajeduboard.rajasthan.gov.in" target="_blank" rel="noopener noreferrer" className="p-3 rounded-2xl bg-emerald-50 text-emerald-800 font-bold flex items-center justify-between border border-emerald-200">
                    <span>Class 12 Model Paper</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            )}

            {nav.subtab === 'doubts' && (
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-slate-800 border border-emerald-200 dark:border-slate-700 text-xs text-center space-y-2">
                <Sparkles className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">शिक्षक शंका निवारण केंद्र</h4>
                <p className="text-slate-600 dark:text-slate-300">विषय अध्यापक से सीधे प्रश्न पूछें या दैनिक क्विज़ का अभ्यास करें।</p>
              </div>
            )}
          </div>
        )}
      </div>
    );
  } else if (nav.type === 'invitation') {
    content = (
      <div className="space-y-4 animate-fadeIn">
        <Suspense fallback={<ModuleLoadingFallback />}>
          <InvitationMaker
            schoolProfile={schoolProfile}
            lang={lang}
            onBack={goBack}
            initialTemplate={nav.template}
          />
        </Suspense>
      </div>
    );
  } else if (nav.type === 'blogs' || nav.type === 'help' || nav.type === 'hub') {
    const initialTab = nav.type === 'help' ? 'guides' : nav.type === 'hub' ? 'hub' : ('subtab' in nav ? nav.subtab : 'guides');
    content = (
      <div className="space-y-4 animate-fadeIn">
        {renderTopHeader(lang === 'hi' ? 'शाला सहायक ब्लॉग व रिसोर्स' : 'Blogs & Resources', 'blogs')}
        <Suspense fallback={<ModuleLoadingFallback />}>
          <BlogsView
            lang={lang}
            initialTab={initialTab as any}
            onSelectCategory={(catId) => updateNav({ type: 'category', id: catId as any })}
            onSelectTool={(toolId) => {
              const matchedTool = ALL_TOOLS.find(t => t.id === toolId);
              if (matchedTool) {
                updateNav({ type: 'tool', category: matchedTool.category, subtab: matchedTool.subtab as any });
              } else if (toolId === 'krida-shulk' || toolId === 'krida') {
                updateNav({ type: 'tool', category: 'teacher', subtab: 'pti', subComponent: 'kridaShulk' });
              } else if (toolId === 'pay-matrix' || toolId === 'pay') {
                updateNav({ type: 'tool', category: 'portals', subtab: 'calculator' as any });
              } else if (toolId === 'shivira') {
                updateNav({ type: 'shivira' });
              } else if (toolId === 'invitation') {
                updateNav({ type: 'invitation' });
              }
            }}
            onBack={goBack}
          />
        </Suspense>
      </div>
    );
  } else if (nav.type === 'shivira') {
    content = (
      <div className="space-y-4 animate-fadeIn">
        {renderTopHeader(lang === 'hi' ? 'शिविरा पंचांग 2026' : 'Shivira Calendar 2026', 'shivira')}
        <Suspense fallback={<ModuleLoadingFallback />}>
          <ShiviraWidget schoolProfile={schoolProfile} lang={lang} />
        </Suspense>
      </div>
    );
  } else if (nav.type === 'category') {
    const catId = nav.id;
    const catTitles: Record<string, string> = {
      peeo: lang === 'hi' ? 'पीईईओ / प्रधानाचार्य कार्यालय' : 'PEEO Tools',
      teacher: lang === 'hi' ? 'शिक्षक एवं अकादमिक मॉड्यूल' : 'Teacher Tools',
      incharge: lang === 'hi' ? 'कार्य व योजना प्रभारी' : 'Incharge Modules',
      portals: lang === 'hi' ? 'सरकारी शिक्षा पोर्टल्स' : 'Raj Gov Portals',
      student: lang === 'hi' ? 'विद्यार्थी पोर्टल' : 'Student App'
    };

    content = (
      <div className="space-y-4 animate-fadeIn">
        {renderTopHeader(catTitles[catId] || 'Category', catId)}

        {/* Category Header Banner */}
        <div className="p-4 rounded-3xl bg-gradient-to-r from-emerald-900 to-slate-900 text-white shadow-md">
          <h3 className="font-black text-base text-amber-300">
            {catId === 'peeo' && (lang === 'hi' ? 'पीईईओ / प्रधानाचार्य कार्यालय टूल्स' : 'PEEO & Principal Office Tools')}
            {catId === 'teacher' && (lang === 'hi' ? 'शिक्षक एवं कक्षाध्यापक टूल्स' : 'Class Teacher & Academic Tools')}
            {catId === 'incharge' && (lang === 'hi' ? 'विद्यालय योजना एवं परीक्षा प्रभारी टूल्स' : 'Exam & Scheme Incharge Tools')}
            {catId === 'portals' && (lang === 'hi' ? 'राजस्थान शिक्षा विभाग डायरेक्ट पोर्टल्स' : 'Rajasthan Education Direct Portals')}
            {catId === 'student' && (lang === 'hi' ? 'विद्यार्थी अध्ययन व बोर्ड परीक्षा सहायता' : 'Student Study & Board Exam Corner')}
          </h3>
          <p className="text-xs text-emerald-200 mt-1">
            {lang === 'hi' ? 'उपलब्ध सुविधा का चयन करने हेतु नीचे दिए गए आइकॉन पर क्लिक करें' : 'Click on any square card below to launch full tool'}
          </p>
        </div>

        {/* Dedicated AdSense Slot: Category Feed Banner - Mid-page high engagement banner */}
        <AdSense.Google
          client="ca-pub-3940256099942544"
          slot="1234567891"
          style={{ display: 'block' }}
          format="auto"
          responsive="true"
        />

        {/* SQUARE ICON CARDS GRID - Category Sub-Options */}
        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {/* PEEO SUB-OPTIONS */}
          {catId === 'peeo' && (
            <>
              <ThreeDCard
                onClick={() => updateNav({ type: 'tool', category: 'peeo', subtab: 'increment' })}
                icon="chart"
                bgTint="bg-emerald-50 dark:bg-emerald-950/40"
                label={lang === 'hi' ? 'वार्षिक वेतन वृद्धि' : 'Annual Increment'}
                delayIndex={0}
              />

              <ThreeDCard
                onClick={() => updateNav({ type: 'tool', category: 'peeo', subtab: 'timetable' })}
                icon="calendar"
                bgTint="bg-amber-50 dark:bg-amber-950/40"
                label={lang === 'hi' ? 'समय-सारणी' : 'Time Table'}
                delayIndex={1}
              />

              <ThreeDCard
                onClick={() => updateNav({ type: 'tool', category: 'peeo', subtab: 'incharge' })}
                icon="briefcase"
                bgTint="bg-indigo-50 dark:bg-indigo-950/40"
                label={lang === 'hi' ? 'प्रभारी मैपिंग' : 'Incharge Mapping'}
                delayIndex={2}
              />

              <ThreeDCard
                onClick={() => updateNav({ type: 'tool', category: 'peeo', subtab: 'substitution' })}
                icon="bell"
                bgTint="bg-purple-50 dark:bg-purple-950/40"
                label={lang === 'hi' ? 'दैनिक स्थानापन्न' : 'Daily Substitutes'}
                delayIndex={3}
              />

              <ThreeDCard
                onClick={() => updateNav({ type: 'tool', category: 'peeo', subtab: 'apar' })}
                icon="award"
                bgTint="bg-rose-50 dark:bg-rose-950/40"
                label={lang === 'hi' ? 'APAR अनुमोदन' : 'APAR Approval'}
                delayIndex={4}
              />

              <ThreeDCard
                onClick={() => updateNav({ type: 'tool', category: 'peeo', subtab: 'satyapan' })}
                icon="shield"
                bgTint="bg-sky-50 dark:bg-sky-950/40"
                label={lang === 'hi' ? 'दस्तावेज़ सत्यापन' : 'Verification Checklist'}
                delayIndex={5}
              />
            </>
          )}

          {/* TEACHER SUB-OPTIONS */}
          {catId === 'teacher' && (
            <>
              <ThreeDCard
                onClick={() => updateNav({ type: 'tool', category: 'teacher', subtab: 'classTeacher' })}
                icon="graduation"
                bgTint="bg-emerald-50 dark:bg-emerald-950/40"
                label={lang === 'hi' ? 'कक्षा अध्यापक' : 'Class Teacher'}
                delayIndex={0}
              />

              <ThreeDCard
                onClick={() => updateNav({ type: 'tool', category: 'teacher', subtab: 'subjectTeacher' })}
                icon="coupon"
                bgTint="bg-blue-50 dark:bg-blue-950/40"
                label={lang === 'hi' ? 'विषय अध्यापक' : 'Subject Teacher'}
                delayIndex={1}
              />

              <ThreeDCard
                onClick={() => updateNav({ type: 'tool', category: 'teacher', subtab: 'librarian' })}
                icon="book"
                bgTint="bg-purple-50 dark:bg-purple-950/40"
                label={lang === 'hi' ? 'पुस्तकालय अध्यक्ष' : 'Librarian'}
                delayIndex={2}
              />

              <ThreeDCard
                onClick={() => updateNav({ type: 'tool', category: 'teacher', subtab: 'pti' })}
                icon="award"
                bgTint="bg-amber-50 dark:bg-amber-950/40"
                label={lang === 'hi' ? 'शारीरिक शिक्षक (PTI)' : 'PTI Teacher'}
                delayIndex={3}
              />

              <ThreeDCard
                onClick={() => updateNav({ type: 'tool', category: 'teacher', subtab: 'computer' })}
                icon="calculator"
                bgTint="bg-sky-50 dark:bg-sky-950/40"
                label={lang === 'hi' ? 'कंप्यूटर शिक्षक' : 'Computer Teacher'}
                delayIndex={4}
              />

              <ThreeDCard
                onClick={() => updateNav({ type: 'tool', category: 'teacher', subtab: 'marksheet' })}
                icon="chart"
                bgTint="bg-teal-50 dark:bg-teal-950/40"
                label={lang === 'hi' ? 'अंकतालिका जनरेटर' : 'Marksheet Generator'}
                delayIndex={5}
              />

              <ThreeDCard
                onClick={() => updateNav({ type: 'tool', category: 'teacher', subtab: 'anomaly' })}
                icon="lock"
                bgTint="bg-rose-50 dark:bg-rose-950/40"
                label={lang === 'hi' ? 'आधार सत्यापन' : 'Aadhaar Check'}
                delayIndex={6}
              />
            </>
          )}

          {/* INCHARGE SUB-OPTIONS */}
          {catId === 'incharge' && (
            <>
              <ThreeDCard
                onClick={() => updateNav({ type: 'tool', category: 'incharge', subtab: 'remuneration' })}
                icon="money-bag"
                bgTint="bg-emerald-50 dark:bg-emerald-950/40"
                label={lang === 'hi' ? 'बोर्ड परीक्षा मानदेय (प्रपत्र-89)' : 'Remuneration Bill'}
                delayIndex={0}
              />

              <ThreeDCard
                onClick={() => updateNav({ type: 'tool', category: 'incharge', subtab: 'resizer' })}
                icon="coupon"
                bgTint="bg-sky-50 dark:bg-sky-950/40"
                label={lang === 'hi' ? 'RBSE फोटो/साइन रिसाइज़र' : 'Image Resizer'}
                delayIndex={1}
              />

              <ThreeDCard
                onClick={() => updateNav({ type: 'tool', category: 'incharge', subtab: 'mdm' })}
                icon="utensils"
                bgTint="bg-amber-50 dark:bg-amber-950/40"
                label={lang === 'hi' ? 'मिड-डे मील (MDM)' : 'MDM Log'}
                delayIndex={2}
              />

              <ThreeDCard
                onClick={() => updateNav({ type: 'tool', category: 'incharge', subtab: 'exam' })}
                icon="target"
                bgTint="bg-teal-50 dark:bg-teal-950/40"
                label={lang === 'hi' ? 'परीक्षा सिटिंग प्लान' : 'Seating Matrix'}
                delayIndex={3}
              />

              <ThreeDCard
                onClick={() => updateNav({ type: 'tool', category: 'incharge', subtab: 'transport' })}
                icon="bus"
                bgTint="bg-purple-50 dark:bg-purple-950/40"
                label={lang === 'hi' ? 'ट्रांसपोर्ट वाउचर' : 'Transport Voucher'}
                delayIndex={4}
              />

              <ThreeDCard
                onClick={() => updateNav({ type: 'tool', category: 'incharge', subtab: 'scholarship' })}
                icon="coin"
                bgTint="bg-indigo-50 dark:bg-indigo-950/40"
                label={lang === 'hi' ? 'छात्रवृत्ति ट्रैकर' : 'Scholarship Tracker'}
                delayIndex={5}
              />

              <ThreeDCard
                onClick={() => updateNav({ type: 'tool', category: 'incharge', subtab: 'qrcode' })}
                icon="coupon"
                bgTint="bg-teal-50 dark:bg-teal-950/40"
                label={lang === 'hi' ? 'क्यूआर कोड जनरेटर' : 'QR Code Generator'}
                delayIndex={6}
              />
            </>
          )}
        </div>
      </div>
    );
  } else if (nav.type === 'legal') {
    content = (
      <LegalDocs
        lang={lang}
        initialTab={nav.subtab || 'privacy'}
        onBack={() => updateNav({ type: 'home' })}
      />
    );
  } else if (nav.type === 'about-us') {
    content = (
      <AboutUsView
        lang={lang}
        onBack={() => updateNav({ type: 'home' })}
      />
    );
  } else if (nav.type === 'contact-us') {
    content = (
      <ContactUsView
        lang={lang}
        onBack={() => updateNav({ type: 'home' })}
        onOpenFeedback={onOpenFeedback}
      />
    );
  } else {
    // ROOT HOME DASHBOARD - MAIN CATEGORIES GRID (3 Columns, Square Cards)
    content = (
      <div className="space-y-4 animate-fadeIn">

        {/* PROMO BANNER CAROUSEL - RESTRICTED TO HOME SCREEN ONLY */}
        <TopPromoBanner lang={lang} onNavigateToTool={handleNavigateToToolFromHelp} />
        
        {/* REAL-TIME FUZZY SEARCH BAR */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-2.5 shadow-sm space-y-2">
          <div className="relative flex items-center">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-600 dark:text-emerald-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === 'hi' ? 'मॉड्यूल या सुविधा खोजें (उदा. शिविरा, एमडीएम, वेतन, Marksheet)...' : 'Search modules & tools (e.g., Shivira, MDM, Salary, Marksheet)...'}
              className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm font-medium bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-xl border border-slate-200/80 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
            {searchQuery ? (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-700 transition-colors"
                title="सर्च साफ़ करें"
              >
                <X className="w-4 h-4" />
              </button>
            ) : null}
          </div>

          {/* SEARCH RESULTS VIEW */}
          {searchQuery.trim().length > 0 && (
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                  {lang === 'hi' ? `खोज परिणाम (${searchResults.length} परिणाम मिले)` : `Search Results (${searchResults.length} found)`}
                </span>
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  {lang === 'hi' ? 'सर्च बंद करें' : 'Close search'}
                </button>
              </div>

              {searchResults.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-[380px] overflow-y-auto pr-1">
                  {searchResults.map((res) => (
                    <button
                      key={res.id}
                      onClick={res.onClick}
                      className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50/60 dark:bg-slate-800/60 dark:hover:bg-emerald-950/30 border border-slate-200/60 dark:border-slate-700/60 hover:border-emerald-300 dark:hover:border-emerald-700 text-left transition-all duration-150 active:scale-[0.97] active:bg-emerald-100/70 dark:active:bg-emerald-950/60 touch-manipulation group cursor-pointer"
                    >
                      <div className="w-9 h-9 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                        {typeof res.icon === 'string' ? (
                          <ThreeDIcon name={res.icon} size={22} />
                        ) : (
                          res.icon
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 shrink-0">
                            {res.categoryLabel}
                          </span>
                        </div>
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate mt-1">
                          {res.title}
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                          {res.description}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-5 text-center text-slate-500 dark:text-slate-400 space-y-2">
                  <p className="text-xs font-semibold">
                    {lang === 'hi' ? 'कोई मेल खाता मॉड्यूल नहीं मिला' : 'No matching modules found'}
                  </p>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="px-3 py-1 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors"
                  >
                    {lang === 'hi' ? 'सर्च साफ़ करें' : 'Clear search'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Dedicated AdSense Slot: Home Screen Feed - High performing header banner */}
        <AdSense.Google
          client="ca-pub-3940256099942544"
          slot="1234567890"
          style={{ display: 'block' }}
          format="auto"
          responsive="true"
        />

        {/* CUSTOMIZABLE QUICK VIEW / PINNED TOOLS SECTION */}
        <QuickViewSection
          pinnedToolIds={pinnedToolIds}
          onTogglePin={handleTogglePin}
          onSelectTool={(category, subtab) => {
            updateNav({ type: 'tool', category: category as any, subtab: subtab as any });
          }}
          lang={lang}
        />

        {/* MOBILE SOCIAL MEDIA BAR BELOW QUICK TOOLS */}
        <div className="md:hidden my-3">
          <SocialHeaderBar />
        </div>

        {/* MAIN CATEGORIES - REORDERABLE SQUARE ICON CARDS GRID */}
        <div className="space-y-2">
          {/* DRAG AND DROP INSTRUCTION BAR */}
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center space-x-1.5">
              <GripVertical className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                {lang === 'hi' ? 'मॉड्यूल क्रम बदलने हेतु आइकॉन ड्रैग करें' : 'Drag icons to reorder layout'}
              </span>
            </div>
            {isCustomCardOrder && (
              <button
                onClick={handleResetCardOrder}
                className="flex items-center space-x-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                title="क्रम रीसेट करें"
              >
                <RotateCcw className="w-3 h-3" />
                <span>{lang === 'hi' ? 'रीसेट' : 'Reset Order'}</span>
              </button>
            )}
          </div>

          {/* Hidden Modules Notice Bar */}
          {hiddenModules.length > 0 && (
            <div className="p-2.5 px-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-center justify-between text-xs text-amber-900 dark:text-amber-200">
              <div className="flex items-center gap-2 font-bold text-[11px]">
                <Sliders className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                <span>
                  {lang === 'hi'
                    ? `${hiddenModules.length} मॉड्यूल छिपे हुए हैं (${ALL_TOOLS ? ALL_TOOLS.length : ''})`
                    : `${hiddenModules.length} modules hidden by preference`}
                </span>
              </div>
              <button
                onClick={onOpenSettings}
                className="text-[11px] font-extrabold text-amber-800 dark:text-amber-300 hover:underline cursor-pointer shrink-0"
              >
                {lang === 'hi' ? 'सेटिंग्स में बदलें' : 'Manage Settings'}
              </button>
            </div>
          )}

          {/* 3-COLUMN SQUARE ROUNDED CARDS GRID WITH DRAG & DROP */}
          <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 dashboard-cards-container directory-dashboard-grid">
            {visibleDashboardCards.map((card, index) => {
              const label = lang === 'hi' ? card.labelHi : card.labelEn;
              const ariaLabel = lang === 'hi' ? card.ariaHi : card.ariaEn;
              const description = lang === 'hi' ? card.descHi : card.descEn;
              const cardIcon = card.icon === 'settings' ? <Settings className="w-6 h-6 text-slate-500" /> : card.icon;

              return (
                <ThreeDCard
                  key={card.id}
                  onClick={() => executeCardClick(card)}
                  icon={cardIcon}
                  bgTint={card.bgTint}
                  label={label}
                  ariaLabel={ariaLabel}
                  description={description}
                  draggable={true}
                  onDragStart={(e) => handleCardDragStart(e, index)}
                  onDragOver={(e) => handleCardDragOver(e, index)}
                  onDrop={(e) => handleCardDrop(e, index)}
                  onDragEnd={handleCardDragEnd}
                  isDragging={draggedCardIndex === index}
                  isDragOver={dragOverCardIndex === index}
                  delayIndex={index}
                />
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative pb-24 md:pb-8">
      <SeoManager
        currentView={nav.type === 'invitation' && nav.template === 'independence' ? 'independence-invitation' : nav.type === 'shivira' ? 'shivira' : nav.type === 'help' ? 'help' : nav.type === 'invitation' ? 'invitation' : nav.type}
        category={nav.type === 'category' ? nav.id : nav.type === 'tool' ? nav.category : undefined}
        activeToolId={nav.type === 'tool' ? `${nav.category}-${nav.subtab}` : undefined}
      />
      
      {isInitialLoading ? (
        nav.type === 'home' ? (
          <DashboardSkeleton />
        ) : (
          <div className="max-w-5xl mx-auto px-4 py-6 space-y-4">
            <TableSkeleton rows={6} />
          </div>
        )
      ) : (
        <>
          {nav.type !== 'home' && (
            <div className="hidden sm:block max-w-5xl mx-auto px-4 pt-4">
              <Breadcrumbs
                category={nav.type === 'category' ? nav.id : nav.type === 'tool' ? nav.category : undefined}
                subtab={nav.type === 'tool' ? nav.subtab : undefined}
                subComponent={nav.type === 'tool' ? nav.subComponent : undefined}
                currentView={nav.type !== 'category' && nav.type !== 'tool' ? nav.type : undefined}
                lang={lang}
                onNavigateHome={() => updateNav({ type: 'home' })}
                onNavigateCategory={(catId) => updateNav({ type: 'category', id: catId as any })}
              />
            </div>
          )}
          {content}
          
          {/* Bottom Content Flow AdSense Slot - Footer Companion Banner */}
          <div className="max-w-5xl mx-auto px-4 mt-8">
            <AdSense.Google
              client="ca-pub-3940256099942544"
              slot="1234567892"
              style={{ display: 'block' }}
              format="auto"
              responsive="true"
            />
          </div>
        </>
      )}

      {/* Persistent Sticky Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-[1000] h-[60px] bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 shadow-2xl px-3 flex items-center justify-center select-none bottom-nav">
        <div className="w-full max-w-md md:max-w-5xl lg:max-w-6xl mx-auto flex items-center justify-around">
          
          {/* Home Tab */}
          <button
            onClick={() => updateNav({ type: 'home' })}
            className={`flex flex-col items-center justify-center space-y-1 transition-all cursor-pointer active:scale-95 group ${
              isHomeActive
                ? 'text-emerald-600 dark:text-emerald-400 font-extrabold'
                : 'text-slate-500 dark:text-slate-400 font-medium hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Home className="w-5 h-5 transition-transform group-hover:scale-110" />
            <span className="text-[10px] sm:text-xs">
              {lang === 'hi' ? 'मुख्य' : 'Home'}
            </span>
          </button>

          {/* PEEO Tab */}
          <button
            onClick={() => updateNav({ type: 'category', id: 'peeo' })}
            className={`flex flex-col items-center justify-center space-y-1 transition-all cursor-pointer active:scale-95 group ${
              isPeeoActive
                ? 'text-emerald-600 dark:text-emerald-400 font-extrabold'
                : 'text-slate-500 dark:text-slate-400 font-medium hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Building2 className="w-5 h-5 transition-transform group-hover:scale-110" />
            <span className="text-[10px] sm:text-xs">
              {lang === 'hi' ? 'पीईईओ' : 'PEEO'}
            </span>
          </button>

          {/* Teachers Tab */}
          <button
            onClick={() => updateNav({ type: 'category', id: 'teacher' })}
            className={`flex flex-col items-center justify-center space-y-1 transition-all cursor-pointer active:scale-95 group ${
              isTeacherActive
                ? 'text-emerald-600 dark:text-emerald-400 font-extrabold'
                : 'text-slate-500 dark:text-slate-400 font-medium hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <GraduationCap className="w-5 h-5 transition-transform group-hover:scale-110" />
            <span className="text-[10px] sm:text-xs">
              {lang === 'hi' ? 'शिक्षक' : 'Teacher'}
            </span>
          </button>

          {/* Work Incharge Tab */}
          <button
            onClick={() => updateNav({ type: 'category', id: 'incharge' })}
            className={`flex flex-col items-center justify-center space-y-1 transition-all cursor-pointer active:scale-95 group ${
              isInchargeActive
                ? 'text-emerald-600 dark:text-emerald-400 font-extrabold'
                : 'text-slate-500 dark:text-slate-400 font-medium hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Briefcase className="w-5 h-5 transition-transform group-hover:scale-110" />
            <span className="text-[10px] sm:text-xs">
              {lang === 'hi' ? 'प्रभारी' : 'Incharge'}
            </span>
          </button>

          {/* Portals Tab */}
          <button
            onClick={() => updateNav({ type: 'tool', category: 'portals', subtab: 'portals' })}
            className={`flex flex-col items-center justify-center space-y-1 transition-all cursor-pointer active:scale-95 group ${
              isPortalsActive
                ? 'text-emerald-600 dark:text-emerald-400 font-extrabold'
                : 'text-slate-500 dark:text-slate-400 font-medium hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <ExternalLink className="w-5 h-5 transition-transform group-hover:scale-110" />
            <span className="text-[10px] sm:text-xs">
              {lang === 'hi' ? 'पोर्टल्स' : 'Portals'}
            </span>
          </button>

        </div>
      </div>
    </div>
  );
};
