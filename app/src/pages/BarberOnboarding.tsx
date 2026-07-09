import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Phone, Mail, Camera, MapPin, Scissors, Tag, DollarSign,
  Clock, ChevronLeft, ChevronRight, Check, X,
  Shield, ShieldCheck, Upload, Info, Plus, Trash2,
  Navigation, Home, Car, Sparkles,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';

/* ─────────── easing tokens ─────────── */
const easeOutExpo = [0.16, 1, 0.3, 1] as [number, number, number, number];

/* ─────────── algerian wilayas ─────────── */
const WILAYAS = [
  'أدرار', 'الشلف', 'الأغواط', 'أم البواقي', 'باتنة', 'بجاية', 'بسكرة', 'بشار',
  'البليدة', 'البويرة', 'تمنراست', 'تبسة', 'تلمسان', 'تيارت', 'تيزي وزو', 'الجزائر',
  'الجلفة', 'جيجل', 'سطيف', 'سعيدة', 'سكيكدة', 'سيدي بلعباس', 'عنابة', 'قالمة',
  'قسنطينة', 'المدية', ' مستغانم', 'المسيلة', 'معسكر', 'ورقلة', 'وهران', 'البيض',
  'إليزي', 'برج بوعريريج', 'بومرداس', 'الطارف', 'تندوف', 'تيسمسيلت', 'الوادي', 'خنشلة',
  'سوق أهراس', 'تيبازة', 'ميلة', 'عين الدفلى', 'النعامة', 'عين تموشنت', 'غرداية', 'غليزان',
];

/* ─────────── specialties ─────────── */
const SPECIALTIES = [
  'قص الشعر', 'حلاقة الذقن', 'تسريحات', 'صبغة', 'العناية بالبشرة',
  'قص الأطفال', 'الحفاف', 'الكلاسيكي', 'الفيد',
];

/* ─────────── tags ─────────── */
const BARBER_TAGS = [
  'محترف', 'متنقل', 'سريع', 'يستخدم المقص', 'نظيف', 'ذو خبرة', 'مبتدئ و-dooff', 'تقييم عالٍ',
];

/* ─────────── default services ─────────── */
const DEFAULT_SERVICES = [
  { name: 'قص الشعر', price: 300, duration: '30' },
  { name: 'حلاقة الذقن', price: 150, duration: '15' },
  { name: 'تسريحة كاملة', price: 500, duration: '45' },
  { name: 'صبغة', price: 800, duration: '60' },
  { name: 'العناية بالبشرة', price: 400, duration: '30' },
];

/* ─────────── days ─────────── */
const DAYS = [
  { key: 'sat', label: 'السبت' },
  { key: 'sun', label: 'الأحد' },
  { key: 'mon', label: 'الإثنين' },
  { key: 'tue', label: 'الثلاثاء' },
  { key: 'wed', label: 'الأربعاء' },
  { key: 'thu', label: 'الخميس' },
  { key: 'fri', label: 'الجمعة' },
];

/* ─────────── duration options ─────────── */
const DURATIONS = ['15', '30', '45', '60', '90'];

/* ─────────── toast helper ─────────── */
function useToast() {
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setToast({ message, type });
    timerRef.current = setTimeout(() => setToast(null), 3000);
  }, []);

  const ToastComponent = useCallback(() => (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -40, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: -40, x: '-50%' }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          className="fixed top-4 left-1/2 z-[70] px-5 py-3 rounded-xl shadow-float text-white text-sm font-arabic font-medium min-w-[200px] text-center"
          style={{
            backgroundColor: toast.type === 'success' ? '#2E8B57' : toast.type === 'error' ? '#C0392B' : '#1E1C1A',
          }}
        >
          {toast.message}
        </motion.div>
      )}
    </AnimatePresence>
  ), [toast]);

  return { showToast, ToastComponent };
}

/* ─────────── step header ─────────── */
function StepHeader({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) {
  return (
    <div className="px-4 py-4">
      <div className="flex items-center gap-2">
        {Array.from({ length: totalSteps }, (_, i) => (
          <div key={i} className="flex-1 h-1.5 rounded-full bg-bg-elevated overflow-hidden">
            <motion.div
              initial={false}
              animate={{
                scaleX: i < currentStep ? 1 : 0,
                opacity: i < currentStep ? 1 : 0.3,
              }}
              transition={{ duration: 0.4, ease: easeOutExpo }}
              className="h-full rounded-full origin-right"
              style={{ backgroundColor: 'var(--primary-500)' }}
            />
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-2">
        <span className="text-[10px] text-text-tertiary font-arabic">
          الخطوة {currentStep} من {totalSteps}
        </span>
        <span className="text-[10px] text-text-tertiary font-arabic">
          {Math.round((currentStep / totalSteps) * 100)}%
        </span>
      </div>
    </div>
  );
}

/* ─────────── step dot indicator ─────────── */
function StepDots({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) {
  return (
    <div className="flex justify-center gap-2 py-3">
      {Array.from({ length: totalSteps }, (_, i) => (
        <motion.div
          key={i}
          animate={{
            scale: i + 1 === currentStep ? 1.3 : 1,
            backgroundColor: i + 1 <= currentStep ? 'var(--primary-500)' : 'var(--bg-elevated)',
          }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className="w-2 h-2 rounded-full"
        />
      ))}
    </div>
  );
}

/* ─────────── input wrapper with error ─────────── */
interface FormFieldProps {
  label: string;
  error?: string;
  children: React.ReactNode;
}

function FormField({ label, error, children }: FormFieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-text-primary font-arabic">{label}</label>
      {children}
      {error && (
        <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-error font-arabic">
          {error}
        </motion.p>
      )}
    </div>
  );
}

/* ─────────── photo upload placeholder ─────────── */
function PhotoUpload({
  label, onUpload, uploaded,
}: {
  label: string;
  onUpload: () => void;
  uploaded: boolean;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={onUpload}
      className={`relative w-full h-[140px] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-colors ${
        uploaded ? 'border-success bg-success/5' : 'border-border-subtle bg-bg-card'
      }`}
    >
      <AnimatePresence mode="wait">
        {uploaded ? (
          <motion.div
            key="done"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="flex flex-col items-center gap-1"
          >
            <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
              <Check className="w-6 h-6 text-success" />
            </div>
            <span className="text-xs text-success font-arabic">تم الرفع</span>
          </motion.div>
        ) : (
          <motion.div
            key="upload"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="flex flex-col items-center gap-1"
          >
            <Camera className="w-8 h-8 text-text-tertiary" />
            <span className="text-xs text-text-secondary font-arabic">{label}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

/* ─────────── multi-select chips ─────────── */
function MultiSelectChips({
  options, selected, onToggle, icon: Icon,
}: {
  options: string[];
  selected: string[];
  onToggle: (val: string) => void;
  icon?: typeof Scissors;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const isSelected = selected.includes(opt);
        return (
          <motion.button
            key={opt}
            whileTap={{ scale: 0.95 }}
            onClick={() => onToggle(opt)}
            className={`px-4 py-2 rounded-xl text-sm font-arabic font-medium transition-colors flex items-center gap-1.5 ${
              isSelected
                ? 'bg-primary-500 text-white shadow-button'
                : 'bg-bg-elevated text-text-secondary border border-border-subtle'
            }`}
          >
            {Icon && <Icon className="w-3.5 h-3.5" />}
            {opt}
          </motion.button>
        );
      })}
    </div>
  );
}

/* ─────────── step 1: personal info ─────────── */
function Step1Personal({
  data, errors, onChange,
}: {
  data: OnboardingData;
  errors: Record<string, string>;
  onChange: (field: string, value: string) => void;
}) {
  const [photoUploaded, setPhotoUploaded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3, ease: easeOutExpo }}
      className="px-4 space-y-5 pb-6"
    >
      <div className="text-center mb-2">
        <h2 className="text-xl font-bold text-text-primary font-arabic">المعلومات الشخصية</h2>
        <p className="text-sm text-text-secondary font-arabic mt-1">أخبرنا عن نفسك</p>
      </div>

      {/* Profile Photo */}
      <div className="flex justify-center">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setPhotoUploaded((p) => !p)}
          className="relative w-24 h-24 rounded-full bg-bg-elevated border-2 border-dashed border-border-subtle flex items-center justify-center overflow-hidden"
        >
          {photoUploaded ? (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex flex-col items-center">
              <User className="w-10 h-10 text-primary-500" />
              <div className="absolute bottom-0 inset-x-0 h-6 bg-primary-500/80 flex items-center justify-center">
                <Camera className="w-3 h-3 text-white" />
              </div>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center gap-1">
              <Camera className="w-8 h-8 text-text-tertiary" />
              <span className="text-[10px] text-text-tertiary font-arabic">صورة</span>
            </div>
          )}
        </motion.button>
      </div>

      <FormField label="الاسم الكامل" error={errors.fullName}>
        <div className="relative">
          <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
          <Input
            value={data.fullName}
            onChange={(e) => onChange('fullName', e.target.value)}
            placeholder="أدخل اسمك الكامل"
            className="pr-10 text-right font-arabic"
          />
        </div>
      </FormField>

      <FormField label="رقم الهاتف" error={errors.phone}>
        <div className="relative">
          <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
          <Input
            value={data.phone}
            onChange={(e) => onChange('phone', e.target.value)}
            placeholder="05XX XX XX XX"
            type="tel"
            className="pr-10 text-right font-arabic"
          />
        </div>
      </FormField>

      <FormField label="البريد الإلكتروني (اختياري)">
        <div className="relative">
          <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
          <Input
            value={data.email}
            onChange={(e) => onChange('email', e.target.value)}
            placeholder="email@example.com"
            type="email"
            className="pr-10 text-right font-arabic"
          />
        </div>
      </FormField>

      <FormField label="الولاية" error={errors.wilaya}>
        <div className="relative">
          <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary z-10" />
          <select
            value={data.wilaya}
            onChange={(e) => onChange('wilaya', e.target.value)}
            className="w-full h-10 pr-10 pl-3 rounded-md border border-border-subtle bg-bg-card text-right font-arabic text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-border-focus appearance-none"
          >
            <option value="">اختر الولاية</option>
            {WILAYAS.map((w) => (
              <option key={w} value={w}>{w}</option>
            ))}
          </select>
        </div>
      </FormField>
    </motion.div>
  );
}

/* ─────────── step 2: professional info ─────────── */
function Step2Professional({
  data, errors, onChange, onArrayToggle,
}: {
  data: OnboardingData;
  errors: Record<string, string>;
  onChange: (field: string, value: string | number) => void;
  onArrayToggle: (field: 'specialties' | 'tags', value: string) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3, ease: easeOutExpo }}
      className="px-4 space-y-5 pb-6"
    >
      <div className="text-center mb-2">
        <h2 className="text-xl font-bold text-text-primary font-arabic">المعلومات المهنية</h2>
        <p className="text-sm text-text-secondary font-arabic mt-1">أخبرنا عن خبرتك</p>
      </div>

      <FormField label="سنوات الخبرة" error={errors.experience}>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min={0}
            max={30}
            value={data.experience}
            onChange={(e) => onChange('experience', Number(e.target.value))}
            className="flex-1 accent-[#D4463A]"
          />
          <span className="text-lg font-bold text-primary-500 font-mono w-12 text-center">{data.experience}</span>
        </div>
        <p className="text-xs text-text-tertiary font-arabic">
          {data.experience === 0 ? 'مبتدئ' : data.experience < 3 ? 'خبرة متوسطة' : data.experience < 7 ? 'خبير' : 'محترف'}
        </p>
      </FormField>

      <FormField label="التخصصات" error={errors.specialties}>
        <MultiSelectChips
          options={SPECIALTIES}
          selected={data.specialties}
          onToggle={(v) => onArrayToggle('specialties', v)}
          icon={Scissors}
        />
      </FormField>

      <FormField label="الوسوم" error={errors.tags}>
        <MultiSelectChips
          options={BARBER_TAGS}
          selected={data.tags}
          onToggle={(v) => onArrayToggle('tags', v)}
          icon={Tag}
        />
      </FormField>

      <div className="grid grid-cols-2 gap-3">
        <FormField label="الحد الأدنى (دج)" error={errors.priceMin}>
          <div className="relative">
            <DollarSign className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
            <Input
              value={data.priceMin}
              onChange={(e) => onChange('priceMin', e.target.value)}
              placeholder="100"
              type="number"
              className="pr-10 text-right font-mono"
            />
          </div>
        </FormField>
        <FormField label="الحد الأقصى (دج)" error={errors.priceMax}>
          <div className="relative">
            <DollarSign className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
            <Input
              value={data.priceMax}
              onChange={(e) => onChange('priceMax', e.target.value)}
              placeholder="1000"
              type="number"
              className="pr-10 text-right font-mono"
            />
          </div>
        </FormField>
      </div>
    </motion.div>
  );
}

/* ─────────── step 3: services & pricing ─────────── */
function Step3Services({
  data, onUpdateServices,
}: {
  data: OnboardingData;
  onUpdateServices: (services: ServiceItem[]) => void;
}) {
  const [services, setServices] = useState<ServiceItem[]>(
    data.services.length > 0 ? data.services : DEFAULT_SERVICES.map((s, i) => ({ ...s, id: i })),
  );

  const updateService = (id: number, field: keyof ServiceItem, value: string) => {
    const updated = services.map((s) => (s.id === id ? { ...s, [field]: value } : s));
    setServices(updated);
    onUpdateServices(updated);
  };

  const addService = () => {
    const newService: ServiceItem = { id: Date.now(), name: '', price: 0, duration: '30' };
    const updated = [...services, newService];
    setServices(updated);
    onUpdateServices(updated);
  };

  const removeService = (id: number) => {
    const updated = services.filter((s) => s.id !== id);
    setServices(updated);
    onUpdateServices(updated);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3, ease: easeOutExpo }}
      className="px-4 space-y-4 pb-6"
    >
      <div className="text-center mb-2">
        <h2 className="text-xl font-bold text-text-primary font-arabic">الخدمات والأسعار</h2>
        <p className="text-sm text-text-secondary font-arabic mt-1">حدد خدماتك وأسعارك</p>
      </div>

      <AnimatePresence>
        {services.map((service, index) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12, height: 0 }}
            transition={{ delay: index * 0.03 }}
            className="bg-bg-card rounded-2xl shadow-card p-4 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Scissors className="w-4 h-4 text-primary-500" />
                <span className="text-sm font-medium text-text-primary font-arabic">خدمة {index + 1}</span>
              </div>
              {services.length > 1 && (
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => removeService(service.id)}
                  className="w-8 h-8 rounded-full bg-error/10 flex items-center justify-center"
                >
                  <Trash2 className="w-4 h-4 text-error" />
                </motion.button>
              )}
            </div>

            <div className="space-y-2">
              <Input
                value={service.name}
                onChange={(e) => updateService(service.id, 'name', e.target.value)}
                placeholder="اسم الخدمة"
                className="text-right font-arabic"
              />
              <div className="grid grid-cols-2 gap-2">
                <div className="relative">
                  <DollarSign className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
                  <Input
                    value={service.price || ''}
                    onChange={(e) => updateService(service.id, 'price', e.target.value)}
                    placeholder="السعر (دج)"
                    type="number"
                    className="pr-10 text-right font-mono"
                  />
                </div>
                <div className="relative">
                  <Clock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary z-10" />
                  <select
                    value={service.duration}
                    onChange={(e) => updateService(service.id, 'duration', e.target.value)}
                    className="w-full h-10 pr-10 pl-3 rounded-md border border-border-subtle bg-bg-elevated text-right font-arabic text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-border-focus appearance-none"
                  >
                    {DURATIONS.map((d) => (
                      <option key={d} value={d}>{d} دقيقة</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      <motion.button
        whileTap={{ scale: 0.96 }}
        onClick={addService}
        className="w-full h-12 border-2 border-dashed border-border-subtle rounded-2xl flex items-center justify-center gap-2 text-text-secondary font-arabic text-sm hover:border-primary-500 hover:text-primary-500 transition-colors"
      >
        <Plus className="w-5 h-5" />
        إضافة خدمة جديدة
      </motion.button>
    </motion.div>
  );
}

/* ─────────── step 4: schedule & location ─────────── */
function Step4Schedule({
  data, onChange, onToggleDay,
}: {
  data: OnboardingData;
  onChange: (field: string, value: string) => void;
  onToggleDay: (day: string) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3, ease: easeOutExpo }}
      className="px-4 space-y-5 pb-6"
    >
      <div className="text-center mb-2">
        <h2 className="text-xl font-bold text-text-primary font-arabic">الجدول والموقع</h2>
        <p className="text-sm text-text-secondary font-arabic mt-1">متى وأين تعمل؟</p>
      </div>

      <FormField label="أيام العمل">
        <div className="grid grid-cols-7 gap-1.5">
          {DAYS.map((day) => {
            const isActive = data.workDays.includes(day.key);
            return (
              <motion.button
                key={day.key}
                whileTap={{ scale: 0.9 }}
                onClick={() => onToggleDay(day.key)}
                className={`aspect-square rounded-xl text-[11px] font-bold font-arabic transition-colors flex items-center justify-center ${
                  isActive
                    ? 'bg-primary-500 text-white shadow-button'
                    : 'bg-bg-elevated text-text-secondary border border-border-subtle'
                }`}
              >
                {day.label.charAt(0)}
              </motion.button>
            );
          })}
        </div>
        <div className="flex justify-between mt-2 px-1">
          {DAYS.map((day) => (
            <span key={day.key} className="text-[9px] text-text-tertiary font-arabic text-center flex-1">
              {day.label}
            </span>
          ))}
        </div>
      </FormField>

      <div className="grid grid-cols-2 gap-3">
        <FormField label="من">
          <div className="relative">
            <Clock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary z-10" />
            <select
              value={data.workHoursFrom}
              onChange={(e) => onChange('workHoursFrom', e.target.value)}
              className="w-full h-10 pr-10 pl-3 rounded-md border border-border-subtle bg-bg-card text-right font-mono text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-border-focus appearance-none"
            >
              {Array.from({ length: 24 }, (_, i) => (
                <option key={i} value={`${i.toString().padStart(2, '0')}:00`}>
                  {i.toString().padStart(2, '0')}:00
                </option>
              ))}
            </select>
          </div>
        </FormField>
        <FormField label="إلى">
          <div className="relative">
            <Clock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary z-10" />
            <select
              value={data.workHoursTo}
              onChange={(e) => onChange('workHoursTo', e.target.value)}
              className="w-full h-10 pr-10 pl-3 rounded-md border border-border-subtle bg-bg-card text-right font-mono text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-border-focus appearance-none"
            >
              {Array.from({ length: 24 }, (_, i) => (
                <option key={i} value={`${i.toString().padStart(2, '0')}:00`}>
                  {i.toString().padStart(2, '0')}:00
                </option>
              ))}
            </select>
          </div>
        </FormField>
      </div>

      <FormField label="نوع العمل">
        <div className="grid grid-cols-2 gap-3">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => onChange('locationType', 'salon')}
            className={`h-14 rounded-xl border-2 flex items-center justify-center gap-2 font-arabic text-sm font-medium transition-colors ${
              data.locationType === 'salon'
                ? 'border-primary-500 bg-primary-50 text-primary-500'
                : 'border-border-subtle bg-bg-card text-text-secondary'
            }`}
          >
            <Home className="w-5 h-5" />
            في الصالون
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => onChange('locationType', 'mobile')}
            className={`h-14 rounded-xl border-2 flex items-center justify-center gap-2 font-arabic text-sm font-medium transition-colors ${
              data.locationType === 'mobile'
                ? 'border-primary-500 bg-primary-50 text-primary-500'
                : 'border-border-subtle bg-bg-card text-text-secondary'
            }`}
          >
            <Car className="w-5 h-5" />
            متنقل
          </motion.button>
        </div>
      </FormField>

      <FormField label="العنوان">
        <div className="relative">
          <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
          <Input
            value={data.address}
            onChange={(e) => onChange('address', e.target.value)}
            placeholder="أدخل عنوانك"
            className="pr-10 text-right font-arabic"
          />
        </div>
      </FormField>

      {/* Map Placeholder */}
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={() => { }}
        className="w-full h-[140px] rounded-2xl bg-bg-elevated border-2 border-dashed border-border-subtle flex flex-col items-center justify-center gap-2"
      >
        <Navigation className="w-8 h-8 text-text-tertiary" />
        <span className="text-sm text-text-secondary font-arabic">حدد موقعك على الخريطة</span>
        <span className="text-[10px] text-text-tertiary font-arabic">قريباً</span>
      </motion.button>
    </motion.div>
  );
}

/* ─────────── step 5: identity verification ─────────── */
function Step5Verification({
  data, onChange, onUpload, onSubmit, isSubmitting,
}: {
  data: OnboardingData;
  onChange: (field: string, value: boolean) => void;
  onUpload: (doc: 'idFront' | 'idBack' | 'certificate') => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3, ease: easeOutExpo }}
      className="px-4 space-y-5 pb-6"
    >
      <div className="text-center mb-2">
        <Shield className="w-14 h-14 text-primary-500 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-text-primary font-arabic">التحقق من الهوية</h2>
        <p className="text-sm text-text-secondary font-arabic mt-1">
          رفع مستنداتك للتحقق
        </p>
      </div>

      <div className="bg-primary-50 rounded-xl p-3 flex items-start gap-3">
        <Info className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-text-secondary font-arabic leading-relaxed">
          سنراجع معلوماتك خلال 24-48 ساعة. البيانات مشفرة وآمنة.
        </p>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium text-text-primary font-arabic">بطاقة التعريف الوطنية</p>
        <div className="grid grid-cols-2 gap-3">
          <PhotoUpload label="الوجه الأمامي" onUpload={() => onUpload('idFront')} uploaded={data.idFrontUploaded} />
          <PhotoUpload label="الوجه الخلفي" onUpload={() => onUpload('idBack')} uploaded={data.idBackUploaded} />
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium text-text-primary font-arabic">شهادة مهنية (اختياري)</p>
        <PhotoUpload label="رفع الشهادة" onUpload={() => onUpload('certificate')} uploaded={data.certificateUploaded} />
      </div>

      <label className="flex items-center gap-3 py-3 cursor-pointer">
        <Switch
          checked={data.confirmed}
          onCheckedChange={(v) => onChange('confirmed', v)}
          className="data-[state=checked]:bg-primary-500"
        />
        <span className="text-sm text-text-primary font-arabic">
          أؤكد أن جميع المعلومات صحيحة
        </span>
      </label>

      <motion.button
        whileTap={{ scale: 0.96 }}
        onClick={onSubmit}
        disabled={!data.confirmed || isSubmitting}
        className="w-full h-12 bg-primary-500 text-white rounded-xl font-medium font-arabic shadow-button disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            جاري الإرسال...
          </>
        ) : (
          <>
            <Upload className="w-5 h-5" />
            إرسال الطلب
          </>
        )}
      </motion.button>
    </motion.div>
  );
}

/* ─────────── step 6: success ─────────── */
function Step6Success({ onFinish }: { onFinish: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="px-4 flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
        className="w-24 h-24 rounded-full bg-success/10 flex items-center justify-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 15, delay: 0.5 }}
        >
          <ShieldCheck className="w-12 h-12 text-success" />
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, ease: easeOutExpo }}
      >
        <h2 className="text-2xl font-bold text-text-primary font-arabic">تم إرسال طلبك بنجاح!</h2>
        <p className="text-sm text-text-secondary font-arabic mt-3 max-w-[280px] mx-auto leading-relaxed">
          سنقوم بمراجعة معلوماتك خلال 24-48 ساعة
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="flex items-center gap-2 text-text-tertiary"
      >
        <Sparkles className="w-4 h-4" />
        <span className="text-xs font-arabic">THE SYMBOL OF TRUSTED PERSONAL CARE</span>
        <Sparkles className="w-4 h-4" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1, ease: easeOutExpo }}
        className="w-full pt-4"
      >
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={onFinish}
          className="w-full h-12 bg-primary-500 text-white rounded-xl font-medium font-arabic shadow-button"
        >
          العودة للرئيسية
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

/* ─────────── types ─────────── */
interface ServiceItem {
  id: number;
  name: string;
  price: number;
  duration: string;
}

interface OnboardingData {
  fullName: string;
  phone: string;
  email: string;
  wilaya: string;
  experience: number;
  specialties: string[];
  tags: string[];
  priceMin: string;
  priceMax: string;
  services: ServiceItem[];
  workDays: string[];
  workHoursFrom: string;
  workHoursTo: string;
  locationType: 'salon' | 'mobile';
  address: string;
  idFrontUploaded: boolean;
  idBackUploaded: boolean;
  certificateUploaded: boolean;
  confirmed: boolean;
}

const INITIAL_DATA: OnboardingData = {
  fullName: '',
  phone: '',
  email: '',
  wilaya: '',
  experience: 3,
  specialties: [],
  tags: [],
  priceMin: '',
  priceMax: '',
  services: [],
  workDays: ['sat', 'sun', 'mon', 'tue', 'wed', 'thu'],
  workHoursFrom: '09:00',
  workHoursTo: '18:00',
  locationType: 'salon',
  address: '',
  idFrontUploaded: false,
  idBackUploaded: false,
  certificateUploaded: false,
  confirmed: false,
};

/* ─────────── main component ─────────── */
export default function BarberOnboarding() {
  const navigate = useNavigate();
  const { showToast, ToastComponent } = useToast();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({ ...INITIAL_DATA });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalSteps = 6;

  const updateField = useCallback((field: string, value: string | number) => {
    setData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  }, [errors]);

  const toggleArray = useCallback((field: 'specialties' | 'tags', value: string) => {
    setData((prev) => {
      const arr = prev[field];
      const updated = arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
      return { ...prev, [field]: updated };
    });
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  }, [errors]);

  const toggleDay = useCallback((day: string) => {
    setData((prev) => {
      const updated = prev.workDays.includes(day)
        ? prev.workDays.filter((d) => d !== day)
        : [...prev.workDays, day];
      return { ...prev, workDays: updated };
    });
  }, []);

  const updateServices = useCallback((services: ServiceItem[]) => {
    setData((prev) => ({ ...prev, services }));
  }, []);

  const handleUpload = useCallback((doc: 'idFront' | 'idBack' | 'certificate') => {
    setData((prev) => ({ ...prev, [`${doc}Uploaded`]: true }));
    showToast('تم رفع المستند بنجاح', 'success');
  }, [showToast]);

  const validateStep = (s: number): boolean => {
    const newErrors: Record<string, string> = {};
    if (s === 1) {
      if (!data.fullName.trim()) newErrors.fullName = 'الاسم مطلوب';
      if (!data.phone.trim()) newErrors.phone = 'رقم الهاتف مطلوب';
      else if (!/^0[57]\d{8}$/.test(data.phone.trim())) newErrors.phone = 'رقم هاتف غير صالح';
      if (!data.wilaya) newErrors.wilaya = 'اختر الولاية';
    }
    if (s === 2) {
      if (data.specialties.length === 0) newErrors.specialties = 'اختر تخصصاً واحداً على الأقل';
      if (data.tags.length === 0) newErrors.tags = 'اختر وسمًا واحداً على الأقل';
      if (!data.priceMin) newErrors.priceMin = 'مطلوب';
      if (!data.priceMax) newErrors.priceMax = 'مطلوب';
    }
    if (s === 4) {
      if (data.workDays.length === 0) newErrors.workDays = 'اختر يوماً واحداً على الأقل';
      if (!data.address.trim()) newErrors.address = 'العنوان مطلوب';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step < 5 && !validateStep(step)) {
      showToast('يرجى تصحيح الأخطاء', 'error');
      return;
    }
    if (step < totalSteps) {
      setStep((s) => s + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep((s) => s - 1);
  };

  const handleSubmit = () => {
    if (!data.idFrontUploaded || !data.idBackUploaded) {
      showToast('يرجى رفع بطاقة التعريف', 'error');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setStep(6);
      showToast('تم إرسال طلبك بنجاح!', 'success');
    }, 2000);
  };

  const handleFinish = () => {
    navigate('/');
  };

  const handleCancel = () => {
    navigate('/profile');
  };

  return (
    <div className="min-h-[100dvh] bg-bg-base" dir="rtl">
      <ToastComponent />

      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border-subtle bg-bg-card">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleCancel}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-bg-elevated transition-colors"
        >
          <X className="w-5 h-5 text-text-primary" />
        </motion.button>
        <h1 className="flex-1 text-base font-semibold text-text-primary font-arabic text-center pl-10">
          {step === 6 ? '' : 'التسجيل كحلاق'}
        </h1>
      </div>

      {/* Progress */}
      {step < 6 && <StepHeader currentStep={step} totalSteps={totalSteps} />}

      {/* Content */}
      <AnimatePresence mode="wait">
        {step === 1 && (
          <Step1Personal key="step1" data={data} errors={errors} onChange={updateField} />
        )}
        {step === 2 && (
          <Step2Professional key="step2" data={data} errors={errors} onChange={updateField} onArrayToggle={toggleArray} />
        )}
        {step === 3 && (
          <Step3Services key="step3" data={data} onUpdateServices={updateServices} />
        )}
        {step === 4 && (
          <Step4Schedule key="step4" data={data} onChange={updateField} onToggleDay={toggleDay} />
        )}
        {step === 5 && (
          <Step5Verification
            key="step5"
            data={data}
            onChange={(f, v) => setData((p) => ({ ...p, [f]: v }))}
            onUpload={handleUpload}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        )}
        {step === 6 && <Step6Success key="step6" onFinish={handleFinish} />}
      </AnimatePresence>

      {/* Navigation Footer */}
      {step < 6 && (
        <div className="fixed bottom-0 left-0 right-0 bg-bg-card border-t border-border-subtle px-4 py-3 z-50">
          <StepDots currentStep={step} totalSteps={totalSteps} />
          <div className="flex gap-3">
            {step > 1 ? (
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={handleBack}
                className="h-12 px-6 bg-bg-elevated text-text-primary rounded-xl font-medium font-arabic flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4 rtl-flip" />
                السابق
              </motion.button>
            ) : (
              <div className="w-20" />
            )}
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={handleNext}
              className="flex-1 h-12 bg-primary-500 text-white rounded-xl font-medium font-arabic shadow-button flex items-center justify-center gap-2"
            >
              {step === 5 ? 'إرسال' : 'التالي'}
              <ChevronRight className="w-4 h-4 rtl-flip" />
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );
}
