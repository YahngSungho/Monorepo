<script>
	// MDSvex에서 'src', 'alt', 'title' 속성을 받습니다.
	const { src, alt, ...rest } = $props();
</script>

<img {alt} {src} {...rest} />
