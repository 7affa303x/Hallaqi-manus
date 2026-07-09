import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CalendarDays,
  Clock,
  MapPin,
  MessageCircle,
  X,
  ChevronRight,
  Phone,
  Star,
  Check,
  Banknote,
} from 'lucide-react';
import Layout from '@/components/Layout';
import { getAppointmentById } from '@/data/mockAppointments';

/* ─── Status Timeline ─── */
const timelineSteps = [
  { key: 'booked', label: 'محجوز' },
  { key: 'confirmed', label: 'مؤكد' },
  { key: 'in-progress', label: 'جاري' },
  { key: 'completed', label: 'مكتمل' },
] as const;

function StatusTimeline({ currentStep }: { currentStep: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
      className="mx-4 mt-4 bg-bg-card rounded-2xl shadow-card p-4"
    >
      <div className="flex items-center justify-between relative">
        {/* Connecting line background */}
        <div className="absolute top-[14px] right-[14%] left-[14%] h-0.5 bg-border-subtle rounded-full" />
        {/* Connecting line completed */}
        <motion.div
          className="absolute top-[14px] right-[14%] h-0.5 bg-success rounded-full"
          initial={{ width: 0 }}
          animate={{
            width: `${Math.min(((currentStep - 1) / (timelineSteps.length - 1)) * 72, 72)}%`,
          }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number], delay: 0.2 }}
        />

        {timelineSteps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;

          return (
            <motion.div
              key={step.key}
              className="relative z-10 flex flex-col items-center gap-1.5"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: 0.2 + index * 0.2,
                duration: 0.3,
                ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
              }}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center border-2 transition-colors duration-base ${
                  isCompleted
                    ? 'bg-success border-success'
                    : isCurrent
                    ? 'bg-primary-500 border-primary-500'
                    : 'bg-bg-card border-border-subtle'
                } ${isCurrent ? 'animate-pulse-indicator' : ''}`}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4 text-white" strokeWidth={3} />
                ) : isCurrent ? (
                  <motion.div
                    className="w-2 h-2 rounded-full bg-white"
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  />
                ) : (
                  <div className="w-2 h-2 rounded-full bg-border-subtle" />
                )}
              </div>
              <span
                className={`text-[10px] font-bold font-arabic ${
                  isCompleted
                    ? 'text-success'
                    : isCurrent
                    ? 'text-primary-500'
                    : 'text-text-tertiary'
                }`}
              >
                {step.label}
              </span>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

/* ─── Barber Info Card ─── */
function BarberInfoCard({
  name,
  avatar,
  rating,
  onChat,
}: {
  name: string;
  avatar: string;
  rating: number;
  onChat: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
      className="mx-4 mt-3 bg-bg-card rounded-2xl shadow-card p-4 flex items-center gap-3"
    >
      <img src={avatar} alt={name} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <h3 className="font-bold font-arabic text-base text-text-primary">{name}</h3>
        <p className="text-sm text-text-secondary font-arabic">حلاق محترف</p>
        <div className="flex items-center gap-1 mt-0.5">
          <Star className="w-3.5 h-3.5 text-gold fill-gold" />
          <span className="text-sm font-semibold text-text-secondary">{rating}</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <motion.button
          whileTap={{ scale: 0.9 }}
          className="w-10 h-10 rounded-full bg-success/10 text-success flex items-center justify-center"
        >
          <Phone className="w-5 h-5" />
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onChat}
          className="w-10 h-10 rounded-full bg-primary-50 text-primary-500 flex items-center justify-center"
        >
          <MessageCircle className="w-5 h-5" />
        </motion.button>
        <ChevronRight className="w-5 h-5 text-text-tertiary rtl-flip" />
      </div>
    </motion.div>
  );
}

/* ─── Service Details ─── */
function ServiceDetails({
  services,
  isHomeService,
}: {
  services: { name: string; price: number; duration: number }[];
  isHomeService: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
      className="mx-4 mt-3 bg-bg-card rounded-2xl shadow-card p-4"
    >
      <h3 className="text-base font-semibold font-arabic text-text-primary mb-3">
        تفاصيل الخدمة
      </h3>
      <div className="space-y-3">
        {services.map((service, i) => (
          <motion.div
            key={service.name}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.5 + i * 0.04,
              duration: 0.3,
              ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
            }}
            className="flex items-center justify-between"
          >
            <div>
              <p className="text-[15px] font-medium font-arabic">{service.name}</p>
              {service.duration > 0 && (
                <span className="flex items-center gap-1 text-xs text-text-tertiary mt-0.5">
                  <Clock className="w-3 h-3" />
                  {service.duration} دقيقة
                </span>
              )}
            </div>
            <span className="font-mono font-bold text-text-primary">
              {service.price.toLocaleString()} دج
            </span>
          </motion.div>
        ))}
        {isHomeService && (
          <div className="flex items-center justify-between pt-2 border-t border-dashed border-border-subtle">
            <span className="flex items-center gap-1.5 text-sm text-text-secondary font-arabic">
              <MapPin className="w-3.5 h-3.5 text-primary-500" />
              خدمة منزلية
            </span>
            <span className="text-xs text-primary-500 font-bold font-arabic">متضمنة</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* ─── Date & Location Cards ─── */
function DateLocationCards({
  displayDate,
  displayTime,
  location,
  isHomeService,
}: {
  displayDate: string;
  displayTime: string;
  location: string;
  isHomeService: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
      className="mx-4 mt-3 grid grid-cols-2 gap-3"
    >
      {/* Date Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.3, ease: [0.32, 0.72, 0, 1] as [number, number, number, number] }}
        className="bg-bg-card rounded-xl shadow-card p-4"
      >
        <CalendarDays className="w-6 h-6 text-primary-500 mb-2" />
        <p className="text-lg font-bold font-arabic text-text-primary">
          {displayDate.split('،')[0]}
        </p>
        <p className="text-sm text-text-secondary font-arabic mt-0.5">
          {displayDate.split('،').slice(1).join('،')}
        </p>
        <p className="text-xs text-text-tertiary mt-1 flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {displayTime}
        </p>
      </motion.div>

      {/* Location Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.65, duration: 0.3, ease: [0.32, 0.72, 0, 1] as [number, number, number, number] }}
        className="bg-bg-card rounded-xl shadow-card p-4"
      >
        <MapPin className="w-6 h-6 text-primary-500 mb-2" />
        <p className="text-lg font-bold font-arabic text-text-primary">
          {isHomeService ? 'المنزل' : 'الموقع'}
        </p>
        <p className="text-sm text-text-secondary font-arabic mt-0.5 truncate">
          {isHomeService ? 'خدمة متنقلة' : location.split('،')[0]}
        </p>
        {!isHomeService && (
          <button className="text-xs text-primary-500 font-bold mt-1 font-arabic">
            الحصول على الاتجاهات
          </button>
        )}
      </motion.div>
    </motion.div>
  );
}

/* ─── Price Summary ─── */
function PriceSummary({ price }: { price: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.7, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
      className="mx-4 mt-3 bg-bg-elevated rounded-2xl p-4"
    >
      <h3 className="text-base font-semibold font-arabic text-text-primary mb-3">
        ملخص السعر
      </h3>

      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-text-secondary font-arabic">المجموع</span>
        <span className="font-mono font-semibold text-text-primary">
          {price.toLocaleString()} دج
        </span>
      </div>

      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-text-secondary font-arabic">خصم</span>
        <span className="font-mono font-semibold text-success">0 دج</span>
      </div>

      {/* Dashed divider */}
      <div className="border-t border-dashed border-border-subtle my-3" />

      <div className="flex items-center justify-between">
        <span className="text-base font-bold font-arabic text-text-primary">الإجمالي</span>
        <span className="font-mono font-bold text-xl text-primary-500">
          {price.toLocaleString()} دج
        </span>
      </div>

      {/* Payment method */}
      <div className="mt-3 flex items-center gap-2 text-text-tertiary">
        <Banknote className="w-4 h-4" />
        <span className="text-xs font-arabic">الدفع عند الزيارة</span>
      </div>
    </motion.div>
  );
}

/* ─── Cancel Confirmation Sheet ─── */
function CancelSheet({
  isOpen,
  onClose,
  onConfirm,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-end justify-center"
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-overlay-dark" />

          {/* Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-mobile bg-bg-card rounded-t-3xl p-6"
          >
            {/* Handle */}
            <div className="w-10 h-1 rounded-full bg-text-tertiary/40 mx-auto mb-4" />

            <h3 className="text-lg font-bold font-arabic text-text-primary text-center mb-2">
              هل أنت متأكد من إلغاء الموعد؟
            </h3>
            <p className="text-sm text-text-secondary font-arabic text-center mb-6">
              سيتم إخطار الحلاق بالإلغاء. يرجى الملاحظة أن الإلغاء المتكرر قد يؤثر على حسابك.
            </p>

            <div className="space-y-3">
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={onConfirm}
                className="w-full h-12 bg-error text-white rounded-xl font-bold font-arabic"
              >
                نعم، ألغِ الموعد
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={onClose}
                className="w-full h-12 bg-bg-elevated text-text-primary rounded-xl font-bold font-arabic"
              >
                لا، احتفظ بالموعد
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─── Main Page ─── */
export default function AppointmentDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showCancel, setShowCancel] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);

  const appointment = getAppointmentById(id ?? '');

  if (!appointment) {
    return (
      <Layout navbarProps={{ title: 'تفاصيل الموعد', showBack: true }}>
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-text-secondary font-arabic">الموعد غير موجود</p>
          <button
            onClick={() => navigate('/appointments')}
            className="mt-4 px-4 py-2 bg-primary-500 text-white rounded-lg font-arabic"
          >
            العودة للمواعيد
          </button>
        </div>
      </Layout>
    );
  }

  // Determine timeline step based on status
  const getTimelineStep = () => {
    if (isCancelled) return -1;
    switch (appointment.status) {
      case 'pending':
        return 0;
      case 'confirmed':
        return 1;
      case 'reschedulable':
        return 1;
      case 'completed':
        return 3;
      case 'cancelled':
        return -1;
      default:
        return 0;
    }
  };

  const currentStep = getTimelineStep();

  return (
    <Layout navbarProps={{ title: 'تفاصيل الموعد', showBack: true }}>
      <div className="pb-6">
        {/* Status Timeline (hidden for cancelled) */}
        {currentStep >= 0 && <StatusTimeline currentStep={currentStep} />}

        {/* Cancelled banner */}
        {(appointment.status === 'cancelled' || isCancelled) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-4 mt-4 bg-error/10 border border-error/20 rounded-xl p-4 flex items-center gap-3"
          >
            <X className="w-5 h-5 text-error flex-shrink-0" />
            <p className="text-sm text-error font-bold font-arabic">
              تم إلغاء هذا الموعد
            </p>
          </motion.div>
        )}

        {/* Barber Info */}
        <BarberInfoCard
          name={appointment.barber.name}
          avatar={appointment.barber.avatar}
          rating={appointment.barber.rating}
          onChat={() => navigate(`/chat/${appointment.barberId}`)}
        />

        {/* Service Details */}
        <ServiceDetails
          services={appointment.services}
          isHomeService={appointment.isHomeService}
        />

        {/* Date & Location */}
        <DateLocationCards
          displayDate={appointment.displayDate}
          displayTime={appointment.displayTime}
          location={appointment.location}
          isHomeService={appointment.isHomeService}
        />

        {/* Price Summary */}
        <PriceSummary price={appointment.price} />

        {/* Action Buttons */}
        {!isCancelled && appointment.status !== 'cancelled' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
            className="mx-4 mt-4 space-y-3"
          >
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={() => navigate(`/chat/${appointment.barberId}`)}
              className="w-full h-12 bg-primary-50 text-primary-500 rounded-xl font-bold font-arabic flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              محادثة مع الحلاق
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={() => navigate('/booking')}
              className="w-full h-12 bg-bg-elevated text-text-primary rounded-xl font-bold font-arabic flex items-center justify-center gap-2"
            >
              <CalendarDays className="w-5 h-5" />
              إعادة جدولة
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={() => setShowCancel(true)}
              className="w-full h-12 bg-error/10 text-error rounded-xl font-bold font-arabic flex items-center justify-center gap-2"
            >
              <X className="w-5 h-5" />
              إلغاء الموعد
            </motion.button>
          </motion.div>
        )}

        {/* Back button (for cancelled) */}
        {(appointment.status === 'cancelled' || isCancelled) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.3 }}
            className="mx-4 mt-4"
          >
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={() => navigate('/appointments')}
              className="w-full h-12 bg-bg-elevated text-text-primary rounded-xl font-bold font-arabic flex items-center justify-center gap-2"
            >
              <ChevronRight className="w-5 h-5 rtl-flip" />
              العودة للمواعيد
            </motion.button>
          </motion.div>
        )}
      </div>

      {/* Cancel Confirmation Sheet */}
      <CancelSheet
        isOpen={showCancel}
        onClose={() => setShowCancel(false)}
        onConfirm={() => {
          setShowCancel(false);
          setIsCancelled(true);
        }}
      />
    </Layout>
  );
}
