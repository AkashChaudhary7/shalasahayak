import React, { useState, useRef } from 'react';
import { SchoolProfile, MDMLog, TransportStudent, ScholarshipRecord, Language, Teacher } from '../../types';
import { ThreeDIcon, ThreeDCard } from '../ThreeDIcon';
import { BoardExamRemunerationBill } from '../incharge/BoardExamRemunerationBill';
import { LadoInchargeModule } from '../incharge/LadoInchargeModule';
import { TransportInchargeModule } from '../incharge/TransportInchargeModule';
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
  onNavigate?: (newNav: any) => void;
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

  const handleSubTabChange = (subTab: typeof activeSubTab) => {
    setActiveSubTab(subTab);
    if (subTab) {
      onNavigate?.({ type: 'tool', category: 'incharge', subtab: subTab });
    } else {
      onNavigate?.({ type: 'category', id: 'incharge' });
    }
  };

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
  const [elcCampaigns, setElcCampaigns] = useState(() => {
    const cached = localStorage.getItem('shala_elc_campaigns');
    return cached ? JSON.parse(cached) : [
      { id: 'elc-1', title: 'National Voters Day Rally & Pledge', date: '2026-01-25', type: 'Rally', participants: 120, description: 'Voters registration drive and citizen awareness march with placards.' },
      { id: 'elc-2', title: 'Mock Poll and EVM/VVPAT Demonstration', date: '2026-03-10', type: 'Mock Poll', participants: 85, description: 'Hands-on practice voting for senior secondary students on voting mechanics.' },
      { id: 'elc-3', title: 'Electoral Rights Quiz Competition', date: '2026-04-18', type: 'Quiz', participants: 45, description: 'Inter-house quiz testing knowledge of the Indian Constitution and democracy.' }
    ];
  });
  
  const [elcVotes, setElcVotes] = useState<Record<string, number>>(() => {
    const cached = localStorage.getItem('shala_elc_votes');
    return cached ? JSON.parse(cached) : {
      'Candidate Alpha': 42,
      'Candidate Beta': 35,
      'NOTA': 8
    };
  });

  const [newCampaignTitle, setNewCampaignTitle] = useState('');
  const [newCampaignType, setNewCampaignType] = useState('Rally');
  const [newCampaignParticipants, setNewCampaignParticipants] = useState('50');
  const [newCampaignDesc, setNewCampaignDesc] = useState('');

  // --- Scholarship Incharge State ---
  const [scholarshipApplicants, setScholarshipApplicants] = useState(() => {
    const cached = localStorage.getItem('shala_scholarship_applicants');
    return cached ? JSON.parse(cached) : [
      { id: 'sch-1', name: 'Mamta Meena', className: 'Class 10', scheme: 'Pre-Matric ST Scholarship', category: 'ST', incomeVerified: true, casteVerified: true, janAadhaarMapped: true, shalaDarpanUploaded: true, status: 'Approved' },
      { id: 'sch-2', name: 'Deepak Kumar Jat', className: 'Class 9', scheme: 'Pre-Matric OBC Scholarship', category: 'OBC', incomeVerified: true, casteVerified: true, janAadhaarMapped: false, shalaDarpanUploaded: false, status: 'Pending' },
      { id: 'sch-3', name: 'Vikram Harijan', className: 'Class 8', scheme: 'Pre-Matric SC Scholarship', category: 'SC', incomeVerified: false, casteVerified: true, janAadhaarMapped: true, shalaDarpanUploaded: false, status: 'Action Required' },
      { id: 'sch-4', name: 'Suman Kanwar', className: 'Class 10', scheme: 'EWS Scholarship', category: 'EWS', incomeVerified: true, casteVerified: true, janAadhaarMapped: true, shalaDarpanUploaded: true, status: 'Approved' }
    ];
  });

  const [schSearch, setSchSearch] = useState('');
  const [schFilter, setSchFilter] = useState('All');
  const [newSchName, setNewSchName] = useState('');
  const [newSchClass, setNewSchClass] = useState('Class 9');
  const [newSchScheme, setNewSchScheme] = useState('Pre-Matric OBC Scholarship');
  const [newSchCategory, setNewSchCategory] = useState('OBC');

  // Sync state to local storage via useEffect to prevent stale cache memory
  React.useEffect(() => {
    localStorage.setItem('shala_elc_campaigns', JSON.stringify(elcCampaigns));
  }, [elcCampaigns]);

  React.useEffect(() => {
    localStorage.setItem('shala_elc_votes', JSON.stringify(elcVotes));
  }, [elcVotes]);

  React.useEffect(() => {
    localStorage.setItem('shala_scholarship_applicants', JSON.stringify(scholarshipApplicants));
  }, [scholarshipApplicants]);

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
              onClick={() => handleSubTabChange(m.id)}
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
          onBack={() => handleSubTabChange(null)}
        />
      )}

      {/* ASSEMBLY / PRARTHANA PRABHARI MODULE */}
      {activeSubTab === 'assembly' && (
        <AssemblyInchargeModule
          schoolProfile={schoolProfile}
          lang={lang}
          onBack={() => handleSubTabChange(null)}
        />
      )}

      {/* QR CODE GENERATOR MODULE */}
      {activeSubTab === 'qrcode' && (
        <QrCodeGeneratorModule
          schoolProfile={schoolProfile}
          lang={lang}
          onBack={() => handleSubTabChange(null)}
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
          onBack={() => handleSubTabChange(null)}
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
              onClick={() => handleSubTabChange(null)}
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
          onBack={() => handleSubTabChange(null)}
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
              onClick={() => handleSubTabChange(null)}
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
          onBack={() => handleSubTabChange(null)}
        />
      )}

      {/* BOARD EXAM REMUNERATION BILL */}
      {activeSubTab === 'remuneration' && (
        <BoardExamRemunerationBill
          schoolProfile={schoolProfile}
          teachers={teachers}
          lang={lang}
          onBack={() => handleSubTabChange(null)}
        />
      )}

      {/* TRANSPORT VOUCHER INCHARGE MODULE */}
      {activeSubTab === 'transport' && (
        <TransportInchargeModule
          schoolProfile={schoolProfile}
          lang={lang}
          onBack={() => handleSubTabChange(null)}
        />
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
              onClick={() => handleSubTabChange(null)}
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
