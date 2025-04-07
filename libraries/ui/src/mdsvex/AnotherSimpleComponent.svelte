<script>
let { message } = $props()
</script>

<div style:margin-block-start="10px" style:padding="10px" style:border="1px solid blue">
	<h4>다른 간단한 컴포넌트 (AnotherSimpleComponent)</h4>
	<p>부모로부터 받은 메시지 (양방향 바인딩됨):</p>
	<input type="text" bind:value={message} />
	<p><em>(이 입력 필드를 수정하면 sample.svx의 messageForSecondComponent 값도 변경됩니다)</em></p>
</div>
