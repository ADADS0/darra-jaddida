import { motion } from "framer-motion";
import { Info, ArrowLeft } from "lucide-react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from "recharts";
import { Tooltip as UITooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface StockSectorComparisonProps {
  stock: {
    symbol: string;
    name: string;
    sector: string;
    per: number;
    pb: number;
    dividendYield: number;
    roe: number;
  };
}

// Mock peer data
const peers = [
  { symbol: "IAM", name: "اتصالات المغرب", price: 118.50, change: "+2.02%", per: 14.2, marketCap: "104.2B" },
  { symbol: "MED", name: "ميدي تيليكوم", price: 84.20, change: "-0.85%", per: 18.5, marketCap: "32.1B" },
  { symbol: "INV", name: "انفوتيك", price: 56.80, change: "+1.24%", per: 22.3, marketCap: "8.5B" },
];

// Radar chart data comparing stock to sector average
const getRadarData = (stock: StockSectorComparisonProps["stock"]) => [
  { metric: "التقييم", stock: normalizeValue(stock.per, 25, true), sector: 60, fullMark: 100 },
  { metric: "الجودة", stock: normalizeValue(stock.roe, 30, false), sector: 55, fullMark: 100 },
  { metric: "العائد", stock: normalizeValue(stock.dividendYield, 8, false), sector: 50, fullMark: 100 },
  { metric: "النمو", stock: 72, sector: 58, fullMark: 100 },
  { metric: "السيولة", stock: 78, sector: 65, fullMark: 100 },
  { metric: "الاستقرار", stock: 68, sector: 60, fullMark: 100 },
];

// Normalize value to 0-100 scale
function normalizeValue(value: number, max: number, inverse: boolean): number {
  const normalized = Math.min((value / max) * 100, 100);
  return inverse ? 100 - normalized : normalized;
}

const StockSectorComparison = ({ stock }: StockSectorComparisonProps) => {
  const radarData = getRadarData(stock);
  
  // Use stock symbol as key to prevent DOM manipulation conflicts
  const chartKey = `radar-${stock.symbol}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-card rounded-2xl border border-border p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-foreground">المقارنة القطاعية</h2>
          <UITooltip>
            <TooltipTrigger>
              <Info className="w-4 h-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p>مقارنة السهم مع متوسط القطاع والشركات المنافسة.</p>
            </TooltipContent>
          </UITooltip>
        </div>
        <span className="text-xs px-2 py-1 rounded-full bg-secondary text-muted-foreground">
          قطاع {stock.sector}
        </span>
      </div>

      {/* Radar Chart */}
      <div className="h-64 mb-6">
        <ResponsiveContainer key={chartKey} width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
            <PolarGrid stroke="hsl(var(--border))" />
            <PolarAngleAxis
              dataKey="metric"
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 100]}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
            />
            <Radar
              name="القطاع"
              dataKey="sector"
              stroke="hsl(var(--muted-foreground))"
              fill="hsl(var(--muted-foreground))"
              fillOpacity={0.2}
              strokeWidth={2}
              isAnimationActive={false}
            />
            <Radar
              name={stock.symbol}
              dataKey="stock"
              stroke="hsl(var(--primary))"
              fill="hsl(var(--primary))"
              fillOpacity={0.3}
              strokeWidth={2}
              isAnimationActive={false}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-6 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary" />
          <span className="text-xs text-muted-foreground">{stock.symbol}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-muted-foreground/50" />
          <span className="text-xs text-muted-foreground">متوسط القطاع</span>
        </div>
      </div>

      {/* Peer Comparison Table */}
      <div className="border-t border-border pt-4">
        <h3 className="text-sm font-medium text-foreground mb-3">شركات القطاع</h3>
        <div className="space-y-2">
          {peers.map((peer) => (
            <Link
              key={peer.symbol}
              to={`/stock/${peer.symbol}`}
              className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-card flex items-center justify-center text-xs font-bold text-foreground">
                  {peer.symbol.slice(0, 2)}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{peer.symbol}</p>
                  <p className="text-xs text-muted-foreground">{peer.name}</p>
                </div>
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-foreground">{peer.price} MAD</p>
                <p className={`text-xs ${peer.change.startsWith("+") ? "text-chart-positive" : "text-chart-negative"}`}>
                  {peer.change}
                </p>
              </div>
            </Link>
          ))}
        </div>
        
        <Button variant="ghost" className="w-full mt-3 text-xs text-muted-foreground group">
          مقارنة تفصيلية
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1 rtl-flip" />
        </Button>
      </div>
    </motion.div>
  );
};

export default StockSectorComparison;
