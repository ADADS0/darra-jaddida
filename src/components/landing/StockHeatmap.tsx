import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { TrendingUp, TrendingDown, Maximize2, Filter, RefreshCw, X, Minimize2 } from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import { useStockData, getUniqueSectors, type Stock, type Sector } from "@/hooks/useStockData";
import { Skeleton } from "@/components/ui/skeleton";

type ViewMode = "stocks" | "sectors";

interface LayoutItem extends Stock {
  x: number;
  y: number;
  width: number;
  height: number;
}

const StockHeatmap = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("stocks");
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const [showSectorFilter, setShowSectorFilter] = useState(false);
  const [hoveredStock, setHoveredStock] = useState<Stock | null>(null);
  const [layout, setLayout] = useState<LayoutItem[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, error, refetch, isRefetching } = useStockData();

  // Get unique sectors for filter
  const sectors = data?.stocks ? getUniqueSectors(data.stocks) : [];

  // Filter stocks by sector
  const filteredStocks = data?.stocks
    ? selectedSector
      ? data.stocks.filter(s => s.sector === selectedSector)
      : data.stocks
    : [];

  // Sort by market cap for treemap layout
  const sortedStocks = [...filteredStocks].sort((a, b) => b.marketCap - a.marketCap);
  const totalMarketCap = sortedStocks.reduce((acc, s) => acc + s.marketCap, 0);

  // Treemap layout algorithm
  const calculateLayout = useCallback(() => {
    if (!containerRef.current || sortedStocks.length === 0) return [];

    const container = containerRef.current.getBoundingClientRect();
    const containerWidth = container.width - 16; // padding
    const containerHeight = container.height - 16; // padding

    const layoutResult: LayoutItem[] = [];
    let x = 8;
    let y = 8;
    let rowHeight = 0;
    let rowWidth = 0;
    const padding = 4;

    // Use squarified treemap approach
    sortedStocks.forEach((stock, index) => {
      const ratio = stock.marketCap / totalMarketCap;
      const area = containerWidth * containerHeight * ratio;
      
      // Calculate dimensions trying to keep aspect ratio close to 1
      let width = Math.sqrt(area * 1.5);
      let height = area / width;
      
      // Minimum sizes
      width = Math.max(width, 80);
      height = Math.max(height, 60);
      
      // Maximum sizes
      width = Math.min(width, containerWidth * 0.4);
      height = Math.min(height, containerHeight * 0.35);

      // Check if we need to move to a new row
      if (rowWidth + width > containerWidth) {
        x = 8;
        y += rowHeight + padding;
        rowHeight = 0;
        rowWidth = 0;
      }

      // Adjust if going out of bounds
      if (y + height > containerHeight) {
        height = containerHeight - y - 8;
      }

      layoutResult.push({
        ...stock,
        x,
        y,
        width: width - padding,
        height: height - padding,
      });

      x += width;
      rowWidth += width;
      rowHeight = Math.max(rowHeight, height);
    });

    return layoutResult;
  }, [sortedStocks, totalMarketCap]);

  // Recalculate layout on resize or data change
  useEffect(() => {
    const newLayout = calculateLayout();
    setLayout(newLayout);

    const handleResize = () => {
      const newLayout = calculateLayout();
      setLayout(newLayout);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [calculateLayout, isExpanded]);

  // Get color based on change percentage
  const getColor = (change: number) => {
    if (change >= 5) return "#047857";
    if (change >= 3) return "#059669";
    if (change >= 2) return "#10b981";
    if (change >= 1) return "#34d399";
    if (change >= 0.5) return "#6ee7b7";
    if (change > 0) return "#a7f3d0";
    if (change === 0) return "#e5e7eb";
    if (change >= -0.5) return "#fecaca";
    if (change >= -1) return "#fca5a5";
    if (change >= -2) return "#f87171";
    if (change >= -3) return "#ef4444";
    if (change >= -5) return "#dc2626";
    return "#b91c1c";
  };

  // Get text color based on bg
  const getTextColor = (change: number) => {
    if (Math.abs(change) < 0.5) return "#1f2937";
    return "#ffffff";
  };

  // Format large numbers
  const formatLargeNumber = (num: number): string => {
    if (num >= 1e9) return `${(num / 1e9).toFixed(2)} مليار`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(1)} مليون`;
    return num.toLocaleString("ar-MA");
  };

  if (error) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="bg-destructive/10 border border-destructive rounded-xl p-6 text-center">
            <svg className="w-16 h-16 text-destructive mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-destructive font-medium">خطأ في تحميل البيانات</p>
            <button
              onClick={() => refetch()}
              className="mt-4 px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition"
            >
              إعادة المحاولة
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6"
        >
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              خريطة السوق
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              أحجام الأسهم حسب القيمة السوقية والألوان حسب الأداء
              {data?.lastUpdate && (
                <span className="text-xs mr-2">
                  • آخر تحديث: {new Date(data.lastUpdate).toLocaleTimeString("ar-MA")}
                </span>
              )}
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Sector Filter */}
            <div className="relative">
              <button
                onClick={() => setShowSectorFilter(!showSectorFilter)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedSector
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                <Filter className="w-4 h-4" />
                {selectedSector || "جميع القطاعات"}
              </button>

              {showSectorFilter && (
                <div className="absolute top-full left-0 mt-2 bg-card border border-border rounded-xl shadow-xl z-50 min-w-[180px] overflow-hidden">
                  <button
                    onClick={() => {
                      setSelectedSector(null);
                      setShowSectorFilter(false);
                    }}
                    className={`w-full px-4 py-3 text-right text-sm hover:bg-secondary transition-colors ${
                      !selectedSector ? "bg-primary/10 text-primary font-medium" : ""
                    }`}
                  >
                    جميع القطاعات
                  </button>
                  {sectors.map((sector) => (
                    <button
                      key={sector}
                      onClick={() => {
                        setSelectedSector(sector);
                        setShowSectorFilter(false);
                      }}
                      className={`w-full px-4 py-3 text-right text-sm hover:bg-secondary transition-colors ${
                        selectedSector === sector ? "bg-primary/10 text-primary font-medium" : ""
                      }`}
                    >
                      {sector}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Clear Filter */}
            {selectedSector && (
              <button
                onClick={() => setSelectedSector(null)}
                className="p-2 rounded-lg bg-secondary text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* View Toggle */}
            <div className="flex items-center gap-1 p-1 bg-secondary rounded-xl">
              <button
                onClick={() => setViewMode("stocks")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  viewMode === "stocks"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                الأسهم
              </button>
              <button
                onClick={() => setViewMode("sectors")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  viewMode === "sectors"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                القطاعات
              </button>
            </div>

            {/* Refresh Button */}
            <button
              onClick={() => refetch()}
              disabled={isRefetching}
              className="p-2 rounded-lg bg-secondary text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 ${isRefetching ? "animate-spin" : ""}`} />
            </button>

            {/* Expand Button */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 rounded-lg bg-secondary text-muted-foreground hover:text-foreground transition-colors"
            >
              {isExpanded ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </button>
          </div>
        </motion.div>

        {/* Heatmap Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className={`bg-card rounded-2xl border border-border overflow-hidden ${
            isExpanded ? "fixed inset-4 z-50" : ""
          }`}
        >
          {isExpanded && (
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                خريطة السوق
                {selectedSector && <span className="text-primary mr-2">• {selectedSector}</span>}
              </h3>
              <button
                onClick={() => setIsExpanded(false)}
                className="p-2 rounded-lg bg-secondary text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          {isLoading ? (
            <div className="h-[600px] p-2 grid grid-cols-4 gap-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="rounded-lg" />
              ))}
            </div>
          ) : viewMode === "stocks" ? (
            <div
              ref={containerRef}
              className={`relative w-full bg-muted/30 overflow-hidden ${
                isExpanded ? "h-[calc(100%-60px)]" : "h-[600px]"
              }`}
            >
              {layout.map((stock) => (
                <Link
                  key={stock.symbol}
                  to={`/stock/${stock.symbol}`}
                  className="absolute cursor-pointer transition-all duration-200 hover:brightness-110 hover:z-10"
                  style={{
                    left: `${stock.x}px`,
                    top: `${stock.y}px`,
                    width: `${stock.width}px`,
                    height: `${stock.height}px`,
                    backgroundColor: getColor(stock.change),
                    border: hoveredStock?.symbol === stock.symbol ? "3px solid hsl(var(--foreground))" : "none",
                    borderRadius: "8px",
                  }}
                  onMouseEnter={() => setHoveredStock(stock)}
                  onMouseLeave={() => setHoveredStock(null)}
                >
                  <div className="p-2 h-full flex flex-col justify-between" style={{ color: getTextColor(stock.change) }}>
                    {/* Stock Header */}
                    <div className="flex items-center gap-2">
                      {stock.logo ? (
                        <img
                          src={stock.logo}
                          alt={stock.symbol}
                          className="w-6 h-6 rounded-md bg-white/20 object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="w-6 h-6 rounded-md bg-white/20 flex items-center justify-center text-xs font-bold">
                          {stock.symbol.charAt(0)}
                        </div>
                      )}
                      <span className="font-bold text-sm truncate">
                        {stock.symbol}
                      </span>
                    </div>

                    {/* Stock Details - show if box is large enough */}
                    {stock.width > 100 && stock.height > 80 && (
                      <div className="text-xs">
                        <div className="truncate mb-1 opacity-80">{stock.name}</div>
                        <div className="font-semibold">
                          {stock.price.toLocaleString("ar-MA")} MAD
                        </div>
                      </div>
                    )}

                    {/* Change Percentage */}
                    <div className="flex items-center gap-1 font-bold text-sm">
                      {stock.change >= 0 ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                      <span>
                        {stock.change >= 0 ? "+" : ""}{stock.change.toFixed(2)}%
                      </span>
                    </div>
                  </div>

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none rounded-lg" />
                </Link>
              ))}
            </div>
          ) : (
            <div className="grid gap-1 p-2 h-[600px] grid-cols-3 md:grid-cols-4 grid-rows-3">
              {data?.sectors?.map((sector: Sector, index: number) => (
                <button
                  key={sector.name}
                  onClick={() => {
                    setSelectedSector(sector.name);
                    setViewMode("stocks");
                  }}
                  className={`${index === 0 ? "col-span-2 row-span-2" : index < 3 ? "col-span-1 row-span-2" : ""} 
                    rounded-lg p-4 flex flex-col justify-between transition-all hover:brightness-110 text-right`}
                  style={{ backgroundColor: getColor(sector.change), color: getTextColor(sector.change) }}
                >
                  <div>
                    <span className="text-xl font-bold">
                      {sector.name}
                    </span>
                    <p className="text-sm opacity-80">
                      {sector.nameEn}
                    </p>
                    <p className="text-xs opacity-60 mt-1">
                      {sector.stockCount} أسهم
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    {sector.change >= 0 ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    <span className="text-lg font-semibold">
                      {sector.change >= 0 ? "+" : ""}{sector.change.toFixed(2)}%
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Hovered Stock Info Panel */}
          {hoveredStock && viewMode === "stocks" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-card border-t border-border"
            >
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div>
                  <div className="text-xs text-muted-foreground">الاسم</div>
                  <div className="font-semibold text-foreground">{hoveredStock.name}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">الرمز</div>
                  <div className="font-semibold text-foreground">{hoveredStock.symbol}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">السعر</div>
                  <div className="font-semibold text-foreground">{hoveredStock.price.toLocaleString("ar-MA")} MAD</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">التغيير</div>
                  <div className={`font-semibold ${hoveredStock.change >= 0 ? "text-emerald-500" : "text-red-500"}`}>
                    {hoveredStock.change >= 0 ? "+" : ""}{hoveredStock.change.toFixed(2)}%
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">القيمة السوقية</div>
                  <div className="font-semibold text-foreground">{formatLargeNumber(hoveredStock.marketCap)} MAD</div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Legend */}
          <div className="p-3 border-t border-border flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="text-muted-foreground">التغيير:</span>
            <div className="flex items-center gap-1">
              <div className="w-6 h-4 rounded" style={{ backgroundColor: "#b91c1c" }} />
              <span className="text-muted-foreground">≤-5%</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-6 h-4 rounded" style={{ backgroundColor: "#ef4444" }} />
              <span className="text-muted-foreground">-3%</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-6 h-4 rounded" style={{ backgroundColor: "#f87171" }} />
              <span className="text-muted-foreground">-1%</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-6 h-4 rounded" style={{ backgroundColor: "#e5e7eb" }} />
              <span className="text-muted-foreground">0%</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-6 h-4 rounded" style={{ backgroundColor: "#34d399" }} />
              <span className="text-muted-foreground">+1%</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-6 h-4 rounded" style={{ backgroundColor: "#10b981" }} />
              <span className="text-muted-foreground">+3%</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-6 h-4 rounded" style={{ backgroundColor: "#047857" }} />
              <span className="text-muted-foreground">≥+5%</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Click outside to close filter */}
      {showSectorFilter && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowSectorFilter(false)}
        />
      )}
    </section>
  );
};

export default StockHeatmap;
