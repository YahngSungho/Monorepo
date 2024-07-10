// @ts-nocheck
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
// todo: 어떤 사람은 팀 두개에 들어간다 이런 경우도 있어야 함
const splitCohorts = R.curry(
	/**
	* @param {AllMembers} allMembers
	* @param {Cohort[]} cohorts
	* @param {Teams} teams
	* @returns {Teams}
	*/
	(allMembers, cohorts, teams) => {
		const getRegularArray = R.pipe(
			R.filter(id => allMembers.hasMemberId(id)),
			array => Array.isArray(array) ? teams.removeDuplicateByThis(array) : array,
		)

		const regularArrays = cohorts.map(cohort => getRegularArray(cohort.getJoinedArray()))

		if (regularArrays.every(array => array.length === 0)) {
			return teams
		}

		const withoutArrays = regularArrays.map(array => (R.without(array)))

		const uniqArrays = []
		for (const [i, array] of regularArrays.entries()) {
			const currentWithout = R.remove(i, 1, withoutArrays)

			uniqArrays[i] = R.pipe(...currentWithout)(array)
		}

		// ---

		let counts = uniqArrays.map(array => (array.length))
		const minCount = Math.min(...counts)
		counts = counts.map(count => Math.round(count / minCount))

		const remainderArrays = regularArrays.map((array, i) => (R.remove(i, 1, regularArrays).flat()))

		const temporaryArrays = R.clone(uniqArrays)

		const temporaryTeamArray = [...(teams.teamArray)]

		while (
			temporaryArrays.some(array => array.length > 0)
			&& temporaryTeamArray.some(team => team.hasRoom())
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
					const teamWithRoomArray = temporaryTeamArray.filter(team => team.hasRoom())
					if (teamWithRoomArray.length === 0) {
						break
					}

					const minTeam = R.reduce(R.minBy(team => (R.intersection(team.idArray, currentRemainders))), teamWithRoomArray[0], teamWithRoomArray)
					const minValue = R.intersection(minTeam.idArray, minTeam)
					const minTeams = R.filter(team => ((R.intersection(team.idArray, currentRemainders)) === (minValue)), teamWithRoomArray)

					// X 여기가 depth vs breadth 가리는 부분
					let targetTeam = minTeam
					if (minTeams.length >= 2) {
						targetTeam = R.reduce(R.maxBy(team => (team.getRemainingSlot())), minTeams[0], minTeams)
					}

					const targetndex = temporaryTeamArray.indexOf(targetTeam)
					temporaryTeamArray[targetndex] = targetTeam.add(R.head(temporaryArray))
					temporaryArray = R.tail(temporaryArray)
					temporaryArrays[i] = temporaryArray
				}
			}
		}

		return new Teams(temporaryTeamArray)
	})

// ----------------------------------------------------------------

// test

const allMembers = AllMembers.of(R.range(0, 50).map(id => new Member(String(id))))
const cohort1 = allMembers.getCohort(member => Number(member.id) % 2 === 0)
const cohort2 = allMembers.getCohort(member => Number(member.id) % 3 === 0)
const cohorts = [cohort1, cohort2]
// const teams = Teams.of([
// 	Team.of(allMembers.getIdArray(member => Number(member.id) % 8 === 0), 20),
// 	Team.of(allMembers.getIdArray(member => Number(member.id) % 9 === 0 && Number(member.id) !== 0), 30),
// ], [20, 30])
// const teams = Teams.empty([10, 10, 10, 10, 10])
const teams = Teams.init([['1', '2'], ['3', '6'], ['7', '8', '9']], [10, 10, 10])

// ----------------------------------------------------------------

splitCohorts(allMembers, cohorts, teams)/* ?+. */
