import { useState, useEffect, useCallback, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera,
  X,
  RotateCcw,
  Download,
  ImagePlus,
  Trash2,
  Check,
} from 'lucide-react';
import { useCamera } from '@/hooks/useCamera';
import { useQRScanner } from '@/hooks/useQRScanner';
import { mockBarbers } from '@/data/mockBarbers';
import Layout from '@/components/Layout';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
type CameraPageMode = 'camera' | 'qr';

interface CapturedPhoto {
  id: string;
  dataUrl: string;
  timestamp: number;
}

/* ------------------------------------------------------------------ */
/*  Isolated perpetual scan line                                       */
/* ------------------------------------------------------------------ */
const QRScanLine = memo(function QRScanLine() {
  return (
    <motion.div
      className="absolute left-[10%] right-[10%] h-[2px] bg-primary-500 shadow-[0_0_12px_rgba(212,70,58,0.7)] z-30 pointer-events-none"
      initial={{ top: '15%' }}
      animate={{ top: ['15%', '85%', '15%'] }}
      transition={{ duration: 2.5, ease: 'easeInOut', repeat: Infinity }}
    />
  );
});

/* ------------------------------------------------------------------ */
/*  QR corner brackets                                                 */
/* ------------------------------------------------------------------ */
const QRCornerBrackets = memo(function QRCornerBrackets() {
  const corners = [
    { position: 'top-6 left-6', border: 'border-t-[3px] border-l-[3px]' },
    { position: 'top-6 right-6', border: 'border-t-[3px] border-r-[3px]' },
    { position: 'bottom-6 left-6', border: 'border-b-[3px] border-l-[3px]' },
    { position: 'bottom-6 right-6', border: 'border-b-[3px] border-r-[3px]' },
  ];

  return (
    <>
      {corners.map((c, i) => (
        <div
          key={i}
          className={`absolute ${c.position} w-10 h-10 ${c.border} border-primary-500 z-20 rounded-sm`}
        />
      ))}
    </>
  );
});

/* ------------------------------------------------------------------ */
/*  Photo preview bottom strip                                         */
/* ------------------------------------------------------------------ */
const PhotoGallery = memo(function PhotoGallery({
  photos,
  onDelete,
  onView,
}: {
  photos: CapturedPhoto[];
  onDelete: (id: string) => void;
  onView: (photo: CapturedPhoto) => void;
}) {
  if (photos.length === 0) return null;

  return (
    <div className="absolute bottom-24 left-0 right-0 z-30 px-4">
      <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2">
        {photos.map((photo) => (
          <motion.div
            key={photo.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative flex-shrink-0"
          >
            <button
              onClick={() => onView(photo)}
              className="w-16 h-16 rounded-xl overflow-hidden border-2 border-white/50 shadow-md"
            >
              <img
                src={photo.dataUrl}
                alt="Captured"
                className="w-full h-full object-cover"
              />
            </button>
            <button
              onClick={() => onDelete(photo.id)}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-error rounded-full flex items-center justify-center shadow-sm"
            >
              <X className="w-3 h-3 text-white" />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
});

/* ------------------------------------------------------------------ */
/*  Full-screen photo viewer                                           */
/* ------------------------------------------------------------------ */
function PhotoViewer({
  photo,
  onClose,
  onRetake,
}: {
  photo: CapturedPhoto;
  onClose: () => void;
  onRetake: () => void;
}) {
  const handleDownload = useCallback(() => {
    const link = document.createElement('a');
    link.href = photo.dataUrl;
    link.download = `hallaqi-photo-${Date.now()}.jpg`;
    link.click();
  }, [photo.dataUrl]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black flex flex-col"
    >
      {/* Top bar */}
      <div className="flex items-center justify-between p-4 z-10">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center"
        >
          <X className="w-5 h-5 text-white" />
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleDownload}
          className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center"
        >
          <Download className="w-5 h-5 text-white" />
        </motion.button>
      </div>

      {/* Photo */}
      <div className="flex-1 flex items-center justify-center p-4">
        <img
          src={photo.dataUrl}
          alt="Preview"
          className="max-w-full max-h-full rounded-xl object-contain"
        />
      </div>

      {/* Bottom actions */}
      <div className="p-6 flex items-center gap-4">
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={onRetake}
          className="flex-1 h-14 bg-white/20 backdrop-blur text-white rounded-xl font-semibold font-arabic flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-5 h-5" />
          إعادة التقاط
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={onClose}
          className="flex-1 h-14 bg-primary-500 text-white rounded-xl font-semibold font-arabic shadow-button flex items-center justify-center gap-2"
        >
          <Check className="w-5 h-5" />
          تم
        </motion.button>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Camera page                                                   */
/* ------------------------------------------------------------------ */
export default function CameraPage() {
  const navigate = useNavigate();
  const {
    videoRef,
    isActive,
    error,
    permissionDenied,
    startCamera,
    stopCamera,
    capturePhoto,
  } = useCamera();

  const qrScanner = useQRScanner(mockBarbers.map((b) => b.id));

  const [mode, setMode] = useState<CameraPageMode>('camera');
  const [photos, setPhotos] = useState<CapturedPhoto[]>([]);
  const [viewingPhoto, setViewingPhoto] = useState<CapturedPhoto | null>(null);
  const [flashActive, setFlashActive] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [showQRDetectedToast, setShowQRDetectedToast] = useState(false);

  // Start camera on mount, stop on unmount
  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  // Restart camera when switching modes
  useEffect(() => {
    if (!isActive && !error) {
      startCamera();
    }
  }, [mode]);

  // Handle QR detection
  useEffect(() => {
    if (qrScanner.detected && qrScanner.barberId) {
      setShowQRDetectedToast(true);
      const timer = setTimeout(() => {
        navigate(`/barber/${qrScanner.barberId}`);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [qrScanner.detected, qrScanner.barberId, navigate]);

  const handleCapture = useCallback(() => {
    if (isCapturing) return;
    setIsCapturing(true);
    setFlashActive(true);

    const dataUrl = capturePhoto();
    if (dataUrl) {
      const newPhoto: CapturedPhoto = {
        id: `photo-${Date.now()}`,
        dataUrl,
        timestamp: Date.now(),
      };
      setPhotos((prev) => [newPhoto, ...prev]);
      setViewingPhoto(newPhoto);
    }

    setTimeout(() => {
      setFlashActive(false);
      setIsCapturing(false);
    }, 300);
  }, [capturePhoto, isCapturing]);

  const handleDeletePhoto = useCallback((id: string) => {
    setPhotos((prev) => prev.filter((p) => p.id !== id));
    if (viewingPhoto?.id === id) {
      setViewingPhoto(null);
    }
  }, [viewingPhoto]);

  const handleSwitchMode = useCallback((newMode: CameraPageMode) => {
    setMode(newMode);
    if (newMode === 'qr') {
      qrScanner.startScanning();
    } else {
      qrScanner.stopScanning();
    }
  }, [qrScanner]);

  const handleRetake = useCallback(() => {
    setViewingPhoto(null);
  }, []);

  // QR detected toast
  const QRToast = () => (
    <motion.div
      initial={{ opacity: 0, y: -40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="absolute top-4 left-4 right-4 z-[90] bg-text-primary text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-3"
    >
      <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0">
        <Check className="w-4 h-4 text-success" />
      </div>
      <div>
        <p className="text-sm font-semibold font-arabic">تم العثور على كود!</p>
        <p className="text-xs text-white/70 font-arabic">جاري الانتقال إلى الصفحة...</p>
      </div>
    </motion.div>
  );

  return (
    <Layout showFooter={false} navbarProps={{ title: mode === 'qr' ? 'ماسح QR' : 'الكاميرا' }}>
      <div className="flex flex-col min-h-[calc(100dvh-56px)] bg-black relative">
        {/* Flash overlay */}
        <AnimatePresence>
          {flashActive && (
            <motion.div
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-[80] bg-white pointer-events-none"
            />
          )}
        </AnimatePresence>

        {/* QR Detected Toast */}
        <AnimatePresence>
          {showQRDetectedToast && <QRToast />}
        </AnimatePresence>

        {/* ---- Viewfinder ---- */}
        <div className="relative flex-1 overflow-hidden">
          {/* Video feed */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="absolute inset-0 w-full h-full object-cover"
            style={{ transform: 'scaleX(-1)' }} // Mirror effect
          />

          {/* Error / fallback state */}
          {!isActive && (
            <div className="absolute inset-0 bg-bg-elevated flex flex-col items-center justify-center px-8">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center"
              >
                <div className="w-20 h-20 rounded-full bg-bg-base flex items-center justify-center mb-4">
                  <Camera className="w-10 h-10 text-text-tertiary" />
                </div>
                {error ? (
                  <>
                    <p className="text-text-primary font-arabic text-center font-semibold mb-2">
                      {permissionDenied ? 'إذن الكاميرا مرفوض' : 'تعذر الوصول للكاميرا'}
                    </p>
                    <p className="text-text-secondary text-sm text-center font-arabic leading-relaxed">
                      {error}
                    </p>
                    <motion.button
                      whileTap={{ scale: 0.96 }}
                      onClick={startCamera}
                      className="mt-6 px-6 py-3 bg-primary-500 text-white rounded-xl font-semibold font-arabic shadow-button"
                    >
                      إعادة المحاولة
                    </motion.button>
                  </>
                ) : (
                  <div className="w-8 h-8 border-3 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
                )}
              </motion.div>
            </div>
          )}

          {/* QR overlay */}
          {mode === 'qr' && isActive && (
            <>
              {/* Darken outside the scanning area */}
              <div className="absolute inset-0 z-10 pointer-events-none">
                <div className="absolute inset-0 bg-black/50" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] max-w-[280px] aspect-square bg-transparent">
                  <div className="absolute -inset-[500px] bg-black/50" />
                </div>
              </div>

              {/* Corner brackets */}
              <QRCornerBrackets />

              {/* Scanning line */}
              <QRScanLine />

              {/* Scanning label */}
              <div className="absolute top-[15%] left-1/2 -translate-x-1/2 z-30 bg-primary-500 text-white text-[11px] font-bold px-4 py-1.5 rounded-full font-arabic">
                وجه الكاميرا نحو رمز QR
              </div>

              {/* Scanning animation dots */}
              <div className="absolute bottom-[15%] left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
                <motion.div
                  className="w-2 h-2 rounded-full bg-primary-500"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                />
                <motion.div
                  className="w-2 h-2 rounded-full bg-primary-500"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                />
                <motion.div
                  className="w-2 h-2 rounded-full bg-primary-500"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                />
              </div>
            </>
          )}

          {/* Camera mode overlay (rule of thirds grid) */}
          {mode === 'camera' && isActive && (
            <div className="absolute inset-0 z-10 pointer-events-none opacity-20">
              <div className="absolute top-1/3 left-0 right-0 h-px bg-white" />
              <div className="absolute top-2/3 left-0 right-0 h-px bg-white" />
              <div className="absolute left-1/3 top-0 bottom-0 w-px bg-white" />
              <div className="absolute left-2/3 top-0 bottom-0 w-px bg-white" />
            </div>
          )}

          {/* Photo gallery strip */}
          {mode === 'camera' && (
            <PhotoGallery
              photos={photos}
              onDelete={handleDeletePhoto}
              onView={setViewingPhoto}
            />
          )}
        </div>

        {/* ---- Bottom controls ---- */}
        <div className="bg-black/80 backdrop-blur-md px-6 py-5 flex flex-col items-center gap-4 z-30">
          {/* Mode toggle */}
          <div className="flex bg-white/10 rounded-full p-1">
            <button
              onClick={() => handleSwitchMode('camera')}
              className={`px-5 py-2 rounded-full text-sm font-medium font-arabic transition-all ${
                mode === 'camera'
                  ? 'bg-primary-500 text-white shadow-md'
                  : 'text-white/60'
              }`}
            >
              كاميرا
            </button>
            <button
              onClick={() => handleSwitchMode('qr')}
              className={`px-5 py-2 rounded-full text-sm font-medium font-arabic transition-all ${
                mode === 'qr'
                  ? 'bg-primary-500 text-white shadow-md'
                  : 'text-white/60'
              }`}
            >
              QR ماسح
            </button>
          </div>

          {/* Capture button (camera mode only) */}
          {mode === 'camera' && (
            <div className="flex items-center gap-6">
              {/* Photo count / gallery button */}
              <button
                onClick={() => photos.length > 0 && setViewingPhoto(photos[0])}
                className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center relative"
              >
                {photos.length > 0 ? (
                  <>
                    <img
                      src={photos[0].dataUrl}
                      alt="Latest"
                      className="w-full h-full rounded-xl object-cover"
                    />
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold">
                      {photos.length}
                    </span>
                  </>
                ) : (
                  <ImagePlus className="w-5 h-5 text-white/40" />
                )}
              </button>

              {/* Shutter */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleCapture}
                disabled={!isActive}
                className="w-[72px] h-[72px] rounded-full border-4 border-white flex items-center justify-center disabled:opacity-40"
              >
                <div className="w-14 h-14 rounded-full bg-white" />
              </motion.button>

              {/* Clear all */}
              <button
                onClick={() => setPhotos([])}
                disabled={photos.length === 0}
                className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center disabled:opacity-30"
              >
                <Trash2 className="w-5 h-5 text-white/60" />
              </button>
            </div>
          )}

          {/* QR mode instructions */}
          {mode === 'qr' && (
            <p className="text-white/50 text-xs font-arabic text-center">
              وجه الكاميرا نحو رمز QR الخاص بالحلاق
            </p>
          )}
        </div>

        {/* Photo viewer */}
        <AnimatePresence>
          {viewingPhoto && (
            <PhotoViewer
              photo={viewingPhoto}
              onClose={() => setViewingPhoto(null)}
              onRetake={handleRetake}
            />
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
}
