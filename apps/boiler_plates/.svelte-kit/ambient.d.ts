
// this file is generated — do not edit it


/// <reference types="@sveltejs/kit" />

/**
 * Environment variables [loaded by Vite](https://vitejs.dev/guide/env-and-mode.html#env-files) from `.env` files and `process.env`. Like [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private), this module cannot be imported into client-side code. This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) _and do_ start with [`config.kit.env.privatePrefix`](https://svelte.dev/docs/kit/configuration#env) (if configured).
 * 
 * _Unlike_ [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private), the values exported from this module are statically injected into your bundle at build time, enabling optimisations like dead code elimination.
 * 
 * ```ts
 * import { API_KEY } from '$env/static/private';
 * ```
 * 
 * Note that all environment variables referenced in your code should be declared (for example in an `.env` file), even if they don't have a value until the app is deployed:
 * 
 * ```
 * MY_FEATURE_FLAG=""
 * ```
 * 
 * You can override `.env` values from the command line like so:
 * 
 * ```bash
 * MY_FEATURE_FLAG="enabled" npm run dev
 * ```
 */
declare module '$env/static/private' {
	export const APPDATA: string;
	export const BASE_URL: string;
	export const COLORTERM: string;
	export const COMSPEC: string;
	export const DEV: string;
	export const DISPLAY: string;
	export const HOME: string;
	export const INIT_CWD: string;
	export const LANG: string;
	export const MODE: string;
	export const NODE: string;
	export const NODE_ENV: string;
	export const NODE_OPTIONS: string;
	export const NODE_PATH: string;
	export const npm_command: string;
	export const npm_config_engine_strict: string;
	export const npm_config_frozen_lockfile: string;
	export const npm_config_msvs_version: string;
	export const npm_config_node_gyp: string;
	export const npm_config_registry: string;
	export const npm_config_user_agent: string;
	export const npm_config_verify_deps_before_run: string;
	export const npm_execpath: string;
	export const npm_lifecycle_event: string;
	export const npm_lifecycle_script: string;
	export const npm_node_execpath: string;
	export const npm_package_name: string;
	export const npm_package_version: string;
	export const PATH: string;
	export const PATHEXT: string;
	export const PNPM_SCRIPT_SRC_DIR: string;
	export const PROD: string;
	export const ProgramData: string;
	export const PROMPT: string;
	export const PWD: string;
	export const SHELL: string;
	export const SYSTEMDRIVE: string;
	export const SYSTEMROOT: string;
	export const TEMP: string;
	export const TERM: string;
	export const TERM_PROGRAM: string;
	export const TEST: string;
	export const TMP: string;
	export const TURBO_HASH: string;
	export const VITEST: string;
	export const VSCODE_GIT_ASKPASS_EXTRA_ARGS: string;
	export const VSCODE_GIT_ASKPASS_MAIN: string;
	export const VSCODE_GIT_ASKPASS_NODE: string;
	export const VSCODE_GIT_IPC_HANDLE: string;
}

/**
 * Similar to [`$env/static/private`](https://svelte.dev/docs/kit/$env-static-private), except that it only includes environment variables that begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) (which defaults to `PUBLIC_`), and can therefore safely be exposed to client-side code.
 * 
 * Values are replaced statically at build time.
 * 
 * ```ts
 * import { PUBLIC_BASE_URL } from '$env/static/public';
 * ```
 */
declare module '$env/static/public' {
	
}

/**
 * This module provides access to runtime environment variables, as defined by the platform you're running on. For example if you're using [`adapter-node`](https://github.com/sveltejs/kit/tree/main/packages/adapter-node) (or running [`vite preview`](https://svelte.dev/docs/kit/cli)), this is equivalent to `process.env`. This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) _and do_ start with [`config.kit.env.privatePrefix`](https://svelte.dev/docs/kit/configuration#env) (if configured).
 * 
 * This module cannot be imported into client-side code.
 * 
 * Dynamic environment variables cannot be used during prerendering.
 * 
 * ```ts
 * import { env } from '$env/dynamic/private';
 * console.log(env.DEPLOYMENT_SPECIFIC_VARIABLE);
 * ```
 * 
 * > In `dev`, `$env/dynamic` always includes environment variables from `.env`. In `prod`, this behavior will depend on your adapter.
 */
declare module '$env/dynamic/private' {
	export const env: {
		APPDATA: string;
		BASE_URL: string;
		COLORTERM: string;
		COMSPEC: string;
		DEV: string;
		DISPLAY: string;
		HOME: string;
		INIT_CWD: string;
		LANG: string;
		MODE: string;
		NODE: string;
		NODE_ENV: string;
		NODE_OPTIONS: string;
		NODE_PATH: string;
		npm_command: string;
		npm_config_engine_strict: string;
		npm_config_frozen_lockfile: string;
		npm_config_msvs_version: string;
		npm_config_node_gyp: string;
		npm_config_registry: string;
		npm_config_user_agent: string;
		npm_config_verify_deps_before_run: string;
		npm_execpath: string;
		npm_lifecycle_event: string;
		npm_lifecycle_script: string;
		npm_node_execpath: string;
		npm_package_name: string;
		npm_package_version: string;
		PATH: string;
		PATHEXT: string;
		PNPM_SCRIPT_SRC_DIR: string;
		PROD: string;
		ProgramData: string;
		PROMPT: string;
		PWD: string;
		SHELL: string;
		SYSTEMDRIVE: string;
		SYSTEMROOT: string;
		TEMP: string;
		TERM: string;
		TERM_PROGRAM: string;
		TEST: string;
		TMP: string;
		TURBO_HASH: string;
		VITEST: string;
		VSCODE_GIT_ASKPASS_EXTRA_ARGS: string;
		VSCODE_GIT_ASKPASS_MAIN: string;
		VSCODE_GIT_ASKPASS_NODE: string;
		VSCODE_GIT_IPC_HANDLE: string;
		[key: `PUBLIC_${string}`]: undefined;
		[key: `${string}`]: string | undefined;
	}
}

/**
 * Similar to [`$env/dynamic/private`](https://svelte.dev/docs/kit/$env-dynamic-private), but only includes variables that begin with [`config.kit.env.publicPrefix`](https://svelte.dev/docs/kit/configuration#env) (which defaults to `PUBLIC_`), and can therefore safely be exposed to client-side code.
 * 
 * Note that public dynamic environment variables must all be sent from the server to the client, causing larger network requests — when possible, use `$env/static/public` instead.
 * 
 * Dynamic environment variables cannot be used during prerendering.
 * 
 * ```ts
 * import { env } from '$env/dynamic/public';
 * console.log(env.PUBLIC_DEPLOYMENT_SPECIFIC_VARIABLE);
 * ```
 */
declare module '$env/dynamic/public' {
	export const env: {
		[key: `PUBLIC_${string}`]: string | undefined;
	}
}
