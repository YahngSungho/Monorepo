<script>
import '@repo/base/fontStyle.css'

import BaseLayout from '@repo/base/baseLayout'

import { i18n } from '../i18n'

const appName = '@app/boiler_plates'

let { children } = $props()

;('') // eslint-disable-line
</script>

<BaseLayout {appName} {i18n}>
	{@render children()}
	<div id="topDivForSmokeTest"></div>
</BaseLayout>
