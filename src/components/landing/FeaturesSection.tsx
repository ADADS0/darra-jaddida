import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { 
  BarChart3, 
  Shield, 
  Sparkles, 
  Bell, 
  BookOpen, 
  Building2,
  LineChart,
  PieChart
} from "lucide-react";
import profitLossVideo from "@/assets/videos/profit-loss-light.webm";

const FeaturesSection = () => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const features = [
    {
      icon: BarChart3,
      title: isRTL ? "ماسح الأسهم" : "Screener d'actions",
      description: isRTL 
        ? "فلترة الأسهم حسب معايير مالية دقيقة: PER، P/B، العائد، المديونية، والسيولة"
        : "Filtrez les actions selon des critères financiers précis: PER, P/B, rendement, dette et liquidité",
      color: "bg-primary/10 text-primary",
    },
    {
      icon: LineChart,
      title: isRTL ? "تحليل الأسهم" : "Analyse des actions",
      description: isRTL 
        ? "ملف استثماري كامل لكل شركة: الأساسيات، المخاطر، الأحداث، والمقارنة القطاعية"
        : "Dossier d'investissement complet pour chaque société: fondamentaux, risques, événements et comparaison sectorielle",
      color: "bg-chart-line/10 text-chart-line",
    },
    {
      icon: PieChart,
      title: isRTL ? "صناديق OPCVM" : "Fonds OPCVM",
      description: isRTL 
        ? "تتبع أداء الصناديق، مقارنة الرسوم، تحليل المخاطر، وتصنيف Style"
        : "Suivez la performance des fonds, comparez les frais, analysez les risques et le style",
      color: "bg-warning/10 text-warning",
    },
    {
      icon: Sparkles,
      title: isRTL ? "ذكاء اصطناعي" : "Intelligence artificielle",
      description: isRTL 
        ? "تلخيص البلاغات والنتائج، استخراج الإشارات، وتحليل السيناريوهات"
        : "Résumé des communiqués et résultats, extraction des signaux et analyse des scénarios",
      color: "bg-accent/10 text-accent",
    },
    {
      icon: Bell,
      title: isRTL ? "تنبيهات ذكية" : "Alertes intelligentes",
      description: isRTL 
        ? "إشعارات فورية عند تغيرات الأسعار، نشر النتائج، أو أحداث الشركات"
        : "Notifications instantanées lors des changements de prix, publications de résultats ou événements d'entreprises",
      color: "bg-destructive/10 text-destructive",
    },
    {
      icon: BookOpen,
      title: isRTL ? "مركز تعليمي" : "Centre d'apprentissage",
      description: isRTL 
        ? "مسارات تعلّم من المبتدئ للمتقدم، بأمثلة مغربية ومصطلحات عربية"
        : "Parcours d'apprentissage du débutant à l'avancé, avec des exemples marocains",
      color: "bg-success/10 text-success",
    },
    {
      icon: Shield,
      title: isRTL ? "مصادر موثّقة" : "Sources vérifiées",
      description: isRTL 
        ? "كل رقم مرتبط بمصدره الرسمي: AMMC، البورصة، تقارير الشركات"
        : "Chaque chiffre est lié à sa source officielle: AMMC, Bourse, rapports d'entreprises",
      color: "bg-primary/10 text-primary",
    },
    {
      icon: Building2,
      title: isRTL ? "حلول المؤسسات" : "Solutions entreprises",
      description: isRTL 
        ? "واجهات B2B، API، تكامل SSO، وتقارير قابلة للتصدير والمشاركة"
        : "Interfaces B2B, API, intégration SSO et rapports exportables et partageables",
      color: "bg-muted-foreground/10 text-muted-foreground",
    },
  ];

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover opacity-20"
        >
          <source src={profitLossVideo} type="video/webm" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm text-primary font-medium mb-4 block">
            {isRTL ? "المميزات" : "Fonctionnalités"}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {isRTL ? "كل ما تحتاجه في منصّة واحدة" : "Tout ce dont vous avez besoin sur une seule plateforme"}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {isRTL 
              ? "أدوات تحليل متقدمة، بيانات موثّقة، وتجربة مستخدم سلسة مصمّمة للسوق المغربي"
              : "Outils d'analyse avancés, données fiables et expérience utilisateur fluide conçue pour le marché marocain"
            }
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -4 }}
              className="group bg-card/80 backdrop-blur-sm rounded-2xl border border-border p-6 hover:border-primary/50 transition-all duration-300"
            >
              <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
