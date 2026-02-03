-- Create portfolios table for user investment portfolios
CREATE TABLE public.portfolios (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT 'المحفظة الرئيسية',
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create portfolio_holdings table for stocks in portfolios
CREATE TABLE public.portfolio_holdings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  portfolio_id UUID NOT NULL REFERENCES public.portfolios(id) ON DELETE CASCADE,
  stock_symbol TEXT NOT NULL,
  quantity NUMERIC NOT NULL DEFAULT 0,
  average_price NUMERIC NOT NULL DEFAULT 0,
  purchase_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(portfolio_id, stock_symbol)
);

-- Create watchlists table for favorite stocks
CREATE TABLE public.watchlists (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stock_symbol TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, stock_symbol)
);

-- Create stock comparisons table for saved comparisons
CREATE TABLE public.stock_comparisons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  symbols TEXT[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_holdings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watchlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_comparisons ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for portfolios
CREATE POLICY "Users can view their own portfolios" 
ON public.portfolios 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own portfolios" 
ON public.portfolios 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own portfolios" 
ON public.portfolios 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own portfolios" 
ON public.portfolios 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for portfolio_holdings
CREATE POLICY "Users can view holdings in their portfolios" 
ON public.portfolio_holdings 
FOR SELECT 
USING (portfolio_id IN (SELECT id FROM public.portfolios WHERE user_id = auth.uid()));

CREATE POLICY "Users can add holdings to their portfolios" 
ON public.portfolio_holdings 
FOR INSERT 
WITH CHECK (portfolio_id IN (SELECT id FROM public.portfolios WHERE user_id = auth.uid()));

CREATE POLICY "Users can update holdings in their portfolios" 
ON public.portfolio_holdings 
FOR UPDATE 
USING (portfolio_id IN (SELECT id FROM public.portfolios WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete holdings from their portfolios" 
ON public.portfolio_holdings 
FOR DELETE 
USING (portfolio_id IN (SELECT id FROM public.portfolios WHERE user_id = auth.uid()));

-- Create RLS policies for watchlists
CREATE POLICY "Users can view their own watchlists" 
ON public.watchlists 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own watchlist items" 
ON public.watchlists 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own watchlist items" 
ON public.watchlists 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for stock_comparisons
CREATE POLICY "Users can view their own comparisons" 
ON public.stock_comparisons 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own comparisons" 
ON public.stock_comparisons 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comparisons" 
ON public.stock_comparisons 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to auto-create portfolio on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user_portfolio()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.portfolios (user_id, name, description)
  VALUES (NEW.id, 'المحفظة الرئيسية', 'المحفظة الافتراضية للمستخدم');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger to auto-create portfolio when user signs up
CREATE TRIGGER on_auth_user_created_portfolio
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_portfolio();

-- Create update timestamp trigger
CREATE TRIGGER update_portfolios_updated_at
  BEFORE UPDATE ON public.portfolios
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_portfolio_holdings_updated_at
  BEFORE UPDATE ON public.portfolio_holdings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();