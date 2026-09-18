import { HelpGuide } from '../../types';
import { peeoGuides } from './peeoGuides';
import { teacherGuides } from './teacherGuides';
import { inchargeGuides } from './inchargeGuides';
import { portalGuides } from './portalGuides';

export const ALL_HELP_GUIDES: HelpGuide[] = [
  ...peeoGuides,
  ...teacherGuides,
  ...inchargeGuides,
  ...portalGuides
];

export function getHelpGuideById(id: string): HelpGuide | undefined {
  return ALL_HELP_GUIDES.find(guide => guide.id === id);
}

export function getHelpGuideByToolId(toolId: string): HelpGuide | undefined {
  return ALL_HELP_GUIDES.find(guide => guide.toolId === toolId);
}

export function getHelpGuidesByCategory(categoryKey: string): HelpGuide[] {
  return ALL_HELP_GUIDES.filter(guide => guide.categoryKey === categoryKey);
}

export function searchHelpGuides(query: string): HelpGuide[] {
  if (!query || !query.trim()) return ALL_HELP_GUIDES;
  const q = query.toLowerCase().trim();
  return ALL_HELP_GUIDES.filter(guide => 
    guide.titleHi.toLowerCase().includes(q) ||
    guide.titleEn.toLowerCase().includes(q) ||
    guide.summaryHi.toLowerCase().includes(q) ||
    guide.summaryEn.toLowerCase().includes(q) ||
    guide.seoMeta.metaDescription.toLowerCase().includes(q) ||
    guide.seoMeta.titleTag.toLowerCase().includes(q) ||
    guide.overviewHi.toLowerCase().includes(q)
  );
}

export { peeoGuides, teacherGuides, inchargeGuides, portalGuides };
