import { describe, expect,it } from 'vitest'

import { getMetaDataObject } from './getMetadata.js'

describe('getMetaDataObject 함수', () => {
	// 원칙: 동작 테스트 (공개 API)
	// 원칙: 모의 최소화 (순수 함수 계산이므로 모의 불필요, 실제 R 의존성 사용)
	it('정상적인 입력 데이터에서 메타데이터 객체를 올바르게 추출해야 한다', () => {
		// 준비 (Arrange)
		const originalLanguageMap = {
			ko: {
				'src/post1.md': `---
title: 제목1
tags: 태그1, 태그2
---

내용1`,
				'src/post2.md': '프론트매터 없음',
			},
			en: {
				'src/post1.md': `---
title: Title 1
tags: tag1, tag2
custom: value
---

Content 1`,
				'src/post3.md': `---
title: Title 3
---

Content 3`,
			},
		}
		const translatedLanguageMap = {
			fr: {
				newMessages: {
					'src/post1.md': `---
title: Titre 1
tags: tag_fr1
---

Contenu 1`,
					'src/post4.md': `---
title: Titre 4
---

Contenu 4`,
				},
			},
			de: {
				newMessages: {
					// post1.md는 fr에서 이미 제공되었으므로 ko/en의 값을 덮어쓰지 않음 (merge 로직 상)
					'src/post3.md': `---
title: Titel 3
author: Autor
---

Inhalt 3`,
				},
			},
		}

		const expected = {
			fr: {
				'src/post1.md': { title: 'Titre 1', tags: 'tag_fr1' },
				'src/post4.md': { title: 'Titre 4' },
			},
			de: {
				'src/post3.md': { title: 'Titel 3', author: 'Autor' },
			},
			ko: {
				'src/post1.md': { title: '제목1', tags: '태그1, 태그2' },
				'src/post2.md': {},
			},
			en: {
				'src/post1.md': { title: 'Title 1', tags: 'tag1, tag2', custom: 'value' },
				'src/post3.md': { title: 'Title 3' }, // de에 의해 덮어쓰여지지 않음 (R.merge 동작)
			},
		}

		// 실행 (Act)
		const result = getMetaDataObject(originalLanguageMap, translatedLanguageMap)

		// 검증 (Assert)
		expect(result).toEqual(expected)
	})

	// 원칙: 엣지 케이스 테스트
	it('프론트매터 구분 기호가 없거나 불완전한 경우 빈 객체를 반환해야 한다', () => {
		// 준비 (Arrange)
		const originalLanguageMap = {
			ko: {
				'no-frontmatter.md': '그냥 텍스트',
				'incomplete-frontmatter.md': '---\ntitle: 제목\n',
				'only-one-delimiter.md': '---\n내용',
			},
		}
		const expected = {
			ko: {
				'no-frontmatter.md': {},
				'incomplete-frontmatter.md': {},
				'only-one-delimiter.md': {},
			},
		}

		// 실행 (Act)
		const result = getMetaDataObject(originalLanguageMap, undefined)

		// 검증 (Assert)
		expect(result).toEqual(expected)
	})

	// 원칙: 엣지 케이스 테스트
	it('프론트매터 블록이 비어 있거나 유효하지 않은 줄만 있는 경우 빈 객체를 반환해야 한다', () => {
		// 준비 (Arrange)
		const originalLanguageMap = {
			ko: {
				'empty-block.md': `---

---
내용`,
				'no-colon.md': `---
그냥 텍스트
---
내용`,
				'only-key.md': `---
key:
---
내용`,
				'only-value.md': `---
: value
---
내용`,
			},
		}
		const expected = {
			ko: {
				'empty-block.md': {},
				'no-colon.md': {},
				'only-key.md': {},
				'only-value.md': {},
			},
		}

		// 실행 (Act)
		const result = getMetaDataObject(originalLanguageMap, undefined)

		// 검증 (Assert)
		expect(result).toEqual(expected)
	})

	// 원칙: 엣지 케이스 테스트
	it('입력 맵이 비어 있거나 undefined인 경우 빈 객체를 반환해야 한다', () => {
		// 준비 (Arrange)
		const emptyMap = {}
		const undefinedMap = undefined
		const expected = {}

		// 실행 & 검증 (Act & Assert)
		expect(getMetaDataObject(emptyMap, emptyMap)).toEqual(expected)
		expect(getMetaDataObject(undefinedMap, undefinedMap)).toEqual(expected)
		expect(getMetaDataObject(undefinedMap, undefinedMap)).toEqual(expected)
		expect(getMetaDataObject(emptyMap, undefinedMap)).toEqual(expected)
	})

	// 원칙: 엣지 케이스 테스트
	it('맵 내의 값이 문자열이 아닌 경우 빈 객체를 반환해야 한다', () => {
		// 준비 (Arrange)
		const originalLanguageMap = {
			ko: {
				'valid.md': `---
title: 제목
---
내용`,
				'invalid.md': 123, // 숫자는 처리되지 않음
				'undefined_value.md': undefined, // undefined은 처리되지 않음
			},
		}
		const expected = {
			ko: {
				'valid.md': { title: '제목' },
				'invalid.md': {},
				'undefined_value.md': {},
			},
		}

		// 실행 (Act)
		const result = getMetaDataObject(originalLanguageMap, undefined)

		// 검증 (Assert)
		expect(result).toEqual(expected)
	})

	// 원칙: 엣지 케이스 테스트
	it('번역된 맵 구조가 비정상적인 경우에도 안전하게 처리해야 한다', () => {
		// 준비 (Arrange)
		const originalLanguageMap = {
			ko: { 'post.md': `---
title: 원본
---
` },
		}
		const translatedLanguageMap = {
			fr: undefined, // 언어 자체가 undefined
			de: { newMessages: undefined }, // newMessages가 undefined
			es: { newMessages: { 'post.md': undefined } }, // 메시지 값이 undefined
			pt: { newMessages: { 'post.md': `---
title: Traduzido
---
` } }, // 정상
		}
		const expected = {
			de: {},
  es: { 'post.md': {} },
  fr: {},
			ko: { 'post.md': { title: '원본' } },
			pt: { 'post.md': { title: 'Traduzido' } },
			// fr, de, es는 유효한 newMessages가 없으므로 결과에 포함되지 않음
		}

		// 실행 (Act)
		const result = getMetaDataObject(originalLanguageMap, translatedLanguageMap)

		// 검증 (Assert)
		expect(result).toEqual(expected)
	})
})
