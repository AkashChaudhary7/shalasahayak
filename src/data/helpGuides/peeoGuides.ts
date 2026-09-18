import { HelpGuide } from '../../types';

export const peeoGuides: HelpGuide[] = [
  {
    id: 'peeo-orders-guide',
    toolId: 'peeo-orders',
    categoryKey: 'peeo',
    categoryHi: 'पीईईओ व संस्थाप्रधान',
    categoryEn: 'PEEO & Admin',
    titleHi: '10 सेकंड में आधिकारिक पीईईओ आदेश व कार्यमुक्ति पत्र (Relieving Letter) जनरेटर मार्गदर्शिका',
    titleEn: 'How to Generate Official PEEO Orders & Relieving Letters in 10 Seconds',
    readTime: '3 मिनट',
    updatedDate: '2026-08-15',
    iconName: 'Building2',
    summaryHi: 'पीईईओ कार्यालय के प्रशासनिक ड्यूटी आदेश, रिलीविंग ऑर्डर एवं सत्यापन प्रपत्र मुहर सहित तुरंत तैयार करने के विस्तृत चरण।',
    summaryEn: 'Complete step-by-step documentation for PEEO duty orders, teacher relieving letters, and verification certificates.',
    seoMeta: {
      titleTag: 'PEEO Order & Relieving Letter Generator Rajasthan | Shala Sahayak',
      metaDescription: 'Generate official Rajasthan PEEO administrative orders, teacher relieving letters & verification certificates in 10 seconds. Free online PDF print!',
      h1Tag: 'पीईईओ आदेश व कार्यमुक्ति पत्र जनरेटर: राजस्थान शिक्षा विभाग संपूर्ण गाइड',
      slugUrl: '/peeo-orders-guide',
      imageAltText: 'Rajasthan PEEO official dispatch order and relieving letter format preview with school seal and signature block'
    },
    overviewHi: 'प्रारम्भिक एवं माध्यमिक शिक्षा विभाग राजस्थान के अंतर्गत पीईईओ/यूसीईईओ कार्यालयों द्वारा दैनिक प्रशासनिक आदेश, चुनाव व परीक्षा ड्यूटी रिलीविंग पत्र एवं सत्यापन प्रमाण पत्र जारी किए जाते हैं। शाला सहायक टूल से बिना टाइपिंग त्रुटि के आधिकारिक जावक क्रमांक युक्त आदेश तैयार होते हैं।',
    overviewEn: 'PEEO and UCEEO office administration guidelines for generating duty letters, election/exam relieving certificates, and service verifications in Rajasthan schools.',
    prerequisitesHi: [
      'पीईईओ विद्यालय का नाम, एनआईसी कोड व डाइस कोड',
      'कार्मिक का नाम, मूल पदनाम एवं पदस्थापन स्थान',
      'कार्यालय जावक क्रमांक एवं आदेश जारी करने की दिनांक'
    ],
    prerequisitesEn: [
      'PEEO School Name, NIC Code and UDISE Code',
      'Employee name, designation and current school',
      'Office dispatch number and date of issue'
    ],
    keyBenefitsHi: [
      'स्वचालित पीईईओ मुहर, शीर्ष-पत्र (Letterhead) व हस्ताक्षर प्रारूप',
      '100% सटीक जावक क्रमांक प्रविष्टि एवं डुप्लीकेट सुरक्षा',
      'एक-क्लिक में ए4 साइज प्रिंट एवं आधिकारिक पीडीएफ डाउनलोड'
    ],
    keyBenefitsEn: [
      'Automated PEEO official seal, letterhead and signature block',
      '100% accurate dispatch register tracking',
      'One-click A4 printing and official PDF download'
    ],
    steps: [
      {
        stepNum: 1,
        titleHi: 'प्रशासनिक आदेश जनरेटर मॉड्यूल खोलें',
        titleEn: 'Open PEEO Orders Module',
        descriptionHi: 'पीईईओ / संस्थाप्रधान प्रभाग से "प्रशासनिक आदेश जनरेटर" का चयन करें।',
        descriptionEn: 'Select "PEEO Orders" from PEEO tab or search "Orders" in the quick search bar.',
        tipHi: 'विद्यालय विवरण ऑटो-फ़िल करने हेतु प्रोफाइल सेटिंग्स पहले जांच लें।',
        tipEn: 'Ensure profile settings are filled to auto-populate school header.',
        screenshotPlaceholder: {
          titleHi: 'आदेश प्रारूप चयन स्क्रीन',
          titleEn: 'Order Template Selection Screen',
          type: 'form_input',
          captionHi: 'आदेश प्रकार (ड्यूटी, रिलीविंग, सत्यापन) चुनें',
          captionEn: 'Select Order Template (Duty, Relieving, Verification)',
          mockupData: {
            fields: [
              { label: 'आदेश प्रकार (Template)', value: 'कार्यमुक्ति आदेश (Relieving Order)' },
              { label: 'जावक क्रमांक (Dispatch No)', value: 'राउमावि/पीईईओ/2026-27/412' },
              { label: 'कार्मिक का नाम (Teacher)', value: 'श्री राजेश कुमार शर्मा (वरिष्ठ अध्यापक)' },
              { label: 'ड्यूटी प्रकार (Duty Type)', value: 'बोर्ड परीक्षा केंद्राधीक्षक (CS Duty)' }
            ]
          }
        }
      },
      {
        stepNum: 2,
        titleHi: 'आदेश प्रारूप एवं कर्मचारी विवरण चुनें',
        titleEn: 'Select Order Template & Employee Details',
        descriptionHi: 'ड्यूटी आदेश, कार्यमुक्ति पत्र (Relieving Order) या सत्यापन पत्र में से वांछित प्रारूप का चयन करें। पूर्व से दर्ज कार्मिक सूची से एक क्लिक में नाम चुनें।',
        descriptionEn: 'Choose between Duty Order, Relieving Letter, or Verification Certificate template. Select employee from saved staff list.',
        tipHi: 'यदि शिक्षक का विवरण पहले से सेव है तो सभी कॉलम स्वतः भर जाते हैं।',
        tipEn: 'Saved teachers automatically populate all fields.'
      },
      {
        stepNum: 3,
        titleHi: 'जावक क्रमांक व तिथि दर्ज कर पूर्वावलोकन करें',
        titleEn: 'Input Dispatch Number & Preview PDF',
        descriptionHi: 'कार्यालय का जावक क्रमांक, आदेश दिनांक दर्ज करें और "आदेश तैयार करें" बटन दबाएं। तैयार पत्र को सीधे प्रिंट या पीडीएफ डाउनलोड करें।',
        descriptionEn: 'Enter dispatch number, order date, and click Generate. Print directly or download official PDF.',
        tipHi: 'प्रिंट हेतु A4 साइज एवं नार्मल मार्जिन का चयन करें।',
        tipEn: 'Use A4 size paper layout with normal margins for clean printouts.'
      }
    ],
    contentSections: [
      {
        headingLevel: 'h2',
        headingHi: 'पीईईओ आदेश जनरेटर के मुख्य उपयोग एवं प्रारूप',
        headingEn: 'Key Use Cases of PEEO Orders Generator',
        contentHi: 'राजस्थान शिक्षा विभाग में पीईईओ (पंचायत प्रारंभिक शिक्षा अधिकारी) अधीनस्थ 5 से 15 विद्यालयों के प्रशासनिक प्रमुख होते हैं। उनके कार्यालय से नियमित रूप से निम्नलिखित आदेश जारी होते हैं:',
        contentEn: 'PEEO officers in Rajasthan oversee 5 to 15 schools in a Panchayat. Common official orders include:',
        listItemsHi: [
          '1. परीक्षा ड्यूटी कार्यमुक्ति पत्र (Board & Home Exam Relieving Orders)',
          '2. चुनाव एवं बीएलओ प्रशिक्षण कार्यमुक्ति पत्र (Election & BLO Training Orders)',
          '3. खेलकूद प्रतियोगिता एवं स्काउट शिविर उपस्थिति आदेश (Sports & Scout Camp Orders)',
          '4. ग्रीष्मावकाश / शीतकालीन अवकाश में संस्था कार्यभार ग्रहण आदेश'
        ],
        listItemsEn: [
          '1. Board & Home Exam Relieving Orders',
          '2. Election & BLO Training Relieving Orders',
          '3. Sports tournament & Scout camp deputation orders',
          '4. Vacation school charge handover orders'
        ]
      },
      {
        headingLevel: 'h3',
        headingHi: 'आधिकारिक आदेश में आवश्यक प्रमुख बिंदु',
        headingEn: 'Mandatory Elements of Official PEEO Orders',
        contentHi: 'प्रत्येक आदेश में कार्यालय मुहर, पत्रांक/जावक क्रमांक, कार्मिक की एम्प्लॉई आईडी एवं प्रतिलिपि (Copy to) अनुभाग आवश्यक होता है ताकि सेवा पुस्तिका में इंद्राज मान्य हो सके।',
        contentEn: 'Every official order must carry school dispatch number, employee ID, official seal, and standard copy-to list.',
        tableData: {
          headersHi: ['क्रमांक', 'आदेश का प्रकार', 'अनुशंसा अधिकारी', 'सेवा पुस्तिका इंद्राज'],
          headersEn: ['S.No.', 'Order Type', 'Recommending Authority', 'Service Book Entry'],
          rowsHi: [
            ['1', 'परीक्षा कार्यमुक्ति', 'केंद्राधीक्षक / सीबीईओ', 'हाँ (कर्तव्य अवधि)'],
            ['2', 'बीएलओ प्रशिक्षण', 'एसडीएम / निर्वाचक रजिस्ट्रीकरण', 'हाँ (विशेष आकस्मिक अवकाश)'],
            ['3', 'प्रभार आवंटन आदेश', 'पीईईओ / संस्थाप्रधान', 'हाँ (पोर्टल प्रभार)'],
            ['4', 'वार्षिक वेतन वृद्धि', 'आहरण वितरण अधिकारी (DDO)', 'हाँ (मूल सेवा पुस्तिका)']
          ],
          rowsEn: [
            ['1', 'Exam Relieving', 'Centre Supdt / CBEO', 'Yes (On Duty)'],
            ['2', 'BLO Training', 'SDM / ERO', 'Yes (Special Casual Leave)'],
            ['3', 'Charge Allocation', 'PEEO / Principal', 'Yes (School Portals)'],
            ['4', 'Annual Increment', 'DDO Officer', 'Yes (Service Book)']
          ]
        }
      }
    ],
    relatedGuides: [
      { id: 'peeo-increment-guide', titleHi: 'वार्षिक वेतन वृद्धि आदेश जनरेटर', titleEn: 'Annual Increment Order Generator', categoryHi: 'पीईईओ टूल्स' },
      { id: 'peeo-incharge-guide', titleHi: 'प्रभारी मैपिंग व कार्य आवंटन आदेश', titleEn: 'Incharge Mapping Orders', categoryHi: 'पीईईओ टूल्स' },
      { id: 'peeo-substitution-guide', titleHi: 'दैनिक कालांश स्थानापन्न व्यवस्था', titleEn: 'Daily Teacher Substitution', categoryHi: 'पीईईओ टूल्स' }
    ],
    internalToolLinks: [
      { toolId: 'peeo-orders', nameHi: 'पीईईओ आदेश जनरेटर', nameEn: 'PEEO Orders Generator', descriptionHi: '10 सेकंड में आधिकारिक आदेश व कार्यमुक्ति पत्र तैयार करें' },
      { toolId: 'peeo-incharge', nameHi: 'प्रभारी प्रभार मैपिंग', nameEn: 'Incharge Mapping', descriptionHi: 'विद्यालय योजना प्रभार आवंटन आदेश जनरेट करें' }
    ],
    faqItems: [
      {
        questionHi: 'क्या इस टूल से जनरेट आदेश आधिकारिक रूप से मान्य है?',
        questionEn: 'Is the order generated through this tool officially valid?',
        answerHi: 'हाँ, इसमें राजस्थान सरकार के निर्धारित प्रारूप अनुसार जावक क्रमांक, कार्यालय मोहर एवं संस्थाप्रधान के हस्ताक्षर का स्थान दिया गया है जो पूर्णतः वैध है।',
        answerEn: 'Yes, it complies with standard Rajasthan education format including dispatch number, official seal, and Principal sign block.'
      },
      {
        questionHi: 'क्या आदेश को सीधे पीडीएफ में सेव कर प्रिंट किया जा सकता है?',
        questionEn: 'Can the order be exported to PDF and printed directly?',
        answerHi: 'हाँ, "प्रिंट / पीडीएफ" बटन पर क्लिक करके इसे सीधे किसी भी ए4 प्रिंटर से प्रिंट या पीडीएफ के रूप में डाउनलोड किया जा सकता है।',
        answerEn: 'Yes, clicking Print/PDF directly exports an A4 formatted document ready for printing or digital sharing.'
      }
    ]
  },
  {
    id: 'peeo-increment-guide',
    toolId: 'peeo-increment',
    categoryKey: 'peeo',
    categoryHi: 'पीईईओ व संस्थाप्रधान',
    categoryEn: 'PEEO & Admin',
    titleHi: 'वार्षिक वेतन वृद्धि (July Increment) आदेश एवं 7th Pay Matrix ऑटो फिक्सेशन गाइड',
    titleEn: 'Annual Increment Order Generator & 7th Pay Matrix Fixation Guide',
    readTime: '4 मिनट',
    updatedDate: '2026-08-15',
    iconName: 'TrendingUp',
    summaryHi: '1 जुलाई को देय 3% वार्षिक वेतन वृद्धि आदेश, पे लेवल L-1 से L-16 तक नए मूल वेतन की स्वतः गणना एवं कार्यालय आदेश जनरेटर।',
    summaryEn: 'Automatic 3% annual increment order draft, pay matrix L-1 to L-16 fixation, and bulk teacher increment order generator.',
    seoMeta: {
      titleTag: 'Rajasthan Annual Increment Order Generator 2026 | Shala Sahayak',
      metaDescription: 'Auto calculate 3% annual increment for Rajasthan teachers & staff (Pay Level L-1 to L-16). Generate official July increment order PDF free!',
      h1Tag: 'वार्षिक वेतन वृद्धि आदेश जनरेटर 2026: 7th Pay Matrix फिक्सेशन गाइड',
      slugUrl: '/peeo-increment-guide',
      imageAltText: 'Rajasthan Education Annual Increment order format showing 3% pay jump, Pay Level and employee dispatch details'
    },
    overviewHi: 'राजस्थान सेवा नियमों (RSR) के तहत प्रत्येक राज्य कर्मचारी को न्यूनतम 6 माह की संतोषप्रद सेवा पूर्ण करने पर प्रतिवर्ष 1 जुलाई (अथवा कुछ मामलों में 1 जनवरी) को 3% की दर से वार्षिक वेतन वृद्धि स्वीकृत की जाती है। शाला सहायक वेतन वृद्धि टूल सभी शिक्षकों की वेतन वृद्धि सूची 1 मिनट में तैयार करता है।',
    overviewEn: 'Under Rajasthan Service Rules, every state government employee is granted an annual grade increment of approx 3% on July 1st upon satisfactory service.',
    prerequisitesHi: [
      'कर्मचारियों का वर्तमान मूल वेतन (Old Basic Pay)',
      '7वां वेतनमान पे मैट्रिक्स लेवल (L-1 से L-16)',
      'वेतन वृद्धि आदेश क्रमांक एवं जावक दिनांक'
    ],
    prerequisitesEn: [
      'Current Basic Pay of employees',
      '7th CPC Pay Matrix Level (L-1 to L-16)',
      'Office dispatch number and increment effective date'
    ],
    keyBenefitsHi: [
      '7th Pay Matrix अनुसार स्वतः सटीक नया मूल वेतन (New Basic Pay)',
      'एक साथ संपूर्ण स्टाफ का समेकित वेतन वृद्धि आदेश (Consolidated Order)',
      'सेवा पुस्तिका में चिपकाने योग्य व्यक्तिगत आदेश पर्ची'
    ],
    keyBenefitsEn: [
      'Automatic accurate next basic pay calculation per 7th Pay Matrix',
      'Consolidated increment order for whole school staff',
      'Printable individual slips for service book pasting'
    ],
    steps: [
      {
        stepNum: 1,
        titleHi: 'वेतन वृद्धि मॉड्यूल खोलें',
        titleEn: 'Open Increment Module',
        descriptionHi: 'पीईईओ टूल्स से "वार्षिक वेतन वृद्धि" का चयन करें।',
        descriptionEn: 'Navigate to PEEO Tools and open "Annual Increment".',
        tipHi: 'यदि शिक्षक सूची पहले से दर्ज है तो "सभी कार्मिक लोड करें" दबाएं।',
        tipEn: 'Click "Load All Staff" to auto-populate from saved teachers.'
      },
      {
        stepNum: 2,
        titleHi: 'कार्मिक का पे लेवल व बेसिक पे चुनें',
        titleEn: 'Verify Pay Level & Current Basic Pay',
        descriptionHi: 'प्रत्येक कार्मिक का पे-लेवल (उदा. L-10, L-11, L-12) एवं वर्तमान बेसिक पे चुनें। सिस्टम 7th Pay Matrix अनुसार अगला सेल स्वतः निर्धारित कर देगा।',
        descriptionEn: 'Select employee Pay Level and old basic. The system automatically computes next cell value.',
        tipHi: 'वेतन वृद्धि दर नियमानुसार अगली मैट्रिक्स सेल के बराबर होती है।',
        tipEn: 'Increment automatically matches the next cell in the corresponding pay level.'
      },
      {
        stepNum: 3,
        titleHi: 'कार्यालय आदेश जनरेट व प्रिंट करें',
        titleEn: 'Generate & Print Consolidated Order',
        descriptionHi: 'जावक क्रमांक, दिनांक दर्ज कर "समेकित आदेश जनरेट करें" पर क्लिक करें। आधिकारिक मुहर सहित A4 पीडीएफ डाउनलोड करें।',
        descriptionEn: 'Enter dispatch number and date, then generate official consolidated increment order in A4 PDF.',
        tipHi: 'इस आदेश की एक प्रति पे-मैनेजर बिल के साथ संलग्न करें।',
        tipEn: 'Attach one signed copy with July PayManager salary bill.'
      }
    ],
    contentSections: [
      {
        headingLevel: 'h2',
        headingHi: 'राजस्थान 7th पे मैट्रिक्स लेवल एवं शिक्षक पदवार वर्गीकरण',
        headingEn: 'Rajasthan 7th Pay Matrix Levels & Teacher Designations',
        contentHi: 'राजस्थान शिक्षा विभाग में विभिन्न शिक्षक एवं प्रशासनिक पदों का पे मैट्रिक्स स्तर इस प्रकार है:',
        contentEn: 'Pay matrix levels for various Rajasthan education department cadres:',
        tableData: {
          headersHi: ['पदनाम', 'पे लेवल', 'प्रारंभिक मूल वेतन', 'वेतन वृद्धि दर'],
          headersEn: ['Designation', 'Pay Level', 'Starting Basic Pay', 'Annual Increment'],
          rowsHi: [
            ['तृतीय श्रेणी अध्यापक (Level 1/2)', 'L-10', '₹33,800', 'लगभग 3% (अगला सेल)'],
            ['द्वितीय श्रेणी वरिष्ठ अध्यापक', 'L-11', '₹37,800', 'लगभग 3% (अगला सेल)'],
            ['प्राध्यापक / स्कूल व्याख्याता', 'L-12', '₹44,300', 'लगभग 3% (अगला सेल)'],
            ['उप-प्रधानाचार्य (Vice Principal)', 'L-14', '₹56,100', 'लगभग 3% (अगला सेल)'],
            ['प्रधानाचार्य एवं पीईईओ (Principal)', 'L-16', '₹67,300', 'लगभग 3% (अगला सेल)']
          ],
          rowsEn: [
            ['Teacher Grade III (L-1/L-2)', 'L-10', '₹33,800', 'Approx 3% (Next Cell)'],
            ['Senior Teacher Grade II', 'L-11', '₹37,800', 'Approx 3% (Next Cell)'],
            ['School Lecturer Grade I', 'L-12', '₹44,300', 'Approx 3% (Next Cell)'],
            ['Vice Principal', 'L-14', '₹56,100', 'Approx 3% (Next Cell)'],
            ['Principal & PEEO', 'L-16', '₹67,300', 'Approx 3% (Next Cell)']
          ]
        }
      }
    ],
    relatedGuides: [
      { id: 'paymatrix-guide', titleHi: '7th Pay वेतन कैलकुलेटर', titleEn: '7th Pay Matrix Calculator', categoryHi: 'कैलकुलेटर' },
      { id: 'useful-8thpay-guide', titleHi: '8वां वेतन आयोग कैलकुलेटर', titleEn: '8th Pay Commission Calculator', categoryHi: 'कैलकुलेटर' },
      { id: 'peeo-orders-guide', titleHi: 'पीईईओ प्रशासनिक आदेश जनरेटर', titleEn: 'PEEO Orders Generator', categoryHi: 'पीईईओ टूल्स' }
    ],
    internalToolLinks: [
      { toolId: 'peeo-increment', nameHi: 'वार्षिक वेतन वृद्धि टूल', nameEn: 'Annual Increment Tool', descriptionHi: '1 जुलाई वेतन वृद्धि आदेश व नई बेसिक पे स्वतः बनाएं' },
      { toolId: 'portals-calculator', nameHi: '7th Pay वेतन कैलकुलेटर', nameEn: 'Salary Calculator', descriptionHi: 'डीए, एचआरए एवं शुद्ध इन-हैंड वेतन निकालें' }
    ],
    faqItems: [
      {
        questionHi: 'परिवीक्षा काल (Probation Period) में क्या वेतन वृद्धि मिलती है?',
        questionEn: 'Do probationers get annual increments?',
        answerHi: 'नहीं, 2 वर्ष के परिवीक्षा काल में नियत पारिश्रमिक (Fixed Remuneration) मिलता है। नियमितीकरण के उपरांत प्रथम वेतन वृद्धि देय होती है।',
        answerEn: 'No, employees receive fixed pay during 2-year probation. Annual increment begins after official confirmation.'
      },
      {
        questionHi: 'यदि 1 जुलाई को शिक्षक अवैतनिक अवकाश (EOL) पर हो तो क्या होगा?',
        questionEn: 'What happens if a teacher is on EOL on July 1st?',
        answerHi: 'अवैतनिक अवकाश की अवधि अनुसार वेतन वृद्धि की तिथि आगे खिसक जाती है, जिसका विवरण आदेश में अंकित किया जाता है।',
        answerEn: 'The increment date is deferred proportionally by the period of extraordinary leave without pay.'
      }
    ]
  },
  {
    id: 'peeo-timetable-guide',
    toolId: 'peeo-timetable',
    categoryKey: 'peeo',
    categoryHi: 'पीईईओ व संस्थाप्रधान',
    categoryEn: 'PEEO & Admin',
    titleHi: 'विद्यालय एवं शिक्षक 8-कालांश समय-सारणी (Time Table) जनरेटर गाइड',
    titleEn: 'Automated 8-Period School & Teacher Timetable Schedule Generator Guide',
    readTime: '4 मिनट',
    updatedDate: '2026-08-15',
    iconName: 'Calendar',
    summaryHi: 'कक्षा 1 से 12 तक बिना किसी कालांश टकराव (No Clash) के 8-पीरियड समय-सारणी, शिक्षकवार चार्ट एवं कक्षावार समय-सारणी जनरेटर।',
    summaryEn: 'Generate conflict-free 8-period school timetable, teacher-wise workload distribution, and class timetable charts.',
    seoMeta: {
      titleTag: 'School Timetable Generator Rajasthan 8 Period | Shala Sahayak',
      metaDescription: 'Generate automatic 8-period school timetable without clashes. Class-wise and teacher-wise schedule charts with A4 print for Rajasthan schools.',
      h1Tag: 'विद्यालय समय-सारणी (टाइम टेबल) जनरेटर: 8 कालांश संपूर्ण गाइड',
      slugUrl: '/peeo-timetable-guide',
      imageAltText: 'Rajasthan 8-period school timetable schedule grid showing classes 1 to 12 and teacher workload distribution'
    },
    overviewHi: 'सत्र के प्रारम्भ में प्रत्येक विद्यालय में शिविरा पंचांग अनुसार 8 कालांशों की समय-सारणी तैयार करना अनिवार्य होता है। इसमें विषय अध्यापक, प्रयोगशाला, खेलकूद एवं पुस्तकालय कालांशों का संतुलन आवश्यक होता है।',
    overviewEn: 'School timetable generation is mandatory at the beginning of academic session complying with Shivira guidelines.',
    prerequisitesHi: [
      'विद्यालय में संचालित कक्षाएं (उदा. कक्षा 6 से 10 अथवा 1 से 12)',
      'उपलब्ध शिक्षकों की सूची एवं उनके अध्यापन विषय',
      'सप्ताह में कुल कालांश भार (Workload Norms)'
    ],
    prerequisitesEn: [
      'Classes operating in school (e.g. 1 to 12)',
      'List of available staff and subject specializations',
      'Weekly workload periods per teacher'
    ],
    keyBenefitsHi: [
      'कालांश टकराव (Period Clash) का स्वतः निवारण',
      'शिक्षकवार एवं कक्षावार अलग-अलग प्रिंट फॉरमेट्स',
      'शिविरा पंचांग के कालांश समयावधि (Summer/Winter) अनुकूल'
    ],
    keyBenefitsEn: [
      'Automatic clash-free teacher allocation',
      'Separate teacher-wise and class-wise printable grids',
      'Aligned with Shivira summer and winter bell timings'
    ],
    steps: [
      {
        stepNum: 1,
        titleHi: 'कक्षाएं एवं शिक्षक जोड़ें',
        titleEn: 'Add Classes & Teachers',
        descriptionHi: 'टाइम टेबल मॉड्यूल में कक्षाएं एवं कार्यरत शिक्षकों के नाम व विषय दर्ज करें।',
        descriptionEn: 'Select classes and map teaching staff with their respective subjects.',
        tipHi: 'वरिष्ठ अध्यापकों के कालांश मुख्य विषयों (गणित, विज्ञान, अंग्रेजी) में पहले मैप करें।',
        tipEn: 'Allocate core subjects like Math, Science, and English first.'
      },
      {
        stepNum: 2,
        titleHi: 'ऑटो-शेड्यूल बटन दबाएं',
        titleEn: 'Click Auto-Schedule Grid',
        descriptionHi: '"समय-सारणी बनाएं" बटन दबाएं। सिस्टम शून्य टकराव के साथ 8 कालांशों में आवंटन पूरा कर देगा।',
        descriptionEn: 'Click Auto-Generate. The algorithm creates an optimized conflict-free 8-period timetable.',
        tipHi: 'मध्यवर्ती विश्राम (इंटरवल) 4थे और 5वें कालांश के बीच स्वतः सेट रहता है।',
        tipEn: 'Lunch break is automatically positioned between 4th and 5th period.'
      },
      {
        stepNum: 3,
        titleHi: 'चार्ट डाउनलोड व कक्षा-कक्षों में चस्पा करें',
        titleEn: 'Print & Display in Classrooms',
        descriptionHi: 'मास्टर टाइम टेबल, शिक्षक चार्ट एवं प्रत्येक कक्षा की समय-सारणी का प्रिंट निकालें।',
        descriptionEn: 'Print master timetable, staff allocation chart, and class display sheets in high-resolution A4.',
        tipHi: 'संस्थाप्रधान के हस्ताक्षर करवाकर नोटिस बोर्ड पर चस्पा करें।',
        tipEn: 'Get Principal signatures before displaying on school notice board.'
      }
    ],
    relatedGuides: [
      { id: 'peeo-substitution-guide', titleHi: 'दैनिक कालांश स्थानापन्न रजिस्टर', titleEn: 'Daily Teacher Substitution', categoryHi: 'पीईईओ टूल्स' },
      { id: 'shivira-guide', titleHi: 'शिविरा अकादमिक पंचांग', titleEn: 'Shivira Academic Calendar', categoryHi: 'अकादमिक पंचांग' }
    ],
    internalToolLinks: [
      { toolId: 'peeo-timetable', nameHi: 'समय-सारणी जनरेटर', nameEn: 'Timetable Generator', descriptionHi: '8-कालांश टाइम टेबल एवं शिक्षक चार्ट बनाएं' },
      { toolId: 'peeo-substitution', nameHi: 'दैनिक स्थानापन्न टूल', nameEn: 'Substitution Tracker', descriptionHi: 'अनुपस्थित शिक्षक के स्थान पर खाली पीरियड लगाएं' }
    ],
    faqItems: [
      {
        questionHi: 'क्या शिक्षकवार अधिकतम कालांश सीमा निर्धारित की जा सकती है?',
        questionEn: 'Can we set maximum periods per teacher?',
        answerHi: 'हाँ, राजस्थान सेवा नियमों अनुसार एक शिक्षक को सामान्यतः प्रतिदिन 5 से 6 कालांश आवंटित किए जाते हैं।',
        answerEn: 'Yes, workload norms typically prescribe 5 to 6 periods per day per teacher.'
      }
    ]
  },
  {
    id: 'peeo-incharge-guide',
    toolId: 'peeo-incharge',
    categoryKey: 'peeo',
    categoryHi: 'पीईईओ व संस्थाप्रधान',
    categoryEn: 'PEEO & Admin',
    titleHi: 'विद्यालय प्रभार आवंटन आदेश (Incharge Mapping) एवं कार्य विभाजन गाइड',
    titleEn: 'School Incharge Mapping & Work Distribution Order Generator Guide',
    readTime: '3 मिनट',
    updatedDate: '2026-08-15',
    iconName: 'Users',
    summaryHi: 'सत्रारम्भ पर मिड-डे मील, परीक्षा, छात्रवृत्ति, यू-डाइस, खेलकूद व पुस्तकालय प्रभारियों का आधिकारिक आवंटन आदेश तैयार करें।',
    summaryEn: 'Official office orders for appointing MDM incharge, exam superintendent, scholarship incharge, and UDISE coordinators.',
    seoMeta: {
      titleTag: 'School Incharge Allocation Order Generator Rajasthan | Shala Sahayak',
      metaDescription: 'Create official school scheme incharge appointment orders in Rajasthan. Auto-draft work distribution order with duties list for teachers free!',
      h1Tag: 'विद्यालय कार्य विभाजन व प्रभारी मैपिंग आदेश जनरेटर: संपूर्ण गाइड',
      slugUrl: '/peeo-incharge-guide',
      imageAltText: 'Rajasthan School Incharge Mapping Order showing teacher assignments for MDM, Exam, Scholarship and Sports'
    },
    overviewHi: 'सत्र के प्रारम्भ में संस्थाप्रधान द्वारा विद्यालय के सभी शैक्षणिक व सह-शैक्षणिक प्रभारों का कार्मिकों में पारदर्शी विभाजन किया जाता है ताकि प्रत्येक योजना का संचालन सुचारु रूप से हो सके।',
    overviewEn: 'School administration requires formal work distribution and scheme incharge appointments at the start of every academic year.',
    prerequisitesHi: [
      'विद्यालय का नाम व सत्र (उदा. 2026-27)',
      'पदस्थापित शिक्षकों की वरिष्ठता सूची',
      'आवंटित किए जाने वाले प्रभारों की सूची'
    ],
    prerequisitesEn: [
      'School name and session (2026-27)',
      'Seniority list of working staff',
      'List of schemes and charges to be assigned'
    ],
    keyBenefitsHi: [
      '20+ विभागीय प्रभारों के लिए पूर्व-निर्धारित दायित्व सूची',
      'मुख्य प्रभारी एवं सहायक प्रभारी (Assistant Incharge) दोनों की व्यवस्था',
      'आधिकारिक जावक क्रमांक सहित प्रिंट योग्य कार्यालय आदेश'
    ],
    keyBenefitsEn: [
      'Pre-populated duties list for 20+ government school schemes',
      'Provision for both Main Incharge and Assistant Incharge',
      'Official dispatch ready A4 office order export'
    ],
    steps: [
      {
        stepNum: 1,
        titleHi: 'प्रभार आवंटन प्रभाग खोलें',
        titleEn: 'Open Incharge Mapping',
        descriptionHi: 'पीईईओ प्रभाग से "प्रभारी मैपिंग" चुनें।',
        descriptionEn: 'Select "Incharge Mapping" from PEEO Tools menu.',
        tipHi: 'सत्र 2026-27 स्वतः चयनित रहता है।',
        tipEn: 'Academic session is pre-selected.'
      },
      {
        stepNum: 2,
        titleHi: 'प्रभार अनुसार शिक्षक चुनें',
        titleEn: 'Map Teachers to Charges',
        descriptionHi: 'एमडीएम, परीक्षा, छात्रवृत्ति, ट्रांसपोर्ट, यू-डाइस, इंस्पायर अवार्ड हेतु शिक्षक चुनें।',
        descriptionEn: 'Map teachers to MDM, Exam, Scholarship, UDISE+, and Scout charges.',
        tipHi: 'एक शिक्षक को उनकी रुचि एवं योग्यता अनुसार प्रभार सौंपें।',
        tipEn: 'Match teachers based on expertise and subject background.'
      },
      {
        stepNum: 3,
        titleHi: 'आदेश जनरेट कर हस्ताक्षर करवाएं',
        titleEn: 'Generate & Sign Official Order',
        descriptionHi: 'जावक क्रमांक दर्ज कर आदेश डाउनलोड करें और सभी शिक्षकों के हस्ताक्षर करवाकर पत्रावली में संधारित करें।',
        descriptionEn: 'Download order with dispatch number, obtain staff signature endorsements, and file in office record.',
        tipHi: 'इस आदेश की प्रति शाला दर्पण पोर्टल प्रभार मैपिंग से मिलान करें।',
        tipEn: 'Sync this physical order with online Shala Darpan Incharge mapping.'
      }
    ],
    relatedGuides: [
      { id: 'peeo-orders-guide', titleHi: 'पीईईओ प्रशासनिक आदेश जनरेटर', titleEn: 'PEEO Orders Generator', categoryHi: 'पीईईओ टूल्स' },
      { id: 'mdm-guide', titleHi: 'मिड-डे मील रजिस्टर गाइड', titleEn: 'MDM Register Guide', categoryHi: 'प्रभारी दायित्व' }
    ],
    internalToolLinks: [
      { toolId: 'peeo-incharge', nameHi: 'प्रभारी मैपिंग टूल', nameEn: 'Incharge Mapping Tool', descriptionHi: 'योजना प्रभार आवंटन आदेश तैयार करें' },
      { toolId: 'incharge-mdm', nameHi: 'एमडीएम प्रभारी टूल', nameEn: 'MDM Incharge Module', descriptionHi: 'दैनिक खाद्यान्न व कुकिंग कॉस्ट रजिस्टर' }
    ],
    faqItems: [
      {
        questionHi: 'क्या एक शिक्षक को एक से अधिक प्रभार दिए जा सकते हैं?',
        questionEn: 'Can multiple charges be assigned to one teacher?',
        answerHi: 'हाँ, स्टाफ की संख्या कम होने पर संस्थाप्रधान द्वारा एक शिक्षक को दो या अधिक प्रभार सौंपे जा सकते हैं।',
        answerEn: 'Yes, in schools with limited staff, teachers can be assigned multiple complementary charges.'
      }
    ]
  },
  {
    id: 'peeo-substitution-guide',
    toolId: 'peeo-substitution',
    categoryKey: 'peeo',
    categoryHi: 'पीईईओ व संस्थाप्रधान',
    categoryEn: 'PEEO & Admin',
    titleHi: 'दैनिक शिक्षक स्थानापन्न (Teacher Substitution / Roster) व्यवस्था गाइड',
    titleEn: 'Daily Teacher Substitution & Period Arrangement Register Guide',
    readTime: '3 मिनट',
    updatedDate: '2026-08-15',
    iconName: 'Clock',
    summaryHi: 'अवकाश पर रहे शिक्षकों के स्थान पर रिक्त कालांशों में अन्य शिक्षकों की स्वतः निष्पक्ष व्यवस्था एवं दैनिक स्थानापन्न रजिस्टर।',
    summaryEn: 'Manage daily free periods, allocate substitute teachers for absent staff, and maintain digital substitution log.',
    seoMeta: {
      titleTag: 'Daily Teacher Substitution Register Rajasthan | Shala Sahayak',
      metaDescription: 'Automated school teacher substitution arrangement for absent staff. Fair workload rotation and daily substitution register print for Rajasthan schools.',
      h1Tag: 'दैनिक शिक्षक स्थानापन्न (अरेंजमेंट) व्यवस्था: संपूर्ण गाइड',
      slugUrl: '/peeo-substitution-guide',
      imageAltText: 'Daily Teacher substitution arrangement sheet showing absent staff and replacement teacher period assignments'
    },
    overviewHi: 'विद्यालय में प्रतिदिन आकस्मिक या अन्य अवकाश पर रहने वाले शिक्षकों के कालांशों को अन्य उपलब्ध (Free) शिक्षकों को निष्पक्ष रूप से आवंटित कर कक्षा अनुशासन व शिक्षण बनाए रखना होता है।',
    overviewEn: 'Organize replacement teachers for absent staff periods while ensuring fair rotation of workload.',
    prerequisitesHi: [
      'आज अनुपस्थित शिक्षकों की सूची',
      'विद्यालय की मास्टर समय-सारणी (Master Timetable)',
      'उपलब्ध शिक्षकों का कालांशवार विवरण'
    ],
    prerequisitesEn: [
      'List of teachers on leave today',
      'Master timetable schedule',
      'Free period status of available staff'
    ],
    keyBenefitsHi: [
      'खाली पीरियड वाले शिक्षकों की तुरंत पहचान',
      'समान व निष्पक्ष कार्यभार वितरण (Fair Rotation)',
      'एक-क्लिक में दैनिक व्यवस्था पर्ची व रजिस्टर प्रिंट'
    ],
    keyBenefitsEn: [
      'Instant detection of available teachers in any period',
      'Balanced workload rotation preventing teacher fatigue',
      'One-click daily substitution slip and register log export'
    ],
    steps: [
      {
        stepNum: 1,
        titleHi: 'अनुपस्थित शिक्षक का चयन करें',
        titleEn: 'Select Absent Teachers',
        descriptionHi: 'आज अवकाश पर रहे शिक्षक का नाम चुनें। उनके सभी 8 कालांश स्क्रीन पर प्रदर्शित होंगे।',
        descriptionEn: 'Select teachers on leave today. Their daily schedule will be shown.',
        tipHi: 'आकस्मिक अवकाश (CL) अथवा राजकीय ड्यूटी (OD) कारण अंकित करें।',
        tipEn: 'Record whether absence is due to CL, medical, or official duty.'
      },
      {
        stepNum: 2,
        titleHi: 'उपलब्ध शिक्षक असाइन करें',
        titleEn: 'Assign Free Teachers',
        descriptionHi: 'सिस्टम उस पीरियड में खाली शिक्षकों के नाम सुझाएगा। उपयुक्त शिक्षक का चयन करें।',
        descriptionEn: 'System lists staff with free periods for that hour. Click to assign.',
        tipHi: 'समान विषय के शिक्षक को प्राथमिकता दें ताकि पढ़ाई प्रभावित न हो।',
        tipEn: 'Prefer teachers of relevant subject for meaningful revision.'
      },
      {
        stepNum: 3,
        titleHi: 'व्यवस्था पर्ची प्रिंट करें',
        titleEn: 'Print Daily Roster Slip',
        descriptionHi: 'दैनिक अरेंजमेंट पर्ची का प्रिंट लें और संबंधित शिक्षकों को सूचित करें।',
        descriptionEn: 'Print daily roster slip for morning staff circulation and sign-off.',
        tipHi: 'दैनिक पंजिका में इसे क्रमबद्ध चस्पा करें।',
        tipEn: 'File slips into physical school substitution binder.'
      }
    ],
    relatedGuides: [
      { id: 'peeo-timetable-guide', titleHi: 'समय-सारणी जनरेटर', titleEn: 'Timetable Generator', categoryHi: 'पीईईओ टूल्स' },
      { id: 'peeo-orders-guide', titleHi: 'पीईईओ आदेश जनरेटर', titleEn: 'PEEO Orders Generator', categoryHi: 'पीईईओ टूल्स' }
    ],
    internalToolLinks: [
      { toolId: 'peeo-substitution', nameHi: 'दैनिक स्थानापन्न टूल', nameEn: 'Substitution Tracker', descriptionHi: 'अनुपस्थित शिक्षकों की व्यवस्था 10 सेकंड में लगाएं' }
    ],
    faqItems: [
      {
        questionHi: 'क्या स्थानापन्न रजिस्टर का संधारण निरीक्षण में देखा जाता है?',
        questionEn: 'Is the substitution register checked during school inspections?',
        answerHi: 'हाँ, प्रशासनिक व शैक्षणिक निरीक्षण के दौरान दैनिक स्थानापन्न पंजिका का अवलोकन अनिवार्य रूप से किया जाता है।',
        answerEn: 'Yes, inspection teams regularly audit substitution logs to verify instructional continuity.'
      }
    ]
  },
  {
    id: 'peeo-apar-guide',
    toolId: 'peeo-apar',
    categoryKey: 'peeo',
    categoryHi: 'पीईईओ व संस्थाप्रधान',
    categoryEn: 'PEEO & Admin',
    titleHi: 'राजकाज (RajKaj) APAR / ACR एवं अचल संपत्ति विवरणी (IPR) ट्रैकर गाइड',
    titleEn: 'RajKaj APAR ACR & Immovable Property Return (IPR) Monitoring Guide',
    readTime: '4 मिनट',
    updatedDate: '2026-08-15',
    iconName: 'Award',
    summaryHi: 'शिक्षकों व कार्मिकों की वार्षिक कार्य मूल्यांकन प्रतिवेदन (APAR) एवं अचल संपत्ति (IPR) ऑनलाइन फाइलिंग स्थिति मॉनिटरिंग टूल।',
    summaryEn: 'Track RajKaj online APAR ACR appraisal submission, reporting, reviewing status, and annual IPR compliance.',
    seoMeta: {
      titleTag: 'RajKaj APAR and IPR Tracker Rajasthan | Shala Sahayak',
      metaDescription: 'Track Rajasthan school teacher RajKaj APAR (ACR) and IPR filing status. Avoid salary freeze with timely annual appraisal tracking tool free!',
      h1Tag: 'राजकाज APAR व IPR ट्रैकर: राजस्थान शिक्षा विभाग संपूर्ण गाइड',
      slugUrl: '/peeo-apar-guide',
      imageAltText: 'RajKaj APAR and IPR filing status monitoring dashboard with teacher list and submission dates'
    },
    overviewHi: 'राजस्थान कार्मिक विभाग के नियमानुसार प्रतिवर्ष सभी राज्य कर्मचारियों को राजकाज पोर्टल पर अचल संपत्ति विवरण (1 जनवरी से 31 जनवरी तक) एवं वार्षिक कार्य मूल्यांकन प्रतिवेदन (APAR) भरना अनिवार्य है। समय पर न भरने पर वेतन वृद्धि व पदोन्नति बाधित हो सकती है।',
    overviewEn: 'Annual APAR appraisal and January IPR filing on RajKaj portal are mandatory for all Rajasthan state employees.',
    prerequisitesHi: [
      'कार्मिकों की एसएसओ आईडी (SSO ID) एवं कर्मचारी आईडी',
      'राजकाज पर फाइलिंग की अंतिम तिथि की जानकारी',
      'प्रतिवेदक, समीक्षक एवं स्वीकारकर्ता अधिकारी की मैपिंग'
    ],
    prerequisitesEn: [
      'Staff SSO ID and Employee ID',
      'Filing deadlines published by DoP',
      'Reporting, Reviewing, and Accepting authority mapping'
    ],
    keyBenefitsHi: [
      'सभी स्टाफ के फाइलिंग स्टेटस का सिंगल-क्लिक डैशबोर्ड',
      'अंतिम तिथि से पूर्व अलर्ट एवं रिमाइंडर सूची',
      'पीईईओ द्वारा उच्चाधिकारियों को भेजने योग्य प्रमाणीकरण रिपोर्ट'
    ],
    keyBenefitsEn: [
      'Single-window status view for entire PEEO cluster staff',
      'Deadline tracking and pending alerts',
      'Official cluster compliance certificate for CBEO'
    ],
    steps: [
      {
        stepNum: 1,
        titleHi: 'APAR/IPR ट्रैकर खोलें',
        titleEn: 'Open APAR/IPR Tracker',
        descriptionHi: 'पीईईओ प्रभाग से "APAR व IPR ट्रैकर" चुनें।',
        descriptionEn: 'Select APAR & IPR Tracker from PEEO tools.',
        tipHi: 'सत्र 2025-26 एवं 2026-27 के फिल्टर उपलब्ध हैं।',
        tipEn: 'Financial years 2025-26 and 2026-27 are supported.'
      },
      {
        stepNum: 2,
        titleHi: 'फाइलिंग स्थिति अपडेट करें',
        titleEn: 'Update Filing Status',
        descriptionHi: 'प्रत्येक कार्मिक के सम्मुख Submitted, Accepted या Pending स्थिति दर्ज करें।',
        descriptionEn: 'Record whether APAR is submitted, reviewed, or pending for each teacher.',
        tipHi: 'आईसीआर नंबर व सबमिशन तिथि दर्ज कर रिकॉर्ड सुरक्षित रखें।',
        tipEn: 'Store submission date and RajKaj acknowledgement reference.'
      },
      {
        stepNum: 3,
        titleHi: 'समेकित रिपोर्ट प्रिंट करें',
        titleEn: 'Export Compliance Report',
        descriptionHi: 'पीईईओ क्षेत्र की 100% अनुपालना रिपोर्ट जनरेट कर सीबीईओ कार्यालय को प्रेषित करें।',
        descriptionEn: 'Generate consolidated cluster compliance report for submission to CBEO/DEO office.',
        tipHi: 'जनवरी माह में आईपीआर की हार्ड कॉपी भी कार्यालय पत्रावली में रखें।',
        tipEn: 'Keep signed printout of January IPR in school file.'
      }
    ],
    relatedGuides: [
      { id: 'peeo-orders-guide', titleHi: 'पीईईओ आदेश जनरेटर', titleEn: 'PEEO Orders Generator', categoryHi: 'पीईईओ टूल्स' },
      { id: 'peeo-pramanikaran-guide', titleHi: 'प्रमाणीकरण रिपोर्ट हब', titleEn: 'Verification Hub', categoryHi: 'पीईईओ टूल्स' }
    ],
    internalToolLinks: [
      { toolId: 'peeo-apar', nameHi: 'APAR व IPR ट्रैकर', nameEn: 'APAR & IPR Tracker', descriptionHi: 'स्टाफ की एसीआर व संपत्ति फाइलिंग स्थिति ट्रैक करें' }
    ],
    faqItems: [
      {
        questionHi: 'आईपीआर न भरने पर क्या प्रभाव पड़ता है?',
        questionEn: 'What is the penalty for not filing IPR?',
        answerHi: 'कार्मिक विभाग के परिपत्र अनुसार 31 जनवरी तक आईपीआर न भरने पर कार्मिक का फरवरी माह का वेतन एवं सतर्कता अनापत्ति (VCC) रोक दी जाती है।',
        answerEn: 'Failure to file annual IPR by Jan 31st leads to salary withholding and refusal of Vigilance Clearance.'
      }
    ]
  },
  {
    id: 'peeo-pramanikaran-guide',
    toolId: 'peeo-pramanikaran',
    categoryKey: 'peeo',
    categoryHi: 'पीईईओ व संस्थाप्रधान',
    categoryEn: 'PEEO & Admin',
    titleHi: 'आधार, जन-आधार एवं अपार (APAAR) आईडी प्रमाणीकरण रिपोर्ट हब गाइड',
    titleEn: 'Aadhaar, Jan-Aadhaar & APAAR ID Authentication Reports Hub Guide',
    readTime: '3 मिनट',
    updatedDate: '2026-08-15',
    iconName: 'FileCheck',
    summaryHi: 'शाला दर्पण पर छात्र एवं स्टाफ के आधार, जनआधार व अपार आईडी प्रमाणीकरण की प्रतिशत प्रगति एवं रिपोर्ट जनरेटर।',
    summaryEn: 'Track student & staff Aadhaar, Jan Aadhaar, and APAAR ID authentication progress on Shala Darpan.',
    seoMeta: {
      titleTag: 'Shala Darpan Aadhaar & APAAR Verification Tracker | Shala Sahayak',
      metaDescription: 'Monitor student Aadhaar, Jan Aadhaar and APAAR ID authentication progress in Rajasthan schools. Generate cluster verification report free!',
      h1Tag: 'प्रमाणीकरण रिपोर्ट हब: आधार, जन-आधार व अपार आईडी संपूर्ण गाइड',
      slugUrl: '/peeo-pramanikaran-guide',
      imageAltText: 'Shala Darpan Aadhaar and APAAR verification progress tracker showing verified and mismatch student counts'
    },
    overviewHi: 'शिक्षा विभाग द्वारा डीबीटी योजनाओं (छात्रवृत्ति, यूनिफॉर्म, दूध, ट्रांसपोर्ट) के सुचारु लाभ हेतु शाला दर्पण पर प्रत्येक विद्यार्थी का आधार एवं जन-आधार प्रमाणीकरण अनिवार्य किया गया है।',
    overviewEn: 'Authentication of student Aadhaar, Jan-Aadhaar, and APAAR IDs is mandatory on Shala Darpan for all DBT welfare schemes.',
    prerequisitesHi: [
      'कक्षावार नामांकित विद्यार्थियों की कुल संख्या',
      'प्रमाणित एवं लंबित आधार/जन-आधार की संख्या',
      'जनरेटेड अपार (APAAR) आईडी की स्थिति'
    ],
    prerequisitesEn: [
      'Total class enrollment counts',
      'Verified and pending Aadhaar/Jan-Aadhaar numbers',
      'Generated APAAR ID status'
    ],
    keyBenefitsHi: [
      'पीईईओ परिक्षेत्र के समस्त विद्यालयों की तुलनात्मक प्रगति',
      'मिसमैच (नाम, जन्मतिथि, लिंग) वाले छात्रों की पहचान',
      'समीक्षा बैठकों हेतु त्वरित सारांश रिपोर्ट'
    ],
    keyBenefitsEn: [
      'Comparative progress report across all feeder schools',
      'Instant identification of mismatch cases for parent follow-up',
      'Ready executive summary for CBEO review meetings'
    ],
    steps: [
      {
        stepNum: 1,
        titleHi: 'प्रमाणीकरण हब खोलें',
        titleEn: 'Open Verification Hub',
        descriptionHi: 'पीईईओ टूल्स से "प्रमाणीकरण रिपोर्ट हब" चुनें।',
        descriptionEn: 'Select Verification Reports Hub from PEEO Tools menu.',
        tipHi: 'छात्र अथवा स्टाफ टैब का चयन करें।',
        tipEn: 'Toggle between Student or Staff view.'
      },
      {
        stepNum: 2,
        titleHi: 'शाला दर्पण डेटा से मिलान करें',
        titleEn: 'Sync with Shala Darpan Figures',
        descriptionHi: 'शाला दर्पण के मॉड्यूल 9 (प्रमाणीकरण) से प्रमाणित व लंबित संख्या दर्ज करें।',
        descriptionEn: 'Input verified and pending counts from Shala Darpan authentication portal.',
        tipHi: 'प्रतिशत स्वतः परिकलित हो जाता है।',
        tipEn: 'Percentages calculate automatically.'
      },
      {
        stepNum: 3,
        titleHi: 'रिपोर्ट डाउनलोड करें',
        titleEn: 'Download Cluster Report',
        descriptionHi: 'प्रमाणीकरण प्रगति पत्रक का प्रिंट निकालें।',
        descriptionEn: 'Export clean printable A4 authentication report with school seal.',
        tipHi: 'विभागीय वीसी बैठकों से पूर्व इसे अद्यतन करें।',
        tipEn: 'Update figures prior to departmental review meetings.'
      }
    ],
    relatedGuides: [
      { id: 'teacher-anomaly-guide', titleHi: 'आधार व अपार विसंगति निवारण', titleEn: 'Aadhaar Discrepancy Rectifier', categoryHi: 'शिक्षक टूल्स' },
      { id: 'udise-guide', titleHi: 'यू-डाइस+ रिपोर्ट गाइड', titleEn: 'UDISE+ Report Guide', categoryHi: 'प्रभारी दायित्व' }
    ],
    internalToolLinks: [
      { toolId: 'peeo-pramanikaran', nameHi: 'प्रमाणीकरण रिपोर्ट हब', nameEn: 'Verification Hub', descriptionHi: 'आधार व अपार प्रमाणीकरण रिपोर्ट बनाएं' },
      { toolId: 'teacher-anomaly', nameHi: 'विसंगति समाधान टूल', nameEn: 'Anomaly Resolver', descriptionHi: 'छात्र आधार मिसमैच का समाधान करें' }
    ],
    faqItems: [
      {
        questionHi: 'अपार (APAAR) आईडी बनाने के लिए क्या आवश्यक है?',
        questionEn: 'What is required to generate an APAAR ID?',
        answerHi: 'अपार आईडी जनरेट करने हेतु अभिभावक की सहमति (Parental Consent) तथा विद्यार्थी का आधार यू-डाइस पोर्टल पर प्रमाणित होना अनिवार्य है।',
        answerEn: 'Generating an APAAR ID requires signed parental consent and verified student Aadhaar on UDISE+.'
      }
    ]
  },
  {
    id: 'peeo-satyapan-guide',
    toolId: 'peeo-satyapan',
    categoryKey: 'peeo',
    categoryHi: 'पीईईओ व संस्थाप्रधान',
    categoryEn: 'PEEO & Admin',
    titleHi: 'वार्षिक भौतिक सत्यापन (Physical Stock Verification) चेकलिस्ट एवं रिपोर्ट गाइड',
    titleEn: 'Annual Physical Stock & Asset Verification Checklist & Report Guide',
    readTime: '3 मिनट',
    updatedDate: '2026-08-15',
    iconName: 'FileCheck',
    summaryHi: 'विद्यालय के फर्नीचर, आईसीटी उपकरण, खेल सामग्री, पुस्तकालय एवं विज्ञान प्रयोगशाला का वार्षिक भौतिक सत्यापन प्रपत्र।',
    summaryEn: 'Annual physical asset verification, furniture, ICT lab equipment, sports goods, and library stock inspection checklist.',
    seoMeta: {
      titleTag: 'School Physical Stock Verification Checklist Rajasthan | Shala Sahayak',
      metaDescription: 'Complete school physical asset and stock verification checklist for Rajasthan schools. Generate annual inspection certificate in A4 PDF free!',
      h1Tag: 'वार्षिक भौतिक सत्यापन चेकलिस्ट: राजस्थान विद्यालय संपूर्ण गाइड',
      slugUrl: '/peeo-satyapan-guide',
      imageAltText: 'Rajasthan school physical stock verification checklist showing furniture, ICT computers, and science lab assets'
    },
    overviewHi: 'वित्तीय वर्ष की समाप्ति पर विद्यालय में उपलब्ध समस्त स्थायी व उपभोज्य सामग्री का भौतिक सत्यापन एक निष्पक्ष जांच दल द्वारा किया जाकर रिपोर्ट तैयार की जाती है।',
    overviewEn: 'Annual physical stock verification is conducted by a designated committee to inspect and verify all school physical assets.',
    prerequisitesHi: [
      'विद्यालय स्टॉक रजिस्टर (स्थायी व उपभोज्य भंडार)',
      'सत्यापन दल गठन आदेश',
      'विगत वर्ष का भौतिक सत्यापन प्रतिवेदन'
    ],
    prerequisitesEn: [
      'School Stock Registers (Permanent & Consumable)',
      'Verification Committee appointment order',
      'Previous year stock verification report'
    ],
    keyBenefitsHi: [
      'फर्नीचर, कंप्यूटर, पुस्तकालय, खेल सामग्री की मानकीकृत चेकलिस्ट',
      'अनुपयोगी व अनुपलब्ध सामग्री (Write-off) हेतु स्पष्ट टिप्पणी कॉलम',
      'जांच दल के सदस्यों के हस्ताक्षर सहित तैयार आधिकारिक रिपोर्ट'
    ],
    keyBenefitsEn: [
      'Standardized checklists for furniture, ICT, sports, and library',
      'Designated columns for condoned and write-off items',
      'Official committee signature endorsement format'
    ],
    steps: [
      {
        stepNum: 1,
        titleHi: 'भौतिक सत्यापन प्रभाग खोलें',
        titleEn: 'Open Stock Verification',
        descriptionHi: 'पीईईओ टूल्स से "दस्तावेज़ सत्यापन / भौतिक सत्यापन" का चयन करें।',
        descriptionEn: 'Select Physical Verification Checklist from PEEO Tools menu.',
        tipHi: 'सत्र एवं सत्यापन दल के सदस्यों के नाम दर्ज करें।',
        tipEn: 'Enter session year and committee member designations.'
      },
      {
        stepNum: 2,
        titleHi: 'मदवार भौतिक सत्यापन करें',
        titleEn: 'Inspect Assets by Category',
        descriptionHi: 'फर्नीचर, आईसीटी लैब, खेल सामग्री, विज्ञान प्रयोगशाला व पुस्तकालय का भौतिक मिलान कर प्रविष्टि करें।',
        descriptionEn: 'Verify physical availability against stock registers for each department.',
        tipHi: 'टूटी-फूटी या अनुपयोगी सामग्री को नीलामी श्रेणी में चिन्हित करें।',
        tipEn: 'Flag broken or damaged assets for formal auction / write-off.'
      },
      {
        stepNum: 3,
        titleHi: 'सत्यापन प्रमाण पत्र जनरेट करें',
        titleEn: 'Generate & Sign Report',
        descriptionHi: 'जावक क्रमांक दर्ज कर सत्यापन प्रमाण पत्र प्रिंट करें और जांच दल व संस्थाप्रधान के हस्ताक्षर करवाएं।',
        descriptionEn: 'Print the verification certificate, acquire committee signatures, and submit to CBEO.',
        tipHi: 'इसकी मूल प्रति स्टॉक रजिस्टर के साथ सुरक्षित रखें।',
        tipEn: 'Affix the original report inside the school stock register.'
      }
    ],
    relatedGuides: [
      { id: 'peeo-orders-guide', titleHi: 'पीईईओ प्रशासनिक आदेश', titleEn: 'PEEO Orders Generator', categoryHi: 'पीईईओ टूल्स' },
      { id: 'teacher-ict-guide', titleHi: 'कंप्यूटर लैब स्टॉक रजिस्टर', titleEn: 'Computer Lab Stock', categoryHi: 'शिक्षक टूल्स' }
    ],
    internalToolLinks: [
      { toolId: 'peeo-satyapan', nameHi: 'भौतिक सत्यापन टूल', nameEn: 'Stock Verification Tool', descriptionHi: 'वार्षिक भंडार व संपत्ति सत्यापन रिपोर्ट बनाएं' }
    ],
    faqItems: [
      {
        questionHi: 'भौतिक सत्यापन कब कराया जाना चाहिए?',
        questionEn: 'When should physical stock verification be completed?',
        answerHi: 'शिविरा पंचांग एवं सामान्य वित्तीय एवं लेखा नियम (GF&AR) अनुसार प्रतिवर्ष मार्च-अप्रैल में वार्षिक सत्यापन पूर्ण किया जाता है।',
        answerEn: 'Per GF&AR rules and Shivira calendar, annual verification must be executed in March-April.'
      }
    ]
  }
];
