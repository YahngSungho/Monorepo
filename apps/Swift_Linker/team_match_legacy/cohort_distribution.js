// @ts-nocheck
import * as R from 'ramda'
import { AllMembers, Cohort, Member, Team, Teams } from './monads.js'

/**
 * @typedef {import('./monads.js').Id} Id
 */

// ---
const includedIn = R.curry((hasMemberId, idArray) => idArray.some((id) => hasMemberId(id)))

const getMemberCount = R.curry((idArray1, idArray2) => R.intersection(idArray1, idArray2).length)

const getGreatestRemainingSlotTeam = R.reduce(
	R.maxBy((team) => team.getRemainingSlot()),
	{
		getRemainingSlot: () => 0,
		index: -1,
	},
)

// ---
// todo: 어떤 사람은 팀 두개에 들어간다 이런 경우도 있어야 함 -> 이거 teams를 두개 쓰는 걸로 되나?
const splitCohorts = R.curry(
	/**
	 * @param {AllMembers} allMembers
	 * @param {Cohort[]} cohorts
	 * @param {Teams} teams
	 * @returns {Teams}
	 */
	(allMembers, cohorts, teams) => {
		const getRegularArray = R.pipe(
			R.filter((id) => allMembers.hasMemberId(id)),
			(array) => (Array.isArray(array) ? teams.removeDuplicateByThis(array) : array),
		)

		const regularArrays = cohorts.map((cohort) => getRegularArray(cohort.getJoinedArray()))

		if (regularArrays.every((array) => array.length === 0)) {
			return teams
		}

		const withoutFunctionArray = regularArrays.map((array) => R.without(array))

		const uniqArrays = []
		for (const [i, array] of regularArrays.entries()) {
			const currentWithoutFunctionArray = R.remove(i, 1, withoutFunctionArray)

			uniqArrays[i] = R.pipe(...currentWithoutFunctionArray)(array)
		}

		// ---

		// todo: 인원 많은 쪽이 적은 쪽의 팀을 너무 침입한다 - 역시 코호트 별로 배정될 수 있는 팀들을 나눠야겠음

		// unqArray를 length 작은 쪽부터 정렬 - 문제는 remainderArrays -> 이거 먼저 구하고 순서 바꿔진 거에 따라서 순서 바꿔...
		const sortedIndices = uniqArrays
			.map((array, index) => ({ array, index }))
			.sort((a, b) => a.array.length - b.array.length)
			.map((item) => item.index)

		const sortedArrays = sortedIndices.map((index) => uniqArrays[index])
		let counts = sortedArrays.map((array) => array.length)
		const minCount = Math.min(...counts)
		counts = counts.map((count) => Math.max(1, Math.floor(count / minCount)))

		const temporaryArrays = R.clone(sortedArrays)

		const remainderArrays = regularArrays.map((array, i) => R.remove(i, 1, regularArrays).flat())
		const sortedRemainderArrays = sortedIndices.map((index) => remainderArrays[index])

		// todo: 인원 0인 array 제거 - 대응하는 배열들에서 다 제거

		const temporaryTeamArray = [...teams.teamArray]

		// todo: 적은 쪽부터 팀 하나씩 줘.
		// ---

		while (
			temporaryArrays.some((array) => array.length > 0) &&
			temporaryTeamArray.some((team) => team.hasRoom())
		) {
			for (const [i, currentArray] of temporaryArrays.entries()) {
				if (currentArray.length === 0) {
					continue
				}

				let temporaryArray = R.clone(currentArray)
				const currentRemainders = remainderArrays[i]
				const currentCount = counts[i]
				for (const key of R.range(0, currentCount)) {
					if (temporaryArray.length === 0) {
						break
					}

					// X 여기가 rigid 가리는 부분
					const teamWithRoomArray = temporaryTeamArray.filter((team) => team.hasRoom())
					if (teamWithRoomArray.length === 0) {
						break
					}

					const minTeam = R.reduce(
						R.minBy((team) => R.intersection(team.idArray, currentRemainders)),
						teamWithRoomArray[0],
						teamWithRoomArray,
					)
					const minValue = R.intersection(minTeam.idArray, minTeam)
					const minTeams = R.filter(
						(team) => R.intersection(team.idArray, currentRemainders) === minValue,
						teamWithRoomArray,
					)

					// X 여기가 depth vs breadth 가리는 부분
					let targetTeam = minTeam
					if (minTeams.length >= 2) {
						targetTeam = R.reduce(
							R.maxBy((team) => team.getRemainingSlot()),
							minTeams[0],
							minTeams,
						)
					}

					const targetndex = temporaryTeamArray.indexOf(targetTeam)
					temporaryTeamArray[targetndex] = targetTeam.add(R.head(temporaryArray))
					temporaryArray = R.tail(temporaryArray)
					temporaryArrays[i] = temporaryArray
				}
			}
		}

		return new Teams(temporaryTeamArray)
	},
)

// ----------------------------------------------------------------

// test

const allMembers = AllMembers.of(R.range(0, 500).map((id) => new Member(String(id))))
const cohort1 = allMembers.getCohort((member) => Number(member.id) % 2 === 0)
const cohort2 = allMembers.getCohort((member) => Number(member.id) % 5 === 0)
const cohorts = [cohort1, cohort2]
// const teams = Teams.of([
// 	Team.of(allMembers.getIdArray(member => Number(member.id) % 8 === 0), 20),
// 	Team.of(allMembers.getIdArray(member => Number(member.id) % 9 === 0 && Number(member.id) !== 0), 30),
// ], [20, 30])
// const teams = Teams.empty([10, 10, 10, 10, 10])
const teams = Teams.init(
	[
		['1', '2'],
		['3', '6'],
		['7', '8', '9'],
	],
	[10, 10, 10],
)

// ----------------------------------------------------------------

splitCohorts(allMembers, cohorts, teams) /* ?+. */
