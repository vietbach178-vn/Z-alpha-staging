/**
 * One-off migration: take the hardcoded "72h-no-facebook" research article from
 * the legacy Astro project and persist it to the new Prisma database as a single
 * ResearchArticle with a block-document body.
 *
 * Run:  npx tsx scripts/migrate-72h.ts
 */

import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client';
import type { BlockNode, InlineRun } from '../src/components/editor/BlockRenderer';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const text = (s: string): InlineRun[] => [{ type: 'text', text: s }];

// VI body
const bodyVi: BlockNode[] = [
  { type: 'heading', props: { level: 2 }, content: text('Tóm tắt thực nghiệm') },
  {
    type: 'paragraph',
    content: text(
      'Trong kỷ nguyên số, mạng xã hội — đặc biệt là Facebook — không chỉ là công cụ kết nối mà còn trở thành một phần của đời sống cá nhân và cảm xúc con người. Tuy nhiên, việc sử dụng quá mức đang làm gia tăng lo âu, FOMO và lệ thuộc tâm lý, đặc biệt ở giới trẻ. Trong bối cảnh đó, Z & Alpha Initiative thực hiện nghiên cứu "72 Giờ Không Facebook" nhằm tìm hiểu phản ứng và khả năng thích ứng của người dùng khi tạm rời nền tảng quen thuộc này.'
    ),
  },
  {
    type: 'paragraph',
    content: text(
      'Thực nghiệm được tiến hành với 66 người tham gia tự nguyện, chủ yếu là sinh viên và người trẻ. Họ được yêu cầu không truy cập Facebook trong 72 giờ liên tục, trong khi nhóm nghiên cứu ghi nhận mức độ tuân thủ, biến chuyển cảm xúc và chiến lược ứng phó của từng cá nhân thông qua khảo sát hằng ngày.'
    ),
  },

  {
    type: 'statHero',
    props: {
      badge: '72 giờ không Facebook',
      cells: [
        { value: '66',  labelStrong: 'người',   labelSpan: 'tham gia' },
        { value: '>60', unit: '%', labelStrong: 'vi phạm', labelSpan: '≥1 lần' },
        { value: '~48', unit: 'h', labelStrong: 'bắt đầu', labelSpan: 'thích nghi' },
      ],
    },
  },

  {
    type: 'barChart',
    props: {
      title: 'Tái sử dụng theo nhóm',
      sub: 'vi phạm ≥1 lần',
      bars: [
        { labelStrong: 'Sinh viên', labelSpan: 'người tham gia nghiên cứu', value: 73, color: 'blue' },
        { labelStrong: 'Nhóm',      labelSpan: 'chuyên nghiệp',             value: 47, color: 'red' },
      ],
    },
  },

  {
    type: 'emotionGrid',
    props: {
      title: 'Phản ứng cảm xúc',
      titleAccent: 'red',
      cards: [
        { emoji: '😰', label: 'Lo âu',    sub: 'Bồn chồn, căng thẳng', tone: 'red' },
        { emoji: '😱', label: 'FOMO',     sub: 'Sợ bỏ lỡ thông tin',   tone: 'red' },
        { emoji: '😊', label: 'Thư giãn', sub: 'Sau 48h thích nghi',   tone: 'blue' },
      ],
      caption: 'Dữ liệu từ thực nghiệm "72 giờ không Facebook" — Z & Alpha Initiative 2025',
    },
  },

  { type: 'heading', props: { level: 2 }, content: text('Kết quả chính') },
  { type: 'bulletListItem', content: text('Hơn 60% người tham gia vi phạm cam kết ít nhất một lần, do thói quen truy cập vô thức, nhu cầu giao tiếp hoặc yêu cầu công việc.') },
  { type: 'bulletListItem', content: text('Người trẻ dễ tái sử dụng nhất, trong khi nhóm chuyên nghiệp thể hiện khả năng tự kiểm soát tốt hơn.') },
  { type: 'bulletListItem', content: text('Các phản ứng phổ biến gồm lo âu, bồn chồn, cảm giác bị bỏ lại (FOMO) và mất kết nối xã hội.') },
  { type: 'bulletListItem', content: text('Sau 48 giờ, đa số người tham gia thích nghi và chuyển sang các hoạt động tích cực như đọc sách, gặp gỡ trực tiếp hoặc nghỉ ngơi.') },

  { type: 'heading', props: { level: 2 }, content: text('Phân tích và kết luận') },
  {
    type: 'paragraph',
    content: text(
      'Kết quả cho thấy, Facebook không chỉ là nền tảng giao tiếp mà còn là một phần mở rộng của bản sắc số (extended self) — nơi người dùng lưu giữ ký ức, khẳng định giá trị và kết nối xã hội. Chính sự gắn bó này khiến việc ngắt kết nối trở nên khó khăn, hình thành hành vi lệ thuộc và tác động tiêu cực đến cảm xúc cũng như khả năng tập trung trong đời sống thực.'
    ),
  },
  {
    type: 'paragraph',
    content: text(
      'Dù vậy, phần lớn người tham gia ghi nhận cảm giác nhẹ nhõm và tự do sau khi vượt qua giai đoạn đầu bất an. Điều này gợi mở rằng, những "khoảng nghỉ kỹ thuật số" ngắn hạn có thể giúp người dùng tái thiết lập cân bằng tinh thần, giảm bớt ảnh hưởng tiêu cực từ mạng xã hội và thúc đẩy nhận thức về chánh niệm kỹ thuật số (digital mindfulness) trong thời đại kết nối liên tục.'
    ),
  },

  { type: 'heading', props: { level: 2 }, content: text('Chú giải cuối') },
  {
    type: 'paragraph',
    content: text(
      'Báo cáo này được xây dựng dựa trên dữ liệu thu thập từ thực nghiệm "72 giờ không sử dụng Facebook", do nhóm nghiên cứu độc lập tiến hành trong năm 2025. Các thông tin, phân tích và trích dẫn trong báo cáo được tổng hợp từ kết quả khảo sát, phỏng vấn sâu, và quan sát hành vi của 66 người tham gia.'
    ),
  },
];

// EN body — same structure, English text
const bodyEn: BlockNode[] = [
  { type: 'heading', props: { level: 2 }, content: text('Experiment summary') },
  {
    type: 'paragraph',
    content: text(
      'In the digital era, social media — Facebook in particular — is not only a connection tool but also part of personal and emotional life. However, excessive use is increasing anxiety, FOMO, and psychological dependence, especially among young people. In that context, Z & Alpha Initiative conducted the "72 Hours Without Facebook" study to investigate user responses and adaptation when stepping away from this familiar platform.'
    ),
  },
  {
    type: 'paragraph',
    content: text(
      'The experiment was conducted with 66 voluntary participants, mostly students and young adults. They were asked to refrain from Facebook for 72 continuous hours, while the research team recorded compliance, emotional shifts, and coping strategies through daily surveys.'
    ),
  },

  {
    type: 'statHero',
    props: {
      badge: '72 Hours Without Facebook',
      cells: [
        { value: '66',  labelStrong: 'people',     labelSpan: 'participants' },
        { value: '>60', unit: '%', labelStrong: 'broke rule', labelSpan: '≥1 time' },
        { value: '~48', unit: 'h', labelStrong: 'began',      labelSpan: 'adapting' },
      ],
    },
  },

  {
    type: 'barChart',
    props: {
      title: 'Re-engagement by group',
      sub: 'broke rule ≥1 time',
      bars: [
        { labelStrong: 'Students',     labelSpan: 'study participants', value: 73, color: 'blue' },
        { labelStrong: 'Professional', labelSpan: 'group',              value: 47, color: 'red' },
      ],
    },
  },

  {
    type: 'emotionGrid',
    props: {
      title: 'Emotional response',
      titleAccent: 'red',
      cards: [
        { emoji: '😰', label: 'Anxiety', sub: 'Restless, tense',       tone: 'red' },
        { emoji: '😱', label: 'FOMO',    sub: 'Fear of missing out',   tone: 'red' },
        { emoji: '😊', label: 'Relaxed', sub: 'After 48h adapting',    tone: 'blue' },
      ],
      caption: 'Data from the "72 Hours Without Facebook" study — Z & Alpha Initiative 2025',
    },
  },

  { type: 'heading', props: { level: 2 }, content: text('Key findings') },
  { type: 'bulletListItem', content: text('Over 60% of participants broke their commitment at least once, due to unconscious habits, communication needs, or work demands.') },
  { type: 'bulletListItem', content: text('Young people relapsed most easily, while the professional group showed better self-control.') },
  { type: 'bulletListItem', content: text('Common reactions included anxiety, restlessness, fear of missing out (FOMO), and social disconnection.') },
  { type: 'bulletListItem', content: text('After 48 hours, most participants adapted and shifted to positive activities such as reading, meeting in person, or resting.') },

  { type: 'heading', props: { level: 2 }, content: text('Analysis and conclusions') },
  {
    type: 'paragraph',
    content: text(
      'The results show that Facebook is not just a communication platform but an extension of the digital self — a place where users store memories, assert value, and maintain social connections. This attachment makes disconnection difficult, fostering dependent behaviour and negatively affecting emotions and focus in real life.'
    ),
  },
  {
    type: 'paragraph',
    content: text(
      'Even so, most participants reported relief and freedom after the initial anxious phase. This suggests that short "digital breaks" can help users restore mental balance, reduce the negative effects of social media, and foster digital mindfulness in an era of constant connection.'
    ),
  },

  { type: 'heading', props: { level: 2 }, content: text('End notes') },
  {
    type: 'paragraph',
    content: text(
      'This report is based on data collected from the "72 hours without Facebook" experiment, conducted by an independent research team in 2025. Information, analysis, and citations are synthesized from survey results, in-depth interviews, and behavioural observations of 66 participants.'
    ),
  },
];

async function main() {
  // Lookup topic
  const topic = await prisma.topic.findUnique({ where: { slug: 'mang-xa-hoi' } });
  if (!topic) throw new Error('Topic "mang-xa-hoi" not found — run seed first.');

  const article = await prisma.researchArticle.upsert({
    where: { slug: '72h-no-facebook' },
    update: {
      titleVi: '72 giờ không Facebook',
      titleEn: '72 Hours Without Facebook',
      excerptVi: 'Thực nghiệm với 66 người tham gia, ghi nhận phản ứng cảm xúc và khả năng thích ứng khi tạm rời Facebook trong 72 giờ.',
      excerptEn: 'Field experiment with 66 participants, recording emotional response and adaptation when stepping away from Facebook for 72 hours.',
      bodyVi: bodyVi as never,
      bodyEn: bodyEn as never,
      topicId: topic.id,
      readingTime: 8,
      typeVi: 'Thực nghiệm',
      typeEn: 'Field experiment',
      featured: true,
      status: 'PUBLISHED',
      publishedAt: new Date('2025-05-15'),
      seoTitleVi: '72 giờ không Facebook — Z & Alpha Initiative',
      seoTitleEn: '72 Hours Without Facebook — Z & Alpha Initiative',
      seoDescVi: 'Nghiên cứu thực nghiệm về phản ứng và khả năng thích ứng của 66 người tham gia khi tạm rời khỏi Facebook trong 72 giờ.',
      seoDescEn: 'Field study on the responses and adaptation of 66 participants when stepping away from Facebook for 72 hours.',
    },
    create: {
      slug: '72h-no-facebook',
      titleVi: '72 giờ không Facebook',
      titleEn: '72 Hours Without Facebook',
      excerptVi: 'Thực nghiệm với 66 người tham gia, ghi nhận phản ứng cảm xúc và khả năng thích ứng khi tạm rời Facebook trong 72 giờ.',
      excerptEn: 'Field experiment with 66 participants, recording emotional response and adaptation when stepping away from Facebook for 72 hours.',
      bodyVi: bodyVi as never,
      bodyEn: bodyEn as never,
      topicId: topic.id,
      readingTime: 8,
      typeVi: 'Thực nghiệm',
      typeEn: 'Field experiment',
      featured: true,
      status: 'PUBLISHED',
      publishedAt: new Date('2025-05-15'),
    },
  });

  console.log(`✓ Migrated research: ${article.titleVi} (${article.slug})`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
