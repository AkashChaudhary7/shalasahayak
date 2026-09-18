import html2canvas, { Options } from 'html2canvas';

/**
 * Recursively and iteratively replaces unsupported modern CSS color functions
 * like oklab(), oklch(), color-mix(), light-dark(), color(srgb ...) with safe fallbacks (#000000 or transparent).
 */
export const replaceUnsupportedColorFunctions = (cssText: string): string => {
  if (!cssText) return '';

  let cleaned = cssText;

  // Patterns for modern color functions that html2canvas parser fails on
  const patterns = [
    /oklab\s*\((?:[^()]+|\((?:[^()]+|\([^()]*\))*\))*\)/gi,
    /oklch\s*\((?:[^()]+|\((?:[^()]+|\([^()]*\))*\))*\)/gi,
    /color-mix\s*\((?:[^()]+|\((?:[^()]+|\([^()]*\))*\))*\)/gi,
    /light-dark\s*\((?:[^()]+|\((?:[^()]+|\([^()]*\))*\))*\)/gi,
    /color\s*\(\s*srgb\s+(?:[^()]+|\((?:[^()]+|\([^()]*\))*\))*\)/gi,
  ];

  let previous = '';
  let iterations = 0;
  while (cleaned !== previous && iterations < 5) {
    previous = cleaned;
    iterations++;
    for (const pattern of patterns) {
      cleaned = cleaned.replace(pattern, '#000000');
    }
  }

  // Fallback regex for multi-line or residual oklab/oklch functions
  return cleaned
    .replace(/oklab\([\s\S]*?\)/gi, '#000000')
    .replace(/oklch\([\s\S]*?\)/gi, '#000000')
    .replace(/color-mix\([\s\S]*?\)/gi, '#000000')
    .replace(/light-dark\([\s\S]*?\)/gi, '#000000')
    .replace(/color\(srgb[\s\S]*?\)/gi, '#000000');
};

/**
 * Sanitizes document stylesheets and elements before html2canvas processes them.
 * Tailwind v4 outputs oklab() and oklch() colors in stylesheets which
 * causes html2canvas to fail with "Attempting to parse an unsupported color function 'oklab'".
 */
export const cleanClonedDocForCanvas = (clonedDoc: Document, clonedElement?: HTMLElement) => {
  try {
    // 1. Sanitize all <style> tags in the cloned document and re-create nodes to force CSSOM re-parsing
    const styleTags = clonedDoc.querySelectorAll('style');
    styleTags.forEach((style) => {
      if (style.textContent && (
        style.textContent.includes('oklab') ||
        style.textContent.includes('oklch') ||
        style.textContent.includes('color-mix') ||
        style.textContent.includes('light-dark') ||
        style.textContent.includes('color(srgb')
      )) {
        const cleanedCss = replaceUnsupportedColorFunctions(style.textContent);
        style.textContent = cleanedCss;

        // Replace node to ensure browser CSSOM refreshes
        const newStyle = clonedDoc.createElement('style');
        newStyle.textContent = cleanedCss;
        style.parentNode?.replaceChild(newStyle, style);
      }
    });

    // 2. Sanitize main document <style> tags as well if html2canvas inspects document.styleSheets
    if (typeof window !== 'undefined' && window.document) {
      const mainStyles = window.document.querySelectorAll('style');
      mainStyles.forEach((style) => {
        if (style.textContent && (
          style.textContent.includes('oklab') ||
          style.textContent.includes('oklch') ||
          style.textContent.includes('color-mix') ||
          style.textContent.includes('light-dark') ||
          style.textContent.includes('color(srgb')
        )) {
          style.textContent = replaceUnsupportedColorFunctions(style.textContent);
        }
      });
    }

    // 3. Clean inline styles on all DOM elements in cloned document
    const allElements = clonedDoc.querySelectorAll('*');
    allElements.forEach((el) => {
      const htmlEl = el as HTMLElement;
      if (htmlEl.style && htmlEl.style.cssText) {
        if (
          htmlEl.style.cssText.includes('oklab') ||
          htmlEl.style.cssText.includes('oklch') ||
          htmlEl.style.cssText.includes('color-mix') ||
          htmlEl.style.cssText.includes('light-dark') ||
          htmlEl.style.cssText.includes('color(srgb')
        ) {
          htmlEl.style.cssText = replaceUnsupportedColorFunctions(htmlEl.style.cssText);
        }
      }
    });
  } catch (err) {
    console.warn('Error cleaning cloned document for html2canvas:', err);
  }
};

/**
 * Safe wrapper around html2canvas that automatically strips unsupported
 * CSS color functions (oklab, oklch) from cloned stylesheets before canvas rendering.
 */
export const safeHtml2Canvas = async (
  element: HTMLElement,
  options: Partial<Options> = {}
): Promise<HTMLCanvasElement> => {
  const userOnClone = options.onclone;

  // Pre-clean main document style tags before html2canvas initializes
  if (typeof window !== 'undefined' && window.document) {
    const mainStyles = window.document.querySelectorAll('style');
    mainStyles.forEach((style) => {
      if (style.textContent && (
        style.textContent.includes('oklab') ||
        style.textContent.includes('oklch') ||
        style.textContent.includes('color-mix') ||
        style.textContent.includes('light-dark') ||
        style.textContent.includes('color(srgb')
      )) {
        style.textContent = replaceUnsupportedColorFunctions(style.textContent);
      }
    });
  }

  const mergedOptions: Partial<Options> = {
    scale: 2,
    useCORS: true,
    logging: false,
    ...options,
    onclone: (clonedDoc: Document, clonedEl: HTMLElement) => {
      cleanClonedDocForCanvas(clonedDoc, clonedEl);
      if (userOnClone) {
        userOnClone(clonedDoc, clonedEl);
      }
    },
  };

  return html2canvas(element, mergedOptions);
};

export default safeHtml2Canvas;

