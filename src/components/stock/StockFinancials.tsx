import { useState } from "react";
import { motion } from "framer-motion";
import { Info, ChevronDown, ChevronUp } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { Tooltip as UITooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

// Mock financial data
const financialData = [
  { year: "2020", revenue: 35200, ebitda: 18500, netIncome: 5800, fcf: 7200 },
  { year: "2021", revenue: 36800, ebitda: 19200, netIncome: 6100, fcf: 7800 },
  { year: "2022", revenue: 38500, ebitda: 20100, netIncome: 6500, fcf: 8200 },
  { year: "2023", revenue: 39800, ebitda: 20800, netIncome: 6800, fcf: 8600 },
  { year: "2024", revenue: 41200, ebitda: 21500, netIncome: 7200, fcf: 9100 },
];

const incomeStatement = [
  { label: "الإيرادات", value: "41,200", change: "+3.5%" },
  { label: "تكلفة المبيعات", value: "-18,300", change: "+2.8%" },
  { label: "الربح الإجمالي", value: "22,900", change: "+4.1%" },
  { label: "المصاريف التشغيلية", value: "-8,400", change: "+3.2%" },
  { label: "EBITDA", value: "21,500", change: "+3.4%" },
  { label: "الاستهلاك والإطفاء", value: "-7,000", change: "+2.1%" },
  { label: "الربح التشغيلي", value: "14,500", change: "+4.2%" },
  { label: "المصاريف المالية", value: "-1,800", change: "-5.3%" },
  { label: "صافي الربح", value: "7,200", change: "+5.9%" },
];

const balanceSheet = [
  { label: "إجمالي الأصول", value: "125,000", category: "أصول" },
  { label: "الأصول المتداولة", value: "28,500", category: "أصول" },
  { label: "الأصول الثابتة", value: "72,000", category: "أصول" },
  { label: "إجمالي الالتزامات", value: "52,000", category: "التزامات" },
  { label: "الديون طويلة الأجل", value: "35,000", category: "التزامات" },
  { label: "حقوق المساهمين", value: "73,000", category: "حقوق" },
];

const StockFinancials = () => {
  const [activeTab, setActiveTab] = useState<"chart" | "income" | "balance">("chart");
  const [showAllIncome, setShowAllIncome] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-card rounded-2xl border border-border p-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-foreground">البيانات المالية</h2>
          <UITooltip>
            <TooltipTrigger>
              <Info className="w-4 h-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p>البيانات المالية السنوية للشركة. الأرقام بالمليون درهم.</p>
            </TooltipContent>
          </UITooltip>
        </div>

        <div className="flex gap-2">
          {[
            { key: "chart", label: "الرسم" },
            { key: "income", label: "الدخل" },
            { key: "balance", label: "الميزانية" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
              className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
                activeTab === tab.key
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "chart" && (
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={financialData} barCategoryGap="20%">
              <XAxis
                dataKey="year"
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}B`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
                formatter={(value: number, name: string) => {
                  const labels: Record<string, string> = {
                    revenue: "الإيرادات",
                    ebitda: "EBITDA",
                    netIncome: "صافي الربح",
                  };
                  return [`${(value / 1000).toFixed(1)}B MAD`, labels[name] || name];
                }}
              />
              <Legend
                formatter={(value: string) => {
                  const labels: Record<string, string> = {
                    revenue: "الإيرادات",
                    ebitda: "EBITDA",
                    netIncome: "صافي الربح",
                  };
                  return labels[value] || value;
                }}
              />
              <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="ebitda" fill="hsl(var(--chart-line))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="netIncome" fill="hsl(var(--chart-positive))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {activeTab === "income" && (
        <div className="space-y-1">
          {(showAllIncome ? incomeStatement : incomeStatement.slice(0, 5)).map((item, index) => (
            <div
              key={item.label}
              className={`flex items-center justify-between py-2 px-3 rounded-lg ${
                index % 2 === 0 ? "bg-secondary/30" : ""
              }`}
            >
              <span className="text-sm text-muted-foreground">{item.label}</span>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-foreground">{item.value}M</span>
                <span className={`text-xs ${
                  item.change.startsWith("+") ? "text-chart-positive" : "text-chart-negative"
                }`}>
                  {item.change}
                </span>
              </div>
            </div>
          ))}
          <button
            onClick={() => setShowAllIncome(!showAllIncome)}
            className="w-full flex items-center justify-center gap-1 py-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {showAllIncome ? (
              <>
                <ChevronUp className="w-4 h-4" />
                عرض أقل
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                عرض الكل
              </>
            )}
          </button>
        </div>
      )}

      {activeTab === "balance" && (
        <div className="space-y-4">
          {["أصول", "التزامات", "حقوق"].map((category) => (
            <div key={category}>
              <h3 className="text-xs font-medium text-muted-foreground mb-2">{category}</h3>
              <div className="space-y-1">
                {balanceSheet
                  .filter((item) => item.category === category)
                  .map((item, index) => (
                    <div
                      key={item.label}
                      className={`flex items-center justify-between py-2 px-3 rounded-lg ${
                        index % 2 === 0 ? "bg-secondary/30" : ""
                      }`}
                    >
                      <span className="text-sm text-muted-foreground">{item.label}</span>
                      <span className="text-sm font-medium text-foreground">{item.value}M</span>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Source */}
      <div className="mt-4 pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground">
          المصدر: التقرير السنوي 2024 • آخر تحديث: 15 مارس 2024
        </p>
      </div>
    </motion.div>
  );
};

export default StockFinancials;
