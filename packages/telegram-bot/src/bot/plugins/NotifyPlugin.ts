import { Telegraf } from 'telegraf';
import { IBotPlugin } from './IBotPlugin';

export class NotifyPlugin implements IBotPlugin {
    async init(): Promise<void> {}

    register(bot: Telegraf<any>): void {
        bot.command('notify', ctx => {
            // 假设的发送通知逻辑
            ctx.reply('Sending notification...');
            // 在这里实现发送通知的逻辑
        });
    }

    async stop(): Promise<void> {}
}
