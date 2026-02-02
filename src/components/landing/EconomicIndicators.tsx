import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, DollarSign, Euro, Percent, BarChart3, Building2, Wheat } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect } from "react";

interface IndicatorCardProps {
  icon: React.ReactNode;
  title: string;
  value2025: string;
  value2026: string;
  change?: "up" | "down" | "neutral";
  color: string;
  delay: number;
}

const IndicatorCard = ({ icon, title, value2025, value2026, change, color, delay }: IndicatorCardProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  if (!isLoaded) {
    return (
      <div className="bg-[#161b22] rounded-xl p-4 border border-[#30363d]">
        <Skeleton className="h-4 w-24 mb-3 bg-[#21262d]" />
        <Skeleton className="h-8 w-16 mb-1 bg-[#21262d]" />
        <Skeleton className="h-3 w-12 bg-[#21262d]" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: delay / 1000 }}
      className="bg-[#161b22] rounded-xl p-4 border border-[#30363d] hover:border-[#484f58] transition-all group"
    >
      <div className="flex items-center gap-2 mb-3">
        <div className={`w-8 h-8 rounded-lg ${color} flex items-center justify-center`}>
          {icon}
        </div>
        <span className="text-xs text-[#8b949e] font-medium">{title}</span>
      </div>
      
      <div className="flex items-end justify-between">
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-white">{value2025}</span>
            <span className="text-[10px] text-[#8b949e]">2025</span>
          </div>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-sm text-[#8b949e]">{value2026}</span>
            <span className="text-[10px] text-[#6e7681]">2026</span>
          </div>
        </div>
        
        {change && (
          <div className={`flex items-center ${change === 'up' ? 'text-[#3fb950]' : change === 'down' ? 'text-[#f85149]' : 'text-[#8b949e]'}`}>
            {change === 'up' ? <TrendingUp className="w-4 h-4" /> : change === 'down' ? <TrendingDown className="w-4 h-4" /> : null}
          </div>
        )}
      </div>
    </motion.div>
  );
};

interface CurrencyCardProps {
  from: string;
  to: string;
  icon: React.ReactNode;
  currentRate: string;
  previousRate: string;
  change: number;
  delay: number;
}

const CurrencyCard = ({ from, to, icon, currentRate, previousRate, change, delay }: CurrencyCardProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  if (!isLoaded) {
    return (
      <div className="bg-[#161b22] rounded-xl p-4 border border-[#30363d]">
        <Skeleton className="h-4 w-24 mb-3 bg-[#21262d]" />
        <Skeleton className="h-8 w-20 bg-[#21262d]" />
      </div>
    );
  }

  const isPositive = change >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: delay / 1000 }}
      className="bg-[#161b22] rounded-xl p-4 border border-[#30363d] hover:border-[#484f58] transition-all"
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-lg bg-[#2962ff]/20 flex items-center justify-center text-[#58a6ff]">
          {icon}
        </div>
        <span className="text-xs text-[#8b949e] font-medium">{from} → {to}</span>
      </div>
      
      <div className="flex items-end justify-between">
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-white">{currentRate}</span>
            <span className="text-xs text-[#8b949e]">MAD</span>
          </div>
          <div className="text-xs text-[#6e7681] mt-0.5">
            أمس: {previousRate} MAD
          </div>
        </div>
        
        <div className={`text-xs font-medium px-2 py-1 rounded-md ${isPositive ? 'bg-[#238636]/20 text-[#3fb950]' : 'bg-[#da3633]/20 text-[#f85149]'}`}>
          {isPositive ? '+' : ''}{change.toFixed(2)}%
        </div>
      </div>
    </motion.div>
  );
};

const EconomicIndicators = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const indicators = [
    {
      icon: <TrendingUp className="w-4 h-4 text-[#3fb950]" />,
      title: "النمو الاقتصادي",
      value2025: "4.7%",
      value2026: "5.0%",
      change: "up" as const,
      color: "bg-[#238636]/20",
    },
    {
      icon: <Wheat className="w-4 h-4 text-[#f0883e]" />,
      title: "القطاع الفلاحي",
      value2025: "4.5%",
      value2026: "10.4%",
      change: "up" as const,
      color: "bg-[#f0883e]/20",
    },
    {
      icon: <Building2 className="w-4 h-4 text-[#a371f7]" />,
      title: "القطاع غير الفلاحي",
      value2025: "4.5%",
      value2026: "4.3%",
      change: "down" as const,
      color: "bg-[#a371f7]/20",
    },
    {
      icon: <BarChart3 className="w-4 h-4 text-[#58a6ff]" />,
      title: "القطاع الصناعي",
      value2025: "4.8%",
      value2026: "4.2%",
      change: "down" as const,
      color: "bg-[#58a6ff]/20",
    },
    {
      icon: <Percent className="w-4 h-4 text-[#f85149]" />,
      title: "التضخم",
      value2025: "1.9%",
      value2026: "1.3%",
      change: "down" as const,
      color: "bg-[#f85149]/20",
    },
    {
      icon: <BarChart3 className="w-4 h-4 text-[#79c0ff]" />,
      title: "عجز الميزانية (% من PIB)",
      value2025: "3.6%",
      value2026: "3.2%",
      change: "down" as const,
      color: "bg-[#79c0ff]/20",
    },
    {
      icon: <TrendingDown className="w-4 h-4 text-[#d29922]" />,
      title: "عجز الحساب الجاري",
      value2025: "2.4%",
      value2026: "1.9%",
      change: "down" as const,
      color: "bg-[#d29922]/20",
    },
    {
      icon: <BarChart3 className="w-4 h-4 text-[#8b949e]" />,
      title: "الدين العام (% من PIB)",
      value2025: "78.9%",
      value2026: "77.5%",
      change: "down" as const,
      color: "bg-[#8b949e]/20",
    },
  ];

  const currencies = [
    {
      from: "USD",
      to: "MAD",
      icon: <DollarSign className="w-4 h-4" />,
      currentRate: "9.11",
      previousRate: "9.11",
      change: 0.00,
    },
    {
      from: "EUR",
      to: "MAD",
      icon: <Euro className="w-4 h-4" />,
      currentRate: "10.80",
      previousRate: "10.80",
      change: 0.00,
    },
  ];

  if (!isVisible) {
    return (
      <div className="bg-gradient-to-br from-[#0d1117] to-[#161b22] rounded-2xl border border-[#30363d] p-6">
        <Skeleton className="h-6 w-48 mb-6 bg-[#21262d]" />
        <div className="grid grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl bg-[#21262d]" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-[#0d1117] to-[#161b22] rounded-2xl border border-[#30363d] overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-[#161b22] to-[#1c2128] px-6 py-4 border-b border-[#30363d]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2962ff] to-[#1e88e5] flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">المؤشرات الاقتصادية</h3>
              <p className="text-xs text-[#8b949e]">توقعات بنك المغرب 2025-2026</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#3fb950] animate-pulse"></span>
            <span className="text-xs text-[#8b949e]">محدث</span>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Currency Rates */}
        <div>
          <h4 className="text-sm font-semibold text-[#8b949e] mb-3 flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            أسعار الصرف
          </h4>
          <div className="grid grid-cols-2 gap-3">
            {currencies.map((currency, index) => (
              <CurrencyCard
                key={currency.from}
                {...currency}
                delay={200 + index * 100}
              />
            ))}
          </div>
        </div>

        {/* Economic Indicators Grid */}
        <div>
          <h4 className="text-sm font-semibold text-[#8b949e] mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            مؤشرات النمو والتضخم
          </h4>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {indicators.map((indicator, index) => (
              <IndicatorCard
                key={indicator.title}
                {...indicator}
                delay={400 + index * 80}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EconomicIndicators;
