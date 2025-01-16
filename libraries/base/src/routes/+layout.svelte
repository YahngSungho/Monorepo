<script>
import { ParaglideJS } from '@inlang/paraglide-sveltekit'
import { i18n } from '../lib/i18n.ts'
import '../base.js'
import '../base.css'

let { children } = $props()

''; // eslint-disable-line sonarjs/no-unused-expressions, semi
</script>

<ParaglideJS {i18n}>
	{@render children()}
</ParaglideJS>
