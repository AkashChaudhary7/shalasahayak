import React, { useState } from 'react';
import { ScreenshotPlaceholderData, Language } from '../types';
import {
  Monitor,
  Maximize2,
  Minimize2,
  CheckCircle,
  Sparkles,
  MousePointer,
  Layers,
  FileText,
  Calendar as CalendarIcon,
  Table,
  SlidersHorizontal,
  X
} from 'lucide-react';

interface ScreenshotMockupProps {
  data: ScreenshotPlaceholderData;
  lang: Language;
}

export const ScreenshotMockup: React.FC<ScreenshotMockupProps> = ({ data, lang }) => {
  const [isZoomed, setIsZoomed] = useState(false);

  const caption = lang === 'hi' ? data.captionHi : data.captionEn;
  const subCaption = lang === 'hi' ? data.captionEn : data.captionHi;

  const renderMockupContent = () => {
    switch (data.type) {
      case 'form_input':
        return (
          <div className="space-y-3.5 p-3 sm:p-4 bg-slate-900/90 dark:bg-slate-950 text-slate-100 rounded-xl font-mono text-xs border border-slate-700/60 shadow-inner">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                {lang === 'hi' ? 'फॉर्म प्रविष्टि फ़ील्ड्स (Form Inputs)' : 'Form Control Fields'}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-sans font-bold border border-emerald-500/30">
                Live Interactive Mockup
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {data.mockupData.fields?.map((field, idx) => (
                <div
                  key={idx}
                  className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700/80 space-y-1 hover:border-emerald-500/50 transition-colors"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 font-sans font-semibold">{field.label}</span>
                    {field.status && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 font-bold border border-emerald-800/80">
                        {field.status}
                      </span>
                    )}
                  </div>
                  <div className="text-xs font-black text-amber-300 bg-slate-900/90 px-2 py-1 rounded border border-slate-700/90 flex items-center justify-between">
                    <span>{field.value}</span>
                    <CheckCircle className="w-3 h-3 text-emerald-400 shrink-0" />
                  </div>
                </div>
              ))}
            </div>

            {data.mockupData.actionButton && (
              <div className="pt-2 flex justify-end">
                <div className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-sans font-extrabold text-xs flex items-center gap-2 shadow-lg ring-2 ring-emerald-400/30 animate-pulse">
                  <MousePointer className="w-3.5 h-3.5 text-amber-300" />
                  <span>{data.mockupData.actionButton}</span>
                </div>
              </div>
            )}
          </div>
        );

      case 'dashboard_selector':
        return (
          <div className="p-3 sm:p-4 bg-slate-900 text-slate-100 rounded-xl space-y-3 font-sans border border-slate-800">
            <div className="text-xs font-bold text-slate-300 flex items-center gap-2 border-b border-slate-800 pb-2">
              <Layers className="w-4 h-4 text-sky-400" />
              <span>
                {lang === 'hi' ? 'मॉड्यूल एवं श्रेणी चयन' : 'Module Category Selector'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {data.mockupData.categories?.map((cat, idx) => {
                const isSelected = idx === (data.mockupData.highlightIndex ?? 0);
                return (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      isSelected
                        ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200 ring-2 ring-emerald-500/40 shadow-lg scale-[1.02]'
                        : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <span className="text-[10px] font-bold block opacity-75">Option {idx + 1}</span>
                    <span className="text-xs font-black block mt-1">{cat}</span>
                    {isSelected && (
                      <span className="mt-1 inline-block text-[9px] px-1.5 py-0.5 rounded bg-emerald-500 text-slate-950 font-black">
                        SELECTED
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 'report_grid':
        return (
          <div className="p-3 bg-slate-950 text-slate-100 rounded-xl space-y-2 border border-slate-800 font-sans overflow-x-auto">
            <div className="flex items-center justify-between text-xs font-bold text-amber-400 pb-1 border-b border-slate-800">
              <span className="flex items-center gap-1.5">
                <Table className="w-4 h-4 text-amber-400" />
                {lang === 'hi' ? 'लाइव रिपोर्ट डेटा ग्रिड' : 'Live Report Data Grid'}
              </span>
              <span className="text-[10px] text-slate-400">Formatted Output</span>
            </div>

            <table className="w-full text-left text-[11px] border-collapse">
              <thead>
                <tr className="bg-slate-800 text-slate-200 border-b border-slate-700">
                  {data.mockupData.headers?.map((h, idx) => (
                    <th key={idx} className="p-2 font-black text-emerald-400">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {data.mockupData.rows?.map((row, rIdx) => (
                  <tr key={rIdx} className={rIdx % 2 === 0 ? 'bg-slate-900/60' : 'bg-slate-900/20'}>
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="p-2 font-medium text-slate-300">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 'preview_card':
        return (
          <div className="p-4 bg-slate-900 text-slate-100 rounded-xl space-y-3 border border-slate-800 font-sans">
            <div className="p-4 bg-white text-slate-900 rounded-lg shadow-xl space-y-2 border-2 border-emerald-500/40 relative overflow-hidden">
              <div className="bg-emerald-800 text-white p-2 rounded text-center font-black text-xs sm:text-sm tracking-wide">
                {data.mockupData.headerText}
              </div>

              <div className="text-xs text-slate-700 font-bold p-2 bg-slate-50 rounded border border-slate-200">
                {data.mockupData.subject}
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-200 font-mono">
                <span>PEEO / Headmaster Seal & Sign Block</span>
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-extrabold text-[10px]">
                  {data.mockupData.status}
                </span>
              </div>
            </div>
          </div>
        );

      case 'calendar_view':
        return (
          <div className="p-4 bg-slate-900 text-slate-100 rounded-xl space-y-3 border border-slate-800 font-sans">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-black text-sky-400 flex items-center gap-1.5">
                <CalendarIcon className="w-4 h-4 text-sky-400" />
                <span>{data.mockupData.month}</span>
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800">
                Official Shivira Dates
              </span>
            </div>

            <div className="space-y-2">
              {data.mockupData.events?.map((ev, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg bg-slate-800/90 border border-slate-700 flex items-center justify-between text-xs"
                >
                  <span className="font-extrabold text-amber-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                    {ev.date}
                  </span>
                  <span className="font-bold text-slate-200 flex-1 ml-3">{ev.title}</span>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="my-3 space-y-2">
      {/* WINDOW CONTAINER MOCKUP */}
      <div className="bg-slate-950 rounded-2xl border-2 border-slate-800 shadow-2xl overflow-hidden transition-all duration-200 hover:border-emerald-600/60 group">
        
        {/* OS TITLE BAR */}
        <div className="bg-slate-900 px-3 py-2 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 select-none">
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
            </div>
            <span className="text-[11px] font-mono text-slate-400 font-bold ml-2 truncate max-w-[200px] sm:max-w-xs">
              {data.windowTitle}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono bg-slate-800 px-2 py-0.5 rounded text-emerald-400 border border-slate-700">
              <Monitor className="w-3 h-3 text-emerald-400" />
              <span>UI Screenshot Preview</span>
            </span>

            <button
              onClick={() => setIsZoomed(!isZoomed)}
              className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
              title="स्क्रीनशॉट बड़ा करें / Inspect"
            >
              {isZoomed ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* SCREENSHOT MOCKUP CANVAS CONTENT */}
        <div className="p-3 sm:p-4 bg-slate-950 relative">
          {renderMockupContent()}
        </div>

        {/* CAPTION BAR */}
        <div className="bg-slate-900 px-3.5 py-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-200">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="line-clamp-1">{caption}</span>
          </div>

          <span className="text-[10px] text-slate-500 font-mono shrink-0 hidden sm:inline">
            {subCaption}
          </span>
        </div>
      </div>

      {/* FULLSCREEN INSPECT MODAL */}
      {isZoomed && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md p-4 sm:p-8 flex items-center justify-center animate-in fade-in duration-200">
          <div className="bg-slate-900 border-2 border-emerald-500/80 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-4 relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-2">
                <Monitor className="w-6 h-6 text-emerald-400" />
                <h3 className="text-lg font-black text-white">{data.windowTitle}</h3>
              </div>
              <button
                onClick={() => setIsZoomed(false)}
                className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-2">
              {renderMockupContent()}
            </div>

            <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-700/60 text-xs text-emerald-200 space-y-1">
              <p className="font-extrabold flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>{caption}</span>
              </p>
              <p className="text-slate-400 font-medium">{subCaption}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
