<script>
import BaseLayout from '@repo/base/baseLayout'
import '@repo/base/fontStyle.css'

const appName = 'boiler_plate'

let { children } = $props()

''; // eslint-disable-line semi, no-unused-expressions
</script>

<BaseLayout {appName}>
	{@render children()}
</BaseLayout>
