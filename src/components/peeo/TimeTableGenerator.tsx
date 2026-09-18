import React, { useState } from 'react';
import { SchoolProfile, Teacher, Language } from '../../types';
import { generateTimeTablePdf, generateTeacherTimeTablePdf, generateMasterTimeTablePdf } from '../../utils/pdfGenerator';
import { PeeoOfficialLetterhead } from './PeeoOfficialLetterhead';
import {
  Calendar,
  Clock,
  User,
  Plus,
  Trash2,
  Download,
  AlertTriangle,
  CheckCircle2,
  BookOpen,
  Printer,
  ShieldAlert,
  Users,
  Grid
} from 'lucide-react';

interface TimeTableGeneratorProps {
  schoolProfile: SchoolProfile;
  teachers: Teacher[];
  lang: Language;
}

interface PeriodSlot {
  id: string;
  periodNumber: number;
  timeSlot: string;
  subject: string;
  teacherId: string;
  roomNo: string;
}

export const TimeTableGenerator: React.FC<TimeTableGeneratorProps> = ({
  schoolProfile,
  teachers,
  lang
}) => {
  const [selectedClass, setSelectedClass] = useState('Class 10-A');
  const [viewMode, setViewMode] = useState<'class' | 'teacher' | 'master'>('class');
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>(teachers[0]?.id || '');
  const [exportLang, setExportLang] = useState<Language>(lang);

  // Class Teachers Mapping: className -> teacherId
  const [classTeachers, setClassTeachers] = useState<Record<string, string>>({
    'Class 6-A': teachers[0]?.id || '',
    'Class 7-A': teachers[1]?.id || '',
    'Class 8-A': teachers[2]?.id || '',
    'Class 9-A': teachers[3]?.id || '',
    'Class 10-A': teachers[1]?.id || '',
    'Class 11-A': teachers[4]?.id || '',
    'Class 12-A': teachers[0]?.id || ''
  });

  // Timetable State key-value: className -> array of PeriodSlot
  const [timetables, setTimetables] = useState<Record<string, PeriodSlot[]>>({
    'Class 6-A': [
      { id: 'c6-p1', periodNumber: 1, timeSlot: '10:00 AM - 10:45 AM', subject: 'Hindi', teacherId: teachers[0]?.id || '', roomNo: 'Room 101' },
      { id: 'c6-p2', periodNumber: 2, timeSlot: '10:45 AM - 11:30 AM', subject: 'English', teacherId: teachers[3]?.id || '', roomNo: 'Room 101' },
      { id: 'c6-p3', periodNumber: 3, timeSlot: '11:30 AM - 12:15 PM', subject: 'Mathematics', teacherId: teachers[1]?.id || '', roomNo: 'Room 101' },
      { id: 'c6-p4', periodNumber: 4, timeSlot: '12:15 PM - 01:00 PM', subject: 'Science', teacherId: teachers[2]?.id || '', roomNo: 'Room 101' }
    ],
    'Class 9-A': [
      { id: 'c9-p1', periodNumber: 1, timeSlot: '10:00 AM - 10:45 AM', subject: 'English', teacherId: teachers[3]?.id || '', roomNo: 'Room 104' },
      { id: 'c9-p2', periodNumber: 2, timeSlot: '10:45 AM - 11:30 AM', subject: 'Science', teacherId: teachers[2]?.id || '', roomNo: 'Room 104' },
      { id: 'c9-p3', periodNumber: 3, timeSlot: '11:30 AM - 12:15 PM', subject: 'Social Science', teacherId: teachers[4]?.id || '', roomNo: 'Room 104' }
    ],
    'Class 10-A': [
      { id: 'p1', periodNumber: 1, timeSlot: '10:00 AM - 10:45 AM', subject: 'Hindi', teacherId: teachers[0]?.id || '', roomNo: 'Room 105' },
      { id: 'p2', periodNumber: 2, timeSlot: '10:45 AM - 11:30 AM', subject: 'Mathematics', teacherId: teachers[1]?.id || '', roomNo: 'Room 105' },
      { id: 'p3', periodNumber: 3, timeSlot: '11:30 AM - 12:15 PM', subject: 'Science', teacherId: teachers[2]?.id || '', roomNo: 'Room 105' },
      { id: 'p4', periodNumber: 4, timeSlot: '12:15 PM - 01:00 PM', subject: 'English', teacherId: teachers[3]?.id || '', roomNo: 'Room 105' },
      { id: 'p5', periodNumber: 5, timeSlot: '01:30 PM - 02:15 PM', subject: 'Social Science', teacherId: teachers[4]?.id || '', roomNo: 'Room 105' },
      { id: 'p6', periodNumber: 6, timeSlot: '02:15 PM - 03:00 PM', subject: 'Sanskrit', teacherId: teachers[0]?.id || '', roomNo: 'Room 105' }
    ]
  });

  const availableClasses = ['Class 6-A', 'Class 7-A', 'Class 8-A', 'Class 9-A', 'Class 10-A', 'Class 11-A', 'Class 12-A'];

  const currentSchedule = timetables[selectedClass] || [];

  // Calculate teacher daily workload (total periods assigned across all classes)
  const teacherWorkloadMap: Record<string, number> = {};
  (Object.values(timetables) as PeriodSlot[][]).forEach(slots => {
    slots.forEach(s => {
      if (s.teacherId) {
        teacherWorkloadMap[s.teacherId] = (teacherWorkloadMap[s.teacherId] || 0) + 1;
      }
    });
  });

  // Smart Collision Detection Logic: Check if a teacher is double-booked in the same period number across different classes
  const collisions: { teacherName: string; periodNumber: number; classes: string[] }[] = [];
  const periodTeacherOccupancy: Record<number, Record<string, string[]>> = {};

  (Object.entries(timetables) as [string, PeriodSlot[]][]).forEach(([cls, slots]) => {
    slots.forEach(slot => {
      if (!slot.teacherId) return;
      if (!periodTeacherOccupancy[slot.periodNumber]) {
        periodTeacherOccupancy[slot.periodNumber] = {};
      }
      if (!periodTeacherOccupancy[slot.periodNumber][slot.teacherId]) {
        periodTeacherOccupancy[slot.periodNumber][slot.teacherId] = [];
      }
      periodTeacherOccupancy[slot.periodNumber][slot.teacherId].push(cls);
    });
  });

  Object.entries(periodTeacherOccupancy).forEach(([periodStr, teacherMap]) => {
    const periodNumber = Number(periodStr);
    Object.entries(teacherMap).forEach(([tId, classesList]) => {
      if (classesList.length > 1) {
        const tObj = teachers.find(t => t.id === tId);
        collisions.push({
          teacherName: tObj?.name || 'Teacher',
          periodNumber,
          classes: classesList
        });
      }
    });
  });

  const handleUpdateSlot = (id: string, field: keyof PeriodSlot, value: any) => {
    const updated = currentSchedule.map(s => s.id === id ? { ...s, [field]: value } : s);
    setTimetables({ ...timetables, [selectedClass]: updated });
  };

  const handleAddSlot = () => {
    const nextPeriod = currentSchedule.length + 1;
    const newSlot: PeriodSlot = {
      id: `p-${Date.now()}`,
      periodNumber: nextPeriod,
      timeSlot: `Period ${nextPeriod}`,
      subject: 'General Subject',
      teacherId: teachers[0]?.id || '',
      roomNo: 'Main Hall'
    };
    setTimetables({ ...timetables, [selectedClass]: [...currentSchedule, newSlot] });
  };

  const handleRemoveSlot = (id: string) => {
    const updated = currentSchedule.filter(s => s.id !== id);
    setTimetables({ ...timetables, [selectedClass]: updated });
  };

  // PDF Export Handlers
  const handleExportClassPdf = () => {
    const classTeacherObj = teachers.find(t => t.id === classTeachers[selectedClass]);
    const pdfData = currentSchedule.map(s => {
      const tObj = teachers.find(t => t.id === s.teacherId);
      return {
        period: s.periodNumber,
        subject: s.subject,
        teacherName: tObj ? `${tObj.name} (${tObj.designation})` : 'Unassigned',
        roomNo: s.roomNo
      };
    });
    generateTimeTablePdf(
      schoolProfile,
      `${selectedClass} (Class Teacher: ${classTeacherObj?.name || 'Unassigned'})`,
      pdfData
    );
  };

  const handleExportTeacherPdf = () => {
    const tObj = teachers.find(t => t.id === selectedTeacherId);
    if (!tObj) return;

    const teacherSchedule: { period: number; className: string; subject: string; roomNo?: string }[] = [];
    (Object.entries(timetables) as [string, PeriodSlot[]][]).forEach(([cls, slots]) => {
      slots.forEach(s => {
        if (s.teacherId === selectedTeacherId) {
          teacherSchedule.push({
            period: s.periodNumber,
            className: cls,
            subject: s.subject,
            roomNo: s.roomNo
          });
        }
      });
    });
    teacherSchedule.sort((a, b) => a.period - b.period);

    generateTeacherTimeTablePdf(schoolProfile, tObj.name, tObj.designation, teacherSchedule);
  };

  const handleExportMasterPdf = () => {
    const matrix: Record<string, Record<number, { subject: string; teacherName: string }>> = {};
    availableClasses.forEach(cls => {
      matrix[cls] = {};
      const slots = timetables[cls] || [];
      slots.forEach(s => {
        const tObj = teachers.find(t => t.id === s.teacherId);
        matrix[cls][s.periodNumber] = {
          subject: s.subject,
          teacherName: tObj?.name || 'Unassigned'
        };
      });
    });

    generateMasterTimeTablePdf(schoolProfile, availableClasses, 8, matrix);
  };

  // Direct Print Trigger
  const handlePrint = () => {
    window.print();
  };

  const assignedClassTeacherObj = teachers.find(t => t.id === classTeachers[selectedClass]);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 shadow-lg border border-slate-200 dark:border-slate-800 space-y-4">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
              Smart Generator
            </span>
            <span className="text-[11px] font-semibold text-slate-500">
              Session 2026-27
            </span>
          </div>
          <h3 className="font-black text-base sm:text-lg text-slate-900 dark:text-slate-100 flex items-center gap-2 mt-0.5">
            <Calendar className="w-5 h-5 text-emerald-600" />
            <span>{lang === 'hi' ? 'स्मार्ट विद्यालय समय-सारणी जनरेटर' : 'Premium School Timetable Generator'}</span>
          </h3>
          <p className="text-xs text-slate-500">
            {lang === 'hi'
              ? 'कक्षावार, शिक्षकवार एवं मास्टर मैट्रिक्स शेड्यूलिंग व ऑटो-टकराव चेकर'
              : 'Class-wise, teacher-wise & master matrix scheduling with smart conflict detection'}
          </p>
        </div>

        {/* Top Actions */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handlePrint}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center space-x-1.5 border border-slate-300 dark:border-slate-700 transition-colors"
            title="Print Current View"
          >
            <Printer className="w-4 h-4 text-slate-600 dark:text-slate-300" />
            <span className="hidden xs:inline">Print</span>
          </button>

          {viewMode === 'class' && (
            <button
              onClick={handleExportClassPdf}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center space-x-1.5 shadow-sm transition-all"
            >
              <Download className="w-4 h-4 text-amber-300" />
              <span>Class PDF</span>
            </button>
          )}

          {viewMode === 'teacher' && (
            <button
              onClick={handleExportTeacherPdf}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center space-x-1.5 shadow-sm transition-all"
            >
              <Download className="w-4 h-4 text-amber-300" />
              <span>Teacher PDF</span>
            </button>
          )}

          {viewMode === 'master' && (
            <button
              onClick={handleExportMasterPdf}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center space-x-1.5 shadow-sm transition-all"
            >
              <Download className="w-4 h-4 text-amber-300" />
              <span>Master Matrix PDF</span>
            </button>
          )}
        </div>
      </div>

      {/* Collision Conflict Alert Banner */}
      {collisions.length > 0 && (
        <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 space-y-1.5 animate-pulse">
          <div className="flex items-center space-x-2 text-rose-800 dark:text-rose-200 font-bold text-xs">
            <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
            <span>Schedule Conflict Warning detected ({collisions.length} Collisions)</span>
          </div>
          <ul className="text-[11px] text-rose-700 dark:text-rose-300 space-y-1 pl-6 list-disc font-medium">
            {collisions.map((col, idx) => (
              <li key={idx}>
                <strong>{col.teacherName}</strong> is assigned to multiple classes simultaneously in <strong>Period #{col.periodNumber}</strong>: {col.classes.join(', ')}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* View Mode Tabs */}
      <div className="grid grid-cols-3 gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs font-bold">
        <button
          onClick={() => setViewMode('class')}
          className={`py-2 rounded-xl transition-all flex items-center justify-center space-x-1.5 ${
            viewMode === 'class'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Class-Wise</span>
        </button>

        <button
          onClick={() => setViewMode('teacher')}
          className={`py-2 rounded-xl transition-all flex items-center justify-center space-x-1.5 ${
            viewMode === 'teacher'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>Teacher Schedule</span>
        </button>

        <button
          onClick={() => setViewMode('master')}
          className={`py-2 rounded-xl transition-all flex items-center justify-center space-x-1.5 ${
            viewMode === 'master'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Grid className="w-3.5 h-3.5" />
          <span>Master Matrix</span>
        </button>
      </div>

      {/* MODE 1: CLASS-WISE TIMETABLE */}
      {viewMode === 'class' && (
        <div className="space-y-4">
          
          {/* Class Select & Class Teacher Assignment Bar */}
          <div className="p-3.5 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                Select Class Section:
              </label>
              <select
                value={selectedClass}
                onChange={e => setSelectedClass(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-slate-800 dark:text-slate-200"
              >
                {availableClasses.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                Designated Class Teacher (कक्षाध्यापक):
              </label>
              <select
                value={classTeachers[selectedClass] || ''}
                onChange={e => setClassTeachers({ ...classTeachers, [selectedClass]: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-emerald-800 dark:text-emerald-300"
              >
                <option value="">-- Assign Class Teacher --</option>
                {teachers.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.designation})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Class Header Information Card */}
          <div className="p-3 rounded-2xl bg-slate-900 text-white flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                Active Class Schedule
              </span>
              <h4 className="font-black text-lg text-white">
                {selectedClass}
              </h4>
              <p className="text-xs text-slate-300">
                Class Teacher: <strong className="text-amber-300">{assignedClassTeacherObj ? assignedClassTeacherObj.name : 'Not Assigned'}</strong> ({assignedClassTeacherObj?.designation || ''})
              </p>
            </div>
            <div className="text-right">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-400 text-slate-950">
                {currentSchedule.length} Periods Daily
              </span>
            </div>
          </div>

          {/* Slots List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-xs text-slate-700 dark:text-slate-300">
                Period Schedule
              </h4>
              <button
                onClick={handleAddSlot}
                className="px-3 py-1 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Period</span>
              </button>
            </div>

            <div className="space-y-2">
              {currentSchedule.map((slot) => {
                const assignedT = teachers.find(t => t.id === slot.teacherId);
                const hasCollision = collisions.some(
                  c => c.periodNumber === slot.periodNumber && c.classes.includes(selectedClass) && c.teacherName === assignedT?.name
                );

                return (
                  <div
                    key={slot.id}
                    className={`p-3 rounded-2xl border transition-all ${
                      hasCollision
                        ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800'
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-emerald-300'
                    } space-y-2 text-xs`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="w-6 h-6 rounded-lg bg-emerald-800 text-amber-300 font-black flex items-center justify-center text-xs">
                          {slot.periodNumber}
                        </span>
                        <span className="font-extrabold text-slate-800 dark:text-slate-200">
                          Period #{slot.periodNumber}
                        </span>
                        {hasCollision && (
                          <span className="px-2 py-0.5 rounded bg-rose-600 text-white text-[10px] font-bold">
                            Teacher Collision Alert!
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => handleRemoveSlot(slot.id)}
                        className="text-rose-500 hover:text-rose-700 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div>
                        <label className="block text-[10px] text-slate-500 font-semibold mb-0.5">Subject</label>
                        <input
                          type="text"
                          value={slot.subject}
                          onChange={e => handleUpdateSlot(slot.id, 'subject', e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold text-slate-800 dark:text-slate-200"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] text-slate-500 font-semibold mb-0.5">Assigned Subject Teacher</label>
                        <select
                          value={slot.teacherId}
                          onChange={e => handleUpdateSlot(slot.id, 'teacherId', e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold text-slate-800 dark:text-slate-200"
                        >
                          <option value="">-- Unassigned --</option>
                          {teachers.map(t => (
                            <option key={t.id} value={t.id}>
                              {t.name} ({t.subject})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] text-slate-500 font-semibold mb-0.5">Room Number</label>
                        <input
                          type="text"
                          value={slot.roomNo}
                          onChange={e => handleUpdateSlot(slot.id, 'roomNo', e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold text-slate-800 dark:text-slate-200"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* MODE 2: TEACHER INDIVIDUAL SCHEDULE & WORKLOAD MONITOR */}
      {viewMode === 'teacher' && (
        <div className="space-y-4">
          
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                Select Teacher to View Complete Daily Schedule:
              </label>
              <select
                value={selectedTeacherId}
                onChange={e => setSelectedTeacherId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-extrabold text-slate-800 dark:text-slate-100"
              >
                {teachers.map(t => {
                  const count = teacherWorkloadMap[t.id] || 0;
                  return (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.designation} - {t.subject}) • Workload: {count} Periods/day
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Teacher Workload Stats */}
            {(() => {
              const selectedT = teachers.find(t => t.id === selectedTeacherId);
              const count = teacherWorkloadMap[selectedTeacherId] || 0;
              const maxLimit = 6; // Recommended Rajasthan Education Department standard daily period load limit

              return (
                <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 flex items-center justify-between text-xs">
                  <div>
                    <h4 className="font-extrabold text-slate-800 dark:text-slate-100">
                      {selectedT?.name} ({selectedT?.designation})
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Subject: {selectedT?.subject} • Employee ID: {selectedT?.employeeId}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`px-2.5 py-1 rounded-full font-black text-xs ${
                      count > maxLimit
                        ? 'bg-rose-500 text-white'
                        : count === maxLimit
                        ? 'bg-amber-400 text-slate-950'
                        : 'bg-emerald-800 text-white'
                    }`}>
                      {count} / {maxLimit} Periods
                    </span>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      {count > maxLimit ? 'Overloaded' : 'Normal Load'}
                    </p>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Assigned Periods List */}
          <div className="space-y-2">
            <h4 className="font-bold text-xs text-slate-700 dark:text-slate-300">
              Assigned Classes for Selected Teacher
            </h4>

            {(() => {
              const teacherAssignments: { className: string; periodNumber: number; subject: string; roomNo: string }[] = [];
              (Object.entries(timetables) as [string, PeriodSlot[]][]).forEach(([cls, slots]) => {
                slots.forEach(s => {
                  if (s.teacherId === selectedTeacherId) {
                    teacherAssignments.push({
                      className: cls,
                      periodNumber: s.periodNumber,
                      subject: s.subject,
                      roomNo: s.roomNo
                    });
                  }
                });
              });
              teacherAssignments.sort((a, b) => a.periodNumber - b.periodNumber);

              if (teacherAssignments.length === 0) {
                return (
                  <div className="p-4 text-center text-slate-500 text-xs bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
                    No period slots currently assigned to this teacher across any class.
                  </div>
                );
              }

              return (
                <div className="space-y-2">
                  {teacherAssignments.map((item, idx) => (
                    <div key={idx} className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs shadow-xs">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-xl bg-emerald-800 text-amber-300 font-black flex items-center justify-center text-xs">
                          P{item.periodNumber}
                        </div>
                        <div>
                          <div className="font-bold text-slate-800 dark:text-slate-100">
                            {item.className} — {item.subject}
                          </div>
                          <div className="text-[10px] text-slate-500">
                            Room: {item.roomNo || 'Main Classroom'}
                          </div>
                        </div>
                      </div>

                      <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                        Assigned
                      </span>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>

        </div>
      )}

      {/* MODE 3: MASTER SCHOOL-WISE COMPLETE MATRIX */}
      {viewMode === 'master' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200">
                Master School Timetable Grid (All Classes)
              </h4>
              <p className="text-[11px] text-slate-500">
                Consolidated overview across all classes & periods
              </p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-[11px]">
              <thead className="bg-slate-900 text-white font-bold border-b border-slate-800">
                <tr>
                  <th className="p-2.5 border-r border-slate-800 shrink-0 min-w-[80px]">Class</th>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(p => (
                    <th key={p} className="p-2 text-center border-r border-slate-800 min-w-[100px]">
                      Period {p}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900 font-medium text-slate-800 dark:text-slate-200">
                {availableClasses.map(cls => (
                  <tr key={cls} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="p-2.5 font-black bg-slate-100 dark:bg-slate-800/80 border-r border-slate-200 dark:border-slate-700">
                      {cls}
                    </td>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(periodNum => {
                      const slots = timetables[cls] || [];
                      const slot = slots.find(s => s.periodNumber === periodNum);
                      const tObj = teachers.find(t => t.id === slot?.teacherId);

                      return (
                        <td key={periodNum} className="p-2 border-r border-slate-200 dark:border-slate-800 text-center">
                          {slot ? (
                            <div className="p-1 rounded bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 space-y-0.5">
                              <div className="font-bold text-emerald-900 dark:text-emerald-200 text-[10px]">
                                {slot.subject}
                              </div>
                              <div className="text-[9px] text-slate-600 dark:text-slate-400 font-semibold truncate">
                                {tObj?.name || 'Unassigned'}
                              </div>
                            </div>
                          ) : (
                            <span className="text-slate-400 dark:text-slate-600 text-[10px] italic">Free</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Official Government Letterhead Sheet View */}
      <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-black uppercase text-slate-500 tracking-wider">
            {exportLang === 'hi' ? 'आधिकारिक लेटरहेड दस्तावेज प्रारूप' : 'Official Letterhead Document Layout'}
          </span>
        </div>

        <PeeoOfficialLetterhead
          schoolProfile={schoolProfile}
          subjectHindi={`विद्यालय समय-सारणी अनुमोदन सत्र 2026-27 (${viewMode === 'class' ? selectedClass : viewMode === 'teacher' ? 'शिक्षक शेड्यूलिंग' : 'मास्टर मैट्रिक्स'})`}
          subjectEnglish={`Approval of School Timetable Session 2026-27 (${viewMode === 'class' ? selectedClass : viewMode === 'teacher' ? 'Teacher Schedule' : 'Master Matrix'})`}
          exportLang={exportLang}
          onExportLangChange={setExportLang}
          onDownloadPdf={viewMode === 'class' ? handleExportClassPdf : viewMode === 'teacher' ? handleExportTeacherPdf : handleExportMasterPdf}
          onPrint={handlePrint}
        >
          <div className="space-y-4 text-xs font-medium text-slate-800 dark:text-slate-200">
            <p className="leading-relaxed">
              {exportLang === 'hi'
                ? `उपरोक्त विषयान्तर्गत लेख है कि सत्र 2026-27 हेतु विद्यालय की ${
                    viewMode === 'class' ? `कक्षा ${selectedClass}` : viewMode === 'teacher' ? 'शिक्षकवार' : 'समस्त कक्षाओं की मास्टर'
                  } समय-सारणी एतद्द्वारा अनुमोदित की जाती है। समस्त संबंधित संकाय/शिक्षक निर्धारित समय-सारणी अनुसार अध्यापन कार्य सुनिश्चित करेंगे।`
                : `With reference to the above subject, the school timetable for ${
                    viewMode === 'class' ? selectedClass : viewMode === 'teacher' ? 'Teacher Schedule' : 'Master Matrix'
                  } for Session 2026-27 is hereby approved. All concerned teaching staff shall follow this schedule strictly.`}
            </p>

            {/* Render Current Table Preview */}
            {viewMode === 'class' && (
              <table className="w-full text-left border border-slate-300 dark:border-slate-700">
                <thead className="bg-slate-100 dark:bg-slate-800 font-bold border-b">
                  <tr>
                    <th className="p-2 border-r">{exportLang === 'hi' ? 'कालांश #' : 'Period #'}</th>
                    <th className="p-2 border-r">{exportLang === 'hi' ? 'विषय' : 'Subject'}</th>
                    <th className="p-2 border-r">{exportLang === 'hi' ? 'विषय अध्यापक' : 'Teacher'}</th>
                    <th className="p-2">{exportLang === 'hi' ? 'कक्ष संख्या' : 'Room'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {currentSchedule.map(s => {
                    const tObj = teachers.find(t => t.id === s.teacherId);
                    return (
                      <tr key={s.id}>
                        <td className="p-2 border-r font-mono font-bold">P{s.periodNumber}</td>
                        <td className="p-2 border-r font-bold">{s.subject}</td>
                        <td className="p-2 border-r">{tObj ? `${tObj.name} (${tObj.designation})` : 'Unassigned'}</td>
                        <td className="p-2 font-mono">{s.roomNo}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}

            {viewMode === 'master' && (
              <div className="overflow-x-auto">
                <table className="w-full text-left border border-slate-300 dark:border-slate-700 text-[10px]">
                  <thead className="bg-slate-800 text-white font-bold">
                    <tr>
                      <th className="p-1.5 border-r">Class</th>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(p => (
                        <th key={p} className="p-1.5 text-center border-r">P{p}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {availableClasses.map(cls => (
                      <tr key={cls}>
                        <td className="p-1.5 font-bold bg-slate-100 dark:bg-slate-800 border-r">{cls}</td>
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(p => {
                          const slots = timetables[cls] || [];
                          const s = slots.find(item => item.periodNumber === p);
                          const tObj = teachers.find(t => t.id === s?.teacherId);
                          return (
                            <td key={p} className="p-1 border-r text-center">
                              {s ? `${s.subject} (${tObj?.name || 'Unassigned'})` : '-'}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </PeeoOfficialLetterhead>
      </div>

    </div>
  );
};
