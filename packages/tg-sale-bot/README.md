# 项目根目录

这个项目包括一个 Telegram 机器人和一个集成了 TON 支付的小程序。项目分为三个主要部分：客户端、机器人和后端。

## 目录
- [项目结构](#项目结构)
- [客户端](#客户端)
- [机器人](#机器人)
- [后端](#后端)
- [安装说明](#安装说明)
- [架构设计](#架构设计)
- [项目分期](#项目分期)

## 项目结构

```
project-root/
├── client/
│   ├── pages/
│   │   ├── selection1/
│   │   │   └── index.tsx
│   │   ├── selection2/
│   │   │   └── index.tsx
│   │   ├── payment/
│   │   │   └── index.tsx
│   │   ├── payment-result/
│   │   │   └── index.tsx
│   │   ├── account/
│   │   │   └── index.tsx
│   │   └── settings/
│   │       └── index.tsx
│   ├── components/
│   ├── i18n/
│   │   ├── en.json
│   │   └── zh.json
│   ├── utils/
│   ├── App.tsx
│   └── index.tsx
├── bot/
│   ├── handlers/
│   │   ├── startHandler.ts
│   │   ├── paymentHandler.ts
│   │   └── settingsHandler.ts
│   ├── middlewares/
│   ├── i18n/
│   │   ├── en.json
│   │   └── zh.json
│   ├── utils/
│   └── bot.ts
├── backend/
│   ├── controllers/
│   │   ├── paymentController.ts
│   │   ├── responseController.ts
│   │   └── dataStorageController.ts
│   ├── models/
│   │   ├── Payment.ts
│   │   ├── Response.ts
│   │   └── User.ts
│   ├── routes/
│   │   ├── paymentRoutes.ts
│   │   ├── responseRoutes.ts
│   │   └── dataStorageRoutes.ts
│   ├── services/
│   │   ├── paymentService.ts
│   │   ├── responseService.ts
│   │   └── dataStorageService.ts
│   ├── utils/
│   ├── config.ts
│   └── server.ts
├── .env
├── package.json
├── tsconfig.json
└── README.md
```

## 客户端

项目的客户端部分是一个包含六个主要页面的小程序：
1. **选择页面1** (`/pages/selection1`)
2. **选择页面2** (`/pages/selection2`)
3. **支付页面** (`/pages/payment`)
4. **支付结果页面** (`/pages/payment-result`)
5. **账户页面** (`/pages/account`)
6. **设置页面** (`/pages/settings`)

### 功能
- 多语言支持（英语和中文）
- 集成 TON 支付
- 响应式 UI 组件

## 机器人

项目的机器人部分是一个与用户互动并支持多语言的 Telegram 机器人。

### 功能
- 命令和消息处理
- 多语言支持（英语和中文）
- 与后端集成进行支付和数据存储

## 后端

项目的后端部分是一个使用 Express.js 构建的 Node.js 服务器。它处理核心功能，如支付处理、响应和数据存储。

### 功能
- 使用 TON 进行支付处理
- 客户端和机器人交互的 API 端点
- 使用 MongoDB 或 PostgreSQL 进行数据存储

## 安装说明

1. 克隆仓库：
   ```sh
   git clone <repository-url>
   cd project-root
   ```

2. 安装依赖：
   ```sh
   npm install
   ```

3. 在根目录下创建 `.env` 文件并添加你的环境变量：
   ```plaintext
   PORT=3000
   DB_CONNECTION_STRING=<your-database-connection-string>
   BOT_TOKEN=<your-telegram-bot-token>
   TON_API_KEY=<your-ton-api-key>
   ```

4. 构建 TypeScript 文件：
   ```sh
   npm run build
   ```

5. 启动后端服务器：
   ```sh
   npm start
   ```

6. 启动客户端：
   ```sh
   npm run start:client
   ```

7. 启动机器人：
   ```sh
   npm run start:bot
   ```

## 架构设计

### 客户端架构
- 使用 React（或 Vue）框架开发
- 使用 React Router（或 Vue Router）管理页面路由
- 使用 i18n 库实现多语言支持
- 使用 Axios 或 Fetch 进行 API 请求

### Telegram 机器人架构
- 使用 Node.js 和 Telegraf 库开发
- 通过中间件处理命令和消息
- 使用 i18n 库实现多语言支持
- 使用 Axios 或 node-fetch 进行 API 请求

### 后端架构
- 使用 Node.js 和 Express 框架开发
- 使用 MongoDB 或 PostgreSQL 作为数据库
- 使用 Mongoose 或 Sequelize 进行 ORM 操作
- 分层架构设计：控制器、服务、模型
- 使用 JWT 或 OAuth2 实现用户认证和授权
- 使用 dotenv 管理环境变量

### TON 支付集成
- 集成 TON 支付网关进行支付处理
- 后端处理支付请求并存储支付记录
- 支付结果页面展示支付结果

### 多语言支持
- 客户端和机器人使用相同的 JSON 文件进行多语言配置
- 后端可以根据请求头或用户设置返回不同语言的响应

## 项目分期

### 第一期：基础架构和功能实现
1. 搭建项目的基础目录结构和文件。
2. 实现后端的基础功能，包括支付处理、响应和数据存储。
3. 开发 Telegram 机器人的基础功能，实现基本命令和消息处理。

### 第二期：客户端开发
1. 开发客户端的基本页面，包括选择页面、支付页面、支付结果页面、账户页面和设置页面。
2. 实现客户端的多语言支持。

### 第三期：集成和优化
1. 集成客户端、机器人和后端，实现完整的功能流程。
2. 优化用户体验，修复 bug 和进行性能优化。
3. 添加更多高级功能和特性。
