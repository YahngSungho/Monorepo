import { compile } from '@inlang/paraglide-js'

await compile({
	outdir: './paraglide-output/',
			project: './project.inlang/',
			strategy: ['cookie', 'preferredLanguage', 'url', 'baseLocale'],
			disableAsyncLocalStorage: true,
})
