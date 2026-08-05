import React, { useState, useEffect } from 'react';
import { SchoolProfile, TransportStudent, Language } from '../../types';
import { storage } from '../../utils/storage';
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
  FileText
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

  const [students, setStudents] = useState<TransportStudent[]>(() => {
    const saved = localStorage.getItem('shala_transport_students');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: 'ts-1',
        srNo: '1408',
        studentName: 'Ramesh Kumar Gurjar',
        className: 'Class 8-A',
        distanceCategory: '2-5 km',
        modeOfTransport: 'Auto/Bus',
        monthlySubsidyAmount: 400,
        bankAccountStatus: 'Verified'
      },
      {
        id: 'ts-2',
        srNo: '1415',
        studentName: 'Pooja Verma',
        className: 'Class 6-B',
        distanceCategory: '2-5 km',
        modeOfTransport: 'Bicycle',
        monthlySubsidyAmount: 300,
        bankAccountStatus: 'Verified'
      },
      {
        id: 'ts-3',
        srNo: '1422',
        studentName: 'Kavita Meena',
        className: 'Class 10-A',
        distanceCategory: '5+ km',
        modeOfTransport: 'Auto/Bus',
        monthlySubsidyAmount: 400,
        bankAccountStatus: 'Verified'
      },
      {
        id: 'ts-4',
        srNo: '1430',
        studentName: 'Devendra Singh Bhati',
        className: 'Class 5-A',
        distanceCategory: '2-5 km',
        modeOfTransport: 'Walk',
        monthlySubsidyAmount: 400,
        bankAccountStatus: 'Pending'
      }
    ];
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [filterClass, setFilterClass] = useState('All');

  // New Student Form State
  const [newSrNo, setNewSrNo] = useState('');
  const [newName, setNewName] = useState('');
  const [newClass, setNewClass] = useState('Class 8');
  const [newDistance, setNewDistance] = useState<'0-2 km' | '2-5 km' | '5+ km'>('2-5 km');
  const [newTransportMode, setNewTransportMode] = useState<'Walk' | 'Bicycle' | 'Auto/Bus'>('Auto/Bus');
  const [newBankStatus, setNewBankStatus] = useState<'Verified' | 'Pending'>('Verified');

  useEffect(() => {
    localStorage.setItem('shala_transport_students', JSON.stringify(students));
  }, [students]);

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const claimAmount = newDistance === '0-2 km' ? 200 : 400;

    const newStudent: TransportStudent = {
      id: `ts-${Date.now()}`,
      srNo: newSrNo || `${Math.floor(Math.random() * 900 + 1000)}`,
      studentName: newName,
      className: newClass,
      distanceCategory: newDistance,
      modeOfTransport: newTransportMode,
      monthlySubsidyAmount: claimAmount,
      bankAccountStatus: newBankStatus
    };

    setStudents(prev => [...prev, newStudent]);
    setNewName('');
    setNewSrNo('');
  };

  const handleDeleteStudent = (id: string) => {
    if (confirm(isHi ? 'क्या आप इस छात्र को परिवहन सूची से हटाना चाहते हैं?' : 'Remove this student from transport list?')) {
      setStudents(prev => prev.filter(s => s.id !== id));
    }
  };

  const filteredStudents = students.filter(s => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = s.studentName.toLowerCase().includes(q) || s.srNo.includes(q);
    const matchesClass = filterClass === 'All' || s.className.includes(filterClass);
    return matchesSearch && matchesClass;
  });

  const totalMonthlyClaim = filteredStudents.reduce((sum, s) => sum + s.monthlySubsidyAmount, 0);
  const verifiedCount = filteredStudents.filter(s => s.bankAccountStatus === 'Verified').length;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 shadow-lg border border-slate-200 dark:border-slate-800 space-y-5 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 gap-3">
        <div>
          <h3 className="font-extrabold text-base sm:text-lg text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Bus className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{isHi ? 'परिवहन भत्ता / ट्रांसपोर्ट वाउचर प्रभारी पोर्टल' : 'Transport Voucher Incharge Portal'}</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {isHi
              ? 'ग्रामीण एवं दूरस्थ क्षेत्रों से आने वाले छात्र-छात्राओं का दूरी सत्यापन एवं परिवहन भत्ता बिल जनरेटर'
              : 'Rural distance verification & transport voucher claim generator (>1km primary / >2km upper primary)'}
          </p>
        </div>
        {onBack && (
          <button
            onClick={onBack}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all flex items-center gap-1 shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{isHi ? 'पीछे जाएँ' : 'Back'}</span>
          </button>
        )}
      </div>

      {/* Policy Notice Box */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/60 flex items-start gap-3 text-xs text-emerald-900 dark:text-emerald-200">
        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-bold text-sm">{isHi ? 'राजस्थान स्कूल परिवहन भत्ता नीति 2026-27' : 'Rajasthan School Transport Allowance Policy 2026-27'}</div>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            {isHi
              ? 'प्राथमिक कक्षाओं (1-5) हेतु 1 किमी तथा उच्च प्राथमिक/माध्यमिक (6-12) हेतु 2 किमी से अधिक दूरी पर स्थित गाँव/ढाणी से आने वाले छात्रों को अधिकतम ₹ 400/माह परिवहन भत्ता डीबीटी के माध्यम से देय है।'
              : 'Students residing >1 km (Primary 1-5) or >2 km (Upper Primary/Sec 6-12) from school are eligible for up to ₹400/month transport voucher reimbursement via DBT.'}
          </p>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 text-center">
          <span className="block text-[10px] text-slate-500 uppercase tracking-wider font-bold">{isHi ? 'कुल लाभार्थी छात्र' : 'Total Beneficiaries'}</span>
          <span className="text-lg font-black text-slate-800 dark:text-slate-100">{students.length}</span>
        </div>
        <div className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/40 text-center">
          <span className="block text-[10px] text-emerald-700 dark:text-emerald-400 uppercase tracking-wider font-bold">{isHi ? 'मासिक दावा राशि' : 'Monthly Claim'}</span>
          <span className="text-lg font-black text-emerald-700 dark:text-emerald-300">₹ {totalMonthlyClaim.toLocaleString('en-IN')}</span>
        </div>
        <div className="p-3 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 text-center">
          <span className="block text-[10px] text-amber-700 dark:text-amber-400 uppercase tracking-wider font-bold">{isHi ? 'बैंक डीबीटी सत्यापित' : 'DBT Verified'}</span>
          <span className="text-lg font-black text-amber-700 dark:text-amber-300">{verifiedCount} / {students.length}</span>
        </div>
        <div className="p-3 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-900/40 text-center">
          <span className="block text-[10px] text-blue-700 dark:text-blue-400 uppercase tracking-wider font-bold">{isHi ? 'औसत दूरी' : 'Avg Distance'}</span>
          <span className="text-lg font-black text-blue-700 dark:text-blue-300">3.8 KM</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Add Student Form */}
        <form onSubmit={handleAddStudent} className="lg:col-span-4 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 text-xs">
          <div className="font-bold text-xs text-slate-800 dark:text-slate-100 flex items-center gap-1.5 pb-1 border-b border-slate-200 dark:border-slate-700">
            <Plus className="w-4 h-4 text-emerald-600" />
            <span>{isHi ? 'नया परिवहन लाभार्थी छात्र जोड़ें' : 'Add Transport Beneficiary'}</span>
          </div>

          <div className="space-y-2">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-0.5">{isHi ? 'एसआर नंबर (SR No.)' : 'SR Number'}</label>
              <input
                type="text"
                placeholder="e.g. 1408"
                value={newSrNo}
                onChange={e => setNewSrNo(e.target.value)}
                className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-0.5">{isHi ? 'छात्र / छात्रा का नाम' : 'Student Name'}</label>
              <input
                type="text"
                required
                placeholder="Full Name"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-0.5">{isHi ? 'कक्षा' : 'Class'}</label>
                <select
                  value={newClass}
                  onChange={e => setNewClass(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                >
                  <option value="Class 1">Class 1</option>
                  <option value="Class 2">Class 2</option>
                  <option value="Class 3">Class 3</option>
                  <option value="Class 4">Class 4</option>
                  <option value="Class 5">Class 5</option>
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
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-0.5">{isHi ? 'दूरी श्रेणी' : 'Distance'}</label>
                <select
                  value={newDistance}
                  onChange={e => setNewDistance(e.target.value as any)}
                  className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                >
                  <option value="0-2 km">0 - 2 KM (₹200)</option>
                  <option value="2-5 km">2 - 5 KM (₹400)</option>
                  <option value="5+ km">5+ KM (₹400)</option>
                </select>
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
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-0.5">{isHi ? 'बैंक डीबीटी' : 'Bank Status'}</label>
                <select
                  value={newBankStatus}
                  onChange={e => setNewBankStatus(e.target.value as any)}
                  className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                >
                  <option value="Verified">Verified</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            {isHi ? 'छात्र दर्ज करें' : 'Add Student Record'}
          </button>
        </form>

        {/* Student Roster Table & Search */}
        <div className="lg:col-span-8 space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={isHi ? 'छात्र का नाम या SR नो खोजें...' : 'Search student or SR No...'}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
              />
            </div>

            <select
              value={filterClass}
              onChange={e => setFilterClass(e.target.value)}
              className="p-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shrink-0"
            >
              <option value="All">All Classes</option>
              <option value="Class 1">Class 1-5</option>
              <option value="Class 6">Class 6-8</option>
              <option value="Class 9">Class 9-10</option>
              <option value="Class 11">Class 11-12</option>
            </select>

            <button
              onClick={() => window.print()}
              className="px-3 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs flex items-center justify-center gap-1 shadow-sm shrink-0 active:scale-95 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{isHi ? 'प्रिंट क्लेम' : 'Print Claim'}</span>
            </button>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 max-h-[380px] overflow-y-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="sticky top-0 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-extrabold border-b border-slate-200 dark:border-slate-700 z-10">
                <tr>
                  <th className="p-2.5">SR#</th>
                  <th className="p-2.5">{isHi ? 'छात्र नाम' : 'Student Name'}</th>
                  <th className="p-2.5">{isHi ? 'कक्षा' : 'Class'}</th>
                  <th className="p-2.5">{isHi ? 'दूरी' : 'Distance'}</th>
                  <th className="p-2.5">{isHi ? 'साधन' : 'Transport'}</th>
                  <th className="p-2.5">{isHi ? 'मासिक दावा' : 'Monthly Claim'}</th>
                  <th className="p-2.5">{isHi ? 'डीबीटी' : 'DBT Status'}</th>
                  <th className="p-2.5 text-right">{isHi ? 'कार्रवाई' : 'Action'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="p-2.5 font-mono text-[11px] font-bold text-slate-500">{s.srNo}</td>
                      <td className="p-2.5 font-bold text-slate-900 dark:text-slate-100">{s.studentName}</td>
                      <td className="p-2.5">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-[10px]">
                          {s.className}
                        </span>
                      </td>
                      <td className="p-2.5 font-mono font-bold text-emerald-600 dark:text-emerald-400">{s.distanceCategory}</td>
                      <td className="p-2.5">{s.modeOfTransport}</td>
                      <td className="p-2.5 font-mono font-bold text-amber-600 dark:text-amber-400">₹ {s.monthlySubsidyAmount}</td>
                      <td className="p-2.5">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold ${
                          s.bankAccountStatus === 'Verified'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        }`}>
                          {s.bankAccountStatus}
                        </span>
                      </td>
                      <td className="p-2.5 text-right">
                        <button
                          onClick={() => handleDeleteStudent(s.id)}
                          className="p-1 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                          title="हटाएं"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="p-6 text-center text-slate-500">
                      {isHi ? 'कोई रिकॉर्ड नहीं मिला' : 'No records found'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
