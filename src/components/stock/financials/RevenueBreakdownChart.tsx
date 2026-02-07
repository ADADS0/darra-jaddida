 import { useState } from "react";
 import { motion } from "framer-motion";
 import { Info, ChevronDown, ChevronUp } from "lucide-react";
 import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
 import { Tooltip as UITooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
 
 interface BreakdownItem {
   name: string;
   value: number;
   color: string;
   subItems?: { name: string; value: number; color?: string }[];
 }
 
 interface RevenueBreakdownChartProps {
   title: string;
   data: BreakdownItem[];
   totalLabel?: string;
   totalValue?: number;
   tooltip?: string;
 }
 
 const RevenueBreakdownChart = ({ 
   title, 
   data, 
   totalLabel = "الإجمالي",
   totalValue,
   tooltip 
 }: RevenueBreakdownChartProps) => {
   const [activeIndex, setActiveIndex] = useState<number | null>(null);
   const [showDetails, setShowDetails] = useState(false);
 
   const total = totalValue || data.reduce((sum, item) => sum + item.value, 0);
 
   // Flatten sub-items for inner ring
   const innerData = data.flatMap(item => 
     item.subItems ? item.subItems : [{ name: item.name, value: item.value, color: item.color }]
   );
 
   const CustomTooltipContent = ({ active, payload }: any) => {
     if (active && payload && payload.length) {
       const data = payload[0].payload;
       const percentage = ((data.value / total) * 100).toFixed(1);
       return (
         <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
           <p className="font-medium text-foreground">{data.name}</p>
           <p className="text-sm text-muted-foreground">
             {data.value.toLocaleString()} MAD ({percentage}%)
           </p>
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
       <div className="flex items-center justify-between mb-4">
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
       </div>
 
       <div className="relative h-64">
         <ResponsiveContainer width="100%" height="100%">
           <PieChart>
             {/* Outer ring - main categories */}
             <Pie
               data={data}
               cx="50%"
               cy="50%"
               innerRadius={60}
               outerRadius={80}
               paddingAngle={2}
               dataKey="value"
               onMouseEnter={(_, index) => setActiveIndex(index)}
               onMouseLeave={() => setActiveIndex(null)}
             >
               {data.map((entry, index) => (
                 <Cell 
                   key={`cell-${index}`} 
                   fill={entry.color}
                   opacity={activeIndex === null || activeIndex === index ? 1 : 0.5}
                   stroke="hsl(var(--card))"
                   strokeWidth={2}
                 />
               ))}
             </Pie>
             
             {/* Inner ring - sub-categories */}
             {innerData.length > data.length && (
               <Pie
                 data={innerData}
                 cx="50%"
                 cy="50%"
                 innerRadius={35}
                 outerRadius={55}
                 paddingAngle={1}
                 dataKey="value"
               >
                 {innerData.map((entry, index) => (
                   <Cell 
                     key={`inner-cell-${index}`} 
                     fill={entry.color}
                     opacity={0.8}
                     stroke="hsl(var(--card))"
                     strokeWidth={1}
                   />
                 ))}
               </Pie>
             )}
             
             <Tooltip content={<CustomTooltipContent />} />
           </PieChart>
         </ResponsiveContainer>
 
         {/* Center label */}
         <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
           <p className="text-lg font-bold text-foreground">
             {(total / 1000).toFixed(1)}B
           </p>
           <p className="text-xs text-muted-foreground">{totalLabel}</p>
         </div>
       </div>
 
       {/* Legend with details toggle */}
       <div className="mt-4 space-y-2">
         {(showDetails ? data : data.slice(0, 4)).map((item, index) => (
           <div key={index} className="flex items-center justify-between py-1 px-2 rounded-lg hover:bg-secondary/30 transition-colors">
             <div className="flex items-center gap-2">
               <div 
                 className="w-3 h-3 rounded-sm" 
                 style={{ backgroundColor: item.color }}
               />
               <span className="text-sm text-muted-foreground">{item.name}</span>
             </div>
             <div className="flex items-center gap-2">
               <span className="text-sm font-medium text-foreground">
                 {item.value.toLocaleString()} M
               </span>
               <span className="text-xs text-muted-foreground">
                 ({((item.value / total) * 100).toFixed(1)}%)
               </span>
             </div>
           </div>
         ))}
         
         {data.length > 4 && (
           <button
             onClick={() => setShowDetails(!showDetails)}
             className="w-full flex items-center justify-center gap-1 py-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
           >
             {showDetails ? (
               <>
                 <ChevronUp className="w-4 h-4" />
                 عرض أقل
               </>
             ) : (
               <>
                 <ChevronDown className="w-4 h-4" />
                 عرض الكل ({data.length - 4} أخرى)
               </>
             )}
           </button>
         )}
       </div>
     </motion.div>
   );
 };
 
 export default RevenueBreakdownChart;