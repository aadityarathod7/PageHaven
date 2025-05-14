import React from 'react';
import styled from 'styled-components';
import { Alert } from 'react-bootstrap';
import { colors, typography, borderRadius, transitions } from '../styles/theme';

const StyledAlert = styled(Alert)`
  border: none;
  border-radius: ${borderRadius.lg};
  padding: 1rem 1.25rem;
  margin-bottom: 1.5rem;
  font-family: ${typography.fonts.body};
  font-weight: ${typography.fontWeights.medium};
  display: flex;
  align-items: center;
  transition: ${transitions.default};

  &.alert-success {
    background-color: ${colors.success}15;
    color: ${colors.success};
  }

  &.alert-danger {
    background-color: ${colors.danger}15;
    color: ${colors.danger};
  }

  &.alert-info {
    background-color: ${colors.secondary}15;
    color: ${colors.secondary};
  }

  &.alert-warning {
    background-color: ${colors.warning}15;
    color: ${colors.warning};
  }
`;

const Message = ({ variant = 'info', children }) => {
  return <StyledAlert variant={variant}>{children}</StyledAlert>;
};

export default Message;