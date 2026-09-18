import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';
import { SchoolProfile } from '../types';

export interface CalculatorPdfRow {
  label: string;
  value: string | number;
  highlight?: boolean;
  isHighlight?: boolean;
  type?: 'earning' | 'deduction' | 'neutral';
}

export interface CalculatorPdfSection {
  title: string;
  rows: CalculatorPdfRow[];
}

export interface CalculatorPdfOptions {
  reportTitleHi: string;
  reportTitleEn: string;
  reportSubtitleHi?: string;
  reportSubtitleEn?: string;
  orderReference?: string;
  financialYear?: string;
  employeeDetails?: {
    name?: string;
    designation?: string;
    payLevel?: string;
    employeeId?: string;
    cityCategory?: string;
  };
  schoolProfile?: Partial<SchoolProfile>;
  sections: CalculatorPdfSection[];
  summaryCards?: {
    title?: string;
    label?: string;
    value: string;
    subtitle?: string;
    color?: string;
  }[];
  notes?: string[];
  departmentHi?: string;
  departmentEn?: string;
  verifiedRuleRef?: string;
  signatories?: { title: string }[];
}

/**
 * Clean printable departmental HTML generation for browser print dialog (A4)
 */
export function generateDepartmentalPrintHtml(options: CalculatorPdfOptions): string {
  const currentDate = new Date().toLocaleDateString('hi-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const schoolName = options.schoolProfile?.schoolNameHindi || 
    options.schoolProfile?.schoolName || 
    'राजकीय उच्च माध्यमिक विद्यालय';
  const schoolCode = options.schoolProfile?.udiseCode || options.schoolProfile?.nicCode || '218001';
  const peeoCluster = options.schoolProfile?.principalName ? `${options.schoolProfile.principalName} (प्रधानाचार्य/पीईईओ)` : 'पीईईओ परिक्षेत्र';
  const district = options.schoolProfile?.district || 'राजस्थान';

  const sectionsHtml = options.sections.map(section => `
    <div style="margin-bottom: 16px;">
      <div style="background-color: #f1f5f9; padding: 6px 10px; font-weight: 800; font-size: 13px; color: #0f172a; border-left: 4px solid #059669; margin-bottom: 8px;">
        ${section.title}
      </div>
      <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
        <tbody>
          ${section.rows.map(row => `
            <tr style="border-bottom: 1px solid #e2e8f0; ${row.highlight ? 'background-color: #f8fafc; font-weight: bold;' : ''}">
              <td style="padding: 6px 8px; color: #334155;">${row.label}</td>
              <td style="padding: 6px 8px; text-align: right; color: ${row.type === 'deduction' ? '#be123c' : row.type === 'earning' ? '#047857' : '#0f172a'}; font-weight: ${row.highlight ? '800' : '600'};">
                ${row.value}
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `).join('');

  const summaryHtml = options.summaryCards ? `
    <div style="display: flex; gap: 12px; margin-bottom: 20px;">
      ${options.summaryCards.map(card => `
        <div style="flex: 1; border: 1px solid #cbd5e1; border-radius: 8px; padding: 10px 14px; background-color: #f8fafc; text-align: center;">
          <div style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase;">${card.title}</div>
          <div style="font-size: 20px; font-weight: 900; color: #0f172a; margin: 4px 0;">${card.value}</div>
          ${card.subtitle ? `<div style="font-size: 10px; color: #059669; font-weight: 700;">${card.subtitle}</div>` : ''}
        </div>
      `).join('')}
    </div>
  ` : '';

  const employeeHtml = options.employeeDetails ? `
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px; font-size: 11px; background-color: #fafaf9; border: 1px solid #e7e5e4;">
      <tbody>
        <tr>
          <td style="padding: 5px 10px; width: 25%; font-weight: 700; color: #78716c;">कार्मिक का नाम:</td>
          <td style="padding: 5px 10px; width: 25%; font-weight: 800; color: #1c1917;">${options.employeeDetails.name || 'संबंधित शिक्षक / कार्मिक'}</td>
          <td style="padding: 5px 10px; width: 25%; font-weight: 700; color: #78716c;">पदनाम / पे-लेवल:</td>
          <td style="padding: 5px 10px; width: 25%; font-weight: 800; color: #1c1917;">${options.employeeDetails.designation || 'वरिष्ठ अध्यापक'} (${options.employeeDetails.payLevel || 'L-10'})</td>
        </tr>
        <tr>
          <td style="padding: 5px 10px; font-weight: 700; color: #78716c;">एम्प्लॉई आईडी:</td>
          <td style="padding: 5px 10px; font-weight: 800; color: #1c1917;">${options.employeeDetails.employeeId || 'RJ-XXXXX'}</td>
          <td style="padding: 5px 10px; font-weight: 700; color: #78716c;">शहर श्रेणी (HRA):</td>
          <td style="padding: 5px 10px; font-weight: 800; color: #1c1917;">${options.employeeDetails.cityCategory || 'Z (ग्रामीण / अन्य)'}</td>
        </tr>
      </tbody>
    </table>
  ` : '';

  const notesHtml = options.notes && options.notes.length > 0 ? `
    <div style="background-color: #fffbeb; border: 1px solid #fef3c7; border-radius: 6px; padding: 10px 12px; margin-bottom: 20px; font-size: 11px; color: #92400e;">
      <div style="font-weight: 800; margin-bottom: 4px;">महत्वपूर्ण दिशा-निर्देश व टिप्पणी:</div>
      <ul style="margin: 0; padding-left: 18px;">
        ${options.notes.map(note => `<li style="margin-bottom: 2px;">${note}</li>`).join('')}
      </ul>
    </div>
  ` : '';

  return `
<!DOCTYPE html>
<html lang="hi">
<head>
  <meta charset="UTF-8">
  <title>${options.reportTitleHi} - ${schoolName}</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 12mm 15mm;
    }
    body {
      font-family: 'Segoe UI', Arial, sans-serif;
      color: #0f172a;
      line-height: 1.4;
      background: #ffffff;
      margin: 0;
      padding: 0;
    }
    .watermark {
      position: fixed;
      top: 40%;
      left: 20%;
      right: 20%;
      text-align: center;
      font-size: 42px;
      font-weight: 900;
      color: rgba(15, 23, 42, 0.03);
      transform: rotate(-30deg);
      pointer-events: none;
      z-index: 0;
    }
    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .no-print { display: none !important; }
    }
  </style>
</head>
<body>
  <div class="watermark">SHALA SAHAYAK • GOVT OF RAJASTHAN</div>

  <!-- Departmental Letterhead Header -->
  <div style="text-align: center; border-bottom: 2px solid #0f172a; padding-bottom: 12px; margin-bottom: 14px;">
    <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #475569;">
      ${options.departmentHi || 'राजस्थान सरकार • स्कूल शिक्षा विभाग एवं वित्त विभाग'}
    </div>
    <div style="font-size: 18px; font-weight: 900; color: #064e3b; margin: 4px 0;">
      कार्यालय संस्था प्रधान / आहरण एवं वितरण अधिकारी (DDO)
    </div>
    <div style="font-size: 15px; font-weight: 800; color: #0f172a;">
      ${schoolName}
    </div>
    <div style="font-size: 11px; color: #475569; font-weight: 600; margin-top: 2px;">
      शाला दर्पण कोड: <b>${schoolCode}</b> • पीईईओ क्षेत्र: <b>${peeoCluster}</b> • जिला: <b>${district}</b>
    </div>
  </div>

  <!-- Document Meta & Title -->
  <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 12px; border-bottom: 1px dashed #cbd5e1; padding-bottom: 8px;">
    <div>
      <div style="font-size: 10px; color: #64748b; font-weight: 700;">क्रमांक: ${options.orderReference || `SS/CALC/${new Date().getFullYear()}/${Math.floor(1000 + Math.random() * 9000)}`}</div>
      <div style="font-size: 16px; font-weight: 900; color: #0f172a; margin-top: 2px;">
        ${options.reportTitleHi}
      </div>
      <div style="font-size: 11px; color: #64748b; font-weight: 600;">
        ${options.reportTitleEn} ${options.financialYear ? `(${options.financialYear})` : ''}
      </div>
    </div>
    <div style="text-align: right; font-size: 11px; color: #475569; font-weight: 700;">
      दिनांक: ${currentDate}
    </div>
  </div>

  ${employeeHtml}
  ${summaryHtml}
  ${sectionsHtml}
  ${notesHtml}

  <!-- Verification & Authority Disclaimer -->
  <div style="margin-top: 24px; padding-top: 10px; border-top: 1px solid #cbd5e1; font-size: 11px; color: #475569;">
    <p style="margin: 0 0 16px 0; font-style: italic;">
      ${options.verifiedRuleRef || 'प्रमाणित किया जाता है कि उपर्युक्त गणना राजस्थान सिविल सेवा (वेतन) नियम / वित्त विभाग राजस्थान सरकार के प्रभावी परिपत्रों एवं पे-मैट्रिक्स अनुसार शुद्ध रूप से की गई है।'}
    </p>

    <!-- Signatures -->
    <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-top: 36px; padding: 0 10px;">
      <div style="text-align: center; width: 220px;">
        <div style="border-top: 1px solid #94a3b8; padding-top: 4px; font-weight: 800; font-size: 11px; color: #1e293b;">
          हस्ताक्षर संबंधित कार्मिक / बिल प्रभारी
        </div>
        <div style="font-size: 10px; color: #64748b;">(नाम एवं पदनाम)</div>
      </div>

      <div style="text-align: center; width: 240px;">
        <div style="border-top: 1px solid #94a3b8; padding-top: 4px; font-weight: 800; font-size: 11px; color: #064e3b;">
          हस्ताक्षर संस्था प्रधान / आहरण एवं वितरण अधिकारी
        </div>
        <div style="font-size: 10px; color: #64748b;">(मय पदमुद्रा व विद्यालय सील)</div>
      </div>
    </div>
  </div>

  <!-- System Footer -->
  <div style="margin-top: 30px; text-align: center; font-size: 9px; color: #94a3b8; border-top: 1px solid #f1f5f9; padding-top: 6px;">
    कंप्यूटर जनरेटेड अधिकृत प्रपत्र • शाला सहायक (shalasahayak.in) - राजस्थान विद्यालय प्रबंधन एवं शिक्षक डिजिटल टूलकिट
  </div>

  <script>
    window.onload = function() {
      window.print();
    };
  </script>
</body>
</html>
  `;
}

/**
 * Unified Print Service: Opens dedicated printable iframe/window with departmental layout
 */
export function printDepartmentalReport(options: CalculatorPdfOptions): void {
  const htmlContent = generateDepartmentalPrintHtml(options);
  const printWindow = window.open('', '_blank', 'width=850,height=900');
  if (printWindow) {
    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  } else {
    // Fallback: create hidden iframe if popups are blocked
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document || iframe.contentDocument;
    if (doc) {
      doc.open();
      doc.write(htmlContent);
      doc.close();
      setTimeout(() => {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
        setTimeout(() => document.body.removeChild(iframe), 2000);
      }, 500);
    }
  }
}

/**
 * Unified PDF Export: Downloads crisp, professional departmental A4 PDF using jsPDF
 */
export async function downloadDepartmentalPdf(options: CalculatorPdfOptions, fileNamePrefix = 'Rajasthan_Salary_Statement'): Promise<void> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const schoolName = options.schoolProfile?.schoolNameHindi || 
    options.schoolProfile?.schoolName || 
    'Govt. Senior Secondary School';
  const schoolCode = options.schoolProfile?.udiseCode || options.schoolProfile?.nicCode || '218001';
  const district = options.schoolProfile?.district || 'Rajasthan';

  // Set font
  doc.setFont('helvetica', 'bold');
  
  // Header banner background
  doc.setFillColor(6, 78, 59); // emerald-900
  doc.rect(10, 10, 190, 24, 'F');

  // Header texts
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.text(options.departmentEn || 'GOVERNMENT OF RAJASTHAN • EDUCATION & FINANCE DEPARTMENT', 105, 15, { align: 'center' });
  
  doc.setFontSize(13);
  doc.text('OFFICE OF THE HEAD OF INSTITUTION / DDO', 105, 22, { align: 'center' });
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`${schoolName} | Shala Darpan Code: ${schoolCode} | ${district}`, 105, 28, { align: 'center' });

  // Subtitle & Date
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text(options.reportTitleEn.toUpperCase(), 14, 40);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  const dateStr = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  doc.text(`Date: ${dateStr}  |  Ref: ${options.orderReference || `SS-${Date.now().toString().slice(-6)}`}`, 196, 40, { align: 'right' });

  // Employee details bar if provided
  let startY = 46;
  if (options.employeeDetails) {
    autoTable(doc, {
      startY: startY,
      theme: 'plain',
      styles: { fontSize: 8, cellPadding: 2, textColor: [30, 41, 59] },
      headStyles: { fillColor: [241, 245, 249], textColor: [15, 23, 42], fontStyle: 'bold' },
      body: [
        [
          `Employee: ${options.employeeDetails.name || 'Staff Member'}`,
          `Designation: ${options.employeeDetails.designation || 'Teacher'} (${options.employeeDetails.payLevel || 'L-10'})`,
          `ID: ${options.employeeDetails.employeeId || 'RJ-XXXXX'}`,
          `HRA Category: ${options.employeeDetails.cityCategory || 'Z'}`
        ]
      ],
      margin: { left: 10, right: 10 }
    });
    startY = (doc as any).lastAutoTable.finalY + 4;
  }

  // Summary cards if present
  if (options.summaryCards && options.summaryCards.length > 0) {
    const cardWidth = (190 - (options.summaryCards.length - 1) * 3) / options.summaryCards.length;
    options.summaryCards.forEach((card, i) => {
      const x = 10 + i * (cardWidth + 3);
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(203, 213, 225);
      doc.roundedRect(x, startY, cardWidth, 16, 2, 2, 'FD');
      
      doc.setFontSize(7);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(100, 116, 139);
      doc.text(card.title.toUpperCase(), x + cardWidth / 2, startY + 5, { align: 'center' });
      
      doc.setFontSize(11);
      doc.setTextColor(15, 23, 42);
      doc.text(card.value, x + cardWidth / 2, startY + 12, { align: 'center' });
    });
    startY += 20;
  }

  // Render each section table
  options.sections.forEach(section => {
    const tableBody = section.rows.map(r => [r.label, String(r.value)]);
    
    autoTable(doc, {
      startY: startY,
      theme: 'striped',
      head: [[section.title, 'Amount / Detail']],
      body: tableBody,
      headStyles: { fillColor: [5, 150, 105], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 9 },
      styles: { fontSize: 8, cellPadding: 2.5 },
      columnStyles: {
        0: { cellWidth: 130 },
        1: { cellWidth: 60, halign: 'right', fontStyle: 'bold' }
      },
      margin: { left: 10, right: 10 }
    });
    startY = (doc as any).lastAutoTable.finalY + 5;
  });

  // Verification text & signatures
  if (startY > 240) {
    doc.addPage();
    startY = 20;
  }

  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'italic');
  doc.text(
    'Certified that the above statement has been computed strictly as per Rajasthan Service Rules (RSR) and latest Finance Department circulars.',
    10,
    startY
  );

  startY += 22;
  doc.setDrawColor(148, 163, 184);
  doc.line(20, startY, 70, startY);
  doc.line(140, startY, 190, startY);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text('Signature of Employee', 45, startY + 4, { align: 'center' });
  doc.text('Signature of DDO / Head of School', 165, startY + 4, { align: 'center' });

  // Footer branding
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text('Generated via Shala Sahayak (shalasahayak.in) - Rajasthan Teacher & School Management Toolkit', 105, 290, { align: 'center' });

  const cleanFileName = `${fileNamePrefix}_${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(cleanFileName);
}
