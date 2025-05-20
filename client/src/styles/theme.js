// Color palette
export const colors = {
  primary: '#7C3AED', // Vibrant purple
  secondary: '#7C3AED', // Changed from green to match gradient
  text: {
    primary: '#22223B',
    secondary: '#4A4E69',
    light: '#9A8C98',
  },
  background: {
    primary: '#F7F8FA',
    secondary: '#FFFFFF',
    accent: '#E5E7EB',
  },
  accent: '#F2E9E4',
  success: '#7C3AED', // Changed from green to match gradient
  danger: '#DC2626', // red-600
  warning: '#FFD166',
};

// Typography
export const typography = {
  fonts: {
    heading: "'Playfair Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    body: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  fontWeights: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
};

// Shadows
export const shadows = {
  sm: '0 1px 2px 0 rgba(34, 34, 59, 0.05)',
  md: '0 4px 16px 0 rgba(34, 34, 59, 0.10), 0 2px 4px -1px rgba(124, 58, 237, 0.06)',
  lg: '0 20px 40px -5px rgba(34, 34, 59, 0.15), 0 10px 20px -5px rgba(124, 58, 237, 0.08)',
};

// Spacing
export const spacing = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  '2xl': '3rem',
  '3xl': '4rem',
};

// Border radius
export const borderRadius = {
  sm: '0.5rem',
  md: '0.75rem',
  lg: '1rem',
  xl: '1.5rem',
  '2xl': '2rem',
  full: '9999px',
};

// Transitions
export const transitions = {
  default: 'all 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
  fast: 'all 0.15s cubic-bezier(0.23, 1, 0.32, 1)',
  slow: 'all 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
};

// Gradients
export const gradients = {
  primary: `linear-gradient(135deg, #22223B, #7C3AED)`,
  text: `linear-gradient(135deg, #22223B, #7C3AED)`,
  hover: `linear-gradient(135deg, #7C3AED, #22223B)`,
};

// Common styles
export const commonStyles = {
  cardStyle: `
    background: rgba(255, 255, 255, 0.6);
    border-radius: ${borderRadius.xl};
    box-shadow: ${shadows.md};
    transition: ${transitions.default};
    border: 1px solid ${colors.background.accent};
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    
    &:hover {
      transform: translateY(-2px) scale(1.02);
      box-shadow: ${shadows.lg};
      background: rgba(255,255,255,0.8);
    }
  `,
  buttonStyle: `
    padding: 0.75rem 1.5rem;
    font-weight: ${typography.fontWeights.semibold};
    border-radius: ${borderRadius.lg};
    transition: ${transitions.default};
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    background: ${gradients.primary};
    color: white;
    border: none;
    box-shadow: ${shadows.sm};
    
    &:hover {
      transform: translateY(-1px) scale(1.03);
      background: ${gradients.hover};
    }
  `,
  inputStyle: `
    width: 100%;
    padding: 0.75rem 1rem;
    border: 2px solid ${colors.background.accent};
    border-radius: ${borderRadius.lg};
    font-size: 1rem;
    transition: ${transitions.default};
    background: ${colors.background.secondary};
    color: ${colors.text.primary};
    font-family: ${typography.fonts.body};

    &::placeholder {
      color: ${colors.text.light};
    }

    &:focus {
      outline: none;
      border-color: ${colors.primary};
      background: ${colors.background.primary};
      box-shadow: 0 0 0 4px ${colors.primary}15;
    }
  `
}; 