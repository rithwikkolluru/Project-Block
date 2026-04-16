import { useState } from 'react';
import { useCosmicStore } from '../stores/useCosmicStore';
import { getRiskPhysics } from '../physics/gravityEngine';
import { scanWallet } from '../services/api/scanService';

export const useScanWarp = () => {
  const { startScan, completeScan, setScanError } = useCosmicStore();
  const [isAnimating, setIsAnimating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const executeScan = async (address: string) => {
    startScan(address);
    setIsAnimating(true);
    setError(null);

    // Run animation timer and API call concurrently
    const animationDelay = new Promise<void>(resolve => setTimeout(resolve, 4000));

    try {
      const [result] = await Promise.all([
        scanWallet(address),
        animationDelay,
      ]);

      getRiskPhysics(result.score);

      completeScan({
        address,
        score:    result.score,
        level:    result.level,
        reasons:  result.reasons,
        txId:     result.txId ?? undefined,
        timestamp: result.scannedAt,
      });
    } catch (err: any) {
      // Fallback: show error but keep the animation smooth
      await animationDelay;
      const errMsg = err?.message || 'Scan failed — check your connection';
      setError(errMsg);
      setScanError(errMsg);

      // Still complete scan with error state so UI doesn't hang
      completeScan({
        address,
        score: 0,
        level: 'safe',
        reasons: ['⚠️ ' + errMsg],
        timestamp: new Date().toISOString(),
      });
    } finally {
      setIsAnimating(false);
    }
  };

  return { executeScan, isAnimating, error };
};
