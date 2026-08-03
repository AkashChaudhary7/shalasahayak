import React from 'react';
import { ArrowLeft, Mail, Send, MessageSquare, ShieldCheck, MapPin, PhoneCall, HelpCircle } from 'lucide-react';
import { Language } from '../types';

interface ContactUsViewProps {
  lang: Language;
  onBack: () => void;
  onOpenFeedback: () => void;
}

export const ContactUsView: React.FC<ContactUsViewProps> = ({ lang, onBack, onOpenFeedback }) => {
  const isHi = lang === 'hi';

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-card-entrance space-y-8">
      {/* Back Button and Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <button
          onClick={onBack}
          className="inline-flex items-center space-x-2 text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors w-fit cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{isHi ? 'मुख्य डैशबोर्ड पर लौटें' : 'Back to Dashboard'}</span>
        </button>

        <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
          {isHi ? 'संपर्क एवं सहायता (Contact Us)' : 'Contact Us & Support'}
        </h1>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contact Info Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 space-y-6 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <PhoneCall className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-extrabold text-base text-slate-900 dark:text-white">
                {isHi ? 'संपर्क केंद्र' : 'Support Desk'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isHi ? 'शााला सहायक डिजिटल टीम' : 'Shala Sahayak Web Team'}
              </p>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div className="flex items-start space-x-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
              <Mail className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200 block">{isHi ? 'ई-मेल सहायता' : 'Email Support'}</span>
                <a href="mailto:support@shalasahayak.in" className="text-emerald-600 dark:text-emerald-400 font-mono font-bold hover:underline">
                  support@shalasahayak.in
                </a>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
              <Send className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200 block">{isHi ? 'टेलीग्राम चैनल' : 'Telegram Channel'}</span>
                <a href="https://t.me/rajasthan_education_news" target="_blank" rel="noopener noreferrer" className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline">
                  t.me/rajasthan_education_news
                </a>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
              <MapPin className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200 block">{isHi ? 'स्थान' : 'Location'}</span>
                <p className="text-slate-600 dark:text-slate-400">
                  {isHi ? 'जयपुर / उदयपुर, राजस्थान (भारत)' : 'Jaipur / Udaipur, Rajasthan (India)'}
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 text-xs space-y-1">
            <div className="flex items-center space-x-1.5 font-bold text-emerald-800 dark:text-emerald-300">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>{isHi ? 'गोपनीयता आश्वासन' : 'Privacy Assured'}</span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[11px]">
              {isHi
                ? 'शाला सहायक टीम आपसे कभी भी गोपनीय पासवर्ड या व्यक्तिगत बैंक खाता विवरण नहीं मांगती।'
                : 'Shala Sahayak team will never ask for confidential passwords or bank details.'}
            </p>
          </div>
        </div>

        {/* Action & Feedback Box */}
        <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-3xl p-6 md:p-8 space-y-6 shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="p-3 rounded-2xl bg-indigo-900/60 w-fit text-amber-400">
              <MessageSquare className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-black text-white">
              {isHi ? 'सुझाव या त्रुटि की सूचना दें' : 'Submit Feedback or Report Bug'}
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed">
              {isHi
                ? 'यदि आप किसी नए मॉड्यूल या प्रपत्र का सुझाव देना चाहते हैं या ऐप में सुधार का सुझाव है, तो सीधे फीडबैक फॉर्म द्वारा भेजें।'
                : 'If you want to suggest a new module, report an issue, or request a feature, please use our quick feedback form.'}
            </p>
          </div>

          <div className="space-y-3 pt-4">
            <button
              onClick={onOpenFeedback}
              className="w-full py-3 px-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center justify-center space-x-2 shadow-lg transition-all cursor-pointer active:scale-95"
            >
              <MessageSquare className="w-4 h-4" />
              <span>{isHi ? 'सुझाव फॉर्म खोलें' : 'Open Feedback Form'}</span>
            </button>

            <a
              href="https://t.me/rajasthan_education_news"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-2xl bg-emerald-700 hover:bg-emerald-600 text-white font-black text-xs flex items-center justify-center space-x-2 shadow-lg transition-all"
            >
              <Send className="w-4 h-4 text-amber-300" />
              <span>{isHi ? 'टेलीग्राम पर जुड़ें' : 'Join Telegram Community'}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
