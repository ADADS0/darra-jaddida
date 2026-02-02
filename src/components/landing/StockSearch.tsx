import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Star, TrendingUp, TrendingDown, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useStockData, type Stock } from "@/hooks/useStockData";

const StockSearch = () => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem("favoriteStocks");
    return saved ? JSON.parse(saved) : [];
  });
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data, isLoading } = useStockData();
  const stocks = data?.stocks || [];

  // Filter stocks based on query
  const filteredStocks = stocks.filter(
    (s) =>
      s.symbol.toLowerCase().includes(query.toLowerCase()) ||
      s.name.toLowerCase().includes(query.toLowerCase()) ||
      s.nameEn.toLowerCase().includes(query.toLowerCase())
  );

  // Get favorite stocks
  const favoriteStocks = stocks.filter((s) => favorites.includes(s.symbol));

  // Toggle favorite
  const toggleFavorite = (symbol: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newFavorites = favorites.includes(symbol)
      ? favorites.filter((f) => f !== symbol)
      : [...favorites, symbol];
    setFavorites(newFavorites);
    localStorage.setItem("favoriteStocks", JSON.stringify(newFavorites));
  };

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
        setTimeout(() => inputRef.current?.focus(), 100);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const StockRow = ({ stock, showFavorite = true }: { stock: Stock; showFavorite?: boolean }) => (
    <Link
      to={`/stock/${stock.symbol}`}
      className="flex items-center justify-between p-3 hover:bg-secondary/50 rounded-lg transition-colors group"
      onClick={() => setIsOpen(false)}
    >
      <div className="flex items-center gap-3">
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
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
            {stock.symbol.charAt(0)}
          </div>
        )}
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-foreground">{stock.symbol}</span>
            <span className="text-xs text-muted-foreground">{stock.sector}</span>
          </div>
          <p className="text-xs text-muted-foreground">{stock.name}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-left">
          <p className="text-sm font-medium text-foreground">
            {stock.price.toLocaleString("ar-MA")}
          </p>
          <p className={`text-xs flex items-center gap-1 ${stock.change >= 0 ? "text-success" : "text-destructive"}`}>
            {stock.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {stock.change >= 0 ? "+" : ""}{stock.change.toFixed(2)}%
          </p>
        </div>
        {showFavorite && (
          <button
            onClick={(e) => toggleFavorite(stock.symbol, e)}
            className="p-1.5 rounded-lg hover:bg-secondary opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Star
              className={`w-4 h-4 ${
                favorites.includes(stock.symbol)
                  ? "fill-warning text-warning"
                  : "text-muted-foreground"
              }`}
            />
          </button>
        )}
      </div>
    </Link>
  );

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl mx-auto">
      {/* Search Input */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          ref={inputRef}
          type="text"
          placeholder="ابحث عن سهم... (⌘K)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          className="w-full h-14 pr-12 pl-4 bg-card border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-secondary"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        )}
      </motion.div>

      {/* Dropdown Results */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: 10, height: 0 }}
            className="absolute top-full mt-2 w-full bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden"
          >
            <div className="max-h-[400px] overflow-y-auto">
              {/* Favorites Section */}
              {!query && favoriteStocks.length > 0 && (
                <div className="p-2 border-b border-border">
                  <p className="px-3 py-2 text-xs font-medium text-muted-foreground flex items-center gap-2">
                    <Star className="w-3 h-3 fill-warning text-warning" />
                    المفضلة
                  </p>
                  {favoriteStocks.map((stock) => (
                    <StockRow key={stock.symbol} stock={stock} />
                  ))}
                </div>
              )}

              {/* Search Results or All Stocks */}
              <div className="p-2">
                {query && (
                  <p className="px-3 py-2 text-xs font-medium text-muted-foreground">
                    نتائج البحث ({filteredStocks.length})
                  </p>
                )}
                {!query && !favoriteStocks.length && (
                  <p className="px-3 py-2 text-xs font-medium text-muted-foreground">
                    جميع الأسهم
                  </p>
                )}
                {isLoading ? (
                  <div className="p-6 text-center text-muted-foreground">
                    جارِ التحميل...
                  </div>
                ) : filteredStocks.length > 0 ? (
                  (query ? filteredStocks : filteredStocks.slice(0, 8)).map((stock) => (
                    <StockRow key={stock.symbol} stock={stock} />
                  ))
                ) : (
                  <div className="p-6 text-center text-muted-foreground">
                    لا توجد نتائج لـ "{query}"
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StockSearch;
