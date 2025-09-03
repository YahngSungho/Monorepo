import { createClient } from '@supabase/supabase-js'

// eslint-disable-next-line sonarjs/different-types-comparison
const isBrowser = globalThis.window !== undefined && document !== undefined
if (isBrowser) {
	throw new Error('비밀 노출')
}

export const supabase_admin = createClient(
	String(process.env.SUPABASE_URL),
	String(process.env.SUPABASE_ADMIN_KEY),
)
