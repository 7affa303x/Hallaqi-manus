import { memo } from 'react';
import { motion } from 'framer-motion';
import type { Barber } from '@/store/bookingStore';

interface MapPinProps {
  barber: Barber;
  index: number;
  onSelect: (barber: Barber) => void;
}

function MapPinComponent({ barber, index, onSelect }: MapPinProps) {

  // Derive percentage positions deterministically from barber ID
  const idNum = parseInt(barber.id, 10) || 1;
  const top = ((idNum * 37 + 13) % 72) + 8; // 8% - 80%
  const left = ((idNum * 53 + 7) % 80) + 6; // 6% - 86%

  // Color based on barber status
  const pinColor = barber.isFeatured
    ? '#D4A017' // gold for featured
    : barber.isAvailable
      ? 'var(--primary-500, #D4463A)' // primary for available
      : '#9CA3AF'; // gray for busy

  return (
    <motion.button
      initial={{ scale: 0, y: -20 }}
      animate={{ scale: 1, y: 0 }}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 15,
        delay: index * 0.05,
      }}
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.9 }}
      onClick={() => onSelect(barber)}
      className="absolute z-10 group"
      style={{ top: `${top}%`, left: `${left}%` }}
    >
      {/* Pin marker */}
      <div className="relative flex flex-col items-center">
        {/* Tooltip */}
        <div
          className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap px-2.5 py-1 rounded-lg text-[11px] font-semibold font-arabic opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md"
          style={{ backgroundColor: pinColor, color: '#fff' }}
        >
          {barber.name}
          <div
            className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45"
            style={{ backgroundColor: pinColor }}
          />
        </div>

        {/* Pin body */}
        <div
          className="w-10 h-10 rounded-full border-[3px] border-white shadow-lg flex items-center justify-center overflow-hidden"
          style={{ backgroundColor: pinColor }}
        >
          <img
            src={barber.avatar}
            alt={barber.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        {/* Pin tail (downward triangle) */}
        <div
          className="w-0 h-0 -mt-0.5"
          style={{
            borderLeft: '6px solid transparent',
            borderRight: '6px solid transparent',
            borderTop: `8px solid ${pinColor}`,
          }}
        />

        {/* Pulse ring for available barbers */}
        {barber.isAvailable && (
          <motion.div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full"
            style={{ border: `2px solid ${pinColor}` }}
            animate={{ scale: [1, 1.6, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
          />
        )}
      </div>
    </motion.button>
  );
}

export default memo(MapPinComponent);
