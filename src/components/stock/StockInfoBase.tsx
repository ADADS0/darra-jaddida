import { motion } from "framer-motion";
import { Info, ExternalLink, Building2, Hash, Users, Globe } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from "recharts";

interface StockInfoBaseProps {
  stock: {
    symbol: string;
    name: string;
    nameEn: string;
    sector: string;
    sectorEn: string;
    description?: string;
  };
}

// Mock data - would come from API
const getStockInfo = (symbol: string) => ({
  isin: `MA000001${symbol.slice(0, 2)}01`,
  sharesOutstanding: Math.floor(Math.random() * 100) + 20,
  website: `https://www.${symbol.toLowerCase()}.ma`,
  headquarters: "الدار البيضاء، المغرب",
  founded: 1990 + Math.floor(Math.random() * 30),
  employees: Math.floor(Math.random() * 10000) + 500,
  shareholders: [
    { name: "المساهمون الرئيسيون", value: 45 + Math.floor(Math.random() * 10), color: "#2962ff" },
    { name: "مستثمرون مؤسسيون", value: 25 + Math.floor(Math.random() * 10), color: "#089981" },
    { name: "التداول الحر", value: 15 + Math.floor(Math.random() * 5), color: "#f23645" },
    { name: "آخرون", value: 10 + Math.floor(Math.random() * 5), color: "#787b86" },
  ],
});

const StockInfoBase = ({ stock }: StockInfoBaseProps) => {
  const info = getStockInfo(stock.symbol);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-card rounded-2xl border border-border p-6"
    >
      <div className="flex items-center gap-2 mb-6">
        <h2 className="text-lg font-semibold text-foreground">المعلومات الأساسية</h2>
        <Tooltip>
          <TooltipTrigger>
            <Info className="w-4 h-4 text-muted-foreground" />
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">
            <p>معلومات أساسية عن الشركة وهيكل الملكية</p>
          </TooltipContent>
        </Tooltip>
      </div>

      {/* Company Description */}
      <div className="mb-6 p-4 bg-secondary/30 rounded-xl">
        <h3 className="text-sm font-medium text-primary mb-2">نبذة عن الشركة</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {stock.description || `${stock.nameEn} هي شركة مغربية رائدة في قطاع ${stock.sector}.`}
        </p>
      </div>

      {/* Basic Info Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="flex items-center gap-3 p-3 bg-secondary/20 rounded-lg">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Hash className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">كود ISIN</p>
            <p className="text-sm font-medium text-foreground">{info.isin}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-secondary/20 rounded-lg">
          <div className="w-10 h-10 rounded-lg bg-chart-positive/10 flex items-center justify-center">
            <Users className="w-5 h-5 text-chart-positive" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">عدد الأسهم</p>
            <p className="text-sm font-medium text-foreground">{info.sharesOutstanding}M</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-secondary/20 rounded-lg">
          <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-warning" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">المقر الرئيسي</p>
            <p className="text-sm font-medium text-foreground">{info.headquarters}</p>
          </div>
        </div>

        <a
          href={info.website}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 p-3 bg-secondary/20 rounded-lg hover:bg-secondary/40 transition-colors group"
        >
          <div className="w-10 h-10 rounded-lg bg-tv/10 flex items-center justify-center">
            <Globe className="w-5 h-5 text-tv" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground">الموقع الإلكتروني</p>
            <p className="text-sm font-medium text-foreground truncate">زيارة الموقع</p>
          </div>
          <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
        </a>
      </div>

      {/* Shareholder Structure */}
      <div>
        <h3 className="text-sm font-medium text-foreground mb-4">هيكل الملكية</h3>
        <div className="flex items-center gap-6">
          {/* Pie Chart */}
          <div className="w-32 h-32">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={info.shareholders}
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={55}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {info.shareholders.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                  formatter={(value: number, name: string) => [`${value}%`, name]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="flex-1 space-y-2">
            {info.shareholders.map((shareholder) => (
              <div key={shareholder.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: shareholder.color }}
                  />
                  <span className="text-sm text-muted-foreground">{shareholder.name}</span>
                </div>
                <span className="text-sm font-semibold text-foreground">{shareholder.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default StockInfoBase;
