
-- Managed Encryption: Database Schema Update
-- Adds support for custodial/managed keys alongside sovereign (wrapped) keys

-- 1. Add managed_key column to user_profiles
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS managed_key TEXT;

-- 2. Update persistence_mode check constraint
ALTER TABLE public.user_profiles 
DROP CONSTRAINT IF EXISTS user_profiles_persistence_mode_check;

ALTER TABLE public.user_profiles 
ADD CONSTRAINT user_profiles_persistence_mode_check 
CHECK (persistence_mode IN ('local', 'cloud', 'managed', 'sovereign'));
