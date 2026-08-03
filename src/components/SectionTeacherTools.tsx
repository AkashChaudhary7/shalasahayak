import React, { useState } from 'react';
import { SchoolProfile, StudentResult, StudentAnomaly, ICTEquipment, LibraryBook, Language } from '../types';
import { ThreeDIcon, ThreeDCard } from './ThreeDIcon';
import { ResultsGridModule } from './modules/ResultsGridModule';
import { DailyDiaryModule } from './modules/DailyDiaryModule';
import { KridaShulkMaker } from './modules/KridaShulkMaker';
import { generateMarksheetPdf, generateClassTeacherResultReportPdf, generateSubjectMarkSheetPdf, generateSubjectGreensheetPdf, generateVerificationReportPdf } from '../utils/pdfGenerator';
import { t } from '../utils/i18n';
import {
  GraduationCap,
  Users,
  BookOpen,
  Library,
  Activity,
  Monitor,
  Plus,
  Download,
  Upload,
  Search,
  CheckCircle,
  AlertTriangle,
  Lock,
  FileText,
  Printer,
  FileJson,
  UserCheck,
  ShieldCheck,
  PenTool,
  Trophy,
  Sparkles,
  ChevronRight,
  Edit3,
  Save,
  RotateCcw,
  ArrowLeft,
  Grid,
  UserPlus,
  Award,
  CheckCircle2,
  FileCode,
  CheckSquare,
  Globe,
  Languages,
  Target
} from 'lucide-react';

interface SectionTeacherToolsProps {
  schoolProfile: SchoolProfile;
  students: StudentResult[];
  onUpdateStudents: (students: StudentResult[]) => void;
  anomalies: StudentAnomaly[];
  onUpdateAnomalies: (anomalies: StudentAnomaly[]) => void;
  ictItems: ICTEquipment[];
  onUpdateIctItems: (items: ICTEquipment[]) => void;
  libraryBooks: LibraryBook[];
  onUpdateLibraryBooks: (books: LibraryBook[]) => void;
  lang: Language;
  initialSubTab?: 'classTeacher' | 'subjectTeacher' | 'librarian' | 'pti' | 'computer' | 'marksheet' | 'anomaly' | 'ict' | 'library' | 'diary';
  initialSubComponent?: string;
  onNavigate?: (newNav: any) => void;
}

// Standard 8 Subjects as per Rajasthan Education Department
export const STANDARD_SUBJECTS = [
  { id: 'hindi', nameEn: 'Hindi', nameHi: 'हिंदी' },
  { id: 'english', nameEn: 'English', nameHi: 'अंग्रेजी' },
  { id: 'maths', nameEn: 'Mathematics', nameHi: 'गणित' },
  { id: 'science', nameEn: 'Science', nameHi: 'विज्ञान' },
  { id: 'social', nameEn: 'Social Science', nameHi: 'सामाजिक विज्ञान' },
  { id: 'thirdLang', nameEn: 'Third Language (Sanskrit/Urdu)', nameHi: 'तृतीय भाषा (संस्कृत/उर्दू)' },
  { id: 'physical', nameEn: 'Health & Physical Education', nameHi: 'स्वास्थ्य एवं शारीरिक शिक्षा' },
  { id: 'computer', nameEn: 'Information Technology / Computer', nameHi: 'सूचना प्रौद्योगिकी (कंप्यूटर)' }
];

export const SectionTeacherTools: React.FC<SectionTeacherToolsProps> = ({
  schoolProfile,
  students,
  onUpdateStudents,
  anomalies,
  onUpdateAnomalies,
  ictItems,
  onUpdateIctItems,
  libraryBooks,
  onUpdateLibraryBooks,
  lang,
  initialSubTab = 'classTeacher',
  initialSubComponent,
  onNavigate
}) => {
  // Role switcher state
  type RoleType = 'classTeacher' | 'subjectTeacher' | 'diary' | 'librarian' | 'pti' | 'computer';

  // Map legacy initialSubTab strings
  const normalizeInitialTab = (tabStr: string): RoleType => {
    if (tabStr === 'library') return 'librarian';
    if (tabStr === 'ict') return 'computer';
    if (tabStr === 'diary') return 'diary';
    if (tabStr === 'anomaly' || tabStr === 'marksheet') return 'classTeacher';
    if (['classTeacher', 'subjectTeacher', 'diary', 'librarian', 'pti', 'computer'].includes(tabStr)) {
      return tabStr as RoleType;
    }
    return 'classTeacher';
  };

  const [activeRole, setActiveRole] = useState<RoleType>(normalizeInitialTab(initialSubTab));
  const [activeSubComponent, setActiveSubComponent] = useState<string | null>(initialSubComponent || null);

  React.useEffect(() => {
    const role = normalizeInitialTab(initialSubTab);
    setActiveRole(role);
    if (initialSubComponent) {
      setActiveSubComponent(initialSubComponent);
    } else if (initialSubTab === 'anomaly') {
      setActiveSubComponent('verification');
    } else if (initialSubTab === 'marksheet') {
      setActiveSubComponent('export');
    } else if (initialSubTab === 'ict') {
      setActiveSubComponent('equipmentStock');
    } else if (initialSubTab === 'library') {
      setActiveSubComponent('catalogue');
    } else {
      setActiveSubComponent(null);
    }
  }, [initialSubTab, initialSubComponent]);

  React.useEffect(() => {
    if (onNavigate) {
      const normalizedPropRole = normalizeInitialTab(initialSubTab || '');
      const propSubComp = initialSubComponent || null;
      
      if (activeRole !== normalizedPropRole || activeSubComponent !== propSubComp) {
        onNavigate({
          type: 'tool',
          category: 'teacher',
          subtab: activeRole === 'librarian' ? 'library' : activeRole,
          subComponent: activeSubComponent || undefined
        });
      }
    }
  }, [activeRole, activeSubComponent, initialSubTab, initialSubComponent, onNavigate]);

  // Document export language state
  const [exportLang, setExportLang] = useState<Language>(lang);

  // Class Teacher Onboarding & Registration State
  const [classTeacherProfile, setClassTeacherProfile] = useState<{
    teacherName: string;
    assignedClass: string;
    section: string;
    subjectsTaught: string[];
    isOnboarded: boolean;
  }>(() => {
    try {
      const saved = localStorage.getItem('peeo_class_teacher_onboarding');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return {
      teacherName: 'Shri Rameshwar Sharma',
      assignedClass: 'Class 9',
      section: 'A',
      subjectsTaught: ['Mathematics', 'Science', 'Hindi', 'English'],
      isOnboarded: true
    };
  });

  const [showOnboardingModal, setShowOnboardingModal] = useState<boolean>(false);
  const [onboardingTeacherName, setOnboardingTeacherName] = useState<string>(classTeacherProfile.teacherName);
  const [onboardingClass, setOnboardingClass] = useState<string>(classTeacherProfile.assignedClass);
  const [onboardingSection, setOnboardingSection] = useState<string>(classTeacherProfile.section);
  const [onboardingSubjects, setOnboardingSubjects] = useState<string[]>(classTeacherProfile.subjectsTaught);

  const handleOpenOnboarding = () => {
    setOnboardingTeacherName(classTeacherProfile.teacherName);
    setOnboardingClass(classTeacherProfile.assignedClass);
    setOnboardingSection(classTeacherProfile.section);
    setOnboardingSubjects(classTeacherProfile.subjectsTaught);
    setShowOnboardingModal(true);
  };

  // Class Teacher Module States
  const [selectedClass, setSelectedClass] = useState<string>('Class 9-A');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [editingStudent, setEditingStudent] = useState<StudentResult | null>(null);
  const [showAddStudentModal, setShowAddStudentModal] = useState<boolean>(false);
  const [activeClassTeacherView, setActiveClassTeacherView] = useState<'feed' | 'verification' | 'export'>('feed');

  // New Student Form State with Conditional Verification Fields
  const [newSrNo, setNewSrNo] = useState('1415');
  const [newRollNo, setNewRollNo] = useState('1003');
  const [newName, setNewName] = useState('');
  const [newFatherName, setNewFatherName] = useState('');
  const [newGender, setNewGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [newCategory, setNewCategory] = useState<'GEN' | 'OBC' | 'SC' | 'ST' | 'EWS' | 'MBC'>('GEN');
  const [newClass, setNewClass] = useState('Class 9-A');

  // Verification Trackers for Add Student
  const [aadhaarAvailable, setAadhaarAvailable] = useState<boolean>(true);
  const [aadhaarAuthenticated, setAadhaarAuthenticated] = useState<boolean>(true);
  const [aadhaarReason, setAadhaarReason] = useState<string>('');

  const [janAadhaarAvailable, setJanAadhaarAvailable] = useState<boolean>(true);
  const [janAadhaarAuthenticated, setJanAadhaarAuthenticated] = useState<boolean>(true);
  const [janAadhaarReason, setJanAadhaarReason] = useState<string>('');

  const [apaarCreated, setApaarCreated] = useState<boolean>(true);
  const [apaarReason, setApaarReason] = useState<string>('');

  // Initial subject marks for new student
  const [newSubjectMarks, setNewSubjectMarks] = useState<Record<string, number>>({
    Hindi: 80,
    English: 78,
    Mathematics: 85,
    Science: 82,
    'Social Science': 80,
    'Third Language (Sanskrit)': 84,
    'Health & Physical Education': 90,
    'Information Technology': 88
  });

  // Verification Quick Filter
  const [verificationFilter, setVerificationFilter] = useState<'All' | 'Pending' | 'Mismatch'>('All');

  // Subject Teacher States
  const [subjectTeacherProfile, setSubjectTeacherProfile] = useState<{
    teacherName: string;
    assignedClass: string;
    section: string;
    subjectTaught: string;
  }>(() => {
    try {
      const saved = localStorage.getItem('peeo_subject_teacher_profile');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return {
      teacherName: 'Shri Rameshwar Sharma',
      assignedClass: 'Class 9',
      section: 'A',
      subjectTaught: 'Mathematics'
    };
  });

  const [subjectAllExamsMarks, setSubjectAllExamsMarks] = useState<Record<string, Record<string, Record<string, string | number>>>>(() => {
    try {
      const saved = localStorage.getItem('peeo_subject_all_exams_marks');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return {
      'Mathematics_Class 9_A': {
        '1410': { '1st Test': 9, '2nd Test': 9, 'Half Yearly': 62, '3rd Test': 8, 'Yearly / Annual': 71 },
        '1411': { '1st Test': 8, '2nd Test': 8, 'Half Yearly': 58, '3rd Test': 9, 'Yearly / Annual': 68 },
        '1412': { '1st Test': 10, '2nd Test': 9, 'Half Yearly': 68, '3rd Test': 10, 'Yearly / Annual': 78 },
        '1413': { '1st Test': 'AB', '2nd Test': 7, 'Half Yearly': 50, '3rd Test': 8, 'Yearly / Annual': 60 },
        '1414': { '1st Test': 7, '2nd Test': 8, 'Half Yearly': 55, '3rd Test': 7, 'Yearly / Annual': 64 },
        '1415': { '1st Test': 10, '2nd Test': 10, 'Half Yearly': 69, '3rd Test': 9, 'Yearly / Annual': 76 }
      }
    };
  });

  const [selectedSubject, setSelectedSubject] = useState(subjectTeacherProfile.subjectTaught);
  const [subjectExamType, setSubjectExamType] = useState('1st Test');
  const [selectedSubjectClass, setSelectedSubjectClass] = useState(`${subjectTeacherProfile.assignedClass}-${subjectTeacherProfile.section}`);
  const [subjectMaxMarks, setSubjectMaxMarks] = useState<number>(10);
  const [subjectSaveStatus, setSubjectSaveStatus] = useState<string | null>(null);
  const [subjectSearchQuery, setSubjectSearchQuery] = useState<string>('');
  const [subjectMarksMap, setSubjectMarksMap] = useState<Record<string, string | number>>(() => {
    try {
      const saved = localStorage.getItem('peeo_subject_marks_tabulation');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return {
      '1410': 9,
      '1411': 8,
      '1412': 10,
      '1413': 'AB',
      '1414': 7,
      '1415': 10
    };
  });

  // Librarian States
  const [bookSearch, setBookSearch] = useState('');
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState('');
  const [issuePerson, setIssuePerson] = useState('');
  const [issueRole, setIssueRole] = useState<'Student' | 'Teacher'>('Student');

  // PTI / Sports States with robust localStorage persistence
  const [ptiStudents, setPtiStudents] = useState(() => {
    try {
      const saved = localStorage.getItem('peeo_pti_students_data');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [
      { id: 'pti-1', name: 'Vikram Meena', class: 'Class 9-A', height: 162, weight: 52, bmi: 19.8, fitnessGrade: 'A (Fit)', ptGrade: 'A+' },
      { id: 'pti-2', name: 'Priyanka Gurjar', class: 'Class 9-A', height: 155, weight: 46, bmi: 19.1, fitnessGrade: 'A (Fit)', ptGrade: 'A+' },
      { id: 'pti-3', name: 'Aarav Sharma', class: 'Class 10-A', height: 168, weight: 58, bmi: 20.5, fitnessGrade: 'A (Fit)', ptGrade: 'A' },
      { id: 'pti-4', name: 'Ananya Kanwar', class: 'Class 10-A', height: 158, weight: 48, bmi: 19.2, fitnessGrade: 'A (Fit)', ptGrade: 'A+' }
    ];
  });

  const [sportsStock, setSportsStock] = useState(() => {
    try {
      const saved = localStorage.getItem('peeo_sports_stock_data');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [
      { id: 'ss-1', item: 'Cricket Bats (Willow)', category: 'Cricket', total: 6, issued: 2, condition: 'Good', lastUpdated: '2026-08-01' },
      { id: 'ss-2', item: 'Leather Cricket Balls', category: 'Cricket', total: 12, issued: 0, condition: 'Good', lastUpdated: '2026-08-01' },
      { id: 'ss-3', item: 'Leather Football (Nivia)', category: 'Football', total: 5, issued: 1, condition: 'Good', lastUpdated: '2026-07-28' },
      { id: 'ss-4', item: 'Cosco Volleyballs', category: 'Volleyball', total: 8, issued: 3, condition: 'Good', lastUpdated: '2026-08-02' },
      { id: 'ss-5', item: 'Badminton Rackets (YONEX)', category: 'Badminton', total: 10, issued: 4, condition: 'Fair', lastUpdated: '2026-07-25' },
      { id: 'ss-6', item: 'Table Tennis Balls', category: 'Table Tennis', total: 30, issued: 0, condition: 'Good', lastUpdated: '2026-08-01' },
      { id: 'ss-7', item: 'Chess Boards', category: 'Indoor Games', total: 10, issued: 2, condition: 'Excellent', lastUpdated: '2026-08-01' }
    ];
  });

  React.useEffect(() => {
    localStorage.setItem('peeo_pti_students_data', JSON.stringify(ptiStudents));
  }, [ptiStudents]);

  React.useEffect(() => {
    localStorage.setItem('peeo_sports_stock_data', JSON.stringify(sportsStock));
  }, [sportsStock]);

  // Helper: Auto-Calculations for a student result
  const calculateStudentStats = (std: StudentResult) => {
    let totalMax = 0;
    let totalObtained = 0;
    std.marks.forEach(m => {
      totalMax += m.maxMarks || 100;
      totalObtained += m.obtainedMarks || 0;
    });

    const percentage = totalMax > 0 ? parseFloat(((totalObtained / totalMax) * 100).toFixed(1)) : 0;

    let grade = 'A';
    if (percentage >= 86) grade = 'A+';
    else if (percentage >= 71) grade = 'A';
    else if (percentage >= 51) grade = 'B';
    else if (percentage >= 33) grade = 'C';
    else grade = 'D/E';

    let resultStatus: 'Passed' | 'Promoted' | 'Supplementary' | 'Detained' = 'Passed';
    const failedSubjectsCount = std.marks.filter(m => (m.obtainedMarks || 0) < 33).length;

    if (percentage < 33 || failedSubjectsCount >= 3) {
      resultStatus = 'Detained';
    } else if (failedSubjectsCount > 0) {
      resultStatus = 'Supplementary';
    }

    return { totalObtained, totalMax, percentage, grade, resultStatus };
  };

  // List of distinct classes in student list
  const availableClasses = Array.from(new Set(students.map(s => s.className))).filter(Boolean);
  if (!availableClasses.includes('Class 9-A')) availableClasses.push('Class 9-A');
  if (!availableClasses.includes('Class 10-A')) availableClasses.push('Class 10-A');

  // Filter students by selected class & search query
  const filteredClassStudents = students.filter(s => {
    const matchClass = selectedClass === 'All' || s.className === selectedClass || (selectedClass === 'Class 9-A' && s.className.includes('9'));
    const matchSearch = !searchQuery ||
      s.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.srNo.includes(searchQuery) ||
      s.rollNo.includes(searchQuery) ||
      s.fatherName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchClass && matchSearch;
  });

  // Handler: Save Onboarding Details
  const handleSaveOnboarding = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const updated = {
      teacherName: onboardingTeacherName.trim() || 'Shri Rameshwar Sharma',
      assignedClass: onboardingClass,
      section: onboardingSection,
      subjectsTaught: onboardingSubjects.length > 0 ? onboardingSubjects : ['Mathematics', 'Science'],
      isOnboarded: true
    };
    setClassTeacherProfile(updated);
    try {
      localStorage.setItem('peeo_class_teacher_onboarding', JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }
    setShowOnboardingModal(false);
    if (updated.assignedClass && updated.section) {
      setSelectedClass(`${updated.assignedClass}-${updated.section}`);
    }
  };

  const handleGenerateApaarReport = () => {
    const totalStudents = filteredClassStudents.length;
    const verifiedCount = filteredClassStudents.filter(s => s.apaarStatus === 'Generated').length;
    const pendingRows = filteredClassStudents
      .filter(s => s.apaarStatus !== 'Generated')
      .map((s, idx) => ({
        sNo: idx + 1,
        srNo: s.srNo,
        rollNo: s.rollNo,
        studentName: s.studentName,
        fatherName: s.fatherName,
        reason: s.apaarReason || 'Consent Pending'
      }));
    generateVerificationReportPdf(
      schoolProfile,
      'APAAR',
      selectedClass,
      classTeacherProfile.teacherName,
      totalStudents,
      verifiedCount,
      pendingRows,
      exportLang
    );
  };

  const handleGenerateAadhaarReport = () => {
    const totalStudents = filteredClassStudents.length;
    const verifiedCount = filteredClassStudents.filter(s => s.aadhaarStatus === 'Verified').length;
    const pendingRows = filteredClassStudents
      .filter(s => s.aadhaarStatus !== 'Verified')
      .map((s, idx) => ({
        sNo: idx + 1,
        srNo: s.srNo,
        rollNo: s.rollNo,
        studentName: s.studentName,
        fatherName: s.fatherName,
        reason: s.aadhaarReason || 'Authentication Pending'
      }));
    generateVerificationReportPdf(
      schoolProfile,
      'Aadhaar',
      selectedClass,
      classTeacherProfile.teacherName,
      totalStudents,
      verifiedCount,
      pendingRows,
      exportLang
    );
  };

  const handleGenerateJanAadhaarReport = () => {
    const totalStudents = filteredClassStudents.length;
    const verifiedCount = filteredClassStudents.filter(s => s.janAadhaarStatus === 'Verified').length;
    const pendingRows = filteredClassStudents
      .filter(s => s.janAadhaarStatus !== 'Verified')
      .map((s, idx) => ({
        sNo: idx + 1,
        srNo: s.srNo,
        rollNo: s.rollNo,
        studentName: s.studentName,
        fatherName: s.fatherName,
        reason: s.janAadhaarReason || 'Authentication Pending'
      }));
    generateVerificationReportPdf(
      schoolProfile,
      'Jan Aadhaar',
      selectedClass,
      classTeacherProfile.teacherName,
      totalStudents,
      verifiedCount,
      pendingRows,
      exportLang
    );
  };

  // Handler: Add Student Submit with Verification Flags
  const handleAddStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const formattedMarks = Object.entries(newSubjectMarks).map(([subj, obt]) => ({
      subject: subj,
      maxMarks: 100,
      obtainedMarks: Number(obt) || 0
    }));

    const computedAadhaarStatus: 'Verified' | 'Pending' | 'Mismatch' = aadhaarAvailable ? (aadhaarAuthenticated ? 'Verified' : 'Pending') : 'Mismatch';
    const computedJanAadhaarStatus: 'Verified' | 'Pending' | 'Mismatch' = janAadhaarAvailable ? (janAadhaarAuthenticated ? 'Verified' : 'Pending') : 'Mismatch';
    const computedApaarStatus: 'Generated' | 'Consent Pending' | 'Failed' = apaarCreated ? 'Generated' : 'Consent Pending';

    const newStudent: StudentResult = {
      id: `std-${Date.now()}`,
      srNo: newSrNo,
      rollNo: newRollNo,
      studentName: newName.trim(),
      fatherName: newFatherName.trim() || 'Parent Name',
      className: newClass,
      section: classTeacherProfile.section || 'A',
      gender: newGender,
      category: newCategory,
      aadhaarStatus: computedAadhaarStatus,
      aadhaarReason: !aadhaarAvailable ? aadhaarReason : (!aadhaarAuthenticated ? 'Authentication Pending' : ''),
      janAadhaarStatus: computedJanAadhaarStatus,
      janAadhaarReason: !janAadhaarAvailable ? janAadhaarReason : (!janAadhaarAuthenticated ? 'Authentication Pending' : ''),
      apaarStatus: computedApaarStatus,
      apaarReason: !apaarCreated ? apaarReason : '',
      maskedAadhaar: `XXXX-XXXX-${Math.floor(1000 + Math.random() * 9000)}`,
      attendance: '90%',
      remarks: 'Newly registered student',
      marks: formattedMarks
    };

    onUpdateStudents([...students, newStudent]);
    setShowAddStudentModal(false);
    setNewName('');
    setNewFatherName('');
  };

  // Handler: Export Student Master List CSV
  const handleExportCsv = () => {
    const headers = ["S.No.", "SR No", "Roll No", "Student Name", "Father Name", "Class", "Gender", "Category", "Aadhaar Status", "Aadhaar Pending Reason", "Jan Aadhaar Status", "Jan Aadhaar Pending Reason", "APAAR Status", "APAAR Pending Reason"];
    const rows = filteredClassStudents.map((s, idx) => [
      idx + 1,
      s.srNo,
      s.rollNo,
      `"${s.studentName}"`,
      `"${s.fatherName}"`,
      s.className,
      s.gender || 'Male',
      s.category || 'GEN',
      s.aadhaarStatus || 'Verified',
      `"${s.aadhaarReason || '-'}"`,
      s.janAadhaarStatus || 'Verified',
      `"${s.janAadhaarReason || '-'}"`,
      s.apaarStatus || 'Generated',
      `"${s.apaarReason || '-'}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Student_Master_List_${selectedClass.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  // Handler: Save Edited Student
  const handleSaveEditedStudent = () => {
    if (!editingStudent) return;
    const updatedList = students.map(s => s.id === editingStudent.id ? editingStudent : s);
    onUpdateStudents(updatedList);
    setEditingStudent(null);
  };

  // Handler: Export Class Result JSON
  const handleExportJson = () => {
    const classData = {
      schoolInfo: {
        name: schoolProfile.schoolName,
        udiseCode: schoolProfile.udiseCode,
        district: schoolProfile.district
      },
      className: selectedClass,
      exportDate: new Date().toISOString(),
      studentCount: filteredClassStudents.length,
      resultFeed: filteredClassStudents.map(std => {
        const stats = calculateStudentStats(std);
        return {
          srNo: std.srNo,
          rollNo: std.rollNo,
          studentName: std.studentName,
          fatherName: std.fatherName,
          gender: std.gender || 'Male',
          category: std.category || 'GEN',
          verification: {
            aadhaarStatus: std.aadhaarStatus || 'Verified',
            janAadhaarStatus: std.janAadhaarStatus || 'Verified',
            apaarStatus: std.apaarStatus || 'Generated',
            maskedAadhaar: std.maskedAadhaar || 'XXXX-XXXX-****'
          },
          marks: std.marks,
          summary: {
            totalObtained: stats.totalObtained,
            totalMax: stats.totalMax,
            percentage: stats.percentage,
            grade: stats.grade,
            finalStatus: stats.resultStatus
          }
        };
      })
    };

    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(classData, null, 2))}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `${selectedClass.replace(/\s+/g, '_')}_Result_Feed_Backup.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Handler: Print Class Report
  const handlePrintReport = () => {
    window.print();
  };

  // Handler: Toggle Verification Status
  const handleToggleVerification = (studentId: string, type: 'aadhaar' | 'janAadhaar' | 'apaar') => {
    const updated = students.map(s => {
      if (s.id !== studentId) return s;
      const copy = { ...s };
      if (type === 'aadhaar') {
        const nextMap = { Verified: 'Pending', Pending: 'Mismatch', Mismatch: 'Verified' };
        copy.aadhaarStatus = (nextMap[copy.aadhaarStatus || 'Verified'] || 'Verified') as any;
      } else if (type === 'janAadhaar') {
        const nextMap = { Verified: 'Pending', Pending: 'Mismatch', Mismatch: 'Verified' };
        copy.janAadhaarStatus = (nextMap[copy.janAadhaarStatus || 'Verified'] || 'Verified') as any;
      } else if (type === 'apaar') {
        const nextMap = { Generated: 'Consent Pending', 'Consent Pending': 'Failed', Failed: 'Generated' };
        copy.apaarStatus = (nextMap[copy.apaarStatus || 'Generated'] || 'Generated') as any;
      }
      return copy;
    });
    onUpdateStudents(updated);
  };

  // Library Issue Book Action
  const handleIssueBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookId || !issuePerson) return;
    const updatedBooks = libraryBooks.map(bk => {
      if (bk.id === selectedBookId) {
        return {
          ...bk,
          availableCopies: Math.max(0, bk.availableCopies - 1),
          issuedTo: [
            ...(bk.issuedTo || []),
            {
              personName: issuePerson,
              role: issueRole,
              issueDate: new Date().toLocaleDateString('en-IN'),
              dueDate: new Date(Date.now() + 14 * 86400000).toLocaleDateString('en-IN')
            }
          ]
        };
      }
      return bk;
    });
    onUpdateLibraryBooks(updatedBooks);
    setShowIssueModal(false);
    setIssuePerson('');
  };

  return (
    <div className="space-y-5">

      {/* EXPORT LANGUAGE CONTROL TOOLBAR */}
      {activeSubComponent !== 'kridaShulk' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-2.5 shadow-sm border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
          <div className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2 px-2">
            <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>{lang === 'hi' ? 'शिक्षक कार्यक्षेत्र एवं रिपोर्ट प्रपत्र' : 'Teacher Workspace & Reports'}</span>
          </div>

          {/* Quick Export Language Control */}
          <div className="flex items-center">
            <button
              onClick={() => setExportLang(exportLang === 'hi' ? 'en' : 'hi')}
              className="px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300/80 dark:border-slate-700 text-xs font-extrabold text-slate-800 dark:text-slate-200 cursor-pointer whitespace-nowrap flex items-center space-x-1.5 transition-all"
              title={lang === 'hi' ? 'निर्यात दस्तावेज़ भाषा बदलें' : 'Switch Export Language'}
            >
              <Globe className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>{exportLang === 'hi' ? 'PDF: हिंदी' : 'PDF: EN'}</span>
            </button>
          </div>
        </div>
      )}


      {/* 2. CLASS TEACHER (कक्षा अध्यापक) DEDICATED TOOLKIT & GRID */}
      {activeRole === 'classTeacher' && (
        <div className="space-y-4">
          
          {/* Onboarding Profile Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950 via-teal-900 to-emerald-950 text-white shadow-md border border-emerald-700/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded bg-amber-400 text-slate-950 font-black text-[10px] uppercase tracking-wider">
                  {lang === 'hi' ? 'कक्षा अध्यापक विवरण (Onboarded)' : 'Class Teacher Profile'}
                </span>
                <span className="text-xs text-emerald-300 font-mono font-bold">UDISE: {schoolProfile.udiseCode}</span>
              </div>
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-amber-300" />
                <span>{classTeacherProfile.teacherName}</span>
                <span className="text-xs font-semibold text-emerald-200">
                  ({classTeacherProfile.assignedClass} - {lang === 'hi' ? 'वर्ग' : 'Section'} {classTeacherProfile.section})
                </span>
              </h3>
              <div className="flex flex-wrap items-center gap-1.5 text-xs text-emerald-200 pt-0.5">
                <span className="font-semibold text-emerald-300">{lang === 'hi' ? 'आवंटित विषय:' : 'Subjects Taught:'}</span>
                {classTeacherProfile.subjectsTaught.map((sub, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded bg-emerald-800/80 text-amber-200 font-bold text-[10px] border border-emerald-700">
                    {sub}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleOpenOnboarding}
                className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black flex items-center space-x-1.5 shadow-sm transition-all cursor-pointer shrink-0"
              >
                <Edit3 className="w-4 h-4" />
                <span>{lang === 'hi' ? 'पंजीकरण बदलें' : 'Edit Onboarding'}</span>
              </button>
            </div>
          </div>

          {/* GRID DASHBOARD (When no subcomponent is selected) */}
          {activeSubComponent === null && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-md border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                <h3 className="font-black text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Grid className="w-4 h-4 text-emerald-600" />
                  <span>{lang === 'hi' ? 'कक्षा अध्यापक कार्य मॉड्यूल (8 घटकों की ग्रिड टूलकिट)' : 'Class Teacher Toolkit (8 Grid Modules)'}</span>
                </h3>
                <span className="text-xs font-bold text-slate-500 font-mono">Class: {selectedClass}</span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                
                {/* Module 1: Add Student */}
                <ThreeDCard
                  onClick={() => setActiveSubComponent('addStudent')}
                  icon="users"
                  bgTint="bg-emerald-50 dark:bg-emerald-950/40"
                  label={lang === 'hi' ? '१. छात्र पंजीकरण व सत्यापन' : '1. Add Student & Verification'}
                />

                {/* Module 2: Marks Feed */}
                <ThreeDCard
                  onClick={() => setActiveSubComponent('marksFeed')}
                  icon="calculator"
                  bgTint="bg-blue-50 dark:bg-blue-950/40"
                  label={lang === 'hi' ? '२. समस्त विषय अंक प्रविष्टि' : '2. Marks Feed Engine'}
                />

                {/* Module 3: Greensheet Generator */}
                <ThreeDCard
                  onClick={() => setActiveSubComponent('greensheet')}
                  icon="award"
                  bgTint="bg-amber-50 dark:bg-amber-950/40"
                  label={lang === 'hi' ? '३. ग्रीनशीट जनरेटर' : '3. Greensheet Generator'}
                />

                {/* Module 4: Test Marksheet Generator */}
                <ThreeDCard
                  onClick={() => setActiveSubComponent('testMarksheet')}
                  icon="target"
                  bgTint="bg-purple-50 dark:bg-purple-950/40"
                  label={lang === 'hi' ? '४. परख अंकतालिका जनरेटर' : '4. Test Marksheet Tool'}
                />

                {/* Module 5: APAAR Report Generator */}
                <ThreeDCard
                  onClick={() => setActiveSubComponent('apaarReport')}
                  icon="coupon"
                  bgTint="bg-indigo-50 dark:bg-indigo-950/40"
                  label={lang === 'hi' ? '५. आपार आईडी रिपोर्ट जनरेटर' : '5. APAAR ID Report Tool'}
                />

                {/* Module 6: Aadhaar Report Generator */}
                <ThreeDCard
                  onClick={() => setActiveSubComponent('aadhaarReport')}
                  icon="shield"
                  bgTint="bg-cyan-50 dark:bg-cyan-950/40"
                  label={lang === 'hi' ? '६. आधार प्रमाणीकरण रिपोर्ट' : '6. Aadhaar Report Tool'}
                />

                {/* Module 7: Jan Aadhaar Report Generator */}
                <ThreeDCard
                  onClick={() => setActiveSubComponent('janAadhaarReport')}
                  icon="calendar"
                  bgTint="bg-teal-50 dark:bg-teal-950/40"
                  label={lang === 'hi' ? '७. जनाधार सत्यापन रिपोर्ट' : '7. Jan Aadhaar Report Tool'}
                />

                {/* Module 8: Export Student Data */}
                <ThreeDCard
                  onClick={() => setActiveSubComponent('exportData')}
                  icon="send"
                  bgTint="bg-rose-50 dark:bg-rose-950/40"
                  label={lang === 'hi' ? '८. डाटा निर्यात एवं शेयर' : '8. Export Data (CSV/JSON)'}
                />

              </div>
            </div>
          )}

          {/* DETAILED SUB-COMPONENT VIEWS */}
          {activeSubComponent !== null && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-md border border-slate-200 dark:border-slate-800 space-y-4 relative">
              
              {/* Minimal Floating Back Button */}
              <button
                onClick={() => setActiveSubComponent(null)}
                className="absolute top-4 right-4 z-20 p-2 rounded-xl bg-slate-100 hover:bg-emerald-50 dark:bg-slate-850 dark:hover:bg-emerald-950/30 text-slate-500 hover:text-emerald-700 dark:text-slate-400 dark:hover:text-emerald-400 transition-all cursor-pointer active:scale-95 border border-slate-200/60 dark:border-slate-800"
                title={lang === 'hi' ? 'वापस' : 'Back'}
              >
                <ArrowLeft className="w-4 h-4" />
              </button>

              {/* Minimal Class Switcher Row */}
              <div className="flex items-center space-x-2 border-b border-slate-200/60 dark:border-slate-800 pb-3">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                  {lang === 'hi' ? 'चयनित कक्षा:' : 'Class:'}
                </span>
                <select
                  value={selectedClass}
                  onChange={e => setSelectedClass(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-800 text-emerald-800 dark:text-emerald-300 font-extrabold text-xs px-2.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700"
                >
                  <option value="Class 9-A">कक्षा 9-A</option>
                  <option value="Class 10-A">कक्षा 10-A</option>
                  <option value="Class 8-A">कक्षा 8-A</option>
                </select>
              </div>

              {/* SUB-COMPONENT: MARKSHEET & BOARD RESULTS GRID */}
              {activeSubComponent === 'export' && (
                <ResultsGridModule
                  schoolProfile={schoolProfile}
                  students={students}
                  lang={lang}
                  onBack={() => setActiveSubComponent(null)}
                />
              )}

              {/* SUB-COMPONENT 1: ADD STUDENT FORM */}
              {activeSubComponent === 'addStudent' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800">
                    <h3 className="font-extrabold text-sm text-emerald-900 dark:text-emerald-100 flex items-center gap-2 mb-1">
                      <UserPlus className="w-4 h-4 text-emerald-600" />
                      <span>{lang === 'hi' ? '1. नया छात्र पंजीकरण व सत्यापन विवरण' : '1. Student Onboarding & Verification Entry'}</span>
                    </h3>
                    <p className="text-xs text-emerald-800 dark:text-emerald-300">
                      {lang === 'hi' ? 'छात्र का व्यक्तिगत विवरण दर्ज करें एवं आधार/जनआधार/आपार आईडी सत्यापन स्थिति चुनें' : 'Enter basic details and toggle identity verification status with reasons.'}
                    </p>
                  </div>

                  <form onSubmit={handleAddStudentSubmit} className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">SR Number</label>
                        <input
                          type="text"
                          required
                          value={newSrNo}
                          onChange={e => setNewSrNo(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-xs"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Roll Number</label>
                        <input
                          type="text"
                          required
                          value={newRollNo}
                          onChange={e => setNewRollNo(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-xs"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Allocated Class</label>
                        <input
                          type="text"
                          readOnly
                          value={selectedClass}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-200 dark:bg-slate-800 font-bold text-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Student Name (विद्यार्थी नाम)</label>
                        <input
                          type="text"
                          required
                          value={newName}
                          onChange={e => setNewName(e.target.value)}
                          placeholder="e.g. Rahul Sharma"
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Father's Name (पिता का नाम)</label>
                        <input
                          type="text"
                          required
                          value={newFatherName}
                          onChange={e => setNewFatherName(e.target.value)}
                          placeholder="e.g. Shri Mohan Lal Sharma"
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Gender</label>
                        <select
                          value={newGender}
                          onChange={e => setNewGender(e.target.value as any)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                        >
                          <option value="Male">Male (बालक)</option>
                          <option value="Female">Female (बालिका)</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Category</label>
                        <select
                          value={newCategory}
                          onChange={e => setNewCategory(e.target.value as any)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                        >
                          <option value="GEN">GEN</option>
                          <option value="OBC">OBC</option>
                          <option value="SC">SC</option>
                          <option value="ST">ST</option>
                          <option value="EWS">EWS</option>
                          <option value="MBC">MBC</option>
                        </select>
                      </div>
                    </div>

                    {/* Conditional Identity Verification Trackers */}
                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 space-y-3">
                      <h4 className="font-black text-xs text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-blue-600" />
                        <span>सत्यापन स्थिति एवं लंबित कारण (Verification Trackers)</span>
                      </h4>

                      {/* Aadhaar Tracker */}
                      <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-800 dark:text-slate-200">आधार कार्ड उपलब्ध है? (Aadhaar Available?)</span>
                          <div className="flex items-center space-x-2">
                            <button
                              type="button"
                              onClick={() => setAadhaarAvailable(true)}
                              className={`px-3 py-1 rounded-lg font-bold text-[11px] ${aadhaarAvailable ? 'bg-emerald-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}
                            >
                              हाँ (Yes)
                            </button>
                            <button
                              type="button"
                              onClick={() => setAadhaarAvailable(false)}
                              className={`px-3 py-1 rounded-lg font-bold text-[11px] ${!aadhaarAvailable ? 'bg-rose-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}
                            >
                              नहीं (No)
                            </button>
                          </div>
                        </div>

                        {aadhaarAvailable ? (
                          <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800">
                            <span className="text-[11px] text-slate-600 dark:text-slate-400">ऑथेंटिकेशन / सत्यापन स्थिति:</span>
                            <div className="flex items-center space-x-2">
                              <button
                                type="button"
                                onClick={() => setAadhaarAuthenticated(true)}
                                className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${aadhaarAuthenticated ? 'bg-emerald-100 text-emerald-900 border border-emerald-400' : 'bg-slate-100 dark:bg-slate-800'}`}
                              >
                                सत्यापित (Verified)
                              </button>
                              <button
                                type="button"
                                onClick={() => setAadhaarAuthenticated(false)}
                                className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${!aadhaarAuthenticated ? 'bg-amber-100 text-amber-900 border border-amber-400' : 'bg-slate-100 dark:bg-slate-800'}`}
                              >
                                लंबित (Pending)
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="pt-1">
                            <label className="block text-[11px] font-semibold text-rose-700 dark:text-rose-300 mb-1">आधार अनुपलब्धता का कारण दर्ज करें:</label>
                            <input
                              type="text"
                              value={aadhaarReason}
                              onChange={e => setAadhaarReason(e.target.value)}
                              placeholder="e.g. EID Enrolled / UIDAI Card Not Issued"
                              className="w-full px-2.5 py-1 rounded-lg border border-rose-300 bg-rose-50 dark:bg-slate-900 text-xs"
                            />
                          </div>
                        )}
                      </div>

                      {/* Jan Aadhaar Tracker */}
                      <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-800 dark:text-slate-200">जनाधार कार्ड उपलब्ध है? (Jan Aadhaar Available?)</span>
                          <div className="flex items-center space-x-2">
                            <button
                              type="button"
                              onClick={() => setJanAadhaarAvailable(true)}
                              className={`px-3 py-1 rounded-lg font-bold text-[11px] ${janAadhaarAvailable ? 'bg-emerald-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}
                            >
                              हाँ (Yes)
                            </button>
                            <button
                              type="button"
                              onClick={() => setJanAadhaarAvailable(false)}
                              className={`px-3 py-1 rounded-lg font-bold text-[11px] ${!janAadhaarAvailable ? 'bg-rose-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}
                            >
                              नहीं (No)
                            </button>
                          </div>
                        </div>

                        {!janAadhaarAvailable && (
                          <div className="pt-1">
                            <label className="block text-[11px] font-semibold text-rose-700 dark:text-rose-300 mb-1">जनाधार अनुपलब्धता का कारण दर्ज करें:</label>
                            <input
                              type="text"
                              value={janAadhaarReason}
                              onChange={e => setJanAadhaarReason(e.target.value)}
                              placeholder="e.g. Family Jan Aadhaar Not Linked"
                              className="w-full px-2.5 py-1 rounded-lg border border-rose-300 bg-rose-50 dark:bg-slate-900 text-xs"
                            />
                          </div>
                        )}
                      </div>

                      {/* APAAR ID Tracker */}
                      <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-800 dark:text-slate-200">आपार आईडी जनरेट हुई? (APAAR ID Generated?)</span>
                          <div className="flex items-center space-x-2">
                            <button
                              type="button"
                              onClick={() => setApaarCreated(true)}
                              className={`px-3 py-1 rounded-lg font-bold text-[11px] ${apaarCreated ? 'bg-purple-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}
                            >
                              जनरेटेड (Generated)
                            </button>
                            <button
                              type="button"
                              onClick={() => setApaarCreated(false)}
                              className={`px-3 py-1 rounded-lg font-bold text-[11px] ${!apaarCreated ? 'bg-rose-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}
                            >
                              लंबित (Pending)
                            </button>
                          </div>
                        </div>

                        {!apaarCreated && (
                          <div className="pt-1">
                            <label className="block text-[11px] font-semibold text-purple-800 dark:text-purple-300 mb-1">आपार आईडी लंबित रहने का कारण दर्ज करें:</label>
                            <select
                              value={apaarReason}
                              onChange={e => setApaarReason(e.target.value)}
                              className="w-full px-2.5 py-1 rounded-lg border border-purple-300 bg-purple-50 dark:bg-slate-900 text-xs font-semibold"
                            >
                              <option value="Parent Consent Pending">अभिभावक सहमति पत्र अप्राप्त (Parent Consent Pending)</option>
                              <option value="Aadhaar Name Mismatch in UDISE+">यू-डाइज एवं आधार में नाम भिन्नता (Name Mismatch in UDISE+)</option>
                              <option value="DOB Discrepancy">जन्म तिथि में भिन्नता (DOB Discrepancy)</option>
                              <option value="Unlinked Mobile Number">आधार से मोबाइल नंबर लिंक नहीं (Unlinked Mobile Number)</option>
                            </select>
                          </div>
                        )}
                      </div>

                    </div>

                    <div className="flex justify-end space-x-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                      <button
                        type="button"
                        onClick={() => setActiveSubComponent(null)}
                        className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 font-bold"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black flex items-center space-x-1"
                      >
                        <UserPlus className="w-4 h-4" />
                        <span>छात्र रिकॉर्ड सहेजें (Save Student)</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* SUB-COMPONENT 2: MARKS FEED TABLE */}
              {activeSubComponent === 'marksFeed' && (
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800">
                    <div>
                      <h4 className="font-extrabold text-xs text-blue-900 dark:text-blue-200 flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-blue-600" />
                        <span>2. समस्त विषय अंक प्रविष्टि तालिका - {selectedClass}</span>
                      </h4>
                      <p className="text-[11px] text-blue-700 dark:text-blue-300">
                        प्रत्येक विद्यार्थी के प्राप्तांक संपादित करें। कुल प्राप्तांक, प्रतिशत एवं ग्रेड स्वतः परिकलित होते हैं।
                      </p>
                    </div>
                  </div>

                  <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs">
                    <table className="w-full text-left text-xs bg-white dark:bg-slate-900">
                      <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-extrabold uppercase text-[10px]">
                        <tr>
                          <th className="p-2 text-center">SR / Roll</th>
                          <th className="p-2">Student Name</th>
                          <th className="p-2">Father Name</th>
                          <th className="p-2 text-center">Hindi</th>
                          <th className="p-2 text-center">English</th>
                          <th className="p-2 text-center">Maths</th>
                          <th className="p-2 text-center">Science</th>
                          <th className="p-2 text-center">S.Science</th>
                          <th className="p-2 text-center">Total</th>
                          <th className="p-2 text-center">% (Grade)</th>
                          <th className="p-2 text-center">Result</th>
                          <th className="p-2 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-[11px]">
                        {filteredClassStudents.map(std => {
                          const stats = calculateStudentStats(std);
                          const getMarks = (subjKey: string) => {
                            const m = std.marks.find(x => x.subject.toLowerCase().includes(subjKey.toLowerCase()));
                            return m ? m.obtainedMarks : 0;
                          };
                          return (
                            <tr key={std.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                              <td className="p-2 text-center font-mono font-bold">
                                <div>{std.srNo}</div>
                                <div className="text-[10px] text-emerald-700 font-extrabold">{std.rollNo}</div>
                              </td>
                              <td className="p-2 font-bold text-slate-900 dark:text-slate-100 whitespace-nowrap">{std.studentName}</td>
                              <td className="p-2 text-slate-600 dark:text-slate-400 text-[10px] whitespace-nowrap">{std.fatherName}</td>
                              <td className="p-2 text-center font-mono font-bold">{getMarks('Hindi')}</td>
                              <td className="p-2 text-center font-mono font-bold">{getMarks('English')}</td>
                              <td className="p-2 text-center font-mono font-bold text-blue-600">{getMarks('Math')}</td>
                              <td className="p-2 text-center font-mono font-bold">{getMarks('Science')}</td>
                              <td className="p-2 text-center font-mono font-bold">{getMarks('Social')}</td>
                              <td className="p-2 text-center font-mono font-extrabold text-emerald-800 dark:text-emerald-300">
                                {stats.totalObtained} / {stats.totalMax}
                              </td>
                              <td className="p-2 text-center whitespace-nowrap">
                                <span className="font-bold">{stats.percentage}%</span>
                                <span className="ml-1 px-1.5 py-0.2 rounded text-[9px] font-black bg-amber-100 text-amber-900">
                                  Grade {stats.grade}
                                </span>
                              </td>
                              <td className="p-2 text-center whitespace-nowrap">
                                <span className="px-2 py-0.5 rounded-full font-bold text-[10px] bg-emerald-100 text-emerald-800">
                                  {stats.resultStatus}
                                </span>
                              </td>
                              <td className="p-2 text-center whitespace-nowrap">
                                <button
                                  onClick={() => setEditingStudent(std)}
                                  className="px-2 py-1 rounded bg-blue-700 hover:bg-blue-800 text-white font-bold text-[10px]"
                                >
                                  Edit Marks
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* SUB-COMPONENT 3: GREENSHEET GENERATOR */}
              {activeSubComponent === 'greensheet' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800">
                    <div>
                      <h4 className="font-black text-sm text-amber-950 dark:text-amber-200 flex items-center gap-1.5">
                        <Award className="w-5 h-5 text-amber-600" />
                        <span>3. कक्षा परिणाम ग्रीनशीट (Tabulation Greensheet) - {selectedClass}</span>
                      </h4>
                      <p className="text-xs text-amber-800 dark:text-amber-300">
                        {schoolProfile.schoolName} | UDISE: {schoolProfile.udiseCode}
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => generateClassTeacherResultReportPdf(schoolProfile, selectedClass, filteredClassStudents, exportLang)}
                        className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-black flex items-center space-x-1.5 shadow-sm"
                      >
                        <Download className="w-4 h-4 text-amber-300" />
                        <span>Download Greensheet PDF</span>
                      </button>
                      <button
                        onClick={handlePrintReport}
                        className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black flex items-center space-x-1 shadow-sm"
                      >
                        <Printer className="w-4 h-4" />
                        <span>Print Greensheet</span>
                      </button>
                    </div>
                  </div>

                  {/* Print Document View */}
                  <div className="p-6 rounded-2xl bg-white text-slate-900 border-2 border-slate-900 space-y-4 font-sans text-xs shadow-lg">
                    <div className="text-center border-b-2 border-slate-900 pb-3 space-y-1">
                      <div className="text-[10px] font-black uppercase tracking-widest text-slate-600">
                        GOVERNMENT OF RAJASTHAN — SCHOOL EDUCATION DEPARTMENT
                      </div>
                      <h2 className="text-base font-black text-slate-950 uppercase tracking-tight">
                        {schoolProfile.schoolName}
                      </h2>
                      <div className="text-xs font-bold text-slate-700">
                        UDISE CODE: {schoolProfile.udiseCode} | DISTRICT: {schoolProfile.district} | BLOCK: {schoolProfile.block}
                      </div>
                      <div className="pt-2">
                        <span className="px-4 py-1 rounded bg-slate-900 text-amber-300 font-extrabold text-xs shadow-sm inline-block">
                          वार्षिक / अर्द्धवार्षिक परीक्षा परिणाम ग्रीनशीट — कक्षा {selectedClass}
                        </span>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-[10px] border-collapse border border-slate-400">
                        <thead>
                          <tr className="bg-slate-200 text-slate-950 font-bold border-b border-slate-400">
                            <th className="border border-slate-400 p-1 text-center">SR</th>
                            <th className="border border-slate-400 p-1 text-center">Roll</th>
                            <th className="border border-slate-400 p-1">विद्यार्थी का नाम</th>
                            <th className="border border-slate-400 p-1">पिता का नाम</th>
                            <th className="border border-slate-400 p-1 text-center">हिंदी</th>
                            <th className="border border-slate-400 p-1 text-center">अंग्रेजी</th>
                            <th className="border border-slate-400 p-1 text-center">गणित</th>
                            <th className="border border-slate-400 p-1 text-center">विज्ञान</th>
                            <th className="border border-slate-400 p-1 text-center">स.विज्ञान</th>
                            <th className="border border-slate-400 p-1 text-center">कुल अंक</th>
                            <th className="border border-slate-400 p-1 text-center">%</th>
                            <th className="border border-slate-400 p-1 text-center">ग्रेड</th>
                            <th className="border border-slate-400 p-1 text-center">परिणाम</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredClassStudents.map(s => {
                            const stats = calculateStudentStats(s);
                            const getM = (k: string) => {
                              const match = s.marks.find(x => x.subject.toLowerCase().includes(k.toLowerCase()));
                              return match ? match.obtainedMarks : 0;
                            };
                            return (
                              <tr key={s.id} className="border-b border-slate-300">
                                <td className="border border-slate-300 p-1 text-center font-mono">{s.srNo}</td>
                                <td className="border border-slate-300 p-1 text-center font-mono font-bold">{s.rollNo}</td>
                                <td className="border border-slate-300 p-1 font-bold">{s.studentName}</td>
                                <td className="border border-slate-300 p-1">{s.fatherName}</td>
                                <td className="border border-slate-300 p-1 text-center font-mono">{getM('Hindi')}</td>
                                <td className="border border-slate-300 p-1 text-center font-mono">{getM('English')}</td>
                                <td className="border border-slate-300 p-1 text-center font-mono font-bold text-blue-700">{getM('Math')}</td>
                                <td className="border border-slate-300 p-1 text-center font-mono">{getM('Science')}</td>
                                <td className="border border-slate-300 p-1 text-center font-mono">{getM('Social')}</td>
                                <td className="border border-slate-300 p-1 text-center font-mono font-bold">{stats.totalObtained} / {stats.totalMax}</td>
                                <td className="border border-slate-300 p-1 text-center font-mono">{stats.percentage}%</td>
                                <td className="border border-slate-300 p-1 text-center font-bold">{stats.grade}</td>
                                <td className="border border-slate-300 p-1 text-center font-bold text-emerald-800">{stats.resultStatus}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    {/* Dual Signature Footer Block */}
                    <div className="pt-8 grid grid-cols-2 text-center text-xs font-bold text-slate-900 border-t border-slate-300">
                      <div>
                        <div className="h-10"></div>
                        <div className="font-extrabold">{schoolProfile.principalName}</div>
                        <div className="text-[10px] text-slate-600">(प्रधानाचार्य / पीईईओ मुहर व हस्ताक्षर)</div>
                      </div>
                      <div>
                        <div className="h-10"></div>
                        <div className="text-emerald-900 font-extrabold underline">{classTeacherProfile.teacherName}</div>
                        <div className="text-[10px] text-slate-800 font-extrabold">(कक्षा अध्यापक के हस्ताक्षर)</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SUB-COMPONENT 4: TEST MARKSHEET GENERATOR */}
              {activeSubComponent === 'testMarksheet' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 space-y-3">
                    <h4 className="font-black text-sm text-purple-900 dark:text-purple-200 flex items-center gap-1.5">
                      <CheckCircle2 className="w-5 h-5 text-purple-600" />
                      <span>4. विषयवार परख अंकतालिका (Subject Test Marksheet Tool)</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                      <div>
                        <label className="block font-bold text-purple-900 dark:text-purple-300 mb-1">परख / परीक्षा का प्रकार:</label>
                        <select
                          value={subjectExamType}
                          onChange={e => setSubjectExamType(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-purple-300 bg-white dark:bg-slate-900 font-bold"
                        >
                          <option value="1st Test">प्रथम परख (1st Test - Max 10)</option>
                          <option value="2nd Test">द्वितीय परख (2nd Test - Max 10)</option>
                          <option value="3rd Test">तृतीय परख (3rd Test - Max 10)</option>
                          <option value="Half Yearly">अर्द्धवार्षिक परीक्षा (Half Yearly)</option>
                          <option value="Annual Exam">वार्षिक परीक्षा (Annual Exam)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold text-purple-900 dark:text-purple-300 mb-1">विषय चुनें (Subject):</label>
                        <select
                          value={selectedSubject}
                          onChange={e => setSelectedSubject(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-purple-300 bg-white dark:bg-slate-900 font-bold"
                        >
                          <option value="Mathematics">Mathematics (गणित)</option>
                          <option value="Science">Science (विज्ञान)</option>
                          <option value="English">English (अंग्रेजी)</option>
                          <option value="Hindi">Hindi (हिंदी)</option>
                          <option value="Social Science">Social Science (सामाजिक विज्ञान)</option>
                          <option value="Sanskrit">Sanskrit (संस्कृत)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold text-purple-900 dark:text-purple-300 mb-1">पूर्णांक (Max Marks):</label>
                        <input
                          type="number"
                          value={subjectMaxMarks}
                          onChange={e => setSubjectMaxMarks(Number(e.target.value))}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-purple-300 bg-white dark:bg-slate-900 font-mono font-bold"
                        />
                      </div>

                      <div className="flex items-end space-x-2">
                        <button
                          onClick={() => generateSubjectMarkSheetPdf(schoolProfile, selectedClass, selectedSubject, subjectExamType, filteredClassStudents, exportLang)}
                          className="w-full py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-black text-xs flex items-center justify-center space-x-1 shadow-sm"
                        >
                          <Download className="w-4 h-4 text-amber-300" />
                          <span>PDF जनरेट करें</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Print Document View */}
                  <div className="p-6 rounded-2xl bg-white text-slate-900 border-2 border-slate-900 space-y-4 font-sans text-xs shadow-lg">
                    <div className="text-center border-b-2 border-slate-900 pb-3 space-y-1">
                      <div className="text-[10px] font-black uppercase tracking-widest text-slate-600">
                        GOVERNMENT OF RAJASTHAN — SCHOOL EDUCATION DEPARTMENT
                      </div>
                      <h2 className="text-base font-black text-slate-950 uppercase tracking-tight">
                        {schoolProfile.schoolName}
                      </h2>
                      <div className="text-xs font-bold text-slate-700">
                        UDISE CODE: {schoolProfile.udiseCode} | DISTRICT: {schoolProfile.district}
                      </div>
                      <div className="pt-1 flex justify-center gap-3 font-extrabold text-xs">
                        <span className="px-3 py-0.5 rounded bg-purple-100 text-purple-950 border border-purple-400">
                          परीक्षा: {subjectExamType}
                        </span>
                        <span className="px-3 py-0.5 rounded bg-emerald-100 text-emerald-950 border border-emerald-400">
                          विषय: {selectedSubject}
                        </span>
                        <span className="px-3 py-0.5 rounded bg-amber-100 text-amber-950 border border-amber-400">
                          पूर्णांक: {subjectMaxMarks}
                        </span>
                      </div>
                    </div>

                    <table className="w-full text-left text-xs border-collapse border border-slate-400">
                      <thead>
                        <tr className="bg-slate-200 text-slate-950 font-bold border-b border-slate-400">
                          <th className="border border-slate-400 p-1.5 text-center">क्र.सं.</th>
                          <th className="border border-slate-400 p-1.5 text-center">SR No.</th>
                          <th className="border border-slate-400 p-1.5 text-center">रोल नं.</th>
                          <th className="border border-slate-400 p-1.5">विद्यार्थी का नाम</th>
                          <th className="border border-slate-400 p-1.5">पिता का नाम</th>
                          <th className="border border-slate-400 p-1.5 text-center">प्राप्तांक (Marks Obtained)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredClassStudents.map((s, idx) => {
                          const m = s.marks.find(x => x.subject.toLowerCase().includes(selectedSubject.toLowerCase()));
                          return (
                            <tr key={s.id} className="border-b border-slate-300">
                              <td className="border border-slate-300 p-1.5 text-center font-mono">{idx + 1}</td>
                              <td className="border border-slate-300 p-1.5 text-center font-mono">{s.srNo}</td>
                              <td className="border border-slate-300 p-1.5 text-center font-mono font-bold">{s.rollNo}</td>
                              <td className="border border-slate-300 p-1.5 font-bold">{s.studentName}</td>
                              <td className="border border-slate-300 p-1.5">{s.fatherName}</td>
                              <td className="border border-slate-300 p-1.5 text-center font-mono font-extrabold text-purple-900">
                                {m ? m.obtainedMarks : 8} / {subjectMaxMarks}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>

                    {/* Dual Signatures */}
                    <div className="pt-8 grid grid-cols-2 text-center text-xs font-bold text-slate-900 border-t border-slate-300">
                      <div>
                        <div className="h-10"></div>
                        <div>विषय अध्यापक के हस्ताक्षर</div>
                        <div className="text-[10px] text-slate-600">(Signature of Subject Teacher)</div>
                      </div>
                      <div>
                        <div className="h-10"></div>
                        <div className="font-extrabold">{schoolProfile.principalName}</div>
                        <div className="text-[10px] text-slate-600">(संस्था प्रधान / पीईईओ प्रतिहस्ताक्षर)</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SUB-COMPONENT 5: APAAR REPORT GENERATOR */}
              {activeSubComponent === 'apaarReport' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800">
                    <div>
                      <h4 className="font-black text-sm text-indigo-950 dark:text-indigo-200 flex items-center gap-1.5">
                        <FileCode className="w-5 h-5 text-indigo-600" />
                        <span>5. आपार आईडी (APAAR ID) सत्यापन व विसंगति रिपोर्ट</span>
                      </h4>
                      <p className="text-xs text-indigo-800 dark:text-indigo-300">
                        आधिकारिक पत्र प्रारूप — शाला दर्पण प्रभारी को प्रेषण हेतु विसंगति पत्र
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={handleGenerateApaarReport}
                        className="px-4 py-2 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-black flex items-center space-x-1.5 shadow-sm"
                      >
                        <Download className="w-4 h-4 text-amber-300" />
                        <span>Download Letter PDF</span>
                      </button>
                      <button
                        onClick={handlePrintReport}
                        className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black flex items-center space-x-1 shadow-sm"
                      >
                        <Printer className="w-4 h-4" />
                        <span>Print Letter</span>
                      </button>
                    </div>
                  </div>

                  {/* Formal Communication Letter Preview */}
                  <div className="p-8 rounded-2xl bg-white text-slate-900 border-2 border-slate-900 space-y-5 font-sans text-xs shadow-lg">
                    {/* Header */}
                    <div className="text-center border-b-2 border-slate-900 pb-3 space-y-1">
                      <div className="text-[10px] font-black uppercase tracking-widest text-slate-600">
                        GOVERNMENT OF RAJASTHAN — SCHOOL EDUCATION DEPARTMENT
                      </div>
                      <h2 className="text-base font-black text-slate-950 uppercase">
                        {schoolProfile.schoolName}
                      </h2>
                      <div className="text-xs font-bold text-slate-700">
                        UDISE CODE: {schoolProfile.udiseCode} | DISTRICT: {schoolProfile.district} | BLOCK: {schoolProfile.block}
                      </div>
                    </div>

                    {/* Letter Reference & Metadata */}
                    <div className="flex justify-between font-mono font-bold text-slate-800">
                      <div>क्रमांक: APAAR/REF/{new Date().getFullYear()}/{selectedClass.replace(/\s+/g, '')}</div>
                      <div>दिनांक: {new Date().toLocaleDateString('hi-IN')}</div>
                    </div>

                    {/* Addressing */}
                    <div className="space-y-1 font-semibold text-slate-900 leading-relaxed">
                      <div>सेवा में,</div>
                      <div className="pl-4">
                        <div><strong>शाला दर्पण प्रभारी / संस्था प्रधान,</strong></div>
                        <div>{schoolProfile.schoolName}, जिला {schoolProfile.district}</div>
                      </div>
                    </div>

                    {/* Subject Line */}
                    <div className="p-2.5 rounded bg-slate-100 border border-slate-400 font-extrabold text-slate-950 text-center">
                      विषय: आपार आईडी (APAAR ID) जनरेशन एवं सत्यापन विसंगति रिपोर्ट — कक्षा {selectedClass}
                    </div>

                    {/* Formal Letter Summary Body */}
                    <div className="space-y-2 leading-relaxed text-slate-800">
                      <p>
                        महोदय/महोदया,
                      </p>
                      <p className="text-justify">
                        उपरोक्त विषयान्तर्गत निवेदन है कि विद्यालय की कक्षा <strong>{selectedClass}</strong> के विद्यार्थियों की आपार आईडी (APAAR ID - Automated Permanent Academic Account Registry) जनरेशन एवं यू-डाइज प्लस पोर्टल सत्यापन प्रक्रिया संपादित की गई है। कक्षा में कुल नामांकित विद्यार्थियों में से जिन विद्यार्थियों की आपार आईडी जनरेट नहीं हो सकी है अथवा विसंगतियां (Discrepancies) पाई गई हैं, उनका विवरण निम्नानुसार प्रस्तुत है:
                      </p>
                    </div>

                    {/* Discrepancy Table */}
                    <table className="w-full text-left border-collapse border border-slate-400 text-xs">
                      <thead>
                        <tr className="bg-slate-200 font-bold border-b border-slate-400">
                          <th className="border border-slate-400 p-2 text-center">क्र.सं.</th>
                          <th className="border border-slate-400 p-2 text-center">SR No.</th>
                          <th className="border border-slate-400 p-2">विद्यार्थी का नाम</th>
                          <th className="border border-slate-400 p-2">पिता का नाम</th>
                          <th className="border border-slate-400 p-2 text-center">आपार स्थिति</th>
                          <th className="border border-slate-400 p-2">लंबित रहने का कारण / विसंगति</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredClassStudents.map((std, idx) => (
                          <tr key={std.id} className="border-b border-slate-300">
                            <td className="border border-slate-300 p-2 text-center font-mono">{idx + 1}</td>
                            <td className="border border-slate-300 p-2 text-center font-mono font-bold">{std.srNo}</td>
                            <td className="border border-slate-300 p-2 font-bold">{std.studentName}</td>
                            <td className="border border-slate-300 p-2">{std.fatherName}</td>
                            <td className="border border-slate-300 p-2 text-center font-extrabold">
                              <span className={`px-2 py-0.5 rounded text-[10px] ${
                                std.apaarStatus === 'Generated' ? 'bg-purple-100 text-purple-900' : 'bg-rose-100 text-rose-900'
                              }`}>
                                {std.apaarStatus || 'Consent Pending'}
                              </span>
                            </td>
                            <td className="border border-slate-300 p-2 text-slate-700">
                              {std.apaarReason || (std.apaarStatus === 'Generated' ? 'सफलतापूर्वक जनरेट' : 'अभिभावक सहमति पत्र अप्राप्त')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    <p className="text-justify leading-relaxed">
                      अतः आपसे अनुरोध है कि शाला दर्पण पोर्टल पर उक्त विसंगतियों के निवारण हेतु आवश्यक कार्यवाही संपादित करने का श्रम करें।
                    </p>

                    {/* DUAL SIGNATURE FOOTER */}
                    <div className="pt-10 grid grid-cols-2 text-center text-xs font-bold text-slate-900 border-t border-slate-300">
                      <div>
                        <div className="h-10"></div>
                        <div>शाला दर्पण प्रभारी के हस्ताक्षर</div>
                        <div className="text-[10px] text-slate-600 font-normal">(Shala Darpan Incharge Signature)</div>
                      </div>
                      <div>
                        <div className="h-10"></div>
                        <div className="text-emerald-950 font-extrabold underline">{classTeacherProfile.teacherName}</div>
                        <div className="text-[10px] text-slate-800 font-extrabold">(कक्षा अध्यापक के हस्ताक्षर)</div>
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* SUB-COMPONENT 6: AADHAAR REPORT GENERATOR */}
              {activeSubComponent === 'aadhaarReport' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800">
                    <div>
                      <h4 className="font-black text-sm text-cyan-950 dark:text-cyan-200 flex items-center gap-1.5">
                        <ShieldCheck className="w-5 h-5 text-cyan-600" />
                        <span>6. आधार प्रमाणीकरण (Aadhaar Verification) लंबित सूचना रिपोर्ट</span>
                      </h4>
                      <p className="text-xs text-cyan-800 dark:text-cyan-300">
                        आधिकारिक पत्र प्रारूप — आधार कार्ड प्रमाणीकरण विसंगतियों का प्रेषण पत्र
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={handleGenerateAadhaarReport}
                        className="px-4 py-2 rounded-xl bg-cyan-700 hover:bg-cyan-800 text-white text-xs font-black flex items-center space-x-1.5 shadow-sm"
                      >
                        <Download className="w-4 h-4 text-amber-300" />
                        <span>Download Letter PDF</span>
                      </button>
                      <button
                        onClick={handlePrintReport}
                        className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black flex items-center space-x-1 shadow-sm"
                      >
                        <Printer className="w-4 h-4" />
                        <span>Print Letter</span>
                      </button>
                    </div>
                  </div>

                  {/* Letter Body View */}
                  <div className="p-8 rounded-2xl bg-white text-slate-900 border-2 border-slate-900 space-y-5 font-sans text-xs shadow-lg">
                    <div className="text-center border-b-2 border-slate-900 pb-3 space-y-1">
                      <div className="text-[10px] font-black uppercase tracking-widest text-slate-600">
                        GOVERNMENT OF RAJASTHAN — SCHOOL EDUCATION DEPARTMENT
                      </div>
                      <h2 className="text-base font-black text-slate-950 uppercase">
                        {schoolProfile.schoolName}
                      </h2>
                      <div className="text-xs font-bold text-slate-700">
                        UDISE CODE: {schoolProfile.udiseCode} | DISTRICT: {schoolProfile.district}
                      </div>
                    </div>

                    <div className="flex justify-between font-mono font-bold text-slate-800">
                      <div>क्रमांक: AADHAAR/REF/{new Date().getFullYear()}/{selectedClass.replace(/\s+/g, '')}</div>
                      <div>दिनांक: {new Date().toLocaleDateString('hi-IN')}</div>
                    </div>

                    <div className="p-2.5 rounded bg-slate-100 border border-slate-400 font-extrabold text-slate-950 text-center">
                      विषय: आधार प्रमाणीकरण (Aadhaar Verification) विसंगति विवरण पत्र — कक्षा {selectedClass}
                    </div>

                    <table className="w-full text-left border-collapse border border-slate-400 text-xs">
                      <thead>
                        <tr className="bg-slate-200 font-bold border-b border-slate-400">
                          <th className="border border-slate-400 p-2 text-center">SR</th>
                          <th className="border border-slate-400 p-2">विद्यार्थी नाम</th>
                          <th className="border border-slate-400 p-2">पिता का नाम</th>
                          <th className="border border-slate-400 p-2 text-center">मास्क्ड आधार</th>
                          <th className="border border-slate-400 p-2 text-center">आधार स्थिति</th>
                          <th className="border border-slate-400 p-2">विसंगति का विवरण</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredClassStudents.map((std, idx) => (
                          <tr key={std.id} className="border-b border-slate-300">
                            <td className="border border-slate-300 p-2 text-center font-mono">{idx + 1}</td>
                            <td className="border border-slate-300 p-2 font-bold">{std.studentName}</td>
                            <td className="border border-slate-300 p-2">{std.fatherName}</td>
                            <td className="border border-slate-300 p-2 text-center font-mono text-[11px] font-semibold">{std.maskedAadhaar || 'XXXX-XXXX-4512'}</td>
                            <td className="border border-slate-300 p-2 text-center font-extrabold">
                              {std.aadhaarStatus || 'Verified'}
                            </td>
                            <td className="border border-slate-300 p-2 text-slate-700">
                              {std.aadhaarReason || (std.aadhaarStatus === 'Verified' ? 'सफलतापूर्वक सत्यापित' : 'ऑथेंटिकेशन लंबित')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    <div className="pt-10 grid grid-cols-2 text-center text-xs font-bold text-slate-900 border-t border-slate-300">
                      <div>
                        <div className="h-10"></div>
                        <div>शाला दर्पण प्रभारी के हस्ताक्षर</div>
                        <div className="text-[10px] text-slate-600 font-normal">(Shala Darpan Incharge Signature)</div>
                      </div>
                      <div>
                        <div className="h-10"></div>
                        <div className="text-emerald-950 font-extrabold underline">{classTeacherProfile.teacherName}</div>
                        <div className="text-[10px] text-slate-800 font-extrabold">(कक्षा अध्यापक के हस्ताक्षर)</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SUB-COMPONENT 7: JAN AADHAAR REPORT GENERATOR */}
              {activeSubComponent === 'janAadhaarReport' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800">
                    <div>
                      <h4 className="font-black text-sm text-teal-950 dark:text-teal-200 flex items-center gap-1.5">
                        <CheckSquare className="w-5 h-5 text-teal-600" />
                        <span>7. जनाधार सत्यापन (Jan Aadhaar Verification) विसंगति रिपोर्ट</span>
                      </h4>
                      <p className="text-xs text-teal-800 dark:text-teal-300">
                        आधिकारिक प्रेषण पत्र — जनाधार लिंक एवं सत्यापन विसंगतियां
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={handleGenerateJanAadhaarReport}
                        className="px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-black flex items-center space-x-1.5 shadow-sm"
                      >
                        <Download className="w-4 h-4 text-amber-300" />
                        <span>Download Letter PDF</span>
                      </button>
                      <button
                        onClick={handlePrintReport}
                        className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black flex items-center space-x-1 shadow-sm"
                      >
                        <Printer className="w-4 h-4" />
                        <span>Print Letter</span>
                      </button>
                    </div>
                  </div>

                  <div className="p-8 rounded-2xl bg-white text-slate-900 border-2 border-slate-900 space-y-5 font-sans text-xs shadow-lg">
                    <div className="text-center border-b-2 border-slate-900 pb-3 space-y-1">
                      <div className="text-[10px] font-black uppercase tracking-widest text-slate-600">
                        GOVERNMENT OF RAJASTHAN — SCHOOL EDUCATION DEPARTMENT
                      </div>
                      <h2 className="text-base font-black text-slate-950 uppercase">
                        {schoolProfile.schoolName}
                      </h2>
                      <div className="text-xs font-bold text-slate-700">
                        UDISE CODE: {schoolProfile.udiseCode} | DISTRICT: {schoolProfile.district}
                      </div>
                    </div>

                    <div className="p-2.5 rounded bg-slate-100 border border-slate-400 font-extrabold text-slate-950 text-center">
                      विषय: जनाधार सत्यापन (Jan Aadhaar Verification) विसंगति प्रेषण पत्र — कक्षा {selectedClass}
                    </div>

                    <table className="w-full text-left border-collapse border border-slate-400 text-xs">
                      <thead>
                        <tr className="bg-slate-200 font-bold border-b border-slate-400">
                          <th className="border border-slate-400 p-2 text-center">SR</th>
                          <th className="border border-slate-400 p-2">विद्यार्थी नाम</th>
                          <th className="border border-slate-400 p-2">पिता का नाम</th>
                          <th className="border border-slate-400 p-2 text-center">जनाधार स्थिति</th>
                          <th className="border border-slate-400 p-2">विसंगति विवरण / कारण</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredClassStudents.map((std, idx) => (
                          <tr key={std.id} className="border-b border-slate-300">
                            <td className="border border-slate-300 p-2 text-center font-mono">{idx + 1}</td>
                            <td className="border border-slate-300 p-2 font-bold">{std.studentName}</td>
                            <td className="border border-slate-300 p-2">{std.fatherName}</td>
                            <td className="border border-slate-300 p-2 text-center font-extrabold">
                              {std.janAadhaarStatus || 'Verified'}
                            </td>
                            <td className="border border-slate-300 p-2 text-slate-700">
                              {std.janAadhaarReason || (std.janAadhaarStatus === 'Verified' ? 'सफलतापूर्वक सत्यापित' : 'परिवार जनाधार अप्राप्त')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    <div className="pt-10 grid grid-cols-2 text-center text-xs font-bold text-slate-900 border-t border-slate-300">
                      <div>
                        <div className="h-10"></div>
                        <div>शाला दर्पण प्रभारी के हस्ताक्षर</div>
                        <div className="text-[10px] text-slate-600 font-normal">(Shala Darpan Incharge Signature)</div>
                      </div>
                      <div>
                        <div className="h-10"></div>
                        <div className="text-emerald-950 font-extrabold underline">{classTeacherProfile.teacherName}</div>
                        <div className="text-[10px] text-slate-800 font-extrabold">(कक्षा अध्यापक के हस्ताक्षर)</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SUB-COMPONENT 8: EXPORT DATA */}
              {activeSubComponent === 'exportData' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800">
                    <h4 className="font-black text-sm text-rose-950 dark:text-rose-200 flex items-center gap-1.5 mb-1">
                      <Download className="w-5 h-5 text-rose-600" />
                      <span>8. छात्र नामावली एवं अंक विवरण डाटा निर्यात (Data Export & Share)</span>
                    </h4>
                    <p className="text-xs text-rose-800 dark:text-rose-300">
                      अन्य विषय अध्यापकों एवं संस्था प्रधान हेतु छात्र मास्टर लिस्ट एवं अंकतालिका बैकअप CSV तथा JSON प्रारूप में डाउनलोड करें।
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="p-3 rounded-xl bg-emerald-100 text-emerald-800 font-bold">
                          <FileText className="w-6 h-6" />
                        </div>
                        <div>
                          <h5 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">CSV Excel Sheet Export</h5>
                          <p className="text-xs text-slate-500">Student master list with verification statuses</p>
                        </div>
                      </div>
                      <button
                        onClick={handleExportCsv}
                        className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs flex items-center justify-center space-x-2 shadow-sm"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download Master List (.CSV)</span>
                      </button>
                    </div>

                    <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="p-3 rounded-xl bg-slate-900 text-amber-300 font-bold">
                          <FileJson className="w-6 h-6" />
                        </div>
                        <div>
                          <h5 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">JSON System Database Export</h5>
                          <p className="text-xs text-slate-500">Full result feed and marks database backup</p>
                        </div>
                      </div>
                      <button
                        onClick={handleExportJson}
                        className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-950 text-amber-300 font-black text-xs flex items-center justify-center space-x-2 shadow-sm"
                      >
                        <FileJson className="w-4 h-4" />
                        <span>Export Full Backup (.JSON)</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

        </div>
      )}


      {/* 3. SUBJECT TEACHER (विषय अध्यापक) MODULE */}
      {activeRole === 'subjectTeacher' && (
        <div className="space-y-6">
          {/* Active Context Selection & Quick Switch Toolbar */}
          <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl p-4 sm:p-5 text-white shadow-xl border border-blue-700/50 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-xl bg-blue-500/20 border border-blue-400/30 text-blue-300">
                  <PenTool className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base tracking-wide flex items-center gap-2">
                    <span>{lang === 'hi' ? 'विषय अध्यापक डैशबोर्ड एवं नियंत्रण कक्ष' : 'Subject Teacher Dashboard & Context Control'}</span>
                  </h3>
                  <p className="text-[11px] text-blue-200">
                    {lang === 'hi' ? 'आवंटित विषय, कक्षा एवं वर्ग हेतु समेकित प्रबंधन सह उपकरण' : 'Active Context: Class, Section, and Subject Data Management'}
                  </p>
                </div>
              </div>
              {activeSubComponent !== null && (
                <button
                  onClick={() => setActiveSubComponent(null)}
                  className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-black text-xs flex items-center space-x-1.5 transition-all cursor-pointer border border-white/20"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>{lang === 'hi' ? 'डैशबोर्ड ग्रिड' : 'Grid Dashboard'}</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-1">
              {/* Teacher Name */}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-blue-300 uppercase tracking-wider">
                  {lang === 'hi' ? 'विषय अध्यापक नाम' : 'Teacher Name'}
                </label>
                <input
                  type="text"
                  value={subjectTeacherProfile.teacherName}
                  onChange={(e) => {
                    const updated = { ...subjectTeacherProfile, teacherName: e.target.value };
                    setSubjectTeacherProfile(updated);
                    localStorage.setItem('peeo_subject_teacher_profile', JSON.stringify(updated));
                  }}
                  className="w-full bg-slate-900/80 border border-blue-500/40 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-blue-400"
                  placeholder="Subject Teacher Name"
                />
              </div>

              {/* Class Dropdown */}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-blue-300 uppercase tracking-wider">
                  {lang === 'hi' ? 'आवंटित कक्षा' : 'Class Assigned'}
                </label>
                <select
                  value={subjectTeacherProfile.assignedClass}
                  onChange={(e) => {
                    const updated = { ...subjectTeacherProfile, assignedClass: e.target.value };
                    setSubjectTeacherProfile(updated);
                    localStorage.setItem('peeo_subject_teacher_profile', JSON.stringify(updated));
                    setSelectedSubjectClass(`${e.target.value}-${subjectTeacherProfile.section}`);
                  }}
                  className="w-full bg-slate-900/80 border border-blue-500/40 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-blue-400"
                >
                  {Array.from({ length: 12 }, (_, i) => `Class ${i + 1}`).map(cls => (
                    <option key={cls} value={cls} className="bg-slate-900 text-white">{cls}</option>
                  ))}
                </select>
              </div>

              {/* Section Dropdown */}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-blue-300 uppercase tracking-wider">
                  {lang === 'hi' ? 'वर्ग (Section)' : 'Section'}
                </label>
                <select
                  value={subjectTeacherProfile.section}
                  onChange={(e) => {
                    const updated = { ...subjectTeacherProfile, section: e.target.value };
                    setSubjectTeacherProfile(updated);
                    localStorage.setItem('peeo_subject_teacher_profile', JSON.stringify(updated));
                    setSelectedSubjectClass(`${subjectTeacherProfile.assignedClass}-${e.target.value}`);
                  }}
                  className="w-full bg-slate-900/80 border border-blue-500/40 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-blue-400"
                >
                  {['A', 'B', 'C', 'D'].map(sec => (
                    <option key={sec} value={sec} className="bg-slate-900 text-white">Section {sec}</option>
                  ))}
                </select>
              </div>

              {/* Subject Dropdown */}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-blue-300 uppercase tracking-wider">
                  {lang === 'hi' ? 'विषय (Subject Taught)' : 'Subject Taught'}
                </label>
                <select
                  value={subjectTeacherProfile.subjectTaught}
                  onChange={(e) => {
                    const updated = { ...subjectTeacherProfile, subjectTaught: e.target.value };
                    setSubjectTeacherProfile(updated);
                    localStorage.setItem('peeo_subject_teacher_profile', JSON.stringify(updated));
                    setSelectedSubject(e.target.value);
                  }}
                  className="w-full bg-slate-900/80 border border-blue-500/40 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-blue-400"
                >
                  <option value="Hindi" className="bg-slate-900 text-white">Hindi (हिंदी)</option>
                  <option value="English" className="bg-slate-900 text-white">English (अंग्रेजी)</option>
                  <option value="Mathematics" className="bg-slate-900 text-white">Mathematics (गणित)</option>
                  <option value="Science" className="bg-slate-900 text-white">Science (विज्ञान)</option>
                  <option value="Social Science" className="bg-slate-900 text-white">Social Science (सामाजिक विज्ञान)</option>
                  <option value="Third Language (Sanskrit)" className="bg-slate-900 text-white">Third Language (संस्कृत)</option>
                  <option value="Health & Physical Edu" className="bg-slate-900 text-white">Health & Physical Edu (शारीरिक शिक्षा)</option>
                  <option value="IT/Computer" className="bg-slate-900 text-white">IT/Computer (सूचना प्रौद्योगिकी)</option>
                </select>
              </div>
            </div>
          </div>

          {/* 5-MODULE DASHBOARD GRID VIEW */}
          {activeSubComponent === null && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {/* Module 1: Add / Import Student Data */}
                <ThreeDCard
                  onClick={() => setActiveSubComponent('addImportStudent')}
                  icon="users"
                  bgTint="bg-blue-50 dark:bg-blue-950/40"
                  label={lang === 'hi' ? '१. छात्र आयात व प्रविष्टि' : '1. Add / Import Student Data'}
                />

                {/* Module 2: Marks Feed Engine */}
                <ThreeDCard
                  onClick={() => setActiveSubComponent('marksFeed')}
                  icon="calculator"
                  bgTint="bg-purple-50 dark:bg-purple-950/40"
                  label={lang === 'hi' ? '२. विषयवार अंक प्रविष्टि' : '2. Marks Feed Engine'}
                />

                {/* Module 3: Mark Table Generator */}
                <ThreeDCard
                  onClick={() => setActiveSubComponent('markTable')}
                  icon="coupon"
                  bgTint="bg-emerald-50 dark:bg-emerald-950/40"
                  label={lang === 'hi' ? '३. अंकतालिका जनरेटर' : '3. Mark Table Generator'}
                />

                {/* Module 4: Greensheet Generator */}
                <ThreeDCard
                  onClick={() => setActiveSubComponent('greensheet')}
                  icon="award"
                  bgTint="bg-amber-50 dark:bg-amber-950/40"
                  label={lang === 'hi' ? '४. ग्रीनशीट जनरेटर' : '4. Greensheet Generator'}
                />

                {/* Module 5: Export Data to Other Teachers */}
                <ThreeDCard
                  onClick={() => setActiveSubComponent('exportDataSubject')}
                  icon="send"
                  bgTint="bg-indigo-50 dark:bg-indigo-950/40"
                  label={lang === 'hi' ? '५. डेटा साझा करें' : '5. Export Data to Other Teachers'}
                />

                {/* Secondary Component: Diagnostic & Remedial */}
                <ThreeDCard
                  onClick={() => setActiveSubComponent('remedial')}
                  icon="target"
                  bgTint="bg-slate-50 dark:bg-slate-800/60"
                  label={lang === 'hi' ? '६. डायग्नोस्टिक व उपचारात्मक' : '6. Diagnostic & Remedial Log'}
                />
              </div>
            </div>
          )}

          {/* SUB-COMPONENT DETAILED VIEWS */}
          {activeSubComponent !== null && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-6 shadow-lg border border-slate-200 dark:border-slate-800 space-y-6">
              
              {/* SUBMODULE 1: ADD / IMPORT STUDENT DATA */}
              {activeSubComponent === 'addImportStudent' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                    <h4 className="font-extrabold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <UserPlus className="w-5 h-5 text-blue-600" />
                      <span>{lang === 'hi' ? 'मॉड्यूल 1: छात्र आयात एवं हस्तचालित प्रविष्टि' : 'Module 1: Add / Import Student Data'}</span>
                    </h4>
                    <span className="text-xs font-bold text-slate-500">
                      Active: {subjectTeacherProfile.assignedClass}-{subjectTeacherProfile.section} ({subjectTeacherProfile.subjectTaught})
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Option A: Import Controls */}
                    <div className="p-5 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 space-y-4">
                      <h5 className="font-extrabold text-sm text-blue-900 dark:text-blue-200 flex items-center gap-2">
                        <Upload className="w-4 h-4 text-blue-600" />
                        <span>{lang === 'hi' ? 'विकल्प A: नामावली आयात (Import Roster)' : 'Option A: Import Roster Data'}</span>
                      </h5>
                      <p className="text-xs text-slate-600 dark:text-slate-300">
                        {lang === 'hi' ? 'कक्षा अध्यापक द्वारा निर्यातित JSON/CSV फाइल अपलोड करें अथवा वर्तमान मास्टर सूची से सीधे सिंक करें।' : 'Upload JSON file exported by Class Teacher or sync directly from the master list.'}
                      </p>

                      <div className="space-y-3 pt-2">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                            {lang === 'hi' ? 'JSON/CSV फाइल का चयन करें:' : 'Select JSON/CSV File:'}
                          </label>
                          <input
                            type="file"
                            accept=".json,.csv"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                try {
                                  const parsed = JSON.parse(event.target?.result as string);
                                  const newStudentsList = parsed.students || (Array.isArray(parsed) ? parsed : []);
                                  if (newStudentsList.length > 0) {
                                    const merged = [...students];
                                    newStudentsList.forEach((st: any) => {
                                      if (!merged.some(m => m.srNo === st.srNo)) {
                                        merged.push({
                                          srNo: st.srNo || String(Date.now()).slice(-4),
                                          rollNo: st.rollNo || '101',
                                          studentName: st.studentName || st.name || 'Imported Student',
                                          fatherName: st.fatherName || 'Father Name',
                                          motherName: 'Mother Name',
                                          className: `${subjectTeacherProfile.assignedClass}-${subjectTeacherProfile.section}`,
                                          gender: st.gender || 'Male',
                                          category: st.category || 'GEN',
                                          aadhaarStatus: st.aadhaarStatus || 'Verified',
                                          janAadhaarStatus: st.janAadhaarStatus || 'Verified',
                                          apaarStatus: st.apaarStatus || 'Generated',
                                          marks: st.marks || {}
                                        });
                                      }
                                    });
                                    onUpdateStudents(merged);
                                    localStorage.setItem('peeo_class_teacher_students', JSON.stringify(merged));
                                    alert(lang === 'hi' ? `${newStudentsList.length} विद्यार्थियों का डाटा आयात हुआ!` : `Imported ${newStudentsList.length} student records!`);
                                  }
                                } catch (err) {
                                  alert('Invalid JSON file format.');
                                }
                              };
                              reader.readAsText(file);
                            }}
                            className="w-full text-xs text-slate-600 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-2 cursor-pointer"
                          />
                        </div>

                        <div className="pt-2">
                          <button
                            onClick={() => {
                              const targetClass = `${subjectTeacherProfile.assignedClass}-${subjectTeacherProfile.section}`;
                              const matched = students.filter(s => s.className === targetClass || s.className === subjectTeacherProfile.assignedClass);
                              alert(lang === 'hi' ? `मास्टर सूची से ${matched.length > 0 ? matched.length : students.length} छात्र रिकॉर्ड सिंक हुए!` : `Synced ${matched.length > 0 ? matched.length : students.length} student records from master list!`);
                            }}
                            className="w-full py-2.5 px-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-extrabold text-xs flex items-center justify-center space-x-2 shadow-sm cursor-pointer"
                          >
                            <RotateCcw className="w-4 h-4" />
                            <span>{lang === 'hi' ? 'मास्टर नामावली से सीधे सिंक करें' : 'Sync Direct from Master Roster'}</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Option B: Manual Student Entry Form */}
                    <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                      <h5 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        <Plus className="w-4 h-4 text-emerald-600" />
                        <span>{lang === 'hi' ? 'विकल्प B: नया छात्र जोड़ें (Manual Entry)' : 'Option B: Manual Student Entry'}</span>
                      </h5>

                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          const targetClass = `${subjectTeacherProfile.assignedClass}-${subjectTeacherProfile.section}`;
                          const newStd: StudentResult = {
                            id: `std_${Date.now()}`,
                            srNo: newSrNo || String(Date.now()).slice(-4),
                            rollNo: newRollNo || String(students.length + 101),
                            studentName: newName || 'New Student',
                            fatherName: newFatherName || 'Father Name',
                            className: targetClass,
                            section: subjectTeacherProfile.section,
                            gender: newGender,
                            category: newCategory,
                            aadhaarStatus: aadhaarAvailable ? (aadhaarAuthenticated ? 'Verified' : 'Pending') : 'Mismatch',
                            janAadhaarStatus: janAadhaarAvailable ? (janAadhaarAuthenticated ? 'Verified' : 'Pending') : 'Mismatch',
                            apaarStatus: apaarCreated ? 'Generated' : 'Consent Pending',
                            marks: [{ subject: subjectTeacherProfile.subjectTaught, maxMarks: 100, obtainedMarks: 80 }]
                          };

                          const updatedList = [...students, newStd];
                          onUpdateStudents(updatedList);
                          localStorage.setItem('peeo_class_teacher_students', JSON.stringify(updatedList));

                          setNewName('');
                          setNewFatherName('');
                          setNewSrNo(String(Number(newSrNo) + 1));
                          setNewRollNo(String(Number(newRollNo) + 1));
                          alert(lang === 'hi' ? 'विद्यार्थी सफलतापूर्वक जोड़ा गया!' : 'Student added successfully!');
                        }}
                        className="space-y-3"
                      >
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase">SR No</label>
                            <input
                              type="text"
                              value={newSrNo}
                              onChange={(e) => setNewSrNo(e.target.value)}
                              className="w-full text-xs p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
                              required
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase">Roll No</label>
                            <input
                              type="text"
                              value={newRollNo}
                              onChange={(e) => setNewRollNo(e.target.value)}
                              className="w-full text-xs p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase">{lang === 'hi' ? 'विद्यार्थी का नाम' : 'Student Name'}</label>
                          <input
                            type="text"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            placeholder="e.g. Ramesh Gurjar"
                            className="w-full text-xs p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
                            required
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase">{lang === 'hi' ? 'पिता का नाम' : "Father's Name"}</label>
                          <input
                            type="text"
                            value={newFatherName}
                            onChange={(e) => setNewFatherName(e.target.value)}
                            placeholder="e.g. Shri Mohan Lal Gurjar"
                            className="w-full text-xs p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
                            required
                          />
                        </div>

                        {/* Privacy & Verification Flags */}
                        <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-[11px] space-y-1">
                          <p className="font-extrabold text-amber-900 dark:text-amber-300 flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>{lang === 'hi' ? 'गोपनीयता नीति:' : 'Privacy Notice:'}</span>
                          </p>
                          <p className="text-amber-800 dark:text-amber-200 leading-tight">
                            {lang === 'hi' ? 'केवल सत्यापन स्थिति (Verified/Pending) सहेजें; राष्ट्रीय पहचान संख्या (Aadhaar/JanAadhaar) दर्ज न करें।' : 'Track verification flags only; do not record raw national ID numbers.'}
                          </p>
                        </div>

                        <button
                          type="submit"
                          className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs flex items-center justify-center space-x-1.5 shadow-md cursor-pointer"
                        >
                          <UserPlus className="w-4 h-4" />
                          <span>{lang === 'hi' ? 'नामावली में छात्र जोड़ें' : 'Add Student to Roster'}</span>
                        </button>
                      </form>
                    </div>
                  </div>

                  {/* Active Student Roster Display */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between">
                      <h5 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
                        {lang === 'hi' ? `वर्तमान पंजीकृत छात्र नामावली (${subjectTeacherProfile.assignedClass}-${subjectTeacherProfile.section})` : `Active Enrolled Students (${subjectTeacherProfile.assignedClass}-${subjectTeacherProfile.section})`}
                      </h5>
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        Total: {students.filter(s => s.className === `${subjectTeacherProfile.assignedClass}-${subjectTeacherProfile.section}` || s.className === subjectTeacherProfile.assignedClass).length} Students
                      </span>
                    </div>

                    <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-extrabold uppercase">
                          <tr>
                            <th className="py-2.5 px-3">SR No</th>
                            <th className="py-2.5 px-3">Roll No</th>
                            <th className="py-2.5 px-3">Student Name</th>
                            <th className="py-2.5 px-3">Father's Name</th>
                            <th className="py-2.5 px-3">Aadhaar Status</th>
                            <th className="py-2.5 px-3">JanAadhaar Status</th>
                            <th className="py-2.5 px-3">APAAR ID Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                          {((students.filter(s => s.className === `${subjectTeacherProfile.assignedClass}-${subjectTeacherProfile.section}` || s.className === subjectTeacherProfile.assignedClass).length > 0)
                            ? students.filter(s => s.className === `${subjectTeacherProfile.assignedClass}-${subjectTeacherProfile.section}` || s.className === subjectTeacherProfile.assignedClass)
                            : [
                                { srNo: '1410', rollNo: '601', studentName: 'Anita Gurjar', fatherName: 'Mohan Lal', aadhaarStatus: 'Verified', janAadhaarStatus: 'Verified', apaarStatus: 'Generated' },
                                { srNo: '1411', rollNo: '602', studentName: 'Arti Kanwar Rathor', fatherName: 'Singh Rathor', aadhaarStatus: 'Verified', janAadhaarStatus: 'Verified', apaarStatus: 'Generated' },
                                { srNo: '1412', rollNo: '603', studentName: 'Vikram Meena', fatherName: 'Ramprasad Meena', aadhaarStatus: 'Verified', janAadhaarStatus: 'Verified', apaarStatus: 'Generated' },
                                { srNo: '1413', rollNo: '604', studentName: 'Priyanka Gurjar', fatherName: 'Devkishan', aadhaarStatus: 'Verified', janAadhaarStatus: 'Verified', apaarStatus: 'Generated' },
                                { srNo: '1414', rollNo: '605', studentName: 'Aarav Sharma', fatherName: 'Suresh Sharma', aadhaarStatus: 'Verified', janAadhaarStatus: 'Verified', apaarStatus: 'Generated' },
                                { srNo: '1415', rollNo: '606', studentName: 'Ananya Kanwar', fatherName: 'Gajendra Singh', aadhaarStatus: 'Verified', janAadhaarStatus: 'Verified', apaarStatus: 'Generated' }
                              ]
                          ).map((std) => (
                            <tr key={std.srNo} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                              <td className="py-2 px-3 font-bold">{std.srNo}</td>
                              <td className="py-2 px-3 font-bold">{std.rollNo}</td>
                              <td className="py-2 px-3 font-extrabold text-slate-900 dark:text-slate-100">{std.studentName}</td>
                              <td className="py-2 px-3 text-slate-600 dark:text-slate-400">{std.fatherName}</td>
                              <td className="py-2 px-3">
                                <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                                  {std.aadhaarStatus || 'Verified'}
                                </span>
                              </td>
                              <td className="py-2 px-3">
                                <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                                  {std.janAadhaarStatus || 'Verified'}
                                </span>
                              </td>
                              <td className="py-2 px-3">
                                <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 text-[10px] font-bold">
                                  {std.apaarStatus || 'Generated'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* SUBMODULE 2: MARKS FEED ENGINE */}
              {activeSubComponent === 'marksFeed' && (
                <div className="space-y-6">
                  <div className="p-4 rounded-2xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h4 className="font-extrabold text-sm text-purple-900 dark:text-purple-200 flex items-center gap-2">
                        <PenTool className="w-4 h-4 text-purple-600" />
                        <span>{lang === 'hi' ? 'मॉड्यूल 2: विषयवार अंक फीडिंग नियंत्रण बोर्ड' : 'Module 2: Marks Feed Engine Controls'}</span>
                      </h4>
                      {subjectSaveStatus && (
                        <span className="px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 text-xs font-bold animate-pulse flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>{subjectSaveStatus}</span>
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                      {/* Exam Selector */}
                      <div className="space-y-1">
                        <label className="text-[11px] font-extrabold text-slate-700 dark:text-slate-300 uppercase">
                          {lang === 'hi' ? 'परीक्षा चयन (Exam Type)' : 'Select Exam Type'}
                        </label>
                        <select
                          value={subjectExamType}
                          onChange={(e) => {
                            const val = e.target.value;
                            setSubjectExamType(val);
                            if (val === '1st Test' || val === '2nd Test' || val === '3rd Test') {
                              setSubjectMaxMarks(10);
                            } else if (val === 'Half Yearly') {
                              setSubjectMaxMarks(70);
                            } else if (val === 'Yearly / Annual') {
                              setSubjectMaxMarks(80);
                            }
                          }}
                          className="w-full font-bold text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100"
                        >
                          <option value="1st Test">1st Test (प्रथम परख) [Max 10]</option>
                          <option value="2nd Test">2nd Test (द्वितीय परख) [Max 10]</option>
                          <option value="Half Yearly">Half Yearly (अर्द्धवार्षिक) [Max 70]</option>
                          <option value="3rd Test">3rd Test (तृतीय परख) [Max 10]</option>
                          <option value="Yearly / Annual">Yearly / Annual (वार्षिक) [Max 80]</option>
                        </select>
                      </div>

                      {/* Maximum Marks */}
                      <div className="space-y-1">
                        <label className="text-[11px] font-extrabold text-slate-700 dark:text-slate-300 uppercase">
                          {lang === 'hi' ? 'पूर्णांक (Maximum Marks)' : 'Maximum Marks'}
                        </label>
                        <input
                          type="number"
                          value={subjectMaxMarks}
                          onChange={(e) => setSubjectMaxMarks(Number(e.target.value) || 10)}
                          className="w-full font-bold text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100"
                          min={1}
                          max={100}
                        />
                      </div>

                      {/* Active Parameters Display */}
                      <div className="space-y-1 sm:col-span-2 flex flex-col justify-center bg-white/60 dark:bg-slate-900/60 p-2.5 rounded-xl border border-purple-200 dark:border-purple-800 text-xs font-bold text-slate-800 dark:text-slate-200">
                        <div className="flex justify-between">
                          <span>Class: {subjectTeacherProfile.assignedClass}-{subjectTeacherProfile.section}</span>
                          <span>Subject: {subjectTeacherProfile.subjectTaught}</span>
                        </div>
                        <div className="text-slate-500 text-[11px] mt-0.5">
                          Teacher: {subjectTeacherProfile.teacherName}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Student Marks Feed Roster Grid */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h5 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
                        {lang === 'hi' ? `विद्यार्थी अंक प्रविष्टि ग्रिड (${subjectExamType} - Max Marks: ${subjectMaxMarks})` : `Student Marks Feed Roster (${subjectExamType} - Max Marks: ${subjectMaxMarks})`}
                      </h5>
                      <button
                        onClick={() => {
                          localStorage.setItem('peeo_subject_marks_tabulation', JSON.stringify(subjectMarksMap));
                          setSubjectSaveStatus(lang === 'hi' ? 'अंक सहेजे गए!' : 'Marks Saved!');
                          setTimeout(() => setSubjectSaveStatus(null), 2500);
                        }}
                        className="py-2 px-4 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-extrabold text-xs flex items-center space-x-1.5 shadow-md cursor-pointer"
                      >
                        <Save className="w-4 h-4" />
                        <span>{lang === 'hi' ? 'अंक फीड सहेजें' : 'Save Marks Feed'}</span>
                      </button>
                    </div>

                    <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-extrabold uppercase">
                          <tr>
                            <th className="py-2.5 px-3 w-14 text-center">S.NO.</th>
                            <th className="py-2.5 px-3 w-20 text-center">ROLL NO</th>
                            <th className="py-2.5 px-3 w-24 text-center">SR NO</th>
                            <th className="py-2.5 px-3">STUDENT NAME</th>
                            <th className="py-2.5 px-3 w-64 text-center">MARKS OBTAINED (0 - {subjectMaxMarks})</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                          {((students.filter(s => s.className === `${subjectTeacherProfile.assignedClass}-${subjectTeacherProfile.section}` || s.className === subjectTeacherProfile.assignedClass).length > 0)
                            ? students.filter(s => s.className === `${subjectTeacherProfile.assignedClass}-${subjectTeacherProfile.section}` || s.className === subjectTeacherProfile.assignedClass)
                            : [
                                { srNo: '1410', rollNo: '601', studentName: 'Anita Gurjar' },
                                { srNo: '1411', rollNo: '602', studentName: 'Arti Kanwar Rathor' },
                                { srNo: '1412', rollNo: '603', studentName: 'Vikram Meena' },
                                { srNo: '1413', rollNo: '604', studentName: 'Priyanka Gurjar' },
                                { srNo: '1414', rollNo: '605', studentName: 'Aarav Sharma' },
                                { srNo: '1415', rollNo: '606', studentName: 'Ananya Kanwar' }
                              ]
                          ).map((std, idx) => {
                            const markVal = subjectMarksMap[std.srNo] !== undefined ? subjectMarksMap[std.srNo] : '';
                            const isNumeric = typeof markVal === 'number' || (typeof markVal === 'string' && markVal !== '' && !isNaN(Number(markVal)));
                            const numVal = isNumeric ? Number(markVal) : null;
                            const isInvalid = numVal !== null && (numVal < 0 || numVal > subjectMaxMarks);

                            return (
                              <tr key={std.srNo} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                <td className="py-2 px-3 text-center font-bold text-slate-600">{idx + 1}</td>
                                <td className="py-2 px-3 text-center font-bold">{std.rollNo || (601 + idx)}</td>
                                <td className="py-2 px-3 text-center font-bold text-slate-500">{std.srNo}</td>
                                <td className="py-2 px-3 font-extrabold text-slate-900 dark:text-slate-100">{std.studentName}</td>
                                <td className="py-2 px-3 text-center">
                                  <div className="flex items-center justify-center space-x-2">
                                    <input
                                      type="text"
                                      value={markVal}
                                      onChange={(e) => {
                                        const val = e.target.value.toUpperCase();
                                        const newMap = { ...subjectMarksMap, [std.srNo]: val };
                                        setSubjectMarksMap(newMap);
                                        localStorage.setItem('peeo_subject_marks_tabulation', JSON.stringify(newMap));
                                        setSubjectSaveStatus(lang === 'hi' ? 'स्वतः सहेजा गया' : 'Auto-Saved');
                                        setTimeout(() => setSubjectSaveStatus(null), 2000);
                                      }}
                                      placeholder={`0 - ${subjectMaxMarks}`}
                                      className={`w-28 text-center font-extrabold text-xs py-1.5 px-2 rounded-lg border ${
                                        isInvalid
                                          ? 'border-red-500 bg-red-50 text-red-900'
                                          : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100'
                                      } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                                    />
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const newMap = { ...subjectMarksMap, [std.srNo]: 'AB' };
                                        setSubjectMarksMap(newMap);
                                        localStorage.setItem('peeo_subject_marks_tabulation', JSON.stringify(newMap));
                                      }}
                                      className="px-2 py-1 rounded bg-amber-100 text-amber-800 text-[10px] font-black hover:bg-amber-200 cursor-pointer"
                                    >
                                      AB
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const newMap = { ...subjectMarksMap, [std.srNo]: 'MED' };
                                        setSubjectMarksMap(newMap);
                                        localStorage.setItem('peeo_subject_marks_tabulation', JSON.stringify(newMap));
                                      }}
                                      className="px-2 py-1 rounded bg-purple-100 text-purple-800 text-[10px] font-black hover:bg-purple-200 cursor-pointer"
                                    >
                                      MED
                                    </button>
                                  </div>
                                  {isInvalid && (
                                    <p className="text-[10px] text-red-600 font-bold mt-0.5">
                                      Marks must be between 0 and {subjectMaxMarks}
                                    </p>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* SUBMODULE 3: MARK TABLE GENERATOR */}
              {activeSubComponent === 'markTable' && (
                <div className="space-y-6">
                  {/* Official Reference Document Header Mapping */}
                  <div id="subject-marksheet-print-area" className="p-6 rounded-2xl bg-white dark:bg-slate-950 border-2 border-slate-300 dark:border-slate-700 shadow-md space-y-4 print:p-0 print:border-none">
                    <div className="text-center space-y-1 border-b-2 border-slate-900 dark:border-slate-100 pb-3">
                      <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100 uppercase tracking-wide">
                        {schoolProfile.schoolName || 'SMT. RATAN KUNWAR VIJAY SINGH RAO GSSS AIDANA'}
                      </h2>
                      <h3 className="text-xs sm:text-sm font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-widest">
                        {subjectExamType.toUpperCase()} 2026-27
                      </h3>
                      <div className="mt-2 py-1.5 px-4 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg flex flex-wrap items-center justify-between font-extrabold text-xs text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                        <span>SUB: {subjectTeacherProfile.subjectTaught.toUpperCase()}</span>
                        <span>CLASS: {subjectTeacherProfile.assignedClass}-{subjectTeacherProfile.section}</span>
                        <span>M.M: {subjectMaxMarks}</span>
                      </div>
                    </div>

                    {/* Tabular Data Grid */}
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse border border-slate-300 dark:border-slate-700 text-xs">
                        <thead>
                          <tr className="bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-extrabold uppercase text-center">
                            <th className="border border-slate-300 dark:border-slate-700 py-2.5 px-3 w-16">S NO.</th>
                            <th className="border border-slate-300 dark:border-slate-700 py-2.5 px-3 w-28">ROLL NO</th>
                            <th className="border border-slate-300 dark:border-slate-700 py-2.5 px-3 text-left">NAME</th>
                            <th className="border border-slate-300 dark:border-slate-700 py-2.5 px-3 w-48 text-center">MARKS</th>
                          </tr>
                        </thead>
                        <tbody>
                          {((students.filter(s => s.className === `${subjectTeacherProfile.assignedClass}-${subjectTeacherProfile.section}` || s.className === subjectTeacherProfile.assignedClass).length > 0)
                            ? students.filter(s => s.className === `${subjectTeacherProfile.assignedClass}-${subjectTeacherProfile.section}` || s.className === subjectTeacherProfile.assignedClass)
                            : [
                                { srNo: '1410', rollNo: '601', studentName: 'Anita Gurjar' },
                                { srNo: '1411', rollNo: '602', studentName: 'Arti Kanwar Rathor' },
                                { srNo: '1412', rollNo: '603', studentName: 'Vikram Meena' },
                                { srNo: '1413', rollNo: '604', studentName: 'Priyanka Gurjar' },
                                { srNo: '1414', rollNo: '605', studentName: 'Aarav Sharma' },
                                { srNo: '1415', rollNo: '606', studentName: 'Ananya Kanwar' }
                              ]
                          ).map((std, idx) => (
                            <tr key={std.srNo} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                              <td className="border border-slate-300 dark:border-slate-700 py-2 px-3 text-center font-extrabold">{idx + 1}</td>
                              <td className="border border-slate-300 dark:border-slate-700 py-2 px-3 text-center font-bold">{std.rollNo || (601 + idx)}</td>
                              <td className="border border-slate-300 dark:border-slate-700 py-2 px-3 font-extrabold">{std.studentName}</td>
                              <td className="border border-slate-300 dark:border-slate-700 py-2 px-3 text-center font-black">
                                {subjectMarksMap[std.srNo] !== undefined ? subjectMarksMap[std.srNo] : '-'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Official Signature Block Footer */}
                    <div className="pt-10 flex items-center justify-between font-extrabold text-xs text-slate-800 dark:text-slate-200">
                      <div className="text-center space-y-1">
                        <p className="border-t border-slate-900 dark:border-slate-100 pt-2 px-6">
                          {lang === 'hi' ? 'विषय अध्यापक के हस्ताक्षर' : 'Subject Teacher Signature'}
                        </p>
                        <p className="text-[10px] font-bold text-slate-500">({subjectTeacherProfile.teacherName} - {subjectTeacherProfile.subjectTaught})</p>
                      </div>

                      <div className="text-center space-y-1">
                        <p className="border-t border-slate-900 dark:border-slate-100 pt-2 px-6">
                          {lang === 'hi' ? 'प्रतिहस्ताक्षर (कक्षा अध्यापक / संस्था प्रधान)' : 'Class Teacher / Headmaster Counter-Signature'}
                        </p>
                        <p className="text-[10px] font-bold text-slate-500">({schoolProfile.principalName || 'Principal / Headmaster'})</p>
                      </div>
                    </div>
                  </div>

                  {/* Actions Toolbar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <button
                      onClick={() => window.print()}
                      className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-extrabold text-xs flex items-center space-x-2 shadow-sm cursor-pointer"
                    >
                      <Printer className="w-4 h-4 text-emerald-400" />
                      <span>{lang === 'hi' ? 'अंक तालिका प्रिंट करें' : 'Print Mark Sheet'}</span>
                    </button>

                    <button
                      onClick={() => {
                        const activeList = (students.filter(s => s.className === `${subjectTeacherProfile.assignedClass}-${subjectTeacherProfile.section}` || s.className === subjectTeacherProfile.assignedClass).length > 0)
                          ? students.filter(s => s.className === `${subjectTeacherProfile.assignedClass}-${subjectTeacherProfile.section}` || s.className === subjectTeacherProfile.assignedClass)
                          : [
                              { srNo: '1410', rollNo: '601', studentName: 'Anita Gurjar' },
                              { srNo: '1411', rollNo: '602', studentName: 'Arti Kanwar Rathor' },
                              { srNo: '1412', rollNo: '603', studentName: 'Vikram Meena' },
                              { srNo: '1413', rollNo: '604', studentName: 'Priyanka Gurjar' },
                              { srNo: '1414', rollNo: '605', studentName: 'Aarav Sharma' },
                              { srNo: '1415', rollNo: '606', studentName: 'Ananya Kanwar' }
                            ];

                        const rows = activeList.map((s, idx) => ({
                          sNo: idx + 1,
                          rollNo: s.rollNo || (601 + idx).toString(),
                          studentName: s.studentName,
                          marks: subjectMarksMap[s.srNo] !== undefined ? subjectMarksMap[s.srNo] : '-'
                        }));

                        generateSubjectMarkSheetPdf(
                          schoolProfile,
                          subjectExamType,
                          `${subjectTeacherProfile.assignedClass}-${subjectTeacherProfile.section}`,
                          subjectTeacherProfile.subjectTaught,
                          subjectMaxMarks,
                          rows,
                          lang
                        );
                      }}
                      className="py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs flex items-center space-x-2 shadow-sm cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>{lang === 'hi' ? 'PDF डाउनलोड करें' : 'Download Vector PDF'}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* SUBMODULE 4: GREENSHEET GENERATOR */}
              {activeSubComponent === 'greensheet' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                    <h4 className="font-extrabold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <Award className="w-5 h-5 text-amber-600" />
                      <span>{lang === 'hi' ? 'मॉड्यूल 4: विषयवार समेकित ग्रीनशीट जनरेटर' : 'Module 4: Subject Greensheet Generator'}</span>
                    </h4>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-900">
                      Subject: {subjectTeacherProfile.subjectTaught}
                    </span>
                  </div>

                  {/* Greensheet Table Matrix */}
                  <div className="p-6 rounded-2xl bg-white dark:bg-slate-950 border-2 border-slate-300 dark:border-slate-700 shadow-md space-y-4">
                    <div className="text-center space-y-1 border-b-2 border-slate-900 dark:border-slate-100 pb-3">
                      <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100 uppercase">
                        {schoolProfile.schoolName || 'SMT. RATAN KUNWAR VIJAY SINGH RAO GSSS AIDANA'}
                      </h2>
                      <h3 className="text-xs sm:text-sm font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-widest">
                        SUBJECT GREENSHEET (विषयवार समेकित अंक तालिका) - SESSION 2026-27
                      </h3>
                      <div className="mt-2 py-1.5 px-4 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg flex flex-wrap items-center justify-between font-extrabold text-xs text-slate-800 dark:text-slate-200 uppercase">
                        <span>SUBJECT: {subjectTeacherProfile.subjectTaught.toUpperCase()}</span>
                        <span>CLASS: {subjectTeacherProfile.assignedClass}-{subjectTeacherProfile.section}</span>
                        <span>TEACHER: {subjectTeacherProfile.teacherName.toUpperCase()}</span>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse border border-slate-300 dark:border-slate-700 text-xs">
                        <thead>
                          <tr className="bg-amber-800 text-white font-extrabold uppercase text-center">
                            <th className="border border-slate-300 py-2 px-2">S.N.</th>
                            <th className="border border-slate-300 py-2 px-2">ROLL NO</th>
                            <th className="border border-slate-300 py-2 px-3 text-left">STUDENT NAME</th>
                            <th className="border border-slate-300 py-2 px-2">1st Test (10)</th>
                            <th className="border border-slate-300 py-2 px-2">2nd Test (10)</th>
                            <th className="border border-slate-300 py-2 px-2">Half Yearly (70)</th>
                            <th className="border border-slate-300 py-2 px-2">3rd Test (10)</th>
                            <th className="border border-slate-300 py-2 px-2">Yearly (80)</th>
                            <th className="border border-slate-300 py-2 px-2 bg-amber-900">Total (180)</th>
                            <th className="border border-slate-300 py-2 px-2 bg-amber-900">%</th>
                          </tr>
                        </thead>
                        <tbody>
                          {((students.filter(s => s.className === `${subjectTeacherProfile.assignedClass}-${subjectTeacherProfile.section}` || s.className === subjectTeacherProfile.assignedClass).length > 0)
                            ? students.filter(s => s.className === `${subjectTeacherProfile.assignedClass}-${subjectTeacherProfile.section}` || s.className === subjectTeacherProfile.assignedClass)
                            : [
                                { srNo: '1410', rollNo: '601', studentName: 'Anita Gurjar' },
                                { srNo: '1411', rollNo: '602', studentName: 'Arti Kanwar Rathor' },
                                { srNo: '1412', rollNo: '603', studentName: 'Vikram Meena' },
                                { srNo: '1413', rollNo: '604', studentName: 'Priyanka Gurjar' },
                                { srNo: '1414', rollNo: '605', studentName: 'Aarav Sharma' },
                                { srNo: '1415', rollNo: '606', studentName: 'Ananya Kanwar' }
                              ]
                          ).map((std, idx) => {
                            const ctxKey = `${subjectTeacherProfile.subjectTaught}_${subjectTeacherProfile.assignedClass}_${subjectTeacherProfile.section}`;
                            const stdMarks = (subjectAllExamsMarks[ctxKey] && subjectAllExamsMarks[ctxKey][std.srNo]) || {};

                            const t1 = stdMarks['1st Test'] !== undefined ? stdMarks['1st Test'] : (idx % 2 === 0 ? 9 : 8);
                            const t2 = stdMarks['2nd Test'] !== undefined ? stdMarks['2nd Test'] : (idx % 2 === 0 ? 9 : 8);
                            const hy = stdMarks['Half Yearly'] !== undefined ? stdMarks['Half Yearly'] : (60 + idx * 2);
                            const t3 = stdMarks['3rd Test'] !== undefined ? stdMarks['3rd Test'] : (idx % 2 === 0 ? 8 : 9);
                            const yr = stdMarks['Yearly / Annual'] !== undefined ? stdMarks['Yearly / Annual'] : (70 + idx * 2);

                            const n1 = typeof t1 === 'number' ? t1 : (t1 === 'AB' || t1 === 'MED' ? 0 : Number(t1) || 0);
                            const n2 = typeof t2 === 'number' ? t2 : (t2 === 'AB' || t2 === 'MED' ? 0 : Number(t2) || 0);
                            const nhy = typeof hy === 'number' ? hy : (hy === 'AB' || hy === 'MED' ? 0 : Number(hy) || 0);
                            const n3 = typeof t3 === 'number' ? t3 : (t3 === 'AB' || t3 === 'MED' ? 0 : Number(t3) || 0);
                            const nyr = typeof yr === 'number' ? yr : (yr === 'AB' || yr === 'MED' ? 0 : Number(yr) || 0);

                            const grandTotal = n1 + n2 + nhy + n3 + nyr;
                            const pct = ((grandTotal / 180) * 100).toFixed(1);

                            return (
                              <tr key={std.srNo} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                                <td className="border border-slate-300 py-2 px-2 text-center font-bold">{idx + 1}</td>
                                <td className="border border-slate-300 py-2 px-2 text-center font-bold">{std.rollNo || (601 + idx)}</td>
                                <td className="border border-slate-300 py-2 px-3 font-extrabold">{std.studentName}</td>
                                <td className="border border-slate-300 py-2 px-2 text-center font-bold">{t1}</td>
                                <td className="border border-slate-300 py-2 px-2 text-center font-bold">{t2}</td>
                                <td className="border border-slate-300 py-2 px-2 text-center font-bold">{hy}</td>
                                <td className="border border-slate-300 py-2 px-2 text-center font-bold">{t3}</td>
                                <td className="border border-slate-300 py-2 px-2 text-center font-bold">{yr}</td>
                                <td className="border border-slate-300 py-2 px-2 text-center font-black bg-amber-50 dark:bg-amber-950/40">{grandTotal}</td>
                                <td className="border border-slate-300 py-2 px-2 text-center font-black bg-amber-50 dark:bg-amber-950/40">{pct}%</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    {/* Signature Block */}
                    <div className="pt-8 flex items-center justify-between font-extrabold text-xs text-slate-800 dark:text-slate-200">
                      <div className="text-center space-y-1">
                        <p className="border-t border-slate-900 dark:border-slate-100 pt-2 px-6">
                          {lang === 'hi' ? 'विषय अध्यापक के हस्ताक्षर' : 'Subject Teacher Signature'}
                        </p>
                        <p className="text-[10px] font-bold text-slate-500">({subjectTeacherProfile.teacherName} - {subjectTeacherProfile.subjectTaught})</p>
                      </div>

                      <div className="text-center space-y-1">
                        <p className="border-t border-slate-900 dark:border-slate-100 pt-2 px-6">
                          {lang === 'hi' ? 'प्रतिहस्ताक्षर (कक्षा अध्यापक / संस्था प्रधान)' : 'Class Teacher / Headmaster Counter-Signature'}
                        </p>
                        <p className="text-[10px] font-bold text-slate-500">({schoolProfile.principalName || 'Principal / Headmaster'})</p>
                      </div>
                    </div>
                  </div>

                  {/* Actions Toolbar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <button
                      onClick={() => window.print()}
                      className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-extrabold text-xs flex items-center space-x-2 shadow-sm cursor-pointer"
                    >
                      <Printer className="w-4 h-4 text-emerald-400" />
                      <span>{lang === 'hi' ? 'ग्रीनशीट प्रिंट करें' : 'Print Greensheet'}</span>
                    </button>

                    <button
                      onClick={() => {
                        const activeList = (students.filter(s => s.className === `${subjectTeacherProfile.assignedClass}-${subjectTeacherProfile.section}` || s.className === subjectTeacherProfile.assignedClass).length > 0)
                          ? students.filter(s => s.className === `${subjectTeacherProfile.assignedClass}-${subjectTeacherProfile.section}` || s.className === subjectTeacherProfile.assignedClass)
                          : [
                              { srNo: '1410', rollNo: '601', studentName: 'Anita Gurjar' },
                              { srNo: '1411', rollNo: '602', studentName: 'Arti Kanwar Rathor' },
                              { srNo: '1412', rollNo: '603', studentName: 'Vikram Meena' },
                              { srNo: '1413', rollNo: '604', studentName: 'Priyanka Gurjar' },
                              { srNo: '1414', rollNo: '605', studentName: 'Aarav Sharma' },
                              { srNo: '1415', rollNo: '606', studentName: 'Ananya Kanwar' }
                            ];

                        const rows = activeList.map((s, idx) => {
                          const ctxKey = `${subjectTeacherProfile.subjectTaught}_${subjectTeacherProfile.assignedClass}_${subjectTeacherProfile.section}`;
                          const stdMarks = (subjectAllExamsMarks[ctxKey] && subjectAllExamsMarks[ctxKey][s.srNo]) || {};

                          const t1 = stdMarks['1st Test'] !== undefined ? stdMarks['1st Test'] : (idx % 2 === 0 ? 9 : 8);
                          const t2 = stdMarks['2nd Test'] !== undefined ? stdMarks['2nd Test'] : (idx % 2 === 0 ? 9 : 8);
                          const hy = stdMarks['Half Yearly'] !== undefined ? stdMarks['Half Yearly'] : (60 + idx * 2);
                          const t3 = stdMarks['3rd Test'] !== undefined ? stdMarks['3rd Test'] : (idx % 2 === 0 ? 8 : 9);
                          const yr = stdMarks['Yearly / Annual'] !== undefined ? stdMarks['Yearly / Annual'] : (70 + idx * 2);

                          const n1 = typeof t1 === 'number' ? t1 : (t1 === 'AB' || t1 === 'MED' ? 0 : Number(t1) || 0);
                          const n2 = typeof t2 === 'number' ? t2 : (t2 === 'AB' || t2 === 'MED' ? 0 : Number(t2) || 0);
                          const nhy = typeof hy === 'number' ? hy : (hy === 'AB' || hy === 'MED' ? 0 : Number(hy) || 0);
                          const n3 = typeof t3 === 'number' ? t3 : (t3 === 'AB' || t3 === 'MED' ? 0 : Number(t3) || 0);
                          const nyr = typeof yr === 'number' ? yr : (yr === 'AB' || yr === 'MED' ? 0 : Number(yr) || 0);

                          const grandTotal = n1 + n2 + nhy + n3 + nyr;
                          const pct = ((grandTotal / 180) * 100).toFixed(1);

                          return {
                            sNo: idx + 1,
                            rollNo: s.rollNo || (601 + idx).toString(),
                            studentName: s.studentName,
                            t1, t2, hy, t3, yr,
                            total: grandTotal,
                            percentage: pct
                          };
                        });

                        generateSubjectGreensheetPdf(
                          schoolProfile,
                          `${subjectTeacherProfile.assignedClass}-${subjectTeacherProfile.section}`,
                          subjectTeacherProfile.subjectTaught,
                          subjectTeacherProfile.teacherName,
                          rows,
                          lang
                        );
                      }}
                      className="py-2.5 px-4 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-extrabold text-xs flex items-center space-x-2 shadow-sm cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>{lang === 'hi' ? 'ग्रीनशीट PDF डाउनलोड करें' : 'Download Greensheet PDF'}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* SUBMODULE 5: EXPORT DATA TO OTHER TEACHERS */}
              {activeSubComponent === 'exportDataSubject' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                    <h4 className="font-extrabold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <FileJson className="w-5 h-5 text-indigo-600" />
                      <span>{lang === 'hi' ? 'मॉड्यूल 5: अन्य अध्यापकों के साथ डेटा साझा करें' : 'Module 5: Export Data to Other Teachers'}</span>
                    </h4>
                    <span className="text-xs font-bold text-slate-500">
                      Subject: {subjectTeacherProfile.subjectTaught}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* JSON Export Card */}
                    <div className="p-5 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 space-y-3">
                      <h5 className="font-extrabold text-sm text-indigo-900 dark:text-indigo-200 flex items-center gap-2">
                        <FileJson className="w-4 h-4 text-indigo-600" />
                        <span>{lang === 'hi' ? 'JSON बैकअप फाइल एक्सपोर्ट' : 'Export Full JSON Backup'}</span>
                      </h5>
                      <p className="text-xs text-slate-600 dark:text-slate-300">
                        {lang === 'hi' ? 'कक्षा अध्यापक व DDO/PEEO हेतु संपूर्ण विषयानुसार प्राप्तांक एवं छात्र विवरण युक्त JSON फाइल डाउनलोड करें।' : 'Download full JSON file containing subject profile, student roster, and all exam marks.'}
                      </p>
                      <button
                        onClick={() => {
                          const exportObj = {
                            teacherProfile: subjectTeacherProfile,
                            schoolProfile: schoolProfile,
                            timestamp: new Date().toISOString(),
                            students: students.filter(s => s.className === `${subjectTeacherProfile.assignedClass}-${subjectTeacherProfile.section}` || s.className === subjectTeacherProfile.assignedClass),
                            subjectMarksFeed: subjectMarksMap,
                            subjectAllExamsMarks: subjectAllExamsMarks
                          };
                          const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj, null, 2));
                          const anchor = document.createElement('a');
                          anchor.setAttribute("href", dataStr);
                          anchor.setAttribute("download", `${subjectTeacherProfile.subjectTaught}_${subjectTeacherProfile.assignedClass}_${subjectTeacherProfile.section}_Data.json`);
                          document.body.appendChild(anchor);
                          anchor.click();
                          anchor.remove();
                        }}
                        className="w-full py-2.5 px-4 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white font-extrabold text-xs flex items-center justify-center space-x-2 shadow-sm cursor-pointer"
                      >
                        <Download className="w-4 h-4" />
                        <span>{lang === 'hi' ? 'JSON फाइल डाउनलोड करें' : 'Download JSON Data'}</span>
                      </button>
                    </div>

                    {/* CSV Export Card */}
                    <div className="p-5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 space-y-3">
                      <h5 className="font-extrabold text-sm text-emerald-900 dark:text-emerald-200 flex items-center gap-2">
                        <FileCode className="w-4 h-4 text-emerald-600" />
                        <span>{lang === 'hi' ? 'CSV स्प्रेडशीट एक्सपोर्ट (Excel/शाला दर्पण)' : 'Export CSV Spreadsheet'}</span>
                      </h5>
                      <p className="text-xs text-slate-600 dark:text-slate-300">
                        {lang === 'hi' ? 'शाला दर्पण या MS Excel में सिंक करने हेतु छात्र रोल नंबर, नाम व विषयानुसार समस्त प्राप्तांक युक्त CSV स्प्रेडशीट एक्सपोर्ट करें।' : 'Export CSV spreadsheet with student roll numbers, names, and subject test scores.'}
                      </p>
                      <button
                        onClick={() => {
                          const activeList = (students.filter(s => s.className === `${subjectTeacherProfile.assignedClass}-${subjectTeacherProfile.section}` || s.className === subjectTeacherProfile.assignedClass).length > 0)
                            ? students.filter(s => s.className === `${subjectTeacherProfile.assignedClass}-${subjectTeacherProfile.section}` || s.className === subjectTeacherProfile.assignedClass)
                            : [
                                { srNo: '1410', rollNo: '601', studentName: 'Anita Gurjar', fatherName: 'Mohan Lal', gender: 'Female' },
                                { srNo: '1411', rollNo: '602', studentName: 'Arti Kanwar Rathor', fatherName: 'Singh Rathor', gender: 'Female' },
                                { srNo: '1412', rollNo: '603', studentName: 'Vikram Meena', fatherName: 'Ramprasad Meena', gender: 'Male' }
                              ];

                          let csvContent = "data:text/csv;charset=utf-8,";
                          csvContent += "S.No,SR No,Roll No,Student Name,Father Name,Class,Subject,1st Test,2nd Test,Half Yearly,3rd Test,Yearly,Total,Percentage\n";

                          activeList.forEach((s, idx) => {
                            const ctxKey = `${subjectTeacherProfile.subjectTaught}_${subjectTeacherProfile.assignedClass}_${subjectTeacherProfile.section}`;
                            const stdMarks = (subjectAllExamsMarks[ctxKey] && subjectAllExamsMarks[ctxKey][s.srNo]) || {};

                            const t1 = stdMarks['1st Test'] !== undefined ? stdMarks['1st Test'] : 9;
                            const t2 = stdMarks['2nd Test'] !== undefined ? stdMarks['2nd Test'] : 8;
                            const hy = stdMarks['Half Yearly'] !== undefined ? stdMarks['Half Yearly'] : 62;
                            const t3 = stdMarks['3rd Test'] !== undefined ? stdMarks['3rd Test'] : 8;
                            const yr = stdMarks['Yearly / Annual'] !== undefined ? stdMarks['Yearly / Annual'] : 72;

                            const total = Number(t1) + Number(t2) + Number(hy) + Number(t3) + Number(yr);
                            const pct = ((total / 180) * 100).toFixed(1);

                            csvContent += `${idx + 1},${s.srNo},${s.rollNo || (601 + idx)},"${s.studentName}","${s.fatherName}","${subjectTeacherProfile.assignedClass}-${subjectTeacherProfile.section}","${subjectTeacherProfile.subjectTaught}",${t1},${t2},${hy},${t3},${yr},${total},${pct}%\n`;
                          });

                          const encodedUri = encodeURI(csvContent);
                          const anchor = document.createElement("a");
                          anchor.setAttribute("href", encodedUri);
                          anchor.setAttribute("download", `${subjectTeacherProfile.subjectTaught}_${subjectTeacherProfile.assignedClass}_Spreadsheet.csv`);
                          document.body.appendChild(anchor);
                          anchor.click();
                          anchor.remove();
                        }}
                        className="w-full py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs flex items-center justify-center space-x-2 shadow-sm cursor-pointer"
                      >
                        <Download className="w-4 h-4" />
                        <span>{lang === 'hi' ? 'CSV स्प्रेडशीट डाउनलोड करें' : 'Download CSV File'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* SECONDARY SUBMODULE: DIAGNOSTIC & REMEDIAL */}
              {activeSubComponent === 'remedial' && (
                <div className="space-y-4">
                  <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-purple-600" />
                    <span>{lang === 'hi' ? 'उपचारात्मक शिक्षण रजिस्टर (Diagnostic & Remedial Log)' : 'Diagnostic & Remedial Log'}</span>
                  </h4>
                  <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-xs font-bold text-purple-900 dark:text-purple-200">
                    {lang === 'hi' ? '✓ उपचारात्मक शिक्षण पंजीकृत है। कुल 8 विद्यार्थियों का नियमित उपचारात्मक मार्गदर्शन जारी है।' : '✓ Diagnostic remediation active for 8 low-achieving students.'}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}


      {/* 4. LIBRARIAN (पुस्तकालय अध्यक्ष) MODULE */}
      {activeRole === 'librarian' && activeSubComponent === null && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-md border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
            <ThreeDCard
              onClick={() => setActiveSubComponent('catalogue')}
              icon="book"
              bgTint="bg-purple-50 dark:bg-purple-950/40"
              label={lang === 'hi' ? '१. एक्सेशन रजिस्टर व पुस्तक सूची' : '1. Accession Register & Catalogue'}
            />

            <ThreeDCard
              onClick={() => setActiveSubComponent('issueLog')}
              icon="calendar"
              bgTint="bg-emerald-50 dark:bg-emerald-950/40"
              label={lang === 'hi' ? '२. पुस्तक इश्यू व वापसी' : '2. Book Issue & Return Log'}
            />

            <ThreeDCard
              onClick={() => setActiveSubComponent('fineRecord')}
              icon="coupon"
              bgTint="bg-amber-50 dark:bg-amber-950/40"
              label={lang === 'hi' ? '३. पुस्तकालय दंड व क्षति विवरण' : '3. Library Fine & Audit Log'}
            />
          </div>
        </div>
      )}

      {activeRole === 'pti' && activeSubComponent !== null && activeSubComponent !== 'kridaShulk' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-md border border-slate-200 dark:border-slate-800 space-y-3 relative">
          
          {/* Minimal Floating Back Button */}
          <button
            onClick={() => setActiveSubComponent(null)}
            className="absolute top-4 right-4 z-20 p-2 rounded-xl bg-slate-100 hover:bg-emerald-50 dark:bg-slate-850 dark:hover:bg-emerald-950/30 text-slate-500 hover:text-emerald-700 dark:text-slate-400 dark:hover:text-emerald-400 transition-all cursor-pointer active:scale-95 border border-slate-200/60 dark:border-slate-800"
            title={lang === 'hi' ? 'वापस' : 'Back'}
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          {/* Header depending on selection */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-850">
            <div>
              <h3 className="font-black text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                {activeSubComponent === 'healthBmi' && <Activity className="w-4 h-4 text-amber-500" />}
                {activeSubComponent === 'sportsStock' && <Award className="w-4 h-4 text-emerald-500" />}
                {activeSubComponent === 'ptGrading' && <Target className="w-4 h-4 text-blue-500" />}
                <span>
                  {activeSubComponent === 'healthBmi' && (lang === 'hi' ? '१. छात्र स्वास्थ्य एवं बीएमआई इंडेक्स' : '1. Student Health & BMI Index Register')}
                  {activeSubComponent === 'sportsStock' && (lang === 'hi' ? '२. खेलकूद सामग्री स्टॉक रजिस्टर' : '2. Sports Goods Stock Register')}
                  {activeSubComponent === 'ptGrading' && (lang === 'hi' ? '३. शारीरिक शिक्षा ग्रेडिंग व टूर्नामेंट रिकॉर्ड' : '3. PT Grading & Tournament Records')}
                </span>
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                {activeSubComponent === 'healthBmi' && (lang === 'hi' ? 'विद्यार्थियों की लम्बाई, वजन प्रविष्टि और स्वतः बीएमआई रिपोर्ट कार्ड' : 'Track and edit student height, weight, BMI stats & fitness categorization')}
                {activeSubComponent === 'sportsStock' && (lang === 'hi' ? 'खेल सामग्री सूची, स्टॉक मात्रा, वर्तमान स्थिति और वितरण लॉग' : 'Manage sports inventory counts, damaged items, and condition logs')}
                {activeSubComponent === 'ptGrading' && (lang === 'hi' ? 'शारीरिक दक्षता ग्रेड (A+ से D) एवं राज्य / जिला स्तरीय प्रतियोगिता प्रविष्टि' : 'Track physical fitness grades and district/state level sports tournament entries')}
              </p>
            </div>
          </div>

          {/* VIEW 1: HEALTH & BMI INDEX REGISTER */}
          {activeSubComponent === 'healthBmi' && (
            <div className="space-y-4">
              {/* Quick Add / Edit Mini Form */}
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  const target = e.currentTarget;
                  const name = (target.elements.namedItem('stdName') as HTMLInputElement).value;
                  const cls = (target.elements.namedItem('stdClass') as HTMLSelectElement).value;
                  const height = parseFloat((target.elements.namedItem('stdHeight') as HTMLInputElement).value) || 160;
                  const weight = parseFloat((target.elements.namedItem('stdWeight') as HTMLInputElement).value) || 50;
                  
                  // BMI = kg / (m^2)
                  const bmiVal = parseFloat((weight / ((height / 100) * (height / 100))).toFixed(1)) || 19;
                  let grade = 'B (Normal)';
                  if (bmiVal < 18.5) grade = 'Underweight';
                  else if (bmiVal >= 18.5 && bmiVal < 25) grade = 'A (Fit)';
                  else if (bmiVal >= 25 && bmiVal < 30) grade = 'Overweight';
                  else grade = 'Obese';

                  const newStd = {
                    id: 'pti-' + Date.now(),
                    name,
                    class: cls,
                    height,
                    weight,
                    bmi: bmiVal,
                    fitnessGrade: grade,
                    ptGrade: 'A'
                  };

                  setPtiStudents([...ptiStudents, newStd]);
                  target.reset();
                  alert(lang === 'hi' ? 'नया छात्र बीएमआई रिकॉर्ड जोड़ा गया!' : 'New student BMI record added!');
                }}
                className="grid grid-cols-2 sm:grid-cols-6 gap-2.5 bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold"
              >
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-[10px] text-slate-500 font-bold uppercase">{lang === 'hi' ? 'विद्यार्थी का नाम' : 'Student Name'}</label>
                  <input required name="stdName" type="text" placeholder="Ramesh Gurjar" className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 font-bold uppercase">{lang === 'hi' ? 'कक्षा' : 'Class'}</label>
                  <select name="stdClass" className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold">
                    <option value="Class 6-A">Class 6-A</option>
                    <option value="Class 7-A">Class 7-A</option>
                    <option value="Class 8-A">Class 8-A</option>
                    <option value="Class 9-A">Class 9-A</option>
                    <option value="Class 10-A">Class 10-A</option>
                    <option value="Class 11-A">Class 11-A</option>
                    <option value="Class 12-A">Class 12-A</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 font-bold uppercase">{lang === 'hi' ? 'ऊँचाई (cm)' : 'Height (cm)'}</label>
                  <input required name="stdHeight" type="number" min={50} max={250} placeholder="160" className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 font-bold uppercase">{lang === 'hi' ? 'वजन (kg)' : 'Weight (kg)'}</label>
                  <input required name="stdWeight" type="number" min={10} max={200} placeholder="50" className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono" />
                </div>
                <div className="flex items-end">
                  <button type="submit" className="w-full py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-black cursor-pointer shadow-sm text-center">
                    {lang === 'hi' ? 'जोड़ें' : 'Add Record'}
                  </button>
                </div>
              </form>

              {/* Data Table */}
              <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                <table className="w-full text-left text-xs bg-white dark:bg-slate-900">
                  <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-extrabold uppercase text-[10px] border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="p-2.5">{lang === 'hi' ? 'छात्र का नाम' : 'Student Name'}</th>
                      <th className="p-2.5 text-center">{lang === 'hi' ? 'कक्षा' : 'Class'}</th>
                      <th className="p-2.5 text-center">{lang === 'hi' ? 'लम्बाई (cm)' : 'Height (cm)'}</th>
                      <th className="p-2.5 text-center">{lang === 'hi' ? 'वजन (kg)' : 'Weight (kg)'}</th>
                      <th className="p-2.5 text-center">{lang === 'hi' ? 'बीएमआई' : 'BMI Index'}</th>
                      <th className="p-2.5 text-center">{lang === 'hi' ? 'श्रेणी' : 'Fitness Status'}</th>
                      <th className="p-2.5 text-center">{lang === 'hi' ? 'कार्रवाई' : 'Action'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-150 dark:divide-slate-850 font-sans text-xs">
                    {ptiStudents.map(s => (
                      <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-850/50">
                        <td className="p-2.5 font-bold text-slate-900 dark:text-slate-100">{s.name}</td>
                        <td className="p-2.5 text-center font-mono font-bold text-slate-600 dark:text-slate-400">{s.class}</td>
                        <td className="p-2.5 text-center font-mono">{s.height} cm</td>
                        <td className="p-2.5 text-center font-mono">{s.weight} kg</td>
                        <td className="p-2.5 text-center font-mono font-bold text-amber-600">{s.bmi}</td>
                        <td className="p-2.5 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                            s.fitnessGrade.includes('Fit') || s.fitnessGrade.includes('Normal')
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}>
                            {s.fitnessGrade}
                          </span>
                        </td>
                        <td className="p-2.5 text-center">
                          <button
                            onClick={() => {
                              if (confirm(lang === 'hi' ? 'क्या आप इस रिकॉर्ड को हटाना चाहते हैं?' : 'Are you sure you want to delete this record?')) {
                                setPtiStudents(ptiStudents.filter(item => item.id !== s.id));
                              }
                            }}
                            className="px-2 py-1 rounded bg-rose-100 hover:bg-rose-200 text-rose-700 text-[10px] font-black cursor-pointer"
                          >
                            {lang === 'hi' ? 'हटाएं' : 'Delete'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* VIEW 2: SPORTS GOODS REGISTER (INVENTORY) */}
          {activeSubComponent === 'sportsStock' && (
            <div className="space-y-4">
              {/* Add New Equipment / Stock Update */}
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  const target = e.currentTarget;
                  const item = (target.elements.namedItem('stockItem') as HTMLInputElement).value;
                  const category = (target.elements.namedItem('stockCategory') as HTMLInputElement).value;
                  const total = parseInt((target.elements.namedItem('stockTotal') as HTMLInputElement).value) || 0;
                  const condition = (target.elements.namedItem('stockCondition') as HTMLSelectElement).value;

                  const newStock = {
                    id: 'ss-' + Date.now(),
                    item,
                    category,
                    total,
                    issued: 0,
                    condition,
                    lastUpdated: new Date().toISOString().split('T')[0]
                  };

                  setSportsStock([...sportsStock, newStock]);
                  target.reset();
                  alert(lang === 'hi' ? 'नया खेलकूद सामान रजिस्टर में जोड़ा गया!' : 'New sports equipment registered successfully!');
                }}
                className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold"
              >
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-[10px] text-slate-500 font-bold uppercase">{lang === 'hi' ? 'खेल सामग्री का नाम' : 'Equipment/Item Name'}</label>
                  <input required name="stockItem" type="text" placeholder="e.g. Cosco Footballs" className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 font-bold uppercase">{lang === 'hi' ? 'वर्ग (Category)' : 'Category'}</label>
                  <input required name="stockCategory" type="text" placeholder="e.g. Football" className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 font-bold uppercase">{lang === 'hi' ? 'कुल संख्या' : 'Total Quantity'}</label>
                  <input required name="stockTotal" type="number" min={1} placeholder="10" className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 font-bold uppercase">{lang === 'hi' ? 'स्थिति (Condition)' : 'Condition'}</label>
                  <select name="stockCondition" className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold">
                    <option value="Excellent">Excellent</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                    <option value="Damaged">Damaged</option>
                  </select>
                </div>
                <div className="sm:col-span-5 flex justify-end">
                  <button type="submit" className="px-5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-black cursor-pointer shadow-sm text-center text-xs">
                    {lang === 'hi' ? 'रजिस्टर में नया सामान जोड़ें' : 'Register New Sports Goods'}
                  </button>
                </div>
              </form>

              {/* Inventory Table */}
              <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                <table className="w-full text-left text-xs bg-white dark:bg-slate-900">
                  <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-extrabold uppercase text-[10px] border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="p-2.5">{lang === 'hi' ? 'सामग्री का नाम' : 'Sports Equipment'}</th>
                      <th className="p-2.5">{lang === 'hi' ? 'श्रेणी' : 'Category'}</th>
                      <th className="p-2.5 text-center">{lang === 'hi' ? 'कुल स्टॉक' : 'Total Stock'}</th>
                      <th className="p-2.5 text-center">{lang === 'hi' ? 'जारी/इन यूज़' : 'Issued/In Use'}</th>
                      <th className="p-2.5 text-center">{lang === 'hi' ? 'उपलब्ध' : 'Available'}</th>
                      <th className="p-2.5 text-center">{lang === 'hi' ? 'स्थिति' : 'Condition'}</th>
                      <th className="p-2.5 text-center">{lang === 'hi' ? 'अंतिम अपडेट' : 'Last Updated'}</th>
                      <th className="p-2.5 text-center">{lang === 'hi' ? 'कार्रवाई' : 'Action'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-150 dark:divide-slate-850 font-sans text-xs">
                    {sportsStock.map(s => {
                      const avail = s.total - s.issued;
                      return (
                        <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-850/50">
                          <td className="p-2.5 font-bold text-slate-900 dark:text-slate-100">{s.item}</td>
                          <td className="p-2.5 font-semibold text-slate-600 dark:text-slate-400">{s.category}</td>
                          <td className="p-2.5 text-center font-mono font-bold">{s.total}</td>
                          <td className="p-2.5 text-center font-mono text-slate-500">{s.issued}</td>
                          <td className="p-2.5 text-center font-mono font-bold text-emerald-600">{avail}</td>
                          <td className="p-2.5 text-center">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                              s.condition === 'Excellent' || s.condition === 'Good'
                                ? 'bg-emerald-100 text-emerald-800'
                                : s.condition === 'Fair'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}>
                              {s.condition}
                            </span>
                          </td>
                          <td className="p-2.5 text-center font-mono text-slate-500">{s.lastUpdated}</td>
                          <td className="p-2.5 text-center space-x-1.5 whitespace-nowrap">
                            <button
                              onClick={() => {
                                const newTotal = parseInt(prompt(lang === 'hi' ? 'नया कुल स्टॉक दर्ज करें:' : 'Enter new total stock count:', String(s.total)) || '');
                                if (!isNaN(newTotal) && newTotal >= s.issued) {
                                  setSportsStock(sportsStock.map(item => item.id === s.id ? { ...item, total: newTotal, lastUpdated: new Date().toISOString().split('T')[0] } : item));
                                } else if (!isNaN(newTotal)) {
                                  alert(lang === 'hi' ? 'कुल स्टॉक जारी स्टॉक से कम नहीं हो सकता।' : 'Total stock cannot be less than already issued items.');
                                }
                              }}
                              className="px-2 py-1 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-[10px] font-black cursor-pointer"
                            >
                              + Stock
                            </button>
                            <button
                              onClick={() => {
                                const newIssued = parseInt(prompt(lang === 'hi' ? 'जारी मात्रा दर्ज करें:' : 'Enter issued count:', String(s.issued)) || '');
                                if (!isNaN(newIssued) && newIssued <= s.total && newIssued >= 0) {
                                  setSportsStock(sportsStock.map(item => item.id === s.id ? { ...item, issued: newIssued, lastUpdated: new Date().toISOString().split('T')[0] } : item));
                                } else if (!isNaN(newIssued)) {
                                  alert(lang === 'hi' ? 'जारी मात्रा कुल स्टॉक से अधिक नहीं हो सकती।' : 'Issued count cannot exceed total stock.');
                                }
                              }}
                              className="px-2 py-1 rounded bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 text-[10px] font-black cursor-pointer"
                            >
                              Issue
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(lang === 'hi' ? 'क्या आप इस सामग्री को हटाना चाहते हैं?' : 'Are you sure you want to delete this equipment?')) {
                                  setSportsStock(sportsStock.filter(item => item.id !== s.id));
                                }
                              }}
                              className="px-2 py-1 rounded bg-rose-100 hover:bg-rose-200 text-rose-700 text-[10px] font-black cursor-pointer"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* VIEW 3: PT GRADING & TOURNAMENT RECORD */}
          {activeSubComponent === 'ptGrading' && (
            <div className="space-y-4">
              {/* Grading criteria reference card */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-indigo-50/50 dark:bg-indigo-950/20 p-4 border border-indigo-100 dark:border-indigo-900 rounded-2xl text-xs">
                <div className="space-y-1">
                  <h4 className="font-bold text-indigo-950 dark:text-indigo-200">🎯 {lang === 'hi' ? 'शारीरिक शिक्षा ग्रेडिंग दिशानिर्देश' : 'Physical Education Grading Rules'}</h4>
                  <p className="text-indigo-900 dark:text-indigo-300 leading-relaxed">
                    विद्यार्थियों को उनकी खेल दक्षता, शारीरिक प्रशिक्षण (PT), अनुशासन, नियमित योग और विभिन्न टूर्नामेंट में सहभागिता के आधार पर **A+ (उत्कृष्ट) से D (सुधार योग्य)** ग्रेड दिए जाते हैं।
                  </p>
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-indigo-950 dark:text-indigo-200">🏆 {lang === 'hi' ? 'प्रतियोगिता सहभागिता' : 'Tournament Record Entry'}</h4>
                  <p className="text-indigo-900 dark:text-indigo-300 leading-relaxed">
                    67वीं जिला / राज्य स्तरीय विद्यालयी क्रीड़ा प्रतियोगिता हेतु पात्र खिलाड़ियों के नामांकन व दल व्यवस्थापन विवरण को यहाँ ट्रैक करें।
                  </p>
                </div>
              </div>

              {/* Grading table list */}
              <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                <table className="w-full text-left text-xs bg-white dark:bg-slate-900">
                  <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-extrabold uppercase text-[10px] border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="p-2.5">{lang === 'hi' ? 'छात्र का नाम' : 'Student Name'}</th>
                      <th className="p-2.5 text-center">{lang === 'hi' ? 'कक्षा' : 'Class'}</th>
                      <th className="p-2.5 text-center">{lang === 'hi' ? 'शारीरिक दक्षता ग्रेड (PT Grade)' : 'PT Grade'}</th>
                      <th className="p-2.5 text-center">{lang === 'hi' ? 'सक्रिय खेलकूद (Active Sport)' : 'Specialty Sport'}</th>
                      <th className="p-2.5 text-center">{lang === 'hi' ? 'प्रतियोगिता स्तर' : 'Tournament Level'}</th>
                      <th className="p-2.5 text-center">{lang === 'hi' ? 'कार्रवाई' : 'Update Grade'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-150 dark:divide-slate-850 font-sans text-xs">
                    {ptiStudents.map(s => (
                      <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-850/50 text-center font-medium">
                        <td className="p-2.5 text-left font-bold text-slate-900 dark:text-slate-100">{s.name}</td>
                        <td className="p-2.5 font-mono font-bold text-slate-600 dark:text-slate-400">{s.class}</td>
                        <td className="p-2.5">
                          <span className="px-2.5 py-1 rounded bg-indigo-150 text-indigo-800 font-black text-xs">
                            {s.ptGrade}
                          </span>
                        </td>
                        <td className="p-2.5 font-bold text-slate-700 dark:text-slate-300">
                          {s.id === 'pti-1' ? 'Football' : s.id === 'pti-2' ? 'Athletics (100m)' : s.id === 'pti-3' ? 'Cricket' : 'Kabaddi'}
                        </td>
                        <td className="p-2.5">
                          <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">
                            {s.id === 'pti-1' ? 'State Level' : s.id === 'pti-2' ? 'District Level' : 'School Level'}
                          </span>
                        </td>
                        <td className="p-2.5">
                          <select
                            value={s.ptGrade}
                            onChange={(e) => {
                              const newGrade = e.target.value;
                              setPtiStudents(ptiStudents.map(item => item.id === s.id ? { ...item, ptGrade: newGrade } : item));
                            }}
                            className="px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-black text-[11px] text-indigo-800"
                          >
                            <option value="A+">A+</option>
                            <option value="A">A</option>
                            <option value="B">B</option>
                            <option value="C">C</option>
                            <option value="D">D</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {activeRole === 'librarian' && activeSubComponent !== null && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-md border border-slate-200 dark:border-slate-800 space-y-3 relative">
          {/* Minimal Floating Back Button */}
          <button
            onClick={() => setActiveSubComponent(null)}
            className="absolute top-4 right-4 z-20 p-2 rounded-xl bg-slate-100 hover:bg-emerald-50 dark:bg-slate-850 dark:hover:bg-emerald-950/30 text-slate-500 hover:text-emerald-700 dark:text-slate-400 dark:hover:text-emerald-400 transition-all cursor-pointer active:scale-95 border border-slate-200/60 dark:border-slate-800"
            title={lang === 'hi' ? 'वापस' : 'Back'}
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                <Library className="w-4 h-4 text-purple-600" />
                <span>{lang === 'hi' ? 'पुस्तकालय एक्सेशन एवं इश्यू/रिटर्न रजिस्टर' : 'Library Catalogue & Issue/Return Tracker'}</span>
              </h3>
              <p className="text-[11px] text-slate-500">
                {lang === 'hi' ? 'पुस्तकालय पुस्तक खोज, छात्र/शिक्षक इश्यू एवं उपलब्ध प्रतियां' : 'Book Accession Catalogue, Student/Staff Issue & Stock Summary'}
              </p>
            </div>
            <button
              onClick={() => setShowIssueModal(true)}
              className="px-3 py-1.5 rounded-lg bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold flex items-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Issue Book</span>
            </button>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Title, Author, Accession No..."
              value={bookSearch}
              onChange={e => setBookSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {libraryBooks
              .filter(b => b.title.toLowerCase().includes(bookSearch.toLowerCase()) || b.accessionNo.includes(bookSearch))
              .map(bk => (
                <div key={bk.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="font-extrabold text-slate-900 dark:text-slate-100">{bk.title}</div>
                    <span className="font-mono text-[10px] text-purple-700 dark:text-purple-300 font-extrabold bg-purple-100 dark:bg-purple-950 px-2 py-0.5 rounded">
                      ACC: {bk.accessionNo}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500">Author: {bk.author} • Category: {bk.category}</div>
                  <div className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 flex items-center justify-between pt-1">
                    <span>Available Copies: {bk.availableCopies} / {bk.totalCopies}</span>
                    <span className="text-[10px] text-slate-400 font-normal">Active Issued: {(bk.issuedTo || []).length}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}


      {/* 5. PTI / PHYSICAL EDUCATION MODULE */}
      {activeRole === 'pti' && activeSubComponent === null && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-md border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
            <ThreeDCard
              onClick={() => setActiveSubComponent('healthBmi')}
              icon="shield"
              bgTint="bg-amber-50 dark:bg-amber-950/40"
              label={lang === 'hi' ? '१. छात्र स्वास्थ्य एवं बीएमआई' : '1. Health & BMI Index'}
            />

            <ThreeDCard
              onClick={() => setActiveSubComponent('sportsStock')}
              icon="award"
              bgTint="bg-emerald-50 dark:bg-emerald-950/40"
              label={lang === 'hi' ? '२. खेलकूद सामग्री स्टॉक' : '2. Sports Goods Register'}
            />

            <ThreeDCard
              onClick={() => setActiveSubComponent('ptGrading')}
              icon="target"
              bgTint="bg-blue-50 dark:bg-blue-950/40"
              label={lang === 'hi' ? '३. शारीरिक शिक्षा ग्रेडिंग व प्रतियोगिता' : '3. PT Grading & Tournament Record'}
            />

            <ThreeDCard
              onClick={() => setActiveSubComponent('kridaShulk')}
              icon="calculator"
              bgTint="bg-purple-50 dark:bg-purple-950/40"
              label={lang === 'hi' ? '४. क्रीड़ा शुल्क विवरण प्रपत्र' : '4. Sports Fee Form Maker'}
            />
          </div>
        </div>
      )}

      {activeRole === 'pti' && activeSubComponent !== null && activeSubComponent === 'kridaShulk' && (
        <KridaShulkMaker
          initialSchoolProfile={{
            schoolName: schoolProfile.schoolName,
            udiseCode: schoolProfile.udiseCode,
            district: schoolProfile.district
          }}
          lang={lang}
          onBack={() => setActiveSubComponent(null)}
        />
      )}


      {/* 6. COMPUTER TEACHER MODULE */}
      {activeRole === 'computer' && activeSubComponent === null && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-md border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
            <ThreeDCard
              onClick={() => setActiveSubComponent('equipmentStock')}
              icon="calculator"
              bgTint="bg-indigo-50 dark:bg-indigo-950/40"
              label={lang === 'hi' ? '१. ICT लैब उपकरण व पीसी स्टॉक' : '1. ICT Equipment & PC Stock'}
            />

            <ThreeDCard
              onClick={() => setActiveSubComponent('complaints')}
              icon="lock"
              bgTint="bg-rose-50 dark:bg-rose-950/40"
              label={lang === 'hi' ? '२. उपकरण खराबी व शिकायत' : '2. Hardware Complaint & Repair Log'}
            />

            <ThreeDCard
              onClick={() => setActiveSubComponent('itPractical')}
              icon="coupon"
              bgTint="bg-blue-50 dark:bg-blue-950/40"
              label={lang === 'hi' ? '३. सूचना प्रौद्योगिकी व्यावहारिक अंक' : '3. IT Practical Exam Marks'}
            />
          </div>
        </div>
      )}

      {activeRole === 'computer' && activeSubComponent !== null && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-md border border-slate-200 dark:border-slate-800 space-y-3 relative">
          
          {/* Minimal Floating Back Button */}
          <button
            onClick={() => setActiveSubComponent(null)}
            className="absolute top-4 right-4 z-20 p-2 rounded-xl bg-slate-100 hover:bg-emerald-50 dark:bg-slate-850 dark:hover:bg-emerald-950/30 text-slate-500 hover:text-emerald-700 dark:text-slate-400 dark:hover:text-emerald-400 transition-all cursor-pointer active:scale-95 border border-slate-200/60 dark:border-slate-800"
            title={lang === 'hi' ? 'वापस' : 'Back'}
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                <Monitor className="w-4 h-4 text-indigo-600" />
                <span>{lang === 'hi' ? 'कंप्यूटर शिक्षक एवं ICT लैब प्रबंधन' : 'Computer Teacher & ICT Lab Inventory'}</span>
              </h3>
              <p className="text-[11px] text-slate-500">
                {lang === 'hi' ? 'कंप्यूटर, स्मार्ट टीवी, यूपीएस उपकरण स्थिति एवं आईटी प्रैक्टिकल अंक' : 'ICT Lab desktops, smart TV status, hardware complaints & IT marks'}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            {ictItems.map(item => (
              <div key={item.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs flex items-center justify-between">
                <div>
                  <div className="font-extrabold text-slate-900 dark:text-slate-100">{item.itemName}</div>
                  <div className="text-[10px] font-mono text-slate-500">Serial No: {item.serialNo} • Quantity: {item.quantity}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{item.remarks}</div>
                </div>
                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black ${
                  item.status === 'Working' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-rose-100 text-rose-800 border border-rose-300'
                }`}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DAILY TEACHER'S DIARY MODULE */}
      {activeRole === 'diary' && (
        <DailyDiaryModule
          schoolProfile={schoolProfile}
          lang={lang}
        />
      )}


      {/* MODAL: ADD STUDENT WITH FULL SUBJECT MARKS ENTRY */}
      {showAddStudentModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-5 shadow-2xl border border-slate-300 dark:border-slate-700 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-black text-sm text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-emerald-600" />
                <span>{lang === 'hi' ? 'नया छात्र एवं परिणाम दर्ज करें' : 'Add Student & Result Record'}</span>
              </h3>
              <button
                onClick={() => setShowAddStudentModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-base"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddStudentSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-0.5">SR Number</label>
                  <input
                    type="text"
                    required
                    value={newSrNo}
                    onChange={e => setNewSrNo(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-0.5">Roll Number</label>
                  <input
                    type="text"
                    required
                    value={newRollNo}
                    onChange={e => setNewRollNo(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-0.5">Student Name</label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-0.5">Father's Name</label>
                  <input
                    type="text"
                    required
                    value={newFatherName}
                    onChange={e => setNewFatherName(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-0.5">Gender</label>
                  <select
                    value={newGender}
                    onChange={e => setNewGender(e.target.value as any)}
                    className="w-full px-2 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-0.5">Category</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value as any)}
                    className="w-full px-2 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  >
                    <option value="GEN">GEN</option>
                    <option value="OBC">OBC</option>
                    <option value="SC">SC</option>
                    <option value="ST">ST</option>
                    <option value="EWS">EWS</option>
                    <option value="MBC">MBC</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-0.5">Class</label>
                  <select
                    value={newClass}
                    onChange={e => setNewClass(e.target.value)}
                    className="w-full px-2 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  >
                    <option value="Class 9-A">Class 9-A</option>
                    <option value="Class 10-A">Class 10-A</option>
                    <option value="Class 8-A">Class 8-A</option>
                  </select>
                </div>
              </div>

              {/* Subject Marks Entry */}
              <div className="space-y-1 pt-2 border-t border-slate-200 dark:border-slate-800">
                <label className="block font-black text-slate-900 dark:text-slate-100 text-[11px]">
                  Subject Marks Entry (Max 100 Each):
                </label>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  {Object.keys(newSubjectMarks).map(subj => (
                    <div key={subj} className="flex items-center justify-between p-1.5 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 truncate max-w-[120px]">{subj}</span>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={newSubjectMarks[subj]}
                        onChange={e => setNewSubjectMarks({ ...newSubjectMarks, [subj]: Number(e.target.value) })}
                        className="w-14 text-center py-0.5 rounded border border-slate-300 dark:border-slate-700 font-mono font-bold"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddStudentModal(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-black"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* MODAL: EDIT EXISTING STUDENT MARKS */}
      {editingStudent && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-5 shadow-2xl border border-slate-300 dark:border-slate-700 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="font-black text-sm text-slate-900 dark:text-slate-100">
                  Edit Marks: {editingStudent.studentName}
                </h3>
                <p className="text-[10px] text-slate-500 font-mono">SR: {editingStudent.srNo} • Roll: {editingStudent.rollNo}</p>
              </div>
              <button
                onClick={() => setEditingStudent(null)}
                className="text-slate-400 hover:text-slate-600 font-bold text-base"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="grid grid-cols-2 gap-2">
                {editingStudent.marks.map((m, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 truncate max-w-[110px]">{m.subject}</span>
                    <input
                      type="number"
                      min="0"
                      max={m.maxMarks || 100}
                      value={m.obtainedMarks}
                      onChange={e => {
                        const newMarks = [...editingStudent.marks];
                        newMarks[idx] = { ...newMarks[idx], obtainedMarks: Number(e.target.value) };
                        setEditingStudent({ ...editingStudent, marks: newMarks });
                      }}
                      className="w-14 text-center py-0.5 rounded border border-slate-300 dark:border-slate-700 font-mono font-bold text-emerald-700 dark:text-emerald-300"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setEditingStudent(null)}
                className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEditedStudent}
                className="px-4 py-1.5 rounded-lg bg-emerald-700 text-white font-extrabold text-xs"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}


      {/* MODAL: CLASS TEACHER ONBOARDING / REGISTRATION FORM */}
      {showOnboardingModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-300 dark:border-slate-700 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-xl bg-amber-400 text-slate-950 font-bold">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100">
                    कक्षा अध्यापक प्राथमिक पंजीकरण (Class Teacher Onboarding)
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    अंकतालिका, ग्रीनशीट एवं आधिकारिक रिपोर्टों हेतु आवश्यक विवरण दर्ज करें
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowOnboardingModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-black text-slate-800 dark:text-slate-200 mb-1">
                  1. कक्षा अध्यापक का नाम (Class Teacher Name) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Chandra Sharma"
                  value={onboardingTeacherName}
                  onChange={e => setOnboardingTeacherName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-black text-slate-800 dark:text-slate-200 mb-1">
                    2. आवंटित कक्षा (Class Assigned) *
                  </label>
                  <select
                    value={onboardingClass}
                    onChange={e => setOnboardingClass(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold text-xs"
                  >
                    {['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8-A', 'Class 9-A', 'Class 10-A', 'Class 11', 'Class 12'].map(cls => (
                      <option key={cls} value={cls}>{cls}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-black text-slate-800 dark:text-slate-200 mb-1">
                    3. वर्ग / सेक्शन (Section) *
                  </label>
                  <select
                    value={onboardingSection}
                    onChange={e => setOnboardingSection(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold text-xs"
                  >
                    {['A', 'B', 'C', 'D'].map(sec => (
                      <option key={sec} value={sec}>वर्ग / Section {sec}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-black text-slate-800 dark:text-slate-200 mb-1.5">
                  4. पढ़ाये जाने वाले विषय (Subjects Taught) *
                </label>
                <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  {['Hindi', 'English', 'Mathematics', 'Science', 'Social Science', 'Sanskrit', 'Health & PE', 'Information Technology'].map(sub => {
                    const isChecked = onboardingSubjects.includes(sub);
                    return (
                      <label
                        key={sub}
                        className={`flex items-center space-x-2 p-2 rounded-xl border cursor-pointer transition-all ${
                          isChecked
                            ? 'bg-emerald-100 dark:bg-emerald-950/80 border-emerald-400 text-emerald-950 dark:text-emerald-200 font-bold'
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            if (isChecked) {
                              setOnboardingSubjects(onboardingSubjects.filter(s => s !== sub));
                            } else {
                              setOnboardingSubjects([...onboardingSubjects, sub]);
                            }
                          }}
                          className="rounded text-emerald-600 focus:ring-emerald-500"
                        />
                        <span className="text-[11px]">{sub}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-[11px] text-amber-900 dark:text-amber-200">
                <strong>नोट:</strong> यह पंजीकरण विवरण ग्रीनशीट, विषयवार परख अंकतालिका तथा आपार/आधार/जनाधार विसंगति पत्रों पर स्वतः मुद्रित होगा।
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowOnboardingModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 font-bold text-xs"
              >
                रद्द करें (Cancel)
              </button>
              <button
                type="button"
                onClick={handleSaveOnboarding}
                className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs flex items-center space-x-1.5 shadow-md cursor-pointer"
              >
                <UserCheck className="w-4 h-4 text-amber-300" />
                <span>पंजीकरण सहेजें (Save Onboarding)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: LIBRARIAN ISSUE BOOK */}
      {showIssueModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-300 dark:border-slate-700 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-black text-sm text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-purple-600" />
                <span>Issue Library Book</span>
              </h3>
              <button onClick={() => setShowIssueModal(false)} className="text-slate-400 font-bold">✕</button>
            </div>

            <form onSubmit={handleIssueBookSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Select Book:</label>
                <select
                  required
                  value={selectedBookId}
                  onChange={e => setSelectedBookId(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold"
                >
                  <option value="">-- Choose Book --</option>
                  {libraryBooks.map(bk => (
                    <option key={bk.id} value={bk.id} disabled={bk.availableCopies <= 0}>
                      {bk.title} (Acc: {bk.accessionNo} | Avail: {bk.availableCopies})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Issue To (Name):</label>
                <input
                  type="text"
                  required
                  placeholder="Student or Teacher Name"
                  value={issuePerson}
                  onChange={e => setIssuePerson(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Role:</label>
                <select
                  value={issueRole}
                  onChange={e => setIssueRole(e.target.value as any)}
                  className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold"
                >
                  <option value="Student">Student</option>
                  <option value="Teacher">Teacher</option>
                </select>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowIssueModal(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-purple-700 text-white font-extrabold"
                >
                  Confirm Issue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
