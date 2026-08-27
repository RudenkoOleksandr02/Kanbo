import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/shared/types/database'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

if (!supabaseUrl) {
  throw new Error('VITE_SUPABASE_URL is not defined')
}

if (!supabaseKey) {
  throw new Error('VITE_SUPABASE_PUBLISHABLE_KEY is not defined')
}

export const supabaseClient = createClient<Database>(supabaseUrl, supabaseKey)
