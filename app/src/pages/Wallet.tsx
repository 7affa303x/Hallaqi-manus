import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Eye, EyeOff, PlusCircle, ArrowDownCircle, Send, ArrowDownLeft,
  ArrowUpRight, RotateCcw, Copy, Check, Scissors, Trophy,
  CreditCard, Smartphone, Info, MapPin, Calendar, Star, Wallet as WalletIcon,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import Layout from '@/components/Layout';

const easeOutExpo = [0.16, 1, 0.3, 1] as [number, number, number, number];
const easeSpring = [0.32, 0.72, 0, 1] as [number, number, number, number];

/* ─────────── types ─────────── */
interface Transaction {
  id: number;
  type: 'payment' | 'topup' | 'refund' | 'reward';
  amount: number;
  desc: string;
  subtitle: string;
  date: string;
  month: string;
}

interface Coupon {
  id: number;
  code: string;
  discount: string;
  desc: string;
  expiry: string;
  used: boolean;
}

interface Tier {
  name: string;
  nameAr: string;
  icon: typeof Trophy;
  pointsRequired: number;
  color: string;
}

/* ─────────── data ─────────── */
const transactions: Transaction[] = [
  { id: 1, type: 'payment', amount: -600, desc: 'حجز — فيد احترافي', subtitle: 'أمين حلاق', date: '15 جوان 2025', month: 'جوان 2025' },
  { id: 2, type: 'refund', amount: 400, desc: 'استرداد — إلغاء', subtitle: 'من كصيمي', date: '10 جوان 2025', month: 'جوان 2025' },
  { id: 3, type: 'payment', amount: -400, desc: 'حجز — قصة كلاسيكية', subtitle: 'كريم كوت', date: '5 جوان 2025', month: 'جوان 2025' },
  { id: 4, type: 'reward', amount: 200, desc: 'مكافأة — 5 حجوزات', subtitle: 'نقاط الولاء', date: '1 جوان 2025', month: 'جوان 2025' },
  { id: 5, type: 'payment', amount: -700, desc: 'حجز — عبد الرحمن', subtitle: 'عبد الرحمن حلاق', date: '28 ماي 2025', month: 'ماي 2025' },
  { id: 6, type: 'topup', amount: 5000, desc: 'شحن المحفظة', subtitle: 'CCP', date: '20 ماي 2025', month: 'ماي 2025' },
];

const coupons: Coupon[] = [
  { id: 1, code: 'KACIMY20', discount: '20%', desc: 'خصم على أول حجز', expiry: '30 جوان 2025', used: false },
  { id: 2, code: 'VIP50', discount: '50 دج', desc: 'خصم ثابت', expiry: '15 يوليو 2025', used: false },
  { id: 3, code: 'SUMMER10', discount: '10%', desc: 'خصم الصيف', expiry: '31 أوت 2025', used: true },
];

const tiers: Tier[] = [
  { name: 'bronze', nameAr: 'برونزي', icon: Trophy, pointsRequired: 0, color: '#CD7F32' },
  { name: 'silver', nameAr: 'فضي', icon: Trophy, pointsRequired: 1000, color: '#C0C0C0' },
  { name: 'gold', nameAr: 'ذهبي', icon: Trophy, pointsRequired: 3000, color: '#FFD700' },
  { name: 'platinum', nameAr: 'بلاتيني', icon: Trophy, pointsRequired: 6000, color: '#E5E4E2' },
  { name: 'diamond', nameAr: 'الماسي', icon: Trophy, pointsRequired: 10000, color: '#B9F2FF' },
];

/* ─────────── toast hook ─────────── */
function useToast() {
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
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

/* ─────────── Shimmer Component ─────────── */
function ShimmerOverlay() {
  return (
    <div className="absolute inset-0 overflow-hidden rounded-[20px] pointer-events-none">
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)',
        }}
        animate={{ x: ['-100%', '100%'] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  );
}

/* ─────────── Balance Card ─────────── */
function BalanceCard({ showAddCredit }: { showAddCredit: () => void }) {
  const [showBalance, setShowBalance] = useState(true);
  const [displayBalance, setDisplayBalance] = useState('2,450');
  const actualBalance = '2,450';

  const toggleBalance = () => {
    if (showBalance) {
      let steps = 0;
      const interval = setInterval(() => {
        setDisplayBalance(
          Array.from({ length: 4 }, () => Math.floor(Math.random() * 10)).join(''),
        );
        steps += 1;
        if (steps > 5) {
          clearInterval(interval);
          setDisplayBalance('••••');
          setShowBalance(false);
        }
      }, 50);
    } else {
      setDisplayBalance(actualBalance);
      setShowBalance(true);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: easeSpring }}
      className="mx-4 mt-4 relative overflow-hidden rounded-[20px] shadow-float"
      style={{ background: 'var(--gradient-card)' }}
    >
      <ShimmerOverlay />
      <div
        className="absolute inset-0 opacity-5"
        style={{ backgroundImage: 'url(/motif-geometric.svg)', backgroundSize: '120px' }}
      />

      <div className="relative z-10 p-6">
        {/* Top Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <WalletIcon className="w-5 h-5 text-white/80" />
            <span className="text-sm text-white/80 font-arabic font-medium">رصيدك</span>
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={toggleBalance}
            className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            {showBalance ? (
              <Eye className="w-5 h-5 text-white" />
            ) : (
              <EyeOff className="w-5 h-5 text-white" />
            )}
          </motion.button>
        </div>

        {/* Balance */}
        <div className="mt-4 text-center">
          <motion.p
            key={displayBalance}
            initial={!showBalance ? { opacity: 0.5 } : false}
            animate={{ opacity: 1 }}
            className="text-[32px] font-extrabold text-white font-display"
          >
            {displayBalance} <span className="text-xl">دج</span>
          </motion.p>
        </div>

        {/* Bottom Row */}
        <div className="flex items-center justify-between mt-6">
          <span className="text-[10px] text-white/60 font-arabic">
            آخر تحديث: منذ 5 دقائق
          </span>
          <Scissors className="w-5 h-5 text-white/20" />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-5">
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={showAddCredit}
            className="flex-1 h-11 bg-white/20 backdrop-blur rounded-xl text-sm text-white font-medium font-arabic flex items-center justify-center gap-2 hover:bg-white/30 transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            إضافة رصيد
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => { }}
            className="flex-1 h-11 bg-white/20 backdrop-blur rounded-xl text-sm text-white font-medium font-arabic flex items-center justify-center gap-2 hover:bg-white/30 transition-colors"
          >
            <ArrowDownCircle className="w-4 h-4" />
            سحب
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => { }}
            className="flex-1 h-11 bg-white/20 backdrop-blur rounded-xl text-sm text-white font-medium font-arabic flex items-center justify-center gap-2 hover:bg-white/30 transition-colors"
          >
            <Send className="w-4 h-4" />
            تحويل
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

/* ─────────── Transaction Card ─────────── */
function TransactionCard({ tx }: { tx: Transaction }) {
  const isIncoming = tx.amount > 0;

  const iconConfig = {
    payment: { icon: ArrowUpRight, bg: 'bg-error/10', iconColor: 'text-error' },
    topup: { icon: ArrowDownLeft, bg: 'bg-success/10', iconColor: 'text-success' },
    refund: { icon: RotateCcw, bg: 'bg-warning/10', iconColor: 'text-warning' },
    reward: { icon: ArrowDownLeft, bg: 'bg-success/10', iconColor: 'text-success' },
  };

  const config = iconConfig[tx.type];
  const Icon = config.icon;

  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      className="bg-bg-card rounded-xl shadow-card p-4 flex items-center gap-3"
    >
      <div className={`w-10 h-10 rounded-full ${config.bg} flex items-center justify-center flex-shrink-0`}>
        <Icon className={`w-5 h-5 ${config.iconColor}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm text-text-primary font-arabic truncate">{tx.desc}</p>
        <p className="text-xs text-text-secondary font-arabic">{tx.subtitle}</p>
        <div className="flex items-center gap-1 mt-0.5">
          <Calendar className="w-3 h-3 text-text-tertiary" />
          <p className="text-[10px] text-text-tertiary font-arabic">{tx.date}</p>
        </div>
      </div>
      <span className={`font-mono font-bold text-base flex-shrink-0 ${isIncoming ? 'text-success' : 'text-error'}`}>
        {isIncoming ? '+' : ''}{tx.amount.toLocaleString()} دج
      </span>
    </motion.div>
  );
}

/* ─────────── Points Tier Badge ─────────── */
function TierBadge({ tier, isCurrent }: { tier: Tier; isCurrent: boolean }) {
  const Icon = tier.icon;

  return (
    <motion.div
      whileTap={{ scale: 0.95 }}
      className={`flex flex-col items-center gap-1.5 p-3 rounded-xl min-w-[72px] transition-colors ${
        isCurrent ? 'bg-primary-50 ring-1 ring-primary-200' : 'bg-bg-elevated/50'
      }`}
    >
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center"
        style={{ backgroundColor: `${tier.color}22` }}
      >
        <Icon className="w-5 h-5" style={{ color: tier.color }} />
      </div>
      <span className={`text-[10px] font-bold font-arabic ${isCurrent ? 'text-primary-500' : 'text-text-secondary'}`}>
        {tier.nameAr}
      </span>
      <span className="text-[9px] text-text-tertiary font-mono">{tier.pointsRequired.toLocaleString()}</span>
      {isCurrent && (
        <motion.div
          layoutId="current-tier"
          className="w-1.5 h-1.5 rounded-full bg-primary-500"
        />
      )}
    </motion.div>
  );
}

/* ─────────── Coupon Card ─────────── */
function CouponCard({ coupon }: { coupon: Coupon }) {
  const [copied, setCopied] = useState(false);
  const [used, setUsed] = useState(coupon.used);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(coupon.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      className={`relative bg-bg-card rounded-xl shadow-card overflow-hidden ${used ? 'opacity-50' : ''}`}
    >
      {/* Left green border */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-success" />

      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-primary-500 font-arabic">{coupon.discount}</span>
              {used && (
                <span className="px-2 py-0.5 bg-text-tertiary text-white text-[10px] font-bold rounded-full font-arabic">
                  منتهي
                </span>
              )}
            </div>
            <p className="text-sm text-text-secondary font-arabic mt-0.5">{coupon.desc}</p>

            {/* Code + Expiry */}
            <div className="flex items-center gap-3 mt-3 flex-wrap">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-bg-elevated rounded-lg font-mono text-xs text-text-primary hover:bg-primary-50 transition-colors"
              >
                {coupon.code}
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-success" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-text-tertiary" />
                )}
              </motion.button>
              <span className="text-[10px] text-text-tertiary font-arabic flex items-center gap-1">
                <Info className="w-3 h-3" />
                ينتهي: {coupon.expiry}
              </span>
            </div>
          </div>

          {/* Use Button */}
          {!used ? (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setUsed(true)}
              className="px-4 py-2 bg-primary-500 text-white text-xs font-bold rounded-lg shadow-button font-arabic"
            >
              استخدم
            </motion.button>
          ) : (
            <div className="flex items-center gap-1 px-3 py-2 bg-success/10 rounded-lg">
              <Check className="w-4 h-4 text-success" />
              <span className="text-xs text-success font-arabic">مستخدم</span>
            </div>
          )}
        </div>
      </div>

      {/* Dashed cut effect */}
      <div className="absolute right-0 top-0 bottom-0 w-4 flex flex-col justify-around py-2">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="w-2 h-2 rounded-full bg-bg-base" />
        ))}
      </div>
    </motion.div>
  );
}

/* ─────────── Payment Method Card ─────────── */
function PaymentMethodCard({
  type,
  onLink,
}: {
  type: 'ccp' | 'baridi';
  onLink: () => void;
}) {
  const isCCP = type === 'ccp';
  const [inputValue, setInputValue] = useState('');

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-bg-card rounded-2xl shadow-card p-4"
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-bg-elevated flex items-center justify-center flex-shrink-0">
          {isCCP ? (
            <CreditCard className="w-6 h-6 text-text-tertiary" />
          ) : (
            <Smartphone className="w-6 h-6 text-text-tertiary" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-medium text-sm text-text-primary font-arabic">
              {isCCP ? 'الحساب البريدي الجزائري' : 'بريدي موب'}
            </p>
            <span className="px-2 py-0.5 bg-warning/10 text-warning text-[10px] font-bold rounded-full font-arabic">
              قريباً
            </span>
          </div>
          <p className="text-xs text-text-secondary font-arabic mt-0.5">
            {isCCP ? 'ربط حسابك البريدي' : 'الدفع عبر الهاتف'}
          </p>
        </div>
      </div>

      {/* Input Field */}
      <div className="mt-3 flex gap-2">
        <div className="flex-1 relative">
          {isCCP ? (
            <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
          ) : (
            <Smartphone className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
          )}
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={isCCP ? 'رقم الحساب البريدي' : 'رقم الهاتف'}
            type={isCCP ? 'text' : 'tel'}
            className="pr-10 text-right font-mono text-sm"
          />
        </div>
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={onLink}
          className="h-10 px-4 bg-primary-500 text-white rounded-xl text-sm font-medium font-arabic shadow-button flex items-center gap-1"
        >
          ربط
        </motion.button>
      </div>
    </motion.div>
  );
}

/* ─────────── Add Credit Bottom Sheet ─────────── */
function AddCreditSheet({ onClose }: { onClose: () => void }) {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');

  const presetAmounts = [500, 1000, 2000, 5000];

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
        {/* Handle */}
        <div className="w-10 h-1 rounded-full bg-border-subtle mx-auto mb-6" />

        <h3 className="text-lg font-bold text-text-primary font-arabic text-center mb-6">
          شحن الرصيد
        </h3>

        {/* Preset Amounts */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {presetAmounts.map((amount) => (
            <motion.button
              key={amount}
              whileTap={{ scale: 0.96 }}
              onClick={() => { setSelectedAmount(amount); setCustomAmount(''); }}
              className={`h-14 rounded-xl border-2 flex items-center justify-center font-mono font-bold text-lg transition-colors ${
                selectedAmount === amount
                  ? 'border-primary-500 bg-primary-50 text-primary-500'
                  : 'border-border-subtle bg-bg-elevated text-text-primary'
              }`}
            >
              {amount.toLocaleString()} دج
            </motion.button>
          ))}
        </div>

        {/* Custom Amount */}
        <div className="mb-6">
          <label className="text-sm text-text-secondary font-arabic mb-2 block">مبلغ مخصص</label>
          <div className="relative">
            <input
              type="number"
              value={customAmount}
              onChange={(e) => { setCustomAmount(e.target.value); setSelectedAmount(null); }}
              placeholder="أدخل المبلغ"
              className="w-full h-12 bg-bg-elevated rounded-xl px-4 text-text-primary font-mono text-right outline-none focus:ring-2 focus:ring-primary-500 transition-all"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary text-sm font-arabic">دج</span>
          </div>
        </div>

        {/* Charge Button */}
        <motion.button
          whileTap={{ scale: 0.96 }}
          disabled={!selectedAmount && !customAmount}
          className="w-full h-12 bg-primary-500 text-white rounded-xl font-bold font-arabic shadow-button disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <PlusCircle className="w-5 h-5" />
          شحن
        </motion.button>

        <p className="text-[10px] text-text-tertiary font-arabic text-center mt-4">
          * سيتوفر قريباً — الدفع عبر CCP و Baridi Mob
        </p>
      </motion.div>
    </motion.div>
  );
}

/* ─────────── Main Wallet Page ─────────── */
export default function Wallet() {
  const [activeTab, setActiveTab] = useState<'transactions' | 'points' | 'coupons'>('transactions');
  const [showAddCredit, setShowAddCredit] = useState(false);
  const [pointsProgress, setPointsProgress] = useState(0);
  const { showToast, ToastComponent } = useToast();

  const currentPoints = 2450;
  const currentTier = tiers[1];
  const nextTier = tiers[2];
  const pointsToNext = nextTier.pointsRequired - currentPoints;
  const progressPercent = (currentPoints / nextTier.pointsRequired) * 100;

  useEffect(() => {
    const timer = setTimeout(() => setPointsProgress(progressPercent), 300);
    return () => clearTimeout(timer);
  }, [progressPercent]);

  const grouped = transactions.reduce<Record<string, Transaction[]>>((acc, tx) => {
    if (!acc[tx.month]) acc[tx.month] = [];
    acc[tx.month].push(tx);
    return acc;
  }, {});

  const tabs = [
    { key: 'transactions' as const, label: 'المعاملات' },
    { key: 'points' as const, label: 'النقاط' },
    { key: 'coupons' as const, label: 'الكوبونات' },
  ];

  const handleLinkPayment = (type: 'ccp' | 'baridi') => {
    showToast(
      type === 'ccp' ? 'ربط الحساب البريدي قريباً' : 'ربط بريدي موب قريباً',
      'info',
    );
  };

  return (
    <Layout navbarProps={{ title: 'المحفظة', showBack: true }}>
      <ToastComponent />
      <div className="pb-6">
        {/* Balance Card */}
        <BalanceCard showAddCredit={() => setShowAddCredit(true)} />

        {/* Payment Methods */}
        <div className="mx-4 mt-4 space-y-3">
          <PaymentMethodCard type="ccp" onLink={() => handleLinkPayment('ccp')} />
          <PaymentMethodCard type="baridi" onLink={() => handleLinkPayment('baridi')} />
        </div>

        {/* Segmented Control */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mx-4 mt-6 bg-bg-elevated rounded-xl p-1 flex"
        >
          {tabs.map((tab) => (
            <motion.button
              key={tab.key}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(tab.key)}
              className={`relative flex-1 py-2.5 rounded-lg text-sm font-medium font-arabic transition-colors duration-200 ${
                activeTab === tab.key ? 'text-white' : 'text-text-secondary'
              }`}
            >
              {activeTab === tab.key && (
                <motion.div
                  layoutId="wallet-tab-indicator"
                  className="absolute inset-0 bg-primary-500 rounded-lg shadow-button"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">{tab.label}</span>
            </motion.button>
          ))}
        </motion.div>

        {/* Tab Content */}
        <div className="px-4 mt-4">
          <AnimatePresence mode="wait">
            {/* ─── Transactions Tab ─── */}
            {activeTab === 'transactions' && (
              <motion.div
                key="transactions"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
                className="space-y-4"
              >
                {Object.entries(grouped).map(([month, txs]) => (
                  <div key={month}>
                    <div className="flex items-center gap-2 mb-2 px-1">
                      <Calendar className="w-3.5 h-3.5 text-text-tertiary" />
                      <p className="text-xs font-bold text-text-tertiary font-arabic">{month}</p>
                    </div>
                    <div className="space-y-3">
                      {txs.map((tx, i) => (
                        <motion.div
                          key={tx.id}
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                        >
                          <TransactionCard tx={tx} />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))}

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 text-sm text-primary-500 font-medium font-arabic text-center hover:text-primary-600 transition-colors"
                >
                  عرض المزيد
                </motion.button>
              </motion.div>
            )}

            {/* ─── Points Tab ─── */}
            {activeTab === 'points' && (
              <motion.div
                key="points"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                {/* Points Summary Card */}
                <div className="bg-bg-card rounded-2xl shadow-card p-6 text-center">
                  <div className="w-14 h-14 rounded-full bg-warning/10 flex items-center justify-center mx-auto mb-3">
                    <Trophy className="w-7 h-7 text-warning" />
                  </div>
                  <h3 className="text-2xl font-bold text-warning font-arabic">
                    {currentPoints.toLocaleString()} نقطة
                  </h3>
                  <p className="text-sm text-text-secondary font-arabic mt-1">
                    = {(currentPoints / 10).toLocaleString()} دج قابلة للاستخدام
                  </p>

                  {/* Progress to next tier */}
                  <div className="mt-5">
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="text-text-tertiary font-arabic font-bold">{currentTier.nameAr}</span>
                      <span className="text-text-tertiary font-arabic">
                        {pointsToNext.toLocaleString()} نقطة للوصول للذهبي
                      </span>
                      <span className="text-text-tertiary font-arabic font-bold">{nextTier.nameAr}</span>
                    </div>
                    <div className="w-full h-3 bg-bg-elevated rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pointsProgress}%` }}
                        transition={{ duration: 1.2, ease: easeOutExpo, delay: 0.2 }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: 'var(--warning)' }}
                      />
                    </div>
                    <p className="text-[10px] text-text-tertiary font-arabic mt-2">
                      {progressPercent.toFixed(0)}% من المستوى الذهبي
                    </p>
                  </div>
                </div>

                {/* Tiers */}
                <div>
                  <p className="text-sm font-bold text-text-tertiary font-arabic mb-3">مستويات الولاء</p>
                  <div className="flex gap-2 justify-center flex-wrap">
                    {tiers.map((tier) => (
                      <TierBadge
                        key={tier.name}
                        tier={tier}
                        isCurrent={tier.name === currentTier.name}
                      />
                    ))}
                  </div>
                </div>

                {/* Earn Points */}
                <div>
                  <p className="text-sm font-bold text-text-tertiary font-arabic mb-3">اكسب المزيد</p>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { action: 'أكمل حجزاً', points: '+100', color: 'text-success', bg: 'bg-success/10', icon: Calendar },
                      { action: 'قيّم حلاقاً', points: '+50', color: 'text-primary-500', bg: 'bg-primary-50', icon: Star },
                      { action: 'شارك في المجتمع', points: '+25', color: 'text-warning', bg: 'bg-warning/10', icon: MapPin },
                      { action: 'وثّق حسابك', points: '+200', color: 'text-error', bg: 'bg-error/10', icon: Trophy },
                    ].map((item) => (
                      <motion.div
                        key={item.action}
                        whileTap={{ scale: 0.95 }}
                        className="bg-bg-card rounded-xl p-4 shadow-card flex flex-col items-center text-center gap-2"
                      >
                        <div className={`w-8 h-8 rounded-full ${item.bg} flex items-center justify-center`}>
                          <item.icon className={`w-4 h-4 ${item.color}`} />
                        </div>
                        <span className={`text-lg font-bold font-mono ${item.color}`}>{item.points}</span>
                        <span className="text-xs text-text-secondary font-arabic">{item.action}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ─── Coupons Tab ─── */}
            {activeTab === 'coupons' && (
              <motion.div
                key="coupons"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
                className="space-y-4"
              >
                {coupons.map((coupon, i) => (
                  <motion.div
                    key={coupon.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <CouponCard coupon={coupon} />
                  </motion.div>
                ))}

                {/* Empty state if all used */}
                {coupons.every((c) => c.used) && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-8"
                  >
                    <Info className="w-12 h-12 text-text-tertiary mx-auto mb-3" />
                    <p className="text-sm text-text-secondary font-arabic">لا توجد كوبونات متاحة</p>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ─── Add Credit Bottom Sheet ─── */}
      <AnimatePresence>
        {showAddCredit && (
          <AddCreditSheet onClose={() => setShowAddCredit(false)} />
        )}
      </AnimatePresence>
    </Layout>
  );
}
