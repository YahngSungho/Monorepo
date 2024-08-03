import util, { inspect } from 'node:util'
import create from '@repo/library_wrappers/mutative'
import { unsafe } from 'mutative'
import { nanoid } from 'nanoid'
import * as R from 'ramda'
import { areAllDisjoint, areDisjoint } from '../utilities/functions/utilities.js'
import { shuffleArray } from './random_engine.js'

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
	constructor(id = nanoid(), properties = {}) {
		this.id = id
		this.properties = properties
		this.type = 'Member'
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
		this.type = 'AllMembers'
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
		return new AllMembers(create(this.members, draft => {
			draft.push(...members)
		}))
	}

	/**
	 * @param {AllMembers} other
	 * @returns {AllMembers}
	 */
	concat(other) {
		return new AllMembers(create(this.members, draft => {
			draft.push(...other.members)
		}))
	}

	/**
	 * @param {(val: Member) => Boolean} filterF
	 * @returns {Cohort}
	 */
	getCohort(filterF) {
		return new Cohort(this.members.filter(filterF))
	}

	/**
	 * @param {Teams} teams
	 * @returns {Member[]}
	 */
	getRemainingMembers(teams) {
		return this.members.filter(member => !teams.hasMember(member))
	}

	/**
	 * @param {Member} member
	 * @returns {boolean}
	 */
	hasMember(member) {
		return this.members.includes(member)
	}

	/**
	 * @returns {AllMembers}
	 */
	shuffle() {
		return new AllMembers(create(this.members, draft => {
			unsafe(() => {
				shuffleArray(draft)
			})
		}))
	}
}

/**
 * @class Cohort
 * @template memberOrCohortArray
 * @description 중첩된 Cohort join 가능
 */
class Cohort {
	/**
	 * @param {Array<Member | Cohort>} memberOrCohortArray
	 */
	constructor(memberOrCohortArray) {
		this.memberOrCohortArray = R.uniq(memberOrCohortArray)
		this.type = 'Cohort'
	}

	static empty() {
		return new Cohort([])
	}

	// fix 타입을 다 Member | Cohort로 바꿔

	/**
	 * @param {Array<Member | Cohort>} memberOrCohortArray
	 * @returns {Cohort}
	 */
	static of(memberOrCohortArray) {
		return new Cohort(memberOrCohortArray)
	}

	/**
	 * @param {Member | Cohort} memberOrCohort
	 * @returns {Cohort}
	 */
	add(memberOrCohort) {
		return new Cohort(create(this.memberOrCohortArray, draft => {
			draft.push(memberOrCohort)
		}))
	}

	/**
	 * @param {Array<Member | Cohort>} memberOrCohortArray
	 * @returns {Cohort}
	 */
	addMemberOrCohortArray(memberOrCohortArray) {
		return new Cohort(create(this.memberOrCohortArray, draft => {
			draft.push(...memberOrCohortArray)
		}))
	}

	/**
	 * @returns {Cohort<Array<Member>>}
	 */
	join() {
		return new Cohort(this.joinedArray)
	}

	[util.inspect.custom]() {
		return `Cohort(${inspect(this.memberOrCohortArray)})`
	}

	get array() {
		return this.memberOrCohortArray
	}

	/**
	 * @returns {Array<Member>}
	 */
	get joinedArray() {
		if (!Array.isArray(this.memberOrCohortArray)) {
			throw new TypeError('Cohort must be an array')
		}

		return R.uniq(this.memberOrCohortArray.flatMap(memberOrCohort => {
			if (memberOrCohort instanceof Cohort) {
				if (memberOrCohort === this) {
					return []
				}

				return memberOrCohort.joinedArray
			}

			return memberOrCohort
		}))
	}

	get numberOfMembers() {
		return this.joinedArray.length
	}
}

// todo 중복 안되는 role 끼리 중복인지 검사
class Role {
	/**
	 * @param {Member[]} members
	 * @param {number} slot
	 * @param {string|null} name
	 */
	constructor(members, slot, name = null, id = nanoid()) {
		if (slot < members.length) {
			throw new Error('The number of members must be less than or equal to the slots')
		}

		this.name = name
		this.slot = slot
		this.members = R.uniq(members)
		this.id = id
		this.type = 'Role'
	}

	/**
	 * @param {string|null} name
	 * @param {number} slot
	 * @returns {Role}
	 */
	static empty(slot, name = null) {
		if (typeof slot !== 'number' || slot < 0) {
			throw new Error('Slot fixed must be a positive number')
		}

		return new Role([], slot, name)
	}

	/**
	 * @param {string|null} name
	 * @param {Member[]} members
	 * @param {number} slot
	 * @returns {Role}
	 */
	static of(members, slot, name = null, id = nanoid()) {
		return new Role(members, slot, name, id)
	}

	/**
	 * @param {Member} member
	 * @returns {Role}
	 */
	add(member) {
		return new Role(create(this.members, draft => {
			draft.push(member)
		}), this.slot, this.name, this.id)
	}

	/**
	 * @param {Member[]} otherMembers
	 * @returns {Role}
	 */
	addMembers(otherMembers) {
		return new Role(create(this.members, draft => {
			draft.push(...otherMembers)
		}), this.slot, this.name, this.id)
	}

	/**
	 * @param {Role} otherRole
	 * @returns {Role}
	 */
	concat(otherRole) {
		if (this.slot !== otherRole.slot) {
			throw new Error('The number of slots must be the same')
		}

		return new Role(create(this.members, draft => {
			draft.push(...otherRole.members)
		}), this.slot, this.name, this.id)
	}

	/**
	 * @param {Member} member
	 * @returns {boolean}
	 */
	hasMember(member) {
		return this.members.includes(member)
	}

	/**
	 * @returns {boolean}
	 */
	hasRoom() {
		return this.slot > this.members.length
	}

	/**
	 * @param {(value: Member, index: number, array: Member[]) => Member} f
	 */
	map(f) {
		return new Role(this.members.map(f), this.slot, this.name, this.id)
	}

	[util.inspect.custom]() {
		return `Role(${inspect(this.name)}, ${inspect(this.members)}, ${inspect(this.slot)}, ${inspect(this.id)})`
	}

	/**
	 * @returns {number}
	 */
	get remainingSlot() {
		return this.slot - this.members.length
	}
}

class Team {
	/**
	 * @param {Role[]} roleArray
	 * @param {string|null} id
	 */
	constructor(roleArray, id = nanoid()) {
		if (!areDisjoint(roleArray.map(role => role.name))) {
			throw new Error('Roles must have unique names')
		}

		this.roleArray = roleArray
		this.id = id
		this.type = 'Team'
	}

	static empty() {
		return new Team([])
	}

	/**
	 * @param {number} slot
	 */
	static getDefaultTeam(slot) {
		// todo role의 slot 수는 어떻게 설정됨?
		return new Team([Role.of([], slot)])
	}

	/**
	 * @param {Role[]} roleArray
	 * @param {string|null} id
	 */
	static of(roleArray, id = nanoid()) {
		return new Team(roleArray, id)
	}

	/**
	 * @param {Role} role
	 */
	add(role) {
		return new Team(create(this.roleArray, draft => {
			draft.push(role)
		}), this.id)
	}

	/**
	 * @param {Team} otherTeam
	 */
	concat(otherTeam) {
		return new Team(create(this.roleArray, draft => {
			draft.push(...otherTeam.roleArray)
		}), this.id)
	}

	/**
	 * @param {Id} id
	 */
	getRoleById(id) {
		return this.roleArray.find((/** @type {{ id: Id; }} */ role) => role.id === id)
	}

	/**
	 * @param {Member} member
	 * @returns {boolean}
	 */
	hasMember(member) {
		return this.roleArray.some(role => role.hasMember(member))
	}

	/**
 * @returns {boolean}
 */
	hasRoom() {
		return this.roleArray.some((/** @type {{ hasRoom(): boolean; }} */ role) => role.hasRoom())
	}

	[util.inspect.custom]() {
		return `Team(${inspect(this.roleArray)}, ${inspect(this.id)})`
	}

	/**
	 * @returns {Member[]}
	 */
	get members() {
		return this.roleArray.flatMap(role => role.members)
	}

	/**
	 * @returns {number}
	 */
	get remainingSlot() {
		return this.roleArray.map(role => role.remainingSlot).reduce((a, b) => a + b, 0)
	}
}

/**
 * @class Teams
 * @description 팀들에 나눠서 column 단위로 concat으로 추가 가능
 */
class Teams {
	/**
	* @param {Array<Team>} teamArray
	 */
	constructor(teamArray, id = nanoid()) {
		if (!Array.isArray(teamArray)) {
			throw new TypeError('Teams must be an array')
		}

		if (!areDisjoint(teamArray)) {
			throw new Error('Teams must be disjoint')
		}

		this.teamArray = teamArray
		this.id = id
		this.type = 'Teams'
	}

	/**
	 * @returns {Teams}
	 */
	static empty() {
		return new Teams([])
	}

	/**
	 * @param {Array<Team>} teamArray
	 */
	static of(teamArray) {
		return new Teams(teamArray)
	}

	/**
	 * @param {Teams} otherTeams
	 * @returns {Teams}
	 */
	concat(otherTeams) {
		return new Teams(create(this.teamArray, draft => {
			draft.push(...otherTeams.teamArray)
		}))
	}

	/**
	 * @param {Member} member
	 * @returns {boolean}
	 */
	hasMember(member) {
		return this.teamArray.some(team => team.hasMember(member))
	}

	/**
	 * @param {(value: Team, index: number, array: Team[]) => Team} f
	 * @returns {Teams}
	 */
	map(f) {
		return new Teams(this.teamArray.map(f))
	}

	/**
	 * @type {(memberArray: Array<Member>) => Array<Member>}
	 */
	removeDuplicateByThis(memberArray) {
		if (!memberArray) {
			return []
		}

		return R.difference(memberArray, this.getAllMembers())
	}

	[util.inspect.custom]() {
		return `Teams(${inspect(this.teamArray)}, ${inspect(this.id)})`
	}

	/**
	 * @returns {Member[]}
	 */
	get members() {
		return this.teamArray.flatMap(team => team.members())
	}

	/**
	 * @returns {number}
	 */
	get remainingSlot() {
		return this.teamArray.map(team => team.remainingSlot).reduce((a, b) => a + b, 0)
	}
}
