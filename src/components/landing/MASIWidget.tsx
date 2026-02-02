import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Activity, BarChart2, Clock, Users, ChevronLeft } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { Link } from "react-router-dom";
import { useStockData } from "@/hooks/useStockData";

// Generate chart data based on time
const generateChartData = () => {
  const data = [];
  const baseValue = 14234;
  const now = new Date();
  
  for (let i = 30; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const variation = Math.sin(i * 0.3) * 200 + Math.random() * 100;
    data.push({
      date: date.toLocaleDateString('ar-MA', { day: 'numeric', month: 'short' }),
      value: Math.round(baseValue + variation),
      volume: Math.round(100 + Math.random() * 50),
    });
  }
  return data;
};

const chartData = generateChartData();

const MASIWidget = () => {
  const { data, isLoading } = useStockData();
  
  // Calculate market stats from real data
  const stocks = data?.stocks || [];
  const gainers = stocks.filter(s => s.change > 0).length;
  const losers = stocks.filter(s => s.change < 0).length;
  const totalVolume = stocks.reduce((acc, s) => acc + s.marketCap * 0.001, 0);
  
  const indices = [
    { name: "MASI", value: "14,234.56", change: 1.24, isPositive: true },
    { name: "MADEX", value: "11,567.89", change: 0.98, isPositive: true },
    { name: "MSI20", value: "1,256.34", change: -0.45, isPositive: false },
  ];

  const stats = [
    { icon: Activity, label: "حجم التداول", value: `${(totalVolume / 1000).toFixed(1)}M`, color: "text-chart-line" },
    { icon: Users, label: "صاعدة / هابطة", value: `${gainers}/${losers}`, color: gainers > losers ? "text-success" : "text-destructive" },
    { icon: BarChart2, label: "الصفقات", value: `${Math.round(2500 + Math.random() * 500)}`, color: "text-primary" },
    { icon: Clock, label: "آخر تحديث", value: new Date().toLocaleTimeString('ar-MA', { hour: '2-digit', minute: '2-digit' }), color: "text-muted-foreground" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-card rounded-2xl border border-border overflow-hidden"
    >
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <BarChart2 className="w-4 h-4 text-primary" />
            </div>
            مؤشرات السوق
          </h3>
          <Link 
            to="/screener"
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            عرض التفاصيل
            <ChevronLeft className="w-4 h-4" />
          </Link>
        </div>

        {/* Indices Row */}
        <div className="flex items-center gap-4 overflow-x-auto pb-2">
          {indices.map((index, i) => (
            <div 
              key={index.name}
              className={`flex-shrink-0 p-3 rounded-xl ${i === 0 ? 'bg-primary/10' : 'bg-secondary/50'}`}
            >
              <p className="text-xs text-muted-foreground mb-1">{index.name}</p>
              <div className="flex items-center gap-2">
                <span className={`text-lg font-bold ${i === 0 ? 'text-primary' : 'text-foreground'}`}>
                  {index.value}
                </span>
                <span className={`flex items-center text-sm font-medium ${
                  index.isPositive ? "text-success" : "text-destructive"
                }`}>
                  {index.isPositive ? (
                    <TrendingUp className="w-3 h-3 ml-1" />
                  ) : (
                    <TrendingDown className="w-3 h-3 ml-1" />
                  )}
                  {index.isPositive ? "+" : ""}{index.change}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-2">
            {["1D", "1W", "1M", "3M", "1Y"].map((period, i) => (
              <button
                key={period}
                className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
                  i === 2
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>

        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="masiGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                interval="preserveStartEnd"
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                domain={['dataMin - 100', 'dataMax + 100']}
                orientation="left"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#masiGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Stats Footer */}
      <div className="grid grid-cols-4 gap-2 p-4 bg-secondary/30 border-t border-border">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <stat.icon className={`w-4 h-4 mx-auto mb-1 ${stat.color}`} />
            <p className="text-xs text-muted-foreground">{stat.label}</p>
            <p className={`text-sm font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default MASIWidget;
