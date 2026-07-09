import { useState, useRef, useEffect, useCallback } from 'react';

export type CameraMode = 'camera' | 'qr';

interface CameraState {
  stream: MediaStream | null;
  isActive: boolean;
  error: string | null;
  permissionDenied: boolean;
}

interface UseCameraReturn {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  stream: MediaStream | null;
  isActive: boolean;
  error: string | null;
  permissionDenied: boolean;
  startCamera: () => Promise<void>;
  stopCamera: () => void;
  capturePhoto: () => string | null;
}

export function useCamera(): UseCameraReturn {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [state, setState] = useState<CameraState>({
    stream: null,
    isActive: false,
    error: null,
    permissionDenied: false,
  });

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
      });
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setState({
      stream: null,
      isActive: false,
      error: null,
      permissionDenied: false,
    });
  }, []);

  const startCamera = useCallback(async () => {
    // Reset state
    setState((prev) => ({ ...prev, error: null, permissionDenied: false }));

    try {
      // Stop any existing stream first
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }

      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = mediaStream;

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();
      }

      setState({
        stream: mediaStream,
        isActive: true,
        error: null,
        permissionDenied: false,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      const isDenied =
        errorMessage.includes('Permission denied') ||
        errorMessage.includes('NotAllowed') ||
        errorMessage.includes('denied');

      setState({
        stream: null,
        isActive: false,
        error: isDenied
          ? 'تم رفض إذن الكاميرا. يرجى السماح بالوصول إلى الكاميرا من إعدادات المتصفح.'
          : 'تعذر تشغيل الكاميرا. تأكد من توفر كاميرا على جهازك.',
        permissionDenied: isDenied,
      });
    }
  }, []);

  const capturePhoto = useCallback((): string | null => {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return null;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Flip horizontally for mirror effect (front camera feel)
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0);

    return canvas.toDataURL('image/jpeg', 0.9);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return {
    videoRef,
    stream: state.stream,
    isActive: state.isActive,
    error: state.error,
    permissionDenied: state.permissionDenied,
    startCamera,
    stopCamera,
    capturePhoto,
  };
}
