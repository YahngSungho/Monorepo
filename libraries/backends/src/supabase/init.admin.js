import { createClient } from '@supabase/supabase-js'

import { blockClient_action } from '@library/helpers/functions'

blockClient_action()

export const supabase_admin = createClient(
	String(process.env.SUPABASE_URL),
	String(process.env.SUPABASE_ADMIN_KEY),
)
