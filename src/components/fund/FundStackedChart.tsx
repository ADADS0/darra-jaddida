import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, TooltipProps } from "recharts";
import { Fund } from "@/hooks/useFundData";
import { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";

interface FundStackedChartProps {
  fund: Fund | { nav: number; name: string };
}

const generateStackedData = (baseNav: number, period: string) => {
  const data = [];
  let days = 30;

  switch (period) {
    case "1M": days = 30; break;
    case "3M": days = 90; break;
    case "6M": days = 180; break;
    case "1Y": days = 365; break;
    case "3Y": days = 365 * 3; break;
    case "5Y": days = 365 * 5; break;
    case "ALL": days = 365 * 10; break;
    default: days = 30;
  }

  const points = Math.min(days, 60);

  for (let i = 0; i < points; i++) {
    const progress = i / points;
    const growth = Math.pow(1 + 0.001, i);

    const date = new Date();
    date.setDate(date.getDate() - (days - Math.floor(i * days / points)));

    // Create stacked layers
    const nav = baseNav * growth * (1 + (Math.random() - 0.5) * 0.02);
    const dividends = nav * 0.05 * (1 + Math.random() * 0.3);
    const capitalGains = nav * 0.08 * growth;
    const performance = nav * 0.12 * (1 + progress * 0.5);

    data.push({
      date: date.toLocaleDateString("ar-MA", { month: "short", day: "numeric" }),
      fullDate: date.toISOString(),
      nav: Number(nav.toFixed(2)),
      dividends: Number(dividends.toFixed(2)),
      capitalGains: Number(capitalGains.toFixed(2)),
      performance: Number(performance.toFixed(2)),
      total: Number((nav + dividends + capitalGains + performance).toFixed(2)),
    });
  }

  return data;
};

const FundStackedChart = ({ fund }: FundStackedChartProps) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [period, setPeriod] = useState("1Y");

  const data = useMemo(() => generateStackedData(fund.nav, period), [fund.nav, period]);

  const periods = [
    { key: "1M", label: isRTL ? "شهر" : "1M" },
    { key: "3M", label: isRTL ? "3 أشهر" : "3M" },
    { key: "6M", label: isRTL ? "6 أشهر" : "6M" },
    { key: "1Y", label: isRTL ? "سنة" : "1Y" },
    { key: "3Y", label: isRTL ? "3 سنوات" : "3Y" },
    { key: "5Y", label: isRTL ? "5 سنوات" : "5Y" },
    { key: "ALL", label: isRTL ? "الكل" : "ALL" },
  ];

  const layers = [
    { key: "nav", name: isRTL ? "صافي الأصول" : "NAV", color: "#4f6dce" },
    { key: "dividends", name: isRTL ? "التوزيعات" : "Dividends", color: "#7ba3e8" },
    { key: "capitalGains", name: isRTL ? "مكاسب رأس المال" : "Capital Gains", color: "#a8c8f0" },
    { key: "performance", name: isRTL ? "الأداء" : "Performance", color: "#d4e4f7" },
  ];

  const CustomTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-4 shadow-lg">
          <p className="text-sm font-medium text-foreground mb-2">{label}</p>
          {[...payload].reverse().map((entry, index: number) => (
            <div key={index} className="flex items-center justify-between gap-4 text-sm">
              <span className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                {entry.name}
              </span>
              <span className="font-medium text-foreground">
                {entry.value.toLocaleString()} MAD
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
            {isRTL ? "تطور صافي قيمة الأصول" : "NAV Evolution"}
          </h3>
          <p className="text-sm text-muted-foreground">
            {isRTL ? "التحليل المتراكم للقيمة" : "Stacked value analysis"}
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

      {/* Chart */}
      <div className="h-[400px] relative">
        {/* Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <span className="text-6xl font-bold text-muted-foreground/5">CASABLUE</span>
        </div>

        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              {layers.map((layer) => (
                <linearGradient key={layer.key} id={`gradient-${layer.key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={layer.color} stopOpacity={0.9} />
                  <stop offset="95%" stopColor={layer.color} stopOpacity={0.6} />
                </linearGradient>
              ))}
            </defs>

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
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
            />

            <Tooltip content={<CustomTooltip />} />

            {layers.map((layer) => (
              <Area
                key={layer.key}
                type="monotone"
                dataKey={layer.key}
                name={layer.name}
                stackId="1"
                stroke={layer.color}
                strokeWidth={1}
                fill={`url(#gradient-${layer.key})`}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-6 mt-6 pt-4 border-t border-border">
        {layers.map((layer) => (
          <div key={layer.key} className="flex items-center gap-2">
            <span
              className="w-4 h-4 rounded"
              style={{ backgroundColor: layer.color }}
            />
            <span className="text-sm text-muted-foreground">{layer.name}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default FundStackedChart;
