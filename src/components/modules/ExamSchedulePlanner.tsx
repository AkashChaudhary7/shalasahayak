import React, { useState, useEffect } from 'react';
import { SchoolProfile, Language } from '../../types';
import {
  Calendar as CalendarIcon,
  Clock,
  BookOpen,
  Plus,
  Trash2,
  Edit2,
  Printer,
  ChevronLeft,
  ChevronRight,
  Filter,
  CheckCircle2,
  Search,
  Sparkles,
  Info,
  Layers,
  ArrowLeft,
  FileSpreadsheet,
  Building2,
  List
} from 'lucide-react';

export interface ExamScheduleItem {
  id: string;
  examTitle: string;
  className: string;
  subjectName: string;
  examDate: string; // YYYY-MM-DD
  dayOfWeek: string;
  shift: 'shift1' | 'shift2' | 'morning' | 'afternoon' | string; // 'shift1' (First Shift) | 'shift2' (Second Shift)
  timeSlot: string; // e.g. '08:30 AM - 11:45 AM'
  maxMarks: number;
  rooms?: string;
  syllabusNotes?: string;
}

interface ExamSchedulePlannerProps {
  schoolProfile: SchoolProfile;
  lang: Language;
  onBack?: () => void;
}

const DEFAULT_EXAM_SCHEDULES: ExamScheduleItem[] = [
  // Class 1-5 (Primary) Examples
  {
    id: 'ex-p1',
    examTitle: 'अर्धवार्षिक परीक्षा 2026-27',
    className: 'Class 5',
    subjectName: 'हिंदी (Hindi)',
    examDate: '2026-12-10',
    dayOfWeek: 'गुरुवार',
    shift: 'shift1',
    timeSlot: '08:30 AM - 11:00 AM',
    maxMarks: 50,
    rooms: 'कक्ष संख्या 1',
    syllabusNotes: 'कक्षा 5 संपूर्ण पाठ्यपुस्तक'
  },
  {
    id: 'ex-p2',
    examTitle: 'अर्धवार्षिक परीक्षा 2026-27',
    className: 'Class 5',
    subjectName: 'गणित (Mathematics)',
    examDate: '2026-12-12',
    dayOfWeek: 'शनिवार',
    shift: 'shift1',
    timeSlot: '08:30 AM - 11:00 AM',
    maxMarks: 50,
    rooms: 'कक्ष संख्या 1',
    syllabusNotes: 'संख्याएं, संक्रियाएं व मापन'
  },
  {
    id: 'ex-p3',
    examTitle: 'अर्धवार्षिक परीक्षा 2026-27',
    className: 'Class 5',
    subjectName: 'पर्यावरण अध्ययन (EVS)',
    examDate: '2026-12-15',
    dayOfWeek: 'मंगलवार',
    shift: 'shift1',
    timeSlot: '08:30 AM - 11:00 AM',
    maxMarks: 50,
    rooms: 'कक्ष संख्या 1',
    syllabusNotes: 'हमारा परिवेश व जीव-जगत'
  },

  // Class 6-8 (Upper Primary) Examples
  {
    id: 'ex-u1',
    examTitle: 'अर्धवार्षिक परीक्षा 2026-27',
    className: 'Class 8',
    subjectName: 'विज्ञान (Science)',
    examDate: '2026-12-10',
    dayOfWeek: 'गुरुवार',
    shift: 'shift1',
    timeSlot: '08:30 AM - 11:45 AM',
    maxMarks: 80,
    rooms: 'कक्ष संख्या 2 व 3',
    syllabusNotes: 'अध्याय 1 से 7'
  },
  {
    id: 'ex-u2',
    examTitle: 'अर्धवार्षिक परीक्षा 2026-27',
    className: 'Class 8',
    subjectName: 'सामाजिक विज्ञान (Social Science)',
    examDate: '2026-12-12',
    dayOfWeek: 'शनिवार',
    shift: 'shift1',
    timeSlot: '08:30 AM - 11:45 AM',
    maxMarks: 80,
    rooms: 'कक्ष संख्या 2 व 3',
    syllabusNotes: 'इतिहास, भूगोल एवं नागरिक शास्त्र'
  },
  {
    id: 'ex-u3',
    examTitle: 'अर्धवार्षिक परीक्षा 2026-27',
    className: 'Class 8',
    subjectName: 'संस्कृत (Sanskrit / तृतीय भाषा)',
    examDate: '2026-12-15',
    dayOfWeek: 'मंगलवार',
    shift: 'shift2',
    timeSlot: '01:15 PM - 04:30 PM',
    maxMarks: 80,
    rooms: 'कक्ष संख्या 2 व 3',
    syllabusNotes: 'रुचिरा भाग 3'
  },

  // Class 9-12 (Secondary & Sr Secondary) Examples
  {
    id: 'ex-s1',
    examTitle: 'अर्धवार्षिक परीक्षा 2026-27',
    className: 'Class 10',
    subjectName: 'गणित (Mathematics)',
    examDate: '2026-12-10',
    dayOfWeek: 'गुरुवार',
    shift: 'shift1',
    timeSlot: '08:30 AM - 11:45 AM',
    maxMarks: 80,
    rooms: 'कक्ष संख्या 4 व 5',
    syllabusNotes: 'अध्याय 1 से 8 तक पूर्ण पाठ्यक्रम'
  },
  {
    id: 'ex-s2',
    examTitle: 'अर्धवार्षिक परीक्षा 2026-27',
    className: 'Class 12',
    subjectName: 'भौतिक विज्ञान (Physics) / लेखाशास्त्र (Accountancy)',
    examDate: '2026-12-10',
    dayOfWeek: 'गुरुवार',
    shift: 'shift2',
    timeSlot: '01:15 PM - 04:30 PM',
    maxMarks: 70,
    rooms: 'कक्ष संख्या 6 व 7',
    syllabusNotes: 'इकाई 1 से 5 (स्थिर वैद्युतिकी, धारा वैद्युत)'
  },
  {
    id: 'ex-s3',
    examTitle: 'अर्धवार्षिक परीक्षा 2026-27',
    className: 'Class 10',
    subjectName: 'विज्ञान (Science)',
    examDate: '2026-12-12',
    dayOfWeek: 'शनिवार',
    shift: 'shift1',
    timeSlot: '08:30 AM - 11:45 AM',
    maxMarks: 80,
    rooms: 'कक्ष संख्या 4 व 5',
    syllabusNotes: 'रसायन विज्ञान एवं जीव विज्ञान भाग'
  },
  {
    id: 'ex-s4',
    examTitle: 'अर्धवार्षिक परीक्षा 2026-27',
    className: 'Class 12',
    subjectName: 'रसायन विज्ञान (Chemistry) / व्यावसायिक अध्ययन (BST)',
    examDate: '2026-12-12',
    dayOfWeek: 'शनिवार',
    shift: 'shift2',
    timeSlot: '01:15 PM - 04:30 PM',
    maxMarks: 70,
    rooms: 'कक्ष संख्या 6 व 7',
    syllabusNotes: 'विलयन, वैद्युतरसायन व रासायनिक बलगतिकी'
  },
  {
    id: 'ex-s5',
    examTitle: 'अर्धवार्षिक परीक्षा 2026-27',
    className: 'Class 10',
    subjectName: 'अंग्रेजी (English)',
    examDate: '2026-12-15',
    dayOfWeek: 'मंगलवार',
    shift: 'shift1',
    timeSlot: '08:30 AM - 11:45 AM',
    maxMarks: 80,
    rooms: 'कक्ष संख्या 4 व 5',
    syllabusNotes: 'First Flight & Footprints without Feet'
  },
  {
    id: 'ex-s6',
    examTitle: 'अर्धवार्षिक परीक्षा 2026-27',
    className: 'Class 12',
    subjectName: 'जीव विज्ञान (Biology) / गणित (Maths) / अर्थशास्त्र',
    examDate: '2026-12-15',
    dayOfWeek: 'मंगलवार',
    shift: 'shift2',
    timeSlot: '01:15 PM - 04:30 PM',
    maxMarks: 70,
    rooms: 'कक्ष संख्या 6 व 7',
    syllabusNotes: 'इकाई 1 व 2 संपूर्ण'
  }
];

const MONTH_NAMES_HI = [
  'जनवरी (January)', 'फरवरी (February)', 'मार्च (March)', 'अप्रैल (April)',
  'मई (May)', 'जून (June)', 'जुलाई (July)', 'अगस्त (August)',
  'सितंबर (September)', 'अक्टूबर (October)', 'नवंबर (November)', 'दिसंबर (December)'
];

const WEEKDAYS_HI = ['रवि', 'सोम', 'मंगल', 'बुध', 'गुरु', 'शुक्र', 'शनि'];

export const ExamSchedulePlanner: React.FC<ExamSchedulePlannerProps> = ({
  schoolProfile,
  lang,
  onBack
}) => {
  const [examItems, setExamItems] = useState<ExamScheduleItem[]>(() => {
    try {
      const saved = localStorage.getItem('shala_sahayak_exam_schedules');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_EXAM_SCHEDULES;
  });

  const [viewMode, setViewMode] = useState<'calendar' | 'table' | 'form' | 'print'>('calendar');
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>('all');
  const [selectedShiftFilter, setSelectedShiftFilter] = useState<'all' | 'shift1' | 'shift2'>('all');
  const [showMaxMarks, setShowMaxMarks] = useState<boolean>(true);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Calendar View Month State (Default to December 2026 for exams)
  const [currentYear, setCurrentYear] = useState<number>(2026);
  const [currentMonth, setCurrentMonth] = useState<number>(11); // 0-indexed: 11 = December

  // Day Details Modal / Drawer State
  const [inspectDate, setInspectDate] = useState<string | null>(null);

  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [examTitle, setExamTitle] = useState('अर्धवार्षिक परीक्षा 2026-27');
  const [className, setClassName] = useState('Class 10');
  const [subjectName, setSubjectName] = useState('गणित (Mathematics)');
  const [examDate, setExamDate] = useState('2026-12-10');
  const [shift, setShift] = useState<'shift1' | 'shift2' | string>('shift1');
  const [timeSlot, setTimeSlot] = useState('08:30 AM - 11:45 AM');
  const [maxMarks, setMaxMarks] = useState<number>(80);
  const [rooms, setRooms] = useState('कक्ष संख्या 1 से 4');
  const [syllabusNotes, setSyllabusNotes] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem('shala_sahayak_exam_schedules', JSON.stringify(examItems));
    } catch (e) {
      console.error(e);
    }
  }, [examItems]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Helper to calculate Day of Week in Hindi
  const getDayNameHindi = (dateStr: string) => {
    const d = new Date(dateStr);
    const dayIdx = d.getDay();
    const days = ['रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'];
    return days[dayIdx] || 'सोमवार';
  };

  // Submit Exam Schedule
  const handleSaveExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectName.trim() || !examDate) {
      showToast('कृपया विषय का नाम एवं परीक्षा तिथि प्रविष्ट करें।');
      return;
    }

    const dayName = getDayNameHindi(examDate);

    if (editingId) {
      const updated = examItems.map(item => item.id === editingId ? {
        ...item,
        examTitle,
        className,
        subjectName,
        examDate,
        dayOfWeek: dayName,
        shift,
        timeSlot,
        maxMarks: Number(maxMarks),
        rooms,
        syllabusNotes
      } : item);
      setExamItems(updated);
      showToast('✅ परीक्षा तिथि व विषय विवरण संशोधित किया गया!');
    } else {
      const newItem: ExamScheduleItem = {
        id: `exam-sched-${Date.now()}`,
        examTitle,
        className,
        subjectName,
        examDate,
        dayOfWeek: dayName,
        shift,
        timeSlot,
        maxMarks: Number(maxMarks),
        rooms,
        syllabusNotes
      };
      setExamItems([...examItems, newItem]);
      showToast('✅ नई परीक्षा तिथि व समय सारणी सफलतापूर्वक जोड़ी गई!');
    }

    setEditingId(null);
    setViewMode('calendar');
  };

  const handleEditClick = (item: ExamScheduleItem) => {
    setEditingId(item.id);
    setExamTitle(item.examTitle);
    setClassName(item.className);
    setSubjectName(item.subjectName);
    setExamDate(item.examDate);
    setShift(item.shift);
    setTimeSlot(item.timeSlot);
    setMaxMarks(item.maxMarks);
    setRooms(item.rooms || '');
    setSyllabusNotes(item.syllabusNotes || '');
    setViewMode('form');
  };

  const handleDeleteClick = (id: string) => {
    if (window.confirm('क्या आप इस परीक्षा प्रविष्टि को हटाना चाहते हैं?')) {
      setExamItems(examItems.filter(i => i.id !== id));
      showToast('प्रविष्टि हटाई गई।');
    }
  };

  // Month Navigation
  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // Helper to categorize class groups: 1-5, 6-8, 9-12
  const getClassGroup = (cls: string): 'group_1_5' | 'group_6_8' | 'group_9_12' | 'other' => {
    const match = cls.match(/\d+/);
    if (!match) return 'other';
    const num = parseInt(match[0], 10);
    if (num >= 1 && num <= 5) return 'group_1_5';
    if (num >= 6 && num <= 8) return 'group_6_8';
    if (num >= 9 && num <= 12) return 'group_9_12';
    return 'other';
  };

  // Helper for human-readable shift name
  const getShiftBadge = (s: string) => {
    if (s === 'shift1' || s === 'morning') return { label: 'प्रथम पारी', sub: '08:30 AM - 11:45 AM', color: 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border-amber-300' };
    if (s === 'shift2' || s === 'afternoon') return { label: 'द्वितीय पारी', sub: '01:15 PM - 04:30 PM', color: 'bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 border-indigo-300' };
    return { label: 'विशेष पारी', sub: s, color: 'bg-slate-100 text-slate-800 border-slate-300' };
  };

  // Filtered Exam Items considering Class/Group & Shift
  const filteredExams = examItems.filter(item => {
    // 1. Shift filtering
    if (selectedShiftFilter !== 'all') {
      const isShift1 = item.shift === 'shift1' || item.shift === 'morning';
      const isShift2 = item.shift === 'shift2' || item.shift === 'afternoon';
      if (selectedShiftFilter === 'shift1' && !isShift1) return false;
      if (selectedShiftFilter === 'shift2' && !isShift2) return false;
    }

    // 2. Class / Group filtering
    if (selectedClassFilter === 'all') return true;
    if (selectedClassFilter === 'group_1_5') return getClassGroup(item.className) === 'group_1_5';
    if (selectedClassFilter === 'group_6_8') return getClassGroup(item.className) === 'group_6_8';
    if (selectedClassFilter === 'group_9_12') return getClassGroup(item.className) === 'group_9_12';
    return item.className === selectedClassFilter;
  });

  // Dynamic filter title for print and banner
  const getFilterDisplayTitle = () => {
    if (selectedClassFilter === 'group_1_5') return 'प्राथमिक वर्ग (कक्षा 1 से 5)';
    if (selectedClassFilter === 'group_6_8') return 'उच्च प्राथमिक वर्ग (कक्षा 6 से 8)';
    if (selectedClassFilter === 'group_9_12') return 'माध्यमिक एवं उच्च माध्यमिक वर्ग (कक्षा 9 से 12)';
    if (selectedClassFilter === 'all') return 'समस्त कक्षाएं (कक्षा 1 से 12)';
    return selectedClassFilter;
  };

  // Calendar Days calculation
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();

  // Get Exams for a specific Date (YYYY-MM-DD)
  const getExamsForDate = (dateStr: string) => {
    return filteredExams.filter(item => item.examDate === dateStr);
  };

  // Print Action
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-5">
      
      {/* Top Header Banner */}
      <div className="bg-gradient-to-r from-sky-900 via-slate-900 to-indigo-950 text-white p-4 sm:p-5 rounded-3xl shadow-xl border border-sky-800/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div className="p-3 rounded-2xl bg-sky-500/20 text-sky-300 border border-sky-500/30">
            <CalendarIcon className="w-6 h-6 text-sky-300" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black tracking-tight flex items-center gap-2">
              <span>परीक्षा समय-सारणी एवं कैलेंडर प्लैनर</span>
              <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-sky-400 text-slate-950 uppercase">
                Exam Schedule Engine
              </span>
            </h2>
            <p className="text-xs text-slate-300">
              {schoolProfile?.schoolName || 'राजकीय विद्यालय'} • प्रथम/द्वितीय पारी, कक्षा-समूह (1-5, 6-8, 9-12) एवं पूर्णांक प्रबंधन
            </p>
          </div>
        </div>

        {/* View Toggle Buttons */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setViewMode('calendar')}
            className={`px-3 py-2 rounded-2xl font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              viewMode === 'calendar'
                ? 'bg-sky-400 text-slate-950 shadow-md'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <CalendarIcon className="w-4 h-4" />
            <span>कैलेंडर व्यू</span>
          </button>

          <button
            onClick={() => setViewMode('table')}
            className={`px-3 py-2 rounded-2xl font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              viewMode === 'table'
                ? 'bg-sky-400 text-slate-950 shadow-md'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <List className="w-4 h-4" />
            <span>तालिका ({filteredExams.length})</span>
          </button>

          <button
            onClick={() => { setEditingId(null); setViewMode('form'); }}
            className={`px-3 py-2 rounded-2xl font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              viewMode === 'form'
                ? 'bg-sky-400 text-slate-950 shadow-md'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>परीक्षा जोड़ें</span>
          </button>

          <button
            onClick={() => setViewMode('print')}
            className={`px-3 py-2 rounded-2xl font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              viewMode === 'print'
                ? 'bg-amber-400 text-slate-950 shadow-md'
                : 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30'
            }`}
          >
            <Printer className="w-4 h-4" />
            <span>टाइम-टेबल प्रपत्र / PDF</span>
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMsg && (
        <div className="p-3 bg-sky-900 text-white rounded-2xl font-bold text-xs flex items-center justify-between border border-sky-700 shadow-lg animate-in fade-in duration-200">
          <span className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{toastMsg}</span>
          </span>
          <button onClick={() => setToastMsg(null)}>✕</button>
        </div>
      )}

      {/* Advanced Filter Bar: Class Group Wise, Class Wise, Shift Filter & Marks Removal Toggle */}
      <div className="p-3.5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        
        {/* Class / Group Filter */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center space-x-1.5 text-slate-700 dark:text-slate-300 font-extrabold">
            <Filter className="w-4 h-4 text-sky-600" />
            <span>कक्षा / समूह फ़िल्टर:</span>
          </div>

          <select
            value={selectedClassFilter}
            onChange={e => setSelectedClassFilter(e.target.value)}
            className="px-3 py-1.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold focus:ring-2 focus:ring-sky-500 text-xs"
          >
            <optgroup label="📋 कक्षा समूह वार (Class Group Wise)">
              <option value="all">समस्त कक्षाएं (All Classes 1 to 12)</option>
              <option value="group_1_5">🟢 प्राथमिक वर्ग (कक्षा 1 से 5)</option>
              <option value="group_6_8">🔵 उच्च प्राथमिक वर्ग (कक्षा 6 से 8)</option>
              <option value="group_9_12">🟣 माध्यमिक एवं उच्च माध्यमिक (कक्षा 9 से 12)</option>
            </optgroup>
            <optgroup label="🏫 व्यक्तिगत कक्षा वार (Class Wise)">
              {['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'].map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </optgroup>
          </select>
        </div>

        {/* Shift Filter and Marks Removal Toggle */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Shift Filter */}
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-slate-600 dark:text-slate-400">पारी (Shift):</span>
            <select
              value={selectedShiftFilter}
              onChange={e => setSelectedShiftFilter(e.target.value as any)}
              className="px-2.5 py-1.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold text-xs"
            >
              <option value="all">उभय पारियां (All Shifts)</option>
              <option value="shift1">प्रथम पारी (Shift 1)</option>
              <option value="shift2">द्वितीय पारी (Shift 2)</option>
            </select>
          </div>

          {/* Remove / Show Marks Toggle */}
          <button
            type="button"
            onClick={() => setShowMaxMarks(!showMaxMarks)}
            className={`px-3 py-1.5 rounded-2xl font-black text-xs border transition-all flex items-center gap-1.5 cursor-pointer ${
              showMaxMarks
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800'
            }`}
            title="पूर्णांक कॉलम को तालिका व पीडीएफ से हटाने या प्रदर्शित करने का विकल्प"
          >
            {showMaxMarks ? (
              <>
                <span>💯 पूर्णांक: प्रदर्शित</span>
              </>
            ) : (
              <>
                <span>🚫 पूर्णांक: हटाया गया</span>
              </>
            )}
          </button>
        </div>

      </div>

      {/* VIEW 1: LOCAL INTERACTIVE CALENDAR VIEW */}
      {viewMode === 'calendar' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-4 sm:p-6 space-y-4">
          
          {/* Month Bar Controls */}
          <div className="flex items-center justify-between bg-slate-100 dark:bg-slate-800 p-3 rounded-2xl">
            <button
              onClick={prevMonth}
              className="p-2 rounded-xl bg-white dark:bg-slate-700 hover:bg-slate-200 text-slate-800 dark:text-slate-100 font-bold transition-all cursor-pointer flex items-center gap-1 text-xs"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>पूर्व माह</span>
            </button>

            <div className="text-center font-black text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-sky-600" />
              <span>{MONTH_NAMES_HI[currentMonth]} {currentYear}</span>
            </div>

            <button
              onClick={nextMonth}
              className="p-2 rounded-xl bg-white dark:bg-slate-700 hover:bg-slate-200 text-slate-800 dark:text-slate-100 font-bold transition-all cursor-pointer flex items-center gap-1 text-xs"
            >
              <span>अगला माह</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Calendar Grid Header (Weekdays) */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center font-black text-xs text-slate-600 dark:text-slate-300 pb-2 border-b border-slate-200 dark:border-slate-800">
            {WEEKDAYS_HI.map((w, i) => (
              <div key={i} className={`p-1.5 ${i === 0 ? 'text-rose-600 dark:text-rose-400' : ''}`}>
                {w}
              </div>
            ))}
          </div>

          {/* Calendar Grid Days */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {/* Empty slots before day 1 */}
            {Array.from({ length: firstDayOfWeek }).map((_, i) => (
              <div key={`empty-${i}`} className="h-20 sm:h-24 rounded-2xl bg-slate-50/50 dark:bg-slate-850/30 border border-slate-100 dark:border-slate-800/40 opacity-40"></div>
            ))}

            {/* Days of Month */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const monthStr = (currentMonth + 1).toString().padStart(2, '0');
              const dayStr = dayNum.toString().padStart(2, '0');
              const fullDateStr = `${currentYear}-${monthStr}-${dayStr}`;

              const examsToday = getExamsForDate(fullDateStr);
              const isToday = fullDateStr === new Date().toISOString().split('T')[0];

              return (
                <div
                  key={dayNum}
                  onClick={() => {
                    if (examsToday.length > 0) setInspectDate(fullDateStr);
                  }}
                  className={`h-20 sm:h-24 rounded-2xl p-1.5 sm:p-2 border transition-all flex flex-col justify-between cursor-pointer ${
                    isToday
                      ? 'bg-sky-50 dark:bg-sky-950/60 border-sky-400 dark:border-sky-600 ring-2 ring-sky-400/40'
                      : examsToday.length > 0
                        ? 'bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-300 dark:border-indigo-800 hover:border-indigo-500 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-black rounded-full w-5 h-5 flex items-center justify-center ${
                      isToday ? 'bg-sky-600 text-white' : 'text-slate-800 dark:text-slate-200'
                    }`}>
                      {dayNum}
                    </span>
                    {examsToday.length > 0 && (
                      <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-rose-600 text-white animate-pulse">
                        {examsToday.length} परीक्षा
                      </span>
                    )}
                  </div>

                  {/* Exam Badges */}
                  <div className="space-y-1 overflow-y-auto max-h-14 scrollbar-none">
                    {examsToday.slice(0, 2).map((ex, idx) => (
                      <div
                        key={idx}
                        className="px-1.5 py-0.5 rounded bg-sky-900 text-sky-100 text-[9px] font-bold truncate leading-tight border border-sky-700"
                        title={`${ex.className} - ${ex.subjectName}`}
                      >
                        {ex.className}: {ex.subjectName}
                      </div>
                    ))}
                    {examsToday.length > 2 && (
                      <p className="text-[8px] font-bold text-sky-700 dark:text-sky-300 text-center">
                        +{examsToday.length - 2} और...
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* INSPECT DAY EXAMS MODAL */}
      {inspectDate && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 max-w-lg w-full shadow-2xl space-y-4 text-xs animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <CalendarIcon className="w-5 h-5 text-sky-600" />
                <h3 className="font-black text-sm text-slate-900 dark:text-slate-100">
                  परीक्षा अनुसूची: {inspectDate}
                </h3>
              </div>
              <button
                onClick={() => setInspectDate(null)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 font-bold hover:bg-rose-500 hover:text-white transition-all"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {getExamsForDate(inspectDate).map((ex) => (
                <div key={ex.id} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-sky-800 dark:text-sky-300">{ex.examTitle}</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-[10px]">
                      {ex.className}
                    </span>
                  </div>

                  <h4 className="font-black text-sm text-slate-900 dark:text-slate-100">
                    📖 विषय: {ex.subjectName}
                  </h4>

                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 dark:text-slate-300 pt-1 border-t border-slate-200 dark:border-slate-700">
                    <div>⏱ समय: <strong>{ex.timeSlot}</strong></div>
                    <div>💯 पूर्णांक: <strong>{ex.maxMarks} अंक</strong></div>
                    <div>🏛 परीक्षा कक्ष: <strong>{ex.rooms || 'आवंटित कक्ष'}</strong></div>
                  </div>

                  {ex.syllabusNotes && (
                    <p className="text-[10px] text-slate-500 font-medium bg-white dark:bg-slate-900 p-2 rounded-xl">
                      📝 पाठ्यक्रम: {ex.syllabusNotes}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={() => setInspectDate(null)}
              className="w-full py-2.5 rounded-2xl bg-slate-900 text-white font-bold text-xs cursor-pointer"
            >
              बंद करें
            </button>
          </div>
        </div>
      )}

      {/* VIEW 2: TABLE VIEW */}
      {viewMode === 'table' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-4 sm:p-5 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800 gap-2">
            <div>
              <h3 className="font-black text-xs text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <span>समस्त परीक्षा तिथियाँ एवं विषय तालिका</span>
                <span className="px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 font-bold text-[10px]">
                  {getFilterDisplayTitle()}
                </span>
              </h3>
              <p className="text-[11px] text-slate-500">
                {selectedShiftFilter !== 'all' ? (selectedShiftFilter === 'shift1' ? 'केवल प्रथम पारी' : 'केवल द्वितीय पारी') : 'उभय पारियां'} • {showMaxMarks ? 'पूर्णांक सहित' : 'पूर्णांक रहित'}
              </p>
            </div>
            <span className="text-xs font-bold text-slate-500">कुल तिथियाँ: {filteredExams.length}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse min-w-[650px]">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-black border-b border-slate-200 dark:border-slate-700">
                  <th className="p-2.5">दिनांक व वार</th>
                  <th className="p-2.5">कक्षा</th>
                  <th className="p-2.5">विषय</th>
                  <th className="p-2.5">पारी व समय</th>
                  <th className="p-2.5">परीक्षा नाम</th>
                  {showMaxMarks && <th className="p-2.5">पूर्णांक</th>}
                  <th className="p-2.5 text-center">कार्रवाई</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {filteredExams.map((item) => {
                  const shiftInfo = getShiftBadge(item.shift);
                  return (
                    <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 font-medium">
                      <td className="p-2.5">
                        <strong className="block text-slate-900 dark:text-slate-100">{item.examDate}</strong>
                        <span className="text-[10px] text-slate-500">{item.dayOfWeek}</span>
                      </td>
                      <td className="p-2.5 font-bold text-sky-700 dark:text-sky-300">{item.className}</td>
                      <td className="p-2.5 font-black text-slate-900 dark:text-slate-100">{item.subjectName}</td>
                      <td className="p-2.5 space-y-1">
                        <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-black border ${shiftInfo.color}`}>
                          {shiftInfo.label}
                        </span>
                        <div className="font-mono text-[10px] text-slate-600 dark:text-slate-400">{item.timeSlot}</div>
                      </td>
                      <td className="p-2.5 text-slate-600 dark:text-slate-400">{item.examTitle}</td>
                      {showMaxMarks && (
                        <td className="p-2.5 font-bold font-mono text-emerald-600">{item.maxMarks} अंक</td>
                      )}
                      <td className="p-2.5 text-center">
                        <div className="flex items-center justify-center space-x-1">
                          <button
                            onClick={() => handleEditClick(item)}
                            className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600"
                            title="संपादित करें"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(item.id)}
                            className="p-1.5 rounded-lg hover:bg-rose-100 text-rose-600"
                            title="हटाएं"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 3: FORM VIEW */}
      {viewMode === 'form' && (
        <form onSubmit={handleSaveExam} className="p-5 sm:p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-4 text-xs">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <h3 className="font-black text-slate-900 dark:text-slate-100 text-sm flex items-center gap-2">
              <Plus className="w-4 h-4 text-sky-600" />
              <span>{editingId ? 'परीक्षा विवरण संपादित करें' : 'नया परीक्षा कार्यक्रम जोड़ें (Add Schedule)'}</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div>
              <label className="block font-black text-slate-700 dark:text-slate-300 mb-1">
                परीक्षा का नाम (Exam Title):
              </label>
              <input
                type="text"
                value={examTitle}
                onChange={e => setExamTitle(e.target.value)}
                placeholder="उदा. अर्धवार्षिक परीक्षा / बोर्ड प्री-एग्जाम..."
                className="w-full px-3 py-2 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
                required
              />
            </div>

            <div>
              <label className="block font-black text-slate-700 dark:text-slate-300 mb-1">
                कक्षा (Class / Grade):
              </label>
              <select
                value={className}
                onChange={e => setClassName(e.target.value)}
                className="w-full px-3 py-2 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
              >
                {['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-black text-slate-700 dark:text-slate-300 mb-1">
                विषय का नाम (Subject Name): *
              </label>
              <input
                type="text"
                value={subjectName}
                onChange={e => setSubjectName(e.target.value)}
                placeholder="उदा. गणित / विज्ञान / हिंदी..."
                className="w-full px-3 py-2 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
                required
              />
            </div>

            <div>
              <label className="block font-black text-slate-700 dark:text-slate-300 mb-1">
                परीक्षा तिथि (Exam Date): *
              </label>
              <input
                type="date"
                value={examDate}
                onChange={e => setExamDate(e.target.value)}
                className="w-full px-3 py-2 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
                required
              />
            </div>

            {/* Shift Option Selector */}
            <div className="sm:col-span-2 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2">
              <label className="block font-black text-slate-800 dark:text-slate-200">
                परीक्षा पारी चयन (Shift Selection):
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShift('shift1');
                    setTimeSlot('08:30 AM - 11:45 AM');
                  }}
                  className={`p-2.5 rounded-xl border text-left flex items-center justify-between cursor-pointer transition-all ${
                    shift === 'shift1' || shift === 'morning'
                      ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-400 text-amber-900 dark:text-amber-200 ring-2 ring-amber-400/30'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div>
                    <strong className="block font-black">🌅 प्रथम पारी (First Shift)</strong>
                    <span className="text-[11px] opacity-80">प्रातः 08:30 AM से 11:45 AM</span>
                  </div>
                  {(shift === 'shift1' || shift === 'morning') && <CheckCircle2 className="w-4 h-4 text-amber-600" />}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShift('shift2');
                    setTimeSlot('01:15 PM - 04:30 PM');
                  }}
                  className={`p-2.5 rounded-xl border text-left flex items-center justify-between cursor-pointer transition-all ${
                    shift === 'shift2' || shift === 'afternoon'
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-400 text-indigo-900 dark:text-indigo-200 ring-2 ring-indigo-400/30'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div>
                    <strong className="block font-black">🌇 द्वितीय पारी (Second Shift)</strong>
                    <span className="text-[11px] opacity-80">दोपहर 01:15 PM से 04:30 PM</span>
                  </div>
                  {(shift === 'shift2' || shift === 'afternoon') && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block font-black text-slate-700 dark:text-slate-300 mb-1">
                समय अवधि विवरण (Time Slot Display):
              </label>
              <input
                type="text"
                value={timeSlot}
                onChange={e => setTimeSlot(e.target.value)}
                placeholder="08:30 AM - 11:45 AM"
                className="w-full px-3 py-2 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
                required
              />
            </div>

            <div>
              <label className="block font-black text-slate-700 dark:text-slate-300 mb-1">
                पूर्णांक (Max Marks):
              </label>
              <input
                type="number"
                value={maxMarks}
                onChange={e => setMaxMarks(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
                required
              />
            </div>

            <div>
              <label className="block font-black text-slate-700 dark:text-slate-300 mb-1">
                परीक्षा कक्ष / हाल (Rooms):
              </label>
              <input
                type="text"
                value={rooms}
                onChange={e => setRooms(e.target.value)}
                placeholder="कक्ष संख्या 1 से 4"
                className="w-full px-3 py-2 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-black text-slate-700 dark:text-slate-300 mb-1">
                पाठ्यक्रम / निर्देश (Syllabus Notes):
              </label>
              <input
                type="text"
                value={syllabusNotes}
                onChange={e => setSyllabusNotes(e.target.value)}
                placeholder="उदा. अध्याय 1 से 6 तक..."
                className="w-full px-3 py-2 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium"
              />
            </div>

          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 py-3 px-4 rounded-2xl bg-sky-700 hover:bg-sky-800 text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg cursor-pointer min-h-[44px]"
            >
              <CheckCircle2 className="w-4 h-4 text-amber-300" />
              <span>{editingId ? 'संशोधन सुरक्षित करें' : 'परीक्षा समय सारणी सुरक्षित करें'}</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('calendar')}
              className="py-3 px-5 rounded-2xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-800 dark:text-slate-200 font-bold text-xs cursor-pointer min-h-[44px]"
            >
              रद्द करें
            </button>
          </div>
        </form>
      )}

      {/* VIEW 4: PRINTABLE OFFICIAL EXAM TIMETABLE (PDF GENERATION) */}
      {viewMode === 'print' && (
        <div className="space-y-4">
          {/* Action Bar */}
          <div className="p-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs print:hidden">
            <div className="space-y-0.5">
              <span className="font-black text-slate-900 dark:text-slate-100 block">
                आधिकारिक परीक्षा समय-सारणी प्रपत्र (PDF Preview):
              </span>
              <p className="text-[11px] text-slate-500">
                चयनित: {getFilterDisplayTitle()} • {selectedShiftFilter !== 'all' ? (selectedShiftFilter === 'shift1' ? 'प्रथम पारी' : 'द्वितीय पारी') : 'उभय पारियां'} • {showMaxMarks ? 'पूर्णांक सहित' : 'पूर्णांक रहित'}
              </p>
            </div>
            
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => setShowMaxMarks(!showMaxMarks)}
                className="px-3 py-2 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer min-h-[44px]"
              >
                {showMaxMarks ? '🚫 पूर्णांक हटाएं' : '💯 पूर्णांक दिखाएं'}
              </button>

              <button
                onClick={handlePrint}
                className="flex-1 sm:flex-initial px-5 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all min-h-[44px]"
              >
                <Printer className="w-4 h-4" />
                <span>प्रिंट / PDF सेव करें (Print Timetable)</span>
              </button>
            </div>
          </div>

          {/* OFFICIAL TIMETABLE SHEET (A4 optimized print view) */}
          <div className="bg-white text-slate-900 p-6 sm:p-10 rounded-3xl border border-slate-300 shadow-2xl space-y-6 font-serif max-w-4xl mx-auto print:border-none print:shadow-none print:p-0 print:max-w-none">
            
            {/* Official Header */}
            <div className="text-center border-b-2 border-slate-900 pb-4 space-y-1">
              <h4 className="font-bold text-xs uppercase tracking-widest text-slate-700">
                कार्यालय पंचायत प्रारंभिक शिक्षा अधिकारी (PEEO) एवं प्रधानाचार्य
              </h4>
              <h1 className="text-lg sm:text-xl font-black text-slate-950 tracking-tight">
                {schoolProfile?.schoolName || 'राजकीय उच्च माध्यमिक विद्यालय'}
              </h1>
              <p className="text-xs font-bold text-slate-800">
                यू-डाइज कोड: <span className="font-mono">{schoolProfile?.udiseCode || '08123456789'}</span> • सत्र: 2026-2027
              </p>
              
              {/* Dynamic Timetable Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 border border-slate-400 text-xs font-black uppercase tracking-wider mt-2">
                <span>📅 परीक्षा समय-सारणी पत्रक (Official Timetable)</span>
                <span className="text-sky-800 font-bold">• {getFilterDisplayTitle()}</span>
                {selectedShiftFilter !== 'all' && (
                  <span className="text-amber-800 font-bold">• {selectedShiftFilter === 'shift1' ? 'प्रथम पारी' : 'द्वितीय पारी'}</span>
                )}
              </div>
            </div>

            {/* Timetable Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-slate-900 text-xs text-left">
                <thead>
                  <tr className="bg-slate-100 text-slate-950 font-black border-b border-slate-900">
                    <th className="p-2 border border-slate-900 w-28">दिनांक व वार</th>
                    <th className="p-2 border border-slate-900 w-20">कक्षा</th>
                    <th className="p-2 border border-slate-900">विषय का नाम</th>
                    <th className="p-2 border border-slate-900 w-36">पारी एवं समय</th>
                    {showMaxMarks && <th className="p-2 border border-slate-900 w-20">पूर्णांक</th>}
                    <th className="p-2 border border-slate-900 w-24">परीक्षा कक्ष</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredExams.map((ex) => {
                    const shiftInfo = getShiftBadge(ex.shift);
                    return (
                      <tr key={ex.id} className="border-b border-slate-300 font-medium">
                        <td className="p-2 border border-slate-900">
                          <strong>{ex.examDate}</strong>
                          <div className="text-[10px] text-slate-600">({ex.dayOfWeek})</div>
                        </td>
                        <td className="p-2 border border-slate-900 font-bold text-slate-950">{ex.className}</td>
                        <td className="p-2 border border-slate-900 font-black text-slate-900">
                          {ex.subjectName}
                          {ex.syllabusNotes && (
                            <div className="text-[10px] font-normal text-slate-600 mt-0.5">
                              पाठ्यक्रम: {ex.syllabusNotes}
                            </div>
                          )}
                        </td>
                        <td className="p-2 border border-slate-900">
                          <div className="font-bold text-[11px]">{shiftInfo.label}</div>
                          <div className="font-mono text-[10px] text-slate-700">{ex.timeSlot}</div>
                        </td>
                        {showMaxMarks && (
                          <td className="p-2 border border-slate-900 font-bold font-mono">{ex.maxMarks} अंक</td>
                        )}
                        <td className="p-2 border border-slate-900 text-center">{ex.rooms || '-'}</td>
                      </tr>
                    );
                  })}
                  {filteredExams.length === 0 && (
                    <tr>
                      <td colSpan={showMaxMarks ? 6 : 5} className="p-6 text-center text-slate-500 font-bold border border-slate-900">
                        चयनित फ़िल्टर के अनुसार कोई परीक्षा अनुसूची उपलब्ध नहीं है।
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* General Instructions for Students */}
            <div className="p-3 bg-slate-50 border border-slate-300 rounded-xl space-y-1 text-[11px]">
              <strong className="block text-slate-900">महत्वपूर्ण परीक्षा निर्देश:</strong>
              <ol className="list-decimal pl-4 space-y-0.5 text-slate-700">
                <li>परीक्षार्थी परीक्षा प्रारंभ होने से 15 मिनट पूर्व अपने निर्धारित परीक्षा कक्ष में अनिवार्य रूप से उपस्थित हों।</li>
                <li>परीक्षा कक्ष में मोबाइल फोन, कैलकुलेटर अथवा अन्य इलेक्ट्रॉनिक उपकरण लाना पूर्णतया वर्जित है।</li>
                <li>प्रत्येक परीक्षार्थी अपने साथ प्रवेश पत्र, पेन, पेंसिल व आवश्यक ज्यामिति सामग्री साथ लाएं।</li>
              </ol>
            </div>

            {/* Signature Block */}
            <div className="pt-8 flex justify-between items-end text-xs font-bold text-slate-900">
              <div className="text-center space-y-1">
                <div className="w-36 h-10 border-b border-dashed border-slate-400 mx-auto"></div>
                <p>हस्ताक्षर परीक्षा प्रभारी</p>
              </div>

              <div className="text-center space-y-1">
                <div className="w-40 h-10 border-b border-dashed border-slate-400 mx-auto"></div>
                <p>हस्ताक्षर पीईईओ / प्रधानाचार्य मय मोहर</p>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
