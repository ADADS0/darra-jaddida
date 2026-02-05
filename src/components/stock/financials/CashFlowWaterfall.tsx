 import { motion } from "framer-motion";
 import { Info } from "lucide-react";
 import { Tooltip as UITooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
 
 interface WaterfallItem {
   label: string;
   value: number;
   isTotal?: boolean;
 }
 
 interface CashFlowWaterfallProps {
   title: string;
   data: WaterfallItem[];
   tooltip?: string;
 }
 
 const CashFlowWaterfall = ({ title, data, tooltip }: CashFlowWaterfallProps) => {
   // Calculate cumulative values for waterfall positioning
   let runningTotal = 0;
   const enrichedData = data.map((item, index) => {
     const start = item.isTotal ? 0 : runningTotal;
     const height = item.isTotal ? data.slice(0, index).reduce((sum, d) => sum + d.value, 0) : item.value;
     if (!item.isTotal) runningTotal += item.value;
     
     return {
       ...item,
       start,
       height: Math.abs(height),
       actualHeight: height,
       isPositive: height >= 0,
     };
   });
 
   // Find max and min for scaling
   const values = enrichedData.map(d => d.start + (d.isPositive ? d.height : 0));
   const minValues = enrichedData.map(d => d.start + (d.isPositive ? 0 : -d.height));
   const maxValue = Math.max(...values, ...enrichedData.map(d => d.height));
   const minValue = Math.min(...minValues, 0);
   const range = maxValue - minValue;
 
   const scaleY = (value: number) => {
     return ((maxValue - value) / range) * 200;
   };
 
   const barWidth = 40;
   const gap = 15;
 
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
 
       <div className="overflow-x-auto">
         <svg 
           viewBox={`0 0 ${data.length * (barWidth + gap) + 60} 280`}
           className="w-full min-w-[500px]"
           preserveAspectRatio="xMidYMid meet"
         >
           {/* Zero line */}
           <line
             x1="50"
             y1={scaleY(0) + 20}
             x2={data.length * (barWidth + gap) + 50}
             y2={scaleY(0) + 20}
             stroke="hsl(var(--border))"
             strokeWidth="1"
             strokeDasharray="4 4"
           />
           
           {/* Y-axis labels */}
           {[0, maxValue * 0.5, maxValue, minValue * 0.5].filter(v => v !== 0 || minValue < 0).map((value, i) => (
             <text
               key={i}
               x="45"
               y={scaleY(value) + 25}
               textAnchor="end"
               className="fill-muted-foreground text-[10px]"
             >
               {(value / 1000).toFixed(0)}B
             </text>
           ))}
 
           {/* Bars */}
           {enrichedData.map((item, index) => {
             const x = index * (barWidth + gap) + 60;
             const barHeight = (item.height / range) * 200;
             const y = item.isTotal
               ? scaleY(item.actualHeight)
               : item.isPositive
                 ? scaleY(item.start + item.height)
                 : scaleY(item.start);
 
             return (
               <g key={index}>
                 {/* Connector line (except for first bar and totals) */}
                 {index > 0 && !item.isTotal && !enrichedData[index - 1].isTotal && (
                   <line
                     x1={x - gap}
                     y1={scaleY(item.start) + 20}
                     x2={x}
                     y2={scaleY(item.start) + 20}
                     stroke="hsl(var(--muted-foreground))"
                     strokeWidth="1"
                     strokeDasharray="2 2"
                   />
                 )}
                 
                 {/* Bar */}
                 <motion.rect
                   initial={{ height: 0, y: scaleY(0) + 20 }}
                   animate={{ height: barHeight, y: y + 20 }}
                   transition={{ duration: 0.5, delay: index * 0.1 }}
                   x={x}
                   width={barWidth}
                   rx="4"
                   fill={
                     item.isTotal 
                       ? "hsl(var(--primary))" 
                       : item.isPositive 
                         ? "hsl(var(--chart-positive))" 
                         : "hsl(var(--chart-negative))"
                   }
                 />
                 
                 {/* Value label */}
                 <text
                   x={x + barWidth / 2}
                   y={item.isPositive ? y + 15 : y + barHeight + 35}
                   textAnchor="middle"
                   className="fill-foreground text-[10px] font-semibold"
                 >
                   {item.isPositive ? '' : '-'}{(item.height / 1000).toFixed(1)}B
                 </text>
                 
                 {/* X-axis label */}
                 <text
                   x={x + barWidth / 2}
                   y="270"
                   textAnchor="middle"
                   className="fill-muted-foreground text-[9px]"
                   transform={`rotate(-30, ${x + barWidth / 2}, 270)`}
                 >
                   {item.label}
                 </text>
               </g>
             );
           })}
         </svg>
       </div>
 
       {/* Legend */}
       <div className="flex justify-center gap-6 mt-4 pt-4 border-t border-border">
         <div className="flex items-center gap-2">
           <div className="w-3 h-3 rounded-sm bg-chart-positive" />
           <span className="text-xs text-muted-foreground">تدفق إيجابي</span>
         </div>
         <div className="flex items-center gap-2">
           <div className="w-3 h-3 rounded-sm bg-chart-negative" />
           <span className="text-xs text-muted-foreground">تدفق سلبي</span>
         </div>
         <div className="flex items-center gap-2">
           <div className="w-3 h-3 rounded-sm bg-primary" />
           <span className="text-xs text-muted-foreground">الإجمالي</span>
         </div>
       </div>
     </motion.div>
   );
 };
 
 export default CashFlowWaterfall;