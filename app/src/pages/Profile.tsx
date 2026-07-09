import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Shield, ShieldCheck, Wallet, ChevronLeft, Settings,
  Bell, HelpCircle, FileText, Info, LogOut, Scissors, Phone,
  Mail, Star, CalendarDays, Award, Check, Camera, Globe,
  QrCode, ToggleLeft, ToggleRight,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import Layout from '@/components/Layout';

const easeOutExpo = [0.16, 1, 0.3, 1] as [number, number, number, number];
const easeSpring = [0.32, 0.72, 0, 1] as [number, number, number, number];

/* ─────────── animation variants ─────────── */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.4, ease: easeOutExpo },
  },
};

/* ─────────── toast hook ─────────── */
function useToast() {
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const ToastComponent = () => (
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
  );

  return { showToast, ToastComponent };
}

/* ─────────── menu item component ─────────── */
interface MenuItemProps {
  icon: React.ElementType;
  title: string;
  subtitle?: string;
  badge?: string;
  badgeColor?: string;
  onClick?: () => void;
  danger?: boolean;
  last?: boolean;
}

function MenuItem({
  icon: Icon, title, subtitle, badge, badgeColor = 'bg-primary-500',
  onClick, danger, last,
}: MenuItemProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.98, backgroundColor: 'var(--primary-50)' }}
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-5 py-4 text-right transition-colors ${
        !last ? 'border-b border-border-subtle' : ''
      }`}
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${danger ? 'bg-error/10' : 'bg-primary-50'}`}>
        <Icon className={`w-5 h-5 ${danger ? 'text-error' : 'text-primary-500'}`} />
      </div>
      <div className="flex-1 text-right">
        <p className={`font-medium text-sm font-arabic ${danger ? 'text-error' : 'text-text-primary'}`}>
          {title}
        </p>
        {subtitle && <p className="text-xs text-text-secondary mt-0.5 font-arabic">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-2">
        {badge && (
          <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full text-white ${badgeColor}`}>
            {badge}
          </span>
        )}
        {!danger && <ChevronLeft className="w-4 h-4 text-text-tertiary rtl-flip" />}
      </div>
    </motion.button>
  );
}

/* ─────────── ID Verification Screen ─────────── */
function IdVerificationScreen({ onBack }: { onBack: () => void }) {
  const [step, setStep] = useState<'instructions' | 'upload-front' | 'upload-back' | 'reviewing' | 'done'>('instructions');

  const handleStart = () => setStep('upload-front');
  const handleUploadFront = () => setStep('upload-back');
  const handleUploadBack = () => setStep('reviewing');

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3, ease: easeOutExpo }}
      className="min-h-full bg-bg-base"
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border-subtle bg-bg-card">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onBack}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-bg-elevated transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-text-primary rtl-flip" />
        </motion.button>
        <h1 className="flex-1 text-base font-semibold text-text-primary font-arabic text-center pr-10">
          توثيق الهوية
        </h1>
      </div>

      <div className="px-4 pt-6 pb-8 space-y-6">
        {/* Step Indicator */}
        <div className="flex items-center gap-2 justify-center">
          {(['instructions', 'upload-front', 'upload-back', 'reviewing'] as const).map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full transition-colors ${
                  step === s || (['upload-back', 'reviewing', 'done'].includes(step) && i < 2) || (['reviewing', 'done'].includes(step) && i < 3)
                    ? 'bg-primary-500'
                    : 'bg-bg-elevated'
                }`}
              />
              {i < 2 && <div className="w-6 h-px bg-border-subtle" />}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* Instructions */}
          {step === 'instructions' && (
            <motion.div
              key="instr"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="text-center">
                <Shield className="w-16 h-16 text-primary-500 mx-auto mb-4" />
                <h2 className="text-xl font-bold font-arabic text-text-primary mb-2">قم بتوثيق هويتك</h2>
                <p className="text-sm text-text-secondary font-arabic max-w-[280px] mx-auto leading-relaxed">
                  صور بطاقتك التعريفية الوطنية من الجهتين للتحقق من هويتك
                </p>
              </div>

              <div className="bg-bg-card rounded-2xl p-4 shadow-card space-y-3">
                {[
                  { icon: Camera, text: 'تأكد من الإضاءة الجيدة' },
                  { icon: ShieldCheck, text: 'تأكد أن البطاقة واضحة' },
                  { icon: Info, text: 'المعلومات مشفرة وآمنة 100%' },
                ].map((item, i) => (
                  <motion.div
                    key={item.text}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center">
                      <item.icon className="w-4 h-4 text-primary-500" />
                    </div>
                    <span className="text-sm text-text-primary font-arabic">{item.text}</span>
                  </motion.div>
                ))}
              </div>

              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={handleStart}
                className="w-full h-12 bg-primary-500 text-white rounded-xl font-medium font-arabic shadow-button"
              >
                ابدأ
              </motion.button>
            </motion.div>
          )}

          {/* Upload Front */}
          {step === 'upload-front' && (
            <motion.div
              key="front"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center">
                <h2 className="text-lg font-bold font-arabic text-text-primary">الوجه الأمامي</h2>
                <p className="text-sm text-text-secondary font-arabic mt-1">صور الوجه الأمامي لبطاقتك</p>
              </div>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleUploadFront}
                className="relative mx-auto w-full max-w-[280px] h-[180px] rounded-2xl border-2 border-dashed border-border-subtle bg-bg-card flex flex-col items-center justify-center gap-2 hover:border-primary-500 transition-colors"
              >
                <Camera className="w-12 h-12 text-text-tertiary" />
                <span className="text-sm text-text-secondary font-arabic">اضغط للتصوير</span>
                <span className="text-xs text-text-tertiary font-arabic">أو اختر من المعرض</span>
              </motion.button>
            </motion.div>
          )}

          {/* Upload Back */}
          {step === 'upload-back' && (
            <motion.div
              key="back"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-3">
                  <Check className="w-6 h-6 text-success" />
                </motion.div>
                <h2 className="text-lg font-bold font-arabic text-text-primary">الوجه الخلفي</h2>
                <p className="text-sm text-text-secondary font-arabic mt-1">الآن صور الوجه الخلفي</p>
              </div>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleUploadBack}
                className="relative mx-auto w-full max-w-[280px] h-[180px] rounded-2xl border-2 border-dashed border-border-subtle bg-bg-card flex flex-col items-center justify-center gap-2 hover:border-primary-500 transition-colors"
              >
                <Camera className="w-12 h-12 text-text-tertiary" />
                <span className="text-sm text-text-secondary font-arabic">اضغط للتصوير</span>
              </motion.button>
            </motion.div>
          )}

          {/* Reviewing */}
          {step === 'reviewing' && (
            <motion.div
              key="review"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="flex flex-col items-center"
              >
                <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mb-4">
                  <ShieldCheck className="w-10 h-10 text-success" />
                </div>
                <h2 className="text-xl font-bold text-success font-arabic">تم الرفع بنجاح</h2>
                <p className="text-sm text-text-secondary font-arabic mt-2">جاري المراجعة...</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-bg-card rounded-2xl p-4 shadow-card"
              >
                <div className="relative w-full h-[120px] rounded-xl bg-gradient-to-br from-bg-elevated to-border-subtle flex items-center justify-center overflow-hidden">
                  <div className="w-[160px] h-[90px] rounded-lg bg-bg-card shadow-card flex flex-col items-center justify-center gap-1">
                    <Shield className="w-8 h-8 text-primary-500/40" />
                    <span className="text-[10px] text-text-tertiary font-arabic">بطاقة التعريف الوطنية</span>
                  </div>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="absolute inset-0 bg-success/20 flex items-center justify-center"
                  >
                    <div className="w-12 h-12 rounded-full bg-success flex items-center justify-center">
                      <Check className="w-7 h-7 text-white" />
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              <p className="text-sm text-text-secondary font-arabic">
                سيتم إشعارك عند اكتمال عملية التحقق
              </p>

              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={onBack}
                className="w-full h-12 bg-primary-500 text-white rounded-xl font-medium font-arabic shadow-button"
              >
                العودة
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

/* ─────────── Guest State ─────────── */
function GuestState() {
  const { showToast, ToastComponent } = useToast();
  const navigate = useNavigate();

  const handleMockLogin = (method: string) => {
    showToast(`تسجيل الدخول بـ ${method} قريباً`, 'info');
  };

  return (
    <div className="px-4 pt-4 pb-6 space-y-6">
      <ToastComponent />

      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: easeOutExpo }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-500 to-[#E87A5D] p-6 text-center min-h-[200px] flex flex-col items-center justify-center"
      >
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url(/motif-geometric.svg)', backgroundSize: '120px' }} />
        <motion.img
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4, ease: easeSpring }}
          src="/logo-kacimy.svg"
          alt="Kacimy"
          className="h-12 w-auto mb-4 brightness-0 invert"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
        <h2 className="text-2xl font-extrabold text-white font-arabic relative z-10">
          مرحباً بك في كصيمي
        </h2>
        <p className="text-sm text-white/80 font-arabic mt-2 relative z-10">
          احجز مع أفضل الحلاقين في الجزائر
        </p>
      </motion.div>

      {/* Auth Options */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-3"
      >
        <motion.p variants={itemVariants} className="text-sm font-bold text-text-tertiary font-arabic mb-3">
          تسجيل الدخول
        </motion.p>

        <motion.button
          variants={itemVariants}
          whileTap={{ scale: 0.96 }}
          onClick={() => handleMockLogin('رقم الهاتف')}
          className="w-full h-12 bg-primary-500 text-white rounded-xl font-medium font-arabic flex items-center justify-center gap-3 shadow-button"
        >
          <Phone className="w-5 h-5" />
          تسجيل الدخول برقم الهاتف
        </motion.button>

        <motion.button
          variants={itemVariants}
          whileTap={{ scale: 0.96 }}
          onClick={() => handleMockLogin('البريد الإلكتروني')}
          className="w-full h-12 bg-bg-elevated text-text-primary rounded-xl font-medium font-arabic flex items-center justify-center gap-3"
        >
          <Mail className="w-5 h-5 text-text-secondary" />
          تسجيل الدخول بالبريد الإلكتروني
        </motion.button>

        <motion.button
          variants={itemVariants}
          whileTap={{ scale: 0.96 }}
          onClick={() => handleMockLogin('Google')}
          className="w-full h-12 bg-white text-text-primary rounded-xl font-medium font-arabic flex items-center justify-center gap-3 border border-border-subtle"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          تسجيل الدخول بـ Google
        </motion.button>

        <motion.p variants={itemVariants} className="text-center text-sm text-text-secondary font-arabic pt-2">
          ليس لديك حساب؟{' '}
          <button onClick={() => handleMockLogin('التسجيل')} className="text-primary-500 font-semibold">
            سجل الآن
          </button>
        </motion.p>
      </motion.div>

      {/* Why Join Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="pt-4"
      >
        <p className="text-sm font-bold text-text-tertiary font-arabic mb-3">لماذا تنضم إلينا؟</p>
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: CalendarDays, label: 'احجز بسهولة' },
            { icon: Star, label: 'تقييمات موثوقة' },
            { icon: Award, label: 'مكافآت حصرية' },
          ].map((item) => (
            <motion.div
              key={item.label}
              variants={itemVariants}
              whileTap={{ scale: 0.95 }}
              className="bg-bg-card rounded-xl p-4 flex flex-col items-center gap-2 shadow-card"
            >
              <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center">
                <item.icon className="w-5 h-5 text-primary-500" />
              </div>
              <span className="text-[11px] font-medium text-text-secondary font-arabic text-center">
                {item.label}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Barber Promo for Guests */}
      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        className="pt-2"
      >
        <div className="bg-primary-50 rounded-2xl p-5 relative overflow-hidden">
          <div className="absolute top-2 left-2 opacity-10">
            <Scissors className="w-24 h-24 text-primary-500" />
          </div>
          <h3 className="text-lg font-bold text-text-primary font-arabic relative z-10">
            هل أنت حلاق؟
          </h3>
          <p className="text-sm text-text-secondary font-arabic mt-1 relative z-10">
            انضم لشبكة كصيمي ووصل لعملاء أكثر
          </p>
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => navigate('/barber-onboarding')}
            className="mt-4 px-6 py-2.5 bg-primary-500 text-white rounded-lg text-sm font-medium font-arabic shadow-button relative z-10 flex items-center gap-2"
          >
            <Scissors className="w-4 h-4" />
            سجل كحلاق
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

/* ─────────── Logged-In State ─────────── */
function LoggedInState({ onVerify }: { onVerify: () => void }) {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isBarberMode, setIsBarberMode] = useState(false);
  const { showToast, ToastComponent } = useToast();

  const stats = [
    { label: 'المواعيد', value: '12', color: 'text-primary-500' },
    { label: 'التقييمات', value: '5', color: 'text-text-primary' },
    { label: 'النقاط', value: '2,450', color: 'text-warning' },
  ];

  const handleLogout = () => {
    logout();
    setShowLogoutConfirm(false);
    showToast('تم تسجيل الخروج', 'info');
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="px-4 pt-4 pb-6 space-y-6"
    >
      <ToastComponent />

      {/* User Card */}
      <motion.div
        variants={itemVariants}
        className="bg-bg-card rounded-2xl shadow-card p-5 flex items-center gap-4"
      >
        <motion.div
          whileTap={{ scale: 0.95 }}
          className="relative w-16 h-16 rounded-full bg-primary-50 flex items-center justify-center overflow-hidden flex-shrink-0"
        >
          {user?.avatar ? (
            <img src={user.avatar} alt="" className="w-full h-full object-cover" />
          ) : (
            <User className="w-8 h-8 text-primary-500" />
          )}
          {user?.isVerified && (
            <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-success flex items-center justify-center border-2 border-bg-card">
              <Check className="w-3 h-3 text-white" />
            </div>
          )}
        </motion.div>
        <div className="flex-1 text-right">
          <h2 className="text-lg font-bold text-text-primary font-arabic">
            {user?.name || 'المستخدم'}
          </h2>
          <p className="text-sm text-text-secondary font-arabic">{user?.phone || ''}</p>
          {user?.email && (
            <p className="text-xs text-text-tertiary font-arabic">{user.email}</p>
          )}
        </div>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate('/settings')}
          className="w-10 h-10 rounded-full bg-bg-elevated flex items-center justify-center"
        >
          <Settings className="w-5 h-5 text-text-secondary" />
        </motion.button>
      </motion.div>

      {/* Stats Row */}
      <motion.div variants={itemVariants} className="grid grid-cols-3 gap-3">
        {stats.map((stat) => (
          <motion.div
            key={stat.label}
            whileTap={{ scale: 0.98 }}
            className="bg-bg-card rounded-xl shadow-card p-4 text-center"
          >
            <p className={`text-xl font-bold font-mono ${stat.color}`}>{stat.value}</p>
            <p className="text-[11px] text-text-secondary font-arabic mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Barber Mode Toggle */}
      <motion.div variants={itemVariants}>
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsBarberMode((p) => !p)}
          className="w-full bg-bg-card rounded-2xl shadow-card p-4 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
              <Scissors className="w-5 h-5 text-primary-500" />
            </div>
            <div className="text-right">
              <p className="font-medium text-sm font-arabic text-text-primary">وضع الحلاق</p>
              <p className="text-xs text-text-secondary font-arabic">
                {isBarberMode ? 'مفعل' : 'معطل'}
              </p>
            </div>
          </div>
          {isBarberMode ? (
            <ToggleRight className="w-8 h-8 text-primary-500" />
          ) : (
            <ToggleLeft className="w-8 h-8 text-text-tertiary" />
          )}
        </motion.button>
      </motion.div>

      {/* Account Section */}
      <motion.div variants={itemVariants}>
        <h3 className="text-sm font-bold text-text-tertiary font-arabic px-1 mb-2">الحساب</h3>
        <div className="bg-bg-card rounded-2xl shadow-card overflow-hidden">
          <MenuItem
            icon={QrCode}
            title="رمز QR"
            subtitle="امسح للمشاركة"
            onClick={() => showToast('رمز QR قريباً', 'info')}
          />
          <MenuItem
            icon={Shield}
            title="توثيق الهوية"
            subtitle="التحقق من الهوية"
            badge={user?.isVerified ? 'موثق' : 'مطلوب'}
            badgeColor={user?.isVerified ? 'bg-success' : 'bg-warning'}
            onClick={onVerify}
          />
          <MenuItem
            icon={Wallet}
            title="المحفظة"
            subtitle="رصيد ومعاملات"
            badge="2,450 دج"
            badgeColor="bg-warning"
            onClick={() => navigate('/wallet')}
            last
          />
        </div>
      </motion.div>

      {/* Barber Promo */}
      <motion.div variants={itemVariants}>
        <div className="bg-primary-50 rounded-2xl p-5 relative overflow-hidden">
          <div className="absolute top-2 left-2 opacity-10">
            <Scissors className="w-24 h-24 text-primary-500" />
          </div>
          <h3 className="text-lg font-bold text-text-primary font-arabic relative z-10">
            هل أنت حلاق؟ انضم إلينا
          </h3>
          <p className="text-sm text-text-secondary font-arabic mt-1 relative z-10">
            انضم لشبكة كصيمي ووصل لعملاء أكثر
          </p>
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => navigate('/barber-onboarding')}
            className="mt-4 px-6 py-2.5 bg-primary-500 text-white rounded-lg text-sm font-medium font-arabic shadow-button relative z-10 flex items-center gap-2"
          >
            <Scissors className="w-4 h-4" />
            الإشتراك الآن
          </motion.button>
          <div className="mt-4 space-y-2 relative z-10">
            {[
              'وصول لآلاف العملاء',
              'نظام حجوزات ذكي',
              'مدفوعات إلكترونية',
            ].map((benefit) => (
              <div key={benefit} className="flex items-center gap-2">
                <Check className="w-4 h-4 text-success" />
                <span className="text-xs text-text-secondary font-arabic">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Settings Section */}
      <motion.div variants={itemVariants}>
        <h3 className="text-sm font-bold text-text-tertiary font-arabic px-1 mb-2">الإعدادات</h3>
        <div className="bg-bg-card rounded-2xl shadow-card overflow-hidden">
          <MenuItem
            icon={Settings}
            title="المظهر"
            subtitle="الثيم والألوان"
            onClick={() => navigate('/settings')}
          />
          <MenuItem
            icon={Shield}
            title="الأمان"
            subtitle="البصمة والمصادقة"
            onClick={() => navigate('/settings')}
          />
          <MenuItem
            icon={Bell}
            title="الإشعارات"
            subtitle="تذكيرات وعروض"
            onClick={() => navigate('/settings')}
          />
          <MenuItem
            icon={Globe}
            title="اللغة"
            subtitle="العربية / Français"
            onClick={() => navigate('/settings')}
            last
          />
        </div>
      </motion.div>

      {/* App Section */}
      <motion.div variants={itemVariants}>
        <h3 className="text-sm font-bold text-text-tertiary font-arabic px-1 mb-2">التطبيق</h3>
        <div className="bg-bg-card rounded-2xl shadow-card overflow-hidden">
          <MenuItem
            icon={HelpCircle}
            title="المساعدة والدعم"
            subtitle="أسئلة شائعة"
            onClick={() => showToast('قريباً', 'info')}
          />
          <MenuItem
            icon={FileText}
            title="سياسة الخصوصية"
            onClick={() => showToast('قريباً', 'info')}
          />
          <MenuItem
            icon={FileText}
            title="شروط الاستخدام"
            onClick={() => showToast('قريباً', 'info')}
          />
          <MenuItem
            icon={Info}
            title="من نحن"
            onClick={() => showToast('قريباً', 'info')}
            last
          />
        </div>
      </motion.div>

      {/* Logout */}
      <motion.div variants={itemVariants} className="pt-2">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowLogoutConfirm(true)}
          className="w-full flex items-center justify-center gap-3 py-4 bg-bg-card rounded-2xl shadow-card text-error font-medium font-arabic"
        >
          <LogOut className="w-5 h-5" />
          تسجيل الخروج
        </motion.button>
      </motion.div>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center px-6"
            style={{ backgroundColor: 'var(--overlay-dark)' }}
            onClick={() => setShowLogoutConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-bg-card rounded-2xl p-6 w-full max-w-[320px] text-center shadow-float"
            >
              <div className="w-14 h-14 rounded-full bg-error/10 flex items-center justify-center mx-auto mb-4">
                <LogOut className="w-7 h-7 text-error" />
              </div>
              <h3 className="text-lg font-bold text-text-primary font-arabic">تسجيل الخروج</h3>
              <p className="text-sm text-text-secondary font-arabic mt-2">
                هل أنت متأكد أنك تريد تسجيل الخروج؟
              </p>
              <div className="flex gap-3 mt-6">
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 h-11 bg-bg-elevated text-text-primary rounded-xl font-medium font-arabic"
                >
                  إلغاء
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={handleLogout}
                  className="flex-1 h-11 bg-error text-white rounded-xl font-medium font-arabic"
                >
                  خروج
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─────────── Main Profile Page ─────────── */
export default function Profile() {
  const [showVerification, setShowVerification] = useState(false);
  const { isAuthenticated } = useAuthStore();

  if (showVerification) {
    return (
      <div className="min-h-[100dvh] bg-bg-base">
        <IdVerificationScreen onBack={() => setShowVerification(false)} />
      </div>
    );
  }

  return (
    <Layout navbarProps={{ title: 'حسابي' }}>
      {isAuthenticated ? (
        <LoggedInState onVerify={() => setShowVerification(true)} />
      ) : (
        <GuestState />
      )}
    </Layout>
  );
}
