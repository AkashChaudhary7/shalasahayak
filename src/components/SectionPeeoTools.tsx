import React, { useState } from 'react';
import { SchoolProfile, Teacher, IncrementRecord, InchargeAssignment, Language, AparIprRecord, AadhaarPramanikaranRecord, ApaarIdRecord } from '../types';
import { ThreeDIcon, ThreeDCard } from './ThreeDIcon';
import { calculateAnnualIncrement, RAJASTHAN_PAY_MATRIX } from '../data/payMatrix';
import { generateIncrementOrderPdf, generateInchargeOrderPdf } from '../utils/pdfGenerator';
import { TimeTableGenerator } from './peeo/TimeTableGenerator';
import { WorkInchargeMapping } from './peeo/WorkInchargeMapping';
import { PramanikaranReportsEngine } from './peeo/PramanikaranReportsEngine';
import { PeeoOfficialLetterhead } from './peeo/PeeoOfficialLetterhead';
import { DepartmentalApplicationsHub } from './peeo/DepartmentalApplicationsHub';
import { AdminPinLock } from './AdminPinLock';
import { storage } from '../utils/storage';
import { safeHtml2Canvas } from '../utils/safeHtml2Canvas';
import { t } from '../utils/i18n';
import {
  FileCheck,
  Calendar,
  Users,
  Clock,
  Award,
  Send,
  Download,
  Upload,
  Printer,
  Plus,
  Trash2,
  Edit,
  CheckCircle2,
  AlertCircle,
  Share2,
  Sparkles,
  Building2,
  CheckSquare,
  Square,
  FileSpreadsheet,
  ShieldCheck,
  TrendingUp,
  ArrowLeft
} from 'lucide-react';

interface SectionPeeoToolsProps {
  schoolProfile: SchoolProfile;
  teachers: Teacher[];
  onUpdateTeachers: (teachers: Teacher[]) => void;
  incharges: InchargeAssignment[];
  onUpdateIncharges: (incharges: InchargeAssignment[]) => void;
  lang: Language;
  initialSubTab?: 'increment' | 'timetable' | 'incharge' | 'substitution' | 'apar' | 'notice' | 'satyapan' | 'pramanikaran' | 'applications' | null;
  onNavigate?: (newNav: any) => void;
}

export const SectionPeeoTools: React.FC<SectionPeeoToolsProps> = ({
  schoolProfile,
  teachers,
  onUpdateTeachers,
  incharges,
  onUpdateIncharges,
  lang,
  initialSubTab = null,
  onNavigate
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'increment' | 'timetable' | 'incharge' | 'substitution' | 'apar' | 'notice' | 'satyapan' | 'pramanikaran' | 'applications' | null>(initialSubTab);
  const [exportLang, setExportLang] = useState<Language>(lang);
  const [incrementTab, setIncrementTab] = useState<'maker' | 'preview'>('maker');

  React.useEffect(() => {
    setActiveSubTab(initialSubTab);
  }, [initialSubTab]);

  React.useEffect(() => {
    if (onNavigate) {
      if (activeSubTab !== initialSubTab) {
        if (activeSubTab) {
          onNavigate({
            type: 'tool',
            category: 'peeo',
            subtab: activeSubTab as any
          });
        } else {
          onNavigate({
            type: 'category',
            id: 'peeo'
          });
        }
      }
    }
  }, [activeSubTab, initialSubTab, onNavigate]);

  // Pramanikaran Reports State
  const [aparRecords, setAparRecords] = useState<AparIprRecord[]>(() => storage.getAparRecords());
  const [aadhaarRecords, setAadhaarRecords] = useState<AadhaarPramanikaranRecord[]>(() => storage.getAadhaarRecords());
  const [apaarRecords, setApaarRecords] = useState<ApaarIdRecord[]>(() => storage.getApaarRecords());

  const handleUpdateApar = (data: AparIprRecord[]) => {
    setAparRecords(data);
    storage.setAparRecords(data);
  };

  const handleUpdateAadhaar = (data: AadhaarPramanikaranRecord[]) => {
    setAadhaarRecords(data);
    storage.setAadhaarRecords(data);
  };

  const handleUpdateApaar = (data: ApaarIdRecord[]) => {
    setApaarRecords(data);
    storage.setApaarRecords(data);
  };

  // Increment State
  const [batchMonth, setBatchMonth] = useState<'July' | 'January'>('July');
  const [filterSchool, setFilterSchool] = useState<string>('all');
  const [filterDesignation, setFilterDesignation] = useState<string>('all');
  const [selectedStaffIds, setSelectedStaffIds] = useState<string[]>([]);
  const [batchSuccessMessage, setBatchSuccessMessage] = useState<string | null>(null);

  // Automated Batch Processing Handler
  const handleRunAutomatedBatchProcessing = () => {
    const totalCount = activeStaffForIncrement.length;
    if (totalCount === 0) {
      alert(lang === 'hi' ? 'कृपया वेतन वृद्धि हेतु कम से कम एक कार्मिक का चयन करें।' : 'Please select at least one staff member for increment.');
      return;
    }

    const totalInc = incrementRecords.reduce((acc, r) => acc + (r.newBasicPay - r.oldBasicPay), 0);
    setBatchSuccessMessage(
      lang === 'hi'
        ? `✓ स्वचालित बैच वेतन वृद्धि पूर्ण! ${totalCount} कार्मिकों के लिए 7वें वेतन आयोग नियमानुसार कुल ₹${totalInc.toLocaleString('en-IN')} का नया वेतन वृद्धि आदेश जनरेट किया गया।`
        : `✓ Automated Batch Increment Complete! Calculated 3% increment for ${totalCount} staff members totaling +₹${totalInc.toLocaleString('en-IN')} monthly liability.`
    );

    // Scroll to the generated official order document
    setTimeout(() => {
      const orderElem = document.getElementById('peeo-official-increment-order');
      if (orderElem) {
        orderElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  // Commit / Apply New Basic Pay to Master Teacher Records
  const handleCommitBatchIncrementsToMaster = () => {
    if (!confirm(lang === 'hi' ? 'क्या आप नए मूल वेतन को मुख्य मास्टर स्टाफ डेटाबेस में सहेजना चाहते हैं?' : 'Commit calculated new basic pay values to master staff database?')) {
      return;
    }

    const updatedTeachers = teachers.map(t => {
      const incRecord = incrementRecords.find(r => r.teacherId === t.id);
      if (incRecord) {
        return {
          ...t,
          currentBasicPay: incRecord.newBasicPay
        };
      }
      return t;
    });

    onUpdateTeachers(updatedTeachers);
    alert(lang === 'hi' ? '✓ मास्टर स्टाफ डेटाबेस में नया वेतन सफलतापूर्वक अपडेट हो गया!' : '✓ Master staff records updated with new basic pay successfully!');
  };

  // Teacher Form State
  const [showAddTeacher, setShowAddTeacher] = useState(false);
  const [newTeacherName, setNewTeacherName] = useState('');
  const [newTeacherDesignation, setNewTeacherDesignation] = useState('Senior Teacher');
  const [newTeacherPayLevel, setNewTeacherPayLevel] = useState('L-11');
  const [newTeacherBasic, setNewTeacherBasic] = useState(46500);
  const [newTeacherSchool, setNewTeacherSchool] = useState(schoolProfile.schoolName);
  const [newTeacherJoiningDate, setNewTeacherJoiningDate] = useState('2018-07-15');

  // Daily Substitution State
  const [absentTeacher, setAbsentTeacher] = useState('');
  const [subPeriod, setSubPeriod] = useState(2);
  const [subClass, setSubClass] = useState('Class 9-B');
  const [arrangedTeacher, setArrangedTeacher] = useState('');
  const [arrangements, setArrangements] = useState<{ id: string; absent: string; period: number; cls: string; sub: string }[]>([
    { id: 'arr-1', absent: 'Vikram Singh Rathore', period: 2, cls: 'Class 10-A', sub: 'Sunita Choudhary' }
  ]);

  // Event Notice State
  const [noticeEventType, setNoticeEventType] = useState('PTM (शिक्षक-अभिभावक बैठक)');
  const [noticeDate, setNoticeDate] = useState('2026-08-15');
  const [noticeTime, setNoticeTime] = useState('10:00 AM');
  const [noticeVenue, setNoticeVenue] = useState('School Main Hall');
  const [noticeChiefGuest, setNoticeChiefGuest] = useState('Shri Sarpanch / SDMC President');

  // Bhautik Satyapan State
  const [satyapanItems, setSatyapanItems] = useState([
    { id: '1', name: 'Student Benches & Desks', verified: true, remarks: '300 sets verified in good condition' },
    { id: '2', name: 'ICT Lab Desktops & UPS', verified: true, remarks: '10 Desktops working, 1 UPS battery replacement required' },
    { id: '3', name: 'Sports Goods Register', verified: true, remarks: 'Cricket set, Footballs & Chess boards in stock' },
    { id: '4', name: 'Library Book Accession Register', verified: true, remarks: 'Total 1240 books physically tallied' },
    { id: '5', name: 'Drinking Water & Sanitation Facility', verified: true, remarks: 'RO Water purifier functional' }
  ]);

  // Compute list of schools present in staff database
  const schoolList = Array.from(new Set(teachers.map(t => t.schoolName || schoolProfile.schoolName)));

  // Filter staff by Month, School & Designation
  const eligibleTeachers = teachers.filter(t => {
    const monthMatch = t.incrementMonth === batchMonth;
    const schoolMatch = filterSchool === 'all' || (t.schoolName || schoolProfile.schoolName) === filterSchool;
    const desigMatch = filterDesignation === 'all' || t.designation === filterDesignation;
    return monthMatch && schoolMatch && desigMatch;
  });

  // Select All or clear selections when list changes
  const isAllSelected = eligibleTeachers.length > 0 && eligibleTeachers.every(t => selectedStaffIds.includes(t.id));

  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedStaffIds([]);
    } else {
      setSelectedStaffIds(eligibleTeachers.map(t => t.id));
    }
  };

  const handleToggleSelectOne = (id: string) => {
    if (selectedStaffIds.includes(id)) {
      setSelectedStaffIds(selectedStaffIds.filter(i => i !== id));
    } else {
      setSelectedStaffIds([...selectedStaffIds, id]);
    }
  };

  // Build Increment Records for Selected or Filtered Staff
  const activeStaffForIncrement = eligibleTeachers.filter(
    t => selectedStaffIds.length === 0 || selectedStaffIds.includes(t.id)
  );

  const incrementRecords: IncrementRecord[] = activeStaffForIncrement.map(t => {
    const calc = calculateAnnualIncrement(t.payLevel, t.currentBasicPay);
    return {
      id: `inc-${t.id}`,
      teacherId: t.id,
      teacherName: t.name,
      designation: t.designation,
      schoolName: t.schoolName || schoolProfile.schoolName,
      payLevel: t.payLevel,
      oldBasicPay: t.currentBasicPay,
      newBasicPay: calc.newBasicPay,
      effectiveDate: `01-${batchMonth === 'July' ? '07' : '01'}-2026`,
      orderNo: `${schoolProfile.nicCode}/Inc/2026`,
      dispatchNo: `${Math.floor(Math.random() * 800 + 100)}`,
      dispatchDate: new Date().toLocaleDateString('en-IN'),
      dateOfJoining: t.dateOfJoining || '2018-07-15'
    };
  });

  // Export Staff Dataset as JSON / CSV
  const handleExportStaffData = (format: 'json' | 'csv') => {
    if (format === 'json') {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(teachers, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `Staff_Database_${schoolProfile.nicCode}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } else {
      let csvContent = "data:text/csv;charset=utf-8,";
      csvContent += "Employee ID,Name,Designation,School Name,Pay Level,Current Basic Pay,Joining Date,Increment Month,Phone\n";
      teachers.forEach(t => {
        csvContent += `"${t.employeeId}","${t.name}","${t.designation}","${t.schoolName || schoolProfile.schoolName}","${t.payLevel}",${t.currentBasicPay},"${t.dateOfJoining || '2018-07-15'}","${t.incrementMonth}","${t.phone}"\n`;
      });
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `Staff_Database_${schoolProfile.nicCode}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    }
  };

  // Import Staff Dataset from File
  const handleImportStaffData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        if (file.name.endsWith('.json')) {
          const imported: Teacher[] = JSON.parse(text);
          if (Array.isArray(imported)) {
            onUpdateTeachers([...teachers, ...imported]);
            alert(`✓ Successfully imported ${imported.length} staff records!`);
          }
        } else if (file.name.endsWith('.csv')) {
          const lines = text.split('\n');
          const imported: Teacher[] = [];
          for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;
            const cols = line.split(',').map(c => c.replace(/^"|"$/g, '').trim());
            if (cols.length >= 6) {
              imported.push({
                id: `imp-${Date.now()}-${i}`,
                employeeId: cols[0] || `RJPA2026${Math.floor(Math.random()*9000+1000)}`,
                name: cols[1] || 'Teacher',
                nameHindi: cols[1] || 'Teacher',
                designation: cols[2] || 'Teacher',
                schoolName: cols[3] || schoolProfile.schoolName,
                payLevel: cols[4] || 'L-11',
                currentBasicPay: Number(cols[5]) || 46500,
                cellNo: 1,
                subject: 'General',
                incrementMonth: cols[7] === 'January' ? 'January' : 'July',
                dateOfJoining: cols[6] || '2018-07-15',
                phone: cols[8] || '9829000000'
              });
            }
          }
          if (imported.length > 0) {
            onUpdateTeachers([...teachers, ...imported]);
            alert(`✓ Successfully imported ${imported.length} staff records from CSV!`);
          }
        }
      } catch (err) {
        alert("Error parsing file format. Please upload valid JSON or CSV file.");
      }
    };
    reader.readAsText(file);
  };

  const handleExportIncrementPdf = () => {
    generateIncrementOrderPdf(schoolProfile, incrementRecords, batchMonth, 2026);
  };

  const handleShareIncrementAsImage = async () => {
    const element = document.getElementById('peeo-official-increment-order');
    if (!element) return;
    try {
      const canvas = await safeHtml2Canvas(element, {
        useCORS: true,
        scale: 2,
        backgroundColor: '#ffffff'
      });
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const file = new File([blob], 'increment_order.png', { type: 'image/png' });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              files: [file],
              title: exportLang === 'hi' ? 'राजकीय वेतन वृद्धि आदेश' : 'Official Increment Order',
              text: 'Generated via Shala Sahayak'
            });
          } catch (shareErr) {
            const link = document.createElement('a');
            link.href = canvas.toDataURL('image/png');
            link.download = 'increment_order.png';
            link.click();
          }
        } else {
          const link = document.createElement('a');
          link.href = canvas.toDataURL('image/png');
          link.download = 'increment_order.png';
          link.click();
        }
      }, 'image/png');
    } catch (err) {
      console.error('Error sharing image', err);
    }
  };

  const handleExportInchargePdf = () => {
    generateInchargeOrderPdf(schoolProfile, incharges);
  };

  const handleAddTeacherSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeacherName) return;
    const newT: Teacher = {
      id: `tch-${Date.now()}`,
      name: newTeacherName,
      nameHindi: newTeacherName,
      designation: newTeacherDesignation,
      subject: 'General',
      employeeId: `RJPA2026${Math.floor(Math.random()*9000+1000)}`,
      payLevel: newTeacherPayLevel,
      currentBasicPay: Number(newTeacherBasic),
      cellNo: 1,
      incrementMonth: batchMonth,
      schoolName: newTeacherSchool,
      dateOfJoining: newTeacherJoiningDate,
      phone: '9829000000'
    };
    onUpdateTeachers([...teachers, newT]);
    setNewTeacherName('');
    setShowAddTeacher(false);
  };

  const handleAddArrangement = () => {
    if (!absentTeacher || !arrangedTeacher) return;
    setArrangements([
      ...arrangements,
      { id: Date.now().toString(), absent: absentTeacher, period: subPeriod, cls: subClass, sub: arrangedTeacher }
    ]);
    setAbsentTeacher('');
    setArrangedTeacher('');
  };

  if (activeSubTab === null) {
    const tools = [
      {
        id: 'increment' as const,
        titleHi: 'वार्षिक वेतन वृद्धि प्रक्रमण',
        titleEn: 'Batch Salary Increment',
        descHi: '7वें वेतन आयोग नियमानुसार समस्त ब्लॉक स्टाफ की स्वचालित वेतन वृद्धि गणना व राजकीय आदेश निर्माण',
        descEn: 'Automated 3% basic pay increments calculation and official order PDF generator for block staff',
        iconName: 'chart' as const
      },
      {
        id: 'incharge' as const,
        titleHi: 'संस्थागत प्रभार मैपिंग व आदेश',
        titleEn: 'Incharge Work Mapping & Order',
        descHi: 'विद्यालय प्रभारियों (MDM, परीक्षा, भौतिक सत्यापन आदि) का आवंटन एवं कार्यालय प्रभार आदेश जनरेटर',
        descEn: 'School key charge allocations, responsibilities mapping, and official assignment order generator',
        iconName: 'briefcase' as const
      },
      {
        id: 'pramanikaran' as const,
        titleHi: 'प्रमाणीकरण व सत्यापन रिपोर्ट हब',
        titleEn: 'Verification & Reports Hub',
        descHi: 'स्टाफ के आधार, अपाार आईडी एवं एपीएआर (APAR) प्रलेखन एवं सत्यापन डैशबोर्ड',
        descEn: 'Employee Aadhaar authentication tracking, APAAR ID creation, and official APAR review dashboard',
        iconName: 'shield' as const
      },
      {
        id: 'timetable' as const,
        titleHi: 'विद्यालय समय-सारणी जनरेटर',
        titleEn: 'School Timetable Generator',
        descHi: 'कक्षा-वार एवं शिक्षक-वार घंटी आवंटन, कोलिशन-फ्री टाइमटेबल शेड्यूलर',
        descEn: 'Automated clash-free school timetable scheduler and period allocator',
        iconName: 'calendar' as const
      },
      {
        id: 'substitution' as const,
        titleHi: 'दैनिक स्थानापन्न पीरियड सिस्टम',
        titleEn: 'Daily Substitution System',
        descHi: 'अनुपस्थित शिक्षकों की कक्षाओं के लिए उपलब्ध शिक्षकों का त्वरित आवंटन प्रणाली',
        descEn: 'Quick available teacher periods assignment for absent staff members',
        iconName: 'bell' as const
      }
    ];

    return (
      <div className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2 mt-4">
          <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 flex items-center justify-center gap-2">
            <ThreeDIcon name="sparkles" size={36} />
            <span>{lang === 'hi' ? 'पीईईओ एवं संस्था प्रधान कार्यालय' : 'PEEO & Principal Office'}</span>
          </h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {lang === 'hi' 
              ? 'कार्यालय संस्था प्रधान एवं पीईईओ क्षेत्र के कार्मिकों एवं प्रशासनिक प्रलेखन प्रणालियों का डिजिटल हब।' 
              : 'Digital management suite for block staff increment processing, rosters and legal administrative office documentation.'}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {tools.map((t) => {
            return (
              <ThreeDCard
                key={t.id}
                onClick={() => setActiveSubTab(t.id)}
                icon={t.iconName}
                label={lang === 'hi' ? t.titleHi : t.titleEn}
              />
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">

      {/* 1. ANNUAL BATCH DDO INCREMENT ORDER MAKER & EXPORT/IMPORT */}
      {activeSubTab === 'increment' && (
        <AdminPinLock
          lang={lang}
          moduleTitle={lang === 'hi' ? 'वार्षिक वेतन वृद्धि प्रक्रमण (Batch Increment Order)' : 'Batch Salary Increment Order System'}
          moduleSubtitle={lang === 'hi' ? '7वें वेतन आयोग अनुसार ब्लॉक स्टाफ वेतन वृद्धि एवं कार्यालय आदेश निष्पादन' : 'DDO staff pay scale updates & official office order generation'}
        >
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 shadow-lg border border-slate-200 dark:border-slate-800 space-y-4 relative">
          
          {/* Floating Back Button */}
          <button
            onClick={() => setActiveSubTab(null)}
            className="absolute top-4 right-4 z-20 p-2 rounded-xl bg-slate-100 hover:bg-emerald-50 dark:bg-slate-850 dark:hover:bg-emerald-950/30 text-slate-500 hover:text-emerald-700 dark:text-slate-400 dark:hover:text-emerald-400 transition-all cursor-pointer active:scale-95 border border-slate-200/60 dark:border-slate-800"
            title={lang === 'hi' ? 'वापस' : 'Back'}
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
                  DDO Module
                </span>
                <span className="text-[11px] font-semibold text-slate-500">
                  7th Pay Commission Matrix
                </span>
              </div>
              <h3 className="font-black text-base sm:text-lg text-slate-900 dark:text-slate-100 flex items-center gap-2 mt-0.5">
                <FileCheck className="w-5 h-5 text-emerald-600" />
                <span>{lang === 'hi' ? 'बैच वेतन वृद्धि (Increment) एवं स्टाफ इम्पोर्ट/एक्सपोर्ट' : 'Batch DDO Increment & Staff Import/Export'}</span>
              </h3>
              <p className="text-xs text-slate-500">
                {lang === 'hi'
                  ? 'अधीनस्थ स्कूलों का स्टाफ डेटा इम्पोर्ट करें, 3% वार्षिक वृद्धि कैलकुलेट करें व ऑफिस ऑर्डर प्रिंट/डाउनलोड करें'
                  : 'Import feeder school staff, batch calculate 3% annual increment & export official office orders'}
              </p>
            </div>

            {/* Export / Import Staff Data Controls */}
            <div className="flex items-center space-x-2">
              <label className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center space-x-1.5 cursor-pointer shadow-xs transition-all">
                <Upload className="w-3.5 h-3.5" />
                <span>Import Staff (CSV/JSON)</span>
                <input type="file" accept=".json,.csv" onChange={handleImportStaffData} className="hidden" />
              </label>

              <button
                onClick={() => handleExportStaffData('csv')}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center space-x-1 border border-slate-300 dark:border-slate-700 transition-colors"
                title="Export Staff CSV"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          {/* DUAL-TAB SEGMENTED CONTROLLER */}
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700 w-full sm:w-auto font-sans shadow-inner max-w-sm mx-auto my-2">
            <button
              onClick={() => setIncrementTab('maker')}
              className={`flex-1 py-1.5 rounded-xl text-xs font-black transition-all ${
                incrementTab === 'maker'
                  ? 'bg-emerald-800 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-950'
              }`}
            >
              {lang === 'hi' ? 'प्रपत्र प्रविष्टि (Maker)' : 'Maker / Form Input'}
            </button>
            <button
              onClick={() => setIncrementTab('preview')}
              className={`flex-1 py-1.5 rounded-xl text-xs font-black transition-all ${
                incrementTab === 'preview'
                  ? 'bg-emerald-800 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-950'
              }`}
            >
              {lang === 'hi' ? 'कार्यालय आदेश पूर्वावलोकन' : 'Preview Office Order'}
            </button>
          </div>

          {incrementTab === 'maker' ? (
            <>
              {/* Filter & Batch Selection Controls */}
              <div className="p-3.5 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
              
              {/* Batch Month */}
              <div>
                <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                  Increment Month:
                </label>
                <div className="flex rounded-xl bg-white dark:bg-slate-900 p-1 border border-slate-300 dark:border-slate-700">
                  <button
                    onClick={() => setBatchMonth('July')}
                    className={`flex-1 py-1 text-center font-bold rounded-lg transition-colors ${
                      batchMonth === 'July'
                        ? 'bg-emerald-800 text-white'
                        : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    July (जुलाई)
                  </button>
                  <button
                    onClick={() => setBatchMonth('January')}
                    className={`flex-1 py-1 text-center font-bold rounded-lg transition-colors ${
                      batchMonth === 'January'
                        ? 'bg-emerald-800 text-white'
                        : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    January (जनवरी)
                  </button>
                </div>
              </div>

              {/* School Filter */}
              <div>
                <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                  Feeder / Sub-School Filter:
                </label>
                <select
                  value={filterSchool}
                  onChange={e => setFilterSchool(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold"
                >
                  <option value="all">All Linked Schools ({schoolList.length})</option>
                  {schoolList.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Designation Filter */}
              <div>
                <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                  Designation Filter:
                </label>
                <select
                  value={filterDesignation}
                  onChange={e => setFilterDesignation(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold"
                >
                  <option value="all">All Designations</option>
                  {Array.from(new Set(teachers.map(t => t.designation))).map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

            </div>

            {/* Quick Actions, Automated Batch Processing & Add Staff */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-emerald-200/60 dark:border-emerald-800/40">
              <div className="flex items-center space-x-3 text-xs font-bold text-slate-700 dark:text-slate-300">
                <button
                  onClick={handleToggleSelectAll}
                  className="flex items-center space-x-1.5 text-emerald-800 dark:text-emerald-300 hover:underline"
                >
                  {isAllSelected ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                  <span>{isAllSelected ? 'Deselect All' : `Select All (${eligibleTeachers.length})`}</span>
                </button>

                <button
                  onClick={handleRunAutomatedBatchProcessing}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-black text-xs flex items-center space-x-1.5 shadow-md transition-all active:scale-95"
                >
                  <TrendingUp className="w-4 h-4 text-amber-300 animate-bounce" />
                  <span>{lang === 'hi' ? '⚡ स्वलक्षित बैच वेतन वृद्धि रन करें' : '⚡ Run Automated Batch Processing'}</span>
                </button>
              </div>

              <div className="flex items-center space-x-2">
                {batchSuccessMessage && (
                  <button
                    onClick={handleCommitBatchIncrementsToMaster}
                    className="px-3 py-1 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-bold flex items-center space-x-1 shadow-xs"
                    title="Apply new basic pay values to master staff records"
                  >
                    <CheckSquare className="w-3.5 h-3.5 text-emerald-300" />
                    <span>{lang === 'hi' ? 'मास्टर डेटाबेस में सहेजें' : 'Commit to Master DB'}</span>
                  </button>
                )}

                <button
                  onClick={() => setShowAddTeacher(true)}
                  className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold flex items-center space-x-1 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Staff Member</span>
                </button>
              </div>
            </div>
          </div>

          {/* Batch Success Message Notification Banner */}
          {batchSuccessMessage && (
            <div className="p-3.5 rounded-2xl bg-emerald-900 text-white border border-emerald-700 flex items-center justify-between gap-3 text-xs shadow-md animate-fade-in">
              <div className="flex items-center space-x-2 font-bold">
                <CheckSquare className="w-4 h-4 text-amber-300 flex-shrink-0" />
                <span>{batchSuccessMessage}</span>
              </div>
              <button
                onClick={() => setBatchSuccessMessage(null)}
                className="text-emerald-300 hover:text-white font-extrabold text-sm"
              >
                ✕
              </button>
            </div>
          )}

          {/* Teacher Add Inline Form */}
          {showAddTeacher && (
            <form onSubmit={handleAddTeacherSubmit} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 space-y-3 text-xs">
              <h4 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-emerald-600" />
                <span>Add Staff Member to Sub-School / Main School</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-600 dark:text-slate-300">Teacher / Staff Name</label>
                  <input
                    type="text"
                    required
                    value={newTeacherName}
                    onChange={e => setNewTeacherName(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-600 dark:text-slate-300">Designation</label>
                  <input
                    type="text"
                    value={newTeacherDesignation}
                    onChange={e => setNewTeacherDesignation(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-600 dark:text-slate-300">School Name</label>
                  <input
                    type="text"
                    value={newTeacherSchool}
                    onChange={e => setNewTeacherSchool(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-600 dark:text-slate-300">Pay Level</label>
                  <select
                    value={newTeacherPayLevel}
                    onChange={e => setNewTeacherPayLevel(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                  >
                    {RAJASTHAN_PAY_MATRIX.map(pm => (
                      <option key={pm.level} value={pm.level}>{pm.level} ({pm.designationExamples[0]})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-600 dark:text-slate-300">Current Basic Pay (₹)</label>
                  <input
                    type="number"
                    value={newTeacherBasic}
                    onChange={e => setNewTeacherBasic(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-600 dark:text-slate-300">Date of Joining</label>
                  <input
                    type="date"
                    value={newTeacherJoiningDate}
                    onChange={e => setNewTeacherJoiningDate(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowAddTeacher(false)}
                  className="px-3 py-1 rounded-lg bg-slate-300 dark:bg-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1 rounded-lg bg-emerald-700 text-white font-bold"
                >
                  Save Staff Record
                </button>
              </div>
            </form>
          )}

          {/* Increment Calculation Summary Card */}
          {incrementRecords.length > 0 && (
            <div className="p-3.5 rounded-2xl bg-slate-900 text-white grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Selected Staff</span>
                <span className="text-base font-black text-amber-400">{incrementRecords.length} Staff</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Current Basic Total</span>
                <span className="text-sm font-black font-mono">₹ {incrementRecords.reduce((acc, r) => acc + r.oldBasicPay, 0).toLocaleString('en-IN')}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">New Basic Total</span>
                <span className="text-sm font-black font-mono text-emerald-400">₹ {incrementRecords.reduce((acc, r) => acc + r.newBasicPay, 0).toLocaleString('en-IN')}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Monthly Increase Liability</span>
                <span className="text-sm font-black font-mono text-amber-300">+ ₹ {incrementRecords.reduce((acc, r) => acc + (r.newBasicPay - r.oldBasicPay), 0).toLocaleString('en-IN')}</span>
              </div>
            </div>
          )}

          {/* Increment Multi-Select Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="p-2.5 text-center w-8">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      onChange={handleToggleSelectAll}
                      className="rounded"
                    />
                  </th>
                  <th className="p-2.5">Staff Name & ID</th>
                  <th className="p-2.5">School Name</th>
                  <th className="p-2.5">Pay Level</th>
                  <th className="p-2.5">Current Basic</th>
                  <th className="p-2.5 text-emerald-600 dark:text-emerald-400">New Basic Pay</th>
                  <th className="p-2.5">Increment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200 font-medium">
                {eligibleTeachers.map((t) => {
                  const isSelected = selectedStaffIds.length === 0 || selectedStaffIds.includes(t.id);
                  const calc = calculateAnnualIncrement(t.payLevel, t.currentBasicPay);
                  return (
                    <tr key={t.id} className={`hover:bg-slate-50 dark:hover:bg-slate-800/40 ${isSelected ? 'bg-emerald-50/40 dark:bg-emerald-950/20' : ''}`}>
                      <td className="p-2.5 text-center">
                        <input
                          type="checkbox"
                          checked={selectedStaffIds.includes(t.id)}
                          onChange={() => handleToggleSelectOne(t.id)}
                          className="rounded"
                        />
                      </td>
                      <td className="p-2.5">
                        <div className="font-bold text-slate-900 dark:text-slate-100">{t.name}</div>
                        <div className="text-[10px] text-slate-500">{t.designation} • ID: {t.employeeId}</div>
                      </td>
                      <td className="p-2.5 font-semibold text-slate-700 dark:text-slate-300">
                        {t.schoolName || schoolProfile.schoolName}
                      </td>
                      <td className="p-2.5 font-mono font-bold text-slate-800 dark:text-slate-200">{t.payLevel}</td>
                      <td className="p-2.5 font-mono">₹ {t.currentBasicPay.toLocaleString('en-IN')}</td>
                      <td className="p-2.5 font-mono font-bold text-emerald-700 dark:text-emerald-300">
                        ₹ {calc.newBasicPay.toLocaleString('en-IN')}
                      </td>
                      <td className="p-2.5 font-mono text-xs text-amber-600 dark:text-amber-400 font-bold">
                        + ₹ {(calc.newBasicPay - t.currentBasicPay).toLocaleString('en-IN')}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        /* PREVIEW TAB */
        <div className="space-y-4">
          {/* Action Buttons for Document Share */}
          <div className="flex flex-wrap items-center justify-end gap-2 p-2 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800">
            <span className="text-[11px] font-bold text-slate-500 mr-auto px-2">
              {lang === 'hi' ? 'दस्तावेज़ निर्गम पैनल:' : 'Document Output Panel:'}
            </span>

            <button
              onClick={handleShareIncrementAsImage}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-700 hover:bg-indigo-600 text-white font-bold text-xs flex items-center space-x-1.5 shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{lang === 'hi' ? 'छवि शेयर करें' : 'Share as Image'}</span>
            </button>

            <button
              onClick={handleExportIncrementPdf}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs flex items-center space-x-1.5 shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{lang === 'hi' ? 'पीडीएफ डाउनलोड' : 'Download PDF'}</span>
            </button>

            <button
              onClick={() => {
                const printContents = document.getElementById('peeo-official-increment-order')?.innerHTML;
                const originalContents = document.body.innerHTML;
                if (printContents) {
                  document.body.innerHTML = printContents;
                  window.print();
                  document.body.innerHTML = originalContents;
                  window.location.reload();
                } else {
                  window.print();
                }
              }}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center space-x-1.5 shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{lang === 'hi' ? 'प्रिंट आदेश' : 'Print Order'}</span>
            </button>
          </div>

          {/* Official Office Order Letterhead Sheet Preview */}
          <div id="peeo-official-increment-order" className="p-1 border border-slate-200 dark:border-slate-800 rounded-3xl bg-white dark:bg-slate-900 shadow-sm space-y-2">
            <div className="flex items-center justify-between px-3 pt-2">
              <span className="text-xs font-black uppercase text-slate-500 tracking-wider">
                {exportLang === 'hi' ? 'वार्षिक वेतन वृद्धि कार्यालय आदेश प्रारूप' : 'Official Annual Increment Order Layout'}
              </span>
            </div>

            <PeeoOfficialLetterhead
              schoolProfile={schoolProfile}
              subjectHindi="वार्षिक वेतन वृद्धि (3%) स्वीकृत बाबत (जुलाई/जनवरी माह)"
              subjectEnglish={`Sanction of Annual Increment (3%) Effective ${batchMonth}`}
              exportLang={exportLang}
              onExportLangChange={setExportLang}
              onDownloadPdf={handleExportIncrementPdf}
              onPrint={() => window.print()}
            >
              <div className="space-y-4 text-xs font-medium text-slate-800 dark:text-slate-200">
                <p className="leading-relaxed">
                  {exportLang === 'hi'
                    ? `राजस्थान सिविल सेवा (पुनरीक्षित वेतन) नियम, 2017 के नियम 13 एवं 14 के प्रावधानों के तहत अधोसंरचित कर्मचारियों/शिक्षकों को निम्नानुसार देय तिथि से 3% वार्षिक वेतन वृद्धि स्वीकृत की जाती है:`
                    : `In exercise of powers conferred under Rules 13 & 14 of Rajasthan Civil Services (Revised Pay) Rules, 2017, annual increment @ 3% is hereby sanctioned to the undermentioned staff members:`}
                </p>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border border-slate-300 dark:border-slate-700">
                    <thead className="bg-slate-100 dark:bg-slate-800 font-bold border-b">
                      <tr>
                        <th className="p-2 border-r">#</th>
                        <th className="p-2 border-r">{exportLang === 'hi' ? 'कार्मिक का नाम व पद' : 'Name & Desig'}</th>
                        <th className="p-2 border-r">{exportLang === 'hi' ? 'पे लेवल' : 'Pay Level'}</th>
                        <th className="p-2 border-r">{exportLang === 'hi' ? 'पूर्व मूल वेतन' : 'Old Basic'}</th>
                        <th className="p-2 border-r">{exportLang === 'hi' ? 'स्वीकृत मूल वेतन' : 'New Basic'}</th>
                        <th className="p-2">{exportLang === 'hi' ? 'प्रभावी तिथि' : 'Effective Date'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                      {incrementRecords.map((r, idx) => (
                        <tr key={r.teacherId}>
                          <td className="p-2 border-r text-center font-bold">{idx + 1}</td>
                          <td className="p-2 border-r font-bold">{r.teacherName} ({r.designation})</td>
                          <td className="p-2 border-r font-mono">{r.payLevel}</td>
                          <td className="p-2 border-r font-mono">₹ {r.oldBasicPay.toLocaleString('en-IN')}</td>
                          <td className="p-2 border-r font-mono font-black text-emerald-700 dark:text-emerald-300">
                            ₹ {r.newBasicPay.toLocaleString('en-IN')}
                          </td>
                          <td className="p-2 font-mono">{`01/${batchMonth === 'July' ? '07' : '01'}/2026`}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </PeeoOfficialLetterhead>
          </div>
        </div>
      )}
      </div>
      </AdminPinLock>
      )}

      {/* 2. SCHOOL TIME-TABLE GENERATOR */}
      {activeSubTab === 'timetable' && (
        <div className="relative">
          <button
            onClick={() => setActiveSubTab(null)}
            className="absolute top-4 right-4 z-30 p-2 rounded-xl bg-white/90 hover:bg-emerald-50 dark:bg-slate-900/90 dark:hover:bg-emerald-950/30 text-slate-500 hover:text-emerald-700 dark:text-slate-400 dark:hover:text-emerald-400 transition-all cursor-pointer active:scale-95 border border-slate-200/60 dark:border-slate-800 shadow-sm"
            title={lang === 'hi' ? 'वापस' : 'Back'}
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <TimeTableGenerator
            schoolProfile={schoolProfile}
            teachers={teachers}
            lang={lang}
          />
        </div>
      )}

      {/* 3. INCHARGE MAPPING & OFFICIAL ORDER GENERATOR */}
      {activeSubTab === 'incharge' && (
        <div className="relative">
          <button
            onClick={() => setActiveSubTab(null)}
            className="absolute top-4 right-4 z-30 p-2 rounded-xl bg-white/90 hover:bg-emerald-50 dark:bg-slate-900/90 dark:hover:bg-emerald-950/30 text-slate-500 hover:text-emerald-700 dark:text-slate-400 dark:hover:text-emerald-400 transition-all cursor-pointer active:scale-95 border border-slate-200/60 dark:border-slate-800 shadow-sm"
            title={lang === 'hi' ? 'वापस' : 'Back'}
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <WorkInchargeMapping
            schoolProfile={schoolProfile}
            teachers={teachers}
            incharges={incharges}
            onUpdateIncharges={onUpdateIncharges}
            lang={lang}
          />
        </div>
      )}

      {/* 4. VERIFICATION & ANALYTICS REPORTS ENGINE (PRAMANIKARAN REPORTS) */}
      {(activeSubTab === 'pramanikaran' || activeSubTab === 'apar') && (
        <div className="relative">
          <button
            onClick={() => setActiveSubTab(null)}
            className="absolute top-4 right-4 z-30 p-2 rounded-xl bg-white/90 hover:bg-emerald-50 dark:bg-slate-900/90 dark:hover:bg-emerald-950/30 text-slate-500 hover:text-emerald-700 dark:text-slate-400 dark:hover:text-emerald-400 transition-all cursor-pointer active:scale-95 border border-slate-200/60 dark:border-slate-800 shadow-sm"
            title={lang === 'hi' ? 'वापस' : 'Back'}
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <PramanikaranReportsEngine
            schoolProfile={schoolProfile}
            aparRecords={aparRecords}
            aadhaarRecords={aadhaarRecords}
            apaarRecords={apaarRecords}
            onUpdateAparRecords={handleUpdateApar}
            onUpdateAadhaarRecords={handleUpdateAadhaar}
            onUpdateApaarRecords={handleUpdateApaar}
            lang={lang}
          />
        </div>
      )}

      {/* 4. DAILY SUBSTITUTION / ADJUSTMENT */}
      {activeSubTab === 'substitution' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 shadow-md border border-slate-200 dark:border-slate-800 space-y-3 relative">
          <button
            onClick={() => setActiveSubTab(null)}
            className="absolute top-4 right-4 z-20 p-2 rounded-xl bg-slate-100 hover:bg-emerald-50 dark:bg-slate-850 dark:hover:bg-emerald-950/30 text-slate-500 hover:text-emerald-700 dark:text-slate-400 dark:hover:text-emerald-400 transition-all cursor-pointer active:scale-95 border border-slate-200/60 dark:border-slate-800"
            title={lang === 'hi' ? 'वापस' : 'Back'}
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-emerald-600" />
                <span>{t('dailySubstitutionTitle', lang)}</span>
              </h3>
              <p className="text-[11px] text-slate-500">
                {lang === 'hi' ? 'दैनिक अनुपस्थित शिक्षक कालांश स्थानापन्न (Arrangements)' : 'Daily Absent Teacher Period Substitution Sheet'}
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
            <h4 className="font-bold text-slate-800 dark:text-slate-100">Add Substitution for Today</h4>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-semibold text-slate-600 dark:text-slate-300">Absent Teacher</label>
                <select
                  value={absentTeacher}
                  onChange={e => setAbsentTeacher(e.target.value)}
                  className="w-full px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                >
                  <option value="">Select Absent Teacher...</option>
                  {teachers.map(t => (
                    <option key={t.id} value={t.name}>{t.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-600 dark:text-slate-300">Period & Class</label>
                <div className="flex space-x-1">
                  <select
                    value={subPeriod}
                    onChange={e => setSubPeriod(Number(e.target.value))}
                    className="w-1/3 px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono"
                  >
                    {[1,2,3,4,5,6,7,8].map(p => <option key={p} value={p}>P{p}</option>)}
                  </select>
                  <input
                    type="text"
                    value={subClass}
                    onChange={e => setSubClass(e.target.value)}
                    className="w-2/3 px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-slate-600 dark:text-slate-300">Arranged Free Teacher</label>
              <select
                value={arrangedTeacher}
                onChange={e => setArrangedTeacher(e.target.value)}
                className="w-full px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
              >
                <option value="">Select Free Teacher...</option>
                {teachers.map(t => (
                  <option key={t.id} value={t.name}>{t.name} ({t.subject})</option>
                ))}
              </select>
            </div>

            <button
              onClick={handleAddArrangement}
              className="w-full py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold"
            >
              Add to Today's Substitution Register
            </button>
          </div>

          {/* Today's Arrangement Log */}
          <div className="space-y-2">
            <h4 className="font-bold text-xs text-slate-700 dark:text-slate-300">Today's Arrangements</h4>
            {arrangements.map(a => (
              <div key={a.id} className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 text-xs flex items-center justify-between">
                <div>
                  <span className="font-bold text-amber-900 dark:text-amber-200">Period {a.period} ({a.cls}): </span>
                  <span className="line-through text-slate-500 mr-1">{a.absent}</span>
                  <span className="font-bold text-emerald-800 dark:text-emerald-300">➔ {a.sub}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. EVENT INVITATION & NOTICE GENERATOR */}
      {activeSubTab === 'notice' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 shadow-md border border-slate-200 dark:border-slate-800 space-y-3 relative">
          <button
            onClick={() => setActiveSubTab(null)}
            className="absolute top-4 right-4 z-20 p-2 rounded-xl bg-slate-100 hover:bg-emerald-50 dark:bg-slate-850 dark:hover:bg-emerald-950/30 text-slate-500 hover:text-emerald-700 dark:text-slate-400 dark:hover:text-emerald-400 transition-all cursor-pointer active:scale-95 border border-slate-200/60 dark:border-slate-800"
            title={lang === 'hi' ? 'वापस' : 'Back'}
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                <Send className="w-4 h-4 text-emerald-600" />
                <span>{t('eventNoticeTitle', lang)}</span>
              </h3>
              <p className="text-[11px] text-slate-500">
                {lang === 'hi' ? 'शिक्षक-अभिभावक बैठक व राष्ट्रीय पर्व आमंत्रण पत्र' : 'PTM, Independence Day & Event Notice Generator'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <label className="block font-semibold text-slate-600 dark:text-slate-300 mb-1">Event Type</label>
              <select
                value={noticeEventType}
                onChange={e => setNoticeEventType(e.target.value)}
                className="w-full px-2 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
              >
                <option value="PTM (शिक्षक-अभिभावक बैठक)">PTM (शिक्षक-अभिभावक बैठक)</option>
                <option value="Independence Day (स्वतंत्रता दिवस 15 अगस्त)">Independence Day (15 Aug)</option>
                <option value="Republic Day (गणतंत्र दिवस 26 जनवरी)">Republic Day (26 Jan)</option>
                <option value="Annual Sports Day (वार्षिक खेलकूद)">Annual Sports Day</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-600 dark:text-slate-300 mb-1">Date & Time</label>
              <input
                type="text"
                value={`${noticeDate} at ${noticeTime}`}
                onChange={e => setNoticeDate(e.target.value)}
                className="w-full px-2 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono"
              />
            </div>
          </div>

          {/* Generated Draft Preview */}
          <div className="p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 text-xs space-y-2">
            <h4 className="font-bold text-emerald-900 dark:text-emerald-200">Official Notice Preview</h4>
            <div className="font-mono text-[11px] whitespace-pre-wrap bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200">
{`📢 **आमंत्रण व आवश्यक सूचना** 📢
विद्यालय: ${schoolProfile.schoolNameHindi} (${schoolProfile.district})

समस्त सम्पादनीय अभिभावकों एवं ग्रामवासियों को सहर्ष सूचित किया जाता है कि विद्यालय परिसर में ${noticeEventType} का गरिमामय आयोजन किया जा रहा है।

🗓️ दिनांक: ${noticeDate}
⏰ समय: ${noticeTime}
📍 स्थान: ${noticeVenue}
मुख्य अतिथि: ${noticeChiefGuest}

आप सभी की गरिमामयी उपस्थिति प्रार्थनीय है।

निवेदक:
${schoolProfile.principalName} (प्रधानाचार्य व समस्त विद्यालय परिवार)`}
            </div>

            <div className="flex justify-end space-x-2 pt-1">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`📢 *आमंत्रण सूचना* 📢\n${schoolProfile.schoolNameHindi}\nआयोजन: ${noticeEventType}\nदिनांक: ${noticeDate} समय: ${noticeTime}`);
                  alert('Notice text copied to clipboard!');
                }}
                className="px-3 py-1.5 rounded-lg bg-emerald-700 text-white font-bold flex items-center space-x-1"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Copy for WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. PHYSICAL VERIFICATION (BHAUTIK SATYAPAN) */}
      {activeSubTab === 'satyapan' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 shadow-md border border-slate-200 dark:border-slate-800 space-y-3 relative">
          <button
            onClick={() => setActiveSubTab(null)}
            className="absolute top-4 right-4 z-20 p-2 rounded-xl bg-slate-100 hover:bg-emerald-50 dark:bg-slate-850 dark:hover:bg-emerald-950/30 text-slate-500 hover:text-emerald-700 dark:text-slate-400 dark:hover:text-emerald-400 transition-all cursor-pointer active:scale-95 border border-slate-200/60 dark:border-slate-800"
            title={lang === 'hi' ? 'वापस' : 'Back'}
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{t('physicalVerificationTitle', lang)}</span>
              </h3>
              <p className="text-[11px] text-slate-500">
                {lang === 'hi' ? 'वार्षिक स्टॉक व संपत्ति भौतिक सत्यापन रिपोर्ट' : 'Annual School Furniture & Equipment Verification'}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            {satyapanItems.map(item => (
              <div key={item.id} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-800 dark:text-slate-100">{item.name}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{item.remarks}</div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                  Verified
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 8. DEPARTMENTAL APPLICATIONS HUB */}
      {activeSubTab === 'applications' && (
        <DepartmentalApplicationsHub
          schoolProfile={schoolProfile}
          lang={lang}
          onBack={() => setActiveSubTab(null)}
        />
      )}

    </div>
  );
};
