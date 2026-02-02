import { motion } from "framer-motion";
import { X, TrendingUp, TrendingDown, Info } from "lucide-react";
import { Fund } from "@/hooks/useFundData";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface FundCompareModalProps {
  funds: Fund[];
  onClose: () => void;
}

const COLORS = ["hsl(var(--primary))", "hsl(199 89% 48%)", "hsl(280 65% 60%)", "hsl(38 92% 50%)"];

const formatLargeNumber = (num: number): string => {
  if (num >= 1e9) return (num / 1e9).toFixed(2) + " مليار";
  if (num >= 1e6) return (num / 1e6).toFixed(0) + " مليون";
  return num.toLocaleString();
};

const getCategoryColor = (category: string): string => {
  switch (category) {
    case "أسهم": return "bg-emerald-500/20 text-emerald-400";
    case "سندات": return "bg-blue-500/20 text-blue-400";
    case "متوازن": return "bg-purple-500/20 text-purple-400";
    case "نقدي": return "bg-yellow-500/20 text-yellow-400";
    case "تعاقدي": return "bg-orange-500/20 text-orange-400";
    default: return "bg-muted text-muted-foreground";
  }
};

// Generate mock comparison chart data
const generateComparisonData = (funds: Fund[]) => {
  const data = [];
  const baseDate = new Date();
  baseDate.setFullYear(baseDate.getFullYear() - 1);

  for (let i = 0; i <= 12; i++) {
    const date = new Date(baseDate);
    date.setMonth(date.getMonth() + i);

    const point: Record<string, string | number> = {
      month: date.toLocaleDateString("ar-MA", { month: "short" }),
    };

    funds.forEach((fund, index) => {
      const baseReturn = fund.returns["1Y"] / 12;
      const variation = Math.sin((i + index * 2) * 0.5) * 2;
      point[fund.id] = 100 + (i * baseReturn) + variation;
    });

    data.push(point);
  }

  return data;
};

// Helper function to safely get fund property value
const getFundValue = (fund: Fund, key: string): number => {
  switch (key) {
    case "nav": return fund.nav;
    case "changePercent": return fund.changePercent;
    default: return 0;
  }
};

const FundCompareModal = ({ funds, onClose }: FundCompareModalProps) => {
  const chartData = generateComparisonData(funds);

  const comparisonMetrics = [
    { key: "nav", label: "صافي قيمة الأصول", format: (v: number) => v.toFixed(2) + " MAD" },
    { key: "changePercent", label: "التغير اليومي", format: (v: number) => (v >= 0 ? "+" : "") + v.toFixed(2) + "%" },
    { key: "return1M", label: "العائد (شهر)", getValue: (f: Fund) => f.returns["1M"], format: (v: number) => (v >= 0 ? "+" : "") + v.toFixed(2) + "%" },
    { key: "return1Y", label: "العائد (سنة)", getValue: (f: Fund) => f.returns["1Y"], format: (v: number) => (v >= 0 ? "+" : "") + v.toFixed(2) + "%" },
    { key: "return3Y", label: "العائد (3 سنوات)", getValue: (f: Fund) => f.returns["3Y"], format: (v: number) => (v >= 0 ? "+" : "") + v.toFixed(2) + "%" },
    { key: "volatility", label: "التقلب", getValue: (f: Fund) => f.risk.volatility, format: (v: number) => v.toFixed(2) + "%" },
    { key: "sharpeRatio", label: "نسبة شارب", getValue: (f: Fund) => f.risk.sharpeRatio, format: (v: number) => v.toFixed(2) },
    { key: "maxDrawdown", label: "أقصى خسارة", getValue: (f: Fund) => f.risk.maxDrawdown, format: (v: number) => v.toFixed(2) + "%" },
    { key: "managementFee", label: "رسوم الإدارة", getValue: (f: Fund) => f.fees.managementFee, format: (v: number) => v.toFixed(2) + "%" },
    { key: "ongoingCharges", label: "الرسوم الجارية", getValue: (f: Fund) => f.fees.ongoingCharges, format: (v: number) => v.toFixed(2) + "%" },
    { key: "aum", label: "الأصول المدارة", getValue: (f: Fund) => f.aum, format: formatLargeNumber },
    { key: "minInvestment", label: "الحد الأدنى", getValue: (f: Fund) => f.minInvestment, format: (v: number) => v.toLocaleString() + " MAD" },
  ];

  const getBestValue = (metricKey: string, values: number[]): number => {
    // Higher is better for returns, sharpe; lower is better for fees, volatility, drawdown
    const lowerIsBetter = ["volatility", "maxDrawdown", "managementFee", "ongoingCharges", "minInvestment"];
    if (lowerIsBetter.includes(metricKey)) {
      return Math.min(...values.filter(v => !isNaN(v)));
    }
    return Math.max(...values.filter(v => !isNaN(v)));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-card border border-border rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-bold text-foreground">مقارنة الصناديق</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-80px)] p-6">
          {/* Fund Headers */}
          <div className="grid gap-4 mb-6" style={{ gridTemplateColumns: `200px repeat(${funds.length}, 1fr)` }}>
            <div />
            {funds.map((fund, index) => (
              <div
                key={fund.id}
                className="p-4 rounded-xl border-2"
                style={{ borderColor: COLORS[index] }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(fund.category)}`}>
                    {fund.category}
                  </span>
                </div>
                <h3 className="font-bold text-foreground">{fund.name}</h3>
                <p className="text-sm text-muted-foreground">{fund.manager}</p>
              </div>
            ))}
          </div>

          {/* Performance Chart */}
          <div className="bg-secondary/30 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">مقارنة الأداء (سنة واحدة)</h3>
            <div className="h-[300px]">
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
                    domain={['dataMin - 5', 'dataMax + 5']}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      color: "hsl(var(--foreground))",
                    }}
                  />
                  <Legend />
                  {funds.map((fund, index) => (
                    <Line
                      key={fund.id}
                      type="monotone"
                      dataKey={fund.id}
                      name={fund.name}
                      stroke={COLORS[index]}
                      strokeWidth={2}
                      dot={false}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Comparison Table */}
          <div className="bg-secondary/30 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-right p-4 font-semibold text-foreground">المؤشر</th>
                  {funds.map((fund, index) => (
                    <th
                      key={fund.id}
                      className="p-4 font-semibold text-center"
                      style={{ color: COLORS[index] }}
                    >
                      {fund.nameEn}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonMetrics.map((metric) => {
                  const values = funds.map(f => {
                    if (metric.getValue) return metric.getValue(f);
                    return getFundValue(f, metric.key);
                  });
                  const bestValue = getBestValue(metric.key, values);

                  return (
                    <tr key={metric.key} className="border-b border-border/50 hover:bg-secondary/50">
                      <td className="p-4 text-muted-foreground">{metric.label}</td>
                      {funds.map((fund, index) => {
                        const value = metric.getValue ? metric.getValue(fund) : getFundValue(fund, metric.key);
                        const isBest = value === bestValue;
                        const isReturn = metric.key.includes("return") || metric.key === "changePercent";
                        const isPositive = isReturn && value >= 0;
                        const isNegative = isReturn && value < 0;

                        return (
                          <td
                            key={fund.id}
                            className={`p-4 text-center font-medium ${
                              isBest ? "bg-primary/10" : ""
                            } ${isPositive ? "text-chart-positive" : ""} ${isNegative ? "text-chart-negative" : ""}`}
                          >
                            {metric.format(value)}
                            {isBest && <span className="mr-2 text-primary">✓</span>}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Summary */}
          <div className="mt-6 p-4 bg-primary/10 border border-primary/20 rounded-xl">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <h4 className="font-semibold text-foreground mb-1">ملاحظة</h4>
                <p className="text-sm text-muted-foreground">
                  الأداء السابق لا يضمن النتائج المستقبلية. يرجى مراجعة نشرة الإصدار الخاصة بكل صندوق قبل الاستثمار.
                  تم تحديد أفضل قيمة لكل مؤشر بعلامة ✓.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default FundCompareModal;
