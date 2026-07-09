import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Moon, Globe, Fingerprint, Eye, Lock, Shield, ChevronLeft,
  Sun, Sparkles, Zap, Minimize2, Check, Bell, Trash2, LogOut,
  Smartphone, Volume2, MapPin, FileText, Info, Award, CalendarDays,
  QrCode, KeyRound,
} from 'lucide-react';
import { useThemeStore, type ThemeName, type AnimationPreset } from '@/store/themeStore';
import { useAuthStore } from '@/store/authStore';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import Layout from '@/components/Layout';

const easeOutExpo = [0.16, 1, 0.3, 1] as [number, number, number, number];

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

/* ─────────── theme configs ─────────── */
const themes: { key: ThemeName; label: string; color: string; gradient?: string; desc: string }[] = [
  { key: 'hallaqi', label: 'حلاقي', color: '#0F766E', gradient: 'linear-gradient(135deg, #0F766E, #14B8A6)', desc: 'هوية Hallaqi الأصلية' },
  { key: 'classic', label: 'كلاسيك', color: '#D4463A', desc: 'دفء ترابي جزائري' },
  { key: 'modern', label: 'عصري', color: '#2A2A2E', desc: 'أحادي أنيق' },
  { key: 'digital', label: 'رقمي', color: '#00D4AA', desc: 'مستقبلي مظلم' },
  { key: 'red', label: 'أحمر', color: '#FF2D55', desc: 'طاقة شبابية' },
  { key: 'blue', label: 'أزرق', color: '#007AFF', desc: 'احترافي هادئ' },
  { key: 'gradient', label: 'تدرج', color: '#FF6B35', gradient: 'linear-gradient(135deg, #FF6B35, #F7931E)', desc: 'شمسي عصري' },
];

const animations: { key: AnimationPreset; label: string; desc: string; icon: typeof Sparkles }[] = [
  { key: 'simple', label: 'بسيط', desc: 'حركات خفيفة', icon: Minimize2 },
  { key: 'modern', label: 'عصري', desc: 'حركات سلسة', icon: Sparkles },
  { key: 'digital', label: 'رقمي', desc: 'تأثيرات تقنية', icon: Zap },
];

/* ─────────── animation variants ─────────── */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.4, ease: easeOutExpo },
  },
};

/* ─────────── Theme Preview Circle ─────────── */
function ThemePreviewCircle({ themeKey, isSelected }: { themeKey: ThemeName; isSelected: boolean }) {
  const theme = themes.find((t) => t.key === themeKey);
  if (!theme) return null;

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      className={`relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 ${
        isSelected ? 'ring-[3px] ring-text-primary' : 'ring-0'
      }`}
      style={{
        background: theme.gradient || theme.color,
        boxShadow: themeKey === 'digital' && isSelected ? `0 0 12px ${theme.color}66` : 'none',
      }}
    >
      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 25 }}
        >
          <Check className="w-5 h-5 text-white" strokeWidth={3} />
        </motion.div>
      )}
    </motion.div>
  );
}

/* ─────────── Animation Preview Component ─────────── */
function AnimationPreview({ preset }: { preset: AnimationPreset }) {
  if (preset === 'simple') {
    return (
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full bg-primary-500"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: i * 0.2 }}
          />
        ))}
      </div>
    );
  }
  if (preset === 'modern') {
    return (
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full bg-primary-500"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut', delay: i * 0.15 }}
          />
        ))}
      </div>
    );
  }
  return (
    <div className="flex gap-1.5">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-2 h-2 rounded-full bg-primary-500"
          animate={{ scale: [1, 1.5, 1], opacity: [1, 0.3, 1] }}
          transition={{ duration: 0.5, repeat: Infinity, ease: 'linear', delay: i * 0.1 }}
        />
      ))}
    </div>
  );
}

/* ─────────── Section Title ─────────── */
function SectionTitle({ children }: { children: string }) {
  return (
    <h3 className="text-sm font-semibold text-text-tertiary font-arabic px-1 mb-3 uppercase tracking-wider">
      {children}
    </h3>
  );
}

/* ─────────── Toggle Row ─────────── */
interface ToggleRowProps {
  icon: typeof Moon;
  title: string;
  subtitle?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  last?: boolean;
  iconColor?: string;
}

function ToggleRow({
  icon: Icon, title, subtitle, checked, onChange, last, iconColor = 'text-text-secondary',
}: ToggleRowProps) {
  return (
    <div className={`flex items-center justify-between px-5 py-4 ${!last ? 'border-b border-border-subtle' : ''}`}>
      <div className="flex items-center gap-3">
        <Icon className={`w-5 h-5 ${iconColor}`} />
        <div>
          <p className="font-medium text-sm font-arabic text-text-primary">{title}</p>
          {subtitle && <p className="text-xs text-text-secondary font-arabic mt-0.5">{subtitle}</p>}
        </div>
      </div>
      <Switch
        checked={checked}
        onCheckedChange={onChange}
        className="data-[state=checked]:bg-primary-500"
      />
    </div>
  );
}

/* ─────────── Arrow Row ─────────── */
function ArrowRow({
  icon: Icon, title, subtitle, onClick, last, iconColor = 'text-text-secondary',
  textColor = 'text-text-primary',
}: {
  icon: typeof Moon; title: string; subtitle?: string; onClick?: () => void; last?: boolean;
  iconColor?: string; textColor?: string;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.98, backgroundColor: 'var(--primary-50)' }}
      onClick={onClick}
      className={`w-full flex items-center justify-between px-5 py-4 text-right transition-colors ${!last ? 'border-b border-border-subtle' : ''}`}
    >
      <div className="flex items-center gap-3">
        <Icon className={`w-5 h-5 ${iconColor}`} />
        <div className="text-right">
          <p className={`font-medium text-sm font-arabic ${textColor}`}>{title}</p>
          {subtitle && <p className="text-xs text-text-secondary font-arabic mt-0.5">{subtitle}</p>}
        </div>
      </div>
      <ChevronLeft className="w-4 h-4 text-text-tertiary rtl-flip" />
    </motion.button>
  );
}

/* ─────────── 2FA Setup Sheet ─────────── */
function TwoFASheet({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<'intro' | 'scan' | 'verify'>('intro');
  const [code, setCode] = useState('');
  const [isEnabled, setIsEnabled] = useState(false);

  const handleVerify = () => {
    if (code.length === 6) {
      setIsEnabled(true);
      setTimeout(() => onClose(), 1500);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-end"
      style={{ backgroundColor: 'var(--overlay-dark)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full bg-bg-card rounded-t-3xl p-6 pb-10 max-h-[85vh] overflow-y-auto"
      >
        <div className="w-10 h-1 rounded-full bg-border-subtle mx-auto mb-6" />

        <AnimatePresence mode="wait">
          {step === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 rounded-full bg-primary-50 flex items-center justify-center mb-4">
                <Shield className="w-8 h-8 text-primary-500" />
              </div>
              <h3 className="text-lg font-bold text-text-primary font-arabic">المصادقة الثنائية</h3>
              <p className="text-sm text-text-secondary font-arabic mt-2 max-w-[260px] leading-relaxed">
                أضف طبقة أمان إضافية لحسابك باستخدام تطبيق مصادقة
              </p>
              <div className="w-full bg-bg-elevated rounded-xl p-4 mt-4 text-right">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-text-primary font-arabic">حماية ضد الوصول غير المصرح به</p>
                </div>
                <div className="flex items-start gap-3 mt-3">
                  <Check className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-text-primary font-arabic">مطلوب رمز تحقق عند تسجيل الدخول</p>
                </div>
              </div>
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={() => setStep('scan')}
                className="mt-6 w-full h-12 bg-primary-500 text-white rounded-xl font-medium font-arabic shadow-button"
              >
                متابعة
              </motion.button>
            </motion.div>
          )}

          {step === 'scan' && (
            <motion.div
              key="scan"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center text-center"
            >
              <h3 className="text-lg font-bold text-text-primary font-arabic">امسح رمز QR</h3>
              <p className="text-sm text-text-secondary font-arabic mt-2">
                افتح تطبيق Google Authenticator وامسح الرمز
              </p>
              {/* Mock QR Code */}
              <div className="w-[180px] h-[180px] rounded-2xl bg-bg-elevated flex items-center justify-center mt-4 border-2 border-dashed border-border-subtle">
                <QrCode className="w-20 h-20 text-text-tertiary" />
              </div>
              <p className="text-xs text-text-tertiary font-arabic mt-3">
                لا يمكنك المسح؟ استخدم المفتاح: <span className="font-mono text-text-primary">KACIMY-X7K9-M2P4</span>
              </p>
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={() => setStep('verify')}
                className="mt-6 w-full h-12 bg-primary-500 text-white rounded-xl font-medium font-arabic shadow-button"
              >
                التالي
              </motion.button>
            </motion.div>
          )}

          {step === 'verify' && (
            <motion.div
              key="verify"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center"
            >
              {!isEnabled ? (
                <>
                  <h3 className="text-lg font-bold text-text-primary font-arabic">أدخل رمز التحقق</h3>
                  <p className="text-sm text-text-secondary font-arabic mt-2">
                    أدخل الرمز المكون من 6 أرقام من التطبيق
                  </p>
                  <div className="flex gap-2 mt-4" dir="ltr">
                    {[0, 1, 2, 3, 4, 5].map((i) => (
                      <Input
                        key={i}
                        maxLength={1}
                        className="w-11 h-12 text-center text-lg font-mono"
                        value={code[i] || ''}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '');
                          const newCode = code.split('');
                          newCode[i] = val;
                          setCode(newCode.join(''));
                          if (val && i < 5) {
                            const next = e.target.parentElement?.querySelectorAll('input')[i + 1] as HTMLInputElement;
                            next?.focus();
                          }
                        }}
                      />
                    ))}
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    onClick={handleVerify}
                    disabled={code.length !== 6}
                    className="mt-6 w-full h-12 bg-primary-500 text-white rounded-xl font-medium font-arabic shadow-button disabled:opacity-50"
                  >
                    تأكيد
                  </motion.button>
                </>
              ) : (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex flex-col items-center py-6"
                >
                  <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mb-4">
                    <Check className="w-8 h-8 text-success" />
                  </div>
                  <h3 className="text-lg font-bold text-success font-arabic">تم التفعيل بنجاح</h3>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={onClose}
          className="mt-4 w-full h-11 text-text-secondary rounded-xl font-medium font-arabic"
        >
          إلغاء
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

/* ─────────── Change Password Sheet ─────────── */
function ChangePasswordSheet({ onClose }: { onClose: () => void }) {
  const [current, setCurrent] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    setError('');
    if (!current || !newPass || !confirm) {
      setError('جميع الحقول مطلوبة');
      return;
    }
    if (newPass.length < 6) {
      setError('كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل');
      return;
    }
    if (newPass !== confirm) {
      setError('كلمتا المرور غير متطابقتين');
      return;
    }
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-end"
      style={{ backgroundColor: 'var(--overlay-dark)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full bg-bg-card rounded-t-3xl p-6 pb-10"
      >
        <div className="w-10 h-1 rounded-full bg-border-subtle mx-auto mb-6" />
        <div className="flex flex-col items-center text-center mb-4">
          <div className="w-14 h-14 rounded-full bg-primary-50 flex items-center justify-center mb-3">
            <KeyRound className="w-7 h-7 text-primary-500" />
          </div>
          <h3 className="text-lg font-bold text-text-primary font-arabic">تغيير كلمة المرور</h3>
        </div>
        <div className="space-y-3">
          <Input
            type="password"
            placeholder="كلمة المرور الحالية"
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            className="text-right font-arabic"
          />
          <Input
            type="password"
            placeholder="كلمة المرور الجديدة"
            value={newPass}
            onChange={(e) => setNewPass(e.target.value)}
            className="text-right font-arabic"
          />
          <Input
            type="password"
            placeholder="تأكيد كلمة المرور"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="text-right font-arabic"
          />
          {error && <p className="text-xs text-error font-arabic text-center">{error}</p>}
        </div>
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={handleSubmit}
          className="mt-5 w-full h-12 bg-primary-500 text-white rounded-xl font-medium font-arabic shadow-button"
        >
          حفظ
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

/* ─────────── Language Select Sheet ─────────── */
function LanguageSheet({
  current, onChange, onClose,
}: {
  current: 'ar' | 'fr';
  onChange: (lang: 'ar' | 'fr') => void;
  onClose: () => void;
}) {
  const languages: { key: 'ar' | 'fr'; label: string; sublabel: string }[] = [
    { key: 'ar', label: 'العربية', sublabel: 'الافتراضي' },
    { key: 'fr', label: 'Français', sublabel: 'French' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-end"
      style={{ backgroundColor: 'var(--overlay-dark)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full bg-bg-card rounded-t-3xl p-6 pb-10"
      >
        <div className="w-10 h-1 rounded-full bg-border-subtle mx-auto mb-6" />
        <h3 className="text-lg font-bold text-text-primary font-arabic text-center mb-4">اللغة</h3>
        <div className="space-y-2">
          {languages.map((lang) => (
            <motion.button
              key={lang.key}
              whileTap={{ scale: 0.98 }}
              onClick={() => { onChange(lang.key); onClose(); }}
              className={`w-full flex items-center justify-between p-4 rounded-xl transition-colors ${
                current === lang.key ? 'bg-primary-50 border border-primary-200' : 'bg-bg-elevated'
              }`}
            >
              <div className="text-right">
                <p className="font-medium text-sm font-arabic text-text-primary">{lang.label}</p>
                <p className="text-xs text-text-secondary font-arabic">{lang.sublabel}</p>
              </div>
              {current === lang.key && <Check className="w-5 h-5 text-primary-500" />}
            </motion.button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─────────── Main Settings Page ─────────── */
export default function Settings() {
  const navigate = useNavigate();
  const { theme, animationPreset, isDarkMode, setTheme, setAnimationPreset, toggleDarkMode } = useThemeStore();
  const { logout } = useAuthStore();
  const { showToast, ToastComponent } = useToast();

  const [language, setLanguage] = useState<'ar' | 'fr'>('ar');
  const [notifications, setNotifications] = useState(true);
  const [appointmentNotifs, setAppointmentNotifs] = useState(true);
  const [newMessages, setNewMessages] = useState(true);
  const [offersNotifs, setOffersNotifs] = useState(true);
  const [communityNotifs, setCommunityNotifs] = useState(true);
  const [fingerprint, setFingerprint] = useState(false);
  const [faceId, setFaceId] = useState(false);
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [show2FASheet, setShow2FASheet] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showLanguageSheet, setShowLanguageSheet] = useState(false);
  const [localData, setLocalData] = useState(true);
  const [shareLocation, setShareLocation] = useState(true);
  const [privateMode, setPrivateMode] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handle2FAComplete = () => {
    setTwoFAEnabled(true);
    setShow2FASheet(false);
    showToast('تم تفعيل المصادقة الثنائية', 'success');
  };

  const handleDeleteAccount = () => {
    if (!deletePassword) {
      showToast('أدخل كلمة المرور', 'error');
      return;
    }
    showToast('تم حذف الحساب', 'success');
    setShowDeleteConfirm(false);
    logout();
    navigate('/profile');
  };

  return (
    <Layout navbarProps={{ title: 'الإعدادات', showBack: true }}>
      <ToastComponent />
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="px-4 pt-4 pb-6 space-y-6"
      >
        {/* ─── Appearance Section ─── */}
        <motion.section variants={itemVariants}>
          <SectionTitle>المظهر</SectionTitle>
          <div className="bg-bg-card rounded-2xl shadow-card p-5">
            {/* Theme Selector */}
            <p className="font-medium text-sm font-arabic text-text-primary mb-4">السمة</p>
            <div className="grid grid-cols-3 gap-3">
              {themes.map((t) => (
                <motion.button
                  key={t.key}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => { setTheme(t.key); showToast(`تم تغيير السمة إلى ${t.label}`, 'success'); }}
                  className="flex flex-col items-center gap-1.5"
                >
                  <ThemePreviewCircle themeKey={t.key} isSelected={theme === t.key} />
                  <span className={`text-[10px] font-medium font-arabic ${theme === t.key ? 'text-text-primary' : 'text-text-tertiary'}`}>
                    {t.label}
                  </span>
                  <span className="text-[9px] text-text-tertiary font-arabic">{t.desc}</span>
                </motion.button>
              ))}
            </div>

            {/* Dark Mode */}
            <div className="flex items-center justify-between mt-5 pt-4 border-t border-border-subtle">
              <div className="flex items-center gap-3">
                {isDarkMode ? <Moon className="w-5 h-5 text-text-secondary" /> : <Sun className="w-5 h-5 text-text-secondary" />}
                <span className="font-medium text-sm font-arabic text-text-primary">الوضع المظلم</span>
              </div>
              <Switch
                checked={isDarkMode}
                onCheckedChange={() => { toggleDarkMode(); showToast(isDarkMode ? 'الوضع الفاتح' : 'الوضع المظلم', 'info'); }}
                className="data-[state=checked]:bg-primary-500"
              />
            </div>
          </div>
        </motion.section>

        {/* ─── Animation Section ─── */}
        <motion.section variants={itemVariants}>
          <SectionTitle>الحركات</SectionTitle>
          <div className="bg-bg-card rounded-2xl shadow-card overflow-hidden">
            {animations.map((anim, i) => {
              const Icon = anim.icon;
              return (
                <motion.button
                  key={anim.key}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { setAnimationPreset(anim.key); showToast(`تم تغيير الحركات إلى ${anim.label}`, 'success'); }}
                  className={`w-full flex items-center justify-between px-5 py-4 text-right transition-colors ${
                    i < animations.length - 1 ? 'border-b border-border-subtle' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${animationPreset === anim.key ? 'bg-primary-50' : 'bg-bg-elevated'}`}>
                      <Icon className={`w-5 h-5 ${animationPreset === anim.key ? 'text-primary-500' : 'text-text-secondary'}`} />
                    </div>
                    <div className="text-right">
                      <p className={`font-medium text-sm font-arabic ${animationPreset === anim.key ? 'text-primary-500' : 'text-text-primary'}`}>
                        {anim.label}
                      </p>
                      <p className="text-xs text-text-secondary font-arabic">{anim.desc}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <AnimationPreview preset={anim.key} />
                    {animationPreset === anim.key && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                        <Check className="w-5 h-5 text-primary-500" />
                      </motion.div>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </motion.section>

        {/* ─── Language Section ─── */}
        <motion.section variants={itemVariants}>
          <SectionTitle>اللغة</SectionTitle>
          <div className="bg-bg-card rounded-2xl shadow-card overflow-hidden">
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => setLanguage('ar')}
              className={`w-full flex items-center justify-between px-5 py-4 border-b border-border-subtle transition-colors ${
                language === 'ar' ? 'bg-primary-50' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-text-secondary" />
                <div>
                  <p className="font-medium text-sm font-arabic text-text-primary">العربية</p>
                  <p className="text-xs text-text-secondary font-arabic">اللغة الافتراضية</p>
                </div>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                language === 'ar' ? 'border-primary-500' : 'border-text-tertiary'
              }`}>
                {language === 'ar' && <div className="w-2.5 h-2.5 rounded-full bg-primary-500" />}
              </div>
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => setLanguage('fr')}
              className={`w-full flex items-center justify-between px-5 py-4 transition-colors ${
                language === 'fr' ? 'bg-primary-50' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-text-secondary" />
                <div>
                  <p className="font-medium text-sm text-text-primary">Français</p>
                  <p className="text-xs text-text-secondary">Bientôt disponible</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-bg-elevated text-text-tertiary text-[10px] font-medium rounded-full border border-border-subtle">
                  قريباً
                </span>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  language === 'fr' ? 'border-primary-500' : 'border-text-tertiary'
                }`}>
                  {language === 'fr' && <div className="w-2.5 h-2.5 rounded-full bg-primary-500" />}
                </div>
              </div>
            </motion.button>
          </div>
        </motion.section>

        {/* ─── Security Section ─── */}
        <motion.section variants={itemVariants}>
          <SectionTitle>الأمان</SectionTitle>
          <div className="bg-bg-card rounded-2xl shadow-card overflow-hidden">
            <ToggleRow
              icon={Fingerprint}
              title="البصمة"
              subtitle="فتح القفل بالبصمة"
              checked={fingerprint}
              onChange={(v) => { setFingerprint(v); showToast(v ? 'تم تفعيل البصمة' : 'تم تعطيل البصمة', 'info'); }}
            />
            <ToggleRow
              icon={Eye}
              title="Face ID"
              subtitle="فتح القفل بالوجه"
              checked={faceId}
              onChange={(v) => { setFaceId(v); showToast(v ? 'تم تفعيل Face ID' : 'تم تعطيل Face ID', 'info'); }}
            />
            <ArrowRow
              icon={Shield}
              title="المصادقة الثنائية"
              subtitle={twoFAEnabled ? 'مفعلة' : 'غير مفعلة'}
              onClick={() => setShow2FASheet(true)}
              last
            />
            <ArrowRow
              icon={Lock}
              title="تغيير كلمة المرور"
              subtitle="تحديث كلمة المرور"
              onClick={() => setShowChangePassword(true)}
              last
            />
          </div>
        </motion.section>

        {/* ─── Notifications Section ─── */}
        <motion.section variants={itemVariants}>
          <SectionTitle>الإشعارات</SectionTitle>
          <div className="bg-bg-card rounded-2xl shadow-card overflow-hidden">
            <ToggleRow
              icon={Bell}
              title="جميع الإشعارات"
              checked={notifications}
              onChange={(v) => {
                setNotifications(v);
                setAppointmentNotifs(v);
                setNewMessages(v);
                setOffersNotifs(v);
                setCommunityNotifs(v);
                showToast(v ? 'الإشعارات مفعلة' : 'الإشعارات معطلة', 'info');
              }}
            />
            <ToggleRow
              icon={CalendarDays}
              title="المواعيد"
              subtitle="تذكيرات المواعيد"
              checked={appointmentNotifs}
              onChange={setAppointmentNotifs}
            />
            <ToggleRow
              icon={Smartphone}
              title="الرسائل"
              subtitle="إشعارات الرسائل الجديدة"
              checked={newMessages}
              onChange={setNewMessages}
            />
            <ToggleRow
              icon={Award}
              title="العروض"
              subtitle="عروض وخصومات"
              checked={offersNotifs}
              onChange={setOffersNotifs}
            />
            <ToggleRow
              icon={Volume2}
              title="المجتمع"
              subtitle="ردود وإشارات"
              checked={communityNotifs}
              onChange={setCommunityNotifs}
              last
            />
          </div>
        </motion.section>

        {/* ─── Privacy Section ─── */}
        <motion.section variants={itemVariants}>
          <SectionTitle>الخصوصية</SectionTitle>
          <div className="bg-bg-card rounded-2xl shadow-card overflow-hidden">
            <ToggleRow
              icon={Smartphone}
              title="حفظ البيانات محلياً"
              checked={localData}
              onChange={setLocalData}
            />
            <ToggleRow
              icon={MapPin}
              title="مشاركة موقعي"
              checked={shareLocation}
              onChange={setShareLocation}
            />
            <ToggleRow
              icon={Eye}
              title="وضع التصفح الخاص"
              checked={privateMode}
              onChange={setPrivateMode}
              last
            />
          </div>
        </motion.section>

        {/* ─── About Section ─── */}
        <motion.section variants={itemVariants}>
          <SectionTitle>حول التطبيق</SectionTitle>
          <div className="bg-bg-card rounded-2xl shadow-card overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border-subtle">
              <div className="flex items-center gap-3">
                <Info className="w-5 h-5 text-text-secondary" />
                <span className="font-medium text-sm font-arabic text-text-primary">الإصدار</span>
              </div>
              <span className="text-xs text-text-tertiary font-mono">1.0.0 (build 2025.06.15)</span>
            </div>
            <div className="flex items-center justify-between px-5 py-4 border-b border-border-subtle">
              <div className="flex items-center gap-3">
                <Award className="w-5 h-5 text-primary-500" />
                <span className="font-medium text-sm font-arabic text-text-primary">Hallaqi</span>
              </div>
              <span className="text-[10px] text-text-tertiary font-arabic">THE SYMBOL OF TRUSTED PERSONAL CARE</span>
            </div>
            <ArrowRow icon={FileText} title="شروط الاستخدام" onClick={() => showToast('قريباً', 'info')} />
            <ArrowRow icon={FileText} title="سياسة الخصوصية" onClick={() => showToast('قريباً', 'info')} />
            <ArrowRow icon={Award} title="التراخيص" onClick={() => showToast('قريباً', 'info')} last />
          </div>
        </motion.section>

        {/* ─── Danger Zone ─── */}
        <motion.section variants={itemVariants} className="pt-4 border-t border-error/30">
          <div className="space-y-3">
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowLogoutConfirm(true)}
              className="w-full flex items-center gap-3 px-5 py-4 bg-bg-card rounded-2xl shadow-card"
            >
              <LogOut className="w-5 h-5 text-warning" />
              <span className="font-medium text-sm font-arabic text-warning">تسجيل الخروج</span>
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full flex items-center gap-3 px-5 py-4 bg-bg-card rounded-2xl shadow-card"
            >
              <Trash2 className="w-5 h-5 text-error" />
              <span className="font-medium text-sm font-arabic text-error">حذف الحساب</span>
            </motion.button>
          </div>
        </motion.section>

        {/* ─── Hallaqi Branding ─── */}
        <motion.div
          variants={itemVariants}
          className="text-center py-4"
        >
          <p className="text-[10px] text-text-tertiary font-arabic">
            Hallaqi — THE SYMBOL OF TRUSTED PERSONAL CARE
          </p>
          <p className="text-[9px] text-text-tertiary mt-1">
            © 2025 Kacimy. جميع الحقوق محفوظة.
          </p>
        </motion.div>
      </motion.div>

      {/* ─── 2FA Bottom Sheet ─── */}
      <AnimatePresence>
        {show2FASheet && (
          <TwoFASheet onClose={handle2FAComplete} />
        )}
      </AnimatePresence>

      {/* ─── Change Password Sheet ─── */}
      <AnimatePresence>
        {showChangePassword && (
          <ChangePasswordSheet onClose={() => { setShowChangePassword(false); showToast('تم تغيير كلمة المرور', 'success'); }} />
        )}
      </AnimatePresence>

      {/* ─── Language Sheet ─── */}
      <AnimatePresence>
        {showLanguageSheet && (
          <LanguageSheet
            current={language}
            onChange={(lang) => { setLanguage(lang); showToast(`تم تغيير اللغة`, 'success'); }}
            onClose={() => setShowLanguageSheet(false)}
          />
        )}
      </AnimatePresence>

      {/* ─── Logout Confirmation ─── */}
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
              <div className="w-14 h-14 rounded-full bg-warning/10 flex items-center justify-center mx-auto mb-4">
                <LogOut className="w-7 h-7 text-warning" />
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
                  onClick={() => { logout(); navigate('/profile'); showToast('تم تسجيل الخروج', 'info'); }}
                  className="flex-1 h-11 bg-warning text-white rounded-xl font-medium font-arabic"
                >
                  خروج
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Delete Account Confirmation ─── */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center px-6"
            style={{ backgroundColor: 'var(--overlay-dark)' }}
            onClick={() => setShowDeleteConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-bg-card rounded-2xl p-6 w-full max-w-[320px] shadow-float"
            >
              <div className="w-14 h-14 rounded-full bg-error/10 flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-7 h-7 text-error" />
              </div>
              <h3 className="text-lg font-bold text-error font-arabic text-center">حذف الحساب</h3>
              <p className="text-sm text-text-secondary font-arabic mt-2 text-center leading-relaxed">
                لا يمكن التراجع عن هذا الإجراء. سيتم حذف جميع بياناتك نهائياً.
              </p>
              <div className="mt-4 space-y-3">
                <Input
                  type="password"
                  placeholder="أدخل كلمة المرور للتأكيد"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  className="text-right font-arabic"
                />
                <div className="flex gap-3">
                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 h-11 bg-bg-elevated text-text-primary rounded-xl font-medium font-arabic"
                  >
                    إلغاء
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    onClick={handleDeleteAccount}
                    className="flex-1 h-11 bg-error text-white rounded-xl font-medium font-arabic"
                  >
                    حذف نهائي
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
}
