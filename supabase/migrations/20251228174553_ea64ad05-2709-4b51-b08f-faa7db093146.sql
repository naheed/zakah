-- Fix: Remove public access to referrals table and restrict to referrers only
-- This addresses the PUBLIC_DATA_EXPOSURE security issue

-- Drop the overly permissive public read policy
DROP POLICY IF EXISTS "Anyone can read referrals" ON public.referrals;

-- Create a policy that only allows referrers to view their own referrals
-- Note: For anonymous users, we cannot easily verify session hash via RLS
-- So we restrict to authenticated referrer_user_id only
CREATE POLICY "Referrers can view their own referrals"
ON public.referrals
FOR SELECT
USING (auth.uid() = referrer_user_id);