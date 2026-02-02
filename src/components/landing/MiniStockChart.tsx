import { useMemo } from "react";
import { useMiniStockHistory } from "@/hooks/useMiniStockHistory";

interface MiniStockChartProps {
  symbol: string;
  change: number;
  className?: string;
}

const MiniStockChart = ({ symbol, change, className = "" }: MiniStockChartProps) => {
  const { data: historyData, isLoading } = useMiniStockHistory(symbol, true);
  
  // Use real data if available, otherwise generate placeholder
  const chartData = useMemo(() => {
    if (historyData?.data && historyData.data.length > 0) {
      return historyData.data.map((point, i) => ({
        x: i,
        y: point.close,
      }));
    }
    
    // Fallback placeholder data while loading
    const points = 30;
    const data: { x: number; y: number }[] = [];
    let seed = symbol.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const pseudoRandom = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
    
    let baseValue = 100;
    const trend = change > 0 ? 0.15 : change < 0 ? -0.15 : 0;
    
    for (let i = 0; i < points; i++) {
      const noise = (pseudoRandom() - 0.5) * 3;
      const trendEffect = trend * (i / points) * 5;
      baseValue = baseValue + noise + trendEffect * 0.3;
      data.push({ x: i, y: Math.max(baseValue, 50) });
    }
    
    return data;
  }, [historyData, symbol, change]);
  
  const minY = Math.min(...chartData.map(d => d.y));
  const maxY = Math.max(...chartData.map(d => d.y));
  const range = maxY - minY || 1;
  
  const width = 160;
  const height = 60;
  const padding = 4;
  
  // Create smooth path
  const pathData = useMemo(() => {
    const points = chartData.map((point, i) => {
      const x = padding + (i / (chartData.length - 1)) * (width - padding * 2);
      const y = height - padding - ((point.y - minY) / range) * (height - padding * 2);
      return { x, y };
    });
    
    if (points.length < 2) return "";
    
    // Create smooth bezier curve
    let path = `M ${points[0].x} ${points[0].y}`;
    
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const cpx = (prev.x + curr.x) / 2;
      path += ` Q ${cpx} ${prev.y} ${curr.x} ${curr.y}`;
    }
    
    return path;
  }, [chartData, minY, range, width, height, padding]);
  
  // Create gradient fill path
  const fillPathData = useMemo(() => {
    const points = chartData.map((point, i) => {
      const x = padding + (i / (chartData.length - 1)) * (width - padding * 2);
      const y = height - padding - ((point.y - minY) / range) * (height - padding * 2);
      return { x, y };
    });
    
    if (points.length < 2) return "";
    
    let path = `M ${points[0].x} ${height}`;
    path += ` L ${points[0].x} ${points[0].y}`;
    
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const cpx = (prev.x + curr.x) / 2;
      path += ` Q ${cpx} ${prev.y} ${curr.x} ${curr.y}`;
    }
    
    path += ` L ${points[points.length - 1].x} ${height}`;
    path += ` Z`;
    
    return path;
  }, [chartData, minY, range, width, height, padding]);
  
  // Determine if positive based on real data trend or fallback to change prop
  const isPositive = useMemo(() => {
    if (historyData?.data && historyData.data.length >= 2) {
      const firstPrice = historyData.data[0].close;
      const lastPrice = historyData.data[historyData.data.length - 1].close;
      return lastPrice >= firstPrice;
    }
    return change >= 0;
  }, [historyData, change]);
  
  const strokeColor = isPositive ? "#22c55e" : "#ef4444";
  const gradientId = `gradient-${symbol}-${isPositive ? 'up' : 'down'}-${Date.now()}`;
  
  // Show loading shimmer
  if (isLoading) {
    return (
      <div className={`w-full h-full ${className} animate-pulse`}>
        <div className="w-full h-full bg-slate-700/30 rounded" />
      </div>
    );
  }
  
  return (
    <svg 
      viewBox={`0 0 ${width} ${height}`} 
      className={`w-full h-full ${className}`}
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={strokeColor} stopOpacity="0.3" />
          <stop offset="100%" stopColor={strokeColor} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      
      {/* Fill area */}
      <path
        d={fillPathData}
        fill={`url(#${gradientId})`}
      />
      
      {/* Line */}
      <path
        d={pathData}
        fill="none"
        stroke={strokeColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* End point glow */}
      {chartData.length > 0 && (
        <circle
          cx={padding + ((chartData.length - 1) / (chartData.length - 1)) * (width - padding * 2)}
          cy={height - padding - ((chartData[chartData.length - 1].y - minY) / range) * (height - padding * 2)}
          r="3"
          fill={strokeColor}
          className="animate-pulse"
        />
      )}
      
      {/* Real data indicator */}
      {historyData?.data && historyData.data.length > 0 && (
        <circle
          cx={width - 8}
          cy={8}
          r="3"
          fill="#22c55e"
          className="opacity-60"
        />
      )}
    </svg>
  );
};

export default MiniStockChart;
