import React, { useState, useEffect } from 'react';
import { SchoolProfile, Teacher, Language } from '../../types';
import { ThreeDIcon } from '../ThreeDIcon';
import {
  Calendar,
  Clock,
  Users,
  Plus,
  Trash2,
  Edit2,
  Printer,
  Download,
  Filter,
  CheckCircle2,
  Search,
  ArrowLeft,
  Briefcase,
  MapPin,
  FileText,
  ShieldCheck,
  Building2,
  Sparkles,
  Info
} from 'lucide-react';

export interface DutyAssignment {
  id: string;
  teacherName: string;
  teacherDesignation?: string;
  dutyType: 'assembly' | 'gate' | 'mdm' | 'exam' | 'cultural' | 'sports' | 'cleanliness' | 'bus' | 'custom';
  dutyTitleHindi: string;
  dutyTitleEnglish: string;
  dateOrPeriod: string;
  shiftOrTime: string;
  location: string;
  remarksHindi?: string;
  createdAt: number;
}

interface DutyRosterModuleProps {
  schoolProfile: SchoolProfile;
  teachers?: Teacher[];
  lang: Language;
  onBack?: () => void;
}

const PREDEFINED_DUTY_TYPES = [
  { id: 'assembly', labelHi: 'प्रातःकालीन प्रार्थना सभा एवं अनुशासन', labelEn: 'Morning Assembly & Prayer Duty', defaultTime: '07:30 AM - 08:15 AM', defaultLoc: 'प्रार्थना सभा मैदान' },
  { id: 'gate', labelHi: 'मुख्य द्वार प्रवेश व अनुशासन सुरक्षा', labelEn: 'Main Gate Arrival & Discipline Duty', defaultTime: '07:15 AM - 08:00 AM', defaultLoc: 'विद्यालय मुख्य द्वार' },
  { id: 'mdm', labelHi: 'मध्याह्न भोजन (MDM) वितरण व्यवस्था', labelEn: 'Mid-Day Meal Distribution Supervision', defaultTime: '11:45 AM - 12:45 PM', defaultLoc: 'एमडीएम भोजन हाल / रसोई' },
  { id: 'exam', labelHi: 'परीक्षा / परख वीक्षण एवं कक्ष व्यवस्था', labelEn: 'Examination & Assessment Invigilation', defaultTime: '08:30 AM - 11:45 AM', defaultLoc: 'आवंटित परीक्षा कक्ष' },
  { id: 'cultural', labelHi: 'सांस्कृतिक एवं बाल सभा गतिविधि प्रभारी', labelEn: 'Cultural & Bal Sabha Event Incharge', defaultTime: 'शनिवार 11:00 AM - 01:00 PM', defaultLoc: 'सभाकक्ष / मंच' },
  { id: 'sports', labelHi: 'खेलकूद एवं पीटी गतिविधि पर्यवेक्षण', labelEn: 'Sports & PT Physical Duty', defaultTime: '08:00 AM - 08:45 AM', defaultLoc: 'खेल मैदान' },
  { id: 'cleanliness', labelHi: 'विद्यालय परिसर स्वच्छता व इको-क्लब', labelEn: 'Campus Cleanliness & Hygiene Supervision', defaultTime: '01:30 PM - 02:00 PM', defaultLoc: 'समस्त विद्यालय परिसर' },
  { id: 'bus', labelHi: 'सायंकालीन छात्र रवानगी व बस सुरक्षा', labelEn: 'Evening Departure & Transport Duty', defaultTime: '02:00 PM - 02:30 PM', defaultLoc: 'वाहन स्टॉप / निकास द्वार' },
  { id: 'custom', labelHi: 'अन्य विशेष विद्यालयीय दायित्व', labelEn: 'Other Custom Duty Activity', defaultTime: 'नियत समयानुसार', defaultLoc: 'निर्दिष्ट स्थान' }
];

const INITIAL_SAMPLE_DUTIES: DutyAssignment[] = [
  {
    id: 'duty-1',
    teacherName: 'रमेश चंद्र शर्मा',
    teacherDesignation: 'व्याख्याता (हिंदी)',
    dutyType: 'assembly',
    dutyTitleHindi: 'प्रातःकालीन प्रार्थना सभा एवं अनुशासन',
    dutyTitleEnglish: 'Morning Assembly & Prayer Duty',
    dateOrPeriod: '2026-08-04 से 2026-08-09 (साप्ताहिक)',
    shiftOrTime: '07:30 AM - 08:15 AM',
    location: 'प्रार्थना सभा मैदान',
    remarksHindi: 'छात्रों की कतारबद्ध उपस्थिति एवं राष्ट्रगान का सुचारू संचालन सुनिश्चित करें।',
    createdAt: Date.now() - 500000
  },
  {
    id: 'duty-2',
    teacherName: 'सुनीता कुमारी मीणा',
    teacherDesignation: 'वरिष्ठ अध्यापक (विज्ञान)',
    dutyType: 'mdm',
    dutyTitleHindi: 'मध्याह्न भोजन (MDM) वितरण व्यवस्था',
    dutyTitleEnglish: 'Mid-Day Meal Distribution Supervision',
    dateOrPeriod: '2026-08-04 से 2026-08-09',
    shiftOrTime: '11:45 AM - 12:45 PM',
    location: 'एमडीएम भोजन हाल',
    remarksHindi: 'हैंडवॉश चरण, भोजन गुणवत्ता जांच एवं कतारबद्ध वितरण निरीक्षण।',
    createdAt: Date.now() - 400000
  },
  {
    id: 'duty-3',
    teacherName: 'अनिल कुमार जाट',
    teacherDesignation: 'शारीरिक शिक्षक (PTI)',
    dutyType: 'gate',
    dutyTitleHindi: 'मुख्य द्वार प्रवेश व अनुशासन सुरक्षा',
    dutyTitleEnglish: 'Main Gate Arrival & Discipline Duty',
    dateOrPeriod: 'दैनिक (सोमवार - शनिवार)',
    shiftOrTime: '07:15 AM - 08:00 AM',
    location: 'विद्यालय मुख्य द्वार',
    remarksHindi: 'समयबद्ध प्रवेश एवं अनुशासनहीनता पर नियंत्रण हेतु।',
    createdAt: Date.now() - 300000
  },
  {
    id: 'duty-4',
    teacherName: 'पूजा सैन',
    teacherDesignation: 'अध्यापक एल-2 (अंग्रेजी)',
    dutyType: 'cultural',
    dutyTitleHindi: 'सांस्कृतिक एवं बाल सभा गतिविधि प्रभारी',
    dutyTitleEnglish: 'Cultural & Bal Sabha Event Incharge',
    dateOrPeriod: 'प्रत्येक शनिवार',
    shiftOrTime: '11:00 AM - 01:00 PM',
    location: 'सांस्कृतिक मंच',
    remarksHindi: 'हाउस वार बाल सभा गतिविधियों की पूर्व तैयारी व निर्णय।',
    createdAt: Date.now() - 200000
  }
];

export const DutyRosterModule: React.FC<DutyRosterModuleProps> = ({
  schoolProfile,
  teachers = [],
  lang,
  onBack
}) => {
  const [duties, setDuties] = useState<DutyAssignment[]>(() => {
    try {
      const saved = localStorage.getItem('shala_sahayak_duty_roster');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_SAMPLE_DUTIES;
  });

  const [activeTab, setActiveTab] = useState<'roster' | 'create' | 'print'>('roster');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [toast, setToast] = useState<string | null>(null);

  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedTeacherName, setSelectedTeacherName] = useState('');
  const [selectedTeacherDesignation, setSelectedTeacherDesignation] = useState('');
  const [selectedDutyType, setSelectedDutyType] = useState('assembly');
  const [customDutyTitle, setCustomDutyTitle] = useState('');
  const [dateOrPeriod, setDateOrPeriod] = useState('2026-08-04 से 2026-08-09');
  const [shiftOrTime, setShiftOrTime] = useState('07:30 AM - 08:15 AM');
  const [location, setLocation] = useState('प्रार्थना सभा मैदान');
  const [remarks, setRemarks] = useState('');

  const [dispatchNo, setDispatchNo] = useState(`शिविरा/आदेश/${new Date().getFullYear()}/412`);
  const [dispatchDate, setDispatchDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    try {
      localStorage.setItem('shala_sahayak_duty_roster', JSON.stringify(duties));
    } catch (e) {
      console.error(e);
    }
  }, [duties]);

  const showToastMsg = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // Handle duty type select change to fill defaults
  const handleDutyTypeChange = (typeId: string) => {
    setSelectedDutyType(typeId);
    const found = PREDEFINED_DUTY_TYPES.find(d => d.id === typeId);
    if (found) {
      setShiftOrTime(found.defaultTime);
      setLocation(found.defaultLoc);
    }
  };

  // Handle Teacher select change
  const handleTeacherSelect = (teacherIdOrName: string) => {
    const foundTeacher = teachers.find(t => t.id === teacherIdOrName || t.name === teacherIdOrName);
    if (foundTeacher) {
      setSelectedTeacherName(foundTeacher.name);
      setSelectedTeacherDesignation(foundTeacher.designation || 'शिक्षक');
    } else {
      setSelectedTeacherName(teacherIdOrName);
    }
  };

  // Submit Duty Form
  const handleSaveDuty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeacherName.trim()) {
      showToastMsg('कृपया शिक्षक का नाम दर्ज करें।');
      return;
    }

    const dutyMeta = PREDEFINED_DUTY_TYPES.find(d => d.id === selectedDutyType);
    const titleHi = selectedDutyType === 'custom' && customDutyTitle ? customDutyTitle : (dutyMeta?.labelHi || 'विशेष कार्य');
    const titleEn = selectedDutyType === 'custom' && customDutyTitle ? customDutyTitle : (dutyMeta?.labelEn || 'Special Duty');

    if (editingId) {
      const updated = duties.map(d => d.id === editingId ? {
        ...d,
        teacherName: selectedTeacherName,
        teacherDesignation: selectedTeacherDesignation,
        dutyType: selectedDutyType as any,
        dutyTitleHindi: titleHi,
        dutyTitleEnglish: titleEn,
        dateOrPeriod,
        shiftOrTime,
        location,
        remarksHindi: remarks
      } : d);
      setDuties(updated);
      showToastMsg('✅ ड्यूटी रोस्टर में संशोधन सुरक्षित किया गया!');
    } else {
      const newDuty: DutyAssignment = {
        id: `duty-${Date.now()}`,
        teacherName: selectedTeacherName,
        teacherDesignation: selectedTeacherDesignation,
        dutyType: selectedDutyType as any,
        dutyTitleHindi: titleHi,
        dutyTitleEnglish: titleEn,
        dateOrPeriod,
        shiftOrTime,
        location,
        remarksHindi: remarks,
        createdAt: Date.now()
      };
      setDuties([newDuty, ...duties]);
      showToastMsg('✅ नया शिक्षक कार्यभार आवंटन सफलतापूर्वक जोड़ा गया!');
    }

    // Reset Form
    setEditingId(null);
    setSelectedTeacherName('');
    setSelectedTeacherDesignation('');
    setCustomDutyTitle('');
    setRemarks('');
    setActiveTab('roster');
  };

  const handleEditClick = (duty: DutyAssignment) => {
    setEditingId(duty.id);
    setSelectedTeacherName(duty.teacherName);
    setSelectedTeacherDesignation(duty.teacherDesignation || '');
    setSelectedDutyType(duty.dutyType);
    setDateOrPeriod(duty.dateOrPeriod);
    setShiftOrTime(duty.shiftOrTime);
    setLocation(duty.location);
    setRemarks(duty.remarksHindi || '');
    if (duty.dutyType === 'custom') {
      setCustomDutyTitle(duty.dutyTitleHindi);
    }
    setActiveTab('create');
  };

  const handleDeleteClick = (id: string) => {
    if (window.confirm('क्या आप इस कार्यभार आवंटन प्रविष्टि को हटाना चाहते हैं?')) {
      const filtered = duties.filter(d => d.id !== id);
      setDuties(filtered);
      showToastMsg('प्रविष्टि हटाई गई।');
    }
  };

  const handlePrintChart = () => {
    window.print();
  };

  // Filtered Duties
  const filteredDuties = duties.filter(d => {
    const matchType = filterType === 'all' ? true : d.dutyType === filterType;
    const matchSearch = d.teacherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.dutyTitleHindi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchType && matchSearch;
  });

  return (
    <div className="space-y-5">
      
      {/* Module Header Bar */}
      <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-slate-900 text-white p-4 sm:p-5 rounded-3xl shadow-xl border border-emerald-800/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <Briefcase className="w-6 h-6 text-amber-300" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black tracking-tight flex items-center gap-2">
              <span>शिक्षक कार्य/कर्तव्य आवंटन रोस्टर</span>
              <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-amber-400 text-slate-950 uppercase">
                Duty Chart Engine
              </span>
            </h2>
            <p className="text-xs text-slate-300">
              {schoolProfile?.schoolName || 'राजकीय विद्यालय'} • प्रार्थना सभा, एमडीएम, परीक्षा एवं मुख्य द्वार ड्यूटी चार्ट जनरेटर
            </p>
          </div>
        </div>

        {/* Header Action Tabs */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => { setEditingId(null); setActiveTab('roster'); }}
            className={`flex-1 sm:flex-none px-3.5 py-2 rounded-2xl font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'roster'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>रोस्टर सूची ({duties.length})</span>
          </button>

          <button
            onClick={() => { setEditingId(null); setActiveTab('create'); }}
            className={`flex-1 sm:flex-none px-3.5 py-2 rounded-2xl font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'create'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>नया आवंटन जोड़ें</span>
          </button>

          <button
            onClick={() => setActiveTab('print')}
            className={`flex-1 sm:flex-none px-3.5 py-2 rounded-2xl font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'print'
                ? 'bg-amber-400 text-slate-950 shadow-md'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <Printer className="w-4 h-4" />
            <span>प्रिंट प्रपत्र</span>
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className="p-3 bg-emerald-900 text-white rounded-2xl font-bold text-xs flex items-center justify-between border border-emerald-700 shadow-lg animate-in fade-in duration-200">
          <span className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{toast}</span>
          </span>
          <button onClick={() => setToast(null)}>✕</button>
        </div>
      )}

      {/* MAIN VIEW TAB 1: ROSTER LIST */}
      {activeTab === 'roster' && (
        <div className="space-y-4">
          
          {/* Filter Bar & Search */}
          <div className="p-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder="शिक्षक का नाम, कार्य या स्थान खोजें..."
                  className="w-full pl-9 pr-3 py-2 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                <span className="text-xs font-extrabold text-slate-500 whitespace-nowrap">श्रेणी:</span>
                <select
                  value={filterType}
                  onChange={e => setFilterType(e.target.value)}
                  className="px-3 py-2 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="all">समस्त गतिविधियाँ (All)</option>
                  {PREDEFINED_DUTY_TYPES.map(t => (
                    <option key={t.id} value={t.id}>{t.labelHi}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Duty Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredDuties.length === 0 ? (
              <div className="col-span-full p-10 text-center bg-slate-50 dark:bg-slate-800/40 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 space-y-2">
                <Info className="w-10 h-10 text-slate-400 mx-auto" />
                <p className="text-xs font-bold text-slate-600 dark:text-slate-400">
                  कोई ड्यूटी आवंटन प्रविष्टि नहीं मिली। "नया आवंटन जोड़ें" बटन से प्रविष्टि करें।
                </p>
              </div>
            ) : (
              filteredDuties.map((duty, idx) => (
                <div
                  key={duty.id}
                  className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all space-y-3 relative overflow-hidden group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-mono font-black text-xs flex items-center justify-center border border-emerald-300 dark:border-emerald-800 shrink-0">
                        #{idx + 1}
                      </div>
                      <div>
                        <h3 className="font-black text-sm text-slate-900 dark:text-slate-100 leading-snug">
                          {duty.teacherName}
                        </h3>
                        {duty.teacherDesignation && (
                          <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 block">
                            {duty.teacherDesignation}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-1 shrink-0">
                      <button
                        onClick={() => handleEditClick(duty)}
                        className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-emerald-600 transition-all cursor-pointer"
                        title="संपादित करें"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(duty.id)}
                        className="p-2 rounded-xl hover:bg-rose-100 dark:hover:bg-rose-950/50 text-slate-400 hover:text-rose-600 transition-all cursor-pointer"
                        title="हटाएं"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800/80 space-y-2 text-xs">
                    <div className="flex items-center justify-between font-extrabold text-slate-800 dark:text-slate-200">
                      <span className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
                        <Briefcase className="w-3.5 h-3.5" />
                        <span>{duty.dutyTitleHindi}</span>
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-600 dark:text-slate-300 pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                      <div className="flex items-center gap-1.5 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{duty.dateOrPeriod}</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-medium">
                        <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{duty.shiftOrTime}</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-medium col-span-full">
                        <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span>स्थान: <strong>{duty.location}</strong></span>
                      </div>
                    </div>

                    {duty.remarksHindi && (
                      <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200/50 dark:border-slate-800">
                        💡 <strong>विशेष निर्देश:</strong> {duty.remarksHindi}
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* MAIN VIEW TAB 2: CREATE / EDIT FORM */}
      {activeTab === 'create' && (
        <form onSubmit={handleSaveDuty} className="p-5 sm:p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-4 text-xs">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <h3 className="font-black text-slate-900 dark:text-slate-100 text-sm flex items-center gap-2">
              <Plus className="w-4 h-4 text-emerald-600" />
              <span>{editingId ? 'कार्यभार आवंटन प्रविष्टि संपादित करें' : 'नया शिक्षक कार्यभार आवंटन जोड़ें (Assign Duty)'}</span>
            </h3>
            {editingId && (
              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px]">
                संपादन मोड (Editing)
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Teacher Selection */}
            <div>
              <label className="block font-black text-slate-700 dark:text-slate-300 mb-1">
                शिक्षक का चयन करें या नाम लिखें: *
              </label>
              {teachers.length > 0 ? (
                <div className="space-y-1.5">
                  <select
                    value={selectedTeacherName}
                    onChange={e => handleTeacherSelect(e.target.value)}
                    className="w-full px-3 py-2 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold focus:ring-2 focus:ring-emerald-500"
                    required
                  >
                    <option value="">-- विद्यालय शिक्षक चुनें --</option>
                    {teachers.map(t => (
                      <option key={t.id} value={t.name}>
                        {t.name} {t.designation ? `(${t.designation})` : ''}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={selectedTeacherName}
                    onChange={e => setSelectedTeacherName(e.target.value)}
                    placeholder="या मैनुअल शिक्षक नाम लिखें..."
                    className="w-full px-3 py-2 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
                  />
                </div>
              ) : (
                <input
                  type="text"
                  value={selectedTeacherName}
                  onChange={e => setSelectedTeacherName(e.target.value)}
                  placeholder="उदा. श्री रमेश चंद्र शर्मा..."
                  className="w-full px-3 py-2 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
                  required
                />
              )}
            </div>

            {/* Designation */}
            <div>
              <label className="block font-black text-slate-700 dark:text-slate-300 mb-1">
                पदनाम (Designation):
              </label>
              <input
                type="text"
                value={selectedTeacherDesignation}
                onChange={e => setSelectedTeacherDesignation(e.target.value)}
                placeholder="उदा. व्याख्याता / वरिष्ठ अध्यापक / शारीरिक शिक्षक..."
                className="w-full px-3 py-2 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
              />
            </div>

            {/* Duty Type */}
            <div>
              <label className="block font-black text-slate-700 dark:text-slate-300 mb-1">
                गतिविधि / कर्तव्य का प्रकार:
              </label>
              <select
                value={selectedDutyType}
                onChange={e => handleDutyTypeChange(e.target.value)}
                className="w-full px-3 py-2 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold focus:ring-2 focus:ring-emerald-500"
              >
                {PREDEFINED_DUTY_TYPES.map(t => (
                  <option key={t.id} value={t.id}>{t.labelHi}</option>
                ))}
              </select>
            </div>

            {/* Custom Activity Title if Selected */}
            {selectedDutyType === 'custom' && (
              <div>
                <label className="block font-black text-slate-700 dark:text-slate-300 mb-1">
                  विशेष कार्य / शीर्षक:
                </label>
                <input
                  type="text"
                  value={customDutyTitle}
                  onChange={e => setCustomDutyTitle(e.target.value)}
                  placeholder="उदा. वार्षिक उत्सव मंच व्यवस्था, जलपान व्यवस्था..."
                  className="w-full px-3 py-2 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
                  required
                />
              </div>
            )}

            {/* Date / Period */}
            <div>
              <label className="block font-black text-slate-700 dark:text-slate-300 mb-1">
                दिनांक / कार्यावधि (Period / Dates):
              </label>
              <input
                type="text"
                value={dateOrPeriod}
                onChange={e => setDateOrPeriod(e.target.value)}
                placeholder="उदा. 2026-08-04 से 2026-08-09 या दैनिक..."
                className="w-full px-3 py-2 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
                required
              />
            </div>

            {/* Shift / Time */}
            <div>
              <label className="block font-black text-slate-700 dark:text-slate-300 mb-1">
                समय / पालि (Shift / Timing):
              </label>
              <input
                type="text"
                value={shiftOrTime}
                onChange={e => setShiftOrTime(e.target.value)}
                placeholder="उदा. 07:30 AM - 08:15 AM..."
                className="w-full px-3 py-2 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
                required
              />
            </div>

            {/* Location / Area */}
            <div>
              <label className="block font-black text-slate-700 dark:text-slate-300 mb-1">
                कर्तव्य स्थान / कमरा / क्षेत्र:
              </label>
              <input
                type="text"
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="उदा. मुख्य द्वार / प्रार्थना मैदान / एमडीएम भोजन हाल..."
                className="w-full px-3 py-2 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
                required
              />
            </div>

            {/* Remarks */}
            <div className="sm:col-span-2">
              <label className="block font-black text-slate-700 dark:text-slate-300 mb-1">
                विशेष निर्देश / टिप्पणी (Instructions):
              </label>
              <textarea
                rows={2}
                value={remarks}
                onChange={e => setRemarks(e.target.value)}
                placeholder="उदा. बालिकाओं की सुचारू पंक्तिबद्धता एवं समय पालन का विशेष ध्यान रखें..."
                className="w-full px-3 py-2 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 py-3 px-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 text-amber-300" />
              <span>{editingId ? 'संशोधन सुरक्षित करें' : 'कर्तव्य रोस्टर सुरक्षित करें'}</span>
            </button>

            <button
              type="button"
              onClick={() => { setEditingId(null); setActiveTab('roster'); }}
              className="py-3 px-5 rounded-2xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-800 dark:text-slate-200 font-bold text-xs cursor-pointer"
            >
              रद्द करें
            </button>
          </div>
        </form>
      )}

      {/* MAIN VIEW TAB 3: PRINTABLE DUTY CHART / ORDER FORMAT */}
      {activeTab === 'print' && (
        <div className="space-y-4">
          <div className="p-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 text-xs print:hidden">
            <div className="flex items-center space-x-3">
              <input
                type="text"
                value={dispatchNo}
                onChange={e => setDispatchNo(e.target.value)}
                placeholder="क्रमांक / Dispatch No..."
                className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 font-mono font-bold text-xs"
              />
              <input
                type="date"
                value={dispatchDate}
                onChange={e => setDispatchDate(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 font-mono font-bold text-xs"
              />
            </div>

            <button
              onClick={handlePrintChart}
              className="px-4 py-2 rounded-2xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs flex items-center gap-2 shadow-md cursor-pointer transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>ड्यूटी चार्ट प्रिंट / PDF जनरेट करें</span>
            </button>
          </div>

          {/* FORMAL PRINTABLE OFFICE ORDER SHEET */}
          <div className="bg-white text-slate-900 p-8 sm:p-10 rounded-3xl border border-slate-300 shadow-2xl space-y-6 font-serif max-w-4xl mx-auto print:border-none print:shadow-none print:p-0 print:max-w-none">
            
            {/* Header */}
            <div className="text-center border-b-2 border-slate-900 pb-4 space-y-1">
              <h4 className="font-bold text-xs uppercase tracking-widest text-slate-700">
                राजस्थान सरकार • स्कूल शिक्षा विभाग
              </h4>
              <h1 className="text-lg sm:text-xl font-black text-slate-950 tracking-tight">
                {schoolProfile?.schoolName || 'राजकीय उच्च माध्यमिक विद्यालय'}
              </h1>
              <p className="text-xs font-bold text-slate-800">
                यू-डाइज कोड: <span className="font-mono">{schoolProfile?.udiseCode || '08123456789'}</span> • ब्लॉक/पंचायत: {schoolProfile?.blockName || 'शिक्षा ब्लॉक'}
              </p>
              <div className="inline-block px-4 py-1 rounded-full bg-slate-100 border border-slate-300 text-xs font-black uppercase tracking-wider mt-2">
                कार्यालय आदेश: शिक्षकीय कार्य एवं कर्तव्य आवंटन रोस्टर
              </div>
            </div>

            {/* Order Dispatch Details */}
            <div className="flex justify-between text-xs font-bold font-mono border-b border-slate-200 pb-2">
              <span>क्रमांक: {dispatchNo}</span>
              <span>दिनांक: {dispatchDate}</span>
            </div>

            {/* Directive Text */}
            <p className="text-xs leading-relaxed text-slate-800 font-medium">
              विद्यालय में सुचारू शिक्षण वातावरण, अनुशासन, मध्याह्न भोजन वितरण व्यवस्था एवं सुरक्षा व्यवस्था बनाए रखने हेतु निम्नांकित शिक्षकों को सम्मुख अंकित समयावधि एवं स्थान हेतु कर्तव्य आवंटित किया जाता है। समस्त संबंधित कार्मिक नियत समय पर कर्तव्य स्थल पर उपस्थित होकर दायित्व का निर्वहन सुनिश्चित करें:
            </p>

            {/* Duty Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-slate-900 text-xs text-left">
                <thead>
                  <tr className="bg-slate-100 text-slate-950 font-black border-b border-slate-900 text-[11px]">
                    <th className="p-2 border border-slate-900 w-10 text-center">क्र.सं.</th>
                    <th className="p-2 border border-slate-900">शिक्षक का नाम व पद</th>
                    <th className="p-2 border border-slate-900">आवंटित कार्य / गतिविधि</th>
                    <th className="p-2 border border-slate-900">कार्यावधि एवं समय</th>
                    <th className="p-2 border border-slate-900">स्थान</th>
                    <th className="p-2 border border-slate-900">विशेष निर्देश</th>
                    <th className="p-2 border border-slate-900 w-16 text-center">हस्ताक्षर</th>
                  </tr>
                </thead>
                <tbody>
                  {duties.map((d, i) => (
                    <tr key={d.id} className="border-b border-slate-300 font-medium">
                      <td className="p-2 border border-slate-900 text-center font-bold font-mono">{i + 1}</td>
                      <td className="p-2 border border-slate-900">
                        <strong className="block text-slate-950">{d.teacherName}</strong>
                        <span className="text-[10px] text-slate-600">{d.teacherDesignation || 'शिक्षक'}</span>
                      </td>
                      <td className="p-2 border border-slate-900 font-bold">{d.dutyTitleHindi}</td>
                      <td className="p-2 border border-slate-900">
                        <div>{d.dateOrPeriod}</div>
                        <div className="text-[10px] font-mono text-slate-600">{d.shiftOrTime}</div>
                      </td>
                      <td className="p-2 border border-slate-900 font-bold">{d.location}</td>
                      <td className="p-2 border border-slate-900 text-[10px]">{d.remarksHindi || '-'}</td>
                      <td className="p-2 border border-slate-900 text-center font-mono"></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Guidelines */}
            <div className="p-3 bg-slate-50 border border-slate-300 rounded-xl space-y-1 text-[11px] font-medium text-slate-700">
              <p className="font-bold text-slate-900">निर्देश:</p>
              <ol className="list-decimal pl-4 space-y-0.5">
                <li>समस्त शिक्षक संबंधित पारी समय से 10 मिनट पूर्व कर्तव्य स्थल पर उपस्थिति सुनिश्चित करें।</li>
                <li>अनुपस्थिति या आकस्मिक अवकाश की स्थिति में संस्था प्रधान को पूर्व सूचना देकर स्थानापन्न व्यवस्था कराएं।</li>
              </ol>
            </div>

            {/* Signature Block */}
            <div className="pt-10 flex justify-between items-end text-xs font-bold text-slate-900">
              <div className="text-center space-y-1">
                <div className="w-32 h-12 border-b border-dashed border-slate-400 mx-auto"></div>
                <p>प्रभारी (विद्यालय गतिविधि)</p>
              </div>

              <div className="text-center space-y-1">
                <div className="w-40 h-12 border-b border-dashed border-slate-400 mx-auto"></div>
                <p>पीईईओ एवं प्रधानाचार्य</p>
                <p className="text-[10px] font-normal text-slate-600">{schoolProfile?.schoolName || 'राजकीय उच्च माध्यमिक विद्यालय'}</p>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
