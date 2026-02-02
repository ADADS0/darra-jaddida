import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

// Mock company logos - in production would come from API/CDN
const companyLogos: Record<string, string> = {
  IAM: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Maroc_Telecom_Logo.svg/200px-Maroc_Telecom_Logo.svg.png",
  ATW: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Attijariwafa_Bank_logo.svg/200px-Attijariwafa_Bank_logo.svg.png",
  BCP: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Banque_Populaire_Maroc.svg/200px-Banque_Populaire_Maroc.svg.png",
  BOA: "https://upload.wikimedia.org/wikipedia/en/thumb/d/da/Bank_of_Africa_logo.svg/200px-Bank_of_Africa_logo.svg.png",
  CIH: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/CIH_Bank_Logo.svg/200px-CIH_Bank_Logo.svg.png",
  TQM: "https://www.taqa.ma/wp-content/uploads/2020/01/taqa-morocco-logo.png",
  LBV: "https://www.labellevie.ma/wp-content/themes/labellevie/images/logo.png",
  MNG: "https://www.managem-ona.com/wp-content/themes/managem/images/logo.svg",
  ADH: "https://www.aldahwa.com/images/logo.png",
};

const topGainers = [
  { symbol: "TQM", name: "تاقة موروكو", sector: "طاقة", price: "1,125.00", change: "+4.82%", volume: "45.2M" },
  { symbol: "LBV", name: "لابيل في", sector: "غذائي", price: "2,450.00", change: "+3.15%", volume: "28.6M" },
  { symbol: "IAM", name: "اتصالات المغرب", sector: "اتصالات", price: "118.50", change: "+2.35%", volume: "67.8M" },
  { symbol: "CIH", name: "CIH بنك", sector: "بنوك", price: "345.20", change: "+1.89%", volume: "15.4M" },
];

const topLosers = [
  { symbol: "MNG", name: "مناجم", sector: "مناجم", price: "1,890.00", change: "-2.45%", volume: "32.1M" },
  { symbol: "BOA", name: "البنك المغربي", sector: "بنوك", price: "195.60", change: "-1.87%", volume: "21.3M" },
  { symbol: "BCP", name: "البنك الشعبي", sector: "بنوك", price: "285.00", change: "-1.20%", volume: "54.7M" },
  { symbol: "ADH", name: "الضحى", sector: "عقاري", price: "56.80", change: "-0.95%", volume: "8.9M" },
];

const StockCard = ({ stock, isGainer }: { stock: typeof topGainers[0]; isGainer: boolean }) => {
  const logo = companyLogos[stock.symbol];
  
  return (
    <Link to={`/stock/${stock.symbol}`}>
      <motion.div
        whileHover={{ y: -2, borderColor: isGainer ? "hsl(var(--chart-positive))" : "hsl(var(--chart-negative))" }}
        className="bg-card rounded-xl border border-border p-4 transition-all duration-300 cursor-pointer"
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            {/* Logo Container */}
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden ${
              isGainer ? "bg-chart-positive/10" : "bg-chart-negative/10"
            }`}>
              {logo ? (
                <img 
                  src={logo} 
                  alt={stock.name}
                  className="w-7 h-7 object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement!.innerHTML = `<span class="text-sm font-bold ${isGainer ? 'text-chart-positive' : 'text-chart-negative'}">${stock.symbol.slice(0, 2)}</span>`;
                  }}
                />
              ) : (
                <span className={`text-sm font-bold ${isGainer ? "text-chart-positive" : "text-chart-negative"}`}>
                  {stock.symbol.slice(0, 2)}
                </span>
              )}
            </div>
            <div>
              <p className="font-semibold text-foreground">{stock.symbol}</p>
              <p className="text-xs text-muted-foreground">{stock.name}</p>
            </div>
          </div>
          <span className="text-[10px] px-2 py-1 rounded-full bg-secondary text-muted-foreground">
            {stock.sector}
          </span>
        </div>
        
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs text-muted-foreground mb-1">السعر</p>
            <p className="text-lg font-bold text-foreground">{stock.price}</p>
          </div>
          <div className="text-left">
            <p className="text-xs text-muted-foreground mb-1">التغير</p>
            <div className={`flex items-center gap-1 ${isGainer ? "text-chart-positive" : "text-chart-negative"}`}>
              {isGainer ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              <span className="text-lg font-bold">{stock.change}</span>
            </div>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-border/50 flex justify-between items-center">
          <span className="text-xs text-muted-foreground">حجم التداول</span>
          <span className="text-xs font-medium text-foreground">{stock.volume} MAD</span>
        </div>
      </motion.div>
    </Link>
  );
};

const TopMovers = () => {
  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12"
        >
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              أكبر التحركات
            </h2>
            <p className="text-muted-foreground">
              الأسهم الأكثر ارتفاعاً وانخفاضاً اليوم
            </p>
          </div>
          <Button variant="ghost" className="mt-4 md:mt-0 group text-muted-foreground">
            عرض الكل
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1 rtl-flip" />
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Gainers */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-chart-positive" />
              <h3 className="text-lg font-semibold text-foreground">الأكثر ارتفاعاً</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {topGainers.map((stock, index) => (
                <motion.div
                  key={stock.symbol}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <StockCard stock={stock} isGainer={true} />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Top Losers */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-chart-negative" />
              <h3 className="text-lg font-semibold text-foreground">الأكثر انخفاضاً</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {topLosers.map((stock, index) => (
                <motion.div
                  key={stock.symbol}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <StockCard stock={stock} isGainer={false} />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TopMovers;
