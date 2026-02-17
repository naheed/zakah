-- Fix Missing Deletion Policies for Compliance

-- 1. Allow users to delete their own portfolios (Cascade will handle accounts/snapshots)
create policy "Users can delete their own portfolio"
  on portfolios for delete
  using (auth.uid() = user_id);

-- 2. Allow users to delete their own profile
create policy "Users can delete their own profile"
  on profiles for delete
  using (auth.uid() = user_id);
