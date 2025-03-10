import { untrack } from 'svelte'

const MOBILE_BREAKPOINT = 768

export class IsMobile {
	_current = $state(false)

	get current() {
		return this._current
	}

	constructor() {
		$effect.root(() => {
			$effect(() => {
				return untrack(() => {
					const mql = globalThis.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
					const onChange = () => {
						this._current = window.innerWidth < MOBILE_BREAKPOINT
					}
					mql.addEventListener('change', onChange)
					onChange()
					return () => {
						mql.removeEventListener('change', onChange)
					}
				})
			})
		})
	}
}
