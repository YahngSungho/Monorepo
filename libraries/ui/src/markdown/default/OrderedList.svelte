<script>
import { cx } from '@emotion/css'
let { children, class: className, ...rest } = $props()
</script>

<ol {...rest} class={cx('list-decimal [&>li]:mt-1 marginBlock-1', className)}>
	{@render children()}
</ol>
