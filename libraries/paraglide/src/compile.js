import { compile } from '@inlang/paraglide-js'

await compile({
	outdir: './paraglide-output/',
			project: './project.inlang/',
			strategy: ['url', 'cookie', 'localStorage', 'preferredLanguage', 'baseLocale'],
			disableAsyncLocalStorage: true,
})
