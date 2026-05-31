/* One-off: import all news articles from z-alpha.org into the new site's DB.
   Idempotent by slug (upsert). VI-only press articles leave bodyEn/titleEn null
   — the repo's pickBody/pickL fall back to VI for EN visitors.
   Usage:
     READ:  tsx scripts/import-news.ts
     WRITE: tsx scripts/import-news.ts --write
   DATABASE_URL must point at the target DB. */
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client';

const p = (text: string) => ({ type: 'paragraph', content: [{ type: 'text', text }] });
const h = (text: string) => ({ type: 'heading', props: { level: 2 }, content: [{ type: 'text', text }] });
const quote = (text: string) => ({ type: 'quote', content: [{ type: 'text', text }] });
const video = (url: string) => ({ type: 'video', props: { url } });
const divider = () => ({ type: 'divider' });

interface Article {
  slug: string;
  category: 'announcement' | 'press' | 'event' | 'article';
  titleVi: string;
  titleEn?: string;
  excerptVi: string;
  excerptEn?: string;
  source?: string;
  heroImage?: string;
  publishedAt: string; // ISO date
  bodyVi: object[];
  bodyEn?: object[];
}

const ARTICLES: Article[] = [
  // ---------------------------------------------------------------- 1
  {
    slug: 'co-nhung-cuoc-tro-chuyen-ma-chi-mot-nguoi-lang-ngh-mmzz4bz5',
    category: 'article',
    titleVi: 'Có những cuộc trò chuyện… mà chỉ một người lắng nghe',
    titleEn: 'Some conversations… have only one listener',
    excerptVi:
      'Đã bao giờ bạn hào hứng kể một câu chuyện thật hay cho hội bạn, để rồi nhận lại chỉ là những tiếng "tạch tạch" gõ phím hay cái gật đầu vô thức trong khi mắt họ vẫn không rời khỏi màn hình?',
    excerptEn:
      'Have you ever excitedly shared a great story with your friends, only to be met with the "click-clack" of typing or an unconscious nod while their eyes never leave the screen?',
    heroImage: 'https://media.z-alpha.org/images/1774076094730-55mmhv.jpg',
    publishedAt: '2026-03-20T00:00:00.000Z',
    bodyVi: [
      p('Đã bao giờ bạn hào hứng kể một câu chuyện thật hay cho hội bạn, để rồi nhận lại chỉ là những tiếng "tạch tạch" gõ phím hay cái gật đầu vô thức trong khi mắt họ vẫn không rời khỏi màn hình chưa?'),
      p('Khoảnh khắc đó không hẳn là im lặng, nhưng cũng không phải là một cuộc trò chuyện trọn vẹn.'),
      p('Đôi khi chúng mình nghĩ chỉ cần ngồi cạnh nhau là đủ. Nhưng giữa những thông báo liên tục hiện lên, những đoạn nội dung cứ nối tiếp nhau, sự chú ý của mình cũng dễ bị kéo đi lúc nào không hay.'),
      p('Không phải vì mình không muốn lắng nghe. Chỉ là có quá nhiều thứ nhỏ trên màn hình đang tranh nhau giữ sự chú ý của mình. Và thế là một câu chuyện đang rất vui… lại trôi qua nhanh hơn một chút mà mình không hề hay biết.'),
      quote('Hãy thử dành trọn sự chú ý cho nhau trong vài phút thôi, bạn sẽ thấy cuộc trò chuyện trở nên ý nghĩa hơn rất nhiều.'),
    ],
    bodyEn: [
      p('Have you ever excitedly shared a great story with your friends, only to be met with the "click-clack" of typing or an unconscious nod while their eyes never leave the screen?'),
      p("It's not quite silence, but it doesn't feel like a full conversation either."),
      p('Sometimes we think just sitting next to each other is enough. But with notifications popping up and content constantly flowing, our attention can quietly drift away.'),
      p("It's not that we don't want to listen. It's just that there are so many small things on the screen competing for our attention. And just like that, a story that could've been a shared moment… slips by a little too quickly."),
      quote('Try giving each other your full attention, even just for a few minutes. You might be surprised how much better the conversation feels.'),
    ],
  },

  // ---------------------------------------------------------------- 2 (VTV video)
  {
    slug: 'ban-tin-vtv-ve-hoi-thao-mang-xa-hoi-va-suc-khoe-ta-mk1c6nq3',
    category: 'press',
    titleVi: 'Bản tin VTV về hội thảo "Mạng xã hội và sức khỏe tâm thần của thanh thiếu niên tại Việt Nam"',
    excerptVi:
      'Phóng sự của Đài Truyền hình Việt Nam (VTV) về hội thảo do Viện Đào tạo Y học Dự phòng và Y tế Công cộng (Trường Đại học Y Hà Nội) phối hợp cùng Sáng kiến Z & Alpha tổ chức.',
    source: 'VTV',
    heroImage: 'https://media.z-alpha.org/images/1767628184472-mfbtss.jpg',
    publishedAt: '2026-01-05T00:00:00.000Z',
    bodyVi: [
      p('Phóng sự của Đài Truyền hình Việt Nam (VTV) về hội thảo "Mạng xã hội và sức khỏe tâm thần của thanh thiếu niên tại Việt Nam", do Viện Đào tạo Y học Dự phòng và Y tế Công cộng (Trường Đại học Y Hà Nội) phối hợp cùng Sáng kiến Z & Alpha tổ chức.'),
      video('https://www.youtube.com/watch?v=_EIUpcj1-J8'),
    ],
  },

  // ---------------------------------------------------------------- 3 (Chinhphu.vn)
  {
    slug: 'mat-trai-cua-mang-xa-hoi-gay-anh-huong-tieu-cuc-de-mk2u1mde',
    category: 'press',
    titleVi: 'Mặt trái của mạng xã hội gây ảnh hưởng tiêu cực đến sức khỏe tâm thần',
    excerptVi:
      'Hội thảo "Mạng xã hội và sức khỏe tâm thần của thanh thiếu niên tại Việt Nam" do Trường Đại học Y Hà Nội phối hợp với Sáng kiến Z&Alpha tổ chức, nêu rõ những tác động tiêu cực của mạng xã hội tới giới trẻ.',
    source: 'Chinhphu.vn · Thiện Tâm',
    heroImage: 'https://media.z-alpha.org/images/1767718224718-mode84.jpg',
    publishedAt: '2026-01-05T00:00:00.000Z',
    bodyVi: [
      p('(Chinhphu.vn) - Ngày 4/10, hưởng ứng Ngày Sức khỏe Tâm thần Thế giới (10/10), Viện Đào tạo Y học Dự phòng và Y tế Công cộng - Trường Đại học Y Hà Nội phối hợp với Sáng kiến Z&Alpha tổ chức Hội thảo với chủ đề "Mạng xã hội và sức khỏe tâm thần của thanh thiếu niên tại Việt Nam".'),
      h('73,3% dân số Việt Nam sử dụng mạng xã hội'),
      p('Hội thảo nhằm nâng cao nhận thức về tác động của mạng xã hội đối với sức khỏe tâm thần của giới trẻ, đưa ra các khuyến nghị và hành động cụ thể để bảo vệ, nâng cao sức khỏe tâm thần cho thanh thiếu niên Việt Nam.'),
      p('Chia sẻ tại hội thảo, ông Cao Hoàng Nam, Sáng kiến Z & ALPHA, cho biết thống kê năm 2014 Việt Nam có 37,2 triệu người sử dụng internet và đến tháng 1/2024 đã có khoảng 78,4 triệu người (chiếm hơn 80% dân số Việt Nam). Như vậy, chỉ trong 10 năm tăng hơn 41 triệu người sử dụng internet.'),
      p('Thống kê tháng 1/2024 với người dùng 16 - 64 tuổi, thời gian sử dụng internet hằng ngày trên tất cả các thiết bị của Việt Nam trung bình 6 giờ 18 phút/ngày/người, đặc biệt thời gian sử dụng internet trên điện thoại di động 3 giờ 30 phút/ngày/người.'),
      p('Về tiếp cận mạng xã hội, có 73,3% dân số sử dụng mạng xã hội, thời gian sử dụng mạng xã hội trung bình 2 giờ 25 phút/ngày/người (thời gian sử dụng mạng xã hội của Việt Nam xếp thứ 20 trên toàn thế giới, đứng đầu là Kenya với 3 giờ 43 phút).'),
      p('Facebook là nền tảng mạng xã hội được sử dụng nhiều nhất ở Việt Nam với 89,7%, Zalo 88,5%, TikTok 77,8%.'),
      p('Thống kê tháng 1/2024, độ tuổi 16 - 64 tuổi có 96,8% người truy cập trang web, ứng dụng trò chuyện, nhắn tin, 96,6% truy cập mạng xã hội.'),
      p('Top 5 mục đích chính sử dụng internet gồm giữ liên lạc với bạn bè và gia đình, tìm kiếm thông tin, cập nhật tin tức và sự kiện, xem video, chương trình truyền hình hoặc phim ảnh, truy cập và nghe nhạc trực tuyến.'),
      p('Trước đó khảo sát của UNICEF năm 2022 về sử dụng internet hằng ngày đối với thanh thiếu niên và trẻ em cho thấy lứa tuổi 12 - 13 tuổi khoảng 82%, lứa tuổi 14 - 15 tăng lên 93%.'),
      p('Nhiều ý kiến tham luận cho rằng các nền tảng xã hội được thiết kế để có thể gây nghiện cho người dùng, đặc biệt giới trẻ; gây ra các tác động tiêu cực cho sức khỏe tâm thần như trầm cảm, mất ngủ, lo âu, sao nhãng trong học tập cũng như hàng loạt các vấn đề khác đối với sức khỏe tâm thần của người dùng. Ví dụ, tại Hoa Kỳ, tỷ lệ mắc các đợt trầm cảm nặng trong 12 tháng ở thanh thiếu niên đã tăng từ 8,7% vào năm 2005 lên 11,3% vào năm 2014. Các hoạt động trên màn hình phương tiện truyền thông đã được cho là một trong những nguyên nhân làm gia tăng tình trạng trầm cảm và tự tử ở thanh thiếu niên.'),
      p('PGS.TS. Lê Minh Giang, Viện trưởng Viện Đào tạo Y học Dự phòng và Y tế Công cộng, Trường Đại học Y Hà Nội cho biết: "Hội thảo này là bước đi đầu tiên cho các nghiên cứu toàn diện về tác động của mạng xã hội đối với sức khỏe tâm thần của thanh thiếu niên Việt Nam, từ đó xây dựng các chương trình nâng cao nhận thức, hướng dẫn cho nhà trường, phụ huynh, người dùng các giải pháp để bảo vệ và nâng cao sức khỏe tâm thần cho thanh thiếu niên Việt Nam trong kỷ nguyên số".'),
      h('Mặt trái của mạng xã hội gây ảnh hưởng đến sức khỏe tâm thần thanh thiếu niên'),
      p('Chia sẻ về nội dung "Mối liên hệ giữa mạng xã hội và sức khỏe tâm thần", ông Cao Hoàng Nam nhấn mạnh: Mạng xã hội đã sử dụng các thuật toán khác nhau dựa trên các nghiên cứu chuyên sâu về cơ chế hoạt động của não bộ nhằm tối đa hóa thời gian sử dụng, liên tục lôi cuốn người dùng mạng xã hội, tạo ra các chu kỳ tương tác gây nghiện. Đặc biệt cần lưu ý, các tính năng này được thiết kế hướng tới người sử dụng là thanh thiếu niên và không được công bố công khai cho người sử dụng được biết.'),
      p('Theo ông Nam, những thiết kế của mạng xã hội đã tác động đến tâm thần người dùng. Đó là mạng xã hội thiết kế chức năng like - thích, comment - bình luận, tác động vào cơ chế sản sinh Dopamine nội sinh; mạng xã hội được thiết kế dựa trên cơ chế trả thưởng của não: "thuật củng cố biến thiên" hoặc "lịch thưởng biến thiên". Đặc biệt mạng xã hội không tiết lộ các thuật toán được sử dụng cho thiết kế có thể tạo ra một chu kỳ tương tác gây nghiện; việc thiết kế tính năng "like - thích" và so sánh xã hội khiến người dùng liên tục kiểm tra lượt thích, tăng cường độ đăng bài tiếp theo. Nếu bài viết có sự từ chối, hoặc cảm thấy bị từ chối sau khi đăng lên được ít người bấm thích trên mạng xã hội có thể dẫn tới các triệu chứng trầm cảm, gia tăng theo thời gian.'),
      p('Bên cạnh đó, tính năng "thông báo" để liên tục thúc đẩy sự tham gia của người dùng bằng cách gửi thông báo tới người dùng trẻ. Mạng xã hội khiến điện thoại thông minh của người dùng trẻ tạo ra các cảnh báo nghe nhìn và xúc giác làm xao nhãng và cản trở hoạt động giáo dục của người dùng trẻ tuổi và thời gian giấc ngủ; tính năng "cuộn vô hạn" và tự động phát video khiến người dùng trẻ khó có thể thoát ra vì không có điểm kết thúc tự nhiên nào cho việc hiển thị thông tin mới. Và đặc biệt, tính năng bộ lọc hình ảnh (visual filters), sự không hài lòng về cơ thể có thể liên quan đến việc gia tăng các triệu chứng của tình trạng sức khỏe tâm thần và có thể dẫn đến nguy cơ mắc chứng rối loạn ăn uống cao hơn.'),
      p('TS. Nguyễn Thị Mai Hương, Viện Đào tạo Y học Dự phòng và Y tế Công cộng, Trường Đại học Y Hà Nội cho rằng, bên cạnh những lợi ích mang lại từ mạng xã hội thì khi lạm dụng mạng xã hội, thanh thiếu niên có thể gặp các tác động tiêu cực, như rối loạn giấc ngủ, trầm cảm, cô lập xã hội và nghiện internet, bắt nạt qua mạng, tỉ lệ tội phạm trên mạng gia tăng, áp lực từ bạn bè và tiếp xúc với nội dung độc hại là một số rủi ro liên quan đến việc sử dụng mạng xã hội, dẫn đến việc tự làm hại bản thân, suy nghĩ tự tử và các vấn đề sức khỏe tâm thần khác.'),
      p('Các diễn giả và các nhà khoa học cho rằng việc sử dụng mạng xã hội không chỉ để tiếp cận thông tin mà còn phải đi kèm với khả năng tự nhận thức về các rủi ro tiềm ẩn. Vì thế, việc trang bị kỹ năng tự bảo vệ bản thân và duy trì sự kiểm soát khi dùng mạng xã hội chính là chìa khóa giúp chúng ta tận dụng triệt để những lợi ích mà không để ảnh hưởng tiêu cực đến sức khỏe tâm thần của thanh thiếu niên Việt Nam.'),
    ],
  },

  // ---------------------------------------------------------------- 4 (Nhân Dân)
  {
    slug: 'nghien-mang-xa-hoi-gay-ra-cac-tac-dong-tieu-cuc-ch-mk2tqs3f',
    category: 'press',
    titleVi: 'Nghiện mạng xã hội gây ra các tác động tiêu cực cho sức khỏe tâm thần',
    excerptVi:
      'Hội thảo do Viện Đào tạo Y học Dự phòng và Y tế Công cộng (Trường Đại học Y Hà Nội) phối hợp Sáng kiến Z&Alpha tổ chức, hưởng ứng Ngày Sức khỏe Tâm thần Thế giới.',
    source: 'Nhân Dân (nhandan.vn)',
    heroImage: 'https://media.z-alpha.org/images/1767718107642-4j1jcs.jpg',
    publishedAt: '2026-01-04T00:00:00.000Z',
    bodyVi: [
      p('(Nhandan.vn): Ngày 4/10, Viện Đào tạo Y học Dự phòng và Y tế Công cộng (Trường đại học Y Hà Nội) phối hợp Sáng kiến Z&Alpha tổ chức Hội thảo với chủ đề: "Mạng xã hội và tới sức khỏe tâm thần của thanh thiếu niên tại Việt Nam".'),
      p('Đây là hoạt động hưởng ứng Ngày Sức khỏe Tâm thần Thế giới (10/10) nhằm nâng cao nhận thức về tác động của mạng xã hội đối với sức khỏe tâm thần của giới trẻ, đưa ra các khuyến nghị và hành động cụ thể để bảo vệ, nâng cao sức khỏe tâm thần cho thanh thiếu niên Việt Nam.'),
      p('Các bài tham luận tại Hội thảo đều khẳng định mạng xã hội ngày càng đóng vai trò quan trọng trong đời sống cá nhân và xã hội, nhất là với lứa tuổi thanh thiếu niên. Việt Nam hiện là một trong những nước đứng đầu thế giới về tỷ lệ người dùng Internet và mạng xã hội khi 72,70 triệu người sử dụng mạng xã hội, chiếm khoảng 73% số dân. Một khảo sát của UNICEF năm 2022 cho thấy, 82% trẻ em Việt Nam từ 12 đến 13 tuổi sử dụng Internet hàng ngày, con số này ở lứa tuổi 14 đến 15 là 93%.'),
      p('Đáng chú ý, các nền tảng xã hội được thiết kế để có thể gây nghiện cho người dùng, nhất là giới trẻ, nó gây ra các tác động tiêu cực cho sức khỏe tâm thần như: trầm cảm, mất ngủ, lo âu, sao lãng trong học tập cũng như hàng loạt các vấn đề khác đối với sức khỏe tâm thần. Các hoạt động trên màn hình phương tiện truyền thông đã được cho là một trong những nguyên nhân làm gia tăng tình trạng trầm cảm và tự tử ở thanh thiếu niên.'),
      p('Ông Cao Hoàng Nam, đại diện Viện Sáng kiến Z&Alpha nhấn mạnh chia sẻ: Mạng xã hội đã sử dụng các thuật toán khác nhau dựa trên các nghiên cứu chuyên sâu về cơ chế hoạt động của não bộ nhằm tối đa hóa thời gian sử dụng, liên tục lôi cuốn người dùng mạng xã hội, tạo ra các chu kỳ tương tác gây nghiện. Các tính năng này được thiết kế hướng tới người sử dụng là thanh thiếu niên và không được công bố công khai cho người sử dụng được biết.'),
      p('TS Nguyễn Thị Mai Hương, Viện Đào tạo Y học Dự phòng và Y tế Công cộng khẳng định, lợi ích mang lại từ mạng xã hội là sự tăng cường kết nối xã hội, cơ hội thể hiện bản thân và tiếp cận thông tin cũng như các nguồn lực cho thanh thiếu niên trong học tập và cuộc sống. Các nghiên cứu cũng cho thấy, khoảng 81% học sinh báo cáo rằng mạng xã hội giúp họ cảm thấy được kết nối hơn với bạn bè và thế giới chung quanh.'),
      p('Tuy nhiên, khi lạm dụng mạng xã hội, thanh thiếu niên có thể gặp các tác động tiêu cực, như rối loạn giấc ngủ, trầm cảm, cô lập xã hội và nghiện internet, bắt nạt qua mạng, tỷ lệ tội phạm trên mạng gia tăng, áp lực từ bạn bè và tiếp xúc với nội dung độc hại là một số rủi ro liên quan đến việc sử dụng mạng xã hội, dẫn đến việc tự làm hại bản thân, suy nghĩ tự tử và các vấn đề sức khỏe tâm thần khác. Do vậy cần tăng cường hoạt động giám sát và giáo dục trẻ em về việc sử dụng mạng xã hội một cách có trách nhiệm và lành mạnh.'),
      p('Các diễn giả và các nhà khoa học cho rằng việc sử dụng mạng xã hội không chỉ để tiếp cận thông tin mà còn phải đi kèm với khả năng tự nhận thức về các rủi ro tiềm ẩn. Trang bị kỹ năng tự bảo vệ bản thân và duy trì sự kiểm soát khi dùng mạng xã hội chính là chìa khóa giúp chúng ta tận dụng triệt để những lợi ích mà không để ảnh hưởng tiêu cực đến sức khỏe tâm thần của thanh thiếu niên Việt Nam.'),
      p('PGS,TS Lê Minh Giang, Viện trưởng Đào tạo Y học Dự phòng và Y tế Công cộng cho biết, hội thảo này là bước đi đầu tiên cho các nghiên cứu toàn diện về tác động của mạng xã hội đối với sức khỏe tâm thần của thanh thiếu niên Việt Nam. Từ đó xây dựng các chương trình nâng cao nhận thức, hướng dẫn cho nhà trường, phụ huynh, người dùng các giải pháp để bảo vệ và nâng cao sức khỏe tâm thần cho thanh thiếu niên Việt Nam trong kỷ nguyên số.'),
    ],
  },

  // ---------------------------------------------------------------- 5 (Thông cáo báo chí)
  {
    slug: 'thong-cao-bao-chi-mang-xa-hoi-va-suc-khoe-tam-than-mk2tkvqt',
    category: 'press',
    titleVi: 'Thông cáo báo chí: Mạng xã hội và sức khỏe tâm thần của thanh thiếu niên Việt Nam',
    excerptVi:
      'Thông cáo báo chí về Hội thảo "Mạng xã hội và sức khỏe tâm thần của thanh thiếu niên tại Việt Nam", Hà Nội ngày 4/10/2024.',
    source: 'Sáng kiến Z & Alpha',
    heroImage: 'https://media.z-alpha.org/images/1767717840043-lztkb7.jpg',
    publishedAt: '2026-01-06T00:00:00.000Z',
    bodyVi: [
      p('Hà Nội, ngày 4/10/2024, hưởng ứng Ngày Sức khỏe Tâm thần Thế giới (10/10/2024), Viện Đào tạo Y học Dự phòng và Y tế Công cộng thuộc Trường Đại học Y Hà Nội phối hợp với Sáng kiến Z&Alpha tổ chức Hội thảo với chủ đề: "Mạng xã hội và tới sức khỏe tâm thần của thanh thiếu niên tại Việt Nam" vào ngày 4/10/2024 tại Thủ đô Hà Nội; nhằm nâng cao nhận thức về tác động của mạng xã hội đối với sức khỏe tâm thần của giới trẻ, đưa ra các khuyến nghị và hành động cụ thể để bảo vệ, nâng cao sức khỏe tâm thần cho thanh thiếu niên Việt Nam.'),
      p('Các bài tham luận tại Hội thảo đều khẳng định mạng xã hội ngày càng đóng vai trò quan trọng trong đời sống cá nhân và xã hội, đặc biệt với lứa tuổi thanh thiếu niên. Theo thống kê, Việt Nam là một trong những nước đứng đầu thế giới về tỷ lệ người dùng Internet và mạng xã hội. Hiện có 72,70 triệu người sử dụng mạng xã hội, chiếm 73,3% dân số. Trong số đó có 7,1% thuộc độ tuổi từ 13 đến 17 và 9,7% thuộc độ tuổi từ 18 đến 24 [1]. Khảo sát của UNICEF năm 2022 cho thấy, 82% trẻ em Việt Nam từ 12 – 13 tuổi sử dụng Internet hàng ngày, con số này ở lứa tuổi 14 – 15 là 93%.'),
      p('Nhiều ý kiến tham luận cho rằng các nền tảng xã hội được thiết kế để có thể gây nghiện cho người dùng, đặc biệt giới trẻ; gây ra các tác động tiêu cực cho sức khỏe tâm thần như: trầm cảm, mất ngủ, lo âu, sao lãng trong học tập cũng như hàng loạt các vấn đề khác đối với sức khỏe tâm thần của người dùng. Ví dụ, Tại Hoa Kỳ, tỷ lệ mắc các đợt trầm cảm nặng trong 12 tháng ở thanh thiếu niên đã tăng từ 8,7% vào năm 2005 lên 11,3% vào năm 2014 [2]. Các hoạt động trên màn hình phương tiện truyền thông đã được cho là một trong những nguyên nhân làm gia tăng tình trạng trầm cảm và tự tử ở thanh thiếu niên [3].'),
      p('PGS.TS. Lê Minh Giang, Viện trưởng Viện Đào tạo Y học Dự phòng và Y tế Công cộng, Trường Đại học Y Hà Nội cho biết: "Hội thảo này là bước đi đầu tiên cho các nghiên cứu toàn diện về tác động của mạng xã hội đối với sức khỏe tâm thần của thanh thiếu niên Việt Nam, từ đó xây dựng các chương trình nâng cao nhận thức, hướng dẫn cho nhà trường, phụ huynh, người dùng các giải pháp để bảo vệ và nâng cao sức khỏe tâm thần cho thanh thiếu niên Việt Nam trong kỷ nguyên số".'),
      p('Chia sẻ về nội dung "Mối liên hệ giữa mạng xã hội và sức khỏe tâm thần", Ông Cao Hoàng Nam, đại diện Sáng kiến Z&Alpha nhấn mạnh: "Mạng xã hội đã sử dụng các thuật toán khác nhau dựa trên các nghiên cứu chuyên sâu về cơ chế hoạt động của não bộ nhằm tối đa hóa thời gian sử dụng, liên tục lôi cuốn người dùng mạng xã hội, tạo ra các chu kỳ tương tác gây nghiện. Đặc biệt cần lưu ý, các tính năng này được thiết kế hướng tới người sử dụng là thanh thiếu niên và không được công bố công khai cho người sử dụng được biết".'),
      p('TS. Nguyễn Thị Mai Hương, Viện Đào tạo Y học Dự phòng và Y tế Công cộng, Trường Đại học Y Hà Nội chia sẻ về các tác động cụ thể của Mạng xã hội đối với SKTT thanh thiếu niên. Lợi ích mang lại từ mạng xã hội là sự tăng cường kết nối xã hội, cơ hội thể hiện bản thân và tiếp cận thông tin cũng như các nguồn lực cho thanh thiếu niên trong học tập và cuộc sống. Các nghiên cứu cũng cho thấy, khoảng 81% học sinh báo cáo rằng mạng xã hội giúp họ cảm thấy được kết nối hơn với bạn bè và thế giới xung quanh. Tuy nhiên, khi lạm dụng mạng xã hội, thanh thiếu niên có thể gặp các tác động tiêu cực, như rối loạn giấc ngủ, trầm cảm, cô lập xã hội và nghiện internet, bắt nạt qua mạng, tỉ lệ tội phạm trên mạng gia tăng, áp lực từ bạn bè và tiếp xúc với nội dung độc hại là một số rủi ro liên quan đến việc sử dụng mạng xã hội, dẫn đến việc tự làm hại bản thân, suy nghĩ tự tử và các vấn đề sức khỏe tâm thần khác.'),
      p('Những kết quả nghiên cứu này nhấn mạnh tầm quan trọng của việc giám sát và giáo dục trẻ em về việc sử dụng mạng xã hội một cách có trách nhiệm và lành mạnh.'),
      p('Bà Nguyễn Phương Liên, giảng viên Đại học Hà Nội cho biết: "Nghiên cứu trên 286 phụ nữ trẻ Việt Nam từ 10-35 tuổi cho thấy những người có mức độ chỉnh sửa hình ảnh cá nhân cao thường kém tự tin về hình ảnh cơ thể của họ hơn và họ muốn thay đổi những khuyết điểm đó bằng cách tập luyện thể chất, ăn kiêng, hoặc phẫu thuật thẩm mỹ. Điều này chứng tỏ rằng mạng xã hội không chỉ là thế giới ảo, mà nó có thể là tiền đề của những thay đổi trong thế giới thực. Khi các công cụ số hóa và internet thâm nhập vào từng góc cạnh cuộc sống, ranh giới giữa thực và ảo ngày càng mờ hơn, dẫn đến những tác động rõ ràng hơn và có thể thấy được sâu sắc hơn trong tương lai".'),
      p('Các diễn giả và các nhà khoa học cho rằng việc sử dụng mạng xã hội không chỉ để tiếp cận thông tin mà còn phải đi kèm với khả năng tự nhận thức về các rủi ro tiềm ẩn. Trang bị kỹ năng tự bảo vệ bản thân và duy trì sự kiểm soát khi dùng mạng xã hội chính là chìa khóa giúp chúng ta tận dụng triệt để những lợi ích mà không để ảnh hưởng tiêu cực đến sức khỏe tâm thần của thanh thiếu niên Việt Nam.'),
      divider(),
      p('[1] Báo cáo kỹ thuật số Việt Nam 2024.'),
      p('[2] Mojtabai R, et al. (2016). National trends in the prevalence and treatment of depression in adolescents and young adults. Pediatrics, 138(6).'),
      p('[3] Twenge, J. M., & Campbell, W. K. (2018). Associations between screen time and lower psychological well-being among children and adolescents: Evidence from a population-based study. Preventive medicine reports, 12, 271–283.'),
    ],
  },
];

async function main() {
  const write = process.argv.includes('--write');
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
  const prisma = new PrismaClient({ adapter });

  const cats = await prisma.newsCategory.findMany();
  const catBySlug = new Map(cats.map((c) => [c.slug, c.id]));
  console.log(`Categories: ${cats.map((c) => c.slug).join(', ')}`);

  for (const a of ARTICLES) {
    const categoryId = catBySlug.get(a.category) ?? null;
    const existing = await prisma.newsItem.findFirst({ where: { slug: a.slug }, select: { id: true } });
    console.log(`- ${a.slug}  [${a.category}${categoryId ? '' : ' MISSING'}]  ${existing ? 'update' : 'create'}  (${a.bodyVi.length} blocks)`);

    if (!write) continue;

    // Content fields updated on existing items. heroImage + categoryId are
    // preserved (left untouched) for items that already exist; only used when
    // creating a brand-new item.
    const content = {
      titleVi: a.titleVi,
      titleEn: a.titleEn ?? null,
      excerptVi: a.excerptVi,
      excerptEn: a.excerptEn ?? null,
      bodyVi: a.bodyVi as object,
      bodyEn: (a.bodyEn ?? null) as object,
      source: a.source ?? null,
      status: 'PUBLISHED' as const,
      publishedAt: new Date(a.publishedAt),
    };
    const row = await prisma.newsItem.upsert({
      where: { slug: a.slug },
      update: content,
      create: { ...content, slug: a.slug, heroImage: a.heroImage ?? null, categoryId },
    });
    console.log(`    -> ${existing ? 'updated' : 'created'} ${row.id}`);
  }

  if (!write) console.log('\n(read-only — re-run with --write to upsert all)');
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
