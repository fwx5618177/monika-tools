# TG - Bot

TG bot，主要是用来做量化交易。 ESM 格式。

功能：

1. 接收 ws 的数据
   1. 分析、处理数据
2. 量化策略
   1. 策略回测
   2. 策略优化
   3. 策略监控
   4. 策略调整
3. 交易
4. 通知
5. 数据库

## 目录

```bash
telegram-bot/
│
├── src/
│   ├── pkg/
│   │   ├── data/
│   │   │   ├── websocket/        # WebSocket数据处理
│   │   │   │   ├── dataReceiver.ts  # 接收数据
│   │   │   │   └── dataAnalyzer.ts  # 分析、处理数据
│   │   │   └── database/         # 数据库交互
│   │   │       ├── dbClient.ts   # 数据库客户端初始化
│   │   │       └── models/       # 数据模型定义
│   │   │
│   │   ├── strategies/           # 量化策略
│   │   │   ├── strategyCore.ts   # 策略核心逻辑
│   │   │   ├── backtest/         # 策略回测
│   │   │   ├── optimization/     # 策略优化
│   │   │   ├── monitoring/       # 策略监控
│   │   │   └── adjustment/       # 策略调整
│   │   │
│   │   ├── trade/                # 交易执行逻辑
│   │   │   ├── tradeExecutor.ts  # 执行交易
│   │   │   └── tradeManager.ts   # 管理交易状态和订单
│   │   │
│   │   └── notifications/        # 用户通知
│   │       └── notifier.ts       # 发送通知逻辑
│   │
│   ├── bot/                     # Telegram Bot相关逻辑
│   │   └── botSetup.ts           # Bot设置和命令定义
│   │
│   └── index.ts                  # 应用入口点
│
├── dist/                         # TypeScript编译输出目录
├── node_modules/                 # 项目依赖
├── package.json                  # 项目元数据和依赖列表
├── tsconfig.json                 # TypeScript配置
└── .gitignore                    # Git忽略设置
```

## 模块功能描述

- data/websocket/: 包含 WebSocket 数据流的处理逻辑，如接收市场数据和分析这些数据以提取有用信息。
- data/database/: 管理数据库连接和交互，包括数据模型和存储逻辑。
- strategies/: 量化策略开发的核心目录，包括策略的定义、回测、优化、监控和调整。
- trade/: 负责执行交易命令，管理交易状态和订单。
- notifications/: 处理向用户发送通知的逻辑，比如交易提醒、重要市场事件等。
- bot.ts: Telegram Bot 的主要逻辑，处理用户命令和交互。
- index.ts: 项目的启动入口点，负责初始化和启动应用。

# TODO

1. 发布版本提示
