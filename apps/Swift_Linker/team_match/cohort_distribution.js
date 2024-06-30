import create from '@repo/library_wrappers/mutative'
import * as R from 'ramda'
import {
	AllMembers, Cohort, Member, Team, Teams,
} from './monads.js'

/**
 * @typedef {import('./monads.js').Id} Id
 */

// ---

const includedIn = R.curry((hasMemberId, idArray) => (idArray.some(id => hasMemberId(id))))

const getMemberCount = R.curry((idArray1, idArray2) => R.intersection(idArray1, idArray2).length)

const getGreatestRemainingSlotTeam = R.reduce(R.maxBy(team => (team.getRemainingSlot())), {
	getRemainingSlot: () => 0,
	index: -1,
})

// ---

const allMembers = AllMembers.of(R.range(0, 50).map(id => new Member(String(id))))
const cohort1 = allMembers.getCohort(member => Number(member.id) % 2 === 0)
const cohort2 = allMembers.getCohort(member => Number(member.id) % 3 === 0)
// const teams = Teams.of([
// 	Team.of(allMembers.getIdArray(member => Number(member.id) % 8 === 0), 20),
// 	Team.of(allMembers.getIdArray(member => Number(member.id) % 9 === 0 && Number(member.id) !== 0), 30),
// ], [20, 30])
const teams = Teams.empty([10, 10, 10, 10, 10])

// ---

// Todo 나중에 인자 cohorts 로 바꿔서 일반화

const joinedArray1 = cohort1.getJoinedArray()/* ?+ */
const joinedArray2 = cohort2.getJoinedArray()

const getRegularArray = R.pipe(
	// Todo: 이거 init 함수로 빼내서 pipe에서 가장 앞에 넣기
	R.filter(id => allMembers.hasMemberId(id)),
	array => Array.isArray(array) ? teams.removeDuplicateByThis(array) : array,
)

let array1 = getRegularArray(joinedArray1)
let array2 = getRegularArray(joinedArray2)

// Todo: 중복되는 애들은 both가 있으면 거기에 넣고 아님 그냥 버리기 - 조합적 폭발을 생각해서 cohort 수가 2나 3일 때만 작동하고 아니면 걍 버려
const intersectionArray = R.intersection(array1, array2)

if (array1.length === 0 && array2.length === 0) {
	teams
}

if (intersectionArray.length > 0) {
	array1 = R.difference(array1, intersectionArray)
	array2 = R.difference(array2, intersectionArray)
}

// ---

const team1Array = []
const team2Array = []
const bothTeamArray = []
const noneTeamArray = []

for (const team of teams.teams) {
	const includedInTeam = includedIn(id => (team.hasMemberId(id)))
	if (team.getRemainingSlot() > 0) {
		if (includedInTeam(joinedArray1)) {
			if (includedInTeam(joinedArray2)) {
				bothTeamArray.push(team)
			} else {
				team1Array.push(team)
			}
		} else if (includedInTeam(joinedArray2)) {
			team2Array.push(team)
		} else {
			noneTeamArray.push(team)
		}
	}
}

team1Array
team2Array
bothTeamArray
console.log('🚀 ~ bothTeamArray:', bothTeamArray)
noneTeamArray

const total1 = (array1.length + (
	R.reduce((accumulator, team) => (accumulator + getMemberCount(array1, team.idArray)), 0)(team1Array)
))
const total2 = (array2.length + (
	R.reduce((accumulator, team) => (accumulator + getMemberCount(array2, team.idArray)), 0)(team2Array)
))

const lessArray = total1 < total2 ? array1 : array2
const moreArray = total1 < total2 ? array2 : array1
const lessTeamArray = total1 < total2 ? team1Array : team2Array
const moreTeamArray = total1 < total2 ? team2Array : team1Array
const lessTotal = total1 < total2 ? total1 : total2
const moreTotal = total1 < total2 ? total2 : total1
const allTotal = lessTotal + moreTotal

// ---

const numberOfNoneTeams = noneTeamArray.length

const numberOfNoneTeamsForLess = Math.max(
	1,
	// Todo: 이거 less에 대한 값이 너무 적어서 floor 대신 round로 바꿈. 나중에 그럴 수 있는 건지 확인해
	Math.round((lessTotal / allTotal) * numberOfNoneTeams),
)
const numberOfNoneTeamsForMore = numberOfNoneTeams - numberOfNoneTeamsForLess

const teamArrayForLess = R.concat(lessTeamArray, R.slice(0, numberOfNoneTeamsForLess)(noneTeamArray))
console.log('🚀 ~ teamArrayForLess:', teamArrayForLess)
const teamArrayForMore = R.concat(moreTeamArray, R.slice(numberOfNoneTeamsForLess, numberOfNoneTeams)(noneTeamArray))
console.log('🚀 ~ teamArrayForMore:', teamArrayForMore)

// ---

// Watch 팀이 균일하게 분배가 안됨 이유가 무엇인지 확인해야 함
const recursiveDistribution = (array, teamArray) => {
	// 종료 조건: 배열이 비었거나 더 이상 멤버를 수용할 수 있는 팀이 없을 때
	if (array.length === 0 || !teamArray.some(team => team.hasRoom())) {
		return teamArray
	}

	// 팀이 채워지는 순서는 해당 팀에 cohort의 인원이 얼마나 있느냐가 아니라, 일반적으로 어떤 팀의 빈자리가 더 많은지
	const greatestSlotTeam = getGreatestRemainingSlotTeam(teamArray.filter(team => team.hasRoom()))
	const targetIndex = teamArray.indexOf(greatestSlotTeam)

	// 새로운 팀 배열 생성
	const newTeamArray = create(teamArray, draft => {
		draft[targetIndex] = greatestSlotTeam.add(R.head(array))
	})

	// 첫 번째 요소를 제외한 나머지 배열로 재귀 호출
	return recursiveDistribution(R.tail(array), newTeamArray)
}

const newTeamArrayForLess = recursiveDistribution(lessArray, teamArrayForLess)
const newTeamArrayForMore = recursiveDistribution(moreArray, teamArrayForMore)

// ---

// cohort들에 중복해서 있는 멤버들 처리
// Fix: 나중에 if cohortArray.length === 2 추가
let newBothTeamArray = bothTeamArray
if (intersectionArray.length > 0) {
	newBothTeamArray = recursiveDistribution(intersectionArray, bothTeamArray)
}

// ---

const totalTeamArray = [].concat(newTeamArrayForLess, newTeamArrayForMore, newBothTeamArray)

if (totalTeamArray.length !== teams.numberOfTeams) {
	throw new Error('New teams must have the same number of teams')
}

// const resulttest = teams.map(R.identity)

// totalTeamArray.find(myTeam => myTeam.id === teams.teams[0].id)

// // Todo 팀의 id가 달라진거같은데?
// const findid = teams.teams[0].id
// const mapteam2 = teamArrayForLess.map(myTeam => myTeam.id)

// // Todo: 어디서 바뀐거?
// const mapteam = totalTeamArray.map(myTeam => myTeam.id)

const result = teams.map(originTeam => totalTeamArray.find(team => team.id === originTeam.id))

console.log('🚀 ~ result:', result/* ?+ */)

// ----------------------------------------------------------------
// ----------------------------------------------------------------

// const splitBetweenCohorts = R.curry(
// 	/**
// 	* @param {AllMembers} allMembers
// 	* @param {Cohort} cohort1
// 	* @param {Cohort} cohort2
// 	* @param {Teams} teams
// 	* @returns {Teams}
// 	*/
// 	(allMembers, cohort1, cohort2, teams) => {
