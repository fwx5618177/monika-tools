export interface Theme {
  id: string;
  name: string;
  colors: {
    // 主色调
    primary: string;
    primaryLight: string;
    primaryDark: string;
    secondary: string;
    secondaryLight: string;
    secondaryDark: string;

    // 背景色系
    background: string;
    backgroundLight: string;
    backgroundDark: string;
    surface: string;
    surfaceLight: string;
    surfaceDark: string;

    // 文字色系
    text: string;
    textLight: string;
    textDark: string;
    textMuted: string;
    textInverse: string;

    // 边框和分割线
    border: string;
    borderLight: string;
    borderDark: string;
    divider: string;

    // 状态色
    info: string;
    success: string;
    warning: string;
    error: string;

    // 特殊用途
    link: string;
    linkHover: string;
    selection: string;
    focus: string;
    shadow: string;
  };
}

export const themes: Theme[] = [
  {
    id: 'ocean-blue',
    name: '深海蓝',
    colors: {
      primary: '#0066FF',
      primaryLight: '#3385FF',
      primaryDark: '#0052CC',
      secondary: '#00C7FF',
      secondaryLight: '#33D4FF',
      secondaryDark: '#00A3CC',

      background: '#FFFFFF',
      backgroundLight: '#F8FAFC',
      backgroundDark: '#F1F5F9',
      surface: '#FFFFFF',
      surfaceLight: '#FAFAFA',
      surfaceDark: '#F5F5F5',

      text: '#1A1F36',
      textLight: '#4A5568',
      textDark: '#2D3748',
      textMuted: '#718096',
      textInverse: '#FFFFFF',

      border: '#E2E8F0',
      borderLight: '#EDF2F7',
      borderDark: '#CBD5E0',
      divider: 'rgba(0, 0, 0, 0.06)',

      info: '#3182CE',
      success: '#48BB78',
      warning: '#ECC94B',
      error: '#E53E3E',

      link: '#0066FF',
      linkHover: '#0052CC',
      selection: 'rgba(0, 102, 255, 0.1)',
      focus: 'rgba(0, 102, 255, 0.4)',
      shadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
  },
  {
    id: 'elegant-purple',
    name: '优雅紫',
    colors: {
      primary: '#6B4FBB',
      primaryLight: '#8B6FDB',
      primaryDark: '#553399',
      secondary: '#9F7AEA',
      secondaryLight: '#B794F4',
      secondaryDark: '#805AD5',

      background: '#FFFFFF',
      backgroundLight: '#F8F7FC',
      backgroundDark: '#F3F0FF',
      surface: '#FFFFFF',
      surfaceLight: '#FAFAFE',
      surfaceDark: '#F5F4FA',

      text: '#2D3748',
      textLight: '#4A5568',
      textDark: '#1A202C',
      textMuted: '#718096',
      textInverse: '#FFFFFF',

      border: '#E9ECEF',
      borderLight: '#F8F9FA',
      borderDark: '#DEE2E6',
      divider: 'rgba(0, 0, 0, 0.06)',

      info: '#4C51BF',
      success: '#48BB78',
      warning: '#ECC94B',
      error: '#E53E3E',

      link: '#6B4FBB',
      linkHover: '#553399',
      selection: 'rgba(107, 79, 187, 0.1)',
      focus: 'rgba(107, 79, 187, 0.4)',
      shadow: '0 2px 4px rgba(107, 79, 187, 0.1)',
    },
  },
  {
    id: 'forest-green',
    name: '森林绿',
    colors: {
      primary: '#059669',
      primaryLight: '#34D399',
      primaryDark: '#047857',
      secondary: '#10B981',
      secondaryLight: '#6EE7B7',
      secondaryDark: '#059669',

      background: '#FFFFFF',
      backgroundLight: '#F0FDF4',
      backgroundDark: '#DCFCE7',
      surface: '#FFFFFF',
      surfaceLight: '#F8FAF8',
      surfaceDark: '#F3F6F3',

      text: '#1F2937',
      textLight: '#4B5563',
      textDark: '#111827',
      textMuted: '#6B7280',
      textInverse: '#FFFFFF',

      border: '#E5E7EB',
      borderLight: '#F3F4F6',
      borderDark: '#D1D5DB',
      divider: 'rgba(0, 0, 0, 0.06)',

      info: '#059669',
      success: '#059669',
      warning: '#F59E0B',
      error: '#DC2626',

      link: '#059669',
      linkHover: '#047857',
      selection: 'rgba(5, 150, 105, 0.1)',
      focus: 'rgba(5, 150, 105, 0.4)',
      shadow: '0 2px 4px rgba(5, 150, 105, 0.1)',
    },
  },
  {
    id: 'sunset-orange',
    name: '日落橙',
    colors: {
      primary: '#F97316',
      primaryLight: '#FB923C',
      primaryDark: '#EA580C',
      secondary: '#FDBA74',
      secondaryLight: '#FED7AA',
      secondaryDark: '#FB923C',

      background: '#FFFFFF',
      backgroundLight: '#FFF7ED',
      backgroundDark: '#FFEDD5',
      surface: '#FFFFFF',
      surfaceLight: '#FFFAF8',
      surfaceDark: '#FFF5F2',

      text: '#431407',
      textLight: '#9A3412',
      textDark: '#7C2D12',
      textMuted: '#C2410C',
      textInverse: '#FFFFFF',

      border: '#FFEDD5',
      borderLight: '#FFF7ED',
      borderDark: '#FED7AA',
      divider: 'rgba(249, 115, 22, 0.06)',

      info: '#F97316',
      success: '#84CC16',
      warning: '#FBBF24',
      error: '#DC2626',

      link: '#F97316',
      linkHover: '#EA580C',
      selection: 'rgba(249, 115, 22, 0.1)',
      focus: 'rgba(249, 115, 22, 0.4)',
      shadow: '0 2px 4px rgba(249, 115, 22, 0.1)',
    },
  },
  {
    id: 'cherry-pink',
    name: '樱花粉',
    colors: {
      primary: '#EC4899',
      primaryLight: '#F472B6',
      primaryDark: '#DB2777',
      secondary: '#F9A8D4',
      secondaryLight: '#FBCFE8',
      secondaryDark: '#F472B6',

      background: '#FFFFFF',
      backgroundLight: '#FDF2F8',
      backgroundDark: '#FCE7F3',
      surface: '#FFFFFF',
      surfaceLight: '#FFF9FC',
      surfaceDark: '#FFF5FA',

      text: '#831843',
      textLight: '#BE185D',
      textDark: '#9D174D',
      textMuted: '#DB2777',
      textInverse: '#FFFFFF',

      border: '#FCE7F3',
      borderLight: '#FDF2F8',
      borderDark: '#FBCFE8',
      divider: 'rgba(236, 72, 153, 0.06)',

      info: '#EC4899',
      success: '#84CC16',
      warning: '#FBBF24',
      error: '#DC2626',

      link: '#EC4899',
      linkHover: '#DB2777',
      selection: 'rgba(236, 72, 153, 0.1)',
      focus: 'rgba(236, 72, 153, 0.4)',
      shadow: '0 2px 4px rgba(236, 72, 153, 0.1)',
    },
  },
  {
    id: 'ocean-teal',
    name: '海洋青',
    colors: {
      primary: '#0D9488',
      primaryLight: '#2DD4BF',
      primaryDark: '#0F766E',
      secondary: '#5EEAD4',
      secondaryLight: '#99F6E4',
      secondaryDark: '#2DD4BF',

      background: '#FFFFFF',
      backgroundLight: '#F0FDFA',
      backgroundDark: '#CCFBF1',
      surface: '#FFFFFF',
      surfaceLight: '#F8FDFB',
      surfaceDark: '#F3FAF9',

      text: '#134E4A',
      textLight: '#115E59',
      textDark: '#042F2E',
      textMuted: '#0F766E',
      textInverse: '#FFFFFF',

      border: '#CCFBF1',
      borderLight: '#F0FDFA',
      borderDark: '#99F6E4',
      divider: 'rgba(13, 148, 136, 0.06)',

      info: '#0D9488',
      success: '#84CC16',
      warning: '#FBBF24',
      error: '#DC2626',

      link: '#0D9488',
      linkHover: '#0F766E',
      selection: 'rgba(13, 148, 136, 0.1)',
      focus: 'rgba(13, 148, 136, 0.4)',
      shadow: '0 2px 4px rgba(13, 148, 136, 0.1)',
    },
  },
  {
    id: 'royal-indigo',
    name: '皇家靛',
    colors: {
      primary: '#4F46E5',
      primaryLight: '#6366F1',
      primaryDark: '#4338CA',
      secondary: '#818CF8',
      secondaryLight: '#A5B4FC',
      secondaryDark: '#6366F1',

      background: '#FFFFFF',
      backgroundLight: '#EEF2FF',
      backgroundDark: '#E0E7FF',
      surface: '#FFFFFF',
      surfaceLight: '#F8FAFF',
      surfaceDark: '#F3F6FF',

      text: '#312E81',
      textLight: '#4338CA',
      textDark: '#3730A3',
      textMuted: '#4F46E5',
      textInverse: '#FFFFFF',

      border: '#E0E7FF',
      borderLight: '#EEF2FF',
      borderDark: '#C7D2FE',
      divider: 'rgba(79, 70, 229, 0.06)',

      info: '#4F46E5',
      success: '#84CC16',
      warning: '#FBBF24',
      error: '#DC2626',

      link: '#4F46E5',
      linkHover: '#4338CA',
      selection: 'rgba(79, 70, 229, 0.1)',
      focus: 'rgba(79, 70, 229, 0.4)',
      shadow: '0 2px 4px rgba(79, 70, 229, 0.1)',
    },
  },
  {
    id: 'rose-red',
    name: '玫瑰红',
    colors: {
      primary: '#E11D48',
      primaryLight: '#FB7185',
      primaryDark: '#BE123C',
      secondary: '#FDA4AF',
      secondaryLight: '#FECDD3',
      secondaryDark: '#FB7185',

      background: '#FFFFFF',
      backgroundLight: '#FFF1F2',
      backgroundDark: '#FFE4E6',
      surface: '#FFFFFF',
      surfaceLight: '#FFF8F9',
      surfaceDark: '#FFF5F6',

      text: '#881337',
      textLight: '#9F1239',
      textDark: '#BE123C',
      textMuted: '#E11D48',
      textInverse: '#FFFFFF',

      border: '#FFE4E6',
      borderLight: '#FFF1F2',
      borderDark: '#FECDD3',
      divider: 'rgba(225, 29, 72, 0.06)',

      info: '#E11D48',
      success: '#84CC16',
      warning: '#FBBF24',
      error: '#DC2626',

      link: '#E11D48',
      linkHover: '#BE123C',
      selection: 'rgba(225, 29, 72, 0.1)',
      focus: 'rgba(225, 29, 72, 0.4)',
      shadow: '0 2px 4px rgba(225, 29, 72, 0.1)',
    },
  },
  {
    id: 'dark',
    name: '暗夜',
    colors: {
      primary: '#60A5FA',
      primaryLight: '#93C5FD',
      primaryDark: '#3B82F6',
      secondary: '#818CF8',
      secondaryLight: '#A5B4FC',
      secondaryDark: '#6366F1',

      background: '#111827',
      backgroundLight: '#1F2937',
      backgroundDark: '#0F172A',
      surface: '#1F2937',
      surfaceLight: '#374151',
      surfaceDark: '#111827',

      text: '#F9FAFB',
      textLight: '#E5E7EB',
      textDark: '#FFFFFF',
      textMuted: '#9CA3AF',
      textInverse: '#111827',

      border: '#374151',
      borderLight: '#4B5563',
      borderDark: '#1F2937',
      divider: 'rgba(255, 255, 255, 0.06)',

      info: '#60A5FA',
      success: '#34D399',
      warning: '#FBBF24',
      error: '#F87171',

      link: '#60A5FA',
      linkHover: '#93C5FD',
      selection: 'rgba(96, 165, 250, 0.2)',
      focus: 'rgba(96, 165, 250, 0.4)',
      shadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
    },
  },
];
