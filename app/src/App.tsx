import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';

/* Lazy load pages for code splitting */
const Home = lazy(() => import('@/pages/Home'));
const BarberDetail = lazy(() => import('@/pages/BarberDetail'));
const Booking = lazy(() => import('@/pages/Booking'));
const Appointments = lazy(() => import('@/pages/Appointments'));
const AppointmentDetail = lazy(() => import('@/pages/AppointmentDetail'));
const Chat = lazy(() => import('@/pages/Chat'));
const Camera = lazy(() => import('@/pages/Camera'));
const Community = lazy(() => import('@/pages/Community'));
const Profile = lazy(() => import('@/pages/Profile'));
const Settings = lazy(() => import('@/pages/Settings'));
const Wallet = lazy(() => import('@/pages/Wallet'));
const QRCode = lazy(() => import('@/pages/QRCode'));
const BarberOnboarding = lazy(() => import('@/pages/BarberOnboarding'));

function LoadingFallback() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] gap-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: [1, 1.05, 1] }}
        transition={{
          opacity: { duration: 0.3 },
          scale: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
        }}
        className="relative"
      >
        <img
          src="/logo-icon.png"
          alt="Hallaqi"
          className="w-16 h-16 object-contain"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
          }}
        />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="flex flex-col items-center gap-2"
      >
        <span className="text-sm font-semibold text-text-primary font-arabic">
          حلاقي
        </span>
        <div className="w-24 h-1 bg-bg-elevated rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary-500 rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: ['0%', '60%', '80%', '100%'] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </div>
      </motion.div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route element={<Layout showFooter showNavbar={false} />}>
            <Route index element={<Home />} />
          </Route>
          <Route element={<Layout />}>
            <Route path="barber/:id" element={<BarberDetail />} />
            <Route path="booking" element={<Booking />} />
            <Route path="appointments" element={<Appointments />} />
            <Route path="appointment/:id" element={<AppointmentDetail />} />
            <Route path="chat/:id" element={<Chat />} />
            <Route path="camera" element={<Camera />} />
            <Route path="community" element={<Community />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
            <Route path="wallet" element={<Wallet />} />
            <Route path="qr/:barberId" element={<QRCode />} />
            <Route path="barber-onboarding" element={<BarberOnboarding />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
