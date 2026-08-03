import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  SchoolProfile,
  Teacher,
  IncrementRecord,
  InchargeAssignment,
  StudentResult,
  AparIprRecord,
  AadhaarPramanikaranRecord,
  ApaarIdRecord,
  Language
} from '../types';

/**
 * Utility to generate high quality Rajasthan Education Department PDF orders
 */

export function generateIncrementOrderPdf(
  school: SchoolProfile,
  increments: IncrementRecord[],
  batchMonth: string,
  year: number
) {
  const doc = new jsPDF();

  // Header Banner
  doc.setFillColor(6, 78, 59); // Deep Emerald Green
  doc.rect(0, 0, 210, 22, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('GOVERNMENT OF RAJASTHAN - EDUCATION DEPARTMENT', 105, 10, { align: 'center' });
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`OFFICE OF THE PRINCIPAL & PEEO: ${school.schoolName.toUpperCase()}`, 105, 17, { align: 'center' });

  // Order Ref Details
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(9);
  const dispatchStr = `Dispatch No: ${school.nicCode}/Inc/${year}/${Math.floor(Math.random() * 800 + 100)}`;
  const dateStr = `Date: ${new Date().toLocaleDateString('en-IN')}`;
  doc.text(dispatchStr, 14, 30);
  doc.text(dateStr, 196, 30, { align: 'right' });

  // Title
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text(`OFFICE ORDER: ANNUAL INCREMENT SANCTION (${batchMonth.toUpperCase()} ${year})`, 105, 38, { align: 'center' });

  // Order Preamble
  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'normal');
  const preamble = `In accordance with Rule 13 of Rajasthan Civil Services (Revised Pay) Rules 2017 (7th Pay Commission Matrix) and PayManager guidelines, annual grade increment is hereby sanctioned to the following staff members of this institution with effect from 1st ${batchMonth} ${year}, raising their basic pay to the next cell as indicated below:`;
  
  const splitPreamble = doc.splitTextToSize(preamble, 182);
  doc.text(splitPreamble, 14, 45);

  const startY = 45 + (splitPreamble.length * 4.5);

  // Table Data
  const tableRows = increments.map((rec, idx) => [
    (idx + 1).toString(),
    rec.teacherName,
    rec.designation,
    rec.payLevel,
    `Rs. ${rec.oldBasicPay.toLocaleString('en-IN')}`,
    `Rs. ${rec.newBasicPay.toLocaleString('en-IN')}`,
    `+ Rs. ${(rec.newBasicPay - rec.oldBasicPay).toLocaleString('en-IN')}`,
    `01-${batchMonth.substring(0,3)}-${year}`
  ]);

  autoTable(doc, {
    startY: startY,
    head: [['S.N.', 'Teacher Name', 'Designation', 'Level', 'Old Basic Pay', 'New Basic Pay', 'Inc. Amt', 'Effective Date']],
    body: tableRows,
    theme: 'grid',
    headStyles: { fillColor: [6, 78, 59], textColor: 255, fontStyle: 'bold', fontSize: 9 },
    bodyStyles: { fontSize: 8.5, textColor: [30, 41, 59] },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      1: { cellWidth: 42 },
      2: { cellWidth: 32 },
      3: { cellWidth: 16, halign: 'center' },
      4: { cellWidth: 24, halign: 'right' },
      5: { cellWidth: 24, halign: 'right' },
      6: { cellWidth: 18, halign: 'right' },
      7: { cellWidth: 16, halign: 'center' }
    }
  });

  const finalY = (doc as any).lastAutoTable.finalY + 12;

  // Signatures
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('Signature & Official Seal', 150, finalY, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.text(`(${school.principalName})`, 150, finalY + 5, { align: 'center' });
  doc.text(`${school.principalDesignation}`, 150, finalY + 9, { align: 'center' });
  doc.text(`${school.schoolName}`, 150, finalY + 13, { align: 'center' });

  // Copy To Section
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.text('Copy forwarded for information & necessary action to:', 14, finalY + 22);
  doc.setFont('helvetica', 'normal');
  doc.text('1. District Education Officer (Secondary), ' + school.district, 14, finalY + 27);
  doc.text('2. Treasury Officer / DDO Code: ' + school.ddoCode + ' (PayManager IFMS 3.0)', 14, finalY + 31);
  doc.text('3. Individual Staff Personal Service Book Record / Guard File.', 14, finalY + 35);

  doc.save(`Increment_Order_${batchMonth}_${year}_${school.nicCode}.pdf`);
}

export function generateWorkInchargeOfficialOrderPdf(
  school: SchoolProfile,
  incharges: InchargeAssignment[],
  meta?: { dispatchNo?: string; date?: string; term?: string },
  exportLang: Language = 'hi'
) {
  const doc = new jsPDF();
  const isHi = exportLang === 'hi';
  const dispatchNo = meta?.dispatchNo || `Ja.Sa./PEEO/${school.nicCode}/Incharge/2026-27/${Math.floor(Math.random() * 800 + 100)}`;
  const orderDate = meta?.date || new Date().toISOString().split('T')[0];
  const term = meta?.term || '2026-27';

  // Header Banner
  doc.setFillColor(30, 58, 138); // Deep Royal Blue
  doc.rect(0, 0, 210, 22, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  const headerTitle = isHi
    ? 'कार्यालय पंचायत प्रारंभिक शिक्षा अधिकारी (PEEO) एवं प्रधानाचार्य'
    : 'OFFICE OF PANCHAYAT ELEMENTARY EDUCATION OFFICER (PEEO) & PRINCIPAL';
  doc.text(headerTitle, 105, 11, { align: 'center' });

  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'normal');
  const schoolTitle = isHi
    ? (school.schoolNameHindi || school.schoolName).toUpperCase()
    : school.schoolName.toUpperCase();
  doc.text(`${schoolTitle} (${school.district.toUpperCase()})`, 105, 18, { align: 'center' });

  // Ref Row
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  const dispatchLabel = isHi ? `क्रमांक: ${dispatchNo}` : `Dispatch No: ${dispatchNo}`;
  const dateLabel = isHi ? `दिनांक: ${orderDate}` : `Date: ${orderDate}`;
  doc.text(dispatchLabel, 14, 30);
  doc.text(dateLabel, 196, 30, { align: 'right' });

  // Title
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  const orderTitle = isHi
    ? ':: कार्यालय आदेश :: संस्थागत कार्य विभाजन आदेश'
    : ':: OFFICE ORDER :: INSTITUTIONAL WORK DISTRIBUTION ORDER';
  doc.text(orderTitle, 105, 38, { align: 'center' });

  // Subject
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  const subjectText = isHi
    ? `विषय: संस्थागत कार्य विभाजन आदेश सत्र ${term}`
    : `Subject: Institutional Work Distribution Order Session ${term}`;
  doc.text(subjectText, 14, 45);

  // Preamble
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  const preamble = isHi
    ? `सत्र ${term} में विद्यालय के सुचारू अकादमिक व प्रशासनिक संचालन, सरकारी योजनाओं के पारदर्शी क्रियान्वयन, स्टॉक संधारण एवं विभागीय पोर्टल्स पर समयबद्ध प्रविष्टि हेतु निम्नलिखित अधिकारियों/शिक्षकों को उनके नाम के सम्मुख अंकित संस्थागत प्रभार एवं दायित्व आवंटित किए जाते हैं:`
    : `For the smooth academic and administrative operation of the institution during Session ${term}, transparent implementation of government schemes, stock maintenance, and timely entry on departmental portals, the following staff are assigned institutional responsibilities as indicated below:`;

  const splitPreamble = doc.splitTextToSize(preamble, 182);
  doc.text(splitPreamble, 14, 51);

  const startY = 51 + (splitPreamble.length * 4);

  // Table Data
  const tableRows = incharges.map((inc, i) => [
    (i + 1).toString(),
    isHi ? (inc.chargeNameHindi || inc.chargeName) : inc.chargeName,
    inc.assignedTeacherName ? `${inc.assignedTeacherName} (${inc.assignedTeacherDesignation || ''})` : (isHi ? 'अनावंटित' : 'Unassigned'),
    inc.assistantTeacherName ? `${inc.assistantTeacherName} (${inc.assistantTeacherDesignation || ''})` : '-',
    inc.remarks || (isHi ? 'नियमानुसार रिकॉर्ड संधारण' : 'Maintain record as per rules')
  ]);

  autoTable(doc, {
    startY: startY,
    head: [[
      isHi ? 'क्र.सं.' : 'S.N.',
      isHi ? 'प्रभार का नाम' : 'Role Name',
      isHi ? 'मुख्य प्रभारी' : 'Primary Incharge',
      isHi ? 'सहायक प्रभारी' : 'Assistant Incharge',
      isHi ? 'टिप्पणी' : 'Remarks'
    ]],
    body: tableRows,
    theme: 'grid',
    headStyles: { fillColor: [30, 58, 138], textColor: 255, fontStyle: 'bold', fontSize: 8.5 },
    bodyStyles: { fontSize: 8, textColor: [30, 41, 59], cellPadding: 2 },
    columnStyles: {
      0: { cellWidth: 12, halign: 'center' },
      1: { cellWidth: 48, fontStyle: 'bold' },
      2: { cellWidth: 48 },
      3: { cellWidth: 44 },
      4: { cellWidth: 30 }
    }
  });

  const finalY = (doc as any).lastAutoTable.finalY + 18;

  // Dual Signature Footer
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');

  // Left Signature: Shala Darpan Incharge
  doc.text(isHi ? 'शाला दर्पण प्रभारी' : 'Shala Darpan Incharge', 45, finalY, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.text(isHi ? '(हस्ताक्षर शाला दर्पण प्रभारी)' : '(Signature Shala Darpan Incharge)', 45, finalY + 5, { align: 'center' });

  // Right Signature: PEEO & Principal
  doc.setFont('helvetica', 'bold');
  doc.text(isHi ? 'PEEO एवं प्रधानाचार्य' : 'PEEO & Principal', 160, finalY, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.text(`(${school.principalName})`, 160, finalY + 5, { align: 'center' });
  doc.text(isHi ? (school.schoolNameHindi || school.schoolName) : school.schoolName, 160, finalY + 9, { align: 'center' });

  doc.save(`Work_Incharge_Order_${school.nicCode}_${term}.pdf`);
}

export function generateInchargeOrderPdf(school: SchoolProfile, incharges: InchargeAssignment[]) {
  generateWorkInchargeOfficialOrderPdf(school, incharges, undefined, 'en');
}

export function generateMarksheetPdf(school: SchoolProfile, student: StudentResult) {
  const doc = new jsPDF();

  // Outer Border
  doc.setLineWidth(1);
  doc.rect(8, 8, 194, 280);

  // Header
  doc.setFillColor(6, 78, 59);
  doc.rect(8, 8, 194, 24, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(school.schoolName.toUpperCase(), 105, 17, { align: 'center' });
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`UDISE: ${school.udiseCode} | District: ${school.district} | Academic Session: 2026-27`, 105, 25, { align: 'center' });

  doc.setTextColor(30, 41, 59);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('STUDENT PROGRESS REPORT & MARKSHEET', 105, 38, { align: 'center' });

  // Student Info Box
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text(`Student Name: ${student.studentName}`, 14, 48);
  doc.text(`Father's Name: ${student.fatherName}`, 14, 54);
  doc.text(`Class & Section: ${student.className} - ${student.section}`, 14, 60);

  doc.text(`SR Number: ${student.srNo}`, 130, 48);
  doc.text(`Roll Number: ${student.rollNo}`, 130, 54);
  doc.text(`Attendance: ${student.attendance}`, 130, 60);

  let totalMax = 0;
  let totalObtained = 0;

  const rows = student.marks.map((m, i) => {
    totalMax += m.maxMarks;
    totalObtained += m.obtainedMarks;
    const pct = ((m.obtainedMarks / m.maxMarks) * 100).toFixed(1);
    let grade = 'A';
    if (+pct >= 90) grade = 'A+';
    else if (+pct >= 75) grade = 'A';
    else if (+pct >= 60) grade = 'B';
    else if (+pct >= 45) grade = 'C';
    else grade = 'D';

    return [(i + 1).toString(), m.subject, m.maxMarks.toString(), m.obtainedMarks.toString(), `${pct}%`, grade];
  });

  const overallPct = ((totalObtained / totalMax) * 100).toFixed(1);
  let overallResult = 'PASSED';
  if (+overallPct < 33) overallResult = 'SUPPLEMENTARY / NEED IMPROVEMENT';

  autoTable(doc, {
    startY: 66,
    head: [['S.N.', 'Subject', 'Max Marks', 'Marks Obtained', 'Percentage', 'Grade']],
    body: rows,
    theme: 'grid',
    headStyles: { fillColor: [6, 78, 59], textColor: 255 },
    columnStyles: {
      0: { cellWidth: 12, halign: 'center' },
      1: { cellWidth: 60 },
      2: { cellWidth: 28, halign: 'center' },
      3: { cellWidth: 32, halign: 'center' },
      4: { cellWidth: 28, halign: 'center' },
      5: { cellWidth: 22, halign: 'center' }
    }
  });

  const finalY = (doc as any).lastAutoTable.finalY + 10;

  // Result Summary Box
  doc.setFillColor(241, 245, 249);
  doc.rect(14, finalY, 182, 22, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.rect(14, finalY, 182, 22, 'S');

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(`Grand Total: ${totalObtained} / ${totalMax}`, 20, finalY + 8);
  doc.text(`Percentage: ${overallPct}%`, 90, finalY + 8);
  doc.text(`Final Result: ${overallResult}`, 145, finalY + 8);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.text(`Class Teacher Remarks: ${student.remarks || 'Good academic progress.'}`, 20, finalY + 16);

  // Signatures
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('Class Teacher Sign', 35, finalY + 45, { align: 'center' });
  doc.text('Exam Incharge Sign', 105, finalY + 45, { align: 'center' });
  doc.text('Principal / Headmaster Seal', 170, finalY + 45, { align: 'center' });

  doc.save(`Marksheet_${student.className}_Roll_${student.rollNo}.pdf`);
}

export function generateTimeTablePdf(
  school: SchoolProfile,
  className: string,
  schedule: { period: number; subject: string; teacherName: string; roomNo?: string }[]
) {
  const doc = new jsPDF();

  doc.setFillColor(6, 78, 59);
  doc.rect(0, 0, 210, 22, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('GOVERNMENT OF RAJASTHAN - SCHOOL EDUCATION', 105, 10, { align: 'center' });
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`${school.schoolName.toUpperCase()} (UDISE: ${school.udiseCode})`, 105, 17, { align: 'center' });

  doc.setTextColor(30, 41, 59);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(`OFFICIAL CLASS TIME-TABLE: ${className.toUpperCase()} (SESSION 2026-27)`, 105, 32, { align: 'center' });

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Issued Date: ${new Date().toLocaleDateString('en-IN')}`, 14, 40);
  doc.text(`School District: ${school.district} | Block: ${school.block}`, 196, 40, { align: 'right' });

  const tableRows = schedule.map(s => [
    `Period ${s.period}`,
    `Period ${s.period}`,
    s.subject,
    s.teacherName,
    s.roomNo || 'Main Classroom'
  ]);

  autoTable(doc, {
    startY: 45,
    head: [['Period No.', 'Slot', 'Subject / Class Activity', 'Assigned Teacher Name', 'Room No']],
    body: tableRows,
    theme: 'grid',
    headStyles: { fillColor: [6, 78, 59], textColor: 255, fontStyle: 'bold' },
    bodyStyles: { fontSize: 9 },
    columnStyles: {
      0: { cellWidth: 25, halign: 'center' },
      1: { cellWidth: 30, halign: 'center' },
      2: { cellWidth: 55 },
      3: { cellWidth: 55 },
      4: { cellWidth: 25, halign: 'center' }
    }
  });

  const finalY = (doc as any).lastAutoTable.finalY + 20;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('Time-Table Incharge Sign', 40, finalY, { align: 'center' });
  doc.text('Principal & PEEO Sign & Stamp', 160, finalY, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.text(`(${school.principalName})`, 160, finalY + 6, { align: 'center' });

  doc.save(`TimeTable_${className.replace(/\s+/g, '_')}_${school.nicCode}.pdf`);
}

export function generateTeacherTimeTablePdf(
  school: SchoolProfile,
  teacherName: string,
  designation: string,
  schedule: { period: number; className: string; subject: string; roomNo?: string }[]
) {
  const doc = new jsPDF();
  doc.setFillColor(6, 78, 59);
  doc.rect(0, 0, 210, 22, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('GOVERNMENT OF RAJASTHAN - SCHOOL EDUCATION', 105, 10, { align: 'center' });
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`${school.schoolName.toUpperCase()} (UDISE: ${school.udiseCode})`, 105, 17, { align: 'center' });

  doc.setTextColor(30, 41, 59);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(`INDIVIDUAL TEACHER TIME-TABLE: ${teacherName.toUpperCase()} (${designation.toUpperCase()})`, 105, 32, { align: 'center' });

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Issued Date: ${new Date().toLocaleDateString('en-IN')}`, 14, 40);
  doc.text(`District: ${school.district} | Block: ${school.block}`, 196, 40, { align: 'right' });

  const tableRows = schedule.map(s => [
    `Period ${s.period}`,
    s.className,
    s.subject,
    s.roomNo || 'Main Classroom'
  ]);

  autoTable(doc, {
    startY: 45,
    head: [['Period No.', 'Class / Section', 'Subject', 'Room No']],
    body: tableRows,
    theme: 'grid',
    headStyles: { fillColor: [6, 78, 59], textColor: 255, fontStyle: 'bold' },
    bodyStyles: { fontSize: 9 },
    columnStyles: {
      0: { cellWidth: 35, halign: 'center' },
      1: { cellWidth: 45 },
      2: { cellWidth: 65 },
      3: { cellWidth: 35, halign: 'center' }
    }
  });

  const finalY = (doc as any).lastAutoTable.finalY + 20;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('Teacher Signature', 40, finalY, { align: 'center' });
  doc.text('Principal & PEEO Sign & Stamp', 160, finalY, { align: 'center' });

  doc.save(`Teacher_TimeTable_${teacherName.replace(/\s+/g, '_')}.pdf`);
}

export function generateMasterTimeTablePdf(
  school: SchoolProfile,
  classes: string[],
  periodsCount: number,
  matrix: Record<string, Record<number, { subject: string; teacherName: string }>>
) {
  const doc = new jsPDF({ orientation: 'landscape' });
  doc.setFillColor(6, 78, 59);
  doc.rect(0, 0, 297, 22, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('GOVERNMENT OF RAJASTHAN - SCHOOL EDUCATION', 148, 10, { align: 'center' });
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`MASTER SCHOOL TIME-TABLE MATRIX: ${school.schoolName.toUpperCase()} (SESSION 2026-27)`, 148, 17, { align: 'center' });

  const periodsHeader = Array.from({ length: periodsCount }, (_, i) => `Period ${i + 1}`);
  const head = [['Class', ...periodsHeader]];

  const body = classes.map(cls => {
    const row = [cls];
    for (let p = 1; p <= periodsCount; p++) {
      const slot = matrix[cls]?.[p];
      if (slot && slot.subject) {
        row.push(`${slot.subject}\n(${slot.teacherName || 'Unassigned'})`);
      } else {
        row.push('Free / -');
      }
    }
    return row;
  });

  autoTable(doc, {
    startY: 28,
    head: head,
    body: body,
    theme: 'grid',
    headStyles: { fillColor: [6, 78, 59], textColor: 255, fontStyle: 'bold', fontSize: 8, halign: 'center' },
    bodyStyles: { fontSize: 7.5, halign: 'center' },
    styles: { cellPadding: 2 }
  });

  const finalY = (doc as any).lastAutoTable.finalY + 15;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('Time-Table Incharge', 50, finalY, { align: 'center' });
  doc.text(`Principal & PEEO (${school.principalName})`, 240, finalY, { align: 'center' });

  doc.save(`Master_School_TimeTable_Matrix_${school.nicCode}.pdf`);
}

export function generateBoardExamRemunerationBillPdf(
  school: SchoolProfile,
  examDetails: { examName: string; centreCode: string; centreName: string; totalSessions: number },
  items: { role: string; staffName: string; sessionsCount: number; ratePerSession: number; bankAccount?: string; ifsc?: string }[]
) {
  const doc = new jsPDF();

  // Header Banner
  doc.setFillColor(15, 23, 42); // Navy Blue
  doc.rect(0, 0, 210, 24, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('BOARD OF SECONDARY EDUCATION, RAJASTHAN (RBSE) AJMER', 105, 10, { align: 'center' });
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`CENTRE REMUNERATION BILL FORM (प्रपत्र - 89) | EXAM CENTRE: ${examDetails.centreCode}`, 105, 17, { align: 'center' });

  // Details Section
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(`Exam Name: ${examDetails.examName}`, 14, 32);
  doc.text(`Centre Name: ${examDetails.centreName}`, 14, 38);
  doc.text(`UDISE: ${school.udiseCode} | DDO Code: ${school.ddoCode}`, 130, 32);
  doc.text(`Bill Date: ${new Date().toLocaleDateString('en-IN')}`, 130, 38);

  let grandTotal = 0;

  const tableRows = items.map((item, idx) => {
    const totalAmount = item.sessionsCount * item.ratePerSession;
    grandTotal += totalAmount;
    return [
      (idx + 1).toString(),
      item.staffName,
      item.role,
      item.sessionsCount.toString(),
      `Rs. ${item.ratePerSession}`,
      `Rs. ${totalAmount.toLocaleString('en-IN')}`,
      item.bankAccount ? `${item.bankAccount} (${item.ifsc || ''})` : 'PayManager Direct'
    ];
  });

  autoTable(doc, {
    startY: 44,
    head: [['S.N.', 'Staff Name', 'Duty Role', 'Sessions', 'Rate/Sess.', 'Total Payable', 'Bank Account & IFSC']],
    body: tableRows,
    theme: 'grid',
    headStyles: { fillColor: [15, 23, 42], textColor: 255, fontStyle: 'bold', fontSize: 8.5 },
    bodyStyles: { fontSize: 8.5 },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      1: { cellWidth: 40 },
      2: { cellWidth: 35 },
      3: { cellWidth: 16, halign: 'center' },
      4: { cellWidth: 20, halign: 'right' },
      5: { cellWidth: 24, halign: 'right' },
      6: { cellWidth: 37 }
    }
  });

  const finalY = (doc as any).lastAutoTable.finalY + 8;

  // Grand Total Summary
  doc.setFillColor(241, 245, 249);
  doc.rect(14, finalY, 182, 12, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.rect(14, finalY, 182, 12, 'S');

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(`GRAND TOTAL BILL AMOUNT: Rs. ${grandTotal.toLocaleString('en-IN')} (Rupees ${numberToWordsIndian(grandTotal)} Only)`, 18, finalY + 8);

  // Verification Certificate
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  const cert = `VERIFICATION CERTIFICATE: Certified that all staff members listed above were physically deployed on exam invigilation / superintendent duties at Centre Code ${examDetails.centreCode} as per prescribed RBSE norms. The rates and sessions claimed are verified correct.`;
  const splitCert = doc.splitTextToSize(cert, 182);
  doc.text(splitCert, 14, finalY + 18);

  const signY = finalY + 34;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('Exam Incharge Sign', 45, signY, { align: 'center' });
  doc.text('Center Superintendent / Principal Seal', 155, signY, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.text(`(${school.principalName})`, 155, signY + 5, { align: 'center' });

  doc.save(`RBSE_Remuneration_Bill_Centre_${examDetails.centreCode}.pdf`);
}

function numberToWordsIndian(num: number): string {
  if (num === 0) return 'Zero';
  const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  function inWords(n: number): string {
    if (n < 20) return a[n];
    if (n < 100) return b[Math.floor(n / 10)] + (n % 10 ? ' ' + a[n % 10] : '');
    if (n < 1000) return a[Math.floor(n / 100)] + 'Hundred ' + (n % 100 ? inWords(n % 100) : '');
    if (n < 100000) return inWords(Math.floor(n / 1000)) + 'Thousand ' + (n % 1000 ? inWords(n % 1000) : '');
    if (n < 10000000) return inWords(Math.floor(n / 100000)) + 'Lakh ' + (n % 100000 ? inWords(n % 100000) : '');
    return inWords(Math.floor(n / 10000000)) + 'Crore ' + (n % 10000000 ? inWords(n % 10000000) : '');
  }

  return inWords(num).trim();
}



/**
 * Generate APAR & IPR Consolidated Report PDF
 */
export function generateConsolidatedAparPdf(
  school: SchoolProfile,
  records: AparIprRecord[],
  fy: string = '2025-26'
) {
  const doc = new jsPDF();

  doc.setFillColor(6, 78, 59);
  doc.rect(0, 0, 210, 22, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('GOVERNMENT OF RAJASTHAN - EDUCATION DEPARTMENT', 105, 10, { align: 'center' });
  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'normal');
  doc.text(`PEEO OFFICE: ${school.schoolName.toUpperCase()} (DDO CODE: ${school.ddoCode})`, 105, 17, { align: 'center' });

  doc.setTextColor(30, 41, 59);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(`CONSOLIDATED APAR & IPR COMPLIANCE REPORT (FINANCIAL YEAR ${fy})`, 105, 30, { align: 'center' });

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated Date: ${new Date().toLocaleDateString('en-IN')}`, 14, 37);
  doc.text(`District: ${school.district} | Block: ${school.block}`, 196, 37, { align: 'right' });

  const rows = records.map((r, idx) => [
    (idx + 1).toString(),
    r.employeeId,
    r.employeeName,
    r.designation,
    r.schoolName,
    r.aparStatus,
    r.iprStatus,
    r.remarks || '-'
  ]);

  autoTable(doc, {
    startY: 42,
    head: [['S.N.', 'Emp ID', 'Staff Name', 'Designation', 'School Name', 'APAR Status', 'IPR Status', 'Remarks']],
    body: rows,
    theme: 'grid',
    headStyles: { fillColor: [6, 78, 59], textColor: 255, fontStyle: 'bold', fontSize: 8.5 },
    bodyStyles: { fontSize: 8 },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      1: { cellWidth: 28 },
      2: { cellWidth: 35 },
      3: { cellWidth: 28 },
      4: { cellWidth: 38 },
      5: { cellWidth: 20, halign: 'center' },
      6: { cellWidth: 18, halign: 'center' },
      7: { cellWidth: 23 }
    }
  });

  const finalY = (doc as any).lastAutoTable.finalY + 15;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('Principal & PEEO Signature & Seal', 150, finalY, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.text(`(${school.principalName})`, 150, finalY + 5, { align: 'center' });

  doc.save(`APAR_IPR_Compliance_Report_${fy}_${school.nicCode}.pdf`);
}

/**
 * Generate Aadhaar & Jan Aadhaar Pramanikaran Status Report PDF
 */
export function generateAadhaarPramanikaranPdf(
  school: SchoolProfile,
  records: AadhaarPramanikaranRecord[]
) {
  const doc = new jsPDF();

  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, 210, 22, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('OFFICE OF THE PEEO - FEEDER SCHOOLS MONITORING', 105, 10, { align: 'center' });
  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'normal');
  doc.text(`AADHAAR & JAN AADHAAR PRAMANIKARAN STATUS REPORT: ${school.schoolName.toUpperCase()}`, 105, 17, { align: 'center' });

  doc.setTextColor(30, 41, 59);
  doc.setFontSize(8.5);
  doc.text(`Report Date: ${new Date().toLocaleDateString('en-IN')}`, 14, 29);
  doc.text(`UDISE: ${school.udiseCode} | District: ${school.district}`, 196, 29, { align: 'right' });

  const rows = records.map((r, idx) => [
    (idx + 1).toString(),
    r.personType,
    r.srNoOrEmpId,
    r.name,
    r.classNameOrDesignation,
    r.schoolName,
    r.aadhaarStatus,
    r.janAadhaarStatus,
    r.maskedAadhaar, // Strictly masked
    r.mismatchDetail || 'No Mismatch'
  ]);

  autoTable(doc, {
    startY: 33,
    head: [['S.N.', 'Type', 'SR/Emp ID', 'Name', 'Class/Desig', 'School Name', 'Aadhaar', 'Jan Aadhaar', 'Aadhaar No', 'Mismatch Detail']],
    body: rows,
    theme: 'grid',
    headStyles: { fillColor: [15, 23, 42], textColor: 255, fontStyle: 'bold', fontSize: 8 },
    bodyStyles: { fontSize: 7.5 },
    columnStyles: {
      0: { cellWidth: 8, halign: 'center' },
      1: { cellWidth: 14, halign: 'center' },
      2: { cellWidth: 20 },
      3: { cellWidth: 28 },
      4: { cellWidth: 20 },
      5: { cellWidth: 30 },
      6: { cellWidth: 16, halign: 'center' },
      7: { cellWidth: 16, halign: 'center' },
      8: { cellWidth: 20, halign: 'center' },
      9: { cellWidth: 28 }
    }
  });

  const finalY = (doc as any).lastAutoTable.finalY + 15;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('PEEO Officer Signature', 160, finalY, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.text(`(${school.principalName})`, 160, finalY + 5, { align: 'center' });

  doc.save(`Aadhaar_JanAadhaar_Pramanikaran_Report_${school.nicCode}.pdf`);
}

/**
 * Generate APAAR ID Pramanikaran Progress Report PDF
 */
export function generateApaarPramanikaranPdf(
  school: SchoolProfile,
  records: ApaarIdRecord[]
) {
  const doc = new jsPDF();

  doc.setFillColor(6, 78, 59);
  doc.rect(0, 0, 210, 22, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('ONE NATION ONE STUDENT ID INITIATIVE (APAAR ID)', 105, 10, { align: 'center' });
  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'normal');
  doc.text(`APAAR ID GENERATION & CONSENT STATUS REPORT: ${school.schoolName.toUpperCase()}`, 105, 17, { align: 'center' });

  doc.setTextColor(30, 41, 59);
  doc.setFontSize(8.5);
  doc.text(`Date: ${new Date().toLocaleDateString('en-IN')}`, 14, 29);
  doc.text(`Block: ${school.block} | District: ${school.district}`, 196, 29, { align: 'right' });

  const rows = records.map((r, idx) => [
    (idx + 1).toString(),
    r.srNo,
    r.studentName,
    r.className,
    r.schoolName,
    r.parentConsentStatus,
    r.apaarStatus,
    r.discrepancyType || 'None',
    r.remarks || '-'
  ]);

  autoTable(doc, {
    startY: 33,
    head: [['S.N.', 'SR No', 'Student Name', 'Class', 'School Name', 'Parent Consent', 'APAAR Status', 'Discrepancy', 'Remarks']],
    body: rows,
    theme: 'grid',
    headStyles: { fillColor: [6, 78, 59], textColor: 255, fontStyle: 'bold', fontSize: 8 },
    bodyStyles: { fontSize: 7.5 },
    columnStyles: {
      0: { cellWidth: 8, halign: 'center' },
      1: { cellWidth: 16 },
      2: { cellWidth: 30 },
      3: { cellWidth: 16 },
      4: { cellWidth: 35 },
      5: { cellWidth: 24, halign: 'center' },
      6: { cellWidth: 24, halign: 'center' },
      7: { cellWidth: 24 },
      8: { cellWidth: 23 }
    }
  });

  const finalY = (doc as any).lastAutoTable.finalY + 15;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('PEEO / Nodal Officer Signature', 160, finalY, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.text(`(${school.principalName})`, 160, finalY + 5, { align: 'center' });

  doc.save(`APAAR_ID_Progress_Report_${school.nicCode}.pdf`);
}

/**
 * Generate Class Teacher Result Feed & Verification Report PDF
 */
export function generateClassTeacherResultReportPdf(
  school: SchoolProfile,
  className: string,
  students: StudentResult[],
  exportLang: Language = 'hi'
) {
  const doc = new jsPDF({ orientation: 'landscape' });
  const isHi = exportLang === 'hi';

  // Header Banner
  doc.setFillColor(6, 78, 59); // Emerald
  doc.rect(0, 0, 297, 24, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text(isHi ? 'राजस्थान सरकार - स्कूल शिक्षा विभाग' : 'GOVERNMENT OF RAJASTHAN - SCHOOL EDUCATION DEPARTMENT', 148, 10, { align: 'center' });
  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'normal');
  doc.text(`${school.schoolName.toUpperCase()} (UDISE: ${school.udiseCode}) | DDO: ${school.ddoCode}`, 148, 17, { align: 'center' });

  // Class Header & Title
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  const titleText = isHi 
    ? `कक्षा अध्यापक परिणाम फीड एवं विद्यार्थी सत्यापन रिपोर्ट: ${className}` 
    : `CLASS TEACHER RESULT FEED & VERIFICATION REPORT: ${className.toUpperCase()}`;
  doc.text(titleText, 148, 31, { align: 'center' });

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.text(`${isHi ? 'सत्र' : 'Session'}: 2026-27 | ${isHi ? 'कुल विद्यार्थी' : 'Total Students'}: ${students.length}`, 14, 38);
  doc.text(`${isHi ? 'दिनांक' : 'Date'}: ${new Date().toLocaleDateString('en-IN')}`, 283, 38, { align: 'right' });

  // Table Data
  const tableRows = students.map((std, idx) => {
    const getM = (sName: string) => {
      const item = std.marks.find(m => m.subject.toLowerCase().includes(sName.toLowerCase()));
      return item ? item.obtainedMarks : '-';
    };

    let totalMax = 0;
    let totalObt = 0;
    std.marks.forEach(m => {
      totalMax += m.maxMarks || 100;
      totalObt += m.obtainedMarks || 0;
    });

    const pct = totalMax > 0 ? ((totalObt / totalMax) * 100).toFixed(1) : '0';
    let grade = 'A';
    if (+pct >= 86) grade = 'A+';
    else if (+pct >= 71) grade = 'A';
    else if (+pct >= 51) grade = 'B';
    else if (+pct >= 33) grade = 'C';
    else grade = 'D/E';

    let resultStatus = 'Passed';
    if (+pct < 33) resultStatus = 'Detained';
    else if (std.marks.some(m => m.obtainedMarks < 33)) resultStatus = 'Supplementary';

    return [
      (idx + 1).toString(),
      std.srNo,
      std.rollNo,
      std.studentName,
      std.fatherName,
      std.gender || 'M',
      std.category || 'GEN',
      getM('Hindi'),
      getM('English'),
      getM('Math'),
      getM('Science'),
      getM('Social'),
      getM('Sanskrit') !== '-' ? getM('Sanskrit') : getM('Third'),
      getM('Health') !== '-' ? getM('Health') : getM('Physical'),
      getM('IT') !== '-' ? getM('IT') : getM('Computer'),
      `${totalObt}/${totalMax}`,
      `${pct}%`,
      grade,
      resultStatus,
      `Aadhaar: ${std.aadhaarStatus || 'Verified'}\nJanAadhaar: ${std.janAadhaarStatus || 'Verified'}\nAPAAR: ${std.apaarStatus || 'Generated'}`
    ];
  });

  autoTable(doc, {
    startY: 42,
    head: [[
      'S.N.', 'SR', 'Roll', 'Student Name', "Father's Name", 'Gen', 'Cat',
      'Hindi', 'Eng', 'Math', 'Sci', 'S.Sci', '3rd L.', 'H&PE', 'IT/Comp',
      'Total', '%', 'Grd', 'Result', 'Verification Status'
    ]],
    body: tableRows,
    theme: 'grid',
    headStyles: { fillColor: [6, 78, 59], textColor: 255, fontStyle: 'bold', fontSize: 7, halign: 'center' },
    bodyStyles: { fontSize: 6.5, halign: 'center', cellPadding: 1.5 },
    columnStyles: {
      0: { cellWidth: 8 },
      1: { cellWidth: 12 },
      2: { cellWidth: 10 },
      3: { cellWidth: 26, halign: 'left' },
      4: { cellWidth: 26, halign: 'left' },
      5: { cellWidth: 8 },
      6: { cellWidth: 10 },
      7: { cellWidth: 11 },
      8: { cellWidth: 11 },
      9: { cellWidth: 11 },
      10: { cellWidth: 11 },
      11: { cellWidth: 11 },
      12: { cellWidth: 11 },
      13: { cellWidth: 11 },
      14: { cellWidth: 11 },
      15: { cellWidth: 16 },
      16: { cellWidth: 12 },
      17: { cellWidth: 9 },
      18: { cellWidth: 16 },
      19: { cellWidth: 28, halign: 'left' }
    }
  });

  const finalY = (doc as any).lastAutoTable.finalY + 14;

  // Bottom Signature Blocks
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  
  // Left: Exam Incharge
  doc.text(isHi ? 'परीक्षा प्रभारी के हस्ताक्षर' : 'Signature of Exam Incharge', 40, finalY, { align: 'center' });
  
  // Center: Principal / Headmaster
  doc.text(isHi ? 'प्रधानाचार्य / पीईईओ मुहर व हस्ताक्षर' : 'Signature & Seal of Principal / PEEO', 148, finalY, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.text(`(${school.principalName})`, 148, finalY + 5, { align: 'center' });

  // Right: Class Teacher Signature Block
  doc.setFont('helvetica', 'bold');
  doc.text(isHi ? 'कक्षा अध्यापक के हस्ताक्षर' : 'Signature of Class Teacher', 250, finalY, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.text(`(${isHi ? 'कक्षा अध्यापक' : 'Class Teacher'}: ${className})`, 250, finalY + 5, { align: 'center' });

  doc.save(`Class_Teacher_Result_Report_${className.replace(/\s+/g, '_')}_${school.nicCode}.pdf`);
}

/**
 * Generate Official Subject Mark Sheet PDF
 */
export function generateSubjectMarkSheetPdf(
  school: SchoolProfile,
  examType: string,
  className: string,
  subjectName: string,
  maxMarks: number,
  rows: { sNo: number; rollNo: string; studentName: string; marks: string | number }[],
  exportLang: Language = 'hi'
) {
  const doc = new jsPDF();
  const isHi = exportLang === 'hi';

  // Header Banner
  doc.setFillColor(30, 58, 138); // Deep Royal Blue
  doc.rect(0, 0, 210, 22, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  const schoolTitle = school.schoolName ? school.schoolName.toUpperCase() : 'GOVT. SECONDARY / HIGHER SECONDARY SCHOOL';
  doc.text(schoolTitle, 105, 11, { align: 'center' });

  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'normal');
  doc.text(`${isHi ? 'परीक्षा/परख अंक पत्र' : 'EXAM / TEST MARKS TABULATION SHEET'} - 2026-27`, 105, 18, { align: 'center' });

  // Line 2: Exam Title
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(`${examType.toUpperCase()} (EXAM / EVALUATION 2026-27)`, 105, 30, { align: 'center' });

  // Line 3: Metadata Bar
  doc.setFillColor(241, 245, 249);
  doc.rect(14, 34, 182, 10, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.rect(14, 34, 182, 10, 'S');

  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'bold');
  doc.text(`SUBJECT: ${subjectName.toUpperCase()}`, 18, 40.5);
  doc.text(`CLASS: ${className.toUpperCase()}`, 105, 40.5, { align: 'center' });
  doc.text(`MAX MARKS (M.M.): ${maxMarks}`, 192, 40.5, { align: 'right' });

  // Table Data
  const tableData = rows.map(r => [
    r.sNo.toString(),
    r.rollNo,
    r.studentName,
    r.marks !== undefined && r.marks !== null ? r.marks.toString() : '-'
  ]);

  autoTable(doc, {
    startY: 47,
    head: [[
      isHi ? 'क्रमांक (S NO.)' : 'S NO.',
      isHi ? 'रोल नंबर (ROLL NO)' : 'ROLL NO',
      isHi ? 'विद्यार्थी का नाम (NAME)' : 'STUDENT NAME',
      isHi ? 'प्राप्तांक (MARKS)' : 'MARKS OBTAINED'
    ]],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [30, 58, 138], textColor: 255, fontStyle: 'bold', fontSize: 9, halign: 'center' },
    bodyStyles: { fontSize: 9, halign: 'center', cellPadding: 2 },
    columnStyles: {
      0: { cellWidth: 20, halign: 'center' },
      1: { cellWidth: 30, halign: 'center' },
      2: { cellWidth: 90, halign: 'left' },
      3: { cellWidth: 42, halign: 'center', fontStyle: 'bold' }
    }
  });

  const finalY = (doc as any).lastAutoTable.finalY + 22;

  // Signatures Footer
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');

  // Left: Subject Teacher Signature
  doc.text(isHi ? 'विषय अध्यापक के हस्ताक्षर' : 'Subject Teacher Signature', 45, finalY, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.text(`(${isHi ? 'विषय' : 'Sub'}: ${subjectName})`, 45, finalY + 5, { align: 'center' });

  // Right: Counter Signature Headmaster / PEEO
  doc.setFont('helvetica', 'bold');
  doc.text(isHi ? 'प्रतिहस्ताक्षर (कक्षा अध्यापक / संस्था प्रधान)' : 'Class Teacher / Headmaster Counter-Signature', 155, finalY, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.text(`(${school.principalName || 'Principal / Headmaster'})`, 155, finalY + 5, { align: 'center' });

  doc.save(`${subjectName.replace(/\s+/g, '_')}_${className.replace(/\s+/g, '_')}_${examType.replace(/\s+/g, '_')}_Marksheet.pdf`);
}

/**
 * Generate Official Subject Greensheet PDF (All Exams Matrix for a Single Subject)
 */
export function generateSubjectGreensheetPdf(
  school: SchoolProfile,
  className: string,
  subjectName: string,
  teacherName: string,
  rows: {
    sNo: number;
    rollNo: string;
    studentName: string;
    t1: string | number;
    t2: string | number;
    hy: string | number;
    t3: string | number;
    yr: string | number;
    total: number;
    percentage: string;
  }[],
  exportLang: Language = 'hi'
) {
  const doc = new jsPDF({ orientation: 'landscape' });
  const isHi = exportLang === 'hi';

  // Header Banner
  doc.setFillColor(30, 58, 138); // Deep Royal Blue
  doc.rect(0, 0, 297, 22, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  const schoolTitle = school.schoolName ? school.schoolName.toUpperCase() : 'GOVT. SECONDARY / HIGHER SECONDARY SCHOOL';
  doc.text(schoolTitle, 148.5, 11, { align: 'center' });

  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'normal');
  doc.text(`SUBJECT GREENSHEET (विषयवार समेकित अंक तालिका) - SESSION 2026-27`, 148.5, 18, { align: 'center' });

  // Metadata Bar
  doc.setFillColor(241, 245, 249);
  doc.rect(14, 26, 269, 10, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.rect(14, 26, 269, 10, 'S');

  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(`SUBJECT: ${subjectName.toUpperCase()}`, 18, 32.5);
  doc.text(`CLASS: ${className.toUpperCase()}`, 148.5, 32.5, { align: 'center' });
  doc.text(`SUBJECT TEACHER: ${teacherName.toUpperCase()}`, 278, 32.5, { align: 'right' });

  // Table Data
  const tableData = rows.map(r => [
    r.sNo.toString(),
    r.rollNo,
    r.studentName,
    r.t1 !== undefined && r.t1 !== null ? r.t1.toString() : '-',
    r.t2 !== undefined && r.t2 !== null ? r.t2.toString() : '-',
    r.hy !== undefined && r.hy !== null ? r.hy.toString() : '-',
    r.t3 !== undefined && r.t3 !== null ? r.t3.toString() : '-',
    r.yr !== undefined && r.yr !== null ? r.yr.toString() : '-',
    r.total.toString(),
    `${r.percentage}%`
  ]);

  autoTable(doc, {
    startY: 39,
    head: [[
      isHi ? 'क्र.' : 'S.N.',
      isHi ? 'रोल नं' : 'ROLL NO',
      isHi ? 'विद्यार्थी का नाम' : 'STUDENT NAME',
      '1st Test (10)',
      '2nd Test (10)',
      'Half Yearly (70)',
      '3rd Test (10)',
      'Yearly (80)',
      'Grand Total (180)',
      'Percentage (%)'
    ]],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [30, 58, 138], textColor: 255, fontStyle: 'bold', fontSize: 8.5, halign: 'center' },
    bodyStyles: { fontSize: 8.5, halign: 'center', cellPadding: 2 },
    columnStyles: {
      0: { cellWidth: 15, halign: 'center' },
      1: { cellWidth: 22, halign: 'center' },
      2: { cellWidth: 70, halign: 'left', fontStyle: 'bold' },
      3: { cellWidth: 25, halign: 'center' },
      4: { cellWidth: 25, halign: 'center' },
      5: { cellWidth: 28, halign: 'center' },
      6: { cellWidth: 25, halign: 'center' },
      7: { cellWidth: 25, halign: 'center' },
      8: { cellWidth: 28, halign: 'center', fontStyle: 'bold' },
      9: { cellWidth: 26, halign: 'center', fontStyle: 'bold' }
    }
  });

  const finalY = (doc as any).lastAutoTable.finalY + 18;

  // Signatures Footer
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');

  // Left: Subject Teacher Signature
  doc.text(isHi ? 'विषय अध्यापक के हस्ताक्षर' : 'Subject Teacher Signature', 60, finalY, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.text(`(${teacherName} - ${subjectName})`, 60, finalY + 5, { align: 'center' });

  // Right: Counter Signature Headmaster / PEEO
  doc.setFont('helvetica', 'bold');
  doc.text(isHi ? 'प्रतिहस्ताक्षर (कक्षा अध्यापक / संस्था प्रधान)' : 'Class Teacher / Headmaster Counter-Signature', 230, finalY, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.text(`(${school.principalName || 'Principal / Headmaster'})`, 230, finalY + 5, { align: 'center' });

  doc.save(`${subjectName.replace(/\s+/g, '_')}_Greensheet_${className.replace(/\s+/g, '_')}.pdf`);
}

/**
 * Generate Official Verification Discrepancy & Verification Report PDF (Aadhaar / Jan Aadhaar / APAAR)
 */
export function generateVerificationReportPdf(
  school: SchoolProfile,
  reportType: 'Aadhaar' | 'Jan Aadhaar' | 'APAAR',
  className: string,
  teacherName: string,
  totalStudents: number,
  verifiedCount: number,
  pendingRows: { sNo: number; srNo: string; rollNo: string; studentName: string; fatherName: string; reason: string }[],
  exportLang: Language = 'hi'
) {
  const doc = new jsPDF();
  const isHi = exportLang === 'hi';
  const pendingCount = totalStudents - verifiedCount;

  // Header Banner
  doc.setFillColor(30, 58, 138); // Deep Royal Blue
  doc.rect(0, 0, 210, 22, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  const schoolTitle = school.schoolName ? school.schoolName.toUpperCase() : 'GOVT. SECONDARY / HIGHER SECONDARY SCHOOL';
  doc.text(schoolTitle, 105, 11, { align: 'center' });

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`UDISE: ${school.udiseCode || '08260100101'} | DISTRICT: ${school.district || 'RAJSAMAND'} | BLOCK: ${school.block || 'KHAMNOR'}`, 105, 18, { align: 'center' });

  // Sub-Header
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(`CLASS: ${className.toUpperCase()}  |  CLASS TEACHER: ${teacherName.toUpperCase()}`, 105, 29, { align: 'center' });

  // Subject Line Box
  doc.setFillColor(241, 245, 249);
  doc.rect(14, 33, 182, 9, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.rect(14, 33, 182, 9, 'S');

  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(`SUBJECT: ${reportType} VERIFICATION & PENDING DISCREPANCY REPORT`, 18, 39);

  // Formal Summary Text Paragraph
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  const bodyText = `Respected Sir/Madam, It is submitted regarding the above subject that out of total ${totalStudents} students in Class ${className}, verification for ${verifiedCount} students has been successfully completed. Details and issues/reasons for the remaining ${pendingCount} pending student(s) are listed in the table below for necessary administrative action:`;
  
  const splitText = doc.splitTextToSize(bodyText, 182);
  doc.text(splitText, 14, 48);

  const startTableY = 48 + (splitText.length * 4.5) + 3;

  // Discrepancy Table
  const tableData = pendingRows.map(r => [
    r.sNo.toString(),
    r.srNo,
    r.rollNo,
    r.studentName,
    r.fatherName,
    r.reason || 'Verification Pending'
  ]);

  autoTable(doc, {
    startY: startTableY,
    head: [[
      'S.NO.',
      'SR NO.',
      'ROLL NO',
      'STUDENT NAME',
      "FATHER'S NAME",
      'PENDING STATUS / REASON'
    ]],
    body: tableData.length > 0 ? tableData : [['-', '-', '-', 'All Students Verified', '-', 'No Pending Discrepancies']],
    theme: 'grid',
    headStyles: { fillColor: [30, 58, 138], textColor: 255, fontStyle: 'bold', fontSize: 8.5, halign: 'center' },
    bodyStyles: { fontSize: 8.5, cellPadding: 2.5 },
    columnStyles: {
      0: { cellWidth: 15, halign: 'center' },
      1: { cellWidth: 20, halign: 'center' },
      2: { cellWidth: 20, halign: 'center' },
      3: { cellWidth: 45, halign: 'left', fontStyle: 'bold' },
      4: { cellWidth: 42, halign: 'left' },
      5: { cellWidth: 40, halign: 'left' }
    }
  });

  const finalY = (doc as any).lastAutoTable.finalY + 22;

  // Official Dual Signature Footer
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');

  // Left Side: Shala Darpan Incharge Signature
  doc.text('Shala Darpan Incharge Signature', 45, finalY, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.text('(Shala Darpan Portal Incharge)', 45, finalY + 5, { align: 'center' });

  // Right Side: Class Teacher Signature
  doc.setFont('helvetica', 'bold');
  doc.text('Class Teacher Signature', 155, finalY, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.text(`(${teacherName})`, 155, finalY + 5, { align: 'center' });

  doc.save(`${reportType.replace(/\s+/g, '_')}_Discrepancy_Report_${className.replace(/\s+/g, '_')}.pdf`);
}

export function generateMdmMonthlyReportPdf(
  school: SchoolProfile,
  logs: any[],
  monthYear: string,
  summary: {
    totalEnrolledPrimary: number;
    totalEnrolledUpperPrimary: number;
    totalMealsPrimary: number;
    totalMealsUpperPrimary: number;
    totalWheatKg: number;
    totalRiceKg: number;
    totalCookingCost: number;
    workingDays: number;
  },
  exportLang: Language = 'hi'
) {
  const doc = new jsPDF();
  const isHi = exportLang === 'hi';

  // Header Banner
  doc.setFillColor(16, 185, 129); // Emerald
  doc.rect(0, 0, 210, 22, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  const headerTitle = isHi
    ? 'कार्यालय प्रधानाचार्य एवं मध्याह्न भोजन (MDM) प्रभारी'
    : 'OFFICE OF PRINCIPAL & MID-DAY MEAL (MDM) INCHARGE';
  doc.text(headerTitle, 105, 11, { align: 'center' });

  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'normal');
  const schoolTitle = isHi
    ? (school.schoolNameHindi || school.schoolName).toUpperCase()
    : school.schoolName.toUpperCase();
  doc.text(`${schoolTitle} (${school.district.toUpperCase()})`, 105, 18, { align: 'center' });

  // Report Title
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  const repTitle = isHi
    ? `मासिक मध्याह्न भोजन (PM POSHAN) अनुपालन एवं खाद्यान्न रिपोर्ट - ${monthYear}`
    : `MONTHLY MID-DAY MEAL (PM POSHAN) COMPLIANCE & GRAIN REPORT - ${monthYear}`;
  doc.text(repTitle, 105, 30, { align: 'center' });

  // Summary Metrics Box
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setFillColor(241, 245, 249);
  doc.rect(14, 35, 182, 22, 'F');

  doc.text(isHi ? `कुल शिक्षण दिवस: ${summary.workingDays}` : `Working Days: ${summary.workingDays}`, 18, 41);
  doc.text(isHi ? `नामांकन (प्राथमिक 1-5): ${summary.totalEnrolledPrimary}` : `Primary Enrolled (1-5): ${summary.totalEnrolledPrimary}`, 18, 47);
  doc.text(isHi ? `नामांकन (उच्च प्राथमिक 6-8): ${summary.totalEnrolledUpperPrimary}` : `Upper Primary Enrolled (6-8): ${summary.totalEnrolledUpperPrimary}`, 18, 53);

  doc.text(isHi ? `कुल भोजन लाभार्थी (प्राथमिक): ${summary.totalMealsPrimary}` : `Meals Served (Primary): ${summary.totalMealsPrimary}`, 105, 41);
  doc.text(isHi ? `कुल भोजन लाभार्थी (उच्च प्राथमिक): ${summary.totalMealsUpperPrimary}` : `Meals Served (Upper Prim.): ${summary.totalMealsUpperPrimary}`, 105, 47);
  doc.text(isHi ? `कुल गेहूँ खपत: ${summary.totalWheatKg.toFixed(1)} KG | चावल: ${summary.totalRiceKg.toFixed(1)} KG` : `Wheat Used: ${summary.totalWheatKg.toFixed(1)} KG | Rice: ${summary.totalRiceKg.toFixed(1)} KG`, 105, 53);

  // Table Body
  const tableRows = logs.map((log, i) => [
    (i + 1).toString(),
    log.date,
    log.menuItem || (isHi ? 'रोटी-दाल' : 'Roti-Dal'),
    (log.mealsPrimary || Math.round((log.mealsServed || 0) * 0.5)).toString(),
    (log.mealsUpperPrimary || Math.round((log.mealsServed || 0) * 0.5)).toString(),
    (log.mealsServed || 0).toString(),
    ((log.wheatUsedKg || 0) + (log.riceUsedKg || 0)).toFixed(1),
    `Rs. ${(log.cookingCostSpent || 0).toFixed(0)}`
  ]);

  autoTable(doc, {
    startY: 62,
    head: [[
      isHi ? 'क्र.' : 'S.N.',
      isHi ? 'दिनांक' : 'Date',
      isHi ? 'मेनू आइटम' : 'Menu Item',
      isHi ? 'प्राथमिक (1-5)' : 'Primary (1-5)',
      isHi ? 'उच्च प्रा. (6-8)' : 'Upper Prim (6-8)',
      isHi ? 'कुल लाभार्थी' : 'Total Meals',
      isHi ? 'खाद्यान्न (KG)' : 'Grain (KG)',
      isHi ? 'कुकिंग कॉस्ट (Rs)' : 'Cooking Cost'
    ]],
    body: tableRows,
    theme: 'grid',
    headStyles: { fillColor: [16, 185, 129], textColor: 255, fontStyle: 'bold', fontSize: 8 },
    bodyStyles: { fontSize: 7.5, textColor: [30, 41, 59], cellPadding: 1.5 },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      1: { cellWidth: 22, halign: 'center' },
      2: { cellWidth: 35 },
      3: { cellWidth: 25, halign: 'center' },
      4: { cellWidth: 25, halign: 'center' },
      5: { cellWidth: 22, halign: 'center' },
      6: { cellWidth: 22, halign: 'center' },
      7: { cellWidth: 21, halign: 'center' }
    }
  });

  const finalY = (doc as any).lastAutoTable.finalY + 18;

  // Dual Official Signatures
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');

  // Left: MDM Incharge Signature
  doc.text(isHi ? 'मध्याह्न भोजन (MDM) प्रभारी' : 'MDM Incharge Signature', 45, finalY, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.text(isHi ? '(हस्ताक्षर एवं सील)' : '(Signature & Seal)', 45, finalY + 5, { align: 'center' });

  // Right: PEEO & Principal
  doc.setFont('helvetica', 'bold');
  doc.text(isHi ? 'PEEO एवं प्रधानाचार्य' : 'PEEO & Principal', 160, finalY, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.text(`(${school.principalName})`, 160, finalY + 5, { align: 'center' });

  doc.save(`MDM_Monthly_Report_${school.nicCode}_${monthYear.replace(/\s+/g, '_')}.pdf`);
}

export function generateMdmOfficialOrderPdf(
  school: SchoolProfile,
  inchargeName: string,
  inchargeDesignation: string,
  meta?: { dispatchNo?: string; date?: string },
  exportLang: Language = 'hi'
) {
  const doc = new jsPDF();
  const isHi = exportLang === 'hi';
  const dispatchNo = meta?.dispatchNo || `Ja.Sa./PEEO/${school.nicCode}/MDM/2026-27/${Math.floor(Math.random() * 800 + 100)}`;
  const orderDate = meta?.date || new Date().toISOString().split('T')[0];

  // Header Banner
  doc.setFillColor(16, 185, 129);
  doc.rect(0, 0, 210, 22, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  const headerTitle = isHi
    ? 'कार्यालय पंचायत प्रारंभिक शिक्षा अधिकारी (PEEO) एवं प्रधानाचार्य'
    : 'OFFICE OF PANCHAYAT ELEMENTARY EDUCATION OFFICER (PEEO) & PRINCIPAL';
  doc.text(headerTitle, 105, 11, { align: 'center' });

  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'normal');
  const schoolTitle = isHi
    ? (school.schoolNameHindi || school.schoolName).toUpperCase()
    : school.schoolName.toUpperCase();
  doc.text(`${schoolTitle} (${school.district.toUpperCase()})`, 105, 18, { align: 'center' });

  // Ref Row
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text(isHi ? `क्रमांक: ${dispatchNo}` : `Dispatch No: ${dispatchNo}`, 14, 30);
  doc.text(isHi ? `दिनांक: ${orderDate}` : `Date: ${orderDate}`, 196, 30, { align: 'right' });

  // Title
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(isHi ? ':: कार्यालय आदेश :: पीएम पोषण (MDM) प्रभार आवंटन' : ':: OFFICE ORDER :: PM POSHAN (MDM) INCHARGE ALLOCATION', 105, 38, { align: 'center' });

  // Subject
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text(isHi ? 'विषय: मध्याह्न भोजन योजना (PM POSHAN) संस्थागत प्रभारी नियुक्ति बाबत।' : 'Subject: Appointment of Mid-Day Meal (PM POSHAN) Institutional Incharge.', 14, 45);

  // Body text
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  const bodyText = isHi
    ? `राज्य सरकार व शिक्षा विभाग के निर्देशानुसार विद्यालय में अध्ययनरत विद्यार्थियों को गुणवत्तापूर्ण, पौष्टिक एवं स्वादिष्ट मध्याह्न भोजन (PM POSHAN) तथा बाल गोपाल दूध का समयबद्ध वितरण सुनिश्चित करने हेतु निम्नलिखित शिक्षक/कार्मिक को मध्याह्न भोजन (MDM) मुख्य प्रभारी नियुक्त किया जाता है:\n\n1. नाम: ${inchargeName}\n2. पद: ${inchargeDesignation}\n3. विद्यालय: ${school.schoolNameHindi || school.schoolName}\n\nउक्त प्रभारी खाद्यान्न (गेहूँ/चावल) स्टॉक संधारण, दैनिक भोजन वितरण रजिस्टर, कुकिंग कॉस्ट लेखा-जोखा, रसोइया-कम-हेल्पर उपस्थिति व मानदेय तथा शाला दर्पण पोर्टल पर समयबद्ध प्रविष्टि हेतु व्यक्तिगत रूप से उत्तरदायी होंगे।`
    : `In accordance with State Government and Education Department guidelines, to ensure timely distribution of nutritious Mid-Day Meal (PM POSHAN) and Bal Gopal Milk to enrolled students, the following staff member is hereby appointed as Official MDM Incharge:\n\n1. Name: ${inchargeName}\n2. Designation: ${inchargeDesignation}\n3. School: ${school.schoolName}\n\nThe appointed incharge shall be individually responsible for grain stock maintenance, daily meal registers, cooking cost ledger, cook-cum-helper attendance/honorarium, and timely entry on Shala Darpan portal.`;

  const splitBody = doc.splitTextToSize(bodyText, 182);
  doc.text(splitBody, 14, 52);

  const finalY = 52 + (splitBody.length * 4.5) + 20;

  // Signatures
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.text(isHi ? 'मध्याह्न भोजन (MDM) प्रभारी' : 'MDM Incharge', 45, finalY, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.text(`(${inchargeName})`, 45, finalY + 5, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.text(isHi ? 'PEEO एवं प्रधानाचार्य' : 'PEEO & Principal', 160, finalY, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.text(`(${school.principalName})`, 160, finalY + 5, { align: 'center' });

  doc.save(`MDM_Official_Incharge_Order_${school.nicCode}.pdf`);
}





