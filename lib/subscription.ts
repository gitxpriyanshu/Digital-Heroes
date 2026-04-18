import { supabase } from './supabase-server';

export async function getSubscriptionStatus(userId: string) {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    console.error('Error fetching subscription:', error);
    return null;
  }

  return data;
}

export async function isSubscriptionActive(userId: string) {
  const subscription = await getSubscriptionStatus(userId);
  return subscription?.status === 'active';
}
