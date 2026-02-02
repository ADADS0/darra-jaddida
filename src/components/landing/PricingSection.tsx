import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "مجاني",
    nameEn: "Free",
    price: "0",
    period: "MAD/شهر",
    description: "للبداية واستكشاف المنصّة",
    features: [
      "أسعار متأخرة (15 دقيقة)",
      "بطاقات KPI أساسية",
      "Watchlist واحدة",
      "تنبيهان فقط",
      "مسار التعليم المبتدئ",
    ],
    cta: "ابدأ مجاناً",
    variant: "outline" as const,
    popular: false,
  },
  {
    name: "مميز",
    nameEn: "Premium",
    price: "199",
    period: "MAD/شهر",
    description: "للمستثمر النشط",
    features: [
      "ماسح الأسهم المتقدم",
      "مقارنة الأسهم والقطاعات",
      "تحليل OPCVM كامل",
      "Watchlists غير محدودة",
      "تنبيهات غير محدودة",
      "تلخيصات AI للبلاغات",
      "تقارير PDF قابلة للتصدير",
    ],
    cta: "جرّب 7 أيام مجاناً",
    variant: "hero" as const,
    popular: true,
  },
  {
    name: "احترافي",
    nameEn: "Pro",
    price: "399",
    period: "MAD/شهر",
    description: "للمحترفين والمحللين",
    features: [
      "كل مميزات Premium",
      "إشارات Factor models",
      "Backtesting مبسط",
      "سيناريوهات Sensitivity",
      "أولوية الدعم الفني",
      "limits أعلى للـ AI",
    ],
    cta: "ابدأ الآن",
    variant: "outline" as const,
    popular: false,
  },
];

const PricingSection = () => {
  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm text-primary font-medium mb-4 block">التسعير</span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            اختر الخطة المناسبة
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            ابدأ مجاناً وترقّى حسب احتياجاتك. خصم 20% على الاشتراك السنوي.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative bg-card rounded-2xl border p-6 ${
                plan.popular 
                  ? "border-primary shadow-lg shadow-primary/10" 
                  : "border-border"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                    <Sparkles className="w-3 h-3" />
                    الأكثر شيوعاً
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-foreground mb-1">{plan.name}</h3>
                <p className="text-xs text-muted-foreground mb-4">{plan.description}</p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground text-sm">{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button variant={plan.variant} className="w-full">
                {plan.cta}
              </Button>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12"
        >
          <p className="text-muted-foreground mb-4">
            تحتاج حلاً للمؤسسات؟ فِرَق، SSO، API، وSLAs مخصصة.
          </p>
          <Button variant="ghost" className="text-primary">
            تواصل مع فريق المبيعات ←
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default PricingSection;
