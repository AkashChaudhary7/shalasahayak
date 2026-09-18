import React from 'react';
import { SchoolProfile, Language } from '../../types';
import { Download, Printer, Globe } from 'lucide-react';

interface PeeoOfficialLetterheadProps {
  schoolProfile: SchoolProfile;
  dispatchNo?: string;
  orderDate?: string;
  subjectHindi: string;
  subjectEnglish: string;
  exportLang: Language;
  onExportLangChange: (lang: Language) => void;
  onDownloadPdf?: () => void;
  onPrint?: () => void;
  children?: React.ReactNode;
  copyListHindi?: string[];
  copyListEnglish?: string[];
}

export const PeeoOfficialLetterhead: React.FC<PeeoOfficialLetterheadProps> = ({
  schoolProfile,
  dispatchNo = `राउमावि/पीईईओ/2026/${Math.floor(Math.random() * 800 + 100)}`,
  orderDate = new Date().toLocaleDateString('en-IN'),
  subjectHindi,
  subjectEnglish,
  exportLang,
  onExportLangChange,
  onDownloadPdf,
  onPrint,
  children,
  copyListHindi = [
    'मुख्य ब्लॉक शिक्षा अधिकारी (CBEO), प्रासंगिक ब्लॉक।',
    'कोषाधिकारी / आहरण वितरण अधिकारी (DDO Code: ' + schoolProfile.ddoCode + ')।',
    'संबंधित कार्मिक सेवा पुस्तिका / व्यक्तिगत पत्रावली।',
    'कार्यालय गार्ड फाइल / पीईईओ अभिलेख।'
  ],
  copyListEnglish = [
    'Chief Block Education Officer (CBEO), Concerned Block.',
    'Treasury Officer / DDO Code: ' + schoolProfile.ddoCode + '.',
    'Concerned Staff Service Book / Personal File.',
    'Office Guard File / PEEO Records.'
  ]
}) => {
  const isHi = exportLang === 'hi';

  const handleDefaultPrint = () => {
    if (onPrint) {
      onPrint();
    } else {
      window.print();
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-lg overflow-hidden transition-all">
      
      {/* Top Action Bar / Export & Language Controls */}
      <div className="bg-slate-900 text-white p-3.5 sm:px-6 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 print:hidden">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
          <span className="font-extrabold text-xs tracking-wide uppercase text-slate-300">
            {isHi ? 'कार्यालयीन राजकीय हेडर प्रारूप' : 'Official Government Letterhead Layout'}
          </span>
        </div>

        <div className="flex items-center space-x-2 flex-wrap">
          {/* Language Selector Switcher */}
          <div className="flex items-center bg-slate-800 rounded-xl p-1 border border-slate-700">
            <Globe className="w-3.5 h-3.5 text-amber-400 ml-1.5 mr-1" />
            <button
              onClick={() => onExportLangChange('hi')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                isHi ? 'bg-amber-400 text-slate-950 shadow-xs' : 'text-slate-300 hover:text-white'
              }`}
            >
              हिंदी (Hindi)
            </button>
            <button
              onClick={() => onExportLangChange('en')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                !isHi ? 'bg-amber-400 text-slate-950 shadow-xs' : 'text-slate-300 hover:text-white'
              }`}
            >
              English
            </button>
          </div>

          {/* Quick Print Button */}
          <button
            onClick={handleDefaultPrint}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold text-xs flex items-center space-x-1.5 border border-slate-700 transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden xs:inline">{isHi ? 'प्रिंट करें' : 'Print'}</span>
          </button>

          {/* PDF Download Button */}
          {onDownloadPdf && (
            <button
              onClick={onDownloadPdf}
              className="px-4 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs flex items-center space-x-2 shadow-md transition-all active:scale-95"
            >
              <Download className="w-4 h-4 text-amber-300" />
              <span>{isHi ? 'PDF डाउनलोड करें' : 'Download PDF'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Printable Official Document Sheet Area */}
      <div className="p-6 sm:p-8 space-y-6 text-slate-900 dark:text-slate-100 font-sans print:p-0 print:text-black print:bg-white">
        
        {/* 1. Official Header Block */}
        <div className="border-b-2 border-slate-900 dark:border-slate-100 pb-4 text-center space-y-1">
          <div className="flex justify-center mb-2">
            <div className="w-12 h-12 rounded-xl bg-white p-1 border border-slate-300 shadow-sm flex items-center justify-center">
              <img src="/logo.svg" alt="Shala Sahayak Logo" className="w-full h-full object-contain" />
            </div>
          </div>
          <div className="text-xs font-extrabold uppercase tracking-widest text-slate-600 dark:text-slate-400 print:text-black">
            {isHi ? 'राजस्थान सरकार — स्कूल शिक्षा विभाग' : 'GOVERNMENT OF RAJASTHAN — SCHOOL EDUCATION DEPARTMENT'}
          </div>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white print:text-black tracking-tight leading-tight">
            {isHi
              ? 'कार्यालय पंचायत प्रारंभिक शिक्षा अधिकारी (PEEO) एवं प्रधानाचार्य'
              : 'OFFICE OF PANCHAYAT ELEMENTARY EDUCATION OFFICER & PRINCIPAL'}
          </h2>
          <h3 className="text-sm sm:text-base font-bold text-emerald-800 dark:text-emerald-400 print:text-black">
            {isHi
              ? `राजकीय उच्च माध्यमिक विद्यालय, ${schoolProfile.schoolName}`
              : `GOVT. HIGHER SECONDARY SCHOOL, ${schoolProfile.schoolName.toUpperCase()}`}
          </h3>
          <div className="text-xs text-slate-600 dark:text-slate-400 print:text-black font-semibold flex flex-wrap justify-center gap-x-4">
            <span>{isHi ? 'ब्लॉक' : 'Block'}: {schoolProfile.block}</span>
            <span>•</span>
            <span>{isHi ? 'जिला' : 'District'}: {schoolProfile.district}</span>
            <span>•</span>
            <span>UDISE: {schoolProfile.udiseCode}</span>
            {schoolProfile.nicCode && (
              <>
                <span>•</span>
                <span>PEEO Code: {schoolProfile.nicCode}</span>
              </>
            )}
          </div>
        </div>

        {/* 2. Metadata Bar (Dispatch No & Date) */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs font-extrabold text-slate-800 dark:text-slate-200 print:text-black border-b border-slate-200 dark:border-slate-800 pb-2">
          <div>
            <span>{isHi ? 'क्रमांक' : 'Dispatch No'}: </span>
            <span className="font-mono">{dispatchNo}</span>
          </div>
          <div>
            <span>{isHi ? 'दिनांक' : 'Date'}: </span>
            <span className="font-mono">{orderDate}</span>
          </div>
        </div>

        {/* 3. Subject Banner */}
        <div className="bg-slate-100 dark:bg-slate-800/80 p-3 rounded-2xl border border-slate-200 dark:border-slate-700 text-center font-black text-xs sm:text-sm text-slate-900 dark:text-slate-100 print:bg-slate-50 print:border-black print:text-black">
          <span>{isHi ? 'विषय: ' : 'SUBJECT: '}</span>
          <span className="underline decoration-2 decoration-emerald-600 underline-offset-4">
            {isHi ? subjectHindi : subjectEnglish}
          </span>
        </div>

        {/* 4. Main Body / Children Content */}
        <div className="space-y-4">
          {children}
        </div>

        {/* 5. Footer Signature Block */}
        <div className="pt-8 border-t border-slate-200 dark:border-slate-800 print:border-slate-400 flex flex-col items-end text-right space-y-1">
          <div className="w-64 space-y-1 text-center font-bold text-xs text-slate-800 dark:text-slate-200 print:text-black">
            <div className="h-12 border-b border-dashed border-slate-300 dark:border-slate-700 flex items-end justify-center pb-1 text-[10px] text-slate-400 italic">
              {isHi ? '[हस्ताक्षर एवं सील]' : '[Signature & Official Stamp]'}
            </div>
            <div className="font-black text-sm pt-1">
              ({schoolProfile.principalName})
            </div>
            <div>
              {isHi
                ? 'पंचायत प्रारंभिक शिक्षा अधिकारी एवं प्रधानाचार्य'
                : 'Panchayat Elementary Education Officer & Principal'}
            </div>
            <div className="text-[11px] text-slate-600 dark:text-slate-400 print:text-black">
              {schoolProfile.schoolName}
            </div>
          </div>
        </div>

        {/* 6. Dispatch Copy Distribution List (प्रतिलिपि) */}
        <div className="pt-4 text-xs space-y-1.5 border-t border-slate-200 dark:border-slate-800 print:border-slate-300">
          <div className="font-bold text-slate-800 dark:text-slate-200 print:text-black">
            {isHi ? 'प्रतिलिपि सूचनार्थ एवं आवश्यक कार्यवाही हेतु प्रेषित:' : 'Copy forwarded for information & necessary action to:'}
          </div>
          <ol className="list-decimal pl-5 space-y-0.5 text-slate-700 dark:text-slate-300 print:text-black font-medium text-[11px]">
            {(isHi ? copyListHindi : copyListEnglish).map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ol>
        </div>

      </div>

    </div>
  );
};
