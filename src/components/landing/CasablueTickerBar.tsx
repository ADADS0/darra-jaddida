import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import { useStockData } from "@/hooks/useStockData";
import casablueLogo from "@/assets/casablue-logo.jpeg";

const CasablueTickerBar = () => {
  const { data, isLoading } = useStockData();
  
  const stocks = data?.stocks || [];
  
  // Get top stocks for ticker
  const tickerStocks = stocks.slice(0, 12);

  if (isLoading || tickerStocks.length === 0) {
    return (
      <div className="w-full bg-[#0d1421] border-y border-border/20 py-2">
        <div className="flex items-center justify-center gap-8 animate-pulse">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="h-3 w-16 bg-muted/30 rounded" />
              <div className="h-3 w-12 bg-muted/30 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full bg-gradient-to-r from-[#0d1421] via-[#0f1a2b] to-[#0d1421] border-y border-primary/20 overflow-hidden">
      {/* Center Logo */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 bg-[#0d1421] px-4">
        <img 
          src={casablueLogo} 
          alt="CasaBlue" 
          className="h-12 w-auto object-contain"
        />
      </div>
      
      {/* Left side ticker (scrolling right) */}
      <div className="flex py-2.5">
        <div className="flex ticker-scroll-left">
          {[...tickerStocks, ...tickerStocks].map((stock, index) => (
            <motion.div
              key={`left-${stock.symbol}-${index}`}
              className="flex items-center gap-3 px-6 shrink-0"
            >
              <div className="flex items-center gap-1.5">
                {stock.change >= 0 ? (
                  <TrendingUp className="w-3 h-3 text-chart-positive" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-chart-negative" />
                )}
                <span className="text-xs font-bold text-foreground uppercase tracking-wide">
                  {stock.nameEn}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-foreground">
                  {stock.price.toFixed(2)}
                </span>
                <span className={`text-xs font-bold ${
                  stock.change >= 0 ? "text-chart-positive" : "text-chart-negative"
                }`}>
                  {stock.change >= 0 ? "+" : ""}{stock.change.toFixed(2)}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Gradient overlays */}
      <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#0d1421] to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[#0d1421] to-transparent z-10 pointer-events-none" />
    </div>
  );
};

export default CasablueTickerBar;
