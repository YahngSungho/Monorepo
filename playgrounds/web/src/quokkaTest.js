const foo = 'bar'

foo + 'baz'

foo + 'bazbaz'
console.log('🚀 ~ foo:', foo)

function myfunc(anyVariable) {
	const st1 = anyVariable + 'baz'
	console.log('🚀 ~ myfunc ~ st1:', st1)
	const st2 = st1 + 'baz'
	console.log('🚀 ~ myfunc ~ st2:', st2)
	const st3 = st2 + 'baz'
	return st3 + 'baz'
}

myfunc(foo)/* ? */

console.log(myfunc(foo)) // ?.

const myVariable = console/* ?+ */

foo + foo
