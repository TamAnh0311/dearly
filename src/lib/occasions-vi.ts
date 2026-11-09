/**
 * Vietnamese occasion page data — mirrors src/lib/occasions.ts
 * with Vietnamese content optimised for SEO.
 */

export interface ViOccasionPage {
  slug: string;
  enSlug: string;
  title: string;
  description: string;
  keywords: string[];
  h1: string;
  intro: string;
  features: { title: string; description: string }[];
  howTo: { title: string; description: string }[];
  comparison: { dearly: string; traditional: string }[];
  faq: { q: string; a: string }[];
  relatedGuides: string[];
}

export const VI_OCCASIONS: ViOccasionPage[] = [
  {
    slug: "wedding",
    enSlug: "wedding",
    title: "Thiệp Cưới Online Đẹp Miễn Phí — RSVP & Album Ảnh | Dearly",
    description: "Tạo thiệp cưới online đẹp với RSVP, link mời cá nhân, lịch trình, lời chúc và album ảnh. Hơn 20 mẫu thiết kế. Hoàn toàn miễn phí.",
    keywords: [
      "thiệp cưới online",
      "thiệp cưới đẹp",
      "mẫu thiệp cưới",
      "thiệp cưới miễn phí",
      "thiệp cưới điện tử",
      "thiệp mời đám cưới online",
      "tạo thiệp cưới",
      "RSVP đám cưới",
      "quản lý khách mời đám cưới",
      "album ảnh đám cưới online",
      "lời chúc đám cưới",
    ],
    h1: "Thiệp Cưới Online Đẹp — Miễn Phí",
    intro:
      "Tạo thiệp cưới điện tử đẹp lung linh chỉ trong vài phút. Gửi link mời cá nhân cho từng khách, theo dõi RSVP trực tiếp, thu thập lời chúc và chia sẻ album ảnh — tất cả trên một trang duy nhất.",
    features: [
      {
        title: "Hơn 20 mẫu thiệp cưới đẹp",
        description:
          "Từ phong cách tối giản đến sang trọng, từ Á Đông đến hiện đại. Mỗi mẫu đều có hiệu ứng chuyển động mượt mà và tùy chỉnh màu sắc, font chữ theo ý bạn.",
      },
      {
        title: "RSVP & quản lý khách mời",
        description:
          "Khách chỉ cần nhấn \"Tôi sẽ đến\" hoặc \"Không thể tham dự\". Bạn theo dõi số lượng khách, kích thước bàn tiệc và xuất danh sách CSV.",
      },
      {
        title: "Link mời cá nhân",
        description:
          "Mỗi khách nhận một link riêng, hiển thị tên của họ trên thiệp. Không cần app, không cần đăng ký — chỉ cần mở link.",
      },
      {
        title: "Lời chúc & phản hồi",
        description:
          "Khách gửi lời chúc ngay khi RSVP. Lời chúc hiển thị trên tường chúc phúc — chạy ngang, bay lên hoặc hiện như livestream.",
      },
      {
        title: "Album ảnh chung",
        description:
          "Cặp đôi tải ảnh cưới lên ngay. Sau lễ, khách cũng có thể đóng góp ảnh. Tất cả hiển thị trong album masonry đẹp mắt.",
      },
      {
        title: "Lịch trình & bản đồ",
        description:
          "Thêm lịch trình ngày cưới (lễ vu quy, tiệc cưới, after party), địa điểm và hướng dẫn đường đi cho khách.",
      },
    ],
    howTo: [
      {
        title: "Chọn mẫu thiết kế",
        description: "Duyệt hơn 20 mẫu thiệp cưới. Xem trước trực tiếp, chọn mẫu phù hợp với phong cách của bạn.",
      },
      {
        title: "Điền thông tin",
        description:
          "Nhập tên cặp đôi, ngày cưới, địa điểm, câu chuyện tình yêu, lịch trình và thông tin chuyển khoản.",
      },
      {
        title: "Gửi link cho khách",
        description:
          "Chia sẻ link thiệp cưới qua Zalo, Messenger, SMS hoặc email. Mỗi khách có link riêng với tên được cá nhân hóa.",
      },
    ],
    comparison: [
      { dearly: "Miễn phí, tạo trong 5 phút", traditional: "In ấn tốn 2-5 triệu VNĐ, chờ 1-2 tuần" },
      { dearly: "Theo dõi RSVP trực tiếp", traditional: "Gọi điện, nhắn tin từng người" },
      { dearly: "Thay đổi thông tin bất cứ lúc nào", traditional: "In lại nếu có sai sót" },
      { dearly: "Album ảnh và lời chúc trực tuyến", traditional: "Không có" },
      { dearly: "Thân thiện với môi trường", traditional: "Tốn giấy, mực in" },
    ],
    faq: [
      {
        q: "Thiệp cưới online trên Dearly có miễn phí không?",
        a: "Có, Dearly hoàn toàn miễn phí trong giai đoạn trải nghiệm sớm. Bạn được sử dụng tất cả mẫu thiết kế, RSVP, album ảnh và lời chúc mà không mất phí.",
      },
      {
        q: "Tôi có thể tùy chỉnh màu sắc và font chữ không?",
        a: "Có. Mỗi mẫu đều cho phép bạn thay đổi màu chủ đạo, màu phụ, màu nhấn và chọn font chữ riêng cho tiêu đề và nội dung.",
      },
      {
        q: "Khách mời có cần tải app không?",
        a: "Không. Khách chỉ cần mở link trên trình duyệt điện thoại hoặc máy tính. Không cần đăng ký hay đăng nhập.",
      },
      {
        q: "Tôi có thể theo dõi ai đã RSVP chưa?",
        a: "Có. Dashboard hiển thị danh sách khách đã trả lời, đang chờ và số lượng khách tham dự. Bạn cũng nhận email thông báo mỗi khi có RSVP mới.",
      },
      {
        q: "Thiệp có hỗ trợ tiếng Việt không?",
        a: "Có. Dearly hỗ trợ tiếng Việt, tiếng Anh, tiếng Trung, tiếng Nhật và tiếng Hàn. Bạn chọn ngôn ngữ trong phần cài đặt thiệp.",
      },
      {
        q: "Tôi có thể thêm nhạc nền không?",
        a: "Có. Chọn từ thư viện nhạc có sẵn hoặc dán link nhạc riêng của bạn. Nhạc sẽ phát khi khách mở thiệp.",
      },
      {
        q: "Sau đám cưới, thiệp còn hoạt động không?",
        a: "Có. Thiệp tự động chuyển thành album kỷ niệm với ảnh và lời chúc. Bạn có thể quay lại xem bất cứ lúc nào.",
      },
      {
        q: "Làm sao để gửi thiệp cho khách?",
        a: "Sao chép link thiệp và gửi qua Zalo, Messenger, SMS, email hoặc bất kỳ ứng dụng nào. Bạn cũng có thể tạo mã QR để in trên thiệp giấy.",
      },
      {
        q: "Tôi có thể thêm thông tin chuyển khoản mừng cưới không?",
        a: "Có. Phần quà tặng cho phép bạn thêm tối đa 2 tài khoản ngân hàng với mã QR để khách chuyển khoản tiện lợi.",
      },
      {
        q: "Dearly có mẫu thiệp Á Đông không?",
        a: "Có. Dearly có nhiều mẫu thiệp phong cách Á Đông (Nhật Bản, Hàn Quốc, Trung Quốc, Việt Nam) với bố cục và ngôn ngữ phù hợp.",
      },
    ],
    relatedGuides: ["create-your-invitation", "guest-list", "customise-your-design", "publish-and-share"],
  },
  {
    slug: "birthday",
    enSlug: "birthday",
    title: "Thiệp Sinh Nhật Online Đẹp Miễn Phí — RSVP & Ảnh | Dearly",
    description:
      "Tạo thiệp mời sinh nhật trực tuyến đẹp với RSVP, danh sách khách, lời chúc và album ảnh. Miễn phí, dễ sử dụng.",
    keywords: [
      "thiệp sinh nhật online",
      "thiệp mời sinh nhật",
      "thiệp sinh nhật đẹp",
      "tạo thiệp sinh nhật",
      "mẫu thiệp sinh nhật",
      "thiệp sinh nhật miễn phí",
    ],
    h1: "Thiệp Sinh Nhật Online Đẹp — Miễn Phí",
    intro:
      "Tạo thiệp mời sinh nhật lung linh trong vài phút. Gửi link cho bạn bè, theo dõi ai sẽ đến và thu thập lời chúc — tất cả trên một trang.",
    features: [
      {
        title: "Mẫu thiết kế vui nhộn",
        description: "Từ phong cách tối giản đến sôi động, phù hợp mọi lứa tuổi và chủ đề tiệc.",
      },
      {
        title: "RSVP dễ dàng",
        description: "Khách nhấn một nút để trả lời. Bạn biết ngay ai sẽ đến và bao nhiêu người.",
      },
      {
        title: "Lời chúc sinh nhật",
        description: "Khách gửi lời chúc ngay trên thiệp. Tất cả hiển thị đẹp mắt trên tường chúc.",
      },
      {
        title: "Album ảnh tiệc",
        description: "Sau tiệc, khách tải ảnh lên album chung để cả nhóm cùng xem lại.",
      },
    ],
    howTo: [
      { title: "Chọn mẫu", description: "Duyệt và chọn mẫu thiệp sinh nhật phù hợp." },
      { title: "Điền thông tin", description: "Nhập tên, ngày, địa điểm và lời mời." },
      { title: "Gửi cho bạn bè", description: "Chia sẻ link qua Zalo, Messenger hoặc SMS." },
    ],
    comparison: [
      { dearly: "Miễn phí, tạo trong 3 phút", traditional: "Mua thiệp giấy hoặc đặt thiết kế riêng" },
      { dearly: "Biết ngay ai sẽ đến", traditional: "Nhắn tin hỏi từng người" },
      { dearly: "Album ảnh chung sau tiệc", traditional: "Mỗi người giữ ảnh riêng" },
    ],
    faq: [
      {
        q: "Thiệp sinh nhật trên Dearly có miễn phí không?",
        a: "Có, hoàn toàn miễn phí trong giai đoạn trải nghiệm sớm.",
      },
      {
        q: "Tôi có thể tạo thiệp cho sinh nhật trẻ em không?",
        a: "Có. Bạn có thể chọn mẫu vui nhộn và tùy chỉnh nội dung phù hợp với mọi lứa tuổi.",
      },
      {
        q: "Khách có cần tải app không?",
        a: "Không. Chỉ cần mở link trên trình duyệt.",
      },
      {
        q: "Tôi có thể thêm lịch trình tiệc không?",
        a: "Có. Phần lịch trình cho phép bạn liệt kê các hoạt động theo thời gian.",
      },
      {
        q: "Có hỗ trợ tiếng Việt không?",
        a: "Có. Dearly hỗ trợ đầy đủ tiếng Việt.",
      },
      {
        q: "Sau tiệc, thiệp còn hoạt động không?",
        a: "Có. Thiệp trở thành album kỷ niệm với ảnh và lời chúc.",
      },
    ],
    relatedGuides: ["create-your-invitation", "guest-list", "photos-and-memories"],
  },
  {
    slug: "party",
    enSlug: "party",
    title: "Thiệp Mời Tiệc & Sự Kiện Online — RSVP Miễn Phí | Dearly",
    description:
      "Tạo thiệp mời tiệc, sự kiện, họp mặt trực tuyến với RSVP, danh sách khách và album ảnh. Miễn phí, chuyên nghiệp.",
    keywords: [
      "thiệp mời tiệc",
      "thiệp mời sự kiện",
      "thiệp mời online",
      "tạo thiệp mời tiệc",
      "RSVP sự kiện",
      "thiệp mời họp mặt",
    ],
    h1: "Thiệp Mời Tiệc & Sự Kiện Online",
    intro:
      "Tổ chức tiệc, họp mặt hay sự kiện? Tạo thiệp mời chuyên nghiệp trong vài phút với RSVP, danh sách khách và album ảnh.",
    features: [
      {
        title: "Phù hợp mọi sự kiện",
        description: "Tiệc tân gia, họp lớp, tiệc công ty, liên hoan — chọn mẫu và tùy chỉnh theo ý bạn.",
      },
      {
        title: "RSVP chuyên nghiệp",
        description: "Khách trả lời nhanh chóng. Bạn quản lý danh sách và số lượng dễ dàng.",
      },
      {
        title: "Chia sẻ linh hoạt",
        description: "Gửi link qua Zalo, email, SMS hoặc tạo mã QR.",
      },
      {
        title: "Album ảnh sự kiện",
        description: "Thu thập ảnh từ tất cả khách tham dự vào một album chung.",
      },
    ],
    howTo: [
      { title: "Chọn mẫu thiết kế", description: "Duyệt và chọn mẫu phù hợp với sự kiện của bạn." },
      { title: "Thêm chi tiết", description: "Nhập thông tin sự kiện, lịch trình và địa điểm." },
      { title: "Mời khách", description: "Gửi link mời cá nhân cho từng khách." },
    ],
    comparison: [
      { dearly: "Miễn phí, tạo trong 5 phút", traditional: "Thiết kế riêng hoặc mua thiệp giấy" },
      { dearly: "Quản lý khách trực tuyến", traditional: "Excel hoặc ghi sổ tay" },
      { dearly: "Album ảnh chung", traditional: "Không có" },
    ],
    faq: [
      {
        q: "Thiệp mời sự kiện trên Dearly có miễn phí không?",
        a: "Có, hoàn toàn miễn phí trong giai đoạn trải nghiệm.",
      },
      {
        q: "Tôi có thể dùng cho tiệc công ty không?",
        a: "Có. Dearly phù hợp cho mọi loại sự kiện từ cá nhân đến doanh nghiệp.",
      },
      {
        q: "Có giới hạn số lượng khách không?",
        a: "Trong giai đoạn miễn phí, bạn có thể mời đến 1,000 khách.",
      },
      {
        q: "Khách có cần đăng ký không?",
        a: "Không. Khách chỉ cần mở link và trả lời RSVP.",
      },
      {
        q: "Tôi có thể xem ai đã trả lời chưa?",
        a: "Có. Dashboard hiển thị trạng thái của từng khách.",
      },
      {
        q: "Có thể thêm nhiều sự kiện trong một ngày không?",
        a: "Có. Phần lịch trình cho phép bạn thêm nhiều mục theo thời gian.",
      },
    ],
    relatedGuides: ["create-your-invitation", "guest-list", "publish-and-share"],
  },
];

/** Finds a Vietnamese occasion by slug. */
export function getViOccasion(slug: string): ViOccasionPage | undefined {
  return VI_OCCASIONS.find((o) => o.slug === slug);
}
