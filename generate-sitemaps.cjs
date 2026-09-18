const fs = require('fs');
const path = require('path');

const today = '2026-08-08';

const coreUrls = [
  { url: 'https://shalasahayak.in/', freq: 'daily', prio: '1.0' },
  { url: 'https://shalasahayak.in/peeo-tools', freq: 'daily', prio: '0.95' },
  { url: 'https://shalasahayak.in/incharge-portal', freq: 'daily', prio: '0.95' },
  { url: 'https://shalasahayak.in/teacher-tools', freq: 'daily', prio: '0.95' },
  { url: 'https://shalasahayak.in/quick', freq: 'daily', prio: '0.90' },
  { url: 'https://shalasahayak.in/shivira', freq: 'weekly', prio: '0.90' },
  { url: 'https://shalasahayak.in/formats', freq: 'weekly', prio: '0.90' },
  { url: 'https://shalasahayak.in/blogs', freq: 'weekly', prio: '0.90' },
  { url: 'https://shalasahayak.in/contact', freq: 'monthly', prio: '0.85' },
  { url: 'https://shalasahayak.in/about', freq: 'monthly', prio: '0.85' },
  { url: 'https://shalasahayak.in/school-profile', freq: 'weekly', prio: '0.85' },
  { url: 'https://shalasahayak.in/privacy-policy', freq: 'monthly', prio: '0.75' },
  { url: 'https://shalasahayak.in/terms', freq: 'monthly', prio: '0.75' },
  { url: 'https://shalasahayak.in/disclaimer', freq: 'monthly', prio: '0.75' },
  { url: 'https://shalasahayak.in/about-us.html', freq: 'monthly', prio: '0.80' },
  { url: 'https://shalasahayak.in/contact-us.html', freq: 'monthly', prio: '0.80' },
  { url: 'https://shalasahayak.in/privacy-policy.html', freq: 'monthly', prio: '0.70' },
  { url: 'https://shalasahayak.in/terms-and-conditions.html', freq: 'monthly', prio: '0.70' }
];

const peeoUrls = [
  { url: 'https://shalasahayak.in/peeo-tools', freq: 'daily', prio: '0.95' },
  { url: 'https://shalasahayak.in/peeo-increment/calculator', freq: 'weekly', prio: '0.90' },
  { url: 'https://shalasahayak.in/peeo-timetable/generator', freq: 'weekly', prio: '0.90' },
  { url: 'https://shalasahayak.in/peeo-substitution/tracker', freq: 'weekly', prio: '0.85' },
  { url: 'https://shalasahayak.in/peeo-apar/appraisal', freq: 'weekly', prio: '0.85' },
  { url: 'https://shalasahayak.in/peeo-tools/incharge-mapping', freq: 'weekly', prio: '0.85' },
  { url: 'https://shalasahayak.in/peeo-tools/pramanikaran', freq: 'weekly', prio: '0.80' },
  { url: 'https://shalasahayak.in/peeo-tools/satyapan', freq: 'weekly', prio: '0.80' }
];

const inchargeUrls = [
  { url: 'https://shalasahayak.in/incharge-portal', freq: 'daily', prio: '0.95' },
  { url: 'https://shalasahayak.in/incharge-mdm/calculator', freq: 'daily', prio: '0.95' },
  { url: 'https://shalasahayak.in/incharge-exam/roster', freq: 'weekly', prio: '0.90' },
  { url: 'https://shalasahayak.in/incharge-transport/voucher', freq: 'weekly', prio: '0.85' },
  { url: 'https://shalasahayak.in/incharge-scholarship/calculator', freq: 'weekly', prio: '0.85' },
  { url: 'https://shalasahayak.in/incharge-inspire', freq: 'weekly', prio: '0.90' },
  { url: 'https://shalasahayak.in/incharge-portal/inspire/guidelines', freq: 'weekly', prio: '0.85' },
  { url: 'https://shalasahayak.in/incharge-portal/inspire/nominations', freq: 'weekly', prio: '0.90' },
  { url: 'https://shalasahayak.in/incharge-portal/inspire/ideabank', freq: 'weekly', prio: '0.85' },
  { url: 'https://shalasahayak.in/incharge-portal/inspire/pramani', freq: 'weekly', prio: '0.85' },
  { url: 'https://shalasahayak.in/incharge-portal/inspire/youtube', freq: 'weekly', prio: '0.80' },
  { url: 'https://shalasahayak.in/incharge-udise', freq: 'weekly', prio: '0.90' },
  { url: 'https://shalasahayak.in/incharge-portal/udise/teacher', freq: 'weekly', prio: '0.85' },
  { url: 'https://shalasahayak.in/incharge-portal/udise/school', freq: 'weekly', prio: '0.85' },
  { url: 'https://shalasahayak.in/incharge-portal/udise/student', freq: 'weekly', prio: '0.85' },
  { url: 'https://shalasahayak.in/incharge-portal/udise/formats', freq: 'weekly', prio: '0.85' },
  { url: 'https://shalasahayak.in/incharge-portal/udise/report', freq: 'weekly', prio: '0.85' },
  { url: 'https://shalasahayak.in/incharge-portal/udise/help', freq: 'weekly', prio: '0.80' },
  { url: 'https://shalasahayak.in/incharge-lado', freq: 'weekly', prio: '0.85' },
  { url: 'https://shalasahayak.in/incharge-elc', freq: 'weekly', prio: '0.80' },
  { url: 'https://shalasahayak.in/incharge-qrcode', freq: 'weekly', prio: '0.80' },
  { url: 'https://shalasahayak.in/incharge-dutyroster', freq: 'weekly', prio: '0.85' },
  { url: 'https://shalasahayak.in/incharge-assembly', freq: 'weekly', prio: '0.85' }
];

const teacherUrls = [
  { url: 'https://shalasahayak.in/teacher-tools', freq: 'daily', prio: '0.95' },
  { url: 'https://shalasahayak.in/teacher/pti/kridashulk', freq: 'daily', prio: '0.95' },
  { url: 'https://shalasahayak.in/teacher-pti/healthbmi', freq: 'weekly', prio: '0.90' },
  { url: 'https://shalasahayak.in/teacher-pti/sportsstock', freq: 'weekly', prio: '0.85' },
  { url: 'https://shalasahayak.in/teacher-pti/ptgrading', freq: 'weekly', prio: '0.85' },
  { url: 'https://shalasahayak.in/teacher-marksheet/greensheet', freq: 'weekly', prio: '0.90' },
  { url: 'https://shalasahayak.in/teacher-anomaly/verification', freq: 'weekly', prio: '0.85' },
  { url: 'https://shalasahayak.in/teacher-diary/lessonplanner', freq: 'daily', prio: '0.90' },
  { url: 'https://shalasahayak.in/teacher-library/catalogue', freq: 'weekly', prio: '0.85' },
  { url: 'https://shalasahayak.in/teacher-computer/equipmentstock', freq: 'weekly', prio: '0.85' }
];

const ptiUrls = [
  { url: 'https://shalasahayak.in/teacher/pti/kridashulk', freq: 'daily', prio: '0.95' },
  { url: 'https://shalasahayak.in/teacher-pti/healthbmi', freq: 'weekly', prio: '0.90' },
  { url: 'https://shalasahayak.in/teacher-pti/sportsstock', freq: 'weekly', prio: '0.85' },
  { url: 'https://shalasahayak.in/teacher-pti/ptgrading', freq: 'weekly', prio: '0.85' }
];

const studentUrls = [
  { url: 'https://shalasahayak.in/student', freq: 'weekly', prio: '0.85' },
  { url: 'https://shalasahayak.in/student/timetable', freq: 'weekly', prio: '0.80' },
  { url: 'https://shalasahayak.in/student/homework', freq: 'weekly', prio: '0.80' },
  { url: 'https://shalasahayak.in/student/datesheet', freq: 'weekly', prio: '0.80' },
  { url: 'https://shalasahayak.in/student/syllabus', freq: 'weekly', prio: '0.80' },
  { url: 'https://shalasahayak.in/student/doubts', freq: 'weekly', prio: '0.80' }
];

const portalsUrls = [
  { url: 'https://shalasahayak.in/quick', freq: 'daily', prio: '0.90' },
  { url: 'https://shalasahayak.in/portals-calculator/salary', freq: 'weekly', prio: '0.90' },
  { url: 'https://shalasahayak.in/portals-formats/download', freq: 'weekly', prio: '0.90' },
  { url: 'https://shalasahayak.in/invitation', freq: 'weekly', prio: '0.85' },
  { url: 'https://shalasahayak.in/invitation/independence', freq: 'weekly', prio: '0.90' }
];

const helpUrls = [
  { url: 'https://shalasahayak.in/help', freq: 'weekly', prio: '0.90' },
  { url: 'https://shalasahayak.in/blogs', freq: 'weekly', prio: '0.90' },
  { url: 'https://shalasahayak.in/blogs/guides', freq: 'weekly', prio: '0.85' },
  { url: 'https://shalasahayak.in/blogs/hub', freq: 'weekly', prio: '0.85' },
  { url: 'https://shalasahayak.in/blogs/videos', freq: 'weekly', prio: '0.80' }
];

function buildXml(urls) {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
  for (const item of urls) {
    xml += `  <url>\n    <loc>${item.url}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${item.freq}</changefreq>\n    <priority>${item.prio}</priority>\n  </url>\n`;
  }
  xml += `</urlset>\n`;
  return xml;
}

// Master All URLs deduplicated
const allMap = new Map();
[...coreUrls, ...peeoUrls, ...inchargeUrls, ...teacherUrls, ...ptiUrls, ...studentUrls, ...portalsUrls, ...helpUrls].forEach(item => {
  if (!allMap.has(item.url)) {
    allMap.set(item.url, item);
  }
});
const allUrls = Array.from(allMap.values());

// Generate Master XML
const masterXml = buildXml(allUrls);
const coreXml = buildXml(coreUrls);
const peeoXml = buildXml(peeoUrls);
const inchargeXml = buildXml(inchargeUrls);
const teacherXml = buildXml(teacherUrls);
const ptiXml = buildXml(ptiUrls);
const studentXml = buildXml(studentUrls);
const portalsXml = buildXml(portalsUrls);
const helpXml = buildXml(helpUrls);

// Generate sitemap.txt
const sitemapTxt = allUrls.map(u => u.url).join('\n') + '\n';

const targets = [
  { dir: 'public', file: 'sitemap.xml', content: masterXml },
  { dir: 'public', file: 'sitemap-core.xml', content: coreXml },
  { dir: 'public', file: 'sitemap-peeo.xml', content: peeoXml },
  { dir: 'public', file: 'sitemap-incharge.xml', content: inchargeXml },
  { dir: 'public', file: 'sitemap-teacher.xml', content: teacherXml },
  { dir: 'public', file: 'sitemap-pti.xml', content: ptiXml },
  { dir: 'public', file: 'sitemap-student.xml', content: studentXml },
  { dir: 'public', file: 'sitemap-portals.xml', content: portalsXml },
  { dir: 'public', file: 'sitemap-help.xml', content: helpXml },
  { dir: 'public', file: 'sitemap.txt', content: sitemapTxt },

  { dir: '.', file: 'sitemap.xml', content: masterXml },
  { dir: '.', file: 'sitemap-core.xml', content: coreXml },
  { dir: '.', file: 'sitemap-peeo.xml', content: peeoXml },
  { dir: '.', file: 'sitemap-incharge.xml', content: inchargeXml },
  { dir: '.', file: 'sitemap-teacher.xml', content: teacherXml },
  { dir: '.', file: 'sitemap-pti.xml', content: ptiXml },
  { dir: '.', file: 'sitemap-student.xml', content: studentXml },
  { dir: '.', file: 'sitemap-portals.xml', content: portalsXml },
  { dir: '.', file: 'sitemap-help.xml', content: helpXml }
];

targets.forEach(t => {
  const filePath = path.join(t.dir, t.file);
  fs.writeFileSync(filePath, t.content, 'utf-8');
  console.log(`Generated ${filePath}`);
});

console.log('All sitemap files generated successfully!');
