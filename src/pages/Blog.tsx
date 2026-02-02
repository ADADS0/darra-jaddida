import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/landing/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Search,
  Calendar,
  Clock,
  User,
  TrendingUp,
  TrendingDown,
  ArrowLeft,
  BookOpen,
  Tag,
  Eye,
  MessageCircle,
  Share2,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Filter
} from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  titleEn: string;
  excerpt: string;
  excerptEn: string;
  content: string;
  author: string;
  date: string;
  readTime: number;
  category: string;
  categoryEn: string;
  image: string;
  tags: string[];
  views: number;
  comments: number;
  sentiment?: "positive" | "negative" | "neutral";
  relatedStocks?: string[];
  featured?: boolean;
}

const mockBlogPosts: BlogPost[] = [
  {
    id: "1",
    title: "اتصالات المغرب تحقق نتائج قياسية في الربع الرابع من 2025",
    titleEn: "Maroc Telecom Achieves Record Results in Q4 2025",
    excerpt: "سجلت اتصالات المغرب ارتفاعاً ملحوظاً في أرباحها بنسبة 15% مقارنة بالفترة نفسها من العام الماضي، مما يعكس نجاح استراتيجيتها في التحول الرقمي.",
    excerptEn: "Maroc Telecom recorded a notable 15% increase in profits compared to the same period last year.",
    content: "",
    author: "أحمد المالكي",
    date: "2026-01-14",
    readTime: 5,
    category: "تحليل الشركات",
    categoryEn: "Company Analysis",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800",
    tags: ["اتصالات", "أرباح", "IAM"],
    views: 1250,
    comments: 24,
    sentiment: "positive",
    relatedStocks: ["IAM"],
    featured: true
  },
  {
    id: "2",
    title: "البنك المركزي يثبت سعر الفائدة عند 3% لدعم النمو الاقتصادي",
    titleEn: "Central Bank Maintains Interest Rate at 3% to Support Economic Growth",
    excerpt: "قرر بنك المغرب الإبقاء على سعر الفائدة الرئيسي دون تغيير في اجتماعه الأخير، مشيراً إلى استقرار التضخم وضرورة دعم النشاط الاقتصادي.",
    excerptEn: "Bank Al-Maghrib decided to keep the key interest rate unchanged at its latest meeting.",
    content: "",
    author: "سارة الحسني",
    date: "2026-01-13",
    readTime: 4,
    category: "الاقتصاد الكلي",
    categoryEn: "Macroeconomics",
    image: "https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?w=800",
    tags: ["بنك المغرب", "سعر الفائدة", "السياسة النقدية"],
    views: 2100,
    comments: 45,
    sentiment: "neutral"
  },
  {
    id: "3",
    title: "قطاع البنوك يقود مكاسب مؤشر MASI في بداية 2026",
    titleEn: "Banking Sector Leads MASI Gains in Early 2026",
    excerpt: "شهد قطاع البنوك أداءً متميزاً في الأسابيع الأولى من العام الجديد، مع ارتفاع أسهم التجاري وفا بنك والبنك الشعبي المركزي بنسب ملحوظة.",
    excerptEn: "The banking sector witnessed outstanding performance in the first weeks of the new year.",
    content: "",
    author: "كريم الفاسي",
    date: "2026-01-12",
    readTime: 6,
    category: "تحليل السوق",
    categoryEn: "Market Analysis",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800",
    tags: ["البنوك", "MASI", "ATW", "BCP"],
    views: 1800,
    comments: 32,
    sentiment: "positive",
    relatedStocks: ["ATW", "BCP"]
  },
  {
    id: "4",
    title: "لافارج هولسيم المغرب توقع عقداً ضخماً لمشاريع البنية التحتية",
    titleEn: "LafargeHolcim Morocco Signs Major Infrastructure Contract",
    excerpt: "أعلنت لافارج هولسيم المغرب عن توقيع عقد بقيمة 500 مليون درهم لتوريد مواد البناء لمشاريع بنية تحتية كبرى في جهة الدار البيضاء سطات.",
    excerptEn: "LafargeHolcim Morocco announced a 500 million MAD contract for major infrastructure projects.",
    content: "",
    author: "محمد العلوي",
    date: "2026-01-11",
    readTime: 4,
    category: "أخبار الشركات",
    categoryEn: "Company News",
    image: "https://images.unsplash.com/photo-1590074072786-a66914d668f1?w=800",
    tags: ["البناء", "البنية التحتية", "LHM"],
    views: 950,
    comments: 15,
    sentiment: "positive",
    relatedStocks: ["LHM"]
  },
  {
    id: "5",
    title: "توقعات إيجابية لقطاع العقار المغربي في 2026",
    titleEn: "Positive Outlook for Moroccan Real Estate Sector in 2026",
    excerpt: "يتوقع المحللون انتعاشاً في قطاع العقار المغربي خلال العام الجاري، مدفوعاً ببرامج الدعم الحكومي وانخفاض أسعار الفائدة.",
    excerptEn: "Analysts expect a recovery in the Moroccan real estate sector during the current year.",
    content: "",
    author: "ليلى بنسليمان",
    date: "2026-01-10",
    readTime: 7,
    category: "تحليل القطاعات",
    categoryEn: "Sector Analysis",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800",
    tags: ["العقارات", "السكن", "ADH", "ALM"],
    views: 1400,
    comments: 28,
    sentiment: "positive",
    relatedStocks: ["ADH", "ALM", "RDS"]
  },
  {
    id: "6",
    title: "تراجع أسهم الطاقة مع انخفاض أسعار النفط عالمياً",
    titleEn: "Energy Stocks Decline Amid Global Oil Price Drop",
    excerpt: "تأثرت أسهم قطاع الطاقة المغربي بتراجع أسعار النفط في الأسواق العالمية، مما أدى إلى انخفاض أسهم تاقة موروكو وأفريقيا غاز.",
    excerptEn: "Moroccan energy sector stocks were affected by the decline in global oil prices.",
    content: "",
    author: "ياسين الإدريسي",
    date: "2026-01-09",
    readTime: 5,
    category: "تحليل القطاعات",
    categoryEn: "Sector Analysis",
    image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800",
    tags: ["الطاقة", "النفط", "TQM", "GAZ"],
    views: 780,
    comments: 12,
    sentiment: "negative",
    relatedStocks: ["TQM", "GAZ"]
  }
];

const categories = [
  { ar: "الكل", en: "All", count: 42 },
  { ar: "تحليل السوق", en: "Market Analysis", count: 15 },
  { ar: "تحليل الشركات", en: "Company Analysis", count: 12 },
  { ar: "تحليل القطاعات", en: "Sector Analysis", count: 8 },
  { ar: "الاقتصاد الكلي", en: "Macroeconomics", count: 5 },
  { ar: "أخبار الشركات", en: "Company News", count: 2 },
];

const Blog = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredPosts = mockBlogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          post.titleEn.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "الكل" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredPost = mockBlogPosts.find(post => post.featured);

  return (
    <div className="min-h-screen bg-background" dir={isRTL ? 'rtl' : 'ltr'}>
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/10 to-background py-16">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-3xl mx-auto"
            >
              <div className="flex items-center justify-center gap-2 mb-4">
                <BookOpen className="w-8 h-8 text-primary" />
                <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                  {isRTL ? "مدونة كازابلو" : "Casablue Blog"}
                </h1>
              </div>
              <p className="text-lg text-muted-foreground mb-8">
                {isRTL 
                  ? "أحدث الأخبار والتحليلات حول سوق الأسهم المغربية"
                  : "Latest news and analysis on the Moroccan stock market"
                }
              </p>

              {/* Search */}
              <div className="relative max-w-xl mx-auto">
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder={isRTL ? "ابحث في المقالات..." : "Search articles..."}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-14 pr-12 pl-4 text-lg rounded-2xl"
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Featured Post */}
        {featuredPost && (
          <section className="py-8">
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Link to={`/blog/${featuredPost.id}`}>
                  <div className="relative overflow-hidden rounded-3xl bg-card border border-border group">
                    <div className="grid lg:grid-cols-2 gap-0">
                      {/* Image */}
                      <div className="relative h-64 lg:h-96 overflow-hidden">
                        <img
                          src={featuredPost.image}
                          alt={isRTL ? featuredPost.title : featuredPost.titleEn}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent lg:bg-gradient-to-r" />
                        <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground">
                          {isRTL ? "مميز" : "Featured"}
                        </Badge>
                      </div>

                      {/* Content */}
                      <div className="p-6 lg:p-10 flex flex-col justify-center">
                        <div className="flex items-center gap-3 mb-4">
                          <Badge variant="outline" className="text-primary border-primary/30">
                            {isRTL ? featuredPost.category : featuredPost.categoryEn}
                          </Badge>
                          {featuredPost.sentiment && (
                            <span className={`flex items-center gap-1 text-sm ${
                              featuredPost.sentiment === "positive" ? "text-green-500" :
                              featuredPost.sentiment === "negative" ? "text-red-500" :
                              "text-muted-foreground"
                            }`}>
                              {featuredPost.sentiment === "positive" ? <TrendingUp className="w-4 h-4" /> :
                               featuredPost.sentiment === "negative" ? <TrendingDown className="w-4 h-4" /> : null}
                              {featuredPost.sentiment === "positive" ? (isRTL ? "إيجابي" : "Positive") :
                               featuredPost.sentiment === "negative" ? (isRTL ? "سلبي" : "Negative") :
                               (isRTL ? "محايد" : "Neutral")}
                            </span>
                          )}
                        </div>

                        <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors">
                          {isRTL ? featuredPost.title : featuredPost.titleEn}
                        </h2>
                        
                        <p className="text-muted-foreground mb-6 line-clamp-3">
                          {isRTL ? featuredPost.excerpt : featuredPost.excerptEn}
                        </p>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {featuredPost.author}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(featuredPost.date).toLocaleDateString(isRTL ? 'ar-MA' : 'fr-FR')}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {featuredPost.readTime} {isRTL ? "دقائق" : "min"}
                          </span>
                        </div>

                        {featuredPost.relatedStocks && (
                          <div className="flex items-center gap-2 mt-4">
                            {featuredPost.relatedStocks.map(stock => (
                              <Badge key={stock} variant="secondary">{stock}</Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            </div>
          </section>
        )}

        {/* Main Content */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Sidebar - Categories */}
              <aside className="lg:w-72 shrink-0">
                <div className="sticky top-24 bg-card rounded-2xl border border-border p-4">
                  <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Filter className="w-5 h-5" />
                    {isRTL ? "الفئات" : "Categories"}
                  </h3>
                  <div className="space-y-1">
                    {categories.map((cat) => (
                      <button
                        key={cat.ar}
                        onClick={() => setSelectedCategory(cat.ar)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-colors ${
                          selectedCategory === cat.ar
                            ? "bg-primary text-primary-foreground"
                            : "text-foreground hover:bg-secondary"
                        }`}
                      >
                        <span>{isRTL ? cat.ar : cat.en}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs ${
                          selectedCategory === cat.ar
                            ? "bg-primary-foreground/20"
                            : "bg-secondary"
                        }`}>
                          {cat.count}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </aside>

              {/* Posts Grid */}
              <div className="flex-1">
                <div className="grid md:grid-cols-2 gap-6">
                  {filteredPosts.filter(p => !p.featured).map((post, index) => (
                    <motion.article
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link to={`/blog/${post.id}`}>
                        <div className="bg-card rounded-2xl border border-border overflow-hidden group hover:border-primary/50 transition-colors">
                          {/* Image */}
                          <div className="relative h-48 overflow-hidden">
                            <img
                              src={post.image}
                              alt={isRTL ? post.title : post.titleEn}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            
                            {/* Category Badge */}
                            <Badge className="absolute top-3 right-3 bg-background/80 backdrop-blur-sm text-foreground">
                              {isRTL ? post.category : post.categoryEn}
                            </Badge>

                            {/* Sentiment */}
                            {post.sentiment && (
                              <div className={`absolute top-3 left-3 flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${
                                post.sentiment === "positive" ? "bg-green-500/20 text-green-400" :
                                post.sentiment === "negative" ? "bg-red-500/20 text-red-400" :
                                "bg-gray-500/20 text-gray-400"
                              }`}>
                                {post.sentiment === "positive" ? <TrendingUp className="w-3 h-3" /> :
                                 post.sentiment === "negative" ? <TrendingDown className="w-3 h-3" /> : null}
                              </div>
                            )}
                          </div>

                          {/* Content */}
                          <div className="p-5">
                            <h3 className="font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                              {isRTL ? post.title : post.titleEn}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                              {isRTL ? post.excerpt : post.excerptEn}
                            </p>

                            {/* Meta */}
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <div className="flex items-center gap-3">
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3.5 h-3.5" />
                                  {new Date(post.date).toLocaleDateString(isRTL ? 'ar-MA' : 'fr-FR', { month: 'short', day: 'numeric' })}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3.5 h-3.5" />
                                  {post.readTime} {isRTL ? "د" : "min"}
                                </span>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="flex items-center gap-1">
                                  <Eye className="w-3.5 h-3.5" />
                                  {post.views}
                                </span>
                                <span className="flex items-center gap-1">
                                  <MessageCircle className="w-3.5 h-3.5" />
                                  {post.comments}
                                </span>
                              </div>
                            </div>

                            {/* Related Stocks */}
                            {post.relatedStocks && (
                              <div className="flex items-center gap-2 mt-4">
                                {post.relatedStocks.map(stock => (
                                  <Badge key={stock} variant="outline" className="text-xs">
                                    {stock}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </Link>
                    </motion.article>
                  ))}
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-center gap-2 mt-10">
                  <Button variant="outline" size="icon" disabled>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                  {[1, 2, 3].map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="icon"
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  ))}
                  <Button variant="outline" size="icon">
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Blog;