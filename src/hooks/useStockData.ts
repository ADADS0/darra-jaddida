import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Stock {
  symbol: string;
  name: string;
  nameEn: string;
  sector: string;
  sectorEn: string;
  price: number;
  change: number;
  marketCap: number;
  logo: string;
  lastUpdate: string;
}

export interface Sector {
  name: string;
  nameEn: string;
  change: number;
  stockCount: number;
}

interface StockDataResponse {
  stocks: Stock[];
  sectors: Sector[];
  lastUpdate: string;
  source: string;
}

export const useStockData = () => {
  return useQuery<StockDataResponse>({
    queryKey: ["moroccan-stocks"],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke("moroccan-stocks");
      
      if (error) {
        console.error("Error fetching stock data:", error);
        throw error;
      }
      
      return data as StockDataResponse;
    },
    refetchInterval: 60000, // Refetch every minute
    staleTime: 30000, // Consider data stale after 30 seconds
    retry: 3,
  });
};

// Get unique sectors from stocks data
export const getUniqueSectors = (stocks: Stock[]): string[] => {
  const sectors = new Set(stocks.map(s => s.sector));
  return Array.from(sectors);
};
