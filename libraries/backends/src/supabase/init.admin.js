import { blockClient_action } from '@library/helpers/functions'
import { createClient } from '@supabase/supabase-js'
import { env_public } from '@library/library-bottom/env-objects/public'
import { env_private } from '@library/library-bottom/env-objects/private'

blockClient_action()

export const supabase_admin = createClient(
	String(env_public.PUBLIC_SUPABASE_URL),
	String(env_private.SUPABASE_ADMIN_KEY),
)
