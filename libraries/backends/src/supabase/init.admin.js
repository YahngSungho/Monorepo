import { createClient } from '@supabase/supabase-js'

export const supabase_admin = createClient(
	String(process.env.SUPABASE_URL),
	String(process.env.SUPABASE_ADMIN_KEY),
)
