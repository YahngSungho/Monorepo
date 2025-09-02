import { createClient } from '@supabase/supabase-js'

if (globalThis) {
	throw new Error('비밀 노출')
}

export const supabase_admin = createClient(
	String(process.env.SUPABASE_URL),
	String(process.env.SUPABASE_ADMIN_KEY),
)
