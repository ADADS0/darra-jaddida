import { useState, Suspense, lazy } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Star, Bell, FileText, RefreshCw } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/landing/Footer";
import StockBanner from "@/components/stock/StockBanner";
import TradingViewWidget from "@/components/stock/TradingViewWidget";
import StockMetrics from "@/components/stock/StockMetrics";
import StockFilings from "@/components/stock/StockFilings";
import StockSocialShare from "@/components/stock/StockSocialShare";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useStockData } from "@/hooks/useStockData";
import { useWatchlist } from "@/hooks/useWatchlist";
import { Skeleton } from "@/components/ui/skeleton";
import { getStockLogoUrl } from "@/lib/stockLogos";
import LazyChart from "@/components/ui/LazyChart";

// Lazy load heavy chart components
const StockPriceChart = lazy(() => import("@/components/stock/StockPriceChart"));
const StockFinancials = lazy(() => import("@/components/stock/StockFinancials"));
const StockRiskIndicators = lazy(() => import("@/components/stock/StockRiskIndicators"));
const StockSectorComparison = lazy(() => import("@/components/stock/StockSectorComparison"));
const StockTechnicalIndicators = lazy(() => import("@/components/stock/StockTechnicalIndicators"));
const StockProjection = lazy(() => import("@/components/stock/StockProjection"));
const StockInfoBase = lazy(() => import("@/components/stock/StockInfoBase"));

// Extended stock data with additional metrics
const stockDescriptions: Record<string, string> = {
  IAM: "اتصالات المغرب هي شركة الاتصالات الرائدة في المغرب وأفريقيا، تأسست عام 1998. تقدم خدمات الهاتف الثابت والمحمول والإنترنت.",
  ATW: "التجاري وفا بنك هو أكبر بنك في المغرب وثاني أكبر مجموعة مصرفية في أفريقيا، يقدم خدمات مصرفية وتأمينية ومالية متنوعة.",
  BCP: "البنك الشعبي المركزي هو مجموعة بنكية تعاونية رائدة في المغرب، تقدم خدمات مصرفية متنوعة للأفراد والشركات.",
  BOA: "بنك أفريقيا هو مجموعة بنكية مغربية ذات حضور قوي في أفريقيا، متخصص في الخدمات المصرفية للأفراد والشركات.",
  CIH: "CIH بنك هو بنك مغربي متخصص أصلاً في التمويل العقاري، توسع ليشمل جميع الخدمات المصرفية.",
  LBV: "لابيل في هي سلسلة التوزيع الكبرى الرائدة في المغرب، تدير العديد من المتاجر الكبرى والسوبر ماركت.",
  MNG: "مناجم هي شركة تعدين مغربية رائدة، متخصصة في استخراج المعادن الثمينة والمعادن الأساسية.",
  HPS: "HPS هي شركة تكنولوجيا مغربية متخصصة في حلول الدفع الإلكتروني والبطاقات البنكية.",
  TQM: "تاقة موروكو هي شركة طاقة مغربية متخصصة في إنتاج الكهرباء من مصادر متنوعة.",
  CSR: "كوسومار هي الشركة الرائدة في صناعة السكر في المغرب، تسيطر على معظم السوق المحلي.",
};

const StockProfile = () => {
  const { symbol } = useParams<{ symbol: string }>();
  const { data, isLoading, error, refetch, isRefetching } = useStockData();
  
  // Key prop pattern - reset state when symbol changes
  const stockKey = symbol?.toUpperCase() || "";
  const [chartType, setChartType] = useState<"custom" | "tradingview">("custom");

  // Find stock from API data
  const stock = data?.stocks.find(s => s.symbol.toUpperCase() === symbol?.toUpperCase());
  const logoUrl = getStockLogoUrl(symbol?.toUpperCase() || "");
  
  // Generate additional metrics for the stock
  const stockWithMetrics = stock ? {
    symbol: stock.symbol,
    name: stock.name,
    nameEn: stock.nameEn,
    sector: stock.sector,
    sectorEn: stock.sectorEn,
    price: stock.price,
    change: stock.change,
    changePercent: stock.change,
    isPositive: stock.change > 0,
    open: stock.price * (1 - Math.random() * 0.02),
    high: stock.price * (1 + Math.random() * 0.02),
    low: stock.price * (1 - Math.random() * 0.03),
    volume: Math.floor(Math.random() * 500000) + 50000,
    avgVolume: Math.floor(Math.random() * 400000) + 100000,
    marketCap: `${stock.marketCap}M MAD`,
    freeFloat: `${Math.floor(Math.random() * 30) + 10}%`,
    sharesOutstanding: `${Math.floor(Math.random() * 500) + 50}M`,
    dividend: Math.random() * 10 + 2,
    dividendYield: Math.random() * 5 + 1,
    per: Math.random() * 20 + 5,
    pb: Math.random() * 3 + 0.5,
    evEbitda: Math.random() * 12 + 4,
    roe: Math.random() * 25 + 5,
    debtToEquity: Math.random() * 2,
    currentRatio: Math.random() * 1.5 + 0.5,
    description: stockDescriptions[stock.symbol] || `${stock.nameEn} هي شركة مغربية مدرجة في بورصة الدار البيضاء في قطاع ${stock.sector}.`,
  } : null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background" dir="rtl">
        <Header />
        <main className="pt-20 pb-16">
          <div className="container mx-auto px-4">
            <Skeleton className="h-8 w-48 mb-6" />
            <Skeleton className="h-32 w-full rounded-2xl mb-6" />
            <Skeleton className="h-64 w-full rounded-2xl mb-6" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Skeleton className="lg:col-span-2 h-96 rounded-2xl" />
              <Skeleton className="h-96 rounded-2xl" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !stockWithMetrics) {
    return (
      <div className="min-h-screen bg-background" dir="rtl">
        <Header />
        <main className="pt-20 pb-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">
              {error ? "حدث خطأ" : `لم يتم العثور على السهم: ${symbol}`}
            </h1>
            <p className="text-muted-foreground mb-6">
              {error ? "تعذر تحميل بيانات السهم" : "تأكد من صحة رمز السهم"}
            </p>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => refetch()}>
                <RefreshCw className="w-4 h-4 ml-2" />
                إعادة المحاولة
              </Button>
              <Link to="/markets">
                <Button variant="outline">العودة للأسواق</Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div key={stockKey} className="min-h-screen bg-background" dir="rtl">
      <Header />
      
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-sm text-muted-foreground mb-6"
          >
            <Link to="/" className="hover:text-foreground transition-colors">الرئيسية</Link>
            <span>/</span>
            <Link to="/markets" className="hover:text-foreground transition-colors">الأسواق</Link>
            <span>/</span>
            <span className="text-foreground">{stockWithMetrics.symbol}</span>
          </motion.div>

          {/* Stock Banner with Logo */}
          <StockBanner stock={stockWithMetrics} logoUrl={logoUrl} />

          {/* Price & Actions Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-card rounded-2xl border border-border p-6 mb-6"
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              {/* Price Info */}
              <div className="flex items-center gap-6">
                {logoUrl && (
                  <img 
                    src={logoUrl} 
                    alt={stockWithMetrics.symbol}
                    className="w-16 h-16 rounded-xl bg-white p-2 object-contain hidden md:block"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                )}
                <div>
                  <p className="text-3xl font-bold text-foreground">{stockWithMetrics.price.toFixed(2)} MAD</p>
                  <div className={`flex items-center gap-2 ${stockWithMetrics.isPositive ? "text-chart-positive" : "text-chart-negative"}`}>
                    {stockWithMetrics.isPositive ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                    <span className="text-lg font-semibold">
                      {stockWithMetrics.isPositive ? "+" : ""}{stockWithMetrics.change.toFixed(2)}%
                    </span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground max-w-xl leading-relaxed hidden md:block border-r border-border pr-6">
                  {stockWithMetrics.description}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 flex-wrap">
                <StockSocialShare stock={stockWithMetrics} />
                
                <div className="h-8 w-px bg-border hidden sm:block" />
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => refetch()}
                    disabled={isRefetching}
                  >
                    <RefreshCw className={`w-4 h-4 ${isRefetching ? 'animate-spin' : ''}`} />
                  </Button>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon">
                        <Star className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>إضافة للمفضلة</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon">
                        <Bell className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>إنشاء تنبيه</TooltipContent>
                  </Tooltip>
                  <Button variant="default" className="bg-primary hover:bg-primary/90">
                    <FileText className="w-4 h-4" />
                    تحميل التقرير
                  </Button>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mt-6 pt-6 border-t border-border">
              {[
                { label: "الافتتاح", value: stockWithMetrics.open.toFixed(2) },
                { label: "الأعلى", value: stockWithMetrics.high.toFixed(2) },
                { label: "الأدنى", value: stockWithMetrics.low.toFixed(2) },
                { label: "الحجم", value: (stockWithMetrics.volume / 1000).toFixed(0) + "K" },
                { label: "متوسط الحجم", value: (stockWithMetrics.avgVolume / 1000).toFixed(0) + "K" },
                { label: "القيمة السوقية", value: stockWithMetrics.marketCap },
                { label: "Free Float", value: stockWithMetrics.freeFloat },
                { label: "العائد", value: stockWithMetrics.dividendYield.toFixed(1) + "%" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-sm font-semibold text-foreground">{stat.value}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Charts & Financials */}
            <div className="lg:col-span-2 space-y-6">
              {/* Chart Type Toggle */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-card rounded-2xl border border-border p-4"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-foreground">الرسم البياني</h3>
                  <div className="flex items-center gap-1 p-1 bg-secondary rounded-xl">
                    <button
                      onClick={() => setChartType("custom")}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        chartType === "custom"
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                        <path d="M3 17h2v4H3v-4zm6-8h2v12H9V9zm6 4h2v8h-2v-8zm6-8h2v16h-2V5z"/>
                      </svg>
                      رسم بياني
                    </button>
                    <button
                      onClick={() => setChartType("tradingview")}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        chartType === "tradingview"
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <svg viewBox="0 0 36 28" className="w-4 h-4 fill-current">
                        <path d="M14 22H7V11H0V4h14v18zM28 22h-8l7.5-18h8L28 22z" />
                      </svg>
                      TradingView
                    </button>
                  </div>
                </div>

                {/* Chart Display with Lazy Loading */}
                <LazyChart height="min-h-[420px]" delay={100}>
                  <Suspense fallback={<Skeleton className="h-full w-full rounded-xl" />}>
                    {chartType === "custom" ? (
                      <StockPriceChart stock={stockWithMetrics} embedded />
                    ) : (
                      <TradingViewWidget symbol={stockWithMetrics.symbol} embedded />
                    )}
                  </Suspense>
                </LazyChart>
              </motion.div>
              
              {/* Progressive loading for charts */}
              <LazyChart height="min-h-[300px]" delay={300}>
                <Suspense fallback={<Skeleton className="h-full w-full rounded-xl" />}>
                  <StockTechnicalIndicators stock={stockWithMetrics} />
                </Suspense>
              </LazyChart>
              
              <LazyChart height="min-h-[400px]" delay={500}>
                <Suspense fallback={<Skeleton className="h-full w-full rounded-xl" />}>
                  <StockFinancials />
                </Suspense>
              </LazyChart>
              
              <LazyChart height="min-h-[350px]" delay={700}>
                <Suspense fallback={<Skeleton className="h-full w-full rounded-xl" />}>
                  <StockSectorComparison stock={stockWithMetrics} />
                </Suspense>
              </LazyChart>
            </div>

            {/* Right Column - Metrics, Risk, Filings, Projection */}
            <div className="space-y-6">
              <StockMetrics stock={stockWithMetrics} />
              
              <LazyChart height="min-h-[300px]" delay={400}>
                <Suspense fallback={<Skeleton className="h-full w-full rounded-xl" />}>
                  <StockProjection stock={stockWithMetrics} />
                </Suspense>
              </LazyChart>
              
              <LazyChart height="min-h-[250px]" delay={600}>
                <Suspense fallback={<Skeleton className="h-full w-full rounded-xl" />}>
                  <StockRiskIndicators stock={stockWithMetrics} />
                </Suspense>
              </LazyChart>
              
              <StockFilings symbol={stockWithMetrics.symbol} />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default StockProfile;
