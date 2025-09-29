<script>
import BaseLayout from '@library/ui/layouts/root'

import { APP_NAME } from '$lib/info.js'

let { children } = $props()
</script>

<BaseLayout appName={APP_NAME}>
	{@render children()}
</BaseLayout>
