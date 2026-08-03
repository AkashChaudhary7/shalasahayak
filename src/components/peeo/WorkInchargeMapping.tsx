import React, { useState, useEffect } from 'react';
import { SchoolProfile, Teacher, InchargeAssignment, Language } from '../../types';
import { generateWorkInchargeOfficialOrderPdf } from '../../utils/pdfGenerator';
import {
  Users,
  Plus,
  Trash2,
  Printer,
  Download,
  FileCheck,
  Save,
  Briefcase,
  FileText,
  Globe,
  Check,
  Edit3
} from 'lucide-react';

interface WorkInchargeMappingProps {
  schoolProfile: SchoolProfile;
  teachers: Teacher[];
  incharges: InchargeAssignment[];
  onUpdateIncharges: (incharges: InchargeAssignment[]) => void;
  lang: Language;
}

// 4 Primary Required Institutional Roles
const REQUIRED_PRIMARY_ROLES = [
  {
    id: 'inc-exam',
    chargeNameHindi: 'परीक्षा प्रभारी',
    chargeName: 'Exam Incharge',
    category: 'Academics'
  },
  {
    id: 'inc-elc',
    chargeNameHindi: 'ईएलसी प्रभारी - इलेक्शन साक्षरता क्लब',
    chargeName: 'ELC Incharge - Election Literacy Club',
    category: 'Awareness'
  },
  {
    id: 'inc-scholarship',
    chargeNameHindi: 'छात्रवृत्ति प्रभारी',
    chargeName: 'Scholarship Incharge',
    category: 'Welfare'
  },
  {
    id: 'inc-mdm',
    chargeNameHindi: 'मध्याह्न भोजन प्रभारी - एमडीएम',
    chargeName: 'MDM Incharge - Mid Day Meal',
    category: 'Welfare'
  }
];

export const WorkInchargeMapping: React.FC<WorkInchargeMappingProps> = ({
  schoolProfile,
  teachers,
  incharges,
  onUpdateIncharges,
  lang
}) => {
  // Strict Module Language State (toggled via header button without dual text mixing)
  const [modLang, setModLang] = useState<Language>(lang);
  useEffect(() => {
    setModLang(lang);
  }, [lang]);

  const isHi = modLang === 'hi';

  const [activeView, setActiveView] = useState<'mapping' | 'order'>('mapping');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Ensure initial state includes the 4 primary institutional roles
  const [localIncharges, setLocalIncharges] = useState<InchargeAssignment[]>(() => {
    let list = [...incharges];

    REQUIRED_PRIMARY_ROLES.forEach(req => {
      const exists = list.some(
        inc =>
          inc.chargeNameHindi?.includes(req.chargeNameHindi) ||
          inc.chargeName?.toLowerCase() === req.chargeName.toLowerCase() ||
          inc.id === req.id
      );
      if (!exists) {
        list.push({
          id: req.id,
          chargeName: req.chargeName,
          chargeNameHindi: req.chargeNameHindi,
          category: req.category,
          assignedTeacherId: '',
          assignedTeacherName: '',
          assignedTeacherDesignation: '',
          handoverDate: '2026-07-01',
          termSession: '2026-27',
          remarks: '',
          orderDate: new Date().toISOString().split('T')[0]
        });
      }
    });

    return list;
  });

  // Keep local incharges synchronized if parent incharges change
  useEffect(() => {
    if (incharges && incharges.length > 0) {
      setLocalIncharges(incharges);
    }
  }, [incharges]);

  // Official Order Meta State
  const [dispatchNo, setDispatchNo] = useState(`Ja.Sa./PEEO/${schoolProfile.nicCode}/Incharge/2026-27/${Math.floor(Math.random() * 800 + 100)}`);
  const [orderDate, setOrderDate] = useState(new Date().toISOString().split('T')[0]);
  const [orderTerm, setOrderTerm] = useState('2026-27');
  const [orderSubject, setOrderSubject] = useState(
    isHi
      ? 'सत्र 2026-27 हेतु विद्यालयी संस्थागत प्रभारों के आवंटन बाबत कार्यालय आदेश।'
      : 'Office order regarding allocation of institutional work incharges for session 2026-27.'
  );

  // Add Custom Role Form State
  const [showAddRole, setShowAddRole] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const [newInchargeId, setNewInchargeId] = useState('');
  const [newAssistantId, setNewAssistantId] = useState('');
  const [newHandoverDate, setNewHandoverDate] = useState('2026-07-01');
  const [newRemarks, setNewRemarks] = useState('');

  // Editing inline Role ID
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null);

  // Helper to trigger feedback toast
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Save Assignments Action
  const handleSaveAssignments = () => {
    onUpdateIncharges(localIncharges);
    showToast(isHi ? 'प्रभार आवंटन सफलतापूर्वक सहेजा गया!' : 'Role assignments saved successfully!');
  };

  // Update a field for a specific incharge role
  const handleUpdateRoleField = (
    id: string,
    field: keyof InchargeAssignment,
    value: string
  ) => {
    const updated = localIncharges.map(inc => {
      if (inc.id !== id) return inc;

      if (field === 'assignedTeacherId') {
        const t = teachers.find(tch => tch.id === value);
        return {
          ...inc,
          assignedTeacherId: value,
          assignedTeacherName: t ? t.name : '',
          assignedTeacherDesignation: t ? t.designation : ''
        };
      }

      if (field === 'assistantTeacherId') {
        const t = teachers.find(tch => tch.id === value);
        return {
          ...inc,
          assistantTeacherId: value,
          assistantTeacherName: t ? t.name : '',
          assistantTeacherDesignation: t ? t.designation : ''
        };
      }

      if (field === 'chargeNameHindi' || field === 'chargeName') {
        return {
          ...inc,
          chargeNameHindi: value,
          chargeName: value
        };
      }

      return { ...inc, [field]: value };
    });

    setLocalIncharges(updated);
  };

  // Delete mapped role
  const handleDeleteRole = (id: string) => {
    if (confirm(isHi ? 'क्या आप इस प्रभार को हटाना चाहते हैं?' : 'Are you sure you want to remove this role?')) {
      const updated = localIncharges.filter(inc => inc.id !== id);
      setLocalIncharges(updated);
      onUpdateIncharges(updated);
    }
  };

  // Add new role
  const handleAddRoleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleName.trim()) return;

    const mainTeacher = teachers.find(t => t.id === newInchargeId);
    const asstTeacher = teachers.find(t => t.id === newAssistantId);

    const newInc: InchargeAssignment = {
      id: `inc-${Date.now()}`,
      chargeName: newRoleName,
      chargeNameHindi: newRoleName,
      category: 'Institutional',
      assignedTeacherId: mainTeacher ? mainTeacher.id : '',
      assignedTeacherName: mainTeacher ? mainTeacher.name : '',
      assignedTeacherDesignation: mainTeacher ? mainTeacher.designation : '',
      assistantTeacherId: asstTeacher ? asstTeacher.id : undefined,
      assistantTeacherName: asstTeacher ? asstTeacher.name : undefined,
      assistantTeacherDesignation: asstTeacher ? asstTeacher.designation : undefined,
      handoverDate: newHandoverDate,
      termSession: orderTerm,
      remarks: newRemarks,
      orderDate: orderDate
    };

    const updated = [...localIncharges, newInc];
    setLocalIncharges(updated);
    onUpdateIncharges(updated);

    setNewRoleName('');
    setNewInchargeId('');
    setNewAssistantId('');
    setNewRemarks('');
    setShowAddRole(false);
    showToast(isHi ? 'नया प्रभार सफलतापूर्वक जोड़ा गया!' : 'New role added successfully!');
  };

  // Download Official PDF
  const handleDownloadPdf = () => {
    generateWorkInchargeOfficialOrderPdf(
      schoolProfile,
      localIncharges,
      {
        dispatchNo,
        date: orderDate,
        term: orderTerm
      },
      modLang
    );
  };

  // Helper to format teacher name strictly according to language
  const getTeacherDisplayName = (tId?: string, fallbackName?: string) => {
    if (!tId) return fallbackName || (isHi ? 'अनावंटित' : 'Unassigned');
    const t = teachers.find(tch => tch.id === tId);
    if (!t) return fallbackName || (isHi ? 'अनावंटित' : 'Unassigned');
    return isHi ? (t.nameHindi || t.name) : t.name;
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">

      {/* TOP HEADER & ULTRA-MINIMALIST QUICK ACTIONS BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
        
        {/* Module Title */}
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/40 text-indigo-700 dark:text-indigo-300">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-slate-100 leading-tight">
              {isHi ? 'संस्थागत कार्य प्रभारी आवंटन' : 'Institutional Work Incharge Allocation'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isHi
                ? 'प्रभारियों एवं सहायकों का मैपिंग प्रबंधन तथा कार्यालय आदेश जनरेटर'
                : 'Manage role assignments and synthesize official work distribution orders'}
            </p>
          </div>
        </div>

        {/* Action Controls Bar */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          
          {/* 1. Language Switcher Button */}
          <button
            onClick={() => setModLang(isHi ? 'en' : 'hi')}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-black flex items-center space-x-1.5 border border-slate-300/80 dark:border-slate-700 transition-all cursor-pointer"
            title={isHi ? 'Switch to English' : 'हिंदी भाषा में बदलें'}
          >
            <Globe className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>{isHi ? 'English' : 'हिंदी'}</span>
          </button>

          {/* 2. Save Assignments Button */}
          <button
            onClick={handleSaveAssignments}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black flex items-center space-x-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Save className="w-3.5 h-3.5 text-amber-300" />
            <span>{isHi ? 'सहेजें' : 'Save'}</span>
          </button>

          {/* 3. Generate Official Order Button */}
          <button
            onClick={() => setActiveView(activeView === 'mapping' ? 'order' : 'mapping')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black flex items-center space-x-1.5 shadow-sm transition-all cursor-pointer ${
              activeView === 'order'
                ? 'bg-slate-800 text-white'
                : 'bg-indigo-800 hover:bg-indigo-900 text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-amber-300" />
            <span>
              {activeView === 'mapping'
                ? (isHi ? 'आदेश बनाएं' : 'Generate Order')
                : (isHi ? 'मैपिंग तालिका देखें' : 'View Mapping Table')}
            </span>
          </button>

        </div>
      </div>

      {/* Toast Feedback Notification */}
      {toastMessage && (
        <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center space-x-2 animate-fadeIn">
          <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* VIEW 1: INTERACTIVE WORK INCHARGE MAPPING TABLE */}
      {activeView === 'mapping' && (
        <div className="space-y-3">
          
          {/* Top Bar for Add Role */}
          <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
            <div className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>
                {isHi
                  ? `कुल संस्थागत प्रभार: ${localIncharges.length}`
                  : `Total Mapped Roles: ${localIncharges.length}`}
              </span>
            </div>

            <button
              onClick={() => setShowAddRole(!showAddRole)}
              className="px-3 py-1.5 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-extrabold flex items-center space-x-1 shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-amber-300" />
              <span>{isHi ? 'नया प्रभार जोड़ें' : 'Add Role'}</span>
            </button>
          </div>

          {/* Inline Form to Add Role */}
          {showAddRole && (
            <form onSubmit={handleAddRoleSubmit} className="p-3.5 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/40 space-y-3 text-xs animate-fadeIn">
              <div className="flex justify-between items-center pb-2 border-b border-indigo-200/60 dark:border-indigo-800/30">
                <h4 className="font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <Plus className="w-4 h-4 text-indigo-600" />
                  <span>{isHi ? 'नया संस्थागत प्रभार जोड़ें' : 'Add New Institutional Role'}</span>
                </h4>
                <button
                  type="button"
                  onClick={() => setShowAddRole(false)}
                  className="text-slate-400 hover:text-slate-600 font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
                
                {/* Role Name */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isHi ? 'प्रभार का नाम *' : 'Role Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={isHi ? 'जैसे: परीक्षा/पुस्तकालय प्रभारी' : 'e.g. Exam Incharge'}
                    value={newRoleName}
                    onChange={e => setNewRoleName(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold"
                  />
                </div>

                {/* Primary Incharge Select */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isHi ? 'मुख्य प्रभारी' : 'Primary Incharge'}
                  </label>
                  <select
                    value={newInchargeId}
                    onChange={e => setNewInchargeId(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold"
                  >
                    <option value="">{isHi ? '-- मुख्य प्रभारी चुनें --' : '-- Select Primary Incharge --'}</option>
                    {teachers.map(t => (
                      <option key={t.id} value={t.id}>
                        {isHi ? (t.nameHindi || t.name) : t.name} ({t.designation})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Assistant Incharge Select */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isHi ? 'सहायक प्रभारी' : 'Assistant Incharge'}
                  </label>
                  <select
                    value={newAssistantId}
                    onChange={e => setNewAssistantId(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold"
                  >
                    <option value="">{isHi ? '-- सहायक प्रभारी चुनें --' : '-- Select Assistant Incharge --'}</option>
                    {teachers.map(t => (
                      <option key={t.id} value={t.id}>
                        {isHi ? (t.nameHindi || t.name) : t.name} ({t.designation})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Handover Date */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isHi ? 'प्रभार ग्रहण तिथि' : 'Handover Date'}
                  </label>
                  <input
                    type="date"
                    value={newHandoverDate}
                    onChange={e => setNewHandoverDate(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono font-semibold"
                  />
                </div>

              </div>

              {/* Remarks */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {isHi ? 'टिप्पणी / विशेष निर्देश' : 'Remarks / Instructions'}
                </label>
                <input
                  type="text"
                  placeholder={isHi ? 'विशेष रिमार्क्स दर्ज करें...' : 'Enter special instructions or remarks...'}
                  value={newRemarks}
                  onChange={e => setNewRemarks(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowAddRole(false)}
                  className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold"
                >
                  {isHi ? 'रद्द करें' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-indigo-700 text-white font-bold flex items-center space-x-1"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isHi ? 'प्रभार सहेजें' : 'Save Role'}</span>
                </button>
              </div>

            </form>
          )}

          {/* Interactive Sleek Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-extrabold border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="p-3 text-center w-12">{isHi ? 'क्र.सं.' : 'S.N.'}</th>
                  <th className="p-3 min-w-[180px]">{isHi ? 'प्रभार का नाम' : 'Role Name'}</th>
                  <th className="p-3 min-w-[200px]">{isHi ? 'मुख्य प्रभारी' : 'Primary Incharge'}</th>
                  <th className="p-3 min-w-[200px]">{isHi ? 'सहायक प्रभारी' : 'Assistant Incharge'}</th>
                  <th className="p-3 text-center min-w-[130px]">{isHi ? 'प्रभार ग्रहण तिथि' : 'Handover Date'}</th>
                  <th className="p-3 min-w-[160px]">{isHi ? 'टिप्पणी' : 'Remarks'}</th>
                  <th className="p-3 text-right w-16">{isHi ? 'कार्य' : 'Actions'}</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200 font-medium">
                {localIncharges.map((inc, idx) => {
                  const displayRoleName = isHi
                    ? (inc.chargeNameHindi || inc.chargeName)
                    : inc.chargeName;

                  return (
                    <tr key={inc.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                      
                      {/* S.N. */}
                      <td className="p-3 text-center font-bold text-slate-500">{idx + 1}</td>

                      {/* Role Name */}
                      <td className="p-3">
                        {editingRoleId === inc.id ? (
                          <div className="flex items-center space-x-1">
                            <input
                              type="text"
                              value={displayRoleName}
                              onChange={e => handleUpdateRoleField(inc.id, isHi ? 'chargeNameHindi' : 'chargeName', e.target.value)}
                              className="w-full px-2 py-1 rounded-lg border border-indigo-400 bg-white dark:bg-slate-900 font-bold text-xs"
                            />
                            <button
                              onClick={() => setEditingRoleId(null)}
                              className="p-1 text-emerald-600 font-bold"
                            >
                              ✓
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-1.5">
                            <span className="font-extrabold text-slate-900 dark:text-slate-100">
                              {displayRoleName}
                            </span>
                            <button
                              onClick={() => setEditingRoleId(inc.id)}
                              className="text-slate-400 hover:text-indigo-600 transition-colors"
                              title={isHi ? 'नाम संपादित करें' : 'Edit role name'}
                            >
                              <Edit3 className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </td>

                      {/* Primary Work Incharge */}
                      <td className="p-3">
                        <select
                          value={inc.assignedTeacherId || ''}
                          onChange={e => handleUpdateRoleField(inc.id, 'assignedTeacherId', e.target.value)}
                          className="w-full px-2 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold text-xs text-slate-800 dark:text-slate-200 cursor-pointer"
                        >
                          <option value="">{isHi ? '-- मुख्य प्रभारी चुनें --' : '-- Select Primary Incharge --'}</option>
                          {teachers.map(t => (
                            <option key={t.id} value={t.id}>
                              {isHi ? (t.nameHindi || t.name) : t.name} ({t.designation})
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Assistant Work Incharge */}
                      <td className="p-3">
                        <select
                          value={inc.assistantTeacherId || ''}
                          onChange={e => handleUpdateRoleField(inc.id, 'assistantTeacherId', e.target.value)}
                          className="w-full px-2 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold text-xs text-slate-800 dark:text-slate-200 cursor-pointer"
                        >
                          <option value="">{isHi ? '-- सहायक प्रभारी चुनें --' : '-- Select Assistant Incharge --'}</option>
                          {teachers.map(t => (
                            <option key={t.id} value={t.id}>
                              {isHi ? (t.nameHindi || t.name) : t.name} ({t.designation})
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Handover Date */}
                      <td className="p-3 text-center">
                        <input
                          type="date"
                          value={inc.handoverDate || '2026-07-01'}
                          onChange={e => handleUpdateRoleField(inc.id, 'handoverDate', e.target.value)}
                          className="px-2 py-1 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-xs text-center font-semibold"
                        />
                      </td>

                      {/* Remarks */}
                      <td className="p-3">
                        <input
                          type="text"
                          placeholder={isHi ? 'विशेष रिमार्क्स...' : 'Remarks...'}
                          value={inc.remarks || ''}
                          onChange={e => handleUpdateRoleField(inc.id, 'remarks', e.target.value)}
                          className="w-full px-2 py-1 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium"
                        />
                      </td>

                      {/* Delete */}
                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleDeleteRole(inc.id)}
                          className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                          title={isHi ? 'प्रभार हटाएं' : 'Delete role'}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* VIEW 2: OFFICIAL WORK DISTRIBUTION ORDER GENERATOR (कार्यालय आदेश) */}
      {activeView === 'order' && (
        <div className="space-y-4">

          {/* Universal Single Top Action Bar */}
          <div className="action-bar-top bg-slate-100 dark:bg-slate-800 p-3 rounded-2xl flex flex-wrap items-center justify-between gap-2 no-print border border-slate-200 dark:border-slate-700">
            {/* 1. Toggle Switcher: Maker vs Preview */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setActiveView('mapping')}
                className="px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-black flex items-center space-x-1.5 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-800 shadow-sm transition-all"
              >
                <span>{isHi ? 'प्रपत्र प्रविष्टि (Maker)' : 'Form Maker'}</span>
              </button>
              <button
                onClick={() => setActiveView('order')}
                className="px-4 py-2 rounded-xl bg-indigo-700 text-white text-xs font-black flex items-center space-x-1.5 shadow-sm transition-all"
              >
                <span>{isHi ? 'पूर्वावलोकन (Preview)' : 'Preview Mode'}</span>
              </button>
            </div>

            {/* 2. Download PDF / Print & 3. Share Image */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={handleDownloadPdf}
                className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-black flex items-center space-x-1.5 shadow-md transition-all cursor-pointer"
                title={isHi ? 'मुद्रित करें / Download PDF' : 'Print / Download PDF'}
              >
                <Printer className="w-4 h-4 text-amber-300" />
                <span>{isHi ? 'मुद्रित करें / Download PDF' : 'Print / Download PDF'}</span>
              </button>
            </div>
          </div>

          {/* Dispatch & Order Settings Bar */}
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
            <h4 className="font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
              <FileCheck className="w-4 h-4 text-indigo-600" />
              <span>{isHi ? 'कार्यालय आदेश क्रमांक व दिनांक' : 'Office Order Dispatch & Date Settings'}</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-0.5">
                  {isHi ? 'क्रमांक (Dispatch No)' : 'Dispatch No'}
                </label>
                <input
                  type="text"
                  value={dispatchNo}
                  onChange={e => setDispatchNo(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-0.5">
                  {isHi ? 'दिनांक (Order Date)' : 'Order Date'}
                </label>
                <input
                  type="date"
                  value={orderDate}
                  onChange={e => setOrderDate(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-0.5">
                  {isHi ? 'सत्र (Session)' : 'Session Term'}
                </label>
                <input
                  type="text"
                  value={orderTerm}
                  onChange={e => setOrderTerm(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-0.5">
                {isHi ? 'विषय (Order Subject)' : 'Order Subject'}
              </label>
              <input
                type="text"
                value={orderSubject}
                onChange={e => setOrderSubject(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-medium"
              />
            </div>
          </div>

          {/* FORMAL GOVERNMENT OFFICE ORDER DRAFT */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-950 border-2 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 space-y-4 shadow-lg print:border-none print:shadow-none">

            {/* Official Header */}
            <div className="text-center border-b-2 border-slate-800 dark:border-slate-200 pb-3 space-y-1">
              <h2 className="text-base sm:text-lg font-black tracking-wide">
                {isHi
                  ? 'कार्यालय पंचायत प्रारंभिक शिक्षा अधिकारी (PEEO) एवं प्रधानाचार्य'
                  : 'OFFICE OF PANCHAYAT ELEMENTARY EDUCATION OFFICER (PEEO) & PRINCIPAL'}
              </h2>
              <h3 className="text-sm font-bold text-indigo-900 dark:text-indigo-300">
                {isHi
                  ? (schoolProfile.schoolNameHindi || schoolProfile.schoolName)
                  : schoolProfile.schoolName} ({schoolProfile.district})
              </h3>
              <p className="text-xs font-mono text-slate-600 dark:text-slate-400">
                {isHi
                  ? `यू-डायस कोड: ${schoolProfile.udiseCode} | एनआइसी कोड: ${schoolProfile.nicCode}`
                  : `UDISE Code: ${schoolProfile.udiseCode} | NIC Code: ${schoolProfile.nicCode}`}
              </p>
            </div>

            {/* Metadata Bar */}
            <div className="flex justify-between text-xs font-mono font-bold pt-1">
              <span>{isHi ? `क्रमांक: ${dispatchNo}` : `Dispatch No: ${dispatchNo}`}</span>
              <span>{isHi ? `दिनांक: ${orderDate}` : `Date: ${orderDate}`}</span>
            </div>

            {/* Title & Subject */}
            <div className="text-center space-y-1.5 pt-1">
              <h4 className="text-sm font-black underline tracking-wider">
                {isHi ? ':: कार्यालय आदेश ::' : ':: OFFICE ORDER ::'}
              </h4>
              <p className="text-xs font-semibold max-w-xl mx-auto">
                <strong>{isHi ? 'विषय:' : 'Subject:'}</strong> {orderSubject}
              </p>
            </div>

            {/* Preamble */}
            <p className="text-xs leading-relaxed text-justify">
              {isHi
                ? `शैक्षणिक सत्र ${orderTerm} में विद्यालय के सुचारू अकादमिक व प्रशासनिक संचालन, सरकारी योजनाओं के पारदर्शी क्रियान्वयन, स्टॉक संधारण एवं विभागीय पोर्टल्स पर समयबद्ध प्रविष्टि हेतु निम्नलिखित अधिकारियों/शिक्षकों को उनके नाम के सम्मुख अंकित संस्थागत प्रभार एवं दायित्व आवंटित किए जाते हैं:`
                : `For the smooth academic and administrative operation of the institution during Session ${orderTerm}, transparent implementation of government schemes, stock maintenance, and timely entry on departmental portals, the following staff members are assigned institutional responsibilities as indicated below:`}
            </p>

            {/* Clean Assignment Table */}
            <div className="overflow-x-auto pt-1">
              <table className="w-full text-left border-collapse text-xs border border-slate-400 dark:border-slate-600">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-bold border-b border-slate-400 dark:border-slate-600">
                    <th className="p-2 border border-slate-300 dark:border-slate-700 text-center w-8">
                      {isHi ? 'क्र.सं.' : 'S.N.'}
                    </th>
                    <th className="p-2 border border-slate-300 dark:border-slate-700">
                      {isHi ? 'प्रभार का नाम' : 'Role Name'}
                    </th>
                    <th className="p-2 border border-slate-300 dark:border-slate-700">
                      {isHi ? 'मुख्य प्रभारी' : 'Primary Incharge'}
                    </th>
                    <th className="p-2 border border-slate-300 dark:border-slate-700">
                      {isHi ? 'सहायक प्रभारी' : 'Assistant Incharge'}
                    </th>
                    <th className="p-2 border border-slate-300 dark:border-slate-700">
                      {isHi ? 'टिप्पणी' : 'Remarks'}
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200 dark:divide-slate-700 font-medium">
                  {localIncharges.map((inc, i) => {
                    const roleName = isHi
                      ? (inc.chargeNameHindi || inc.chargeName)
                      : inc.chargeName;
                    const primaryName = getTeacherDisplayName(inc.assignedTeacherId, inc.assignedTeacherName);
                    const assistantName = inc.assistantTeacherId
                      ? getTeacherDisplayName(inc.assistantTeacherId, inc.assistantTeacherName)
                      : '-';

                    return (
                      <tr key={inc.id} className="hover:bg-slate-50 dark:hover:bg-slate-900">
                        <td className="p-2 border border-slate-300 dark:border-slate-700 text-center font-bold">
                          {i + 1}
                        </td>
                        <td className="p-2 border border-slate-300 dark:border-slate-700 font-bold text-slate-900 dark:text-slate-100">
                          {roleName}
                        </td>
                        <td className="p-2 border border-slate-300 dark:border-slate-700">
                          <div className="font-bold">{primaryName}</div>
                          {inc.assignedTeacherDesignation && (
                            <div className="text-[10px] text-slate-500">{inc.assignedTeacherDesignation}</div>
                          )}
                        </td>
                        <td className="p-2 border border-slate-300 dark:border-slate-700">
                          <div className="font-bold">{assistantName}</div>
                          {inc.assistantTeacherDesignation && assistantName !== '-' && (
                            <div className="text-[10px] text-slate-500">{inc.assistantTeacherDesignation}</div>
                          )}
                        </td>
                        <td className="p-2 border border-slate-300 dark:border-slate-700 text-[11px]">
                          {inc.remarks || (isHi ? 'नियमानुसार रिकॉर्ड व स्टॉक संधारण करेंगे।' : 'Maintain record and stock as per rules.')}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* DUAL OFFICIAL SIGNATURE FOOTER */}
            <div className="flex justify-between items-end pt-10 px-4">
              
              {/* Left Side: Shala Darpan Incharge */}
              <div className="text-center space-y-1">
                <div className="h-10"></div>
                <p className="font-bold text-xs">
                  {isHi ? 'शाला दर्पण प्रभारी' : 'Shala Darpan Incharge'}
                </p>
                <p className="text-[11px] text-slate-500">
                  {isHi ? '(हस्ताक्षर शाला दर्पण प्रभारी)' : '(Signature Shala Darpan Incharge)'}
                </p>
              </div>

              {/* Right Side: PEEO & Principal */}
              <div className="text-center space-y-1">
                <div className="h-10"></div>
                <p className="font-bold text-xs">
                  {isHi ? 'PEEO एवं प्रधानाचार्य' : 'PEEO & Principal'}
                </p>
                <p className="font-bold text-xs">
                  ({schoolProfile.principalName})
                </p>
                <p className="text-[11px] text-slate-500">
                  {isHi
                    ? (schoolProfile.schoolNameHindi || schoolProfile.schoolName)
                    : schoolProfile.schoolName}
                </p>
              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};
