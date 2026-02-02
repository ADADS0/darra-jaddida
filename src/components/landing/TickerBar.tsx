import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";

const tickerData = [
  { symbol: "IAM", name: "اتصالات المغرب", price: "118.50", change: "+2.35", isPositive: true },
  { symbol: "BCP", name: "البنك الشعبي", price: "285.00", change: "-1.20", isPositive: false },
  { symbol: "ATW", name: "أتي ونا", price: "425.80", change: "+5.60", isPositive: true },
  { symbol: "LBV", name: "لابيل في", price: "2,450.00", change: "+12.50", isPositive: true },
  { symbol: "MNG", name: "مناجم", price: "1,890.00", change: "-8.30", isPositive: false },
  { symbol: "CIH", name: "CIH بنك", price: "345.20", change: "+3.15", isPositive: true },
  { symbol: "TQM", name: "تاقة موروكو", price: "1,125.00", change: "+18.00", isPositive: true },
  { symbol: "BOA", name: "البنك المغربي", price: "195.60", change: "-2.40", isPositive: false },
];

const TickerBar = () => {
  return (
    <div className="w-full bg-secondary/50 border-y border-border/50 overflow-hidden py-2">
      <div className="flex ticker-scroll">
        {[...tickerData, ...tickerData].map((stock, index) => (
          <motion.div
            key={`${stock.symbol}-${index}`}
            className="flex items-center gap-4 px-6 border-r border-border/30 shrink-0"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-foreground">{stock.symbol}</span>
              <span className="text-[10px] text-muted-foreground hidden sm:inline">{stock.name}</span>
            </div>
            <span className="text-sm font-medium text-foreground">{stock.price}</span>
            <div className={`flex items-center gap-1 ${stock.isPositive ? "text-chart-positive" : "text-chart-negative"}`}>
              {stock.isPositive ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              <span className="text-xs font-medium">{stock.change}%</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TickerBar;
