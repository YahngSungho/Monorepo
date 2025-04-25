import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * Calculates the absolute path relative to the caller's module location.
 * @param {string} importMetaUrl The `import.meta.url` of the calling module.
 * @param {string} relativePath The relative path from the caller's location.
 * @returns {string} The calculated absolute path.
 * @throws {Error} If `importMetaUrl` is not provided.
 */
export function getAbsolutePath (importMetaUrl, relativePath) {
	if (!importMetaUrl) {
		throw new Error("getAbsolutePath requires the caller's import.meta.url as the second argument.");
	}
	const __filename = fileURLToPath(importMetaUrl)
	const __dirname = path.dirname(__filename)
	return path.resolve(__dirname, relativePath)
}

export function getFileAsString (importMetaUrl, relativePath) {
	// 현재 파일의 디렉토리 경로 얻기 (ES 모듈 방식)
	const __filename = fileURLToPath(importMetaUrl);
	const __dirname = path.dirname(__filename);

	// .md 파일의 절대 경로 생성
	const filePath = path.join(__dirname, relativePath); // 'prompt.md' 파일이 현재 스크립트와 같은 디렉토리에 있다고 가정
	const file = fs.readFileSync(filePath, 'utf8')
	return file
}