import { motion } from "framer-motion";

interface StockBannerProps {
  stock: {
    symbol: string;
    name: string;
    nameEn: string;
    sector: string;
    sectorEn: string;
    isPositive: boolean;
  };
  logoUrl?: string;
}

// Mock company logos - in production would come from API/CDN
const companyLogos: Record<string, string> = {
  IAM: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Maroc_Telecom_Logo.svg/200px-Maroc_Telecom_Logo.svg.png",
  ATW: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Attijariwafa_Bank_logo.svg/200px-Attijariwafa_Bank_logo.svg.png",
  BCP: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Banque_Populaire_Maroc.svg/200px-Banque_Populaire_Maroc.svg.png",
  BOA: "https://upload.wikimedia.org/wikipedia/en/thumb/d/da/Bank_of_Africa_logo.svg/200px-Bank_of_Africa_logo.svg.png",
  CIH: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/CIH_Bank_Logo.svg/200px-CIH_Bank_Logo.svg.png",
  TQM: "https://www.taqa.ma/wp-content/uploads/2020/01/taqa-morocco-logo.png",
  LBV: "https://www.labellevie.ma/wp-content/themes/labellevie/images/logo.png",
  CMT: "https://www.cmtcompany.ma/images/logo-cmt.png",
  MNG: "https://www.managem-ona.com/wp-content/themes/managem/images/logo.svg",
  HPS: "https://www.hps-worldwide.com/themes/custom/hps/logo.svg",
};

const sectorBanners: Record<string, string> = {
  telecom: "linear-gradient(135deg, hsl(200, 80%, 20%) 0%, hsl(220, 70%, 15%) 100%)",
  banks: "linear-gradient(135deg, hsl(35, 70%, 20%) 0%, hsl(25, 60%, 12%) 100%)",
  mining: "linear-gradient(135deg, hsl(45, 60%, 18%) 0%, hsl(30, 50%, 10%) 100%)",
  energy: "linear-gradient(135deg, hsl(140, 50%, 18%) 0%, hsl(160, 40%, 10%) 100%)",
  insurance: "linear-gradient(135deg, hsl(270, 50%, 20%) 0%, hsl(280, 40%, 12%) 100%)",
  distribution: "linear-gradient(135deg, hsl(340, 50%, 20%) 0%, hsl(350, 40%, 12%) 100%)",
  "real-estate": "linear-gradient(135deg, hsl(180, 40%, 18%) 0%, hsl(190, 30%, 10%) 100%)",
  construction: "linear-gradient(135deg, hsl(20, 50%, 20%) 0%, hsl(15, 40%, 12%) 100%)",
  industry: "linear-gradient(135deg, hsl(210, 40%, 20%) 0%, hsl(220, 30%, 12%) 100%)",
};

const getSectorKey = (sector: string): string => {
  const mapping: Record<string, string> = {
    "اتصالات": "telecom",
    "بنوك": "banks",
    "تعدين": "mining",
    "طاقة": "energy",
    "تأمين": "insurance",
    "توزيع": "distribution",
    "عقارات": "real-estate",
    "بناء": "construction",
    "صناعة": "industry",
  };
  return mapping[sector] || "banks";
};

const StockBanner = ({ stock, logoUrl }: StockBannerProps) => {
  const logo = logoUrl || companyLogos[stock.symbol];
  const sectorKey = getSectorKey(stock.sector);
  const bannerGradient = sectorBanners[sectorKey] || sectorBanners.banks;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative overflow-hidden rounded-2xl mb-6"
      style={{ background: bannerGradient }}
    >
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
        
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      <div className="relative z-10 p-8 flex items-center gap-6">
        {/* Company Logo */}
        <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center p-3 shrink-0">
          {logo ? (
            <img 
              src={logo} 
              alt={stock.nameEn}
              className="w-full h-full object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement!.innerHTML = `<span class="text-2xl font-bold text-white">${stock.symbol.slice(0, 2)}</span>`;
              }}
            />
          ) : (
            <span className="text-2xl font-bold text-white">{stock.symbol.slice(0, 2)}</span>
          )}
        </div>

        {/* Company Info */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl md:text-3xl font-bold text-white">{stock.name}</h1>
            <span className="text-sm px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-white/80 border border-white/20">
              {stock.symbol}
            </span>
          </div>
          <p className="text-white/70 text-sm md:text-base">
            {stock.nameEn} • {stock.sector}
          </p>
        </div>

        {/* Sector Badge */}
        <div className="hidden md:flex flex-col items-end">
          <span className="text-xs text-white/50 mb-1">القطاع</span>
          <span className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white font-medium">
            {stock.sector}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default StockBanner;
