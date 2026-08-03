import React, { useState, useEffect } from 'react';
import { Language, SchoolProfile, Teacher } from '../types';
import { storage } from '../utils/storage';
import { t } from '../utils/i18n';
import { 
  X, 
  Save, 
  Building2, 
  Users, 
  Database, 
  Download, 
  Upload, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  ChevronRight, 
  ChevronLeft, 
  RefreshCw,
  Eye,
  EyeOff,
  Sliders,
  RotateCcw,
  Lock,
  KeyRound
} from 'lucide-react';

interface SchoolProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  schoolProfile: SchoolProfile;
  onSave: (updatedProfile: SchoolProfile) => void;
  teachers?: Teacher[];
  onUpdateTeachers?: (teachers: Teacher[]) => void;
  lang: Language;
}

const ALL_MODULES_LIST = [
  { id: 'shivira', nameHi: 'शिविरा प्रोफाइल व पंचांग', nameEn: 'Shivira Calendar & Profile', descHi: 'अकादमिक कैलेंडर व अवकाश सूची' },
  { id: 'peeo', nameHi: 'पीईईओ / प्रधानाचार्य कार्यालय', nameEn: 'PEEO / Principal Office', descHi: 'प्रशासनिक आदेश व विद्यालय प्रबंधन' },
  { id: 'teacher', nameHi: 'शिक्षक व अकादमिक टूल', nameEn: 'Teacher & Academic Tools', descHi: 'शिक्षक डायरी, आईसीटी व पुस्तकालय' },
  { id: 'incharge', nameHi: 'कार्य प्रभारी दायित्व', nameEn: 'Work Incharge Modules', descHi: 'एमडीएम, परीक्षा, मानदेय व प्रभारी फॉर्म' },
  { id: 'portals', nameHi: 'शिक्षा पोर्टल्स डायरेक्ट लिंक', nameEn: 'Education Portals', descHi: 'शाला दर्पण, पे मैनेजर, एसएसओ व अन्य' },
  { id: 'result', nameHi: 'परीक्षा परिणाम व अंकसूची', nameEn: 'Exam Result & Marksheets', descHi: 'अंक तालिका एवं प्रगति पत्रक जनरेटर' },
  { id: 'invitation', nameHi: 'डिजिटल निमंत्रण पत्र', nameEn: 'Digital Invitation Maker', descHi: 'बाल सभा व वार्षिकोत्सव निमंत्रण' },
  { id: 'formats', nameHi: 'आधिकारिक प्रपत्र (Formats)', nameEn: 'Official Formats', descHi: 'विभागीय फॉर्म व आवेदन डाउनलोड' },
  { id: 'calculator', nameHi: '7वां वेतन कैलकुलेटर', nameEn: '7th Pay Calculator', descHi: 'मूल वेतन, डीए व एचआरए हिसाब' },
  { id: 'help', nameHi: 'सहायता एवं शिक्षण ब्लॉग', nameEn: 'Help & Educational Center', descHi: 'स्टेप-बाय-स्टेप उपयोग मार्गदर्शिका' },
  { id: 'share', nameHi: 'साझा करें (Share App)', nameEn: 'Share App Link', descHi: 'व्हाट्सएप व टेलीग्राम शेयर' },
  { id: 'feedback', nameHi: 'सुझाव व सहायता', nameEn: 'Feedback & Support', descHi: 'सुझाव व सहायता फॉर्म' }
];

export const SchoolProfileModal: React.FC<SchoolProfileModalProps> = ({
  isOpen,
  onClose,
  schoolProfile,
  onSave,
  teachers = [],
  onUpdateTeachers,
  lang
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [formData, setFormData] = useState<SchoolProfile>({ ...schoolProfile });
  const [localTeachers, setLocalTeachers] = useState<Teacher[]>([...teachers]);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  
  // Sync form state if profile updates from outside or on open
  useEffect(() => {
    if (isOpen) {
      setFormData({ ...schoolProfile });
    }
  }, [isOpen]);

  // Debounced auto-save effect for form inputs
  useEffect(() => {
    // Avoid running on the exact initial mount value if it matches initial prop
    if (JSON.stringify(formData) === JSON.stringify(schoolProfile)) {
      return;
    }

    setAutoSaveStatus('saving');
    storage.saveSchoolProfileDebounced(formData, () => {
      setAutoSaveStatus('saved');
      const nowStr = new Date().toLocaleString('en-IN');
      localStorage.setItem('shala_last_sync_time', nowStr);
      setLastSyncTime(nowStr);
      onSave(formData);
    });
  }, [formData]);

  // Hidden modules state
  const [hiddenModules, setHiddenModulesState] = useState<string[]>(
    () => schoolProfile.hiddenModules || storage.getHiddenModules() || []
  );

  // Admin PIN State
  const [adminPinEnabled, setAdminPinEnabledState] = useState<boolean>(() => storage.isAdminPinEnabled());
  const [adminPinValue, setAdminPinValue] = useState<string>(() => storage.getAdminPin() || '1234');

  // New teacher inline state
  const [tName, setTName] = useState('');
  const [tDesig, setTDesig] = useState('Senior Teacher');
  const [tPayLevel, setTPayLevel] = useState('L-11');
  const [tBasic, setTBasic] = useState('46500');
  const [tPhone, setTPhone] = useState('9829000000');

  const [lastSyncTime, setLastSyncTime] = useState<string>(() => {
    return localStorage.getItem('shala_last_sync_time') || new Date().toLocaleString('en-IN');
  });
  const [importStatus, setImportStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const toggleModuleVisibility = (id: string) => {
    const updated = hiddenModules.includes(id) 
      ? hiddenModules.filter(m => m !== id) 
      : [...hiddenModules, id];
    setHiddenModulesState(updated);
    storage.setHiddenModules(updated);
    setFormData(prev => ({ ...prev, hiddenModules: updated }));
  };

  const handleShowAllModules = () => {
    setHiddenModulesState([]);
    storage.setHiddenModules([]);
    setFormData(prev => ({ ...prev, hiddenModules: [] }));
  };

  const handleAddTeacherInline = () => {
    if (!tName.trim()) return;
    const newT: Teacher = {
      id: Date.now().toString(),
      name: tName,
      nameHindi: tName,
      designation: tDesig,
      subject: 'General',
      employeeId: `RJPA2026${Math.floor(Math.random() * 9000 + 1000)}`,
      payLevel: tPayLevel,
      currentBasicPay: Number(tBasic) || 45000,
      cellNo: 1,
      incrementMonth: 'July',
      phone: tPhone
    };
    const updated = [...localTeachers, newT];
    setLocalTeachers(updated);
    if (onUpdateTeachers) onUpdateTeachers(updated);
    setTName('');
  };

  const handleDeleteTeacherInline = (id: string) => {
    const updated = localTeachers.filter(t => t.id !== id);
    setLocalTeachers(updated);
    if (onUpdateTeachers) onUpdateTeachers(updated);
  };

  const handleSubmitFinal = () => {
    const nowStr = new Date().toLocaleString('en-IN');
    localStorage.setItem('shala_last_sync_time', nowStr);
    setLastSyncTime(nowStr);
    const updatedProfile = { ...formData, hiddenModules };
    storage.setHiddenModules(hiddenModules);
    storage.setAdminPinEnabled(adminPinEnabled);
    if (adminPinValue && adminPinValue.length === 4) {
      storage.setAdminPin(adminPinValue);
    }
    onSave(updatedProfile);
    if (onUpdateTeachers) onUpdateTeachers(localTeachers);
    onClose();
  };

  const handleExportAllData = () => {
    const backupObj: Record<string, any> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('shala_')) {
        try {
          backupObj[key] = JSON.parse(localStorage.getItem(key) || 'null');
        } catch {
          backupObj[key] = localStorage.getItem(key);
        }
      }
    }
    const jsonStr = JSON.stringify(backupObj, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `shala_sahayak_full_backup_${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (typeof parsed === 'object' && parsed !== null) {
            Object.keys(parsed).forEach(k => {
              if (k.startsWith('shala_')) {
                localStorage.setItem(k, JSON.stringify(parsed[k]));
              }
            });
            const nowStr = new Date().toLocaleString('en-IN');
            localStorage.setItem('shala_last_sync_time', nowStr);
            setLastSyncTime(nowStr);
            setImportStatus(lang === 'hi' ? 'डेटा रीस्टोर हो गया! रिफ्रेश हो रहा है...' : 'Data restored! Reloading...');
            setTimeout(() => window.location.reload(), 1500);
          }
        } catch {
          setImportStatus('Invalid JSON File Format');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleClearCache = () => {
    if (window.confirm(lang === 'hi' ? 'क्या आप सारा लोकल डेटा रीसेट करना चाहते हैं?' : 'Reset all local cache?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-emerald-500/20 flex flex-col">
        
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-emerald-900 text-white rounded-t-3xl flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="font-bold text-base">विद्यालय सेटअप एवं सेटिंग्स</h2>
              <p className="text-[10px] text-emerald-200">
                {step === 1 && 'Step 1: Add School Details'}
                {step === 2 && 'Step 2: Add Teacher Details'}
                {step === 3 && 'Step 3: Hide / Show Dashboard Modules'}
                {step === 4 && 'Step 4: Save & Import/Export Data'}
              </p>
            </div>
          </div>

          {/* Auto-Save Status Badge */}
          <div className="ml-auto mr-3 flex items-center space-x-1.5 text-[10px] font-bold bg-emerald-950/60 px-2.5 py-1 rounded-xl border border-emerald-800/80 shrink-0">
            <span className={`w-1.5 h-1.5 rounded-full ${autoSaveStatus === 'saving' ? 'bg-amber-400 animate-pulse' : autoSaveStatus === 'saved' ? 'bg-green-400' : 'bg-slate-400'}`} />
            <span className="text-emerald-100">
              {autoSaveStatus === 'saving' && (lang === 'hi' ? 'ऑटो-सेविंग...' : 'Auto-saving...')}
              {autoSaveStatus === 'saved' && (lang === 'hi' ? 'सेव्ड' : 'Saved')}
              {autoSaveStatus === 'idle' && (lang === 'hi' ? 'सिंक' : 'Synced')}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-emerald-200 hover:text-white hover:bg-emerald-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4 Step Wizard Navigation Tabs */}
        <div className="grid grid-cols-4 bg-slate-100 dark:bg-slate-800/60 p-1 border-b border-slate-200 dark:border-slate-800 text-[11px] font-extrabold text-center shrink-0">
          <button
            onClick={() => setStep(1)}
            className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1 ${
              step === 1 ? 'bg-emerald-800 text-amber-300 shadow-sm' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">1. School</span>
            <span className="sm:hidden">1</span>
          </button>
          <button
            onClick={() => setStep(2)}
            className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1 ${
              step === 2 ? 'bg-emerald-800 text-amber-300 shadow-sm' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">2. Staff</span>
            <span className="sm:hidden">2</span>
          </button>
          <button
            onClick={() => setStep(3)}
            className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1 ${
              step === 3 ? 'bg-emerald-800 text-amber-300 shadow-sm' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">3. Modules</span>
            <span className="sm:hidden">3</span>
          </button>
          <button
            onClick={() => setStep(4)}
            className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1 ${
              step === 4 ? 'bg-emerald-800 text-amber-300 shadow-sm' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">4. Backup</span>
            <span className="sm:hidden">4</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 space-y-3 text-xs flex-1">
          
          {/* STEP 1: SCHOOL DETAILS */}
          {step === 1 && (
            <div className="space-y-3 animate-fadeIn">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  School Name (English)
                </label>
                <input
                  type="text"
                  required
                  value={formData.schoolName}
                  onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  विद्यालय नाम (हिंदी)
                </label>
                <input
                  type="text"
                  required
                  value={formData.schoolNameHindi}
                  onChange={(e) => setFormData({ ...formData, schoolNameHindi: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {t('principalName', lang)}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.principalName}
                    onChange={(e) => setFormData({ ...formData, principalName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Designation (पद)
                  </label>
                  <input
                    type="text"
                    value={formData.principalDesignation}
                    onChange={(e) => setFormData({ ...formData, principalDesignation: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    UDISE Code
                  </label>
                  <input
                    type="text"
                    maxLength={11}
                    required
                    value={formData.udiseCode}
                    onChange={(e) => setFormData({ ...formData, udiseCode: e.target.value })}
                    className="w-full px-2 py-2 text-xs font-mono rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    NIC Code
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nicCode}
                    onChange={(e) => setFormData({ ...formData, nicCode: e.target.value })}
                    className="w-full px-2 py-2 text-xs font-mono rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    DDO Code
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.ddoCode}
                    onChange={(e) => setFormData({ ...formData, ddoCode: e.target.value })}
                    className="w-full px-2 py-2 text-xs font-mono rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    District (जिला)
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Block (ब्लॉक)
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.block}
                    onChange={(e) => setFormData({ ...formData, block: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: TEACHER DETAILS */}
          {step === 2 && (
            <div className="space-y-3 animate-fadeIn">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
                <h4 className="font-extrabold text-slate-800 dark:text-slate-100 flex items-center justify-between">
                  <span>नया शिक्षक / कार्मिक जोड़ें</span>
                  <Users className="w-4 h-4 text-emerald-600" />
                </h4>
                
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="शिक्षक नाम (हिंदी/Eng)"
                    value={tName}
                    onChange={(e) => setTName(e.target.value)}
                    className="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none"
                  />
                  <select
                    value={tDesig}
                    onChange={(e) => setTDesig(e.target.value)}
                    className="px-2 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none font-medium"
                  >
                    <option value="Lecturer">Lecturer (प्राध्यापक)</option>
                    <option value="Senior Teacher">Senior Teacher (वरिष्ठ अध्यापक)</option>
                    <option value="Teacher Gr-III">Teacher Gr-III (अध्यापक)</option>
                    <option value="Librarian">Librarian (पुस्तकालय अध्यक्ष)</option>
                    <option value="Computer Instructor">Computer Instructor (कंप्यूटर अनुदेशक)</option>
                    <option value="PET">PET (शारीरिक शिक्षक)</option>
                  </select>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <select
                    value={tPayLevel}
                    onChange={(e) => setTPayLevel(e.target.value)}
                    className="px-2 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none font-medium"
                  >
                    <option value="L-12">L-12 (Lecturer)</option>
                    <option value="L-11">L-11 (Sr Teacher)</option>
                    <option value="L-10">L-10 (Teacher Gr-3)</option>
                  </select>

                  <input
                    type="number"
                    placeholder="मूल वेतन (Basic)"
                    value={tBasic}
                    onChange={(e) => setTBasic(e.target.value)}
                    className="px-2 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none font-mono"
                  />

                  <input
                    type="text"
                    placeholder="मोबाइल न."
                    value={tPhone}
                    onChange={(e) => setTPhone(e.target.value)}
                    className="px-2 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none font-mono"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleAddTeacherInline}
                  className="w-full py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold flex items-center justify-center gap-1 shadow-sm active:scale-95"
                >
                  <Plus className="w-4 h-4 text-amber-300" />
                  <span>शिक्षक सूची में जोड़ें</span>
                </button>
              </div>

              {/* Current Teacher List */}
              <div className="space-y-1.5">
                <h4 className="font-bold text-slate-700 dark:text-slate-300">
                  वर्तमान स्टाफ सूची ({localTeachers.length}):
                </h4>
                <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
                  {localTeachers.map((tItem) => (
                    <div
                      key={tItem.id}
                      className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between"
                    >
                      <div>
                        <p className="font-extrabold text-slate-800 dark:text-slate-100">
                          {tItem.nameHindi || tItem.name}
                        </p>
                        <p className="text-[10px] text-slate-500">
                          {tItem.designation} • {tItem.payLevel} • Basic: ₹{tItem.currentBasicPay}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteTeacherInline(tItem.id)}
                        className="p-1 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: HIDE / SHOW DASHBOARD MODULES */}
          {step === 3 && (
            <div className="space-y-3 animate-fadeIn">
              <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-amber-900 dark:text-amber-200 flex items-center gap-1.5 text-xs">
                    <Sliders className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <span>मॉड्यूल दृश्यता (Hide / Show Modules)</span>
                  </h4>
                  <p className="text-[10px] text-amber-800/80 dark:text-amber-300/80">
                    जिन ऐप्स या टूल्स का उपयोग नहीं करते, उन्हें डैशबोर्ड से permanently छुपाएं।
                  </p>
                </div>
                {hiddenModules.length > 0 && (
                  <button
                    type="button"
                    onClick={handleShowAllModules}
                    className="px-2.5 py-1 rounded-xl bg-amber-200 dark:bg-amber-900/80 hover:bg-amber-300 dark:hover:bg-amber-800 text-amber-950 dark:text-amber-100 font-bold text-[10px] flex items-center gap-1 shrink-0"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>सभी दिखाएं</span>
                  </button>
                )}
              </div>

              <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 flex items-center justify-between px-1">
                <span>कुल {ALL_MODULES_LIST.length} में से {ALL_MODULES_LIST.length - hiddenModules.length} दृश्यमान हैं</span>
                {hiddenModules.length > 0 && (
                  <span className="text-rose-600 dark:text-rose-400 font-extrabold">({hiddenModules.length} छिपे हुए)</span>
                )}
              </div>

              <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
                {ALL_MODULES_LIST.map((mod) => {
                  const isHidden = hiddenModules.includes(mod.id);
                  return (
                    <div
                      key={mod.id}
                      className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-2 ${
                        isHidden
                          ? 'bg-slate-100 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-60'
                          : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 shadow-xs'
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`font-extrabold text-xs ${isHidden ? 'line-through text-slate-500' : 'text-slate-800 dark:text-slate-100'}`}>
                            {lang === 'hi' ? mod.nameHi : mod.nameEn}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                          {mod.descHi}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => toggleModuleVisibility(mod.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
                          isHidden
                            ? 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300'
                            : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700 hover:bg-emerald-200'
                        }`}
                      >
                        {isHidden ? (
                          <>
                            <EyeOff className="w-3.5 h-3.5 text-slate-500" />
                            <span>छिपा हुआ</span>
                          </>
                        ) : (
                          <>
                            <Eye className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                            <span>दृश्यमान</span>
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Admin PIN Security Config Card */}
              <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <KeyRound className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <div>
                      <h4 className="font-extrabold text-xs text-amber-950 dark:text-amber-200">
                        प्रशासनिक सुरक्षा पिन (Admin PIN Lock)
                      </h4>
                      <p className="text-[10px] text-amber-800/80 dark:text-amber-300/80">
                        वेतन, एसीपी कैलकुलेटर व गोपनीय प्रशासनिक आदेशों पर 4-अंकों का लॉक लगाएं।
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAdminPinEnabledState(!adminPinEnabled)}
                    className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${
                      adminPinEnabled ? 'bg-emerald-600 justify-end' : 'bg-slate-300 dark:bg-slate-700 justify-start'
                    }`}
                  >
                    <span className="w-4 h-4 rounded-full bg-white shadow-xs" />
                  </button>
                </div>

                {adminPinEnabled && (
                  <div className="flex items-center gap-3 pt-1 border-t border-amber-200/60 dark:border-amber-800/60 text-xs">
                    <label className="font-bold text-amber-900 dark:text-amber-200 text-[11px] shrink-0">
                      4-अंकों का पिन सेट करें:
                    </label>
                    <input
                      type="text"
                      maxLength={4}
                      value={adminPinValue}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '');
                        setAdminPinValue(val);
                      }}
                      placeholder="1234"
                      className="w-24 px-3 py-1 rounded-xl border border-amber-300 dark:border-amber-700 bg-white dark:bg-slate-900 text-amber-950 dark:text-amber-100 font-mono font-bold text-center text-xs"
                    />
                    <span className="text-[10px] text-amber-700 dark:text-amber-400">
                      (डिफ़ॉल्ट पिन 1234 है)
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 4: SAVE, IMPORT & EXPORT DATA */}
          {step === 4 && (
            <div className="space-y-3 animate-fadeIn">
              <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1.5 text-emerald-800 dark:text-emerald-300 font-extrabold">
                    <Database className="w-4 h-4" />
                    <span>डेटा सिंक व बैकअप स्थिति</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>Active</span>
                  </span>
                </div>

                <p className="text-slate-600 dark:text-slate-300 text-[11px]">
                  अंतिम सफल बैकअप समय: <strong>{lastSyncTime}</strong>
                </p>

                {importStatus && (
                  <p className="text-[11px] font-bold text-amber-700 dark:text-amber-400">
                    {importStatus}
                  </p>
                )}

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleExportAllData}
                    className="px-3 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-[11px] flex items-center justify-center space-x-1 shadow-sm active:scale-95"
                  >
                    <Download className="w-3.5 h-3.5 text-amber-300" />
                    <span>Export Data (JSON)</span>
                  </button>

                  <label className="px-3 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 font-extrabold text-[11px] flex items-center justify-center space-x-1 cursor-pointer active:scale-95">
                    <Upload className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Import Data (JSON)</span>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportJson}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 flex items-center justify-between text-xs">
                <div>
                  <h5 className="font-bold text-rose-900 dark:text-rose-200">रीसेट / क्लियर कैशे</h5>
                  <p className="text-[10px] text-rose-700 dark:text-rose-400">सभी लोकल डेटा साफ करके नए सिरे से शुरू करें</p>
                </div>
                <button
                  type="button"
                  onClick={handleClearCache}
                  className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px] flex items-center gap-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reset Cache</span>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Wizard Controls */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0 bg-slate-50 dark:bg-slate-900 rounded-b-3xl">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((prev) => (prev - 1) as any)}
              className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 font-bold text-xs flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>पिछला (Previous)</span>
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={() => setStep((prev) => (prev + 1) as any)}
              className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1 shadow-md"
            >
              <span>अगला (Next Step)</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmitFinal}
              className="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-amber-300 font-black text-xs flex items-center gap-1.5 shadow-lg active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>सेव करें एवं समाप्त करें (Save All)</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
