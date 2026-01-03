-- Create table for secure calculation sharing
CREATE TABLE public.zakat_calculation_shares (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  calculation_id UUID NOT NULL REFERENCES public.zakat_calculations(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL,
  shared_with_email TEXT NOT NULL,
  shared_with_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  accepted_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(calculation_id, shared_with_email)
);

-- Enable RLS
ALTER TABLE public.zakat_calculation_shares ENABLE ROW LEVEL SECURITY;

-- Policy: Owners can view shares they created
CREATE POLICY "Owners can view their shares"
ON public.zakat_calculation_shares
FOR SELECT
USING (auth.uid() = owner_id);

-- Policy: Recipients can view shares sent to their verified email
CREATE POLICY "Recipients can view shares sent to them"
ON public.zakat_calculation_shares
FOR SELECT
USING (
  auth.uid() = shared_with_user_id
  OR (
    auth.uid() IS NOT NULL 
    AND shared_with_email = (SELECT email FROM auth.users WHERE id = auth.uid() AND email_confirmed_at IS NOT NULL)
  )
);

-- Policy: Owners can create shares
CREATE POLICY "Owners can create shares"
ON public.zakat_calculation_shares
FOR INSERT
WITH CHECK (
  auth.uid() = owner_id
  AND EXISTS (
    SELECT 1 FROM public.zakat_calculations 
    WHERE id = calculation_id AND user_id = auth.uid()
  )
);

-- Policy: Owners can delete shares
CREATE POLICY "Owners can delete shares"
ON public.zakat_calculation_shares
FOR DELETE
USING (auth.uid() = owner_id);

-- Update zakat_calculations RLS to allow shared access
-- First, drop the existing SELECT policy
DROP POLICY IF EXISTS "Users can view their own calculations" ON public.zakat_calculations;

-- Create new SELECT policy that includes shared access
CREATE POLICY "Users can view own or shared calculations"
ON public.zakat_calculations
FOR SELECT
USING (
  auth.uid() = user_id
  OR EXISTS (
    SELECT 1 FROM public.zakat_calculation_shares s
    WHERE s.calculation_id = id
    AND (
      s.shared_with_user_id = auth.uid()
      OR s.shared_with_email = (SELECT email FROM auth.users WHERE id = auth.uid() AND email_confirmed_at IS NOT NULL)
    )
  )
);

-- Function to auto-link shares when a user signs up with a shared email
CREATE OR REPLACE FUNCTION public.link_pending_shares()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only proceed if email is confirmed
  IF NEW.email_confirmed_at IS NOT NULL THEN
    UPDATE public.zakat_calculation_shares
    SET 
      shared_with_user_id = NEW.id,
      accepted_at = COALESCE(accepted_at, now())
    WHERE shared_with_email = NEW.email
    AND shared_with_user_id IS NULL;
  END IF;
  RETURN NEW;
END;
$$;

-- Trigger to auto-link shares on email confirmation
CREATE TRIGGER on_user_email_confirmed
AFTER UPDATE ON auth.users
FOR EACH ROW
WHEN (OLD.email_confirmed_at IS NULL AND NEW.email_confirmed_at IS NOT NULL)
EXECUTE FUNCTION public.link_pending_shares();

-- Also trigger on insert for users who are already confirmed
CREATE TRIGGER on_user_created_confirmed
AFTER INSERT ON auth.users
FOR EACH ROW
WHEN (NEW.email_confirmed_at IS NOT NULL)
EXECUTE FUNCTION public.link_pending_shares();