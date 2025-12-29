import { env_public } from '@library/library-bottom/env-objects/public'
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
	String(env_public.PUBLIC_SUPABASE_URL),
	String(env_public.PUBLIC_SUPABASE_PUBLISHABLE_KEY),
)

// console.log(`init: ${new Date().toISOString()}`)

// const { data, error } = await supabase
// .from('markdowns')
// // .upsert([
// // 	{
// // 		body: 'test body 3',
// // 		frontmatter: {
// // 			tags: ['test tag 3'],
// // 			title: 'test title 3'
// // 		},
// // 		key: 'test/key4',
// // 		locale: 'en',
// // 		project: '@app/blog',
// // 		updated_at: new Date().toISOString()
// // 	}
// // ], { ignoreDuplicates: false, onConflict: 'project,key,locale' })
// .select()

// console.log(`end: ${new Date().toISOString()}`)

// console.log('💬 ~ data:', data)
// console.log('💬 ~ error:', error)
