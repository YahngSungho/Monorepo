<script>
import '@library/base/fontStyle.css'

import BaseLayout from '@library/base/baseLayout'

import { APP_NAME } from './base'

let { children } = $props()

;('') // eslint-disable-line
</script>

<svelte:head>
	<title>{APP_NAME}</title>
</svelte:head>

<BaseLayout appName={APP_NAME}>
	{@render children()}
	<div id="Top2_Layout_Check"></div>
</BaseLayout>
