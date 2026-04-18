import { createClient } from '@supabase/supabase-js';
import { createBrowserClient } from '@supabase/auth-helpers-nextjs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Standard client for general use
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Client component helper
export const createClientClient = () => createBrowserClient(supabaseUrl, supabaseAnonKey);
