import { compile } from '@inlang/paraglide-js'

await compile({
	disableAsyncLocalStorage: true,
	experimentalMiddlewareLocaleSplitting: true,
	outdir: './paraglide-output/',
	project: './project.inlang/',
	strategy: ['cookie', 'preferredLanguage', 'url', 'baseLocale'],
})
