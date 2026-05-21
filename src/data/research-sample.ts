/**
 * Sample data for the Research page UI. Shape mirrors what the CMS will return
 * later — when Sanity is wired in, replace these exports with `fetchQuery(...)`
 * calls returning the same TopicItem / ResearchItem shape. No page code change.
 */

import type { Lang } from '@/lib/i18n';

export type TopicTone = 'teal' | 'blue' | 'orange' | 'red' | 'purple';

export interface TopicItem {
  id: string;             // stable slug, used in URL ?topic=
  label: Record<Lang, string>;
  tone: TopicTone;
}

export interface ResearchItem {
  id: string;
  slug: string;           // URL slug under /research/
  topicId: string;        // foreign key to TopicItem.id
  title: Record<Lang, string>;
  excerpt: Record<Lang, string>;
  publishedAt: string;    // ISO date
  readingTime: number;    // minutes
  imageUrl?: string;      // 16:9; undefined → icon-stack fallback
  featured: boolean;
  type: Record<Lang, string>;  // "Thực nghiệm" / "Field experiment" — shown as meta
}

// ------------------------------- Topics -------------------------------
export const TOPICS: TopicItem[] = [
  {
    id: 'mang-xa-hoi',
    label: { vi: 'Mạng xã hội & hành vi', en: 'Social media & behaviour' },
    tone: 'teal',
  },
  {
    id: 'suc-khoe-tinh-than',
    label: { vi: 'Sức khoẻ tinh thần', en: 'Mental health' },
    tone: 'red',
  },
  {
    id: 'giao-duc-so',
    label: { vi: 'Giáo dục số', en: 'Digital education' },
    tone: 'blue',
  },
  {
    id: 'chinh-sach',
    label: { vi: 'Chính sách & quyền trẻ em', en: 'Policy & children\'s rights' },
    tone: 'orange',
  },
  {
    id: 'cong-nghe-moi',
    label: { vi: 'Công nghệ mới (AI, AR…)', en: 'Emerging tech (AI, AR…)' },
    tone: 'purple',
  },
];

// ----------------------------- Articles -----------------------------
// Mix of: 3 featured, 8 regular = 11 cards total
// imageUrl uses picsum.photos with stable seed → reproducible across builds
const img = (seed: string) => `https://picsum.photos/seed/${seed}/800/450`;

export const RESEARCH_ITEMS: ResearchItem[] = [
  {
    id: '72h-no-facebook',
    slug: '72h-no-facebook',
    topicId: 'mang-xa-hoi',
    title: { vi: '72 giờ không Facebook', en: '72 Hours Without Facebook' },
    excerpt: {
      vi: 'Thực nghiệm với 66 người tham gia, ghi nhận phản ứng cảm xúc và khả năng thích ứng khi tạm rời Facebook trong 72 giờ.',
      en: 'Field experiment with 66 participants, recording emotional response and adaptation when stepping away from Facebook for 72 hours.',
    },
    publishedAt: '2025-05-15',
    readingTime: 8,
    imageUrl: undefined, // use legacy icon-stack
    featured: true,
    type: { vi: 'Thực nghiệm', en: 'Field experiment' },
  },
  {
    id: 'tiktok-attention-span',
    slug: 'tiktok-attention-span',
    topicId: 'suc-khoe-tinh-than',
    title: {
      vi: 'TikTok và khả năng tập trung của Gen Z',
      en: 'TikTok and Gen Z\'s attention span',
    },
    excerpt: {
      vi: 'Khảo sát 420 học sinh THPT cho thấy thời lượng tập trung trung bình giảm 28% sau 6 tháng sử dụng TikTok >2h/ngày.',
      en: 'A survey of 420 high-schoolers found average attention span dropped 28% after 6 months of using TikTok over 2 hours/day.',
    },
    publishedAt: '2026-02-10',
    readingTime: 12,
    imageUrl: img('tiktok-focus'),
    featured: true,
    type: { vi: 'Khảo sát', en: 'Survey' },
  },
  {
    id: 'fomo-and-self-worth',
    slug: 'fomo-va-gia-tri-ban-than',
    topicId: 'suc-khoe-tinh-than',
    title: {
      vi: 'FOMO và sự dao động giá trị bản thân ở tuổi 15-18',
      en: 'FOMO and self-worth fluctuation in ages 15-18',
    },
    excerpt: {
      vi: 'Phân tích định tính 24 phỏng vấn sâu cho thấy mối liên hệ trực tiếp giữa "fear of missing out" và lo âu hiện sinh.',
      en: 'Qualitative analysis of 24 in-depth interviews shows a direct link between FOMO and existential anxiety.',
    },
    publishedAt: '2026-01-22',
    readingTime: 10,
    imageUrl: img('fomo-selfworth'),
    featured: true,
    type: { vi: 'Phỏng vấn sâu', en: 'In-depth interviews' },
  },
  {
    id: 'phone-in-classroom',
    slug: 'dien-thoai-trong-lop-hoc',
    topicId: 'giao-duc-so',
    title: {
      vi: 'Điện thoại trong lớp học: Cấm hay hướng dẫn dùng?',
      en: 'Phones in classrooms: ban or guided use?',
    },
    excerpt: {
      vi: 'So sánh 4 mô hình quản lý điện thoại tại trường THCS Việt Nam — cấm tuyệt đối, ngăn hộc, hộp khoá, hoặc tích hợp vào bài giảng.',
      en: 'Comparing 4 phone management models in Vietnamese middle schools — total ban, drawer, locked box, or integrated into lessons.',
    },
    publishedAt: '2025-11-08',
    readingTime: 15,
    imageUrl: img('classroom-phone'),
    featured: false,
    type: { vi: 'Nghiên cứu so sánh', en: 'Comparative study' },
  },
  {
    id: 'ai-tutor-equity',
    slug: 'gia-su-ai-va-cong-bang-giao-duc',
    topicId: 'cong-nghe-moi',
    title: {
      vi: 'Gia sư AI và bài toán công bằng giáo dục',
      en: 'AI tutors and the educational equity question',
    },
    excerpt: {
      vi: 'AI tutor như ChatGPT có thể thu hẹp hay mở rộng khoảng cách học tập giữa học sinh thành thị và nông thôn?',
      en: 'Can AI tutors like ChatGPT close or widen the learning gap between urban and rural students?',
    },
    publishedAt: '2026-03-12',
    readingTime: 11,
    imageUrl: img('ai-tutor'),
    featured: false,
    type: { vi: 'Phân tích chính sách', en: 'Policy analysis' },
  },
  {
    id: 'cyberbullying-vn-2025',
    slug: 'bao-cao-cyberbullying-vn-2025',
    topicId: 'chinh-sach',
    title: {
      vi: 'Báo cáo cyberbullying tại Việt Nam 2025',
      en: 'Cyberbullying in Vietnam 2025 report',
    },
    excerpt: {
      vi: '1 trong 4 học sinh trung học từng là nạn nhân của bắt nạt trực tuyến trong 12 tháng qua — phân tích nguồn cơn và đề xuất chính sách.',
      en: '1 in 4 high-schoolers were victims of online bullying in the past 12 months — analysis of causes and policy recommendations.',
    },
    publishedAt: '2026-04-02',
    readingTime: 20,
    imageUrl: img('cyberbully-report'),
    featured: true,
    type: { vi: 'Báo cáo nghiên cứu', en: 'Research report' },
  },
  {
    id: 'instagram-body-image',
    slug: 'instagram-va-hinh-anh-co-the',
    topicId: 'suc-khoe-tinh-than',
    title: {
      vi: 'Instagram và nhận thức về hình ảnh cơ thể',
      en: 'Instagram and body image perception',
    },
    excerpt: {
      vi: 'Thử nghiệm A/B với 180 nữ sinh: 30 phút xem feed Instagram làm giảm sự hài lòng về cơ thể 17%.',
      en: 'A/B trial with 180 female students: 30 minutes of Instagram feed reduces body satisfaction by 17%.',
    },
    publishedAt: '2025-09-18',
    readingTime: 9,
    imageUrl: img('insta-body'),
    featured: false,
    type: { vi: 'Thử nghiệm A/B', en: 'A/B trial' },
  },
  {
    id: 'parents-screen-time',
    slug: 'phu-huynh-va-thoi-gian-man-hinh',
    topicId: 'giao-duc-so',
    title: {
      vi: 'Phụ huynh, screen time và bàn ăn',
      en: 'Parents, screen time, and the dinner table',
    },
    excerpt: {
      vi: 'Vai trò của phụ huynh trong việc đặt giới hạn screen time — quan sát 32 gia đình trong 4 tuần.',
      en: 'The parent role in setting screen-time limits — observing 32 families over 4 weeks.',
    },
    publishedAt: '2025-12-05',
    readingTime: 7,
    imageUrl: img('parents-screen'),
    featured: false,
    type: { vi: 'Quan sát hành vi', en: 'Behavioural observation' },
  },
  {
    id: 'gdpr-vietnam-youth',
    slug: 'gdpr-va-quyen-rieng-tu-thanh-thieu-nien',
    topicId: 'chinh-sach',
    title: {
      vi: 'GDPR và quyền riêng tư của thanh thiếu niên Việt Nam',
      en: 'GDPR and the privacy rights of Vietnamese adolescents',
    },
    excerpt: {
      vi: 'Có nên Việt Nam ban hành luật bảo vệ dữ liệu trẻ em tương đương GDPR-K của EU? Khuyến nghị chính sách 2026.',
      en: 'Should Vietnam pass child data protection laws equivalent to the EU\'s GDPR-K? Policy recommendations for 2026.',
    },
    publishedAt: '2026-03-28',
    readingTime: 14,
    imageUrl: img('gdpr-youth'),
    featured: false,
    type: { vi: 'Khuyến nghị chính sách', en: 'Policy brief' },
  },
  {
    id: 'discord-community-belonging',
    slug: 'discord-va-cam-giac-thuoc-ve',
    topicId: 'mang-xa-hoi',
    title: {
      vi: 'Discord và cảm giác thuộc về của Gen Z',
      en: 'Discord and Gen Z\'s sense of belonging',
    },
    excerpt: {
      vi: '68% người dùng Discord trong khảo sát coi server là "nhà thứ hai" — khám phá vai trò mới của cộng đồng số.',
      en: '68% of surveyed Discord users see servers as their "second home" — exploring the new role of digital communities.',
    },
    publishedAt: '2026-01-08',
    readingTime: 11,
    imageUrl: img('discord-belonging'),
    featured: false,
    type: { vi: 'Khảo sát', en: 'Survey' },
  },
  {
    id: 'ar-classroom-pilot',
    slug: 'thi-diem-ar-trong-day-hoc',
    topicId: 'cong-nghe-moi',
    title: {
      vi: 'Thí điểm AR trong dạy học môn Sinh',
      en: 'AR pilot in Biology classrooms',
    },
    excerpt: {
      vi: '3 lớp 10 thí điểm dùng kính AR trong 8 tuần — kết quả học tập và mức độ hứng thú thay đổi ra sao?',
      en: 'Three Grade-10 classes piloted AR glasses for 8 weeks — how did test scores and engagement change?',
    },
    publishedAt: '2026-02-25',
    readingTime: 13,
    imageUrl: img('ar-biology'),
    featured: false,
    type: { vi: 'Thí điểm', en: 'Pilot study' },
  },
];

// ------------------------------ Helpers ------------------------------
export const getTopicById = (id: string) => TOPICS.find((t) => t.id === id);
export const getFeaturedItems = () =>
  RESEARCH_ITEMS.filter((a) => a.featured).sort(
    (a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt)
  );
export const getNonFeaturedItems = () =>
  RESEARCH_ITEMS.filter((a) => !a.featured).sort(
    (a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt)
  );
