import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Flame,
  MessageSquare,
  Star,
  Trophy,
  ThumbsUp,
  Pin,
  BadgeCheck,
  Clock,
  Users,
  Hash,
  Lightbulb,
  Wrench,
  Tag,
  MapPin,
  Scissors,
  Palette,
  Sparkles,
  ChevronLeft,
  Crown,
  Award,
  Shield,
  Zap,
  Heart,
  Compass,
  Lock,
  ChevronDown,
  Plus,
  Share2,
  CheckCircle2,
  XCircle,
  BarChart3,
  Camera,
} from 'lucide-react';
import Layout from '@/components/Layout';
import {
  discussions,
  reviews,
  leaderboard,
  badges,
  polls,
  quizQuestion,
  communityStats,
  discussionCategories,
} from '@/data/mockCommunity';
// Community page - no additional type imports needed

/* ------------------------------------------------------------------ */
/*  Easing helpers                                                     */
/* ------------------------------------------------------------------ */
const easeOutExpo = [0.16, 1, 0.3, 1] as [number, number, number, number];
const easeSpring = [0.32, 0.72, 0, 1] as [number, number, number, number];

/* ------------------------------------------------------------------ */
/*  Tab type                                                           */
/* ------------------------------------------------------------------ */
type TabKey = 'discussions' | 'reviews' | 'contests';

const tabs: { key: TabKey; label: string; icon: typeof MessageSquare }[] = [
  { key: 'discussions', label: 'النقاشات', icon: MessageSquare },
  { key: 'reviews', label: 'التقييمات', icon: Star },
  { key: 'contests', label: 'المسابقات', icon: Trophy },
];

/* ------------------------------------------------------------------ */
/*  Review filter type                                                 */
/* ------------------------------------------------------------------ */
type ReviewFilter = 'الأحدث' | 'الأعلى تقييماً' | 'موثق فقط';

/* ------------------------------------------------------------------ */
/*  Quiz state                                                         */
/* ------------------------------------------------------------------ */
interface QuizState {
  questionIndex: number;
  score: number;
  streak: number;
  selectedOption: number | null;
  showResult: boolean;
  isCorrect: boolean;
  timeLeft: number;
}

/* ------------------------------------------------------------------ */
/*  Badge icon map                                                     */
/* ------------------------------------------------------------------ */
const badgeIconMap = {
  flame: Flame,
  scissors: Scissors,
  shield: Shield,
  star: Star,
  lightning: Zap,
  compass: Compass,
  heart: Heart,
  lightbulb: Lightbulb,
};

/* ------------------------------------------------------------------ */
/*  Channel categories (Discord-style)                                 */
/* ------------------------------------------------------------------ */
const channelCategories = [
  {
    name: 'النقاشات العامة',
    channels: [
      { id: 'general', name: 'عام', icon: Hash, desc: 'كل ما يخص الحلاقة', count: 234 },
      { id: 'tips', name: 'نصائح', icon: Lightbulb, desc: 'نصائح من المحترفين', count: 89 },
      { id: 'tools', name: 'أدوات', icon: Wrench, desc: 'مراجعات الأدوات', count: 56 },
      { id: 'deals', name: 'عروض', icon: Tag, desc: 'عروض وخصومات', count: 120 },
    ],
  },
  {
    name: 'مناطق',
    channels: [
      { id: 'algiers', name: 'الجزائر العاصمة', icon: MapPin, desc: '', count: 156 },
      { id: 'oran', name: 'وهران', icon: MapPin, desc: '', count: 78 },
      { id: 'constantine', name: 'قسنطينة', icon: MapPin, desc: '', count: 45 },
      { id: 'annaba', name: 'عنابة', icon: MapPin, desc: '', count: 32 },
    ],
  },
  {
    name: 'تخصصات',
    channels: [
      { id: 'men', name: 'قصات رجالية', icon: Scissors, desc: '', count: 198 },
      { id: 'color', name: 'تلوين', icon: Palette, desc: '', count: 67 },
      { id: 'care', name: 'عناية بالشعر', icon: Sparkles, desc: '', count: 112 },
    ],
  },
];

/* ================================================================== */
/*  MAIN COMMUNITY PAGE                                               */
/* ================================================================== */
export default function Community() {
  const [activeTab, setActiveTab] = useState<TabKey>('discussions');
  const [activeCategory, setActiveCategory] = useState('عام');
  const [reviewFilter, setReviewFilter] = useState<ReviewFilter>('الأحدث');
  const [quizState, setQuizState] = useState<QuizState | null>(null);
  const [flippedBadge, setFlippedBadge] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /* ---- Quiz timer ---- */
  useEffect(() => {
    if (quizState && quizState.timeLeft > 0 && !quizState.showResult) {
      timerRef.current = setInterval(() => {
        setQuizState((prev) => {
          if (!prev || prev.timeLeft <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            return prev
              ? { ...prev, timeLeft: 0, showResult: true, isCorrect: false }
              : null;
          }
          return { ...prev, timeLeft: prev.timeLeft - 1 };
        });
      }, 1000);
      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    }
  }, [quizState?.timeLeft, quizState?.showResult]);

  const startQuiz = useCallback(() => {
    setQuizState({
      questionIndex: 0,
      score: 0,
      streak: 0,
      selectedOption: null,
      showResult: false,
      isCorrect: false,
      timeLeft: quizQuestion.timeLimit,
    });
  }, []);

  const selectQuizOption = useCallback(
    (optionIndex: number) => {
      if (!quizState || quizState.showResult) return;
      if (timerRef.current) clearInterval(timerRef.current);

      const isCorrect = optionIndex === quizQuestion.correctIndex;
      setQuizState({
        ...quizState,
        selectedOption: optionIndex,
        showResult: true,
        isCorrect,
        score: isCorrect ? quizState.score + 100 + quizState.streak * 20 : quizState.score,
        streak: isCorrect ? quizState.streak + 1 : 0,
      });
    },
    [quizState]
  );

  const nextQuestion = useCallback(() => {
    setQuizState({
      questionIndex: 0,
      score: quizState?.score ?? 0,
      streak: quizState?.streak ?? 0,
      selectedOption: null,
      showResult: false,
      isCorrect: false,
      timeLeft: quizQuestion.timeLimit,
    });
  }, [quizState?.score, quizState?.streak]);

  const exitQuiz = useCallback(() => setQuizState(null), []);

  const filteredDiscussions = discussions.filter(
    (d) => activeCategory === 'عام' || d.category === activeCategory
  );

  const filteredReviews = reviews.filter((r) => {
    if (reviewFilter === 'موثق فقط') return r.verified;
    if (reviewFilter === 'الأعلى تقييماً') return r.rating >= 5;
    return true;
  });

  return (
    <Layout navbarProps={{ title: 'المجتمع' }}>
      <div className="pb-6">
        {/* ── Header Section ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="px-4 pt-4"
        >
          <div className="flex items-center gap-2 mb-1">
            <motion.div
              initial={{ rotate: -10 }}
              animate={{ rotate: [0, -5, 5, 0] }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Flame className="w-7 h-7 text-primary-500" />
            </motion.div>
            <h1 className="text-2xl font-extrabold font-arabic text-text-primary">
              مجتمع كصيمي
            </h1>
          </div>
          <p className="text-text-secondary text-sm font-arabic mr-9 -mt-1">
            تفاعل، تعلم، تنافس
          </p>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="flex gap-3 mt-4"
          >
            {[
              { label: 'عدد الأعضاء', value: communityStats.members, icon: Users },
              { label: 'المواضيع النشطة', value: communityStats.activeTopics, icon: MessageSquare },
              { label: 'المسابقات', value: communityStats.contests, icon: Trophy },
            ].map((stat) => (
              <div
                key={stat.label}
                className="flex-1 bg-bg-card rounded-xl p-3 shadow-card flex items-center gap-2"
              >
                <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0">
                  <stat.icon className="w-4 h-4 text-primary-500" />
                </div>
                <div>
                  <p className="text-lg font-bold font-mono leading-none text-text-primary">
                    {stat.value.toLocaleString()}
                  </p>
                  <p className="text-[10px] text-text-tertiary font-arabic mt-0.5">
                    {stat.label}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* ── Tab Navigation ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, ease: easeOutExpo }}
          className="px-4 mt-5"
        >
          <div className="relative flex bg-bg-elevated rounded-xl p-1 h-10">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key);
                  if (tab.key !== 'contests') setQuizState(null);
                }}
                className={`relative flex-1 flex items-center justify-center gap-1.5 text-sm font-medium font-arabic rounded-lg transition-colors duration-200 z-10 ${
                  activeTab === tab.key ? 'text-white' : 'text-text-secondary'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
            {/* Animated indicator */}
            <motion.div
              className="absolute top-1 bottom-1 bg-primary-500 rounded-lg z-0"
              layoutId="community-tab-indicator"
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              style={{
                width: `${100 / tabs.length}%`,
                left: `${(tabs.findIndex((t) => t.key === activeTab) * 100) / tabs.length}%`,
              }}
            />
          </div>
        </motion.div>

        {/* ── Tab Content ── */}
        <div className="px-4 mt-4">
          <AnimatePresence mode="wait">
            {activeTab === 'discussions' && (
              <DiscussionsTab
                key="discussions"
                filteredDiscussions={filteredDiscussions}
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
              />
            )}
            {activeTab === 'reviews' && (
              <ReviewsTab
                key="reviews"
                filteredReviews={filteredReviews}
                reviewFilter={reviewFilter}
                setReviewFilter={setReviewFilter}
              />
            )}
            {activeTab === 'contests' && (
              <ContestsTab
                key="contests"
                quizState={quizState}
                onStartQuiz={startQuiz}
                onSelectOption={selectQuizOption}
                onNextQuestion={nextQuestion}
                onExitQuiz={exitQuiz}
              />
            )}
          </AnimatePresence>
        </div>

        {/* ── Badges Section ── */}
        <BadgesSection
          flippedBadge={flippedBadge}
          setFlippedBadge={setFlippedBadge}
        />

        {/* ── Polls Section ── */}
        <PollsSection />
      </div>
    </Layout>
  );
}

/* ================================================================== */
/*  DISCUSSIONS TAB                                                   */
/* ================================================================== */
function DiscussionsTab({
  filteredDiscussions,
  activeCategory,
  setActiveCategory,
}: {
  filteredDiscussions: typeof discussions;
  activeCategory: string;
  setActiveCategory: (c: string) => void;
}) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>('النقاشات العامة');

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3, ease: easeOutExpo }}
    >
      {/* Category filter pills */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-3 -mx-4 px-4">
        {discussionCategories.map((cat) => (
          <motion.button
            key={cat}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveCategory(cat)}
            className={`flex-shrink-0 h-8 px-4 rounded-full text-sm font-medium font-arabic transition-colors ${
              activeCategory === cat
                ? 'bg-primary-500 text-white'
                : 'bg-bg-elevated text-text-secondary border border-border-subtle'
            }`}
          >
            {cat}
          </motion.button>
        ))}
      </div>

      {/* Discord-style channel list */}
      <div className="space-y-2 mb-4">
        {channelCategories.map((cat) => (
          <motion.div
            key={cat.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-bg-card rounded-2xl shadow-card overflow-hidden"
          >
            <button
              onClick={() =>
                setExpandedCategory(expandedCategory === cat.name ? null : cat.name)
              }
              className="w-full flex items-center justify-between px-4 py-3"
            >
              <span className="text-xs font-semibold text-text-secondary font-arabic uppercase tracking-wider">
                {cat.name}
              </span>
              <motion.div
                animate={{ rotate: expandedCategory === cat.name ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="w-4 h-4 text-text-tertiary" />
              </motion.div>
            </button>

            <AnimatePresence>
              {expandedCategory === cat.name && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  {cat.channels.map((ch) => {
                    const Icon = ch.icon;
                    return (
                      <motion.div
                        key={ch.id}
                        whileTap={{ scale: 0.98, backgroundColor: 'var(--primary-50)' }}
                        className="flex items-center gap-3 px-4 py-3 border-t border-border-subtle cursor-pointer transition-colors hover:bg-primary-50/50"
                      >
                        <Icon className="w-5 h-5 text-text-tertiary flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-text-primary truncate">
                            {ch.name}
                          </p>
                          {ch.desc && (
                            <p className="text-xs text-text-secondary truncate">{ch.desc}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <span className="w-1.5 h-1.5 rounded-full bg-success" />
                          <span className="text-[10px] text-text-tertiary font-mono">
                            {ch.count}
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* Discussion cards */}
      <div className="space-y-3 relative">
        {filteredDiscussions.map((post, i) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.4, ease: easeOutExpo }}
            className="bg-bg-card rounded-2xl shadow-card p-4 relative"
          >
            {/* Pinned indicator */}
            {post.pinned && (
              <div className="absolute top-3 left-3">
                <Pin className="w-4 h-4 text-primary-500" />
              </div>
            )}

            {/* Author row */}
            <div className="flex items-center gap-3">
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="w-10 h-10 rounded-full object-cover border border-border-subtle"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="font-semibold text-sm text-text-primary truncate">
                    {post.author.name}
                  </p>
                  {post.author.verified && (
                    <BadgeCheck className="w-4 h-4 text-primary-500 flex-shrink-0" />
                  )}
                </div>
                <p className="text-[11px] text-text-tertiary font-arabic">{post.time}</p>
              </div>
              {post.author.role && (
                <span className="flex-shrink-0 bg-primary-50 text-primary-700 text-[10px] font-bold px-2 py-0.5 rounded-full font-arabic">
                  {post.author.role}
                </span>
              )}
            </div>

            {/* Content */}
            <h3 className="font-bold font-arabic text-base text-text-primary mt-3 leading-snug">
              {post.title}
            </h3>
            <p className="text-sm text-text-secondary mt-1 line-clamp-2 leading-relaxed font-arabic">
              {post.content}
            </p>

            {/* Actions */}
            <div className="flex items-center gap-5 mt-3 pt-3 border-t border-border-subtle">
              <button className="flex items-center gap-1.5 text-text-tertiary text-sm hover:text-primary-500 transition-colors">
                <ThumbsUp className="w-4 h-4" />
                <span className="font-mono text-xs">{post.likes}</span>
              </button>
              <button className="flex items-center gap-1.5 text-text-tertiary text-sm hover:text-primary-500 transition-colors">
                <MessageSquare className="w-4 h-4" />
                <span className="font-mono text-xs">{post.comments}</span>
              </button>
              <button className="flex items-center gap-1.5 text-text-tertiary text-sm mr-auto hover:text-primary-500 transition-colors">
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}

        {/* FAB */}
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4, type: 'spring', stiffness: 300 }}
          whileTap={{ scale: 0.95 }}
          className="fixed bottom-24 left-6 z-40 w-14 h-14 bg-primary-500 text-white rounded-full shadow-button flex items-center justify-center"
        >
          <Plus className="w-6 h-6" />
        </motion.button>
      </div>
    </motion.div>
  );
}

/* ================================================================== */
/*  REVIEWS TAB                                                       */
/* ================================================================== */
function ReviewsTab({
  filteredReviews,
  reviewFilter,
  setReviewFilter,
}: {
  filteredReviews: typeof reviews;
  reviewFilter: ReviewFilter;
  setReviewFilter: (f: ReviewFilter) => void;
}) {
  const filters: ReviewFilter[] = ['الأحدث', 'الأعلى تقييماً', 'موثق فقط'];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3, ease: easeOutExpo }}
    >
      {/* Filter bar */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-3 -mx-4 px-4">
        {filters.map((f) => (
          <motion.button
            key={f}
            whileTap={{ scale: 0.95 }}
            onClick={() => setReviewFilter(f)}
            className={`flex-shrink-0 h-8 px-4 rounded-full text-sm font-medium font-arabic transition-colors ${
              reviewFilter === f
                ? 'bg-primary-500 text-white'
                : 'bg-bg-elevated text-text-secondary border border-border-subtle'
            }`}
          >
            {f}
          </motion.button>
        ))}
      </div>

      {/* Write review button */}
      <motion.button
        whileTap={{ scale: 0.98 }}
        className="w-full h-11 bg-bg-card border border-dashed border-border-subtle rounded-xl text-text-secondary text-sm font-arabic font-medium mb-4 hover:border-primary-500 hover:text-primary-500 transition-colors"
      >
        + كتابة تقييم
      </motion.button>

      {/* Review cards */}
      <div className="space-y-3">
        {filteredReviews.map((review, i) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.4, ease: easeOutExpo }}
            className="bg-bg-card rounded-2xl shadow-card p-4"
          >
            {/* Barber attribution */}
            <div className="flex items-center gap-2 mb-3 pb-3 border-b border-border-subtle">
              <img
                src={review.barberAvatar}
                alt={review.barberName}
                className="w-7 h-7 rounded-full object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-text-primary truncate">
                  {review.barberName}
                </p>
                <p className="text-[10px] text-text-tertiary truncate">{review.shopName}</p>
              </div>
            </div>

            {/* Reviewer row */}
            <div className="flex items-center gap-2">
              <img
                src={review.reviewer.avatar}
                alt={review.reviewer.name}
                className="w-8 h-8 rounded-full object-cover border border-border-subtle"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <p className="font-semibold text-sm text-text-primary">
                    {review.reviewer.name}
                  </p>
                  {review.verified && (
                    <span className="bg-success/10 text-success text-[9px] font-bold px-1.5 py-0.5 rounded font-arabic flex items-center gap-0.5">
                      <Shield className="w-3 h-3" />
                      موثق بالبطاقة
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, si) => (
                  <Star
                    key={si}
                    className={`w-3.5 h-3.5 ${
                      si < review.rating ? 'text-warning fill-warning' : 'text-border-subtle'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Comment */}
            <p className="text-sm text-text-secondary mt-3 leading-relaxed font-arabic">
              {review.comment}
            </p>

            {/* Photos placeholder */}
            {review.photos > 0 && (
              <div className="flex gap-2 mt-3">
                {Array.from({ length: Math.min(review.photos, 3) }).map((_, pi) => (
                  <div
                    key={pi}
                    className="w-16 h-16 rounded-xl bg-bg-elevated flex items-center justify-center"
                  >
                    <Camera className="w-5 h-5 text-text-tertiary" />
                  </div>
                ))}
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-border-subtle">
              <span className="text-[11px] text-text-tertiary font-arabic">{review.time}</span>
              <button className="flex items-center gap-1 text-text-tertiary hover:text-primary-500 transition-colors">
                <ThumbsUp className="w-3.5 h-3.5" />
                <span className="text-[11px] font-mono">{review.helpful}</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

/* ================================================================== */
/*  CONTESTS TAB                                                      */
/* ================================================================== */
function ContestsTab({
  quizState,
  onStartQuiz,
  onSelectOption,
  onNextQuestion,
  onExitQuiz,
}: {
  quizState: QuizState | null;
  onStartQuiz: () => void;
  onSelectOption: (i: number) => void;
  onNextQuestion: () => void;
  onExitQuiz: () => void;
}) {
  // If quiz is active, show quiz interface
  if (quizState) {
    return (
      <QuizInterface
        quizState={quizState}
        onSelectOption={onSelectOption}
        onNextQuestion={onNextQuestion}
        onExitQuiz={onExitQuiz}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3, ease: easeOutExpo }}
      className="space-y-5"
    >
      {/* Active Contest Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5, ease: easeSpring }}
        className="relative rounded-2xl overflow-hidden p-5"
        style={{ background: 'var(--gradient-card)' }}
      >
        <div className="absolute top-3 right-3 bg-warning text-white text-[10px] font-bold px-2 py-1 rounded-md font-arabic">
          مسابقة الأسبوع
        </div>

        <Trophy className="w-10 h-10 text-white/90 mb-3" />
        <h3 className="text-lg font-bold text-white font-arabic leading-snug">
          من يعرف أكثر عن تقنيات الحلاقة؟
        </h3>
        <p className="text-white/80 text-sm font-arabic mt-2">
          شارة &quot;المتفاعل&quot; + 1000 نقطة
        </p>

        {/* Timer */}
        <div className="flex items-center gap-2 mt-3">
          <Clock className="w-4 h-4 text-white/70" />
          <span className="font-mono text-white text-sm">ينتهي في 02:34:15</span>
        </div>

        {/* Participants */}
        <div className="flex items-center gap-2 mt-4">
          <div className="flex -space-x-2">
            {['/barber-portrait-1.jpg', '/barber-portrait-2.jpg', '/barber-portrait-4.jpg'].map(
              (src, i) => (
                <img
                  key={i}
                  src={src}
                  alt=""
                  className="w-7 h-7 rounded-full border-2 border-white object-cover"
                />
              )
            )}
          </div>
          <span className="text-white/80 text-[11px] font-arabic mr-2">+123 مشارك</span>
        </div>

        {/* Join button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onStartQuiz}
          className="mt-4 w-full h-11 bg-white text-primary-500 rounded-xl font-bold font-arabic text-sm"
        >
          شارك الآن
        </motion.button>
      </motion.div>

      {/* Live Leaderboard */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <BarChart3 className="w-5 h-5 text-primary-500" />
          <h3 className="font-bold font-arabic text-text-primary">أفضل المشاركين</h3>
        </div>

        {/* Podium for top 3 */}
        <div className="flex items-end justify-center gap-3 mb-4 h-32">
          {/* #2 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col items-center"
          >
            <img
              src={leaderboard[1].avatar}
              alt={leaderboard[1].name}
              className="w-10 h-10 rounded-full border-2 border-gray-300 object-cover"
            />
            <div className="w-16 h-20 bg-gray-200 rounded-t-lg mt-2 flex flex-col items-center justify-end pb-2">
              <span className="text-lg font-bold font-mono text-gray-500">2</span>
            </div>
          </motion.div>

          {/* #1 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="flex flex-col items-center"
          >
            <Crown className="w-5 h-5 text-warning mb-1" />
            <img
              src={leaderboard[0].avatar}
              alt={leaderboard[0].name}
              className="w-12 h-12 rounded-full border-2 border-warning object-cover"
            />
            <div className="w-20 h-28 bg-warning/20 rounded-t-lg mt-2 flex flex-col items-center justify-end pb-2">
              <span className="text-xl font-bold font-mono text-warning">1</span>
            </div>
          </motion.div>

          {/* #3 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="flex flex-col items-center"
          >
            <img
              src={leaderboard[2].avatar}
              alt={leaderboard[2].name}
              className="w-10 h-10 rounded-full border-2 border-amber-600 object-cover"
            />
            <div className="w-16 h-16 bg-amber-700/10 rounded-t-lg mt-2 flex flex-col items-center justify-end pb-2">
              <span className="text-lg font-bold font-mono text-amber-700">3</span>
            </div>
          </motion.div>
        </div>

        {/* Leaderboard list */}
        <div className="bg-bg-card rounded-2xl shadow-card overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-[40px_1fr_60px_60px] px-4 py-2.5 border-b border-border-subtle text-[11px] font-semibold text-text-tertiary font-arabic">
            <span>#</span>
            <span>اللاعب</span>
            <span className="text-center">النقاط</span>
            <span className="text-center">التتابع</span>
          </div>

          {leaderboard.map((entry, i) => (
            <motion.div
              key={entry.rank}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i }}
              className={`grid grid-cols-[40px_1fr_60px_60px] px-4 py-3 items-center border-b border-border-subtle last:border-0 ${
                entry.rank <= 3 ? 'bg-primary-50/30' : ''
              }`}
            >
              <span
                className={`text-sm font-bold font-mono ${
                  entry.rank === 1
                    ? 'text-warning'
                    : entry.rank === 2
                    ? 'text-gray-400'
                    : entry.rank === 3
                    ? 'text-amber-700'
                    : 'text-text-tertiary'
                }`}
              >
                {entry.rank}
              </span>
              <div className="flex items-center gap-2">
                <img
                  src={entry.avatar}
                  alt={entry.name}
                  className="w-7 h-7 rounded-full object-cover"
                />
                <span className="text-sm font-medium text-text-primary truncate">
                  {entry.name}
                </span>
              </div>
              <span className="text-sm font-mono text-text-primary text-center">
                {entry.score.toLocaleString()}
              </span>
              <div className="flex items-center justify-center gap-1">
                <Flame
                  className={`w-3.5 h-3.5 ${entry.streak >= 5 ? 'text-warning fill-warning' : 'text-text-tertiary'}`}
                />
                <span className="text-xs font-mono text-text-secondary">{entry.streak}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Upcoming contests */}
      <div>
        <h3 className="font-bold font-arabic text-text-primary mb-3">مسابقات قادمة</h3>
        <div className="space-y-2">
          {[
            { title: 'مسابقة تصوير القصات', date: 'السبت القادم', icon: Camera },
            { title: 'تحدي الأسبوع: أسرع حلاق', date: 'الأحد القادم', icon: Zap },
          ].map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="bg-bg-card rounded-xl p-3 shadow-card flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-lg bg-bg-elevated flex items-center justify-center">
                <c.icon className="w-5 h-5 text-text-secondary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-text-primary font-arabic">{c.title}</p>
                <p className="text-[11px] text-text-tertiary font-arabic">{c.date}</p>
              </div>
              <ChevronLeft className="w-4 h-4 text-text-tertiary" />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ================================================================== */
/*  QUIZ INTERFACE                                                    */
/* ================================================================== */
function QuizInterface({
  quizState,
  onSelectOption,
  onNextQuestion,
  onExitQuiz,
}: {
  quizState: QuizState;
  onSelectOption: (i: number) => void;
  onNextQuestion: () => void;
  onExitQuiz: () => void;
}) {
  const timePercent = (quizState.timeLeft / quizQuestion.timeLimit) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-4"
    >
      {/* Quiz header */}
      <div className="flex items-center justify-between">
        <button onClick={onExitQuiz} className="text-text-tertiary text-sm font-arabic">
          خروج
        </button>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Flame
              className={`w-4 h-4 ${quizState.streak >= 3 ? 'text-warning fill-warning' : 'text-text-tertiary'}`}
            />
            <span className="text-sm font-mono text-warning">x{quizState.streak}</span>
          </div>
          <div className="bg-primary-50 px-3 py-1 rounded-lg">
            <span className="text-sm font-mono text-primary-500">
              النقاط: {quizState.score}
            </span>
          </div>
        </div>
      </div>

      {/* Timer bar */}
      <div className="h-1 bg-bg-elevated rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{
            width: `${timePercent}%`,
            backgroundColor: timePercent < 30 ? 'var(--error)' : 'var(--primary-500)',
          }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Question */}
      <div className="bg-bg-card rounded-2xl shadow-card p-6 text-center">
        <h3 className="text-xl font-bold font-arabic text-text-primary leading-relaxed">
          {quizQuestion.question}
        </h3>
      </div>

      {/* Options */}
      <div className="space-y-2.5">
        {quizQuestion.options.map((option, i) => {
          let optionClass =
            'bg-bg-card border border-border-subtle text-text-primary hover:bg-primary-50';

          if (quizState.showResult) {
            if (i === quizQuestion.correctIndex) {
              optionClass = 'bg-success text-white border-success';
            } else if (i === quizState.selectedOption && !quizState.isCorrect) {
              optionClass = 'bg-error text-white border-error';
            } else {
              optionClass = 'bg-bg-card border border-border-subtle text-text-tertiary opacity-60';
            }
          }

          return (
            <motion.button
              key={i}
              whileTap={!quizState.showResult ? { scale: 0.98 } : {}}
              onClick={() => onSelectOption(i)}
              disabled={quizState.showResult}
              className={`w-full h-[52px] rounded-xl text-sm font-medium font-arabic flex items-center justify-between px-4 transition-colors ${optionClass}`}
            >
              <span>{option}</span>
              {quizState.showResult && i === quizQuestion.correctIndex && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                  <CheckCircle2 className="w-5 h-5" />
                </motion.div>
              )}
              {quizState.showResult &&
                i === quizState.selectedOption &&
                !quizState.isCorrect && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                    <XCircle className="w-5 h-5" />
                  </motion.div>
                )}
            </motion.button>
          );
        })}
      </div>

      {/* Result feedback */}
      <AnimatePresence>
        {quizState.showResult && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-center py-2"
          >
            <p
              className={`text-lg font-bold font-arabic ${
                quizState.isCorrect ? 'text-success' : 'text-error'
              }`}
            >
              {quizState.isCorrect ? 'إجابة صحيحة!' : 'إجابة خاطئة'}
            </p>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={onNextQuestion}
              className="mt-3 px-8 h-11 bg-primary-500 text-white rounded-xl font-bold font-arabic text-sm shadow-button"
            >
              السؤال التالي
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ================================================================== */
/*  BADGES SECTION                                                    */
/* ================================================================== */
function BadgesSection({
  flippedBadge,
  setFlippedBadge,
}: {
  flippedBadge: string | null;
  setFlippedBadge: (id: string | null) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: easeOutExpo }}
      className="px-4 mt-8"
    >
      <div className="flex items-center gap-2 mb-4">
        <Award className="w-5 h-5 text-primary-500" />
        <h3 className="font-bold font-arabic text-text-primary text-lg">
          الشارات والإنجازات
        </h3>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {badges.map((badge, i) => {
          const Icon = badgeIconMap[badge.icon];
          const isFlipped = flippedBadge === badge.id;

          return (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.4, ease: easeOutExpo }}
              onClick={() => setFlippedBadge(isFlipped ? null : badge.id)}
              className="relative perspective-[600px]"
            >
              <motion.div
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.4 }}
                className="relative w-full aspect-square"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Front */}
                <div
                  className={`absolute inset-0 rounded-2xl p-3 flex flex-col items-center justify-center text-center backface-hidden ${
                    badge.earned ? 'bg-bg-card shadow-card' : 'bg-bg-card/50 shadow-card'
                  }`}
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <div
                    className={`w-12 h-12 rounded-full ${badge.bgColor} flex items-center justify-center mb-2 relative ${
                      !badge.earned ? 'grayscale opacity-50' : ''
                    }`}
                    style={{
                      border: badge.earned ? `2px solid ${badge.color}` : 'none',
                    }}
                  >
                    <Icon className="w-6 h-6" style={{ color: badge.color }} />
                    {!badge.earned && (
                      <div className="absolute inset-0 rounded-full bg-black/10 flex items-center justify-center">
                        <Lock className="w-4 h-4 text-text-tertiary" />
                      </div>
                    )}
                  </div>
                  <p
                    className={`text-[11px] font-bold font-arabic leading-tight ${
                      badge.earned ? 'text-text-primary' : 'text-text-tertiary'
                    }`}
                  >
                    {badge.name}
                  </p>
                  {badge.earned && badge.earnedDate && (
                    <p className="text-[9px] text-text-tertiary mt-1 font-arabic">
                      {badge.earnedDate}
                    </p>
                  )}
                  {!badge.earned && badge.progress !== undefined && (
                    <div className="w-full mt-2">
                      <div className="h-1 bg-bg-elevated rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{
                            width: `${(badge.progress / badge.maxProgress) * 100}%`,
                          }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, ease: easeOutExpo }}
                          className="h-full bg-primary-500 rounded-full"
                        />
                      </div>
                      <p className="text-[9px] text-text-tertiary font-mono mt-0.5">
                        {badge.progress}/{badge.maxProgress}
                      </p>
                    </div>
                  )}
                </div>

                {/* Back */}
                <div
                  className="absolute inset-0 rounded-2xl p-3 flex flex-col items-center justify-center text-center bg-primary-50 shadow-card"
                  style={{
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                  }}
                >
                  <p className="text-[11px] font-bold text-primary-700 font-arabic leading-tight">
                    {badge.name}
                  </p>
                  <p className="text-[10px] text-text-secondary font-arabic mt-1 leading-relaxed">
                    {badge.description}
                  </p>
                  <p className="text-[9px] text-primary-500 font-arabic mt-1">
                    {badge.requirement}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

/* ================================================================== */
/*  POLLS SECTION                                                     */
/* ================================================================== */
function PollsSection() {
  const [votedPoll, setVotedPoll] = useState<number | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const handleVote = (pollId: number) => {
    if (selectedOption !== null) {
      setVotedPoll(pollId);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: easeOutExpo }}
      className="px-4 mt-8"
    >
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="w-5 h-5 text-primary-500" />
        <h3 className="font-bold font-arabic text-text-primary text-lg">
          استطلاعات الرأي
        </h3>
      </div>

      {polls.map((poll) => {
        const hasVoted = votedPoll === poll.id;
        return (
        <motion.div
          key={poll.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-bg-card rounded-2xl shadow-card p-5"
        >
          <h4 className="font-bold font-arabic text-text-primary mb-4 leading-relaxed">
            {poll.question}
          </h4>

          <div className="space-y-3">
            {poll.options.map((option) => {
              const isSelected = selectedOption === option.id;

              return (
                <motion.button
                  key={option.id}
                  whileTap={!hasVoted ? { scale: 0.98 } : {}}
                  onClick={() => {
                    if (!hasVoted) {
                      setSelectedOption(option.id);
                    }
                  }}
                  className={`w-full text-right relative rounded-xl overflow-hidden transition-colors ${
                    isSelected && !hasVoted
                      ? 'ring-2 ring-primary-500'
                      : ''
                  }`}
                >
                  {/* Progress bar background (shown after vote) */}
                  {hasVoted && (
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${option.percentage}%` }}
                      transition={{ duration: 0.6, ease: easeOutExpo }}
                      className="absolute inset-y-0 left-0 bg-primary-50 rounded-xl"
                    />
                  )}

                  <div className="relative flex items-center justify-between px-4 py-3">
                    <span
                      className={`text-sm font-medium font-arabic ${
                        hasVoted && isSelected ? 'text-primary-700 font-bold' : 'text-text-primary'
                      }`}
                    >
                      {option.label}
                    </span>
                    {hasVoted && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-sm font-mono text-text-secondary"
                      >
                        {option.percentage}%
                      </motion.span>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Vote button */}
          {!hasVoted ? (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => handleVote(poll.id)}
              disabled={selectedOption === null}
              className={`mt-4 w-full h-11 rounded-xl font-bold font-arabic text-sm transition-colors ${
                selectedOption !== null
                  ? 'bg-primary-500 text-white shadow-button'
                  : 'bg-bg-elevated text-text-tertiary'
              }`}
            >
              تصويت
            </motion.button>
          ) : (
            <p className="text-center text-[11px] text-text-tertiary font-arabic mt-3">
              {poll.totalVotes.toLocaleString()} مصوتين
            </p>
          )}
        </motion.div>
      );})}
    </motion.div>
  );
}
