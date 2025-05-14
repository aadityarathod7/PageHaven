// Color palette
export const colors = {
    primary: '#2D3047', // Deep blue-gray
    secondary: '#419D78', // Forest green
    text: {
        primary: '#2D3047',
        secondary: '#516170',
        light: '#94A3B8'
    },
    background: {
        primary: '#FFFFFF',
        secondary: '#F8FAFC',
        accent: '#E2E8F0'
    },
    accent: '#E63946', // Accent red
    success: '#059669',
    danger: '#DC2626',
    warning: '#D97706'
};

// Typography
export const typography = {
    fonts: {
        body: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        heading: "'Fraunces', serif"
    },
    fontWeights: {
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
        extrabold: 800
    },
    lineHeights: {
        tight: 1.1,
        normal: 1.5,
        relaxed: 1.7
    }
};

// Shadows
export const shadows = {
    sm: '0 1px 2px 0 rgba(45, 48, 71, 0.05)',
    md: '0 4px 6px -1px rgba(45, 48, 71, 0.1), 0 2px 4px -1px rgba(45, 48, 71, 0.06)',
    lg: '0 20px 25px -5px rgba(45, 48, 71, 0.1), 0 10px 10px -5px rgba(45, 48, 71, 0.04)'
};

// Spacing
export const spacing = {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem'
};

// Border radius
export const borderRadius = {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.5rem',
    full: '9999px'
};

// Transitions
export const transitions = {
    default: 'all 0.2s ease',
    fast: 'all 0.1s ease',
    slow: 'all 0.3s ease'
};

// Common styles
export const commonStyles = {
    cardStyle: `
    background: ${colors.background.primary};
    border-radius: ${borderRadius.xl};
    box-shadow: ${shadows.md};
    transition: ${transitions.default};
    border: 1px solid ${colors.background.accent};

    &:hover {
      transform: translateY(-2px);
      box-shadow: ${shadows.lg};
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
    
    &:hover {
      transform: translateY(-1px);
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