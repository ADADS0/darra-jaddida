import { motion } from "framer-motion";
import { Filter, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FilterState {
  perMin: number;
  perMax: number;
  pbMin: number;
  pbMax: number;
  dividendYieldMin: number;
  roeMin: number;
  liquidityScore: string;
  sector: string;
}

interface ScreenerFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onReset: () => void;
}

const sectors = [
  { value: "all", label: "جميع القطاعات" },
  { value: "banks", label: "البنوك" },
  { value: "telecom", label: "الاتصالات" },
  { value: "real-estate", label: "العقارات" },
  { value: "mining", label: "التعدين" },
  { value: "energy", label: "الطاقة" },
  { value: "insurance", label: "التأمين" },
  { value: "construction", label: "البناء والأشغال" },
  { value: "distribution", label: "التوزيع" },
  { value: "industry", label: "الصناعة" },
];

const liquidityOptions = [
  { value: "all", label: "الكل" },
  { value: "high", label: "عالية (>1M MAD/يوم)" },
  { value: "medium", label: "متوسطة (100K-1M)" },
  { value: "low", label: "منخفضة (<100K)" },
];

const ScreenerFilters = ({ filters, onFilterChange, onReset }: ScreenerFiltersProps) => {
  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    onFilterChange({ ...filters, [key]: value });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-6 border border-border/50"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <Filter className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">فلاتر البحث</h3>
            <p className="text-xs text-muted-foreground">حدد معايير الفرز</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={onReset} className="gap-2">
          <RotateCcw className="w-4 h-4" />
          إعادة تعيين
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* PER Filter */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">نسبة السعر للأرباح (PER)</Label>
            <span className="text-xs text-muted-foreground">
              {filters.perMin} - {filters.perMax}
            </span>
          </div>
          <div className="space-y-2">
            <Slider
              value={[filters.perMin]}
              onValueChange={([v]) => updateFilter("perMin", v)}
              max={50}
              min={0}
              step={1}
              className="w-full"
            />
            <Slider
              value={[filters.perMax]}
              onValueChange={([v]) => updateFilter("perMax", v)}
              max={50}
              min={0}
              step={1}
              className="w-full"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            PER منخفض = سهم أرخص نسبياً
          </p>
        </div>

        {/* P/B Filter */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">السعر للقيمة الدفترية (P/B)</Label>
            <span className="text-xs text-muted-foreground">
              {filters.pbMin.toFixed(1)} - {filters.pbMax.toFixed(1)}
            </span>
          </div>
          <div className="space-y-2">
            <Slider
              value={[filters.pbMin]}
              onValueChange={([v]) => updateFilter("pbMin", v)}
              max={5}
              min={0}
              step={0.1}
              className="w-full"
            />
            <Slider
              value={[filters.pbMax]}
              onValueChange={([v]) => updateFilter("pbMax", v)}
              max={5}
              min={0}
              step={0.1}
              className="w-full"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            P/B &lt; 1 = أقل من القيمة الدفترية
          </p>
        </div>

        {/* Dividend Yield Filter */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">عائد التوزيعات (%)</Label>
            <span className="text-xs text-muted-foreground">
              ≥ {filters.dividendYieldMin}%
            </span>
          </div>
          <Slider
            value={[filters.dividendYieldMin]}
            onValueChange={([v]) => updateFilter("dividendYieldMin", v)}
            max={10}
            min={0}
            step={0.5}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">
            عائد أعلى = دخل سنوي أكبر
          </p>
        </div>

        {/* ROE Filter */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">العائد على حقوق الملكية (ROE)</Label>
            <span className="text-xs text-muted-foreground">
              ≥ {filters.roeMin}%
            </span>
          </div>
          <Slider
            value={[filters.roeMin]}
            onValueChange={([v]) => updateFilter("roeMin", v)}
            max={30}
            min={0}
            step={1}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">
            ROE عالي = كفاءة استخدام رأس المال
          </p>
        </div>

        {/* Liquidity Score */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">درجة السيولة</Label>
          <Select
            value={filters.liquidityScore}
            onValueChange={(v) => updateFilter("liquidityScore", v)}
          >
            <SelectTrigger className="w-full bg-card/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {liquidityOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            سيولة عالية = سهولة البيع والشراء
          </p>
        </div>

        {/* Sector */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">القطاع</Label>
          <Select
            value={filters.sector}
            onValueChange={(v) => updateFilter("sector", v)}
          >
            <SelectTrigger className="w-full bg-card/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sectors.map((sector) => (
                <SelectItem key={sector.value} value={sector.value}>
                  {sector.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            اختر قطاعاً محدداً للتركيز
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default ScreenerFilters;
