// Color palette
export const colors = {
  primary: '#7C3AED', // Vibrant purple
  secondary: '#3CD88F', // Bright green
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
  success: '#3CD88F',
  danger: '#FF6384',
  warning: '#FFD166',
};

// Typography
export const typography = {
  fonts: {
    heading: "'Poppins', 'Inter', sans-serif",
    body: "'Inter', 'Poppins', sans-serif",
  },
  fontWeights: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
  lineHeights: {
    tight: 1.1,
    normal: 1.5,
    relaxed: 1.7,
  },
};

// Shadows
export const shadows = {
  sm: '0 1px 2px 0 rgba(124, 58, 237, 0.05)',
  md: '0 4px 16px 0 rgba(124, 58, 237, 0.10), 0 2px 4px -1px rgba(60, 216, 143, 0.06)',
  lg: '0 20px 40px -5px rgba(124, 58, 237, 0.15), 0 10px 20px -5px rgba(60, 216, 143, 0.08)',
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
    background: linear-gradient(135deg, ${colors.secondary}, ${colors.primary});
    color: white;
    border: none;
    box-shadow: ${shadows.sm};
    
    &:hover {
      transform: translateY(-1px) scale(1.03);
      background: linear-gradient(135deg, ${colors.primary}, ${colors.secondary});
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
      border-color: ${colors.secondary};
      background: ${colors.background.primary};
      box-shadow: 0 0 0 4px ${colors.secondary}15;
    }
  `
}; 