import { blockClient_action } from '@library/helpers/functions'
import { createClient } from '@supabase/supabase-js'

blockClient_action()

export const supabase_admin = createClient(
	String(process.env.SUPABASE_URL),
	String(process.env.SUPABASE_ADMIN_KEY),
)
