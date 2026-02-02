import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Header from "@/components/layout/Header";
import Footer from "@/components/landing/Footer";
import FeaturesSection from "@/components/landing/FeaturesSection";
import PricingSection from "@/components/landing/PricingSection";
import MarketNews from "@/components/landing/MarketNews";
import StockGridHeatmap from "@/components/landing/StockGridHeatmap";
import EconomicIndicators from "@/components/landing/EconomicIndicators";
import { motion } from "framer-motion";
import bgVideo from "@/assets/videos/bg-video-comp.mp4";
import tradingFloorBg from "@/assets/images/trading-floor.jpg";
import marketDataBg from "@/assets/images/market-data.jpg";
import newsBg from "@/assets/images/news-bg.jpg";
import {
  BarChart3, 
  PieChart, 
  ArrowLeft,
  Zap,
  Shield,
  Wifi,
  Bell,
  LineChart,
  TrendingUp,
  Newspaper,
  Target,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import casablueLogo from "@/assets/casablue-logo.jpeg";

const Index = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const features = [
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: t('features.heatmap.title'),
      description: t('features.heatmap.description')
    },
    {
      icon: <LineChart className="w-6 h-6" />,
      title: t('features.analytics.title'),
      description: t('features.analytics.description')
    },
    {
      icon: <Bell className="w-6 h-6" />,
      title: t('features.alerts.title'),
      description: t('features.alerts.description')
    },
    {
      icon: <PieChart className="w-6 h-6" />,
      title: t('features.portfolio.title'),
      description: t('features.portfolio.description')
    },
    {
      icon: <Wifi className="w-6 h-6" />,
      title: t('features.liveData.title'),
      description: t('features.liveData.description')
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: t('features.risk.title'),
      description: t('features.risk.description')
    }
  ];

  const stats = [
    { value: "75+", label: t('stats.stocks') },
    { value: "14", label: t('stats.sectors') },
    { value: "24/7", label: t('stats.monitoring') },
    { value: "1M+", label: t('stats.analysis') }
  ];

  return (
    <div className="min-h-screen bg-[#0d1117]" dir={isRTL ? 'rtl' : 'ltr'}>
      <Header />
      
      <main>
        {/* Hero Section with Video Background */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
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
            <div className="absolute inset-0 bg-[#0d1117]/80 backdrop-blur-[2px]" />
          </div>

          {/* Background Effects on top of video */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(41,98,255,0.15)_0%,_transparent_70%)] z-[1]" />
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#2962ff]/10 rounded-full blur-3xl animate-pulse z-[1]" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#089981]/10 rounded-full blur-3xl animate-pulse z-[1]" />
          <div className="absolute top-1/3 right-1/3 w-[300px] h-[300px] bg-[#f23645]/5 rounded-full blur-3xl z-[1]" />
          
          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px] z-[1]" />

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              {/* Logo */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="flex justify-center mb-8"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-[#2962ff] rounded-full blur-xl opacity-50 animate-pulse" />
                  <img 
                    src={casablueLogo} 
                    alt="Casablue" 
                    className="relative w-24 h-24 rounded-full object-cover border-4 border-[#2962ff]/50"
                  />
                </div>
              </motion.div>

              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#2962ff]/10 border border-[#2962ff]/20 mb-6">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#089981] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#089981]"></span>
                  </span>
                  <span className="text-sm text-[#b2b5be]">{t('hero.badge')}</span>
                </div>
              </motion.div>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
              >
                {t('hero.title1')}{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2962ff] via-[#1e88e5] to-[#089981]">
                  {t('hero.title2')}
                </span>
                <br />
                {t('hero.title3')}
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-lg md:text-xl text-[#b2b5be] mb-10 max-w-2xl mx-auto"
              >
                {t('hero.subtitle')}
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
              >
                <Link to="/markets">
                  <Button size="lg" className="bg-[#2962ff] hover:bg-[#1e88e5] text-white px-8 py-6 text-lg rounded-xl shadow-lg shadow-[#2962ff]/25 group">
                    <Zap className="w-5 h-5 mx-2" />
                    {t('hero.cta')}
                    <ArrowLeft className={`w-5 h-5 mx-2 group-hover:${isRTL ? '-translate-x-1' : 'translate-x-1'} transition-transform ${!isRTL && 'rotate-180'}`} />
                  </Button>
                </Link>
                <Link to="/screener">
                  <Button size="lg" variant="outline" className="border-[#2a2e39] text-white hover:bg-[#1e222d] px-8 py-6 text-lg rounded-xl">
                    <BarChart3 className="w-5 h-5 mx-2" />
                    {t('hero.ctaSecondary')}
                  </Button>
                </Link>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-6"
              >
                {stats.map((stat, index) => (
                  <div 
                    key={index}
                    className="bg-[#131722]/80 backdrop-blur-sm rounded-xl p-4 border border-[#2a2e39]"
                  >
                    <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#2962ff] to-[#089981]">
                      {stat.value}
                    </p>
                    <p className="text-[#787b86] text-sm mt-1">{stat.label}</p>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <div className="w-6 h-10 rounded-full border-2 border-[#2a2e39] flex items-start justify-center p-2">
              <div className="w-1 h-3 bg-[#2962ff] rounded-full" />
            </div>
          </motion.div>
        </section>

        {/* Stock Heatmap Section */}
        <section className="py-12 bg-[#0d1117]">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <StockGridHeatmap limit={20} />
            </motion.div>
            
            {/* Economic Indicators Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mt-8"
            >
              <EconomicIndicators />
            </motion.div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20 bg-gradient-to-b from-[#0d1117] to-[#131722]">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {t('features.title')}
              </h2>
              <p className="text-[#787b86] max-w-2xl mx-auto">
                {t('features.subtitle')}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-[#131722] rounded-xl p-6 border border-[#2a2e39] hover:border-[#2962ff]/50 transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#2962ff]/10 flex items-center justify-center text-[#2962ff] mb-4 group-hover:bg-[#2962ff] group-hover:text-white transition-colors">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-[#787b86] text-sm">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Quick Access & News Section with Background Images */}
        <section className="py-16 bg-[#0d1117] relative overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Quick Access Cards with Trading Floor Background */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative"
              >
                {/* Background Image */}
                <div className="absolute inset-0 rounded-2xl overflow-hidden">
                  <img 
                    src={tradingFloorBg} 
                    alt="" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-[#0d1117]/95 via-[#0d1117]/85 to-[#131722]/90" />
                </div>
                
                <div className="relative z-10 p-8">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-[#2962ff]/20 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-[#2962ff]" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">{t('quickAccess.title')}</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <Link to="/markets" className="block">
                      <div className="bg-[#131722]/80 backdrop-blur-sm rounded-xl p-5 border border-[#2962ff]/30 hover:border-[#2962ff] transition-all group hover:shadow-lg hover:shadow-[#2962ff]/10">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <TrendingUp className="w-5 h-5 text-[#2962ff]" />
                              <h4 className="text-xl font-bold text-white">{t('quickAccess.markets.title')}</h4>
                            </div>
                            <p className="text-[#b2b5be] text-sm">{t('quickAccess.markets.description')}</p>
                          </div>
                          <ArrowLeft className={`w-8 h-8 text-[#2962ff] group-hover:${isRTL ? '-translate-x-2' : 'translate-x-2'} transition-transform ${!isRTL && 'rotate-180'}`} />
                        </div>
                      </div>
                    </Link>

                    <Link to="/screener" className="block">
                      <div className="bg-[#131722]/80 backdrop-blur-sm rounded-xl p-5 border border-[#089981]/30 hover:border-[#089981] transition-all group hover:shadow-lg hover:shadow-[#089981]/10">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Target className="w-5 h-5 text-[#089981]" />
                              <h4 className="text-xl font-bold text-white">{t('quickAccess.screener.title')}</h4>
                            </div>
                            <p className="text-[#b2b5be] text-sm">{t('quickAccess.screener.description')}</p>
                          </div>
                          <ArrowLeft className={`w-8 h-8 text-[#089981] group-hover:${isRTL ? '-translate-x-2' : 'translate-x-2'} transition-transform ${!isRTL && 'rotate-180'}`} />
                        </div>
                      </div>
                    </Link>

                    <Link to="/funds" className="block">
                      <div className="bg-[#131722]/80 backdrop-blur-sm rounded-xl p-5 border border-[#f23645]/30 hover:border-[#f23645] transition-all group hover:shadow-lg hover:shadow-[#f23645]/10">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <PieChart className="w-5 h-5 text-[#f23645]" />
                              <h4 className="text-xl font-bold text-white">{t('quickAccess.funds.title')}</h4>
                            </div>
                            <p className="text-[#b2b5be] text-sm">{t('quickAccess.funds.description')}</p>
                          </div>
                          <ArrowLeft className={`w-8 h-8 text-[#f23645] group-hover:${isRTL ? '-translate-x-2' : 'translate-x-2'} transition-transform ${!isRTL && 'rotate-180'}`} />
                        </div>
                      </div>
                    </Link>
                  </div>

                  {/* Stats overlay */}
                  <div className="mt-6 grid grid-cols-3 gap-4">
                    <div className="bg-[#131722]/60 backdrop-blur-sm rounded-lg p-3 text-center border border-[#2a2e39]">
                      <p className="text-2xl font-bold text-[#2962ff]">75+</p>
                      <p className="text-xs text-[#787b86]">سهم</p>
                    </div>
                    <div className="bg-[#131722]/60 backdrop-blur-sm rounded-lg p-3 text-center border border-[#2a2e39]">
                      <p className="text-2xl font-bold text-[#089981]">14</p>
                      <p className="text-xs text-[#787b86]">قطاع</p>
                    </div>
                    <div className="bg-[#131722]/60 backdrop-blur-sm rounded-lg p-3 text-center border border-[#2a2e39]">
                      <p className="text-2xl font-bold text-[#f23645]">100+</p>
                      <p className="text-xs text-[#787b86]">صندوق</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* News Section with News Room Background */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative"
              >
                {/* Background Image */}
                <div className="absolute inset-0 rounded-2xl overflow-hidden">
                  <img 
                    src={newsBg} 
                    alt="" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-[#0d1117]/95 via-[#0d1117]/90 to-[#131722]/85" />
                </div>
                
                <div className="relative z-10 p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-[#f23645]/20 flex items-center justify-center">
                      <Newspaper className="w-5 h-5 text-[#f23645]" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">أخبار السوق</h3>
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#089981] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#089981]"></span>
                    </span>
                    <span className="text-xs text-[#089981]">مباشر</span>
                  </div>
                  
                  <MarketNews />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Platform Section with Market Data Background */}
        <section className="py-20 relative overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0">
            <img 
              src={marketDataBg} 
              alt="" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0d1117]/95 via-[#0d1117]/90 to-[#0d1117]/95" />
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center max-w-4xl mx-auto"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#089981]/10 border border-[#089981]/20 mb-6">
                <Zap className="w-4 h-4 text-[#089981]" />
                <span className="text-sm text-[#089981]">كل ما تحتاجه في منصة واحدة</span>
              </div>
              
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                تحليل شامل للسوق المغربي
              </h2>
              
              <p className="text-lg text-[#b2b5be] mb-10 max-w-2xl mx-auto">
                منصة متكاملة توفر لك جميع الأدوات التي تحتاجها لاتخاذ قرارات استثمارية ذكية في بورصة الدار البيضاء
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                {[
                  { icon: <BarChart3 className="w-6 h-6" />, label: "رسوم بيانية متقدمة" },
                  { icon: <Bell className="w-6 h-6" />, label: "تنبيهات ذكية" },
                  { icon: <LineChart className="w-6 h-6" />, label: "مؤشرات تقنية" },
                  { icon: <Shield className="w-6 h-6" />, label: "تحليل المخاطر" },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-[#131722]/80 backdrop-blur-sm rounded-xl p-4 border border-[#2a2e39] hover:border-[#2962ff]/50 transition-all"
                  >
                    <div className="w-12 h-12 mx-auto rounded-xl bg-[#2962ff]/10 flex items-center justify-center text-[#2962ff] mb-3">
                      {item.icon}
                    </div>
                    <p className="text-white font-medium text-sm">{item.label}</p>
                  </motion.div>
                ))}
              </div>
              
              <Link to="/markets">
                <Button size="lg" className="bg-[#2962ff] hover:bg-[#1e88e5] text-white px-10 py-6 text-lg rounded-xl shadow-lg shadow-[#2962ff]/25">
                  <Zap className="w-5 h-5 mx-2" />
                  ابدأ الآن مجاناً
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>
        
        <FeaturesSection />
        <PricingSection />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
