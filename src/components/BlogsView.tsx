import React, { useState, useEffect, useMemo } from 'react';
import { HelpGuidesWidget } from './HelpGuidesWidget';
import { TeacherResourceHub } from './TeacherResourceHub';
import { Language } from '../types';
import { 
  BookOpen, 
  Sparkles, 
  Youtube, 
  Play, 
  Clock, 
  ExternalLink, 
  Search, 
  Film, 
  HelpCircle, 
  LayoutGrid,
  ChevronRight,
  Tv,
  X,
  Maximize,
  CheckCircle
} from 'lucide-react';

interface BlogsViewProps {
  lang: Language;
  initialTab?: 'guides' | 'hub' | 'videos';
  onSelectCategory: (catId: string) => void;
  onSelectTool: (toolId: string) => void;
  onBack: () => void;
}

interface YouTubeVideo {
  id: string;
  titleHi: string;
  titleEn: string;
  descriptionHi: string;
  descriptionEn: string;
  channelName: string;
  duration: string;
  categoryHi: string;
  categoryEn: string;
  videoId: string;
  videoUrl: string;
}

// Authentic, educational & cultural performance YouTube videos for Rajasthan teachers
const youtubeVideos: YouTubeVideo[] = [
  {
    id: 'video-1',
    titleHi: 'शाला दर्पण स्कूल लॉगिन और कक्षावार विषय अध्यापक मैपिंग गाइड',
    titleEn: 'Shala Darpan School Login & Subject Teacher Mapping Guide',
    descriptionHi: 'कक्षावार विषय अध्यापकों की मैपिंग कैसे करें, बोर्ड परीक्षा 2026 आवेदन और लॉगिन त्रुटियाँ सुधारने की सरल प्रक्रिया।',
    descriptionEn: 'Step-by-step tutorial on subject teacher mapping, board exam 2026 applications and fixing portal login issues.',
    channelName: 'Rajasthan Dev Education',
    duration: '12:45',
    categoryHi: 'शाला दर्पण',
    categoryEn: 'Shala Darpan',
    videoId: 'bYvE1WfVfQk',
    videoUrl: 'https://www.youtube.com/watch?v=bYvE1WfVfQk'
  },
  {
    id: 'video-2',
    titleHi: 'क्रीड़ा शुल्क प्रपत्र (Form A & B) कैलकुलेटर और स्टॉक एंट्री गाइड',
    titleEn: 'Krida Shulk Form A & B Calculation & Sports Stock Register Tutorial',
    descriptionHi: 'पीटीआई शिक्षकों के लिए क्रीड़ा शुल्क ऑनलाइन प्रपत्र क व ख तैयार करने, बैंक चालान गणना और स्टॉक बुक ऑडिट करने की पूरी विधि।',
    descriptionEn: 'Complete guide for PTI teachers on preparing Krida Shulk Form A & B, bank challan calculation and auditing the sports stock register.',
    channelName: 'Rajasthan PTI Helper',
    duration: '10:15',
    categoryHi: 'क्रीड़ा व पीटीआई',
    categoryEn: 'Sports & PTI',
    videoId: '5zS_qSveU5M',
    videoUrl: 'https://www.youtube.com/watch?v=5zS_qSveU5M'
  },
  {
    id: 'video-3',
    titleHi: 'वार्षिक वेतन वृद्धि (3% Increment) गणना एवं सर्विस बुक प्रविष्टि',
    titleEn: 'Annual Salary Increment 3% Calculation & Service Book Update',
    descriptionHi: '7वें वेतन आयोग के अनुसार कर्मचारियों की 3% वार्षिक वेतन वृद्धि, एरियर गणना और पे-मैनेजर/IFMS पर एंट्री करने की लाइव मार्गदर्शिका।',
    descriptionEn: 'Live guide on calculating 3% annual basic salary increment under 7th Pay Commission, arrear sheet and PayManager/IFMS updates.',
    channelName: 'PayManager Experts Rajasthan',
    duration: '15:20',
    categoryHi: 'वेतन व पे-मैनेजर',
    categoryEn: 'Salary & PayManager',
    videoId: 'K-R1bKjBvXw',
    videoUrl: 'https://www.youtube.com/watch?v=K-R1bKjBvXw'
  },
  {
    id: 'video-4',
    titleHi: 'मिड-डे मील (MDM) दैनिक खाद्यान्न गणना और गोपाल बाल दूध योजना एंट्री',
    titleEn: 'Mid-Day Meal Grain Calculation & Gopal Bal Milk Scheme Entries',
    descriptionHi: 'दैनिक खाद्यान्न खपत रिकॉर्ड, छात्र संख्या वार दूध की मात्रा गणना और मासिक प्रपत्र भरने की आसान एक्सेल शीट व ऑनलाइन टूल उपयोग गाइड।',
    descriptionEn: 'Easy guide on maintaining daily MDM grain consumption, Gopal Bal milk quantity calculations, and online monthly format entries.',
    channelName: 'Primary School Solutions',
    duration: '08:50',
    categoryHi: 'एमडीएम व योजनाएँ',
    categoryEn: 'MDM & Schemes',
    videoId: 'yS1S7z0-T6o',
    videoUrl: 'https://www.youtube.com/watch?v=yS1S7z0-T6o'
  },
  {
    id: 'video-5',
    titleHi: 'बोर्ड परीक्षा सीटिंग प्लान (Seating Arrangement Matrix) कैसे तैयार करें',
    titleEn: 'How to Design Board Exam Seating Arrangement Matrix Online',
    descriptionHi: 'कक्षावार छात्र रोल नंबर के आधार पर परीक्षा सिटिंग प्लान, रोल नंबर स्लिप जनरेशन और ड्यूटी रोस्टर प्रविष्टि की लाइव ट्रेनिंग।',
    descriptionEn: 'Live training on creating classroom exam seating plans, generating roll number slips, and creating teacher duty rosters.',
    channelName: 'Exam Incharge Desk',
    duration: '09:30',
    categoryHi: 'परीक्षा प्रबंधन',
    categoryEn: 'Exam Management',
    videoId: 'qS0Y9y8rIws',
    videoUrl: 'https://www.youtube.com/watch?v=qS0Y9y8rIws'
  },
  {
    id: 'video-6',
    titleHi: 'IFMS 3.0 एम्प्लोयी वेरिफिकेशन एवं सैलरी बिल प्रोग्रेस चेक',
    titleEn: 'IFMS 3.0 Employee Profile Verification & Salary Bill Tracking',
    descriptionHi: 'नए IFMS 3.0 पोर्टल पर शिक्षक प्रोफाइल डेटा का मिलान, सेवानिवृत्ति/जॉइनिंग एंट्री और डीडीओ स्तर पर वेतन बिलों की स्थिति जाँच।',
    descriptionEn: 'How to verify employee profile details, manage joining/relieving, and track monthly salary bills on the new IFMS 3.0 portal.',
    channelName: 'Treasury & Finance Updates',
    duration: '18:15',
    categoryHi: 'IFMS 3.0',
    categoryEn: 'IFMS 3.0',
    videoId: 'UfS-S3vN34Q',
    videoUrl: 'https://www.youtube.com/watch?v=UfS-S3vN34Q'
  },
  {
    id: 'video-7',
    titleHi: 'वार्षिकोत्सव घूमर नृत्य ट्यूटोरियल - विद्यालय सांस्कृतिक कार्यक्रम गाइड',
    titleEn: 'School Cultural Fest Ghoomar Dance Tutorial & Choreography Guide',
    descriptionHi: 'वार्षिकोत्सव एवं राष्ट्रीय पर्वों पर छात्राओं के लिए घूमर नृत्य की सरल स्टेप्स, कोरियोग्राफी और राजस्थानी लोक गीतों पर मंचन निर्देश।',
    descriptionEn: 'Step-by-step choreography tutorial of Rajasthani Ghoomar dance for female students participating in annual functions and cultural festivals.',
    channelName: 'Rajasthan Sanskruti Desk',
    duration: '14:30',
    categoryHi: 'सांस्कृतिक कार्यक्रम',
    categoryEn: 'Cultural Programs',
    videoId: '2S6p7U3_KTo',
    videoUrl: 'https://www.youtube.com/watch?v=2S6p7U3_KTo'
  },
  {
    id: 'video-8',
    titleHi: 'बालिका शिक्षा व जल संरक्षण नाटक - लघु नाटक रिहर्सल एवं स्क्रिप्ट ट्यूटोरियल',
    titleEn: 'Girl Education & Water Conservation Nukkad Natak Tutorial',
    descriptionHi: 'स्कूल प्रार्थना सभा एवं वार्षिकोत्सव हेतु देशभक्ति व सामाजिक कुरीतियों पर लघु नाटक/नुक्कड़ नाटक की लाइव रिहर्सल और स्क्रिप्ट राइटिंग गाइड।',
    descriptionEn: 'Choreography, dialogue delivery and live performance rehearsal tutorial of short street-plays on patriotism and social issues for school assembly.',
    channelName: 'Rajasthan School Theatre',
    duration: '11:20',
    categoryHi: 'सांस्कृतिक कार्यक्रम',
    categoryEn: 'Cultural Programs',
    videoId: '3rS-Wz_2V90',
    videoUrl: 'https://www.youtube.com/watch?v=3rS-Wz_2V90'
  },
  {
    id: 'video-9',
    titleHi: 'पीटीआई व्यायाम प्रदर्शन गाइड - स्कूल पीटी और योग अभ्यास नियम',
    titleEn: 'PTI Drill & Mass PT Performance Guide - Physical Training Rules',
    descriptionHi: 'शारीरिक शिक्षकों हेतु 15 सामूहिक व्यायाम (Mass PT), योगासन एवं स्कूल परेड के संचालन व सीटी निर्देशों की सही तकनीक।',
    descriptionEn: 'Standard guidelines for physical training instructors (PTI) on executing 15 mass physical exercises, yoga, and school parade whistle cues.',
    channelName: 'PTI Drill Master',
    duration: '13:10',
    categoryHi: 'क्रीड़ा व पीटीआई',
    categoryEn: 'Sports & PTI',
    videoId: '8rQ-sS5r2-0',
    videoUrl: 'https://www.youtube.com/watch?v=8rQ-sS5r2-0'
  }
];

export const BlogsView: React.FC<BlogsViewProps> = ({
  lang,
  initialTab = 'guides',
  onSelectCategory,
  onSelectTool,
  onBack
}) => {
  const [activeTab, setActiveTab] = useState<'guides' | 'hub' | 'videos'>(initialTab);
  const [videoSearchQuery, setVideoSearchQuery] = useState('');
  const [selectedVideoCategory, setSelectedVideoCategory] = useState<string>('all');
  
  // Interactive Video Player states
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo>(youtubeVideos[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isTheaterMode, setIsTheaterMode] = useState<boolean>(false);

  const isHi = lang === 'hi';

  // Keep state updated if initialTab changes
  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  // Extract unique video categories
  const videoCategories = useMemo(() => {
    const cats = new Set<string>();
    youtubeVideos.forEach(v => cats.add(v.categoryHi));
    return ['all', ...Array.from(cats)];
  }, []);

  // Filter videos based on search and category
  const filteredVideos = useMemo(() => {
    return youtubeVideos.filter(v => {
      const matchesCategory = selectedVideoCategory === 'all' || v.categoryHi === selectedVideoCategory;
      const q = videoSearchQuery.toLowerCase().trim();
      if (!q) return matchesCategory;

      const titleMatch = v.titleHi.toLowerCase().includes(q) || v.titleEn.toLowerCase().includes(q);
      const descMatch = v.descriptionHi.toLowerCase().includes(q) || v.descriptionEn.toLowerCase().includes(q);
      const channelMatch = v.channelName.toLowerCase().includes(q);

      return matchesCategory && (titleMatch || descMatch || channelMatch);
    });
  }, [videoSearchQuery, selectedVideoCategory]);

  return (
    <div className="space-y-6 animate-fadeIn font-sans">
      
      {/* Premium Header Card */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 text-white p-6 sm:p-8 rounded-3xl border border-emerald-800/60 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-3 max-w-4xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black border border-emerald-400/30">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{isHi ? 'सूचना, शिक्षा एवं टूल मार्गदर्शन' : 'Information, Education & Tool Guides'}</span>
          </div>
          
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-none">
            {isHi ? 'शाला सहायक ब्लॉग व रिसोर्स सेंटर' : 'Shala Sahayak Blogs & Resource Hub'}
          </h1>
          
          <p className="text-xs sm:text-sm text-emerald-200/90 font-medium leading-relaxed max-w-2xl">
            {isHi 
              ? 'शाला दर्पण प्रविष्टि दिशानिर्देश, क्रीड़ा शुल्क प्रपत्र, वेतन मैट्रिक्स मास्टर पिलर गाइड्स और विभागीय लाइव यूट्यूब ट्रेनिंग ट्यूटोरियल।'
              : 'Shala Darpan entries guidelines, sports fee format guides, pay matrix master pillars, and live YouTube departmental video tutorials.'}
          </p>
        </div>
      </div>

      {/* Tabs Switcher Navigation */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-1.5 rounded-2xl shadow-sm gap-1.5">
        <button
          onClick={() => setActiveTab('guides')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-black transition-all cursor-pointer ${
            activeTab === 'guides'
              ? 'bg-emerald-700 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
          }`}
        >
          <HelpCircle className="w-4 h-4 shrink-0" />
          <span>{isHi ? 'सहायता ब्लॉग' : 'Help Guides'}</span>
        </button>

        <button
          onClick={() => setActiveTab('hub')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-black transition-all cursor-pointer ${
            activeTab === 'hub'
              ? 'bg-emerald-700 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
          }`}
        >
          <LayoutGrid className="w-4 h-4 shrink-0" />
          <span>{isHi ? 'मास्टर पिलर हब' : 'Resource Hub'}</span>
        </button>

        <button
          onClick={() => setActiveTab('videos')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-black transition-all cursor-pointer ${
            activeTab === 'videos'
              ? 'bg-emerald-700 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
          }`}
        >
          <Youtube className="w-4 h-4 shrink-0" />
          <span>{isHi ? 'वीडियो ट्यूटोरियल' : 'Video Tutorials'}</span>
        </button>
      </div>

      {/* Active Tab View Rendering */}
      <div className="transition-all duration-300">
        
        {/* TAB 1: HELP GUIDES */}
        {activeTab === 'guides' && (
          <div className="space-y-4">
            <HelpGuidesWidget
              lang={lang}
              onOpenTool={(toolId) => onSelectTool(toolId)}
            />
          </div>
        )}

        {/* TAB 2: RESOURCE HUB */}
        {activeTab === 'hub' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
            <TeacherResourceHub
              lang={lang}
              onSelectCategory={onSelectCategory}
              onSelectTool={onSelectTool}
            />
          </div>
        )}

        {/* TAB 3: YOUTUBE VIDEOS PROFILE */}
        {activeTab === 'videos' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Spotlight Video Player Section */}
            {selectedVideo && (
              <div 
                id="shalaVideoSpotlight"
                className="bg-slate-900 text-white rounded-3xl border border-slate-800 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0"
              >
                {/* Left Column: Player Stage (Aspect 16:9) */}
                <div className="lg:col-span-7 bg-black relative aspect-video flex items-center justify-center">
                  {isPlaying ? (
                    <iframe
                      className="w-full h-full absolute inset-0 border-0"
                      src={`https://www.youtube.com/embed/${selectedVideo.videoId}?autoplay=1&rel=0&modestbranding=1`}
                      title={isHi ? selectedVideo.titleHi : selectedVideo.titleEn}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                      {/* Background thumbnail with blur */}
                      <img 
                        src={`https://img.youtube.com/vi/${selectedVideo.videoId}/hqdefault.jpg`}
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover opacity-40 filter blur-xs"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-slate-950/70" />
                      
                      <div className="relative z-10 space-y-4 max-w-md px-4">
                        <button
                          onClick={() => setIsPlaying(true)}
                          className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-500 hover:scale-105 active:scale-95 transition-all shadow-lg flex items-center justify-center text-white cursor-pointer mx-auto border-none outline-none"
                        >
                          <Play className="w-7 h-7 fill-white text-white ml-1" />
                        </button>
                        <span className="inline-block px-3 py-1 bg-emerald-500/20 text-emerald-300 text-[10px] font-black border border-emerald-400/30 rounded-full uppercase tracking-wider">
                          {isHi ? 'प्रशिक्षण ट्यूटोरियल' : 'Training Tutorial'}
                        </span>
                        <h3 className="text-sm sm:text-base font-extrabold line-clamp-2">
                          {isHi ? selectedVideo.titleHi : selectedVideo.titleEn}
                        </h3>
                        <p className="text-[11px] text-slate-300 leading-relaxed max-w-sm mx-auto">
                          {isHi ? 'इस ट्यूटोरियल को सीधे ऐप में देखने के लिए प्ले बटन दबाएं।' : 'Press play to watch this training tutorial directly within the application.'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column: Detailed Description Panel */}
                <div className="lg:col-span-5 p-5 sm:p-6 flex flex-col justify-between bg-slate-900 border-t lg:border-t-0 lg:border-l border-slate-800 text-left">
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-black px-2.5 py-1 rounded-lg border border-emerald-500/30">
                        {isHi ? selectedVideo.categoryHi : selectedVideo.categoryEn}
                      </span>
                      <span className="bg-slate-850 text-slate-300 text-[10px] font-mono px-2.5 py-1 rounded-lg flex items-center gap-1 border border-slate-800">
                        <Clock className="w-3 h-3 text-emerald-400" />
                        <span>{selectedVideo.duration}</span>
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-bold">
                        <span>{selectedVideo.channelName}</span>
                        <CheckCircle className="w-3.5 h-3.5 fill-emerald-500 text-slate-900" />
                        <span className="text-slate-500">• Verified Creator</span>
                      </div>
                      <h2 className="text-base sm:text-lg font-black text-white leading-snug">
                        {isHi ? selectedVideo.titleHi : selectedVideo.titleEn}
                      </h2>
                      <p className="text-xs text-slate-300 leading-relaxed font-medium">
                        {isHi ? selectedVideo.descriptionHi : selectedVideo.descriptionEn}
                      </p>
                    </div>
                  </div>

                  <div className="pt-5 border-t border-slate-800 mt-5 space-y-3.5">
                    {/* Informational tip box */}
                    <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800 text-[11px] text-slate-400 leading-relaxed font-medium">
                      {isHi ? (
                        <span><strong>शिक्षक टिप:</strong> आप इस वीडियो को पूर्ण स्क्रीन में देखने के लिए मैक्सिमाइज मोड सक्षम कर सकते हैं या गति बढ़ा सकते हैं।</span>
                      ) : (
                        <span><strong>Teacher Tip:</strong> You can maximize this player for distraction-free view or adjust speed inside the video player controls.</span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => setIsTheaterMode(true)}
                        className="flex-1 min-w-[120px] flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 text-xs font-black transition-all cursor-pointer border border-slate-700 outline-none"
                      >
                        <Maximize className="w-3.5 h-3.5" />
                        <span>{isHi ? 'थिएटर मोड' : 'Theater Mode'}</span>
                      </button>
                      
                      <a
                        href={selectedVideo.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 min-w-[120px] flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-400 text-xs font-black transition-all cursor-pointer border border-red-500/20"
                      >
                        <Youtube className="w-3.5 h-3.5 fill-red-500 text-red-500" />
                        <span>{isHi ? 'यूट्यूब पर देखें' : 'Watch on YouTube'}</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Search and filter bar for YouTube Videos */}
            <div className="space-y-3 bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-emerald-600 dark:text-emerald-400" />
                <input
                  type="text"
                  value={videoSearchQuery}
                  onChange={(e) => setVideoSearchQuery(e.target.value)}
                  placeholder={isHi ? "वीडियो विषय, टूल का नाम या चैनल खोजें..." : "Search video topic, tool name or channel..."}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500 outline-none text-xs font-bold text-slate-850 dark:text-slate-100 placeholder:text-slate-400"
                />
                {videoSearchQuery && (
                  <button
                    onClick={() => setVideoSearchQuery('')}
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 border-none bg-transparent cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Video Categories Slider */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                {videoCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedVideoCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                      selectedVideoCategory === cat
                        ? 'bg-emerald-700 text-white shadow-sm'
                        : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {cat === 'all' ? (isHi ? 'सभी वीडियो' : 'All Videos') : cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Videos Grid */}
            {filteredVideos.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredVideos.map((video) => {
                  const isSelected = selectedVideo?.id === video.id;
                  return (
                    <div
                      key={video.id}
                      onClick={() => {
                        setSelectedVideo(video);
                        setIsPlaying(true);
                        // Smoothly scroll to the player spotlight container
                        const el = document.getElementById('shalaVideoSpotlight');
                        if (el) {
                          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }
                      }}
                      className={`bg-white dark:bg-slate-900 rounded-3xl border shadow-sm overflow-hidden flex flex-col group justify-between hover:shadow-md transition-all duration-300 cursor-pointer text-left ${
                        isSelected
                          ? 'border-emerald-500 ring-2 ring-emerald-500/20 dark:ring-emerald-500/45'
                          : 'border-slate-200 dark:border-slate-800 hover:border-emerald-500/45'
                      }`}
                    >
                      {/* Video Thumbnail Image Wrapper */}
                      <div className="aspect-video bg-slate-950 relative flex items-center justify-center overflow-hidden border-b border-slate-200 dark:border-slate-800">
                        <img 
                          src={`https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`}
                          alt={isHi ? video.titleHi : video.titleEn}
                          className="absolute inset-0 w-full h-full object-cover opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                          referrerPolicy="no-referrer"
                        />
                        
                        {/* Dark gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 group-hover:from-black/40 transition-all duration-300" />

                        {/* Play Button Icon */}
                        <div className="absolute inset-0 flex items-center justify-center z-10">
                          <div className={`w-11 h-11 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
                            isSelected && isPlaying
                              ? 'bg-emerald-600 scale-105 text-white'
                              : 'bg-red-600/90 group-hover:bg-red-600 group-hover:scale-110 text-white'
                          }`}>
                            <Play className="w-4 h-4 fill-white text-white ml-0.5" />
                          </div>
                        </div>

                        {/* Video Category Tag */}
                        <span className="absolute top-3 left-3 bg-slate-950/85 backdrop-blur-md text-amber-300 text-[10px] font-black px-2 py-0.5 rounded-md border border-slate-800/40 z-10">
                          {isHi ? video.categoryHi : video.categoryEn}
                        </span>

                        {/* Video Duration Tag */}
                        <span className="absolute bottom-3 right-3 bg-slate-950/85 backdrop-blur-md text-white text-[10px] font-mono px-1.5 py-0.5 rounded-md z-10 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-emerald-400" />
                          <span>{video.duration}</span>
                        </span>
                      </div>

                      {/* Video Content details */}
                      <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                        <div className="space-y-1.5 text-left">
                          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block">
                            {isHi ? 'चैनल:' : 'Channel:'} <span className="text-emerald-700 dark:text-emerald-400 font-extrabold">{video.channelName}</span>
                          </span>
                          
                          <h3 className={`font-extrabold text-xs sm:text-sm leading-snug line-clamp-2 transition-colors ${
                            isSelected
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400'
                          }`}>
                            {isHi ? video.titleHi : video.titleEn}
                          </h3>

                          <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                            {isHi ? video.descriptionHi : video.descriptionEn}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] font-black">
                          <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                            {isSelected && isPlaying ? (
                              <span className="flex items-center gap-1">
                                <span className="flex h-2 w-2 relative">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                </span>
                                <span>{isHi ? 'अभी चल रहा है' : 'Now Playing'}</span>
                              </span>
                            ) : (
                              <span>{isHi ? 'चलाने के लिए क्लिक करें' : 'Click to Play'}</span>
                            )}
                          </span>
                          
                          <span className="text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">
                            {isHi ? 'देखें' : 'Watch'} &rarr;
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-12 text-center text-slate-500 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-3">
                <Tv className="w-12 h-12 text-slate-300 mx-auto" />
                <h4 className="font-bold text-slate-700 dark:text-slate-300">कोई वीडियो ट्यूटोरियल नहीं मिला</h4>
                <p className="text-xs text-slate-400">कृपया भिन्न खोज शब्दों का उपयोग करें या दूसरी श्रेणी चुनें।</p>
                <button
                  onClick={() => {
                    setVideoSearchQuery('');
                    setSelectedVideoCategory('all');
                  }}
                  className="px-4 py-1.5 rounded-xl bg-emerald-700 text-white font-bold text-xs hover:bg-emerald-800 cursor-pointer"
                >
                  रीसेट करें
                </button>
              </div>
            )}

            {/* Immersive Theater Mode Modal Overlay */}
            {isTheaterMode && selectedVideo && (
              <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-md z-50 flex flex-col items-center justify-center p-4 sm:p-6 md:p-10 animate-fadeIn">
                {/* Header Controls */}
                <div className="w-full max-w-5xl flex items-center justify-between pb-4 text-white">
                  <div className="space-y-1 text-left">
                    <span className="bg-emerald-500/25 text-emerald-300 text-[10px] font-black px-2.5 py-0.5 rounded-md border border-emerald-500/20 uppercase tracking-wider">
                      {isHi ? selectedVideo.categoryHi : selectedVideo.categoryEn}
                    </span>
                    <h3 className="text-sm sm:text-base font-extrabold line-clamp-1">
                      {isHi ? selectedVideo.titleHi : selectedVideo.titleEn}
                    </h3>
                  </div>
                  <button
                    onClick={() => setIsTheaterMode(false)}
                    className="p-2 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-all cursor-pointer outline-none"
                    title="Close Theater"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Theater Main Stage */}
                <div className="w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl relative border border-slate-800">
                  <iframe
                    className="w-full h-full absolute inset-0 border-0"
                    src={`https://www.youtube.com/embed/${selectedVideo.videoId}?autoplay=1&rel=0&modestbranding=1`}
                    title={isHi ? selectedVideo.titleHi : selectedVideo.titleEn}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Footer and video description */}
                <div className="w-full max-w-5xl pt-4 text-left text-slate-300 text-xs sm:text-sm font-medium space-y-1">
                  <p className="text-slate-400 font-semibold">
                    {isHi ? 'चैनल:' : 'Channel:'} <span className="text-emerald-400 font-extrabold">{selectedVideo.channelName}</span>
                  </p>
                  <p className="line-clamp-2 text-slate-400 text-xs">
                    {isHi ? selectedVideo.descriptionHi : selectedVideo.descriptionEn}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
};
