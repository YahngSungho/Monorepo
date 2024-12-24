<script>
import Button from './button.svelte'

let myVariable = $state('나는 변수야');

''; // eslint-disable-line sonarjs/no-unused-expressions
</script>

<div>
	<Button>{myVariable}</Button>
</div>
