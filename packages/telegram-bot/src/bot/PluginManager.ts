import { Telegraf, Context } from "telegraf";
import { IBotPlugin } from "./plugins/IBotPlugin";

export class PluginManager {
  private plugins: IBotPlugin[] = [];

  constructor(private bot: Telegraf<Context<any>>, plugins: IBotPlugin[]) {
    this.bot = bot;
    this.plugins = plugins;
  }

  public async initPlugins(): Promise<void> {
    for (const plugin of this.plugins) {
      await plugin.init();
      plugin.register(this.bot);
    }
  }

  public async stopPlugins(): Promise<void> {
    for (const plugin of this.plugins) {
      await plugin.stop();
    }
  }
}
