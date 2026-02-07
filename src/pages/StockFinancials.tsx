import { useState, Suspense, lazy } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Download, RefreshCw, ChevronDown } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { useStockData } from "@/hooks/useStockData";
import { useStockFinancials } from "@/hooks/useStockFinancials";
import { Skeleton } from "@/components/ui/skeleton";
import { getStockLogoUrl } from "@/lib/stockLogos";
import LazyChart from "@/components/ui/LazyChart";

// Import new financial components
import FinancialGauge from "@/components/stock/financials/FinancialGauge";
import RevenueBreakdownChart from "@/components/stock/financials/RevenueBreakdownChart";
import MonthlyPerformanceChart from "@/components/stock/financials/MonthlyPerformanceChart";
import CashFlowWaterfall from "@/components/stock/financials/CashFlowWaterfall";
import MultiAxisChart from "@/components/stock/financials/MultiAxisChart";
import BalanceSheetChart from "@/components/stock/financials/BalanceSheetChart";
import HorizontalBarRanking from "@/components/stock/financials/HorizontalBarRanking";
import ScatterQuadrantChart from "@/components/stock/financials/ScatterQuadrantChart";
import FinancialDataTable from "@/components/stock/financials/FinancialDataTable";

// Lazy load the existing StockFinancials component
const StockFinancials = lazy(() => import("@/components/stock/StockFinancials"));

const StockFinancialsPage = () => {
   const { symbol } = useParams<{ symbol: string }>();
  const { data, isLoading: stockLoading, error, refetch, isRefetching } = useStockData();
  const { data: financials, isLoading: financialsLoading } = useStockFinancials(symbol || "");
  const [activeSection, setActiveSection] = useState<string>("overview");

  const isLoading = stockLoading || financialsLoading;
  const stock = data?.stocks.find(s => s.symbol.toUpperCase() === symbol?.toUpperCase());
  const logoUrl = getStockLogoUrl(symbol?.toUpperCase() || "");
 
   const sections = [
     { id: "overview", label: "نظرة عامة" },
     { id: "income", label: "قائمة الدخل" },
     { id: "balance", label: "الميزانية" },
     { id: "cashflow", label: "التدفقات النقدية" },
     { id: "analysis", label: "التحليل" },
   ];
 
   if (isLoading) {
     return (
       <div className="min-h-screen bg-background" dir="rtl">
         <Header />
         <main className="pt-20 pb-16">
           <div className="container mx-auto px-4">
             <Skeleton className="h-8 w-48 mb-6" />
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
               {[1, 2, 3, 4].map(i => (
                 <Skeleton key={i} className="h-80 rounded-2xl" />
               ))}
             </div>
           </div>
         </main>
       </div>
     );
   }
 
   if (error || !stock) {
     return (
       <div className="min-h-screen bg-background" dir="rtl">
         <Header />
         <main className="pt-20 pb-16">
           <div className="container mx-auto px-4 text-center">
             <h1 className="text-2xl font-bold text-foreground mb-4">
               {error ? "حدث خطأ" : `لم يتم العثور على السهم: ${symbol}`}
             </h1>
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
     <div className="min-h-screen bg-background" dir="rtl">
       <Header />
       
       <main className="pt-20 pb-16">
         <div className="container mx-auto px-4">
           {/* Breadcrumb & Header */}
           <motion.div
             initial={{ opacity: 0, y: -10 }}
             animate={{ opacity: 1, y: 0 }}
             className="mb-6"
           >
             <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
               <Link to="/" className="hover:text-foreground transition-colors">الرئيسية</Link>
               <span>/</span>
               <Link to="/markets" className="hover:text-foreground transition-colors">الأسواق</Link>
               <span>/</span>
               <Link to={`/stock/${symbol}`} className="hover:text-foreground transition-colors">{symbol}</Link>
               <span>/</span>
               <span className="text-foreground">التحليل المالي</span>
             </div>
 
             <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
               <div className="flex items-center gap-4">
                 {logoUrl && (
                   <img 
                     src={logoUrl} 
                     alt={stock.symbol}
                     className="w-12 h-12 rounded-xl bg-white p-2 object-contain"
                     onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                   />
                 )}
                 <div>
                   <h1 className="text-2xl font-bold text-foreground">{stock.name}</h1>
                   <p className="text-sm text-muted-foreground">{stock.symbol} • التحليل المالي المفصل</p>
                 </div>
               </div>
 
               <div className="flex items-center gap-2">
                 <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isRefetching}>
                   <RefreshCw className={`w-4 h-4 ml-2 ${isRefetching ? 'animate-spin' : ''}`} />
                   تحديث
                 </Button>
                 <Button variant="outline" size="sm">
                   <Download className="w-4 h-4 ml-2" />
                   تصدير PDF
                 </Button>
                 <Link to={`/stock/${symbol}`}>
                   <Button variant="ghost" size="sm">
                     <ArrowLeft className="w-4 h-4 ml-2" />
                     العودة للملف
                   </Button>
                 </Link>
               </div>
             </div>
           </motion.div>
 
           {/* Section Navigation */}
           <motion.div
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             className="flex flex-wrap gap-2 mb-8 p-2 bg-card rounded-xl border border-border"
           >
             {sections.map((section) => (
               <button
                 key={section.id}
                 onClick={() => setActiveSection(section.id)}
                 className={`px-4 py-2 text-sm rounded-lg transition-all ${
                   activeSection === section.id
                     ? "bg-primary text-primary-foreground"
                     : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                 }`}
               >
                 {section.label}
               </button>
             ))}
           </motion.div>
 
           {/* Content Sections */}
           {activeSection === "overview" && (
             <div className="space-y-6">
               {/* Row 1: Gauges */}
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <FinancialGauge
                   title="مؤشر الصحة المالية"
                    value={financials?.gauges?.health ?? 65}
                    maxValue={100}
                    sections={[
                      { label: "جيد", value: 40, color: "hsl(var(--chart-positive))" },
                      { label: "متوسط", value: 30, color: "hsl(38 92% 50%)" },
                      { label: "خطر", value: 30, color: "hsl(var(--chart-negative))" },
                    ]}
                    tooltip="مؤشر شامل يقيس الصحة المالية بناءً على السيولة والربحية والملاءة المالية"
                  />
                  <FinancialGauge
                    title="مؤشر المخاطر"
                    value={financials?.gauges?.risk ?? 40}
                    maxValue={100}
                    sections={[
                      { label: "منخفض", value: 33, color: "hsl(var(--chart-positive))" },
                      { label: "متوسط", value: 34, color: "hsl(38 92% 50%)" },
                      { label: "مرتفع", value: 33, color: "hsl(var(--chart-negative))" },
                    ]}
                    tooltip="مستوى المخاطر الاستثمارية بناءً على التقلبات والرافعة المالية"
                  />
                  <FinancialGauge
                    title="مؤشر النمو"
                    value={financials?.gauges?.growth ?? 55}
                   maxValue={100}
                   sections={[
                     { label: "ضعيف", value: 33, color: "hsl(var(--chart-negative))" },
                     { label: "معتدل", value: 34, color: "hsl(38 92% 50%)" },
                     { label: "قوي", value: 33, color: "hsl(var(--chart-positive))" },
                   ]}
                   tooltip="إمكانية النمو المستقبلي بناءً على الاتجاهات التاريخية وظروف السوق"
                 />
               </div>
 
               {/* Row 2: Multi-axis chart & Revenue breakdown */}
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <MultiAxisChart
                   title="الأداء المالي السنوي"
                   data={financials.yearlyData}
                   tooltip="مقارنة الإيرادات وصافي الربح مع هوامش الربحية والنمو"
                 />
                 <RevenueBreakdownChart
                   title="توزيع الإيرادات حسب القطاع"
                   data={financials.revenueBreakdown}
                   tooltip="تفصيل مصادر الإيرادات حسب خطوط الأعمال المختلفة"
                 />
               </div>
 
               {/* Existing StockFinancials component */}
               <LazyChart height="min-h-[350px]" delay={200}>
                 <Suspense fallback={<Skeleton className="h-full w-full rounded-xl" />}>
                   <StockFinancials />
                 </Suspense>
               </LazyChart>
             </div>
           )}
 
           {activeSection === "income" && (
             <div className="space-y-6">
               <MonthlyPerformanceChart
                 title="الأداء الشهري مقارنة بالأهداف"
                 data={financials.monthlyData}
                 tooltip="مقارنة الأداء الفعلي بالأهداف المحددة لكل شهر"
               />
               
               <FinancialDataTable
                 title="قائمة الدخل التفصيلية"
                 years={["2020", "2021", "2022", "2023", "2024"]}
                 data={financials.incomeStatement}
                 tooltip="البيانات المالية السنوية مع مقارنة التغير السنوي"
               />
             </div>
           )}
 
           {activeSection === "balance" && (
             <div className="space-y-6">
               <BalanceSheetChart
                 title="تطور الميزانية العمومية"
                 data={financials.balanceSheet}
                 tooltip="تطور الأصول والالتزامات وحقوق المساهمين عبر السنوات"
               />
 
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <HorizontalBarRanking
                   title="توزيع المساهمين"
                   data={financials.shareholders}
                   unit="%"
                   maxValue={35}
                   tooltip="أكبر المساهمين في رأس مال الشركة"
                 />
                 <RevenueBreakdownChart
                   title="هيكل الأصول"
                   data={[
                     { name: "الأصول الثابتة", value: 72000, color: "hsl(217 91% 60%)" },
                     { name: "الأصول المتداولة", value: 35000, color: "hsl(160 84% 39%)" },
                     { name: "الاستثمارات", value: 25000, color: "hsl(38 92% 50%)" },
                     { name: "أخرى", value: 13000, color: "hsl(280 70% 50%)" },
                   ]}
                   totalLabel="إجمالي الأصول"
                   tooltip="توزيع أصول الشركة حسب النوع"
                 />
               </div>
             </div>
           )}
 
           {activeSection === "cashflow" && (
             <div className="space-y-6">
               <CashFlowWaterfall
                 title="تحليل التدفقات النقدية (Waterfall)"
                 data={financials.cashFlow}
                 tooltip="تفصيل مصادر واستخدامات النقد من صافي الربح إلى التدفق الحر"
               />
 
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                 <FinancialGauge
                   title="تغطية خدمة الدين"
                    value={financials?.gauges?.debtCoverage ?? 2.2}
                    maxValue={5}
                    unit="x"
                    sections={[
                      { label: "ضعيف", value: 1, color: "hsl(var(--chart-negative))" },
                      { label: "مقبول", value: 1.5, color: "hsl(38 92% 50%)" },
                      { label: "جيد", value: 2.5, color: "hsl(var(--chart-positive))" },
                    ]}
                    tooltip="قدرة الشركة على سداد التزامات الديون من التدفقات التشغيلية"
                  />
                  <FinancialGauge
                    title="نسبة توزيع الأرباح"
                    value={financials?.gauges?.dividendPayout ?? 38}
                    maxValue={100}
                    unit="%"
                    sections={[
                      { label: "منخفض", value: 30, color: "hsl(var(--primary))" },
                      { label: "معتدل", value: 40, color: "hsl(var(--chart-positive))" },
                      { label: "مرتفع", value: 30, color: "hsl(38 92% 50%)" },
                    ]}
                    tooltip="نسبة الأرباح الموزعة على المساهمين من صافي الربح"
                  />
                  <FinancialGauge
                    title="تحويل الربح لنقد"
                    value={financials?.gauges?.cashConversion ?? 75}
                   maxValue={100}
                   unit="%"
                   sections={[
                     { label: "ضعيف", value: 33, color: "hsl(var(--chart-negative))" },
                     { label: "معتدل", value: 34, color: "hsl(38 92% 50%)" },
                     { label: "ممتاز", value: 33, color: "hsl(var(--chart-positive))" },
                   ]}
                   tooltip="نسبة التدفق النقدي التشغيلي إلى صافي الربح"
                 />
               </div>
             </div>
           )}
 
           {activeSection === "analysis" && (
             <div className="space-y-6">
               <ScatterQuadrantChart
                 title="مقارنة الأداء مع المنافسين"
                 data={financials.peerComparison}
                 xLabel="نمو الإيرادات %"
                 yLabel="هامش الربح %"
                 tooltip="موقع الشركة مقارنة بالمنافسين من حيث النمو والربحية"
               />
 
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <HorizontalBarRanking
                   title="ترتيب الإيرادات في القطاع"
                   data={[
                     { rank: 1, label: stock.symbol, value: 41200, change: 3.5 },
                     { rank: 2, label: "ATW", value: 38500, change: 2.8 },
                     { rank: 3, label: "BCP", value: 32100, change: 4.2 },
                     { rank: 4, label: "BOA", value: 28700, change: 1.5 },
                     { rank: 5, label: "CIH", value: 18900, change: 5.1 },
                   ]}
                   tooltip="ترتيب الشركات في القطاع حسب حجم الإيرادات"
                 />
                 <HorizontalBarRanking
                   title="ترتيب الربحية في القطاع"
                   data={[
                     { rank: 1, label: stock.symbol, value: 17.5, change: 2.4 },
                     { rank: 2, label: "BCP", value: 16.8, change: 1.2 },
                     { rank: 3, label: "ATW", value: 15.2, change: -0.5 },
                     { rank: 4, label: "CIH", value: 14.1, change: 3.8 },
                     { rank: 5, label: "BOA", value: 12.3, change: 0.2 },
                   ]}
                   unit="%"
                   maxValue={20}
                   tooltip="ترتيب الشركات في القطاع حسب هامش صافي الربح"
                 />
               </div>
             </div>
           )}
 
           {/* Data Source Footer */}
           <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 0.5 }}
             className="mt-8 p-4 bg-card rounded-xl border border-border"
           >
             <p className="text-xs text-muted-foreground text-center">
               المصدر: بورصة الدار البيضاء • البيانات المالية المعتمدة • آخر تحديث: 15 مارس 2024
               <br />
               <span className="text-muted-foreground/60">
                 تنويه: البيانات المعروضة للأغراض التعليمية فقط ولا تعتبر نصيحة استثمارية
               </span>
             </p>
           </motion.div>
         </div>
       </main>
 
       <Footer />
     </div>
   );
 };
 
 export default StockFinancialsPage;