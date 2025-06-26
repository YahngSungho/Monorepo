// @ts-ignore
import { R } from '@library/helpers/R';
// @ts-ignore
import { getLocale } from '@library/paraglide/helpers'

const metadata = import.meta.glob('/src/translation/metadata.json', { query: 'raw', eager: true });
const frontmatters = import.meta.glob('/src/translation/frontmatters/*.json', { query: 'raw' });

let promise = null;
export function getAllMetadata() {
	if (!promise) {
		promise = (async () => {
			const lang = getLocale();

			const frontmatterPath = `/src/translation/frontmatters/${lang}.json`;
			const frontmatterLoader = frontmatters[frontmatterPath];

			// @ts-ignore
			const parsedMetadata = JSON.parse(metadata['/src/translation/metadata.json'].default);

			if (!frontmatterLoader) {
				console.warn(`Frontmatter file not found for lang: "${lang}"`);
				return parsedMetadata;
			}

			const frontmatterContent = await frontmatterLoader();
			// @ts-ignore
			const parsedFrontmatter = JSON.parse(frontmatterContent.default);

			return R.mergeWith(R.mergeRight, parsedMetadata, parsedFrontmatter);
		})();
	}

	return promise;
}

export async function getMetadataOfPost (slug) {
	const allMetadata = await getAllMetadata();

	return allMetadata[`posts/${slug}`];
}
