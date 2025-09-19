import { blockClient_action } from '@library/helpers/functions'
import { env_private } from '@library/library-bottom/env-objects/private'
import { env_public } from '@library/library-bottom/env-objects/public'
import { createClient } from '@supabase/supabase-js'

blockClient_action()

export const supabase_admin = createClient(
	String(env_public.PUBLIC_SUPABASE_URL),
	String(env_private.SUPABASE_ADMIN_KEY),
)
