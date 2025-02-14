import packagejson from '../../package.json' with { type: 'json' }

export const APP_NAME = packagejson.name.replace('@app/', '')
