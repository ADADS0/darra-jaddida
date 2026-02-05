import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Markets from "./pages/Markets";
import StockProfile from "./pages/StockProfile";
import StockScreener from "./pages/StockScreener";
import StockCompare from "./pages/StockCompare";
import Watchlist from "./pages/Watchlist";
import FundProfile from "./pages/FundProfile";
import FundsList from "./pages/FundsList";
import Sectors from "./pages/Sectors";
import Auth from "./pages/Auth";
import Blog from "./pages/Blog";
import NotFound from "./pages/NotFound";
import LoadingScreen from "./components/LoadingScreen";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Disclaimer from "./pages/Disclaimer";
import Profile from "./pages/Profile";
import StockFinancialsPage from "./pages/StockFinancials";

const queryClient = new QueryClient();

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading time and wait for resources
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <AnimatePresence mode="wait">
            {isLoading && <LoadingScreen key="loading" />}
          </AnimatePresence>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/markets" element={<Markets />} />
              <Route path="/stock/:symbol" element={<StockProfile />} />
              <Route path="/stock/:symbol/financials" element={<StockFinancialsPage />} />
              <Route path="/screener" element={<StockScreener />} />
              <Route path="/compare" element={<StockCompare />} />
              <Route path="/funds" element={<FundsList />} />
              <Route path="/fund/:fundId" element={<FundProfile />} />
              <Route path="/sectors" element={<Sectors />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/disclaimer" element={<Disclaimer />} />
              <Route
                path="/watchlist"
                element={
                  <ProtectedRoute>
                    <Watchlist />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
