import { motion } from "framer-motion";
import { ArrowLeft, Shield, BarChart3, Zap, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import bgVideo from "@/assets/videos/bg-video-comp.mp4";

const HeroSection = () => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <section className="relative min-h-screen pt-24 pb-16 overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        >
          <source src={bgVideo} type="video/mp4" />
        </video>
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-background/85 backdrop-blur-[2px]" />
      </div>

      {/* Background Effects on top of video */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_hsl(var(--primary)/0.08)_0%,_transparent_50%)] z-[1]" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl z-[1]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-chart-line/5 rounded-full blur-3xl z-[1]" />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-grid-pattern bg-[size:60px_60px] opacity-[0.02] z-[1]" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 backdrop-blur-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="text-sm text-primary">
              {isRTL ? "المنصّة المغربية للذكاء المالي" : "La plateforme marocaine d'intelligence financière"}
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6"
          >
            <span className="text-foreground">{isRTL ? "حلّل سوق" : "Analysez le marché de"}</span>
            <br />
            <span className="text-gradient">{isRTL ? "الدار البيضاء" : "Casablanca"}</span>
            <br />
            <span className="text-foreground">{isRTL ? "بثقة" : "en confiance"}</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            {isRTL ? (
              <>
                بيانات موثّقة من المصادر الرسمية، تحليلات كمية شفافة،
                <br className="hidden md:block" />
                وشروحات عربية تحوّل المعلومة إلى قرار استثماري واضح
              </>
            ) : (
              <>
                Données fiables des sources officielles, analyses quantitatives transparentes,
                <br className="hidden md:block" />
                et explications claires pour transformer l'information en décision d'investissement
              </>
            )}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <Button variant="hero" size="xl" className="group backdrop-blur-sm">
              {isRTL ? "ابدأ مجاناً" : "Commencer gratuitement"}
              <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1 rtl-flip" />
            </Button>
            <Button variant="hero-outline" size="xl" className="backdrop-blur-sm">
              <Search className="w-5 h-5" />
              {isRTL ? "ابحث عن سهم" : "Rechercher une action"}
            </Button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto"
          >
            {[
              { 
                icon: Shield, 
                label: isRTL ? "بيانات رسمية موثّقة" : "Données officielles vérifiées", 
                desc: isRTL ? "من AMMC والبورصة" : "De l'AMMC et la Bourse" 
              },
              { 
                icon: BarChart3, 
                label: isRTL ? "+75 شركة مدرجة" : "+75 sociétés cotées", 
                desc: isRTL ? "تغطية كاملة للسوق" : "Couverture complète du marché" 
              },
              { 
                icon: Zap, 
                label: isRTL ? "تحديث يومي" : "Mise à jour quotidienne", 
                desc: isRTL ? "أسعار ونتائج مالية" : "Prix et résultats financiers" 
              },
            ].map((item, index) => (
              <div
                key={item.label}
                className="flex items-center gap-3 p-4 rounded-xl bg-card/50 border border-border/50 backdrop-blur-sm"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <div className={isRTL ? "text-right" : "text-left"}>
                  <p className="text-sm font-medium text-foreground">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
