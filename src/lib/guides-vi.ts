/**
 * Vietnamese help guide content — the single source of truth for /vi/huong-dan
 * and its article pages /vi/huong-dan/[slug].
 *
 * Each guide maps to an English counterpart in src/lib/guides.ts via `enSlug`.
 * Add new guides by appending to VI_GUIDES; no route change is needed.
 */

export interface ViGuideSection {
  heading: string;
  body: string;
}

export interface ViFaq {
  q: string;
  a: string;
}

export interface ViGuide {
  /** Vietnamese URL slug, e.g. "tao-thiep-moi" */
  slug: string;
  /** English counterpart slug for hreflang cross-linking */
  enSlug: string;
  title: string;
  summary: string;
  keywords: string[];
  /** Approximate read time in minutes */
  minutes: number;
  sections: ViGuideSection[];
  faq: ViFaq[];
}

/** All Vietnamese guides in display order. */
export const VI_GUIDES: ViGuide[] = [
  {
    slug: "tao-thiep-moi",
    enSlug: "create-your-invitation",
    title: "Cách tạo thiệp mời trên Dearly",
    summary:
      "Từ tài khoản miễn phí đến đường link chia sẻ chỉ trong vài bước đơn giản — không cần kỹ năng thiết kế.",
    keywords: [
      "tạo thiệp mời",
      "thiệp mời online",
      "thiệp cưới trực tuyến",
      "cách làm thiệp mời",
      "thiệp mời miễn phí",
      "tạo thiệp cưới",
    ],
    minutes: 4,
    sections: [
      {
        heading: "Đăng ký tài khoản miễn phí",
        body: "Truy cập dearly.app và nhấn \"Tạo thiệp ngay\". Bạn chỉ cần địa chỉ email — không cần nhập thẻ tín dụng. Toàn bộ mẫu thiết kế và tính năng đều được mở khóa hoàn toàn trong giai đoạn trải nghiệm sớm.",
      },
      {
        heading: "Chọn mẫu thiết kế và điền thông tin",
        body: "Duyệt qua hơn 20 mẫu thiệp từ cổ điển sang trọng đến hiện đại tối giản. Nhấn \"Xem trước\" để xem hiệu ứng mở thiệp trực tiếp trên điện thoại trước khi chọn. Sau đó điền tên sự kiện, ngày tháng, địa điểm và lời chào cá nhân. Trình chỉnh sửa hiển thị kết quả theo thời gian thực — bạn thấy ngay mỗi thay đổi.",
      },
      {
        heading: "Thêm khách mời và bật RSVP",
        body: "Nhập danh sách khách hoặc dán từ bảng tính. Mỗi khách có thể nhận đường link mời riêng được cá nhân hóa với tên của họ. Bật tính năng RSVP để khách xác nhận tham dự ngay bên trong thiệp — không cần điền form rời.",
      },
      {
        heading: "Xuất bản và gửi thiệp",
        body: "Nhấn \"Xuất bản\" để tạo đường link dùng được ngay. Sao chép link và gửi qua Zalo, Facebook Messenger, email hoặc tải mã QR về để in. Bảng điều khiển hiển thị ai đã xem và ai đã RSVP theo thời gian thực.",
      },
    ],
    faq: [
      {
        q: "Tôi có thể chỉnh sửa thiệp sau khi đã gửi link không?",
        a: "Có. Bạn có thể chỉnh sửa bất kỳ nội dung nào bất cứ lúc nào. Link chia sẻ không thay đổi, vì vậy khách mời vẫn dùng link cũ nhưng sẽ thấy nội dung mới nhất khi mở lại.",
      },
      {
        q: "Dearly có hỗ trợ thiệp cho sự kiện không phải đám cưới không?",
        a: "Có. Dearly hỗ trợ sinh nhật, tiệc tùng, lễ đính hôn, kỷ niệm ngày cưới, tiệc tối thân mật và nhiều dịp lễ khác. Mỗi loại sự kiện có thể tùy chỉnh nội dung và mẫu thiết kế phù hợp.",
      },
    ],
  },

  {
    slug: "danh-sach-khach",
    enSlug: "guest-list",
    title: "Quản lý danh sách khách mời",
    summary:
      "Thêm khách, theo dõi RSVP theo thời gian thực và xuất danh sách để sắp xếp chỗ ngồi — tất cả từ một bảng điều khiển duy nhất.",
    keywords: [
      "danh sách khách mời",
      "quản lý khách mời",
      "RSVP online",
      "theo dõi RSVP",
      "xác nhận tham dự",
      "sắp xếp chỗ ngồi",
    ],
    minutes: 4,
    sections: [
      {
        heading: "Thêm khách mời vào danh sách",
        body: "Trong bảng điều khiển sự kiện, mở tab \"Khách mời\" và nhấn \"Thêm khách\". Bạn có thể nhập từng người một hoặc dán danh sách từ bảng tính (hỗ trợ định dạng CSV). Mỗi khách ghi lại tên, email (tùy chọn) và số người đi cùng dự kiến.",
      },
      {
        heading: "Gửi link mời cá nhân",
        body: "Dearly tạo một đường link riêng biệt cho từng khách, tự động điền tên của họ vào lời chào trong thiệp. Sao chép link từng người và gửi qua Zalo, Messenger hoặc email. Bạn cũng có thể tải mã QR tổng để in hoặc chia sẻ trong nhóm chat.",
      },
      {
        heading: "Theo dõi phản hồi RSVP",
        body: "Mỗi khi khách xác nhận tham dự, bạn nhận thông báo ngay lập tức. Bảng điều khiển hiển thị danh sách đầy đủ — tên, số người đi cùng thực tế và lời nhắn kèm theo. Bộ lọc nhanh giúp bạn thấy ngay ai đã xác nhận, ai chưa và ai từ chối.",
      },
      {
        heading: "Xuất danh sách để sắp xếp chỗ ngồi",
        body: "Nhấn \"Xuất CSV\" để tải toàn bộ danh sách RSVP về máy. File bao gồm tên khách, trạng thái xác nhận, số người đi cùng và lời nhắn — sẵn sàng để nhập vào bảng sắp xếp chỗ ngồi hoặc gửi cho gia đình phụ trách tiếp đón.",
      },
    ],
    faq: [
      {
        q: "Khách mời có cần tạo tài khoản để RSVP không?",
        a: "Không. Khách mời chỉ cần nhấn vào đường link, xác nhận tham dự và nhập tên — không cần đăng ký hay tải app. Toàn bộ quá trình xảy ra trong trình duyệt, kể cả trên điện thoại.",
      },
      {
        q: "Tôi có thể giới hạn số lượng khách RSVP không?",
        a: "Có. Trong cài đặt sự kiện bạn có thể đặt tổng số suất tham dự tối đa. Khi đủ số lượng, nút RSVP tự động ẩn và hiển thị thông báo hết suất cho khách đến sau.",
      },
    ],
  },

  {
    slug: "tuy-chinh-thiet-ke",
    enSlug: "customise-your-design",
    title: "Tùy chỉnh thiết kế thiệp",
    summary:
      "Thay đổi màu sắc, phông chữ, bố cục và nội dung từng mục — xem kết quả ngay lập tức mà không cần biết thiết kế.",
    keywords: [
      "tùy chỉnh thiệp mời",
      "thiết kế thiệp cưới",
      "thay đổi màu sắc thiệp",
      "phông chữ thiệp mời",
      "mẫu thiệp đẹp",
      "chỉnh sửa thiệp online",
    ],
    minutes: 3,
    sections: [
      {
        heading: "Chọn bộ màu sắc và phông chữ",
        body: "Mỗi mẫu thiết kế đi kèm nhiều bộ màu được phối sẵn — từ trắng ngà sang trọng đến hồng đào lãng mạn hay xanh cổ điển. Nhấn vào từng bộ màu để xem thiệp thay đổi ngay lập tức trong khung xem trước. Phông chữ cũng có thể thay đổi theo cặp tiêu đề–nội dung đã được phối hợp hài hòa.",
      },
      {
        heading: "Bật và tắt các mục nội dung",
        body: "Dearly chia thiệp thành các mục độc lập: lời chào, câu chuyện cặp đôi, lịch trình, địa điểm, bản đồ, danh sách gia đình, lời chúc khách mời và album ảnh. Bạn chỉ cần bật những mục phù hợp với sự kiện của mình. Mỗi mục có thể sắp xếp lại thứ tự bằng cách kéo thả.",
      },
      {
        heading: "Chỉnh sửa nội dung từng mục",
        body: "Nhấn vào bất kỳ mục nào để mở trình chỉnh sửa nội tuyến. Nhập văn bản trực tiếp — Dearly hỗ trợ đầy đủ tiếng Việt bao gồm dấu và ký tự đặc biệt. Phần xem trước bên phải cập nhật theo từng lần gõ phím để bạn thấy kết quả ngay.",
      },
    ],
    faq: [
      {
        q: "Tôi có thể dùng ảnh của riêng mình không?",
        a: "Có. Bạn tải ảnh lên trực tiếp từ điện thoại hoặc máy tính — hỗ trợ định dạng JPG, PNG và HEIC. Ảnh được tự động tối ưu để hiển thị đẹp trên mọi thiết bị và tốc độ mạng.",
      },
      {
        q: "Thiệp có hiển thị đẹp trên điện thoại không?",
        a: "Có. Toàn bộ mẫu thiết kế được tối ưu cho màn hình điện thoại trước tiên. Khung xem trước trong trình chỉnh sửa cho phép bạn chuyển giữa chế độ điện thoại và máy tính để kiểm tra trước khi gửi.",
      },
    ],
  },

  {
    slug: "anh-va-ky-niem",
    enSlug: "photos-and-memories",
    title: "Album ảnh và kỷ niệm",
    summary:
      "Khách tải ảnh lên trực tiếp từ điện thoại — bạn phê duyệt từng tấm trước khi hiển thị. Album sống mãi sau sự kiện.",
    keywords: [
      "album ảnh đám cưới",
      "chia sẻ ảnh sự kiện",
      "khách tải ảnh",
      "album ảnh chung",
      "lưu giữ kỷ niệm",
      "ảnh sau đám cưới",
    ],
    minutes: 4,
    sections: [
      {
        heading: "Bật tính năng album ảnh",
        body: "Trong phần chỉnh sửa thiệp, bật mục \"Album ảnh\". Bạn có thể đặt thời điểm khách được phép tải ảnh lên — từ trước sự kiện, trong ngày hoặc sau sự kiện. Mỗi lần có ảnh mới chờ duyệt, bạn nhận thông báo ngay.",
      },
      {
        heading: "Khách tải ảnh lên như thế nào",
        body: "Khách mời nhấn vào mục \"Album ảnh\" ngay trong thiệp trên điện thoại, chọn ảnh từ thư viện và tải lên — không cần đăng ký, không cần tải app. Ảnh được nén tự động để tải nhanh hơn trong khi vẫn giữ chất lượng hiển thị cao.",
      },
      {
        heading: "Phê duyệt ảnh trước khi hiển thị",
        body: "Toàn bộ ảnh khách tải lên đều chờ bạn phê duyệt trước khi công khai. Trong bảng điều khiển, bạn xem từng ảnh, chấp nhận hoặc từ chối chỉ bằng một lần nhấn. Ảnh được phê duyệt xuất hiện ngay trong album của tất cả khách mời.",
      },
      {
        heading: "Album sống sau sự kiện",
        body: "Sau ngày sự kiện, thiệp chuyển thành album kỷ niệm. Phần RSVP được ẩn đi; ảnh, lời chúc và lịch trình vẫn còn nguyên. Khách tiếp tục có thể tải thêm ảnh lên — rất phù hợp để thu thập ảnh chụp bởi nhiều người trong cùng buổi tiệc.",
      },
    ],
    faq: [
      {
        q: "Có giới hạn số lượng ảnh không?",
        a: "Trong giai đoạn trải nghiệm sớm, không có giới hạn số ảnh. Mỗi file ảnh tối đa 20 MB; ảnh lớn hơn sẽ được tự động nén trước khi lưu.",
      },
      {
        q: "Tôi có thể tải toàn bộ album về máy không?",
        a: "Có. Nhấn \"Tải về tất cả\" trong bảng điều khiển để tải toàn bộ ảnh đã phê duyệt về dưới dạng file ZIP. Ảnh được lưu ở độ phân giải gốc.",
      },
    ],
  },

  {
    slug: "xuat-ban-va-chia-se",
    enSlug: "publish-and-share",
    title: "Xuất bản và chia sẻ thiệp",
    summary:
      "Từ bản nháp đến thiệp hoạt động — hiểu chế độ nháp, xuất bản, cài đặt quyền riêng tư và cách chia sẻ hiệu quả nhất.",
    keywords: [
      "xuất bản thiệp mời",
      "chia sẻ thiệp cưới",
      "link thiệp mời",
      "mã QR thiệp mời",
      "quyền riêng tư thiệp",
      "gửi thiệp qua Zalo",
    ],
    minutes: 3,
    sections: [
      {
        heading: "Hiểu sự khác biệt giữa Nháp và Xuất bản",
        body: "Thiệp ở chế độ Nháp chỉ bạn mới thấy được — dùng để chỉnh sửa và xem trước thoải mái. Khi nhấn \"Xuất bản\", thiệp trở nên truy cập được qua đường link. Bạn có thể quay lại chế độ Nháp bất cứ lúc nào nếu cần chỉnh sửa lớn trước ngày sự kiện.",
      },
      {
        heading: "Cài đặt quyền riêng tư",
        body: "Mặc định thiệp chỉ truy cập được qua đường link (không xuất hiện trên Google). Nếu muốn thêm bảo mật, bạn có thể bật tùy chọn \"Yêu cầu tên\" — khách phải nhập tên trước khi xem thiệp, giúp hạn chế người lạ truy cập ngoài ý muốn.",
      },
      {
        heading: "Chia sẻ qua Zalo, Messenger, email và mã QR",
        body: "Sau khi xuất bản, sao chép đường link tổng để gửi vào nhóm chat, hoặc tải link riêng cho từng khách từ tab Khách mời. Mã QR có thể tải về dưới dạng PNG để in trên thiệp giấy, bảng thông báo hay màn hình tại sự kiện. Khách nhấn vào mã QR là mở thiệp ngay trên điện thoại.",
      },
    ],
    faq: [
      {
        q: "Link thiệp có hết hạn không?",
        a: "Không. Đường link của bạn hoạt động vĩnh viễn — cả trước, trong và sau sự kiện. Sau ngày sự kiện, thiệp tự động chuyển sang chế độ album kỷ niệm.",
      },
      {
        q: "Tôi có thể xem thiệp trông như thế nào từ góc độ của khách không?",
        a: "Có. Nhấn \"Xem với tư cách khách\" trong bảng điều khiển để mở thiệp đúng như cách khách mời thấy — bao gồm cả lời chào cá nhân và các mục đã được bật.",
      },
    ],
  },

  {
    slug: "nhac-nen",
    enSlug: "background-music",
    title: "Nhạc nền cho thiệp mời",
    summary:
      "Chọn nhạc nền từ thư viện có sẵn hoặc tải lên bài nhạc yêu thích — thiệp sẽ phát nhạc tự động khi khách mở.",
    keywords: [
      "nhạc nền thiệp mời",
      "nhạc thiệp cưới",
      "tải nhạc lên thiệp",
      "thiệp mời có nhạc",
      "nhạc nền đám cưới",
      "âm nhạc thiệp điện tử",
    ],
    minutes: 3,
    sections: [
      {
        heading: "Chọn nhạc từ thư viện Dearly",
        body: "Mỗi mẫu thiết kế đi kèm bài nhạc nền được chọn lọc phù hợp với phong cách — từ piano cổ điển nhẹ nhàng đến acoustic hiện đại. Trong phần chỉnh sửa thiệp, mở tab \"Nhạc nền\" và nhấn vào từng bài để nghe thử trước khi chọn. Nhạc tự động phát (tắt tiếng) khi khách mở thiệp và khách có thể bật âm thanh bằng một lần nhấn.",
      },
      {
        heading: "Tải lên bài nhạc của riêng bạn",
        body: "Nhấn \"Tải nhạc lên\" và chọn file MP3 hoặc M4A từ máy tính hoặc điện thoại. Giới hạn kích thước file là 10 MB — tương đương khoảng 5–7 phút nhạc ở chất lượng thông thường. Nhạc sẽ lặp lại liên tục trong suốt thời gian khách xem thiệp.",
      },
      {
        heading: "Lưu ý về quyền tác giả",
        body: "Dearly chỉ phát nhạc trong thiệp của bạn cho khách mời — không phát công khai hay phân phối thương mại. Dù vậy, bạn nên dùng nhạc bản quyền tự do, nhạc tự sáng tác hoặc nhạc từ thư viện miễn phí bản quyền như Pixabay hoặc Free Music Archive để tránh rủi ro về bản quyền.",
      },
    ],
    faq: [
      {
        q: "Khách mời có nghe thấy nhạc ngay khi mở thiệp không?",
        a: "Trình duyệt trên điện thoại và máy tính thường chặn tự động phát âm thanh. Vì vậy nhạc sẽ bắt đầu ở chế độ tắt tiếng và khách thấy nút bật âm thanh ở góc màn hình — chỉ cần một lần nhấn để nghe nhạc.",
      },
      {
        q: "Tôi có thể tắt nhạc hoàn toàn không?",
        a: "Có. Trong tab Nhạc nền, chọn \"Không có nhạc\" để thiệp hoạt động hoàn toàn im lặng. Tùy chọn này phù hợp nếu bạn muốn thiệp đơn giản, nhẹ và tải nhanh hơn.",
      },
    ],
  },
];

/**
 * Returns a single Vietnamese guide by its Vietnamese slug.
 * Returns undefined if no guide matches — callers should handle with notFound().
 */
export function getViGuide(slug: string): ViGuide | undefined {
  return VI_GUIDES.find((g) => g.slug === slug);
}
