import React, { useState } from 'react';
import { SchoolProfile, Language, TeacherDailyDiaryEntry, PeriodDiaryEntry } from '../../types';
import {
  FileText,
  Calendar,
  UserCheck,
  Printer,
  Plus,
  Trash2,
  Edit3,
  Check,
  Search,
  Sparkles,
  ArrowLeft,
  Copy,
  Clock,
  BookOpen,
  Award,
  Users,
  AlertCircle,
  FileCheck,
  CheckCircle2,
  ChevronDown,
  Layers,
  Save,
  RotateCcw
} from 'lucide-react';

interface DailyDiaryModuleProps {
  schoolProfile?: SchoolProfile;
  lang: Language;
  onBack?: () => void;
}

const INITIAL_SAMPLE_DIARY: TeacherDailyDiaryEntry[] = [
  {
    id: 'diary-1',
    date: new Date().toISOString().split('T')[0],
    dayOfWeek: 'सोमवार (Monday)',
    teacherName: 'रमेश कुमार शर्मा',
    employeeId: 'RJJP20181200456',
    designation: 'वरिष्ठ अध्यापक (गणित)',
    assignedClass: 'कक्षा 9-A',
    totalStudents: 38,
    presentStudents: 35,
    absentStudents: 3,
    absentRemarks: 'अनुपस्थित छात्र: 1. राहुल (रोल 12) - अस्वस्थता सूचना, 2. पूजा (रोल 18) - पारिवारिक कार्य, 3. विकास (रोल 29) - बिना सूचना अनुपस्थित (अभिभावक को फोन किया गया)।',
    prarthnaSabhaDuty: 'प्रार्थना सभा में समाचार वाचन निरीक्षण एवं अनुशासन व्यवस्था संभालना।',
    cceaNoBagDayActivity: 'गणित क्लब के अंतर्गत गणितीय पहेलियाँ एवं ज्यामितीय मॉडल निर्माण गतिविधि।',
    principalRemarks: 'अध्यापन कार्य व्यवस्थित, टीएलएम का प्रयोग उत्तम। बाल सभा गतिविधि सराहनीय।',
    verifiedByPrincipal: true,
    periods: [
      {
        periodNo: 1,
        className: 'कक्षा 9-A',
        subject: 'गणित',
        topicTaught: 'अध्याय 4: दो चरों वाले रैखिक समीकरण (समीकरण निरूपण)',
        learningOutcome: 'विद्यार्थी दो चरों वाले रैखिक समीकरण का बीजीय निरूपण करना सीखे।',
        tlmActivity: 'श्यामपट्ट (Blackboard) एवं जियोजीब्रा ग्राफ शीट मॉडल',
        homeworkGiven: 'प्रश्नावली 4.1 प्रश्न संख्या 1 से 4 हल करना'
      },
      {
        periodNo: 2,
        className: 'कक्षा 10-B',
        subject: 'गणित',
        topicTaught: 'अध्याय 8: त्रिकोणमिति का परिचय (त्रिकोणमितीय अनुपात)',
        learningOutcome: 'विद्यार्थी समकोण त्रिभुज में sin, cos, tan के संबंध को समझ सके।',
        tlmActivity: 'समकोण त्रिभुज कट-आउट एवं सूत्र चाट',
        homeworkGiven: 'प्रश्नावली 8.1 प्रश्न 1, 2, 3'
      },
      {
        periodNo: 3,
        className: 'कक्षा 9-A',
        subject: 'विज्ञान (सह-शिक्षण)',
        topicTaught: 'अध्याय 3: परमाणु एवं अणु (रासायनिक संयोजन नियम)',
        learningOutcome: 'द्रव्यमान संरक्षण के नियम का व्यावहारिक प्रयोग समझा।',
        tlmActivity: 'प्रयोगशाला उपकरण प्रदर्शन (तराजू व बीकर)',
        homeworkGiven: 'संयोजन नियम की परिभाषा लिखकर लाना'
      },
      {
        periodNo: 4,
        className: 'कक्षा 8-C',
        subject: 'गणित',
        topicTaught: 'अध्याय 2: एक चर वाले रैखिक समीकरण',
        learningOutcome: 'समीकरण के पक्षांतरण नियम की समझ विकसित हुई।',
        tlmActivity: 'कार्ड गेम गतिविधि',
        homeworkGiven: 'अभ्यास 2.2 के 5 प्रश्न'
      },
      {
        periodNo: 5,
        className: 'कक्षा 9-A',
        subject: 'पुस्तकालय / स्वाध्याय',
        topicTaught: 'संदर्भ पुस्तकें एवं गणित पहेलियों का अध्ययन',
        learningOutcome: 'स्वाध्याय की प्रवृत्ति एवं तार्किक क्षमता का विकास।',
        tlmActivity: 'पुस्तकालय गणित पुस्तकें वितरण',
        homeworkGiven: '2 गणितीय पहेलियाँ लिखकर लाना'
      },
      {
        periodNo: 6,
        className: 'कक्षा 10-A',
        subject: 'उपचारात्मक शिक्षण (Remedial)',
        topicTaught: 'बीजगणितीय सर्वसमिकाएं (कमजोर छात्रों हेतु पुनरावृत्ति)',
        learningOutcome: 'C-ग्रेड छात्रों द्वारा (a+b)² का सूत्र प्रयोग।',
        tlmActivity: 'व्यक्तिगत मार्गदर्शन एवं वर्कशीट हल',
        homeworkGiven: 'वर्कशीट पृष्ठ 12 हल करना'
      },
      {
        periodNo: 7,
        className: 'कक्षा 9-A',
        subject: 'शारीरिक एवं स्वास्थ्य शिक्षा',
        topicTaught: 'योगाभ्यास व प्राणायाम एवं व्यक्तिगत स्वच्छता',
        learningOutcome: 'छात्रों में अनुशासित जीवनशैली व स्वास्थ्य चेतना।',
        tlmActivity: 'क्रीड़ा मैदान में योगाभ्यास प्रदर्शन',
        homeworkGiven: 'दैनिक 10 मिनट अनुलोम-विलोम का अभ्यास'
      },
      {
        periodNo: 8,
        className: 'कक्षा 9-A',
        subject: 'समीक्षा व दैनिक कार्य पंजी इन्द्राज',
        topicTaught: 'गृहकार्य जांच एवं शाला दर्पण फीडिंग तैयारी',
        learningOutcome: 'छात्रों की उत्तर पुस्तिकाओं की जांच पूर्ण।',
        tlmActivity: 'कॉपी चेकिंग व सुलेख निर्देश',
        homeworkGiven: 'अपूर्ण कार्य पूरा करना'
      }
    ]
  }
];

export const DailyDiaryModule: React.FC<DailyDiaryModuleProps> = ({
  schoolProfile,
  lang,
  onBack
}) => {
  // Local Storage state for diary entries
  const [diaryEntries, setDiaryEntries] = useState<TeacherDailyDiaryEntry[]>(() => {
    try {
      const saved = localStorage.getItem('peeo_teacher_daily_diary');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load daily diary from storage:', e);
    }
    return INITIAL_SAMPLE_DIARY;
  });

  const saveEntries = (entries: TeacherDailyDiaryEntry[]) => {
    setDiaryEntries(entries);
    try {
      localStorage.setItem('peeo_teacher_daily_diary', JSON.stringify(entries));
    } catch (e) {
      console.error('Failed to save daily diary:', e);
    }
  };

  // Filter & Search states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDateFilter, setSelectedDateFilter] = useState('');
  const [selectedClassFilter, setSelectedClassFilter] = useState('All');

  // Modal & Form State
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingEntry, setEditingEntry] = useState<TeacherDailyDiaryEntry | null>(null);

  // Active Selected Entry for Detailed View/Print
  const [activeEntry, setActiveEntry] = useState<TeacherDailyDiaryEntry>(diaryEntries[0] || INITIAL_SAMPLE_DIARY[0]);

  // New/Editing Form State
  const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0]);
  const [formDay, setFormDay] = useState('सोमवार (Monday)');
  const [formTeacherName, setFormTeacherName] = useState('रमेश कुमार शर्मा');
  const [formEmployeeId, setFormEmployeeId] = useState('RJJP20181200456');
  const [formDesignation, setFormDesignation] = useState('वरिष्ठ अध्यापक (गणित)');
  const [formAssignedClass, setFormAssignedClass] = useState('कक्षा 9-A');
  const [formTotalStudents, setFormTotalStudents] = useState(38);
  const [formPresentStudents, setFormPresentStudents] = useState(35);
  const [formAbsentStudents, setFormAbsentStudents] = useState(3);
  const [formAbsentRemarks, setFormAbsentRemarks] = useState('1. राहुल (रोल 12) - अस्वस्थता, 2. पूजा (रोल 18) - पारिवारिक कार्य');
  const [formPrarthnaDuty, setFormPrarthnaDuty] = useState('प्रार्थना सभा में समाचार वाचन एवं अनुशासन दायित्व संभालना।');
  const [formCceaActivity, setFormCceaActivity] = useState('बाल सभा / गणित क्लब - मॉडल निर्माण गतिविधि।');
  const [formPrincipalRemarks, setFormPrincipalRemarks] = useState('अध्यापन कार्य सुचारू एवं गुणवत्तापूर्ण।');
  const [formVerified, setFormVerified] = useState(true);

  // Periods array (1 to 8)
  const [formPeriods, setFormPeriods] = useState<PeriodDiaryEntry[]>([
    { periodNo: 1, className: 'कक्षा 9-A', subject: 'गणित', topicTaught: '', learningOutcome: '', tlmActivity: '', homeworkGiven: '' },
    { periodNo: 2, className: 'कक्षा 10-B', subject: 'गणित', topicTaught: '', learningOutcome: '', tlmActivity: '', homeworkGiven: '' },
    { periodNo: 3, className: 'कक्षा 9-A', subject: 'विज्ञान', topicTaught: '', learningOutcome: '', tlmActivity: '', homeworkGiven: '' },
    { periodNo: 4, className: 'कक्षा 8-C', subject: 'गणित', topicTaught: '', learningOutcome: '', tlmActivity: '', homeworkGiven: '' },
    { periodNo: 5, className: 'कक्षा 9-A', subject: 'पुस्तकालय', topicTaught: '', learningOutcome: '', tlmActivity: '', homeworkGiven: '' },
    { periodNo: 6, className: 'कक्षा 10-A', subject: 'उपचारात्मक (Remedial)', topicTaught: '', learningOutcome: '', tlmActivity: '', homeworkGiven: '' },
    { periodNo: 7, className: 'कक्षा 9-A', subject: 'शारीरिक शिक्षा', topicTaught: '', learningOutcome: '', tlmActivity: '', homeworkGiven: '' },
    { periodNo: 8, className: 'कक्षा 9-A', subject: 'गृहकार्य जांच/समीक्षा', topicTaught: '', learningOutcome: '', tlmActivity: '', homeworkGiven: '' }
  ]);

  // Open modal for new entry
  const handleOpenNewEntry = () => {
    setEditingEntry(null);
    setFormDate(new Date().toISOString().split('T')[0]);
    setFormDay('सोमवार (Monday)');
    setFormTeacherName('रमेश कुमार शर्मा');
    setFormEmployeeId('RJJP20181200456');
    setFormDesignation('वरिष्ठ अध्यापक (गणित)');
    setFormAssignedClass('कक्षा 9-A');
    setFormTotalStudents(38);
    setFormPresentStudents(35);
    setFormAbsentStudents(3);
    setFormAbsentRemarks('अनुपस्थित छात्र: 1. राहुल (रोल 12) - बुखार, 2. पूजा (रोल 18) - पारिवारिक शादी।');
    setFormPrarthnaDuty('प्रार्थना सभा में समाचार वाचन एवं सुविचार वाचन व्यवस्था।');
    setFormCceaActivity('नो-बैग डे बाल सभा / प्रश्नोत्तरी प्रतियोगिता।');
    setFormPrincipalRemarks('अध्यापन कार्य संतोषजनक।');
    setFormVerified(true);
    setFormPeriods([
      { periodNo: 1, className: 'कक्षा 9-A', subject: 'गणित', topicTaught: 'अध्याय 4: दो चरों वाले रैखिक समीकरण', learningOutcome: 'समीकरण हल विधि सीखी', tlmActivity: 'श्यामपट्ट व चार्ट', homeworkGiven: 'प्रश्न 1 से 3' },
      { periodNo: 2, className: 'कक्षा 10-B', subject: 'गणित', topicTaught: 'अध्याय 8: त्रिकोणमिति अनुपात', learningOutcome: 'अनुपात सूत्र समझे', tlmActivity: 'मॉडल त्रिभुज', homeworkGiven: 'अभ्यास 8.1' },
      { periodNo: 3, className: 'कक्षा 9-A', subject: 'विज्ञान', topicTaught: 'अध्याय 3: परमाणु सिद्धांत', learningOutcome: 'डाल्टन सिद्धांत समझा', tlmActivity: 'एटम मॉडल', homeworkGiven: 'संक्षेप उत्तर' },
      { periodNo: 4, className: 'कक्षा 8-C', subject: 'गणित', topicTaught: 'बीजगणित पक्षांतरण', learningOutcome: 'चर-अचर नियम समझे', tlmActivity: 'फ्लैश कार्ड', homeworkGiven: 'प्रश्न 4,5' },
      { periodNo: 5, className: 'कक्षा 9-A', subject: 'पुस्तकालय', topicTaught: 'स्वाध्याय एवं गणितीय खेल', learningOutcome: 'पहेलियां हल कीं', tlmActivity: 'पुस्तके', homeworkGiven: 'पहेली अभ्यास' },
      { periodNo: 6, className: 'कक्षा 10-A', subject: 'उपचारात्मक', topicTaught: 'सर्वसमिका पुनरावृत्ति', learningOutcome: 'सूत्र याद किए', tlmActivity: 'वर्कशीट', homeworkGiven: 'अभ्यास पत्र' },
      { periodNo: 7, className: 'कक्षा 9-A', subject: 'खेलकूद/पीटी', topicTaught: 'योगाभ्यास व प्राणायाम', learningOutcome: 'स्वास्थ्य नियम समझे', tlmActivity: 'मैदान', homeworkGiven: 'दैनिक नियम' },
      { periodNo: 8, className: 'कक्षा 9-A', subject: 'गृहकार्य समीक्षा', topicTaught: 'कॉपी चेकिंग व सुलेख', learningOutcome: 'अशुद्धि सुधार', tlmActivity: 'नोटबुक', homeworkGiven: 'अपूर्ण कार्य' }
    ]);
    setShowFormModal(true);
  };

  // Open modal for editing
  const handleEditEntry = (entry: TeacherDailyDiaryEntry) => {
    setEditingEntry(entry);
    setFormDate(entry.date);
    setFormDay(entry.dayOfWeek);
    setFormTeacherName(entry.teacherName);
    setFormEmployeeId(entry.employeeId);
    setFormDesignation(entry.designation);
    setFormAssignedClass(entry.assignedClass);
    setFormTotalStudents(entry.totalStudents);
    setFormPresentStudents(entry.presentStudents);
    setFormAbsentStudents(entry.absentStudents);
    setFormAbsentRemarks(entry.absentRemarks);
    setFormPrarthnaDuty(entry.prarthnaSabhaDuty);
    setFormCceaActivity(entry.cceaNoBagDayActivity);
    setFormPrincipalRemarks(entry.principalRemarks || '');
    setFormVerified(entry.verifiedByPrincipal ?? true);
    setFormPeriods(entry.periods);
    setShowFormModal(true);
  };

  // Save/Update entry
  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedEntry: TeacherDailyDiaryEntry = {
      id: editingEntry ? editingEntry.id : `diary-${Date.now()}`,
      date: formDate,
      dayOfWeek: formDay,
      teacherName: formTeacherName,
      employeeId: formEmployeeId,
      designation: formDesignation,
      assignedClass: formAssignedClass,
      totalStudents: Number(formTotalStudents),
      presentStudents: Number(formPresentStudents),
      absentStudents: Number(formAbsentStudents),
      absentRemarks: formAbsentRemarks,
      prarthnaSabhaDuty: formPrarthnaDuty,
      cceaNoBagDayActivity: formCceaActivity,
      principalRemarks: formPrincipalRemarks,
      verifiedByPrincipal: formVerified,
      periods: formPeriods
    };

    if (editingEntry) {
      const nextList = diaryEntries.map(e => e.id === editingEntry.id ? updatedEntry : e);
      saveEntries(nextList);
    } else {
      const nextList = [updatedEntry, ...diaryEntries];
      saveEntries(nextList);
    }

    setActiveEntry(updatedEntry);
    setShowFormModal(false);
  };

  // Delete entry
  const handleDeleteEntry = (id: string) => {
    if (window.confirm('क्या आप इस दैनिक दैनन्दिनी प्रविष्टि को हटाना चाहते हैं?')) {
      const nextList = diaryEntries.filter(e => e.id !== id);
      saveEntries(nextList);
      if (activeEntry.id === id && nextList.length > 0) {
        setActiveEntry(nextList[0]);
      }
    }
  };

  // Handle Period Field change
  const handlePeriodChange = (index: number, key: keyof PeriodDiaryEntry, value: string | number) => {
    const updated = [...formPeriods];
    updated[index] = { ...updated[index], [key]: value };
    setFormPeriods(updated);
  };

  // Print Official Daily Diary Page
  const handlePrintDiaryPage = () => {
    const printWin = window.open('', '_blank');
    if (!printWin) {
      window.print();
      return;
    }

    const docContent = document.getElementById('official-daily-diary-paper')?.innerHTML || '';

    printWin.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>दैनिक शिक्षक दैनन्दिनी - ${activeEntry.date}</title>
          <style>
            @page { size: A4 portrait; margin: 12mm; }
            body { font-family: 'Segoe UI', 'Noto Sans Devanagari', Arial, sans-serif; padding: 15px; color: #0f172a; line-height: 1.5; background: #fff; }
            .official-container { border: 2px solid #0f172a; padding: 20px; border-radius: 6px; max-width: 850px; margin: 0 auto; }
            .header-box { text-align: center; border-bottom: 2px double #0f172a; padding-bottom: 10px; margin-bottom: 12px; }
            .header-title { font-size: 18px; font-weight: 800; color: #047857; text-transform: uppercase; margin-bottom: 2px; }
            .header-sub { font-size: 12px; font-weight: 700; color: #334155; }
            .meta-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; font-size: 11px; font-weight: 700; background: #f8fafc; border: 1px solid #cbd5e1; padding: 8px; margin-bottom: 12px; border-radius: 4px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 12px; font-size: 11px; }
            th { background: #e2e8f0; color: #0f172a; font-weight: 800; border: 1px solid #475569; padding: 6px 4px; text-align: center; }
            td { border: 1px solid #64748b; padding: 5px 4px; vertical-align: top; }
            .section-box { border: 1px solid #64748b; padding: 8px; margin-bottom: 10px; font-size: 11px; border-radius: 4px; background: #fafafa; }
            .section-title { font-weight: 800; color: #047857; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px; margin-bottom: 6px; }
            .flex-between { display: flex; justify-content: space-between; align-items: flex-end; }
            .stamp-area { border: 1px dashed #94a3b8; height: 50px; width: 120px; text-align: center; font-size: 9px; color: #94a3b8; display: flex; align-items: center; justify-content: center; }
          </style>
        </head>
        <body>
          <div class="official-container">
            ${docContent}
          </div>
          <script>window.onload = function() { window.print(); }</script>
        </body>
      </html>
    `);
    printWin.document.close();
  };

  // Filtered List
  const filteredDiaryList = diaryEntries.filter(entry => {
    const matchSearch = entry.teacherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.date.includes(searchTerm) ||
      entry.periods.some(p => p.subject.toLowerCase().includes(searchTerm.toLowerCase()) || p.topicTaught.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchDate = selectedDateFilter ? entry.date === selectedDateFilter : true;
    const matchClass = selectedClassFilter !== 'All' ? entry.assignedClass === selectedClassFilter : true;

    return matchSearch && matchDate && matchClass;
  });

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-6 shadow-xl border border-slate-200 dark:border-slate-800 space-y-6">
      
      {/* Module Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-slate-100 leading-tight flex items-center gap-2">
              <span>{lang === 'hi' ? 'दैनिक शिक्षक दैनन्दिनी (Daily Diary)' : "Teacher's Daily Diary Module"}</span>
              <span className="px-2 py-0.5 text-[10px] uppercase font-bold rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300">
                राजकीय मानक
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {lang === 'hi'
                ? 'राजस्थान प्राथमिक एवं माध्यमिक शिक्षा विभाग मानक अनुसार कालांशवार अध्यापन, गृहकार्य, बाल सभा व उपस्थिति इन्द्राज'
                : 'Log period-wise lesson plans, TLM, homework, student attendance & CCEA activities'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleOpenNewEntry}
            className="py-2 px-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 text-amber-300" />
            <span>{lang === 'hi' ? 'नवीन प्रविष्टि जोड़ें' : 'New Diary Entry'}</span>
          </button>

          {onBack && (
            <button
              onClick={onBack}
              className="py-2 px-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center gap-1 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">{lang === 'hi' ? 'वापस' : 'Back'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Left Column Filters & Diary List, Right Column Paper Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Filter & Search List (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Search & Filter Controls */}
          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2.5">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder={lang === 'hi' ? 'विषय, दिनांक, शिक्षक या पाठ खोजें...' : 'Search subject, topic or date...'}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-0.5">दिनांक फ़िल्टर:</label>
                <input
                  type="date"
                  value={selectedDateFilter}
                  onChange={e => setSelectedDateFilter(e.target.value)}
                  className="w-full px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-0.5">कक्षा फ़िल्टर:</label>
                <select
                  value={selectedClassFilter}
                  onChange={e => setSelectedClassFilter(e.target.value)}
                  className="w-full px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold"
                >
                  <option value="All">समस्त कक्षाएं (All)</option>
                  <option value="कक्षा 9-A">कक्षा 9-A</option>
                  <option value="कक्षा 10-A">कक्षा 10-A</option>
                  <option value="कक्षा 10-B">कक्षा 10-B</option>
                  <option value="कक्षा 8-C">कक्षा 8-C</option>
                </select>
              </div>
            </div>
          </div>

          {/* Diary Entry Cards List */}
          <div className="space-y-3 max-h-[620px] overflow-y-auto pr-1">
            {filteredDiaryList.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
                <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-600 dark:text-slate-400">
                  {lang === 'hi' ? 'कोई दैनिक प्रविष्टि नहीं मिली।' : 'No diary entries found.'}
                </p>
                <button
                  onClick={handleOpenNewEntry}
                  className="mt-3 px-3 py-1.5 rounded-xl bg-emerald-700 text-white font-bold text-xs inline-flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>प्रथम प्रविष्टि दर्ज करें</span>
                </button>
              </div>
            ) : (
              filteredDiaryList.map(entry => {
                const isSelected = activeEntry.id === entry.id;
                return (
                  <div
                    key={entry.id}
                    onClick={() => setActiveEntry(entry)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group ${
                      isSelected
                        ? 'bg-slate-900 text-white border-slate-800 shadow-md ring-2 ring-emerald-500/50'
                        : 'bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/60 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-bold ${
                          isSelected ? 'bg-emerald-800 text-emerald-200' : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        }`}>
                          {entry.date}
                        </span>
                        <span className={`text-[11px] font-bold ${isSelected ? 'text-amber-300' : 'text-slate-700 dark:text-slate-300'}`}>
                          {entry.dayOfWeek}
                        </span>
                      </div>

                      <div className="flex items-center space-x-1">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleEditEntry(entry); }}
                          title="संपादित करें"
                          className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-all"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDeleteEntry(entry.id); }}
                          title="हटाएं"
                          className="p-1.5 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-950 text-slate-400 hover:text-rose-600 transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-extrabold text-xs flex items-center justify-between">
                        <span>{entry.teacherName} ({entry.assignedClass})</span>
                        <span className={`text-[10px] font-normal ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                          उपस्थिति: {entry.presentStudents}/{entry.totalStudents}
                        </span>
                      </h4>
                      <p className={`text-[11px] line-clamp-1 ${isSelected ? 'text-slate-300' : 'text-slate-600 dark:text-slate-400'}`}>
                        मुख्य पाठ: {entry.periods[0]?.subject} - {entry.periods[0]?.topicTaught || 'विभागीय अध्यापन'}
                      </p>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-slate-200/40 dark:border-slate-800 flex items-center justify-between text-[10px]">
                      <span className="flex items-center gap-1 text-slate-400">
                        <Clock className="w-3 h-3" />
                        <span>8 कालांश इन्द्राज</span>
                      </span>
                      {entry.verifiedByPrincipal ? (
                        <span className="flex items-center gap-1 text-emerald-500 font-bold">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>प्रधानाचार्य द्वारा सत्यापित</span>
                        </span>
                      ) : (
                        <span className="text-amber-500 font-bold">प्रधानाचार्य अवलोकन लंबित</span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Printable Paper Preview (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/40 p-3 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center space-x-2">
              <Printer className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                {lang === 'hi' ? 'दैनिक दैनन्दिनी राजकीय प्रपत्र (A4 Preview)' : 'Official Paper View'}
              </span>
            </div>

            <button
              onClick={handlePrintDiaryPage}
              className="py-2 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4 text-amber-300" />
              <span>{lang === 'hi' ? 'दैनिक दैनन्दिनी प्रिंट करें' : 'Print Diary Page'}</span>
            </button>
          </div>

          {/* Paper Container */}
          <div
            id="official-daily-diary-paper"
            className="p-6 sm:p-8 bg-white text-slate-900 rounded-2xl shadow-xl border-2 border-slate-800 space-y-4 text-xs font-serif leading-tight"
          >
            {/* Header Box */}
            <div className="text-center border-b-2 border-slate-900 pb-3 space-y-1">
              <div className="text-[10px] font-sans font-bold text-slate-600 tracking-wider uppercase">
                राजस्थान सरकार • प्रारम्भिक व माध्यमिक शिक्षा विभाग
              </div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight font-serif uppercase">
                {schoolProfile?.schoolName || 'राजकीय उच्च माध्यमिक विद्यालय'}
              </h3>
              <p className="text-[11px] font-sans font-extrabold text-emerald-800">
                दैनिक शिक्षक दैनन्दिनी (Teacher's Daily Diary Register)
              </p>
              <p className="text-[10px] font-sans text-slate-500">
                यू-डायस कोड: {schoolProfile?.udiseCode || '08120401102'} | शाला दर्पण कोड: {schoolProfile?.nicCode || '218001'} | जिला: {schoolProfile?.district || 'जयपुर'}
              </p>
            </div>

            {/* Meta Grid Box */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-800 text-[11px] font-sans font-semibold">
              <div>
                <span className="text-slate-500 text-[10px] block">दिनांक व वार:</span>
                <span className="font-bold text-slate-900">{activeEntry.date} ({activeEntry.dayOfWeek})</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">शिक्षक नाम व आईडी:</span>
                <span className="font-bold text-slate-900">{activeEntry.teacherName} ({activeEntry.employeeId})</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">पद व मुख्य कक्षा:</span>
                <span className="font-bold text-slate-900">{activeEntry.designation} - {activeEntry.assignedClass}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">छात्र उपस्थिति:</span>
                <span className="font-bold text-emerald-800">उपस्थित: {activeEntry.presentStudents} / {activeEntry.totalStudents} (अनु०: {activeEntry.absentStudents})</span>
              </div>
            </div>

            {/* Table: Period wise Teaching Execution (1 to 8) */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-slate-800 text-[10px] font-sans">
                <thead>
                  <tr className="bg-slate-100 text-slate-900 font-extrabold text-center">
                    <th className="border border-slate-800 p-1.5 w-10">का.सं.</th>
                    <th className="border border-slate-800 p-1.5 w-16">कक्षा व विषय</th>
                    <th className="border border-slate-800 p-1.5">अध्यापित पाठ/इकाई व मुख्य बिंदु</th>
                    <th className="border border-slate-800 p-1.5">अधिगम प्रतिफल (Learning Outcome)</th>
                    <th className="border border-slate-800 p-1.5">टीएलएम / शिक्षण गतिविधि</th>
                    <th className="border border-slate-800 p-1.5 w-28">प्रदत्त गृहकार्य (Home Work)</th>
                  </tr>
                </thead>
                <tbody>
                  {activeEntry.periods.map((p, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="border border-slate-800 p-1.5 text-center font-bold bg-slate-50">
                        {p.periodNo}
                      </td>
                      <td className="border border-slate-800 p-1.5 font-bold">
                        <div>{p.className}</div>
                        <div className="text-emerald-800 text-[9px]">{p.subject}</div>
                      </td>
                      <td className="border border-slate-800 p-1.5">
                        {p.topicTaught || '-'}
                      </td>
                      <td className="border border-slate-800 p-1.5 text-slate-700">
                        {p.learningOutcome || '-'}
                      </td>
                      <td className="border border-slate-800 p-1.5 text-slate-700">
                        {p.tlmActivity || '-'}
                      </td>
                      <td className="border border-slate-800 p-1.5 text-slate-800 font-medium">
                        {p.homeworkGiven || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Attendance & Absentee Remarks Block */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-800 space-y-1 font-sans text-[11px]">
              <div className="font-bold text-slate-900 border-b border-slate-300 pb-1 flex justify-between">
                <span>1. छात्र अनुपस्थिति विवरण व फॉलोअप टिप्पणी (Attendance & Absentee Remarks):</span>
                <span>कुल नामांकन: {activeEntry.totalStudents} | अनुपस्थित: {activeEntry.absentStudents}</span>
              </div>
              <p className="text-slate-700 pt-1 leading-snug">
                {activeEntry.absentRemarks || 'समस्त छात्र उपस्थित रहे या अनुपस्थिति का कारण दर्ज किया गया।'}
              </p>
            </div>

            {/* Co-Curricular & Prarthna Sabha Block */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-sans text-[11px]">
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-800 space-y-1">
                <span className="font-bold text-emerald-800 block border-b border-slate-300 pb-0.5">
                  2. प्रार्थना सभा दायित्व (Morning Assembly):
                </span>
                <p className="text-slate-700 leading-snug">
                  {activeEntry.prarthnaSabhaDuty || 'प्रार्थना सभा में उपस्थिति व अनुशासन प्रभार संभालना।'}
                </p>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-800 space-y-1">
                <span className="font-bold text-emerald-800 block border-b border-slate-300 pb-0.5">
                  3. बाल सभा / नो-बैग डे / CCEA गतिविधि:
                </span>
                <p className="text-slate-700 leading-snug">
                  {activeEntry.cceaNoBagDayActivity || 'सह-शैक्षणिक गतिविधि सम्पादित।'}
                </p>
              </div>
            </div>

            {/* Principal Remark & Signatures Area */}
            <div className="pt-4 border-t-2 border-slate-900 font-sans space-y-4">
              <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-800/40 space-y-1">
                <span className="font-bold text-emerald-900 block text-[11px]">
                  4. प्रधानाचार्य / संस्था प्रधान / PEEO अवलोकन सम्प्रेक्षण (Principal Inspection Remarks):
                </span>
                <p className="text-slate-800 text-[11px] italic font-serif">
                  "{activeEntry.principalRemarks || 'अध्यापन कार्य एवं कालांश संचालन नियम अनुसार उत्तम पाया गया।'}"
                </p>
              </div>

              <div className="pt-6 flex justify-between items-end text-xs font-bold">
                <div className="text-center space-y-1">
                  <div className="h-8"></div>
                  <p className="underline">({activeEntry.teacherName})</p>
                  <p className="text-[10px] font-normal">हस्ताक्षर संबंधित शिक्षक</p>
                </div>

                <div className="border border-dashed border-slate-400 p-2 text-[9px] text-slate-400 text-center w-28 h-14 flex items-center justify-center">
                  [ संस्था प्रधान सील ]
                </div>

                <div className="text-center space-y-1">
                  <div className="h-8"></div>
                  <p className="underline">हस्ताक्षर प्रधानाचार्य / PEEO</p>
                  <p className="text-[10px] font-normal">{schoolProfile?.schoolName || 'रा.उ.मा.वि.'}</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* FORM MODAL (Add / Edit Entry) */}
      {showFormModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-4xl w-full p-5 sm:p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5 my-8 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
              <div className="flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-black text-slate-900 dark:text-slate-100">
                  {editingEntry ? 'दैनिक दैनन्दिनी संशोधित करें (Edit Diary Entry)' : 'नवीन दैनिक शिक्षक दैनन्दिनी दर्ज करें (New Diary Log)'}
                </h3>
              </div>
              <button
                onClick={() => setShowFormModal(false)}
                className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="space-y-5 text-xs">
              
              {/* Section 1: Teacher & Date Meta */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3">
                <h4 className="font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 text-xs">
                  <UserCheck className="w-4 h-4 text-emerald-600" />
                  <span>1. शिक्षक एवं विद्यालय सामान्य विवरण (Basic Information)</span>
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">दिनांक:</label>
                    <input
                      type="date"
                      value={formDate}
                      onChange={e => setFormDate(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">वार (Day):</label>
                    <select
                      value={formDay}
                      onChange={e => setFormDay(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
                    >
                      <option value="सोमवार (Monday)">सोमवार (Monday)</option>
                      <option value="मंगलवार (Tuesday)">मंगलवार (Tuesday)</option>
                      <option value="बुधवार (Wednesday)">बुधवार (Wednesday)</option>
                      <option value="गुरुवार (Thursday)">गुरुवार (Thursday)</option>
                      <option value="शुक्रवार (Friday)">शुक्रवार (Friday)</option>
                      <option value="शनिवार (Saturday - No Bag Day)">शनिवार (No Bag Day)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">शिक्षक का नाम:</label>
                    <input
                      type="text"
                      value={formTeacherName}
                      onChange={e => setFormTeacherName(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">कर्मचारी आईडी (NIC):</label>
                    <input
                      type="text"
                      value={formEmployeeId}
                      onChange={e => setFormEmployeeId(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono font-bold"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">पद व विषय:</label>
                    <input
                      type="text"
                      value={formDesignation}
                      onChange={e => setFormDesignation(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">मुख्य कक्षा प्रभार:</label>
                    <input
                      type="text"
                      value={formAssignedClass}
                      onChange={e => setFormAssignedClass(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Period-Wise Teaching Log Table */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 text-xs">
                    <Clock className="w-4 h-4 text-emerald-600" />
                    <span>2. कालांशवार अध्यापन योजना एवं निष्पादन (Periods 1 to 8)</span>
                  </h4>
                  <span className="text-[10px] text-slate-500 font-medium">समस्त 8 कालांश इन्द्राज करें</span>
                </div>

                <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
                  {formPeriods.map((p, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
                      <div className="flex items-center justify-between font-bold border-b border-slate-200 dark:border-slate-700 pb-1.5">
                        <span className="px-2 py-0.5 rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[11px]">
                          कालांश सं. {p.periodNo}
                        </span>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <input
                            type="text"
                            value={p.className}
                            onChange={e => handlePeriodChange(idx, 'className', e.target.value)}
                            placeholder="कक्षा (उदा. 9-A)"
                            className="px-2 py-0.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
                          />
                          <input
                            type="text"
                            value={p.subject}
                            onChange={e => handlePeriodChange(idx, 'subject', e.target.value)}
                            placeholder="विषय (उदा. गणित)"
                            className="px-2 py-0.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-emerald-700 dark:text-emerald-400"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 mb-0.5">अध्यापित पाठ/इकाई एवं मुख्य बिंदु:</label>
                          <input
                            type="text"
                            value={p.topicTaught}
                            onChange={e => handlePeriodChange(idx, 'topicTaught', e.target.value)}
                            placeholder="उदा. अध्याय 4: दो चरों वाले समीकरण"
                            className="w-full px-2.5 py-1 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-medium"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 mb-0.5">अधिगम प्रतिफल (Learning Outcome):</label>
                          <input
                            type="text"
                            value={p.learningOutcome}
                            onChange={e => handlePeriodChange(idx, 'learningOutcome', e.target.value)}
                            placeholder="उदा. छात्रों ने बीजीय निरूपण सीखा"
                            className="w-full px-2.5 py-1 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-medium"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 mb-0.5">टीएलएम व शिक्षण गतिविधि:</label>
                          <input
                            type="text"
                            value={p.tlmActivity}
                            onChange={e => handlePeriodChange(idx, 'tlmActivity', e.target.value)}
                            placeholder="उदा. ग्राफ मॉडल व चार्ट"
                            className="w-full px-2.5 py-1 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-medium"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 mb-0.5">प्रदत्त गृहकार्य (Homework):</label>
                          <input
                            type="text"
                            value={p.homeworkGiven}
                            onChange={e => handlePeriodChange(idx, 'homeworkGiven', e.target.value)}
                            placeholder="उदा. अभ्यास 4.1 प्रश्न 1-4"
                            className="w-full px-2.5 py-1 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-medium"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 3: Attendance & Absentee Remarks */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3">
                <h4 className="font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 text-xs">
                  <Users className="w-4 h-4 text-emerald-600" />
                  <span>3. छात्र उपस्थिति व अनुपस्थिति टिप्पणी (Attendance & Remarks)</span>
                </h4>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">कुल नामांकन:</label>
                    <input
                      type="number"
                      value={formTotalStudents}
                      onChange={e => setFormTotalStudents(Number(e.target.value))}
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">उपस्थित छात्र:</label>
                    <input
                      type="number"
                      value={formPresentStudents}
                      onChange={e => {
                        const val = Number(e.target.value);
                        setFormPresentStudents(val);
                        setFormAbsentStudents(Math.max(0, formTotalStudents - val));
                      }}
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-emerald-700 dark:text-emerald-400"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">अनुपस्थित छात्र:</label>
                    <input
                      type="number"
                      value={formAbsentStudents}
                      onChange={e => setFormAbsentStudents(Number(e.target.value))}
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-rose-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    अनुपस्थित छात्रों हेतु टिप्पणी / अभिभावक संपर्क फॉलोअप:
                  </label>
                  <textarea
                    rows={2}
                    value={formAbsentRemarks}
                    onChange={e => setFormAbsentRemarks(e.target.value)}
                    placeholder="उदा. 1. राहुल (अस्वस्थता), 2. विकास (अभिभावक फोन पर संपर्क किया गया)"
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Section 4: CCEA / Assembly / Principal Remarks */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">प्रार्थना सभा दायित्व:</label>
                  <input
                    type="text"
                    value={formPrarthnaDuty}
                    onChange={e => setFormPrarthnaDuty(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">बाल सभा / नो-बैग डे गतिविधि:</label>
                  <input
                    type="text"
                    value={formCceaActivity}
                    onChange={e => setFormCceaActivity(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">प्रधानाचार्य सम्प्रेक्षण टिप्पणी:</label>
                <input
                  type="text"
                  value={formPrincipalRemarks}
                  onChange={e => setFormPrincipalRemarks(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-medium"
                />
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowFormModal(false)}
                  className="py-2 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold"
                >
                  निरस्त करें
                </button>
                <button
                  type="submit"
                  className="py-2 px-5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black shadow-md flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer"
                >
                  <Save className="w-4 h-4 text-amber-300" />
                  <span>दैनिक दैनन्दिनी सुरक्षित करें</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
