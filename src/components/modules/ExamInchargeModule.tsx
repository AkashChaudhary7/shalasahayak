import React, { useState, useEffect, useRef } from 'react';
import { SchoolProfile, Teacher, Language } from '../../types';
import { cleanClonedDocForCanvas } from '../../utils/safeHtml2Canvas';
import { ThreeDCard } from '../ThreeDIcon';
import { ExamSchedulePlanner } from './ExamSchedulePlanner';
import {
  Calendar,
  Users,
  Layers,
  Printer,
  Download,
  Plus,
  Trash2,
  CheckCircle2,
  Award,
  FileText,
  Check,
  Package,
  Clock,
  Coins,
  Shield,
  FileSpreadsheet,
  Grid,
  Globe,
  Notebook,
  AlertTriangle,
  ArrowLeft
} from 'lucide-react';

interface ExamInchargeModuleProps {
  schoolProfile: SchoolProfile;
  teachers?: Teacher[];
  lang: Language;
  onBack?: () => void;
}

const translations = {
  hi: {
    title: "परीक्षा प्रभारी (मूल्यांकन एवं परीक्षा) मॉड्यूल",
    subtitle: "सीटिंग अरेंजमेंट, वीक्षक ड्यूटी आवंटन, व्यय विवरण (UC) एवं बोर्ड/स्थानीय परीक्षा प्रलेखन",
    toggleLang: "English",
    generalTools: "सामान्य परीक्षा उपयोगिताएँ",
    categorizedTools: "विशिष्ट परीक्षा श्रेणियाँ",
    seatingTab: "परीक्षा बैठक व्यवस्था",
    dutyTab: "वीक्षक ड्यूटी आवंटन",
    expenditureTab: "परीक्षा व्यय एवं उपयोगिता प्रमाणपत्र (UC)",
    stockTab: "परीक्षा सामग्री स्टॉक बही",
    boardTab: "बोर्ड परीक्षा (कक्षा 5, 8, 10, 12)",
    localTab: "स्थानीय परीक्षा (कक्षा 1-4, 6, 7, 9, 11)",
    msraTab: "एमएसआरए / राज्य स्तरीय परीक्षा",
    seatingTitle: "परीक्षा बैठक व्यवस्था इंजन",
    seatingDesc: "दो अलग कक्षाओं के छात्रों को एकांतर क्रम में बैठाने हेतु स्वचालित चार्ट जनरेटर",
    totalRooms: "कुल परीक्षा कक्ष",
    benchCapacity: "प्रति बेंच क्षमता (छात्र)",
    classA: "कक्षा ए का नाम",
    classB: "कक्षा बी का नाम",
    generateArrangement: "बैठक व्यवस्था चार्ट जनरेट करें",
    roomChart: "कक्ष बैठक व्यवस्था चार्ट",
    doorSlip: "कक्ष रोल नंबर प्रवेश पर्ची (सिटिंग प्लान)",
    bench: "बेंच",
    rollNo: "अनुक्रमांक",
    dutyTitle: "वीक्षक (इनविजिलेटर) ड्यूटी आवंटन",
    dutyDesc: "बिना किसी दोहराव के शिक्षकों की परीक्षा ड्यूटी आवंटन एवं रोटेशन चार्ट",
    selectTeacher: "शिक्षक का चयन करें",
    assignRoom: "कक्ष आवंटित करें",
    addDuty: "ड्यूटी असाइन करें",
    autoAllot: "स्वचालित वीक्षक ड्यूटी आवंटित करें",
    dutyRoster: "दैनिक वीक्षण ड्यूटी रोस्टर",
    teacherName: "शिक्षक का नाम",
    assignedRoom: "आवंटित कक्ष",
    expTitle: "परीक्षा व्यय एवं उपयोगिता प्रमाणपत्र (UC)",
    expDesc: "स्टेशनरी, उत्तरपुस्तिका प्रिंटिंग व जलपान व्यय ट्रैकर एवं PEEO/DDO हेतु प्रमाणपत्र जनरेटर",
    itemName: "मद का नाम",
    amount: "व्यय राशि (₹)",
    addExpense: "नया व्यय जोड़ें",
    totalExp: "कुल स्वीकृत परीक्षा व्यय",
    generateUc: "उपयोगिता प्रमाणपत्र (UC) जनरेट करें",
    ucTitle: "उपयोगिता प्रमाणपत्र (Utilisation Certificate)",
    ucVerifyText: "प्रमाणित किया जाता है कि परीक्षा संचालन हेतु प्राप्त कुल राशि का उपयोग नियमानुसार मदवार किया गया है।",
    stockTitle: "परीक्षा सामग्री स्टॉक प्रविष्टि बही",
    stockDesc: "उत्तरपुस्तिकाओं, ग्राफ पेपर एवं गोपनीय प्रश्न-पत्र पैकेट का सुरक्षा लॉग",
    materialName: "सामग्री विवरण",
    openingStock: "प्रारंभिक स्टॉक",
    receivedStock: "प्राप्त स्टॉक",
    consumedStock: "खपत स्टॉक",
    balanceStock: "अंतिम शेष स्टॉक",
    mainAnswerBooks: "मुख्य उत्तरपुस्तिकाएं (24 पृष्ठ)",
    mapAnswerSheets: "मुख्य ग्राफ पेपर",
    supplementarySheets: "पूरक उत्तरपुस्तिकाएं (08 पृष्ठ)",
    questionPackets: "गोपनीय प्रश्न-पत्र पैकेट बंडल",
    boardTitle: "राजस्थान बोर्ड परीक्षा प्रारूप संकलन",
    boardCenterAttendance: "केन्द्र उपस्थिति पत्रक",
    boardAdmitCardRegister: "प्रवेश पत्र वितरण एवं सत्यापन रजिस्टर",
    boardDispatchRecord: "उत्तरपुस्तिका बंडल प्रेषण रिकॉर्ड",
    rollRange: "रोल नंबर रेंज",
    admitCardStatus: "सत्यापन स्थिति",
    dispatchSerial: "प्रेषण रजिस्टर क्र.सं.",
    weightKg: "बंडल का वजन (किग्रा)",
    speedPostNo: "स्पीड पोस्ट रसीद संख्या",
    localTitle: "स्थानीय विद्यालय परीक्षा रजिस्टर",
    localResultRegister: "अंकतालिका वितरण एवं प्राप्ति रजिस्टर",
    localPaperLog: "प्रश्न-पत्र लिफाफा खोलने व वितरण लॉग",
    parentSign: "अभिभावक हस्ताक्षर स्थिति",
    paperCode: "पेपर कोड",
    openTime: "लिफाफा खोलने का समय",
    witness1: "गवाह शिक्षक 1",
    witness2: "गवाह शिक्षक 2",
    handoverTime: "कक्ष वीक्षक को सुपुर्दगी समय",
    msraTitle: "राज्य स्तरीय एवं मुख्यमंत्री सर्वोदय परीक्षा",
    nominationLog: "छात्र नामांकन एवं पात्रता सत्यापन लॉग",
    centerVerification: "केन्द्र परीक्षार्थी सत्यापन शीट",
    candidateName: "परीक्षार्थी का नाम",
    scholarshipType: "छात्रवृत्ति योजना",
    eligibilityStatus: "पात्रता स्थिति",
    verificationStatus: "हस्ताक्षर सत्यापन स्थिति",
    print: "प्रिंट करें",
    downloadPdf: "PDF डाउनलोड करें",
    examInchargeSign: "परीक्षा प्रभारी",
    principalSign: "PEEO एवं प्रधानाचार्य",
    dispatchNo: "क्रमांक",
    date: "दिनांक",
    officePEEO: "कार्यालय पंचायत प्रारंभिक शिक्षा अधिकारी (PEEO) एवं प्रधानाचार्य",
    addStudent: "छात्र जोड़ें",
    studentName: "छात्र का नाम",
    class: "कक्षा"
  },
  en: {
    title: "Exam Incharge (Evaluation & Examinations) Module",
    subtitle: "Seating Arrangement, Invigilator Duty Allocation, Expenditure UC, and Board/Local Exam Documentation",
    toggleLang: "हिंदी",
    generalTools: "Common Exam Utilities",
    categorizedTools: "Categorized Exam Sub-Modules",
    seatingTab: "Seating Arrangement",
    dutyTab: "Invigilator Duty Allocator",
    expenditureTab: "Expenditure & Grant Report",
    stockTab: "Stock Entry Ledger",
    boardTab: "Board Exams (Class 5, 8, 10, 12)",
    localTab: "Local Exams (Class 1-4, 6, 7, 9, 11)",
    msraTab: "MSRA State Scholarship",
    seatingTitle: "Exam Seating Arrangement Engine",
    seatingDesc: "Automated seating matrix generator for alternate students allocation to avoid collisions",
    totalRooms: "Total Rooms",
    benchCapacity: "Capacity per Bench (Students)",
    classA: "Class A Name",
    classB: "Class B Name",
    generateArrangement: "Generate Seating Plan",
    roomChart: "Room Seating Chart",
    doorSlip: "Roll No Door Slip (Sitting Plan)",
    bench: "Bench",
    rollNo: "Roll No",
    dutyTitle: "Invigilator Duty Allocation",
    dutyDesc: "Rotational exam invigilation duty roster preventing consecutive classroom fatigue",
    selectTeacher: "Select Teacher",
    assignRoom: "Assign Room",
    addDuty: "Assign Duty",
    autoAllot: "Auto Allot Invigilators",
    dutyRoster: "Daily Invigilation Duty Roster",
    teacherName: "Teacher Name",
    assignedRoom: "Assigned Room",
    expTitle: "Exam Expenditure & Utilisation Certificate (UC)",
    expDesc: "Stationery, Answer-book printing, refreshments expense ledger and formal PEEO/DDO submission report",
    itemName: "Expense Item Name",
    amount: "Amount (₹)",
    addExpense: "Add Expense Item",
    totalExp: "Total Approved Exam Expenditure",
    generateUc: "Generate Utilisation Certificate",
    ucTitle: "Utilisation Certificate (UC)",
    ucVerifyText: "This is certified that the total allocation amount received for exam conduction has been fully utilized as per financial rules.",
    stockTitle: "Exam Material Stock Register",
    stockDesc: "Security log for main answer sheets, supplementary sheets, graph paper and confidential packets",
    materialName: "Material Description",
    openingStock: "Opening Stock",
    receivedStock: "Stock Received",
    consumedStock: "Stock Consumed",
    balanceStock: "Closing Balance",
    mainAnswerBooks: "Main Answer Sheets (24 pages)",
    mapAnswerSheets: "Official Graph Papers",
    supplementarySheets: "Supplementary Answer Sheets (08 pages)",
    questionPackets: "Confidential Question Paper Packets",
    boardTitle: "Rajasthan Board Exam Formats Suite",
    boardCenterAttendance: "Center Attendance Sheet",
    boardAdmitCardRegister: "Admit Card Issue & Verification Register",
    boardDispatchRecord: "Answer Sheet Bundle Dispatch Log",
    rollRange: "Roll Number Range",
    admitCardStatus: "Verification Status",
    dispatchSerial: "Dispatch Register Sr.",
    weightKg: "Bundle Weight (KG)",
    speedPostNo: "Speed Post Tracking No",
    localTitle: "Local School Examination Logs",
    localResultRegister: "Marksheet Distribution & Receiving Register",
    localPaperLog: "Question Paper Envelope Opening Log",
    parentSign: "Parent Signing Record",
    paperCode: "Paper Code",
    openTime: "Opening Envelope Time",
    witness1: "Witness Teacher 1",
    witness2: "Witness Teacher 2",
    handoverTime: "Handover to Invigilator Time",
    msraTitle: "State Assessment & Scholarship Exams",
    nominationLog: "Candidate Nomination & Eligibility Log",
    centerVerification: "Center Roster & Verification Sheet",
    candidateName: "Candidate Name",
    scholarshipType: "Scholarship Scheme",
    eligibilityStatus: "Eligibility Status",
    verificationStatus: "Signature Verification",
    print: "Print Chart",
    downloadPdf: "Download PDF",
    examInchargeSign: "Exam Incharge",
    principalSign: "PEEO & Principal",
    dispatchNo: "Dispatch No",
    date: "Date",
    officePEEO: "OFFICE OF PANCHAYAT ELEMENTARY EDUCATION OFFICER (PEEO) & PRINCIPAL",
    addStudent: "Add Student",
    studentName: "Student Name",
    class: "Class"
  }
};

interface SeatingBench {
  benchNo: number;
  studentA: { roll: string; name: string } | null;
  studentB: { roll: string; name: string } | null;
}

interface ExpenseItem {
  id: string;
  name: string;
  amount: number;
}

interface StockItem {
  id: string;
  nameKey: 'mainAnswerBooks' | 'mapAnswerSheets' | 'supplementarySheets' | 'questionPackets';
  opening: number;
  received: number;
  consumed: number;
}

interface DutyAllocation {
  id: string;
  teacherId: string;
  teacherName: string;
  room: string;
}

interface BoardAttendanceRow {
  rollNo: string;
  studentName: string;
  isPresent: 'Present' | 'Absent' | 'UM';
}

interface AdmitCardRow {
  rollNo: string;
  studentName: string;
  issuedOn: string;
  isVerified: boolean;
}

interface DispatchRow {
  id: string;
  date: string;
  subject: string;
  weightKg: number;
  dispatchNo: string;
  speedPostNo: string;
}

interface LocalResultRow {
  id: string;
  studentName: string;
  className: string;
  marksheetIssued: boolean;
  parentSigned: boolean;
}

interface LocalPaperEnvelopeRow {
  id: string;
  date: string;
  subject: string;
  code: string;
  openingTime: string;
  witness1: string;
  witness2: string;
  handoverTime: string;
}

interface MsraNominationRow {
  id: string;
  studentName: string;
  examType: string;
  rollNo: string;
  nominationVerified: boolean;
}

interface MsraVerificationRow {
  id: string;
  studentName: string;
  rollNo: string;
  deskNo: string;
  photoVerified: boolean;
  signatureVerified: boolean;
}

export const ExamInchargeModule: React.FC<ExamInchargeModuleProps> = ({
  schoolProfile,
  teachers = [],
  lang,
  onBack
}) => {
  const [modLang, setModLang] = useState<Language>(lang);

  useEffect(() => {
    setModLang(lang);
  }, [lang]);

  const isHi = modLang === 'hi';
  const tStrings = translations[modLang];

  // Primary active tab selector
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'schedule' | 'seating' | 'duty' | 'expenditure' | 'stock' | 'board' | 'local' | 'msra'
  >('dashboard');

  // Multi-sub-tabs categorization
  const [boardSubTab, setBoardSubTab] = useState<'attendance' | 'admit' | 'dispatch'>('attendance');
  const [localSubTab, setLocalSubTab] = useState<'result' | 'paper'>('result');
  const [msraSubTab, setMsraSubTab] = useState<'nomination' | 'verification'>('nomination');

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // --- SEATING ARRANGEMENT ENGINE ---
  const [roomCount, setRoomCount] = useState<number>(3);
  const [benchesPerRoom, setBenchesPerRoom] = useState<number>(10);
  const [classAName, setClassAName] = useState<string>('Class 10');
  const [classBName, setClassBName] = useState<string>('Class 12');

  const [classAStudents, setClassAStudents] = useState<{ roll: string; name: string }[]>([
    { roll: '10001', name: 'Rahul Sharma' },
    { roll: '10002', name: 'Priya Meena' },
    { roll: '10003', name: 'Amit Kumar' },
    { roll: '10004', name: 'Anjali Gupta' },
    { roll: '10005', name: 'Vijay Jat' },
    { roll: '10006', name: 'Neetu Choudhary' },
    { roll: '10007', name: 'Deepak Saini' },
    { roll: '10008', name: 'Rekha Verma' },
    { roll: '10009', name: 'Rajesh Gurjar' },
    { roll: '10010', name: 'Kiran Kanwar' }
  ]);

  const [classBStudents, setClassBStudents] = useState<{ roll: string; name: string }[]>([
    { roll: '12001', name: 'Sanjay Sharma' },
    { roll: '12002', name: 'Vikram Singh' },
    { roll: '12003', name: 'Sunita Meena' },
    { roll: '12004', name: 'Sita Kumari' },
    { roll: '12005', name: 'Narendra Singh' },
    { roll: '12006', name: 'Manish Kumar' },
    { roll: '12007', name: 'Ritu Kanwar' },
    { roll: '12008', name: 'Dinesh Jat' },
    { roll: '12009', name: 'Jyoti Verma' },
    { roll: '12010', name: 'Ajay Saini' }
  ]);

  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentRoll, setNewStudentRoll] = useState('');
  const [studentTargetClass, setStudentTargetClass] = useState<'A' | 'B'>('A');

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim() || !newStudentRoll.trim()) return;
    const item = { roll: newStudentRoll.trim(), name: newStudentName.trim() };
    if (studentTargetClass === 'A') {
      setClassAStudents([...classAStudents, item]);
    } else {
      setClassBStudents([...classBStudents, item]);
    }
    setNewStudentName('');
    setNewStudentRoll('');
    showToast(isHi ? 'छात्र को सफलतापूर्वक सूची में जोड़ा गया!' : 'Student added successfully to the list!');
  };

  const [generatedPlan, setGeneratedPlan] = useState<{ [room: string]: SeatingBench[] }>({});

  const generateSeatingArrangement = () => {
    const plan: { [room: string]: SeatingBench[] } = {};
    let aIdx = 0;
    let bIdx = 0;

    for (let r = 1; r <= roomCount; r++) {
      const roomName = isHi ? `कक्ष संख्या ${100 + r}` : `Room ${100 + r}`;
      const benches: SeatingBench[] = [];
      for (let b = 1; b <= benchesPerRoom; b++) {
        const studentA = aIdx < classAStudents.length ? classAStudents[aIdx++] : null;
        const studentB = bIdx < classBStudents.length ? classBStudents[bIdx++] : null;
        benches.push({
          benchNo: b,
          studentA,
          studentB
        });
      }
      plan[roomName] = benches;
    }
    setGeneratedPlan(plan);
    showToast(isHi ? 'कोलिशन-फ्री बैठक व्यवस्था सफलतापूर्वक जनरेट की गई!' : 'Collision-free seating arrangement plan generated successfully!');
  };

  useEffect(() => {
    generateSeatingArrangement();
  }, [roomCount, benchesPerRoom, classAStudents, classBStudents]);


  // --- INVIGILATOR DUTY ALLOCATOR ---
  const [dutyAllocations, setDutyAllocations] = useState<DutyAllocation[]>([
    { id: 'da-1', teacherId: teachers[0]?.id || '1', teacherName: teachers[0]?.name || 'Shri R.C. Choudhary', room: 'Room 101' },
    { id: 'da-2', teacherId: teachers[1]?.id || '2', teacherName: teachers[1]?.name || 'Smt. Anita Sharma', room: 'Room 102' }
  ]);
  const [dutyTeacherId, setDutyTeacherId] = useState<string>('');
  const [dutyRoom, setDutyRoom] = useState<string>('Room 101');

  const handleAddDuty = (e: React.FormEvent) => {
    e.preventDefault();
    const matched = teachers.find(t => t.id === dutyTeacherId);
    if (!matched) return;
    const newAllocation: DutyAllocation = {
      id: `da-${Date.now()}`,
      teacherId: matched.id,
      teacherName: matched.name,
      room: dutyRoom
    };
    setDutyAllocations([...dutyAllocations, newAllocation]);
    showToast(isHi ? 'शिक्षक ड्यूटी आवंटन सहेजा गया!' : 'Invigilator duty allocated successfully!');
  };

  const handleAutoAllotDuties = () => {
    if (teachers.length === 0) {
      showToast(isHi ? 'त्रुटि: पहले शिक्षक प्रोफ़ाइल डेटा दर्ज करें' : 'Error: No teachers available in database');
      return;
    }
    const allocated: DutyAllocation[] = [];
    teachers.forEach((t, index) => {
      const rNum = 101 + (index % roomCount);
      allocated.push({
        id: `da-${Date.now()}-${index}`,
        teacherId: t.id,
        teacherName: t.name,
        room: isHi ? `कक्ष संख्या ${rNum}` : `Room ${rNum}`
      });
    });
    setDutyAllocations(allocated);
    showToast(isHi ? 'रोटेशन पद्धति द्वारा सभी वीक्षकों की ड्यूटी आवंटित की गई!' : 'Rotational duties allocated to all teachers successfully!');
  };


  // --- EXPENDITURE & GRANT REPORT ---
  const [expenses, setExpenses] = useState<ExpenseItem[]>([
    { id: 'exp-1', name: isHi ? 'उत्तरपुस्तिका छपाई एवं लिफाफा क्रय' : 'Answer-book envelope & stationary printing', amount: 2450 },
    { id: 'exp-2', name: isHi ? 'केन्द्र जलपान एवं चाय व्यवस्था (वार्षिक)' : 'Exam Centre tea & refreshment setup', amount: 1200 },
    { id: 'exp-3', name: isHi ? 'बोर्ड गोपनीय प्रश्न-पत्र सुरक्षा पेटी ताला क्रय' : 'Lock for Board confidential paper trunk', amount: 350 },
    { id: 'exp-4', name: isHi ? 'परीक्षा केंद्र बोर्ड लेखन पेन व सील मोम' : 'Board examination center markers & sealing wax', amount: 540 }
  ]);
  const [newExpName, setNewExpName] = useState('');
  const [newExpAmount, setNewExpAmount] = useState('');

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpName.trim() || !newExpAmount.trim()) return;
    const newExp: ExpenseItem = {
      id: `exp-${Date.now()}`,
      name: newExpName.trim(),
      amount: Math.abs(Number(newExpAmount))
    };
    setExpenses([...expenses, newExp]);
    setNewExpName('');
    setNewExpAmount('');
    showToast(isHi ? 'नवीन परीक्षा व्यय मद जोड़ी गई!' : 'New expense item added to utilization log!');
  };

  const handleRemoveExpense = (id: string) => {
    setExpenses(expenses.filter(e => e.id !== id));
  };

  const totalExpenseSum = expenses.reduce((acc, curr) => acc + curr.amount, 0);


  // --- STOCK ENTRY LEDGER ---
  const [stockRecords, setStockRecords] = useState<StockItem[]>([
    { id: 's-1', nameKey: 'mainAnswerBooks', opening: 500, received: 1000, consumed: 750 },
    { id: 's-2', nameKey: 'mapAnswerSheets', opening: 120, received: 200, consumed: 80 },
    { id: 's-3', nameKey: 'supplementarySheets', opening: 300, received: 500, consumed: 120 },
    { id: 's-4', nameKey: 'questionPackets', opening: 0, received: 15, consumed: 15 }
  ]);

  const handleUpdateStock = (id: string, field: 'opening' | 'received' | 'consumed', val: number) => {
    setStockRecords(prev =>
      prev.map(item => (item.id === id ? { ...item, [field]: Math.max(0, val) } : item))
    );
  };


  // --- BOARD EXAMS SUITE STATE ---
  const [boardAttendance, setBoardAttendance] = useState<BoardAttendanceRow[]>([
    { rollNo: '2104501', studentName: 'Ramesh Chaudhary', isPresent: 'Present' },
    { rollNo: '2104502', studentName: 'Meena Kanwar', isPresent: 'Present' },
    { rollNo: '2104503', studentName: 'Vikash Kumar', isPresent: 'Absent' },
    { rollNo: '2104504', studentName: 'Komal Prajapat', isPresent: 'Present' },
    { rollNo: '2104505', studentName: 'Sita Ram Meena', isPresent: 'Present' }
  ]);

  const [admitCards, setAdmitCards] = useState<AdmitCardRow[]>([
    { rollNo: '2104501', studentName: 'Ramesh Chaudhary', issuedOn: '2026-02-28', isVerified: true },
    { rollNo: '2104502', studentName: 'Meena Kanwar', issuedOn: '2026-02-28', isVerified: true },
    { rollNo: '2104503', studentName: 'Vikash Kumar', issuedOn: '2026-03-01', isVerified: false },
    { rollNo: '2104504', studentName: 'Komal Prajapat', issuedOn: '2026-02-28', isVerified: true },
    { rollNo: '2104505', studentName: 'Sita Ram Meena', issuedOn: '2026-02-28', isVerified: true }
  ]);

  const [dispatches, setDispatches] = useState<DispatchRow[]>([
    { id: 'disp-1', date: '2026-03-05', subject: 'Hindi (Class 10)', weightKg: 8.4, dispatchNo: 'PEEO/2026/Ex/045', speedPostNo: 'ER482910492IN' },
    { id: 'disp-2', date: '2026-03-07', subject: 'English (Class 10)', weightKg: 8.5, dispatchNo: 'PEEO/2026/Ex/048', speedPostNo: 'ER482910515IN' }
  ]);

  // --- LOCAL EXAMS STATE ---
  const [localResults, setLocalResults] = useState<LocalResultRow[]>([
    { id: 'lr-1', studentName: 'Deepak Jat', className: 'Class 9', marksheetIssued: true, parentSigned: true },
    { rollNo: '9002', id: 'lr-2', studentName: 'Nisha Saini', className: 'Class 9', marksheetIssued: true, parentSigned: true },
    { rollNo: '9003', id: 'lr-3', studentName: 'Gopal Saini', className: 'Class 9', marksheetIssued: true, parentSigned: false }
  ]);

  const [localEnvelopes, setLocalEnvelopes] = useState<LocalPaperEnvelopeRow[]>([
    { id: 'env-1', date: '2026-04-12', subject: 'Mathematics (Class 9)', code: 'M-902', openingTime: '08:15 AM', witness1: 'Shri G.K. Vyas', witness2: 'Smt. R.K. Yadav', handoverTime: '08:25 AM' }
  ]);

  // --- MSRA STATE SCHOLARSHIP STATE ---
  const [msraNominations, setMsraNominations] = useState<MsraNominationRow[]>([
    { id: 'ms-1', studentName: 'Govind Ram Jat', examType: 'NMMS 2026', rollNo: '9510401', nominationVerified: true },
    { id: 'ms-2', studentName: 'Suresh Kumar Meena', examType: 'MSRA 2026', rollNo: '9510402', nominationVerified: true }
  ]);

  const [msraVerifications, setMsraVerifications] = useState<MsraVerificationRow[]>([
    { id: 'mv-1', studentName: 'Govind Ram Jat', rollNo: '9510401', deskNo: 'Room 3 - Bench 2', photoVerified: true, signatureVerified: true },
    { id: 'mv-2', studentName: 'Suresh Kumar Meena', rollNo: '9510402', deskNo: 'Room 3 - Bench 4', photoVerified: true, signatureVerified: true }
  ]);


  // PDF and Print ref
  const printableAreaRef = useRef<HTMLDivElement>(null);

  // Dynamic School Name helper
  const dynamicSchoolName = isHi
    ? (schoolProfile.schoolNameHindi || schoolProfile.schoolName)
    : schoolProfile.schoolName;

  // Handle Dynamic html2pdf export
  const handleDownloadPdf = async () => {
    showToast(isHi ? 'PDF रिपोर्ट तैयार की जा रही है...' : 'Generating formal PDF report...');
    const element = printableAreaRef.current;
    if (!element) return;

    try {
      // Dynamic loading of html2pdf bundle from CDN to avoid build-time issues
      const html2pdf = await new Promise<any>((resolve, reject) => {
        if ((window as any).html2pdf) {
          resolve((window as any).html2pdf);
          return;
        }
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
        script.onload = () => resolve((window as any).html2pdf);
        script.onerror = (e) => reject(e);
        document.body.appendChild(script);
      });

      const opt = {
        margin: [10, 10, 10, 10],
        filename: `Exam_Incharge_Report_${activeTab}_${Date.now()}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, onclone: (clonedDoc: Document) => cleanClonedDocForCanvas(clonedDoc) },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      html2pdf().set(opt).from(element).save();
    } catch (err) {
      console.error("PDF generation failed", err);
      showToast(isHi ? 'त्रुटि: PDF निर्माण विफल रहा।' : 'Error: PDF generation failed.');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4">
      
      {/* 1. STICKY TOP MODULE DASHBOARD PANEL */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200 dark:border-slate-800 space-y-4">
        
        {/* Module Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center space-x-2.5">
            {(onBack || activeTab !== 'dashboard') && (
              <button
                onClick={() => {
                  if (activeTab !== 'dashboard') {
                    setActiveTab('dashboard');
                  } else if (onBack) {
                    onBack();
                  }
                }}
                className="flex items-center justify-center w-9 h-9 mr-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl transition-all cursor-pointer border border-slate-200 dark:border-slate-700"
                title={isHi ? 'पीछे जाएं' : 'Go Back'}
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/40 text-emerald-700 dark:text-emerald-300">
              <Award className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-slate-100 leading-tight">
                {tStrings.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {activeTab !== 'dashboard' 
                  ? (isHi ? `अनुभाग: ${activeTab === 'seating' ? tStrings.seatingTab : activeTab === 'duty' ? tStrings.dutyTab : activeTab === 'expenditure' ? tStrings.expenditureTab : activeTab === 'stock' ? tStrings.stockTab : activeTab === 'board' ? tStrings.boardTab : activeTab === 'local' ? tStrings.localTab : tStrings.msraTab}` : `Section: ${activeTab}`)
                  : tStrings.subtitle
                }
              </p>
            </div>
          </div>

          {/* Controls: Language Switch & Global Download/Print */}
          <div className="flex items-center flex-wrap gap-2">
            <button
              onClick={() => setModLang(isHi ? 'en' : 'hi')}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-black flex items-center space-x-1.5 border border-slate-300/80 dark:border-slate-700 transition-all cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>{tStrings.toggleLang}</span>
            </button>

            {activeTab !== 'dashboard' && (
              <>
                <button
                  onClick={handlePrint}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center space-x-1.5 border border-slate-300/80 dark:border-slate-700 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-500" />
                  <span>{tStrings.print}</span>
                </button>

                <button
                  onClick={handleDownloadPdf}
                  className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-extrabold flex items-center space-x-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-amber-300" />
                  <span>{tStrings.downloadPdf}</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Live Status Feedback Toast */}
        {toastMessage && (
          <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center space-x-2 animate-fadeIn">
            <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* 2. TAB SELECTION GRID */}
        {activeTab === 'dashboard' && (
          <div className="space-y-2 text-xs">
            <span className="font-extrabold text-slate-500 block uppercase font-sans tracking-wide">
              {tStrings.generalTools}
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {[
                { id: 'schedule', label: isHi ? 'परीक्षा समय-सारणी प्लैनर' : 'Exam Schedule Planner', icon: 'calendar' },
                { id: 'seating', label: tStrings.seatingTab, icon: 'target' },
                { id: 'duty', label: tStrings.dutyTab, icon: 'users' },
                { id: 'expenditure', label: tStrings.expenditureTab, icon: 'coin' },
                { id: 'stock', label: tStrings.stockTab, icon: 'gold' }
              ].map(tab => {
                const isActive = activeTab === tab.id;
                return (
                  <ThreeDCard
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    icon={tab.icon}
                    label={tab.label}
                    active={isActive}
                  />
                );
              })}
            </div>

            <span className="font-extrabold text-slate-500 block uppercase font-sans tracking-wide pt-1">
              {tStrings.categorizedTools}
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { id: 'board', label: tStrings.boardTab, icon: 'book' },
                { id: 'local', label: tStrings.localTab, icon: 'briefcase' },
                { id: 'msra', label: tStrings.msraTab, icon: 'award' }
              ].map(tab => {
                const isActive = activeTab === tab.id;
                return (
                  <ThreeDCard
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    icon={tab.icon}
                    label={tab.label}
                    active={isActive}
                  />
                );
              })}
            </div>
          </div>
        )}

      </div>

      {/* 3. WORKING VIEW SECTION */}
      {activeTab !== 'dashboard' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200 dark:border-slate-800 space-y-5">
        
        {/* TAB 30: EXAM SCHEDULE PLANNER */}
        {activeTab === 'schedule' && (
          <ExamSchedulePlanner
            schoolProfile={schoolProfile}
            lang={modLang}
            onBack={() => setActiveTab('dashboard')}
          />
        )}

        {/* TAB 3A: SEATING ARRANGEMENT ENGINE */}
        {activeTab === 'seating' && (
          <div className="space-y-4">
            
            {/* Header description */}
            <div className="p-3 bg-emerald-50/60 dark:bg-emerald-950/20 rounded-xl border border-emerald-200 dark:border-emerald-800/40 text-xs text-emerald-800 dark:text-emerald-200">
              <h4 className="font-extrabold flex items-center gap-1.5 text-[13px] mb-1">
                <Grid className="w-4 h-4 text-emerald-600" />
                <span>{tStrings.seatingTitle}</span>
              </h4>
              <p>{tStrings.seatingDesc}</p>
            </div>

            {/* Config Panel */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              
              {/* Dimensions */}
              <div className="space-y-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <h5 className="font-extrabold text-slate-950 dark:text-slate-100 border-b border-slate-200 dark:border-slate-700 pb-1.5">
                  {isHi ? 'पैरामीटर्स सेट करें' : 'Set Dimensions'}
                </h5>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">{tStrings.totalRooms}</label>
                    <input
                      type="number"
                      value={roomCount}
                      onChange={e => setRoomCount(Math.max(1, Number(e.target.value)))}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">{tStrings.benchCapacity}</label>
                    <input
                      type="number"
                      value={benchesPerRoom}
                      onChange={e => setBenchesPerRoom(Math.max(1, Number(e.target.value)))}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">{tStrings.classA}</label>
                    <input
                      type="text"
                      value={classAName}
                      onChange={e => setClassAName(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">{tStrings.classB}</label>
                    <input
                      type="text"
                      value={classBName}
                      onChange={e => setClassBName(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Add Student Quick Form */}
              <form onSubmit={handleAddStudent} className="space-y-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <h5 className="font-extrabold text-slate-950 dark:text-slate-100 border-b border-slate-200 dark:border-slate-700 pb-1.5">
                  {isHi ? 'नवीन परीक्षार्थी विवरण प्रविष्टि' : 'Add New Candidate to Pool'}
                </h5>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">{tStrings.studentName}</label>
                    <input
                      type="text"
                      required
                      value={newStudentName}
                      onChange={e => setNewStudentName(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-medium"
                      placeholder="Rahul Saini"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 font-semibold mb-1">{tStrings.rollNo}</label>
                    <input
                      type="text"
                      required
                      value={newStudentRoll}
                      onChange={e => setNewStudentRoll(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono font-bold"
                      placeholder="10024"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 pt-2">
                  <div className="flex items-center space-x-3">
                    <label className="flex items-center space-x-1 cursor-pointer">
                      <input
                        type="radio"
                        name="tclass"
                        checked={studentTargetClass === 'A'}
                        onChange={() => setStudentTargetClass('A')}
                        className="accent-emerald-700"
                      />
                      <span className="font-bold text-slate-700 dark:text-slate-300">{classAName}</span>
                    </label>
                    <label className="flex items-center space-x-1 cursor-pointer">
                      <input
                        type="radio"
                        name="tclass"
                        checked={studentTargetClass === 'B'}
                        onChange={() => setStudentTargetClass('B')}
                        className="accent-emerald-700"
                      />
                      <span className="font-bold text-slate-700 dark:text-slate-300">{classBName}</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold flex items-center space-x-1 transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{tStrings.addStudent}</span>
                  </button>
                </div>
              </form>

            </div>

            {/* SEATING MATRIX OUTPUT STAGE */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-extrabold text-xs text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                  {isHi ? 'सुरक्षित परीक्षा कक्ष लेआउट' : 'Safe Examination Seating Layout'}
                </h4>
                <button
                  onClick={generateSeatingArrangement}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs transition-all cursor-pointer"
                >
                  {tStrings.generateArrangement}
                </button>
              </div>

              {/* Dynamic printable section */}
              <div ref={printableAreaRef} className="space-y-5 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-slate-950 printable-document">
                
                {/* Formal PEEO Head Letterhead */}
                <div className="text-center space-y-1 pb-3 border-b border-slate-300">
                  <span className="font-extrabold text-[13px] block text-emerald-800">
                    {tStrings.officePEEO}
                  </span>
                  <span className="font-black text-lg block uppercase">
                    {dynamicSchoolName}
                  </span>
                  <div className="flex justify-between text-xs font-mono pt-1 text-slate-600">
                    <span>{tStrings.dispatchNo}: PEEO/EX/SITTING/{schoolProfile.nicCode}/2026</span>
                    <span>{tStrings.date}: 2026-03-01</span>
                  </div>
                </div>

                <h4 className="font-black text-center text-sm uppercase pt-1 border-b border-dashed border-slate-200 pb-2">
                  {tStrings.roomChart} - {classAName} / {classBName}
                </h4>

                {/* Grid per room */}
                <div className="space-y-6">
                  {Object.keys(generatedPlan).map(room => (
                    <div key={room} className="space-y-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                      
                      {/* Door Slip Header */}
                      <div className="flex justify-between items-center bg-slate-200 px-3 py-2 rounded-lg text-xs font-black">
                        <span>{room}</span>
                        <span>{tStrings.doorSlip}</span>
                      </div>

                      {/* Alternate seating layout */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {generatedPlan[room].map((bench) => (
                          <div key={bench.benchNo} className="p-2 bg-white rounded-lg border border-slate-300 space-y-1.5 text-xs text-center shadow-xs">
                            <span className="font-black text-emerald-800 block border-b border-slate-100 pb-0.5">
                              {tStrings.bench} {bench.benchNo}
                            </span>
                            <div className="grid grid-cols-2 divide-x divide-slate-200">
                              <div className="px-1 text-center">
                                <span className="text-[10px] text-indigo-700 font-extrabold block">{classAName}</span>
                                <span className="font-black font-mono text-slate-900 text-[11px]">{bench.studentA?.roll || '-'}</span>
                                <span className="text-[9px] text-slate-500 block truncate">{bench.studentA?.name || ''}</span>
                              </div>
                              <div className="px-1 text-center">
                                <span className="text-[10px] text-rose-700 font-extrabold block">{classBName}</span>
                                <span className="font-black font-mono text-slate-900 text-[11px]">{bench.studentB?.roll || '-'}</span>
                                <span className="text-[9px] text-slate-500 block truncate">{bench.studentB?.name || ''}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                    </div>
                  ))}
                </div>

                {/* Signature Block */}
                <div className="flex justify-between pt-10 text-xs font-black text-slate-900 leading-relaxed">
                  <div className="text-center w-40">
                    <span className="block border-b border-slate-400 pb-4"></span>
                    <span>{tStrings.examInchargeSign}</span>
                  </div>
                  <div className="text-center w-52">
                    <span className="block border-b border-slate-400 pb-4"></span>
                    <span>{tStrings.principalSign}</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        )}

        {/* TAB 3B: INVIGILATOR DUTY ALLOCATOR */}
        {activeTab === 'duty' && (
          <div className="space-y-4">
            
            {/* Header Description */}
            <div className="p-3 bg-emerald-50/60 dark:bg-emerald-950/20 rounded-xl border border-emerald-200 dark:border-emerald-800/40 text-xs text-emerald-800 dark:text-emerald-200">
              <h4 className="font-extrabold flex items-center gap-1.5 text-[13px] mb-1">
                <Users className="w-4 h-4 text-emerald-600" />
                <span>{tStrings.dutyTitle}</span>
              </h4>
              <p>{tStrings.dutyDesc}</p>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between gap-3 text-xs">
              <h5 className="font-extrabold text-slate-900 dark:text-slate-100">
                {isHi ? 'वीक्षक प्रबंधन पैनल' : 'Duty Control Roster Panel'}
              </h5>
              <button
                onClick={handleAutoAllotDuties}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold flex items-center space-x-1.5 cursor-pointer"
              >
                <Users className="w-3.5 h-3.5 text-amber-300" />
                <span>{tStrings.autoAllot}</span>
              </button>
            </div>

            {/* Allocation Form & Table Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-xs">
              
              {/* Manual Form */}
              <form onSubmit={handleAddDuty} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3">
                <h6 className="font-extrabold text-slate-900 dark:text-slate-100 pb-1 border-b border-slate-200 dark:border-slate-700">
                  {isHi ? 'मैनुअल वीक्षक ड्यूटी प्रविष्टि' : 'Assign Manual Duty'}
                </h6>

                <div>
                  <label className="block text-slate-500 font-semibold mb-1">{tStrings.selectTeacher}</label>
                  <select
                    value={dutyTeacherId}
                    onChange={e => setDutyTeacherId(e.target.value)}
                    required
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
                  >
                    <option value="">{isHi ? '--- शिक्षक चुनें ---' : '--- Choose Teacher ---'}</option>
                    {teachers.map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-500 font-semibold mb-1">{tStrings.assignRoom}</label>
                  <input
                    type="text"
                    value={dutyRoom}
                    onChange={e => setDutyRoom(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
                    placeholder="Room 101"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black flex items-center justify-center space-x-1 transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{tStrings.addDuty}</span>
                </button>
              </form>

              {/* Roster Table */}
              <div className="lg:col-span-2 space-y-3">
                <h6 className="font-extrabold text-slate-900 dark:text-slate-100">
                  {tStrings.dutyRoster}
                </h6>

                <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                  <table className="w-full text-left">
                    <thead className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-extrabold border-b border-slate-200 dark:border-slate-700">
                      <tr>
                        <th className="p-2.5 text-center w-12">{isHi ? 'क्र.' : 'S.N.'}</th>
                        <th className="p-2.5">{tStrings.teacherName}</th>
                        <th className="p-2.5">{tStrings.assignedRoom}</th>
                        <th className="p-2.5 text-center w-16">{isHi ? 'हटाएं' : 'Delete'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                      {dutyAllocations.map((alloc, idx) => (
                        <tr key={alloc.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                          <td className="p-2.5 text-center text-slate-400 font-mono font-bold">{idx + 1}</td>
                          <td className="p-2.5 font-extrabold text-slate-900 dark:text-slate-100">{alloc.teacherName}</td>
                          <td className="p-2.5 font-bold font-mono text-indigo-700 dark:text-indigo-400">{alloc.room}</td>
                          <td className="p-2.5 text-center">
                            <button
                              onClick={() => setDutyAllocations(dutyAllocations.filter(d => d.id !== alloc.id))}
                              className="text-rose-600 dark:text-rose-400 hover:text-rose-800 transition-colors p-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 3C: EXPENDITURE & GRANT REPORT (UC GENERATOR) */}
        {activeTab === 'expenditure' && (
          <div className="space-y-4">
            
            {/* Header Description */}
            <div className="p-3 bg-emerald-50/60 dark:bg-emerald-950/20 rounded-xl border border-emerald-200 dark:border-emerald-800/40 text-xs text-emerald-800 dark:text-emerald-200">
              <h4 className="font-extrabold flex items-center gap-1.5 text-[13px] mb-1">
                <Coins className="w-4 h-4 text-emerald-600" />
                <span>{tStrings.expTitle}</span>
              </h4>
              <p>{tStrings.expDesc}</p>
            </div>

            {/* Form and ledger grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-xs">
              
              {/* Form Expense Add */}
              <form onSubmit={handleAddExpense} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3">
                <h6 className="font-extrabold text-slate-900 dark:text-slate-100 pb-1 border-b border-slate-200 dark:border-slate-700">
                  {isHi ? 'नया व्यय मद जोड़ें' : 'Add Expense Item'}
                </h6>

                <div>
                  <label className="block text-slate-500 font-semibold mb-1">{tStrings.itemName}</label>
                  <input
                    type="text"
                    required
                    value={newExpName}
                    onChange={e => setNewExpName(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold"
                    placeholder={isHi ? 'जैसे: उत्तरपुस्तिका सीलिंग मोमबत्ती' : 'e.g. Sealing Wax wax'}
                  />
                </div>

                <div>
                  <label className="block text-slate-500 font-semibold mb-1">{tStrings.amount}</label>
                  <input
                    type="number"
                    required
                    value={newExpAmount}
                    onChange={e => setNewExpAmount(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono font-bold"
                    placeholder="250"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black flex items-center justify-center space-x-1 transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{tStrings.addExpense}</span>
                </button>
              </form>

              {/* Roster & UC Certificate output */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex justify-between items-center text-slate-900 dark:text-slate-100 font-black">
                  <h6>{isHi ? 'परीक्षा व्यय रजिस्टर बही' : 'Exam Expenses Register'}</h6>
                  <span className="text-emerald-700 dark:text-emerald-400 font-mono text-sm">
                    {tStrings.totalExp}: ₹ {totalExpenseSum}
                  </span>
                </div>

                <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                  <table className="w-full text-left">
                    <thead className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-extrabold border-b border-slate-200 dark:border-slate-700">
                      <tr>
                        <th className="p-2.5 text-center w-12">{isHi ? 'क्र.' : 'S.N.'}</th>
                        <th className="p-2.5">{tStrings.itemName}</th>
                        <th className="p-2.5 text-right">{isHi ? 'राशि' : 'Amount'}</th>
                        <th className="p-2.5 text-center w-16">{isHi ? 'हटाएं' : 'Delete'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                      {expenses.map((exp, idx) => (
                        <tr key={exp.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                          <td className="p-2.5 text-center text-slate-400 font-mono font-bold">{idx + 1}</td>
                          <td className="p-2.5 text-slate-800 dark:text-slate-200 font-bold">{exp.name}</td>
                          <td className="p-2.5 text-right font-mono font-black text-amber-700 dark:text-amber-400">₹ {exp.amount}</td>
                          <td className="p-2.5 text-center">
                            <button
                              onClick={() => handleRemoveExpense(exp.id)}
                              className="text-rose-600 dark:text-rose-400 hover:text-rose-800 transition-colors p-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Utilisation Certificate Print Roster View */}
                <div className="p-4 rounded-xl border border-amber-300 bg-amber-50/50 dark:bg-amber-950/20 space-y-3">
                  <div className="flex items-center space-x-2 text-amber-800 dark:text-amber-200">
                    <Shield className="w-4 h-4" />
                    <span className="font-extrabold uppercase">{tStrings.ucTitle}</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-slate-700 dark:text-slate-300 font-medium">
                    {tStrings.ucVerifyText}
                  </p>
                  <div className="flex justify-between items-center text-[10px] font-mono font-black pt-2 border-t border-amber-200">
                    <span>{tStrings.dispatchNo}: UC/EX/{schoolProfile.nicCode}/2026/04</span>
                    <span>{tStrings.date}: {new Date().toISOString().split('T')[0]}</span>
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* TAB 3D: EXAM STOCK ENTRY LEDGER */}
        {activeTab === 'stock' && (
          <div className="space-y-4">
            
            {/* Header Description */}
            <div className="p-3 bg-emerald-50/60 dark:bg-emerald-950/20 rounded-xl border border-emerald-200 dark:border-emerald-800/40 text-xs text-emerald-800 dark:text-emerald-200">
              <h4 className="font-extrabold flex items-center gap-1.5 text-[13px] mb-1">
                <Package className="w-4 h-4 text-emerald-600" />
                <span>{tStrings.stockTitle}</span>
              </h4>
              <p>{tStrings.stockDesc}</p>
            </div>

            {/* Inventory table */}
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold">
              <table className="w-full text-left">
                <thead className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-extrabold border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="p-3 w-12 text-center">{isHi ? 'क्र.' : 'S.N.'}</th>
                    <th className="p-3">{tStrings.materialName}</th>
                    <th className="p-3 text-center">{tStrings.openingStock}</th>
                    <th className="p-3 text-center">{tStrings.receivedStock}</th>
                    <th className="p-3 text-center">{tStrings.consumedStock}</th>
                    <th className="p-3 text-center">{tStrings.balanceStock}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  {stockRecords.map((item, idx) => {
                    const balance = item.opening + item.received - item.consumed;
                    return (
                      <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="p-3 text-center text-slate-400 font-bold font-mono">{idx + 1}</td>
                        <td className="p-3 font-extrabold text-slate-900 dark:text-slate-100">
                          {tStrings[item.nameKey]}
                        </td>
                        <td className="p-3 text-center">
                          <input
                            type="number"
                            value={item.opening}
                            onChange={e => handleUpdateStock(item.id, 'opening', Number(e.target.value))}
                            className="w-20 px-1.5 py-1 text-center font-bold border border-slate-300 dark:border-slate-700 rounded-lg font-mono bg-white dark:bg-slate-900"
                          />
                        </td>
                        <td className="p-3 text-center">
                          <input
                            type="number"
                            value={item.received}
                            onChange={e => handleUpdateStock(item.id, 'received', Number(e.target.value))}
                            className="w-20 px-1.5 py-1 text-center font-bold border border-slate-300 dark:border-slate-700 rounded-lg font-mono bg-white dark:bg-slate-900"
                          />
                        </td>
                        <td className="p-3 text-center">
                          <input
                            type="number"
                            value={item.consumed}
                            onChange={e => handleUpdateStock(item.id, 'consumed', Number(e.target.value))}
                            className="w-20 px-1.5 py-1 text-center font-bold border border-slate-300 dark:border-slate-700 rounded-lg font-mono bg-white dark:bg-slate-900"
                          />
                        </td>
                        <td className="p-3 text-center font-black font-mono text-emerald-700 dark:text-emerald-400">
                          {balance}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* TAB 3E: BOARD EXAMS CATEGORY */}
        {activeTab === 'board' && (
          <div className="space-y-4">
            
            {/* Sub Tabs Selection */}
            <div className="flex items-center space-x-1 border-b border-slate-200 dark:border-slate-700 pb-2 text-xs font-black">
              {[
                { id: 'attendance', label: tStrings.boardCenterAttendance },
                { id: 'admit', label: tStrings.boardAdmitCardRegister },
                { id: 'dispatch', label: tStrings.boardDispatchRecord }
              ].map(sub => (
                <button
                  key={sub.id}
                  onClick={() => setBoardSubTab(sub.id as any)}
                  className={`px-3.5 py-1.5 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                    boardSubTab === sub.id
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {sub.label}
                </button>
              ))}
            </div>

            {/* Sub-tab content 1: Board Center Attendance */}
            {boardSubTab === 'attendance' && (
              <div className="space-y-3">
                <div className="p-3 bg-emerald-50/60 dark:bg-emerald-950/20 rounded-xl border border-emerald-200 dark:border-emerald-800/40 text-xs font-semibold text-emerald-800 dark:text-emerald-200">
                  {isHi
                    ? 'बोर्ड मुख्य परीक्षा हेतु परीक्षा कक्ष-वार बोर्ड प्रारूप अनुसार उपस्थिति पत्रक संधारण'
                    : 'Examination center student class-wise official board formats compliance attendance roster'}
                </div>

                <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-extrabold border-b border-slate-200 dark:border-slate-700">
                      <tr>
                        <th className="p-2.5 w-12 text-center">{isHi ? 'क्र.' : 'S.N.'}</th>
                        <th className="p-2.5">{tStrings.rollNo}</th>
                        <th className="p-2.5">{tStrings.studentName}</th>
                        <th className="p-2.5 text-center">{isHi ? 'स्थिति' : 'Attendance Status'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                      {boardAttendance.map((row, idx) => (
                        <tr key={row.rollNo} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                          <td className="p-2.5 text-center text-slate-400 font-mono font-bold">{idx + 1}</td>
                          <td className="p-2.5 font-mono font-black text-indigo-700 dark:text-indigo-400">{row.rollNo}</td>
                          <td className="p-2.5 font-extrabold text-slate-900 dark:text-slate-100">{row.studentName}</td>
                          <td className="p-2.5 text-center">
                            <select
                              value={row.isPresent}
                              onChange={e => {
                                const val = e.target.value as any;
                                setBoardAttendance(prev => prev.map(r => r.rollNo === row.rollNo ? { ...r, isPresent: val } : r));
                              }}
                              className={`px-2 py-1 rounded font-bold text-[11px] ${
                                row.isPresent === 'Present' ? 'bg-emerald-100 text-emerald-800' :
                                row.isPresent === 'Absent' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              <option value="Present">{isHi ? 'उपस्थित' : 'Present'}</option>
                              <option value="Absent">{isHi ? 'अनुपस्थित' : 'Absent'}</option>
                              <option value="UM">{isHi ? 'यू.एम.' : 'UM'}</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Sub-tab content 2: Board Admit Card Distribution */}
            {boardSubTab === 'admit' && (
              <div className="space-y-3">
                <div className="p-3 bg-emerald-50/60 dark:bg-emerald-950/20 rounded-xl border border-emerald-200 dark:border-emerald-800/40 text-xs font-semibold text-emerald-800 dark:text-emerald-200">
                  {isHi
                    ? 'शाला दर्पण पोर्टल से डाउनलोड किये प्रवेश पत्रों का सत्यापन एवं अभिभावक हस्ताक्षर रिकॉर्ड'
                    : 'Download verification ledger matching Shala Darpan admit card receipt validation logs'}
                </div>

                <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-extrabold border-b border-slate-200 dark:border-slate-700">
                      <tr>
                        <th className="p-2.5 w-12 text-center">{isHi ? 'क्र.' : 'S.N.'}</th>
                        <th className="p-2.5">{tStrings.rollNo}</th>
                        <th className="p-2.5">{tStrings.studentName}</th>
                        <th className="p-2.5">{isHi ? 'वितरण तिथि' : 'Date of Receipt'}</th>
                        <th className="p-2.5 text-center">{tStrings.admitCardStatus}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                      {admitCards.map((row, idx) => (
                        <tr key={row.rollNo} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                          <td className="p-2.5 text-center text-slate-400 font-mono font-bold">{idx + 1}</td>
                          <td className="p-2.5 font-mono font-black text-indigo-700 dark:text-indigo-400">{row.rollNo}</td>
                          <td className="p-2.5 font-extrabold text-slate-900 dark:text-slate-100">{row.studentName}</td>
                          <td className="p-2.5 font-mono">{row.issuedOn}</td>
                          <td className="p-2.5 text-center">
                            <button
                              onClick={() => {
                                setAdmitCards(prev => prev.map(r => r.rollNo === row.rollNo ? { ...r, isVerified: !r.isVerified } : r));
                                showToast(isHi ? 'प्रवेश पत्र वितरण स्थिति अद्यतन की गई!' : 'Admit card verification updated!');
                              }}
                              className={`px-3 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-all ${
                                row.isVerified
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              {row.isVerified ? (isHi ? 'सत्यापित' : 'Verified') : (isHi ? 'लंबित' : 'Pending')}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Sub-tab content 3: Board Dispatch Record */}
            {boardSubTab === 'dispatch' && (
              <div className="space-y-3">
                <div className="p-3 bg-emerald-50/60 dark:bg-emerald-950/20 rounded-xl border border-emerald-200 dark:border-emerald-800/40 text-xs font-semibold text-emerald-800 dark:text-emerald-200">
                  {isHi
                    ? 'परीक्षा समाप्ति उपरांत उत्तरपुस्तिका सील्ड बंडल नोडल संग्रहण केंद्र प्रेषण व स्पीड पोस्ट संख्या प्रविष्टि'
                    : 'Sealed board answer-book dispatch register logs mapped to nodel collection speed-posts'}
                </div>

                <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-extrabold border-b border-slate-200 dark:border-slate-700">
                      <tr>
                        <th className="p-2.5 w-12 text-center">{isHi ? 'क्र.' : 'S.N.'}</th>
                        <th className="p-2.5">{isHi ? 'दिनांक' : 'Date'}</th>
                        <th className="p-2.5">{isHi ? 'विषय' : 'Subject'}</th>
                        <th className="p-2.5 text-center">{tStrings.weightKg}</th>
                        <th className="p-2.5">{tStrings.dispatchSerial}</th>
                        <th className="p-2.5">{tStrings.speedPostNo}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                      {dispatches.map((row, idx) => (
                        <tr key={row.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                          <td className="p-2.5 text-center text-slate-400 font-mono font-bold">{idx + 1}</td>
                          <td className="p-2.5 font-mono">{row.date}</td>
                          <td className="p-2.5 font-extrabold text-slate-900 dark:text-slate-100">{row.subject}</td>
                          <td className="p-2.5 text-center font-mono font-bold text-emerald-800 dark:text-emerald-300">{row.weightKg} KG</td>
                          <td className="p-2.5 font-mono">{row.dispatchNo}</td>
                          <td className="p-2.5 font-mono text-indigo-700 dark:text-indigo-400 font-bold">{row.speedPostNo}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>
        )}

        {/* TAB 3F: LOCAL EXAMS CATEGORY */}
        {activeTab === 'local' && (
          <div className="space-y-4">
            
            {/* Sub Tabs Selection */}
            <div className="flex items-center space-x-1 border-b border-slate-200 dark:border-slate-700 pb-2 text-xs font-black">
              {[
                { id: 'result', label: tStrings.localResultRegister },
                { id: 'paper', label: tStrings.localPaperLog }
              ].map(sub => (
                <button
                  key={sub.id}
                  onClick={() => setLocalSubTab(sub.id as any)}
                  className={`px-3.5 py-1.5 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                    localSubTab === sub.id
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {sub.label}
                </button>
              ))}
            </div>

            {/* Sub-tab content 1: Local Result Marksheet Distribution */}
            {localSubTab === 'result' && (
              <div className="space-y-3">
                <div className="p-3 bg-emerald-50/60 dark:bg-emerald-950/20 rounded-xl border border-emerald-200 dark:border-emerald-800/40 text-xs font-semibold text-emerald-800 dark:text-emerald-200">
                  {isHi
                    ? 'स्थानीय गृह परीक्षा (कक्षा 1 से 4, 6, 7, 9, 11) अंकतालिका वितरण एवं अभिभावक हस्ताक्षर रिकॉर्ड बही'
                    : 'Class-wise local examination report cards (marksheet) issuance, verified by parent signature validation ledger'}
                </div>

                <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-extrabold border-b border-slate-200 dark:border-slate-700">
                      <tr>
                        <th className="p-2.5 w-12 text-center">{isHi ? 'क्र.' : 'S.N.'}</th>
                        <th className="p-2.5">{tStrings.studentName}</th>
                        <th className="p-2.5">{tStrings.class}</th>
                        <th className="p-2.5 text-center">{isHi ? 'अंकतालिका वितरण' : 'Marksheet Status'}</th>
                        <th className="p-2.5 text-center">{tStrings.parentSign}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                      {localResults.map((row, idx) => (
                        <tr key={row.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                          <td className="p-2.5 text-center text-slate-400 font-mono font-bold">{idx + 1}</td>
                          <td className="p-2.5 font-extrabold text-slate-900 dark:text-slate-100">{row.studentName}</td>
                          <td className="p-2.5 font-bold text-slate-600 dark:text-slate-400">{row.className}</td>
                          <td className="p-2.5 text-center">
                            <button
                              onClick={() => {
                                setLocalResults(prev => prev.map(r => r.id === row.id ? { ...r, marksheetIssued: !r.marksheetIssued } : r));
                                showToast(isHi ? 'अंकतालिका वितरण स्थिति अद्यतन की गई!' : 'Marksheet status updated!');
                              }}
                              className={`px-3 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-all ${
                                row.marksheetIssued
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              {row.marksheetIssued ? (isHi ? 'वितरित' : 'Issued') : (isHi ? 'शेष' : 'Pending')}
                            </button>
                          </td>
                          <td className="p-2.5 text-center">
                            <button
                              onClick={() => {
                                setLocalResults(prev => prev.map(r => r.id === row.id ? { ...r, parentSigned: !r.parentSigned } : r));
                                showToast(isHi ? 'अभिभावक हस्ताक्षर प्राप्ति अद्यतन की गई!' : 'Parent signature receipt updated!');
                              }}
                              className={`px-3 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-all ${
                                row.parentSigned
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {row.parentSigned ? (isHi ? 'हस्ताक्षरित' : 'Signed') : (isHi ? 'लंबित' : 'Pending')}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Sub-tab content 2: Local Question Paper Log */}
            {localSubTab === 'paper' && (
              <div className="space-y-3">
                <div className="p-3 bg-emerald-50/60 dark:bg-emerald-950/20 rounded-xl border border-emerald-200 dark:border-emerald-800/40 text-xs font-semibold text-emerald-800 dark:text-emerald-200">
                  {isHi
                    ? 'अति गोपनीय प्रश्न-पत्र सीलबंद लिफाफा गवाह शिक्षकों की उपस्थिति में समय पर खोलने व वितरण लॉग'
                    : 'Confidential question paper envelope opening log, signed by witness teachers for security audits'}
                </div>

                <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-extrabold border-b border-slate-200 dark:border-slate-700">
                      <tr>
                        <th className="p-2.5 w-12 text-center">{isHi ? 'क्र.' : 'S.N.'}</th>
                        <th className="p-2.5">{isHi ? 'दिनांक' : 'Date'}</th>
                        <th className="p-2.5">{isHi ? 'विषय' : 'Subject'}</th>
                        <th className="p-2.5">{tStrings.paperCode}</th>
                        <th className="p-2.5">{tStrings.openTime}</th>
                        <th className="p-2.5">{tStrings.witness1}</th>
                        <th className="p-2.5">{tStrings.witness2}</th>
                        <th className="p-2.5">{tStrings.handoverTime}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                      {localEnvelopes.map((row, idx) => (
                        <tr key={row.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                          <td className="p-2.5 text-center text-slate-400 font-mono font-bold">{idx + 1}</td>
                          <td className="p-2.5 font-mono">{row.date}</td>
                          <td className="p-2.5 font-extrabold text-slate-900 dark:text-slate-100">{row.subject}</td>
                          <td className="p-2.5 font-mono text-emerald-800 dark:text-emerald-300 font-bold">{row.code}</td>
                          <td className="p-2.5 font-mono font-bold text-amber-700 dark:text-amber-400">{row.openingTime}</td>
                          <td className="p-2.5 font-bold text-slate-700 dark:text-slate-300">{row.witness1}</td>
                          <td className="p-2.5 font-bold text-slate-700 dark:text-slate-300">{row.witness2}</td>
                          <td className="p-2.5 font-mono text-indigo-700 dark:text-indigo-400">{row.handoverTime}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>
        )}

        {/* TAB 3G: MSRA STATE SCHOLARSHIP CATEGORY */}
        {activeTab === 'msra' && (
          <div className="space-y-4">
            
            {/* Sub Tabs Selection */}
            <div className="flex items-center space-x-1 border-b border-slate-200 dark:border-slate-700 pb-2 text-xs font-black">
              {[
                { id: 'nomination', label: tStrings.nominationLog },
                { id: 'verification', label: tStrings.centerVerification }
              ].map(sub => (
                <button
                  key={sub.id}
                  onClick={() => setMsraSubTab(sub.id as any)}
                  className={`px-3.5 py-1.5 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                    msraSubTab === sub.id
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {sub.label}
                </button>
              ))}
            </div>

            {/* Sub-tab content 1: Scholarship nomination log */}
            {msraSubTab === 'nomination' && (
              <div className="space-y-3">
                <div className="p-3 bg-emerald-50/60 dark:bg-emerald-950/20 rounded-xl border border-emerald-200 dark:border-emerald-800/40 text-xs font-semibold text-emerald-800 dark:text-emerald-200">
                  {isHi
                    ? 'मुख्यमंत्री सर्वोदय / एनएमएमएस छात्रवृत्ति परीक्षा छात्र ऑनलाइन नामांकन पात्रता सत्यापन बही'
                    : 'Mukhyamantri Sarvodaya & NMMS Scholarship online nominations eligibility verification log'}
                </div>

                <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-extrabold border-b border-slate-200 dark:border-slate-700">
                      <tr>
                        <th className="p-2.5 w-12 text-center">{isHi ? 'क्र.' : 'S.N.'}</th>
                        <th className="p-2.5">{tStrings.candidateName}</th>
                        <th className="p-2.5">{tStrings.scholarshipType}</th>
                        <th className="p-2.5">{tStrings.rollNo}</th>
                        <th className="p-2.5 text-center">{tStrings.eligibilityStatus}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                      {msraNominations.map((row, idx) => (
                        <tr key={row.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                          <td className="p-2.5 text-center text-slate-400 font-mono font-bold">{idx + 1}</td>
                          <td className="p-2.5 font-extrabold text-slate-900 dark:text-slate-100">{row.studentName}</td>
                          <td className="p-2.5 font-bold text-slate-600 dark:text-slate-400">{row.examType}</td>
                          <td className="p-2.5 font-mono font-black text-indigo-700 dark:text-indigo-400">{row.rollNo}</td>
                          <td className="p-2.5 text-center">
                            <button
                              onClick={() => {
                                setMsraNominations(prev => prev.map(r => r.id === row.id ? { ...r, nominationVerified: !r.nominationVerified } : r));
                                showToast(isHi ? 'नामांकन सत्यापन स्थिति अद्यतन की गई!' : 'Nomination verification updated!');
                              }}
                              className={`px-3 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-all ${
                                row.nominationVerified
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              {row.nominationVerified ? (isHi ? 'पात्र / स्वीकृत' : 'Eligible') : (isHi ? 'लंबित' : 'Pending')}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Sub-tab content 2: Center Verification sheets */}
            {msraSubTab === 'verification' && (
              <div className="space-y-3">
                <div className="p-3 bg-emerald-50/60 dark:bg-emerald-950/20 rounded-xl border border-emerald-200 dark:border-emerald-800/40 text-xs font-semibold text-emerald-800 dark:text-emerald-200">
                  {isHi
                    ? 'परीक्षा केंद्र पर परीक्षार्थी के फोटो, हस्ताक्षर एवं सिटिंग डेस्क सीट भौतिक सत्यापन पत्रक'
                    : 'Examination center candidate photo & physical signature verification roster sheets'}
                </div>

                <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-extrabold border-b border-slate-200 dark:border-slate-700">
                      <tr>
                        <th className="p-2.5 w-12 text-center">{isHi ? 'क्र.' : 'S.N.'}</th>
                        <th className="p-2.5">{tStrings.candidateName}</th>
                        <th className="p-2.5">{tStrings.rollNo}</th>
                        <th className="p-2.5">{isHi ? 'आवंटित डेस्क' : 'Desk Location'}</th>
                        <th className="p-2.5 text-center">{isHi ? 'फोटो सत्यापन' : 'Photo Check'}</th>
                        <th className="p-2.5 text-center">{tStrings.verificationStatus}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                      {msraVerifications.map((row, idx) => (
                        <tr key={row.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                          <td className="p-2.5 text-center text-slate-400 font-mono font-bold">{idx + 1}</td>
                          <td className="p-2.5 font-extrabold text-slate-900 dark:text-slate-100">{row.studentName}</td>
                          <td className="p-2.5 font-mono font-black text-indigo-700 dark:text-indigo-400">{row.rollNo}</td>
                          <td className="p-2.5 font-bold text-slate-600 dark:text-slate-400">{row.deskNo}</td>
                          <td className="p-2.5 text-center">
                            <button
                              onClick={() => {
                                setMsraVerifications(prev => prev.map(r => r.id === row.id ? { ...r, photoVerified: !r.photoVerified } : r));
                                showToast(isHi ? 'फोटो सत्यापन अद्यतन किया गया!' : 'Photo verification status updated!');
                              }}
                              className={`px-3 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-all ${
                                row.photoVerified
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              {row.photoVerified ? (isHi ? 'सत्यापित' : 'Matched') : (isHi ? 'शेष' : 'Unchecked')}
                            </button>
                          </td>
                          <td className="p-2.5 text-center">
                            <button
                              onClick={() => {
                                setMsraVerifications(prev => prev.map(r => r.id === row.id ? { ...r, signatureVerified: !r.signatureVerified } : r));
                                showToast(isHi ? 'हस्ताक्षर सत्यापन अद्यतन किया गया!' : 'Signature verification status updated!');
                              }}
                              className={`px-3 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-all ${
                                row.signatureVerified
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              {row.signatureVerified ? (isHi ? 'सत्यापित' : 'Matched') : (isHi ? 'शेष' : 'Unchecked')}
                            </button>
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

      </div>
      )}

    </div>
  );
};
