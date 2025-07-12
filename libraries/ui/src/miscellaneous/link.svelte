<script module>
	import { localizeHref } from '@library/paraglide/helpers'

	const newTabProps = {
		rel: 'noopener noreferrer',
		target: '_blank',
	}
	</script>

<script>
let { href = '', children, current = false, class: incomingClass = '', ...rest } = $props()

const isInternalLink = $derived(href?.startsWith('.') || href?.startsWith('/'))
</script>


<a
	class={incomingClass}
	class:current
	href={isInternalLink ? localizeHref(href) : href}
	{...isInternalLink ? {} : newTabProps}
	{...rest}
>
		{@render children?.()}
</a>

<style>
	.current {
		opacity: 0.7;
	}
</style>
