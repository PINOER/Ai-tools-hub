// hooks/useIsMobile.ts
import { useEffect, useState } from 'react';

export function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const updateIsMobile = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    updateIsMobile(); // initial check
    window.addEventListener('resize', updateIsMobile);
    return () => window.removeEventListener('resize', updateIsMobile);
  }, [breakpoint]);

  return isMobile;
}
