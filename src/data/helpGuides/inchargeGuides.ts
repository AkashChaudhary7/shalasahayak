import { HelpGuide } from '../../types';

export const inchargeGuides: HelpGuide[] = [
  {
    id: 'mdm-guide',
    toolId: 'incharge-mdm',
    categoryKey: 'incharge',
    categoryHi: 'प्रभारी दायित्व',
    categoryEn: 'Incharge Modules',
    titleHi: 'मिड-डे मील (MDM) दैनिक खाद्यान्न, कुकिंग कॉस्ट एवं बाल गोपाल दुग्ध रजिस्टर गाइड',
    titleEn: 'Mid-Day Meal (MDM) Daily Grain, Cooking Cost & Bal Gopal Milk Register Guide',
    readTime: '4 मिनट',
    updatedDate: '2026-08-15',
    iconName: 'Utensils',
    summaryHi: 'प्राथमिक (1-5) एवं उच्च प्राथमिक (6-8) दैनिक गेहूं/चावल खपत, वर्तमान कुकिंग कॉस्ट दरें, कुक-कम-हेल्पर मानदेय एवं मासिक वाउचर बिलिंग।',
    summaryEn: 'Complete calculation guide for MDM daily grain, revised cooking costs, Bal Gopal milk powder, and monthly UC billing.',
    seoMeta: {
      titleTag: 'Rajasthan MDM Cooking Cost & Grain Calculator 2026 | Shala Sahayak',
      metaDescription: 'Auto-calculate daily MDM wheat/rice consumption, revised cooking costs, and Bal Gopal milk powder for Rajasthan schools. Free register PDF print!',
      h1Tag: 'मिड-डे मील (MDM) रजिस्टर व कुकिंग कॉस्ट: राजस्थान संपूर्ण गाइड',
      slugUrl: '/mdm-guide',
      imageAltText: 'Rajasthan MDM daily register format showing primary and upper primary student counts, grain consumption in grams, and cooking cost'
    },
    overviewHi: 'प्रधानमंत्री पोषण शक्ति निर्माण (PM POSHAN) योजना अंतर्गत कक्षा 1 से 8 तक के विद्यार्थियों को गर्म पका हुआ पौष्टिक भोजन एवं सप्ताह में निर्धारित दिवसों पर बाल गोपाल योजना अंतर्गत दूध उपलब्ध कराया जाता है। एमडीएम प्रभारी को दैनिक खाद्यान्न व कुकिंग कॉस्ट रजिस्टर का संधारण अनिवार्य होता है।',
    overviewEn: 'PM POSHAN scheme provides cooked meals and Bal Gopal milk to Class 1-8 students. Incharges maintain daily grain and cooking cost accounts.',
    prerequisitesHi: [
      'कक्षा 1 से 5 (प्राथमिक) एवं 6 से 8 (उच्च प्राथमिक) में आज लाभान्वित छात्र संख्या',
      'प्रारंभिक खाद्यान्न स्टॉक (Opening Stock of Wheat/Rice)',
      'नवीनतम राज्य सरकार कुकिंग कॉस्ट दरें'
    ],
    prerequisitesEn: [
      'Beneficiary student count in Primary (1-5) and Upper Primary (6-8)',
      'Opening stock balance of wheat and rice in kilograms',
      'Latest Rajasthan Government cooking cost rates'
    ],
    keyBenefitsHi: [
      'छात्र संख्या डालते ही गेहूं/चावल एवं कुकिंग कॉस्ट की स्वतः ग्राम व रुपये में सटीक गणना',
      'बाल गोपाल दुग्ध योजना अंतर्गत दूध पाउडर व चीनी की स्वतः मात्रा',
      'मासिक उपयोगिता प्रमाण पत्र (UC) एवं बैंक बिलिंग हेतु तैयार समेकित एक्सेल'
    ],
    keyBenefitsEn: [
      'Instant precise auto-multiplication of grain grams and cooking cost rupees',
      'Bal Gopal milk powder and sugar dosage auto-calculated by student strength',
      'Exportable monthly utilization certificate (UC) and bank billing statement'
    ],
    steps: [
      {
        stepNum: 1,
        titleHi: 'लाभान्वित छात्र संख्या दर्ज करें',
        titleEn: 'Enter Beneficiary Student Counts',
        descriptionHi: 'प्राथमिक वर्ग (कक्षा 1-5) एवं उच्च प्राथमिक वर्ग (कक्षा 6-8) में भोजन करने वाले छात्रों की संख्या डालें।',
        descriptionEn: 'Input served student numbers for Primary (1-5) and Upper Primary (6-8).',
        tipHi: 'शाला दर्पण दैनिक एसएमएस/पोर्टल प्रविष्टि से संख्या का मिलान रखें।',
        tipEn: 'Verify counts match daily Shala Darpan SMS/portal reporting.',
        screenshotPlaceholder: {
          titleHi: 'एमडीएम दैनिक प्रविष्टि स्क्रीन',
          titleEn: 'MDM Daily Calculation Screen',
          type: 'form_input',
          captionHi: 'कक्षा वर्ग अनुसार छात्र संख्या एवं स्वतः परिकलित खाद्यान्न',
          captionEn: 'Student counts and auto-calculated grain/costs',
          mockupData: {
            fields: [
              { label: 'प्राथमिक छात्र (Classes 1-5)', value: '65 विद्यार्थी' },
              { label: 'उच्च प्राथमिक (Classes 6-8)', value: '48 विद्यार्थी' },
              { label: 'कुल गेहूं/चावल खपत (Grain)', value: '13.700 किग्रा', status: 'स्वतः परिकलित' },
              { label: 'दैनिक कुकिंग कॉस्ट (Cost)', value: '₹681.79', status: 'सटीक योग' }
            ]
          }
        }
      },
      {
        stepNum: 2,
        titleHi: 'वार अनुसार मेनू एवं दूध वितरण चुनें',
        titleEn: 'Select Menu & Milk Day',
        descriptionHi: 'आज के वार अनुसार निर्धारित मेनू (सब्जी-रोटी, दाल-चावल) चुनें। यदि आज दूध वितरण दिवस है तो चेकबॉक्स टिक करें।',
        descriptionEn: 'Select weekly scheduled recipe. Toggle the Bal Gopal milk checkbox if today is a milk distribution day.',
        tipHi: 'सप्ताह में सभी कार्य दिवसों पर गर्म दूध वितरण का प्रावधान है।',
        tipEn: 'Milk powder dosage is calibrated at 15g (Primary) and 20g (Upper Primary).'
      },
      {
        stepNum: 3,
        titleHi: 'दैनिक रजिस्टर प्रिंट व संधारित करें',
        titleEn: 'Export & File Daily Register',
        descriptionHi: 'दैनिक या मासिक एमडीएम प्रपत्र डाउनलोड करें। संस्थाप्रधान एवं पोषाहार प्रभारी के हस्ताक्षर करवाकर संधारित करें।',
        descriptionEn: 'Export daily consumption slip or cumulative monthly register in A4 layout for physical records.',
        tipHi: 'माह के अंत में एसएमसी अध्यक्ष के हस्ताक्षर भी अवश्य करवाएं।',
        tipEn: 'Secure SMC president signature on monthly expenditure vouchers.'
      }
    ],
    contentSections: [
      {
        headingLevel: 'h2',
        headingHi: 'राजस्थान एमडीएम खाद्यान्न एवं कुकिंग कॉस्ट निर्धारित मानक तालिका',
        headingEn: 'Rajasthan MDM Official Norms for Grain & Cooking Cost',
        contentHi: 'भारत सरकार एवं राजस्थान स्कूल शिक्षा परिषद द्वारा निर्धारित प्रति छात्र दैनिक मानक निम्नानुसार हैं:',
        contentEn: 'Prescribed per-student daily allocation norms under PM POSHAN Rajasthan:',
        tableData: {
          headersHi: ['मद का विवरण', 'प्राथमिक वर्ग (कक्षा 1-5)', 'उच्च प्राथमिक वर्ग (कक्षा 6-8)'],
          headersEn: ['Item Description', 'Primary Group (1-5)', 'Upper Primary Group (6-8)'],
          rowsHi: [
            ['खाद्यान्न मात्रा (गेहूं / चावल)', '100 ग्राम प्रति छात्र', '150 ग्राम प्रति छात्र'],
            ['कुकिंग कॉस्ट दर (प्रति छात्र)', '₹5.45 प्रति छात्र', '₹8.17 प्रति छात्र'],
            ['दूध पाउडर मात्रा (बाल गोपाल)', '15 ग्राम प्रति छात्र (150 मि.ली.)', '20 ग्राम प्रति छात्र (200 मि.ली.)'],
            ['दैनिक चीनी मात्रा (दूध हेतु)', '8.4 ग्राम प्रति छात्र', '10.2 ग्राम प्रति छात्र']
          ],
          rowsEn: [
            ['Food Grain (Wheat/Rice)', '100 Grams per student', '150 Grams per student'],
            ['Cooking Cost Rate', '₹5.45 per student', '₹8.17 per student'],
            ['Milk Powder (Bal Gopal)', '15 Grams per student (150 ml)', '20 Grams per student (200 ml)'],
            ['Sugar Quantity (Milk)', '8.4 Grams per student', '10.2 Grams per student']
          ]
        }
      }
    ],
    relatedGuides: [
      { id: 'peeo-incharge-guide', titleHi: 'प्रभारी मैपिंग आदेश', titleEn: 'Incharge Mapping Orders', categoryHi: 'पीईईओ टूल्स' },
      { id: 'peeo-orders-guide', titleHi: 'पीईईओ प्रशासनिक आदेश', titleEn: 'PEEO Orders Generator', categoryHi: 'पीईईओ टूल्स' }
    ],
    internalToolLinks: [
      { toolId: 'incharge-mdm', nameHi: 'एमडीएम प्रभारी टूल', nameEn: 'MDM Incharge Module', descriptionHi: 'दैनिक खाद्यान्न व कुकिंग कॉस्ट की स्वतः गणना करें' }
    ],
    faqItems: [
      {
        questionHi: 'कुक-कम-हेल्पर (रसोइया) का मानदेय कितना है?',
        questionEn: 'What is the honorarium for Cook-cum-Helpers?',
        answerHi: 'राजस्थान में रसोइया-कम-हेल्पर को राज्य बजट घोषणा अनुसार मानदेय का भुगतान डीबीटी अथवा बैंक खाते में सीधे किया जाता है।',
        answerEn: 'Cook-cum-helpers receive honorarium directly remitted to their bank accounts per state budget norms.'
      }
    ]
  },
  {
    id: 'incharge-exam-guide',
    toolId: 'incharge-exam',
    categoryKey: 'incharge',
    categoryHi: 'प्रभारी दायित्व',
    categoryEn: 'Incharge Modules',
    titleHi: 'परीक्षा प्रभारी (Exam Incharge) बैठक व्यवस्था (Seating Plan) एवं वीक्षक ड्यूटी रोस्टर गाइड',
    titleEn: 'Exam Incharge Seating Matrix, Invigilator Duty Roster & Schedule Planner Guide',
    readTime: '4 मिनट',
    updatedDate: '2026-08-15',
    iconName: 'Layers',
    summaryHi: 'बोर्ड एवं स्थानीय परीक्षाओं हेतु कमरावार रोल नंबर बैठक व्यवस्था (Seating Matrix), वीक्षक ड्यूटी रोस्टर एवं समय-सारणी तैयार करने की संपूर्ण मार्गदर्शिका।',
    summaryEn: 'Comprehensive guide for board and internal school exams: room-wise roll number seating matrix, invigilator duty roster, and exam bell timetable.',
    seoMeta: {
      titleTag: 'Exam Seating Plan & Invigilator Duty Roster Generator | Shala Sahayak',
      metaDescription: 'Generate official school exam room seating plans, student roll lists per bench, and teacher invigilator duty rosters in Rajasthan. Free A4 PDF print!',
      h1Tag: 'परीक्षा प्रभारी टूलकिट: बैठक व्यवस्था व वीक्षक ड्यूटी संपूर्ण गाइड',
      slugUrl: '/incharge-exam-guide',
      imageAltText: 'School exam room seating plan layout showing two students per desk and teacher invigilator assignment roster'
    },
    overviewHi: 'अर्द्धवार्षिक, वार्षिक एवं बोर्ड परीक्षाओं के सुचारु व नकल-विहीन संचालन हेतु परीक्षा प्रभारी द्वारा कमरावार बैठक व्यवस्था, रोल नंबर स्लिप, प्रश्न-पत्र वितरण योजना एवं वीक्षकों का निष्पक्ष ड्यूटी रोस्टर तैयार किया जाता है।',
    overviewEn: 'Exam incharges orchestrate room-wise seating matrices, bench roll labels, question paper distribution sheets, and impartial invigilator rosters.',
    prerequisitesHi: [
      'कक्षावार परीक्षा में प्रविष्ट होने वाले विद्यार्थियों के रोल नंबर',
      'उपलब्ध परीक्षा कक्षों की संख्या एवं प्रत्येक कमरे में बेंचों की संख्या',
      'उपलब्ध वीक्षक (Invigilator) शिक्षकों की सूची'
    ],
    prerequisitesEn: [
      'Class-wise student roll number ranges',
      'Available exam rooms and desks per room',
      'List of available teaching staff for invigilation'
    ],
    keyBenefitsHi: [
      'एक बेंच पर दो अलग-अलग कक्षाओं के छात्र बैठाने की जिग-जैग (Zig-Zag) व्यवस्था',
      'कमरे के प्रवेश द्वार पर चस्पा करने योग्य कमरावार बैठक चार्ट (Room Chart)',
      'शिक्षकों का पारदर्शी एवं समान वीक्षक ड्यूटी आवंटन (Invigilator Roster)'
    ],
    keyBenefitsEn: [
      'Automated zig-zag seating interspersing students of different classes per desk',
      'Printable door seating notices showing roll number ranges per room',
      'Fair, balanced rotation of teacher invigilation duty hours'
    ],
    steps: [
      {
        stepNum: 1,
        titleHi: 'परीक्षा व कमरा विवरण भरें',
        titleEn: 'Enter Exam & Room Capacity',
        descriptionHi: 'परीक्षा का नाम (उदा. अर्द्धवार्षिक 2026), कमरे संख्या एवं प्रति कमरा बेंच क्षमता दर्ज करें।',
        descriptionEn: 'Input exam name, available room numbers, and benches per room.',
        tipHi: 'प्रति बेंच दो छात्रों की बैठक क्षमता मानक मानी जाती है।',
        tipEn: 'Standard seating configuration allocates 2 students per desk.'
      },
      {
        stepNum: 2,
        titleHi: 'रोल नंबर रेंज जोड़ें व स्वतः आवंटन करें',
        titleEn: 'Input Roll Numbers & Auto-Allocate',
        descriptionHi: 'कक्षावार प्रारम्भिक एवं अंतिम रोल नंबर डालें। सिस्टम स्वतः जिग-जैग क्रम में कमरे आवंटित कर देगा।',
        descriptionEn: 'Enter starting and ending roll numbers per class. The algorithm maps students into rooms automatically.',
        tipHi: 'नकल रोकने हेतु कक्षा 9 के साथ कक्षा 11 के छात्र एक बेंच पर मैप करें।',
        tipEn: 'Pair Class 9 with Class 11 students on the same bench to prevent copying.'
      },
      {
        stepNum: 3,
        titleHi: 'बैठक चार्ट व ड्यूटी रोस्टर प्रिंट करें',
        titleEn: 'Print Door Charts & Duty Roster',
        descriptionHi: 'प्रत्येक कमरे के बाहर चस्पा करने वाला बैठक चार्ट, डेस्क रोल नंबर स्लिप एवं केंद्राधीक्षक फाइल हेतु समेकित रजिस्टर प्रिंट करें।',
        descriptionEn: 'Print room door display charts, desk slips, and the Superintendent master summary register in clean A4.',
        tipHi: 'वीक्षक रजिस्टर पर शिक्षकों के प्रतिदिन हस्ताक्षर करवाएं।',
        tipEn: 'Maintain daily signatures on physical invigilator reporting sheet.'
      }
    ],
    relatedGuides: [
      { id: 'teacher-marksheet-guide', titleHi: 'अंकतालिका व ग्रीन शीट जनरेटर', titleEn: 'Marksheet Generator', categoryHi: 'शिक्षक संवर्ग' },
      { id: 'peeo-orders-guide', titleHi: 'पीईईओ आदेश जनरेटर', titleEn: 'PEEO Orders Generator', categoryHi: 'पीईईओ टूल्स' }
    ],
    internalToolLinks: [
      { toolId: 'incharge-exam', nameHi: 'परीक्षा प्रभारी टूल', nameEn: 'Exam Incharge Module', descriptionHi: 'कमरा बैठक व्यवस्था व वीक्षक रोस्टर बनाएं' }
    ],
    faqItems: [
      {
        questionHi: 'क्या बोर्ड परीक्षा में कमरावार सिटिंग प्लान का संधारण अनिवार्य है?',
        questionEn: 'Is a room seating plan mandatory for Board examinations?',
        answerHi: 'हाँ, माध्यमिक शिक्षा बोर्ड राजस्थान (RBSE) नियमों अनुसार प्रत्येक पारी का कमरावार सिटिंग प्लान परीक्षा केंद्र की गोपनीय पत्रावली में सुरक्षित रखना अनिवार्य है।',
        answerEn: 'Yes, RBSE board rules mandate preserving room seating charts in confidential exam center files.'
      }
    ]
  },
  {
    id: 'incharge-transport-guide',
    toolId: 'incharge-transport',
    categoryKey: 'incharge',
    categoryHi: 'प्रभारी दायित्व',
    categoryEn: 'Incharge Modules',
    titleHi: 'ट्रांसपोर्ट वाउचर (Transport Voucher) योजना दूरी मैपिंग एवं डीबीटी पात्रता गाइड',
    titleEn: 'Transport Voucher Scheme Student Distance Mapping & DBT Eligibility Guide',
    readTime: '3 मिनट',
    updatedDate: '2026-08-15',
    iconName: 'Bus',
    summaryHi: 'कक्षा 1 से 8 (बालक/बालिका) एवं कक्षा 9 से 12 (बालिकाएं) हेतु निर्धारित दूरी से अधिक निवास करने पर डीबीटी ट्रांसपोर्ट वाउचर राशि की गणना व प्रमाणीकरण।',
    summaryEn: 'Guide to distance mapping, eligibility verification, attendance days calculation, and DBT payment sheets for Transport Voucher Scheme.',
    seoMeta: {
      titleTag: 'Rajasthan School Transport Voucher Scheme Calculator | Shala Sahayak',
      metaDescription: 'Calculate transport voucher DBT amounts for eligible Rajasthan school students based on residence distance and working attendance days free!',
      h1Tag: 'ट्रांसपोर्ट वाउचर योजना: दूरी मैपिंग व डीबीटी गणना संपूर्ण गाइड',
      slugUrl: '/incharge-transport-guide',
      imageAltText: 'Transport voucher eligible student list showing village distance, attendance days, and DBT bank account details'
    },
    overviewHi: 'ग्रामीण एवं दूरदराज के क्षेत्रों में विद्यालय निवास स्थान से दूर होने पर बालकों/बालिकाओं को शिक्षा से जोड़े रखने हेतु राजस्थान सरकार द्वारा प्रतिदिन उपस्थिति अनुसार ट्रांसपोर्ट वाउचर भत्ता डीबीटी के माध्यम से दिया जाता है।',
    overviewEn: 'Transport Voucher scheme provides per-day financial travel assistance via DBT to rural students residing beyond prescribed distances from school.',
    prerequisitesHi: [
      'विद्यार्थी के निवास ग्राम से विद्यालय की वास्तविक दूरी (किमी में)',
      'सत्र के कार्य दिवसों में छात्र/छात्रा की वास्तविक उपस्थिति दिवस',
      'विद्यार्थी अथवा माता का जनाधार से लिंक सक्रिय बैंक खाता'
    ],
    prerequisitesEn: [
      'Physical distance from student village to school in kilometers',
      'Actual attendance days during academic reporting period',
      'Active Jan-Aadhaar linked DBT bank account'
    ],
    keyBenefitsHi: [
      'कक्षा 1-5 (1 किमी+), 6-8 (2 किमी+) एवं 9-12 (5 किमी+ बालिकाएं) पात्रता की स्वतः जांच',
      'उपस्थिति दिवस x निर्धारित दैनिक दर से सटीक वाउचर राशि की स्वतः गणना',
      'सीबीईओ कार्यालय को प्रेषित करने योग्य डीबीटी सत्यापन सूची'
    ],
    keyBenefitsEn: [
      'Auto-verification of distance norms: 1-5 (1km+), 6-8 (2km+), 9-12 (5km+ girls)',
      'Automatic calculation: Attendance days x per-day allowance rate',
      'Printable DBT reimbursement proposal ready for CBEO approval'
    ],
    steps: [
      {
        stepNum: 1,
        titleHi: 'ट्रांसपोर्ट वाउचर प्रभाग खोलें',
        titleEn: 'Open Transport Voucher Module',
        descriptionHi: 'प्रभारी प्रभाग से "ट्रांसपोर्ट वाउचर" चुनें।',
        descriptionEn: 'Select Transport Voucher from Incharge Modules.',
        tipHi: 'कक्षा वर्ग (प्राथमिक, उच्च प्राथमिक या माध्यमिक) का चयन करें।',
        tipEn: 'Pick Primary, Upper Primary, or Secondary class group.'
      },
      {
        stepNum: 2,
        titleHi: 'दूरी एवं उपस्थिति दिवस दर्ज करें',
        titleEn: 'Enter Distance & Attendance Days',
        descriptionHi: 'विद्यार्थी के गांव का नाम, दूरी (किमी) एवं माह के उपस्थिति दिवस भरें। पात्र राशि स्वतः आ जाएगी।',
        descriptionEn: 'Input residential village, distance in km, and monthly attended school days.',
        tipHi: 'छात्र की उपस्थिति शाला दर्पण मासिक उपस्थिति रजिस्टर अनुसार ही भरें।',
        tipEn: 'Ensure attendance strictly matches monthly Shala Darpan registers.'
      },
      {
        stepNum: 3,
        titleHi: 'डीबीटी प्रस्ताव पत्रक प्रिंट करें',
        titleEn: 'Export DBT Proposal Form',
        descriptionHi: 'समेकित भुगतान आदेश पत्रक प्रिंट कर संस्थाप्रधान के हस्ताक्षर करवाएं और सीबीईओ पोर्टल पर सबमिट करें।',
        descriptionEn: 'Print consolidated DBT proposal, obtain Headmaster seal, and forward to CBEO office.',
        tipHi: 'बैंक खाता जन-आधार से लिंक होना अनिवार्य है।',
        tipEn: 'Verify Jan-Aadhaar bank mapping to prevent DBT transaction failure.'
      }
    ],
    relatedGuides: [
      { id: 'incharge-scholarship-guide', titleHi: 'छात्रवृत्ति ट्रैकर गाइड', titleEn: 'Scholarship Tracker', categoryHi: 'प्रभारी दायित्व' },
      { id: 'teacher-anomaly-guide', titleHi: 'आधार व अपार विसंगति समाधान', titleEn: 'Anomaly Resolver', categoryHi: 'शिक्षक संवर्ग' }
    ],
    internalToolLinks: [
      { toolId: 'incharge-transport', nameHi: 'ट्रांसपोर्ट वाउचर टूल', nameEn: 'Transport Voucher Module', descriptionHi: 'पात्र छात्र सूची व डीबीटी राशि स्वतः परिकलित करें' }
    ],
    faqItems: [
      {
        questionHi: 'कक्षा 9 से 12 की बालिकाओं हेतु क्या दूरी मानक है?',
        questionEn: 'What is the distance norm for girls in Classes 9 to 12?',
        answerHi: 'कक्षा 9 से 12 की बालिकाओं के निवास से विद्यालय की दूरी 5 किलोमीटर से अधिक होने पर प्रतिदिन ₹20 की दर से ट्रांसपोर्ट वाउचर देय है।',
        answerEn: 'Girls in Classes 9 to 12 residing more than 5 km away receive ₹20 per day attended.'
      }
    ]
  },
  {
    id: 'incharge-scholarship-guide',
    toolId: 'incharge-scholarship',
    categoryKey: 'incharge',
    categoryHi: 'प्रभारी दायित्व',
    categoryEn: 'Incharge Modules',
    titleHi: 'छात्रवृत्ति (Scholarship) ट्रैकर: पूर्व एवं उत्तर मैट्रिक आवेदन सत्यापन मार्गदर्शिका',
    titleEn: 'School Scholarship Tracker: Pre & Post Matric Verification Guide',
    readTime: '4 मिनट',
    updatedDate: '2026-08-15',
    iconName: 'Award',
    summaryHi: 'एससी, एसटी, ओबीसी, ईडब्ल्यूएस एवं अल्पसंख्यक छात्रवृत्ति, प्री-मैट्रिक व पोस्ट-मैट्रिक छात्र आवेदन, जनाधार बैंक सत्यापन व लॉक प्रक्रिया।',
    summaryEn: 'Track Pre-Matric and Post-Matric SC/ST/OBC/Minority/EWS scholarship applications, Jan-Aadhaar bank account verification, and final submission.',
    seoMeta: {
      titleTag: 'Rajasthan School Scholarship Tracker Pre & Post Matric | Shala Sahayak',
      metaDescription: 'Track Pre-Matric and Post-Matric scholarship application verification on Shala Darpan. Verify Jan-Aadhaar bank accounts and generate eligibility lists free!',
      h1Tag: 'छात्रवृत्ति ट्रैकर: प्री व पोस्ट मैट्रिक सत्यापन संपूर्ण मार्गदर्शिका',
      slugUrl: '/incharge-scholarship-guide',
      imageAltText: 'Shala Darpan Scholarship application tracker showing verified, pending, and rejected student records'
    },
    overviewHi: 'सामाजिक न्याय एवं अधिकारिता विभाग तथा शिक्षा विभाग द्वारा संचालित विभिन्न छात्रवृत्ति योजनाओं के तहत पात्र विद्यार्थियों के आवेदन शाला दर्पण छात्रवृत्ति मॉड्यूल पर समयबद्ध रूप से सत्यापित एवं लॉक करना छात्रवृत्ति प्रभारी का मुख्य कर्तव्य है।',
    overviewEn: 'Scholarship incharges verify eligibility criteria, annual family income certificates, caste validity, and authenticate DBT bank accounts on Shala Darpan.',
    prerequisitesHi: [
      'विद्यार्थी का जाति प्रमाण पत्र (Caste Certificate) एवं आय प्रमाण पत्र',
      'माता/पिता का सक्रिय जनाधार कार्ड एवं बैंक खाता',
      'विगत कक्षा की अंकतालिका एवं 60% या न्यूनतम प्राप्तांक'
    ],
    prerequisitesEn: [
      'Student valid caste certificate and parental income certificate',
      'Active Jan-Aadhaar bank linkage',
      'Previous class marksheet verifying minimum percentage criteria'
    ],
    keyBenefitsHi: [
      'जाति, आय एवं कक्षा अनुसार छात्रवृत्ति योजना की स्वतः पात्रता जांच',
      'लंबित (Pending), सत्यापित (Verified) एवं निरस्त (Rejected) आवेदनों का स्पष्ट डैशबोर्ड',
      'संस्थाप्रधान व सीबीईओ को भेजने हेतु श्रेणीवार समेकित प्रमाणीकरण सूची'
    ],
    keyBenefitsEn: [
      'Automated scheme eligibility filtering based on caste, class, and family income',
      'Crystal-clear dashboard distinguishing Pending, Verified, and Rejected records',
      'Category-wise consolidated verification statement for Headmaster and CBEO'
    ],
    steps: [
      {
        stepNum: 1,
        titleHi: 'छात्रवृत्ति ट्रैकर खोलें',
        titleEn: 'Open Scholarship Tracker',
        descriptionHi: 'प्रभारी प्रभाग से "छात्रवृत्ति ट्रैकर" चुनें।',
        descriptionEn: 'Select Scholarship Tracker from Incharge Modules menu.',
        tipHi: 'प्री-मैट्रिक (कक्षा 1-10) अथवा पोस्ट-मैट्रिक (कक्षा 11-12) चुनें।',
        tipEn: 'Toggle between Pre-Matric (1-10) or Post-Matric (11-12).'
      },
      {
        stepNum: 2,
        titleHi: 'दस्तावेज़ सत्यापन एवं स्थिति अपडेट करें',
        titleEn: 'Verify Documents & Update Status',
        descriptionHi: 'आय प्रमाण पत्र, जाति प्रमाण पत्र व बैंक खाते की जाँच कर सत्यापित (Verified) पर क्लिक करें।',
        descriptionEn: 'Scrutinize income affidavit, caste validity, and bank account, then mark as Verified.',
        tipHi: 'यदि बैंक खाता सक्रिय नहीं है तो छात्र को ई-मित्र पर जन-आधार अपडेट कराने का निर्देश दें।',
        tipEn: 'Advise parents to update Jan-Aadhaar at e-Mitra if bank accounts fail verification.'
      },
      {
        stepNum: 3,
        titleHi: 'प्रमाणीकरण सूची डाउनलोड करें',
        titleEn: 'Export Verification Statement',
        descriptionHi: 'समेकित छात्रवृत्ति सूची प्रिंट करें और संस्थाप्रधान के हस्ताक्षर उपरांत शाला दर्पण पर लॉक करें।',
        descriptionEn: 'Print consolidated scholarship roster and lock applications on Shala Darpan before the final cutoff.',
        tipHi: 'अंतिम तिथि से कम से कम 3 दिन पूर्व लॉक प्रक्रिया पूर्ण करें।',
        tipEn: 'Complete portal locking at least 3 days ahead of departmental deadline.'
      }
    ],
    relatedGuides: [
      { id: 'incharge-transport-guide', titleHi: 'ट्रांसपोर्ट वाउचर योजना', titleEn: 'Transport Voucher Guide', categoryHi: 'प्रभारी दायित्व' },
      { id: 'teacher-anomaly-guide', titleHi: 'आधार व अपार विसंगति समाधान', titleEn: 'Anomaly Resolver', categoryHi: 'शिक्षक संवर्ग' }
    ],
    internalToolLinks: [
      { toolId: 'incharge-scholarship', nameHi: 'छात्रवृत्ति ट्रैकर टूल', nameEn: 'Scholarship Module', descriptionHi: 'छात्रवृत्ति आवेदन सत्यापन व पात्रता ट्रैक करें' }
    ],
    faqItems: [
      {
        questionHi: 'जन-आधार बैंक खाता न होने पर क्या छात्रवृत्ति का भुगतान हो सकता है?',
        questionEn: 'Can scholarship be disbursed without a Jan-Aadhaar mapped bank account?',
        answerHi: 'नहीं, राजस्थान सरकार की समस्त डीबीटी योजनाओं में भुगतान केवल जन-आधार से जुड़े परिवार/छात्र के बैंक खाते में ही होता है।',
        answerEn: 'No, all state DBT welfare schemes strictly require an active Jan-Aadhaar linked bank account.'
      }
    ]
  },
  {
    id: 'incharge-assembly-guide',
    toolId: 'incharge-assembly',
    categoryKey: 'incharge',
    categoryHi: 'प्रभारी दायित्व',
    categoryEn: 'Incharge Modules',
    titleHi: 'प्रार्थना सभा प्रभारी (Assembly) दैनिक प्रार्थना, सामान्य ज्ञान व योगाभ्यास गाइड',
    titleEn: 'School Morning Assembly Incharge Prayers, Daily GK & Yoga Guide',
    readTime: '3 मिनट',
    updatedDate: '2026-08-15',
    iconName: 'BookOpen',
    summaryHi: 'दैनिक विद्यालय प्रार्थना सभा की समय-सारणी, राष्ट्रगान, प्रतिज्ञा, दैनिक विचार, सामान्य ज्ञान प्रश्नोत्तरी, प्रेरक प्रसंग एवं योगाभ्यास संधारण।',
    summaryEn: 'Plan and conduct structured school morning assemblies: National Anthem, pledge, daily inspirational thought, news headlines, and student yoga.',
    seoMeta: {
      titleTag: 'School Morning Assembly Prayers GK & Yoga Guide Rajasthan | Shala Sahayak',
      metaDescription: 'Organize daily school morning prayer assemblies in Rajasthan: National Anthem, pledge, daily thoughts, moral stories, and yoga routines free!',
      h1Tag: 'प्रार्थना सभा प्रभारी (Assembly): दैनिक प्रार्थना व सामान्य ज्ञान संपूर्ण गाइड',
      slugUrl: '/incharge-assembly-guide',
      imageAltText: 'School morning prayer assembly order of events showing prayer hymns, pledge, daily news, and moral story'
    },
    overviewHi: 'विद्यालय में दिन की शुरुआत अनुशासित एवं प्रेरक प्रार्थना सभा से होती है। शिविरा पंचांग अनुसार 20 से 30 मिनट की प्रार्थना सभा में प्रार्थना गीत, प्रतिज्ञा, राष्ट्रगान, दैनिक समाचार, विचार एवं योगाभ्यास का क्रमबद्ध संचालन प्रार्थना प्रभारी का दायित्व होता है।',
    overviewEn: 'A well-structured morning assembly sets a positive moral and disciplinary tone. Incharges coordinate the daily sequence of prayers, thought, news, and physical drills.',
    prerequisitesHi: [
      'विद्यालय प्रार्थना सभा का 25 मिनट का समय विभाजन',
      'दैनिक प्रार्थना गीत, प्रतिज्ञा एवं राष्ट्रगान',
      'आज का विचार, प्रेरक प्रसंग एवं सामान्य ज्ञान प्रश्नोत्तरी'
    ],
    prerequisitesEn: [
      '25-minute assembly bell schedule',
      'Official prayer hymns, pledge text, and National Anthem',
      'Thought of the day, news highlights, and daily GK quiz'
    ],
    keyBenefitsHi: [
      'शिविरा पंचांग अनुसार क्रमबद्ध प्रार्थना सभा संचालन सूची (Order of Assembly)',
      'प्रतिदिन अद्यतन सामान्य ज्ञान प्रश्न, प्रेरक प्रसंग एवं सुविचार बैंक',
      'हाउसवार (सदनवार) विद्यार्थियों की प्रस्तुति रोस्टर'
    ],
    keyBenefitsEn: [
      'Standardized order of events compliant with Shivira calendar norms',
      'Rich bank of daily inspirational thoughts, moral stories, and GK questions',
      'House-wise weekly student presentation duty roster'
    ],
    steps: [
      {
        stepNum: 1,
        titleHi: 'प्रार्थना सभा मॉड्यूल खोलें',
        titleEn: 'Open Morning Assembly Module',
        descriptionHi: 'प्रभारी प्रभाग से "प्रार्थना सभा प्रभारी (Assembly)" खोलें।',
        descriptionEn: 'Select Assembly Module from Incharge Tools.',
        tipHi: 'आज के दिन अनुसार विचार एवं समाचार स्वतः लोड होते हैं।',
        tipEn: 'Daily thoughts and educational quiz questions refresh each day.'
      },
      {
        stepNum: 2,
        titleHi: 'सदनवार छात्र ड्यूटी तय करें',
        titleEn: 'Assign House Presentation Roster',
        descriptionHi: 'आज प्रार्थना, विचार व समाचार वाचन हेतु जिम्मेदार सदन (टैगोर, प्रताप, रमन, शिवाजी) व छात्र चुनें।',
        descriptionEn: 'Assign student speakers from the designated school house (Tagore, Raman, Pratap, Shivaji).',
        tipHi: 'सभी छात्रों को बोलने का समान अवसर प्रदान करें।',
        tipEn: 'Rotate turns to boost public speaking confidence across all students.'
      },
      {
        stepNum: 3,
        titleHi: 'दैनिक प्रार्थना बुलेटिन प्रिंट करें',
        titleEn: 'Print Daily Assembly Bulletin',
        descriptionHi: 'आज का सुविचार, प्रेरक प्रसंग व 5 जीके प्रश्न एक-क्लिक में प्रिंट कर माइक पर बोलने वाले छात्र को दें।',
        descriptionEn: 'Print single-page daily assembly briefing sheet for the student announcer at the school podium.',
        tipHi: 'सभा समाप्ति पर राष्ट्रगान के समय 52 सेकंड का अनुशासन सुनिश्चित करें।',
        tipEn: 'Maintain absolute discipline during the 52-second National Anthem.'
      }
    ],
    relatedGuides: [
      { id: 'teacher-pti-sports-guide', titleHi: 'शारीरिक शिक्षक बीएमआई व खेलकूद', titleEn: 'PTI Sports Guide', categoryHi: 'शिक्षक संवर्ग' },
      { id: 'shivira-guide', titleHi: 'शिविरा अकादमिक पंचांग', titleEn: 'Shivira Calendar', categoryHi: 'अकादमिक पंचांग' }
    ],
    internalToolLinks: [
      { toolId: 'incharge-assembly', nameHi: 'प्रार्थना सभा मॉड्यूल', nameEn: 'Assembly Module', descriptionHi: 'दैनिक प्रार्थना, सामान्य ज्ञान व विचार बैंक देखें' }
    ],
    faqItems: [
      {
        questionHi: 'प्रार्थना सभा की निर्धारित समयावधि कितनी होती है?',
        questionEn: 'What is the prescribed duration for morning assembly?',
        answerHi: 'शिविरा पंचांग अनुसार ग्रीष्मकाल एवं शीतकाल दोनों में प्रार्थना सभा हेतु सामान्यतः 25 से 30 मिनट का समय निर्धारित है।',
        answerEn: 'Shivira calendar prescribes 25 to 30 minutes for the school morning assembly.'
      }
    ]
  },
  {
    id: 'inspire-guide',
    toolId: 'incharge-inspire',
    categoryKey: 'incharge',
    categoryHi: 'प्रभारी दायित्व',
    categoryEn: 'Incharge Modules',
    titleHi: 'इंस्पायर अवार्ड (Inspire Award MANAK) नामांकन, आइडिया बैंक एवं प्रमाणीकरण पत्र जनरेटर गाइड',
    titleEn: 'Inspire Award MANAK Student Innovation Nominations & Certificate Generator Guide',
    readTime: '4 मिनट',
    updatedDate: '2026-08-15',
    iconName: 'Award',
    summaryHi: 'कक्षा 6 से 10 के विद्यार्थियों के मौलिक वैज्ञानिक नवाचारों का ई-एमआईएएस (E-MIAS) पोर्टल पर ऑनलाइन नामांकन, आइडिया बैंक एवं ₹10,000 डीबीटी सहायता।',
    summaryEn: 'Complete guide for nominating Class 6-10 student scientific innovations on the E-MIAS Inspire portal, curated idea bank, and DBT verification.',
    seoMeta: {
      titleTag: 'Inspire Award MANAK Nomination & Idea Bank Rajasthan | Shala Sahayak',
      metaDescription: 'Step-by-step guide for Inspire Award MANAK nominations on E-MIAS portal. Curated science idea bank, DBT account check, and printable certificate free!',
      h1Tag: 'इंस्पायर अवार्ड मानक (Inspire Award): नामांकन व आइडिया बैंक संपूर्ण गाइड',
      slugUrl: '/inspire-guide',
      imageAltText: 'Inspire Award MANAK student innovation idea submission form and principal verification certificate'
    },
    overviewHi: 'विज्ञान एवं प्रौद्योगिकी विभाग (DST) भारत सरकार द्वारा कक्षा 6 से 10 के विद्यार्थियों में नवाचार एवं रचनात्मक सोच को प्रोत्साहित करने हेतु इंस्पायर अवार्ड मानक योजना संचालित है। प्रत्येक विद्यालय से 3 से 5 श्रेष्ठ विचारों का चयन कर ₹10,000 की प्रोत्साहन राशि सीधे छात्र के खाते में भेजी जाती है।',
    overviewEn: 'Department of Science & Technology conducts Inspire Award MANAK for Classes 6-10. Selected students receive ₹10,000 DBT to build prototypes.',
    prerequisitesHi: [
      'ई-एमआईएएस (E-MIAS) इंस्पायर पोर्टल पर विद्यालय लॉगिन आईडी व पासवर्ड',
      'नामित विद्यार्थी का आधार कार्ड एवं बैंक खाता (IFSC कोड सहित)',
      'वैज्ञानिक विचार का संक्षिप्त विवरण (100-150 शब्दों में) व प्रोजेक्ट स्केच'
    ],
    prerequisitesEn: [
      'School login credentials on E-MIAS Inspire portal',
      'Nominated student Aadhaar and active bank account with IFSC',
      'Innovation idea synopsis (100-150 words) and rough sketch diagram'
    ],
    keyBenefitsHi: [
      'ग्रामीण व दैनिक जीवन की समस्याओं पर आधारित 50+ मौलिक आइडिया बैंक',
      'बैंक खाता सत्यापन एवं डीबीटी स्टेटस चेकलॉग',
      'संस्थाप्रधान को प्रस्तुत करने हेतु एक-क्लिक ए4 प्रमाणीकरण पत्र जनरेटर'
    ],
    keyBenefitsEn: [
      'Curated idea bank with 50+ practical real-world student innovation models',
      'Bank account & DBT verification checklist',
      'One-click printable A4 nomination verification certificate'
    ],
    steps: [
      {
        stepNum: 1,
        titleHi: 'इंस्पायर अवार्ड मॉड्यूल खोलें',
        titleEn: 'Open Inspire Award Module',
        descriptionHi: 'प्रभारी प्रभाग से "इंस्पायर अवार्ड प्रभारी" कार्ड पर क्लिक करें।',
        descriptionEn: 'Select Inspire Award Incharge card from Incharge Modules grid.',
        tipHi: 'कक्षा 6 से 10 के छात्रों की सूची पूर्व में तैयार रखें।',
        tipEn: 'Keep student nomination shortlist ready.'
      },
      {
        stepNum: 2,
        titleHi: 'विद्यार्थी एवं प्रोजेक्ट विचार प्रविष्ट करें',
        titleEn: 'Enter Student & Project Synopsis',
        descriptionHi: 'विद्यार्थी का नाम, पिता का नाम, कक्षा, प्रोजेक्ट का नाम व संक्षिप्त विवरण भरकर जोड़ें। आइडिया बैंक से भी सहायता ले सकते हैं।',
        descriptionEn: 'Input student details, class, project title, and category synopsis. Browse the built-in Idea Bank for inspiration.',
        tipHi: 'विचार किसी मॉडल की नकल न होकर दैनिक जीवन की समस्या का समाधान होना चाहिए।',
        tipEn: 'Ideas must represent original grassroots problem-solving rather than standard textbook models.'
      },
      {
        stepNum: 3,
        titleHi: 'प्रमाणीकरण पत्र जनरेट कर प्रिंट करें',
        titleEn: 'Generate Verification Certificate',
        descriptionHi: 'जावक क्रमांक दर्ज कर संस्थाप्रधान हेतु आधिकारिक A4 प्रमाणीकरण पत्र प्रिंट करें और ई-एमआईएएस पोर्टल पर सबमिट करें।',
        descriptionEn: 'Open Certificate tab, enter dispatch details, and generate printable A4 certificate for the Principal and portal upload.',
        tipHi: 'अंतिम तिथि से पूर्व पोर्टल पर 5 विद्यार्थियों के नामांकन लॉक करें।',
        tipEn: 'Ensure portal locking of up to 5 student nominations before the annual deadline.'
      }
    ],
    relatedGuides: [
      { id: 'udise-guide', titleHi: 'यू-डाइस+ रिपोर्ट गाइड', titleEn: 'UDISE+ Report Guide', categoryHi: 'प्रभारी दायित्व' },
      { id: 'incharge-scholarship-guide', titleHi: 'छात्रवृत्ति योजनाएं', titleEn: 'Scholarship Tracker', categoryHi: 'प्रभारी दायित्व' }
    ],
    internalToolLinks: [
      { toolId: 'incharge-inspire', nameHi: 'इंस्पायर अवार्ड प्रभारी', nameEn: 'Inspire Award Module', descriptionHi: 'आइडिया बैंक, नामांकन व प्रमाणीकरण पत्र बनाएं' }
    ],
    faqItems: [
      {
        questionHi: 'एक विद्यालय से अधिकतम कितने विद्यार्थियों का नामांकन किया जा सकता है?',
        questionEn: 'What is the maximum number of nominations allowed per school?',
        answerHi: 'माध्यमिक एवं उच्च माध्यमिक विद्यालयों से अधिकतम 5 श्रेष्ठ विद्यार्थियों तथा उच्च प्राथमिक विद्यालयों से 3 विद्यार्थियों का नामांकन किया जा सकता है।',
        answerEn: 'Secondary/Sr Secondary schools can nominate up to 5 students; Upper Primary schools can nominate up to 3.'
      }
    ]
  },
  {
    id: 'udise-guide',
    toolId: 'incharge-udise',
    categoryKey: 'incharge',
    categoryHi: 'प्रभारी दायित्व',
    categoryEn: 'Incharge Modules',
    titleHi: 'यू-डाइस+ (UDISE+) 2026-27 शिक्षक, स्कूल DCF एवं छात्र APAAR प्रोफाइल गाइड',
    titleEn: 'UDISE+ 2026-27 Teacher, School DCF & Student APAAR Profile Guide',
    readTime: '5 मिनट',
    updatedDate: '2026-08-15',
    iconName: 'FileCheck',
    summaryHi: 'यू-डाइस+ पोर्टल पर शिक्षक प्रोफाइल अपडेशन, स्कूल भौतिक संसाधन (DCF), छात्र APAAR आईडी जनरेशन एवं 100% पूर्णता प्रमाणीकरण पत्र बनाने की संपूर्ण प्रक्रिया।',
    summaryEn: 'Comprehensive guide for UDISE+ Teacher Module, School Infrastructure DCF, Student APAAR Profile entry, and official completion certificate generator.',
    seoMeta: {
      titleTag: 'UDISE Plus 2026-27 Rajasthan Teacher School Student Guide | Shala Sahayak',
      metaDescription: 'Complete step-by-step guide for UDISE+ data entry in Rajasthan schools. Teacher module, School DCF, APAAR generation, and printable certificate free!',
      h1Tag: 'यू-डाइस+ (UDISE+) 2026-27: शिक्षक, स्कूल व छात्र मॉड्यूल संपूर्ण गाइड',
      slugUrl: '/udise-guide',
      imageAltText: 'UDISE+ portal data entry workflow showing teacher profile, school facilities DCF, and APAAR student cards'
    },
    overviewHi: 'शिक्षा मंत्रालय भारत सरकार द्वारा प्रत्येक मान्यता प्राप्त विद्यालय हेतु यू-डाइस+ पोर्टल पर वार्षिक डेटा प्रविष्टि अनिवार्य की गई है। इसमें शिक्षक प्रोफाइल, विद्यालय भौतिक संसाधन (DCF), छात्र प्रोफाइल एवं APAAR ID जनरेशन शामिल हैं।',
    overviewEn: 'Ministry of Education Govt of India mandates annual UDISE+ data entry covering Teacher Module, School Facilities DCF, and Student APAAR profiling.',
    prerequisitesHi: [
      'यू-डाइस+ स्कूल लॉगिन आईडी (11-अंकीय UDISE कोड) एवं पासवर्ड',
      'पदस्थापित शिक्षकों का नेशनल कोड एवं आधार कार्ड विवरण',
      'छात्रों का जन-आधार/आधार एवं पेन (PEN) नंबर'
    ],
    prerequisitesEn: [
      'School 11-digit UDISE code and login credentials',
      'Teacher National Code, Aadhaar, and appointment details',
      'Student Aadhaar, Jan Aadhaar, and Permanent Education Number (PEN)'
    ],
    keyBenefitsHi: [
      'संस्थाप्रधान एवं सीबीईओ को प्रस्तुत करने हेतु आधिकारिक प्रमाणीकरण पत्र जनरेटर (विकल्प अ व ब)',
      'ऑफ़लाइन डेटा संकलन हेतु आधिकारिक DCF फॉरमेट्स',
      '100% पूर्णता प्रमाणीकरण एवं त्रुटि निवारण चेकलॉग'
    ],
    keyBenefitsEn: [
      'Dedicated completion certificate generator for Incharge to Principal and Principal to CBEO',
      'Official downloadable DCF worksheets for offline school data collection',
      '100% completion verification and error mitigation checklist'
    ],
    steps: [
      {
        stepNum: 1,
        titleHi: 'यू-डाइस+ प्रभारी मॉड्यूल खोलें',
        titleEn: 'Launch UDISE+ Module',
        descriptionHi: 'प्रभारी प्रभाग से "यू-डाइस+ (UDISE+) प्रभारी" पर क्लिक करें।',
        descriptionEn: 'Select UDISE+ Incharge from Incharge Modules menu.',
        tipHi: 'शिक्षक, स्कूल या छात्र प्रभाग में से वांछित टैब चुनें।',
        tipEn: 'Switch between Teacher, School, Student, or Formats tab.'
      },
      {
        stepNum: 2,
        titleHi: 'रिपोर्ट व प्रमाणीकरण जनरेटर खोलें',
        titleEn: 'Open Certificate Generator',
        descriptionHi: 'स्कूल नाम, शिक्षक/छात्र संख्या एवं जावक क्रमांक दर्ज कर विकल्प अ (प्रभारी से संस्थाप्रधान) या विकल्प ब (संस्थाप्रधान से सीबीईओ) चुनें।',
        descriptionEn: 'Enter school name, verified counts, and select Option A (Incharge to Principal) or Option B (Principal to CBEO).',
        tipHi: 'सभी मॉड्यूल 100% पूर्ण होने के बाद ही प्रमाण पत्र जारी करें।',
        tipEn: 'Issue completion certificate only after all DCF sections show 100% completion.'
      },
      {
        stepNum: 3,
        titleHi: 'प्रमाणीकरण प्रपत्र प्रिंट करें',
        titleEn: 'Print Official Certificate',
        descriptionHi: 'ए4 साइज में प्रमाण पत्र डाउनलोड करें, संस्थाप्रधान की मुहर व हस्ताक्षर करवाकर सीबीईओ कार्यालय में जमा कराएं।',
        descriptionEn: 'Export official certificate in A4 PDF, affix school seal, and submit to CBEO office.',
        tipHi: 'इसकी एक प्रति यू-डाइस पत्रावली में सुरक्षित संधारित रखें।',
        tipEn: 'File a physical signed copy in school permanent records.'
      }
    ],
    relatedGuides: [
      { id: 'teacher-anomaly-guide', titleHi: 'आधार व अपार विसंगति समाधान', titleEn: 'Anomaly Resolver', categoryHi: 'शिक्षक संवर्ग' },
      { id: 'peeo-pramanikaran-guide', titleHi: 'प्रमाणीकरण रिपोर्ट हब', titleEn: 'Verification Hub', categoryHi: 'पीईईओ टूल्स' }
    ],
    internalToolLinks: [
      { toolId: 'incharge-udise', nameHi: 'यू-डाइस+ प्रभारी टूल', nameEn: 'UDISE+ Module', descriptionHi: 'यू-डाइस डेटा प्रविष्टि व पूर्णता प्रमाण पत्र जनरेट करें' }
    ],
    faqItems: [
      {
        questionHi: 'अपार (APAAR) आईडी का क्या लाभ है?',
        questionEn: 'What is the benefit of APAAR ID?',
        answerHi: 'अपार (वन नेशन, वन स्टूडेंट आईडी) से विद्यार्थी के सभी शैक्षणिक प्रमाण पत्र, छात्रवृत्ति एवं कौशल रिकॉर्ड डिजिलॉकर में आजीवन सुरक्षित रूप से जुड़ जाते हैं।',
        answerEn: 'APAAR (One Nation One Student ID) unifies lifelong academic records, scholarships, and marksheets securely in DigiLocker.'
      }
    ]
  },
  {
    id: 'incharge-qrcode-guide',
    toolId: 'incharge-qrcode',
    categoryKey: 'incharge',
    categoryHi: 'प्रभारी दायित्व',
    categoryEn: 'Incharge Modules',
    titleHi: 'विद्यालय क्यूआर कोड (QR Code) जनरेटर: परिपत्र, नोटिस एवं फॉर्म्स मार्गदर्शिका',
    titleEn: 'School Circular & Notice QR Code Generator with Hindi Label Guide',
    readTime: '3 मिनट',
    updatedDate: '2026-08-15',
    iconName: 'Image',
    summaryHi: 'विद्यालय परिपत्रों, प्रवेश फॉर्म, अभिभावक फीडबैक एवं वेबसाइट लिंक हेतु सुंदर हिंदी लेबल युक्त क्यूआर कोड जनरेटर एवं डाउनलोडर।',
    summaryEn: 'Generate high-resolution QR codes with custom Hindi labels for school notices, admission forms, Google Forms, and circulars.',
    seoMeta: {
      titleTag: 'School QR Code Generator with Hindi Labels Rajasthan | Shala Sahayak',
      metaDescription: 'Generate custom QR codes with Hindi labels for Rajasthan school circulars, student forms, and WhatsApp groups. High-res PNG download free!',
      h1Tag: 'विद्यालय क्यूआर कोड जनरेटर: परिपत्र व सूचनाएं संपूर्ण गाइड',
      slugUrl: '/incharge-qrcode-guide',
      imageAltText: 'School QR code generator preview showing custom Hindi label text and high-contrast downloadable PNG image'
    },
    overviewHi: 'डिजिटल राजस्थान अभियान के तहत विद्यालय सूचनाओं, व्हाट्सएप ग्रुप लिंक, ऑनलाइन प्रवेश फॉर्म एवं खेलकूद पंजीकरण के लिए परिपत्रों पर क्यूआर कोड मुद्रित करना अनिवार्य और आधुनिक तरीका बन गया है।',
    overviewEn: 'Printing QR codes on school circulars enables instant mobile scanning for circulars, admission registrations, and parent surveys.',
    prerequisitesHi: [
      'जिस लिंक/वेबसाइट का क्यूआर कोड बनाना है उसका यूआरएल (URL)',
      'क्यूआर कोड के नीचे दिखने वाला हिंदी शीर्षक (जैसे "प्रवेश फॉर्म हेतु स्कैन करें")',
      'वांछित रंग एवं साइज'
    ],
    prerequisitesEn: [
      'Target web URL or Google Form link',
      'Hindi label caption to display under the QR code',
      'Desired color theme and image dimensions'
    ],
    keyBenefitsHi: [
      'सुंदर हिंदी लेबल (जैसे "शाला सहायक पोर्टल", "ऑनलाइन फॉर्म") स्वतः जुड़ना',
      'उच्च गुणवत्ता (High-Resolution PNG) में एक-क्लिक डाउनलोड',
      'परिपत्रों, नोटिस बोर्ड एवं बैनरों में मुद्रण हेतु सर्वथा उपयुक्त'
    ],
    keyBenefitsEn: [
      'Embedded Hindi typography labels beneath the QR code image',
      'High-resolution crisp PNG export suitable for flex banners and notices',
      'Instant mobile camera scan compatibility across all devices'
    ],
    steps: [
      {
        stepNum: 1,
        titleHi: 'क्यूआर कोड जनरेटर खोलें',
        titleEn: 'Open QR Code Module',
        descriptionHi: 'प्रभारी प्रभाग से "QR कोड जनरेटर" चुनें।',
        descriptionEn: 'Select QR Code Generator from Incharge Modules menu.',
        tipHi: 'वेबसाइट लिंक, गूगल फॉर्म या व्हाट्सएप लिंक पेस्ट करें।',
        tipEn: 'Paste any valid web URL, Google Drive link, or Form link.'
      },
      {
        stepNum: 2,
        titleHi: 'हिंदी लेबल एवं विवरण दर्ज करें',
        titleEn: 'Add Custom Hindi Label',
        descriptionHi: 'लेबल बॉक्स में "प्रवेश फॉर्म", "अभिभावक बैठक सूचना" आदि लिखें। क्यूआर कोड तुरंत अपडेट हो जाएगा।',
        descriptionEn: 'Enter your preferred label text (e.g., "Scan for Admission Form"). Live preview updates instantly.',
        tipHi: 'लेबल छोटा व स्पष्ट रखें ताकि स्कैन करने वाले को आसानी हो।',
        tipEn: 'Keep label succinct for optimal readability.'
      },
      {
        stepNum: 3,
        titleHi: 'डाउनलोड करें एवं परिपत्र पर लगाएं',
        titleEn: 'Download & Embed in Notices',
        descriptionHi: '"क्यूआर कोड डाउनलोड करें" दबाएं और इमेज को वर्ड या पेजमेकर में अपने आधिकारिक आदेश पर चस्पा करें।',
        descriptionEn: 'Download high-res PNG and insert into your official school notice or circular document.',
        tipHi: 'प्रिंट से पूर्व अपने मोबाइल फोन से स्कैन कर लिंक की जाँच कर लें।',
        tipEn: 'Test scan with a smartphone camera before bulk printing.'
      }
    ],
    relatedGuides: [
      { id: 'peeo-orders-guide', titleHi: 'पीईईओ प्रशासनिक आदेश', titleEn: 'PEEO Orders Generator', categoryHi: 'पीईईओ टूल्स' },
      { id: 'invitation-guide', titleHi: 'विद्यालय आमंत्रण पत्र मेकर', titleEn: 'School Invitation Maker', categoryHi: 'विभागीय प्रपत्र' }
    ],
    internalToolLinks: [
      { toolId: 'incharge-qrcode', nameHi: 'क्यूआर कोड जनरेटर', nameEn: 'QR Code Generator', descriptionHi: 'हिंदी लेबल युक्त क्यूआर कोड 5 सेकंड में बनाएं' }
    ],
    faqItems: [
      {
        questionHi: 'क्या जनरेट किया गया क्यूआर कोड कभी एक्सपायर होता है?',
        questionEn: 'Does the generated QR code ever expire?',
        answerHi: 'नहीं, यह एक स्थायी (Static) क्यूआर कोड है जो कभी भी समाप्त नहीं होता और आजीवन कार्य करता है।',
        answerEn: 'No, static QR codes remain permanently active and never expire.'
      }
    ]
  }
];
