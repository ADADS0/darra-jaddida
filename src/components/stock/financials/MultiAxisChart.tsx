 import { motion } from "framer-motion";
 import { Info } from "lucide-react";
 import { ComposedChart, Bar, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend, CartesianGrid } from "recharts";
 import { Tooltip as UITooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
 
 interface DataPoint {
   year: string;
   revenue: number;
   netIncome: number;
   margin: number;
   growth: number;
 }
 
 interface MultiAxisChartProps {
   title: string;
   data: DataPoint[];
   tooltip?: string;
 }
 
 const MultiAxisChart = ({ title, data, tooltip }: MultiAxisChartProps) => {
   const CustomTooltipContent = ({ active, payload, label }: any) => {
     if (active && payload && payload.length) {
       return (
         <div className="bg-card border border-border rounded-lg p-3 shadow-lg min-w-[180px]">
           <p className="font-semibold text-foreground mb-2 border-b border-border pb-2">{label}</p>
           {payload.map((entry: any, index: number) => {
             const labels: Record<string, string> = {
               revenue: "الإيرادات",
               netIncome: "صافي الربح",
               margin: "هامش الربح",
               growth: "نمو الإيرادات",
             };
             const units: Record<string, string> = {
               revenue: " B MAD",
               netIncome: " B MAD",
               margin: "%",
               growth: "%",
             };
             return (
               <div key={index} className="flex items-center justify-between gap-4 py-1">
                 <div className="flex items-center gap-2">
                   <div 
                     className="w-2.5 h-2.5 rounded-full" 
                     style={{ backgroundColor: entry.color }}
                   />
                   <span className="text-sm text-muted-foreground">{labels[entry.dataKey] || entry.dataKey}</span>
                 </div>
                 <span className="text-sm font-medium text-foreground">
                   {typeof entry.value === 'number' ? entry.value.toFixed(1) : entry.value}{units[entry.dataKey] || ''}
                 </span>
               </div>
             );
           })}
         </div>
       );
     }
     return null;
   };
 
   const CustomLegendContent = ({ payload }: any) => {
     const labels: Record<string, string> = {
       revenue: "الإيرادات",
       netIncome: "صافي الربح",
       margin: "هامش الربح %",
       growth: "نمو الإيرادات %",
     };
     
     return (
       <div className="flex flex-wrap justify-center gap-4 mt-4">
         {payload.map((entry: any, index: number) => (
           <div key={index} className="flex items-center gap-2">
             <div 
               className={`w-3 h-3 rounded-sm ${entry.type === 'line' ? 'rounded-full' : ''}`}
               style={{ backgroundColor: entry.color }}
             />
             <span className="text-xs text-muted-foreground">{labels[entry.dataKey] || entry.value}</span>
           </div>
         ))}
       </div>
     );
   };
 
   return (
     <motion.div
       initial={{ opacity: 0, y: 20 }}
       animate={{ opacity: 1, y: 0 }}
       transition={{ duration: 0.5 }}
       className="bg-card rounded-2xl border border-border p-6"
     >
       <div className="flex items-center gap-2 mb-6">
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
 
       <div className="h-80">
         <ResponsiveContainer width="100%" height="100%">
           <ComposedChart data={data} barGap={4}>
             <CartesianGrid 
               strokeDasharray="3 3" 
               stroke="hsl(var(--border))" 
               vertical={false}
             />
             <XAxis
               dataKey="year"
               axisLine={false}
               tickLine={false}
               tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
             />
             
             {/* Left Y-axis for absolute values */}
             <YAxis
               yAxisId="left"
               orientation="left"
               axisLine={false}
               tickLine={false}
               tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
               tickFormatter={(value) => `${value}B`}
               width={50}
             />
             
             {/* Right Y-axis for percentages */}
             <YAxis
               yAxisId="right"
               orientation="right"
               axisLine={false}
               tickLine={false}
               tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
               tickFormatter={(value) => `${value}%`}
               domain={[-10, 50]}
               width={50}
             />
             
             <Tooltip content={<CustomTooltipContent />} />
             <Legend content={<CustomLegendContent />} />
             
             {/* Revenue bars */}
             <Bar 
               yAxisId="left"
               dataKey="revenue" 
               fill="hsl(var(--primary))" 
               radius={[4, 4, 0, 0]}
               maxBarSize={35}
             />
             
             {/* Net Income bars */}
             <Bar 
               yAxisId="left"
               dataKey="netIncome" 
               fill="hsl(var(--chart-positive))" 
               radius={[4, 4, 0, 0]}
               maxBarSize={35}
             />
             
             {/* Margin line */}
             <Line
               yAxisId="right"
               type="monotone"
               dataKey="margin"
               stroke="hsl(38 92% 50%)"
               strokeWidth={2}
               dot={{ r: 4, fill: "hsl(38 92% 50%)" }}
               activeDot={{ r: 6 }}
             />
             
             {/* Growth line */}
             <Line
               yAxisId="right"
               type="monotone"
               dataKey="growth"
               stroke="hsl(var(--chart-line))"
               strokeWidth={2}
               strokeDasharray="5 5"
               dot={{ r: 4, fill: "hsl(var(--chart-line))" }}
               activeDot={{ r: 6 }}
             />
           </ComposedChart>
         </ResponsiveContainer>
       </div>
     </motion.div>
   );
 };
 
 export default MultiAxisChart;