import { Telegraf } from 'telegraf';
import { IBotPlugin } from './IBotPlugin';
import { logger } from 'utils/loggers';

export class ReceiveMessagePlugin implements IBotPlugin {
    async init(): Promise<void> {}

    register(bot: Telegraf<any>): void {
        bot.on('message', ctx => {
            logger.info(ctx);
        });
    }

    stop(): void | Promise<void> {}
}
