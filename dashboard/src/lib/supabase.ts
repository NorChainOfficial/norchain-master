import { createClient as supabaseCreateClient, SupabaseClient } from '@supabase/supabase-js'

// Lazy-loaded client for browser/public access
let _supabase: SupabaseClient | null = null

export function getSupabase(): SupabaseClient {
  if (!_supabase) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!url || !key) {
      throw new Error('Supabase configuration missing')
    }
    _supabase = supabaseCreateClient(url, key)
  }
  return _supabase
}

// Legacy export for compatibility
export const supabase = typeof window !== 'undefined' 
  ? getSupabase() 
  : (null as unknown as SupabaseClient)

// Client-side create function (alias for getSupabase)
export const createClient = getSupabase

// Server client with service role for API routes
export function createServerClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!url || !key) {
    throw new Error('Supabase server configuration missing. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
  }
  
  return supabaseCreateClient(url, key)
}

// Helper to check if Supabase is configured
export function isSupabaseConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY)
  )
}
