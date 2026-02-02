import { motion } from "framer-motion";
import { Sparkles, TrendingUp, DollarSign, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Preset {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  filters: {
    perMin: number;
    perMax: number;
    pbMin: number;
    pbMax: number;
    dividendYieldMin: number;
    roeMin: number;
    liquidityScore: string;
    sector: string;
  };
}

const presets: Preset[] = [
  {
    id: "value",
    name: "أسهم القيمة",
    description: "PER منخفض و P/B أقل من 1.5",
    icon: <DollarSign className="w-4 h-4" />,
    filters: {
      perMin: 0,
      perMax: 15,
      pbMin: 0,
      pbMax: 1.5,
      dividendYieldMin: 0,
      roeMin: 0,
      liquidityScore: "all",
      sector: "all",
    },
  },
  {
    id: "dividend",
    name: "عائد التوزيعات",
    description: "عائد توزيعات أعلى من 4%",
    icon: <TrendingUp className="w-4 h-4" />,
    filters: {
      perMin: 0,
      perMax: 50,
      pbMin: 0,
      pbMax: 5,
      dividendYieldMin: 4,
      roeMin: 0,
      liquidityScore: "all",
      sector: "all",
    },
  },
  {
    id: "quality",
    name: "الجودة العالية",
    description: "ROE أعلى من 15% مع سيولة جيدة",
    icon: <Sparkles className="w-4 h-4" />,
    filters: {
      perMin: 0,
      perMax: 50,
      pbMin: 0,
      pbMax: 5,
      dividendYieldMin: 0,
      roeMin: 15,
      liquidityScore: "high",
      sector: "all",
    },
  },
  {
    id: "safe",
    name: "الاستثمار الآمن",
    description: "سيولة عالية وتوزيعات منتظمة",
    icon: <Shield className="w-4 h-4" />,
    filters: {
      perMin: 0,
      perMax: 25,
      pbMin: 0,
      pbMax: 3,
      dividendYieldMin: 2,
      roeMin: 10,
      liquidityScore: "high",
      sector: "all",
    },
  },
  {
    id: "momentum",
    name: "الزخم",
    description: "أسهم نشطة بسيولة عالية",
    icon: <Zap className="w-4 h-4" />,
    filters: {
      perMin: 0,
      perMax: 50,
      pbMin: 0,
      pbMax: 5,
      dividendYieldMin: 0,
      roeMin: 0,
      liquidityScore: "high",
      sector: "all",
    },
  },
];

interface ScreenerPresetsProps {
  onApplyPreset: (filters: Preset["filters"]) => void;
  activePreset: string | null;
}

const ScreenerPresets = ({ onApplyPreset, activePreset }: ScreenerPresetsProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-wrap gap-2"
    >
      {presets.map((preset) => (
        <Button
          key={preset.id}
          variant={activePreset === preset.id ? "default" : "outline"}
          size="sm"
          className="gap-2"
          onClick={() => onApplyPreset(preset.filters)}
        >
          {preset.icon}
          {preset.name}
        </Button>
      ))}
    </motion.div>
  );
};

export default ScreenerPresets;
