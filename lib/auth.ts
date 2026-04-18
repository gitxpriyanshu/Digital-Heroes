import { createServerClient } from './supabase-server';
import { redirect } from 'next/navigation';

export async function getSession() {
  const supabase = createServerClient();
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

export async function getUser() {
  const session = await getSession();
  return session?.user ?? null;
}

export async function requireAuth() {
  const user = await getUser();
  if (!user) {
    redirect('/login');
  }
  return user;
}

export async function requireSubscription() {
  const user = await requireAuth();
  const supabase = createServerClient();
  
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('status')
    .eq('user_id', user.id)
    .single();

  if (!subscription || subscription.status !== 'active') {
    redirect('/subscribe');
  }
  
  return subscription;
}

export async function requireAdmin() {
  const user = await requireAuth();
  
  // Checking user metadata for role. In Supabase, you can set this in auth.users metadata
  // or have a roles table. Based on the prompt "checks user metadata for admin role"
  const isAdmin = user.app_metadata?.role === 'admin';
  
  if (!isAdmin) {
    redirect('/dashboard');
  }
  
  return user;
}
