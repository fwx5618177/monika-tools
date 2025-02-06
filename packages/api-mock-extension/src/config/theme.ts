export interface Theme {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textLight: string;
    border: string;
    error: string;
    success: string;
    warning: string;
  };
}

export const themes: Theme[] = [
  {
    id: 'deep-blue',
    name: '深海蓝',
    colors: {
      primary: '#0066FF',
      secondary: '#00C7FF',
      background: '#FFFFFF',
      surface: '#F5F9FF',
      text: '#1A1F36',
      textLight: '#626F86',
      border: '#E6E8F0',
      error: '#FF4D4F',
      success: '#52C41A',
      warning: '#FAAD14',
    },
  },
  {
    id: 'elegant-purple',
    name: '优雅紫',
    colors: {
      primary: '#8B5CF6',
      secondary: '#A78BFA',
      background: '#FFFFFF',
      surface: '#F8F7FC',
      text: '#2D3748',
      textLight: '#718096',
      border: '#E2E8F0',
      error: '#E53E3E',
      success: '#48BB78',
      warning: '#ECC94B',
    },
  },
  {
    id: 'forest-green',
    name: '森林绿',
    colors: {
      primary: '#059669',
      secondary: '#34D399',
      background: '#FFFFFF',
      surface: '#F0FDF4',
      text: '#1F2937',
      textLight: '#6B7280',
      border: '#E5E7EB',
      error: '#DC2626',
      success: '#059669',
      warning: '#F59E0B',
    },
  },
  {
    id: 'dark',
    name: '暗夜',
    colors: {
      primary: '#60A5FA',
      secondary: '#93C5FD',
      background: '#1F2937',
      surface: '#374151',
      text: '#F9FAFB',
      textLight: '#D1D5DB',
      border: '#4B5563',
      error: '#EF4444',
      success: '#10B981',
      warning: '#F59E0B',
    },
  },
];
