<script>
import { cx } from '@emotion/css'
const { children, class: className, ...rest } = $props()
</script>

<ol {...rest} class={cx('list-decimal [&>li]:mt-1', className)}>
	{@render children()}
</ol>

<style>
ol {
	margin-block: var(--space-em-cqi-3xs-2xs);
	margin-inline: var(--space-em-cqi-s-l);
}
</style>
