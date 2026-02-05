 import { useState } from "react";
 import { motion } from "framer-motion";
 import { Info, ChevronDown, ChevronUp, TrendingUp, TrendingDown } from "lucide-react";
 import { Tooltip as UITooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
 
 interface FinancialRow {
   label: string;
   values: (number | string)[];
   isHighlighted?: boolean;
   isSectionHeader?: boolean;
   tooltip?: string;
 }
 
 interface FinancialDataTableProps {
   title: string;
   years: string[];
   data: FinancialRow[];
   tooltip?: string;
   showYoY?: boolean;
 }
 
 const FinancialDataTable = ({ 
   title, 
   years, 
   data, 
   tooltip,
   showYoY = true
 }: FinancialDataTableProps) => {
   const [expandedSections, setExpandedSections] = useState<string[]>([]);
   const [showAllRows, setShowAllRows] = useState(false);
 
   const displayData = showAllRows ? data : data.slice(0, 8);
 
   const calculateYoY = (current: number | string, previous: number | string): number | null => {
     const curr = typeof current === 'number' ? current : parseFloat(current.toString().replace(/[^0-9.-]/g, ''));
     const prev = typeof previous === 'number' ? previous : parseFloat(previous.toString().replace(/[^0-9.-]/g, ''));
     if (isNaN(curr) || isNaN(prev) || prev === 0) return null;
     return ((curr - prev) / Math.abs(prev)) * 100;
   };
 
   const formatValue = (value: number | string): string => {
     if (typeof value === 'string') return value;
     if (Math.abs(value) >= 1000) {
       return (value / 1000).toFixed(1) + 'B';
     }
     return value.toFixed(0) + 'M';
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
 
       <div className="overflow-x-auto">
         <table className="w-full min-w-[500px]">
           <thead>
             <tr className="border-b border-border">
               <th className="text-right py-3 pr-2 text-sm font-medium text-muted-foreground">البند</th>
               {years.map((year, index) => (
                 <th key={year} className="text-center py-3 px-2 text-sm font-medium text-muted-foreground">
                   {year}
                   {showYoY && index > 0 && (
                     <span className="block text-[10px] text-muted-foreground/60">YoY</span>
                   )}
                 </th>
               ))}
             </tr>
           </thead>
           <tbody>
             {displayData.map((row, rowIndex) => {
               if (row.isSectionHeader) {
                 return (
                   <tr key={rowIndex} className="bg-secondary/30">
                     <td 
                       colSpan={years.length + 1} 
                       className="py-2 pr-2 text-sm font-semibold text-foreground"
                     >
                       {row.label}
                     </td>
                   </tr>
                 );
               }
 
               return (
                 <tr 
                   key={rowIndex} 
                   className={`
                     border-b border-border/50 hover:bg-secondary/20 transition-colors
                     ${row.isHighlighted ? 'bg-primary/5' : ''}
                   `}
                 >
                   <td className="py-2.5 pr-2 text-sm text-muted-foreground flex items-center gap-1">
                     {row.label}
                     {row.tooltip && (
                       <UITooltip>
                         <TooltipTrigger>
                           <Info className="w-3 h-3 text-muted-foreground/50" />
                         </TooltipTrigger>
                         <TooltipContent className="max-w-xs">
                           <p className="text-xs">{row.tooltip}</p>
                         </TooltipContent>
                       </UITooltip>
                     )}
                   </td>
                   {row.values.map((value, colIndex) => {
                     const yoy = showYoY && colIndex > 0 
                       ? calculateYoY(value, row.values[colIndex - 1])
                       : null;
 
                     return (
                       <td 
                         key={colIndex} 
                         className={`text-center py-2.5 px-2 ${row.isHighlighted ? 'font-semibold' : ''}`}
                       >
                         <span className="text-sm text-foreground">{formatValue(value)}</span>
                         {yoy !== null && (
                           <div className={`flex items-center justify-center gap-0.5 text-[10px] ${
                             yoy >= 0 ? 'text-chart-positive' : 'text-chart-negative'
                           }`}>
                             {yoy >= 0 ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
                             {yoy >= 0 ? '+' : ''}{yoy.toFixed(1)}%
                           </div>
                         )}
                       </td>
                     );
                   })}
                 </tr>
               );
             })}
           </tbody>
         </table>
       </div>
 
       {data.length > 8 && (
         <button
           onClick={() => setShowAllRows(!showAllRows)}
           className="w-full flex items-center justify-center gap-1 py-3 mt-4 text-xs text-muted-foreground hover:text-foreground transition-colors border-t border-border"
         >
           {showAllRows ? (
             <>
               <ChevronUp className="w-4 h-4" />
               عرض أقل
             </>
           ) : (
             <>
               <ChevronDown className="w-4 h-4" />
               عرض الكل ({data.length - 8} بند إضافي)
             </>
           )}
         </button>
       )}
 
       {/* Footer note */}
       <div className="mt-4 pt-4 border-t border-border">
         <p className="text-xs text-muted-foreground">
           جميع الأرقام بالمليون درهم مغربي (M MAD) ما لم يُذكر خلاف ذلك
         </p>
       </div>
     </motion.div>
   );
 };
 
 export default FinancialDataTable;