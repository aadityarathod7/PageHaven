import React from 'react';
import styled, { keyframes } from 'styled-components';
import { colors } from '../styles/theme';

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
`;

const SpinnerOuter = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid ${colors.background.accent};
  border-radius: 50%;
  display: inline-block;
  position: relative;
  box-sizing: border-box;
  animation: ${spin} 1s linear infinite;

  &::after {
    content: '';
    box-sizing: border-box;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 3px solid transparent;
    border-bottom-color: ${colors.secondary};
  }
`;

const Loader = () => {
  return (
    <LoaderContainer>
      <SpinnerOuter />
    </LoaderContainer>
  );
};

export default Loader;