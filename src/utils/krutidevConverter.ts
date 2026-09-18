/**
 * Kruti Dev 010 / DevLys 010 to Hindi Unicode (Mangal/Devanagari) Converter
 * High-accuracy conversion engine for Rajasthan government & education documents.
 */

// Kruti Dev 010 character mappings to Unicode
const krutiToUnicodeMap: [string, string][] = [
  // Special ligatures and compound characters
  ["ñ", "द्ध"],
  ["ò", "ड्ढ"],
  ["ó", "द्ध"],
  ["ô", "ट्ठ"],
  ["õ", "ठ्ठ"],
  ["ö", "ट्ट"],
  ["÷", "ड्ड"],
  ["ø", "ढ्ढ"],
  ["ù", "त्र"],
  ["ú", "द्र"],
  ["û", "द्य"],
  ["ü", "द्व"],
  ["ý", "ष्ट"],
  ["þ", "ष्ठ"],
  ["ÿ", "ष्ट"],
  ["§", "द्ध"],
  ["ß", "द्द"],
  ["Ñ", "कृ"],
  ["µ", "म्र"],
  ["¶", "प्र"],
  ["º", "०"],
  ["¹", "१"],
  ["²", "२"],
  ["³", "३"],
  ["¼", "¼"],
  ["½", "½"],
  ["¾", "¾"],
  
  // Specific words & prefixes common in Rajasthan Education
  ["fo|ky;", "विद्यालय"],
  ["jktLFkku", "राजस्थान"],
  ["f'k{kk", "शिक्षा"],
  ["f'k{kd", "शिक्षक"],
  ["vkns'k", "आदेश"],
  ["dk;kZy;", "कार्यालय"],
  ["iz/kkukpk;Z", "प्रधानाचार्य"],
  ["d{kk", "कक्षा"],
  ["Nk=k", "छात्रा"],
  ["Nk=", "छात्र"],
  ["fnukad", "दिनांक"],
  ["la[;k", "संख्या"],

  // Standalone Vowels
  ["vks", "ओ"],
  ["vkS", "औ"],
  ["vk", "आ"],
  ["v", "अ"],
  ["bZ", "ई"],
  ["b", "इ"],
  ["m", "उ"],
  ["Å", "ऊ"],
  ["_", "ऋ"],
  ["ए", "ए"],
  ["ऐ", "ऐ"],

  // Matras with 'k' combinations
  ["ks", "ो"],
  ["kS", "ौ"],
  ["k", "ा"],
  ["h", "ी"],
  ["q", "ु"],
  ["w", "ू"],
  ["`", "ृ"],
  ["s", "े"],
  ["S", "ै"],
  ["a", "ं"],
  ["¡", "ँ"],
  ["%", "ः"],
  ["W", "ॅ"],
  ["~", "्"],
  
  // Full consonants
  ["d", "क"],
  ["[k", "ख"],
  ["x", "ग"],
  ["?k", "घ"],
  ["M+", "ङ"],
  ["p", "च"],
  ["N", "छ"],
  ["t", "ज"],
  ["Tk", "झ"],
  ["¥", "ञ"],
  ["V", "ट"],
  ["B", "ठ"],
  ["M", "ड"],
  ["<", "ढ"],
  [".k", "ण"],
  ["r", "त"],
  ["Fk", "थ"],
  ["n", "द"],
  ["/k", "ध"],
  ["u", "न"],
  ["i", "प"],
  ["Q", "फ"],
  ["c", "ब"],
  ["Hk", "भ"],
  ["e", "म"],
  [";", "य"],
  ["j", "र"],
  ["y", "ल"],
  ["o", "व"],
  ["'k", "श"],
  ["\"k", "ष"],
  ["l", "स"],
  ["g", "ह"],
  ["{k", "क्ष"],
  ["=", "त्र"],
  ["K", "ज्ञ"],
  ["J", "श्र"],

  // Half consonants (Halant forms)
  ["D", "क्"],
  ["[", "ख्"],
  ["X", "ग्"],
  ["?", "घ्"],
  ["P", "च्"],
  ["T", "ज्"],
  ["R", "त्"],
  ["F", "थ्"],
  ["/", "ध्"],
  ["U", "न्"],
  ["I", "प्"],
  ["C", "ब्"],
  ["H", "भ्"],
  ["E", "म्"],
  ["Y", "ल्"],
  ["O", "व्"],
  ["S", "श्"],
  ["\"", "ष्"],
  ["L", "स्"],
  
  // Conjuncts / R forms
  ["iz", "प्र"],
  ["oz", "व्र"],
  ["xz", "ग्र"],
  ["cz", "ब्र"],
  ["nz", "द्र"],
  ["Vª", "ट्र"],
  ["Mª", "ड्र"],
  ["ª", "्र"],
  ["z", "्र"],
  
  // Punctuations & Symbols
  ["A", "।"],
  ["\\", "।"],
  ["å", "्"],
  ["'", "'"],
  ["\"", "\""],
  ["+", "़"]
];

/**
 * Main conversion function from Kruti Dev 010 / DevLys 010 string to Unicode
 */
export function convertKrutiDevToUnicode(input: string): string {
  if (!input || typeof input !== 'string') return input;

  let text = input;

  // Step 1: Reorder Reph 'Z'
  // In KrutiDev, Z represents reph (half 'र' sitting on top of the next consonant)
  // But in KrutiDev typing, Z is typed after the consonant/matra!
  // We need to place 'र्' before the consonant cluster
  const rephRegex = /([a-zA-Z~`1234567890\u0900-\u097F]+)Z/g;
  while (text.includes('Z')) {
    const nextText = text.replace(rephRegex, (_match, p1) => {
      return `र्${p1}`;
    });
    if (nextText === text) {
      // If no match found but Z still exists, replace orphan Z
      text = text.replace(/Z/g, 'र्');
      break;
    }
    text = nextText;
  }

  // Step 2: Reorder chhoti 'i' matra 'f'
  // In KrutiDev, 'f' is typed BEFORE the consonant, but in Unicode 'ि' goes AFTER the consonant cluster.
  // E.g. 'fd' -> 'कि', 'fLFk' -> 'स्थि', 'f'k' -> 'शि', 'fiz' -> 'प्रि', 'f{k' -> 'क्षि'
  // Complex cluster regex for KrutiDev:
  // f followed by optional half-letter(s) and a full letter/ligature
  const chotiIRegex = /f([A-Z\[\?\/I\\]*)([a-zA-Zñòóôõö÷øùúûüýþÿ§ßÑµ¶º¹²³¼½¾d\[x?pNtT¥VBM<rkFnuiQcHe;ylo'"l={KJ\+]+)/g;
  text = text.replace(chotiIRegex, (_match, halfLetters, fullLetter) => {
    return `${halfLetters}${fullLetter}f_MATRA_`;
  });

  // Also handle simple single letter cases if any remained
  text = text.replace(/f([a-zA-Z])/g, '$1f_MATRA_');

  // Step 3: Apply the core character replacement map
  for (const [kChar, uChar] of krutiToUnicodeMap) {
    if (text.includes(kChar)) {
      text = text.split(kChar).join(uChar);
    }
  }

  // Step 4: Convert the temporary chhoti 'i' marker to actual Unicode matra 'ि'
  text = text.replace(/f_MATRA_/g, 'ि');

  // Step 5: Clean up any double matras or improper sequences
  text = text.replace(/िा/g, 'ी');
  text = text.replace(/ाे/g, 'ो');
  text = text.replace(/ाै/g, 'ौ');

  return text;
}

/**
 * Heuristic to detect whether a string or dataset is likely Kruti Dev / DevLys 010
 */
export function isLikelyKrutiDev(text: string): boolean {
  if (!text || typeof text !== 'string') return false;
  
  // If text already has lots of Devanagari Unicode characters, it's already Unicode
  const unicodeHindiMatch = text.match(/[\u0900-\u097F]/g);
  if (unicodeHindiMatch && unicodeHindiMatch.length > 5) {
    return false;
  }

  // KrutiDev characteristic patterns
  const krutiPatterns = [
    /f[a-zA-Z]/,          // chhoti i before letter
    /vkns'k/,             // आदेश
    /jktLFkku/,           // राजस्थान
    /fo|ky;/,             // विद्यालय
    /f'k{k/,              // शिक्ष
    /d{kk/,               // कक्षा
    /Nk=/,                // छात्र
    /[a-zA-Z]Z/,          // Reph at end
    /\[k/,                // ख
    /\?k/,                // घ
    /Fk/,                 // थ
    /\/k/,                // ध
    /Hk/,                 // भ
    /'k/,                 // श
    /"k/,                 // ष
    /\.k/,                // ण
    /iz/                  // प्र
  ];

  let matches = 0;
  for (const pat of krutiPatterns) {
    if (pat.test(text)) {
      matches++;
    }
  }

  return matches >= 1;
}

/**
 * Converts a 2D matrix (rows x cols) from Excel/CSV, auto-converting KrutiDev cells to Unicode
 */
export function convertSheetDataKrutiToUnicode(
  data: any[][],
  options: { forceAll?: boolean; targetColumns?: number[] } = {}
): { convertedData: any[][]; convertedCount: number } {
  let convertedCount = 0;

  const convertedData = data.map((row) => {
    if (!Array.isArray(row)) return row;

    return row.map((cellValue, colIndex) => {
      if (cellValue === null || cellValue === undefined) return cellValue;

      // If specific target columns provided and this isn't one of them
      if (options.targetColumns && !options.targetColumns.includes(colIndex)) {
        return cellValue;
      }

      if (typeof cellValue === 'string') {
        const trimmed = cellValue.trim();
        // Check if forced or likely KrutiDev
        if (options.forceAll || isLikelyKrutiDev(trimmed)) {
          const converted = convertKrutiDevToUnicode(cellValue);
          if (converted !== cellValue) {
            convertedCount++;
            return converted;
          }
        }
      }

      return cellValue;
    });
  });

  return { convertedData, convertedCount };
}
