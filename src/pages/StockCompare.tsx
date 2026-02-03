import { useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  X,
  Search,
  TrendingUp,
  TrendingDown,
  ArrowLeftRight,
  BarChart3,
  PieChart,
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/landing/Footer";
import { useStockData, type Stock } from "@/hooks/useStockData";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { getStockLogoUrl } from "@/lib/stockLogos";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Bar,
  BarChart,
} from "recharts";

const COMPARISON_COLORS = ["#2962ff", "#089981", "#f23645", "#ff9800"];

const StockCompare = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data, isLoading } = useStockData();
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const selectedSymbols = useMemo(() => {
    const symbols = searchParams.get("symbols");
    return symbols ? symbols.split(",").filter(Boolean) : [];
  }, [searchParams]);

  const selectedStocks = useMemo(() => {
    if (!data?.stocks) return [];
    return selectedSymbols
      .map((symbol) => data.stocks.find((s) => s.symbol === symbol))
      .filter(Boolean) as Stock[];
  }, [data, selectedSymbols]);

  const filteredStocks = useMemo(() => {
    if (!data?.stocks || !searchTerm) return [];
    return data.stocks
      .filter(
        (s) =>
          !selectedSymbols.includes(s.symbol) &&
          (s.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.nameEn.toLowerCase().includes(searchTerm.toLowerCase()))
      )
      .slice(0, 8);
  }, [data, searchTerm, selectedSymbols]);

  const addStock = (symbol: string) => {
    if (selectedSymbols.length < 4 && !selectedSymbols.includes(symbol)) {
      const newSymbols = [...selectedSymbols, symbol];
      setSearchParams({ symbols: newSymbols.join(",") });
    }
    setSearchTerm("");
    setShowSearch(false);
  };

  const removeStock = (symbol: string) => {
    const newSymbols = selectedSymbols.filter((s) => s !== symbol);
    if (newSymbols.length > 0) {
      setSearchParams({ symbols: newSymbols.join(",") });
    } else {
      setSearchParams({});
    }
  };

  // Generate mock comparison data
  const chartData = useMemo(() => {
    const days = 30;
    return Array.from({ length: days }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (days - i));
      const dataPoint: Record<string, number | string> = {
        date: date.toLocaleDateString("ar-MA", { day: "numeric", month: "short" }),
      };
      selectedStocks.forEach((stock) => {
        const baseValue = 100;
        const randomWalk = (Math.random() - 0.5) * 5;
        const trend = stock.change > 0 ? 0.1 : -0.1;
        dataPoint[stock.symbol] =
          baseValue + i * trend + randomWalk + Math.sin(i * 0.5) * 2;
      });
      return dataPoint;
    });
  }, [selectedStocks]);

  // Metrics comparison data
  const metricsData = useMemo(() => {
    return [
      {
        metric: "P/E",
        ...selectedStocks.reduce((acc, stock) => {
          acc[stock.symbol] = Math.random() * 20 + 5;
          return acc;
        }, {} as Record<string, number>),
      },
      {
        metric: "P/B",
        ...selectedStocks.reduce((acc, stock) => {
          acc[stock.symbol] = Math.random() * 3 + 0.5;
          return acc;
        }, {} as Record<string, number>),
      },
      {
        metric: "ROE %",
        ...selectedStocks.reduce((acc, stock) => {
          acc[stock.symbol] = Math.random() * 25 + 5;
          return acc;
        }, {} as Record<string, number>),
      },
      {
        metric: "عائد التوزيعات %",
        ...selectedStocks.reduce((acc, stock) => {
          acc[stock.symbol] = Math.random() * 5 + 1;
          return acc;
        }, {} as Record<string, number>),
      },
    ];
  }, [selectedStocks]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background" dir="rtl">
        <Header />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4">
            <Skeleton className="h-10 w-64 mb-8" />
            <Skeleton className="h-96 w-full rounded-xl" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Header />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-sm text-muted-foreground mb-6"
          >
            <Link to="/" className="hover:text-foreground transition-colors">
              الرئيسية
            </Link>
            <span>/</span>
            <Link to="/markets" className="hover:text-foreground transition-colors">
              الأسواق
            </Link>
            <span>/</span>
            <span className="text-foreground">مقارنة الأسهم</span>
          </motion.div>

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                مقارنة الأسهم
              </h1>
              <p className="text-muted-foreground">
                قارن بين {selectedStocks.length} أسهم (حد أقصى 4)
              </p>
            </div>

            {selectedSymbols.length < 4 && (
              <Button
                onClick={() => setShowSearch(true)}
                className="bg-primary hover:bg-primary/90"
              >
                <Plus className="w-4 h-4 ml-2" />
                إضافة سهم
              </Button>
            )}
          </div>

          {/* Stock Selection Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {selectedStocks.map((stock, index) => {
              const logoUrl = getStockLogoUrl(stock.symbol);
              return (
                <motion.div
                  key={stock.symbol}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative bg-card rounded-xl border-2 p-4"
                  style={{ borderColor: COMPARISON_COLORS[index] }}
                >
                  <button
                    onClick={() => removeStock(stock.symbol)}
                    className="absolute top-2 left-2 p-1 rounded-full bg-destructive/10 hover:bg-destructive/20 text-destructive"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-3 mb-3">
                    {logoUrl ? (
                      <img
                        src={logoUrl}
                        alt={stock.symbol}
                        className="w-10 h-10 rounded-lg bg-white p-1 object-contain"
                      />
                    ) : (
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                        style={{ backgroundColor: COMPARISON_COLORS[index] }}
                      >
                        {stock.symbol.slice(0, 2)}
                      </div>
                    )}
                    <div>
                      <p className="font-bold text-foreground">{stock.symbol}</p>
                      <p className="text-xs text-muted-foreground truncate max-w-[100px]">
                        {stock.nameEn}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-end justify-between">
                    <p className="text-lg font-bold text-foreground">
                      {stock.price.toFixed(2)}
                    </p>
                    <div
                      className={`flex items-center gap-1 text-sm font-semibold ${
                        stock.change >= 0 ? "text-chart-positive" : "text-chart-negative"
                      }`}
                    >
                      {stock.change >= 0 ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <TrendingDown className="w-4 h-4" />
                      )}
                      {stock.change >= 0 ? "+" : ""}
                      {stock.change.toFixed(2)}%
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {/* Empty slots */}
            {Array.from({ length: 4 - selectedStocks.length }).map((_, i) => (
              <motion.button
                key={`empty-${i}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => setShowSearch(true)}
                className="border-2 border-dashed border-border rounded-xl p-6 flex flex-col items-center justify-center gap-2 hover:border-primary/50 hover:bg-secondary/30 transition-all"
              >
                <Plus className="w-8 h-8 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">إضافة سهم</span>
              </motion.button>
            ))}
          </div>

          {/* Search Modal */}
          <AnimatePresence>
            {showSearch && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-start justify-center pt-32"
                onClick={() => setShowSearch(false)}
              >
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-card rounded-2xl border border-border p-6 w-full max-w-md mx-4"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="relative mb-4">
                    <Search className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="ابحث عن سهم..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      autoFocus
                      className="w-full bg-secondary border border-border rounded-xl py-3 pr-10 pl-4 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    />
                  </div>

                  <div className="max-h-64 overflow-y-auto space-y-1">
                    {filteredStocks.map((stock) => {
                      const logoUrl = getStockLogoUrl(stock.symbol);
                      return (
                        <button
                          key={stock.symbol}
                          onClick={() => addStock(stock.symbol)}
                          className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-secondary transition-colors"
                        >
                          {logoUrl ? (
                            <img
                              src={logoUrl}
                              alt={stock.symbol}
                              className="w-8 h-8 rounded-lg bg-white p-0.5 object-contain"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-sm font-bold text-foreground">
                              {stock.symbol.slice(0, 2)}
                            </div>
                          )}
                          <div className="flex-1 text-right">
                            <p className="font-medium text-foreground">{stock.symbol}</p>
                            <p className="text-xs text-muted-foreground">{stock.nameEn}</p>
                          </div>
                          <div
                            className={`text-sm font-semibold ${
                              stock.change >= 0 ? "text-chart-positive" : "text-chart-negative"
                            }`}
                          >
                            {stock.change >= 0 ? "+" : ""}
                            {stock.change.toFixed(2)}%
                          </div>
                        </button>
                      );
                    })}
                    {searchTerm && filteredStocks.length === 0 && (
                      <p className="text-center text-muted-foreground py-8">
                        لم يتم العثور على نتائج
                      </p>
                    )}
                    {!searchTerm && (
                      <p className="text-center text-muted-foreground py-8">
                        ابدأ الكتابة للبحث...
                      </p>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Comparison Charts */}
          {selectedStocks.length >= 2 && (
            <div className="space-y-6">
              {/* Price Performance Chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card rounded-2xl border border-border p-6"
              >
                <div className="flex items-center gap-2 mb-6">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  <h2 className="text-lg font-semibold text-foreground">
                    أداء السعر (30 يوم)
                  </h2>
                </div>

                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <XAxis
                        dataKey="date"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                        domain={["dataMin - 2", "dataMax + 2"]}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Legend />
                      {selectedStocks.map((stock, index) => (
                        <Line
                          key={stock.symbol}
                          type="monotone"
                          dataKey={stock.symbol}
                          stroke={COMPARISON_COLORS[index]}
                          strokeWidth={2}
                          dot={false}
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* Metrics Comparison */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-card rounded-2xl border border-border p-6"
              >
                <div className="flex items-center gap-2 mb-6">
                  <PieChart className="w-5 h-5 text-primary" />
                  <h2 className="text-lg font-semibold text-foreground">
                    مقارنة المؤشرات المالية
                  </h2>
                </div>

                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={metricsData} layout="vertical">
                      <XAxis type="number" axisLine={false} tickLine={false} />
                      <YAxis
                        type="category"
                        dataKey="metric"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                        width={100}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                        formatter={(value: number) => value.toFixed(2)}
                      />
                      <Legend />
                      {selectedStocks.map((stock, index) => (
                        <Bar
                          key={stock.symbol}
                          dataKey={stock.symbol}
                          fill={COMPARISON_COLORS[index]}
                          radius={[0, 4, 4, 0]}
                        />
                      ))}
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* Detailed Table */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-card rounded-2xl border border-border overflow-hidden"
              >
                <div className="p-6 border-b border-border">
                  <div className="flex items-center gap-2">
                    <ArrowLeftRight className="w-5 h-5 text-primary" />
                    <h2 className="text-lg font-semibold text-foreground">
                      جدول المقارنة التفصيلي
                    </h2>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-secondary/50">
                      <tr>
                        <th className="text-right text-sm font-medium text-muted-foreground px-6 py-4">
                          المؤشر
                        </th>
                        {selectedStocks.map((stock, index) => (
                          <th
                            key={stock.symbol}
                            className="text-center text-sm font-medium px-6 py-4"
                            style={{ color: COMPARISON_COLORS[index] }}
                          >
                            {stock.symbol}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {[
                        { label: "السعر", format: (s: Stock) => `${s.price.toFixed(2)} MAD` },
                        {
                          label: "التغير",
                          format: (s: Stock) => `${s.change >= 0 ? "+" : ""}${s.change.toFixed(2)}%`,
                          color: (s: Stock) =>
                            s.change >= 0 ? "text-chart-positive" : "text-chart-negative",
                        },
                        {
                          label: "القيمة السوقية",
                          format: (s: Stock) =>
                            s.marketCap >= 1000
                              ? `${(s.marketCap / 1000).toFixed(1)}B MAD`
                              : `${s.marketCap.toFixed(0)}M MAD`,
                        },
                        { label: "القطاع", format: (s: Stock) => s.sector },
                      ].map((row) => (
                        <tr key={row.label} className="hover:bg-secondary/20">
                          <td className="text-right text-sm text-muted-foreground px-6 py-4">
                            {row.label}
                          </td>
                          {selectedStocks.map((stock) => (
                            <td
                              key={stock.symbol}
                              className={`text-center text-sm font-medium px-6 py-4 ${
                                row.color ? row.color(stock) : "text-foreground"
                              }`}
                            >
                              {row.format(stock)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            </div>
          )}

          {/* Empty State */}
          {selectedStocks.length < 2 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <ArrowLeftRight className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2">
                اختر سهمين على الأقل للمقارنة
              </h2>
              <p className="text-muted-foreground mb-6">
                أضف الأسهم التي تريد مقارنتها باستخدام زر "إضافة سهم"
              </p>
              <Button onClick={() => setShowSearch(true)}>
                <Plus className="w-4 h-4 ml-2" />
                إضافة سهم
              </Button>
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default StockCompare;
