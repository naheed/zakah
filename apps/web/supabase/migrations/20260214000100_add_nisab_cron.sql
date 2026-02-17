-- Enable pg_cron extension
create extension if not exists pg_cron;

-- Schedule the job to run every day at midnight UTC
-- Note: 'fetch-nisab-daily' is the job name
select cron.schedule(
    'fetch-nisab-daily',
    '0 0 * * *',
    $$
    select
        net.http_post(
            url:='https://project-ref.supabase.co/functions/v1/fetch-daily-nisab',
            headers:='{"Content-Type": "application/json", "Authorization": "Bearer SERVICE_ROLE_KEY"}'::jsonb,
            body:='{"mode": "daily"}'::jsonb
        ) as request_id;
    $$
);
