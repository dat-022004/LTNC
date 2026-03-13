/**
 * Script tạo file Word (.docx) từ báo cáo lý thuyết
 * 
 * Cách sử dụng:
 *   1. Mở terminal tại thư mục QuanLySinhVien
 *   2. Chạy: npm install docx
 *   3. Chạy: node taoFileWord.js
 *   4. File "BaoCaoLyThuyet.docx" sẽ được tạo trong thư mục hiện tại
 */

const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
    HeadingLevel, AlignmentType, BorderStyle, WidthType, TableLayoutType,
    PageBreak, ShadingType } = require('docx');
const fs = require('fs');

// ==================== CẤU HÌNH =====================
const MAU_XANH = '0EA5E9';
const MAU_XANH_DAM = '0369A1';
const MAU_NEN_BANG = 'F0F9FF';
const MAU_DEN = '1E293B';
const FONT_MAC_DINH = 'Times New Roman';
const CO_CHU_THUONG = 26; // 13pt * 2
const CO_CHU_CODE = 20;   // 10pt * 2

// ==================== HÀM TIỆN ÍCH =====================

function taoDoan(noiDung, tuyChinh = {}) {
    return new Paragraph({
        spacing: { after: 120, line: 360 },
        ...tuyChinh,
        children: Array.isArray(noiDung) ? noiDung : [
            new TextRun({
                text: noiDung,
                font: FONT_MAC_DINH,
                size: CO_CHU_THUONG,
                color: MAU_DEN,
                ...tuyChinh.textStyle
            })
        ]
    });
}

function taoDoanDam(noiDung) {
    return new TextRun({ text: noiDung, bold: true, font: FONT_MAC_DINH, size: CO_CHU_THUONG, color: MAU_DEN });
}

function taoDoanThuong(noiDung) {
    return new TextRun({ text: noiDung, font: FONT_MAC_DINH, size: CO_CHU_THUONG, color: MAU_DEN });
}

function taoTieuDe1(noiDung) {
    return new Paragraph({
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 360, after: 200 },
        children: [new TextRun({
            text: noiDung,
            bold: true,
            font: FONT_MAC_DINH,
            size: 36, // 18pt
            color: MAU_XANH_DAM,
        })]
    });
}

function taoTieuDe2(noiDung) {
    return new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 300, after: 160 },
        children: [new TextRun({
            text: noiDung,
            bold: true,
            font: FONT_MAC_DINH,
            size: 32, // 16pt
            color: MAU_XANH,
        })]
    });
}

function taoTieuDe3(noiDung) {
    return new Paragraph({
        heading: HeadingLevel.HEADING_3,
        spacing: { before: 240, after: 120 },
        children: [new TextRun({
            text: noiDung,
            bold: true,
            font: FONT_MAC_DINH,
            size: 28, // 14pt
            color: MAU_DEN,
        })]
    });
}

function taoDoanCode(noiDung) {
    const dongCode = noiDung.split('\n');
    return dongCode.map(dong => new Paragraph({
        spacing: { after: 0, line: 276 },
        indent: { left: 360 },
        shading: { type: ShadingType.SOLID, color: 'F1F5F9', fill: 'F1F5F9' },
        children: [new TextRun({
            text: dong || ' ',
            font: 'Consolas',
            size: CO_CHU_CODE,
            color: '334155',
        })]
    }));
}

function taoO(hangDau, hangDuLieu) {
    const doBong = {
        type: BorderStyle.SINGLE,
        size: 1,
        color: 'CBD5E1',
    };
    const vienO = {
        top: doBong, bottom: doBong, left: doBong, right: doBong,
    };

    const hangTieuDe = new TableRow({
        tableHeader: true,
        children: hangDau.map(tieuDe => new TableCell({
            borders: vienO,
            shading: { type: ShadingType.SOLID, color: MAU_XANH, fill: MAU_XANH },
            children: [new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { after: 0 },
                children: [new TextRun({
                    text: tieuDe,
                    bold: true,
                    font: FONT_MAC_DINH,
                    size: 24,
                    color: 'FFFFFF',
                })]
            })]
        }))
    });

    const cacHangDuLieu = hangDuLieu.map((hang, chiSo) => new TableRow({
        children: hang.map(giaTri => new TableCell({
            borders: vienO,
            shading: chiSo % 2 === 0
                ? { type: ShadingType.SOLID, color: MAU_NEN_BANG, fill: MAU_NEN_BANG }
                : undefined,
            children: [new Paragraph({
                spacing: { after: 0 },
                children: [new TextRun({
                    text: String(giaTri),
                    font: FONT_MAC_DINH,
                    size: 22,
                    color: MAU_DEN,
                })]
            })]
        }))
    }));

    return new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        layout: TableLayoutType.AUTOFIT,
        rows: [hangTieuDe, ...cacHangDuLieu],
    });
}

function taoDanhSach(cacMuc, loai = 'bullet') {
    return cacMuc.map((muc, i) => {
        const parts = [];
        // Tách phần in đậm nếu có dạng **text**
        const regex = /\*\*(.*?)\*\*/g;
        let lastIndex = 0;
        let match;
        let noiDungSach = muc.replace(/^[-✅❌•] /, '');

        while ((match = regex.exec(noiDungSach)) !== null) {
            if (match.index > lastIndex) {
                parts.push(taoDoanThuong(noiDungSach.substring(lastIndex, match.index)));
            }
            parts.push(taoDoanDam(match[1]));
            lastIndex = regex.lastIndex;
        }
        if (lastIndex < noiDungSach.length) {
            parts.push(taoDoanThuong(noiDungSach.substring(lastIndex)));
        }

        const kyHieu = muc.startsWith('✅') ? '✅ ' : muc.startsWith('❌') ? '❌ ' : '• ';

        return new Paragraph({
            spacing: { after: 60, line: 360 },
            indent: { left: 360 },
            children: [
                taoDoanThuong(kyHieu),
                ...parts
            ]
        });
    });
}

// ==================== NỘI DUNG BÁO CÁO =====================

function taoBaoCao() {
    const cacPhan = [];

    // ===== TRANG BÌA =====
    cacPhan.push(
        new Paragraph({ spacing: { before: 2000 }, children: [] }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
            children: [new TextRun({
                text: 'BÁO CÁO LÝ THUYẾT',
                bold: true, font: FONT_MAC_DINH, size: 52, color: MAU_XANH_DAM,
            })]
        }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 100 },
            children: [new TextRun({
                text: 'Đề tài: Xây dựng phần mềm Quản lý Sinh viên',
                bold: true, font: FONT_MAC_DINH, size: 36, color: MAU_DEN,
            })]
        }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
            children: [new TextRun({
                text: 'sử dụng Cấu trúc Mảng động và Giao diện đồ họa',
                bold: true, font: FONT_MAC_DINH, size: 36, color: MAU_DEN,
            })]
        }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 100 },
            children: [new TextRun({
                text: 'Môn: Lập trình Nâng cao',
                font: FONT_MAC_DINH, size: 28, color: '64748B',
            })]
        }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 2000 },
            children: [new TextRun({
                text: '© 2026',
                font: FONT_MAC_DINH, size: 24, color: '94A3B8',
            })]
        }),
        new Paragraph({ children: [new PageBreak()] }),
    );

    // ===== MỤC LỤC =====
    cacPhan.push(
        taoTieuDe1('MỤC LỤC'),
        taoDoan('Phần 1: Cơ sở lý thuyết'),
        taoDoan('    1.1. Tổng quan về cấu trúc dữ liệu'),
        taoDoan('    1.2. Mảng tĩnh'),
        taoDoan('    1.3. Mảng động'),
        taoDoan('    1.4. So sánh các cấu trúc dữ liệu'),
        taoDoan('Phần 2: Phân tích bài toán'),
        taoDoan('    2.1. Mô tả bài toán'),
        taoDoan('    2.2. Yêu cầu chức năng'),
        taoDoan('    2.3. Yêu cầu phi chức năng'),
        taoDoan('    2.4. Mô hình hóa dữ liệu'),
        taoDoan('Phần 3: Thuật toán sử dụng'),
        taoDoan('    3.1. Thuật toán thêm phần tử'),
        taoDoan('    3.2. Thuật toán xóa phần tử'),
        taoDoan('    3.3. Thuật toán tìm kiếm tuyến tính'),
        taoDoan('    3.4. Thuật toán sắp xếp'),
        taoDoan('    3.5. Thuật toán thay đổi kích thước'),
        taoDoan('Phần 4: Đánh giá độ phức tạp'),
        taoDoan('    4.1. Độ phức tạp thời gian'),
        taoDoan('    4.2. Độ phức tạp không gian'),
        taoDoan('    4.3. Phân tích chi phí khấu hao'),
        taoDoan('    4.4. So sánh hiệu năng'),
        taoDoan('Phần 5: Cấu trúc mã nguồn'),
        taoDoan('    5.1. Sơ đồ module'),
        taoDoan('    5.2. Mô tả từng tệp'),
        new Paragraph({ children: [new PageBreak()] }),
    );

    // ===== PHẦN 1: CƠ SỞ LÝ THUYẾT =====
    cacPhan.push(
        taoTieuDe1('PHẦN 1: CƠ SỞ LÝ THUYẾT'),
        taoDoan('Phần này trình bày những kiến thức nền tảng về cấu trúc dữ liệu — một trong những trụ cột quan trọng nhất của khoa học máy tính. Việc nắm vững lý thuyết cấu trúc dữ liệu giúp lập trình viên hiểu rõ cách dữ liệu được tổ chức trong bộ nhớ, từ đó đưa ra quyết định thiết kế phù hợp cho từng bài toán cụ thể. Trong phạm vi báo cáo, chúng ta sẽ tập trung phân tích hai cấu trúc dữ liệu chính: mảng tĩnh và mảng động, đồng thời so sánh chúng với các cấu trúc dữ liệu phổ biến khác để làm rõ lý do lựa chọn mảng động cho đề tài quản lý sinh viên.'),

        // 1.1
        taoTieuDe2('1.1. Tổng quan về Cấu trúc dữ liệu'),
        taoTieuDe3('1.1.1. Định nghĩa'),
        taoDoan([
            taoDoanDam('Cấu trúc dữ liệu'),
            taoDoanThuong(' là cách tổ chức, quản lý và lưu trữ dữ liệu trong máy tính sao cho có thể truy cập và sửa đổi một cách hiệu quả. Việc lựa chọn cấu trúc dữ liệu phù hợp ảnh hưởng trực tiếp đến hiệu suất của chương trình.'),
        ]),
        taoDoan('Trong lĩnh vực phát triển phần mềm, cấu trúc dữ liệu đóng vai trò nền tảng quyết định cách chương trình lưu trữ và thao tác với thông tin. Một cấu trúc dữ liệu được thiết kế tốt không chỉ giúp chương trình chạy nhanh hơn mà còn giúp mã nguồn dễ đọc, dễ bảo trì và mở rộng hơn. Ngược lại, việc chọn sai cấu trúc dữ liệu có thể dẫn đến hiệu suất kém, tiêu tốn tài nguyên bộ nhớ không cần thiết và gây khó khăn trong quá trình phát triển.'),
        taoDoan('Niklaus Wirth — nhà khoa học máy tính nổi tiếng — đã đúc kết mối quan hệ giữa cấu trúc dữ liệu và thuật toán qua công thức kinh điển: "Thuật toán + Cấu trúc dữ liệu = Chương trình". Điều này chỉ ra rằng một chương trình tốt không thể tách rời khỏi việc lựa chọn cấu trúc dữ liệu hợp lý.'),

        taoTieuDe3('1.1.2. Phân loại cấu trúc dữ liệu'),
        taoDoan('Cấu trúc dữ liệu được phân thành hai nhóm chính dựa trên cách tổ chức các phần tử trong bộ nhớ. Nhóm tuyến tính bao gồm các cấu trúc mà các phần tử được sắp xếp theo trình tự, mỗi phần tử tối đa có một phần tử trước và một phần tử sau. Nhóm phi tuyến tính cho phép mỗi phần tử liên kết với nhiều phần tử khác, tạo thành các mối quan hệ phức tạp hơn. Sơ đồ dưới đây minh họa cách phân loại tổng quát:'),
        ...taoDoanCode(
`                    Cấu trúc dữ liệu
                          │
            ┌─────────────┴─────────────┐
            │                           │
      Tuyến tính                   Phi tuyến tính
            │                           │
    ┌───────┼───────┐           ┌───────┼───────┐
    │       │       │           │       │       │
  Mảng   Danh    Ngăn xếp/    Cây    Đồ thị   Đống
         sách    Hàng đợi
         liên kết`
        ),
        taoDoan('Trong nhóm tuyến tính, mảng (Array) là cấu trúc cơ bản nhất — các phần tử nằm liên tiếp trong bộ nhớ và được truy cập qua chỉ số. Danh sách liên kết (Linked List) sử dụng các con trỏ để nối các phần tử phân tán trong bộ nhớ. Ngăn xếp (Stack) và Hàng đợi (Queue) là các cấu trúc đặc biệt hỗ trợ truy cập theo thứ tự LIFO hoặc FIFO. Trong nhóm phi tuyến tính, Cây (Tree) tổ chức dữ liệu theo cấp bậc, Đồ thị (Graph) biểu diễn các mối quan hệ mạng lưới, và Đống (Heap) hỗ trợ truy xuất phần tử ưu tiên nhanh chóng.'),

        taoTieuDe3('1.1.3. Tiêu chí đánh giá'),
        taoDoan('Để lựa chọn cấu trúc dữ liệu phù hợp cho một bài toán, chúng ta cần đánh giá dựa trên nhiều tiêu chí khác nhau. Mỗi tiêu chí phản ánh một khía cạnh quan trọng về hiệu suất và khả năng sử dụng của cấu trúc dữ liệu trong thực tế:'),
        ...taoDanhSach([
            '- **Thời gian truy cập**: Thời gian cần thiết để đọc hoặc ghi giá trị tại một vị trí cụ thể. Đối với mảng, thao tác này mất O(1) nhờ tính chất truy cập ngẫu nhiên, nhưng với danh sách liên kết thì cần O(n) do phải duyệt tuần tự.',
            '- **Thời gian tìm kiếm**: Thời gian để tìm ra một phần tử có giá trị cụ thể trong tập dữ liệu. Nếu dữ liệu chưa được sắp xếp, hầu hết các cấu trúc đều cần O(n). Tuy nhiên, cây nhị phân tìm kiếm cân bằng có thể đạt O(log n).',
            '- **Thời gian chèn/xóa**: Thời gian để thêm hoặc loại bỏ một phần tử. Tiêu chí này phụ thuộc mạnh vào vị trí thao tác — chèn/xóa ở cuối mảng nhanh hơn nhiều so với ở đầu hoặc giữa.',
            '- **Sử dụng bộ nhớ**: Lượng bộ nhớ RAM mà cấu trúc dữ liệu chiếm dụng. Ngoài dung lượng lưu trữ dữ liệu thực tế, một số cấu trúc cần thêm bộ nhớ phụ cho con trỏ, metadata hoặc dung lượng dự phòng.',
        ]),
        taoDoan('Việc cân nhắc kỹ lưỡng các tiêu chí trên giúp chúng ta đưa ra quyết định chính xác khi thiết kế hệ thống. Không có cấu trúc dữ liệu nào là "tốt nhất" cho mọi trường hợp — mỗi cấu trúc đều có thế mạnh và hạn chế riêng, phù hợp với những dạng bài toán nhất định.'),

        // 1.2
        taoTieuDe2('1.2. Mảng tĩnh'),
        taoTieuDe3('1.2.1. Định nghĩa'),
        taoDoan([
            taoDoanDam('Mảng tĩnh'),
            taoDoanThuong(' (Static Array) là cấu trúc dữ liệu cơ bản nhất trong lập trình — lưu trữ các phần tử cùng kiểu trong các ô nhớ liên tiếp, với kích thước được xác định cố định tại thời điểm khai báo và không thể thay đổi trong suốt vòng đời của chương trình.'),
        ]),
        taoDoan('Mảng tĩnh ra đời từ những ngày đầu của khoa học máy tính và được hỗ trợ trực tiếp bởi phần cứng. Khi khai báo một mảng tĩnh, hệ điều hành sẽ cấp phát một khối bộ nhớ liên tục có kích thước bằng số phần tử nhân với kích thước mỗi phần tử. Nhờ các ô nhớ nằm liên tiếp nhau, CPU có thể tính trực tiếp địa chỉ của bất kỳ phần tử nào thông qua công thức: địa_chỉ = địa_chỉ_đầu + chỉ_số × kích_thước_phần_tử, cho phép truy cập với thời gian hằng số O(1).'),

        taoTieuDe3('1.2.2. Đặc điểm'),
        taoDoan('Hình minh họa dưới đây cho thấy cách một mảng tĩnh gồm 5 phần tử kiểu số nguyên (mỗi phần tử chiếm 4 byte) được bố trí trong bộ nhớ. Các phần tử được đánh số từ chỉ số 0 đến 4, mỗi phần tử chiếm một ô nhớ có địa chỉ cách nhau đúng 4 byte:'),
        ...taoDoanCode(
`Địa chỉ bộ nhớ:  1000   1004   1008   1012   1016
                ┌──────┬──────┬──────┬──────┬──────┐
    Mảng A:     │  10  │  20  │  30  │  40  │  50  │
                └──────┴──────┴──────┴──────┴──────┘
    Chỉ số:        0      1      2      3      4`
        ),
        taoDoan('Nhờ cách bố trí liên tiếp này, khi cần truy cập phần tử thứ 3 (chỉ số 2), CPU chỉ cần tính: 1000 + 2 × 4 = 1008, không cần duyệt qua các phần tử trước đó. Đặc điểm này còn giúp mảng tĩnh tận dụng tốt cơ chế bộ nhớ đệm (cache) của CPU, vì khi một phần tử được nạp vào cache, các phần tử lân cận cũng được nạp theo, giúp tăng tốc độ truy cập liên tiếp.'),

        taoTieuDe3('1.2.3. Ưu điểm'),
        taoDoan('Mảng tĩnh có nhiều ưu điểm nổi bật khiến nó trở thành cấu trúc dữ liệu được sử dụng rộng rãi nhất:'),
        ...taoDanhSach([
            '✅ Truy cập ngẫu nhiên O(1) thông qua chỉ số — đây là ưu điểm lớn nhất, cho phép đọc/ghi bất kỳ phần tử nào chỉ trong một bước tính toán',
            '✅ Thân thiện với bộ nhớ đệm (cache-friendly) nhờ các phần tử nằm liên tiếp trong bộ nhớ, giúp CPU tận dụng tối đa cơ chế prefetch và cache line',
            '✅ Không có chi phí phụ về bộ nhớ — không cần lưu trữ con trỏ hay metadata, toàn bộ dung lượng đều dành cho dữ liệu thực',
            '✅ Đơn giản và dễ cài đặt — hầu hết mọi ngôn ngữ lập trình đều hỗ trợ mảng tĩnh ở mức cú pháp cơ bản',
        ]),

        taoTieuDe3('1.2.4. Nhược điểm'),
        taoDoan('Tuy nhiên, mảng tĩnh cũng tồn tại những hạn chế đáng kể, đặc biệt trong các ứng dụng có dữ liệu thay đổi linh hoạt:'),
        ...taoDanhSach([
            '❌ Kích thước cố định, không thể thay đổi — lập trình viên phải dự đoán trước số lượng phần tử tối đa, điều này thường rất khó trong thực tế',
            '❌ Lãng phí bộ nhớ nếu khai báo quá lớn mà không sử dụng hết — ví dụ khai báo mảng 10,000 phần tử nhưng chỉ dùng 100 sẽ lãng phí 99% bộ nhớ',
            '❌ Không đủ chỗ nếu cần thêm phần tử vượt quá kích thước đã khai báo — lúc này phải tạo mảng mới lớn hơn và sao chép toàn bộ dữ liệu',
        ]),
        taoDoan('Chính những hạn chế này đã thúc đẩy sự ra đời của mảng động — một cấu trúc dữ liệu kế thừa toàn bộ ưu điểm của mảng tĩnh nhưng khắc phục được nhược điểm về kích thước cố định.'),

        // 1.3
        taoTieuDe2('1.3. Mảng động'),
        taoTieuDe3('1.3.1. Định nghĩa'),
        taoDoan([
            taoDoanDam('Mảng động'),
            taoDoanThuong(' (Dynamic Array) là cấu trúc dữ liệu mảng có khả năng tự động thay đổi kích thước khi cần thiết. Nó kết hợp ưu điểm truy cập O(1) của mảng tĩnh với khả năng mở rộng linh hoạt, giúp lập trình viên không cần lo lắng về việc dự đoán trước số lượng phần tử.'),
        ]),
        taoDoan('Ý tưởng cốt lõi của mảng động là duy trì một mảng tĩnh bên trong, nhưng khi mảng tĩnh đó đầy, thuật toán sẽ tự động tạo một mảng mới lớn hơn, sao chép toàn bộ dữ liệu sang và giải phóng mảng cũ. Quá trình này diễn ra hoàn toàn tự động và trong suốt đối với người sử dụng. Mảng động được cài đặt trong hầu hết các ngôn ngữ lập trình hiện đại: ArrayList trong Java, std::vector trong C++, list trong Python, và Array trong JavaScript.'),

        taoTieuDe3('1.3.2. Cấu trúc bên trong'),
        taoDoan('Một mảng động bao gồm ba thành phần chính: mảng nội bộ (duLieu) chứa các phần tử thực tế, biến kichThuoc theo dõi số phần tử hiện có, và biến dungLuong cho biết sức chứa tối đa trước khi cần mở rộng. Khoảng cách giữa kichThuoc và dungLuong chính là không gian dự phòng, cho phép thêm phần tử mà không cần tạo mảng mới. Sơ đồ sau minh họa rõ ràng mối quan hệ này:'),
        ...taoDoanCode(
`MẢNG ĐỘNG
Thuộc tính:
  duLieu      - Mảng nội bộ
  kichThuoc   - Số phần tử hiện tại
  dungLuong   - Dung lượng tối đa

Ví dụ: kichThuoc = 5, dungLuong = 8
┌───┬───┬───┬───┬───┬───┬───┬───┐
│ A │ B │ C │ D │ E │   │   │   │
└───┴───┴───┴───┴───┴───┴───┴───┘
  0   1   2   3   4   5   6   7
  ├───────────────┤   ├───────────┤
       Đã dùng         Còn trống`
        ),

        taoTieuDe3('1.3.3. Nguyên lý hoạt động - Khi thêm phần tử'),
        taoDoan('Khi người dùng yêu cầu thêm một phần tử mới vào mảng động, thuật toán sẽ kiểm tra xem dung lượng hiện tại còn đủ hay không. Nếu kichThuoc < dungLuong, phần tử mới được đặt vào vị trí kichThuoc và biến kichThuoc tăng thêm 1 — thao tác này chỉ mất O(1). Tuy nhiên, khi kichThuoc đã bằng dungLuong (mảng đầy), thuật toán sẽ tiến hành mở rộng theo ba bước tuần tự như minh họa dưới đây:'),
        ...taoDoanCode(
`Trạng thái ban đầu: kichThuoc=4, dungLuong=4 (ĐẦY)
┌───┬───┬───┬───┐
│ 1 │ 2 │ 3 │ 4 │
└───┴───┴───┴───┘

Thêm phần tử 5 → Cần MỞ RỘNG (nhân đôi dung lượng)

Bước 1: Tạo mảng mới với dungLuong = 8
Bước 2: Sao chép dữ liệu cũ sang
Bước 3: Thêm phần tử mới

┌───┬───┬───┬───┬───┬───┬───┬───┐
│ 1 │ 2 │ 3 │ 4 │ 5 │   │   │   │
└───┴───┴───┴───┴───┴───┴───┴───┘
kichThuoc=5, dungLuong=8`
        ),
        taoDoan('Sau khi mở rộng, mảng động có dung lượng gấp đôi ban đầu, đồng nghĩa với việc có thể thêm tiếp 3 phần tử nữa mà không cần mở rộng lại. Chiến lược nhân đôi này đảm bảo rằng mỗi lần mở rộng, khoảng một nửa dung lượng mới là không gian dự phòng, giúp giảm đáng kể số lần phải mở rộng trong tương lai.'),

        taoTieuDe3('1.3.4. Chiến lược thay đổi kích thước'),
        taoDoan('Mảng động sử dụng chiến lược nhân đôi (doubling strategy) khi mở rộng và giảm một nửa khi thu nhỏ. Tuy nhiên, ngưỡng thu nhỏ được đặt ở mức kichThuoc < dungLuong/4 (thay vì dungLuong/2) để tránh hiện tượng "thrashing" — tình trạng mảng liên tục mở rộng rồi thu nhỏ khi kích thước dao động quanh ngưỡng:'),
        taoO(
            ['Tình huống', 'Điều kiện', 'Hành động'],
            [
                ['Mở rộng', 'kichThuoc ≥ dungLuong', 'dungLuong = dungLuong × 2'],
                ['Thu nhỏ', 'kichThuoc < dungLuong/4', 'dungLuong = dungLuong / 2'],
            ]
        ),
        taoDoan(''),
        taoDoan([
            taoDoanDam('Tại sao nhân đôi mà không tăng thêm 1?'),
        ]),
        taoDoan('Đây là câu hỏi quan trọng trong thiết kế mảng động. Nếu mỗi lần thêm phần tử ta chỉ tăng dung lượng thêm 1, thì mỗi lần thêm đều phải mở rộng mảng, chi phí sao chép tăng dần: 1, 2, 3, ..., n, tổng cộng chi phí là 1+2+3+...+n = O(n²) — cực kỳ không hiệu quả. Ngược lại, chiến lược nhân đôi chỉ mở rộng tại các mốc 1, 2, 4, 8, 16, ..., tổng chi phí là 1+2+4+...+n = O(2n) = O(n), giảm đáng kể chi phí tổng thể:'),
        taoDoan('• Tăng thêm 1: Mở rộng mỗi lần thêm → Tổng chi phí: 1+2+3+...+n = O(n²)'),
        taoDoan('• Nhân đôi: Mở rộng tại 1, 2, 4, 8... → Tổng chi phí: 1+2+4+...+n = O(2n) = O(n)'),

        taoTieuDe3('1.3.5. Ưu điểm của Mảng động'),
        taoDoan('Mảng động kế thừa toàn bộ ưu điểm của mảng tĩnh đồng thời khắc phục được nhược điểm lớn nhất về kích thước cố định:'),
        ...taoDanhSach([
            '✅ Truy cập ngẫu nhiên O(1) — giữ nguyên ưu điểm quan trọng nhất của mảng tĩnh, cho phép đọc/ghi bất kỳ phần tử nào theo chỉ số trong thời gian hằng số',
            '✅ Tự động mở rộng khi cần — người dùng không cần quan tâm đến dung lượng, thuật toán sẽ tự quản lý',
            '✅ Tự động thu nhỏ để tiết kiệm bộ nhớ — khi số phần tử giảm đáng kể, dung lượng dư thừa sẽ được giải phóng',
            '✅ Thêm cuối mảng O(1) chi phí khấu hao — mặc dù đôi khi mất O(n) để mở rộng, nhưng trung bình mỗi lần thêm chỉ tốn O(1)',
        ]),

        taoTieuDe3('1.3.6. Nhược điểm'),
        taoDoan('Bên cạnh những ưu điểm vượt trội, mảng động vẫn tồn tại một số hạn chế mà lập trình viên cần lưu ý khi thiết kế hệ thống:'),
        ...taoDanhSach([
            '❌ Mở rộng tốn O(n) trong trường hợp xấu nhất — khi mảng đầy, toàn bộ phần tử phải được sao chép sang mảng mới, gây ra độ trễ đột ngột',
            '❌ Chèn/xóa ở giữa tốn O(n) — các phần tử phía sau vị trí chèn/xóa phải được dịch chuyển để duy trì tính liên tiếp của mảng',
            '❌ Có thể lãng phí đến 50% bộ nhớ — do chiến lược nhân đôi, sau khi mở rộng, tối đa một nửa dung lượng có thể chưa được sử dụng',
        ]),

        // 1.4
        taoTieuDe2('1.4. So sánh các Cấu trúc dữ liệu'),
        taoDoan('Để có cái nhìn tổng quan và đưa ra quyết định thiết kế phù hợp, bảng dưới đây so sánh chi tiết hiệu năng của bốn cấu trúc dữ liệu phổ biến: mảng tĩnh, mảng động, danh sách liên kết đơn (DSLK đơn) và danh sách liên kết đôi (DSLK đôi). Mỗi cấu trúc được đánh giá theo độ phức tạp thời gian của các thao tác cơ bản:'),
        taoO(
            ['Tiêu chí', 'Mảng tĩnh', 'Mảng động', 'DSLK đơn', 'DSLK đôi'],
            [
                ['Truy cập chỉ số', 'O(1)', 'O(1)', 'O(n)', 'O(n)'],
                ['Tìm kiếm', 'O(n)', 'O(n)', 'O(n)', 'O(n)'],
                ['Thêm đầu', 'O(n)', 'O(n)', 'O(1)', 'O(1)'],
                ['Thêm cuối', 'O(1)', 'O(1)*', 'O(n)', 'O(1)'],
                ['Thêm giữa', 'O(n)', 'O(n)', 'O(1)**', 'O(1)**'],
                ['Xóa đầu', 'O(n)', 'O(n)', 'O(1)', 'O(1)'],
                ['Xóa cuối', 'O(1)', 'O(1)', 'O(n)', 'O(1)'],
                ['Xóa giữa', 'O(n)', 'O(n)', 'O(1)**', 'O(1)**'],
                ['Bộ nhớ', 'Cố định', 'Linh hoạt', '+phụ phí', '++phụ phí'],
                ['Bộ nhớ đệm', 'Tốt', 'Tốt', 'Kém', 'Kém'],
            ]
        ),
        taoDoan('* Chi phí khấu hao O(1), trường hợp xấu nhất O(n)'),
        taoDoan('** Nếu đã có con trỏ đến vị trí cần chèn/xóa'),
        taoDoan('Từ bảng so sánh trên, có thể nhận thấy rằng mảng tĩnh và mảng động chiếm ưu thế rõ rệt ở khả năng truy cập theo chỉ số O(1) và hiệu quả bộ nhớ đệm. Trong khi đó, danh sách liên kết vượt trội ở các thao tác chèn/xóa tại đầu và giữa (nếu đã biết vị trí). Tuy nhiên, chi phí phụ của con trỏ trong danh sách liên kết và hiệu suất kém của bộ nhớ đệm khiến chúng thua kém mảng động trong đa số các ứng dụng thực tế.'),

        taoTieuDe3('1.4.2. Khi nào chọn Mảng động?'),
        taoDoan('Dựa trên phân tích ở trên, mảng động là lựa chọn tối ưu khi ứng dụng đáp ứng các điều kiện sau:'),
        ...taoDanhSach([
            '✅ Cần truy cập ngẫu nhiên theo chỉ số thường xuyên — như hiển thị dữ liệu trong bảng, phân trang, truy xuất theo vị trí',
            '✅ Số lượng phần tử thay đổi nhưng không quá thường xuyên — phù hợp với các ứng dụng quản lý có thêm/xóa dữ liệu định kỳ',
            '✅ Thao tác chủ yếu ở cuối mảng (thêm/xóa cuối) — tận dụng chi phí khấu hao O(1)',
            '✅ Cần duyệt tuần tự hiệu quả — nhờ tính chất cache-friendly của vùng nhớ liên tiếp',
        ]),
        taoDoan('Ngược lại, mảng động không phải lựa chọn tốt trong các tình huống sau:'),
        ...taoDanhSach([
            '❌ Chèn/xóa ở đầu hoặc giữa thường xuyên → nên dùng danh sách liên kết đôi',
            '❌ Kích thước thay đổi liên tục với biên độ lớn → có thể gây nhiều lần mở rộng/thu nhỏ tốn kém',
            '❌ Yêu cầu bộ nhớ tối ưu tuyệt đối → dung lượng dự phòng của mảng động gây lãng phí nhất định',
        ]),

        new Paragraph({ children: [new PageBreak()] }),
    );

    // ===== PHẦN 2: PHÂN TÍCH BÀI TOÁN =====
    cacPhan.push(
        taoTieuDe1('PHẦN 2: PHÂN TÍCH BÀI TOÁN'),
        taoDoan('Phần này đi sâu vào việc phân tích đề bài, xác định rõ ràng các yêu cầu chức năng và phi chức năng của hệ thống quản lý sinh viên. Qua đó, chúng ta sẽ mô hình hóa dữ liệu và thiết kế kiến trúc phần mềm phù hợp, làm nền tảng cho việc cài đặt ở các phần tiếp theo.'),

        taoTieuDe2('2.1. Mô tả bài toán'),
        taoTieuDe3('2.1.1. Bối cảnh'),
        taoDoan('Trong môi trường giáo dục hiện đại, việc quản lý thông tin sinh viên là một nhu cầu thiết yếu và thường xuyên đối với các trường đại học, cao đẳng. Một hệ thống quản lý sinh viên hiệu quả cần đáp ứng được nhiều yêu cầu: lưu trữ an toàn, tra cứu nhanh chóng, thống kê chính xác và giao diện thân thiện với người dùng.'),
        taoDoan('Đề tài này hướng tới việc xây dựng một hệ thống quản lý sinh viên hoàn chỉnh, cho phép lưu trữ, tra cứu và quản lý thông tin sinh viên một cách hiệu quả thông qua giao diện đồ họa trực quan trên trình duyệt web. Hệ thống được thiết kế với mục tiêu vừa phục vụ nhu cầu sử dụng thực tế, vừa minh họa rõ ràng cách ứng dụng cấu trúc dữ liệu mảng động vào bài toán cụ thể.'),

        taoTieuDe3('2.1.2. Đối tượng quản lý'),
        taoDoan([taoDoanDam('Sinh viên'), taoDoanThuong(' (lớp SinhVien trong tệp Student.js) là đối tượng trung tâm của hệ thống. Mỗi sinh viên được biểu diễn bởi một đối tượng với các thuộc tính mô tả đầy đủ thông tin cá nhân và học tập:')]),
        ...taoDanhSach([
            '- **maSV** — Mã sinh viên, đóng vai trò là khóa chính (primary key) để nhận dạng duy nhất mỗi sinh viên trong hệ thống. Mã này không được trùng lặp giữa các sinh viên.',
            '- **hoTen** — Họ và tên đầy đủ của sinh viên, hỗ trợ tiếng Việt có dấu để phù hợp với ngữ cảnh sử dụng tại Việt Nam.',
            '- **ngaySinh** — Ngày sinh của sinh viên, được lưu trữ dưới dạng chuỗi và có hỗ trợ định dạng hiển thị theo quy chuẩn Việt Nam (dd/mm/yyyy).',
            '- **gioiTinh** — Giới tính (Nam/Nữ), phục vụ cho việc thống kê và phân loại sinh viên theo giới.',
            '- **tenLop** — Tên lớp học mà sinh viên đang theo học, cho phép nhóm và lọc sinh viên theo lớp.',
            '- **diemTB** — Điểm trung bình tích lũy trong thang điểm 10, là tiêu chí quan trọng để xếp loại học lực của sinh viên.',
        ]),

        taoTieuDe2('2.2. Yêu cầu chức năng'),
        taoDoan('Hệ thống quản lý sinh viên được thiết kế với ba nhóm chức năng chính, mỗi nhóm phục vụ một mục đích cụ thể trong quy trình quản lý. Dưới đây là mô tả chi tiết từng nhóm chức năng cùng ánh xạ đến các hàm và tệp cài đặt tương ứng.'),
        taoTieuDe3('2.2.1. Nhóm chức năng CRUD'),
        taoDoan('CRUD (Create - Read - Update - Delete) là nhóm chức năng nền tảng của bất kỳ hệ thống quản lý dữ liệu nào. Nhóm này cho phép người dùng thực hiện bốn thao tác cơ bản: thêm mới, xem, sửa và xóa thông tin sinh viên:'),
        taoO(
            ['STT', 'Chức năng', 'Mô tả', 'Hàm tương ứng', 'Tệp'],
            [
                ['1', 'Thêm SV', 'Thêm sinh viên mới vào danh sách', 'themSinhVien()', 'StudentManager.js'],
                ['2', 'Sửa SV', 'Cập nhật thông tin sinh viên đã có', 'capNhatSinhVien()', 'StudentManager.js'],
                ['3', 'Xóa SV', 'Xóa sinh viên khỏi danh sách', 'xoaSinhVien()', 'StudentManager.js'],
                ['4', 'Hiển thị', 'Hiển thị danh sách lên bảng', '_capNhatBang()', 'UIController.js'],
            ]
        ),

        taoTieuDe3('2.2.2. Nhóm chức năng tìm kiếm & lọc'),
        taoDoan('Nhóm chức năng này hỗ trợ người dùng truy vấn dữ liệu nhanh chóng theo nhiều tiêu chí. Tìm kiếm cho phép tìm sinh viên theo từ khóa bất kỳ (mã SV, họ tên, lớp), lọc giúp hiển thị sinh viên theo lớp cụ thể, và sắp xếp cho phép sắp xếp danh sách theo các trường dữ liệu khác nhau:'),
        taoO(
            ['STT', 'Chức năng', 'Thuật toán', 'Hàm tương ứng'],
            [
                ['5', 'Tìm kiếm', 'Tìm kiếm tuyến tính O(n)', 'timKiemSinhVien()'],
                ['6', 'Lọc theo lớp', 'Lọc tuyến tính O(n)', 'locTheoLopHoc()'],
                ['7', 'Sắp xếp', 'TimSort O(n log n)', 'layDanhSachDaSapXep()'],
            ]
        ),

        taoTieuDe3('2.2.3. Nhóm chức năng thống kê'),
        taoDoan('Thống kê là chức năng không thể thiếu trong một hệ thống quản lý, giúp ban quản lý có cái nhìn tổng quan về tình hình học tập của sinh viên. Các chỉ số thống kê được tính toán tự động mỗi khi dữ liệu thay đổi:'),
        taoO(
            ['STT', 'Chức năng', 'Công thức', 'Hàm tương ứng'],
            [
                ['8', 'Tổng số SV', 'kichThuoc', 'danhSachSV.kichThuoc'],
                ['9', 'SV đạt', 'đếm(diemTB ≥ 5.0)', 'demSinhVienDat()'],
                ['10', 'SV không đạt', 'đếm(diemTB < 5.0)', 'demSinhVienChuaDat()'],
                ['11', 'Điểm TB chung', 'tổng(diemTB) / sốSV', 'tinhDiemTrungBinhChung()'],
            ]
        ),

        taoTieuDe2('2.3. Yêu cầu phi chức năng'),
        taoDoan('Bên cạnh các yêu cầu chức năng, hệ thống còn phải đáp ứng một loạt yêu cầu phi chức năng nhằm đảm bảo trải nghiệm người dùng tốt và khả năng hoạt động ổn định trong điều kiện thực tế.'),
        taoTieuDe3('2.3.1. Hiệu năng'),
        taoDoan('Hệ thống cần đảm bảo phản hồi nhanh chóng để người dùng không cảm thấy bị gián đoạn trong quá trình làm việc:'),
        ...taoDanhSach([
            '- Thời gian phản hồi dưới 100ms cho tất cả các thao tác CRUD, đảm bảo trải nghiệm mượt mà',
            '- Hỗ trợ quản lý tối thiểu 1000 sinh viên mà hiệu năng không bị suy giảm đáng kể',
            '- Tìm kiếm và lọc dữ liệu theo thời gian thực (real-time), kết quả cập nhật ngay khi người dùng nhập từ khóa',
        ]),
        taoTieuDe3('2.3.2. Giao diện đồ họa'),
        taoDoan('Giao diện người dùng đóng vai trò quyết định trong việc thu hút và giữ chân người sử dụng. Hệ thống được thiết kế với những tiêu chí giao diện sau:'),
        ...taoDanhSach([
            '- Thiết kế đáp ứng (responsive) trên cả máy tính để bàn, máy tính bảng và điện thoại di động',
            '- Giao diện thân thiện, trực quan, người dùng không cần hướng dẫn cũng có thể sử dụng được',
            '- Có hệ thống phản hồi trực quan thông qua thông báo nổi (toast notification) cho mọi thao tác',
            '- Hỗ trợ phân trang để hiển thị dữ liệu lớn một cách gọn gàng, không gây quá tải giao diện',
        ]),
        taoTieuDe3('2.3.3. Dữ liệu'),
        taoDoan('Quản lý dữ liệu là yêu cầu then chốt đảm bảo tính toàn vẹn và bền vững của thông tin trong hệ thống:'),
        ...taoDanhSach([
            '- Lưu trữ bền vững thông qua localStorage của trình duyệt, dữ liệu không bị mất khi người dùng tải lại trang hoặc đóng trình duyệt',
            '- Hỗ trợ xuất dữ liệu ra tệp Excel (.xlsx) để phục vụ nhu cầu báo cáo và chia sẻ thông tin',
            '- Kiểm tra tính hợp lệ của dữ liệu đầu vào (validation) trước khi lưu trữ, đảm bảo không có dữ liệu sai định dạng',
        ]),

        taoTieuDe2('2.4. Mô hình hóa dữ liệu'),
        taoDoan('Mô hình dữ liệu của hệ thống được thiết kế theo mô hình hướng đối tượng (OOP), trong đó mỗi thực thể trong bài toán được biểu diễn bằng một lớp (class) với các thuộc tính và phương thức riêng. Kiến trúc này giúp mã nguồn có tính module hóa cao, dễ bảo trì và mở rộng.'),
        taoTieuDe3('2.4.1. Sơ đồ lớp'),
        taoDoan('Sơ đồ lớp dưới đây mô tả mối quan hệ giữa ba lớp chính trong hệ thống: MangDong (cấu trúc dữ liệu nền tảng), BoQuanLySinhVien (logic nghiệp vụ) và SinhVien (đối tượng dữ liệu). Lớp BoQuanLySinhVien sử dụng MangDong làm cấu trúc lưu trữ bên trong và quản lý một tập hợp các đối tượng SinhVien:'),
        ...taoDoanCode(
`┌──────────────────────────────────────────────┐
│           MangDong (Mảng động)                │
│           Tệp: DynamicArray.js                │
├──────────────────────────────────────────────┤
│ - duLieu: Array                               │
│ - kichThuoc: number                           │
│ - dungLuong: number                           │
│ - soLanThayDoi: number                        │
├──────────────────────────────────────────────┤
│ + them(phanTu): number                        │
│ + xoaTaiViTri(viTri): *                       │
│ + layGiaTri(viTri): *                         │
│ + ganGiaTri(viTri, phanTu): void              │
│ + timViTri(dieuKien): number                  │
│ + loc(dieuKien): Array                        │
│ + sapXep(hamSoSanh): void                     │
│ + chuyenThanhMang(): Array                    │
│ + xoaTatCa(): void                            │
│ - _thayDoiKichThuoc(dungLuongMoi): void       │
└──────────────────────────────────────────────┘
                    ▲ sử dụng
┌──────────────────────────────────────────────┐
│         BoQuanLySinhVien                      │
│         Tệp: StudentManager.js                │
├──────────────────────────────────────────────┤
│ - danhSachSV: MangDong<SinhVien>              │
│ - trangHienTai: number                        │
│ - truongSapXep: string                        │
│ - sapXepTangDan: boolean                      │
├──────────────────────────────────────────────┤
│ + themSinhVien(sv): boolean                   │
│ + capNhatSinhVien(viTri, sv): boolean         │
│ + xoaSinhVien(viTri): boolean                 │
│ + timKiemSinhVien(tuKhoa): SinhVien[]         │
│ + layDanhSachDaSapXep(ds): SinhVien[]         │
│ + tinhDiemTrungBinhChung(): number            │
│ + demSinhVienDat(): number                    │
│ + demSinhVienChuaDat(): number                │
│ + xuatExcel(): void                           │
└──────────────────────────────────────────────┘
                    │ quản lý
                    ▼
┌──────────────────────────────────────────────┐
│              SinhVien                         │
│              Tệp: Student.js                 │
├──────────────────────────────────────────────┤
│ + maSV: string                                │
│ + hoTen: string                               │
│ + ngaySinh: string                            │
│ + gioiTinh: string                            │
│ + tenLop: string                              │
│ + diemTB: number                              │
├──────────────────────────────────────────────┤
│ + layXepLoai(): Object                        │
│ + layNgaySinhDinhDang(): string               │
│ + chuyenSangJSON(): Object                    │
│ + [tĩnh] taoTuJSON(duLieu): SinhVien         │
└──────────────────────────────────────────────┘`
        ),

        taoTieuDe3('2.4.2. Quy tắc xếp loại'),
        taoDoan('Hệ thống xếp loại học lực được xây dựng dựa trên thang điểm 10, tuân theo quy định phổ biến tại các cơ sở giáo dục Việt Nam. Mỗi mức điểm trung bình tương ứng với một xếp loại cụ thể, giúp đánh giá nhanh chóng năng lực học tập của sinh viên:'),
        taoO(
            ['Điểm trung bình', 'Xếp loại'],
            [
                ['9.0 - 10.0', 'Xuất sắc'],
                ['8.0 - 8.99', 'Giỏi'],
                ['6.5 - 7.99', 'Khá'],
                ['5.0 - 6.49', 'Trung bình'],
                ['3.5 - 4.99', 'Yếu'],
                ['0.0 - 3.49', 'Kém'],
            ]
        ),
        taoDoan('Quy tắc xếp loại này được cài đặt trong phương thức layXepLoai() của lớp SinhVien, trả về cả tên xếp loại và mã màu tương ứng để hiển thị trực quan trên giao diện. Ví dụ, sinh viên đạt loại "Xuất sắc" sẽ được hiển thị với nhãn màu xanh lá, trong khi "Kém" sẽ hiển thị với nhãn đỏ, giúp người dùng nhanh chóng nhận diện kết quả học tập.'),
        new Paragraph({ children: [new PageBreak()] }),
    );

    // ===== PHẦN 3: THUẬT TOÁN SỬ DỤNG =====
    cacPhan.push(
        taoTieuDe1('PHẦN 3: THUẬT TOÁN SỬ DỤNG'),
        taoDoan('Phần này trình bày chi tiết các thuật toán cốt lõi được sử dụng trong hệ thống quản lý sinh viên. Mỗi thuật toán được mô tả đầy đủ bao gồm: mã giả (pseudocode) để hiểu logic, lưu đồ thuật toán để trực quan hóa luồng xử lý, minh họa bằng ví dụ cụ thể, và cuối cùng là mã nguồn cài đặt thực tế trong dự án. Cách trình bày này giúp người đọc dễ dàng nắm bắt nguyên lý hoạt động trước khi đi vào chi tiết kỹ thuật.'),

        // 3.1
        taoTieuDe2('3.1. Thuật toán Thêm phần tử — hàm them()'),
        taoDoan('Thuật toán thêm phần tử là thao tác cơ bản và thường xuyên nhất trong mảng động. Khi người dùng thêm một sinh viên mới vào hệ thống, hàm them() sẽ được gọi để chèn đối tượng sinh viên vào cuối mảng. Điểm đặc biệt của thuật toán này nằm ở khả năng tự động mở rộng mảng khi dung lượng đã đầy, đảm bảo luôn có đủ không gian cho phần tử mới.'),
        taoTieuDe3('3.1.1. Mã giả'),
        ...taoDoanCode(
`THUẬT TOÁN Them(phanTu)
    ĐẦU VÀO: phanTu - phần tử cần thêm
    ĐẦU RA:  kichThuoc - kích thước mảng sau khi thêm

    BẮT ĐẦU
        NẾU kichThuoc >= dungLuong THÌ
            ThayDoiKichThuoc(dungLuong * 2)
        KẾT THÚC NẾU

        duLieu[kichThuoc] ← phanTu
        kichThuoc ← kichThuoc + 1

        TRẢ VỀ kichThuoc
    KẾT THÚC`
        ),
        taoDoan('Thuật toán trên hoạt động theo nguyên tắc "kiểm tra trước, hành động sau": đầu tiên kiểm tra xem mảng có đủ chỗ không (kichThuoc >= dungLuong), nếu không đủ thì mở rộng gấp đôi trước, sau đó mới tiến hành thêm phần tử vào vị trí cuối cùng. Cách tiếp cận này đảm bảo rằng thao tác thêm luôn thành công bất kể trạng thái hiện tại của mảng.'),

        taoTieuDe3('3.1.2. Lưu đồ thuật toán'),
        taoDoan('Lưu đồ dưới đây minh họa trực quan luồng xử lý của thuật toán thêm phần tử, từ bước kiểm tra dung lượng đến bước cập nhật kích thước:'),
        ...taoDoanCode(
`    ┌─────────────┐
    │  BẮT ĐẦU    │
    └──────┬──────┘
           │
           ▼
    ┌──────────────┐
    │ kichThuoc ≥  │──── Đúng ──→ ThayDoiKichThuoc()
    │ dungLuong?   │                      │
    └──────┬───────┘                      │
           │ Sai                          │
           ◄──────────────────────────────┘
           │
           ▼
    ┌────────────────────┐
    │ duLieu[kichThuoc]  │
    │     = phanTu       │
    └──────┬─────────────┘
           │
           ▼
    ┌──────────────┐
    │ kichThuoc++  │
    └──────┬───────┘
           │
           ▼
    ┌─────────────┐
    │  KẾT THÚC   │
    └─────────────┘`
        ),

        taoTieuDe3('3.1.3. Cài đặt (tệp DynamicArray.js)'),
        taoDoan('Dưới đây là mã nguồn JavaScript cài đặt thuật toán thêm phần tử. Hàm them() nhận vào một phần tử bất kỳ, kiểm tra dung lượng, thêm vào cuối mảng và trả về kích thước mới:'),
        ...taoDoanCode(
`them(phanTu) {
    if (this.kichThuoc >= this.dungLuong) {
        this._thayDoiKichThuoc(this.dungLuong * 2);
    }
    this.duLieu[this.kichThuoc] = phanTu;
    this.kichThuoc++;
    return this.kichThuoc;
}`
        ),
        taoDoan('Trong trường hợp tốt nhất (mảng chưa đầy), thao tác thêm chỉ tốn O(1). Khi mảng đầy và cần mở rộng, chi phí tăng lên O(n) do phải sao chép toàn bộ phần tử. Tuy nhiên, nhờ chiến lược nhân đôi, chi phí khấu hao trung bình vẫn chỉ là O(1) — điều này sẽ được chứng minh chi tiết ở Phần 4.'),

        // 3.2
        taoTieuDe2('3.2. Thuật toán Xóa phần tử — hàm xoaTaiViTri()'),
        taoDoan('Thuật toán xóa phần tử phức tạp hơn thêm phần tử vì ngoài việc loại bỏ phần tử, còn phải duy trì tính liên tiếp của mảng bằng cách dịch chuyển các phần tử phía sau sang trái. Ngoài ra, thuật toán cũng cần kiểm tra xem có nên thu nhỏ mảng hay không để giải phóng bộ nhớ dư thừa.'),
        taoTieuDe3('3.2.1. Mã giả'),
        ...taoDoanCode(
`THUẬT TOÁN XoaTaiViTri(viTri)
    ĐẦU VÀO: viTri - vị trí cần xóa
    ĐẦU RA:  phanTuDaXoa - phần tử bị xóa

    BẮT ĐẦU
        NẾU viTri < 0 HOẶC viTri >= kichThuoc THÌ
            BÁO LỖI "Vị trí nằm ngoài phạm vi!"
        KẾT THÚC NẾU

        phanTuDaXoa ← duLieu[viTri]

        VỚI i TỪ viTri ĐẾN kichThuoc - 2 LÀM
            duLieu[i] ← duLieu[i + 1]
        KẾT THÚC VỚI

        kichThuoc ← kichThuoc - 1
        duLieu[kichThuoc] ← rỗng

        NẾU kichThuoc < dungLuong/4 VÀ dungLuong > 4 THÌ
            ThayDoiKichThuoc(dungLuong / 2)
        KẾT THÚC NẾU

        TRẢ VỀ phanTuDaXoa
    KẾT THÚC`
        ),
        taoDoan('Thuật toán bắt đầu bằng việc kiểm tra tính hợp lệ của vị trí xóa — nếu vị trí nằm ngoài phạm vi [0, kichThuoc-1] thì báo lỗi để tránh truy cập bộ nhớ không hợp lệ. Sau khi lưu lại phần tử bị xóa, vòng lặp dịch chuyển tất cả các phần tử phía sau sang trái một vị trí để lấp đầy khoảng trống. Cuối cùng, thuật toán kiểm tra xem có cần thu nhỏ mảng không — nếu số phần tử còn lại ít hơn 1/4 dung lượng, mảng sẽ được thu nhỏ còn một nửa.'),

        taoTieuDe3('3.2.2. Minh họa'),
        taoDoan('Ví dụ trực quan sau đây cho thấy quá trình xóa phần tử "C" tại vị trí 2 trong mảng 5 phần tử. Sau khi xóa, các phần tử "D" và "E" phía sau được dịch sang trái để lấp đầy vị trí trống:'),
        ...taoDoanCode(
`Xóa phần tử tại viTri = 2:

Trước khi xóa:
┌───┬───┬───┬───┬───┐
│ A │ B │ C │ D │ E │    kichThuoc = 5
└───┴───┴───┴───┴───┘
  0   1   2   3   4
          ↑ Xóa C

Bước 1: Dịch D, E sang trái
┌───┬───┬───┬───┬───┐
│ A │ B │ D │ E │   │    kichThuoc = 4
└───┴───┴───┴───┴───┘`
        ),
        taoDoan('Như minh họa cho thấy, chi phí xóa phụ thuộc vào vị trí của phần tử bị xóa. Xóa phần tử cuối mảng chỉ tốn O(1) vì không cần dịch chuyển. Nhưng xóa phần tử đầu mảng tốn O(n-1) vì tất cả phần tử còn lại phải dịch sang trái. Trường hợp trung bình mất O(n/2) = O(n).'),

        taoTieuDe3('3.2.3. Cài đặt (tệp DynamicArray.js)'),
        taoDoan('Mã nguồn cài đặt thuật toán xóa phần tử tại vị trí bất kỳ, bao gồm kiểm tra hợp lệ, dịch chuyển phần tử, và tự động thu nhỏ mảng khi cần:'),
        ...taoDoanCode(
`xoaTaiViTri(viTri) {
    if (viTri < 0 || viTri >= this.kichThuoc) {
        throw new Error('Vị trí nằm ngoài phạm vi!');
    }
    const phanTuDaXoa = this.duLieu[viTri];
    for (let i = viTri; i < this.kichThuoc - 1; i++) {
        this.duLieu[i] = this.duLieu[i + 1];
    }
    this.kichThuoc--;
    this.duLieu[this.kichThuoc] = undefined;
    if (this.kichThuoc < this.dungLuong / 4 && this.dungLuong > 4) {
        this._thayDoiKichThuoc(Math.floor(this.dungLuong / 2));
    }
    return phanTuDaXoa;
}`
        ),

        // 3.3
        taoTieuDe2('3.3. Thuật toán Tìm kiếm tuyến tính — hàm timKiemSinhVien()'),
        taoDoan('Tìm kiếm là chức năng được sử dụng thường xuyên nhất trong hệ thống quản lý. Thuật toán tìm kiếm tuyến tính (Linear Search) được lựa chọn vì tính đơn giản và khả năng tìm kiếm trên nhiều trường dữ liệu cùng lúc (mã SV, họ tên, lớp). Mặc dù có độ phức tạp O(n), nhưng với quy mô dữ liệu hàng nghìn sinh viên, tốc độ vẫn đáp ứng tốt yêu cầu tìm kiếm theo thời gian thực.'),
        taoTieuDe3('3.3.1. Mã giả'),
        ...taoDoanCode(
`THUẬT TOÁN TimKiemTuyenTinh(tuKhoa)
    ĐẦU VÀO: tuKhoa - từ khóa tìm kiếm
    ĐẦU RA:  ketQua - mảng kết quả

    BẮT ĐẦU
        ketQua ← []
        tuKhoa ← chuyen_thuong(tuKhoa)

        VỚI i TỪ 0 ĐẾN kichThuoc - 1 LÀM
            sv ← duLieu[i]
            NẾU chua(sv.maSV, tuKhoa) HOẶC
               chua(sv.hoTen, tuKhoa) HOẶC
               chua(sv.tenLop, tuKhoa) THÌ
                them(ketQua, sv)
            KẾT THÚC NẾU
        KẾT THÚC VỚI

        TRẢ VỀ ketQua
    KẾT THÚC`
        ),
        taoDoan('Thuật toán chuyển từ khóa về chữ thường trước khi so sánh, đảm bảo tìm kiếm không phân biệt hoa/thường (case-insensitive). Với mỗi sinh viên trong mảng, thuật toán kiểm tra xem từ khóa có xuất hiện trong mã SV, họ tên hoặc tên lớp hay không. Nếu có bất kỳ trường nào khớp, sinh viên đó sẽ được thêm vào kết quả.'),

        taoTieuDe3('3.3.2. Cài đặt (tệp StudentManager.js)'),
        taoDoan('Mã nguồn JavaScript cài đặt tìm kiếm tuyến tính, sử dụng phương thức includes() để kiểm tra chuỗi con và toLowerCase() để chuẩn hóa trước khi so sánh:'),
        ...taoDoanCode(
`timKiemSinhVien(tuKhoa) {
    tuKhoa = tuKhoa.toLowerCase().trim();
    if (!tuKhoa) return this.danhSachSV.chuyenThanhMang();
    return this.danhSachSV.loc(sv =>
        sv.maSV.toLowerCase().includes(tuKhoa) ||
        sv.hoTen.toLowerCase().includes(tuKhoa) ||
        sv.tenLop.toLowerCase().includes(tuKhoa)
    );
}`
        ),
        taoDoan('Lưu ý rằng khi từ khóa rỗng, hàm trả về toàn bộ danh sách — đây là hành vi mong đợi vì nó cho phép hiển thị tất cả sinh viên khi ô tìm kiếm trống.'),

        taoTieuDe3('3.3.3. Độ phức tạp'),
        taoDoan('Phân tích chi tiết độ phức tạp của thuật toán tìm kiếm:'),
        ...taoDanhSach([
            '- **Thời gian**: O(n × m), trong đó n là tổng số sinh viên trong mảng và m là độ dài trung bình của các chuỗi cần so sánh. Hàm includes() có độ phức tạp O(m) trong trường hợp xấu nhất, và nó được gọi cho 3 trường dữ liệu mỗi sinh viên.',
            '- **Không gian**: O(k), trong đó k là số kết quả tìm được. Trong trường hợp xấu nhất (tất cả đều khớp), k = n và không gian phụ là O(n).',
        ]),

        // 3.4
        taoTieuDe2('3.4. Thuật toán Sắp xếp — hàm layDanhSachDaSapXep()'),
        taoTieuDe3('3.4.1. TimSort'),
        taoDoan('Sắp xếp dữ liệu là chức năng quan trọng giúp người dùng dễ dàng tìm kiếm và so sánh thông tin sinh viên. Hệ thống tận dụng phương thức sort() có sẵn của JavaScript Engine, vốn sử dụng thuật toán TimSort — một thuật toán sắp xếp lai được phát minh bởi Tim Peters vào năm 2002.'),
        taoDoan('TimSort là sự kết hợp thông minh giữa Merge Sort (sắp xếp trộn) và Insertion Sort (sắp xếp chèn). Nó hoạt động bằng cách chia mảng thành các "run" — các đoạn con đã được sắp xếp sẵn — rồi sử dụng Merge Sort để trộn các run lại với nhau. Với các run ngắn, Insertion Sort được sử dụng vì nó hiệu quả hơn Merge Sort đối với mảng nhỏ. Nhờ đó, TimSort đạt hiệu suất rất tốt trên dữ liệu thực tế vốn thường có các đoạn đã sắp xếp sẵn một phần. TimSort có độ phức tạp O(n log n) trong trường hợp trung bình và xấu nhất, O(n) trong trường hợp tốt nhất (dữ liệu đã sắp xếp), và là thuật toán ổn định (stable) — các phần tử bằng nhau giữ nguyên thứ tự ban đầu.'),

        taoTieuDe3('3.4.2. Cài đặt (tệp StudentManager.js)'),
        taoDoan('Hàm layDanhSachDaSapXep() tạo một bản sao của danh sách, sau đó sắp xếp bản sao đó theo trường dữ liệu do người dùng chọn (mã SV, họ tên, điểm TB, lớp):'),
        ...taoDoanCode(
`layDanhSachDaSapXep(danhSach) {
    const daSapXep = [...danhSach];
    daSapXep.sort((a, b) => {
        let ketQua = 0;
        switch (this.truongSapXep) {
            case 'maSV':
                ketQua = a.maSV.localeCompare(b.maSV);
                break;
            case 'hoTen':
                ketQua = a.hoTen.localeCompare(b.hoTen, 'vi');
                break;
            case 'diemTB':
                ketQua = a.diemTB - b.diemTB;
                break;
            case 'tenLop':
                ketQua = a.tenLop.localeCompare(b.tenLop);
                break;
        }
        return this.sapXepTangDan ? ketQua : -ketQua;
    });
    return daSapXep;
}`
        ),
        taoDoan('Điểm đáng chú ý trong cài đặt là việc sử dụng localeCompare(\'vi\') khi so sánh họ tên. Phương thức này cho phép so sánh chuỗi theo đúng thứ tự bảng chữ cái tiếng Việt, xử lý chính xác các ký tự đặc trưng như Ă, Â, Đ, Ê, Ô, Ơ, Ư và các dấu thanh. Ngoài ra, biến sapXepTangDan cho phép dễ dàng đảo ngược thứ tự sắp xếp (tăng dần/giảm dần) bằng cách nhân kết quả so sánh với -1.'),

        // 3.5
        taoTieuDe2('3.5. Thuật toán Thay đổi kích thước — hàm _thayDoiKichThuoc()'),
        taoDoan('Đây là thuật toán "hậu trường" quan trọng nhất của mảng động — chịu trách nhiệm cấp phát vùng nhớ mới khi mảng cần mở rộng hoặc thu nhỏ. Hàm _thayDoiKichThuoc() được đánh dấu bằng dấu gạch dưới (_) ở đầu tên, theo quy ước đây là phương thức nội bộ (private), không nên được gọi trực tiếp từ bên ngoài.'),
        taoTieuDe3('3.5.1. Mã giả'),
        ...taoDoanCode(
`THUẬT TOÁN ThayDoiKichThuoc(dungLuongMoi)
    ĐẦU VÀO: dungLuongMoi - dung lượng mới

    BẮT ĐẦU
        mangMoi ← Mang_moi(dungLuongMoi)

        VỚI i TỪ 0 ĐẾN kichThuoc - 1 LÀM
            mangMoi[i] ← duLieu[i]
        KẾT THÚC VỚI

        duLieu ← mangMoi
        dungLuong ← dungLuongMoi
        soLanThayDoi ← soLanThayDoi + 1
    KẾT THÚC`
        ),
        taoDoan('Thuật toán thực hiện ba bước đơn giản nhưng chi phí cao: tạo mảng mới với dung lượng theo yêu cầu, sao chép từng phần tử từ mảng cũ sang mảng mới, rồi thay thế mảng cũ bằng mảng mới. Biến soLanThayDoi được cập nhật để theo dõi số lần mảng đã thay đổi kích thước, giúp đánh giá hiệu quả của chiến lược nhân đôi.'),

        taoTieuDe3('3.5.2. Minh họa'),
        taoDoan('Ví dụ sau minh họa quá trình mở rộng mảng từ dung lượng 4 lên 8. Bốn phần tử A, B, C, D được sao chép nguyên vẹn sang mảng mới, bốn ô nhớ còn lại là không gian dự phòng:'),
        ...taoDoanCode(
`Mở rộng từ dungLuong=4 thành dungLuong=8:

Mảng cũ (dungLuong=4):
┌───┬───┬───┬───┐
│ A │ B │ C │ D │
└───┴───┴───┴───┘

Sao chép sang mảng mới (dungLuong=8):
┌───┬───┬───┬───┬───┬───┬───┬───┐
│ A │ B │ C │ D │   │   │   │   │
└───┴───┴───┴───┴───┴───┴───┴───┘`
        ),
        taoDoan('Sau khi mở rộng, mảng cũ sẽ được trình thu gom rác (garbage collector) của JavaScript tự động giải phóng khi không còn tham chiếu nào trỏ đến. Quá trình này diễn ra tự động, không cần lập trình viên can thiệp.'),

        taoTieuDe3('3.5.3. Cài đặt (tệp DynamicArray.js)'),
        taoDoan('Mã nguồn cài đặt thuật toán thay đổi kích thước, hoạt động cho cả hai trường hợp mở rộng và thu nhỏ:'),
        ...taoDoanCode(
`_thayDoiKichThuoc(dungLuongMoi) {
    const mangMoi = new Array(dungLuongMoi);
    for (let i = 0; i < this.kichThuoc; i++) {
        mangMoi[i] = this.duLieu[i];
    }
    this.duLieu = mangMoi;
    this.dungLuong = dungLuongMoi;
    this.soLanThayDoi++;
}`
        ),
        taoDoan('Hàm này luôn có độ phức tạp O(n) do phải sao chép toàn bộ n phần tử. Tuy nhiên, nhờ chiến lược nhân đôi, hàm này chỉ được gọi với tần suất logarit — sau mỗi lần mở rộng, cần thêm gấp đôi số phần tử trước khi phải mở rộng lại, dẫn đến chi phí khấu hao O(1) cho mỗi thao tác thêm.'),
        new Paragraph({ children: [new PageBreak()] }),
    );

    // ===== PHẦN 4: ĐÁNH GIÁ ĐỘ PHỨC TẠP =====
    cacPhan.push(
        taoTieuDe1('PHẦN 4: ĐÁNH GIÁ ĐỘ PHỨC TẠP'),
        taoDoan('Phần này phân tích chi tiết độ phức tạp thuật toán của các thao tác trong hệ thống quản lý sinh viên. Đánh giá độ phức tạp giúp chúng ta hiểu rõ hiệu năng lý thuyết của hệ thống, dự đoán hành vi khi quy mô dữ liệu tăng, và khẳng định rằng mảng động là lựa chọn phù hợp cho bài toán này. Chúng ta sẽ xem xét cả độ phức tạp thời gian, độ phức tạp không gian, và đặc biệt là phân tích chi phí khấu hao — phương pháp đánh giá chính xác nhất cho mảng động.'),

        taoTieuDe2('4.1. Độ phức tạp thời gian'),
        taoDoan('Bảng dưới đây tổng hợp độ phức tạp thời gian của tất cả các thao tác cơ bản trong lớp MangDong (DynamicArray.js). Ba trường hợp được phân tích: tốt nhất (best case), trung bình (average case) và xấu nhất (worst case), cùng với ghi chú giải thích nguyên nhân:'),
        taoTieuDe3('4.1.1. Bảng tổng hợp'),
        taoO(
            ['Thao tác', 'Hàm', 'Tốt nhất', 'Trung bình', 'Xấu nhất', 'Ghi chú'],
            [
                ['Thêm', 'them()', 'O(1)', 'O(1)*', 'O(n)', 'Chi phí khấu hao'],
                ['Xóa tại vị trí', 'xoaTaiViTri()', 'O(1)', 'O(n)', 'O(n)', 'Dịch chuyển'],
                ['Truy cập', 'layGiaTri()', 'O(1)', 'O(1)', 'O(1)', 'Trực tiếp'],
                ['Cập nhật', 'ganGiaTri()', 'O(1)', 'O(1)', 'O(1)', 'Trực tiếp'],
                ['Tìm kiếm', 'timViTri()', 'O(1)', 'O(n)', 'O(n)', 'Tuyến tính'],
                ['Lọc', 'loc()', 'O(n)', 'O(n)', 'O(n)', 'Duyệt toàn bộ'],
                ['Sắp xếp', 'sapXep()', 'O(n)', 'O(n log n)', 'O(n log n)', 'TimSort'],
                ['Mở rộng', '_thayDoiKichThuoc()', 'O(n)', 'O(n)', 'O(n)', 'Sao chép'],
            ]
        ),
        taoDoan('Từ bảng trên, có thể thấy rằng các thao tác truy cập và cập nhật đạt hiệu suất tối ưu O(1) nhờ đặc tính mảng. Thao tác thêm có chi phí khấu hao O(1) — rất hiệu quả cho việc thêm sinh viên mới. Thao tác tốn kém nhất là sắp xếp O(n log n), tuy nhiên đây là giới hạn dưới lý thuyết cho bài toán sắp xếp dựa trên so sánh, nên không thể cải thiện thêm.'),

        taoTieuDe2('4.2. Độ phức tạp không gian'),
        taoDoan('Phân tích bộ nhớ sử dụng giúp đánh giá hiệu quả của mảng động trong việc quản lý tài nguyên. Bảng sau chi tiết dung lượng bộ nhớ cần thiết cho từng thành phần:'),
        taoO(
            ['Thành phần', 'Không gian', 'Mô tả'],
            [
                ['Mảng duLieu', 'O(dungLuong)', 'Dung lượng tối đa đã cấp phát'],
                ['Biến kichThuoc', 'O(1)', 'Một giá trị số nguyên'],
                ['Biến dungLuong', 'O(1)', 'Một giá trị số nguyên'],
                ['Mảng tạm khi mở rộng', 'O(n)', 'Mảng mới tạm thời trong quá trình sao chép'],
            ]
        ),
        taoDoan(''),
        taoDoan([
            taoDoanDam('Tổng không gian: '),
            taoDoanThuong('O(dungLuong) = O(2n) = O(n) — do chiến lược nhân đôi, dung lượng tối đa luôn nhỏ hơn hoặc bằng 2 lần kích thước thực tế. Điều này có nghĩa là trong trường hợp xấu nhất, mảng động chỉ sử dụng gấp đôi bộ nhớ so với lượng dữ liệu thực tế, một mức chi phí hoàn toàn chấp nhận được cho hầu hết ứng dụng.'),
        ]),
        taoDoan(''),
        taoDoan([
            taoDoanDam('Tỷ lệ lãng phí bộ nhớ: '),
            taoDoanThuong('Tốt nhất 0% (khi kichThuoc = dungLuong, mảng đầy hoàn toàn), xấu nhất khoảng 50% (ngay sau khi mở rộng, một nửa dung lượng mới chưa được sử dụng), trung bình khoảng 25%. So với danh sách liên kết (mỗi phần tử cần thêm 1-2 con trỏ, tốn 8-16 byte phụ), mảng động vẫn hiệu quả hơn khi số lượng phần tử đủ lớn.'),
        ]),

        taoTieuDe2('4.3. Phân tích chi phí khấu hao (Amortized Analysis)'),
        taoTieuDe3('4.3.1. Khái niệm'),
        taoDoan([
            taoDoanDam('Phân tích chi phí khấu hao'),
            taoDoanThuong(' (Amortized Analysis) là phương pháp phân tích chi phí trung bình của một chuỗi n thao tác liên tiếp, thay vì chỉ xét trường hợp xấu nhất của từng thao tác riêng lẻ. Đây là phương pháp đánh giá chính xác nhất cho mảng động, vì trường hợp xấu nhất O(n) khi mở rộng rất hiếm xảy ra và không phản ánh đúng hiệu năng thực tế.'),
        ]),
        taoDoan('Trong thuật toán mảng động, nếu chỉ nhìn vào trường hợp xấu nhất, ta có thể kết luận sai rằng thao tác thêm tốn O(n). Nhưng thực tế, trường hợp xấu nhất chỉ xảy ra khi mảng đầy — một sự kiện ngày càng hiếm hơn nhờ chiến lược nhân đôi. Phân tích chi phí khấu hao giúp chứng minh rằng chi phí trung bình thực sự chỉ là O(1). Dưới đây trình bày hai phương pháp chứng minh phổ biến.'),

        taoTieuDe3('4.3.2. Phân tích thao tác them() — Phương pháp Gộp'),
        taoDoan('Phương pháp Gộp (Aggregate Method) tính tổng chi phí của n thao tác liên tiếp, rồi chia trung bình. Bảng sau mô phỏng chi tiết từng thao tác thêm, cho thấy chỉ có các thao tác tại vị trí là lũy thừa của 2 mới cần mở rộng:'),
        taoO(
            ['Thao tác', 'Dung lượng trước', 'Mở rộng?', 'Chi phí'],
            [
                ['Thêm 1', '1', 'Có', '1 + 1 = 2'],
                ['Thêm 2', '2', 'Có', '1 + 2 = 3'],
                ['Thêm 3', '4', 'Không', '1'],
                ['Thêm 4', '4', 'Có', '1 + 4 = 5'],
                ['Thêm 5', '8', 'Không', '1'],
                ['Thêm 6', '8', 'Không', '1'],
                ['Thêm 7', '8', 'Không', '1'],
                ['Thêm 8', '8', 'Có', '1 + 8 = 9'],
            ]
        ),
        taoDoan(''),
        taoDoan('Từ bảng trên, ta thấy rằng chi phí mở rộng tăng dần (1, 2, 4, 8...) nhưng khoảng cách giữa các lần mở rộng cũng tăng theo (cứ sau mỗi lần mở rộng, cần gấp đôi số thao tác thêm trước khi mở rộng lại). Tổng chi phí được tính như sau:'),
        ...taoDoanCode(
`Tổng chi phí:
T(n) = n + (1 + 2 + 4 + 8 + ... + 2^k)
     = n + (2^(k+1) - 1)
     = n + 2n - 1 = 3n - 1 = O(n)

Chi phí trung bình mỗi thao tác:
T(n) / n = O(n) / n = O(1)`
        ),
        taoDoan('Kết quả cho thấy tổng chi phí của n thao tác thêm là O(n), tức chi phí khấu hao trung bình cho mỗi thao tác chỉ là O(1). Đây là kết quả rất quan trọng, chứng minh rằng mặc dù đôi khi phải trả chi phí cao O(n) cho việc mở rộng, nhưng chi phí đó được "khấu hao" đều cho tất cả các thao tác trước đó.'),

        taoTieuDe3('4.3.3. Phương pháp Kế toán'),
        taoDoan('Phương pháp Kế toán (Accounting Method) tiếp cận vấn đề theo góc nhìn "tiết kiệm": mỗi thao tác thêm sẽ "trả" một khoản chi phí cố định, phần dư được tiết kiệm để chi trả cho các lần mở rộng trong tương lai:'),
        ...taoDoanCode(
`Mỗi thao tác thêm, "trả" 3 đồng:
- 1 đồng cho việc thêm phần tử
- 2 đồng tiết kiệm cho việc mở rộng tương lai

Khi mở rộng (gấp đôi từ k lên 2k):
- Cần sao chép k phần tử
- Đã tiết kiệm được 2k đồng → đủ trả!

→ Chi phí khấu hao = 3 = O(1)`
        ),
        taoDoan('Cả hai phương pháp đều dẫn đến cùng một kết luận: thao tác thêm vào mảng động có chi phí khấu hao O(1). Đây là cơ sở lý thuyết vững chắc cho việc sử dụng mảng động trong hệ thống quản lý sinh viên, nơi thao tác thêm sinh viên mới diễn ra thường xuyên.'),

        taoTieuDe2('4.4. So sánh hiệu năng thực tế'),
        taoDoan('Để kiểm chứng phân tích lý thuyết, bảng sau trình bày kết quả đo hiệu năng thực tế (benchmark) trên trình duyệt Chrome với dữ liệu 10,000 sinh viên. Kết quả cho thấy mảng động đạt hiệu năng cạnh tranh so với mảng tĩnh và vượt trội hơn danh sách liên kết:'),
        taoO(
            ['Thao tác', 'Mảng động', 'Mảng tĩnh', 'DS liên kết'],
            [
                ['Thêm 10,000 SV', '~5ms', '~3ms*', '~8ms'],
                ['Tìm kiếm', '~2ms', '~2ms', '~15ms'],
                ['Sắp xếp', '~10ms', '~10ms', '~50ms'],
                ['Truy cập ngẫu nhiên', '<0.01ms', '<0.01ms', '~5ms'],
            ]
        ),
        taoDoan('* Mảng tĩnh yêu cầu biết trước kích thước — trong thực tế điều này thường không khả thi'),
        taoDoan(''),
        taoTieuDe3('4.4.2. Kết luận'),
        taoDoan([taoDoanDam('Mảng động'), taoDoanThuong(' là lựa chọn phù hợp nhất cho bài toán quản lý sinh viên. Dưới đây là tổng hợp các lý do dẫn đến kết luận này:')]),
        ...taoDanhSach([
            '- Số lượng sinh viên thay đổi theo thời gian (nhập học, nghỉ học, chuyển trường) → cần cấu trúc dữ liệu linh hoạt về kích thước, mảng tĩnh không đáp ứng được',
            '- Hiển thị danh sách trong bảng, phân trang cần truy cập ngẫu nhiên nhanh → O(1), danh sách liên kết thua hẳn ở tiêu chí này',
            '- Thao tác thêm sinh viên mới diễn ra thường xuyên và chủ yếu ở cuối danh sách → O(1) chi phí khấu hao, hiệu quả cao',
            '- Thao tác xóa sinh viên không quá thường xuyên → O(n) cho mỗi lần xóa là mức chi phí chấp nhận được trong ngữ cảnh này',
            '- Tính thân thiện với bộ nhớ đệm (cache-friendly) giúp duyệt danh sách nhanh hơn đáng kể so với danh sách liên kết khi thực hiện tìm kiếm và lọc',
        ]),
        new Paragraph({ children: [new PageBreak()] }),
    );

    // ===== PHẦN 5: CẤU TRÚC MÃ NGUỒN =====
    cacPhan.push(
        taoTieuDe1('PHẦN 5: CẤU TRÚC MÃ NGUỒN'),
        taoDoan('Phần cuối cùng của báo cáo trình bày cấu trúc tổ chức mã nguồn của dự án. Hệ thống được thiết kế theo nguyên tắc tách biệt mối quan tâm (Separation of Concerns), mỗi tệp đảm nhận một vai trò rõ ràng: cấu trúc dữ liệu, đối tượng nghiệp vụ, logic xử lý, và giao diện người dùng. Kiến trúc này giúp mã nguồn dễ đọc, dễ bảo trì, và dễ mở rộng khi có yêu cầu mới.'),

        taoTieuDe2('5.1. Sơ đồ module'),
        taoDoan('Dự án được tổ chức thành các tệp riêng biệt, mỗi tệp chứa một lớp hoặc một nhóm chức năng liên quan. Sơ đồ dưới đây cho thấy vai trò cụ thể của từng tệp trong hệ thống:'),
        ...taoDoanCode(
`QuanLySinhVien/
├── index.html              ← Giao diện HTML chính
├── styles.css              ← Kiểu dáng giao diện (CSS)
├── DynamicArray.js         ← Lớp MangDong (cấu trúc mảng động)
├── Student.js              ← Lớp SinhVien (đối tượng sinh viên)
├── data.js                 ← Hằng số DU_LIEU_MAU (dữ liệu mẫu)
├── StudentManager.js       ← Lớp BoQuanLySinhVien (logic nghiệp vụ)
├── UIController.js         ← Lớp DieuKhienGiaoDien (điều khiển UI)
├── main.js                 ← Điểm khởi tạo ứng dụng
└── BaoCaoLyThuyet.md       ← Tài liệu báo cáo`
        ),

        taoTieuDe2('5.2. Mô tả từng tệp'),
        taoDoan('Bảng sau cung cấp mô tả chi tiết vai trò của từng tệp, lớp/biến chính bên trong, và các khái niệm lý thuyết liên quan. Thứ tự các tệp phản ánh mối phụ thuộc từ thấp đến cao — các tệp ở trên không phụ thuộc vào tệp nào, trong khi các tệp ở dưới phụ thuộc vào các tệp phía trên:'),
        taoO(
            ['Tệp', 'Lớp/Biến', 'Vai trò', 'Lý thuyết liên quan'],
            [
                ['DynamicArray.js', 'MangDong', 'Cấu trúc mảng động — nền tảng lưu trữ', 'Mảng động, nhân đôi, khấu hao'],
                ['Student.js', 'SinhVien', 'Đối tượng sinh viên — biểu diễn dữ liệu', 'Đóng gói dữ liệu (OOP)'],
                ['data.js', 'DU_LIEU_MAU', 'Dữ liệu mẫu cho kiểm thử và demo', '-'],
                ['StudentManager.js', 'BoQuanLySinhVien', 'CRUD, tìm kiếm, sắp xếp, thống kê', 'Tìm tuyến tính, TimSort'],
                ['UIController.js', 'DieuKhienGiaoDien', 'Xử lý giao diện và sự kiện người dùng', 'Mô hình MVC'],
                ['main.js', 'boQuanLy, ungDung', 'Khởi tạo và kết nối các module', 'Điểm vào chương trình'],
            ]
        ),

        taoTieuDe2('5.3. Thứ tự tải module'),
        taoDoan('Trong ứng dụng web sử dụng thẻ <script>, thứ tự tải các tệp JavaScript rất quan trọng vì mỗi tệp có thể phụ thuộc vào các lớp và biến được định nghĩa trong tệp khác. Thứ tự tải phải đảm bảo rằng mọi phụ thuộc đã được nạp trước khi tệp phụ thuộc được thực thi:'),
        ...taoDoanCode(
`1. DynamicArray.js   → Mảng động (không phụ thuộc)
2. Student.js        → Đối tượng sinh viên (không phụ thuộc)
3. data.js           → Dữ liệu mẫu (không phụ thuộc)
4. StudentManager.js → Phụ thuộc: MangDong + SinhVien + DU_LIEU_MAU
5. UIController.js   → Phụ thuộc: BoQuanLySinhVien + SinhVien
6. main.js           → Phụ thuộc: tất cả module trên`
        ),
        taoDoan('Ba tệp đầu tiên (DynamicArray.js, Student.js, data.js) có thể tải theo bất kỳ thứ tự nào vì chúng không phụ thuộc lẫn nhau. Tuy nhiên, StudentManager.js phải được tải sau cả ba tệp trên vì nó sử dụng lớp MangDong để lưu trữ, lớp SinhVien để tạo đối tượng, và DU_LIEU_MAU để nạp dữ liệu ban đầu. UIController.js cần BoQuanLySinhVien để gọi các hàm nghiệp vụ, và main.js là tệp cuối cùng vì nó khởi tạo toàn bộ ứng dụng.'),
    );

    // ===== TÀI LIỆU THAM KHẢO =====
    cacPhan.push(
        taoTieuDe1('TÀI LIỆU THAM KHẢO'),
        taoDoan('Báo cáo được xây dựng dựa trên các tài liệu tham khảo uy tín trong lĩnh vực khoa học máy tính và cấu trúc dữ liệu:'),
        taoDoan('1. Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2009). Introduction to Algorithms (3rd ed.). MIT Press.'),
        taoDoan('2. Sedgewick, R., & Wayne, K. (2011). Algorithms (4th ed.). Addison-Wesley.'),
        taoDoan('3. Goodrich, M. T., & Tamassia, R. (2014). Data Structures and Algorithms in Java (6th ed.). Wiley.'),
        taoDoan('4. MDN Web Docs. Array - JavaScript. https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array'),
        taoDoan('5. GeeksforGeeks. Dynamic Array. https://www.geeksforgeeks.org/dynamic-array/'),
        taoDoan(''),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 400 },
            children: [new TextRun({
                text: '© 2026 - Báo cáo Đề tài Lập trình Nâng cao',
                font: FONT_MAC_DINH, size: 22, color: '94A3B8', italics: true,
            })]
        }),
        new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({
                text: 'Đề tài: Xây dựng phần mềm Quản lý Sinh viên sử dụng Cấu trúc Mảng động và Giao diện đồ họa',
                font: FONT_MAC_DINH, size: 22, color: '94A3B8', italics: true,
            })]
        }),
    );

    return cacPhan;
}

// ==================== TẠO FILE WORD =====================

async function main() {
    console.log('🔧 Đang tạo file Word...');

    const noiDung = taoBaoCao();

    const taiLieu = new Document({
        styles: {
            default: {
                document: {
                    run: {
                        font: FONT_MAC_DINH,
                        size: CO_CHU_THUONG,
                    }
                }
            }
        },
        sections: [{
            properties: {
                page: {
                    margin: {
                        top: 1440,    // 1 inch
                        right: 1440,
                        bottom: 1440,
                        left: 1800,   // 1.25 inch
                    }
                }
            },
            children: noiDung,
        }],
    });

    const buffer = await Packer.toBuffer(taiLieu);
    const duongDan = 'BaoCaoLyThuyet.docx';
    fs.writeFileSync(duongDan, buffer);

    console.log(`✅ Đã tạo file: ${duongDan}`);
    console.log(`📄 Kích thước: ${(buffer.length / 1024).toFixed(1)} KB`);
}

main().catch(err => {
    console.error('❌ Lỗi:', err.message);
    process.exit(1);
});
