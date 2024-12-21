import { Telegraf, Context } from 'telegraf';
import { IBotPlugin } from './IBotPlugin';
import { pluginList } from './plugins';

export class StartPlugin implements IBotPlugin {
    async init(): Promise<void> {}

    register(bot: Telegraf<Context<any>>): void {
        const commands = pluginList
            ?.map(plugin => `${plugin.command}: ${plugin.description}`)
            .join('\n');

        bot.start(ctx => {
            const responseText = `Hi, <b>${ctx.from.first_name}</b>.\n<b>Welcome to the Quant Trading Bot!</b>\n\n\nAvailable commands: \n\n${commands}`;

            bot.telegram.sendMessage(ctx.chat.id, responseText, {
                parse_mode: 'HTML',
            });
        });
    }

    async stop(): Promise<void> {}
}
