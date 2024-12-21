import { Client, GatewayIntentBits } from 'discord.js';

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

client.once('ready', () => {
  console.log(`已登录为 ${client.user?.tag}`);
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'ping') {
    await interaction.reply('Pong!');
  }
});

client.on('error', console.log);

client.on('messageCreate', (message) => {
  // 避免机器人自己回应自己
  if (message.author.bot) return;

  // 获取频道的ID
  const channelId = message.channel.id;

  // 在特定的讨论频道中回应消息
  if (channelId === '1157397992698040361') {
    message.channel.send(`你发送了消息: ${message.content}`);
  }
});

// 启动机器人
client.login('');
