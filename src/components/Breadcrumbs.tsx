import React from 'react';
import { Home, ChevronRight, BookOpen } from 'lucide-react';

interface BreadcrumbsProps {
  category?: string;
  subtab?: string;
  subComponent?: string;
  currentView?: string;
  lang?: 'hi' | 'en';
  onNavigateHome: () => void;
  onNavigateCategory: (catId: string) => void;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  category,
  subtab,
  subComponent,
  currentView,
  lang = 'hi',
  onNavigateHome,
  onNavigateCategory
}) => {
  const getCategoryName = (cat: string) => {
    switch (cat) {
      case 'teacher': return lang === 'hi' ? 'शिक्षक टूलकिट' : 'Teacher Tools';
      case 'peeo': return lang === 'hi' ? 'PEEO प्रशासनिक' : 'PEEO Admin';
      case 'incharge': return lang === 'hi' ? 'प्रभारी कार्य' : 'Incharge Modules';
      case 'portals': return lang === 'hi' ? 'पोर्टल व वेतन' : 'Portals & Salary';
      case 'student': return lang === 'hi' ? 'छात्र कल्याण' : 'Student Welfare';
      default: return cat;
    }
  };

  const getSubtabName = (sub: string) => {
    switch (sub) {
      case 'pti': return lang === 'hi' ? 'शारीरिक शिक्षा (PTI)' : 'Physical Education (PTI)';
      case 'marksheet': return lang === 'hi' ? 'अंकतालिका व ग्रीन शीट' : 'Marksheet & Greensheet';
      case 'anomaly': return lang === 'hi' ? 'विसंगति ट्रैकर' : 'Anomaly Tracker';
      case 'diary': return lang === 'hi' ? 'दैनिक शिक्षक डायरी' : 'Teacher Diary';
      case 'library': return lang === 'hi' ? 'पुस्तकालय' : 'Library';
      case 'computer': return lang === 'hi' ? 'आईसीटी कंप्यूटर लैब' : 'ICT Computer Lab';
      case 'mdm': return lang === 'hi' ? 'मिड-डे मील & दूध' : 'Mid-Day Meal & Milk';
      case 'transport': return lang === 'hi' ? 'ट्रांसपोर्ट वाउचर' : 'Transport Voucher';
      case 'scholarship': return lang === 'hi' ? 'छात्रवृत्ति' : 'Scholarship';
      case 'exam': return lang === 'hi' ? 'परीक्षा सीटिंग रोस्टर' : 'Exam Seating Roster';
      case 'timetable': return lang === 'hi' ? 'समय-सारणी' : 'Time Table';
      case 'increment': return lang === 'hi' ? 'वेतन वृद्धि व 3% स्थिरीकरण' : 'Salary Increment';
      case 'substitution': return lang === 'hi' ? 'स्थानापन्न व्यवस्था' : 'Substitution Tracker';
      case 'apar': return lang === 'hi' ? 'APAR व IPR राजकाज' : 'APAR & IPR';
      case 'calculator': return lang === 'hi' ? 'वेतन कैलकुलेटर' : 'Salary Calculator';
      case 'formats': return lang === 'hi' ? 'विभागीय प्रपत्र' : 'Departmental Formats';
      default: return sub;
    }
  };

  const getSubComponentName = (comp: string) => {
    switch (comp) {
      case 'kridaShulk': return lang === 'hi' ? 'क्रीड़ा शुल्क प्रपत्र मेकर' : 'Sports Fee Maker';
      case 'healthBmi': return lang === 'hi' ? 'छात्र स्वास्थ्य BMI' : 'Student Health BMI';
      case 'sportsStock': return lang === 'hi' ? 'खेलकूद स्टॉक रजिस्टर' : 'Sports Stock Register';
      case 'ptGrading': return lang === 'hi' ? 'PT ग्रेडिंग कैलकुलेटर' : 'PT Grading Calculator';
      case 'verification': return lang === 'hi' ? 'आधार/जन-आधार विसंगति' : 'Aadhaar Verification';
      case 'catalogue': return lang === 'hi' ? 'पुस्तकालय कैटलॉग' : 'Library Catalogue';
      case 'equipmentStock': return lang === 'hi' ? 'ICT लैब स्टॉक' : 'ICT Lab Stock';
      default: return comp;
    }
  };

  return (
    <nav aria-label="Breadcrumb" className="bg-emerald-950/5 dark:bg-emerald-900/10 border-b border-emerald-900/10 dark:border-emerald-700/20 px-4 py-2.5 mb-4 rounded-xl">
      <ol className="flex items-center flex-wrap gap-1.5 text-xs font-semibold text-emerald-900 dark:text-emerald-300">
        <li>
          <button
            onClick={onNavigateHome}
            className="flex items-center gap-1 hover:text-emerald-700 dark:hover:text-emerald-200 transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span>{lang === 'hi' ? 'मुख्य पृष्ठ (Home)' : 'Home'}</span>
          </button>
        </li>

        {currentView === 'shivira' && (
          <>
            <ChevronRight className="w-3.5 h-3.5 opacity-60 text-emerald-800" />
            <li className="text-emerald-800 dark:text-emerald-200 font-bold">
              {lang === 'hi' ? 'शिविरा पंचांग 2026-27' : 'Shivira Panchang'}
            </li>
          </>
        )}

        {currentView === 'help' && (
          <>
            <ChevronRight className="w-3.5 h-3.5 opacity-60 text-emerald-800" />
            <li className="text-emerald-800 dark:text-emerald-200 font-bold">
              {lang === 'hi' ? 'सहायता केंद्र व गाइड' : 'Help & Guides'}
            </li>
          </>
        )}

        {currentView === 'invitation' && (
          <>
            <ChevronRight className="w-3.5 h-3.5 opacity-60 text-emerald-800" />
            <li className="text-emerald-800 dark:text-emerald-200 font-bold">
              {lang === 'hi' ? 'विद्यालय आमंत्रण पत्र मेकर' : 'School Invitation Maker'}
            </li>
          </>
        )}

        {category && (
          <>
            <ChevronRight className="w-3.5 h-3.5 opacity-60 text-emerald-800" />
            <li>
              <button
                onClick={() => onNavigateCategory(category)}
                className="hover:text-emerald-700 dark:hover:text-emerald-200 transition-colors"
              >
                {getCategoryName(category)}
              </button>
            </li>
          </>
        )}

        {subtab && (
          <>
            <ChevronRight className="w-3.5 h-3.5 opacity-60 text-emerald-800" />
            <li className={`${!subComponent ? 'text-emerald-800 dark:text-emerald-200 font-bold' : ''}`}>
              {getSubtabName(subtab)}
            </li>
          </>
        )}

        {subComponent && (
          <>
            <ChevronRight className="w-3.5 h-3.5 opacity-60 text-emerald-800" />
            <li className="text-emerald-800 dark:text-emerald-200 font-bold">
              {getSubComponentName(subComponent)}
            </li>
          </>
        )}
      </ol>
    </nav>
  );
};
