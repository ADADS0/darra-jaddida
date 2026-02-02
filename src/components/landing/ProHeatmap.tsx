import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  TrendingUp, 
  TrendingDown, 
  Maximize2, 
  Minimize2, 
  RefreshCw, 
  X,
  Layers,
  Grid3X3
} from "lucide-react";
import { useStockData, type Stock, type Sector } from "@/hooks/useStockData";
import { Skeleton } from "@/components/ui/skeleton";

type ViewMode = "stocks" | "sectors";

interface LayoutItem extends Stock {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface SectorLayout {
  name: string;
  nameEn: string;
  change: number;
  stocks: LayoutItem[];
  x: number;
  y: number;
  width: number;
  height: number;
}

const ProHeatmap = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("stocks");
  const [isExpanded, setIsExpanded] = useState(false);
  const [hoveredStock, setHoveredStock] = useState<Stock | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, error, refetch, isRefetching } = useStockData();

  const stocks = data?.stocks || [];
  const sortedStocks = [...stocks].sort((a, b) => b.marketCap - a.marketCap);
  const totalMarketCap = sortedStocks.reduce((acc, s) => acc + s.marketCap, 0);

  // Group stocks by sector
  const getSectorGroups = useCallback(() => {
    const sectorMap = new Map<string, Stock[]>();
    sortedStocks.forEach(stock => {
      const existing = sectorMap.get(stock.sector) || [];
      existing.push(stock);
      sectorMap.set(stock.sector, existing);
    });
    
    return Array.from(sectorMap.entries())
      .map(([name, stocks]) => ({
        name,
        nameEn: stocks[0]?.sectorEn || name,
        stocks,
        totalMarketCap: stocks.reduce((acc, s) => acc + s.marketCap, 0),
        change: stocks.reduce((acc, s) => acc + s.change, 0) / stocks.length,
      }))
      .sort((a, b) => b.totalMarketCap - a.totalMarketCap);
  }, [sortedStocks]);

  // Squarified treemap algorithm
  const calculateTreemapLayout = useCallback((
    items: { symbol: string; marketCap: number }[],
    x: number,
    y: number,
    width: number,
    height: number,
    padding: number = 2
  ): { symbol: string; x: number; y: number; width: number; height: number }[] => {
    if (items.length === 0) return [];
    if (items.length === 1) {
      return [{
        symbol: items[0].symbol,
        x: x + padding,
        y: y + padding,
        width: Math.max(width - padding * 2, 20),
        height: Math.max(height - padding * 2, 20),
      }];
    }

    const total = items.reduce((acc, item) => acc + item.marketCap, 0);
    const isHorizontal = width >= height;
    
    let accumulated = 0;
    let splitIndex = 0;
    const halfTotal = total / 2;
    
    for (let i = 0; i < items.length; i++) {
      accumulated += items[i].marketCap;
      if (accumulated >= halfTotal) {
        splitIndex = i;
        break;
      }
    }
    
    if (splitIndex === 0) splitIndex = 1;
    
    const firstHalf = items.slice(0, splitIndex);
    const secondHalf = items.slice(splitIndex);
    
    const firstTotal = firstHalf.reduce((acc, item) => acc + item.marketCap, 0);
    const ratio = firstTotal / total;
    
    let firstRect, secondRect;
    if (isHorizontal) {
      const splitWidth = width * ratio;
      firstRect = { x, y, width: splitWidth, height };
      secondRect = { x: x + splitWidth, y, width: width - splitWidth, height };
    } else {
      const splitHeight = height * ratio;
      firstRect = { x, y, width, height: splitHeight };
      secondRect = { x, y: y + splitHeight, width, height: height - splitHeight };
    }
    
    return [
      ...calculateTreemapLayout(firstHalf, firstRect.x, firstRect.y, firstRect.width, firstRect.height, padding),
      ...calculateTreemapLayout(secondHalf, secondRect.x, secondRect.y, secondRect.width, secondRect.height, padding),
    ];
  }, []);

  // Calculate layout for stocks grouped by sector
  const calculateSectorLayout = useCallback((): SectorLayout[] => {
    if (!containerRef.current || stocks.length === 0) return [];

    const container = containerRef.current.getBoundingClientRect();
    const width = container.width - 8;
    const height = container.height - 8;
    const sectorGroups = getSectorGroups();

    // First, layout the sectors
    const sectorItems = sectorGroups.map(s => ({
      symbol: s.name,
      marketCap: s.totalMarketCap,
    }));

    const sectorRects = calculateTreemapLayout(sectorItems, 4, 4, width, height, 2);

    // Then, layout stocks within each sector
    return sectorGroups.map((sector, index) => {
      const rect = sectorRects.find(r => r.symbol === sector.name);
      if (!rect) return null;

      const stockItems = sector.stocks.map(s => ({
        symbol: s.symbol,
        marketCap: s.marketCap,
      }));

      const stockRects = calculateTreemapLayout(
        stockItems,
        rect.x + 2,
        rect.y + 20, // Leave space for sector header
        rect.width - 4,
        rect.height - 24,
        1
      );

      const stocksWithLayout: LayoutItem[] = sector.stocks.map(stock => {
        const stockRect = stockRects.find(r => r.symbol === stock.symbol);
        return {
          ...stock,
          x: stockRect?.x || 0,
          y: stockRect?.y || 0,
          width: stockRect?.width || 0,
          height: stockRect?.height || 0,
        };
      });

      return {
        name: sector.name,
        nameEn: sector.nameEn,
        change: sector.change,
        stocks: stocksWithLayout,
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height,
      };
    }).filter(Boolean) as SectorLayout[];
  }, [stocks, getSectorGroups, calculateTreemapLayout]);

  // Calculate simple stock layout (no sector grouping)
  const calculateStockLayout = useCallback((): LayoutItem[] => {
    if (!containerRef.current || stocks.length === 0) return [];

    const container = containerRef.current.getBoundingClientRect();
    const width = container.width - 8;
    const height = container.height - 8;

    const stockItems = sortedStocks.map(s => ({
      symbol: s.symbol,
      marketCap: s.marketCap,
    }));

    const rects = calculateTreemapLayout(stockItems, 4, 4, width, height, 2);

    return sortedStocks.map(stock => {
      const rect = rects.find(r => r.symbol === stock.symbol);
      return {
        ...stock,
        x: rect?.x || 0,
        y: rect?.y || 0,
        width: rect?.width || 0,
        height: rect?.height || 0,
      };
    });
  }, [sortedStocks, calculateTreemapLayout]);

  const [sectorLayout, setSectorLayout] = useState<SectorLayout[]>([]);
  const [stockLayout, setStockLayout] = useState<LayoutItem[]>([]);

  useEffect(() => {
    const updateLayout = () => {
      if (viewMode === "sectors") {
        setSectorLayout(calculateSectorLayout());
      } else {
        setStockLayout(calculateStockLayout());
      }
    };

    updateLayout();
    window.addEventListener("resize", updateLayout);
    return () => window.removeEventListener("resize", updateLayout);
  }, [viewMode, calculateSectorLayout, calculateStockLayout, isExpanded, stocks]);

  // Get color based on change percentage
  const getColor = (change: number) => {
    if (change >= 4) return "#047857";
    if (change >= 2.5) return "#059669";
    if (change >= 1.5) return "#10b981";
    if (change >= 0.5) return "#34d399";
    if (change > 0) return "#6ee7b7";
    if (change === 0) return "#4b5563";
    if (change >= -0.5) return "#fca5a5";
    if (change >= -1.5) return "#f87171";
    if (change >= -2.5) return "#ef4444";
    if (change >= -4) return "#dc2626";
    return "#b91c1c";
  };

  const handleMouseMove = (e: React.MouseEvent, stock: Stock) => {
    setHoveredStock(stock);
    setTooltipPos({ x: e.clientX, y: e.clientY });
  };

  if (error) {
    return (
      <div className="bg-destructive/10 border border-destructive rounded-xl p-6 text-center">
        <p className="text-destructive">خطأ في تحميل البيانات</p>
        <button
          onClick={() => refetch()}
          className="mt-4 px-4 py-2 bg-destructive text-destructive-foreground rounded-lg"
        >
          إعادة المحاولة
        </button>
      </div>
    );
  }

  const heatmapContent = (
    <>
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-bold text-foreground">
            خريطة السوق
          </h3>
          {data?.lastUpdate && (
            <span className="text-xs text-muted-foreground">
              آخر تحديث: {new Date(data.lastUpdate).toLocaleTimeString("ar-MA")}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 p-1 bg-secondary rounded-lg">
            <button
              onClick={() => setViewMode("stocks")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                viewMode === "stocks"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Grid3X3 className="w-3.5 h-3.5" />
              الأسهم
            </button>
            <button
              onClick={() => setViewMode("sectors")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                viewMode === "sectors"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              القطاعات
            </button>
          </div>

          <button
            onClick={() => refetch()}
            disabled={isRefetching}
            className="p-2 rounded-lg bg-secondary text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isRefetching ? "animate-spin" : ""}`} />
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-lg bg-secondary text-muted-foreground hover:text-foreground transition-colors"
          >
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {isExpanded && (
            <button
              onClick={() => setIsExpanded(false)}
              className="p-2 rounded-lg bg-secondary text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Heatmap Container */}
      {isLoading ? (
        <div className="h-[500px] p-2 grid grid-cols-4 gap-2">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} className="rounded-lg" />
          ))}
        </div>
      ) : (
        <div
          ref={containerRef}
          className={`relative w-full bg-background/50 overflow-hidden ${
            isExpanded ? "h-[calc(100vh-120px)]" : "h-[500px]"
          }`}
        >
          {viewMode === "sectors" ? (
            // Sector-grouped view
            sectorLayout.map((sector) => (
              <div
                key={sector.name}
                className="absolute"
                style={{
                  left: `${sector.x}px`,
                  top: `${sector.y}px`,
                  width: `${sector.width}px`,
                  height: `${sector.height}px`,
                }}
              >
                {/* Sector Header */}
                <div 
                  className="absolute top-0 left-0 right-0 h-5 flex items-center justify-between px-2 text-[10px] font-bold text-white/90 bg-black/30 rounded-t-md"
                  style={{ zIndex: 10 }}
                >
                  <span className="truncate">{sector.name}</span>
                  <span className={sector.change >= 0 ? "text-emerald-300" : "text-red-300"}>
                    {sector.change >= 0 ? "▲" : "▼"} {Math.abs(sector.change).toFixed(2)}%
                  </span>
                </div>

                {/* Stocks within sector */}
                {sector.stocks.map((stock) => (
                  <Link
                    key={stock.symbol}
                    to={`/stock/${stock.symbol}`}
                    className="absolute transition-all duration-150 hover:brightness-125 hover:z-20"
                    style={{
                      left: `${stock.x - sector.x}px`,
                      top: `${stock.y - sector.y}px`,
                      width: `${stock.width}px`,
                      height: `${stock.height}px`,
                      backgroundColor: getColor(stock.change),
                      border: hoveredStock?.symbol === stock.symbol ? "2px solid white" : "none",
                      borderRadius: "4px",
                    }}
                    onMouseMove={(e) => handleMouseMove(e, stock)}
                    onMouseLeave={() => setHoveredStock(null)}
                  >
                    <div className="p-1 h-full flex flex-col justify-between text-white">
                      {stock.width > 50 && (
                        <div className="flex items-center gap-1">
                          {stock.logo && stock.width > 80 && (
                            <img
                              src={stock.logo}
                              alt=""
                              className="w-4 h-4 rounded bg-white/20 object-contain"
                              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                            />
                          )}
                          <span className="text-[10px] font-bold truncate">
                            {stock.symbol}
                          </span>
                        </div>
                      )}
                      {stock.height > 40 && (
                        <span className="text-[10px] font-bold">
                          {stock.change >= 0 ? "+" : ""}{stock.change.toFixed(2)}%
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            ))
          ) : (
            // Simple stock view
            stockLayout.map((stock) => (
              <Link
                key={stock.symbol}
                to={`/stock/${stock.symbol}`}
                className="absolute transition-all duration-150 hover:brightness-125 hover:z-20"
                style={{
                  left: `${stock.x}px`,
                  top: `${stock.y}px`,
                  width: `${stock.width}px`,
                  height: `${stock.height}px`,
                  backgroundColor: getColor(stock.change),
                  border: hoveredStock?.symbol === stock.symbol ? "2px solid white" : "none",
                  borderRadius: "6px",
                }}
                onMouseMove={(e) => handleMouseMove(e, stock)}
                onMouseLeave={() => setHoveredStock(null)}
              >
                <div className="p-1.5 h-full flex flex-col justify-between text-white">
                  <div className="flex items-center gap-1.5">
                    {stock.logo && stock.width > 70 && (
                      <img
                        src={stock.logo}
                        alt=""
                        className="w-5 h-5 rounded bg-white/20 object-contain"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                      />
                    )}
                    <span className="text-xs font-bold truncate">
                      {stock.symbol}
                    </span>
                  </div>
                  {stock.width > 80 && stock.height > 50 && (
                    <span className="text-[10px] truncate opacity-80">
                      {stock.name}
                    </span>
                  )}
                  <div className="flex items-center gap-1">
                    {stock.change >= 0 ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    <span className="text-xs font-bold">
                      {stock.change >= 0 ? "+" : ""}{stock.change.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      )}

      {/* Legend */}
      <div className="p-3 border-t border-border flex items-center justify-center gap-4 text-xs flex-wrap">
        <span className="text-muted-foreground">التغير:</span>
        {[
          { color: "#b91c1c", label: "-5%" },
          { color: "#ef4444", label: "-2%" },
          { color: "#4b5563", label: "0%" },
          { color: "#10b981", label: "+2%" },
          { color: "#047857", label: "+5%" },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1">
            <div className="w-4 h-3 rounded" style={{ backgroundColor: color }} />
            <span className="text-muted-foreground">{label}</span>
          </div>
        ))}
      </div>
    </>
  );

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className={`bg-card rounded-2xl border border-border overflow-hidden ${
          isExpanded ? "fixed inset-4 z-50" : ""
        }`}
      >
        {heatmapContent}
      </motion.div>

      {/* Tooltip */}
      <AnimatePresence>
        {hoveredStock && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed z-[100] bg-card border border-border rounded-xl shadow-xl p-3 pointer-events-none"
            style={{
              left: tooltipPos.x + 15,
              top: tooltipPos.y + 15,
              maxWidth: "280px",
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              {hoveredStock.logo && (
                <img
                  src={hoveredStock.logo}
                  alt=""
                  className="w-8 h-8 rounded-lg bg-white/10 object-contain"
                />
              )}
              <div>
                <p className="font-bold text-foreground">{hoveredStock.symbol}</p>
                <p className="text-xs text-muted-foreground">{hoveredStock.name}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <p className="text-muted-foreground">السعر</p>
                <p className="font-bold text-foreground">
                  {hoveredStock.price.toLocaleString("ar-MA")} MAD
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">التغير</p>
                <p className={`font-bold ${hoveredStock.change >= 0 ? "text-success" : "text-destructive"}`}>
                  {hoveredStock.change >= 0 ? "+" : ""}{hoveredStock.change.toFixed(2)}%
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">القطاع</p>
                <p className="font-medium text-foreground">{hoveredStock.sector}</p>
              </div>
              <div>
                <p className="text-muted-foreground">القيمة السوقية</p>
                <p className="font-medium text-foreground">
                  {hoveredStock.marketCap >= 1000 
                    ? `${(hoveredStock.marketCap / 1000).toFixed(1)}B` 
                    : `${hoveredStock.marketCap}M`
                  }
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop for expanded mode */}
      {isExpanded && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
          onClick={() => setIsExpanded(false)}
        />
      )}
    </>
  );
};

export default ProHeatmap;
