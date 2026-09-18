import React, { useState } from 'react';
import { Download, X, Smartphone, ShieldCheck } from 'lucide-react';
import { Language } from '../types';

interface PwaInstallBannerProps {
  onInstall: () => void;
  lang: Language;
}

export const PwaInstallBanner: React.FC<PwaInstallBannerProps> = ({ onInstall, lang }) => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 p-3 rounded-2xl shadow-lg border border-amber-300 flex items-center justify-between animate-fadeIn">
      <div className="flex items-center space-x-2.5">
        <div className="w-9 h-9 bg-white rounded-xl shadow-xs p-1 flex items-center justify-center shrink-0 border border-amber-300">
          <img src="/logo.svg" alt="Shala Sahayak App" className="w-full h-full object-contain" />
        </div>
        <div>
          <h4 className="font-extrabold text-xs leading-tight">
            {lang === 'hi' ? 'शाला सहायक ऐप इंस्टॉल करें' : 'Install Shala Sahayak App'}
          </h4>
          <p className="text-[10px] text-slate-800 font-medium">
            {lang === 'hi' ? 'बिना इंटरनेट ऑफलाइन एक्सेस व त्वरित होम स्क्रीन शॉर्टकट' : 'Works 100% offline with quick home screen launch'}
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-1.5 shrink-0">
        <button
          onClick={onInstall}
          className="px-3 py-1.5 rounded-xl bg-slate-950 text-amber-300 hover:bg-slate-900 font-bold text-xs flex items-center space-x-1 shadow-md transition-transform active:scale-95"
        >
          <Download className="w-3.5 h-3.5" />
          <span>{lang === 'hi' ? 'इंस्टॉल' : 'Install'}</span>
        </button>
        <button
          onClick={() => setDismissed(true)}
          className="p-1 rounded-lg text-slate-800 hover:text-slate-950 hover:bg-amber-300/60 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
