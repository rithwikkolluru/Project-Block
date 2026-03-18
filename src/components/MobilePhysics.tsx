import React, { useEffect } from 'react';
import { useCosmicStore } from '../stores/useCosmicStore';

export const MobilePhysics: React.FC = () => {
  const { startScan } = useCosmicStore();

  useEffect(() => {
    let touchStartX = 0;
    
    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.changedTouches[0].screenX;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndX = e.changedTouches[0].screenX;
      if (touchEndX < touchStartX - 100) {
        // swipe left
        console.log('swiped left');
      }
    };

    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    }
  }, []);

  return null;
}
