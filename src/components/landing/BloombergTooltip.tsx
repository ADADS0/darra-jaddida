import { TrendingUp, TrendingDown, Activity, DollarSign, BarChart3 } from "lucide-react";
import MiniStockChart from "./MiniStockChart";
import { getStockLogoUrl } from "@/lib/stockLogos";

interface Stock {
  symbol: string;
  name: string;
  nameEn: string;
  sector: string;
  sectorEn: string;
  price: number;
  change: number;
  colorValue: number;
  marketCap: number;
}

interface BloombergTooltipProps {
  stock: Stock;
  position: { x: number; y: number };
  containerWidth: number;
}

const BloombergTooltip = ({ stock, position, containerWidth }: BloombergTooltipProps) => {
  const isPositive = stock.colorValue >= 0;
  const logoUrl = getStockLogoUrl(stock.symbol);
  
  // Calculate position to keep tooltip in view
  const shouldFlip = position.x > containerWidth / 2;
  
  return (
    <div
      className="absolute z-50 pointer-events-none"
      style={{
        left: shouldFlip ? position.x - 320 : position.x + 20,
        top: Math.max(10, position.y - 100),
      }}
    >
      {/* Glass container */}
      <div className="relative w-[300px] backdrop-blur-xl bg-gradient-to-br from-slate-900/90 via-slate-800/85 to-slate-900/90 border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        {/* Glow effects */}
        <div 
          className={`absolute inset-0 opacity-20 ${
            isPositive 
              ? 'bg-gradient-to-br from-emerald-500/30 via-transparent to-transparent' 
              : 'bg-gradient-to-br from-rose-500/30 via-transparent to-transparent'
          }`} 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        
        {/* Content */}
        <div className="relative p-4">
          {/* Header with logo and symbol */}
          <div className="flex items-center gap-3 mb-3">
            {/* Logo with glow */}
            <div className="relative">
              <div 
                className={`absolute inset-0 blur-md opacity-50 rounded-full ${
                  isPositive ? 'bg-emerald-500' : 'bg-rose-500'
                }`} 
              />
              {logoUrl ? (
                <img 
                  src={logoUrl} 
                  alt={stock.symbol}
                  className="relative w-14 h-14 rounded-full bg-white p-1 shadow-lg border-2 border-white/20"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              ) : (
                <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-xl shadow-lg border-2 border-white/20">
                  {stock.symbol.charAt(0)}
                </div>
              )}
            </div>
            
            {/* Symbol and name */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-xl tracking-tight">
                  {stock.symbol}
                </span>
                <span 
                  className={`text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 ${
                    isPositive 
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                      : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  }`}
                >
                  {isPositive ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  {isPositive ? '+' : ''}{stock.colorValue.toFixed(2)}%
                </span>
              </div>
              <p className="text-sm text-slate-400 truncate mt-0.5">
                {stock.nameEn}
              </p>
            </div>
          </div>
          
          {/* Mini Chart - Bloomberg style with real data */}
          <div className="relative h-16 mb-3 bg-slate-900/50 rounded-lg overflow-hidden border border-white/5">
            <MiniStockChart 
              symbol={stock.symbol} 
              change={stock.colorValue}
              className="opacity-90"
            />
            {/* Chart overlay label */}
            <div className="absolute top-1 left-2 flex items-center gap-1">
              <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">
                30D Chart
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" title="Real data" />
            </div>
          </div>
          
          {/* Stats grid */}
          <div className="grid grid-cols-3 gap-2">
            {/* Price */}
            <div className="bg-slate-800/50 rounded-lg p-2 border border-white/5">
              <div className="flex items-center gap-1 text-[10px] text-slate-500 uppercase tracking-wider mb-1">
                <DollarSign className="w-3 h-3" />
                Price
              </div>
              <div className="text-sm font-bold text-white">
                {stock.price.toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-500">MAD</div>
            </div>
            
            {/* Market Cap */}
            <div className="bg-slate-800/50 rounded-lg p-2 border border-white/5">
              <div className="flex items-center gap-1 text-[10px] text-slate-500 uppercase tracking-wider mb-1">
                <BarChart3 className="w-3 h-3" />
                M.Cap
              </div>
              <div className="text-sm font-bold text-white">
                {(stock.marketCap / 1000).toFixed(1)}B
              </div>
              <div className="text-[10px] text-slate-500">MAD</div>
            </div>
            
            {/* Status */}
            <div className="bg-slate-800/50 rounded-lg p-2 border border-white/5">
              <div className="flex items-center gap-1 text-[10px] text-slate-500 uppercase tracking-wider mb-1">
                <Activity className="w-3 h-3" />
                Status
              </div>
              <div className={`text-sm font-bold ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                {isPositive ? 'Bullish' : 'Bearish'}
              </div>
              <div className="text-[10px] text-slate-500">Trend</div>
            </div>
          </div>
          
          {/* Sector tag */}
          <div className="mt-3 flex items-center justify-between">
            <span className="text-[10px] px-2 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-medium">
              {stock.sectorEn}
            </span>
            <span className="text-[10px] text-slate-600">
              Click for details →
            </span>
          </div>
        </div>
        
        {/* Bottom gradient line */}
        <div 
          className={`h-1 w-full ${
            isPositive 
              ? 'bg-gradient-to-r from-emerald-600 via-emerald-400 to-emerald-600' 
              : 'bg-gradient-to-r from-rose-600 via-rose-400 to-rose-600'
          }`}
        />
      </div>
    </div>
  );
};

export default BloombergTooltip;
