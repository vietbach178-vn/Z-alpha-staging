/**
 * Fallback content shown when Sanity has no documents yet — mirrors the original
 * Z02 site verbatim so the new site launches with full content from day 1.
 * Once an editor publishes equivalent docs in Sanity, the fallback is hidden.
 */

import type { Lang } from '@/lib/i18n';

export interface FallbackPerson {
  initials: string;
  name: string;
  role: Record<Lang, string>;
}

export const FALLBACK_RESEARCHERS: FallbackPerson[] = [
  {
    initials: 'CHN',
    name: 'ThS. Cao Hoàng Nam',
    role: {
      vi: 'Điều phối viên trưởng Z & Alpha Initiatives',
      en: 'Lead Coordinator, Z & Alpha Initiatives',
    },
  },
  {
    initials: 'NPL',
    name: 'ThS. Nguyễn Phương Liên',
    role: {
      vi: 'Nghiên cứu viên Ban Internet & Truyền thông',
      en: 'Researcher, Internet & Media Division',
    },
  },
  {
    initials: 'NTV',
    name: 'TS. Nguyễn Thanh Vân',
    role: {
      vi: 'Nghiên cứu viên',
      en: 'Researcher',
    },
  },
];

export const FALLBACK_YOUNG_RESEARCHERS: FallbackPerson[] = [
  { initials: 'LHKC', name: 'Lưu Hồ Khánh Chi', role: { vi: 'Nghiên cứu viên trẻ', en: 'Young researcher' } },
  { initials: 'TML', name: 'Trần Mỹ Linh', role: { vi: 'Nghiên cứu viên trẻ', en: 'Young researcher' } },
  { initials: 'CAL', name: 'Cao An Lê', role: { vi: 'Nghiên cứu viên trẻ', en: 'Young researcher' } },
  { initials: 'LKM', name: 'Lý Khải Minh', role: { vi: 'Nghiên cứu viên trẻ', en: 'Young researcher' } },
  { initials: 'NVHN', name: 'Nguyễn Văn Hoàng Nhân', role: { vi: 'Nghiên cứu viên trẻ', en: 'Young researcher' } },
];

export interface FallbackNewsCard {
  date: Record<Lang, string>;
  title: Record<Lang, string>;
  excerpt: Record<Lang, string>;
  visualTone: 'teal' | 'blue' | 'orange';
  icon: string;
}

export const FALLBACK_NEWS: FallbackNewsCard[] = [
  {
    date: { vi: '20 tháng 3, 2026', en: 'March 20, 2026' },
    title: {
      vi: 'CÓ NHỮNG CUỘC TRÒ CHUYỆN… MÀ CHỈ MỘT NGƯỜI LẮNG NGHE',
      en: 'SOME CONVERSATIONS… WHERE ONLY ONE PERSON LISTENS',
    },
    excerpt: {
      vi: 'Đã bao giờ bạn hào hứng kể một câu chuyện thật hay cho hội bạn, để rồi nhận lại chỉ là những tiếng "tạch tạch" gõ phím hay cái gật đầu vô thức trong khi mắt họ vẫn không rời khỏi màn hình chưa?',
      en: 'Have you ever excitedly told a great story to your friends, only to get back the click-clack of keyboards or an absent-minded nod while their eyes never leave the screen?',
    },
    visualTone: 'teal',
    icon: 'message-circle',
  },
  {
    date: { vi: '6 tháng 1, 2026', en: 'January 6, 2026' },
    title: {
      vi: 'Thông cáo báo chí: Mạng xã hội và sức khỏe tâm thần của thanh thiếu niên Việt Nam',
      en: 'Press release: Social media and the mental health of Vietnamese adolescents',
    },
    excerpt: {
      vi: 'Thông cáo báo chí về hội thảo nghiên cứu tác động của mạng xã hội đối với sức khỏe tâm thần của thanh thiếu niên Việt Nam.',
      en: 'Press release on the research workshop on the impact of social media on the mental health of Vietnamese adolescents.',
    },
    visualTone: 'blue',
    icon: 'file-text',
  },
];

export interface FallbackResearchCard {
  slug: string;
  year: string;
  type: Record<Lang, string>;
  title: Record<Lang, string>;
  desc: Record<Lang, string>;
}

export const FALLBACK_RESEARCH: FallbackResearchCard[] = [
  {
    slug: '72h-no-facebook',
    year: '2025',
    type: { vi: 'Thực nghiệm', en: 'Field experiment' },
    title: { vi: '72 giờ không Facebook', en: '72 Hours Without Facebook' },
    desc: {
      vi: 'Trong kỷ nguyên số, mạng xã hội — đặc biệt là Facebook — không chỉ là công cụ kết nối mà còn trở thành một phần của đời sống cá nhân và cảm xúc con người. Nghiên cứu này ghi nhận phản ứng và khả năng thích ứng của 66 người tham gia khi tạm rời khỏi Facebook trong 72 giờ.',
      en: 'In the digital era, social media — Facebook in particular — is not only a connection tool but also part of personal and emotional life. This study records the responses and adaptation of 66 participants when stepping away from Facebook for 72 hours.',
    },
  },
];
