import * as R from 'ramda'
import { AllMembers, Member, Team, Teams } from './monads.js'

const teamArray = R.range(0, 10).map((_i) => Team.getDefaultTeam(10))
const roleArray = teamArray.flatMap((team) => team.roleArray)

const teams = Teams.of(teamArray)

const allMembers = AllMembers.of(R.range(0, 100).map((id) => Member.of(String(id))))
const cohort1 = allMembers.getCohort((member) => Number(member.id) % 2 === 0)
const cohort2 = allMembers.getCohort((member) => Number(member.id) % 5 === 0)
const cohorts = [cohort1, cohort2]

// todo 여기서 안되는 애들 rest로 빼는거 어케함?
class Chunk {
	/**
	 * @param {SubRoleSpace} subRoleSpace
	 * @param {Member[]} members
	 */
	constructor(subRoleSpace, members) {
		this.subRoleSpace = subRoleSpace
		this.members = R.uniq(members)
	}

	/**
	 * @param {SubRoleSpace} subRoleSpace
	 * @param {Member[]} members
	 * @returns {Chunk}
	 */
	static of(subRoleSpace, members) {
		return new Chunk(subRoleSpace, members)
	}

	/**
	 * @param {Chunk | Undefined | Null} otherChunk
	 * @returns {Chunk}
	 */
	concat(otherChunk) {
		if (!otherChunk) {
			return this
		}

		return new Chunk(
			this.subRoleSpace.concat(otherChunk.subRoleSpace),
			this.members.concat(otherChunk.members),
		)
	}

	/**
	 * @param {RoleSlots} roleSlots
	 * @param {Member[]} members
	 * @returns {[Chunk, Chunk]}
	 */
	divide(roleSlots, members) {
		const dividedRoleSlots = this.subRoleSpace.divide(roleSlots)
		const dividedMembers = this.members.filter((member) => !members.includes(member))
		return [new Chunk(dividedRoleSlots[0], members), new Chunk(dividedRoleSlots[1], dividedMembers)]
	}

	/** @returns {[Chunk, Chunk]} */
	drop() {
		const remaningRoleSlots = R.clone(this.subRoleSpace.roleSlots)
		const remainingMembers = [...this.members]
		for (const _i of this.members.keys()) {
			// eslint-disable-line sonarjs/sonar-no-unused-vars
			remaningRoleSlots.sort((a, b) => -1 * (a.slot - b.slot))
			const leastRoleSlot = remaningRoleSlots[0]
			if (leastRoleSlot.slot <= 0) {
				break
			}

			remainingMembers.shift()
			leastRoleSlot.slot -= 1
		}

		// @ts-ignore
		return this.divide(remaningRoleSlots, remainingMembers).reverse()
	}

	/**
	 * @param {Member[]} members
	 * @returns {Chunk}
	 */
	setMembers(members) {
		return new Chunk(this.subRoleSpace, members)
	}

	/**
	 * @param {number} start
	 * @param {number} end
	 * @returns {Chunk}
	 */
	slice(start, end, newMembers = this.members) {
		return new Chunk(this.subRoleSpace.slice(start, end), newMembers)
	}

	/** @returns {Error | true} */
	validate() {
		if (this.subRoleSpace.allSlots < this.members.length) {
			return new Error('Slot of roles must be greater than or equal to the number of members')
		}

		return true
	}
}

/**
 * @typedef {{ id: string; slot: number }} RoleSlot
 *
 * @typedef {RoleSlot[]} RoleSlots
 */
class SubRoleSpace {
	/**
	 * @class
	 * @param {RoleSlots} roleSlots
	 */
	constructor(roleSlots) {
		this.roleSlots = roleSlots
			.filter((roleSlot) => roleSlot.slot > 0)
			.sort((a, b) => a.slot - b.slot)
	}

	/**
	 * @param {RoleSlots} roleSlots
	 * @returns {SubRoleSpace}
	 */
	static of(roleSlots) {
		return new SubRoleSpace(roleSlots)
	}

	/**
	 * @param {SubRoleSpace} otherSubRoleSpace
	 * @returns {SubRoleSpace}
	 */
	concat(otherSubRoleSpace) {
		const newRoleSlots = R.clone(this.roleSlots)
		const otherRoleSlots = otherSubRoleSpace.roleSlots
		for (const currentRoleSlot of otherRoleSlots) {
			const matchedRoleSlot = newRoleSlots.find(
				(matchedRoleSlot) => matchedRoleSlot.id === currentRoleSlot.id,
			)
			if (matchedRoleSlot) {
				const matchedRoleSlotIndex = newRoleSlots.indexOf(matchedRoleSlot)
				newRoleSlots[matchedRoleSlotIndex] = {
					...matchedRoleSlot,
					slot: matchedRoleSlot.slot + currentRoleSlot.slot,
				}
			} else {
				newRoleSlots.push(currentRoleSlot)
			}
		}

		return new SubRoleSpace(newRoleSlots)
	}

	/**
	 * @param {RoleSlots} roleSlots
	 * @returns {[SubRoleSpace, SubRoleSpace]}
	 */
	divide(roleSlots) {
		return [
			new SubRoleSpace(roleSlots),
			new SubRoleSpace(
				roleSlots.map((roleSlot) => {
					const matchedRoleSlot = this.roleSlots.find(
						(matchedRoleSlot) => matchedRoleSlot.id === roleSlot.id,
					)

					if (matchedRoleSlot) {
						return { ...roleSlot, slot: matchedRoleSlot.slot - roleSlot.slot }
					}

					return roleSlot
				}),
			),
		]
	}

	/**
	 * @param {number} start
	 * @param {number} end
	 * @returns {SubRoleSpace}
	 */
	slice(start, end) {
		return new SubRoleSpace(this.roleSlots.slice(start, end))
	}

	/** @returns {number} */
	get allSlots() {
		return this.roleSlots.reduce((accumulator, current) => accumulator + current.slot, 0)
	}
}

// X 우선 cohort1과 cohort2 분리만 구현해보기 - 단 2개의 cohort / 1개의 규칙

const totalRoleSpace = SubRoleSpace.of(roleArray.map((role) => ({ id: role.id, slot: role.slot })))

const totalChunk = Chunk.of(totalRoleSpace, allMembers.members)
const validateResult = totalChunk.validate()
if (validateResult instanceof Error) {
	throw validateResult
}
// ----------------------------------------------------------------

// init
const currentChunk = totalChunk
const currentRoleSpace = currentChunk.subRoleSpace
if (currentChunk.members.length === 0) {
	throw new Error('members must be greater than 0')
}

if (currentRoleSpace.roleSlots.length === 0) {
	throw new Error('roleslots must be greater than 0')
}

const getRegularArray = R.pipe(
	R.filter((member) => allMembers.hasMember(member)),
	(array) => (Array.isArray(array) ? teams.removeDuplicateByThis(array) : array),
)

let regularMemberArrays = cohorts
	.map((cohort) => getRegularArray(cohort.joinedArray))
	.filter((array) => array.length > 0)
const flatDepthForMembers = 2
// if (regularArrays.every(array => array.length === 0)) {
// 	return teams
// }

const withoutFunctionArray = regularMemberArrays.map((array) => R.without(array))
for (const [i, array] of regularMemberArrays.entries()) {
	const currentWithoutFunctionArray = R.remove(Number(i), 1, withoutFunctionArray)
	// @ts-ignore
	regularMemberArrays[i] = R.pipe(...currentWithoutFunctionArray)(array)
}

regularMemberArrays.sort((a, b) => a.length - b.length)

const restMembers = allMembers.getRemainingMembers(regularMemberArrays.flat(flatDepthForMembers))

// 팀의 수가 sortedArrays의 elem 수보다 더 많은지 체크 - 만약 적다면 멤버 적은 코호트를 먼저 빼야함 = 인원 수 적은 코호트를 먼저 빼서 sortedArray의 elem 수를 팀 수로 맞추기
const roleCount = currentRoleSpace.roleSlots.length
const cohortCount = regularMemberArrays.length
if (cohortCount > roleCount) {
	const difference = currentRoleSpace.roleSlots.length - regularMemberArrays.length

	restMembers.push(...R.take(difference, regularMemberArrays).flat(flatDepthForMembers))
	regularMemberArrays = R.drop(difference, regularMemberArrays)
}

const counts = regularMemberArrays.map((array) => array.length)
const totalCount = counts.reduce((accumulator, current) => accumulator + current, 0)
const rawRations = regularMemberArrays.map((array) => array.length / totalCount)

let remainingCount = roleCount
const roleCountPerCohort = []
for (const [i] of regularMemberArrays.entries()) {
	// first cohort
	if (i === 0) {
		const currentRatio = rawRations[i]
		const currentRoleCount = Math.max(1, Math.floor(currentRatio * roleCount))
		roleCountPerCohort[i] = currentRoleCount
		remainingCount -= currentRoleCount
		continue
	}

	// last cohort
	if (i === cohortCount - 1) {
		roleCountPerCohort[i] = remainingCount
		continue
	}

	if (cohortCount - i === remainingCount) {
		roleCountPerCohort[i] = 1
		remainingCount -= 1
	} else {
		const currentRatio = rawRations[i]
		const currentRoleCount = Math.max(1, Math.floor(currentRatio * roleCount))
		roleCountPerCohort[i] = currentRoleCount
		remainingCount -= currentRoleCount
	}
}

const chunksForCohort = []
for (const [i, roleCount] of roleCountPerCohort.entries()) {
	const currentMembers = regularMemberArrays[i]

	if (i === 0) {
		chunksForCohort[i] = currentChunk.slice(0, roleCount, currentMembers)
		continue
	}

	const previousRoleCount = roleCountPerCohort[i - 1]
	chunksForCohort[i] = currentChunk.slice(
		previousRoleCount,
		previousRoleCount + roleCount,
		currentMembers,
	)
}

const [regularChunks, droppedChunks] = R.pipe(
	R.map((chunk) => chunk.drop()),
	R.transpose,
)(chunksForCohort)

// todo: @types/ramda 없애는 법 찾기 - 웬 AppData/Local/Microsoft/TypeScript/5.4/package.json 이런 폴더 있는데 어떻게 지움?

const restMemberChunk = R.reduce(
	(accumulator, chunk) => chunk.concat(accumulator),
	null,
	droppedChunks,
).setMembers(restMembers)

// const roleSlotsPerCohort = []
// for (const [i, array] of regularMemberArrays.entries()) {
// 	const currentRoleCount = roleCountPerCohort[i]
// 	if (i === 0) {
// 		roleSlotsPerCohort[i] = currentRoleSpace.slice(0, currentRoleCount)
// 		continue
// 	}

// 	const previousRoleCount = roleCountPerCohort[i - 1]
// 	roleSlotsPerCohort[i] = currentRoleSpace.slice(previousRoleCount, previousRoleCount + currentRoleCount)
// }

// todo drop drop concat Chunk 그다음 restMembers로 다시 만들기
// todo 이제 구해야 할 건, memberArray 당 roleSpace의 slot들의 숫자를 얼마나 가져가야 하나
// todo 여기서 결국 구해야 할 건 각 members에 대한 roleSpace들

// todo 나중에 나눠진 것들 다 합쳐서 다시 Teams로 만드는 함수는 모든 과정이 진행 된 후 따로 호출하게 하기
