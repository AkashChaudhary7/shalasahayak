import React, { useState, useRef } from 'react';
import { SchoolProfile, StudentResult, Teacher, InchargeAssignment, Language } from '../../types';
import { ThreeDCard, ThreeDIcon } from '../ThreeDIcon';
import {
  Building2,
  GraduationCap,
  Users,
  Download,
  Upload,
  Plus,
  Trash2,
  Edit,
  Save,
  Search,
  CheckCircle2,
  FileSpreadsheet,
  FileText,
  RefreshCw,
  ArrowLeft,
  Sparkles,
  HelpCircle,
  AlertCircle
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { SAMPLE_SCHOOL_PROFILE, SAMPLE_TEACHERS, SAMPLE_STUDENTS } from '../../utils/storage';

interface SchoolProfileModuleProps {
  schoolProfile: SchoolProfile;
  onUpdateSchoolProfile: (profile: SchoolProfile) => void;
  students: StudentResult[];
  onUpdateStudents: (students: StudentResult[]) => void;
  teachers: Teacher[];
  onUpdateTeachers: (teachers: Teacher[]) => void;
  incharges?: InchargeAssignment[];
  onUpdateIncharges?: (incharges: InchargeAssignment[]) => void;
  lang: Language;
  onBack?: () => void;
}

export const SchoolProfileModule: React.FC<SchoolProfileModuleProps> = ({
  schoolProfile,
  onUpdateSchoolProfile,
  students,
  onUpdateStudents,
  teachers,
  onUpdateTeachers,
  lang,
  onBack
}) => {
  const isHi = lang === 'hi';
  const [activeTab, setActiveTab] = useState<'grid' | 'settings' | 'students' | 'teachers' | 'export'>('grid');

  // School profile form state
  const [profileForm, setProfileForm] = useState<SchoolProfile>({ ...schoolProfile });
  const [profileSavedToast, setProfileSavedToast] = useState(false);

  // Student module states
  const [studentSearch, setStudentSearch] = useState('');
  const [selectedClassFilter, setSelectedClassFilter] = useState('ALL');
  const [parsedStudentPreview, setParsedStudentPreview] = useState<StudentResult[] | null>(null);
  const [isEditingStudent, setIsEditingStudent] = useState<StudentResult | null>(null);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [newStudent, setNewStudent] = useState<Partial<StudentResult>>({
    srNo: '',
    rollNo: '',
    studentName: '',
    fatherName: '',
    className: 'Class 10-A',
    section: 'A',
    gender: 'Male',
    category: 'GEN',
    aadhaarStatus: 'Verified',
    janAadhaarStatus: 'Verified',
    apaarStatus: 'Generated'
  });

  // Teacher module states
  const [teacherSearch, setTeacherSearch] = useState('');
  const [parsedTeacherPreview, setParsedTeacherPreview] = useState<Teacher[] | null>(null);
  const [isEditingTeacher, setIsEditingTeacher] = useState<Teacher | null>(null);
  const [showAddTeacherModal, setShowAddTeacherModal] = useState(false);
  const [newTeacher, setNewTeacher] = useState<Partial<Teacher>>({
    name: '',
    nameHindi: '',
    designation: 'Teacher Grade III',
    subject: 'General',
    employeeId: '',
    payLevel: 'L-10',
    currentBasicPay: 33800,
    incrementMonth: 'July',
    phone: ''
  });

  // Export module state
  const [exportClassSelect, setExportClassSelect] = useState('ALL');

  const studentFileInputRef = useRef<HTMLInputElement>(null);
  const teacherFileInputRef = useRef<HTMLInputElement>(null);
  const profileFileInputRef = useRef<HTMLInputElement>(null);

  // Handle Profile Save
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSchoolProfile(profileForm);
    setProfileSavedToast(true);
    setTimeout(() => setProfileSavedToast(false), 3000);
  };

  // Load Sample Demo Data
  const handleLoadSampleData = () => {
    if (window.confirm(isHi ? 'क्या आप नमूना/डेमो डेटा लोड करना चाहते हैं?' : 'Load sample demo school data?')) {
      onUpdateSchoolProfile(SAMPLE_SCHOOL_PROFILE);
      setProfileForm(SAMPLE_SCHOOL_PROFILE);
      onUpdateTeachers(SAMPLE_TEACHERS);
      onUpdateStudents(SAMPLE_STUDENTS);
      alert(isHi ? 'नमूना डेटा सफलतापूर्वक लोड हो गया है।' : 'Sample data loaded successfully.');
    }
  };

  // Clear All Data
  const handleClearAllData = () => {
    if (window.confirm(isHi ? 'चेतावनी: क्या आप वाकई स्कूल, छात्र और शिक्षक डेटा साफ़ (Blank) करना चाहते हैं?' : 'Clear all school, student & teacher data?')) {
      const blankProfile: SchoolProfile = {
        schoolName: '',
        schoolNameHindi: '',
        principalName: '',
        principalDesignation: '',
        udiseCode: '',
        nicCode: '',
        ddoCode: '',
        district: '',
        block: '',
        address: '',
        phone: '',
        email: ''
      };
      onUpdateSchoolProfile(blankProfile);
      setProfileForm(blankProfile);
      onUpdateTeachers([]);
      onUpdateStudents([]);
      alert(isHi ? 'सारे डेटा ब्लैंक (Clear) कर दिए गए हैं।' : 'All data cleared successfully.');
    }
  };

  // --- EXCEL IMPORT / PARSING FOR STUDENTS ---
  const handleStudentFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json<any>(ws);

        if (!data || data.length === 0) {
          alert(isHi ? 'अपलोड की गई फाइल में कोई रिकॉर्ड नहीं मिला!' : 'No records found in Excel file!');
          return;
        }

        const parsed: StudentResult[] = data.map((row, idx) => {
          const getVal = (keys: string[]) => {
            for (const k of keys) {
              if (row[k] !== undefined && row[k] !== null) return String(row[k]).trim();
            }
            return '';
          };

          return {
            id: `imported-std-${Date.now()}-${idx}`,
            srNo: getVal(['SR No', 'SRNO', 'SR', 'एसआर नंबर', 'एसआर', 'SrNo']) || `${100 + idx}`,
            rollNo: getVal(['Roll No', 'ROLLNO', 'Roll', 'रोल नंबर', 'RollNo']) || `${idx + 1}`,
            studentName: getVal(['Student Name', 'Name', 'NAME', 'छात्र का नाम', 'विद्यार्थी नाम', 'StudentName']) || `Student ${idx + 1}`,
            fatherName: getVal(['Father Name', 'Father', 'FATHER', 'पिता का नाम', 'FatherName']) || 'N/A',
            className: getVal(['Class', 'ClassName', 'CLASS', 'कक्षा', 'Class Name']) || 'Class 10-A',
            section: getVal(['Section', 'SECTION', 'सेक्शन']) || 'A',
            gender: (getVal(['Gender', 'GENDER', 'लिंग']) || 'Male').toLowerCase().includes('f') ? 'Female' : 'Male',
            category: (getVal(['Category', 'CATEGORY', 'वर्ग', 'जाति']) || 'GEN') as any,
            aadhaarStatus: (getVal(['Aadhaar Status', 'Aadhaar']) || 'Verified') as any,
            janAadhaarStatus: (getVal(['Jan Aadhaar Status', 'JanAadhaar']) || 'Verified') as any,
            apaarStatus: (getVal(['APAAR ID', 'APAAR Status', 'APAAR']) || 'Generated') as any,
            maskedAadhaar: getVal(['Masked Aadhaar', 'Aadhaar No']) || 'XXXX-XXXX-1234',
            marks: []
          };
        });

        setParsedStudentPreview(parsed);
      } catch (err) {
        console.error('Excel parse error:', err);
        alert(isHi ? 'फाइल पढ़ने में त्रुटि। कृपया सही Excel (.xlsx/.xls/.csv) फाइल चुनें।' : 'Error reading file. Please upload a valid Excel spreadsheet.');
      }
    };
    reader.readAsBinaryString(file);
  };

  const confirmImportStudents = () => {
    if (!parsedStudentPreview) return;
    onUpdateStudents([...students, ...parsedStudentPreview]);
    alert(isHi ? `${parsedStudentPreview.length} विद्यार्थियों का डेटा ऐप में सफलतापूर्वक जुड़ गया है!` : `Successfully added ${parsedStudentPreview.length} students to the app!`);
    setParsedStudentPreview(null);
    if (studentFileInputRef.current) studentFileInputRef.current.value = '';
  };

  const downloadSampleStudentTemplate = () => {
    const sampleData = [
      {
        'SR No': '1001',
        'Roll No': '1',
        'Student Name': 'Rahul Sharma',
        'Father Name': 'Ramdayal Sharma',
        'Class': 'Class 10-A',
        'Section': 'A',
        'Gender': 'Male',
        'Category': 'GEN',
        'Aadhaar Status': 'Verified',
        'Jan Aadhaar Status': 'Verified',
        'APAAR ID': 'Generated'
      },
      {
        'SR No': '1002',
        'Roll No': '2',
        'Student Name': 'Priyanka Rathore',
        'Father Name': 'Bhawani Singh',
        'Class': 'Class 10-A',
        'Section': 'A',
        'Gender': 'Female',
        'Category': 'GEN',
        'Aadhaar Status': 'Verified',
        'Jan Aadhaar Status': 'Verified',
        'APAAR ID': 'Generated'
      }
    ];
    const ws = XLSX.utils.json_to_sheet(sampleData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Student_Template');
    XLSX.writeFile(wb, 'Student_Data_Import_Template.xlsx');
  };

  // --- EXCEL IMPORT FOR TEACHERS ---
  const handleTeacherFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json<any>(ws);

        if (!data || data.length === 0) {
          alert(isHi ? 'अपलोड की गई फाइल में कोई शिक्षक रिकॉर्ड नहीं मिला!' : 'No staff records found in Excel file!');
          return;
        }

        const parsed: Teacher[] = data.map((row, idx) => {
          const getVal = (keys: string[]) => {
            for (const k of keys) {
              if (row[k] !== undefined && row[k] !== null) return String(row[k]).trim();
            }
            return '';
          };

          return {
            id: `imported-tch-${Date.now()}-${idx}`,
            name: getVal(['Name', 'Teacher Name', 'NAME', 'शिक्षक का नाम', 'नाम']) || `Staff ${idx + 1}`,
            nameHindi: getVal(['Name Hindi', 'Hindi Name', 'हिंदी नाम']) || '',
            designation: getVal(['Designation', 'DESIGNATION', 'पद']) || 'Teacher Grade III',
            subject: getVal(['Subject', 'SUBJECT', 'विषय']) || 'General',
            employeeId: getVal(['Employee ID', 'EmpID', 'एम्प्लॉई आईडी', 'RJID']) || `RJPA${20200000 + idx}`,
            payLevel: getVal(['Pay Level', 'PayLevel', 'पे लेवल']) || 'L-10',
            currentBasicPay: Number(getVal(['Basic Pay', 'Current Basic Pay', 'मूल वेतन'])) || 33800,
            cellNo: Number(getVal(['Cell No', 'CellNo', 'सेल'])) || 1,
            incrementMonth: ((getVal(['Increment Month', 'इंक्रीमेंट माह']) || 'July').toLowerCase().includes('jan') ? 'January' : 'July') as 'July' | 'January',
            phone: getVal(['Phone', 'Mobile', 'मोबाइल']) || '9829000000'
          };
        });

        setParsedTeacherPreview(parsed);
      } catch (err) {
        console.error('Teacher Excel parse error:', err);
        alert(isHi ? 'शिक्षक फाइल पढ़ने में त्रुटि। कृपया सही Excel फाइल चुनें।' : 'Error reading staff Excel file.');
      }
    };
    reader.readAsBinaryString(file);
  };

  const confirmImportTeachers = () => {
    if (!parsedTeacherPreview) return;
    onUpdateTeachers([...teachers, ...parsedTeacherPreview]);
    alert(isHi ? `${parsedTeacherPreview.length} शिक्षकों/कर्मचारियों का डेटा ऐप में जुड़ गया है!` : `Successfully added ${parsedTeacherPreview.length} staff members!`);
    setParsedTeacherPreview(null);
    if (teacherFileInputRef.current) teacherFileInputRef.current.value = '';
  };

  const downloadSampleTeacherTemplate = () => {
    const sampleData = [
      {
        'Name': 'Rameshwar Sharma',
        'Name Hindi': 'रामेश्वर शर्मा',
        'Designation': 'Principal',
        'Subject': 'Pol Science',
        'Employee ID': 'RJPA20011502',
        'Pay Level': 'L-14',
        'Basic Pay': 82400,
        'Increment Month': 'July',
        'Phone': '9414123456'
      },
      {
        'Name': 'Sunita Choudhary',
        'Name Hindi': 'सुनीता चौधरी',
        'Designation': 'Senior Teacher',
        'Subject': 'Mathematics',
        'Employee ID': 'RJPA20158810',
        'Pay Level': 'L-11',
        'Basic Pay': 46500,
        'Increment Month': 'July',
        'Phone': '9460112233'
      }
    ];
    const ws = XLSX.utils.json_to_sheet(sampleData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Staff_Template');
    XLSX.writeFile(wb, 'Staff_Data_Import_Template.xlsx');
  };

  // --- MANUAL ADD STUDENT ---
  const handleAddStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudent.studentName || !newStudent.srNo) {
      alert(isHi ? 'कृपया विद्यार्थी का नाम और एसआर नंबर भरें।' : 'Please fill student name and SR No.');
      return;
    }
    const createdStudent: StudentResult = {
      id: `std-${Date.now()}`,
      srNo: newStudent.srNo || '',
      rollNo: newStudent.rollNo || '1',
      studentName: newStudent.studentName || '',
      fatherName: newStudent.fatherName || '',
      className: newStudent.className || 'Class 10-A',
      section: newStudent.section || 'A',
      gender: (newStudent.gender || 'Male') as any,
      category: (newStudent.category || 'GEN') as any,
      aadhaarStatus: (newStudent.aadhaarStatus || 'Verified') as any,
      janAadhaarStatus: (newStudent.janAadhaarStatus || 'Verified') as any,
      apaarStatus: (newStudent.apaarStatus || 'Generated') as any,
      marks: []
    };
    onUpdateStudents([...students, createdStudent]);
    setShowAddStudentModal(false);
    setNewStudent({
      srNo: '',
      rollNo: '',
      studentName: '',
      fatherName: '',
      className: 'Class 10-A',
      section: 'A',
      gender: 'Male',
      category: 'GEN'
    });
  };

  // Delete Student
  const handleDeleteStudent = (id: string) => {
    if (window.confirm(isHi ? 'क्या आप इस छात्र का रिकॉर्ड हटाना चाहते हैं?' : 'Delete this student record?')) {
      onUpdateStudents(students.filter(s => s.id !== id));
    }
  };

  // --- MANUAL ADD TEACHER ---
  const handleAddTeacherSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeacher.name || !newTeacher.employeeId) {
      alert(isHi ? 'कृपया नाम एवं एम्प्लॉई आईडी भरें।' : 'Please fill name and Employee ID.');
      return;
    }
    const createdTeacher: Teacher = {
      id: `tch-${Date.now()}`,
      name: newTeacher.name || '',
      nameHindi: newTeacher.nameHindi || '',
      designation: newTeacher.designation || 'Teacher Grade III',
      subject: newTeacher.subject || 'General',
      employeeId: newTeacher.employeeId || '',
      payLevel: newTeacher.payLevel || 'L-10',
      currentBasicPay: Number(newTeacher.currentBasicPay) || 33800,
      cellNo: 1,
      incrementMonth: (newTeacher.incrementMonth === 'January' ? 'January' : 'July') as 'July' | 'January',
      phone: newTeacher.phone || ''
    };
    onUpdateTeachers([...teachers, createdTeacher]);
    setShowAddTeacherModal(false);
    setNewTeacher({ name: '', nameHindi: '', designation: 'Teacher Grade III', subject: 'General', employeeId: '', payLevel: 'L-10', currentBasicPay: 33800 });
  };

  const handleDeleteTeacher = (id: string) => {
    if (window.confirm(isHi ? 'क्या आप इस शिक्षक का रिकॉर्ड हटाना चाहते हैं?' : 'Delete this teacher record?')) {
      onUpdateTeachers(teachers.filter(t => t.id !== id));
    }
  };

  // --- EXPORT FUNCTIONALITIES ---
  const exportStudentsToExcel = (className: string = 'ALL') => {
    const listToExport = className === 'ALL'
      ? students
      : students.filter(s => s.className.toLowerCase().includes(className.toLowerCase()));

    if (listToExport.length === 0) {
      alert(isHi ? 'निर्यात के लिए कोई विद्यार्थी डेटा मौजूद नहीं है।' : 'No student data available to export.');
      return;
    }

    const exportData = listToExport.map(s => ({
      'SR No': s.srNo,
      'Roll No': s.rollNo,
      'Student Name': s.studentName,
      'Father Name': s.fatherName,
      'Class': s.className,
      'Section': s.section,
      'Gender': s.gender,
      'Category': s.category,
      'Aadhaar Status': s.aadhaarStatus,
      'Jan Aadhaar Status': s.janAadhaarStatus,
      'APAAR Status': s.apaarStatus
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Students');
    XLSX.writeFile(wb, `Students_Roster_${className.replace(/\s+/g, '_')}.xlsx`);
  };

  const exportTeachersToExcel = () => {
    if (teachers.length === 0) {
      alert(isHi ? 'निर्यात के लिए कोई शिक्षक डेटा मौजूद नहीं है।' : 'No staff data available to export.');
      return;
    }

    const exportData = teachers.map(t => ({
      'Name': t.name,
      'Name Hindi': t.nameHindi,
      'Designation': t.designation,
      'Subject': t.subject,
      'Employee ID': t.employeeId,
      'Pay Level': t.payLevel,
      'Basic Pay': t.currentBasicPay,
      'Increment Month': t.incrementMonth,
      'Phone': t.phone
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Staff_Roster');
    XLSX.writeFile(wb, 'Staff_Roster_Export.xlsx');
  };

  const exportFullAppBackupJSON = () => {
    const fullBackup = {
      schoolProfile,
      teachers,
      students,
      exportTimestamp: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(fullBackup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Shala_Sahayak_Backup_${schoolProfile.udiseCode || 'Data'}.json`;
    a.click();
  };

  // Filtered Students
  const filteredStudents = students.filter(s => {
    const matchesSearch =
      s.studentName.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.srNo.includes(studentSearch) ||
      s.fatherName.toLowerCase().includes(studentSearch.toLowerCase());
    const matchesClass = selectedClassFilter === 'ALL' || s.className.toLowerCase().includes(selectedClassFilter.toLowerCase());
    return matchesSearch && matchesClass;
  });

  const availableClasses = Array.from(new Set(students.map(s => s.className)));

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-3 sm:p-5 shadow-lg border border-slate-200 dark:border-slate-800 space-y-4 animate-fadeIn">
      {/* 1. TOP HEADER */}
      <div className="flex items-center justify-between pb-2.5 border-b border-slate-200 dark:border-slate-800 gap-2">
        <div className="flex items-center gap-2">
          <ThreeDIcon name="building" size={24} />
          <h3 className="font-extrabold text-sm sm:text-base text-slate-800 dark:text-slate-100">
            {isHi ? 'स्कूल प्रोफाइल एवं डेटा प्रबंधन प्रभाग' : 'School Profile & Data Hub'}
          </h3>
        </div>
        {onBack && (
          <button
            onClick={onBack}
            className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all flex items-center gap-1 shrink-0 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{isHi ? 'वापस' : 'Back'}</span>
          </button>
        )}
      </div>

      {/* 2. SUB-NAV / MENU BACK BAR */}
      {activeTab !== 'grid' && (
        <div className="flex items-center justify-between bg-slate-100 dark:bg-slate-800/80 p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
          <button
            onClick={() => setActiveTab('grid')}
            className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[11px] sm:text-xs flex items-center gap-1 shadow transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{isHi ? '← प्रोफाइल मेनू' : '← Profile Menu'}</span>
          </button>
          <span className="text-[11px] sm:text-xs font-bold text-slate-700 dark:text-slate-300 truncate max-w-[200px] sm:max-w-none">
            {activeTab === 'settings' && (isHi ? '1. विद्यालय सेटिंग्स' : '1. School Settings')}
            {activeTab === 'students' && (isHi ? '2. छात्र डेटा (Excel Import)' : '2. Student Data')}
            {activeTab === 'teachers' && (isHi ? '3. शिक्षक डेटा (Excel Import)' : '3. Employee Data')}
            {activeTab === 'export' && (isHi ? '4. डेटा निर्यात केंद्र' : '4. Export Hub')}
          </span>
        </div>
      )}

      {/* 3. LANDING 3D CARDS GRID MENU */}
      {activeTab === 'grid' && (
        <div className="space-y-4 animate-fadeIn py-1">
          <div className="text-center max-w-xl mx-auto my-1">
            <h4 className="text-sm sm:text-lg font-black text-slate-800 dark:text-slate-100 flex items-center justify-center gap-2">
              <ThreeDIcon name="building" size={28} />
              <span>{isHi ? 'विद्यालय प्रोफाइल एवं केंद्रीकृत डेटा हब' : 'School Profile & Data Center'}</span>
            </h4>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            <ThreeDCard
              icon="building"
              label={isHi ? '1. विद्यालय विवरण' : '1. School Details'}
              onClick={() => setActiveTab('settings')}
            />

            <ThreeDCard
              icon="graduation"
              label={isHi ? '2. छात्र डेटा (Excel)' : '2. Student Data'}
              onClick={() => setActiveTab('students')}
            />

            <ThreeDCard
              icon="users"
              label={isHi ? '3. शिक्षक डेटा (Excel)' : '3. Employee Data'}
              onClick={() => setActiveTab('teachers')}
            />

            <ThreeDCard
              icon="briefcase"
              label={isHi ? '4. डेटा निर्यात' : '4. Export Data'}
              onClick={() => setActiveTab('export')}
            />
          </div>

          {/* Minimized Summary Banner */}
          <div className="p-2.5 sm:p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
            <div>
              <span className="block text-[10px] font-extrabold text-slate-500 uppercase">{isHi ? 'विद्यालय' : 'School'}</span>
              <span className="text-xs sm:text-sm font-black text-slate-800 dark:text-slate-100 truncate block">
                {schoolProfile.schoolName || (isHi ? 'अनुपलब्ध (Blank)' : 'Unset (Blank)')}
              </span>
            </div>
            <div>
              <span className="block text-[10px] font-extrabold text-slate-500 uppercase">{isHi ? 'यूडाइस कोड' : 'UDISE Code'}</span>
              <span className="text-xs sm:text-sm font-black text-emerald-600 dark:text-emerald-400">
                {schoolProfile.udiseCode || '---'}
              </span>
            </div>
            <div>
              <span className="block text-[10px] font-extrabold text-slate-500 uppercase">{isHi ? 'कुल विद्यार्थी' : 'Students'}</span>
              <span className="text-xs sm:text-sm font-black text-blue-600 dark:text-blue-400">{students.length}</span>
            </div>
            <div>
              <span className="block text-[10px] font-extrabold text-slate-500 uppercase">{isHi ? 'कुल कर्मचारी' : 'Staff'}</span>
              <span className="text-xs sm:text-sm font-black text-amber-600 dark:text-amber-400">{teachers.length}</span>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 1: SCHOOL SETTINGS */}
      {activeTab === 'settings' && (
        <div className="space-y-4 animate-fadeIn">
          {profileSavedToast && (
            <div className="p-3 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-200 text-xs font-extrabold rounded-xl border border-emerald-300 dark:border-emerald-700 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{isHi ? 'विद्यालय विवरण सफलतापूर्वक सहेजा गया!' : 'School Profile details saved successfully!'}</span>
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
              <h4 className="font-extrabold text-xs sm:text-sm text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-emerald-600" />
                <span>{isHi ? 'सामान्य विद्यालय जानकारी' : 'General School Information'}</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isHi ? 'विद्यालय नाम (अंग्रेजी)' : 'School Name (English)'}
                  </label>
                  <input
                    type="text"
                    value={profileForm.schoolName}
                    onChange={(e) => setProfileForm({ ...profileForm, schoolName: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold"
                    placeholder="e.g. Govt Sr Sec School Jaitaran"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isHi ? 'विद्यालय नाम (हिंदी)' : 'School Name (Hindi)'}
                  </label>
                  <input
                    type="text"
                    value={profileForm.schoolNameHindi || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, schoolNameHindi: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold"
                    placeholder="उदा. राजकीय उच्च माध्यमिक विद्यालय जैतारण"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isHi ? 'यूडाइस (DISE) कोड' : 'UDISE Code'}
                  </label>
                  <input
                    type="text"
                    value={profileForm.udiseCode}
                    onChange={(e) => setProfileForm({ ...profileForm, udiseCode: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold"
                    placeholder="08180401205"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isHi ? 'एनआईसी (NIC) कोड' : 'NIC Code'}
                  </label>
                  <input
                    type="text"
                    value={profileForm.nicCode || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, nicCode: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold"
                    placeholder="215890"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isHi ? 'संस्थाप्रधान / पीईईओ नाम' : 'Principal / PEEO Name'}
                  </label>
                  <input
                    type="text"
                    value={profileForm.principalName}
                    onChange={(e) => setProfileForm({ ...profileForm, principalName: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isHi ? 'पदनाम' : 'Designation'}
                  </label>
                  <input
                    type="text"
                    value={profileForm.principalDesignation || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, principalDesignation: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold"
                    placeholder="Principal & PEEO"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isHi ? 'ज़िला (District)' : 'District'}
                  </label>
                  <input
                    type="text"
                    value={profileForm.district}
                    onChange={(e) => setProfileForm({ ...profileForm, district: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {isHi ? 'ब्लॉक (Block)' : 'Block'}
                  </label>
                  <input
                    type="text"
                    value={profileForm.block}
                    onChange={(e) => setProfileForm({ ...profileForm, block: e.target.value })}
                    className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center gap-1.5 shadow transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{isHi ? 'सेटिंग्स सहेजें (Save Settings)' : 'Save Settings'}</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleLoadSampleData}
                  className="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center gap-1 shadow transition-all cursor-pointer"
                  title="लोड डेमो डेटा"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isHi ? 'डेमो डेटा भरें' : 'Load Demo Data'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleClearAllData}
                  className="px-3 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1 shadow transition-all cursor-pointer"
                  title="डेटा साफ़ करें"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{isHi ? 'डेटा साफ़ करें (Blank)' : 'Clear Blank'}</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* SUB-TAB 2: STUDENT DATA (EXCEL IMPORT & MANAGE) */}
      {activeTab === 'students' && (
        <div className="space-y-4 animate-fadeIn">
          {/* Top Actions & Excel Import Box */}
          <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div>
                <h4 className="font-extrabold text-xs sm:text-sm text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  <span>{isHi ? 'एक्सेल शीट से छात्र डेटा इम्पोर्ट करें' : 'Import Student Data via Excel Sheet'}</span>
                </h4>
                <p className="text-[11px] text-emerald-700 dark:text-emerald-300 mt-0.5">
                  {isHi
                    ? 'अपनी शाला दर्पण या एक्सेल फाइल चुनें। सभी मॉड्यूल में ऑटो-अपडेट हो जाएगा।'
                    : 'Upload your Excel roster (.xlsx/.xls/.csv) to sync student data app-wide.'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={downloadSampleStudentTemplate}
                  className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 font-bold text-xs flex items-center gap-1 shadow-xs hover:bg-emerald-100 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{isHi ? 'सैंपल एक्सेल डाउनलोड' : 'Sample Template'}</span>
                </button>

                <label className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center gap-1 shadow-md cursor-pointer transition-all">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{isHi ? 'एक्सेल चुनें (.xlsx)' : 'Choose Excel'}</span>
                  <input
                    ref={studentFileInputRef}
                    type="file"
                    accept=".xlsx, .xls, .csv"
                    onChange={handleStudentFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Parsed Preview Table Modal / Inline Box */}
            {parsedStudentPreview && (
              <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border-2 border-emerald-500 space-y-2 text-xs">
                <div className="flex items-center justify-between font-extrabold text-emerald-800 dark:text-emerald-300">
                  <span>{isHi ? `पूर्वावलोकन: ${parsedStudentPreview.length} छात्र मिले` : `Preview: Found ${parsedStudentPreview.length} Students`}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={confirmImportStudents}
                      className="px-3 py-1 bg-emerald-600 text-white rounded-lg font-black hover:bg-emerald-700 cursor-pointer"
                    >
                      {isHi ? 'इम्पोर्ट कन्फर्म करें' : 'Confirm Import'}
                    </button>
                    <button
                      onClick={() => setParsedStudentPreview(null)}
                      className="px-2 py-1 bg-slate-200 dark:bg-slate-700 rounded-lg text-slate-700 dark:text-slate-200 cursor-pointer"
                    >
                      {isHi ? 'रद्द करें' : 'Cancel'}
                    </button>
                  </div>
                </div>

                <div className="max-h-48 overflow-y-auto border border-slate-200 dark:border-slate-800 rounded-lg">
                  <table className="w-full text-left text-[11px]">
                    <thead className="bg-slate-100 dark:bg-slate-800 font-bold">
                      <tr>
                        <th className="p-1.5">SR</th>
                        <th className="p-1.5">Roll</th>
                        <th className="p-1.5">Student Name</th>
                        <th className="p-1.5">Father Name</th>
                        <th className="p-1.5">Class</th>
                      </tr>
                    </thead>
                    <tbody>
                      {parsedStudentPreview.slice(0, 10).map((p, i) => (
                        <tr key={i} className="border-t border-slate-200 dark:border-slate-800">
                          <td className="p-1.5 font-bold">{p.srNo}</td>
                          <td className="p-1.5">{p.rollNo}</td>
                          <td className="p-1.5 font-bold">{p.studentName}</td>
                          <td className="p-1.5">{p.fatherName}</td>
                          <td className="p-1.5">{p.className}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {parsedStudentPreview.length > 10 && (
                    <p className="text-[10px] text-slate-500 p-1.5 text-center bg-slate-50 dark:bg-slate-800">
                      ... {parsedStudentPreview.length - 10} more students
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Student Roster Header Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder={isHi ? 'छात्र/पिता का नाम या एसआर खोजें...' : 'Search student or SR...'}
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium"
                />
              </div>

              <select
                value={selectedClassFilter}
                onChange={(e) => setSelectedClassFilter(e.target.value)}
                className="py-1.5 px-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold"
              >
                <option value="ALL">{isHi ? 'सभी कक्षाएँ' : 'All Classes'}</option>
                {availableClasses.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                onClick={() => setShowAddStudentModal(true)}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center gap-1 shadow cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{isHi ? 'छात्र जोड़ें' : 'Add Student'}</span>
              </button>

              <button
                onClick={() => exportStudentsToExcel(selectedClassFilter)}
                className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs flex items-center gap-1 shadow cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{isHi ? 'एक्सेल एक्सपोर्ट' : 'Export Excel'}</span>
              </button>
            </div>
          </div>

          {/* Student Roster Table */}
          <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-slate-800/80 font-bold text-slate-700 dark:text-slate-300">
                <tr>
                  <th className="p-2.5">SR No</th>
                  <th className="p-2.5">Roll</th>
                  <th className="p-2.5">{isHi ? 'विद्यार्थी नाम' : 'Student Name'}</th>
                  <th className="p-2.5">{isHi ? 'पिता का नाम' : 'Father Name'}</th>
                  <th className="p-2.5">{isHi ? 'कक्षा' : 'Class'}</th>
                  <th className="p-2.5 text-center">{isHi ? 'कार्रवाई' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-slate-500 text-xs">
                      {isHi ? 'कोई विद्यार्थी डेटा नहीं मिला। ऊपर से एक्सेल इम्पोर्ट करें या छात्र जोड़ें।' : 'No student records found. Import Excel or add student above.'}
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((std) => (
                    <tr key={std.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="p-2.5 font-extrabold text-emerald-700 dark:text-emerald-400">{std.srNo}</td>
                      <td className="p-2.5 font-bold">{std.rollNo}</td>
                      <td className="p-2.5 font-black text-slate-800 dark:text-slate-100">{std.studentName}</td>
                      <td className="p-2.5 font-medium">{std.fatherName}</td>
                      <td className="p-2.5 font-bold">{std.className}</td>
                      <td className="p-2.5 text-center">
                        <button
                          onClick={() => handleDeleteStudent(std.id)}
                          className="p-1 rounded bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 hover:bg-rose-200 cursor-pointer"
                          title="हटाएँ"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Add Student Modal */}
          {showAddStudentModal && (
            <div className="fixed inset-0 z-[1100] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-4 border border-slate-200 dark:border-slate-800 space-y-3 shadow-2xl">
                <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 border-b border-slate-200 dark:border-slate-800 pb-2">
                  {isHi ? 'नया छात्र जोड़ें' : 'Add New Student'}
                </h4>
                <form onSubmit={handleAddStudentSubmit} className="space-y-3 text-xs">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-bold mb-1">SR No *</label>
                      <input
                        type="text"
                        required
                        value={newStudent.srNo}
                        onChange={(e) => setNewStudent({ ...newStudent, srNo: e.target.value })}
                        className="w-full p-2 border rounded-lg bg-white dark:bg-slate-800 font-bold"
                      />
                    </div>
                    <div>
                      <label className="block font-bold mb-1">Roll No</label>
                      <input
                        type="text"
                        value={newStudent.rollNo}
                        onChange={(e) => setNewStudent({ ...newStudent, rollNo: e.target.value })}
                        className="w-full p-2 border rounded-lg bg-white dark:bg-slate-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold mb-1">{isHi ? 'विद्यार्थी नाम *' : 'Student Name *'}</label>
                    <input
                      type="text"
                      required
                      value={newStudent.studentName}
                      onChange={(e) => setNewStudent({ ...newStudent, studentName: e.target.value })}
                      className="w-full p-2 border rounded-lg bg-white dark:bg-slate-800 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-1">{isHi ? 'पिता का नाम' : 'Father Name'}</label>
                    <input
                      type="text"
                      value={newStudent.fatherName}
                      onChange={(e) => setNewStudent({ ...newStudent, fatherName: e.target.value })}
                      className="w-full p-2 border rounded-lg bg-white dark:bg-slate-800"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-bold mb-1">{isHi ? 'कक्षा' : 'Class'}</label>
                      <input
                        type="text"
                        value={newStudent.className}
                        onChange={(e) => setNewStudent({ ...newStudent, className: e.target.value })}
                        className="w-full p-2 border rounded-lg bg-white dark:bg-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block font-bold mb-1">{isHi ? 'लिंग' : 'Gender'}</label>
                      <select
                        value={newStudent.gender}
                        onChange={(e) => setNewStudent({ ...newStudent, gender: e.target.value as any })}
                        className="w-full p-2 border rounded-lg bg-white dark:bg-slate-800"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddStudentModal(false)}
                      className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold"
                    >
                      {isHi ? 'रद्द करें' : 'Cancel'}
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-lg bg-emerald-600 text-white font-extrabold hover:bg-emerald-700"
                    >
                      {isHi ? 'सहेजें' : 'Save'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 3: EMPLOYEE DATA (EXCEL IMPORT & MANAGE) */}
      {activeTab === 'teachers' && (
        <div className="space-y-4 animate-fadeIn">
          {/* Top Actions & Excel Import Box */}
          <div className="p-3.5 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-800 space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div>
                <h4 className="font-extrabold text-xs sm:text-sm text-blue-900 dark:text-blue-200 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span>{isHi ? 'एक्सेल शीट से शिक्षक/स्टाफ डेटा इम्पोर्ट करें' : 'Import Staff Roster via Excel Sheet'}</span>
                </h4>
                <p className="text-[11px] text-blue-700 dark:text-blue-300 mt-0.5">
                  {isHi
                    ? 'अपनी शिक्षक सूची एक्सेल फाइल चुनें। समय सारणी, प्रभारी व वेतन वृद्धि में अपडेट हो जाएगा।'
                    : 'Upload staff Excel sheet to update teachers across all modules.'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={downloadSampleTeacherTemplate}
                  className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-700 font-bold text-xs flex items-center gap-1 shadow-xs hover:bg-blue-100 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{isHi ? 'सैंपल एक्सेल' : 'Sample Template'}</span>
                </button>

                <label className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs flex items-center gap-1 shadow-md cursor-pointer transition-all">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{isHi ? 'एक्सेल चुनें (.xlsx)' : 'Choose Excel'}</span>
                  <input
                    ref={teacherFileInputRef}
                    type="file"
                    accept=".xlsx, .xls, .csv"
                    onChange={handleTeacherFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Parsed Preview Table */}
            {parsedTeacherPreview && (
              <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border-2 border-blue-500 space-y-2 text-xs">
                <div className="flex items-center justify-between font-extrabold text-blue-800 dark:text-blue-300">
                  <span>{isHi ? `पूर्वावलोकन: ${parsedTeacherPreview.length} शिक्षक रिकॉर्ड मिले` : `Preview: Found ${parsedTeacherPreview.length} Staff Records`}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={confirmImportTeachers}
                      className="px-3 py-1 bg-blue-600 text-white rounded-lg font-black hover:bg-blue-700 cursor-pointer"
                    >
                      {isHi ? 'इम्पोर्ट कन्फर्म करें' : 'Confirm Import'}
                    </button>
                    <button
                      onClick={() => setParsedTeacherPreview(null)}
                      className="px-2 py-1 bg-slate-200 dark:bg-slate-700 rounded-lg text-slate-700 dark:text-slate-200 cursor-pointer"
                    >
                      {isHi ? 'रद्द करें' : 'Cancel'}
                    </button>
                  </div>
                </div>

                <div className="max-h-48 overflow-y-auto border border-slate-200 dark:border-slate-800 rounded-lg">
                  <table className="w-full text-left text-[11px]">
                    <thead className="bg-slate-100 dark:bg-slate-800 font-bold">
                      <tr>
                        <th className="p-1.5">Emp ID</th>
                        <th className="p-1.5">Name</th>
                        <th className="p-1.5">Designation</th>
                        <th className="p-1.5">Subject</th>
                        <th className="p-1.5">Pay Level</th>
                      </tr>
                    </thead>
                    <tbody>
                      {parsedTeacherPreview.slice(0, 10).map((t, i) => (
                        <tr key={i} className="border-t border-slate-200 dark:border-slate-800">
                          <td className="p-1.5 font-bold text-blue-600">{t.employeeId}</td>
                          <td className="p-1.5 font-bold">{t.name}</td>
                          <td className="p-1.5">{t.designation}</td>
                          <td className="p-1.5">{t.subject}</td>
                          <td className="p-1.5">{t.payLevel}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Roster Header */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="relative flex-1 w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder={isHi ? 'शिक्षक नाम या एम्प्लॉई आईडी खोजें...' : 'Search staff or Emp ID...'}
                value={teacherSearch}
                onChange={(e) => setTeacherSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                onClick={() => setShowAddTeacherModal(true)}
                className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs flex items-center gap-1 shadow cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{isHi ? 'शिक्षक जोड़ें' : 'Add Employee'}</span>
              </button>

              <button
                onClick={exportTeachersToExcel}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center gap-1 shadow cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{isHi ? 'एक्सेल एक्सपोर्ट' : 'Export Excel'}</span>
              </button>
            </div>
          </div>

          {/* Teacher Roster Table */}
          <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-slate-800/80 font-bold text-slate-700 dark:text-slate-300">
                <tr>
                  <th className="p-2.5">Emp ID</th>
                  <th className="p-2.5">{isHi ? 'शिक्षक का नाम' : 'Staff Name'}</th>
                  <th className="p-2.5">{isHi ? 'पदनाम' : 'Designation'}</th>
                  <th className="p-2.5">{isHi ? 'विषय' : 'Subject'}</th>
                  <th className="p-2.5">{isHi ? 'पे लेवल' : 'Pay Level'}</th>
                  <th className="p-2.5 text-center">{isHi ? 'कार्रवाई' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {teachers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-slate-500 text-xs">
                      {isHi ? 'कोई शिक्षक/कर्मचारी रिकॉर्ड नहीं मिला। एक्सेल इम्पोर्ट करें या शिक्षक जोड़ें।' : 'No staff records found. Import Excel or add employee above.'}
                    </td>
                  </tr>
                ) : (
                  teachers.filter(t => t.name.toLowerCase().includes(teacherSearch.toLowerCase()) || t.employeeId.includes(teacherSearch)).map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="p-2.5 font-bold text-blue-600 dark:text-blue-400">{t.employeeId}</td>
                      <td className="p-2.5 font-black text-slate-800 dark:text-slate-100">{t.nameHindi || t.name}</td>
                      <td className="p-2.5 font-bold">{t.designation}</td>
                      <td className="p-2.5 font-medium">{t.subject}</td>
                      <td className="p-2.5 font-bold">{t.payLevel}</td>
                      <td className="p-2.5 text-center">
                        <button
                          onClick={() => handleDeleteTeacher(t.id)}
                          className="p-1 rounded bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 hover:bg-rose-200 cursor-pointer"
                          title="हटाएँ"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Add Teacher Modal */}
          {showAddTeacherModal && (
            <div className="fixed inset-0 z-[1100] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-4 border border-slate-200 dark:border-slate-800 space-y-3 shadow-2xl">
                <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 border-b border-slate-200 dark:border-slate-800 pb-2">
                  {isHi ? 'नया शिक्षक जोड़ें' : 'Add New Employee'}
                </h4>
                <form onSubmit={handleAddTeacherSubmit} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold mb-1">Emp ID *</label>
                    <input
                      type="text"
                      required
                      value={newTeacher.employeeId}
                      onChange={(e) => setNewTeacher({ ...newTeacher, employeeId: e.target.value })}
                      className="w-full p-2 border rounded-lg bg-white dark:bg-slate-800 font-bold"
                      placeholder="RJPA20201234"
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-1">{isHi ? 'शिक्षक नाम (अंग्रेजी) *' : 'Name (English) *'}</label>
                    <input
                      type="text"
                      required
                      value={newTeacher.name}
                      onChange={(e) => setNewTeacher({ ...newTeacher, name: e.target.value })}
                      className="w-full p-2 border rounded-lg bg-white dark:bg-slate-800 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-1">{isHi ? 'शिक्षक नाम (हिंदी)' : 'Name (Hindi)'}</label>
                    <input
                      type="text"
                      value={newTeacher.nameHindi}
                      onChange={(e) => setNewTeacher({ ...newTeacher, nameHindi: e.target.value })}
                      className="w-full p-2 border rounded-lg bg-white dark:bg-slate-800"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-bold mb-1">{isHi ? 'पदनाम' : 'Designation'}</label>
                      <input
                        type="text"
                        value={newTeacher.designation}
                        onChange={(e) => setNewTeacher({ ...newTeacher, designation: e.target.value })}
                        className="w-full p-2 border rounded-lg bg-white dark:bg-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block font-bold mb-1">{isHi ? 'विषय' : 'Subject'}</label>
                      <input
                        type="text"
                        value={newTeacher.subject}
                        onChange={(e) => setNewTeacher({ ...newTeacher, subject: e.target.value })}
                        className="w-full p-2 border rounded-lg bg-white dark:bg-slate-800"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddTeacherModal(false)}
                      className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold"
                    >
                      {isHi ? 'रद्द करें' : 'Cancel'}
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-lg bg-blue-600 text-white font-extrabold hover:bg-blue-700"
                    >
                      {isHi ? 'सहेजें' : 'Save'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 4: EXPORT DATA HUB */}
      {activeTab === 'export' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="text-center max-w-lg mx-auto space-y-1">
            <h4 className="font-extrabold text-sm sm:text-base text-slate-800 dark:text-slate-100">
              {isHi ? 'केंद्रीय डेटा निर्यात एवं बैकअप मॉड्यूल' : 'Export & Data Backup Center'}
            </h4>
            <p className="text-xs text-slate-500">
              {isHi ? 'कक्षावार छात्र एक्सेल डाउनलोड करें अथवा ऐप का संपूर्ण बैकअप एक्सपोर्ट करें' : 'Export class-wise student Excel rosters or complete app data backups.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {/* Card 1: Student Classwise Export */}
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-3 flex flex-col justify-between">
              <div>
                <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold mb-2">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <h5 className="font-extrabold text-xs text-emerald-900 dark:text-emerald-200">
                  {isHi ? '1. विद्यार्थी डेटा (Excel Export)' : '1. Student Roster (Excel)'}
                </h5>
                <p className="text-[11px] text-emerald-700 dark:text-emerald-300 mt-1">
                  {isHi ? 'कक्षा का चयन करें और एक्सेल फाइल तुरंत डाउनलोड करें।' : 'Select class and download Excel spreadsheet.'}
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <select
                  value={exportClassSelect}
                  onChange={(e) => setExportClassSelect(e.target.value)}
                  className="w-full p-2 rounded-lg border border-emerald-300 dark:border-emerald-700 bg-white dark:bg-slate-900 text-xs font-bold"
                >
                  <option value="ALL">{isHi ? 'सभी कक्षाएँ (All Classes)' : 'All Classes'}</option>
                  {availableClasses.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>

                <button
                  onClick={() => exportStudentsToExcel(exportClassSelect)}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>{isHi ? 'एक्सेल डाउनलोड करें' : 'Download Excel'}</span>
                </button>
              </div>
            </div>

            {/* Card 2: Staff Export */}
            <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 space-y-3 flex flex-col justify-between">
              <div>
                <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold mb-2">
                  <Users className="w-5 h-5" />
                </div>
                <h5 className="font-extrabold text-xs text-blue-900 dark:text-blue-200">
                  {isHi ? '2. शिक्षक/कर्मचारी डेटा (Excel Export)' : '2. Employee Roster (Excel)'}
                </h5>
                <p className="text-[11px] text-blue-700 dark:text-blue-300 mt-1">
                  {isHi ? 'विद्यालय के सभी शिक्षकों की एम्प्लॉई आईडी व विवरण एक्सेल में पाएँ।' : 'Export complete staff directory with Emp IDs to Excel.'}
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={exportTeachersToExcel}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>{isHi ? 'कर्मचारी एक्सेल डाउनलोड' : 'Download Staff Excel'}</span>
                </button>
              </div>
            </div>

            {/* Card 3: Full Backup Export */}
            <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 space-y-3 flex flex-col justify-between">
              <div>
                <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold mb-2">
                  <FileText className="w-5 h-5" />
                </div>
                <h5 className="font-extrabold text-xs text-indigo-900 dark:text-indigo-200">
                  {isHi ? '3. संपूर्ण ऐप डेटा बैकअप (JSON)' : '3. Full App Data Backup (JSON)'}
                </h5>
                <p className="text-[11px] text-indigo-700 dark:text-indigo-300 mt-1">
                  {isHi ? 'विद्यालय प्रोफाइल, छात्र व शिक्षक का पूर्ण डेटा बैकअप सुरक्षित डाउनलोड करें।' : 'Export complete JSON backup file for offline storage.'}
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={exportFullAppBackupJSON}
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>{isHi ? 'बैकअप डाउनलोड' : 'Download Backup'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
