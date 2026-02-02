import { useStockData } from "@/hooks/useStockData";
import casablueLogo from "@/assets/casablue-logo.jpeg";

const STORAGE_BASE_URL = "https://bphdlzclnianapnknwji.supabase.co/storage/v1/object/public/logostockburse";

// Map stock symbols to logo file names
const stockLogoMap: Record<string, string> = {
  "ATW": "attijariwafa-bank--big.svg",
  "IAM": "itissalat-al-ma-inh-dh--big.svg",
  "BCP": "bcp--big.svg",
  "LBV": "label-vie--big.svg",
  "MNG": "miniere-touissit--big.svg",
  "CIH": "cih--big.svg",
  "TQM": "taqa-morocco--big.svg",
  "BOA": "bank-of-africa--big.svg",
  "CSR": "cosumar--big.svg",
  "HPS": "hps--big.svg",
  "SMI": "smi--big.svg",
  "CMT": "ciments-du-maroc--big.svg",
  "LHM": "lafargeholcim-bangladesh--big.svg",
  "WAA": "wafa-assurance--big.svg",
};

const getStockLogoUrl = (symbol: string): string => {
  const logoFile = stockLogoMap[symbol];
  if (logoFile) {
    return `${STORAGE_BASE_URL}/${logoFile}`;
  }
  return "";
};

const ProTickerBar = () => {
  const { data, isLoading } = useStockData();
  
  const stocks = data?.stocks || [];
  
  // Duplicate stocks for seamless infinite scroll
  const tickerItems = [...stocks, ...stocks];

  if (isLoading || stocks.length === 0) {
    return (
      <div className="h-10 bg-[#131722] border-b border-[#1e222d] flex items-center overflow-hidden relative">
        <div className="flex items-center justify-center gap-8 animate-pulse w-full">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="h-3 w-16 bg-[#2a2e39] rounded" />
              <div className="h-3 w-12 bg-[#2a2e39] rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="h-10 bg-[#131722] border-b border-[#1e222d] flex items-center overflow-hidden relative">
      {/* Scrolling ticker track */}
      <div className="flex whitespace-nowrap animate-ticker hover:pause-animation">
        {tickerItems.map((stock, index) => {
          const isPos = stock.change >= 0;
          const logoUrl = getStockLogoUrl(stock.symbol);
          
          return (
            <div 
              key={`${stock.symbol}-${index}`} 
              className="ticker-item flex items-center px-6 border-r border-[#1e222d] h-10 shrink-0"
            >
              {/* Stock Logo */}
              {logoUrl ? (
                <img 
                  src={logoUrl} 
                  alt="" 
                  className="w-5 h-5 rounded-full bg-white object-contain p-0.5 mr-2"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-5 h-5 rounded-full bg-[#2962ff] flex items-center justify-center text-[8px] font-bold text-white mr-2">
                  {stock.symbol.charAt(0)}
                </div>
              )}
              
              <span className="font-bold text-xs text-white mr-2 uppercase tracking-wide">
                {stock.nameEn}
              </span>
              <span className="text-xs text-[#b2b5be] mr-2">
                {stock.price.toFixed(2)}
              </span>
              <span className={`text-xs font-semibold ${isPos ? 'text-[#089981]' : 'text-[#f23645]'}`}>
                {isPos ? '+' : ''}{stock.change.toFixed(2)}%
              </span>
            </div>
          );
        })}
      </div>

      {/* Logo overlay on the left */}
      <div className="absolute left-0 top-0 bottom-0 px-4 bg-[#131722] border-r border-[#1e222d] flex items-center z-20">
        <img 
          src={casablueLogo} 
          alt="CasaBlue" 
          className="h-7 w-auto object-contain"
        />
        <span className="mx-2 text-[#434651]">|</span>
        <span className="text-[10px] font-bold text-[#b2b5be] uppercase tracking-wider">CASABLANCA</span>
      </div>

      {/* Gradient fade on right */}
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#131722] to-transparent z-10 pointer-events-none" />
    </div>
  );
};

export default ProTickerBar;
