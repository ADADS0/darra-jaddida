 import { motion } from "framer-motion";
 import { Info } from "lucide-react";
 import { Tooltip as UITooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
 
 interface RankingItem {
   rank: number;
   label: string;
   value: number;
   change?: number;
 }
 
 interface HorizontalBarRankingProps {
   title: string;
   data: RankingItem[];
   unit?: string;
   tooltip?: string;
   maxValue?: number;
 }
 
 const HorizontalBarRanking = ({ 
   title, 
   data, 
   unit = "M MAD",
   tooltip,
   maxValue: customMax
 }: HorizontalBarRankingProps) => {
   const maxValue = customMax || Math.max(...data.map(d => d.value));
 
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
 
       <div className="space-y-3">
         {data.map((item, index) => (
           <motion.div
             key={item.rank}
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ duration: 0.3, delay: index * 0.05 }}
             className="relative"
           >
             <div className="flex items-center gap-3">
               {/* Rank badge */}
               <div className={`
                 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0
                 ${item.rank === 1 ? 'bg-yellow-500/20 text-yellow-500' :
                   item.rank === 2 ? 'bg-gray-400/20 text-gray-400' :
                   item.rank === 3 ? 'bg-amber-700/20 text-amber-700' :
                   'bg-secondary text-muted-foreground'}
               `}>
                 {item.rank}
               </div>
 
               {/* Label */}
               <span className="text-sm text-foreground w-24 truncate">{item.label}</span>
 
               {/* Bar container */}
               <div className="flex-1 h-6 bg-secondary/50 rounded-full overflow-hidden relative">
                 <motion.div
                   initial={{ width: 0 }}
                   animate={{ width: `${(item.value / maxValue) * 100}%` }}
                   transition={{ duration: 0.6, delay: index * 0.05 }}
                   className={`h-full rounded-full ${
                     item.rank === 1 ? 'bg-gradient-to-r from-yellow-500 to-yellow-400' :
                     item.rank === 2 ? 'bg-gradient-to-r from-gray-500 to-gray-400' :
                     item.rank === 3 ? 'bg-gradient-to-r from-amber-700 to-amber-600' :
                     'bg-primary'
                   }`}
                 />
               </div>
 
               {/* Value */}
               <div className="flex items-center gap-2 min-w-[100px] justify-end">
                 <span className="text-sm font-semibold text-foreground">
                   {item.value.toLocaleString()} {unit}
                 </span>
                 {item.change !== undefined && (
                   <span className={`text-xs ${item.change >= 0 ? 'text-chart-positive' : 'text-chart-negative'}`}>
                     {item.change > 0 ? '+' : ''}{item.change}%
                   </span>
                 )}
               </div>
             </div>
           </motion.div>
         ))}
       </div>
 
       {/* X-axis labels */}
       <div className="flex justify-between mt-4 pt-4 border-t border-border">
         <span className="text-xs text-muted-foreground">0</span>
         <span className="text-xs text-muted-foreground">{(maxValue / 2).toLocaleString()}</span>
         <span className="text-xs text-muted-foreground">{maxValue.toLocaleString()}</span>
       </div>
     </motion.div>
   );
 };
 
 export default HorizontalBarRanking;