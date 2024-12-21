import { Telegraf, Context } from "telegraf";
import { IBotPlugin } from "./IBotPlugin";

export class HelpPlugin implements IBotPlugin {
  async init(): Promise<void> {}

  register(bot: Telegraf<Context<any>>): void {
    bot.help((ctx) =>
      ctx.reply(
        "Available commands: /start, /help, /fetchData, /analyzeData, /notify"
      )
    );
  }

  async stop(): Promise<void> {}
}
