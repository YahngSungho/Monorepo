<script>
import BaseLayout from '@repo/base/baseLayout'

const appName = 'boiler_plate'

let { children } = $props()

''; // eslint-disable-line semi, no-unused-expressions
</script>

<BaseLayout {appName}>
	{@render children()}
</BaseLayout>
