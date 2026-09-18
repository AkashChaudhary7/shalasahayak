import React from 'react';
import { BookOpen, Award, Calculator, Users, FileText, CheckCircle, ArrowRight, Shield, Zap, Sparkles } from 'lucide-react';

interface TeacherResourceHubProps {
  lang: 'hi' | 'en';
  onSelectTool: (toolId: string) => void;
  onSelectCategory: (catId: string) => void;
}

export const TeacherResourceHub: React.FC<TeacherResourceHubProps> = ({
  lang,
  onSelectTool,
  onSelectCategory
}) => {
  const isHi = lang === 'hi';

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-10 animate-fade-in">
      {/* Pillar Page Header */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-emerald-700/60 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider text-emerald-100 border border-emerald-500/30">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            {isHi ? 'राजस्थान शिक्षा विभाग मास्टर पिलर हब' : 'Rajasthan Education Master Pillar Hub'}
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
            {isHi 
              ? 'शाला सहायक (Shala Sahayak) - शिक्षकों व PEEO हेतु संपूर्ण डिजिटल टूलकिट' 
              : 'Shala Sahayak - Complete Digital Toolkit for Teachers & PEEOs'}
          </h1>
          <p className="text-emerald-100/90 text-base md:text-lg leading-relaxed">
            {isHi
              ? 'राजस्थान के राजकीय विद्यालयों, शिक्षकों, शारीरिक शिक्षकों (PTI), परीक्षा प्रभारियों व MDM संयोजकों के लिए शाला दर्पण, क्रीड़ा शुल्क, वेतन निर्धारण और प्रशासनिक रिकॉर्ड का एकमात्र प्रामाणिक केंद्र।'
              : 'The ultimate authentic hub for Rajasthan government school teachers, PTIs, exam incharges, and MDM coordinators for Shala Darpan workflows, sports fee calculations, pay matrix fixes, and administrative records.'}
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={() => onSelectTool('krida-shulk')}
              className="bg-amber-400 hover:bg-amber-500 text-emerald-950 font-bold px-6 py-3 rounded-xl shadow-lg transition-all flex items-center gap-2 text-sm"
            >
              <span>{isHi ? 'क्रीड़ा शुल्क प्रपत्र मेकर' : 'Krida Shulk Maker'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onSelectCategory('peeo')}
              className="bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-xl backdrop-blur-sm border border-white/25 transition-all text-sm"
            >
              <span>{isHi ? 'PEEO प्रशासनिक टूलकिट' : 'PEEO Admin Toolkit'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Hub & Spoke Core Authority Modules */}
      <div className="space-y-6">
        <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            <span>{isHi ? 'प्रमुख विषय श्रेणियाँ (Spoke Hubs)' : 'Core Spoke Hubs & Modules'}</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
            {isHi ? 'इन हब के माध्यम से आप सीधे विशिष्ट विभागीय और शाला दर्पण टूल्स तक पहुँच सकते हैं।' : 'Access specialized departmental and Shala Darpan workflows instantly through these topic hubs.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Spoke 1: PTI & Sports */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {isHi ? 'शारीरिक शिक्षा & क्रीड़ा (PTI Hub)' : 'PTI & Sports Spoke Hub'}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                {isHi
                  ? 'क्रीड़ा शुल्क विवरण प्रपत्र (प्रारूप क व ख) ऑनलाइन मेकर, खेलकूद सामग्री स्टॉक रजिस्टर, छात्र स्वास्थ्य BMI कैलकुलेटर और PT ग्रेडिंग। यहाँ से आप सीधे क्रीड़ा शुल्क प्रपत्र तैयार कर सकते हैं।'
                  : 'Includes Krida Shulk Maker (Form A & B), sports stock register, student health BMI calculator, and PT grading sheets.'}
              </p>
            </div>
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => onSelectTool('krida-shulk')}
                className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 font-bold text-sm transition-colors"
              >
                <span>{isHi ? 'क्रीड़ा शुल्क प्रपत्र खोलें' : 'Open Krida Shulk Maker'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Spoke 2: PEEO & Admin */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {isHi ? 'PEEO प्रशासनिक एवं आदेश हब' : 'PEEO Admin & Orders Spoke'}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                {isHi
                  ? 'कार्यालय आदेश जनरेटर, कार्यमुक्ति एवं कार्यग्रहण प्रमाण पत्र, वार्षिक वेतन वृद्धि (3% Increment) गणना, समय-सारणी निर्माण और राजकाज APAR स्थिति ट्रैकर।'
                  : 'Office order generators, relieving letters, 3% annual salary increment calculations, time tables, and APAR/IPR tracking.'}
              </p>
            </div>
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => onSelectCategory('peeo')}
                className="inline-flex items-center gap-1.5 text-blue-600 dark:text-blue-400 hover:text-blue-700 font-bold text-sm transition-colors"
              >
                <span>{isHi ? 'PEEO टूल्स देखें' : 'View PEEO Tools'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Spoke 3: Teacher & Mid-Day Meal */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center text-amber-600 dark:text-amber-400 font-bold">
                <Calculator className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {isHi ? 'शिक्षक डायरी & MDM कैलकुलेटर' : 'Teacher Diary & MDM Spoke'}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                {isHi
                  ? 'दैनिक मिड-डे मील खाद्यान्न खपत, बाल गोपाल दूध योजना मात्रा, शिक्षक दैनिक डायरी, ग्रीन शीट जनरेटर और आधार विसंगति ट्रैकर।'
                  : 'Daily mid-day meal grain consumption, Bal Gopal milk calculations, teacher daily diary, and greensheet generator.'}
              </p>
            </div>
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => onSelectCategory('teacher')}
                className="inline-flex items-center gap-1.5 text-amber-600 dark:text-amber-400 hover:text-amber-700 font-bold text-sm transition-colors"
              >
                <span>{isHi ? 'शिक्षक टूल्स देखें' : 'View Teacher Tools'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Frequently Asked Questions (FAQ Section with Schema support) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Shield className="w-6 h-6 text-emerald-600" />
          <span>{isHi ? 'अक्सर पूछे जाने वाले प्रश्न (FAQ)' : 'Frequently Asked Questions'}</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 dark:text-white text-base">
              {isHi ? '1. क्रीड़ा शुल्क प्रपत्र (Sports Fee Form) कैसे भरें?' : '1. How to fill the Krida Shulk Form?'}
            </h4>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              {isHi
                ? 'क्रीड़ा शुल्क मेकर में अपने स्कूल की कक्षावार छात्र और छात्रा संख्या दर्ज करें। टूल स्वतः प्रारूप क व ख के नियमों के अनुसार राशि गणना करके एक क्लिक में आधिकारिक पीडीएफ प्रिंट तैयार कर देता है।'
                : 'Enter class-wise student and female student numbers in the Krida Shulk Maker. The tool automatically computes fees according to Form A & B rules and generates an official printable PDF.'}
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 dark:text-white text-base">
              {isHi ? '2. शाला सहायक (Shala Sahayak) पर क्या-क्या सुविधाएँ हैं?' : '2. What features are available on Shala Sahayak?'}
            </h4>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              {isHi
                ? 'यहाँ शाला दर्पण प्रविष्टियाँ, PEEO आदेश, मिड-डे मील और बाल गोपाल दूध कैलकुलेटर, 7th Pay Matrix वेतन वृद्धि, परीक्षा सीटिंग अरेंजमेंट और शिविरा पंचांग 2026-27 जैसी सभी सुविधाएँ निःशुल्क उपलब्ध हैं।'
                : 'All features including Shala Darpan entries, PEEO orders, MDM & Bal Gopal milk calculators, 7th Pay Matrix salary increments, and Shivira Panchang are available for free.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
