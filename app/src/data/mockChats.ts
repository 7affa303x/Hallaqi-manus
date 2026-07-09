export type MessageStatus = 'sent' | 'delivered' | 'read';

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'barber';
  time: string;
  status?: MessageStatus;
  type?: 'text' | 'image' | 'appointment';
}

export interface ChatConversation {
  id: string;
  barberId: string;
  barberName: string;
  barberAvatar: string;
  isOnline: boolean;
  lastSeen?: string;
  appointmentContext?: {
    date: string;
    time: string;
    service: string;
    price: number;
  };
  messages: ChatMessage[];
}

export const mockConversations: ChatConversation[] = [
  {
    id: 'conv-1',
    barberId: '1',
    barberName: 'عبد الرحمن بن يوسف',
    barberAvatar: '/barber-portrait-1.jpg',
    isOnline: true,
    appointmentContext: {
      date: 'السبت 15 جوان',
      time: '10:30',
      service: 'قص + لحية',
      price: 700,
    },
    messages: [
      {
        id: 'm1',
        text: 'مرحباً! شكراً لحجزك معي. هل لديك أي تفضيلات خاصة للقصة؟',
        sender: 'barber',
        time: '10:15',
        status: 'read',
      },
      {
        id: 'm2',
        text: 'مرحباً! أريد فيد نظيف مع خطوط حادة من الجانبين.',
        sender: 'user',
        time: '10:16',
        status: 'read',
      },
      {
        id: 'm3',
        text: 'ممتاز! سأجهز كل شيء. هل تفضل الغسيل أيضاً؟',
        sender: 'barber',
        time: '10:17',
        status: 'read',
      },
      {
        id: 'm4',
        text: 'نعم من فضلك.',
        sender: 'user',
        time: '10:17',
        status: 'read',
      },
      {
        id: 'm5',
        text: 'تمام! راح نضيف لك غسيل بالشامبو والبلسم. نشوفك السبت إن شاء الله.',
        sender: 'barber',
        time: '10:18',
        status: 'read',
      },
      {
        id: 'm6',
        text: 'شكراً! هل يمكنك إرسالي عنوان الصالون بالتفصيل؟',
        sender: 'user',
        time: '10:20',
        status: 'read',
      },
      {
        id: 'm7',
        text: 'بالتأكيد! صالوني في حيدرة، شارع العربي بن مهيدي، قرب مسجد النور. في الطابق الأرضي، محل رقم 05.',
        sender: 'barber',
        time: '10:21',
        status: 'read',
      },
      {
        id: 'm8',
        text: 'ممتاز، شكراً جزيلاً! نشوفك السبت.',
        sender: 'user',
        time: '10:22',
        status: 'read',
      },
      {
        id: 'm9',
        text: 'على الرحب والسعة! إذا عندك أي استفسار لا تتردد في التواصل.',
        sender: 'barber',
        time: '10:23',
        status: 'read',
      },
      {
        id: 'm10',
        text: 'مرحباً، هل يمكنني تأجيل موعدي لنفس اليوم لكن الساعة 12:00؟',
        sender: 'user',
        time: '09:30',
        status: 'read',
      },
      {
        id: 'm11',
        text: 'مرحباً! للأسف الساعة 12:00 محجوزة. عندي متاح 11:30 أو 13:00. وش تفضل؟',
        sender: 'barber',
        time: '09:35',
        status: 'read',
      },
    ],
  },
  {
    id: 'conv-2',
    barberId: '2',
    barberName: 'ياسين العماري',
    barberAvatar: '/barber-portrait-2.jpg',
    isOnline: false,
    lastSeen: 'منذ 20 دقيقة',
    appointmentContext: {
      date: 'الأحد 16 جوان',
      time: '14:00',
      service: 'قص الشعر',
      price: 400,
    },
    messages: [
      {
        id: 'm1',
        text: 'مرحباً ياسين! وصلت للصالون، هل أنت متوفر؟',
        sender: 'user',
        time: '13:55',
        status: 'read',
      },
      {
        id: 'm2',
        text: 'مرحباً! نعم أنا هنا، تفضل بالدخول.',
        sender: 'barber',
        time: '13:56',
        status: 'read',
      },
      {
        id: 'm3',
        text: 'القصة ممتازة شكراً! سأرشحك لأصدقائي.',
        sender: 'user',
        time: '14:45',
        status: 'read',
      },
      {
        id: 'm4',
        text: 'شكراً جزيلاً على ثقتك! نتطلع لزيارتك القادمة.',
        sender: 'barber',
        time: '14:50',
        status: 'read',
      },
    ],
  },
  {
    id: 'conv-3',
    barberId: '3',
    barberName: 'كريم حداد',
    barberAvatar: '/barber-portrait-4.jpg',
    isOnline: true,
    messages: [
      {
        id: 'm1',
        text: 'مرحباً كريم! هل تقدم خدمة منزلية في منطقة الأبيار؟',
        sender: 'user',
        time: '11:00',
        status: 'read',
      },
      {
        id: 'm2',
        text: 'نعم، أقدم خدمة منزلية في جميع أنحاء الجزائر العاصمة. المنطقة قريبة عليّ.',
        sender: 'barber',
        time: '11:05',
        status: 'read',
      },
      {
        id: 'm3',
        text: 'رائع! ما هي الخدمات المتوفرة في البيت؟',
        sender: 'user',
        time: '11:06',
        status: 'read',
      },
      {
        id: 'm4',
        text: 'أقدم قص الشعر، تحديد اللحية، والعناية الكاملة. أجي بكل المعدات اللازمة.',
        sender: 'barber',
        time: '11:08',
        status: 'read',
      },
    ],
  },
];

export const quickReplies = [
  'هل أنت متوفر؟',
  'سأتأخر قليلاً',
  'شكراً!',
  'تمام',
  'نعم',
  'لا',
];
