import { motion } from "framer-motion";
import { Info, TrendingUp, TrendingDown } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface StockMetricsProps {
  stock: {
    per: number;
    pb: number;
    evEbitda: number;
    dividendYield: number;
    roe: number;
    debtToEquity: number;
    currentRatio: number;
  };
}

const metrics = [
  {
    key: "per",
    label: "PER",
    labelAr: "مكرر الأرباح",
    description: "نسبة سعر السهم إلى ربحية السهم. كلما انخفض، كان السهم أرخص نسبياً.",
    benchmark: 15,
    format: (v: number) => v.toFixed(1),
    inverse: true,
  },
  {
    key: "pb",
    label: "P/B",
    labelAr: "السعر للقيمة الدفترية",
    description: "نسبة سعر السهم إلى القيمة الدفترية. أقل من 1 يعني تداول تحت القيمة الدفترية.",
    benchmark: 2,
    format: (v: number) => v.toFixed(2),
    inverse: true,
  },
  {
    key: "evEbitda",
    label: "EV/EBITDA",
    labelAr: "قيمة المنشأة للأرباح",
    description: "مقياس تقييم يأخذ بعين الاعتبار الديون. أقل من 10 يعتبر جيداً عموماً.",
    benchmark: 10,
    format: (v: number) => v.toFixed(1),
    inverse: true,
  },
  {
    key: "dividendYield",
    label: "Dividend Yield",
    labelAr: "عائد التوزيعات",
    description: "نسبة التوزيعات السنوية إلى سعر السهم. عائد مرتفع يعني دخل أكبر.",
    benchmark: 3,
    format: (v: number) => v.toFixed(1) + "%",
    inverse: false,
  },
  {
    key: "roe",
    label: "ROE",
    labelAr: "العائد على حقوق الملكية",
    description: "مقياس كفاءة الشركة في تحقيق أرباح من رأس مال المساهمين. أعلى من 15% جيد.",
    benchmark: 15,
    format: (v: number) => v.toFixed(1) + "%",
    inverse: false,
  },
  {
    key: "debtToEquity",
    label: "D/E",
    labelAr: "الديون لحقوق الملكية",
    description: "نسبة إجمالي الديون إلى حقوق المساهمين. أقل من 1 يعني ديون معتدلة.",
    benchmark: 1,
    format: (v: number) => v.toFixed(2),
    inverse: true,
  },
  {
    key: "currentRatio",
    label: "Current Ratio",
    labelAr: "نسبة التداول",
    description: "قدرة الشركة على سداد التزاماتها قصيرة الأجل. أكثر من 1 يعني سيولة كافية.",
    benchmark: 1,
    format: (v: number) => v.toFixed(2),
    inverse: false,
  },
];

const StockMetrics = ({ stock }: StockMetricsProps) => {
  const getStatus = (value: number, benchmark: number, inverse: boolean) => {
    if (inverse) {
      return value < benchmark ? "positive" : value > benchmark * 1.5 ? "negative" : "neutral";
    }
    return value > benchmark ? "positive" : value < benchmark * 0.5 ? "negative" : "neutral";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-card rounded-2xl border border-border p-6"
    >
      <div className="flex items-center gap-2 mb-6">
        <h2 className="text-lg font-semibold text-foreground">مؤشرات التقييم</h2>
        <Tooltip>
          <TooltipTrigger>
            <Info className="w-4 h-4 text-muted-foreground" />
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">
            <p>مؤشرات مالية لتقييم السهم مقارنة بأرباحه وقيمته الدفترية والقطاع.</p>
          </TooltipContent>
        </Tooltip>
      </div>

      <div className="space-y-4">
        {metrics.map((metric) => {
          const value = stock[metric.key as keyof typeof stock] as number;
          const status = getStatus(value, metric.benchmark, metric.inverse);
          
          return (
            <div key={metric.key} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
              <div className="flex items-center gap-2">
                <Tooltip>
                  <TooltipTrigger className="cursor-help">
                    <span className="text-sm text-muted-foreground">{metric.labelAr}</span>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p className="font-medium mb-1">{metric.label}</p>
                    <p className="text-xs">{metric.description}</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-foreground">{metric.format(value)}</span>
                {status === "positive" && (
                  <div className="w-5 h-5 rounded-full bg-chart-positive/10 flex items-center justify-center">
                    <TrendingUp className="w-3 h-3 text-chart-positive" />
                  </div>
                )}
                {status === "negative" && (
                  <div className="w-5 h-5 rounded-full bg-chart-negative/10 flex items-center justify-center">
                    <TrendingDown className="w-3 h-3 text-chart-negative" />
                  </div>
                )}
                {status === "neutral" && (
                  <div className="w-5 h-5 rounded-full bg-warning/10 flex items-center justify-center">
                    <div className="w-2 h-0.5 bg-warning rounded" />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground mb-2">المقارنة مع المعيار:</p>
        <div className="flex flex-wrap gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-chart-positive/20 flex items-center justify-center">
              <TrendingUp className="w-2 h-2 text-chart-positive" />
            </div>
            <span className="text-muted-foreground">جيد</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-warning/20 flex items-center justify-center">
              <div className="w-1.5 h-0.5 bg-warning rounded" />
            </div>
            <span className="text-muted-foreground">متوسط</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-chart-negative/20 flex items-center justify-center">
              <TrendingDown className="w-2 h-2 text-chart-negative" />
            </div>
            <span className="text-muted-foreground">ضعيف</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default StockMetrics;
