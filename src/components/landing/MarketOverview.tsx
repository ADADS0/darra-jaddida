import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Activity, BarChart2, Users, Clock } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

const chartData = [
  { date: "Jan", value: 12800 },
  { date: "Feb", value: 12950 },
  { date: "Mar", value: 12700 },
  { date: "Apr", value: 13100 },
  { date: "May", value: 13250 },
  { date: "Jun", value: 13080 },
  { date: "Jul", value: 13400 },
  { date: "Aug", value: 13620 },
  { date: "Sep", value: 13450 },
  { date: "Oct", value: 13800 },
  { date: "Nov", value: 14050 },
  { date: "Dec", value: 14234 },
];

const indices = [
  { name: "MASI", value: "14,234.56", change: "+1.24%", isPositive: true },
  { name: "MADEX", value: "11,567.89", change: "+0.98%", isPositive: true },
];

const stats = [
  { icon: Activity, label: "حجم التداول", value: "124.5M MAD" },
  { icon: BarChart2, label: "الصفقات", value: "2,847" },
  { icon: Users, label: "رابحون/خاسرون", value: "45/28" },
  { icon: Clock, label: "آخر تحديث", value: "15:30" },
];

const MarketOverview = () => {
  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            نظرة على السوق
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            تتبّع أداء مؤشر MASI وحركة السوق في لحظة
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-2 bg-card rounded-2xl border border-border p-6 card-elevated"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                {indices.map((index) => (
                  <div key={index.name} className="text-right">
                    <p className="text-xs text-muted-foreground">{index.name}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold text-foreground">{index.value}</span>
                      <span className={`flex items-center text-sm font-medium ${index.isPositive ? "text-chart-positive" : "text-chart-negative"}`}>
                        {index.isPositive ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                        {index.change}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                {["1D", "1W", "1M", "1Y"].map((period) => (
                  <button
                    key={period}
                    className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
                      period === "1Y" 
                        ? "bg-primary text-primary-foreground" 
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    }`}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false}
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false}
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    domain={['dataMin - 200', 'dataMax + 200']}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      boxShadow: 'var(--shadow-elevated)',
                    }}
                    labelStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorValue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col gap-4"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.1 * index }}
                className="bg-card rounded-xl border border-border p-5 card-elevated hover:border-primary/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <stat.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-right flex-1">
                    <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
                    <p className="text-lg font-bold text-foreground">{stat.value}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default MarketOverview;
