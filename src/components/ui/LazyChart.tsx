import { useState, useEffect, ReactNode, Suspense, lazy } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import { Skeleton } from "./skeleton";

interface LazyChartProps {
  children: ReactNode;
  height?: string;
  delay?: number;
  showLoader?: boolean;
  className?: string;
}

const LazyChart = ({ 
  children, 
  height = "h-64", 
  delay = 0,
  showLoader = true,
  className = ""
}: LazyChartProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Initial visibility with delay
    const visibleTimer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    // Simulate chart loading
    const loadTimer = setTimeout(() => {
      setIsLoaded(true);
    }, delay + 300);

    return () => {
      clearTimeout(visibleTimer);
      clearTimeout(loadTimer);
    };
  }, [delay]);

  return (
    <div className={`relative ${height} ${className}`}>
      <AnimatePresence mode="wait">
        {!isLoaded && showLoader && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-secondary/30 rounded-xl"
          >
            {/* Shimmer skeleton */}
            <div className="w-full h-full p-4">
              <div className="w-full h-full bg-gradient-to-r from-secondary/50 via-secondary/30 to-secondary/50 rounded-lg animate-pulse" />
            </div>
            
            {/* Loading indicator */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                <span className="text-xs text-muted-foreground">جاري التحميل...</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: isLoaded ? 1 : 0, scale: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-full h-full"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Progressive loading wrapper for multiple charts
interface ProgressiveChartsProps {
  charts: {
    id: string;
    component: ReactNode;
    height?: string;
  }[];
  staggerDelay?: number;
}

export const ProgressiveCharts = ({ charts, staggerDelay = 150 }: ProgressiveChartsProps) => {
  return (
    <div className="space-y-6">
      {charts.map((chart, index) => (
        <LazyChart
          key={chart.id}
          height={chart.height}
          delay={index * staggerDelay}
        >
          {chart.component}
        </LazyChart>
      ))}
    </div>
  );
};

export default LazyChart;
