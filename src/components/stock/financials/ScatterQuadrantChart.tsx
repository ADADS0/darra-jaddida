 import { motion } from "framer-motion";
 import { Info } from "lucide-react";
 import { ScatterChart, Scatter, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell, ReferenceLine, ReferenceArea } from "recharts";
 import { Tooltip as UITooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
 
 interface DataPoint {
   name: string;
   x: number;
   y: number;
   size?: number;
 }
 
 interface Quadrant {
   label: string;
   color: string;
 }
 
 interface ScatterQuadrantChartProps {
   title: string;
   data: DataPoint[];
   xLabel: string;
   yLabel: string;
   quadrants?: [Quadrant, Quadrant, Quadrant, Quadrant];
   tooltip?: string;
 }
 
 const defaultQuadrants: [Quadrant, Quadrant, Quadrant, Quadrant] = [
   { label: "نمو عالي - ربحية عالية", color: "hsl(var(--chart-positive) / 0.15)" },
   { label: "نمو منخفض - ربحية عالية", color: "hsl(38 92% 50% / 0.15)" },
   { label: "نمو منخفض - ربحية منخفضة", color: "hsl(var(--chart-negative) / 0.15)" },
   { label: "نمو عالي - ربحية منخفضة", color: "hsl(var(--primary) / 0.15)" },
 ];
 
 const ScatterQuadrantChart = ({ 
   title, 
   data, 
   xLabel, 
   yLabel, 
   quadrants = defaultQuadrants,
   tooltip 
 }: ScatterQuadrantChartProps) => {
   // Calculate axis bounds
   const xValues = data.map(d => d.x);
   const yValues = data.map(d => d.y);
   const xMin = Math.min(...xValues, -10);
   const xMax = Math.max(...xValues, 10);
   const yMin = Math.min(...yValues, -10);
   const yMax = Math.max(...yValues, 10);
 
   // Determine point color based on quadrant
   const getPointColor = (x: number, y: number) => {
     if (x >= 0 && y >= 0) return "hsl(var(--chart-positive))";
     if (x < 0 && y >= 0) return "hsl(38 92% 50%)";
     if (x < 0 && y < 0) return "hsl(var(--chart-negative))";
     return "hsl(var(--primary))";
   };
 
   const CustomTooltipContent = ({ active, payload }: any) => {
     if (active && payload && payload.length) {
       const point = payload[0].payload;
       return (
         <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
           <p className="font-semibold text-foreground mb-2">{point.name}</p>
           <p className="text-sm text-muted-foreground">
             {xLabel}: <span className="font-medium text-foreground">{point.x.toFixed(1)}%</span>
           </p>
           <p className="text-sm text-muted-foreground">
             {yLabel}: <span className="font-medium text-foreground">{point.y.toFixed(1)}%</span>
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
 
       <div className="h-72 relative">
         <ResponsiveContainer width="100%" height="100%">
           <ScatterChart margin={{ top: 20, right: 20, bottom: 30, left: 40 }}>
             {/* Quadrant backgrounds */}
             <ReferenceArea x1={0} x2={xMax} y1={0} y2={yMax} fill={quadrants[0].color} />
             <ReferenceArea x1={xMin} x2={0} y1={0} y2={yMax} fill={quadrants[1].color} />
             <ReferenceArea x1={xMin} x2={0} y1={yMin} y2={0} fill={quadrants[2].color} />
             <ReferenceArea x1={0} x2={xMax} y1={yMin} y2={0} fill={quadrants[3].color} />
             
             {/* Axis lines */}
             <ReferenceLine x={0} stroke="hsl(var(--border))" strokeWidth={1} />
             <ReferenceLine y={0} stroke="hsl(var(--border))" strokeWidth={1} />
 
             <XAxis
               type="number"
               dataKey="x"
               domain={[xMin, xMax]}
               axisLine={false}
               tickLine={false}
               tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
               tickFormatter={(value) => `${value}%`}
               label={{ 
                 value: xLabel, 
                 position: 'bottom',
                 style: { fill: 'hsl(var(--muted-foreground))', fontSize: 11 }
               }}
             />
             <YAxis
               type="number"
               dataKey="y"
               domain={[yMin, yMax]}
               axisLine={false}
               tickLine={false}
               tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
               tickFormatter={(value) => `${value}%`}
               label={{ 
                 value: yLabel, 
                 angle: -90,
                 position: 'insideLeft',
                 style: { fill: 'hsl(var(--muted-foreground))', fontSize: 11 }
               }}
             />
             
             <Tooltip content={<CustomTooltipContent />} />
             
             <Scatter data={data} shape="circle">
               {data.map((entry, index) => (
                 <Cell 
                   key={`cell-${index}`} 
                   fill={getPointColor(entry.x, entry.y)}
                   r={entry.size || 8}
                 />
               ))}
             </Scatter>
           </ScatterChart>
         </ResponsiveContainer>
 
         {/* Quadrant labels */}
         <div className="absolute top-6 right-6 text-[10px] text-chart-positive font-medium opacity-70">
           {quadrants[0].label}
         </div>
         <div className="absolute top-6 left-12 text-[10px] text-warning font-medium opacity-70">
           {quadrants[1].label}
         </div>
         <div className="absolute bottom-12 left-12 text-[10px] text-chart-negative font-medium opacity-70">
           {quadrants[2].label}
         </div>
         <div className="absolute bottom-12 right-6 text-[10px] text-primary font-medium opacity-70">
           {quadrants[3].label}
         </div>
       </div>
 
       {/* Legend */}
       <div className="flex flex-wrap justify-center gap-3 mt-4 pt-4 border-t border-border">
         {data.slice(0, 6).map((point, index) => (
           <div key={index} className="flex items-center gap-1.5">
             <div 
               className="w-2.5 h-2.5 rounded-full" 
               style={{ backgroundColor: getPointColor(point.x, point.y) }}
             />
             <span className="text-xs text-muted-foreground">{point.name}</span>
           </div>
         ))}
       </div>
     </motion.div>
   );
 };
 
 export default ScatterQuadrantChart;