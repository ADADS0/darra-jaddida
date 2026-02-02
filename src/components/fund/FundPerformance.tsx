import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Info } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Tooltip as UITooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Fund } from "@/hooks/useFundData";

interface FundPerformanceProps {
  fund: Fund | {
    returns: Record<string, number>;
    benchmark: string;
  };
  detailed?: boolean;
}

const FundPerformance = ({ fund, detailed = false }: FundPerformanceProps) => {
  const periodsData = [
    { period: "شهر", key: "1M", value: fund.returns["1M"], benchmark: fund.returns["1M"] * 0.85 },
    { period: "3 أشهر", key: "3M", value: fund.returns["3M"], benchmark: fund.returns["3M"] * 0.8 },
    { period: "6 أشهر", key: "6M", value: fund.returns["6M"], benchmark: fund.returns["6M"] * 0.75 },
    { period: "سنة", key: "1Y", value: fund.returns["1Y"], benchmark: fund.returns["1Y"] * 0.9 },
    { period: "3 سنوات", key: "3Y", value: fund.returns["3Y"], benchmark: fund.returns["3Y"] * 0.85 },
    { period: "5 سنوات", key: "5Y", value: fund.returns["5Y"], benchmark: fund.returns["5Y"] * 0.88 },
    { period: "منذ البداية", key: "YTD", value: fund.returns["YTD"], benchmark: fund.returns["YTD"] * 0.82 },
  ];

  const getReturnColor = (value: number) => {
    if (value > 0) return "text-chart-positive";
    if (value < 0) return "text-chart-negative";
    return "text-muted-foreground";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-2xl border border-border p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-foreground">الأداء</h3>
          <UITooltip>
            <TooltipTrigger>
              <Info className="w-4 h-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              العوائد المعروضة هي عوائد إجمالية تشمل إعادة استثمار التوزيعات
            </TooltipContent>
          </UITooltip>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-primary" />
            <span className="text-muted-foreground">الصندوق</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-muted-foreground/50" />
            <span className="text-muted-foreground">{fund.benchmark}</span>
          </div>
        </div>
      </div>

      {/* Performance Table */}
      <div className="grid grid-cols-7 gap-2 mb-6">
        {periodsData.map((item) => (
          <div key={item.key} className="text-center p-3 bg-secondary/50 rounded-xl">
            <p className="text-xs text-muted-foreground mb-2">{item.period}</p>
            <p className={`text-sm font-bold ${getReturnColor(item.value)}`}>
              {item.value > 0 ? "+" : ""}{item.value.toFixed(2)}%
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              vs {item.benchmark > 0 ? "+" : ""}{item.benchmark.toFixed(2)}%
            </p>
          </div>
        ))}
      </div>

      {detailed && (
        <>
          {/* Performance Chart */}
          <div className="h-[300px] mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={periodsData} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="period" 
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={11}
                  tickLine={false}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    color: "hsl(var(--foreground))",
                  }}
                  formatter={(value: number, name: string) => [
                    `${value.toFixed(2)}%`,
                    name === "value" ? "الصندوق" : fund.benchmark,
                  ]}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {periodsData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.value >= 0 ? "hsl(var(--primary))" : "hsl(var(--destructive))"} 
                    />
                  ))}
                </Bar>
                <Bar dataKey="benchmark" fill="hsl(var(--muted-foreground) / 0.5)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Yearly Performance */}
          <div className="mt-6">
            <h4 className="text-sm font-semibold text-foreground mb-4">الأداء السنوي</h4>
            <div className="grid grid-cols-5 gap-4">
              {[2024, 2023, 2022, 2021, 2020].map((year) => {
                const returnValue = (Math.random() - 0.3) * 20;
                return (
                  <div key={year} className="text-center p-4 bg-secondary/30 rounded-xl">
                    <p className="text-sm text-muted-foreground mb-2">{year}</p>
                    <p className={`text-lg font-bold ${getReturnColor(returnValue)}`}>
                      {returnValue > 0 ? "+" : ""}{returnValue.toFixed(2)}%
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default FundPerformance;
