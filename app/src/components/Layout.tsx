import type { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Outlet, useLocation, useNavigationType } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { useThemeStore } from '@/store/themeStore';
import { useEffect } from 'react';

interface LayoutProps {
  children?: ReactNode;
  navbarProps?: {
    title?: string;
    showBack?: boolean;
    onBack?: () => void;
    showSearch?: boolean;
    onSearchClick?: () => void;
    showFilter?: boolean;
    onFilterClick?: () => void;
    filterCount?: number;
    transparent?: boolean;
  };
  showFooter?: boolean;
  showNavbar?: boolean;
}

const pageVariants = {
  simple: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  modern: {
    initial: { opacity: 0, x: 30 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -30 },
  },
  digital: {
    initial: { opacity: 0, x: 60, scale: 0.95 },
    animate: { opacity: 1, x: 0, scale: 1 },
    exit: { opacity: 0, x: -60, scale: 0.95 },
  },
};

export default function Layout({
  children,
  navbarProps,
  showFooter = true,
  showNavbar = true,
}: LayoutProps) {
  const location = useLocation();
  const navigationType = useNavigationType();
  const { animationPreset, applyThemeCSS } = useThemeStore();
  const variants = pageVariants[animationPreset];

  /* Apply saved theme on mount */
  useEffect(() => {
    applyThemeCSS();
  }, [applyThemeCSS]);

  /* Direction-aware transitions: pop slides right, push slides left */
  const isPop = navigationType === 'POP';
  const enterX = isPop ? -30 : 30;
  const exitX = isPop ? 30 : -30;

  const directionVariants =
    animationPreset === 'modern'
      ? {
          initial: { opacity: 0, x: enterX },
          animate: { opacity: 1, x: 0 },
          exit: { opacity: 0, x: exitX },
        }
      : animationPreset === 'digital'
      ? {
          initial: { opacity: 0, x: isPop ? -60 : 60, scale: 0.95 },
          animate: { opacity: 1, x: 0, scale: 1 },
          exit: { opacity: 0, x: isPop ? 60 : -60, scale: 0.95 },
        }
      : variants;

  return (
    <div className="w-full max-w-mobile min-h-[100dvh] bg-bg-base relative overflow-hidden">
      {showNavbar && <Navbar {...navbarProps} />}

      <main
        className={`min-h-[100dvh] ${
          showNavbar ? 'pt-navbar' : ''
        } ${showFooter ? 'pb-bottom-nav' : ''}`}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={location.pathname}
            initial={directionVariants.initial}
            animate={directionVariants.animate}
            exit={directionVariants.exit}
            transition={{
              duration: 0.3,
              ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
            }}
            className="min-h-full"
          >
            {children ?? <Outlet />}
          </motion.div>
        </AnimatePresence>
      </main>

      {showFooter && <Footer />}

      {/* Safe area inset overlays */}
      <div className="fixed top-0 right-0 left-0 h-[env(safe-area-inset-top)] z-[60] pointer-events-none" />
      <div className="fixed bottom-0 right-0 left-0 h-[env(safe-area-inset-bottom)] z-[60] pointer-events-none" />
    </div>
  );
}
