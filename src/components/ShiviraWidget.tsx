import React, { useState, useEffect } from 'react';
import { Language, SchoolProfile } from '../types';
import { SHIVIRA_CALENDAR_DATA, ShiviraMonth } from '../data/shiviraCalendar';
import { safeHtml2Canvas } from '../utils/safeHtml2Canvas';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Share2,
  Download,
  Check,
  Smartphone,
  ExternalLink,
  BookOpen,
  CheckCircle2,
  Sparkles,
  Info,
  Clock,
  Layers,
  Globe
} from 'lucide-react';

interface ShiviraWidgetProps {
  schoolProfile: SchoolProfile;
  lang: Language;
}

export const ShiviraWidget: React.FC<ShiviraWidgetProps> = ({
  schoolProfile,
  lang
}) => {
  // Determine default month index according to real system date
  const getDefaultMonthIndex = () => {
    const currentMonthName = new Date().toLocaleString('en-US', { month: 'long' }).toLowerCase();
    const foundIndex = SHIVIRA_CALENDAR_DATA.findIndex(
      m => m.monthName.toLowerCase() === currentMonthName
    );
    return foundIndex !== -1 ? foundIndex : 1; // Default to August (index 1) if matched/fallback
  };

  const [selectedMonthIndex, setSelectedMonthIndex] = useState<number>(getDefaultMonthIndex);
  const [showYearInSitemap, setShowYearInSitemap] = useState<boolean>(true);

  const currentMonthData: ShiviraMonth = SHIVIRA_CALENDAR_DATA[selectedMonthIndex] || SHIVIRA_CALENDAR_DATA[1];

  const totalHolidaysCount = currentMonthData.holidaysCount ?? (currentMonthData.holidays ? currentMonthData.holidays.length : 0);
  const totalSpecialWorkingDaysCount = currentMonthData.specialWorkingDaysCount ?? 7;

  const [copied, setCopied] = useState(false);
  const [exportingImg, setExportingImg] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const appDownloadUrl = window.location.origin || 'https://shalasahayak.in';

  const showToast = (msg: string) => {
    setStatusMsg(msg);
    setTimeout(() => setStatusMsg(null), 3000);
  };

  // Helper to generate calendar matrix for selected month
  const generateCalendarMatrix = (month: ShiviraMonth) => {
    const startDay = month.startDayOfWeek ?? 6; // Default Saturday for August
    const totalDays = month.totalDaysInMonth ?? 31;
    
    const matrix: (number | null)[][] = [];
    let currentWeek: (number | null)[] = new Array(startDay).fill(null);
    
    for (let day = 1; day <= totalDays; day++) {
      currentWeek.push(day);
      if (currentWeek.length === 7) {
        matrix.push(currentWeek);
        currentWeek = [];
      }
    }
    
    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push(null);
      }
      matrix.push(currentWeek);
    }
    
    return matrix;
  };

  const calendarGrid = generateCalendarMatrix(currentMonthData);

  const handleShareText = () => {
    const monthStr = `${currentMonthData.monthNameHindi}-${currentMonthData.year}`;
    let text = `📅 *शाला सहायक (Shala Sahayak) — शिविरा पंचांग: ${monthStr}*\n\n`;
    text += `कार्य दिवस: ${currentMonthData.workingDays} | अवकाश: ${totalHolidaysCount}\n\n`;
    
    if (currentMonthData.holidaysDetailed && currentMonthData.holidaysDetailed.length > 0) {
      text += `📅 *अवकाश (Holidays):*\n`;
      currentMonthData.holidaysDetailed.forEach(h => {
        text += `• ${h.date}: ${h.title}\n`;
      });
      text += `\n`;
    }

    if (currentMonthData.departmentalTasksDetailed && currentMonthData.departmentalTasksDetailed.length > 0) {
      text += `📝 *अन्य आवश्यक कार्य:*\n`;
      currentMonthData.departmentalTasksDetailed.forEach(t => {
        text += `• ${t.date}: ${t.title}\n`;
      });
    }

    text += `\n🌐 विस्तृत शिविरा एवं टूल्स हेतु देखें: ${appDownloadUrl}`;

    if (navigator.share) {
      navigator.share({
        title: `Shivira Panchang - ${monthStr}`,
        text: text,
        url: appDownloadUrl
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      setCopied(true);
      showToast('शिविरा विवरण टेक्स्ट कॉपी हो गया!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShareAsImage = async () => {
    const element = document.getElementById('shivira-calendar-export-canvas');
    if (!element) return;
    try {
      setExportingImg(true);
      
      const canvas = await safeHtml2Canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      
      canvas.toBlob(async (blob) => {
        if (!blob) {
          setExportingImg(false);
          return;
        }

        const monthStr = `${currentMonthData.monthNameHindi}_${currentMonthData.year}`;
        const fileName = `Shivira_Panchang_${monthStr}.png`;
        const file = new File([blob], fileName, { type: 'image/png' });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              files: [file],
              title: `शिविरा पंचांग: ${currentMonthData.monthNameHindi}-${currentMonthData.year}`,
              text: `राजस्थान विद्यालय शिक्षा विभाग शिविरा पंचांग - शाला सहायक ऐप (${appDownloadUrl})`
            });
            showToast('शिविरा पंचांग इमेज शेयर की गई!');
            setExportingImg(false);
            return;
          } catch (e) {
            console.log('Share fallback to download');
          }
        }

        const link = document.createElement('a');
        link.download = fileName;
        link.href = URL.createObjectURL(blob);
        link.click();
        showToast('शिविरा पंचांग इमेज डाउनलोड हो गई है!');
        setExportingImg(false);
      }, 'image/png');

    } catch (err) {
      console.error(err);
      showToast('इमेज जनरेट करने में समस्या आई');
      setExportingImg(false);
    }
  };

  return (
    <div className="space-y-5 animate-fadeIn font-sans text-slate-800 dark:text-slate-100">
      
      {/* Status Toast */}
      {statusMsg && (
        <div className="p-3 rounded-xl bg-emerald-700 text-white font-bold text-xs shadow-lg flex items-center justify-between animate-bounce">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-amber-300" />
            <span>{statusMsg}</span>
          </span>
          <button onClick={() => setStatusMsg(null)} className="text-amber-300 hover:text-white font-bold">×</button>
        </div>
      )}

      {/* 🧭 SITEMAP BREADCRUMB & QUICK LINKS TOP BAR */}
      <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        {/* Sitemap Breadcrumbs */}
        <div className="flex items-center gap-1.5 font-bold text-slate-600 dark:text-slate-300 flex-wrap">
          <span className="text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
            <Globe className="w-3.5 h-3.5" />
            <span>होम</span>
          </span>
          <span>›</span>
          <span className="text-slate-500">शिविरा पंचांग सलेक्टर</span>
          <span>›</span>
          <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-md font-mono font-black border border-emerald-300 dark:border-emerald-800">
            {currentMonthData.monthNameHindi} {currentMonthData.year} शिविरा
          </span>
        </div>

        {/* Links on top */}
        <div className="flex items-center gap-3 shrink-0 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
          <button 
            onClick={() => setShowYearInSitemap(!showYearInSitemap)}
            className="flex items-center gap-1 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5 text-emerald-600" />
            <span>वर्ष {showYearInSitemap ? 'छुपाएं' : 'दिखाएं'}</span>
          </button>
          <a
            href="https://rajshaladarpan.nic.in"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sky-600 hover:underline"
          >
            <ExternalLink className="w-3 h-3" />
            <span>शाला दर्पण</span>
          </a>
        </div>
      </div>

      {/* 🌟 SITEMAP MONTH ICONS SELECTOR BAR (Like August Shivira) */}
      <div className="bg-slate-900 text-white p-4 rounded-3xl border border-slate-800 shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-amber-400" />
            <h3 className="font-extrabold text-xs uppercase tracking-wider text-amber-300">
              शिविरा पंचांग साइटमैप (मासिक चयन)
            </h3>
          </div>
          <span className="text-[10px] text-slate-400 font-medium">
            माह पर क्लिक करें
          </span>
        </div>

        {/* Scrollable Month Icon Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-2">
          {SHIVIRA_CALENDAR_DATA.map((month, idx) => {
            const isSelected = selectedMonthIndex === idx;
            const label = showYearInSitemap 
              ? `${month.monthNameHindi} ${month.year}`
              : `${month.monthNameHindi} शिविरा`;

            return (
              <button
                key={idx}
                onClick={() => setSelectedMonthIndex(idx)}
                className={`p-2.5 rounded-2xl flex flex-col items-center justify-center text-center transition-all cursor-pointer active:scale-95 ${
                  isSelected
                    ? 'bg-gradient-to-b from-emerald-500 to-teal-700 text-white font-black shadow-md ring-2 ring-amber-400 scale-105'
                    : 'bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white font-bold border border-slate-700/80'
                }`}
              >
                <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black mb-1 ${
                  isSelected ? 'bg-amber-400 text-slate-950' : 'bg-slate-700 text-amber-300'
                }`}>
                  {month.monthNameHindi.charAt(0)}
                </div>
                <span className="text-[11px] leading-tight font-sans">
                  {label}
                </span>
                {isSelected && (
                  <span className="mt-1 text-[8px] bg-amber-400 text-slate-950 font-black px-1.5 py-0.2 rounded-full uppercase">
                    सक्रिय
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 📤 Top Action Bar for Image/Text Sharing */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h3 className="font-black text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>{currentMonthData.monthNameHindi} {currentMonthData.year} शिविरा शेयरिंग</span>
          </h3>
          <p className="text-xs text-slate-500">
            मासिक गतिविधियों व अवकाश पंचांग को व्हाट्सएप एवं सोशल मीडिया पर साझा करें
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleShareText}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-all text-xs font-bold cursor-pointer active:scale-95"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4 text-emerald-600" />}
            <span>{copied ? 'कॉपी किया!' : 'टेक्स्ट शेयर'}</span>
          </button>

          <button
            onClick={handleShareAsImage}
            disabled={exportingImg}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white transition-all text-xs font-black shadow-md cursor-pointer active:scale-95 disabled:opacity-50"
          >
            {exportingImg ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Download className="w-4 h-4 text-amber-300" />
            )}
            <span>{exportingImg ? 'जनरेट हो रहा है...' : 'इमेज शेयर करें (Share as Image)'}</span>
          </button>
        </div>
      </div>

      {/* 🖼️ SHALA SAHAYAK SHIVIRA PANCHANG IMAGE CANVAS (MATCHING IMAGE 2 EXACTLY) */}
      <div 
        id="shivira-calendar-export-canvas"
        className="p-5 sm:p-6 bg-white text-slate-900 rounded-3xl border border-slate-300 shadow-2xl space-y-4 max-w-4xl mx-auto font-sans"
        style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
      >
        
        {/* Top Branding Header */}
        <div className="flex items-center justify-between border-b-2 border-slate-200 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-sky-600 flex items-center justify-center text-white font-black text-xl shadow-md shrink-0">
              📚
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight leading-tight">
                Shala Sahayak
              </h2>
              <p className="text-xs text-sky-700 font-bold">
                हर स्कूल कार्य का स्मार्ट साथी
              </p>
            </div>
          </div>

          <div className="text-right">
            <div className="text-xs font-bold text-slate-500">
              {schoolProfile.schoolNameHindi || schoolProfile.schoolName || 'राजस्थान स्कूल शिक्षा विभाग'}
            </div>
            <div className="text-[11px] font-mono text-slate-400">
              UDISE: {schoolProfile.udiseCode || '08250012301'}
            </div>
          </div>
        </div>

        {/* Main Title Banner */}
        <div className="bg-sky-600 text-white text-center py-2.5 px-4 rounded-xl shadow-sm">
          <h1 className="text-lg sm:text-xl font-black tracking-wide">
            📅 शिविरा पंचांग: {currentMonthData.monthNameHindi}-{currentMonthData.year}
          </h1>
        </div>

        {/* 🗓️ CALENDAR GRID TABLE (MATCHING IMAGE 2 BLUE HEADER) */}
        <div className="overflow-hidden rounded-xl border border-slate-300 shadow-sm">
          <table className="w-full text-center border-collapse text-xs">
            <thead>
              <tr className="bg-[#005bb5] text-white font-black">
                <th className="py-2.5 px-1 border-r border-sky-700 w-[14.28%] text-rose-200">रविवार</th>
                <th className="py-2.5 px-1 border-r border-sky-700 w-[14.28%]">सोमवार</th>
                <th className="py-2.5 px-1 border-r border-sky-700 w-[14.28%]">मंगलवार</th>
                <th className="py-2.5 px-1 border-r border-sky-700 w-[14.28%]">बुधवार</th>
                <th className="py-2.5 px-1 border-r border-sky-700 w-[14.28%]">गुरुवार</th>
                <th className="py-2.5 px-1 border-r border-sky-700 w-[14.28%]">शुक्रवार</th>
                <th className="py-2.5 px-1 w-[14.28%]">शनिवार</th>
              </tr>
            </thead>
            <tbody>
              {calendarGrid.map((row, rIdx) => (
                <tr key={rIdx} className="border-b border-slate-200">
                  {row.map((dayNum, cIdx) => {
                    const isSunday = cIdx === 0;
                    const isHighlight = dayNum !== null && currentMonthData.highlightDates?.includes(dayNum);

                    return (
                      <td
                        key={cIdx}
                        className={`py-3 px-1 border-r border-slate-200 font-bold text-sm ${
                          dayNum === null ? 'bg-slate-50 text-slate-300' : ''
                        } ${isSunday ? 'text-rose-600 bg-rose-50/50' : ''} ${
                          isHighlight ? 'bg-emerald-100 text-emerald-900 font-black ring-1 ring-emerald-400' : ''
                        }`}
                      >
                        {dayNum || ''}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* SUMMARY COUNTER METRICS BAR (DIRECTLY BELOW TABLE LIKE IMAGE 2) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-100 p-2.5 rounded-xl border border-slate-200 text-xs text-center font-bold">
          <div className="flex items-center justify-center gap-1.5 text-slate-800">
            <span>📅</span>
            <span>कार्य दिवस: <strong className="text-blue-700 font-mono">{currentMonthData.workingDays}</strong></span>
          </div>
          <div className="flex items-center justify-center gap-1.5 text-slate-800">
            <span>🌂</span>
            <span>अवकाश: <strong className="text-rose-600 font-mono">{totalHolidaysCount}</strong></span>
          </div>
          <div className="flex items-center justify-center gap-1.5 text-slate-800">
            <span>👥</span>
            <span>विशेष कार्य दिवस: <strong className="text-emerald-700 font-mono">{totalSpecialWorkingDaysCount}</strong></span>
          </div>
          <div className="flex items-center justify-center gap-1.5 text-emerald-800">
            <span className="w-3 h-3 rounded bg-emerald-500 inline-block"></span>
            <span>विशेष दिवस</span>
          </div>
        </div>

        {/* TWO SECTION CARDS AT BOTTOM (MATCHING IMAGE 2 EXACTLY) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          
          {/* Left Card: 📅 अवकाश (Holidays) */}
          <div className="border border-slate-300 rounded-xl overflow-hidden shadow-sm flex flex-col">
            <div className="bg-[#005bb5] text-white px-3 py-2 font-black text-xs flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <span>📅</span>
                <span>अवकाश (Holidays)</span>
              </span>
              <span className="text-[10px] bg-sky-800 px-2 py-0.5 rounded font-mono">
                {currentMonthData.holidaysDetailed?.length || totalHolidaysCount}
              </span>
            </div>

            <div className="p-3 bg-white space-y-2 flex-1 text-xs">
              {currentMonthData.holidaysDetailed && currentMonthData.holidaysDetailed.length > 0 ? (
                currentMonthData.holidaysDetailed.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 pb-2 border-b border-slate-100 last:border-none">
                    <span className="bg-sky-100 text-[#005bb5] font-black px-2 py-1 rounded text-[11px] font-mono shrink-0 whitespace-nowrap border border-sky-200">
                      {item.date}
                    </span>
                    <span className="font-bold text-slate-800 leading-snug pt-0.5">
                      {item.title}
                    </span>
                  </div>
                ))
              ) : (
                currentMonthData.holidays.map((h, idx) => (
                  <div key={idx} className="flex items-center gap-2 py-1">
                    <span className="w-2 h-2 rounded-full bg-sky-600"></span>
                    <span className="font-semibold text-slate-700">{h}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Card: 📝 अन्य कार्य (सभी आवश्यक कार्य) */}
          <div className="border border-slate-300 rounded-xl overflow-hidden shadow-sm flex flex-col">
            <div className="bg-[#ea580c] text-white px-3 py-2 font-black text-xs flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <span>📝</span>
                <span>अन्य कार्य (सभी आवश्यक कार्य)</span>
              </span>
              <span className="text-[10px] bg-amber-800 px-2 py-0.5 rounded font-mono">
                {currentMonthData.departmentalTasksDetailed?.length || currentMonthData.deadlines.length}
              </span>
            </div>

            <div className="p-3 bg-white space-y-2 flex-1 text-xs max-h-[420px] overflow-y-auto">
              {currentMonthData.departmentalTasksDetailed && currentMonthData.departmentalTasksDetailed.length > 0 ? (
                currentMonthData.departmentalTasksDetailed.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 pb-2 border-b border-slate-100 last:border-none">
                    <span className="bg-amber-100 text-[#ea580c] font-black px-2 py-1 rounded text-[10px] font-mono shrink-0 whitespace-nowrap border border-amber-200">
                      {item.date}
                    </span>
                    <span className="font-semibold text-slate-800 leading-snug pt-0.5">
                      {item.title}
                    </span>
                  </div>
                ))
              ) : (
                currentMonthData.deadlines.map((evt, idx) => (
                  <div key={idx} className="flex items-start gap-2 pb-2 border-b border-slate-100 last:border-none">
                    <span className="bg-amber-100 text-[#ea580c] font-black px-2 py-1 rounded text-[10px] font-mono shrink-0">
                      {evt.date}
                    </span>
                    <span className="font-semibold text-slate-800">{evt.titleHindi}</span>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* Footer Branding Bar */}
        <div className="pt-2 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 font-bold gap-2">
          <div className="flex items-center gap-2 text-sky-700">
            <Globe className="w-3.5 h-3.5" />
            <span>shalasahayak.in</span>
          </div>
          <div>
            राजस्थान विद्यालय शिक्षा विभाग हेतु दैनिक टूल्स एवं शिविरा पंचांग
          </div>
        </div>

      </div>

    </div>
  );
};
