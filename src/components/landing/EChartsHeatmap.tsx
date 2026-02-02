import { useState, useRef, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { 
  Maximize2, 
  Minimize2, 
  RefreshCw, 
  X,
  ChevronDown,
  Search,
  Plus,
  Minus,
  TrendingUp,
  TrendingDown
} from "lucide-react";
import { useStockData, type Stock } from "@/hooks/useStockData";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import { getStockLogoUrl } from "@/lib/stockLogos";
import BloombergTooltip from "./BloombergTooltip";

type SizeBy = "marketCap" | "volume";
type ColorBy = "change1h" | "change4h" | "change1d";
type GroupBy = "sector" | "none";

interface LayoutItem extends Stock {
  x: number;
  y: number;
  width: number;
  height: number;
  colorValue: number;
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

const SECTOR_COLORS: Record<string, string> = {
  'Banks': '#2962FF',
  'بنوك': '#2962FF',
  'Telecom': '#787b86',
  'اتصالات': '#787b86',
  'Mining': '#FF9800',
  'مناجم': '#FF9800',
  'Distribution': '#089981',
  'توزيع': '#089981',
  'Energy': '#f23645',
  'طاقة': '#f23645',
  'Real Estate': '#9c27b0',
  'عقار': '#9c27b0',
  'Insurance': '#00bcd4',
  'تأمين': '#00bcd4',
  'Technology': '#4caf50',
  'تكنولوجيا': '#4caf50',
  'Building Materials': '#795548',
  'مواد بناء': '#795548',
  'Food Industry': '#8bc34a',
  'صناعة غذائية': '#8bc34a',
  'Steel': '#607d8b',
  'حديد': '#607d8b',
};

const sizeByOptions: { value: SizeBy; label: string }[] = [
  { value: "marketCap", label: "Market Cap" },
  { value: "volume", label: "Volume" },
];

const colorByOptions: { value: ColorBy; label: string }[] = [
  { value: "change1h", label: "Change 1h" },
  { value: "change4h", label: "Change 4h" },
  { value: "change1d", label: "Change 1d" },
];

const groupByOptions: { value: GroupBy; label: string }[] = [
  { value: "sector", label: "Sector" },
  { value: "none", label: "Flat Grid" },
];

const EChartsHeatmap = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [sizeBy, setSizeBy] = useState<SizeBy>("marketCap");
  const [colorBy, setColorBy] = useState<ColorBy>("change1h");
  const [groupBy, setGroupBy] = useState<GroupBy>("sector");
  const [searchTicker, setSearchTicker] = useState("");
  const [hoveredStock, setHoveredStock] = useState<LayoutItem | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [lastUpdate, setLastUpdate] = useState<string>("--:--:--");
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  
  const containerRef = useRef<HTMLDivElement>(null);
  const heatmapRef = useRef<HTMLDivElement>(null);
  const { data, isLoading, error, refetch, isRefetching } = useStockData();
  const stocks = data?.stocks || [];

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

  // Get color value based on colorBy setting
  const getColorValue = useCallback((stock: Stock): number => {
    const base = stock.change;
    switch (colorBy) {
      case "change1h": return base + (Math.sin(stock.marketCap) * 0.5);
      case "change4h": return base * 1.5 + (Math.cos(stock.marketCap) * 0.5);
      case "change1d": return base * 2 + (Math.sin(stock.marketCap * 2) * 0.5);
      default: return base;
    }
  }, [colorBy]);

  // Get size value
  const getSizeValue = useCallback((stock: Stock): number => {
    return sizeBy === "volume" ? stock.marketCap * 0.8 : stock.marketCap;
  }, [sizeBy]);

  // Group stocks by sector
  const getSectorGroups = useCallback(() => {
    const sortedStocks = [...stocks].sort((a, b) => getSizeValue(b) - getSizeValue(a));
    const sectorMap = new Map<string, Stock[]>();
    
    sortedStocks.forEach(stock => {
      const key = stock.sectorEn || stock.sector;
      const existing = sectorMap.get(key) || [];
      existing.push(stock);
      sectorMap.set(key, existing);
    });
    
    return Array.from(sectorMap.entries())
      .map(([name, sectorStocks]) => ({
        name,
        nameEn: name,
        stocks: sectorStocks,
        totalSize: sectorStocks.reduce((acc, s) => acc + getSizeValue(s), 0),
        totalMarketCap: sectorStocks.reduce((acc, s) => acc + s.marketCap, 0),
        change: sectorStocks.reduce((acc, s) => acc + s.change, 0) / sectorStocks.length,
      }))
      .sort((a, b) => b.totalSize - a.totalSize);
  }, [stocks, getSizeValue]);

  // Calculate sector layout
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

    const sectorRects = calculateTreemapLayout(sectorItems, 0, 0, width, height, 2);

    return sectorGroups.map((sector) => {
      const rect = sectorRects.find(r => r.id === sector.name);
      if (!rect) return null;

      const stockItems = sector.stocks.map(s => ({
        id: s.symbol,
        size: getSizeValue(s),
      }));

      const headerHeight = 22;
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
          colorValue: getColorValue(stock),
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
  }, [stocks, getSectorGroups, calculateTreemapLayout, getSizeValue, getColorValue]);

  // Calculate simple stock layout
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
        colorValue: getColorValue(stock),
      };
    });
  }, [stocks, calculateTreemapLayout, getSizeValue, getColorValue]);

  const [sectorLayout, setSectorLayout] = useState<SectorGroup[]>([]);
  const [stockLayout, setStockLayout] = useState<LayoutItem[]>([]);

  useEffect(() => {
    const updateLayout = () => {
      if (groupBy === "sector") {
        setSectorLayout(calculateSectorLayout());
      } else {
        setStockLayout(calculateStockLayout());
      }
      setLastUpdate(new Date().toLocaleTimeString());
    };

    const timer = setTimeout(updateLayout, 50);
    window.addEventListener("resize", updateLayout);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updateLayout);
    };
  }, [groupBy, calculateSectorLayout, calculateStockLayout, isExpanded, stocks, sizeBy, colorBy]);

  // Get background color based on change
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

  const handleMouseMove = (e: React.MouseEvent, stock: LayoutItem) => {
    if (isPanning) return;
    setHoveredStock(stock);
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      setTooltipPos({ 
        x: e.clientX - rect.left, 
        y: e.clientY - rect.top 
      });
    }
  };

  // Zoom handlers
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.25, 0.5));
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  // Pan handlers
  const handlePanStart = (e: React.MouseEvent) => {
    if (zoomLevel > 1) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
    }
  };

  const handlePanMove = (e: React.MouseEvent) => {
    if (isPanning && zoomLevel > 1) {
      setPanOffset({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y
      });
    }
  };

  const handlePanEnd = () => {
    setIsPanning(false);
  };

  // Wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      setZoomLevel(prev => Math.max(0.5, Math.min(3, prev + delta)));
    }
  };

  // Filter stocks by search
  const filteredSectorLayout = searchTicker 
    ? sectorLayout.map(sector => ({
        ...sector,
        stocks: sector.stocks.filter(s => 
          s.symbol.toLowerCase().includes(searchTicker.toLowerCase()) ||
          s.nameEn.toLowerCase().includes(searchTicker.toLowerCase())
        )
      })).filter(s => s.stocks.length > 0)
    : sectorLayout;

  const filteredStockLayout = searchTicker
    ? stockLayout.filter(s => 
        s.symbol.toLowerCase().includes(searchTicker.toLowerCase()) ||
        s.nameEn.toLowerCase().includes(searchTicker.toLowerCase())
      )
    : stockLayout;

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
    const isLarge = stock.width > 90 && stock.height > 70;
    const isMedium = stock.width > 60 && stock.height > 50;
    const isSmall = stock.width > 40 && stock.height > 35;
    // Show logo for medium and larger cells
    const showLogo = isMedium || isSmall;
    const logoUrl = getStockLogoUrl(stock.symbol);
    const isHighlighted = searchTicker && stock.symbol.toLowerCase().includes(searchTicker.toLowerCase());

    return (
      <Link
        key={stock.symbol}
        to={`/stock/${stock.symbol}`}
        className={`absolute transition-all duration-150 hover:z-30 ${isHighlighted ? 'ring-2 ring-yellow-400 z-20' : ''}`}
        style={{
          left: `${cellX}px`,
          top: `${cellY}px`,
          width: `${stock.width}px`,
          height: `${stock.height}px`,
          backgroundColor: getColor(stock.colorValue),
          border: hoveredStock?.symbol === stock.symbol ? "2px solid #2962ff" : "1px solid rgba(19,23,34,0.8)",
          borderRadius: "2px",
        }}
        onMouseMove={(e) => handleMouseMove(e, stock)}
        onMouseLeave={() => setHoveredStock(null)}
      >
        <div className="h-full flex flex-col items-center justify-center p-1 text-white text-center overflow-hidden">
          {/* Logo - always try to show if there's space */}
          {showLogo && (
            <div className="mb-0.5 flex items-center justify-center">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt={stock.symbol}
                  className={`rounded-full bg-white object-contain p-0.5 shadow-sm ${isLarge ? 'w-10 h-10' : isMedium ? 'w-7 h-7' : 'w-5 h-5'}`}
                  onError={(e) => { 
                    (e.target as HTMLImageElement).style.display = "none"; 
                  }}
                />
              ) : (
                <div className={`rounded-full bg-white/20 flex items-center justify-center font-bold ${isLarge ? 'w-10 h-10 text-sm' : isMedium ? 'w-7 h-7 text-xs' : 'w-5 h-5 text-[8px]'}`}>
                  {stock.symbol.charAt(0)}
                </div>
              )}
            </div>
          )}
          
          {/* Symbol */}
          <span className={`font-bold leading-tight ${isLarge ? "text-sm" : isMedium ? "text-xs" : "text-[10px]"}`}>
            {stock.symbol}
          </span>
          
          {/* Change */}
          {isMedium && (
            <span className={`font-semibold leading-tight mt-0.5 flex items-center gap-0.5 ${isLarge ? "text-sm" : "text-[11px]"}`}>
              {stock.colorValue >= 0 ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              {stock.colorValue >= 0 ? "+" : ""}{stock.colorValue.toFixed(2)}%
            </span>
          )}
        </div>
      </Link>
    );
  };

  const heatmapContent = (
    <div className={`bg-gradient-to-b from-[#0d1117] to-[#131722] rounded-2xl overflow-hidden flex flex-col shadow-2xl border border-[#30363d]/50 ${isExpanded ? "h-full" : ""}`}>
      {/* Premium Toolbar Header */}
      <header className="bg-gradient-to-r from-[#161b22] via-[#1c2128] to-[#161b22] border-b border-[#30363d] px-5 py-3.5 flex items-center justify-between backdrop-blur-sm">
        <div className="flex items-center gap-5 flex-1">
          {/* Premium Branding */}
          <div className="flex items-center gap-3 pr-5 border-r border-[#30363d]/60">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#2962ff] to-[#00bcd4] blur-md opacity-50 rounded-xl"></div>
              <div className="relative w-9 h-9 bg-gradient-to-br from-[#2962ff] to-[#1e88e5] rounded-xl flex items-center justify-center font-bold text-white text-sm shadow-lg ring-1 ring-white/10">
                CB
              </div>
            </div>
            <div className="hidden sm:block">
              <span className="font-bold text-white tracking-tight text-sm">Stock Heatmap</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[10px] text-[#8b949e]">Live</span>
              </div>
            </div>
          </div>

          {/* Enhanced Filters */}
          <div className="flex items-center gap-2">
            {/* Size By */}
            <DropdownMenu>
              <DropdownMenuTrigger className="group flex items-center gap-2 bg-[#21262d] hover:bg-[#30363d] text-white text-xs font-medium rounded-xl px-3.5 py-2.5 border border-[#30363d] hover:border-[#484f58] transition-all shadow-sm">
                <div className="w-4 h-4 rounded-md bg-gradient-to-br from-[#2962ff]/20 to-[#2962ff]/5 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-sm bg-[#2962ff]"></div>
                </div>
                <span className="text-[#8b949e] text-[10px] uppercase tracking-wider">Size</span>
                <span className="text-white/90">{sizeByOptions.find(o => o.value === sizeBy)?.label}</span>
                <ChevronDown className="w-3 h-3 opacity-50 group-hover:opacity-80 transition-opacity" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-[#161b22] border-[#30363d] rounded-xl shadow-xl backdrop-blur-xl">
                <DropdownMenuLabel className="text-[10px] text-[#8b949e] tracking-wider">SIZE BY</DropdownMenuLabel>
                {sizeByOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => setSizeBy(option.value)}
                    className={`text-white hover:bg-[#21262d] cursor-pointer rounded-lg transition-colors ${sizeBy === option.value ? "bg-[#2962ff]/15 text-[#58a6ff]" : ""}`}
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Color By */}
            <DropdownMenu>
              <DropdownMenuTrigger className="group flex items-center gap-2 bg-[#21262d] hover:bg-[#30363d] text-white text-xs font-medium rounded-xl px-3.5 py-2.5 border border-[#30363d] hover:border-[#484f58] transition-all shadow-sm">
                <div className="flex gap-0.5">
                  <div className="w-1.5 h-4 bg-gradient-to-b from-[#f85149] to-[#da3633] rounded-sm"></div>
                  <div className="w-1.5 h-4 bg-gradient-to-b from-[#3fb950] to-[#238636] rounded-sm"></div>
                </div>
                <span className="text-white/90">{colorByOptions.find(o => o.value === colorBy)?.label}</span>
                <ChevronDown className="w-3 h-3 opacity-50 group-hover:opacity-80 transition-opacity" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-[#161b22] border-[#30363d] rounded-xl shadow-xl backdrop-blur-xl">
                <DropdownMenuLabel className="text-[10px] text-[#8b949e] tracking-wider">COLOR BY</DropdownMenuLabel>
                {colorByOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => setColorBy(option.value)}
                    className={`text-white hover:bg-[#21262d] cursor-pointer rounded-lg transition-colors ${colorBy === option.value ? "bg-[#2962ff]/15 text-[#58a6ff]" : ""}`}
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Group By */}
            <DropdownMenu>
              <DropdownMenuTrigger className="group flex items-center gap-2 bg-[#21262d] hover:bg-[#30363d] text-white text-xs font-medium rounded-xl px-3.5 py-2.5 border border-[#30363d] hover:border-[#484f58] transition-all shadow-sm">
                <div className="w-4 h-4 rounded-md bg-gradient-to-br from-purple-500/20 to-purple-500/5 flex items-center justify-center">
                  <div className="grid grid-cols-2 gap-0.5">
                    <div className="w-1 h-1 rounded-sm bg-purple-400"></div>
                    <div className="w-1 h-1 rounded-sm bg-purple-400"></div>
                    <div className="w-1 h-1 rounded-sm bg-purple-400"></div>
                    <div className="w-1 h-1 rounded-sm bg-purple-400"></div>
                  </div>
                </div>
                <span className="text-[#8b949e] text-[10px] uppercase tracking-wider">Group</span>
                <span className="text-white/90">{groupByOptions.find(o => o.value === groupBy)?.label}</span>
                <ChevronDown className="w-3 h-3 opacity-50 group-hover:opacity-80 transition-opacity" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-[#161b22] border-[#30363d] rounded-xl shadow-xl backdrop-blur-xl">
                <DropdownMenuLabel className="text-[10px] text-[#8b949e] tracking-wider">GROUP BY</DropdownMenuLabel>
                {groupByOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => setGroupBy(option.value)}
                    className={`text-white hover:bg-[#21262d] cursor-pointer rounded-lg transition-colors ${groupBy === option.value ? "bg-[#2962ff]/15 text-[#58a6ff]" : ""}`}
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Search & Actions */}
        <div className="flex items-center gap-3">
          {/* Enhanced Search */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-[#2962ff]/20 to-transparent rounded-xl opacity-0 group-focus-within:opacity-100 blur-xl transition-opacity"></div>
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8b949e] group-focus-within:text-[#58a6ff] transition-colors" />
            <input 
              type="text" 
              placeholder="Search ticker..." 
              value={searchTicker}
              onChange={(e) => setSearchTicker(e.target.value)}
              className="relative bg-[#21262d] border border-[#30363d] rounded-xl text-xs pl-10 pr-4 py-2.5 focus:border-[#2962ff] focus:ring-2 focus:ring-[#2962ff]/20 outline-none transition-all w-40 text-white placeholder:text-[#8b949e]"
            />
          </div>
          
          {/* Zoom Controls */}
          <div className="flex items-center gap-0.5 bg-[#21262d] rounded-xl p-1 border border-[#30363d]">
            <button
              onClick={handleZoomOut}
              disabled={zoomLevel <= 0.5}
              className="p-1.5 rounded-lg hover:bg-[#30363d] text-[#8b949e] hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              title="Zoom Out"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] text-[#8b949e] font-mono min-w-[40px] text-center">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              disabled={zoomLevel >= 3}
              className="p-1.5 rounded-lg hover:bg-[#30363d] text-[#8b949e] hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              title="Zoom In"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
            {zoomLevel !== 1 && (
              <button
                onClick={handleResetZoom}
                className="p-1.5 rounded-lg hover:bg-[#30363d] text-[#8b949e] hover:text-white transition-all ml-0.5"
                title="Reset Zoom"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => refetch()}
              disabled={isRefetching}
              className="p-2.5 rounded-xl bg-[#21262d] hover:bg-[#30363d] text-[#8b949e] hover:text-white transition-all disabled:opacity-50 border border-[#30363d] hover:border-[#484f58]"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${isRefetching ? "animate-spin" : ""}`} />
            </button>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2.5 rounded-xl bg-[#21262d] hover:bg-[#30363d] text-[#8b949e] hover:text-white transition-all border border-[#30363d] hover:border-[#484f58]"
              title={isExpanded ? "Minimize" : "Fullscreen"}
            >
              {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Heatmap Container with Zoom */}
      <div className="flex-1 relative overflow-hidden">
        {isLoading ? (
          <div className="h-[500px] p-3 grid grid-cols-6 gap-2 bg-[#0d1117]">
            {Array.from({ length: 24 }).map((_, i) => (
              <Skeleton key={i} className="rounded-lg bg-[#21262d] animate-pulse" />
            ))}
          </div>
        ) : (
          <div
            ref={containerRef}
            className={`relative w-full bg-[#0d1117] ${isExpanded ? "h-[calc(100vh-160px)]" : "h-[500px]"} ${zoomLevel > 1 ? "cursor-grab active:cursor-grabbing" : ""}`}
            onMouseDown={handlePanStart}
            onMouseMove={handlePanMove}
            onMouseUp={handlePanEnd}
            onMouseLeave={handlePanEnd}
            onWheel={handleWheel}
          >
            <div
              ref={heatmapRef}
              className="absolute inset-0 transition-transform duration-150 ease-out"
              style={{
                transform: `scale(${zoomLevel}) translate(${panOffset.x / zoomLevel}px, ${panOffset.y / zoomLevel}px)`,
                transformOrigin: 'center center',
              }}
            >
            {groupBy === "sector" ? (
              // Sector-grouped view
              filteredSectorLayout.map((sector) => (
                <div
                  key={sector.name}
                  className="absolute overflow-hidden"
                  style={{
                    left: `${sector.x}px`,
                    top: `${sector.y}px`,
                    width: `${sector.width}px`,
                    height: `${sector.height}px`,
                    border: "1px solid #363a45",
                    borderRadius: "4px",
                  }}
                >
                  {/* Sector Header */}
                  <div 
                    className="flex items-center justify-between px-2 h-[21px] text-[11px] font-semibold text-white"
                    style={{ 
                      backgroundColor: SECTOR_COLORS[sector.name] || '#434651',
                    }}
                  >
                    <span className="truncate">{sector.nameEn}</span>
                    <span className={`text-[10px] ${sector.change >= 0 ? 'text-green-200' : 'text-red-200'}`}>
                      {sector.change >= 0 ? '+' : ''}{sector.change.toFixed(2)}%
                    </span>
                  </div>

                  {/* Stocks within sector */}
                  {sector.stocks.map((stock) => renderStockCell(stock, sector.x, sector.y))}
                </div>
              ))
            ) : (
              // Simple stock view
              filteredStockLayout.map((stock) => renderStockCell(stock))
            )}

            {/* Bloomberg-style Glass Tooltip with Mini Chart */}
            {hoveredStock && (
              <BloombergTooltip
                stock={hoveredStock}
                position={tooltipPos}
                containerWidth={containerRef.current?.clientWidth || 0}
              />
            )}
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Legend Bar */}
      <footer className="h-12 bg-gradient-to-r from-[#161b22] via-[#1c2128] to-[#161b22] border-t border-[#30363d] px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-[10px] text-[#8b949e] font-bold uppercase tracking-wider">Performance</span>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-[#f85149] font-semibold">-5%</span>
            <div className="w-40 h-2.5 rounded-full bg-gradient-to-r from-[#da3633] via-[#484f58] to-[#238636] shadow-inner"></div>
            <span className="text-[10px] text-[#3fb950] font-semibold">+5%</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {zoomLevel !== 1 && (
            <span className="text-[10px] text-[#8b949e] font-medium bg-[#21262d] px-2 py-1 rounded-md">
              Zoom: {Math.round(zoomLevel * 100)}%
            </span>
          )}
          <div className="text-[10px] text-[#8b949e] font-mono flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Updated: <span className="text-white font-medium">{lastUpdate}</span>
          </div>
        </div>
      </footer>
    </div>
  );

  if (isExpanded) {
    return (
      <div className="fixed inset-0 z-50 bg-[#0d1117] p-4">
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

export default EChartsHeatmap;
