// Rajasthan 7th Pay Commission Pay Matrix Table (Simplified representative matrix for L-1 to L-16)

export interface PayMatrixLevel {
  level: string; // e.g. "L-10"
  designationExamples: string[];
  cells: number[]; // Index 0 is Cell 1
}

export const RAJASTHAN_PAY_MATRIX: PayMatrixLevel[] = [
  {
    level: "L-1",
    designationExamples: ["Class IV Staff", "Peon", "Chowkidar (चतुर्थ श्रेणी कर्मचारी)"],
    cells: [17700, 18200, 18700, 19300, 19900, 20500, 21100, 21700, 22400, 23100, 23800, 24500, 25200, 26000, 26800, 27600, 28400, 29300, 30200, 31100, 32000, 33000, 34000, 35000, 36100, 37200, 38300, 39400, 40600]
  },
  {
    level: "L-5",
    designationExamples: ["Junior Assistant / LDC (कनिष्ठ सहायक)"],
    cells: [20800, 21400, 22000, 22700, 23400, 24100, 24800, 25500, 26300, 27100, 27900, 28700, 29600, 30500, 31400, 32300, 33300, 34300, 35300, 36400, 37500, 38600, 39800, 41000, 42200, 43500, 44800, 46100, 47500]
  },
  {
    level: "L-8",
    designationExamples: ["Senior Assistant / UDC (वरिष्ठ सहायक)"],
    cells: [26300, 27100, 27900, 28700, 29600, 30500, 31400, 32300, 33300, 34300, 35300, 36400, 37500, 38600, 39800, 41000, 42200, 43500, 44800, 46100, 47500, 48900, 50400, 51900, 53500, 55100, 56800, 58500, 60300]
  },
  {
    level: "L-10",
    designationExamples: ["Teacher Grade III (L1/L2)", "Lab Assistant Grade II (तृतीय श्रेणी अध्यापक)"],
    cells: [33800, 34800, 35800, 36900, 38000, 39100, 40300, 41500, 42700, 44000, 45300, 46700, 48100, 49500, 51000, 52500, 54100, 55700, 57400, 59100, 60900, 62700, 64600, 66500, 68500, 70600, 72700, 74900, 77100, 79400]
  },
  {
    level: "L-11",
    designationExamples: ["Teacher Grade II (Senior Teacher / द्वितीय श्रेणी वरिष्ठ अध्यापक)", "Senior Lab Assistant"],
    cells: [37800, 38900, 40100, 41300, 42500, 43800, 45100, 46500, 47900, 49300, 50800, 52300, 53900, 55500, 57200, 58900, 60700, 62500, 64400, 66300, 68300, 70300, 72400, 74600, 76800, 79100, 81500, 83900, 86400, 89000]
  },
  {
    level: "L-12",
    designationExamples: ["Lecturer / School Teacher Grade I (प्राध्यापक स्कूल शिक्षा)", "Physical Education Teacher Grade I"],
    cells: [44300, 45600, 47000, 48400, 49900, 51400, 52900, 54500, 56100, 57800, 59500, 61300, 63100, 65000, 67000, 69000, 71100, 73200, 75400, 77700, 80000, 82400, 84900, 87400, 90000, 92700, 95500, 98400, 101400]
  },
  {
    level: "L-14",
    designationExamples: ["Principal / Vice Principal (प्रधानाचार्य / उप-प्रधानाचार्य)", "PEEO"],
    cells: [56100, 57800, 59500, 61300, 63100, 65000, 67000, 69000, 71100, 73200, 75400, 77700, 80000, 82400, 84900, 87400, 90000, 92700, 95500, 98400, 101400, 104400, 107500, 110700, 114000, 117400, 120900, 124500, 128200]
  },
  {
    level: "L-16",
    designationExamples: ["District Education Officer (DEO)", "Joint Director (संयुक्त निदेशक)"],
    cells: [67300, 69300, 71400, 73500, 75700, 78000, 80300, 82700, 85200, 87800, 90400, 93100, 95900, 98800, 101800, 104900, 108000, 111200, 114500, 117900, 121400, 125000, 128800, 132700, 136700]
  }
];

/**
 * Standard RGHS (Rajasthan Government Health Scheme) deduction per month
 * based on Pay Matrix Level
 */
export function getRghsDeduction(levelCode: string): number {
  const lvlNum = parseInt(levelCode.replace(/[^0-9]/g, ''), 10) || 10;
  if (lvlNum <= 7) return 220;
  if (lvlNum <= 10) return 440;
  if (lvlNum <= 14) return 650;
  return 875;
}

/**
 * Standard State Insurance (SI) standard deduction slab
 * based on Basic Pay
 */
export function getSiStandardSlab(basicPay: number): number {
  if (basicPay <= 22000) return 800;
  if (basicPay <= 28500) return 1200;
  if (basicPay <= 38500) return 2200;
  if (basicPay <= 51500) return 3000;
  if (basicPay <= 72000) return 5000;
  return 7000;
}

/**
 * Minimum GPF deduction slab in Rajasthan (Rules 2021)
 */
export function getGpfMinimumSlab(basicPay: number): number {
  if (basicPay <= 23100) return 1450;
  if (basicPay <= 28500) return 1625;
  if (basicPay <= 38500) return 2100;
  if (basicPay <= 51500) return 2850;
  if (basicPay <= 62000) return 3575;
  if (basicPay <= 72000) return 4200;
  if (basicPay <= 80000) return 4800;
  if (basicPay <= 100000) return 6100;
  return 7000;
}

/**
 * 8th Pay Commission Estimated projection calculation
 * Typically using fitment factor between 1.92 and 2.15
 */
export function calculate8thPayEstimate(basic7th: number, fitmentFactor: number = 1.92): {
  projectedBasic: number;
  projectedDa: number;
  projectedHra: number;
  projectedGross: number;
  gainAmount: number;
} {
  // 8th pay fitment factor applied to 7th Basic
  const rawProjected = basic7th * fitmentFactor;
  // Round to nearest 100
  const projectedBasic = Math.ceil(rawProjected / 100) * 100;
  // Starting DA in new commission is typically 0% to 3%
  const projectedDa = Math.round((projectedBasic * 3) / 100);
  // Expected initial HRA (8% / 16%)
  const projectedHra = Math.round((projectedBasic * 9) / 100);
  const projectedGross = projectedBasic + projectedDa + projectedHra;
  
  // Compare to current 7th pay gross (assuming 60% DA + 10% HRA = 170% of basic)
  const current7thGross = Math.round(basic7th * (1 + 0.60 + 0.10));
  const gainAmount = Math.max(0, projectedGross - current7thGross);

  return {
    projectedBasic,
    projectedDa,
    projectedHra,
    projectedGross,
    gainAmount
  };
}

/**
 * Calculates the next basic pay after 3% annual increment
 * according to 7th Pay Commission Pay Matrix rule:
 * Next basic pay is equal to or immediately next higher cell in the same Level matrix.
 */
export function calculateAnnualIncrement(levelCode: string, currentBasicPay: number): {
  newBasicPay: number;
  cellIndex: number;
  incrementAmount: number;
} {
  const levelData = RAJASTHAN_PAY_MATRIX.find(l => l.level === levelCode);
  
  if (!levelData) {
    // Fallback if level not found: 3% rounded up to nearest 100
    const rawNewPay = currentBasicPay * 1.03;
    const rounded = Math.ceil(rawNewPay / 100) * 100;
    return {
      newBasicPay: rounded,
      cellIndex: 0,
      incrementAmount: rounded - currentBasicPay
    };
  }

  // Find current cell
  const currentCellIndex = levelData.cells.indexOf(currentBasicPay);
  if (currentCellIndex >= 0 && currentCellIndex < levelData.cells.length - 1) {
    const nextCellPay = levelData.cells[currentCellIndex + 1];
    return {
      newBasicPay: nextCellPay,
      cellIndex: currentCellIndex + 2, // 1-indexed cell
      incrementAmount: nextCellPay - currentBasicPay
    };
  }

  // If pay isn't exact cell match, find next cell greater than currentPay * 1.03
  const targetPay = currentBasicPay * 1.03;
  const nextCell = levelData.cells.find(cellPay => cellPay >= targetPay) || Math.ceil(targetPay / 100) * 100;
  const nextCellIdx = levelData.cells.indexOf(nextCell);

  return {
    newBasicPay: nextCell,
    cellIndex: nextCellIdx >= 0 ? nextCellIdx + 1 : 0,
    incrementAmount: nextCell - currentBasicPay
  };
}
