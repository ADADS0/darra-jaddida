import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export const useWatchlist = () => {
  const { user } = useAuth();
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchWatchlist = useCallback(async () => {
    if (!user) {
      setWatchlist([]);
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("watchlists")
        .select("stock_symbol")
        .eq("user_id", user.id);

      if (error) throw error;
      setWatchlist(data?.map((item) => item.stock_symbol) || []);
    } catch (error) {
      console.error("Error fetching watchlist:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchWatchlist();
  }, [fetchWatchlist]);

  const addToWatchlist = async (symbol: string) => {
    if (!user) {
      toast.error("يجب تسجيل الدخول أولاً");
      return false;
    }

    try {
      const { error } = await supabase
        .from("watchlists")
        .insert({ user_id: user.id, stock_symbol: symbol });

      if (error) {
        if (error.code === "23505") {
          toast.info("السهم موجود بالفعل في المفضلة");
        } else {
          throw error;
        }
        return false;
      }

      setWatchlist((prev) => [...prev, symbol]);
      toast.success("تمت الإضافة للمفضلة");
      return true;
    } catch (error) {
      console.error("Error adding to watchlist:", error);
      toast.error("فشل إضافة السهم للمفضلة");
      return false;
    }
  };

  const removeFromWatchlist = async (symbol: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from("watchlists")
        .delete()
        .eq("user_id", user.id)
        .eq("stock_symbol", symbol);

      if (error) throw error;

      setWatchlist((prev) => prev.filter((s) => s !== symbol));
      toast.success("تمت الإزالة من المفضلة");
      return true;
    } catch (error) {
      console.error("Error removing from watchlist:", error);
      toast.error("فشل إزالة السهم من المفضلة");
      return false;
    }
  };

  const toggleWatchlist = async (symbol: string) => {
    if (isInWatchlist(symbol)) {
      return removeFromWatchlist(symbol);
    } else {
      return addToWatchlist(symbol);
    }
  };

  const isInWatchlist = (symbol: string) => {
    return watchlist.includes(symbol);
  };

  return {
    watchlist,
    isLoading,
    addToWatchlist,
    removeFromWatchlist,
    toggleWatchlist,
    isInWatchlist,
    refetch: fetchWatchlist,
  };
};
