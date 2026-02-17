-- Managed Encryption: Database Schema Update
-- Adds support for custodial/managed keys alongside sovereign (wrapped) keys

-- ============================================================================
-- 1. Add managed_key column to user_profiles
-- ============================================================================

ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS managed_key TEXT; -- Encrypted DEK (protected by RLS)

-- ============================================================================
-- 2. Update persistence_mode check constraint
-- ============================================================================

-- Drop old constraint
ALTER TABLE public.user_profiles 
DROP CONSTRAINT IF EXISTS user_profiles_persistence_mode_check;

-- Add new constraint supporting 'managed' and 'sovereign'
ALTER TABLE public.user_profiles 
ADD CONSTRAINT user_profiles_persistence_mode_check 
CHECK (persistence_mode IN ('local', 'cloud', 'managed', 'sovereign'));

-- ============================================================================
-- 3. Update RLS policies (No change needed, existing policies cover new column)
-- ============================================================================
-- The existing policies allow users to SELECT/INSERT/UPDATE their own rows, 
-- which naturally extends to the new managed_key column.
