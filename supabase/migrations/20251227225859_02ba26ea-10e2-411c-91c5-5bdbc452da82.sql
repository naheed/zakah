-- Add version column for optimistic locking to prevent race conditions
ALTER TABLE public.zakat_calculations 
ADD COLUMN IF NOT EXISTS version integer NOT NULL DEFAULT 1;

-- Create function for atomic updates with version checking
CREATE OR REPLACE FUNCTION public.update_calculation_with_version(
  p_id uuid,
  p_user_id uuid,
  p_form_data jsonb,
  p_name text,
  p_zakat_due numeric,
  p_is_above_nisab boolean,
  p_expected_version integer
)
RETURNS TABLE(success boolean, new_version integer, current_data jsonb) AS $$
DECLARE
  v_current_version integer;
  v_result_version integer;
BEGIN
  -- Get current version with row lock
  SELECT version INTO v_current_version
  FROM public.zakat_calculations
  WHERE id = p_id
  FOR UPDATE;
  
  -- Check if record exists
  IF v_current_version IS NULL THEN
    RETURN QUERY SELECT false, 0, NULL::jsonb;
    RETURN;
  END IF;
  
  -- Check version match
  IF v_current_version != p_expected_version THEN
    -- Return current data for conflict resolution
    RETURN QUERY 
    SELECT false, v_current_version, form_data 
    FROM public.zakat_calculations 
    WHERE id = p_id;
    RETURN;
  END IF;
  
  -- Perform update with version increment
  UPDATE public.zakat_calculations
  SET 
    form_data = p_form_data,
    name = p_name,
    zakat_due = p_zakat_due,
    is_above_nisab = p_is_above_nisab,
    version = v_current_version + 1,
    updated_at = now()
  WHERE id = p_id AND user_id = p_user_id;
  
  v_result_version := v_current_version + 1;
  
  RETURN QUERY SELECT true, v_result_version, p_form_data;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.update_calculation_with_version TO authenticated;