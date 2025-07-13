<script>
import { cx } from '@emotion/css'
let { children, class: className, ...rest } = $props()
</script>

<ul {...rest} class={cx('list-disc [&>li]:mt-1', className)}>
	{@render children()}
</ul>

<style>
ul {
	margin-block: var(--space-em-cqi-3xs-2xs);
	margin-inline: var(--space-em-cqi-s-l);
}
</style>
