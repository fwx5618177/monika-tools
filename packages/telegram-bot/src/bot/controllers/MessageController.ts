import { TgContext } from '@bot/plugins/IContext';
import { statSync } from 'fs';
import { BDownload } from 'services/videos/BDownload';
import { logger } from 'utils/loggers';

export class MessageController {
    public bDownload: BDownload = new BDownload();

    public async handleMessage(ctx: TgContext): Promise<void> {
        try {
            const link = ctx.payload;

            if (!link) {
                ctx.reply('No link provided, need to provide more information');
                return;
            }

            const path = await this.bDownload.getVideo(link);
            const stat = statSync(path);
            // The file size still is greater than 50MB after compressing, so cannot send it
            if (stat.size > 50 * 1024 * 1024) {
                ctx.reply(`The file size is too large to send: ${stat.size / 1024 / 1024}MB`);
                await ctx.telegram.sendDocument(ctx.chat.id, { source: path });
                return;
            }

            ctx.reply(`Video downloaded to ${path}`);
            await ctx.telegram.sendVideo(ctx.chat.id, { source: path });
        } catch (error) {
            logger.error('Send error:', error);
        }
    }
}
