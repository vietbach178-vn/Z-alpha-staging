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
  /** Optional override URL for portrait (e.g. uploaded asset URL). Falls back to initials placeholder. */
  avatar?: string;
}

export interface FallbackOrganizer extends FallbackPerson {
  /** Bio paragraphs (each item = one paragraph). */
  bio: Record<Lang, string[]>;
  /** Optional bullet list of past roles / achievements. */
  bullets?: Record<Lang, string[]>;
}

export const FALLBACK_ORGANIZERS: FallbackOrganizer[] = [
  {
    initials: 'CHN',
    name: 'ThS. Cao Hoàng Nam',
    role: {
      vi: 'Sáng lập viên – Giám đốc điều hành',
      en: 'Co-founder – Executive Director',
    },
    bio: {
      vi: [
        'Gần 20 năm kinh nghiệm làm việc trong lĩnh vực lập kế hoạch truyền thông doanh nghiệp, quản lý khủng hoảng truyền thông xã hội và quan hệ chính phủ cho khu vực doanh nghiệp tại Việt Nam. Thạc sĩ Kinh tế và Quan hệ Quốc tế tại Đại học Oregon, Hoa Kỳ. Giám đốc đối ngoại tập đoàn TOMRA tại Việt Nam, Phillipines & Malaysia.',
      ],
      en: [
        'Nearly 20 years of experience in corporate communications planning, social-media crisis management and government relations for the corporate sector in Vietnam. MA in Economics and International Relations at the University of Oregon, USA. Public Affairs Director for TOMRA in Vietnam, the Philippines & Malaysia.',
      ],
    },
    bullets: {
      vi: [
        'Cựu điều phối viên trưởng tại Vietnam Program for Internet & Society (VPIS), một chương trình tiên phong tại Việt Nam trong lĩnh vực nghiên cứu liên ngành về Internet và xã hội.',
        'Cựu Trưởng phòng Chính sách Công, Quan hệ Chính phủ và Truyền thông tại PepsiCo VN.',
      ],
      en: [
        'Former lead coordinator at the Vietnam Program for Internet & Society (VPIS), a pioneering interdisciplinary research program on Internet and society in Vietnam.',
        'Former Head of Public Policy, Government Relations & Communications at PepsiCo Vietnam.',
      ],
    },
  },
  {
    initials: 'NTV',
    name: 'TS. Nguyễn Thanh Vân',
    role: {
      vi: 'Sáng lập viên – Giám đốc chuyên môn',
      en: 'Co-founder – Director of Programs',
    },
    bio: {
      vi: [
        'Hơn 10 năm kinh nghiệm quản lý dự án, phát triển các chương trình giáo dục toàn cầu, cũng như điều phối hợp tác giữa các tập đoàn đa quốc gia, cơ quan chính phủ, tổ chức phi chính phủ và các cơ sở giáo dục. Tiến sỹ chuyên ngành giáo dục tại ĐH Sophia, Thạc sĩ Quan hệ Quốc tế ĐH Waseda (Nhật Bản) với các nghiên cứu lý luận chuyên sâu về hợp tác xã hội, giáo dục công dân toàn cầu, giáo dục phát triển bền vững, giáo dục cảm xúc xã hội trong bối cảnh phát triển công nghệ vũ bão cùng những rủi ro mang tính hệ thống toàn cầu. Quản lý sản xuất nội dung giáo dục & xuất bản khoa học tại Oddly normal podcast.',
      ],
      en: [
        'Over 10 years of experience in project management, building global education programs, and coordinating cross-sector partnerships between multinational corporations, governments, NGOs and education institutions. PhD in Education at Sophia University and MA in International Relations at Waseda University (Japan), with research focused on social partnerships, global citizenship education, education for sustainable development, and social-emotional learning amid rapid technological change and systemic global risks. Education content & scientific publishing lead at Oddly Normal Podcast.',
      ],
    },
  },
  {
    initials: 'PHC',
    name: 'TS. Phạm Hải Chung',
    role: {
      vi: 'Sáng lập viên – Cố vấn chuyên môn',
      en: 'Co-founder – Senior Advisor',
    },
    bio: {
      vi: [
        'Hơn 16 năm kinh nghiệm trong lĩnh vực học thuật và thực tế, hiện giảng dạy tại Đại học Anh Quốc. Tiến sĩ Truyền thông tại Đại học Bournemouth (Anh Quốc), Thạc sĩ Báo chí Quốc tế tại Đại học Baptist Hồng Kông (Hồng Kông), nghiên cứu viên tại Trường Harvard Kennedy, Đại học Harvard (Mỹ). Nghiên cứu tiến sĩ tập trung vào văn hóa tiêu dùng và hành vi sử dụng các phương tiện truyền thông của thế hệ công chúng sinh sau năm 1975. Đã và đang tham gia viết bài cho các tờ báo lớn như Financial Times, VnExpress và các tạp chí khoa học có uy tín tại Châu Âu.',
      ],
      en: [
        'Over 16 years of academic and applied experience, currently teaching at a UK university. PhD in Communications at Bournemouth University (UK), MA in International Journalism at Hong Kong Baptist University (Hong Kong), research fellow at the Harvard Kennedy School, Harvard University (USA). Doctoral research focused on consumption culture and media-use behaviour of audiences born after 1975. Contributing writer for major outlets such as Financial Times, VnExpress and reputable European academic journals.',
      ],
    },
  },
  {
    initials: 'VTL',
    name: 'Vũ Thùy Linh',
    role: {
      vi: 'Quản lý Vận hành',
      en: 'Operations Manager',
    },
    bio: {
      vi: [
        'Hơn 14 năm kinh nghiệm trong lĩnh vực quản trị nhân sự, phát triển nhân tài, tuyển dụng tại các tập đoàn lớn trong và ngoài nước. Đã tổ chức và tham gia nhiều chuỗi chương trình định hướng nghề nghiệp cho gần 1000 sinh viên và người đi làm, sinh viên tại các trường đại học. Là diễn giả, ban giám khảo của nhiều chương trình được tổ chức nhằm hỗ trợ các bạn sinh viên chuẩn bị hành trang để chinh phục sự nghiệp.',
      ],
      en: [
        'Over 14 years of experience in HR management, talent development and recruitment at major domestic and international corporations. Has organised and participated in many career-orientation programs for nearly 1,000 students and young professionals. Frequent speaker and judge for programs supporting university students preparing for their careers.',
      ],
    },
    bullets: {
      vi: [
        'Cựu Giám đốc Nhân sự tại Satom Venture Studio',
        'Cựu Quản lý Thu hút và Phát triển nhân tài tại Vingroup, Carlsberg Việt Nam',
        'Cựu Trưởng phòng Phát triển tổ chức tại DVG',
      ],
      en: [
        'Former HR Director at Satom Venture Studio',
        'Former Talent Acquisition & Development Manager at Vingroup, Carlsberg Vietnam',
        'Former Head of Organizational Development at DVG',
      ],
    },
  },
];

export const FALLBACK_RESEARCHERS: FallbackPerson[] = [
  {
    initials: 'NPL',
    name: 'ThS. Nguyễn Phương Liên',
    role: {
      vi: 'Nghiên cứu viên Ban Internet & Truyền thông',
      en: 'Researcher, Internet & Media Division',
    },
  },
];

export const FALLBACK_COLLABORATORS: FallbackPerson[] = [
  { initials: 'LHKC', name: 'Lưu Hồ Khánh Chi', role: { vi: 'Cộng tác viên', en: 'Collaborator' } },
  { initials: 'TML', name: 'Trần Mỹ Linh', role: { vi: 'Cộng tác viên', en: 'Collaborator' } },
  { initials: 'CAL', name: 'Cao An Lê', role: { vi: 'Cộng tác viên', en: 'Collaborator' } },
  { initials: 'LKM', name: 'Lý Khải Minh', role: { vi: 'Cộng tác viên', en: 'Collaborator' } },
  { initials: 'NVHN', name: 'Nguyễn Văn Hoàng Nhân', role: { vi: 'Cộng tác viên', en: 'Collaborator' } },
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
