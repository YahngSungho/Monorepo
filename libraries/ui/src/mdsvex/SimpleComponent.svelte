<script>
	let { message = '기본 메시지' } = $props();
</script>

<div>
	<h3>SimpleComponent 로드됨</h3>
	<p>메시지: {message}</p>
</div>

<style>
	div {
		margin: 1em 0;
		padding: 1em;
		border: 1px solid rgb(204 204 204);
		background-color: rgb(249 249 249);
	}

	h3 {
		margin-block-start: 0;
		color: var(--color-primary, blue); /* CSS 변수 사용 예시 */
	}
</style>