import React, { useState } from 'react';
import { SchoolProfile, AparIprRecord, AadhaarPramanikaranRecord, ApaarIdRecord, Language } from '../../types';
import {
  generateConsolidatedAparPdf,
  generateAadhaarPramanikaranPdf,
  generateApaarPramanikaranPdf
} from '../../utils/pdfGenerator';
import {
  ShieldCheck,
  FileCheck,
  Fingerprint,
  UserCheck,
  Search,
  Filter,
  Download,
  Printer,
  Plus,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Building2,
  RefreshCw,
  FileSpreadsheet
} from 'lucide-react';

interface PramanikaranReportsEngineProps {
  schoolProfile: SchoolProfile;
  aparRecords: AparIprRecord[];
  aadhaarRecords: AadhaarPramanikaranRecord[];
  apaarRecords: ApaarIdRecord[];
  onUpdateAparRecords: (data: AparIprRecord[]) => void;
  onUpdateAadhaarRecords: (data: AadhaarPramanikaranRecord[]) => void;
  onUpdateApaarRecords: (data: ApaarIdRecord[]) => void;
  lang: Language;
}

export const PramanikaranReportsEngine: React.FC<PramanikaranReportsEngineProps> = ({
  schoolProfile,
  aparRecords,
  aadhaarRecords,
  apaarRecords,
  onUpdateAparRecords,
  onUpdateAadhaarRecords,
  onUpdateApaarRecords,
  lang
}) => {
  const [activeReport, setActiveReport] = useState<'aadhaar' | 'apar' | 'apaar'>('aadhaar');

  // Shared Filter States
  const [selectedSchool, setSelectedSchool] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Feeder schools list
  const feederSchools = [
    'ALL',
    schoolProfile.schoolName,
    'Govt. Upper Primary School, Nimaj Road',
    'Govt. Girls Upper Primary School, Jaitaran',
    'Govt. Primary School, Karni Nagar'
  ];

  // ==========================================
  // 1. AADHAAR & JAN AADHAAR LOGIC & FILTERS
  // ==========================================
  const filteredAadhaarRecords = aadhaarRecords.filter(r => {
    const matchSchool = selectedSchool === 'ALL' || r.schoolName === selectedSchool;
    const matchStatus =
      selectedStatus === 'ALL' ||
      r.aadhaarStatus === selectedStatus ||
      r.janAadhaarStatus === selectedStatus;
    const matchSearch =
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.srNoOrEmpId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.classNameOrDesignation.toLowerCase().includes(searchQuery.toLowerCase());
    return matchSchool && matchStatus && matchSearch;
  });

  const aadhaarVerifiedCount = aadhaarRecords.filter(r => r.aadhaarStatus === 'Verified').length;
  const janAadhaarVerifiedCount = aadhaarRecords.filter(r => r.janAadhaarStatus === 'Verified').length;
  const aadhaarMismatchCount = aadhaarRecords.filter(
    r => r.aadhaarStatus === 'Mismatch' || r.janAadhaarStatus === 'Mismatch'
  ).length;

  const handleUpdateAadhaarStatus = (id: string, field: 'aadhaarStatus' | 'janAadhaarStatus', newStatus: any) => {
    const updated = aadhaarRecords.map(r => (r.id === id ? { ...r, [field]: newStatus } : r));
    onUpdateAadhaarRecords(updated);
  };

  // ==========================================
  // 2. APAR & IPR LOGIC & FILTERS
  // ==========================================
  const filteredAparRecords = aparRecords.filter(r => {
    const matchSchool = selectedSchool === 'ALL' || r.schoolName === selectedSchool;
    const matchStatus =
      selectedStatus === 'ALL' ||
      r.aparStatus === selectedStatus ||
      r.iprStatus === selectedStatus;
    const matchSearch =
      r.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.designation.toLowerCase().includes(searchQuery.toLowerCase());
    return matchSchool && matchStatus && matchSearch;
  });

  const aparAcceptedCount = aparRecords.filter(r => r.aparStatus === 'Accepted').length;
  const aparSubmittedCount = aparRecords.filter(r => r.aparStatus === 'Submitted').length;
  const aparPendingCount = aparRecords.filter(r => r.aparStatus === 'Pending').length;
  const iprFiledCount = aparRecords.filter(r => r.iprStatus === 'Filed').length;

  const handleUpdateAparStatus = (id: string, field: 'aparStatus' | 'iprStatus', newStatus: any) => {
    const updated = aparRecords.map(r => (r.id === id ? { ...r, [field]: newStatus } : r));
    onUpdateAparRecords(updated);
  };

  // ==========================================
  // 3. APAAR ID LOGIC & FILTERS
  // ==========================================
  const filteredApaarRecords = apaarRecords.filter(r => {
    const matchSchool = selectedSchool === 'ALL' || r.schoolName === selectedSchool;
    const matchStatus =
      selectedStatus === 'ALL' ||
      r.apaarStatus === selectedStatus ||
      r.parentConsentStatus === selectedStatus;
    const matchSearch =
      r.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.srNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.className.toLowerCase().includes(searchQuery.toLowerCase());
    return matchSchool && matchStatus && matchSearch;
  });

  const apaarGeneratedCount = apaarRecords.filter(r => r.apaarStatus === 'APAAR Generated').length;
  const consentReceivedCount = apaarRecords.filter(r => r.parentConsentStatus === 'Consent Received').length;
  const apaarDiscrepancyCount = apaarRecords.filter(r => r.apaarStatus === 'Error / Discrepancy').length;

  const handleUpdateApaarStatus = (id: string, field: 'apaarStatus' | 'parentConsentStatus', newStatus: any) => {
    const updated = apaarRecords.map(r => (r.id === id ? { ...r, [field]: newStatus } : r));
    onUpdateApaarRecords(updated);
  };

  // Export CSV Helper
  const handleExportCsv = (filename: string, headers: string[], rows: (string | undefined)[][]) => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map(e => e.map(val => `"${val || ''}"`).join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 shadow-lg border border-slate-200 dark:border-slate-800 space-y-5">
      
      {/* Top Header & Report Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
              Verification & Analytics Reports Engine
            </span>
            <span className="text-[11px] font-semibold text-slate-500">
              प्रमाणीकरण पोर्टल
            </span>
          </div>
          <h3 className="font-black text-base sm:text-lg text-slate-900 dark:text-slate-100 flex items-center gap-2 mt-0.5">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span>{lang === 'hi' ? 'प्रमाणीकरण एवं सत्यापन रिपोर्ट हब (Pramanikaran Reports)' : 'Verification & Analytics Reports Engine'}</span>
          </h3>
        </div>

        {/* Report Sub-Tabs */}
        <div className="flex rounded-2xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700 overflow-x-auto">
          <button
            onClick={() => { setActiveReport('aadhaar'); setSelectedStatus('ALL'); }}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center space-x-1.5 transition-all whitespace-nowrap ${
              activeReport === 'aadhaar'
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            <Fingerprint className="w-3.5 h-3.5" />
            <span>{lang === 'hi' ? '1. आधार / जनाधार सत्यापन' : '1. Aadhaar & Jan Aadhaar'}</span>
          </button>

          <button
            onClick={() => { setActiveReport('apar'); setSelectedStatus('ALL'); }}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center space-x-1.5 transition-all whitespace-nowrap ${
              activeReport === 'apar'
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>{lang === 'hi' ? '2. APAR / IPR रिपोर्ट' : '2. APAR / IPR Compliance'}</span>
          </button>

          <button
            onClick={() => { setActiveReport('apaar'); setSelectedStatus('ALL'); }}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center space-x-1.5 transition-all whitespace-nowrap ${
              activeReport === 'apaar'
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>{lang === 'hi' ? '3. APAAR ID (One Nation One Student)' : '3. APAAR ID Registry'}</span>
          </button>
        </div>
      </div>

      {/* Shared Filter Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs">
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Filter by Feeder School (विद्यालय)
          </label>
          <select
            value={selectedSchool}
            onChange={e => setSelectedSchool(e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-slate-800 dark:text-slate-200"
          >
            {feederSchools.map(sch => (
              <option key={sch} value={sch}>{sch}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Filter by Verification Status
          </label>
          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-slate-800 dark:text-slate-200"
          >
            <option value="ALL">All Statuses</option>
            <option value="Verified">Verified / Accepted / Generated</option>
            <option value="Pending">Pending / Submitted</option>
            <option value="Mismatch">Mismatch / Error / Discrepancy</option>
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Search Name / ID / Class
          </label>
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search record..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold"
            />
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* SUB-REPORT 1: AADHAAR & JAN AADHAAR      */}
      {/* ========================================== */}
      {activeReport === 'aadhaar' && (
        <div className="space-y-4">
          
          {/* Summary Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200/60 dark:border-indigo-800/40">
              <span className="text-[10px] font-extrabold uppercase text-indigo-700 dark:text-indigo-300">Total Tracked</span>
              <div className="text-xl font-black text-indigo-900 dark:text-indigo-100 mt-0.5">{aadhaarRecords.length}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Feeder school students & staff</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/40">
              <span className="text-[10px] font-extrabold uppercase text-emerald-700 dark:text-emerald-300">Aadhaar Verified</span>
              <div className="text-xl font-black text-emerald-900 dark:text-emerald-100 mt-0.5">{aadhaarVerifiedCount}</div>
              <div className="text-[10px] text-emerald-600 font-bold mt-0.5">
                {Math.round((aadhaarVerifiedCount / (aadhaarRecords.length || 1)) * 100)}% Authenticated
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-sky-50/70 dark:bg-sky-950/30 border border-sky-200/60 dark:border-sky-800/40">
              <span className="text-[10px] font-extrabold uppercase text-sky-700 dark:text-sky-300">Jan Aadhaar Verified</span>
              <div className="text-xl font-black text-sky-900 dark:text-sky-100 mt-0.5">{janAadhaarVerifiedCount}</div>
              <div className="text-[10px] text-sky-600 font-bold mt-0.5">Direct DBT linked</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-800/40">
              <span className="text-[10px] font-extrabold uppercase text-amber-700 dark:text-amber-300">Pending / Mismatch</span>
              <div className="text-xl font-black text-amber-900 dark:text-amber-100 mt-0.5">{aadhaarMismatchCount}</div>
              <div className="text-[10px] text-amber-600 font-bold mt-0.5">Requires Shala Darpan correction</div>
            </div>
          </div>

          {/* Privacy Disclaimer Banner */}
          <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              <strong>Data Privacy Compliant:</strong> All national identification numbers are strictly masked (`XXXX-XXXX-1234`) in accordance with UIDAI and Rajasthan IT Security guidelines. Only authentication statuses are displayed.
            </span>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="p-3 text-center w-8">#</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">SR / Emp ID</th>
                  <th className="p-3">Name & Guardian</th>
                  <th className="p-3">Class / Designation</th>
                  <th className="p-3">School Name</th>
                  <th className="p-3 text-center">Aadhaar Status</th>
                  <th className="p-3 text-center">Jan Aadhaar</th>
                  <th className="p-3 text-center">Masked ID</th>
                  <th className="p-3">Mismatch Details / Follow-up</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200 font-medium">
                {filteredAadhaarRecords.map((r, i) => (
                  <tr key={r.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                    <td className="p-3 text-center font-bold text-slate-400">{i + 1}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        r.personType === 'Student'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                          : 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                      }`}>
                        {r.personType}
                      </span>
                    </td>
                    <td className="p-3 font-mono font-bold text-slate-900 dark:text-slate-100">{r.srNoOrEmpId}</td>
                    <td className="p-3">
                      <div className="font-bold">{r.name}</div>
                      {r.fatherOrGuardianName && (
                        <div className="text-[10px] text-slate-500">S/o, D/o {r.fatherOrGuardianName}</div>
                      )}
                    </td>
                    <td className="p-3">{r.classNameOrDesignation}</td>
                    <td className="p-3 text-slate-600 dark:text-slate-400">{r.schoolName}</td>

                    {/* Aadhaar Status Toggle */}
                    <td className="p-3 text-center">
                      <select
                        value={r.aadhaarStatus}
                        onChange={e => handleUpdateAadhaarStatus(r.id, 'aadhaarStatus', e.target.value)}
                        className={`px-2 py-1 rounded-xl text-[11px] font-bold border ${
                          r.aadhaarStatus === 'Verified'
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300'
                            : r.aadhaarStatus === 'Mismatch'
                            ? 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950 dark:text-rose-300'
                            : 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300'
                        }`}
                      >
                        <option value="Verified">Verified</option>
                        <option value="Pending">Pending</option>
                        <option value="Mismatch">Mismatch</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </td>

                    {/* Jan Aadhaar Status Toggle */}
                    <td className="p-3 text-center">
                      <select
                        value={r.janAadhaarStatus}
                        onChange={e => handleUpdateAadhaarStatus(r.id, 'janAadhaarStatus', e.target.value)}
                        className={`px-2 py-1 rounded-xl text-[11px] font-bold border ${
                          r.janAadhaarStatus === 'Verified'
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300'
                            : r.janAadhaarStatus === 'Mismatch'
                            ? 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950 dark:text-rose-300'
                            : 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300'
                        }`}
                      >
                        <option value="Verified">Verified</option>
                        <option value="Pending">Pending</option>
                        <option value="Mismatch">Mismatch</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </td>

                    <td className="p-3 text-center font-mono font-semibold text-slate-500">{r.maskedAadhaar}</td>
                    <td className="p-3 text-slate-600 dark:text-slate-400 text-[11px]">
                      {r.mismatchDetail || <span className="text-emerald-600 font-bold">✓ Record Matched</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Export Actions */}
          <div className="flex justify-end space-x-2 pt-2">
            <button
              onClick={() =>
                handleExportCsv(
                  'Aadhaar_Pramanikaran_Report',
                  ['SR/Emp ID', 'Name', 'Class/Desig', 'School', 'Aadhaar Status', 'Jan Aadhaar Status', 'Masked ID', 'Mismatch'],
                  filteredAadhaarRecords.map(r => [r.srNoOrEmpId, r.name, r.classNameOrDesignation, r.schoolName, r.aadhaarStatus, r.janAadhaarStatus, r.maskedAadhaar, r.mismatchDetail])
                )
              }
              className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center space-x-1.5 border border-slate-300 dark:border-slate-700"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={() => generateAadhaarPramanikaranPdf(schoolProfile, filteredAadhaarRecords)}
              className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs flex items-center space-x-2 shadow-sm"
            >
              <Download className="w-4 h-4 text-amber-300" />
              <span>Download Aadhaar Report PDF</span>
            </button>
          </div>

        </div>
      )}

      {/* ========================================== */}
      {/* SUB-REPORT 2: APAR & IPR TRACKER          */}
      {/* ========================================== */}
      {activeReport === 'apar' && (
        <div className="space-y-4">
          
          {/* Summary Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200/60 dark:border-indigo-800/40">
              <span className="text-[10px] font-extrabold uppercase text-indigo-700 dark:text-indigo-300">Total DDO Staff</span>
              <div className="text-xl font-black text-indigo-900 dark:text-indigo-100 mt-0.5">{aparRecords.length}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">DDO Code: {schoolProfile.ddoCode}</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/40">
              <span className="text-[10px] font-extrabold uppercase text-emerald-700 dark:text-emerald-300">APAR Accepted</span>
              <div className="text-xl font-black text-emerald-900 dark:text-emerald-100 mt-0.5">{aparAcceptedCount}</div>
              <div className="text-[10px] text-emerald-600 font-bold mt-0.5">Evaluated & Approved</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-sky-50/70 dark:bg-sky-950/30 border border-sky-200/60 dark:border-sky-800/40">
              <span className="text-[10px] font-extrabold uppercase text-sky-700 dark:text-sky-300">APAR Submitted</span>
              <div className="text-xl font-black text-sky-900 dark:text-sky-100 mt-0.5">{aparSubmittedCount}</div>
              <div className="text-[10px] text-sky-600 font-bold mt-0.5">Pending Reporting Officer</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-200/60 dark:border-purple-800/40">
              <span className="text-[10px] font-extrabold uppercase text-purple-700 dark:text-purple-300">IPR Filed Rate</span>
              <div className="text-xl font-black text-purple-900 dark:text-purple-100 mt-0.5">{iprFiledCount}/{aparRecords.length}</div>
              <div className="text-[10px] text-purple-600 font-bold mt-0.5">RajKaj Portal Compliance</div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="p-3 text-center w-8">#</th>
                  <th className="p-3">Employee ID</th>
                  <th className="p-3">Staff Name & Designation</th>
                  <th className="p-3">School Name</th>
                  <th className="p-3 text-center">APAR Status (वार्षिक मूल्यांकन)</th>
                  <th className="p-3 text-center">IPR Status (अचल संपत्ति)</th>
                  <th className="p-3 text-center">Fin. Year</th>
                  <th className="p-3">Submission / Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200 font-medium">
                {filteredAparRecords.map((r, i) => (
                  <tr key={r.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                    <td className="p-3 text-center font-bold text-slate-400">{i + 1}</td>
                    <td className="p-3 font-mono font-bold text-indigo-700 dark:text-indigo-400">{r.employeeId}</td>
                    <td className="p-3">
                      <div className="font-bold text-slate-900 dark:text-slate-100">{r.employeeName}</div>
                      <div className="text-[10px] text-slate-500">{r.designation}</div>
                    </td>
                    <td className="p-3 text-slate-600 dark:text-slate-400">{r.schoolName}</td>

                    {/* APAR Status Select */}
                    <td className="p-3 text-center">
                      <select
                        value={r.aparStatus}
                        onChange={e => handleUpdateAparStatus(r.id, 'aparStatus', e.target.value)}
                        className={`px-2 py-1 rounded-xl text-[11px] font-bold border ${
                          r.aparStatus === 'Accepted'
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300'
                            : r.aparStatus === 'Submitted'
                            ? 'bg-sky-100 text-sky-800 border-sky-300 dark:bg-sky-950 dark:text-sky-300'
                            : r.aparStatus === 'Objection'
                            ? 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950 dark:text-rose-300'
                            : 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300'
                        }`}
                      >
                        <option value="Accepted">Accepted</option>
                        <option value="Submitted">Submitted</option>
                        <option value="Pending">Pending</option>
                        <option value="Objection">Objection</option>
                      </select>
                    </td>

                    {/* IPR Status Select */}
                    <td className="p-3 text-center">
                      <select
                        value={r.iprStatus}
                        onChange={e => handleUpdateAparStatus(r.id, 'iprStatus', e.target.value)}
                        className={`px-2 py-1 rounded-xl text-[11px] font-bold border ${
                          r.iprStatus === 'Filed'
                            ? 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-950 dark:text-purple-300'
                            : r.iprStatus === 'Exempted'
                            ? 'bg-slate-100 text-slate-800 border-slate-300 dark:bg-slate-800 dark:text-slate-300'
                            : 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950 dark:text-rose-300'
                        }`}
                      >
                        <option value="Filed">Filed</option>
                        <option value="Exempted">Exempted</option>
                        <option value="Overdue">Overdue</option>
                      </select>
                    </td>

                    <td className="p-3 text-center font-mono font-bold">{r.financialYear}</td>
                    <td className="p-3 text-slate-600 dark:text-slate-400 text-[11px]">
                      {r.remarks || r.submissionDate || 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Export Actions */}
          <div className="flex justify-end space-x-2 pt-2">
            <button
              onClick={() =>
                handleExportCsv(
                  'APAR_IPR_Compliance_Report',
                  ['Emp ID', 'Name', 'Designation', 'School', 'APAR Status', 'IPR Status', 'FY', 'Remarks'],
                  filteredAparRecords.map(r => [r.employeeId, r.employeeName, r.designation, r.schoolName, r.aparStatus, r.iprStatus, r.financialYear, r.remarks])
                )
              }
              className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center space-x-1.5 border border-slate-300 dark:border-slate-700"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={() => generateConsolidatedAparPdf(schoolProfile, filteredAparRecords)}
              className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs flex items-center space-x-2 shadow-sm"
            >
              <Download className="w-4 h-4 text-amber-300" />
              <span>Download Consolidated APAR PDF</span>
            </button>
          </div>

        </div>
      )}

      {/* ========================================== */}
      {/* SUB-REPORT 3: APAAR ID REGISTRY           */}
      {/* ========================================== */}
      {activeReport === 'apaar' && (
        <div className="space-y-4">
          
          {/* Summary Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200/60 dark:border-indigo-800/40">
              <span className="text-[10px] font-extrabold uppercase text-indigo-700 dark:text-indigo-300">Total Enrolled Students</span>
              <div className="text-xl font-black text-indigo-900 dark:text-indigo-100 mt-0.5">{apaarRecords.length}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">One Nation One Student ID</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/40">
              <span className="text-[10px] font-extrabold uppercase text-emerald-700 dark:text-emerald-300">Parent Consent Received</span>
              <div className="text-xl font-black text-emerald-900 dark:text-emerald-100 mt-0.5">{consentReceivedCount}</div>
              <div className="text-[10px] text-emerald-600 font-bold mt-0.5">
                {Math.round((consentReceivedCount / (apaarRecords.length || 1)) * 100)}% Consent Verified
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-sky-50/70 dark:bg-sky-950/30 border border-sky-200/60 dark:border-sky-800/40">
              <span className="text-[10px] font-extrabold uppercase text-sky-700 dark:text-sky-300">APAAR ID Generated</span>
              <div className="text-xl font-black text-sky-900 dark:text-sky-100 mt-0.5">{apaarGeneratedCount}</div>
              <div className="text-[10px] text-sky-600 font-bold mt-0.5">Automated Academic Registry</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200/60 dark:border-rose-800/40">
              <span className="text-[10px] font-extrabold uppercase text-rose-700 dark:text-rose-300">Discrepancies / Error</span>
              <div className="text-xl font-black text-rose-900 dark:text-rose-100 mt-0.5">{apaarDiscrepancyCount}</div>
              <div className="text-[10px] text-rose-600 font-bold mt-0.5">UDISE+ vs Aadhaar name mismatch</div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="p-3 text-center w-8">#</th>
                  <th className="p-3">SR No</th>
                  <th className="p-3">Student & Father Name</th>
                  <th className="p-3">Class</th>
                  <th className="p-3">School Name</th>
                  <th className="p-3 text-center">Parent Consent Status</th>
                  <th className="p-3 text-center">APAAR ID Status</th>
                  <th className="p-3">Discrepancy Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200 font-medium">
                {filteredApaarRecords.map((r, i) => (
                  <tr key={r.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                    <td className="p-3 text-center font-bold text-slate-400">{i + 1}</td>
                    <td className="p-3 font-mono font-bold">{r.srNo}</td>
                    <td className="p-3">
                      <div className="font-bold text-slate-900 dark:text-slate-100">{r.studentName}</div>
                      <div className="text-[10px] text-slate-500">S/o {r.fatherName}</div>
                    </td>
                    <td className="p-3 font-bold text-slate-700 dark:text-slate-300">{r.className}</td>
                    <td className="p-3 text-slate-600 dark:text-slate-400">{r.schoolName}</td>

                    {/* Consent Toggle */}
                    <td className="p-3 text-center">
                      <select
                        value={r.parentConsentStatus}
                        onChange={e => handleUpdateApaarStatus(r.id, 'parentConsentStatus', e.target.value)}
                        className={`px-2 py-1 rounded-xl text-[11px] font-bold border ${
                          r.parentConsentStatus === 'Consent Received'
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300'
                            : r.parentConsentStatus === 'Pending Consent'
                            ? 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950 dark:text-rose-300'
                        }`}
                      >
                        <option value="Consent Received">Consent Received</option>
                        <option value="Pending Consent">Pending Consent</option>
                        <option value="Refused">Refused</option>
                      </select>
                    </td>

                    {/* APAAR Status Toggle */}
                    <td className="p-3 text-center">
                      <select
                        value={r.apaarStatus}
                        onChange={e => handleUpdateApaarStatus(r.id, 'apaarStatus', e.target.value)}
                        className={`px-2 py-1 rounded-xl text-[11px] font-bold border ${
                          r.apaarStatus === 'APAAR Generated'
                            ? 'bg-sky-100 text-sky-800 border-sky-300 dark:bg-sky-950 dark:text-sky-300'
                            : r.apaarStatus === 'Pending Verification'
                            ? 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950 dark:text-rose-300'
                        }`}
                      >
                        <option value="APAAR Generated">APAAR Generated</option>
                        <option value="Pending Verification">Pending Verification</option>
                        <option value="Error / Discrepancy">Error / Discrepancy</option>
                      </select>
                    </td>

                    <td className="p-3 text-[11px]">
                      {r.discrepancyType && r.discrepancyType !== 'None' ? (
                        <span className="text-rose-600 dark:text-rose-400 font-bold flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                          <span>{r.discrepancyType}: {r.remarks || ''}</span>
                        </span>
                      ) : (
                        <span className="text-emerald-600 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                          <span>Ready for DigiLocker Sync</span>
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Export Actions */}
          <div className="flex justify-end space-x-2 pt-2">
            <button
              onClick={() =>
                handleExportCsv(
                  'APAAR_ID_Progress_Report',
                  ['SR No', 'Student Name', 'Class', 'School', 'Parent Consent', 'APAAR Status', 'Discrepancy'],
                  filteredApaarRecords.map(r => [r.srNo, r.studentName, r.className, r.schoolName, r.parentConsentStatus, r.apaarStatus, r.discrepancyType])
                )
              }
              className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center space-x-1.5 border border-slate-300 dark:border-slate-700"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={() => generateApaarPramanikaranPdf(schoolProfile, filteredApaarRecords)}
              className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs flex items-center space-x-2 shadow-sm"
            >
              <Download className="w-4 h-4 text-amber-300" />
              <span>Download APAAR Report PDF</span>
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
