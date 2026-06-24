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
    avatar: '/assets/team/cao-hoang-nam.jpg',
    role: {
      vi: 'Sáng lập viên – Giám đốc điều hành',
      en: 'Co-founder – Executive Director',
    },
    bio: {
      vi: [
        'Gần 20 năm kinh nghiệm làm việc trong lĩnh vực lập kế hoạch truyền thông doanh nghiệp, quản lý khủng hoảng truyền thông xã hội và quan hệ chính phủ cho khu vực doanh nghiệp tại Việt Nam. Thạc sĩ Kinh tế và Quan hệ Quốc tế tại <em>Đại học Oregon, Hoa Kỳ</em>. Giám đốc đối ngoại tập đoàn <em>TOMRA</em> tại Việt Nam, Phillipines & Malaysia.',
      ],
      en: [
        'Nearly 20 years of experience in corporate communications planning, social-media crisis management and government relations for the corporate sector in Vietnam. MA in Economics and International Relations at the <strong>University of Oregon, USA</strong>. Public Affairs Director for <strong>TOMRA</strong> in Vietnam, the Philippines & Malaysia.',
      ],
    },
    bullets: {
      vi: [
        'Cựu điều phối viên trưởng tại <em>Vietnam Program for Internet & Society (VPIS)</em>, một chương trình tiên phong tại Việt Nam trong lĩnh vực nghiên cứu liên ngành về Internet và xã hội.',
        'Cựu Trưởng phòng Chính sách Công, Quan hệ Chính phủ và Truyền thông tại <em>PepsiCo VN</em>.',
      ],
      en: [
        'Former lead coordinator at the <strong>Vietnam Program for Internet & Society (VPIS)</strong>, a pioneering interdisciplinary research program on Internet and society in Vietnam.',
        'Former Head of Public Policy, Government Relations & Communications at <strong>PepsiCo Vietnam</strong>.',
      ],
    },
  },
  {
    initials: 'NTV',
    name: 'TS. Nguyễn Thanh Vân',
    avatar: '/assets/team/nguyen-thanh-van.jpg',
    role: {
      vi: 'Sáng lập viên – Giám đốc chuyên môn',
      en: 'Co-founder – Director of Programs',
    },
    bio: {
      vi: [
        'Hơn 10 năm kinh nghiệm quản lý dự án, phát triển các chương trình giáo dục toàn cầu, cũng như điều phối hợp tác giữa các tập đoàn đa quốc gia, cơ quan chính phủ, tổ chức phi chính phủ và các cơ sở giáo dục. Tiến sỹ chuyên ngành giáo dục tại <em>ĐH Sophia</em>, Thạc sĩ Quan hệ Quốc tế <em>ĐH Waseda (Nhật Bản)</em> với các nghiên cứu lý luận chuyên sâu về hợp tác xã hội, giáo dục công dân toàn cầu, giáo dục phát triển bền vững, giáo dục cảm xúc xã hội trong bối cảnh phát triển công nghệ vũ bão cùng những rủi ro mang tính hệ thống toàn cầu. Quản lý sản xuất nội dung giáo dục & xuất bản khoa học tại <em>Oddly normal podcast</em>.',
      ],
      en: [
        'Over 10 years of experience in project management, building global education programs, and coordinating partnerships between multinational corporations, governments, NGOs and education institutions. PhD in Education at <strong>Sophia University</strong> and MA in International Relations at <strong>Waseda University (Japan)</strong>, with in-depth research on social partnerships, global citizenship education, education for sustainable development, and social-emotional learning amid rapid technological change and systemic global risks. Education content & scientific-publishing lead at <strong>Oddly Normal Podcast</strong>.',
      ],
    },
  },
  {
    initials: 'PHC',
    name: 'TS. Phạm Hải Chung',
    avatar: '/assets/team/pham-hai-chung.jpg',
    role: {
      vi: 'Sáng lập viên – Cố vấn chuyên môn',
      en: 'Co-founder – Senior Advisor',
    },
    bio: {
      vi: [
        'Hơn 16 năm kinh nghiệm trong lĩnh vực học thuật và thực tế, hiện giảng dạy tại Đại học Anh Quốc. Tiến sĩ Truyền thông tại <em>Đại học Bournemouth (Anh Quốc)</em>, Thạc sĩ Báo chí Quốc tế tại <em>Đại học Baptist Hồng Kông (Hồng Kông)</em>, nghiên cứu viên tại <em>Trường Harvard Kennedy, Đại học Harvard (Mỹ)</em>. Nghiên cứu tiến sĩ tập trung vào văn hóa tiêu dùng và hành vi sử dụng các phương tiện truyền thông của thế hệ công chúng sinh sau năm 1975. Đã và đang tham gia viết bài cho các tờ báo lớn như <em>Financial Times</em>, <em>VnExpress</em> và các tạp chí khoa học có uy tín tại Châu Âu.',
      ],
      en: [
        'Over 16 years of academic and applied experience, currently teaching at a UK university. PhD in Communications at <strong>Bournemouth University (UK)</strong>, MA in International Journalism at <strong>Hong Kong Baptist University (Hong Kong)</strong>, and Research Fellow at <strong>Harvard Kennedy School, Harvard University (USA)</strong>. Doctoral research focused on consumption culture and media-use behaviour of audiences born after 1975. Has contributed to major outlets such as <strong>Financial Times</strong>, <strong>VnExpress</strong> and reputable European academic journals.',
      ],
    },
  },
];

export const FALLBACK_RESEARCHERS: FallbackOrganizer[] = [
  {
    initials: 'HCBN',
    name: 'Hà Châu Bảo Nhi',
    avatar: '/assets/team/ha-chau-bao-nhi.jpg',
    role: {
      vi: 'Nghiên cứu viên – New Media Art',
      en: 'Researcher – New Media Art',
    },
    bio: {
      vi: [
        'Nghệ sĩ nghệ thuật thị giác và nghiên cứu sinh tiến sĩ chuyên ngành New Media Art tại <em>Đại học Tsukuba</em> (Nhật Bản). Đặt trong tương quan so sánh với Device Art của Nhật Bản, nghiên cứu tiến sỹ của Hà Châu Bảo Nhi lý thuyết hóa “bricolage” (tư duy ứng biến lắp ráp) như một phương pháp luận đặc thù trong thực hành New Media Art tại Việt Nam, tạo tiền đề và khung lý thuyết cho việc sử dụng công nghệ, thiết bị và trải nghiệm tương tác như chất liệu và ngôn ngữ biểu đạt.',
        'Song song với sáng tác và nghiên cứu, Hà Châu Bảo Nhi còn tham gia vào các hoạt động giáo dục nghệ thuật, góp phần đưa thực hành nghệ thuật và công nghiệp sáng tạo Việt Nam vào những thảo luận rộng hơn của khu vực và quốc tế. Hà Châu Bảo Nhi hiện giảng dạy với vai trò giảng viên khách mời về New Media Art tại Vinschool, Trường Khoa học Liên ngành và Nghệ thuật (Đại học Quốc gia Hà Nội) và Trường Đại học Ngoại thương Hà Nội.',
      ],
      en: [
        'A visual artist and PhD candidate in New Media Art at <strong>the University of Tsukuba</strong> (Japan). In comparison with the Device Art of Japan, her doctoral research theorizes “bricolage” (improvisational assembly) as a distinctive methodology for New Media Art practice in Vietnam, laying the groundwork and theoretical framework for using technology, devices and interactive experience as material and expressive language.',
        'Alongside her artistic practice and research, Hà Châu Bảo Nhi is also active in art education, helping bring Vietnamese artistic practice and creative industries into broader regional and international conversations. She currently teaches as a guest lecturer in New Media Art at Vinschool, the School of Interdisciplinary Sciences and Arts (Vietnam National University, Hanoi) and Foreign Trade University, Hanoi.',
      ],
    },
  },
  {
    initials: 'DLMC',
    name: 'Đoàn Lê Minh Châu',
    avatar: '/assets/team/doan-le-minh-chau.jpg',
    role: {
      vi: 'Nghiên cứu viên – Nghiên cứu Phát triển',
      en: 'Researcher – Development Studies',
    },
    bio: {
      vi: [
        'Nghiên cứu sinh Tiến sĩ chuyên ngành Nghiên cứu Phát triển Quốc tế tại <em>Đại học Hankuk University of Foreign Studies</em> (Hàn Quốc). Hơn 5 năm kinh nghiệm giảng dạy, nghiên cứu và phát triển chương trình đào tạo ở bậc Đại học, cùng nhiều năm kinh nghiệm tham gia các dự án hợp tác quốc tế về đổi mới xã hội, trách nhiệm xã hội doanh nghiệp và nghiên cứu, đánh giá dự án liên quan đến phát triển bền vững. Với nền tảng chuyên môn về xã hội học và nghiên cứu phát triển, nghiên cứu của Đoàn Lê Minh Châu tập trung vào các vấn đề về văn hóa, phát triển, không gian đô thị và quyền lực.',
      ],
      en: [
        'A PhD candidate in International Development Studies at <strong>Hankuk University of Foreign Studies</strong> (South Korea). More than 5 years of experience teaching, researching and developing undergraduate curricula, together with several years working on international cooperation projects in social innovation, corporate social responsibility, and the research and evaluation of sustainable-development projects. With a background in sociology and development studies, her research focuses on issues of culture, development, urban space and power.',
      ],
    },
  },
  {
    initials: 'BTH',
    name: 'Bùi Thanh Huyền',
    avatar: '/assets/team/bui-thanh-huyen.jpg',
    role: {
      vi: 'Nghiên cứu viên – Sinh học phân tử',
      en: 'Researcher – Molecular Biology',
    },
    bio: {
      vi: [
        'Tiến sĩ chuyên ngành Sinh học phân tử tại <em>Đại học Utah</em> (University of Utah). Hơn 15 năm kinh nghiệm nghiên cứu và giảng dạy Sinh học phân tử và Di truyền học tại Viện nghiên cứu Cold Spring Harbor (Cold Spring Harbor Laboratory), Đại Học Utah, và Đại học bang Montana (Montana State University). Hiện tại, Bùi Thanh Huyền công tác tại Công ty phi lợi nhuận ARUP Laboratories, quản lý các đề tài Nghiên cứu và Phát triển trong kỹ thuật chẩn đoán bệnh di truyền bằng giải trình tự gen.',
      ],
      en: [
        'A PhD in Molecular Biology from <strong>the University of Utah</strong>. More than 15 years of research and teaching experience in molecular biology and genetics at <strong>Cold Spring Harbor Laboratory</strong>, the University of Utah, and Montana State University. She currently works at the non-profit <strong>ARUP Laboratories</strong>, managing Research and Development projects in gene-sequencing techniques for diagnosing genetic diseases.',
      ],
    },
  },
];

export const FALLBACK_COLLABORATORS: FallbackPerson[] = [
  { initials: 'LHKC', name: 'Lưu Hồ Khánh Chi', role: { vi: 'Cộng tác viên', en: 'Collaborator' } },
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
