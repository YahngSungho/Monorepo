<script module>
import { localizeHref } from '@library/paraglide/helpers'

const newTabProps = {
	rel: 'noopener noreferrer',
	target: '_blank',
}
</script>

<script>
let { href = '', children, class: incomingClass = '', ...rest } = $props()

let isInternalLink = $derived(href?.startsWith('.') || href?.startsWith('/'))
</script>

<a
	class={incomingClass}
	href={isInternalLink ? localizeHref(href) : href}
	{...isInternalLink ? {} : newTabProps}
	{...rest}
>
	{@render children?.()}
</a>
