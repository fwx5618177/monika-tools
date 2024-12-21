import TelegramBot from 'node-telegram-bot-api';

// 在这里替换为你的 Telegram 机器人令牌
const token = 'x';

// 代理设置（如果需要，请替换为你的代理信息）
const proxy = {
  host: '192.168.3.47',
  port: 7890, // 替换为你的代理端口
  protocol: 'socket', // 替换为你的代理协议
};

// 创建一个 Telegram 机器人实例
const bot = new TelegramBot(token, {
  polling: true,
  request: {
    proxy: proxy,
    url: 'socket5://192.168.3.47:7890',
  },
});

// 当机器人收到/start命令时，回复欢迎消息
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, '欢迎使用我的 Telegram 机器人！');
});

// 当机器人收到文本消息时，回复相同的消息
bot.on('text', (msg) => {
  const chatId = msg.chat.id;
  const messageText = msg.text;
  bot.sendMessage(chatId, `你发送了消息: ${messageText}`);
});

// 启动机器人
bot.on('polling_error', (error) => {
  console.log(`Polling error: ${error}`);
});
