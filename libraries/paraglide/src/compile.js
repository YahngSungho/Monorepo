import { compile } from '@inlang/paraglide-js'

await compile({
	outdir: './paraglide-output/',
			project: './project.inlang/',
			strategy: ['localStorage', 'cookie', 'preferredLanguage', 'url', 'baseLocale'],
			disableAsyncLocalStorage: true,
})
