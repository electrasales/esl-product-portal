import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Server-only client using the Supabase service role key. This bypasses
 * Row Level Security entirely, so it must never be imported from a
 * Client Component and the key must never be prefixed NEXT_PUBLIC_.
 */
export function createAdminClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is not set. Add it to .env.local (and your " +
        "hosting provider's environment variables) to manage users.",
    );
  }

  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceRoleKey,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}
