import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const fadeOut = keyframes`
  from { opacity: 1; }
  to { opacity: 0; }
`;

const SpinnerWrapper = styled.div`
  display: ${props => props.show ? 'flex' : 'none'};
  justify-content: center;
  align-items: center;
  min-height: 60px;
  animation: ${props => props.isExiting ? fadeOut : fadeIn} 0.2s ease-in;
  padding: 10px;
  opacity: ${props => props.isExiting ? 0 : 1};
`;

const Spinner = styled.div`
  width: 30px;
  height: 30px;
  border: 2px solid var(--primary-light);
  border-top: 2px solid var(--primary-color);
  border-radius: 50%;
  animation: ${spin} 0.6s linear infinite;
`;

const LoadingSpinner = () => {
  const [show, setShow] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Only show spinner after 150ms delay to prevent flash
    const showTimer = setTimeout(() => {
      setShow(true);
    }, 150);

    // Hide spinner after 2 seconds maximum
    const hideTimer = setTimeout(() => {
      setIsExiting(true);
      // Actually hide the spinner after fade out animation
      setTimeout(() => setShow(false), 200);
    }, 2000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!show && isExiting) return null;

  return (
    <SpinnerWrapper show={show} isExiting={isExiting}>
      <Spinner />
    </SpinnerWrapper>
  );
};

export default LoadingSpinner; 