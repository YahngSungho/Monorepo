import { mg } from '@library/backends/mailgun'
import { getFrontmatterObject, removeMDAndTags } from '@library/helpers/markdown'

export async function sendMails(emailList, markdownText) {
	const frontmatterObject = getFrontmatterObject(markdownText)
	const {title} = frontmatterObject
	if (!title) {
		throw new Error('title is required')
	}

	let result
	try {
		result = await mg.messages.create('sungho.blog', {
			from: "Sungho Yahng <hi@sungho.blog>",
			to: emailList,
			subject: title,
			html: "<div>hello</div>",
			text: removeMDAndTags(markdownText),
'recipient-variables': JSON.stringify(toObject(emailList)),
		})
	} catch (error) {
		console.error(error)
		throw error
	}

	console.log(result)
}


/**
 * 배열을 인자로 받아, 각 요소를 key로, 빈 객체를 value로 가지는 객체를 반환합니다.
 * @param {Array<string>} arr - 키로 사용할 값들이 담긴 배열
 * @returns {Object} 변환된 객체
 */
const toObject = (arr) => {
  return arr.reduce((accumulator, currentKey) => {
    // accumulator는 최종적으로 반환될 객체입니다.
    // currentKey는 배열의 현재 요소입니다.
    accumulator[currentKey] = {};
    return accumulator;
  }, {}); // {}는 accumulator의 초기값으로, 빈 객체에서 시작합니다.
};


console.log(removeMDAndTags(`
	---
	title: Mailgun Test mail임
	---

	<h1>hello 1</h1>

	hello 2




	hello 3
	`))

// sendMails(['pofgiru@gmail.com', 'sungho.yahng@gmail.com'], `
// ---
// title: Mailgun Test mail임
// ---

// <h1>hello 1</h1>

// hello 2
// `)