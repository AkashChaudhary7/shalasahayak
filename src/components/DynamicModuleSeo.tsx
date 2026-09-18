import React, { useEffect, useState } from 'react';
import { getSeoPageConfig } from '../data/seoConfig';

export interface DynamicModuleSeoProps {
  currentView?: string;
  category?: string;
  activeToolId?: string;
}

export const DynamicModuleSeo: React.FC<DynamicModuleSeoProps> = ({
  currentView,
  category,
  activeToolId
}) => {
  const [locationPath, setLocationPath] = useState<string>(() => window.location.pathname);

  useEffect(() => {
    // Handler for route changes
    const handleLocationChange = () => {
      setLocationPath(window.location.pathname);
    };

    // Listen to standard popstate (browser back/forward and dispatched popstate)
    window.addEventListener('popstate', handleLocationChange);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  useEffect(() => {
    let title = "शाला सहायक | राजस्थान विद्यालय प्रबंधन एवं शिक्षक टूलकिट";
    let description = "शाला सहायक (Shala Sahayak) राजस्थान के शिक्षकों, PEEO, परीक्षा प्रभारियों व MDM प्रभारियों हेतु डिजिटल सहायक टूलकिट। शाला दर्पण गणना, बाल गोपाल दुग्ध, परीक्षा सीटिंग प्लान व आदेश जनरेटर।";
    
    // Normalize path for clean direct HTML5 history routing
    const pathname = window.location.pathname.toLowerCase().replace(/^\//, '');
    const activeRoute = pathname || 'home';
    let pageUrl = `https://shalasahayak.in${window.location.pathname.startsWith('/') ? window.location.pathname : '/' + window.location.pathname}`;

    const schemaData: any = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "SoftwareApplication",
          "name": "Shala Sahayak",
          "operatingSystem": "All",
          "applicationCategory": "EducationalApplication",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "INR"
          },
          "description": description
        },
        {
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "शाला सहायक (Shala Sahayak) क्या है?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "शाला सहायक राजस्थान के राजकीय विद्यालयों के शिक्षकों, PEEO, परीक्षा प्रभारियों और MDM प्रभारियों के लिए एक निःशुल्क डिजिटल टूलकिट है, जिससे शाला दर्पण प्रविष्टियाँ, क्रीड़ा शुल्क प्रपत्र, मिड-डे मील और वेतन गणना सरलता से की जाती है।"
              }
            },
            {
              "@type": "Question",
              "name": "क्रीड़ा शुल्क प्रपत्र मेकर (Krida Shulk Maker) का उपयोग कैसे करें?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "क्रीड़ा शुल्क मेकर में कक्षावार छात्र-छात्रा संख्या दर्ज करें। प्रारूप क व ख के अनुसार शुल्क की ऑटो-गणना होगी और एक क्लिक में पीडीएफ प्रिंट किया जा सकता है।"
              }
            },
            {
              "@type": "Question",
              "name": "PEEO आदेश जनरेटर से कौन-से आदेश तैयार होते हैं?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "PEEO आदेश जनरेटर से कार्यमुक्ति, कार्यग्रहण, रिलीविंग लेटर, विभागीय ड्यूटी आदेश व आकस्मिक अवकाश अनुमोदन पत्र तुरंत तैयार किए जाते हैं।"
              }
            }
          ]
        },
        {
          "@type": "WebSite",
          "@id": "https://shalasahayak.in/#website",
          "url": "https://shalasahayak.in/",
          "name": "Shala Sahayak",
          "alternateName": "शाला सहायक",
          "description": "राजस्थान विद्यालय प्रबंधन एवं शिक्षक टूलकिट",
          "potentialAction": {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": "https://shalasahayak.in/?search={search_term_string}"
            },
            "query-input": "required name=search_term_string"
          }
        },
        {
          "@type": "SiteNavigationElement",
          "@id": "https://shalasahayak.in/#navigation",
          "hasPart": [
            { "@type": "WebPage", "name": "मुख्य होम (Home)", "url": "https://shalasahayak.in/" },
            { "@type": "WebPage", "name": "पीईईओ टूल्स (PEEO Tools)", "url": "https://shalasahayak.in/peeo-tools" },
            { "@type": "WebPage", "name": "शिविरा कैलेंडर 2026-27", "url": "https://shalasahayak.in/shivira" },
            { "@type": "WebPage", "name": "प्रभारी पोर्टल (Incharge Portal)", "url": "https://shalasahayak.in/incharge-portal" },
            { "@type": "WebPage", "name": "शिक्षक टूलकिट (Teacher Tools)", "url": "https://shalasahayak.in/teacher-tools" }
          ]
        }
      ]
    };

    const seoConfig = getSeoPageConfig(activeRoute);
    if (seoConfig) {
      title = seoConfig.title;
      description = seoConfig.description;
      pageUrl = seoConfig.canonical;

      // WebApplication Schema
      schemaData["@graph"].push({
        "@type": "WebApplication",
        "name": seoConfig.h1,
        "description": seoConfig.description,
        "url": seoConfig.canonical,
        "applicationCategory": "EducationalApplication",
        "operatingSystem": "All",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      });

      // BreadcrumbList Schema
      if (seoConfig.breadcrumbs && seoConfig.breadcrumbs.length > 0) {
        schemaData["@graph"].push({
          "@type": "BreadcrumbList",
          "itemListElement": seoConfig.breadcrumbs.map((b, i) => ({
            "@type": "ListItem",
            "position": i + 1,
            "name": b.name,
            "item": b.url
          }))
        });
      }

      // HowTo Schema
      if (seoConfig.howToSteps && seoConfig.howToSteps.length > 0) {
        schemaData["@graph"].push({
          "@type": "HowTo",
          "name": seoConfig.h1,
          "description": seoConfig.description,
          "step": seoConfig.howToSteps.map(s => ({
            "@type": "HowToStep",
            "name": s.name,
            "text": s.text
          }))
        });
      }

      // FAQPage Schema
      if (seoConfig.faqs && seoConfig.faqs.length > 0) {
        schemaData["@graph"].push({
          "@type": "FAQPage",
          "mainEntity": seoConfig.faqs.map(f => ({
            "@type": "Question",
            "name": f.question,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": f.answer
            }
          }))
        });
      }
    }

    // Granular Module Route Mapping & Dynamic META Head Management
    if (activeRoute === 'home' || activeRoute === 'dashboard' || activeRoute === '') {
      title = "शाला सहायक | राजस्थान विद्यालय प्रबंधन एवं शिक्षक टूलकिट";
      description = "शाला सहायक (Shala Sahayak) राजस्थान के शिक्षकों, PEEO, परीक्षा प्रभारियों व MDM प्रभारियों हेतु डिजिटल सहायक टूलकिट। शाला दर्पण गणना, बाल गोपाल दुग्ध, परीक्षा सीटिंग प्लान व आदेश जनरेटर।";
    } else if (activeRoute === 'peeo-tools' || activeRoute === 'peeo') {
      title = "पीईईओ टूल्स व आदेश जनरेटर | शाला सहायक";
      description = "PEEO प्रशासनिक टूलकिट & डिजिटल आदेश जनरेटर। PEEO आधिकारिक ड्यूटी आदेश जनरेटर, 7th Pay Matrix & ACP स्थिरीकरण, पदोन्नति पात्रता एवं विद्यालय मैपिंग टूल्स।";
    } else if (activeRoute === 'peeo-increment/calculator' || activeRoute === 'staff-increment') {
      title = "वार्षिक वेतन वृद्धि व 3% वेतन निर्धारण आदेश जनरेटर | Shala Sahayak";
      description = "7वें वेतन आयोग अनुसार 1 जुलाई हेतु 3% वार्षिक वेतन वृद्धि गणना, पे-मैट्रिक्स निर्धारण एवं कार्यालय आदेश पीडीएफ जनरेटर।";
    } else if (activeRoute === 'peeo-timetable/generator' || activeRoute === 'peeo-timetable') {
      title = "PEEO विद्यालय समय-सारणी जनरेटर (Time Table Maker) | Shala Sahayak";
      description = "कक्षावार व शिक्षकवार ऑटोमैटिक 8-कालांश समय-सारणी निर्माण टूल। रिक्त कालांश व्यवस्था व विषय आवंटन चार्ट।";
    } else if (activeRoute === 'peeo-substitution/tracker' || activeRoute === 'teacher-substitution') {
      title = "दैनिक शिक्षक स्थानापन्न (Substitution arrangement) | Shala Sahayak";
      description = "अनुपस्थित अध्यापकों के खाली कालांशों की सुव्यवस्थित व्यवस्था हेतु दैनिक शिक्षक स्थानापन्न चार्ट व प्रविष्टि पंजी।";
    } else if (activeRoute === 'peeo-apar/appraisal' || activeRoute === 'apar-appraisal') {
      title = "APAR व IPR राजकाज फाइलिंग स्थिति मॉनिटर | Shala Sahayak";
      description = "राजकाज (RajKaj) पोर्टल पर वार्षिक कार्य मूल्यांकन प्रतिवेदन (APAR) एवं अचल संपत्ति विवरण (IPR) प्रविष्टि स्थिति ट्रैकर।";
    } else if (activeRoute === 'incharge-portal' || activeRoute === 'work-incharge' || activeRoute === 'incharge') {
      title = "प्रभारी पोर्टल (परीक्षा, एमडीएम, ईएलसी) | शाला सहायक";
      description = "परीक्षा एवं विद्यालय प्रभारी डिजिटल टूलकिट। बोर्ड परीक्षा सीटिंग प्लान जनरेटर, वीक्षक ड्यूटी रोस्टर, आईसीटी लैब स्टॉक रजिस्टर व पुस्तकालय प्रबंधन।";
    } else if (activeRoute === 'incharge-mdm/calculator' || activeRoute === 'mid-day-meal') {
      title = "मिड-डे मील (MDM) व बाल गोपाल दूध योजना कैलकुलेटर | Shala Sahayak";
      description = "दैनिक मिड-डे मील खाद्यान्न खपत, कुकिंग कॉस्ट, बाल गोपाल दूध पाउडर व चीनी की मात्रा ऑटो-कैलकुलेटर एवं मासिक पंजी।";
    } else if (activeRoute === 'incharge-exam/roster' || activeRoute === 'exam-roster') {
      title = "परीक्षा सीटिंग अरेंजमेंट व वीक्षक ड्यूटी रोस्टर मेकर | Shala Sahayak";
      description = "वार्षिक व बोर्ड परीक्षा हेतु कक्षवार छात्र बैठक व्यवस्था, डोर स्लिप, सिटिंग चार्ट एवं वीक्षक ड्यूटी ऑटो-रोस्टर जनरेटर।";
    } else if (activeRoute === 'incharge-transport/voucher' || activeRoute === 'transport-voucher') {
      title = "ट्रांसपोर्ट वाउचर योग्य छात्र DBT सूची जनरेटर | Shala Sahayak";
      description = "दूरी श्रेणी अनुसार पात्र छात्र-छात्राओं की ट्रांसपोर्ट वाउचर ट्रैकिंग, दैनिक उपस्थिति भत्ता गणना व डीबीटी प्रपत्र।";
    } else if (activeRoute === 'incharge-scholarship/calculator' || activeRoute === 'scholarship-calculator') {
      title = "पूर्व व उत्तर मैट्रिक छात्रवृत्ति पात्रता जांच ट्रैकर | Shala Sahayak";
      description = "श्रेणीवार एवं आय सीमा अनुसार छात्रवृत्ति पात्रता स्वतः चयन, आवेदन सत्यापन चेकलिस्ट एवं छात्रवृत्ति स्टेटस ट्रैकर।";
    } else if (activeRoute === 'incharge-inspire' || activeRoute === 'incharge-portal/inspire/nominations') {
      title = "इंस्पायर अवॉर्ड मानक योजना गाइड व विचार बैंक | Shala Sahayak";
      description = "इन्नोवेटिव आइडिया जनरेटर, छात्र नामांकन सत्यापन, प्रमाण-पत्र जनरेटर व इंस्पायर अवार्ड मानक योजना टूलकिट।";
    } else if (activeRoute === 'incharge-udise' || activeRoute === 'incharge-portal/udise/report') {
      title = "यू-डाइस+ (UDISE+) प्रमाणीकरण एवं रिपोर्ट प्रपत्र जनरेटर | Shala Sahayak";
      description = "शिक्षक प्रोफाइल, स्कूल इंफ्रास्ट्रक्चर व छात्र APAAR ID प्रमाणीकरण प्रपत्र A4 प्रिंट एवं विभागीय रिपोर्ट जनरेटर।";
    } else if (activeRoute === 'teacher-tools' || activeRoute === 'teacher') {
      title = "शिक्षक एवं कक्षा-अध्यापक डिजिटल टूलकिट | शाला सहायक";
      description = "बाल गोपाल योजना दूध व MDM खाद्यान्न कैलकुलेटर, दैनिक शिक्षक डायरी, अंकतालिका व ग्रेड कैलकुलेटर टूल।";
    } else if (activeRoute === 'teacher/pti/kridashulk' || activeRoute === 'krida-shulk' || activeRoute === 'krida-shulk-maker') {
      title = "क्रीड़ा शुल्क विवरण प्रपत्र मेकर (Sports Fee Details Form) | Shala Sahayak";
      description = "राजस्थान राजकीय विद्यालय क्रीड़ा शुल्क प्रविष्टि प्रपत्र (प्रारूप क व ख) ऑनलाइन मेकर। विद्यार्थी संख्या अनुसार शुल्क की ऑटो-गणना, पीडीएफ प्रिंट एवं आधिकारिक रिकॉर्ड संधारण।";
      schemaData["@graph"].push({
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": "क्रीड़ा शुल्क प्रविष्टि प्रपत्र (Sports Fee Maker) कैसे तैयार करें",
        "description": description,
        "step": [
          { "@type": "HowToStep", "name": "विद्यालय विवरण दर्ज करें", "text": "अपने स्कूल का नाम, जिला, ब्लॉक और यूडाइस (UDISE) कोड भरें।" },
          { "@type": "HowToStep", "name": "कक्षावार विद्यार्थी संख्या भरें", "text": "कक्षा 1 से 12 तक के छात्र एवं छात्राओं की संख्या दर्ज करें।" },
          { "@type": "HowToStep", "name": "स्वतः शुल्क गणना व प्रिंट", "text": "प्रारूप क व ख के अनुसार क्रीड़ा शुल्क की स्वतः गणना देखें और पीडीएफ प्रिंट या डाउनलोड करें।" }
        ]
      });
    } else if (activeRoute === 'teacher-pti/healthbmi' || activeRoute === 'student-health-bmi') {
      title = "छात्र स्वास्थ्य विवरण एवं BMI सूचकांक कैलकुलेटर | Shala Sahayak";
      description = "राजकीय विद्यालयों के विद्यार्थियों हेतु शारीरिक स्वास्थ्य जांच इंडेक्स, बीएमआई (BMI) कैलकुलेटर एवं स्वास्थ्य प्रगति पत्रक ऑटो-कैलकुलेशन टूल।";
    } else if (activeRoute === 'teacher-pti/sportsstock' || activeRoute === 'sports-goods-stock') {
      title = "खेलकूद सामग्री स्टॉक एवं पीटीआई उपकरण रजिस्टर | Shala Sahayak";
      description = "विद्यालय खेलकूद सामग्री प्रविष्टि, क्रीड़ा उपकरण आवंटन, स्टॉक वेरिफिकेशन एवं पीटीआई शिक्षक डिजिटल रिकॉर्ड टूल।";
    } else if (activeRoute === 'teacher-pti/ptgrading' || activeRoute === 'pt-grading') {
      title = "शारीरिक एवं स्वास्थ्य शिक्षा PT ग्रेडिंग कैलकुलेटर | Shala Sahayak";
      description = "कक्षावार शारीरिक शिक्षा ग्रेडिंग, स्वास्थ्य शिक्षा मूल्यांकन, वार्षिक परीक्षा पीटी ग्रेड विवरण एवं ऑटो ग्रेड शीट मेकर।";
    } else if (activeRoute === 'teacher-marksheet/greensheet' || activeRoute === 'greensheet-maker') {
      title = "वार्षिक परीक्षा ग्रीन शीट व अंकतालिका जनरेटर | Shala Sahayak";
      description = "राजस्थान शाला दर्पण व बोर्ड पैटर्न आधारित कक्षावार वार्षिक/अर्द्धवार्षिक परीक्षा ग्रीन शीट एवं छात्र प्रगति रिपोर्ट कार्ड जनरेटर।";
    } else if (activeRoute === 'teacher-anomaly/verification' || activeRoute === 'student-verification') {
      title = "छात्र आधार व जन-आधार प्रमाणीकरण विसंगति ट्रैकर | Shala Sahayak";
      description = "छात्र नाम, जन्म तिथि व लिंग त्रुटि सुधार हेतु आधार, जन-आधार एवं अपार (APAAR ID) प्रमाणीकरण प्रगति रिपोर्ट इंजन।";
    } else if (activeRoute === 'teacher-diary/lessonplanner' || activeRoute === 'teacher-diary') {
      title = "दैनिक शिक्षक डायरी व लेसन प्लानर (Teacher's Diary) | Shala Sahayak";
      description = "दैनिक शैक्षणिक कार्य विवरण, पाठ्य योजना (Lesson Plan), गृहकार्य टिप्पणी, बाल सभा एवं सीसीईए गतिविधियों हेतु डिजिटल शिक्षक दैनन्दिनी।";
    } else if (activeRoute === 'teacher-library/catalogue' || activeRoute === 'library-catalogue') {
      title = "पुस्तकालय कैटलॉग व पुस्तक इश्यू-रिटर्न रजिस्टर | Shala Sahayak";
      description = "विद्यालय पुस्तकालय परिग्रहण पंजी (Accession Register), पुस्तक खोज, एवं छात्र/शिक्षक पुस्तक आवंटन डिजिटल रजिस्टर।";
    } else if (activeRoute === 'teacher-computer/equipmentstock' || activeRoute === 'ict-lab-stock') {
      title = "ICT लैब व कंप्यूटर उपकरण स्टॉक सत्यापन रिपोर्ट | Shala Sahayak";
      description = "आईसीटी लैब कंप्यूटर, प्रिंटर, यूपीएस, स्मार्ट टीवी व प्रोजेक्टर भौतिक स्टॉक सत्यापन एवं क्रियाशीलता ट्रैकर।";
    } else if (activeRoute === 'portals-calculator/salary' || activeRoute === 'salary-calculator') {
      title = "7वें वेतनमान अनुसार ग्रॉस सैलरी व नेट कटौती कैलकुलेटर | Shala Sahayak";
      description = "बेसिक पे, वर्तमान डीए (DA), एचआरए (HRA), एनपीएस, जीपीएफ-2004 व आरजीएचएस कटौती अनुसार वेतन गणना।";
    } else if (activeRoute === 'portals-formats/download' || activeRoute === 'formats') {
      title = "राजस्थान शिक्षा विभाग आधिकारिक विभागीय प्रपत्र डाउनलोड | Shala Sahayak";
      description = "विभागीय आवेदन प्रपत्र, आकस्मिक व उपार्जित अवकाश आवेदन, एसीपी प्रपत्र, संस्थापन प्रपत्र एवं चेकलिस्ट पीडीएफ डाउनलोड।";
    } else if (activeRoute === 'invitation/independence' || activeRoute === 'independence-day-invitation') {
      title = "स्वतंत्रता दिवस (15 अगस्त) विद्यालय आमंत्रण पत्र मेकर | Shala Sahayak";
      description = "15 अगस्त स्वतंत्रता दिवस समारोह हेतु तिरंगा थीम युक्त सुंदर डिजिटल निमंत्रण पत्र तैयार करें एवं पीडीएफ डाउनलोड करें।";
    } else if (activeRoute === 'useful-tools/8thpay' || (activeRoute.startsWith('useful-tools') && activeRoute.includes('8thpay')) || activeRoute === '8thpay') {
      title = "8वां वेतन आयोग कैलकुलेटर एवं फ़िटमेंट फ़ैक्टर (8th Pay Commission Calculator) | Shala Sahayak";
      description = "8वां वेतन आयोग (8th CPC) वेतन वृद्धि व फ़िटमेंट फ़ैक्टर (1.92x से 3.00x) कैलकुलेटर। राजस्थान कर्मचारियों हेतु 7वें व 8वें वेतन की तुलना, बेसिक पे, डीए व शुद्ध वेतन अनुमान।";
      schemaData["@graph"].push({
        "@type": "WebApplication",
        "name": "8th Pay Commission Calculator Rajasthan",
        "applicationCategory": "FinanceApplication",
        "operatingSystem": "All",
        "description": description,
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      });
      schemaData["@graph"].push({
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "होम (Home)", "item": "https://shalasahayak.in/" },
          { "@type": "ListItem", "position": 2, "name": "उपयोगी टूल्स (Useful Tools)", "item": "https://shalasahayak.in/useful-tools" },
          { "@type": "ListItem", "position": 3, "name": "8वां वेतन आयोग कैलकुलेटर", "item": "https://shalasahayak.in/useful-tools/8thpay" }
        ]
      });
      schemaData["@graph"].push({
        "@type": "HowTo",
        "name": "8वें वेतन आयोग में संभावित वेतन व फ़िटमेंट फ़ैक्टर की गणना कैसे करें",
        "description": description,
        "step": [
          { "@type": "HowToStep", "name": "वर्तमान 7वां पे-लेवल व बेसिक पे चुनें", "text": "7th CPC पे-मैट्रिक्स (L-1 से L-16) में अपना वर्तमान मूल वेतन (Basic Pay) दर्ज करें।" },
          { "@type": "HowToStep", "name": "फ़िटमेंट फ़ैक्टर चुनें", "text": "प्रस्तावित फ़िटमेंट फ़ैक्टर (1.92x, 2.08x, 2.57x या 3.00x) का चयन करें।" },
          { "@type": "HowToStep", "name": "तुलनात्मक विश्लेषण देखें", "text": "नए 8वें पे-लेवल का अनुमानित बेसिक पे, डीए, कुल सकल वेतन एवं वेतन अंतर की तालिका देखें।" }
        ]
      });
      schemaData["@graph"].push({
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "8वें वेतन आयोग में संभावित फ़िटमेंट फ़ैक्टर क्या हो सकता है?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "कर्मचारी संगठनों द्वारा 2.57x से 3.00x फ़िटमेंट फ़ैक्टर की मांग की जा रही है, जिससे न्यूनतम मूल वेतन में 100% से अधिक की वृद्धि संभावित है।"
            }
          },
          {
            "@type": "Question",
            "name": "क्या यह कैलकुलेटर राजस्थान शिक्षकों के लिए प्रासंगिक है?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "हाँ, यह टूल राजस्थान शिक्षा विभाग के प्रबोधक, अध्यापक L-10, वरिष्ठ अध्यापक L-11 एवं प्राध्यापक L-12 के पे-लेवल अनुसार सटीक तुलना प्रस्तुत करता है।"
            }
          }
        ]
      });
    } else if (activeRoute === 'useful-tools/salary' || (activeRoute.startsWith('useful-tools') && activeRoute.includes('salary')) || activeRoute === 'salary-calc') {
      title = "राजस्थान 7वां वेतन कैलकुलेटर (PayManager Salary Calculator L-1 to L-16) | Shala Sahayak";
      description = "राजस्थान सरकारी शिक्षक एवं कर्मचारी वेतन कैलकुलेटर। 7th Pay Matrix (L1 से L16), वर्तमान 60% DA, HRA (10%/20%), SI प्रीमियम, GPF-2004 व RGHS कटौती गणना।";
      schemaData["@graph"].push({
        "@type": "WebApplication",
        "name": "Rajasthan PayManager Salary Calculator",
        "applicationCategory": "FinanceApplication",
        "operatingSystem": "All",
        "description": description,
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      });
      schemaData["@graph"].push({
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "होम (Home)", "item": "https://shalasahayak.in/" },
          { "@type": "ListItem", "position": 2, "name": "उपयोगी टूल्स (Useful Tools)", "item": "https://shalasahayak.in/useful-tools" },
          { "@type": "ListItem", "position": 3, "name": "राजस्थान वेतन कैलकुलेटर (RSR)", "item": "https://shalasahayak.in/useful-tools/salary" }
        ]
      });
      schemaData["@graph"].push({
        "@type": "HowTo",
        "name": "राजस्थान सिविल सेवा नियम अनुसार वेतन एवं शुद्ध भुगतान की गणना कैसे करें",
        "description": description,
        "step": [
          { "@type": "HowToStep", "name": "पे-लेवल L-1 से L-16 चुनें", "text": "अपना पद व पे-लेवल (उदा. अध्यापक L-10, वरिष्ठ अध्यापक L-11) चुनें।" },
          { "@type": "HowToStep", "name": "मूल वेतन एवं शहर श्रेणी चुनें", "text": "बेसिक पे और Y-श्रेणी (जयपुर/जोधपुर 20% HRA) या Z-श्रेणी (ग्रामीण/अन्य 10% HRA) चुनें।" },
          { "@type": "HowToStep", "name": "कटौतियाँ व नेट इन-हैंड सैलरी देखें", "text": "वर्तमान 60% DA, SI स्लैब, GPF-2004 एवं RGHS कटौतियों के बाद शुद्ध खाते में जमा राशि प्राप्त करें।" }
        ]
      });
      schemaData["@graph"].push({
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "वर्तमान में राजस्थान में डीए (Dearness Allowance) की दर क्या है?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "राजस्थान राज्य कर्मचारियों हेतु 7वें वेतनमान में वर्तमान डीए दर 60% प्रभावी है।"
            }
          },
          {
            "@type": "Question",
            "name": "HRA की गणना किस आधार पर होती है?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "राजस्थान में Y श्रेणी शहरों (जैसे जयपुर, जोधपुर, कोटा, अजमेर, बीकानेर) में 20% तथा अन्य समस्त स्थानों (Z श्रेणी) पर 10% HRA देय है।"
            }
          }
        ]
      });
    } else if (activeRoute === 'useful-tools/bonus' || (activeRoute.startsWith('useful-tools') && activeRoute.includes('bonus')) || activeRoute === 'bonus' || activeRoute === 'diwali-bonus') {
      title = "दीपावली तदर्थ बोनस कैलकुलेटर 2026-27 (Diwali Bonus Calculator Rajasthan) | Shala Sahayak";
      description = "राजस्थान राज्य कर्मचारियों हेतु दीपावली बोनस (Ad-hoc Bonus) कैलकुलेटर। पे-लेवल L-1 से L-11, अधिकतम ₹6,774, 75% नकद वेतन खाते में व 25% GPF/GPF-2004 जमा विभाजन।";
      schemaData["@graph"].push({
        "@type": "WebApplication",
        "name": "Rajasthan Diwali Ad-hoc Bonus Calculator",
        "applicationCategory": "FinanceApplication",
        "operatingSystem": "All",
        "description": description,
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      });
      schemaData["@graph"].push({
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "होम (Home)", "item": "https://shalasahayak.in/" },
          { "@type": "ListItem", "position": 2, "name": "उपयोगी टूल्स (Useful Tools)", "item": "https://shalasahayak.in/useful-tools" },
          { "@type": "ListItem", "position": 3, "name": "दीपावली बोनस कैलकुलेटर", "item": "https://shalasahayak.in/useful-tools/bonus" }
        ]
      });
      schemaData["@graph"].push({
        "@type": "HowTo",
        "name": "राजस्थान राज्य कर्मचारियों हेतु दीपावली तदर्थ बोनस की गणना कैसे करें",
        "description": description,
        "step": [
          { "@type": "HowToStep", "name": "पे-लेवल पात्रता जांचें", "text": "पे-लेवल L-1 से L-11 (ग्रेड पे ₹4800 तक) के समस्त नियमित राज्य कर्मचारी बोनस के पात्र हैं।" },
          { "@type": "HowToStep", "name": "कार्यकाल दर्ज करें", "text": "पूर्ण वर्ष (12 माह) या आनुपातिक (कम से कम 6 माह) सेवा अवधि दर्ज करें।" },
          { "@type": "HowToStep", "name": "75% नकद व 25% GPF विभाजन देखें", "text": "₹6,774 में से ₹5,081 नकद वेतन खाते में तथा ₹1,693 GPF/GPF-2004 खाते में जमा का विवरण प्राप्त करें।" }
        ]
      });
      schemaData["@graph"].push({
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "दीपावली बोनस की अधिकतम सीमा क्या है?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "राजस्थान वित्त विभाग के अनुसार अधिकतम ₹7,000 की गणना सीमा पर 30/31 दिवस का ₹6,774 तदर्थ बोनस देय है।"
            }
          },
          {
            "@type": "Question",
            "name": "क्या प्रोबेशनर ट्रेनी बोनस के पात्र हैं?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "नियत पारिश्रमिक (Fixed Remuneration) पर कार्यरत प्रोबेशनर ट्रेनी बोनस के पात्र नहीं होते हैं; स्थायीकरण पश्चात ही पात्रता बनती है।"
            }
          }
        ]
      });
    } else if (activeRoute === 'useful-tools/excel' || (activeRoute.startsWith('useful-tools') && activeRoute.includes('excel')) || activeRoute === 'excel-sheet') {
      title = "एक्सेल शीट कृतिदेव से यूनिकोड कनवर्टर (.xlsx / .csv) | Shala Sahayak";
      description = "एक्सेल शीट कृतिदेव/देवलास/चाणक्य फॉन्ट से शुद्ध हिंदी मंगल/यूनिकोड में ऑटो-कन्वर्ट करें। .xlsx या .csv फाइल अपलोड करें, संपूर्ण वर्कशीट तुरंत बदलें व डाउनलोड करें।";
      schemaData["@graph"].push({
        "@type": "WebApplication",
        "name": "Excel Sheet KrutiDev to Unicode Converter",
        "applicationCategory": "UtilitiesApplication",
        "operatingSystem": "All",
        "description": description,
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
      });
      schemaData["@graph"].push({
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "होम (Home)", "item": "https://shalasahayak.in/" },
          { "@type": "ListItem", "position": 2, "name": "उपयोगी टूल्स (Useful Tools)", "item": "https://shalasahayak.in/useful-tools" },
          { "@type": "ListItem", "position": 3, "name": "एक्सेल कृतिदेव कन्वर्टर", "item": "https://shalasahayak.in/useful-tools/excel" }
        ]
      });
      schemaData["@graph"].push({
        "@type": "HowTo",
        "name": "एक्सेल फाइल (.xlsx) को कृतिदेव से शुद्ध हिंदी यूनिकोड में कैसे बदलें",
        "description": description,
        "step": [
          { "@type": "HowToStep", "name": "एक्सेल फाइल अपलोड करें", "text": "कृतिदेव 010 या देवलास फॉन्ट वाली .xlsx या .csv फाइल चुनें।" },
          { "@type": "HowToStep", "name": "कन्वर्ट बटन दबाएं", "text": "सभी कॉलम और सेल की मात्राओं, संयुक्त अक्षरों व रेफ की शुद्ध यूनिकोड में ऑटो-प्रोसेसिंग होगी।" },
          { "@type": "HowToStep", "name": "संपादित करें या डाउनलोड करें", "text": "कन्वर्टेड डेटा को सीधे ग्रिड में चेक करें और नई यूनिकोड एक्सेल फाइल डाउनलोड करें।" }
        ]
      });
    } else if (activeRoute === 'useful-tools/rules' || (activeRoute.startsWith('useful-tools') && activeRoute.includes('rules')) || activeRoute === 'rules-guide') {
      title = "राजस्थान सेवा नियम, वेतन आदेश व उपयोगी टूल्स गाइड | Shala Sahayak";
      description = "राजस्थान सिविल सेवा नियम (RSR), 7वां व 8वां वेतन आयोग, डीए बढ़ोतरी आदेश, दीपावली बोनस नियम, पे-मैट्रिक्स एवं विभागीय प्रपत्रों की प्रमाणित गाइड।";
      schemaData["@graph"].push({
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "होम (Home)", "item": "https://shalasahayak.in/" },
          { "@type": "ListItem", "position": 2, "name": "उपयोगी टूल्स (Useful Tools)", "item": "https://shalasahayak.in/useful-tools" },
          { "@type": "ListItem", "position": 3, "name": "राजस्थान सेवा नियम व गाइड", "item": "https://shalasahayak.in/useful-tools/rules" }
        ]
      });
    } else if (activeRoute === 'useful-tools' || activeRoute === 'useful') {
      title = "उपयोगी टूल्स एवं कैलकुलेटर्स | राजस्थान शिक्षक टूलकिट | Shala Sahayak";
      description = "राजस्थान शिक्षकों व कर्मचारियों हेतु उपयोगी डिजिटल टूल्स: 8वां वेतन कैलकुलेटर, राजस्थान वेतन (RSR), दीपावली बोनस, एक्सेल कृतिदेव कन्वर्टर व सेवा नियम।";
      schemaData["@graph"].push({
        "@type": "CollectionPage",
        "name": "Useful Tools & Calculators for Rajasthan Teachers",
        "description": description,
        "url": "https://shalasahayak.in/useful-tools",
        "hasPart": [
          { "@type": "WebApplication", "name": "8th Pay Commission Calculator", "url": "https://shalasahayak.in/useful-tools/8thpay" },
          { "@type": "WebApplication", "name": "Rajasthan Salary Calculator", "url": "https://shalasahayak.in/useful-tools/salary" },
          { "@type": "WebApplication", "name": "Diwali Bonus Calculator", "url": "https://shalasahayak.in/useful-tools/bonus" },
          { "@type": "WebApplication", "name": "Excel KrutiDev to Unicode Converter", "url": "https://shalasahayak.in/useful-tools/excel" },
          { "@type": "WebPage", "name": "Rajasthan Service Rules & Guide", "url": "https://shalasahayak.in/useful-tools/rules" }
        ]
      });
      schemaData["@graph"].push({
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "होम (Home)", "item": "https://shalasahayak.in/" },
          { "@type": "ListItem", "position": 2, "name": "उपयोगी टूल्स (Useful Tools)", "item": "https://shalasahayak.in/useful-tools" }
        ]
      });
    } else if (activeRoute === 'shivira') {
      title = "शिविरा पंचांग 2026-27 (Shivira Panchang) | शाला सहायक राजस्थान";
      description = "राजस्थान विद्यालय शिक्षा विभाग राजकीय अकादमिक पंचांग 2026-27। मासिक शैक्षणिक गतिविधियाँ, अवकाश तालिका, परीक्षा तिथियाँ व तिथिवार नियम विवरण।";
    } else if (activeRoute === 'blogs' || activeRoute === 'help' || activeRoute.startsWith('help')) {
      title = "सहायता एवं मार्गदर्शिका केंद्र (Help & Guides) | शाला सहायक";
      description = "राजस्थान शिक्षकों व प्रभारियों हेतु प्रत्येक डिजिटल टूल (वेतन, बोनस, क्रीड़ा शुल्क, एमडीएम, परीक्षा बैठक) की विस्तृत, प्रामाणिक एवं चरणबद्ध मार्गदर्शिका।";
    } else if (activeRoute === 'contact-us' || activeRoute === 'contact') {
      title = "संपर्क करें | शाला सहायक";
      description = "शाला सहायक टीम से संपर्क करें। किसी भी सुझाव, त्रुटि रिपोर्ट या शिकायत के लिए हमसे सीधे संपर्क फॉर्म या ईमेल के माध्यम से जुड़ें।";
    } else if (activeRoute === 'about-us' || activeRoute === 'about') {
      title = "हमारे बारे में (About Us) | शाला सहायक";
      description = "राजस्थान राजकीय विद्यालयों के शिक्षकों एवं संस्थाप्रधानों हेतु निर्मित शाला सहायक डिजिटल टूलकिट की जानकारी।";
    } else if (activeRoute === 'privacy-policy' || activeRoute === 'privacy') {
      title = "प्राइवेसी पॉलिसी | शाला सहायक";
      description = "शाला सहायक (Shala Sahayak) वेब एप्लीकेशन की गोपनीयता नीति (Privacy Policy)। हम उपयोगकर्ता डेटा सुरक्षा और गोपनीयता के प्रति प्रतिबद्ध हैं।";
    } else if (currentView === 'shivira') {
      title = "शिविरा पंचांग 2026-27 | शाला सहायक राजस्थान";
      description = "राजस्थान विद्यालय शिक्षा विभाग राजकीय अकादमिक पंचांग 2026-27। मासिक शैक्षणिक गतिविधियाँ, अवकाश तालिका, परीक्षा तिथियाँ।";
    } else if (category === 'peeo') {
      title = "पीईईओ टूल्स व आदेश जनरेटर | शाला सहायक";
      description = "PEEO आधिकारिक ड्यूटी आदेश जनरेटर, 7th Pay Matrix & ACP स्थिरीकरण, पदोन्नति पात्रता एवं विद्यालय मैपिंग टूल्स।";
    } else if (category === 'teacher') {
      title = "शिक्षक एवं कक्षा-अध्यापक डिजिटल टूलकिट | शाला सहायक";
      description = "बाल गोपाल योजना दूध व MDM खाद्यान्न कैलकुलेटर, दैनिक शिक्षक डायरी, अंकतालिका व ग्रेड कैलकुलेटर टूल।";
    } else if (category === 'incharge') {
      title = "प्रभारी पोर्टल (परीक्षा, एमडीएम, ईएलसी) | शाला सहायक";
      description = "परीक्षा एवं विद्यालय प्रभारी डिजिटल टूलकिट। बोर्ड परीक्षा सीटिंग प्लान जनरेटर, वीक्षक ड्यूटी रोस्टर, आईसीटी लैब स्टॉक रजिस्टर व पुस्तकालय प्रबंधन।";
    }

    // Update Document Title
    document.title = title;

    // Helper to set/update meta tag
    const setMetaTag = (selector: string, attrName: string, attrVal: string, content: string) => {
      let element = document.querySelector(selector) as HTMLMetaElement;
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attrName, attrVal);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    setMetaTag('meta[name="description"]', 'name', 'description', description);
    setMetaTag('meta[name="title"]', 'name', 'title', title);
    setMetaTag('meta[name="keywords"]', 'name', 'keywords', 'Shala Sahayak, Shala Shayak, shayak Shala, शाला सहायक, शाला सायक, Shala Darpan, Rajasthan Teacher Tools, PEEO Portal, MDM Register, Board Exam Seating, Paymatrix Rajasthan, Shivira Panchang, Education Rajasthan, shalasahayak.in, krida khelkhud maker, PTI Rajasthan, krida shulk maker, sports stock register Rajasthan, PT grading school, sports fee calculator');

    setMetaTag('meta[property="og:title"]', 'property', 'og:title', title);
    setMetaTag('meta[property="og:description"]', 'property', 'og:description', description);
    setMetaTag('meta[property="og:url"]', 'property', 'og:url', pageUrl);
    setMetaTag('meta[property="og:type"]', 'property', 'og:type', 'website');

    setMetaTag('meta[property="twitter:card"]', 'property', 'twitter:card', 'summary_large_image');
    setMetaTag('meta[property="twitter:title"]', 'property', 'twitter:title', title);
    setMetaTag('meta[property="twitter:description"]', 'property', 'twitter:description', description);
    setMetaTag('meta[property="twitter:url"]', 'property', 'twitter:url', pageUrl);

    const canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (canonical) {
      canonical.setAttribute('href', pageUrl);
    }

    let schemaScript = document.getElementById('dynamic-json-ld') as HTMLScriptElement;
    if (!schemaScript) {
      schemaScript = document.createElement('script');
      schemaScript.id = 'dynamic-json-ld';
      schemaScript.type = 'application/ld+json';
      document.head.appendChild(schemaScript);
    }
    schemaScript.textContent = JSON.stringify(schemaData);

  }, [locationPath, currentView, category, activeToolId]);

  return null;
};
