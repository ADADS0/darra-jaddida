import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Star, TrendingUp, TrendingDown, ChevronLeft, ArrowUpDown } from "lucide-react";
import { useState } from "react";
import { useStockData, type Stock } from "@/hooks/useStockData";
import { Skeleton } from "@/components/ui/skeleton";

type SortKey = "symbol" | "price" | "change" | "marketCap";
type SortOrder = "asc" | "desc";

const QuickStockList = () => {
  const { data, isLoading } = useStockData();
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem("favoriteStocks");
    return saved ? JSON.parse(saved) : [];
  });
  const [sortKey, setSortKey] = useState<SortKey>("marketCap");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const stocks = data?.stocks || [];

  // Sort and filter stocks
  const sortedStocks = [...stocks]
    .filter((s) => !showFavoritesOnly || favorites.includes(s.symbol))
    .sort((a, b) => {
      const multiplier = sortOrder === "desc" ? -1 : 1;
      if (sortKey === "symbol") {
        return multiplier * a.symbol.localeCompare(b.symbol);
      }
      return multiplier * (a[sortKey] - b[sortKey]);
    });

  const toggleFavorite = (symbol: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newFavorites = favorites.includes(symbol)
      ? favorites.filter((f) => f !== symbol)
      : [...favorites, symbol];
    setFavorites(newFavorites);
    localStorage.setItem("favoriteStocks", JSON.stringify(newFavorites));
  };

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("desc");
    }
  };

  const formatMarketCap = (value: number) => {
    if (value >= 1000) return `${(value / 1000).toFixed(1)}B`;
    return `${value}M`;
  };

  if (isLoading) {
    return (
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="p-4 border-b border-border">
          <Skeleton className="h-6 w-32" />
        </div>
        <div className="divide-y divide-border">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-lg" />
                <div>
                  <Skeleton className="h-4 w-16 mb-1" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </div>
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
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-foreground">الأسهم</h3>
          <Link 
            to="/screener"
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            عرض الكل
            <ChevronLeft className="w-4 h-4" />
          </Link>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${
              showFavoritesOnly
                ? "bg-warning/10 text-warning border border-warning/30"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${showFavoritesOnly ? "fill-warning" : ""}`} />
            المفضلة
            {favorites.length > 0 && (
              <span className={`text-xs ${showFavoritesOnly ? "text-warning" : "text-muted-foreground"}`}>
                ({favorites.length})
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-12 gap-2 px-4 py-2 bg-secondary/50 text-xs text-muted-foreground border-b border-border">
        <button
          onClick={() => handleSort("symbol")}
          className="col-span-5 flex items-center gap-1 hover:text-foreground"
        >
          السهم
          {sortKey === "symbol" && <ArrowUpDown className="w-3 h-3" />}
        </button>
        <button
          onClick={() => handleSort("price")}
          className="col-span-3 flex items-center gap-1 hover:text-foreground"
        >
          السعر
          {sortKey === "price" && <ArrowUpDown className="w-3 h-3" />}
        </button>
        <button
          onClick={() => handleSort("change")}
          className="col-span-2 flex items-center gap-1 hover:text-foreground"
        >
          التغير
          {sortKey === "change" && <ArrowUpDown className="w-3 h-3" />}
        </button>
        <div className="col-span-2 text-left">المفضلة</div>
      </div>

      {/* Stock List */}
      <div className="divide-y divide-border max-h-[400px] overflow-y-auto">
        {sortedStocks.length > 0 ? (
          sortedStocks.slice(0, 15).map((stock, index) => (
            <motion.div
              key={stock.symbol}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.02 }}
            >
              <Link
                to={`/stock/${stock.symbol}`}
                className="grid grid-cols-12 gap-2 px-4 py-3 hover:bg-secondary/30 transition-colors items-center group"
              >
                {/* Stock Info */}
                <div className="col-span-5 flex items-center gap-2">
                  {stock.logo ? (
                    <img
                      src={stock.logo}
                      alt={stock.symbol}
                      className="w-8 h-8 rounded-lg object-contain bg-white/10"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                      {stock.symbol.charAt(0)}
                    </div>
                  )}
                  <div>
                    <p className="font-bold text-foreground text-sm">{stock.symbol}</p>
                    <p className="text-[10px] text-muted-foreground truncate max-w-[100px]">
                      {stock.sector}
                    </p>
                  </div>
                </div>

                {/* Price */}
                <div className="col-span-3">
                  <p className="font-medium text-foreground text-sm">
                    {stock.price.toLocaleString("ar-MA")}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {formatMarketCap(stock.marketCap)}
                  </p>
                </div>

                {/* Change */}
                <div className="col-span-2">
                  <div
                    className={`flex items-center gap-0.5 text-sm font-bold ${
                      stock.change >= 0 ? "text-success" : "text-destructive"
                    }`}
                  >
                    {stock.change >= 0 ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    {stock.change >= 0 ? "+" : ""}
                    {stock.change.toFixed(2)}%
                  </div>
                </div>

                {/* Favorite */}
                <div className="col-span-2 flex justify-end">
                  <button
                    onClick={(e) => toggleFavorite(stock.symbol, e)}
                    className="p-1.5 rounded-lg hover:bg-secondary transition-colors"
                  >
                    <Star
                      className={`w-4 h-4 ${
                        favorites.includes(stock.symbol)
                          ? "fill-warning text-warning"
                          : "text-muted-foreground"
                      }`}
                    />
                  </button>
                </div>
              </Link>
            </motion.div>
          ))
        ) : (
          <div className="p-8 text-center text-muted-foreground">
            {showFavoritesOnly ? "لا توجد أسهم مفضلة" : "لا توجد أسهم"}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default QuickStockList;
