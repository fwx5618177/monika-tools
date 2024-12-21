export type Plugins = {
    [key: string]: PluginInterface
}

export interface Context {
    [key: string]: any
}

export interface PluginInterface {
    execute(context: Context, ...options: any[]): Promise<void> | void
}
