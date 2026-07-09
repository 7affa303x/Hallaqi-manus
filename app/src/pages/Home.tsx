import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, X, Flame, Award, Scissors, Truck,
  Star, Zap, Sparkles, TrendingUp, MapPin, Heart,
  XCircle, RotateCcw, List,
} from 'lucide-react';
import MapView from '@/components/MapView';
import { mockBarbers, mockRecentSearches } from '@/data/mockBarbers';
import { useBookingStore } from '@/store/bookingStore';
import Layout from '@/components/Layout';

// ---- Tag config ----
const tagsConfig = [
  { key: 'متفاعل', icon: Flame },
  { key: 'ذو خبرة', icon: Award },
  { key: 'يستخدم المقص', icon: Scissors },
  { key: 'متنقل', icon: Truck },
  { key: 'محترف', icon: Star },
  { key: 'مبتدئ', icon: Zap },
  { key: 'سريع', icon: Zap },
  { key: 'نظيف', icon: Sparkles },
  { key: 'تقييم عالٍ', icon: TrendingUp },
] as const;

// ---- Filter Sheet Component ----
function FilterSheet({
  isOpen,
  onClose,
  filters,
  onApply,
}: {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onApply: (f: FilterState) => void;
}) {
  const [local, setLocal] = useState(filters);

  useEffect(() => {
    if (isOpen) setLocal(filters);
  }, [isOpen, filters]);

  const radiusOptions = ['1 كم', '3 كم', '5 كم', '10 كم', 'أي مكان'];
  const genderOptions = ['الكل', 'رجال', 'نساء'];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 bg-[rgba(30,28,26,0.55)] z-[60]"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed bottom-0 right-0 left-0 z-[70] flex justify-center"
          >
            <div className="w-full max-w-mobile bg-bg-card rounded-t-3xl max-h-[85dvh] overflow-y-auto">
              {/* Handle */}
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-10 h-1 bg-text-tertiary/40 rounded-full" />
              </div>

              <div className="px-5 pb-8">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-lg font-bold font-arabic">تصفية النتائج</h2>
                  <motion.button whileTap={{ scale: 0.9 }} onClick={onClose}>
                    <X className="w-6 h-6 text-text-tertiary" />
                  </motion.button>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <p className="font-medium font-arabic mb-3">نطاق السعر</p>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min={200}
                      max={5000}
                      step={100}
                      value={local.priceMax}
                      onChange={(e) => setLocal({ ...local, priceMax: Number(e.target.value) })}
                      className="flex-1 accent-primary-500"
                    />
                    <span className="font-mono text-sm min-w-[70px] text-left">{local.priceMax} دج</span>
                  </div>
                </div>

                {/* Radius */}
                <div className="mb-6">
                  <p className="font-medium font-arabic mb-3">نطاق الموقع</p>
                  <div className="flex flex-wrap gap-2">
                    {radiusOptions.map((r) => (
                      <button
                        key={r}
                        onClick={() => setLocal({ ...local, radius: r })}
                        className={`px-4 py-2 rounded-full text-sm transition-colors ${
                          local.radius === r
                            ? 'bg-primary-500 text-white'
                            : 'bg-bg-elevated text-text-secondary'
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Rating */}
                <div className="mb-6">
                  <p className="font-medium font-arabic mb-3">التقييم الأدنى</p>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <motion.button
                        key={star}
                        whileTap={{ scale: 0.8 }}
                        onClick={() => setLocal({ ...local, minRating: star === local.minRating ? 0 : star })}
                        className="p-1"
                      >
                        <Star
                          className={`w-8 h-8 transition-colors ${
                            star <= local.minRating ? 'fill-gold text-gold' : 'text-border-subtle'
                          }`}
                        />
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Availability */}
                <div className="mb-6">
                  <div className="flex items-center justify-between">
                    <p className="font-medium font-arabic">متاح الآن فقط</p>
                    <button
                      onClick={() => setLocal({ ...local, availableOnly: !local.availableOnly })}
                      className={`w-12 h-7 rounded-full transition-colors relative ${
                        local.availableOnly ? 'bg-primary-500' : 'bg-bg-elevated'
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full bg-white shadow-md absolute top-0.5 transition-transform ${
                          local.availableOnly ? 'translate-x-5' : 'translate-x-0.5'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Gender */}
                <div className="mb-6">
                  <p className="font-medium font-arabic mb-3">الجنس</p>
                  <div className="flex gap-2">
                    {genderOptions.map((g) => (
                      <button
                        key={g}
                        onClick={() => setLocal({ ...local, gender: g })}
                        className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                          local.gender === g
                            ? 'bg-primary-500 text-white'
                            : 'bg-bg-elevated text-text-secondary'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    onClick={() => {
                      const reset = { priceMax: 5000, radius: 'أي مكان', minRating: 0, availableOnly: false, gender: 'الكل' };
                      setLocal(reset);
                      onApply(reset);
                    }}
                    className="flex-1 h-14 bg-bg-elevated text-text-secondary rounded-xl font-semibold font-arabic"
                  >
                    <RotateCcw className="w-4 h-4 inline ml-2" />
                    إعادة ضبط
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    onClick={() => onApply(local)}
                    className="flex-1 h-14 bg-primary-500 text-white rounded-xl font-semibold font-arabic shadow-button"
                  >
                    تطبيق
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

interface FilterState {
  priceMax: number;
  radius: string;
  minRating: number;
  availableOnly: boolean;
  gender: string;
}

const defaultFilters: FilterState = {
  priceMax: 5000,
  radius: 'أي مكان',
  minRating: 0,
  availableOnly: false,
  gender: 'الكل',
};

// ---- Main Home Component ----
export default function Home() {
  const navigate = useNavigate();
  const { toggleFavorite, isFavorite } = useBookingStore();

  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  // Filter barbers based on active filters
  const filteredBarbers = mockBarbers.filter((barber) => {
    if (activeTags.length > 0 && !activeTags.some((t) => barber.tags.includes(t))) return false;
    if (barber.priceRange[1] > filters.priceMax) return false;
    if (filters.minRating > 0 && barber.rating < filters.minRating) return false;
    if (filters.availableOnly && !barber.isAvailable) return false;
    if (searchQuery && !barber.name.includes(searchQuery) && !barber.location.includes(searchQuery)) return false;
    return true;
  });

  const toggleTag = (tag: string) => {
    setActiveTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const activeFilterCount =
    (filters.priceMax < 5000 ? 1 : 0) +
    (filters.radius !== 'أي مكان' ? 1 : 0) +
    (filters.minRating > 0 ? 1 : 0) +
    (filters.availableOnly ? 1 : 0) +
    (filters.gender !== 'الكل' ? 1 : 0);

  return (
    <Layout
      showFooter
      navbarProps={{
        showFilter: true,
        onFilterClick: () => setShowFilters(true),
        filterCount: activeFilterCount + activeTags.length,
      }}
    >
      <div className="pb-6">
        {/* ---- Search Bar ---- */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          className="px-4 pt-2"
        >
          <div
            className={`flex items-center gap-3 h-12 bg-bg-elevated rounded-xl px-4 transition-all duration-base ${
              searchFocused ? 'ring-2 ring-primary-500/30' : ''
            }`}
          >
            <Search className="w-5 h-5 text-text-tertiary flex-shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
              placeholder="ابحث عن حلاق بالاسم، المنطقة..."
              className="flex-1 bg-transparent text-body-lg text-text-primary placeholder:text-text-tertiary focus:outline-none font-arabic"
            />
            {searchQuery && (
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                onClick={() => setSearchQuery('')}
              >
                <XCircle className="w-5 h-5 text-text-tertiary" />
              </motion.button>
            )}
          </div>

          {/* Recent Searches */}
          <AnimatePresence>
            {searchFocused && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-2 bg-bg-card rounded-xl shadow-card p-3"
              >
                <p className="text-xs text-text-tertiary mb-2 px-2">عمليات البحث الأخيرة</p>
                <div className="flex flex-wrap gap-2">
                  {mockRecentSearches.map((s, i) => (
                    <motion.button
                      key={s}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      onClick={() => setSearchQuery(s)}
                      className="px-3 py-1.5 bg-bg-elevated rounded-full text-sm text-text-secondary hover:bg-primary-50 transition-colors"
                    >
                      {s}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ---- Smart Tags Row ---- */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-4"
        >
          <div className="flex gap-2 overflow-x-auto hide-scrollbar px-4 pb-2 scroll-snap-x">
            {tagsConfig.map((tag, i) => {
              const isActive = activeTags.includes(tag.key);
              const Icon = tag.icon;
              return (
                <motion.button
                  key={tag.key}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.04, duration: 0.3 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleTag(tag.key)}
                  className={`flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium font-arabic transition-all duration-250 scroll-snap-align-start ${
                    isActive
                      ? 'bg-primary-500 text-white shadow-button'
                      : 'bg-bg-elevated text-text-secondary border border-border-subtle'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tag.key}
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* ---- List / Map Toggle ---- */}
        <div className="px-4 mt-4">
          <div className="flex items-center bg-bg-elevated rounded-xl p-1 h-10">
            <button
              onClick={() => setViewMode('list')}
              className={`flex-1 flex items-center justify-center gap-1.5 h-8 rounded-lg text-sm font-medium font-arabic transition-all ${
                viewMode === 'list'
                  ? 'bg-primary-500 text-white shadow-sm'
                  : 'text-text-secondary'
              }`}
            >
              <List className="w-4 h-4" />
              قائمة
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`flex-1 flex items-center justify-center gap-1.5 h-8 rounded-lg text-sm font-medium font-arabic transition-all ${
                viewMode === 'map'
                  ? 'bg-primary-500 text-white shadow-sm'
                  : 'text-text-secondary'
              }`}
            >
              <MapPin className="w-4 h-4" />
              خريطة
            </button>
          </div>
        </div>

        {/* ---- Map View ---- */}
        <AnimatePresence mode="wait">
          {viewMode === 'map' && (
            <motion.div
              key="map"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="px-4 mt-4"
            >
              <MapView barbers={filteredBarbers} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ---- Barber Cards (List View) ---- */}
        {viewMode === 'list' && (
          <div className="px-4 mt-5 space-y-4">
            <AnimatePresence mode="popLayout">
              {filteredBarbers.map((barber, i) => (
              <motion.div
                key={barber.id}
                layout
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{
                  delay: Math.min(i * 0.08, 0.4),
                  duration: 0.5,
                  ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
                }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(`/barber/${barber.id}`)}
                className="bg-bg-card rounded-2xl shadow-card overflow-hidden cursor-pointer"
              >
                {/* Image Area */}
                <div className={`relative overflow-hidden ${barber.isFeatured ? 'aspect-[18/10]' : 'aspect-[16/10]'}`}>
                  <motion.img
                    src={barber.coverImage}
                    alt={barber.name}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.03 }}
                    transition={{ duration: 0.4 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                  {/* Featured Badge */}
                  {barber.isFeatured && (
                    <div className="absolute top-3 right-3 px-2.5 py-1 bg-warning/90 rounded-full">
                      <span className="text-white text-[10px] font-bold">مميز</span>
                    </div>
                  )}

                  {/* Availability Badge */}
                  {barber.isAvailable && (
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 bg-black/40 backdrop-blur rounded-full">
                      <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                      <span className="text-white text-[10px] font-medium">متاح الآن</span>
                    </div>
                  )}

                  {/* Favorite Button */}
                  <motion.button
                    whileTap={{ scale: 1.3 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(barber.id);
                    }}
                    className="absolute top-3 left-10 w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-sm"
                  >
                    <Heart
                      className={`w-4 h-4 transition-colors ${
                        isFavorite(barber.id) ? 'fill-error text-error' : 'text-text-secondary'
                      }`}
                    />
                  </motion.button>
                </div>

                {/* Content Area */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold font-arabic text-text-primary">{barber.name}</h3>

                  {/* Rating Row */}
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-gold text-gold" />
                      <span className="text-sm font-semibold text-text-secondary">{barber.rating}</span>
                    </div>
                    <span className="text-xs text-text-tertiary">({barber.reviewCount} تقييم)</span>
                  </div>

                  {/* Price Row */}
                  <p className="font-mono font-bold text-primary-500 mt-1">
                    من {barber.priceRange[0]} دج — {barber.priceRange[1]} دج
                  </p>

                  {/* Tags Row */}
                  <div className="flex gap-1.5 mt-2 overflow-x-auto hide-scrollbar">
                    {barber.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="flex-shrink-0 px-2.5 py-1 bg-primary-50 text-primary-700 text-xs font-medium rounded-lg"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-1 mt-2 text-text-tertiary">
                    <MapPin className="w-3.5 h-3.5" />
                    <span className="text-xs">{barber.location}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredBarbers.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center py-16"
            >
              <Search className="w-16 h-16 text-text-tertiary mb-4" />
              <p className="text-text-secondary font-arabic">لا توجد نتائج مطابقة</p>
              <button
                onClick={() => {
                  setActiveTags([]);
                  setFilters(defaultFilters);
                  setSearchQuery('');
                }}
                className="mt-3 text-primary-500 text-sm font-medium"
              >
                إعادة ضبط الفلاتر
              </button>
            </motion.div>
          )}
        </div>
        )}

        {/* ---- Promo Banner (List View Only) ---- */}
        {viewMode === 'list' && (
          <>
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5 }}
              className="mx-4 mt-6 h-[180px] rounded-2xl overflow-hidden relative"
              style={{ background: 'linear-gradient(135deg, #D4463A 0%, #E87A5D 100%)' }}
            >
              <div className="absolute inset-0 flex flex-col items-start justify-center px-6">
                <p className="text-white/80 text-sm font-medium">عرض خاص</p>
                <p className="text-white font-bold font-arabic text-xl mt-1">احصل على 20% خصم على أول حجز!</p>
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  className="mt-4 px-6 py-2 border border-white/60 text-white rounded-lg text-sm font-medium hover:bg-white/10 transition-colors"
                >
                  اطلب الآن
                </motion.button>
              </div>
            </motion.div>

            {/* ---- Future Features ---- */}
            <div className="mt-8">
              <div className="px-4 mb-4">
                <h2 className="text-xl font-bold font-arabic">قريباً في كصيمي</h2>
                <p className="text-sm text-text-secondary mt-0.5">خدمات جديدة ستغير تجربتك</p>
              </div>

              <div className="flex gap-4 overflow-x-auto hide-scrollbar px-4 pb-4 scroll-snap-x">
                {[
                  {
                    title: 'أخصائي بشرة',
                    image: '/skin-specialist.jpg',
                    desc: 'عناية متخصصة لبشرتك',
                  },
                  {
                    title: 'أطباء',
                    image: '/doctor-portrait.jpg',
                    desc: 'استشارات طبية موثوقة',
                  },
                  {
                    title: 'تجميل',
                    image: null,
                    desc: 'خدمات تجميل احترافية',
                    gradient: 'linear-gradient(135deg, #D4463A, #E87A5D)',
                  },
                  {
                    title: 'منتجات العناية',
                    image: null,
                    desc: 'أفضل منتجات العناية بالشعر',
                    gradient: 'linear-gradient(135deg, #2E8B57, #5AC8FA)',
                  },
                ].map((feature, i) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08, duration: 0.4 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex-shrink-0 w-[200px] bg-bg-card rounded-2xl shadow-card overflow-hidden scroll-snap-align-start"
                  >
                    <div className="h-[140px] relative overflow-hidden" style={feature.gradient ? { background: feature.gradient } : undefined}>
                      {feature.image && (
                        <img src={feature.image} alt={feature.title} className="w-full h-full object-cover" />
                      )}
                      <div className="absolute top-2 left-2 px-2 py-1 bg-warning rounded-full">
                        <span className="text-white text-[10px] font-bold">قريباً</span>
                      </div>
                    </div>
                    <div className="p-3">
                      <h3 className="font-bold font-arabic text-sm">{feature.title}</h3>
                      <p className="text-xs text-text-secondary mt-0.5">{feature.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* ---- Filter Sheet ---- */}
      <FilterSheet
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        filters={filters}
        onApply={(f) => {
          setFilters(f);
          setShowFilters(false);
        }}
      />
    </Layout>
  );
}
