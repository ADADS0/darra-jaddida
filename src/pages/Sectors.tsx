import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Building2, 
  TrendingUp, 
  TrendingDown,
  BarChart3,
  Users,
  ArrowLeft,
  Search,
  Filter,
  ChevronDown,
  ExternalLink
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/landing/Footer";
import { useStockData } from "@/hooks/useStockData";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { getStockLogoUrl } from "@/lib/stockLogos";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const SECTOR_ICONS: Record<string, React.ReactNode> = {
  'Banks': <Building2 className="w-5 h-5" />,
  'بنوك': <Building2 className="w-5 h-5" />,
  'Telecom': <BarChart3 className="w-5 h-5" />,
  'اتصالات': <BarChart3 className="w-5 h-5" />,
};

const SECTOR_COLORS: Record<string, string> = {
  'Banks': 'from-[#2962ff] to-[#1e88e5]',
  'بنوك': 'from-[#2962ff] to-[#1e88e5]',
  'Telecom': 'from-[#787b86] to-[#434651]',
  'اتصالات': 'from-[#787b86] to-[#434651]',
  'Mining': 'from-[#FF9800] to-[#e65100]',
  'مناجم': 'from-[#FF9800] to-[#e65100]',
  'Distribution': 'from-[#089981] to-[#00695c]',
  'توزيع': 'from-[#089981] to-[#00695c]',
  'Energy': 'from-[#f23645] to-[#c62828]',
  'طاقة': 'from-[#f23645] to-[#c62828]',
  'Real Estate': 'from-[#9c27b0] to-[#6a1b9a]',
  'عقار': 'from-[#9c27b0] to-[#6a1b9a]',
  'Insurance': 'from-[#00bcd4] to-[#0097a7]',
  'تأمين': 'from-[#00bcd4] to-[#0097a7]',
  'Technology': 'from-[#4caf50] to-[#2e7d32]',
  'تكنولوجيا': 'from-[#4caf50] to-[#2e7d32]',
};

type SortBy = "name" | "price" | "marketCap" | "change";

const Sectors = () => {
  const { data, isLoading } = useStockData();
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("marketCap");

  // Group stocks by sector
  const sectorGroups = useMemo(() => {
    if (!data?.stocks) return [];
    
    const groups = new Map<string, typeof data.stocks>();
    
    data.stocks.forEach(stock => {
      const sectorKey = stock.sectorEn || stock.sector;
      const existing = groups.get(sectorKey) || [];
      existing.push(stock);
      groups.set(sectorKey, existing);
    });

    return Array.from(groups.entries())
      .map(([name, stocks]) => ({
        name,
        nameAr: stocks[0]?.sector || name,
        stocks: stocks.sort((a, b) => b.marketCap - a.marketCap),
        totalMarketCap: stocks.reduce((acc, s) => acc + s.marketCap, 0),
        avgChange: stocks.reduce((acc, s) => acc + s.change, 0) / stocks.length,
        stockCount: stocks.length,
      }))
      .sort((a, b) => b.totalMarketCap - a.totalMarketCap);
  }, [data]);

  // Filter and sort stocks in selected sector
  const filteredStocks = useMemo(() => {
    if (!selectedSector) return [];
    
    const sector = sectorGroups.find(s => s.name === selectedSector);
    if (!sector) return [];

    let filtered = sector.stocks.filter(s =>
      s.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.nameEn.toLowerCase().includes(searchTerm.toLowerCase())
    );

    switch (sortBy) {
      case "name":
        filtered = filtered.sort((a, b) => a.nameEn.localeCompare(b.nameEn));
        break;
      case "price":
        filtered = filtered.sort((a, b) => b.price - a.price);
        break;
      case "change":
        filtered = filtered.sort((a, b) => b.change - a.change);
        break;
      case "marketCap":
      default:
        filtered = filtered.sort((a, b) => b.marketCap - a.marketCap);
    }

    return filtered;
  }, [selectedSector, sectorGroups, searchTerm, sortBy]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0d1117]" dir="rtl">
        <Header />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4">
            <Skeleton className="h-10 w-64 mb-8 bg-[#21262d]" />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} className="h-40 rounded-xl bg-[#21262d]" />
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d1117]" dir="rtl">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-sm text-[#8b949e] mb-6"
          >
            <Link to="/" className="hover:text-white transition-colors">الرئيسية</Link>
            <span>/</span>
            {selectedSector ? (
              <>
                <button 
                  onClick={() => setSelectedSector(null)}
                  className="hover:text-white transition-colors"
                >
                  القطاعات
                </button>
                <span>/</span>
                <span className="text-white">{sectorGroups.find(s => s.name === selectedSector)?.nameAr}</span>
              </>
            ) : (
              <span className="text-white">القطاعات</span>
            )}
          </motion.div>

          <AnimatePresence mode="wait">
            {!selectedSector ? (
              // Sector Grid View
              <motion.div
                key="sectors"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h1 className="text-3xl font-bold text-white mb-2">قطاعات البورصة</h1>
                    <p className="text-[#8b949e]">
                      استكشف {sectorGroups.length} قطاع و {data?.stocks.length} شركة
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {sectorGroups.map((sector, index) => (
                    <motion.button
                      key={sector.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => setSelectedSector(sector.name)}
                      className="group bg-[#161b22] rounded-2xl p-5 border border-[#30363d] hover:border-[#484f58] transition-all text-right"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${SECTOR_COLORS[sector.name] || 'from-[#21262d] to-[#30363d]'} flex items-center justify-center`}>
                          {SECTOR_ICONS[sector.name] || <Building2 className="w-5 h-5 text-white" />}
                        </div>
                        <div className={`text-sm font-semibold ${sector.avgChange >= 0 ? 'text-[#3fb950]' : 'text-[#f85149]'}`}>
                          {sector.avgChange >= 0 ? '+' : ''}{sector.avgChange.toFixed(2)}%
                        </div>
                      </div>
                      
                      <h3 className="text-lg font-bold text-white mb-1">{sector.nameAr}</h3>
                      <p className="text-xs text-[#8b949e] mb-3">{sector.name}</p>
                      
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1 text-[#8b949e]">
                          <Users className="w-3 h-3" />
                          <span>{sector.stockCount} شركة</span>
                        </div>
                        <div className="text-[#8b949e]">
                          {(sector.totalMarketCap / 1000).toFixed(1)}B MAD
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-3 border-t border-[#30363d]">
                        <div className="flex items-center justify-between">
                          <div className="flex -space-x-2 rtl:space-x-reverse">
                            {sector.stocks.slice(0, 4).map((stock) => {
                              const logoUrl = getStockLogoUrl(stock.symbol);
                              return logoUrl ? (
                                <img
                                  key={stock.symbol}
                                  src={logoUrl}
                                  alt={stock.symbol}
                                  className="w-6 h-6 rounded-full bg-white border-2 border-[#161b22] object-contain p-0.5"
                                />
                              ) : (
                                <div
                                  key={stock.symbol}
                                  className="w-6 h-6 rounded-full bg-[#21262d] border-2 border-[#161b22] flex items-center justify-center text-[8px] font-bold text-white"
                                >
                                  {stock.symbol.charAt(0)}
                                </div>
                              );
                            })}
                            {sector.stockCount > 4 && (
                              <div className="w-6 h-6 rounded-full bg-[#21262d] border-2 border-[#161b22] flex items-center justify-center text-[8px] text-[#8b949e]">
                                +{sector.stockCount - 4}
                              </div>
                            )}
                          </div>
                          <ArrowLeft className="w-4 h-4 text-[#8b949e] group-hover:text-white group-hover:-translate-x-1 transition-all rotate-180" />
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            ) : (
              // Sector Detail View
              <motion.div
                key="detail"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Back button and header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setSelectedSector(null)}
                      className="p-2 rounded-lg bg-[#21262d] text-[#8b949e] hover:text-white hover:bg-[#30363d] transition-all"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                      <h1 className="text-2xl font-bold text-white">
                        {sectorGroups.find(s => s.name === selectedSector)?.nameAr}
                      </h1>
                      <p className="text-sm text-[#8b949e]">
                        {filteredStocks.length} شركة في هذا القطاع
                      </p>
                    </div>
                  </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-3 mb-6">
                  <div className="relative flex-1 max-w-xs">
                    <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-[#8b949e]" />
                    <input
                      type="text"
                      placeholder="بحث..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-[#21262d] border border-[#30363d] rounded-xl py-2.5 pr-10 pl-4 text-white placeholder:text-[#8b949e] focus:border-[#2962ff] focus:ring-1 focus:ring-[#2962ff] outline-none"
                    />
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center gap-2 bg-[#21262d] border border-[#30363d] rounded-xl px-4 py-2.5 text-white hover:bg-[#30363d] transition-all">
                      <Filter className="w-4 h-4 text-[#8b949e]" />
                      <span className="text-sm">
                        ترتيب: {sortBy === "marketCap" ? "القيمة السوقية" : sortBy === "price" ? "السعر" : sortBy === "change" ? "التغير" : "الاسم"}
                      </span>
                      <ChevronDown className="w-4 h-4 text-[#8b949e]" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-[#161b22] border-[#30363d]">
                      <DropdownMenuItem onClick={() => setSortBy("marketCap")} className="text-white hover:bg-[#21262d]">
                        القيمة السوقية
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSortBy("price")} className="text-white hover:bg-[#21262d]">
                        السعر
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSortBy("change")} className="text-white hover:bg-[#21262d]">
                        التغير
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSortBy("name")} className="text-white hover:bg-[#21262d]">
                        الاسم
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Stock Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredStocks.map((stock, index) => {
                    const logoUrl = getStockLogoUrl(stock.symbol);
                    return (
                      <motion.div
                        key={stock.symbol}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03 }}
                      >
                        <Link
                          to={`/stock/${stock.symbol}`}
                          className="block bg-[#161b22] rounded-xl p-5 border border-[#30363d] hover:border-[#484f58] transition-all group"
                        >
                          <div className="flex items-start gap-3 mb-4">
                            {logoUrl ? (
                              <img
                                src={logoUrl}
                                alt={stock.symbol}
                                className="w-12 h-12 rounded-xl bg-white p-1 object-contain"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-xl bg-[#21262d] flex items-center justify-center text-white font-bold">
                                {stock.symbol.slice(0, 2)}
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h3 className="font-bold text-white">{stock.symbol}</h3>
                                <ExternalLink className="w-4 h-4 text-[#8b949e] opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                              <p className="text-xs text-[#8b949e] truncate">{stock.nameEn}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-end justify-between">
                            <div>
                              <p className="text-xl font-bold text-white">{stock.price.toFixed(2)}</p>
                              <p className="text-xs text-[#8b949e]">MAD</p>
                            </div>
                            <div className={`flex items-center gap-1 text-sm font-semibold ${stock.change >= 0 ? 'text-[#3fb950]' : 'text-[#f85149]'}`}>
                              {stock.change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                              {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}%
                            </div>
                          </div>
                          
                          <div className="mt-4 pt-3 border-t border-[#30363d] flex items-center justify-between text-xs text-[#8b949e]">
                            <span>القيمة السوقية</span>
                            <span className="text-white font-medium">
                              {stock.marketCap >= 1000 
                                ? (stock.marketCap / 1000).toFixed(1) + 'B' 
                                : stock.marketCap.toFixed(0) + 'M'} MAD
                            </span>
                          </div>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Sectors;
