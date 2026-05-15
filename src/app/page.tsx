import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

// Root page - redirect based on auth state
// The actual dashboard is at /(main)/page.tsx
export default async function RootPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/login');
  }
  
  // This shouldn't be reached as (main) route group handles it
  redirect('/');
}
