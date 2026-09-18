import { Language } from '../types';

export const TRANSLATIONS: Record<string, { en: string; hi: string }> = {
  // App Title & Taglines
  appTitle: { en: "Shala Sahayak", hi: "शाला सहायक" },
  appSubtitle: { en: "Rajasthan Education Department PWA", hi: "राजस्थान शिक्षा विभाग डिजिटल सहायक" },
  
  // Tabs
  tabDashboard: { en: "Dashboard & Shivira", hi: "डैशबोर्ड व शिविरा" },
  tabPeeoTools: { en: "PEEO & Principal Tools", hi: "पीईईओ व प्रधानाचार्य टूल" },
  tabTeacherTools: { en: "Teacher & Class Tools", hi: "शिक्षक व कक्षा टूल" },
  tabInchargeTools: { en: "Functional Incharge Modules", hi: "प्रभारी मॉड्यूल व बोर्ड परीक्षा" },
  tabQuickAccess: { en: "Portals & Utilities", hi: "पोर्टल व त्वरित उपयोग" },

  // Profile
  schoolProfile: { en: "School & PEEO Profile", hi: "विद्यालय व पीईईओ विवरण" },
  udiseCode: { en: "UDISE Code", hi: "यू-डाइस कोड" },
  nicCode: { en: "NIC / School Code", hi: "एनआईसी स्कूल कोड" },
  ddoCode: { en: "DDO Code", hi: "डीडीओ कोड" },
  principalName: { en: "Principal / PEEO Name", hi: "प्रधानाचार्य / पीईईओ नाम" },
  district: { en: "District", hi: "जिला" },
  block: { en: "Block", hi: "ब्लॉक" },
  editProfile: { en: "Edit Profile", hi: "प्रोफाइल संपादित करें" },

  // Buttons
  save: { en: "Save", hi: "सुरक्षित करें" },
  cancel: { en: "Cancel", hi: "रद्द करें" },
  exportPdf: { en: "Download PDF", hi: "पीडीएफ डाउनलोड करें" },
  exportCsv: { en: "Export CSV", hi: "सीएसवी डाउनलोड करें" },
  shareWhatsApp: { en: "Share on WhatsApp", hi: "व्हाट्सएप पर शेयर करें" },
  copyText: { en: "Copy Text", hi: "कॉपी करें" },
  addTeacher: { en: "Add Teacher", hi: "शिक्षक जोड़ें" },
  addStudent: { en: "Add Student", hi: "छात्र जोड़ें" },
  generateOrder: { en: "Generate Order", hi: "आदेश तैयार करें" },

  // Section Headers
  incrementMakerTitle: { en: "1. Annual Increment Order Maker (वार्षिक वेतन वृद्धि आदेश)", hi: "1. वार्षिक वेतन वृद्धि आदेश निर्माण" },
  timeTableTitle: { en: "2. School Time-Table Generator", hi: "2. विद्यालय समय-सारणी जनरेटर" },
  inchargeMappingTitle: { en: "3. Incharge Mapping Order Draft", hi: "3. प्रभारी मैपिंग कार्यालय आदेश" },
  dailySubstitutionTitle: { en: "4. Daily Adjustment / Substitution", hi: "4. दैनिक व्यवस्था / स्थानापन्न रजिस्टर" },
  aparIprTitle: { en: "5. APAR & IPR Status Tracker", hi: "5. एपीएआर व अचल संपत्ति (IPR) ट्रैकर" },
  eventNoticeTitle: { en: "6. Event Invitation & Notice Generator", hi: "6. कार्यक्रम आमंत्रण व सूचना पत्र" },
  physicalVerificationTitle: { en: "7. Physical Verification (Bhautik Satyapan) Report", hi: "7. भौतिक सत्यापन रिपोर्ट जनरेटर" },

  // Section B
  marksheetTitle: { en: "Student Marksheet & Result Card Generator", hi: "छात्र परिणाम व अंकतालिका जनरेटर" },
  anomalyTitle: { en: "Aadhaar / APAAR / Jan Aadhaar Anomaly Reporter", hi: "आधार/जन आधार/APAAR विसंगति रिपोर्टर" },
  ictStockTitle: { en: "ICT Lab & IT Equipment Register", hi: "आईसीटी लैब व उपकरण स्टॉक रजिस्टर" },
  libraryTitle: { en: "Library Book Catalogue & Issue Register", hi: "पुस्तकालय पुस्तक इश्यू व कैटलॉग" },

  // Section C
  mdmTitle: { en: "Mid-Day Meal (MDM) Daily Calculator & Grain Register", hi: "मिड-डे मील (MDM) गणना व खाद्यान्न रजिस्टर" },
  transportTitle: { en: "Transport Voucher Student Mapping", hi: "ट्रांसपोर्ट वाउचर छात्र मैपिंग" },
  ladoTitle: { en: "Lado / Balika Hygiene & Empowerment Log", hi: "लाडो / बालिका स्वास्थ्य व संबल लॉग" },
  scholarshipTitle: { en: "Scholarship Pre/Post-Matric Scheme Tracker", hi: "छात्रवृत्ति योजना व सत्यापन चेकलिस्ट" },
  elcTitle: { en: "Electoral Literacy Club (ELC) Activity Log", hi: "इलेक्टोरल लिटरेसी क्लब (ELC) गतिविधि लॉग" },
  examToolsTitle: { en: "Exam Incharge Tools & Seating Matrix", hi: "परीक्षा प्रभारी टूल व सिटिंग अरेंजमेंट" },
  imageResizerTitle: { en: "Rajasthan Board (RBSE) Image Resizer & Compressor", hi: "आरबीएसई फोटो व हस्ताक्षर कंप्रेसर/रिसाइज़र" },
  remunerationTitle: { en: "Board Exam Remuneration Bill Generator", hi: "बोर्ड परीक्षा पारिश्रमिक बिल जनरेटर" },

  // Offline & Privacy
  offlineStatus: { en: "Offline Ready (Local Storage)", hi: "ऑफलाइन तैयार (लोकल स्टोरेज)" },
  privacyNote: { en: "100% Privacy Compliant: All data stays locally on your phone.", hi: "100% गोपनीयता: संपूर्ण डेटा आपके डिवाइस पर ही सुरक्षित रहता है।" }
};

export function t(key: string, lang: Language): string {
  const entry = TRANSLATIONS[key];
  if (!entry) return key;
  return entry[lang] || entry.en || key;
}
