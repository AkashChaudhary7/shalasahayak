import React from 'react';
import { ArrowLeft, BookOpen, ShieldCheck, Sparkles, Award, Users, Heart } from 'lucide-react';
import { Language } from '../types';

interface AboutUsViewProps {
  lang: Language;
  onBack: () => void;
}

export const AboutUsView: React.FC<AboutUsViewProps> = ({ lang, onBack }) => {
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
          {isHi ? 'शाला सहायक के बारे में' : 'About Shala Sahayak'}
        </h1>
      </div>

      {/* Main Hero Card */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-8 shadow-xl border border-indigo-900/40 space-y-6">
        <div className="flex items-center space-x-3">
          <img src="/logo.svg" alt="Shala Sahayak Logo" className="w-12 h-12 object-contain" />
          <div>
            <h2 className="text-xl font-black tracking-wide text-white">SHALA SAHAYAK (शाला सहायक)</h2>
            <p className="text-xs font-bold text-emerald-400">
              {isHi ? 'राजस्थान शिक्षा विभाग डिजिटल सहायक मंच' : 'Digital Platform for Rajasthan Education Department'}
            </p>
          </div>
        </div>

        <p className="text-slate-300 leading-relaxed text-sm">
          {isHi
            ? 'शाला सहायक (Shala Sahayak) राजस्थान शिक्षा विभाग के समस्त शिक्षकों, संस्थाप्रधानों, PEEO/DDO प्रभारियों एवं कार्यालय कर्मियों हेतु विकसित एक अत्याधुनिक डिजिटल टूलकिट है। इसका उद्देश्य विभागीय प्रक्रियाओं, प्रपत्र निर्माण, पे-मैट्रिक्स गणनाओं एवं अकादमिक रिकॉर्ड संधारण को सरल, त्वरित और 100% सटीक बनाना है।'
            : 'Shala Sahayak is a state-of-the-art digital toolkit engineered specifically for Rajasthan Education Department teachers, Headmasters, PEEO/DDO officers, and administrative staff. Designed to simplify departmental workflows, document creation, Pay Matrix calculations, and academic reporting.'}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/60 space-y-1">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            <h3 className="font-extrabold text-sm text-white">{isHi ? '100% सुरक्षित एवं निजी' : '100% Private & Secure'}</h3>
            <p className="text-xs text-slate-400">{isHi ? 'सभी डेटा आपकी लोकल डिवाइस में सुरक्षित रहता है' : 'All data stays completely on your local device'}</p>
          </div>

          <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/60 space-y-1">
            <Sparkles className="w-6 h-6 text-amber-400" />
            <h3 className="font-extrabold text-sm text-white">{isHi ? 'त्वरित प्रपत्र जनरेटर' : 'Instant Form Maker'}</h3>
            <p className="text-xs text-slate-400">{isHi ? 'क्रीड़ा शुल्क, कार्यालय आदेश व परीक्षा रिकॉर्ड बनाएं' : 'Krida Shulk, Office Orders & Exam Records'}</p>
          </div>

          <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/60 space-y-1">
            <Award className="w-6 h-6 text-indigo-400" />
            <h3 className="font-extrabold text-sm text-white">{isHi ? 'शिविरा पंचांग सम्बद्ध' : 'Shivira Aligned'}</h3>
            <p className="text-xs text-slate-400">{isHi ? 'अकादमिक एवं विभागीय निर्देशों का पूर्ण पालन' : 'Full compliance with official departmental rules'}</p>
          </div>
        </div>
      </div>

      {/* Features Overview */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 space-y-6">
        <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <span>{isHi ? 'प्रमुख विशेषताएं एवं मॉड्यूल' : 'Core Features & Modules'}</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div className="space-y-2">
            <h4 className="font-extrabold text-slate-800 dark:text-slate-200">{isHi ? '1. क्रीड़ा शुल्क विवरण प्रपत्र मेकर' : '1. Krida Shulk Form Maker'}</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {isHi
                ? 'कक्षा 6 से 12 तक के विद्यार्थियों के खेलकूद शुल्क की ऑटो-गणना, सामान्य व आरक्षित दर विभाजन एवं PEEO लेटरहेड रसीद जनरेशन।'
                : 'Auto-calculation of sports fee remittance for Classes 6-12 with general/reserved rate breakdown and official PEEO receipt generation.'}
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-extrabold text-slate-800 dark:text-slate-200">{isHi ? '2. PEEO / DDO प्रशासनिक सहायिका' : '2. PEEO / DDO Administrative Suite'}</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {isHi
                ? 'कार्य प्रभारी आवंटन आदेश, संयुक्त वेतन वृद्धि (Joint Increment Order), एवं आधिकारिक लेटरहेड प्रपत्र।'
                : 'Institutional work distribution orders, Joint Salary Increment calculators, and official departmental letterheads.'}
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-extrabold text-slate-800 dark:text-slate-200">{isHi ? '3. परीक्षा एवं मार्कशीट टूल' : '3. Exam & Marksheet Hub'}</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {isHi
                ? 'विषयवार समेकित ग्रीनशीट, छात्र सत्यापन प्रपत्र एवं परीक्षा सिटिंग प्लान।'
                : 'Subject Greensheets, student verification checklists, and automated exam seating arrangements.'}
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-extrabold text-slate-800 dark:text-slate-200">{isHi ? '4. शिविरा कैलेंडर व पे-मैट्रिक्स' : '4. Shivira Calendar & Pay Matrix'}</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {isHi
                ? 'अकादमिक शिविरा पंचांग 2026-27, 7th Pay Commission वेतन कैलकुलेटर एवं पेंशन गणना।'
                : 'Academic Shivira Calendar 2026-27, 7th Pay Commission salary calculators, and pension estimators.'}
            </p>
          </div>
        </div>
      </div>

      {/* Community Footer */}
      <div className="bg-slate-100 dark:bg-slate-800/60 rounded-3xl p-6 text-center space-y-3">
        <Users className="w-8 h-8 text-indigo-600 dark:text-indigo-400 mx-auto" />
        <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
          {isHi ? 'राजस्थान के शिक्षकों द्वारा, शिक्षकों के लिए निर्मित' : 'Built by Teachers, For Teachers across Rajasthan'}
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
          {isHi
            ? 'शााला सहायक मंच निरंतर अपडेट होता है। आपकी बहुमूल्य प्रतिक्रिया एवं सुझाव हमें और बेहतर बनाने में सहायता करते हैं।'
            : 'Shala Sahayak is continuously updated. Your feedback and recommendations help us serve Rajasthan education community better.'}
        </p>
      </div>
    </div>
  );
};
