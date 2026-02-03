import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  TrendingUp,
  TrendingDown,
  Trash2,
  Plus,
  Search,
  ExternalLink,
  ArrowLeftRight,
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/landing/Footer";
import { useStockData, type Stock } from "@/hooks/useStockData";
import { useWatchlist } from "@/hooks/useWatchlist";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { getStockLogoUrl } from "@/lib/stockLogos";
import { useState, useMemo } from "react";

const Watchlist = () => {
  const { user } = useAuth();
  const { data, isLoading: isStockLoading } = useStockData();
  const { watchlist, isLoading: isWatchlistLoading, removeFromWatchlist, addToWatchlist } = useWatchlist();
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const watchlistStocks = useMemo(() => {
    if (!data?.stocks) return [];
    return watchlist
      .map((symbol) => data.stocks.find((s) => s.symbol === symbol))
      .filter(Boolean) as Stock[];
  }, [data, watchlist]);

  const filteredStocks = useMemo(() => {
    if (!data?.stocks || !searchTerm) return [];
    return data.stocks
      .filter(
        (s) =>
          !watchlist.includes(s.symbol) &&
          (s.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.nameEn.toLowerCase().includes(searchTerm.toLowerCase()))
      )
      .slice(0, 8);
  }, [data, searchTerm, watchlist]);

  const isLoading = isStockLoading || isWatchlistLoading;

  if (!user) {
    return (
      <div className="min-h-screen bg-background" dir="rtl">
        <Header />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 text-center py-16">
            <Star className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-foreground mb-2">قائمة المفضلة</h1>
            <p className="text-muted-foreground mb-6">
              يجب تسجيل الدخول للوصول لقائمة المفضلة الخاصة بك
            </p>
            <Link to="/auth">
              <Button className="bg-primary hover:bg-primary/90">تسجيل الدخول</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background" dir="rtl">
        <Header />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4">
            <Skeleton className="h-10 w-64 mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-36 rounded-xl" />
              ))}
            </div>
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
            <span className="text-foreground">قائمة المفضلة</span>
          </motion.div>

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">قائمة المفضلة</h1>
              <p className="text-muted-foreground">
                {watchlistStocks.length} سهم في قائمتك
              </p>
            </div>

            <div className="flex gap-3">
              {watchlistStocks.length >= 2 && (
                <Link
                  to={`/compare?symbols=${watchlistStocks.map((s) => s.symbol).slice(0, 4).join(",")}`}
                >
                  <Button variant="outline">
                    <ArrowLeftRight className="w-4 h-4 ml-2" />
                    مقارنة الأسهم
                  </Button>
                </Link>
              )}
              <Button
                onClick={() => setShowSearch(true)}
                className="bg-primary hover:bg-primary/90"
              >
                <Plus className="w-4 h-4 ml-2" />
                إضافة سهم
              </Button>
            </div>
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
                      placeholder="ابحث عن سهم لإضافته..."
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
                          onClick={() => {
                            addToWatchlist(stock.symbol);
                            setSearchTerm("");
                          }}
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
                          <Plus className="w-4 h-4 text-primary" />
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

          {/* Watchlist Grid */}
          {watchlistStocks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {watchlistStocks.map((stock, index) => {
                const logoUrl = getStockLogoUrl(stock.symbol);
                return (
                  <motion.div
                    key={stock.symbol}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-card rounded-xl border border-border p-5 group hover:border-primary/50 transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {logoUrl ? (
                          <img
                            src={logoUrl}
                            alt={stock.symbol}
                            className="w-12 h-12 rounded-xl bg-white p-1 object-contain"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-foreground font-bold">
                            {stock.symbol.slice(0, 2)}
                          </div>
                        )}
                        <div>
                          <h3 className="font-bold text-foreground">{stock.symbol}</h3>
                          <p className="text-xs text-muted-foreground truncate max-w-[120px]">
                            {stock.nameEn}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromWatchlist(stock.symbol)}
                        className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-end justify-between mb-4">
                      <div>
                        <p className="text-2xl font-bold text-foreground">
                          {stock.price.toFixed(2)}
                        </p>
                        <p className="text-xs text-muted-foreground">MAD</p>
                      </div>
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

                    <div className="pt-4 border-t border-border flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{stock.sector}</span>
                      <Link
                        to={`/stock/${stock.symbol}`}
                        className="flex items-center gap-1 text-xs text-primary hover:underline"
                      >
                        عرض التفاصيل
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <Star className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2">
                قائمة المفضلة فارغة
              </h2>
              <p className="text-muted-foreground mb-6">
                أضف أسهمك المفضلة لمتابعتها بسهولة
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

export default Watchlist;
