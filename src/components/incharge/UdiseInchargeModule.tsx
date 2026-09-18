import React, { useState } from 'react';
import { 
  FileCheck, 
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
  BookOpen, 
  UserCheck, 
  Building2, 
  Users, 
  GraduationCap, 
  Copy, 
  HelpCircle, 
  X, 
  Check, 
  AlertCircle,
  Video,
  ListOrdered
} from 'lucide-react';
import { SchoolProfile, Teacher, StudentResult } from '../../types';
import { ThreeDIcon, ThreeDCard } from '../ThreeDIcon';

interface UdiseInchargeModuleProps {
  schoolProfile: SchoolProfile;
  teachers?: Teacher[];
  students?: StudentResult[];
  lang: 'en' | 'hi';
  onBack: () => void;
  onNavigateToBlog?: (blogId: string) => void;
}

export const UdiseInchargeModule: React.FC<UdiseInchargeModuleProps> = ({
  schoolProfile,
  teachers = [],
  students = [],
  lang,
  onBack,
  onNavigateToBlog
}) => {
  const isHi = lang === 'hi';
  
  // Active Main Category Tab under UDISE (null = Overview Dashboard page)
  type UdiseSubTab = 'teacher' | 'school' | 'student' | 'formats' | 'report' | 'help';
  const [activeTab, setActiveTab] = useState<UdiseSubTab | null>(null);

  // Sync state with URL Path
  React.useEffect(() => {
    const syncPathToTab = () => {
      const path = window.location.pathname.toLowerCase();
      if (path.includes('udise')) {
        if (path.includes('teacher')) setActiveTab('teacher');
        else if (path.includes('school')) setActiveTab('school');
        else if (path.includes('student')) setActiveTab('student');
        else if (path.includes('format')) setActiveTab('formats');
        else if (path.includes('report') || path.includes('certificate')) setActiveTab('report');
        else if (path.includes('help')) setActiveTab('help');
        else setActiveTab(null);
      }
    };

    syncPathToTab();
    window.addEventListener('popstate', syncPathToTab);
    return () => window.removeEventListener('popstate', syncPathToTab);
  }, []);

  const navigateToSubTab = (tab: UdiseSubTab | null) => {
    setActiveTab(tab);
    const newPath = tab ? `/incharge-portal/udise/${tab}` : `/incharge-udise`;
    if (window.location.pathname !== newPath) {
      window.history.pushState(null, '', newPath);
    }
  };

  // YouTube Modal State
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [activeVideoUrl, setActiveVideoUrl] = useState('');
  const [activeVideoTitle, setActiveVideoTitle] = useState('');

  // Report Maker Modal / View State
  const [showReportMaker, setShowReportMaker] = useState(false);
  const [reportModuleType, setReportModuleType] = useState<'teacher' | 'school' | 'student'>('teacher');
  const [reportStep, setReportStep] = useState<'make' | 'preview'>('make');
  const [certificateOption, setCertificateOption] = useState<'inchargeToPrincipal' | 'principalToOfficer'>('inchargeToPrincipal');

  // Report Form State
  const [reportSchoolName, setReportSchoolName] = useState(schoolProfile.schoolNameHindi || schoolProfile.schoolName || 'राउमावि जयपुर');
  const [reportUdiseCode, setReportUdiseCode] = useState(schoolProfile.udiseCode || '08120100101');
  const [reportBlock, setReportBlock] = useState(schoolProfile.block || 'जयपुर नगर');
  const [reportDistrict, setReportDistrict] = useState(schoolProfile.district || 'जयपुर');
  const [reportAcademicYear, setReportAcademicYear] = useState('2026-27');
  const [reportDispatchNo, setReportDispatchNo] = useState(`UDISE/2026/${Math.floor(1000 + Math.random() * 9000)}`);
  const [reportDate, setReportDate] = useState(new Date().toISOString().split('T')[0]);
  const [reportInchargeName, setReportInchargeName] = useState('अनिल कुमार मीणा (यू-डाइस प्रभारी)');
  const [reportPrincipalName, setReportPrincipalName] = useState('रामप्रसाद शर्मा (प्रधानाचार्य)');

  // Module Counts State for Teacher Report
  const [totalTeachersCount, setTotalTeachersCount] = useState<number>(teachers.length || 14);
  const [updatedTeachersCount, setUpdatedTeachersCount] = useState<number>(teachers.length || 14);
  const [notUpdatedTeachersCount, setNotUpdatedTeachersCount] = useState<number>(0);

  // Module Counts for School Profile Report
  const [totalProfileSections, setTotalProfileSections] = useState<number>(12);
  const [completedProfileSections, setCompletedProfileSections] = useState<number>(12);
  const [pendingProfileSections, setPendingProfileSections] = useState<number>(0);

  // Module Counts for Student Profile Report
  const [totalStudentsCount, setTotalStudentsCount] = useState<number>(students.length || 240);
  const [newAdmittedCount, setNewAdmittedCount] = useState<number>(38);
  const [studentsLeftCount, setStudentsLeftCount] = useState<number>(6);
  const [apaarGeneratedCount, setApaarGeneratedCount] = useState<number>(234);
  const [studentProfileCompletedCount, setStudentProfileCompletedCount] = useState<number>(240);

  // Copy Feedback state for formats
  const [copiedFormatIdx, setCopiedFormatIdx] = useState<number | null>(null);

  const openVideo = (url: string, title: string) => {
    setActiveVideoUrl(url);
    setActiveVideoTitle(title);
    setShowVideoModal(true);
  };

  const openReportInNewPage = () => {
    const printWin = window.open('', '_blank');
    if (!printWin) return;
    const certTitle = certificateOption === 'inchargeToPrincipal'
      ? 'यू-डाइस+ डेटा प्रविष्टि पूर्णता प्रमाण पत्र (प्रभारी द्वारा प्रस्तुत)'
      : 'यू-डाइस+ डेटा प्रविष्टि पूर्णता प्रमाण पत्र (प्रधानाचार्य द्वारा उच्च अधिकारियों को सम्प्रेषित)';
    const content = `<!DOCTYPE html>
<html lang="hi">
<head>
  <meta charset="UTF-8">
  <title>${reportSchoolName} - UDISE+ ${reportModuleType === 'teacher' ? 'शिक्षक' : reportModuleType === 'school' ? 'स्कूल' : 'छात्र'} रिपोर्ट प्रपत्र</title>
  <style>
    @page { size: A4 portrait; margin: 15mm; }
    body { font-family: 'Mukta', 'Noto Sans Devanagari', 'Segoe UI', sans-serif; color: #000; margin: 0; padding: 24px; line-height: 1.6; background: #f8fafc; }
    .page-card { background: #ffffff; border: 2px solid #0f172a; border-radius: 12px; padding: 32px; max-width: 800px; margin: 0 auto; box-shadow: 0 10px 25px rgba(0,0,0,0.1); }
    .header { text-align: center; border-bottom: 2px solid #0f172a; padding-bottom: 16px; margin-bottom: 20px; }
    .header h1 { margin: 0; font-size: 22px; font-weight: 800; text-transform: uppercase; color: #0f172a; }
    .header p { margin: 6px 0 0 0; font-size: 13px; font-weight: 700; color: #334155; }
    .badge { display: inline-block; margin-top: 8px; padding: 4px 12px; background: #e2e8f0; border-radius: 20px; font-size: 12px; font-weight: 800; color: #0f172a; }
    .meta-row { display: flex; justify-content: space-between; font-size: 13px; font-weight: bold; margin-bottom: 20px; border-bottom: 1px solid #cbd5e1; padding-bottom: 10px; }
    .subject { font-size: 14px; font-weight: bold; margin-bottom: 20px; line-height: 1.6; }
    .body-text { font-size: 13.5px; text-align: justify; margin-bottom: 32px; line-height: 1.8; }
    .sign-table { width: 100%; margin-top: 50px; }
    .sign-table td { width: 50%; text-align: center; vertical-align: bottom; font-weight: bold; font-size: 13px; }
    .btn-bar { text-align: center; margin-bottom: 24px; }
    .print-btn { background: #059669; color: white; padding: 12px 24px; font-size: 14px; font-weight: bold; border: none; border-radius: 8px; cursor: pointer; box-shadow: 0 4px 12px rgba(5,150,105,0.3); }
    .print-btn:hover { background: #047857; }
    @media print { .btn-bar { display: none; } body { padding: 0; background: #fff; } .page-card { border: none; box-shadow: none; padding: 0; } }
  </style>
</head>
<body>
  <div class="btn-bar">
    <button class="print-btn" onclick="window.print()">🖨️ रिपोर्ट प्रिंट / पीडीएफ डाउनलोड करें (A4 Print)</button>
  </div>
  <div class="page-card">
    <div class="header">
      <h1>${reportSchoolName}</h1>
      <p>यू-डाइस कोड: ${reportUdiseCode} | ब्लॉक: ${reportBlock} | जिला: ${reportDistrict}</p>
      <div class="badge">${certTitle}</div>
    </div>
    <div class="meta-row">
      <span>क्रमांक: ${reportDispatchNo}</span>
      <span>दिनांक: ${reportDate}</span>
    </div>
    <div class="subject">
      <strong>${certificateOption === 'inchargeToPrincipal' ? 'सेवा में, श्रीमान प्रधानाचार्य / संस्थाप्रधान महोदय,' : 'सेवा में, श्रीमान मुख्य ब्लॉक शिक्षा अधिकारी (CBEO),'}</strong><br/><br/>
      <strong>विषय:</strong> सत्र ${reportAcademicYear} हेतु यू-डाइस+ (${reportModuleType === 'teacher' ? 'शिक्षक मॉड्यूल' : reportModuleType === 'school' ? 'स्कूल प्रोफाइल' : 'छात्र प्रोफाइल व APAAR ID'}) डेटा ऑनलाइन प्रविष्टि पूर्णता बाबत।
    </div>
    <div class="body-text">
      महोदय,<br/><br/>
      प्रमाणित किया जाता है कि हमारे विद्यालय ${reportSchoolName} (यू-डाइस: ${reportUdiseCode}) के
      ${reportModuleType === 'teacher' ? ` समस्त ${totalTeachersCount} पदस्थापित शिक्षकों का प्रोफाइल डेटा, आधार प्रमाणीकरण एवं राष्ट्रीय शिक्षक कोड की प्रविष्टि यू-डाइस+ पोर्टल पर 100% पूर्ण कर ली गई है।` : ''}
      ${reportModuleType === 'school' ? ` भौतिक संसाधन, भवन स्थिति, पेयजल, शौचालय, बिजली एवं स्मार्ट क्लास इंफ्रास्ट्रक्चर की समस्त 12 श्रेणियों की प्रविष्टि पूर्ण कर ली गई है।` : ''}
      ${reportModuleType === 'student' ? ` कुल ${totalStudentsCount} नामांकित विद्यार्थियों (नवागत: ${newAdmittedCount}, APAAR ID: ${apaarGeneratedCount}) की प्रविष्टि यू-डाइस+ पोर्टल पर पूर्ण कर ली गई है।` : ''}
      <br/><br/>
      उक्त प्रविष्टि विभागीय मानकों एवं वास्तविक अभिलेखों के अनुसार पूर्णतः सत्य व प्रमाणित है।
    </div>
    <table class="sign-table">
      <tr>
        <td>
          ____________________<br/>
          ${reportInchargeName}<br/>
          <span style="font-size:11px; color:#475569;">यू-डाइस+ प्रभारी</span>
        </td>
        <td>
          ____________________<br/>
          ${reportPrincipalName}<br/>
          <span style="font-size:11px; color:#475569;">हस्ताक्षर एवं मुहर संस्थाप्रधान</span>
        </td>
      </tr>
    </table>
  </div>
</body>
</html>`;
    printWin.document.write(content);
    printWin.document.close();
  };

  const handleOpenReportMaker = (moduleType: 'teacher' | 'school' | 'student') => {
    setReportModuleType(moduleType);
    setReportStep('make');
    setShowReportMaker(true);
    navigateToSubTab('report');
  };

  const copyToClipboard = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedFormatIdx(idx);
    setTimeout(() => setCopiedFormatIdx(null), 2000);
  };

  return (
    <div className="space-y-5 animate-fadeIn pb-12">
      {/* ---------------- OVERVIEW DASHBOARD PAGE (When activeTab === null) ---------------- */}
      {activeTab === null && (
        <>
          {/* Top Banner Header */}
          <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-950 rounded-3xl p-5 text-white shadow-xl border border-emerald-700/60 relative overflow-hidden">
            <div className="absolute right-3 top-3 opacity-10 pointer-events-none">
              <FileCheck className="w-48 h-48 text-emerald-200" />
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
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 p-2 flex items-center justify-center shadow-lg border border-emerald-300/40 shrink-0">
                  <FileCheck className="w-7 h-7 text-slate-950" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-200 text-[11px] font-black border border-emerald-400/30">
                      UDISE+ Ministry of Education Govt of India
                    </span>
                    <span className="text-xs text-emerald-200/80 font-medium">Session 2026-27</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-0.5">
                    {isHi ? 'यू-डाइस+ (UDISE+) प्रभारी पोर्टल' : 'UDISE+ Incharge Portal'}
                  </h2>
                  <p className="text-xs text-emerald-100/90 font-medium max-w-xl">
                    {isHi 
                      ? 'शिक्षक मॉड्यूल, विद्यालय प्रोफाइल, छात्र मॉड्यूल (नवागत/लेफ्ट/APAAR), आधिकारिक फॉरमेट्स व रिपोर्ट जनरेटर।' 
                      : 'Teacher Profile, School Infrastructure, Student APAAR Profile, Formats & Certificate Generators.'}
                  </p>
                </div>
              </div>

              <a
                href="https://udiseplus.gov.in/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-lg transition-all transform active:scale-95 shrink-0 cursor-pointer"
              >
                <span>{isHi ? 'UDISE+ पोर्टल खोलें' : 'Open UDISE+ Portal'}</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            {/* Quick Tabs Grid Banner */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-5 pt-4 border-t border-emerald-700/50">
              <div className="bg-emerald-950/60 p-2.5 rounded-2xl border border-emerald-700/40 text-center">
                <span className="text-[10px] text-emerald-300/90 font-bold block">{isHi ? 'यू-डाइस कोड' : 'UDISE Code'}</span>
                <span className="text-sm font-black text-amber-300 font-mono">{schoolProfile.udiseCode || '08120100101'}</span>
              </div>
              <div className="bg-emerald-950/60 p-2.5 rounded-2xl border border-emerald-700/40 text-center">
                <span className="text-[10px] text-emerald-300/90 font-bold block">{isHi ? 'शिक्षक संख्या' : 'Teachers Count'}</span>
                <span className="text-sm font-black text-white">{totalTeachersCount}</span>
              </div>
              <div className="bg-emerald-950/60 p-2.5 rounded-2xl border border-emerald-700/40 text-center">
                <span className="text-[10px] text-emerald-300/90 font-bold block">{isHi ? 'छात्र नामांकन' : 'Student Enrollment'}</span>
                <span className="text-sm font-black text-emerald-300">{totalStudentsCount}</span>
              </div>
              <div className="bg-emerald-950/60 p-2.5 rounded-2xl border border-emerald-700/40 text-center">
                <span className="text-[10px] text-emerald-300/90 font-bold block">{isHi ? 'अपार (APAAR) जनरेटेड' : 'APAAR Generated'}</span>
                <span className="text-sm font-black text-amber-200">{apaarGeneratedCount}</span>
              </div>
            </div>
          </div>

          {/* 3D Icon Modules Grid Section */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-md border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <ThreeDIcon name="calculator" size={28} />
                <div>
                  <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight">
                    {isHi ? 'यू-डाइस+ (UDISE+) मुख्य कार्य प्रभाग (3D Modules)' : 'UDISE+ Key Working Modules'}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    {isHi ? 'वांछित मॉड्यूल पर क्लिक करके नया पेज खोलें व प्रविष्टि/रिपोर्ट जनरेट करें' : 'Click any module below to open its dedicated page'}
                  </p>
                </div>
              </div>
              <span className="hidden sm:inline-flex px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-black border border-emerald-200 dark:border-emerald-800">
                {isHi ? 'सत्र 2026-27 लाइव' : 'Session 2026-27 Live'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 pt-2">
              <ThreeDCard
                onClick={() => navigateToSubTab('teacher')}
                icon="users"
                bgTint="bg-emerald-50 dark:bg-emerald-950/40"
                label={isHi ? '1. शिक्षक प्रोफाइल' : '1. Teacher Module'}
                badge={`${totalTeachersCount}`}
              />
              <ThreeDCard
                onClick={() => navigateToSubTab('school')}
                icon="building"
                bgTint="bg-blue-50 dark:bg-blue-950/40"
                label={isHi ? '2. स्कूल प्रोफाइल (DCF)' : '2. School Facilities'}
                badge="DCF 2026"
              />
              <ThreeDCard
                onClick={() => navigateToSubTab('student')}
                icon="graduation"
                bgTint="bg-purple-50 dark:bg-purple-950/40"
                label={isHi ? '3. छात्र व APAAR ID' : '3. Student & APAAR'}
                badge="APAAR"
              />
              <ThreeDCard
                onClick={() => navigateToSubTab('formats')}
                icon="book"
                bgTint="bg-teal-50 dark:bg-teal-950/40"
                label={isHi ? '4. विविध प्रपत्र (PDF)' : '4. Formats'}
                badge="Worksheets"
              />
              <ThreeDCard
                onClick={() => handleOpenReportMaker('teacher')}
                icon="award"
                bgTint="bg-amber-50 dark:bg-amber-950/40"
                label={isHi ? '5. रिपोर्ट व प्रमाण पत्र' : '5. Report Generator'}
                badge="A4 Certificate"
              />
              <ThreeDCard
                onClick={() => navigateToSubTab('help')}
                icon="sparkles"
                bgTint="bg-rose-50 dark:bg-rose-950/40"
                label={isHi ? '6. सहायता व गाइड' : '6. Help & Videos'}
                badge="Tutorials"
              />
            </div>
          </div>

          {/* UDISE Overview Info & Direct Portal Guidelines */}
          <div className="bg-gradient-to-br from-slate-900 to-emerald-950 rounded-3xl p-5 text-white shadow-md border border-slate-800 space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <Sparkles className="w-6 h-6 text-emerald-400" />
              <div>
                <h3 className="text-sm font-extrabold text-emerald-300 uppercase tracking-wide">
                  {isHi ? 'यू-डाइस+ (UDISE+) सत्र 2026-27 आवश्यक दिशा-निर्देश' : 'UDISE+ Session 2026-27 Official Guidelines'}
                </h3>
                <p className="text-xs text-slate-400">
                  {isHi ? 'स्कूल प्रोफाइल, शिक्षक मॉड्यूल एवं छात्र अपार आईडी संबंधित मुख्य तिथियां' : 'Key deadlines & instructions for UDISE+ entry'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800 space-y-1">
                <span className="font-black text-emerald-400 block">1. शिक्षक डेटा प्रमाणीकरण</span>
                <p className="text-slate-300">शिक्षकों के आधार नाम, जन्म तिथि व मोबाइल नंबर का यू-डाइस पोर्टल पर 100% सत्यापन सुनिश्चित करें।</p>
              </div>
              <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800 space-y-1">
                <span className="font-black text-blue-400 block">2. स्कूल प्रोफाइल DCF अपडेशन</span>
                <p className="text-slate-300">भौतिक संसाधन, शौचालय, पेयजल, कंप्यूटर लैब, खेल मैदान व वित्तीय सहायता विवरण भरें।</p>
              </div>
              <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800 space-y-1">
                <span className="font-black text-amber-400 block">3. APAAR ID जनरेशन</span>
                <p className="text-slate-300">विद्यार्थी मॉड्यूल में सभी नामांकित छात्रों का प्रोफाइल अपडेट कर APAAR ID जनरेट करें।</p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ---------------- DEDICATED SUB-MODULE PAGE VIEW (When activeTab !== null) ---------------- */}
      {activeTab !== null && (
        <div className="space-y-4 animate-fadeIn">
          {/* Dedicated Sub-Module Navigation Header */}
          <div className="bg-slate-100 dark:bg-slate-800/90 p-3.5 rounded-3xl border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigateToSubTab(null)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 hover:text-emerald-700 text-xs font-black shadow-sm border border-slate-200 dark:border-slate-700 transition-all cursor-pointer active:scale-95 shrink-0"
              >
                <ArrowLeft className="w-4 h-4 text-emerald-600" />
                <span>{isHi ? '← यू-डाइस मुख्य डैशबोर्ड' : '← Back to UDISE Overview'}</span>
              </button>

              <div className="flex items-center gap-2">
                <ThreeDIcon 
                  name={
                    activeTab === 'teacher' ? 'users' :
                    activeTab === 'school' ? 'building' :
                    activeTab === 'student' ? 'graduation' :
                    activeTab === 'formats' ? 'book' :
                    activeTab === 'report' ? 'award' : 'sparkles'
                  } 
                  size={22} 
                />
                <div>
                  <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 leading-tight">
                    {activeTab === 'teacher' && (isHi ? '1. शिक्षक प्रोफाइल मॉड्यूल' : '1. Teacher Profile Module')}
                    {activeTab === 'school' && (isHi ? '2. स्कूल प्रोफाइल DCF' : '2. School Facilities DCF')}
                    {activeTab === 'student' && (isHi ? '3. छात्र प्रोफाइल व APAAR ID' : '3. Student & APAAR Profile')}
                    {activeTab === 'formats' && (isHi ? '4. विविध डाउनलोड प्रपत्र' : '4. Official PDF Formats')}
                    {activeTab === 'report' && (isHi ? '5. रिपोर्ट व प्रमाणीकरण पत्र' : '5. Report & Certificate Generator')}
                    {activeTab === 'help' && (isHi ? '6. सहायता व गाइड वीडियो' : '6. Help & Videos')}
                  </h3>
                  <p className="text-[10px] text-slate-500 font-bold">
                    UDISE+ Incharge Portal • Session 2026-27
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Sub-Module Switcher Pills */}
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
              {[
                { id: 'teacher', labelHi: '1. शिक्षक', labelEn: '1. Teacher', icon3D: 'users' },
                { id: 'school', labelHi: '2. स्कूल', labelEn: '2. School', icon3D: 'building' },
                { id: 'student', labelHi: '3. छात्र/APAAR', labelEn: '3. Student', icon3D: 'graduation' },
                { id: 'formats', labelHi: '4. प्रपत्र', labelEn: '4. Formats', icon3D: 'book' },
                { id: 'report', labelHi: '5. रिपोर्ट पत्र', labelEn: '5. Report', icon3D: 'award' },
                { id: 'help', labelHi: '6. सहायता', labelEn: '6. Help', icon3D: 'sparkles' },
              ].map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => navigateToSubTab(tab.id as UdiseSubTab)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all shrink-0 cursor-pointer ${
                      isActive
                        ? 'bg-emerald-700 text-white shadow-md'
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

      {/* SUB-MODULE 1: TEACHER MODULE */}
      {activeTab === 'teacher' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-md border border-slate-200 dark:border-slate-800 space-y-5 animate-fadeIn">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-600" />
                <span>{isHi ? 'UDISE+ शिक्षक मॉड्यूल (Teacher Module)' : 'UDISE+ Teacher Module Hub'}</span>
              </h3>
              <p className="text-xs text-slate-500">
                {isHi ? 'समस्त पदस्थापित शिक्षकों का प्रोफाइल अपडेशन, आधार प्रमाणीकरण एवं रिपोर्ट पत्र जनरेटर' : 'Manage teacher profiles, Aadhaar status & generate completion certificates'}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {/* 3D Icon Youtube Tutorial Button */}
              <button
                onClick={() => openVideo('https://www.youtube.com/embed/dQw4w9WgXcQ', isHi ? 'यू-डाइस शिक्षक प्रोफाइल अपडेट कैसे करें?' : 'How to update UDISE Teacher Profile')}
                className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-red-600 hover:bg-red-700 text-white text-xs font-black shadow-md transition-all cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>{isHi ? 'यूट्यूब ट्यूटोरियल' : 'YouTube Tutorial'}</span>
              </button>

              {/* Report Generator Button */}
              <button
                onClick={() => handleOpenReportMaker('teacher')}
                className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black shadow-md transition-all cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>{isHi ? 'रिपोर्ट व प्रमाणीकरण पत्र जनरेटर' : 'Report Generator'}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="text-xs text-slate-500 font-bold block">{isHi ? 'कुल पदस्थापित शिक्षक' : 'Total Teachers'}</span>
              <span className="text-2xl font-black text-slate-800 dark:text-slate-100">{totalTeachersCount}</span>
            </div>
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
              <span className="text-xs text-emerald-800 dark:text-emerald-300 font-bold block">{isHi ? 'प्रोफाइल अपडेटेड (Completed)' : 'Profiles Updated'}</span>
              <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{updatedTeachersCount}</span>
            </div>
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800">
              <span className="text-xs text-rose-800 dark:text-rose-300 font-bold block">{isHi ? 'अपडेट हेतु शेष (Not Updated)' : 'Pending Update'}</span>
              <span className="text-2xl font-black text-rose-600 dark:text-rose-400">{notUpdatedTeachersCount}</span>
            </div>
          </div>

          {/* Quick Guidance Box */}
          <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs space-y-2">
            <h4 className="font-bold text-amber-900 dark:text-amber-200 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>शिक्षक मॉड्यूल प्रविष्टि हेतु महत्वपूर्ण बिंदु:</span>
            </h4>
            <ul className="list-disc pl-5 text-slate-700 dark:text-slate-300 space-y-1">
              <li>नवागत स्थानान्तरित / पदोन्नत शिक्षकों को नेशनल कोड (National Code) की मदद से इम्पोर्ट करें।</li>
              <li>कार्यमुक्त (Relieved) हुए शिक्षकों को 'Mark Active/Inactive' से ड्रॉपबॉक्स में ट्रांसफर करें।</li>
              <li>समस्त शिक्षकों का आधार नाम एवं जन्म तिथि यू-डाइस प्रोफाइल में आधार कार्ड अनुसार समान होनी चाहिए।</li>
            </ul>
          </div>
        </div>
      )}

      {/* SUB-MODULE 2: SCHOOL PROFILE */}
      {activeTab === 'school' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-md border border-slate-200 dark:border-slate-800 space-y-5 animate-fadeIn">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-600" />
                <span>{isHi ? 'UDISE+ स्कूल प्रोफाइल एवं भौतिक संसाधन (School Profile)' : 'UDISE+ School Profile Module'}</span>
              </h3>
              <p className="text-xs text-slate-500">
                {isHi ? 'विद्यालय मूलभूत जानकारी, भवन, शौचालय, पेयजल, बिजली, स्मार्ट क्लास व खेलकूद संसाधन' : 'School basic details, building infrastructure, toilets, electricity & smart TV facilities'}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => openVideo('https://www.youtube.com/embed/dQw4w9WgXcQ', isHi ? 'स्कूल प्रोफाइल एवं इंफ्रास्ट्रक्चर कैसे भरें?' : 'How to fill School Infrastructure in UDISE')}
                className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-red-600 hover:bg-red-700 text-white text-xs font-black shadow-md transition-all cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>{isHi ? 'यूट्यूब ट्यूटोरियल' : 'YouTube Tutorial'}</span>
              </button>

              <button
                onClick={() => handleOpenReportMaker('school')}
                className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black shadow-md transition-all cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>{isHi ? 'रिपोर्ट व प्रमाणीकरण पत्र जनरेटर' : 'Report Generator'}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="font-bold text-slate-500 block">भवन स्थिति</span>
              <span className="font-black text-slate-800 dark:text-slate-100">सरकारी (Govt Owned)</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="font-bold text-slate-500 block">विद्युत कनेक्शन</span>
              <span className="font-black text-emerald-600 dark:text-emerald-400">✓ उपलब्ध (Available)</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="font-bold text-slate-500 block">पेयजल सुविधा</span>
              <span className="font-black text-emerald-600 dark:text-emerald-400">✓ सबमर्सिबल / आरओ</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="font-bold text-slate-500 block">स्मार्ट क्लास / ICT</span>
              <span className="font-black text-emerald-600 dark:text-emerald-400">✓ स्मार्ट टीवी सह कम्प्यूटर</span>
            </div>
          </div>
        </div>
      )}

      {/* SUB-MODULE 3: STUDENT PROFILE */}
      {activeTab === 'student' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-md border border-slate-200 dark:border-slate-800 space-y-5 animate-fadeIn">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-emerald-600" />
                <span>{isHi ? 'UDISE+ छात्र प्रोफाइल प्रभाग (Student Profile Module)' : 'UDISE+ Student Profile Module'}</span>
              </h3>
              <p className="text-xs text-slate-500">
                {isHi ? 'नवागत छात्र प्रविष्टि, शाला त्यागी (Left), अपार (APAAR) आईडी जनरेशन व पूर्णता प्रमाणीकरण पत्र' : 'New Admissions, Student Left, APAAR ID Generation & Completion Certificates'}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => openVideo('https://www.youtube.com/embed/dQw4w9WgXcQ', isHi ? 'छात्र प्रोफाइल व APAAR ID कैसे जनरेट करें?' : 'How to generate APAAR ID in UDISE')}
                className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-red-600 hover:bg-red-700 text-white text-xs font-black shadow-md transition-all cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>{isHi ? 'यूट्यूब ट्यूटोरियल' : 'YouTube Tutorial'}</span>
              </button>

              <button
                onClick={() => handleOpenReportMaker('student')}
                className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black shadow-md transition-all cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>{isHi ? 'रिपोर्ट व प्रमाणीकरण पत्र जनरेटर' : 'Report Generator'}</span>
              </button>
            </div>
          </div>

          {/* 4 Feature Cards under Student Profile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 space-y-2">
              <span className="px-2 py-0.5 rounded bg-emerald-200 text-emerald-900 text-[10px] font-black">
                Feature 1
              </span>
              <h4 className="font-extrabold text-xs text-slate-900 dark:text-slate-100">
                {isHi ? 'नवागत प्रवेशित छात्र (New Admitted)' : 'New Admitted Students'}
              </h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-300">
                सत्र 2026-27 में नए प्रवेशित विद्यार्थियों की PEN व आधार विवरण सहित प्रविष्टि।
              </p>
              <div className="pt-2 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                दर्ज संख्या: {newAdmittedCount}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 space-y-2">
              <span className="px-2 py-0.5 rounded bg-rose-200 text-rose-900 text-[10px] font-black">
                Feature 2
              </span>
              <h4 className="font-extrabold text-xs text-slate-900 dark:text-slate-100">
                {isHi ? 'शाला त्यागी / टीसी (Student Left)' : 'Student Left / Dropout'}
              </h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-300">
                टीसी निर्गत कर विद्यालय छोड़ने वाले छात्रों को ड्रॉपबॉक्स में स्थानांतरित करना।
              </p>
              <div className="pt-2 text-xs font-bold text-rose-700 dark:text-rose-400">
                दर्ज संख्या: {studentsLeftCount}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 space-y-2">
              <span className="px-2 py-0.5 rounded bg-amber-200 text-amber-900 text-[10px] font-black">
                Feature 3
              </span>
              <h4 className="font-extrabold text-xs text-slate-900 dark:text-slate-100">
                {isHi ? 'प्रमाण पत्र - APAAR (अपार आईडी)' : 'APAAR ID Certificate'}
              </h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-300">
                समस्त छात्रों का अपार (Automated Permanent Academic Account Registry) आईडी।
              </p>
              <div className="pt-2 text-xs font-bold text-amber-800 dark:text-amber-300">
                जनरेटेड: {apaarGeneratedCount} / {totalStudentsCount}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 space-y-2">
              <span className="px-2 py-0.5 rounded bg-blue-200 text-blue-900 text-[10px] font-black">
                Feature 4
              </span>
              <h4 className="font-extrabold text-xs text-slate-900 dark:text-slate-100">
                {isHi ? 'प्रमाण पत्र - Completion' : 'Completion Certificate'}
              </h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-300">
                कक्षावार छात्र प्रोफाइल डेटा प्रविष्टि 100% पूर्णता का आधिकारिक प्रमाणीकरण।
              </p>
              <div className="pt-2 text-xs font-bold text-blue-700 dark:text-blue-400">
                पूर्णता: 100%
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-MODULE 4: VARIOUS FORMATS */}
      {activeTab === 'formats' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-md border border-slate-200 dark:border-slate-800 space-y-4 animate-fadeIn">
          <div className="pb-3 border-b border-slate-200 dark:border-slate-800">
            <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-600" />
              <span>{isHi ? 'यू-डाइस+ विभागीय प्रपत्र व फॉरमेट्स (UDISE+ Official DCF Formats)' : 'UDISE+ Official DCF Worksheet Formats'}</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {isHi ? 'ऑफ़लाइन डेटा संकलन हेतु यू-डाइस निर्दिष्ट आधिकारिक प्रपत्र। डाउनलोड, कॉपी व प्रिंट करें।' : 'Official Data Collection Formats (DCF) for offline data gathering in schools.'}
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                titleHi: '1. शिक्षक प्रोफाइल डेटा प्रपत्र (Teacher Profile DCF Worksheet)',
                descHi: 'प्रत्येक शिक्षक का नाम, पद, प्रथम नियुक्ति तिथि, आधार, मोबाइल, ईमेल एवं पढाने वाले विषयों का संकलन प्रपत्र।',
                content: `यू-डाइस+ शिक्षक प्रोफाइल ऑफलाइन संकलन प्रपत्र - सत्र 2026-27
विद्यालय नाम: ${reportSchoolName}
यू-डाइस कोड: ${reportUdiseCode}

1. शिक्षक का नाम (आधार अनुसार): ________________________
2. पिता/पति का नाम: ________________________
3. जन्म तिथि: ____/____/________ (आधार अनुसार)
4. लिंग: [ ] पुरुष  [ ] महिला
5. राष्ट्रीय शिक्षक कोड (National Code): ________________________
6. पदनाम (Designation): ________________________
7. मूल विषय: ________________________
8. प्रथम कार्यग्रहण तिथि: ____/____/________
9. वर्तमान विद्यालय कार्यग्रहण तिथि: ____/____/________
10. आधार संख्या: ________-________-________
11. मोबाइल नंबर: ________________________
12. ईमेल आईडी: ________________________`
              },
              {
                titleHi: '2. छात्र प्रोफाइल प्रविष्टि प्रपत्र (Student Profile Entry DCF)',
                descHi: 'नवागत छात्रों का PEN कोड, जन-आधार, अपार (APAAR) आईडी, माता-पिता नाम, बैंक खाता व श्रेणी प्रपत्र।',
                content: `यू-डाइस+ छात्र प्रोफाइल डेटा प्रपत्र - सत्र 2026-27
विद्यालय: ${reportSchoolName} | यू-डाइस: ${reportUdiseCode}

1. विद्यार्थी का नाम: ________________________
2. PEN (Permanent Education Number): ________________________
3. कक्षा एवं वर्ग (Class & Section): ________________________
4. माता का नाम: ________________________
5. पिता का नाम: ________________________
6. जन आधार संख्या: ________________________
7. आधार संख्या: ________-________-________
8. अपार (APAAR) आईडी: ________________________
9. सामाजिक श्रेणी: [ ] Gen  [ ] OBC  [ ] SC  [ ] ST  [ ] EWS
10. बैंक खाता संख्या: ________________________  IFSC: ________________`
              },
              {
                titleHi: '3. विद्यालय भौतिक संसाधन एवं सुविधायें प्रपत्र (Infrastructure DCF)',
                descHi: 'कमरों की संख्या, पेयजल स्रोत, बाल-बालिका शौचालय, बिजली, इंटरनेट व स्मार्ट क्लासरूम जांच प्रपत्र।',
                content: `यू-डाइस+ विद्यालय इंफ्रास्ट्रक्चर प्रपत्र - सत्र 2026-27
विद्यालय: ${reportSchoolName}

1. कुल पक्के कक्षा कक्ष (Classrooms): ________
2. पेयजल व्यवस्था: [ ] सबमर्सिबल [ ] नल [ ] हैण्डपंप
3. बालक शौचालय क्रियाशील: [ ] हाँ  [ ] नहीं  (संख्या: ____)
4. बालिका शौचालय क्रियाशील: [ ] हाँ  [ ] नहीं  (संख्या: ____)
5. विद्युत कनेक्शन: [ ] हाँ  [ ] नहीं
6. स्मार्ट टीवी / आईसीटी लैब: [ ] हाँ  [ ] नहीं
7. रैम्प व दिव्यांग शौचालय: [ ] हाँ  [ ] नहीं`
              }
            ].map((fmt, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-xs text-slate-800 dark:text-slate-100">{fmt.titleHi}</h4>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => copyToClipboard(fmt.content, idx)}
                      className="flex items-center gap-1 px-3 py-1 rounded-xl bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 text-xs font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-100 cursor-pointer"
                    >
                      {copiedFormatIdx === idx ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedFormatIdx === idx ? 'कॉपी हुआ' : 'कॉपी करें'}</span>
                    </button>

                    <button
                      onClick={() => {
                        const win = window.open('', '_blank');
                        if (win) {
                          win.document.write(`<pre style="font-family:sans-serif;padding:20px;">${fmt.content}</pre>`);
                          win.print();
                        }
                      }}
                      className="flex items-center gap-1 px-3 py-1 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>प्रिंट</span>
                    </button>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500">{fmt.descHi}</p>
                <pre className="p-3 rounded-xl bg-white dark:bg-slate-950 text-[11px] font-mono text-slate-700 dark:text-slate-300 overflow-x-auto whitespace-pre-wrap border border-slate-200 dark:border-slate-800">
                  {fmt.content}
                </pre>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-MODULE 5: HELP & YOUTUBE PLAYLIST */}
      {activeTab === 'help' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-md border border-slate-200 dark:border-slate-800 space-y-5 animate-fadeIn">
          <div className="pb-3 border-b border-slate-200 dark:border-slate-800">
            <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-emerald-600" />
              <span>{isHi ? 'यू-डाइस+ सहायता ब्लॉग एवं यूट्यूब प्लेलिस्ट' : 'UDISE+ Step-by-Step Guides & YouTube Playlist'}</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {isHi ? 'पोर्टल पर आ रही समस्याओं के समाधान एवं चरणबद्ध डिजिटल मार्गदर्शिका ब्लॉग्स' : 'Complete troubleshooting guides and official tutorial playlist'}
            </p>
          </div>

          {/* Blogs Section */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-xs text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-emerald-600" />
              <span>चरणबद्ध गाइड ब्लॉग्स (Step-by-Step Guide Blogs):</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                {
                  id: 'udise-guide',
                  title: 'यू-डाइस+ (UDISE+) 2026-27 शिक्षक एवं छात्र डेटा प्रोफाइल अपडेशन सम्पूर्णा गाइड',
                  summary: 'शिक्षक प्रोफाइल, नया छात्र प्रविष्टि, APAAR आईडी जनरेशन एवं 100% पूर्णता प्रमाणीकरण पत्र बनाने की संपूर्ण विधि।'
                },
                {
                  id: 'peeo-orders-guide',
                  title: 'यू-डाइस प्रभारी प्रमाणीकरण एवं संस्थाप्रधान अग्रेशन आदेश जनरेटर',
                  summary: 'यू-डाइस डेटा प्रविष्टि के उपरांत संस्थाप्रधान व बीईओ कार्यालय हेतु आधिकारिक जावक पत्र डाउनलोड करें।'
                }
              ].map((blog, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                  <h5 className="font-black text-xs text-slate-900 dark:text-slate-100">{blog.title}</h5>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300">{blog.summary}</p>
                  <button
                    onClick={() => onNavigateToBlog ? onNavigateToBlog(blog.id) : alert('ब्लॉग गाइड खोला जा रहा है...')}
                    className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>पूर्ण ब्लॉग पढ़ें →</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* YouTube Playlist Section */}
          <div className="space-y-3 pt-2">
            <h4 className="font-extrabold text-xs text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Play className="w-4 h-4 text-red-600 fill-red-600" />
              <span>यू-डाइस+ यूट्यूब वीडियो प्लेलिस्ट (Official Tutorials):</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { title: 'UDISE+ Teacher Module Entry Guide', duration: '10 min' },
                { title: 'Student Profile & APAAR ID Creation', duration: '14 min' },
                { title: 'School Infrastructure & Facility DCF', duration: '8 min' },
              ].map((vid, idx) => (
                <div key={idx} className="p-3 rounded-2xl bg-slate-900 text-white space-y-2">
                  <div 
                    onClick={() => openVideo('https://www.youtube.com/embed/dQw4w9WgXcQ', vid.title)}
                    className="h-24 rounded-xl bg-slate-800 flex items-center justify-center relative cursor-pointer group"
                  >
                    <Play className="w-8 h-8 text-red-500 fill-red-500 group-hover:scale-110 transition-transform" />
                    <span className="absolute bottom-1 right-1 px-1 rounded bg-black/80 text-[10px] font-mono">{vid.duration}</span>
                  </div>
                  <h5 className="font-bold text-xs truncate">{vid.title}</h5>
                  <button
                    onClick={() => openVideo('https://www.youtube.com/embed/dQw4w9WgXcQ', vid.title)}
                    className="text-[10px] text-amber-300 font-bold hover:underline cursor-pointer"
                  >
                    वीडियो देखें (Play) →
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* REPORT MAKER MODAL / SCREEN */}
      {showReportMaker && (
        <div className="fixed inset-0 z-[2000] bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 animate-fadeIn overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 text-slate-100 rounded-3xl max-w-3xl w-full p-5 sm:p-6 space-y-4 my-8 relative shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-extrabold text-sm sm:text-base text-amber-400 flex items-center gap-2">
                <Printer className="w-5 h-5 text-amber-400" />
                <span>
                  {reportModuleType === 'teacher' && 'UDISE+ शिक्षक मॉड्यूल - रिपोर्ट एवं प्रमाणीकरण प्रपत्र'}
                  {reportModuleType === 'school' && 'UDISE+ विद्यालय प्रोफाइल - प्रमाणीकरण प्रपत्र'}
                  {reportModuleType === 'student' && 'UDISE+ छात्र प्रोफाइल व APAAR ID - प्रमाणीकरण प्रपत्र'}
                </span>
              </h3>
              <button
                onClick={() => setShowReportMaker(false)}
                className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Step Selector Header */}
            <div className="flex items-center gap-2 p-1 bg-slate-800 rounded-2xl">
              <button
                onClick={() => setReportStep('make')}
                className={`flex-1 py-2 text-xs font-black rounded-xl transition-all cursor-pointer ${
                  reportStep === 'make' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'
                }`}
              >
                1. रिपोर्ट बनाएं (Make Report)
              </button>
              <button
                onClick={() => setReportStep('preview')}
                className={`flex-1 py-2 text-xs font-black rounded-xl transition-all cursor-pointer ${
                  reportStep === 'preview' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'
                }`}
              >
                2. पूर्वावलोकन एवं प्रिंट (Preview & Print)
              </button>
            </div>

            {/* STEP 1: MAKE REPORT FORM */}
            {reportStep === 'make' && (
              <div className="space-y-4 text-xs">
                {/* Certificate Option Selection (A vs B) */}
                <div className="space-y-1.5">
                  <label className="font-bold text-amber-300 block">प्रमाणीकरण प्रपत्र का प्रकार चुनें (Select Certificate Type):</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setCertificateOption('inchargeToPrincipal')}
                      className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                        certificateOption === 'inchargeToPrincipal'
                          ? 'bg-amber-500/20 border-amber-400 text-amber-200 font-bold'
                          : 'bg-slate-800 border-slate-700 text-slate-300'
                      }`}
                    >
                      <span className="text-[11px] block text-amber-400">विकल्प अ (Option A)</span>
                      <span>यू-डाइस प्रभारी द्वारा प्रधानाचार्य/संस्थाप्रधान को प्रस्तुत प्रपत्र</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setCertificateOption('principalToOfficer')}
                      className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                        certificateOption === 'principalToOfficer'
                          ? 'bg-amber-500/20 border-amber-400 text-amber-200 font-bold'
                          : 'bg-slate-800 border-slate-700 text-slate-300'
                      }`}
                    >
                      <span className="text-[11px] block text-amber-400">विकल्प ब (Option B)</span>
                      <span>प्रधानाचार्य द्वारा ब्लॉक शिक्षा अधिकारी (CBEO) को प्रेषित प्रपत्र</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">विद्यालय का नाम (School Name)</label>
                    <input
                      type="text"
                      value={reportSchoolName}
                      onChange={(e) => setReportSchoolName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">यू-डाइस कोड (UDISE Code)</label>
                    <input
                      type="text"
                      value={reportUdiseCode}
                      onChange={(e) => setReportUdiseCode(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none"
                    />
                  </div>
                </div>

                {reportModuleType === 'teacher' && (
                  <div className="grid grid-cols-3 gap-3 p-3 bg-slate-800/80 rounded-2xl border border-slate-700">
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">कुल शिक्षक</label>
                      <input
                        type="number"
                        value={totalTeachersCount}
                        onChange={(e) => setTotalTeachersCount(Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-emerald-400 font-bold mb-1">अपडेटेड संख्या</label>
                      <input
                        type="number"
                        value={updatedTeachersCount}
                        onChange={(e) => setUpdatedTeachersCount(Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-rose-400 font-bold mb-1">लंबित संख्या</label>
                      <input
                        type="number"
                        value={notUpdatedTeachersCount}
                        onChange={(e) => setNotUpdatedTeachersCount(Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none"
                      />
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">जावक क्रमांक (Dispatch No)</label>
                    <input
                      type="text"
                      value={reportDispatchNo}
                      onChange={(e) => setReportDispatchNo(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">दिनांक (Date)</label>
                    <input
                      type="date"
                      value={reportDate}
                      onChange={(e) => setReportDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => setReportStep('preview')}
                    className="px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md cursor-pointer"
                  >
                    रिपोर्ट जनरेट करें एवं पूर्वावलोकन देखें →
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: PREVIEW & PRINT REPORT */}
            {reportStep === 'preview' && (
              <div className="space-y-4">
                <div className="bg-white text-slate-900 p-6 rounded-2xl space-y-4 text-xs font-sans border-2 border-slate-900 printable-area">
                  <div className="text-center space-y-1 pb-3 border-b-2 border-slate-900">
                    <h2 className="text-base font-black uppercase">{reportSchoolName}</h2>
                    <p className="font-bold text-[11px] text-slate-700">
                      यू-डाइस कोड: {reportUdiseCode} | ब्लॉक: {reportBlock} | जिला: {reportDistrict}
                    </p>
                    <div className="inline-block mt-1 px-3 py-0.5 rounded-full bg-slate-200 text-slate-950 font-black text-[11px]">
                      {certificateOption === 'inchargeToPrincipal'
                        ? 'यू-डाइस+ डेटा प्रविष्टि पूर्णता प्रमाण पत्र (प्रभारी प्रस्तुत)'
                        : 'यू-डाइस+ डेटा प्रविष्टि पूर्णता प्रमाण पत्र (प्रधानाचार्य द्वारा उच्च अधिकारियों को सम्प्रेषित)'}
                    </div>
                  </div>

                  <div className="flex justify-between items-center font-bold">
                    <span>क्रमांक: {reportDispatchNo}</span>
                    <span>दिनांक: {reportDate}</span>
                  </div>

                  <div className="space-y-2 leading-relaxed">
                    <p className="font-bold">
                      {certificateOption === 'inchargeToPrincipal'
                        ? 'सेवा में, श्रीमान प्रधानाचार्य / संस्थाप्रधान महोदय,'
                        : 'सेवा में, श्रीमान मुख्य ब्लॉक शिक्षा अधिकारी (CBEO),'}
                    </p>
                    <p>
                      <strong>विषय:</strong> सत्र {reportAcademicYear} हेतु यू-डाइस+ ({reportModuleType === 'teacher' ? 'शिक्षक मॉड्यूल' : reportModuleType === 'school' ? 'स्कूल प्रोफाइल' : 'छात्र प्रोफाइल व APAAR ID'}) डेटा ऑनलाइन प्रविष्टि पूर्णता बाबत।
                    </p>
                    <p>
                      महोदय,
                    </p>
                    <p>
                      प्रमाणित किया जाता है कि हमारे विद्यालय {reportSchoolName} (यू-डाइस: {reportUdiseCode}) के 
                      {reportModuleType === 'teacher' && ` समस्त ${totalTeachersCount} पदस्थापित शिक्षकों का प्रोफाइल डेटा, आधार प्रमाणीकरण एवं राष्ट्रीय शिक्षक कोड की प्रविष्टि यू-डाइस+ पोर्टल पर 100% पूर्ण कर ली गई है।`}
                      {reportModuleType === 'school' && ` भौतिक संसाधन, भवन स्थिति, पेयजल, शौचालय, बिजली एवं स्मार्ट क्लास इंफ्रास्ट्रक्चर की समस्त 12 श्रेणियों की प्रविष्टि पूर्ण कर ली गई है।`}
                      {reportModuleType === 'student' && ` कुल ${totalStudentsCount} नामांकित विद्यार्थियों (नवागत: ${newAdmittedCount}, APAAR ID: ${apaarGeneratedCount}) की प्रविष्टि यू-डाइस+ पोर्टल पर पूर्ण कर ली गई है।`}
                    </p>
                  </div>

                  <div className="pt-10 grid grid-cols-2 gap-6 text-center font-bold">
                    <div>
                      <p>____________________</p>
                      <p className="mt-1">{reportInchargeName}</p>
                      <p className="text-[10px] text-slate-600">यू-डाइस+ प्रभारी</p>
                    </div>
                    <div>
                      <p>____________________</p>
                      <p className="mt-1">{reportPrincipalName}</p>
                      <p className="text-[10px] text-slate-600">हस्ताक्षर एवं मुहर संस्थाप्रधान</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 justify-between items-center pt-2">
                  <button
                    onClick={() => setReportStep('make')}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 cursor-pointer"
                  >
                    ← सम्पादन पर लौटें
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={openReportInNewPage}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md cursor-pointer"
                      title="रिपोर्ट को नए ब्राउज़र विंडो/पेज में खोलें"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>नए पेज में खोलें (Open in New Page)</span>
                    </button>

                    <button
                      onClick={() => window.print()}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-md cursor-pointer"
                    >
                      <Printer className="w-4 h-4" />
                      <span>प्रिंट / पीडीएफ डाउनलोड करें</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
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
