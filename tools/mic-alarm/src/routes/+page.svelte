<script>
// Data (constants)
const DEFAULT_DB_THRESHOLD = -40 // dBFS, 0=max, typical speech ~ -20 to -40
const DEFAULT_TIME_THRESHOLD_SEC = 15 // seconds
const DEFAULT_PAUSE_MINUTES = 0 // minutes
const DEFAULT_INTERVAL_MS = 3000 // milliseconds

// LocalStorage keys (Data)
const LS_KEYS = {
	alarmVolume: 'micAlarm.alarmVolume',
	pauseMinutes: 'micAlarm.pauseMinutes',
	sampleIntervalMs: 'micAlarm.sampleIntervalMs',
	thresholdDb: 'micAlarm.thresholdDb',
	thresholdSeconds: 'micAlarm.thresholdSeconds',
}

// State
let permissionError = $state('')
let isReady = $state(false)
let isMonitoring = $state(false)
let isAlarmPlaying = $state(false)
let currentDatabase = $state(-100)
let lastHeardAt = $state(Date.now())

let thresholdDatabase = $state(DEFAULT_DB_THRESHOLD)
let thresholdSeconds = $state(DEFAULT_TIME_THRESHOLD_SEC)
let pauseMinutesInput = $state(DEFAULT_PAUSE_MINUTES)
let pauseUntilTs = $state(0)
let alarmVolume = $state(60) // 0~100
let sampleIntervalMs = $state(DEFAULT_INTERVAL_MS)

// Audio internals
let audioContext = /** @type {AudioContext|undefined} */ ($state())
let analyser = /** @type {AnalyserNode|undefined} */ ($state())
let micStream = /** @type {MediaStream|undefined} */ ($state())
let dataArray = /** @type {Float32Array|undefined} */ ($state())
// Non-reactive timer handle to avoid effect loops

let alarmElement // <audio>
let intervalId

// Derived
let nowMs = $state(Date.now())
const pausedRemainingMs = $derived(Math.max(0, pauseUntilTs - nowMs))
const isPaused = $derived(pausedRemainingMs > 0)
const secondsSinceHeard = $derived(Math.max(0, Math.floor((nowMs - lastHeardAt) / 1000)))
const statusText = $derived.by(() => {
	if (permissionError) return `오류: ${permissionError}`
	if (!isReady) return '준비 중'
	if (isPaused) return `일시정지 (${formatMs(pausedRemainingMs)} 남음)`
	return isMonitoring ? '작동 중' : '대기'
})

// Calculations (pure)
function calculateRms(buffer) {
	let sumSquares = 0
	for (const v of buffer) {
		sumSquares += v * v
	}
	return Math.sqrt(sumSquares / buffer.length)
}
/** @param {number} rms */
function rmsToDatabase(rms) {
	const safe = Math.max(rms, 1e-8)
	return 20 * Math.log10(safe)
}
/** @param {number} ms */
function formatMs(ms) {
	const totalSec = Math.ceil(ms / 1000)
	const m = Math.floor(totalSec / 60)
	const s = totalSec % 60
	const mm = String(m).padStart(2, '0')
	const ss = String(s).padStart(2, '0')
	return `${mm}:${ss}`
}

/** @param {number} n @param {number} min @param {number} max */
function clampNumber(n, min, max) {
	if (!Number.isFinite(n)) return min
	return Math.max(min, Math.min(max, n))
}

// Actions (side effects)
async function startMic_action() {
	try {
		permissionError = ''
		// Request microphone
		micStream = await navigator.mediaDevices.getUserMedia({ audio: true })

		// Create context & nodes
		const AC = globalThis.AudioContext || /** @type {any} */ (globalThis).webkitAudioContext
		audioContext = new AC()
		const source = audioContext.createMediaStreamSource(micStream)
		analyser = audioContext.createAnalyser()
		analyser.fftSize = 2048
		analyser.smoothingTimeConstant = 0.2
		source.connect(analyser)
		dataArray = new Float32Array(analyser.fftSize)

		// Monitoring loop
		if (intervalId) globalThis.clearInterval(intervalId)
		intervalId = globalThis.setInterval(sample_action, sampleIntervalMs)

		isReady = true
		isMonitoring = true
	} catch (error) {
		permissionError = error && error.message ? error.message : '마이크 권한 거부 또는 초기화 실패'
		isReady = false
		isMonitoring = false
	}
}

function loadSettings_action() {
	try {
		const td = localStorage.getItem(LS_KEYS.thresholdDb)
		if (td !== null) thresholdDatabase = clampNumber(Number(td), -100, 0)
		const ts = localStorage.getItem(LS_KEYS.thresholdSeconds)
		if (ts !== null)
			thresholdSeconds = Math.max(1, Math.floor(Number(ts)) || DEFAULT_TIME_THRESHOLD_SEC)
		const pm = localStorage.getItem(LS_KEYS.pauseMinutes)
		if (pm !== null)
			pauseMinutesInput = Math.max(0, Math.floor(Number(pm)) || DEFAULT_PAUSE_MINUTES)
		const av = localStorage.getItem(LS_KEYS.alarmVolume)
		if (av !== null) alarmVolume = clampNumber(Math.floor(Number(av)), 0, 100)
		const sim = localStorage.getItem(LS_KEYS.sampleIntervalMs)
		if (sim !== null) sampleIntervalMs = clampNumber(Math.floor(Number(sim)), 100, 60_000)
	} catch {}
}

function stopMic_action() {
	isMonitoring = false
	if (intervalId) {
		globalThis.clearInterval(intervalId)
		intervalId = undefined
	}
	if (analyser) analyser.disconnect()
	analyser = undefined
	if (audioContext) {
		// Do not close to allow resume later; suspend to save CPU
		audioContext.suspend?.()
	}
	if (micStream) {
		for (const t of micStream.getTracks()) {
			t.stop()
		}
		micStream = undefined
	}
}

function sample_action() {
	// Tick clock for derived values
	nowMs = Date.now()
	if (!analyser || !dataArray || isPaused) return
	analyser.getFloatTimeDomainData(/** @type {any} */ (dataArray))
	const rms = calculateRms(dataArray)
	const database = rmsToDatabase(rms)
	currentDatabase =
		Number.isFinite(database) ? Number(Math.max(-100, Math.min(0, database)).toFixed(0)) : -100

	const speaking = currentDatabase >= thresholdDatabase
	if (speaking) {
		lastHeardAt = nowMs
		if (isAlarmPlaying) stopAlarm_action()
	}

	// Alarm logic
	if (!isPaused && isMonitoring) {
		const silentForMs = nowMs - lastHeardAt
		if (silentForMs >= thresholdSeconds * 1000 && !isAlarmPlaying) playAlarm_action()
	}

	// If paused, ensure alarm is stopped
	if (isPaused && isAlarmPlaying) stopAlarm_action()
}

async function playAlarm_action() {
	if (!alarmElement) return
	alarmElement.volume = Math.max(0, Math.min(1, alarmVolume / 100))
	alarmElement.loop = true
	try {
		await alarmElement.play()
		isAlarmPlaying = true
	} catch {
		// Likely user gesture required
		isAlarmPlaying = false
	}
}

function stopAlarm_action() {
	if (!alarmElement) return
	try {
		alarmElement.pause()
	} catch {}
	try {
		alarmElement.currentTime = 0
	} catch {}
	isAlarmPlaying = false
}

function applyPause_action() {
	const minutes = Number(pauseMinutesInput) || 0
	if (minutes <= 0) {
		pauseUntilTs = 0
		return
	}
	pauseUntilTs = Date.now() + minutes * 60 * 1000
	stopAlarm_action()
}

function testAlarm_action() {
	playAlarm_action()
	// Auto stop after short burst to avoid being annoying
	globalThis.setTimeout(() => {
		if (isAlarmPlaying) stopAlarm_action()
	}, 1200)
}

function onVolumeChange_action(e) {
	alarmVolume = Number(e.currentTarget.value)
	if (alarmElement) alarmElement.volume = Math.max(0, Math.min(1, alarmVolume / 100))
}

function restart_action() {
	stopAlarm_action()
	stopMic_action()
	startMic_action()
}

// Lifecycle
$effect(() => {
	// Load saved settings, then start immediately on mount
	loadSettings_action()
	startMic_action()
	return () => {
		stopAlarm_action()
		stopMic_action()
	}
})

// Persist settings when they change
$effect(() => {
	try {
		localStorage.setItem(LS_KEYS.thresholdDb, String(thresholdDatabase))
	} catch {}
})
$effect(() => {
	try {
		localStorage.setItem(LS_KEYS.thresholdSeconds, String(thresholdSeconds))
	} catch {}
})
$effect(() => {
	try {
		localStorage.setItem(LS_KEYS.pauseMinutes, String(pauseMinutesInput))
	} catch {}
})
$effect(() => {
	try {
		localStorage.setItem(LS_KEYS.alarmVolume, String(alarmVolume))
	} catch {}
	if (alarmElement) alarmElement.volume = Math.max(0, Math.min(1, alarmVolume / 100))
})

// Persist and apply sampling interval changes
$effect(() => {
	try {
		localStorage.setItem(LS_KEYS.sampleIntervalMs, String(sampleIntervalMs))
	} catch {}
	if (isMonitoring) {
		if (intervalId) globalThis.clearInterval(intervalId)
		intervalId = globalThis.setInterval(sample_action, sampleIntervalMs)
	}
})
</script>

<main class="container">
	<h1 class="title">마이크 무음 경고</h1>

	<section class="status">
		<div class="row">
			<div class="label">상태:</div>
			<div class="value"><strong>{statusText}</strong></div>
		</div>
		<div class="row">
			<div class="label">현재 소리:</div>
			<div class="value">
				{#if isPaused}
					<strong>-</strong>
					dBFS
				{:else}
					<strong>{currentDatabase}</strong>
					dBFS
				{/if}
			</div>
		</div>
		<div class="row">
			<div class="label">알람까지:</div>
			<div class="value">
				{#if isPaused}
					<strong>-</strong>
					초
				{:else}
					<strong>{thresholdSeconds - secondsSinceHeard}</strong>
					초
				{/if}
			</div>
		</div>
		<div class="row">
			<div class="label">무음 경과:</div>
			<div class="value">
				{#if isPaused}
					<strong>-</strong>
					초
				{:else}
					<strong>{secondsSinceHeard}</strong>
					초
				{/if}
			</div>
		</div>
	</section>

	<section class="controls">
		<div class="control">
			<label for="thresholdDb">기준 소리 (dBFS)</label>
			<input
				id="thresholdDb"
				class="input"
				max="0"
				min="-100"
				step="1"
				type="number"
				bind:value={thresholdDatabase}
			/>
			<small class="hint">말소리가 이 값 이상이어야 무음이 아님. 보통 -50 ~ -20</small>
		</div>

		<div class="control">
			<label for="thresholdSec">기준 시간 (초)</label>
			<input
				id="thresholdSec"
				class="input"
				min="1"
				step="1"
				type="number"
				bind:value={thresholdSeconds}
			/>
		</div>

		<div class="control">
			<label for="intervalMs">샘플링 간격 (ms)</label>
			<input
				id="intervalMs"
				class="input"
				max="60000"
				min="200"
				step="100"
				type="number"
				bind:value={sampleIntervalMs}
			/>
			<small class="hint">마이크 측정 주기. 짧을수록 빠르지만 CPU 사용 증가</small>
		</div>

		<div class="control">
			<label for="pauseMin">일시정지 (분)</label>
			<div class="inline">
				<input
					id="pauseMin"
					class="input"
					max="100"
					min="0"
					step="1"
					type="number"
					bind:value={pauseMinutesInput}
				/>
				<button class="btn" onclick={applyPause_action}>적용</button>
				{#if isPaused}
					<button
						class="btn"
						onclick={() => {
							pauseUntilTs = 0
						}}
					>
						해제
					</button>
				{/if}
			</div>
			{#if isPaused}
				<small class="hint">{formatMs(pausedRemainingMs)} 남음</small>
			{/if}
		</div>

		<div class="control">
			<label for="alarmVolume">알람 볼륨</label>
			<input
				id="alarmVolume"
				class="range"
				max="100"
				min="0"
				oninput={onVolumeChange_action}
				step="1"
				type="range"
				value={alarmVolume}
			/>
		</div>

		<div class="buttons">
			<button class="btn" onclick={restart_action}>마이크 재시작</button>
			<button class="btn" onclick={testAlarm_action}>알람 테스트</button>
		</div>
	</section>

	<audio bind:this={alarmElement} style:display="none" preload="auto" src="/alert-1.mp3"></audio>

	<div id="Page_Check"></div>
</main>

<style>
.container {
	max-inline-size: 780px;
	margin: 0 auto;
	padding: var(--space-l, 2rem);
	color: var(--foreground, rgb(17 17 17));
}

.title {
	margin: 0 0 var(--space-m, 1.25rem);
	font-size: clamp(1.5rem, 1rem + 2vi, 2.25rem);
}

.status {
	margin-block-end: var(--space-l, 2rem);
	padding: var(--space-m, 1rem);
	border: var(--border-size-1, 1px) solid var(--border, rgb(221 221 221));
	border-radius: var(--radius-3, 1rem);

	background: var(--card, rgb(255 255 255));
}

.row {
	display: flex;
	gap: 0.5rem;
	align-items: center;
	padding: 0.25rem 0;
}

.label {
	opacity: 0.75;
}

.value {
	font-size: 1.125rem;
}

.controls {
	display: grid;
	gap: var(--space-m, 1rem);
}

.control {
	display: grid;
	gap: 0.5rem;
}

.input {
	inline-size: 8ch;
	padding: 0.75rem 1rem;
	border: var(--border-size-1, 1px) solid var(--input, rgb(204 204 204));
	border-radius: var(--radius-2, 5px);

	font-size: 1.25rem;
}

.range {
	inline-size: 100%;
}

.inline {
	display: flex;
	gap: 0.5rem;
}

.btn {
	cursor: pointer;

	padding: 0.75rem 1.25rem;
	border: var(--border-size-1, 1px) solid var(--border, rgb(221 221 221));
	border-radius: var(--radius-2, 5px);

	font-size: 1.125rem;

	background: var(--secondary, rgb(245 245 245));

	&:hover {
		background: var(--accent, rgb(238 238 238));
	}
}

.hint {
	opacity: 0.7;
}
</style>
