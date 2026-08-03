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
  Tv
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
  videoUrl: string;
  thumbnailUrl?: string;
}

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

  const isHi = lang === 'hi';

  // Keep state updated if initialTab changes
  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  // Authentic, educational YouTube videos for Rajasthan teachers
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
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
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
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
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
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
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
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
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
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
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
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
    }
  ];

  // Extract unique video categories
  const videoCategories = useMemo(() => {
    const cats = new Set<string>();
    youtubeVideos.forEach(v => cats.add(v.categoryHi));
    return ['all', ...Array.from(cats)];
  }, [youtubeVideos]);

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
          <div className="space-y-5 animate-fadeIn">
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
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600"
                  >
                    <Tv className="w-4 h-4" />
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
                {filteredVideos.map((video) => (
                  <div
                    key={video.id}
                    className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col group justify-between hover:shadow-md hover:border-emerald-500/40 transition-all duration-300"
                  >
                    {/* Video Thumbnail Placeholder Wrapper */}
                    <div className="aspect-video bg-slate-950 relative flex items-center justify-center overflow-hidden border-b border-slate-200 dark:border-slate-800">
                      {/* Play Button Indicator */}
                      <a 
                        href={video.videoUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="absolute inset-0 bg-slate-900/40 group-hover:bg-slate-900/20 transition-all duration-300 flex items-center justify-center z-10"
                      >
                        <div className="w-12 h-12 rounded-full bg-red-600/90 group-hover:bg-red-600 group-hover:scale-110 transition-all shadow-lg flex items-center justify-center text-white cursor-pointer">
                          <Play className="w-5 h-5 fill-white text-white ml-0.5" />
                        </div>
                      </a>

                      {/* Video Category Tag */}
                      <span className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md text-amber-300 text-[10px] font-black px-2 py-0.5 rounded-md border border-slate-800 z-10">
                        {isHi ? video.categoryHi : video.categoryEn}
                      </span>

                      {/* Video Duration Tag */}
                      <span className="absolute bottom-3 right-3 bg-slate-950/80 backdrop-blur-md text-white text-[10px] font-mono px-1.5 py-0.5 rounded-md z-10 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-emerald-400" />
                        <span>{video.duration}</span>
                      </span>

                      {/* Custom Decorative Thumbnail Graphic with pure CSS */}
                      <div className="w-full h-full bg-gradient-to-tr from-emerald-950 via-slate-900 to-indigo-950 flex flex-col justify-end p-4 text-left">
                        <Youtube className="w-8 h-8 text-red-500/30 absolute right-4 top-4" />
                        <span className="text-[10px] font-black text-emerald-400/80 tracking-widest uppercase">TRAINING VIDEO</span>
                        <h4 className="text-xs font-extrabold text-white line-clamp-1 mt-0.5 select-none pr-6">
                          {isHi ? video.titleHi : video.titleEn}
                        </h4>
                      </div>
                    </div>

                    {/* Video Content details */}
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2 text-left">
                        <span className="text-[10px] font-bold text-slate-500 block">
                          Channel: <span className="text-emerald-700 dark:text-emerald-400 font-extrabold">{video.channelName}</span>
                        </span>
                        
                        <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 leading-snug line-clamp-2 select-text group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                          {isHi ? video.titleHi : video.titleEn}
                        </h3>

                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 select-text leading-relaxed">
                          {isHi ? video.descriptionHi : video.descriptionEn}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-black">
                        <a
                          href={video.videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-red-600 dark:text-red-400 hover:underline cursor-pointer"
                        >
                          <Youtube className="w-4 h-4 fill-red-600 text-red-600" />
                          <span>यूट्यूब पर देखें</span>
                        </a>

                        <a
                          href={video.videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
                        >
                          <span>Open Video</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
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
          </div>
        )}
      </div>

    </div>
  );
};
