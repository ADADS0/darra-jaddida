import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Star, Bell, Share2, FileText, Building2, Calendar, Coins, PieChart, Loader2 } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/landing/Footer";
import FundNAVChart from "@/components/fund/FundNAVChart";
import FundPerformance from "@/components/fund/FundPerformance";
import FundRiskMetrics from "@/components/fund/FundRiskMetrics";
import FundAllocation from "@/components/fund/FundAllocation";
import FundFees from "@/components/fund/FundFees";
import FundComparison from "@/components/fund/FundComparison";
import { useFundById } from "@/hooks/useFundData";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";

const formatLargeNumber = (num: number): string => {
  if (num >= 1e9) return (num / 1e9).toFixed(2) + " مليار";
  if (num >= 1e6) return (num / 1e6).toFixed(2) + " مليون";
  return num.toLocaleString();
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

// Default allocation data
const defaultAllocation = {
  sectors: [
    { name: "البنوك", nameEn: "Banking", weight: 35 },
    { name: "الاتصالات", nameEn: "Telecom", weight: 20 },
    { name: "العقارات", nameEn: "Real Estate", weight: 15 },
    { name: "الصناعة", nameEn: "Industry", weight: 12 },
    { name: "التأمين", nameEn: "Insurance", weight: 10 },
    { name: "أخرى", nameEn: "Other", weight: 8 },
  ],
  topHoldings: [
    { symbol: "ATW", name: "التجاري وفا بنك", weight: 12.5 },
    { symbol: "IAM", name: "اتصالات المغرب", weight: 10.2 },
    { symbol: "BCP", name: "البنك الشعبي", weight: 8.7 },
    { symbol: "LBV", name: "لافارج هولسيم", weight: 6.4 },
    { symbol: "ADI", name: "أديسينو", weight: 5.8 },
  ],
};

const FundProfile = () => {
  const { fundId } = useParams<{ fundId: string }>();
  const { fund, isLoading, error } = useFundById(fundId || "");
  const [activeTab, setActiveTab] = useState("overview");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background" dir="rtl">
        <Header />
        <main className="pt-20 pb-16">
          <div className="container mx-auto px-4">
            <Skeleton className="h-8 w-48 mb-6" />
            <Skeleton className="h-64 w-full mb-6 rounded-2xl" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Skeleton className="h-96 lg:col-span-2 rounded-2xl" />
              <Skeleton className="h-96 rounded-2xl" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !fund) {
    return (
      <div className="min-h-screen bg-background" dir="rtl">
        <Header />
        <main className="pt-20 pb-16">
          <div className="container mx-auto px-4 text-center py-20">
            <h1 className="text-2xl font-bold text-foreground mb-4">الصندوق غير موجود</h1>
            <p className="text-muted-foreground mb-6">لم نتمكن من العثور على الصندوق المطلوب</p>
            <Link to="/funds">
              <Button variant="hero">العودة لقائمة الصناديق</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Create fund object with allocation for components that need it
  const fundWithAllocation = {
    ...fund,
    allocation: defaultAllocation,
    description: `صندوق ${fund.category} يديره ${fund.manager}، يستهدف تحقيق عوائد مستدامة من خلال استثمارات متنوعة في السوق المغربي.`,
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
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
            <Link to="/funds" className="hover:text-foreground transition-colors">الصناديق</Link>
            <span>/</span>
            <span className="text-foreground">{fund.nameEn}</span>
          </motion.div>

          {/* Fund Header Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-2xl border border-border p-6 mb-6"
          >
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              {/* Fund Info */}
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                    <PieChart className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-foreground">{fund.name}</h1>
                    <p className="text-muted-foreground">{fund.nameEn}</p>
                    <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(fund.category)}`}>
                      {fund.category}
                    </span>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed mb-4">
                  {fundWithAllocation.description}
                </p>

                {/* Fund Meta */}
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Building2 className="w-4 h-4" />
                    <span>{fund.manager}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>منذ {new Date(fund.inceptionDate).getFullYear()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Coins className="w-4 h-4" />
                    <span>الحد الأدنى: {fund.minInvestment.toLocaleString()} {fund.currency}</span>
                  </div>
                </div>
              </div>

              {/* NAV & Actions */}
              <div className="flex flex-col items-end gap-4">
                <div className="text-left">
                  <p className="text-xs text-muted-foreground mb-1">صافي قيمة الأصول (NAV)</p>
                  <p className="text-3xl font-bold text-foreground">{fund.nav.toFixed(2)} {fund.currency}</p>
                  <div className={`flex items-center gap-2 ${fund.isPositive ? "text-chart-positive" : "text-chart-negative"}`}>
                    {fund.isPositive ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                    <span className="text-lg font-semibold">
                      {fund.isPositive ? "+" : ""}{fund.change.toFixed(2)} ({fund.changePercent.toFixed(2)}%)
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
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
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon">
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>مشاركة</TooltipContent>
                  </Tooltip>
                  <Button variant="hero">
                    <FileText className="w-4 h-4" />
                    تحميل التقرير
                  </Button>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-6 pt-6 border-t border-border">
              {[
                { label: "الأصول المدارة", value: formatLargeNumber(fund.aum) },
                { label: "العائد السنوي", value: `${fund.returns["1Y"] > 0 ? "+" : ""}${fund.returns["1Y"]}%` },
                { label: "التقلب", value: `${fund.risk.volatility}%` },
                { label: "نسبة شارب", value: fund.risk.sharpeRatio.toFixed(2) },
                { label: "رسوم الإدارة", value: `${fund.fees.managementFee}%` },
                { label: "المؤشر المرجعي", value: fund.benchmark },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-sm font-semibold text-foreground">{stat.value}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Tabs Navigation */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="bg-card border border-border w-full justify-start overflow-x-auto">
              <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
              <TabsTrigger value="performance">الأداء</TabsTrigger>
              <TabsTrigger value="risk">المخاطر</TabsTrigger>
              <TabsTrigger value="allocation">التوزيع</TabsTrigger>
              <TabsTrigger value="fees">الرسوم</TabsTrigger>
              <TabsTrigger value="comparison">المقارنة</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Charts */}
                <div className="lg:col-span-2 space-y-6">
                  <FundNAVChart fund={fund} />
                  <FundPerformance fund={fund} />
                </div>

                {/* Right Column - Metrics */}
                <div className="space-y-6">
                  <FundRiskMetrics fund={fund} />
                  <FundFees fund={fund} />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="performance">
              <FundPerformance fund={fund} detailed />
            </TabsContent>

            <TabsContent value="risk">
              <FundRiskMetrics fund={fund} detailed />
            </TabsContent>

            <TabsContent value="allocation">
              <FundAllocation fund={fundWithAllocation} />
            </TabsContent>

            <TabsContent value="fees">
              <FundFees fund={fund} detailed />
            </TabsContent>

            <TabsContent value="comparison">
              <FundComparison fund={fund} />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FundProfile;
