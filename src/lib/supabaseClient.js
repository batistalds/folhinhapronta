import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase env vars em falta. Define VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no ficheiro .env.'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
