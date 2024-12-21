import { Telegraf, Context } from 'telegraf';
import { IBotPlugin } from './IBotPlugin';

export class RealTimePlugin implements IBotPlugin {
    async init(): Promise<void> {}

    register(bot: Telegraf<Context<any>>): void {
        bot.command('realtime', ctx => {
            ctx.reply('Realtime data is subscribed. Please wait for notifications...');
        });
    }

    stop(): void | Promise<void> {}
}
