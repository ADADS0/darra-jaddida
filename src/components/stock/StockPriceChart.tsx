import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Info, Loader2 } from "lucide-react";
import { Tooltip as UITooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useStockHistory } from "@/hooks/useStockHistory";
import { Skeleton } from "@/components/ui/skeleton";

interface StockPriceChartProps {
  stock: {
    symbol: string;
    isPositive: boolean;
    price?: number;
  };
  embedded?: boolean;
}

const periods = [
  { key: "1W", label: "أسبوع", days: 7 },
  { key: "1M", label: "شهر", days: 30 },
  { key: "3M", label: "3 أشهر", days: 90 },
  { key: "6M", label: "6 أشهر", days: 180 },
  { key: "1Y", label: "سنة", days: 365 },
];

const StockPriceChart = ({ stock, embedded = false }: StockPriceChartProps) => {
  const [selectedPeriod, setSelectedPeriod] = useState("1Y");
  const period = periods.find(p => p.key === selectedPeriod) || periods[4];
  
  const { data: historyData, isLoading, error } = useStockHistory(stock.symbol, period.days);

  const chartData = useMemo(() => {
    if (!historyData?.data) return [];
    
    return historyData.data.map(d => ({
      date: new Date(d.date).toLocaleDateString('ar-MA', { month: 'short', day: 'numeric' }),
      fullDate: new Date(d.date).toLocaleDateString('ar-MA', { year: 'numeric', month: 'long', day: 'numeric' }),
      price: d.close,
      volume: d.volume,
      high: d.high,
      low: d.low,
    }));
  }, [historyData]);

  const priceChange = useMemo(() => {
    if (chartData.length < 2) return 0;
    const first = chartData[0].price;
    const last = chartData[chartData.length - 1].price;
    return ((last - first) / first) * 100;
  }, [chartData]);

  const minPrice = useMemo(() => 
    chartData.length > 0 ? Math.min(...chartData.map(d => d.price)) * 0.98 : 0, 
    [chartData]
  );
  const maxPrice = useMemo(() => 
    chartData.length > 0 ? Math.max(...chartData.map(d => d.price)) * 1.02 : 0, 
    [chartData]
  );

  const chartColor = priceChange >= 0 ? "#089981" : "#f23645";

  if (isLoading) {
    return (
      <div className="relative">
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-10 w-64" />
        </div>
        <div className="h-80 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (error || chartData.length === 0) {
    return (
      <div className="relative">
        <div className="h-80 flex items-center justify-center text-muted-foreground">
          <p>لا توجد بيانات تاريخية متاحة</p>
        </div>
      </div>
    );
  }

  const content = (
    <div className="relative">
      {/* Header with period selector */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          {!embedded && <h2 className="text-lg font-semibold text-foreground">الرسم البياني</h2>}
          <UITooltip>
            <TooltipTrigger>
              <Info className="w-4 h-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p>رسم بياني يظهر تطور سعر السهم عبر الزمن - بيانات من بورصة الدار البيضاء</p>
            </TooltipContent>
          </UITooltip>
          <span className={`text-sm font-medium px-2 py-1 rounded-md ${priceChange >= 0 ? "bg-[#089981]/10 text-[#089981]" : "bg-[#f23645]/10 text-[#f23645]"}`}>
            {priceChange >= 0 ? "+" : ""}{priceChange.toFixed(2)}%
          </span>
        </div>
        
        <div className="flex items-center gap-1 p-1 bg-secondary/50 rounded-xl">
          {periods.map((p) => (
            <button
              key={p.key}
              onClick={() => setSelectedPeriod(p.key)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                selectedPeriod === p.key
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              {p.key}
            </button>
          ))}
        </div>
      </div>

      {/* Price Chart */}
      <div className="h-80 relative">
        {/* Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <span className="text-6xl font-bold text-muted-foreground/5 select-none">
            {stock.symbol}
          </span>
        </div>
        
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart 
            data={chartData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id={`priceGradient-${stock.symbol}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={chartColor} stopOpacity={0.3} />
                <stop offset="50%" stopColor={chartColor} stopOpacity={0.1} />
                <stop offset="100%" stopColor={chartColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="hsl(var(--border))" 
              opacity={0.3}
              vertical={false}
            />
            
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
              interval="preserveStartEnd"
              dy={8}
            />
            
            <YAxis
              domain={[minPrice, maxPrice]}
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
              tickFormatter={(v) => v.toFixed(0)}
              orientation="left"
              dx={-8}
            />
            
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--popover))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '12px',
                boxShadow: '0 10px 40px -10px rgba(0,0,0,0.3)',
                padding: '12px 16px',
              }}
              labelStyle={{ 
                color: 'hsl(var(--foreground))',
                fontWeight: 600,
                marginBottom: '8px',
              }}
              labelFormatter={(_, payload) => {
                if (payload && payload[0]) {
                  return payload[0].payload.fullDate;
                }
                return '';
              }}
              formatter={(value: number) => [`${value.toFixed(2)} MAD`, 'السعر']}
            />
            
            <Area
              type="monotone"
              dataKey="price"
              stroke={chartColor}
              strokeWidth={2}
              fill={`url(#priceGradient-${stock.symbol})`}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-border text-sm">
        <div className="text-center">
          <span className="text-muted-foreground">أعلى سعر</span>
          <p className="font-semibold text-foreground">{maxPrice.toFixed(2)} MAD</p>
        </div>
        <div className="text-center">
          <span className="text-muted-foreground">أدنى سعر</span>
          <p className="font-semibold text-foreground">{minPrice.toFixed(2)} MAD</p>
        </div>
        <div className="text-center">
          <span className="text-muted-foreground">متوسط</span>
          <p className="font-semibold text-foreground">
            {(chartData.reduce((a, b) => a + b.price, 0) / chartData.length).toFixed(2)} MAD
          </p>
        </div>
      </div>
    </div>
  );

  if (embedded) {
    return content;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-card rounded-2xl border border-border p-6"
    >
      {content}
    </motion.div>
  );
};

export default StockPriceChart;
