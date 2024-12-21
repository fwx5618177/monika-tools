import { Context } from 'telegraf';
import { Message, Update } from 'telegraf/typings/core/types/typegram';
import { CommandContextExtn } from 'telegraf/typings/telegram-types';

export type TgContext = Context<{
    message: Update.New & Update.NonChannel & Message.TextMessage;
    update_id: number;
}> &
    Omit<Context<any>, keyof Context<Update>> &
    CommandContextExtn;
