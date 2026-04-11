-- DS-160 Helper Database Schema
-- Run this in your Supabase SQL Editor

-- 1. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'premium', 'enterprise')),
  sync_count INTEGER DEFAULT 0,
  sync_limit INTEGER DEFAULT 3,
  sync_reset_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '1 month',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create ds160_drafts table
CREATE TABLE IF NOT EXISTS public.ds160_drafts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT DEFAULT 'DS-160 Draft',
  form_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  current_step INTEGER DEFAULT 1 CHECK (current_step BETWEEN 1 AND 12),
  completion_percentage INTEGER DEFAULT 0 CHECK (completion_percentage BETWEEN 0 AND 100),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_synced_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb
);

-- 4. Create sync_history table (audit log)
CREATE TABLE IF NOT EXISTS public.sync_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  draft_id UUID REFERENCES public.ds160_drafts(id) ON DELETE SET NULL,
  action TEXT NOT NULL CHECK (action IN ('create', 'update', 'delete', 'sync')),
  changes JSONB,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_drafts_user_id ON public.ds160_drafts(user_id);
CREATE INDEX IF NOT EXISTS idx_drafts_status ON public.ds160_drafts(status);
CREATE INDEX IF NOT EXISTS idx_drafts_updated_at ON public.ds160_drafts(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_sync_history_user_id ON public.sync_history(user_id);
CREATE INDEX IF NOT EXISTS idx_sync_history_timestamp ON public.sync_history(timestamp DESC);

-- 6. Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ds160_drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sync_history ENABLE ROW LEVEL SECURITY;

-- 7. Create RLS Policies for profiles
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 8. Create RLS Policies for ds160_drafts
CREATE POLICY "Users can view own drafts"
  ON public.ds160_drafts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own drafts"
  ON public.ds160_drafts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own drafts"
  ON public.ds160_drafts FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own drafts"
  ON public.ds160_drafts FOR DELETE
  USING (auth.uid() = user_id);

-- 9. Create RLS Policies for sync_history
CREATE POLICY "Users can view own sync history"
  ON public.sync_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sync history"
  ON public.sync_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 10. Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 11. Create triggers for auto-updating updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_drafts_updated_at
  BEFORE UPDATE ON public.ds160_drafts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- 12. Create function to auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 13. Create trigger to auto-create profile
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 14. Create function to check and reset sync quota
CREATE OR REPLACE FUNCTION public.check_sync_quota(p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_profile RECORD;
BEGIN
  SELECT * INTO v_profile FROM public.profiles WHERE id = p_user_id;
  
  -- Reset quota if month has passed
  IF v_profile.sync_reset_at <= NOW() THEN
    UPDATE public.profiles
    SET sync_count = 0,
        sync_reset_at = NOW() + INTERVAL '1 month'
    WHERE id = p_user_id;
    RETURN TRUE;
  END IF;
  
  -- Check if under quota
  RETURN v_profile.sync_count < v_profile.sync_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 15. Create function to increment sync count
CREATE OR REPLACE FUNCTION public.increment_sync_count(p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_can_sync BOOLEAN;
BEGIN
  -- Check quota first
  v_can_sync := public.check_sync_quota(p_user_id);
  
  IF NOT v_can_sync THEN
    RAISE EXCEPTION 'Sync quota exceeded';
  END IF;
  
  -- Increment count
  UPDATE public.profiles
  SET sync_count = sync_count + 1
  WHERE id = p_user_id;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 16. Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.profiles TO authenticated;
GRANT ALL ON public.ds160_drafts TO authenticated;
GRANT ALL ON public.sync_history TO authenticated;
GRANT EXECUTE ON FUNCTION public.check_sync_quota TO authenticated;
GRANT EXECUTE ON FUNCTION public.increment_sync_count TO authenticated;

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'DS-160 Helper database schema created successfully!';
END $$;
