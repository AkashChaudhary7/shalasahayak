import React, { useState } from 'react';
import { Language, SchoolProfile } from '../types';
import { ArrowLeft, Printer, Share2, Sparkles, Calendar, UserCheck, FileText, Check, Flag, Award, Heart, LayoutGrid, Trophy, GraduationCap, Edit3, ChevronRight, ShieldCheck, School } from 'lucide-react';
import { ThreeDCard } from './ThreeDIcon';

interface InvitationMakerProps {
  schoolProfile: SchoolProfile;
  lang: Language;
  onBack: () => void;
  initialTemplate?: InvitationTemplate;
}

export type InvitationTemplate = 'independence' | 'republic' | 'ptm' | 'annual' | 'admission' | 'sports';

export const InvitationMaker: React.FC<InvitationMakerProps> = ({
  schoolProfile,
  lang,
  onBack,
  initialTemplate
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'editor'>(initialTemplate ? 'editor' : 'grid');
  const [selectedTemplate, setSelectedTemplate] = useState<InvitationTemplate>(initialTemplate || 'independence');

  // Form states
  const [eventTitle, setEventTitle] = useState('79वां स्वतंत्रता दिवस समारोह 2026');
  const [eventDate, setEventDate] = useState('15 अगस्त 2026');
  const [eventTime, setEventTime] = useState('प्रातः 08:00 बजे ध्वजारोहण');
  const [venue, setVenue] = useState(schoolProfile.schoolNameHindi || schoolProfile.schoolName);
  const [chiefGuest, setChiefGuest] = useState('श्रीमान सरपंच महोदय / क्षेत्र जन-प्रतिनिधि');
  const [invitationMessage, setInvitationMessage] = useState(
    'राष्ट्रीय पर्व स्वतंत्रता दिवस के पावन अवसर पर ध्वजारोहण एवं देशभक्तिपूर्ण सांस्कृतिक कार्यक्रमों हेतु आप सभी ग्रामवासी, अभिभावक व नागरिक सहर्ष आमंत्रित हैं।'
  );
  const [copied, setCopied] = useState(false);
  const [patrioticMotto, setPatrioticMotto] = useState('जय हिन्द ! वन्दे मातरम् !');

  // Confirmation modal state before triggering print
  const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);
  const [userConfirmedReview, setUserConfirmedReview] = useState<boolean>(false);

  const requestPrint = () => {
    setUserConfirmedReview(false);
    setShowConfirmDialog(true);
  };

  const executePrint = () => {
    setShowConfirmDialog(false);
    setTimeout(() => {
      handlePrintPDF();
    }, 150);
  };

  React.useEffect(() => {
    if (initialTemplate) {
      selectTemplate(initialTemplate);
    }
  }, [initialTemplate]);

  const selectTemplate = (type: InvitationTemplate) => {
    setSelectedTemplate(type);
    setViewMode('editor');

    if (type === 'independence') {
      setEventTitle('79वां स्वतंत्रता दिवस समारोह 2026');
      setEventDate('15 अगस्त 2026');
      setEventTime('प्रातः 08:00 बजे ध्वजारोहण');
      setChiefGuest('मुख्य अतिथि: श्रीमान सरपंच / क्षेत्र जन-प्रतिनिधि');
      setInvitationMessage('राष्ट्रीय पर्व स्वतंत्रता दिवस के पावन अवसर पर ध्वजारोहण एवं देशभक्तिपूर्ण सांस्कृतिक कार्यक्रमों हेतु आप सभी ग्रामवासी, अभिभावक व नागरिक सहर्ष आमंत्रित हैं।');
    } else if (type === 'republic') {
      setEventTitle('77वां गणतंत्र दिवस समारोह 2026');
      setEventDate('26 जनवरी 2026');
      setEventTime('प्रातः 08:15 बजे ध्वजारोहण');
      setChiefGuest('मुख्य अतिथि: श्रीमान उप-सरपंच / वरिष्ठ शिक्षाविद');
      setInvitationMessage('गणतंत्र दिवस के राष्ट्रीय पर्व पर राष्ट्रध्वज वंदन, अनुशासित परेड, देशभक्ति गीत एवं प्रतिभावान छात्र-छात्राओं का सम्मान समारोह आयोजित किया जाएगा।');
    } else if (type === 'ptm') {
      setEventTitle('मेगा शिक्षक-अभिभावक बैठक (Mega PTM)');
      setEventDate('20 अगस्त 2026');
      setEventTime('प्रातः 10:00 बजे से दोपहर 01:00 बजे तक');
      setChiefGuest('अध्यक्षता: अध्यक्ष विद्यालय विकास एवं प्रबंध समिति (SMC/SDMC)');
      setInvitationMessage('विद्यार्थी की शैक्षणिक प्रगति, प्रथम परख परिणाम, पाक्षिक उपस्थिति एवं समग्र व्यक्तित्व विकास पर विचार-विमर्श हेतु सभी अभिभावकों की उपस्थिति प्रार्थनीय है।');
    } else if (type === 'annual') {
      setEventTitle('वार्षिक पारितोषिक वितरण एवं सांस्कृतिक संध्या');
      setEventDate('05 मार्च 2026');
      setEventTime('सायं 05:00 बजे से');
      setChiefGuest('मुख्य अतिथि: माननीय जिला शिक्षा अधिकारी (मुख्यालय)');
      setInvitationMessage('विद्यालय के मेधावी विद्यार्थियों के सम्मान समारोह एवं छात्र-छात्राओं द्वारा प्रस्तुत रंगारंग सांस्कृतिक संध्या में पधारकर बच्चों का उत्साहवर्धन करें।');
    } else if (type === 'admission') {
      setEventTitle('प्रवेश उत्सव एवं नव-प्रवेशित छात्र अभिनंदन');
      setEventDate('01 जुलाई 2026');
      setEventTime('प्रातः 09:00 बजे');
      setChiefGuest('अध्यक्षता: पीईईओ / प्रधानाचार्य');
      setInvitationMessage('शैक्षणिक सत्र 2026-27 हेतु नव-प्रवेशित विद्यार्थियों का रोली-टीका लगाकर स्वागत एवं निःशुल्क पाठ्यपुस्तक वितरण समारोह आयोजित किया जा रहा है।');
    } else if (type === 'sports') {
      setEventTitle('वार्षिक खेलकूद प्रतियोगिता एवं पीटीआई स्पोर्ट्स मीट');
      setEventDate('14 नवंबर 2026');
      setEventTime('प्रातः 08:30 बजे');
      setChiefGuest('मुख्य अतिथि: जिला खेल अधिकारी / शारीरिक शिक्षक संघ');
      setInvitationMessage('बाल दिवस के अवसर पर अंतर्विद्यालयी खेलकूद, दौड़, कबड्डी एवं योग प्रदर्शन हेतु आप सभी खेल प्रेमी एवं नागरिक सादर आमंत्रित हैं।');
    }
  };

  const handlePrintPDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      const printContents = document.getElementById('invitation-card-preview')?.innerHTML;
      if (printContents) {
        const originalContents = document.body.innerHTML;
        document.body.innerHTML = `<div style="padding: 20px; display: flex; justify-content: center;">${printContents}</div>`;
        window.print();
        document.body.innerHTML = originalContents;
        window.location.reload();
      } else {
        window.print();
      }
      return;
    }

    const isPatriotic = selectedTemplate === 'independence' || selectedTemplate === 'republic';

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${eventTitle} - निमंत्रण पत्र</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Tiro+Devanagari+Hindi:ital@0;1&family=Poppins:wght@600;800&display=swap');
            
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body {
              font-family: 'Tiro Devanagari Hindi', serif, sans-serif;
              background-color: #f1f5f9;
              padding: 30px;
              color: #0f172a;
              display: flex;
              justify-content: center;
            }

            .card-wrapper {
              width: 100%;
              max-width: 680px;
              background: #ffffff;
              border-radius: 24px;
              overflow: hidden;
              box-shadow: 0 15px 35px rgba(0,0,0,0.12);
              border: 3px solid ${
                selectedTemplate === 'independence' ? '#ff9933' :
                selectedTemplate === 'republic' ? '#000080' :
                selectedTemplate === 'ptm' ? '#4f46e5' :
                selectedTemplate === 'annual' ? '#9d174d' :
                selectedTemplate === 'admission' ? '#047857' : '#c2410c'
              };
              position: relative;
            }

            /* Flag Strip top for Patriotic Themes */
            .flag-top-bar {
              height: 14px;
              background: linear-gradient(to right, #FF9933 33.33%, #FFFFFF 33.33%, #FFFFFF 66.66%, #138808 66.66%);
              border-bottom: 1px solid #cbd5e1;
            }

            .card-header {
              padding: 24px 30px 15px 30px;
              text-align: center;
              background: ${
                selectedTemplate === 'independence' ? 'linear-gradient(135deg, #fff7ed 0%, #fff 100%)' :
                selectedTemplate === 'republic' ? 'linear-gradient(135deg, #eff6ff 0%, #fff 100%)' :
                selectedTemplate === 'ptm' ? 'linear-gradient(135deg, #e0e7ff 0%, #fff 100%)' :
                selectedTemplate === 'annual' ? 'linear-gradient(135deg, #fce7f3 0%, #fff 100%)' :
                selectedTemplate === 'admission' ? 'linear-gradient(135deg, #ecfdf5 0%, #fff 100%)' :
                'linear-gradient(135deg, #ffedd5 0%, #fff 100%)'
              };
              border-bottom: 2px dashed #cbd5e1;
            }

            .gov-title {
              font-size: 13px;
              font-weight: 800;
              letter-spacing: 1.5px;
              color: #475569;
              text-transform: uppercase;
            }

            .school-heading {
              font-size: 22px;
              font-weight: 900;
              color: ${
                selectedTemplate === 'independence' ? '#9a3412' :
                selectedTemplate === 'republic' ? '#000080' :
                selectedTemplate === 'ptm' ? '#3730a3' :
                selectedTemplate === 'annual' ? '#831843' :
                selectedTemplate === 'admission' ? '#065f46' : '#9a3412'
              };
              margin: 6px 0;
              line-height: 1.3;
            }

            .udise-line {
              font-size: 12px;
              color: #64748b;
              font-family: sans-serif;
            }

            .badge-banner {
              display: inline-block;
              margin: 16px 0 10px 0;
              padding: 8px 24px;
              border-radius: 50px;
              font-size: 18px;
              font-weight: 900;
              color: #ffffff;
              background: ${
                selectedTemplate === 'independence' ? 'linear-gradient(to right, #FF9933, #d97706, #138808)' :
                selectedTemplate === 'republic' ? 'linear-gradient(to right, #000080, #1e40af, #047857)' :
                selectedTemplate === 'ptm' ? 'linear-gradient(to right, #4f46e5, #4338ca)' :
                selectedTemplate === 'annual' ? 'linear-gradient(to right, #be185d, #9d174d)' :
                selectedTemplate === 'admission' ? 'linear-gradient(to right, #059669, #047857)' :
                'linear-gradient(to right, #ea580c, #c2410c)'
              };
              box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            }

            .event-main-title {
              font-size: 20px;
              font-weight: 900;
              margin-top: 8px;
              color: ${isPatriotic ? '#000080' : '#1e293b'};
            }

            .card-body {
              padding: 24px 30px;
              position: relative;
              background: #ffffff;
            }

            /* Watermark Chakra */
            .watermark {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              opacity: 0.06;
              pointer-events: none;
            }

            .invitation-msg {
              font-size: 16px;
              line-height: 1.8;
              text-align: center;
              color: #334155;
              margin-bottom: 24px;
              font-style: italic;
              position: relative;
              z-index: 2;
            }

            .details-box {
              background: ${
                selectedTemplate === 'independence' ? '#fff7ed' :
                selectedTemplate === 'republic' ? '#f0f9ff' :
                selectedTemplate === 'ptm' ? '#f5f3ff' :
                selectedTemplate === 'annual' ? '#fdf2f8' :
                selectedTemplate === 'admission' ? '#ecfdf5' : '#fff7ed'
              };
              border: 1.5px solid ${
                selectedTemplate === 'independence' ? '#ffedd5' :
                selectedTemplate === 'republic' ? '#bae6fd' :
                selectedTemplate === 'ptm' ? '#ddd6fe' :
                selectedTemplate === 'annual' ? '#fbcfe8' :
                selectedTemplate === 'admission' ? '#a7f3d0' : '#ffedd5'
              };
              border-radius: 16px;
              padding: 18px 22px;
              margin-bottom: 24px;
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 12px 20px;
              position: relative;
              z-index: 2;
            }

            .detail-row {
              font-size: 14px;
              color: #1e293b;
            }

            .detail-label {
              font-weight: 900;
              color: ${
                selectedTemplate === 'independence' ? '#c2410c' :
                selectedTemplate === 'republic' ? '#0369a1' :
                selectedTemplate === 'ptm' ? '#4338ca' :
                selectedTemplate === 'annual' ? '#9d174d' :
                selectedTemplate === 'admission' ? '#047857' : '#c2410c'
              };
            }

            .footer-section {
              display: flex;
              justify-content: space-between;
              align-items: flex-end;
              padding-top: 16px;
              border-top: 2px dashed #e2e8f0;
              font-size: 14px;
              position: relative;
              z-index: 2;
            }

            .footer-left { text-align: left; font-weight: bold; }
            .footer-right { text-align: right; font-weight: bold; }

            .flag-bottom-bar {
              height: 12px;
              background: linear-gradient(to right, #FF9933 33.33%, #FFFFFF 33.33%, #FFFFFF 66.66%, #138808 66.66%);
            }

            @media print {
              body { background: none; padding: 0; }
              .card-wrapper { box-shadow: none; max-width: 100%; border-radius: 0; }
            }
          </style>
        </head>
        <body>
          <div class="card-wrapper" style="position: relative;">
            ${isPatriotic ? '<div class="flag-top-bar"></div>' : ''}
            
            ${isPatriotic ? `
              <!-- Corner Tricolor Ribbons for Printable Card -->
              <div style="position: absolute; top: 0; left: 0; width: 80px; height: 80px; overflow: hidden; pointer-events: none; z-index: 20;">
                <div style="position: absolute; top: 12px; left: -26px; width: 120px; height: 16px; background-color: #FF9933; transform: rotate(-45deg); box-shadow: 0 1px 3px rgba(0,0,0,0.15);"></div>
                <div style="position: absolute; top: 24px; left: -34px; width: 120px; height: 16px; background-color: #FFFFFF; transform: rotate(-45deg); border-top: 1px solid #cbd5e1; border-bottom: 1px solid #cbd5e1;"></div>
                <div style="position: absolute; top: 36px; left: -42px; width: 120px; height: 16px; background-color: #138808; transform: rotate(-45deg); box-shadow: 0 1px 3px rgba(0,0,0,0.15);"></div>
              </div>
              <div style="position: absolute; top: 0; right: 0; width: 80px; height: 80px; overflow: hidden; pointer-events: none; z-index: 20;">
                <div style="position: absolute; top: 12px; right: -26px; width: 120px; height: 16px; background-color: #138808; transform: rotate(45deg); box-shadow: 0 1px 3px rgba(0,0,0,0.15);"></div>
                <div style="position: absolute; top: 24px; right: -34px; width: 120px; height: 16px; background-color: #FFFFFF; transform: rotate(45deg); border-top: 1px solid #cbd5e1; border-bottom: 1px solid #cbd5e1;"></div>
                <div style="position: absolute; top: 36px; right: -42px; width: 120px; height: 16px; background-color: #FF9933; transform: rotate(45deg); box-shadow: 0 1px 3px rgba(0,0,0,0.15);"></div>
              </div>
            ` : ''}
            
            <div class="card-header">
              <div class="gov-title">राजस्थान सरकार - शिक्षा विभाग</div>
              <div class="school-heading">${schoolProfile.schoolNameHindi || schoolProfile.schoolName}</div>
              <div class="udise-line">यू-डाइस कोड: ${schoolProfile.udiseCode} | ब्लॉक: ${schoolProfile.block} (${schoolProfile.district})</div>
              
              <div class="badge-banner">
                ${isPatriotic ? '🇮🇳 निमंत्रण पत्र 🇮🇳' : '|| निमंत्रण पत्र ||'}
              </div>
              ${isPatriotic ? `<div style="font-size: 15px; font-weight: 900; color: #e056fd; color: #ff9933; margin: 6px 0; font-style: italic; letter-spacing: 1px; text-shadow: 1px 1px 0px rgba(0,0,0,0.05); text-align: center;">${patrioticMotto}</div>` : ''}
              <div class="event-main-title">${eventTitle}</div>
            </div>

            <div class="card-body">
              ${isPatriotic ? `
                <svg class="watermark" width="220" height="220" viewBox="0 0 100 100" fill="none" stroke="#000080">
                  <circle cx="50" cy="50" r="45" stroke-width="3"/>
                  <circle cx="50" cy="50" r="8" fill="#000080"/>
                  ${Array.from({ length: 24 }).map((_, i) => `
                    <line x1="50" y1="50" x2="${50 + 42 * Math.cos((i * 15 * Math.PI) / 180)}" y2="${50 + 42 * Math.sin((i * 15 * Math.PI) / 180)}" stroke-width="1.5"/>
                  `).join('')}
                </svg>
              ` : ''}

              <div class="invitation-msg">
                "${invitationMessage}"
              </div>

              <div class="details-box">
                <div class="detail-row"><span class="detail-label">दिनांक:</span> ${eventDate}</div>
                <div class="detail-row"><span class="detail-label">समय:</span> ${eventTime}</div>
                <div class="detail-row" style="grid-column: span 2;"><span class="detail-label">स्थान:</span> ${venue}</div>
                ${chiefGuest && chiefGuest.trim() ? `<div class="detail-row" style="grid-column: span 2;"><span class="detail-label">मुख्य अतिथि:</span> ${chiefGuest}</div>` : ''}
              </div>

              <div class="footer-section">
                <div class="footer-left">
                  विनीत:<br>
                  <span style="font-weight: normal; color: #64748b;">समस्त विद्यालय परिवार व विद्यार्थी</span>
                </div>
                <div class="footer-right">
                  दर्शनाभिलाषी:<br>
                  <span style="color: #0f172a;">${schoolProfile.principalName}</span><br>
                  <span style="font-weight: normal; color: #64748b; font-size: 12px;">(पीईईओ / प्रधानाचार्य)</span>
                </div>
              </div>
            </div>

            ${isPatriotic ? '<div class="flag-bottom-bar"></div>' : ''}
          </div>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleShareText = () => {
    const guestLine = chiefGuest && chiefGuest.trim() ? `*मुख्य अतिथि:* ${chiefGuest}\n` : '';
    const text = `*आमंत्रण पत्र - ${schoolProfile.schoolNameHindi || schoolProfile.schoolName}*\n\n*कार्यक्रम:* ${eventTitle}\n*दिनांक:* ${eventDate}\n*समय:* ${eventTime}\n*स्थान:* ${venue}\n${guestLine}\n${invitationMessage}\n\n*निवेदक:* ${schoolProfile.principalName} (पीईईओ/प्रधानाचार्य)`;
    if (navigator.share) {
      navigator.share({ title: eventTitle, text }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // Dynamic preview styling variables based on selected format
  const getThemeStyles = () => {
    switch (selectedTemplate) {
      case 'independence':
        return {
          cardBg: 'bg-gradient-to-b from-amber-500/15 via-white to-emerald-500/15 dark:from-amber-950/40 dark:via-slate-900 dark:to-emerald-950/40',
          borderStyle: 'border-2 border-amber-500/60 dark:border-amber-600/60',
          bannerBg: 'bg-gradient-to-r from-[#FF9933] via-amber-500 to-[#138808] text-white shadow-md',
          accentText: 'text-orange-800 dark:text-amber-300',
          boxBg: 'bg-amber-50/90 dark:bg-slate-800/90 border-amber-200 dark:border-amber-900/60',
          badgeText: '🇮🇳 15 अगस्त - स्वतंत्रता दिवस विशेष 🇮🇳',
          headerIcon: <Flag className="w-5 h-5 text-amber-500 animate-bounce" />
        };
      case 'republic':
        return {
          cardBg: 'bg-gradient-to-b from-blue-900/15 via-white to-emerald-500/15 dark:from-blue-950/50 dark:via-slate-900 dark:to-emerald-950/40',
          borderStyle: 'border-2 border-blue-600/60 dark:border-blue-500/60',
          bannerBg: 'bg-gradient-to-r from-blue-900 via-indigo-800 to-emerald-800 text-amber-300 shadow-md',
          accentText: 'text-blue-900 dark:text-blue-300',
          boxBg: 'bg-blue-50/90 dark:bg-slate-800/90 border-blue-200 dark:border-blue-900/60',
          badgeText: '🇮🇳 26 जनवरी - गणतंत्र दिवस विशेष 🇮🇳',
          headerIcon: <Award className="w-5 h-5 text-blue-600" />
        };
      case 'ptm':
        return {
          cardBg: 'bg-gradient-to-b from-indigo-500/15 via-white to-indigo-500/10 dark:from-indigo-950/40 dark:via-slate-900 dark:to-slate-900',
          borderStyle: 'border-2 border-indigo-500/60 dark:border-indigo-600/60',
          bannerBg: 'bg-gradient-to-r from-indigo-700 to-purple-800 text-amber-200 shadow-md',
          accentText: 'text-indigo-900 dark:text-indigo-300',
          boxBg: 'bg-indigo-50/90 dark:bg-slate-800/90 border-indigo-200 dark:border-indigo-900/60',
          badgeText: '|| मेगा PTM शिक्षक-अभिभावक बैठक ||',
          headerIcon: <UserCheck className="w-5 h-5 text-indigo-600" />
        };
      case 'annual':
        return {
          cardBg: 'bg-gradient-to-b from-pink-500/15 via-white to-purple-500/15 dark:from-pink-950/40 dark:via-slate-900 dark:to-purple-950/40',
          borderStyle: 'border-2 border-pink-500/60 dark:border-pink-600/60',
          bannerBg: 'bg-gradient-to-r from-pink-700 to-purple-800 text-white shadow-md',
          accentText: 'text-pink-900 dark:text-pink-300',
          boxBg: 'bg-pink-50/90 dark:bg-slate-800/90 border-pink-200 dark:border-pink-900/60',
          badgeText: '|| वार्षिक पारितोषिक व सांस्कृतिक संध्या ||',
          headerIcon: <Sparkles className="w-5 h-5 text-pink-600" />
        };
      case 'admission':
        return {
          cardBg: 'bg-gradient-to-b from-emerald-500/15 via-white to-teal-500/15 dark:from-emerald-950/40 dark:via-slate-900 dark:to-teal-950/40',
          borderStyle: 'border-2 border-emerald-500/60 dark:border-emerald-600/60',
          bannerBg: 'bg-gradient-to-r from-emerald-700 to-teal-800 text-amber-200 shadow-md',
          accentText: 'text-emerald-900 dark:text-emerald-300',
          boxBg: 'bg-emerald-50/90 dark:bg-slate-800/90 border-emerald-200 dark:border-emerald-900/60',
          badgeText: '|| प्रवेश उत्सव एवं अभिनंदन ||',
          headerIcon: <GraduationCap className="w-5 h-5 text-emerald-600" />
        };
      case 'sports':
      default:
        return {
          cardBg: 'bg-gradient-to-b from-orange-500/15 via-white to-red-500/15 dark:from-orange-950/40 dark:via-slate-900 dark:to-red-950/40',
          borderStyle: 'border-2 border-orange-500/60 dark:border-orange-600/60',
          bannerBg: 'bg-gradient-to-r from-orange-600 to-red-700 text-white shadow-md',
          accentText: 'text-orange-900 dark:text-orange-300',
          boxBg: 'bg-orange-50/90 dark:bg-slate-800/90 border-orange-200 dark:border-orange-900/60',
          badgeText: '|| खेलकूद प्रतियोगिता व स्पोर्ट्स मीट ||',
          headerIcon: <Trophy className="w-5 h-5 text-orange-600" />
        };
    }
  };

  const theme = getThemeStyles();

  // Definition of Invitation Grid Items with rich badges and SVG Ashoka Chakra / Flag designs
  const gridCards = [
    {
      id: 'independence' as InvitationTemplate,
      title: 'स्वतंत्रता दिवस (15 अगस्त)',
      titleShort: 'स्वतंत्रता दिवस',
      titleEng: 'Independence Day',
      subtitle: 'ध्वजारोहण एवं देशभक्ति सांस्कृतिक संध्या',
      bgGradient: 'bg-gradient-to-br from-[#FF9933]/20 via-white to-[#138808]/20 dark:from-[#FF9933]/30 dark:via-slate-900 dark:to-[#138808]/30',
      bgTint: 'bg-orange-50 dark:bg-orange-950/40 border-orange-200 dark:border-orange-900/60',
      border: 'border-2 border-amber-500/70 hover:border-amber-500',
      tagBg: 'bg-gradient-to-r from-[#FF9933] via-amber-500 to-[#138808] text-white',
      badge: '🇮🇳 Tiranga Theme',
      icon: <Flag className="w-6 h-6 text-orange-600 dark:text-orange-400 animate-pulse" />
    },
    {
      id: 'republic' as InvitationTemplate,
      title: 'गणतंत्र दिवस (26 जनवरी)',
      titleShort: 'गणतंत्र दिवस',
      titleEng: 'Republic Day',
      subtitle: 'राष्ट्रध्वज वंदन, अनुशासित परेड व सम्मान',
      bgGradient: 'bg-gradient-to-br from-blue-900/20 via-slate-50 to-emerald-800/20 dark:from-blue-950/50 dark:via-slate-900 dark:to-emerald-950/40',
      bgTint: 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900/60',
      border: 'border-2 border-blue-600/70 hover:border-blue-500',
      tagBg: 'bg-gradient-to-r from-blue-900 via-indigo-800 to-emerald-800 text-amber-300',
      badge: '🇮🇳 Navy & Tiranga',
      icon: (
        <div className="relative w-7 h-7 flex items-center justify-center">
          {/* Ashoka Chakra SVG */}
          <svg className="w-7 h-7 text-blue-600 dark:text-blue-400" viewBox="0 0 100 100" fill="none" stroke="currentColor">
            <circle cx="50" cy="50" r="45" strokeWidth="6" />
            <circle cx="50" cy="50" r="8" fill="currentColor" />
            {Array.from({ length: 12 }).map((_, i) => (
              <line
                key={i}
                x1="50"
                y1="50"
                x2={50 + 42 * Math.cos((i * 30 * Math.PI) / 180)}
                y2={50 + 42 * Math.sin((i * 30 * Math.PI) / 180)}
                strokeWidth="4"
              />
            ))}
          </svg>
        </div>
      )
    },
    {
      id: 'ptm' as InvitationTemplate,
      title: 'मेगा PTM बैठक',
      titleShort: 'मेगा PTM',
      titleEng: 'Mega PTM',
      subtitle: 'अभिभावक-शिक्षक संवाद व शैक्षणिक रिपोर्ट',
      bgGradient: 'bg-gradient-to-br from-indigo-500/15 via-white to-indigo-500/5 dark:from-indigo-950/40 dark:via-slate-900 dark:to-slate-900',
      bgTint: 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-900/60',
      border: 'border-2 border-indigo-500/70 hover:border-indigo-500',
      tagBg: 'bg-gradient-to-r from-indigo-700 to-purple-800 text-amber-200',
      badge: 'SMC/SDMC Special',
      icon: <UserCheck className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
    },
    {
      id: 'annual' as InvitationTemplate,
      title: 'वार्षिक पारितोषिक व सांस्कृतिक संध्या',
      titleShort: 'वार्षिक उत्सव',
      titleEng: 'Annual Day',
      subtitle: 'प्रतिभा सम्मान व रंगारंग सांस्कृतिक कार्यक्रम',
      bgGradient: 'bg-gradient-to-br from-pink-500/15 via-white to-purple-500/15 dark:from-pink-950/40 dark:via-slate-900 dark:to-purple-950/40',
      bgTint: 'bg-pink-50 dark:bg-pink-950/40 border-pink-200 dark:border-pink-900/60',
      border: 'border-2 border-pink-500/70 hover:border-pink-500',
      tagBg: 'bg-gradient-to-r from-pink-700 to-purple-800 text-white',
      badge: 'Cultural Evening',
      icon: 'sparkles'
    },
    {
      id: 'admission' as InvitationTemplate,
      title: 'प्रवेश उत्सव व अभिनंदन',
      titleShort: 'प्रवेश उत्सव',
      titleEng: 'Pravesh Utsav',
      subtitle: 'नव-प्रवेशित विद्यार्थियों का स्वागत व तिलक',
      bgGradient: 'bg-gradient-to-br from-emerald-500/15 via-white to-teal-500/15 dark:from-emerald-950/40 dark:via-slate-900 dark:to-teal-950/40',
      bgTint: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/60',
      border: 'border-2 border-emerald-500/70 hover:border-emerald-500',
      tagBg: 'bg-gradient-to-r from-emerald-700 to-teal-800 text-amber-200',
      badge: 'Session Start',
      icon: 'graduation'
    },
    {
      id: 'sports' as InvitationTemplate,
      title: 'खेलकूद प्रतियोगिता व स्पोर्ट्स मीट',
      titleShort: 'खेलकूद',
      titleEng: 'Sports Day',
      subtitle: 'दौड़, खेलकूद, कबड्डी एवं योग प्रदर्शन',
      bgGradient: 'bg-gradient-to-br from-orange-500/15 via-white to-red-500/15 dark:from-orange-950/40 dark:via-slate-900 dark:to-red-950/40',
      bgTint: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/60',
      border: 'border-2 border-orange-500/70 hover:border-orange-500',
      tagBg: 'bg-gradient-to-r from-orange-600 to-red-700 text-white',
      badge: 'Sports & Fitness',
      icon: <Trophy className="w-6 h-6 text-amber-600 dark:text-amber-400" />
    }
  ];

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-2.5 px-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm gap-2">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="flex items-center justify-center w-9 h-9 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white transition-all shadow-sm active:scale-95 shrink-0"
            title={lang === 'hi' ? 'पीछे जाएं' : 'Back'}
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="font-extrabold text-xs sm:text-sm text-slate-800 dark:text-slate-100 truncate max-w-[170px] sm:max-w-xs">
            {lang === 'hi' ? 'निमंत्रण पत्र जनरेटर (Invitation Maker)' : 'Invitation Card Generator'}
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {viewMode === 'editor' && (
            <>
              <button
                onClick={requestPrint}
                className="h-9 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-sm transition-all active:scale-95 cursor-pointer"
                title={lang === 'hi' ? 'मुद्रित करें / Download PDF' : 'Download PDF'}
              >
                <Printer className="w-4 h-4 text-amber-300" />
                <span className="hidden sm:inline">{lang === 'hi' ? 'मुद्रित करें / Download PDF' : 'Download PDF'}</span>
              </button>

              <button
                onClick={handleShareText}
                className="h-9 px-3 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
                title={lang === 'hi' ? 'छवि/टेक्स्ट शेयर करें' : 'Share'}
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4 text-amber-300" />}
                <span className="hidden sm:inline">{copied ? 'Copied!' : (lang === 'hi' ? 'शेयर करें' : 'Share')}</span>
              </button>

              <button
                onClick={() => setViewMode('grid')}
                className="h-9 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 shadow-sm transition-all active:scale-95 cursor-pointer"
                title={lang === 'hi' ? 'ग्रिड देखें' : 'View Grid'}
              >
                <LayoutGrid className="w-4 h-4" />
                <span className="hidden sm:inline">{lang === 'hi' ? 'ग्रिड देखें' : 'View Grid'}</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* 1. GRID SYSTEM VIEW MODE */}
      {viewMode === 'grid' && (
        <div className="space-y-4 pt-2">
          {/* 3-COLUMN SQUARE ROUNDED CARDS GRID */}
          <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {gridCards.map((card) => (
              <ThreeDCard
                key={card.id}
                onClick={() => selectTemplate(card.id)}
                icon={card.icon}
                label={lang === 'hi' ? card.titleShort : card.titleEng}
                bgTint={card.bgTint}
              />
            ))}
          </div>
        </div>
      )}

      {/* 2. EDITOR & LIVE PREVIEW VIEW MODE */}
      {viewMode === 'editor' && (
        <div className="space-y-4">
          
          {/* Sub-Tabs Bar inside Editor to quickly switch templates */}
          <div className="bg-white dark:bg-slate-900 p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between gap-2 overflow-x-auto">
            <div className="flex items-center gap-1.5 w-full">
              {gridCards.map((c) => (
                <button
                  key={c.id}
                  onClick={() => selectTemplate(c.id)}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1 whitespace-nowrap border ${
                    selectedTemplate === c.id
                      ? `${c.tagBg} border-transparent shadow-md`
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-amber-50'
                  }`}
                >
                  <span>{c.title.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Main Grid: Form Inputs & Live Preview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            
            {/* Left: Input Form */}
            <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                  {theme.headerIcon}
                  <span>{lang === 'hi' ? 'आमंत्रण पत्र विवरण संपादित करें' : 'Edit Invitation Details'}</span>
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  Template: {selectedTemplate.toUpperCase()}
                </span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    कार्यक्रम का नाम (Event Title)
                  </label>
                  <input
                    type="text"
                    value={eventTitle}
                    onChange={(e) => setEventTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      दिनांक (Date)
                    </label>
                    <input
                      type="text"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      समय (Time)
                    </label>
                    <input
                      type="text"
                      value={eventTime}
                      onChange={(e) => setEventTime(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    स्थान (Venue / Location)
                  </label>
                  <input
                    type="text"
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300">
                      मुख्य अतिथि / अध्यक्षता (Chief Guest)
                    </label>
                    {chiefGuest && (
                      <button
                        type="button"
                        onClick={() => setChiefGuest('')}
                        className="text-[10px] text-rose-600 dark:text-rose-400 font-bold hover:underline"
                      >
                        हटाएं (Clear Guest)
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    value={chiefGuest}
                    onChange={(e) => setChiefGuest(e.target.value)}
                    placeholder="खाली छोड़ें यदि अतिथि जानकारी नहीं जोड़नी हो"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none placeholder:text-slate-400 placeholder:text-[11px]"
                  />
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    * यदि अतिथि जानकारी नहीं भरते हैं, तो कार्ड में अतिथि पंक्ति नहीं दिखेगी।
                  </p>
                </div>

                {(selectedTemplate === 'independence' || selectedTemplate === 'republic') && (
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      देशभक्ति नारा / आदर्श वाक्य (Patriotic Slogan)
                    </label>
                    <select
                      value={patrioticMotto}
                      onChange={(e) => setPatrioticMotto(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-slate-700 dark:text-slate-200 text-xs"
                    >
                      <option value="जय हिन्द ! वन्दे मातरम् !">जय हिन्द ! वन्दे मातरम् !</option>
                      <option value="सत्यमेव जयते">सत्यमेव जयते</option>
                      <option value="भारत माता की जय !">भारत माता की जय !</option>
                      <option value="जय जवान, जय किसान, जय विज्ञान">जय जवान, जय किसान, जय विज्ञान</option>
                      <option value="वन्दे मातरम् !">वन्दे मातरम् !</option>
                      <option value="जय हिन्द !">जय हिन्द !</option>
                    </select>
                  </div>
                )}

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    आमंत्रण सन्देश (Invitation Message)
                  </label>
                  <textarea
                    rows={3}
                    value={invitationMessage}
                    onChange={(e) => setInvitationMessage(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none leading-relaxed"
                  />
                </div>
              </div>
            </div>

            {/* Right: Live Card Preview with Tiranga & Custom Themes */}
            <div className={`p-5 rounded-3xl ${theme.cardBg} ${theme.borderStyle} shadow-lg flex flex-col justify-between space-y-4 text-center relative overflow-hidden transition-all duration-300`}>
              
              {/* Top Tricolor Strip for Independence / Republic Day */}
              {(selectedTemplate === 'independence' || selectedTemplate === 'republic') && (
                <>
                  <div className="absolute top-0 left-0 right-0 h-2.5 bg-gradient-to-r from-[#FF9933] via-white to-[#138808] opacity-90"></div>
                  {/* Corner Tricolor Ribbons */}
                  <div className="absolute top-0 left-0 w-16 h-16 overflow-hidden pointer-events-none z-20">
                    <div className="absolute top-1 -left-6 w-24 h-3 bg-[#FF9933] -rotate-45 shadow-sm"></div>
                    <div className="absolute top-3 -left-8 w-24 h-3 bg-white -rotate-45 border-y border-slate-100/50"></div>
                    <div className="absolute top-5 -left-10 w-24 h-3 bg-[#138808] -rotate-45 shadow-sm"></div>
                  </div>
                  <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden pointer-events-none z-20">
                    <div className="absolute top-1 -right-6 w-24 h-3 bg-[#138808] rotate-45 shadow-sm"></div>
                    <div className="absolute top-3 -right-8 w-24 h-3 bg-white rotate-45 border-y border-slate-100/50"></div>
                    <div className="absolute top-5 -right-10 w-24 h-3 bg-[#FF9933] rotate-45 shadow-sm"></div>
                  </div>
                </>
              )}

              {/* Background Watermark Ashoka Chakra for Patriotic Theme */}
              {(selectedTemplate === 'independence' || selectedTemplate === 'republic') && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none">
                  <svg className="w-64 h-64 text-blue-900 animate-spin-slow" viewBox="0 0 100 100" fill="none" stroke="currentColor">
                    <circle cx="50" cy="50" r="45" strokeWidth="2" />
                    <circle cx="50" cy="50" r="8" fill="currentColor" />
                    {Array.from({ length: 24 }).map((_, i) => (
                      <line
                        key={i}
                        x1="50"
                        y1="50"
                        x2={50 + 42 * Math.cos((i * 15 * Math.PI) / 180)}
                        y2={50 + 42 * Math.sin((i * 15 * Math.PI) / 180)}
                        strokeWidth="1"
                      />
                    ))}
                  </svg>
                </div>
              )}

              <div className="relative z-10 pt-2">
                <span className="text-[10px] font-black tracking-widest text-slate-500 dark:text-slate-400 uppercase block">
                  राजस्थान सरकार - शिक्षा विभाग
                </span>
                <h2 className={`font-black text-lg ${theme.accentText} mt-1`}>
                  {schoolProfile.schoolNameHindi || schoolProfile.schoolName}
                </h2>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                  UDISE: {schoolProfile.udiseCode} | Block: {schoolProfile.block} ({schoolProfile.district})
                </p>

                <div className={`my-3 py-2 px-5 rounded-full ${theme.bannerBg} font-black text-sm inline-block tracking-wide`}>
                  {theme.badgeText}
                </div>

                {(selectedTemplate === 'independence' || selectedTemplate === 'republic') && (
                  <div className="text-orange-600 dark:text-amber-400 font-extrabold text-[13px] italic my-1 animate-pulse tracking-wide">
                    {patrioticMotto}
                  </div>
                )}

                <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100">
                  {eventTitle}
                </h3>

                <p className="text-xs italic text-slate-700 dark:text-slate-300 my-3 leading-relaxed px-2 font-serif">
                  "{invitationMessage}"
                </p>
              </div>

              <div className={`p-3.5 rounded-2xl ${theme.boxBg} text-left text-xs space-y-1.5 relative z-10 backdrop-blur-sm`}>
                <p className="flex justify-between border-b border-slate-200/60 dark:border-slate-700/60 pb-1">
                  <strong className={theme.accentText}>दिनांक:</strong>
                  <span className="font-bold">{eventDate}</span>
                </p>
                <p className="flex justify-between border-b border-slate-200/60 dark:border-slate-700/60 pb-1">
                  <strong className={theme.accentText}>समय:</strong>
                  <span className="font-bold">{eventTime}</span>
                </p>
                <p className="flex justify-between border-b border-slate-200/60 dark:border-slate-700/60 pb-1">
                  <strong className={theme.accentText}>स्थान:</strong>
                  <span className="font-semibold text-right">{venue}</span>
                </p>
                {chiefGuest && chiefGuest.trim() ? (
                  <p className="flex justify-between pt-0.5">
                    <strong className={theme.accentText}>मुख्य अतिथि:</strong>
                    <span className="font-semibold text-right">{chiefGuest}</span>
                  </p>
                ) : null}
              </div>

              <div className="flex justify-between items-end text-xs pt-2 border-t border-slate-200 dark:border-slate-700 font-bold relative z-10">
                <div className="text-left">
                  विनीत:<br />
                  <span className="text-slate-500 font-normal">समस्त विद्यालय परिवार</span>
                </div>
                <div className="text-right">
                  दर्शनाभिलाषी:<br />
                  <span className={theme.accentText}>{schoolProfile.principalName}</span><br />
                  <span className="text-[10px] text-slate-500 font-normal">पीईईओ / प्रधानाचार्य</span>
                </div>
              </div>

              {/* Bottom Tricolor Strip for Patriotic Themes */}
              {(selectedTemplate === 'independence' || selectedTemplate === 'republic') && (
                <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-[#FF9933] via-white to-[#138808] opacity-90"></div>
              )}

            </div>

          </div>
        </div>
      )}

      {/* Dynamic SEO Information Block - School Independence Day Invitation optimization */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 mt-4">
        <h2 className="text-slate-800 dark:text-slate-100 font-extrabold text-xs sm:text-sm flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2.5">
          <Flag className="w-5 h-5 text-amber-500 animate-pulse" />
          <span>स्कूल स्वतंत्रता दिवस (15 अगस्त) निमंत्रण पत्र मार्गदर्शन | School Independence Day Invitation Maker Guide</span>
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          राजस्थान के समस्त राजकीय एवं निजी विद्यालयों (Primary, Middle, & Senior Secondary Schools) के संस्था प्रधानों, पीईईओ (PEEO) एवं प्रधानाचार्यों हेतु स्वतंत्रता दिवस (15 August Swatantrata Diwas) के पावन अवसर पर निमंत्रण पत्र तैयार करने का यह सर्वश्रेष्ठ ऑनलाइन टूल है। यहाँ आप बिना किसी ग्राफिक डिजाइनिंग ज्ञान के अत्यंत आकर्षक तिरंगा थीम युक्त स्कूल आमंत्रण पत्र डाउनलोड कर सकते हैं।
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="space-y-2 bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-xs text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
              मुख्य खोज शब्द (Target Keywords for Google Rank 1st)
            </h3>
            <ul className="list-disc pl-4 text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
              <li><strong>independence day invitation maker for school:</strong> Create custom invites instantly.</li>
              <li><strong>school independence day invitation letter formats pdf:</strong> Ready-to-print official formats.</li>
              <li><strong>15 august invitation card for school:</strong> High-quality tricolor visual cards.</li>
              <li><strong>swatantrata diwas nimantran patra school:</strong> हिंदी स्कूल आमंत्रण पत्र।</li>
              <li><strong>Shala Darpan Invitation Card Format:</strong> शाला दर्पण हेतु प्रिंट योग्य पीडीएफ।</li>
            </ul>
          </div>

          <div className="space-y-2 bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
              स्वतंत्रता दिवस निमंत्रण पत्र कैसे तैयार करें?
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              <strong>चरण 1:</strong> विद्यालय प्रोफाइल (नाम, ब्लॉक, जिला) विवरण चुनें।<br />
              <strong>चरण 2:</strong> मुख्य अतिथि (सरपंच, एसडीएमसी अध्यक्ष, गणमान्य नागरिक) का नाम जोड़ें।<br />
              <strong>चरण 3:</strong> समय व दिनांक (15 अगस्त प्रातः 08:00 बजे) तथा कार्यक्रम की सूची दर्ज करें।<br />
              <strong>चरण 4:</strong> 'पीडीएफ डाउनलोड / प्रिंट' पर क्लिक कर प्रिंट योग्य उच्च गुणवत्ता फ़ाइल तैयार करें या 'Share Text' का उपयोग कर व्हाट्सएप ग्रुपों में भेजें।
            </p>
          </div>
        </div>

        <p className="text-[10px] text-slate-400 dark:text-slate-500 text-center italic border-t border-slate-100 dark:border-slate-800 pt-2.5">
          Shala Sahayak digital tool assists Rajasthan school admins with zero setup, 100% SEO optimized, responsive layouts, and ready-to-print structures conforming strictly to state education department mandates.
        </p>
      </div>

      {/* Confirmation Dialog Modal Before Triggering Print/PDF */}
      {showConfirmDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn no-print">
          <div className="bg-white dark:bg-slate-900 border-2 border-emerald-500/50 dark:border-emerald-500/30 rounded-3xl shadow-2xl max-w-lg w-full p-5 sm:p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    {lang === 'hi' ? 'आमंत्रण पत्र विवरण समीक्षा व सत्यापन' : 'Invitation Details Review'}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {lang === 'hi' 
                      ? 'PDF/प्रिंट करने से पहले कृपया अपनी प्रविष्टियों की जांच करें' 
                      : 'Please verify all details before generating the invitation PDF'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer font-black text-sm"
              >
                ✕
              </button>
            </div>

            {/* Summary Review Card */}
            <div className="space-y-2 bg-slate-50 dark:bg-slate-950/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300">
              <div className="font-extrabold text-slate-900 dark:text-white text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
                <School className="w-4 h-4" />
                <span>{lang === 'hi' ? 'सत्यापित की जाने वाली मुख्य प्रविष्टियाँ:' : 'Summary of Invitation details:'}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-semibold">{lang === 'hi' ? 'विद्यालय का नाम' : 'School Name'}</span>
                  <span className="font-bold text-slate-900 dark:text-white truncate block">{schoolProfile.schoolNameHindi || schoolProfile.schoolName || '—'}</span>
                </div>
                <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-semibold">{lang === 'hi' ? 'यू-डायस कोड' : 'UDISE Code'}</span>
                  <span className="font-bold font-mono text-emerald-700 dark:text-emerald-400 block">{schoolProfile.udiseCode || '—'}</span>
                </div>
                <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-semibold">{lang === 'hi' ? 'कार्यक्रम / उत्सव' : 'Event / Celebration'}</span>
                  <span className="font-bold text-slate-900 dark:text-white block truncate">{eventTitle || '—'}</span>
                </div>
                <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-semibold">{lang === 'hi' ? 'दिनांक व समय' : 'Date & Time'}</span>
                  <span className="font-bold text-slate-900 dark:text-white block">{eventDate || '—'} ({eventTime || '—'})</span>
                </div>
                <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 col-span-1 sm:col-span-2">
                  <span className="text-[10px] text-slate-400 block font-semibold">{lang === 'hi' ? 'स्थान' : 'Venue'}</span>
                  <span className="font-bold text-slate-900 dark:text-white block">{venue || '—'}</span>
                </div>
                {chiefGuest && chiefGuest.trim() && (
                  <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 col-span-1 sm:col-span-2">
                    <span className="text-[10px] text-slate-400 block font-semibold">{lang === 'hi' ? 'मुख्य अतिथि' : 'Chief Guest'}</span>
                    <span className="font-bold text-slate-900 dark:text-white block">{chiefGuest}</span>
                  </div>
                )}
                <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-semibold">{lang === 'hi' ? 'पीईईओ/प्रधानाचार्य' : 'Principal/PEEO'}</span>
                  <span className="font-bold text-slate-900 dark:text-white block">{schoolProfile.principalName || '—'}</span>
                </div>
              </div>
            </div>

            {/* Review Checkbox Prompt */}
            <label className="flex items-start space-x-3 p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800/60 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={userConfirmedReview}
                onChange={(e) => setUserConfirmedReview(e.target.checked)}
                className="mt-1 w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer accent-emerald-600"
              />
              <span className="text-xs text-amber-900 dark:text-amber-200 font-bold leading-snug">
                {lang === 'hi' 
                  ? 'मैंने निमंत्रण पत्र में दर्ज विद्यालय विवरण, कार्यक्रम समय, मुख्य अतिथि एवं निवेदक के नाम की जांच कर ली है।' 
                  : 'I have verified that all school info, event timing, guest details, and inviter name are correct.'}
              </span>
            </label>

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
              >
                {lang === 'hi' ? 'संशोधन करें / वापस जाएं' : 'Review & Edit Data'}
              </button>
              <button
                onClick={executePrint}
                disabled={!userConfirmedReview}
                className={`px-5 py-2.5 rounded-xl text-xs font-black flex items-center space-x-2 shadow-md transition-all cursor-pointer ${
                  userConfirmedReview
                    ? 'bg-emerald-700 hover:bg-emerald-600 text-white active:scale-95'
                    : 'bg-slate-300 dark:bg-slate-800 text-slate-500 dark:text-slate-500 cursor-not-allowed opacity-70'
                }`}
              >
                <Printer className="w-4 h-4" />
                <span>
                  {lang === 'hi' ? 'पुष्टि करें एवं PDF डाउनलोड करें' : 'Confirm & Download PDF'}
                </span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
