import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export interface Portfolio {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface PortfolioHolding {
  id: string;
  portfolio_id: string;
  stock_symbol: string;
  quantity: number;
  average_price: number;
  purchase_date: string | null;
  notes: string | null;
  created_at: string;
}

export const usePortfolio = () => {
  const { user } = useAuth();
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [holdings, setHoldings] = useState<PortfolioHolding[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activePortfolio, setActivePortfolio] = useState<Portfolio | null>(null);

  const fetchPortfolios = useCallback(async () => {
    if (!user) {
      setPortfolios([]);
      setHoldings([]);
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("portfolios")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });

      if (error) throw error;
      
      setPortfolios(data || []);
      if (data && data.length > 0 && !activePortfolio) {
        setActivePortfolio(data[0]);
      }
    } catch (error) {
      console.error("Error fetching portfolios:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user, activePortfolio]);

  const fetchHoldings = useCallback(async (portfolioId: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("portfolio_holdings")
        .select("*")
        .eq("portfolio_id", portfolioId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setHoldings(data || []);
    } catch (error) {
      console.error("Error fetching holdings:", error);
    }
  }, [user]);

  useEffect(() => {
    fetchPortfolios();
  }, [fetchPortfolios]);

  useEffect(() => {
    if (activePortfolio) {
      fetchHoldings(activePortfolio.id);
    }
  }, [activePortfolio, fetchHoldings]);

  const addHolding = async (
    portfolioId: string,
    symbol: string,
    quantity: number,
    averagePrice: number,
    purchaseDate?: string,
    notes?: string
  ) => {
    if (!user) {
      toast.error("يجب تسجيل الدخول أولاً");
      return false;
    }

    try {
      const { error } = await supabase
        .from("portfolio_holdings")
        .upsert({
          portfolio_id: portfolioId,
          stock_symbol: symbol,
          quantity,
          average_price: averagePrice,
          purchase_date: purchaseDate || null,
          notes: notes || null,
        }, {
          onConflict: "portfolio_id,stock_symbol"
        });

      if (error) throw error;

      await fetchHoldings(portfolioId);
      toast.success("تمت إضافة السهم للمحفظة");
      return true;
    } catch (error) {
      console.error("Error adding holding:", error);
      toast.error("فشل إضافة السهم للمحفظة");
      return false;
    }
  };

  const removeHolding = async (holdingId: string) => {
    if (!user || !activePortfolio) return false;

    try {
      const { error } = await supabase
        .from("portfolio_holdings")
        .delete()
        .eq("id", holdingId);

      if (error) throw error;

      setHoldings((prev) => prev.filter((h) => h.id !== holdingId));
      toast.success("تمت إزالة السهم من المحفظة");
      return true;
    } catch (error) {
      console.error("Error removing holding:", error);
      toast.error("فشل إزالة السهم");
      return false;
    }
  };

  const createPortfolio = async (name: string, description?: string) => {
    if (!user) {
      toast.error("يجب تسجيل الدخول أولاً");
      return null;
    }

    try {
      const { data, error } = await supabase
        .from("portfolios")
        .insert({
          user_id: user.id,
          name,
          description: description || null,
        })
        .select()
        .single();

      if (error) throw error;

      setPortfolios((prev) => [...prev, data]);
      toast.success("تم إنشاء المحفظة بنجاح");
      return data;
    } catch (error) {
      console.error("Error creating portfolio:", error);
      toast.error("فشل إنشاء المحفظة");
      return null;
    }
  };

  return {
    portfolios,
    holdings,
    activePortfolio,
    isLoading,
    setActivePortfolio,
    addHolding,
    removeHolding,
    createPortfolio,
    refetch: fetchPortfolios,
  };
};
