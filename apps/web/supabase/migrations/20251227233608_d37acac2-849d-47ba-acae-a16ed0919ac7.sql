-- Drop the buggy policy
DROP POLICY IF EXISTS "Users can view own or shared calculations" ON public.zakat_calculations;

-- Recreate with correct logic (s.calculation_id = zakat_calculations.id instead of s.id)
CREATE POLICY "Users can view own or shared calculations" 
ON public.zakat_calculations 
FOR SELECT 
USING (
  (auth.uid() = user_id) 
  OR 
  (EXISTS (
    SELECT 1
    FROM public.zakat_calculation_shares s
    WHERE s.calculation_id = zakat_calculations.id
    AND (
      s.shared_with_user_id = auth.uid()
      OR s.shared_with_email = (
        SELECT users.email::text
        FROM auth.users
        WHERE users.id = auth.uid() 
        AND users.email_confirmed_at IS NOT NULL
      )
    )
  ))
);