export interface ShiviraTask {
  date: string;
  title: string;
}

export interface ShiviraMonth {
  monthName: string;
  monthNameHindi: string;
  year: number;
  workingDays: number;
  holidaysCount?: number;
  specialWorkingDaysCount?: number;
  specialDaysCount?: number;
  startDayOfWeek?: number; // 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
  totalDaysInMonth?: number;
  highlightDates?: number[];
  holidaysDetailed?: ShiviraTask[];
  departmentalTasksDetailed?: ShiviraTask[];
  holidays: string[];
  deadlines: { date: string; title: string; titleHindi: string; isUrgent?: boolean }[];
  saturdayThemes: { date: string; weekNo: number; theme: string; themeHindi: string }[];
  keyHighlights: string[];
  keyHighlightsHindi: string[];
}

export const SHIVIRA_CALENDAR_DATA: ShiviraMonth[] = [
  {
    monthName: "July",
    monthNameHindi: "जुलाई",
    year: 2026,
    workingDays: 25,
    holidaysCount: 4,
    specialWorkingDaysCount: 6,
    specialDaysCount: 2,
    startDayOfWeek: 3, // Wednesday
    totalDaysInMonth: 31,
    highlightDates: [1, 17],
    holidaysDetailed: [
      { date: "01 जुलाई", title: "सत्रारंभ व प्रवेशोत्सव अभियान प्रथम चरण" },
      { date: "17 जुलाई", title: "ताजिया / मुहर्रम (अवकाश)" },
      { date: "26 जुलाई", title: "कारगिल विजय दिवस (उत्सव)" }
    ],
    departmentalTasksDetailed: [
      { date: "01 जुलाई", title: "वार्षिक वेतन वृद्धि स्वीकृति आदेश एवं निशुल्क पाठ्यपुस्तक वितरण" },
      { date: "10 जुलाई", title: "शाला दर्पण कार्मिक विवरण सत्यापन एवं पदस्थापन मैपिंग" },
      { date: "20 जुलाई", title: "विद्यालय समय सारणी एवं कालांश आवंटन अंतिम रूप देना" },
      { date: "31 जुलाई", title: "अचल संपत्ति विवरण (IPR) व एपीएआर अंतिम प्रविष्टि" }
    ],
    holidays: ["17 जुलाई - मुहर्रम", "26 जुलाई - रविवार"],
    deadlines: [
      { date: "01 जुलाई", title: "Annual Increment Sanction Orders Generation", titleHindi: "वार्षिक वेतन वृद्धि स्वीकृति आदेश जारी करना", isUrgent: true },
      { date: "10 जुलाई", title: "Shala Darpan Staff Data Verification", titleHindi: "शाला दर्पण कार्मिक विवरण सत्यापन", isUrgent: false },
      { date: "20 जुलाई", title: "School Time-Table Finalization", titleHindi: "विद्यालय समय सारणी एवं कालांश आवंटन अंतिम रूप देना", isUrgent: false },
      { date: "31 जुलाई", title: "IPR & APAR Final Submission Deadline", titleHindi: "अचल संपत्ति विवरण (IPR) व एपीएआर अंतिम प्रविष्टि", isUrgent: true }
    ],
    saturdayThemes: [
      { date: "04 जुलाई", weekNo: 1, theme: "Know Your Rajasthan", themeHindi: "राजस्थान को जानो (राजस्थान का इतिहास व संस्कृति)" },
      { date: "11 जुलाई", weekNo: 2, theme: "Language Skill & Public Speaking", themeHindi: "भाषा कौशल एवं अभिव्यक्ति विकास" },
      { date: "18 जुलाई", weekNo: 3, theme: "Science & STEM Exploration", themeHindi: "खेलते-खेलते सीखो / विज्ञान एवं गणित खोज" },
      { date: "25 जुलाई", weekNo: 4, theme: "Cultural Heritage & Folk Arts", themeHindi: "सांस्कृतिक व लोक कला संरक्षण" }
    ],
    keyHighlights: [
      "Re-opening of schools post summer vacation & Enrollment Campaign (प्रवेशोत्सव)",
      "Distribution of Free Textbooks & Uniforms to eligible students",
      "Formation of School Management Committee (SMC/SDMC) & Incharge Mapping"
    ],
    keyHighlightsHindi: [
      "ग्रीष्मावकाश के पश्चात विद्यालय पुनरारंभ एवं नव-नामांकन प्रवेशोत्सव अभियान",
      "पात्र छात्र-छात्राओं को निःशुल्क पाठ्यपुस्तक एवं गणवेश (यूनिफॉर्म) वितरण",
      "एसएमसी/एसडीएमसी पुनर्गठन एवं विभिन्न विभागीय प्रभारियों का दायित्व आवंटन"
    ]
  },
  {
    monthName: "August",
    monthNameHindi: "अगस्त",
    year: 2026,
    workingDays: 23,
    holidaysCount: 4,
    specialWorkingDaysCount: 7,
    specialDaysCount: 3,
    startDayOfWeek: 6, // Saturday (1 August 2026 is Saturday)
    totalDaysInMonth: 31,
    highlightDates: [15],
    holidaysDetailed: [
      { date: "05 अगस्त", title: "स्वर्ण-बुलहुट मस्तक दिवस (उत्सव)" },
      { date: "09 अगस्त", title: "विश्व आदिवासी दिवस (अवकाश)" },
      { date: "15 अगस्त", title: "स्वतंत्रता दिवस (अवकाश-उत्सव)" },
      { date: "17 से 19 अगस्त", title: "द्वितीय परख" },
      { date: "20 अगस्त", title: "सद्भावना दिवस / राजीव गांधी जयंती" }
    ],
    departmentalTasksDetailed: [
      { date: "08 अगस्त", title: "कृषि मुवित दिवस-समस्त विद्यार्थियों को डिफॉर्मिंग दवा (एल्बेंडाजोल) खिलवाना / सामुदायिक बाल सभा विद्यालय स्तर पर ।" },
      { date: "13 अगस्त", title: "वीर दुर्गादास राठौड़ जयंती(उत्सव)" },
      { date: "15 अगस्त", title: "मतदाता शपथ कक्षा 9, 10, 11 व 12 (भारत निर्वाचन आयोग द्वारा निर्धारित शपथ(हिन्दी / English)" },
      { date: "20 व 21 अगस्त", title: "43 वीं जिला स्तरीय (सब जूनियर) नेहरू हॉकी प्रतियोगिता का आयोजन" },
      { date: "22 अगस्त", title: "रोल प्ले एवं लोक नृत्य प्रतियोगिता विद्यालय स्तर पर (RSCERT)" },
      { date: "24 व 25 अगस्त", title: "तहसील स्तरीय शिक्षक क्रीडा एवं सांस्कृतिक प्रतियोगिता पुरुष व महिला" },
      { date: "25 अगस्त से पूर्व", title: "विद्यालयी खेलकूद प्रतियोगिताएं (प्रथम / द्वितीय / तृतीय समूह)" },
      { date: "26 अगस्त", title: "बाराथफाल(अवकाश)" },
      { date: "27 अगस्त", title: "रक्षा सूत्र बंधन दिवस(रक्षा बंधन से पूर्व कार्य दिवस पर) (उत्सव)" },
      { date: "27 से 29 अगस्त", title: "43 वीं राज्य स्तरीय (सब जूनियर) नेहरू हॉकी प्रतियोगिता का आयोजन" },
      { date: "28 अगस्त", title: "रक्षा बंधन(अवकाश) / संस्कृत दिवस(उत्सव)" },
      { date: "29 अगस्त", title: "खेल दिवस (मेजर ध्यान चन्द जयंती)" },
      { date: "30 अगस्त से 03 सितम्बर", title: "जिला स्तरीय विद्यालयी खेलकूद प्रतियोगिताओं का आयोजन (प्रथम चरण / समूह) आयु वर्ग 14 / 17 / 19 वर्ष (छात्र-छात्रा) हेतु (अधिकतम 05 दिन)" }
    ],
    holidays: ["09 अगस्त - विश्व आदिवासी दिवस", "15 अगस्त - स्वतंत्रता दिवस (राष्ट्रीय पर्व)", "28 अगस्त - रक्षाबंधन"],
    deadlines: [
      { date: "15 अगस्त", title: "Independence Day Celebration & PTM", titleHindi: "स्वतंत्रता दिवस समारोह एवं शिक्षक-अभिभावक बैठक (PTM)", isUrgent: true },
      { date: "25 अगस्त", title: "Pre-Matric Scholarship Data Entry on Shala Darpan", titleHindi: "पूर्व-मैट्रिक छात्रवृत्ति ऑनलाइन आवेदन प्रविष्टि", isUrgent: false },
      { date: "31 अगस्त", title: "First Periodic Test (SA-1/1st Assessment)", titleHindi: "प्रथम परख मूल्यांकन (कक्षा 1 से 12)", isUrgent: true }
    ],
    saturdayThemes: [
      { date: "01 अगस्त", weekNo: 1, theme: "Know Your Rajasthan", themeHindi: "राजस्थान को जानो (भौगोलिक परिचय)" },
      { date: "08 अगस्त", weekNo: 2, theme: "Language Skills", themeHindi: "भाषा कौशल विकास एवं निबंध लेखन" },
      { date: "15 अगस्त", weekNo: 3, theme: "Patriotic & Independence Special", themeHindi: "देशभक्ति व स्वतंत्रता दिवस विशेष प्रस्तुतियां" },
      { date: "22 अगस्त", weekNo: 4, theme: "Environment & Tree Plantation (एक पेड़ माँ के नाम)", themeHindi: "पर्यावरण संवर्द्धन व 'एक पेड़ माँ के नाम' सघन पौधरोपण" },
      { date: "29 अगस्त", weekNo: 5, theme: "National Sports Day Activities", themeHindi: "राष्ट्रीय खेल दिवस व पारंपरिक खेलकूद स्पर्द्धाएँ" }
    ],
    keyHighlights: [
      "Independence Day Flag Hoisting & Cultural Programme",
      "First Assessment (1st Test) for classes 1 to 12",
      "Sanitary Napkin & Hygiene Awareness Drive under Lado Scheme"
    ],
    keyHighlightsHindi: [
      "स्वतंत्रता दिवस ध्वजारोहण, परेड व सांस्कृतिक समारोह का गरिमामय आयोजन",
      "समस्त कक्षाओं हेतु प्रथम मूल्यांकन (फर्स्ट टेस्ट) व अंक प्रविष्टि",
      "लाडो सुरक्षा योजनांतर्गत किशोरी स्वास्थ्य, स्वच्छता व आत्मरक्षा प्रशिक्षण"
    ]
  },
  {
    monthName: "September",
    monthNameHindi: "सितंबर",
    year: 2026,
    workingDays: 24,
    holidays: ["05 सितंबर - शिक्षक दिवस", "16 सितंबर - ईद-उल-मिलाद", "25 सितंबर - रामदेव जयंती व तेजा दशमी"],
    deadlines: [
      { date: "05 सितंबर", title: "Teacher's Day Ceremony & Felicitation", titleHindi: "राज्य स्तरीय एवं जिला स्तरीय शिक्षक सम्मान समारोह", isUrgent: false },
      { date: "15 सितंबर", title: "Interschool Sports Tournament Registration", titleHindi: "विद्यालयी खेलकूद प्रतियोगिता ब्लॉक स्तरीय पंजीयन", isUrgent: false },
      { date: "30 सितंबर", title: "Shala Darpan Enrolment & Physical Verification Audit", titleHindi: "शाला दर्पण भौतिक नामांकन सत्यापन एवं इंफ्रास्ट्रक्चर ऑडिट", isUrgent: true }
    ],
    saturdayThemes: [
      { date: "05 सितंबर", weekNo: 1, theme: "Teacher Appreciation & Ethics", themeHindi: "शिक्षक सम्मान व गुरु निष्ठा दिवस" },
      { date: "12 सितंबर", weekNo: 2, theme: "Literacy & Chess Competition", themeHindi: "अंतरराष्ट्रीय साक्षरता दिवस व शतरंज प्रतियोगिता" },
      { date: "19 सितंबर", weekNo: 3, theme: "Science Exhibition & Mathematics Quiz", themeHindi: "विज्ञान प्रदर्शनी, मॉडल निर्माण व गणित क्विज" },
      { date: "26 सितंबर", weekNo: 4, theme: "Electoral Literacy Club (ELC) Voter Pledge", themeHindi: "इलेक्टोरल लिटरेसी क्लब - भावी मतदाता जागरूकता एवं शपथ" }
    ],
    keyHighlights: [
      "District & Block Level School Sports Competitions",
      "Gargi Puraskar & Balika Protsahan Verification",
      "Mid-Day Meal Social Audit Phase-I"
    ],
    keyHighlightsHindi: [
      "ब्लॉक व जिला स्तरीय 67वीं विद्यालयी खेलकूद प्रतियोगिताओं का संचालन",
      "गार्गी पुरस्कार एवं बालिका प्रोत्साहन हेतु पात्र छात्राओं के आवेदनों का सत्यापन",
      "मिड-डे मील योजनांतर्गत प्रथम चरण का सामाजिक अंकेक्षण (Social Audit)"
    ]
  },
  {
    monthName: "October",
    monthNameHindi: "अक्टूबर",
    year: 2026,
    workingDays: 16,
    holidays: ["02 अक्टूबर - महात्मा गांधी जयंती व शास्त्री जयंती", "20 अक्टूबर से 31 अक्टूबर - दीपावली मध्यावधि अवकाश"],
    deadlines: [
      { date: "10 अक्टूबर", title: "Second Assessment (2nd Test) Completion", titleHindi: "द्वितीय परख मूल्यांकन (2nd Test) संपादन व अंक प्रविष्टि", isUrgent: true },
      { date: "18 अक्टूबर", title: "Parent-Teacher Meeting (Pre-Diwali PTM)", titleHindi: "दीपावली पूर्व विशाल शिक्षक-अभिभावक बैठक (PTM)", isUrgent: false },
      { date: "19 अक्टूबर", title: "RBSE Board Exam Online Form Submission Starts", titleHindi: "आरबीएसई बोर्ड परीक्षा (10वीं व 12वीं) ऑनलाइन फॉर्म प्रारंभ", isUrgent: true }
    ],
    saturdayThemes: [
      { date: "03 अक्टूबर", weekNo: 1, theme: "Gandhian Values & Swachhata Campaign", themeHindi: "गांधीवादी विचार, अहिंसा व स्वच्छता ही सेवा पखवाड़ा" },
      { date: "10 अक्टूबर", weekNo: 2, theme: "Mental Health & Yoga Session", themeHindi: "विश्व मानसिक स्वास्थ्य दिवस व दैनिक योगाभ्यास" },
      { date: "17 अक्टूबर", weekNo: 3, theme: "Diwali Creative Crafts & Eco-Crackers Awareness", themeHindi: "दीपावली सजावट, हस्तकला व ग्रीन-पटाखा पर्यावरण जागरूकता" }
    ],
    keyHighlights: [
      "Mid-Term Exams Preparation & Diwali Vacation (12 Days)",
      "Gandhi Jayanti Peace March & Cleanliness Drive",
      "RBSE Class 10th & 12th Board Exam Form Auto-Filler Checks"
    ],
    keyHighlightsHindi: [
      "अर्द्धवार्षिक परीक्षा पूर्व पाठ्यक्रम पुनरावृत्ति एवं दीपावली मध्यावधि अवकाश",
      "गांधी जयंती पर सर्वधर्म प्रार्थना सभा व स्वच्छता अभियान",
      "बोर्ड परीक्षा कक्षा 10वीं व 12वीं के ऑनलाइन परीक्षा आवेदनों का सत्यापन"
    ]
  },
  {
    monthName: "November",
    monthNameHindi: "नवंबर",
    year: 2026,
    workingDays: 24,
    holidays: ["01 नवंबर - गोवर्धन पूजा", "02 नवंबर - भाई दूज", "24 नवंबर - गुरु नानक जयंती"],
    deadlines: [
      { date: "05 नवंबर", title: "Post-Diwali School Reopening & Student Attendance Audit", titleHindi: "दीपावली अवकाश पश्चात नियमित अध्यापन एवं उपस्थिति समीक्षा", isUrgent: false },
      { date: "15 नवंबर", title: "Board Exam Fee Challan Deposit Deadline", titleHindi: "आरबीएसई बोर्ड परीक्षा शुल्क चालान नोडल बैंक में जमा कराना", isUrgent: true },
      { date: "30 नवंबर", title: "Half-Yearly Exam Time Table Publication", titleHindi: "जिला समान परीक्षा (समान परीक्षा योजना) टाइम-टेबल जारी", isUrgent: true }
    ],
    saturdayThemes: [
      { date: "07 नवंबर", weekNo: 1, theme: "C.V. Raman Science Day & Research", themeHindi: "सर सी.वी. रमन जयंती व विज्ञान प्रयोग प्रदर्शन" },
      { date: "14 नवंबर", weekNo: 2, theme: "Children's Day & Joyful Learning", themeHindi: "बाल दिवस, बाल मेला एवं आनंददायक अधिगम गतिविधियां" },
      { date: "21 नवंबर", weekNo: 3, theme: "Constitution Values & Fundamental Rights", themeHindi: "संवैधानिक मूल्य, मौलिक अधिकार व नागरिक कर्तव्य" },
      { date: "28 नवंबर", weekNo: 4, theme: "Career Guidance & Vocational Skills", themeHindi: "कैरियर मार्गदर्शन, वोकेशनल शिक्षा व एक्सपोजर विजिट" }
    ],
    keyHighlights: [
      "Children's Day Fete & Bal Mela in Schools",
      "Preparation for District Level Half-Yearly Examinations",
      "State Level Science Fair Nominations"
    ],
    keyHighlightsHindi: [
      "14 नवंबर बाल दिवस पर बाल मेले एवं सांस्कृतिक खेलकूद उत्सव का आयोजन",
      "जिला समान परीक्षा योजनांतर्गत अर्द्धवार्षिक परीक्षा प्रश्नपत्र व उत्तरपुस्तिका व्यवस्था",
      "राज्य स्तरीय विज्ञान मेला एवं इन्स्पायर अवॉर्ड नामांकन प्रक्रिया"
    ]
  },
  {
    monthName: "December",
    monthNameHindi: "दिसंबर",
    year: 2026,
    workingDays: 18,
    holidays: ["25 दिसंबर से 31 दिसंबर - शीतकालीन अवकाश (Winter Break)"],
    deadlines: [
      { date: "12 दिसंबर", title: "Half-Yearly Examinations (अर्द्धवार्षिक परीक्षा)", titleHindi: "अर्द्धवार्षिक परीक्षा (Half-Yearly Exams) का आयोजन", isUrgent: true },
      { date: "24 दिसंबर", title: "Half-Yearly Result Upload on Shala Darpan", titleHindi: "अर्द्धवार्षिक अंक प्रविष्टि शाला दर्पण पोर्टल पर पूर्ण करना", isUrgent: true }
    ],
    saturdayThemes: [
      { date: "05 दिसंबर", weekNo: 1, theme: "Road Safety & First Aid Training", themeHindi: "सड़क सुरक्षा, ट्रैफिक नियम व प्राथमिक चिकित्सा प्रशिक्षण" },
      { date: "19 दिसंबर", weekNo: 3, theme: "Career Counselling & STEM Lab Demos", themeHindi: "कैरियर परामर्श, स्टेम लैब व तकनीकी उपकरणों का प्रदर्शन" }
    ],
    keyHighlights: [
      "Statewide Half-Yearly Examinations for Classes 1 to 12",
      "Winter Vacation starts 25th December",
      "Annual Stock Register Verification Review"
    ],
    keyHighlightsHindi: [
      "कक्षा 1 से 12 तक संपूर्ण प्रदेश में समान अर्द्धवार्षिक परीक्षा का संचालन",
      "25 से 31 दिसंबर तक 7 दिवसीय शीतकालीन अवकाश",
      "वार्षिक स्टॉक एवं भौतिक संपत्तियों का भौतिक सत्यापन समीक्षा"
    ]
  },
  {
    monthName: "January",
    monthNameHindi: "जनवरी",
    year: 2027,
    workingDays: 23,
    holidays: ["01 जनवरी - नव वर्ष अवकाश", "14 जनवरी - मकर संक्रांति", "26 जनवरी - गणतंत्र दिवस (राष्ट्रीय पर्व)"],
    deadlines: [
      { date: "10 जनवरी", title: "RBSE Board Practical Exam Centers Mapping", titleHindi: "12वीं बोर्ड प्रायोगिक परीक्षा केंद्र व परीक्षक मैपिंग", isUrgent: true },
      { date: "20 जनवरी", title: "Class 5th & 8th Board Exam Application Form Deadline", titleHindi: "कक्षा 5वीं व 8वीं बोर्ड परीक्षा आवेदन पत्र अंतिम तिथि", isUrgent: true },
      { date: "26 जनवरी", title: "Republic Day Flag Hoisting & Student Awards", titleHindi: "गणतंत्र दिवस ध्वजारोहण व प्रतिभाशाली छात्र सम्मान", isUrgent: false }
    ],
    saturdayThemes: [
      { date: "02 जनवरी", weekNo: 1, theme: "New Year Goals & Academic Resolution", themeHindi: "नव वर्ष संकल्प, अकादमिक लक्ष्य व समय प्रबंधन" },
      { date: "09 जनवरी", weekNo: 2, theme: "Swami Vivekananda Youth Inspiration", themeHindi: "स्वामी विवेकानंद जयंती व राष्ट्रीय युवा दिवस प्रेरणा" },
      { date: "16 जनवरी", weekNo: 3, theme: "Sankranti Traditional Games & Kite Safety", themeHindi: "पारंपरिक खेलकूद व पर्यावरण अनुकूल पतंगबाजी सुरक्षा" },
      { date: "23 जनवरी", weekNo: 4, theme: "Netaji Subhash Chandra Bose Parakram Diwas", themeHindi: "नेताजी सुभाष चंद्र बोस पराक्रम दिवस व शौर्य गाथा" },
      { date: "30 जनवरी", weekNo: 5, theme: "Martyrs' Day Silence & Anti-Tobacco Pledge", themeHindi: "शहीद दिवस 2 मिनट मौन व तंबाकू निषेध शपथ" }
    ],
    keyHighlights: [
      "Republic Day Celebrations & Merit Distribution",
      "Class 12th Board Practical Examinations Conduct",
      "Class 5 & 8 Board Online Application Verification"
    ],
    keyHighlightsHindi: [
      "26 जनवरी गणतंत्र दिवस समारोह, सांस्कृतिक प्रस्तुतियां एवं भामाशाह सम्मान",
      "कक्षा 12वीं बोर्ड प्रायोगिक परीक्षाओं (Practical Exams) का सुचारू संपादन",
      "कक्षा 5वीं एवं 8वीं बोर्ड परीक्षा हेतु शाला दर्पण पर प्रविष्टियों की जांच"
    ]
  },
  {
    monthName: "February",
    monthNameHindi: "फरवरी",
    year: 2027,
    workingDays: 22,
    holidays: ["16 फरवरी - महाशिवरात्रि"],
    deadlines: [
      { date: "05 फरवरी", title: "Class 10th & 12th Board Admit Cards Download", titleHindi: "माध्यमिक व उच्च माध्यमिक बोर्ड परीक्षा रोल नंबर व प्रवेश पत्र वितरण", isUrgent: true },
      { date: "15 फरवरी", title: "Third Periodic Test (3rd Test) Completion", titleHindi: "तृतीय परख मूल्यांकन (3rd Test) संपादन व प्रविष्टि", isUrgent: true },
      { date: "28 फरवरी", title: "National Science Day Fair & Model Exhibition", titleHindi: "राष्ट्रीय विज्ञान दिवस प्रदर्शनी एवं सीवी रमन स्मृति सत्र", isUrgent: false }
    ],
    saturdayThemes: [
      { date: "06 फरवरी", weekNo: 1, theme: "Exam Stress Management & Pariksha Pe Charcha", themeHindi: "परीक्षा तनाव प्रबंधन, 'परीक्षा पे चर्चा' व योग" },
      { date: "13 फरवरी", weekNo: 2, theme: "Sarojini Naidu Women Empowerment & Poetry", themeHindi: "सरोजिनी नायडू जयंती, महिला सशक्तिकरण व काव्य पाठ" },
      { date: "20 फरवरी", weekNo: 3, theme: "Matribhasha Diwas (Mother Tongue Pride)", themeHindi: "अंतरराष्ट्रीय मातृभाषा दिवस व राजस्थानी भाषा साहित्य" },
      { date: "27 फरवरी", weekNo: 4, theme: "National Science Day Models & Quiz", themeHindi: "राष्ट्रीय विज्ञान दिवस विशेष - नवाचार व मॉडल प्रदर्शन" }
    ],
    keyHighlights: [
      "Commencement of RBSE Board Examinations 2027",
      "3rd Periodic Assessment for Local Classes",
      "Pre-Board Mock Tests for Class 10 & 12"
    ],
    keyHighlightsHindi: [
      "आरबीएसई बोर्ड मुख्य लिखित परीक्षाओं का राज्यव्यापी शुभारंभ",
      "स्थानीय कक्षाओं हेतु तृतीय परख मूल्यांकन एवं मॉडल पेपर अभ्यास",
      "बोर्ड परीक्षार्थियों हेतु प्री-बोर्ड मॉडल परीक्षा व विशेष उपचारात्मक शिक्षण"
    ]
  },
  {
    monthName: "March",
    monthNameHindi: "मार्च",
    year: 2027,
    workingDays: 24,
    holidays: ["23 मार्च - होली (धुलंडी)", "27 मार्च - गुड फ्राइडे", "30 मार्च - राजस्थान दिवस"],
    deadlines: [
      { date: "05 मार्च", title: "Class 5th & 8th Board Admit Cards Generation", titleHindi: "कक्षा 5वीं व 8वीं बोर्ड परीक्षा प्रवेश पत्र डाउनलोड", isUrgent: true },
      { date: "20 मार्च", title: "RBSE Class 10 & 12 Main Exam Center Monitoring", titleHindi: "10वीं व 12वीं बोर्ड उत्तरपुस्तिका सीलिंग व संग्रहण प्रेषण", isUrgent: true },
      { date: "30 मार्च", title: "Rajasthan Foundation Day School Celebrations", titleHindi: "राजस्थान स्थापना दिवस सांस्कृतिक कार्यक्रम व क्विज", isUrgent: false }
    ],
    saturdayThemes: [
      { date: "06 मार्च", weekNo: 1, theme: "International Women's Day Special", themeHindi: "अंतरराष्ट्रीय महिला दिवस व नारी शक्ति गौरव" },
      { date: "13 मार्च", weekNo: 2, theme: "Holi Eco-Colors & Water Conservation", themeHindi: "पर्यावरण अनुकूल प्राकृतिक होली व जल संरक्षण संदेश" },
      { date: "20 मार्च", weekNo: 3, theme: "World Forestry Day & Biodiversity", themeHindi: "विश्व वानिकी दिवस, जैव विविधता व पर्यावरण रक्षा" },
      { date: "27 मार्च", weekNo: 4, theme: "Rajasthan Heritage & Cultural Pride", themeHindi: "राजस्थान दिवस विशेष - हमारी अनूठी विरासत व शौर्य परंपरा" }
    ],
    keyHighlights: [
      "Class 5th & 8th Board Examinations Conduct",
      "Local Classes Syllabus Completion & Revision",
      "Rajasthan Diwas Grand School Exhibitions"
    ],
    keyHighlightsHindi: [
      "कक्षा 5वीं व 8वीं बोर्ड परीक्षाओं का राज्यभर में निष्पक्ष आयोजन",
      "स्थानीय कक्षाओं हेतु संपूर्ण पाठ्यक्रम पुनरावृत्ति एवं वार्षिक परीक्षा तैयारी",
      "30 मार्च राजस्थान दिवस पर निबंध, भाषण व लोक नृत्य प्रतियोगिताओं का आयोजन"
    ]
  },
  {
    monthName: "April",
    monthNameHindi: "अप्रैल",
    year: 2027,
    workingDays: 23,
    holidays: ["14 अप्रैल - डॉ. भीमराव अंबेडकर जयंती", "21 अप्रैल - महावीर जयंती"],
    deadlines: [
      { date: "10 अप्रैल", title: "Annual Examinations (वार्षिक परीक्षा 2027)", titleHindi: "स्थानीय कक्षाओं (1-4, 6, 7, 9, 11) की वार्षिक परीक्षा आयोजन", isUrgent: true },
      { date: "25 अप्रैल", title: "Answer Sheets Evaluation & Tabulation", titleHindi: "वार्षिक परीक्षा उत्तरपुस्तिका मूल्यांकन व ग्रीनलॉग प्रविष्टि", isUrgent: true },
      { date: "30 अप्रैल", title: "Annual Result Declaration & Marksheet Distribution", titleHindi: "वार्षिक परीक्षा परिणाम घोषणा, अंकतालिका वितरण व पीटीएम", isUrgent: true }
    ],
    saturdayThemes: [
      { date: "03 अप्रैल", weekNo: 1, theme: "Health & Physical Wellbeing", themeHindi: "विश्व स्वास्थ्य दिवस व शारीरिक तंदुरुस्ती" },
      { date: "10 अप्रैल", weekNo: 2, theme: "Ambedkar Ideology & Social Equality", themeHindi: "डॉ. बी.आर. अंबेडकर विचार व सामाजिक समरसता" },
      { date: "17 अप्रैल", weekNo: 3, theme: "World Earth Day & Climate Action", themeHindi: "विश्व पृथ्वी दिवस, प्लास्टिक निषेध व धरा संरक्षण" },
      { date: "24 अप्रैल", weekNo: 4, theme: "Panchayati Raj Day & Local Governance", themeHindi: "राष्ट्रीय पंचायती राज दिवस व ग्राम सभा में भागीदारी" }
    ],
    keyHighlights: [
      "Annual School Examinations for Non-Board Classes",
      "Statewide Annual Result Declaration Day (30th April)",
      "Promotion of Students & Issuance of Report Cards"
    ],
    keyHighlightsHindi: [
      "कक्षा 1 से 4, 6, 7, 9 एवं 11 की वार्षिक परीक्षाओं का सफलतापूर्वक संपादन",
      "30 अप्रैल को राज्यव्यापी वार्षिक परीक्षा परिणाम घोषणा एवं पीटीएम आयोजन",
      "सफल विद्यार्थियों का अगली कक्षा में प्रोन्नति एवं प्रगति-पत्र वितरण"
    ]
  },
  {
    monthName: "May",
    monthNameHindi: "मई",
    year: 2027,
    workingDays: 15,
    holidays: ["17 मई से 30 जून - ग्रीष्मावकाश (Summer Vacation)"],
    deadlines: [
      { date: "01 मई", title: "New Academic Session Provisional Admissions Start", titleHindi: "नवीन शैक्षणिक सत्र हेतु अंतरिम प्रवेश प्रक्रिया प्रारंभ", isUrgent: false },
      { date: "10 मई", title: "Shala Darpan Promotion & Transition Entry", titleHindi: "शाला दर्पण पर छात्र प्रोन्नति (Promotion) प्रविष्टि", isUrgent: true },
      { date: "16 मई", title: "Last Working Day Before Summer Break", titleHindi: "ग्रीष्मावकाश पूर्व अंतिम कार्य दिवस व स्टाफ मीटिंग", isUrgent: true }
    ],
    saturdayThemes: [
      { date: "01 मई", weekNo: 1, theme: "Labour Day & Respect for Work", themeHindi: "अंतरराष्ट्रीय मजदूर दिवस व श्रम की गरिमा" },
      { date: "08 मई", weekNo: 2, theme: "Red Cross & Humanitarian Service", themeHindi: "विश्व रेडक्रॉस दिवस व निस्वार्थ सेवा भाव" },
      { date: "15 मई", weekNo: 3, theme: "Summer Hobby Camp & Creative Arts", themeHindi: "ग्रीष्मकालीन हॉबी कैंप व सृजनात्मक कला अभ्यास" }
    ],
    keyHighlights: [
      "Start of New Academic Session Enrollment Drive",
      "Student Promotion on Shala Darpan Portal",
      "Commencement of Summer Break (17th May)"
    ],
    keyHighlightsHindi: [
      "नवीन सत्र 2027-28 हेतु प्रारंभिक नामांकन एवं पूर्व-प्रवेश ड्राइव",
      "शाला दर्पण पोर्टल पर समस्त उत्तीर्ण विद्यार्थियों की कक्षा प्रोन्नति प्रविष्टि",
      "17 मई से राज्य के समस्त विद्यालयों में ग्रीष्मावकाश प्रारंभ"
    ]
  }
];
