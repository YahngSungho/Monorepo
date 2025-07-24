### Svelte 5 페이지 전환 애니메이션 완벽 마스터 가이드

이 가이드는 Svelte 5의 핵심 기능인 **룬(Runes)**과 최신 브라우저 기술인 **View Transitions API**를 기반으로, 어떤 외부 라이브러리도 없이 강력하고 유연한 페이지 전환 효과를 만드는 방법을 상세히 설명합니다.

#### Part 1: 모든 애니메이션의 심장, 전역 전환 설정

모든 페이지 전환의 기초가 되는 프레임워크를 설정하는 단계입니다. 이 설정만으로도 즉시 부드러운 전환 효과를 얻을 수 있으며, 모든 고급 애니메이션의 필수 기반이 됩니다.

**목표**: 모든 페이지 전환에 View Transitions API를 적용하여, 기본적으로 부드러운 크로스페이드(cross-fade) 효과를 구현하고, 이후의 모든 커스텀 애니메이션을 위한 토대를 마련합니다.

**위치**: `src/routes/+layout.svelte`

```svelte
<!-- src/routes/+layout.svelte -->
<script>
	import { browser } from '$app/environment';
	import { onNavigate } from '$app/navigation';

	// Svelte 5에서는 전역적인 클라이언트 사이드 로직을 <script> 블록 최상단에 배치합니다.
	// `browser` 환경 변수는 이 코드가 서버에서 실행되는 것을 방지합니다.
	if (browser) {
		// onNavigate 훅은 SvelteKit의 클라이언트 사이드 라우팅이 발생할 때마다 실행됩니다.
		onNavigate((navigation) => {
			// 점진적 향상: 브라우저가 View Transitions API를 지원하지 않으면,
			// 아무것도 하지 않고 기본 라우팅을 따릅니다.
			if (!document.startViewTransition) {
				return;
			}

			// API를 지원하면, SvelteKit 라우팅을 잠시 보류하고 Promise를 반환합니다.
			return new Promise((resolve) => {
				// View Transitions API를 시작합니다.
				document.startViewTransition(async () => {
					// Promise를 즉시 resolve하여 SvelteKit이 다음 페이지로의 DOM 업데이트를 시작하도록 허용합니다.
					resolve();
					// navigation.complete를 기다려 DOM 업데이트가 완전히 끝난 후,
					// 브라우저가 최종 상태의 스냅샷을 찍도록 보장합니다.
					await navigation.complete;
				});
			});
		});
	}

	// SvelteKit의 load 함수로부터 전달받은 `data` 객체입니다.
	// 현재 페이지의 경로(`data.url.pathname`)는 {#key} 블록에서 사용됩니다.
	export let data;

	// <slot />을 대체하는 Svelte 5의 새로운 스니펫(Snippet) 문법입니다.
	let { children } = $props();
</script>

<div class="global-container">
	<header>
		<!-- 헤더 컴포넌트나 네비게이션 메뉴 등 -->
	</header>

	<main>
		<!--
		  Svelte 5에서도 페이지 전체를 교체하여 `in:/out:` 트랜지션을 안정적으로
		  트리거하기 위한 가장 확실한 방법은 여전히 {#key} 블록입니다.
		  View Transitions API와 함께 사용하면 더욱 강력한 제어가 가능합니다.
		-->
		{#key data.url.pathname}
			<div id="page-content-wrapper">
				{@render children()}
			</div>
		{/key}
	</main>
</div>
```

**핵심 요약:**

- 이 코드 하나로 모든 페이지 전환에 부드러운 크로스페이드 효과가 자동으로 적용됩니다.
- `onNavigate` 훅은 SvelteKit의 라우팅과 View Transitions API를 완벽하게 동기화하는 역할을 합니다.
- `{#key}` 블록은 페이지가 바뀔 때마다 내부 컨텐츠(`div#page-content-wrapper`)를 새로 그리게 하여, Svelte의 `in:/out:` 트랜지션이 발동될 수 있는 환경을 만듭니다.

---

#### Part 2: 페이지별 맞춤 안무 구성 (Svelte Transitions & CSS)

전역 전환 위에, 각 페이지가 고유한 등장 애니메이션을 갖도록 만들어 보겠습니다.

**목표**: 특정 페이지 진입 시, 제목, 부제, 카드 등 여러 요소가 순차적으로 또는 각기 다른 스타일로 나타나는 동적인 효과를 구현합니다.

**방법**: 두 가지 강력한 기술을 조합합니다.

1. **Svelte Transitions (`in:` 지시어)**: 간단한 등장/퇴장 효과를 위해 JavaScript에서 타이밍(delay, duration)을 제어할 때 유용합니다.
2. **CSS View Transitions**: CSS만으로 더 복잡하고 정교한 애니메이션을 정의하고, 특정 요소에 이름을 부여하여 독립적으로 제어할 때 강력합니다.

**위치**: `src/routes/services/+page.svelte`

```svelte
<!-- src/routes/services/+page.svelte -->
<script>
	import { fly } from 'svelte/transition';
	const services = [
		{ id: 1, title: 'Web Development', icon: '💻' },
		{ id: 2, title: 'UI/UX Design', icon: '🎨' },
		{ id: 3, title: 'Consulting', icon: '📈' }
	];
</script>

<div class="services-page">
	<h1 style="view-transition-name: page-title">Our Services</h1>
	<p class="subtitle" in:fly={{ y: 20, duration: 500, delay: 200 }}>
		We offer a wide range of services to help your business grow.
	</p>

	<div class="services-grid">
		{#each services as service, i}
			<!-- Svelte의 `in:` 지시어를 사용하여 순차적 애니메이션 구현 -->
			<div
				class="service-card"
				in:fly={{ y: 30, duration: 400, delay: 300 + i * 100 }}
			>
				<span class="icon">{service.icon}</span>
				<h3>{service.title}</h3>
			</div>
		{/each}
	</div>
</div>

<style>
	/* [핵심] view-transition-name을 지정하면, 해당 요소는 페이지 전환 시 특별하게 제어됩니다. */
	h1 {
		view-transition-name: page-title;
		/* contain: layout; 은 전환 시 브라우저의 렌더링 계산을 최적화하는 데 도움이 됩니다. */
		contain: layout;
	}

	/* CSS만으로 정교한 애니메이션 정의 */
	@keyframes slide-and-fade-in {
		from {
			opacity: 0;
			transform: translateY(20px) scale(0.98);
		}
		to {
			opacity: 1;
			transform: translateY(0) scale(1);
		}
	}

	/* `::view-transition-new(name)` 의사 요소를 사용하여
	   'page-title'이라는 이름을 가진 요소가 새로 나타날 때 이 애니메이션을 적용합니다. */
	::view-transition-new(page-title) {
		animation: slide-and-fade-in 0.6s cubic-bezier(0.215, 0.61, 0.355, 1);
	}
</style>
```

**동작 원리 분석:**

1. 사용자가 `/services` 페이지로 이동하면 `onNavigate` 훅이 View Transition을 시작합니다.
2. `h1` 태그는 `view-transition-name: page-title`을 가지므로, CSS의 `::view-transition-new(page-title)` 규칙에 따라 `slide-and-fade-in` 애니메이션이 실행됩니다.
3. `p.subtitle`은 Svelte의 `in:fly` 지시어에 따라 200ms 지연 후 아래에서 위로 날아옵니다.
4. `.service-card`들은 `{#each}` 루프의 인덱스(`i`)를 활용하여, 300ms, 400ms, 500ms... 순으로 하나씩 나타나는 **스태거(staggered)** 애니메이션 효과를 보여줍니다.

---

#### Part 3: 페이지를 넘나드는 마법, 공유 요소 전환

**목표**: 포트폴리오 목록의 썸네일 이미지를 클릭하면, 그 이미지가 상세 페이지의 큰 히어로 이미지 위치로 부드럽게 '이동하며 확대'되는, 가장 인상적인 전환 효과를 구현합니다.

**원리**: 두 페이지에 걸쳐 있는 두 요소에 **동일한 `view-transition-name`**을 부여하면, 브라우저가 두 요소 간의 변형(morphing) 애니메이션을 자동으로 생성합니다.

**단계 1: 레이아웃 설정**
Part 1에서 설정한 `+layout.svelte`가 모든 준비를 마쳤습니다. 추가 작업은 필요 없습니다.

**단계 2: 두 페이지의 요소에 동일한 이름 부여**

**위치**: `src/routes/portfolio/+page.svelte` (목록 페이지)

```svelte
<!-- src/routes/portfolio/+page.svelte -->
<div class="portfolio-grid">
	{#each projects as project}
		<a href={`/portfolio/${project.slug}`} class="portfolio-item">
			<img
				src={project.thumbnailUrl}
				alt={project.title}
				<!--
				  [핵심] 동적인 slug나 id를 사용하여 각 요소에 고유한 이름을 부여합니다.
				  `style` 속성을 사용하여 직접 할당합니다.
				-->
				style="view-transition-name: project-image-{project.slug}"
			/>
			<h3>{project.title}</h3>
		</a>
	{/each}
</div>

<style>
	.portfolio-item img {
		aspect-ratio: 16 / 9;
		object-fit: cover;
		border-radius: 8px;
	}
</style>
```

**위치**: `src/routes/portfolio/[slug]/+page.svelte` (상세 페이지)

```svelte
<!-- src/routes/portfolio/[slug]/+page.svelte -->
<script>
	// `load` 함수에서 `slug`에 해당하는 `project` 데이터를 가져왔다고 가정합니다.
	export let data;
	const { project } = data;
</script>

<div class="project-detail">
	<div class="hero-image-container">
		<img
			--
			<!--
			alt={project.title} src={project.imageUrl} 것과 규칙으로 동일한 목록 부여합니다. 사용한 이름을 정확히 페이지에서>
			style="view-transition-name: project-image-{project.slug}"
		/>
	</div>
	<h1>{project.title}</h1>
	<div class="content">
		{@html project.content}
	</div>
</div>

<style>
	.hero-image-container img {
		width: 100%;
		aspect-ratio: 16 / 9;
		object-fit: cover;
		border-radius: 16px;
	}
</style>
```

**동작 원리:**
사용자가 `slug='project-alpha'`인 포트폴리오 아이템을 클릭하면, 브라우저는 이전 페이지의 `img`와 새 페이지의 `img`가 모두 `view-transition-name: project-image-project-alpha`를 가지고 있음을 인지합니다. 그리고 두 요소의 위치, 크기, `border-radius` 등 계산 가능한 모든 CSS 속성 값의 차이를 자동으로 보간하여 부드러운 모핑 애니메이션을 생성합니다.

---

#### Part 4: 고급 제어 - 룬(Runes)을 활용한 방향성 애니메이션

**목표**: 브라우저의 '뒤로 가기' 버튼을 눌렀을 때와 일반 링크를 클릭했을 때(앞으로 가기) 서로 다른 애니메이션을 적용합니다.

**단계 1: 네비게이션 상태를 관리하는 룬(Rune) 모듈 생성**
Svelte 5에서는 반응형 상태를 `.svelte.js` 파일에 정의하여 여러 곳에서 재사용할 수 있습니다.

**위치**: `src/lib/navigationDirection.svelte.js`

```javascript
// .svelte.js 확장자는 이 파일이 룬(Runes)을 사용함을 명시합니다.
let isBackNavigation = $state(false)

export function useNavigationDirection() {
	return {
		// 읽기 전용 getter를 제공하여 외부에서 직접 수정을 방지합니다.
		get isBack() {
			return isBackNavigation
		},
		// 상태를 변경하는 명시적인 함수를 제공합니다.
		setBack: () => (isBackNavigation = true),
		setForward: () => (isBackNavigation = false),
	}
}
```

**단계 2: `onNavigate`에서 상태를 업데이트하고, `$effect`로 클래스 동기화**
`+layout.svelte`에서 네비게이션 상태를 감지하고, 그 상태에 따라 `<html>` 태그에 클래스를 동적으로 추가/제거합니다.

**위치**: `src/routes/+layout.svelte` (기존 `<script>` 블록에 추가/수정)

```svelte
<script>
	import { browser } from '$app/environment';
	import { onNavigate } from '$app/navigation';
	import { useNavigationDirection } from '$lib/navigationDirection.svelte.js';

	// 1. 룬 모듈을 인스턴스화합니다.
	const navDirection = useNavigationDirection();

	if (browser) {
		onNavigate((navigation) => {
			// 2. 네비게이션 타입에 따라 상태를 업데이트합니다.
			if (navigation.type === 'popstate') {
				navDirection.setBack();
			} else {
				navDirection.setForward();
			}

			// ... View Transition 시작 로직 (이전과 동일) ...
		});

		// 3. $effect 룬을 사용하여 상태 변화에 자동으로 반응합니다.
		$effect(() => {
			// `navDirection.isBack` 값이 바뀔 때마다 이 코드가 실행됩니다.
			document.documentElement.classList.toggle('is-back-navigation', navDirection.isBack);
		});
	}

	export let data;
	let { children } = $props();
</script>
```

**단계 3: CSS에서 방향에 따라 다른 애니메이션 정의**
이제 `<html>` 태그에 `is-back-navigation` 클래스가 있는지 여부에 따라 다른 CSS 애니메이션을 적용할 수 있습니다.

**위치**: `src/app.css` (또는 전역 스타일시트)

```css
/* 애니메이션 키프레임 정의 */
@keyframes slide-in-from-right { from { transform: translateX(30px); opacity: 0; } }
@keyframes slide-out-to-left { to { transform: translateX(-30px); opacity: 0; } }
@keyframes slide-in-from-left { from { transform: translateX(-30px); opacity: 0; } }
@keyframes slide-out-to-right { to { transform: translateX(30px); opacity: 0; } }

/* 기본 (앞으로 가기) 전환 애니메이션 */
::view-transition-old(root) {
	animation: 0.3s ease-out both slide-out-to-left;
}
::view-transition-new(root) {
	animation: 0.3s ease-in both slide-in-from-right;
}

/* 뒤로 가기 시 적용될 전환 애니메이션 */
html.is-back-navigation::view-transition-old(root) {
	animation: 0.3s ease-out both slide-out-to-right;
}
html.is-back-navigation::view-transition-new(root) {
	animation: 0.3s ease-in both slide-in-from-left;
}
```

---

### 추가 정보

#### 1. `{#key}` 블록과 View Transitions API의 관계 명확화

두 기술은 함께 사용할 수 있지만, 그 목적과 역할을 명확히 이해해야 합니다.

- **View Transitions API (주 애니메이터)**: 페이지 전체의 픽셀 상태(스냅샷)를 기반으로 부드러운 전환을 **직접 생성**합니다. 이것이 메인 애니메이션 엔진입니다.
- **`{#key}` 블록 (컴포넌트 생명주기 관리자)**: 페이지가 바뀔 때 Svelte에게 "이 안의 컴포넌트를 완전히 파괴하고 새로 만들어라"라고 지시합니다.

**언제 무엇을 사용해야 하는가?**

1. **단순한 페이지 전환 (90%의 경우)**: `onNavigate`에 설정된 **View Transitions API만으로 충분합니다.** 이 경우 `{#key}` 블록은 필수가 아니며, 오히려 불필요한 재렌더링을 유발할 수 있습니다.
2. **페이지 진입/퇴장 시 반드시 실행되어야 할 로직이 있을 때**: 페이지 컴포넌트 내부에서 Svelte의 `in:/out:` 지시어를 사용하거나, 컴포넌트가 파괴(`onDestroy`와 유사)되고 새로 마운트(`onMount`와 유사)되어야 하는 명확한 이유가 있을 때 `{#key}` 블록을 함께 사용합니다.

**결론**: 우선 View Transitions API만으로 시작하고, Svelte의 `in:/out:` 트랜지션이 꼭 필요한 경우에만 `{#key}` 블록을 추가하는 것이 더 효율적인 접근법입니다.

#### 2. 애니메이션 클래스 명명 규칙

`view-transition-name`은 CSS 식별자이므로, 공백이나 특수 문자가 포함되어서는 안 됩니다. 동적인 ID(예: 데이터베이스의 UUID)를 사용할 때 이스케이프 처리가 필요할 수 있으므로, URL에 안전한 슬러그(slug)나 숫자 ID를 사용하는 것이 가장 안전합니다.

**예시**:

- **안전**: `project-image-123`, `user-avatar-john-doe`
- **주의 필요**: `item-A%20B/C` (특수 문자가 포함된 경우)

#### 3. 애니메이션 타입 분류

View Transitions API는 전환 그룹에 타입을 추가하여 더 세밀한 제어를 가능하게 합니다. `navigation.trigger()` API와 함께 사용하여 특정 링크 클릭에만 다른 애니메이션을 적용할 수 있습니다.

**예시**: 모달을 여는 링크와 일반 페이지 이동 링크의 애니메이션을 다르게 하고 싶을 때.

**위치**: `+page.svelte` (링크가 있는 곳)

```svelte
<script>
    import { trigger } from '$app/navigation';
</script>

<!-- 일반 페이지 이동 -->
<a href="/about">About</a>

<!-- 모달을 여는 특별한 전환 -->
<button on:click={() => trigger('show-modal', { target: '/photos/123' })}>
    Show Photo
</button>
```

**위치**: `+layout.svelte` (`onNavigate` 내부)

```javascript
onNavigate((navigation) => {
	if (navigation.info?.type === 'show-modal') {
		// 모달을 위한 특별한 애니메이션 클래스를 <html>에 추가
		document.documentElement.classList.add('is-modal-transition')
	}
	// ...
})
```

이처럼 `navigation.info` 객체를 활용하면 단순한 뒤로/앞으로 가기 구분을 넘어 훨씬 더 복잡하고 의도적인 전환 로직을 구현할 수 있습니다.
