import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, ArrowUpDown } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Fund } from "@/hooks/useFundData";

interface FundComparisonProps {
  fund: Fund | {
    id: string;
    name: string;
    nameEn: string;
    category: string;
    nav: number;
    returns: Record<string, number>;
    risk: {
      volatility: number;
      sharpeRatio: number;
    };
    fees: {
      ongoingCharges: number;
    };
    aum: number;
  };
}

// Mock similar funds data
const getSimilarFunds = (category: string) => [
  {
    id: "WAFA-ACTIONS",
    name: "وفا للأسهم",
    nameEn: "Wafa Actions",
    nav: 1320.45,
    return1Y: 10.25,
    return3Y: 24.50,
    volatility: 11.8,
    sharpeRatio: 1.15,
    fees: 1.6,
    aum: 1800000000,
  },
  {
    id: "CDG-EXPANSION",
    name: "CDG للنمو",
    nameEn: "CDG Expansion",
    nav: 985.30,
    return1Y: 8.75,
    return3Y: 20.30,
    volatility: 13.2,
    sharpeRatio: 0.95,
    fees: 1.45,
    aum: 2100000000,
  },
  {
    id: "BMCE-CAPITAL",
    name: "BMCE كابيتال",
    nameEn: "BMCE Capital Growth",
    nav: 1156.80,
    return1Y: 11.50,
    return3Y: 26.80,
    volatility: 12.5,
    sharpeRatio: 1.30,
    fees: 1.55,
    aum: 1650000000,
  },
  {
    id: "RMA-DYNAMIQUE",
    name: "RMA ديناميك",
    nameEn: "RMA Dynamique",
    nav: 892.15,
    return1Y: 9.80,
    return3Y: 22.15,
    volatility: 14.0,
    sharpeRatio: 1.05,
    fees: 1.70,
    aum: 980000000,
  },
];

const generateComparisonChartData = () => {
  const data = [];
  const baseDate = new Date();
  baseDate.setFullYear(baseDate.getFullYear() - 1);

  for (let i = 0; i <= 12; i++) {
    const date = new Date(baseDate);
    date.setMonth(date.getMonth() + i);

    data.push({
      month: date.toLocaleDateString("ar-MA", { month: "short" }),
      fund: 100 + Math.random() * 15,
      benchmark: 100 + Math.random() * 12,
      category: 100 + Math.random() * 10,
    });
  }

  return data;
};

const formatLargeNumber = (num: number): string => {
  if (num >= 1e9) return (num / 1e9).toFixed(1) + " مليار";
  if (num >= 1e6) return (num / 1e6).toFixed(0) + " مليون";
  return num.toLocaleString();
};

const FundComparison = ({ fund }: FundComparisonProps) => {
  const similarFunds = getSimilarFunds(fund.category);
  const chartData = generateComparisonChartData();

  const getReturnColor = (value: number) => {
    if (value > 0) return "text-chart-positive";
    if (value < 0) return "text-chart-negative";
    return "text-muted-foreground";
  };

  return (
    <div className="space-y-6">
      {/* Performance Comparison Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-2xl border border-border p-6"
      >
        <h3 className="text-lg font-semibold text-foreground mb-6">مقارنة الأداء (سنة واحدة)</h3>
        
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="month" 
                stroke="hsl(var(--muted-foreground))" 
                fontSize={11}
                tickLine={false}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))" 
                fontSize={11}
                tickLine={false}
                domain={[95, 120]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  color: "hsl(var(--foreground))",
                }}
                formatter={(value: number, name: string) => {
                  const label = name === "fund" ? fund.name : 
                               name === "benchmark" ? "المؤشر" : "متوسط الفئة";
                  return [`${value.toFixed(2)}`, label];
                }}
              />
              <Legend 
                formatter={(value) => {
                  const label = value === "fund" ? fund.name : 
                               value === "benchmark" ? "المؤشر" : "متوسط الفئة";
                  return <span className="text-foreground text-xs">{label}</span>;
                }}
              />
              <Line
                type="monotone"
                dataKey="fund"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="benchmark"
                stroke="hsl(var(--muted-foreground))"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="category"
                stroke="hsl(199 89% 48%)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Funds Comparison Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card rounded-2xl border border-border p-6"
      >
        <h3 className="text-lg font-semibold text-foreground mb-6">صناديق مشابهة</h3>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">الصندوق</TableHead>
                <TableHead className="text-center">NAV</TableHead>
                <TableHead className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    العائد (سنة)
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </TableHead>
                <TableHead className="text-center">العائد (3 سنوات)</TableHead>
                <TableHead className="text-center">التقلب</TableHead>
                <TableHead className="text-center">شارب</TableHead>
                <TableHead className="text-center">الرسوم</TableHead>
                <TableHead className="text-center">الأصول</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Current Fund - Highlighted */}
              <TableRow className="bg-primary/5 border-primary/20">
                <TableCell className="font-medium">
                  <div>
                    <p className="text-foreground font-semibold">{fund.name}</p>
                    <p className="text-xs text-muted-foreground">{fund.nameEn}</p>
                  </div>
                </TableCell>
                <TableCell className="text-center font-semibold">{fund.nav.toFixed(2)}</TableCell>
                <TableCell className={`text-center font-semibold ${getReturnColor(fund.returns["1Y"])}`}>
                  <div className="flex items-center justify-center gap-1">
                    {fund.returns["1Y"] > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {fund.returns["1Y"] > 0 ? "+" : ""}{fund.returns["1Y"]}%
                  </div>
                </TableCell>
                <TableCell className={`text-center ${getReturnColor(fund.returns["3Y"])}`}>
                  {fund.returns["3Y"] > 0 ? "+" : ""}{fund.returns["3Y"]}%
                </TableCell>
                <TableCell className="text-center">{fund.risk.volatility}%</TableCell>
                <TableCell className="text-center">{fund.risk.sharpeRatio.toFixed(2)}</TableCell>
                <TableCell className="text-center">{fund.fees.ongoingCharges}%</TableCell>
                <TableCell className="text-center text-sm">{formatLargeNumber(fund.aum)}</TableCell>
              </TableRow>

              {/* Similar Funds */}
              {similarFunds.map((f) => (
                <TableRow key={f.id} className="hover:bg-secondary/30 cursor-pointer">
                  <TableCell>
                    <div>
                      <p className="text-foreground">{f.name}</p>
                      <p className="text-xs text-muted-foreground">{f.nameEn}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">{f.nav.toFixed(2)}</TableCell>
                  <TableCell className={`text-center ${getReturnColor(f.return1Y)}`}>
                    <div className="flex items-center justify-center gap-1">
                      {f.return1Y > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {f.return1Y > 0 ? "+" : ""}{f.return1Y}%
                    </div>
                  </TableCell>
                  <TableCell className={`text-center ${getReturnColor(f.return3Y)}`}>
                    {f.return3Y > 0 ? "+" : ""}{f.return3Y}%
                  </TableCell>
                  <TableCell className="text-center">{f.volatility}%</TableCell>
                  <TableCell className="text-center">{f.sharpeRatio.toFixed(2)}</TableCell>
                  <TableCell className="text-center">{f.fees}%</TableCell>
                  <TableCell className="text-center text-sm">{formatLargeNumber(f.aum)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Category Stats */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-secondary/30 rounded-xl">
            <p className="text-xs text-muted-foreground mb-1">متوسط العائد (سنة)</p>
            <p className="text-lg font-bold text-chart-positive">+10.08%</p>
          </div>
          <div className="text-center p-4 bg-secondary/30 rounded-xl">
            <p className="text-xs text-muted-foreground mb-1">متوسط التقلب</p>
            <p className="text-lg font-bold text-foreground">12.88%</p>
          </div>
          <div className="text-center p-4 bg-secondary/30 rounded-xl">
            <p className="text-xs text-muted-foreground mb-1">متوسط الرسوم</p>
            <p className="text-lg font-bold text-foreground">1.58%</p>
          </div>
          <div className="text-center p-4 bg-secondary/30 rounded-xl">
            <p className="text-xs text-muted-foreground mb-1">عدد الصناديق</p>
            <p className="text-lg font-bold text-foreground">24</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default FundComparison;
