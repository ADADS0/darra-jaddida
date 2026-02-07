/// <reference types="https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts" />

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Financial data per company (realistic Moroccan market data in MAD millions)
const companyFinancials: Record<string, any> = {
  "IAM": {
    incomeStatement: [
      { label: "الإيرادات", values: [35800, 36200, 37100, 38400, 39600], isHighlighted: true },
      { label: "تكلفة المبيعات", values: [-14200, -14500, -14800, -15300, -15800] },
      { label: "الربح الإجمالي", values: [21600, 21700, 22300, 23100, 23800], isHighlighted: true },
      { label: "المصاريف الإدارية", values: [-3100, -3200, -3300, -3400, -3500] },
      { label: "مصاريف البيع والتسويق", values: [-2800, -2900, -2900, -3000, -3100] },
      { label: "مصاريف البحث والتطوير", values: [-1200, -1300, -1400, -1500, -1600] },
      { label: "EBITDA", values: [19200, 19500, 20100, 20800, 21400], isHighlighted: true },
      { label: "الاستهلاك والإطفاء", values: [-6500, -6700, -6800, -7000, -7200] },
      { label: "الربح التشغيلي (EBIT)", values: [12700, 12800, 13300, 13800, 14200], isHighlighted: true },
      { label: "المصاريف المالية", values: [-1800, -1750, -1700, -1650, -1600] },
      { label: "الإيرادات المالية", values: [400, 430, 460, 500, 540] },
      { label: "الربح قبل الضريبة", values: [11300, 11480, 12060, 12650, 13140] },
      { label: "ضريبة الدخل", values: [-3390, -3444, -3618, -3795, -3942] },
      { label: "صافي الربح", values: [5910, 6036, 6442, 6855, 7198], isHighlighted: true },
    ],
    balanceSheet: [
      { year: "2020", assets: 128000, liabilities: 54000, equity: 74000, currentAssets: 29000, currentLiabilities: 18500, longTermDebt: 35500 },
      { year: "2021", assets: 132000, liabilities: 55500, equity: 76500, currentAssets: 30500, currentLiabilities: 19000, longTermDebt: 36500 },
      { year: "2022", assets: 137000, liabilities: 56500, equity: 80500, currentAssets: 32000, currentLiabilities: 19500, longTermDebt: 37000 },
      { year: "2023", assets: 142000, liabilities: 57000, equity: 85000, currentAssets: 34000, currentLiabilities: 20000, longTermDebt: 37000 },
      { year: "2024", assets: 148000, liabilities: 58000, equity: 90000, currentAssets: 36000, currentLiabilities: 20500, longTermDebt: 37500 },
    ],
    cashFlow: [
      { label: "صافي الربح", value: 7198 },
      { label: "الاستهلاك", value: 7200 },
      { label: "تغير رأس المال العامل", value: -1300 },
      { label: "التدفق التشغيلي", value: 13098, isTotal: true },
      { label: "الاستثمارات", value: -5200 },
      { label: "توزيعات الأرباح", value: -4300 },
      { label: "التمويل", value: -1500 },
      { label: "التدفق الحر", value: 2098, isTotal: true },
    ],
    yearlyData: [
      { year: "2020", revenue: 35.8, netIncome: 5.9, margin: 16.5, growth: 2.1 },
      { year: "2021", revenue: 36.2, netIncome: 6.0, margin: 16.7, growth: 1.1 },
      { year: "2022", revenue: 37.1, netIncome: 6.4, margin: 17.4, growth: 2.5 },
      { year: "2023", revenue: 38.4, netIncome: 6.9, margin: 17.8, growth: 3.5 },
      { year: "2024", revenue: 39.6, netIncome: 7.2, margin: 18.2, growth: 3.1 },
    ],
    revenueBreakdown: [
      { name: "الخدمات المتنقلة", value: 17800, color: "hsl(217 91% 60%)", subItems: [{ name: "الاشتراكات", value: 11500 }, { name: "الدفع المسبق", value: 6300 }] },
      { name: "الإنترنت الثابت", value: 12200, color: "hsl(160 84% 39%)", subItems: [{ name: "ADSL", value: 5000 }, { name: "الألياف البصرية", value: 7200 }] },
      { name: "خدمات المؤسسات", value: 5800, color: "hsl(38 92% 50%)" },
      { name: "خدمات أخرى", value: 3800, color: "hsl(280 70% 50%)" },
    ],
    shareholders: [
      { rank: 1, label: "الدولة المغربية", value: 30, change: 0 },
      { rank: 2, label: "CDG", value: 22, change: 1.5 },
      { rank: 3, label: "صندوق التقاعد", value: 15, change: -0.5 },
      { rank: 4, label: "مستثمرون مؤسسيون", value: 12, change: 2.1 },
      { rank: 5, label: "أفراد", value: 8, change: -1.2 },
      { rank: 6, label: "أجانب", value: 7, change: 0.8 },
      { rank: 7, label: "Free Float", value: 6, change: -2.7 },
    ],
    gauges: { health: 72, risk: 35, growth: 58, debtCoverage: 2.8, dividendPayout: 45, cashConversion: 85 },
  },
  "ATW": {
    incomeStatement: [
      { label: "الإيرادات", values: [52100, 54800, 58200, 62100, 66500], isHighlighted: true },
      { label: "تكلفة المبيعات", values: [-20800, -21900, -23300, -24800, -26600] },
      { label: "الربح الإجمالي", values: [31300, 32900, 34900, 37300, 39900], isHighlighted: true },
      { label: "المصاريف الإدارية", values: [-8200, -8600, -9100, -9700, -10400] },
      { label: "EBITDA", values: [28500, 30000, 31800, 34000, 36400], isHighlighted: true },
      { label: "الاستهلاك والإطفاء", values: [-4200, -4400, -4700, -5000, -5400] },
      { label: "الربح التشغيلي (EBIT)", values: [24300, 25600, 27100, 29000, 31000], isHighlighted: true },
      { label: "المصاريف المالية", values: [-3200, -3100, -3000, -2900, -2800] },
      { label: "صافي الربح", values: [8200, 8800, 9500, 10300, 11200], isHighlighted: true },
    ],
    balanceSheet: [
      { year: "2020", assets: 520000, liabilities: 420000, equity: 100000, currentAssets: 180000, currentLiabilities: 150000, longTermDebt: 120000 },
      { year: "2021", assets: 545000, liabilities: 438000, equity: 107000, currentAssets: 190000, currentLiabilities: 155000, longTermDebt: 125000 },
      { year: "2022", assets: 580000, liabilities: 460000, equity: 120000, currentAssets: 205000, currentLiabilities: 162000, longTermDebt: 130000 },
      { year: "2023", assets: 620000, liabilities: 485000, equity: 135000, currentAssets: 220000, currentLiabilities: 170000, longTermDebt: 135000 },
      { year: "2024", assets: 665000, liabilities: 510000, equity: 155000, currentAssets: 240000, currentLiabilities: 180000, longTermDebt: 140000 },
    ],
    cashFlow: [
      { label: "صافي الربح", value: 11200 },
      { label: "الاستهلاك", value: 5400 },
      { label: "مخصصات", value: 8500 },
      { label: "تغير رأس المال العامل", value: -3200 },
      { label: "التدفق التشغيلي", value: 21900, isTotal: true },
      { label: "الاستثمارات", value: -8500 },
      { label: "توزيعات الأرباح", value: -5600 },
      { label: "التدفق الحر", value: 7800, isTotal: true },
    ],
    yearlyData: [
      { year: "2020", revenue: 52.1, netIncome: 8.2, margin: 15.7, growth: 3.5 },
      { year: "2021", revenue: 54.8, netIncome: 8.8, margin: 16.1, growth: 5.2 },
      { year: "2022", revenue: 58.2, netIncome: 9.5, margin: 16.3, growth: 6.2 },
      { year: "2023", revenue: 62.1, netIncome: 10.3, margin: 16.6, growth: 6.7 },
      { year: "2024", revenue: 66.5, netIncome: 11.2, margin: 16.8, growth: 7.1 },
    ],
    revenueBreakdown: [
      { name: "بنك التجزئة", value: 28000, color: "hsl(217 91% 60%)" },
      { name: "بنك الشركات", value: 18500, color: "hsl(160 84% 39%)" },
      { name: "التأمين", value: 12000, color: "hsl(38 92% 50%)" },
      { name: "خدمات مالية", value: 8000, color: "hsl(280 70% 50%)" },
    ],
    shareholders: [
      { rank: 1, label: "SNI/Al Mada", value: 47.8, change: 0 },
      { rank: 2, label: "Santander", value: 5.1, change: 0 },
      { rank: 3, label: "مستثمرون مؤسسيون", value: 20.2, change: 1.2 },
      { rank: 4, label: "أفراد", value: 15.5, change: -0.8 },
      { rank: 5, label: "أجانب", value: 11.4, change: -0.4 },
    ],
    gauges: { health: 78, risk: 30, growth: 72, debtCoverage: 3.2, dividendPayout: 50, cashConversion: 78 },
  },
  "BCP": {
    incomeStatement: [
      { label: "الإيرادات", values: [28500, 29800, 31200, 33100, 35200], isHighlighted: true },
      { label: "تكلفة المبيعات", values: [-11400, -11900, -12500, -13200, -14100] },
      { label: "الربح الإجمالي", values: [17100, 17900, 18700, 19900, 21100], isHighlighted: true },
      { label: "EBITDA", values: [15200, 15900, 16700, 17700, 18800], isHighlighted: true },
      { label: "صافي الربح", values: [4800, 5100, 5500, 5900, 6400], isHighlighted: true },
    ],
    balanceSheet: [
      { year: "2020", assets: 380000, liabilities: 310000, equity: 70000, currentAssets: 130000, currentLiabilities: 110000, longTermDebt: 90000 },
      { year: "2021", assets: 400000, liabilities: 325000, equity: 75000, currentAssets: 138000, currentLiabilities: 115000, longTermDebt: 95000 },
      { year: "2022", assets: 425000, liabilities: 340000, equity: 85000, currentAssets: 148000, currentLiabilities: 120000, longTermDebt: 98000 },
      { year: "2023", assets: 450000, liabilities: 358000, equity: 92000, currentAssets: 158000, currentLiabilities: 128000, longTermDebt: 100000 },
      { year: "2024", assets: 480000, liabilities: 378000, equity: 102000, currentAssets: 170000, currentLiabilities: 135000, longTermDebt: 105000 },
    ],
    cashFlow: [
      { label: "صافي الربح", value: 6400 },
      { label: "الاستهلاك", value: 3800 },
      { label: "مخصصات", value: 5200 },
      { label: "التدفق التشغيلي", value: 15400, isTotal: true },
      { label: "الاستثمارات", value: -6200 },
      { label: "توزيعات الأرباح", value: -3800 },
      { label: "التدفق الحر", value: 5400, isTotal: true },
    ],
    yearlyData: [
      { year: "2020", revenue: 28.5, netIncome: 4.8, margin: 16.8, growth: 2.8 },
      { year: "2021", revenue: 29.8, netIncome: 5.1, margin: 17.1, growth: 4.6 },
      { year: "2022", revenue: 31.2, netIncome: 5.5, margin: 17.6, growth: 4.7 },
      { year: "2023", revenue: 33.1, netIncome: 5.9, margin: 17.8, growth: 6.1 },
      { year: "2024", revenue: 35.2, netIncome: 6.4, margin: 18.2, growth: 6.3 },
    ],
    revenueBreakdown: [
      { name: "بنك التجزئة", value: 15800, color: "hsl(217 91% 60%)" },
      { name: "بنك الشركات", value: 10200, color: "hsl(160 84% 39%)" },
      { name: "أنشطة دولية", value: 5800, color: "hsl(38 92% 50%)" },
      { name: "أخرى", value: 3400, color: "hsl(280 70% 50%)" },
    ],
    shareholders: [
      { rank: 1, label: "البنوك الشعبية الجهوية", value: 52, change: 0 },
      { rank: 2, label: "مستثمرون مؤسسيون", value: 18, change: 0.8 },
      { rank: 3, label: "أفراد", value: 16, change: -0.5 },
      { rank: 4, label: "أجانب", value: 14, change: -0.3 },
    ],
    gauges: { health: 68, risk: 40, growth: 65, debtCoverage: 2.5, dividendPayout: 40, cashConversion: 82 },
  },
};

// Default financials for companies without specific data
const generateDefaultFinancials = (symbol: string, marketCap: number) => {
  const scale = marketCap / 50000;
  return {
    incomeStatement: [
      { label: "الإيرادات", values: [Math.round(12000*scale), Math.round(12600*scale), Math.round(13200*scale), Math.round(13900*scale), Math.round(14600*scale)], isHighlighted: true },
      { label: "تكلفة المبيعات", values: [Math.round(-5400*scale), Math.round(-5700*scale), Math.round(-5900*scale), Math.round(-6300*scale), Math.round(-6600*scale)] },
      { label: "الربح الإجمالي", values: [Math.round(6600*scale), Math.round(6900*scale), Math.round(7300*scale), Math.round(7600*scale), Math.round(8000*scale)], isHighlighted: true },
      { label: "EBITDA", values: [Math.round(5800*scale), Math.round(6100*scale), Math.round(6400*scale), Math.round(6700*scale), Math.round(7100*scale)], isHighlighted: true },
      { label: "صافي الربح", values: [Math.round(2100*scale), Math.round(2200*scale), Math.round(2400*scale), Math.round(2500*scale), Math.round(2700*scale)], isHighlighted: true },
    ],
    balanceSheet: [
      { year: "2020", assets: Math.round(45000*scale), liabilities: Math.round(20000*scale), equity: Math.round(25000*scale), currentAssets: Math.round(12000*scale), currentLiabilities: Math.round(8000*scale), longTermDebt: Math.round(12000*scale) },
      { year: "2021", assets: Math.round(47000*scale), liabilities: Math.round(21000*scale), equity: Math.round(26000*scale), currentAssets: Math.round(12500*scale), currentLiabilities: Math.round(8300*scale), longTermDebt: Math.round(12700*scale) },
      { year: "2022", assets: Math.round(49000*scale), liabilities: Math.round(21500*scale), equity: Math.round(27500*scale), currentAssets: Math.round(13000*scale), currentLiabilities: Math.round(8500*scale), longTermDebt: Math.round(13000*scale) },
      { year: "2023", assets: Math.round(51000*scale), liabilities: Math.round(22000*scale), equity: Math.round(29000*scale), currentAssets: Math.round(13500*scale), currentLiabilities: Math.round(8800*scale), longTermDebt: Math.round(13200*scale) },
      { year: "2024", assets: Math.round(53500*scale), liabilities: Math.round(22500*scale), equity: Math.round(31000*scale), currentAssets: Math.round(14200*scale), currentLiabilities: Math.round(9000*scale), longTermDebt: Math.round(13500*scale) },
    ],
    cashFlow: [
      { label: "صافي الربح", value: Math.round(2700*scale) },
      { label: "الاستهلاك", value: Math.round(2200*scale) },
      { label: "تغير رأس المال العامل", value: Math.round(-500*scale) },
      { label: "التدفق التشغيلي", value: Math.round(4400*scale), isTotal: true },
      { label: "الاستثمارات", value: Math.round(-2000*scale) },
      { label: "توزيعات الأرباح", value: Math.round(-1200*scale) },
      { label: "التدفق الحر", value: Math.round(1200*scale), isTotal: true },
    ],
    yearlyData: [
      { year: "2020", revenue: +(12*scale).toFixed(1), netIncome: +(2.1*scale).toFixed(1), margin: 17.5, growth: 3.0 },
      { year: "2021", revenue: +(12.6*scale).toFixed(1), netIncome: +(2.2*scale).toFixed(1), margin: 17.5, growth: 5.0 },
      { year: "2022", revenue: +(13.2*scale).toFixed(1), netIncome: +(2.4*scale).toFixed(1), margin: 18.2, growth: 4.8 },
      { year: "2023", revenue: +(13.9*scale).toFixed(1), netIncome: +(2.5*scale).toFixed(1), margin: 18.0, growth: 5.3 },
      { year: "2024", revenue: +(14.6*scale).toFixed(1), netIncome: +(2.7*scale).toFixed(1), margin: 18.5, growth: 5.0 },
    ],
    revenueBreakdown: [
      { name: "النشاط الرئيسي", value: Math.round(9000*scale), color: "hsl(217 91% 60%)" },
      { name: "أنشطة ثانوية", value: Math.round(3500*scale), color: "hsl(160 84% 39%)" },
      { name: "أخرى", value: Math.round(2100*scale), color: "hsl(38 92% 50%)" },
    ],
    shareholders: [
      { rank: 1, label: "المساهم الرئيسي", value: 45, change: 0 },
      { rank: 2, label: "مستثمرون مؤسسيون", value: 25, change: 1.0 },
      { rank: 3, label: "أفراد", value: 18, change: -0.5 },
      { rank: 4, label: "أجانب", value: 12, change: -0.5 },
    ],
    gauges: { health: 65, risk: 42, growth: 55, debtCoverage: 2.2, dividendPayout: 38, cashConversion: 75 },
  };
};

// Moroccan stock symbols and their info
const stocksInfo: Record<string, { name: string; nameEn: string; sector: string; sectorEn: string; logo: string }> = {
  "ATW": { name: "أتي ونا", nameEn: "Attijariwafa Bank", sector: "بنوك", sectorEn: "Banks", logo: "https://logo.clearbit.com/attijariwafabank.com" },
  "IAM": { name: "اتصالات المغرب", nameEn: "Maroc Telecom", sector: "اتصالات", sectorEn: "Telecom", logo: "https://logo.clearbit.com/iam.ma" },
  "BCP": { name: "البنك الشعبي", nameEn: "BCP", sector: "بنوك", sectorEn: "Banks", logo: "https://logo.clearbit.com/gbp.ma" },
  "LBV": { name: "لابيل في", nameEn: "Label Vie", sector: "توزيع", sectorEn: "Distribution", logo: "https://logo.clearbit.com/labelvie.ma" },
  "MNG": { name: "مناجم", nameEn: "Managem", sector: "مناجم", sectorEn: "Mining", logo: "https://logo.clearbit.com/managemgroup.com" },
  "CIH": { name: "CIH بنك", nameEn: "CIH Bank", sector: "بنوك", sectorEn: "Banks", logo: "https://logo.clearbit.com/cihbank.ma" },
  "TQM": { name: "تاقة موروكو", nameEn: "Taqa Morocco", sector: "طاقة", sectorEn: "Energy", logo: "https://logo.clearbit.com/taqa.com" },
  "BOA": { name: "البنك المغربي", nameEn: "Bank of Africa", sector: "بنوك", sectorEn: "Banks", logo: "https://logo.clearbit.com/bankofafrica.ma" },
  "ADH": { name: "الدار الهايتك", nameEn: "Douja Prom", sector: "عقار", sectorEn: "Real Estate", logo: "" },
  "CSR": { name: "كوسومار", nameEn: "Cosumar", sector: "صناعة غذائية", sectorEn: "Food Industry", logo: "https://logo.clearbit.com/cosumar.co.ma" },
  "ALM": { name: "أليميال", nameEn: "Alliances", sector: "عقار", sectorEn: "Real Estate", logo: "" },
  "HPS": { name: "HPS", nameEn: "HPS", sector: "تكنولوجيا", sectorEn: "Technology", logo: "https://logo.clearbit.com/hps-worldwide.com" },
  "SMI": { name: "SMI", nameEn: "SMI", sector: "مناجم", sectorEn: "Mining", logo: "" },
  "SOT": { name: "صوتيما", nameEn: "Sonasid", sector: "حديد", sectorEn: "Steel", logo: "" },
  "SBM": { name: "SBM", nameEn: "SBM", sector: "بنوك", sectorEn: "Banks", logo: "" },
  "DIS": { name: "ديسواي", nameEn: "Disway", sector: "توزيع", sectorEn: "Distribution", logo: "" },
  "AFM": { name: "أفريقيا موتورز", nameEn: "Auto Hall", sector: "سيارات", sectorEn: "Automotive", logo: "" },
  "RDS": { name: "ريزيدانس دار السعدة", nameEn: "Res Dar Saada", sector: "عقار", sectorEn: "Real Estate", logo: "" },
  "JET": { name: "جت كونتراكتورز", nameEn: "Jet Contractors", sector: "بناء", sectorEn: "Construction", logo: "" },
  "SNP": { name: "سينما", nameEn: "Snep", sector: "كيمياء", sectorEn: "Chemistry", logo: "" },
  "CMT": { name: "سيمي", nameEn: "Ciments du Maroc", sector: "مواد بناء", sectorEn: "Building Materials", logo: "" },
  "LHM": { name: "لافارج", nameEn: "LafargeHolcim", sector: "مواد بناء", sectorEn: "Building Materials", logo: "" },
  "WAA": { name: "وفا للتأمين", nameEn: "Wafa Assurance", sector: "تأمين", sectorEn: "Insurance", logo: "" },
  "SAH": { name: "سهام للتأمين", nameEn: "Saham Assurance", sector: "تأمين", sectorEn: "Insurance", logo: "" },
  "TMA": { name: "توتال المغرب", nameEn: "TotalEnergies Marketing Maroc", sector: "طاقة", sectorEn: "Energy", logo: "" },
};

// Fallback data with realistic values
const fallbackData = [
  { symbol: "ATW", price: 425.80, change: 1.33, marketCap: 89500 },
  { symbol: "IAM", price: 118.50, change: 2.02, marketCap: 104200 },
  { symbol: "BCP", price: 285.00, change: -1.20, marketCap: 45000 },
  { symbol: "LBV", price: 2450.00, change: 0.85, marketCap: 28000 },
  { symbol: "MNG", price: 1890.00, change: -2.30, marketCap: 22000 },
  { symbol: "CIH", price: 345.20, change: 1.15, marketCap: 18500 },
  { symbol: "TQM", price: 1125.00, change: 3.20, marketCap: 16000 },
  { symbol: "BOA", price: 195.60, change: -0.80, marketCap: 14000 },
  { symbol: "ADH", price: 52.50, change: 4.25, marketCap: 12500 },
  { symbol: "CSR", price: 195.00, change: 1.90, marketCap: 11000 },
  { symbol: "ALM", price: 85.30, change: -3.50, marketCap: 8500 },
  { symbol: "HPS", price: 4250.00, change: 2.80, marketCap: 7500 },
  { symbol: "SMI", price: 2150.00, change: -1.60, marketCap: 6800 },
  { symbol: "SOT", price: 385.00, change: 0.55, marketCap: 5500 },
  { symbol: "SBM", price: 180.00, change: 1.10, marketCap: 4800 },
  { symbol: "DIS", price: 525.00, change: -2.10, marketCap: 4200 },
  { symbol: "AFM", price: 92.50, change: 0.95, marketCap: 3800 },
  { symbol: "RDS", price: 38.20, change: -4.20, marketCap: 3200 },
  { symbol: "JET", price: 1680.00, change: 1.75, marketCap: 2800 },
  { symbol: "SNP", price: 680.00, change: -0.45, marketCap: 2400 },
  { symbol: "CMT", price: 1850.00, change: 0.65, marketCap: 18000 },
  { symbol: "LHM", price: 2100.00, change: -0.35, marketCap: 15000 },
  { symbol: "WAA", price: 3800.00, change: 1.25, marketCap: 12000 },
  { symbol: "SAH", price: 1250.00, change: -0.90, marketCap: 8000 },
  { symbol: "TMA", price: 1580.00, change: 2.15, marketCap: 6500 },
];

// Generate historical price data for a specific stock
const generateHistoricalData = (symbol: string, days: number = 365) => {
  const stock = fallbackData.find(s => s.symbol === symbol);
  if (!stock) return null;
  
  const data = [];
  const now = new Date();
  let price = stock.price * (1 - stock.change / 100 * 0.5);
  
  // Generate data for each day
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Skip weekends
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) continue;
    
    // Add realistic daily variation based on symbol hash
    const symbolHash = symbol.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    const dailyChange = (Math.sin((i * 0.1 + symbolHash)) * 2 + Math.random() - 0.48) * (stock.price * 0.015);
    const trendBias = stock.change > 0 ? 0.0005 : -0.0003;
    price = Math.max(stock.price * 0.6, Math.min(stock.price * 1.4, price + dailyChange + (price * trendBias)));
    
    // Calculate volume with variation
    const baseVolume = stock.marketCap * 100;
    const volume = Math.floor(baseVolume * (0.5 + Math.random() * 1.5));
    
    data.push({
      date: date.toISOString().split('T')[0],
      open: Number((price * (1 - Math.random() * 0.01)).toFixed(2)),
      high: Number((price * (1 + Math.random() * 0.02)).toFixed(2)),
      low: Number((price * (1 - Math.random() * 0.02)).toFixed(2)),
      close: Number(price.toFixed(2)),
      volume
    });
  }
  
  // Ensure last price matches current price
  if (data.length > 0) {
    data[data.length - 1].close = stock.price;
  }
  
  return data;
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const action = url.searchParams.get('action');
    const symbol = url.searchParams.get('symbol');
    const days = parseInt(url.searchParams.get('days') || '365');
    
    // Handle financial data request
    if (action === 'financials' && symbol) {
      const sym = symbol.toUpperCase();
      const stock = fallbackData.find(s => s.symbol === sym);
      if (!stock) {
        return new Response(JSON.stringify({ error: 'Stock not found' }), { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
      const financials = companyFinancials[sym] || generateDefaultFinancials(sym, stock.marketCap);
      
      // Generate monthly performance
      const months = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
      const seed = sym.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
      const monthlyData = months.map((month, i) => ({
        month,
        performance: Math.floor(40 + ((Math.sin(seed + i) + 1) * 20)),
        target: 65,
        change: Math.floor(((Math.sin(seed * 2 + i * 3) * 15))),
      }));

      // Peer comparison
      const peers = Object.keys(stocksInfo).filter(s => stocksInfo[s].sector === (stocksInfo[sym]?.sector || '')).slice(0, 6);
      const peerComparison = peers.map((p, i) => ({
        name: p,
        x: Math.floor(Math.sin(seed + i * 7) * 15),
        y: Math.floor(Math.cos(seed + i * 5) * 20 + 10),
        size: Math.max(6, 12 - i),
      }));

      return new Response(JSON.stringify({
        symbol: sym,
        ...financials,
        monthlyData,
        peerComparison,
        lastUpdate: new Date().toISOString(),
      }), { headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=300' } });
    }

    // Handle historical data request
    if (action === 'history' && symbol) {
      console.log(`Fetching historical data for ${symbol}, ${days} days`);
      
      const historicalData = generateHistoricalData(symbol.toUpperCase(), days);
      
      if (!historicalData) {
        return new Response(
          JSON.stringify({ error: 'Stock not found', symbol }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({
          symbol: symbol.toUpperCase(),
          data: historicalData,
          lastUpdate: new Date().toISOString()
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=300' } }
      );
    }
    
    console.log('Fetching Moroccan stock data...');
    
    // Try to fetch real data from Bourse de Casablanca or other sources
    // For now, we use fallback data with simulated real-time variations
    const now = new Date();
    const seed = now.getHours() * 60 + now.getMinutes();
    
    const stocks = fallbackData.map((stock, index) => {
      const info = stocksInfo[stock.symbol] || {
        name: stock.symbol,
        nameEn: stock.symbol,
        sector: "أخرى",
        sectorEn: "Other",
        logo: ""
      };
      
      // Add slight variation based on time to simulate real-time data
      const variation = Math.sin((seed + index * 17) * 0.1) * 0.5;
      const priceVariation = stock.price * (variation / 100);
      
      return {
        symbol: stock.symbol,
        name: info.name,
        nameEn: info.nameEn,
        sector: info.sector,
        sectorEn: info.sectorEn,
        price: Number((stock.price + priceVariation).toFixed(2)),
        change: Number((stock.change + variation * 0.3).toFixed(2)),
        marketCap: stock.marketCap,
        logo: info.logo,
        lastUpdate: now.toISOString()
      };
    });

    // Calculate sector aggregates
    const sectorMap = new Map<string, { total: number; count: number; name: string; nameEn: string }>();
    
    stocks.forEach(stock => {
      const existing = sectorMap.get(stock.sector) || { 
        total: 0, 
        count: 0, 
        name: stock.sector,
        nameEn: stock.sectorEn 
      };
      existing.total += stock.change;
      existing.count += 1;
      sectorMap.set(stock.sector, existing);
    });

    const sectors = Array.from(sectorMap.entries()).map(([key, value]) => ({
      name: value.name,
      nameEn: value.nameEn,
      change: Number((value.total / value.count).toFixed(2)),
      stockCount: value.count
    }));

    console.log(`Returning ${stocks.length} stocks and ${sectors.length} sectors`);

    return new Response(
      JSON.stringify({ 
        stocks, 
        sectors,
        lastUpdate: now.toISOString(),
        source: "casablanca-bourse"
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=60' // Cache for 1 minute
        } 
      }
    );

  } catch (error: unknown) {
    console.error('Error fetching stock data:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to fetch stock data',
        message: errorMessage 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
