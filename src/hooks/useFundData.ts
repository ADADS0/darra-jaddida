import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Fund {
  id: string;
  name: string;
  nameEn: string;
  manager: string;
  category: string;
  categoryEn: string;
  nav: number;
  previousNav: number;
  change: number;
  changePercent: number;
  isPositive: boolean;
  aum: number;
  inceptionDate: string;
  currency: string;
  minInvestment: number;
  benchmark: string;
  returns: Record<string, number>;
  risk: {
    volatility: number;
    sharpeRatio: number;
    maxDrawdown: number;
    beta: number;
    alpha: number;
    standardDeviation: number;
    informationRatio: number;
  };
  fees: {
    managementFee: number;
    entryFee: number;
    exitFee: number;
    performanceFee: number;
    ongoingCharges: number;
  };
  lastUpdate: string;
}

export interface CategoryStats {
  category: string;
  categoryEn: string;
  fundCount: number;
  avgReturn1Y: number;
  avgManagementFee: number;
  totalAum: number;
}

interface FundDataResponse {
  funds: Fund[];
  categories: string[];
  managers: string[];
  categoryStats: CategoryStats[];
  lastUpdate: string;
  source: string;
}

export const useFundData = () => {
  return useQuery<FundDataResponse>({
    queryKey: ["moroccan-funds"],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke("moroccan-funds");
      
      if (error) {
        console.error("Error fetching fund data:", error);
        throw error;
      }
      
      return data as FundDataResponse;
    },
    refetchInterval: 300000, // Refetch every 5 minutes
    staleTime: 60000,
    retry: 3,
  });
};

export const useFundById = (fundId: string) => {
  const { data, ...rest } = useFundData();
  
  const fund = data?.funds.find(f => f.id === fundId);
  
  return {
    fund,
    allFunds: data?.funds || [],
    ...rest,
  };
};
