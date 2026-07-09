import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle,
  Calendar,
  X,
  Scissors,
  CalendarDays,
  Clock,
  Star,
} from 'lucide-react';
import Layout from '@/components/Layout';
import {
  getUpcomingAppointments,
  getPastAppointments,
} from '@/data/mockAppointments';
import type { Appointment, AppointmentStatus } from '@/data/mockAppointments';

const tabs = [
  { key: 'upcoming' as const, label: 'القادمة' },
  { key: 'past' as const, label: 'السابقة' },
];

const statusConfig: Record<AppointmentStatus, { label: string; bg: string; text: string }> = {
  confirmed: { label: 'مؤكد', bg: 'bg-success', text: 'text-white' },
  pending: { label: 'بانتظار التأكيد', bg: 'bg-warning', text: 'text-white' },
  reschedulable: { label: 'قابل للتعديل', bg: 'bg-primary-500', text: 'text-white' },
  completed: { label: 'مكتمل', bg: 'bg-success', text: 'text-white' },
  cancelled: { label: 'ملغي', bg: 'bg-error', text: 'text-white' },
  'no-show': { label: 'لم يحضر', bg: 'bg-text-tertiary', text: 'text-white' },
};

/* ─── Segmented Control ─── */
function SegmentedControl({
  active,
  onChange,
}: {
  active: 'upcoming' | 'past';
  onChange: (tab: 'upcoming' | 'past') => void;
}) {
  const activeIndex = tabs.findIndex((t) => t.key === active);

  return (
    <div className="mx-4 mt-4 mb-4">
      <div className="relative flex h-10 bg-bg-elevated rounded-[10px] p-0.5">
        {/* Animated sliding pill */}
        <motion.div
          className="absolute top-0.5 bottom-0.5 bg-primary-500 rounded-lg"
          initial={false}
          animate={{
            right: `${(1 - activeIndex) * 50 + 0.5}%`,
            left: `${activeIndex * 50 + 0.5}%`,
          }}
          transition={{ type: 'spring', stiffness: 400, damping: 35 }}
        />
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className={`relative z-10 flex-1 flex items-center justify-center text-sm font-medium font-arabic rounded-lg transition-colors duration-base ${
              active === tab.key ? 'text-white' : 'text-text-secondary'
            }`}
          >
            {tab.label}
            {tab.key === 'upcoming' && getUpcomingAppointments().length > 0 && (
              <span
                className={`mr-1.5 flex items-center justify-center min-w-[18px] h-[18px] text-[10px] font-bold rounded-full ${
                  active === 'upcoming' ? 'bg-white/20 text-white' : 'bg-primary-500 text-white'
                }`}
              >
                {getUpcomingAppointments().length}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─── Upcoming Appointment Card (with quick actions row) ─── */
function UpcomingCard({
  appointment,
  onNavigate,
}: {
  appointment: Appointment;
  onNavigate: (path: string) => void;
}) {
  const isTomorrow = appointment.date === '2025-06-21'; // Simulated "tomorrow"

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
      className="mb-3"
    >
      {/* Reminder Banner */}
      {isTomorrow && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="mb-2 bg-warning/15 border border-warning/20 rounded-lg px-3 py-2 flex items-center gap-2"
        >
          <CalendarDays className="w-4 h-4 text-warning flex-shrink-0" />
          <span className="text-xs text-warning font-medium font-arabic">
            تذكير: موعدك غداً في {appointment.displayTime}
          </span>
        </motion.div>
      )}

      <div className="bg-bg-card rounded-2xl shadow-card overflow-hidden">
        {/* Card Content */}
        <div
          onClick={() => onNavigate(`/appointment/${appointment.id}`)}
          className="p-4 cursor-pointer"
        >
          <div className="flex items-start gap-3">
            <div className="relative flex-shrink-0">
              <img
                src={appointment.barber.avatar}
                alt={appointment.barber.name}
                className="w-14 h-14 rounded-full object-cover border-2 border-primary-500"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-bold font-arabic text-base truncate">
                  {appointment.barber.name}
                </h3>
                <span
                  className={`flex-shrink-0 px-2 py-0.5 text-[10px] font-bold rounded-full ${
                    statusConfig[appointment.status].bg
                  } ${statusConfig[appointment.status].text}`}
                >
                  {statusConfig[appointment.status].label}
                </span>
              </div>
              <p className="text-sm text-text-secondary mt-0.5 font-arabic">
                {appointment.service}
              </p>
              <div className="flex items-center gap-3 mt-2 text-xs text-text-tertiary">
                <span className="flex items-center gap-1">
                  <CalendarDays className="w-3.5 h-3.5" />
                  {appointment.displayDate}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {appointment.displayTime}
                </span>
              </div>
              <div className="mt-2 font-mono font-bold text-primary-500">
                {appointment.price.toLocaleString()} دج
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Row */}
        <div className="border-t border-border-subtle mx-4" />
        <div className="flex items-center px-2 py-2 gap-1">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              onNavigate(`/chat/${appointment.barberId}`);
            }}
            className="flex-1 flex items-center justify-center gap-1.5 h-8 rounded-lg bg-primary-50 text-primary-500 text-xs font-medium font-arabic"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            محادثة
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              onNavigate('/booking');
            }}
            className="flex-1 flex items-center justify-center gap-1.5 h-8 rounded-lg bg-bg-elevated text-text-secondary text-xs font-medium font-arabic"
          >
            <Calendar className="w-3.5 h-3.5" />
            تغيير
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              // Cancel - would show confirmation sheet
            }}
            className="flex-1 flex items-center justify-center gap-1.5 h-8 rounded-lg bg-error/10 text-error text-xs font-medium font-arabic"
          >
            <X className="w-3.5 h-3.5" />
            إلغاء
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Past Appointment Card ─── */
function PastCard({
  appointment,
  onNavigate,
}: {
  appointment: Appointment;
  onNavigate: (path: string) => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
      className={`mb-3 bg-bg-card rounded-2xl shadow-card p-4 ${
        appointment.status === 'cancelled' ? 'opacity-60' : ''
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="relative flex-shrink-0">
          <img
            src={appointment.barber.avatar}
            alt={appointment.barber.name}
            className={`w-14 h-14 rounded-full object-cover border-2 ${
              appointment.status === 'cancelled' ? 'border-error' : 'border-success'
            }`}
          />
          {appointment.status === 'completed' && (
            <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-success rounded-full flex items-center justify-center border-2 border-bg-card">
              <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
                <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3
              className={`font-bold font-arabic text-base truncate ${
                appointment.status === 'cancelled' ? 'line-through text-text-tertiary' : ''
              }`}
            >
              {appointment.barber.name}
            </h3>
            <span
              className={`flex-shrink-0 px-2 py-0.5 text-[10px] font-bold rounded-full ${
                statusConfig[appointment.status].bg
              } ${statusConfig[appointment.status].text}`}
            >
              {statusConfig[appointment.status].label}
            </span>
          </div>
          <p
            className={`text-sm mt-0.5 font-arabic ${
              appointment.status === 'cancelled' ? 'line-through text-text-tertiary' : 'text-text-secondary'
            }`}
          >
            {appointment.service}
          </p>
          <div className="flex items-center gap-3 mt-2 text-xs text-text-tertiary">
            <span className="flex items-center gap-1">
              <CalendarDays className="w-3.5 h-3.5" />
              {appointment.displayDate}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {appointment.displayTime}
            </span>
          </div>

          {/* Rating or Rebook */}
          <div className="flex items-center justify-between mt-3">
            {appointment.status === 'completed' && !appointment.rated ? (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => onNavigate(`/appointment/${appointment.id}`)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-warning/10 text-warning rounded-lg text-xs font-bold font-arabic"
              >
                <Star className="w-3.5 h-3.5" />
                تقييم
              </motion.button>
            ) : appointment.status === 'completed' && appointment.rated ? (
              <div className="flex items-center gap-1">
                {Array.from({ length: appointment.rating ?? 5 }).map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 text-gold fill-gold" />
                ))}
              </div>
            ) : null}

            {appointment.status === 'completed' || appointment.status === 'cancelled' ? (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => onNavigate(`/booking`)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-50 text-primary-500 rounded-lg text-xs font-bold font-arabic"
              >
                <Calendar className="w-3.5 h-3.5" />
                إعادة الحجز
              </motion.button>
            ) : null}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Empty State ─── */
function EmptyState({ type }: { type: 'upcoming' | 'past' }) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
      className="flex flex-col items-center justify-center py-20 px-8"
    >
      <div className="w-[120px] h-[120px] mb-6 relative">
        <Scissors className="w-full h-full text-text-tertiary/40" />
      </div>
      <h2 className="text-[22px] font-bold font-arabic text-text-primary mb-2">
        لا توجد مواعيد
      </h2>
      <p className="text-sm text-text-secondary font-arabic text-center mb-6">
        {type === 'upcoming'
          ? 'احجز موعدك الأول مع حلاق محترف'
          : 'ستظهر مواعيدك السابقة هنا'}
      </p>
      {type === 'upcoming' && (
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => navigate('/')}
          className="px-6 py-3 bg-primary-500 text-white rounded-xl font-semibold font-arabic shadow-button"
        >
          استكشف الحلاقين
        </motion.button>
      )}
    </motion.div>
  );
}

/* ─── Main Page ─── */
export default function Appointments() {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const navigate = useNavigate();

  const upcoming = getUpcomingAppointments();
  const past = getPastAppointments();

  return (
    <Layout navbarProps={{ title: 'مواعيدي' }}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <SegmentedControl active={activeTab} onChange={setActiveTab} />

        <div className="px-4 pb-6">
          <AnimatePresence mode="wait">
            {activeTab === 'upcoming' ? (
              <motion.div
                key="upcoming"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                {upcoming.length === 0 ? (
                  <EmptyState type="upcoming" />
                ) : (
                  <div>
                    {upcoming.map((apt, i) => (
                      <motion.div
                        key={apt.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          delay: i * 0.06,
                          duration: 0.5,
                          ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
                        }}
                      >
                        <UpcomingCard appointment={apt} onNavigate={navigate} />
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="past"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                {past.length === 0 ? (
                  <EmptyState type="past" />
                ) : (
                  <div>
                    {past.map((apt, i) => (
                      <motion.div
                        key={apt.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          delay: i * 0.06,
                          duration: 0.5,
                          ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
                        }}
                      >
                        <PastCard appointment={apt} onNavigate={navigate} />
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </Layout>
  );
}
