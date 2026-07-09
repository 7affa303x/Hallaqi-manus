import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, ChevronRight, Search, SlidersHorizontal } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useThemeStore } from '@/store/themeStore';

interface NavbarProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  showSearch?: boolean;
  onSearchClick?: () => void;
  showFilter?: boolean;
  onFilterClick?: () => void;
  filterCount?: number;
  transparent?: boolean;
}

export default function Navbar({
  title,
  showBack = false,
  onBack,
  showSearch = false,
  onSearchClick,
  showFilter = false,
  onFilterClick,
  filterCount = 0,
  transparent = false,
}: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const { user } = useAuthStore();
  const { isDarkMode } = useThemeStore();
  const notificationCount = user?.notifications ?? 0;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const hasBorder = scrolled && !transparent;
  const logoSrc = isDarkMode || transparent ? '/logo-white.png' : '/logo-full-light.png';

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
      className="fixed top-0 right-0 left-0 z-50 flex justify-center"
    >
      <div className="w-full max-w-mobile">
        <div
          className={`flex items-center justify-between h-navbar px-4 transition-all duration-base ease-default ${
            transparent
              ? 'bg-transparent'
              : scrolled
              ? 'bg-bg-base/85 backdrop-blur-xl'
              : 'bg-bg-base'
          } ${hasBorder ? 'border-b border-border-subtle' : ''}`}
        >
          {/* Left section */}
          <div className="flex items-center gap-2 min-w-[40px]">
            {showBack && (
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={onBack}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-bg-elevated transition-colors btn-active focus-ring"
                aria-label="Go back"
              >
                <ChevronRight className="w-6 h-6 text-text-primary rtl-flip" />
              </motion.button>
            )}
            {showSearch && (
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={onSearchClick}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-bg-elevated transition-colors btn-active focus-ring"
                aria-label="Search"
              >
                <Search className="w-5 h-5 text-text-secondary" />
              </motion.button>
            )}
          </div>

          {/* Center: Title or Logo */}
          <div className="flex-1 flex items-center justify-center min-w-0">
            {title ? (
              <h1 className="text-base font-semibold text-text-primary font-arabic truncate">
                {title}
              </h1>
            ) : (
              <motion.img
                src={logoSrc}
                alt="Hallaqi - حلاقي"
                className="h-9 w-auto object-contain"
                style={{ maxWidth: '120px' }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const fallback = document.createElement('span');
                  fallback.className = 'text-lg font-bold font-arabic text-primary-500';
                  fallback.textContent = 'حلاقي';
                  target.parentElement?.appendChild(fallback);
                }}
              />
            )}
          </div>

          {/* Right section */}
          <div className="flex items-center gap-1 min-w-[40px] justify-end">
            {showFilter && (
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={onFilterClick}
                className="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-bg-elevated transition-colors btn-active focus-ring"
                aria-label="Filter"
              >
                <SlidersHorizontal className="w-5 h-5 text-text-secondary" />
                <AnimatePresence>
                  {filterCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-primary-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center"
                    >
                      {filterCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            )}
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-bg-elevated transition-colors btn-active focus-ring"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5 text-text-secondary" />
              {notificationCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: [1, 1.2, 1, 1.1, 1] }}
                  transition={{ duration: 0.6 }}
                  className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-error rounded-full border-2 border-bg-base"
                />
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
