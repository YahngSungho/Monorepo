<script>
	// MDSvex에서 'src', 'alt', 'title' 속성을 받습니다.
	let { src = '', alt = '', title = undefined } = $props();
</script>

<img {alt} {src} {title} />