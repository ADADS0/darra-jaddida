import { motion } from "framer-motion";
import { Coins, Info, Calculator, Percent, ArrowRightLeft } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Fund } from "@/hooks/useFundData";

interface FundFeesProps {
  fund: Fund | {
    fees: {
      managementFee: number;
      performanceFee: number;
      entryFee: number;
      exitFee: number;
      ongoingCharges: number;
    };
    minInvestment: number;
    currency: string;
  };
  detailed?: boolean;
}

const feeExplanations = {
  managementFee: "رسوم الإدارة السنوية تُخصم من صافي أصول الصندوق لتغطية تكاليف الإدارة",
  performanceFee: "رسوم الأداء تُخصم عند تحقيق عوائد تفوق المؤشر المرجعي",
  entryFee: "رسوم الاشتراك تُخصم عند شراء وحدات الصندوق",
  exitFee: "رسوم الاسترداد تُخصم عند بيع وحدات الصندوق",
  ongoingCharges: "إجمالي الرسوم الجارية يشمل جميع التكاليف السنوية للصندوق",
};

const FundFees = ({ fund, detailed = false }: FundFeesProps) => {
  const fees = [
    {
      icon: Percent,
      label: "رسوم الإدارة",
      value: `${fund.fees.managementFee}%`,
      explanation: feeExplanations.managementFee,
      annual: true,
    },
    {
      icon: Calculator,
      label: "رسوم الأداء",
      value: fund.fees.performanceFee > 0 ? `${fund.fees.performanceFee}%` : "لا يوجد",
      explanation: feeExplanations.performanceFee,
      condition: "عند تجاوز المؤشر",
    },
    {
      icon: ArrowRightLeft,
      label: "رسوم الاشتراك",
      value: fund.fees.entryFee > 0 ? `${fund.fees.entryFee}%` : "مجاني",
      explanation: feeExplanations.entryFee,
    },
    {
      icon: ArrowRightLeft,
      label: "رسوم الاسترداد",
      value: fund.fees.exitFee > 0 ? `${fund.fees.exitFee}%` : "مجاني",
      explanation: feeExplanations.exitFee,
    },
  ];

  const calculateImpact = (amount: number, years: number) => {
    const annualFee = fund.fees.ongoingCharges / 100;
    const finalValue = amount * Math.pow(1 - annualFee, years);
    const feesLost = amount - finalValue;
    return feesLost;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-2xl border border-border p-6"
    >
      <div className="flex items-center gap-2 mb-6">
        <Coins className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">الرسوم والتكاليف</h3>
      </div>

      {/* Ongoing Charges Highlight */}
      <div className="mb-6 p-4 bg-primary/10 border border-primary/20 rounded-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-foreground">إجمالي الرسوم الجارية</span>
            <Tooltip>
              <TooltipTrigger>
                <Info className="w-4 h-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">{feeExplanations.ongoingCharges}</TooltipContent>
            </Tooltip>
          </div>
          <span className="text-2xl font-bold text-primary">{fund.fees.ongoingCharges}%</span>
        </div>
        <p className="text-xs text-muted-foreground mt-2">سنوياً من صافي الأصول</p>
      </div>

      {/* Fees List */}
      <div className="space-y-3">
        {fees.map((fee) => (
          <div key={fee.label} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
            <div className="flex items-center gap-3">
              <fee.icon className="w-4 h-4 text-muted-foreground" />
              <div>
                <span className="text-sm text-muted-foreground">{fee.label}</span>
                {fee.annual && <span className="text-xs text-muted-foreground/60 mr-1">(سنوي)</span>}
                {fee.condition && <p className="text-xs text-muted-foreground/60">{fee.condition}</p>}
              </div>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="w-3 h-3 text-muted-foreground/60" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">{fee.explanation}</TooltipContent>
              </Tooltip>
            </div>
            <span className={`text-sm font-semibold ${
              fee.value === "مجاني" || fee.value === "لا يوجد" 
                ? "text-chart-positive" 
                : "text-foreground"
            }`}>
              {fee.value}
            </span>
          </div>
        ))}
      </div>

      {/* Minimum Investment */}
      <div className="mt-4 p-3 bg-secondary/30 rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">الحد الأدنى للاستثمار</span>
          <span className="text-sm font-semibold text-foreground">
            {fund.minInvestment.toLocaleString()} {fund.currency}
          </span>
        </div>
      </div>

      {detailed && (
        <div className="mt-6 pt-6 border-t border-border">
          <h4 className="text-sm font-semibold text-foreground mb-4">تأثير الرسوم على استثمارك</h4>
          
          {/* Fee Impact Calculator */}
          <div className="space-y-4">
            <p className="text-xs text-muted-foreground">
              إذا استثمرت 100,000 درهم، هذا تأثير الرسوم على استثمارك:
            </p>
            
            <div className="grid grid-cols-3 gap-4">
              {[5, 10, 20].map((years) => {
                const impact = calculateImpact(100000, years);
                return (
                  <div key={years} className="text-center p-4 bg-secondary/30 rounded-xl">
                    <p className="text-xs text-muted-foreground mb-2">{years} سنوات</p>
                    <p className="text-lg font-bold text-chart-negative">
                      -{impact.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">درهم</p>
                  </div>
                );
              })}
            </div>
            
            <p className="text-xs text-muted-foreground/80 mt-4">
              * الحسابات تفترض ثبات قيمة الاستثمار ولا تشمل العوائد أو الخسائر
            </p>
          </div>

          {/* Fee Comparison */}
          <div className="mt-6">
            <h5 className="text-sm font-semibold text-foreground mb-3">مقارنة الرسوم</h5>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">هذا الصندوق</span>
                <div className="flex-1 mx-4 h-2 bg-secondary rounded-full">
                  <div 
                    className="h-full bg-primary rounded-full" 
                    style={{ width: `${(fund.fees.ongoingCharges / 3) * 100}%` }}
                  />
                </div>
                <span className="font-semibold">{fund.fees.ongoingCharges}%</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">متوسط الفئة</span>
                <div className="flex-1 mx-4 h-2 bg-secondary rounded-full">
                  <div className="h-full bg-muted-foreground/50 rounded-full" style={{ width: "50%" }} />
                </div>
                <span className="text-muted-foreground">1.5%</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default FundFees;
