<script module>
import { defineMeta } from '@storybook/addon-svelte-csf'
import ConfettiButtonDecorator from './confettiButtonDecorator.svelte'
import { storybookDecoratorArray } from '@library/ui/storybookDecorator'

const { Story } = defineMeta({
	title: 'Miscellaneous/ConfettiButtonDecorator',
	component: ConfettiButtonDecorator,
	    decorators: storybookDecoratorArray,
	parameters: {
		layout: 'centered',
	},
	argTypes: {
		isConfettiActivated: { control: 'boolean', description: '클릭 시 콘페티 활성화 여부' },
		size: { control: 'number', description: '콘페티 조각 최대 크기(px)' },
		amount: { control: 'number', description: '콘페티 개수' },
		duration: { control: 'number', description: '애니메이션 지속 시간(ms)' },
		infinite: { control: 'boolean', description: '무한 반복' },
		iterationCount: { control: 'number', description: '반복 횟수' },
		fallDistance: { control: 'text', description: '낙하 거리(CSS length)' },
		delay: { control: 'object', description: '랜덤 지연 범위 [min, max]' },
		x: { control: 'object', description: '수평 범위 [-0.5, 0.5]' },
		y: { control: 'object', description: '수직 범위 [0.25, 1]' },
		colorRange: { control: 'object', description: 'HSL 색상 범위 [start, end]' },
		colorArray: { control: 'object', description: '색상 배열' },
		rounded: { control: 'boolean', description: '둥근 모양' },
		cone: { control: 'boolean', description: '원뿔형 퍼짐' },
		noGravity: { control: 'boolean', description: '중력 비활성화' },
		xSpread: { control: 'number', description: '수평 확산(0~1)' },
		destroyOnComplete: { control: 'boolean', description: '완료 후 DOM 제거' },
		disableForReducedMotion: { control: 'boolean', description: 'reduce-motion 사용자 비활성화' },
	},
})
</script>

<!-- 분석: 제공된 컴포넌트는 자식 콘텐츠(children)를 클릭했을 때 tick 후 콘페티를 1회 재생하는 데코레이터. isConfettiActivated=true일 때만 콘페티를 보여줌. 나머지 콘페티 관련 속성은 svelte-confetti에 그대로 전달됨(props). -->

{#snippet template(args)}
	<!-- 스니펫은 직접 컴포넌트를 렌더링해야 함 -->
	<ConfettiButtonDecorator {...args}>
		{#snippet children()}
			<button style="padding: var(--space-s); border: var(--border-size-1) solid var(--border); border-radius: var(--radius-2);

 color: var(--primary-foreground);

 background: var(--primary);">
				클릭해서 축하하기
			</button>
		{/snippet}
	</ConfettiButtonDecorator>
{/snippet}

{#snippet longLabelTemplate(args)}
	<ConfettiButtonDecorator {...args}>
		{#snippet children()}
			<button style="padding: var(--space-s); border: var(--border-size-1) solid var(--border); border-radius: var(--radius-2);

 color: var(--primary-foreground);

 background: var(--primary);">
				{('아주 긴 버튼 라벨 '.repeat(50)).trim()}
			</button>
		{/snippet}
	</ConfettiButtonDecorator>
{/snippet}

{#snippet customColorsTemplate(args)}
	<ConfettiButtonDecorator {...args}>
		{#snippet children()}
			<button style="padding: var(--space-s); border: var(--border-size-1) solid var(--border); border-radius: var(--radius-2);

 color: var(--accent-foreground);

 background: var(--accent);">
				커스텀 색상
			</button>
		{/snippet}
	</ConfettiButtonDecorator>
{/snippet}

<!-- HAPPY PATH -->
<Story name="기본_활성화" args={{ isConfettiActivated: true }} {template} />

<!-- HAPPY PATH: 파라미터 튜닝 -->
<Story name="기본_활성화_조정(size_amount)" args={{ isConfettiActivated: true, size: 12, amount: 120 }} {template} />

<!-- BOUNDARY: 최소값/기본값 근처 -->
<Story name="경계값_최소_개수" args={{ isConfettiActivated: true, amount: 1 }} {template} />

<!-- BOUNDARY: 큰 값들 -->
<Story name="경계값_큰_크기와_낙하거리" args={{ isConfettiActivated: true, size: 40, fallDistance: '600px' }} {template} />

<!-- EDGE: 무한 반복과 반복 횟수 설정 충돌 여부 확인(의도상 함께 쓰지 않는 게 일반적) -->
<Story name="엣지_무한반복" args={{ isConfettiActivated: true, infinite: true, destroyOnComplete: false }} {template} />

<!-- EDGE: 중력 비활성화 + 원뿔형 -->
<Story name="엣지_무중력_원뿔형" args={{ isConfettiActivated: true, noGravity: true, cone: true, xSpread: 0.8 }} {template} />

<!-- NEGATIVE: 비활성화 상태(클릭해도 출력 안 됨) -->
<Story name="비활성화_상태" args={{ isConfettiActivated: false }} {template} />

<!-- INVALID INPUT: 잘못된 타입/값(가능한 한 Story로만 전달, 런타임에서 무시되거나 기본값 처리 예상) -->
<Story name="잘못된_입력_colorRange_문자열" args={{ isConfettiActivated: true, colorRange: 'not-array' }} {template} />

<!-- INVALID INPUT: 배열 길이/형식 문제 -->
<Story name="잘못된_입력_delay_스칼라" args={{ isConfettiActivated: true, delay: 100 }} {template} />

<!-- ERROR HANDLING: reduce-motion 사용자 비활성화 옵션 확인 -->
<Story name="에러대응_reduceMotion_비활성화" args={{ isConfettiActivated: true, disableForReducedMotion: true }} {template} />

<!-- STRESS TEST: 매우 많은 콘페티 수량 -->
<Story name="스트레스_매우_많은_콘페티" args={{ isConfettiActivated: true, amount: 1000, size: 8, duration: 2500 }} {template} />

<!-- STRESS TEST: 매우 긴 라벨(레이아웃 영향 확인) -->
<Story name="스트레스_아주_긴_라벨" args={{ isConfettiActivated: true, amount: 80 }} template={longLabelTemplate} />

<!-- CUSTOM COLORS: colorArray 우선 적용 확인 -->
<Story name="커스텀_색상_배열" args={{ isConfettiActivated: true, colorArray: ['#ff006e', '#8338ec', '#3a86ff', '#fb5607', '#ffbe0b'] }} template={customColorsTemplate} />

<!-- POSITION/RANGE: x/y 범위 변경으로 분포 확인 -->
<Story name="분포_확대_좁힘" args={{ isConfettiActivated: true, x: [-1, 1], y: [0, 1], xSpread: 1 }} {template} />
