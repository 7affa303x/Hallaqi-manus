import { useState, useRef, useCallback, useEffect } from 'react';

interface QRScannerState {
  isScanning: boolean;
  detected: boolean;
  barberId: string | null;
  error: string | null;
}

interface UseQRScannerReturn {
  isScanning: boolean;
  detected: boolean;
  barberId: string | null;
  error: string | null;
  startScanning: () => void;
  stopScanning: () => void;
}

export function useQRScanner(barberIds: string[]): UseQRScannerReturn {
  const [state, setState] = useState<QRScannerState>({
    isScanning: false,
    detected: false,
    barberId: null,
    error: null,
  });

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const barberIdsRef = useRef(barberIds);

  // Keep ref in sync
  useEffect(() => {
    barberIdsRef.current = barberIds;
  }, [barberIds]);

  const stopScanning = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setState({
      isScanning: false,
      detected: false,
      barberId: null,
      error: null,
    });
  }, []);

  const startScanning = useCallback(() => {
    // Clear any existing scan
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setState({
      isScanning: true,
      detected: false,
      barberId: null,
      error: null,
    });

    // Simulate QR detection after 3-5 seconds
    const delay = 3000 + Math.random() * 2000;

    timeoutRef.current = setTimeout(() => {
      // Pick a random barber ID
      const ids = barberIdsRef.current;
      const randomId = ids.length > 0
        ? ids[Math.floor(Math.random() * ids.length)]
        : '1';

      setState({
        isScanning: true,
        detected: true,
        barberId: randomId,
        error: null,
      });
    }, delay);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    isScanning: state.isScanning,
    detected: state.detected,
    barberId: state.barberId,
    error: state.error,
    startScanning,
    stopScanning,
  };
}
