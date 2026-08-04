import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Home, Save, Printer, Download, Image as ImageIcon, RotateCcw, Edit, Eye, School, Shield, Table, CreditCard, CheckSquare, ChevronRight, ChevronLeft, Check, Sparkles, Share2, ShieldCheck } from 'lucide-react';
import { safeHtml2Canvas } from '../../utils/safeHtml2Canvas';
import jsPDF from 'jspdf';
import { notifyIndexNow } from '../../utils/indexing';

interface SchoolDetails {
  schoolName: string;
  udiseCode: string;
  tehsil: string;
  principalName: string;
  principalContact: string;
  schoolEmail: string;
  sportsInchargeName: string;
  sportsInchargeContact: string;
  session: string;
}

interface ClassFeeDetail {
  className: string;
  classLabelHi: string;
  generalCount: number;
  reservedCount: number;
}

interface BankDetails {
  bankName: string;
  branchName: string;
  ddChequeNo: string;
  ddDate: string;
  ddAmount: number;
  ddAmountWords: string;
}

interface OfficeUseDetails {
  receiptDate: string;
  receivedAmount: number;
  receiptDetails: string;
}

export function numberToHindiWords(num: number): string {
  if (num <= 0) return 'शून्य';
  const ones = [
    '', 'एक', 'दो', 'तीन', 'चार', 'पांच', 'छह', 'सात', 'आठ', 'नौ', 'दस',
    'ग्यारह', 'बारह', 'तेरह', 'चौदह', 'पंद्रह', 'सोलह', 'सत्रह', 'अठारह', 'उन्नीस', 'बीस',
    'इक्कीस', 'बाईस', 'तेईस', 'चौबीस', 'पच्चीस', 'छब्बीस', 'सत्ताईस', 'अट्ठाइस', 'उन्तीस', 'तीस',
    'इकतीस', 'बत्तीस', 'तैंतीस', 'चौंतीस', 'पैंतीस', 'छत्तीस', 'सैंतीस', 'अड़तीस', 'उनतालीस', 'चालीस',
    'इकतालीस', 'बयालीस', 'तैंतालीस', 'चवालीस', 'पैंतालीस', 'छियालीस', 'सैंतालीस', 'अड़तालीस', 'उनचास', 'पचास',
    'इक्कावन', 'बावन', 'तिरेपन', 'चौवन', 'पचपन', 'छप्पन', 'सतावन', 'अठावन', 'उनसठ', 'साठ',
    'इकसठ', 'बासठ', 'तिरेसठ', 'चौंसठ', 'पैंसठ', 'छियासठ', 'सड़सठ', 'अड़सठ', 'उनहत्तर', 'सत्तर',
    'इकहत्तर', 'बहत्तर', 'तिहत्तर', 'चौहत्तर', 'पचहत्तर', 'छिहत्तर', 'सतहत्तर', 'अठहत्तर', 'उनासी', 'अस्सी',
    'इक्यासी', 'बयासी', 'तिरासी', 'चौरासी', 'पचासी', 'छियासी', 'सतासी', 'अठासी', 'नवासी', 'नब्बे',
    'इक्यान्वे', 'बयान्वे', 'तिरान्वे', 'चौरान्वे', 'पचान्वे', 'छियान्वे', 'सतान्वे', 'अठान्वे', 'निन्यान्वे'
  ];

  let words = '';
  if (num >= 10000000) {
    words += numberToHindiWords(Math.floor(num / 10000000)) + ' करोड़ ';
    num %= 10000000;
  }
  if (num >= 100000) {
    words += numberToHindiWords(Math.floor(num / 100000)) + ' लाख ';
    num %= 100000;
  }
  if (num >= 1000) {
    const thousandParts = Math.floor(num / 1000);
    words += (thousandParts < 100 ? ones[thousandParts] : numberToHindiWords(thousandParts)) + ' हजार ';
    num %= 1000;
  }
  if (num >= 100) {
    words += ones[Math.floor(num / 100)] + ' सौ ';
    num %= 100;
  }
  if (num > 0) {
    words += ones[num];
  }
  return words.trim();
}

export const KridaShulkMaker: React.FC<{
  initialSchoolProfile?: { schoolName?: string; udiseCode?: string; district?: string };
  lang: 'hi' | 'en';
  onBack: () => void;
}> = ({ initialSchoolProfile, lang, onBack }) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const previewRef = useRef<HTMLDivElement>(null);

  // Confirmation modal state before triggering print/download
  const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);
  const [pendingAction, setPendingAction] = useState<'print' | 'pdf' | 'image' | null>(null);
  const [userConfirmedReview, setUserConfirmedReview] = useState<boolean>(false);

  const requestAction = (action: 'print' | 'pdf' | 'image') => {
    setPendingAction(action);
    setUserConfirmedReview(false);
    setShowConfirmDialog(true);
  };

  const handleExecuteAction = () => {
    if (!pendingAction) return;
    const action = pendingAction;
    setShowConfirmDialog(false);
    setPendingAction(null);

    setTimeout(() => {
      if (action === 'print') triggerPrint();
      else if (action === 'pdf') downloadPDF();
      else if (action === 'image') downloadImage();
    }, 150);
  };

  const STEPS = [
    { id: 1, labelHi: '१. विद्यालय विवरण', labelEn: '1. School Details', icon: School },
    { id: 2, labelHi: '२. कक्षावार छात्र संख्या', labelEn: '2. Class Counts', icon: Table },
    { id: 3, labelHi: '३. बैंक / डी.डी. विवरण', labelEn: '3. Bank & DD Details', icon: CreditCard },
    { id: 4, labelHi: '४. कार्यालय उपयोग', labelEn: '4. Office Details', icon: Shield },
    { id: 5, labelHi: '५. प्रपत्र पूर्वावलोकन', labelEn: '5. Preview & Print', icon: Eye },
  ];

  // Validation Errors State
  interface ValidationErrors {
    schoolName?: string;
    udiseCode?: string;
    tehsil?: string;
    principalName?: string;
    principalContact?: string;
    schoolEmail?: string;
    sportsInchargeName?: string;
    sportsInchargeContact?: string;
  }
  const [errors, setErrors] = useState<ValidationErrors>({});

  // Core School Details State
  const [schoolDetails, setSchoolDetails] = useState<SchoolDetails>(() => {
    try {
      const saved = localStorage.getItem('krida_shulk_school_details');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return {
      schoolName: initialSchoolProfile?.schoolName || 'राजकीय उच्च माध्यमिक विद्यालय, जोधपुर',
      udiseCode: initialSchoolProfile?.udiseCode || '08140302501',
      tehsil: 'जोधपुर',
      principalName: 'श्री रामेश्वर प्रसाद',
      principalContact: '9829012345',
      schoolEmail: 'gss.jodhpur@rajasthan.gov.in',
      sportsInchargeName: 'श्री नवीन कुमार (PTI)',
      sportsInchargeContact: '9414054321',
      session: '2026-27'
    };
  });

  // Class wise student details (Class 6 to 12)
  const [classDetails, setClassDetails] = useState<ClassFeeDetail[]>(() => {
    try {
      const saved = localStorage.getItem('krida_shulk_class_details');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [
      { className: 'Class 6', classLabelHi: '6 वीं', generalCount: 15, reservedCount: 20 },
      { className: 'Class 7', classLabelHi: '7 वीं', generalCount: 18, reservedCount: 22 },
      { className: 'Class 8', classLabelHi: '8 वीं', generalCount: 20, reservedCount: 25 },
      { className: 'Class 9', classLabelHi: '9 वीं', generalCount: 25, reservedCount: 30 },
      { className: 'Class 10', classLabelHi: '10 वीं', generalCount: 30, reservedCount: 35 },
      { className: 'Class 11', classLabelHi: '11 वीं', generalCount: 22, reservedCount: 28 },
      { className: 'Class 12', classLabelHi: '12 वीं', generalCount: 24, reservedCount: 26 },
    ];
  });

  // Payment/DD Details State
  const [bankDetails, setBankDetails] = useState<BankDetails>(() => {
    try {
      const saved = localStorage.getItem('krida_shulk_bank_details');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return {
      bankName: 'भारतीय स्टेट बैंक (SBI)',
      branchName: 'मुख्य शाखा, जोधपुर',
      ddChequeNo: '452381',
      ddDate: new Date().toISOString().split('T')[0],
      ddAmount: 0, // Will be computed or editable
      ddAmountWords: ''
    };
  });

  // Office use only details
  const [officeDetails, setOfficeDetails] = useState<OfficeUseDetails>(() => {
    try {
      const saved = localStorage.getItem('krida_shulk_office_details');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return {
      receiptDate: '',
      receivedAmount: 0,
      receiptDetails: ''
    };
  });

  const [formDate, setFormDate] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('krida_shulk_form_date');
      if (saved) return saved;
    } catch (e) {
      console.error(e);
    }
    return new Date().toISOString().split('T')[0];
  });

  // Calculate fees on change
  const generalRate = 20;
  const reservedRate = 10;

  const totalGeneralStudents = classDetails.reduce((sum, item) => sum + item.generalCount, 0);
  const totalReservedStudents = classDetails.reduce((sum, item) => sum + item.reservedCount, 0);
  const totalStudents = totalGeneralStudents + totalReservedStudents;

  const totalGeneralFee = totalGeneralStudents * generalRate;
  const totalReservedFee = totalReservedStudents * reservedRate;
  const grandTotalFee = totalGeneralFee + totalReservedFee;

  // Auto-sync computed grand total to bank details amount
  useEffect(() => {
    setBankDetails(prev => ({
      ...prev,
      ddAmount: grandTotalFee,
      ddAmountWords: numberToHindiWords(grandTotalFee) + ' रुपये मात्र'
    }));
  }, [grandTotalFee]);

  // Robust automatic local storage persistence
  useEffect(() => {
    localStorage.setItem('krida_shulk_school_details', JSON.stringify(schoolDetails));
  }, [schoolDetails]);

  useEffect(() => {
    localStorage.setItem('krida_shulk_class_details', JSON.stringify(classDetails));
  }, [classDetails]);

  useEffect(() => {
    localStorage.setItem('krida_shulk_bank_details', JSON.stringify(bankDetails));
  }, [bankDetails]);

  useEffect(() => {
    localStorage.setItem('krida_shulk_office_details', JSON.stringify(officeDetails));
  }, [officeDetails]);

  useEffect(() => {
    localStorage.setItem('krida_shulk_form_date', formDate);
  }, [formDate]);

  // Comprehensive Form Validation
  const validateForm = (): boolean => {
    const tempErrors: ValidationErrors = {};
    
    // School Name validation
    if (!schoolDetails.schoolName.trim()) {
      tempErrors.schoolName = lang === 'hi' ? 'विद्यालय का नाम दर्ज करना आवश्यक है।' : 'School name is required.';
    }

    // UDISE Code validation (Exactly 11 digits)
    const udiseRegex = /^\d{11}$/;
    if (!schoolDetails.udiseCode.trim()) {
      tempErrors.udiseCode = lang === 'hi' ? 'डाईस कोड दर्ज करना आवश्यक है।' : 'UDISE code is required.';
    } else if (!udiseRegex.test(schoolDetails.udiseCode.trim())) {
      tempErrors.udiseCode = lang === 'hi' ? 'डाईस कोड ठीक ११ अंकों का होना चाहिए।' : 'UDISE code must be exactly 11 digits.';
    }

    // Tehsil validation
    if (!schoolDetails.tehsil.trim()) {
      tempErrors.tehsil = lang === 'hi' ? 'तहसील दर्ज करना आवश्यक है।' : 'Tehsil is required.';
    }

    // Principal Name validation
    if (!schoolDetails.principalName.trim()) {
      tempErrors.principalName = lang === 'hi' ? 'संस्थाप्रधान का नाम आवश्यक है।' : 'Principal name is required.';
    }

    // Principal Contact validation (10 digits)
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!schoolDetails.principalContact.trim()) {
      tempErrors.principalContact = lang === 'hi' ? 'संपर्क नंबर दर्ज करना आवश्यक है।' : 'Contact number is required.';
    } else if (!phoneRegex.test(schoolDetails.principalContact.trim())) {
      tempErrors.principalContact = lang === 'hi' ? 'वैध १० अंकों का मोबाइल नंबर दर्ज करें।' : 'Enter a valid 10-digit mobile number.';
    }

    // Sports Incharge Name validation
    if (!schoolDetails.sportsInchargeName.trim()) {
      tempErrors.sportsInchargeName = lang === 'hi' ? 'खेल प्रभारी का नाम आवश्यक है।' : 'Sports incharge name is required.';
    }

    // Sports Incharge Contact validation (10 digits)
    if (!schoolDetails.sportsInchargeContact.trim()) {
      tempErrors.sportsInchargeContact = lang === 'hi' ? 'संपर्क नंबर दर्ज करना आवश्यक है।' : 'Contact number is required.';
    } else if (!phoneRegex.test(schoolDetails.sportsInchargeContact.trim())) {
      tempErrors.sportsInchargeContact = lang === 'hi' ? 'वैध १० अंकों का मोबाइल नंबर दर्ज करें।' : 'Enter a valid 10-digit mobile number.';
    }

    // School Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!schoolDetails.schoolEmail.trim()) {
      tempErrors.schoolEmail = lang === 'hi' ? 'ई-मेल आईडी दर्ज करना आवश्यक है।' : 'School email is required.';
    } else if (!emailRegex.test(schoolDetails.schoolEmail.trim())) {
      tempErrors.schoolEmail = lang === 'hi' ? 'वैध ई-मेल आईडी दर्ज करें।' : 'Enter a valid email address.';
    }

    setErrors(tempErrors);
    
    // Return true if no errors
    return Object.keys(tempErrors).length === 0;
  };

  // JSON-LD HowTo Schema Injection for Search Engine Optimization (SEO)
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'jsonld-krida-shulk-howto';
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Generate Rajasthan School Krida Shulk Form (क्रीड़ा शुल्क विवरण प्रपत्र)",
      "description": "Step-by-step workflow for generating Rajasthan Education Department Krida Shulk Form A and B for school physical education fees.",
      "totalTime": "PT3M",
      "tool": [
        {
          "@type": "HowToTool",
          "name": "Shala Sahayak Krida Shulk Form Maker"
        }
      ],
      "step": [
        {
          "@type": "HowToStep",
          "position": 1,
          "name": "School & Principal Details",
          "text": "Enter School Name, UDISE code, Tehsil, Principal, and Sports Incharge details."
        },
        {
          "@type": "HowToStep",
          "position": 2,
          "name": "Class Strength Entry",
          "text": "Enter student count for General and Reserved female students for Classes 6 to 12."
        },
        {
          "@type": "HowToStep",
          "position": 3,
          "name": "Bank & DD Information",
          "text": "Enter Demand Draft/Cheque details, Bank name, DD date, and total sports fee amount."
        },
        {
          "@type": "HowToStep",
          "position": 4,
          "name": "Office Receipt Details",
          "text": "Enter Collection Center Receipt date and transaction details."
        },
        {
          "@type": "HowToStep",
          "position": 5,
          "name": "Preview, Print & Export",
          "text": "Preview the official printable Form A & B and export as high-resolution PDF or print directly."
        }
      ]
    });
    document.head.appendChild(script);

    return () => {
      const existingScript = document.getElementById('jsonld-krida-shulk-howto');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  // Save states to local storage and trigger IndexNow protocol
  const handleSave = () => {
    localStorage.setItem('krida_shulk_school_details', JSON.stringify(schoolDetails));
    localStorage.setItem('krida_shulk_class_details', JSON.stringify(classDetails));
    localStorage.setItem('krida_shulk_bank_details', JSON.stringify(bankDetails));
    localStorage.setItem('krida_shulk_office_details', JSON.stringify(officeDetails));
    localStorage.setItem('krida_shulk_form_date', formDate);

    // Call IndexNow protocol API to accelerate search indexing
    const directUrl = `${window.location.origin}/teacher/pti/kridashulk`;
    notifyIndexNow([directUrl]);

    alert(lang === 'hi' ? 'विवरण सुरक्षित कर लिया गया है!' : 'Details saved successfully!');
  };

  const handleShare = async () => {
    const directUrl = `${window.location.origin}/teacher/pti/kridashulk`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'क्रीड़ा शुल्क विवरण प्रपत्र (Shala Sahayak)',
          text: `शाला सहायक: ${schoolDetails.schoolName || 'राजस्थान विद्यालय'} क्रीड़ा शुल्क विवरण प्रपत्र।`,
          url: directUrl
        });
      } catch (err) {
        console.log('Share error or cancelled', err);
      }
    } else {
      navigator.clipboard.writeText(directUrl);
      alert(lang === 'hi' ? 'लिंक क्लिपबोर्ड पर कॉपी हो गया!' : 'Link copied to clipboard!');
    }
  };

  const handleReset = () => {
    if (confirm(lang === 'hi' ? 'क्या आप सभी विवरणों को रीसेट करना चाहते हैं?' : 'Are you sure you want to reset all details?')) {
      localStorage.removeItem('krida_shulk_school_details');
      localStorage.removeItem('krida_shulk_class_details');
      localStorage.removeItem('krida_shulk_bank_details');
      localStorage.removeItem('krida_shulk_office_details');
      localStorage.removeItem('krida_shulk_form_date');
      window.location.reload();
    }
  };

  const handleClassCountChange = (index: number, field: 'generalCount' | 'reservedCount', val: string) => {
    const updated = [...classDetails];
    updated[index] = {
      ...updated[index],
      [field]: Math.max(0, parseInt(val) || 0)
    };
    setClassDetails(updated);
  };

  // Trigger native print dialog
  const triggerPrint = () => {
    window.print();
  };

  // Export to Image using safeHtml2Canvas
  const downloadImage = async () => {
    if (!previewRef.current) return;
    try {
      const element = previewRef.current;
      const canvas = await safeHtml2Canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      });
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `Krida_Shulk_Pramanak_${schoolDetails.session}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Error generating image:', error);
      alert('इमेज बनाने में त्रुटि हुई। कृपया पुनः प्रयास करें।');
    }
  };

  // Export as high quality PDF using html2canvas and jsPDF
  const downloadPDF = async () => {
    if (!previewRef.current) return;
    try {
      const element = previewRef.current;
      const canvas = await safeHtml2Canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        windowWidth: 800,
      });
      const imgData = canvas.toDataURL('image/png');
      const doc = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = doc.internal.pageSize.getWidth(); // 210
      const pdfHeight = doc.internal.pageSize.getHeight(); // 297
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      
      const calculatedHeight = (imgHeight * pdfWidth) / imgWidth;
      
      if (calculatedHeight <= pdfHeight) {
        doc.addImage(imgData, 'PNG', 0, 0, pdfWidth, calculatedHeight);
      } else {
        const finalWidth = (pdfHeight * imgWidth) / imgHeight;
        const xOffset = (pdfWidth - finalWidth) / 2;
        doc.addImage(imgData, 'PNG', xOffset, 0, finalWidth, pdfHeight);
      }
      
      doc.save(`Krida_Shulk_Vivaran_${schoolDetails.session}.pdf`);
    } catch (err) {
      console.error('Error generating PDF canvas:', err);
      triggerPrint();
    }
  };

  return (
    <div className="space-y-4">
      {/* Header bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 no-print">
        <div className="flex items-start sm:items-center gap-3 w-full md:w-auto">
          {/* Action Navigation Buttons */}
          <div className="flex items-center gap-1.5 shrink-0 mt-1 sm:mt-0">
            <button
              onClick={onBack}
              className="flex items-center justify-center w-9 h-9 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white transition-all shadow-sm active:scale-95 cursor-pointer"
              title={lang === 'hi' ? 'पीछे जाएं' : 'Go Back'}
              aria-label="Go Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <button
              onClick={() => {
                window.history.pushState(null, '', '/');
                window.dispatchEvent(new PopStateEvent('popstate'));
              }}
              className="flex items-center justify-center w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-all active:scale-95 cursor-pointer"
              title={lang === 'hi' ? 'मुख्य होम' : 'Home'}
              aria-label="Home"
            >
              <Home className="w-5 h-5" />
            </button>
          </div>

          <div className="min-w-0">
            <h2 className="text-base font-black text-slate-950 dark:text-white flex items-center gap-2 flex-wrap">
              <span>{lang === 'hi' ? 'क्रीड़ा शुल्क विवरण प्रपत्र मेकर' : 'Sports Fee Form Maker'}</span>
              <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-full font-bold border border-emerald-300 dark:border-emerald-800 shrink-0">
                {lang === 'hi' ? `चरण ${currentStep} / ५` : `Step ${currentStep} / 5`}
              </span>
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              {lang === 'hi' ? 'कक्षा ६ से १२ तक के विद्यार्थियों का क्रीड़ा शुल्क प्रपत्र जनरेटर' : 'Step-by-step Rajasthan physical education sports fee form generator'}
            </p>
          </div>
        </div>

        {/* Action button header shortcuts */}
        <div className="flex items-center gap-2 flex-wrap w-full md:w-auto justify-end">
          <button
            onClick={() => requestAction('print')}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center space-x-1 cursor-pointer transition-all active:scale-95"
            title="Print Form"
          >
            <Printer className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>{lang === 'hi' ? 'प्रिंट' : 'Print'}</span>
          </button>
          <button
            onClick={handleShare}
            className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold flex items-center space-x-1 cursor-pointer shadow-sm transition-all active:scale-95"
            title="Share Form Link"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{lang === 'hi' ? 'शेयर' : 'Share'}</span>
          </button>
          <button
            onClick={handleReset}
            className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center space-x-1 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-all active:scale-95"
            title="Reset Form"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{lang === 'hi' ? 'रीसेट' : 'Reset'}</span>
          </button>
          <button
            onClick={handleSave}
            className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold flex items-center space-x-1 cursor-pointer shadow-sm transition-all active:scale-95"
            title="Save Form"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{lang === 'hi' ? 'सेव' : 'Save'}</span>
          </button>
        </div>
      </div>

      {/* Step Progress Navigation Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-3 shadow-sm border border-slate-200 dark:border-slate-800 no-print">
        <div className="flex items-center justify-between overflow-x-auto no-scrollbar gap-2 py-1">
          {STEPS.map((step) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            return (
              <button
                key={step.id}
                onClick={() => {
                  if (step.id < currentStep) {
                    setCurrentStep(step.id);
                  } else if (step.id === 5) {
                    if (validateForm()) {
                      setCurrentStep(5);
                    } else {
                      alert(lang === 'hi' ? 'कृपया फॉर्म में आवश्यक विवरण भरें।' : 'Please complete form details first.');
                    }
                  } else {
                    if (validateForm()) {
                      setCurrentStep(step.id);
                    }
                  }
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-700 text-white shadow-md'
                    : isCompleted
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                  isActive
                    ? 'bg-white text-emerald-800'
                    : isCompleted
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-300 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}>
                  {isCompleted ? <Check className="w-3 h-3 stroke-[3]" /> : step.id}
                </div>
                <span>{lang === 'hi' ? step.labelHi : step.labelEn}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* STEP 1: VIDHALAY & STAFF DETAILS */}
      {currentStep === 1 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 space-y-4 no-print">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
              <School className="w-5 h-5 text-emerald-600" />
              <span>{lang === 'hi' ? '१. विद्यालय एवं संस्थाप्रधान विवरण' : '1. School & Staff Details'}</span>
            </h3>
            <span className="text-xs text-slate-500 font-medium">Step 1 of 5</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="md:col-span-2">
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">विद्यालय का पूरा नाम व पता</label>
              <input
                type="text"
                value={schoolDetails.schoolName}
                onChange={e => setSchoolDetails({ ...schoolDetails, schoolName: e.target.value })}
                className={`w-full px-3.5 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-800 text-xs font-medium ${
                  errors.schoolName ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-slate-300 dark:border-slate-700'
                }`}
                placeholder="विद्यालय का नाम व पता लिखें"
              />
              {errors.schoolName && <p className="text-[10px] text-red-500 font-bold mt-1">{errors.schoolName}</p>}
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">विद्यालय डाइस कोड (UDISE Code)</label>
              <input
                type="text"
                maxLength={11}
                value={schoolDetails.udiseCode}
                onChange={e => setSchoolDetails({ ...schoolDetails, udiseCode: e.target.value })}
                className={`w-full px-3.5 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-800 text-xs font-mono font-bold ${
                  errors.udiseCode ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-slate-300 dark:border-slate-700'
                }`}
                placeholder="11 अंकों का डाइस कोड"
              />
              {errors.udiseCode && <p className="text-[10px] text-red-500 font-bold mt-1">{errors.udiseCode}</p>}
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">तहसील</label>
              <input
                type="text"
                value={schoolDetails.tehsil}
                onChange={e => setSchoolDetails({ ...schoolDetails, tehsil: e.target.value })}
                className={`w-full px-3.5 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-800 text-xs font-medium ${
                  errors.tehsil ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-slate-300 dark:border-slate-700'
                }`}
                placeholder="तहसील का नाम"
              />
              {errors.tehsil && <p className="text-[10px] text-red-500 font-bold mt-1">{errors.tehsil}</p>}
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">संस्थाप्रधान का नाम</label>
              <input
                type="text"
                value={schoolDetails.principalName}
                onChange={e => setSchoolDetails({ ...schoolDetails, principalName: e.target.value })}
                className={`w-full px-3.5 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-800 text-xs font-medium ${
                  errors.principalName ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-slate-300 dark:border-slate-700'
                }`}
                placeholder="प्रधानाचार्य / संस्थाप्रमुख का नाम"
              />
              {errors.principalName && <p className="text-[10px] text-red-500 font-bold mt-1">{errors.principalName}</p>}
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">संस्थाप्रधान संपर्क नं.</label>
              <input
                type="text"
                value={schoolDetails.principalContact}
                onChange={e => setSchoolDetails({ ...schoolDetails, principalContact: e.target.value })}
                className={`w-full px-3.5 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-800 text-xs font-mono ${
                  errors.principalContact ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-slate-300 dark:border-slate-700'
                }`}
                placeholder="10 अंकों का मोबाइल नंबर"
              />
              {errors.principalContact && <p className="text-[10px] text-red-500 font-bold mt-1">{errors.principalContact}</p>}
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">शारीरिक शिक्षक / खेल प्रभारी का नाम</label>
              <input
                type="text"
                value={schoolDetails.sportsInchargeName}
                onChange={e => setSchoolDetails({ ...schoolDetails, sportsInchargeName: e.target.value })}
                className={`w-full px-3.5 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-800 text-xs font-medium ${
                  errors.sportsInchargeName ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-slate-300 dark:border-slate-700'
                }`}
                placeholder="PTI / खेल प्रभारी का नाम"
              />
              {errors.sportsInchargeName && <p className="text-[10px] text-red-500 font-bold mt-1">{errors.sportsInchargeName}</p>}
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">खेल प्रभारी संपर्क नं.</label>
              <input
                type="text"
                value={schoolDetails.sportsInchargeContact}
                onChange={e => setSchoolDetails({ ...schoolDetails, sportsInchargeContact: e.target.value })}
                className={`w-full px-3.5 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-800 text-xs font-mono ${
                  errors.sportsInchargeContact ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-slate-300 dark:border-slate-700'
                }`}
                placeholder="10 अंकों का मोबाइल नंबर"
              />
              {errors.sportsInchargeContact && <p className="text-[10px] text-red-500 font-bold mt-1">{errors.sportsInchargeContact}</p>}
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">विद्यालय ई-मेल आईडी</label>
              <input
                type="email"
                value={schoolDetails.schoolEmail}
                onChange={e => setSchoolDetails({ ...schoolDetails, schoolEmail: e.target.value })}
                className={`w-full px-3.5 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-800 text-xs font-mono ${
                  errors.schoolEmail ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-slate-300 dark:border-slate-700'
                }`}
                placeholder="school@rajasthan.gov.in"
              />
              {errors.schoolEmail && <p className="text-[10px] text-red-500 font-bold mt-1">{errors.schoolEmail}</p>}
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">शैक्षणिक सत्र (Academic Session)</label>
              <input
                type="text"
                value={schoolDetails.session}
                onChange={e => setSchoolDetails({ ...schoolDetails, session: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium"
                placeholder="जैसे 2026-27"
              />
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 mt-6">
            <div></div>
            <button
              type="button"
              onClick={() => {
                if (validateForm()) {
                  setCurrentStep(2);
                } else {
                  alert(lang === 'hi' ? 'कृपया लाल रंग में चिह्नित त्रुटियों को सुधारें।' : 'Please fix the highlighted errors.');
                }
              }}
              className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
            >
              <span>{lang === 'hi' ? 'आगे बढ़ें (कक्षावार विवरण)' : 'Next (Class Details)'}</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: CLASS WISE STUDENT COUNTS */}
      {currentStep === 2 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 space-y-4 no-print">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Table className="w-5 h-5 text-emerald-600" />
              <span>{lang === 'hi' ? '२. कक्षावार छात्र संख्या विवरण (कक्षा ६वीं से १२वीं)' : '2. Class-wise Student Counts (6th to 12th)'}</span>
            </h3>
            <span className="text-xs text-slate-500 font-medium">Step 2 of 5</span>
          </div>

          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 rounded-xl border border-emerald-200/50 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 font-medium space-y-1">
            <p className="font-bold">💸 <strong>क्रीड़ा शुल्क नियम दरें:</strong></p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
              <div className="bg-white dark:bg-slate-900/80 p-2 rounded-lg border border-emerald-200 dark:border-emerald-800">
                सामान्य वर्ग (General): <strong className="text-emerald-700 dark:text-emerald-400">₹ {generalRate} प्रति छात्र</strong>
              </div>
              <div className="bg-white dark:bg-slate-900/80 p-2 rounded-lg border border-emerald-200 dark:border-emerald-800">
                आरक्षित वर्ग (Reserved - SC/ST/OBC/MBC/EWS): <strong className="text-emerald-700 dark:text-emerald-400">₹ {reservedRate} प्रति छात्र</strong>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-xs font-sans">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 text-[11px] font-black uppercase text-center border-b border-slate-200 dark:border-slate-800">
                  <th className="p-2.5 text-left">कक्षा (Class)</th>
                  <th className="p-2.5">सामान्य वर्ग (Gen @ ₹{generalRate})</th>
                  <th className="p-2.5">आरक्षित वर्ग (Res @ ₹{reservedRate})</th>
                  <th className="p-2.5 bg-slate-150 dark:bg-slate-850">कुल छात्र</th>
                  <th className="p-2.5 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300 font-bold">कुल शुल्क (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {classDetails.map((item, idx) => {
                  const rowTotalCount = item.generalCount + item.reservedCount;
                  const rowTotalFee = (item.generalCount * generalRate) + (item.reservedCount * reservedRate);
                  return (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-850/50 text-center font-medium">
                      <td className="p-2.5 text-left font-black text-slate-900 dark:text-slate-100">{item.classLabelHi} ({item.className})</td>
                      <td className="p-2.5">
                        <input
                          type="number"
                          min={0}
                          value={item.generalCount === 0 ? '' : item.generalCount}
                          onChange={e => handleClassCountChange(idx, 'generalCount', e.target.value)}
                          className="w-24 mx-auto text-center px-2 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono font-bold focus:ring-2 focus:ring-emerald-500"
                          placeholder="0"
                        />
                      </td>
                      <td className="p-2.5">
                        <input
                          type="number"
                          min={0}
                          value={item.reservedCount === 0 ? '' : item.reservedCount}
                          onChange={e => handleClassCountChange(idx, 'reservedCount', e.target.value)}
                          className="w-24 mx-auto text-center px-2 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono font-bold focus:ring-2 focus:ring-emerald-500"
                          placeholder="0"
                        />
                      </td>
                      <td className="p-2.5 bg-slate-150 dark:bg-slate-850 font-mono font-black text-slate-950 dark:text-white">
                        {rowTotalCount}
                      </td>
                      <td className="p-2.5 bg-emerald-50 dark:bg-emerald-950/10 font-mono font-black text-emerald-700 dark:text-emerald-400">
                        ₹ {rowTotalFee}
                      </td>
                    </tr>
                  );
                })}
                <tr className="bg-slate-100 dark:bg-slate-800/60 font-black text-center border-t border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100">
                  <td className="p-2.5 text-left">कुल योग (Total)</td>
                  <td className="p-2.5 font-mono text-xs text-emerald-700 dark:text-emerald-400">{totalGeneralStudents} छात्र (₹ {totalGeneralFee})</td>
                  <td className="p-2.5 font-mono text-xs text-emerald-700 dark:text-emerald-400">{totalReservedStudents} छात्र (₹ {totalReservedFee})</td>
                  <td className="p-2.5 font-mono bg-slate-200 dark:bg-slate-800 text-slate-950 dark:text-white text-xs">{totalStudents} छात्र</td>
                  <td className="p-2.5 font-mono bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 text-sm">
                    ₹ {grandTotalFee}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 mt-6">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <span>{lang === 'hi' ? 'पिछला चरण' : 'Previous Step'}</span>
            </button>

            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
            >
              <span>{lang === 'hi' ? 'आगे बढ़ें (बैंक विवरण)' : 'Next (Bank Details)'}</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: BANK & DD DETAILS */}
      {currentStep === 3 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 space-y-4 no-print">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-blue-600" />
              <span>{lang === 'hi' ? '३. बैंक / डी.डी. / चेक भुगतान विवरण' : '3. Bank / D.D. / Cheque Payment Details'}</span>
            </h3>
            <span className="text-xs text-slate-500 font-medium">Step 3 of 5</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">बैंक का नाम</label>
              <input
                type="text"
                value={bankDetails.bankName}
                onChange={e => setBankDetails({ ...bankDetails, bankName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium"
                placeholder="उदा. भारतीय स्टेट बैंक (SBI)"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">बैंक शाखा (Branch Name)</label>
              <input
                type="text"
                value={bankDetails.branchName}
                onChange={e => setBankDetails({ ...bankDetails, branchName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium"
                placeholder="शाखा का नाम लिखें"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">डी.डी. / चेक क्रमांक</label>
              <input
                type="text"
                value={bankDetails.ddChequeNo}
                onChange={e => setBankDetails({ ...bankDetails, ddChequeNo: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono font-bold"
                placeholder="क्रमांक दर्ज करें"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">डी.डी./चेक जारी दिनांक</label>
              <input
                type="date"
                value={bankDetails.ddDate}
                onChange={e => setBankDetails({ ...bankDetails, ddDate: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">कुल प्रेषित राशि (₹)</label>
              <input
                type="number"
                readOnly
                value={bankDetails.ddAmount}
                className="w-full px-3.5 py-2.5 rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300 font-mono font-black text-sm"
              />
              <span className="text-[10px] text-slate-500 font-medium">Class-wise table se auto calculate</span>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">प्रपत्र जारी करने की तिथि</label>
              <input
                type="date"
                value={formDate}
                onChange={e => setFormDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">राशि शब्दों में (हिंदी में)</label>
              <input
                type="text"
                value={bankDetails.ddAmountWords}
                onChange={e => setBankDetails({ ...bankDetails, ddAmountWords: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium"
                placeholder="राशि शब्दों में लिखें"
              />
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 mt-6">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <span>{lang === 'hi' ? 'पिछला चरण' : 'Previous Step'}</span>
            </button>

            <button
              type="button"
              onClick={() => setCurrentStep(4)}
              className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
            >
              <span>{lang === 'hi' ? 'आगे बढ़ें (कार्यालय विवरण)' : 'Next (Office Details)'}</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: OFFICE USE DETAILS */}
      {currentStep === 4 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 space-y-4 no-print">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-purple-600" />
              <span>{lang === 'hi' ? '४. संग्रहण केंद्र कार्यालय उपयोग हेतु (Office Use Only)' : '4. Office Use Details'}</span>
            </h3>
            <span className="text-xs text-slate-500 font-medium">Step 4 of 5</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">शुल्क प्राप्ति दिनांक</label>
              <input
                type="date"
                value={officeDetails.receiptDate}
                onChange={e => setOfficeDetails({ ...officeDetails, receiptDate: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">संग्रहण केंद्र पर प्राप्त राशि (₹)</label>
              <input
                type="number"
                value={officeDetails.receivedAmount === 0 ? '' : officeDetails.receivedAmount}
                onChange={e => setOfficeDetails({ ...officeDetails, receivedAmount: parseFloat(e.target.value) || 0 })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono font-bold"
                placeholder="प्राप्त राशि"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">रसीद विवरण / संख्या</label>
              <input
                type="text"
                value={officeDetails.receiptDetails}
                onChange={e => setOfficeDetails({ ...officeDetails, receiptDetails: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium"
                placeholder="उदा. रसीद संख्या 4521"
              />
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 mt-6">
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <span>{lang === 'hi' ? 'पिछला चरण' : 'Previous Step'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (validateForm()) {
                  setCurrentStep(5);
                } else {
                  alert(lang === 'hi' ? 'कृपया फॉर्म में आवश्यक विवरण भरें।' : 'Please fill all required form details.');
                }
              }}
              className="px-6 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-600 text-white text-xs font-black flex items-center gap-1.5 shadow-lg transition-all cursor-pointer"
            >
              <span>{lang === 'hi' ? 'प्रपत्र पूर्वावलोकन देखें' : 'View Preview'}</span>
              <Sparkles className="w-4 h-4 text-amber-300" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: PREVIEW FORM LAYOUT */}
      {currentStep === 5 && (
        <div className="space-y-4">
          {/* Universal Single Top Action Bar */}
          <div className="action-bar-top bg-slate-100 dark:bg-slate-800 p-3.5 rounded-2xl flex flex-wrap items-center justify-between gap-2 no-print border border-slate-200 dark:border-slate-700">
            {/* 1. Toggle Switcher: Maker vs Preview */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentStep(1)}
                className="px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-black flex items-center space-x-1.5 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-800 shadow-sm transition-all"
              >
                <span>{lang === 'hi' ? 'प्रपत्र प्रविष्टि (Maker)' : 'Form Maker'}</span>
              </button>
              <button
                onClick={() => setCurrentStep(5)}
                className="px-4 py-2 rounded-xl bg-indigo-700 text-white text-xs font-black flex items-center space-x-1.5 shadow-sm transition-all"
              >
                <span>{lang === 'hi' ? 'पूर्वावलोकन (Preview)' : 'Preview Mode'}</span>
              </button>
            </div>

            {/* 2. Download PDF / Print & 3. Share Image */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => requestAction('print')}
                className="px-3.5 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-white text-xs font-black flex items-center space-x-1.5 transition-all cursor-pointer"
                title={lang === 'hi' ? 'डायरेक्ट प्रिंट करें' : 'Print Directly'}
              >
                <Printer className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>{lang === 'hi' ? 'प्रिंट करें' : 'Print'}</span>
              </button>

              <button
                onClick={handleShare}
                className="px-3.5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black flex items-center space-x-1.5 shadow-sm transition-all cursor-pointer"
                title={lang === 'hi' ? 'छवि शेयर करें' : 'Share Image'}
              >
                <Share2 className="w-4 h-4" />
                <span>{lang === 'hi' ? 'शेयर' : 'Share'}</span>
              </button>

              <button
                onClick={() => requestAction('pdf')}
                className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-black flex items-center space-x-1.5 shadow-md transition-all cursor-pointer"
                title={lang === 'hi' ? 'मुद्रित करें / Download PDF' : 'Print / Download PDF'}
              >
                <Download className="w-4 h-4" />
                <span>{lang === 'hi' ? 'मुद्रित करें / Download PDF' : 'Print / Download PDF'}</span>
              </button>
            </div>
          </div>

          {/* Core high-fidelity preview box matching physical layout exactly */}
          <div className="bg-slate-50 dark:bg-slate-950 p-4 sm:p-8 rounded-2xl flex justify-center overflow-x-auto">
            <div
              id="kridaShulkPreview"
              ref={previewRef}
              className="bg-white text-black p-8 border-2 border-slate-300 shadow-md font-sans w-[210mm] min-h-[295mm] relative space-y-5 print:p-0 print:border-0 print:shadow-none print:space-y-1.5"
              style={{ contentVisibility: 'auto' }}
            >
              {/* Document Header */}
              <div className="text-center space-y-1">
                <h1 className="text-xl font-bold tracking-wider text-black border-b-2 border-black pb-1.5 inline-block px-4">
                  क्रीड़ा शुल्क विवरण प्रपत्र
                </h1>
                <div className="text-sm font-bold pt-1">
                  सत्र - <span className="underline decoration-dotted decoration-2 px-6 font-mono font-bold text-base">{schoolDetails.session}</span>
                </div>
              </div>

              {/* School Info Box (Table style matching reference image) */}
              <div className="border border-black overflow-hidden text-[13px] leading-relaxed print:text-[11px] print:leading-normal">
                <div className="grid grid-cols-12 border-b border-black">
                  <div className="col-span-3 bg-slate-50 font-bold p-2 print:p-1 border-r border-black">विद्यालय का नाम व पता -</div>
                  <div className="col-span-9 p-2 print:p-1 font-bold uppercase">{schoolDetails.schoolName}</div>
                </div>

                <div className="grid grid-cols-12 border-b border-black">
                  <div className="col-span-3 bg-slate-50 font-bold p-2 print:p-1 border-r border-black">विद्यालय का डाईस कोड -</div>
                  <div className="col-span-4 p-2 print:p-1 font-bold font-mono text-sm tracking-widest border-r border-black">{schoolDetails.udiseCode}</div>
                  <div className="col-span-2 bg-slate-50 font-bold p-2 print:p-1 border-r border-black">तहसील -</div>
                  <div className="col-span-3 p-2 print:p-1 font-bold">{schoolDetails.tehsil}</div>
                </div>

                <div className="grid grid-cols-12 border-b border-black">
                  <div className="col-span-3 bg-slate-50 font-bold p-2 print:p-1 border-r border-black">संस्थाप्रमुख का नाम एवं संपर्क न. -</div>
                  <div className="col-span-9 p-2 print:p-1 font-bold">{schoolDetails.principalName} <span className="font-mono text-sm ml-2 print:text-xs">({schoolDetails.principalContact})</span></div>
                </div>

                <div className="grid grid-cols-12 border-b border-black">
                  <div className="col-span-3 bg-slate-50 font-bold p-2 print:p-1 border-r border-black">विद्यालय की ई-मेल आईडी -</div>
                  <div className="col-span-9 p-2 print:p-1 font-bold font-mono text-xs">{schoolDetails.schoolEmail}</div>
                </div>

                <div className="grid grid-cols-12">
                  <div className="col-span-3 bg-slate-50 font-bold p-2 print:p-1 border-r border-black">शारीरिक शिक्षक / खेलकूद प्रभारी का नाम एवं संपर्क न. -</div>
                  <div className="col-span-9 p-2 print:p-1 font-bold">{schoolDetails.sportsInchargeName} <span className="font-mono text-sm ml-2 print:text-xs">({schoolDetails.sportsInchargeContact})</span></div>
                </div>
              </div>

              {/* Fee Breakdown Table (100% Matching image layout) */}
              <div className="border border-black overflow-hidden text-[12px]">
                <table className="w-full border-collapse">
                  <thead>
                    {/* Header Row 1 */}
                    <tr className="border-b border-black bg-slate-50 font-bold text-center">
                      <th className="border-r border-black p-2 w-[12%] text-[13px]" rowSpan={2}>कक्षा</th>
                      <th className="border-r border-black p-1 text-[13px]" colSpan={2}>क्रीड़ा शुल्क विवरण</th>
                      <th className="border-r border-black p-1 text-[13px]" colSpan={2}>क्रीड़ा शुल्क विवरण</th>
                      <th className="border-r border-black p-1 text-[13px] w-[15%]" rowSpan={2}>कुल विद्यार्थियों की संख्या</th>
                      <th className="p-1 text-[13px] w-[20%]" rowSpan={2}>क्रीड़ा शुल्क की कुल राशि</th>
                    </tr>
                    {/* Header Row 2 */}
                    <tr className="border-b border-black bg-slate-50 font-bold text-center">
                      {/* General subgroup */}
                      <th className="border-r border-black p-1 font-semibold w-[18%]">सामान्य वर्ग<br/>
                        <span className="font-normal text-[10px] text-slate-700">विद्यार्थियों की संख्या</span>
                      </th>
                      <th className="border-r border-black p-1 font-semibold w-[15%]">क्रीड़ा शुल्क राशि @ रु. {generalRate} प्रति</th>
                      {/* Reserved subgroup */}
                      <th className="border-r border-black p-1 font-semibold w-[18%]">आरक्षित वर्ग (ओ.बी.सी. / एस.टी. / एस.सी.)<br/>
                        <span className="font-normal text-[10px] text-slate-700">विद्यार्थियों की संख्या</span>
                      </th>
                      <th className="border-r border-black p-1 font-semibold w-[15%]">क्रीड़ा शुल्क राशि @ रु. {reservedRate} प्रति</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black font-bold">
                    {classDetails.map((item, idx) => {
                      const rowTotalCount = item.generalCount + item.reservedCount;
                      const rowTotalFee = (item.generalCount * generalRate) + (item.reservedCount * reservedRate);
                      return (
                        <tr key={idx} className="text-center font-semibold h-8 hover:bg-slate-50/50">
                          <td className="border-r border-black p-1.5 text-center font-bold bg-slate-50">{item.classLabelHi}</td>
                          <td className="border-r border-black p-1.5 font-mono text-sm">{item.generalCount || '-'}</td>
                          <td className="border-r border-black p-1.5 font-mono text-sm">{item.generalCount ? `₹ ${item.generalCount * generalRate}` : '-'}</td>
                          <td className="border-r border-black p-1.5 font-mono text-sm">{item.reservedCount || '-'}</td>
                          <td className="border-r border-black p-1.5 font-mono text-sm">{item.reservedCount ? `₹ ${item.reservedCount * reservedRate}` : '-'}</td>
                          <td className="border-r border-black p-1.5 font-mono text-sm bg-slate-50/30">{rowTotalCount || '-'}</td>
                          <td className="p-1.5 font-mono text-sm bg-slate-50/30">₹ {rowTotalFee || '-'}</td>
                        </tr>
                      );
                    })}

                    {/* Grand Total Row */}
                    <tr className="bg-slate-100 font-bold text-center border-t border-black h-9 text-[13px]">
                      <td className="border-r border-black p-1.5 bg-slate-200">कुल राशि</td>
                      <td className="border-r border-black p-1.5 font-mono text-black">{totalGeneralStudents}</td>
                      <td className="border-r border-black p-1.5 font-mono text-emerald-800">₹ {totalGeneralFee}</td>
                      <td className="border-r border-black p-1.5 font-mono text-black">{totalReservedStudents}</td>
                      <td className="border-r border-black p-1.5 font-mono text-emerald-800">₹ {totalReservedFee}</td>
                      <td className="border-r border-black p-1.5 font-mono bg-slate-200 text-black">{totalStudents}</td>
                      <td className="p-1.5 font-mono bg-emerald-100 text-emerald-900 text-sm">₹ {grandTotalFee}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Bank Payment Info Box */}
              <div className="space-y-1.5">
                <div className="text-center font-bold text-sm print:text-xs">बैंक / डी.डी. / चेक का विवरण</div>
                <div className="border border-black overflow-hidden text-[12.5px] leading-relaxed font-bold print:text-[11px] print:leading-normal">
                  <div className="grid grid-cols-12 border-b border-black">
                    <div className="col-span-3 bg-slate-50 p-2 print:p-1 border-r border-black">बैंक का नाम -</div>
                    <div className="col-span-5 p-2 print:p-1 border-r border-black">{bankDetails.bankName || '...........................................'}</div>
                    <div className="col-span-1 bg-slate-50 p-2 print:p-1 border-r border-black">शाखा -</div>
                    <div className="col-span-3 p-2 print:p-1">{bankDetails.branchName || '...........................................'}</div>
                  </div>

                  <div className="grid grid-cols-12 border-b border-black">
                    <div className="col-span-4 bg-slate-50 p-2 print:p-1 border-r border-black">डी.डी./चेक का क्रमांक -</div>
                    <div className="col-span-3 p-2 print:p-1 border-r border-black font-mono">{bankDetails.ddChequeNo || '...........................................'}</div>
                    <div className="col-span-1 bg-slate-50 p-2 print:p-1 border-r border-black">दिनांक -</div>
                    <div className="col-span-4 p-2 print:p-1 font-mono">{bankDetails.ddDate ? new Date(bankDetails.ddDate).toLocaleDateString('hi-IN') : '...........................................'}</div>
                  </div>

                  <div className="grid grid-cols-12">
                    <div className="col-span-2 bg-slate-50 p-2 print:p-1 border-r border-black">राशि -</div>
                    <div className="col-span-3 p-2 print:p-1 border-r border-black font-mono text-emerald-800 text-sm print:text-xs">₹ {bankDetails.ddAmount || '................'}</div>
                    <div className="col-span-2 bg-slate-50 p-2 print:p-1 border-r border-black">(शब्दों में) -</div>
                    <div className="col-span-5 p-2 print:p-1 text-slate-800 text-xs italic">{bankDetails.ddAmountWords || '......................................................................'}</div>
                  </div>
                </div>
              </div>

              {/* Date & Signatures Lines */}
              <div className="pt-8 print:pt-4 flex items-center justify-between text-[13px] font-bold print:text-xs">
                <div>
                  दिनांक - <span className="underline decoration-dotted decoration-2 px-4 font-mono">{formDate ? new Date(formDate).toLocaleDateString('hi-IN') : '...................'}</span>
                </div>
                <div className="text-right space-y-1">
                  <div>संस्थाप्रमुख के हस्ताक्षर मय मोहर</div>
                  <div className="text-[10px] text-slate-400 font-normal">Principal Signature & Stamp</div>
                </div>
              </div>

              {/* Office Use Section (Bottom box matching image) */}
              <div className="pt-3 print:pt-1">
                <div className="border border-black overflow-hidden text-[12.5px] leading-relaxed font-bold print:text-[11px] print:leading-normal">
                  <div className="bg-slate-100 p-1.5 print:p-1 text-center border-b border-black text-sm print:text-xs">
                    संग्रहण केंद्र कार्यालय उपयोग हेतु
                  </div>
                  
                  <div className="grid grid-cols-12 border-b border-black">
                    <div className="col-span-4 bg-slate-50 p-2 print:p-1 border-r border-black">क्रीड़ा शुल्क प्राप्ति की दिनांक -</div>
                    <div className="col-span-3 p-2 print:p-1 border-r border-black font-mono">
                      {officeDetails.receiptDate ? new Date(officeDetails.receiptDate).toLocaleDateString('hi-IN') : '...................................'}
                    </div>
                    <div className="col-span-2 bg-slate-50 p-2 print:p-1 border-r border-black">प्राप्त राशि -</div>
                    <div className="col-span-3 p-2 print:p-1 font-mono text-emerald-800">
                      {officeDetails.receivedAmount ? `₹ ${officeDetails.receivedAmount}` : '...................................'}
                    </div>
                  </div>

                  <div className="grid grid-cols-12">
                    <div className="col-span-3 bg-slate-50 p-2 print:p-1 border-r border-black">रसीद का विवरण -</div>
                    <div className="col-span-9 p-2 print:p-1">
                      {officeDetails.receiptDetails || '.........................................................................................................'}
                    </div>
                  </div>
                </div>

                <div className="pt-6 print:pt-3 flex justify-end text-[13px] font-bold print:text-xs">
                  <div className="text-right space-y-1">
                    <div>क्रीड़ा शुल्क संग्रहण प्रभारी के हस्ताक्षर</div>
                    <div className="text-[10px] text-slate-400 font-normal">Sports Fee Collection Incharge Signature</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog Modal Before Triggering Print/Download */}
      {showConfirmDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn no-print">
          <div className="bg-white dark:bg-slate-900 border-2 border-emerald-500/50 dark:border-emerald-500/30 rounded-3xl shadow-2xl max-w-lg w-full p-5 sm:p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    {lang === 'hi' ? 'विवरण समीक्षा व सत्यापन' : 'Data Review & Confirmation'}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {lang === 'hi' 
                      ? 'PDF/प्रिंट प्रक्रिया शुरू करने से पहले डेटा की जांच करें' 
                      : 'Please verify all details before triggering print/PDF generation'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer font-black text-sm"
              >
                ✕
              </button>
            </div>

            {/* Summary Review Card */}
            <div className="space-y-2 bg-slate-50 dark:bg-slate-950/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300">
              <div className="font-extrabold text-slate-900 dark:text-white text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
                <School className="w-4 h-4" />
                <span>{lang === 'hi' ? 'सत्यापित की जाने वाली मुख्य प्रविष्टियाँ:' : 'Summary of Entered Details:'}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-semibold">{lang === 'hi' ? 'विद्यालय का नाम' : 'School Name'}</span>
                  <span className="font-bold text-slate-900 dark:text-white truncate block">{schoolDetails.schoolName || '—'}</span>
                </div>
                <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-semibold">{lang === 'hi' ? 'यू-डायस कोड' : 'UDISE Code'}</span>
                  <span className="font-bold font-mono text-emerald-700 dark:text-emerald-400 block">{schoolDetails.udiseCode || '—'}</span>
                </div>
                <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-semibold">{lang === 'hi' ? 'संस्थाप्रमुख' : 'Principal Name'}</span>
                  <span className="font-bold text-slate-900 dark:text-white block">{schoolDetails.principalName || '—'} ({schoolDetails.principalContact || '—'})</span>
                </div>
                <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-semibold">{lang === 'hi' ? 'खेलकूद प्रभारी' : 'Sports Incharge'}</span>
                  <span className="font-bold text-slate-900 dark:text-white block">{schoolDetails.sportsInchargeName || '—'} ({schoolDetails.sportsInchargeContact || '—'})</span>
                </div>
                <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-semibold">{lang === 'hi' ? 'कुल छात्र संख्या' : 'Total Students'}</span>
                  <span className="font-bold font-mono text-slate-900 dark:text-white block">{totalStudents} छात्र (सामान्य: {totalGeneralStudents}, आरक्षित: {totalReservedStudents})</span>
                </div>
                <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-semibold">{lang === 'hi' ? 'कुल क्रीड़ा शुल्क राशि' : 'Total Sports Fee'}</span>
                  <span className="font-black font-mono text-emerald-800 dark:text-emerald-300 text-sm block">₹ {grandTotalFee}</span>
                </div>
              </div>

              {bankDetails.bankName && (
                <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 mt-2">
                  <span className="text-[10px] text-slate-400 block font-semibold">{lang === 'hi' ? 'डी.डी. / बैंक विवरण' : 'Bank / DD Details'}</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 block">
                    {bankDetails.bankName} - डी.डी. क्र: <span className="font-mono text-emerald-700">{bankDetails.ddChequeNo || '—'}</span> (राशि: ₹ {bankDetails.ddAmount || grandTotalFee})
                  </span>
                </div>
              )}
            </div>

            {/* Review Checkbox Prompt */}
            <label className="flex items-start space-x-3 p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800/60 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={userConfirmedReview}
                onChange={(e) => setUserConfirmedReview(e.target.checked)}
                className="mt-1 w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer accent-emerald-600"
              />
              <span className="text-xs text-amber-900 dark:text-amber-200 font-bold leading-snug">
                {lang === 'hi' 
                  ? 'मैंने प्रपत्र में दर्ज विद्यालय नाम, छात्र संख्या, शुल्क दर व बैंक विवरण की पूर्ण जांच कर ली है।' 
                  : 'I have verified that school details, student counts, fee rates, and bank information are correct.'}
              </span>
            </label>

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
              >
                {lang === 'hi' ? 'संशोधन करें / वापस जाएं' : 'Review & Edit Data'}
              </button>
              <button
                onClick={handleExecuteAction}
                disabled={!userConfirmedReview}
                className={`px-5 py-2.5 rounded-xl text-xs font-black flex items-center space-x-2 shadow-md transition-all cursor-pointer ${
                  userConfirmedReview
                    ? 'bg-emerald-700 hover:bg-emerald-600 text-white active:scale-95'
                    : 'bg-slate-300 dark:bg-slate-800 text-slate-500 dark:text-slate-500 cursor-not-allowed opacity-70'
                }`}
              >
                <Printer className="w-4 h-4" />
                <span>
                  {pendingAction === 'print' 
                    ? (lang === 'hi' ? 'पुष्टि करें एवं प्रिंट करें' : 'Confirm & Print') 
                    : pendingAction === 'pdf' 
                    ? (lang === 'hi' ? 'पुष्टि करें एवं PDF डाउनलोड करें' : 'Confirm & Download PDF') 
                    : (lang === 'hi' ? 'पुष्टि करें एवं डाउनलोड करें' : 'Confirm & Download')}
                </span>
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
