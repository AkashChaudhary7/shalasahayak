import { HelpGuide } from '../../types';

export const teacherGuides: HelpGuide[] = [
  {
    id: 'teacher-classteacher-guide',
    toolId: 'teacher-classteacher',
    categoryKey: 'teacher',
    categoryHi: 'शिक्षक संवर्ग',
    categoryEn: 'Teacher Modules',
    titleHi: 'कक्षा अध्यापक (Class Teacher) संपूर्ण टूलकिट, नामावली एवं परिणाम फीडिंग मार्गदर्शिका',
    titleEn: 'Class Teacher Complete Toolkit: Student Roll List, Profile & Result Entry Guide',
    readTime: '4 मिनट',
    updatedDate: '2026-08-15',
    iconName: 'GraduationCap',
    summaryHi: 'कक्षाध्यापक द्वारा विद्यार्थी नामावली संधारण, उपस्थिति टिप्पणी, आधार/अपार सत्यापन एवं अर्धवार्षिक/वार्षिक परीक्षा परिणाम तैयार करने की संपूर्ण गाइड।',
    summaryEn: 'Comprehensive guide for class teachers: student roster, attendance analysis, APAAR ID verification, and cumulative result preparation.',
    seoMeta: {
      titleTag: 'Class Teacher Toolkit Shala Darpan Rajasthan | Shala Sahayak',
      metaDescription: 'Complete Class Teacher toolkit for Rajasthan schools. Manage student roll lists, Aadhaar verification, report cards, and attendance registers easily!',
      h1Tag: 'कक्षा अध्यापक टूलकिट: राजस्थान शाला दर्पण संपूर्ण मार्गदर्शिका',
      slugUrl: '/teacher-classteacher-guide',
      imageAltText: 'Rajasthan Class Teacher Toolkit dashboard showing student roster, Aadhaar status, and test marks entry'
    },
    overviewHi: 'कक्षा अध्यापक विद्यालय की शैक्षणिक रीढ़ होते हैं। उन पर दैनिक उपस्थिति, छात्र प्रोफाइल अपडेशन, छात्रवृत्ति पात्रता, माता-पिता संपर्क, और परीक्षा परिणाम संकलन का प्रत्यक्ष दायित्व होता है। शाला सहायक टूल से कक्षा अध्यापक का घंटों का कार्य मिनटों में पूर्ण होता है।',
    overviewEn: 'Class teachers manage daily attendance, student profiling, scholarship eligibility, parent contacts, and cumulative report card preparation.',
    prerequisitesHi: [
      'कक्षा के नामांकित विद्यार्थियों की सूची (SR Number, Name)',
      'विद्यार्थियों का जन-आधार व आधार विवरण',
      'विगत परीक्षाओं के अंक एवं उपस्थिति प्रतिशत'
    ],
    prerequisitesEn: [
      'Class student roll list with SR numbers and names',
      'Student Jan-Aadhaar and Aadhaar cards',
      'Exam marks records and attendance percentages'
    ],
    keyBenefitsHi: [
      'रोल नंबर एवं एसआर नंबर अनुसार स्वतः क्रमबद्ध विद्यार्थी नामावली',
      'आधार व जन-आधार मिसमैच की तत्काल पहचान',
      'अंकतालिका व ग्रीन शीट (Green Sheet) का एक-क्लिक में निर्माण'
    ],
    keyBenefitsEn: [
      'Automatic alphabetical and SR-sorted student attendance roster',
      'Instant detection of Aadhaar/Jan-Aadhaar identity discrepancies',
      'One-click consolidated green sheet and report card generation'
    ],
    steps: [
      {
        stepNum: 1,
        titleHi: 'कक्षा अध्यापक मॉड्यूल खोलें व कक्षा चुनें',
        titleEn: 'Open Class Teacher Module & Pick Class',
        descriptionHi: 'शिक्षक प्रभाग से "कक्षा अध्यापक टूलकिट" का चयन करें और अपनी आवंटित कक्षा (जैसे कक्षा 5, 8, 10) चुनें।',
        descriptionEn: 'Select Class Teacher Toolkit and pick your assigned class section (e.g., Class 8-A).',
        tipHi: 'कक्षा का माध्यम (हिंदी/अंग्रेजी) प्रोफाइल अनुसार सेट रहता है।',
        tipEn: 'Instruction medium auto-aligns with school language settings.',
        screenshotPlaceholder: {
          titleHi: 'कक्षा अध्यापक डैशबोर्ड',
          titleEn: 'Class Teacher Dashboard',
          type: 'form_input',
          captionHi: 'कक्षावार विद्यार्थी सूची एवं सत्यापन स्थिति',
          captionEn: 'Class-wise student roster and verification indicators',
          mockupData: {
            fields: [
              { label: 'आवंटित कक्षा (Class)', value: 'कक्षा 8 (वर्ग-अ)' },
              { label: 'कुल नामांकित (Total Enrolled)', value: '42 विद्यार्थी' },
              { label: 'आधार प्रमाणित (Aadhaar Verified)', value: '40 / 42 (95.2%)', status: 'सत्यापित' },
              { label: 'ग्रीन शीट स्थिति (Green Sheet)', value: 'अर्धवार्षिक पूर्ण' }
            ]
          }
        }
      },
      {
        stepNum: 2,
        titleHi: 'विद्यार्थी प्रोफाइल एवं उपस्थिति की जाँच करें',
        titleEn: 'Verify Student Profile & Attendance',
        descriptionHi: 'छात्र के नाम, पिता का नाम, जन्मतिथि एवं उपस्थिति प्रतिशत का शाला दर्पण प्रपत्र 9 से मिलान करें।',
        descriptionEn: 'Cross-check student name, father name, DOB, and attendance percentage with Shala Darpan Form 9.',
        tipHi: '75% से कम उपस्थिति वाले विद्यार्थियों को तुरंत चिन्हित करें।',
        tipEn: 'Flag students with below 75% attendance for parental follow-up.'
      },
      {
        stepNum: 3,
        titleHi: 'अंक संकलन व प्रगति पत्रक प्रिंट करें',
        titleEn: 'Generate Consolidated Report Cards',
        descriptionHi: 'विषय अध्यापकों से प्राप्त अंक दर्ज करें अथवा सीधे एक्सेल से आयात कर सुंदर आधिकारिक प्रगति पत्रक प्रिंट करें।',
        descriptionEn: 'Consolidate subject marks or import from spreadsheet, then print beautiful progress report cards.',
        tipHi: 'संस्थाप्रधान व कक्षाध्यापक दोनों के हस्ताक्षर स्थान उपलब्ध हैं।',
        tipEn: 'Includes designated signature blocks for both Class Teacher and Headmaster.'
      }
    ],
    contentSections: [
      {
        headingLevel: 'h2',
        headingHi: 'कक्षा अध्यापक के मुख्य वार्षिक दायित्व व अभिलेख',
        headingEn: 'Primary Annual Records Maintained by Class Teachers',
        contentHi: 'शिविरा पंचांग एवं विद्यालय नियमावली अनुसार कक्षा अध्यापक को सत्र पर्यन्त निम्न अभिलेख संधारित करने होते हैं:',
        contentEn: 'Class teachers must maintain mandatory school registers and records:',
        listItemsHi: [
          '1. विद्यार्थी दैनिक उपस्थिति पंजिका (Student Attendance Register)',
          '2. प्रगति पत्रक एवं ग्रीन शीट रजिस्टर (Cumulative Marksheet & Green Sheet)',
          '3. अभिभावक-शिक्षक बैठक (PTM) कार्यवृत्त पंजिका',
          '4. विद्यार्थी संचयी अभिलेख पत्रक (Cumulative Record Card)'
        ],
        listItemsEn: [
          '1. Daily Student Attendance Register',
          '2. Cumulative Marksheet and Green Sheet Register',
          '3. Parent-Teacher Meeting (PTM) Minutes Register',
          '4. Student Cumulative Record Card (Folder)'
        ]
      }
    ],
    relatedGuides: [
      { id: 'teacher-subjectteacher-guide', titleHi: 'विषय अध्यापक टूलकिट', titleEn: 'Subject Teacher Toolkit', categoryHi: 'शिक्षक संवर्ग' },
      { id: 'teacher-marksheet-guide', titleHi: 'अंकतालिका जनरेटर', titleEn: 'Marksheet Generator', categoryHi: 'शिक्षक संवर्ग' },
      { id: 'teacher-diary-guide', titleHi: 'दैनिक शिक्षक दैनन्दिनी', titleEn: 'Daily Teacher Diary', categoryHi: 'शिक्षक संवर्ग' }
    ],
    internalToolLinks: [
      { toolId: 'teacher-classteacher', nameHi: 'कक्षा अध्यापक टूल', nameEn: 'Class Teacher Module', descriptionHi: 'छात्र नामावली, उपस्थिति व परिणाम तैयार करें' },
      { toolId: 'teacher-marksheet', nameHi: 'अंकतालिका जनरेटर', nameEn: 'Marksheet Maker', descriptionHi: 'आधिकारिक प्रगति पत्रक व ग्रीन शीट प्रिंट करें' }
    ],
    faqItems: [
      {
        questionHi: 'क्या कक्षा अध्यापक सीधे विद्यार्थियों का डेटा एक्सेल से इम्पोर्ट कर सकते हैं?',
        questionEn: 'Can class teachers import student lists directly from Excel?',
        answerHi: 'हाँ, शाला दर्पण से डाउनलोड की गई एक्सेल/सीएसवी फाइल को एक क्लिक में अपलोड करके पूरी नामावली स्वतः भरी जा सकती है।',
        answerEn: 'Yes, CSV or Excel files downloaded from Shala Darpan can be uploaded directly to populate the full class roll.'
      }
    ]
  },
  {
    id: 'teacher-subjectteacher-guide',
    toolId: 'teacher-subjectteacher',
    categoryKey: 'teacher',
    categoryHi: 'शिक्षक संवर्ग',
    categoryEn: 'Teacher Modules',
    titleHi: 'विषय अध्यापक (Subject Teacher) अंक प्रविष्टि, पाठ्यक्रम प्रगति एवं परख ट्रैकर',
    titleEn: 'Subject Teacher Marks Entry, Syllabus Progress & Test Tracker Guide',
    readTime: '3 मिनट',
    updatedDate: '2026-08-15',
    iconName: 'FileText',
    summaryHi: 'प्रथम परख, द्वितीय परख, तृतीय परख एवं अर्धवार्षिक परीक्षा के विषयवार अंक प्रविष्टि, मासिक पाठ्यक्रम प्रगति एवं कमजोर छात्रों के उपचारात्मक शिक्षण की मार्गदर्शिका।',
    summaryEn: 'Track First/Second/Third periodic tests, half-yearly exam scores, monthly syllabus completion, and remedial learning records.',
    seoMeta: {
      titleTag: 'Subject Teacher Marks Entry & Syllabus Tracker | Shala Sahayak',
      metaDescription: 'Manage Rajasthan school subject marks entry, periodic test records (1st/2nd/3rd Test), and syllabus pacing tracker online free!',
      h1Tag: 'विषय अध्यापक टूलकिट: अंक प्रविष्टि एवं पाठ्यक्रम प्रगति संपूर्ण गाइड',
      slugUrl: '/teacher-subjectteacher-guide',
      imageAltText: 'Rajasthan Subject Teacher marks entry sheet showing periodic tests, syllabus progress bar, and grade averages'
    },
    overviewHi: 'विषय अध्यापकों के लिए शिविरा पंचांग अनुसार निर्धारित मासिक पाठ्यक्रम की समय पर पूर्णता एवं त्रैमासिक आवधिक परख (Periodic Tests) के अंक प्रविष्टि और कमजोर विद्यार्थियों हेतु उपचारात्मक शिक्षण (Remedial Teaching) का संधारण अनिवार्य है।',
    overviewEn: 'Subject teachers are required to track monthly syllabus pacing, enter periodic test marks, and document remedial support for slow learners.',
    prerequisitesHi: [
      'कक्षा एवं विषय का चयन (जैसे कक्षा 9 विज्ञान / गणित)',
      'परख व परीक्षाओं की उत्तर-पुस्तिका अंक सूची',
      'मासिक पाठ्यक्रम विभाजन योजना (Monthly Syllabus Plan)'
    ],
    prerequisitesEn: [
      'Class and subject selection (e.g. Class 9 Science)',
      'Test answer-sheet marks lists',
      'Prescribed monthly syllabus division chart'
    ],
    keyBenefitsHi: [
      '10/20 अंकों के आवधिक परख अंकों की त्वरित प्रविष्टि',
      'पाठ्यक्रम पूर्णता प्रतिशत का ऑटो प्रोग्रेस बार',
      'कक्षा अध्यापक को सौंपने हेतु रेडी-टु-प्रिंट विषयवार अंक पत्रक'
    ],
    keyBenefitsEn: [
      'Instant entry for 10/20 marks periodic tests',
      'Visual progress bar for monthly syllabus pacing',
      'Ready-to-print subject mark-sheet to hand over to class teacher'
    ],
    steps: [
      {
        stepNum: 1,
        titleHi: 'विषय अध्यापक प्रभाग खोलें',
        titleEn: 'Open Subject Teacher Module',
        descriptionHi: 'शिक्षक संवर्ग से "विषय अध्यापक" पर क्लिक करें और अपनी कक्षा व विषय चुनें।',
        descriptionEn: 'Click on Subject Teacher module and select your taught class and subject.',
        tipHi: 'एक से अधिक कक्षाओं का चयन आसानी से किया जा सकता है।',
        tipEn: 'You can easily switch between multiple classes assigned to you.'
      },
      {
        stepNum: 2,
        titleHi: 'परख व परीक्षा अंक दर्ज करें',
        titleEn: 'Enter Test & Exam Marks',
        descriptionHi: 'विद्यार्थी के सम्मुख प्रथम परख, द्वितीय परख या अर्द्धवार्षिक परीक्षा के प्राप्तांक दर्ज करें।',
        descriptionEn: 'Input marks for First Test, Second Test, or Half-Yearly examination.',
        tipHi: 'अनुपस्थित छात्र हेतु "Ab" दर्ज करें ताकि औसत गणना सही रहे।',
        tipEn: 'Mark absent students as "Ab" to maintain accurate class grading statistics.'
      },
      {
        stepNum: 3,
        titleHi: 'विषय परिणाम पत्रक डाउनलोड करें',
        titleEn: 'Export Subject Marks Sheet',
        descriptionHi: 'कक्षा अध्यापक को देने हेतु विषयवार समेकित अंक पत्रक प्रिंट करें।',
        descriptionEn: 'Print consolidated subject marks sheet to submit to Class Teacher for green sheet entry.',
        tipHi: 'कम अंक प्राप्त करने वाले छात्रों की सूची उपचारात्मक रजिस्टर हेतु अलग से निकालें।',
        tipEn: 'Export slow learner list for your remedial teaching register.'
      }
    ],
    relatedGuides: [
      { id: 'teacher-classteacher-guide', titleHi: 'कक्षा अध्यापक टूलकिट', titleEn: 'Class Teacher Toolkit', categoryHi: 'शिक्षक संवर्ग' },
      { id: 'teacher-diary-guide', titleHi: 'दैनिक शिक्षक दैनन्दिनी', titleEn: 'Daily Teacher Diary', categoryHi: 'शिक्षक संवर्ग' }
    ],
    internalToolLinks: [
      { toolId: 'teacher-subjectteacher', nameHi: 'विषय अध्यापक टूल', nameEn: 'Subject Teacher Module', descriptionHi: 'विषय अंक प्रविष्टि व पाठ्यक्रम स्थिति ट्रैक करें' }
    ],
    faqItems: [
      {
        questionHi: 'परख अंकों का योग वार्षिक परिणाम में कैसे जुड़ता है?',
        questionEn: 'How are periodic test marks weighted in the annual result?',
        answerHi: 'आरएसईआरटी व माध्यमिक शिक्षा बोर्ड नियमानुसार प्रथम परख (10), द्वितीय परख (10), तृतीय परख (10) एवं अर्द्धवार्षिक (70) के अंक वार्षिक परीक्षा (100) के साथ मिलकर अंतिम 200 अंकों का परिणाम बनाते हैं।',
        answerEn: 'Under board guidelines, Tests 1, 2, 3 (10 marks each) and Half-Yearly (70 marks) combine with the Annual Exam (100) for a 200-mark final total.'
      }
    ]
  },
  {
    id: 'teacher-diary-guide',
    toolId: 'teacher-diary',
    categoryKey: 'teacher',
    categoryHi: 'शिक्षक संवर्ग',
    categoryEn: 'Teacher Modules',
    titleHi: 'दैनिक शिक्षक दैनन्दिनी (Teacher Diary) एवं CCEA गतिविधि संधारण मार्गदर्शिका',
    titleEn: 'Daily Teacher Diary & CCEA Classroom Teaching Logger Guide',
    readTime: '4 मिनट',
    updatedDate: '2026-08-15',
    iconName: 'BookOpen',
    summaryHi: 'दैनिक कक्षा शिक्षण, कालांशवार विषय वस्तु, गृहकार्य, उपचारात्मक शिक्षण एवं नो बैग डे गतिविधियों का डिजिटल संधारण व प्रिंट प्रपत्र।',
    summaryEn: 'Digital daily teacher diary planner for classroom learning objectives, homework, remedial lessons, and No-Bag-Day activities.',
    seoMeta: {
      titleTag: 'Rajasthan Teacher Daily Diary Format & Generator | Shala Sahayak',
      metaDescription: 'Complete digital daily teacher diary for Rajasthan teachers. Plan classroom lessons, CCEA activities, homework and print official diary pages in PDF free!',
      h1Tag: 'दैनिक शिक्षक दैनन्दिनी (डायरी): राजस्थान विद्यालय संपूर्ण गाइड',
      slugUrl: '/teacher-diary-guide',
      imageAltText: 'Rajasthan daily teacher diary format showing period-wise subject topics, learning objectives, and Headmaster signature block'
    },
    overviewHi: 'प्रत्येक शिक्षक हेतु दैनिक शिक्षण योजना (Daily Lesson Plan), गृहकार्य प्रविष्टि, उपस्थिति विश्लेषण एवं बाल सभा / नो बैग डे गतिविधियों का दैनिक दैनन्दिनी में संधारण अनिवार्य होता है, जिसका संस्थाप्रधान द्वारा साप्ताहिक अवलोकन किया जाता है।',
    overviewEn: 'Maintenance of a daily teaching diary reflecting lesson objectives, assigned homework, and Saturday activities is mandatory for all teachers.',
    prerequisitesHi: [
      'शिक्षक का नाम, पदनाम एवं पदस्थापित विद्यालय',
      'दैनिक समय-सारणी अनुसार कालांश एवं विषय',
      'अध्यापन कराए गए पाठ/इकाई का नाम व गृहकार्य'
    ],
    prerequisitesEn: [
      'Teacher name, designation and school',
      'Daily periods and taught subjects per timetable',
      'Unit/chapter topics taught and homework assigned'
    ],
    keyBenefitsHi: [
      '8 कालांशों का सुव्यवस्थित दैनिक शिक्षण प्रारूप',
      'गृहकार्य, उपचारात्मक शिक्षण एवं सीसीईए (CCEA) गतिविधियों हेतु विशिष्ट कॉलम',
      'संस्थाप्रधान के साप्ताहिक निरीक्षण हेतु तैयार ए4 प्रिंट आउट'
    ],
    keyBenefitsEn: [
      'Well-structured 8-period daily pedagogical format',
      'Dedicated sections for homework, remedial drills, and CCEA work',
      'Ready A4 printable pages for weekly Principal inspection signatures'
    ],
    steps: [
      {
        stepNum: 1,
        titleHi: 'दैनिक डायरी प्रभाग खोलें व दिनांक चुनें',
        titleEn: 'Open Diary Module & Select Date',
        descriptionHi: 'शिक्षक संवर्ग से "दैनिक शिक्षक दैनन्दिनी" खोलें। आज की दिनांक स्वतः दर्ज रहेगी।',
        descriptionEn: 'Select Teacher Diary from Teacher menu. Today’s date is pre-selected.',
        tipHi: 'विगत दिनों की डायरी भरने हेतु कैलेंडर से तारीख बदलें।',
        tipEn: 'Pick past dates from calendar to fill backlogged entries.'
      },
      {
        stepNum: 2,
        titleHi: 'कालांशवार अध्यापन विवरण भरें',
        titleEn: 'Fill Period-wise Lessons',
        descriptionHi: 'प्रत्येक कालांश में कक्षा, विषय, पढ़ाया गया प्रकरण एवं दिया गया गृहकार्य संक्षेप में दर्ज करें।',
        descriptionEn: 'Enter class, subject, topic taught, and homework assigned for each period.',
        tipHi: 'खाली या स्थानापन्न कालांश में "पुस्तकालय वाचन" या "स्थानापन्न शिक्षण" दर्ज करें।',
        tipEn: 'Note substitution or library supervision for vacant periods.'
      },
      {
        stepNum: 3,
        titleHi: 'साप्ताहिक डायरी शीट प्रिंट करें',
        titleEn: 'Export Weekly Printable Diary',
        descriptionHi: '"साप्ताहिक प्रिंट" बटन दबाकर पूरे सप्ताह की दैनन्दिनी एक साथ मुद्रित करें।',
        descriptionEn: 'Click "Weekly Print" to export a clean multi-page weekly teaching log with Headmaster sign box.',
        tipHi: 'शनिवार को संस्थाप्रधान के हस्ताक्षर करवाकर पत्रावली में रखें।',
        tipEn: 'Obtain Headmaster signatures every Saturday for record inspection.'
      }
    ],
    relatedGuides: [
      { id: 'teacher-classteacher-guide', titleHi: 'कक्षा अध्यापक टूलकिट', titleEn: 'Class Teacher Toolkit', categoryHi: 'शिक्षक संवर्ग' },
      { id: 'peeo-timetable-guide', titleHi: 'समय-सारणी जनरेटर', titleEn: 'Timetable Generator', categoryHi: 'पीईईओ टूल्स' }
    ],
    internalToolLinks: [
      { toolId: 'teacher-diary', nameHi: 'शिक्षक दैनन्दिनी', nameEn: 'Teacher Diary', descriptionHi: 'दैनिक कक्षा शिक्षण व गृहकार्य दैनन्दिनी संधारित करें' }
    ],
    faqItems: [
      {
        questionHi: 'क्या शनिवार "नो बैग डे" की गतिविधियों को डायरी में लिखना आवश्यक है?',
        questionEn: 'Are Saturday No-Bag-Day activities recorded in the diary?',
        answerHi: 'हाँ, शनिवार के दिन आयोजित 5 थीम आधारित गतिविधियों (जैसे राजस्थान को जानो, भाषा कौशल, खेल-कूद) का विवरण डायरी में अंकित करना अनिवार्य है।',
        answerEn: 'Yes, Saturday thematic activities (language skills, yoga, know your state) must be summarized in the diary.'
      }
    ]
  },
  {
    id: 'teacher-library-guide',
    toolId: 'teacher-library',
    categoryKey: 'teacher',
    categoryHi: 'शिक्षक संवर्ग',
    categoryEn: 'Teacher Modules',
    titleHi: 'पुस्तकालय अध्यक्ष (Librarian) एक्सेस रजिस्टर एवं पुस्तक इश्यू-रिटर्न ट्रैकर गाइड',
    titleEn: 'School Library Accession Register & Book Circulation Tracker Guide',
    readTime: '3 मिनट',
    updatedDate: '2026-08-15',
    iconName: 'BookOpen',
    summaryHi: 'विद्यालय पुस्तकालय की पुस्तकों का परिग्रहण क्रमांक (Accession No), पुस्तक सूची संधारण एवं विद्यार्थियों व शिक्षकों को पुस्तक निर्गमन-वापसी प्रबंधन।',
    summaryEn: 'Maintain school library accession register, book catalog, Dewey decimal/subject grouping, and student/teacher issue-return log.',
    seoMeta: {
      titleTag: 'School Library Register & Book Issue Tracker Rajasthan | Shala Sahayak',
      metaDescription: 'Manage Rajasthan school library accession register, catalog search, student book issue/return and generate library circulation slips online free!',
      h1Tag: 'पुस्तकालय अध्यक्ष रजिस्टर: पुस्तक परिग्रहण व इश्यू-रिटर्न संपूर्ण गाइड',
      slugUrl: '/teacher-library-guide',
      imageAltText: 'School library accession register table showing book titles, author, accession number and circulation status'
    },
    overviewHi: 'राजस्थान के राजकीय विद्यालयों में पुस्तकालय प्रभारी / पुस्तकालय अध्यक्ष द्वारा परिग्रहण पंजिका (Accession Register) संधारित की जाती है तथा रीडिंग कैम्पेन के तहत विद्यार्थियों को पुस्तकें जारी की जाती हैं।',
    overviewEn: 'Library incharge teachers manage accession registers, catalog acquisition, and routine book circulation for students and staff.',
    prerequisitesHi: [
      'विद्यालय पुस्तकालय परिग्रहण पंजिका (Accession Register)',
      'पुस्तक का शीर्षक, लेखक, प्रकाशक एवं मूल्य',
      'विद्यार्थी अथवा शिक्षक का नाम व कक्षा/पद'
    ],
    prerequisitesEn: [
      'School library physical accession register',
      'Book title, author, publisher and cost',
      'Borrower student/staff ID and class'
    ],
    keyBenefitsHi: [
      'एक्सेस क्रमांक या पुस्तक नाम से त्वरित डिजिटल खोज (Search)',
      '14 दिन से अधिक बकाया (Overdue) पुस्तकों का स्वतः अलर्ट',
      'वार्षिक भौतिक सत्यापन हेतु तैयार पुस्तक स्टॉक सारांश'
    ],
    keyBenefitsEn: [
      'Instant search by accession number, title, or author',
      'Automated overdue alert for books kept past 14 days',
      'Exportable library stock audit statement for annual verification'
    ],
    steps: [
      {
        stepNum: 1,
        titleHi: 'पुस्तकालय मॉड्यूल खोलें',
        titleEn: 'Open Library Module',
        descriptionHi: 'शिक्षक संवर्ग से "पुस्तकालय अध्यक्ष" चुनें।',
        descriptionEn: 'Select Librarian Register from Teacher Modules menu.',
        tipHi: 'कैटलॉग या इश्यू-रिटर्न टैब का चयन करें।',
        tipEn: 'Toggle between Book Catalog or Issue-Return Register.'
      },
      {
        stepNum: 2,
        titleHi: 'पुस्तक इश्यू (निर्गमन) दर्ज करें',
        titleEn: 'Issue Book to Student or Teacher',
        descriptionHi: 'पुस्तक का एक्सेस क्रमांक डालें और लेने वाले विद्यार्थी का नाम व कक्षा चुनें। वापसी की अंतिम तिथि स्वतः आ जाएगी।',
        descriptionEn: 'Enter accession number and borrower name. Return due date is calculated automatically.',
        tipHi: 'सामान्यतः पुस्तक 7 से 14 दिनों के लिए निर्गमित की जाती है।',
        tipEn: 'Books are routinely loaned for 7 to 14 days.'
      },
      {
        stepNum: 3,
        titleHi: 'वापसी होने पर टिक करें',
        titleEn: 'Mark Returned',
        descriptionHi: 'पुस्तक वापस प्राप्त होने पर "जमा" बटन दबाएं। स्थिति तुरंत "उपलब्ध" में बदल जाएगी।',
        descriptionEn: 'Click Return when book is handed back to restore status to Available.',
        tipHi: 'फटी या खोई पुस्तकों पर क्षतिपूर्ति टिप्पणी अंकित करें।',
        tipEn: 'Log damage/lost remarks if replacement is required.'
      }
    ],
    relatedGuides: [
      { id: 'peeo-satyapan-guide', titleHi: 'वार्षिक भौतिक सत्यापन', titleEn: 'Physical Stock Verification', categoryHi: 'पीईईओ टूल्स' },
      { id: 'teacher-diary-guide', titleHi: 'दैनिक शिक्षक दैनन्दिनी', titleEn: 'Daily Teacher Diary', categoryHi: 'शिक्षक संवर्ग' }
    ],
    internalToolLinks: [
      { toolId: 'teacher-library', nameHi: 'पुस्तकालय अध्यक्ष रजिस्टर', nameEn: 'Library Register', descriptionHi: 'एक्सेस पंजिका व पुस्तक इश्यू-रिटर्न ट्रैक करें' }
    ],
    faqItems: [
      {
        questionHi: 'पुस्तकालय की अनुपयोगी पुस्तकों का राइट-ऑफ कैसे होता है?',
        questionEn: 'How are damaged library books written off?',
        answerHi: 'वार्षिक भौतिक सत्यापन दल की अनुशंसा पर संस्थाप्रधान व सीबीईओ के अनुमोदन से जीएफएंडएआर नियमों अनुसार निस्तारण किया जाता है।',
        answerEn: 'Damaged books are formally condemned based on annual inspection committee recommendations per GF&AR norms.'
      }
    ]
  },
  {
    id: 'krida-shulk-maker-guide',
    toolId: 'teacher-pti',
    categoryKey: 'incharge',
    categoryHi: 'प्रभारी दायित्व',
    categoryEn: 'Incharge Modules',
    titleHi: 'क्रीड़ा शुल्क विवरण प्रपत्र मेकर - प्रपत्र अ व ब (Form A & B) जनरेटर मार्गदर्शिका',
    titleEn: 'Krida Shulk Maker: Form A & B Format Generator & Complete Guide',
    readTime: '5 मिनट',
    updatedDate: '2026-08-15',
    iconName: 'Trophy',
    summaryHi: 'राजस्थान माध्यमिक एवं प्रारम्भिक शिक्षा विभाग हेतु क्रीड़ा शुल्क विवरण प्रपत्र अ एवं प्रपत्र ब की स्वतः गणना, बैंक ड्राफ्ट ब्योरा एवं ए4 पीडीएफ जनरेटर।',
    summaryEn: 'Official Rajasthan school sports fee Form A & B online generator. Auto-calculates student counts, sports fee rates, bank DD details, and exports clean A4 PDF.',
    seoMeta: {
      titleTag: 'Krida Shulk Maker: Form A & B Format Generator | Shala Sahayak',
      metaDescription: 'Generate official Rajasthan school Krida Shulk Form A & B online. Auto-calculate sports fee rates, print PDF, & export bank DD statement. Try free now!',
      h1Tag: 'क्रीड़ा शुल्क मेकर व प्रपत्र अ/ब जनरेटर: राजस्थान विद्यालय संपूर्ण गाइड',
      slugUrl: '/krida-shulk-maker-guide',
      imageAltText: 'Rajasthan Education Department Krida Shulk Form A and B preview with auto-calculated student sports fee totals and bank DD signature block'
    },
    overviewHi: 'राजस्थान राज्य के समस्त राजकीय एवं निजी विद्यालयों में प्रारम्भिक एवं माध्यमिक शिक्षा विभाग के नियमानुसार प्रतिवर्ष विद्यार्थियों से क्रीड़ा शुल्क एकत्रित कर जिला/ब्लॉक क्रीड़ा कोष में जमा कराया जाता है। इसके लिए निर्धारित प्रपत्र अ एवं प्रपत्र ब भरकर चालान अथवा बैंक डिमांड ड्राफ्ट (DD) के साथ प्रस्तुत करना अनिवार्य होता है।',
    overviewEn: 'In all schools of Rajasthan, student sports fees collected annually must be remitted to the CBEO/DEO Sports Fund along with Form A and Form B. Shala Sahayak automates student fee calculations and prints official formats.',
    prerequisitesHi: [
      'विद्यालय का नाम, एनआईसी कोड एवं सीबीईओ ब्लॉक का नाम',
      'कक्षा 6 से 12 तक बालकों एवं बालिकाओं की नामांकन संख्या',
      'क्रीड़ा शुल्क बैंक डिमांड ड्राफ्ट (DD) संख्या, दिनांक एवं बैंक नाम'
    ],
    prerequisitesEn: [
      'School Name, NIC Code, and CBEO Block',
      'Classwise Boys and Girls student enrollment count (Classes 6 to 12)',
      'Sports Fee Bank Demand Draft (DD) number, date, amount, and bank branch'
    ],
    keyBenefitsHi: [
      'कक्षा 6 से 12 तक दर अनुसार स्वतः सटीक योग एवं प्रतिशत विभाजन',
      'प्रपत्र अ (विद्यालय स्तर) एवं प्रपत्र ब (ब्लॉक/जिला स्तर) एक साथ तैयार',
      'बैंक ड्राफ्ट/चालान रसीद संख्या का आधिकारिक इंद्राज व A4 साइज प्रिंट'
    ],
    keyBenefitsEn: [
      'Automated rate multiplication and student total calculation',
      'Both Form A and Form B generated simultaneously in official layout',
      'Official bank DD/challan endorsement with ready A4 PDF export'
    ],
    steps: [
      {
        stepNum: 1,
        titleHi: 'विद्यालय विवरण एवं नामांकन दर्ज करें',
        titleEn: 'Enter School Details & Enrollment',
        descriptionHi: 'विद्यालय का नाम, एनआईसी कोड, ब्लॉक एवं कक्षा 6 से 12 तक छात्र व छात्राओं की संख्या दर्ज करें।',
        descriptionEn: 'Enter school name, NIC code, block, and classwise boys/girls strength for classes 6 to 12.',
        tipHi: 'शाला दर्पण पोर्टल की चालू सत्र छात्र नामांकन संख्या से मिलान करें।',
        tipEn: 'Match student counts with active Shala Darpan enrollment portal figures.'
      },
      {
        stepNum: 2,
        titleHi: 'बैंक डिमांड ड्राफ्ट (DD) विवरण भरें',
        titleEn: 'Input Bank Demand Draft (DD) Information',
        descriptionHi: 'सीबीईओ/डीईओ के पक्ष में बनवाए गए डिमांड ड्राफ्ट की संख्या, जारी दिनांक, बैंक का नाम एवं राशि दर्ज करें।',
        descriptionEn: 'Provide the DD number, issuance date, bank branch, and total deposited amount.',
        tipHi: 'ड्राफ्ट सीबीईओ या जिला क्रीड़ा कोष के आधिकारिक पदनाम पर ही बनवाएं।',
        tipEn: 'Ensure DD is drafted in the designated official capacity of CBEO or DEO sports fund.'
      },
      {
        stepNum: 3,
        titleHi: 'प्रपत्र अ व ब डाउनलोड एवं प्रिंट करें',
        titleEn: 'Download & Print Form A & Form B',
        descriptionHi: '"प्रपत्र अ व ब जनरेट करें" बटन दबाएं और ए4 साइज में मुद्रित कर संस्थाप्रधान व शारीरिक शिक्षक के हस्ताक्षर करवाएं।',
        descriptionEn: 'Generate Form A and Form B in official letterhead layout, attach DD copy, and get signed by Principal and PTI.',
        tipHi: 'इसकी एक प्रति कार्यालय पत्रावली में क्रीड़ा शुल्क वाउचर के साथ नत्थी करें।',
        tipEn: 'Retain one signed copy with physical voucher file for departmental audit.'
      }
    ],
    contentSections: [
      {
        headingLevel: 'h2',
        headingHi: 'राजस्थान क्रीड़ा शुल्क दरें एवं कक्षावार वितरण तालिका',
        headingEn: 'Rajasthan School Sports Fee Rates & Allocation Slabs',
        contentHi: 'माध्यमिक शिक्षा राजस्थान के आदेशानुसार विभिन्न कक्षाओं में छात्र व छात्राओं से प्रतिवर्ष निम्नानुसार क्रीड़ा शुल्क लिया जाता है:',
        contentEn: 'Sports fee collected per student annually in Rajasthan secondary education:',
        tableData: {
          headersHi: ['कक्षा वर्ग', 'छात्र शुल्क (प्रतिवर्ष)', 'छात्रा शुल्क (प्रतिवर्ष)', 'जमा मद'],
          headersEn: ['Class Group', 'Boys Fee (Annual)', 'Girls Fee (Annual)', 'Deposit Fund'],
          rowsHi: [
            ['कक्षा 6 से 8 (उच्च प्राथमिक)', '₹20', '₹20', 'विद्यालय/ब्लॉक क्रीड़ा कोष'],
            ['कक्षा 9 व 10 (माध्यमिक)', '₹50', '₹50', 'ब्लॉक/जिला क्रीड़ा कोष'],
            ['कक्षा 11 व 12 (उच्च माध्यमिक)', '₹70', '₹70', 'जिला क्रीड़ा कोष']
          ],
          rowsEn: [
            ['Classes 6 to 8 (Upper Primary)', '₹20', '₹20', 'School/Block Sports Fund'],
            ['Classes 9 & 10 (Secondary)', '₹50', '₹50', 'Block/District Sports Fund'],
            ['Classes 11 & 12 (Sr Secondary)', '₹70', '₹70', 'District Sports Fund']
          ]
        }
      }
    ],
    relatedGuides: [
      { id: 'teacher-pti-sports-guide', titleHi: 'शारीरिक शिक्षक बीएमआई व खेलकूद', titleEn: 'PTI BMI & Sports Guide', categoryHi: 'शिक्षक संवर्ग' },
      { id: 'peeo-orders-guide', titleHi: 'पीईईओ प्रशासनिक आदेश', titleEn: 'PEEO Orders Generator', categoryHi: 'पीईईओ टूल्स' }
    ],
    internalToolLinks: [
      { toolId: 'teacher-pti', nameHi: 'क्रीड़ा शुल्क मेकर', nameEn: 'Krida Shulk Maker', descriptionHi: 'प्रपत्र अ व ब स्वतः बनाएं एवं बैंक डीडी ब्योरा प्रिंट करें' }
    ],
    faqItems: [
      {
        questionHi: 'क्रीड़ा शुल्क प्रपत्र सीबीईओ कार्यालय में कब तक जमा करवाना होता है?',
        questionEn: 'What is the deadline for submitting Krida Shulk forms to CBEO?',
        answerHi: 'शिविरा पंचांग अनुसार सामान्यतः 31 अगस्त अथवा जिला स्तरीय खेलकूद प्रतियोगिताओं के प्रारम्भ होने से पूर्व जमा करवाना अनिवार्य होता है।',
        answerEn: 'Per Shivira calendar, submission is typically mandated by August 31st or prior to district sports tournaments.'
      }
    ]
  },
  {
    id: 'teacher-pti-sports-guide',
    toolId: 'teacher-pti',
    categoryKey: 'teacher',
    categoryHi: 'शिक्षक संवर्ग',
    categoryEn: 'Teacher Modules',
    titleHi: 'शारीरिक शिक्षक (PTI) विद्यार्थी स्वास्थ्य इंडेक्स (BMI), खेल सामग्री व PT ग्रेडिंग गाइड',
    titleEn: 'Physical Teacher (PTI) Student BMI Health Index, Sports Goods & PT Grading Guide',
    readTime: '3 मिनट',
    updatedDate: '2026-08-15',
    iconName: 'Award',
    summaryHi: 'विद्यार्थियों का कद-वजन अनुसार बीएमआई (BMI) इंडेक्स, खेल सामग्री स्थायी-उपभोज्य स्टॉक एवं शारीरिक शिक्षा विषय की ग्रेडिंग रिपोर्ट।',
    summaryEn: 'Monitor student height-weight Body Mass Index (BMI), maintain sports goods stock register, and generate physical education grades.',
    seoMeta: {
      titleTag: 'PTI Physical Education BMI & Sports Register Rajasthan | Shala Sahayak',
      metaDescription: 'Manage student BMI health calculation, sports equipment register, and physical training grading for Rajasthan schools online free!',
      h1Tag: 'शारीरिक शिक्षक (PTI) टूलकिट: BMI इंडेक्स व खेल सामग्री संपूर्ण गाइड',
      slugUrl: '/teacher-pti-sports-guide',
      imageAltText: 'PTI Physical Education student BMI health report table and sports equipment stock inventory'
    },
    overviewHi: 'शारीरिक शिक्षक का मुख्य दायित्व विद्यार्थियों के स्वास्थ्य रिकॉर्ड (कद, वजन, बीएमआई) का संधारण, खेलकूद उपकरण (वॉलीबॉल, फुटबॉल, क्रिकेट) का स्टॉक रजिस्टर एवं 10वीं/12वीं बोर्ड परीक्षा में स्वास्थ्य व शारीरिक शिक्षा विषय के सत्रांक व ग्रेडिंग तैयार करना होता है।',
    overviewEn: 'Physical Education Teachers maintain student health BMI indexes, sports stock registers, and board examination practical grading.',
    prerequisitesHi: [
      'विद्यार्थियों का कद (सेमी में) एवं वजन (किग्रा में)',
      'विद्यालय में उपलब्ध खेल सामग्री की सूची',
      'शारीरिक शिक्षा परीक्षा ग्रेडिंग नियम'
    ],
    prerequisitesEn: [
      'Student height (cm) and weight (kg)',
      'Physical inventory of school sports equipment',
      'Board grading guidelines for Health & Physical Education'
    ],
    keyBenefitsHi: [
      'कद-वजन डालते ही स्वतः सटीक बीएमआई एवं स्वास्थ्य श्रेणी (Underweight, Normal, Overweight)',
      'खेलकूद स्टॉक रजिस्टर (फुटबॉल, नेट, रस्सा, चॉक) का डिजिटल संधारण',
      'शाला दर्पण स्वास्थ्य मॉड्यूल में अंकन हेतु तैयार विद्यार्थी पत्रक'
    ],
    keyBenefitsEn: [
      'Auto-calculation of BMI and health classification (Normal, Underweight, Obese)',
      'Digital inventory of sports consumables and permanent gear',
      'Exportable student health report cards for Shala Darpan Health module'
    ],
    steps: [
      {
        stepNum: 1,
        titleHi: 'पीटीआई मॉड्यूल खोलें',
        titleEn: 'Open PTI Sports Module',
        descriptionHi: 'शिक्षक संवर्ग से "शारीरिक शिक्षक (PTI)" चुनें।',
        descriptionEn: 'Select PTI Physical Education from Teacher Modules.',
        tipHi: 'बीएमआई या खेल सामग्री टैब का चयन करें।',
        tipEn: 'Toggle between BMI Health Index or Sports Equipment Stock.'
      },
      {
        stepNum: 2,
        titleHi: 'विद्यार्थी कद एवं वजन दर्ज करें',
        titleEn: 'Enter Student Height & Weight',
        descriptionHi: 'कक्षा अनुसार छात्र का कद (सेंटीमीटर) एवं वजन (किलोग्राम) डालें। बीएमआई स्वतः निकल आएगा।',
        descriptionEn: 'Input height in cm and weight in kg. The BMI value and category are calculated instantly.',
        tipHi: '18.5 से 24.9 के बीच बीएमआई सामान्य (Normal) माना जाता है।',
        tipEn: 'BMI between 18.5 and 24.9 falls under the Normal health category.'
      },
      {
        stepNum: 3,
        titleHi: 'स्वास्थ्य ग्रेडिंग चार्ट प्रिंट करें',
        titleEn: 'Export Health Grading Chart',
        descriptionHi: 'वार्षिक स्वास्थ्य जांच रिपोर्ट एवं बोर्ड परीक्षा ग्रेडिंग शीट प्रिंट करें।',
        descriptionEn: 'Export cumulative student health assessment sheet for school records and parent meetings.',
        tipHi: 'कुपोषित या कम वजन वाले छात्रों को विशेष परामर्श दें।',
        tipEn: 'Share undernourished student list with MDM incharge for nutritional attention.'
      }
    ],
    relatedGuides: [
      { id: 'krida-shulk-maker-guide', titleHi: 'क्रीड़ा शुल्क प्रपत्र अ व ब', titleEn: 'Krida Shulk Maker', categoryHi: 'प्रभारी दायित्व' },
      { id: 'peeo-satyapan-guide', titleHi: 'भौतिक सत्यापन चेकलिस्ट', titleEn: 'Physical Stock Verification', categoryHi: 'पीईईओ टूल्स' }
    ],
    internalToolLinks: [
      { toolId: 'teacher-pti', nameHi: 'शारीरिक शिक्षक टूल', nameEn: 'PTI Sports Module', descriptionHi: 'बीएमआई गणना, खेलकूद स्टॉक व क्रीड़ा शुल्क तैयार करें' }
    ],
    faqItems: [
      {
        questionHi: 'क्या 10वीं बोर्ड में शारीरिक शिक्षा के अंक जुड़ते हैं?',
        questionEn: 'Are physical education grades reflected on 10th Board marksheets?',
        answerHi: 'हाँ, माध्यमिक शिक्षा बोर्ड राजस्थान की 10वीं अंकतालिका में "स्वास्थ्य एवं शारीरिक शिक्षा" विषय की ग्रेड (A, B, C, D) अनिवार्य रूप से अंकित होती है।',
        answerEn: 'Yes, RBSE 10th class marksheets compulsorily record grades (A, B, C, D) for Health & Physical Education.'
      }
    ]
  },
  {
    id: 'teacher-ict-guide',
    toolId: 'teacher-ict',
    categoryKey: 'teacher',
    categoryHi: 'शिक्षक संवर्ग',
    categoryEn: 'Teacher Modules',
    titleHi: 'कंप्यूटर शिक्षक (ICT) लैब उपकरण, स्मार्ट टीवी एवं स्टॉक संधारण गाइड',
    titleEn: 'Computer Teacher ICT Lab Equipment, Smart TV & Inventory Guide',
    readTime: '3 मिनट',
    updatedDate: '2026-08-15',
    iconName: 'Monitor',
    summaryHi: 'आईसीटी लैब के कंप्यूटर, यूपीएस, स्मार्ट टीवी, प्रोजेक्टर एवं इंटरनेट कनेक्टिविटी का स्टॉक रजिस्टर संधारण एवं खराबी निवारण लॉग।',
    summaryEn: 'Manage ICT lab computers, UPS batteries, Smart TVs, projectors, internet connectivity, and hardware maintenance logs.',
    seoMeta: {
      titleTag: 'School ICT Lab Equipment Register Rajasthan | Shala Sahayak',
      metaDescription: 'Manage Rajasthan school computer lab, smart TVs, ICT equipment stock register, and maintenance complaint tracker online free!',
      h1Tag: 'कंप्यूटर शिक्षक (ICT) लैब स्टॉक व उपकरण संधारण: संपूर्ण गाइड',
      slugUrl: '/teacher-ict-guide',
      imageAltText: 'School ICT lab hardware equipment inventory table showing desktops, smart TVs, printers, and working conditions'
    },
    overviewHi: 'समग्र शिक्षा अभियान के तहत राजकीय विद्यालयों में स्थापित आईसीटी लैब्स, स्मार्ट क्लासरूम एवं रोबोटिक्स लैब्स के उपकरणों का नियमित संचालन, स्टॉक संधारण एवं वारंटी/एएमसी मॉनिटरिंग कंप्यूटर शिक्षक का प्रमुख कार्य है।',
    overviewEn: 'Computer teachers and ICT incharges manage desktops, interactive flat panels, printers, and internet uptime under Samagra Shiksha.',
    prerequisitesHi: [
      'आईसीटी लैब उपकरणों के बिल/चालान एवं सीरियल नंबर',
      'उपकरण की कार्यशील/अकार्यशील स्थिति',
      'वारंटी एवं वेंडर एएमसी (AMC) विवरण'
    ],
    prerequisitesEn: [
      'ICT hardware bills, invoices, and serial numbers',
      'Working or defective status of each unit',
      'Vendor warranty and AMC support contacts'
    ],
    keyBenefitsHi: [
      'कंप्यूटर, मॉनिटर, सीपीयू, स्मार्ट टीवी का सीरियल नंबर अनुसार डिजिटल रिकॉर्ड',
      'अकार्यशील (Defective) उपकरणों का शिकायत निवारण (Complaint Log) ट्रैकर',
      'यू-डाइस+ (UDISE+) भौतिक संसाधन मॉड्यूल में दर्ज करने हेतु तैयार संख्याएं'
    ],
    keyBenefitsEn: [
      'Serial-number-wise digital hardware asset register',
      'Defect logging and vendor complaint tracking',
      'Ready equipment counts for UDISE+ ICT facility profile'
    ],
    steps: [
      {
        stepNum: 1,
        titleHi: 'आईसीटी प्रभाग खोलें',
        titleEn: 'Open ICT Lab Module',
        descriptionHi: 'शिक्षक संवर्ग से "कंप्यूटर शिक्षक (ICT)" चुनें।',
        descriptionEn: 'Select Computer Teacher (ICT) from Teacher Modules.',
        tipHi: 'लैब उपकरण अथवा शिकायत निवारण टैब चुनें।',
        tipEn: 'Toggle between Equipment Inventory or Complaint Log.'
      },
      {
        stepNum: 2,
        titleHi: 'उपकरण स्थिति दर्ज करें',
        titleEn: 'Record Device Working Condition',
        descriptionHi: 'प्रत्येक कंप्यूटर, यूपीएस व स्मार्ट टीवी की संख्या एवं चालू/बंद स्थिति दर्ज करें।',
        descriptionEn: 'Input total numbers of desktops, interactive displays, and working condition.',
        tipHi: 'खराब उपकरण के सम्मुख वेंडर को दर्ज शिकायत संख्या (Complaint No) लिखें।',
        tipEn: 'Record vendor service ticket numbers for broken systems.'
      },
      {
        stepNum: 3,
        titleHi: 'स्टॉक रिपोर्ट डाउनलोड करें',
        titleEn: 'Export Stock Summary',
        descriptionHi: 'वार्षिक भौतिक सत्यापन एवं निरीक्षण दल हेतु तैयार लैब स्टॉक रिपोर्ट प्रिंट करें।',
        descriptionEn: 'Print comprehensive lab equipment statement for annual inspection audits.',
        tipHi: 'प्रधानाचार्य के हस्ताक्षर करवाकर लैब नोटिस बोर्ड पर लगाएं।',
        tipEn: 'Affix signed copy on ICT lab notice board.'
      }
    ],
    relatedGuides: [
      { id: 'udise-guide', titleHi: 'यू-डाइस+ रिपोर्ट गाइड', titleEn: 'UDISE+ Report Guide', categoryHi: 'प्रभारी दायित्व' },
      { id: 'peeo-satyapan-guide', titleHi: 'भौतिक सत्यापन चेकलिस्ट', titleEn: 'Physical Stock Verification', categoryHi: 'पीईईओ टूल्स' }
    ],
    internalToolLinks: [
      { toolId: 'teacher-ict', nameHi: 'कंप्यूटर शिक्षक टूल', nameEn: 'ICT Lab Module', descriptionHi: 'आईसीटी उपकरण व स्मार्ट टीवी स्टॉक संधारित करें' }
    ],
    faqItems: [
      {
        questionHi: 'खराब आईसीटी उपकरणों की मरम्मत कैसे करवाई जाती है?',
        questionEn: 'How to get defective ICT lab computers repaired?',
        answerHi: 'वारंटी अवधि में संबंधित आईसीटी वेंडर के टोल-फ्री नंबर अथवा समग्र शिक्षा पोर्टल पर शिकायत दर्ज करवाकर कंप्लेंट आईडी दर्ज की जाती है।',
        answerEn: 'Under warranty, log tickets via vendor helpline or Samagra Shiksha ICT grievance portal.'
      }
    ]
  },
  {
    id: 'teacher-marksheet-guide',
    toolId: 'teacher-marksheet',
    categoryKey: 'teacher',
    categoryHi: 'शिक्षक संवर्ग',
    categoryEn: 'Teacher Modules',
    titleHi: 'विद्यार्थी अंकतालिका (Marksheet) एवं ग्रीन शीट (Green Sheet) जनरेटर मार्गदर्शिका',
    titleEn: 'Student Report Card Marksheet & Green Sheet Generator Guide',
    readTime: '4 मिनट',
    updatedDate: '2026-08-15',
    iconName: 'GraduationCap',
    summaryHi: 'कक्षा 1 से 8 एवं 9, 11 हेतु आधिकारिक राजस्थान शिक्षा विभाग प्रारूप में सुंदर रंगीन अंकतालिका एवं कक्षावार ग्रीन शीट पीडीएफ जनरेटर।',
    summaryEn: 'Generate official Rajasthan Education Department format student marksheets, report cards, and consolidated class green sheets in high-res PDF.',
    seoMeta: {
      titleTag: 'Rajasthan Student Marksheet & Green Sheet Generator | Shala Sahayak',
      metaDescription: 'Generate official student marksheets, progress report cards, and consolidated green sheets for Rajasthan schools. Free online printable PDF!',
      h1Tag: 'अंकतालिका व ग्रीन शीट जनरेटर: राजस्थान विद्यालय संपूर्ण गाइड',
      slugUrl: '/teacher-marksheet-guide',
      imageAltText: 'Rajasthan official student report card marksheet format showing subject marks, grades, attendance, and signatures'
    },
    overviewHi: 'वार्षिक एवं अर्धवार्षिक परीक्षा के उपरांत कक्षा 1 से 8 (शिविरा ग्रेडिंग) तथा कक्षा 9 व 11 (अंक प्रणाली) हेतु छात्र प्रगति पत्रक (Marksheet) एवं कक्षावार समेकित परिणाम पंजी (Green Sheet) तैयार करना अनिवार्य होता है।',
    overviewEn: 'Following annual examinations, issuing standardized report cards and compiling consolidated green sheet registers are mandatory departmental requirements.',
    prerequisitesHi: [
      'विद्यार्थी का नाम, पिता का नाम, माता का नाम व जन्मतिथि',
      'एसआर नंबर (Scholar Register Number) एवं रोल नंबर',
      'सभी विषयों के परख, अर्द्धवार्षिक व वार्षिक परीक्षा प्राप्तांक'
    ],
    prerequisitesEn: [
      'Student name, parents name, and Date of Birth',
      'SR Number and roll number',
      'Subject-wise test, half-yearly, and annual marks'
    ],
    keyBenefitsHi: [
      'राजस्थान शिक्षा विभागीय नियमों अनुसार ऑटो-ग्रेडिंग (A+, A, B, C, D)',
      'एक साथ पूरी कक्षा की अंकतालिकाएं एक क्लिक में पीडीएफ डाउनलोड',
      'संस्थाप्रधान, कक्षाध्यापक के हस्ताक्षर एवं विद्यालय मुहर का सुव्यवस्थित स्थान'
    ],
    keyBenefitsEn: [
      'Automatic grading (A+, A, B, C, D) adhering strictly to departmental norms',
      'Batch generation of entire class report cards in a single PDF file',
      'Designated signature blocks for Principal, Class Teacher, and official seal'
    ],
    steps: [
      {
        stepNum: 1,
        titleHi: 'अंकतालिका जनरेटर खोलें',
        titleEn: 'Open Marksheet Generator',
        descriptionHi: 'शिक्षक संवर्ग से "अंकतालिका जनरेटर" चुनें।',
        descriptionEn: 'Select Marksheet Generator from Teacher Modules.',
        tipHi: 'कक्षा 1-5 (प्राथमिक), 6-8 (उच्च प्राथमिक) या 9/11 (माध्यमिक) चुनें।',
        tipEn: 'Pick Class 1-5, 6-8, or 9/11 layout.'
      },
      {
        stepNum: 2,
        titleHi: 'विद्यार्थी अंक दर्ज करें अथवा लोड करें',
        titleEn: 'Enter or Load Student Marks',
        descriptionHi: 'विद्यार्थियों के सभी विषयों के प्राप्तांक भरें अथवा कक्षा अध्यापक मॉड्यूल से सीधे इंपोर्ट करें।',
        descriptionEn: 'Fill subject marks or import directly from Class Teacher module records.',
        tipHi: 'कुल प्राप्तांक एवं प्रतिशत स्वतः गणना हो जाते हैं।',
        tipEn: 'Total marks, percentages, and division/grades calculate automatically.'
      },
      {
        stepNum: 3,
        titleHi: 'रंगीन अंकतालिकाएं प्रिंट करें',
        titleEn: 'Print High-Res Marksheets',
        descriptionHi: '"अंकतालिकाएं डाउनलोड करें" पर क्लिक करें। ए4 साइज में सुंदर बॉर्डर एवं लोगो सहित प्रिंट प्राप्त करें।',
        descriptionEn: 'Click Download Marksheets. Export clean, bordered A4 report cards ready for distribution.',
        tipHi: 'ग्रीन शीट टैब से समेकित परिणाम रजिस्टर भी प्रिंट करें।',
        tipEn: 'Switch to Green Sheet tab to print the consolidated class register.'
      }
    ],
    relatedGuides: [
      { id: 'teacher-classteacher-guide', titleHi: 'कक्षा अध्यापक टूलकिट', titleEn: 'Class Teacher Toolkit', categoryHi: 'शिक्षक संवर्ग' },
      { id: 'incharge-exam-guide', titleHi: 'परीक्षा प्रभारी गाइड', titleEn: 'Exam Incharge Guide', categoryHi: 'प्रभारी दायित्व' }
    ],
    internalToolLinks: [
      { toolId: 'teacher-marksheet', nameHi: 'अंकतालिका जनरेटर', nameEn: 'Marksheet Maker', descriptionHi: 'प्रगति पत्रक व ग्रीन शीट एक क्लिक में प्रिंट करें' }
    ],
    faqItems: [
      {
        questionHi: 'क्या कक्षा 1 से 8 में केवल ग्रेडिंग मान्य है?',
        questionEn: 'Is grading strictly mandated for Classes 1 to 8?',
        answerHi: 'हाँ, शिक्षा का अधिकार अधिनियम (RTE) अनुसार कक्षा 1 से 8 तक अंकों के स्थान पर 5-बिंदु ग्रेडिंग प्रणाली (A+, A, B, C, D) लागू है।',
        answerEn: 'Yes, under RTE guidelines, Classes 1 to 8 utilize a 5-point grading system (A+, A, B, C, D) rather than raw marks.'
      }
    ]
  },
  {
    id: 'teacher-anomaly-guide',
    toolId: 'teacher-anomaly',
    categoryKey: 'teacher',
    categoryHi: 'शिक्षक संवर्ग',
    categoryEn: 'Teacher Modules',
    titleHi: 'छात्र आधार, जन-आधार एवं अपार (APAAR) विसंगति समाधान ट्रैकर गाइड',
    titleEn: 'Student Aadhaar, Jan-Aadhaar & APAAR Discrepancy Rectifier Guide',
    readTime: '3 मिनट',
    updatedDate: '2026-08-15',
    iconName: 'ShieldAlert',
    summaryHi: 'शाला दर्पण पर नाम, जन्मतिथि, लिंग एवं जन-आधार मिसमैच के कारण अटके प्रमाणीकरण का चरणबद्ध समाधान एवं अभिभावक नोटिस जनरेटर।',
    summaryEn: 'Step-by-step resolution for student Aadhaar/Jan-Aadhaar name, DOB, and gender mismatches, with printable parent rectification notice.',
    seoMeta: {
      titleTag: 'Student Aadhaar Jan Aadhaar Mismatch Resolver | Shala Sahayak',
      metaDescription: 'Fix student Aadhaar, Jan Aadhaar, and APAAR mismatches in Rajasthan schools. Generate parent rectification notices for e-Mitra updates free!',
      h1Tag: 'आधार व जन-आधार विसंगति समाधान: शाला दर्पण संपूर्ण गाइड',
      slugUrl: '/teacher-anomaly-guide',
      imageAltText: 'Student Aadhaar and Jan-Aadhaar mismatch resolution dashboard showing error causes and e-Mitra correction notices'
    },
    overviewHi: 'शाला दर्पण पर विद्यार्थियों के आधार/जन-आधार में नाम, पिता का नाम अथवा जन्मतिथि में मामूली स्पेलिंग अंतर के कारण प्रमाणीकरण असफल हो जाता है। इससे छात्रवृत्ति एवं डीबीटी भुगतान रुक जाता है। यह टूल इन विसंगतियों का तुरंत पता लगाकर समाधान करता है।',
    overviewEn: 'Spelling, gender, or DOB mismatches between school records and Aadhaar/Jan-Aadhaar databases block DBT welfare benefits. This tool pinpoints root causes and generates correction notices.',
    prerequisitesHi: [
      'विद्यार्थी का शाला दर्पण एसआर रजिस्टर रिकॉर्ड',
      'विद्यार्थी का आधार कार्ड एवं जन-आधार कार्ड की प्रति',
      'शाला दर्पण ऑथेंटिकेशन एरर कोड'
    ],
    prerequisitesEn: [
      'Student school SR register bio-data',
      'Student physical Aadhaar card and Jan-Aadhaar copy',
      'Shala Darpan authentication rejection error code'
    ],
    keyBenefitsHi: [
      'मिसमैच के सटीक कारण (नाम स्पेलिंग, जन्मतिथि, लिंग) की तुरंत पहचान',
      'ई-मित्र पर सुधार करवाने हेतु अभिभावक को देने योग्य आधिकारिक नोटिस पत्र',
      'विसंगति दूर होने तक फॉलो-अप स्टेटस ट्रैकिंग'
    ],
    keyBenefitsEn: [
      'Pinpoint discrepancy causes (name spelling, DOB format, gender)',
      'Printable parent formal notice for updating records at e-Mitra kiosks',
      'Follow-up resolution tracker until 100% verification is achieved'
    ],
    steps: [
      {
        stepNum: 1,
        titleHi: 'विसंगति समाधान मॉड्यूल खोलें',
        titleEn: 'Open Discrepancy Module',
        descriptionHi: 'शिक्षक संवर्ग से "आधार/जनआधार विसंगति" चुनें।',
        descriptionEn: 'Select Aadhaar Mismatch from Teacher Modules.',
        tipHi: 'कक्षा चुनकर अप्रमाणित छात्रों की सूची लोड करें।',
        tipEn: 'Pick class to filter pending unverified students.'
      },
      {
        stepNum: 2,
        titleHi: 'अंतर की पहचान करें',
        titleEn: 'Diagnose Discrepancy Cause',
        descriptionHi: 'शाला दर्पण रिकॉर्ड तथा आधार कार्ड में नाम व जन्मतिथि का तुलनात्मक मिलान देखें।',
        descriptionEn: 'Compare side-by-side school register fields against official Aadhaar data.',
        tipHi: 'यदि विद्यालय रिकॉर्ड में गलती है तो टीसी/एसआर अनुसार संशोधन करें।',
        tipEn: 'If school record holds a typo, update via Shala Darpan student edit tab.'
      },
      {
        stepNum: 3,
        titleHi: 'ई-मित्र सुधार नोटिस प्रिंट कर अभिभावक को दें',
        titleEn: 'Print e-Mitra Parent Notice',
        descriptionHi: 'अभिभावक को ई-मित्र पर जाकर आधार/जन-आधार में सुधार करवाने हेतु नोटिस जनरेट कर प्रदान करें।',
        descriptionEn: 'Generate official notice instructing parents on exact field corrections needed at e-Mitra.',
        tipHi: 'सुधार के उपरांत शाला दर्पण पर पुनः ऑथेंटिकेट बटन दबाएं।',
        tipEn: 'Re-trigger authentication on Shala Darpan once parent brings updated slip.'
      }
    ],
    relatedGuides: [
      { id: 'peeo-pramanikaran-guide', titleHi: 'प्रमाणीकरण रिपोर्ट हब', titleEn: 'Verification Hub', categoryHi: 'पीईईओ टूल्स' },
      { id: 'teacher-classteacher-guide', titleHi: 'कक्षा अध्यापक टूलकिट', titleEn: 'Class Teacher Toolkit', categoryHi: 'शिक्षक संवर्ग' }
    ],
    internalToolLinks: [
      { toolId: 'teacher-anomaly', nameHi: 'विसंगति समाधान टूल', nameEn: 'Anomaly Resolver', descriptionHi: 'आधार व अपार विसंगति का तुरंत समाधान करें' },
      { toolId: 'peeo-pramanikaran', nameHi: 'प्रमाणीकरण रिपोर्ट हब', nameEn: 'Verification Hub', descriptionHi: 'विद्यालय प्रमाणीकरण प्रगति रिपोर्ट देखें' }
    ],
    faqItems: [
      {
        questionHi: 'यदि आधार में जन्मतिथि गलत है तो सुधार हेतु क्या दस्तावेज़ चाहिए?',
        questionEn: 'What documents are required to correct DOB in Aadhaar?',
        answerHi: 'संस्थाप्रधान द्वारा प्रमाणित जन्मतिथि प्रमाण पत्र अथवा नगर निगम जन्म प्रमाण पत्र के आधार पर ई-मित्र/आधार केंद्र पर संशोधन कराया जा सकता है।',
        answerEn: 'Headmaster-attested institutional certificate or municipal birth certificate can be submitted at Aadhaar centers.'
      }
    ]
  }
];
