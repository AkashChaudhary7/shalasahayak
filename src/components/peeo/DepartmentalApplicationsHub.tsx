import React, { useState } from 'react';
import { SchoolProfile, Language } from '../../types';
import { PeeoOfficialLetterhead } from './PeeoOfficialLetterhead';
import { safeHtml2Canvas } from '../../utils/safeHtml2Canvas';
import {
  FileText,
  UserCheck,
  UserX,
  Printer,
  Share2,
  Save,
  CheckCircle2,
  ArrowLeft,
  Briefcase,
  Layers,
  Calendar,
  Clock
} from 'lucide-react';

interface DepartmentalApplicationsHubProps {
  schoolProfile: SchoolProfile;
  lang: Language;
  onBack?: () => void;
}

export const DepartmentalApplicationsHub: React.FC<DepartmentalApplicationsHubProps> = ({
  schoolProfile,
  lang,
  onBack
}) => {
  const [appType, setAppType] = useState<'joining' | 'relieving'>('joining');
  const [activeTab, setActiveTab] = useState<'maker' | 'preview'>('maker');
  const [exportLang, setExportLang] = useState<Language>('hi');

  // Form Fields State
  const [employeeId, setEmployeeId] = useState('RJPA201809021');
  const [empNameHindi, setEmpNameHindi] = useState('रामप्रसाद शर्मा');
  const [empNameEnglish, setEmpNameEnglish] = useState('Ram Prasad Sharma');
  const [designation, setDesignation] = useState('वरिष्ठ अध्यापक (गणित)');
  const [parentSchool, setParentSchool] = useState('राजकीय माध्यमिक विद्यालय, बस्सी (जयपुर)');
  const [destinationSchool, setDestinationSchool] = useState('राजकीय उच्च माध्यमिक विद्यालय, सांगानेर (जयपुर)');
  const [orderNo, setOrderNo] = useState('शिविरा/माध्य/स्था/2026/1024');
  const [orderDate, setOrderDate] = useState('2026-03-01');
  const [issuingAuthority, setIssuingAuthority] = useState('निदेशक, माध्यमिक शिक्षा, बीकानेर');
  const [actionDate, setActionDate] = useState('2026-03-24');
  const [sessionTime, setSessionTime] = useState<'FN' | 'AN'>('FN'); // Forenoon or Afternoon

  // Custom copy list for letterhead
  const copyListHindi = [
    `मुख्य ब्लॉक शिक्षा अधिकारी (CBEO), प्रासंगिक ब्लॉक।`,
    `कोषाधिकारी / आहरण वितरण अधिकारी (DDO Code: ${schoolProfile.ddoCode || 'DDO-102'})।`,
    `संबंधित कार्मिक सेवा पुस्तिका / व्यक्तिगत पत्रावली।`,
    `कार्यालय गार्ड फाइल / पीईईओ अभिलेख।`
  ];

  const copyListEnglish = [
    `Chief Block Education Officer (CBEO), Concerned Block.`,
    `Treasury Officer / DDO Code: ${schoolProfile.ddoCode || 'DDO-102'}.`,
    `Concerned Staff Service Book / Personal File.`,
    `Office Guard File / PEEO Records.`
  ];

  const isHi = exportLang === 'hi';

  const handleShareAsImage = async () => {
    const element = document.getElementById('printable-application-sheet');
    if (!element) return;
    try {
      const canvas = await safeHtml2Canvas(element, {
        useCORS: true,
        scale: 2,
        backgroundColor: '#ffffff'
      });
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const file = new File([blob], `${appType}_application.png`, { type: 'image/png' });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              files: [file],
              title: isHi ? 'राजकीय प्रपत्र' : 'Official Government Document',
              text: isHi ? 'शाला सहायक द्वारा जनरेट किया गया प्रपत्र' : 'Generated via Shala Sahayak App'
            });
          } catch (shareErr) {
            triggerDownload(canvas);
          }
        } else {
          triggerDownload(canvas);
        }
      }, 'image/png');
    } catch (err) {
      console.error('Error sharing image', err);
    }
  };

  const triggerDownload = (canvas: HTMLCanvasElement) => {
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = `${appType}_application.png`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-6 shadow-xl border border-slate-200 dark:border-slate-800 space-y-6">
      
      {/* 1. Header with back button */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-slate-100 leading-tight">
              {lang === 'hi' ? 'राजकीय प्रपत्र व कार्यभार प्रभाग' : 'Departmental Applications Hub'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {lang === 'hi' ? 'शिक्षकों के कार्यभार ग्रहण (Joining) एवं कार्यमुक्ति (Relieving) का आधिकारिक प्रारूप जनरेटर' : 'Synthesize official joining & relieving reports with standard DDO blocks'}
            </p>
          </div>
        </div>

        {onBack && (
          <button
            onClick={onBack}
            className="p-1.5 rounded-xl bg-slate-50 hover:bg-emerald-50 dark:bg-slate-800 dark:hover:bg-emerald-950/30 text-slate-500 hover:text-emerald-700 dark:text-slate-400 dark:hover:text-emerald-400 border border-slate-200 dark:border-slate-800 transition-all cursor-pointer active:scale-95 flex items-center gap-1.5 text-xs font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">{lang === 'hi' ? 'वापस' : 'Back'}</span>
          </button>
        )}
      </div>

      {/* 2. Top App Type Selection and Dual-Tab Toggle Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pb-2">
        {/* App Type Switch */}
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700 w-full sm:w-auto">
          <button
            onClick={() => setAppType('joining')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all ${
              appType === 'joining'
                ? 'bg-emerald-700 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-950'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>{lang === 'hi' ? 'कार्यभार ग्रहण (Joining)' : 'Joining Application'}</span>
          </button>
          <button
            onClick={() => setAppType('relieving')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all ${
              appType === 'relieving'
                ? 'bg-rose-700 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-950'
            }`}
          >
            <UserX className="w-4 h-4" />
            <span>{lang === 'hi' ? 'कार्यमुक्ति (Relieving)' : 'Relieving Order'}</span>
          </button>
        </div>

        {/* Master Dual Tab Engine */}
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700 w-full sm:w-auto shrink-0 font-sans shadow-inner">
          <button
            onClick={() => setActiveTab('maker')}
            className={`flex-1 sm:flex-none px-5 py-2 rounded-xl text-xs font-black transition-all ${
              activeTab === 'maker'
                ? 'bg-slate-800 text-white shadow-sm dark:bg-white dark:text-slate-950'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-950'
            }`}
          >
            {lang === 'hi' ? 'प्रपत्र प्रविष्टि (Maker / Form Input)' : 'Maker / Form Input'}
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`flex-1 sm:flex-none px-5 py-2 rounded-xl text-xs font-black transition-all ${
              activeTab === 'preview'
                ? 'bg-slate-800 text-white shadow-sm dark:bg-white dark:text-slate-950'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-950'
            }`}
          >
            {lang === 'hi' ? 'पूर्वावलोकन (Preview Order)' : 'Preview Order'}
          </button>
        </div>
      </div>

      {/* 3. MAKER/INPUT VIEW */}
      {activeTab === 'maker' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fadeIn">
          
          {/* Section: Employee Basic Info */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3">
            <h3 className="font-extrabold text-xs text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-200 dark:border-slate-700 pb-2">
              <Briefcase className="w-4 h-4 text-emerald-600" />
              <span>{lang === 'hi' ? 'कार्मिक का व्यक्तिगत व सेवा विवरण' : 'Employee & Designation details'}</span>
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {lang === 'hi' ? 'कर्मचारी आईडी (Employee ID)' : 'Employee ID'}
                </label>
                <input
                  type="text"
                  value={employeeId}
                  onChange={e => setEmployeeId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {lang === 'hi' ? 'पदनाम (Designation)' : 'Designation'}
                </label>
                <input
                  type="text"
                  value={designation}
                  onChange={e => setDesignation(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {lang === 'hi' ? 'नाम (हिंदी में)' : 'Name (Hindi)'}
                </label>
                <input
                  type="text"
                  value={empNameHindi}
                  onChange={e => setEmpNameHindi(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {lang === 'hi' ? 'नाम (अंग्रेजी में)' : 'Name (English)'}
                </label>
                <input
                  type="text"
                  value={empNameEnglish}
                  onChange={e => setEmpNameEnglish(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
                />
              </div>
            </div>

            <div className="text-xs space-y-3">
              {appType === 'joining' ? (
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {lang === 'hi' ? 'मूल विद्यालय / पूर्व संस्था' : 'Parent School / Relieved School'}
                  </label>
                  <input
                    type="text"
                    value={parentSchool}
                    onChange={e => setParentSchool(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {lang === 'hi' ? 'नवीन पदस्थापन विद्यालय' : 'New Destination School'}
                  </label>
                  <input
                    type="text"
                    value={destinationSchool}
                    onChange={e => setDestinationSchool(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Section: Order Reference & Action Meta */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3">
            <h3 className="font-extrabold text-xs text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-200 dark:border-slate-700 pb-2">
              <Layers className="w-4 h-4 text-emerald-600" />
              <span>{lang === 'hi' ? 'स्थानांतरण / पदस्थापन आदेश संदर्भ' : 'Transfer/Posting Order Reference'}</span>
            </h3>

            <div className="text-xs space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {lang === 'hi' ? 'आदेश क्रमांक' : 'Order Number'}
                </label>
                <input
                  type="text"
                  value={orderNo}
                  onChange={e => setOrderNo(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {lang === 'hi' ? 'आदेश दिनांक' : 'Order Date'}
                  </label>
                  <input
                    type="date"
                    value={orderDate}
                    onChange={e => setOrderDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {lang === 'hi' ? 'आदेश जारीकर्ता प्राधिकारी' : 'Order Issuing Authority'}
                  </label>
                  <input
                    type="text"
                    value={issuingAuthority}
                    onChange={e => setIssuingAuthority(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {appType === 'joining'
                      ? (lang === 'hi' ? 'कार्यभार ग्रहण तिथि' : 'Date of Joining')
                      : (lang === 'hi' ? 'कार्यमुक्ति तिथि' : 'Date of Relieving')}
                  </label>
                  <input
                    type="date"
                    value={actionDate}
                    onChange={e => setActionDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {lang === 'hi' ? 'सत्र (मध्याह्न पूर्व/पश्चात)' : 'Session (FN/AN Toggle)'}
                  </label>
                  <div className="flex bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 p-1 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setSessionTime('FN')}
                      className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                        sessionTime === 'FN'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {lang === 'hi' ? 'पूर्वाह्न (FN)' : 'Forenoon (FN)'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setSessionTime('AN')}
                      className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                        sessionTime === 'AN'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {lang === 'hi' ? 'अपराह्न (AN)' : 'Afternoon (AN)'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 flex justify-end">
            <button
              onClick={() => setActiveTab('preview')}
              className="px-6 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs flex items-center space-x-1.5 shadow-md hover:shadow-lg transition-all cursor-pointer active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4 text-amber-300" />
              <span>{lang === 'hi' ? 'आदेश पूर्वावलोकन देखें' : 'Generate & View Preview'}</span>
            </button>
          </div>
        </div>
      )}

      {/* 4. PREVIEW VIEW WITH PRINT & IMAGE CONTROLS */}
      {activeTab === 'preview' && (
        <div className="space-y-4 animate-fadeIn">
          {/* Document Preview Controls */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-bold gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-slate-600 dark:text-slate-300">
                {lang === 'hi' ? 'आधिकारिक राजकीय प्रारूप तैयार है' : 'Official Government Layout Synthesized'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Language toggle for the print copy */}
              <button
                onClick={() => setExportLang(exportLang === 'hi' ? 'en' : 'hi')}
                className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100 font-bold hover:bg-slate-300 transition-colors"
              >
                {exportLang === 'hi' ? 'English Print' : 'हिंदी प्रिंट'}
              </button>

              <button
                onClick={handlePrint}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-300 dark:border-slate-700 flex items-center gap-1.5 font-bold cursor-pointer transition-colors"
              >
                <Printer className="w-4 h-4 text-emerald-700" />
                <span>{lang === 'hi' ? 'मुद्रित करें / Print PDF' : 'Print PDF'}</span>
              </button>

              <button
                onClick={handleShareAsImage}
                className="px-4 py-2 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white flex items-center gap-1.5 font-bold cursor-pointer shadow-md transition-all active:scale-95"
              >
                <Share2 className="w-4 h-4 text-amber-300" />
                <span>{lang === 'hi' ? 'छवि शेयर करें / Share as Image' : 'Share as Image'}</span>
              </button>
            </div>
          </div>

          {/* Actual Sheet Block with html2canvas target ID */}
          <div id="printable-application-sheet" className="p-1 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md">
            <PeeoOfficialLetterhead
              schoolProfile={schoolProfile}
              subjectHindi={appType === 'joining' ? `नवीन पदस्थापन पश्चात कार्यभार ग्रहण करवाने बाबत।` : `स्थानांतरण होने पर कार्यमुक्ति बाबत कार्यालय आदेश।`}
              subjectEnglish={appType === 'joining' ? `Report regarding Joining on transfer/new posting.` : `Relieving Order on transfer/posting.`}
              exportLang={exportLang}
              onExportLangChange={setExportLang}
              dispatchNo={`${schoolProfile.nicCode || 'SS'}/DDO/App/${Math.floor(Math.random() * 800 + 100)}`}
              orderDate={new Date().toLocaleDateString('en-IN')}
              copyListHindi={copyListHindi}
              copyListEnglish={copyListEnglish}
            >
              <div className="space-y-4 text-xs font-medium text-slate-800 dark:text-slate-200 leading-relaxed text-justify">
                {appType === 'joining' ? (
                  // JOINING CONTENT
                  isHi ? (
                    <>
                      <p>
                        महोदय / महोदया,
                      </p>
                      <p className="indent-8">
                        उपरोक्त विषयांतर्गत निवेदन है कि श्री/श्रीमती <strong>{empNameHindi}</strong>, पदनाम <strong>{designation}</strong> का स्थानांतरण/पदस्थापन {issuingAuthority} के आदेश क्रमांक <strong>{orderNo}</strong> दिनांक <strong>{orderDate}</strong> के तहत इस विद्यालय में किया गया है।
                      </p>
                      <p className="indent-8">
                        उक्त आदेश के अनुपालन में कार्मिक ने अपने पूर्व संस्थान <strong>{parentSchool}</strong> से कार्यमुक्त होकर आज दिनांक <strong>{new Date(actionDate).toLocaleDateString('en-IN')}</strong> को <strong>{sessionTime === 'FN' ? 'मध्याह्न पूर्व (Forenoon)' : 'मध्याह्न पश्चात (Afternoon)'}</strong> में राजकीय उच्च माध्यमिक विद्यालय, {schoolProfile.schoolName} में अपना कार्यभार ग्रहण (Joining) कर लिया है।
                      </p>
                      <p className="indent-8">
                        कार्मिक का सेवा विवरण, कर्मचारी आईडी <strong>{employeeId}</strong> है। कृपया कार्मिक को शाला दर्पण पोर्टल एवं पे-मैनेजर पर ऑनलाइन ज्वाइन करवाकर नियमानुसार वेतन आहरण प्रारंभ करने की अनुमति प्रदान करें।
                      </p>
                    </>
                  ) : (
                    <>
                      <p>
                        Sir/Madam,
                      </p>
                      <p className="indent-8">
                        With reference to the subject cited above, Sh./Smt. <strong>{empNameEnglish}</strong>, designated as <strong>{designation}</strong>, has been posted/transferred to this school under order of the {issuingAuthority} vide order number <strong>{orderNo}</strong> dated <strong>{orderDate}</strong>.
                      </p>
                      <p className="indent-8">
                        In compliance with the said order, the staff member, after being relieved from <strong>{parentSchool}</strong>, has reported and joined duties at Govt. Higher Secondary School, {schoolProfile.schoolName} today on <strong>{new Date(actionDate).toLocaleDateString('en-IN')}</strong> in the <strong>{sessionTime === 'FN' ? 'Forenoon (FN)' : 'Afternoon (AN)'}</strong> session.
                      </p>
                      <p className="indent-8">
                        The Employee ID of the official is <strong>{employeeId}</strong>. It is requested to kindly update the joining status on the Shala Darpan portal and PayManager for salary disbursement.
                      </p>
                    </>
                  )
                ) : (
                  // RELIEVING CONTENT
                  isHi ? (
                    <>
                      <p className="indent-8">
                        श्री/श्रीमती <strong>{empNameHindi}</strong>, पदनाम <strong>{designation}</strong>, कर्मचारी आईडी <strong>{employeeId}</strong> का स्थानांतरण {issuingAuthority} के आदेश क्रमांक <strong>{orderNo}</strong> दिनांक <strong>{orderDate}</strong> के अनुपालन में <strong>{destinationSchool}</strong> में किया गया है।
                      </p>
                      <p className="indent-8">
                        अतः उक्त आदेश के अनुपालन में कार्मिक को आज दिनांक <strong>{new Date(actionDate).toLocaleDateString('en-IN')}</strong> को <strong>{sessionTime === 'FN' ? 'मध्याह्न पूर्व (Forenoon)' : 'मध्याह्न पश्चात (Afternoon)'}</strong> में इस विद्यालय/संस्थान से कार्यमुक्त (Relieve) किया जाता है।
                      </p>
                      <p className="indent-8">
                        प्रमाणित किया जाता है कि कार्मिक के जिम्मे कोई राजकीय देयता/पुस्तकालय पुस्तकें अथवा गोपनीय सामग्री शेष नहीं है। इनका अंतिम वेतन (LPC) तथा सेवा पुस्तिका शीघ्र ही नए कार्यालय को प्रेषित कर दी जाएगी। कार्मिक के उज्जवल भविष्य की कामना की जाती है।
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="indent-8">
                        In compliance with the transfer order issued by the {issuingAuthority} vide order number <strong>{orderNo}</strong> dated <strong>{orderDate}</strong>, Sh./Smt. <strong>{empNameEnglish}</strong>, <strong>{designation}</strong> (Employee ID: <strong>{employeeId}</strong>) is hereby relieved from Govt. Higher Secondary School, {schoolProfile.schoolName} today on <strong>{new Date(actionDate).toLocaleDateString('en-IN')}</strong> in the <strong>{sessionTime === 'FN' ? 'Forenoon (FN)' : 'Afternoon (AN)'}</strong> session.
                      </p>
                      <p className="indent-8">
                        The official is directed to report for duty at <strong>{destinationSchool}</strong>. It is certified that no government dues, library books, or confidential materials are pending against the official. Service book and LPC will be dispatched to the new office shortly. Wishing the official success in their future endeavors.
                      </p>
                    </>
                  )
                )}
              </div>
            </PeeoOfficialLetterhead>
          </div>
        </div>
      )}
    </div>
  );
};
