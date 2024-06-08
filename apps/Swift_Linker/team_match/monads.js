import util, { inspect } from 'node:util'
import { nanoid } from 'nanoid'
import * as R from 'ramda'
import { areAllDisjoint } from '../utilities/functions/utilities.js'
import { shuffleArray } from '@/projects/Swift_Linker/team_match/random_engine.js'
import create from '@/utilities/libraries/mutative.js'



export {
	AllMembers, Cohort, Member, Team, Teams,
}

// ----------------------------------------------------------------------------------------

/**
 * @typedef {string} Id
 */


// ----------------------------------------------------------------------------------------
class Member {
	/**
	 * @param {Id} id
	 * @param {Object} properties
	 */
	// Fix 인자 순서 바꿔. 그리고 id default는 nanoid
	constructor(id, properties = {}) {
		this.id = id
		this.properties = properties
	}

	/**
	 * @param {Id} id
	 * @param {Object} properties
	 */
	static of(id, properties) {
		return new Member(id, properties)
	}
}


class AllMembers {
	/**
	 * @param {Array<Member>} members
	 */
	constructor(members) {
		this.members = members
	}

	static empty() {
		return new AllMembers([])
	}

	/**
	 * @param {Array<Member>} members
	 */
	static of(members) {
		return new AllMembers(members)
	}

	/**
	* @param {Member} member
	* @returns {AllMembers}
	*/
	add(member) {
		return new AllMembers(create(this.members, draft => {
			draft.push(member)
		}))
	}

	/**
	* @param {Array<Member>} members
	* @returns {AllMembers}
	*/
	addMembers(members) {
		return new AllMembers([...this.members, ...members])
	}

	/**
	 * @param {AllMembers} other
	 * @returns {AllMembers}
	 */
	concat(other) {
		return new AllMembers([...this.members, ...other.members])
	}

	/**
	 * @param {(val: Member) => Boolean} filterF
	 * @returns {Cohort}
	 */
	getCohort(filterF) {
		return new Cohort(this.members.filter(filterF).map(member => (member.id)))
	}

	/**
	 * @param {Teams} teams
	 * @returns {AllMembers}
	 */
	getRemainingMembers(teams) {
		return new AllMembers(this.members.filter(member => !teams.teams.some(team => team.hasMemberId(member.id))))
	}

	/**
	 * @param {Id} id
	 * @returns {boolean}
	 */
	hasMemberId(id) {
		return this.members.some(member => member.id === id)
	}


	/**
	 * @returns {AllMembers}
	 */
	shuffle() {
		return new AllMembers(shuffleArray(this.members))
	}
}

/**
 * @class Cohort
 * @template idOrCohortArray
 * @description 중첩된 Cohort join 가능
 */
class Cohort {
	/**
	 * @param {Array<Id | Cohort>} idOrCohortArray
	 */
	constructor(idOrCohortArray) {
		this.idOrCohortArray = R.uniq(idOrCohortArray)
	}

	static empty() {
		return new Cohort([])
	}


	/**
	 * @param {Array<Id | Cohort>} idOrCohortArray
	 * @returns {Cohort}
	 */
	static of(idOrCohortArray) {
		return new Cohort(idOrCohortArray)
	}


	/**
	 * @param {Id | Cohort} member
	 * @returns {Cohort}
	 */
	add(member) {
		return new Cohort(create(this.idOrCohortArray, draft => {
			draft.push(member)
		}))
	}

	/**
	 * @param {Array<Id | Cohort>} idOrCohortArray
	 * @returns {Cohort}
	 */
	addMembers(idOrCohortArray) {
		return new Cohort([...this.idOrCohortArray, ...idOrCohortArray])
	}

	/**
	 * @returns {Array<Id>}
	 */
	getJoinedArray() {
		return Array.from(this.idOrCohortArray).flatMap(idOrCohort => {
			if (idOrCohort instanceof Cohort) {
				if (idOrCohort === this) {
					return []
				}

				return idOrCohort.getJoinedArray()
			}

			return idOrCohort
		})
	}

	/**
	 * @returns {Array<Id | Cohort>}
	 */
	getValue() {
		return this.idOrCohortArray
	}

	/**
	 * @param {Id[]} team
	 * @returns {boolean}
	 */
	includedIn(team) {
		return this.join().array.some((/** @type {string} */ id) => typeof id === 'string' && team.includes(id))
	}


	/**
	 * @returns {Cohort<Array<Id>>}
	 */
	join() {
		return new Cohort(this.getJoinedArray())
	}

	/**
	 * @returns {{ id: Id, Cohort: Cohort<Array<Id>> }}
	 */
	pop() {
		const array = R.clone(this.join().array)

		if (array.length === 0) {
			return { Cohort: this, id: null }
		}

		const id = array.pop()
		if (typeof id !== 'string') {
			throw new TypeError('This is not an id')
		}

		return { Cohort: new Cohort(array), id }
	}

	[util.inspect.custom]() {
		return `Cohort(${inspect(this.idOrCohortArray)})`
	}


	get array() {
		return this.idOrCohortArray
	}

	get isCohort() {
		return true
	}

	get size() {
		return this.join().array.length
	}
}


class Team {
	/**
	 * @param {Id[]} memberIds
	 * @param {number} slotFixed
	 */
	constructor(memberIds, slotFixed) {
		this.slotFixed = slotFixed
		this.memberIds = R.uniq(memberIds)
		this.id = nanoid()

		if (slotFixed < this.memberIds.length) {
			throw new Error('The number of members must be less than or equal to the slots')
		}
	}

	/**
	 * @param {number} slotFixed
	 * @returns {Team}
	 */
	static empty(slotFixed) {
		if (typeof slotFixed !== 'number' || slotFixed < 0) {
			throw new Error('Slot fixed must be a positive number')
		}

		return new Team([], slotFixed)
	}

	/**
	 * @param {Id[]} memberIds
	 * @param {number} slotFixed
	 * @returns {Team}
	 */
	static of(memberIds, slotFixed) {
		return new Team(memberIds, slotFixed)
	}

	/**
	 * @param {Id} id
	 * @returns {Team}
	 */
	add(id) {
		return new Team([...this.memberIds, id], this.slotFixed)
	}

	/**
	 * @param {Team} otherTeam
	 * @returns {Team}
	 */
	concat(otherTeam) {
		if (this.slotFixed !== otherTeam.slotFixed) {
			throw new Error('The number of slots must be the same')
		}

		return new Team([...this.memberIds, ...otherTeam.memberIds], this.slotFixed)
	}

	getRemainingSlot() {
		return this.slotFixed - this.memberIds.length
	}

	/**
	 * @param {Id} id
	 * @returns {boolean}
	 */
	hasMemberId(id) {
		return this.memberIds.includes(id)
	}

	/**
	 * @returns {boolean}
	 */
	hasRoom() {
		return this.slotFixed > this.memberIds.length
	}

	/**
	 * @param {(value: string, index: number, array: string[]) => string} f
	 */
	map(f) {
		return new Team(this.memberIds.map(f), this.slotFixed)
	}

	/**
	 * @param {Id[]} otherMemberIds
	 * @returns {Team}
	 */
	update(otherMemberIds) {
		return new Team([...this.memberIds, ...otherMemberIds], this.slotFixed)
	}

	[util.inspect.custom]() {
		return `Team(${inspect(this.memberIds)}, ${inspect(this.slotFixed)})`
	}

	/**
	 * @returns {Id[]}
	 */
	get idArray() {
		return this.memberIds
	}
}

/**
 * @class Teams
 * @description 팀들에 나눠서 column 단위로 concat으로 추가 가능
 */
class Teams {
	/**
	* @param {Array<Team>} teams
	* @param {Array<number>} slots 팀별 남은 자리
	 */
	constructor(teams, slots = teams.map(team => (team.slotFixed))) {
		if (slots.length !== teams.length) {
			throw new Error('Slots must be the same length as number of teams')
		}

		if (!Array.isArray(teams)) {
			throw new TypeError('Teams must be an array')
		}

		if (!areAllDisjoint(teams.map(team => team.idArray))) {
			throw new Error('Teams must be disjoint')
		}

		this.teams = teams
		this.slots = slots
	}

	/**
	 * @param {number[]} slots
	 * @param {Array<number>} slots
	 * @returns {Teams}
	 */
	static empty(slots) {
		return new Teams(R.range(0, slots.length).map((n, i) => Team.empty(slots[i])), slots)
	}

	/**
	 * @static
	 * @param {Array<Array<Id>>} idArrayArray
	 * @param {Array<number>} slots
	 * @returns {Teams}
	 */
	static init(idArrayArray, slots) {
		return new Teams(idArrayArray.map((idArray, i) => Team.of(idArray, slots[i])), slots)
	}

	/**
	 * @param {Array<Team>} teams
	 * @param {number[]} [slots]
	 */
	static of(teams, slots) {
		return new Teams(teams, slots)
	}


	/**
	 * @param {Id} id
	 * @returns {boolean}
	 */
	alreadyJoined(id) {
		return this.teams.some(team => team.hasMemberId(id))
	}

	/**
	 * @param {Teams} otherTeams
	 * @returns {Teams}
	 */
	concat(otherTeams) {
		if (this.numberOfTeams !== otherTeams.numberOfTeams) {
			throw new Error('Teams must have the same number of teams')
		}

		if (this.slots !== otherTeams.slots) {
			throw new Error('Slots must be the same')
		}

		const newTeams = this.teams.map((team, index) => team.concat(otherTeams.teams[index]))

		return new Teams(newTeams, this.slots)
	}

	/**
	 * @returns {Array<Id>}
	 */
	getAllTeamMembers() {
		return this.teams.flatMap(team => team.idArray)
	}


	/**
	 * @returns {Array<number>}
	 */
	getRemainingSlots() {
		return this.teams.map(team => (team.getRemainingSlot()))
	}

	/**
	 * @param {(value: Team, index: number, array: Team[]) => Team} f
	 * @returns {Teams}
	 */
	map(f) {
		return new Teams(this.teams.map(f), this.slots)
	}


	/**
	 * @type {(idArray: Array<Id>) => Array<Id>}
	 */
	removeDuplicateByThis(idArray) {
		return R.without(this.getAllTeamMembers(), idArray)
	}

	/**
	 * @param {number[]} slots
	 */
	setSlots(slots) {
		if (this.teams.length !== slots.length) {
			throw new Error('Slots must be the same length as number of teams')
		}

		return new Teams(this.teams, slots)
	}

	/**
	 * @param {Array<Team>} nextTeams
	 */
	update(nextTeams) {
		return this.concat(Teams.of(nextTeams))
	}

	[util.inspect.custom]() {
		return `Teams(${inspect(this.teams)}, ${inspect(this.slots)})`
	}

	/**
	 * @returns {number}
	 */
	get numberOfTeams() {
		if (this.teams.length !== this.slots.length) {
			throw new Error('Teams must have the same number of slots')
		}

		return this.teams.length
	}
}
