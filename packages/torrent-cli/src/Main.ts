import { PluginMap, plugins } from './register'
import { Plugins } from './types/pluginInterface'

export default class Main {
    private plugins: Plugins
    private context: Record<string, any> = {}

    constructor() {
        // 注册所有插件
        this.plugins = plugins
    }

    async execute(command: PluginMap, ...args: unknown[]) {
        console.log('Reading the params...', ...args)

        const plugin = this.plugins[command]
        if (plugin) {
            await plugin.execute(this.context[command], ...args)
        } else {
            console.error(`Command ${command} not found`)
        }
    }
}
