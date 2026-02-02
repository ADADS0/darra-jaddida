import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Maximize2, 
  Minimize2, 
  RefreshCw, 
  X,
  Camera,
  ChevronDown,
  ChevronRight
} from "lucide-react";
import { useStockData, type Stock } from "@/hooks/useStockData";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";

type SizeBy = "marketCap" | "volume1D" | "volume1W" | "volume1M" | "mono";
type ColorBy = "change1h" | "change4h" | "changeD" | "perfW" | "perfM" | "perf3M" | "perf6M" | "perfYTD" | "perfY";
type GroupBy = "none" | "sector";

interface LayoutItem extends Stock {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface SectorGroup {
  name: string;
  nameEn: string;
  change: number;
  stocks: LayoutItem[];
  x: number;
  y: number;
  width: number;
  height: number;
  totalMarketCap: number;
}

const sizeByOptions: { value: SizeBy; label: string }[] = [
  { value: "marketCap", label: "Market cap" },
  { value: "volume1D", label: "Volume 1D" },
  { value: "volume1W", label: "Volume 1W" },
  { value: "volume1M", label: "Volume 1M" },
  { value: "mono", label: "Mono size" },
];

const colorByOptions: { value: ColorBy; label: string; group?: string }[] = [
  { value: "change1h", label: "Change 1h, %" },
  { value: "change4h", label: "Change 4h, %" },
  { value: "changeD", label: "Change D, %" },
  { value: "perfW", label: "Performance W, %", group: "performance" },
  { value: "perfM", label: "Performance M, %", group: "performance" },
  { value: "perf3M", label: "Performance 3M, %", group: "performance" },
  { value: "perf6M", label: "Performance 6M, %", group: "performance" },
  { value: "perfYTD", label: "Performance YTD, %", group: "performance" },
  { value: "perfY", label: "Performance Y, %", group: "performance" },
];

const groupByOptions: { value: GroupBy; label: string }[] = [
  { value: "none", label: "No group" },
  { value: "sector", label: "Sector" },
];

const TradingViewHeatmap = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [sizeBy, setSizeBy] = useState<SizeBy>("marketCap");
  const [colorBy, setColorBy] = useState<ColorBy>("change1h");
  const [groupBy, setGroupBy] = useState<GroupBy>("sector");
  const [hoveredStock, setHoveredStock] = useState<Stock | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, error, refetch, isRefetching } = useStockData();

  const stocks = data?.stocks || [];

  // Get size value for stock
  const getSizeValue = useCallback((stock: Stock): number => {
    if (sizeBy === "mono") return 1;
    return stock.marketCap;
  }, [sizeBy]);

  // Squarified treemap algorithm
  const calculateTreemapLayout = useCallback((
    items: { id: string; size: number }[],
    x: number,
    y: number,
    width: number,
    height: number,
    padding: number = 1
  ): { id: string; x: number; y: number; width: number; height: number }[] => {
    if (items.length === 0) return [];
    if (items.length === 1) {
      return [{
        id: items[0].id,
        x: x + padding,
        y: y + padding,
        width: Math.max(width - padding * 2, 30),
        height: Math.max(height - padding * 2, 30),
      }];
    }

    const total = items.reduce((acc, item) => acc + item.size, 0);
    const isHorizontal = width >= height;
    
    let accumulated = 0;
    let splitIndex = 0;
    const halfTotal = total / 2;
    
    for (let i = 0; i < items.length; i++) {
      accumulated += items[i].size;
      if (accumulated >= halfTotal) {
        splitIndex = i;
        break;
      }
    }
    
    if (splitIndex === 0) splitIndex = 1;
    
    const firstHalf = items.slice(0, splitIndex);
    const secondHalf = items.slice(splitIndex);
    
    const firstTotal = firstHalf.reduce((acc, item) => acc + item.size, 0);
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

  // Group stocks by sector
  const getSectorGroups = useCallback(() => {
    const sortedStocks = [...stocks].sort((a, b) => getSizeValue(b) - getSizeValue(a));
    const sectorMap = new Map<string, Stock[]>();
    
    sortedStocks.forEach(stock => {
      const existing = sectorMap.get(stock.sector) || [];
      existing.push(stock);
      sectorMap.set(stock.sector, existing);
    });
    
    return Array.from(sectorMap.entries())
      .map(([name, sectorStocks]) => ({
        name,
        nameEn: sectorStocks[0]?.sectorEn || name,
        stocks: sectorStocks,
        totalSize: sectorStocks.reduce((acc, s) => acc + getSizeValue(s), 0),
        totalMarketCap: sectorStocks.reduce((acc, s) => acc + s.marketCap, 0),
        change: sectorStocks.reduce((acc, s) => acc + s.change, 0) / sectorStocks.length,
      }))
      .sort((a, b) => b.totalSize - a.totalSize);
  }, [stocks, getSizeValue]);

  // Calculate layout with sector grouping
  const calculateSectorLayout = useCallback((): SectorGroup[] => {
    if (!containerRef.current || stocks.length === 0) return [];

    const container = containerRef.current.getBoundingClientRect();
    const width = container.width;
    const height = container.height;
    const sectorGroups = getSectorGroups();

    const sectorItems = sectorGroups.map(s => ({
      id: s.name,
      size: s.totalSize,
    }));

    const sectorRects = calculateTreemapLayout(sectorItems, 0, 0, width, height, 1);

    return sectorGroups.map((sector) => {
      const rect = sectorRects.find(r => r.id === sector.name);
      if (!rect) return null;

      const stockItems = sector.stocks.map(s => ({
        id: s.symbol,
        size: getSizeValue(s),
      }));

      const headerHeight = 18;
      const stockRects = calculateTreemapLayout(
        stockItems,
        rect.x + 1,
        rect.y + headerHeight,
        rect.width - 2,
        rect.height - headerHeight - 1,
        1
      );

      const stocksWithLayout: LayoutItem[] = sector.stocks.map(stock => {
        const stockRect = stockRects.find(r => r.id === stock.symbol);
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
        totalMarketCap: sector.totalMarketCap,
      };
    }).filter(Boolean) as SectorGroup[];
  }, [stocks, getSectorGroups, calculateTreemapLayout, getSizeValue]);

  // Calculate simple stock layout (no sector grouping)
  const calculateStockLayout = useCallback((): LayoutItem[] => {
    if (!containerRef.current || stocks.length === 0) return [];

    const container = containerRef.current.getBoundingClientRect();
    const width = container.width;
    const height = container.height;

    const sortedStocks = [...stocks].sort((a, b) => getSizeValue(b) - getSizeValue(a));
    const stockItems = sortedStocks.map(s => ({
      id: s.symbol,
      size: getSizeValue(s),
    }));

    const rects = calculateTreemapLayout(stockItems, 0, 0, width, height, 1);

    return sortedStocks.map(stock => {
      const rect = rects.find(r => r.id === stock.symbol);
      return {
        ...stock,
        x: rect?.x || 0,
        y: rect?.y || 0,
        width: rect?.width || 0,
        height: rect?.height || 0,
      };
    });
  }, [stocks, calculateTreemapLayout, getSizeValue]);

  const [sectorLayout, setSectorLayout] = useState<SectorGroup[]>([]);
  const [stockLayout, setStockLayout] = useState<LayoutItem[]>([]);

  useEffect(() => {
    const updateLayout = () => {
      if (groupBy === "sector") {
        setSectorLayout(calculateSectorLayout());
      } else {
        setStockLayout(calculateStockLayout());
      }
    };

    const timer = setTimeout(updateLayout, 50);
    window.addEventListener("resize", updateLayout);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updateLayout);
    };
  }, [groupBy, calculateSectorLayout, calculateStockLayout, isExpanded, stocks, sizeBy]);

  // Get color based on change percentage - TradingView style colors
  const getColor = (change: number): string => {
    if (change >= 3.5) return "#00695c";
    if (change >= 2.5) return "#00897b";
    if (change >= 1.5) return "#26a69a";
    if (change >= 0.5) return "#4db6ac";
    if (change > 0) return "#80cbc4";
    if (change === 0) return "#616161";
    if (change > -0.5) return "#ef9a9a";
    if (change > -1.5) return "#e57373";
    if (change > -2.5) return "#ef5350";
    if (change > -3.5) return "#f44336";
    return "#c62828";
  };

  const handleMouseMove = (e: React.MouseEvent, stock: Stock) => {
    setHoveredStock(stock);
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      setTooltipPos({ 
        x: e.clientX - rect.left, 
        y: e.clientY - rect.top 
      });
    }
  };

  const formatMarketCap = (value: number): string => {
    if (value >= 1e9) return `${(value / 1e9).toFixed(1)} B`;
    if (value >= 1e6) return `${(value / 1e6).toFixed(1)} M`;
    return value.toLocaleString();
  };

  if (error) {
    return (
      <div className="bg-destructive/10 border border-destructive rounded-xl p-6 text-center">
        <p className="text-destructive">خطأ في تحميل البيانات</p>
        <button onClick={() => refetch()} className="mt-4 px-4 py-2 bg-destructive text-destructive-foreground rounded-lg">
          إعادة المحاولة
        </button>
      </div>
    );
  }

  const renderStockCell = (stock: LayoutItem, offsetX: number = 0, offsetY: number = 0) => {
    const cellX = stock.x - offsetX;
    const cellY = stock.y - offsetY;
    const isLarge = stock.width > 80 && stock.height > 60;
    const isMedium = stock.width > 50 && stock.height > 45;
    const showLogo = stock.width > 70 && stock.height > 55;

    return (
      <Link
        key={stock.symbol}
        to={`/stock/${stock.symbol}`}
        className="absolute transition-all duration-100 hover:brightness-110 hover:z-30"
        style={{
          left: `${cellX}px`,
          top: `${cellY}px`,
          width: `${stock.width}px`,
          height: `${stock.height}px`,
          backgroundColor: getColor(stock.change),
          border: hoveredStock?.symbol === stock.symbol ? "2px solid white" : "1px solid rgba(0,0,0,0.15)",
          borderRadius: "3px",
        }}
        onMouseMove={(e) => handleMouseMove(e, stock)}
        onMouseLeave={() => setHoveredStock(null)}
      >
        <div className="h-full flex flex-col items-center justify-center p-1 text-white text-center overflow-hidden">
          {/* Logo */}
          {showLogo && (
            <div className="w-8 h-8 mb-1 flex items-center justify-center">
              {stock.logo ? (
                <img
                  src={stock.logo}
                  alt=""
                  className="w-7 h-7 rounded-full bg-white/90 object-contain p-0.5"
                  onError={(e) => { 
                    (e.target as HTMLImageElement).style.display = "none"; 
                  }}
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">
                  {stock.symbol.charAt(0)}
                </div>
              )}
            </div>
          )}
          
          {/* Symbol */}
          <span className={`font-bold ${isLarge ? "text-sm" : isMedium ? "text-xs" : "text-[10px]"} leading-tight`}>
            {stock.symbol}
          </span>
          
          {/* Change */}
          {isMedium && (
            <span className={`font-semibold ${isLarge ? "text-sm" : "text-[11px]"} leading-tight mt-0.5`}>
              {stock.change >= 0 ? "+" : ""}{stock.change.toFixed(2)}%
            </span>
          )}
        </div>
      </Link>
    );
  };

  const heatmapContent = (
    <div className={`bg-[#1e222d] rounded-lg overflow-hidden ${isExpanded ? "h-full" : ""}`}>
      {/* Header Toolbar */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border/30 bg-[#1e222d]">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold text-white">Stock Heatmap</h3>
          
          {/* All Moroccan companies badge */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2a2e39] border border-border/30">
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            <span className="text-xs text-white font-medium">All Moroccan companies</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Size By Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#2a2e39] hover:bg-[#363a45] text-white text-xs font-medium transition-colors">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 21H4.6c-.56 0-.84 0-1.054-.109a1 1 0 01-.437-.437C3 20.24 3 19.96 3 19.4V3" />
                <path d="M7 14l4-4 4 4 6-6" />
              </svg>
              {sizeByOptions.find(o => o.value === sizeBy)?.label}
              <ChevronDown className="w-3 h-3 opacity-60" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-[#1e222d] border-border/50 min-w-[180px]">
              <DropdownMenuLabel className="text-xs text-muted-foreground">SIZE BY</DropdownMenuLabel>
              {sizeByOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => setSizeBy(option.value)}
                  className={`text-white hover:bg-[#2a2e39] cursor-pointer ${sizeBy === option.value ? "bg-primary/20" : ""}`}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Color By Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#2a2e39] hover:bg-[#363a45] text-white text-xs font-medium transition-colors">
              <div className="flex gap-0.5">
                <div className="w-1.5 h-3 bg-red-500 rounded-sm"></div>
                <div className="w-1.5 h-3 bg-emerald-500 rounded-sm"></div>
              </div>
              {colorByOptions.find(o => o.value === colorBy)?.label}
              <ChevronDown className="w-3 h-3 opacity-60" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-[#1e222d] border-border/50 min-w-[200px]">
              <DropdownMenuLabel className="text-xs text-muted-foreground">COLOR BY</DropdownMenuLabel>
              {colorByOptions.filter(o => !o.group).map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => setColorBy(option.value)}
                  className={`text-white hover:bg-[#2a2e39] cursor-pointer ${colorBy === option.value ? "bg-primary/20" : ""}`}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator className="bg-border/30" />
              {colorByOptions.filter(o => o.group === "performance").map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => setColorBy(option.value)}
                  className={`text-white hover:bg-[#2a2e39] cursor-pointer ${colorBy === option.value ? "bg-primary/20" : ""}`}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Group By Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#2a2e39] hover:bg-[#363a45] text-white text-xs font-medium transition-colors">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
                <path d="M2 12h20" />
              </svg>
              {groupByOptions.find(o => o.value === groupBy)?.label}
              <ChevronDown className="w-3 h-3 opacity-60" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-[#1e222d] border-border/50 min-w-[140px]">
              <DropdownMenuLabel className="text-xs text-muted-foreground">GROUP BY</DropdownMenuLabel>
              {groupByOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => setGroupBy(option.value)}
                  className={`text-white hover:bg-[#2a2e39] cursor-pointer ${groupBy === option.value ? "bg-primary/20" : ""}`}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Action Buttons */}
          <div className="flex items-center gap-1 ml-2">
            <button className="p-1.5 rounded hover:bg-[#2a2e39] text-muted-foreground hover:text-white transition-colors">
              <Camera className="w-4 h-4" />
            </button>
            <button
              onClick={() => refetch()}
              disabled={isRefetching}
              className="p-1.5 rounded hover:bg-[#2a2e39] text-muted-foreground hover:text-white transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isRefetching ? "animate-spin" : ""}`} />
            </button>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 rounded hover:bg-[#2a2e39] text-muted-foreground hover:text-white transition-colors"
            >
              {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Heatmap Container */}
      {isLoading ? (
        <div className="h-[550px] p-2 grid grid-cols-5 gap-1 bg-[#131722]">
          {Array.from({ length: 20 }).map((_, i) => (
            <Skeleton key={i} className="rounded bg-[#2a2e39]" />
          ))}
        </div>
      ) : (
        <div
          ref={containerRef}
          className={`relative w-full bg-[#131722] ${isExpanded ? "h-[calc(100vh-100px)]" : "h-[550px]"}`}
        >
          {groupBy === "sector" ? (
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
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "2px",
                  overflow: "hidden",
                }}
              >
                {/* Sector Header */}
                <div 
                  className="flex items-center justify-between px-2 h-[17px] text-[11px] font-medium text-white/90 bg-[#1e222d] border-b border-white/10"
                >
                  <div className="flex items-center gap-1">
                    <span className="truncate">{sector.nameEn}</span>
                    <ChevronRight className="w-3 h-3 opacity-50" />
                  </div>
                </div>

                {/* Stocks within sector */}
                {sector.stocks.map((stock) => renderStockCell(stock, sector.x, sector.y))}
              </div>
            ))
          ) : (
            // Simple stock view (no grouping)
            stockLayout.map((stock) => renderStockCell(stock))
          )}

          {/* Tooltip */}
          <AnimatePresence>
            {hoveredStock && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute z-50 pointer-events-none bg-[#1e222d] border border-border/50 rounded-lg shadow-xl p-3 min-w-[200px]"
                style={{
                  left: tooltipPos.x + 15,
                  top: tooltipPos.y - 10,
                  transform: tooltipPos.x > (containerRef.current?.clientWidth || 0) / 2 ? "translateX(-110%)" : "none",
                }}
              >
                <div className="flex items-center gap-3 mb-2">
                  {hoveredStock.logo && (
                    <img src={hoveredStock.logo} alt="" className="w-8 h-8 rounded-full bg-white p-0.5" />
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{hoveredStock.symbol}</span>
                      <span className={`text-xs font-bold ${hoveredStock.change >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                        {hoveredStock.change >= 0 ? "▲" : "▼"} {hoveredStock.change >= 0 ? "+" : ""}{hoveredStock.change.toFixed(2)}%
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">{hoveredStock.name}</div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 pt-2 border-t border-border/30">
                  <div>
                    <div className="text-[10px] text-muted-foreground uppercase">Price</div>
                    <div className="text-sm font-semibold text-white">{hoveredStock.price.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-muted-foreground uppercase">Market Cap</div>
                    <div className="text-sm font-semibold text-white">{formatMarketCap(hoveredStock.marketCap * 1e6)}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-muted-foreground uppercase">Change 1h, %</div>
                    <div className={`text-sm font-semibold ${hoveredStock.change >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                      {hoveredStock.change >= 0 ? "+" : ""}{hoveredStock.change.toFixed(2)}%
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center justify-center gap-1 py-2 bg-[#1e222d] border-t border-border/30">
        {[
          { color: "#c62828", label: "-5.5%" },
          { color: "#f44336", label: "-3.5%" },
          { color: "#e57373", label: "-1.5%" },
          { color: "#616161", label: "0%" },
          { color: "#80cbc4", label: "1.5%" },
          { color: "#26a69a", label: "3.5%" },
          { color: "#00695c", label: "5.5%" },
        ].map(({ color, label }, i) => (
          <div key={i} className="flex items-center">
            <div className="w-8 h-3" style={{ backgroundColor: color }} />
            {i === 0 || i === 3 || i === 6 ? (
              <span className="text-[10px] text-muted-foreground ml-1">{label}</span>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );

  if (isExpanded) {
    return (
      <div className="fixed inset-0 z-50 bg-[#131722] p-4">
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-end mb-2">
            <button
              onClick={() => setIsExpanded(false)}
              className="p-2 rounded-lg bg-[#2a2e39] text-white hover:bg-[#363a45] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          {heatmapContent}
        </div>
      </div>
    );
  }

  return heatmapContent;
};

export default TradingViewHeatmap;
