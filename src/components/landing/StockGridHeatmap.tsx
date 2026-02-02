import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useStockData, type Stock } from "@/hooks/useStockData";
import { Skeleton } from "@/components/ui/skeleton";
import { RefreshCw, Maximize2 } from "lucide-react";
import TriangleIndicator from "@/components/ui/TriangleIndicator";

const STORAGE_BASE_URL = "https://bphdlzclnianapnknwji.supabase.co/storage/v1/object/public/logostockburse";

const stockLogoMap: Record<string, string> = {
  "ATW": "attijariwafa-bank--big.svg",
  "BCP": "bcp--big.svg",
  "BOA": "bank-of-africa--big.svg",
  "CIH": "cih--big.svg",
  "CDM": "cdm--big.svg",
  "CFG": "cfg-bank--big.svg",
  "BNP": "paribas--big.svg",
  "IAM": "itissalat-al-ma-inh-dh--big.svg",
  "LBV": "label-vie--big.svg",
  "ATH": "auto-hall--big.svg",
  "SNA": "stokvis-nord-afrique--big.svg",
  "CTM": "ctm--big.svg",
  "MNG": "miniere-touissit--big.svg",
  "SMI": "smi--big.svg",
  "CMT": "ciments-du-maroc--big.svg",
  "LHM": "lafargeholcim-bangladesh--big.svg",
  "ZDJ": "zellidja-sa--big.svg",
  "TQM": "taqa-morocco--big.svg",
  "TMA": "total--big.svg",
  "GAZ": "afriquia-gaz--big.svg",
  "ADH": "douja-prom-addoha--big.svg",
  "ALM": "alliances--big.svg",
  "RDS": "res-dar-saada--big.svg",
  "AKD": "akdital-sa--big.svg",
  "ARD": "aradei-capital--big.svg",
  "RSM": "risma--big.svg",
  "IMR": "immorente-invest--big.svg",
  "BLM": "balima--big.svg",
  "WAA": "wafa-assurance--big.svg",
  "SAH": "sanlam-limited--big.svg",
  "ATL": "atlantasanad--big.svg",
  "AGMA": "agma--big.svg",
  "HPS": "hps--big.svg",
  "DIS": "disway--big.svg",
  "MIC": "microdata--big.svg",
  "M2M": "m2m--big.svg",
  "IBS": "ib-maroccom--big.svg",
  "INV": "involys--big.svg",
  "DTY": "disty-technologies--big.svg",
  "CSR": "cosumar--big.svg",
  "SBM": "societe-des-boissons-du-maroc--big.svg",
  "LES": "lesieur-cristal--big.svg",
  "OUL": "oulmes--big.svg",
  "UMR": "unimer--big.svg",
  "DRC": "dari-couspate--big.svg",
  "MUT": "mutandis-sca--big.svg",
  "SNS": "sonasid--big.svg",
  "SNP": "snep--big.svg",
  "ALU": "aluminium-du-maroc--big.svg",
  "FBR": "fenie-brossette--big.svg",
  "STR": "stroc-industrie--big.svg",
  "REM": "realisations-mecaniques--big.svg",
  "CLR": "colorado--big.svg",
  "DEL": "delta--big.svg",
  "AIC": "afric-industries--big.svg",
  "MOP": "maghreb-oxygene--big.svg",
  "MDP": "med-paper--big.svg",
  "TGCC": "travaux-generaux-de-constructions-de-casablanca--big.svg",
  "JET": "jet-contractors--big.svg",
  "MSA": "sodep-marsa-maroc--big.svg",
  "EQD": "eqdom--big.svg",
  "SLF": "salafin--big.svg",
  "MAL": "maghrebail--big.svg",
  "MLE": "maroc-leasing--big.svg",
  "SMM": "sm-monetique--big.svg",
  "AFM": "afma--big.svg",
  "CMGP": "cmgp--big.svg",
  "RBC": "rebab-company--big.svg",
  "VCN": "vicenne--big.svg",
  "SOT": "sothema--big.svg",
  "PRM": "promopharm-sa--big.svg",
};

const getStockLogoUrl = (symbol: string): string => {
  const logoFile = stockLogoMap[symbol];
  if (logoFile) {
    return `${STORAGE_BASE_URL}/${logoFile}`;
  }
  return "";
};

// Generate mock sparkline data for mini charts
const generateSparklineData = (change: number): number[] => {
  const points = 20;
  const data: number[] = [];
  let value = 50;
  
  for (let i = 0; i < points; i++) {
    const trend = change > 0 ? 0.3 : change < 0 ? -0.3 : 0;
    value += (Math.random() - 0.5 + trend) * 5;
    value = Math.max(10, Math.min(90, value));
    data.push(value);
  }
  
  // Make sure end point reflects the change direction
  if (change > 0 && data[data.length - 1] < data[0]) {
    data[data.length - 1] = data[0] + Math.abs(change) * 3;
  } else if (change < 0 && data[data.length - 1] > data[0]) {
    data[data.length - 1] = data[0] - Math.abs(change) * 3;
  }
  
  return data;
};

// Modern SVG Sparkline component with gradient fill like TradingView
const Sparkline = ({ data, color, height = 50, showDot = true }: { data: number[]; color: string; height?: number; showDot?: boolean }) => {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const width = 100;
  const padding = 2;
  
  // Generate smooth curve points
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = padding + ((max - value) / range) * (height - padding * 2);
    return { x, y };
  });
  
  // Create smooth bezier curve path
  const createSmoothPath = () => {
    if (points.length < 2) return '';
    
    let path = `M ${points[0].x} ${points[0].y}`;
    
    for (let i = 0; i < points.length - 1; i++) {
      const current = points[i];
      const next = points[i + 1];
      const controlX = (current.x + next.x) / 2;
      
      path += ` C ${controlX} ${current.y}, ${controlX} ${next.y}, ${next.x} ${next.y}`;
    }
    
    return path;
  };
  
  // Create area path (path + bottom closure)
  const createAreaPath = () => {
    const linePath = createSmoothPath();
    if (!linePath) return '';
    
    return `${linePath} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`;
  };
  
  const lastPoint = points[points.length - 1];
  const gradientId = `sparkline-gradient-${color.replace('#', '')}-${Math.random().toString(36).slice(2, 8)}`;
  const glowId = `sparkline-glow-${color.replace('#', '')}-${Math.random().toString(36).slice(2, 8)}`;
  
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full" preserveAspectRatio="none">
      <defs>
        {/* Gradient fill */}
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="50%" stopColor={color} stopOpacity="0.15" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
        {/* Glow filter */}
        <filter id={glowId} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Area fill */}
      <path
        d={createAreaPath()}
        fill={`url(#${gradientId})`}
      />
      
      {/* Main line with glow */}
      <path
        d={createSmoothPath()}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter={`url(#${glowId})`}
      />
      
      {/* End dot with pulse animation */}
      {showDot && lastPoint && (
        <>
          <circle
            cx={lastPoint.x}
            cy={lastPoint.y}
            r="4"
            fill={color}
            opacity="0.3"
          >
            <animate
              attributeName="r"
              values="4;7;4"
              dur="2s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.3;0.1;0.3"
              dur="2s"
              repeatCount="indefinite"
            />
          </circle>
          <circle
            cx={lastPoint.x}
            cy={lastPoint.y}
            r="3"
            fill={color}
          />
        </>
      )}
    </svg>
  );
};

interface StockCardProps {
  stock: Stock;
  sparklineData: number[];
}

const StockCard = ({ stock, sparklineData }: StockCardProps) => {
  const logoUrl = getStockLogoUrl(stock.symbol);
  const isPositive = stock.change > 0;
  const isNeutral = stock.change === 0;
  const chartColor = isPositive ? "#089981" : isNeutral ? "#787b86" : "#f23645";
  
  // Calculate high/low from sparkline
  const high = (stock.price * 1.02).toFixed(2);
  const low = (stock.price * 0.98).toFixed(2);
  
  return (
    <Link
      to={`/stock/${stock.symbol}`}
      className="relative bg-[#131722] rounded-lg border border-[#2a2e39] hover:border-[#363a45] transition-all overflow-hidden group"
    >
      {/* Header */}
      <div className="p-3 pb-0">
        <div className="flex items-start justify-between mb-1">
          <div className="flex items-center gap-2">
            {logoUrl ? (
              <img 
                src={logoUrl} 
                alt={stock.symbol}
                className="w-6 h-6 rounded-full bg-white p-0.5 object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : null}
            <span className="text-white font-bold text-sm">{stock.symbol}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <TriangleIndicator 
              direction={isPositive ? "up" : isNeutral ? "neutral" : "down"} 
              size="sm" 
            />
            <span className={`text-xs font-medium ${isPositive ? "text-[#089981]" : isNeutral ? "text-[#787b86]" : "text-[#f23645]"}`}>
              {isPositive ? "+" : ""}{stock.change.toFixed(2)}%
            </span>
          </div>
        </div>
        
        {/* Price */}
        <div className="text-2xl font-bold text-white mb-1">
          {stock.price.toFixed(2)}
        </div>
        
        {/* High/Low */}
        <div className="flex items-center gap-3 text-[10px] mb-2">
          <span className="text-[#787b86]">
            H <span className={isPositive ? "text-[#089981]" : "text-white"}>{high}</span>
          </span>
          <span className="text-[#787b86]">
            L <span className={isPositive ? "text-white" : "text-[#f23645]"}>{low}</span>
          </span>
        </div>
      </div>
      
      {/* Chart */}
      <div className="h-16 w-full px-1">
        <Sparkline data={sparklineData} color={chartColor} height={60} />
      </div>
      
      {/* Hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#2962ff]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </Link>
  );
};

interface StockGridHeatmapProps {
  limit?: number;
  showHeader?: boolean;
}

const StockGridHeatmap = ({ limit = 20, showHeader = true }: StockGridHeatmapProps) => {
  const { t } = useTranslation();
  const { data, isLoading, error, refetch, isRefetching } = useStockData();
  const stocks = data?.stocks || [];
  
  // Sort by market cap and limit
  const displayStocks = useMemo(() => {
    return [...stocks]
      .sort((a, b) => b.marketCap - a.marketCap)
      .slice(0, limit);
  }, [stocks, limit]);
  
  // Pre-generate sparkline data for each stock
  const sparklineDataMap = useMemo(() => {
    const map: Record<string, number[]> = {};
    displayStocks.forEach(stock => {
      map[stock.symbol] = generateSparklineData(stock.change);
    });
    return map;
  }, [displayStocks]);
  
  if (error) {
    return (
      <div className="bg-[#131722] rounded-xl p-6 text-center border border-[#2a2e39]">
        <p className="text-[#f23645] mb-4">{t('common.error')}</p>
        <button 
          onClick={() => refetch()} 
          className="px-4 py-2 bg-[#2962ff] text-white rounded-lg hover:bg-[#1e88e5] transition-colors"
        >
          {t('common.retry')}
        </button>
      </div>
    );
  }
  
  return (
    <div className="bg-[#0d1117] rounded-xl border border-[#2a2e39] overflow-hidden">
      {showHeader && (
        <div className="flex items-center justify-between p-4 border-b border-[#2a2e39]">
          <div className="flex items-center gap-3">
            <h2 className="text-white font-bold text-lg">{t('heatmap.title')}</h2>
            <span className="text-[#787b86] text-sm">
              {stocks.length} {t('heatmap.stocks')}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => refetch()}
              disabled={isRefetching}
              className="p-2 rounded-lg bg-[#1e222d] hover:bg-[#2a2e39] text-[#787b86] hover:text-white transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${isRefetching ? "animate-spin" : ""}`} strokeWidth={1.5} />
            </button>
            <Link 
              to="/markets"
              className="p-2 rounded-lg bg-[#1e222d] hover:bg-[#2a2e39] text-[#787b86] hover:text-white transition-colors"
            >
              <Maximize2 className="w-4 h-4" strokeWidth={1.5} />
            </Link>
          </div>
        </div>
      )}
      
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 p-4">
          {Array.from({ length: limit }).map((_, i) => (
            <Skeleton key={i} className="h-36 rounded-lg bg-[#1e222d]" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 p-4">
          {displayStocks.map((stock) => (
            <StockCard 
              key={stock.symbol} 
              stock={stock} 
              sparklineData={sparklineDataMap[stock.symbol] || []}
            />
          ))}
        </div>
      )}
      
      {/* Legend */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-[#2a2e39] bg-[#131722]">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <TriangleIndicator direction="up" size="sm" />
            <span className="text-[#089981] text-xs">{t('heatmap.gainers')}</span>
          </div>
          <div className="flex items-center gap-2">
            <TriangleIndicator direction="down" size="sm" />
            <span className="text-[#f23645] text-xs">{t('heatmap.losers')}</span>
          </div>
        </div>
        <Link 
          to="/markets"
          className="text-[#2962ff] text-sm hover:underline"
        >
          {t('heatmap.viewAll')} ←
        </Link>
      </div>
    </div>
  );
};

export default StockGridHeatmap;
