import React, { useEffect } from 'react';

interface SeoManagerProps {
  currentView?: string;
  category?: string;
  activeToolId?: string;
}

export const SeoManager: React.FC<SeoManagerProps> = ({
  currentView,
  category,
  activeToolId
}) => {
  useEffect(() => {
    let title = "Shala Sahayak (शाला सहायक) - शाला दर्पण, PEEO, MDM एवं शिक्षक डिजिटल टूलकिट";
    let description = "शाला सहायक (Shala Sahayak) राजस्थान के शिक्षकों, PEEO, परीक्षा प्रभारियों व MDM प्रभारियों हेतु डिजिटल सहायक टूलकिट। शाला दर्पण गणना, बाल गोपाल दुग्ध, परीक्षा सीटिंग प्लान व आदेश जनरेटर।";
    const currentHash = window.location.hash.replace('#', '');
    let pageUrl = `https://shalasahayak.in/${window.location.hash || ''}`;

    let schemaData: any = {
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
        }
      ]
    };

    // Precise Google SEO Indexing and Ranking for each distinct tool / hash
    if (currentHash === 'krida-shulk' || currentHash === 'krida-shulk-maker') {
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
    } else if (currentHash === 'student-health-bmi' || currentHash === 'health-bmi') {
      title = "छात्र स्वास्थ्य विवरण एवं BMI सूचकांक कैलकुलेटर | Shala Sahayak";
      description = "राजकीय विद्यालयों के विद्यार्थियों हेतु शारीरिक स्वास्थ्य जांच इंडेक्स, बीएमआई (BMI) कैलकुलेटर एवं स्वास्थ्य प्रगति पत्रक ऑटो-कैलकुलेशन टूल।";
    } else if (currentHash === 'sports-goods-stock' || currentHash === 'sports-stock') {
      title = "खेलकूद सामग्री स्टॉक एवं पीटीआई उपकरण रजिस्टर | Shala Sahayak";
      description = "विद्यालय खेलकूद सामग्री प्रविष्टि, क्रीड़ा उपकरण आवंटन, स्टॉक वेरिफिकेशन एवं पीटीआई शिक्षक डिजिटल रिकॉर्ड टूल।";
    } else if (currentHash === 'pt-grading' || currentHash === 'sports-grading') {
      title = "शारीरिक एवं स्वास्थ्य शिक्षा PT ग्रेडिंग कैलकुलेटर | Shala Sahayak";
      description = "कक्षावार शारीरिक शिक्षा ग्रेडिंग, स्वास्थ्य शिक्षा मूल्यांकन, वार्षिक परीक्षा पीटी ग्रेड विवरण एवं ऑटो ग्रेड शीट मेकर।";
    } else if (currentHash === 'greensheet-maker' || currentHash === 'marksheet-maker') {
      title = "वार्षिक परीक्षा ग्रीन शीट व अंकतालिका जनरेटर | Shala Sahayak";
      description = "राजस्थान शाला दर्पण व बोर्ड पैटर्न आधारित कक्षावार वार्षिक/अर्द्धवार्षिक परीक्षा ग्रीन शीट एवं छात्र प्रगति रिपोर्ट कार्ड जनरेटर।";
    } else if (currentHash === 'student-verification' || currentHash === 'verification-anomaly') {
      title = "छात्र आधार व जन-आधार प्रमाणीकरण विसंगति ट्रैकर | Shala Sahayak";
      description = "छात्र नाम, जन्म तिथि व लिंग त्रुटि सुधार हेतु आधार, जन-आधार एवं अपार (APAAR ID) प्रमाणीकरण प्रगति रिपोर्ट इंजन।";
    } else if (currentHash === 'teacher-diary' || currentHash === 'lesson-planner') {
      title = "दैनिक शिक्षक डायरी व लेसन प्लानर (Teacher's Diary) | Shala Sahayak";
      description = "दैनिक शैक्षणिक कार्य विवरण, पाठ्य योजना (Lesson Plan), गृहकार्य टिप्पणी, बाल सभा एवं सीसीईए गतिविधियों हेतु डिजिटल शिक्षक दैनन्दिनी।";
    } else if (currentHash === 'library-catalogue' || currentHash === 'library-books') {
      title = "पुस्तकालय कैटलॉग व पुस्तक इश्यू-रिटर्न रजिस्टर | Shala Sahayak";
      description = "विद्यालय पुस्तकालय परिग्रहण पंजी (Accession Register), पुस्तक खोज, एवं छात्र/शिक्षक पुस्तक आवंटन डिजिटल रजिस्टर।";
    } else if (currentHash === 'ict-lab-stock' || currentHash === 'computer-lab-stock') {
      title = "ICT लैब व कंप्यूटर उपकरण स्टॉक सत्यापन रिपोर्ट | Shala Sahayak";
      description = "आईसीटी लैब कंप्यूटर, प्रिंटर, यूपीएस, स्मार्ट टीवी व प्रोजेक्टर भौतिक स्टॉक सत्यापन एवं क्रियाशीलता ट्रैकर।";
    } else if (currentHash === 'mid-day-meal' || currentHash === 'mdm-calculator') {
      title = "मिड-डे मील (MDM) व बाल गोपाल दूध योजना कैलकुलेटर | Shala Sahayak";
      description = "दैनिक मिड-डे मील खाद्यान्न खपत, कुकिंग कॉस्ट, बाल गोपाल दूध पाउडर व चीनी की मात्रा ऑटो-कैलकुलेटर एवं मासिक पंजी।";
    } else if (currentHash === 'transport-voucher' || currentHash === 'transport-calculator') {
      title = "ट्रांसपोर्ट वाउचर योग्य छात्र DBT सूची जनरेटर | Shala Sahayak";
      description = "दूरी श्रेणी अनुसार पात्र छात्र-छात्राओं की ट्रांसपोर्ट वाउचर ट्रैकिंग, दैनिक उपस्थिति भत्ता गणना व डीबीटी प्रपत्र।";
    } else if (currentHash === 'scholarship-calculator' || currentHash === 'scholarship-selector') {
      title = "पूर्व व उत्तर मैट्रिक छात्रवृत्ति पात्रता जांच ट्रैकर | Shala Sahayak";
      description = "श्रेणीवार एवं आय सीमा अनुसार छात्रवृत्ति पात्रता स्वतः चयन, आवेदन सत्यापन चेकलिस्ट एवं छात्रवृत्ति स्टेटस ट्रैकर।";
    } else if (currentHash === 'exam-roster' || currentHash === 'exam-duty-roster') {
      title = "परीक्षा सीटिंग अरेंजमेंट व वीक्षक ड्यूटी रोस्टर मेकर | Shala Sahayak";
      description = "वार्षिक व बोर्ड परीक्षा हेतु कक्षवार छात्र बैठक व्यवस्था, डोर स्लिप, सिटिंग चार्ट एवं वीक्षक ड्यूटी ऑटो-रोस्टर जनरेटर।";
    } else if (currentHash === 'peeo-timetable' || currentHash === 'school-timetable') {
      title = "PEEO विद्यालय समय-सारणी जनरेटर (Time Table Maker) | Shala Sahayak";
      description = "कक्षावार व शिक्षकवार ऑटोमैटिक 8-कालांश समय-सारणी निर्माण टूल। रिक्त कालांश व्यवस्था व विषय आवंटन चार्ट।";
    } else if (currentHash === 'staff-increment' || currentHash === 'salary-increment-calculator') {
      title = "वार्षिक वेतन वृद्धि व 3% वेतन निर्धारण आदेश जनरेटर | Shala Sahayak";
      description = "7वें वेतन आयोग अनुसार 1 जुलाई हेतु 3% वार्षिक वेतन वृद्धि गणना, पे-मैट्रिक्स निर्धारण एवं कार्यालय आदेश पीडीएफ जनरेटर।";
    } else if (currentHash === 'teacher-substitution' || currentHash === 'substitution-tracker') {
      title = "दैनिक शिक्षक स्थानापन्न (Substitution arrangement) | Shala Sahayak";
      description = "अनुपस्थित अध्यापकों के खाली कालांशों की सुव्यवस्थित व्यवस्था हेतु दैनिक शिक्षक स्थानापन्न चार्ट व प्रविष्टि पंजी।";
    } else if (currentHash === 'apar-appraisal' || currentHash === 'apar-evaluator') {
      title = "APAR व IPR राजकाज फाइलिंग स्थिति मॉनिटर | Shala Sahayak";
      description = "राजकाज (RajKaj) पोर्टल पर वार्षिक कार्य मूल्यांकन प्रतिवेदन (APAR) एवं अचल संपत्ति विवरण (IPR) प्रविष्टि स्थिति ट्रैकर।";
    } else if (currentHash === 'salary-calculator' || currentHash === 'calculator') {
      title = "7वें वेतनमान अनुसार ग्रॉस सैलरी व नेट कटौती कैलकुलेटर | Shala Sahayak";
      description = "बेसिक पे, वर्तमान डीए (DA), एचआरए (HRA), एनपीएस, जीपीएफ-2004 व आरजीएचएस कटौती अनुसार वेतन गणना।";
    } else if (currentHash === 'interactive-formats' || currentHash === 'formats') {
      title = "राजस्थान शिक्षा विभाग आधिकारिक विभागीय प्रपत्र डाउनलोड | Shala Sahayak";
      description = "विभागीय आवेदन प्रपत्र, आकस्मिक व उपार्जित अवकाश आवेदन, एसीपी प्रपत्र, संस्थापन प्रपत्र एवं चेकलिस्ट पीडीएफ डाउनलोड।";
    } else if (currentHash === 'independence-day-invitation' || currentHash === 'independence-day-invitation-maker') {
      title = "स्वतंत्रता दिवस (15 अगस्त) विद्यालय आमंत्रण पत्र मेकर | Shala Sahayak";
      description = "15 अगस्त स्वतंत्रता दिवस समारोह हेतु तिरंगा थीम युक्त सुंदर डिजिटल निमंत्रण पत्र तैयार करें एवं पीडीएफ डाउनलोड करें।";
    } else if (currentView === 'shivira') {
      title = "शिविरा पंचांग 2026-27 (Shivira Panchang) | शाला सहायक राजस्थान";
      description = "राजस्थान विद्यालय शिक्षा विभाग राजकीय अकादमिक पंचांग 2026-27। मासिक शैक्षणिक गतिविधियाँ, अवकाश तालिका, परीक्षा तिथियाँ व तिथिवार नियम विवरण।";
    } else if (currentView === 'blogs' || currentView === 'help') {
      title = "ब्लॉग, उपयोगी ट्यूटोरियल व मास्टर पिलर रिसोर्स हब | शाला सहायक";
      description = "शाला दर्पण प्रविष्टियाँ, क्रीड़ा शुल्क प्रपत्र, पीटी ग्रेडिंग, वेतन वृद्धि आदेश, एमडीएम गणना, 7th Pay Matrix व परीक्षा प्रभारियों हेतु विस्तृत गाइड व उपयोगी वीडियो ट्यूटोरियल।";
    } else if (currentView === 'invitation') {
      title = "विभागीय विद्यालय आमंत्रण पत्र मेकर (School Invitations) | Shala Sahayak";
      description = "वार्षिकोत्सव, 15 अगस्त, 26 जनवरी, बाल सभा व प्रवेशोत्सव हेतु सुंदर राजस्थानी थीम युक्त आधिकारिक विद्यालय आमंत्रण पत्र जनरेटर।";
    } else if (category === 'peeo') {
      title = "PEEO प्रशासनिक टूलकिट & डिजिटल आदेश जनरेटर | शाला सहायक";
      description = "PEEO आधिकारिक ड्यूटी आदेश जनरेटर, 7th Pay Matrix & ACP स्थिरीकरण, पदोन्नति पात्रता एवं विद्यालय मैपिंग टूल्स।";
    } else if (category === 'teacher') {
      title = "शिक्षक एवं कक्षा-अध्यापक डिजिटल टूलकिट | शाला सहायक";
      description = "बाल गोपाल योजना दूध व MDM खाद्यान्न कैलकुलेटर, दैनिक शिक्षक डायरी, अंकतालिका व ग्रेड कैलकुलेटर टूल।";
    } else if (category === 'incharge') {
      title = "परीक्षा एवं विद्यालय प्रभारी डिजिटल टूलकिट | शाला सहायक";
      description = "बोर्ड परीक्षा सीटिंग प्लान जनरेटर, वीक्षक ड्यूटी रोस्टर, आईसीटी लैब स्टॉक रजिस्टर व पुस्तकालय प्रबंधन।";
    }

    // 1. Update Document Title
    document.title = title;

    // 2. Helper function to set or create meta tag
    const setMetaTag = (selector: string, attrName: string, attrVal: string, content: string) => {
      let element = document.querySelector(selector) as HTMLMetaElement;
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attrName, attrVal);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Update Meta Description & Keywords
    setMetaTag('meta[name="description"]', 'name', 'description', description);
    setMetaTag('meta[name="title"]', 'name', 'title', title);
    setMetaTag('meta[name="keywords"]', 'name', 'keywords', 'Shala Sahayak, Shala Shayak, shayak Shala, शाला सहायक, शाला सायक, सहायक शाला, Shala Darpan, Rajasthan Teacher Tools, PEEO Portal, MDM Register, Board Exam Seating, Paymatrix Rajasthan, Shivira Panchang, Education Rajasthan, shalasahayak.in, krida khelkhud maker, PTI Rajasthan, krida shulk maker, sports stock register Rajasthan, PT grading school, sports fee calculator');

    // Update Open Graph Meta Tags
    setMetaTag('meta[property="og:title"]', 'property', 'og:title', title);
    setMetaTag('meta[property="og:description"]', 'property', 'og:description', description);
    setMetaTag('meta[property="og:url"]', 'property', 'og:url', pageUrl);
    setMetaTag('meta[property="og:type"]', 'property', 'og:type', 'website');

    // Update Twitter Meta Tags
    setMetaTag('meta[property="twitter:card"]', 'property', 'twitter:card', 'summary_large_image');
    setMetaTag('meta[property="twitter:title"]', 'property', 'twitter:title', title);
    setMetaTag('meta[property="twitter:description"]', 'property', 'twitter:description', description);
    setMetaTag('meta[property="twitter:url"]', 'property', 'twitter:url', pageUrl);

    // Update Canonical URL
    const canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (canonical) {
      canonical.setAttribute('href', pageUrl);
    }

    // Inject JSON-LD Schema Markup for Rich Snippets (FAQ & How-To & SoftwareApplication)
    let schemaScript = document.getElementById('dynamic-json-ld') as HTMLScriptElement;
    if (!schemaScript) {
      schemaScript = document.createElement('script');
      schemaScript.id = 'dynamic-json-ld';
      schemaScript.type = 'application/ld+json';
      document.head.appendChild(schemaScript);
    }
    schemaScript.textContent = JSON.stringify(schemaData);

  }, [currentView, category, activeToolId]);

  return null;
};
