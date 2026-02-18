import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://leczfqlkgsqpwkyyliul.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_Gj7v0zDO5O4tTg9RbXyk2g_48z0mFOa'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
