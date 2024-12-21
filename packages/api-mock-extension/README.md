# api-mock-extension

This is a simple extension for mocking APIs in the browser.

1. It allows you to define a set of API endpoints and their responses in a JSON file, and then use them in your application.

```bash
.
├── README.md
├── global.d.ts
├── index.html
├── manifest.json
├── package.json
├── pnpm-lock.yaml
├── public
│   └── icons
│       ├── icon128.png
│       ├── icon16.png
│       └── icon48.png
├── src
│   ├── background
│   │   ├── index.ts          # 后台脚本，处理事件通信
│   │   ├── mock.json         # 模拟数据
│   │   └── mock.ts           # 模拟数据的处理逻辑
│   ├── content
│   │   ├── index.ts          # 内容脚本，嵌入到网页中
│   │   └── interceptors.ts   # 事件拦截器，监听用户操作
│   ├── main.tsx              # 主入口文件
│   ├── popup                 # Popup 模式的页面
│   │   ├── Popup.tsx         # Popup 主组件
│   │   └── popup.module.less
│   ├── sidebar               # 侧边栏模式的页面
│   │   ├── Sidebar.tsx       # Sidebar 主组件
│   │   └── sidebar.module.less
│   ├── ui
│   │   ├── App.tsx           # 原主应用入口，可复用在 popup 和 sidebar 中
│   │   └── app.module.less
│   └── utils
│       └── common.ts         # 通用工具函数
├── tests
├── tsconfig.json
└── vite.config.ts
```
