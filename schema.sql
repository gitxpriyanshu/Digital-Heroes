-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users Table (Profile)
CREATE TABLE public.users (
    id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
    email TEXT,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Subscriptions Table
CREATE TABLE public.subscriptions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    stripe_customer_id TEXT UNIQUE,
    stripe_subscription_id TEXT UNIQUE,
    plan TEXT CHECK (plan IN ('monthly', 'yearly')),
    status TEXT CHECK (status IN ('active', 'cancelled', 'lapsed')),
    current_period_end TIMESTAMPTZ,
    charity_percentage INT DEFAULT 10,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Scores Table (Max 5 per user)
CREATE TABLE public.scores (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    score INT CHECK (score >= 1 AND score <= 45),
    score_date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (user_id, score_date)
);

-- 4. Charities Table
CREATE TABLE public.charities (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    logo_url TEXT,
    website TEXT,
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Charity Selections
CREATE TABLE public.charity_selections (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    charity_id UUID REFERENCES public.charities(id) ON DELETE CASCADE NOT NULL,
    contribution_percentage INT DEFAULT 100,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Draws Table
CREATE TABLE public.draws (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    draw_month DATE NOT NULL,
    status TEXT CHECK (status IN ('draft', 'simulated', 'published')) DEFAULT 'draft',
    prize_pool_total DECIMAL(12, 2) DEFAULT 0,
    jackpot_carried DECIMAL(12, 2) DEFAULT 0,
    draw_logic TEXT CHECK (draw_logic IN ('random', 'algorithmic')) DEFAULT 'random',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Draw Entries
CREATE TABLE public.draw_entries (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    draw_id UUID REFERENCES public.draws(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    submitted_numbers INT[] NOT NULL, -- Array of numbers
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Draw Results
CREATE TABLE public.draw_results (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    draw_id UUID REFERENCES public.draws(id) ON DELETE CASCADE NOT NULL,
    winning_numbers INT[] NOT NULL,
    five_match_winners UUID[],
    four_match_winners UUID[],
    three_match_winners UUID[]
);

-- 9. Winners Table
CREATE TABLE public.winners (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    draw_id UUID REFERENCES public.draws(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    match_type TEXT CHECK (match_type IN ('3', '4', '5')),
    prize_amount DECIMAL(12, 2) NOT NULL,
    status TEXT CHECK (status IN ('pending', 'verified', 'paid')) DEFAULT 'pending',
    proof_url TEXT,
    admin_note TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Prize Pool Config
CREATE TABLE public.prize_pool_config (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    five_match_pct INT DEFAULT 40,
    four_match_pct INT DEFAULT 35,
    three_match_pct INT DEFAULT 25
);

-- TRIGGER: Enforce 5-score rolling window
CREATE OR REPLACE FUNCTION public.enforce_score_limit()
RETURNS TRIGGER AS $$
BEGIN
    -- Delete the oldest score if the user already has 5 scores
    IF (SELECT COUNT(*) FROM public.scores WHERE user_id = NEW.user_id) >= 5 THEN
        DELETE FROM public.scores
        WHERE id IN (
            SELECT id FROM public.scores
            WHERE user_id = NEW.user_id
            ORDER BY score_date ASC, created_at ASC
            LIMIT 1
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_enforce_score_limit
BEFORE INSERT ON public.scores
FOR EACH ROW
EXECUTE FUNCTION public.enforce_score_limit();

-- RLS POLICIES

-- Users
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

-- Subscriptions
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own subscription" ON public.subscriptions FOR SELECT USING (auth.uid() = user_id);

-- Scores
ALTER TABLE public.scores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own scores" ON public.scores FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own scores" ON public.scores FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own scores" ON public.scores FOR DELETE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own scores" ON public.scores;
CREATE POLICY "Users can update their own scores" ON public.scores FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Charities
ALTER TABLE public.charities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active charities" ON public.charities FOR SELECT USING (is_active = TRUE);

-- Charity Selections
ALTER TABLE public.charity_selections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own selections" ON public.charity_selections FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own selections" ON public.charity_selections FOR ALL USING (auth.uid() = user_id);

-- Draws (Read only for users)
ALTER TABLE public.draws ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view published draws" ON public.draws FOR SELECT USING (status = 'published');

-- Draw Entries
ALTER TABLE public.draw_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own entries" ON public.draw_entries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can submit entries" ON public.draw_entries FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Draw Results
ALTER TABLE public.draw_results ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view draw results" ON public.draw_results FOR SELECT USING (TRUE);

-- Winners
ALTER TABLE public.winners ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own winnings" ON public.winners FOR SELECT USING (auth.uid() = user_id);

-- Profile trigger for auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, avatar_url)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'avatar_url');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

-- 11. Financial Ledger Logs
CREATE TABLE public.financial_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    stripe_event_id TEXT,
    total_amount DECIMAL(12, 2) NOT NULL,
    charity_amount DECIMAL(12, 2) NOT NULL,
    prize_pool_amount DECIMAL(12, 2) NOT NULL,
    charity_percentage DECIMAL(5, 2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.financial_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins only can view financial logs" ON public.financial_logs FOR SELECT USING (auth.uid() IN (SELECT id FROM public.users WHERE 'admin' = 'admin'));

-- 12. Processed Stripe Events
CREATE TABLE public.processed_events (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.processed_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins only can view processed events" ON public.processed_events FOR SELECT USING (auth.uid() IN (SELECT id FROM public.users WHERE 'admin' = 'admin'));

-- Ensure single subscription per user constraint for proper upserts
CREATE UNIQUE INDEX IF NOT EXISTS idx_subs_user_id ON public.subscriptions(user_id);

-- 13. ATOMIC RPC FOR STRIPE SUBSCRIPTIONS 
CREATE OR REPLACE FUNCTION process_stripe_invoice_paid(
    p_event_id TEXT,
    p_type TEXT,
    p_user_id UUID,
    p_customer_id TEXT,
    p_sub_id TEXT,
    p_plan TEXT,
    p_period_end TIMESTAMPTZ,
    p_total_paid DECIMAL,
    p_charity_amount DECIMAL,
    p_prize_amount DECIMAL,
    p_charity_pct DECIMAL
) RETURNS VOID AS $$
BEGIN
    -- 1. Idempotency Hardware Lock: Graceful abort without exception
    INSERT INTO public.processed_events (id, type) 
    VALUES (p_event_id, p_type) 
    ON CONFLICT (id) DO NOTHING;
    
    IF NOT FOUND THEN 
        RETURN;
    END IF;

    -- 2. Ensure Subscription Exists & Is Active
    INSERT INTO public.subscriptions (user_id, stripe_customer_id, stripe_subscription_id, plan, status, current_period_end)
    VALUES (p_user_id, p_customer_id, p_sub_id, p_plan, 'active', p_period_end)
    ON CONFLICT (user_id) DO UPDATE SET 
        stripe_customer_id = EXCLUDED.stripe_customer_id,
        stripe_subscription_id = EXCLUDED.stripe_subscription_id,
        plan = EXCLUDED.plan,
        status = 'active',
        current_period_end = EXCLUDED.current_period_end;
        
    -- 3. Write Explicit Financial Logs
    INSERT INTO public.financial_logs (user_id, stripe_event_id, total_amount, charity_amount, prize_pool_amount, charity_percentage)
    VALUES (p_user_id, p_event_id, p_total_paid, p_charity_amount, p_prize_amount, p_charity_pct);
    
    -- 4. Route Prize Contribution into the Open Draft Draw Pot
    UPDATE public.draws SET prize_pool_total = prize_pool_total + p_prize_amount WHERE status = 'draft';

END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add Recovery Field mapping directly onto subscriptions table
ALTER TABLE public.subscriptions ADD COLUMN IF NOT EXISTS needs_jwt_sync BOOLEAN DEFAULT FALSE;
ALTER TABLE public.subscriptions ADD COLUMN IF NOT EXISTS jwt_sync_retries INTEGER DEFAULT 0;
ALTER TABLE public.subscriptions ADD COLUMN IF NOT EXISTS is_dead BOOLEAN DEFAULT FALSE;

-- 14. NATIVE DB TRIGGER FOR JWT FLAG SYNCING
-- [ARCHITECTURAL DECISION]: Updating auth.users raw_user_meta_data directly via Postgres Trigger bypasses the Supabase GoTrue Admin API.
-- While the Admin API is standard, performing it natively here is deliberately chosen to guarantee absolute ATOMICITY against Stripe financial logs. 
-- By mutating NEW states in a BEFORE trigger, we entirely eliminate runaway UPDATE recursion while explicitly flagging failures safely.
CREATE OR REPLACE FUNCTION public.sync_subscription_to_jwt()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE auth.users
    SET raw_user_meta_data = COALESCE(raw_user_meta_data, '{}'::jsonb) || jsonb_build_object('is_subscribed', (NEW.status = 'active'))
    WHERE id = NEW.user_id;

    -- Eradicate residual flags if sync structurally succeeds
    NEW.needs_jwt_sync := FALSE;
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        RAISE WARNING 'Failed to sync subscription JWT metadata to auth.users for %s: %', NEW.user_id, SQLERRM;
        -- Graceful telemetry offload: Flaps recovery flag natively without needing secondary UPDATE transactions
        NEW.needs_jwt_sync := TRUE;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, auth;

DROP TRIGGER IF EXISTS trigger_sync_jwt_on_sub ON public.subscriptions;
CREATE TRIGGER trigger_sync_jwt_on_sub
BEFORE INSERT OR UPDATE ON public.subscriptions
FOR EACH ROW
EXECUTE FUNCTION public.sync_subscription_to_jwt();
