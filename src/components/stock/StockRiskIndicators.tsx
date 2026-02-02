import { motion } from "framer-motion";
import { Info, AlertTriangle, Shield, Activity } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface StockRiskIndicatorsProps {
  stock: {
    symbol: string;
  };
}

// Mock risk data
const riskData = {
  volatility: {
    value: 18.5,
    level: "medium",
    description: "التذبذب السنوي للسهم. أقل من 15% منخفض، أكثر من 25% مرتفع.",
  },
  beta: {
    value: 0.85,
    level: "low",
    description: "حساسية السهم لتحركات السوق. أقل من 1 أقل تذبذباً من السوق.",
  },
  maxDrawdown: {
    value: -24.3,
    level: "medium",
    description: "أكبر انخفاض من القمة إلى القاع خلال السنة الماضية.",
  },
  liquidityScore: {
    value: 78,
    level: "high",
    description: "مدى سهولة بيع/شراء السهم. أعلى من 70 يعني سيولة جيدة.",
  },
  daysToLiquidate: {
    value: 2.3,
    level: "low",
    description: "عدد الأيام المطلوبة لتصفية موقع متوسط الحجم.",
  },
  sharpeRatio: {
    value: 1.24,
    level: "high",
    description: "العائد المعدل بالمخاطر. أكثر من 1 يعني عائد جيد مقابل المخاطر.",
  },
};

const getRiskColor = (level: string) => {
  switch (level) {
    case "low":
      return "text-chart-positive bg-chart-positive/10";
    case "medium":
      return "text-warning bg-warning/10";
    case "high":
      return "text-chart-negative bg-chart-negative/10";
    default:
      return "text-muted-foreground bg-secondary";
  }
};

const getRiskLabel = (level: string) => {
  switch (level) {
    case "low":
      return "منخفض";
    case "medium":
      return "متوسط";
    case "high":
      return "مرتفع";
    default:
      return level;
  }
};

const StockRiskIndicators = ({ stock }: StockRiskIndicatorsProps) => {
  // Calculate overall risk score
  const riskScores = {
    low: 1,
    medium: 2,
    high: 3,
  };
  
  const avgRisk = Object.values(riskData).reduce((sum, item) => 
    sum + riskScores[item.level as keyof typeof riskScores], 0
  ) / Object.keys(riskData).length;

  const overallRisk = avgRisk < 1.5 ? "منخفض" : avgRisk < 2.5 ? "متوسط" : "مرتفع";
  const overallRiskColor = avgRisk < 1.5 ? "text-chart-positive" : avgRisk < 2.5 ? "text-warning" : "text-chart-negative";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-card rounded-2xl border border-border p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-foreground">مؤشرات المخاطر</h2>
          <Tooltip>
            <TooltipTrigger>
              <Info className="w-4 h-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p>مؤشرات لقياس مخاطر السهم من حيث التذبذب والسيولة والانحدار.</p>
            </TooltipContent>
          </Tooltip>
        </div>
        
        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full ${
          avgRisk < 1.5 ? "bg-chart-positive/10" : avgRisk < 2.5 ? "bg-warning/10" : "bg-chart-negative/10"
        }`}>
          {avgRisk < 1.5 ? (
            <Shield className={`w-4 h-4 ${overallRiskColor}`} />
          ) : avgRisk < 2.5 ? (
            <Activity className={`w-4 h-4 ${overallRiskColor}`} />
          ) : (
            <AlertTriangle className={`w-4 h-4 ${overallRiskColor}`} />
          )}
          <span className={`text-xs font-medium ${overallRiskColor}`}>
            خطر {overallRisk}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {/* Volatility */}
        <div className="p-4 rounded-xl bg-secondary/30">
          <div className="flex items-center justify-between mb-2">
            <Tooltip>
              <TooltipTrigger className="cursor-help">
                <span className="text-sm text-muted-foreground">التذبذب السنوي</span>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>{riskData.volatility.description}</p>
              </TooltipContent>
            </Tooltip>
            <span className="text-sm font-semibold text-foreground">{riskData.volatility.value}%</span>
          </div>
          <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                riskData.volatility.level === "low" ? "bg-chart-positive" :
                riskData.volatility.level === "medium" ? "bg-warning" : "bg-chart-negative"
              }`}
              style={{ width: `${Math.min(riskData.volatility.value * 2, 100)}%` }}
            />
          </div>
          <div className="flex justify-between mt-1 text-[10px] text-muted-foreground">
            <span>0%</span>
            <span>50%</span>
          </div>
        </div>

        {/* Other Risk Metrics */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { key: "beta", label: "Beta", value: riskData.beta.value.toFixed(2) },
            { key: "maxDrawdown", label: "أقصى انحدار", value: `${riskData.maxDrawdown.value}%` },
            { key: "liquidityScore", label: "مؤشر السيولة", value: riskData.liquidityScore.value },
            { key: "daysToLiquidate", label: "أيام التصفية", value: riskData.daysToLiquidate.value },
            { key: "sharpeRatio", label: "Sharpe Ratio", value: riskData.sharpeRatio.value.toFixed(2) },
          ].map((metric) => {
            const data = riskData[metric.key as keyof typeof riskData];
            return (
              <div key={metric.key} className="p-3 rounded-xl bg-secondary/30">
                <Tooltip>
                  <TooltipTrigger className="w-full cursor-help">
                    <div className="flex flex-col items-start">
                      <span className="text-xs text-muted-foreground mb-1">{metric.label}</span>
                      <div className="flex items-center justify-between w-full">
                        <span className="text-sm font-semibold text-foreground">{metric.value}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${getRiskColor(data.level)}`}>
                          {getRiskLabel(data.level)}
                        </span>
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>{data.description}</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            );
          })}
        </div>
      </div>

      {/* Risk Warning */}
      <div className="mt-4 p-3 rounded-lg bg-warning/5 border border-warning/20">
        <div className="flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            مؤشرات المخاطر تستند إلى بيانات تاريخية ولا تضمن الأداء المستقبلي.
            استشر مختصاً قبل اتخاذ قرارات استثمارية.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default StockRiskIndicators;
