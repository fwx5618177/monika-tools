import { ParsePlugin } from './plugins'

export const plugins = {
    parse: new ParsePlugin(),
}

export type PluginMap = keyof typeof plugins
