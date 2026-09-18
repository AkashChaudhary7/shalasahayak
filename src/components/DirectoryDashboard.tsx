import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
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
  Sliders,
  RefreshCw
} from 'lucide-react';
import { SchoolProfile, Teacher, StudentResult, StudentAnomaly, ICTEquipment, LibraryBook, MDMLog, InchargeAssignment, Language } from '../types';
import { FavoritesAndRecentTools, saveRecentToolId } from './FavoritesAndRecentTools';
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
import {
  UserProfileState,
  UserCharge,
  UserRole,
  getStoredUserProfile,
  saveStoredUserProfile,
  getRoleLabel,
  getChargeLabel
} from './UserOnboardingModal';

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
import { SchoolProfileModule } from './modules/SchoolProfileModule';
const SectionUsefulTools = lazy(() => import('./SectionUsefulTools').then(m => ({ default: m.SectionUsefulTools })));
import { LatestGovOrdersSection } from './LatestGovOrdersSection';
import { HelpGuidesDashboardSection } from './HelpGuidesDashboardSection';

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

interface DirectoryDashboardProps {
  schoolProfile: SchoolProfile;
  onUpdateSchoolProfile?: (profile: SchoolProfile) => void;
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
  userProfile?: UserProfileState;
  onOpenOnboarding?: () => void;
  onUpdateUserProfile?: (profile: UserProfileState) => void;
}

type NavLocation = 
  | { type: 'home' }
  | { type: 'school-profile' }
  | { type: 'category'; id: 'peeo' | 'teacher' | 'incharge' | 'portals' | 'student' }
  | { type: 'tool'; category: 'peeo'; subtab: 'increment' | 'timetable' | 'incharge' | 'substitution' | 'apar' | 'notice' | 'satyapan' | 'pramanikaran' }
  | { type: 'tool'; category: 'teacher'; subtab: 'classTeacher' | 'subjectTeacher' | 'librarian' | 'pti' | 'computer' | 'marksheet' | 'anomaly' | 'ict' | 'library' | 'diary'; subComponent?: string }
  | { type: 'tool'; category: 'incharge'; subtab: 'mdm' | 'transport' | 'lado' | 'scholarship' | 'elc' | 'exam' | 'qrcode' | 'dutyroster' | 'assembly' | 'inspire' | 'udise' }
  | { type: 'tool'; category: 'portals'; subtab: 'portals' | 'calculator' | 'formats' }
  | { type: 'tool'; category: 'student'; subtab: 'timetable' | 'homework' | 'datesheet' | 'syllabus' | 'doubts' }
  | { type: 'shivira' }
  | { type: 'invitation'; template?: 'independence' | 'republic' | 'ptm' | 'annual' | 'admission' | 'sports' }
  | { type: 'help'; blogId?: string }
  | { type: 'hub' }
  | { type: 'blogs'; subtab?: 'guides' | 'hub' | 'videos'; blogId?: string }
  | { type: 'legal'; subtab?: 'privacy' | 'terms' | 'disclaimer' }
  | { type: 'useful-tools'; subtab?: '8thpay' | 'salary' | 'excel' | 'bonus' | 'rules' | 'qrcode' }
  | { type: 'about-us' }
  | { type: 'contact-us' };

export const getCleanPathFromNav = (newNav: NavLocation): string => {
  let path = '/';
  if (newNav.type === 'school-profile') {
    path = '/school-profile';
  } else if (newNav.type === 'category') {
    if (newNav.id === 'incharge') path = '/incharge-portal';
    else if (newNav.id === 'peeo') path = '/peeo-tools';
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
    } else if (cat === 'incharge' && sub === 'inspire') {
      path = '/incharge-inspire';
    } else if (cat === 'incharge' && sub === 'udise') {
      path = '/incharge-udise';
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
  } else if (newNav.type === 'useful-tools') {
    if (newNav.subtab === 'salary') {
      path = '/7th-pay-calculator';
    } else if (newNav.subtab === 'bonus') {
      path = '/diwali-bonus-calculator';
    } else if (newNav.subtab === 'qrcode') {
      path = '/qr-code-generator';
    } else if (newNav.subtab === '8thpay') {
      path = '/8th-pay-commission-calculator';
    } else if (newNav.subtab === 'excel') {
      path = '/excel-unicode-converter';
    } else if (newNav.subtab === 'rules') {
      path = '/useful-tools/rules';
    } else {
      path = '/useful-tools';
    }
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
  } else if (newNav.type === 'help') {
    path = newNav.blogId ? `/help?help=${encodeURIComponent(newNav.blogId)}` : '/help';
  } else if (newNav.type === 'legal') {
    if (newNav.subtab === 'privacy') path = '/privacy-policy';
    else if (newNav.subtab === 'terms') path = '/terms';
    else if (newNav.subtab === 'disclaimer') path = '/disclaimer';
    else path = '/privacy-policy';
  }
  return path;
};

export interface DashboardCardConfig {
  id: string;
  type: 'school-profile' | 'shivira' | 'category' | 'tool' | 'invitation' | 'help' | 'action' | 'useful-tools';
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
    id: 'useful-tools',
    type: 'useful-tools',
    subtab: '8thpay',
    icon: 'wallet',
    bgTint: 'bg-gradient-to-br from-amber-50 to-emerald-50 dark:from-amber-950/40 dark:to-emerald-950/40',
    labelHi: 'उपयोगी टूल्स (Useful Tools)',
    labelEn: 'Useful Tools',
    ariaHi: '8वां वेतन आयोग, राजस्थान सैलरी व एक्सेल शीट यूनिकोड कन्वर्टर',
    ariaEn: '8th Pay Commission, Rajasthan Salary & Excel Unicode Converter',
    descHi: '8वां वेतन आयोग, राजस्थान सर्विस रूल्स पे-मैनेजर सैलरी व एक्सेल शीट कृतिदेव यूनिकोड कन्वर्टर',
    descEn: '8th CPC calculator, Rajasthan salary & Excel KrutiDev Unicode converter',
    keywords: ['useful', 'tools', 'उपयोगी', 'टूल्स', '8th pay', '8वां वेतन', 'salary', 'वेतन', 'excel', 'एक्सेल', 'krutidev', 'कृतिदेव', 'unicode', 'यूनिकोड']
  },
  {
    id: 'school-profile',
    type: 'school-profile',
    icon: 'building',
    bgTint: 'bg-emerald-50 dark:bg-emerald-950/40',
    labelHi: 'स्कूल प्रोफाइल',
    labelEn: 'School Profile',
    ariaHi: 'विद्यालय प्रोफाइल, छात्र एवं कर्मचारी डेटा प्रबंधन',
    ariaEn: 'School Profile, Student and Staff Data Hub',
    descHi: 'विद्यालय सेटिंग्स, छात्र व शिक्षक एक्सेल डेटा इम्पोर्ट व एक्सपोर्ट',
    descEn: 'School settings, student and teacher Excel import/export',
    keywords: ['school', 'profile', 'स्कूल', 'प्रोफाइल', 'student', 'teacher', 'excel', 'import', 'export']
  },
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
  }
];

export const ALL_AVAILABLE_DASHBOARD_CARDS: DashboardCardConfig[] = [
  ...DEFAULT_DASHBOARD_CARDS,
  {
    id: 'useful-8thpay',
    type: 'useful-tools',
    subtab: '8thpay',
    icon: 'coin',
    bgTint: 'bg-amber-50 dark:bg-amber-950/40',
    labelHi: '8वां वेतन आयोग',
    labelEn: '8th Pay Commission',
    ariaHi: '8वां वेतन आयोग कैलकुलेटर एवं तुलना',
    ariaEn: '8th Pay Commission Calculator and Comparison',
    descHi: 'कस्टम इनपुट, चर्चित फ़िटमेंट फ़ैक्टर (1.92x - 3.00x) व 7वें-8वें वेतन की तुलना',
    descEn: 'Custom inputs, fitment factor dropdown and salary difference',
    keywords: ['8th pay', '8वां वेतन', 'fitment', 'salary', 'calculator']
  },
  {
    id: 'useful-salary',
    type: 'useful-tools',
    subtab: 'salary',
    icon: 'calculator',
    bgTint: 'bg-blue-50 dark:bg-blue-950/40',
    labelHi: 'राजस्थान वेतन (RSR)',
    labelEn: 'Rajasthan Salary',
    ariaHi: 'राजस्थान सेवा नियम पे-मैट्रिक्स सैलरी कैलकुलेटर',
    ariaEn: 'Rajasthan Pay Matrix & PayManager Salary Calculator',
    descHi: 'राजस्थान 7वां वेतन पे-मैट्रिक्स (L1-L16), डीए 53%, HRA, SI, GPF व RGHS स्लैब',
    descEn: 'Rajasthan Service Rules, L1-L16 pay matrix, 53% DA, SI & GPF slabs',
    keywords: ['salary', 'rajasthan', 'rsr', 'paymanager', 'si', 'gpf', 'rghs', 'पे-मैट्रिक्स']
  },
  {
    id: 'useful-excel',
    type: 'useful-tools',
    subtab: 'excel',
    icon: 'target',
    bgTint: 'bg-emerald-50 dark:bg-emerald-950/40',
    labelHi: 'एक्सेल शीट (कृतिदेव कन्वर्टर)',
    labelEn: 'Excel KrutiDev Converter',
    ariaHi: 'एक्सेल शीट कृतिदेव / देवलास से यूनिकोड कन्वर्टर एवं एडिटर',
    ariaEn: 'Excel Sheet KrutiDev to Hindi Unicode Converter and Editor',
    descHi: '.xlsx/.csv अपलोड करें, कृतिदेव से शुद्ध हिंदी में बदलें, एडिट करें व डाउनलोड करें',
    descEn: 'Upload xlsx/csv, auto-convert KrutiDev to Hindi Unicode, edit and download',
    keywords: ['excel', 'एक्सेल', 'krutidev', 'कृतिदेव', 'devlys', 'unicode', 'यूनिकोड', 'sheet']
  },
  {
    id: 'useful-bonus',
    type: 'useful-tools',
    subtab: 'bonus',
    icon: 'coin',
    bgTint: 'bg-orange-50 dark:bg-orange-950/40',
    labelHi: 'दीपावली बोनस (Raj Govt)',
    labelEn: 'Diwali Bonus',
    ariaHi: 'दीपावली तदर्थ बोनस कैलकुलेटर एवं कार्यालय आदेश',
    ariaEn: 'Diwali Ad-hoc Bonus Calculator and Sanction Order',
    descHi: 'अधिकतम ₹6,774, 75% नकद व 25% GPF विभाजन एवं कार्यालय आदेश',
    descEn: 'Rajasthan FD ad-hoc bonus: ₹6,774 cap, 75% cash & 25% GPF split',
    keywords: ['bonus', 'बोनस', 'diwali', 'दीपावली', 'तदर्थ', 'gpf', '75%']
  },
  {
    id: 'useful-rules',
    type: 'useful-tools',
    subtab: 'rules',
    icon: 'book',
    bgTint: 'bg-purple-50 dark:bg-purple-950/40',
    labelHi: 'नियम व गाइड',
    labelEn: 'Rules & Manual',
    ariaHi: 'राजस्थान सरकार नियम, वित्त विभाग परिपत्र व टूल्स उपयोग गाइड',
    ariaEn: 'Rajasthan Govt Rules & Step-by-Step Tool Guide',
    descHi: 'RSR नियम, डीए 53%, HRA, SI, GPF, बोनस शासनादेश एवं सभी टूल्स की सचित्र गाइड',
    descEn: 'Official circulars, RSR pay rules & illustrated step-by-step guides',
    keywords: ['rules', 'नियम', 'guide', 'गाइड', 'शासनादेश', 'परिपत्र', 'manual']
  },
  {
    id: 'exam-incharge',
    type: 'tool',
    toolCat: 'incharge',
    subtab: 'exam',
    icon: 'chart',
    bgTint: 'bg-teal-50 dark:bg-teal-950/40',
    labelHi: 'परीक्षा प्रभारी (Exam)',
    labelEn: 'Exam Incharge',
    ariaHi: 'परीक्षा बैठक व्यवस्था (A-B-A-B), वीक्षक ड्यूटी व टाइमटेबल',
    ariaEn: 'Exam Seating Plan, Schedule and Invigilator Duty',
    descHi: 'कस्टम बैठक व्यवस्था (A-B-A-B), वीक्षक ड्यूटी आवंटन व टाइमटेबल',
    descEn: 'Custom seating plan, invigilator duty roster & schedule',
    keywords: ['exam', 'परीक्षा', 'seating', 'बैठक', 'duty', 'वीक्षक', 'timetable']
  },
  {
    id: 'incharge-mdm',
    type: 'tool',
    toolCat: 'incharge',
    subtab: 'mdm',
    icon: 'utensils',
    bgTint: 'bg-amber-50 dark:bg-amber-950/40',
    labelHi: 'एमडीएम व दुग्ध योजना',
    labelEn: 'MDM & Milk Scheme',
    ariaHi: 'मिड-डे मील व बाल गोपाल दुग्ध योजना',
    ariaEn: 'Mid-Day Meal and Milk Scheme Register',
    descHi: 'दैनिक खाद्यान्न उपभोग, कुकिंग कन्वर्जन कॉस्ट व दुग्ध योजना',
    descEn: 'Daily grain consumption, cooking cost & milk scheme',
    keywords: ['mdm', 'एमडीएम', 'mid-day meal', 'milk', 'दुग्ध', 'पोषाहार']
  },
  {
    id: 'teacher-pti',
    type: 'tool',
    toolCat: 'teacher',
    subtab: 'pti',
    icon: 'award',
    bgTint: 'bg-orange-50 dark:bg-orange-950/40',
    labelHi: 'क्रीड़ा शुल्क व खेलकूद',
    labelEn: 'Sports & Krida Shulk',
    ariaHi: 'क्रीड़ा शुल्क एवं खेलकूद प्रभारी',
    ariaEn: 'Sports Fee Maker and Equipment Stock',
    descHi: 'क्रीड़ा शुल्क चालान, खेलकूद उपकरण स्टॉक व पीटी ग्रेडिंग',
    descEn: 'Sports fee challan, goods stock & physical fitness grading',
    keywords: ['pti', 'sports', 'खेलकूद', 'krida shulk', 'क्रीड़ा शुल्क', 'grading']
  },
  {
    id: 'peeo-orders',
    type: 'tool',
    toolCat: 'peeo',
    subtab: 'increment',
    icon: 'building',
    bgTint: 'bg-emerald-50 dark:bg-emerald-950/40',
    labelHi: 'वार्षिक वेतन वृद्धि',
    labelEn: 'Annual Increment',
    ariaHi: 'वार्षिक वेतन वृद्धि आदेश एवं पे मैट्रिक्स',
    ariaEn: 'Annual Pay Increment Order Draft',
    descHi: '7वां वेतन आयोग 3% वार्षिक वेतन वृद्धि आदेश पत्र जनरेटर',
    descEn: 'Auto 3% annual increment order draft and calculation',
    keywords: ['increment', 'वेतन वृद्धि', 'peeo order', 'आदेश', 'pay matrix']
  },
  {
    id: 'incharge-scholarship',
    type: 'tool',
    toolCat: 'incharge',
    subtab: 'scholarship',
    icon: 'award',
    bgTint: 'bg-indigo-50 dark:bg-indigo-950/40',
    labelHi: 'छात्रवृत्ति व वाउचर',
    labelEn: 'Scholarship Tracker',
    ariaHi: 'छात्रवृत्ति एवं ट्रांसपोर्ट वाउचर',
    ariaEn: 'Scholarship Tracker and Transport Voucher',
    descHi: 'छात्रवृत्ति आवेदन सत्यापन व ट्रांसपोर्ट वाउचर स्टेटस',
    descEn: 'Pre/post matric scholarship status & transport vouchers',
    keywords: ['scholarship', 'छात्रवृत्ति', 'transport', 'वाउचर']
  }
];

export const CHARGE_TO_CARD_IDS: Record<UserCharge, string[]> = {
  all: [
    'useful-tools', 'school-profile', 'shivira', 'peeo', 'teacher', 'incharge',
    'portals', 'result', 'invitation', 'formats', 'calculator',
    'blogs', 'share', 'feedback'
  ],
  peeo: [
    'useful-tools', 'peeo', 'peeo-orders', 'school-profile', 'shivira', 'calculator', 'formats'
  ],
  exam: [
    'useful-tools', 'exam-incharge', 'result', 'incharge', 'school-profile', 'formats'
  ],
  shaladarpan: [
    'useful-tools', 'portals', 'school-profile', 'formats', 'blogs'
  ],
  mdm: [
    'incharge-mdm', 'incharge', 'school-profile', 'formats', 'useful-tools'
  ],
  sports: [
    'teacher-pti', 'teacher', 'school-profile', 'formats', 'useful-tools'
  ],
  salary: [
    'useful-tools', 'calculator', 'peeo-orders', 'portals', 'formats'
  ],
  scholarship: [
    'incharge-scholarship', 'incharge', 'school-profile', 'formats', 'useful-tools'
  ],
  library: [
    'teacher', 'school-profile', 'formats', 'useful-tools'
  ],
  classteacher: [
    'useful-tools', 'result', 'teacher', 'school-profile', 'formats'
  ]
};

const getInitialCardOrder = (): DashboardCardConfig[] => {
  try {
    const savedOrderJson = localStorage.getItem(CARD_ORDER_STORAGE_KEY);
    if (savedOrderJson) {
      const savedIds: string[] = JSON.parse(savedOrderJson);
      if (Array.isArray(savedIds) && savedIds.length > 0) {
        const itemMap = new Map(ALL_AVAILABLE_DASHBOARD_CARDS.map(item => [item.id, item]));
        const orderedItems: DashboardCardConfig[] = [];
        
        savedIds.forEach(id => {
          if (itemMap.has(id)) {
            orderedItems.push(itemMap.get(id)!);
            itemMap.delete(id);
          }
        });
        
        DEFAULT_DASHBOARD_CARDS.forEach(item => {
          if (itemMap.has(item.id)) {
            orderedItems.push(item);
            itemMap.delete(item.id);
          }
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
  onUpdateSchoolProfile,
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
  onNavigate,
  userProfile: propsUserProfile,
  onOpenOnboarding,
  onUpdateUserProfile
}) => {
  const [nav, setNav] = useState<NavLocation>({ type: 'home' });
  const [copiedLink, setCopiedLink] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // User Profile and Personalized View State
  const currentProfile = propsUserProfile || getStoredUserProfile();
  const [filterMode, setFilterMode] = useState<'charges' | 'all'>(
    currentProfile.filterMode || (currentProfile.charges?.includes('all') ? 'all' : 'charges')
  );

  useEffect(() => {
    if (currentProfile.filterMode) {
      setFilterMode(currentProfile.filterMode);
    } else if (currentProfile.charges?.includes('all')) {
      setFilterMode('all');
    }
  }, [currentProfile.filterMode, currentProfile.charges]);

  const handleFilterModeChange = (mode: 'charges' | 'all') => {
    setFilterMode(mode);
    const updated = { ...currentProfile, filterMode: mode };
    saveStoredUserProfile(updated);
    if (onUpdateUserProfile) onUpdateUserProfile(updated);
  };

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
    
    const path = getCleanPathFromNav(newNav);

    if (window.location.pathname !== path) {
      window.history.pushState(null, '', path);
    }
    window.dispatchEvent(new PopStateEvent('popstate'));
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
      const routePath = pathName || hashRaw || 'dashboard';
      let newNav: NavLocation = { type: 'home' };

      // Friendly SEO-optimized direct hierarchical routing aliases
      if (routePath === 'school-profile' || routePath === 'profile' || routePath === 'school') {
        newNav = { type: 'school-profile' };
      } else if (routePath === 'about-us' || routePath === 'about-us.html' || routePath === 'about') {
        newNav = { type: 'about-us' };
      } else if (routePath === 'contact-us' || routePath === 'contact-us.html' || routePath === 'contact') {
        newNav = { type: 'contact-us' };
      } else if (routePath === 'privacy-policy' || routePath === 'privacy') {
        newNav = { type: 'legal', subtab: 'privacy' };
      } else if (routePath === 'terms' || routePath === 'terms-and-conditions') {
        newNav = { type: 'legal', subtab: 'terms' };
      } else if (routePath === 'disclaimer') {
        newNav = { type: 'legal', subtab: 'disclaimer' };
      } else if (routePath === 'teacher/pti/kridashulk' || routePath === 'teachers/pti/krida-shulk' || routePath === 'teacher-pti/sportfeemaker' || routePath === 'krida-shulk' || routePath === 'krida-shulk-maker' || routePath === 'sports-fee-maker') {
        newNav = { type: 'tool', category: 'teacher', subtab: 'pti', subComponent: 'kridaShulk' };
      } else if (routePath === 'teacher-pti/healthbmi' || routePath === 'student-health-bmi' || routePath === 'health-bmi') {
        newNav = { type: 'tool', category: 'teacher', subtab: 'pti', subComponent: 'healthBmi' };
      } else if (routePath === 'teacher-pti/sportsstock' || routePath === 'sports-goods-stock' || routePath === 'sports-stock') {
        newNav = { type: 'tool', category: 'teacher', subtab: 'pti', subComponent: 'sportsStock' };
      } else if (routePath === 'teacher-pti/ptgrading' || routePath === 'pt-grading' || routePath === 'sports-grading') {
        newNav = { type: 'tool', category: 'teacher', subtab: 'pti', subComponent: 'ptGrading' };
      } else if (routePath === 'teacher-marksheet/greensheet' || routePath === 'greensheet-maker' || routePath === 'marksheet-maker' || routePath === 'results-greensheet') {
        newNav = { type: 'tool', category: 'teacher', subtab: 'marksheet' };
      } else if (routePath === 'teacher-anomaly/verification' || routePath === 'student-verification' || routePath === 'verification-anomaly') {
        newNav = { type: 'tool', category: 'teacher', subtab: 'anomaly', subComponent: 'verification' };
      } else if (routePath === 'teacher-diary/lessonplanner' || routePath === 'teacher-diary' || routePath === 'lesson-planner') {
        newNav = { type: 'tool', category: 'teacher', subtab: 'diary' };
      } else if (routePath === 'teacher-library/catalogue' || routePath === 'library-catalogue' || routePath === 'library-books') {
        newNav = { type: 'tool', category: 'teacher', subtab: 'library', subComponent: 'catalogue' };
      } else if (routePath === 'teacher-computer/equipmentstock' || routePath === 'ict-lab-stock' || routePath === 'computer-lab-stock') {
        newNav = { type: 'tool', category: 'teacher', subtab: 'computer', subComponent: 'equipmentStock' };
      } else if (routePath.startsWith('incharge-mdm') || routePath.startsWith('mid-day-meal') || routePath.startsWith('mdm') || routePath.startsWith('incharge-portal/mdm')) {
        newNav = { type: 'tool', category: 'incharge', subtab: 'mdm' };
      } else if (routePath.startsWith('incharge-transport') || routePath.startsWith('transport') || routePath.startsWith('incharge-portal/transport')) {
        newNav = { type: 'tool', category: 'incharge', subtab: 'transport' };
      } else if (routePath.startsWith('incharge-scholarship') || routePath.startsWith('scholarship') || routePath.startsWith('incharge-portal/scholarship')) {
        newNav = { type: 'tool', category: 'incharge', subtab: 'scholarship' };
      } else if (routePath.startsWith('incharge-exam') || routePath.startsWith('exam-roster') || routePath.startsWith('exam-duty') || routePath.startsWith('incharge-portal/exam')) {
        newNav = { type: 'tool', category: 'incharge', subtab: 'exam' };
      } else if (routePath.startsWith('incharge-inspire') || routePath.startsWith('inspire') || routePath.startsWith('incharge-portal/inspire')) {
        newNav = { type: 'tool', category: 'incharge', subtab: 'inspire' };
      } else if (routePath.startsWith('incharge-udise') || routePath.startsWith('udise') || routePath.startsWith('incharge-portal/udise')) {
        newNav = { type: 'tool', category: 'incharge', subtab: 'udise' };
      } else if (routePath.startsWith('incharge-lado') || routePath.startsWith('lado') || routePath.startsWith('incharge-portal/lado')) {
        newNav = { type: 'tool', category: 'incharge', subtab: 'lado' };
      } else if (routePath.startsWith('incharge-elc') || routePath.startsWith('elc') || routePath.startsWith('incharge-portal/elc')) {
        newNav = { type: 'tool', category: 'incharge', subtab: 'elc' };
      } else if (routePath.startsWith('incharge-qrcode') || routePath.startsWith('qrcode') || routePath.startsWith('incharge-portal/qrcode')) {
        newNav = { type: 'tool', category: 'incharge', subtab: 'qrcode' };
      } else if (routePath.startsWith('incharge-dutyroster') || routePath.startsWith('dutyroster') || routePath.startsWith('incharge-portal/dutyroster')) {
        newNav = { type: 'tool', category: 'incharge', subtab: 'dutyroster' };
      } else if (routePath.startsWith('incharge-assembly') || routePath.startsWith('assembly') || routePath.startsWith('incharge-portal/assembly')) {
        newNav = { type: 'tool', category: 'incharge', subtab: 'assembly' };
      } else if (routePath === 'peeo-timetable/generator' || routePath === 'peeo-timetable' || routePath === 'school-timetable') {
        newNav = { type: 'tool', category: 'peeo', subtab: 'timetable' };
      } else if (routePath === 'peeo-increment/calculator' || routePath === 'staff-increment' || routePath === 'salary-increment-calculator') {
        newNav = { type: 'tool', category: 'peeo', subtab: 'increment' };
      } else if (routePath === 'peeo-substitution/tracker' || routePath === 'teacher-substitution' || routePath === 'substitution-tracker') {
        newNav = { type: 'tool', category: 'peeo', subtab: 'substitution' };
      } else if (routePath === 'peeo-apar/appraisal' || routePath === 'apar-appraisal' || routePath === 'apar-evaluator') {
        newNav = { type: 'tool', category: 'peeo', subtab: 'apar' };
      } else if (routePath === 'portals-calculator/salary' || routePath === 'salary-calculator' || routePath === 'calculator') {
        newNav = { type: 'tool', category: 'portals', subtab: 'calculator' };
      } else if (routePath === 'portals-formats/download' || routePath === 'interactive-formats' || routePath === 'formats') {
        newNav = { type: 'tool', category: 'portals', subtab: 'formats' };
      } else if (routePath === 'invitation/independence' || routePath === 'independence-day-invitation' || routePath === 'independence-day-invitation-maker') {
        newNav = { type: 'invitation', template: 'independence' };
      } else if (routePath === 'blogs' || routePath === 'blogs/guides' || routePath === 'blogs-guides') {
        newNav = { type: 'blogs', subtab: 'guides' };
      } else if (routePath === '7th-pay-calculator' || routePath === 'da-calculator' || routePath === 'rajasthan-salary-calculator') {
        newNav = { type: 'useful-tools', subtab: 'salary' };
      } else if (routePath === 'diwali-bonus-calculator' || routePath === 'bonus-calculator') {
        newNav = { type: 'useful-tools', subtab: 'bonus' };
      } else if (routePath === 'qr-code-generator' || routePath === 'school-qr-code-generator') {
        newNav = { type: 'useful-tools', subtab: 'qrcode' };
      } else if (routePath === '8th-pay-commission-calculator' || routePath === '8th-pay-calculator') {
        newNav = { type: 'useful-tools', subtab: '8thpay' };
      } else if (routePath === 'excel-unicode-converter' || routePath === 'krutidev-converter') {
        newNav = { type: 'useful-tools', subtab: 'excel' };
      } else if (routePath.startsWith('useful-tools') || routePath.startsWith('useful') || routePath === '8thpay' || routePath === 'salary-calc' || routePath === 'excel-sheet' || routePath === 'bonus' || routePath === 'diwali-bonus' || routePath === 'rules' || routePath === 'rules-guide') {
        if (routePath.includes('bonus') || routePath.includes('diwali')) {
          newNav = { type: 'useful-tools', subtab: 'bonus' };
        } else if (routePath.includes('qrcode') || routePath.includes('qr')) {
          newNav = { type: 'useful-tools', subtab: 'qrcode' };
        } else if (routePath.includes('rules') || routePath.includes('manual') || routePath.includes('guide')) {
          newNav = { type: 'useful-tools', subtab: 'rules' };
        } else if (routePath.includes('8thpay') || routePath.includes('8cpc') || routePath.includes('8th-pay') || routePath === '8thpay') {
          newNav = { type: 'useful-tools', subtab: '8thpay' };
        } else if (routePath.includes('salary') || routePath.includes('paymanager')) {
          newNav = { type: 'useful-tools', subtab: 'salary' };
        } else if (routePath.includes('excel') || routePath.includes('krutidev') || routePath.includes('unicode')) {
          newNav = { type: 'useful-tools', subtab: 'excel' };
        } else {
          newNav = { type: 'useful-tools', subtab: '8thpay' };
        }
      } else if (routePath === 'blogs/hub' || routePath === 'blogs-hub') {
        newNav = { type: 'blogs', subtab: 'hub' };
      } else if (routePath === 'blogs/videos' || routePath === 'blogs-videos') {
        newNav = { type: 'blogs', subtab: 'videos' };
      } else if (routePath === 'help' || routePath.startsWith('help') || routePath.startsWith('guide')) {
        const guideSlug = routePath.replace(/^(help|guide)s?\/?/, '').trim();
        newNav = { type: 'help', blogId: guideSlug || undefined };
      } else if (routePath === 'resource-hub' || routePath === 'hub' || routePath === 'teacher-resource-hub') {
        newNav = { type: 'blogs', subtab: 'hub' };
      } else if (routePath === 'legal') {
        newNav = { type: 'legal', subtab: 'privacy' };
      } else if (routePath === 'peeo' || routePath === 'peeo-tools') {
        newNav = { type: 'category', id: 'peeo' };
      } else if (routePath === 'teacher' || routePath === 'teacher-tools') {
        newNav = { type: 'category', id: 'teacher' };
      } else if (routePath === 'work-incharge' || routePath === 'incharge' || routePath === 'incharge-portal') {
        newNav = { type: 'category', id: 'incharge' };
      } else if (routePath === 'quick' || routePath === 'portals') {
        newNav = { type: 'category', id: 'portals' };
      } else if (routePath === 'student') {
        newNav = { type: 'category', id: 'student' };
      } else if (routePath === 'shivira') {
        newNav = { type: 'shivira' };
      } else if (routePath === 'invitation') {
        newNav = { type: 'invitation' };
      } else if (routePath === 'independence-day-invitation-maker' || routePath === 'independence-invitation') {
        newNav = { type: 'invitation', template: 'independence' };
      } else if (routePath === 'mdm') {
        newNav = { type: 'tool', category: 'incharge', subtab: 'mdm' };
      } else if (routePath === 'exam') {
        newNav = { type: 'tool', category: 'incharge', subtab: 'exam' };
      } else if (routePath.includes('/') || routePath.includes('-')) {
        const separator = routePath.includes('/') ? '/' : '-';
        const parts = routePath.split(separator);
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

    window.addEventListener('popstate', handleUrlSync);
    handleUrlSync(); // Run initially on load

    return () => {
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
  const [draggedCardIndex, setDraggedCardIndex] = useState<number | null>(null);
  const [dragOverCardIndex, setDragOverCardIndex] = useState<number | null>(null);
  const [isReorderMode, setIsReorderMode] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Derived visible cards tailored according to user charges & role
  const visibleDashboardCards = React.useMemo(() => {
    // If filterMode is 'all' or charges includes 'all':
    if (filterMode === 'all' || !currentProfile.charges || currentProfile.charges.includes('all')) {
      return dashboardCards.filter(card => !hiddenModules.includes(card.id));
    }

    const allCardsMap = new Map(ALL_AVAILABLE_DASHBOARD_CARDS.map(c => [c.id, c]));
    const allowedCardIds = new Set<string>();

    currentProfile.charges.forEach(charge => {
      const ids = CHARGE_TO_CARD_IDS[charge] || [];
      ids.forEach(id => allowedCardIds.add(id));
    });

    // Always include utility cards
    allowedCardIds.add('blogs');
    allowedCardIds.add('share');

    // Prioritized direct cards matching active charges first
    const prioritized: DashboardCardConfig[] = [];
    currentProfile.charges.forEach(charge => {
      const chargeCardIds = CHARGE_TO_CARD_IDS[charge] || [];
      chargeCardIds.forEach(cardId => {
        if (!hiddenModules.includes(cardId) && !prioritized.some(c => c.id === cardId)) {
          const cardObj = allCardsMap.get(cardId);
          if (cardObj) prioritized.push(cardObj);
        }
      });
    });

    // Then any other cards that are allowed in standard cards order
    dashboardCards.forEach(card => {
      if (allowedCardIds.has(card.id) && !hiddenModules.includes(card.id) && !prioritized.some(c => c.id === card.id)) {
        prioritized.push(card);
      }
    });

    return prioritized.length > 0 ? prioritized : dashboardCards.filter(c => !hiddenModules.includes(c.id));
  }, [dashboardCards, filterMode, currentProfile.charges, hiddenModules]);

  // Card click executor
  const executeCardClick = (card: DashboardCardConfig) => {
    if (isReorderMode) {
      // In reorder mode, prevent navigation so user can drag or tap move controls
      return;
    }
    if (card.id === 'exam-incharge') {
      updateNav({ type: 'tool', category: 'incharge', subtab: 'exam' });
      return;
    }
    if (card.id === 'incharge-mdm') {
      updateNav({ type: 'tool', category: 'incharge', subtab: 'mdm' });
      return;
    }
    if (card.id === 'teacher-pti') {
      updateNav({ type: 'tool', category: 'teacher', subtab: 'pti' });
      return;
    }
    if (card.id === 'peeo-orders') {
      updateNav({ type: 'tool', category: 'peeo', subtab: 'increment' });
      return;
    }
    if (card.id === 'incharge-scholarship') {
      updateNav({ type: 'tool', category: 'incharge', subtab: 'scholarship' });
      return;
    }
    if (card.type === 'school-profile' || card.id === 'school-profile') {
      updateNav({ type: 'school-profile' });
    } else if (card.type === 'useful-tools' || card.id === 'useful-tools') {
      updateNav({ type: 'useful-tools', subtab: (card.subtab as any) || '8thpay' });
    } else if (card.id === 'useful-8thpay') {
      updateNav({ type: 'useful-tools', subtab: '8thpay' });
    } else if (card.id === 'useful-salary') {
      updateNav({ type: 'useful-tools', subtab: 'salary' });
    } else if (card.id === 'useful-excel') {
      updateNav({ type: 'useful-tools', subtab: 'excel' });
    } else if (card.id === 'useful-bonus') {
      updateNav({ type: 'useful-tools', subtab: 'bonus' });
    } else if (card.id === 'useful-rules') {
      updateNav({ type: 'useful-tools', subtab: 'rules' });
    } else if (card.id === 'resource-hub') {
      updateNav({ type: 'blogs', subtab: 'hub' });
    } else if (card.id === 'blogs' || card.type === 'help') {
      updateNav({ type: 'help' });
    } else if (card.type === 'shivira') {
      updateNav({ type: 'shivira' });
    } else if (card.type === 'category' && card.categoryId) {
      updateNav({ type: 'category', id: card.categoryId });
    } else if (card.type === 'tool' && card.toolCat && card.subtab) {
      updateNav({ type: 'tool', category: card.toolCat, subtab: card.subtab as any });
    } else if (card.type === 'invitation') {
      updateNav({ type: 'invitation' });
    } else if (card.type === 'action') {
      if (card.action === 'share') handleShare();
      else if (card.action === 'feedback') onOpenFeedback();
      else if (card.action === 'settings') onOpenSettings();
    }
  };

  // Move card left (-1) or right (+1) in order
  const handleMoveCardByOffset = (cardId: string, direction: -1 | 1) => {
    const curIdx = dashboardCards.findIndex(c => c.id === cardId);
    if (curIdx === -1) return;
    const targetIdx = curIdx + direction;
    if (targetIdx < 0 || targetIdx >= dashboardCards.length) return;

    const newOrder = [...dashboardCards];
    const [moved] = newOrder.splice(curIdx, 1);
    newOrder.splice(targetIdx, 0, moved);

    setDashboardCards(newOrder);
    try {
      const orderIds = newOrder.map(c => c.id);
      localStorage.setItem(CARD_ORDER_STORAGE_KEY, JSON.stringify(orderIds));
      setToastMessage(lang === 'hi' ? 'मॉड्यूल क्रम अपडेट किया गया' : 'Module position updated');
      setTimeout(() => setToastMessage(null), 2500);
    } catch (err) {
      console.error('Failed to save card order', err);
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
      setToastMessage(lang === 'hi' ? 'नया लेआउट क्रम सुरक्षित हो गया' : 'New layout order saved');
      setTimeout(() => setToastMessage(null), 2500);
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
      setToastMessage(lang === 'hi' ? 'डिफ़ॉल्ट क्रम रीसेट कर दिया गया' : 'Order reset to default');
      setTimeout(() => setToastMessage(null), 2500);
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

  const handleLaunchToolById = (toolId: string) => {
    saveRecentToolId(toolId);
    if (toolId.startsWith('useful-')) {
      const sub = toolId.replace('useful-', '');
      updateNav({ type: 'useful-tools', subtab: sub as any });
      return;
    }
    if (['8thpay', 'salary', 'bonus', 'excel', 'rules'].includes(toolId)) {
      updateNav({ type: 'useful-tools', subtab: toolId as any });
      return;
    }
    if (toolId === 'shivira') {
      updateNav({ type: 'shivira' });
      return;
    }
    if (toolId === 'invitation') {
      updateNav({ type: 'invitation' });
      return;
    }
    const matched = ALL_TOOLS.find(t => t.id === toolId);
    if (matched) {
      if (matched.category === 'portals' && matched.subtab.startsWith('useful-')) {
        updateNav({ type: 'useful-tools', subtab: matched.subtab.replace('useful-', '') as any });
      } else {
        updateNav({ type: 'tool', category: matched.category, subtab: matched.subtab as any });
      }
      return;
    }
    if (toolId === 'peeo-orders') {
      updateNav({ type: 'tool', category: 'peeo', subtab: 'notice' as any });
    } else {
      updateNav({ type: 'home' });
    }
  };

  const handleShare = () => {
    const cleanPath = getCleanPathFromNav(nav);
    const shareUrl = `${window.location.origin}${cleanPath}`;
    if (navigator.share) {
      navigator.share({
        title: 'शाला सहायक 2026 - Rajasthan School Helper',
        text: 'PEEO, Teachers, Exam Incharge and Rajasthan School Management Portal App',
        url: shareUrl
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    }
  };

  const goBack = () => {
    if (nav.type === 'useful-tools') {
      if (nav.subtab) {
        updateNav({ type: 'useful-tools' });
      } else {
        updateNav({ type: 'home' });
      }
    } else if (nav.type === 'tool') {
      updateNav({ type: 'category', id: nav.category as any });
    } else {
      updateNav({ type: 'home' });
    }
  };

  // Clean, Minimalistic Top Navigation Header - Consistent across all modules
  const renderTopHeader = (title: string, _activeCategory?: string) => {
    return (
      <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-2 sm:p-2.5 px-2.5 sm:px-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm gap-2">
        
        {/* Action Navigation Buttons */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={goBack}
            className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white transition-all shadow-sm active:scale-95 cursor-pointer"
            title={lang === 'hi' ? 'पीछे जाएं' : 'Go Back'}
            aria-label="Go Back"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <button
            onClick={() => setNav({ type: 'home' })}
            className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-all active:scale-95 cursor-pointer"
            title={lang === 'hi' ? 'मुख्य होम' : 'Home'}
            aria-label="Home"
          >
            <Home className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Current Page Title / Breadcrumb */}
        <div className="flex items-center gap-1 min-w-0 truncate">
          <span className="font-extrabold text-xs sm:text-sm text-slate-800 dark:text-slate-100 truncate">
            {title}
          </span>
        </div>

        {/* Right Action Icons: School Badge & Copy Direct Share Link */}
        <div className="shrink-0 flex items-center space-x-1 sm:space-x-1.5">
          <button
            onClick={() => {
              const cleanPath = getCleanPathFromNav(nav);
              const url = `${window.location.origin}${cleanPath}`;
              navigator.clipboard.writeText(url);
              setCopiedLink(true);
              setTimeout(() => setCopiedLink(false), 2500);
            }}
            className="flex items-center justify-center gap-1 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/40 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800/50 transition-all text-[10px] sm:text-xs font-black active:scale-95 cursor-pointer min-h-[32px] sm:min-h-[36px]"
            title={lang === 'hi' ? 'इस पेज का सीधा लिंक कॉपी करें' : 'Copy direct link to this page'}
          >
            {copiedLink ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="hidden sm:inline">{lang === 'hi' ? 'कॉपी हुआ!' : 'Copied!'}</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{lang === 'hi' ? 'शेयर' : 'Share'}</span>
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
    handleLaunchToolById(toolId);
  };

  const getToolHeaderTitle = (nav: NavLocation, lang: 'hi' | 'en'): string => {
    if (nav.type === 'tool') {
      const matched = ALL_TOOLS.find(t => t.category === nav.category && t.subtab === nav.subtab);
      if (matched) {
        const fullTitle = lang === 'hi' ? matched.titleHindi : matched.title;
        // Clean out redundant bracketed translations to keep mobile headers crisp
        return fullTitle.split('(')[0].trim() || fullTitle;
      }
      if (nav.category === 'incharge') {
        if (nav.subtab === 'udise') return lang === 'hi' ? 'यू-डाइस+' : 'UDISE+';
        if (nav.subtab === 'inspire') return lang === 'hi' ? 'इंस्पायर अवार्ड' : 'Inspire Award';
        if (nav.subtab === 'lado') return lang === 'hi' ? 'लाडो रानी योजना' : 'Lado Scheme';
        if (nav.subtab === 'elc') return lang === 'hi' ? 'इलेक्शन क्लब' : 'ELC Club';
        if (nav.subtab === 'qrcode') return lang === 'hi' ? 'क्यूआर कोड जनरेटर' : 'QR Generator';
        if (nav.subtab === 'dutyroster') return lang === 'hi' ? 'दैनिक स्थानापन्न' : 'Duty Roster';
        if (nav.subtab === 'assembly') return lang === 'hi' ? 'प्रार्थना सभा' : 'Morning Assembly';
      }
      const categoryNames: Record<string, string> = {
        peeo: lang === 'hi' ? 'पीईईओ टूल्स' : 'PEEO Tools',
        teacher: lang === 'hi' ? 'शिक्षक टूल्स' : 'Teacher Tools',
        incharge: lang === 'hi' ? 'प्रभारी टूल्स' : 'Incharge Tools',
        portals: lang === 'hi' ? 'सरकारी पोर्टल्स' : 'Gov Portals',
        student: lang === 'hi' ? 'विद्यार्थी पोर्टल' : 'Student App'
      };
      return categoryNames[nav.category] || 'Module';
    }
    return '';
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
          renderTopHeader(getToolHeaderTitle(nav, lang), nav.category)
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
              onNavigate={updateNav}
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
  } else if (nav.type === 'school-profile') {
    content = (
      <div className="space-y-4 animate-fadeIn">
        <Suspense fallback={<ModuleLoadingFallback />}>
          <SchoolProfileModule
            schoolProfile={schoolProfile}
            onUpdateSchoolProfile={onUpdateSchoolProfile || (() => {})}
            students={students}
            onUpdateStudents={onUpdateStudents}
            teachers={teachers}
            onUpdateTeachers={onUpdateTeachers}
            incharges={incharges}
            onUpdateIncharges={onUpdateIncharges}
            lang={lang}
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
  } else if (nav.type === 'useful-tools') {
    const usefulSubTitles: Record<string, string> = {
      '8thpay': lang === 'hi' ? '8वां वेतन आयोग' : '8th Pay Commission',
      'salary': lang === 'hi' ? 'राजस्थान वेतन (RSR)' : 'Salary Calculator',
      'bonus': lang === 'hi' ? 'दीपावली बोनस' : 'Diwali Bonus',
      'excel': lang === 'hi' ? 'कृतिदेव यूनिकोड' : 'Excel Unicode',
      'rules': lang === 'hi' ? 'नियम व गाइड' : 'Rules Guide'
    };
    const currentTitle = nav.subtab 
      ? usefulSubTitles[nav.subtab] || (lang === 'hi' ? 'उपयोगी टूल्स' : 'Useful Tools')
      : (lang === 'hi' ? 'उपयोगी टूल्स' : 'Useful Tools');

    content = (
      <div className="space-y-3 sm:space-y-4 animate-fadeIn">
        {renderTopHeader(currentTitle, 'useful-tools')}
        <Suspense fallback={<ModuleLoadingFallback />}>
          <SectionUsefulTools
            schoolProfile={schoolProfile}
            lang={lang}
            initialSubTab={nav.subtab || null}
            onBack={goBack}
            onSelectTool={(subtab) => {
              if (subtab) {
                updateNav({ type: 'useful-tools', subtab: subtab as any });
              } else {
                updateNav({ type: 'useful-tools' });
              }
            }}
            onNavigateToGuide={(guideId) => {
              updateNav({ type: 'help', blogId: guideId });
            }}
          />
        </Suspense>
      </div>
    );
  } else if (nav.type === 'category') {
    const catId = nav.id;
    const catTitles: Record<string, string> = {
      peeo: lang === 'hi' ? 'पीईईओ टूल्स' : 'PEEO Tools',
      teacher: lang === 'hi' ? 'शिक्षक टूल्स' : 'Teacher Tools',
      incharge: lang === 'hi' ? 'प्रभारी टूल्स' : 'Incharge Tools',
      portals: lang === 'hi' ? 'सरकारी पोर्टल्स' : 'Gov Portals',
      student: lang === 'hi' ? 'विद्यार्थी कॉर्नर' : 'Student App'
    };

    content = (
      <div className="space-y-3 sm:space-y-4 animate-fadeIn">
        {renderTopHeader(catTitles[catId] || 'Category', catId)}

        {/* Category Header Banner */}
        <div className="p-3 sm:p-4 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-emerald-900 to-slate-900 text-white shadow-md">
          <h3 className="font-black text-sm sm:text-base text-amber-300">
            {catId === 'peeo' && (
              <>
                <span className="sm:hidden">{lang === 'hi' ? 'पीईईओ टूल्स' : 'PEEO Tools'}</span>
                <span className="hidden sm:inline">{lang === 'hi' ? 'पीईईओ / प्रधानाचार्य कार्यालय टूल्स' : 'PEEO & Principal Office Tools'}</span>
              </>
            )}
            {catId === 'teacher' && (
              <>
                <span className="sm:hidden">{lang === 'hi' ? 'शिक्षक टूल्स' : 'Teacher Tools'}</span>
                <span className="hidden sm:inline">{lang === 'hi' ? 'शिक्षक एवं कक्षाध्यापक टूल्स' : 'Class Teacher & Academic Tools'}</span>
              </>
            )}
            {catId === 'incharge' && (
              <>
                <span className="sm:hidden">{lang === 'hi' ? 'प्रभारी टूल्स' : 'Incharge Tools'}</span>
                <span className="hidden sm:inline">{lang === 'hi' ? 'विद्यालय योजना एवं परीक्षा प्रभारी टूल्स' : 'Exam & Scheme Incharge Tools'}</span>
              </>
            )}
            {catId === 'portals' && (
              <>
                <span className="sm:hidden">{lang === 'hi' ? 'सरकारी पोर्टल्स' : 'Gov Portals'}</span>
                <span className="hidden sm:inline">{lang === 'hi' ? 'राजस्थान शिक्षा विभाग डायरेक्ट पोर्टल्स' : 'Rajasthan Education Direct Portals'}</span>
              </>
            )}
            {catId === 'student' && (
              <>
                <span className="sm:hidden">{lang === 'hi' ? 'विद्यार्थी कॉर्नर' : 'Student Corner'}</span>
                <span className="hidden sm:inline">{lang === 'hi' ? 'विद्यार्थी अध्ययन व बोर्ड परीक्षा सहायता' : 'Student Study & Board Exam Corner'}</span>
              </>
            )}
          </h3>
          <p className="hidden sm:block text-xs text-emerald-200 mt-1">
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
                label={lang === 'hi' ? 'शारीरिक शिक्षक' : 'PTI Teacher'}
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
                onClick={() => updateNav({ type: 'tool', category: 'incharge', subtab: 'mdm' })}
                icon="utensils"
                bgTint="bg-amber-50 dark:bg-amber-950/40"
                label={lang === 'hi' ? 'मिड-डे मील' : 'MDM Log'}
                delayIndex={0}
              />

              <ThreeDCard
                onClick={() => updateNav({ type: 'tool', category: 'incharge', subtab: 'exam' })}
                icon="target"
                bgTint="bg-teal-50 dark:bg-teal-950/40"
                label={lang === 'hi' ? 'परीक्षा प्रभारी' : 'Exam Incharge'}
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

              <ThreeDCard
                onClick={() => updateNav({ type: 'tool', category: 'incharge', subtab: 'assembly' })}
                icon="book"
                bgTint="bg-amber-50 dark:bg-amber-950/40"
                label={lang === 'hi' ? 'प्रार्थना सभा प्रभारी' : 'Morning Assembly'}
                delayIndex={7}
              />

              <ThreeDCard
                onClick={() => updateNav({ type: 'tool', category: 'incharge', subtab: 'inspire' })}
                icon="award"
                bgTint="bg-amber-50 dark:bg-amber-950/40"
                label={lang === 'hi' ? 'इंस्पायर अवार्ड प्रभारी' : 'Inspire Award Incharge'}
                delayIndex={8}
              />

              <ThreeDCard
                onClick={() => updateNav({ type: 'tool', category: 'incharge', subtab: 'udise' })}
                icon="chart"
                bgTint="bg-emerald-50 dark:bg-emerald-950/40"
                label={lang === 'hi' ? 'यू-डाइस+ प्रभारी' : 'UDISE+ Incharge'}
                delayIndex={9}
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

        {/* STRUCTURED PERSONALIZED WELCOME & ROLE BOX */}
        <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 text-white rounded-2xl p-3 sm:p-4 shadow-sm border border-emerald-700/40 space-y-3 animate-fadeIn">
          {/* Top Row: Avatar + User Greeting + Role Badge + Edit Role Action */}
          <div className="flex items-center justify-between gap-2.5">
            <div className="flex items-center space-x-2.5 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0 shadow-inner">
                <UserCheck className="w-5 h-5 text-amber-300" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                  <span className="font-black text-sm sm:text-base leading-tight text-white tracking-tight truncate">
                    {lang === 'hi'
                      ? (currentProfile.name ? `नमस्ते, ${currentProfile.name} जी!` : 'नमस्ते, शिक्षक साथी!')
                      : (currentProfile.name ? `Welcome, ${currentProfile.name}!` : 'Welcome, Educator!')}
                  </span>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 shrink-0 shadow-xs">
                    {getRoleLabel(currentProfile.role, lang)}
                  </span>
                </div>
                <p className="text-[11px] text-emerald-200/80 font-medium truncate mt-0.5">
                  {schoolProfile.schoolNameShort || (lang === 'hi' ? 'राजस्थान विद्यालय शिक्षा पोर्टल' : 'Rajasthan School Portal')}
                </p>
              </div>
            </div>

            <button
              onClick={onOpenOnboarding}
              className="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-[11px] sm:text-xs font-bold border border-white/15 flex items-center space-x-1.5 transition-all active:scale-95 cursor-pointer shrink-0"
              title={lang === 'hi' ? 'प्रभार व पद बदलें' : 'Edit role and charges'}
            >
              <Sliders className="w-3.5 h-3.5 text-amber-300" />
              <span>{lang === 'hi' ? 'प्रभार बदलें' : 'Edit Role'}</span>
            </button>
          </div>

          {/* Bottom Row: Active Charges Badges + View Filter Switch */}
          <div className="pt-2.5 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 flex-wrap min-w-0">
              <span className="text-[10px] uppercase tracking-wider text-emerald-300/90 font-black shrink-0">
                {lang === 'hi' ? 'सक्रिय प्रभार:' : 'Active Charges:'}
              </span>
              {currentProfile.charges.map(ch => (
                <span key={ch} className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-800/80 text-emerald-100 border border-emerald-600/40 shrink-0">
                  {getChargeLabel(ch, lang)}
                </span>
              ))}
            </div>

            {!currentProfile.charges.includes('all') && (
              <div className="flex items-center p-0.5 bg-slate-950/60 rounded-xl border border-white/10 shrink-0 self-start sm:self-auto">
                <button
                  onClick={() => handleFilterModeChange('charges')}
                  className={`px-2.5 py-1 rounded-lg text-[10px] sm:text-[11px] font-black transition-all flex items-center gap-1 cursor-pointer ${
                    filterMode === 'charges'
                      ? 'bg-amber-400 text-slate-950 shadow-xs'
                      : 'text-emerald-200 hover:text-white'
                  }`}
                >
                  <Sparkles className="w-3 h-3" />
                  <span>{lang === 'hi' ? 'प्रभार अनुसार' : 'Tailored'}</span>
                </button>
                <button
                  onClick={() => handleFilterModeChange('all')}
                  className={`px-2.5 py-1 rounded-lg text-[10px] sm:text-[11px] font-black transition-all flex items-center gap-1 cursor-pointer ${
                    filterMode === 'all'
                      ? 'bg-amber-400 text-slate-950 shadow-xs'
                      : 'text-emerald-200 hover:text-white'
                  }`}
                >
                  <span>{lang === 'hi' ? 'सभी टूल्स' : 'All'}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* TOP FAVORITES & RECENT TOOLS SECTION (PINNED CALCULATORS) */}
        <FavoritesAndRecentTools
          pinnedToolIds={pinnedToolIds}
          onTogglePin={handleTogglePin}
          onSelectTool={handleLaunchToolById}
          lang={lang}
        />

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


        {/* MOBILE SOCIAL MEDIA BAR BELOW QUICK TOOLS */}
        <div className="md:hidden my-3">
          <SocialHeaderBar />
        </div>

        {/* MAIN CATEGORIES - REORDERABLE SQUARE ICON CARDS GRID */}
        <div className="space-y-3">
          {/* DRAG AND DROP & REORDER CONTROL BAR */}
          <div className="flex items-center justify-between px-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2.5 rounded-2xl shadow-xs">
            <div className="flex items-center space-x-2">
              <div className={`p-1.5 rounded-xl ${isReorderMode ? 'bg-amber-500 text-slate-950 animate-bounce' : 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300'}`}>
                <GripVertical className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                  <span>{lang === 'hi' ? 'मुख्य स्क्रीन लेआउट क्रम' : 'Main Screen Layout Order'}</span>
                  {isCustomCardOrder && (
                    <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300">
                      {lang === 'hi' ? 'कस्टम' : 'Custom'}
                    </span>
                  )}
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {isReorderMode
                    ? (lang === 'hi' ? 'मॉड्यूल को ड्रैग करें या एरो बटन पर टैप करें' : 'Drag modules or tap arrow buttons to move')
                    : (lang === 'hi' ? 'सुविधाजनक प्रयोग हेतु अपने मुख्य टूल्स प्राथमिकता दें' : 'Prioritize your most used tools on top')}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-1.5 shrink-0">
              {isCustomCardOrder && (
                <button
                  onClick={handleResetCardOrder}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-600 hover:text-rose-600 dark:text-slate-300 dark:hover:text-rose-300 text-[11px] font-bold border border-slate-200 dark:border-slate-700 transition-all flex items-center space-x-1 cursor-pointer"
                  title="क्रम रीसेट करें"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span className="hidden sm:inline">{lang === 'hi' ? 'रीसेट' : 'Reset'}</span>
                </button>
              )}

              <button
                onClick={() => setIsReorderMode(!isReorderMode)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center space-x-1.5 transition-all shadow-xs cursor-pointer active:scale-95 ${
                  isReorderMode
                    ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 border border-amber-500 ring-2 ring-amber-400/30'
                    : 'bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                }`}
              >
                {isReorderMode ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>{lang === 'hi' ? 'संपन्न (Done)' : 'Done'}</span>
                  </>
                ) : (
                  <>
                    <Sliders className="w-3.5 h-3.5" />
                    <span>{lang === 'hi' ? 'क्रम बदलें' : 'Reorder'}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Toast Notification Banner */}
          {toastMessage && (
            <div className="p-2.5 rounded-2xl bg-emerald-600 text-white font-extrabold text-xs text-center shadow-lg animate-fadeIn flex items-center justify-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>{toastMessage}</span>
            </div>
          )}

          {/* Reorder Active Guidance Banner */}
          {isReorderMode && (
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-400/40 text-amber-900 dark:text-amber-200 text-xs font-semibold flex items-center justify-between animate-fadeIn">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                <span>
                  {lang === 'hi'
                    ? 'पुनर्क्रमीकरण मोड सक्रिय: आइकॉन ड्रैग करें या कार्ड्स पर < > एरो दबाकर आगे-पीछे सेट करें।'
                    : 'Reordering Mode Active: Drag icons or tap < > arrows on cards to set custom order.'}
                </span>
              </span>
              <button
                onClick={() => setIsReorderMode(false)}
                className="px-2.5 py-1 rounded-lg bg-amber-400 text-slate-950 font-extrabold text-[11px] shrink-0 hover:bg-amber-300 transition-colors cursor-pointer"
              >
                {lang === 'hi' ? 'सेव करें' : 'Save'}
              </button>
            </div>
          )}

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

              const cardFullIndex = dashboardCards.findIndex(c => c.id === card.id);
              const canMoveLeft = cardFullIndex > 0;
              const canMoveRight = cardFullIndex < dashboardCards.length - 1;

              return (
                <div key={card.id} data-card-index={index} className="relative">
                  <ThreeDCard
                    onClick={() => executeCardClick(card)}
                    icon={cardIcon}
                    bgTint={card.bgTint}
                    label={label}
                    ariaLabel={ariaLabel}
                    description={description}
                    draggable={true}
                    onDragStart={(e) => handleCardDragStart(e, cardFullIndex)}
                    onDragOver={(e) => handleCardDragOver(e, cardFullIndex)}
                    onDrop={(e) => handleCardDrop(e, cardFullIndex)}
                    onDragEnd={handleCardDragEnd}
                    isDragging={draggedCardIndex === cardFullIndex}
                    isDragOver={dragOverCardIndex === cardFullIndex}
                    delayIndex={index}
                    isReorderMode={isReorderMode}
                    canMoveLeft={canMoveLeft}
                    canMoveRight={canMoveRight}
                    onMoveLeft={() => handleMoveCardByOffset(card.id, -1)}
                    onMoveRight={() => handleMoveCardByOffset(card.id, 1)}
                  />
                </div>
              );
            })}
          </div>

          {/* Tailored Mode Quick Info & Expand */}
          {filterMode === 'charges' && !currentProfile.charges.includes('all') && (
            <div className="p-2.5 sm:p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-emerald-900 dark:text-emerald-200">
              <div className="flex items-center gap-2 font-bold text-[11px]">
                <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>
                  {lang === 'hi'
                    ? `आपके चयनित प्रभार अनुसार ${visibleDashboardCards.length} मुख्य मॉड्यूल प्राथमिकता से प्रदर्शित हैं।`
                    : `Displaying ${visibleDashboardCards.length} modules tailored to your active role and charges.`}
                </span>
              </div>
              <button
                onClick={() => handleFilterModeChange('all')}
                className="text-[11px] font-extrabold text-emerald-700 dark:text-emerald-300 hover:underline cursor-pointer shrink-0 self-end sm:self-auto"
              >
                {lang === 'hi' ? 'सभी 14+ टूल्स देखें →' : 'View All 14+ Tools →'}
              </button>
            </div>
          )}

          {/* LATEST GOVERNMENT ORDERS SECTION (SEARCH-GROUNDED VIA GEMINI & GOOGLE SEARCH) */}
          <LatestGovOrdersSection
            lang={lang}
            onNavigateToTool={(subtab) => {
              updateNav({ type: 'useful-tools', subtab: subtab as any });
            }}
          />

          {/* HELP & GUIDES SECTION - HIGH QUALITY TEXT CONTENT & INTERLINKED TO TOOLS */}
          <HelpGuidesDashboardSection
            lang={lang}
            onOpenGuide={(guideId) => {
              updateNav({ type: 'help', blogId: guideId });
            }}
            onViewAllGuides={() => {
              updateNav({ type: 'help' });
            }}
            onNavigateToTool={handleNavigateToToolFromHelp}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="relative pb-24 md:pb-8">
      <SeoManager
        currentView={
          nav.type === 'invitation' && nav.template === 'independence'
            ? 'independence-invitation'
            : nav.type === 'shivira'
            ? 'shivira'
            : nav.type === 'help'
            ? 'help'
            : nav.type === 'useful-tools'
            ? (nav.subtab ? `useful-tools/${nav.subtab}` : 'useful-tools')
            : nav.type === 'invitation'
            ? 'invitation'
            : nav.type
        }
        category={nav.type === 'category' ? nav.id : nav.type === 'tool' ? nav.category : undefined}
        activeToolId={
          nav.type === 'tool'
            ? `${nav.category}-${nav.subtab}`
            : nav.type === 'useful-tools'
            ? nav.subtab
            : undefined
        }
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
    </div>
  );
};
