#!/usr/bin/env node

import { App } from 'application';
import { logger } from 'utils/loggers';

try {
    const app = new App();
    app.start();
} catch (error) {
    logger.error(error);
    process.exit(1);
}
