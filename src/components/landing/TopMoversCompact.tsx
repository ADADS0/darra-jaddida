import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { TrendingUp, TrendingDown, ChevronLeft } from "lucide-react";
import { useStockData } from "@/hooks/useStockData";
import { Skeleton } from "@/components/ui/skeleton";

const TopMoversCompact = () => {
  const { data, isLoading } = useStockData();

  const stocks = data?.stocks || [];
  const gainers = [...stocks].filter(s => s.change > 0).sort((a, b) => b.change - a.change).slice(0, 5);
  const losers = [...stocks].filter(s => s.change < 0).sort((a, b) => a.change - b.change).slice(0, 5);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[0, 1].map((i) => (
          <div key={i} className="bg-card rounded-2xl border border-border p-4">
            <Skeleton className="h-6 w-32 mb-4" />
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, j) => (
                <Skeleton key={j} className="h-12" />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  const StockRow = ({ stock, rank, isGainer }: { stock: typeof stocks[0]; rank: number; isGainer: boolean }) => (
    <Link
      to={`/stock/${stock.symbol}`}
      className="flex items-center gap-3 p-2 rounded-xl hover:bg-secondary/50 transition-colors group"
    >
      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
        isGainer ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
      }`}>
        {rank}
      </span>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          {stock.logo ? (
            <img
              src={stock.logo}
              alt=""
              className="w-6 h-6 rounded object-contain bg-white/10"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
          ) : (
            <div className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold ${
              isGainer ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
            }`}>
              {stock.symbol.charAt(0)}
            </div>
          )}
          <div className="min-w-0">
            <p className="font-bold text-foreground text-sm truncate">{stock.symbol}</p>
            <p className="text-[10px] text-muted-foreground truncate">{stock.name}</p>
          </div>
        </div>
      </div>
      
      <div className="text-left">
        <p className="text-xs text-muted-foreground">
          {stock.price.toLocaleString("ar-MA")}
        </p>
        <p className={`text-sm font-bold flex items-center gap-0.5 ${
          isGainer ? 'text-success' : 'text-destructive'
        }`}>
          {isGainer ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {stock.change >= 0 ? "+" : ""}{stock.change.toFixed(2)}%
        </p>
      </div>
    </Link>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Gainers */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="bg-card rounded-2xl border border-border overflow-hidden"
      >
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-success" />
            <h3 className="font-bold text-foreground">الأكثر ارتفاعاً</h3>
          </div>
          <Link 
            to="/screener"
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-success transition-colors"
          >
            عرض الكل
            <ChevronLeft className="w-3 h-3" />
          </Link>
        </div>
        <div className="p-2 space-y-1">
          {gainers.map((stock, index) => (
            <StockRow key={stock.symbol} stock={stock} rank={index + 1} isGainer={true} />
          ))}
          {gainers.length === 0 && (
            <p className="p-4 text-center text-muted-foreground text-sm">
              لا توجد أسهم صاعدة اليوم
            </p>
          )}
        </div>
      </motion.div>

      {/* Losers */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="bg-card rounded-2xl border border-border overflow-hidden"
      >
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-destructive" />
            <h3 className="font-bold text-foreground">الأكثر انخفاضاً</h3>
          </div>
          <Link 
            to="/screener"
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors"
          >
            عرض الكل
            <ChevronLeft className="w-3 h-3" />
          </Link>
        </div>
        <div className="p-2 space-y-1">
          {losers.map((stock, index) => (
            <StockRow key={stock.symbol} stock={stock} rank={index + 1} isGainer={false} />
          ))}
          {losers.length === 0 && (
            <p className="p-4 text-center text-muted-foreground text-sm">
              لا توجد أسهم هابطة اليوم
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default TopMoversCompact;
