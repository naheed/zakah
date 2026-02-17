-- Fix 1: Remove email column from profiles table (duplicates auth.users data)
ALTER TABLE public.profiles DROP COLUMN IF EXISTS email;

-- Fix 2: Add UPDATE policy for share recipients to accept invitations
-- Create a security definer function to safely check recipient email
CREATE OR REPLACE FUNCTION public.is_share_recipient(share_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.zakat_calculation_shares s
    WHERE s.id = share_id
    AND (
      s.shared_with_user_id = auth.uid()
      OR s.shared_with_email = (
        SELECT email FROM auth.users WHERE id = auth.uid() AND email_confirmed_at IS NOT NULL
      )
    )
  )
$$;

-- Add UPDATE policy for recipients
CREATE POLICY "Recipients can accept shares"
ON public.zakat_calculation_shares
FOR UPDATE
USING (public.is_share_recipient(id))
WITH CHECK (public.is_share_recipient(id));