import { useState } from "react";
import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Fund } from "@/hooks/useFundData";

interface FundNAVChartProps {
  fund: Fund | { nav: number; name: string };
}

const generateMockNAVData = (baseNav: number, period: string) => {
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

  const startNav = baseNav * (1 - Math.random() * 0.2);
  
  for (let i = 0; i < Math.min(days, 100); i++) {
    const progress = i / Math.min(days, 100);
    const trend = startNav + (baseNav - startNav) * progress;
    const noise = (Math.random() - 0.5) * baseNav * 0.02;
    
    const date = new Date();
    date.setDate(date.getDate() - (days - Math.floor(i * days / 100)));
    
    data.push({
      date: date.toLocaleDateString("ar-MA", { month: "short", day: "numeric" }),
      nav: Number((trend + noise).toFixed(2)),
    });
  }
  
  return data;
};

const FundNAVChart = ({ fund }: FundNAVChartProps) => {
  const [period, setPeriod] = useState("1Y");
  const data = generateMockNAVData(fund.nav, period);

  const periods = [
    { key: "1M", label: "شهر" },
    { key: "3M", label: "3 أشهر" },
    { key: "6M", label: "6 أشهر" },
    { key: "1Y", label: "سنة" },
    { key: "3Y", label: "3 سنوات" },
    { key: "5Y", label: "5 سنوات" },
    { key: "ALL", label: "الكل" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-2xl border border-border p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">تطور صافي قيمة الأصول</h3>
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

      <div className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="navGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="date" 
              stroke="hsl(var(--muted-foreground))" 
              fontSize={12}
              tickLine={false}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))" 
              fontSize={12}
              tickLine={false}
              domain={['dataMin - 10', 'dataMax + 10']}
              tickFormatter={(value) => value.toFixed(0)}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                color: "hsl(var(--foreground))",
              }}
              formatter={(value: number) => [`${value.toFixed(2)} MAD`, "NAV"]}
            />
            <Area
              type="monotone"
              dataKey="nav"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              fill="url(#navGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default FundNAVChart;
