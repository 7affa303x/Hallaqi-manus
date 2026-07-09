# Hallaqi — خطة تنفيذ شاملة

## نظرة عامة
منصة جزائرية متكاملة لحجز الحلاقين والمختصين، بتصميم مبتكر وnavigation مخصص، مع نظام tags ذكي، منتدى اجتماعي، مسابقات، توثيق بالبطاقة، ونظام مدفوعات CCP/Baridi Mob.

## المراحل التنفيذية

### المرحلة 1: التصميم والهوية البصرية (Design System)
- **المهارات**: vibecoding-webapp-swarm
- **المهام**:
  - Design System شامل (colors, typography, spacing, components)
  - 5+ Themes (Classic, Modern, Digital, Red, Blue, Gradient)
  - Animation System (3 أنماط: Simple, Modern, Digital)
  - Bottom Navigation مخصص (5 tabs: Booking, Appointments, Camera/AI, Community, Profile)
  - Icons Library مخصصة
  - Screens: Splash, Onboarding, Home, Search, Barber Profile, Booking Flow, Chat, Forum, Q&A, Profile, Auth, Subscription
  - Image Assets Generation (Hero images, avatars, illustrations)

### المرحلة 2: البنية التحتية (Infrastructure)
- **المهارات**: vibecoding-webapp-swarm, supabase
- **المهام**:
  - Supabase Project Setup
  - Database Schema (30+ جدول)
  - Row Level Security (RLS)
  - Storage Buckets
  - Edge Functions
  - Authentication (Phone OTP, Email, Google)

### المرحلة 3: التطوير (Development)
- **المهارات**: vibecoding-webapp-swarm
- **المهام**:
  - Frontend: React + TypeScript + Tailwind + shadcn/ui
  - Bottom Navigation مخصص مع Camera Tab
  - Booking System مع Tags
  - Appointments & Chat
  - Community Forum (Discord-style + Reviews)
  - Q&A Competition System
  - Profile & Verification (ID Card)
  - Subscription Plans (CCP, Baridi Mob placeholders)
  - Theme Switcher
  - Animation System
  - AI Camera placeholder
  - Push Notifications placeholder

### المرحلة 4: المحتوى والأصول (Content & Assets)
- **المهارات**: generate_image
- **المهام**:
  - Barber shop illustrations
  - Hero images
  - Avatar placeholders
  - Badge icons
  - Theme backgrounds

### المرحلة 5: المراجعة والمعاينة (Review & Preview)
- **المهارات**: deploy_website
- **المهام**:
  - Build optimization
  - Deploy to production
  - Preview delivery

## الهيكل التقني
- **Frontend**: React 19 + TypeScript + Tailwind CSS + shadcn/ui + Framer Motion
- **Backend**: Supabase (PostgreSQL + Auth + Storage + Edge Functions)
- **State**: Zustand + React Query
- **Routing**: React Router v7
- **Animations**: Framer Motion + GSAP
- **Icons**: Lucide React + Custom SVG
- **Maps**: Mapbox (placeholder)
- **Payments**: CCP & Baridi Mob (placeholders)
- **AI**: Camera placeholder for future AI features
- **Push**: Firebase Cloud Messaging (placeholder)

## المميزات الرئيسية
1. **Bottom Navigation مخصص**: 5 تبويبات (حجز، مواعيد، كاميرا/AI، مجتمع، بروفايل)
2. **Tags System**: متفاعل، قديم، يستخدم المقص، متنقل، محترف، مبتدئ،...
3. **Forum**: نقاشات عامة + تعليقات موثقة + مسابقات أسئلة
4. **Verification**: توثيق بالبطاقة التعريفية
5. **Subscription**: خطط مجانية/مدفوعة (CCP، Baridi Mob)
6. **Themes**: 5+ ثيمات قابلة للتبديل
7. **Animations**: 3 أنماط حركية
8. **AI Camera**: مستقبلي (placeholder)
9. **Chat**: تواصل بين الحلاقين والعملاء
10. **Notifications**: نظام إشعارات شامل

## ملاحظات مهمة
- كل ميزة مستقبلية لها placeholder واضح
- التصميم أولاً، ثم التطوير
- استخدام أفضل التقنيات المتاحة
- الكود نظيف ومنظم وقابل للتوسع
