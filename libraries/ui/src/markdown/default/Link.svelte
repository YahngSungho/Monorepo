<script>
import Icon from '../../custom/icon.svelte'

let { href = '', title = undefined, children } = $props()
</script>

<a {href} rel="noopener noreferrer" target="_blank" {title}>
	<Icon icon="carbon:link" noMargin right small>
		{@render children?.()}
	</Icon>
</a>
