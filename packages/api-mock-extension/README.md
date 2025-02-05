# Monika Tools 浏览器扩展

一个强大的 Chrome 浏览器扩展工具集，包含 API Mock、请求日志等功能。使用 TypeScript 和 React 构建。

## 主要功能

- 🚀 支持拦截任何 HTTP 请求（XHR 和 Fetch）
- 🎯 支持正则表达式的 URL 匹配
- ⚡ 零配置，即装即用
- 🎨 美观直观的用户界面
- 📊 请求日志和监控（即将上线）
- ⏱️ 模拟响应延迟
- 🔄 实时配置更新
- 📱 响应式设计，支持移动端
- 🛠️ 多功能工具集成

## 安装方法

1. 克隆仓库：

```bash
git clone https://github.com/yourusername/monika-tools.git
cd monika-tools
```

2. 安装依赖：

```bash
pnpm install
```

3. 构建扩展：

```bash
pnpm build
```

4. 在 Chrome 中加载扩展：
   - 打开 Chrome，访问 `chrome://extensions`
   - 开启"开发者模式"
   - 点击"加载已解压的扩展程序"
   - 选择 `dist` 目录

## 开发指南

1. 启动开发服务器：

```bash
pnpm dev
```

2. 修改代码
3. 扩展会自动重新加载你的更改

## 项目结构

```
src/
├── background/           # 后台服务
│   ├── services/        # 后台服务层
│   │   ├── mockService.ts    # Mock 服务，处理规则匹配和配置管理
│   │   └── storageService.ts # 存储服务，处理数据持久化
│   ├── interfaces/      # 类型定义
│   │   └── types.ts     # 定义 Mock 规则、配置等类型
│   └── index.ts         # 后台入口，处理消息通信
├── content/             # 内容脚本
│   ├── services/        # 内容脚本服务
│   │   └── interceptor.ts    # 请求拦截器，拦截 XHR 和 Fetch
│   └── index.ts         # 内容脚本入口
├── popup/               # 弹出窗口
│   ├── components/      # React 组件
│   │   ├── RuleForm.tsx      # 规则表单组件
│   │   ├── RuleList.tsx      # 规则列表组件
│   │   └── Switch.tsx        # 开关组件
│   ├── hooks/          # 自定义 Hooks
│   │   └── useMockRules.ts   # Mock 规则管理 Hook
│   ├── styles/         # SCSS 模块
│   │   ├── Popup.module.scss     # 弹出窗口样式
│   │   ├── global.scss           # 全局样式
│   │   └── components/           # 组件样式
│   └── index.tsx       # 弹出窗口入口
├── styles/             # 全局样式
│   ├── variables.scss  # SCSS 变量
│   └── mixins.scss     # SCSS 混入
└── common/             # 公共代码
    └── constants.ts    # 常量定义
```

## 功能模块

### API Mock

- 支持拦截 XMLHttpRequest 和 Fetch 请求
- 灵活的 URL 匹配规则（支持正则表达式）
- 可配置的响应延迟
- 自定义响应数据和状态码
- 实时启用/禁用单个规则
- 支持自定义响应头

### 请求日志（即将上线）

- 实时请求监控
- 详细的请求信息记录
- 响应数据查看
- 性能分析

### 设置（即将上线）

- 全局配置管理
- 主题切换
- 导入/导出配置
- 快捷键设置

## Mock 规则配置示例

```json
{
  "id": "unique-id",
  "url": "api/users/\\d+", // 正则表达式模式
  "method": "GET",
  "statusCode": 200,
  "response": {
    "id": 1,
    "name": "张三",
    "email": "zhangsan@example.com"
  },
  "headers": {
    "Content-Type": "application/json",
    "Custom-Header": "value"
  },
  "delay": 1000, // 延迟毫秒数
  "enabled": true
}
```

## 实现细节

### 后台服务 (Background)

- **MockService**: 负责管理 Mock 规则和配置

  - 规则匹配和验证
  - 配置状态管理
  - 规则增删改查

- **StorageService**: 负责数据持久化
  - 使用 Chrome Storage API
  - 配置数据管理
  - 请求日志存储

### 内容脚本 (Content)

- **RequestInterceptor**: 负责请求拦截
  - 拦截 XMLHttpRequest
  - 拦截 Fetch API
  - 模拟响应和延迟

### 弹出窗口 (Popup)

- **组件化设计**

  - 规则表单组件
  - 规则列表组件
  - 开关组件

- **响应式布局**
  - 移动端适配
  - 侧边栏导航
  - 多功能区域

## 常见问题

### 如何编写 URL 匹配规则？

- 支持完整 URL 匹配
- 支持正则表达式
- 支持通配符匹配

示例：

- 完整匹配：`https://api.example.com/users`
- 正则匹配：`api/users/\\d+`
- 通配符：`*api.example.com/*`

### 如何调试请求？

1. 打开开发者工具
2. 查看 Console 面板中的日志
3. 检查 Network 面板中的请求

## 参与贡献

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m '添加新特性'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 提交 Pull Request

## 开源协议

本项目基于 MIT 协议开源 - 查看 [LICENSE](LICENSE) 文件了解详情

## 技术栈

- [TypeScript](https://www.typescriptlang.org/) - 类型安全的 JavaScript 超集
- [React](https://reactjs.org/) - 用户界面框架
- [Vite](https://vitejs.dev/) - 现代前端构建工具
- [SCSS Modules](https://github.com/css-modules/css-modules) - 模块化 CSS 方案
