import React, { useState } from 'react';
import { SchoolProfile, Language } from '../../types';
import {
  Printer,
  FileText,
  LogIn,
  LogOut,
  Calendar,
  Award,
  ShieldCheck,
  BookOpen,
  Briefcase,
  UserCheck,
  Sparkles,
  ArrowLeft,
  Check,
  Copy,
  Edit3,
  RefreshCw,
  FileCheck
} from 'lucide-react';

interface InteractiveFormatsModuleProps {
  schoolProfile?: SchoolProfile;
  lang: Language;
  onBack?: () => void;
}

interface FormatItem {
  id: string;
  titleHi: string;
  titleEn: string;
  category: string;
  iconName: string;
  bgTint: string;
  descriptionHi: string;
  descriptionEn: string;
}

export const InteractiveFormatsModule: React.FC<InteractiveFormatsModuleProps> = ({
  schoolProfile,
  lang,
  onBack
}) => {
  const FORMAT_TEMPLATES: FormatItem[] = [
    {
      id: 'karygrahan',
      titleHi: 'कार्यग्रहण प्रपत्र (Joining Report)',
      titleEn: 'Joining Report (Teacher to Principal)',
      category: 'Joining',
      iconName: 'login',
      bgTint: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-200 border-emerald-300',
      descriptionHi: 'स्थानांतरण/पदस्थापन पर प्रधानाचार्य को प्रस्तुत किया जाने वाला कार्यग्रहण प्रपत्र',
      descriptionEn: 'Official joining report submitted by teacher to Principal/PEEO'
    },
    {
      id: 'karymukti',
      titleHi: 'कार्यमुक्ति आवेदन (Relieving Form)',
      titleEn: 'Relieving Application (Teacher to Principal)',
      category: 'Relieving',
      iconName: 'logout',
      bgTint: 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-200 border-rose-300',
      descriptionHi: 'स्थानांतरण/पदोन्नति पर कार्यमुक्त होकर LPC व आदेश प्राप्ति हेतु प्रपत्र',
      descriptionEn: 'Official relieving application submitted by teacher to Principal'
    },
    {
      id: 'leave',
      titleHi: 'आकस्मिक / उपार्जित अवकाश आवेदन',
      titleEn: 'Casual / Earned Leave Application',
      category: 'Leave',
      iconName: 'calendar',
      bgTint: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/80 dark:text-indigo-200 border-indigo-300',
      descriptionHi: 'शिक्षकों हेतु CL, PL, मेडिकल एवं प्रसूति अवकाश प्रपत्र',
      descriptionEn: 'Leave application for Casual, Earned & Medical leaves'
    },
    {
      id: 'duty_mapping',
      titleHi: 'प्रभारी कार्य आवंटन कार्यालय आदेश',
      titleEn: 'Incharge Duty Mapping Office Order',
      category: 'Administration',
      iconName: 'briefcase',
      bgTint: 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-200 border-amber-300',
      descriptionHi: 'MDM, ICT, परीक्षा व छात्रवृत्ति प्रभारियों का कार्यालय आदेश',
      descriptionEn: 'PEEO/Principal office order allocating mandatory school incharges'
    },
    {
      id: 'service_book',
      titleHi: 'सेवा पुस्तिका इन्द्राज प्रारूप',
      titleEn: 'Service Book Entry Format',
      category: 'Service Record',
      iconName: 'book',
      bgTint: 'bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-200 border-blue-300',
      descriptionHi: 'नवीन पदस्थापन/कार्यग्रहण पर सेवा पुस्तिका में दर्ज किया जाने वाला प्रारूप',
      descriptionEn: 'Official Service Book entry endorsement format for DDO'
    },
    {
      id: 'satyapan',
      titleHi: 'भौतिक सत्यापन प्रमाण पत्र',
      titleEn: 'Annual Physical Verification Certificate',
      category: 'Verification',
      iconName: 'shield',
      bgTint: 'bg-teal-100 text-teal-800 dark:bg-teal-950/80 dark:text-teal-200 border-teal-300',
      descriptionHi: 'विद्यालय स्टॉक, फर्नीचर, लाइब्रेरी व ICT भौतिक सत्यापन रिपोर्ट',
      descriptionEn: 'Annual verification report for school assets & ICT lab'
    },
    {
      id: 'no_dues',
      titleHi: 'अनापत्ति व अदेयता प्रमाण पत्र (No Dues)',
      titleEn: 'No Dues Clearance Certificate',
      category: 'Clearance',
      iconName: 'check',
      bgTint: 'bg-purple-100 text-purple-800 dark:bg-purple-950/80 dark:text-purple-200 border-purple-300',
      descriptionHi: 'स्थानांतरण/कार्यमुक्ति के समय लाइब्रेरी, स्टॉक व कैश नो-ड्यूज प्रमाण पत्र',
      descriptionEn: 'No Dues clearance certificate from all school incharges'
    },
    {
      id: 'character',
      titleHi: 'चरित्र व कार्य आचरण प्रमाण पत्र',
      titleEn: 'Character & Service Conduct Certificate',
      category: 'Certificate',
      iconName: 'award',
      bgTint: 'bg-sky-100 text-sky-800 dark:bg-sky-950/80 dark:text-sky-200 border-sky-300',
      descriptionHi: 'शिक्षकों/शिक्षार्थियों हेतु संस्था प्रधान द्वारा जारी आचरण प्रमाण पत्र',
      descriptionEn: 'Official character & conduct certificate issued by Headmaster'
    }
  ];

  const [selectedFormatId, setSelectedFormatId] = useState<string>('karygrahan');

  // Common Form Fields
  const [formData, setFormData] = useState({
    schoolName: schoolProfile?.schoolName || 'राजकीय उच्च माध्यमिक विद्यालय, सांगानेर',
    schoolNameHindi: schoolProfile?.schoolNameHindi || 'राजकीय उच्च माध्यमिक विद्यालय',
    district: schoolProfile?.district || 'जयपुर',
    teacherName: 'रमेश कुमार शर्मा',
    designation: 'वरिष्ठ अध्यापक (गणित)',
    employeeId: 'RJJP20181200456',
    payLevel: 'L-11',
    phone: '9829012345',
    orderNo: 'प्रशा/स्थानांतरण/2026/4521',
    orderDate: '2026-07-28',
    actionDate: new Date().toISOString().split('T')[0],
    sessionTime: 'FN' as 'FN' | 'AN', // Forenoon or Afternoon
    prevSchoolName: 'रा.उ.मा.वि. चाकसू (जयपुर)',
    nextSchoolName: 'रा.उ.मा.वि. सांगानेर (जयपुर)',
    reasonSubject: 'स्थानांतरण आदेशानुसार कार्यग्रहण हेतु रिपोर्ट',
    leaveType: 'आकस्मिक अवकाश (Casual Leave)',
    leaveFrom: new Date().toISOString().split('T')[0],
    leaveTo: new Date().toISOString().split('T')[0],
    leaveDays: '1',
    substituteTeacher: 'श्री/श्रीमती सुरेश कुमार (वरिष्ठ अध्यापक)',
    dispatchNo: '1042',
    dispatchDate: new Date().toISOString().split('T')[0],
    mdmIncharge: 'श्री मोहन लाल शर्मा (वरिष्ठ अध्यापक)',
    ictIncharge: 'श्रीमती अनीता मीना (कंप्यूटर अनुदेशक)',
    examIncharge: 'श्री राजेश वर्मा (व्याख्याता)',
    scholarshipIncharge: 'श्रीमती सुनीता यादव (अध्यापक L-2)',
    verificationMembers: '1. श्री रामेश्वर लाल (अध्यक्ष), 2. श्रीमती सीमा शर्मा (सदस्य)'
  });

  const handleFieldChange = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const currentTemplate = FORMAT_TEMPLATES.find(f => f.id === selectedFormatId) || FORMAT_TEMPLATES[0];

  // Print function
  const handlePrintDocument = () => {
    const printWin = window.open('', '_blank');
    if (!printWin) {
      window.print();
      return;
    }

    const docContent = document.getElementById('printable-official-format')?.innerHTML || '';

    printWin.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${currentTemplate.titleHi}</title>
          <style>
            @page { size: A4 portrait; margin: 15mm; }
            body { font-family: 'Segoe UI', 'Noto Sans Devanagari', Arial, sans-serif; padding: 20px; color: #0f172a; line-height: 1.6; background: #fff; }
            .official-border { border: 2px solid #1e293b; padding: 30px; border-radius: 8px; max-width: 800px; margin: 0 auto; box-shadow: none; }
            .header-title { text-align: center; font-size: 20px; font-weight: 800; color: #047857; margin-bottom: 4px; text-transform: uppercase; }
            .header-sub { text-align: center; font-size: 13px; font-weight: 600; color: #475569; border-bottom: 2px double #cbd5e1; padding-bottom: 12px; margin-bottom: 20px; }
            .ref-row { display: flex; justify-content: space-between; font-size: 13px; font-weight: 700; margin-bottom: 20px; }
            .subject-box { background: #f8fafc; border-left: 4px solid #047857; padding: 10px 15px; font-weight: 700; font-size: 14px; margin-bottom: 20px; border-top: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0; }
            .body-text { font-size: 14px; text-align: justify; white-space: pre-wrap; margin-bottom: 30px; line-height: 1.8; }
            .signature-grid { display: flex; justify-content: space-between; align-items: flex-end; margin-top: 50px; font-size: 13px; }
            .sig-block { text-align: center; width: 45%; }
            .stamp-box { border: 1px dashed #94a3b8; height: 70px; width: 140px; margin: 10px auto 5px; display: flex; align-items: center; justify-content: center; font-size: 10px; color: #94a3b8; }
            .footer-line { border-top: 1px solid #e2e8f0; margin-top: 30px; padding-top: 10px; font-size: 11px; text-align: center; color: #64748b; }
          </style>
        </head>
        <body>
          <div class="official-border">
            ${docContent}
          </div>
          <script>window.onload = function() { window.print(); }</script>
        </body>
      </html>
    `);
    printWin.document.close();
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-6 shadow-xl border border-slate-200 dark:border-slate-800 space-y-6">
      
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-slate-100 leading-tight">
              {lang === 'hi' ? 'राजस्थान शासकीय प्रपत्र एवं आवेदन जनरेटर' : 'Official Departmental Formats Hub'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {lang === 'hi'
                ? 'शिक्षकों व प्रधानाचार्य हेतु कार्यग्रहण, कार्यमुक्ति, अवकाश व विभागीय प्रारूपों का सीधा निर्माण एवं प्रिंट'
                : 'Create and directly print official joining, relieving, leave & administrative forms'}
            </p>
          </div>
        </div>

        {onBack && (
          <button
            onClick={onBack}
            className="p-1.5 rounded-xl bg-slate-50 hover:bg-emerald-50 dark:bg-slate-800 dark:hover:bg-emerald-950/30 text-slate-500 hover:text-emerald-700 dark:text-slate-400 dark:hover:text-emerald-400 border border-slate-200 dark:border-slate-800 transition-all cursor-pointer active:scale-95 flex items-center gap-1.5 text-xs font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">{lang === 'hi' ? 'मुख्य पृष्ठ' : 'Back'}</span>
          </button>
        )}
      </div>

      {/* 1. Icon Cards Grid for Formats */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>{lang === 'hi' ? 'प्रारूप (Format) का चयन करें:' : 'Select Format Template:'}</span>
        </label>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {FORMAT_TEMPLATES.map(fmt => {
            const isSelected = selectedFormatId === fmt.id;
            return (
              <button
                key={fmt.id}
                onClick={() => setSelectedFormatId(fmt.id)}
                className={`p-3.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between relative overflow-hidden group active:scale-98 ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-800 shadow-lg ring-2 ring-emerald-500/40'
                    : 'bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 rounded-xl font-bold border text-xs ${fmt.bgTint}`}>
                    {fmt.id === 'karygrahan' && <LogIn className="w-4 h-4" />}
                    {fmt.id === 'karymukti' && <LogOut className="w-4 h-4" />}
                    {fmt.id === 'leave' && <Calendar className="w-4 h-4" />}
                    {fmt.id === 'duty_mapping' && <Briefcase className="w-4 h-4" />}
                    {fmt.id === 'service_book' && <BookOpen className="w-4 h-4" />}
                    {fmt.id === 'satyapan' && <ShieldCheck className="w-4 h-4" />}
                    {fmt.id === 'no_dues' && <FileCheck className="w-4 h-4" />}
                    {fmt.id === 'character' && <Award className="w-4 h-4" />}
                  </div>
                  {isSelected && (
                    <span className="p-1 rounded-full bg-emerald-500 text-white">
                      <Check className="w-3 h-3" />
                    </span>
                  )}
                </div>

                <div>
                  <h4 className="font-extrabold text-xs leading-snug line-clamp-2">
                    {lang === 'hi' ? fmt.titleHi : fmt.titleEn}
                  </h4>
                  <p className={`text-[10px] mt-1 line-clamp-1 ${
                    isSelected ? 'text-slate-300' : 'text-slate-500 dark:text-slate-400'
                  }`}>
                    {lang === 'hi' ? fmt.descriptionHi : fmt.descriptionEn}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Form Creator & Paper Document Live View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
        
        {/* Left Column: Form Controls (5 Cols) */}
        <div className="lg:col-span-5 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b pb-2.5 border-slate-200 dark:border-slate-700">
            <span className="text-xs font-black text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Edit3 className="w-4 h-4 text-emerald-600" />
              <span>{lang === 'hi' ? 'विवरण अनुकूलित करें (Edit Form Fields)' : 'Edit Form Details'}</span>
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              {currentTemplate.category}
            </span>
          </div>

          <div className="space-y-3 text-xs max-h-[580px] overflow-y-auto pr-1">
            {/* School Name */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                {lang === 'hi' ? 'विद्यालय का नाम (School Name)' : 'School Name'}
              </label>
              <input
                type="text"
                value={formData.schoolName}
                onChange={e => handleFieldChange('schoolName', e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            {/* Teacher Name & Designation */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {lang === 'hi' ? 'शिक्षक/कार्मिक नाम' : 'Teacher Name'}
                </label>
                <input
                  type="text"
                  value={formData.teacherName}
                  onChange={e => handleFieldChange('teacherName', e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {lang === 'hi' ? 'पद व विषय (Designation)' : 'Designation'}
                </label>
                <input
                  type="text"
                  value={formData.designation}
                  onChange={e => handleFieldChange('designation', e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Employee ID & Pay Level */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {lang === 'hi' ? 'कर्मचारी आईडी (NIC ID)' : 'Employee ID'}
                </label>
                <input
                  type="text"
                  value={formData.employeeId}
                  onChange={e => handleFieldChange('employeeId', e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {lang === 'hi' ? 'पे लेवल (Pay Level)' : 'Pay Level'}
                </label>
                <input
                  type="text"
                  value={formData.payLevel}
                  onChange={e => handleFieldChange('payLevel', e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Order No & Date */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {lang === 'hi' ? 'आदेश क्रमांक (Order No)' : 'Order No'}
                </label>
                <input
                  type="text"
                  value={formData.orderNo}
                  onChange={e => handleFieldChange('orderNo', e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {lang === 'hi' ? 'आदेश दिनांक' : 'Order Date'}
                </label>
                <input
                  type="date"
                  value={formData.orderDate}
                  onChange={e => handleFieldChange('orderDate', e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Conditional Fields based on Format */}
            {(selectedFormatId === 'karygrahan' || selectedFormatId === 'karymukti') && (
              <>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {lang === 'hi' ? 'पूर्व विद्यालय का नाम' : 'Previous School Name'}
                  </label>
                  <input
                    type="text"
                    value={formData.prevSchoolName}
                    onChange={e => handleFieldChange('prevSchoolName', e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {lang === 'hi' ? 'प्रभावी तिथि (Action Date)' : 'Action Date'}
                    </label>
                    <input
                      type="date"
                      value={formData.actionDate}
                      onChange={e => handleFieldChange('actionDate', e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {lang === 'hi' ? 'समय (FN/AN)' : 'Session (FN/AN)'}
                    </label>
                    <select
                      value={formData.sessionTime}
                      onChange={e => handleFieldChange('sessionTime', e.target.value as 'FN' | 'AN')}
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    >
                      <option value="FN">पूर्वाह्न (Forenoon)</option>
                      <option value="AN">अपराह्न (Afternoon)</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            {selectedFormatId === 'leave' && (
              <>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {lang === 'hi' ? 'अवकाश का प्रकार' : 'Leave Type'}
                  </label>
                  <select
                    value={formData.leaveType}
                    onChange={e => handleFieldChange('leaveType', e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="आकस्मिक अवकाश (Casual Leave - CL)">आकस्मिक अवकाश (Casual Leave - CL)</option>
                    <option value="उपार्जित अवकाश (Earned Leave - PL)">उपार्जित अवकाश (Earned Leave - PL)</option>
                    <option value="चिकित्सीय अवकाश (Medical Leave)">चिकित्सीय अवकाश (Medical Leave)</option>
                    <option value="प्रसूति / पितृत्व अवकाश (Maternity/Paternity Leave)">प्रसूति / पितृत्व अवकाश</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {lang === 'hi' ? 'अवकाश प्रारम्भ तिथि' : 'Leave From'}
                    </label>
                    <input
                      type="date"
                      value={formData.leaveFrom}
                      onChange={e => handleFieldChange('leaveFrom', e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {lang === 'hi' ? 'अवकाश समाप्ति तिथि' : 'Leave To'}
                    </label>
                    <input
                      type="date"
                      value={formData.leaveTo}
                      onChange={e => handleFieldChange('leaveTo', e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {lang === 'hi' ? 'कक्षा प्रभार संभालने वाले शिक्षक' : 'Substitute Teacher'}
                  </label>
                  <input
                    type="text"
                    value={formData.substituteTeacher}
                    onChange={e => handleFieldChange('substituteTeacher', e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
                  />
                </div>
              </>
            )}

            {selectedFormatId === 'duty_mapping' && (
              <>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {lang === 'hi' ? 'मिड-डे मील (MDM) प्रभारी' : 'MDM Incharge'}
                  </label>
                  <input
                    type="text"
                    value={formData.mdmIncharge}
                    onChange={e => handleFieldChange('mdmIncharge', e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {lang === 'hi' ? 'आईसीटी/कंप्यूटर लैब प्रभारी' : 'ICT Incharge'}
                  </label>
                  <input
                    type="text"
                    value={formData.ictIncharge}
                    onChange={e => handleFieldChange('ictIncharge', e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {lang === 'hi' ? 'परीक्षा (Exam) प्रभारी' : 'Exam Incharge'}
                  </label>
                  <input
                    type="text"
                    value={formData.examIncharge}
                    onChange={e => handleFieldChange('examIncharge', e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
                  />
                </div>
              </>
            )}

            {/* Mobile & District */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {lang === 'hi' ? 'मोबाइल नंबर' : 'Phone'}
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={e => handleFieldChange('phone', e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {lang === 'hi' ? 'जिला (District)' : 'District'}
                </label>
                <input
                  type="text"
                  value={formData.district}
                  onChange={e => handleFieldChange('district', e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Printable Document Paper Preview (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Printer className="w-4 h-4 text-emerald-600" />
              <span>{lang === 'hi' ? 'शासकीय प्रपत्र पत्र-पत्रिका पूर्वावलोकन (A4 Print Ready)' : 'Official Document Paper Preview'}</span>
            </span>
            <button
              onClick={handlePrintDocument}
              className="py-2 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4 text-amber-300" />
              <span>{lang === 'hi' ? 'प्रपत्र प्रिंट करें' : 'Print Format'}</span>
            </button>
          </div>

          {/* Printable Official Paper Box */}
          <div
            id="printable-official-format"
            className="p-6 sm:p-8 bg-white text-slate-900 rounded-2xl shadow-xl border-2 border-slate-800 space-y-5 text-xs font-serif leading-relaxed"
          >
            {/* 1. KARYGRAHAN (Joining Report) */}
            {selectedFormatId === 'karygrahan' && (
              <>
                <div className="text-center space-y-1 border-b-2 border-slate-800 pb-3">
                  <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                    {formData.schoolName}
                  </h3>
                  <p className="text-[11px] font-sans text-slate-600">
                    जिला: {formData.district} (राजस्थान) • विद्यालय शाला दर्पण कोड: {schoolProfile?.nicCode || '218001'}
                  </p>
                </div>

                <div className="space-y-1 font-sans">
                  <p className="font-bold">सेवा में,</p>
                  <p className="font-semibold">श्रीमान प्रधानाचार्य / संस्था प्रधान / पीईईओ,</p>
                  <p className="font-semibold">{formData.schoolName}, जिला {formData.district}</p>
                </div>

                <div className="p-2.5 bg-slate-100 border-l-4 border-slate-800 font-bold font-sans">
                  विषय: पदस्थापन / स्थानांतरण आदेशानुसार पद का कार्यभार ग्रहण (Joining Report) करने बाबत।
                </div>

                <div className="space-y-3 text-justify font-sans">
                  <p>महोदय / महोदया,</p>
                  <p>
                    उपर्युक्त विषयान्तर्गत एवं प्रासंगिक विभागीय आदेश क्रमांक: <span className="font-bold underline">{formData.orderNo}</span> दिनांक <span className="font-bold underline">{new Date(formData.orderDate).toLocaleDateString('hi-IN')}</span> के अनुपालन में, मैं <span className="font-bold underline">{formData.teacherName}</span>, पद: <span className="font-bold underline">{formData.designation}</span> (कर्मचारी आईडी: <span className="font-mono font-bold">{formData.employeeId}</span>) अपने पूर्व विद्यालय <span className="font-bold underline">{formData.prevSchoolName}</span> से कार्यमुक्त होकर आज दिनांक <span className="font-bold underline">{new Date(formData.actionDate).toLocaleDateString('hi-IN')}</span> को <span className="font-bold underline">{formData.sessionTime === 'FN' ? 'पूर्वाह्न (Forenoon)' : 'अपराह्न (Afternoon)'}</span> में आपके विद्यालय में उपस्थित होकर अपने पद का कार्यभार ग्रहण (Joining) करता/करती हूँ।
                  </p>
                  <p>
                    अतः नम्र निवेदन है कि मेरी उपस्थिति एवं कार्यग्रहण रिपोर्ट स्वीकार कर सेवा पुस्तिका तथा शाला दर्पण पोर्टल पर इन्द्राज करने की कृपा करें।
                  </p>
                </div>

                <div className="pt-6 flex justify-between items-end font-sans">
                  <div>
                    <p className="font-bold">दिनांक: {new Date(formData.actionDate).toLocaleDateString('hi-IN')}</p>
                    <p className="font-bold">स्थान: {formData.district}</p>
                  </div>
                  <div className="text-center space-y-1">
                    <p className="font-bold">भवदीय / भवदीया</p>
                    <div className="h-10"></div>
                    <p className="font-extrabold">({formData.teacherName})</p>
                    <p className="text-[11px]">{formData.designation}</p>
                    <p className="text-[10px] font-mono">आईडी: {formData.employeeId} | मो: {formData.phone}</p>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t-2 border-dashed border-slate-400 font-sans space-y-2">
                  <p className="font-bold text-center underline">[ कार्यालय प्रधानाचार्य / PEEO द्वारा स्वीकृति एवं इन्द्राज ]</p>
                  <p>
                    उपर्युक्त कार्यग्रहण रिपोर्ट दिनांक <span className="font-bold">{new Date(formData.actionDate).toLocaleDateString('hi-IN')}</span> को स्वीकार कर उपस्थिति पंजिका पृष्ठ संख्या ....... तथा शाला दर्पण पोर्टल पर दर्ज की गई।
                  </p>
                  <div className="pt-6 flex justify-between items-end">
                    <div className="border border-dashed border-slate-400 p-3 text-[10px] text-slate-500 text-center">
                      [ कार्यालय सील / स्टाम्प ]
                    </div>
                    <div className="text-center font-bold">
                      <p>हस्ताक्षर प्रधानाचार्य / संस्था प्रधान</p>
                      <p className="text-[11px] font-normal">{formData.schoolName}</p>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* 2. KARYMUKTI (Relieving Application) */}
            {selectedFormatId === 'karymukti' && (
              <>
                <div className="text-center space-y-1 border-b-2 border-slate-800 pb-3">
                  <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                    {formData.schoolName}
                  </h3>
                  <p className="text-[11px] font-sans text-slate-600">
                    कार्यालय संस्था प्रधान व पीईईओ • जिला: {formData.district} (राजस्थान)
                  </p>
                </div>

                <div className="space-y-1 font-sans">
                  <p className="font-bold">सेवा में,</p>
                  <p className="font-semibold">श्रीमान प्रधानाचार्य / संस्था प्रधान,</p>
                  <p className="font-semibold">{formData.schoolName}</p>
                </div>

                <div className="p-2.5 bg-slate-100 border-l-4 border-slate-800 font-bold font-sans">
                  विषय: स्थानांतरण / पदोन्नति आदेशानुसार विद्यालय से कार्यमुक्त (Relieving) करने हेतु आवेदन।
                </div>

                <div className="space-y-3 text-justify font-sans">
                  <p>महोदय / महोदया,</p>
                  <p>
                    निवेदन है कि शासन/विभागीय आदेश क्रमांक: <span className="font-bold underline">{formData.orderNo}</span> दिनांक <span className="font-bold underline">{new Date(formData.orderDate).toLocaleDateString('hi-IN')}</span> के अनुपालन में मेरा स्थानांतरण पद <span className="font-bold underline">{formData.designation}</span> पर नवीन विद्यालय <span className="font-bold underline">{formData.nextSchoolName}</span> में हुआ है।
                  </p>
                  <p>
                    मैंने विद्यालय का समस्त प्रभार (चार्ज), प्रभार रजिस्टर, परीक्षा सामग्री एवं छात्रवृत्ति/अभिलेख संबंधित प्रभारी को सुपुर्द कर दिया है तथा विद्यालय का कोई देय (No Dues) शेष नहीं है।
                  </p>
                  <p>
                    अतः प्रार्थना है कि मुझे आज दिनांक <span className="font-bold underline">{new Date(formData.actionDate).toLocaleDateString('hi-IN')}</span> को <span className="font-bold underline">{formData.sessionTime === 'FN' ? 'पूर्वाह्न' : 'अपराह्न'}</span> में इस विद्यालय से कार्यमुक्त कर कार्यमुक्ति आदेश एवं अंतिम वेतन प्रमाण पत्र (LPC) जारी करने की कृपा करें।
                  </p>
                </div>

                <div className="pt-6 flex justify-between items-end font-sans">
                  <div>
                    <p className="font-bold">दिनांक: {new Date(formData.actionDate).toLocaleDateString('hi-IN')}</p>
                    <p className="font-bold">स्थान: {formData.district}</p>
                  </div>
                  <div className="text-center space-y-1">
                    <p className="font-bold">भवदीय / भवदीया</p>
                    <div className="h-10"></div>
                    <p className="font-extrabold">({formData.teacherName})</p>
                    <p className="text-[11px]">{formData.designation}</p>
                    <p className="text-[10px] font-mono">आईडी: {formData.employeeId}</p>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t-2 border-slate-800 font-sans space-y-2">
                  <div className="flex justify-between font-bold text-xs">
                    <span>आदेश क्रमांक: राउमावि/{formData.district}/2026/ कार्यमुक्ति</span>
                    <span>दिनांक: {new Date(formData.actionDate).toLocaleDateString('hi-IN')}</span>
                  </div>
                  <p className="pt-2">
                    श्री/श्रीमती <span className="font-bold">{formData.teacherName}</span>, <span className="font-bold">{formData.designation}</span> को उपरोक्तानुसार आज दिनांक <span className="font-bold">{new Date(formData.actionDate).toLocaleDateString('hi-IN')}</span> को अपराह्न में इस विद्यालय से कार्यमुक्त किया जाता है।
                  </p>
                  <div className="pt-8 flex justify-end font-bold text-center">
                    <div>
                      <p>हस्ताक्षर प्रधानाचार्य / डीडीओ</p>
                      <p className="text-[11px] font-normal">{formData.schoolName}</p>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* 3. LEAVE APPLICATION */}
            {selectedFormatId === 'leave' && (
              <>
                <div className="text-center space-y-1 border-b-2 border-slate-800 pb-3">
                  <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                    {formData.schoolName}
                  </h3>
                  <p className="text-[11px] font-sans text-slate-600">
                    आकस्मिक व स्वीकृत अवकाश आवेदन पत्र (शिक्षक अनुभाग)
                  </p>
                </div>

                <div className="space-y-1 font-sans">
                  <p className="font-bold">सेवा में,</p>
                  <p className="font-semibold">श्रीमान प्रधानाचार्य / संस्था प्रधान,</p>
                  <p className="font-semibold">{formData.schoolName}</p>
                </div>

                <div className="p-2.5 bg-slate-100 border-l-4 border-slate-800 font-bold font-sans">
                  विषय: {formData.leaveType} स्वीकृत करने बाबत।
                </div>

                <div className="space-y-3 text-justify font-sans">
                  <p>महोदय / महोदया,</p>
                  <p>
                    सविनय नम्र निवेदन है कि मुझे अति आवश्यक घरेलू कार्य होने के कारण दिनांक <span className="font-bold underline">{new Date(formData.leaveFrom).toLocaleDateString('hi-IN')}</span> से दिनांक <span className="font-bold underline">{new Date(formData.leaveTo).toLocaleDateString('hi-IN')}</span> तक विद्यालय में उपस्थित होने में असमर्थ हूँ।
                  </p>
                  <p>
                    मेरी अनुपस्थिति में मेरी कक्षाओं का प्रभार शिक्षक <span className="font-bold underline">{formData.substituteTeacher}</span> द्वारा संभाला जाएगा।
                  </p>
                  <p>
                    अतः आपसे नम्र प्रार्थना है कि मुझे उक्त तिथियों का <span className="font-bold">{formData.leaveType}</span> स्वीकृत करने की कृपा करें।
                  </p>
                </div>

                <div className="pt-6 flex justify-between items-end font-sans">
                  <div>
                    <p className="font-bold">दिनांक: {new Date().toLocaleDateString('hi-IN')}</p>
                    <p className="font-bold">संपर्क मो: {formData.phone}</p>
                  </div>
                  <div className="text-center space-y-1">
                    <p className="font-bold">प्रार्थी / प्राथिनी</p>
                    <div className="h-10"></div>
                    <p className="font-extrabold">({formData.teacherName})</p>
                    <p className="text-[11px]">{formData.designation}</p>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t-2 border-dashed border-slate-400 font-sans flex justify-between items-center">
                  <div className="text-xs">
                    <p className="font-bold">वैकल्पिक व्यवस्था सहमति:</p>
                    <p className="text-[11px]">हस्ताक्षर स्थानापन्न शिक्षक: ........................</p>
                  </div>
                  <div className="text-center font-bold">
                    <p>स्वीकृत / संस्था प्रधान हस्ताक्षर</p>
                  </div>
                </div>
              </>
            )}

            {/* 4. DUTY MAPPING ORDER */}
            {selectedFormatId === 'duty_mapping' && (
              <>
                <div className="text-center space-y-1 border-b-2 border-slate-800 pb-3">
                  <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                    कार्यालय प्रधानाचार्य एवं पंचायत प्रारंभिक शिक्षा अधिकारी (PEEO)
                  </h3>
                  <p className="text-[12px] font-bold font-sans text-slate-800">
                    {formData.schoolName}, जिला {formData.district}
                  </p>
                </div>

                <div className="flex justify-between font-bold font-sans text-xs">
                  <span>क्रमांक: राउमावि/{formData.district}/प्रभारी/2026/1042</span>
                  <span>दिनांक: {new Date().toLocaleDateString('hi-IN')}</span>
                </div>

                <div className="text-center font-black text-sm font-sans tracking-widest my-2 uppercase underline">
                  :: कार्यालय आदेश ::
                </div>

                <p className="font-sans text-justify">
                  सत्र 2026-27 में विद्यालय के सुचारू संचालन, शैक्षणिक गतिविधियों एवं विभागीय योजनाओं के पारदर्शी क्रियान्वयन हेतु निम्नलिखित शिक्षकों/कार्मिकों को उनके नाम के सम्मुख दर्शाये गये प्रभार (Incharge Duty) का दायित्व सौंपा जाता है:
                </p>

                <table className="w-full border-collapse border border-slate-800 font-sans text-xs my-3">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-800">
                      <th className="border border-slate-800 p-2 text-center w-12">क्र.सं.</th>
                      <th className="border border-slate-800 p-2 text-left">प्रभार (Incharge Duty Name)</th>
                      <th className="border border-slate-800 p-2 text-left">नामित शिक्षक / कार्मिक का नाम</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-slate-800 p-2 text-center font-bold">1</td>
                      <td className="border border-slate-800 p-2 font-bold">मिड-डे मील (MDM) प्रभारी</td>
                      <td className="border border-slate-800 p-2">{formData.mdmIncharge}</td>
                    </tr>
                    <tr>
                      <td className="border border-slate-800 p-2 text-center font-bold">2</td>
                      <td className="border border-slate-800 p-2 font-bold">आईसीटी व स्टेम लैब प्रभारी</td>
                      <td className="border border-slate-800 p-2">{formData.ictIncharge}</td>
                    </tr>
                    <tr>
                      <td className="border border-slate-800 p-2 text-center font-bold">3</td>
                      <td className="border border-slate-800 p-2 font-bold">परीक्षा (Exam) प्रभारी</td>
                      <td className="border border-slate-800 p-2">{formData.examIncharge}</td>
                    </tr>
                    <tr>
                      <td className="border border-slate-800 p-2 text-center font-bold">4</td>
                      <td className="border border-slate-800 p-2 font-bold">छात्रवृत्ति प्रभारी</td>
                      <td className="border border-slate-800 p-2">{formData.scholarshipIncharge}</td>
                    </tr>
                  </tbody>
                </table>

                <p className="font-sans text-justify">
                  उक्त प्रभारी तुरंत प्रभाव से अपना कार्यभार ग्रहण कर रिकॉर्ड संधारित करना सुनिश्चित करें।
                </p>

                <div className="pt-8 flex justify-end font-sans font-bold text-center">
                  <div>
                    <p>प्रधानाचार्य एवं पीईईओ</p>
                    <p className="text-[11px] font-normal">{formData.schoolName}</p>
                  </div>
                </div>
              </>
            )}

            {/* OTHER FORMATS FALLBACK GENERIC */}
            {['service_book', 'satyapan', 'no_dues', 'character'].includes(selectedFormatId) && (
              <>
                <div className="text-center space-y-1 border-b-2 border-slate-800 pb-3">
                  <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                    {formData.schoolName}
                  </h3>
                  <p className="text-[11px] font-sans text-slate-600">
                    शासकीय प्रारूप • जिला {formData.district} (राजस्थान)
                  </p>
                </div>

                <div className="p-2.5 bg-slate-100 border-l-4 border-slate-800 font-bold font-sans text-center">
                  {currentTemplate.titleHi}
                </div>

                <div className="space-y-4 font-sans leading-relaxed text-justify">
                  <p>
                    प्रमाणित किया जाता है कि कार्मिक <span className="font-bold">{formData.teacherName}</span> (पद: <span className="font-bold">{formData.designation}</span>, कर्मचारी आईडी: <span className="font-mono font-bold">{formData.employeeId}</span>) का विवरण विद्यालय अभिलेखानुसार पूर्णतः सत्य एवं सत्यापित है।
                  </p>
                  <p>
                    यह प्रमाण पत्र विभागीय/कार्यालय उपयोग हेतु आज दिनांक <span className="font-bold">{new Date().toLocaleDateString('hi-IN')}</span> को जारी किया जाता है।
                  </p>
                </div>

                <div className="pt-12 flex justify-between items-end font-sans">
                  <div>
                    <p className="font-bold">दिनांक: {new Date().toLocaleDateString('hi-IN')}</p>
                    <p className="font-bold">स्थान: {formData.district}</p>
                  </div>
                  <div className="text-center font-bold">
                    <p>हस्ताक्षर नियंत्रण अधिकारी / संस्था प्रधान</p>
                    <p className="text-[11px] font-normal">{formData.schoolName}</p>
                  </div>
                </div>
              </>
            )}

            {/* Document Footer */}
            <div className="pt-4 border-t border-slate-300 text-[10px] text-slate-500 font-sans flex justify-between items-center">
              <span>राजस्थान स्कूल शिक्षा विभाग • शाला सहायक डिजिटल प्रारूप</span>
              <span>पेज 1 / 1 (A4 Format)</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
