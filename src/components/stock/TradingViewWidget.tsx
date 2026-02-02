import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface TradingViewWidgetProps {
  symbol: string;
  embedded?: boolean;
}

const TradingViewWidget = ({ symbol, embedded = false }: TradingViewWidgetProps) => {
  const widgetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!widgetRef.current) return;

    // Clear previous widget
    widgetRef.current.innerHTML = "";

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: `CSEMA:${symbol}`,
      interval: "D",
      timezone: "Africa/Casablanca",
      theme: "dark",
      style: "1",
      locale: "ar",
      enable_publishing: false,
      allow_symbol_change: false,
      calendar: false,
      hide_top_toolbar: false,
      hide_legend: false,
      save_image: true,
      support_host: "https://www.tradingview.com",
      // Match site colors
      backgroundColor: "#131722",
      gridColor: "rgba(42, 46, 57, 0.6)",
      toolbar_bg: "#131722",
      withdateranges: true,
      studies: ["RSI@tv-basicstudies", "MACD@tv-basicstudies"],
    });

    widgetRef.current.appendChild(script);

    return () => {
      if (widgetRef.current) widgetRef.current.innerHTML = "";
    };
  }, [symbol]);

  const content = (
    <div
      className="tradingview-widget-container w-full rounded-lg overflow-hidden"
      style={{ height: embedded ? "420px" : "420px" }}
    >
      <div ref={widgetRef} className="tradingview-widget-container__widget w-full h-full" />
    </div>
  );

  if (embedded) {
    return content;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className="bg-[#131722] rounded-2xl border border-[#2a2e39] overflow-hidden"
    >
      <div className="p-4 border-b border-[#2a2e39] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-[#2962ff] flex items-center justify-center">
            <svg viewBox="0 0 36 28" className="w-4 h-4 text-white fill-current">
              <path d="M14 22H7V11H0V4h14v18zM28 22h-8l7.5-18h8L28 22z" />
            </svg>
          </div>
          <span className="text-sm font-medium text-white">TradingView</span>
        </div>
        <span className="text-xs text-[#787b86]">رسم بياني متقدم • RSI • MACD</span>
      </div>
      {content}
    </motion.div>
  );
};

export default TradingViewWidget;
