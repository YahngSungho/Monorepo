import { fc, it } from '@fast-check/vitest'
import * as R from 'ramda'
import {
	AllMembers, Cohort, Member, Team, Teams,
} from 'team_match_legacy/monads.js'
import { describe, expect } from 'vitest'

describe('AllMembers', () => {
	// Creating an empty AllMembers instance using the empty method
	it('빈 인스턴스 생성', () => {
		const allMembers = AllMembers.empty()
		expect(allMembers.members).toEqual([])
	})

	// Creating an AllMembers instance with a predefined list of members using the of method
	it('미리 정의된 멤버 리스트로 인스턴스 생성', () => {
		const members = [new Member('1'), new Member('2')]
		const allMembers = AllMembers.of(members)
		expect(allMembers.members).toEqual(members)
	})

	// Adding a single member to an AllMembers instance using the add method
	it('단일 멤버 추가', () => {
		const allMembers = AllMembers.empty()
		const newMember = new Member('1')
		const updatedAllMembers = allMembers.add(newMember)
		expect(updatedAllMembers.members).toContain(newMember)
	})

	// Adding multiple members to an AllMembers instance using the addMembers method
	it('다수 멤버 추가', () => {
		const allMembers = AllMembers.empty()
		const newMembers = [new Member('1'), new Member('2')]
		const updatedAllMembers = allMembers.addMembers(newMembers)
		expect(updatedAllMembers.members).toEqual(newMembers)
	})

	// Concatenating two AllMembers instances using the concat method
	it('두 인스턴스 병합', () => {
		const members1 = [new Member('1')]
		const members2 = [new Member('2')]
		const allMembers1 = AllMembers.of(members1)
		const allMembers2 = AllMembers.of(members2)
		const concatenated = allMembers1.concat(allMembers2)
		expect(concatenated.members).toEqual([...members1, ...members2])
	})

	// Filtering members to create a Cohort using the getCohort method
	it('필터링하여 Cohort 생성', () => {
		const members = [new Member('1', { name: 'Alice' }), new Member('2', { name: 'Bob' })]
		const allMembers = AllMembers.of(members)
		const cohort = allMembers.getCohort(member => member.properties.name.startsWith('A'))
		expect(cohort.getJoinedArray()).toEqual(['1'])
	})

	// Getting remaining members not in any team using the getRemainingMembers method
	it('남은 멤버 확인', () => {
		const members = [new Member('1'), new Member('2')]
		const allMembers = AllMembers.of(members)
		const teams = Teams.init([['1']], [1])
		const remaining = allMembers.getRemainingMembers(teams)
		expect(remaining.members).toEqual([new Member('2')])
	})

	// Checking if a member ID exists in AllMembers using the hasMemberId method
	it('멤버 ID 존재 확인', () => {
		const members = [new Member('1'), new Member('2')]
		const allMembers = AllMembers.of(members)
		expect(allMembers.hasMemberId('1')).toBe(true)
		expect(allMembers.hasMemberId('3')).toBe(false)
	})

	// Shuffling the members in AllMembers using the shuffle method
	it('멤버 셔플', () => {
		const members = [new Member('1'), new Member('2'), new Member('3')]
		const allMembers = AllMembers.of(members)
		const shuffled = allMembers.shuffle()
		expect(shuffled.members).not.toEqual(members)
	})

	// Adding a member that already exists in AllMembers
	it('중복 멤버 추가 시도', () => {
		const member = new Member('1')
		const allMembers = AllMembers.of([member])
		const updatedAllMembers = allMembers.add(member)
		expect(updatedAllMembers.members.length).toBe(2)
	})

	// Concatenating AllMembers instances with overlapping members
	it('중복 멤버 병합 시도', () => {
		const member1 = new Member('1')
		const member2 = new Member('2')
		const allMembers1 = AllMembers.of([member1])
		const allMembers2 = AllMembers.of([member1, member2])
		const concatenated = allMembers1.concat(allMembers2)
		expect(concatenated.members.length).toBe(3)
	})

	// Filtering members with a filter function that matches no members
	it('필터링 결과 없음 확인', () => {
		const members = [new Member('1'), new Member('2')]
		const allMembers = AllMembers.of(members)
		const cohort = allMembers.getCohort(member => member.properties.name === 'NonExistent')
		expect(cohort.getJoinedArray()).toEqual([])
	})

	// Getting remaining members when all members are already in teams
	it('모든 멤버가 팀에 속한 경우 남은 멤버 확인', () => {
		const members = [new Member('1'), new Member('2')]
		const allMembers = AllMembers.of(members)
		const teams = Teams.init([['1'], ['2']], [1, 1])
		const remaining = allMembers.getRemainingMembers(teams)
		expect(remaining.members).toEqual([])
	})

	// Shuffling an empty AllMembers instance
	it('빈 인스턴스 셔플', () => {
		const allMembers = AllMembers.empty()
		const shuffled = allMembers.shuffle()
		expect(shuffled.members).toEqual([])
	})

	// Ensuring immutability when adding members to AllMembers
	it('멤버 추가 시 불변성 유지', () => {
		const members = [new Member('1')]
		const allMembers = AllMembers.of(members)
		const newMember = new Member('2')
		const updatedAllMembers = allMembers.add(newMember)
		expect(allMembers.members).not.toContain(newMember)
		expect(updatedAllMembers.members).toContain(newMember)
	}) // ?.

	// Verifying that the getCohort method returns unique member IDs
	it.prop({ idsArray: fc.array(fc.string(), { maxLength: 10, minLength: 10 }) })(
		'Cohort의 고유 ID 반환 확인',
		({ idsArray }) => {
			const members = idsArray.map(id => new Member(id))
			const allMembers = AllMembers.of(members)
			const cohort = allMembers.getCohort(() => true)
			expect(new Set(cohort.getJoinedArray()).size).toBe(R.uniq(idsArray).length)
		},
	)
})

describe('Cohort', () => {
	// Creating an empty Cohort using the empty method
	it('빈 Cohort 생성', () => {
		const cohort = Cohort.empty()
		expect(cohort.getValue()).toEqual([])
	})

	// Adding a single member to a Cohort
	it('단일 멤버 추가', () => {
		const cohort = Cohort.empty().add('member1')
		expect(cohort.getValue()).toEqual(['member1'])
	})

	// Adding multiple members to a Cohort
	it('다중 멤버 추가', () => {
		const cohort = Cohort.empty().addMembers(['member1', 'member2'])
		expect(cohort.getValue()).toEqual(['member1', 'member2'])
	})

	// Joining nested Cohorts into a single array of Ids
	it('중첩된 Cohort 병합', () => {
		const nestedCohort = new Cohort([new Cohort(['id1']), 'id2'])
		const joinedArray = nestedCohort.join().getValue()
		expect(joinedArray).toEqual(['id1', 'id2'])
	})

	// Checking if a Cohort is included in a team
	it('팀 포함 여부 확인', () => {
		const cohort = new Cohort(['id1', 'id2'])
		const team = ['id1', 'id3']
		expect(cohort.includedIn(team)).toBe(true)
	})

	// Concatenating multiple Cohorts
	it('다중 Cohort 연결', () => {
		const cohort1 = new Cohort(['id1'])
		const cohort2 = new Cohort(['id2'])
		const concatenated = cohort1.addMembers(cohort2.getValue())
		expect(concatenated.getValue()).toEqual(['id1', 'id2'])
	})

	// Retrieving the total size of a Cohort
	it('총 크기 확인', () => {
		const cohort = new Cohort(['id1', 'id2'])
		expect(cohort.totalSize).toBe(2)
	})

	// Popping the last member from a Cohort
	it('마지막 멤버 제거', () => {
		const cohort = new Cohort(['id1', 'id2'])
		const { Cohort: newCohort, id } = cohort.pop()
		expect(newCohort.getValue()).toEqual(['id1'])
		expect(id).toBe('id2')
	})

	// Adding a Cohort to itself
	it('자기 자신 추가', () => {
		const cohort = new Cohort(['id1'])
		const newCohort = cohort.add(cohort)
		expect(newCohort.getJoinedArray()).toEqual(['id1'])
	})

	// Popping from an empty Cohort
	it('빈 Cohort에서 팝', () => {
		const cohort = Cohort.empty()
		const { id } = cohort.pop()
		expect(id).toBeNull()
	})

	// Handling deeply nested Cohorts
	it('깊게 중첩된 Cohorts 처리', () => {
		const deepNestedCohort = new Cohort([new Cohort([new Cohort(['id1'])])])
		expect(deepNestedCohort.join().getValue()).toEqual(['id1'])
	})

	// checking inclusion in an empty team
	it('빈 팀 포함 여부 확인', () => {
		const cohort = new Cohort(['id1'])
		expect(cohort.includedIn([])).toBe(false)
	})

	// Joining a Cohort with no members
	it('멤버 없는 Cohort 병합', () => {
		const emptyCohort = new Cohort([])
		expect(emptyCohort.join().getValue()).toEqual([])
	})

	// Ensuring unique members in a Cohort
	it('고유 멤버 유지', () => {
		const cohort = new Cohort(['id1', 'id1'])
		expect(cohort.getValue()).toEqual(['id1'])
	})

	// Verifying immutability of Cohort instances
	it('불변성 확인', () => {
		const cohort = new Cohort(['id1'])
		const newCohort = cohort.add('id2')
		expect(cohort.getValue()).toEqual(['id1'])
		expect(newCohort.getValue()).toEqual(['id1', 'id2'])
	})

	// Validating the behaviour of getValue method
	it('getValue 메서드 확인', () => {
		const cohort = new Cohort(['id1'])
		expect(cohort.getValue()).toEqual(['id1'])
	})
})

// Generated by CodiumAI

describe('Team', () => {
	// creating a team with valid memberIds and slotFixed
	it('팀 생성', () => {
		const team = Team.of(['id1', 'id2'], 3)
		expect(team.memberIds).toEqual(['id1', 'id2'])
		expect(team.slotFixed).toBe(3)
	})

	// adding a member to a team with available slots
	it('멤버 추가', () => {
		const team = Team.of(['id1'], 2)
		const updatedTeam = team.add('id2')
		expect(updatedTeam.memberIds).toEqual(['id1', 'id2'])
	})

	// concatenating two teams with the same slotFixed
	it('팀 병합', () => {
		const team1 = Team.of(['id1'], 2)
		const team2 = Team.of(['id2'], 2)
		const mergedTeam = team1.concat(team2)
		expect(mergedTeam.memberIds).toEqual(['id1', 'id2'])
	})

	// checking if a team has a specific memberId
	it('멤버 확인', () => {
		const team = Team.of(['id1', 'id2'], 3)
		expect(team.hasMemberId('id1')).toBe(true)
		expect(team.hasMemberId('id3')).toBe(false)
	})

	// getting the remaining slots in a team
	it('남은 슬롯 확인', () => {
		const team = Team.of(['id1'], 3)
		expect(team.getRemainingSlot()).toBe(2)
	})

	// mapping a function over the memberIds of a team
	it('맵 함수 적용', () => {
		const team = Team.of(['id1', 'id2'], 3)
		const mappedTeam = team.map(id => id.toUpperCase())
		expect(mappedTeam.memberIds).toEqual(['ID1', 'ID2'])
	})

	// creating an empty team with a specified slotFixed
	it('빈 팀 생성', () => {
		const team = Team.empty(3)
		expect(team.memberIds).toEqual([])
		expect(team.slotFixed).toBe(3)
	})

	// updating a team with additional memberIds
	it('팀 업데이트', () => {
		const team = Team.of(['id1'], 3)
		const updatedTeam = team.update(['id2'])
		expect(updatedTeam.memberIds).toEqual(['id1', 'id2'])
	})

	// retrieving the idArray of a team
	it('idArray 가져오기', () => {
		const team = Team.of(['id1', 'id2'], 3)
		expect(team.idArray).toEqual(['id1', 'id2'])
	})

	// creating a team with slotFixed less than the number of memberIds
	it('슬롯 부족 에러', () => {
		expect(() => Team.of(['id1', 'id2'], 1)).toThrowError('The number of members must be less than or equal to the slots')
	})

	// adding a member to a team with no available slots
	it('슬롯 초과 에러', () => {
		const team = Team.of(['id1'], 1)
		expect(() => team.add('id2')).toThrowError('The number of members must be less than or equal to the slots')
	})

	// concatenating two teams with different slotFixed values
	it('슬롯 불일치 에러', () => {
		const team1 = Team.of(['id1'], 2)
		const team2 = Team.of(['id2'], 3)
		expect(() => team1.concat(team2)).toThrowError('The number of slots must be the same')
	})

	// creating a team with a negative slotFixed
	it('음수 슬롯 에러', () => {
		expect(() => Team.empty(-1)).toThrowError('Slot fixed must be a positive number')
	})

	// creating a team with duplicate memberIds
	it('중복 멤버 제거 확인', () => {
		const team = Team.of(['id1', 'id1'], 3)
		expect(team.memberIds).toEqual(['id1'])
	})

	// checking if a team has a memberId when the team is empty
	it('빈 팀 멤버 확인', () => {
		const team = Team.empty(3)
		expect(team.hasMemberId('id1')).toBe(false)
	})

	// ensuring memberIds are unique within a team
	it.prop({ ids: fc.array(fc.string(), { minLength: 1 }) })('멤버 고유성 확인', ({ ids }) => {
		const uniqueIds = Array.from(new Set(ids))
		const team = Team.of(ids, ids.length + 1)
		expect(team.memberIds).toEqual(uniqueIds)
	})

	// verifying that slotFixed is a positive number
	it.prop({ slotFixed: fc.integer({ max: -1, min: -100 }) })('슬롯 양수 확인', ({ slotFixed }) => {
		expect(() => Team.empty(slotFixed)).toThrowError('Slot fixed must be a positive number')
	})

	it('불변성 유지 확인', () => {
		const team = Team.of(['id1'], 2)
		const updatedTeam = team.add('id2')
		expect(team.memberIds).toEqual(['id1'])
		expect(updatedTeam.memberIds).toEqual(['id1', 'id2'])
	})
})

// Generated by CodiumAI

describe('Teams', () => {
	// Creating a Teams instance with valid teams and slots
	it('유효한 팀과 슬롯으로 Teams 인스턴스 생성', () => {
		const team1 = new Team(['member1', 'member2'], 3)
		const team2 = new Team(['member3', 'member4'], 3)
		const teams = new Teams([team1, team2], [3, 3])
		expect(teams.teams.length).toBe(2)
		expect(teams.slots).toEqual([3, 3])
	})

	// Adding a member to a team using the add method
	it('add 메서드로 팀에 멤버 추가', () => {
		const team = new Team(['member1'], 2)
		const updatedTeam = team.add('member2')
		expect(updatedTeam.memberIds).toContain('member2')
		expect(updatedTeam.memberIds.length).toBe(2)
	})

	// Concatenating two Teams instances with the same number of teams and slots
	it('같은 팀 수와 슬롯을 가진 두 Teams 인스턴스 병합', () => {
		const team1 = new Team(['member1'], 2)
		const team2 = new Team(['member2'], 2)
		const teams1 = new Teams([team1], [2])
		const teams2 = new Teams([team2], [2])
		const concatenatedTeams = teams1.concat(teams2)
		expect(concatenatedTeams.teams[0].memberIds).toContain('member1')
		expect(concatenatedTeams.teams[0].memberIds).toContain('member2')
	})

	// Retrieving all team members using getAllTeamMembers
	it('getAllTeamMembers로 모든 팀 멤버 가져오기', () => {
		const team1 = new Team(['member1'], 2)
		const team2 = new Team(['member2'], 2)
		const teams = new Teams([team1, team2], [2, 2])
		const allMembers = teams.getAllTeamMembers()
		expect(allMembers).toContain('member1')
		expect(allMembers).toContain('member2')
	})

	// Checking if a member has already joined using alreadyJoined
	it('alreadyJoined로 멤버 가입 여부 확인', () => {
		const team1 = new Team(['member1'], 2)
		const teams = new Teams([team1], [2])
		expect(teams.alreadyJoined('member1')).toBe(true)
		expect(teams.alreadyJoined('member2')).toBe(false)
	})

	// Mapping over teams with a function using the map method
	it('map 메서드로 함수 적용', () => {
		const team1 = new Team(['member1'], 2)
		const teams = new Teams([team1], [2])
		const mappedTeams = teams.map(team => team.add('member2'))
		expect(mappedTeams.teams[0].memberIds).toContain('member2')
	})

	// Initializing Teams with id arrays and slots using init
	it('init 메서드로 id 배열과 슬롯으로 초기화', () => {
		const idArrays = [['member1'], ['member2']]
		const slots = [2, 2]
		const teams = Teams.init(idArrays, slots)
		expect(teams.teams[0].memberIds).toContain('member1')
		expect(teams.teams[1].memberIds).toContain('member2')
	})

	// Creating an empty Teams instance with specified slots
	it('지정된 슬롯으로 빈 Teams 인스턴스 생성', () => {
		const slots = [2, 3]
		const emptyTeams = Teams.empty(slots)
		expect(emptyTeams.teams.length).toBe(2)
		expect(emptyTeams.slots).toEqual(slots)
	})

	// Setting new slots for Teams using setSlots
	it('setSlots로 새로운 슬롯 설정', () => {
		const team1 = new Team(['member1'], 2)
		const teams = new Teams([team1], [2])
		const updatedTeams = teams.setSlots([3])
		expect(updatedTeams.slots).toEqual([3])
	})

	// Updating Teams with new teams using update
	it('update로 새로운 팀들로 업데이트', () => {
		const team1 = new Team(['member1'], 2)
		const teams = new Teams([team1], [2])
		const newTeam = new Team(['member2'], 2)
		const updatedTeams = teams.update([newTeam])
		expect(updatedTeams.teams[0].memberIds).toContain('member1')
		expect(updatedTeams.teams[0].memberIds).toContain('member2')
	})

	// Creating a Teams instance with mismatched teams and slots lengths
	it('팀과 슬롯 길이가 일치하지 않는 Teams 인스턴스 생성 에러', () => {
		expect(() => {
			Teams.of([new Team(['member1'], 2)], [2, 3])
		}).toThrowError('Slots must be the same length as number of teams')
	})

	// Concatenating two Teams instances with different number of teams
	it('다른 팀 수를 가진 두 Teams 인스턴스 병합 에러', () => {
		const team1 = new Team(['member1'], 2)
		const team2 = new Team(['member2'], 2)
		const teams1 = Teams.of([team1], [2])
		const teams2 = Teams.of([team1, team2], [2, 2])
		expect(() => {
			teams1.concat(teams2)
		}).toThrowError('Teams must have the same number of teams')
	})

	// Concatenating two Teams instances with different slots
	it('다른 슬롯을 가진 두 Teams 인스턴스 병합 에러', () => {
		const team1 = new Team(['member1'], 2)
		const teams1 = new Teams([team1], [2])
		const teams2 = new Teams([team1], [3])
		expect(() => {
			teams1.concat(teams2)
		}).toThrowError('Slots must be the same')
	})

	// Creating a Teams instance with non-disjoint teams
	it('겹치는 멤버가 있는 팀들로 Teams 인스턴스 생성 에러', () => {
		expect(() => {
			Teams.of([new Team(['member1'], 2), new Team(['member1'], 2)], [2, 2])
		}).toThrowError('Teams must be disjoint')
	})

	// Handling empty teams array in the constructor
	it('빈 팀 배열 처리', () => {
		const emptyTeams = new Teams([], [])
		expect(emptyTeams.teams.length).toBe(0)
		expect(emptyTeams.slots.length).toBe(0)
	})

	// Checking remaining slots for all teams using getRemainingSlots
	it('getRemainingSlots로 모든 팀의 남은 슬롯 확인', () => {
		const team1 = new Team(['member1'], 3)
		const team2 = new Team(['member3'], 4)
		const teams = new Teams([team1, team2], [3, 4])
		expect(teams.getRemainingSlots()).toEqual([2, 3])
	})

	// Handling invalid slot values in the empty method
	it('유효하지 않은 슬롯 값 처리', () => {
		const slots = [2, -1, 3]
		expect(() => Teams.empty(slots)).toThrowError('Slot fixed must be a positive number')
	})

	// Handling invalid slot values in the Team constructor
	it('slotFixed가 멤버 수보다 작을 때 에러를 throw해야 함', () => {
		expect(() => new Teams([Team.of(['member1', 'member2'], 1)])).toThrowError('The number of members must be less than or equal to the slots')
	})

	describe('removeDuplicateByThis', () => {
		// removes duplicate ids present in the teams
		it('중복 id 제거', () => {
			const teams = Teams.init([['id1', 'id2'], ['id3']], [2, 2])
			const result = teams.removeDuplicateByThis(['id1', 'id2', 'id3', 'id4'])
			expect(result).toEqual(['id4'])
		})

		// returns the same array if no duplicates are found
		it('중복 없는 경우 동일 배열 반환', () => {
			const teams = Teams.init([['id1'], ['id2']], [1, 1])
			const result = teams.removeDuplicateByThis(['id3', 'id4'])
			expect(result).toEqual(['id3', 'id4'])
		})

		// handles an empty input array gracefully
		it('빈 입력 배열 처리', () => {
			const teams = Teams.init([['id1'], ['id2']], [1, 1])
			const result = teams.removeDuplicateByThis([])
			expect(result).toEqual([])
		})

		// removes multiple duplicates correctly
		it('여러 중복 제거', () => {
			const teams = Teams.init([['id1', 'id2'], ['id3']], [2, 2])
			const result = teams.removeDuplicateByThis(['id1', 'id2', 'id3', 'id4', 'id5'])
			expect(result).toEqual(['id4', 'id5'])
		})

		// maintains the order of ids in the input array
		it('입력 배열 순서 유지', () => {
			const teams = Teams.init([['id1'], ['id2']], [1, 1])
			const result = teams.removeDuplicateByThis(['id3', 'id4'])
			expect(result).toEqual(['id3', 'id4'])
		})

		// input array contains only duplicates
		it('입력 배열에 중복만 포함', () => {
			const teams = Teams.init([['id1'], ['id2']], [1, 1])
			const result = teams.removeDuplicateByThis(['id1', 'id2'])
			expect(result).toEqual([])
		})

		// input array is empty
		it('입력 배열이 비어 있음', () => {
			const teams = Teams.init([['id1'], ['id2']], [1, 1])
			const result = teams.removeDuplicateByThis([])
			expect(result).toEqual([])
		})

		// all ids in the input array are unique
		it('모든 id가 고유함', () => {
			const teams = Teams.init([['id1'], ['id2']], [1, 1])
			const result = teams.removeDuplicateByThis(['id3', 'id4'])
			expect(result).toEqual(['id3', 'id4'])
		})

		// input array contains non-string elements
		it('비문자열 요소 포함', () => {
			const teams = Teams.init([['id1'], ['id2']], [1, 1])
			const result = teams.removeDuplicateByThis(['id3', 123, null])
			expect(result).toEqual(['id3', 123, null])
		})

		// 팀에 멤버가 없는 경우
		it('팀에 멤버가 없는 경우', () => {
			const teams = Teams.empty([2, 3])
			const result = teams.removeDuplicateByThis(['id1', 'id2', 'id3'])
			expect(result).toEqual(['id1', 'id2', 'id3'])
		})

		// 중복 id를 정확히 식별할 때 팀이 중복되는 경우
		it('중복 id 제거', () => {
			const teams = Teams.init([['id1', 'id2'], ['id3']], [2, 2])
			const result = teams.removeDuplicateByThis(['id1', 'id2', 'id3', 'id4'])
			expect(result).toEqual(['id4'])
		})

		// handles null or undefined input gracefully
		it('null 또는 undefined 입력 시 처리', () => {
			const teams = Teams.init([['id1', 'id2'], ['id3']], [2, 2])
			const result = teams.removeDuplicateByThis(null)
			expect(result).toEqual([])
		})

		// works correctly when all teams are empty
		it('모든 팀이 비어 있을 때 정확히 작동', () => {
			const teams = Teams.empty([2, 3, 1])
			const result = teams.removeDuplicateByThis(['id1', 'id2', 'id3'])
			expect(result).toEqual(['id1', 'id2', 'id3'])
		})
	})
})
