import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Link } from "react-router-dom";

interface FundAllocationProps {
  fund: {
    allocation: {
      sectors: { name: string; nameEn: string; weight: number }[];
      topHoldings: { symbol: string; name: string; weight: number }[];
    };
  };
}

const COLORS = [
  "hsl(var(--primary))",
  "hsl(199 89% 48%)",
  "hsl(280 65% 60%)",
  "hsl(38 92% 50%)",
  "hsl(0 72% 51%)",
  "hsl(160 60% 45%)",
  "hsl(215 20% 55%)",
];

const FundAllocation = ({ fund }: FundAllocationProps) => {
  const sectorData = fund.allocation.sectors.map((sector, index) => ({
    ...sector,
    fill: COLORS[index % COLORS.length],
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Sector Allocation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-2xl border border-border p-6"
      >
        <h3 className="text-lg font-semibold text-foreground mb-6">توزيع القطاعات</h3>
        
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={sectorData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="weight"
                nameKey="name"
              >
                {sectorData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  color: "hsl(var(--foreground))",
                }}
                formatter={(value: number) => [`${value}%`, "الوزن"]}
              />
              <Legend
                formatter={(value) => <span className="text-foreground text-xs">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Sector List */}
        <div className="mt-4 space-y-2">
          {sectorData.map((sector, index) => (
            <div key={sector.name} className="flex items-center justify-between p-2 bg-secondary/30 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: sector.fill }} />
                <span className="text-sm text-foreground">{sector.name}</span>
              </div>
              <span className="text-sm font-semibold text-foreground">{sector.weight}%</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Top Holdings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card rounded-2xl border border-border p-6"
      >
        <h3 className="text-lg font-semibold text-foreground mb-6">أكبر المواقع</h3>
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">الرمز</TableHead>
              <TableHead className="text-right">الاسم</TableHead>
              <TableHead className="text-left">الوزن</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fund.allocation.topHoldings.map((holding, index) => (
              <TableRow key={holding.symbol}>
                <TableCell className="font-medium">
                  <Link 
                    to={`/stock/${holding.symbol}`}
                    className="text-primary hover:underline"
                  >
                    {holding.symbol}
                  </Link>
                </TableCell>
                <TableCell className="text-muted-foreground">{holding.name}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-secondary rounded-full max-w-[100px]">
                      <div 
                        className="h-full bg-primary rounded-full" 
                        style={{ width: `${holding.weight * 4}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold">{holding.weight}%</span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Other Holdings */}
        <div className="mt-6 p-4 bg-secondary/30 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">مواقع أخرى</span>
            <span className="text-sm font-semibold text-foreground">
              {(100 - fund.allocation.topHoldings.reduce((sum, h) => sum + h.weight, 0)).toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Concentration Warning */}
        <div className="mt-4 p-3 bg-warning/10 border border-warning/20 rounded-lg">
          <p className="text-xs text-muted-foreground">
            <strong className="text-warning">تنويه:</strong> أكبر 5 مواقع تمثل{" "}
            {fund.allocation.topHoldings.reduce((sum, h) => sum + h.weight, 0).toFixed(1)}% من الصندوق
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default FundAllocation;
