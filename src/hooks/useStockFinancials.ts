import { useQuery } from "@tanstack/react-query";

export interface StockFinancialsData {
  symbol: string;
  incomeStatement: { label: string; values: number[]; isHighlighted?: boolean; tooltip?: string }[];
  balanceSheet: { year: string; assets: number; liabilities: number; equity: number; currentAssets: number; currentLiabilities: number; longTermDebt: number }[];
  cashFlow: { label: string; value: number; isTotal?: boolean }[];
  yearlyData: { year: string; revenue: number; netIncome: number; margin: number; growth: number }[];
  revenueBreakdown: { name: string; value: number; color: string; subItems?: { name: string; value: number; color?: string }[] }[];
  shareholders: { rank: number; label: string; value: number; change: number }[];
  gauges: { health: number; risk: number; growth: number; debtCoverage: number; dividendPayout: number; cashConversion: number };
  monthlyData: { month: string; performance: number; target: number; change: number }[];
  peerComparison: { name: string; x: number; y: number; size: number }[];
  lastUpdate: string;
}

export const useStockFinancials = (symbol: string) => {
  return useQuery<StockFinancialsData>({
    queryKey: ["stock-financials", symbol],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/moroccan-stocks?action=financials&symbol=${symbol}`,
        {
          headers: {
            "apikey": import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch financial data");
      return response.json();
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!symbol,
  });
};
