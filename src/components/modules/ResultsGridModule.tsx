import React, { useState } from 'react';
import { Language, SchoolProfile, StudentResult } from '../../types';
import { ThreeDCard } from '../ThreeDIcon';
import {
  Award,
  Search,
  Printer,
  ChevronLeft,
  GraduationCap,
  Sparkles,
  BookOpen,
  Filter,
  CheckCircle2,
  FileSpreadsheet,
  Download,
  ShieldCheck,
  UserCheck,
  FileText
} from 'lucide-react';

interface ResultsGridModuleProps {
  schoolProfile: SchoolProfile;
  students?: StudentResult[];
  lang: Language;
  onBack?: () => void;
}

type BoardClass = '5' | '8' | '10' | '12' | null;

interface BoardStudent {
  rollNo: string;
  enrolmentNo: string;
  name: string;
  fatherName: string;
  motherName: string;
  gender: string;
  category: string;
  stream?: string; // For class 12
  schoolName: string;
  udiseCode: string;
  subjects: {
    name: string;
    maxMarks: number;
    sessionalMarks: number;
    theoryMarks: number;
    practicalMarks?: number;
    obtainedMarks: number;
    grade: string;
  }[];
  totalMax: number;
  totalObtained: number;
  percentage: number;
  resultStatus: string;
  division: string;
}

export const ResultsGridModule: React.FC<ResultsGridModuleProps> = ({
  schoolProfile,
  students = [],
  lang,
  onBack
}) => {
  const [selectedBoardClass, setSelectedBoardClass] = useState<BoardClass>(null);
  const [selectedStream12, setSelectedStream12] = useState<'Science' | 'Commerce' | 'Arts'>('Science');
  const [searchRollNo, setSearchRollNo] = useState<string>('');
  const [selectedStudentForMarksheet, setSelectedStudentForMarksheet] = useState<BoardStudent | null>(null);

  // Mock Board Data Generator for Rajasthan Education Department
  const getMockBoardStudents = (cls: '5' | '8' | '10' | '12'): BoardStudent[] => {
    if (cls === '5') {
      return [
        {
          rollNo: '50101',
          enrolmentNo: 'RJ5002026/01',
          name: 'अमन शर्मा',
          fatherName: 'सुरेश शर्मा',
          motherName: 'सुनीता देवी',
          gender: 'पुं',
          category: 'सामान्य',
          schoolName: schoolProfile.schoolName || 'राजकीय उच्च प्राथमिक विद्यालय',
          udiseCode: schoolProfile.udiseCode || '08250012301',
          subjects: [
            { name: 'हिंदी (Hindi)', maxMarks: 100, sessionalMarks: 20, theoryMarks: 72, obtainedMarks: 92, grade: 'A+' },
            { name: 'अंग्रेजी (English)', maxMarks: 100, sessionalMarks: 19, theoryMarks: 68, obtainedMarks: 87, grade: 'A+' },
            { name: 'गणित (Mathematics)', maxMarks: 100, sessionalMarks: 20, theoryMarks: 75, obtainedMarks: 95, grade: 'A+' },
            { name: 'पर्यावरण अध्ययन (EVS)', maxMarks: 100, sessionalMarks: 20, theoryMarks: 70, obtainedMarks: 90, grade: 'A+' },
            { name: 'तृतीय भाषा संस्कृत (Sanskrit)', maxMarks: 100, sessionalMarks: 18, theoryMarks: 66, obtainedMarks: 84, grade: 'A' }
          ],
          totalMax: 500,
          totalObtained: 448,
          percentage: 89.6,
          resultStatus: 'उत्तीर्ण (PROMOTED)',
          division: 'A+ ग्रेड'
        },
        {
          rollNo: '50102',
          enrolmentNo: 'RJ5002026/02',
          name: 'पूजा कुमारी',
          fatherName: 'रामनिवास प्रजापत',
          motherName: 'कमला देवी',
          gender: 'स्त्री',
          category: 'ओबीसी',
          schoolName: schoolProfile.schoolName || 'राजकीय उच्च प्राथमिक विद्यालय',
          udiseCode: schoolProfile.udiseCode || '08250012301',
          subjects: [
            { name: 'हिंदी (Hindi)', maxMarks: 100, sessionalMarks: 18, theoryMarks: 64, obtainedMarks: 82, grade: 'A' },
            { name: 'अंग्रेजी (English)', maxMarks: 100, sessionalMarks: 17, theoryMarks: 60, obtainedMarks: 77, grade: 'A' },
            { name: 'गणित (Mathematics)', maxMarks: 100, sessionalMarks: 19, theoryMarks: 71, obtainedMarks: 90, grade: 'A+' },
            { name: 'पर्यावरण अध्ययन (EVS)', maxMarks: 100, sessionalMarks: 18, theoryMarks: 65, obtainedMarks: 83, grade: 'A' },
            { name: 'तृतीय भाषा संस्कृत (Sanskrit)', maxMarks: 100, sessionalMarks: 17, theoryMarks: 58, obtainedMarks: 75, grade: 'B' }
          ],
          totalMax: 500,
          totalObtained: 407,
          percentage: 81.4,
          resultStatus: 'उत्तीर्ण (PROMOTED)',
          division: 'A ग्रेड'
        }
      ];
    }

    if (cls === '8') {
      return [
        {
          rollNo: '80201',
          enrolmentNo: 'RJ8002026/101',
          name: 'राहुल मीणा',
          fatherName: 'किरोड़ी लाल मीणा',
          motherName: 'मंगला देवी',
          gender: 'पुं',
          category: 'एसटी',
          schoolName: schoolProfile.schoolName || 'राजकीय उच्च माध्यमिक विद्यालय',
          udiseCode: schoolProfile.udiseCode || '08250012301',
          subjects: [
            { name: 'हिंदी (Hindi)', maxMarks: 100, sessionalMarks: 20, theoryMarks: 70, obtainedMarks: 90, grade: 'A+' },
            { name: 'अंग्रेजी (English)', maxMarks: 100, sessionalMarks: 18, theoryMarks: 62, obtainedMarks: 80, grade: 'A' },
            { name: 'विज्ञान (Science)', maxMarks: 100, sessionalMarks: 20, theoryMarks: 72, obtainedMarks: 92, grade: 'A+' },
            { name: 'सामाजिक विज्ञान (Social Sci.)', maxMarks: 100, sessionalMarks: 19, theoryMarks: 66, obtainedMarks: 85, grade: 'A+' },
            { name: 'गणित (Mathematics)', maxMarks: 100, sessionalMarks: 20, theoryMarks: 74, obtainedMarks: 94, grade: 'A+' },
            { name: 'तृतीय भाषा तृतीय (Sanskrit)', maxMarks: 100, sessionalMarks: 19, theoryMarks: 68, obtainedMarks: 87, grade: 'A+' }
          ],
          totalMax: 600,
          totalObtained: 528,
          percentage: 88.0,
          resultStatus: 'उत्तीर्ण (PASSED)',
          division: 'A+ ग्रेड'
        }
      ];
    }

    if (cls === '10') {
      return [
        {
          rollNo: '100451',
          enrolmentNo: 'BSER/2026/100451',
          name: 'दीपक सैनी',
          fatherName: 'हनुमान सहाय सैनी',
          motherName: 'गायत्री देवी',
          gender: 'पुं',
          category: 'ओबीसी',
          schoolName: schoolProfile.schoolName || 'राजकीय उच्च माध्यमिक विद्यालय',
          udiseCode: schoolProfile.udiseCode || '08250012301',
          subjects: [
            { name: 'हिंदी (Hindi)', maxMarks: 100, sessionalMarks: 20, theoryMarks: 71, obtainedMarks: 91, grade: 'A+' },
            { name: 'अंग्रेजी (English)', maxMarks: 100, sessionalMarks: 20, theoryMarks: 68, obtainedMarks: 88, grade: 'A+' },
            { name: 'विज्ञान (Science)', maxMarks: 100, sessionalMarks: 20, theoryMarks: 73, obtainedMarks: 93, grade: 'A+' },
            { name: 'सामाजिक विज्ञान (Social Science)', maxMarks: 100, sessionalMarks: 19, theoryMarks: 65, obtainedMarks: 84, grade: 'A' },
            { name: 'गणित (Mathematics)', maxMarks: 100, sessionalMarks: 20, theoryMarks: 76, obtainedMarks: 96, grade: 'A+' },
            { name: 'संस्कृत (Sanskrit)', maxMarks: 100, sessionalMarks: 20, theoryMarks: 70, obtainedMarks: 90, grade: 'A+' }
          ],
          totalMax: 600,
          totalObtained: 542,
          percentage: 90.33,
          resultStatus: 'प्रथम श्रेणी (FIRST DIV WITH DISTINCTION)',
          division: 'प्रथम श्रेणी (Distinction)'
        }
      ];
    }

    // Class 12
    return [
      {
        rollNo: '120781',
        enrolmentNo: 'BSER/2026/120781',
        name: 'प्रिया राठौड़',
        fatherName: 'विक्रम सिंह राठौड़',
        motherName: 'सुशीला कंवर',
        gender: 'स्त्री',
        category: 'सामान्य',
        stream: selectedStream12,
        schoolName: schoolProfile.schoolName || 'राजकीय उच्च माध्यमिक विद्यालय',
        udiseCode: schoolProfile.udiseCode || '08250012301',
        subjects: selectedStream12 === 'Science' ? [
          { name: 'अनिवार्य हिंदी', maxMarks: 100, sessionalMarks: 20, theoryMarks: 72, obtainedMarks: 92, grade: 'A+' },
          { name: 'अनिवार्य अंग्रेजी', maxMarks: 100, sessionalMarks: 20, theoryMarks: 70, obtainedMarks: 90, grade: 'A+' },
          { name: 'भौतिक विज्ञान (Physics)', maxMarks: 100, sessionalMarks: 14, theoryMarks: 52, practicalMarks: 29, obtainedMarks: 95, grade: 'A+' },
          { name: 'रसायन विज्ञान (Chemistry)', maxMarks: 100, sessionalMarks: 14, theoryMarks: 50, practicalMarks: 29, obtainedMarks: 93, grade: 'A+' },
          { name: 'गणित / जीव विज्ञान (Mathematics)', maxMarks: 100, sessionalMarks: 20, theoryMarks: 74, obtainedMarks: 94, grade: 'A+' }
        ] : [
          { name: 'अनिवार्य हिंदी', maxMarks: 100, sessionalMarks: 20, theoryMarks: 68, obtainedMarks: 88, grade: 'A+' },
          { name: 'अनिवार्य अंग्रेजी', maxMarks: 100, sessionalMarks: 19, theoryMarks: 65, obtainedMarks: 84, grade: 'A' },
          { name: 'ऐच्छिक विषय 1', maxMarks: 100, sessionalMarks: 20, theoryMarks: 70, obtainedMarks: 90, grade: 'A+' },
          { name: 'ऐच्छिक विषय 2', maxMarks: 100, sessionalMarks: 19, theoryMarks: 68, obtainedMarks: 87, grade: 'A+' },
          { name: 'ऐच्छिक विषय 3', maxMarks: 100, sessionalMarks: 20, theoryMarks: 72, obtainedMarks: 92, grade: 'A+' }
        ],
        totalMax: 500,
        totalObtained: 464,
        percentage: 92.8,
        resultStatus: 'प्रथम श्रेणी (FIRST DIV WITH DISTINCTION)',
        division: 'मेरिट स्थान (First Division)'
      }
    ];
  };

  const currentBoardStudents = selectedBoardClass ? getMockBoardStudents(selectedBoardClass) : [];
  const filteredBoardStudents = currentBoardStudents.filter(st =>
    st.rollNo.includes(searchRollNo) || st.name.toLowerCase().includes(searchRollNo.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* 🏛️ RAJASTHAN EDUCATION DEPARTMENT HEADER BANNER */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white border border-emerald-700/60 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            {onBack && (
              <button
                onClick={onBack}
                className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 transition-colors cursor-pointer shrink-0"
                title="पीछे जाएँ"
              >
                <ChevronLeft className="w-5 h-5 text-amber-300" />
              </button>
            )}
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center font-black text-slate-950 text-xl shadow-lg shrink-0">
              रा
            </div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-amber-300 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>राजस्थान सरकार — स्कूल शिक्षा विभाग</span>
              </div>
              <h2 className="text-base sm:text-xl font-black tracking-wide text-white">
                राज्य बोर्ड परीक्षा परिणाम एवं अंकतालिका पोर्टल (2026)
              </h2>
              <p className="text-xs text-emerald-200 font-medium">
                कक्षा 5, 8, 10 एवं 12वीं परीक्षा परिणाम, ग्रेडिंग प्रोफ़ॉर्मा व सत्यापन केंद्र
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 bg-slate-800/80 p-2 rounded-2xl border border-emerald-500/40 text-xs shrink-0">
            <GraduationCap className="w-4 h-4 text-amber-300 ml-1" />
            <span className="font-bold text-amber-300">RBSE अजमेर / बीकानेर पोर्टल सिंक</span>
          </div>
        </div>
      </div>

      {/* 🌟 MAIN SECTION: 3D-STYLED ICON GRID FOR CLASS 5, 8, 10, AND 12 RESULTS */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 shadow-md border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h3 className="font-black text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span>राजस्थान बोर्ड परीक्षा परिणाम ग्रेड ग्रिड</span>
            </h3>
            <p className="text-xs text-slate-500">
              कक्षा 5वीं, 8वीं, 10वीं एवं 12वीं बोर्ड परीक्षा परिणाम देखने एवं डिजिटल मार्कशीट जनरेट करने हेतु संबंधित कार्ड पर क्लिक करें
            </p>
          </div>
        </div>

        {/* THE 4 BOARD CLASSES 3D CARDS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          
          {/* Card 1: Class 5th Result */}
          <div
            onClick={() => {
              setSelectedBoardClass('5');
              setSelectedStudentForMarksheet(null);
            }}
            className={`group cursor-pointer p-4 sm:p-5 rounded-3xl border-2 transition-all transform active:scale-95 duration-200 relative overflow-hidden ${
              selectedBoardClass === '5'
                ? 'border-emerald-500 bg-emerald-50/90 dark:bg-emerald-950/40 ring-2 ring-emerald-500/40 shadow-xl'
                : 'border-emerald-200/80 dark:border-emerald-900/30 bg-gradient-to-b from-emerald-50/50 to-white dark:from-emerald-950/20 dark:to-slate-900 hover:border-emerald-400 hover:shadow-lg'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="px-2.5 py-1 rounded-xl bg-emerald-700 text-white text-[10px] font-black tracking-widest font-mono">
                कक्षा 5वीं
              </span>
              <span className="text-[10px] font-extrabold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-lg border border-emerald-300 dark:border-emerald-800">
                DIET बोर्ड
              </span>
            </div>

            <div className="flex items-center space-x-3 my-2">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30 transform group-hover:scale-105 transition-transform">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
                  5वीं बोर्ड परिणाम
                </h4>
                <p className="text-[11px] text-slate-500 font-medium">
                  प्राथमिक शिक्षा स्तर
                </p>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-emerald-200/60 dark:border-emerald-900/40 flex items-center justify-between text-[11px]">
              <span className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> ग्रेडिंग शीट
              </span>
              <span className="font-mono font-black text-emerald-700 dark:text-emerald-400">2026 लाइव</span>
            </div>
          </div>

          {/* Card 2: Class 8th Result */}
          <div
            onClick={() => {
              setSelectedBoardClass('8');
              setSelectedStudentForMarksheet(null);
            }}
            className={`group cursor-pointer p-4 sm:p-5 rounded-3xl border-2 transition-all transform active:scale-95 duration-200 relative overflow-hidden ${
              selectedBoardClass === '8'
                ? 'border-sky-500 bg-sky-50/90 dark:bg-sky-950/40 ring-2 ring-sky-500/40 shadow-xl'
                : 'border-sky-200/80 dark:border-sky-900/30 bg-gradient-to-b from-sky-50/50 to-white dark:from-sky-950/20 dark:to-slate-900 hover:border-sky-400 hover:shadow-lg'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="px-2.5 py-1 rounded-xl bg-sky-700 text-white text-[10px] font-black tracking-widest font-mono">
                कक्षा 8वीं
              </span>
              <span className="text-[10px] font-extrabold text-sky-800 dark:text-sky-300 bg-sky-100 dark:bg-sky-950 px-2 py-0.5 rounded-lg border border-sky-300 dark:border-sky-800">
                पंजीयक बीकानेर
              </span>
            </div>

            <div className="flex items-center space-x-3 my-2">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-700 flex items-center justify-center text-white shadow-lg shadow-sky-500/30 transform group-hover:scale-105 transition-transform">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
                  8वीं बोर्ड परिणाम
                </h4>
                <p className="text-[11px] text-slate-500 font-medium">
                  प्रारंभिक शिक्षा पूर्णता
                </p>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-sky-200/60 dark:border-sky-900/40 flex items-center justify-between text-[11px]">
              <span className="font-bold text-sky-800 dark:text-sky-300 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" /> अंक तालिका
              </span>
              <span className="font-mono font-black text-sky-700 dark:text-sky-400">2026 लाइव</span>
            </div>
          </div>

          {/* Card 3: Class 10th Result */}
          <div
            onClick={() => {
              setSelectedBoardClass('10');
              setSelectedStudentForMarksheet(null);
            }}
            className={`group cursor-pointer p-4 sm:p-5 rounded-3xl border-2 transition-all transform active:scale-95 duration-200 relative overflow-hidden ${
              selectedBoardClass === '10'
                ? 'border-amber-500 bg-amber-50/90 dark:bg-amber-950/40 ring-2 ring-amber-500/40 shadow-xl'
                : 'border-amber-200/80 dark:border-amber-900/30 bg-gradient-to-b from-amber-50/50 to-white dark:from-amber-950/20 dark:to-slate-900 hover:border-amber-400 hover:shadow-lg'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="px-2.5 py-1 rounded-xl bg-amber-700 text-white text-[10px] font-black tracking-widest font-mono">
                कक्षा 10वीं
              </span>
              <span className="text-[10px] font-extrabold text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-950 px-2 py-0.5 rounded-lg border border-amber-300 dark:border-amber-800">
                RBSE अजमेर
              </span>
            </div>

            <div className="flex items-center space-x-3 my-2">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-700 flex items-center justify-center text-white shadow-lg shadow-amber-500/30 transform group-hover:scale-105 transition-transform">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
                  10वीं माध्यमिक परिणाम
                </h4>
                <p className="text-[11px] text-slate-500 font-medium">
                  माध्यमिक बोर्ड अजमेर
                </p>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-amber-200/60 dark:border-amber-900/40 flex items-center justify-between text-[11px]">
              <span className="font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" /> बोर्ड अंकपत्र
              </span>
              <span className="font-mono font-black text-amber-700 dark:text-amber-400">2026 लाइव</span>
            </div>
          </div>

          {/* Card 4: Class 12th Result */}
          <div
            onClick={() => {
              setSelectedBoardClass('12');
              setSelectedStudentForMarksheet(null);
            }}
            className={`group cursor-pointer p-4 sm:p-5 rounded-3xl border-2 transition-all transform active:scale-95 duration-200 relative overflow-hidden ${
              selectedBoardClass === '12'
                ? 'border-purple-500 bg-purple-50/90 dark:bg-purple-950/40 ring-2 ring-purple-500/40 shadow-xl'
                : 'border-purple-200/80 dark:border-purple-900/30 bg-gradient-to-b from-purple-50/50 to-white dark:from-purple-950/20 dark:to-slate-900 hover:border-purple-400 hover:shadow-lg'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="px-2.5 py-1 rounded-xl bg-purple-700 text-white text-[10px] font-black tracking-widest font-mono">
                कक्षा 12वीं
              </span>
              <span className="text-[10px] font-extrabold text-purple-800 dark:text-purple-300 bg-purple-100 dark:bg-purple-950 px-2 py-0.5 rounded-lg border border-purple-300 dark:border-purple-800">
                विज्ञान / कला / वाणिज्य
              </span>
            </div>

            <div className="flex items-center space-x-3 my-2">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-700 flex items-center justify-center text-white shadow-lg shadow-purple-500/30 transform group-hover:scale-105 transition-transform">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
                  12वीं उच्च माध्यमिक
                </h4>
                <p className="text-[11px] text-slate-500 font-medium">
                  संकायवार परीक्षा परिणाम
                </p>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-purple-200/60 dark:border-purple-900/40 flex items-center justify-between text-[11px]">
              <span className="font-bold text-purple-800 dark:text-purple-300 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" /> मेरिट प्रोफ़ॉर्मा
              </span>
              <span className="font-mono font-black text-purple-700 dark:text-purple-400">2026 लाइव</span>
            </div>
          </div>

        </div>
      </div>

      {/* 🔍 ACTIVE SELECTED BOARD CLASS RESULT SEARCH & MARKSHEET VIEWER */}
      {selectedBoardClass && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 shadow-md border border-slate-200 dark:border-slate-800 space-y-5 animate-fadeIn">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center space-x-2.5">
              <div className="p-2.5 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-mono font-black text-sm">
                कक्षा {selectedBoardClass}वीं
              </div>
              <div>
                <h3 className="font-black text-base text-slate-900 dark:text-slate-100">
                  कक्षा {selectedBoardClass}वीं बोर्ड परीक्षा परिणाम सर्च एवं अंकतालिका
                </h3>
                <p className="text-xs text-slate-500">
                  अनुक्रमांक (Roll No) अथवा नाम से छात्र परिणाम खोजें
                </p>
              </div>
            </div>

            {/* Stream Selector for Class 12 */}
            {selectedBoardClass === '12' && (
              <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold">
                {(['Science', 'Commerce', 'Arts'] as const).map(str => (
                  <button
                    key={str}
                    onClick={() => setSelectedStream12(str)}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      selectedStream12 === str
                        ? 'bg-purple-700 text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {str === 'Science' ? 'विज्ञान' : str === 'Commerce' ? 'वाणिज्य' : 'कला'}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Roll Number Search Input */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="अनुक्रमांक (Roll No) अथवा छात्र नाम दर्ज करें..."
                value={searchRollNo}
                onChange={(e) => setSearchRollNo(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            {searchRollNo && (
              <button
                onClick={() => setSearchRollNo('')}
                className="px-3 py-2.5 rounded-2xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-300"
              >
                क्लियर
              </button>
            )}
          </div>

          {/* Board Students Table / List */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-black border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="p-3 text-center">क्र.</th>
                  <th className="p-3">अनुक्रमांक (Roll No)</th>
                  <th className="p-3">छात्र का नाम</th>
                  <th className="p-3">पिता का नाम</th>
                  <th className="p-3 text-center">प्राप्तांक / कुल</th>
                  <th className="p-3 text-center">प्रतिशत</th>
                  <th className="p-3 text-center">परिणाम स्थिति</th>
                  <th className="p-3 text-center">कार्रवाई</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {filteredBoardStudents.length > 0 ? (
                  filteredBoardStudents.map((st, idx) => (
                    <tr key={st.rollNo} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="p-3 text-center font-mono text-slate-400 font-bold">{idx + 1}</td>
                      <td className="p-3 font-mono font-black text-emerald-700 dark:text-emerald-400">{st.rollNo}</td>
                      <td className="p-3 font-extrabold text-slate-900 dark:text-slate-100">{st.name}</td>
                      <td className="p-3 text-slate-600 dark:text-slate-300">{st.fatherName}</td>
                      <td className="p-3 text-center font-mono font-bold text-slate-800 dark:text-slate-200">
                        {st.totalObtained} / {st.totalMax}
                      </td>
                      <td className="p-3 text-center font-mono font-black text-amber-600 dark:text-amber-400">
                        {st.percentage}%
                      </td>
                      <td className="p-3 text-center">
                        <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-[10px]">
                          {st.division}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => setSelectedStudentForMarksheet(st)}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center gap-1 mx-auto transition-all active:scale-95 cursor-pointer shadow-sm"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>अंकतालिका देखें</span>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="p-6 text-center text-slate-400 italic">
                      कोई छात्र रिकॉर्ड प्राप्त नहीं हुआ।
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 📜 OFFICIAL RAJASTHAN BOARD MARKSHEET MODAL / PROFORMA VIEW */}
      {selectedStudentForMarksheet && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-3xl max-w-3xl w-full p-6 space-y-5 border border-slate-200 dark:border-slate-800 shadow-2xl my-8">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 gap-2">
              <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950 px-3 py-1 rounded-xl border border-emerald-200 dark:border-emerald-800">
                राजस्थान शिक्षा विभाग अधिकृत अंकतालिका प्रोफ़ॉर्मा
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer active:scale-95"
                >
                  <Printer className="w-3.5 h-3.5 text-amber-300" />
                  <span>मुद्रित करें / PDF</span>
                </button>
                <button
                  onClick={() => setSelectedStudentForMarksheet(null)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 cursor-pointer"
                >
                  बंद करें (Close)
                </button>
              </div>
            </div>

            {/* PRINTABLE MARKSHEET SHEET */}
            <div id="printable-board-marksheet" className="p-6 rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-amber-50/20 dark:bg-slate-950 space-y-4 text-xs">
              
              {/* Header Crest */}
              <div className="text-center space-y-1 pb-3 border-b-2 border-slate-900 dark:border-slate-100">
                <div className="font-extrabold text-[10px] uppercase tracking-widest text-slate-600 dark:text-slate-400">
                  {selectedBoardClass === '5' || selectedBoardClass === '8'
                    ? 'प्रारंभिक शिक्षा विभागीय परीक्षाएं एवं DIET, राजस्थान'
                    : 'माध्यमिक शिक्षा बोर्ड राजस्थान, अजमेर (BSER AJMER)'}
                </div>
                <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100 uppercase tracking-wide">
                  {selectedBoardClass === '5' && 'कक्षा 5वीं प्राथमिक शिक्षा अधिगम स्तर मूल्यांकन - 2026'}
                  {selectedBoardClass === '8' && 'कक्षा 8वीं प्रारंभिक शिक्षा पूर्णता प्रमाण-पत्र परीक्षा - 2026'}
                  {selectedBoardClass === '10' && 'माध्यमिक परीक्षा अंक तालिका (CLASS 10th BOARD RESULT)'}
                  {selectedBoardClass === '12' && `उच्च माध्यमिक परीक्षा अंक तालिका (${selectedStudentForMarksheet.stream || 'विज्ञान'} संकाय)`}
                </h2>
                <p className="text-[11px] font-bold text-slate-500">
                  विद्यालय: {selectedStudentForMarksheet.schoolName} (UDISE: {selectedStudentForMarksheet.udiseCode})
                </p>
              </div>

              {/* Student Metadata Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3 rounded-xl bg-slate-100/70 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold">
                <div>
                  <span className="block text-[10px] text-slate-400">अनुक्रमांक (Roll No)</span>
                  <span className="font-mono text-emerald-700 dark:text-emerald-400 font-extrabold">{selectedStudentForMarksheet.rollNo}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400">नामांकन संख्या (Enrolment No)</span>
                  <span className="font-mono text-slate-800 dark:text-slate-200">{selectedStudentForMarksheet.enrolmentNo}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400">छात्र/छात्रा का नाम</span>
                  <span className="text-slate-900 dark:text-slate-100">{selectedStudentForMarksheet.name}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400">पिता का नाम</span>
                  <span className="text-slate-800 dark:text-slate-200">{selectedStudentForMarksheet.fatherName}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400">माता का नाम</span>
                  <span className="text-slate-800 dark:text-slate-200">{selectedStudentForMarksheet.motherName}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400">वर्ग / लिंग</span>
                  <span className="text-slate-800 dark:text-slate-200">{selectedStudentForMarksheet.category} / {selectedStudentForMarksheet.gender}</span>
                </div>
              </div>

              {/* Subject Wise Marks Breakdown Table */}
              <div className="overflow-x-auto rounded-xl border border-slate-300 dark:border-slate-700">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-200 dark:bg-slate-800 font-black text-slate-800 dark:text-slate-200 border-b border-slate-300 dark:border-slate-700">
                    <tr>
                      <th className="p-2 border-r border-slate-300 dark:border-slate-700">विषय (Subject)</th>
                      <th className="p-2 text-center border-r border-slate-300 dark:border-slate-700">पूर्णांक</th>
                      <th className="p-2 text-center border-r border-slate-300 dark:border-slate-700">सत्रांक</th>
                      <th className="p-2 text-center border-r border-slate-300 dark:border-slate-700">सैद्धांतिक</th>
                      <th className="p-2 text-center border-r border-slate-300 dark:border-slate-700">कुल प्राप्तांक</th>
                      <th className="p-2 text-center">ग्रेड / रिमार्क्स</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-medium">
                    {selectedStudentForMarksheet.subjects.map((sb, idx) => (
                      <tr key={idx}>
                        <td className="p-2 font-bold text-slate-900 dark:text-slate-100 border-r border-slate-200 dark:border-slate-800">{sb.name}</td>
                        <td className="p-2 text-center font-mono border-r border-slate-200 dark:border-slate-800">{sb.maxMarks}</td>
                        <td className="p-2 text-center font-mono border-r border-slate-200 dark:border-slate-800">{sb.sessionalMarks}</td>
                        <td className="p-2 text-center font-mono border-r border-slate-200 dark:border-slate-800">{sb.theoryMarks}</td>
                        <td className="p-2 text-center font-mono font-black text-emerald-800 dark:text-emerald-300 border-r border-slate-200 dark:border-slate-800">{sb.obtainedMarks}</td>
                        <td className="p-2 text-center font-black">{sb.grade}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-slate-100 dark:bg-slate-800/80 font-black border-t-2 border-slate-300 dark:border-slate-700">
                    <tr>
                      <td className="p-2 border-r border-slate-300 dark:border-slate-700">कुल योग (GRAND TOTAL)</td>
                      <td className="p-2 text-center font-mono border-r border-slate-300 dark:border-slate-700">{selectedStudentForMarksheet.totalMax}</td>
                      <td colSpan={2} className="p-2 text-right border-r border-slate-300 dark:border-slate-700">कुल प्राप्तांक:</td>
                      <td className="p-2 text-center font-mono font-black text-emerald-700 dark:text-emerald-400 border-r border-slate-300 dark:border-slate-700">{selectedStudentForMarksheet.totalObtained}</td>
                      <td className="p-2 text-center font-mono text-amber-600 font-extrabold">{selectedStudentForMarksheet.percentage}%</td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Result Summary Bar */}
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 flex items-center justify-between font-bold text-emerald-900 dark:text-emerald-200">
                <div>
                  <span>परिणाम (RESULT STATUS): </span>
                  <span className="text-emerald-700 font-black">{selectedStudentForMarksheet.resultStatus}</span>
                </div>
                <div>
                  <span>श्रेणी / ग्रेड: </span>
                  <span className="font-black text-amber-600">{selectedStudentForMarksheet.division}</span>
                </div>
              </div>

              {/* Signatures & Seal Block */}
              <div className="pt-6 flex items-end justify-between text-[10px] text-slate-500 font-bold">
                <div>
                  <p>दिनांक: 02 अगस्त 2026</p>
                  <p>सत्यापन कोड: RAJ-EDU-2026-{selectedStudentForMarksheet.rollNo}</p>
                </div>
                <div className="text-center">
                  <div className="w-20 h-10 border border-dashed border-slate-400 rounded-lg flex items-center justify-center text-[8px] text-slate-400 mx-auto mb-1">
                    संस्था प्रधान सील
                  </div>
                  <p>हस्ताक्षर प्रधानाचार्य / संस्था प्रधान</p>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}
    </div>
  );
};
