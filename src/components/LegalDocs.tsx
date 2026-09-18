import React, { useState } from 'react';
import { Shield, FileText, AlertTriangle, ArrowLeft } from 'lucide-react';
import { Language } from '../types';

interface LegalDocsProps {
  lang: Language;
  onBack: () => void;
  initialTab?: 'privacy' | 'terms' | 'disclaimer';
}

export const LegalDocs: React.FC<LegalDocsProps> = ({ lang, onBack, initialTab = 'privacy' }) => {
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms' | 'disclaimer'>(initialTab);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-card-entrance">
      {/* Back Button and Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <button
          onClick={onBack}
          className="inline-flex items-center space-x-2 text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors w-fit"
          id="legal-back-btn"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{lang === 'hi' ? 'मुख्य डैशबोर्ड' : 'Back to Dashboard'}</span>
        </button>

        <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
          {lang === 'hi' ? 'कानूनी एवं नीति दस्तावेज' : 'Legal & Compliance Documents'}
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Navigation Sidebar */}
        <div className="md:col-span-1 flex flex-col space-y-2">
          <button
            onClick={() => setActiveTab('privacy')}
            className={`flex items-center space-x-2.5 px-4 py-3 rounded-2xl text-sm font-bold transition-all text-left ${
              activeTab === 'privacy'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/10'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            id="legal-tab-privacy"
          >
            <Shield className="w-4 h-4 shrink-0" />
            <span>{lang === 'hi' ? 'गोपनीयता नीति' : 'Privacy Policy'}</span>
          </button>

          <button
            onClick={() => setActiveTab('terms')}
            className={`flex items-center space-x-2.5 px-4 py-3 rounded-2xl text-sm font-bold transition-all text-left ${
              activeTab === 'terms'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/10'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            id="legal-tab-terms"
          >
            <FileText className="w-4 h-4 shrink-0" />
            <span>{lang === 'hi' ? 'सेवा की शर्तें' : 'Terms of Service'}</span>
          </button>

          <button
            onClick={() => setActiveTab('disclaimer')}
            className={`flex items-center space-x-2.5 px-4 py-3 rounded-2xl text-sm font-bold transition-all text-left ${
              activeTab === 'disclaimer'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/10'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            id="legal-tab-disclaimer"
          >
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{lang === 'hi' ? 'अस्वीकरण' : 'Disclaimer'}</span>
          </button>
        </div>

        {/* Document Content Display */}
        <div className="md:col-span-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm">
          {activeTab === 'privacy' && (
            <div className="space-y-6 animate-card-entrance" id="legal-content-privacy">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                <h2 className="text-xl font-black text-slate-900 dark:text-white">Privacy Policy</h2>
                <p className="text-xs text-slate-400 mt-1">Last Updated: August 2, 2026</p>
              </div>

              <div className="prose prose-slate dark:prose-invert max-w-none text-sm leading-relaxed text-slate-600 dark:text-slate-300 space-y-4">
                <p>
                  At <strong>Shala Sahayak (शाला सहायक)</strong>, accessible from <a href="https://shalasahayak.in" class="text-emerald-600 dark:text-emerald-400 hover:underline">https://shalasahayak.in</a>, our main priority is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Shala Sahayak and how we use it.
                </p>

                <h3 class="font-bold text-slate-800 dark:text-slate-100 text-base mt-6">Consent</h3>
                <p>
                  By using our website, you hereby consent to our Privacy Policy and agree to its terms. हमारी वेबसाइट या मोबाइल ऐप का उपयोग करके, आप हमारी गोपनीयता नीति और इसकी शर्तों से सहमत होते हैं।
                </p>

                <h3 class="font-bold text-slate-800 dark:text-slate-100 text-base mt-6">Information We Collect</h3>
                <p>
                  Shala Sahayak is designed to operate 100% offline and client-side to ensure maximum security for your official data.
                </p>
                <ul class="list-disc pl-5 space-y-2">
                  <li><strong>Local Storage State:</strong> All calculations, teacher records, school profiles, seating arrangements, and forms you fill in are saved directly in your browser's local storage (Local Browser Storage). We do not transmit or store this sensitive data on our servers.</li>
                  <li><strong>Log Files:</strong> Shala Sahayak follows a standard procedure of using log files. These files log visitors when they visit websites. The information collected by log files includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks.</li>
                </ul>

                <h3 class="font-bold text-slate-800 dark:text-slate-100 text-base mt-6">Google AdSense & AdMob Compliance</h3>
                <p>
                  Google is one of the third-party vendors on our site. It uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to our site and other sites on the internet.
                </p>
                <p>
                  हम अपने प्लेटफॉर्म पर विज्ञापन दिखाने के लिए तृतीय-पक्ष विज्ञापन कंपनियों (जैसे Google AdSense और AdMob) का उपयोग कर सकते हैं। ये कंपनियां विज्ञापन की प्रभावशीलता मापने और आपकी रुचि के अनुसार विज्ञापन दिखाने के लिए कुकीज़ (Cookies) का उपयोग करती हैं।
                </p>
                <div className="bg-amber-50 dark:bg-amber-950/20 border-l-4 border-amber-500 p-4 rounded-r-2xl my-4 text-xs text-amber-900 dark:text-amber-200">
                  <p class="font-semibold mb-1">Opting Out of Personalised Advertising:</p>
                  <p>
                    Visitors may choose to decline the use of DART cookies by visiting the Google Ad and Content Network Privacy Policy at: 
                    <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" class="text-emerald-700 dark:text-emerald-400 underline font-semibold ml-1">Google Ads Policy</a>.
                  </p>
                </div>

                <h3 class="font-bold text-slate-800 dark:text-slate-100 text-base mt-6">Our Advertising Partners</h3>
                <p>
                  Some of advertisers on our site may use cookies and web beacons. Our advertising partners include Google AdSense and Google AdMob. Each partner has their own Privacy Policy on user data.
                </p>

                <h3 class="font-bold text-slate-800 dark:text-slate-100 text-base mt-6">Contact us</h3>
                <p>
                  If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact us at: <span class="font-semibold text-slate-800 dark:text-slate-200">mobographie@gmail.com</span>
                </p>
              </div>
            </div>
          )}

          {activeTab === 'terms' && (
            <div className="space-y-6 animate-card-entrance" id="legal-content-terms">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                <h2 className="text-xl font-black text-slate-900 dark:text-white">Terms of Service</h2>
                <p className="text-xs text-slate-400 mt-1">Last Updated: August 2, 2026</p>
              </div>

              <div className="prose prose-slate dark:prose-invert max-w-none text-sm leading-relaxed text-slate-600 dark:text-slate-300 space-y-4">
                <p>
                  Welcome to Shala Sahayak! These terms of service outline the rules and regulations for the use of Shala Sahayak's Website, located at <a href="https://shalasahayak.in" class="text-emerald-600 dark:text-emerald-400 hover:underline">https://shalasahayak.in</a>.
                </p>

                <p>
                  By accessing this website, we assume you accept these terms and conditions. Do not continue to use Shala Sahayak if you do not agree to take all of the terms and conditions stated on this page.
                </p>

                <h3 class="font-bold text-slate-800 dark:text-slate-100 text-base mt-6">Cookies</h3>
                <p>
                  We employ the use of cookies. By accessing Shala Sahayak, you agreed to use cookies in agreement with the Shala Sahayak's Privacy Policy. Cookies are used by our website to enable the functionality of certain areas to make it easier for people visiting our website.
                </p>

                <h3 class="font-bold text-slate-800 dark:text-slate-100 text-base mt-6">Intellectual Property Rights</h3>
                <p>
                  Unless otherwise stated, Shala Sahayak and/or its licensors own the intellectual property rights for all material on Shala Sahayak. All intellectual property rights are reserved. You may access this from Shala Sahayak for your own personal and official school use subjected to restrictions set in these terms and conditions.
                </p>
                <p className="font-semibold">You must not:</p>
                <ul class="list-disc pl-5 space-y-1">
                  <li>Republish material or tools from Shala Sahayak on other paid platforms.</li>
                  <li>Sell, rent, or sub-license calculators from Shala Sahayak.</li>
                  <li>Reproduce, duplicate or copy material from Shala Sahayak for commercial resale.</li>
                </ul>

                <h3 class="font-bold text-slate-800 dark:text-slate-100 text-base mt-6">Limitation of Liability</h3>
                <p>
                  In no event shall Shala Sahayak, nor any of its creators, contributors or administrators, be held liable for anything arising out of or in any way connected with your use of this Website.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'disclaimer' && (
            <div className="space-y-6 animate-card-entrance" id="legal-content-disclaimer">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                <h2 className="text-xl font-black text-slate-900 dark:text-white">Disclaimer</h2>
                <p className="text-xs text-slate-400 mt-1">Last Updated: August 2, 2026</p>
              </div>

              <div className="prose prose-slate dark:prose-invert max-w-none text-sm leading-relaxed text-slate-600 dark:text-slate-300 space-y-4">
                <p>
                  The tools, calculators, salary matrices, pay fixation sheets, MDM logs, and timetables generated on Shala Sahayak are designed as auxiliary digital helpers for educational purposes in Rajasthan schools.
                </p>

                <div className="bg-emerald-50 dark:bg-emerald-950/20 border-l-4 border-emerald-500 p-4 rounded-r-2xl my-4 text-xs text-emerald-900 dark:text-emerald-200">
                  <p class="font-bold mb-1">विभागीय अस्वीकरण (Official Advisory):</p>
                  <p>
                    कैलकुलेटर, वेतन स्थिरीकरण (7th Pay Matrix Rules) और मिड-डे मील रजिस्टर सटीक राजस्थान विभागीय नियमों पर आधारित हैं, फिर भी अंतिम उपयोग से पहले विभाग के आधिकारिक परिपत्रों (Shivira circulars) एवं शाला दर्पण पोर्टल डेटा से इसका मिलान अवश्य कर लें। किसी भी तकनीकी त्रुटि या विसंगति के लिए Shala Sahayak उत्तरदायी नहीं होगा।
                  </p>
                </div>

                <h3 class="font-bold text-slate-800 dark:text-slate-100 text-base mt-6">"As-Is" and "As-Available"</h3>
                <p>
                  All information and tools on Shala Sahayak are provided on an "as-is" basis, without any warranty, express or implied. We do not guarantee that the site or its tools will run completely uninterrupted or error-free at all times.
                </p>

                <h3 class="font-bold text-slate-800 dark:text-slate-100 text-base mt-6">Contact For Modifications</h3>
                <p>
                  If you identify any calculations or rules that need to be updated according to the latest Shivira orders, please email us directly with official references at: <span class="font-bold text-slate-800 dark:text-slate-200">mobographie@gmail.com</span>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
