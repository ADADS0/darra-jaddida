import { useMemo } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface StockTechnicalIndicatorsProps {
  stock: {
    symbol: string;
    price: number;
    isPositive: boolean;
  };
}

const StockTechnicalIndicators = ({ stock }: StockTechnicalIndicatorsProps) => {
  // Generate mock technical indicators
  const indicators = useMemo(() => {
    const rsi = 30 + Math.random() * 40; // 30-70
    const macd = (Math.random() - 0.5) * 2;
    const macdSignal = macd + (Math.random() - 0.5) * 0.5;
    const ma20 = stock.price * (0.95 + Math.random() * 0.1);
    const ma50 = stock.price * (0.9 + Math.random() * 0.2);
    const ma200 = stock.price * (0.85 + Math.random() * 0.3);
    const bollingerUpper = stock.price * 1.05;
    const bollingerLower = stock.price * 0.95;
    const atr = stock.price * 0.02;
    const adx = 20 + Math.random() * 30;
    const stochK = 20 + Math.random() * 60;
    const stochD = stochK + (Math.random() - 0.5) * 10;
    
    return {
      rsi,
      macd,
      macdSignal,
      macdHistogram: macd - macdSignal,
      ma20,
      ma50,
      ma200,
      bollingerUpper,
      bollingerLower,
      atr,
      adx,
      stochK,
      stochD,
    };
  }, [stock.price]);

  const getRSIStatus = (rsi: number) => {
    if (rsi > 70) return { label: "ذروة شراء", color: "text-[#f23645]", bg: "bg-[#f23645]/10" };
    if (rsi < 30) return { label: "ذروة بيع", color: "text-[#089981]", bg: "bg-[#089981]/10" };
    return { label: "متوسط", color: "text-[#787b86]", bg: "bg-[#787b86]/10" };
  };

  const getMACDSignal = (histogram: number) => {
    if (histogram > 0.1) return { label: "شراء", icon: TrendingUp, color: "text-[#089981]" };
    if (histogram < -0.1) return { label: "بيع", icon: TrendingDown, color: "text-[#f23645]" };
    return { label: "محايد", icon: Minus, color: "text-[#787b86]" };
  };

  const getMAStatus = (ma: number, price: number) => {
    if (price > ma * 1.02) return { label: "فوق", color: "text-[#089981]" };
    if (price < ma * 0.98) return { label: "تحت", color: "text-[#f23645]" };
    return { label: "قريب", color: "text-[#787b86]" };
  };

  const rsiStatus = getRSIStatus(indicators.rsi);
  const macdSignal = getMACDSignal(indicators.macdHistogram);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-card rounded-2xl border border-border p-6"
    >
      <div className="flex items-center gap-2 mb-6">
        <h2 className="text-lg font-semibold text-foreground">المؤشرات التقنية</h2>
        <Tooltip>
          <TooltipTrigger>
            <Info className="w-4 h-4 text-muted-foreground" />
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">
            <p>مؤشرات تقنية تساعد في تحليل حركة السعر والزخم</p>
          </TooltipContent>
        </Tooltip>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* RSI */}
        <div className="bg-secondary/30 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground">RSI (14)</span>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="w-3 h-3 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>مؤشر القوة النسبية - يقيس سرعة وحجم تغيرات السعر</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full ${rsiStatus.bg} ${rsiStatus.color}`}>
              {rsiStatus.label}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-foreground">{indicators.rsi.toFixed(1)}</span>
            <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
              <div className="flex h-full">
                <div className="w-[30%] bg-[#089981]/30" />
                <div className="w-[40%] bg-[#787b86]/30" />
                <div className="w-[30%] bg-[#f23645]/30" />
              </div>
              <div 
                className="h-3 w-1 bg-foreground rounded-full -mt-2.5 transition-all"
                style={{ marginRight: `${indicators.rsi}%` }}
              />
            </div>
          </div>
          <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
            <span>ذروة بيع (30)</span>
            <span>ذروة شراء (70)</span>
          </div>
        </div>

        {/* MACD */}
        <div className="bg-secondary/30 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground">MACD</span>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="w-3 h-3 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>مؤشر تقارب وتباعد المتوسطات - يظهر زخم واتجاه السعر</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className={`flex items-center gap-1 text-xs ${macdSignal.color}`}>
              <macdSignal.icon className="w-3 h-3" />
              {macdSignal.label}
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">MACD</span>
              <span className="font-medium text-foreground">{indicators.macd.toFixed(3)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Signal</span>
              <span className="font-medium text-foreground">{indicators.macdSignal.toFixed(3)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Histogram</span>
              <span className={`font-medium ${indicators.macdHistogram > 0 ? "text-[#089981]" : "text-[#f23645]"}`}>
                {indicators.macdHistogram > 0 ? "+" : ""}{indicators.macdHistogram.toFixed(3)}
              </span>
            </div>
          </div>
        </div>

        {/* Moving Averages */}
        <div className="bg-secondary/30 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm font-medium text-foreground">المتوسطات المتحركة</span>
          </div>
          <div className="space-y-2">
            {[
              { label: "MA 20", value: indicators.ma20 },
              { label: "MA 50", value: indicators.ma50 },
              { label: "MA 200", value: indicators.ma200 },
            ].map((ma) => {
              const status = getMAStatus(ma.value, stock.price);
              return (
                <div key={ma.label} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{ma.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">{ma.value.toFixed(2)}</span>
                    <span className={`text-xs ${status.color}`}>({status.label})</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Other Indicators */}
        <div className="bg-secondary/30 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm font-medium text-foreground">مؤشرات أخرى</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">ADX (قوة الاتجاه)</span>
              <span className={`font-medium ${indicators.adx > 25 ? "text-[#089981]" : "text-[#787b86]"}`}>
                {indicators.adx.toFixed(1)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">ATR (متوسط المدى)</span>
              <span className="font-medium text-foreground">{indicators.atr.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Stochastic %K</span>
              <span className={`font-medium ${indicators.stochK > 80 ? "text-[#f23645]" : indicators.stochK < 20 ? "text-[#089981]" : "text-foreground"}`}>
                {indicators.stochK.toFixed(1)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Overall Signal */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">الإشارة العامة</span>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${stock.isPositive ? "bg-[#089981]" : "bg-[#f23645]"}`} />
              <span className={`text-sm font-medium ${stock.isPositive ? "text-[#089981]" : "text-[#f23645]"}`}>
                {stock.isPositive ? "إيجابي" : "سلبي"}
              </span>
            </div>
            <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded">
              بناءً على {Object.keys(indicators).length} مؤشر
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default StockTechnicalIndicators;
