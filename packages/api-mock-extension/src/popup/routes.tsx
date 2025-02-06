import React from 'react';
import { ApiMockPage } from './pages/ApiMockPage';
import { RequestLogPage } from './pages/RequestLogPage';
import SettingsPage from './pages/SettingsPage';
import { HomePage } from './pages/HomePage';
import { JsonToolsPage } from './pages/JsonToolsPage';

export interface RouteConfig {
  path: string;
  element: React.ReactNode;
  title: string;
  icon?: string;
  showInHome?: boolean;
  description?: string;
}

export const routes: RouteConfig[] = [
  {
    path: '/',
    element: <HomePage />,
    title: '首页',
    showInHome: false,
  },
  {
    path: '/api-mock',
    element: <ApiMockPage />,
    title: 'API Mock',
    icon: '🚀',
    showInHome: true,
    description: '模拟 API 响应，支持正则匹配和自定义响应',
  },
  {
    path: '/request-log',
    element: <RequestLogPage />,
    title: '请求日志',
    icon: '📊',
    showInHome: true,
    description: '查看和分析 HTTP 请求日志',
  },
  {
    path: '/web-crawler',
    element: <div>开发中...</div>,
    title: '网页爬虫',
    icon: '🕷️',
    showInHome: true,
    description: '爬取网页数据，支持自定义规则和数据导出',
  },
  {
    path: '/image-tools',
    element: <div>开发中...</div>,
    title: '图片工具',
    icon: '🖼️',
    showInHome: true,
    description: '图片批量处理、压缩、格式转换等',
  },
  {
    path: '/json-tools',
    element: <JsonToolsPage />,
    title: 'JSON 工具',
    icon: '📝',
    showInHome: true,
    description: 'JSON 格式化、比较、转换、验证等多功能工具集',
  },
  {
    path: '/code-generator',
    element: <div>开发中...</div>,
    title: '代码生成器',
    icon: '⚡',
    showInHome: true,
    description: '生成各类模板代码、接口定义等',
  },
  {
    path: '/network-tools',
    element: <div>开发中...</div>,
    title: '网络工具',
    icon: '🌐',
    showInHome: true,
    description: 'Ping、DNS查询、端口扫描等',
  },
  {
    path: '/settings',
    element: <SettingsPage />,
    title: '设置',
    icon: '⚙️',
    showInHome: true,
    description: '配置扩展程序选项',
  },
];
