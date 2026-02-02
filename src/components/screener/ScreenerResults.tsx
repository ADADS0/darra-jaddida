import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpDown, Star, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import TriangleIndicator from "@/components/ui/TriangleIndicator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Stock {
  symbol: string;
  name: string;
  sector: string;
  price: number;
  change: number;
  per: number;
  pb: number;
  dividendYield: number;
  roe: number;
  liquidityScore: "high" | "medium" | "low";
  avgVolume: number;
}

interface ScreenerResultsProps {
  stocks: Stock[];
  sortBy: string;
  sortDirection: "asc" | "desc";
  onSort: (column: string) => void;
}

const liquidityColors = {
  high: "bg-profit/20 text-profit",
  medium: "bg-warning/20 text-warning",
  low: "bg-loss/20 text-loss",
};

const liquidityLabels = {
  high: "عالية",
  medium: "متوسطة",
  low: "منخفضة",
};

const sectorLabels: Record<string, string> = {
  banks: "البنوك",
  telecom: "الاتصالات",
  "real-estate": "العقارات",
  mining: "التعدين",
  energy: "الطاقة",
  insurance: "التأمين",
  construction: "البناء",
  distribution: "التوزيع",
  industry: "الصناعة",
};

const ScreenerResults = ({ stocks, sortBy, sortDirection, onSort }: ScreenerResultsProps) => {
  const SortHeader = ({ column, children }: { column: string; children: React.ReactNode }) => (
    <TableHead
      className="cursor-pointer hover:text-foreground transition-colors"
      onClick={() => onSort(column)}
    >
      <div className="flex items-center gap-1">
        {children}
        <ArrowUpDown className={`w-3 h-3 ${sortBy === column ? "text-primary" : "text-muted-foreground"}`} />
      </div>
    </TableHead>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="glass rounded-2xl border border-border/50 overflow-hidden"
    >
      <div className="p-4 border-b border-border/50 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-foreground">نتائج البحث</h3>
          <p className="text-sm text-muted-foreground">
            {stocks.length} سهم مطابق للمعايير
          </p>
        </div>
        <Badge variant="outline" className="text-xs">
          تحديث: {new Date().toLocaleDateString("ar-MA")}
        </Badge>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-b border-border/50">
              <TableHead className="w-12"></TableHead>
              <SortHeader column="symbol">الرمز</SortHeader>
              <TableHead>الشركة</TableHead>
              <TableHead>القطاع</TableHead>
              <SortHeader column="price">السعر</SortHeader>
              <SortHeader column="change">التغير</SortHeader>
              <SortHeader column="per">PER</SortHeader>
              <SortHeader column="pb">P/B</SortHeader>
              <SortHeader column="dividendYield">العائد</SortHeader>
              <SortHeader column="roe">ROE</SortHeader>
              <SortHeader column="liquidityScore">السيولة</SortHeader>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stocks.map((stock, index) => (
              <motion.tr
                key={stock.symbol}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                className="hover:bg-card/50 transition-colors border-b border-border/30"
              >
                <TableCell>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Star className="w-4 h-4 text-muted-foreground hover:text-warning" />
                  </Button>
                </TableCell>
                <TableCell className="font-mono font-semibold text-primary">
                  {stock.symbol}
                </TableCell>
                <TableCell className="font-medium">{stock.name}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="text-xs">
                    {sectorLabels[stock.sector] || stock.sector}
                  </Badge>
                </TableCell>
                <TableCell className="font-mono">
                  {stock.price.toFixed(2)} MAD
                </TableCell>
                <TableCell>
                  <div className={`flex items-center gap-1.5 ${stock.change >= 0 ? "text-profit" : "text-loss"}`}>
                    <TriangleIndicator 
                      direction={stock.change > 0 ? "up" : stock.change < 0 ? "down" : "neutral"} 
                      size="sm" 
                    />
                    <span className="font-mono">
                      {stock.change >= 0 ? "+" : ""}{stock.change.toFixed(2)}%
                    </span>
                  </div>
                </TableCell>
                <TableCell className="font-mono">{stock.per.toFixed(1)}</TableCell>
                <TableCell className="font-mono">{stock.pb.toFixed(2)}</TableCell>
                <TableCell className="font-mono text-profit">
                  {stock.dividendYield.toFixed(1)}%
                </TableCell>
                <TableCell className="font-mono">{stock.roe.toFixed(1)}%</TableCell>
                <TableCell>
                  <Badge className={liquidityColors[stock.liquidityScore]}>
                    {liquidityLabels[stock.liquidityScore]}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Link to={`/stock/${stock.symbol}`}>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </Link>
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </div>

      {stocks.length === 0 && (
        <div className="p-12 text-center">
          <p className="text-muted-foreground">لا توجد أسهم مطابقة للمعايير المحددة</p>
          <p className="text-sm text-muted-foreground/70 mt-1">
            جرّب تخفيف بعض الفلاتر
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default ScreenerResults;
