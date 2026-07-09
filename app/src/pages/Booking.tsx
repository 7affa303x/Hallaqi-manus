import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight,
  X,
  Check,
  Clock,
  Calendar,
  ChevronLeft,
  ChevronRightIcon,
  MapPin,
  Scissors,
  CreditCard,
  Smartphone,
  Banknote,
} from 'lucide-react';
import { useBookingStore } from '@/store/bookingStore';
import { mockBarbers } from '@/data/mockBarbers';
import type { Service } from '@/store/bookingStore';

type Step = 1 | 2 | 3 | 4;
type PaymentMethod = 'ccp' | 'baridi' | 'cash';

const easeOutExpo = [0.16, 1, 0.3, 1] as [number, number, number, number];
const easeSpring = [0.32, 0.72, 0, 1] as [number, number, number, number];

const stepLabels = ['الخدمات', 'التاريخ', 'الوقت', 'التأكيد'];

// Time slots grouped by period
const morningSlots = ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30'];
const afternoonSlots = ['12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30'];
const eveningSlots = ['16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30'];
const unavailableSlots = ['10:30', '14:30', '16:00', '09:00', '17:30'];

const dayNames = ['أحد', 'اثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'];
const monthNames = [
  'جانفي', 'فيفري', 'مارس', 'أفريل', 'ماي', 'جوان',
  'جويلية', 'أوت', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر',
];

export default function Booking() {
  const navigate = useNavigate();
  const { booking, setBarber, setDate, setTime, resetBooking } = useBookingStore();

  // If no barber in booking state, use first mock barber as fallback
  const barber = booking.barber ?? mockBarbers[0];

  const [step, setStep] = useState<Step>(1);
  const [selectedServices, setSelectedServices] = useState<Set<string>>(new Set());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [notes, setNotes] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(new Date());

  // Ensure barber is set in store
  useMemo(() => {
    if (!booking.barber) {
      setBarber(barber);
    }
  }, [booking.barber, barber, setBarber]);

  const services = barber.services ?? [];

  const selectedServicesList = useMemo(
    () => services.filter((s) => selectedServices.has(s.id)),
    [services, selectedServices]
  );

  const totalPrice = useMemo(
    () => selectedServicesList.reduce((sum, s) => sum + s.price, 0),
    [selectedServicesList]
  );

  const totalDuration = useMemo(
    () => selectedServicesList.reduce((sum, s) => sum + s.duration, 0),
    [selectedServicesList]
  );

  const toggleService = useCallback((serviceId: string) => {
    setSelectedServices((prev) => {
      const next = new Set(prev);
      if (next.has(serviceId)) {
        next.delete(serviceId);
      } else {
        next.add(serviceId);
      }
      return next;
    });
  }, []);

  const canProceed = () => {
    if (step === 1) return selectedServices.size > 0;
    if (step === 2) return selectedDate !== null;
    if (step === 3) return selectedTime !== null;
    return true;
  };

  const goNext = () => {
    if (step < 4) {
      if (step === 2 && selectedDate) setDate(selectedDate);
      if (step === 3 && selectedTime) setTime(selectedTime);
      setStep((s) => (s + 1) as Step);
    }
  };

  const goBack = () => {
    if (step > 1) {
      setStep((s) => (s - 1) as Step);
    } else {
      navigate(-1);
    }
  };

  const handleConfirm = () => {
    setShowSuccess(true);
  };

  const handleSuccessDone = () => {
    resetBooking();
    navigate('/appointments');
  };

  const handleDismiss = () => {
    resetBooking();
    navigate(-1);
  };

  // Generate calendar days
  const getCalendarDays = () => {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();

    const days: { date: number; fullDate: string; isToday: boolean; isPast: boolean }[] = [];

    // Empty cells for days before month starts
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push({ date: 0, fullDate: '', isToday: false, isPast: true });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      const dateStr = date.toISOString().split('T')[0];
      const isToday = date.getTime() === today.getTime();
      const isPast = date.getTime() < today.getTime();
      // Make some dates unavailable (random pattern)
      const isUnavailable = !isToday && !isPast && (d % 7 === 5 || d % 11 === 3);
      days.push({
        date: d,
        fullDate: dateStr,
        isToday,
        isPast: isPast || isUnavailable,
      });
    }

    return days;
  };

  const calendarDays = getCalendarDays();

  const goPrevMonth = () => {
    setCalendarMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const goNextMonth = () => {
    setCalendarMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const selectToday = () => {
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];
    setCalendarMonth(today);
    setSelectedDate(dateStr);
  };

  const formatSelectedDate = () => {
    if (!selectedDate) return '';
    const d = new Date(selectedDate + 'T00:00:00');
    return `${dayNames[d.getDay()]}، ${d.getDate()} ${monthNames[d.getMonth()]}`;
  };

  // Success screen
  if (showSuccess) {
    return (
      <div className="fixed inset-0 z-50 bg-bg-base flex flex-col items-center justify-center px-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
          className="w-24 h-24 rounded-full bg-success/10 flex items-center justify-center mb-6"
        >
          <motion.div
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Check className="w-12 h-12 text-success" strokeWidth={3} />
          </motion.div>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-2xl font-extrabold text-success font-arabic mb-2"
        >
          تم الحجز بنجاح!
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="text-text-secondary text-center font-arabic mb-2"
        >
          سنرسل لك تذكيراً قبل الموعد
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.0 }}
          className="px-4 py-2 bg-bg-elevated rounded-xl mt-2"
        >
          <span className="font-mono text-sm text-text-secondary">
            رقم الحجز: #KCM-{Math.floor(1000 + Math.random() * 9000)}
          </span>
        </motion.div>

        {/* Confetti burst */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 30 }).map((_, i) => {
            const colors = ['#D4463A', '#D4A017', '#2E8B57', '#E87A5D', '#007AFF'];
            const color = colors[i % colors.length];
            const x = 50 + (Math.random() - 0.5) * 60;
            const y = 50 + (Math.random() - 0.5) * 40;
            const size = 4 + Math.random() * 8;
            const rotation = Math.random() * 360;
            const delay = 0.8 + Math.random() * 0.5;

            return (
              <motion.div
                key={i}
                initial={{
                  opacity: 1,
                  x: `${50}vw`,
                  y: `${50}vh`,
                  scale: 0,
                  rotate: 0,
                }}
                animate={{
                  opacity: [1, 1, 0],
                  x: `${x}vw`,
                  y: `${y + 30}vh`,
                  scale: [0, 1, 0.5],
                  rotate: rotation,
                }}
                transition={{
                  duration: 1.5,
                  delay,
                  ease: easeOutExpo,
                }}
                style={{
                  position: 'absolute',
                  width: size,
                  height: size * 1.5,
                  backgroundColor: color,
                  borderRadius: 1,
                }}
              />
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.4 }}
          className="w-full max-w-mobile mt-10 space-y-3 relative z-10"
        >
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={handleSuccessDone}
            className="w-full h-14 rounded-2xl font-bold text-white font-arabic text-base shadow-button bg-gradient-to-r from-[#D4463A] to-[#E87A5D]"
          >
            العودة للمواعيد
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-bg-base flex flex-col relative">
      {/* ===== HEADER ===== */}
      <div className="sticky top-0 z-40 bg-bg-card border-b border-border-subtle">
        {/* Handle pill */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-text-tertiary/30" />
        </div>

        <div className="flex items-center justify-between px-4 h-12">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={step === 1 ? handleDismiss : goBack}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-bg-elevated transition-colors"
          >
            {step === 1 ? (
              <X className="w-5 h-5 text-text-secondary" />
            ) : (
              <ChevronRight className="w-5 h-5 text-text-secondary rtl-flip" />
            )}
          </motion.button>

          <h1 className="text-base font-semibold text-text-primary font-arabic absolute left-1/2 -translate-x-1/2">
            حجز موعد
          </h1>

          <span className="text-xs text-text-tertiary font-mono">
            {step} / 4
          </span>
        </div>

        {/* ===== STEP INDICATOR ===== */}
        <div className="px-6 pb-4">
          <div className="flex items-center justify-between relative">
            {/* Connecting line */}
            <div className="absolute top-[5px] right-[14px] left-[14px] h-0.5 bg-border-subtle">
              <motion.div
                className="h-full bg-primary-500"
                initial={{ width: '0%' }}
                animate={{
                  width: `${((step - 1) / 3) * 100}%`,
                }}
                transition={{ duration: 0.4, ease: easeSpring }}
              />
            </div>

            {[1, 2, 3, 4].map((s) => {
              const isCompleted = step > s;
              const isActive = step === s;
              return (
                <div key={s} className="flex flex-col items-center gap-1 relative z-10">
                  <motion.div
                    className={`w-3 h-3 rounded-full flex items-center justify-center transition-colors duration-300 ${
                      isCompleted
                        ? 'bg-primary-500'
                        : isActive
                        ? 'bg-primary-500 ring-4 ring-primary-100'
                        : 'bg-bg-card border-2 border-border-subtle'
                    }`}
                  >
                    {isCompleted && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      >
                        <Check className="w-2 h-2 text-white" strokeWidth={4} />
                      </motion.div>
                    )}
                  </motion.div>
                  <span
                    className={`text-[10px] font-medium font-arabic ${
                      isActive || isCompleted ? 'text-primary-500' : 'text-text-tertiary'
                    }`}
                  >
                    {stepLabels[s - 1]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ===== CONTENT ===== */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <Step1Services
              key="step1"
              services={services}
              selectedServices={selectedServices}
              onToggleService={toggleService}
              totalPrice={totalPrice}
              totalDuration={totalDuration}
            />
          )}
          {step === 2 && (
            <Step2Date
              key="step2"
              calendarMonth={calendarMonth}
              calendarDays={calendarDays}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              onPrevMonth={goPrevMonth}
              onNextMonth={goNextMonth}
              onSelectToday={selectToday}
            />
          )}
          {step === 3 && (
            <Step3Time
              key="step3"
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              onSelectTime={setSelectedTime}
              formatSelectedDate={formatSelectedDate}
            />
          )}
          {step === 4 && (
            <Step4Confirm
              key="step4"
              barber={barber}
              selectedServices={selectedServicesList}
              totalPrice={totalPrice}
              selectedTime={selectedTime}
              formatSelectedDate={formatSelectedDate}
              paymentMethod={paymentMethod}
              onSelectPayment={setPaymentMethod}
              notes={notes}
              onNotesChange={setNotes}
            />
          )}
        </AnimatePresence>
      </div>

      {/* ===== FOOTER ACTION BUTTON ===== */}
      <div className="sticky bottom-0 z-40 bg-bg-card border-t border-border-subtle px-4 py-3">
        <motion.button
          whileTap={canProceed() ? { scale: 0.96 } : {}}
          onClick={step === 4 ? handleConfirm : goNext}
          disabled={!canProceed()}
          className={`w-full h-14 rounded-2xl font-bold text-white font-arabic text-base transition-all duration-300 ${
            canProceed()
              ? step === 4
                ? 'bg-gradient-to-r from-[#D4463A] to-[#E87A5D] shadow-button'
                : 'bg-primary-500 shadow-button'
              : 'bg-text-tertiary/30 cursor-not-allowed'
          }`}
        >
          {step === 4 ? 'تأكيد الحجز' : 'التالي'}
        </motion.button>
      </div>

      {/* Safe area */}
      <div className="h-[env(safe-area-inset-bottom)] bg-bg-card" />
    </div>
  );
}

/* ===== STEP 1: SERVICES ===== */
function Step1Services({
  services,
  selectedServices,
  onToggleService,
  totalPrice,
  totalDuration,
}: {
  services: Service[];
  selectedServices: Set<string>;
  onToggleService: (id: string) => void;
  totalPrice: number;
  totalDuration: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.4, ease: easeOutExpo }}
      className="px-4 py-5 pb-8"
    >
      <p className="text-body text-text-secondary font-arabic mb-5">
        اختر الخدمات التي تريدها
      </p>

      <div className="space-y-3">
        {services.map((service, index) => {
          const isSelected = selectedServices.has(service.id);
          return (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: easeOutExpo, delay: index * 0.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onToggleService(service.id)}
              className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-colors duration-200 ${
                isSelected
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-transparent bg-bg-card shadow-card'
              }`}
            >
              {/* Checkbox */}
              <div
                className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-colors duration-200 ${
                  isSelected ? 'bg-primary-500 border-primary-500' : 'border-border-subtle'
                }`}
              >
                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    >
                      <Check className="w-4 h-4 text-white" strokeWidth={3} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Icon */}
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  isSelected ? 'bg-primary-100' : 'bg-bg-elevated'
                }`}
              >
                <Scissors
                  className={`w-5 h-5 ${isSelected ? 'text-primary-500' : 'text-text-secondary'}`}
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-semibold text-text-primary font-arabic truncate">
                  {service.name}
                </h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <Clock className="w-3.5 h-3.5 text-text-tertiary" />
                  <span className="text-xs text-text-tertiary font-arabic">
                    {service.duration} دقيقة
                  </span>
                </div>
              </div>

              {/* Price */}
              <span className="font-display font-bold text-lg text-primary-500 flex-shrink-0">
                {service.price} دج
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* Running total */}
      <AnimatePresence>
        {selectedServices.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: easeSpring }}
            className="mt-6 p-4 bg-bg-card rounded-2xl shadow-card"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary font-arabic">المجموع:</p>
                <p className="text-xs text-text-tertiary font-arabic mt-0.5">
                  {totalDuration} دقيقة · {selectedServices.size} خدمة
                </p>
              </div>
              <span className="font-display font-bold text-xl text-primary-500">
                {totalPrice} دج
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ===== STEP 2: DATE SELECTION ===== */
function Step2Date({
  calendarMonth,
  calendarDays,
  selectedDate,
  onSelectDate,
  onPrevMonth,
  onNextMonth,
  onSelectToday,
}: {
  calendarMonth: Date;
  calendarDays: { date: number; fullDate: string; isToday: boolean; isPast: boolean }[];
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onSelectToday: () => void;
}) {
  const currentMonthName = monthNames[calendarMonth.getMonth()];
  const currentYear = calendarMonth.getFullYear();

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.4, ease: easeOutExpo }}
      className="px-4 py-5 pb-8"
    >
      <p className="text-body text-text-secondary font-arabic mb-5">
        اختر يوم الموعد
      </p>

      {/* Month navigation */}
      <div className="flex items-center justify-between mb-4">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onPrevMonth}
          className="w-10 h-10 rounded-xl bg-bg-card shadow-card flex items-center justify-center"
        >
          <ChevronLeft className="w-5 h-5 text-text-secondary" />
        </motion.button>
        <h2 className="text-lg font-bold text-text-primary font-arabic">
          {currentMonthName} {currentYear}
        </h2>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onNextMonth}
          className="w-10 h-10 rounded-xl bg-bg-card shadow-card flex items-center justify-center"
        >
          <ChevronRightIcon className="w-5 h-5 text-text-secondary" />
        </motion.button>
      </div>

      {/* Day names */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((name) => (
          <div key={name} className="text-center text-xs text-text-tertiary font-arabic py-2">
            {name}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, index) => {
          if (day.date === 0) {
            return <div key={`empty-${index}`} className="aspect-square" />;
          }
          const isSelected = selectedDate === day.fullDate;
          return (
            <motion.button
              key={day.fullDate}
              whileTap={day.isPast ? {} : { scale: 0.9 }}
              onClick={() => !day.isPast && onSelectDate(day.fullDate)}
              className={`aspect-square rounded-xl flex items-center justify-center text-sm font-medium transition-colors duration-200 ${
                isSelected
                  ? 'bg-primary-500 text-white shadow-button'
                  : day.isToday
                  ? 'bg-bg-card text-primary-500 border-2 border-primary-500'
                  : day.isPast
                  ? 'bg-bg-elevated text-text-tertiary line-through cursor-not-allowed'
                  : 'bg-bg-card text-text-primary border border-border-subtle'
              }`}
            >
              {day.date}
            </motion.button>
          );
        })}
      </div>

      {/* Quick select */}
      <div className="flex gap-2 mt-5">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onSelectToday}
          className="px-5 py-2.5 bg-primary-50 text-primary-700 rounded-xl text-sm font-semibold font-arabic border border-primary-200"
        >
          اليوم
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            const d = new Date();
            d.setDate(d.getDate() + 1);
            onSelectDate(d.toISOString().split('T')[0]);
          }}
          className="px-5 py-2.5 bg-bg-card text-text-secondary rounded-xl text-sm font-medium font-arabic border border-border-subtle shadow-card"
        >
          غداً
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            const d = new Date();
            d.setDate(d.getDate() + 2);
            onSelectDate(d.toISOString().split('T')[0]);
          }}
          className="px-5 py-2.5 bg-bg-card text-text-secondary rounded-xl text-sm font-medium font-arabic border border-border-subtle shadow-card"
        >
          بعد غد
        </motion.button>
      </div>

      {/* Selected date display */}
      <AnimatePresence>
        {selectedDate && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mt-4 p-3 bg-primary-50 rounded-xl border border-primary-200 flex items-center gap-2"
          >
            <Calendar className="w-4 h-4 text-primary-500" />
            <span className="text-sm text-primary-700 font-arabic">
              {(() => {
                const d = new Date(selectedDate + 'T00:00:00');
                return `${dayNames[d.getDay()]}، ${d.getDate()} ${monthNames[d.getMonth()]}`;
              })()}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ===== STEP 3: TIME SELECTION ===== */
function Step3Time({
  selectedDate,
  selectedTime,
  onSelectTime,
  formatSelectedDate,
}: {
  selectedDate: string | null;
  selectedTime: string | null;
  onSelectTime: (time: string) => void;
  formatSelectedDate: () => string;
}) {
  const renderSlotGroup = (label: string, slots: string[]) => (
    <div className="mb-5">
      <h3 className="text-sm font-semibold text-text-secondary font-arabic mb-2">{label}</h3>
      <div className="grid grid-cols-3 gap-2">
        {slots.map((slot) => {
          const isUnavailable = unavailableSlots.includes(slot);
          const isSelected = selectedTime === slot;
          return (
            <motion.button
              key={slot}
              whileTap={isUnavailable ? {} : { scale: 0.95 }}
              onClick={() => !isUnavailable && onSelectTime(slot)}
              className={`h-12 rounded-xl text-sm font-mono font-medium transition-all duration-200 ${
                isSelected
                  ? 'bg-primary-500 text-white shadow-button'
                  : isUnavailable
                  ? 'bg-bg-elevated text-text-tertiary line-through cursor-not-allowed'
                  : 'bg-bg-card text-text-primary border border-border-subtle shadow-card'
              }`}
            >
              {slot}
            </motion.button>
          );
        })}
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.4, ease: easeOutExpo }}
      className="px-4 py-5 pb-8"
    >
      <p className="text-body text-text-secondary font-arabic mb-4">
        اختر الوقت المناسب
      </p>

      {/* Selected date pill */}
      {selectedDate && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-bg-card rounded-full shadow-card mb-5"
        >
          <Calendar className="w-4 h-4 text-primary-500" />
          <span className="text-sm font-medium text-text-primary font-arabic">
            {formatSelectedDate()}
          </span>
        </motion.div>
      )}

      {renderSlotGroup('الصباح', morningSlots)}
      {renderSlotGroup('بعد الظهر', afternoonSlots)}
      {renderSlotGroup('المساء', eveningSlots)}
    </motion.div>
  );
}

/* ===== STEP 4: CONFIRMATION ===== */
function Step4Confirm({
  barber,
  selectedServices,
  totalPrice,
  selectedTime,
  formatSelectedDate,
  paymentMethod,
  onSelectPayment,
  notes,
  onNotesChange,
}: {
  barber: { name: string; avatar: string; location: string; rating: number };
  selectedServices: Service[];
  totalPrice: number;
  selectedTime: string | null;
  formatSelectedDate: () => string;
  paymentMethod: PaymentMethod;
  onSelectPayment: (m: PaymentMethod) => void;
  notes: string;
  onNotesChange: (v: string) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.4, ease: easeOutExpo }}
      className="px-4 py-5 pb-8 space-y-5"
    >
      {/* Barber Summary Card */}
      <div className="bg-bg-elevated rounded-2xl p-4">
        <div className="flex items-center gap-3">
          <img
            src={barber.avatar}
            alt={barber.name}
            className="w-12 h-12 rounded-xl object-cover"
          />
          <div className="flex-1">
            <h3 className="font-bold text-text-primary font-arabic">{barber.name}</h3>
            <div className="flex items-center gap-1 text-text-tertiary text-xs">
              <MapPin className="w-3 h-3" />
              <span className="font-arabic">{barber.location}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Services Summary */}
      <div className="bg-bg-card rounded-2xl p-4 shadow-card">
        <h3 className="text-sm font-semibold text-text-secondary font-arabic mb-3">
          الخدمات المختارة
        </h3>
        <div className="space-y-2">
          {selectedServices.map((service) => (
            <div key={service.id} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-success" />
                <span className="text-sm text-text-primary font-arabic">{service.name}</span>
              </div>
              <span className="text-sm font-display font-bold text-text-secondary">
                {service.price} دج
              </span>
            </div>
          ))}
        </div>

        <div className="border-t border-border-subtle mt-3 pt-3 flex items-center justify-between">
          <span className="text-sm font-semibold text-text-primary font-arabic">المجموع الكلي</span>
          <span className="text-xl font-display font-bold text-primary-500">{totalPrice} دج</span>
        </div>

        {/* Date & Time */}
        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border-subtle">
          <div className="flex items-center gap-1.5 text-sm text-text-secondary">
            <Calendar className="w-4 h-4 text-text-tertiary" />
            <span className="font-arabic">{formatSelectedDate()}</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-text-secondary">
            <Clock className="w-4 h-4 text-text-tertiary" />
            <span className="font-mono">{selectedTime}</span>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="bg-bg-card rounded-2xl p-4 shadow-card">
        <label className="text-sm font-semibold text-text-secondary font-arabic block mb-2">
          ملاحظات (اختياري)
        </label>
        <textarea
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder="أي ملاحظات خاصة..."
          className="w-full h-24 bg-bg-elevated rounded-xl p-3 text-sm text-text-primary placeholder:text-text-tertiary font-arabic resize-none border border-transparent focus:border-primary-500 focus:outline-none transition-colors"
        />
      </div>

      {/* Payment Method */}
      <div>
        <h3 className="text-sm font-semibold text-text-secondary font-arabic mb-3">
          طريقة الدفع
        </h3>
        <div className="space-y-2">
          {/* CCP */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectPayment('ccp')}
            className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-colors ${
              paymentMethod === 'ccp'
                ? 'border-primary-500 bg-primary-50'
                : 'border-transparent bg-bg-card shadow-card'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-bg-elevated flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-text-secondary" />
            </div>
            <div className="flex-1 text-left">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-text-primary font-arabic">
                  الحساب البريدي
                </span>
                <span className="px-2 py-0.5 bg-bg-elevated text-text-tertiary text-[10px] font-medium rounded-full font-arabic">
                  قريباً
                </span>
              </div>
              <p className="text-xs text-text-tertiary font-arabic">الدفع عبر CCP</p>
            </div>
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                paymentMethod === 'ccp' ? 'border-primary-500' : 'border-border-subtle'
              }`}
            >
              {paymentMethod === 'ccp' && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-2.5 h-2.5 rounded-full bg-primary-500"
                />
              )}
            </div>
          </motion.button>

          {/* Baridi Mob */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectPayment('baridi')}
            className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-colors ${
              paymentMethod === 'baridi'
                ? 'border-primary-500 bg-primary-50'
                : 'border-transparent bg-bg-card shadow-card'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-bg-elevated flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-text-secondary" />
            </div>
            <div className="flex-1 text-left">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-text-primary font-arabic">
                  بريدي موب
                </span>
                <span className="px-2 py-0.5 bg-bg-elevated text-text-tertiary text-[10px] font-medium rounded-full font-arabic">
                  قريباً
                </span>
              </div>
              <p className="text-xs text-text-tertiary font-arabic">الدفع عبر Baridi Mob</p>
            </div>
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                paymentMethod === 'baridi' ? 'border-primary-500' : 'border-border-subtle'
              }`}
            >
              {paymentMethod === 'baridi' && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-2.5 h-2.5 rounded-full bg-primary-500"
                />
              )}
            </div>
          </motion.button>

          {/* Cash */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectPayment('cash')}
            className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-colors ${
              paymentMethod === 'cash'
                ? 'border-primary-500 bg-primary-50'
                : 'border-transparent bg-bg-card shadow-card'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
              <Banknote className="w-5 h-5 text-success" />
            </div>
            <div className="flex-1 text-left">
              <span className="text-sm font-semibold text-text-primary font-arabic">
                الدفع عند الزيارة
              </span>
              <p className="text-xs text-success font-arabic">متاح الآن</p>
            </div>
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                paymentMethod === 'cash' ? 'border-primary-500' : 'border-border-subtle'
              }`}
            >
              {paymentMethod === 'cash' && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-2.5 h-2.5 rounded-full bg-primary-500"
                />
              )}
            </div>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
