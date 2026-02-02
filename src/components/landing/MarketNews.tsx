import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { 
  Newspaper, 
  TrendingUp, 
  TrendingDown,
  Clock,
  ExternalLink,
  Building2,
  Landmark,
  BarChart3,
  RefreshCw,
  AlertCircle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface NewsItem {
  id: string;
  titleAr: string;
  titleFr: string;
  titleEs: string;
  summaryAr: string;
  summaryFr: string;
  summaryEs: string;
  sourceAr: string;
  sourceFr: string;
  sourceEs: string;
  timeAr: string;
  timeFr: string;
  timeEs: string;
  category: "market" | "company" | "sector" | "economy" | "analysis";
  importance: "high" | "medium" | "low";
  sentiment?: "positive" | "negative" | "neutral";
  relatedStock?: string;
  link?: string;
}

const mockNews: NewsItem[] = [
  {
    id: "1",
    titleAr: "اتصالات المغرب تعلن عن نتائج مالية قياسية للربع الرابع",
    titleFr: "Maroc Telecom annonce des résultats financiers records pour le Q4",
    titleEs: "Maroc Telecom anuncia resultados financieros récord para el Q4",
    summaryAr: "سجلت اتصالات المغرب ارتفاعاً بنسبة 15% في الأرباح الصافية مقارنة بالفترة نفسها من العام الماضي.",
    summaryFr: "Maroc Telecom a enregistré une hausse de 15% du bénéfice net par rapport à la même période de l'année précédente.",
    summaryEs: "Maroc Telecom registró un aumento del 15% en el beneficio neto en comparación con el mismo período del año pasado.",
    sourceAr: "بورصة الدار البيضاء",
    sourceFr: "Bourse de Casablanca",
    sourceEs: "Bolsa de Casablanca",
    timeAr: "منذ 30 دقيقة",
    timeFr: "il y a 30 min",
    timeEs: "hace 30 min",
    category: "company",
    importance: "high",
    sentiment: "positive",
    relatedStock: "IAM"
  },
  {
    id: "2",
    titleAr: "البنك المركزي يبقي على سعر الفائدة الرئيسي دون تغيير",
    titleFr: "La Banque Centrale maintient le taux directeur inchangé",
    titleEs: "El Banco Central mantiene la tasa de interés sin cambios",
    summaryAr: "قرر بنك المغرب الإبقاء على سعر الفائدة الرئيسي عند 3% لدعم النمو الاقتصادي.",
    summaryFr: "Bank Al-Maghrib a décidé de maintenir le taux directeur à 3% pour soutenir la croissance économique.",
    summaryEs: "Bank Al-Maghrib decidió mantener la tasa de interés en 3% para apoyar el crecimiento económico.",
    sourceAr: "بنك المغرب",
    sourceFr: "Bank Al-Maghrib",
    sourceEs: "Bank Al-Maghrib",
    timeAr: "منذ ساعة",
    timeFr: "il y a 1h",
    timeEs: "hace 1h",
    category: "economy",
    importance: "high",
    sentiment: "neutral",
  },
  {
    id: "3",
    titleAr: "قطاع البنوك يقود مكاسب مؤشر MASI في جلسة اليوم",
    titleFr: "Le secteur bancaire mène les gains du MASI lors de la séance d'aujourd'hui",
    titleEs: "El sector bancario lidera las ganancias del MASI en la sesión de hoy",
    summaryAr: "ارتفع مؤشر MASI بنسبة 0.8% مدعوماً بأداء قوي لأسهم البنوك وخاصة التجاري وفا بنك.",
    summaryFr: "L'indice MASI a progressé de 0,8% soutenu par la bonne performance des valeurs bancaires, notamment Attijariwafa Bank.",
    summaryEs: "El índice MASI subió un 0,8% respaldado por el sólido desempeño de las acciones bancarias, especialmente Attijariwafa Bank.",
    sourceAr: "تحليل السوق",
    sourceFr: "Analyse de marché",
    sourceEs: "Análisis de mercado",
    timeAr: "منذ ساعتين",
    timeFr: "il y a 2h",
    timeEs: "hace 2h",
    category: "market",
    importance: "medium",
    sentiment: "positive",
    relatedStock: "ATW"
  },
  {
    id: "4",
    titleAr: "لافارج هولسيم المغرب توقع عقداً جديداً بقيمة 500 مليون درهم",
    titleFr: "LafargeHolcim Maroc signe un nouveau contrat de 500 millions de dirhams",
    titleEs: "LafargeHolcim Marruecos firma un nuevo contrato por 500 millones de dirhams",
    summaryAr: "أعلنت الشركة عن توقيع عقد توريد لمشروع بنية تحتية كبير في جهة الدار البيضاء سطات.",
    summaryFr: "La société a annoncé la signature d'un contrat de fourniture pour un grand projet d'infrastructure dans la région Casablanca-Settat.",
    summaryEs: "La empresa anunció la firma de un contrato de suministro para un gran proyecto de infraestructura en la región Casablanca-Settat.",
    sourceAr: "CDGK",
    sourceFr: "CDGK",
    sourceEs: "CDGK",
    timeAr: "منذ 3 ساعات",
    timeFr: "il y a 3h",
    timeEs: "hace 3h",
    category: "company",
    importance: "medium",
    sentiment: "positive",
    relatedStock: "LHM"
  },
  {
    id: "5",
    titleAr: "تحليل: توقعات إيجابية لقطاع العقار المغربي في 2026",
    titleFr: "Analyse: Perspectives positives pour l'immobilier marocain en 2026",
    titleEs: "Análisis: Perspectivas positivas para el sector inmobiliario marroquí en 2026",
    summaryAr: "يتوقع المحللون انتعاشاً في قطاع العقار مع استمرار برنامج الدعم الحكومي للسكن الاجتماعي.",
    summaryFr: "Les analystes prévoient une reprise du secteur immobilier avec la poursuite du programme de soutien gouvernemental au logement social.",
    summaryEs: "Los analistas esperan una recuperación del sector inmobiliario con la continuación del programa de apoyo gubernamental a la vivienda social.",
    sourceAr: "التحليل المالي",
    sourceFr: "Analyse financière",
    sourceEs: "Análisis financiero",
    timeAr: "منذ 4 ساعات",
    timeFr: "il y a 4h",
    timeEs: "hace 4h",
    category: "analysis",
    importance: "medium",
    sentiment: "positive",
  },
  {
    id: "6",
    titleAr: "انخفاض أسهم قطاع الطاقة مع تراجع أسعار النفط عالمياً",
    titleFr: "Baisse des actions du secteur de l'énergie avec le recul des prix du pétrole",
    titleEs: "Caída de las acciones del sector energético con el retroceso de los precios del petróleo",
    summaryAr: "تأثرت أسهم تاقة موروكو وأفريقيا غاز بتراجع أسعار النفط العالمية.",
    summaryFr: "Les actions de Taqa Morocco et Afriquia Gaz ont été affectées par la baisse des prix mondiaux du pétrole.",
    summaryEs: "Las acciones de Taqa Morocco y Afriquia Gaz se vieron afectadas por la caída de los precios mundiales del petróleo.",
    sourceAr: "أخبار السوق",
    sourceFr: "Actualités du marché",
    sourceEs: "Noticias del mercado",
    timeAr: "منذ 5 ساعات",
    timeFr: "il y a 5h",
    timeEs: "hace 5h",
    category: "sector",
    importance: "low",
    sentiment: "negative",
    relatedStock: "TQM"
  },
];

const MarketNews = () => {
  const { t, i18n } = useTranslation();
  const [filter, setFilter] = useState<string>("all");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const lang = i18n.language as 'ar' | 'fr' | 'es';
  const isRTL = lang === 'ar';

  const getLocalizedText = (news: NewsItem, field: 'title' | 'summary' | 'source' | 'time') => {
    const langSuffix = lang === 'ar' ? 'Ar' : lang === 'fr' ? 'Fr' : 'Es';
    const key = `${field}${langSuffix}` as keyof NewsItem;
    return news[key] as string;
  };

  const categoryConfig: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
    market: { 
      label: t('news.categories.market', lang === 'ar' ? 'السوق' : lang === 'fr' ? 'Marché' : 'Mercado'), 
      icon: <BarChart3 className="w-3.5 h-3.5" />, 
      color: "bg-blue-500/20 text-blue-400" 
    },
    company: { 
      label: t('news.categories.company', lang === 'ar' ? 'شركات' : lang === 'fr' ? 'Entreprises' : 'Empresas'), 
      icon: <Building2 className="w-3.5 h-3.5" />, 
      color: "bg-purple-500/20 text-purple-400" 
    },
    sector: { 
      label: t('news.categories.sector', lang === 'ar' ? 'قطاعات' : lang === 'fr' ? 'Secteurs' : 'Sectores'), 
      icon: <TrendingUp className="w-3.5 h-3.5" />, 
      color: "bg-orange-500/20 text-orange-400" 
    },
    economy: { 
      label: t('news.categories.economy', lang === 'ar' ? 'اقتصاد' : lang === 'fr' ? 'Économie' : 'Economía'), 
      icon: <Landmark className="w-3.5 h-3.5" />, 
      color: "bg-emerald-500/20 text-emerald-400" 
    },
    analysis: { 
      label: t('news.categories.analysis', lang === 'ar' ? 'تحليل' : lang === 'fr' ? 'Analyse' : 'Análisis'), 
      icon: <AlertCircle className="w-3.5 h-3.5" />, 
      color: "bg-cyan-500/20 text-cyan-400" 
    },
  };

  const sentimentLabels: Record<string, string> = {
    positive: lang === 'ar' ? 'إيجابي' : lang === 'fr' ? 'Positif' : 'Positivo',
    negative: lang === 'ar' ? 'سلبي' : lang === 'fr' ? 'Négatif' : 'Negativo',
    neutral: lang === 'ar' ? 'محايد' : lang === 'fr' ? 'Neutre' : 'Neutral',
  };

  const importanceConfig: Record<string, { color: string; dot: string }> = {
    high: { color: "border-l-red-500", dot: "bg-red-500" },
    medium: { color: "border-l-yellow-500", dot: "bg-yellow-500" },
    low: { color: "border-l-gray-500", dot: "bg-gray-500" },
  };

  const filteredNews = filter === "all" 
    ? mockNews 
    : mockNews.filter(n => n.category === filter);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      {/* Header */}
      <div className="bg-muted/50 px-4 py-3 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
            <Newspaper className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-bold text-foreground text-sm">
              {lang === 'ar' ? 'أخبار السوق' : lang === 'fr' ? 'Actualités du marché' : 'Noticias del mercado'}
            </h3>
            <p className="text-[10px] text-muted-foreground">
              {lang === 'ar' ? 'تحديث مستمر' : lang === 'fr' ? 'Mise à jour continue' : 'Actualización continua'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-muted"
            onClick={handleRefresh}
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="px-4 py-2 border-b border-border flex items-center gap-2 overflow-x-auto scrollbar-hide">
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
            filter === "all" 
              ? "bg-primary text-primary-foreground" 
              : "bg-muted text-muted-foreground hover:text-foreground"
          }`}
        >
          {lang === 'ar' ? 'الكل' : lang === 'fr' ? 'Tout' : 'Todo'}
        </button>
        {Object.entries(categoryConfig).map(([key, config]) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              filter === key 
                ? "bg-primary text-primary-foreground" 
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {config.icon}
            {config.label}
          </button>
        ))}
      </div>

      {/* News List */}
      <div className="divide-y divide-border max-h-[500px] overflow-y-auto">
        {filteredNews.map((news, index) => (
          <motion.article
            key={news.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`p-4 hover:bg-muted/30 transition-colors cursor-pointer ${isRTL ? 'border-r-2' : 'border-l-2'} ${isRTL ? importanceConfig[news.importance].color.replace('border-l', 'border-r') : importanceConfig[news.importance].color}`}
          >
            <div className="flex items-start gap-3">
              <div className={`mt-1.5 w-2 h-2 rounded-full ${importanceConfig[news.importance].dot} animate-pulse`} />
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <Badge 
                    variant="secondary" 
                    className={`${categoryConfig[news.category].color} text-[10px] font-medium px-2 py-0.5`}
                  >
                    <span className="flex items-center gap-1">
                      {categoryConfig[news.category].icon}
                      {categoryConfig[news.category].label}
                    </span>
                  </Badge>
                  
                  {news.sentiment && (
                    <span className={`flex items-center gap-0.5 text-[10px] ${
                      news.sentiment === "positive" ? "text-success" :
                      news.sentiment === "negative" ? "text-destructive" :
                      "text-muted-foreground"
                    }`}>
                      {news.sentiment === "positive" && <TrendingUp className="w-3 h-3" />}
                      {news.sentiment === "negative" && <TrendingDown className="w-3 h-3" />}
                      {sentimentLabels[news.sentiment]}
                    </span>
                  )}
                  
                  {news.relatedStock && (
                    <Badge variant="outline" className="text-[10px] border-border text-muted-foreground">
                      {news.relatedStock}
                    </Badge>
                  )}
                </div>

                <h4 className="font-semibold text-foreground text-sm leading-relaxed mb-1.5">
                  {getLocalizedText(news, 'title')}
                </h4>
                
                <p className="text-muted-foreground text-xs leading-relaxed line-clamp-2 mb-2">
                  {getLocalizedText(news, 'summary')}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                    <span>{getLocalizedText(news, 'source')}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {getLocalizedText(news, 'time')}
                    </span>
                  </div>
                  
                  {news.link && (
                    <a 
                      href={news.link} 
                      className="text-primary hover:underline text-xs flex items-center gap-1"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {lang === 'ar' ? 'المزيد' : lang === 'fr' ? 'Plus' : 'Más'}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.article>
        ))}
      </div>

      {/* Footer */}
      <div className="bg-muted/50 px-4 py-2 border-t border-border text-center">
        <button className="text-primary hover:underline text-xs font-medium">
          {lang === 'ar' ? 'عرض جميع الأخبار' : lang === 'fr' ? 'Voir toutes les actualités' : 'Ver todas las noticias'}
        </button>
      </div>
    </div>
  );
};

export default MarketNews;
