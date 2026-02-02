import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { TrendingUp, TrendingDown, ChevronLeft } from "lucide-react";
import { useStockData, type Stock, type Sector } from "@/hooks/useStockData";
import { Skeleton } from "@/components/ui/skeleton";

interface SectorData extends Sector {
  stocks: Stock[];
}

const SectorHeatmap = () => {
  const { data, isLoading, error } = useStockData();

  // Group stocks by sector
  const getSectorData = (): SectorData[] => {
    if (!data?.stocks) return [];
    
    const sectorMap = new Map<string, SectorData>();
    
    data.stocks.forEach(stock => {
      const existing = sectorMap.get(stock.sector);
      if (existing) {
        existing.stocks.push(stock);
      } else {
        sectorMap.set(stock.sector, {
          name: stock.sector,
          nameEn: stock.sectorEn,
          change: 0,
          stockCount: 0,
          stocks: [stock],
        });
      }
    });

    // Calculate sector averages and sort by market cap
    return Array.from(sectorMap.values())
      .map(sector => ({
        ...sector,
        stockCount: sector.stocks.length,
        change: sector.stocks.reduce((acc, s) => acc + s.change, 0) / sector.stocks.length,
        stocks: sector.stocks.sort((a, b) => b.marketCap - a.marketCap),
      }))
      .sort((a, b) => {
        const aMarketCap = a.stocks.reduce((acc, s) => acc + s.marketCap, 0);
        const bMarketCap = b.stocks.reduce((acc, s) => acc + s.marketCap, 0);
        return bMarketCap - aMarketCap;
      });
  };

  const sectors = getSectorData();

  // Get color based on change percentage
  const getColor = (change: number) => {
    if (change >= 4) return "bg-emerald-700";
    if (change >= 2.5) return "bg-emerald-600";
    if (change >= 1.5) return "bg-emerald-500";
    if (change >= 0.5) return "bg-emerald-400/80";
    if (change > 0) return "bg-emerald-400/60";
    if (change === 0) return "bg-muted";
    if (change >= -0.5) return "bg-red-400/60";
    if (change >= -1.5) return "bg-red-400/80";
    if (change >= -2.5) return "bg-red-500";
    if (change >= -4) return "bg-red-600";
    return "bg-red-700";
  };

  const getTextColor = (change: number) => {
    if (Math.abs(change) < 0.5) return "text-foreground";
    return "text-white";
  };

  if (isLoading) {
    return (
      <div className="bg-card rounded-2xl border border-border p-4">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="grid grid-cols-3 gap-2 h-[400px]">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-card rounded-2xl border border-border p-6 text-center">
        <p className="text-destructive">خطأ في تحميل البيانات</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-card rounded-2xl border border-border overflow-hidden"
    >
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-primary" />
          خريطة القطاعات
        </h3>
        <Link 
          to="/screener"
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          عرض الكل
          <ChevronLeft className="w-4 h-4" />
        </Link>
      </div>

      {/* Sectors Grid */}
      <div className="p-2 grid gap-2" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))' }}>
        {sectors.slice(0, 8).map((sector, index) => (
          <motion.div
            key={sector.name}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className={`${getColor(sector.change)} rounded-xl p-3 cursor-pointer transition-all hover:brightness-110`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className={`text-sm font-bold ${getTextColor(sector.change)}`}>
                {sector.name}
              </span>
              <ChevronLeft className={`w-4 h-4 ${getTextColor(sector.change)} opacity-60`} />
            </div>
            
            <div className={`flex items-center gap-1 text-lg font-bold ${getTextColor(sector.change)}`}>
              {sector.change >= 0 ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              {sector.change >= 0 ? "+" : ""}{sector.change.toFixed(2)}%
            </div>
            
            <p className={`text-xs mt-1 ${getTextColor(sector.change)} opacity-70`}>
              {sector.stockCount} سهم
            </p>

            {/* Top stocks preview */}
            <div className="mt-2 flex flex-wrap gap-1">
              {sector.stocks.slice(0, 3).map((stock) => (
                <Link
                  key={stock.symbol}
                  to={`/stock/${stock.symbol}`}
                  onClick={(e) => e.stopPropagation()}
                  className={`text-[10px] px-1.5 py-0.5 rounded ${
                    Math.abs(sector.change) < 0.5 
                      ? 'bg-background/20 text-foreground' 
                      : 'bg-white/20 text-white'
                  } hover:bg-white/30 transition-colors`}
                >
                  {stock.symbol}
                </Link>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Legend */}
      <div className="p-3 border-t border-border flex items-center justify-center gap-4 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-red-600" />
          <span className="text-muted-foreground">-5%</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-red-400" />
          <span className="text-muted-foreground">-2%</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-muted" />
          <span className="text-muted-foreground">0%</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-emerald-400" />
          <span className="text-muted-foreground">+2%</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-emerald-600" />
          <span className="text-muted-foreground">+5%</span>
        </div>
      </div>
    </motion.div>
  );
};

export default SectorHeatmap;
