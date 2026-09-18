import React, { useState, useEffect } from 'react';
import { SchoolProfile, MDMLog, Teacher, Language } from '../../types';
import { ThreeDIcon, ThreeDCard } from '../ThreeDIcon';
import { generateMdmMonthlyReportPdf, generateMdmOfficialOrderPdf } from '../../utils/pdfGenerator';
import {
  Utensils,
  Calculator,
  FileSpreadsheet,
  Users,
  CheckCircle2,
  AlertTriangle,
  Printer,
  Download,
  Plus,
  Trash2,
  Globe,
  Save,
  FileText,
  Calendar,
  Award,
  Package,
  Check,
  ArrowLeft
} from 'lucide-react';

interface MdmInchargeModuleProps {
  schoolProfile: SchoolProfile;
  teachers?: Teacher[];
  mdmLogs?: MDMLog[];
  onUpdateMdmLogs?: (logs: MDMLog[]) => void;
  lang: Language;
  onBack?: () => void;
}

interface CookHelper {
  id: string;
  name: string;
  designation: string;
  bankAccount: string;
  ifscCode: string;
  fixedRate: number; // e.g. 2142
  daysWorked: number; // e.g. 24
  totalMonthDays: number; // e.g. 24
}

interface InspectionRecord {
  id: string;
  date: string;
  inspectorName: string;
  inspectorDesignation: string;
  qualityRating: 'उत्कृष्ट' | 'उत्तम' | 'संतोषजनक' | 'Excellent' | 'Good' | 'Satisfactory';
  cleanliness: 'उत्कृष्ट' | 'उत्तम' | 'संतोषजनक' | 'Excellent' | 'Good' | 'Satisfactory';
  grainCondition: 'सुरक्षित' | 'सामान्य' | 'Safe' | 'Normal';
  waterSanitation: 'उपलब्ध' | 'Available';
  remarks: string;
}

export const MdmInchargeModule: React.FC<MdmInchargeModuleProps> = ({
  schoolProfile,
  teachers = [],
  mdmLogs = [],
  onUpdateMdmLogs,
  lang,
  onBack
}) => {
  // Strict Module Language Switcher (HI / EN without dual-language mixing)
  const [modLang, setModLang] = useState<Language>(lang);
  useEffect(() => {
    setModLang(lang);
  }, [lang]);

  const isHi = modLang === 'hi';

  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'calculator' | 'register' | 'cooks' | 'inspection' | 'stock' | 'order'
  >('dashboard');

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Helper for feedback toast
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // --- STATE 1: DAILY FEEDING LOGS ---
  const [localLogs, setLocalLogs] = useState<any[]>(() => {
    if (mdmLogs && mdmLogs.length > 0) return mdmLogs;
    // Default initial seed data for demonstration
    return [
      {
        date: '2026-07-28',
        mealsPrimary: 85,
        mealsUpperPrimary: 110,
        mealsServed: 195,
        menuItem: 'रोटी व दाल / Roti-Dal',
        wheatUsedKg: 13.2,
        riceUsedKg: 11.2,
        cookingCostSpent: 1361,
        milkDistributedLiters: 29.2
      },
      {
        date: '2026-07-29',
        mealsPrimary: 88,
        mealsUpperPrimary: 112,
        mealsServed: 200,
        menuItem: 'सब्जी-पूरी व खीर / Vegetable Puri',
        wheatUsedKg: 13.6,
        riceUsedKg: 11.5,
        cookingCostSpent: 1394,
        milkDistributedLiters: 30.0
      },
      {
        date: '2026-07-30',
        mealsPrimary: 82,
        mealsUpperPrimary: 108,
        mealsServed: 190,
        menuItem: 'चावल व सांभर / Rice-Sambar',
        wheatUsedKg: 0.0,
        riceUsedKg: 24.4,
        cookingCostSpent: 1329,
        milkDistributedLiters: 28.5
      }
    ];
  });

  // Today Feeding Inputs
  const [feedDate, setFeedDate] = useState(new Date().toISOString().split('T')[0]);
  const [enrolledPrimary, setEnrolledPrimary] = useState(100);
  const [enrolledUpperPrimary, setEnrolledUpperPrimary] = useState(120);
  const [mealsPrimary, setMealsPrimary] = useState(86);
  const [mealsUpperPrimary, setMealsUpperPrimary] = useState(112);
  const [grainType, setGrainType] = useState<'Wheat' | 'Rice' | 'Both'>('Wheat');
  const [menuItem, setMenuItem] = useState('रोटी-दाल');
  const [includeMilk, setIncludeMilk] = useState(true);

  // OFFICIAL FORMULA CALCULATIONS
  // Primary (1-5): 100g = 0.100 kg / student, Cooking Cost = ₹5.45 / student
  // Upper Primary (6-8): 150g = 0.150 kg / student, Cooking Cost = ₹8.17 / student
  const primaryGrainsKg = mealsPrimary * 0.100;
  const upperPrimaryGrainsKg = mealsUpperPrimary * 0.150;
  const totalGrainsKg = primaryGrainsKg + upperPrimaryGrainsKg;

  const wheatUsedKg = grainType === 'Rice' ? 0 : grainType === 'Wheat' ? totalGrainsKg : totalGrainsKg * 0.6;
  const riceUsedKg = grainType === 'Wheat' ? 0 : grainType === 'Rice' ? totalGrainsKg : totalGrainsKg * 0.4;

  const primaryCookingCost = mealsPrimary * 5.45;
  const upperPrimaryCookingCost = mealsUpperPrimary * 8.17;
  const totalCookingCost = primaryCookingCost + upperPrimaryCookingCost;

  const totalMealsServed = mealsPrimary + mealsUpperPrimary;
  const milkLiters = includeMilk ? +(totalMealsServed * 0.150).toFixed(1) : 0; // 150ml per beneficiary

  // Save Daily Log
  const handleSaveDailyFeed = (e: React.FormEvent) => {
    e.preventDefault();
    const newLog = {
      date: feedDate,
      mealsPrimary,
      mealsUpperPrimary,
      mealsServed: totalMealsServed,
      menuItem,
      wheatUsedKg: +wheatUsedKg.toFixed(2),
      riceUsedKg: +riceUsedKg.toFixed(2),
      cookingCostSpent: +totalCookingCost.toFixed(0),
      milkDistributedLiters: milkLiters
    };

    const updated = [newLog, ...localLogs.filter(l => l.date !== feedDate)];
    setLocalLogs(updated);
    if (onUpdateMdmLogs) onUpdateMdmLogs(updated);
    showToast(isHi ? 'दैनिक भोजन व खाद्यान्न प्रविष्टि सफलतापूर्वक सहेजी गई!' : 'Daily feeding record saved successfully!');
  };

  // --- STATE 2: COOK-CUM-HELPERS (रसोइया-कम-हेल्पर) ---
  const [cooks, setCooks] = useState<CookHelper[]>([
    {
      id: 'cook-1',
      name: isHi ? 'श्रीमती सुशीला देवी' : 'Smt. Sushila Devi',
      designation: isHi ? 'मुख्य रसोइया' : 'Head Cook',
      bankAccount: '38491029384',
      ifscCode: 'SBIN0001234',
      fixedRate: 2142,
      daysWorked: 24,
      totalMonthDays: 24
    },
    {
      id: 'cook-2',
      name: isHi ? 'श्रीमती कमला बाई' : 'Smt. Kamala Bai',
      designation: isHi ? 'सहायक रसोइया' : 'Assistant Cook',
      bankAccount: '50192837412',
      ifscCode: 'RMGB0000890',
      fixedRate: 2142,
      daysWorked: 24,
      totalMonthDays: 24
    }
  ]);

  const [showAddCook, setShowAddCook] = useState(false);
  const [newCookName, setNewCookName] = useState('');
  const [newCookAcc, setNewCookAcc] = useState('');
  const [newCookIfsc, setNewCookIfsc] = useState('');

  const handleAddCook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCookName.trim()) return;

    const newC: CookHelper = {
      id: `cook-${Date.now()}`,
      name: newCookName,
      designation: isHi ? 'सहायक रसोइया' : 'Assistant Cook',
      bankAccount: newCookAcc || '0000000000',
      ifscCode: newCookIfsc || 'SBIN0000000',
      fixedRate: 2142,
      daysWorked: 24,
      totalMonthDays: 24
    };

    setCooks([...cooks, newC]);
    setNewCookName('');
    setNewCookAcc('');
    setNewCookIfsc('');
    setShowAddCook(false);
    showToast(isHi ? 'नया रसोइया कार्मिक जोड़ा गया!' : 'New cook-cum-helper added!');
  };

  // --- STATE 3: STOCK & INVENTORY LEDGER ---
  const [openingWheat, setOpeningWheat] = useState(250.0);
  const [openingRice, setOpeningRice] = useState(180.0);
  const [receivedWheat, setReceivedWheat] = useState(200.0);
  const [receivedRice, setReceivedRice] = useState(100.0);

  // Cumulative grain consumed
  const totalWheatConsumed = localLogs.reduce((acc, curr) => acc + (curr.wheatUsedKg || 0), 0);
  const totalRiceConsumed = localLogs.reduce((acc, curr) => acc + (curr.riceUsedKg || 0), 0);

  const closingWheat = openingWheat + receivedWheat - totalWheatConsumed;
  const closingRice = openingRice + receivedRice - totalRiceConsumed;

  // --- STATE 4: INSPECTION LOGS ---
  const [inspections, setInspections] = useState<InspectionRecord[]>([
    {
      id: 'insp-1',
      date: '2026-07-25',
      inspectorName: isHi ? 'श्री रमेश कुमार चौधरी' : 'Shri Ramesh Kumar Choudhary',
      inspectorDesignation: isHi ? 'सीबीईओ / सीबीईओ प्रतिनिधि' : 'CBEO Representative',
      qualityRating: isHi ? 'उत्कृष्ट' : 'Excellent',
      cleanliness: isHi ? 'उत्कृष्ट' : 'Excellent',
      grainCondition: isHi ? 'सुरक्षित' : 'Safe',
      waterSanitation: isHi ? 'उपलब्ध' : 'Available',
      remarks: isHi
        ? 'भोजन की गुणवत्ता उत्कृष्ट पाई गई। रसोइयों द्वारा स्वच्छता के नियमों का पूर्ण पालन किया जा रहा है।'
        : 'Food quality and cleanliness strictly maintained as per norms.'
    }
  ]);

  const [inspInspectorName, setInspInspectorName] = useState('');
  const [inspDesignation, setInspDesignation] = useState('');
  const [inspRemarks, setInspRemarks] = useState('');

  const handleAddInspection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inspInspectorName.trim()) return;

    const newInsp: InspectionRecord = {
      id: `insp-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      inspectorName: inspInspectorName,
      inspectorDesignation: inspDesignation || (isHi ? 'निरीक्षण अधिकारी' : 'Inspecting Officer'),
      qualityRating: isHi ? 'उत्कृष्ट' : 'Excellent',
      cleanliness: isHi ? 'उत्तम' : 'Good',
      grainCondition: isHi ? 'सुरक्षित' : 'Safe',
      waterSanitation: isHi ? 'उपलब्ध' : 'Available',
      remarks: inspRemarks || (isHi ? 'भोजन गुणवत्ता मानक अनुसार है।' : 'Food quality conforms to standards.')
    };

    setInspections([newInsp, ...inspections]);
    setInspInspectorName('');
    setInspDesignation('');
    setInspRemarks('');
    showToast(isHi ? 'निरीक्षण रिपोर्ट दर्ज की गई!' : 'Inspection report saved!');
  };

  // --- STATE 5: OFFICIAL ORDER GENERATOR META ---
  const [assignedInchargeId, setAssignedInchargeId] = useState(teachers[0]?.id || '');
  const [orderDispatchNo, setOrderDispatchNo] = useState(`Ja.Sa./PEEO/${schoolProfile.nicCode}/MDM/2026-27/${Math.floor(Math.random() * 800 + 100)}`);
  const [orderDate, setOrderDate] = useState(new Date().toISOString().split('T')[0]);

  const selectedInchargeTeacher = teachers.find(t => t.id === assignedInchargeId) || teachers[0];
  const inchargeName = selectedInchargeTeacher
    ? (isHi ? (selectedInchargeTeacher.nameHindi || selectedInchargeTeacher.name) : selectedInchargeTeacher.name)
    : (isHi ? 'श्री वरिष्ठ शिक्षक' : 'Senior Teacher');
  const inchargeDesignation = selectedInchargeTeacher?.designation || (isHi ? 'वरिष्ठ अध्यापक' : 'Senior Teacher');

  // Export Monthly Compliance PDF
  const handleDownloadMonthlyPdf = () => {
    const totalMealsPrimary = localLogs.reduce((acc, curr) => acc + (curr.mealsPrimary || 0), 0);
    const totalMealsUpperPrimary = localLogs.reduce((acc, curr) => acc + (curr.mealsUpperPrimary || 0), 0);
    const totalWheatKg = localLogs.reduce((acc, curr) => acc + (curr.wheatUsedKg || 0), 0);
    const totalRiceKg = localLogs.reduce((acc, curr) => acc + (curr.riceUsedKg || 0), 0);
    const totalCookingCostSpent = localLogs.reduce((acc, curr) => acc + (curr.cookingCostSpent || 0), 0);

    generateMdmMonthlyReportPdf(
      schoolProfile,
      localLogs,
      'July 2026',
      {
        totalEnrolledPrimary: enrolledPrimary,
        totalEnrolledUpperPrimary: enrolledUpperPrimary,
        totalMealsPrimary,
        totalMealsUpperPrimary,
        totalWheatKg,
        totalRiceKg,
        totalCookingCost: totalCookingCostSpent,
        workingDays: localLogs.length
      },
      modLang
    );
  };

  // Export Official Order PDF
  const handleDownloadOrderPdf = () => {
    generateMdmOfficialOrderPdf(
      schoolProfile,
      inchargeName,
      inchargeDesignation,
      { dispatchNo: orderDispatchNo, date: orderDate },
      modLang
    );
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">

      {/* TOP HEADER BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
        
        {/* Module Title */}
        <div className="flex items-center space-x-2.5">
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center justify-center w-9 h-9 mr-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl transition-all cursor-pointer border border-slate-200 dark:border-slate-700"
              title={isHi ? 'पीछे जाएं' : 'Go Back'}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/40 text-emerald-700 dark:text-emerald-300">
            <Utensils className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-slate-100 leading-tight">
              {isHi ? 'मध्याह्न भोजन (MDM / PM POSHAN) प्रभारी मॉड्यूल' : 'Mid-Day Meal (MDM / PM POSHAN) Incharge Module'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isHi
                ? 'दैनिक भोजन गणना, खाद्यान्न व कुकिंग कॉस्ट रजिस्टर, मानदेय एवं अनुपालन रिपोर्ट'
                : 'Daily feeding logs, grain stock calculator, cook honorarium, and compliance reports'}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2">
          {/* Language Switcher */}
          <button
            onClick={() => setModLang(isHi ? 'en' : 'hi')}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-black flex items-center space-x-1.5 border border-slate-300/80 dark:border-slate-700 transition-all cursor-pointer"
            title={isHi ? 'Switch to English' : 'हिंदी भाषा में बदलें'}
          >
            <Globe className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>{isHi ? 'English' : 'हिंदी'}</span>
          </button>
        </div>

      </div>

      {/* Toast Feedback */}
      {toastMessage && (
        <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center space-x-2 animate-fadeIn">
          <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* MDM DASHBOARD (3D CLAYMORPHIC GRID) */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-2 mt-4">
            <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 flex items-center justify-center gap-2">
              <ThreeDIcon name="utensils" size={36} />
              <span>{isHi ? 'मध्याह्न भोजन (MDM) मुख्य डैशबोर्ड' : 'Mid-Day Meal (MDM) Dashboard'}</span>
            </h2>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              {isHi
                ? 'दैनिक भोजन गणना, मासिक रजिस्टर, स्टॉक संधारण एवं आधिकारिक प्रलेखन हेतु एकीकृत प्रबंधन प्रणाली'
                : 'Integrated management suite for daily feeding calculation, stock keeping & reporting'}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              {
                id: 'calculator' as const,
                titleHi: 'दैनिक गणना',
                titleEn: 'Daily Calculator',
                iconName: 'calculator' as const
              },
              {
                id: 'register' as const,
                titleHi: 'मासिक रजिस्टर',
                titleEn: 'Monthly Register',
                iconName: 'book' as const
              },
              {
                id: 'stock' as const,
                titleHi: 'स्टॉक व बही',
                titleEn: 'Stock Ledger',
                iconName: 'gold' as const
              },
              {
                id: 'cooks' as const,
                titleHi: 'रसोइया मानदेय',
                titleEn: 'Cook Honorarium',
                iconName: 'users' as const
              },
              {
                id: 'inspection' as const,
                titleHi: 'गुणवत्ता रिपोर्ट',
                titleEn: 'Quality Inspection',
                iconName: 'shield' as const
              },
              {
                id: 'order' as const,
                titleHi: 'कार्यालय आदेश',
                titleEn: 'Office Order',
                iconName: 'coupon' as const
              }
            ].map((module) => (
              <ThreeDCard
                key={module.id}
                onClick={() => setActiveTab(module.id)}
                icon={module.iconName}
                label={isHi ? module.titleHi : module.titleEn}
              />
            ))}
          </div>
        </div>
      )}

      {/* TAB 1: DAILY MEAL & GRAIN CALCULATOR */}
      {activeTab === 'calculator' && (
        <div className="space-y-4">
          
          <form onSubmit={handleSaveDailyFeed} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3 text-xs">
            
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700 gap-4">
              <h4 className="font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-1.5 text-sm">
                <Calculator className="w-4 h-4 text-emerald-600" />
                <span>{isHi ? 'दैनिक उपस्थिति व भोजन वितरण फीडिंग' : 'Daily Attendance & Meal Feeding'}</span>
              </h4>
              <div className="flex items-center space-x-3 font-mono shrink-0">
                <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">
                  {isHi ? 'तिथि:' : 'Date:'}
                </span>
                <input
                  type="date"
                  value={feedDate}
                  onChange={e => setFeedDate(e.target.value)}
                  className="px-2 py-1 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold mr-1"
                />
                <button
                  type="button"
                  onClick={() => setActiveTab('dashboard')}
                  className="p-1.5 rounded-xl bg-white hover:bg-emerald-50 dark:bg-slate-900 dark:hover:bg-emerald-950/30 text-slate-500 hover:text-emerald-700 dark:text-slate-400 dark:hover:text-emerald-400 border border-slate-200 dark:border-slate-700 transition-colors"
                  title={isHi ? 'वापस' : 'Back'}
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Attendance & Beneficiaries Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              
              {/* Primary Enrolled & Present */}
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                <span className="font-bold text-emerald-800 dark:text-emerald-300 block">
                  {isHi ? 'प्राथमिक स्तर (कक्षा 1 से 5)' : 'Primary Level (Class 1-5)'}
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] text-slate-500 font-semibold mb-0.5">
                      {isHi ? 'नामांकन' : 'Enrolled'}
                    </label>
                    <input
                      type="number"
                      value={enrolledPrimary}
                      onChange={e => setEnrolledPrimary(Number(e.target.value))}
                      className="w-full px-2 py-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 font-semibold mb-0.5">
                      {isHi ? 'लाभार्थी' : 'Meals Served'}
                    </label>
                    <input
                      type="number"
                      value={mealsPrimary}
                      onChange={e => setMealsPrimary(Number(e.target.value))}
                      className="w-full px-2 py-1 rounded-lg border border-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 font-mono font-bold text-emerald-900 dark:text-emerald-200"
                    />
                  </div>
                </div>
                <p className="text-[10px] text-slate-500">
                  {isHi ? 'मानक: 100 ग्राम/छात्र | ₹5.45/छात्र' : 'Norm: 100g/student | ₹5.45/student'}
                </p>
              </div>

              {/* Upper Primary Enrolled & Present */}
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                <span className="font-bold text-indigo-800 dark:text-indigo-300 block">
                  {isHi ? 'उच्च प्राथमिक स्तर (कक्षा 6 से 8)' : 'Upper Primary (Class 6-8)'}
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] text-slate-500 font-semibold mb-0.5">
                      {isHi ? 'नामांकन' : 'Enrolled'}
                    </label>
                    <input
                      type="number"
                      value={enrolledUpperPrimary}
                      onChange={e => setEnrolledUpperPrimary(Number(e.target.value))}
                      className="w-full px-2 py-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 font-semibold mb-0.5">
                      {isHi ? 'लाभार्थी' : 'Meals Served'}
                    </label>
                    <input
                      type="number"
                      value={mealsUpperPrimary}
                      onChange={e => setMealsUpperPrimary(Number(e.target.value))}
                      className="w-full px-2 py-1 rounded-lg border border-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 font-mono font-bold text-indigo-900 dark:text-indigo-200"
                    />
                  </div>
                </div>
                <p className="text-[10px] text-slate-500">
                  {isHi ? 'मानक: 150 ग्राम/छात्र | ₹8.17/छात्र' : 'Norm: 150g/student | ₹8.17/student'}
                </p>
              </div>

              {/* Menu & Grain Selection */}
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-0.5">
                    {isHi ? 'खाद्यान्न प्रकार' : 'Grain Type'}
                  </label>
                  <select
                    value={grainType}
                    onChange={e => setGrainType(e.target.value as any)}
                    className="w-full px-2 py-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
                  >
                    <option value="Wheat">{isHi ? 'केवल गेहूँ' : 'Wheat Only'}</option>
                    <option value="Rice">{isHi ? 'केवल चावल' : 'Rice Only'}</option>
                    <option value="Both">{isHi ? 'गेहूँ एवं चावल (60:40)' : 'Wheat & Rice (60:40)'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-0.5">
                    {isHi ? 'आज का मेनू आइटम' : 'Today Menu Item'}
                  </label>
                  <input
                    type="text"
                    value={menuItem}
                    onChange={e => setMenuItem(e.target.value)}
                    placeholder={isHi ? 'जैसे: रोटी-दाल' : 'e.g. Roti-Dal'}
                    className="w-full px-2 py-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-medium"
                  />
                </div>
              </div>

              {/* Bal Gopal Milk Option */}
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isHi ? 'बाल गोपाल दूध योजना' : 'Bal Gopal Milk Scheme'}
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={includeMilk}
                      onChange={e => setIncludeMilk(e.target.checked)}
                      className="rounded accent-emerald-600 w-4 h-4"
                    />
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {isHi ? 'दूध वितरण शामिल करें (150ml/छात्र)' : 'Include Milk Distribution'}
                    </span>
                  </label>
                </div>

                <div className="pt-2 text-right">
                  <button
                    type="submit"
                    className="w-full py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold shadow-sm transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5 text-amber-300" />
                    <span>{isHi ? 'दैनिक प्रविष्टि सहेजें' : 'Save Daily Entry'}</span>
                  </button>
                </div>
              </div>

            </div>

            {/* AUTO CALCULATED LIVE SUMMARY DASHBOARD BOX */}
            <div className="p-3.5 rounded-2xl bg-emerald-900 text-white border border-emerald-700 shadow-md grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              
              <div>
                <span className="text-[10px] uppercase font-sans text-emerald-200 block">
                  {isHi ? 'कुल लाभार्थी विद्यार्थी' : 'Total Beneficiary Students'}
                </span>
                <span className="text-lg font-black font-mono text-amber-300">
                  {totalMealsServed} {isHi ? 'छात्र' : 'Students'}
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-sans text-emerald-200 block">
                  {isHi ? 'आवश्यक गेहूँ / चावल (KG)' : 'Required Grains (KG)'}
                </span>
                <span className="text-lg font-black font-mono text-emerald-100">
                  {totalGrainsKg.toFixed(2)} KG
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-sans text-emerald-200 block">
                  {isHi ? 'कुल परिवर्तन लागत (कुकिंग कॉस्ट)' : 'Total Cooking Cost'}
                </span>
                <span className="text-lg font-black font-mono text-amber-300">
                  ₹ {totalCookingCost.toFixed(0)}
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-sans text-emerald-200 block">
                  {isHi ? 'दूध वितरण मात्रा' : 'Milk Distributed'}
                </span>
                <span className="text-lg font-black font-mono text-emerald-100">
                  {milkLiters} {isHi ? 'लीटर' : 'Liters'}
                </span>
              </div>

            </div>

          </form>

        </div>
      )}

      {/* TAB 2: MONTHLY REGISTER & SUMMARY GENERATOR */}
      {activeTab === 'register' && (
        <div className="space-y-3">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('dashboard')}
                className="p-1.5 rounded-xl bg-white hover:bg-emerald-50 dark:bg-slate-900 dark:hover:bg-emerald-950/30 text-slate-500 hover:text-emerald-700 dark:text-slate-400 dark:hover:text-emerald-400 border border-slate-200 dark:border-slate-700 transition-colors shrink-0"
                title={isHi ? 'वापस' : 'Back'}
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div>
                <h4 className="font-extrabold text-slate-800 dark:text-slate-100">
                  {isHi ? 'मासिक मध्याह्न भोजन वितरण विवरणिका (जुलाई 2026)' : 'Monthly MDM Feeding Summary (July 2026)'}
                </h4>
                <p className="text-[11px] text-slate-500">
                  {isHi ? `कुल रिकॉर्ड दर्ज: ${localLogs.length} दिवस` : `Logged entries: ${localLogs.length} days`}
                </p>
              </div>
            </div>

            <button
              onClick={handleDownloadMonthlyPdf}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold shadow-sm flex items-center space-x-1.5 transition-all cursor-pointer self-start sm:self-auto"
            >
              <Download className="w-3.5 h-3.5 text-amber-300" />
              <span>{isHi ? 'मासिक रिपोर्ट PDF डाउनलोड करें' : 'Download Monthly PDF'}</span>
            </button>
          </div>

          {/* Table of Daily Logs */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-extrabold border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="p-3 text-center w-12">{isHi ? 'क्र.' : 'S.N.'}</th>
                  <th className="p-3">{isHi ? 'दिनांक' : 'Date'}</th>
                  <th className="p-3">{isHi ? 'मेनू आइटम' : 'Menu Item'}</th>
                  <th className="p-3 text-center">{isHi ? 'प्राथमिक (1-5)' : 'Primary'}</th>
                  <th className="p-3 text-center">{isHi ? 'उच्च प्रा. (6-8)' : 'Upper Prim'}</th>
                  <th className="p-3 text-center">{isHi ? 'कुल भोजन' : 'Total Meals'}</th>
                  <th className="p-3 text-center">{isHi ? 'गेहूँ (KG)' : 'Wheat (KG)'}</th>
                  <th className="p-3 text-center">{isHi ? 'चावल (KG)' : 'Rice (KG)'}</th>
                  <th className="p-3 text-center">{isHi ? 'कुकिंग कॉस्ट (₹)' : 'Cooking Cost'}</th>
                  <th className="p-3 text-center">{isHi ? 'दूध (लीटर)' : 'Milk (L)'}</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200 font-medium">
                {localLogs.map((log, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                    <td className="p-3 text-center font-bold text-slate-400">{idx + 1}</td>
                    <td className="p-3 font-mono font-bold text-indigo-700 dark:text-indigo-300">{log.date}</td>
                    <td className="p-3 font-bold">{log.menuItem}</td>
                    <td className="p-3 text-center font-mono">{log.mealsPrimary || Math.round(log.mealsServed * 0.45)}</td>
                    <td className="p-3 text-center font-mono">{log.mealsUpperPrimary || Math.round(log.mealsServed * 0.55)}</td>
                    <td className="p-3 text-center font-mono font-black text-emerald-700 dark:text-emerald-300">{log.mealsServed}</td>
                    <td className="p-3 text-center font-mono">{log.wheatUsedKg}</td>
                    <td className="p-3 text-center font-mono">{log.riceUsedKg}</td>
                    <td className="p-3 text-center font-mono font-bold text-amber-700 dark:text-amber-300">₹ {log.cookingCostSpent}</td>
                    <td className="p-3 text-center font-mono">{log.milkDistributedLiters || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* TAB 3: STOCK & INVENTORY BALANCE SHEET */}
      {activeTab === 'stock' && (
        <div className="space-y-4">
          
          <div className="flex items-center">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-50 dark:bg-slate-800 dark:hover:bg-emerald-950/30 text-slate-700 hover:text-emerald-800 dark:text-slate-300 dark:hover:text-emerald-400 text-xs font-black transition-all cursor-pointer active:scale-95 border border-slate-200 dark:border-slate-750 shadow-sm"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>{isHi ? 'एमडीएम डैशबोर्ड पर वापस' : 'Back to MDM Dashboard'}</span>
            </button>
          </div>

          {/* Low Stock Alert */}
          {(closingWheat < 50 || closingRice < 50) && (
            <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-200 text-xs font-bold flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
              <span>
                {isHi
                  ? 'चेतावनी: खाद्यान्न स्टॉक का स्तर 7 दिवस की औसत खपत से कम है। कृपया तुरंत नवीन आवंटन हेतु मांग पत्र प्रेषित करें।'
                  : 'Alert: Grain stock level is below 7 days average consumption requirement. Submit allocation demand.'}
              </span>
            </div>
          )}

          {/* Stock Balance Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            
            {/* Wheat Ledger */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-2">
                <h4 className="font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-1.5 text-sm">
                  <Package className="w-4 h-4 text-amber-600" />
                  <span>{isHi ? 'गेहूँ स्टॉक लेजर (Wheat Ledger)' : 'Wheat Stock Ledger'}</span>
                </h4>
                <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-200 font-mono font-bold text-[10px]">
                  {isHi ? 'गेहूँ' : 'Wheat'}
                </span>
              </div>

              <div className="space-y-1.5 font-mono pt-1">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>{isHi ? 'प्रारंभिक शेष (Opening Stock):' : 'Opening Stock:'}</span>
                  <span className="font-bold">{openingWheat.toFixed(1)} KG</span>
                </div>
                <div className="flex justify-between text-emerald-700 dark:text-emerald-400">
                  <span>{isHi ? 'नवीन प्राप्त स्टॉक (Received):' : 'Stock Received:'}</span>
                  <span className="font-bold">+ {receivedWheat.toFixed(1)} KG</span>
                </div>
                <div className="flex justify-between text-rose-600 dark:text-rose-400">
                  <span>{isHi ? 'कुल खपत (Consumed):' : 'Total Consumed:'}</span>
                  <span className="font-bold">- {totalWheatConsumed.toFixed(1)} KG</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-300 dark:border-slate-600 text-sm font-black text-slate-900 dark:text-slate-100">
                  <span>{isHi ? 'अंतिम शेष (Closing Balance):' : 'Closing Balance:'}</span>
                  <span className="text-amber-600 dark:text-amber-400">{closingWheat.toFixed(1)} KG</span>
                </div>
              </div>
            </div>

            {/* Rice Ledger */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-2">
                <h4 className="font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-1.5 text-sm">
                  <Package className="w-4 h-4 text-emerald-600" />
                  <span>{isHi ? 'चावल स्टॉक लेजर (Rice Ledger)' : 'Rice Stock Ledger'}</span>
                </h4>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 font-mono font-bold text-[10px]">
                  {isHi ? 'चावल' : 'Rice'}
                </span>
              </div>

              <div className="space-y-1.5 font-mono pt-1">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>{isHi ? 'प्रारंभिक शेष (Opening Stock):' : 'Opening Stock:'}</span>
                  <span className="font-bold">{openingRice.toFixed(1)} KG</span>
                </div>
                <div className="flex justify-between text-emerald-700 dark:text-emerald-400">
                  <span>{isHi ? 'नवीन प्राप्त स्टॉक (Received):' : 'Stock Received:'}</span>
                  <span className="font-bold">+ {receivedRice.toFixed(1)} KG</span>
                </div>
                <div className="flex justify-between text-rose-600 dark:text-rose-400">
                  <span>{isHi ? 'कुल खपत (Consumed):' : 'Total Consumed:'}</span>
                  <span className="font-bold">- {totalRiceConsumed.toFixed(1)} KG</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-300 dark:border-slate-600 text-sm font-black text-slate-900 dark:text-slate-100">
                  <span>{isHi ? 'अंतिम शेष (Closing Balance):' : 'Closing Balance:'}</span>
                  <span className="text-emerald-600 dark:text-emerald-400">{closingRice.toFixed(1)} KG</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* TAB 4: COOK-CUM-HELPER (रसोइया-कम-हेल्पर) HONORARIUM TRACKER */}
      {activeTab === 'cooks' && (
        <div className="space-y-3">
          
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('dashboard')}
                className="p-1.5 rounded-xl bg-white hover:bg-emerald-50 dark:bg-slate-900 dark:hover:bg-emerald-950/30 text-slate-500 hover:text-emerald-700 dark:text-slate-400 dark:hover:text-emerald-400 border border-slate-200 dark:border-slate-700 transition-colors shrink-0"
                title={isHi ? 'वापस' : 'Back'}
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <h4 className="font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-emerald-600" />
                <span>{isHi ? 'रसोइया-कम-हेल्पर मानदेय पत्रक (मासिक दर: ₹2,142)' : 'Cook-cum-Helper Honorarium Tracker'}</span>
              </h4>
            </div>

            <button
              onClick={() => setShowAddCook(!showAddCook)}
              className="px-3 py-1.5 rounded-xl bg-emerald-700 text-white font-bold flex items-center space-x-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isHi ? 'रसोइया जोड़ें' : 'Add Helper'}</span>
            </button>
          </div>

          {showAddCook && (
            <form onSubmit={handleAddCook} className="p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 space-y-3 text-xs animate-fadeIn">
              <h5 className="font-extrabold text-slate-900 dark:text-slate-100">
                {isHi ? 'नवीन रसोइया-कम-हेल्पर विवरण दर्ज करें' : 'Enter New Cook-cum-Helper Details'}
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-[11px] font-bold mb-0.5">{isHi ? 'नाम *' : 'Name *'}</label>
                  <input
                    type="text"
                    required
                    value={newCookName}
                    onChange={e => setNewCookName(e.target.value)}
                    placeholder={isHi ? 'जैसे: श्रीमती सुशीला देवी' : 'e.g. Smt. Sushila Devi'}
                    className="w-full px-2.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold mb-0.5">{isHi ? 'बैंक खाता संख्या' : 'Bank Account No'}</label>
                  <input
                    type="text"
                    value={newCookAcc}
                    onChange={e => setNewCookAcc(e.target.value)}
                    placeholder="e.g. 38491029384"
                    className="w-full px-2.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold mb-0.5">{isHi ? 'आईएफएससी कोड' : 'IFSC Code'}</label>
                  <input
                    type="text"
                    value={newCookIfsc}
                    onChange={e => setNewCookIfsc(e.target.value)}
                    placeholder="e.g. SBIN0001234"
                    className="w-full px-2.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowAddCook(false)}
                  className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 font-bold"
                >
                  {isHi ? 'रद्द करें' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-emerald-700 text-white font-bold flex items-center space-x-1"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isHi ? 'सहेजें' : 'Save'}</span>
                </button>
              </div>
            </form>
          )}

          {/* Table of Cook Helpers */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-extrabold border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="p-3 text-center w-12">{isHi ? 'क्र.' : 'S.N.'}</th>
                  <th className="p-3">{isHi ? 'रसोइया का नाम' : 'Cook Name'}</th>
                  <th className="p-3">{isHi ? 'पद' : 'Designation'}</th>
                  <th className="p-3">{isHi ? 'बैंक खाता संख्या' : 'Bank Account No'}</th>
                  <th className="p-3">{isHi ? 'आईएफएससी' : 'IFSC Code'}</th>
                  <th className="p-3 text-center">{isHi ? 'मासिक दर (₹)' : 'Fixed Rate'}</th>
                  <th className="p-3 text-center">{isHi ? 'कार्य दिवस' : 'Working Days'}</th>
                  <th className="p-3 text-center">{isHi ? 'देय मानदेय (₹)' : 'Payable (₹)'}</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200 font-medium">
                {cooks.map((cook, idx) => {
                  const payable = Math.round((cook.fixedRate * cook.daysWorked) / cook.totalMonthDays);
                  return (
                    <tr key={cook.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="p-3 text-center font-bold text-slate-400">{idx + 1}</td>
                      <td className="p-3 font-extrabold text-slate-900 dark:text-slate-100">{cook.name}</td>
                      <td className="p-3 text-slate-500">{cook.designation}</td>
                      <td className="p-3 font-mono">{cook.bankAccount}</td>
                      <td className="p-3 font-mono">{cook.ifscCode}</td>
                      <td className="p-3 text-center font-mono font-bold">₹ {cook.fixedRate}</td>
                      <td className="p-3 text-center font-mono font-bold">{cook.daysWorked} / {cook.totalMonthDays}</td>
                      <td className="p-3 text-center font-mono font-black text-emerald-700 dark:text-emerald-300">
                        ₹ {payable}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* TAB 5: MDM INSPECTION QUALITY ASSURANCE FORM */}
      {activeTab === 'inspection' && (
        <div className="space-y-4">
          
          <form onSubmit={handleAddInspection} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700 gap-3">
              <h4 className="font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-1.5 text-sm">
                <Award className="w-4 h-4 text-emerald-600" />
                <span>{isHi ? 'नवीन निरीक्षण व गुणवत्ता रिपोर्ट दर्ज करें' : 'Record New Inspection & Quality Report'}</span>
              </h4>
              <button
                type="button"
                onClick={() => setActiveTab('dashboard')}
                className="p-1.5 rounded-xl bg-white hover:bg-emerald-50 dark:bg-slate-900 dark:hover:bg-emerald-950/30 text-slate-500 hover:text-emerald-700 dark:text-slate-400 dark:hover:text-emerald-400 border border-slate-200 dark:border-slate-700 transition-colors"
                title={isHi ? 'वापस' : 'Back'}
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold mb-0.5">{isHi ? 'निरीक्षक का नाम *' : 'Inspector Name *'}</label>
                <input
                  type="text"
                  required
                  value={inspInspectorName}
                  onChange={e => setInspInspectorName(e.target.value)}
                  placeholder={isHi ? 'जैसे: श्री रमेश कुमार' : 'e.g. Shri Ramesh Kumar'}
                  className="w-full px-2.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold mb-0.5">{isHi ? 'पद/विभाग' : 'Designation / Department'}</label>
                <input
                  type="text"
                  value={inspDesignation}
                  onChange={e => setInspDesignation(e.target.value)}
                  placeholder={isHi ? 'जैसे: सीबीईओ प्रतिनिधि' : 'e.g. CBEO Official'}
                  className="w-full px-2.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold mb-0.5">{isHi ? 'निरीक्षण टिप्पणी' : 'Inspection Remarks'}</label>
                <input
                  type="text"
                  value={inspRemarks}
                  onChange={e => setInspRemarks(e.target.value)}
                  placeholder={isHi ? 'विशेष रिमार्क्स दर्ज करें...' : 'Remarks...'}
                  className="w-full px-2.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-medium"
                />
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold flex items-center space-x-1.5 shadow-sm transition-all cursor-pointer"
              >
                <Save className="w-3.5 h-3.5 text-amber-300" />
                <span>{isHi ? 'निरीक्षण रिपोर्ट सहेजें' : 'Save Inspection'}</span>
              </button>
            </div>
          </form>

          {/* List of past inspections */}
          <div className="space-y-2">
            <h4 className="font-extrabold text-xs text-slate-800 dark:text-slate-100">
              {isHi ? 'पूर्व निरीक्षण लॉग इतिहास' : 'Inspection History Logs'}
            </h4>

            {inspections.map(insp => (
              <div key={insp.id} className="p-3 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-extrabold text-indigo-800 dark:text-indigo-300">
                    {insp.inspectorName} ({insp.inspectorDesignation})
                  </span>
                  <span className="font-mono text-slate-500 font-bold">{insp.date}</span>
                </div>
                <p className="text-slate-700 dark:text-slate-300 font-medium">
                  {insp.remarks}
                </p>
                <div className="flex items-center space-x-3 text-[10px] text-emerald-700 dark:text-emerald-400 font-bold pt-1">
                  <span>✓ {isHi ? 'गुणवत्ता:' : 'Quality:'} {insp.qualityRating}</span>
                  <span>✓ {isHi ? 'रसोई स्वच्छता:' : 'Hygiene:'} {insp.cleanliness}</span>
                  <span>✓ {isHi ? 'स्टॉक स्थिति:' : 'Stock:'} {insp.grainCondition}</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* TAB 6: OFFICIAL ORDER GENERATOR */}
      {activeTab === 'order' && (
        <div className="space-y-4">
          
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700 gap-3">
              <h4 className="font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-emerald-600" />
                <span>{isHi ? 'मध्याह्न भोजन (MDM) मुख्य प्रभारी नियुक्ति आदेश' : 'MDM Main Incharge Appointment Order Settings'}</span>
              </h4>
              <button
                onClick={() => setActiveTab('dashboard')}
                className="p-1.5 rounded-xl bg-white hover:bg-emerald-50 dark:bg-slate-900 dark:hover:bg-emerald-950/30 text-slate-500 hover:text-emerald-700 dark:text-slate-400 dark:hover:text-emerald-400 border border-slate-200 dark:border-slate-700 transition-colors"
                title={isHi ? 'वापस' : 'Back'}
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div>
                <label className="block text-[11px] font-bold mb-0.5">{isHi ? 'प्रभारी शिक्षक चुनें *' : 'Select Incharge Teacher *'}</label>
                <select
                  value={assignedInchargeId}
                  onChange={e => setAssignedInchargeId(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold"
                >
                  {teachers.map(t => (
                    <option key={t.id} value={t.id}>
                      {isHi ? (t.nameHindi || t.name) : t.name} ({t.designation})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold mb-0.5">{isHi ? 'क्रमांक (Dispatch No)' : 'Dispatch No'}</label>
                <input
                  type="text"
                  value={orderDispatchNo}
                  onChange={e => setOrderDispatchNo(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold mb-0.5">{isHi ? 'आदेश दिनांक' : 'Order Date'}</label>
                <input
                  type="date"
                  value={orderDate}
                  onChange={e => setOrderDate(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono font-bold"
                />
              </div>
            </div>
          </div>

          {/* Top Action Bar */}
          <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm gap-2">
            <span className="text-xs font-black text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-emerald-600" />
              <span>{isHi ? 'कार्यालय आदेश पूर्वावलोकन' : 'Office Order Preview'}</span>
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => window.print()}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer active:scale-95"
              >
                <Printer className="w-3.5 h-3.5 text-amber-300" />
                <span>{isHi ? 'मुद्रित करें / Print' : 'Print Order'}</span>
              </button>

              <button
                onClick={handleDownloadOrderPdf}
                className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer active:scale-95"
              >
                <Download className="w-3.5 h-3.5 text-amber-300" />
                <span>{isHi ? 'PDF डाउनलोड करें' : 'Download PDF'}</span>
              </button>
            </div>
          </div>

          {/* DRAFT ORDER PREVIEW */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-950 border-2 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 space-y-4 shadow-lg print:border-none">
            
            {/* Header */}
            <div className="text-center border-b-2 border-slate-800 dark:border-slate-200 pb-3 space-y-1">
              <h2 className="text-base sm:text-lg font-black tracking-wide">
                {isHi
                  ? 'कार्यालय पंचायत प्रारंभिक शिक्षा अधिकारी (PEEO) एवं प्रधानाचार्य'
                  : 'OFFICE OF PANCHAYAT ELEMENTARY EDUCATION OFFICER (PEEO) & PRINCIPAL'}
              </h2>
              <h3 className="text-sm font-bold text-emerald-800 dark:text-emerald-300">
                {isHi
                  ? (schoolProfile.schoolNameHindi || schoolProfile.schoolName)
                  : schoolProfile.schoolName} ({schoolProfile.district})
              </h3>
            </div>

            {/* Dispatch Row */}
            <div className="flex justify-between text-xs font-mono font-bold pt-1">
              <span>{isHi ? `क्रमांक: ${orderDispatchNo}` : `Dispatch No: ${orderDispatchNo}`}</span>
              <span>{isHi ? `दिनांक: ${orderDate}` : `Date: ${orderDate}`}</span>
            </div>

            {/* Title */}
            <div className="text-center space-y-1 pt-1">
              <h4 className="text-sm font-black underline">
                {isHi ? ':: कार्यालय आदेश ::' : ':: OFFICE ORDER ::'}
              </h4>
              <p className="text-xs font-bold">
                {isHi
                  ? 'विषय: मध्याह्न भोजन योजना (PM POSHAN) संस्थागत प्रभारी नियुक्ति बाबत।'
                  : 'Subject: Appointment of Mid-Day Meal (PM POSHAN) Institutional Incharge.'}
              </p>
            </div>

            {/* Body */}
            <div className="text-xs space-y-2 leading-relaxed text-justify">
              <p>
                {isHi
                  ? `राज्य सरकार व शिक्षा विभाग के निर्देशानुसार विद्यालय में अध्ययनरत विद्यार्थियों को गुणवत्तापूर्ण, पौष्टिक एवं स्वादिष्ट मध्याह्न भोजन (PM POSHAN) तथा बाल गोपाल दूध का समयबद्ध वितरण सुनिश्चित करने हेतु निम्नलिखित शिक्षक/कार्मिक को मध्याह्न भोजन (MDM) मुख्य प्रभारी नियुक्त किया जाता है:`
                  : `In accordance with State Government guidelines, to ensure timely distribution of nutritious Mid-Day Meal (PM POSHAN) and Bal Gopal Milk to enrolled students, the following staff member is appointed as MDM Incharge:`}
              </p>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 font-bold">
                <p>{isHi ? `1. नाम: ${inchargeName}` : `1. Name: ${inchargeName}`}</p>
                <p>{isHi ? `2. पद: ${inchargeDesignation}` : `2. Designation: ${inchargeDesignation}`}</p>
                <p>{isHi ? `3. संस्था: ${schoolProfile.schoolNameHindi || schoolProfile.schoolName}` : `3. Institution: ${schoolProfile.schoolName}`}</p>
              </div>

              <p>
                {isHi
                  ? `उक्त प्रभारी खाद्यान्न (गेहूँ/चावल) स्टॉक संधारण, दैनिक भोजन वितरण रजिस्टर, कुकिंग कॉस्ट लेखा-जोखा, रसोइया-कम-हेल्पर उपस्थिति व मानदेय तथा शाला दर्पण पोर्टल पर समयबद्ध प्रविष्टि हेतु व्यक्तिगत रूप से उत्तरदायी होंगे।`
                  : `The appointed incharge shall be individually responsible for grain stock maintenance, daily meal registers, cooking cost ledger, cook-cum-helper attendance/honorarium, and timely entry on Shala Darpan portal.`}
              </p>
            </div>

            {/* Dual Signatures */}
            <div className="flex justify-between items-end pt-8 px-4">
              <div className="text-center space-y-1">
                <div className="h-8"></div>
                <p className="font-bold text-xs">{isHi ? 'मध्याह्न भोजन (MDM) प्रभारी' : 'MDM Incharge'}</p>
                <p className="text-[11px] text-slate-500">({inchargeName})</p>
              </div>

              <div className="text-center space-y-1">
                <div className="h-8"></div>
                <p className="font-bold text-xs">{isHi ? 'PEEO एवं प्रधानाचार्य' : 'PEEO & Principal'}</p>
                <p className="font-bold text-xs">({schoolProfile.principalName})</p>
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
