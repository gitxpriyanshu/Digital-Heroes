import { createClient } from '@supabase/supabase-js';
import { createServerClient as createServer } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Standard client for general use
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server component helper
export const createServerClient = () => {
  return createServer(supabaseUrl, supabaseAnonKey, { cookies: cookies() });
};

// Service role client (Server-side only)
export const getServiceRoleClient = () => {
  return createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
};
