import React, { useState, useRef, useMemo } from 'react';
import * as XLSX from 'xlsx';
import { 
  Upload, 
  FileSpreadsheet, 
  Download, 
  Sparkles, 
  Eye, 
  Edit3, 
  Plus, 
  Trash2, 
  Search, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle, 
  Printer, 
  Copy, 
  Check, 
  Filter,
  FileText,
  HelpCircle,
  Layers,
  ArrowUpDown
} from 'lucide-react';
import { Language } from '../../types';
import { 
  convertKrutiDevToUnicode, 
  convertSheetDataKrutiToUnicode, 
  isLikelyKrutiDev 
} from '../../utils/krutidevConverter';

interface ExcelSheetUnicodeModuleProps {
  lang: Language;
}

interface SheetInfo {
  name: string;
  originalData: any[][];
  convertedData: any[][];
  activeData: any[][];
}

// Sample legacy KrutiDev school staff / student list for instant 1-click testing
const SAMPLE_KRUTIDEV_SHEET: any[][] = [
  ['Øekad', 'dkfeZd dk uke', 'firk dk uke', 'in / fo"k;', 'fo|ky; dk uke', 'eksckby', 'LFkk;h irk'],
  ['1', "jkes'oj izlkn 'kekZ", "Jh jkeukjk;.k 'kekZ", 'iz/kkukpk;Z (L-14)', 'jk-m-ek-fo- jkeiqjk (t;iqj)', '9414012345', 'xzke jkeiqjk] rglhy cLlht;iqj'],
  ['2', "lqjs'k dqekj eh.kk", 'Jh dUgS;kyky eh.kk', 'izk/;kid (fgUnh)', 'jk-m-ek-fo- jkeiqjk (t;iqj)', '9414123456', 'd{kk 12 fgUnh izHkkjh] nkSlk'],
  ['3', 'Jherh lqfurk jkBkSM+', 'Jh Hkaoj flag jkBkSM+', 'ofj"B v/;kid (foKku)', 'jk-m-ek-fo- jkeiqjk (t;iqj)', '9829012345', "IykWV 45] 'kkL=h uxj] t;iqj"],
  ['4', 'eukst dqekj oekZ', "Jh f'koukjk;.k oekZ", 'v/;kid ysoy-2 (xf.kr)', 'jk-m-ek-fo- jkeiqjk (t;iqj)', '9785012345', 'xzke cksjh] ftyk vyoj'],
  ['5', 'Jherh iwtk xkSre', 'Jh latho xkSre', 'v/;kid ysoy-1 (L-10)', 'jk-m-ek-fo- jkeiqjk (t;iqj)', '9602012345', 'gkml 12] fo|k/kj uxj] t;iqj'],
  ['6', "jkes'k panz lksuh", "Jh dSyk'k panz lksuh", 'dfu"B lgk;d (LDC)', 'jk-m-ek-fo- jkeiqjk (t;iqj)', '9928012345', 'okMZ ua- 8] cLlht;iqj'],
  ['7', "foØe flag 'ks[kkor", "Jh izrki flag 'ks[kkor", "'kkjhfjd f'k{kd (PTI)", 'jk-m-ek-fo- jkeiqjk (t;iqj)', '9887012345', 'lhdkj jksM] t;iqj']
];

export const ExcelSheetUnicodeModule: React.FC<ExcelSheetUnicodeModuleProps> = ({ lang }) => {
  const isHi = lang === 'hi';
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Workbook sheets state
  const [fileName, setFileName] = useState<string>('Rajasthan_School_Staff_List.xlsx');
  const [sheets, setSheets] = useState<SheetInfo[]>(() => {
    const { convertedData } = convertSheetDataKrutiToUnicode(SAMPLE_KRUTIDEV_SHEET, { forceAll: true });
    return [{
      name: 'Staff_List_Krutidev',
      originalData: SAMPLE_KRUTIDEV_SHEET,
      convertedData: convertedData,
      activeData: convertedData
    }];
  });
  const [activeSheetIndex, setActiveSheetIndex] = useState<number>(0);
  
  // View mode: Converted Unicode vs Original Raw KrutiDev
  const [viewMode, setViewMode] = useState<'unicode' | 'raw'>('unicode');
  
  // Search & Pagination
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [pageSize, setPageSize] = useState<number>(25);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Cell Editing
  const [editingCell, setEditingCell] = useState<{ rowIdx: number; colIdx: number } | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);

  const activeSheet = sheets[activeSheetIndex] || sheets[0];

  // Total KrutiDev converted cells count
  const convertedCellsCount = useMemo(() => {
    if (!activeSheet) return 0;
    let count = 0;
    activeSheet.originalData.forEach((row, rIdx) => {
      row.forEach((cell, cIdx) => {
        const conv = activeSheet.convertedData[rIdx]?.[cIdx];
        if (typeof cell === 'string' && cell !== conv) {
          count++;
        }
      });
    });
    return count;
  }, [activeSheet]);

  // Handle File Upload (.xlsx, .xls, .csv)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const buffer = event.target?.result;
        const workbook = XLSX.read(buffer, { type: 'binary' });
        
        const newSheets: SheetInfo[] = [];

        workbook.SheetNames.forEach((sheetName) => {
          const worksheet = workbook.Sheets[sheetName];
          const rawMatrix: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });
          
          if (rawMatrix.length > 0) {
            // Auto convert KrutiDev cells to Unicode
            const { convertedData } = convertSheetDataKrutiToUnicode(rawMatrix, { forceAll: true });
            newSheets.push({
              name: sheetName,
              originalData: rawMatrix,
              convertedData: convertedData,
              activeData: convertedData
            });
          }
        });

        if (newSheets.length > 0) {
          setSheets(newSheets);
          setActiveSheetIndex(0);
          setViewMode('unicode');
          setCurrentPage(1);
          setNotification(isHi 
            ? `फ़ाइल सफलता से लोड हुई! कुल ${newSheets.length} शीट्स तैयार हैं।` 
            : `File loaded successfully! Total ${newSheets.length} sheets converted.`);
          setTimeout(() => setNotification(null), 4000);
        }
      } catch (err) {
        console.error('Error parsing excel file', err);
        alert(isHi ? 'एक्सेल फ़ाइल लोड करने में त्रुटि हुई।' : 'Error loading excel file.');
      }
    };

    reader.readAsBinaryString(file);
    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Switch between Converted Unicode and Original Raw
  const handleViewModeToggle = (mode: 'unicode' | 'raw') => {
    setViewMode(mode);
    setSheets(prev => prev.map((s, idx) => {
      if (idx !== activeSheetIndex) return s;
      return {
        ...s,
        activeData: mode === 'unicode' ? s.convertedData : s.originalData
      };
    }));
  };

  // Start Cell Editing
  const startEditing = (rowIdx: number, colIdx: number, currentVal: any) => {
    setEditingCell({ rowIdx, colIdx });
    setEditValue(currentVal !== undefined && currentVal !== null ? String(currentVal) : '');
  };

  // Save Cell Edit
  const saveCellEdit = () => {
    if (!editingCell) return;
    const { rowIdx, colIdx } = editingCell;

    setSheets(prev => prev.map((s, idx) => {
      if (idx !== activeSheetIndex) return s;
      
      const updatedActive = s.activeData.map((row, r) => {
        if (r !== rowIdx) return row;
        const newRow = [...row];
        newRow[colIdx] = editValue;
        return newRow;
      });

      const updatedConverted = s.convertedData.map((row, r) => {
        if (r !== rowIdx) return row;
        const newRow = [...row];
        newRow[colIdx] = editValue;
        return newRow;
      });

      return {
        ...s,
        activeData: updatedActive,
        convertedData: updatedConverted
      };
    }));

    setEditingCell(null);
  };

  // Add New Row
  const handleAddRow = () => {
    if (!activeSheet) return;
    const colCount = activeSheet.activeData[0]?.length || 5;
    const emptyRow = new Array(colCount).fill('');
    emptyRow[0] = String(activeSheet.activeData.length);

    setSheets(prev => prev.map((s, idx) => {
      if (idx !== activeSheetIndex) return s;
      return {
        ...s,
        activeData: [...s.activeData, emptyRow],
        convertedData: [...s.convertedData, emptyRow],
        originalData: [...s.originalData, emptyRow]
      };
    }));
  };

  // Delete Row
  const handleDeleteRow = (targetRowIdx: number) => {
    if (!confirm(isHi ? 'क्या आप इस पंक्ति को हटाना चाहते हैं?' : 'Delete this row?')) return;
    setSheets(prev => prev.map((s, idx) => {
      if (idx !== activeSheetIndex) return s;
      return {
        ...s,
        activeData: s.activeData.filter((_, r) => r !== targetRowIdx),
        convertedData: s.convertedData.filter((_, r) => r !== targetRowIdx),
        originalData: s.originalData.filter((_, r) => r !== targetRowIdx)
      };
    }));
  };

  // Load Sample KrutiDev File
  const handleLoadSample = () => {
    const { convertedData } = convertSheetDataKrutiToUnicode(SAMPLE_KRUTIDEV_SHEET, { forceAll: true });
    setFileName('Rajasthan_Education_Sample_Krutidev.xlsx');
    setSheets([{
      name: 'Sample_School_Staff',
      originalData: SAMPLE_KRUTIDEV_SHEET,
      convertedData: convertedData,
      activeData: convertedData
    }]);
    setActiveSheetIndex(0);
    setViewMode('unicode');
    setNotification(isHi ? 'नमूना कृतिदेव फ़ाइल लोड की गई!' : 'Sample KrutiDev file loaded!');
    setTimeout(() => setNotification(null), 3000);
  };

  // Filter rows based on search
  const filteredRows = useMemo(() => {
    if (!activeSheet || !activeSheet.activeData) return [];
    if (!searchTerm.trim()) return activeSheet.activeData;

    const term = searchTerm.toLowerCase();
    return activeSheet.activeData.filter((row, idx) => {
      if (idx === 0) return true; // Always keep header row
      return row.some(cell => String(cell).toLowerCase().includes(term));
    });
  }, [activeSheet, searchTerm]);

  // Headers (Row 0) and Body Rows (Row 1+)
  const headerRow = filteredRows[0] || [];
  const bodyRows = filteredRows.slice(1);

  // Pagination
  const totalPages = Math.ceil(bodyRows.length / pageSize) || 1;
  const paginatedBodyRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return bodyRows.slice(start, start + pageSize);
  }, [bodyRows, currentPage, pageSize]);

  // Download Converted Sheet as XLSX
  const handleDownloadXLSX = () => {
    if (!activeSheet) return;
    const wb = XLSX.utils.book_new();

    sheets.forEach((sheet) => {
      const ws = XLSX.utils.aoa_to_sheet(sheet.convertedData);
      XLSX.utils.book_append_sheet(wb, ws, sheet.name.substring(0, 31));
    });

    const exportName = fileName.replace(/\.[^/.]+$/, "") + "_Unicode_Hindi.xlsx";
    XLSX.writeFile(wb, exportName);
  };

  // Download as CSV with UTF-8 BOM
  const handleDownloadCSV = () => {
    if (!activeSheet) return;
    const ws = XLSX.utils.aoa_to_sheet(activeSheet.convertedData);
    const csvContent = XLSX.utils.sheet_to_csv(ws);
    
    // Add UTF-8 BOM (\uFEFF) so Excel opens Hindi Unicode without garbling
    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = (fileName.replace(/\.[^/.]+$/, "") || "Sheet") + "_Unicode.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Copy table to clipboard
  const handleCopyClipboard = () => {
    if (!activeSheet) return;
    const tsv = activeSheet.convertedData.map(r => r.join('\t')).join('\n');
    navigator.clipboard.writeText(tsv);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-8">
      {/* Header Banner */}
      <div className="p-4 sm:p-6 rounded-3xl bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white shadow-xl border border-emerald-700/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center shrink-0 shadow-inner">
            <FileSpreadsheet className="w-6 h-6 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg sm:text-2xl font-black tracking-tight">
                {isHi ? 'एक्सेल शीट व्यूअर, यूनिकोड कन्वर्टर एवं एडिटर' : 'Excel Sheet Viewer, KrutiDev Converter & Editor'}
              </h2>
              <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 shadow-xs">
                {isHi ? 'अति-महत्वपूर्ण टूल' : 'Essential Tool'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-emerald-200/90 font-medium mt-1">
              {isHi 
                ? 'किसी भी .xlsx, .xls, .csv फ़ाइल को अपलोड करें • कृतिदेव (KrutiDev 010) / देवलास (DevLys) को शुद्ध हिंदी यूनिकोड में स्वतः बदलें, एडिट करें व डाउनलोड करें'
                : 'Upload any Excel/CSV file • Auto-convert KrutiDev/DevLys legacy Hindi to pure Hindi Unicode • View, inline edit & download'}
            </p>
          </div>
        </div>

        {/* Upload & Sample Buttons */}
        <div className="flex items-center gap-2 shrink-0 self-end md:self-center flex-wrap">
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleFileUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black transition-all flex items-center space-x-1.5 shadow-md active:scale-95 cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <span>{isHi ? 'फ़ाइल अपलोड करें (.xlsx / .csv)' : 'Upload Excel (.xlsx/.csv)'}</span>
          </button>
          <button
            onClick={handleLoadSample}
            className="px-3 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition-all flex items-center space-x-1.5 border border-white/20 cursor-pointer"
            title="Load sample KrutiDev file"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{isHi ? 'नमूना कृतिदेव शीट' : 'Sample KrutiDev Sheet'}</span>
          </button>
        </div>
      </div>

      {/* Notification Banner */}
      {notification && (
        <div className="p-3 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200 text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* KrutiDev Conversion Stats & Mode Switcher Bar */}
      <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Left: Active File Info & Conversion Count */}
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-extrabold text-sm text-slate-900 dark:text-slate-100 truncate max-w-xs">
                {fileName}
              </span>
              <span className="text-[11px] font-black px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300">
                {isHi ? `⚡ ${convertedCellsCount} सेल यूनिकोड में कनवर्टेड` : `⚡ ${convertedCellsCount} Cells Converted`}
              </span>
            </div>
            <span className="text-xs text-slate-500 block">
              {isHi ? `कुल ${activeSheet?.activeData.length || 0} पंक्तियां • ${activeSheet?.activeData[0]?.length || 0} कॉलम` : `${activeSheet?.activeData.length || 0} rows • ${activeSheet?.activeData[0]?.length || 0} columns`}
            </span>
          </div>
        </div>

        {/* Right: View Mode Toggle & Actions */}
        <div className="flex items-center space-x-2 shrink-0 flex-wrap gap-y-2">
          {/* View Toggle: Unicode vs Raw KrutiDev */}
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <button
              onClick={() => handleViewModeToggle('unicode')}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all flex items-center space-x-1 cursor-pointer ${
                viewMode === 'unicode'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{isHi ? 'यूनिकोड हिंदी (Unicode)' : 'Hindi Unicode'}</span>
            </button>
            <button
              onClick={() => handleViewModeToggle('raw')}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all flex items-center space-x-1 cursor-pointer ${
                viewMode === 'raw'
                  ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{isHi ? 'मूल फ़ाइल (Raw / कृतिदेव)' : 'Raw Legacy Font'}</span>
            </button>
          </div>

          {/* Add Row */}
          <button
            onClick={handleAddRow}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all flex items-center space-x-1 cursor-pointer"
            title="Add row"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-600" />
            <span>{isHi ? 'पंक्ति जोड़ें' : 'Add Row'}</span>
          </button>

          {/* Download Dropdown / Buttons */}
          <button
            onClick={handleDownloadXLSX}
            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black transition-all flex items-center space-x-1.5 shadow-xs active:scale-95 cursor-pointer"
            title="Download pure Hindi Unicode Excel (.xlsx)"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isHi ? 'डाउनलोड Excel (.xlsx)' : 'Download .xlsx'}</span>
          </button>

          <button
            onClick={handleDownloadCSV}
            className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all cursor-pointer"
            title="Download as CSV with UTF-8 BOM"
          >
            <span>.CSV</span>
          </button>

          <button
            onClick={handleCopyClipboard}
            className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-all cursor-pointer"
            title={isCopied ? 'Copied!' : 'Copy to clipboard'}
          >
            {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>

      </div>

      {/* Sheets Tab Bar (if workbook has multiple sheets) */}
      {sheets.length > 1 && (
        <div className="flex items-center space-x-2 border-b border-slate-200 dark:border-slate-800 pb-1 overflow-x-auto">
          <span className="text-xs font-bold text-slate-500 px-2 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5" />
            <span>{isHi ? 'शीट्स:' : 'Sheets:'}</span>
          </span>
          {sheets.map((s, idx) => (
            <button
              key={idx}
              onClick={() => {
                setActiveSheetIndex(idx);
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-t-xl text-xs font-bold transition-colors cursor-pointer border-t border-x ${
                activeSheetIndex === idx
                  ? 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 border-transparent text-slate-600 dark:text-slate-400'
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder={isHi ? 'शीट में खोजें (नाम, पद, विद्यालय...)' : 'Search in sheet...'}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center space-x-2 shrink-0 self-end sm:self-auto text-xs font-semibold text-slate-600 dark:text-slate-400">
          <span>{isHi ? 'प्रति पृष्ठ पंक्तियां:' : 'Rows per page:'}</span>
          <select
            value={pageSize}
            onChange={e => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="px-2 py-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value={99999}>{isHi ? 'सभी पंक्तियां' : 'All'}</option>
          </select>
        </div>
      </div>

      {/* Spreadsheet Interactive Grid */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto max-h-[600px] relative">
          <table className="w-full text-left text-xs border-collapse">
            {/* Table Header (Row 0) */}
            <thead className="sticky top-0 z-10 bg-slate-100 dark:bg-slate-800 border-b border-slate-300 dark:border-slate-700 font-black text-slate-800 dark:text-slate-200 shadow-xs">
              <tr>
                <th className="py-2.5 px-3 w-12 text-center text-slate-400 bg-slate-200/60 dark:bg-slate-800/90">#</th>
                {headerRow.map((colHeader, cIdx) => (
                  <th key={cIdx} className="py-2.5 px-3 whitespace-nowrap font-black border-r border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between gap-2">
                      <span>{String(colHeader || `कॉलम ${cIdx + 1}`)}</span>
                    </div>
                  </th>
                ))}
                <th className="py-2.5 px-3 w-16 text-center">{isHi ? 'कार्य' : 'Action'}</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium text-slate-800 dark:text-slate-200">
              {paginatedBodyRows.length === 0 ? (
                <tr>
                  <td colSpan={headerRow.length + 2} className="py-8 text-center text-slate-500 font-bold">
                    {isHi ? 'कोई रिकॉर्ड नहीं मिला।' : 'No records found.'}
                  </td>
                </tr>
              ) : (
                paginatedBodyRows.map((row, rIdx) => {
                  const actualRowIdx = (currentPage - 1) * pageSize + rIdx + 1;
                  return (
                    <tr 
                      key={actualRowIdx} 
                      className="hover:bg-emerald-50/40 dark:hover:bg-emerald-950/20 transition-colors group"
                    >
                      {/* Row Index */}
                      <td className="py-2 px-3 text-center text-slate-400 font-bold bg-slate-50/60 dark:bg-slate-800/40 select-none">
                        {actualRowIdx}
                      </td>

                      {/* Row Data Cells */}
                      {row.map((cellValue, cIdx) => {
                        const isEditingThis = editingCell?.rowIdx === actualRowIdx && editingCell?.colIdx === cIdx;
                        return (
                          <td 
                            key={cIdx}
                            onDoubleClick={() => startEditing(actualRowIdx, cIdx, cellValue)}
                            className="py-2 px-3 border-r border-slate-100 dark:border-slate-800/60 relative cursor-pointer group-hover:border-emerald-200/50"
                          >
                            {isEditingThis ? (
                              <div className="flex items-center space-x-1">
                                <input
                                  type="text"
                                  autoFocus
                                  value={editValue}
                                  onChange={e => setEditValue(e.target.value)}
                                  onKeyDown={e => {
                                    if (e.key === 'Enter') saveCellEdit();
                                    if (e.key === 'Escape') setEditingCell(null);
                                  }}
                                  className="w-full px-2 py-1 text-xs border border-emerald-500 rounded bg-white dark:bg-slate-800 font-bold text-slate-900 dark:text-slate-100 focus:outline-none"
                                />
                                <button
                                  onClick={saveCellEdit}
                                  className="p-1 rounded bg-emerald-600 text-white hover:bg-emerald-500"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center justify-between group/cell">
                                <span className="font-semibold">{String(cellValue ?? '')}</span>
                                <button
                                  onClick={() => startEditing(actualRowIdx, cIdx, cellValue)}
                                  className="opacity-0 group-hover/cell:opacity-100 text-slate-400 hover:text-emerald-600 p-0.5 transition-opacity"
                                  title="Edit cell"
                                >
                                  <Edit3 className="w-3 h-3" />
                                </button>
                              </div>
                            )}
                          </td>
                        );
                      })}

                      {/* Delete Row Action */}
                      <td className="py-2 px-3 text-center">
                        <button
                          onClick={() => handleDeleteRow(actualRowIdx)}
                          className="opacity-0 group-hover:opacity-100 p-1 rounded-lg text-slate-400 hover:text-rose-600 transition-opacity cursor-pointer"
                          title="Delete row"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-bold text-slate-600 dark:text-slate-400">
          <span>
            {isHi
              ? `कुल ${bodyRows.length} में से ${(currentPage - 1) * pageSize + 1} से ${Math.min(currentPage * pageSize, bodyRows.length)} प्रदर्शित`
              : `Showing ${(currentPage - 1) * pageSize + 1} to ${Math.min(currentPage * pageSize, bodyRows.length)} of ${bodyRows.length} rows`}
          </span>

          <div className="flex items-center space-x-1">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-2.5 py-1 rounded-lg border border-slate-300 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
            >
              {isHi ? 'पिछला' : 'Previous'}
            </button>
            <span className="px-2 py-1 text-slate-800 dark:text-slate-200 font-extrabold">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-2.5 py-1 rounded-lg border border-slate-300 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
            >
              {isHi ? 'अगला' : 'Next'}
            </button>
          </div>
        </div>

      </div>

      {/* Helpful Instructions Card for Teachers */}
      <div className="p-4 rounded-3xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold">
            {isHi
              ? '💡 शिक्षकों एवं संस्था प्रधानों के लिए उपयोगी जानकारी:'
              : '💡 Useful Information for Educators and Office Clerks:'}
          </p>
          <p className="leading-relaxed text-[11px] text-amber-800/90 dark:text-amber-300/90">
            {isHi
              ? 'शाला दर्पण, पे-मैनेजर या पुरानी एक्सेल फ़ाइलों में कृतिदेव 010 (Kruti Dev) अथवा देवलास 010 में लिखे नाम (जैसे "fo|ky;", "jktLFkku", "iz/kkukpk;Z") आधुनिक मोबाइल एवं कंप्यूटर में समझ नहीं आते। यह टूल उन्हें 100% शुद्ध हिंदी यूनिकोड में स्वतः बदलकर प्रस्तुत करता है। किसी भी सेल पर डबल-क्लिक कर संपादन (Edit) करें और "डाउनलोड Excel (.xlsx)" से शुद्ध हिंदी फ़ाइल प्राप्त करें।'
              : 'Legacy Shala Darpan or offline Excel files typed in Kruti Dev 010 / DevLys appear garbled on mobile devices and modern computers. This tool converts them into pure Hindi Unicode automatically. Double-click any cell to edit inline, and download clean, universally readable Excel files.'}
          </p>
        </div>
      </div>

    </div>
  );
};
