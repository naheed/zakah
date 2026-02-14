// scripts/backfill-nisab.ts
// Uses the Edge Function to trigger backfill

async function backfill() {
    const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
    const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;
    // In a real script we might need the service role key if RLS blocks us, 
    // but for now let's try calling the function assuming it's public or we have the key.

    if (!SUPABASE_URL || !SUPABASE_KEY) {
        console.error("Missing Env Variables");
        return;
    }

    console.log("Triggering Backfill...");
    const response = await fetch(`${SUPABASE_URL}/functions/v1/fetch-daily-nisab`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${SUPABASE_KEY}`
        },
        body: JSON.stringify({ mode: 'backfill' })
    });

    const result = await response.json();
    console.log("Result:", result);
}

backfill();
