import React from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const TransitionWrapper = styled.div`
  animation: ${fadeIn} 0.3s ease-out;
`;

const PageTransition = ({ children }) => {
  return <TransitionWrapper>{children}</TransitionWrapper>;
};

export default PageTransition; 