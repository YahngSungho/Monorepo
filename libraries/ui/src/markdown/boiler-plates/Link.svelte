<script>
	// MDSvex에서 전달하는 'href', 'title' 등의 속성을 받습니다.
	let { href = '', title = undefined, children } = $props();
</script>

<a {href} {title}>{@render children()}</a>