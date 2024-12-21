import { Telegraf } from 'telegraf';
import { IBotPlugin } from './plugins/IBotPlugin';
import { PluginManager } from './PluginManager';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { logger } from 'utils/loggers';

class BotSetup {
    private bot: Telegraf;
    private pluginManager: PluginManager;

    constructor(token: string, plugins: IBotPlugin[] = []) {
        if (!token) {
            throw new Error('Bot token must be provided');
        }

        this.bot = new Telegraf(token, {
            telegram: {
                agent: new HttpsProxyAgent('http://192.168.3.47:7890'),
            },
        });
        this.pluginManager = new PluginManager(this.bot, plugins);
    }

    public async start(): Promise<void> {
        await this.pluginManager.initPlugins();
        try {
            await this.bot.launch();
            logger.info('Bot started successfully');
        } catch (err) {
            logger.error('Bot failed to start', err);
        }
    }

    public async stop(): Promise<void> {
        await this.pluginManager.stopPlugins();

        this.bot.stop();
        logger.info('Bot stopped successfully');
    }
}

export default BotSetup;
