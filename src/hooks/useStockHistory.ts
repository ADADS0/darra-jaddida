import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface HistoricalDataPoint {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface HistoryResponse {
  symbol: string;
  data: HistoricalDataPoint[];
  lastUpdate: string;
}

export const useStockHistory = (symbol: string, days: number = 365) => {
  return useQuery<HistoryResponse>({
    queryKey: ["stockHistory", symbol, days],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke("moroccan-stocks", {
        method: "GET",
        body: null,
      });
      
      // Use query params through URL
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/moroccan-stocks?action=history&symbol=${symbol}&days=${days}`,
        {
          headers: {
            "apikey": import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
        }
      );
      
      if (!response.ok) {
        throw new Error("Failed to fetch historical data");
      }
      
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!symbol,
  });
};
