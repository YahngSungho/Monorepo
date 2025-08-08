import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(String(process.env.VITE_PUBLIC_SUPABASE_URL), String(process.env.VITE_PUBLIC_SUPABASE_ANON_KEY))
