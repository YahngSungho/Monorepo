import { inspect } from 'node:util'
import { fc, it } from '@fast-check/vitest'
import { describe, expect } from 'vitest'
import { AllMembers, Cohort, Member, Role, Team, Teams } from './monads.js'

describe('AllMembers', () => {
	// Creating an empty AllMembers instance using the static empty method
	it('빈 인스턴스 생성', () => {
		const emptyAllMembers = AllMembers.empty()
		expect(emptyAllMembers.members).toEqual([])
		expect(emptyAllMembers.type).toBe('AllMembers')
	})

	// Creating an AllMembers instance with a predefined array of members using the static of method
	it('미리 정의된 멤버 배열로 인스턴스 생성', () => {
		const members = [Member.of('1', { name: 'Alice' }), Member.of('2', { name: 'Bob' })]
		const allMembers = AllMembers.of(members)
		expect(allMembers.members).toEqual(members)
		expect(allMembers.type).toBe('AllMembers')
	})

	// Adding a single member to an AllMembers instance using the add method
	it('단일 멤버 추가', () => {
		const members = [Member.of('1', { name: 'Alice' })]
		const allMembers = AllMembers.of(members)
		const newMember = Member.of('2', { name: 'Bob' })
		const updatedAllMembers = allMembers.add(newMember)
		expect(updatedAllMembers.members).toContain(newMember)
	})

	// Adding multiple members to an AllMembers instance using the addMembers method
	it('다수 멤버 추가', () => {
		const members = [Member.of('1', { name: 'Alice' })]
		const allMembers = AllMembers.of(members)
		const newMembers = [Member.of('2', { name: 'Bob' }), Member.of('3', { name: 'Charlie' })]
		const updatedAllMembers = allMembers.addMembers(newMembers)
		expect(updatedAllMembers.members).toEqual(expect.arrayContaining(newMembers))
	})

	// Concatenating two AllMembers instances using the concat method
	it('두 인스턴스 병합', () => {
		const members1 = [Member.of('1', { name: 'Alice' })]
		const members2 = [Member.of('2', { name: 'Bob' })]
		const allMembers1 = AllMembers.of(members1)
		const allMembers2 = AllMembers.of(members2)
		const concatenatedAllMembers = allMembers1.concat(allMembers2)
		expect(concatenatedAllMembers.members).toEqual(
			expect.arrayContaining([...members1, ...members2]),
		)
	})

	// Filtering members to create a Cohort using the getCohort method
	it('필터링으로 코호트 생성', () => {
		const members = [Member.of('1', { name: 'Alice' }), Member.of('2', { name: 'Bob' })]
		const allMembers = AllMembers.of(members)
		const cohort = allMembers.getCohort((member) => member.properties.name === 'Alice')
		expect(cohort.array).toEqual([members[0]])
	})

	// Checking if a member exists in the AllMembers instance using the hasMember method
	it('멤버 존재 확인', () => {
		const members = [Member.of('1', { name: 'Alice' })]
		const allMembers = AllMembers.of(members)
		expect(allMembers.hasMember(members[0])).toBe(true)
	})

	// Shuffling the members in an AllMembers instance using the shuffle method
	it('멤버 셔플링', () => {
		const members = [
			Member.of('1', { name: 'Alice' }),
			Member.of('2', { name: 'Bob' }),
			Member.of('3', { name: 'Charlie' }),
		]
		const allMembers = AllMembers.of(members)
		const shuffledAllMembers = allMembers.shuffle()
		expect(shuffledAllMembers.members).toHaveLength(3)
		expect(shuffledAllMembers.members).toEqual(expect.arrayContaining(members))
	})

	// Getting remaining members not in any team using the getRemainingMembers method
	it('남은 멤버 가져오기', () => {
		const members = [Member.of('1', { name: 'Alice' }), Member.of('2', { name: 'Bob' })]
		const allMembers = AllMembers.of(members)
		const teams = Teams.empty()
		const remainingMembers = allMembers.getRemainingMembers(teams)
		expect(remainingMembers).toEqual(members)
	})

	// Adding a member that already exists in the AllMembers instance
	it('중복 멤버 추가', () => {
		const member = Member.of('1', { name: 'Alice' })
		const allMembers = AllMembers.of([member])
		const updatedAllMembers = allMembers.add(member)
		expect(updatedAllMembers.members).toHaveLength(2)
		expect(updatedAllMembers.members).toEqual([member, member])
	})

	// Concatenating an AllMembers instance with itself
	it('자기 자신과 병합', () => {
		const members = [Member.of('1', { name: 'Alice' })]
		const allMembers = AllMembers.of(members)
		const concatenatedAllMembers = allMembers.concat(allMembers)
		expect(concatenatedAllMembers.members).toHaveLength(2)
		expect(concatenatedAllMembers.members).toEqual([...members, ...members])
	})

	// Filtering members with a function that returns false for all members
	it('모든 멤버 필터링 실패', () => {
		const members = [Member.of('1', { name: 'Alice' }), Member.of('2', { name: 'Bob' })]
		const allMembers = AllMembers.of(members)
		const cohort = allMembers.getCohort(() => false)
		expect(cohort.array).toEqual([])
	})

	// Shuffling an empty AllMembers instance
	it('빈 인스턴스 셔플링', () => {
		const emptyAllMembers = AllMembers.empty()
		const shuffledEmptyAllMembers = emptyAllMembers.shuffle()
		expect(shuffledEmptyAllMembers.members).toEqual([])
	})

	// Creating an AllMembers instance with an empty array
	it('빈 배열로 인스턴스 생성', () => {
		const emptyArrayAllMembers = AllMembers.of([])
		expect(emptyArrayAllMembers.members).toEqual([])
		expect(emptyArrayAllMembers.type).toBe('AllMembers')
	})

	// Checking if a non-existent member is in the AllMembers instance
	it('존재하지 않는 멤버 확인', () => {
		const members = [Member.of('1', { name: 'Alice' })] /* ?. $ */
		const allMembers = AllMembers.of(members)
		const nonExistentMember = Member.of('2', { name: 'Bob' })
		expect(allMembers.hasMember(nonExistentMember)).toBe(false)
	})

	// Getting remaining members when all members are already in teams
	it('모든 멤버가 이미 팀에 속해 있을 때 남은 멤버 가져오기', () => {
		const member1 = new Member('1', { name: 'Alice' })
		const member2 = new Member('2', { name: 'Bob' })

		const allMembers = AllMembers.of([member1, member2])

		const teams = new Teams([
			new Team([new Role([member1], 1)]),
			new Team([new Role([member2], 1)]),
		])

		const remainingMembers = allMembers.getRemainingMembers(teams)

		expect(remainingMembers).toEqual([])
	})

	// 멤버 추가 또는 연결 시 불변성 보장
	it('멤버 추가 시 불변성 확인', () => {
		const member1 = new Member('1', { name: 'Alice' })
		const member2 = new Member('2', { name: 'Bob' })
		const allMembers = AllMembers.of([member1])

		const updatedAllMembers = allMembers.add(member2)

		expect(allMembers.members).toEqual([member1])
		expect(updatedAllMembers.members).toEqual([member1, member2])
	})

	// AllMembers 인스턴스의 멤버들에 대한 유형 일관성 확인
	it('멤버 추가시 유형 일관성 확인', () => {
		const members = [Member.of('1', { name: 'Alice' }), Member.of('2', { name: 'Bob' })]
		const allMembers = AllMembers.of(members)
		const newMember = Member.of('3', { name: 'Charlie' })
		const updatedAllMembers = allMembers.add(newMember)

		expect(updatedAllMembers.members).toEqual([...members, newMember])
	})

	// Handling large arrays of members efficiently
	it('멤버 추가시 모든 멤버 유지', () => {
		const members = [Member.of('1', { name: 'Alice' }), Member.of('2', { name: 'Bob' })]
		const allMembers = AllMembers.of(members)
		const newMember = Member.of('3', { name: 'Charlie' })

		const updatedAllMembers = allMembers.add(newMember)

		expect(updatedAllMembers.members).toHaveLength(3)
		expect(updatedAllMembers.members).toContainEqual(newMember)
		expect(updatedAllMembers.members).toContainEqual(members[0])
		expect(updatedAllMembers.members).toContainEqual(members[1])
	})
})

// Generated by CodiumAI

describe('Cohort', () => {
	// Creating a Cohort with an array of Members or Cohorts initializes correctly
	it('생성 확인', () => {
		const member1 = Member.of('1', { name: 'Alice' })
		const member2 = Member.of('2', { name: 'Bob' })
		const cohort = new Cohort([member1, member2])
		expect(cohort.array).toEqual([member1, member2])
	})

	// Adding a Member or Cohort to an existing Cohort updates the Cohort correctly
	it('추가 확인', () => {
		const member1 = Member.of('1', { name: 'Alice' })
		const member2 = Member.of('2', { name: 'Bob' })
		const cohort = new Cohort([member1])
		const updatedCohort = cohort.add(member2)
		expect(updatedCohort.array).toEqual([member1, member2])
	})

	// Retrieving the array from a Cohort returns the unique elements
	it('고유 요소 확인', () => {
		const member1 = Member.of('1', { name: 'Alice' })
		const member2 = Member.of('2', { name: 'Bob' })
		const cohort = new Cohort([member1, member1, member2])
		expect(cohort.array).toEqual([member1, member2])
	})

	// Using the static method `of` creates a Cohort with the provided array
	it('of 메서드 확인', () => {
		const member1 = Member.of('1', { name: 'Alice' })
		const member2 = Member.of('2', { name: 'Bob' })
		const cohort = Cohort.of([member1, member2])
		expect(cohort.array).toEqual([member1, member2])
	})

	// The `empty` method returns an empty Cohort
	it('empty 메서드 확인', () => {
		const cohort = Cohort.empty()
		expect(cohort.array).toEqual([])
	})

	// The `join` method returns a new Cohort with the joined array of Members
	it('join 메서드 확인', () => {
		const member1 = Member.of('1', { name: 'Alice' })
		const member2 = Member.of('2', { name: 'Bob' })
		const cohort1 = new Cohort([member1])
		const cohort2 = new Cohort([member2])
		const joinedCohort = cohort1.add(cohort2).join()
		expect(joinedCohort.array).toEqual([member1, member2])
	})

	// The `numberOfMembers` getter returns the correct count of unique Members
	it('멤버 수 확인', () => {
		const member1 = Member.of('1', { name: 'Alice' })
		const member2 = Member.of('2', { name: 'Bob' })
		const cohort = new Cohort([member1, member2, member1])
		expect(cohort.numberOfMembers).toBe(2)
	})

	// Creating a Cohort with an empty array initializes correctly
	it('빈 배열 초기화 확인', () => {
		const cohort = new Cohort([])
		expect(cohort.array).toEqual([])
	})

	// Adding a duplicate Member or Cohort does not create duplicates in the Cohort
	it('중복 추가 확인', () => {
		const member1 = Member.of('1', { name: 'Alice' })
		const cohort = new Cohort([member1])
		const updatedCohort = cohort.add(member1)
		expect(updatedCohort.array).toEqual([member1])
	})

	// Adding an array of Members or Cohorts that includes duplicates does not create duplicates
	it('중복 배열 추가 확인', () => {
		const member1 = Member.of('1', { name: 'Alice' })
		const member2 = Member.of('2', { name: 'Bob' })
		const cohort = new Cohort([member1])
		const updatedCohort = cohort.addMemberOrCohortArray([member1, member2])
		expect(updatedCohort.array).toEqual([member1, member2])
	})

	// The `join` method handles nested Cohorts correctly
	it('중첩 코호트 처리 확인', () => {
		const member1 = Member.of('1', { name: 'Alice' })
		const member2 = Member.of('2', { name: 'Bob' })
		const cohort1 = new Cohort([member1])
		const cohort2 = new Cohort([cohort1, member2])
		const joinedCohort = cohort2.join()
		expect(joinedCohort.array).toEqual([member1, member2])
	})

	// The `joinedArray` getter throws a TypeError if `memberOrCohortArray` is not an array
	it('타입 에러 확인', () => {
		class InvalidCohort extends Cohort {
			constructor() {
				super([])
				this.memberOrCohortArray = null
			}
		}
		const invalidCohort = new InvalidCohort()
		expect(() => invalidCohort.joinedArray).toThrow(TypeError)
	})

	// The `joinedArray` getter handles self-referencing Cohorts without infinite recursion
	it('자기 참조 처리 확인', () => {
		const cohort = new Cohort([])
		cohort.memberOrCohortArray.push(cohort)
		expect(cohort.joinedArray).toEqual([])
	})

	// The `add` method maintains immutability of the original Cohort
	it('add 메서드 불변성 유지 확인', () => {
		const member1 = Member.of('1', { name: 'Alice' })
		const cohort = new Cohort([member1])
		const updatedCohort = cohort.add(Member.of('2', { name: 'Bob' }))
		expect(cohort.array).toEqual([member1])
		expect(updatedCohort.array).not.toEqual(cohort.array)
	})

	// The `addMemberOrCohortArray` method maintains immutability of the original Cohort
	it('addMemberOrCohortArray 메서드 불변성 유지 확인', () => {
		const member1 = Member.of('1', { name: 'Alice' })
		const cohort = new Cohort([member1])
		const updatedCohort = cohort.addMemberOrCohortArray([Member.of('2', { name: 'Bob' })])
		expect(cohort.array).toEqual([member1])
		expect(updatedCohort.array).not.toEqual(cohort.array)
	})

	// The `join` method maintains immutability of the original Cohort
	it('join 메서드 불변성 유지 확인', () => {
		const member1 = Member.of('1', { name: 'Alice' })
		const cohort = new Cohort([member1])
		const joinedCohort = cohort.join()
		expect(cohort.array).toEqual([member1])
		expect(joinedCohort.array).not.toBe(cohort.array)
	})

	// The `numberOfMembers` getter handles nested Cohorts correctly
	it('numberOfMembers getter가 중첩된 Cohort를 올바르게 처리함', () => {
		const member1 = Member.of('1', { name: 'Alice' })
		const member2 = Member.of('2', { name: 'Bob' })
		const cohort1 = new Cohort([member1, member2])
		const cohort2 = new Cohort([cohort1, member2])
		expect(cohort2.numberOfMembers).toBe(2)
	})
})

// Generated by CodiumAI

describe('Role', () => {
	// Creating a Role with valid members and slots
	it('유효한 멤버와 슬롯으로 Role 생성', () => {
		const members = [new Member(), new Member()]
		const role = new Role(members, 3, 'Developer')
		expect(role.members).toEqual(members)
		expect(role.slot).toBe(3)
		expect(role.name).toBe('Developer')
	})

	// Adding a member to a Role with available slots
	it('사용 가능한 슬롯에 멤버 추가', () => {
		const role = new Role([], 2, 'Tester')
		const member = new Member()
		const updatedRole = role.add(member)
		expect(updatedRole.members).toContain(member)
		expect(updatedRole.slot).toBe(2)
	})

	// Concatenating two Roles with the same number of slots
	it('동일한 슬롯 수의 두 Role 병합', () => {
		const role1 = new Role([new Member()], 2, 'Designer')
		const role2 = new Role([new Member()], 2, 'Designer')
		const concatenatedRole = role1.concat(role2)
		expect(concatenatedRole.members.length).toBe(2)
		expect(concatenatedRole.slot).toBe(2)
	})

	// Checking if a Role has a specific member
	it('특정 멤버 포함 여부 확인', () => {
		const member = new Member()
		const role = new Role([member], 1, 'Manager')
		expect(role.hasMember(member)).toBe(true)
	})

	// Checking if a Role has room for more members
	it('추가 멤버를 위한 공간 확인', () => {
		const role = new Role([], 1, 'Analyst')
		expect(role.hasRoom()).toBe(true)
	})

	// Mapping a function over the members of a Role
	it('멤버에 함수 매핑', () => {
		const member1 = new Member()
		const member2 = new Member()
		const role = new Role([member1, member2], 2, 'Developer')
		const mappedRole = role.map((member) => ({
			...member,
			properties: { ...member.properties, active: true },
		}))
		expect(mappedRole.members.every((member) => member.properties.active)).toBe(true)
	})

	// Creating an empty Role with a valid slot number
	it('유효한 슬롯 수로 빈 Role 생성', () => {
		const role = Role.empty(3, 'Support')
		expect(role.members.length).toBe(0)
		expect(role.slot).toBe(3)
		expect(role.name).toBe('Support')
	})

	// Getting the remaining slots in a Role
	it('남은 슬롯 수 확인', () => {
		const role = new Role([new Member()], 3, 'Lead')
		expect(role.remainingSlot).toBe(2)
	})

	// Creating a Role with more members than slots
	it('슬롯보다 많은 멤버로 Role 생성 시 에러', () => {
		expect(() => new Role([new Member(), new Member()], 1, 'Admin')).toThrowError(
			'The number of members must be less than or equal to the slots',
		)
	})

	// Creating a Role with a negative or zero slot number
	it('음수 또는 0 슬롯 수로 Role 생성 시 에러', () => {
		expect(() => new Role([], -1, 'Admin')).toThrowError()
		expect(() => new Role([], 0, 'Admin')).toThrowError()
	})

	// Adding a member to a Role with no available slots
	it('사용 가능한 슬롯이 없는 경우 멤버 추가 시 에러', () => {
		const role = new Role([new Member()], 1, 'Admin')
		expect(() => role.add(new Member())).toThrowError()
	})

	// Concatenating two Roles with different slot numbers
	it('다른 슬롯 수의 두 Role 병합 시 에러', () => {
		const role1 = new Role([new Member()], 1, 'Admin')
		const role2 = new Role([new Member()], 2, 'Admin')
		expect(() => role1.concat(role2)).toThrowError('The number of slots must be the same')
	})

	// Creating a Role with duplicate members
	it('중복된 멤버로 Role 생성 시 중복 제거 확인', () => {
		const member = new Member()
		const role = new Role([member, member], 2, 'Admin')
		expect(role.members.length).toBe(1)
		expect(role.members[0]).toBe(member)
	})

	// Creating a Role with a non-number slot value
	it('숫자가 아닌 슬롯 값으로 Role 생성 시 에러', () => {
		expect(() => new Role([], 'two', 'Admin')).toThrowError()
		expect(() => new Role([], null, 'Admin')).toThrowError()
		expect(() => new Role([], undefined, 'Admin')).toThrowError()
	})

	// 멤버가 역할을 생성할 때 고유한지 확인
	it('멤버가 역할을 생성할 때 중복된 멤버가 없어야 함', () => {
		// given
		const member1 = new Member('1', { name: 'Alice' })
		const member2 = new Member('2', { name: 'Bob' })

		// when
		const role = new Role([member1, member1, member2], 3, 'Role1')

		// then
		expect(role.members).to.have.lengthOf(2)
	})

	// Creating a Role with a null name
	it('Role의 이름이 null로 생성됨', () => {
		// given
		const members = [Member.of('1'), Member.of('2')]
		const slot = 2

		// when
		const role = Role.of(members, slot, null)

		// then
		expect(role.name).toBeNull()
	})

	// Handling large numbers of members and slots
	it('멤버와 슬롯의 수가 많을 때', () => {
		// given
		const members = [Member.of('1', { name: 'Alice' }), Member.of('2', { name: 'Bob' })]
		const role = Role.empty(2, 'Test Role')

		// when
		const newRole = role.addMembers(members)

		// then
		expect(newRole.members).toHaveLength(2)
		expect(newRole.slot).toBe(2)
	})

	// Adding multiple members at once to a Role
	it('멤버 여러 명 한 번에 추가', () => {
		// given
		const role = Role.empty(3, 'RoleA')
		const member1 = Member.of('1', { name: 'Alice' })
		const member2 = Member.of('2', { name: 'Bob' })
		const member3 = Member.of('3', { name: 'Charlie' })
		const newMembers = [member1, member2, member3]

		// when
		const updatedRole = role.addMembers(newMembers)

		// then
		expect(updatedRole.members).toEqual([member1, member2, member3])
	})
})

// Generated by CodiumAI

describe('Team', () => {
	// Creating a Team instance with unique role names
	it('고유한 역할 이름으로 팀 생성', () => {
		const role1 = Role.of([], 1, 'role1')
		const role2 = Role.of([], 1, 'role2')
		const team = new Team([role1, role2])
		expect(team.roleArray).toHaveLength(2)
	})

	// Adding a role to an existing Team
	it('기존 팀에 역할 추가', () => {
		const role1 = Role.of([], 1, 'role1')
		const team = new Team([role1])
		const role2 = Role.of([], 1, 'role2')
		const newTeam = team.add(role2)
		expect(newTeam.roleArray).toHaveLength(2)
	})

	// Concatenating two Teams
	it('두 팀 병합', () => {
		const role1 = Role.of([], 1, 'role1')
		const team1 = new Team([role1])
		const role2 = Role.of([], 1, 'role2')
		const team2 = new Team([role2])
		const newTeam = team1.concat(team2)
		expect(newTeam.roleArray).toHaveLength(2)
	})

	// Checking if a Team has a specific member
	it('특정 멤버 포함 여부 확인', () => {
		const member = Member.of('member1', {})
		const role = Role.of([member], 1, 'role1')
		const team = new Team([role])
		expect(team.hasMember(member)).toBe(true)
	})

	// Checking if a Team has room for more members
	it('추가 멤버 수용 가능 여부 확인', () => {
		const role = Role.of([], 1, 'role1')
		const team = new Team([role])
		expect(team.hasRoom()).toBe(true)
	})

	// Retrieving a role by its ID from a Team
	it('ID로 역할 검색', () => {
		const role = Role.of([], 1, 'role1')
		const team = new Team([role])
		expect(team.getRoleById(role.id)).toBe(role)
	})

	// Accessing the members of a Team
	it('팀 멤버 접근', () => {
		const member = Member.of('member1', {})
		const role = Role.of([member], 1, 'role1')
		const team = new Team([role])
		expect(team.members).toContain(member)
	})

	// Calculating the remaining slots in a Team
	it('남은 슬롯 계산', () => {
		const role = Role.of([], 2, 'role1')
		const team = new Team([role])
		expect(team.remainingSlot).toBe(2)
	})

	// Creating an empty Team
	it('빈 팀 생성', () => {
		const team = Team.empty()
		expect(team.roleArray).toHaveLength(0)
	})

	// Creating a default Team with a specified slot
	it('지정된 슬롯으로 기본 팀 생성', () => {
		const team = Team.getDefaultTeam(3)
		expect(team.roleArray[0].slot).toBe(3)
	})

	// Creating a Team with duplicate role names
	it('중복된 역할 이름으로 팀 생성 시 에러 발생', () => {
		const role1 = Role.of([], 1, 'role1')
		const role2 = Role.of([], 1, 'role1')
		expect(() => new Team([role1, role2])).toThrowError('Roles must have unique names')
	})

	// Adding a role to a Team that causes duplicate role names
	it('중복된 역할 이름 추가 시 에러 발생', () => {
		const role1 = Role.of([], 1, 'role1')
		const team = new Team([role1])
		const role2 = Role.of([], 1, 'role1')
		expect(() => team.add(role2)).toThrowError('Roles must have unique names')
	})

	// Concatenating two Teams with overlapping role names
	it('중복된 역할 이름을 가진 두 팀 병합 시 에러 발생', () => {
		const role1 = Role.of([], 1, 'role1')
		const team1 = new Team([role1])
		const role2 = Role.of([], 1, 'role1')
		const team2 = new Team([role2])
		expect(() => team1.concat(team2)).toThrowError('Roles must have unique names')
	})

	// Checking if a Team has a member when the Team is empty
	it('빈 팀에서 멤버 포함 여부 확인 시 false 반환', () => {
		const member = Member.of('member1', {})
		const team = Team.empty()
		expect(team.hasMember(member)).toBe(false)
	})

	// Retrieving a role by an ID that does not exist in the Team
	it('존재하지 않는 ID로 역할 검색 시 undefined 반환', () => {
		const role = Role.of([], 1, 'role1')
		const team = new Team([role])
		expect(team.getRoleById('nonexistent')).toBeUndefined()
	})

	// Calculating remaining slots when all roles are full
	it('모든 역할이 꽉 찬 경우 남은 슬롯 계산 시 zero 반환', () => {
		const member = Member.of('member1', {})
		const role = Role.of([member], 1, 'role1')
		const team = new Team([role])
		expect(team.remainingSlot).toBe(0)
	})

	// Creating a Team with an invalid role array
	it('유효하지 않은 역할 배열로 생성되면 에러를 던져야 함', () => {
		// given
		const invalidRoleArray = [new Role([], 1, 'role1'), new Role([], 2, 'role1')]

		// when, then
		expect(() => new Team(invalidRoleArray)).toThrowError('Roles must have unique names')
	})

	// Handling empty role arrays in Team methods
	it('빈 역할 배열을 처리함', () => {
		// given
		const team = new Team([])

		// when
		const hasRoom = team.hasRoom()
		const { members } = team
		const { remainingSlot } = team

		// then
		expect(hasRoom).toBe(false)
		expect(members).toEqual([])
		expect(remainingSlot).toBe(0)
	})
})

// Generated by CodiumAI

describe('Teams', () => {
	// Creating a Teams instance with a valid array of Team objects
	it('유효한 팀 배열로 생성', () => {
		const team1 = Team.empty()
		const team2 = Team.empty()
		const teams = new Teams([team1, team2])
		expect(teams.teamArray).toEqual([team1, team2])
	})

	// Using the static method empty to create an empty Teams instance
	it('빈 팀 인스턴스 생성', () => {
		const teams = Teams.empty()
		expect(teams.teamArray).toEqual([])
	})

	// Concatenating two Teams instances using the concat method
	it('두 팀 인스턴스 병합', () => {
		const team1 = Team.empty()
		const team2 = Team.empty()
		const teams1 = new Teams([team1])
		const teams2 = new Teams([team2])
		const concatenatedTeams = teams1.concat(teams2)
		expect(concatenatedTeams.teamArray).toEqual([team1, team2])
	})

	// Checking if a member belongs to any team in the Teams instance using hasMember
	it('멤버 포함 여부 확인', () => {
		const member = Member.of('1', {})
		const role = Role.of([member], 1)
		const team = Team.of([role])
		const teams = new Teams([team])
		expect(teams.hasMember(member)).toBe(true)
	})

	// Mapping over the teamArray with a provided function using the map method
	it('팀 배열 매핑', () => {
		const team1 = Team.empty()
		const team2 = Team.empty()
		const teams = new Teams([team1, team2])
		const mappedTeams = teams.map((team) => team)
		expect(mappedTeams.teamArray).toEqual([team1, team2])
	})

	// Removing duplicate members from an array using removeDuplicateByThis
	it('중복 멤버 제거', () => {
		const member1 = Member.of('1', {})
		const member2 = Member.of('2', {})
		const role = Role.of([member1], 1)
		const team = Team.of([role])
		const teams = new Teams([team])
		const result = teams.removeDuplicateByThis([member1, member2])
		expect(result).toEqual([member2])
	})

	// Accessing the members property to get all members in the Teams instance
	it('모든 멤버 접근', () => {
		const member = Member.of('1', {})
		const role = Role.of([member], 1)
		const team = Team.of([role])
		const teams = new Teams([team])
		expect(teams.members).toEqual([member])
	})

	// Accessing the remainingSlot property to get the total remaining slots in the Teams instance
	it('남은 슬롯 수 확인', () => {
		const role = Role.of([], 3)
		const team = Team.of([role])
		const teams = new Teams([team])
		expect(teams.remainingSlot).toBe(3)
	})

	// Creating a Teams instance with a non-array argument
	it('비배열 인수로 생성 시 에러 발생', () => {
		expect(() => new Teams('not an array')).toThrow(TypeError)
	})

	// Creating a Teams instance with non-disjoint teams
	it('중복된 역할 있을시 에러 발생', () => {
		const role = Role.of([], 1, 'role')
		const team1 = Team.of([role])
		const team2 = Team.of([role])
		expect(() => new Teams([team1, team2])).toThrow(Error)
	})

	// Concatenating a Teams instance with an empty Teams instance
	it('빈 팀 인스턴스와 병합', () => {
		const team1 = Team.empty()
		const teams1 = new Teams([team1])
		const emptyTeams = Teams.empty()
		const concatenatedTeams = teams1.concat(emptyTeams)
		expect(concatenatedTeams.teamArray).toEqual([team1])
	})

	// Checking if a member belongs to an empty Teams instance
	it('빈 팀 인스턴스에서 멤버 확인', () => {
		const member = Member.of('1', {})
		const emptyTeams = Teams.empty()
		expect(emptyTeams.hasMember(member)).toBe(false)
	})

	// Mapping over an empty teamArray
	it('빈 팀 배열 매핑', () => {
		const emptyTeams = Teams.empty()
		const mappedTeams = emptyTeams.map((team) => team)
		expect(mappedTeams.teamArray).toEqual([])
	})

	// Removing duplicates from an empty member array using removeDuplicateByThis
	it('빈 멤버 배열에서 중복 제거', () => {
		const emptyTeams = Teams.empty()
		expect(emptyTeams.removeDuplicateByThis([])).toEqual([])
	})

	// Handling null or undefined memberArray in removeDuplicateByThis
	it('null 또는 undefined 멤버 배열 처리', () => {
		const emptyTeams = Teams.empty()
		expect(emptyTeams.removeDuplicateByThis(null)).toEqual([])
		expect(emptyTeams.removeDuplicateByThis()).toEqual([])
	})

	// Inspecting a Teams instance using inspect.custom
	it('inspect.custom 사용하여 인스턴스 검사', () => {
		const team1 = Team.empty()
		const teams = new Teams([team1])
		expect(inspect(teams)).toBe(`Teams(${inspect([team1])}, ${inspect(teams.id)})`)
	})

	// Ensuring immutability when removing duplicates using removeDuplicateByThis
	it('중복 제거 시 불변성 보장', () => {
		// given
		const member1 = Member.of()
		const member2 = Member.of()
		const member3 = Member.of()
		const member4 = Member.of()
		const member5 = Member.of()
		const member6 = Member.of()
		const member7 = Member.of()

		const teams = new Teams([
			new Team([Role.of([member1, member2], 2, 'role1'), Role.of([member3], 2, 'role2')]),
			new Team([Role.of([member4, member5], 2, 'role3'), Role.of([member6], 2, 'role4')]),
		])

		const memberArray = [member1, member2, member3, member4, member5, member6, member7]

		// when
		const result = teams.removeDuplicateByThis(memberArray)

		// then
		expect(result).toEqual([member7])
	})

	// 팀을 매핑할 때 map 메서드를 사용하여 불변성 보장
	it('팀 매핑 시 불변성 보장', () => {
		// given
		const team1 = new Team([Role.of([], 1, 'role1')])
		const team2 = new Team([Role.of([], 2, 'role2')])
		const teams = new Teams([team1, team2])

		// when
		const mappedTeams = teams.map((team) => team.add(Role.of([], 3, 'role3')))

		// then
		expect(mappedTeams).not.to.equal(teams)
		expect(mappedTeams.teamArray).not.to.equal(teams.teamArray)
		expect(mappedTeams.teamArray[0]).not.to.equal(teams.teamArray[0])
		expect(mappedTeams.teamArray[1]).not.to.equal(teams.teamArray[1])
	})

	// 'Teams 인스턴스의 type 속성을 확인'
	it('type 속성이 "Teams"인지 확인', () => {
		// given
		const teamArray = [new Team([])]

		// when
		const teams = new Teams(teamArray)

		// then
		expect(teams.type).toBe('Teams')
	})
})
