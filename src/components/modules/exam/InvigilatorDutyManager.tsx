import React, { useState, useMemo } from 'react';
import { SchoolProfile, Teacher, Language } from '../../../types';
import {
  Users,
  Shield,
  Calendar,
  Sparkles,
  CheckCircle2,
  XCircle,
  Clock,
  Printer,
  Edit2,
  Trash2,
  Plus,
  RefreshCw,
  Award,
  AlertCircle,
  FileSpreadsheet,
  ArrowRightLeft,
  Filter
} from 'lucide-react';

export type TeacherDutyStatus = 'available' | 'absent' | 'relieved' | 'reserved';
export type AllowedClassLevel = 'all' | 'primary' | 'upper_primary' | 'secondary';

export interface DutyTeacherRecord {
  id: string;
  name: string;
  designation: string;
  allowedClassLevel: AllowedClassLevel;
  status: TeacherDutyStatus;
  statusReason?: string;
  totalDutiesDone: number;
  roomHistory: string[]; // List of room names previously assigned
}

export interface InvigilationDuty {
  id: string;
  date: string;
  shift: 'shift1' | 'shift2';
  room: string;
  teacherId: string;
  teacherName: string;
  designation: string;
  role: 'room_invigilator' | 'chief_invigilator' | 'reserve' | 'flying_squad';
  isManualOverride?: boolean;
}

interface InvigilatorDutyManagerProps {
  schoolProfile: SchoolProfile;
  teachers?: Teacher[];
  lang: Language;
  onBack?: () => void;
}

export const InvigilatorDutyManager: React.FC<InvigilatorDutyManagerProps> = ({
  schoolProfile,
  teachers = [],
  lang
}) => {
  const isHi = lang === 'hi';

  // Sub-tab navigation: 'roster' | 'teachers_data' | 'master_data' | 'print_view'
  const [activeSection, setActiveSection] = useState<'roster' | 'teachers_data' | 'master_data' | 'print_view'>('roster');

  // Roster parameters
  const [currentDate, setCurrentDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [currentShift, setCurrentShift] = useState<'shift1' | 'shift2'>('shift1');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Rooms list
  const [roomsList, setRoomsList] = useState<string[]>([
    'कक्ष संख्या 101',
    'कक्ष संख्या 102',
    'कक्ष संख्या 103',
    'कक्ष संख्या 104',
    'कक्ष संख्या 105',
    'कक्ष संख्या 106'
  ]);
  const [newRoomName, setNewRoomName] = useState<string>('');

  // Default initial teachers data with duties and levels
  const initialTeacherRecords: DutyTeacherRecord[] = useMemo(() => {
    const pool = teachers.length > 0 ? teachers : [
      { id: 't1', name: 'श्री रमेश चन्द्र शर्मा', role: 'वरिष्ठ अध्यापक (गणित)', subject: 'गणित' },
      { id: 't2', name: 'श्रीमती अनिता चौधरी', role: 'अध्यापक L-2 (अंग्रेजी)', subject: 'अंग्रेजी' },
      { id: 't3', name: 'श्री गोविन्द राम जाट', role: 'प्राध्यापक (हिन्दी)', subject: 'हिन्दी' },
      { id: 't4', name: 'श्रीमती सीमा गुप्ता', role: 'वरिष्ठ अध्यापक (विज्ञान)', subject: 'विज्ञान' },
      { id: 't5', name: 'श्री विनोद कुमार सैनी', role: 'अध्यापक L-1 (सामान्य)', subject: 'सामान्य' },
      { id: 't6', name: 'श्री सुरेश चन्द्र मीणा', role: 'अध्यापक L-2 (सा. विज्ञान)', subject: 'सामाजिक' },
      { id: 't7', name: 'श्रीमती रेखा वर्मा', role: 'शारीरिक शिक्षक (PTI)', subject: 'शारीरिक शिक्षा' },
      { id: 't8', name: 'श्री महेन्द्र पाल सिंह', role: 'प्रयोगशाला सहायक', subject: 'विज्ञान' },
      { id: 't9', name: 'श्री दिनेश कुमार कुमावत', role: 'अध्यापक L-1 (सामान्य)', subject: 'सामान्य' },
      { id: 't10', name: 'श्रीमती पूजा राठौड़', role: 'वरिष्ठ अध्यापक (संस्कृत)', subject: 'संस्कृत' }
    ];

    return pool.map((t, idx) => {
      let level: AllowedClassLevel = 'all';
      if (t.role?.includes('L-1')) level = 'primary';
      else if (t.role?.includes('L-2')) level = 'upper_primary';
      else if (t.role?.includes('प्राध्यापक') || t.role?.includes('वरिष्ठ')) level = 'secondary';

      return {
        id: t.id || `t-${idx + 1}`,
        name: t.name || `शिक्षक ${idx + 1}`,
        designation: (t as any).role || (t as any).designation || 'वरिष्ठ अध्यापक',
        allowedClassLevel: level,
        status: (idx === 7 ? 'absent' : idx === 6 ? 'reserved' : 'available') as TeacherDutyStatus,
        statusReason: idx === 7 ? 'चिकित्सा अवकाश' : idx === 6 ? 'आकस्मिक रिजर्व वीक्षक' : '',
        totalDutiesDone: idx % 3,
        roomHistory: []
      };
    });
  }, [teachers]);

  // Persistent Teachers Master state in local state
  const [dutyTeachers, setDutyTeachers] = useState<DutyTeacherRecord[]>(initialTeacherRecords);

  // Stored duties roster (grouped by date_shift)
  const [dutiesRoster, setDutiesRoster] = useState<InvigilationDuty[]>([
    {
      id: 'd-1',
      date: new Date().toISOString().split('T')[0],
      shift: 'shift1',
      room: 'कक्ष संख्या 101',
      teacherId: initialTeacherRecords[0]?.id || 't1',
      teacherName: initialTeacherRecords[0]?.name || 'श्री रमेश चन्द्र शर्मा',
      designation: initialTeacherRecords[0]?.designation || 'वरिष्ठ अध्यापक',
      role: 'room_invigilator',
      isManualOverride: false
    },
    {
      id: 'd-2',
      date: new Date().toISOString().split('T')[0],
      shift: 'shift1',
      room: 'कक्ष संख्या 102',
      teacherId: initialTeacherRecords[1]?.id || 't2',
      teacherName: initialTeacherRecords[1]?.name || 'श्रीमती अनिता चौधरी',
      designation: initialTeacherRecords[1]?.designation || 'अध्यापक L-2',
      role: 'room_invigilator',
      isManualOverride: false
    },
    {
      id: 'd-res',
      date: new Date().toISOString().split('T')[0],
      shift: 'shift1',
      room: 'नियंत्रण कक्ष (कंट्रोल रूम)',
      teacherId: initialTeacherRecords[6]?.id || 't7',
      teacherName: initialTeacherRecords[6]?.name || 'श्रीमती रेखा वर्मा',
      designation: initialTeacherRecords[6]?.designation || 'शारीरिक शिक्षक',
      role: 'reserve',
      isManualOverride: false
    }
  ]);

  // Manual duty assignment inputs
  const [manualTeacherId, setManualTeacherId] = useState<string>('');
  const [manualRoom, setManualRoom] = useState<string>('कक्ष संख्या 101');
  const [manualRole, setManualRole] = useState<'room_invigilator' | 'chief_invigilator' | 'reserve' | 'flying_squad'>('room_invigilator');

  // Whole exam dates setup for bulk generation
  const [bulkExamDates, setBulkExamDates] = useState<string[]>([
    '2026-03-09',
    '2026-03-10',
    '2026-03-11',
    '2026-03-12',
    '2026-03-14'
  ]);
  const [bulkShift, setBulkShift] = useState<'shift1' | 'shift2'>('shift1');

  // Filter duties for selected date and shift
  const currentDuties = useMemo(() => {
    return dutiesRoster.filter(d => d.date === currentDate && d.shift === currentShift);
  }, [dutiesRoster, currentDate, currentShift]);

  // Update teacher status (Available / Absent / Relieved / Reserved)
  const handleUpdateStatus = (
    teacherId: string,
    newStatus: TeacherDutyStatus,
    reason: string = ''
  ) => {
    setDutyTeachers(prev =>
      prev.map(t =>
        t.id === teacherId
          ? { ...t, status: newStatus, statusReason: reason || t.statusReason }
          : t
      )
    );
    showToast(
      isHi
        ? `शिक्षक स्थिति अपडेट: ${getStatusBadge(newStatus).label}`
        : `Teacher status updated to ${newStatus}`
    );
  };

  // Update teacher allowed class level
  const handleUpdateClassLevel = (teacherId: string, level: AllowedClassLevel) => {
    setDutyTeachers(prev =>
      prev.map(t => (t.id === teacherId ? { ...t, allowedClassLevel: level } : t))
    );
    showToast(isHi ? 'ड्यूटी हेतु अनुमत कक्षा स्तर अद्यतन किया गया!' : 'Allowed class level updated!');
  };

  // Helper labels
  const getStatusBadge = (status: TeacherDutyStatus) => {
    switch (status) {
      case 'available':
        return { label: 'उपलब्ध (Available)', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300' };
      case 'absent':
        return { label: 'अनुपस्थित (Absent)', color: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border-rose-300' };
      case 'relieved':
        return { label: 'कार्यमुक्त/अवकाश (Relieved)', color: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300' };
      case 'reserved':
        return { label: 'आरक्षित (Reserve Pool)', color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 border-indigo-300' };
    }
  };

  const getClassLevelBadge = (level: AllowedClassLevel) => {
    switch (level) {
      case 'all':
        return 'समस्त कक्षाएं (All Classes)';
      case 'primary':
        return 'प्राथमिक स्तर (1 से 5)';
      case 'upper_primary':
        return 'उच्च प्राथमिक (6 से 8)';
      case 'secondary':
        return 'माध्यमिक/उच्च माध्यमिक (9 से 12)';
    }
  };

  // --- AUTOMATED DUTY ALLOCATION ALGORITHM ---
  // Constraints:
  // 1. Skip 'absent' and 'relieved' teachers.
  // 2. Put 'reserved' teachers in the Reserve Pool.
  // 3. Room rotation: Ensure until all rooms are covered, do not repeat the same room for the same teacher.
  // 4. Fair workload: Prioritize teachers with fewer past duties.
  const handleAutoAllotDutiesForCurrentDay = () => {
    // 1. Filter eligible active teachers
    const activeTeachers = dutyTeachers.filter(t => t.status === 'available');
    const reservedTeachers = dutyTeachers.filter(t => t.status === 'reserved');

    if (activeTeachers.length === 0) {
      showToast(isHi ? 'त्रुटि: कोई भी शिक्षक उपलब्ध स्थिति में नहीं है!' : 'Error: No teachers available for duty!');
      return;
    }

    // Sort by least duties done (fair workload distribution)
    const sortedActive = [...activeTeachers].sort(
      (a, b) => a.totalDutiesDone - b.totalDutiesDone
    );

    const newDayDuties: InvigilationDuty[] = [];
    const updatedTeachers = [...dutyTeachers];

    // Track assigned rooms to prevent repeating for a teacher
    roomsList.forEach((roomName, rIdx) => {
      // Find the best teacher who has NOT been assigned to this room recently
      let chosenIndex = sortedActive.findIndex(t => !t.roomHistory.includes(roomName));

      // If all available have this room in history, pick the one with lowest duties
      if (chosenIndex === -1 && sortedActive.length > 0) {
        chosenIndex = 0;
      }

      if (chosenIndex !== -1) {
        const chosen = sortedActive.splice(chosenIndex, 1)[0];

        newDayDuties.push({
          id: `duty-${currentDate}-${currentShift}-${Date.now()}-${rIdx}`,
          date: currentDate,
          shift: currentShift,
          room: roomName,
          teacherId: chosen.id,
          teacherName: chosen.name,
          designation: chosen.designation,
          role: 'room_invigilator',
          isManualOverride: false
        });

        // Update teacher master duty count & room history
        const masterIdx = updatedTeachers.findIndex(t => t.id === chosen.id);
        if (masterIdx !== -1) {
          const currentHist = updatedTeachers[masterIdx].roomHistory;
          const nextHist = [...currentHist, roomName];
          // If teacher has covered all rooms, reset their room history cycle
          const resetHist = nextHist.length >= roomsList.length ? [] : nextHist;

          updatedTeachers[masterIdx] = {
            ...updatedTeachers[masterIdx],
            totalDutiesDone: updatedTeachers[masterIdx].totalDutiesDone + 1,
            roomHistory: resetHist
          };
        }
      }
    });

    // Assign Reserve teachers to Reserve Pool
    reservedTeachers.forEach((res, idx) => {
      newDayDuties.push({
        id: `duty-res-${currentDate}-${currentShift}-${idx}`,
        date: currentDate,
        shift: currentShift,
        room: `आरक्षित ड्यूटी (कक्ष ${idx + 1})`,
        teacherId: res.id,
        teacherName: res.name,
        designation: res.designation,
        role: 'reserve',
        isManualOverride: false
      });

      const masterIdx = updatedTeachers.findIndex(t => t.id === res.id);
      if (masterIdx !== -1) {
        updatedTeachers[masterIdx] = {
          ...updatedTeachers[masterIdx],
          totalDutiesDone: updatedTeachers[masterIdx].totalDutiesDone + 1
        };
      }
    });

    // Replace duties for this date & shift
    setDutiesRoster(prev => [
      ...prev.filter(d => !(d.date === currentDate && d.shift === currentShift)),
      ...newDayDuties
    ]);

    setDutyTeachers(updatedTeachers);

    showToast(
      isHi
        ? `सफलता: ${newDayDuties.length} वीक्षकों की स्मार्ट रोटेशनल ड्यूटी आवंटित की गई!`
        : `Success: Rotational duties generated for ${newDayDuties.length} invigilators!`
    );
  };

  // Bulk Generation for Whole Exam Schedule
  const handleGenerateWholeExamDuties = () => {
    if (bulkExamDates.length === 0) return;

    let updatedTeachers = [...dutyTeachers];
    const allGeneratedDuties: InvigilationDuty[] = [];

    bulkExamDates.forEach(dDate => {
      const activeTeachers = updatedTeachers.filter(t => t.status === 'available');
      const reservedTeachers = updatedTeachers.filter(t => t.status === 'reserved');

      // Sort by workload
      const sortedActive = [...activeTeachers].sort(
        (a, b) => a.totalDutiesDone - b.totalDutiesDone
      );

      roomsList.forEach((roomName, rIdx) => {
        let chosenIndex = sortedActive.findIndex(t => !t.roomHistory.includes(roomName));
        if (chosenIndex === -1 && sortedActive.length > 0) chosenIndex = 0;

        if (chosenIndex !== -1) {
          const chosen = sortedActive.splice(chosenIndex, 1)[0];

          allGeneratedDuties.push({
            id: `bulk-${dDate}-${bulkShift}-${rIdx}`,
            date: dDate,
            shift: bulkShift,
            room: roomName,
            teacherId: chosen.id,
            teacherName: chosen.name,
            designation: chosen.designation,
            role: 'room_invigilator',
            isManualOverride: false
          });

          const masterIdx = updatedTeachers.findIndex(t => t.id === chosen.id);
          if (masterIdx !== -1) {
            const currentHist = updatedTeachers[masterIdx].roomHistory;
            const nextHist = [...currentHist, roomName];
            const resetHist = nextHist.length >= roomsList.length ? [] : nextHist;

            updatedTeachers[masterIdx] = {
              ...updatedTeachers[masterIdx],
              totalDutiesDone: updatedTeachers[masterIdx].totalDutiesDone + 1,
              roomHistory: resetHist
            };
          }
        }
      });

      // Add reserved pool
      reservedTeachers.forEach((res, idx) => {
        allGeneratedDuties.push({
          id: `bulk-res-${dDate}-${bulkShift}-${idx}`,
          date: dDate,
          shift: bulkShift,
          room: `कंट्रोल रूम आरक्षित`,
          teacherId: res.id,
          teacherName: res.name,
          designation: res.designation,
          role: 'reserve',
          isManualOverride: false
        });

        const masterIdx = updatedTeachers.findIndex(t => t.id === res.id);
        if (masterIdx !== -1) {
          updatedTeachers[masterIdx] = {
            ...updatedTeachers[masterIdx],
            totalDutiesDone: updatedTeachers[masterIdx].totalDutiesDone + 1
          };
        }
      });
    });

    // Merge into duties roster
    setDutiesRoster(prev => {
      const datesSet = new Set(bulkExamDates);
      const filtered = prev.filter(d => !datesSet.has(d.date) || d.shift !== bulkShift);
      return [...filtered, ...allGeneratedDuties];
    });

    setDutyTeachers(updatedTeachers);

    showToast(
      isHi
        ? `सम्पूर्ण परीक्षा की ${allGeneratedDuties.length} ड्यूटियाँ सफलतापूर्वक सृजित की गईं!`
        : `Generated ${allGeneratedDuties.length} duties for the entire exam schedule!`
    );
  };

  // Add manual duty override
  const handleAddManualDuty = (e: React.FormEvent) => {
    e.preventDefault();
    const teacher = dutyTeachers.find(t => t.id === manualTeacherId);
    if (!teacher) return;

    const newDuty: InvigilationDuty = {
      id: `manual-${Date.now()}`,
      date: currentDate,
      shift: currentShift,
      room: manualRoom,
      teacherId: teacher.id,
      teacherName: teacher.name,
      designation: teacher.designation,
      role: manualRole,
      isManualOverride: true
    };

    setDutiesRoster(prev => [...prev, newDuty]);
    setDutyTeachers(prev =>
      prev.map(t =>
        t.id === teacher.id ? { ...t, totalDutiesDone: t.totalDutiesDone + 1 } : t
      )
    );

    showToast(
      isHi
        ? `मैन्युअल ड्यूटी जोड़ी गई: ${teacher.name} -> ${manualRoom}`
        : `Manual duty assigned to ${teacher.name}`
    );
  };

  // Delete Duty
  const handleDeleteDuty = (dutyId: string) => {
    setDutiesRoster(prev => prev.filter(d => d.id !== dutyId));
    showToast(isHi ? 'ड्यूटी सफलतापूर्वक हटाई गई' : 'Duty removed');
  };

  // Add room
  const handleAddRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomName.trim()) return;
    setRoomsList(prev => [...prev, newRoomName.trim()]);
    setNewRoomName('');
    showToast(isHi ? 'नया परीक्षा कक्ष जोड़ा गया!' : 'Room added!');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-950 text-white p-4 sm:p-6 rounded-3xl shadow-xl border border-indigo-800/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="p-3 rounded-2xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            <Users className="w-6 h-6 text-indigo-300" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black tracking-tight flex items-center gap-2">
              <span>वीक्षक ड्यूटी आवंटन एवं मास्टर रोस्टर इंजन</span>
              <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-indigo-400 text-slate-950 uppercase">
                Anti-Collision
              </span>
            </h2>
            <p className="text-xs text-indigo-200/80">
              {schoolProfile?.schoolName || 'राजकीय उच्च माध्यमिक विद्यालय'} • शिक्षक डेटा, आरक्षित वीक्षक, कक्ष रोटेशन व सम्पूर्ण परीक्षा रोस्टर
            </p>
          </div>
        </div>

        {/* Action button */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            onClick={() => setActiveSection('print_view')}
            className="flex-1 md:flex-initial px-4 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all min-h-[44px]"
          >
            <Printer className="w-4 h-4" />
            <span>दैनिक वीक्षक उपस्थिति प्रपत्र / PDF</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 bg-white dark:bg-slate-900 p-2.5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm print:hidden">
        <button
          onClick={() => setActiveSection('roster')}
          className={`px-4 py-2.5 rounded-2xl font-black text-xs flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap min-h-[44px] ${
            activeSection === 'roster'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>दैनिक ड्यूटी आवंटन (Daily Roster)</span>
        </button>

        <button
          onClick={() => setActiveSection('teachers_data')}
          className={`px-4 py-2.5 rounded-2xl font-black text-xs flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap min-h-[44px] ${
            activeSection === 'teachers_data'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>शिक्षक डेटा व उपलब्धता (Teacher Availability)</span>
        </button>

        <button
          onClick={() => setActiveSection('master_data')}
          className={`px-4 py-2.5 rounded-2xl font-black text-xs flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap min-h-[44px] ${
            activeSection === 'master_data'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>मास्टर डेटा - कुल ड्यूटी रिकॉर्ड (Master Log)</span>
        </button>

        <button
          onClick={() => setActiveSection('print_view')}
          className={`px-4 py-2.5 rounded-2xl font-black text-xs flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap min-h-[44px] ${
            activeSection === 'print_view'
              ? 'bg-amber-400 text-slate-950 shadow-md font-black'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
          }`}
        >
          <Printer className="w-4 h-4" />
          <span>प्रिंट प्रपत्र (Official Sheet)</span>
        </button>
      </div>

      {/* Toast Feedback */}
      {toastMsg && (
        <div className="p-3 bg-indigo-950 text-indigo-100 rounded-2xl font-bold text-xs flex items-center justify-between border border-indigo-800 shadow-lg animate-in fade-in">
          <span className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{toastMsg}</span>
          </span>
          <button onClick={() => setToastMsg(null)}>✕</button>
        </div>
      )}

      {/* SECTION 1: DAILY ROSTER & AUTOMATED ALLOCATION */}
      {activeSection === 'roster' && (
        <div className="space-y-6">
          
          {/* Top Date & Shift Selector Bar */}
          <div className="p-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-slate-700 dark:text-slate-300">दिनांक:</span>
                <input
                  type="date"
                  value={currentDate}
                  onChange={e => setCurrentDate(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
                />
              </div>

              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-slate-700 dark:text-slate-300">पारी:</span>
                <select
                  value={currentShift}
                  onChange={e => setCurrentShift(e.target.value as any)}
                  className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
                >
                  <option value="shift1">प्रथम पारी (08:30 AM - 11:45 AM)</option>
                  <option value="shift2">द्वितीय पारी (01:15 PM - 04:30 PM)</option>
                </select>
              </div>
            </div>

            {/* Auto Allot Button */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleAutoAllotDutiesForCurrentDay}
                className="px-4 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black flex items-center gap-2 shadow-md cursor-pointer transition-all min-h-[44px]"
              >
                <RefreshCw className="w-4 h-4" />
                <span>इस दिन हेतु ऑटो आवंटन (Auto Allot)</span>
              </button>
            </div>
          </div>

          {/* Quick Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-[11px] text-slate-500 font-bold block">कुल परीक्षा कक्ष</span>
              <span className="text-xl font-black text-slate-900 dark:text-slate-100">{roomsList.length}</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-[11px] text-emerald-600 font-bold block">उपलब्ध शिक्षक</span>
              <span className="text-xl font-black text-emerald-600">
                {dutyTeachers.filter(t => t.status === 'available').length}
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-[11px] text-indigo-600 font-bold block">आरक्षित वीक्षक (Reserve)</span>
              <span className="text-xl font-black text-indigo-600">
                {dutyTeachers.filter(t => t.status === 'reserved').length}
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="text-[11px] text-rose-600 font-bold block">अनुपस्थित / कार्यमुक्त</span>
              <span className="text-xl font-black text-rose-600">
                {dutyTeachers.filter(t => t.status === 'absent' || t.status === 'relieved').length}
              </span>
            </div>
          </div>

          {/* Duties Table & Manual Assignment Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs">
            
            {/* Left: Current Day Duty Roster Table */}
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <h3 className="font-black text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-indigo-600" />
                  <span>दैनिक आवंटित वीक्षक ड्यूटी सूची ({currentDate})</span>
                </h3>
                <span className="text-xs font-bold text-slate-500">
                  कुल ड्यूटी: {currentDuties.length}
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[500px]">
                  <thead>
                    <tr className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-black border-b border-slate-200 dark:border-slate-700">
                      <th className="p-2.5 w-12 text-center">क्र.</th>
                      <th className="p-2.5">कक्ष / स्थान</th>
                      <th className="p-2.5">वीक्षक (शिक्षक का नाम)</th>
                      <th className="p-2.5">पद</th>
                      <th className="p-2.5">प्रकार</th>
                      <th className="p-2.5 text-center">कार्रवाई</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {currentDuties.map((d, idx) => (
                      <tr key={d.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/60 font-medium">
                        <td className="p-2.5 text-center font-bold text-slate-500">{idx + 1}</td>
                        <td className="p-2.5 font-black text-indigo-700 dark:text-indigo-400">{d.room}</td>
                        <td className="p-2.5">
                          <strong className="block text-slate-900 dark:text-slate-100">{d.teacherName}</strong>
                          {d.isManualOverride && (
                            <span className="text-[9px] font-bold text-amber-600 dark:text-amber-400">
                              (मैन्युअल असाइन)
                            </span>
                          )}
                        </td>
                        <td className="p-2.5 text-slate-600 dark:text-slate-400">{d.designation}</td>
                        <td className="p-2.5">
                          {d.role === 'reserve' ? (
                            <span className="px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 font-bold text-[10px]">
                              आरक्षित वीक्षक
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-[10px]">
                              कक्ष वीक्षक
                            </span>
                          )}
                        </td>
                        <td className="p-2.5 text-center">
                          <button
                            onClick={() => handleDeleteDuty(d.id)}
                            className="p-1.5 rounded-lg hover:bg-rose-100 text-rose-600 transition-all cursor-pointer"
                            title="ड्यूटी हटाएं"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {currentDuties.length === 0 && (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-slate-400 font-bold">
                          इस तिथि एवं पारी हेतु अभी कोई ड्यूटी आवंटित नहीं है। 'ऑटो आवंटन' बटन दबाएं या दाईं ओर से मैन्युअल असाइन करें।
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right: Manual Duty Override & Whole Exam Generator */}
            <div className="space-y-4">
              
              {/* Manual Assignment Form */}
              <form onSubmit={handleAddManualDuty} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-sm space-y-3">
                <h4 className="font-black text-xs text-slate-900 dark:text-slate-100 flex items-center gap-1.5 pb-2 border-b border-slate-200 dark:border-slate-800">
                  <Edit2 className="w-3.5 h-3.5 text-indigo-600" />
                  <span>मैन्युअल ड्यूटी असाइनमेंट (Manual Override)</span>
                </h4>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    शिक्षक का चयन करें:
                  </label>
                  <select
                    value={manualTeacherId}
                    onChange={e => setManualTeacherId(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
                  >
                    <option value="">-- शिक्षक चुनें --</option>
                    {dutyTeachers.map(t => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.designation}) - कुल ड्यूटी: {t.totalDutiesDone}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    आवंटित कक्ष:
                  </label>
                  <select
                    value={manualRoom}
                    onChange={e => setManualRoom(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
                  >
                    {roomsList.map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                    <option value="आरक्षित ड्यूटी (कंट्रोल रूम)">आरक्षित ड्यूटी (कंट्रोल रूम)</option>
                    <option value="उड़नदस्ता (Flying Squad)">उड़नदस्ता (Flying Squad)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    ड्यूटी पद/प्रकार:
                  </label>
                  <select
                    value={manualRole}
                    onChange={e => setManualRole(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
                  >
                    <option value="room_invigilator">कक्ष वीक्षक (Room Invigilator)</option>
                    <option value="reserve">आरक्षित वीक्षक (Reserve Invigilator)</option>
                    <option value="chief_invigilator">सहायक केंद्राधीक्षक</option>
                    <option value="flying_squad">उड़नदस्ता दल सदस्य</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all min-h-[44px]"
                >
                  <Plus className="w-4 h-4" />
                  <span>मैन्युअल ड्यूटी असाइन करें</span>
                </button>
              </form>

              {/* Whole Exam Bulk Generator Box */}
              <div className="bg-gradient-to-br from-indigo-50 to-slate-100 dark:from-slate-800/80 dark:to-slate-900 rounded-3xl border border-indigo-200 dark:border-indigo-900/40 p-4 sm:p-5 shadow-sm space-y-3">
                <h4 className="font-black text-xs text-indigo-950 dark:text-indigo-200 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>सम्पूर्ण परीक्षा समय-सारणी हेतु ऑटो ड्यूटी जनरेटर</span>
                </h4>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">
                  पूरी परीक्षा अवधि ({bulkExamDates.length} दिन) हेतु कक्ष रोटेशन नियम के साथ समस्त ड्यूटियाँ एक क्लिक में सृजित करें।
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {bulkExamDates.map(dt => (
                    <span key={dt} className="px-2 py-0.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono text-[10px] font-bold">
                      {dt}
                    </span>
                  ))}
                </div>

                <button
                  onClick={handleGenerateWholeExamDuties}
                  className="w-full py-2.5 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md transition-all min-h-[44px]"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>संपूर्ण परीक्षा ड्यूटियां सृजित करें</span>
                </button>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* SECTION 2: TEACHERS DATA & STATUS (ABSENT / RELIEVED / RESERVED / ALLOWED LEVEL) */}
      {activeSection === 'teachers_data' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6 shadow-xl space-y-5 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 gap-2">
            <div>
              <h3 className="font-black text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Shield className="w-4 h-4 text-indigo-600" />
                <span>शिक्षक डेटा एवं ड्यूटी पात्रता प्रबंधन (Teacher Roster Status)</span>
              </h3>
              <p className="text-[11px] text-slate-500">
                अनुपस्थित (Absent) या कार्यमुक्त (Relieved) मार्क करने पर ऑटोमैटिक सिस्टम उन्हें ड्यूटी में नहीं लेगा। आरक्षित (Reserved) को रिजर्व पूल में रखेगा।
              </p>
            </div>
            <span className="font-bold text-slate-500">कुल शिक्षक: {dutyTeachers.length}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-black border-b border-slate-200 dark:border-slate-700">
                  <th className="p-2.5 w-12 text-center">क्र.</th>
                  <th className="p-2.5">शिक्षक का नाम</th>
                  <th className="p-2.5">पदनाम</th>
                  <th className="p-2.5">ड्यूटी हेतु अनुमत कक्षा स्तर</th>
                  <th className="p-2.5">दैनिक ड्यूटी स्थिति (Status)</th>
                  <th className="p-2.5">कारण / टिप्पणी</th>
                  <th className="p-2.5 text-center">त्वरित कार्रवाई</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {dutyTeachers.map((t, idx) => {
                  const badge = getStatusBadge(t.status);
                  return (
                    <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 font-medium">
                      <td className="p-2.5 text-center font-bold text-slate-500">{idx + 1}</td>
                      <td className="p-2.5 font-bold text-slate-900 dark:text-slate-100">
                        {t.name}
                      </td>
                      <td className="p-2.5 text-slate-600 dark:text-slate-400">{t.designation}</td>
                      
                      {/* Allowed Class Level */}
                      <td className="p-2.5">
                        <select
                          value={t.allowedClassLevel}
                          onChange={e => handleUpdateClassLevel(t.id, e.target.value as AllowedClassLevel)}
                          className="px-2 py-1 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-xs"
                        >
                          <option value="all">समस्त कक्षाएं (1 से 12)</option>
                          <option value="primary">प्राथमिक स्तर (1 से 5)</option>
                          <option value="upper_primary">उच्च प्राथमिक (6 से 8)</option>
                          <option value="secondary">माध्यमिक/उच्च माध्य (9-12)</option>
                        </select>
                      </td>

                      {/* Status Dropdown */}
                      <td className="p-2.5">
                        <select
                          value={t.status}
                          onChange={e => handleUpdateStatus(t.id, e.target.value as TeacherDutyStatus)}
                          className={`px-2.5 py-1 rounded-xl font-bold border text-xs ${badge.color}`}
                        >
                          <option value="available">🟢 उपलब्ध (Available)</option>
                          <option value="absent">🔴 अनुपस्थित (Absent)</option>
                          <option value="relieved">🟠 कार्यमुक्त / अवकाश (Relieved)</option>
                          <option value="reserved">🟣 आरक्षित / रिजर्व वीक्षक (Reserved)</option>
                        </select>
                      </td>

                      {/* Reason / Remarks */}
                      <td className="p-2.5 text-slate-500">
                        <input
                          type="text"
                          value={t.statusReason || ''}
                          onChange={e => {
                            const val = e.target.value;
                            setDutyTeachers(prev =>
                              prev.map(item => item.id === t.id ? { ...item, statusReason: val } : item)
                            );
                          }}
                          placeholder="उदा. अवकाश, सीएल, रिजर्व ड्यूटी..."
                          className="w-full px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent text-xs"
                        />
                      </td>

                      {/* Quick Toggle Buttons */}
                      <td className="p-2.5 text-center">
                        <div className="flex items-center justify-center gap-1">
                          {t.status !== 'reserved' && (
                            <button
                              onClick={() => handleUpdateStatus(t.id, 'reserved', 'रिजर्व वीक्षक')}
                              className="px-2 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 font-bold text-[10px] cursor-pointer"
                              title="रिजर्व वीक्षक बनाएं"
                            >
                              रिजर्व करें
                            </button>
                          )}
                          {t.status !== 'absent' && (
                            <button
                              onClick={() => handleUpdateStatus(t.id, 'absent', 'अवकाश')}
                              className="px-2 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 font-bold text-[10px] cursor-pointer"
                              title="अनुपस्थित मार्क करें"
                            >
                              अनुपस्थित
                            </button>
                          )}
                          {t.status !== 'available' && (
                            <button
                              onClick={() => handleUpdateStatus(t.id, 'available', '')}
                              className="px-2 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 font-bold text-[10px] cursor-pointer"
                              title="उपलब्ध करें"
                            >
                              सक्रिय करें
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* SECTION 3: MASTER DATA - DUTY COUNTS TRACKER */}
      {activeSection === 'master_data' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6 shadow-xl space-y-5 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 gap-2">
            <div>
              <h3 className="font-black text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-indigo-600" />
                <span>मास्टर डेटा लेजर - वीक्षक ड्यूटी निष्पादन रिकॉर्ड (Master Duty Count Log)</span>
              </h3>
              <p className="text-[11px] text-slate-500">
                शिक्षकों द्वारा संपूर्ण सत्र / परीक्षा में की गई कुल ड्यूटियों का रिकॉर्ड। सिस्टम कम ड्यूटी वाले शिक्षकों को प्राथमिकता से आवंटित करता है।
              </p>
            </div>
            <button
              onClick={() => {
                setDutyTeachers(prev => prev.map(t => ({ ...t, totalDutiesDone: 0, roomHistory: [] })));
                showToast(isHi ? 'मास्टर ड्यूटी काउंट रीसेट किया गया!' : 'Duty counts reset!');
              }}
              className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-100 text-xs cursor-pointer"
            >
              काउंट रीसेट करें
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[650px]">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-black border-b border-slate-200 dark:border-slate-700">
                  <th className="p-2.5 w-12 text-center">क्र.</th>
                  <th className="p-2.5">शिक्षक का नाम</th>
                  <th className="p-2.5">पदनाम</th>
                  <th className="p-2.5 text-center">कुल संपादित ड्यूटियाँ (Total Duties)</th>
                  <th className="p-2.5">कवर किए गए कक्ष (Room Rotation History)</th>
                  <th className="p-2.5 text-center">काउंट समायोजन</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {dutyTeachers.map((t, idx) => (
                  <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 font-medium">
                    <td className="p-2.5 text-center font-bold text-slate-500">{idx + 1}</td>
                    <td className="p-2.5 font-black text-slate-900 dark:text-slate-100">{t.name}</td>
                    <td className="p-2.5 text-slate-600 dark:text-slate-400">{t.designation}</td>
                    <td className="p-2.5 text-center">
                      <span className="px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-900 dark:text-indigo-200 font-black font-mono text-sm">
                        {t.totalDutiesDone} ड्यूटी
                      </span>
                    </td>
                    <td className="p-2.5">
                      <div className="flex flex-wrap gap-1">
                        {t.roomHistory.length > 0 ? (
                          t.roomHistory.map((rm, i) => (
                            <span key={i} className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-bold">
                              {rm}
                            </span>
                          ))
                        ) : (
                          <span className="text-slate-400 italic">रोटेशन चक्र प्रारंभ</span>
                        )}
                      </div>
                    </td>
                    <td className="p-2.5 text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <button
                          onClick={() => {
                            setDutyTeachers(prev =>
                              prev.map(item =>
                                item.id === t.id
                                  ? { ...item, totalDutiesDone: Math.max(0, item.totalDutiesDone - 1) }
                                  : item
                              )
                            );
                          }}
                          className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 font-black text-slate-700"
                        >
                          -
                        </button>
                        <button
                          onClick={() => {
                            setDutyTeachers(prev =>
                              prev.map(item =>
                                item.id === t.id
                                  ? { ...item, totalDutiesDone: item.totalDutiesDone + 1 }
                                  : item
                              )
                            );
                          }}
                          className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 font-black text-slate-700"
                        >
                          +
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* SECTION 4: OFFICIAL PRINTABLE DUTY & ATTENDANCE REGISTER */}
      {activeSection === 'print_view' && (
        <div className="space-y-4">
          <div className="p-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 text-xs print:hidden">
            <span className="font-bold text-slate-700 dark:text-slate-300">
              आधिकारिक दैनिक वीक्षक उपस्थिति पत्रक ({currentDate} - {currentShift === 'shift1' ? 'प्रथम पारी' : 'द्वितीय पारी'}):
            </span>
            <button
              onClick={handlePrint}
              className="px-5 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs flex items-center gap-2 shadow-md cursor-pointer transition-all min-h-[44px]"
            >
              <Printer className="w-4 h-4" />
              <span>प्रपत्र प्रिंट / PDF सेव करें</span>
            </button>
          </div>

          {/* PRINTABLE A4 SHEET */}
          <div className="bg-white text-slate-900 p-6 sm:p-10 rounded-3xl border border-slate-300 shadow-2xl space-y-6 font-serif max-w-4xl mx-auto print:border-none print:shadow-none print:p-0 print:max-w-none">
            
            {/* Letterhead */}
            <div className="text-center border-b-2 border-slate-900 pb-4 space-y-1">
              <h4 className="font-bold text-xs uppercase tracking-widest text-slate-700">
                कार्यालय पंचायत प्रारंभिक शिक्षा अधिकारी (PEEO) एवं प्रधानाचार्य
              </h4>
              <h1 className="text-lg sm:text-xl font-black text-slate-950 tracking-tight">
                {schoolProfile?.schoolName || 'राजकीय उच्च माध्यमिक विद्यालय'}
              </h1>
              <p className="text-xs font-bold text-slate-800">
                यू-डाइज कोड: <span className="font-mono">{schoolProfile?.udiseCode || '08123456789'}</span> • परीक्षा केन्द्र कोड: <span className="font-mono">{schoolProfile?.nicCode || '21045'}</span>
              </p>
              <div className="inline-block px-5 py-1 rounded-full bg-slate-100 border border-slate-900 text-xs font-black uppercase tracking-wider mt-2">
                📋 दैनिक वीक्षक ड्यूटी एवं उपस्थिति रजिस्टर (Daily Invigilation Roster)
              </div>
            </div>

            {/* Exam Details Bar */}
            <div className="grid grid-cols-3 gap-2 text-xs border-b border-slate-300 pb-2">
              <div>
                <span>परीक्षा दिनांक:</span> <strong>{currentDate}</strong>
              </div>
              <div className="text-center">
                <span>परीक्षा पारी:</span> <strong>{currentShift === 'shift1' ? 'प्रथम पारी (08:30 AM - 11:45 AM)' : 'द्वितीय पारी (01:15 PM - 04:30 PM)'}</strong>
              </div>
              <div className="text-right">
                <span>सत्र:</span> <strong>2026-2027</strong>
              </div>
            </div>

            {/* Main Roster Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-slate-900 text-xs text-left">
                <thead>
                  <tr className="bg-slate-100 text-slate-950 font-black border-b border-slate-900">
                    <th className="p-2 border border-slate-900 w-12 text-center">क्र.</th>
                    <th className="p-2 border border-slate-900 w-36">आवंटित परीक्षा कक्ष</th>
                    <th className="p-2 border border-slate-900">वीक्षक का नाम (Teacher Name)</th>
                    <th className="p-2 border border-slate-900 w-32">पदनाम</th>
                    <th className="p-2 border border-slate-900 w-24">उपस्थिति समय</th>
                    <th className="p-2 border border-slate-900 w-32">वीक्षक हस्ताक्षर</th>
                  </tr>
                </thead>
                <tbody>
                  {currentDuties
                    .filter(d => d.role !== 'reserve')
                    .map((d, idx) => (
                      <tr key={d.id} className="border-b border-slate-300 font-medium">
                        <td className="p-2 border border-slate-900 text-center font-bold">{idx + 1}</td>
                        <td className="p-2 border border-slate-900 font-bold text-slate-950">{d.room}</td>
                        <td className="p-2 border border-slate-900 font-black text-slate-900">{d.teacherName}</td>
                        <td className="p-2 border border-slate-900">{d.designation}</td>
                        <td className="p-2 border border-slate-900 text-center font-mono">
                          {currentShift === 'shift1' ? '08:00 AM' : '12:45 PM'}
                        </td>
                        <td className="p-2 border border-slate-900"></td>
                      </tr>
                    ))}
                  {currentDuties.filter(d => d.role !== 'reserve').length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-4 text-center text-slate-500 font-bold border border-slate-900">
                        कोई वीक्षक ड्यूटी आवंटित नहीं की गई है।
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Reserve Pool Section */}
            <div className="space-y-2">
              <h4 className="font-bold text-xs text-slate-900 uppercase">
                आरक्षित वीक्षक विवरण (Reserve / Relief Invigilators Pool):
              </h4>
              <table className="w-full border-collapse border border-slate-900 text-xs text-left">
                <thead>
                  <tr className="bg-slate-50 text-slate-950 font-bold border-b border-slate-900">
                    <th className="p-1.5 border border-slate-900 w-12 text-center">क्र.</th>
                    <th className="p-1.5 border border-slate-900">आरक्षित शिक्षक का नाम</th>
                    <th className="p-1.5 border border-slate-900 w-36">पदनाम</th>
                    <th className="p-1.5 border border-slate-900 w-36">कर्तव्य / कार्यक्षेत्र</th>
                    <th className="p-1.5 border border-slate-900 w-32">हस्ताक्षर</th>
                  </tr>
                </thead>
                <tbody>
                  {currentDuties
                    .filter(d => d.role === 'reserve')
                    .map((d, idx) => (
                      <tr key={d.id} className="border-b border-slate-300">
                        <td className="p-1.5 border border-slate-900 text-center font-bold">{idx + 1}</td>
                        <td className="p-1.5 border border-slate-900 font-bold">{d.teacherName}</td>
                        <td className="p-1.5 border border-slate-900">{d.designation}</td>
                        <td className="p-1.5 border border-slate-900">कंट्रोल रूम / रिलीफ ड्यूटी</td>
                        <td className="p-1.5 border border-slate-900"></td>
                      </tr>
                    ))}
                  {currentDuties.filter(d => d.role === 'reserve').length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-2 text-center text-slate-400 italic border border-slate-900">
                        इस पारी में कोई शिक्षक आरक्षित सूची में नहीं है।
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Instructions for Invigilators */}
            <div className="p-3 bg-slate-50 border border-slate-300 rounded-xl space-y-1 text-[11px]">
              <strong className="block text-slate-900">वीक्षकों हेतु सामान्य अनुदेश:</strong>
              <ol className="list-decimal pl-4 space-y-0.5 text-slate-700">
                <li>समस्त वीक्षक परीक्षा प्रारंभ होने से 30 मिनट पूर्व केंद्राधीक्षक कक्ष में अपनी उपस्थिति दर्ज करवाएं।</li>
                <li>परीक्षा कक्ष में मोबाइल फोन का उपयोग पूर्णतया निषिद्ध है, समस्त फोन नियंत्रण कक्ष में जमा करवाएं।</li>
                <li>उत्तरपुस्तिकाओं पर परीक्षार्थी के रोल नंबर व हस्ताक्षर का मिलान सावधानीपूर्वक करें।</li>
              </ol>
            </div>

            {/* Signatures */}
            <div className="pt-8 flex justify-between items-end text-xs font-bold text-slate-900">
              <div className="text-center space-y-1">
                <div className="w-36 h-10 border-b border-dashed border-slate-400 mx-auto"></div>
                <p>हस्ताक्षर परीक्षा प्रभारी</p>
              </div>

              <div className="text-center space-y-1">
                <div className="w-40 h-10 border-b border-dashed border-slate-400 mx-auto"></div>
                <p>हस्ताक्षर केन्द्राधीक्षक / प्रधानाचार्य</p>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
