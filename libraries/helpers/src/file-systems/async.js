import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { basename, dirname, join } from 'node:path';

import { glob  } from 'tinyglobby'

import { R } from '../library-wrappers/R.js'
import { getAbsolutePath } from './sync.js'

/**
 * @typedef {object} FileDetail
 * @property {string} fileName - 파일 이름
 * @property {string} value - 파일 내용
 * @property {string} path - 파일의 전체 경로
 */

/**
 * 지정된 상대 경로 폴더 및 그 하위 폴더에서 glob 패턴과 일치하는 모든 파일의
 * 이름, 내용, 상대 경로를 재귀적으로 찾아 객체로 반환합니다. (내장 glob 사용)
 *
 * @param {string} absoluteFolderPath - 검색을 시작할 기준 폴더의 절대 경로.
 * @param {string} globPattern - 검색할 파일 패턴. \*\*\/ 로 시작해야 재귀적으로 탐색함
 * @returns {Promise<Array<FileDetail>>}
 *          각 요소가 FileDetail 객체인 배열을 담은 Promise.
 *          오류 발생 시 에러를 던집니다.
 * @throws {Error} glob 검색 또는 파일 읽기 중 오류 발생 시 에러를 던집니다.
 *
 * @example
 * // src/data 폴더 및 하위에서 모든 .json 파일을 찾기
 * const jsonFiles = await findFilesRecursively('**\/*.json', 'src/data');
 * // 결과 예시:
 * // [
 * //   { fileName: "user.json", value: "{...}", path: "/path/to/project/src/data/user.json" },
 * //   { fileName: "config.json", value: "{...}", path: "/path/to/project/src/data/configs/config.json" }
 * // ]
 */
export async function readFilesToStrings_recursive(absoluteFolderPath, globPattern) {

	const results = []
	// 내장 glob은 cwd 옵션을 사용하므로, 패턴은 cwd 기준 상대 경로여야 합니다.
	const options = {
		cwd: absoluteFolderPath, // 검색 시작 디렉토리를 지정합니다.
		// nodir: true는 내장 glob의 기본 동작과 유사 (파일만 반환)
	};

	console.log(`내장 Glob 패턴 검색 시작: 패턴 [${globPattern}], 경로 [${absoluteFolderPath}]`);

	try {
		// 1. glob 패턴과 일치하는 파일 경로 배열 가져오기 (await 추가)
		const matchedFilePaths = await glob(globPattern, options); // glob의 Promise를 await으로 처리

		console.log(`   - 총 ${matchedFilePaths.length}개 파일 경로 발견.`);

		let count = 0;
		// 2. 배열을 순회하며 각 파일 처리 (for await...of -> for...of 변경)
		for (const relativeFilePath of matchedFilePaths) {
			// relativeFilePath는 cwd 기준 상대 경로 (예: 'user.json', 'configs/config.json')
			const fullFilePath = join(absoluteFolderPath, relativeFilePath); // 실제 파일 시스템 접근을 위한 전체 경로
			const finalPath = fullFilePath; // 저장할 경로는 호출자 기준 상대 경로 (원래 의도대로)

			try {
				console.log(`   - 파일 내용 읽기 시도: ${fullFilePath}`);
				const value = await readFile(fullFilePath, 'utf8');
				const fileName = basename(fullFilePath); // 전체 경로에서 파일 이름 추출

				// 파일 이름, 내용, 최종 경로를 객체에 추가
				results.push({ fileName, value, path: finalPath });
				count++;
			} catch (readError) {
				// 개별 파일 읽기 오류 처리
				console.error(`   ! 파일 읽기 오류 [${fullFilePath}]:`, readError.message);
				// 오류 발생 시 해당 파일은 결과에 포함되지 않음
			}
		}

		console.log(` - 총 ${count}개 파일 처리 완료.`);
		console.log(`성공적으로 파일 ${results.length}개의 정보를 객체에 담았습니다.`);
		return results; // 최종 결과 객체 반환
	} catch (error) {
		// glob 실행 중 오류 또는 예기치 않은 오류 처리
		console.error(` ! 내장 Glob 검색 중 오류 발생 (패턴: ${globPattern}, 경로: ${absoluteFolderPath}):`, error);
		throw error; // 에러를 다시 던져 호출 측에서 처리하도록 함
	}
}

/**
 * 지정된 상대 경로의 폴더 안에 있는 모든 파일의 내용을 읽어
 * 파일 이름을 키로, 파일 내용을 값으로 하는 객체를 반환합니다.
 * 하위 폴더는 탐색하지 않습니다.
 * @param {string} absoluteFolderPath - 파일들을 읽어올 대상 폴더의 절대 경로.
 * @param {string} [globPattern='*'] - 필터링할 파일 패턴 (glob). 기본값은 모든 파일('*').
 * @returns {Promise<{[filename: string]: string}>}
 *          파일 이름을 키로, 파일 내용(문자열)을 값으로 갖는 객체를 담은 Promise.
 *          파일 읽기 실패 시 해당 파일은 객체에 포함되지 않습니다.
 * @throws {Error} 폴더 읽기나 주요 파일 읽기 중 오류 발생 시 에러를 던집니다. 개별 파일 오류는 콘솔에 기록될 수 있습니다.
 */
export async function readFilesToStrings(absoluteFolderPath, globPattern = '*') {

  try {
    // 1. glob 패턴과 일치하는 파일 목록 가져오기 (하위 폴더 제외)
    const matchedFiles = await glob(globPattern, {
			cwd: absoluteFolderPath,
			deep: 1, // 현재 폴더만 탐색 (재귀 X)
		});
    console.log(`폴더 [${absoluteFolderPath}] 에서 패턴 [${globPattern}]과(와) 일치하는 파일 ${matchedFiles.length}개 발견.`);

    // 2. 각 파일에 대해 내용 읽기 Promise 생성
    const processingPromises = matchedFiles.map(async (filename) => {
      const fullPath = join(absoluteFolderPath, filename); // 파일의 전체 경로 생성

      try {
				// 파일 내용을 UTF-8 텍스트로 읽어옵니다.
				console.log(` - 파일 읽기 시도: ${fullPath}`);
				const value = await readFile(fullPath, 'utf8');
				// 성공적으로 읽었으면 파일 이름과 내용을 객체로 반환
				return { filename, value, path: fullPath };
      } catch (readError) {
        // 개별 파일 처리 중 오류 발생 시 (예: 권한 문제)
        console.error(` ! 파일 읽기 오류 [${fullPath}]:`, readError.message);
				// 오류 발생 시 null 반환하여 이 파일은 결과에 포함되지 않도록 함
				return undefined
			}
		})

    // 3. 모든 파일 처리 작업(읽기)이 완료될 때까지 병렬로 기다리기
    console.log(`총 ${processingPromises.length}개의 파일 처리 시작...`);
    const results = await Promise.all(processingPromises);

		/** @type {{[filename: string]: string}} */
		const fileMap = {}
		for (const fileObject of results) {
			if (!fileObject) {
				continue
			}
			fileMap[fileObject.filename] = fileObject.value
		}


		console.log(`성공적으로 파일 ${Object.keys(fileMap).length}개의 내용을 객체에 담았습니다.`);

		return fileMap
  } catch (error) {
    // glob 실행 오류 또는 폴더 자체를 읽을 수 없는 경우 등의 오류 처리
    console.error(` ! 폴더 [${absoluteFolderPath}] 처리 중 (패턴: ${globPattern}) 심각한 오류 발생:`, error);
    // 에러를 다시 던져서 호출 측에서 처리하도록 함
    throw error;
  }
}

/**
 * @typedef {{[filename: string]: any}} ParsedJsonObjectMap
 *          파일 이름을 키로, 파싱된 JSON 객체 (any 타입)를 값으로 갖는 객체
 */

/**
 * 지정된 폴더 내의 모든 JSON 파일('.json')을 읽어
 * 파일 이름을 키로, 파싱된 JSON 객체를 값으로 하는 객체를 반환합니다.
 * 하위 폴더는 탐색하지 않습니다.
 *
 * @param {string} absoluteFolderPath - JSON 파일들을 읽어올 대상 폴더의 절대 경로.
 * @returns {Promise<ParsedJsonObjectMap>}
 *          ParsedJsonObjectMap 객체를 담은 Promise.
 * @throws {Error} 파일 읽기 또는 JSON 파싱 중 오류 발생 시 에러를 던집니다.
 */
export async function readFilesToObjects(absoluteFolderPath) {
	try {
		// readFilesToStrings는 이제 Promise<{[filename: string]: string}> 를 반환합니다.
		const fileMap = await readFilesToStrings(absoluteFolderPath, '*.json')

		/** @type {{[filename: string]: any}} */
		const objectMap = {}
		for (const [filename, fileContent] of Object.entries(fileMap)) {
			// Ensure fileContent is treated as a string for JSON.parse
			objectMap[filename] = JSON.parse(fileContent)
		}

		return objectMap
	} catch (error) {
		// readFilesToStrings 또는 JSON.parse 또는 그 외의 예외 처리
		console.error(` ! JSON 파일들을 객체로 읽는 중 오류 발생 [${absoluteFolderPath}]:`, error);
		throw error;
	}
}

export const writeFile_async = R.curry(async (absolutePath, content) => {
	try {
		const fullPath = absolutePath;

		// 폴더가 없다면 생성 (Node.js v10.12.0 이상)
		await mkdir(dirname(fullPath), { recursive: true });
		await writeFile(fullPath, content, 'utf8');
	} catch (error) {
		console.error(` ! 파일 쓰기 오류 [${absolutePath}]:`, error);
		throw error;
	}
})

export const readFileFromRelativePath = R.curry(async (importMetaUrl, relativePath) => {
	const absolutePath = getAbsolutePath(importMetaUrl, relativePath)
	try {
		const content = await readFile(absolutePath, 'utf8');
		return content;
	} catch (error) {
		console.error(` ! 파일 읽기 오류 [${absolutePath}]:`, error);
		throw error;
	}
})
