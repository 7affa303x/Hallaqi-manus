import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Share2, Download, QrCode } from 'lucide-react';
import { mockBarbers } from '@/data/mockBarbers';

/**
 * Generate a deterministic pseudo-random QR pattern from a seed string.
 * This creates a realistic-looking QR code SVG that is visually unique per barber.
 */
function generateQRPattern(seed: string): boolean[][] {
  const size = 25;
  const grid: boolean[][] = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => false)
  );

  // Helper: seeded PRNG using simple hash
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash + char) | 0;
  }
  const rng = () => {
    hash = (hash * 1103515245 + 12345) | 0;
    return ((hash >>> 0) / 0xffffffff);
  };

  // --- Finder patterns (3 corners) ---
  const drawFinder = (startRow: number, startCol: number) => {
    // Outer 7x7 black square with 1px white border inside
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        const isBorder = r === 0 || r === 6 || c === 0 || c === 6;
        const isInner = r >= 2 && r <= 4 && c >= 2 && c <= 4;
        grid[startRow + r][startCol + c] = isBorder || isInner;
      }
    }
  };

  drawFinder(0, 0);                          // Top-left
  drawFinder(0, size - 7);                   // Top-right
  drawFinder(size - 7, 0);                   // Bottom-left

  // --- Timing patterns (alternating dots between finders) ---
  for (let i = 8; i < size - 8; i++) {
    grid[6][i] = i % 2 === 0;  // Horizontal timing
    grid[i][6] = i % 2 === 0;  // Vertical timing
  }

  // --- Alignment pattern (near bottom-right) ---
  const alignRow = size - 9;
  const alignCol = size - 9;
  for (let r = -2; r <= 2; r++) {
    for (let c = -2; c <= 2; c++) {
      const isBorder = Math.abs(r) === 2 || Math.abs(c) === 2;
      const isCenter = r === 0 && c === 0;
      grid[alignRow + r][alignCol + c] = isBorder || isCenter;
    }
  }

  // --- Data modules (deterministic pseudo-random) ---
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      // Skip finder patterns and timing patterns
      const inTopLeftFinder = r < 9 && c < 9;
      const inTopRightFinder = r < 9 && c >= size - 8;
      const inBottomLeftFinder = r >= size - 8 && c < 9;
      const inTiming = r === 6 || c === 6;
      const inAlign = r >= alignRow - 2 && r <= alignRow + 2 &&
                      c >= alignCol - 2 && c <= alignCol + 2;

      if (inTopLeftFinder || inTopRightFinder || inBottomLeftFinder || inTiming || inAlign) {
        continue;
      }

      grid[r][c] = rng() > 0.5;
    }
  }

  // --- Dark module (always on at specific position) ---
  grid[size - 8][8] = true;

  return grid;
}

function SimulatedQR({ seed, size = 200 }: { seed: string; size?: number }) {
  const grid = generateQRPattern(seed);
  const cellSize = size / grid.length;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="rounded-lg"
    >
      <rect width={size} height={size} fill="white" />
      {grid.map((row, r) =>
        row.map((cell, c) =>
          cell ? (
            <rect
              key={`${r}-${c}`}
              x={c * cellSize}
              y={r * cellSize}
              width={cellSize + 0.5}
              height={cellSize + 0.5}
              fill="#1E1C1A"
            />
          ) : null
        )
      )}
    </svg>
  );
}

const easeOutExpo = [0.16, 1, 0.3, 1] as [number, number, number, number];

export default function QRCodePage() {
  const { barberId } = useParams<{ barberId: string }>();
  const navigate = useNavigate();

  const barber = mockBarbers.find((b) => b.id === barberId);

  const handleShare = async () => {
    const shareData = {
      title: `QR كود - ${barber?.name ?? 'حلاق'}`,
      text: `امسح الكود لحجز موعد مع ${barber?.name ?? 'الحلاق'}`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // User cancelled share
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
      } catch {
        // Clipboard not available
      }
    }
  };

  const handleDownload = () => {
    // Create a temporary canvas to export the QR
    const svgEl = document.querySelector('#qr-svg-container svg') as SVGSVGElement | null;
    if (!svgEl) return;

    const serializer = new XMLSerializer();
    const svgStr = serializer.serializeToString(svgEl);
    const svgBlob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, 512, 512);
      ctx.drawImage(img, 0, 0, 512, 512);
      URL.revokeObjectURL(url);

      const pngUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = pngUrl;
      link.download = `qrcode-${barber?.name ?? 'barber'}.png`;
      link.click();
    };
    img.src = url;
  };

  if (!barber) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[100dvh] px-4">
        <QrCode className="w-16 h-16 text-text-tertiary mb-4" />
        <p className="text-text-secondary font-arabic">لم يتم العثور على الحلاق</p>
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => navigate(-1)}
          className="mt-4 px-6 py-3 bg-primary-500 text-white rounded-xl font-semibold font-arabic"
        >
          العودة
        </motion.button>
      </div>
    );
  }

  const qrSeed = `hallaqi://barber/${barber.id}/${barber.name}`;

  return (
    <div className="min-h-[100dvh] bg-bg-base flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-bg-base/90 backdrop-blur-md border-b border-border-subtle">
        <div className="flex items-center justify-between h-14 px-4">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-bg-elevated flex items-center justify-center"
          >
            <ChevronLeft className="w-5 h-5 text-text-primary rtl-flip" />
          </motion.button>

          <h1 className="text-base font-semibold font-arabic text-text-primary">
            كود QR
          </h1>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleShare}
            className="w-10 h-10 rounded-full bg-bg-elevated flex items-center justify-center"
          >
            <Share2 className="w-5 h-5 text-text-secondary" />
          </motion.button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        {/* Barber info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: easeOutExpo }}
          className="flex flex-col items-center mb-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.1 }}
            className="w-20 h-20 rounded-full overflow-hidden border-[3px] border-primary-500 mb-4"
          >
            <img
              src={barber.avatar}
              alt={barber.name}
              className="w-full h-full object-cover"
            />
          </motion.div>
          <h2 className="text-xl font-bold font-arabic text-text-primary">
            {barber.name}
          </h2>
          <p className="text-sm text-text-secondary mt-1 font-arabic">
            حلاق محترف · {barber.rating} ★
          </p>
        </motion.div>

        {/* QR Code */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.2 }}
          className="bg-white p-6 rounded-3xl shadow-card"
        >
          <div id="qr-svg-container" className="relative">
            <SimulatedQR seed={qrSeed} size={220} />
          </div>

          {/* Brand mark in center */}
          <div className="flex items-center justify-center mt-4 gap-2">
            <div className="w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center">
              <QrCode className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-xs text-text-tertiary font-arabic">كصيمي</span>
          </div>
        </motion.div>

        {/* Instructions */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-text-secondary text-sm font-arabic text-center mt-6 leading-relaxed"
        >
          امسح الكود لحجز موعد
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-text-tertiary text-xs font-arabic text-center mt-1"
        >
          استخدم كاميرا التطبيق أو أي ماسح QR
        </motion.p>
      </div>

      {/* Bottom actions */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5, ease: easeOutExpo }}
        className="p-6 bg-bg-card border-t border-border-subtle"
      >
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={handleDownload}
          className="w-full h-14 bg-primary-500 text-white rounded-xl font-semibold font-arabic shadow-button flex items-center justify-center gap-2"
        >
          <Download className="w-5 h-5" />
          تحميل QR كود
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => navigate(`/barber/${barber.id}`)}
          className="w-full h-12 mt-3 bg-bg-elevated text-text-primary rounded-xl font-semibold font-arabic"
        >
          العودة للملف الشخصي
        </motion.button>
      </motion.div>
    </div>
  );
}
