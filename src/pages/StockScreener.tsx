import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, Download, BookmarkPlus } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/landing/Footer";
import ScreenerFilters from "@/components/screener/ScreenerFilters";
import ScreenerResults from "@/components/screener/ScreenerResults";
import ScreenerPresets from "@/components/screener/ScreenerPresets";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Mock data - would come from API
const mockStocks = [
  { symbol: "ATW", name: "اتصالات المغرب", sector: "telecom", price: 118.50, change: 1.25, per: 14.2, pb: 2.8, dividendYield: 5.1, roe: 19.5, liquidityScore: "high" as const, avgVolume: 2500000 },
  { symbol: "BCP", name: "البنك الشعبي المركزي", sector: "banks", price: 285.00, change: -0.35, per: 12.8, pb: 1.4, dividendYield: 3.8, roe: 12.3, liquidityScore: "high" as const, avgVolume: 1800000 },
  { symbol: "BOA", name: "بنك أفريقيا", sector: "banks", price: 195.50, change: 0.78, per: 11.5, pb: 1.2, dividendYield: 4.2, roe: 10.8, liquidityScore: "high" as const, avgVolume: 1200000 },
  { symbol: "CIH", name: "القرض العقاري والسياحي", sector: "banks", price: 385.00, change: 2.15, per: 16.3, pb: 1.8, dividendYield: 3.5, roe: 11.2, liquidityScore: "medium" as const, avgVolume: 850000 },
  { symbol: "CMT", name: "شركة مناجم تويست", sector: "mining", price: 1850.00, change: -1.20, per: 8.5, pb: 2.1, dividendYield: 6.2, roe: 24.5, liquidityScore: "medium" as const, avgVolume: 450000 },
  { symbol: "LBV", name: "مجموعة ليسير", sector: "distribution", price: 2450.00, change: 0.45, per: 18.7, pb: 3.2, dividendYield: 2.8, roe: 17.1, liquidityScore: "medium" as const, avgVolume: 320000 },
  { symbol: "MNG", name: "منجيم", sector: "mining", price: 1420.00, change: 3.25, per: 7.2, pb: 1.9, dividendYield: 7.5, roe: 26.3, liquidityScore: "high" as const, avgVolume: 980000 },
  { symbol: "TQM", name: "طاقة المغرب", sector: "energy", price: 1185.00, change: -0.55, per: 13.4, pb: 2.4, dividendYield: 4.8, roe: 18.2, liquidityScore: "high" as const, avgVolume: 1100000 },
  { symbol: "ADH", name: "أديسيا", sector: "real-estate", price: 52.80, change: -2.10, per: 22.5, pb: 0.8, dividendYield: 0.0, roe: 3.5, liquidityScore: "low" as const, avgVolume: 45000 },
  { symbol: "CSR", name: "كوسمار", sector: "industry", price: 168.50, change: 0.95, per: 9.8, pb: 1.1, dividendYield: 5.8, roe: 11.2, liquidityScore: "low" as const, avgVolume: 65000 },
  { symbol: "WAA", name: "ونا", sector: "insurance", price: 1050.00, change: 1.85, per: 15.2, pb: 2.0, dividendYield: 3.2, roe: 13.5, liquidityScore: "medium" as const, avgVolume: 280000 },
  { symbol: "SAH", name: "سهام للتأمين", sector: "insurance", price: 1380.00, change: 0.22, per: 14.8, pb: 1.7, dividendYield: 3.9, roe: 11.8, liquidityScore: "medium" as const, avgVolume: 195000 },
  { symbol: "JET", name: "جيت كونتراكتورز", sector: "construction", price: 245.00, change: -0.82, per: 11.2, pb: 1.3, dividendYield: 4.5, roe: 11.6, liquidityScore: "low" as const, avgVolume: 78000 },
  { symbol: "SLF", name: "سلفين", sector: "industry", price: 892.00, change: 1.45, per: 10.5, pb: 1.5, dividendYield: 5.2, roe: 14.3, liquidityScore: "medium" as const, avgVolume: 125000 },
  { symbol: "HPS", name: "هايتك بايمنت سيستمز", sector: "telecom", price: 6850.00, change: 2.80, per: 28.5, pb: 8.2, dividendYield: 1.2, roe: 28.8, liquidityScore: "medium" as const, avgVolume: 85000 },
];

const defaultFilters = {
  perMin: 0,
  perMax: 50,
  pbMin: 0,
  pbMax: 5,
  dividendYieldMin: 0,
  roeMin: 0,
  liquidityScore: "all",
  sector: "all",
};

const StockScreener = () => {
  const [filters, setFilters] = useState(defaultFilters);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("symbol");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [activePreset, setActivePreset] = useState<string | null>(null);

  const filteredStocks = useMemo(() => {
    return mockStocks
      .filter((stock) => {
        // Search filter
        if (searchTerm && !stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) &&
            !stock.name.includes(searchTerm)) {
          return false;
        }
        
        // PER filter
        if (stock.per < filters.perMin || stock.per > filters.perMax) return false;
        
        // P/B filter
        if (stock.pb < filters.pbMin || stock.pb > filters.pbMax) return false;
        
        // Dividend yield filter
        if (stock.dividendYield < filters.dividendYieldMin) return false;
        
        // ROE filter
        if (stock.roe < filters.roeMin) return false;
        
        // Liquidity filter
        if (filters.liquidityScore !== "all" && stock.liquidityScore !== filters.liquidityScore) return false;
        
        // Sector filter
        if (filters.sector !== "all" && stock.sector !== filters.sector) return false;
        
        return true;
      })
      .sort((a, b) => {
        const aVal = a[sortBy as keyof typeof a];
        const bVal = b[sortBy as keyof typeof b];
        
        if (typeof aVal === "string" && typeof bVal === "string") {
          return sortDirection === "asc" 
            ? aVal.localeCompare(bVal) 
            : bVal.localeCompare(aVal);
        }
        
        if (typeof aVal === "number" && typeof bVal === "number") {
          return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
        }
        
        return 0;
      });
  }, [filters, searchTerm, sortBy, sortDirection]);

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortDirection("asc");
    }
  };

  const handleApplyPreset = (presetFilters: typeof defaultFilters) => {
    setFilters(presetFilters);
    // Find which preset matches
    const presetId = ["value", "dividend", "quality", "safe", "momentum"].find((id) => {
      const preset = { value: 0, dividend: 1, quality: 2, safe: 3, momentum: 4 }[id];
      return preset !== undefined;
    });
    setActivePreset(presetId || null);
  };

  const handleResetFilters = () => {
    setFilters(defaultFilters);
    setActivePreset(null);
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">ماسح الأسهم</h1>
                <p className="text-muted-foreground">
                  اكتشف فرص الاستثمار حسب معايير التحليل الأساسي
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" className="gap-2">
                  <BookmarkPlus className="w-4 h-4" />
                  حفظ البحث
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <Download className="w-4 h-4" />
                  تصدير
                </Button>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-md">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="ابحث بالرمز أو اسم الشركة..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10 bg-card/50"
              />
            </div>
          </motion.div>

          {/* Presets */}
          <div className="mb-6">
            <p className="text-sm text-muted-foreground mb-3">استراتيجيات جاهزة:</p>
            <ScreenerPresets
              onApplyPreset={handleApplyPreset}
              activePreset={activePreset}
            />
          </div>

          {/* Filters */}
          <div className="mb-8">
            <ScreenerFilters
              filters={filters}
              onFilterChange={setFilters}
              onReset={handleResetFilters}
            />
          </div>

          {/* Results */}
          <ScreenerResults
            stocks={filteredStocks}
            sortBy={sortBy}
            sortDirection={sortDirection}
            onSort={handleSort}
          />

          {/* Disclaimer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-8 p-4 rounded-xl bg-muted/30 border border-border/30"
          >
            <p className="text-xs text-muted-foreground text-center">
              هذه المعلومات لأغراض تعليمية وتحليلية فقط ولا تشكل توصية استثمارية. 
              الأداء التاريخي لا يضمن النتائج المستقبلية. 
              يُنصح باستشارة مستشار مالي مؤهل قبل اتخاذ أي قرار استثماري.
            </p>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default StockScreener;
