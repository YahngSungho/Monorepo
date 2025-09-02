if (process.env.NODE_ENV) {
	throw new Error('비밀 노출')
}

export * from './init.admin.js'
export * from './markdowns.admin.js'
