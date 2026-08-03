import React, { useState } from 'react';
import { SchoolProfile, Teacher, Language } from '../../types';
import { generateBoardExamRemunerationBillPdf } from '../../utils/pdfGenerator';
import {
  FileText,
  Plus,
  Trash2,
  Download,
  IndianRupee,
  CheckCircle2,
  Building,
  UserCheck,
  ArrowLeft
} from 'lucide-react';

interface BoardExamRemunerationBillProps {
  schoolProfile: SchoolProfile;
  teachers: Teacher[];
  lang: Language;
  onBack?: () => void;
}

interface RemunerationStaff {
  id: string;
  role: string;
  staffName: string;
  sessionsCount: number;
  ratePerSession: number;
  bankAccount: string;
  ifsc: string;
}

export const BoardExamRemunerationBill: React.FC<BoardExamRemunerationBillProps> = ({
  schoolProfile,
  teachers,
  lang,
  onBack
}) => {
  const [examName, setExamName] = useState('RBSE Senior Secondary (Class 12) Examination 2026');
  const [centreCode, setCentreCode] = useState('21045');
  const [centreName, setCentreName] = useState(schoolProfile.schoolName);

  const [staffList, setStaffList] = useState<RemunerationStaff[]>([
    {
      id: 'cs-1',
      role: 'Center Superintendent (CS)',
      staffName: schoolProfile.principalName || 'Shri R.K. Sharma',
      sessionsCount: 12,
      ratePerSession: 250,
      bankAccount: '38192019201',
      ifsc: 'SBIN0001234'
    },
    {
      id: 'inv-1',
      role: 'Room Invigilator (वीक्षक)',
      staffName: teachers[0]?.name || 'Shri Vikram Singh',
      sessionsCount: 10,
      ratePerSession: 150,
      bankAccount: '50100293019',
      ifsc: 'HDFC0000123'
    },
    {
      id: 'inv-2',
      role: 'Room Invigilator (वीक्षक)',
      staffName: teachers[1]?.name || 'Smt. Sunita Verma',
      sessionsCount: 10,
      ratePerSession: 150,
      bankAccount: '62190100291',
      ifsc: 'BARB0JAIPUR'
    },
    {
      id: 'staff-1',
      role: 'Class IV Staff (Peon)',
      staffName: 'Shri Ramu Lal',
      sessionsCount: 12,
      ratePerSession: 80,
      bankAccount: '10920192012',
      ifsc: 'SBIN0001234'
    }
  ]);

  const handleUpdateStaff = (id: string, field: keyof RemunerationStaff, value: any) => {
    setStaffList(staffList.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const handleAddStaff = () => {
    const newS: RemunerationStaff = {
      id: `staff-${Date.now()}`,
      role: 'Room Invigilator (वीक्षक)',
      staffName: '',
      sessionsCount: 8,
      ratePerSession: 150,
      bankAccount: '',
      ifsc: ''
    };
    setStaffList([...staffList, newS]);
  };

  const handleRemoveStaff = (id: string) => {
    setStaffList(staffList.filter(s => s.id !== id));
  };

  const totalBillAmount = staffList.reduce((acc, s) => acc + (s.sessionsCount * s.ratePerSession), 0);

  const handleExportPdf = () => {
    generateBoardExamRemunerationBillPdf(
      schoolProfile,
      {
        examName,
        centreCode,
        centreName,
        totalSessions: Math.max(...staffList.map(s => s.sessionsCount), 0)
      },
      staffList
    );
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-md border border-slate-200 dark:border-slate-800 space-y-4">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          {onBack && (
            <button
              onClick={onBack}
              className="p-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 hover:text-emerald-700 dark:text-slate-400 dark:hover:text-emerald-400 border border-slate-200 dark:border-slate-800 transition-colors shrink-0"
              title={lang === 'hi' ? 'वापस' : 'Back'}
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div>
            <h3 className="font-bold text-base text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-600" />
              <span>{lang === 'hi' ? 'राजस्थान बोर्ड (RBSE) परीक्षा पारिश्रमिक बिल जनरेटर' : 'Board Exam Remuneration Bill Generator'}</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {lang === 'hi' ? 'वीक्षक, केन्द्राधीक्षक एवं चतुर्थ श्रेणी कर्मचारी मानदेय प्रपत्र - 89 पीडीऍफ़' : 'Generate Official RBSE Exam Center Remuneration Bill & Verification PDF'}
            </p>
          </div>
        </div>

        <button
          onClick={handleExportPdf}
          className="px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-sm transition-all"
        >
          <Download className="w-4 h-4 text-amber-300" />
          <span>Export Bill PDF</span>
        </button>
      </div>

      {/* Exam & Centre Config */}
      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
        <h4 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
          <Building className="w-4 h-4 text-emerald-600" />
          <span>Exam & Centre Details</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <div>
            <label className="block text-[10px] font-semibold text-slate-500">Board Exam Title</label>
            <input
              type="text"
              value={examName}
              onChange={e => setExamName(e.target.value)}
              className="w-full px-2 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-medium"
            />
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-slate-500">Exam Centre Code</label>
            <input
              type="text"
              value={centreCode}
              onChange={e => setCentreCode(e.target.value)}
              className="w-full px-2 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono font-bold"
            />
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-slate-500">Centre Name</label>
            <input
              type="text"
              value={centreName}
              onChange={e => setCentreName(e.target.value)}
              className="w-full px-2 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-medium"
            />
          </div>
        </div>
      </div>

      {/* Staff Remuneration List */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
            Deployed Staff Members ({staffList.length})
          </span>
          <button
            onClick={handleAddStaff}
            className="px-2.5 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold flex items-center space-x-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Staff Member</span>
          </button>
        </div>

        <div className="space-y-2">
          {staffList.map((staff, idx) => {
            const payable = staff.sessionsCount * staff.ratePerSession;
            return (
              <div key={staff.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    #{idx + 1} {staff.staffName || 'Staff Member'}
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-extrabold text-emerald-700 dark:text-emerald-300">
                      ₹{payable.toLocaleString('en-IN')}
                    </span>
                    <button
                      onClick={() => handleRemoveStaff(staff.id)}
                      className="text-rose-500 hover:text-rose-700 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div>
                    <label className="block text-[10px] text-slate-500 font-semibold">Staff Name</label>
                    <input
                      type="text"
                      value={staff.staffName}
                      onChange={e => handleUpdateStaff(staff.id, 'staffName', e.target.value)}
                      placeholder="e.g. Shri Rajesh Kumar"
                      className="w-full px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-500 font-semibold">Duty Role</label>
                    <select
                      value={staff.role}
                      onChange={e => {
                        const newRole = e.target.value;
                        let defaultRate = 150;
                        if (newRole.includes('Superintendent')) defaultRate = 250;
                        else if (newRole.includes('Peon')) defaultRate = 80;
                        else if (newRole.includes('Sweeper')) defaultRate = 70;
                        handleUpdateStaff(staff.id, 'role', newRole);
                        handleUpdateStaff(staff.id, 'ratePerSession', defaultRate);
                      }}
                      className="w-full px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                    >
                      <option value="Center Superintendent (CS)">Center Superintendent (CS)</option>
                      <option value="Deputy CS / Asst Supt">Deputy CS / Asst Supt</option>
                      <option value="Room Invigilator (वीक्षक)">Room Invigilator (वीक्षक)</option>
                      <option value="Flying Squad Member">Flying Squad Member</option>
                      <option value="Class IV Staff (Peon)">Class IV Staff (Peon)</option>
                      <option value="Water Bearer / Sweeper">Water Bearer / Sweeper</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-500 font-semibold">Sessions Count</label>
                    <input
                      type="number"
                      value={staff.sessionsCount}
                      onChange={e => handleUpdateStaff(staff.id, 'sessionsCount', Number(e.target.value))}
                      className="w-full px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-500 font-semibold">Rate per Session (₹)</label>
                    <input
                      type="number"
                      value={staff.ratePerSession}
                      onChange={e => handleUpdateStaff(staff.id, 'ratePerSession', Number(e.target.value))}
                      className="w-full px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200 dark:border-slate-700/50">
                  <div>
                    <label className="block text-[10px] text-slate-500 font-semibold">Bank Account No.</label>
                    <input
                      type="text"
                      value={staff.bankAccount}
                      onChange={e => handleUpdateStaff(staff.id, 'bankAccount', e.target.value)}
                      placeholder="e.g. 38192019201"
                      className="w-full px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 font-semibold">IFSC Code</label>
                    <input
                      type="text"
                      value={staff.ifsc}
                      onChange={e => handleUpdateStaff(staff.id, 'ifsc', e.target.value.toUpperCase())}
                      placeholder="e.g. SBIN0001234"
                      className="w-full px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono"
                    />
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* Summary Footer Box */}
      <div className="p-3 rounded-xl bg-emerald-900 text-white flex items-center justify-between shadow-md">
        <div>
          <span className="text-xs text-emerald-200 block">Total Remuneration Claim</span>
          <span className="text-lg font-black text-amber-300 font-mono">
            ₹{totalBillAmount.toLocaleString('en-IN')}
          </span>
        </div>

        <button
          onClick={handleExportPdf}
          className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center space-x-1 shadow"
        >
          <Download className="w-4 h-4" />
          <span>Download Form 89 PDF</span>
        </button>
      </div>

    </div>
  );
};
