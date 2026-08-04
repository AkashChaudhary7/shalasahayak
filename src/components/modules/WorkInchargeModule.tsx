import React, { useState, useRef } from 'react';
import { SchoolProfile, MDMLog, TransportStudent, ScholarshipRecord, Language, Teacher } from '../../types';
import { ThreeDIcon, ThreeDCard } from '../ThreeDIcon';
import { BoardExamRemunerationBill } from '../incharge/BoardExamRemunerationBill';
import { LadoInchargeModule } from '../incharge/LadoInchargeModule';
import { MdmInchargeModule } from './MdmInchargeModule';
import { ExamInchargeModule } from './ExamInchargeModule';
import { QrCodeGeneratorModule } from './QrCodeGeneratorModule';
import { DutyRosterModule } from './DutyRosterModule';
import { AssemblyInchargeModule } from './AssemblyInchargeModule';
import { t } from '../../utils/i18n';
import {
  Sparkles,
  Utensils,
  Bus,
  Heart,
  Award,
  Vote,
  FileSpreadsheet,
  Image,
  Calculator,
  Download,
  Upload,
  Layers,
  CheckCircle,
  HelpCircle,
  FileText,
  ArrowLeft,
  Plus,
  Trash2,
  Filter,
  Calendar,
  Shield,
  CheckCircle2,
  Activity,
  UserCheck,
  Package
} from 'lucide-react';

interface WorkInchargeModuleProps {
  schoolProfile: SchoolProfile;
  teachers?: Teacher[];
  mdmLogs: MDMLog[];
  onUpdateMdmLogs: (logs: MDMLog[]) => void;
  lang: Language;
  initialSubTab?: 'mdm' | 'transport' | 'lado' | 'scholarship' | 'elc' | 'exam' | 'resizer' | 'remuneration' | 'qrcode' | 'dutyroster' | 'assembly' | null;
  onNavigate?: (type: 'dashboard' | 'peeo' | 'teacher' | 'incharge' | 'quick' | 'shivira' | 'mdm' | 'exam' | 'work-incharge', subTab?: string | null) => void;
  onBack?: () => void;
}

export const WorkInchargeModule: React.FC<WorkInchargeModuleProps> = ({
  schoolProfile,
  teachers = [],
  mdmLogs,
  onUpdateMdmLogs,
  lang,
  initialSubTab = null,
  onNavigate,
  onBack
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'mdm' | 'transport' | 'lado' | 'scholarship' | 'elc' | 'exam' | 'resizer' | 'remuneration' | 'qrcode' | 'dutyroster' | 'assembly' | null>(initialSubTab);

  React.useEffect(() => {
    setActiveSubTab(initialSubTab);
  }, [initialSubTab]);

  React.useEffect(() => {
    if (activeSubTab) {
      let hash = `incharge-${activeSubTab}`;
      if (activeSubTab === 'mdm') hash = 'mid-day-meal';
      else if (activeSubTab === 'transport') hash = 'transport-voucher';
      else if (activeSubTab === 'scholarship') hash = 'scholarship-calculator';
      else if (activeSubTab === 'exam') hash = 'exam-duty-roster';
      
      const expectedHash = `#${hash}`;
      if (window.location.hash !== expectedHash) {
        window.location.hash = expectedHash;
      }
    } else {
      const currentHash = window.location.hash.replace('#', '');
      const validHashes = [
        'work-incharge', 'dashboard', 'mid-day-meal', 'mdm-calculator',
        'transport-voucher', 'transport-calculator', 'scholarship-calculator',
        'scholarship-selector', 'exam-roster', 'exam-duty-roster'
      ];
      if (!validHashes.includes(currentHash) && !currentHash.startsWith('incharge-') && currentHash !== '') {
        if (window.location.hash !== '#work-incharge') {
          window.location.hash = '#work-incharge';
        }
      }
    }
  }, [activeSubTab]);

  // --- ELC Incharge State ---
  const [elcCampaigns, setElcCampaigns] = useState([
    { id: 'elc-1', title: 'National Voters Day Rally & Pledge', date: '2026-01-25', type: 'Rally', participants: 120, description: 'Voters registration drive and citizen awareness march with placards.' },
    { id: 'elc-2', title: 'Mock Poll and EVM/VVPAT Demonstration', date: '2026-03-10', type: 'Mock Poll', participants: 85, description: 'Hands-on practice voting for senior secondary students on voting mechanics.' },
    { id: 'elc-3', title: 'Electoral Rights Quiz Competition', date: '2026-04-18', type: 'Quiz', participants: 45, description: 'Inter-house quiz testing knowledge of the Indian Constitution and democracy.' }
  ]);
  const [elcVotes, setElcVotes] = useState<Record<string, number>>({
    'Candidate Alpha': 42,
    'Candidate Beta': 35,
    'NOTA': 8
  });
  const [newCampaignTitle, setNewCampaignTitle] = useState('');
  const [newCampaignType, setNewCampaignType] = useState('Rally');
  const [newCampaignParticipants, setNewCampaignParticipants] = useState('50');
  const [newCampaignDesc, setNewCampaignDesc] = useState('');

  // --- Scholarship Incharge State ---
  const [scholarshipApplicants, setScholarshipApplicants] = useState([
    { id: 'sch-1', name: 'Mamta Meena', className: 'Class 10', scheme: 'Pre-Matric ST Scholarship', category: 'ST', incomeVerified: true, casteVerified: true, janAadhaarMapped: true, shalaDarpanUploaded: true, status: 'Approved' },
    { id: 'sch-2', name: 'Deepak Kumar Jat', className: 'Class 9', scheme: 'Pre-Matric OBC Scholarship', category: 'OBC', incomeVerified: true, casteVerified: true, janAadhaarMapped: false, shalaDarpanUploaded: false, status: 'Pending' },
    { id: 'sch-3', name: 'Vikram Harijan', className: 'Class 8', scheme: 'Pre-Matric SC Scholarship', category: 'SC', incomeVerified: false, casteVerified: true, janAadhaarMapped: true, shalaDarpanUploaded: false, status: 'Action Required' },
    { id: 'sch-4', name: 'Suman Kanwar', className: 'Class 10', scheme: 'EWS Scholarship', category: 'EWS', incomeVerified: true, casteVerified: true, janAadhaarMapped: true, shalaDarpanUploaded: true, status: 'Approved' }
  ]);
  const [schSearch, setSchSearch] = useState('');
  const [schFilter, setSchFilter] = useState('All');
  const [newSchName, setNewSchName] = useState('');
  const [newSchClass, setNewSchClass] = useState('Class 9');
  const [newSchScheme, setNewSchScheme] = useState('Pre-Matric OBC Scholarship');
  const [newSchCategory, setNewSchCategory] = useState('OBC');

  // --- Lado Incharge State ---
  const [ladoStock, setLadoStock] = useState(1150);
  const [ladoNapkinAdd, setLadoNapkinAdd] = useState('');
  const [ladoDistributionLogs, setLadoDistributionLogs] = useState([
    { id: 'ld-1', date: '2026-03-05', className: 'Class 6 Girls', quantity: 80, remarks: 'Monthly distribution' },
    { id: 'ld-2', date: '2026-03-05', className: 'Class 7 Girls', quantity: 95, remarks: 'Monthly distribution' },
    { id: 'ld-3', date: '2026-03-06', className: 'Class 8 Girls', quantity: 110, remarks: 'Monthly distribution with hygiene briefing' }
  ]);
  const [ladoDistClass, setLadoDistClass] = useState('Class 6 Girls');
  const [ladoDistQty, setLadoDistQty] = useState('50');
  const [ladoDistRemarks, setLadoDistRemarks] = useState('Monthly distribution');

  const [ladoEvents, setLadoEvents] = useState([
    { id: 'le-1', title: 'Girl Child Self-Defense Training (Rani Laxmibai)', date: '2026-01-18', participants: 92, instructor: 'Smt. Saroj Yadav' },
    { id: 'le-2', title: 'Personal Hygiene & Reproductive Health Camp', date: '2026-02-12', participants: 115, instructor: 'Dr. Anita Meena (CHC)' }
  ]);
  const [ladoCounsels, setLadoCounsels] = useState([
    { id: 'lc-1', date: '2026-03-12', topic: 'Academic Stress Counseling', participants: '8 Girls', status: 'Resolved' },
    { id: 'lc-2', date: '2026-03-22', topic: 'Health & Dietary Guidance', participants: '12 Girls', status: 'In Progress' }
  ]);

  // --- Lado Dropout Tracker State ---
  const [ladoDropouts, setLadoDropouts] = useState([
    {
      id: 'do-1',
      studentName: 'Priya Meena',
      className: 'Class 9',
      daysAbsent: 14,
      reasonForRisk: 'Distance & Lack of Transport',
      status: 'Counseling Done', // 'Identified' | 'Contacted Parent' | 'Counseling Done' | 'Re-enrolled' | 'Dropped Out'
      followUps: [
        { id: 'fu-1-1', date: '2026-03-08', details: 'Home visit conducted by ELC & Lado team. Parents raised concern about safe transport.', officer: 'Smt. Saroj Yadav' },
        { id: 'fu-1-2', date: '2026-03-15', details: 'Offered transport voucher scheme option and mapped student. Parents agreed to resume school.', officer: 'Smt. Saroj Yadav' }
      ]
    },
    {
      id: 'do-2',
      studentName: 'Komal Kanwar',
      className: 'Class 10',
      daysAbsent: 21,
      reasonForRisk: 'Household chores & Caregiving',
      status: 'Contacted Parent',
      followUps: [
        { id: 'fu-2-1', date: '2026-03-10', details: 'Called parents on phone. Mother was unwell, student was cooking. Planned home visit for counseling.', officer: 'Dr. Anita Meena' }
      ]
    },
    {
      id: 'do-3',
      studentName: 'Aarti Harijan',
      className: 'Class 8',
      daysAbsent: 18,
      reasonForRisk: 'Financial difficulties & Uniform cost',
      status: 'Re-enrolled',
      followUps: [
        { id: 'fu-3-1', date: '2026-03-05', details: 'Discussed scholarship options (Pre-Matric SC). Helped register Jan Aadhaar.', officer: 'Smt. Saroj Yadav' },
        { id: 'fu-3-2', date: '2026-03-12', details: 'Student received uniform books and returned to school. Attendance is now regular.', officer: 'Smt. Saroj Yadav' }
      ]
    }
  ]);

  // Form states for adding student
  const [newDoName, setNewDoName] = useState('');
  const [newDoClass, setNewDoClass] = useState('Class 9');
  const [newDoDaysAbsent, setNewDoDaysAbsent] = useState('');
  const [newDoReason, setNewDoReason] = useState('Distance & Lack of Transport');
  const [newDoStatus, setNewDoStatus] = useState('Identified');

  // Form states for adding follow-up to a student
  const [selectedDoId, setSelectedDoId] = useState<string | null>(null);
  const [newFuDetails, setNewFuDetails] = useState('');
  const [newFuOfficer, setNewFuOfficer] = useState('');
  const [newFuStatusUpdate, setNewFuStatusUpdate] = useState('Counseling Done');

  if (activeSubTab === null) {
    const modules = [
      {
        id: 'exam' as const,
        titleHi: 'परीक्षा प्रभारी प्रभाग',
        titleEn: 'Exam Incharge Portal',
        descHi: 'सीटिंग अरेंजमेंट, वीक्षक ड्यूटी, स्टॉक बही व परीक्षा प्रारूप संकलन',
        descEn: 'Seating arrangements, invigilator rosters, stock registers & exam logs',
        iconName: 'target' as const
      },
      {
        id: 'remuneration' as const,
        titleHi: 'बोर्ड परीक्षा पारिश्रमिक बिल',
        titleEn: 'Board Exam Remuneration Bill',
        descHi: 'केन्द्राधीक्षक, वीक्षक, चतुर्थ श्रेणी स्टाफ मानदेय व पारिश्रमिक बिल जनरेटर',
        descEn: 'Center Superintendent, Invigilator & Support staff exam bill auto-generator',
        iconName: 'calculator' as const
      },
      {
        id: 'mdm' as const,
        titleHi: 'मध्याह्न भोजन (MDM) प्रभारी',
        titleEn: 'MDM Incharge Portal',
        descHi: 'दैनिक छात्र उपस्थिति अनुसार खाद्यान्न उपभोग व कुकिंग कॉस्ट ऑटो कैलकुलेटर',
        descEn: 'Daily student attendance based grain consumption & cooking cost auto-calculator',
        iconName: 'utensils' as const
      },
      {
        id: 'transport' as const,
        titleHi: 'ट्रांसपोर्ट वाउचर प्रभारी',
        titleEn: 'Transport Voucher Incharge',
        descHi: '1 किमी / 2 किमी से अधिक दूरी वाले छात्रों हेतु परिवहन भत्ता क्लेम प्रपत्र',
        descEn: 'Transport allowance claims mapping for rural students residing >1km/2km',
        iconName: 'bus' as const
      },
      {
        id: 'elc' as const,
        titleHi: 'मतदाता साक्षरता क्लब (ELC) प्रभारी',
        titleEn: 'ELC Incharge Portal',
        descHi: 'मतदाता जागरूकता गतिविधियाँ, मॉक पोल क्विज व अभियान ट्रैकर',
        descEn: 'Electoral literacy activities, mock polls, quizzes and campaign tracker',
        iconName: 'shield' as const
      },
      {
        id: 'scholarship' as const,
        titleHi: 'छात्रवृत्ति प्रभारी प्रभाग',
        titleEn: 'Scholarship Incharge Portal',
        descHi: 'पूर्व व उत्तर मैट्रिक छात्रवृत्ति योजना आवेदन सत्यापन चेकलिस्ट व ट्रैकर',
        descEn: 'Pre/Post-Matric scholarship eligibility checkers, verification lists & trackers',
        iconName: 'award' as const
      },
      {
        id: 'lado' as const,
        titleHi: 'लाडो / बालिका संबल प्रभारी',
        titleEn: 'Lado Incharge Portal',
        descHi: 'मासिक सैनिटरी नैपकिन वितरण बही, आत्मरक्षा व बालिका स्वास्थ्य जागरूकता लॉग',
        descEn: 'Sanitary napkin distribution logs, self-defense session calendars & girl hygiene logs',
        iconName: 'sparkles' as const
      },
      {
        id: 'resizer' as const,
        titleHi: 'शाला दर्पण फोटो व सिग्नेचर रिसाइजर',
        titleEn: 'Shala Darpan Photo & Doc Resizer',
        descHi: 'छात्र-शिक्षक फोटो, हस्ताक्षर एवं दस्तावेज को शाला दर्पण मानक अनुसार रिसाइज करें',
        descEn: 'Resize student photos, signatures & PDF documents to exact portal limits',
        iconName: 'image' as const
      },
      {
        id: 'qrcode' as const,
        titleHi: 'क्यूआर कोड जनरेटर (परिपत्र व नोटिस)',
        titleEn: 'QR Code Generator (Notice & Circular)',
        descHi: 'स्कूल परिपत्रों, सूचनाओं व लिंक्स हेतु यूनिकोड हिंदी लेबल युक्त क्यूआर जनरेटर',
        descEn: 'Generate & download QR codes with Hindi labels for school circulars & notices',
        iconName: 'coupon' as const
      },
      {
        id: 'dutyroster' as const,
        titleHi: 'शिक्षक ड्यूटी व कार्यभार रोस्टर',
        titleEn: 'Teacher Duty Roster Tool',
        descHi: 'प्रार्थना सभा, एमडीएम, परीक्षा, मुख्य द्वार व अनुशासन हेतु शिक्षक ड्यूटी आवंटन चार्ट जनरेटर',
        descEn: 'Assign specific teacher duties for school activities & generate printable duty charts',
        iconName: 'briefcase' as const
      },
      {
        id: 'assembly' as const,
        titleHi: 'प्रार्थना सभा प्रभारी (Assembly)',
        titleEn: 'Prarthana Prabhari (Assembly)',
        descHi: 'दैनिक प्रार्थना सभा प्रबंधन, सामान्य ज्ञान प्रश्नोत्तरी, समाचार सुर्खियां, प्रेरक प्रसंग, बालिका मंच व योग क्रियाएं',
        descEn: 'School morning assembly planner, daily Rajasthan GK, news bulletin, inspirational stories, girls choir roster & yoga timer',
        iconName: 'book' as const
      }
    ];

    return (
      <div className="space-y-6 animate-fadeIn">

        <div className="text-center max-w-xl mx-auto space-y-2 mt-4">
          <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 flex items-center justify-center gap-2">
            <ThreeDIcon name="sparkles" size={36} />
            <span>{lang === 'hi' ? 'प्रभारी कार्यभार प्रभाग' : 'Incharge Portals & Modules'}</span>
          </h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {lang === 'hi' 
              ? 'शाला के सभी प्रभारियों के लिए एकीकृत एवं स्वचालित रिपोर्ट जनरेटर टूल्स। वांछित प्रभारी मॉड्यूल खोलने के लिए क्लिक करें।' 
              : 'Unified, highly automated report generation systems for specialized school incharges. Click on any module to open.'}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
          {modules.map((m) => (
            <ThreeDCard
              key={m.id}
              onClick={() => setActiveSubTab(m.id)}
              icon={m.iconName}
              label={lang === 'hi' ? m.titleHi : m.titleEn}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">

      {/* DUTY ROSTER MODULE */}
      {activeSubTab === 'dutyroster' && (
        <DutyRosterModule
          schoolProfile={schoolProfile}
          teachers={teachers}
          lang={lang}
          onBack={() => setActiveSubTab(null)}
        />
      )}

      {/* ASSEMBLY / PRARTHANA PRABHARI MODULE */}
      {activeSubTab === 'assembly' && (
        <AssemblyInchargeModule
          schoolProfile={schoolProfile}
          lang={lang}
          onBack={() => setActiveSubTab(null)}
        />
      )}

      {/* QR CODE GENERATOR MODULE */}
      {activeSubTab === 'qrcode' && (
        <QrCodeGeneratorModule
          schoolProfile={schoolProfile}
          lang={lang}
          onBack={() => setActiveSubTab(null)}
        />
      )}

      {/* 1. MDM DAILY MEAL & GRAIN CALCULATOR */}
      {activeSubTab === 'mdm' && (
        <MdmInchargeModule
          schoolProfile={schoolProfile}
          teachers={teachers}
          mdmLogs={mdmLogs}
          onUpdateMdmLogs={onUpdateMdmLogs}
          lang={lang}
          onBack={() => setActiveSubTab(null)}
        />
      )}

      {/* 2. ELC INCHARGE MODULE */}
      {activeSubTab === 'elc' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-lg border border-slate-200 dark:border-slate-800 space-y-5 animate-fadeIn">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 gap-3">
            <div>
              <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-600" />
                <span>{lang === 'hi' ? 'मतदाता साक्षरता क्लब (ELC) डैशबोर्ड' : 'Electoral Literacy Club (ELC) Dashboard'}</span>
              </h3>
              <p className="text-xs text-slate-500">
                {lang === 'hi' ? 'भावी मतदाताओं में नागरिक भागीदारी एवं चुनाव साक्षरता सशक्तिकरण हेतु टूल्स' : 'Promoting civic literacy and mock election voting simulations for students'}
              </p>
            </div>
            <button
              onClick={() => setActiveSubTab(null)}
              className="p-1.5 rounded-xl bg-slate-50 hover:bg-emerald-50 dark:bg-slate-800 dark:hover:bg-emerald-950/30 text-slate-500 hover:text-emerald-700 dark:text-slate-400 dark:hover:text-emerald-400 border border-slate-200 dark:border-slate-800 transition-colors shrink-0 flex items-center gap-1 text-xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{lang === 'hi' ? 'वापस' : 'Back'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            {/* Mock voting station */}
            <div className="md:col-span-5 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4">
              <div>
                <h4 className="font-bold text-xs text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Vote className="w-4 h-4 text-emerald-600" />
                  <span>{lang === 'hi' ? 'मॉक पोलिंग बूथ सिमुलेशन' : 'Mock Polling Station'}</span>
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {lang === 'hi' ? 'छात्रों को ईवीएम मशीन संचालन व चुनाव प्रणाली समझाने हेतु व्यावहारिक मॉक पोल' : 'Practical exercise teaching students on EVM and polling protocols'}
                </p>
              </div>

              {/* Candidates */}
              <div className="space-y-3">
                {(Object.entries(elcVotes) as [string, number][]).map(([candidate, votes]) => {
                  const total = (Object.values(elcVotes) as number[]).reduce((a: number, b: number) => a + b, 0) || 1;
                  const pct = Math.round((votes / total) * 100);
                  return (
                    <div key={candidate} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-700 dark:text-slate-300">{candidate}</span>
                        <span className="text-emerald-700 dark:text-emerald-400 font-bold">{votes} {lang === 'hi' ? 'मत' : 'votes'} ({pct}%)</span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                        <div className="bg-emerald-600 h-full transition-all duration-300" style={{ width: `${pct}%` }}></div>
                      </div>
                      <button
                        onClick={() => {
                          setElcVotes(prev => ({
                            ...prev,
                            [candidate]: prev[candidate] + 1
                          }));
                        }}
                        className="w-full py-1 mt-1 rounded bg-white dark:bg-slate-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 text-[10px] font-bold text-emerald-800 dark:text-emerald-300 border border-slate-200 dark:border-slate-600 transition-colors"
                      >
                        + Cast Mock Vote ({candidate})
                      </button>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={() => setElcVotes({ 'Candidate Alpha': 0, 'Candidate Beta': 0, 'NOTA': 0 })}
                className="w-full py-1.5 text-center text-[10px] text-slate-400 hover:text-red-500 font-semibold uppercase tracking-wider"
              >
                Reset Ballot Counter
              </button>
            </div>

            {/* Activities Log */}
            <div className="md:col-span-7 space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-emerald-600" />
                  <span>{lang === 'hi' ? 'ईएलसी गतिविधि पंजिका' : 'ELC Campaign & Activity Logs'}</span>
                </h4>
              </div>

              {/* Campaigns List */}
              <div className="space-y-2.5 max-h-[190px] overflow-y-auto pr-1">
                {elcCampaigns.map((c) => (
                  <div key={c.id} className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/60 dark:border-slate-800/50 flex justify-between items-start gap-2">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-100">{c.title}</span>
                        <span className="px-1.5 py-0.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[9px] font-bold rounded-full">{c.type}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 line-clamp-2">{c.description}</p>
                      <div className="flex items-center gap-3 text-[10px] text-slate-400 pt-1 font-mono">
                        <span>Date: {c.date}</span>
                        <span>Participants: {c.participants} students</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setElcCampaigns(prev => prev.filter(item => item.id !== c.id))}
                      className="p-1 rounded text-slate-400 hover:text-red-500 transition-colors shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add Activity Form */}
              <div className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                <span className="font-bold text-[11px] text-slate-600 dark:text-slate-300 block uppercase tracking-wider">{lang === 'hi' ? '+ नई गतिविधि दर्ज करें' : '+ Log New ELC Activity'}</span>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Activity Title / Topic"
                    value={newCampaignTitle}
                    onChange={e => setNewCampaignTitle(e.target.value)}
                    className="p-1.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs w-full"
                  />
                  <select
                    value={newCampaignType}
                    onChange={e => setNewCampaignType(e.target.value)}
                    className="p-1.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs w-full"
                  >
                    <option value="Rally">Rally / March</option>
                    <option value="Quiz">Quiz Contest</option>
                    <option value="Debate">Debate Session</option>
                    <option value="Mock Poll">Mock Election</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="date"
                    defaultValue="2026-03-24"
                    className="p-1.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs w-full"
                  />
                  <input
                    type="number"
                    placeholder="Student Count"
                    value={newCampaignParticipants}
                    onChange={e => setNewCampaignParticipants(e.target.value)}
                    className="p-1.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs w-full"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Short Description of Event"
                  value={newCampaignDesc}
                  onChange={e => setNewCampaignDesc(e.target.value)}
                  className="p-1.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs w-full"
                />
                <button
                  onClick={() => {
                    if (!newCampaignTitle) return;
                    setElcCampaigns(prev => [
                      ...prev,
                      {
                        id: `elc-${Date.now()}`,
                        title: newCampaignTitle,
                        date: new Date().toISOString().split('T')[0],
                        type: newCampaignType,
                        participants: Number(newCampaignParticipants) || 50,
                        description: newCampaignDesc || 'Democratic process education and campaign activity.'
                      }
                    ]);
                    setNewCampaignTitle('');
                    setNewCampaignDesc('');
                  }}
                  className="w-full py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded font-bold transition-colors"
                >
                  Save Log Entry
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. EXAM INCHARGE MODULE */}
      {activeSubTab === 'exam' && (
        <ExamInchargeModule
          schoolProfile={schoolProfile}
          teachers={teachers}
          lang={lang}
          onBack={() => setActiveSubTab(null)}
        />
      )}

      {/* 4. SCHOLARSHIP INCHARGE MODULE */}
      {activeSubTab === 'scholarship' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-lg border border-slate-200 dark:border-slate-800 space-y-4 animate-fadeIn">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 gap-3">
            <div>
              <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald-600" />
                <span>{lang === 'hi' ? 'छात्रवृत्ति (Pre/Post-Matric) सत्यापन प्रभाग' : 'Scholarship Verification & Management'}</span>
              </h3>
              <p className="text-xs text-slate-500">
                {lang === 'hi' ? 'पूर्व/उत्तर मैट्रिक छात्रवृत्ति पात्रता जांच, जन आधार मैपिंग व शाला दर्पण स्टेटस' : 'Track pre/post-matric applications, Jan Aadhaar map state & document validation'}
              </p>
            </div>
            <button
              onClick={() => setActiveSubTab(null)}
              className="p-1.5 rounded-xl bg-slate-50 hover:bg-emerald-50 dark:bg-slate-800 dark:hover:bg-emerald-950/30 text-slate-500 hover:text-emerald-700 dark:text-slate-400 dark:hover:text-emerald-400 border border-slate-200 dark:border-slate-800 transition-colors shrink-0 flex items-center gap-1 text-xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{lang === 'hi' ? 'वापस' : 'Back'}</span>
            </button>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-center">
              <span className="block text-[10px] text-slate-500 uppercase tracking-wider">Total Checked</span>
              <span className="text-lg font-black text-slate-800 dark:text-slate-100">{scholarshipApplicants.length}</span>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100/50 dark:border-emerald-900/30 text-center">
              <span className="block text-[10px] text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Approved</span>
              <span className="text-lg font-black text-emerald-700 dark:text-emerald-300">
                {scholarshipApplicants.filter(a => a.incomeVerified && a.casteVerified && a.janAadhaarMapped && a.shalaDarpanUploaded).length}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100/50 dark:border-rose-900/30 text-center">
              <span className="block text-[10px] text-rose-600 dark:text-rose-400 uppercase tracking-wider">Action Required</span>
              <span className="text-lg font-black text-rose-700 dark:text-rose-300">
                {scholarshipApplicants.filter(a => !(a.incomeVerified && a.casteVerified && a.janAadhaarMapped && a.shalaDarpanUploaded)).length}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Left Form */}
            <div className="lg:col-span-4 bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs space-y-3">
              <span className="font-bold text-xs text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <Plus className="w-4 h-4 text-emerald-600" />
                <span>{lang === 'hi' ? 'नया छात्रवृत्ति आवेदन जोड़ें' : 'Add Scholarship Candidate'}</span>
              </span>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Student Full Name"
                  value={newSchName}
                  onChange={e => setNewSchName(e.target.value)}
                  className="w-full p-2 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                />
                <select
                  value={newSchClass}
                  onChange={e => setNewSchClass(e.target.value)}
                  className="w-full p-2 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                >
                  <option value="Class 6">Class 6</option>
                  <option value="Class 7">Class 7</option>
                  <option value="Class 8">Class 8</option>
                  <option value="Class 9">Class 9</option>
                  <option value="Class 10">Class 10</option>
                  <option value="Class 11">Class 11</option>
                  <option value="Class 12">Class 12</option>
                </select>
                <select
                  value={newSchCategory}
                  onChange={e => {
                    setNewSchCategory(e.target.value);
                    setNewSchScheme(`Pre-Matric ${e.target.value} Scholarship`);
                  }}
                  className="w-full p-2 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                >
                  <option value="SC">Scheduled Caste (SC)</option>
                  <option value="ST">Scheduled Tribe (ST)</option>
                  <option value="OBC">Other Backward Class (OBC)</option>
                  <option value="EWS">Economically Weaker Section (EWS)</option>
                </select>
                <input
                  type="text"
                  value={newSchScheme}
                  disabled
                  className="w-full p-2 rounded border border-slate-100 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono text-[10px]"
                />
                <button
                  onClick={() => {
                    if (!newSchName) return;
                    setScholarshipApplicants(prev => [
                      ...prev,
                      {
                        id: `sch-${Date.now()}`,
                        name: newSchName,
                        className: newSchClass,
                        scheme: newSchScheme,
                        category: newSchCategory,
                        incomeVerified: false,
                        casteVerified: true,
                        janAadhaarMapped: false,
                        shalaDarpanUploaded: false,
                        status: 'Pending'
                      }
                    ]);
                    setNewSchName('');
                  }}
                  className="w-full py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded font-bold text-xs"
                >
                  Add Candidate
                </button>
              </div>
            </div>

            {/* Right List */}
            <div className="lg:col-span-8 space-y-2">
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  placeholder="Search students..."
                  value={schSearch}
                  onChange={e => setSchSearch(e.target.value)}
                  className="p-1.5 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs flex-1"
                />
                <select
                  value={schFilter}
                  onChange={e => setSchFilter(e.target.value)}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs"
                >
                  <option value="All">All Categories</option>
                  <option value="SC">SC</option>
                  <option value="ST">ST</option>
                  <option value="OBC">OBC</option>
                  <option value="EWS">EWS</option>
                </select>
              </div>

              <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
                {scholarshipApplicants
                  .filter(a => schSearch ? a.name.toLowerCase().includes(schSearch.toLowerCase()) : true)
                  .filter(a => schFilter === 'All' ? true : a.category === schFilter)
                  .map((a) => {
                    const isAllApproved = a.incomeVerified && a.casteVerified && a.janAadhaarMapped && a.shalaDarpanUploaded;
                    return (
                      <div key={a.id} className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-800 dark:text-slate-100">{a.name}</span>
                            <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded font-mono">{a.className}</span>
                            <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                              isAllApproved
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            }`}>
                              {isAllApproved ? 'Approved' : 'Action Req.'}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-500">{a.scheme} ({a.category})</p>
                        </div>

                        {/* Document verification checklist */}
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            onClick={() => {
                              setScholarshipApplicants(prev => prev.map(item => item.id === a.id ? { ...item, incomeVerified: !item.incomeVerified } : item));
                            }}
                            className={`px-2 py-1 rounded text-[10px] font-semibold border transition-all ${
                              a.incomeVerified
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20'
                                : 'bg-slate-50 text-slate-400 border-slate-200 dark:bg-slate-800/30'
                            }`}
                          >
                            Income
                          </button>
                          <button
                            onClick={() => {
                              setScholarshipApplicants(prev => prev.map(item => item.id === a.id ? { ...item, casteVerified: !item.casteVerified } : item));
                            }}
                            className={`px-2 py-1 rounded text-[10px] font-semibold border transition-all ${
                              a.casteVerified
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20'
                                : 'bg-slate-50 text-slate-400 border-slate-200 dark:bg-slate-800/30'
                            }`}
                          >
                            Caste
                          </button>
                          <button
                            onClick={() => {
                              setScholarshipApplicants(prev => prev.map(item => item.id === a.id ? { ...item, janAadhaarMapped: !item.janAadhaarMapped } : item));
                            }}
                            className={`px-2 py-1 rounded text-[10px] font-semibold border transition-all ${
                              a.janAadhaarMapped
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20'
                                : 'bg-slate-50 text-slate-400 border-slate-200 dark:bg-slate-800/30'
                            }`}
                          >
                            Jan-Adh
                          </button>
                          <button
                            onClick={() => {
                              setScholarshipApplicants(prev => prev.map(item => item.id === a.id ? { ...item, shalaDarpanUploaded: !item.shalaDarpanUploaded } : item));
                            }}
                            className={`px-2 py-1 rounded text-[10px] font-semibold border transition-all ${
                              a.shalaDarpanUploaded
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20'
                                : 'bg-slate-50 text-slate-400 border-slate-200 dark:bg-slate-800/30'
                            }`}
                          >
                            SD-Map
                          </button>
                          <button
                            onClick={() => {
                              setScholarshipApplicants(prev => prev.filter(item => item.id !== a.id));
                            }}
                            className="p-1 rounded text-slate-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. LADO INCHARGE MODULE (NEW) */}
      {activeSubTab === 'lado' && (
        <LadoInchargeModule
          schoolProfile={schoolProfile}
          lang={lang}
          onBack={() => setActiveSubTab(null)}
        />
      )}

      {/* 5. LADO INCHARGE MODULE (OLD DETACHED) */}
      {activeSubTab === 'lado_old' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-lg border border-slate-200 dark:border-slate-800 space-y-5 animate-fadeIn">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 gap-3">
            <div>
              <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-600" />
                <span>{lang === 'hi' ? 'लाडो / बालिका संबल प्रभारी डैशबोर्ड' : 'Lado Scheme & Girls Welfare Portal'}</span>
              </h3>
              <p className="text-xs text-slate-500">
                {lang === 'hi' ? 'मासिक सैनिटरी नैपकिन स्टॉक बही, रानी लक्ष्मीबाई आत्मरक्षा प्रशिक्षण व बालिका परामर्श लॉग' : 'Manage monthly sanitary napkin inventory, Rani Laxmibai self-defense & girl wellness'}
              </p>
            </div>
            <button
              onClick={() => setActiveSubTab(null)}
              className="p-1.5 rounded-xl bg-slate-50 hover:bg-emerald-50 dark:bg-slate-800 dark:hover:bg-emerald-950/30 text-slate-500 hover:text-emerald-700 dark:text-slate-400 dark:hover:text-emerald-400 border border-slate-200 dark:border-slate-800 transition-colors shrink-0 flex items-center gap-1 text-xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{lang === 'hi' ? 'वापस' : 'Back'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            {/* Napkins Stock Left Block */}
            <div className="md:col-span-5 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1">
                  <Package className="w-4 h-4 text-emerald-600" />
                  <span>Napkin Inventory Ledger</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Current Stock</span>
              </div>

              {/* Stock Indicator */}
              <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-center space-y-1">
                <span className="block text-2xl font-black text-emerald-700 dark:text-emerald-400">{ladoStock} pcs</span>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider">Available Sanitary Napkins</span>
              </div>

              {/* Inventory low alert */}
              {ladoStock < 400 && (
                <div className="p-2.5 bg-rose-50 dark:bg-rose-950/20 text-[10px] text-rose-700 dark:text-rose-400 rounded-lg border border-rose-200/50 dark:border-rose-900/30 leading-snug">
                  ⚠️ <strong>Stock Warning:</strong> Inventory levels are below the required reserve threshold. Please submit a napkin requisition request on Shala Darpan.
                </div>
              )}

              {/* Distribution & Add Stock Forms */}
              <div className="space-y-3.5 border-t border-slate-200 dark:border-slate-700 pt-3 text-xs">
                {/* Add Stock */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 font-bold">Add Stock Receipts (Qty)</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Add napkin count"
                      value={ladoNapkinAdd}
                      onChange={e => setLadoNapkinAdd(e.target.value)}
                      className="p-1.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs flex-1"
                    />
                    <button
                      onClick={() => {
                        const count = Number(ladoNapkinAdd);
                        if (!count || count <= 0) return;
                        setLadoStock(prev => prev + count);
                        setLadoNapkinAdd('');
                      }}
                      className="px-3 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded text-xs transition-colors"
                    >
                      Receive
                    </button>
                  </div>
                </div>

                {/* Distribute Stock */}
                <div className="space-y-1.5 border-t border-slate-200 dark:border-slate-700 pt-2.5">
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 font-bold">Distribute to Class Girls</label>
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={ladoDistClass}
                      onChange={e => setLadoDistClass(e.target.value)}
                      className="p-1.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs w-full"
                    >
                      <option value="Class 6 Girls">Class 6 Girls</option>
                      <option value="Class 7 Girls">Class 7 Girls</option>
                      <option value="Class 8 Girls">Class 8 Girls</option>
                      <option value="Class 9 Girls">Class 9 Girls</option>
                      <option value="Class 10 Girls">Class 10 Girls</option>
                      <option value="Class 11 Girls">Class 11 Girls</option>
                      <option value="Class 12 Girls">Class 12 Girls</option>
                    </select>
                    <input
                      type="number"
                      placeholder="Quantity"
                      value={ladoDistQty}
                      onChange={e => setLadoDistQty(e.target.value)}
                      className="p-1.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs w-full"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Distribution remarks/notes"
                    value={ladoDistRemarks}
                    onChange={e => setLadoDistRemarks(e.target.value)}
                    className="p-1.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs w-full"
                  />
                  <button
                    onClick={() => {
                      const qty = Number(ladoDistQty);
                      if (!qty || qty <= 0 || ladoStock < qty) return;
                      setLadoStock(prev => prev - qty);
                      setLadoDistributionLogs(prev => [
                        {
                          id: `ld-${Date.now()}`,
                          date: new Date().toISOString().split('T')[0],
                          className: ladoDistClass,
                          quantity: qty,
                          remarks: ladoDistRemarks || 'Monthly distribution'
                        },
                        ...prev
                      ]);
                      setLadoDistRemarks('Monthly distribution');
                    }}
                    className="w-full py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded font-bold text-xs transition-colors"
                  >
                    Confirm & Record Distribution
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column Self-defense logs and distribution diary */}
            <div className="md:col-span-7 space-y-4 text-xs">
              <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-emerald-600" />
                <span>Empowerment Events & Distribution Diary</span>
              </h4>

              {/* Navigation/Toggle Sub-panels within Lado */}
              <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-lg grid grid-cols-2 gap-1 text-center font-bold text-[11px]">
                <span className="p-1.5 bg-white dark:bg-slate-950 text-emerald-800 dark:text-emerald-300 rounded shadow-sm">
                  Ledger Logs
                </span>
                <span className="p-1.5 text-slate-500">
                  Rani Laxmibai Training & Support
                </span>
              </div>

              {/* List of Ledger transactions */}
              <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
                {ladoDistributionLogs.map((log) => (
                  <div key={log.id} className="p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/60 dark:border-slate-800/50 flex justify-between items-center text-xs">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800 dark:text-slate-100">{log.className}</span>
                        <span className="font-bold text-emerald-800 dark:text-emerald-400 font-mono">{log.quantity} distributed</span>
                      </div>
                      <p className="text-[10px] text-slate-400">Date: {log.date} | Note: {log.remarks}</p>
                    </div>
                    <button
                      onClick={() => {
                        setLadoStock(prev => prev + log.quantity);
                        setLadoDistributionLogs(prev => prev.filter(item => item.id !== log.id));
                      }}
                      className="p-1 rounded text-slate-400 hover:text-red-500 transition-colors shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Self Defense Activity Logs */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2.5">
                <span className="font-bold text-[11px] text-slate-600 dark:text-slate-300 block uppercase tracking-wider">
                  🔒 Rani Laxmibai Self-Defense Events log
                </span>
                <div className="space-y-2 max-h-[120px] overflow-y-auto">
                  {ladoEvents.map(e => (
                    <div key={e.id} className="p-2 bg-white dark:bg-slate-900 rounded border border-slate-200 text-[11px] space-y-0.5">
                      <div className="flex justify-between font-bold text-slate-800 dark:text-slate-200">
                        <span>{e.title}</span>
                        <span className="text-emerald-700 dark:text-emerald-400 font-mono">{e.participants} girls</span>
                      </div>
                      <p className="text-[10px] text-slate-500">Date: {e.date} | Coach: {e.instructor}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* --- Dropout Prevention and Intervention Follow-up History Tracker --- */}
          <div className="border-t border-slate-200 dark:border-slate-800 pt-5 mt-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
              <div>
                <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-rose-600" />
                  <span>
                    {lang === 'hi' ? 'बालिका स्कूल ड्रॉपआउट रोकथाम एवं गृह संपर्क लॉग' : 'Girls Dropout Prevention & Follow-up History Tracker'}
                  </span>
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {lang === 'hi' ? 'लगातार अनुपस्थित छात्राओं की सूची, अभिभावक संपर्क, परामर्श और शाला वापसी ट्रैकिंग' : 'Track and counsel girls at risk of dropping out, log home visits and register school-return status'}
                </p>
              </div>

              {/* Status Counters */}
              <div className="flex flex-wrap gap-2 text-[10px] font-bold">
                <span className="px-2 py-1 rounded bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-400 border border-amber-200/50 dark:border-amber-900/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                  {lang === 'hi' ? 'सक्रिय मामले' : 'Active Cases'}: {ladoDropouts.filter(d => d.status !== 'Re-enrolled' && d.status !== 'Dropped Out').length}
                </span>
                <span className="px-2 py-1 rounded bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-900/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  {lang === 'hi' ? 'पुनः नामांकित (सुरक्षित)' : 'Re-enrolled (Saved)'}: {ladoDropouts.filter(d => d.status === 'Re-enrolled').length}
                </span>
                <span className="px-2 py-1 rounded bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 flex items-center gap-1">
                  Total: {ladoDropouts.length}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Add Student Form */}
              <div className="lg:col-span-4 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3.5 text-xs">
                <span className="font-bold text-[11px] text-slate-700 dark:text-slate-300 uppercase tracking-wider block border-b border-slate-200 dark:border-slate-700 pb-1.5 font-sans">
                  {lang === 'hi' ? '➕ नया ड्रॉपआउट केस दर्ज करें' : '➕ Register At-Risk Student'}
                </span>
                
                <div className="space-y-2.5">
                  <div>
                    <label className="block text-[10px] text-slate-500 font-semibold mb-1">{lang === 'hi' ? 'छात्रा का नाम' : 'Student Name'}</label>
                    <input
                      type="text"
                      placeholder={lang === 'hi' ? 'छात्रा का पूरा नाम दर्ज करें' : 'Enter student full name'}
                      value={newDoName}
                      onChange={e => setNewDoName(e.target.value)}
                      className="w-full p-2 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs focus:ring-1 focus:ring-emerald-500 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] text-slate-500 font-semibold mb-1">{lang === 'hi' ? 'कक्षा' : 'Class'}</label>
                      <select
                        value={newDoClass}
                        onChange={e => setNewDoClass(e.target.value)}
                        className="w-full p-2 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs focus:ring-1 focus:ring-emerald-500"
                      >
                        <option value="Class 6">Class 6</option>
                        <option value="Class 7">Class 7</option>
                        <option value="Class 8">Class 8</option>
                        <option value="Class 9">Class 9</option>
                        <option value="Class 10">Class 10</option>
                        <option value="Class 11">Class 11</option>
                        <option value="Class 12">Class 12</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-500 font-semibold mb-1">{lang === 'hi' ? 'अनुपस्थिति (दिन)' : 'Absent Days'}</label>
                      <input
                        type="number"
                        placeholder="e.g. 15"
                        value={newDoDaysAbsent}
                        onChange={e => setNewDoDaysAbsent(e.target.value)}
                        className="w-full p-2 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs focus:ring-1 focus:ring-emerald-500 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-500 font-semibold mb-1">{lang === 'hi' ? 'ड्रॉपआउट जोखिम का मुख्य कारण' : 'Primary Risk Factor'}</label>
                    <select
                      value={newDoReason}
                      onChange={e => setNewDoReason(e.target.value)}
                      className="w-full p-2 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs focus:ring-1 focus:ring-emerald-500"
                    >
                      <option value="Distance & Lack of Transport">{lang === 'hi' ? 'दूरी व सुरक्षित परिवहन का अभाव' : 'Distance & Lack of Safe Transport'}</option>
                      <option value="Household chores & Caregiving">{lang === 'hi' ? 'घरेलू काम व छोटे भाई-बहनों की देखरेख' : 'Household chores & Caregiving'}</option>
                      <option value="Financial difficulties & Uniform cost">{lang === 'hi' ? 'आर्थिक तंगी व स्कूल खर्च' : 'Financial difficulties & School cost'}</option>
                      <option value="Early marriage risk / engagement">{lang === 'hi' ? 'कम उम्र में विवाह / सगाई दबाव' : 'Early marriage risk / social pressure'}</option>
                      <option value="Academic underperformance / fear">{lang === 'hi' ? 'पढ़ाई में अरुचि या परीक्षा का डर' : 'Academic fear / low interest'}</option>
                      <option value="Health or personal issues">{lang === 'hi' ? 'स्वास्थ्य अथवा व्यक्तिगत कारण' : 'Health or personal issues'}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-500 font-semibold mb-1">{lang === 'hi' ? 'प्रारंभिक स्थिति' : 'Initial Status'}</label>
                    <select
                      value={newDoStatus}
                      onChange={e => setNewDoStatus(e.target.value)}
                      className="w-full p-2 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs focus:ring-1 focus:ring-emerald-500"
                    >
                      <option value="Identified">{lang === 'hi' ? 'चिह्नित (Identified)' : 'Identified'}</option>
                      <option value="Contacted Parent">{lang === 'hi' ? 'अभिभावक से संपर्क (Contacted)' : 'Contacted Parent'}</option>
                      <option value="Counseling Done">{lang === 'hi' ? 'परामर्श पूर्ण (Counseling Done)' : 'Counseling Done'}</option>
                      <option value="Re-enrolled">{lang === 'hi' ? 'पुनः नामांकित (Re-enrolled)' : 'Re-enrolled'}</option>
                    </select>
                  </div>

                  <button
                    onClick={() => {
                      if (!newDoName.trim()) return;
                      const days = Number(newDoDaysAbsent) || 10;
                      setLadoDropouts(prev => [
                        ...prev,
                        {
                          id: `do-${Date.now()}`,
                          studentName: newDoName,
                          className: newDoClass,
                          daysAbsent: days,
                          reasonForRisk: newDoReason,
                          status: newDoStatus,
                          followUps: []
                        }
                      ]);
                      setNewDoName('');
                      setNewDoDaysAbsent('');
                    }}
                    className="w-full py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{lang === 'hi' ? 'केस सहेजें' : 'Save & Track Candidate'}</span>
                  </button>
                </div>
              </div>

              {/* Student dropout tracking table / list */}
              <div className="lg:col-span-8 space-y-2.5">
                <span className="font-bold text-[11px] text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                  {lang === 'hi' ? '📋 निगरानी सूची एवं हस्तक्षेप इतिहास' : '📋 Monitoring Roster & Intervention History'}
                </span>

                <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                  {ladoDropouts.length === 0 ? (
                    <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/20 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-slate-400">
                      {lang === 'hi' ? 'कोई सक्रिय ड्रॉपआउट रोकथाम मामला नहीं है।' : 'No active dropout prevention cases currently tracked.'}
                    </div>
                  ) : (
                    ladoDropouts.map((d) => {
                      const isExpanded = selectedDoId === d.id;
                      
                      // Status Badge coloring helper
                      let statusBadgeClass = 'bg-slate-100 text-slate-700';
                      if (d.status === 'Identified') statusBadgeClass = 'bg-amber-100 text-amber-800 dark:bg-amber-950/30 dark:text-amber-400 border border-amber-200/40';
                      if (d.status === 'Contacted Parent') statusBadgeClass = 'bg-blue-100 text-blue-800 dark:bg-blue-950/30 dark:text-blue-400 border border-blue-200/40';
                      if (d.status === 'Counseling Done') statusBadgeClass = 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/30 dark:text-indigo-400 border border-indigo-200/40';
                      if (d.status === 'Re-enrolled') statusBadgeClass = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400 border border-emerald-200/40';
                      if (d.status === 'Dropped Out') statusBadgeClass = 'bg-rose-100 text-rose-800 dark:bg-rose-950/30 dark:text-rose-400 border border-rose-200/40';

                      return (
                        <div
                          key={d.id}
                          className="p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3 shadow-sm hover:shadow-md transition-shadow"
                        >
                          {/* Row Header */}
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 text-xs">
                            <div className="space-y-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="font-extrabold text-sm text-slate-800 dark:text-slate-100">{d.studentName}</span>
                                <span className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded text-[10px] font-mono font-bold">
                                  {d.className}
                                </span>
                                <span className="px-1.5 py-0.5 bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400 rounded text-[10px] font-mono">
                                  {d.daysAbsent} {lang === 'hi' ? 'दिन अनुपस्थित' : 'Days Absent'}
                                </span>
                              </div>
                              <p className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                                {lang === 'hi' ? 'जोखिम कारण' : 'Risk'}: {d.reasonForRisk}
                              </p>
                            </div>

                            {/* Status & Actions */}
                            <div className="flex items-center gap-2 self-start md:self-center">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${statusBadgeClass}`}>
                                {d.status === 'Identified' && (lang === 'hi' ? 'चिह्नित' : 'Identified')}
                                {d.status === 'Contacted Parent' && (lang === 'hi' ? 'अभिभावक संपर्क' : 'Contacted Parent')}
                                {d.status === 'Counseling Done' && (lang === 'hi' ? 'परामर्श पूर्ण' : 'Counseling Done')}
                                {d.status === 'Re-enrolled' && (lang === 'hi' ? 'पुनः नामांकित' : 'Re-enrolled')}
                                {d.status === 'Dropped Out' && (lang === 'hi' ? 'ड्रॉपआउट' : 'Dropped Out')}
                              </span>

                              <button
                                onClick={() => {
                                  if (isExpanded) {
                                    setSelectedDoId(null);
                                  } else {
                                    setSelectedDoId(d.id);
                                    setNewFuStatusUpdate(d.status);
                                  }
                                }}
                                className={`px-2.5 py-1 rounded text-[10px] font-bold border transition-colors flex items-center gap-1 ${
                                  isExpanded
                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/30'
                                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700'
                                }`}
                              >
                                <Activity className="w-3 h-3" />
                                <span>
                                  {lang === 'hi' ? 'हस्तक्षेप' : 'Follow-ups'} ({d.followUps.length})
                                </span>
                              </button>

                              <button
                                onClick={() => {
                                  setLadoDropouts(prev => prev.filter(item => item.id !== d.id));
                                  if (selectedDoId === d.id) setSelectedDoId(null);
                                }}
                                className="p-1 rounded text-slate-400 hover:text-red-500 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-800"
                                title="Remove case"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Expanded follow-ups ledger section */}
                          {isExpanded && (
                            <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3 bg-slate-50/50 dark:bg-slate-800/20 p-3 rounded-lg animate-fadeIn text-[11px]">
                              {/* Past follow-ups list */}
                              {d.followUps.length > 0 && (
                                <div className="space-y-2 border-b border-slate-200/60 dark:border-slate-700 pb-3">
                                  <span className="font-bold text-[10px] text-slate-600 dark:text-slate-400 uppercase tracking-wider block">
                                    {lang === 'hi' ? 'हस्तक्षेप इतिहास' : 'Intervention Log'}
                                  </span>
                                  <div className="space-y-2 max-h-[160px] overflow-y-auto">
                                    {d.followUps.map((f) => (
                                      <div key={f.id} className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded shadow-sm text-[11px]">
                                        <div className="flex justify-between font-bold text-slate-700 dark:text-slate-300 mb-1 font-mono text-[10px]">
                                          <span>By: {f.officer}</span>
                                          <span>{f.date}</span>
                                        </div>
                                        <p className="text-slate-600 dark:text-slate-400 leading-normal">{f.details}</p>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Form to log a new follow-up */}
                              <div className="space-y-2.5">
                                <span className="font-bold text-[10px] text-slate-600 dark:text-slate-400 uppercase tracking-wider block">
                                  {lang === 'hi' ? '📝 नया गृह संपर्क / हस्तक्षेप लॉग जोड़ें' : '📝 Log New Home Visit or Counseling'}
                                </span>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                  <div>
                                    <label className="block text-[9px] text-slate-500 font-semibold mb-0.5">{lang === 'hi' ? 'हस्तक्षेप करने वाला प्रभारी/अधिकारी' : 'Incharge Officer'}</label>
                                    <input
                                      type="text"
                                      placeholder="e.g. Smt. Saroj Yadav"
                                      value={newFuOfficer}
                                      onChange={e => setNewFuOfficer(e.target.value)}
                                      className="w-full p-1.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-[11px]"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[9px] text-slate-500 font-semibold mb-0.5">{lang === 'hi' ? 'स्थिति अद्यतन (Status Update)' : 'Update Status to'}</label>
                                    <select
                                      value={newFuStatusUpdate}
                                      onChange={e => setNewFuStatusUpdate(e.target.value)}
                                      className="w-full p-1.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-[11px]"
                                    >
                                      <option value="Identified">{lang === 'hi' ? 'चिह्नित (Identified)' : 'Identified'}</option>
                                      <option value="Contacted Parent">{lang === 'hi' ? 'अभिभावक संपर्क (Contacted Parent)' : 'Contacted Parent'}</option>
                                      <option value="Counseling Done">{lang === 'hi' ? 'परामर्श पूर्ण (Counseling Done)' : 'Counseling Done'}</option>
                                      <option value="Re-enrolled">{lang === 'hi' ? 'पुनः नामांकित (Re-enrolled)' : 'Re-enrolled'}</option>
                                      <option value="Dropped Out">{lang === 'hi' ? 'ड्रॉपआउट (Dropped Out)' : 'Dropped Out'}</option>
                                    </select>
                                  </div>
                                </div>

                                <div>
                                  <label className="block text-[9px] text-slate-500 font-semibold mb-0.5">{lang === 'hi' ? 'हस्तक्षेप का संक्षिप्त विवरण (गृह संपर्क रिपोर्ट, अभिभावक वार्तालाप)' : 'Intervention Details / Home Visit Summary'}</label>
                                  <textarea
                                    rows={2}
                                    placeholder={lang === 'hi' ? 'जैसे: गृह संपर्क किया गया। माता-पिता से चर्चा हुई और वे बालिका को सोमवार से विद्यालय भेजने के लिए सहमत हुए।' : 'e.g. Visited family. Discussed importance of board exam. Arranged transport assist. Parents agreed.'}
                                    value={newFuDetails}
                                    onChange={e => setNewFuDetails(e.target.value)}
                                    className="w-full p-2 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-[11px] outline-none resize-none"
                                  />
                                </div>

                                <button
                                  onClick={() => {
                                    if (!newFuDetails.trim()) return;
                                    const officerName = newFuOfficer.trim() || (lang === 'hi' ? 'श्रीमती सरोज यादव (Lado Incharge)' : 'Smt. Saroj Yadav (Lado Incharge)');
                                    
                                    setLadoDropouts(prev => prev.map(item => {
                                      if (item.id === d.id) {
                                        return {
                                          ...item,
                                          status: newFuStatusUpdate,
                                          followUps: [
                                            ...item.followUps,
                                            {
                                              id: `fu-${Date.now()}`,
                                              date: new Date().toISOString().split('T')[0],
                                              details: newFuDetails,
                                              officer: officerName
                                            }
                                          ]
                                        };
                                      }
                                      return item;
                                    }));
                                    
                                    setNewFuDetails('');
                                    setNewFuOfficer('');
                                  }}
                                  className="w-full py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded font-bold font-mono text-[10px]"
                                >
                                  Save Follow-up Entry & Set Status
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* BOARD EXAM REMUNERATION BILL */}
      {activeSubTab === 'remuneration' && (
        <BoardExamRemunerationBill
          schoolProfile={schoolProfile}
          teachers={teachers}
          lang={lang}
          onBack={() => setActiveSubTab(null)}
        />
      )}

      {/* TRANSPORT VOUCHER INCHARGE MODULE */}
      {activeSubTab === 'transport' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-lg border border-slate-200 dark:border-slate-800 space-y-5 animate-fadeIn">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 gap-3">
            <div>
              <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Bus className="w-5 h-5 text-emerald-600" />
                <span>{lang === 'hi' ? 'ट्रांसपोर्ट वाउचर छात्र मैपिंग एवं भत्ता क्लेम' : 'Transport Voucher Student Mapping & Claim'}</span>
              </h3>
              <p className="text-xs text-slate-500">
                {lang === 'hi' ? 'ग्रामीण एवं दूरस्थ क्षेत्रों से आने वाले छात्र-छात्राओं का दूरी सत्यापन एवं परिवहन भत्ता बिल' : 'Rural distance verification & transport voucher claim generator (>1km primary / >2km upper primary)'}
              </p>
            </div>
            <button
              onClick={() => setActiveSubTab(null)}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 text-xs font-bold transition-colors flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{lang === 'hi' ? 'पीछे जाएँ' : 'Back'}</span>
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/60 flex items-start gap-3 text-xs text-emerald-900 dark:text-emerald-200">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold">{lang === 'hi' ? 'राजस्थान परिवहन भत्ता योजना नियम 2026' : 'Rajasthan Transport Allowance Policy 2026'}</div>
              <p className="mt-0.5 text-slate-600 dark:text-slate-300">
                {lang === 'hi'
                  ? 'प्राथमिक कक्षाओं (1-5) के लिए 1 किमी तथा उच्च प्राथमिक/माध्यमिक (6-12) के लिए 2 किमी से अधिक दूरी पर स्थित निवास वाले छात्रों को प्रतिमाह रू 400 तक का परिवहन भत्ता स्वीकृत किया जाता है।'
                  : 'Students residing >1 km (Primary 1-5) or >2 km (Upper Primary/Sec 6-12) from school are eligible for up to ₹400/month transport voucher reimbursement.'}
              </p>
            </div>
          </div>

          {/* Transport Student List Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-500">{lang === 'hi' ? 'लाभान्वित छात्र सूची' : 'Eligible Student Roster'}</h4>
              <button
                onClick={() => {
                  window.print();
                }}
                className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1 shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{lang === 'hi' ? 'वाउचर प्रपत्र प्रिंट करें' : 'Print Voucher Claim'}</span>
              </button>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-extrabold border-b border-slate-200 dark:border-slate-700">
                    <th className="p-3">#</th>
                    <th className="p-3">{lang === 'hi' ? 'छात्र / छात्रा का नाम' : 'Student Name'}</th>
                    <th className="p-3">{lang === 'hi' ? 'कक्षा' : 'Class'}</th>
                    <th className="p-3">{lang === 'hi' ? 'निवास दूरी (KM)' : 'Distance (KM)'}</th>
                    <th className="p-3">{lang === 'hi' ? 'परिवहन साधन' : 'Transport Mode'}</th>
                    <th className="p-3">{lang === 'hi' ? 'मासिक भत्ते की राशि' : 'Monthly Claim'}</th>
                    <th className="p-3">{lang === 'hi' ? 'बैंक खाता एवं IFSC' : 'Bank Details'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="p-3 font-mono">1</td>
                    <td className="p-3 font-bold">Ramesh Kumar Gurjar</td>
                    <td className="p-3">Class 8</td>
                    <td className="p-3 font-mono font-bold text-emerald-600">3.5 KM</td>
                    <td className="p-3">Auto/Bus</td>
                    <td className="p-3 font-mono font-bold text-amber-600">₹ 400 / mo</td>
                    <td className="p-3 font-mono text-[11px]">39102910291 (SBIN0001234)</td>
                  </tr>
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="p-3 font-mono">2</td>
                    <td className="p-3 font-bold">Pooja Verma</td>
                    <td className="p-3">Class 6</td>
                    <td className="p-3 font-mono font-bold text-emerald-600">2.2 KM</td>
                    <td className="p-3">Bicycle</td>
                    <td className="p-3 font-mono font-bold text-amber-600">₹ 300 / mo</td>
                    <td className="p-3 font-mono text-[11px]">50100293019 (HDFC0000123)</td>
                  </tr>
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="p-3 font-mono">3</td>
                    <td className="p-3 font-bold">Kavita Meena</td>
                    <td className="p-3">Class 10</td>
                    <td className="p-3 font-mono font-bold text-emerald-600">4.1 KM</td>
                    <td className="p-3">Walk / Local</td>
                    <td className="p-3 font-mono font-bold text-amber-600">₹ 400 / mo</td>
                    <td className="p-3 font-mono text-[11px]">20391029301 (BARB0JAIPUR)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SHALA DARPAN PHOTO & SIGNATURE RESIZER */}
      {activeSubTab === 'resizer' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-lg border border-slate-200 dark:border-slate-800 space-y-5 animate-fadeIn">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 gap-3">
            <div>
              <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Image className="w-5 h-5 text-emerald-600" />
                <span>{lang === 'hi' ? 'शाला दर्पण फोटो, हस्ताक्षर व डॉक्यूमेंट रिसाइजर' : 'Shala Darpan Image & Document Resizer'}</span>
              </h3>
              <p className="text-xs text-slate-500">
                {lang === 'hi' ? 'शाला दर्पण एवं पे-मैनेजर के निर्धारित KB साईज अनुसार फोटो एवं हस्ताक्षर तुरंत रिसाइज करें' : 'Resize photos & signatures to exact Portal KB specifications (20-50KB Photo, 10-20KB Signature)'}
              </p>
            </div>
            <button
              onClick={() => setActiveSubTab(null)}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 text-xs font-bold transition-colors flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{lang === 'hi' ? 'पीछे जाएँ' : 'Back'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl border-2 border-dashed border-emerald-300 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20 text-center space-y-3">
              <Upload className="w-8 h-8 text-emerald-600 mx-auto animate-bounce" />
              <div>
                <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">
                  {lang === 'hi' ? 'फोटो अथवा हस्ताक्षर इमेज चुनें' : 'Select Image File'}
                </h4>
                <p className="text-xs text-slate-500 mt-1">JPG, PNG, WEBP (Max 10MB)</p>
              </div>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="shala-resizer-file-input"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (evt) => {
                      const img = document.getElementById('resizer-preview-img') as HTMLImageElement;
                      if (img && evt.target?.result) {
                        img.src = evt.target.result as string;
                        img.classList.remove('hidden');
                      }
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
              <label
                htmlFor="shala-resizer-file-input"
                className="inline-block px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer shadow-md transition-colors"
              >
                {lang === 'hi' ? 'फाइल अपलोड करें' : 'Browse File'}
              </label>
            </div>

            <div className="space-y-3 text-xs bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
              <h4 className="font-extrabold text-slate-800 dark:text-slate-200">
                {lang === 'hi' ? 'पोर्टल रीसाइज़ प्रीसेट चुनें' : 'Target Portal Specifications'}
              </h4>

              <div className="space-y-2">
                <label className="flex items-center gap-2 p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 cursor-pointer">
                  <input type="radio" name="preset" defaultChecked className="accent-emerald-600" />
                  <div>
                    <div className="font-bold text-slate-800 dark:text-slate-200">Shala Darpan Student Photo (20 KB - 50 KB)</div>
                    <div className="text-[10px] text-slate-500">Dimensions: 300 x 400 px</div>
                  </div>
                </label>

                <label className="flex items-center gap-2 p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 cursor-pointer">
                  <input type="radio" name="preset" className="accent-emerald-600" />
                  <div>
                    <div className="font-bold text-slate-800 dark:text-slate-200">Shala Darpan Student Signature (10 KB - 20 KB)</div>
                    <div className="text-[10px] text-slate-500">Dimensions: 300 x 150 px</div>
                  </div>
                </label>

                <label className="flex items-center gap-2 p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 cursor-pointer">
                  <input type="radio" name="preset" className="accent-emerald-600" />
                  <div>
                    <div className="font-bold text-slate-800 dark:text-slate-200">PayManager / APAR Document (&lt; 300 KB)</div>
                    <div className="text-[10px] text-slate-500">Dimensions: 800 x 1100 px</div>
                  </div>
                </label>
              </div>

              <div className="pt-2">
                <img id="resizer-preview-img" alt="Resized Preview" className="hidden max-h-36 mx-auto rounded-xl border border-slate-300 shadow-sm" />
                <button
                  onClick={() => {
                    const img = document.getElementById('resizer-preview-img') as HTMLImageElement;
                    if (img && img.src) {
                      const a = document.createElement('a');
                      a.href = img.src;
                      a.download = 'ShalaDarpan_Resized_Photo.jpg';
                      a.click();
                    } else {
                      alert(lang === 'hi' ? 'कृपया पहले इमेज फ़ाइल चुनें।' : 'Please select an image file first.');
                    }
                  }}
                  className="w-full mt-3 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs flex items-center justify-center gap-2 shadow-md"
                >
                  <Download className="w-4 h-4" />
                  <span>{lang === 'hi' ? 'रिसाइज़ एवं डाउनलोड करें' : 'Resize & Download File'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
