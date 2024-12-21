import chalk from 'chalk';
import { BotConfig } from 'config';
import BotSetup from '@bot/BotSetup';
import { IBotPlugin } from '@bot/plugins/IBotPlugin';
import { EventBus } from 'events/EventBus';
import { pluginList } from '@bot/plugins/plugins';
import { logger } from 'utils/loggers';

export class App {
    private plugins!: IBotPlugin[];
    private tgBot!: BotSetup;
    private eventBus: EventBus = EventBus.getInstance();

    constructor() {
        this.initializePlugins();
        this.initializeTgBot();
        this.initializeEventBus();
    }

    public initializePlugins() {
        logger.info(chalk.green('Initializing plugins...'));

        this.plugins = pluginList?.map(plugin => plugin.plugin) || [];
    }

    public initializeTgBot() {
        logger.info(chalk.green('Initializing TG bot...'));
        this.tgBot = new BotSetup(BotConfig.token, this.plugins);
    }

    public initializeEventBus() {
        logger.info(chalk.green('Initializing event bus error...'));

        this.eventBus.on('error', (error: Error) => {
            logger.error('An error occurred:', error);
        });
    }

    public start() {
        logger.info(chalk.bgGreenBright('Starting TG bot...'));

        this.tgBot.start();

        logger.info(chalk.bgGreenBright('TG bot started successfully'));
    }
}
