<script>
	import { Image } from "@unpic/svelte"

	let { src, width, height, alt, ...rest } = $props()

</script>

<Image
{alt} background="auto"
{height} layout="constrained" {src} {width} {...rest} sizes={`(max-width: ${width}px) 100vw, ${width}px`} />
