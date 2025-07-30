<script>
	import { Image } from "@unpic/svelte"

	let { publicid, width, height, alt, ...rest } = $props()

	const transformations = `w_${width},h_${height},f_auto,c_lfill`;
	const src = `https://res.cloudinary.com/dykp9yauv/image/upload/${transformations}/v1753871059/${publicid}.jpg`
</script>

<Image
{alt} background={src}
{height} layout="constrained" {src} {width} {...rest} sizes={`(max-width: ${width}px) 100vw, ${width}px`} />
