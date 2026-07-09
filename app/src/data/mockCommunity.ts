export interface DiscussionAuthor {
  name: string;
  avatar: string;
  verified: boolean;
  role?: string;
}

export interface Discussion {
  id: number;
  author: DiscussionAuthor;
  title: string;
  content: string;
  likes: number;
  comments: number;
  time: string;
  pinned?: boolean;
  category: string;
  images?: number;
}

export interface Review {
  id: number;
  reviewer: DiscussionAuthor;
  barberName: string;
  barberAvatar: string;
  shopName: string;
  rating: number;
  comment: string;
  photos: number;
  helpful: number;
  time: string;
  verified: boolean;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  avatar: string;
  score: number;
  streak: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  requirement: string;
  icon: 'flame' | 'scissors' | 'shield' | 'star' | 'lightning' | 'compass' | 'heart' | 'lightbulb';
  color: string;
  bgColor: string;
  borderColor: string;
  earned: boolean;
  earnedDate?: string;
  progress?: number;
  maxProgress: number;
}

export interface PollOption {
  id: number;
  label: string;
  votes: number;
  percentage: number;
}

export interface Poll {
  id: number;
  question: string;
  options: PollOption[];
  totalVotes: number;
  active: boolean;
}

export interface Channel {
  id: string;
  name: string;
  icon: string;
  description: string;
  activeCount: number;
  unread?: boolean;
  category: string;
}

// Discussion categories
export const discussionCategories = ['عام', 'نصائح', 'تجارب', 'سؤال وجواب'];

// Discussions mock data
export const discussions: Discussion[] = [
  {
    id: 1,
    author: { name: 'كريم حلاق', avatar: '/barber-portrait-2.jpg', verified: true, role: 'حلاق محترف' },
    title: 'نصائح للعناية بالشعر في فصل الصيف',
    content: 'مع ارتفاع درجات الحرارة، من المهم اتباع روتين خاص للعناية بالشعر. استخدموا واقي الشمس وغسلوا الشعر بشكل منتظم بالشامبو المناسب لنوع شعركم.',
    likes: 34,
    comments: 12,
    time: 'منذ ساعتين',
    pinned: true,
    category: 'نصائح',
  },
  {
    id: 2,
    author: { name: 'أمين ب.', avatar: '/barber-portrait-1.jpg', verified: true },
    title: 'أفضل مقص للحلاقة المبتدئين',
    content: 'أنصح كل مبتدئ باقتناء مقص جاغوار أو كاشوكي. الجودة تفرق كثيراً في النتيجة النهائية وفي راحة اليد أثناء العمل.',
    likes: 28,
    comments: 15,
    time: 'منذ 4 ساعات',
    category: 'سؤال وجواب',
  },
  {
    id: 3,
    author: { name: 'ليلى م.', avatar: '/barber-portrait-3.jpg', verified: false },
    title: 'تجربتي الأولى في صالون الرجال',
    content: 'كنت مترددة في البداية لكن تجربتي كانت رائعة! الصالون نظيف والحلاق محترف جداً. أنصح كل السيدات اللي يحبون قص الشعر القصير.',
    likes: 56,
    comments: 23,
    time: 'منذ 6 ساعات',
    category: 'تجارب',
  },
  {
    id: 4,
    author: { name: 'محمد س.', avatar: '/barber-portrait-4.jpg', verified: false },
    title: 'كيف أختار تسريحة تناسب وجهي؟',
    content: 'وجهي بيضاوي الشكل وأحب أغير تسريحتي باستمرار. شنو هي القصات اللي تناسب الوجه البيضاوي؟',
    likes: 18,
    comments: 9,
    time: 'منذ 8 ساعات',
    category: 'سؤال وجواب',
  },
  {
    id: 5,
    author: { name: 'ياسين ع.', avatar: '/barber-portrait-1.jpg', verified: true, role: 'حلاق محترف' },
    title: 'تخفيضات الأسبوع على خدمات العناية',
    content: 'نعلن عن تخفيض 20% على جميع خدمات العناية بالشعر واللحية هذا الأسبوع. احجزوا موعدكم الآن!',
    likes: 42,
    comments: 7,
    time: 'منذ 12 ساعة',
    pinned: true,
    category: 'عام',
  },
];

// Reviews mock data
export const reviews: Review[] = [
  {
    id: 1,
    reviewer: { name: 'كريم ح.', avatar: '/barber-portrait-2.jpg', verified: true },
    barberName: 'عبد الرحمن بن يوسف',
    barberAvatar: '/barber-portrait-1.jpg',
    shopName: 'صالون العمارة',
    rating: 5,
    comment: 'أفضل قصة منذ سنوات! عبد الرحمن محترف جداً ويفهم بالضبط اللي تبيه. الصالون نظيف والخدمة ممتازة.',
    photos: 2,
    helpful: 12,
    time: 'منذ يومين',
    verified: true,
  },
  {
    id: 2,
    reviewer: { name: 'سارة ل.', avatar: '/barber-portrait-3.jpg', verified: true },
    barberName: 'لينا ستايل',
    barberAvatar: '/barber-portrait-3.jpg',
    shopName: 'صالون لينا',
    rating: 5,
    comment: 'نظيف ومحترف جداً. أخذت وقتها في القصة والنتيجة كانت رائعة. أنصح بشدة!',
    photos: 1,
    helpful: 8,
    time: 'منذ 3 أيام',
    verified: true,
  },
  {
    id: 3,
    reviewer: { name: 'محمد أ.', avatar: '/barber-portrait-4.jpg', verified: false },
    barberName: 'ياسين العماري',
    barberAvatar: '/barber-portrait-2.jpg',
    shopName: 'صالون كلاسيك',
    rating: 4,
    comment: 'جيد لكن الانتظار طويل. القصة نفسها ممتازة والحلاق يعرف شنو يدير.',
    photos: 0,
    helpful: 3,
    time: 'منذ 5 أيام',
    verified: false,
  },
  {
    id: 4,
    reviewer: { name: 'أحمد ك.', avatar: '/barber-portrait-1.jpg', verified: true },
    barberName: 'كريم حداد',
    barberAvatar: '/barber-portrait-4.jpg',
    shopName: 'صالون الذهبي',
    rating: 5,
    comment: 'تجربة فاخرة من الألف إلى الياء. الحمام التركي كان رائعاً والقصة مثالية.',
    photos: 3,
    helpful: 15,
    time: 'منذ أسبوع',
    verified: true,
  },
];

// Leaderboard mock data
export const leaderboard: LeaderboardEntry[] = [
  { rank: 1, name: 'كريم ح.', avatar: '/barber-portrait-2.jpg', score: 2450, streak: 12 },
  { rank: 2, name: 'أمين ب.', avatar: '/barber-portrait-1.jpg', score: 2380, streak: 8 },
  { rank: 3, name: 'ياسين ع.', avatar: '/barber-portrait-2.jpg', score: 2210, streak: 15 },
  { rank: 4, name: 'محمد س.', avatar: '/barber-portrait-4.jpg', score: 1890, streak: 5 },
  { rank: 5, name: 'ليلى م.', avatar: '/barber-portrait-3.jpg', score: 1750, streak: 7 },
  { rank: 6, name: 'أحمد ك.', avatar: '/barber-portrait-1.jpg', score: 1620, streak: 3 },
  { rank: 7, name: 'سارة ل.', avatar: '/barber-portrait-3.jpg', score: 1580, streak: 4 },
];

// Badges mock data
export const badges: Badge[] = [
  {
    id: 'active',
    name: 'شارة المتفاعل',
    description: 'شارك في 50 نقاش في المجتمع',
    requirement: '50 تعليق',
    icon: 'flame',
    color: '#D4A017',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-400',
    earned: true,
    earnedDate: '2024-12-15',
    maxProgress: 50,
  },
  {
    id: 'pro',
    name: 'شارة المحترف',
    description: 'أكمل 100 حجز عبر التطبيق',
    requirement: '100 حجز',
    icon: 'scissors',
    color: '#A39D97',
    bgColor: 'bg-gray-100',
    borderColor: 'border-gray-400',
    earned: true,
    earnedDate: '2024-11-20',
    maxProgress: 100,
  },
  {
    id: 'verified',
    name: 'شارة الموثق',
    description: 'قم بتوثيق حسابك بالبطاقة التعريفية',
    requirement: 'توثيق البطاقة',
    icon: 'shield',
    color: '#3B82F6',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-400',
    earned: true,
    earnedDate: '2024-10-05',
    maxProgress: 1,
  },
  {
    id: 'popular',
    name: 'شارة الأكثر زيارة',
    description: 'قم بزيارة نفس الحلاق 20 مرة',
    requirement: '20 زيارة',
    icon: 'star',
    color: '#B87333',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-400',
    earned: false,
    progress: 14,
    maxProgress: 20,
  },
  {
    id: 'streak',
    name: 'شارة التتابع',
    description: 'احجز 7 أيام متتالية',
    requirement: '7 أيام متتالية',
    icon: 'lightning',
    color: '#2E8B57',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-400',
    earned: false,
    progress: 4,
    maxProgress: 7,
  },
  {
    id: 'explorer',
    name: 'شارة المستكشف',
    description: 'زر 10 حلاقين مختلفين',
    requirement: '10 حلاقين',
    icon: 'compass',
    color: '#8B5CF6',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-400',
    earned: false,
    progress: 6,
    maxProgress: 10,
  },
];

// Polls mock data
export const polls = [
  {
    id: 1,
    question: 'أي قصة شعر هي الأكثر رواجاً هذا الموسم؟',
    options: [
      { id: 1, label: 'القصة الفرنسية', votes: 156, percentage: 42 },
      { id: 2, label: 'البuzz كت', votes: 98, percentage: 26 },
      { id: 3, label: 'التكستشر كروب', votes: 76, percentage: 20 },
      { id: 4, label: 'السايد بارت', votes: 44, percentage: 12 },
    ],
    totalVotes: 374,
    active: true,
  },
];

// Contest quiz mock data
export const quizQuestion = {
  question: 'ما هي أداة الحلاقة التقليدية الجزائرية؟',
  options: ['المقص المغربي', 'الشفرة التقليدية', 'الموس اليدوي', 'الماكينة الكهربائية'],
  correctIndex: 2,
  timeLimit: 15,
};

// Stats
export const communityStats = {
  members: 1247,
  activeTopics: 89,
  contests: 3,
};
