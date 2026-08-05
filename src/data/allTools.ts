export interface AppTool {
  id: string;
  category: 'teacher' | 'incharge' | 'peeo' | 'portals';
  subtab: string;
  title: string;
  titleHindi: string;
  description: string;
  descriptionHindi: string;
  iconName: 'GraduationCap' | 'ShieldAlert' | 'Monitor' | 'BookOpen' | 'FileText' | 'Image' | 'Utensils' | 'Layers' | 'Bus' | 'Award' | 'TrendingUp' | 'Calendar' | 'Users' | 'Clock' | 'Send' | 'FileCheck' | 'ExternalLink' | 'Calculator';
  colorBg: string;
}

export const ALL_TOOLS: AppTool[] = [
  // Teacher Tools
  {
    id: 'teacher-classteacher',
    category: 'teacher',
    subtab: 'classTeacher',
    title: 'Class Teacher Module',
    titleHindi: 'कक्षा अध्यापक टूलकिट',
    description: 'Class teacher result feed, Aadhaar verification & marksheets',
    descriptionHindi: 'कक्षा अध्यापक परिणाम फीड, आधार/अपार सत्यापन एवं मार्कशीट जनरेटर',
    iconName: 'GraduationCap',
    colorBg: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
  },
  {
    id: 'teacher-subjectteacher',
    category: 'teacher',
    subtab: 'subjectTeacher',
    title: 'Subject Teacher',
    titleHindi: 'विषय अध्यापक',
    description: 'Subject marks entry & curriculum progress tracker',
    descriptionHindi: 'विषयवार अंक प्रविष्टि एवं पाठ्यक्रम स्थिति',
    iconName: 'FileText',
    colorBg: 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
  },
  {
    id: 'teacher-diary',
    category: 'teacher',
    subtab: 'diary',
    title: "Daily Teacher's Diary",
    titleHindi: 'दैनिक शिक्षक दैनन्दिनी (डायरी)',
    description: 'Log daily classroom teaching, CCEA activity, homework & attendance remarks',
    descriptionHindi: 'दैनिक शिक्षण कार्य, गृहकार्य, बाल सभा व उपस्थिति टिप्पणी इन्द्राज एवं प्रिंटप्रपत्र',
    iconName: 'BookOpen',
    colorBg: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
  },
  {
    id: 'teacher-library',
    category: 'teacher',
    subtab: 'librarian',
    title: 'Librarian Register',
    titleHindi: 'पुस्तकालय अध्यक्ष',
    description: 'Search accession register & track student/teacher issued books',
    descriptionHindi: 'पुस्तकालय कैटलॉग व पुस्तक इश्यू-रिटर्न ट्रैकर',
    iconName: 'BookOpen',
    colorBg: 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300'
  },
  {
    id: 'teacher-pti',
    category: 'teacher',
    subtab: 'pti',
    title: 'PTI Physical Education',
    titleHindi: 'शारीरिक शिक्षक (PTI)',
    description: 'Physical fitness BMI index, sports goods & PT grades',
    descriptionHindi: 'स्वास्थ्य इंडेक्स (BMI), खेलकूद उपकरण व ग्रेडिंग',
    iconName: 'Award',
    colorBg: 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
  },
  {
    id: 'teacher-ict',
    category: 'teacher',
    subtab: 'computer',
    title: 'Computer Teacher ICT Lab',
    titleHindi: 'कंप्यूटर शिक्षक (ICT)',
    description: 'Manage computers, Smart TVs & ICT lab equipment log',
    descriptionHindi: 'कंप्यूटर, स्मार्ट टीवी व आईसीटी लैब स्टॉक रजिस्टर',
    iconName: 'Monitor',
    colorBg: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300'
  },
  {
    id: 'teacher-marksheet',
    category: 'teacher',
    subtab: 'marksheet',
    title: 'Marksheet Generator',
    titleHindi: 'अंकतालिका जनरेटर',
    description: 'Generate & download student report cards in official PDF format',
    descriptionHindi: 'छात्र अंकतालिका एवं रिपोर्ट कार्ड पीडीएफ जनरेटर',
    iconName: 'GraduationCap',
    colorBg: 'bg-teal-100 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300'
  },
  {
    id: 'teacher-anomaly',
    category: 'teacher',
    subtab: 'anomaly',
    title: 'Aadhaar Mismatch',
    titleHindi: 'आधार/जनआधार विसंगति',
    description: 'Track student Aadhaar, Jan-Aadhaar & APAAR ID mismatches',
    descriptionHindi: 'आधार, जन-आधार व अपार आईडी विसंगति समाधान ट्रैकर',
    iconName: 'ShieldAlert',
    colorBg: 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
  },

  // Incharge Tools
  {
    id: 'incharge-remuneration',
    category: 'incharge',
    subtab: 'remuneration',
    title: 'Remuneration Bill',
    titleHindi: 'मानदेय प्रपत्र-89',
    description: 'RBSE Board Exam remuneration bill generator (Form-89)',
    descriptionHindi: 'बोर्ड परीक्षा मानदेय प्रपत्र-89 ऑटो बिल जनरेटर',
    iconName: 'FileText',
    colorBg: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
  },
  {
    id: 'incharge-resizer',
    category: 'incharge',
    subtab: 'resizer',
    title: 'RBSE Photo Resizer',
    titleHindi: 'फोटो/साइन रिसाइज़र',
    description: 'Compress photo (20-50KB) & signature (10-20KB) for board portal',
    descriptionHindi: 'बोर्ड फॉर्म हेतु फोटो व साइन आकार रिसाइज़र एवं कंप्रेसर',
    iconName: 'Image',
    colorBg: 'bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300'
  },
  {
    id: 'incharge-mdm',
    category: 'incharge',
    subtab: 'mdm',
    title: 'Mid-Day Meal (MDM)',
    titleHindi: 'मिड-डे मील (MDM)',
    description: 'Auto-calculate daily wheat/rice consumption & cooking cost',
    descriptionHindi: 'दैनिक खाद्यान्न (गेहूँ/चावल) व कुकिंग कॉस्ट ऑटो कैलकुलेटर',
    iconName: 'Utensils',
    colorBg: 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
  },
  {
    id: 'incharge-exam',
    category: 'incharge',
    subtab: 'exam',
    title: 'Exam Incharge',
    titleHindi: 'परीक्षा प्रभारी (Exam Incharge)',
    description: 'Seating Matrix, Exam Schedule, Remuneration Bill, Photo/Signature Resizer & Evaluation Tools',
    descriptionHindi: 'परीक्षा बैठक व्यवस्था, समय-सारणी, मानदेय बिल, फोटो/साइन रिसाइज़र एवं मूल्यांकन टूल',
    iconName: 'Layers',
    colorBg: 'bg-teal-100 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300'
  },
  {
    id: 'incharge-transport',
    category: 'incharge',
    subtab: 'transport',
    title: 'Transport Voucher',
    titleHindi: 'ट्रांसपोर्ट वाउचर',
    description: 'Distance-wise eligible student list for DBT voucher module',
    descriptionHindi: 'दूरी श्रेणी अनुसार विद्यार्थी मैपिंग व वाउचर स्टेटस',
    iconName: 'Bus',
    colorBg: 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300'
  },
  {
    id: 'incharge-scholarship',
    category: 'incharge',
    subtab: 'scholarship',
    title: 'Scholarship Tracker',
    titleHindi: 'छात्रवृत्ति ट्रैकर',
    description: 'Pre/Post matric scholarship application status & verification',
    descriptionHindi: 'छात्रवृत्ति आवेदन सत्यापन एवं छात्र स्थिति ट्रैकर',
    iconName: 'Award',
    colorBg: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300'
  },
  {
    id: 'incharge-assembly',
    category: 'incharge',
    subtab: 'assembly',
    title: 'Prarthana Prabhari Modules',
    titleHindi: 'प्रार्थना सभा प्रभारी (Assembly)',
    description: 'School assembly prayers, daily GK, motivational stories, news and yoga',
    descriptionHindi: 'दैनिक प्रार्थना, सामान्य ज्ञान प्रश्नोत्तरी, प्रेरक प्रसंग, समाचार सुर्खियां एवं योगाभ्यास',
    iconName: 'BookOpen',
    colorBg: 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
  },

  // PEEO Tools
  {
    id: 'peeo-increment',
    category: 'peeo',
    subtab: 'increment',
    title: 'Annual Increment',
    titleHindi: 'वार्षिक वेतन वृद्धि',
    description: '7th Pay matrix auto 3% increment calculation & PDF order draft',
    descriptionHindi: 'ऑटो 3% वेतन वृद्धि गणना एवं पीडीएफ आदेश पत्र जनरेटर',
    iconName: 'TrendingUp',
    colorBg: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
  },
  {
    id: 'peeo-timetable',
    category: 'peeo',
    subtab: 'timetable',
    title: 'Time Table',
    titleHindi: 'समय-सारणी',
    description: 'Generate automatic 8-period teacher & class schedule',
    descriptionHindi: 'कक्षावार व शिक्षकवार समय-सारणी जनरेटर',
    iconName: 'Calendar',
    colorBg: 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
  },
  {
    id: 'peeo-incharge',
    category: 'peeo',
    subtab: 'incharge',
    title: 'Incharge Mapping',
    titleHindi: 'प्रभारी मैपिंग',
    description: 'Assign school scheme incharges & generate official office orders',
    descriptionHindi: 'विद्यालय योजना प्रभार आवंटन एवं कार्यालय आदेश',
    iconName: 'Users',
    colorBg: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300'
  },
  {
    id: 'peeo-substitution',
    category: 'peeo',
    subtab: 'substitution',
    title: 'Daily Substitutes',
    titleHindi: 'दैनिक स्थानापन्न',
    description: 'Arrange free teachers for absent staff periods',
    descriptionHindi: 'दैनिक अनुपस्थित शिक्षक कालांश स्थानापन्न रजिस्टर',
    iconName: 'Clock',
    colorBg: 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300'
  },
  {
    id: 'peeo-apar',
    category: 'peeo',
    subtab: 'apar',
    title: 'APAR & IPR Tracker',
    titleHindi: 'APAR व IPR ट्रैकर',
    description: 'RajKaj portal APAR & IPR filing status monitoring',
    descriptionHindi: 'राजकाज पोर्टल APAR व संपत्ति विवरण फाइलिंग स्टेटस',
    iconName: 'Award',
    colorBg: 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
  },
  {
    id: 'peeo-pramanikaran',
    category: 'peeo',
    subtab: 'pramanikaran',
    title: 'Verification Reports Engine',
    titleHindi: 'प्रमाणीकरण रिपोर्ट हब',
    description: 'Aadhaar, Jan Aadhaar, APAR & APAAR ID progress tracker',
    descriptionHindi: 'आधार, जन-आधार, APAR व अपार आईडी प्रमाणीकरण रिपोर्ट',
    iconName: 'FileCheck',
    colorBg: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
  },
  {
    id: 'incharge-qrcode',
    category: 'incharge',
    subtab: 'qrcode',
    title: 'QR Code Generator',
    titleHindi: 'QR कोड जनरेटर (परिपत्र व नोटिस)',
    description: 'Generate & download QR codes with Hindi labels for school circulars & notices',
    descriptionHindi: 'विद्यालय परिपत्रों, सूचनाओं व लिंक्स हेतु क्यूआर कोड जनरेटर (हिंदी लेबल सपोर्ट)',
    iconName: 'Image',
    colorBg: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300'
  },
  {
    id: 'peeo-satyapan',
    category: 'peeo',
    subtab: 'satyapan',
    title: 'Verification Checklist',
    titleHindi: 'दस्तावेज़ सत्यापन',
    description: 'Annual physical stock & furniture verification register',
    descriptionHindi: 'वार्षिक स्टॉक व भौतिक संपत्ति सत्यापन रिपोर्ट',
    iconName: 'FileCheck',
    colorBg: 'bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300'
  },

  // Portals & Calculators
  {
    id: 'portals-links',
    category: 'portals',
    subtab: 'portals',
    title: 'Gov Education Links',
    titleHindi: 'शाला दर्पण व पे-मैनेजर',
    description: 'Direct links to Shala Darpan, PayManager, SSO & Board portals',
    descriptionHindi: 'शाला दर्पण, पे-मैनेजर, एसएसपी व बोर्ड पोर्टल डायरेक्ट लिंक्स',
    iconName: 'ExternalLink',
    colorBg: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
  },
  {
    id: 'portals-calculator',
    category: 'portals',
    subtab: 'calculator',
    title: '7th Salary Calculator',
    titleHindi: '7th Pay वेतन कैलकुलेटर',
    description: '7th CPC basic pay, DA, HRA, NPS/GPF salary calculator',
    descriptionHindi: '7वें वेतनमान अनुसार बेसिक, महंगाई भत्ता व कुल वेतन कैलकुलेटर',
    iconName: 'Calculator',
    colorBg: 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
  },
  {
    id: 'portals-formats',
    category: 'portals',
    subtab: 'formats',
    title: 'Official Formats',
    titleHindi: 'विभागीय प्रपत्र (Formats)',
    description: 'Download official application formats, leave forms & checklists',
    descriptionHindi: 'विभागीय आवेदन प्रपत्र, अवकाश प्रार्थना पत्र व चेकलिस्ट्स',
    iconName: 'FileText',
    colorBg: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300'
  }
];

export const DEFAULT_PINNED_TOOL_IDS: string[] = [];
