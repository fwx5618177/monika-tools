# Project Root

This project includes a Telegram bot and a mini program with TON payment integration. The project is divided into three main parts: the client, the bot, and the backend.

## Table of Contents
- [Project Root](#project-root)
  - [Table of Contents](#table-of-contents)
  - [Project Structure](#project-structure)
  - [Client](#client)
    - [Features](#features)
  - [Bot](#bot)
    - [Features](#features-1)
  - [Backend](#backend)
    - [Features](#features-2)
  - [Setup Instructions](#setup-instructions)
  - [Architecture Design](#architecture-design)
    - [Client Architecture](#client-architecture)
    - [Telegram Bot Architecture](#telegram-bot-architecture)
    - [Backend Architecture](#backend-architecture)
    - [TON Payment Integration](#ton-payment-integration)
    - [Multi-language Support](#multi-language-support)

## Project Structure

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

## Client

The client part of the project is a mini program consisting of 6 main pages:
1. **Selection1 Page** (`/pages/selection1`)
2. **Selection2 Page** (`/pages/selection2`)
3. **Payment Page** (`/pages/payment`)
4. **Payment Result Page** (`/pages/payment-result`)
5. **Account Page** (`/pages/account`)
6. **Settings Page** (`/pages/settings`)

### Features
- Multi-language support (English and Chinese)
- Integration with TON payment
- Responsive UI components

## Bot

The bot part of the project is a Telegram bot that interacts with users and supports multiple languages.

### Features
- Command and message handling
- Multi-language support (English and Chinese)
- Integration with backend for payment and data storage

## Backend

The backend part of the project is a Node.js server built with Express.js. It handles the core functionalities like payment processing, responses, and data storage.

### Features
- Payment processing with TON
- API endpoints for client and bot interactions
- MongoDB or PostgreSQL for data storage

## Setup Instructions

1. Clone the repository:
   ```sh
   git clone <repository-url>
   cd project-root
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Create a `.env` file in the root directory and add your environment variables:
   ```plaintext
   PORT=3000
   DB_CONNECTION_STRING=<your-database-connection-string>
   BOT_TOKEN=<your-telegram-bot-token>
   TON_API_KEY=<your-ton-api-key>
   ```

4. Build the TypeScript files:
   ```sh
   npm run build
   ```

5. Start the backend server:
   ```sh
   npm start
   ```

6. Start the client:
   ```sh
   npm run start:client
   ```

7. Start the bot:
   ```sh
   npm run start:bot
   ```

## Architecture Design

### Client Architecture
- Developed with React (or Vue if preferred)
- Page routing managed by React Router (or Vue Router)
- Multi-language support using i18n library
- API requests handled by Axios or Fetch

### Telegram Bot Architecture
- Developed with Node.js and Telegraf library
- Command and message handling through middleware
- Multi-language support using i18n library
- API requests to backend using Axios or node-fetch

### Backend Architecture
- Developed with Node.js and Express.js
- MongoDB or PostgreSQL as the database
- Mongoose or Sequelize for ORM
- Layered architecture with controllers, services, and models
- User authentication and authorization with JWT or OAuth2
- Environment variables managed with dotenv

### TON Payment Integration
- TON payment gateway for processing payments
- Backend handles payment requests and stores payment records
- Payment result page displays payment outcomes

### Multi-language Support
- JSON files for different languages in both client and bot
- Backend returns responses in different languages based on user settings or request headers

This architecture ensures modularity, maintainability, and scalability of the project. Each part of the project is isolated and can be developed and deployed independently.
