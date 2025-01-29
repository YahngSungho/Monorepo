<script>
	import BaseLayout from '@repo/base/baseLayout'
	import '@repo/base/fontStyle.css'
	import { i18n } from '../i18n.ts'

	const appName = 'boiler_plate'

	let { children } = $props()

	;('') // eslint-disable-line
</script>

<BaseLayout {appName} {i18n}>
	{@render children()}
	<div id="topDivForSmokeTest"></div>
</BaseLayout>
