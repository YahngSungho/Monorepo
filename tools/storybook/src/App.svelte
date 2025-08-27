<script>
import './app.css'

import viteLogo from '/vite.svg'

import svelteLogo from './assets/svelte.svg'
import Counter from './lib/Counter.svelte'
</script>

<main>
	<div>
		<a href="https://vitejs.dev" rel="noreferrer" target="_blank">
			<img class="logo" alt="Vite Logo" src={viteLogo} />
		</a>
		<a href="https://svelte.dev" rel="noreferrer" target="_blank">
			<img class="logo svelte" alt="Svelte Logo" src={svelteLogo} />
		</a>
	</div>
	<h1>Vite + Svelte</h1>

	<div class="card">
		<Counter />
	</div>

	<p>
		Check out <a href="https://github.com/sveltejs/kit#readme" rel="noreferrer" target="_blank"
			>SvelteKit</a
		>, the official Svelte app framework powered by Vite!
	</p>

	<p class="read-the-docs">Click on the Vite and Svelte logos to learn more</p>
</main>

<style>
.logo {
	will-change: filter;
	block-size: 6em;
	padding: 1.5em;
	transition: filter 300ms;

	&:hover {
		filter: drop-shadow(0 0 2em rgb(100 108 255 / 66.7%));
	}

	&.svelte:hover {
		filter: drop-shadow(0 0 2em rgb(255 62 0 / 66.7%));
	}
}

.read-the-docs {
	color: rgb(136 136 136);
}
</style>
