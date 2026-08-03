import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ArrowLeft, 
  Package, 
  Trash2, 
  Calendar, 
  UserCheck, 
  CheckCircle2, 
  Plus, 
  Search, 
  Download, 
  ExternalLink, 
  FileText, 
  Phone, 
  Shield, 
  Info, 
  Users, 
  AlertTriangle, 
  Printer, 
  RefreshCw, 
  FileCode,
  Check,
  X,
  MapPin,
  Mail,
  Upload
} from 'lucide-react';
import { SchoolProfile } from '../../types';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Auto-Table type augmentation for jsPDF
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

interface LadoInchargeModuleProps {
  schoolProfile: SchoolProfile;
  lang: 'en' | 'hi';
  onBack: () => void;
}

interface StudentBeneficiary {
  id: string;
  name: string;
  fatherName: string;
  className: string;
  janAadhaar: string;
  phone: string;
  status: 'Patra' | 'Apatra';
  reason?: string;
}

export const LadoInchargeModule: React.FC<LadoInchargeModuleProps> = ({
  schoolProfile,
  lang,
  onBack
}) => {
  // Navigation inside Lado Module
  const [activeTab, setActiveTab] = useState<'jankari' | 'roster' | 'patra' | 'apatra' | 'coordinators' | 'inventory'>('jankari');

  // --- Search & Filters ---
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClassFilter, setSelectedClassFilter] = useState('All');

  // --- Scheme Info Fetch State (Module 1) ---
  const [fetchingGovtInfo, setFetchingGovtInfo] = useState(false);
  const [fetchedGovtData, setFetchedGovtData] = useState<any | null>(null);
  const [govtSyncTime, setGovtSyncTime] = useState<string | null>(null);

  // --- Students Roster State (Module 2) ---
  const [students, setStudents] = useState<StudentBeneficiary[]>([
    { id: '1', name: 'पूजा मीणा (Pooja Meena)', fatherName: 'रामप्रसाद मीणा', className: 'Class 9', janAadhaar: '9823-4512-8976', phone: '9414212345', status: 'Patra' },
    { id: '2', name: 'रवीना शर्मा (Raveena Sharma)', fatherName: 'कैलाश चन्द्र शर्मा', className: 'Class 10', janAadhaar: '4512-8976-9823', phone: '9829012345', status: 'Patra' },
    { id: '3', name: 'मनीषा हरिजन (Manisha Harijan)', fatherName: 'बाबूलाल हरिजन', className: 'Class 8', janAadhaar: '8976-9823-4512', phone: '9413112233', status: 'Patra' },
    { id: '4', name: 'प्रियंका जाट (Priyanka Jat)', fatherName: 'देवीलाल जाट', className: 'Class 11', janAadhaar: '3214-5678-9012', phone: '9887123456', status: 'Apatra', reason: 'Family annual income exceeds ₹2.5 Lakh limit (वार्षिक आय ₹2.5 लाख से अधिक)' },
    { id: '5', name: 'कोमल कंवर (Komal Kanwar)', fatherName: 'भंवर सिंह', className: 'Class 12', janAadhaar: 'Missing (अपूर्ण)', phone: '9660112244', status: 'Apatra', reason: 'Missing required Jan Aadhaar & BPL Certificate (जन आधार एवं बीपीएल प्रमाण-पत्र अनुपलब्ध)' },
    { id: '6', name: 'आरती बैरवा (Aarti Bairwa)', fatherName: 'रामगोपाल बैरवा', className: 'Class 9', janAadhaar: '6741-9012-3456', phone: '9928345678', status: 'Patra' }
  ]);

  // Form States for Adding Student
  const [formName, setFormName] = useState('');
  const [formFather, setFormFather] = useState('');
  const [formClass, setFormClass] = useState('Class 9');
  const [formJanAadhaar, setFormJanAadhaar] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formStatus, setFormStatus] = useState<'Patra' | 'Apatra'>('Patra');
  const [formReason, setFormReason] = useState('Missing required Jan Aadhaar & BPL Certificate (जन आधार एवं बीपीएल प्रमाण-पत्र अनुपलब्ध)');

  // Predefined Ineligible Reasons for Dropdown
  const ineligibleReasons = [
    'Missing required Jan Aadhaar & BPL Certificate (जन आधार एवं बीपीएल प्रमाण-पत्र अनुपलब्ध)',
    'Family annual income exceeds ₹2.5 Lakh limit (वार्षिक आय ₹2.5 लाख से अधिक)',
    'Already availed benefits from another state scheme (अन्य योजना का लाभ उठा चुकी हैं)',
    'Student not meeting the academic attendance threshold of 75% (नियमित उपस्थिति 75% से कम)',
    'Out of state resident status (राजस्थान की मूल निवासी नहीं हैं)',
    'Age or class limit criteria mismatch (आयु अथवा कक्षा संबंधी मापदंड अनुरूप नहीं है)'
  ];

  // --- Existing Napkin Stock & Self Defense States (Preserved & Integrated into Tab 6) ---
  const [ladoStock, setLadoStock] = useState(1150);
  const [ladoNapkinAdd, setLadoNapkinAdd] = useState('');
  const [ladoDistributionLogs, setLadoDistributionLogs] = useState([
    { id: 'ld-1', date: '2026-03-05', className: 'Class 6 Girls', quantity: 80, remarks: 'Monthly distribution' },
    { id: 'ld-2', date: '2026-03-05', className: 'Class 7 Girls', quantity: 95, remarks: 'Monthly distribution' },
    { id: 'ld-3', date: '2026-03-06', className: 'Class 8 Girls', quantity: 110, remarks: 'Monthly distribution with hygiene briefing' }
  ]);
  const [ladoDistClass, setLadoDistClass] = useState('Class 6 Girls');
  const [ladoDistQty, setLadoDistQty] = useState('50');
  const [ladoDistRemarks, setLadoDistRemarks] = useState('Monthly distribution');

  const [ladoEvents, setLadoEvents] = useState([
    { id: 'le-1', title: 'Girl Child Self-Defense Training (Rani Laxmibai)', date: '2026-01-18', participants: 92, instructor: 'Smt. Saroj Yadav' },
    { id: 'le-2', title: 'Personal Hygiene & Reproductive Health Camp', date: '2026-02-12', participants: 115, instructor: 'Dr. Anita Meena (CHC)' }
  ]);

  // --- District Coordinators Directory (Module 5) ---
  const [coordinatorSearch, setCoordinatorSearch] = useState('');
  const coordinatorsList = [
    { district: 'Ajmer (अजमेर)', name: 'Smt. Neeru Meena', designation: 'District Coordinator, WCD', phone: '9414012903', email: 'wcd.ajmer@rajasthan.gov.in' },
    { district: 'Alwar (अलवर)', name: 'Sh. Satish Verma', designation: 'Assistant Director, ICDS', phone: '9414341256', email: 'wcd.alwar@rajasthan.gov.in' },
    { district: 'Banswara (बांसवाड़ा)', name: 'Smt. Rekha Damor', designation: 'District Coordinator, WCD', phone: '9414890234', email: 'wcd.banswara@rajasthan.gov.in' },
    { district: 'Baran (बारां)', name: 'Sh. Manoj Nagar', designation: 'District Coordinator, WCD', phone: '9414210987', email: 'wcd.baran@rajasthan.gov.in' },
    { district: 'Barmer (बाड़मेर)', name: 'Sh. Kailash Trivedi', designation: 'Assistant Director, ICDS', phone: '9414765432', email: 'wcd.barmer@rajasthan.gov.in' },
    { district: 'Bharatpur (भरतपुर)', name: 'Smt. Poonam Saxena', designation: 'District Incharge', phone: '9414102938', email: 'wcd.bharatpur@rajasthan.gov.in' },
    { district: 'Bhilwara (भीलवाड़ा)', name: 'Smt. Rekha Gupta', designation: 'District Incharge', phone: '9414561234', email: 'wcd.bhilwara@rajasthan.gov.in' },
    { district: 'Bikaner (बीकानेर)', name: 'Sh. Ramesh Chandra', designation: 'District Coordinator, WCD', phone: '9414801928', email: 'wcd.bikaner@rajasthan.gov.in' },
    { district: 'Bundi (बूंदी)', name: 'Sh. Rajendra Sharma', designation: 'District Incharge', phone: '9414901234', email: 'wcd.bundi@rajasthan.gov.in' },
    { district: 'Chittorgarh (चित्तौड़गढ़)', name: 'Smt. Sunita Vyas', designation: 'District Coordinator, WCD', phone: '9414238495', email: 'wcd.chittor@rajasthan.gov.in' },
    { district: 'Churu (चूरू)', name: 'Smt. Vimla Poonia', designation: 'District Incharge', phone: '9414991122', email: 'wcd.churu@rajasthan.gov.in' },
    { district: 'Dausa (दौसा)', name: 'Sh. Suresh Choudhary', designation: 'Assistant Director', phone: '9414541290', email: 'wcd.dausa@rajasthan.gov.in' },
    { district: 'Dholpur (धौलपुर)', name: 'Sh. Ravindra Singh', designation: 'District Coordinator', phone: '9414610928', email: 'wcd.dholpur@rajasthan.gov.in' },
    { district: 'Dungarpur (डूंगरपुर)', name: 'Smt. Hemlata Meena', designation: 'District Coordinator, WCD', phone: '9414778822', email: 'wcd.dungarpur@rajasthan.gov.in' },
    { district: 'Hanumangarh (हनुमानगढ़)', name: 'Sh. Gurmeet Singh', designation: 'District Coordinator', phone: '9414343111', email: 'wcd.hanuman@rajasthan.gov.in' },
    { district: 'Jaipur (जयपुर)', name: 'Sh. Rajendra Kumar', designation: 'Deputy Director, WCD Jaipur', phone: '9414051672', email: 'wcd.jaipur@rajasthan.gov.in' },
    { district: 'Jaisalmer (जैसलमेर)', name: 'Sh. Pratap Singh', designation: 'District Incharge, WCD', phone: '9414901827', email: 'wcd.jaisalmer@rajasthan.gov.in' },
    { district: 'Jalore (जालौर)', name: 'Sh. Ganpat Lal', designation: 'District Coordinator', phone: '9414092834', email: 'wcd.jalore@rajasthan.gov.in' },
    { district: 'Jhalawar (झालावाड़)', name: 'Smt. Preeti Saxena', designation: 'District Incharge', phone: '9414654321', email: 'wcd.jhalawar@rajasthan.gov.in' },
    { district: 'Jhunjhunu (झुंझुनू)', name: 'Sh. Mahendra Saini', designation: 'District Coordinator', phone: '9414891100', email: 'wcd.jhunjhunu@rajasthan.gov.in' },
    { district: 'Jodhpur (जोधपुर)', name: 'Smt. Alka Solanki', designation: 'Deputy Director, WCD Jodhpur', phone: '9414211334', email: 'wcd.jodhpur@rajasthan.gov.in' },
    { district: 'Kota (कोटा)', name: 'Sh. Rakesh Meena', designation: 'District Coordinator', phone: '9414112288', email: 'wcd.kota@rajasthan.gov.in' },
    { district: 'Nagaur (नागौर)', name: 'Smt. Pushpa Gehlot', designation: 'Assistant Director', phone: '9414041235', email: 'wcd.nagaur@rajasthan.gov.in' },
    { district: 'Pali (पाली)', name: 'Sh. Shyam Lal', designation: 'District Coordinator', phone: '9414541235', email: 'wcd.pali@rajasthan.gov.in' },
    { district: 'Pratapgarh (प्रतापगढ़)', name: 'Smt. Seema Rawat', designation: 'District Incharge', phone: '9414902813', email: 'wcd.pratap@rajasthan.gov.in' },
    { district: 'Rajsamand (राजसमंद)', name: 'Sh. Dinesh Vyas', designation: 'District Coordinator', phone: '9414332244', email: 'wcd.rajsamand@rajasthan.gov.in' },
    { district: 'Sawai Madhopur (सवाई माधोपुर)', name: 'Sh. Girish Sharma', designation: 'District Coordinator', phone: '9414012356', email: 'wcd.sawaimadhopur@rajasthan.gov.in' },
    { district: 'Sikar (सीकर)', name: 'Sh. Anand Choudhary', designation: 'Deputy Director, ICDS Sikar', phone: '9414701234', email: 'wcd.sikar@rajasthan.gov.in' },
    { district: 'Sirohi (सिरोही)', name: 'Smt. Sona Deval', designation: 'District Incharge', phone: '9414903344', email: 'wcd.sirohi@rajasthan.gov.in' },
    { district: 'Sri Ganganagar (श्रीगंगानगर)', name: 'Sh. Satnam Singh', designation: 'District Coordinator', phone: '9414231122', email: 'wcd.ganganagar@rajasthan.gov.in' },
    { district: 'Tonk (टोंक)', name: 'Smt. Asha Meena', designation: 'District Coordinator', phone: '9414151289', email: 'wcd.tonk@rajasthan.gov.in' },
    { district: 'Udaipur (उदयपुर)', name: 'Sh. Lal Chand Lalawat', designation: 'Deputy Director, WCD Udaipur', phone: '9414011223', email: 'wcd.udaipur@rajasthan.gov.in' }
  ];

  // --- Mock Official Yojana Info ---
  const initialYojanaDetails = {
    schemeName: "Lado Protsahan Yojana 2026 (लाडो प्रोत्साहन योजना)",
    department: "Department of Women and Child Development (WCD), Government of Rajasthan (महिला एवं बाल विकास विभाग, राजस्थान सरकार)",
    budgetAllocation: "₹2,000 Crores State Fund Pool",
    objectiveEn: "To provide financial incentives and savings certificates up to ₹2 Lakh for girl children born in poor and backward families to improve health, gender ratio, and educational continuity.",
    objectiveHi: "गरीब और पिछड़े परिवारों में जन्म लेने वाली बालिकाओं के स्वास्थ्य, लिंगानुपात और निरंतर शिक्षा को सुनिश्चित करने हेतु ₹2,00,000 (दो लाख रुपये) तक के बचत प्रमाण पत्र और वित्तीय प्रोत्साहन प्रदान करना।",
    milestones: [
      { trigger: "On birth of Girl Child (बालिका के जन्म पर)", amount: "₹2,000 Cash Support" },
      { trigger: "On Class 6 admission (कक्षा 6 में प्रवेश पर)", amount: "₹6,000 Savings Certificate" },
      { trigger: "On Class 9 admission (कक्षा 9 में प्रवेश पर)", amount: "₹8,000 Savings Certificate" },
      { trigger: "On Class 10 admission (कक्षा 10 में प्रवेश पर)", amount: "₹10,000 Savings Certificate" },
      { trigger: "On Class 11 admission (कक्षा 11 में प्रवेश पर)", amount: "₹12,000 Savings Certificate" },
      { trigger: "On Class 12 admission (कक्षा 12 में प्रवेश पर)", amount: "₹14,000 Savings Certificate" },
      { trigger: "On completing 18 years of age (18 वर्ष पूर्ण होने पर)", amount: "₹50,000 Fixed Bond Maturity" },
      { trigger: "On completing 21 years of age (21 वर्ष पूर्ण होने पर - उच्च शिक्षा/विवाह हेतु)", amount: "₹1,00,000 final cash certificate" }
    ],
    eligibilityCriteria: [
      "Must be a bonafide resident of Rajasthan (राजस्थान की मूल निवासी होना अनिवार्य)।",
      "Belonging to BPL, Scheduled Castes (SC), Scheduled Tribes (ST), or Economically Weaker Section (EWS) categories (बीपीएल, एससी, एसटी या ईडब्ल्यूएस श्रेणी से संबंधित होना चाहिए)।",
      "Daughters enrolled in Government or Government-recognized schools (राजकीय या मान्यता प्राप्त विद्यालयों में अध्ययनरत)।",
      "Active Jan Aadhaar Card verification required for DBT disbursement (जन आधार लिंक होना अनिवार्य)।"
    ],
    documentsRequired: [
      "Jan Aadhaar Card / Aadhaar Card of Student & Parents (जन आधार / आधार कार्ड)",
      "BPL Card / Income Certificate (< ₹2.5 Lakh per annum) (बीपीएल कार्ड / आय प्रमाण पत्र)",
      "Birth Certificate of Girl Child (बालिका का जन्म प्रमाण पत्र)",
      "School Enrollment Certificate (Bonafide/TC) (विद्यालय प्रवेश प्रमाण पत्र)",
      "Caste Certificate (if SC/ST) (जाति प्रमाण पत्र)"
    ]
  };

  // --- Dynamic Fetch Simulation (Module 1) ---
  const handleFetchOfficialPortal = () => {
    setFetchingGovtInfo(true);
    // Simulates an official fetch request with dynamic loading
    setTimeout(() => {
      setFetchingGovtInfo(false);
      setFetchedGovtData({
        ...initialYojanaDetails,
        schemeName: "Lado Protsahan Yojana & Balika Sambal Directives 2026-27",
        lastUpdated: "Circular Dated: June 15, 2026",
        verifiedToken: "WCD-DBT-RAJ-2026-889341",
        apiResponseCode: "200 OK (Connection Secure)"
      });
      setGovtSyncTime(new Date().toLocaleTimeString() + ' (02 Aug 2026)');
    }, 1500);
  };

  // --- Student Registration (Module 2) ---
  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formFather.trim()) return;

    const newStudent: StudentBeneficiary = {
      id: `std-${Date.now()}`,
      name: formName.trim(),
      fatherName: formFather.trim(),
      className: formClass,
      janAadhaar: formJanAadhaar.trim() || 'Missing (अपूर्ण)',
      phone: formPhone.trim() || '94140XXXXX',
      status: formStatus,
      reason: formStatus === 'Apatra' ? formReason : undefined
    };

    setStudents(prev => [newStudent, ...prev]);
    // Reset Form
    setFormName('');
    setFormFather('');
    setFormJanAadhaar('');
    setFormPhone('');
    setFormStatus('Patra');
  };

  // --- CSV Import Simulation (Module 2) ---
  const handleCSVImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (!text) return;

      const lines = text.split('\n');
      const importedStudents: StudentBeneficiary[] = [];

      // Simple CSV Parse
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        const columns = line.split(',');
        if (columns.length >= 3) {
          const name = columns[0]?.trim() || 'Imported Girl';
          const father = columns[1]?.trim() || 'Parent';
          const cls = columns[2]?.trim() || 'Class 9';
          const ja = columns[3]?.trim() || 'Missing (अपूर्ण)';
          const phone = columns[4]?.trim() || '9414011223';
          const stat = (columns[5]?.trim() === 'Apatra' ? 'Apatra' : 'Patra') as 'Patra' | 'Apatra';
          const reas = stat === 'Apatra' ? (columns[6]?.trim() || 'Document Mismatch') : undefined;

          importedStudents.push({
            id: `imp-${Date.now()}-${i}`,
            name,
            fatherName: father,
            className: cls,
            janAadhaar: ja,
            phone,
            status: stat,
            reason: reas
          });
        }
      }

      if (importedStudents.length > 0) {
        setStudents(prev => [...importedStudents, ...prev]);
        alert(`Successfully imported ${importedStudents.length} students from CSV.`);
      } else {
        alert('Invalid CSV format. Please make sure to follow the columns structure.');
      }
    };
    reader.readAsText(file);
  };

  // Quick Mock Import Roster
  const handleQuickImportMockRoster = () => {
    const mockRoster: StudentBeneficiary[] = [
      { id: 'm-1', name: 'किरण बैरवा (Kiran Bairwa)', fatherName: 'नन्दराम बैरवा', className: 'Class 9', janAadhaar: '2104-5896-1245', phone: '9414451290', status: 'Patra' },
      { id: 'm-2', name: 'संजू कुमारी (Sanju Kumari)', fatherName: 'मदन लाल', className: 'Class 8', janAadhaar: '9845-1263-4578', phone: '9828341256', status: 'Patra' },
      { id: 'm-3', name: 'दीक्षा शेखावत (Deeksha Shekhawat)', fatherName: 'जयपाल सिंह', className: 'Class 11', janAadhaar: '5678-1234-9012', phone: '9660234512', status: 'Apatra', reason: 'Family annual income exceeds ₹2.5 Lakh limit (वार्षिक आय ₹2.5 लाख से अधिक)' },
      { id: 'm-4', name: 'रेखा गुर्जर (Rekha Gurjar)', fatherName: 'रामनिवास गुर्जर', className: 'Class 10', janAadhaar: '7412-8520-9630', phone: '9413890123', status: 'Patra' }
    ];
    setStudents(prev => {
      // Avoid duplicate quick import
      const filtered = mockRoster.filter(mr => !prev.some(p => p.name === mr.name));
      if (filtered.length === 0) {
        alert('Mock roster students already exist in the list.');
        return prev;
      }
      return [...filtered, ...prev];
    });
  };

  // Delete Student
  const handleDeleteStudent = (id: string) => {
    setStudents(prev => prev.filter(s => s.id !== id));
  };

  // --- PDF Report Generator (Module 3) ---
  const handleDownloadPDFReport = () => {
    const doc = new jsPDF();
    const patraGirls = students.filter(s => s.status === 'Patra');

    // Add Government Logo or Header Banner
    doc.setFillColor(235, 245, 235); // Light green background
    doc.rect(10, 10, 190, 20, 'F');
    
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(19, 136, 8); // Emerald / Forest Green
    doc.text('GOVERNMENT OF RAJASTHAN - WOMEN & CHILD WELFARE', 15, 22);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Official School Lado Scheme Patra Beneficiaries Roster`, 15, 27);

    // School Info Box
    doc.setFillColor(250, 250, 250);
    doc.rect(10, 33, 190, 26, 'F');
    doc.setDrawColor(220, 220, 220);
    doc.rect(10, 33, 190, 26, 'D');

    doc.setFontSize(11);
    doc.setTextColor(30, 41, 59);
    doc.setFont('Helvetica', 'bold');
    doc.text(`School Name: ${schoolProfile.schoolNameHindi || schoolProfile.schoolName}`, 13, 39);
    doc.setFont('Helvetica', 'normal');
    doc.text(`UDISE Code: ${schoolProfile.udiseCode} | Block: ${schoolProfile.block} | District: ${schoolProfile.district}`, 13, 45);
    doc.text(`Report Date: ${new Date().toLocaleDateString()} | Verified Principal: ${schoolProfile.principalName}`, 13, 51);
    doc.text(`Scheme Target: Lado Protsahan Yojana / Balika Sambal Support`, 13, 56);

    // Build Table Data
    const tableBody = patraGirls.map((s, index) => [
      index + 1,
      s.name,
      s.fatherName,
      s.className,
      s.janAadhaar,
      s.phone,
      'PATRA (ELIGIBLE)'
    ]);

    doc.autoTable({
      startY: 64,
      head: [['S.No.', 'Student Name', 'Father\'s Name', 'Class', 'Jan Aadhaar No', 'Contact No', 'Status']],
      body: tableBody,
      headStyles: { fillColor: [19, 136, 8], textColor: [255, 255, 255], fontStyle: 'bold' },
      bodyStyles: { textColor: [51, 65, 85] },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      margin: { top: 60 },
      styles: { fontSize: 9 }
    });

    // Signatures at the bottom
    const finalY = (doc as any).lastAutoTable.finalY + 25;
    doc.setFontSize(10);
    doc.setFont('Helvetica', 'bold');
    doc.text('Lado Incharge Signature', 15, finalY);
    doc.text('Smt. Saroj Yadav (PGT)', 15, finalY + 5);

    doc.text('School Principal Signature', 140, finalY);
    doc.text(`${schoolProfile.principalName} (${schoolProfile.principalDesignation || 'Principal'})`, 140, finalY + 5);
    doc.text('Official Seal / Block Seal', 140, finalY + 10);

    // Download PDF
    doc.save(`Lado_Patra_Report_${schoolProfile.udiseCode || 'export'}.pdf`);
  };

  // --- XML File Generator ("generate xml file" - Module 3/4) ---
  const handleDownloadXMLRoster = () => {
    let xmlContent = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xmlContent += `<ShalaDarpanLadoExport xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">\n`;
    xmlContent += `  <SchoolMetadata>\n`;
    xmlContent += `    <SchoolName>${schoolProfile.schoolName.replace(/&/g, '&amp;')}</SchoolName>\n`;
    xmlContent += `    <SchoolNameHindi>${schoolProfile.schoolNameHindi.replace(/&/g, '&amp;')}</SchoolNameHindi>\n`;
    xmlContent += `    <UDISECode>${schoolProfile.udiseCode}</UDISECode>\n`;
    xmlContent += `    <NICCode>${schoolProfile.nicCode}</NICCode>\n`;
    xmlContent += `    <Block>${schoolProfile.block}</Block>\n`;
    xmlContent += `    <District>${schoolProfile.district}</District>\n`;
    xmlContent += `    <GeneratedTimestamp>${new Date().toISOString()}</GeneratedTimestamp>\n`;
    xmlContent += `  </SchoolMetadata>\n`;
    xmlContent += `  <Roster>\n`;

    students.forEach(s => {
      xmlContent += `    <Student id="${s.id}">\n`;
      xmlContent += `      <Name>${s.name.replace(/&/g, '&amp;')}</Name>\n`;
      xmlContent += `      <FatherName>${s.fatherName.replace(/&/g, '&amp;')}</FatherName>\n`;
      xmlContent += `      <Class>${s.className}</Class>\n`;
      xmlContent += `      <JanAadhaar>${s.janAadhaar}</JanAadhaar>\n`;
      xmlContent += `      <Phone>${s.phone}</Phone>\n`;
      xmlContent += `      <Status>${s.status}</Status>\n`;
      if (s.status === 'Apatra') {
        xmlContent += `      <IneligibleReason>${(s.reason || '').replace(/&/g, '&amp;')}</IneligibleReason>\n`;
      }
      xmlContent += `    </Student>\n`;
    });

    xmlContent += `  </Roster>\n`;
    xmlContent += `</ShalaDarpanLadoExport>\n`;

    const blob = new Blob([xmlContent], { type: 'application/xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `ShalaDarpan_Lado_Roster_${schoolProfile.udiseCode || 'export'}.xml`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter & Search Logic for Students List
  const filteredStudents = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          s.fatherName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          s.janAadhaar.includes(searchTerm);
    const matchesClass = selectedClassFilter === 'All' || s.className === selectedClassFilter;
    return matchesSearch && matchesClass;
  });

  return (
    <div className="bg-slate-50 dark:bg-slate-950 p-4 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
      
      {/* 1. Header with App Title & Back Control */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/40">
            <Shield className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <span>{lang === 'hi' ? 'लाडो / बालिका संबल योजना प्रभारी प्रभाग' : 'Lado & Girl Child Welfare Portal'}</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-[10px] text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 uppercase font-sans tracking-wide">
                Official
              </span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              {schoolProfile.schoolNameHindi || schoolProfile.schoolName} | {schoolProfile.block}, {schoolProfile.district}
            </p>
          </div>
        </div>

        <button
          onClick={onBack}
          id="btn-lado-back"
          className="flex items-center justify-center gap-1 px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 border border-slate-200 dark:border-slate-800 hover:border-emerald-200 dark:hover:border-emerald-800 rounded-xl transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{lang === 'hi' ? 'वापस जाएं' : 'Go Back'}</span>
        </button>
      </div>

      {/* 2. Primary Submodule Navigation Tabs */}
      <div className="flex flex-wrap gap-1.5 p-1 bg-slate-100 dark:bg-slate-900/60 rounded-2xl border border-slate-200/50 dark:border-slate-800/60">
        <button
          onClick={() => setActiveTab('jankari')}
          className={`flex-1 min-w-[120px] px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'jankari'
              ? 'bg-white dark:bg-slate-950 text-emerald-800 dark:text-emerald-400 shadow-sm border border-slate-200/50 dark:border-slate-800/80'
              : 'text-slate-600 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-800/50'
          }`}
        >
          <Info className="w-3.5 h-3.5" />
          <span>{lang === 'hi' ? 'योजना जानकारी' : 'Yojana Info'}</span>
        </button>
        <button
          onClick={() => setActiveTab('roster')}
          className={`flex-1 min-w-[120px] px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'roster'
              ? 'bg-white dark:bg-slate-950 text-emerald-800 dark:text-emerald-400 shadow-sm border border-slate-200/50 dark:border-slate-800/80'
              : 'text-slate-600 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-800/50'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>{lang === 'hi' ? 'बालिका सूची' : 'Eligible Girls'}</span>
        </button>
        <button
          onClick={() => setActiveTab('patra')}
          className={`flex-1 min-w-[120px] px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'patra'
              ? 'bg-white dark:bg-slate-950 text-emerald-800 dark:text-emerald-400 shadow-sm border border-slate-200/50 dark:border-slate-800/80'
              : 'text-slate-600 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-800/50'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>{lang === 'hi' ? 'पात्र बालिकाएँ' : 'Eligible (Patra)'}</span>
        </button>
        <button
          onClick={() => setActiveTab('apatra')}
          className={`flex-1 min-w-[120px] px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'apatra'
              ? 'bg-white dark:bg-slate-950 text-emerald-800 dark:text-emerald-400 shadow-sm border border-slate-200/50 dark:border-slate-800/80'
              : 'text-slate-600 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-800/50'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>{lang === 'hi' ? 'अपात्र बालिकाएँ' : 'Ineligible'}</span>
        </button>
        <button
          onClick={() => setActiveTab('coordinators')}
          className={`flex-1 min-w-[120px] px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'coordinators'
              ? 'bg-white dark:bg-slate-950 text-emerald-800 dark:text-emerald-400 shadow-sm border border-slate-200/50 dark:border-slate-800/80'
              : 'text-slate-600 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-800/50'
          }`}
        >
          <Phone className="w-3.5 h-3.5" />
          <span>{lang === 'hi' ? 'समन्वयक संपर्क' : 'Coordinators'}</span>
        </button>
        <button
          onClick={() => setActiveTab('inventory')}
          className={`flex-1 min-w-[120px] px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'inventory'
              ? 'bg-white dark:bg-slate-950 text-emerald-800 dark:text-emerald-400 shadow-sm border border-slate-200/50 dark:border-slate-800/80'
              : 'text-slate-600 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-800/50'
          }`}
        >
          <Package className="w-3.5 h-3.5" />
          <span>{lang === 'hi' ? 'स्टॉक व गतिविधियाँ' : 'Stock Log'}</span>
        </button>
      </div>

      {/* 3. Tab Contents */}
      
      {/* Tab 1: Yojana Ki Jankari (Module 1 & 6) */}
      {activeTab === 'jankari' && (
        <div className="space-y-5 animate-fadeIn" id="lado-jankari-panel">
          
          {/* External Redirect and Live Portal Links Banner */}
          <div className="p-4 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 dark:from-emerald-950/20 dark:to-teal-950/20 rounded-2xl border border-emerald-200/50 dark:border-emerald-800/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider font-sans border border-emerald-200 dark:border-emerald-800">
                Official Government Portal Links (Module 6)
              </span>
              <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-200">
                {lang === 'hi' ? 'महिला एवं बाल विकास विभाग (WCD) - मुख्यमंत्री लाडो प्रोत्साहन' : 'WCD Department - MukhyaMantri Lado Protsahan Portal'}
              </h4>
              <p className="text-[11px] text-slate-500">
                {lang === 'hi' ? 'शासकीय दिशानिर्देशों व प्रपत्र अपलोड हेतु लाभार्थी/शाळा दर्पण पोर्टल' : 'Official beneficiary direct redirect to the Shala Darpan & State DBT portal'}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 shrink-0">
              <a 
                href="https://wcd.rajasthan.gov.in/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-800 hover:bg-emerald-950 text-white text-xs font-bold rounded-xl shadow-sm hover:shadow transition-all"
              >
                <span>WCD Rajasthan Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <a 
                href="https://office.janaadhar.rajasthan.gov.in/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-800 transition-all"
              >
                <span>Beneficiary DBT Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Left Column: Official Scheme Details & Milestones */}
            <div className="lg:col-span-8 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
                <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>{lang === 'hi' ? 'लाडो प्रोत्साहन योजना: प्रोत्साहन मील के पत्थर' : 'Lado Protsahan: Incentive Milestones'}</span>
                </h3>
                
                <button
                  onClick={handleFetchOfficialPortal}
                  disabled={fetchingGovtInfo}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 hover:bg-emerald-50 text-[11px] text-slate-600 dark:text-slate-300 font-bold rounded-lg border border-slate-200 dark:border-slate-700 transition-all"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${fetchingGovtInfo ? 'animate-spin' : ''}`} />
                  <span>{fetchingGovtInfo ? 'Syncing...' : 'Live Sync Portal'}</span>
                </button>
              </div>

              {govtSyncTime && (
                <div className="p-2.5 bg-emerald-50/50 dark:bg-emerald-950/20 text-[10px] text-emerald-800 dark:text-emerald-400 rounded-lg border border-emerald-100 dark:border-emerald-900/30 flex items-center justify-between">
                  <span>🟢 Official WCD Database Synchronized Successfully!</span>
                  <span className="font-mono">Sync Code: {fetchedGovtData?.verifiedToken}</span>
                </div>
              )}

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-semibold">
                {lang === 'hi' ? initialYojanaDetails.objectiveHi : initialYojanaDetails.objectiveEn}
              </p>

              {/* Milestones Grid */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                  📈 {lang === 'hi' ? 'बालिका शिक्षा व प्रोत्साहन चरणवार भुगतान राशि:' : 'Step-by-step Girl Benefit Distribution Structure:'}
                </span>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {(fetchedGovtData || initialYojanaDetails).milestones.map((m: any, index: number) => (
                    <div 
                      key={index}
                      className="p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/50 dark:border-slate-800/50 flex justify-between items-center text-xs"
                    >
                      <span className="text-slate-600 dark:text-slate-400 font-medium">{m.trigger}</span>
                      <span className="font-extrabold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-1 rounded border border-emerald-100 dark:border-emerald-900/30 font-mono">
                        {m.amount}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Eligibility, Documents & Guidelines */}
            <div className="lg:col-span-4 space-y-4">
              {/* Eligibility */}
              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                <h4 className="font-extrabold text-xs text-slate-800 dark:text-slate-100 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-2">
                  <UserCheck className="w-4 h-4 text-emerald-600" />
                  <span>{lang === 'hi' ? 'पात्रता मानदंड' : 'Eligibility Criteria'}</span>
                </h4>
                <ul className="space-y-2 text-xs">
                  {initialYojanaDetails.eligibilityCriteria.map((c, i) => (
                    <li key={i} className="flex gap-2 text-slate-600 dark:text-slate-400 leading-relaxed">
                      <span className="text-emerald-600 font-bold shrink-0">✔</span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Documents */}
              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                <h4 className="font-extrabold text-xs text-slate-800 dark:text-slate-100 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-2">
                  <FileText className="w-4 h-4 text-amber-500" />
                  <span>{lang === 'hi' ? 'आवश्यक दस्तावेज सूची' : 'Documents Required'}</span>
                </h4>
                <ul className="space-y-2 text-xs">
                  {initialYojanaDetails.documentsRequired.map((doc, i) => (
                    <li key={i} className="flex gap-2 text-slate-600 dark:text-slate-400">
                      <span className="text-amber-500 font-bold shrink-0">📌</span>
                      <span>{doc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Eligible Girls Roster (Module 2) */}
      {activeTab === 'roster' && (
        <div className="space-y-5 animate-fadeIn" id="lado-roster-panel">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Add Student manually Form */}
            <div className="lg:col-span-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="pb-2 border-b border-slate-100 dark:border-slate-800">
                <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <Plus className="w-5 h-5 text-emerald-600" />
                  <span>{lang === 'hi' ? 'नई लाभार्थी बालिका दर्ज करें' : 'Add Scheme Student'}</span>
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {lang === 'hi' ? 'विद्यालय के शाला दर्पण विद्यार्थी डेटा के अनुसार जोड़ें' : 'Ensure details match Shala Darpan data'}
                </p>
              </div>

              <form onSubmit={handleAddStudent} className="space-y-3 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {lang === 'hi' ? 'बालिका का नाम (Student Name) *' : 'Girl Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="उदा: किरण बैरवा"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus:ring-1 focus:ring-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {lang === 'hi' ? 'पिता का नाम (Father\'s Name) *' : 'Father\'s Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="उदा: मदन लाल बैरवा"
                    value={formFather}
                    onChange={(e) => setFormFather(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus:ring-1 focus:ring-emerald-500 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {lang === 'hi' ? 'कक्षा (Class)' : 'Class'}
                    </label>
                    <select
                      value={formClass}
                      onChange={(e) => setFormClass(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus:ring-1 focus:ring-emerald-500"
                    >
                      <option value="Class 6">Class 6</option>
                      <option value="Class 7">Class 7</option>
                      <option value="Class 8">Class 8</option>
                      <option value="Class 9">Class 9</option>
                      <option value="Class 10">Class 10</option>
                      <option value="Class 11">Class 11</option>
                      <option value="Class 12">Class 12</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {lang === 'hi' ? 'संपर्क नंबर' : 'Contact Number'}
                    </label>
                    <input
                      type="text"
                      placeholder="उदा: 9414012345"
                      maxLength={10}
                      value={formPhone}
                      onChange={(e) => setFormPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus:ring-1 focus:ring-emerald-500 outline-none font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {lang === 'hi' ? 'जन आधार संख्या (Jan Aadhaar No)' : 'Jan Aadhaar No'}
                  </label>
                  <input
                    type="text"
                    placeholder="उदा: 9812-3456-7890"
                    value={formJanAadhaar}
                    onChange={(e) => setFormJanAadhaar(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus:ring-1 focus:ring-emerald-500 outline-none font-mono"
                  />
                </div>

                {/* Dropdown Status Selection: Patra & Apatra (Requirement 2) */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {lang === 'hi' ? 'योग्यता स्थिति (Eligibility Status)' : 'Eligibility Status'}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setFormStatus('Patra')}
                      className={`py-2 rounded-xl border font-bold text-xs cursor-pointer transition-all flex items-center justify-center gap-1 ${
                        formStatus === 'Patra'
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-800 dark:text-emerald-400'
                          : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500'
                      }`}
                    >
                      <Check className="w-4 h-4" />
                      <span>{lang === 'hi' ? 'पात्र (Patra)' : 'Eligible'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormStatus('Apatra')}
                      className={`py-2 rounded-xl border font-bold text-xs cursor-pointer transition-all flex items-center justify-center gap-1 ${
                        formStatus === 'Apatra'
                          ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-500 text-rose-800 dark:text-rose-400'
                          : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500'
                      }`}
                    >
                      <X className="w-4 h-4" />
                      <span>{lang === 'hi' ? 'अपात्र (Apatra)' : 'Ineligible'}</span>
                    </button>
                  </div>
                </div>

                {/* Mandatory Ineligible Reason Dropdown if Apatra (Requirement 2) */}
                {formStatus === 'Apatra' && (
                  <div className="space-y-1.5 animate-slideDown">
                    <label className="block text-[11px] font-bold text-rose-600 dark:text-rose-400 mb-1">
                      {lang === 'hi' ? 'अपात्रता का कारण (Reason for Ineligible) *' : 'Reason for Ineligible *'}
                    </label>
                    <select
                      value={formReason}
                      onChange={(e) => setFormReason(e.target.value)}
                      className="w-full px-2 py-2 rounded-xl border border-rose-300 dark:border-rose-900 bg-rose-50/20 dark:bg-rose-950/20 text-rose-800 dark:text-rose-300 focus:ring-1 focus:ring-rose-500"
                    >
                      {ineligibleReasons.map((reason, i) => (
                        <option key={i} value={reason}>
                          {reason}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl shadow transition-colors flex items-center justify-center gap-1.5 cursor-pointer mt-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>{lang === 'hi' ? 'रोस्टर में दर्ज करें' : 'Add to Roster'}</span>
                </button>
              </form>
            </div>

            {/* Roster & Quick Imports Actions */}
            <div className="lg:col-span-8 space-y-4">
              
              {/* Toolbar & Imports Controls */}
              <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                
                {/* Searching */}
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder={lang === 'hi' ? 'नाम या जन आधार से खोजें...' : 'Search student...'}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus:ring-1 focus:ring-emerald-500 outline-none"
                  />
                </div>

                {/* Import actions */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={handleQuickImportMockRoster}
                    className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-800 transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Users className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{lang === 'hi' ? 'क्विक आयात (शाला दर्पण)' : 'Quick Import'}</span>
                  </button>

                  <label className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-800 transition-colors cursor-pointer flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5 text-amber-500" />
                    <span>{lang === 'hi' ? 'CSV इम्पोर्ट' : 'Import CSV'}</span>
                    <input
                      type="file"
                      accept=".csv,.txt"
                      onChange={handleCSVImport}
                      className="hidden"
                    />
                  </label>

                  <button
                    onClick={handleDownloadXMLRoster}
                    className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-slate-850 dark:hover:bg-slate-750 text-emerald-400 text-xs font-bold rounded-xl border border-slate-700 dark:border-slate-800 transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <FileCode className="w-3.5 h-3.5" />
                    <span>XML</span>
                  </button>
                </div>
              </div>

              {/* Roster Listing Grid */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                  <h4 className="font-extrabold text-xs text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    {lang === 'hi' ? 'बालिका योजना पंजीयन सूची (Student Roster)' : 'Scheme Student Roster'}
                  </h4>
                  <div className="flex gap-2">
                    <select
                      value={selectedClassFilter}
                      onChange={(e) => setSelectedClassFilter(e.target.value)}
                      className="text-xs border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-1.5 rounded-lg outline-none font-semibold text-slate-600 dark:text-slate-300"
                    >
                      <option value="All">All Classes</option>
                      <option value="Class 6">Class 6</option>
                      <option value="Class 7">Class 7</option>
                      <option value="Class 8">Class 8</option>
                      <option value="Class 9">Class 9</option>
                      <option value="Class 10">Class 10</option>
                      <option value="Class 11">Class 11</option>
                      <option value="Class 12">Class 12</option>
                    </select>
                  </div>
                </div>

                {filteredStudents.length === 0 ? (
                  <div className="p-12 text-center text-slate-400 text-xs">
                    No matching student registered. Click 'Quick Import' or use the add form to add students.
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredStudents.map((s) => (
                      <div key={s.id} className="p-3.5 flex flex-col sm:flex-row justify-between sm:items-center gap-3.5 text-xs hover:bg-slate-50/50 dark:hover:bg-slate-900/40 transition-colors">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-slate-850 dark:text-slate-100">{s.name}</span>
                            <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-500 font-bold font-mono">
                              {s.className}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500">
                            {lang === 'hi' ? `पिता: ${s.fatherName} | जन आधार: ${s.janAadhaar}` : `Father: ${s.fatherName} | Jan Aadhaar: ${s.janAadhaar}`}
                          </p>
                          {s.status === 'Apatra' && (
                            <div className="flex items-start gap-1 p-1 px-2 bg-rose-50 dark:bg-rose-950/20 text-[10px] text-rose-700 dark:text-rose-400 rounded-lg border border-rose-100 dark:border-rose-900/30 font-medium">
                              <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                              <span>Reason: {s.reason}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                          {/* Eligibility Badge */}
                          {s.status === 'Patra' ? (
                            <span className="px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 font-bold text-[10px] flex items-center gap-1 shrink-0 uppercase tracking-wide">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                              <span>{lang === 'hi' ? 'पात्र (Eligible)' : 'Patra'}</span>
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/30 text-rose-700 dark:text-rose-400 font-bold text-[10px] flex items-center gap-1 shrink-0 uppercase tracking-wide">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                              <span>{lang === 'hi' ? 'अपात्र (Ineligible)' : 'Apatra'}</span>
                            </span>
                          )}

                          {/* Actions */}
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => {
                                // Toggle eligibility state
                                setStudents(prev => prev.map(item => {
                                  if (item.id === s.id) {
                                    const nextStatus = item.status === 'Patra' ? 'Apatra' : 'Patra';
                                    return {
                                      ...item,
                                      status: nextStatus,
                                      reason: nextStatus === 'Apatra' ? ineligibleReasons[0] : undefined
                                    };
                                  }
                                  return item;
                                }));
                              }}
                              className="px-2 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-[10px] font-bold border border-slate-200 dark:border-slate-850 text-slate-600 dark:text-slate-300"
                              title="Toggle Eligibility"
                            >
                              Toggle
                            </button>
                            <button
                              onClick={() => handleDeleteStudent(s.id)}
                              className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950/20 dark:hover:bg-rose-900/40 dark:text-rose-400 border border-rose-100 dark:border-rose-900/30 transition-colors"
                              title="Delete Student"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Patra Balikay Report (Module 3) */}
      {activeTab === 'patra' && (
        <div className="space-y-5 animate-fadeIn" id="lado-patra-panel">
          
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>{lang === 'hi' ? 'पात्र बालिकाओं की सत्यापित सूची (Module 3)' : 'Verified Eligible Girls (Patra) Roster'}</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {lang === 'hi' ? 'केवल मुख्यमंत्री लाडो प्रोत्साहन योजना हेतु पात्र छात्राओं की समेकित रिपोर्ट' : 'Consolidated reports for eligible student welfare distribution'}
                </p>
              </div>

              {/* Reports Download Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadPDFReport}
                  className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl shadow transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>{lang === 'hi' ? 'सत्यापित PDF डाउनलोड' : 'Download PDF Report'}</span>
                </button>
                <button
                  onClick={handleDownloadXMLRoster}
                  className="px-4 py-2 bg-slate-950 hover:bg-slate-900 text-emerald-400 font-bold text-xs rounded-xl border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <FileCode className="w-4 h-4" />
                  <span>{lang === 'hi' ? 'शाला दर्पण XML डाउनलोड' : 'Export XML'}</span>
                </button>
              </div>
            </div>

            {/* List of eligible girls only */}
            {students.filter(s => s.status === 'Patra').length === 0 ? (
              <div className="p-12 text-center text-slate-400 text-xs">
                No students marked as "Patra" in the system. Go to the 'Girls List' tab and set student status.
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-800">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 font-bold text-slate-700 dark:text-slate-300">
                      <th className="p-3 text-center w-12">S.No</th>
                      <th className="p-3">Student Name</th>
                      <th className="p-3">Father's Name</th>
                      <th className="p-3 text-center">Class</th>
                      <th className="p-3 font-mono">Jan Aadhaar Number</th>
                      <th className="p-3 font-mono">Contact Number</th>
                      <th className="p-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                    {students.filter(s => s.status === 'Patra').map((s, idx) => (
                      <tr key={s.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40 text-slate-600 dark:text-slate-300">
                        <td className="p-3 text-center font-bold text-slate-400">{idx + 1}</td>
                        <td className="p-3 font-bold text-slate-800 dark:text-slate-100">{s.name}</td>
                        <td className="p-3">{s.fatherName}</td>
                        <td className="p-3 text-center">
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-bold font-mono">
                            {s.className}
                          </span>
                        </td>
                        <td className="p-3 font-mono text-[11px] text-slate-500">{s.janAadhaar}</td>
                        <td className="p-3 font-mono text-[11px] text-slate-500">{s.phone}</td>
                        <td className="p-3 text-center">
                          <span className="inline-flex px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 font-bold text-[9px] uppercase border border-emerald-100 dark:border-emerald-900/30">
                            Satyapit (सत्यापित)
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 4: Apatra Balika Section (Module 4) */}
      {activeTab === 'apatra' && (
        <div className="space-y-5 animate-fadeIn" id="lado-apatra-panel">
          
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-rose-500" />
                  <span>{lang === 'hi' ? 'अपात्र बालिकाओं की सूची व समाधान रिपोर्ट (Module 4)' : 'Ineligible Girls (Apatra) Management List'}</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {lang === 'hi' ? 'वे छात्राएं जिनकी प्रविष्टि अपूर्ण है या पात्रता मानदंडों को पूरा नहीं करती हैं' : 'Review and update records to resolve validation issues or document gaps'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadXMLRoster}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl border border-slate-200 dark:border-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <FileCode className="w-4 h-4 text-rose-500" />
                  <span>{lang === 'hi' ? 'अपात्र XML एक्सपोर्ट' : 'Export XML'}</span>
                </button>
              </div>
            </div>

            {/* List of ineligible girls only */}
            {students.filter(s => s.status === 'Apatra').length === 0 ? (
              <div className="p-12 text-center text-slate-400 text-xs">
                Excellent! There are no students marked as "Apatra" (Ineligible) currently.
              </div>
            ) : (
              <div className="space-y-3">
                {students.filter(s => s.status === 'Apatra').map((s) => (
                  <div 
                    key={s.id} 
                    className="p-4 bg-rose-50/30 dark:bg-rose-950/10 rounded-2xl border border-rose-100 dark:border-rose-900/30 flex flex-col md:flex-row justify-between md:items-center gap-4 text-xs"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-850 dark:text-slate-100 text-sm">{s.name}</span>
                        <span className="px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-950/40 text-[10px] text-rose-700 dark:text-rose-400 font-bold">
                          {s.className}
                        </span>
                      </div>
                      
                      <p className="text-slate-500">
                        {lang === 'hi' ? `पिता: ${s.fatherName} | जन आधार: ${s.janAadhaar} | मोबाइल: ${s.phone}` : `Father: ${s.fatherName} | Jan Aadhaar: ${s.janAadhaar} | Phone: ${s.phone}`}
                      </p>

                      <div className="p-2.5 bg-white dark:bg-slate-955 rounded-xl border border-rose-200/50 dark:border-rose-900/20 text-[11px] text-rose-800 dark:text-rose-300 flex items-start gap-1.5">
                        <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                        <div>
                          <strong className="block mb-0.5">अपात्रता का मुख्य कारण (Ineligibility Reason):</strong>
                          <span>{s.reason}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-3 shrink-0 pt-2 md:pt-0">
                      <span className="px-3 py-1 bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-400 text-[10px] font-bold rounded-lg border border-amber-200/50 dark:border-amber-900/20 flex items-center gap-1 uppercase tracking-wide">
                        ⚠️ Action Required
                      </span>

                      <button
                        onClick={() => {
                          // Correct / make eligible
                          setStudents(prev => prev.map(item => {
                            if (item.id === s.id) {
                              return { ...item, status: 'Patra', reason: undefined };
                            }
                            return item;
                          }));
                          alert(`${s.name} has been marked as Patra (Eligible).`);
                        }}
                        className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
                      >
                        {lang === 'hi' ? 'त्रुटि सुधारें (Mark Eligible)' : 'Approve & Mark Eligible'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 5: Contact of Coordinators & Helplines (Module 5) */}
      {activeTab === 'coordinators' && (
        <div className="space-y-5 animate-fadeIn" id="lado-coordinators-panel">
          
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            
            {/* Header & Local Search */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <Phone className="w-5 h-5 text-emerald-600 animate-bounce" />
                  <span>{lang === 'hi' ? 'राजस्थान जिलावार योजना प्रभारी एवं समन्वयक संपर्क सूत्र (Module 5)' : 'Rajasthan District Coordinators & Helplines'}</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {lang === 'hi' ? 'समस्त जिलों के महिला एवं बाल विकास विभाग (WCD) जिला इंचार्जों के संपर्क सूत्र' : 'Official contact directory grouped district-wise for scheme implementations'}
                </p>
              </div>

              {/* Local Search input for coordinators */}
              <div className="relative w-full max-w-xs">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder={lang === 'hi' ? 'अपना जिला खोजें...' : 'Search your district...'}
                  value={coordinatorSearch}
                  onChange={(e) => setCoordinatorSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 focus:ring-1 focus:ring-emerald-500 outline-none font-bold"
                />
              </div>
            </div>

            {/* Official Helpline Direct Support box */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-2">
              <div className="p-3 bg-amber-50/50 dark:bg-amber-950/20 rounded-xl border border-amber-200/50 dark:border-amber-900/20 text-xs">
                <strong className="block text-amber-800 dark:text-amber-400 mb-0.5">📞 Official Toll-Free Welfare Helpline</strong>
                <span className="text-base font-black text-slate-800 dark:text-slate-200">181 / 1098</span>
                <p className="text-[10px] text-slate-400 mt-0.5">State Child & Women Welfare Support</p>
              </div>
              <div className="p-3 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-xl border border-emerald-200/50 dark:border-emerald-900/20 text-xs">
                <strong className="block text-emerald-800 dark:text-emerald-400 mb-0.5">📧 Department Nodal Email ID</strong>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">dir-wcd-rj@nic.in</span>
                <p className="text-[10px] text-slate-400 mt-0.5">WCD Headquarters, Secretariat, Jaipur</p>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
                <strong className="block text-slate-700 dark:text-slate-300 mb-0.5">🏢 Shala Darpan DBT Support</strong>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">rajshreemg@gmail.com</span>
                <p className="text-[10px] text-slate-400 mt-0.5">Direct Benefit Transfer Cell Support</p>
              </div>
            </div>

            {/* Coordinators Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {coordinatorsList
                .filter(c => c.district.toLowerCase().includes(coordinatorSearch.toLowerCase()))
                .map((c, index) => (
                  <div 
                    key={index} 
                    className="p-4 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-slate-200/60 dark:border-slate-800/50 space-y-2 hover:shadow-sm transition-all"
                  >
                    <div className="flex justify-between items-start border-b border-slate-200/50 dark:border-slate-750 pb-1.5">
                      <span className="font-extrabold text-xs text-emerald-800 dark:text-emerald-400 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{c.district}</span>
                      </span>
                      <span className="text-[9px] bg-slate-200/70 dark:bg-slate-800 text-slate-500 font-bold px-1.5 py-0.5 rounded uppercase">
                        Active
                      </span>
                    </div>

                    <div className="text-xs space-y-1">
                      <p className="font-bold text-slate-800 dark:text-slate-100">{c.name}</p>
                      <p className="text-[10px] text-slate-400 font-medium">{c.designation}</p>
                      
                      <div className="flex items-center gap-1.5 pt-1 text-[11px] text-slate-600 dark:text-slate-400">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-mono">{c.phone}</span>
                      </div>
                      
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-400 truncate">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-mono">{c.email}</span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 6: Preserved Napkins Inventory & Self Defense Logs */}
      {activeTab === 'inventory' && (
        <div className="space-y-5 animate-fadeIn" id="lado-inventory-panel">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            {/* Napkins Stock Left Block */}
            <div className="md:col-span-5 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1">
                  <Package className="w-4 h-4 text-emerald-600" />
                  <span>Napkin Inventory Ledger</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Current Stock</span>
              </div>

              {/* Stock Indicator */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700 text-center space-y-1">
                <span className="block text-3xl font-black text-emerald-700 dark:text-emerald-400">{ladoStock} pcs</span>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider">Available Sanitary Napkins</span>
              </div>

              {/* Inventory low alert */}
              {ladoStock < 400 && (
                <div className="p-2.5 bg-rose-50 dark:bg-rose-950/20 text-[10px] text-rose-700 dark:text-rose-400 rounded-lg border border-rose-200/50 dark:border-rose-900/30 leading-snug">
                  ⚠️ <strong>Stock Warning:</strong> Inventory levels are below the required reserve threshold. Please submit a napkin requisition request on Shala Darpan.
                </div>
              )}

              {/* Distribution & Add Stock Forms */}
              <div className="space-y-3.5 pt-1 text-xs">
                {/* Add Stock */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300">Add Stock Receipts (Qty)</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Add napkin count"
                      value={ladoNapkinAdd}
                      onChange={e => setLadoNapkinAdd(e.target.value)}
                      className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs flex-1"
                    />
                    <button
                      onClick={() => {
                        const count = Number(ladoNapkinAdd);
                        if (!count || count <= 0) return;
                        setLadoStock(prev => prev + count);
                        setLadoNapkinAdd('');
                      }}
                      className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
                    >
                      Receive
                    </button>
                  </div>
                </div>

                {/* Distribute Stock */}
                <div className="space-y-1.5 border-t border-slate-100 dark:border-slate-800 pt-3">
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300">Distribute to Class Girls</label>
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={ladoDistClass}
                      onChange={e => setLadoDistClass(e.target.value)}
                      className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs w-full"
                    >
                      <option value="Class 6 Girls">Class 6 Girls</option>
                      <option value="Class 7 Girls">Class 7 Girls</option>
                      <option value="Class 8 Girls">Class 8 Girls</option>
                      <option value="Class 9 Girls">Class 9 Girls</option>
                      <option value="Class 10 Girls">Class 10 Girls</option>
                      <option value="Class 11 Girls">Class 11 Girls</option>
                      <option value="Class 12 Girls">Class 12 Girls</option>
                    </select>
                    <input
                      type="number"
                      placeholder="Quantity"
                      value={ladoDistQty}
                      onChange={e => setLadoDistQty(e.target.value)}
                      className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs w-full"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Distribution remarks/notes"
                    value={ladoDistRemarks}
                    onChange={e => setLadoDistRemarks(e.target.value)}
                    className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs w-full"
                  />
                  <button
                    onClick={() => {
                      const qty = Number(ladoDistQty);
                      if (!qty || qty <= 0 || ladoStock < qty) return;
                      setLadoStock(prev => prev - qty);
                      setLadoDistributionLogs(prev => [
                        {
                          id: `ld-${Date.now()}`,
                          date: new Date().toISOString().split('T')[0],
                          className: ladoDistClass,
                          quantity: qty,
                          remarks: ladoDistRemarks || 'Monthly distribution'
                        },
                        ...prev
                      ]);
                      setLadoDistRemarks('Monthly distribution');
                    }}
                    className="w-full py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-bold text-xs transition-colors cursor-pointer"
                  >
                    Confirm & Record Distribution
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column Self-defense logs and distribution diary */}
            <div className="md:col-span-7 space-y-4 text-xs">
              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3.5">
                <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200 flex items-center gap-1.5 pb-2 border-b border-slate-100 dark:border-slate-800">
                  <Calendar className="w-4 h-4 text-emerald-600" />
                  <span>Distribution Log History Diary</span>
                </h4>

                {/* List of Ledger transactions */}
                <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                  {ladoDistributionLogs.map((log) => (
                    <div key={log.id} className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/60 dark:border-slate-800/50 flex justify-between items-center text-xs">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-800 dark:text-slate-100">{log.className}</span>
                          <span className="font-extrabold text-emerald-700 dark:text-emerald-400 font-mono bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded border border-emerald-100 dark:border-emerald-900/30">{log.quantity} Distributed</span>
                        </div>
                        <p className="text-[10px] text-slate-400">Date: {log.date} | Note: {log.remarks}</p>
                      </div>
                      <button
                        onClick={() => {
                          setLadoStock(prev => prev + log.quantity);
                          setLadoDistributionLogs(prev => prev.filter(item => item.id !== log.id));
                        }}
                        className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 dark:hover:bg-rose-900/40 text-rose-700 dark:text-rose-400 border border-rose-100 dark:border-rose-900/30 transition-colors shrink-0 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Self Defense Activity Logs */}
              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                <span className="font-bold text-[11px] text-slate-700 dark:text-slate-300 block uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-2">
                  🔒 Rani Laxmibai Self-Defense Events Log
                </span>
                <div className="space-y-2 max-h-[160px] overflow-y-auto">
                  {ladoEvents.map(e => (
                    <div key={e.id} className="p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/50 text-xs space-y-0.5">
                      <div className="flex justify-between font-bold text-slate-850 dark:text-slate-200">
                        <span>{e.title}</span>
                        <span className="text-emerald-700 dark:text-emerald-400 font-mono font-black">{e.participants} Girls</span>
                      </div>
                      <p className="text-[10px] text-slate-500">Date: {e.date} | Coach: {e.instructor}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Bottom Information block matching with Rajasthan official website UI/UX footer schema */}
      <div className="p-4 bg-slate-100 dark:bg-slate-900 rounded-2xl text-[11px] text-slate-500 space-y-1 text-center border border-slate-200/60 dark:border-slate-800">
        <p className="font-bold text-slate-700 dark:text-slate-400">
          शाला सहायक डिजिटल प्रभाग - बालिका कल्याण एवं मुख्यमंत्री लाडो प्रोत्साहन योजना प्रभारी टूलकिट
        </p>
        <p>
          State Welfare Portal Direct Integration. All generated reports comply with the official circulars of Rajasthan School Education Council & Women Child Development directives.
        </p>
      </div>

    </div>
  );
};
