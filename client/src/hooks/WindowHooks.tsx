import { useEffect, useState } from 'react';

const getWindowDimensions = () => {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
};

export const useWindowDimensions = () => {
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());
  const xs = windowDimensions.width < 576;
  const sm = windowDimensions.width >= 576 && windowDimensions.width < 768;
  const md = windowDimensions.width >= 768 && windowDimensions.width < 992;
  const lg = windowDimensions.width >= 992 && windowDimensions.width < 1200;
  const xl = windowDimensions.width >= 1200;

  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions(getWindowDimensions());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return { ...windowDimensions, xs, sm, md, lg, xl };
};
