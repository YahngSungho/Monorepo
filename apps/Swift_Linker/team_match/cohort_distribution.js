import * as R from 'ramda'
import {
	AllMembers, Cohort, Member, Team, Teams,
} from './monads.js'
import create from '@/utilities/libraries/mutative.js'

/**
 * @typedef {import('./monads.js').Id} Id
 */


// ---

const includedIn = R.curry((hasMemberId, idArray) => (idArray.some(id => hasMemberId(id))))

const getMemberCount = R.curry((idArray1, idArray2) => {
	return R.intersection(idArray1, idArray2).length
})

const getGreatestRemainingSlotTeam = R.reduce(R.maxBy(team => (team.getRemainingSlot())), {
	getRemainingSlot: () => 0,
	index: -1,
})

//---

const splitBetweenCohorts = R.curry(
	/**
	 * @param {AllMembers} allMembers
	 * @param {Cohort} cohort1
	 * @param {Cohort} cohort2
	 * @param {Teams} teams
	 * @returns {Teams}
	 */
	(allMembers, cohort1, cohort2, teams) => {
	// Todo 나중에 인자 cohorts 로 바꿔서 일반화

		const joinedArray1 = cohort1.getJoinedArray()
		const joinedArray2 = cohort2.getJoinedArray()

		const getRegularArray = R.pipe(
			// Todo: 이거 init 함수로 빼내서 pipe에서 가장 앞에 넣기
			R.filter(allMembers.hasMemberId),
			teams.removeDuplicateByThis,
		)
		let array1 = getRegularArray(joinedArray1)
		let array2 = getRegularArray(joinedArray2)
		// Todo: 중복되는 애들은 both가 있으면 거기에 넣고 아님 그냥 버리기 - 조합적 폭발을 생각해서 cohort 수가 2나 3일 때만 작동하고 아니면 걍 버려
		const intersectionArray = R.intersection(array1, array2)

		if (array1.length === 0 && array2.length === 0) {
			return teams
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
			const includedInTeam = includedIn(team.hasMemberId)
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
			Math.floor((lessTotal / allTotal) * numberOfNoneTeams),
		)
		const numberOfNoneTeamsForMore = numberOfNoneTeams - numberOfNoneTeamsForLess

		const teamArrayForLess = R.concat(lessTeamArray, R.slice(0, numberOfNoneTeamsForLess)(noneTeamArray))
		const teamArrayForMore = R.concat(moreTeamArray, R.slice(numberOfNoneTeamsForLess, numberOfNoneTeamsForMore)(noneTeamArray))

		// ---

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

		return teams.map(originTeam => totalTeamArray.find(team => team.id === originTeam.id))
	})

// splitBetweenCohorts 함수를 테스트하기 위한 함수
function testSplitBetweenCohorts() {
	// 테스트 데이터 생성
	const allMembers = AllMembers.of([
		new Member('1', { name: 'Alice' }),
		new Member('2', { name: 'Bob' }),
		new Member('3', { name: 'Charlie' }),
		new Member('4', { name: 'David' }),
		new Member('5', { name: 'Eve' }),
	])

	// splitBetweenCohorts 함수를 테스트하기 위한 필터 함수
	const filterFunction = member => member.properties.name.startsWith('A') || member.properties.name.startsWith('B')

	// Cohort 생성
	const cohort = allMembers.getCohort(filterFunction)

	// 결과 출력
	console.log('Filtered Cohort IDs:', cohort.getJoinedArray())

	// 경계값 테스트
	const emptyMembers = AllMembers.empty()
	const emptyCohort = emptyMembers.getCohort(() => true)
	console.log('Empty Cohort IDs:', emptyCohort.getJoinedArray())

	// 특수값 테스트
	const specialMembers = AllMembers.of([
		new Member('6', { age: 30, name: 'Alice' }),
		new Member('7', { age: 25, name: 'Bob' }),
	])
	const specialCohort = specialMembers.getCohort(member => member.properties.age > 20)
	console.log('Special Cohort IDs:', specialCohort.getJoinedArray())

	// splitBetweenCohorts 함수의 경계값 테스트
	const boundaryMembers = AllMembers.of([
		new Member('8', { name: 'Zara' }),
		new Member('9', { name: 'Yanni' }),
	])
	const boundaryCohort = boundaryMembers.getCohort(member => member.properties.name.startsWith('Z'))
	console.log('Boundary Cohort IDs:', boundaryCohort.getJoinedArray())

	// splitBetweenCohorts 함수의 취약한 지점 테스트
	const edgeCaseMembers = AllMembers.of([
		new Member('10', { name: 'Anna' }),
		new Member('11', { name: 'Anna' }),
	])
	const edgeCaseCohort = edgeCaseMembers.getCohort(member => member.properties.name === 'Anna')
	console.log('Edge Case Cohort IDs:', edgeCaseCohort.getJoinedArray())

	// splitBetweenCohorts 함수의 의외의 경우의 수 테스트
	const unexpectedMembers = AllMembers.of([
		new Member('12', { age: 30, name: 'Alice' }),
		new Member('13', { age: 25, name: 'Bob' }),
		new Member('14', { age: 35, name: 'Charlie' }),
	])
	const unexpectedCohort = unexpectedMembers.getCohort(member => member.properties.age < 30)
	console.log('Unexpected Cohort IDs:', unexpectedCohort.getJoinedArray())

	// splitBetweenCohorts 함수의 return 값을 조사하는 테스트
	const teams = Teams.of([
		new Team(['1', '2'], 3),
		new Team(['3'], 3),
		new Team([], 3),
	])

	const result = splitBetweenCohorts(allMembers, teams)
	console.log('Resulting Teams:', result.map(team => team.idArray))
}

// 테스트 함수 실행
testSplitBetweenCohorts()

// splitBetweenCohorts 함수를 시험해보기 위한 다양한 테스트 케이스
function testSplitBetweenCohorts2() {
	// 테스트 데이터 생성
	const allMembers = AllMembers.of([
		new Member('1', { name: 'Alice' }),
		new Member('2', { name: 'Bob' }),
		new Member('3', { name: 'Charlie' }),
		new Member('4', { name: 'David' }),
		new Member('5', { name: 'Eve' }),
	])

	// splitBetweenCohorts 함수를 테스트하기 위한 필터 함수
	const filterFunction = member => member.properties.name.startsWith('A') || member.properties.name.startsWith('B')

	// Cohort 생성
	const cohort = allMembers.getCohort(filterFunction)

	// 결과 출력
	console.log('Filtered Cohort IDs:', cohort.getJoinedArray())

	// 경계값 테스트
	const emptyMembers = AllMembers.empty()
	const emptyCohort = emptyMembers.getCohort(() => true)
	console.log('Empty Cohort IDs:', emptyCohort.getJoinedArray())

	// 특수값 테스트
	const specialMembers = AllMembers.of([
		new Member('6', { age: 30, name: 'Alice' }),
		new Member('7', { age: 25, name: 'Bob' }),
	])
	const specialCohort = specialMembers.getCohort(member => member.properties.age > 20)
	console.log('Special Cohort IDs:', specialCohort.getJoinedArray())

	// splitBetweenCohorts 함수의 경계값 테스트
	const boundaryMembers = AllMembers.of([
		new Member('8', { name: 'Zara' }),
		new Member('9', { name: 'Yanni' }),
	])
	const boundaryCohort = boundaryMembers.getCohort(member => member.properties.name.startsWith('Z'))
	console.log('Boundary Cohort IDs:', boundaryCohort.getJoinedArray())

	// splitBetweenCohorts 함수의 취약한 지점 테스트
	const edgeCaseMembers = AllMembers.of([
		new Member('10', { name: 'Anna' }),
		new Member('11', { name: 'Anna' }),
	])
	const edgeCaseCohort = edgeCaseMembers.getCohort(member => member.properties.name === 'Anna')
	console.log('Edge Case Cohort IDs:', edgeCaseCohort.getJoinedArray())

	// splitBetweenCohorts 함수의 의외의 경우의 수 테스트
	const unexpectedMembers = AllMembers.of([
		new Member('12', { age: 30, name: 'Alice' }),
		new Member('13', { age: 25, name: 'Bob' }),
		new Member('14', { age: 35, name: 'Charlie' }),
	])
	const unexpectedCohort = unexpectedMembers.getCohort(member => member.properties.age < 30)
	console.log('Unexpected Cohort IDs:', unexpectedCohort.getJoinedArray())

	// splitBetweenCohorts 함수의 return 값을 조사하는 테스트
	const teams = Teams.of([
		new Team(['1', '2'], 3),
		new Team(['3'], 3),
		new Team([], 3),
	])

	const result = splitBetweenCohorts(allMembers, teams)
	console.log('Resulting Teams:', result.map(team => team.idArray))
}

// 테스트 함수 실행
testSplitBetweenCohorts2()
