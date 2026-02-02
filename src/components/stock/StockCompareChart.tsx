import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, TooltipProps } from "recharts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Plus, TrendingUp, TrendingDown } from "lucide-react";
import { Stock, useStockData } from "@/hooks/useStockData";
import { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";

interface StockCompareChartProps {
  initialStocks?: string[];
  maxStocks?: number;
}

const COLORS = [
  "#2962ff",  // Blue
  "#089981",  // Green
  "#f23645",  // Red
  "#ff9800",  // Orange
  "#ab47bc",  // Purple
  "#00bcd4",  // Cyan
];

const generateComparisonData = (stocks: string[], period: string) => {
  const data = [];
  let days = 30;

  switch (period) {
    case "1D": days = 1; break;
    case "1W": days = 7; break;
    case "1M": days = 30; break;
    case "3M": days = 90; break;
    case "6M": days = 180; break;
    case "1Y": days = 365; break;
    default: days = 30;
  }

  const points = Math.min(days === 1 ? 24 : days, 60);

  // Generate base performance for each stock
  const stockPerformance: Record<string, number[]> = {};
  stocks.forEach((symbol, index) => {
    const volatility = 0.02 + Math.random() * 0.03;
    const trend = (Math.random() - 0.4) * 0.002;

    let value = 100; // Start at 100 for percentage comparison
    stockPerformance[symbol] = [];

    for (let i = 0; i < points; i++) {
      value += (Math.random() - 0.5) * volatility * 100 + trend * 100;
      stockPerformance[symbol].push(Number(value.toFixed(2)));
    }
  });

  for (let i = 0; i < points; i++) {
    const date = new Date();
    if (days === 1) {
      date.setHours(date.getHours() - (points - i));
    } else {
      date.setDate(date.getDate() - (days - Math.floor(i * days / points)));
    }

    const point: Record<string, string | number> = {
      date: days === 1
        ? date.toLocaleTimeString("ar-MA", { hour: "2-digit", minute: "2-digit" })
        : date.toLocaleDateString("ar-MA", { month: "short", day: "numeric" }),
    };

    stocks.forEach((symbol) => {
      point[symbol] = stockPerformance[symbol][i];
    });

    data.push(point);
  }

  return data;
};

const StockCompareChart = ({ initialStocks = ["IAM", "ATW"], maxStocks = 6 }: StockCompareChartProps) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const { data: stockData } = useStockData();
  const availableStocks = stockData?.stocks || [];

  const [selectedStocks, setSelectedStocks] = useState<string[]>(initialStocks);
  const [period, setPeriod] = useState("1M");
  const [showSelector, setShowSelector] = useState(false);

  const data = useMemo(() => generateComparisonData(selectedStocks, period), [selectedStocks, period]);

  const periods = [
    { key: "1D", label: isRTL ? "يوم" : "1D" },
    { key: "1W", label: isRTL ? "أسبوع" : "1W" },
    { key: "1M", label: isRTL ? "شهر" : "1M" },
    { key: "3M", label: isRTL ? "3 أشهر" : "3M" },
    { key: "6M", label: isRTL ? "6 أشهر" : "6M" },
    { key: "1Y", label: isRTL ? "سنة" : "1Y" },
  ];

  const removeStock = (symbol: string) => {
    if (selectedStocks.length > 1) {
      setSelectedStocks(prev => prev.filter(s => s !== symbol));
    }
  };

  const addStock = (symbol: string) => {
    if (selectedStocks.length < maxStocks && !selectedStocks.includes(symbol)) {
      setSelectedStocks(prev => [...prev, symbol]);
      setShowSelector(false);
    }
  };

  // Calculate performance for each stock
  const performance = useMemo(() => {
    const result: Record<string, number> = {};
    if (data.length > 0) {
      selectedStocks.forEach((symbol) => {
        const first = data[0][symbol];
        const last = data[data.length - 1][symbol];
        result[symbol] = Number(((last - first) / first * 100).toFixed(2));
      });
    }
    return result;
  }, [data, selectedStocks]);

  const CustomTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-4 shadow-lg">
          <p className="text-sm font-medium text-foreground mb-2">{label}</p>
          {payload.map((entry, index: number) => (
            <div key={index} className="flex items-center justify-between gap-4 text-sm">
              <span className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                {entry.dataKey}
              </span>
              <span className="font-medium text-foreground">
                {typeof entry.value === 'number' ? entry.value.toFixed(2) : entry.value}%
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-2xl border border-border p-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            {isRTL ? "مقارنة الأسهم" : "Stock Comparison"}
          </h3>
          <p className="text-sm text-muted-foreground">
            {isRTL ? "قارن أداء عدة أسهم" : "Compare performance of multiple stocks"}
          </p>
        </div>

        {/* Period Selector */}
        <div className="flex items-center gap-1 p-1 bg-secondary rounded-xl">
          {periods.map((p) => (
            <button
              key={p.key}
              onClick={() => setPeriod(p.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                period === p.key
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Selected Stocks */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        {selectedStocks.map((symbol, index) => (
          <Badge
            key={symbol}
            variant="outline"
            className="flex items-center gap-2 px-3 py-1.5"
            style={{ borderColor: COLORS[index % COLORS.length], color: COLORS[index % COLORS.length] }}
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <span className="font-medium">{symbol}</span>
            <span className={`flex items-center gap-0.5 text-xs ${
              performance[symbol] >= 0 ? 'text-green-500' : 'text-red-500'
            }`}>
              {performance[symbol] >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {performance[symbol] >= 0 ? '+' : ''}{performance[symbol]}%
            </span>
            {selectedStocks.length > 1 && (
              <button
                onClick={() => removeStock(symbol)}
                className="hover:text-foreground transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </Badge>
        ))}

        {selectedStocks.length < maxStocks && (
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1"
              onClick={() => setShowSelector(!showSelector)}
            >
              <Plus className="w-4 h-4" />
              {isRTL ? "إضافة سهم" : "Add Stock"}
            </Button>

            {showSelector && (
              <div className="absolute top-full mt-2 left-0 z-10 bg-popover border border-border rounded-lg shadow-lg p-2 min-w-[200px] max-h-[300px] overflow-y-auto">
                {availableStocks
                  .filter(s => !selectedStocks.includes(s.symbol))
                  .slice(0, 20)
                  .map((stock) => (
                    <button
                      key={stock.symbol}
                      onClick={() => addStock(stock.symbol)}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-secondary rounded-lg transition-colors"
                    >
                      <span className="font-medium">{stock.symbol}</span>
                      <span className="text-muted-foreground text-xs truncate">{stock.name}</span>
                    </button>
                  ))
                }
              </div>
            )}
          </div>
        )}
      </div>

      {/* Chart */}
      <div className="h-[400px] relative">
        {/* Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <span className="text-6xl font-bold text-muted-foreground/5">CASABLUE</span>
        </div>

        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />

            <XAxis
              dataKey="date"
              stroke="hsl(var(--muted-foreground))"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
            />

            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value.toFixed(0)}%`}
              domain={['dataMin - 2', 'dataMax + 2']}
            />

            <Tooltip content={<CustomTooltip />} />

            {/* Reference line at 100% */}
            <CartesianGrid y={100} stroke="hsl(var(--border))" strokeDasharray="5 5" />

            {selectedStocks.map((symbol, index) => (
              <Line
                key={symbol}
                type="monotone"
                dataKey={symbol}
                stroke={COLORS[index % COLORS.length]}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6, strokeWidth: 2 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-6 mt-6 pt-4 border-t border-border">
        {selectedStocks.map((symbol, index) => {
          const stock = availableStocks.find(s => s.symbol === symbol);
          return (
            <div key={symbol} className="flex items-center gap-2">
              <span
                className="w-4 h-1 rounded"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="text-sm text-foreground font-medium">{symbol}</span>
              {stock && (
                <span className="text-xs text-muted-foreground">
                  {isRTL ? stock.name : stock.nameEn}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default StockCompareChart;
