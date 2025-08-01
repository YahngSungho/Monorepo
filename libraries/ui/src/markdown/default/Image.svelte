<script>
	let { src, alt, ...rest } = $props()
</script>

<img {alt} {src} {...rest} />