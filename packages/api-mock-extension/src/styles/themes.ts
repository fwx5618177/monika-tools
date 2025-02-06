export interface Theme {
  id: string;
  name: string;
  colors: {
    primary: string;
    primaryDark: string;
    secondary: string;
    background: string;
    backgroundLight: string;
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
    id: 'blue',
    name: '深海蓝',
    colors: {
      primary: '#0066FF',
      primaryDark: '#0052CC',
      secondary: '#00C7FF',
      background: '#FFFFFF',
      backgroundLight: '#F5F9FF',
      text: '#1A1F36',
      textLight: '#626F86',
      border: '#E6E8F0',
      error: '#FF4D4F',
      success: '#52C41A',
      warning: '#FAAD14',
    },
  },
  {
    id: 'purple',
    name: '优雅紫',
    colors: {
      primary: '#6B4FBB',
      primaryDark: '#553399',
      secondary: '#9F7AEA',
      background: '#FFFFFF',
      backgroundLight: '#F8F7FC',
      text: '#2D3748',
      textLight: '#718096',
      border: '#E2E8F0',
      error: '#E53E3E',
      success: '#48BB78',
      warning: '#ECC94B',
    },
  },
  {
    id: 'green',
    name: '森林绿',
    colors: {
      primary: '#059669',
      primaryDark: '#047857',
      secondary: '#34D399',
      background: '#FFFFFF',
      backgroundLight: '#F0FDF4',
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
      primaryDark: '#3B82F6',
      secondary: '#93C5FD',
      background: '#1F2937',
      backgroundLight: '#374151',
      text: '#F9FAFB',
      textLight: '#D1D5DB',
      border: '#4B5563',
      error: '#EF4444',
      success: '#10B981',
      warning: '#F59E0B',
    },
  },
];
