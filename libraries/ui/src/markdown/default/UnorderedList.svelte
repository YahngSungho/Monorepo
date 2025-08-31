<script>
import { cx } from '@emotion/css'
let { children, class: className, ...rest } = $props()
</script>

<ul {...rest} class={cx('list-disc [&>li]:mt-1 marginBlock-1', className)}>
	{@render children()}
</ul>
