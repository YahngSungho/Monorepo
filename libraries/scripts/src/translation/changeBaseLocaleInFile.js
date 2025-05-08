import fs from 'node:fs';

/**
 * 지정된 경로의 JSON 파일에서 'baseLocale' 속성의 값을 변경합니다.
 * 이 함수는 파일 시스템에 직접적인 변경을 가하는 액션(impure function)입니다.
 *
 * @param {string} absolutePath JSON 파일의 절대 경로입니다.
 * @param {string} newBaseLocale 설정할 새로운 baseLocale 값입니다.
 * @returns {Promise<void>} 파일 쓰기 작업이 완료되면 resolve되는 Promise를 반환합니다.
 *                          오류 발생 시 reject됩니다.
 */
export const changeBaseLocaleInFile_action = async (absolutePath, newBaseLocale) => {
  try {
    // 1. 파일 읽기 (액션)
    const fileContent = await fs.promises.readFile(absolutePath, 'utf8');

    // 2. JSON 파싱 (계산)
    let jsonData;
    try {
      jsonData = JSON.parse(fileContent);
    } catch (parseError) {
      console.error(`Error parsing JSON file at ${absolutePath}:`, parseError);
      throw new Error(`Failed to parse JSON from ${absolutePath}`);
    }

    // 3. 'baseLocale' 값 변경 (계산)
    // jsonData가 객체이고 'baseLocale' 속성을 가지고 있는지 확인
    if (typeof jsonData === 'object' && jsonData !== null && 'baseLocale' in jsonData) {
      jsonData.baseLocale = newBaseLocale;
    } else {
      // baseLocale 속성이 없거나 jsonData가 예상한 형식이 아닌 경우
      // 필요에 따라 오류를 발생시키거나, 파일을 그대로 두거나, 새 속성을 추가할 수 있습니다.
      // 여기서는 일단 콘솔에 경고를 출력하고 넘어갑니다.
      console.warn(`Warning: 'baseLocale' property not found or invalid JSON structure in ${absolutePath}. File will be updated without changing baseLocale.`);
    }

    // 4. JSON을 문자열로 변환 (계산)
    const updatedJsonString = JSON.stringify(jsonData, undefined, 2); // undefined, 2는 보기 좋게 출력(pretty-print)

    // 5. 파일 쓰기 (액션)
    await fs.promises.writeFile(absolutePath, updatedJsonString, 'utf8');
    console.log(`Successfully updated baseLocale to '${newBaseLocale}' in ${absolutePath}`);

  } catch (error) {
    console.error(`Error processing file ${absolutePath}:`, error);
    // 에러를 다시 throw하여 호출자에게 알리거나, 특정 방식으로 처리할 수 있습니다.
    throw error;
  }
};
