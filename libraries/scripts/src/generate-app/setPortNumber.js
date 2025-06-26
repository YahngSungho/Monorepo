import fs from 'node:fs/promises'
import path from 'node:path'

const lastPortNumber = 5002
const newPortNumber = lastPortNumber + 1

const main = async () => {
	const appName = process.argv[2]
	if (!appName) {
		console.error('오류: 앱 이름이 제공되지 않았습니다.')
		console.log('사용법: node libraries/scripts/src/miscellaneous/setPortNumber.js <appName>')
		process.exit(1)
	}

	const projectRoot = process.cwd()
	const configPath = path.join(projectRoot, 'apps', appName, 'playwright.config.js')

	try {
		await fs.access(configPath)
	} catch {
		console.error(`오류: ${configPath} 에서 playwright.config.js 파일을 찾을 수 없습니다.`)
		process.exit(1)
	}

	try {
		const fileContent = await fs.readFile(configPath, 'utf8')
		const newContent = fileContent.replace(/(const portNumber = )\d+/, `$1${newPortNumber}`)

		if (fileContent === newContent) {
			console.warn(
				`경고: ${configPath} 에서 'const portNumber' 라인을 찾지 못했습니다. 파일이 수정되지 않았습니다.`,
			)
			return
		}

		await fs.writeFile(configPath, newContent, 'utf8')
		console.log(`✅ ${configPath}의 포트 번호를 ${newPortNumber}로 성공적으로 업데이트했습니다.`)

		const selfPath = path.join(
			projectRoot,
			'libraries',
			'scripts',
			'src',
			'generate-app',
			'setPortNumber.js',
		)
		const selfContent = await fs.readFile(selfPath, 'utf8')
		const newSelfContent = selfContent.replace(/(const lastPortNumber = )\d+/, `$1${newPortNumber}`)
		await fs.writeFile(selfPath, newSelfContent, 'utf8')
		console.log(`✅ ${selfPath} 파일의 lastPortNumber를 ${newPortNumber}로 업데이트했습니다.`)
	} catch (error) {
		console.error(`${configPath} 파일 처리 중 오류 발생:`, error)
		process.exit(1)
	}
}

main()
