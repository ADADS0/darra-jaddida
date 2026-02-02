import { motion } from "framer-motion";
import { AlertTriangle, Info, TrendingDown, Activity, Target, BarChart3 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { Fund } from "@/hooks/useFundData";

interface FundRiskMetricsProps {
  fund: Fund | {
    risk: {
      volatility: number;
      sharpeRatio: number;
      maxDrawdown: number;
      beta: number;
      alpha: number;
      standardDeviation: number;
      informationRatio: number;
    };
  };
  detailed?: boolean;
}

const riskExplanations = {
  volatility: "التقلب يقيس مدى تذبذب سعر الصندوق. قيمة أعلى تعني مخاطر أكبر.",
  sharpeRatio: "نسبة شارب تقيس العائد المعدل بالمخاطر. قيمة أعلى من 1 جيدة.",
  maxDrawdown: "أقصى خسارة هي أكبر انخفاض من القمة إلى القاع.",
  beta: "بيتا تقيس حساسية الصندوق لحركة السوق. 1 = يتحرك مع السوق.",
  alpha: "ألفا تقيس الأداء الإضافي فوق المؤشر المرجعي.",
  standardDeviation: "الانحراف المعياري يقيس تشتت العوائد.",
  informationRatio: "نسبة المعلومات تقيس العائد الإضافي لكل وحدة مخاطر إضافية.",
};

const getRiskLevel = (volatility: number): { level: string; color: string; progress: number } => {
  if (volatility < 5) return { level: "منخفض", color: "text-chart-positive", progress: 25 };
  if (volatility < 10) return { level: "متوسط", color: "text-yellow-500", progress: 50 };
  if (volatility < 15) return { level: "مرتفع", color: "text-orange-500", progress: 75 };
  return { level: "مرتفع جداً", color: "text-chart-negative", progress: 100 };
};

const FundRiskMetrics = ({ fund, detailed = false }: FundRiskMetricsProps) => {
  const riskLevel = getRiskLevel(fund.risk.volatility);

  const metrics = [
    {
      icon: Activity,
      label: "التقلب",
      value: `${fund.risk.volatility}%`,
      explanation: riskExplanations.volatility,
    },
    {
      icon: Target,
      label: "نسبة شارب",
      value: fund.risk.sharpeRatio.toFixed(2),
      explanation: riskExplanations.sharpeRatio,
      isGood: fund.risk.sharpeRatio > 1,
    },
    {
      icon: TrendingDown,
      label: "أقصى خسارة",
      value: `${fund.risk.maxDrawdown}%`,
      explanation: riskExplanations.maxDrawdown,
      isBad: true,
    },
    {
      icon: BarChart3,
      label: "بيتا",
      value: fund.risk.beta.toFixed(2),
      explanation: riskExplanations.beta,
    },
  ];

  const detailedMetrics = [
    {
      label: "ألفا",
      value: `${fund.risk.alpha > 0 ? "+" : ""}${fund.risk.alpha}%`,
      explanation: riskExplanations.alpha,
      isGood: fund.risk.alpha > 0,
    },
    {
      label: "الانحراف المعياري",
      value: `${fund.risk.standardDeviation}%`,
      explanation: riskExplanations.standardDeviation,
    },
    {
      label: "نسبة المعلومات",
      value: fund.risk.informationRatio.toFixed(2),
      explanation: riskExplanations.informationRatio,
      isGood: fund.risk.informationRatio > 0.5,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-2xl border border-border p-6"
    >
      <div className="flex items-center gap-2 mb-6">
        <AlertTriangle className="w-5 h-5 text-warning" />
        <h3 className="text-lg font-semibold text-foreground">مؤشرات المخاطر</h3>
      </div>

      {/* Risk Level Indicator */}
      <div className="mb-6 p-4 bg-secondary/50 rounded-xl">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">مستوى المخاطر</span>
          <span className={`text-sm font-semibold ${riskLevel.color}`}>{riskLevel.level}</span>
        </div>
        <Progress value={riskLevel.progress} className="h-2" />
        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          <span>منخفض</span>
          <span>مرتفع</span>
        </div>
      </div>

      {/* Main Metrics */}
      <div className="space-y-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
            <div className="flex items-center gap-3">
              <metric.icon className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{metric.label}</span>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="w-3 h-3 text-muted-foreground/60" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">{metric.explanation}</TooltipContent>
              </Tooltip>
            </div>
            <span className={`text-sm font-semibold ${
              metric.isBad ? "text-chart-negative" : 
              metric.isGood ? "text-chart-positive" : "text-foreground"
            }`}>
              {metric.value}
            </span>
          </div>
        ))}
      </div>

      {detailed && (
        <div className="mt-6 pt-6 border-t border-border space-y-4">
          <h4 className="text-sm font-semibold text-foreground">مؤشرات إضافية</h4>
          {detailedMetrics.map((metric) => (
            <div key={metric.label} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">{metric.label}</span>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="w-3 h-3 text-muted-foreground/60" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">{metric.explanation}</TooltipContent>
                </Tooltip>
              </div>
              <span className={`text-sm font-semibold ${
                metric.isGood ? "text-chart-positive" : "text-foreground"
              }`}>
                {metric.value}
              </span>
            </div>
          ))}

          {/* Risk Explanation Card */}
          <div className="mt-6 p-4 bg-warning/10 border border-warning/20 rounded-xl">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-warning mt-0.5" />
              <div>
                <h5 className="text-sm font-semibold text-foreground mb-1">ملاحظة هامة</h5>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  الأداء السابق لا يضمن النتائج المستقبلية. الاستثمار في الصناديق ينطوي على مخاطر 
                  بما في ذلك احتمال خسارة رأس المال المستثمر. يرجى قراءة نشرة الإصدار بعناية.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default FundRiskMetrics;
