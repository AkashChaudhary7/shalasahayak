import React, { useState, useEffect, useMemo } from 'react';
import { SchoolProfile, TransportStudent, Language } from '../../types';
import { ThreeDCard, ThreeDIcon } from '../ThreeDIcon';
import {
  Bus,
  Plus,
  Trash2,
  Printer,
  Download,
  CheckCircle2,
  ArrowLeft,
  Search,
  Filter,
  DollarSign,
  UserCheck,
  Building2,
  FileText,
  BookOpen,
  MapPin,
  AlertCircle,
  HelpCircle,
  Award,
  Layers,
  Edit,
  CheckSquare,
  Info,
  Calendar,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Users
} from 'lucide-react';

interface TransportInchargeModuleProps {
  schoolProfile: SchoolProfile;
  lang: Language;
  onBack?: () => void;
}

export const TransportInchargeModule: React.FC<TransportInchargeModuleProps> = ({
  schoolProfile,
  lang,
  onBack
}) => {
  const isHi = lang === 'hi';

  // Active Sub-tab selector: 'grid' is main 3D icons landing menu, or specific independent subcomponent
  const [activeTab, setActiveTab] = useState<'grid' | 'rules' | 'routes_tracker' | 'prapatra1_a' | 'prapatra1_b' | 'prapatra2'>('grid');

  // Accordion state for Rules tab
  const [openRuleSection, setOpenRuleSection] = useState<string>('sec-1');

  // --- 1. LOCAL STORAGE STATE FOR STUDENTS & VOUCHER RECORDS ---
  const [students, setStudents] = useState<TransportStudent[]>(() => {
    const saved = localStorage.getItem('shala_transport_students_v2');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: 'ts-101',
        srNo: '1408',
        studentName: 'Ramesh Kumar Gurjar',
        fatherName: 'Ramphul Gurjar',
        className: 'Class 8-A',
        distanceCategory: '2-5 km',
        exactDistanceKm: 3.5,
        modeOfTransport: 'Auto/Bus',
        monthlySubsidyAmount: 330, // 22 days * 15
        bankAccountStatus: 'Verified',
        janAadharNo: '8876123490',
        villageDhani: 'Bhairav Pura Dhani',
        attendanceDays: 22,
        dailyRate: 15
      },
      {
        id: 'ts-102',
        srNo: '1415',
        studentName: 'Pooja Verma',
        fatherName: 'Suresh Verma',
        className: 'Class 6-B',
        distanceCategory: '2-5 km',
        exactDistanceKm: 3.2,
        modeOfTransport: 'Bicycle',
        monthlySubsidyAmount: 300, // 20 days * 15
        bankAccountStatus: 'Verified',
        janAadharNo: '9921456781',
        villageDhani: 'Khatipura Nala',
        attendanceDays: 20,
        dailyRate: 15
      },
      {
        id: 'ts-103',
        srNo: '1422',
        studentName: 'Kavita Meena',
        fatherName: 'Harikesh Meena',
        className: 'Class 10-A',
        distanceCategory: '5+ km',
        exactDistanceKm: 5.8,
        modeOfTransport: 'Auto/Bus',
        monthlySubsidyAmount: 480, // 24 days * 20
        bankAccountStatus: 'Verified',
        janAadharNo: '7765123901',
        villageDhani: 'Meena Basti',
        attendanceDays: 24,
        dailyRate: 20
      },
      {
        id: 'ts-104',
        srNo: '1430',
        studentName: 'Devendra Singh Bhati',
        fatherName: 'Bhanwar Singh Bhati',
        className: 'Class 4-A',
        distanceCategory: '2-5 km',
        exactDistanceKm: 1.8,
        modeOfTransport: 'Walk',
        monthlySubsidyAmount: 220, // 22 days * 10
        bankAccountStatus: 'Pending',
        janAadharNo: '6651238910',
        villageDhani: 'Rajputon Ki Dhani',
        attendanceDays: 22,
        dailyRate: 10
      }
    ];
  });

  const [selectedMonth, setSelectedMonth] = useState('August 2026');
  const [totalShiviraDays, setTotalShiviraDays] = useState(24);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterClass, setFilterClass] = useState('All');

  // --- FORM STATE FOR NEW BENEFICIARY ---
  const [newSrNo, setNewSrNo] = useState('');
  const [newName, setNewName] = useState('');
  const [newFatherName, setNewFatherName] = useState('');
  const [newClass, setNewClass] = useState('Class 8');
  const [newDistanceKm, setNewDistanceKm] = useState<number>(3.5);
  const [newTransportMode, setNewTransportMode] = useState<'Walk' | 'Bicycle' | 'Auto/Bus' | 'SMC Transport'>('Auto/Bus');
  const [newJanAadhar, setNewJanAadhar] = useState('');
  const [newVillage, setNewVillage] = useState('');
  const [newAttendanceDays, setNewAttendanceDays] = useState(22);

  // --- FORM STATE FOR PRAPATRA-1 GENERATOR ---
  const [p1StudentName, setP1StudentName] = useState('Kavita Meena');
  const [p1FatherName, setP1FatherName] = useState('Harikesh Meena');
  const [p1Class, setP1Class] = useState('10');
  const [p1Address, setP1Address] = useState('Gram Meena Basti, Post Chomu');
  const [p1Distance, setP1Distance] = useState('5.8');
  const [p1ReasonIndex, setP1ReasonIndex] = useState<'I' | 'II' | 'III' | 'IV' | 'V' | 'VII'>('III');
  const [p1TransportChoice, setP1TransportChoice] = useState<'SMC' | 'SELF'>('SELF');

  // Class wise counts for Prapatra 1 Part-B
  const [p1ClassCounts, setP1ClassCounts] = useState<{ [key: string]: number }>({
    'Class - 1': 2,
    'Class - 2': 3,
    'Class - 3': 1,
    'Class - 4': 4,
    'Class - 5': 2,
    'Class - 6': 5,
    'Class - 7': 3,
    'Class - 8': 6,
    'Class - 9': 4,
    'Class - 10': 5
  });

  // --- FORM STATE FOR PRAPATRA-2 GENERATOR ---
  const [p2SchoolName, setP2SchoolName] = useState(schoolProfile.schoolName || 'Govt Senior Secondary School');
  const [p2SchoolCode, setP2SchoolCode] = useState(schoolProfile.diseCode || '08120304501');
  const [p2TotalStudents, setP2TotalStudents] = useState('35');
  const [p2VerifiedDate, setP2VerifiedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    localStorage.setItem('shala_transport_students_v2', JSON.stringify(students));
  }, [students]);

  // Helper function to calculate daily rate based on class level
  const getDailyRateForClass = (className: string): number => {
    if (className.includes('Class 1') || className.includes('Class 2') || className.includes('Class 3') || className.includes('Class 4') || className.includes('Class 5')) {
      return 10;
    } else if (className.includes('Class 6') || className.includes('Class 7') || className.includes('Class 8')) {
      return 15;
    } else {
      // Class 9 & 10 (Girls)
      return 20;
    }
  };

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const rate = getDailyRateForClass(newClass);
    const distCat = newDistanceKm > 5 ? '5+ km' : newDistanceKm > 2 ? '2-5 km' : '0-2 km';
    const monthlyClaim = newAttendanceDays * rate;

    const newStudent: TransportStudent = {
      id: `ts-${Date.now()}`,
      srNo: newSrNo || `${Math.floor(Math.random() * 900 + 1000)}`,
      studentName: newName,
      fatherName: newFatherName,
      className: newClass,
      distanceCategory: distCat as any,
      exactDistanceKm: newDistanceKm,
      modeOfTransport: newTransportMode as any,
      monthlySubsidyAmount: monthlyClaim,
      bankAccountStatus: newJanAadhar ? 'Verified' : 'Pending',
      janAadharNo: newJanAadhar || 'N/A',
      villageDhani: newVillage || 'Local Dhani',
      attendanceDays: newAttendanceDays,
      dailyRate: rate
    };

    setStudents(prev => [...prev, newStudent]);
    setNewName('');
    setNewFatherName('');
    setNewSrNo('');
    setNewJanAadhar('');
    setNewVillage('');
  };

  const handleDeleteStudent = (id: string) => {
    if (confirm(isHi ? 'क्या आप इस छात्र को परिवहन सूची से हटाना चाहते हैं?' : 'Remove this student from transport list?')) {
      setStudents(prev => prev.filter(s => s.id !== id));
    }
  };

  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = s.studentName.toLowerCase().includes(q) || s.srNo.includes(q) || (s.villageDhani && s.villageDhani.toLowerCase().includes(q));
      const matchesClass = filterClass === 'All' || s.className.includes(filterClass);
      return matchesSearch && matchesClass;
    });
  }, [students, searchQuery, filterClass]);

  // Summary statistics
  const totalBeneficiaries = students.length;
  const primaryCount = students.filter(s => s.className.includes('1') || s.className.includes('2') || s.className.includes('3') || s.className.includes('4') || s.className.includes('5')).length;
  const upperPrimaryCount = students.filter(s => s.className.includes('6') || s.className.includes('7') || s.className.includes('8')).length;
  const secondaryCount = students.filter(s => s.className.includes('9') || s.className.includes('10')).length;
  const totalMonthlyClaim = filteredStudents.reduce((sum, s) => sum + (s.monthlySubsidyAmount || 0), 0);
  const verifiedCount = students.filter(s => s.bankAccountStatus === 'Verified').length;

  const handlePrintDocument = (elementId: string, title: string) => {
    const printContent = document.getElementById(elementId);
    if (!printContent) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${title}</title>
          <style>
            @page { size: A4 portrait; margin: 15mm; }
            body { font-family: 'Hind', 'Noto Sans Devanagari', sans-serif; color: #000; background: #fff; line-height: 1.4; padding: 10px; }
            .border-box { border: 2px solid #000; padding: 15px; margin-bottom: 10px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; margin-bottom: 10px; }
            th, td { border: 1px solid #000; padding: 6px 8px; font-size: 12px; text-align: left; }
            th { background-color: #f2f2f2; font-weight: bold; }
            .text-center { text-align: center; }
            .text-right { text-align: right; }
            .font-bold { font-weight: bold; }
            .title { font-size: 16px; font-weight: bold; text-align: center; margin-bottom: 5px; }
            .subtitle { font-size: 13px; text-align: center; margin-bottom: 15px; }
            .sig-box { margin-top: 40px; display: flex; justify-content: space-between; font-weight: bold; font-size: 12px; }
            .checkbox { display: inline-block; width: 12px; height: 12px; border: 1px solid #000; margin-right: 5px; text-align: center; line-height: 10px; }
            @media print {
              .no-print { display: none !important; }
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-3 sm:p-5 shadow-lg border border-slate-200 dark:border-slate-800 space-y-4 animate-fadeIn">
      
      {/* 1. TOP HEADER & MAIN NAV */}
      <div className="flex items-center justify-between pb-2.5 border-b border-slate-200 dark:border-slate-800 gap-2">
        <div className="flex items-center gap-2">
          <Bus className="w-5 h-5 text-emerald-600 shrink-0" />
          <h3 className="font-extrabold text-sm sm:text-base text-slate-800 dark:text-slate-100">
            {isHi ? 'परिवहन भत्ता / ट्रांसपोर्ट वाउचर प्रभाग' : 'Transport Voucher Module'}
          </h3>
        </div>
        {onBack && (
          <button
            onClick={onBack}
            className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all flex items-center gap-1 shrink-0 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{isHi ? 'वापस' : 'Back'}</span>
          </button>
        )}
      </div>

      {/* 2. SUB-NAVIGATION OR BACK TO MENU HEADER */}
      {activeTab !== 'grid' && (
        <div className="flex items-center justify-between bg-slate-100 dark:bg-slate-800/80 p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
          <button
            onClick={() => setActiveTab('grid')}
            className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[11px] sm:text-xs flex items-center gap-1 shadow transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{isHi ? '← परिवहन मेनू' : '← Back Menu'}</span>
          </button>
          <span className="text-[11px] sm:text-xs font-bold text-slate-700 dark:text-slate-300 truncate max-w-[200px] sm:max-w-none">
            {activeTab === 'rules' && (isHi ? '1. सरकारी नियम व दिशा-निर्देश' : '1. Official Rules & Guidelines')}
            {activeTab === 'routes_tracker' && (isHi ? '2. रूट-ढाणी व मासिक क्लेम' : '2. Route & Monthly Claim Tracker')}
            {activeTab === 'prapatra1_a' && (isHi ? '3. प्रपत्र-1 (भाग-क) छात्र आवेदन' : '3. Prapatra 1 Form (Bhag A)')}
            {activeTab === 'prapatra1_b' && (isHi ? '4. प्रपत्र-1 (भाग-ख) संस्थाप्रधान प्रमाणीकरण' : '4. Prapatra 1 Form B Maker')}
            {activeTab === 'prapatra2' && (isHi ? '5. प्रपत्र-2 शाला दर्पण अंकन' : '5. Prapatra 2 SD Certificate')}
          </span>
        </div>
      )}

      {/* 3. MAIN LANDING 3D INTERACTIVE CARDS MENU */}
      {activeTab === 'grid' && (
        <div className="space-y-4 animate-fadeIn py-1">
          <div className="text-center max-w-xl mx-auto my-1">
            <h4 className="text-sm sm:text-lg font-black text-slate-800 dark:text-slate-100 flex items-center justify-center gap-2">
              <ThreeDIcon name="bus" size={28} />
              <span>{isHi ? 'परिवहन भत्ता मुख्य डैशबोर्ड' : 'Transport Voucher Dashboard'}</span>
            </h4>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            <ThreeDCard
              icon="book"
              label={isHi ? '1. सरकारी नियम' : '1. Official Rules'}
              onClick={() => setActiveTab('rules')}
            />

            <ThreeDCard
              icon="bus"
              label={isHi ? '2. रूट व मासिक दावा' : '2. Route & Claims'}
              onClick={() => setActiveTab('routes_tracker')}
            />

            <ThreeDCard
              icon="graduation"
              label={isHi ? '3. प्रपत्र-1 (भाग-क) आवेदन' : '3. Prapatra 1 (A)'}
              onClick={() => setActiveTab('prapatra1_a')}
            />

            <ThreeDCard
              icon="users"
              label={isHi ? '4. प्रपत्र-1 (भाग-ख) प्रमाणीकरण' : '4. Prapatra 1 (B)'}
              onClick={() => setActiveTab('prapatra1_b')}
            />

            <ThreeDCard
              icon="shield"
              label={isHi ? '5. प्रपत्र-2 शाला दर्पण' : '5. Prapatra 2 SD'}
              onClick={() => setActiveTab('prapatra2')}
            />
          </div>

          {/* Minimized Summary Banner */}
          <div className="p-2.5 sm:p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
            <div>
              <span className="block text-[10px] font-extrabold text-slate-500 uppercase">{isHi ? 'पात्र छात्र' : 'Beneficiaries'}</span>
              <span className="text-xs sm:text-sm font-black text-slate-800 dark:text-slate-100">{totalBeneficiaries}</span>
            </div>
            <div>
              <span className="block text-[10px] font-extrabold text-slate-500 uppercase">{isHi ? 'मासिक दावा' : 'Monthly Claim'}</span>
              <span className="text-xs sm:text-sm font-black text-emerald-600 dark:text-emerald-400">₹{totalMonthlyClaim.toLocaleString('en-IN')}</span>
            </div>
            <div>
              <span className="block text-[10px] font-extrabold text-slate-500 uppercase">{isHi ? 'जन आधार' : 'Jan Aadhar'}</span>
              <span className="text-xs sm:text-sm font-black text-blue-600 dark:text-blue-400">{verifiedCount} / {totalBeneficiaries}</span>
            </div>
            <div>
              <span className="block text-[10px] font-extrabold text-slate-500 uppercase">{isHi ? 'कार्य दिवस' : 'Working Days'}</span>
              <span className="text-xs sm:text-sm font-black text-amber-600 dark:text-amber-400">{totalShiviraDays} Days</span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 2: ROUTE & VILLAGE MAPPER + MONTHLY CLAIMS TRACKER */}
      {/* ========================================================================= */}
      {activeTab === 'routes_tracker' && (
        <div className="space-y-5 animate-fadeIn">
          {/* Village & Route Mapping Section */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
            <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-600" />
              <span>{isHi ? 'ग्रामीण रूट व ढाणी वार छात्र मैपिंग (Route & Village Mapping)' : 'Route & Village Dhani Mapping'}</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5 shadow-sm">
                <div className="font-extrabold text-slate-800 dark:text-slate-100 flex justify-between items-center">
                  <span>1. भैरवपुरा ढाणी (Route A)</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-mono font-bold text-[10px]">3.5 KM</span>
                </div>
                <p className="text-slate-500">पात्र छात्र: 8 विद्यार्थी (Primary & Upper Primary)</p>
                <div className="pt-1 border-t border-slate-100 dark:border-slate-800 flex justify-between text-slate-600 dark:text-slate-400">
                  <span>मुख्य साधन: Auto/Bus</span>
                  <span className="font-bold text-emerald-600">₹10 - ₹15/दिवस</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5 shadow-sm">
                <div className="font-extrabold text-slate-800 dark:text-slate-100 flex justify-between items-center">
                  <span>2. खातीपुरा नाला (Route B)</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-mono font-bold text-[10px]">3.2 KM</span>
                </div>
                <p className="text-slate-500">पात्र छात्र: 6 बालिकाएँ (Class 6-8 & 9-10)</p>
                <div className="pt-1 border-t border-slate-100 dark:border-slate-800 flex justify-between text-slate-600 dark:text-slate-400">
                  <span>मुख्य साधन: Bicycle / Walk</span>
                  <span className="font-bold text-emerald-600">₹15 - ₹20/दिवस</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5 shadow-sm">
                <div className="font-extrabold text-slate-800 dark:text-slate-100 flex justify-between items-center">
                  <span>3. मीना बस्ती (Route C)</span>
                  <span className="px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-mono font-bold text-[10px]">5.8 KM</span>
                </div>
                <p className="text-slate-500">पात्र छात्र: 11 बालिकाएँ (Class 9-10 Sec)</p>
                <div className="pt-1 border-t border-slate-100 dark:border-slate-800 flex justify-between text-slate-600 dark:text-slate-400">
                  <span>मुख्य साधन: Auto/Bus</span>
                  <span className="font-bold text-purple-600">₹20/दिवस</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Notice Banner */}
          <div className="p-2.5 sm:p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-center gap-2 text-[11px] sm:text-xs text-emerald-900 dark:text-emerald-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <div className="flex-1 font-semibold truncate sm:whitespace-normal">
              {isHi
                ? 'दरें: कक्षा 1-5: ₹10/दिवस | कक्षा 6-8: ₹15/दिवस | कक्षा 9-10 बालिकाएँ: ₹20/दिवस'
                : 'Norms: Class 1-5: ₹10/day | Class 6-8: ₹15/day | Class 9-10 Girls: ₹20/day'}
            </div>
          </div>

          {/* Stats KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 text-center">
              <span className="block text-[10px] text-slate-500 uppercase font-bold">{isHi ? 'कुल लाभार्थी छात्र' : 'Total Beneficiaries'}</span>
              <span className="text-lg font-black text-slate-800 dark:text-slate-100">{totalBeneficiaries}</span>
              <span className="block text-[9px] text-slate-400 mt-0.5">P1-5: {primaryCount} | P6-8: {upperPrimaryCount} | Sec: {secondaryCount}</span>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-900/40 text-center">
              <span className="block text-[10px] text-emerald-700 dark:text-emerald-400 uppercase font-bold">{isHi ? 'मासिक कुल क्लेम' : 'Total Monthly Claim'}</span>
              <span className="text-lg font-black text-emerald-700 dark:text-emerald-300">₹ {totalMonthlyClaim.toLocaleString('en-IN')}</span>
              <span className="block text-[9px] text-emerald-600 dark:text-emerald-400 mt-0.5">{selectedMonth}</span>
            </div>
            <div className="p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-900/40 text-center">
              <span className="block text-[10px] text-amber-700 dark:text-amber-400 uppercase font-bold">{isHi ? 'जन आधार / बैंक लिंक' : 'DBT Verified'}</span>
              <span className="text-lg font-black text-amber-700 dark:text-amber-300">{verifiedCount} / {totalBeneficiaries}</span>
              <span className="block text-[9px] text-amber-600 dark:text-amber-400 mt-0.5">IFMS 3.0 Ready</span>
            </div>
            <div className="p-3 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-900/40 text-center">
              <span className="block text-[10px] text-blue-700 dark:text-blue-400 uppercase font-bold">{isHi ? 'शिविरा कार्य दिवस' : 'Shivira Working Days'}</span>
              <span className="text-lg font-black text-blue-700 dark:text-blue-300">{totalShiviraDays} Days</span>
              <span className="block text-[9px] text-blue-600 dark:text-blue-400 mt-0.5">{isHi ? 'वर्तमान माह' : 'Current Month'}</span>
            </div>
            <div className="p-3 rounded-xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-200/60 dark:border-purple-900/40 text-center col-span-2 sm:col-span-1">
              <span className="block text-[10px] text-purple-700 dark:text-purple-400 uppercase font-bold">{isHi ? 'वार्षिक बजट सीमा' : 'Annual PAB Limit'}</span>
              <span className="text-lg font-black text-purple-700 dark:text-purple-300">₹1,500 / ₹2,700</span>
              <span className="block text-[9px] text-purple-600 dark:text-purple-400 mt-0.5">Primary vs Secondary</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Add Student Entry Form */}
            <form onSubmit={handleAddStudent} className="lg:col-span-4 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 text-xs">
              <div className="font-bold text-xs text-slate-800 dark:text-slate-100 flex items-center justify-between pb-1 border-b border-slate-200 dark:border-slate-700">
                <span className="flex items-center gap-1.5">
                  <Plus className="w-4 h-4 text-emerald-600" />
                  <span>{isHi ? 'नया परिवहन पात्र छात्र पंजीकृत करें' : 'Register New Beneficiary'}</span>
                </span>
                <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full font-extrabold">Form 1</span>
              </div>

              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-0.5">{isHi ? 'एसआर नंबर (SR No.)' : 'SR Number'}</label>
                    <input
                      type="text"
                      placeholder="e.g. 1408"
                      value={newSrNo}
                      onChange={e => setNewSrNo(e.target.value)}
                      className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-0.5">{isHi ? 'कक्षा' : 'Class'}</label>
                    <select
                      value={newClass}
                      onChange={e => setNewClass(e.target.value)}
                      className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold"
                    >
                      <option value="Class 1">Class 1 (₹10/day)</option>
                      <option value="Class 2">Class 2 (₹10/day)</option>
                      <option value="Class 3">Class 3 (₹10/day)</option>
                      <option value="Class 4">Class 4 (₹10/day)</option>
                      <option value="Class 5">Class 5 (₹10/day)</option>
                      <option value="Class 6">Class 6 (₹15/day)</option>
                      <option value="Class 7">Class 7 (₹15/day)</option>
                      <option value="Class 8">Class 8 (₹15/day)</option>
                      <option value="Class 9">Class 9 (Girls ₹20/day)</option>
                      <option value="Class 10">Class 10 (Girls ₹20/day)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-0.5">{isHi ? 'छात्र / छात्रा का नाम' : 'Student Full Name'}</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Meena Kumari"
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-0.5">{isHi ? 'पिता / अभिभावक का नाम' : 'Father / Guardian Name'}</label>
                  <input
                    type="text"
                    placeholder="Father Name"
                    value={newFatherName}
                    onChange={e => setNewFatherName(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-0.5">{isHi ? 'वास्तविक दूरी (KM)' : 'Distance in KM'}</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0.5"
                      max="25"
                      value={newDistanceKm}
                      onChange={e => setNewDistanceKm(parseFloat(e.target.value) || 1)}
                      className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-0.5">{isHi ? 'माह उपस्थिति (दिवस)' : 'Attendance Days'}</label>
                    <input
                      type="number"
                      min="1"
                      max="31"
                      value={newAttendanceDays}
                      onChange={e => setNewAttendanceDays(parseInt(e.target.value) || 20)}
                      className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-0.5">{isHi ? 'परिवहन साधन' : 'Transport Mode'}</label>
                    <select
                      value={newTransportMode}
                      onChange={e => setNewTransportMode(e.target.value as any)}
                      className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                    >
                      <option value="Auto/Bus">Auto / Bus</option>
                      <option value="Bicycle">Bicycle</option>
                      <option value="Walk">Walk / Local</option>
                      <option value="SMC Transport">SMC Collective Transport</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-0.5">{isHi ? 'जन आधार क्रमांक' : 'Jan Aadhar No'}</label>
                    <input
                      type="text"
                      placeholder="10 digit Jan Aadhar"
                      value={newJanAadhar}
                      onChange={e => setNewJanAadhar(e.target.value)}
                      className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-0.5">{isHi ? 'निवास का गाँव / ढाणी' : 'Village / Dhani Name'}</label>
                  <input
                    type="text"
                    placeholder="e.g. Rajputon Ki Dhani"
                    value={newVillage}
                    onChange={e => setNewVillage(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                  />
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 text-[11px] text-amber-900 dark:text-amber-200 flex justify-between items-center font-bold">
                <span>{isHi ? 'गणना अनुसार देय राशि:' : 'Calculated Monthly Rate:'}</span>
                <span className="text-sm font-black text-emerald-700 dark:text-emerald-400 font-mono">₹ {newAttendanceDays * getDailyRateForClass(newClass)}</span>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs transition-all shadow-sm active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>{isHi ? 'छात्र विवरण सुरक्षित करें' : 'Save Transport Record'}</span>
              </button>
            </form>

            {/* Student Claims Roster Table */}
            <div className="lg:col-span-8 space-y-3">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder={isHi ? 'छात्र नाम, SR नंबर या ढाणी से खोजें...' : 'Search student, SR No or Village...'}
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={selectedMonth}
                    onChange={e => setSelectedMonth(e.target.value)}
                    className="p-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold shrink-0"
                  >
                    <option value="July 2026">July 2026</option>
                    <option value="August 2026">August 2026</option>
                    <option value="September 2026">September 2026</option>
                    <option value="October 2026">October 2026</option>
                    <option value="November 2026">November 2026</option>
                  </select>

                  <select
                    value={filterClass}
                    onChange={e => setFilterClass(e.target.value)}
                    className="p-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shrink-0"
                  >
                    <option value="All">All Classes</option>
                    <option value="Class 1">Primary (1-5)</option>
                    <option value="Class 6">Upper Primary (6-8)</option>
                    <option value="Class 9">Sec (9-10 Girls)</option>
                  </select>

                  <button
                    onClick={() => handlePrintDocument('monthly-claim-print-area', 'Monthly_Transport_Voucher_Claim')}
                    className="px-3 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs flex items-center justify-center gap-1 shadow-sm shrink-0 active:scale-95 cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>{isHi ? 'मासिक बिल प्रिंट' : 'Print Claim'}</span>
                  </button>
                </div>
              </div>

              {/* Roster Table */}
              <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 max-h-[420px] overflow-y-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="sticky top-0 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-extrabold border-b border-slate-200 dark:border-slate-700 z-10">
                    <tr>
                      <th className="p-2.5">SR#</th>
                      <th className="p-2.5">{isHi ? 'छात्र का नाम व पिता' : 'Student & Father'}</th>
                      <th className="p-2.5">{isHi ? 'कक्षा' : 'Class'}</th>
                      <th className="p-2.5">{isHi ? 'दूरी (KM)' : 'Dist'}</th>
                      <th className="p-2.5">{isHi ? 'उपस्थिति' : 'Att. Days'}</th>
                      <th className="p-2.5">{isHi ? 'दर/दिन' : 'Rate/day'}</th>
                      <th className="p-2.5">{isHi ? 'मासिक दावा' : 'Monthly Claim'}</th>
                      <th className="p-2.5">{isHi ? 'डीबीटी/जन आधार' : 'DBT Linked'}</th>
                      <th className="p-2.5 text-right">{isHi ? 'हटाएं' : 'Action'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                    {filteredStudents.length > 0 ? (
                      filteredStudents.map((s) => (
                        <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                          <td className="p-2.5 font-mono text-[11px] font-bold text-slate-500">{s.srNo}</td>
                          <td className="p-2.5">
                            <div className="font-bold text-slate-900 dark:text-slate-100">{s.studentName}</div>
                            <div className="text-[10px] text-slate-500">{s.fatherName || 'Guardian'} • {s.villageDhani}</div>
                          </td>
                          <td className="p-2.5">
                            <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-[10px] font-bold">
                              {s.className}
                            </span>
                          </td>
                          <td className="p-2.5 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                            {s.exactDistanceKm ? `${s.exactDistanceKm} km` : s.distanceCategory}
                          </td>
                          <td className="p-2.5 font-mono font-bold text-blue-600 dark:text-blue-400">
                            {s.attendanceDays || 22} / {totalShiviraDays}
                          </td>
                          <td className="p-2.5 font-mono text-slate-600 dark:text-slate-300">
                            ₹{s.dailyRate || getDailyRateForClass(s.className)}
                          </td>
                          <td className="p-2.5 font-mono font-black text-emerald-700 dark:text-emerald-300 text-sm">
                            ₹{s.monthlySubsidyAmount}
                          </td>
                          <td className="p-2.5">
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold block w-max ${
                              s.bankAccountStatus === 'Verified'
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            }`}>
                              {s.bankAccountStatus === 'Verified' ? `✓ ${s.janAadharNo || 'DBT OK'}` : '⚠️ Pending'}
                            </span>
                          </td>
                          <td className="p-2.5 text-right">
                            <button
                              onClick={() => handleDeleteStudent(s.id)}
                              className="p-1 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                              title="हटाएं"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={9} className="p-6 text-center text-slate-500">
                          {isHi ? 'कोई रिकॉर्ड नहीं मिला' : 'No records found'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* HIDDEN PRINT LAYOUT FOR MONTHLY CLAIMS */}
          <div id="monthly-claim-print-area" className="hidden">
            <div className="title">राजस्थान स्कूल शिक्षा परिषद (समग्र शिक्षा) - परिवहन भत्ता मासिक दावा पत्र</div>
            <div className="subtitle">विद्यालय: {schoolProfile.schoolName || 'Government Senior Secondary School'} | डाइस कोड: {schoolProfile.diseCode || '08120304501'} | माह: {selectedMonth}</div>
            
            <table>
              <thead>
                <tr>
                  <th>क्र.सं.</th>
                  <th>एसआर#</th>
                  <th>विद्यार्थी का नाम</th>
                  <th>पिता का नाम</th>
                  <th>कक्षा</th>
                  <th>दूरी (किमी)</th>
                  <th>उपस्थिति दिवस</th>
                  <th>दर/दिवस</th>
                  <th>कुल दावा राशि (₹)</th>
                  <th>जन आधार / बैंक स्टेटस</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((s, idx) => (
                  <tr key={s.id}>
                    <td>{idx + 1}</td>
                    <td>{s.srNo}</td>
                    <td><strong>{s.studentName}</strong></td>
                    <td>{s.fatherName || '-'}</td>
                    <td>{s.className}</td>
                    <td>{s.exactDistanceKm || s.distanceCategory} KM</td>
                    <td>{s.attendanceDays || 22}</td>
                    <td>₹{s.dailyRate || getDailyRateForClass(s.className)}</td>
                    <td><strong>₹{s.monthlySubsidyAmount}</strong></td>
                    <td>{s.bankAccountStatus === 'Verified' ? `सत्यापित (${s.janAadharNo})` : 'लंबित'}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ marginTop: '15px', fontWeight: 'bold', textAlign: 'right', fontSize: '13px' }}>
              कुल पात्र विद्यार्थी: {filteredStudents.length} | कुल दावा स्वीकृत राशि: ₹ {totalMonthlyClaim.toLocaleString('en-IN')}
            </div>

            <div className="sig-box">
              <div>
                <p>प्रभारी (परिवहन भत्ता)</p>
                <p>हस्ताक्षर ............................</p>
              </div>
              <div>
                <p>संस्थाप्रधान (मय सील एवं दिनांक)</p>
                <p>हस्ताक्षर ............................</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 2: VERBATIM OFFICIAL GUIDELINES & RULES 2026-27 */}
      {/* ========================================================================= */}
      {activeTab === 'rules' && (
        <div className="space-y-4 animate-fadeIn text-xs text-slate-800 dark:text-slate-200">
          <div className="p-4 bg-emerald-50/80 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800 flex items-start gap-3">
            <Info className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-extrabold text-sm text-emerald-900 dark:text-emerald-100">
                राजस्थान स्कूल शिक्षा परिषद - समग्र शिक्षा (क्रमांक: रास्कूशि/जय/वै.शि./TV दिशा-निर्देश 2026-27)
              </h4>
              <p className="text-slate-600 dark:text-slate-300 text-xs mt-1">
                कक्षा 1 से 8 के विद्यार्थियों एवं कक्षा 9 व 10 की बालिकाओं हेतु ट्रांसपोर्ट वाउचर योजना - दिशा निर्देश 2026-27 (डीबीटी किए जाने के संदर्भ में)
              </p>
            </div>
          </div>

          {/* ACCORDION RULES LIST */}
          <div className="space-y-3">
            
            {/* 1. उद्देश्य (Objectives) */}
            <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900">
              <button
                onClick={() => setOpenRuleSection(openRuleSection === 'sec-1' ? '' : 'sec-1')}
                className="w-full p-3.5 bg-slate-50 dark:bg-slate-800/80 text-left font-extrabold text-sm flex justify-between items-center text-slate-800 dark:text-slate-100 cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-xs">1</span>
                  <span>1. उद्देश्य (Objectives)</span>
                </span>
                {openRuleSection === 'sec-1' ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
              </button>

              {openRuleSection === 'sec-1' && (
                <div className="p-4 space-y-2 leading-relaxed border-t border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                  <p>
                    <strong>आरटीई नियमों के तहत</strong> छितरी, कम आबादी क्षेत्रों एवं ढाणियों, जहां निर्धारित मापदंडानुसार विद्यालय का संचालन संभव नहीं है, में निवास कर रहे 6 से 14 आयु वर्ग के बालक-बालिकाओं को सहज एवं गुणवत्तापूर्ण शिक्षा के लिए उनके वास स्थान से निकटस्थ विद्यालयों में अध्ययन हेतु सुगमतापूर्वक पहुंचाने के उद्देश्य से ग्रामीण क्षेत्र के <strong>कक्षा 1 से 8 पात्र बालक-बालिकाओं</strong> हेतु ट्रांसपोर्ट वाउचर सुविधा का प्रावधान किया गया है।
                  </p>
                  <p>
                    बालिका शिक्षा में नामांकन दर, ठहराव दर बढ़ाने व जेंडर गैप कम करने की दृष्टि से तथा बालिका सुरक्षा को ध्यान में रखते हुए <strong>कक्षा 9 व 10 की पात्र/चयनित बालिकाओं</strong> को ट्रांसपोर्ट वाउचर की सुविधा से लाभांवित किया जाना है।
                  </p>
                </div>
              )}
            </div>

            {/* 2. पात्रता (Eligibility Criteria) */}
            <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900">
              <button
                onClick={() => setOpenRuleSection(openRuleSection === 'sec-2' ? '' : 'sec-2')}
                className="w-full p-3.5 bg-slate-50 dark:bg-slate-800/80 text-left font-extrabold text-sm flex justify-between items-center text-slate-800 dark:text-slate-100 cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-xs">2</span>
                  <span>2. ट्रांसपोर्ट वाउचर योजना से लाभांवित होने हेतु पात्रता (सारणी - 1)</span>
                </span>
                {openRuleSection === 'sec-2' ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
              </button>

              {openRuleSection === 'sec-2' && (
                <div className="p-4 space-y-3 border-t border-slate-200 dark:border-slate-800">
                  <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-slate-100 dark:bg-slate-800 font-extrabold text-slate-800 dark:text-slate-200">
                        <tr>
                          <th className="p-3 border-b border-slate-200 dark:border-slate-700">कक्षा 1 से 8 के बालक-बालिकाओं हेतु</th>
                          <th className="p-3 border-b border-slate-200 dark:border-slate-700">कक्षा 9 से 10 की बालिकाओं हेतु</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-xs">
                        <tr>
                          <td className="p-3">
                            ग्रामीण क्षेत्र के राजकीय विद्यालयों में नामांकित <strong>कक्षा 1 से 5</strong> के ऐसे विद्यार्थी, जिनके वास स्थान से <strong>1 किमी की परिधि</strong> में कोई राजकीय प्राथमिक विद्यालय उपलब्ध नहीं है एवं उन्हें 1 किमी से अधिक की दूरी तक जाना पड़ता है।
                          </td>
                          <td className="p-3">
                            ग्रामीण क्षेत्र के राजकीय माध्यमिक/उच्च माध्यमिक विद्यालयों की <strong>कक्षा 9 से 10</strong> में अध्ययन हेतु <strong>5 किमी से अधिक की दूरी</strong> से आने वाली बालिकाएं।
                          </td>
                        </tr>
                        <tr>
                          <td className="p-3">
                            ग्रामीण क्षेत्र के राजकीय विद्यालयों में नामांकित <strong>कक्षा 6 से 8</strong> के ऐसे विद्यार्थी, जिनके वास स्थान से <strong>3 किमी से अधिक की दूरी</strong> तक कोई राजकीय उच्च प्राथमिक विद्यालय उपलब्ध नहीं है एवं उन्हें 3 किमी से अधिक दूरी तक जाना पड़ता है।
                          </td>
                          <td className="p-3 text-slate-400 font-mono text-center">—</td>
                        </tr>
                        <tr>
                          <td className="p-3">
                            <strong>मॉडल विद्यालयों</strong> की उसी पंचायत समिति की कक्षा 6 से 8 की बालिकाएं, जिनके निवास स्थान से विद्यालय की दूरी <strong>3 किमी से अधिक</strong> है।
                          </td>
                          <td className="p-3">
                            <strong>मॉडल विद्यालयों</strong> की उसी पंचायत समिति की कक्षा 9 से 10 की बालिकाएं, जिनके निवास स्थान से विद्यालय की दूरी <strong>5 किमी से अधिक</strong> है।
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* 3. निर्धारित राशि की दर (Rates) */}
            <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900">
              <button
                onClick={() => setOpenRuleSection(openRuleSection === 'sec-3' ? '' : 'sec-3')}
                className="w-full p-3.5 bg-slate-50 dark:bg-slate-800/80 text-left font-extrabold text-sm flex justify-between items-center text-slate-800 dark:text-slate-100 cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-xs">3</span>
                  <span>3. निर्धारित राशि की दर (सारणी - 2)</span>
                </span>
                {openRuleSection === 'sec-3' ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
              </button>

              {openRuleSection === 'sec-3' && (
                <div className="p-4 space-y-3 border-t border-slate-200 dark:border-slate-800">
                  <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-slate-100 dark:bg-slate-800 font-extrabold text-slate-800 dark:text-slate-200">
                        <tr>
                          <th className="p-2.5">कक्षा</th>
                          <th className="p-2.5">विद्यालय का प्रकार</th>
                          <th className="p-2.5">वास स्थान से दूरी</th>
                          <th className="p-2.5">श्रेणी</th>
                          <th className="p-2.5">दर (प्रति उपस्थिति दिवस)</th>
                          <th className="p-2.5">प्रति विद्यार्थी PAB स्वीकृत बजट</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-mono text-xs">
                        <tr>
                          <td className="p-2.5 font-bold">1 से 5</td>
                          <td className="p-2.5 font-sans">राजकीय विद्यालय</td>
                          <td className="p-2.5">1 किमी से अधिक</td>
                          <td className="p-2.5 font-sans">बालक व बालिका</td>
                          <td className="p-2.5 font-bold text-emerald-600">10 रुपये</td>
                          <td className="p-2.5 font-bold">1,500/- रुपये</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 font-bold" rowSpan={2}>6 से 8</td>
                          <td className="p-2.5 font-sans">राजकीय विद्यालय</td>
                          <td className="p-2.5">3 किमी से अधिक</td>
                          <td className="p-2.5 font-sans">बालक व बालिका</td>
                          <td className="p-2.5 font-bold text-emerald-600">15 रुपये</td>
                          <td className="p-2.5 font-bold" rowSpan={2}>1,500/- रुपये</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 font-sans">स्वामी विवेकानन्द मॉडल स्कूल</td>
                          <td className="p-2.5">3 किमी से अधिक (उसी पं.स.)</td>
                          <td className="p-2.5 font-sans">बालिका</td>
                          <td className="p-2.5 font-bold text-emerald-600">15 रुपये</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 font-bold" rowSpan={2}>9 व 10</td>
                          <td className="p-2.5 font-sans">राजकीय विद्यालय</td>
                          <td className="p-2.5">5 किमी से अधिक ग्रामीण क्षेत्र</td>
                          <td className="p-2.5 font-sans">बालिका</td>
                          <td className="p-2.5 font-bold text-emerald-600">20 रुपये</td>
                          <td className="p-2.5 font-bold" rowSpan={2}>2,700/- रुपये</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 font-sans">स्वामी विवेकानन्द मॉडल स्कूल</td>
                          <td className="p-2.5">5 किमी से अधिक (उसी पं.स.)</td>
                          <td className="p-2.5 font-sans">बालिका</td>
                          <td className="p-2.5 font-bold text-emerald-600">20 रुपये</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* 4. ध्यान देने योग्य महत्वपूर्ण बातें (Rules 4.1 to 4.5) */}
            <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900">
              <button
                onClick={() => setOpenRuleSection(openRuleSection === 'sec-4' ? '' : 'sec-4')}
                className="w-full p-3.5 bg-slate-50 dark:bg-slate-800/80 text-left font-extrabold text-sm flex justify-between items-center text-slate-800 dark:text-slate-100 cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-xs">4</span>
                  <span>4. ध्यान देने योग्य महत्वपूर्ण बातें (Verbatim Rules 4.1 to 4.5)</span>
                </span>
                {openRuleSection === 'sec-4' ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
              </button>

              {openRuleSection === 'sec-4' && (
                <div className="p-4 space-y-2 border-t border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 leading-relaxed">
                  <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 rounded-xl">
                    <strong>4.1 :</strong> सत्र 2026-27 में समग्र शिक्षा की कार्ययोजना में <strong>कक्षा 11 एवं 12 की बालिकाओं के लिए ट्रांसपोर्ट वाउचर योजना का प्रावधान स्वीकृत नहीं किया गया है।</strong>
                  </div>
                  <p>
                    <strong>4.2 :</strong> विद्यार्थियों के निवास स्थान से विद्यालय की दूरी तथा कारण सही एवं भली प्रकार जांचकर शाला दर्पण पर प्रविष्ट करें। त्रुटि के कारण पात्र विद्यार्थी योजना से वंचित रहने एवं अपात्र के चयनित होने पर समस्त जिम्मेदारी संबंधित संस्था प्रधान की रहेगी।
                  </p>
                  <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 rounded-xl">
                    <strong>4.3 :</strong> कक्षा 9 में प्रवेश लेने वाली बालिका <strong>साइकिल योजना से अथवा नियमानुसार ट्रांसपोर्ट वाउचर योजना में से किसी भी एक योजना</strong> का लाभ ले सकती है। किसी भी स्थिति में कक्षा 9 व 10 की बालिकाओं को उक्त दोनों योजना से एक साथ लाभांवित नहीं किया जा सकेगा।
                  </div>
                  <p>
                    <strong>4.4 :</strong> शिविरा पंचांग के कार्य दिवसों की गणना के आधार पर परिषद कार्यालय से ट्रांसपोर्ट वाउचर की राशि जारी की जाती है। संस्था प्रधान द्वारा पात्र विद्यार्थियों को वास्तविक उपस्थिति एवं प्राविधानित बजट के आधार पर ट्रांसपोर्ट वाउचर/सुविधा राशि जारी की जाएगी।
                  </p>
                  <p>
                    <strong>4.5 :</strong> संस्था प्रधान द्वारा विद्यार्थियों की शाला दर्पण पर निर्धारित प्रपत्र <strong>'विद्यार्थी विस्तृत विवरण प्रपत्र-9'</strong> में विद्यार्थी के निवास स्थान से विद्यालय की दूरी अंकित कर लॉक किया जाएगा। तत्पश्चात दूरी सम्बन्धी प्रविष्टि में किसी भी प्रकार के संशोधन होने पर इसे संबंधित CBEO कार्यालय से करवाया जा सकेगा।
                  </p>
                </div>
              )}
            </div>

            {/* 5. दायित्व (Responsibilities) */}
            <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900">
              <button
                onClick={() => setOpenRuleSection(openRuleSection === 'sec-5' ? '' : 'sec-5')}
                className="w-full p-3.5 bg-slate-50 dark:bg-slate-800/80 text-left font-extrabold text-sm flex justify-between items-center text-slate-800 dark:text-slate-100 cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-xs">5</span>
                  <span>5. संस्था प्रधान / SMC / SDMC के दायित्व (सारणी - 3)</span>
                </span>
                {openRuleSection === 'sec-5' ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
              </button>

              {openRuleSection === 'sec-5' && (
                <div className="p-4 space-y-3 border-t border-slate-200 dark:border-slate-800">
                  <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-slate-100 dark:bg-slate-800 font-extrabold text-slate-800 dark:text-slate-200">
                        <tr>
                          <th className="p-2.5">दायित्व अधिकारी</th>
                          <th className="p-2.5">किये / करवाये जाने वाले कार्य</th>
                          <th className="p-2.5">प्रपत्र</th>
                          <th className="p-2.5">उप-प्रपत्र</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-xs">
                        <tr>
                          <td className="p-2.5 font-bold">समस्त संस्था प्रधान</td>
                          <td className="p-2.5">ट्रांसपोर्ट वाउचर योजना हेतु पात्र विद्यार्थियों या उनके अभिभावकों से भरवाया जायेगा।</td>
                          <td className="p-2.5 font-mono font-bold">प्रपत्र - 1</td>
                          <td className="p-2.5 font-mono">भाग-क</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 font-bold">समस्त संस्था प्रधान</td>
                          <td className="p-2.5">प्रपत्र-1 की जांच एवं प्रमाणीकरण करना</td>
                          <td className="p-2.5 font-mono font-bold">प्रपत्र - 1</td>
                          <td className="p-2.5 font-mono">भाग-ख</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 font-bold">समस्त संस्था प्रधान</td>
                          <td className="p-2.5">शाला दर्पण पोर्टल पर प्रविष्टि का अंकन कर प्रमाणीकरण करना।</td>
                          <td className="p-2.5 font-mono font-bold">प्रपत्र - 2</td>
                          <td className="p-2.5 font-mono">—</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 3: PRAPATRA-1 (BHAG A) STUDENT / GUARDIAN APPLICATION */}
      {/* ========================================================================= */}
      {activeTab === 'prapatra1_a' && (
        <div className="space-y-5 animate-fadeIn">
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-700 pb-3">
              <div>
                <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-emerald-600" />
                  <span>प्रपत्र - 1 (भाग-क) : विद्यार्थी / अभिभावक प्रार्थना पत्र</span>
                </h4>
                <p className="text-xs text-slate-500">
                  Fill student details to generate official transport voucher application form (Prapatra-1 Bhag A).
                </p>
              </div>

              <button
                onClick={() => handlePrintDocument('prapatra1-a-print-area', 'Prapatra_1_Bhag_A_Application_Form')}
                className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md active:scale-95 cursor-pointer"
              >
                <Printer className="w-4 h-4 text-amber-300" />
                <span>{isHi ? 'प्रपत्र-1 (भाग-क) प्रिंट' : 'Print Bhag A'}</span>
              </button>
            </div>

            {/* Input Controls Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">छात्र/छात्रा का नाम</label>
                <input
                  type="text"
                  value={p1StudentName}
                  onChange={e => setP1StudentName(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">पिता/अभिभावक का नाम</label>
                <input
                  type="text"
                  value={p1FatherName}
                  onChange={e => setP1FatherName(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">कक्षा</label>
                <input
                  type="text"
                  value={p1Class}
                  onChange={e => setP1Class(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">निवास स्थान का पता / ढाणी</label>
                <input
                  type="text"
                  value={p1Address}
                  onChange={e => setP1Address(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">विद्यालय से दूरी (KM)</label>
                <input
                  type="text"
                  value={p1Distance}
                  onChange={e => setP1Distance(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold font-mono"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">पात्रता कारण विकल्प (I, II, III, IV, V)</label>
                <select
                  value={p1ReasonIndex}
                  onChange={e => setP1ReasonIndex(e.target.value as any)}
                  className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
                >
                  <option value="I">I. कक्षा 1-5 (1 किमी परिधि में राजकीय विद्यालय उपलब्ध नहीं है)</option>
                  <option value="II">II. कक्षा 6-8 (3 किमी परिधि में राजकीय उ.प्रा. विद्यालय उपलब्ध नहीं है)</option>
                  <option value="III">III. कक्षा 9-10 (5 किमी परिधि में विद्यालय नहीं है व साइकिल योजना का लाभ नहीं लिया)</option>
                  <option value="IV">IV. स्वामी विवेकानन्द मॉडल स्कूल कक्षा 6-8 बालिका (3 किमी से अधिक दूरी)</option>
                  <option value="V">V. स्वामी विवेकानन्द मॉडल स्कूल कक्षा 9-10 बालिका (5 किमी से अधिक दूरी)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">परिवहन विकल्प</label>
                <select
                  value={p1TransportChoice}
                  onChange={e => setP1TransportChoice(e.target.value as any)}
                  className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
                >
                  <option value="SELF">स्वयं के स्तर पर ट्रांसपोर्ट व्यवस्था</option>
                  <option value="SMC">SMC/SDMC के माध्यम से सामूहिक परिवहन</option>
                </select>
              </div>
            </div>
          </div>

          {/* REAL TIME PREVIEW CARD FOR PRAPATRA-1 (BHAG A) WITH SIDE BOXES */}
          <div id="prapatra1-a-print-area" className="p-6 sm:p-8 bg-white dark:bg-slate-950 border-4 border-double border-slate-900 dark:border-slate-300 rounded-xl shadow-xl space-y-6 text-slate-900 dark:text-slate-100 text-xs relative border-l-[12px] border-r-[12px] border-l-emerald-900 border-r-emerald-900 dark:border-l-emerald-700 dark:border-r-emerald-700">
            {/* Top Side Box Info */}
            <div className="flex justify-between items-start border-b-2 border-slate-900 dark:border-slate-400 pb-3">
              <div className="border border-slate-900 dark:border-slate-400 p-2 text-[10px] font-bold">
                <p>प्रपत्र संख्या: P1/2026/04</p>
                <p>राजकाज संदर्भ: RJ-SCH-TR-881</p>
              </div>
              <div className="text-center space-y-1">
                <h3 className="text-base font-black uppercase tracking-wide">राजस्थान स्कूल शिक्षा परिषद (समग्र शिक्षा)</h3>
                <h4 className="text-sm font-extrabold uppercase text-emerald-800 dark:text-emerald-400">प्रपत्र – 1 (भाग–क)</h4>
                <p className="text-[11px] font-bold">ट्रांसपोर्ट वाउचर योजना के अंतर्गत लाभांवित किए जाने हेतु प्रार्थना पत्र</p>
                <p className="text-[10px] italic">(विद्यार्थी / अभिभावक द्वारा भरा जायेगा)</p>
              </div>
              <div className="border border-slate-900 dark:border-slate-400 p-2 text-[10px] font-bold text-right">
                <p>सत्र: 2026-27</p>
                <p>प्रमाणित प्रति: मूल</p>
              </div>
            </div>

            <div className="space-y-2.5 leading-relaxed text-xs">
              <p>1. छात्र/छात्रा का नाम व पता : <strong>{p1StudentName}</strong>, <strong>{p1Address}</strong></p>
              <p>2. पिता/अभिभावक का नाम : <strong>{p1FatherName}</strong></p>
              <p>3. वर्तमान विद्यालय का नाम : <strong>{schoolProfile.schoolName || 'Govt Sr Sec School'}</strong> (डाइस कोड: <strong>{schoolProfile.diseCode || '08120304501'}</strong>)</p>
              <p>4. कक्षा : <strong>{p1Class}</strong> | निवास स्थान का पता : <strong>{p1Address}</strong></p>
              <p>5. निवास स्थान से विद्यालय की दूरी : <strong>{p1Distance} किमी०</strong></p>
            </div>

            <div className="my-3 space-y-2 bg-slate-50 dark:bg-slate-900 p-4 border-2 border-slate-800 dark:border-slate-600 rounded-lg">
              <p className="font-extrabold text-xs">A. निम्न कारणों में से लागू कारण पर (✓) का निशान लगाएँ :-</p>
              
              <p className="pl-3">
                {p1ReasonIndex === 'I' ? '[✓]' : '[ ]'} I. ग्रामीण क्षेत्र के राजकीय विद्यालयों की कक्षा 1 से 5 के विद्यार्थियों हेतु - निवास स्थान के 1 किमी परिधि में राजकीय प्राथमिक विद्यालय उपलब्ध नहीं है।
              </p>
              <p className="pl-3">
                {p1ReasonIndex === 'II' ? '[✓]' : '[ ]'} II. ग्रामीण क्षेत्र के राजकीय विद्यालयों की कक्षा 6 से 8 के विद्यार्थियों हेतु - निवास स्थान के 3 किमी परिधि में राजकीय उच्च प्राथमिक विद्यालय उपलब्ध नहीं है।
              </p>
              <p className="pl-3">
                {p1ReasonIndex === 'III' ? '[✓]' : '[ ]'} III. ग्रामीण क्षेत्र के राजकीय विद्यालयों की कक्षा 9 से 10 की बालिकाओं हेतु - निवास स्थान से विद्यालय की दूरी 5 किमी से अधिक है व बालिका साइकिल योजना से लाभांवित नहीं है।
              </p>
              <p className="pl-3">
                {p1ReasonIndex === 'IV' ? '[✓]' : '[ ]'} IV. स्वामी विवेकानन्द मॉडल स्कूल कक्षा 6 से 8 बालिका हेतु - दूरी 3 किमी से अधिक है।
              </p>
              <p className="pl-3">
                {p1ReasonIndex === 'V' ? '[✓]' : '[ ]'} V. स्वामी विवेकानन्द मॉडल स्कूल कक्षा 9 से 10 बालिका हेतु - दूरी 5 किमी से अधिक है।
              </p>
            </div>

            <div className="my-3 space-y-1.5 bg-slate-50 dark:bg-slate-900 p-4 border-2 border-slate-800 dark:border-slate-600 rounded-lg">
              <p className="font-extrabold text-xs">VII. ट्रांसपोर्ट वाउचर योजना हेतु विकल्प :-</p>
              <p className="pl-3">{p1TransportChoice === 'SMC' ? '[✓]' : '[ ]'} SMC / SDMC के माध्यम से सामूहिक परिवहन सुविधा ली जानी है।</p>
              <p className="pl-3">{p1TransportChoice === 'SELF' ? '[✓]' : '[ ]'} स्वयं के स्तर पर ट्रांसपोर्ट व्यवस्था की जानी है।</p>
            </div>

            <div className="flex justify-between items-end pt-8 font-bold text-xs border-t border-slate-400">
              <div className="text-center">
                <p>................................................</p>
                <p>(अभिभावक / संरक्षक के हस्ताक्षर)</p>
              </div>
              <div className="text-center">
                <p>................................................</p>
                <p>(छात्र / छात्रा के हस्ताक्षर)</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 4: PRAPATRA-1 (BHAG B) FORM B MAKER WITH CLASS STUDENT COUNT EDITOR */}
      {/* ========================================================================= */}
      {activeTab === 'prapatra1_b' && (
        <div className="space-y-5 animate-fadeIn">
          <div className="p-4 bg-amber-50/80 dark:bg-amber-950/30 rounded-2xl border border-amber-200 dark:border-amber-800 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-amber-200 dark:border-amber-800 pb-3">
              <div>
                <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-600 shrink-0" />
                  <span>प्रपत्र - 1 (भाग-ख) मेकर : संस्थाप्रधान प्रमाणीकरण प्रपत्र</span>
                </h4>
                <p className="text-xs text-slate-500">
                  Enter number of eligible students for each class (Class 1-10) to auto-generate official Prapatra-1 Part B format ready to print.
                </p>
              </div>

              <button
                onClick={() => handlePrintDocument('prapatra1-b-print-area', 'Prapatra_1_Bhag_B_HM_Verification_Certificate')}
                className="px-4 py-2 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md active:scale-95 cursor-pointer shrink-0"
              >
                <Printer className="w-4 h-4 text-white" />
                <span>{isHi ? 'प्रपत्र-1 (भाग-ख) प्रिंट' : 'Print Bhag B'}</span>
              </button>
            </div>

            {/* CLASS-WISE STUDENT COUNT EDITOR GRID */}
            <div className="space-y-3">
              <div className="font-extrabold text-xs text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-600" />
                <span>कक्षावार पात्र विद्यार्थियों की संख्या जोड़ें/संपादित करें (Class 1 to Class 10):</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-xs">
                {Object.keys(p1ClassCounts).map((clsKey) => (
                  <div key={clsKey} className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                    <label className="block font-extrabold text-[11px] text-slate-700 dark:text-slate-300">{clsKey}</label>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setP1ClassCounts(prev => ({ ...prev, [clsKey]: Math.max(0, (prev[clsKey] || 0) - 1) }))}
                        className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-black text-sm flex items-center justify-center cursor-pointer"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="0"
                        value={p1ClassCounts[clsKey] ?? 0}
                        onChange={e => {
                          const val = parseInt(e.target.value) || 0;
                          setP1ClassCounts(prev => ({ ...prev, [clsKey]: val }));
                        }}
                        className="w-full p-1 text-center font-bold text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                      />
                      <button
                        type="button"
                        onClick={() => setP1ClassCounts(prev => ({ ...prev, [clsKey]: (prev[clsKey] || 0) + 1 }))}
                        className="w-7 h-7 rounded-lg bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-950 dark:hover:bg-emerald-900 text-emerald-800 dark:text-emerald-300 font-black text-sm flex items-center justify-center cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-emerald-100/60 dark:bg-emerald-950/40 rounded-xl border border-emerald-300 dark:border-emerald-800 flex justify-between items-center text-xs font-bold text-emerald-900 dark:text-emerald-200">
                <span>कुल योग (Total Eligible Transport Students):</span>
                <span className="text-base font-black px-3 py-1 bg-emerald-700 text-white rounded-lg">
                  {Object.values(p1ClassCounts).reduce((acc: number, val: number) => acc + val, 0)} विद्यार्थी
                </span>
              </div>
            </div>
          </div>

          {/* REAL TIME PREVIEW CARD FOR PRAPATRA-1 (BHAG B) WITH SIDE BOXES */}
          <div id="prapatra1-b-print-area" className="p-6 sm:p-8 bg-white dark:bg-slate-950 border-4 border-double border-slate-900 dark:border-slate-300 rounded-xl shadow-xl space-y-6 text-slate-900 dark:text-slate-100 text-xs relative border-l-[12px] border-r-[12px] border-l-amber-900 border-r-amber-900 dark:border-l-amber-700 dark:border-r-amber-700">
            <div className="flex justify-between items-start border-b-2 border-slate-900 dark:border-slate-400 pb-3">
              <div className="border border-slate-900 dark:border-slate-400 p-2 text-[10px] font-bold">
                <p>प्रपत्र-1 (भाग-ख)</p>
                <p>कार्यालय उपयोग प्रपत्र</p>
              </div>
              <div className="text-center space-y-1">
                <h3 className="text-base font-black uppercase tracking-wide">राजस्थान स्कूल शिक्षा परिषद (समग्र शिक्षा)</h3>
                <h4 className="text-sm font-extrabold uppercase text-amber-800 dark:text-amber-400">प्रपत्र – 1 (भाग–ख)</h4>
                <p className="text-[11px] font-bold">(कार्यालय उपयोग हेतु संस्था प्रधान द्वारा प्रमाणीकरण प्रपत्र)</p>
              </div>
              <div className="border border-slate-900 dark:border-slate-400 p-2 text-[10px] font-bold text-right">
                <p>सत्र: 2026-27</p>
                <p>SMC/SDMC प्रेषित</p>
              </div>
            </div>

            <p className="leading-relaxed text-xs sm:text-sm">
              प्रमाणित किया जाता है कि <strong>{schoolProfile.schoolName || 'Govt Sr Sec School'}</strong> (डाइस कोड: <strong>{schoolProfile.diseCode || '08120304501'}</strong>) विद्यालय में अध्ययनरत बालक-बालिकाओं में से कुल <strong>{Object.values(p1ClassCounts).reduce((acc: number, val: number) => acc + val, 0)}</strong> बालक-बालिकाओं ने ट्रांसपोर्ट वाउचर योजना के लिये आवेदन किया है। इनके सभी तथ्य सही पाये गये हैं। ट्रांसपोर्ट वाउचर योजना 2026-27 के दिशा-निर्देशानुसार अनुशंसा हेतु SMC/SDMC के समक्ष प्रस्तुत है। कक्षावार पात्र विद्यार्थियों की संख्या निम्न प्रकार है :
            </p>

            <table className="w-full border-collapse border-2 border-slate-900 dark:border-slate-400 my-4 text-center text-xs">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800 font-extrabold border-b-2 border-slate-900">
                  <th className="border border-slate-900 p-2">क्र०सं०</th>
                  <th className="border border-slate-900 p-2">कक्षा</th>
                  <th className="border border-slate-900 p-2">पात्र / चयनित विद्यार्थी संख्या</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(p1ClassCounts).map(([cls, cnt], i) => (
                  <tr key={cls} className="border-b border-slate-300">
                    <td className="border border-slate-900 p-1.5">{i + 1}</td>
                    <td className="border border-slate-900 p-1.5 font-bold">{cls}</td>
                    <td className="border border-slate-900 p-1.5 font-bold text-emerald-800 dark:text-emerald-300 text-sm">{cnt}</td>
                  </tr>
                ))}
                <tr className="bg-slate-100 dark:bg-slate-800 font-extrabold border-t-2 border-slate-900">
                  <td colSpan={2} className="border border-slate-900 p-2 text-right">कुल योग (Total Eligible Students) :</td>
                  <td className="border border-slate-900 p-2 text-base font-black text-amber-800 dark:text-amber-300">
                    {Object.values(p1ClassCounts).reduce((acc: number, val: number) => acc + val, 0)}
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="flex justify-between items-end pt-8 font-bold text-xs border-t border-slate-400">
              <div>
                <p>दिनांक: ....................</p>
                <p>स्थान: ....................</p>
              </div>
              <div className="text-right space-y-1">
                <p>हस्ताक्षर संस्थाप्रधान</p>
                <p>मय सील एवं हस्ताक्षर</p>
                <p>विद्यालय: {schoolProfile.schoolName || 'Govt Sr Sec School'}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 5: PRAPATRA-2 SHALA DARPAN CERTIFICATE GENERATOR */}
      {/* ========================================================================= */}
      {activeTab === 'prapatra2' && (
        <div className="space-y-5 animate-fadeIn">
          <div className="p-4 bg-purple-50/80 dark:bg-purple-950/30 rounded-2xl border border-purple-200 dark:border-purple-800 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-purple-200 dark:border-purple-800 pb-3">
              <div>
                <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <Award className="w-5 h-5 text-purple-600 shrink-0" />
                  <span>प्रपत्र - 2 : संस्थाप्रधान द्वारा प्रविष्टि का शाला दर्पण पर अंकन व स्वीकृति प्रमाणित पत्र</span>
                </h4>
                <p className="text-xs text-slate-500">
                  Official certificate confirming Shala Darpan Prapatra-9 distance entries locking for PEEO/CBEO office submission.
                </p>
              </div>

              <button
                onClick={() => handlePrintDocument('prapatra2-print-area', 'Prapatra_2_Shala_Darpan_Verification_Certificate')}
                className="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md active:scale-95 cursor-pointer shrink-0"
              >
                <Printer className="w-4 h-4 text-white" />
                <span>{isHi ? 'प्रपत्र-2 प्रिंट / PDF डाउनलोड' : 'Print Prapatra-2'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">विद्यालय का नाम</label>
                <input
                  type="text"
                  value={p2SchoolName}
                  onChange={e => setP2SchoolName(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">शाला दर्पण / डाइस कोड</label>
                <input
                  type="text"
                  value={p2SchoolCode}
                  onChange={e => setP2SchoolCode(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">कुल स्वीकृत पात्र विद्यार्थी</label>
                <input
                  type="number"
                  value={p2TotalStudents}
                  onChange={e => setP2TotalStudents(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
                />
              </div>
            </div>
          </div>

          {/* REAL TIME PREVIEW CARD FOR PRAPATRA-2 WITH SIDE BOXES */}
          <div id="prapatra2-print-area" className="p-6 sm:p-8 bg-white dark:bg-slate-950 border-4 border-double border-slate-900 dark:border-slate-300 rounded-xl shadow-xl space-y-6 text-slate-900 dark:text-slate-100 text-xs relative border-l-[12px] border-r-[12px] border-l-purple-900 border-r-purple-900 dark:border-l-purple-700 dark:border-r-purple-700">
            <div className="flex justify-between items-start border-b-2 border-slate-900 dark:border-slate-400 pb-3">
              <div className="border border-slate-900 dark:border-slate-400 p-2 text-[10px] font-bold">
                <p>प्रपत्र - 2</p>
                <p>शाला दर्पण प्रविष्टि</p>
              </div>
              <div className="text-center space-y-1">
                <h3 className="text-base font-black uppercase tracking-wide">राजस्थान स्कूल शिक्षा परिषद (समग्र शिक्षा)</h3>
                <h4 className="text-sm font-extrabold uppercase text-purple-800 dark:text-purple-400">प्रपत्र – 2</h4>
                <p className="text-[11px] font-bold">संस्थाप्रधान द्वारा प्रविष्टि का शाला दर्पण पर अंकन व स्वीकृति प्रमाण-पत्र</p>
                <p className="text-[10px] font-semibold">सत्र 2026-27 (समग्र शिक्षा)</p>
              </div>
              <div className="border border-slate-900 dark:border-slate-400 p-2 text-[10px] font-bold text-right">
                <p>समीक्षा: PEEO / CBEO</p>
                <p>सत्यापित लॉक</p>
              </div>
            </div>

            <div className="space-y-4 leading-relaxed text-xs sm:text-sm my-6 p-4 border-2 border-slate-900 dark:border-slate-400 rounded-lg bg-slate-50 dark:bg-slate-900">
              <p>
                नियमानुसार पात्र विद्यार्थियों की शाला दर्पण पोर्टल पर ट्रांसपोर्ट वाउचर योजना का लाभ दिये जाने की प्रविष्टि <strong>'विद्यार्थी विस्तृत विवरण प्रपत्र-9'</strong> में वर्ष 2026-27 के दिशा-निर्देश अनुसार कर दी गई है।
              </p>
              <p>
                विद्यालय <strong>{p2SchoolName}</strong> (डाइस कोड: <strong>{p2SchoolCode}</strong>) के कुल <strong>{p2TotalStudents}</strong> समस्त पात्र विद्यार्थियों को ट्रांसपोर्ट वाउचर योजना का लाभ दिये जाने की प्रविष्टि को शाला दर्पण पोर्टल पर पूर्णतया लॉक व सत्यापित कर दिया गया है।
              </p>
            </div>

            <div className="flex justify-between items-end pt-12 font-bold text-xs border-t border-slate-400">
              <div>
                <p>दिनांक: {p2VerifiedDate}</p>
                <p>स्थान: ................................</p>
              </div>

              <div className="text-right space-y-1">
                <p>हस्ताक्षर संस्थाप्रधान</p>
                <p>मय सील एवं दिनांक</p>
                <p>विद्यालय: {p2SchoolName}</p>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
