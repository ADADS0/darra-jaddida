 import { useState, Suspense, lazy } from "react";
 import { useParams, Link } from "react-router-dom";
 import { motion } from "framer-motion";
 import { ArrowLeft, Download, RefreshCw, ChevronDown } from "lucide-react";
 import Header from "@/components/layout/Header";
 import Footer from "@/components/landing/Footer";
 import { Button } from "@/components/ui/button";
 import { useStockData } from "@/hooks/useStockData";
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
 
 // Generate mock financial data for Moroccan companies
 const generateCompanyFinancials = (symbol: string) => {
   // Monthly performance data
   const months = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
   const monthlyData = months.map((month, i) => ({
     month,
     performance: Math.floor(Math.random() * 40) + 40,
     target: 65,
     change: Math.floor(Math.random() * 30) - 15,
   }));
 
   // Multi-year financial data
   const yearlyData = [
     { year: "2020", revenue: 35.2, netIncome: 5.8, margin: 16.5, growth: 3.2 },
     { year: "2021", revenue: 36.8, netIncome: 6.1, margin: 16.6, growth: 4.5 },
     { year: "2022", revenue: 38.5, netIncome: 6.5, margin: 16.9, growth: 4.6 },
     { year: "2023", revenue: 39.8, netIncome: 6.8, margin: 17.1, growth: 3.4 },
     { year: "2024", revenue: 41.2, netIncome: 7.2, margin: 17.5, growth: 3.5 },
   ];
 
   // Revenue breakdown by segment
   const revenueBreakdown = [
     { 
       name: "الخدمات المتنقلة", 
       value: 18500, 
       color: "hsl(217 91% 60%)",
       subItems: [
         { name: "الاشتراكات", value: 12000, color: "hsl(217 91% 70%)" },
         { name: "الدفع المسبق", value: 6500, color: "hsl(217 91% 80%)" },
       ]
     },
     { 
       name: "الإنترنت الثابت", 
       value: 12800, 
       color: "hsl(160 84% 39%)",
       subItems: [
         { name: "ADSL", value: 5800, color: "hsl(160 84% 50%)" },
         { name: "الألياف البصرية", value: 7000, color: "hsl(160 84% 60%)" },
       ]
     },
     { name: "خدمات المؤسسات", value: 6200, color: "hsl(38 92% 50%)" },
     { name: "خدمات أخرى", value: 3700, color: "hsl(280 70% 50%)" },
   ];
 
   // Cash flow waterfall
   const cashFlowData = [
     { label: "صافي الربح", value: 7200 },
     { label: "الاستهلاك", value: 5500 },
     { label: "تغير رأس المال العامل", value: -1200 },
     { label: "التدفق التشغيلي", value: 11500, isTotal: true },
     { label: "الاستثمارات", value: -4800 },
     { label: "توزيعات الأرباح", value: -3200 },
     { label: "التمويل", value: -1500 },
     { label: "التدفق الحر", value: 2000, isTotal: true },
   ];
 
   // Balance sheet data
   const balanceSheetData = [
     { year: "2020", assets: 125000, liabilities: 52000, equity: 73000, currentAssets: 28500, currentLiabilities: 18000, longTermDebt: 34000 },
     { year: "2021", assets: 130000, liabilities: 54000, equity: 76000, currentAssets: 30000, currentLiabilities: 19000, longTermDebt: 35000 },
     { year: "2022", assets: 135000, liabilities: 55000, equity: 80000, currentAssets: 31500, currentLiabilities: 19500, longTermDebt: 35500 },
     { year: "2023", assets: 140000, liabilities: 56000, equity: 84000, currentAssets: 33000, currentLiabilities: 20000, longTermDebt: 36000 },
     { year: "2024", assets: 145000, liabilities: 57000, equity: 88000, currentAssets: 35000, currentLiabilities: 20500, longTermDebt: 36500 },
   ];
 
   // Top shareholders ranking
   const shareholdersRanking = [
     { rank: 1, label: "الدولة المغربية", value: 30, change: 0 },
     { rank: 2, label: "Groupe CDG", value: 22, change: 1.5 },
     { rank: 3, label: "صندوق التقاعد", value: 15, change: -0.5 },
     { rank: 4, label: "مستثمرون مؤسسيون", value: 12, change: 2.1 },
     { rank: 5, label: "أفراد", value: 8, change: -1.2 },
     { rank: 6, label: "أجانب", value: 7, change: 0.8 },
     { rank: 7, label: "Free Float", value: 6, change: -2.7 },
   ];
 
   // Peer comparison scatter
   const peerComparison = [
     { name: symbol, x: 12, y: 18, size: 12 },
     { name: "ATW", x: 8, y: 22, size: 10 },
     { name: "BCP", x: 6, y: 15, size: 9 },
     { name: "BOA", x: -2, y: 12, size: 8 },
     { name: "CIH", x: 15, y: 8, size: 7 },
     { name: "CDM", x: -5, y: -3, size: 6 },
   ];
 
   // Income statement table data
   const incomeStatementData = [
     { label: "الإيرادات", values: [35200, 36800, 38500, 39800, 41200], isHighlighted: true },
     { label: "تكلفة المبيعات", values: [-15800, -16200, -16800, -17200, -18300] },
     { label: "الربح الإجمالي", values: [19400, 20600, 21700, 22600, 22900], isHighlighted: true },
     { label: "المصاريف الإدارية", values: [-3200, -3400, -3500, -3600, -3800] },
     { label: "مصاريف البيع والتسويق", values: [-2100, -2200, -2300, -2400, -2500] },
     { label: "مصاريف البحث والتطوير", values: [-1800, -1900, -2000, -2100, -2100] },
     { label: "EBITDA", values: [18500, 19200, 20100, 20800, 21500], isHighlighted: true, tooltip: "الأرباح قبل الفوائد والضرائب والاستهلاك والإطفاء" },
     { label: "الاستهلاك والإطفاء", values: [-6200, -6400, -6600, -6800, -7000] },
     { label: "الربح التشغيلي (EBIT)", values: [12300, 12800, 13500, 14000, 14500], isHighlighted: true },
     { label: "المصاريف المالية", values: [-2100, -2000, -1900, -1850, -1800] },
     { label: "الإيرادات المالية", values: [450, 480, 520, 550, 580] },
     { label: "الربح قبل الضريبة", values: [10650, 11280, 12120, 12700, 13280] },
     { label: "ضريبة الدخل", values: [-3200, -3380, -3640, -3810, -3980] },
     { label: "صافي الربح", values: [5800, 6100, 6500, 6800, 7200], isHighlighted: true },
   ];
 
   return {
     monthlyData,
     yearlyData,
     revenueBreakdown,
     cashFlowData,
     balanceSheetData,
     shareholdersRanking,
     peerComparison,
     incomeStatementData,
   };
 };
 
 const StockFinancialsPage = () => {
   const { symbol } = useParams<{ symbol: string }>();
   const { data, isLoading, error, refetch, isRefetching } = useStockData();
   const [activeSection, setActiveSection] = useState<string>("overview");
 
   const stock = data?.stocks.find(s => s.symbol.toUpperCase() === symbol?.toUpperCase());
   const logoUrl = getStockLogoUrl(symbol?.toUpperCase() || "");
   const financials = generateCompanyFinancials(symbol || "IAM");
 
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
                   value={72}
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
                   value={35}
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
                   value={58}
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
                 data={financials.incomeStatementData}
                 tooltip="البيانات المالية السنوية مع مقارنة التغير السنوي"
               />
             </div>
           )}
 
           {activeSection === "balance" && (
             <div className="space-y-6">
               <BalanceSheetChart
                 title="تطور الميزانية العمومية"
                 data={financials.balanceSheetData}
                 tooltip="تطور الأصول والالتزامات وحقوق المساهمين عبر السنوات"
               />
 
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <HorizontalBarRanking
                   title="توزيع المساهمين"
                   data={financials.shareholdersRanking}
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
                 data={financials.cashFlowData}
                 tooltip="تفصيل مصادر واستخدامات النقد من صافي الربح إلى التدفق الحر"
               />
 
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                 <FinancialGauge
                   title="تغطية خدمة الدين"
                   value={2.8}
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
                   value={45}
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
                   value={85}
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