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
  typography: {
    fontFamily: string;
    fontFamilyCode: string;
    baseFontSize: string;
    baseLineHeight: string;
    fontSizes: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
      xxl: string;
    };
    fontWeights: {
      light: number;
      normal: number;
      medium: number;
      semibold: number;
      bold: number;
    };
  };
  spacing: {
    unit: string;
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    xxl: string;
  };
  borderRadius: {
    none: string;
    sm: string;
    md: string;
    lg: string;
    full: string;
  };
  shadows: {
    none: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
}

export const themes: Theme[] = [
  {
    id: 'light',
    name: '浅色',
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
    typography: {
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      fontFamilyCode:
        'SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace',
      baseFontSize: '14px',
      baseLineHeight: '1.5',
      fontSizes: {
        xs: '12px',
        sm: '14px',
        md: '16px',
        lg: '18px',
        xl: '20px',
        xxl: '24px',
      },
      fontWeights: {
        light: 300,
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
      },
    },
    spacing: {
      unit: '4px',
      xs: '4px',
      sm: '8px',
      md: '16px',
      lg: '24px',
      xl: '32px',
      xxl: '48px',
    },
    borderRadius: {
      none: '0',
      sm: '2px',
      md: '4px',
      lg: '8px',
      full: '9999px',
    },
    shadows: {
      none: 'none',
      sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
      md: '0 2px 4px rgba(0, 0, 0, 0.1)',
      lg: '0 4px 6px rgba(0, 0, 0, 0.1)',
      xl: '0 8px 12px rgba(0, 0, 0, 0.1)',
    },
  },
  {
    id: 'dark',
    name: '深色',
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
    typography: {
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      fontFamilyCode:
        'SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace',
      baseFontSize: '14px',
      baseLineHeight: '1.5',
      fontSizes: {
        xs: '12px',
        sm: '14px',
        md: '16px',
        lg: '18px',
        xl: '20px',
        xxl: '24px',
      },
      fontWeights: {
        light: 300,
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
      },
    },
    spacing: {
      unit: '4px',
      xs: '4px',
      sm: '8px',
      md: '16px',
      lg: '24px',
      xl: '32px',
      xxl: '48px',
    },
    borderRadius: {
      none: '0',
      sm: '2px',
      md: '4px',
      lg: '8px',
      full: '9999px',
    },
    shadows: {
      none: 'none',
      sm: '0 1px 2px rgba(0, 0, 0, 0.2)',
      md: '0 2px 4px rgba(0, 0, 0, 0.3)',
      lg: '0 4px 6px rgba(0, 0, 0, 0.4)',
      xl: '0 8px 12px rgba(0, 0, 0, 0.4)',
    },
  },
];
