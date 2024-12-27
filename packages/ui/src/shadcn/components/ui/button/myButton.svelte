<script>
import Button from './button.svelte'

const { text } = $props()
let myVariable = $state('나는 변수야');

''; // eslint-disable-line sonarjs/no-unused-expressions
</script>

<div>
	<Button>{text || myVariable}</Button>
</div>
