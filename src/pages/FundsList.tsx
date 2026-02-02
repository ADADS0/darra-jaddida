import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { 
  Search, Filter, RefreshCw, 
  ArrowUpDown, X, Scale
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/landing/Footer";
import { useFundData, Fund } from "@/hooks/useFundData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import TriangleIndicator from "@/components/ui/TriangleIndicator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import FundCompareModal from "@/components/fund/FundCompareModal";

const formatLargeNumber = (num: number, lang: string): string => {
  if (lang === 'ar') {
    if (num >= 1e9) return (num / 1e9).toFixed(2) + " مليار";
    if (num >= 1e6) return (num / 1e6).toFixed(0) + " مليون";
    return num.toLocaleString("ar-MA");
  } else if (lang === 'fr') {
    if (num >= 1e9) return (num / 1e9).toFixed(2) + " Mrd";
    if (num >= 1e6) return (num / 1e6).toFixed(0) + " M";
    return num.toLocaleString("fr-MA");
  } else {
    if (num >= 1e9) return (num / 1e9).toFixed(2) + " B";
    if (num >= 1e6) return (num / 1e6).toFixed(0) + " M";
    return num.toLocaleString("es-ES");
  }
};

const getCategoryColor = (category: string): string => {
  switch (category) {
    case "أسهم": return "bg-emerald-500/20 text-emerald-400";
    case "سندات": return "bg-blue-500/20 text-blue-400";
    case "متوازن": return "bg-purple-500/20 text-purple-400";
    case "نقدي": return "bg-yellow-500/20 text-yellow-400";
    case "تعاقدي": return "bg-orange-500/20 text-orange-400";
    default: return "bg-muted text-muted-foreground";
  }
};

type SortField = "name" | "nav" | "changePercent" | "return1Y" | "return3Y" | "volatility" | "sharpeRatio" | "aum" | "fees";
type SortDirection = "asc" | "desc";

const FundsList = () => {
  const { t, i18n } = useTranslation();
  const { data, isLoading, error, refetch } = useFundData();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedManager, setSelectedManager] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>("aum");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [selectedFunds, setSelectedFunds] = useState<string[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const toggleFundSelection = (fundId: string) => {
    setSelectedFunds(prev => 
      prev.includes(fundId)
        ? prev.filter(id => id !== fundId)
        : prev.length < 4 ? [...prev, fundId] : prev
    );
  };

  const filteredAndSortedFunds = useMemo(() => {
    if (!data?.funds) return [];

    let filtered = data.funds;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(f => 
        f.name.toLowerCase().includes(query) ||
        f.nameEn.toLowerCase().includes(query) ||
        f.manager.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(f => f.category === selectedCategory);
    }

    // Manager filter
    if (selectedManager !== "all") {
      filtered = filtered.filter(f => f.manager === selectedManager);
    }

    // Sort
    filtered = [...filtered].sort((a, b) => {
      let aValue: number, bValue: number;
      
      switch (sortField) {
        case "name": return sortDirection === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
        case "nav": aValue = a.nav; bValue = b.nav; break;
        case "changePercent": aValue = a.changePercent; bValue = b.changePercent; break;
        case "return1Y": aValue = a.returns["1Y"]; bValue = b.returns["1Y"]; break;
        case "return3Y": aValue = a.returns["3Y"]; bValue = b.returns["3Y"]; break;
        case "volatility": aValue = a.risk.volatility; bValue = b.risk.volatility; break;
        case "sharpeRatio": aValue = a.risk.sharpeRatio; bValue = b.risk.sharpeRatio; break;
        case "aum": aValue = a.aum; bValue = b.aum; break;
        case "fees": aValue = a.fees.managementFee; bValue = b.fees.managementFee; break;
        default: aValue = 0; bValue = 0;
      }
      
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
    });

    return filtered;
  }, [data?.funds, searchQuery, selectedCategory, selectedManager, sortField, sortDirection]);

  const selectedFundsData = useMemo(() => {
    if (!data?.funds) return [];
    return data.funds.filter(f => selectedFunds.includes(f.id));
  }, [data?.funds, selectedFunds]);

  const SortableHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <TableHead 
      className="cursor-pointer hover:bg-secondary/50 transition-colors"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-1">
        {children}
        <ArrowUpDown className={`w-3 h-3 ${sortField === field ? "text-primary" : "text-muted-foreground"}`} />
      </div>
    </TableHead>
  );

  return (
    <div className="min-h-screen bg-background" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
      <Header />
      
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Link to="/" className="hover:text-foreground transition-colors">{t('common.home')}</Link>
              <span>/</span>
              <span className="text-foreground">{t('funds.breadcrumb')}</span>
            </div>
            
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">{t('funds.title')}</h1>
                <p className="text-muted-foreground">
                  {t('funds.subtitle').replace('{count}', String(data?.funds.length || 0))}
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                {selectedFunds.length >= 2 && (
                  <Button 
                    variant="hero"
                    onClick={() => setShowCompareModal(true)}
                    className="gap-2"
                  >
                    <Scale className="w-4 h-4" strokeWidth={1.5} />
                    {t('funds.compare')} ({selectedFunds.length})
                  </Button>
                )}
                {selectedFunds.length > 0 && (
                  <Button 
                    variant="outline"
                    onClick={() => setSelectedFunds([])}
                    size="sm"
                  >
                    <X className="w-4 h-4" strokeWidth={1.5} />
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  onClick={() => refetch()}
                  disabled={isLoading}
                >
                  <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} strokeWidth={1.5} />
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Category Stats */}
          {data?.categoryStats && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6"
            >
              {data.categoryStats.map((stat) => (
                <div 
                  key={stat.category}
                  className={`p-4 rounded-xl border border-border cursor-pointer transition-all ${
                    selectedCategory === stat.category 
                      ? "bg-primary/10 border-primary" 
                      : "bg-card hover:bg-secondary/50"
                  }`}
                  onClick={() => setSelectedCategory(
                    selectedCategory === stat.category ? "all" : stat.category
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(stat.category)}`}>
                      {stat.category}
                    </span>
                    <span className="text-xs text-muted-foreground">{stat.fundCount} {t('funds.fund')}</span>
                  </div>
                  <p className={`text-lg font-bold ${stat.avgReturn1Y >= 0 ? "text-chart-positive" : "text-chart-negative"}`}>
                    {stat.avgReturn1Y >= 0 ? "+" : ""}{stat.avgReturn1Y}%
                  </p>
                  <p className="text-xs text-muted-foreground">{t('funds.avgAnnualReturn')}</p>
                </div>
              ))}
            </motion.div>
          )}

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card rounded-2xl border border-border p-4 mb-6"
          >
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className={`absolute ${i18n.language === 'ar' ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground`} strokeWidth={1.5} />
                <Input
                  placeholder={t('funds.searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`${i18n.language === 'ar' ? 'pr-10' : 'pl-10'}`}
                />
              </div>
              
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder={t('funds.allCategories')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('funds.allCategories')}</SelectItem>
                  {data?.categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={selectedManager} onValueChange={setSelectedManager}>
                <SelectTrigger className="w-full md:w-56">
                  <SelectValue placeholder={t('funds.allManagers')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('funds.allManagers')}</SelectItem>
                  {data?.managers.map((manager) => (
                    <SelectItem key={manager} value={manager}>{manager}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </motion.div>

          {/* Funds Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card rounded-2xl border border-border overflow-hidden"
          >
            {isLoading ? (
              <div className="p-6 space-y-4">
                {[...Array(8)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : error ? (
              <div className="p-12 text-center">
                <p className="text-destructive mb-4">{t('common.error')}</p>
                <Button onClick={() => refetch()}>{t('common.retry')}</Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox 
                          checked={selectedFunds.length === filteredAndSortedFunds.length && filteredAndSortedFunds.length > 0}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedFunds(filteredAndSortedFunds.slice(0, 4).map(f => f.id));
                            } else {
                              setSelectedFunds([]);
                            }
                          }}
                        />
                      </TableHead>
                      <SortableHeader field="name">{t('funds.table.fund')}</SortableHeader>
                      <TableHead>{t('funds.table.category')}</TableHead>
                      <SortableHeader field="nav">{t('funds.table.nav')}</SortableHeader>
                      <SortableHeader field="changePercent">{t('funds.table.change')}</SortableHeader>
                      <SortableHeader field="return1Y">{t('funds.table.return1Y')}</SortableHeader>
                      <SortableHeader field="return3Y">{t('funds.table.return3Y')}</SortableHeader>
                      <SortableHeader field="volatility">{t('funds.table.volatility')}</SortableHeader>
                      <SortableHeader field="sharpeRatio">{t('funds.table.sharpe')}</SortableHeader>
                      <SortableHeader field="fees">{t('funds.table.fees')}</SortableHeader>
                      <SortableHeader field="aum">{t('funds.table.aum')}</SortableHeader>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAndSortedFunds.map((fund) => (
                      <TableRow 
                        key={fund.id}
                        className={`hover:bg-secondary/30 cursor-pointer ${
                          selectedFunds.includes(fund.id) ? "bg-primary/5" : ""
                        }`}
                      >
                        <TableCell>
                          <Checkbox
                            checked={selectedFunds.includes(fund.id)}
                            onCheckedChange={() => toggleFundSelection(fund.id)}
                          />
                        </TableCell>
                        <TableCell>
                          <Link to={`/fund/${fund.id}`} className="block">
                            <p className="font-medium text-foreground hover:text-primary transition-colors">
                              {fund.name}
                            </p>
                            <p className="text-xs text-muted-foreground">{fund.manager}</p>
                          </Link>
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(fund.category)}`}>
                            {fund.category}
                          </span>
                        </TableCell>
                        <TableCell className="font-medium">{fund.nav.toFixed(2)}</TableCell>
                        <TableCell>
                          <div className={`flex items-center gap-2 ${fund.isPositive ? "text-chart-positive" : "text-chart-negative"}`}>
                            <TriangleIndicator 
                              direction={fund.isPositive ? "up" : "down"} 
                              size="sm"
                            />
                            <span className="font-medium">
                              {fund.isPositive ? "+" : ""}{fund.changePercent.toFixed(2)}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className={fund.returns["1Y"] >= 0 ? "text-chart-positive" : "text-chart-negative"}>
                          {fund.returns["1Y"] >= 0 ? "+" : ""}{fund.returns["1Y"]}%
                        </TableCell>
                        <TableCell className={fund.returns["3Y"] >= 0 ? "text-chart-positive" : "text-chart-negative"}>
                          {fund.returns["3Y"] >= 0 ? "+" : ""}{fund.returns["3Y"]}%
                        </TableCell>
                        <TableCell>{fund.risk.volatility}%</TableCell>
                        <TableCell>{fund.risk.sharpeRatio.toFixed(2)}</TableCell>
                        <TableCell>{fund.fees.managementFee}%</TableCell>
                        <TableCell className="text-sm">{formatLargeNumber(fund.aum, i18n.language)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
            
            {/* Results count */}
            <div className="p-4 border-t border-border flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {t('funds.showing')} {filteredAndSortedFunds.length} {t('funds.of')} {data?.funds.length || 0} {t('funds.fund')}
              </p>
              {selectedFunds.length > 0 && (
                <p className="text-sm text-primary">
                  {selectedFunds.length} {t('funds.selectedForComparison')} ({t('funds.maxFunds')})
                </p>
              )}
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />

      {/* Compare Modal */}
      {showCompareModal && (
        <FundCompareModal
          funds={selectedFundsData}
          onClose={() => setShowCompareModal(false)}
        />
      )}
    </div>
  );
};

export default FundsList;