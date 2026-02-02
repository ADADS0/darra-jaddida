import { motion } from "framer-motion";
import { FileText, Download, ExternalLink, Calendar, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StockFilingsProps {
  symbol: string;
}

// Mock filings data
const filings = [
  {
    id: 1,
    type: "التقرير السنوي",
    typeEn: "Annual Report",
    date: "2024-03-15",
    title: "التقرير السنوي 2023",
    hasAISummary: true,
    source: "AMMC",
  },
  {
    id: 2,
    type: "بلاغ صحفي",
    typeEn: "Press Release",
    date: "2024-02-28",
    title: "نتائج الربع الرابع 2023",
    hasAISummary: true,
    source: "الشركة",
  },
  {
    id: 3,
    type: "توزيعات",
    typeEn: "Dividend",
    date: "2024-02-15",
    title: "إعلان توزيع أرباح 4.50 درهم",
    hasAISummary: false,
    source: "البورصة",
  },
  {
    id: 4,
    type: "التقرير النصفي",
    typeEn: "Semi-Annual",
    date: "2023-09-30",
    title: "التقرير النصفي الأول 2023",
    hasAISummary: true,
    source: "AMMC",
  },
  {
    id: 5,
    type: "حدث شركة",
    typeEn: "Corporate Action",
    date: "2023-05-20",
    title: "الجمعية العمومية السنوية",
    hasAISummary: false,
    source: "البورصة",
  },
];

const getTypeColor = (type: string) => {
  switch (type) {
    case "التقرير السنوي":
      return "bg-primary/10 text-primary";
    case "بلاغ صحفي":
      return "bg-chart-line/10 text-chart-line";
    case "توزيعات":
      return "bg-chart-positive/10 text-chart-positive";
    case "التقرير النصفي":
      return "bg-warning/10 text-warning";
    default:
      return "bg-secondary text-muted-foreground";
  }
};

const StockFilings = ({ symbol }: StockFilingsProps) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ar-MA', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-card rounded-2xl border border-border p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-foreground">البلاغات والتقارير</h2>
          <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
            {filings.length}
          </span>
        </div>
        <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
          عرض الكل
          <ExternalLink className="w-3 h-3 mr-1" />
        </Button>
      </div>

      <div className="space-y-3">
        {filings.map((filing, index) => (
          <motion.div
            key={filing.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="group p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-pointer"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 flex-1">
                <div className="w-10 h-10 rounded-lg bg-card flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${getTypeColor(filing.type)}`}>
                      {filing.type}
                    </span>
                    {filing.hasAISummary && (
                      <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-accent/10 text-accent">
                        <Sparkles className="w-3 h-3" />
                        ملخص AI
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-medium text-foreground truncate">
                    {filing.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(filing.date)}</span>
                    <span>•</span>
                    <span>{filing.source}</span>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
              >
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* AI Summary CTA */}
      <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-accent/10 to-primary/10 border border-accent/20">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-accent" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-foreground mb-1">ملخصات ذكية</h3>
            <p className="text-xs text-muted-foreground mb-3">
              احصل على ملخصات AI للتقارير والبلاغات مع استخراج النقاط الرئيسية.
            </p>
            <Button variant="hero" size="sm">
              ترقية للمميز
            </Button>
          </div>
        </div>
      </div>

      {/* Source Info */}
      <div className="mt-4 pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground">
          المصادر: AMMC، بورصة الدار البيضاء، مواقع الشركات الرسمية
        </p>
      </div>
    </motion.div>
  );
};

export default StockFilings;
