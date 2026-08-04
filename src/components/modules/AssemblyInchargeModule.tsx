import React, { useState, useEffect } from 'react';
import { SchoolProfile, Language } from '../../types';
import {
  ArrowLeft,
  BookOpen,
  Volume2,
  Printer,
  Sparkles,
  Clipboard,
  Check,
  Calendar,
  Users,
  Search,
  BookMarked,
  Layers,
  Heart,
  Globe,
  Plus,
  Trash2,
  Flame,
  Award,
  Play,
  Pause,
  RotateCcw,
  Music,
  CheckCircle2,
  FileText
} from 'lucide-react';

interface AssemblyInchargeModuleProps {
  schoolProfile: SchoolProfile;
  lang: Language;
  onBack: () => void;
}

// Module 1: Prayers Data
const PRAYERS_DATA = [
  {
    id: 'p1',
    title: 'वह शक्ति हमें दो दयानिधे (वह शक्ति हमें दो)',
    type: 'mandatory',
    category: 'Standard School Prayer',
    categoryHi: 'दैनिक राजकीय प्रार्थना',
    tempo: 'Medium (90 BPM)',
    duration: '3.5 min',
    lyrics: `वह शक्ति हमें दो दयानिधे, कर्त्तव्य मार्ग पर डट जावें।
पर सेवा पर उपकार में हम, जग जीवन सफल बना जावें॥

हम दीन-दुखी निबलों-विकलों, के सेवक बन संताप हरें।
जो हैं अटके भूले-भटके, उनको तारें खुद तर जावें॥

छल-दम्भ-द्वेष-पाखण्ड-झूठ, अन्याय से निशि-दिन दूर रहें।
जीवन हो शुद्ध सरल अपना, शुचि प्रेम-सुधारस बरसावें॥

निज आन-मान-मर्यादा का, प्रभु ध्यान रहे अभिमान रहे।
जिस देश-जाति में जन्म लिया, बलिदान उसी पर हो जावें॥`,
    meaning: 'Hey Parmeshwar! Give us the strength to always stay on the path of duty, help others, and remain free from deceit, hatred, and injustice.'
  },
  {
    id: 'p2',
    title: 'दया कर दान विद्या का (दयाल प्रार्थना)',
    type: 'shivira',
    category: 'Shivira Mandatory Prayer',
    categoryHi: 'शिविरा अकादमिक प्रार्थना',
    tempo: 'Slow-Melodious (75 BPM)',
    duration: '4 min',
    lyrics: `दया कर दान विद्या का, हमें परमात्मा देना।
दया करना हमारी आत्मा में, शुद्धता देना॥

हमारे ध्यान में आओ, प्रभु आँखों में बस जाओ।
अँधेरे दिल में आकर के, परम ज्योति जगा देना॥

बहा दो ज्ञान की गंगा, दिलों में प्रेम का सागर।
हमें आपस में मिल-जुलकर, प्रभु रहना सिखा देना॥

हमारा धर्म हो सेवा, हमारा कर्म हो सेवा।
सदा ईमान हो सेवा, व सेवक चर बना देना॥

वतन के वास्ते जीना, वतन के वास्ते मरना।
वतन पर जाँ फिदा करना, प्रभु हमको सिखा देना॥`,
    meaning: 'O God! Please grant us the gift of knowledge, purify our souls, remove darkness from our hearts, and teach us to live together in peace.'
  },
  {
    id: 'p3',
    title: 'सदाचार ही जीवन का (स्काउट गाइड प्रार्थना)',
    type: 'scout',
    category: 'Scout & Guide Prayer',
    categoryHi: 'स्काउट-गाइड प्रार्थना',
    tempo: 'Moderate-Steady (80 BPM)',
    duration: '3 min',
    lyrics: `दया कर दान भक्ति का, हमें परमात्मा देना।
दया करना हमारी आत्मा में, वीरता देना॥

स्काउट गाइड नियम पर हम, सदा ही डटकर चल पावें।
करें उपकार दूसरों पर, यही वरदान तुम देना॥

रहे ईमान पर कायम, बुराई से सदा भागें।
बना लो देश-सेवक हमें, यही आशीष तुम देना॥`,
    meaning: 'A prayer centered on courage, loyalty, and serving others selflessly according to the Scout and Guide rules.'
  },
  {
    id: 'p4',
    title: 'हम होंगे कामयाब (Group School Song)',
    type: 'song',
    category: 'Group Song / National Song',
    categoryHi: 'सामूहिक देशप्रेम गीत',
    tempo: 'Fast-March (110 BPM)',
    duration: '3 min',
    lyrics: `हम होंगे कामयाब, हम होंगे कामयाब,
हम होंगे कामयाब एक दिन।
ओहो मन में है विश्वास, पूरा है विश्वास,
हम होंगे कामयाब एक दिन॥

होगी शान्ति चारों ओर, होगी शान्ति चारों ओर,
होगी शान्ति चारों ओर एक दिन।
ओहो मन में है विश्वास, पूरा है विश्वास,
होगी शान्ति चारों ओर एक दिन॥

हम चलेंगे साथ-साथ, डाल हाथों में हाथ,
हम चलेंगे साथ-साथ एक दिन।
ओहो मन में है विश्वास, पूरा है विश्वास,
हम चलेंगे साथ-साथ एक दिन॥

नहीं डर किसी का आज, नहीं डर किसी का आज,
नहीं डर किसी का आज के दिन।
ओहो मन में है विश्वास, पूरा है विश्वास,
नहीं डर किसी का आज के दिन॥`,
    meaning: 'An adaptation of "We Shall Overcome", building confidence, teamwork, peace, and fearlessness among students.'
  }
];

// Module 2: GK Database
const GK_DATABASE = [
  {
    category: 'Rajasthan History & Heritage',
    categoryHi: 'राजस्थान का इतिहास एवं विरासत',
    question: 'राजस्थान के किस किले को "यूनेस्को विश्व धरोहर स्थल" में सबसे पहले शामिल किया गया था और उसे "गढ़ तो..." कहा जाता है?',
    answer: 'चित्तौड़गढ़ किला (Chittorgarh Fort)',
    explanation: 'चित्तौड़गढ़ किले को 2013 में यूनेस्को सूची में शामिल किया गया था। इसे राजस्थान के सभी किलों का सिरमौर माना जाता है।',
    level: 'Secondary & Sr. Secondary'
  },
  {
    category: 'Rajasthan Geography',
    categoryHi: 'राजस्थान का भूगोल',
    question: 'राजस्थान की सबसे ऊंची चोटी कौन सी है और यह किस जिले में स्थित है?',
    answer: 'गुरुशिखर (Guru Shikhar) - 1722 मीटर, सिरोही जिला (माउंट आबू)',
    explanation: 'गुरुशिखर अरावली पर्वतमाला की सबसे ऊंची चोटी है जिसे कर्नल जेम्स टॉड ने "संतों का शिखर" कहा था।',
    level: 'All Classes'
  },
  {
    category: 'Rajasthan General Knowledge',
    categoryHi: 'राजस्थान सामान्य ज्ञान',
    question: 'राजस्थान का राज्य पक्षी और राज्य वृक्ष कौन सा है?',
    answer: 'राज्य पक्षी: गोडावण (Great Indian Bustard), राज्य वृक्ष: खेजड़ी (Khejri)',
    explanation: 'गोडावण को वर्ष 1981 में राज्य पक्षी और खेजड़ी को 1983 में राज्य वृक्ष घोषित किया गया था। खेजड़ी को मरुस्थल का कल्पवृक्ष भी कहा जाता है।',
    level: 'Primary & Middle'
  },
  {
    category: 'Indian Polity & Science',
    categoryHi: 'भारतीय राजव्यवस्था व विज्ञान',
    question: 'भारत के संविधान का जनक किसे माना जाता है और वर्तमान में मुख्य वैज्ञानिक सलाहकार कौन हैं?',
    answer: 'डॉ. बी. आर. अम्बेडकर (Dr. B.R. Ambedkar)',
    explanation: 'डॉ. अम्बेडकर भारतीय संविधान की प्रारूप समिति के अध्यक्ष थे। संविधान 26 जनवरी 1950 को पूर्ण रूप से लागू हुआ।',
    level: 'Secondary & Sr. Secondary'
  },
  {
    category: 'Rajasthan Current Affairs',
    categoryHi: 'राजस्थान समसामयिकी 2026',
    question: 'राजस्थान सरकार द्वारा खेल प्रोत्साहन हेतु महाराणा प्रताप पुरस्कार की राशि बढ़ाकर कितनी कर दी गई है?',
    answer: '₹5 लाख रुपये (5 Lakh Rupees)',
    explanation: 'खेलों के क्षेत्र में उत्कृष्ट प्रदर्शन हेतु राजस्थान के खिलाड़ियों को महाराणा प्रताप पुरस्कार तथा प्रशिक्षकों को गुरु वशिष्ठ पुरस्कार दिया जाता है।',
    level: 'Secondary & Sr. Secondary'
  },
  {
    category: 'National General Knowledge',
    categoryHi: 'राष्ट्रीय सामान्य ज्ञान',
    question: 'भारत का एकमात्र सक्रिय ज्वालामुखी कहाँ स्थित है?',
    answer: 'बैरन द्वीप, अंडमान और निकोबार द्वीप समूह (Barren Island)',
    explanation: 'बैरन द्वीप दक्षिण एशिया का एकमात्र सक्रिय ज्वालामुखी है, जो अंडमान सागर में स्थित है।',
    level: 'All Classes'
  }
];

// Module 3: Stories Data
const STORIES_DATA = [
  {
    id: 's1',
    title: 'सपनों की उड़ान: डॉ. ए.पी.जे. अब्दुल कलाम',
    personality: 'Dr. APJ Abdul Kalam',
    theme: 'कठिन परिश्रम व अटूट संकल्प (Hard Work & Dedication)',
    story: `रामेश्वरम के एक छोटे से गाँव में रहने वाले एक बालक का सपना आकाश में उड़ते पक्षियों की तरह उड़ने का था। उनके परिवार की आर्थिक स्थिति बहुत कमजोर थी, यहाँ तक कि उन्हें अपनी पढ़ाई जारी रखने के लिए सुबह तड़के उठकर समाचार पत्र बेचने पड़ते थे। वे घंटों पैदल चलकर स्कूल जाते थे और मिट्टी के तेल के दीये की रोशनी में पढ़ाई करते थे।

मजबूत इच्छाशक्ति के बल पर वे पायलट तो नहीं बन पाए, लेकिन भारत के सबसे बड़े अंतरिक्ष वैज्ञानिक बने। उन्होंने भारत को मिसाइल शक्ति प्रदान की और देश के सर्वोपरि पद "राष्ट्रपति" को सुशोभित किया। वे सदैव बच्चों से कहते थे, "सपने वो नहीं जो हम सोते हुए देखते हैं, सपने वो हैं जो हमें सोने नहीं देते।"`,
    moral: 'साधन कितने भी सीमित क्यों न हों, यदि संकल्प अडिग और परिश्रम निस्वार्थ हो, तो कोई भी बाधा आपके सपनों की उड़ान को रोक नहीं सकती।'
  },
  {
    id: 's2',
    title: 'मातृभूमि का समर्पण: भामाशाह और महाराणा प्रताप',
    personality: 'Bhama Shah & Maharana Pratap',
    theme: 'देशभक्ति व निस्वार्थ दान (Patriotism & Selfless Giving)',
    story: `हल्दीघाटी के युद्ध के बाद महाराणा प्रताप अपने परिवार व सेना के साथ अरावली के जंगलों में शरण लिए हुए थे। उनके पास न तो पर्याप्त सेना थी और न ही सेना के भरण-पोषण के लिए धन। विपरीत परिस्थितियों में वे मेवाड़ छोड़ने का विचार करने लगे।

उसी समय मेवाड़ के प्रधानमंत्री रहे दानीवीर भामाशाह वहाँ पहुंचे। उन्होंने अपनी जीवन भर की संचित अपार निजी संपत्ति (स्वर्ण व चांदी मुद्राएँ) महाराणा प्रताप के चरणों में समर्पित कर दी। वह धन इतना अधिक था कि उससे 25,000 सैनिकों का खर्च 12 वर्षों तक उठाया जा सकता था। इस सहायता से महाराणा प्रताप ने पुनः सेना खड़ी की और मुगलों से मेवाड़ को मुक्त कराया।`,
    moral: 'सच्ची देशभक्ति केवल युद्ध लड़ना नहीं, बल्कि संकट के समय अपना सर्वस्व देश की उन्नति व स्वतंत्रता के लिए समर्पित कर देना है।'
  },
  {
    id: 's3',
    title: 'गणित से प्रेम: श्रीनिवास रामानुजन',
    personality: 'Srinivasa Ramanujan',
    theme: 'जिज्ञासा और एकाग्रता (Curiosity & Deep Focus)',
    story: `तमिलनाडु के ईरोड में जन्मे एक बालक को बचपन से संख्याओं से अद्भुत प्रेम था। वे स्कूल में शिक्षकों से ऐसे प्रश्न पूछते थे जिनका उत्तर देना कठिन होता था। जैसे- "यदि शून्य को शून्य से विभाजित किया जाए, तो क्या फल मिलेगा?"

रामानुजन को कागज की कमी के कारण वे अधिकांश गणित स्लेट पर हल करते थे और अंतिम परिणाम एक रफ रजिस्टर में लिखते थे। बिना किसी औपचारिक उच्च शिक्षा के, उन्होंने गणित के 3,900 से अधिक जटिल प्रमेयों (Theorems) की खोज की। उन्होंने कैम्ब्रिज यूनिवर्सिटी के प्रोफेसर जी. एच. हार्डी को अपने सूत्र भेजे, जिन्होंने उनकी प्रतिभा को पहचानकर उन्हें इंग्लैंड बुलाया। आज भी गणित जगत उनके सूत्रों पर शोध कर रहा है।`,
    moral: 'यदि आपके भीतर किसी विषय के प्रति गहरी जिज्ञासा और एकाग्रता है, तो औपचारिक संसाधनों की कमी आपकी वैश्विक सफलता के मार्ग में बाधा नहीं बन सकती।'
  }
];

// Module 6: Cultural Performance Guidelines
const CULTURAL_IDEAS = [
  {
    title: 'राजस्थानी लोक गायन (Rajasthani Folk Singing)',
    theme: 'वीरगाथा व स्वागत परंपरा (Chivalry & Hospitality)',
    songs: ['पधारो म्हारे देस (मांड राग)', 'केसरिया बालम आओ नी...', 'धरती धोरा री... (कन्हैयालाल सेठिया)'],
    description: 'बाल सभा व विशेष उत्सवों (15 अगस्त/26 जनवरी) में मांड शैली आधारित लोक गीतों की प्रस्तुति दी जा सकती है।',
    keywords: 'Padharo Mhare Desh Shala Darpan cultural guide, Rajasthani school group song singing tutorials'
  },
  {
    title: 'पारंपरिक लोक नृत्य (Traditional Dances)',
    theme: 'सांस्कृतिक लय व समन्वय (Rhythm & Coordination)',
    dances: ['घूमर (Ghoomar)', 'चरी नृत्य (Chari)', 'कालबेलिया नृत्य (Kalbelia)'],
    description: 'बालिकाओं के समूह द्वारा राजस्थानी पारंपरिक वेशभूषा में चरी व घूमर नृत्य की प्रस्तुति। चरी नृत्य के लिए सुरक्षित प्रकाश व्यवस्था हेतु एलइडी दीयों का प्रयोग करें।',
    keywords: 'School Ghoomar dance easy steps choreography, Rajasthani traditional dance guidelines'
  },
  {
    title: 'ऐतिहासिक एवं सामाजिक नाटक (Dramas/Skits)',
    theme: 'राष्ट्रप्रेम, बालिका शिक्षा व जल संरक्षण (Patriotism & Social Issues)',
    topics: ['पन्नाधाय का बलिदान (Pannadhay Sacrifice Skit)', 'बेटी बचाओ बेटी पढ़ाओ नुक्कड़ नाटक', 'जल ही जीवन है'],
    description: 'ऐतिहासिक पात्रों जैसे पन्नाधाय के बलिदान पर आधारित 10 मिनट का लघु नाटक। नुक्कड़ नाटक शैली में सामाजिक कुरीतियों के विरुद्ध संवाद प्रस्तुति।',
    keywords: 'School Hindi drama script on Pannadhay sacrifice, Beti Bachao Beti Padhao skit script'
  }
];

// Module 7: Yoga & Wellness Data
const YOGA_DATA = [
  {
    id: 'y1',
    name: 'ताड़ासन (Mountain Pose - Tadasana)',
    steps: [
      'सावधान मुद्रा में सीधे खड़े हो जाएं, पैरों में कुछ दूरी रखें।',
      'दोनों हाथों की उंगलियों को आपस में फंसाकर सिर के ऊपर रखें, हथेलियां ऊपर की ओर हों।',
      'सांस भरते हुए पूरे शरीर को ऊपर की ओर खींचें और पैरों की एड़ियों को उठाएं, केवल पंजों पर संतुलन बनाएं।',
      'इस स्थिति में 20-30 सेकंड रुकें और सामान्य सांस लें, फिर सांस छोड़ते हुए धीरे-धीरे वापस आएं।'
    ],
    benefits: 'बच्चों की लंबाई बढ़ाने में सहायक, रीढ़ की हड्डी को लचीला व मजबूत बनाता है, एकाग्रता व शारीरिक संतुलन में सुधार करता है।',
    duration: '2-3 Rounds (30 sec each)'
  },
  {
    id: 'y2',
    name: 'वृक्षासन (Tree Pose - Vrikshasana)',
    steps: [
      'सीधे खड़े हो जाएं। दाएं पैर को घुटने से मोड़कर बाएं पैर की जांघ पर अंदर की तरफ सटाकर रखें।',
      'बाएं पैर पर शरीर का पूरा संतुलन बनाएं।',
      'दोनों हाथों को सांस भरते हुए सिर के ऊपर ले जाएं और नमस्कार की मुद्रा बनाएं।',
      'किसी एक बिंदु पर ध्यान केंद्रित करें। कुछ सेकंड रुकने के बाद दूसरे पैर से भी यही दोहराएं।'
    ],
    benefits: 'पैरों की मांसपेशियों को मजबूत बनाता है, रीढ़ को सीधा रखता है, न्यूरो-मस्कुलर समन्वय (मानसिक व शारीरिक तालमेल) बढ़ाता है।',
    duration: '30-45 sec each leg'
  },
  {
    id: 'y3',
    name: 'अनुलोम-विलोम प्राणायाम (Alternate Nostril Breathing)',
    steps: [
      'पद्मासन या सुखासन में बैठें, रीढ़ की हड्डी बिल्कुल सीधी रखें और आंखें बंद करें।',
      'बाएं हाथ को ज्ञान मुद्रा में घुटने पर रखें। दाएं हाथ के अंगूठे से दाईं नासिका को बंद करें।',
      'बाईं नासिका से धीरे-धीरे गहरी सांस अंदर लें। अब बाईं नासिका को अनामिका उंगली से बंद कर दाईं नासिका खोलें और सांस बाहर छोड़ें।',
      'अब दाईं नासिका से सांस भरें और बाईं से बाहर निकालें। यह एक चक्र पूरा हुआ।'
    ],
    benefits: 'फेफड़ों की कार्यक्षमता बढ़ती है, मानसिक तनाव व चिंता दूर होती है, रक्त शुद्धिकरण होता है और एकाग्रता चरम पर पहुंचती है।',
    duration: '3-5 Minutes daily'
  }
];

export const AssemblyInchargeModule: React.FC<AssemblyInchargeModuleProps> = ({
  schoolProfile,
  lang,
  onBack
}) => {
  const [activeTab, setActiveTab] = useState<'prayers' | 'gk' | 'stories' | 'news' | 'choir' | 'cultural' | 'yoga'>('prayers');
  
  // States for interactive features
  // Module 1: Selected Prayer
  const [selectedPrayerId, setSelectedPrayerId] = useState<string>('p1');
  
  // Module 2: GK Quiz States
  const [gkQuestions, setGkQuestions] = useState(GK_DATABASE);
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [showExplanation, setShowExplanation] = useState<Record<number, boolean>>({});
  const [generatedSlipDate, setGeneratedSlipDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // Module 4: News Headlines States
  const [newsHeadlines, setNewsHeadlines] = useState({
    state: [
      'राजस्थान के विद्यालयों में शनिवार को "नो बैग डे" के तहत जीवन कौशल व खेलकूद गतिविधियां आयोजित की गईं।',
      'जयपुर में आयोजित राज्य स्तरीय शैक्षिक नवाचार संगोष्ठी में उत्कृष्ट शिक्षकों को सम्मानित किया गया।',
      'मौसम विभाग द्वारा पश्चिमी राजस्थान के जिलों में आगामी 48 घंटों में भारी वर्षा का अलर्ट जारी किया गया।'
    ],
    national: [
      'भारतीय अंतरिक्ष अनुसंधान संगठन (ISRO) ने मौसम उपग्रह की सफल लॉन्चिंग कर नया कीर्तिमान स्थापित किया।',
      'संसद के मानसून सत्र में राष्ट्रीय शिक्षा नीति के क्रियान्वयन की प्रगति रिपोर्ट प्रस्तुत की गई।'
    ],
    international: [
      'वैश्विक पर्यावरण शिखर सम्मेलन में भारत ने नवीकरणीय ऊर्जा क्षमता विस्तार पर महत्वपूर्ण प्रतिबद्धता व्यक्त की।',
      'विश्व स्वास्थ्य संगठन ने मौसमी फ्लू के बढ़ते मामलों को देखते हुए सुरक्षा दिशा-निर्देश जारी किए।'
    ]
  });
  const [newHeadlineText, setNewHeadlineText] = useState('');
  const [newHeadlineCat, setNewHeadlineCat] = useState<'state' | 'national' | 'international'>('state');

  // Module 5: School Prayer Girls Group Choir Roster State
  const [choirRoster, setChoirRoster] = useState([
    { day: 'सोमवार (Monday)', lead: 'प्रियंका कुमारी (कक्षा 12)', chorus: 'ममता, सीमा, कोमल (कक्षा 10)', harmonium: 'सुमन कंवर (कक्षा 11)', dholak: 'पूजा जाट (कक्षा 12)', anchor: 'नीतू मीणा (कक्षा 12)' },
    { day: 'मंगलवार (Tuesday)', lead: 'ममता मीणा (कक्षा 10)', chorus: 'अनीता, रेखा, संगीता (कक्षा 9)', harmonium: 'सरोज यादव (कक्षा 11)', dholak: 'पायल कंवर (कक्षा 12)', anchor: 'आरती कुमारी (कक्षा 10)' },
    { day: 'बुधवार (Wednesday)', lead: 'कोमल जाट (कक्षा 12)', chorus: 'ममता, दिव्या, प्रिया (कक्षा 10)', harmonium: 'सुमन कंवर (कक्षा 11)', dholak: 'पूजा जाट (कक्षा 12)', anchor: 'किरण बैरवा (कक्षा 11)' },
    { day: 'गुरुवार (Thursday)', lead: 'आरती कुमारी (कक्षा 10)', chorus: 'रेखा, वर्षा, लक्ष्मी (कक्षा 9)', harmonium: 'सरोज यादव (कक्षा 11)', dholak: 'पायल कंवर (कक्षा 12)', anchor: 'ममता मीणा (कक्षा 10)' },
    { day: 'शुक्रवार (Friday)', lead: 'प्रिया मेना (कक्षा 11)', chorus: 'ममता, सीमा, कोमल (कक्षा 10)', harmonium: 'सुमन कंवर (कक्षा 11)', dholak: 'पूजा जाट (कक्षा 12)', anchor: 'नीतू मीणा (कक्षा 12)' },
    { day: 'शनिवार (Saturday)', lead: 'अनीता चौधरी (कक्षा 9)', chorus: 'तनु, पायल, किरण (कक्षा 8)', harmonium: 'सरोज यादव (कक्षा 11)', dholak: 'पायल कंवर (कक्षा 12)', anchor: 'खुशी गुर्जर (कक्षा 10)' }
  ]);
  const [editingDay, setEditingDay] = useState<string | null>(null);
  const [editLead, setEditLead] = useState('');
  const [editChorus, setEditChorus] = useState('');
  const [editHarmonium, setEditHarmonium] = useState('');
  const [editDholak, setEditDholak] = useState('');
  const [editAnchor, setEditAnchor] = useState('');

  // Module 7: Yoga Breathing Timer State
  const [timerSeconds, setTimerSeconds] = useState<number>(30);
  const [timerActive, setTimerActive] = useState<boolean>(false);
  const [breathingPhase, setBreathingPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Ready'>('Ready');

  // Shared alerts/clipboard states
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Breathing loop simulation
  useEffect(() => {
    let interval: any = null;
    if (timerActive) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            // cycle breathing phase
            setBreathingPhase((phase) => {
              if (phase === 'Ready' || phase === 'Exhale') {
                setTimerSeconds(4); // 4s inhale
                return 'Inhale';
              } else if (phase === 'Inhale') {
                setTimerSeconds(4); // 4s hold
                return 'Hold';
              } else {
                setTimerSeconds(4); // 4s exhale
                return 'Exhale';
              }
            });
            return 4;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerActive]);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2500);
  };

  const handlePrint = (elementId: string) => {
    const printContent = document.getElementById(elementId);
    if (!printContent) return;
    const originalContent = document.body.innerHTML;
    document.body.innerHTML = printContent.innerHTML;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload(); // Reload to restore React state cleanly
  };

  const selectedPrayer = PRAYERS_DATA.find(p => p.id === selectedPrayerId) || PRAYERS_DATA[0];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 md:p-6 shadow-xl border border-slate-200 dark:border-slate-800 space-y-6 animate-fadeIn max-w-5xl mx-auto">
      
      {/* Module Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-4">
        <div className="space-y-1">
          <h2 className="text-xl md:text-2xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <span className="p-2 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300">
              <BookOpen className="w-6 h-6" />
            </span>
            <span>{lang === 'hi' ? 'प्रार्थना सभा प्रभारी मॉड्यूल्स' : 'Prarthana Prabhari Modules'}</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            {lang === 'hi' 
              ? 'राजकीय विद्यालयों के दैनिक प्रार्थना सभा प्रबंधन, सामान्य ज्ञान, प्रेरक प्रसंग, समाचार वाचन व योग कार्यक्रम' 
              : 'Complete school morning assembly management planner & resource directory'}
          </p>
        </div>
        
        <button
          onClick={onBack}
          className="self-start sm:self-center px-4 py-2 text-xs font-bold rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200/50 dark:border-slate-700/50 transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer shrink-0"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{lang === 'hi' ? 'वापस जाएँ' : 'Back to Dashboard'}</span>
        </button>
      </div>

      {/* Assembly Header Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 bg-amber-50/40 dark:bg-amber-950/20 border border-amber-100/50 dark:border-amber-900/20 rounded-2xl text-center">
          <span className="block text-[10px] text-amber-700 dark:text-amber-400 font-extrabold uppercase tracking-wider">{lang === 'hi' ? 'सभा समय' : 'Timing'}</span>
          <span className="text-sm font-black text-slate-800 dark:text-slate-100">08:00 AM - 08:30 AM</span>
        </div>
        <div className="p-3 bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-100/50 dark:border-emerald-900/20 rounded-2xl text-center">
          <span className="block text-[10px] text-emerald-700 dark:text-emerald-400 font-extrabold uppercase tracking-wider">{lang === 'hi' ? 'कुल गतिविधियां' : 'Total Sections'}</span>
          <span className="text-sm font-black text-slate-800 dark:text-slate-100">7 Core Modules</span>
        </div>
        <div className="p-3 bg-sky-50/40 dark:bg-sky-950/20 border border-sky-100/50 dark:border-sky-900/20 rounded-2xl text-center">
          <span className="block text-[10px] text-sky-700 dark:text-sky-400 font-extrabold uppercase tracking-wider">{lang === 'hi' ? 'सक्रिय मंच' : 'Active Stage'}</span>
          <span className="text-sm font-black text-slate-800 dark:text-slate-100">{lang === 'hi' ? 'बालिका प्रार्थना दल' : 'Girls Choir Group'}</span>
        </div>
        <div className="p-3 bg-rose-50/40 dark:bg-rose-950/20 border border-rose-100/50 dark:border-rose-900/20 rounded-2xl text-center">
          <span className="block text-[10px] text-rose-700 dark:text-rose-400 font-extrabold uppercase tracking-wider">{lang === 'hi' ? 'अनिवार्य नियम' : 'Compliance'}</span>
          <span className="text-sm font-black text-slate-800 dark:text-slate-100">{lang === 'hi' ? 'शिविरा पंचांग लागू' : 'Shivira Compliant'}</span>
        </div>
      </div>

      {/* Primary Navigation Tabs */}
      <div className="flex overflow-x-auto pb-1 gap-1.5 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700">
        {[
          { id: 'prayers', titleHi: '1. प्रार्थना व राष्ट्रगीत', titleEn: 'Prayers' },
          { id: 'gk', titleHi: '2. राजस्थान सामान्य ज्ञान', titleEn: 'Rajasthan GK' },
          { id: 'stories', titleHi: '3. प्रेरक प्रसंग (कहानियां)', titleEn: 'Inspirational' },
          { id: 'news', titleHi: '4. दैनिक समाचार वाचन', titleEn: 'News Bulletin' },
          { id: 'choir', titleHi: '5. बालिका प्रार्थना समूह', titleEn: 'Choir Roster' },
          { id: 'cultural', titleHi: '6. सांस्कृतिक गतिविधियाँ', titleEn: 'Cultural Ideas' },
          { id: 'yoga', titleHi: '7. योग व शारीरिक स्वास्थ्य', titleEn: 'Yoga & Wellness' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 active:scale-95 cursor-pointer border ${
              activeTab === tab.id
                ? 'bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-500/20'
                : 'bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200/60 dark:border-slate-700/60'
            }`}
          >
            {lang === 'hi' ? tab.titleHi : tab.titleEn}
          </button>
        ))}
      </div>

      {/* --- MODULE CONTENT BLOCKS --- */}

      {/* MODULE 1: PRAYERS */}
      {activeTab === 'prayers' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            {/* Left selector */}
            <div className="md:col-span-4 space-y-2.5">
              <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider block">
                {lang === 'hi' ? 'प्रार्थना एवं समूह गीत' : 'Prayers & Choir Songs'}
              </span>
              <div className="space-y-2">
                {PRAYERS_DATA.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPrayerId(p.id)}
                    className={`w-full p-3.5 rounded-2xl border text-left transition-all active:scale-98 cursor-pointer flex flex-col gap-1 ${
                      selectedPrayerId === p.id
                        ? 'bg-amber-50/80 dark:bg-amber-950/20 border-amber-400 dark:border-amber-800'
                        : 'bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border-slate-200/80 dark:border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-extrabold text-slate-800 dark:text-slate-100 truncate flex-1 pr-1">{p.title}</span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold shrink-0 ${
                        p.type === 'mandatory' || p.type === 'shivira'
                          ? 'bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-400'
                          : 'bg-indigo-100 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-400'
                      }`}>
                        {lang === 'hi' ? p.categoryHi : p.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-[10px] text-slate-400 mt-1">
                      <span className="flex items-center gap-1"><Volume2 className="w-3 h-3" /> {p.tempo}</span>
                      <span className="font-mono">Duration: {p.duration}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Right Display Card */}
            <div className="md:col-span-8 bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-100">{selectedPrayer.title}</h3>
                  <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider block">
                    {lang === 'hi' ? `श्रेणी: ${selectedPrayer.categoryHi}` : `Category: ${selectedPrayer.category}`}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleCopy(selectedPrayer.lyrics, 'lyrics')}
                    className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-emerald-600 transition-colors shrink-0 flex items-center gap-1 text-xs font-bold"
                  >
                    {copiedText === 'lyrics' ? <Check className="w-4 h-4 text-emerald-600" /> : <Clipboard className="w-4 h-4" />}
                    <span>{copiedText === 'lyrics' ? 'कॉपी हुआ!' : 'लिरिक्स कॉपी'}</span>
                  </button>
                  <button
                    onClick={() => handlePrint('printable-prayer- lyrics')}
                    className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-amber-600 transition-colors shrink-0 flex items-center gap-1 text-xs font-bold"
                  >
                    <Printer className="w-4 h-4" />
                    <span>प्रिंट</span>
                  </button>
                </div>
              </div>

              {/* Printable Area */}
              <div id="printable-prayer- lyrics" className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-2xs">
                <div className="text-center pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 font-extrabold tracking-widest block uppercase">Shala Sahayak Morning Assembly Planner</span>
                  <h4 className="text-sm font-black text-slate-800 dark:text-slate-100 mt-1">{selectedPrayer.title}</h4>
                  <div className="flex justify-center gap-4 text-[11px] text-slate-400 mt-1.5 font-mono">
                    <span>Tempo: {selectedPrayer.tempo}</span>
                    <span>Timing: {selectedPrayer.duration}</span>
                  </div>
                </div>

                <div className="text-center font-bold text-slate-700 dark:text-slate-300 text-sm md:text-base leading-relaxed whitespace-pre-line select-text font-serif">
                  {selectedPrayer.lyrics}
                </div>

                <div className="mt-4 pt-3 border-t border-dashed border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg">
                  <span className="text-[11px] font-black uppercase text-amber-700 dark:text-amber-400 block tracking-wider">भावार्थ / नैतिक महत्व:</span>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed font-medium">
                    {selectedPrayer.meaning}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODULE 2: GEOGRAPHY & GK QUESTION GENERATOR */}
      {activeTab === 'gk' && (
        <div className="space-y-4 animate-fadeIn">
          {/* Header Description */}
          <div className="p-4 bg-amber-50/30 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/30 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-black text-amber-700 dark:text-amber-400 uppercase tracking-widest block">DAILY QUESTION GENERATOR</span>
              <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-200">
                {lang === 'hi' ? 'राजस्थान केंद्रित दैनिक सामान्य ज्ञान प्रश्नोत्तरी' : 'Rajasthan-Centric Daily GK Questions'}
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                {lang === 'hi' ? 'कक्षा 1 से 12 स्तर के विद्यार्थियों हेतु राजस्थान इतिहास, भूगोल, वर्तमान घटनाक्रम व भारतीय सामान्य ज्ञान का दैनिक संकलन।' : 'Auto-select relevant, daily assembly questions with toggleable answer sheets.'}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handlePrint('printable-gk-slip')}
                className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center gap-1 shadow-2xs cursor-pointer active:scale-95"
              >
                <Printer className="w-4 h-4 text-amber-600" />
                <span>{lang === 'hi' ? 'दैनिक जीके पर्ची प्रिंट' : 'Print GK Assembly Slip'}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            {/* Interactive Slip / Card */}
            <div className="md:col-span-8 bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-400 uppercase tracking-wider">{lang === 'hi' ? 'आज का असेंबली जीके बुलेटिन' : 'Assembly GK Bulletin'}</span>
                <input
                  type="date"
                  value={generatedSlipDate}
                  onChange={(e) => setGeneratedSlipDate(e.target.value)}
                  className="p-1.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-300"
                />
              </div>

              {/* Printable slip */}
              <div id="printable-gk-slip" className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-2xs space-y-4">
                <div className="text-center pb-3 border-b border-dashed border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-emerald-600 font-black tracking-widest block uppercase">प्राथमिक/माध्यमिक प्रार्थना सभा बुलेटिन</span>
                  <h4 className="text-base font-extrabold text-slate-800 dark:text-slate-100 mt-0.5">{schoolProfile.schoolName || 'राजकीय विद्यालय'}</h4>
                  <div className="flex justify-center gap-4 text-[10px] text-slate-400 mt-1 font-mono">
                    <span>Date: {generatedSlipDate}</span>
                    <span>Level: Class 1 to 12th</span>
                    <span>State: Rajasthan</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {gkQuestions.map((item, index) => (
                    <div key={index} className="p-3 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-slate-200/60 dark:border-slate-800/60 space-y-2">
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-0.5">
                          <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-[9px] font-bold rounded-full font-mono uppercase">
                            Q.{index + 1} - {item.category}
                          </span>
                          <p className="text-xs font-bold text-slate-800 dark:text-slate-100 mt-1 pr-4 leading-relaxed">
                            {item.question}
                          </p>
                        </div>
                        <span className="text-[9px] font-mono text-slate-400 whitespace-nowrap">{item.level}</span>
                      </div>

                      {/* Toggleable Action or always shown on Print */}
                      <div className="pt-2 border-t border-slate-200/50 dark:border-slate-700/50">
                        <div className="flex items-center justify-between">
                          <button
                            onClick={() => setShowExplanation(prev => ({ ...prev, [index]: !prev[index] }))}
                            className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                          >
                            {showExplanation[index] ? 'Hide Explanation (उत्तर छिपाएं)' : 'Reveal Answer & Exp (उत्तर व व्याख्या देखें)'}
                          </button>
                        </div>

                        {(showExplanation[index] || window.matchMedia('print').matches) && (
                          <div className="mt-2 bg-emerald-50/50 dark:bg-emerald-950/20 p-2.5 rounded-lg space-y-1">
                            <p className="text-xs font-extrabold text-emerald-800 dark:text-emerald-300">
                              उत्तर: {item.answer}
                            </p>
                            <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                              व्याख्या: {item.explanation}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-dashed border-slate-200 dark:border-slate-800 pt-3 flex justify-between items-center text-[10px] text-slate-400 font-bold">
                  <span>प्रभारी हस्ताक्षर: __________________</span>
                  <span>शाला सहायक पावर्ड 2026</span>
                </div>
              </div>
            </div>

            {/* Quick Quiz Card */}
            <div className="md:col-span-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 space-y-4">
              <div>
                <h4 className="font-bold text-xs text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>दैनिक सभा मॉक क्विज़ (Quick Test)</span>
                </h4>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  विद्यार्थी सभा से पूर्व या बाद में अपनी तैयारी की जांच कर सकते हैं।
                </p>
              </div>

              <div className="space-y-3">
                {gkQuestions.slice(0, 3).map((item, idx) => (
                  <div key={idx} className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 text-xs space-y-2">
                    <p className="font-bold text-slate-800 dark:text-slate-100">{item.question}</p>
                    <input
                      type="text"
                      placeholder="Type your answer in brief"
                      value={selectedAnswers[idx] || ''}
                      onChange={(e) => setSelectedAnswers(prev => ({ ...prev, [idx]: e.target.value }))}
                      className="w-full p-1.5 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-[11px] text-slate-700 dark:text-slate-300 font-medium"
                    />
                  </div>
                ))}
              </div>

              {quizScore !== null ? (
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-center border border-emerald-100 space-y-1">
                  <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 block">Thank you for practicing!</span>
                  <p className="text-[10px] text-slate-500">Compare your written answers with the revealed slip on the left side.</p>
                  <button
                    onClick={() => {
                      setQuizScore(null);
                      setSelectedAnswers({});
                    }}
                    className="text-[10px] text-amber-600 font-bold hover:underline block mx-auto pt-1"
                  >
                    Reset Quiz
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setQuizScore(3)}
                  className="w-full py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Submit Practices
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODULE 3: PRERAK PRASANG (INSPIRATIONAL STORIES) */}
      {activeTab === 'stories' && (
        <div className="space-y-4 animate-fadeIn">
          <span className="text-xs font-black uppercase text-slate-400 tracking-wider block">
            {lang === 'hi' ? 'दैनिक नैतिक कहानियां व प्रेरक प्रसंग' : 'Prerak Prasang - Hindi Moral Stories'}
          </span>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {STORIES_DATA.map((story) => (
              <div key={story.id} className="p-5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-4 shadow-2xs">
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-[9px] font-bold rounded-full">
                      {story.personality}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 truncate max-w-[120px]">
                      {story.theme}
                    </span>
                  </div>
                  <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-100">{story.title}</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium line-clamp-6 whitespace-pre-line text-justify select-text">
                    {story.story}
                  </p>
                </div>

                <div className="pt-3 border-t border-dashed border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 rounded-xl space-y-1">
                  <span className="text-[10px] font-black uppercase text-rose-600 dark:text-rose-400 flex items-center gap-1">
                    <Award className="w-3.5 h-3.5" />
                    <span>शिक्षा / Takeaway:</span>
                  </span>
                  <p className="text-[11px] font-bold text-slate-700 dark:text-slate-200 italic leading-relaxed">
                    "{story.moral}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODULE 4: DAILY NEWSPAPER HEADLINES */}
      {activeTab === 'news' && (
        <div className="space-y-4 animate-fadeIn">
          {/* Headline Builder Instructions */}
          <div className="p-4 bg-emerald-50/40 dark:bg-slate-800/40 border border-emerald-100/50 dark:border-slate-800 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-widest block">DAILY SCHOOL NEWS BULLETIN</span>
              <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100">
                {lang === 'hi' ? 'दैनिक समाचार पत्र सुर्खियां संपादक एवं वाचन पर्ची' : 'Assembly News Bulletin Editor & Slip'}
              </h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                {lang === 'hi' 
                  ? 'राजस्थान पत्रिका, द हिन्दू व टाइम्स ऑफ़ इंडिया से संकलित मुख्य खबरें। नीचे समाचार संपादित करें और सभा वाचक छात्र को देने हेतु प्रिंट करें।' 
                  : 'Synthesize State, National, and International headlines for students to read out loud.'}
              </p>
            </div>
            <button
              onClick={() => handlePrint('printable-news-bulletin')}
              className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs cursor-pointer shrink-0 active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>{lang === 'hi' ? 'समाचार बुलेटिन प्रिंट' : 'Print News Bulletin'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Editor form (Left 4 cols) */}
            <div className="lg:col-span-4 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs space-y-3">
              <span className="font-bold text-xs text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <Plus className="w-4 h-4 text-emerald-600" />
                <span>{lang === 'hi' ? 'नई सुर्खी / खबर जोड़ें' : 'Add Custom Headline'}</span>
              </span>
              <div className="space-y-2.5">
                <select
                  value={newHeadlineCat}
                  onChange={(e) => setNewHeadlineCat(e.target.value as any)}
                  className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-300"
                >
                  <option value="state">राजस्थान राज्य समाचार (State)</option>
                  <option value="national">राष्ट्रीय समाचार (National)</option>
                  <option value="international">अंतर्राष्ट्रीय समाचार (International)</option>
                </select>

                <textarea
                  placeholder="खबर की सुर्खी यहाँ लिखें (सरल हिंदी में)..."
                  value={newHeadlineText}
                  onChange={(e) => setNewHeadlineText(e.target.value)}
                  rows={4}
                  className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium text-slate-700 dark:text-slate-300"
                />

                <button
                  onClick={() => {
                    if (!newHeadlineText.trim()) return;
                    setNewsHeadlines(prev => ({
                      ...prev,
                      [newHeadlineCat]: [...prev[newHeadlineCat], newHeadlineText]
                    }));
                    setNewHeadlineText('');
                  }}
                  className="w-full py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-bold text-xs active:scale-95 transition-all"
                >
                  खबर सहेजें (Save to List)
                </button>
              </div>
            </div>

            {/* Display / Printable Bulletin (Right 8 cols) */}
            <div className="lg:col-span-8 bg-slate-50 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div id="printable-news-bulletin" className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-2xs space-y-4">
                <div className="text-center pb-3 border-b-2 border-double border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Shala Sahayak Daily Broadcast Slip</span>
                  <h3 className="text-base font-black text-slate-800 dark:text-slate-100 mt-1">प्रातःकालीन दैनिक समाचार सुर्खियां (News Bulletin)</h3>
                  <p className="text-[10px] text-slate-500 font-mono mt-0.5">Date: {new Date().toLocaleDateString('hi-IN')} | Source: Patrika, The Hindu, TOI</p>
                </div>

                {/* State headlines */}
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 border-b border-slate-100 pb-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                    <h4 className="text-xs font-extrabold text-amber-800 dark:text-amber-400">{lang === 'hi' ? 'राजस्थान समाचार (State Headlines)' : 'State News'}</h4>
                  </div>
                  <ul className="list-disc pl-5 text-xs text-slate-700 dark:text-slate-300 space-y-1.5 font-medium">
                    {newsHeadlines.state.map((hl, idx) => (
                      <li key={idx} className="leading-relaxed">
                        {hl}
                        <button
                          onClick={() => setNewsHeadlines(prev => ({ ...prev, state: prev.state.filter((_, i) => i !== idx) }))}
                          className="print:hidden text-[9px] text-red-500 font-bold hover:underline ml-2"
                        >
                          (हटाएं)
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* National headlines */}
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 border-b border-slate-100 pb-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                    <h4 className="text-xs font-extrabold text-blue-800 dark:text-blue-400">{lang === 'hi' ? 'राष्ट्रीय समाचार (National Headlines)' : 'National News'}</h4>
                  </div>
                  <ul className="list-disc pl-5 text-xs text-slate-700 dark:text-slate-300 space-y-1.5 font-medium">
                    {newsHeadlines.national.map((hl, idx) => (
                      <li key={idx} className="leading-relaxed">
                        {hl}
                        <button
                          onClick={() => setNewsHeadlines(prev => ({ ...prev, national: prev.national.filter((_, i) => i !== idx) }))}
                          className="print:hidden text-[9px] text-red-500 font-bold hover:underline ml-2"
                        >
                          (हटाएं)
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* International headlines */}
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 border-b border-slate-100 pb-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
                    <h4 className="text-xs font-extrabold text-indigo-800 dark:text-indigo-400">{lang === 'hi' ? 'अंतर्राष्ट्रीय समाचार (International Headlines)' : 'International News'}</h4>
                  </div>
                  <ul className="list-disc pl-5 text-xs text-slate-700 dark:text-slate-300 space-y-1.5 font-medium">
                    {newsHeadlines.international.map((hl, idx) => (
                      <li key={idx} className="leading-relaxed">
                        {hl}
                        <button
                          onClick={() => setNewsHeadlines(prev => ({ ...prev, international: prev.international.filter((_, i) => i !== idx) }))}
                          className="print:hidden text-[9px] text-red-500 font-bold hover:underline ml-2"
                        >
                          (हटाएं)
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-dashed border-slate-200 dark:border-slate-800 flex justify-between items-center text-[10px] text-slate-400 font-bold">
                  <span>वाचक विद्यार्थी हस्ताक्षर: __________________</span>
                  <span>शाला सहायक पावर्ड 2026</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODULE 5: SCHOOL PRAYER GIRLS GROUP CHOIR ROSTER */}
      {activeTab === 'choir' && (
        <div className="space-y-4 animate-fadeIn">
          {/* Header Description */}
          <div className="p-4 bg-sky-50/40 dark:bg-slate-800/40 border border-sky-100/50 dark:border-slate-800 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-black text-sky-700 dark:text-sky-400 uppercase tracking-widest block">GIRLS CHOIR FORUM & ROSTER</span>
              <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100">
                {lang === 'hi' ? 'प्रार्थना सभा बालिका मंच - साप्ताहिक ड्यूटी चार्ट' : 'Prayer Girls Group - Weekly Choir Roster'}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {lang === 'hi' ? 'प्रार्थना मंच के सफल संचालन हेतु बालिकाओं की भूमिकाएं (मुख्य स्वर, सह-स्वर, वादक व मंच संचालन) साप्ताहिक रूप से निर्धारित करें।' : 'Organize and allot assembly stage responsibilities among girls, with role management.'}
              </p>
            </div>
            <button
              onClick={() => handlePrint('printable-choir-roster')}
              className="px-4 py-2 rounded-xl bg-sky-800 hover:bg-sky-900 text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs cursor-pointer shrink-0 active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>{lang === 'hi' ? 'ड्यूटी चार्ट प्रिंट' : 'Print Duty Chart'}</span>
            </button>
          </div>

          {/* Roster Editor Form Overlay */}
          {editingDay && (
            <div className="bg-amber-50/40 dark:bg-slate-800/60 p-4 rounded-2xl border border-amber-200 dark:border-slate-700 text-xs space-y-3">
              <span className="font-extrabold text-slate-800 dark:text-slate-100 block">
                {lang === 'hi' ? `${editingDay} का प्रार्थना दायित्व संपादन` : `Edit Choir Roles for ${editingDay}`}
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                <div>
                  <label className="block text-[10px] text-slate-400 font-extrabold uppercase">मुख्य स्वर (Lead Singer)</label>
                  <input type="text" value={editLead} onChange={e => setEditLead(e.target.value)} className="w-full p-1.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold" />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 font-extrabold uppercase">सह-स्वर (Chorus)</label>
                  <input type="text" value={editChorus} onChange={e => setEditChorus(e.target.value)} className="w-full p-1.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold" />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 font-extrabold uppercase">हारमोनियम (Harmonium)</label>
                  <input type="text" value={editHarmonium} onChange={e => setEditHarmonium(e.target.value)} className="w-full p-1.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold" />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 font-extrabold uppercase">ढोलक/तबला (Percussion)</label>
                  <input type="text" value={editDholak} onChange={e => setEditDholak(e.target.value)} className="w-full p-1.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold" />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-[10px] text-slate-400 font-extrabold uppercase">मंच संचालन (Anchor/Pledge)</label>
                  <input type="text" value={editAnchor} onChange={e => setEditAnchor(e.target.value)} className="w-full p-1.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold" />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button onClick={() => setEditingDay(null)} className="px-3 py-1 rounded bg-slate-200 dark:bg-slate-700 font-bold">रद्द करें (Cancel)</button>
                <button
                  onClick={() => {
                    setChoirRoster(prev => prev.map(item => item.day === editingDay ? { ...item, lead: editLead, chorus: editChorus, harmonium: editHarmonium, dholak: editDholak, anchor: editAnchor } : item));
                    setEditingDay(null);
                  }}
                  className="px-3 py-1 rounded bg-emerald-800 text-white font-bold"
                >
                  बदलाव सहेजें (Save)
                </button>
              </div>
            </div>
          )}

          {/* Roster Table */}
          <div id="printable-choir-roster" className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
            <div className="text-center pb-2 border-b border-dashed border-slate-200">
              <span className="text-[10px] text-slate-400 font-black tracking-widest block">RAJASTHAN EDUCATION DEPARTMENT COMPLIANT</span>
              <h4 className="text-sm font-black text-slate-800 dark:text-slate-100 mt-1">साप्ताहिक बालिका मंच प्रार्थना सभा मंचन व वादन व्यवस्था पत्रक</h4>
              <p className="text-[10px] text-slate-500 font-mono">Academic Session: 2026-27 | School: {schoolProfile.schoolName || 'राजकीय माध्यमिक विद्यालय'}</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800 text-[10px] text-slate-400 font-extrabold uppercase tracking-wider border-b border-slate-200 dark:border-slate-700">
                    <th className="p-3">वार (Day)</th>
                    <th className="p-3">मुख्य गायिका (Lead Singer)</th>
                    <th className="p-3">सह-गायिका (Chorus Group)</th>
                    <th className="p-3">हारमोनियम (Harmonium)</th>
                    <th className="p-3">ढोलक/तबला (Percussion)</th>
                    <th className="p-3">मंच संचालिका (Anchor/Pledge)</th>
                    <th className="p-3 text-right print:hidden">कार्रवाई (Action)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  {choirRoster.map((row) => (
                    <tr key={row.day} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="p-3 font-extrabold text-slate-700 dark:text-slate-300">{row.day}</td>
                      <td className="p-3 text-slate-800 dark:text-slate-100">{row.lead}</td>
                      <td className="p-3 text-slate-600 dark:text-slate-300">{row.chorus}</td>
                      <td className="p-3 text-slate-600 dark:text-slate-300">{row.harmonium}</td>
                      <td className="p-3 text-slate-600 dark:text-slate-300">{row.dholak}</td>
                      <td className="p-3 text-slate-800 dark:text-slate-100 font-bold">{row.anchor}</td>
                      <td className="p-3 text-right print:hidden">
                        <button
                          onClick={() => {
                            setEditingDay(row.day);
                            setEditLead(row.lead);
                            setEditChorus(row.chorus);
                            setEditHarmonium(row.harmonium);
                            setEditDholak(row.dholak);
                            setEditAnchor(row.anchor);
                          }}
                          className="text-[11px] font-black text-amber-600 dark:text-amber-400 hover:underline"
                        >
                          संपादित करें (Edit)
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="border-t border-dashed border-slate-200 dark:border-slate-800 pt-3 flex justify-between items-center text-[10px] text-slate-400 font-bold">
              <span>शाला दर्पण समन्वयक हस्ताक्षर: __________________</span>
              <span>प्रार्थना सभा प्रभारी हस्ताक्षर: __________________</span>
            </div>
          </div>
        </div>
      )}

      {/* MODULE 6: CULTURAL ACTIVITIES */}
      {activeTab === 'cultural' && (
        <div className="space-y-4 animate-fadeIn">
          <span className="text-xs font-black uppercase text-slate-400 tracking-wider block">
            {lang === 'hi' ? 'बाल सभा व सांस्कृतिक कार्यक्रम मार्गदर्शिका' : 'Bal Sabha & Cultural Activity Resource Hub'}
          </span>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {CULTURAL_IDEAS.map((idea, index) => (
              <div key={index} className="p-5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-4 shadow-2xs">
                <div className="space-y-3">
                  <div className="flex items-center gap-1.5">
                    <span className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                      <Music className="w-4 h-4" />
                    </span>
                    <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-100">{idea.title}</h4>
                  </div>
                  <span className="text-[10px] font-black uppercase text-amber-700 dark:text-amber-400 block tracking-wider">
                    Theme: {idea.theme}
                  </span>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">
                    {idea.description}
                  </p>

                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase">सुझाए गए गीत / विषय (Suggested):</span>
                    <div className="flex flex-wrap gap-1">
                      {idea.songs ? (
                        idea.songs.map((s, i) => (
                          <span key={i} className="px-2 py-0.5 bg-white dark:bg-slate-900 border border-slate-200 text-slate-600 dark:text-slate-300 text-[10px] font-bold rounded">
                            {s}
                          </span>
                        ))
                      ) : (
                        idea.topics?.map((t, i) => (
                          <span key={i} className="px-2 py-0.5 bg-white dark:bg-slate-900 border border-slate-200 text-slate-600 dark:text-slate-300 text-[10px] font-bold rounded">
                            {t}
                          </span>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest block">YouTube / Google Search Keywords</span>
                  <p className="text-[10px] text-slate-600 dark:text-slate-300 font-mono leading-relaxed bg-slate-50 dark:bg-slate-800 p-1.5 rounded border border-dashed border-slate-200">
                    "{idea.keywords}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODULE 7: YOGA & WELLNESS */}
      {activeTab === 'yoga' && (
        <div className="space-y-4 animate-fadeIn">
          {/* Header instructions with Timer */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            {/* Left poses */}
            <div className="md:col-span-8 space-y-4">
              <span className="text-xs font-black uppercase text-slate-400 tracking-wider block">
                {lang === 'hi' ? 'पतंजलि योग आसन व प्राणायाम सूची (स्टेप-बाय-स्टेप)' : 'Patanjali Yoga & Breathing Exercises'}
              </span>

              <div className="space-y-4">
                {YOGA_DATA.map((y) => (
                  <div key={y.id} className="p-5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                        <span>{y.name}</span>
                      </h4>
                      <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold rounded-full font-mono">
                        {y.duration}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 font-medium">
                      <span className="text-[10px] font-black uppercase text-amber-700 dark:text-amber-400 block tracking-wider">चरणबद्ध विधि (Steps to Perform):</span>
                      <ol className="list-decimal pl-5 space-y-1">
                        {y.steps.map((st, i) => (
                          <li key={i} className="leading-relaxed">{st}</li>
                        ))}
                      </ol>
                    </div>

                    <div className="pt-2.5 border-t border-slate-200/50 dark:border-slate-700/50">
                      <span className="text-[10px] font-black uppercase text-emerald-700 dark:text-emerald-400 block tracking-wider">शारीरिक व मानसिक लाभ (Benefits):</span>
                      <p className="text-xs text-slate-500 leading-relaxed font-semibold mt-0.5">
                        {y.benefits}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right breathing helper & Stopwatch */}
            <div className="md:col-span-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 space-y-5">
              <div className="text-center space-y-1">
                <h4 className="font-bold text-xs text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  प्राणायाम अनुलोम-विलोम श्वसन टाइमर
                </h4>
                <p className="text-[10px] text-slate-500">
                  श्वास प्रक्रिया चक्र (Inhale, Hold, Exhale) के अभ्यास के लिए।
                </p>
              </div>

              {/* Breath visual circle */}
              <div className="flex flex-col items-center justify-center p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                <div className={`w-28 h-28 rounded-full border-4 flex flex-col items-center justify-center transition-all duration-1000 ${
                  breathingPhase === 'Inhale' 
                    ? 'border-emerald-500 bg-emerald-50 scale-105' 
                    : breathingPhase === 'Hold' 
                    ? 'border-amber-500 bg-amber-50 scale-100 animate-pulse'
                    : breathingPhase === 'Exhale'
                    ? 'border-blue-500 bg-blue-50 scale-95'
                    : 'border-slate-200 bg-slate-50'
                }`}>
                  <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
                    {breathingPhase}
                  </span>
                  <span className="text-xl font-mono font-black text-slate-800 dark:text-slate-100">
                    {timerSeconds}s
                  </span>
                </div>

                <div className="flex gap-2 w-full">
                  <button
                    onClick={() => {
                      setTimerActive(!timerActive);
                      if (!timerActive && breathingPhase === 'Ready') {
                        setBreathingPhase('Inhale');
                        setTimerSeconds(4);
                      }
                    }}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all text-white flex items-center justify-center gap-1 cursor-pointer ${
                      timerActive ? 'bg-red-600 hover:bg-red-700' : 'bg-emerald-700 hover:bg-emerald-800'
                    }`}
                  >
                    {timerActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    <span>{timerActive ? 'Stop' : 'Start Cycle'}</span>
                  </button>
                  <button
                    onClick={() => {
                      setTimerActive(false);
                      setTimerSeconds(30);
                      setBreathingPhase('Ready');
                    }}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200"
                    title="Reset Timer"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Rhythmic Breathing Tip */}
              <div className="bg-amber-50/50 dark:bg-amber-950/20 p-3 rounded-xl border border-amber-100 border-dashed text-xs space-y-1">
                <span className="font-extrabold text-amber-800 dark:text-amber-300 block">4-4-4 श्वास नियम (Sama Vritti):</span>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                  4 सेकंड सांस खींचे (Inhale), 4 सेकंड सांस रोकें (Hold), 4 सेकंड धीरे-धीरे बाहर छोड़ें (Exhale)। यह तनाव को कम करने व एकाग्रता तीव्र करने की श्रेष्ठ वैज्ञानिक विधि है।
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
