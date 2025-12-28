-- Create a security definer function to safely get the authenticated user's email
CREATE OR REPLACE FUNCTION public.get_authenticated_email()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT email::text FROM auth.users WHERE id = auth.uid() AND email_confirmed_at IS NOT NULL
$$;

-- Drop and recreate the problematic SELECT policy on zakat_calculations
DROP POLICY IF EXISTS "Users can view own or shared calculations" ON public.zakat_calculations;

CREATE POLICY "Users can view own or shared calculations" 
ON public.zakat_calculations 
FOR SELECT 
USING (
  (auth.uid() = user_id) 
  OR (EXISTS ( 
    SELECT 1 FROM zakat_calculation_shares s
    WHERE s.calculation_id = zakat_calculations.id 
    AND (
      s.shared_with_user_id = auth.uid() 
      OR s.shared_with_email = public.get_authenticated_email()
    )
  ))
);

-- Fix the SELECT policy on zakat_calculation_shares for recipients  
DROP POLICY IF EXISTS "Recipients can view shares sent to them" ON public.zakat_calculation_shares;

CREATE POLICY "Recipients can view shares sent to them" 
ON public.zakat_calculation_shares 
FOR SELECT 
USING (
  (auth.uid() = shared_with_user_id) 
  OR (
    (auth.uid() IS NOT NULL) 
    AND (shared_with_email = public.get_authenticated_email())
  )
);

-- Update the is_share_recipient function to use the new helper
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
      OR s.shared_with_email = public.get_authenticated_email()
    )
  )
$$;