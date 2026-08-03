export type Language = 'hi' | 'en';

export interface SchoolProfile {
  schoolName: string;
  schoolNameHindi: string;
  principalName: string;
  principalDesignation: string;
  udiseCode: string;
  nicCode: string;
  ddoCode: string;
  district: string;
  block: string;
  address: string;
  phone: string;
  email: string;
  hiddenModules?: string[];
}

export interface Teacher {
  id: string;
  name: string;
  nameHindi: string;
  designation: string;
  subject: string;
  employeeId: string; // NIC / Employee ID
  payLevel: string; // L-1 to L-16
  currentBasicPay: number;
  cellNo: number;
  incrementMonth: 'July' | 'January';
  phone: string;
  schoolName?: string;
  dateOfJoining?: string;
}

export interface IncrementRecord {
  id: string;
  teacherId: string;
  teacherName: string;
  designation: string;
  payLevel: string;
  oldBasicPay: number;
  newBasicPay: number;
  effectiveDate: string;
  orderNo: string;
  dispatchNo: string;
  dispatchDate: string;
  schoolName?: string;
  dateOfJoining?: string;
}

export interface TimeTableSlot {
  period: number; // 1 to 8
  className: string; // e.g. "Class 10-A"
  subject: string;
  teacherId: string;
  teacherName: string;
}

export interface InchargeAssignment {
  id: string;
  chargeName: string;
  chargeNameHindi: string;
  category: string;
  assignedTeacherId: string;
  assignedTeacherName: string;
  assignedTeacherDesignation: string;
  assistantTeacherId?: string;
  assistantTeacherName?: string;
  assistantTeacherDesignation?: string;
  schoolName?: string;
  handoverDate?: string;
  termSession?: string;
  remarks?: string;
  orderDate: string;
}

export interface AparIprRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  designation: string;
  schoolName: string;
  aparStatus: 'Submitted' | 'Accepted' | 'Pending' | 'Objection';
  iprStatus: 'Filed' | 'Exempted' | 'Overdue';
  financialYear: string;
  submissionDate?: string;
  remarks?: string;
}

export interface AadhaarPramanikaranRecord {
  id: string;
  personType: 'Student' | 'Staff';
  srNoOrEmpId: string;
  name: string;
  fatherOrGuardianName?: string;
  classNameOrDesignation: string;
  schoolName: string;
  aadhaarStatus: 'Verified' | 'Pending' | 'Mismatch' | 'Rejected';
  janAadhaarStatus: 'Verified' | 'Pending' | 'Mismatch' | 'Rejected';
  maskedAadhaar: string; // Raw IDs strictly omitted/masked
  mismatchDetail?: string;
}

export interface ApaarIdRecord {
  id: string;
  srNo: string;
  studentName: string;
  fatherName: string;
  className: string;
  schoolName: string;
  parentConsentStatus: 'Consent Received' | 'Pending Consent' | 'Refused';
  apaarStatus: 'APAAR Generated' | 'Pending Verification' | 'Error / Discrepancy';
  apaarIdMasked?: string;
  discrepancyType?: 'None' | 'Name Mismatch in UDISE+' | 'DOB Discrepancy' | 'Unlinked Aadhaar' | 'Parent Name Difference';
  remarks?: string;
}

export interface DailySubstitution {
  id: string;
  date: string;
  absentTeacherName: string;
  period: number;
  className: string;
  assignedTeacherName: string;
  notes: string;
}

export interface StudentResult {
  id: string;
  srNo: string;
  rollNo: string;
  studentName: string;
  fatherName: string;
  className: string;
  section: string;
  gender?: 'Male' | 'Female' | 'Other';
  category?: 'GEN' | 'OBC' | 'SC' | 'ST' | 'EWS' | 'MBC';
  aadhaarStatus?: 'Verified' | 'Pending' | 'Mismatch';
  aadhaarReason?: string;
  janAadhaarStatus?: 'Verified' | 'Pending' | 'Mismatch';
  janAadhaarReason?: string;
  apaarStatus?: 'Generated' | 'Consent Pending' | 'Failed';
  apaarReason?: string;
  maskedAadhaar?: string;
  marks: {
    subject: string;
    maxMarks: number;
    obtainedMarks: number;
  }[];
  attendance?: string;
  remarks?: string;
}

export interface StudentAnomaly {
  id: string;
  srNo: string;
  studentName: string;
  className: string;
  aadhaarStatus: 'Seeded' | 'Pending' | 'Mismatch';
  janAadhaarStatus: 'Seeded' | 'Pending' | 'Mismatch';
  apaarIdStatus: 'Generated' | 'Pending' | 'Error';
  maskedAadhaar: string; // e.g. "XXXX-XXXX-1234" or "[Aadhaar Redacted]"
  mismatchDetail?: string;
}

export interface ICTEquipment {
  id: string;
  itemName: string;
  itemCategory: 'Desktop' | 'Laptop' | 'Smart TV' | 'Projector' | 'UPS' | 'Printer' | 'K-Yan' | 'Other';
  serialNo: string;
  quantity: number;
  status: 'Working' | 'Defective' | 'Under Repair';
  receivedDate: string;
  complaintNo?: string;
  remarks: string;
}

export interface LibraryBook {
  id: string;
  accessionNo: string;
  title: string;
  author: string;
  category: string;
  totalCopies: number;
  availableCopies: number;
  issuedTo?: {
    personName: string;
    role: 'Student' | 'Teacher';
    issueDate: string;
    dueDate: string;
  }[];
}

export interface MDMLog {
  date: string;
  totalEnrolled: number;
  totalPresent: number;
  mealsServed: number;
  menuItem: string;
  wheatUsedKg: number;
  riceUsedKg: number;
  cookingCostSpent: number;
  milkDistributedLiters: number;
}

export interface TransportStudent {
  id: string;
  srNo: string;
  studentName: string;
  className: string;
  distanceCategory: '0-2 km' | '2-5 km' | '5+ km';
  modeOfTransport: 'Walk' | 'Bicycle' | 'Auto/Bus';
  monthlySubsidyAmount: number;
  bankAccountStatus: 'Verified' | 'Pending';
}

export interface ScholarshipRecord {
  id: string;
  studentName: string;
  className: string;
  category: 'SC' | 'ST' | 'OBC' | 'EWS' | 'Minority' | 'General';
  schemeName: string;
  applicationNo: string;
  verificationStatus: 'Pending Verification' | 'Verified at School' | 'Objection' | 'Approved';
  remarks: string;
}

export interface BoardExamSeatingRoom {
  roomNo: string;
  capacity: number;
  benchesPerRow: number;
  totalRows: number;
  allocatedClasses: string[]; // e.g., ["Class 10", "Class 12"]
}

export interface BoardRemunerationItem {
  role: 'Center Superintendent' | 'Assistant Supt' | 'Invigilator' | 'Class IV Staff' | 'Water Bearer';
  ratePerSession: number;
  sessionsCount: number;
  staffName: string;
}

export interface PortalLink {
  id: string;
  name: string;
  nameHindi: string;
  url: string;
  category: 'Primary' | 'Finance' | 'Board' | 'SSO' | 'Scholarship';
  description: string;
  descriptionHindi: string;
  badge?: string;
}

export interface PeriodDiaryEntry {
  periodNo: number;
  className: string;
  subject: string;
  topicTaught: string;
  learningOutcome: string;
  tlmActivity: string;
  homeworkGiven: string;
}

export interface TeacherDailyDiaryEntry {
  id: string;
  date: string;
  dayOfWeek: string;
  teacherName: string;
  employeeId: string;
  designation: string;
  assignedClass: string;
  periods: PeriodDiaryEntry[];
  totalStudents: number;
  presentStudents: number;
  absentStudents: number;
  absentRemarks: string;
  prarthnaSabhaDuty: string;
  cceaNoBagDayActivity: string;
  principalRemarks?: string;
  verifiedByPrincipal?: boolean;
}

export interface ScreenshotPlaceholderData {
  type: 'form_input' | 'dashboard_selector' | 'report_grid' | 'preview_card' | 'calendar_view';
  windowTitle: string;
  captionHi: string;
  captionEn: string;
  mockupData: {
    fields?: { label: string; value: string; status?: string }[];
    actionButton?: string;
    selectedCategory?: string;
    categories?: string[];
    highlightIndex?: number;
    headers?: string[];
    rows?: string[][];
    headerText?: string;
    subject?: string;
    status?: string;
    month?: string;
    events?: { date: string; title: string }[];
  };
}

export interface HelpStep {
  stepNum: number;
  titleHi: string;
  titleEn: string;
  descriptionHi: string;
  descriptionEn: string;
  tipHi?: string;
  tipEn?: string;
  screenshotPlaceholder?: ScreenshotPlaceholderData;
}

export interface SeoMeta {
  titleTag: string;
  metaDescription: string;
  h1Tag: string;
  slugUrl: string;
  imageAltText: string;
}

export interface ContentSection {
  headingLevel: 'h2' | 'h3';
  headingHi: string;
  headingEn: string;
  contentHi: string;
  contentEn: string;
  tableData?: {
    headersHi: string[];
    headersEn: string[];
    rowsHi: string[][];
    rowsEn: string[][];
  };
  listItemsHi?: string[];
  listItemsEn?: string[];
}

export interface HelpGuide {
  id: string;
  titleHi: string;
  titleEn: string;
  categoryHi: string;
  categoryEn: string;
  categoryKey: 'peeo' | 'teacher' | 'incharge' | 'portals' | 'general';
  readTime: string;
  updatedDate: string;
  iconName: string;
  toolId: string;
  summaryHi: string;
  summaryEn: string;
  overviewHi?: string;
  overviewEn?: string;
  prerequisitesHi?: string[];
  prerequisitesEn?: string[];
  keyBenefitsHi: string[];
  keyBenefitsEn?: string[];
  steps: HelpStep[];
  seoMeta?: SeoMeta;
  contentSections?: ContentSection[];
}

