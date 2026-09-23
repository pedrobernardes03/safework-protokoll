import { createClient } from "@supabase/supabase-js";

// Client-side Supabase client — uses the anon/publishable key, which is safe to ship
// to the browser as long as Row Level Security policies are set on every table it
// touches. Never import the service_role key here; that one only belongs in
// server-only code (a TanStack Start server function), never in a component.
export const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);
