import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import Header from "@/components/layout/Header";
import Footer from "@/components/landing/Footer";
import { useStockData, type Stock } from "@/hooks/useStockData";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import TriangleIndicator from "@/components/ui/TriangleIndicator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  ArrowUpDown,
  Filter,
  Download,
  RefreshCw,
  Star,
  ChevronLeft,
  ChevronRight,
  Clock
} from "lucide-react";
import EChartsHeatmap from "@/components/landing/EChartsHeatmap";
import ProTickerBar from "@/components/landing/ProTickerBar";
import { getStockLogoUrl } from "@/lib/stockLogos";

type SortField = "symbol" | "name" | "price" | "change" | "marketCap" | "sector";
type SortDirection = "asc" | "desc";

const Markets = () => {
  const { t, i18n } = useTranslation();
  const { data, isLoading, error, refetch, isRefetching } = useStockData();
  const stocks = data?.stocks || [];
  const sectors = data?.sectors || [];

  const [search, setSearch] = useState("");
  const [sectorFilter, setSectorFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>("marketCap");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [favorites, setFavorites] = useState<string[]>([]);

  const itemsPerPage = 20;

  // Get unique sectors
  const uniqueSectors = useMemo(() => {
    const sectorSet = new Set(stocks.map(s => s.sector));
    return Array.from(sectorSet);
  }, [stocks]);

  // Filter and sort stocks
  const filteredStocks = useMemo(() => {
    let result = [...stocks];

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(s =>
        s.symbol.toLowerCase().includes(searchLower) ||
        s.name.toLowerCase().includes(searchLower) ||
        s.nameEn.toLowerCase().includes(searchLower)
      );
    }

    // Sector filter
    if (sectorFilter !== "all") {
      result = result.filter(s => s.sector === sectorFilter);
    }

    // Sort
    result.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];

      const aCompare = typeof aVal === "string" ? aVal.toLowerCase() : aVal;
      const bCompare = typeof bVal === "string" ? bVal.toLowerCase() : bVal;

      if (sortDirection === "asc") {
        return aCompare > bCompare ? 1 : -1;
      }
      return aCompare < bCompare ? 1 : -1;
    });

    return result;
  }, [stocks, search, sectorFilter, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(filteredStocks.length / itemsPerPage);
  const paginatedStocks = filteredStocks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const toggleFavorite = (symbol: string) => {
    setFavorites(prev =>
      prev.includes(symbol)
        ? prev.filter(s => s !== symbol)
        : [...prev, symbol]
    );
  };

  const formatMarketCap = (value: number): string => {
    if (i18n.language === 'ar') {
      if (value >= 1000000000) {
        return `${(value / 1000000000).toFixed(2)} مليار`;
      }
      if (value >= 1000000) {
        return `${(value / 1000000).toFixed(2)} مليون`;
      }
      return value.toLocaleString("ar-MA");
    } else if (i18n.language === 'fr') {
      if (value >= 1000000000) {
        return `${(value / 1000000000).toFixed(2)} Mrd`;
      }
      if (value >= 1000000) {
        return `${(value / 1000000).toFixed(2)} M`;
      }
      return value.toLocaleString("fr-MA");
    } else {
      if (value >= 1000000000) {
        return `${(value / 1000000000).toFixed(2)} B`;
      }
      if (value >= 1000000) {
        return `${(value / 1000000).toFixed(2)} M`;
      }
      return value.toLocaleString("es-ES");
    }
  };

  const SortButton = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center gap-1 hover:text-foreground transition-colors"
    >
      {children}
      <ArrowUpDown className={`w-3 h-3 ${sortField === field ? "text-primary" : "opacity-50"}`} />
    </button>
  );

  if (error) {
    return (
      <div className="min-h-screen bg-background" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
        <Header />
        <div className="container mx-auto px-4 pt-24 text-center">
          <p className="text-destructive">{t('common.error')}</p>
          <Button onClick={() => refetch()} className="mt-4">{t('common.retry')}</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
      <Header />

      <main className="pt-16">
        <ProTickerBar />

        <div className="container mx-auto px-4 py-8">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  {t('markets.title')}
                </h1>
                <p className="text-muted-foreground flex items-center gap-2">
                  <Clock className="w-4 h-4" strokeWidth={1.5} />
                  {t('markets.lastUpdate')}: {data?.lastUpdate || "--:--"}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => refetch()}
                  className="gap-2"
                >
                  <RefreshCw className={`w-4 h-4 ${isRefetching ? 'animate-spin' : ''}`} strokeWidth={1.5} />
                </Button>
              </div>
            </div>

            {/* Market Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-card rounded-xl p-4 border border-border">
                <p className="text-muted-foreground text-sm mb-1">{t('markets.totalStocks')}</p>
                <p className="text-2xl font-bold text-foreground">{stocks.length}</p>
              </div>
              <div className="bg-card rounded-xl p-4 border border-border">
                <p className="text-muted-foreground text-sm mb-1">{t('markets.gainers')}</p>
                <p className="text-2xl font-bold text-chart-positive">
                  {stocks.filter(s => s.change > 0).length}
                </p>
              </div>
              <div className="bg-card rounded-xl p-4 border border-border">
                <p className="text-muted-foreground text-sm mb-1">{t('markets.losers')}</p>
                <p className="text-2xl font-bold text-chart-negative">
                  {stocks.filter(s => s.change < 0).length}
                </p>
              </div>
              <div className="bg-card rounded-xl p-4 border border-border">
                <p className="text-muted-foreground text-sm mb-1">{t('markets.unchanged')}</p>
                <p className="text-2xl font-bold text-muted-foreground">
                  {stocks.filter(s => s.change === 0).length}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Heatmap */}
          <EChartsHeatmap />

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col md:flex-row gap-4 mb-6 mt-8"
          >
            <div className="relative flex-1 max-w-md">
              <Search className={`absolute ${i18n.language === 'ar' ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground`} strokeWidth={1.5} />
              <Input
                placeholder={t('markets.searchPlaceholder')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`${i18n.language === 'ar' ? 'pr-10' : 'pl-10'}`}
              />
            </div>

            <Select value={sectorFilter} onValueChange={setSectorFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <Filter className="w-4 h-4 mx-2" strokeWidth={1.5} />
                <SelectValue placeholder={t('markets.allSectors')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('markets.allSectors')}</SelectItem>
                {uniqueSectors.map(sector => (
                  <SelectItem key={sector} value={sector}>{sector}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <Download className="w-4 h-4" strokeWidth={1.5} />
              {t('common.export')}
            </Button>
          </motion.div>

          {/* Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card rounded-xl border border-border overflow-hidden"
          >
            {isLoading ? (
              <div className="p-6 space-y-4">
                {[...Array(10)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-muted-foreground w-12">{t('markets.table.rank')}</TableHead>
                      <TableHead className="text-muted-foreground">
                        <SortButton field="symbol">{t('markets.table.symbol')}</SortButton>
                      </TableHead>
                      <TableHead className="text-muted-foreground">
                        <SortButton field="name">{t('markets.table.name')}</SortButton>
                      </TableHead>
                      <TableHead className="text-muted-foreground">
                        <SortButton field="sector">{t('markets.table.sector')}</SortButton>
                      </TableHead>
                      <TableHead className="text-muted-foreground">
                        <SortButton field="price">{t('markets.table.price')}</SortButton>
                      </TableHead>
                      <TableHead className="text-muted-foreground">
                        <SortButton field="change">{t('markets.table.change')}</SortButton>
                      </TableHead>
                      <TableHead className="text-muted-foreground">
                        <SortButton field="marketCap">{t('markets.table.marketCap')}</SortButton>
                      </TableHead>
                      <TableHead className="text-muted-foreground text-center w-12">⭐</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedStocks.map((stock, index) => {
                      const logoUrl = getStockLogoUrl(stock.symbol);
                      const rank = (currentPage - 1) * itemsPerPage + index + 1;

                      return (
                        <TableRow
                          key={stock.symbol}
                          className="hover:bg-secondary/30 transition-colors"
                        >
                          <TableCell className="text-muted-foreground font-medium">
                            {rank}
                          </TableCell>
                          <TableCell>
                            <Link
                              to={`/stock/${stock.symbol}`}
                              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                            >
                              {logoUrl ? (
                                <img
                                  src={logoUrl}
                                  alt={stock.symbol}
                                  className="w-10 h-10 rounded-full bg-white p-1 object-contain"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = 'none';
                                  }}
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-foreground font-bold">
                                  {stock.symbol.charAt(0)}
                                </div>
                              )}
                              <span className="font-bold text-foreground">{stock.symbol}</span>
                            </Link>
                          </TableCell>
                          <TableCell>
                            <Link
                              to={`/stock/${stock.symbol}`}
                              className="hover:text-primary transition-colors"
                            >
                              <p className="text-foreground font-medium">{stock.nameEn}</p>
                              <p className="text-muted-foreground text-sm">{stock.name}</p>
                            </Link>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="secondary"
                            >
                              {stock.sector}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span className="text-foreground font-semibold text-lg">
                              {stock.price.toFixed(2)}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className={`flex items-center gap-2 font-semibold ${
                              stock.change > 0 ? "text-chart-positive" :
                              stock.change < 0 ? "text-chart-negative" :
                              "text-muted-foreground"
                            }`}>
                              <TriangleIndicator
                                direction={stock.change > 0 ? "up" : stock.change < 0 ? "down" : "neutral"}
                                size="sm"
                              />
                              <span>
                                {stock.change > 0 ? "+" : ""}{stock.change.toFixed(2)}%
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-muted-foreground">
                              {formatMarketCap(stock.marketCap)}
                            </span>
                          </TableCell>
                          <TableCell className="text-center">
                            <button
                              onClick={() => toggleFavorite(stock.symbol)}
                              className="hover:scale-110 transition-transform"
                            >
                              <Star
                                className={`w-5 h-5 ${
                                  favorites.includes(stock.symbol)
                                    ? "fill-warning text-warning"
                                    : "text-muted-foreground"
                                }`}
                                strokeWidth={1.5}
                              />
                            </button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-border">
                <p className="text-muted-foreground text-sm">
                  {t('markets.pagination.showing')} {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredStocks.length)} {t('markets.pagination.of')} {filteredStocks.length}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    {i18n.language === 'ar' ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                  </Button>
                  {[...Array(Math.min(5, totalPages))].map((_, i) => {
                    const page = i + 1;
                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </Button>
                    );
                  })}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    {i18n.language === 'ar' ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Markets;
