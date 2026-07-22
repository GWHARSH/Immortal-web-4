import { useState, useEffect } from 'react';

function getDeviceTier() {
  if (typeof window === 'undefined') return 'high';

  const isMobileScreen = window.innerWidth <= 768;

  // On Desktop / Laptop / PC monitors, ALWAYS default to 'high' performance for maximum crisp 1080p quality
  if (!isMobileScreen) {
    const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (conn?.saveData === true) return 'medium';
    return 'high';
  }

  // On Mobile screens (<= 768px):
  const ram = navigator.deviceMemory || 4;
  const cores = navigator.hardwareConcurrency || 4;

  if (ram <= 2 || cores <= 2) {
    return 'low';
  }

  return 'medium';
}

export function useDevicePerformance() {
  const [tier, setTier] = useState(() => getDeviceTier());

  useEffect(() => {
    const updateTier = () => setTier(getDeviceTier());
    window.addEventListener('resize', updateTier);

    const currentTier = getDeviceTier();
    document.body.classList.remove('perf-low', 'perf-medium', 'perf-high');
    document.body.classList.add(`perf-${currentTier}`);

    return () => window.removeEventListener('resize', updateTier);
  }, []);

  return tier;
}
