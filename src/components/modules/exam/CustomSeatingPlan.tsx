import React, { useState, useMemo } from 'react';
import { SchoolProfile, Language } from '../../../types';
import {
  Grid,
  Users,
  Printer,
  Sparkles,
  Layers,
  RotateCcw,
  CheckCircle2,
  HelpCircle,
  FileText,
  Building,
  UserPlus,
  Trash2,
  Maximize2
} from 'lucide-react';

interface StudentCandidate {
  id: string;
  roll: string;
  name: string;
  className: string;
}

interface DeskSeat {
  benchNo: number;
  rowNo: number;
  colNo: number;
  seats: (StudentCandidate | null)[];
}

interface RoomSeating {
  roomName: string;
  roomId: string;
  capacity: number;
  desks: DeskSeat[];
  totalAllocated: number;
  classSummary: { [className: string]: { count: number; minRoll: string; maxRoll: string } };
}

interface CustomSeatingPlanProps {
  schoolProfile: SchoolProfile;
  lang: Language;
  onBack?: () => void;
}

export const CustomSeatingPlan: React.FC<CustomSeatingPlanProps> = ({
  schoolProfile,
  lang
}) => {
  const isHi = lang === 'hi';

  // --- Configuration State ---
  const [seatingMode, setSeatingMode] = useState<'dual_alternate' | 'single' | 'triple'>('dual_alternate');
  const [pattern, setPattern] = useState<'alternate' | 'zigzag' | 'sequential'>('alternate');
  const [studentsPerBench, setStudentsPerBench] = useState<number>(2);

  // Classes setup
  const [classA, setClassA] = useState<string>('Class 10');
  const [classB, setClassB] = useState<string>('Class 12');
  const [classC, setClassC] = useState<string>('Class 9');

  // Candidate generation parameters
  const [startRollA, setStartRollA] = useState<string>('10001');
  const [countA, setCountA] = useState<number>(24);
  const [startRollB, setStartRollB] = useState<string>('12001');
  const [countB, setCountB] = useState<number>(24);

  // Room parameters
  const [roomCount, setRoomCount] = useState<number>(3);
  const [benchesPerRoom, setBenchesPerRoom] = useState<number>(10);
  const [roomPrefix, setRoomPrefix] = useState<string>(isHi ? 'कक्ष संख्या' : 'Room');

  // Custom student lists
  const [customStudentsA, setCustomStudentsA] = useState<StudentCandidate[]>([]);
  const [customStudentsB, setCustomStudentsB] = useState<StudentCandidate[]>([]);
  const [newRoll, setNewRoll] = useState<string>('');
  const [newName, setNewName] = useState<string>('');
  const [targetClass, setTargetClass] = useState<'A' | 'B'>('A');

  // View presentation mode
  const [presentationView, setPresentationView] = useState<'visual_desks' | 'door_slip' | 'master_chart'>('visual_desks');
  const [selectedRoomIndex, setSelectedRoomIndex] = useState<number>(0);
  const [examDate, setExamDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [examShift, setExamShift] = useState<'shift1' | 'shift2'>('shift1');

  // Helper default names pool
  const defaultNamesA = [
    'Rahul Sharma', 'Priya Meena', 'Amit Kumar', 'Anjali Gupta', 'Vijay Jat',
    'Neetu Choudhary', 'Deepak Saini', 'Rekha Verma', 'Rajesh Gurjar', 'Kiran Kanwar',
    'Mohan Lal', 'Sita Ram', 'Gita Sharma', 'Vikram Singh', 'Pooja Jangid',
    'Rohit Meena', 'Sunil Saini', 'Aarti Rathore', 'Dinesh Kumar', 'Mamta Devi',
    'Suresh Gurjar', 'Kavita Kumari', 'Pankaj Kumawat', 'Ritu Bhati'
  ];

  const defaultNamesB = [
    'Sanjay Sharma', 'Vikram Singh', 'Sunita Meena', 'Sita Kumari', 'Narendra Singh',
    'Manish Kumar', 'Ritu Kanwar', 'Dinesh Jat', 'Jyoti Verma', 'Ajay Saini',
    'Rameshwar Lal', 'Geeta Devi', 'Mukesh Kumar', 'Santosh Bai', 'Lokesh Sharma',
    'Anil Meena', 'Monika Soni', 'Kamal Kishore', 'Preeti Rathore', 'Gopal Jat',
    'Ashok Saini', 'Manju Choudhary', 'Vinod Meena', 'Sonu Jangir'
  ];

  // Initialize candidates when rolls/counts change
  const candidatePoolA = useMemo<StudentCandidate[]>(() => {
    if (customStudentsA.length > 0) return customStudentsA;
    const list: StudentCandidate[] = [];
    const base = parseInt(startRollA, 10) || 10001;
    for (let i = 0; i < countA; i++) {
      const rollNum = String(base + i);
      const name = defaultNamesA[i % defaultNamesA.length];
      list.push({ id: `candA-${i}`, roll: rollNum, name, className: classA });
    }
    return list;
  }, [startRollA, countA, classA, customStudentsA]);

  const candidatePoolB = useMemo<StudentCandidate[]>(() => {
    if (customStudentsB.length > 0) return customStudentsB;
    const list: StudentCandidate[] = [];
    const base = parseInt(startRollB, 10) || 12001;
    for (let i = 0; i < countB; i++) {
      const rollNum = String(base + i);
      const name = defaultNamesB[i % defaultNamesB.length];
      list.push({ id: `candB-${i}`, roll: rollNum, name, className: classB });
    }
    return list;
  }, [startRollB, countB, classB, customStudentsB]);

  // Master Seating Plan Calculation
  const roomsPlan = useMemo<RoomSeating[]>(() => {
    const rooms: RoomSeating[] = [];
    let ptrA = 0;
    let ptrB = 0;

    for (let r = 0; r < roomCount; r++) {
      const roomNum = 101 + r;
      const roomName = `${roomPrefix} ${roomNum}`;
      const desks: DeskSeat[] = [];
      const classMap: { [cls: string]: { count: number; rolls: string[] } } = {};

      for (let b = 1; b <= benchesPerRoom; b++) {
        const seats: (StudentCandidate | null)[] = [];

        if (seatingMode === 'dual_alternate') {
          // Seat 1: Class A
          const studentA = ptrA < candidatePoolA.length ? candidatePoolA[ptrA++] : null;
          seats.push(studentA);
          if (studentA) {
            if (!classMap[studentA.className]) classMap[studentA.className] = { count: 0, rolls: [] };
            classMap[studentA.className].count += 1;
            classMap[studentA.className].rolls.push(studentA.roll);
          }

          // Seat 2: Class B (if bench capacity >= 2)
          if (studentsPerBench >= 2) {
            const studentB = ptrB < candidatePoolB.length ? candidatePoolB[ptrB++] : null;
            seats.push(studentB);
            if (studentB) {
              if (!classMap[studentB.className]) classMap[studentB.className] = { count: 0, rolls: [] };
              classMap[studentB.className].count += 1;
              classMap[studentB.className].rolls.push(studentB.roll);
            }
          }
        } else {
          // Single Class Sequential or Zigzag
          for (let s = 0; s < studentsPerBench; s++) {
            const cand = ptrA < candidatePoolA.length ? candidatePoolA[ptrA++] : null;
            seats.push(cand);
            if (cand) {
              if (!classMap[cand.className]) classMap[cand.className] = { count: 0, rolls: [] };
              classMap[cand.className].count += 1;
              classMap[cand.className].rolls.push(cand.roll);
            }
          }
        }

        desks.push({
          benchNo: b,
          rowNo: Math.ceil(b / 2),
          colNo: (b % 2 === 1) ? 1 : 2,
          seats
        });
      }

      const classSummary: { [className: string]: { count: number; minRoll: string; maxRoll: string } } = {};
      Object.keys(classMap).forEach(cls => {
        const rolls = classMap[cls].rolls;
        if (rolls.length > 0) {
          classSummary[cls] = {
            count: classMap[cls].count,
            minRoll: rolls[0],
            maxRoll: rolls[rolls.length - 1]
          };
        }
      });

      const totalAllocated = desks.reduce(
        (acc, d) => acc + d.seats.filter(s => s !== null).length,
        0
      );

      rooms.push({
        roomName,
        roomId: `room-${r + 1}`,
        capacity: benchesPerRoom * studentsPerBench,
        desks,
        totalAllocated,
        classSummary
      });
    }

    return rooms;
  }, [
    roomCount,
    roomPrefix,
    benchesPerRoom,
    studentsPerBench,
    seatingMode,
    candidatePoolA,
    candidatePoolB
  ]);

  // Add individual student handler
  const handleAddCustomStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoll.trim() || !newName.trim()) return;

    if (targetClass === 'A') {
      setCustomStudentsA(prev => [
        ...prev,
        { id: `customA-${Date.now()}`, roll: newRoll.trim(), name: newName.trim(), className: classA }
      ]);
    } else {
      setCustomStudentsB(prev => [
        ...prev,
        { id: `customB-${Date.now()}`, roll: newRoll.trim(), name: newName.trim(), className: classB }
      ]);
    }
    setNewRoll('');
    setNewName('');
  };

  const handlePrint = () => {
    window.print();
  };

  const activeRoom = roomsPlan[selectedRoomIndex] || roomsPlan[0];

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 text-white p-4 sm:p-6 rounded-3xl shadow-xl border border-emerald-800/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <Grid className="w-6 h-6 text-emerald-300" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black tracking-tight flex items-center gap-2">
              <span>परीक्षा बैठक व्यवस्था जनरेटर (Custom Seating Engine)</span>
              <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-emerald-400 text-slate-950 uppercase">
                Collision-Free
              </span>
            </h2>
            <p className="text-xs text-emerald-200/80">
              {schoolProfile?.schoolName || 'राजकीय उच्च माध्यमिक विद्यालय'} • दोहरी कक्षा एकांतर क्रम, कक्ष प्रवेश द्वार पर्ची व मुख्य सूचना पट्ट चार्ट
            </p>
          </div>
        </div>

        {/* Top Print/Action Buttons */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            onClick={handlePrint}
            className="flex-1 md:flex-initial px-4 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all min-h-[44px]"
          >
            <Printer className="w-4 h-4" />
            <span>बैठक व्यवस्था प्रिंट / PDF</span>
          </button>
        </div>
      </div>

      {/* Control Panel / Options Tabs */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6 shadow-sm space-y-5">
        
        <div className="border-b border-slate-200 dark:border-slate-800 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h3 className="font-black text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>कस्टम बैठक व्यवस्था विकल्प (Customization Options)</span>
          </h3>
          <span className="text-xs text-slate-500">
            कुल नियोजित छात्र: <strong className="text-emerald-600">{candidatePoolA.length + (seatingMode === 'dual_alternate' ? candidatePoolB.length : 0)}</strong>
          </span>
        </div>

        {/* Configuration Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          
          {/* Seating Mode */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
            <label className="block font-black text-slate-700 dark:text-slate-300">
              1. बैठक पैटर्न (Arrangement Mode):
            </label>
            <select
              value={seatingMode}
              onChange={e => setSeatingMode(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 font-bold"
            >
              <option value="dual_alternate">दोहरी कक्षा एकांतर (A-B-A-B Dual)</option>
              <option value="single">एकल कक्षा क्रमानुसार (Single Class)</option>
            </select>
            <p className="text-[10px] text-slate-500">
              {seatingMode === 'dual_alternate' ? 'नकल रोकने हेतु दो अलग कक्षाओं को एक बेंच पर बैठाएं' : 'पूरी कक्षा एक ही कक्ष में क्रमानुसार'}
            </p>
          </div>

          {/* Room Configuration */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
            <label className="block font-black text-slate-700 dark:text-slate-300">
              2. कक्ष संख्या व क्षमता (Rooms & Benches):
            </label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-[10px] text-slate-500 block">कुल कक्ष:</span>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={roomCount}
                  onChange={e => setRoomCount(Math.max(1, Number(e.target.value)))}
                  className="w-full px-2.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 font-bold"
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">बेंच प्रति कक्ष:</span>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={benchesPerRoom}
                  onChange={e => setBenchesPerRoom(Math.max(1, Number(e.target.value)))}
                  className="w-full px-2.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 font-bold"
                />
              </div>
            </div>
          </div>

          {/* Students Per Bench */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
            <label className="block font-black text-slate-700 dark:text-slate-300">
              3. प्रति बेंच क्षमता (Bench Capacity):
            </label>
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setStudentsPerBench(1)}
                className={`flex-1 py-2 rounded-xl font-bold border transition-all cursor-pointer ${
                  studentsPerBench === 1
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow'
                    : 'bg-white dark:bg-slate-900 border-slate-300 text-slate-700 dark:text-slate-300'
                }`}
              >
                1 छात्र (Single)
              </button>
              <button
                type="button"
                onClick={() => setStudentsPerBench(2)}
                className={`flex-1 py-2 rounded-xl font-bold border transition-all cursor-pointer ${
                  studentsPerBench === 2
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow'
                    : 'bg-white dark:bg-slate-900 border-slate-300 text-slate-700 dark:text-slate-300'
                }`}
              >
                2 छात्र (Dual)
              </button>
            </div>
            <p className="text-[10px] text-slate-500">
              प्रत्येक कक्ष क्षमता: {benchesPerRoom * studentsPerBench} परीक्षार्थी
            </p>
          </div>

          {/* Exam Date and Shift */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
            <label className="block font-black text-slate-700 dark:text-slate-300">
              4. परीक्षा दिनांक एवं पारी:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="date"
                value={examDate}
                onChange={e => setExamDate(e.target.value)}
                className="w-full px-2 py-1.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 font-bold text-[11px]"
              />
              <select
                value={examShift}
                onChange={e => setExamShift(e.target.value as any)}
                className="w-full px-2 py-1.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 font-bold text-[11px]"
              >
                <option value="shift1">प्रथम पारी</option>
                <option value="shift2">द्वितीय पारी</option>
              </select>
            </div>
            <p className="text-[10px] text-slate-500">
              प्रवेश द्वार पर्ची पर प्रदर्शित करने हेतु
            </p>
          </div>

        </div>

        {/* Candidate Series Generator */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <h4 className="font-black text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-emerald-600" />
              <span>कक्षा एवं रोल नंबर श्रृंखला (Class & Candidate Roll Generator)</span>
            </h4>
            <span className="text-[11px] text-slate-500">
              स्वतः रोल नंबर जनरेट करें अथवा नीचे सूची से अनुकूलित करें
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Class A Name */}
            <div>
              <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">
                प्रथम कक्षा (Class A):
              </label>
              <select
                value={classA}
                onChange={e => setClassA(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 font-bold"
              >
                {['Class 10', 'Class 9', 'Class 8', 'Class 5', 'Class 12', 'Class 11', 'Class 7', 'Class 6'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Class A Start Roll & Count */}
            <div>
              <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">
                प्रारंभिक रोल नं एवं छात्र संख्या ({classA}):
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={startRollA}
                  onChange={e => setStartRollA(e.target.value)}
                  placeholder="10001"
                  className="px-2.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 font-mono font-bold"
                />
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={countA}
                  onChange={e => setCountA(Math.max(1, Number(e.target.value)))}
                  className="px-2.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 font-bold"
                />
              </div>
            </div>

            {/* Class B (if dual) */}
            {seatingMode === 'dual_alternate' && (
              <>
                <div>
                  <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">
                    द्वितीय कक्षा (Class B):
                  </label>
                  <select
                    value={classB}
                    onChange={e => setClassB(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 font-bold"
                  >
                    {['Class 12', 'Class 11', 'Class 10', 'Class 9', 'Class 8', 'Class 7', 'Class 6'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">
                    प्रारंभिक रोल नं एवं छात्र संख्या ({classB}):
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={startRollB}
                      onChange={e => setStartRollB(e.target.value)}
                      placeholder="12001"
                      className="px-2.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 font-mono font-bold"
                    />
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={countB}
                      onChange={e => setCountB(Math.max(1, Number(e.target.value)))}
                      className="px-2.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 font-bold"
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

      </div>

      {/* Mode View Switcher Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3.5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm print:hidden">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <button
            onClick={() => setPresentationView('visual_desks')}
            className={`px-4 py-2 rounded-2xl font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap min-h-[44px] ${
              presentationView === 'visual_desks'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <Grid className="w-4 h-4" />
            <span>ग्राफ़िकल डेस्क व्यू (Desk View)</span>
          </button>

          <button
            onClick={() => setPresentationView('door_slip')}
            className={`px-4 py-2 rounded-2xl font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap min-h-[44px] ${
              presentationView === 'door_slip'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>कक्ष प्रवेश द्वार पर्ची (Door Slips)</span>
          </button>

          <button
            onClick={() => setPresentationView('master_chart')}
            className={`px-4 py-2 rounded-2xl font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap min-h-[44px] ${
              presentationView === 'master_chart'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <Building className="w-4 h-4" />
            <span>मुख्य सूचना पट्ट चार्ट (Notice Board)</span>
          </button>
        </div>

        {/* Room Navigation Pill */}
        {presentationView === 'visual_desks' && (
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
            <span className="text-xs font-bold text-slate-500 whitespace-nowrap">कक्ष चुनें:</span>
            {roomsPlan.map((r, idx) => (
              <button
                key={r.roomId}
                onClick={() => setSelectedRoomIndex(idx)}
                className={`px-3 py-1 rounded-xl text-xs font-black cursor-pointer whitespace-nowrap ${
                  selectedRoomIndex === idx
                    ? 'bg-slate-900 text-white dark:bg-emerald-400 dark:text-slate-950 shadow'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                {r.roomName} ({r.totalAllocated})
              </button>
            ))}
          </div>
        )}
      </div>

      {/* VIEW 1: GRAPHICAL VISUAL DESKS VIEW */}
      {presentationView === 'visual_desks' && activeRoom && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6 shadow-xl space-y-6">
          
          {/* Room Header Info */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100">
                  🏛️ {activeRoom.roomName}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                  आवंटित: {activeRoom.totalAllocated} / {activeRoom.capacity} सीट
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {Object.keys(activeRoom.classSummary).map(c => (
                  <span key={c} className="mr-3 font-semibold">
                    • {c}: {activeRoom.classSummary[c].count} छात्र (रोल {activeRoom.classSummary[c].minRoll} - {activeRoom.classSummary[c].maxRoll})
                  </span>
                ))}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold px-3 py-1 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-800 dark:text-amber-200 border border-amber-300">
                ब्लेकबोर्ड / शिक्षक टेबल (Blackboard Front)
              </span>
            </div>
          </div>

          {/* Blackboard Area Indicator */}
          <div className="w-full py-2 bg-slate-800 text-slate-200 text-center rounded-2xl font-bold text-xs shadow-inner tracking-widest uppercase">
            ◄─── परीक्षा कक्ष का मुख्य फलक / शिक्षक मंच (STAGE / BLACKBOARD) ───►
          </div>

          {/* Desk Grid Display */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {activeRoom.desks.map(desk => (
              <div
                key={desk.benchNo}
                className="bg-slate-50 dark:bg-slate-800/80 rounded-2xl border-2 border-slate-300 dark:border-slate-700 p-3 space-y-2.5 shadow-sm hover:shadow-md transition-all relative"
              >
                {/* Desk Label */}
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-1.5">
                  <span className="text-xs font-black text-slate-800 dark:text-slate-200 flex items-center gap-1">
                    🪑 बेंच #{desk.benchNo}
                  </span>
                  <span className="text-[10px] font-bold text-slate-500">
                    पंक्ति {desk.rowNo}
                  </span>
                </div>

                {/* Seats on this desk */}
                <div className="grid grid-cols-2 gap-2">
                  {/* Seat 1 */}
                  <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-sky-300 dark:border-sky-800 text-center space-y-0.5">
                    <span className="px-1.5 py-0.5 rounded bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 font-extrabold text-[9px] block uppercase">
                      सीट 1 • {desk.seats[0]?.className || classA}
                    </span>
                    {desk.seats[0] ? (
                      <>
                        <span className="font-black font-mono text-slate-950 dark:text-slate-50 text-xs block">
                          {desk.seats[0].roll}
                        </span>
                        <span className="text-[10px] text-slate-600 dark:text-slate-400 block truncate font-medium">
                          {desk.seats[0].name}
                        </span>
                      </>
                    ) : (
                      <span className="text-[10px] text-slate-400 italic block py-1">रिक्त</span>
                    )}
                  </div>

                  {/* Seat 2 */}
                  {studentsPerBench >= 2 && (
                    <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-purple-300 dark:border-purple-800 text-center space-y-0.5">
                      <span className="px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 font-extrabold text-[9px] block uppercase">
                        सीट 2 • {desk.seats[1]?.className || classB}
                      </span>
                      {desk.seats[1] ? (
                        <>
                          <span className="font-black font-mono text-slate-950 dark:text-slate-50 text-xs block">
                            {desk.seats[1].roll}
                          </span>
                          <span className="text-[10px] text-slate-600 dark:text-slate-400 block truncate font-medium">
                            {desk.seats[1].name}
                          </span>
                        </>
                      ) : (
                        <span className="text-[10px] text-slate-400 italic block py-1">रिक्त</span>
                      )}
                    </div>
                  )}
                </div>

              </div>
            ))}
          </div>

        </div>
      )}

      {/* VIEW 2: ROOM DOOR SLIPS (Print-optimized) */}
      {presentationView === 'door_slip' && (
        <div className="space-y-6">
          <div className="p-3.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 rounded-2xl text-xs text-amber-900 dark:text-amber-200 flex items-center justify-between print:hidden">
            <span>
              💡 <strong>प्रवेश द्वार पर्ची:</strong> इन्हें प्रिंट करके प्रत्येक परीक्षा कक्ष के मुख्य दरवाजे पर चस्पा किया जा सकता है।
            </span>
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold cursor-pointer"
            >
              प्रिंट करें
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {roomsPlan.map(room => (
              <div
                key={room.roomId}
                className="bg-white text-slate-900 p-6 rounded-3xl border-2 border-slate-800 shadow-lg space-y-4 font-serif break-inside-avoid"
              >
                {/* Slip Header */}
                <div className="text-center border-b-2 border-slate-900 pb-3 space-y-1">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
                    कार्यालय पंचायत प्रारंभिक शिक्षा अधिकारी (PEEO) एवं प्रधानाचार्य
                  </h4>
                  <h2 className="text-base font-black text-slate-950">
                    {schoolProfile?.schoolName || 'राजकीय उच्च माध्यमिक विद्यालय'}
                  </h2>
                  <div className="inline-block px-4 py-1 rounded-full bg-slate-100 border border-slate-900 text-xs font-black uppercase mt-1">
                    🚪 कक्ष प्रवेश द्वार बैठक सूची (Door Slip)
                  </div>
                </div>

                {/* Details Bar */}
                <div className="grid grid-cols-2 gap-2 text-xs border-b border-slate-300 pb-2">
                  <div>
                    <span className="text-slate-500">कक्ष का नाम:</span>
                    <strong className="block text-sm text-slate-950">{room.roomName}</strong>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-500">परीक्षा दिनांक:</span>
                    <strong className="block font-mono">{examDate} ({examShift === 'shift1' ? 'प्रथम पारी' : 'द्वितीय पारी'})</strong>
                  </div>
                </div>

                {/* Roll Number Ranges Box */}
                <div className="p-3 bg-slate-50 border border-slate-800 rounded-xl space-y-2 text-xs">
                  <span className="font-black block text-slate-900 uppercase">
                    आवंटित अनुक्रमांक विवरण (Allocated Roll Numbers):
                  </span>
                  <div className="space-y-1.5">
                    {Object.keys(room.classSummary).map(c => (
                      <div key={c} className="flex justify-between items-center bg-white p-2 rounded-lg border border-slate-300">
                        <span className="font-extrabold text-slate-800">{c}:</span>
                        <span className="font-mono font-black text-slate-950">
                          {room.classSummary[c].minRoll} से {room.classSummary[c].maxRoll}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-800 font-bold text-[10px]">
                          कुल {room.classSummary[c].count}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mini Desk Roll Table */}
                <div className="overflow-x-auto max-h-56 overflow-y-auto border border-slate-300 rounded-xl">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-100 font-bold border-b border-slate-300 text-[11px]">
                        <th className="p-1.5 w-16">बेंच सं.</th>
                        <th className="p-1.5">सीट 1 ({classA})</th>
                        {studentsPerBench >= 2 && <th className="p-1.5">सीट 2 ({classB})</th>}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {room.desks.map(d => (
                        <tr key={d.benchNo}>
                          <td className="p-1.5 font-bold">#{d.benchNo}</td>
                          <td className="p-1.5 font-mono">
                            {d.seats[0]?.roll || '-'} {d.seats[0]?.name ? `(${d.seats[0].name})` : ''}
                          </td>
                          {studentsPerBench >= 2 && (
                            <td className="p-1.5 font-mono">
                              {d.seats[1]?.roll || '-'} {d.seats[1]?.name ? `(${d.seats[1].name})` : ''}
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Footer Signatures */}
                <div className="pt-4 flex justify-between items-end text-xs font-bold border-t border-slate-300">
                  <div className="text-center">
                    <p className="border-t border-dashed border-slate-400 pt-1">परीक्षा प्रभारी</p>
                  </div>
                  <div className="text-center">
                    <p className="border-t border-dashed border-slate-400 pt-1">पीईईओ / प्रधानाचार्य</p>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 3: MASTER SEATING NOTICE BOARD CHART */}
      {presentationView === 'master_chart' && (
        <div className="bg-white text-slate-900 p-6 sm:p-10 rounded-3xl border border-slate-300 shadow-2xl space-y-6 font-serif max-w-4xl mx-auto print:border-none print:shadow-none print:p-0 print:max-w-none">
          
          {/* Header */}
          <div className="text-center border-b-2 border-slate-900 pb-4 space-y-1">
            <h4 className="font-bold text-xs uppercase tracking-widest text-slate-700">
              कार्यालय पंचायत प्रारंभिक शिक्षा अधिकारी (PEEO) एवं प्रधानाचार्य
            </h4>
            <h1 className="text-lg sm:text-xl font-black text-slate-950 tracking-tight">
              {schoolProfile?.schoolName || 'राजकीय उच्च माध्यमिक विद्यालय'}
            </h1>
            <p className="text-xs font-bold text-slate-800">
              यू-डाइज कोड: <span className="font-mono">{schoolProfile?.udiseCode || '08123456789'}</span> • सत्र: 2026-2027
            </p>
            <div className="inline-block px-5 py-1 rounded-full bg-slate-100 border border-slate-900 text-xs font-black uppercase tracking-wider mt-2">
              📋 मुख्य सूचना पट्ट बैठक व्यवस्था चार्ट (Master Seating Chart)
            </div>
          </div>

          {/* Details */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs border-b border-slate-300 pb-2">
            <div>
              <span>परीक्षा दिनांक:</span> <strong>{examDate}</strong>
            </div>
            <div>
              <span>परीक्षा पारी:</span> <strong>{examShift === 'shift1' ? 'प्रथम पारी (Shift 1)' : 'द्वितीय पारी (Shift 2)'}</strong>
            </div>
            <div>
              <span>कुल परीक्षा कक्ष:</span> <strong>{roomCount} कक्ष</strong>
            </div>
          </div>

          {/* Master Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-slate-900 text-xs text-left">
              <thead>
                <tr className="bg-slate-100 text-slate-950 font-black border-b border-slate-900">
                  <th className="p-2 border border-slate-900 w-12 text-center">क्र.</th>
                  <th className="p-2 border border-slate-900 w-32">कक्ष का नाम</th>
                  <th className="p-2 border border-slate-900 w-24">कक्षा</th>
                  <th className="p-2 border border-slate-900">अनुक्रमांक (Roll No Range)</th>
                  <th className="p-2 border border-slate-900 w-24 text-center">छात्र संख्या</th>
                  <th className="p-2 border border-slate-900 w-32">वीक्षक हस्ताक्षर</th>
                </tr>
              </thead>
              <tbody>
                {roomsPlan.map((r, idx) => {
                  const classes = Object.keys(r.classSummary);
                  if (classes.length === 0) {
                    return (
                      <tr key={r.roomId} className="border-b border-slate-300">
                        <td className="p-2 border border-slate-900 text-center">{idx + 1}</td>
                        <td className="p-2 border border-slate-900 font-bold">{r.roomName}</td>
                        <td colSpan={4} className="p-2 border border-slate-900 text-center text-slate-500">
                          कोई परीक्षार्थी आवंटित नहीं
                        </td>
                      </tr>
                    );
                  }

                  return classes.map((cls, cIdx) => (
                    <tr key={`${r.roomId}-${cls}`} className="border-b border-slate-300">
                      {cIdx === 0 && (
                        <>
                          <td rowSpan={classes.length} className="p-2 border border-slate-900 text-center font-bold">
                            {idx + 1}
                          </td>
                          <td rowSpan={classes.length} className="p-2 border border-slate-900 font-black text-slate-950">
                            {r.roomName}
                            <div className="text-[10px] text-slate-500 font-normal">
                              कुल: {r.totalAllocated} छात्र
                            </div>
                          </td>
                        </>
                      )}
                      <td className="p-2 border border-slate-900 font-bold text-slate-900">{cls}</td>
                      <td className="p-2 border border-slate-900 font-mono font-bold">
                        {r.classSummary[cls].minRoll} से {r.classSummary[cls].maxRoll}
                      </td>
                      <td className="p-2 border border-slate-900 text-center font-bold">
                        {r.classSummary[cls].count}
                      </td>
                      {cIdx === 0 && (
                        <td rowSpan={classes.length} className="p-2 border border-slate-900 text-center text-slate-400">
                          हस्ताक्षर
                        </td>
                      )}
                    </tr>
                  ));
                })}
              </tbody>
            </table>
          </div>

          {/* Student Instructions */}
          <div className="p-3 bg-slate-50 border border-slate-300 rounded-xl space-y-1 text-[11px]">
            <strong className="block text-slate-900">परीक्षार्थियों हेतु आवश्यक सूचना:</strong>
            <ul className="list-disc pl-4 space-y-0.5 text-slate-700">
              <li>परीक्षार्थी मुख्य द्वार पर चस्पा इस बैठक चार्ट के अनुसार अपने निर्धारित कक्ष में ही स्थान ग्रहण करें।</li>
              <li>अपनी निर्धारित बेंच संख्या व रोल नंबर की जांच अवश्य कर लें।</li>
            </ul>
          </div>

          {/* Signatures */}
          <div className="pt-8 flex justify-between items-end text-xs font-bold text-slate-900">
            <div className="text-center space-y-1">
              <div className="w-36 h-10 border-b border-dashed border-slate-400 mx-auto"></div>
              <p>हस्ताक्षर परीक्षा प्रभारी</p>
            </div>

            <div className="text-center space-y-1">
              <div className="w-40 h-10 border-b border-dashed border-slate-400 mx-auto"></div>
              <p>हस्ताक्षर पीईईओ / प्रधानाचार्य मय मोहर</p>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
