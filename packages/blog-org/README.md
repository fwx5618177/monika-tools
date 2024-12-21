# Self Website

1. Support SSR/SSG/ISR

## Rule

- Local 内使用 fetch
- 外部 API 请求使用封装的 API 接口

## 1. Installation

1. pnpm i

## 2. 常见设计

1. SSG - 静态生成本地需要数据
2. 数据更新
   1. 文件名 hash
   2. title hash
   3. content hash

## 3. TODO

- [x] 默认 SSG 获取基础数据针对 SEO 和本地处理
- [x] 修改本地 API 的数据读取和存储
- [ ] 增加 API 请求
- [ ] PDF 阅读
- [ ] 本地是否上传的逻辑

### Important and Easy to Solve

1. - [x] Types and declare refactor
2. - [x] API refactor
3. - [x] API keywords
4. - [x] Remove API default value, set it in front

- [x] SpringBoot for this render layer
- [ ] Go SSO store for comment
  - [ ] IPv6
- [ ] Dashboard
- [ ] Render Blog method
- [ ] About
