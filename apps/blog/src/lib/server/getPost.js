import { getLocale } from '@library/paraglide/helpers'

// apps/blog/src/lib/server/getPost.js

// eager: false (기본값)로 설정하여, 파일 내용을 즉시 로드하지 않고
// 필요할 때 동적으로 불러올 수 있는 함수들의 맵을 생성합니다.
const posts = import.meta.glob('/src/posts/**/*.md', { query: 'raw' });

export async function getPost(slug) {
	const lang = getLocale();
	const path = `/src/posts/${slug}/${lang}.md`;
	const loader = posts[path];

	if (!loader) {
		console.warn(`Post loader not found for slug: "${slug}", lang: "${lang}" (path: ${path})`);
		return null;
	}

	// 파일 로더 함수를 실행하고 내용을 비동기적으로 기다립니다.
	const post = await loader();
	return post.default;
}