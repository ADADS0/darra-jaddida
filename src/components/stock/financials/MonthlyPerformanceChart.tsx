 import { useState } from "react";
 import { motion } from "framer-motion";
 import { Info } from "lucide-react";
 import { ComposedChart, Bar, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend, Area } from "recharts";
 import { Tooltip as UITooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
 
 interface MonthlyData {
   month: string;
   performance: number;
   target: number;
   change: number;
 }
 
 interface MonthlyPerformanceChartProps {
   title: string;
   data: MonthlyData[];
   tooltip?: string;
 }
 
 const MonthlyPerformanceChart = ({ title, data, tooltip }: MonthlyPerformanceChartProps) => {
   const [activeView, setActiveView] = useState<"all" | "q1" | "q2" | "q3" | "q4">("all");
 
   // Filter data based on quarter
   const filterData = () => {
     switch (activeView) {
       case "q1": return data.slice(0, 3);
       case "q2": return data.slice(3, 6);
       case "q3": return data.slice(6, 9);
       case "q4": return data.slice(9, 12);
       default: return data;
     }
   };
 
   const filteredData = filterData();
 
   // Get bar color based on performance vs target
   const getBarColor = (performance: number, target: number) => {
     const diff = ((performance - target) / target) * 100;
     if (diff > 10) return "hsl(var(--chart-positive))";
     if (diff > -10) return "hsl(38 92% 50%)"; // warning/yellow
     return "hsl(var(--chart-negative))";
   };
 
   const CustomTooltipContent = ({ active, payload, label }: any) => {
     if (active && payload && payload.length) {
       const performance = payload.find((p: any) => p.dataKey === "performance");
       const target = payload.find((p: any) => p.dataKey === "target");
       const change = payload.find((p: any) => p.dataKey === "change");
       
       return (
         <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
           <p className="font-medium text-foreground mb-2">{label}</p>
           {performance && (
             <p className="text-sm text-foreground">
               الأداء: <span className="font-semibold">{performance.value}%</span>
             </p>
           )}
           {target && (
             <p className="text-sm text-muted-foreground">
               الهدف: <span className="font-semibold">{target.value}%</span>
             </p>
           )}
           {change && (
             <p className={`text-sm ${change.value >= 0 ? 'text-chart-positive' : 'text-chart-negative'}`}>
               التغيير: <span className="font-semibold">{change.value > 0 ? '+' : ''}{change.value}%</span>
             </p>
           )}
         </div>
       );
     }
     return null;
   };
 
   // Custom triangle marker for change indicator
   const TriangleMarker = ({ cx, cy, payload }: any) => {
     if (!payload || typeof payload.change !== 'number') return null;
     const isPositive = payload.change >= 0;
     const color = isPositive ? "hsl(var(--chart-positive))" : "hsl(var(--chart-negative))";
     const rotation = isPositive ? 0 : 180;
     
     return (
       <g transform={`translate(${cx}, ${cy - 15})`}>
         <polygon
           points="0,-6 5,4 -5,4"
           fill={color}
           transform={`rotate(${rotation})`}
         />
         <text
           y={-12}
           textAnchor="middle"
           className="fill-muted-foreground text-[10px]"
         >
           {payload.change > 0 ? '+' : ''}{payload.change}%
         </text>
       </g>
     );
   };
 
   return (
     <motion.div
       initial={{ opacity: 0, y: 20 }}
       animate={{ opacity: 1, y: 0 }}
       transition={{ duration: 0.5 }}
       className="bg-card rounded-2xl border border-border p-6"
     >
       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
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
 
         {/* Quarter filter */}
         <div className="flex gap-1 p-1 bg-secondary rounded-lg">
           {[
             { key: "all", label: "الكل" },
             { key: "q1", label: "R1" },
             { key: "q2", label: "R2" },
             { key: "q3", label: "R3" },
             { key: "q4", label: "R4" },
           ].map((item) => (
             <button
               key={item.key}
               onClick={() => setActiveView(item.key as typeof activeView)}
               className={`px-3 py-1 text-xs rounded-md transition-colors ${
                 activeView === item.key
                   ? "bg-primary text-primary-foreground"
                   : "text-muted-foreground hover:text-foreground"
               }`}
             >
               {item.label}
             </button>
           ))}
         </div>
       </div>
 
       <div className="h-72">
         <ResponsiveContainer width="100%" height="100%">
           <ComposedChart data={filteredData} barGap={8}>
             <XAxis
               dataKey="month"
               axisLine={false}
               tickLine={false}
               tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
               angle={-45}
               textAnchor="end"
               height={50}
             />
             <YAxis
               axisLine={false}
               tickLine={false}
               tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
               tickFormatter={(value) => `${value}%`}
               domain={[0, 100]}
             />
             <Tooltip content={<CustomTooltipContent />} />
             
             {/* Target line with dashed style and fill */}
             <Area
               type="monotone"
               dataKey="target"
               stroke="hsl(var(--muted-foreground))"
               strokeWidth={1}
               strokeDasharray="5 5"
               fill="hsl(var(--secondary) / 0.3)"
               fillOpacity={0.3}
             />
             
             {/* Performance bars with dynamic colors */}
             <Bar
               dataKey="performance"
               radius={[4, 4, 0, 0]}
               maxBarSize={40}
             >
               {filteredData.map((entry, index) => (
                 <motion.rect
                   key={`bar-${index}`}
                   initial={{ height: 0 }}
                   animate={{ height: "100%" }}
                   transition={{ duration: 0.5, delay: index * 0.05 }}
                   fill={getBarColor(entry.performance, entry.target)}
                 />
               ))}
             </Bar>
             
             {/* Change indicator line with triangle markers */}
             <Line
               type="linear"
               dataKey="change"
               stroke="transparent"
               dot={<TriangleMarker />}
               activeDot={false}
             />
           </ComposedChart>
         </ResponsiveContainer>
       </div>
 
       {/* Legend */}
       <div className="flex flex-wrap justify-center gap-4 mt-4 pt-4 border-t border-border">
         <div className="flex items-center gap-2">
           <div className="w-4 h-3 rounded-sm bg-chart-positive" />
           <span className="text-xs text-muted-foreground">أعلى من الهدف</span>
         </div>
         <div className="flex items-center gap-2">
           <div className="w-4 h-3 rounded-sm" style={{ backgroundColor: "hsl(38 92% 50%)" }} />
           <span className="text-xs text-muted-foreground">قريب من الهدف</span>
         </div>
         <div className="flex items-center gap-2">
           <div className="w-4 h-3 rounded-sm bg-chart-negative" />
           <span className="text-xs text-muted-foreground">أقل من الهدف</span>
         </div>
         <div className="flex items-center gap-2">
           <div className="w-8 border-t-2 border-dashed border-muted-foreground" />
           <span className="text-xs text-muted-foreground">الهدف</span>
         </div>
       </div>
     </motion.div>
   );
 };
 
 export default MonthlyPerformanceChart;