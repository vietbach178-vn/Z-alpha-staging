/**
 * Sample data for the News page. Same swap-out pattern as research-sample.ts:
 * when the CMS is wired in, replace these exports with `fetchQuery(...)` of
 * matching shape. Page code stays the same.
 */

import type { Lang } from '@/lib/i18n';

export type NewsCategory = 'announcement' | 'press' | 'event' | 'article';

export interface NewsCategoryItem {
  id: NewsCategory;
  label: Record<Lang, string>;
  tone: 'teal' | 'blue' | 'orange' | 'red' | 'purple';
}

export interface NewsItem {
  id: string;
  slug: string;
  category: NewsCategory;
  title: Record<Lang, string>;
  excerpt: Record<Lang, string>;
  publishedAt: string;
  source?: string;            // shown under date when present (e.g. "Báo Tuổi Trẻ")
  externalUrl?: string;       // if set, card links out instead of to detail page
  imageUrl?: string;
}

export const NEWS_CATEGORIES: NewsCategoryItem[] = [
  { id: 'announcement', label: { vi: 'Thông báo',         en: 'Announcements' },  tone: 'blue' },
  { id: 'press',        label: { vi: 'Thông cáo báo chí', en: 'Press releases' }, tone: 'orange' },
  { id: 'event',        label: { vi: 'Sự kiện',           en: 'Events' },         tone: 'teal' },
  { id: 'article',      label: { vi: 'Bài viết',          en: 'Articles' },       tone: 'purple' },
];

const img = (seed: string) => `https://picsum.photos/seed/news-${seed}/800/450`;

export const NEWS_ITEMS: NewsItem[] = [
  {
    id: 'silent-conversations-2026-03',
    slug: 'cuoc-tro-chuyen-mot-nguoi-lang-nghe',
    category: 'article',
    title: {
      vi: 'Có những cuộc trò chuyện… mà chỉ một người lắng nghe',
      en: 'Some conversations… where only one person listens',
    },
    excerpt: {
      vi: 'Đã bao giờ bạn hào hứng kể một câu chuyện thật hay cho hội bạn, để rồi nhận lại chỉ là tiếng "tạch tạch" gõ phím hay cái gật đầu vô thức?',
      en: 'Ever told a great story to friends only to be met with the click-clack of keyboards or absent nods?',
    },
    publishedAt: '2026-03-20',
    imageUrl: img('conversation'),
  },
  {
    id: 'press-release-2026-01',
    slug: 'thong-cao-bao-chi-mang-xa-hoi-suc-khoe-tam-than-2026',
    category: 'press',
    title: {
      vi: 'Thông cáo báo chí: Mạng xã hội và sức khỏe tâm thần của thanh thiếu niên Việt Nam',
      en: 'Press release: Social media and the mental health of Vietnamese adolescents',
    },
    excerpt: {
      vi: 'Hội thảo công bố nghiên cứu tổng hợp về tác động của mạng xã hội đối với sức khỏe tâm thần của thanh thiếu niên Việt Nam.',
      en: 'Workshop announcing a synthesis study on the impact of social media on Vietnamese adolescents\' mental health.',
    },
    publishedAt: '2026-01-06',
    source: 'Z & Alpha PR',
    imageUrl: img('press-release'),
  },
  {
    id: 'event-hanoi-workshop-2026-02',
    slug: 'workshop-ha-noi-an-toan-mang-2026',
    category: 'event',
    title: {
      vi: 'Workshop Hà Nội: "An toàn trên mạng cho học sinh THCS"',
      en: 'Hanoi workshop: "Online safety for middle-schoolers"',
    },
    excerpt: {
      vi: 'Mở đăng ký workshop miễn phí cho 200 giáo viên Hà Nội về kỹ năng hướng dẫn học sinh sử dụng mạng an toàn.',
      en: 'Free workshop open for 200 Hanoi teachers on guiding students to use the internet safely.',
    },
    publishedAt: '2026-02-12',
    imageUrl: img('workshop'),
  },
  {
    id: 'tuoi-tre-coverage-2026-04',
    slug: 'tuoi-tre-dua-tin-72h-no-facebook',
    category: 'article',
    title: {
      vi: 'Báo Tuổi Trẻ đưa tin về nghiên cứu "72 giờ không Facebook"',
      en: 'Tuoi Tre Newspaper covers our "72 Hours Without Facebook" study',
    },
    excerpt: {
      vi: 'Tuoi Tre Online phỏng vấn nhóm nghiên cứu Z & Alpha về phương pháp và kết quả của thực nghiệm 72 giờ không sử dụng Facebook.',
      en: 'Tuoi Tre Online interviews the Z & Alpha team about the method and findings of the 72-hour Facebook abstinence study.',
    },
    publishedAt: '2026-04-18',
    source: 'Báo Tuổi Trẻ',
    externalUrl: 'https://tuoitre.vn/',
    imageUrl: img('press-coverage'),
  },
  {
    id: 'announcement-new-researcher-2026-03',
    slug: 'chao-don-thanh-vien-moi-thang-3-2026',
    category: 'announcement',
    title: {
      vi: 'Chào đón 3 thành viên mới vào đội ngũ nghiên cứu',
      en: 'Welcoming 3 new members to the research team',
    },
    excerpt: {
      vi: 'Tháng 3/2026 đội ngũ Z & Alpha hân hạnh chào đón 2 nghiên cứu viên trẻ và 1 cố vấn chuyên môn về tâm lý học giáo dục.',
      en: 'In March 2026, Z & Alpha welcomes 2 young researchers and 1 educational psychology advisor.',
    },
    publishedAt: '2026-03-05',
    imageUrl: img('new-team'),
  },
  {
    id: 'event-saigon-panel-2026-05',
    slug: 'toa-dam-sai-gon-the-he-z-va-AI-2026',
    category: 'event',
    title: {
      vi: 'Toạ đàm Sài Gòn: Thế hệ Z & AI — sống chung hay sống cùng?',
      en: 'Saigon panel: Gen Z & AI — coexist or collaborate?',
    },
    excerpt: {
      vi: 'Đăng ký toạ đàm mở miễn phí tại Saigon Innovation Hub, ngày 28/05/2026, có sự tham gia của 4 chuyên gia.',
      en: 'Open free panel at Saigon Innovation Hub, May 28, 2026, with 4 expert speakers.',
    },
    publishedAt: '2026-05-08',
    imageUrl: img('panel'),
  },
  {
    id: 'press-release-2025-12-cyberbully',
    slug: 'thong-cao-bao-chi-cyberbullying-vn-2025',
    category: 'press',
    title: {
      vi: 'Công bố báo cáo: Cyberbullying tại Việt Nam 2025',
      en: 'Report release: Cyberbullying in Vietnam 2025',
    },
    excerpt: {
      vi: 'Z & Alpha công bố báo cáo nghiên cứu quy mô toàn quốc về tình trạng bắt nạt trực tuyến tại các trường THCS-THPT Việt Nam.',
      en: 'Z & Alpha releases a nationwide study on cyberbullying in Vietnamese middle and high schools.',
    },
    publishedAt: '2025-12-14',
    source: 'Z & Alpha PR',
    imageUrl: img('cyberbully'),
  },
  {
    id: 'article-screen-time-limit-2026-02',
    slug: 'screen-time-cho-tre-tieu-hoc-bao-nhieu-la-du',
    category: 'article',
    title: {
      vi: 'Screen time cho trẻ tiểu học: bao nhiêu là đủ?',
      en: 'Screen time for primary-schoolers: how much is enough?',
    },
    excerpt: {
      vi: 'Tổng hợp khuyến nghị mới nhất từ WHO, AAP và phân tích thực tế tại Việt Nam.',
      en: 'Latest recommendations from WHO and AAP, with practical analysis for Vietnamese families.',
    },
    publishedAt: '2026-02-26',
    imageUrl: img('screen-time'),
  },
  {
    id: 'announcement-research-call-2026-04',
    slug: 'open-call-nghien-cuu-vien-tre-thang-4-2026',
    category: 'announcement',
    title: {
      vi: 'Open Call: Tuyển nghiên cứu viên trẻ vòng 2/2026',
      en: 'Open call: Young researcher recruitment, round 2/2026',
    },
    excerpt: {
      vi: 'Mở đơn cho sinh viên năm 3-4 và học viên cao học muốn tham gia chương trình nghiên cứu viên trẻ Z & Alpha.',
      en: 'Open application for 3rd–4th year undergrads and graduate students interested in the Z & Alpha young researcher programme.',
    },
    publishedAt: '2026-04-30',
    imageUrl: img('open-call'),
  },
];

export const getNewsCategoryById = (id: NewsCategory) => NEWS_CATEGORIES.find((c) => c.id === id);
export const getSortedNews = () =>
  [...NEWS_ITEMS].sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));
