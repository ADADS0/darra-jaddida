 import { motion } from "framer-motion";
 import { Info } from "lucide-react";
 import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
 
 interface GaugeSection {
   label: string;
   value: number;
   color: string;
 }
 
 interface FinancialGaugeProps {
   title: string;
   value: number;
   maxValue: number;
   sections: GaugeSection[];
   unit?: string;
   tooltip?: string;
 }
 
 const FinancialGauge = ({ 
   title, 
   value, 
   maxValue, 
   sections, 
   unit = "",
   tooltip 
 }: FinancialGaugeProps) => {
   // Calculate needle rotation (from -90 to 90 degrees)
   const normalizedValue = Math.min(Math.max(value, 0), maxValue);
   const rotation = (normalizedValue / maxValue) * 180 - 90;
   
   // Calculate section angles
   const totalWeight = sections.reduce((sum, s) => sum + s.value, 0);
   let currentAngle = -90;
   
   const sectionArcs = sections.map((section) => {
     const startAngle = currentAngle;
     const angleSpan = (section.value / totalWeight) * 180;
     currentAngle += angleSpan;
     return {
       ...section,
       startAngle,
       endAngle: currentAngle,
     };
   });
 
   const createArcPath = (startAngle: number, endAngle: number, radius: number, innerRadius: number) => {
     const startRad = (startAngle * Math.PI) / 180;
     const endRad = (endAngle * Math.PI) / 180;
     
     const x1 = 100 + radius * Math.cos(startRad);
     const y1 = 100 + radius * Math.sin(startRad);
     const x2 = 100 + radius * Math.cos(endRad);
     const y2 = 100 + radius * Math.sin(endRad);
     
     const x3 = 100 + innerRadius * Math.cos(endRad);
     const y3 = 100 + innerRadius * Math.sin(endRad);
     const x4 = 100 + innerRadius * Math.cos(startRad);
     const y4 = 100 + innerRadius * Math.sin(startRad);
     
     const largeArc = endAngle - startAngle > 180 ? 1 : 0;
     
     return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4} Z`;
   };
 
   // Determine status color based on value position
   const getStatusColor = () => {
     const percent = normalizedValue / maxValue;
     if (percent < 0.33) return "text-chart-positive";
     if (percent < 0.66) return "text-warning";
     return "text-chart-negative";
   };
 
   return (
     <motion.div
       initial={{ opacity: 0, scale: 0.95 }}
       animate={{ opacity: 1, scale: 1 }}
       transition={{ duration: 0.5 }}
       className="bg-card rounded-2xl border border-border p-6"
     >
       <div className="flex items-center gap-2 mb-4">
         <h3 className="text-base font-semibold text-foreground">{title}</h3>
         {tooltip && (
           <Tooltip>
             <TooltipTrigger>
               <Info className="w-4 h-4 text-muted-foreground" />
             </TooltipTrigger>
             <TooltipContent className="max-w-xs">
               <p>{tooltip}</p>
             </TooltipContent>
           </Tooltip>
         )}
       </div>
 
       <div className="relative flex justify-center items-center">
         <svg viewBox="0 0 200 120" className="w-full max-w-[250px]">
           {/* Background Arc */}
           <path
             d={createArcPath(-90, 90, 80, 50)}
             fill="hsl(var(--secondary))"
           />
           
           {/* Colored sections */}
           {sectionArcs.map((section, index) => (
             <path
               key={index}
               d={createArcPath(section.startAngle, section.endAngle, 80, 50)}
               fill={section.color}
               opacity={0.9}
             />
           ))}
           
           {/* Needle */}
           <motion.g
             initial={{ rotate: -90 }}
             animate={{ rotate: rotation }}
             transition={{ duration: 1, ease: "easeOut" }}
             style={{ transformOrigin: "100px 100px" }}
           >
             <polygon
               points="100,45 96,100 104,100"
               fill="hsl(var(--foreground))"
             />
             <circle cx="100" cy="100" r="8" fill="hsl(var(--foreground))" />
             <circle cx="100" cy="100" r="4" fill="hsl(var(--card))" />
           </motion.g>
           
           {/* Section labels */}
           {sectionArcs.map((section, index) => {
             const midAngle = ((section.startAngle + section.endAngle) / 2) * (Math.PI / 180);
             const labelRadius = 95;
             const x = 100 + labelRadius * Math.cos(midAngle);
             const y = 100 + labelRadius * Math.sin(midAngle);
             return (
               <text
                 key={index}
                 x={x}
                 y={y}
                 textAnchor="middle"
                 dominantBaseline="middle"
                 className="fill-muted-foreground text-[8px] font-medium"
               >
                 {section.label}
               </text>
             );
           })}
         </svg>
       </div>
 
       {/* Value Display */}
       <div className="text-center mt-2">
         <p className={`text-2xl font-bold ${getStatusColor()}`}>
           {value.toFixed(1)}{unit}
         </p>
         <p className="text-xs text-muted-foreground">من {maxValue}{unit}</p>
       </div>
 
       {/* Legend */}
       <div className="flex justify-center gap-4 mt-4">
         {sections.map((section, index) => (
           <div key={index} className="flex items-center gap-1.5">
             <div 
               className="w-3 h-3 rounded-sm" 
               style={{ backgroundColor: section.color }}
             />
             <span className="text-xs text-muted-foreground">{section.label}</span>
           </div>
         ))}
       </div>
     </motion.div>
   );
 };
 
 export default FinancialGauge;