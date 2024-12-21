import { Telegraf } from "telegraf";

export interface IBotPlugin {
  init(): Promise<void> | void; // 在插件注册前进行初始化
  register(bot: Telegraf<any>): void; // 注册插件的主要逻辑
  stop(): Promise<void> | void; // 当机器人停止时执行清理或其他停止逻辑
}
