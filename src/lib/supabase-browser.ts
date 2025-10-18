import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false,
      },
      // Suppress console errors for missing refresh tokens (guest users)
      global: {
        headers: {
          'x-client-info': 'supabase-ssr-web'
        }
      }
    }
  )
}
