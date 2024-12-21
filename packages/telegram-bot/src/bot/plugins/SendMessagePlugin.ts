import { Telegraf, Context } from 'telegraf';
import { IBotPlugin } from './IBotPlugin';
import { MessageController } from '@bot/controllers/MessageController';
import { EventBus } from 'events/EventBus';
import { logger } from 'utils/loggers';
import { TgContext } from './IContext';

export class SendMessagePlugin implements IBotPlugin {
    private bot!: Telegraf<Context<any>>;
    private messageController: MessageController = new MessageController();

    async init(): Promise<void> {
        EventBus.getInstance().on('send-message', async (ctx: TgContext) => {
            logger.info('Received send-message event');
            await this.messageController.handleMessage(ctx);
            logger.info('Message sent');
        });
    }

    register(bot: Telegraf<Context<any>>): void {
        this.bot = bot;

        this.bot.command('send', ctx => {
            EventBus.getInstance().emit('send-message', ctx);
            ctx.reply('稍等, 数据处理中...');
        });
    }

    async stop(): Promise<void> {
        EventBus.getInstance().removeAllListeners('send-message');
    }
}
