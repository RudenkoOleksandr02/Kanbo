import type { User } from '@supabase/supabase-js'

export interface UserSchema {
  authData: User | null
  authReady: boolean
  error?: string
}
