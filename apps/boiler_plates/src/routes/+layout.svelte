<script>
import '@library/base/fontStyle.css'

import BaseLayout from '@library/base/baseLayout'

import { i18n } from '../i18n'
import { APP_NAME } from './base'

let { children } = $props()

;('') // eslint-disable-line
</script>

<svelte:head>
	<title>{APP_NAME}</title>
</svelte:head>

<BaseLayout appName={APP_NAME} {i18n}>
	{@render children()}
	<div id="Top2_Layout_Check"></div>
</BaseLayout>
