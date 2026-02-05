 import { useState } from "react";
 import { motion } from "framer-motion";
 import { Info } from "lucide-react";
 import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend, Cell } from "recharts";
 import { Tooltip as UITooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
 
 interface BalanceSheetData {
   year: string;
   assets: number;
   liabilities: number;
   equity: number;
   currentAssets: number;
   currentLiabilities: number;
   longTermDebt: number;
 }
 
 interface BalanceSheetChartProps {
   title: string;
   data: BalanceSheetData[];
   tooltip?: string;
 }
 
 const BalanceSheetChart = ({ title, data, tooltip }: BalanceSheetChartProps) => {
   const [viewMode, setViewMode] = useState<"stacked" | "grouped">("stacked");
   const [showRatios, setShowRatios] = useState(true);
 
   // Calculate key ratios for latest year
   const latestData = data[data.length - 1];
   const debtToEquity = (latestData.liabilities / latestData.equity).toFixed(2);
   const currentRatio = (latestData.currentAssets / latestData.currentLiabilities).toFixed(2);
   const debtRatio = ((latestData.liabilities / latestData.assets) * 100).toFixed(1);
 
   const CustomTooltipContent = ({ active, payload, label }: any) => {
     if (active && payload && payload.length) {
       return (
         <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
           <p className="font-semibold text-foreground mb-2">{label}</p>
           {payload.map((entry: any, index: number) => {
             const labels: Record<string, string> = {
               assets: "الأصول",
               liabilities: "الالتزامات",
               equity: "حقوق المساهمين",
             };
             return (
               <div key={index} className="flex items-center justify-between gap-4 py-0.5">
                 <div className="flex items-center gap-2">
                   <div 
                     className="w-2.5 h-2.5 rounded-sm" 
                     style={{ backgroundColor: entry.fill }}
                   />
                   <span className="text-sm text-muted-foreground">{labels[entry.dataKey]}</span>
                 </div>
                 <span className="text-sm font-medium text-foreground">
                   {(entry.value / 1000).toFixed(1)}B MAD
                 </span>
               </div>
             );
           })}
         </div>
       );
     }
     return null;
   };
 
   return (
     <motion.div
       initial={{ opacity: 0, y: 20 }}
       animate={{ opacity: 1, y: 0 }}
       transition={{ duration: 0.5 }}
       className="bg-card rounded-2xl border border-border p-6"
     >
       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
         <div className="flex items-center gap-2">
           <h3 className="text-base font-semibold text-foreground">{title}</h3>
           {tooltip && (
             <UITooltip>
               <TooltipTrigger>
                 <Info className="w-4 h-4 text-muted-foreground" />
               </TooltipTrigger>
               <TooltipContent className="max-w-xs">
                 <p>{tooltip}</p>
               </TooltipContent>
             </UITooltip>
           )}
         </div>
 
         <div className="flex items-center gap-2">
           <button
             onClick={() => setViewMode(viewMode === "stacked" ? "grouped" : "stacked")}
             className="px-3 py-1.5 text-xs rounded-lg bg-secondary text-muted-foreground hover:text-foreground transition-colors"
           >
             {viewMode === "stacked" ? "عرض متجاور" : "عرض مكدس"}
           </button>
         </div>
       </div>
 
       {/* Key Ratios */}
       {showRatios && (
         <div className="grid grid-cols-3 gap-3 mb-6">
           <div className="bg-secondary/50 rounded-xl p-3 text-center">
             <p className="text-xs text-muted-foreground mb-1">الدين/حقوق المساهمين</p>
             <p className={`text-lg font-bold ${parseFloat(debtToEquity) > 1 ? 'text-chart-negative' : 'text-chart-positive'}`}>
               {debtToEquity}x
             </p>
           </div>
           <div className="bg-secondary/50 rounded-xl p-3 text-center">
             <p className="text-xs text-muted-foreground mb-1">نسبة التداول</p>
             <p className={`text-lg font-bold ${parseFloat(currentRatio) < 1 ? 'text-chart-negative' : 'text-chart-positive'}`}>
               {currentRatio}x
             </p>
           </div>
           <div className="bg-secondary/50 rounded-xl p-3 text-center">
             <p className="text-xs text-muted-foreground mb-1">نسبة الدين</p>
             <p className={`text-lg font-bold ${parseFloat(debtRatio) > 50 ? 'text-warning' : 'text-chart-positive'}`}>
               {debtRatio}%
             </p>
           </div>
         </div>
       )}
 
       <div className="h-64">
         <ResponsiveContainer width="100%" height="100%">
           <BarChart data={data} barGap={viewMode === "grouped" ? 4 : 0}>
             <XAxis
               dataKey="year"
               axisLine={false}
               tickLine={false}
               tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
             />
             <YAxis
               axisLine={false}
               tickLine={false}
               tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
               tickFormatter={(value) => `${(value / 1000).toFixed(0)}B`}
             />
             <Tooltip content={<CustomTooltipContent />} />
             
             {viewMode === "stacked" ? (
               <>
                 <Bar 
                   dataKey="liabilities" 
                   stackId="a" 
                   fill="hsl(var(--chart-negative))" 
                   radius={[0, 0, 0, 0]}
                 />
                 <Bar 
                   dataKey="equity" 
                   stackId="a" 
                   fill="hsl(var(--chart-positive))" 
                   radius={[4, 4, 0, 0]}
                 />
               </>
             ) : (
               <>
                 <Bar 
                   dataKey="assets" 
                   fill="hsl(var(--primary))" 
                   radius={[4, 4, 0, 0]}
                   maxBarSize={30}
                 />
                 <Bar 
                   dataKey="liabilities" 
                   fill="hsl(var(--chart-negative))" 
                   radius={[4, 4, 0, 0]}
                   maxBarSize={30}
                 />
                 <Bar 
                   dataKey="equity" 
                   fill="hsl(var(--chart-positive))" 
                   radius={[4, 4, 0, 0]}
                   maxBarSize={30}
                 />
               </>
             )}
           </BarChart>
         </ResponsiveContainer>
       </div>
 
       {/* Legend */}
       <div className="flex flex-wrap justify-center gap-4 mt-4 pt-4 border-t border-border">
         <div className="flex items-center gap-2">
           <div className="w-3 h-3 rounded-sm bg-primary" />
           <span className="text-xs text-muted-foreground">الأصول</span>
         </div>
         <div className="flex items-center gap-2">
           <div className="w-3 h-3 rounded-sm bg-chart-negative" />
           <span className="text-xs text-muted-foreground">الالتزامات</span>
         </div>
         <div className="flex items-center gap-2">
           <div className="w-3 h-3 rounded-sm bg-chart-positive" />
           <span className="text-xs text-muted-foreground">حقوق المساهمين</span>
         </div>
       </div>
     </motion.div>
   );
 };
 
 export default BalanceSheetChart;