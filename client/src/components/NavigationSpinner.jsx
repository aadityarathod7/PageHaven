import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Loader from './Loader';

const NavigationSpinner = () => {
  const location = useLocation();
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    setIsNavigating(true);
  }, [location]);

  useEffect(() => {
    if (isNavigating) {
      const timeout = setTimeout(() => setIsNavigating(false), 300); // adjust as needed
      return () => clearTimeout(timeout);
    }
  }, [isNavigating, location]);

  if (!isNavigating) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(255,255,255,0.6)',
      zIndex: 2000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <Loader />
    </div>
  );
};

export default NavigationSpinner; 