import { useState, useEffect, lazy, Suspense } from "react";
import { motion } from "framer-motion";
import { Info, TrendingUp, Calculator, ChevronDown, ChevronUp } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";

interface StockProjectionProps {
  stock: {
    symbol: string;
    name: string;
    price: number;
    per: number;
    roe: number;
    dividendYield: number;
  };
}

const StockProjection = ({ stock }: StockProjectionProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [horizon, setHorizon] = useState(5);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 300);
    return () => clearTimeout(timer);
  }, [stock.symbol]);

  // Simulated TCAC (Compound Annual Growth Rate)
  const revenueTCAC = 5.2 + Math.random() * 3;
  const profitTCAC = 6.1 + Math.random() * 4;
  const dividendTCAC = 4.5 + Math.random() * 3;

  // Projected values
  const projectedRevenue = 34.51 * Math.pow(1 + revenueTCAC / 100, horizon);
  const projectedProfit = 9.50 * Math.pow(1 + profitTCAC / 100, horizon);
  const projectedEPS = projectedProfit * 1000 / 215; // Million shares
  const futurePE = stock.price / projectedEPS;
  const projectedDividendYield = stock.dividendYield * Math.pow(1 + dividendTCAC / 100, horizon);

  if (!isLoaded) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-2xl border border-border p-6"
      >
        <Skeleton className="h-6 w-48 mb-4" />
        <div className="space-y-3">
          <Skeleton className="h-20 w-full rounded-xl" />
          <Skeleton className="h-20 w-full rounded-xl" />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-card rounded-2xl border border-border overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-[#2962ff]/10 to-transparent px-6 py-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#2962ff]/20 flex items-center justify-center">
              <Calculator className="w-4 h-4 text-[#2962ff]" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                التوقعات على {horizon} سنوات
                <span className="text-xs text-muted-foreground">({2024 + horizon})</span>
              </h3>
              <p className="text-xs text-muted-foreground">مبنية على TCAC (معدل النمو المركب)</p>
            </div>
          </div>
          
          <Tooltip>
            <TooltipTrigger>
              <Info className="w-4 h-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p>توقعات مبنية على معدل النمو المركب السنوي (TCAC) للإيرادات والأرباح. هذه تقديرات وليست نصيحة استثمارية.</p>
            </TooltipContent>
          </Tooltip>
        </div>
        
        {/* Horizon selector */}
        <div className="flex items-center gap-2 mt-4">
          {[3, 5, 7, 10].map((years) => (
            <button
              key={years}
              onClick={() => setHorizon(years)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                horizon === years
                  ? "bg-[#2962ff] text-white"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {years} سنوات
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 space-y-4">
        {/* Projected Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-secondary/30 rounded-xl p-4">
            <p className="text-xs text-muted-foreground mb-1">الإيرادات المتوقعة</p>
            <p className="text-xl font-bold text-foreground">{projectedRevenue.toFixed(2)} Md</p>
            <p className="text-xs text-[#3fb950] flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" />
              ×{(projectedRevenue / 34.51).toFixed(2)}
            </p>
          </div>
          
          <div className="bg-secondary/30 rounded-xl p-4">
            <p className="text-xs text-muted-foreground mb-1">الأرباح الصافية المتوقعة</p>
            <p className="text-xl font-bold text-foreground">{projectedProfit.toFixed(2)} Md</p>
            <p className="text-xs text-[#3fb950] flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" />
              ×{(projectedProfit / 9.50).toFixed(2)}
            </p>
          </div>
          
          <div className="bg-secondary/30 rounded-xl p-4">
            <p className="text-xs text-muted-foreground mb-1">P/E المستقبلي (سعر ثابت)</p>
            <p className="text-xl font-bold text-[#3fb950]">{futurePE.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground mt-1">
              أقل = تقييم أرخص
            </p>
          </div>
          
          <div className="bg-secondary/30 rounded-xl p-4">
            <p className="text-xs text-muted-foreground mb-1">العائد المتوقع</p>
            <p className="text-xl font-bold text-foreground">{projectedDividendYield.toFixed(2)}%</p>
            <p className="text-xs text-[#3fb950] flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" />
              +{(projectedDividendYield - stock.dividendYield).toFixed(2)}%
            </p>
          </div>
        </div>

        {/* TCAC Details Toggle */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full flex items-center justify-center gap-2 py-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          {showDetails ? "إخفاء التفاصيل" : "عرض تفاصيل الحساب"}
          {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showDetails && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="bg-secondary/20 rounded-xl p-4 text-xs space-y-3"
          >
            <div className="flex justify-between">
              <span className="text-muted-foreground">TCAC الإيرادات:</span>
              <span className="font-mono text-foreground">{revenueTCAC.toFixed(2)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">TCAC الأرباح:</span>
              <span className="font-mono text-foreground">{profitTCAC.toFixed(2)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">TCAC الأرباح الموزعة:</span>
              <span className="font-mono text-foreground">{dividendTCAC.toFixed(2)}%</span>
            </div>
            <hr className="border-border" />
            <p className="text-[10px] text-muted-foreground">
              ⚠️ هذه التوقعات مبنية على الأداء التاريخي ولا تضمن النتائج المستقبلية. 
              استشر مستشارك المالي قبل اتخاذ أي قرار استثماري.
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default StockProjection;
