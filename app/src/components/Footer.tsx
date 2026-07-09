import { memo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, CalendarDays, Camera, Users, User } from 'lucide-react';

const tabs = [
  { label: 'الحجز', icon: Search, path: '/' },
  { label: 'المواعيد', icon: CalendarDays, path: '/appointments' },
  { label: 'الكاميرا', icon: Camera, path: '/camera' },
  { label: 'المجتمع', icon: Users, path: '/community' },
  { label: 'البروفايل', icon: User, path: '/profile' },
] as const;

const Footer = memo(function Footer() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const getActiveIndex = () => {
    const idx = tabs.findIndex((t) => t.path === currentPath);
    return idx === -1 ? 0 : idx;
  };
  const activeIndex = getActiveIndex();

  return (
    <nav className="fixed bottom-0 right-0 left-0 z-50 flex justify-center">
      <div className="w-full max-w-mobile">
        <div className="h-bottom-nav bg-bg-card rounded-t-3xl shadow-float flex items-start justify-around pt-2 px-2 relative">
          {tabs.map((tab, index) => {
            const isActive = activeIndex === index;
            const Icon = tab.icon;

            return (
              <motion.button
                key={tab.path}
                onClick={() => navigate(tab.path)}
                whileTap={{ scale: 0.9 }}
                className={`flex flex-col items-center justify-center gap-0.5 relative min-w-[56px] h-[56px] rounded-2xl transition-colors duration-base ${
                  isActive ? 'text-primary-500' : 'text-text-tertiary'
                }`}
                aria-label={tab.label}
              >
                {/* Active dot indicator */}
                {isActive && index !== 2 && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute -top-1 w-1.5 h-1.5 rounded-full bg-primary-500"
                    transition={{
                      type: 'spring',
                      stiffness: 500,
                      damping: 35,
                    }}
                  />
                )}

                {/* Center tab elevated with logo */}
                {index === 2 ? (
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center -mt-5 transition-all duration-base relative overflow-hidden ${
                      isActive
                        ? 'bg-primary-500 shadow-button'
                        : 'bg-bg-elevated border-2 border-border-subtle'
                    }`}
                  >
                    {isActive ? (
                      <img
                        src="/logo-icon.png"
                        alt=""
                        className="w-7 h-7 object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <Icon
                        className={`w-6 h-6 ${isActive ? 'text-white' : 'text-text-tertiary'}`}
                        strokeWidth={isActive ? 2.5 : 2}
                      />
                    )}
                  </div>
                ) : (
                  <Icon
                    className="w-6 h-6 transition-transform duration-base"
                    strokeWidth={isActive ? 2.5 : 1.5}
                  />
                )}

                {/* Label */}
                <span
                  className={`text-[10px] leading-tight font-arabic transition-all duration-base ${
                    isActive && index !== 2 ? 'font-bold' : 'font-medium'
                  }`}
                >
                  {tab.label}
                </span>
              </motion.button>
            );
          })}
        </div>
        {/* Safe area spacer */}
        <div className="h-[env(safe-area-inset-bottom)] bg-bg-card" />
      </div>
    </nav>
  );
});

export default Footer;
