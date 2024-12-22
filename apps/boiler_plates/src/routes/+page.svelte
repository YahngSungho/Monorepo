<script>
import '@repo/base/base.css'
import '@repo/base/base.js'

const fo = 'bigCommandKEnabled'

let foo = $state(fo + ' foo')

foo += ' bar133322222223'

const myObject = {
	bar: {
		deeplyNested: {
			inner: {
				moreInner: {
					evenMoreInner: {
						almostThere: {
							gettingDeeper: {
								bottle: 'done',
								deepestYet: {
									finalLevel: '이제 정말로 충분히 깊습니다.',
								},

							},
						},
					},
				},
			},
		},
		eo: 'vgf2',
		eov: 'fgv',
		wo: 'sw',
	},
	foo: 'bar',
	tor: 'boo',
}

;
</script>

<h1>Welcome to SvelteKit</h1>
<h2>Welcome to SvelteKit</h2>
<h3>Welcome to SvelteKit</h3>
<h4>Welcome to SvelteKit</h4>
<h5>Welcome to SvelteKit</h5>
<h6>Welcome to SvelteKit</h6>
<div>
	{foo}
</div>
<div>
	Hi
</div>
<p>
	Visit <a href='https://kit.svelte.dev'>kit.svelte.dev</a> to read the documentation
</p>

<style>
	p {
		max-inline-size: 1000px;
		background-color: var(--red-10);
	}
</style>
