import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { SchoolProfile, Language } from '../../types';
import {
  QrCode,
  Download,
  Printer,
  Copy,
  Check,
  Share2,
  ArrowLeft,
  Sparkles,
  FileText,
  Link,
  Globe,
  Bell,
  GraduationCap,
  Calendar,
  Building,
  RefreshCw
} from 'lucide-react';

interface QrCodeGeneratorModuleProps {
  schoolProfile: SchoolProfile;
  lang: Language;
  onBack?: () => void;
}

interface PresetItem {
  id: string;
  titleHi: string;
  titleEn: string;
  category: string;
  content: string;
  headerLabel: string;
  footerLabel: string;
}

export const QrCodeGeneratorModule: React.FC<QrCodeGeneratorModuleProps> = ({
  schoolProfile,
  lang,
  onBack
}) => {
  const PRESETS: PresetItem[] = [
    {
      id: 'circular',
      titleHi: 'स्कूल परिपत्र / सर्कुलर',
      titleEn: 'School Circular',
      category: 'Notice',
      content: `https://rajshaladarpan.nic.in/SD3/Home/Public2/NoticeBoard.aspx?schoolId=${schoolProfile.schoolCode || '218001'}`,
      headerLabel: schoolProfile.schoolName ? `रा.उ.मा.वि. ${schoolProfile.schoolName}` : 'राजकीय उच्च माध्यमिक विद्यालय',
      footerLabel: 'स्कैन कर आधिकारिक परिपत्र एवं सूचना डाउनलोड करें'
    },
    {
      id: 'office_notice',
      titleHi: 'कार्यालय आदेश / सूचना पत्र',
      titleEn: 'Office Order Notice',
      category: 'Office',
      content: `कार्यालय आदेश: दिनांक ${new Date().toLocaleDateString('hi-IN')} - संस्था प्रधान/PEEO सूचना पत्र।`,
      headerLabel: 'कार्यालय प्रधानाचार्य व पीईईओ',
      footerLabel: 'स्कैन करके कार्यालय सूचना विवरण देखें'
    },
    {
      id: 'ptm_meeting',
      titleHi: 'PTM / अभिभावक बैठक आमंत्रण',
      titleEn: 'PTM Invitation',
      category: 'Meeting',
      content: `शिक्षक-अभिभावक बैठक (PTM) आमंत्रण - राजकीय विद्यालय ${schoolProfile.schoolName || ''}`,
      headerLabel: 'शिक्षक-अभिभावक बैठक (PTM) आमंत्रण',
      footerLabel: 'बैठक कार्यसूची एवं समय देखने हेतु स्कैन करें'
    },
    {
      id: 'shaladarpan_portal',
      titleHi: 'शाला दर्पण पोर्टल लिंक',
      titleEn: 'Shala Darpan Portal',
      category: 'Portal',
      content: 'https://rajshaladarpan.nic.in/',
      headerLabel: 'राजस्थान शाला दर्पण पोर्टल',
      footerLabel: 'शासकीय शिक्षा पोर्टल हेतु क्यूआर कोड'
    },
    {
      id: 'exam_schedule',
      titleHi: 'वार्षिक परीक्षा समय-सारणी',
      titleEn: 'Exam Timetable',
      category: 'Exam',
      content: `वार्षिक व बोर्ड परीक्षा समय-सारणी सत्र 2026-27 - ${schoolProfile.schoolName || 'रा.उ.मा.वि.'}`,
      headerLabel: 'वार्षिक परीक्षा समय-सारणी 2026',
      footerLabel: 'परीक्षा टाइम-टेबल व रोल नंबर सूची देखें'
    },
    {
      id: 'school_admission',
      titleHi: 'नवीन प्रवेश फॉर्म / विवरणिका',
      titleEn: 'Admission Portal',
      category: 'Admission',
      content: `नवीन प्रवेश फॉर्म 2026-27 - ${schoolProfile.schoolName || 'विद्यालय प्रवेश'}`,
      headerLabel: 'नवीन प्रवेश पंजीयन सत्र 2026-27',
      footerLabel: 'स्कैन करके ऑनलाईन प्रवेश फॉर्म भरें'
    }
  ];

  // States
  const [selectedPresetId, setSelectedPresetId] = useState<string>('circular');
  const [qrText, setQrText] = useState<string>(PRESETS[0].content);
  const [headerText, setHeaderText] = useState<string>(PRESETS[0].headerLabel);
  const [footerText, setFooterText] = useState<string>(PRESETS[0].footerLabel);
  const [subText, setSubText] = useState<string>('राजस्थान स्कूल शिक्षा विभाग (विभागीय क्यूआर कोड)');

  // Styling options
  const [qrColor, setQrColor] = useState<string>('#047857'); // Emerald Green default
  const [bgColor, setBgColor] = useState<string>('#ffffff');
  const [qrSize, setQrSize] = useState<number>(320);
  const [includeBorder, setIncludeBorder] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Apply Preset
  const handleSelectPreset = (preset: PresetItem) => {
    setSelectedPresetId(preset.id);
    setQrText(preset.content);
    setHeaderText(preset.headerLabel);
    setFooterText(preset.footerLabel);
  };

  // Draw QR code with Devanagari Hindi text labels on HTML5 Canvas
  const drawQrCanvas = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Total Canvas Dimensions
    const padding = 28;
    const headerHeight = 75;
    const footerHeight = 65;
    const totalWidth = qrSize + padding * 2;
    const totalHeight = qrSize + headerHeight + footerHeight + padding * 2;

    canvas.width = totalWidth;
    canvas.height = totalHeight;

    // Fill Background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, totalWidth, totalHeight);

    // Optional Outer Border
    if (includeBorder) {
      ctx.strokeStyle = qrColor;
      ctx.lineWidth = 4;
      ctx.strokeRect(8, 8, totalWidth - 16, totalHeight - 16);

      ctx.strokeStyle = `${qrColor}33`; // 20% opacity inner ring
      ctx.lineWidth = 1;
      ctx.strokeRect(14, 14, totalWidth - 28, totalHeight - 28);
    }

    // Generate Raw QR Canvas in memory
    const tempCanvas = document.createElement('canvas');
    try {
      await QRCode.toCanvas(tempCanvas, qrText || 'https://rajshaladarpan.nic.in', {
        width: qrSize,
        margin: 2,
        color: {
          dark: qrColor,
          light: bgColor
        },
        errorCorrectionLevel: 'M'
      });
    } catch (e) {
      console.error('QR code generation error:', e);
    }

    // Draw Top Header Hindi Text
    ctx.fillStyle = qrColor;
    ctx.textAlign = 'center';
    
    // Header Title
    ctx.font = 'bold 20px "Noto Sans Devanagari", "Segoe UI", Arial, sans-serif';
    ctx.fillText(headerText || 'विद्यालय परिपत्र / सूचना', totalWidth / 2, padding + 30);

    // Sub Title
    ctx.fillStyle = '#475569';
    ctx.font = '12px "Noto Sans Devanagari", "Segoe UI", Arial, sans-serif';
    ctx.fillText(subText || 'शाला सहायक क्यूआर जनरेटर', totalWidth / 2, padding + 52);

    // Divider Line
    ctx.strokeStyle = `${qrColor}40`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding, padding + 62);
    ctx.lineTo(totalWidth - padding, padding + 62);
    ctx.stroke();

    // Draw QR Code Image onto Center Canvas
    const qrY = padding + headerHeight;
    ctx.drawImage(tempCanvas, padding, qrY, qrSize, qrSize);

    // Draw Footer Hindi Text
    const footerY = qrY + qrSize + 24;
    
    // Bottom Divider Line
    ctx.strokeStyle = `${qrColor}40`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding, qrY + qrSize + 8);
    ctx.lineTo(totalWidth - padding, qrY + qrSize + 8);
    ctx.stroke();

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 13px "Noto Sans Devanagari", "Segoe UI", Arial, sans-serif';
    ctx.fillText(footerText || 'स्कैन करने हेतु मोबाइल कैमरा या क्यूआर स्कैनर का उपयोग करें', totalWidth / 2, footerY);

    ctx.fillStyle = '#64748b';
    ctx.font = '10px "Noto Sans Devanagari", "Segoe UI", Arial, sans-serif';
    ctx.fillText(`राजस्थान स्कूल शिक्षा विभाग • ${schoolProfile.schoolCode || '218001'}`, totalWidth / 2, footerY + 20);
  };

  useEffect(() => {
    drawQrCanvas();
  }, [qrText, headerText, footerText, subText, qrColor, bgColor, qrSize, includeBorder]);

  // Download High-Res PNG
  const handleDownloadPng = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `QR_Notice_${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  // Copy Canvas Image to Clipboard
  const handleCopyImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob(async (blob) => {
      if (!blob) return;
      try {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        // Fallback: Copy QR text
        navigator.clipboard.writeText(qrText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    });
  };

  // Print Poster View
  const handlePrint = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');

    const printWin = window.open('', '_blank');
    if (!printWin) {
      window.print();
      return;
    }

    printWin.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>School QR Code Notice Board</title>
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; text-align: center; padding: 40px; background: #f8fafc; }
            .frame { max-width: 500px; margin: 0 auto; background: white; padding: 30px; border-radius: 20px; border: 3px solid #047857; box-shadow: 0 10px 25px rgba(0,0,0,0.1); }
            h1 { color: #047857; font-size: 22px; margin-bottom: 5px; }
            p { color: #475569; font-size: 14px; margin-top: 0; }
            img { max-width: 100%; height: auto; margin: 20px 0; border: 1px solid #cbd5e1; border-radius: 12px; }
            .footer { font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 15px; }
          </style>
        </head>
        <body>
          <div class="frame">
            <h1>${headerText}</h1>
            <p>${subText}</p>
            <img src="${dataUrl}" alt="QR Code" />
            <div class="footer">${footerText}</div>
          </div>
          <script>window.onload = function() { window.print(); }</script>
        </body>
      </html>
    `);
    printWin.document.close();
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-6 shadow-xl border border-slate-200 dark:border-slate-800 space-y-6">
      
      {/* 1. Header Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <QrCode className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-slate-100 leading-tight">
              {lang === 'hi' ? 'क्यूआर कोड जनरेटर (परिपत्र व सूचना पत्र)' : 'QR Code Generator Hub'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {lang === 'hi'
                ? 'स्कूल परिपत्रों, कार्यालय सूचनाओं व पोर्टल लिंक्स हेतु यूनिकोड हिंदी लेबल युक्त क्यूआर कोड'
                : 'Create high-resolution QR codes with Unicode Hindi labels for school circulars'}
            </p>
          </div>
        </div>

        {onBack && (
          <button
            onClick={onBack}
            className="p-1.5 rounded-xl bg-slate-50 hover:bg-emerald-50 dark:bg-slate-800 dark:hover:bg-emerald-950/30 text-slate-500 hover:text-emerald-700 dark:text-slate-400 dark:hover:text-emerald-400 border border-slate-200 dark:border-slate-800 transition-all cursor-pointer active:scale-95 flex items-center gap-1.5 text-xs font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">{lang === 'hi' ? 'मुख्य पृष्ठ' : 'Back'}</span>
          </button>
        )}
      </div>

      {/* 2. Quick Presets Bar */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
          {lang === 'hi' ? '1. त्वरित टेम्पलेट चुनें (Select Preset Template):' : '1. Choose Preset Notice / Link:'}
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
          {PRESETS.map(preset => {
            const isSelected = selectedPresetId === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset)}
                className={`p-2.5 rounded-2xl border text-left transition-all active:scale-95 cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-emerald-700 text-white border-emerald-800 shadow-md ring-2 ring-emerald-500/30'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:bg-slate-100 text-slate-800 dark:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-[10px] font-black uppercase px-1.5 py-0.5 rounded-md ${
                    isSelected ? 'bg-emerald-800 text-emerald-100' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}>
                    {preset.category}
                  </span>
                  {isSelected && <Sparkles className="w-3.5 h-3.5 text-amber-300" />}
                </div>
                <div className="font-extrabold text-xs line-clamp-2">
                  {lang === 'hi' ? preset.titleHi : preset.titleEn}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Main Form & Preview Dual Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Input Form (7 cols) */}
        <div className="lg:col-span-7 space-y-4 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-3xl border border-slate-200 dark:border-slate-800">
          <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 border-b pb-2 border-slate-200 dark:border-slate-700">
            <FileText className="w-4 h-4 text-emerald-600" />
            <span>{lang === 'hi' ? '2. सूचना व क्यूआर विवरण अनुकूलित करें (Customize Content):' : 'Customize Content & Labels:'}</span>
          </h3>

          {/* QR Content / URL */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <Link className="w-3.5 h-3.5 text-emerald-600" />
              <span>{lang === 'hi' ? 'क्यूआर कोड सामग्री / लिंक (URL or Text Content)' : 'QR Code Link / Text'}</span>
            </label>
            <textarea
              value={qrText}
              onChange={e => setQrText(e.target.value)}
              rows={2}
              placeholder="https://rajshaladarpan.nic.in/... or Notice text"
              className="w-full px-3 py-2 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          {/* Header Hindi Title */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                {lang === 'hi' ? 'शीर्षक / हेडर (Hindi Main Title)' : 'Main Header Label (Hindi)'}
              </label>
              <input
                type="text"
                value={headerText}
                onChange={e => setHeaderText(e.target.value)}
                placeholder="रा.उ.मा.वि. सांगानेर"
                className="w-full px-3 py-2 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                {lang === 'hi' ? 'उप-शीर्षक (Sub Title Label)' : 'Sub Title Label'}
              </label>
              <input
                type="text"
                value={subText}
                onChange={e => setSubText(e.target.value)}
                placeholder="विद्यालय परिपत्र / आदेश"
                className="w-full px-3 py-2 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Footer Hindi Label */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              {lang === 'hi' ? 'नीचे का निर्देश / फूटर (Hindi Footer Instruction)' : 'Footer Instruction Label'}
            </label>
            <input
              type="text"
              value={footerText}
              onChange={e => setFooterText(e.target.value)}
              placeholder="स्कैन करके परिपत्र व आदेश डाउनलोड करें"
              className="w-full px-3 py-2 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          {/* Style Controls */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-700 space-y-3">
            <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 block">
              {lang === 'hi' ? '3. डिज़ाइन व रंग अनुकूलन (Color & Styling):' : 'Color & Design Settings:'}
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div>
                <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">
                  {lang === 'hi' ? 'क्यूआर रंग' : 'QR Color'}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={qrColor}
                    onChange={e => setQrColor(e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer border border-slate-300"
                  />
                  <span className="font-mono text-[10px] text-slate-500 uppercase">{qrColor}</span>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">
                  {lang === 'hi' ? 'बैकग्राउंड' : 'Background'}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={e => setBgColor(e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer border border-slate-300"
                  />
                  <span className="font-mono text-[10px] text-slate-500 uppercase">{bgColor}</span>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">
                  {lang === 'hi' ? 'आकार (Size)' : 'QR Size'}
                </label>
                <select
                  value={qrSize}
                  onChange={e => setQrSize(Number(e.target.value))}
                  className="w-full px-2 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
                >
                  <option value={240}>240 px (Small)</option>
                  <option value={320}>320 px (Medium)</option>
                  <option value={400}>400 px (Large)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-600 dark:text-slate-400 mb-1">
                  {lang === 'hi' ? 'फ्रेम बॉर्डर' : 'Frame Border'}
                </label>
                <button
                  onClick={() => setIncludeBorder(!includeBorder)}
                  className={`w-full py-1.5 rounded-xl font-bold border text-xs transition-all ${
                    includeBorder
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                      : 'bg-slate-100 text-slate-600 border-slate-300'
                  }`}
                >
                  {includeBorder ? (lang === 'hi' ? 'बॉर्डर ऑन' : 'Border ON') : (lang === 'hi' ? 'बॉर्डर ऑफ' : 'Border OFF')}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Canvas Preview & Action Bar (5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center justify-start bg-slate-900/5 dark:bg-slate-800/80 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-inner space-y-4">
          
          {/* Top Unified Action Bar above preview */}
          <div className="w-full bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1">
                <QrCode className="w-4 h-4 text-emerald-600" />
                <span>{lang === 'hi' ? 'पूर्वावलोकन एवं प्रिंट बार' : 'Preview & Action Bar'}</span>
              </span>
              <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                Devanagari OK
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                onClick={handleDownloadPng}
                className="py-2 px-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer active:scale-95"
                title={lang === 'hi' ? 'PNG डाउनलोड' : 'Download PNG'}
              >
                <Download className="w-3.5 h-3.5 text-amber-300" />
                <span className="truncate">{lang === 'hi' ? 'PNG डाउनलोड' : 'Download PNG'}</span>
              </button>

              <button
                onClick={handlePrint}
                className="py-2 px-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer active:scale-95"
                title={lang === 'hi' ? 'मुद्रित करें / Print' : 'Print Poster'}
              >
                <Printer className="w-3.5 h-3.5 text-amber-300" />
                <span className="truncate">{lang === 'hi' ? 'मुद्रित करें' : 'Print'}</span>
              </button>

              <button
                onClick={handleCopyImage}
                className="py-2 px-2.5 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95"
                title={lang === 'hi' ? 'कॉपी करें' : 'Copy'}
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span className="truncate">{lang === 'hi' ? 'कॉपी' : 'Copy'}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* HTML5 Canvas Element */}
          <div className="p-3 bg-white dark:bg-slate-950 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 max-w-full overflow-x-auto flex justify-center w-full">
            <canvas ref={canvasRef} className="max-w-full h-auto rounded-lg shadow-sm" />
          </div>
        </div>

      </div>
    </div>
  );
};
