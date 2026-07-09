import { useState, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import {
  ChevronLeft,
  Heart,
  Share2,
  Star,
  MapPin,
  Clock,
  Check,
  X,
  ChevronRight,
  Verified,
  QrCode,
} from 'lucide-react';
import { mockBarbers } from '@/data/mockBarbers';
import { useBookingStore } from '@/store/bookingStore';
import type { Service } from '@/store/bookingStore';

type TabType = 'services' | 'gallery' | 'reviews';

const easeOutExpo = [0.16, 1, 0.3, 1] as [number, number, number, number];
const easeSpring = [0.32, 0.72, 0, 1] as [number, number, number, number];

const arabicTabLabels: Record<TabType, string> = {
  services: 'الخدمات',
  gallery: 'المعرض',
  reviews: 'التقييمات',
};

const mockReviews = [
  {
    id: 'r1',
    name: 'أحمد كريم',
    avatar: '/barber-portrait-1.jpg',
    rating: 5,
    date: 'منذ 3 أيام',
    text: 'أفضل حلاق في المنطقة! دائماً دقيق ومحترف. القصة طلعت exactly كما كنت أبي. أنصح به بشدة.',
    verified: true,
  },
  {
    id: 'r2',
    name: 'كريم الحسين',
    avatar: '/barber-portrait-2.jpg',
    rating: 4,
    date: 'منذ أسبوع',
    text: 'خدمة ممتازة والأسعار مناسبة. الصالون نظيف ومرتب. أتمنى لو كان المواعيد أسرع شوي.',
    verified: false,
  },
  {
    id: 'r3',
    name: 'سارة بوعلام',
    avatar: '/barber-portrait-4.jpg',
    rating: 5,
    date: 'منذ أسبوعين',
    text: 'نظيف جداً والأدوات معقمة. تجربة رائعة! أخوي كان مرهون من الحلاقة وطلع فالخفاش 😄',
    verified: true,
  },
  {
    id: 'r4',
    name: 'ياسين العمري',
    avatar: '/barber-portrait-1.jpg',
    rating: 5,
    date: 'منذ شهر',
    text: 'محترف جداً ويتعامل مع الزبائن بأحسن طريقة. القصات العصرية عنده ممتازة.',
    verified: true,
  },
];

const ratingBreakdown = [
  { stars: 5, count: 89 },
  { stars: 4, count: 24 },
  { stars: 3, count: 7 },
  { stars: 2, count: 3 },
  { stars: 1, count: 1 },
];

export default function BarberDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { setBarber, toggleFavorite, isFavorite } = useBookingStore();
  const barber = mockBarbers.find((b) => b.id === id);

  const [activeTab, setActiveTab] = useState<TabType>('services');
  const [selectedServices, setSelectedServices] = useState<Set<string>>(new Set());
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [tabsSticky, setTabsSticky] = useState(false);
  const [bioExpanded, setBioExpanded] = useState(false);

  const heroRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);

  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 400], [0, 200]);
  const heroScale = useTransform(scrollY, [0, 300], [1, 1.05]);

  useMotionValueEvent(scrollY, 'change', () => {
    if (tabsRef.current) {
      const tabsTop = tabsRef.current.getBoundingClientRect().top;
      setTabsSticky(tabsTop <= 56);
    }
  });

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

  const openLightbox = (image: string, index: number) => {
    setLightboxImage(image);
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxImage(null);
  };

  const navigateLightbox = (dir: number) => {
    if (!barber?.gallery) return;
    const newIndex = (lightboxIndex + dir + barber.gallery.length) % barber.gallery.length;
    setLightboxIndex(newIndex);
    setLightboxImage(barber.gallery[newIndex]);
  };

  const getSelectedServicesTotal = () => {
    if (!barber?.services) return { total: 0, count: 0 };
    const selected = barber.services.filter((s) => selectedServices.has(s.id));
    return {
      total: selected.reduce((sum, s) => sum + s.price, 0),
      count: selected.length,
    };
  };

  const handleBook = () => {
    if (!barber) return;
    setBarber(barber);
    navigate('/booking');
  };

  if (!barber) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[100dvh] px-4">
        <p className="text-text-secondary font-arabic">لم يتم العثور على الحلاق</p>
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => navigate('/')}
          className="mt-4 px-6 py-3 bg-primary-500 text-white rounded-xl font-semibold font-arabic"
        >
          العودة للرئيسية
        </motion.button>
      </div>
    );
  }

  const fav = isFavorite(barber.id);
  const { total: selectedTotal, count: selectedCount } = getSelectedServicesTotal();

  const galleryImages = barber.gallery && barber.gallery.length > 0
    ? barber.gallery
    : ['/barber-gallery-1.jpg', '/barber-gallery-2.jpg', '/barber-gallery-3.jpg'];

  // Duplicate gallery images to fill a nice masonry-like grid
  const fullGallery = [...galleryImages, ...galleryImages, ...galleryImages];

  return (
    <div className="relative bg-bg-base min-h-[100dvh]">
      {/* ===== HERO SECTION ===== */}
      <div ref={heroRef} className="relative h-[320px] overflow-hidden">
        <motion.div
          style={{ y: heroY, scale: heroScale }}
          className="absolute inset-0"
        >
          <img
            src={barber.coverImage}
            alt={barber.name}
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{ background: 'var(--gradient-hero)' }}
        />

        {/* Top buttons */}
        <div className="absolute top-4 right-4 left-4 flex items-center justify-between z-10">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center"
          >
            <ChevronLeft className="w-5 h-5 text-white rtl-flip" />
          </motion.button>

          <div className="flex items-center gap-2">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate(`/qr/${barber.id}`)}
              className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center"
            >
              <QrCode className="w-5 h-5 text-white" />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => {/* share */}}
              className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center"
            >
              <Share2 className="w-5 h-5 text-white" />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => toggleFavorite(barber.id)}
              className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center"
            >
              <Heart
                className={`w-5 h-5 transition-colors ${fav ? 'fill-red-500 text-red-500' : 'text-white'}`}
              />
            </motion.button>
          </div>
        </div>

        {/* Barber name overlay on gradient */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: easeOutExpo }}
          className="absolute bottom-6 right-5 left-5"
        >
          <h1 className="text-2xl font-extrabold text-white font-arabic leading-tight">
            {barber.name}
          </h1>
          <p className="text-white/70 text-sm mt-1 font-arabic">
            حلاق محترف · {barber.services?.length ?? 0} خدمات
          </p>
        </motion.div>
      </div>

      {/* ===== INFO CARD ===== */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: easeSpring, delay: 0.1 }}
        className="relative -mt-10 mx-0 bg-bg-card rounded-t-3xl px-5 pt-6 pb-5"
      >
        {/* Avatar overlapping */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.3 }}
          className="absolute -top-10 left-5"
        >
          <div className="w-[80px] h-[80px] rounded-full border-[3px] border-primary-500 overflow-hidden bg-bg-elevated">
            <img
              src={barber.avatar}
              alt={barber.name}
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>

        {/* Name + Rating */}
        <div className="pr-0 pl-24">
          <div className="flex items-center gap-2">
            <h2 className="text-[22px] font-bold text-text-primary font-arabic leading-tight">
              {barber.name}
            </h2>
            <Verified className="w-4 h-4 text-blue-500 flex-shrink-0" />
          </div>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i <= Math.round(barber.rating)
                      ? 'fill-gold text-gold'
                      : 'fill-none text-text-tertiary'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-semibold text-text-secondary">{barber.rating}</span>
            <span className="text-xs text-text-tertiary">({barber.reviewCount} تقييم)</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex gap-2 mt-4 overflow-x-auto hide-scrollbar pb-1">
          {barber.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="px-3 py-1.5 bg-primary-50 text-primary-700 text-xs font-medium rounded-lg whitespace-nowrap font-arabic"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="flex items-center justify-around border-t border-border-subtle mt-4 pt-4"
        >
          <div className="text-center">
            <p className="text-lg font-bold text-primary-500 font-display">{barber.reviewCount}</p>
            <p className="text-xs text-text-tertiary font-arabic">عميل</p>
          </div>
          <div className="w-px h-8 bg-border-subtle" />
          <div className="text-center">
            <p className="text-lg font-bold text-text-primary font-display">5+</p>
            <p className="text-xs text-text-tertiary font-arabic">سنوات خبرة</p>
          </div>
          <div className="w-px h-8 bg-border-subtle" />
          <div className="text-center">
            <p className="text-lg font-bold text-success font-display">98%</p>
            <p className="text-xs text-text-tertiary font-arabic">رضا</p>
          </div>
        </motion.div>

        {/* Bio */}
        <div className="mt-4">
          <p
            className={`text-body text-text-secondary leading-relaxed font-arabic ${
              !bioExpanded ? 'line-clamp-3' : ''
            }`}
          >
            {barber.about}
          </p>
          {barber.about && barber.about.length > 120 && (
            <button
              onClick={() => setBioExpanded(!bioExpanded)}
              className="text-primary-500 text-sm font-medium mt-1 font-arabic"
            >
              {bioExpanded ? 'إخفاء' : 'اقرأ المزيد'}
            </button>
          )}
        </div>

        {/* Location */}
        <div className="mt-4 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-text-tertiary flex-shrink-0" />
          <span className="text-sm text-text-secondary font-arabic">{barber.location}</span>
        </div>
      </motion.div>

      {/* ===== TAB NAVIGATION ===== */}
      <div
        ref={tabsRef}
        className={`sticky top-[56px] z-40 bg-bg-card border-b border-border-subtle transition-shadow duration-300 ${
          tabsSticky ? 'shadow-card' : ''
        }`}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: easeOutExpo, delay: 0.5 }}
          className="flex items-center justify-around h-12 relative"
        >
          {(['services', 'gallery', 'reviews'] as TabType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative flex-1 h-full flex items-center justify-center text-sm font-semibold font-arabic transition-colors duration-300 ${
                activeTab === tab ? 'text-primary-500' : 'text-text-secondary'
              }`}
            >
              {arabicTabLabels[tab]}
              {activeTab === tab && (
                <motion.div
                  layoutId="tab-indicator"
                  className="absolute bottom-0 right-0 left-0 h-0.5 bg-primary-500"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
            </button>
          ))}
        </motion.div>
      </div>

      {/* ===== TAB CONTENT ===== */}
      <div className="pb-28 px-4 pt-4">
        <AnimatePresence mode="wait">
          {activeTab === 'services' && (
            <ServicesTab
              key="services"
              services={barber.services ?? []}
              selectedServices={selectedServices}
              onToggleService={toggleService}
            />
          )}
          {activeTab === 'gallery' && (
            <GalleryTab
              key="gallery"
              images={fullGallery}
              onImageTap={openLightbox}
            />
          )}
          {activeTab === 'reviews' && (
            <ReviewsTab key="reviews" />
          )}
        </AnimatePresence>
      </div>

      {/* ===== STICKY BOOKING BUTTON ===== */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: easeSpring, delay: 0.8 }}
        className="fixed bottom-20 right-0 left-0 z-40 flex justify-center px-4"
      >
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={handleBook}
          className={`w-full max-w-mobile h-14 rounded-2xl font-bold text-white font-arabic text-base flex items-center justify-center gap-2 shadow-button transition-all duration-300 ${
            selectedCount > 0
              ? 'bg-gradient-to-r from-[#D4463A] to-[#E87A5D]'
              : 'bg-primary-500'
          }`}
        >
          {selectedCount > 0 ? (
            <>
              <span>احجز الآن</span>
              <span className="font-display font-bold">— {selectedTotal} دج</span>
            </>
          ) : (
            <span>احجز موعداً</span>
          )}
        </motion.button>
      </motion.div>

      {/* ===== LIGHTBOX ===== */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center"
            onClick={closeLightbox}
          >
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={closeLightbox}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center z-10"
            >
              <X className="w-5 h-5 text-white" />
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={(e) => { e.stopPropagation(); navigateLightbox(-1); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center z-10"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={(e) => { e.stopPropagation(); navigateLightbox(1); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center z-10"
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </motion.button>

            <motion.img
              key={lightboxImage}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              src={lightboxImage}
              alt=""
              className="max-w-full max-h-[80vh] object-contain"
              onClick={(e) => e.stopPropagation()}
            />

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/60 text-sm font-mono">
              {lightboxIndex + 1} / {galleryImages.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ===== SERVICES TAB ===== */
function ServicesTab({
  services,
  selectedServices,
  onToggleService,
}: {
  services: Service[];
  selectedServices: Set<string>;
  onToggleService: (id: string) => void;
}) {
  if (services.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="py-12 text-center"
      >
        <p className="text-text-secondary font-arabic">لا توجد خدمات متاحة</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-0"
    >
      {services.map((service, index) => {
        const isSelected = selectedServices.has(service.id);
        return (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: easeOutExpo, delay: index * 0.05 }}
            onClick={() => onToggleService(service.id)}
            className={`flex items-center justify-between py-4 border-b border-border-subtle cursor-pointer transition-colors duration-200 ${
              isSelected ? 'bg-primary-50 -mx-4 px-4' : ''
            }`}
          >
            <div className="flex-1">
              <h3 className="text-[18px] font-semibold text-text-primary font-arabic">
                {service.name}
              </h3>
              {service.description && (
                <p className="text-sm text-text-secondary mt-0.5 font-arabic">
                  {service.description}
                </p>
              )}
              <div className="flex items-center gap-1 mt-1.5">
                <Clock className="w-3.5 h-3.5 text-text-tertiary" />
                <span className="text-xs text-text-tertiary font-arabic">
                  {service.duration} دقيقة
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-display font-bold text-lg text-primary-500">
                {service.price} دج
              </span>
              <AnimatePresence>
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className="w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center"
                  >
                    <Check className="w-4 h-4 text-white" strokeWidth={3} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}

/* ===== GALLERY TAB ===== */
function GalleryTab({
  images,
  onImageTap,
}: {
  images: string[];
  onImageTap: (image: string, index: number) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="columns-3 gap-1"
    >
      {images.map((img, index) => (
        <motion.div
          key={`${img}-${index}`}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: index * 0.04 }}
          className="mb-1 break-inside-avoid"
        >
          <motion.img
            whileTap={{ scale: 0.95 }}
            src={img}
            alt={`صورة ${index + 1}`}
            className="w-full rounded object-cover aspect-square"
            onClick={() => onImageTap(img, index % 3)}
            loading="lazy"
          />
        </motion.div>
      ))}
    </motion.div>
  );
}

/* ===== REVIEWS TAB ===== */
function ReviewsTab() {
  const totalReviews = mockReviews.length;
  const avgRating = (mockReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      {/* Overall Rating */}
      <div className="bg-bg-card rounded-2xl p-5 shadow-card">
        <div className="flex items-center gap-4">
          <div className="text-center">
            <p className="text-[32px] font-bold text-text-primary font-display leading-none">
              {avgRating}
            </p>
            <div className="flex items-center gap-0.5 mt-1 justify-center">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i <= Math.round(Number(avgRating)) ? 'fill-gold text-gold' : 'text-text-tertiary'
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-text-tertiary mt-1 font-arabic">{totalReviews} تقييم</p>
          </div>

          <div className="flex-1 space-y-1.5">
            {ratingBreakdown.map((item) => (
              <div key={item.stars} className="flex items-center gap-2">
                <span className="text-xs text-text-secondary w-3">{item.stars}</span>
                <div className="flex-1 h-2 bg-bg-elevated rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${(item.count / ratingBreakdown[0].count) * 100}%`,
                    }}
                    transition={{ duration: 0.6, ease: easeOutExpo, delay: item.stars * 0.1 }}
                    className="h-full bg-gold rounded-full"
                  />
                </div>
                <span className="text-[10px] text-text-tertiary w-6 text-left">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Review Cards */}
      {mockReviews.map((review, index) => (
        <motion.div
          key={review.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: easeOutExpo, delay: index * 0.06 }}
          className="bg-bg-card rounded-2xl p-4 shadow-card"
        >
          <div className="flex items-start gap-3">
            <img
              src={review.avatar}
              alt={review.name}
              className="w-10 h-10 rounded-full object-cover flex-shrink-0"
            />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-text-primary font-arabic">
                    {review.name}
                  </span>
                  {review.verified && (
                    <span className="px-2 py-0.5 bg-success/10 text-success text-[10px] font-medium rounded-full font-arabic">
                      حجز موثق
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-text-tertiary font-arabic">{review.date}</span>
              </div>
              <div className="flex items-center gap-0.5 mt-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 ${
                      i <= review.rating ? 'fill-gold text-gold' : 'text-text-tertiary'
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm text-text-secondary mt-2 leading-relaxed font-arabic">
                {review.text}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
