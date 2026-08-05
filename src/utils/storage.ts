import {
  SchoolProfile,
  Teacher,
  IncrementRecord,
  InchargeAssignment,
  DailySubstitution,
  StudentResult,
  StudentAnomaly,
  ICTEquipment,
  LibraryBook,
  MDMLog,
  TransportStudent,
  ScholarshipRecord,
  AparIprRecord,
  AadhaarPramanikaranRecord,
  ApaarIdRecord
} from '../types';

const KEYS = {
  SCHOOL_PROFILE: 'shala_school_profile',
  TEACHERS: 'shala_teachers',
  INCREMENTS: 'shala_increments',
  INCHARGES: 'shala_incharges',
  SUBSTITUTIONS: 'shala_substitutions',
  STUDENTS: 'shala_students',
  ANOMALIES: 'shala_anomalies',
  ICT_ITEMS: 'shala_ict_items',
  LIBRARY_BOOKS: 'shala_library_books',
  MDM_LOGS: 'shala_mdm_logs',
  TRANSPORT: 'shala_transport',
  SCHOLARSHIPS: 'shala_scholarships',
  PINNED_TOOLS: 'shala_pinned_tools',
  APAR_RECORDS: 'shala_apar_records',
  AADHAAR_PRAMANIKARAN: 'shala_aadhaar_pramanikaran',
  APAAR_RECORDS: 'shala_apaar_records',
  HIDDEN_MODULES: 'shala_hidden_modules',
  ADMIN_PIN: 'shala_admin_pin',
  ADMIN_PIN_ENABLED: 'shala_admin_pin_enabled'
};

// Initial Seed Data for first time launch so app has rich data
export const DEFAULT_SCHOOL_PROFILE: SchoolProfile = {
  schoolName: "Govt. Sr. Sec. School, Jaitaran",
  schoolNameHindi: "रा.उ.मा.वि. जैतारण",
  principalName: "Dr. Rameshwar Prasad Sharma",
  principalDesignation: "Principal & PEEO",
  udiseCode: "08180401205",
  nicCode: "215890",
  ddoCode: "21045",
  district: "Pali",
  block: "Jaitaran",
  address: "Station Road, Jaitaran, Pali (Raj) 306301",
  phone: "02939-222105",
  email: "ggsss.jaitaran@rajasthan.gov.in"
};

export const DEFAULT_TEACHERS: Teacher[] = [
  {
    id: "tch-1",
    name: "Dr. Rameshwar Prasad Sharma",
    nameHindi: "डॉ. रामेश्वर प्रसाद शर्मा",
    designation: "Principal",
    subject: "Administration / Pol. Science",
    employeeId: "RJPA20011502",
    payLevel: "L-14",
    currentBasicPay: 82400,
    cellNo: 12,
    incrementMonth: "July",
    phone: "9414123456"
  },
  {
    id: "tch-2",
    name: "Vikram Singh Rathore",
    nameHindi: "विक्रम सिंह राठौड़",
    designation: "Lecturer",
    subject: "Physics",
    employeeId: "RJPA20101890",
    payLevel: "L-12",
    currentBasicPay: 57800,
    cellNo: 8,
    incrementMonth: "July",
    phone: "9829011223"
  },
  {
    id: "tch-3",
    name: "Sunita Choudhary",
    nameHindi: "सुनीता चौधरी",
    designation: "Senior Teacher (Grade II)",
    subject: "Mathematics",
    employeeId: "RJPA20158810",
    payLevel: "L-11",
    currentBasicPay: 46500,
    cellNo: 8,
    incrementMonth: "July",
    phone: "9460112233"
  },
  {
    id: "tch-4",
    name: "Mahesh Kumar Saini",
    nameHindi: "महेश कुमार सैनी",
    designation: "Teacher Grade III (L2)",
    subject: "Science",
    employeeId: "RJPA20184420",
    payLevel: "L-10",
    currentBasicPay: 39100,
    cellNo: 6,
    incrementMonth: "July",
    phone: "9785123123"
  },
  {
    id: "tch-5",
    name: "Pooja Verma",
    nameHindi: "पूजा वर्मा",
    designation: "Computer Instructor",
    subject: "Computer Science",
    employeeId: "RJPA20229901",
    payLevel: "L-10",
    currentBasicPay: 33800,
    cellNo: 1,
    incrementMonth: "January",
    phone: "9928123411"
  },
  {
    id: "tch-6",
    name: "Gopal Ram Gurjar",
    nameHindi: "गोपाल राम गुर्जर",
    designation: "Librarian Grade III",
    subject: "Library Science",
    employeeId: "RJPA20163311",
    payLevel: "L-10",
    currentBasicPay: 36900,
    cellNo: 4,
    incrementMonth: "July",
    phone: "9166223344"
  }
];

export const DEFAULT_INCHARGES: InchargeAssignment[] = [
  {
    id: "inc-1",
    chargeName: "Mid-Day Meal (MDM) Incharge",
    chargeNameHindi: "मिड-डे मील (MDM) प्रभारी",
    category: "Welfare",
    assignedTeacherId: "tch-4",
    assignedTeacherName: "Mahesh Kumar Saini",
    assignedTeacherDesignation: "Teacher Grade III",
    orderDate: "2026-07-01"
  },
  {
    id: "inc-2",
    chargeName: "ICT / STEM Lab Incharge",
    chargeNameHindi: "आईसीटी व स्टेम लैब प्रभारी",
    category: "Technology",
    assignedTeacherId: "tch-5",
    assignedTeacherName: "Pooja Verma",
    assignedTeacherDesignation: "Computer Instructor",
    orderDate: "2026-07-01"
  },
  {
    id: "inc-3",
    chargeName: "Scholarship & Welfare Incharge",
    chargeNameHindi: "छात्रवृत्ति एवं कल्याण प्रभारी",
    category: "Welfare",
    assignedTeacherId: "tch-3",
    assignedTeacherName: "Sunita Choudhary",
    assignedTeacherDesignation: "Senior Teacher",
    orderDate: "2026-07-01"
  },
  {
    id: "inc-4",
    chargeName: "Exam & Result Incharge",
    chargeNameHindi: "परीक्षा व परिणाम प्रभारी",
    category: "Academics",
    assignedTeacherId: "tch-2",
    assignedTeacherName: "Vikram Singh Rathore",
    assignedTeacherDesignation: "Lecturer",
    orderDate: "2026-07-01"
  },
  {
    id: "inc-5",
    chargeName: "Lado / Balika Sambal Incharge",
    chargeNameHindi: "लाडो / बालिका संबल प्रभारी",
    category: "Girls Welfare",
    assignedTeacherId: "tch-3",
    assignedTeacherName: "Sunita Choudhary",
    assignedTeacherDesignation: "Senior Teacher",
    orderDate: "2026-07-01"
  },
  {
    id: "inc-6",
    chargeName: "Transport Voucher Incharge",
    chargeNameHindi: "परिवहन भत्ता / ट्रांसपोर्ट वाउचर प्रभारी",
    category: "Welfare",
    assignedTeacherId: "tch-4",
    assignedTeacherName: "Mahesh Kumar Saini",
    assignedTeacherDesignation: "Teacher Grade III",
    orderDate: "2026-07-01"
  }
];

export const DEFAULT_STUDENTS: StudentResult[] = [
  {
    id: "std-1",
    srNo: "1402",
    rollNo: "1001",
    studentName: "Aarav Sharma",
    fatherName: "Rajendra Sharma",
    className: "Class 10-A",
    section: "A",
    gender: "Male",
    category: "GEN",
    aadhaarStatus: "Verified",
    janAadhaarStatus: "Verified",
    apaarStatus: "Generated",
    maskedAadhaar: "XXXX-XXXX-4512",
    attendance: "92%",
    remarks: "Excellent performance in Mathematics",
    marks: [
      { subject: "Hindi", maxMarks: 100, obtainedMarks: 88 },
      { subject: "English", maxMarks: 100, obtainedMarks: 82 },
      { subject: "Mathematics", maxMarks: 100, obtainedMarks: 95 },
      { subject: "Science", maxMarks: 100, obtainedMarks: 91 },
      { subject: "Social Science", maxMarks: 100, obtainedMarks: 85 },
      { subject: "Third Language (Sanskrit)", maxMarks: 100, obtainedMarks: 89 },
      { subject: "Health & Physical Education", maxMarks: 100, obtainedMarks: 94 },
      { subject: "Information Technology", maxMarks: 100, obtainedMarks: 92 }
    ]
  },
  {
    id: "std-2",
    srNo: "1405",
    rollNo: "1002",
    studentName: "Ananya Kanwar",
    fatherName: "Bhawani Singh",
    className: "Class 10-A",
    section: "A",
    gender: "Female",
    category: "GEN",
    aadhaarStatus: "Verified",
    janAadhaarStatus: "Verified",
    apaarStatus: "Generated",
    maskedAadhaar: "XXXX-XXXX-8821",
    attendance: "96%",
    remarks: "Class Rank 1st",
    marks: [
      { subject: "Hindi", maxMarks: 100, obtainedMarks: 94 },
      { subject: "English", maxMarks: 100, obtainedMarks: 90 },
      { subject: "Mathematics", maxMarks: 100, obtainedMarks: 98 },
      { subject: "Science", maxMarks: 100, obtainedMarks: 96 },
      { subject: "Social Science", maxMarks: 100, obtainedMarks: 92 },
      { subject: "Third Language (Sanskrit)", maxMarks: 100, obtainedMarks: 95 },
      { subject: "Health & Physical Education", maxMarks: 100, obtainedMarks: 96 },
      { subject: "Information Technology", maxMarks: 100, obtainedMarks: 98 }
    ]
  },
  {
    id: "std-3",
    srNo: "1410",
    rollNo: "1001",
    studentName: "Vikram Meena",
    fatherName: "Kalu Ram Meena",
    className: "Class 9-A",
    section: "A",
    gender: "Male",
    category: "ST",
    aadhaarStatus: "Verified",
    janAadhaarStatus: "Pending",
    apaarStatus: "Generated",
    maskedAadhaar: "XXXX-XXXX-3310",
    attendance: "88%",
    remarks: "Good academic progress",
    marks: [
      { subject: "Hindi", maxMarks: 100, obtainedMarks: 76 },
      { subject: "English", maxMarks: 100, obtainedMarks: 70 },
      { subject: "Mathematics", maxMarks: 100, obtainedMarks: 82 },
      { subject: "Science", maxMarks: 100, obtainedMarks: 78 },
      { subject: "Social Science", maxMarks: 100, obtainedMarks: 75 },
      { subject: "Third Language (Sanskrit)", maxMarks: 100, obtainedMarks: 80 },
      { subject: "Health & Physical Education", maxMarks: 100, obtainedMarks: 88 },
      { subject: "Information Technology", maxMarks: 100, obtainedMarks: 84 }
    ]
  },
  {
    id: "std-4",
    srNo: "1412",
    rollNo: "1002",
    studentName: "Priyanka Gurjar",
    fatherName: "Ramswaroop Gurjar",
    className: "Class 9-A",
    section: "A",
    gender: "Female",
    category: "MBC",
    aadhaarStatus: "Verified",
    janAadhaarStatus: "Verified",
    apaarStatus: "Consent Pending",
    maskedAadhaar: "XXXX-XXXX-9022",
    attendance: "91%",
    remarks: "Active participant in school sports",
    marks: [
      { subject: "Hindi", maxMarks: 100, obtainedMarks: 84 },
      { subject: "English", maxMarks: 100, obtainedMarks: 80 },
      { subject: "Mathematics", maxMarks: 100, obtainedMarks: 78 },
      { subject: "Science", maxMarks: 100, obtainedMarks: 82 },
      { subject: "Social Science", maxMarks: 100, obtainedMarks: 86 },
      { subject: "Third Language (Sanskrit)", maxMarks: 100, obtainedMarks: 88 },
      { subject: "Health & Physical Education", maxMarks: 100, obtainedMarks: 95 },
      { subject: "Information Technology", maxMarks: 100, obtainedMarks: 86 }
    ]
  }
];

export const DEFAULT_ANOMALIES: StudentAnomaly[] = [
  {
    id: "anm-1",
    srNo: "1402",
    studentName: "Aarav Sharma",
    className: "Class 10-A",
    aadhaarStatus: "Seeded",
    janAadhaarStatus: "Seeded",
    apaarIdStatus: "Generated",
    maskedAadhaar: "XXXX-XXXX-4512"
  },
  {
    id: "anm-2",
    srNo: "1418",
    studentName: "Rahul Kumar Gurjar",
    className: "Class 9-B",
    aadhaarStatus: "Mismatch",
    janAadhaarStatus: "Pending",
    apaarIdStatus: "Error",
    maskedAadhaar: "XXXX-XXXX-8821",
    mismatchDetail: "DOB in Aadhaar is 15-08-2011, Shala Darpan has 12-08-2011"
  },
  {
    id: "anm-3",
    srNo: "1430",
    studentName: "Priyanka Meghwal",
    className: "Class 10-A",
    aadhaarStatus: "Pending",
    janAadhaarStatus: "Seeded",
    apaarIdStatus: "Pending",
    maskedAadhaar: "[Aadhaar Redacted]",
    mismatchDetail: "Father name spelling mismatch on Jan Aadhaar Portal"
  }
];

export const DEFAULT_ICT_ITEMS: ICTEquipment[] = [
  {
    id: "ict-1",
    itemName: "Dell Desktop Computer",
    itemCategory: "Desktop",
    serialNo: "DELL-LAB-01",
    quantity: 10,
    status: "Working",
    receivedDate: "2024-08-15",
    remarks: "Installed under ICT Phase-3 scheme"
  },
  {
    id: "ict-2",
    itemName: "Interactive Smart TV 65 Inch",
    itemCategory: "Smart TV",
    serialNo: "SAMSUNG-STV-99",
    quantity: 2,
    status: "Working",
    receivedDate: "2025-01-10",
    remarks: "Used in STEM Innovation Lab"
  },
  {
    id: "ict-3",
    itemName: "Numeric 2KVA Online UPS",
    itemCategory: "UPS",
    serialNo: "NUM-UPS-8812",
    quantity: 1,
    status: "Defective",
    receivedDate: "2024-08-15",
    complaintNo: "CMP-2026-9041",
    remarks: "Battery backup degraded, service engineer assigned"
  }
];

export const DEFAULT_LIBRARY_BOOKS: LibraryBook[] = [
  {
    id: "bk-1",
    accessionNo: "ACC-101",
    title: "Wings of Fire (अग्नि की उड़ान)",
    author: "Dr. A.P.J. Abdul Kalam",
    category: "Biography",
    totalCopies: 5,
    availableCopies: 4,
    issuedTo: [
      {
        personName: "Aarav Sharma (10-A)",
        role: "Student",
        issueDate: "2026-07-20",
        dueDate: "2026-08-03"
      }
    ]
  },
  {
    id: "bk-2",
    accessionNo: "ACC-205",
    title: "Rajasthan General Knowledge & Culture",
    author: "Dr. Lakshminarayan Nathuramka",
    category: "Competitive / History",
    totalCopies: 10,
    availableCopies: 8
  }
];

export const DEFAULT_MDM_LOGS: MDMLog[] = [
  {
    date: "2026-07-30",
    totalEnrolled: 340,
    totalPresent: 310,
    mealsServed: 298,
    menuItem: "Chapati, Dal & Vegetable (रोटी, दाल व सब्जी)",
    wheatUsedKg: 29.8,
    riceUsedKg: 0,
    cookingCostSpent: 1624,
    milkDistributedLiters: 45
  },
  {
    date: "2026-07-31",
    totalEnrolled: 340,
    totalPresent: 315,
    mealsServed: 305,
    menuItem: "Rice, Chana Dal & Milk (चावल, चना दाल व दुग्ध)",
    wheatUsedKg: 0,
    riceUsedKg: 30.5,
    cookingCostSpent: 1662,
    milkDistributedLiters: 46
  }
];

export const DEFAULT_APAR_RECORDS: AparIprRecord[] = [
  {
    id: "apar-1",
    employeeId: "RJPA20011502",
    employeeName: "Dr. Rameshwar Prasad Sharma",
    designation: "Principal & PEEO",
    schoolName: "Govt. Sr. Sec. School, Jaitaran",
    aparStatus: "Accepted",
    iprStatus: "Filed",
    financialYear: "2025-26",
    submissionDate: "2026-04-10",
    remarks: "Evaluated & Accepted by Controlling Authority"
  },
  {
    id: "apar-2",
    employeeId: "RJPA20101890",
    employeeName: "Vikram Singh Rathore",
    designation: "Lecturer Physics",
    schoolName: "Govt. Sr. Sec. School, Jaitaran",
    aparStatus: "Submitted",
    iprStatus: "Filed",
    financialYear: "2025-26",
    submissionDate: "2026-05-02",
    remarks: "Pending review at Reporting Officer level"
  },
  {
    id: "apar-3",
    employeeId: "RJPA20158810",
    employeeName: "Sunita Choudhary",
    designation: "Senior Teacher Maths",
    schoolName: "Govt. Sr. Sec. School, Jaitaran",
    aparStatus: "Submitted",
    iprStatus: "Filed",
    financialYear: "2025-26",
    submissionDate: "2026-05-15",
    remarks: "Submitted on RajKaj Portal"
  },
  {
    id: "apar-4",
    employeeId: "RJPA20184420",
    employeeName: "Mahesh Kumar Saini",
    designation: "Teacher Grade III",
    schoolName: "Govt. Upper Primary School, Nimaj Road",
    aparStatus: "Pending",
    iprStatus: "Filed",
    financialYear: "2025-26",
    remarks: "Notice issued for APAR submission"
  },
  {
    id: "apar-5",
    employeeId: "RJPA20229901",
    employeeName: "Pooja Verma",
    designation: "Computer Instructor",
    schoolName: "Govt. Sr. Sec. School, Jaitaran",
    aparStatus: "Accepted",
    iprStatus: "Exempted",
    financialYear: "2025-26",
    submissionDate: "2026-04-20",
    remarks: "First year probation completed"
  }
];

export const DEFAULT_AADHAAR_RECORDS: AadhaarPramanikaranRecord[] = [
  {
    id: "adh-1",
    personType: "Student",
    srNoOrEmpId: "1402",
    name: "Aarav Sharma",
    fatherOrGuardianName: "Rajendra Sharma",
    classNameOrDesignation: "Class 10-A",
    schoolName: "Govt. Sr. Sec. School, Jaitaran",
    aadhaarStatus: "Verified",
    janAadhaarStatus: "Verified",
    maskedAadhaar: "XXXX-XXXX-4512"
  },
  {
    id: "adh-2",
    personType: "Student",
    srNoOrEmpId: "1405",
    name: "Ananya Kanwar",
    fatherOrGuardianName: "Bhawani Singh",
    classNameOrDesignation: "Class 10-A",
    schoolName: "Govt. Sr. Sec. School, Jaitaran",
    aadhaarStatus: "Verified",
    janAadhaarStatus: "Verified",
    maskedAadhaar: "XXXX-XXXX-9910"
  },
  {
    id: "adh-3",
    personType: "Student",
    srNoOrEmpId: "1418",
    name: "Rahul Kumar Gurjar",
    fatherOrGuardianName: "Kalu Ram Gurjar",
    classNameOrDesignation: "Class 9-B",
    schoolName: "Govt. Upper Primary School, Nimaj Road",
    aadhaarStatus: "Mismatch",
    janAadhaarStatus: "Pending",
    maskedAadhaar: "XXXX-XXXX-8821",
    mismatchDetail: "DOB mismatch between Shala Darpan (12-08-2011) and Aadhaar (15-08-2011)"
  },
  {
    id: "adh-4",
    personType: "Student",
    srNoOrEmpId: "1430",
    name: "Priyanka Meghwal",
    fatherOrGuardianName: "Ramdayal Meghwal",
    classNameOrDesignation: "Class 8-A",
    schoolName: "Govt. Girls Upper Primary School, Jaitaran",
    aadhaarStatus: "Pending",
    janAadhaarStatus: "Mismatch",
    maskedAadhaar: "[Masked ID]",
    mismatchDetail: "Father Name spelling mismatch on Jan Aadhaar portal"
  },
  {
    id: "adh-5",
    personType: "Staff",
    srNoOrEmpId: "RJPA20184420",
    name: "Mahesh Kumar Saini",
    classNameOrDesignation: "Teacher Grade III",
    schoolName: "Govt. Upper Primary School, Nimaj Road",
    aadhaarStatus: "Verified",
    janAadhaarStatus: "Verified",
    maskedAadhaar: "XXXX-XXXX-7701"
  }
];

export const DEFAULT_APAAR_RECORDS: ApaarIdRecord[] = [
  {
    id: "apr-1",
    srNo: "1402",
    studentName: "Aarav Sharma",
    fatherName: "Rajendra Sharma",
    className: "Class 10",
    schoolName: "Govt. Sr. Sec. School, Jaitaran",
    parentConsentStatus: "Consent Received",
    apaarStatus: "APAAR Generated",
    apaarIdMasked: "APAAR-XXXX-8812",
    discrepancyType: "None"
  },
  {
    id: "apr-2",
    srNo: "1405",
    studentName: "Ananya Kanwar",
    fatherName: "Bhawani Singh",
    className: "Class 10",
    schoolName: "Govt. Sr. Sec. School, Jaitaran",
    parentConsentStatus: "Consent Received",
    apaarStatus: "APAAR Generated",
    apaarIdMasked: "APAAR-XXXX-9023",
    discrepancyType: "None"
  },
  {
    id: "apr-3",
    srNo: "1418",
    studentName: "Rahul Kumar Gurjar",
    fatherName: "Kalu Ram Gurjar",
    className: "Class 9",
    schoolName: "Govt. Upper Primary School, Nimaj Road",
    parentConsentStatus: "Consent Received",
    apaarStatus: "Error / Discrepancy",
    discrepancyType: "DOB Discrepancy",
    remarks: "UDISE+ DOB differs from Aadhaar database"
  },
  {
    id: "apr-4",
    srNo: "1430",
    studentName: "Priyanka Meghwal",
    fatherName: "Ramdayal Meghwal",
    className: "Class 8",
    schoolName: "Govt. Girls Upper Primary School, Jaitaran",
    parentConsentStatus: "Pending Consent",
    apaarStatus: "Pending Verification",
    discrepancyType: "Parent Name Difference",
    remarks: "Parent consent form submitted, pending portal upload"
  },
  {
    id: "apr-5",
    srNo: "1442",
    studentName: "Devendra Singh Bhati",
    fatherName: "Narpat Singh",
    className: "Class 11",
    schoolName: "Govt. Sr. Sec. School, Jaitaran",
    parentConsentStatus: "Consent Received",
    apaarStatus: "APAAR Generated",
    apaarIdMasked: "APAAR-XXXX-3311",
    discrepancyType: "None"
  }
];

// LocalStorage Helpers
export function getItem<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw) as T;
  } catch {
    return defaultValue;
  }
}

export function setItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error("LocalStorage write error", e);
  }
}

// Debounce timer for school profile auto-save
let autoSaveTimer: any = null;

export const storage = {
  getSchoolProfile: () => getItem<SchoolProfile>(KEYS.SCHOOL_PROFILE, DEFAULT_SCHOOL_PROFILE),
  setSchoolProfile: (data: SchoolProfile) => setItem(KEYS.SCHOOL_PROFILE, data),
  saveSchoolProfileDebounced: (data: SchoolProfile, callback?: () => void) => {
    if (autoSaveTimer) {
      clearTimeout(autoSaveTimer);
    }
    autoSaveTimer = setTimeout(() => {
      setItem(KEYS.SCHOOL_PROFILE, data);
      if (callback) callback();
    }, 1000); // 1.0 second debounce delay
  },

  getTeachers: () => getItem<Teacher[]>(KEYS.TEACHERS, DEFAULT_TEACHERS),
  setTeachers: (data: Teacher[]) => setItem(KEYS.TEACHERS, data),

  getIncrements: () => getItem<IncrementRecord[]>(KEYS.INCREMENTS, []),
  setIncrements: (data: IncrementRecord[]) => setItem(KEYS.INCREMENTS, data),

  getIncharges: () => getItem<InchargeAssignment[]>(KEYS.INCHARGES, DEFAULT_INCHARGES),
  setIncharges: (data: InchargeAssignment[]) => setItem(KEYS.INCHARGES, data),

  getStudents: () => getItem<StudentResult[]>(KEYS.STUDENTS, DEFAULT_STUDENTS),
  setStudents: (data: StudentResult[]) => setItem(KEYS.STUDENTS, data),

  getAnomalies: () => getItem<StudentAnomaly[]>(KEYS.ANOMALIES, DEFAULT_ANOMALIES),
  setAnomalies: (data: StudentAnomaly[]) => setItem(KEYS.ANOMALIES, data),

  getIctItems: () => getItem<ICTEquipment[]>(KEYS.ICT_ITEMS, DEFAULT_ICT_ITEMS),
  setIctItems: (data: ICTEquipment[]) => setItem(KEYS.ICT_ITEMS, data),

  getLibraryBooks: () => getItem<LibraryBook[]>(KEYS.LIBRARY_BOOKS, DEFAULT_LIBRARY_BOOKS),
  setLibraryBooks: (data: LibraryBook[]) => setItem(KEYS.LIBRARY_BOOKS, data),

  getMdmLogs: () => getItem<MDMLog[]>(KEYS.MDM_LOGS, DEFAULT_MDM_LOGS),
  setMdmLogs: (data: MDMLog[]) => setItem(KEYS.MDM_LOGS, data),

  getAparRecords: () => getItem<AparIprRecord[]>(KEYS.APAR_RECORDS, DEFAULT_APAR_RECORDS),
  setAparRecords: (data: AparIprRecord[]) => setItem(KEYS.APAR_RECORDS, data),

  getAadhaarRecords: () => getItem<AadhaarPramanikaranRecord[]>(KEYS.AADHAAR_PRAMANIKARAN, DEFAULT_AADHAAR_RECORDS),
  setAadhaarRecords: (data: AadhaarPramanikaranRecord[]) => setItem(KEYS.AADHAAR_PRAMANIKARAN, data),

  getApaarRecords: () => getItem<ApaarIdRecord[]>(KEYS.APAAR_RECORDS, DEFAULT_APAAR_RECORDS),
  setApaarRecords: (data: ApaarIdRecord[]) => setItem(KEYS.APAAR_RECORDS, data),

  getPinnedTools: (defaultIds: string[]) => getItem<string[]>(KEYS.PINNED_TOOLS, defaultIds),
  setPinnedTools: (data: string[]) => setItem(KEYS.PINNED_TOOLS, data),

  getHiddenModules: () => getItem<string[]>(KEYS.HIDDEN_MODULES, []),
  setHiddenModules: (data: string[]) => setItem(KEYS.HIDDEN_MODULES, data),

  getAdminPin: () => getItem<string>(KEYS.ADMIN_PIN, '1234'),
  setAdminPin: (pin: string) => setItem(KEYS.ADMIN_PIN, pin),

  isAdminPinEnabled: () => getItem<boolean>(KEYS.ADMIN_PIN_ENABLED, false),
  setAdminPinEnabled: (enabled: boolean) => setItem(KEYS.ADMIN_PIN_ENABLED, enabled),

  clearStaleData: () => {
    try {
      // Clear all shala_ keys
      Object.values(KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
      // Clear standard caches
      if ('caches' in window) {
        caches.keys().then(names => {
          names.forEach(name => {
            caches.delete(name);
          });
        });
      }
    } catch (e) {
      console.error("Failed to clear stale data:", e);
    }
  }
};
