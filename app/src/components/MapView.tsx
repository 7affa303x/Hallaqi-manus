import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, Navigation, Star, X, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Barber } from '@/store/bookingStore';
import MapPinComponent from './MapPin';

interface MapViewProps {
  barbers: Barber[];
}

export default function MapView({ barbers }: MapViewProps) {
  const navigate = useNavigate();
  const [selectedBarber, setSelectedBarber] = useState<Barber | null>(null);
  const [scale, setScale] = useState(1);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = useCallback(() => {
    setScale((prev) => Math.min(prev + 0.25, 2.5));
  }, []);

  const handleZoomOut = useCallback(() => {
    setScale((prev) => Math.max(prev - 0.25, 0.75));
  }, []);

  const handleMyLocation = useCallback(() => {
    setScale(1);
  }, []);

  const handleCloseSheet = useCallback(() => {
    setSelectedBarber(null);
  }, []);

  const handleBook = useCallback(() => {
    if (selectedBarber) {
      navigate(`/barber/${selectedBarber.id}`);
    }
  }, [selectedBarber, navigate]);

  // Generate street-like SVG pattern
  const streetPattern = `
    <svg width='200' height='200' xmlns='http://www.w3.org/2000/svg'>
      <rect width='200' height='200' fill='#EDE9E3'/>
      <rect x='0' y='90' width='200' height='20' fill='#FFFFFF'/>
      <rect x='90' y='0' width='20' height='200' fill='#FFFFFF'/>
      <rect x='0' y='96' width='200' height='8' fill='#E0DCD6' stroke-dasharray='8 8'/>
      <rect x='96' y='0' width='8' height='200' fill='#E0DCD6' stroke-dasharray='8 8'/>
      <rect x='40' y='40' width='30' height='30' fill='#E8E4DE' rx='2'/>
      <rect x='130' y='130' width='40' height='25' fill='#E8E4DE' rx='2'/>
      <rect x='140' y='20' width='20' height='35' fill='#E8E4DE' rx='2'/>
      <rect x='25' y='130' width='35' height='20' fill='#E8E4DE' rx='2'/>
    </svg>
  `;

  const encodedPattern = `url("data:image/svg+xml,${encodeURIComponent(streetPattern)}")`;

  return (
    <div className="relative w-full h-[calc(100dvh-180px)] overflow-hidden rounded-2xl bg-[#EDE9E3]">
      {/* Map background with scrollable area */}
      <div
        ref={mapContainerRef}
        className="w-full h-full overflow-auto"
        style={{ touchAction: 'pan-x pan-y' }}
      >
        <motion.div
          className="relative w-full h-full origin-center"
          style={{
            backgroundImage: encodedPattern,
            backgroundSize: `${200 * scale}px ${200 * scale}px`,
            scale,
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          {/* Additional decorative street lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30" xmlns="http://www.w3.org/2000/svg">
            {/* Horizontal streets */}
            <line x1="0" y1="25%" x2="100%" y2="25%" stroke="#D5CFC7" strokeWidth="1.5" />
            <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#FFFFFF" strokeWidth="8" />
            <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#D5CFC7" strokeWidth="1" strokeDasharray="6 4" />
            <line x1="0" y1="75%" x2="100%" y2="75%" stroke="#D5CFC7" strokeWidth="1.5" />
            {/* Vertical streets */}
            <line x1="25%" y1="0" x2="25%" y2="100%" stroke="#D5CFC7" strokeWidth="1.5" />
            <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#FFFFFF" strokeWidth="8" />
            <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#D5CFC7" strokeWidth="1" strokeDasharray="6 4" />
            <line x1="75%" y1="0" x2="75%" y2="100%" stroke="#D5CFC7" strokeWidth="1.5" />
            {/* Park / green area */}
            <rect x="55%" y="5%" width="18%" height="20%" fill="#C8D5B9" rx="8" opacity="0.4" />
            <text x="64%" y="18%" textAnchor="middle" fill="#6B8F5E" fontSize="10" opacity="0.5">حديقة</text>
            {/* Water feature */}
            <rect x="5%" y="55%" width="15%" height="12%" fill="#A8C8D8" rx="6" opacity="0.3" />
          </svg>

          {/* Building blocks (decorative rectangles) */}
          <div className="absolute top-[8%] left-[6%] w-[14%] h-[10%] bg-[#E0DCD6] rounded-md opacity-50" />
          <div className="absolute top-[8%] left-[28%] w-[10%] h-[12%] bg-[#E0DCD6] rounded-md opacity-50" />
          <div className="absolute top-[30%] left-[6%] w-[12%] h-[8%] bg-[#E0DCD6] rounded-md opacity-50" />
          <div className="absolute top-[30%] left-[78%] w-[16%] h-[10%] bg-[#E0DCD6] rounded-md opacity-50" />
          <div className="absolute top-[55%] left-[28%] w-[14%] h-[12%] bg-[#E0DCD6] rounded-md opacity-50" />
          <div className="absolute top-[55%] left-[78%] w-[12%] h-[10%] bg-[#E0DCD6] rounded-md opacity-50" />
          <div className="absolute top-[80%] left-[6%] w-[12%] h-[10%] bg-[#E0DCD6] rounded-md opacity-50" />
          <div className="absolute top-[80%] left-[55%] w-[14%] h=[10%] bg-[#E0DCD6] rounded-md opacity-50" />

          {/* Barber pins */}
          {barbers.map((barber, i) => (
            <MapPinComponent
              key={barber.id}
              barber={barber}
              index={i}
              onSelect={setSelectedBarber}
            />
          ))}

          {/* My location indicator */}
          <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-20">
            <motion.div
              className="relative"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="w-4 h-4 bg-blue-500 rounded-full border-[2px] border-white shadow-lg" />
              <motion.div
                className="absolute -inset-2 border-2 border-blue-400 rounded-full"
                animate={{ scale: [1, 1.8, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Zoom controls */}
      <div className="absolute bottom-4 left-4 flex flex-col gap-2 z-30">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleZoomIn}
          className="w-10 h-10 bg-white rounded-xl shadow-md flex items-center justify-center text-text-primary hover:bg-bg-elevated transition-colors"
        >
          <Plus className="w-5 h-5" />
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleZoomOut}
          className="w-10 h-10 bg-white rounded-xl shadow-md flex items-center justify-center text-text-primary hover:bg-bg-elevated transition-colors"
        >
          <Minus className="w-5 h-5" />
        </motion.button>
      </div>

      {/* My location button */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={handleMyLocation}
        className="absolute bottom-4 right-4 z-30 w-10 h-10 bg-white rounded-xl shadow-md flex items-center justify-center text-blue-500 hover:bg-bg-elevated transition-colors"
      >
        <Navigation className="w-5 h-5" />
      </motion.button>

      {/* Scale indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-2">
        <div className="w-8 h-0.5 bg-text-primary" />
        <span className="text-[10px] text-text-secondary font-mono">500 م</span>
      </div>

      {/* Legend */}
      <div className="absolute top-3 right-3 z-30 bg-white/90 backdrop-blur-sm rounded-xl shadow-sm px-3 py-2 flex flex-col gap-1.5">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[var(--primary-500,#D4463A)]" />
          <span className="text-[10px] text-text-secondary font-arabic">متاح</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#9CA3AF]" />
          <span className="text-[10px] text-text-secondary font-arabic">مشغول</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#D4A017]" />
          <span className="text-[10px] text-text-secondary font-arabic">مميز</span>
        </div>
      </div>

      {/* Bottom Sheet for selected barber */}
      <AnimatePresence>
        {selectedBarber && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={handleCloseSheet}
              className="absolute inset-0 bg-[rgba(30,28,26,0.4)] z-40"
            />
            {/* Sheet */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="absolute bottom-0 right-0 left-0 z-50 bg-bg-card rounded-t-3xl shadow-float"
            >
              {/* Handle */}
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-10 h-1 bg-text-tertiary/40 rounded-full" />
              </div>

              <div className="px-5 pb-6">
                {/* Close button */}
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={handleCloseSheet}
                  className="absolute top-4 left-4 w-8 h-8 rounded-full bg-bg-elevated flex items-center justify-center"
                >
                  <X className="w-4 h-4 text-text-secondary" />
                </motion.button>

                {/* Barber mini card */}
                <div className="flex items-start gap-4">
                  <img
                    src={selectedBarber.avatar}
                    alt={selectedBarber.name}
                    className="w-16 h-16 rounded-2xl object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold font-arabic text-text-primary truncate">
                      {selectedBarber.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-0.5">
                        <Star className="w-3.5 h-3.5 fill-gold text-gold" />
                        <span className="text-sm font-semibold text-text-secondary">
                          {selectedBarber.rating}
                        </span>
                      </div>
                      <span className="text-xs text-text-tertiary">
                        ({selectedBarber.reviewCount} تقييم)
                      </span>
                    </div>
                    <p className="font-mono font-bold text-primary-500 text-sm mt-1">
                      من {selectedBarber.priceRange[0]} دج — {selectedBarber.priceRange[1]} دج
                    </p>
                    <div className="flex items-center gap-1 mt-1 text-text-tertiary">
                      <MapPin className="w-3 h-3" />
                      <span className="text-xs">{selectedBarber.location}</span>
                    </div>
                  </div>
                </div>

                {/* Status badge */}
                <div className="flex items-center gap-2 mt-3">
                  {selectedBarber.isAvailable ? (
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-success/10 text-success text-xs font-medium rounded-full">
                      <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                      متاح الآن
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-text-tertiary/10 text-text-tertiary text-xs font-medium rounded-full">
                      <span className="w-2 h-2 rounded-full bg-text-tertiary" />
                      مشغول
                    </span>
                  )}
                  {selectedBarber.isFeatured && (
                    <span className="px-3 py-1 bg-warning/10 text-warning text-xs font-medium rounded-full">
                      مميز
                    </span>
                  )}
                </div>

                {/* Book button */}
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={handleBook}
                  className="w-full h-12 mt-4 bg-primary-500 text-white rounded-xl font-semibold font-arabic shadow-button"
                >
                  احجز موعد
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
