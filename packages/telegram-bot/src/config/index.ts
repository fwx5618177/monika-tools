import { config } from 'dotenv';

config({
    path: `.env`,
});

export const BotConfig = {
    token: process.env['TG_BOT_TOKEN'] || '',
    adminId: process.env['TG_ADMIN_ID'] || '',
};
