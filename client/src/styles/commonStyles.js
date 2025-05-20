import styled from 'styled-components';
import { colors, typography, shadows, transitions, borderRadius, gradients } from './theme';

export const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: ${borderRadius.lg};
  font-weight: ${typography.fontWeights.semibold};
  font-size: 0.95rem;
  border: none;
  cursor: pointer;
  transition: ${transitions.default};
  background: ${props => props.$variant === 'danger' ? colors.danger : gradients.primary};
  color: white;
  box-shadow: ${shadows.md};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${shadows.lg};
    background: ${props => props.$variant === 'danger' ? colors.danger : gradients.hover};
  }

  &:disabled {
    background: ${colors.text.light};
    cursor: not-allowed;
    transform: none;
  }

  svg {
    font-size: 1.1rem;
    transition: ${transitions.default};
  }

  &:hover svg {
    transform: scale(1.1);
  }
`;

export const PageTitle = styled.h1`
  font-family: ${typography.fonts.heading};
  font-size: 2rem;
  font-weight: ${typography.fontWeights.bold};
  margin-bottom: 1.5rem;
  background: ${gradients.text};
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  position: relative;
  display: inline-block;

  &::after {
    content: "";
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 60px;
    height: 3px;
    background: ${gradients.primary};
    border-radius: ${borderRadius.full};
    transition: width 0.3s ease;
  }

  &:hover::after {
    width: 100%;
  }
`;

export const Tag = styled.span`
  font-size: 0.75rem;
  padding: 0.35rem 0.75rem;
  border-radius: ${borderRadius.full};
  background: ${gradients.primary};
  color: white;
  font-weight: ${typography.fontWeights.medium};
  transition: ${transitions.default};

  &:hover {
    transform: translateY(-1px);
    background: ${gradients.hover};
  }
`; 