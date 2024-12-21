import { Telegraf, Context, Markup } from 'telegraf';

class MessageSender {
    constructor(private bot: Telegraf<Context<any>>) {}

    /**
     * 发送基本消息
     * @param chatId
     * @param text
     */
    async sendBasicMessage(chatId: string, text: string): Promise<void> {
        await this.bot.telegram.sendMessage(chatId, text);
    }

    /**
     * 发送格式化消息
     * @param chatId
     * @param text
     * @param formatType
     */
    async sendFormattedMessage(chatId: string, text: string): Promise<void> {
        await this.bot.telegram.sendMessage(chatId, text, { parse_mode: 'Markdown' });
    }

    async sendButtonMessage(chatId: string, text: string): Promise<void> {
        await this.bot.telegram.sendMessage(
            chatId,
            text,
            Markup.inlineKeyboard([
                Markup.button.url('Visit GitHub', 'https://github.com'),
                Markup.button.callback('Click me', 'click_me'),
            ]),
        );
    }

    /**
     * 发送带有自定义键盘的消息
     * @param chatId
     * @param text
     * @param buttonTexts
     */
    async sendCustomKeyboardMessage(
        chatId: string,
        text: string,
        buttonTexts: string[][],
    ): Promise<void> {
        const keyboard = Markup.keyboard(buttonTexts).resize();
        await this.bot.telegram.sendMessage(chatId, text, keyboard);
    }
}

export default MessageSender;
