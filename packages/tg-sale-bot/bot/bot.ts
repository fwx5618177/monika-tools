import { Telegraf } from 'telegraf';
import { HttpsProxyAgent } from 'https-proxy-agent';

const bot = new Telegraf('xxx', {
  telegram: {
    agent: new HttpsProxyAgent('http://192.168.3.173:7890'),
  },
});

bot.start((ctx) => {
  ctx.reply('Welcome! Click the button below to open the Web App.', {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: 'Open Web App',
            web_app: { url: 'https://tg-sale-bot.vercel.app/' },
          },
        ],
      ],
    },
  });
});

bot.on('message', (ctx) => {
  ctx.reply('Hello! Click the button below to open the Web App.', {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: 'Open Web App',
            web_app: { url: 'https://tg-sale-bot.vercel.app/' },
          },
        ],
      ],
    },
  });
});

bot.launch();
