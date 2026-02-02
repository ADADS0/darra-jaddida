import { useQuery } from "@tanstack/react-query";

export interface MiniHistoryPoint {
  date: string;
  close: number;
}

interface MiniHistoryResponse {
  symbol: string;
  data: MiniHistoryPoint[];
}

export const useMiniStockHistory = (symbol: string, enabled: boolean = true) => {
  return useQuery<MiniHistoryResponse>({
    queryKey: ["miniStockHistory", symbol],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/moroccan-stocks?action=history&symbol=${symbol}&days=30`,
        {
          headers: {
            "apikey": import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
        }
      );
      
      if (!response.ok) {
        throw new Error("Failed to fetch mini history");
      }
      
      const data = await response.json();
      
      // Only return the last 30 data points with date and close price
      return {
        symbol: data.symbol,
        data: data.data.slice(-30).map((d: { date: string; close: number }) => ({
          date: d.date,
          close: d.close,
        })),
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (garbage collection)
    enabled: enabled && !!symbol,
    retry: 1,
  });
};
