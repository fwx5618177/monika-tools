import React from 'react';
import { ApiMockPage } from './pages/ApiMockPage';
import { RequestLogPage } from './pages/RequestLogPage';
import { SettingsPage } from './pages/SettingsPage';
import { HomePage } from './pages/HomePage';

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
    path: '/settings',
    element: <SettingsPage />,
    title: '设置',
    icon: '⚙️',
    showInHome: true,
    description: '配置扩展程序选项',
  },
];
