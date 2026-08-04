import React from 'react';
import { Share2, Send, MessageSquare, ShieldCheck, FileText, ExternalLink, Sparkles, BookOpen } from 'lucide-react';
import { Language } from '../types';
import { t } from '../utils/i18n';


interface FooterProps {
  lang: Language;
  onOpenFeedback: () => void;
  onNavigate?: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ lang, onOpenFeedback, onNavigate }) => {
  const isHi = lang === 'hi';

  const handleShareApp = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Shala Sahayak (शाला सहायक)',
          text: 'Shala Sahayak - The complete digital toolkit for Rajasthan Education Department personnel!',
          url: window.location.href
        });
      } catch (err) {
        console.log('Share cancelled', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('App link copied to clipboard! Share it with fellow teachers.');
    }
  };

  const handleOpenHindiPdf = () => {
    // Navigate to Shivira / Hindi PDF guidelines section
    window.location.hash = '#shivira';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Mobile Compact Single-Line Footer */}
      <div className="md:hidden w-full py-2.5 px-3 text-center text-[0.7rem] text-slate-500 dark:text-slate-400 bg-transparent border-t border-slate-200/30 dark:border-slate-800/30 app-footer mt-6 mb-2">
        <p className="truncate">
          © {new Date().getFullYear()} Shala Sahayak • {isHi ? 'राजस्थान शिक्षा विभाग डिजिटल सहायिका' : 'Rajasthan Education Dept'}
        </p>
      </div>

      {/* Desktop Full Rich Footer */}
      <footer className="hidden md:block w-full bg-slate-950 text-slate-300 pt-12 pb-8 px-4 sm:px-6 lg:px-8 mt-12 border-t border-slate-800 text-xs app-footer">
        <div className="max-w-7xl mx-auto space-y-10">
          
          {/* Main Website Grid (4 Columns) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Column 1: Brand & Tagline */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2.5 bg-slate-900/90 px-3.5 py-2 rounded-2xl border border-slate-800 w-fit">
                <img src="/logo.svg" alt="Shala Sahayak" className="w-7 h-7 object-contain" />
                <div>
                  <span className="font-black text-sm text-white tracking-wide block">SHALA SAHAYAK</span>
                  <span className="text-[9px] font-bold text-emerald-400 block">SCHOOL ASSISTANT WEB PLATFORM</span>
                </div>
              </div>

              <p className="text-slate-400 leading-relaxed text-xs">
                {isHi
                  ? 'राजस्थान शिक्षा विभाग के शिक्षकों, संस्थाप्रधानों, PEEO व प्रभारियों हेतु डिजिटल पोर्टल, क्रीड़ा शुल्क प्रपत्र, पे-मैट्रिक्स एवं प्रशासनिक सहायिका।'
                  : 'Empowering Rajasthan Education Department staff with authentic digital tools, Krida Shulk Form Maker, Shivira Calendar, and Pay Matrix calculators.'}
              </p>

              
            </div>

            {/* Column 2: Quick Navigation & Tools */}
            <div className="space-y-3">
              <h4 className="font-extrabold text-white text-sm tracking-wide uppercase flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>{isHi ? 'मुख्य मॉड्यूल' : 'Core Modules'}</span>
              </h4>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <a href="/teacher/pti/kridashulk" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                    <span className="text-amber-400">•</span> {isHi ? 'क्रीड़ा शुल्क विवरण प्रपत्र मेकर' : 'Krida Shulk Maker'}
                  </a>
                </li>
                <li>
                  <a href="#peeo" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                    <span className="text-emerald-400">•</span> {isHi ? 'PEEO / DDO प्रशासनिक टूलकिट' : 'PEEO Admin Toolkit'}
                  </a>
                </li>
                <li>
                  <a href="#incharge" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                    <span className="text-blue-400">•</span> {isHi ? 'परीक्षा प्रभारी मॉड्यूल' : 'Exam Incharge Hub'}
                  </a>
                </li>
                <li>
                  <a href="#shivira" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                    <span className="text-purple-400">•</span> {isHi ? 'शिविरा पंचांग एवं अकादमिक कैलेंडर' : 'Shivira Calendar'}
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 3: Departmental Portals */}
            <div className="space-y-3">
              <h4 className="font-extrabold text-white text-sm tracking-wide uppercase flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-emerald-400" />
                <span>{isHi ? 'विभागीय लिंक्स' : 'Official Portals'}</span>
              </h4>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <a href="https://rajshaladarpan.nic.in" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors flex items-center gap-1">
                    <span>शाला दर्पण राजस्थान Portal</span>
                    <ExternalLink className="w-3 h-3 text-slate-500" />
                  </a>
                </li>
                <li>
                  <a href="https://paymanager.raj.nic.in" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors flex items-center gap-1">
                    <span>PayManager / PRI PayManager</span>
                    <ExternalLink className="w-3 h-3 text-slate-500" />
                  </a>
                </li>
                <li>
                  <a href="https://ifms.rajasthan.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors flex items-center gap-1">
                    <span>IFMS 3.0 Portal</span>
                    <ExternalLink className="w-3 h-3 text-slate-500" />
                  </a>
                </li>
                <li>
                  <a href="https://sso.rajasthan.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors flex items-center gap-1">
                    <span>SSO Rajasthan Portal</span>
                    <ExternalLink className="w-3 h-3 text-slate-500" />
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 4: Community & Share with PDF: Hindi Button */}
            <div className="space-y-4">
              <h4 className="font-extrabold text-white text-sm tracking-wide uppercase">
                {isHi ? 'शेयर एवं कम्युनिटी' : 'Share & Connect'}
              </h4>

              {/* Share Link & PDF: Hindi Button Side by Side */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleShareApp}
                  className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center space-x-1.5 shadow-md transition-all active:scale-95 cursor-pointer"
                  title="Share application link"
                >
                  <Share2 className="w-4 h-4" />
                  <span>{isHi ? 'शेयर करें' : 'Share App'}</span>
                </button>

                <button
                  onClick={handleOpenHindiPdf}
                  className="px-3.5 py-2 rounded-xl bg-rose-700 hover:bg-rose-600 text-white font-black text-xs flex items-center space-x-1.5 shadow-md transition-all active:scale-95 border border-rose-500/50 cursor-pointer"
                  title="Hindi PDF Guidelines & Shivira Calendar"
                >
                  <FileText className="w-4 h-4 text-amber-300" />
                  <span>PDF: Hindi</span>
                </button>
              </div>

              <div className="pt-1 flex flex-wrap gap-2">
                <a
                  href="https://t.me/rajasthan_education_news"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs flex items-center space-x-1.5 shadow-md transition-all"
                >
                  <Send className="w-3.5 h-3.5 text-amber-300" />
                  <span>{isHi ? 'टेलीग्राम चैनल' : 'Telegram Channel'}</span>
                </a>

                <button
                  onClick={onOpenFeedback}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors flex items-center space-x-1.5 text-xs font-semibold cursor-pointer"
                  title="Submit Feedback"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-amber-300" />
                  <span>{isHi ? 'सुझाव / सहायता' : 'Feedback'}</span>
                </button>
              </div>
            </div>

          </div>

          {/* Divider & Legal Footer */}
          <div className="border-t border-slate-800/80 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px]">
            <p className="text-slate-500 font-medium text-center md:text-left">
              © {new Date().getFullYear()} Shala Sahayak Web Application • Designed for Rajasthan Education Department Personnel
            </p>

            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 font-bold text-slate-400">
              <a
                href="/privacy-policy"
                onClick={(e) => {
                  if (onNavigate) {
                    e.preventDefault();
                    onNavigate('/privacy-policy');
                  }
                }}
                className="hover:text-emerald-400 transition-colors cursor-pointer"
              >
                {isHi ? 'गोपनीयता नीति' : 'Privacy Policy'}
              </a>
              <span className="text-slate-700">•</span>
              <a
                href="/terms"
                onClick={(e) => {
                  if (onNavigate) {
                    e.preventDefault();
                    onNavigate('/terms');
                  }
                }}
                className="hover:text-emerald-400 transition-colors cursor-pointer"
              >
                {isHi ? 'सेवा की शर्तें' : 'Terms of Service'}
              </a>
              <span className="text-slate-700">•</span>
              <a
                href="/disclaimer"
                onClick={(e) => {
                  if (onNavigate) {
                    e.preventDefault();
                    onNavigate('/disclaimer');
                  }
                }}
                className="hover:text-emerald-400 transition-colors cursor-pointer"
              >
                {isHi ? 'अस्वीकरण' : 'Disclaimer'}
              </a>
              <span className="text-slate-700">•</span>
              <a
                href="/about-us"
                onClick={(e) => {
                  if (onNavigate) {
                    e.preventDefault();
                    onNavigate('/about-us');
                  }
                }}
                className="hover:text-emerald-400 transition-colors cursor-pointer"
              >
                {isHi ? 'हमारे बारे में' : 'About Us'}
              </a>
              <span className="text-slate-700">•</span>
              <a
                href="/contact-us"
                onClick={(e) => {
                  if (onNavigate) {
                    e.preventDefault();
                    onNavigate('/contact-us');
                  }
                }}
                className="hover:text-emerald-400 transition-colors cursor-pointer"
              >
                {isHi ? 'संपर्क करें' : 'Contact Us'}
              </a>
            </div>
          </div>

        </div>
      </footer>
    </>
  );
};
