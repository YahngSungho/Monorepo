const foo = 'bar'

foo + 'baz'

foo + 'bazbaz'

function myfunc(string) {
	const st1 = string + 'baz'
	const st2 = st1 + 'baz'
	const st3 = st2 + 'baz'
	return st3 + 'baz'
}

myfunc(foo)/* ? */

console.log(myfunc(foo))

const myVariable = console/* ?+ */
