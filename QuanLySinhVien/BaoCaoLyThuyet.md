# BÁO CÁO LÝ THUYẾT
## Đề tài: Xây dựng phần mềm Quản lý Sinh viên sử dụng Cấu trúc Mảng động và Giao diện đồ họa

---

# MỤC LỤC

1. [Phần 1: Cơ sở lý thuyết](#phần-1-cơ-sở-lý-thuyết)
   - 1.1. Tổng quan về cấu trúc dữ liệu
   - 1.2. Mảng tĩnh
   - 1.3. Mảng động
   - 1.4. So sánh các cấu trúc dữ liệu
2. [Phần 2: Phân tích bài toán](#phần-2-phân-tích-bài-toán)
   - 2.1. Mô tả bài toán
   - 2.2. Yêu cầu chức năng
   - 2.3. Yêu cầu phi chức năng
   - 2.4. Mô hình hóa dữ liệu
3. [Phần 3: Thuật toán sử dụng](#phần-3-thuật-toán-sử-dụng)
   - 3.1. Thuật toán thêm phần tử
   - 3.2. Thuật toán xóa phần tử
   - 3.3. Thuật toán tìm kiếm tuyến tính
   - 3.4. Thuật toán sắp xếp
   - 3.5. Thuật toán thay đổi kích thước
4. [Phần 4: Đánh giá độ phức tạp](#phần-4-đánh-giá-độ-phức-tạp)
   - 4.1. Độ phức tạp thời gian
   - 4.2. Độ phức tạp không gian
   - 4.3. Phân tích chi phí khấu hao
   - 4.4. So sánh hiệu năng
5. [Phần 5: Cấu trúc mã nguồn](#phần-5-cấu-trúc-mã-nguồn)
   - 5.1. Sơ đồ module
   - 5.2. Mô tả từng tệp

---

# PHẦN 1: CƠ SỞ LÝ THUYẾT

## 1.1. Tổng quan về Cấu trúc dữ liệu

### 1.1.1. Định nghĩa
**Cấu trúc dữ liệu** là cách tổ chức, quản lý và lưu trữ dữ liệu trong máy tính sao cho có thể truy cập và sửa đổi một cách hiệu quả. Việc lựa chọn cấu trúc dữ liệu phù hợp ảnh hưởng trực tiếp đến hiệu suất của chương trình.

### 1.1.2. Phân loại cấu trúc dữ liệu

```
                    Cấu trúc dữ liệu
                          │
            ┌─────────────┴─────────────┐
            │                           │
      Tuyến tính                   Phi tuyến tính
            │                           │
    ┌───────┼───────┐           ┌───────┼───────┐
    │       │       │           │       │       │
  Mảng   Danh    Ngăn xếp/    Cây    Đồ thị   Đống
         sách    Hàng đợi
         liên
         kết
```

### 1.1.3. Tiêu chí đánh giá cấu trúc dữ liệu
- **Thời gian truy cập**: Thời gian để đọc/ghi một phần tử
- **Thời gian tìm kiếm**: Thời gian để tìm một phần tử
- **Thời gian chèn/xóa**: Thời gian để thêm/bớt phần tử
- **Sử dụng bộ nhớ**: Lượng RAM cần thiết

---

## 1.2. Mảng tĩnh

### 1.2.1. Định nghĩa
**Mảng tĩnh** là cấu trúc dữ liệu lưu trữ các phần tử cùng kiểu trong các ô nhớ liên tiếp, với kích thước cố định được xác định tại thời điểm khai báo.

### 1.2.2. Đặc điểm
```
Địa chỉ bộ nhớ:  1000   1004   1008   1012   1016
                ┌──────┬──────┬──────┬──────┬──────┐
    Mảng A:     │  10  │  20  │  30  │  40  │  50  │
                └──────┴──────┴──────┴──────┴──────┘
    Chỉ số:        0      1      2      3      4
    
    Kích thước cố định: 5 phần tử
```

### 1.2.3. Ưu điểm
- ✅ Truy cập ngẫu nhiên O(1) thông qua chỉ số
- ✅ Thân thiện với bộ nhớ đệm do vùng nhớ liên tục
- ✅ Không có chi phí phụ về bộ nhớ

### 1.2.4. Nhược điểm
- ❌ Kích thước cố định, không thể thay đổi
- ❌ Lãng phí bộ nhớ nếu không sử dụng hết
- ❌ Không đủ chỗ nếu cần thêm phần tử

---

## 1.3. Mảng động

### 1.3.1. Định nghĩa
**Mảng động** là cấu trúc dữ liệu mảng có khả năng tự động thay đổi kích thước khi cần thiết. Nó kết hợp ưu điểm của mảng tĩnh (truy cập O(1)) với khả năng mở rộng linh hoạt.

### 1.3.2. Cấu trúc bên trong

```
┌─────────────────────────────────────────────────────┐
│                     MẢNG ĐỘNG                        │
├─────────────────────────────────────────────────────┤
│  Thuộc tính:                                        │
│  ┌─────────────┬─────────────┬─────────────────┐    │
│  │   duLieu    │  kichThuoc  │    dungLuong     │    │
│  │ (mảng nội  │ (số phần tử │  (dung lượng     │    │
│  │   bộ)      │  hiện tại)  │   tối đa)        │    │
│  └─────────────┴─────────────┴─────────────────┘    │
│                                                      │
│  Ví dụ: kichThuoc = 5, dungLuong = 8                │
│  ┌───┬───┬───┬───┬───┬───┬───┬───┐                 │
│  │ A │ B │ C │ D │ E │   │   │   │                 │
│  └───┴───┴───┴───┴───┴───┴───┴───┘                 │
│    0   1   2   3   4   5   6   7                    │
│    ├───────────────┤   ├───────────┤                │
│         Đã dùng         Còn trống                   │
└─────────────────────────────────────────────────────┘
```

### 1.3.3. Nguyên lý hoạt động

#### a) Khi thêm phần tử (hàm `them()`)
```
Trạng thái ban đầu: kichThuoc=4, dungLuong=4 (ĐẦY)
┌───┬───┬───┬───┐
│ 1 │ 2 │ 3 │ 4 │
└───┴───┴───┴───┘

Thêm phần tử 5 → Cần MỞ RỘNG (nhân đôi dung lượng)

Bước 1: Tạo mảng mới với dungLuong = 8
┌───┬───┬───┬───┬───┬───┬───┬───┐
│   │   │   │   │   │   │   │   │
└───┴───┴───┴───┴───┴───┴───┴───┘

Bước 2: Sao chép dữ liệu cũ sang
┌───┬───┬───┬───┬───┬───┬───┬───┐
│ 1 │ 2 │ 3 │ 4 │   │   │   │   │
└───┴───┴───┴───┴───┴───┴───┴───┘

Bước 3: Thêm phần tử mới
┌───┬───┬───┬───┬───┬───┬───┬───┐
│ 1 │ 2 │ 3 │ 4 │ 5 │   │   │   │
└───┴───┴───┴───┴───┴───┴───┴───┘
kichThuoc=5, dungLuong=8
```

#### b) Khi xóa phần tử (hàm `xoaTaiViTri()`)
```
Trạng thái: kichThuoc=2, dungLuong=8 (dùng < 25%)
┌───┬───┬───┬───┬───┬───┬───┬───┐
│ 1 │ 2 │   │   │   │   │   │   │
└───┴───┴───┴───┴───┴───┴───┴───┘

→ Thu nhỏ: dungLuong = dungLuong / 2 = 4
┌───┬───┬───┬───┐
│ 1 │ 2 │   │   │
└───┴───┴───┴───┘
kichThuoc=2, dungLuong=4
```

### 1.3.4. Chiến lược thay đổi kích thước

| Tình huống | Điều kiện | Hành động |
|------------|-----------|-----------|
| **Mở rộng** | kichThuoc ≥ dungLuong | dungLuong = dungLuong × 2 |
| **Thu nhỏ** | kichThuoc < dungLuong/4 | dungLuong = dungLuong / 2 |

**Tại sao nhân đôi mà không tăng thêm 1?**

Giả sử thêm n phần tử:
- **Tăng thêm 1**: Mở rộng mỗi lần thêm → Tổng chi phí: 1+2+3+...+n = O(n²)
- **Nhân đôi**: Mở rộng tại 1, 2, 4, 8... → Tổng chi phí: 1+2+4+...+n = O(2n) = O(n)

### 1.3.5. Ưu điểm của Mảng động
- ✅ Truy cập ngẫu nhiên O(1)
- ✅ Tự động mở rộng khi cần
- ✅ Tự động thu nhỏ để tiết kiệm bộ nhớ
- ✅ Thêm cuối mảng O(1) chi phí khấu hao

### 1.3.6. Nhược điểm
- ❌ Mở rộng tốn O(n) trong trường hợp xấu nhất
- ❌ Chèn/xóa ở giữa tốn O(n)
- ❌ Có thể lãng phí đến 50% bộ nhớ

---

## 1.4. So sánh các Cấu trúc dữ liệu

### 1.4.1. Bảng so sánh chi tiết

| Tiêu chí | Mảng tĩnh | Mảng động | DSLK đơn | DSLK đôi |
|----------|-----------|-----------|----------|----------|
| Truy cập chỉ số | O(1) | O(1) | O(n) | O(n) |
| Tìm kiếm | O(n) | O(n) | O(n) | O(n) |
| Thêm đầu | O(n) | O(n) | O(1) | O(1) |
| Thêm cuối | O(1) | O(1)* | O(n) | O(1) |
| Thêm giữa | O(n) | O(n) | O(1)** | O(1)** |
| Xóa đầu | O(n) | O(n) | O(1) | O(1) |
| Xóa cuối | O(1) | O(1) | O(n) | O(1) |
| Xóa giữa | O(n) | O(n) | O(1)** | O(1)** |
| Bộ nhớ | Cố định | Linh hoạt | +phụ phí | ++phụ phí |
| Bộ nhớ đệm | Tốt | Tốt | Kém | Kém |

*Chi phí khấu hao O(1), trường hợp xấu nhất O(n)
**Nếu đã có con trỏ đến vị trí cần chèn/xóa

### 1.4.2. Khi nào chọn Mảng động?

✅ **Nên dùng khi:**
- Cần truy cập ngẫu nhiên theo chỉ số thường xuyên
- Số lượng phần tử thay đổi nhưng không quá thường xuyên
- Thao tác chủ yếu ở cuối mảng (thêm/xóa cuối)
- Cần duyệt tuần tự hiệu quả

❌ **Không nên dùng khi:**
- Chèn/xóa ở đầu hoặc giữa thường xuyên
- Kích thước thay đổi liên tục với biên độ lớn
- Yêu cầu bộ nhớ tối ưu tuyệt đối

---

# PHẦN 2: PHÂN TÍCH BÀI TOÁN

## 2.1. Mô tả bài toán

### 2.1.1. Bối cảnh
Xây dựng hệ thống quản lý sinh viên cho một trường đại học/cao đẳng, cho phép lưu trữ, tra cứu và quản lý thông tin sinh viên một cách hiệu quả thông qua giao diện đồ họa trên trình duyệt web.

### 2.1.2. Đối tượng quản lý
**Sinh viên** (lớp `SinhVien` trong tệp `Student.js`) với các thuộc tính:
- `maSV` - Mã sinh viên (duy nhất, là khóa chính)
- `hoTen` - Họ và tên
- `ngaySinh` - Ngày sinh
- `gioiTinh` - Giới tính (Nam/Nữ)
- `tenLop` - Tên lớp
- `diemTB` - Điểm trung bình (0.0 - 10.0)

### 2.1.3. Biểu đồ chức năng

```
                         ┌─────────────────────────────────────┐
                         │     HỆ THỐNG QUẢN LÝ SINH VIÊN      │
                         └─────────────────────────────────────┘
                                          │
        ┌──────────┬──────────┬──────────┼──────────┬──────────┬──────────┐
        │          │          │          │          │          │          │
   ┌────▼────┐┌────▼────┐┌────▼────┐┌────▼────┐┌────▼────┐┌────▼────┐┌────▼────┐
   │  Thêm   ││  Sửa    ││  Xóa    ││   Tìm   ││   Lọc   ││Sắp xếp  ││ Thống  │
   │   SV    ││   SV    ││   SV    ││  kiếm   ││theo lớp ││         ││   kê   │
   └────┬────┘└────┬────┘└────┬────┘└────┬────┘└────┬────┘└────┬────┘└────┬────┘
        │          │          │          │          │          │          │
        └──────────┴──────────┴──────────┼──────────┴──────────┴──────────┘
                                         │
                                    ┌────▼────┐
                                    │ Người   │
                                    │  dùng   │
                                    └─────────┘
```

---

## 2.2. Yêu cầu chức năng

### 2.2.1. Nhóm chức năng CRUD

| STT | Chức năng | Mô tả | Hàm tương ứng | Tệp |
|-----|-----------|-------|----------------|------|
| 1 | Thêm SV | Thêm sinh viên mới | `themSinhVien()` | StudentManager.js |
| 2 | Sửa SV | Cập nhật thông tin | `capNhatSinhVien()` | StudentManager.js |
| 3 | Xóa SV | Xóa sinh viên | `xoaSinhVien()` | StudentManager.js |
| 4 | Hiển thị | Hiển thị danh sách | `_capNhatBang()` | UIController.js |

### 2.2.2. Nhóm chức năng tìm kiếm & lọc

| STT | Chức năng | Thuật toán | Hàm tương ứng |
|-----|-----------|------------|----------------|
| 5 | Tìm kiếm | Tìm kiếm tuyến tính O(n) | `timKiemSinhVien()` |
| 6 | Lọc theo lớp | Lọc tuyến tính O(n) | `locTheoLopHoc()` |
| 7 | Sắp xếp | TimSort O(n log n) | `layDanhSachDaSapXep()` |

### 2.2.3. Nhóm chức năng thống kê

| STT | Chức năng | Công thức | Hàm tương ứng |
|-----|-----------|-----------|----------------|
| 8 | Tổng số SV | `kichThuoc` | `danhSachSV.kichThuoc` |
| 9 | SV đạt | đếm(diemTB ≥ 5.0) | `demSinhVienDat()` |
| 10 | SV không đạt | đếm(diemTB < 5.0) | `demSinhVienChuaDat()` |
| 11 | Điểm TB chung | tổng(diemTB) / sốSV | `tinhDiemTrungBinhChung()` |

---

## 2.3. Yêu cầu phi chức năng

### 2.3.1. Hiệu năng
- Thời gian phản hồi < 100ms cho các thao tác CRUD
- Hỗ trợ tối thiểu 1000 sinh viên

### 2.3.2. Giao diện đồ họa
- Thiết kế đáp ứng (responsive) trên các thiết bị
- Thân thiện, dễ sử dụng
- Có phản hồi trực quan (thông báo nổi)
- Phân trang, tìm kiếm theo thời gian thực

### 2.3.3. Dữ liệu
- Lưu trữ bền vững qua bộ nhớ cục bộ (localStorage)
- Hỗ trợ xuất tệp Excel (.xlsx)

### 2.3.4. Bảo trì
- Mã nguồn tách module rõ ràng (mỗi lớp một tệp)
- Có chú thích chi tiết bằng tiếng Việt

---

## 2.4. Mô hình hóa dữ liệu

### 2.4.1. Sơ đồ lớp

```
┌─────────────────────────────────────────────────────────┐
│                    MangDong (Mảng động)                   │
│                    Tệp: DynamicArray.js                  │
├─────────────────────────────────────────────────────────┤
│ - duLieu: Array            // Mảng nội bộ               │
│ - kichThuoc: number        // Số phần tử hiện tại       │
│ - dungLuong: number        // Dung lượng tối đa         │
│ - soLanThayDoi: number     // Đếm số lần mở rộng       │
├─────────────────────────────────────────────────────────┤
│ + them(phanTu): number                                  │
│ + xoaTaiViTri(viTri): *                                 │
│ + layGiaTri(viTri): *                                   │
│ + ganGiaTri(viTri, phanTu): void                        │
│ + timViTri(dieuKien): number                            │
│ + loc(dieuKien): Array                                  │
│ + sapXep(hamSoSanh): void                               │
│ + chuyenThanhMang(): Array                              │
│ + xoaTatCa(): void                                      │
│ - _thayDoiKichThuoc(dungLuongMoi): void                 │
└─────────────────────────────────────────────────────────┘
                           ▲
                           │ sử dụng
                           │
┌─────────────────────────────────────────────────────────┐
│                 BoQuanLySinhVien                          │
│                 Tệp: StudentManager.js                   │
├─────────────────────────────────────────────────────────┤
│ - danhSachSV: MangDong<SinhVien>                        │
│ - trangHienTai: number                                  │
│ - soDongMoiTrang: number                                │
│ - truongSapXep: string                                  │
│ - sapXepTangDan: boolean                                │
│ - locTheoLop: string                                    │
│ - tuKhoaTimKiem: string                                 │
│ - viTriDangSua: number                                  │
├─────────────────────────────────────────────────────────┤
│ + themSinhVien(sv: SinhVien): boolean                   │
│ + capNhatSinhVien(viTri, sv: SinhVien): boolean         │
│ + xoaSinhVien(viTri): boolean                           │
│ + timKiemSinhVien(tuKhoa): SinhVien[]                   │
│ + locTheoLopHoc(tenLop): SinhVien[]                     │
│ + layDanhSachDaSapXep(ds): SinhVien[]                   │
│ + tinhDiemTrungBinhChung(): number                      │
│ + demSinhVienDat(): number                              │
│ + demSinhVienChuaDat(): number                          │
│ + layDanhSachLopDuyNhat(): string[]                     │
│ + xuatExcel(): string                                   │
│ + taiDuLieuMau(): number                                │
└─────────────────────────────────────────────────────────┘
                           │
                           │ quản lý
                           ▼
┌─────────────────────────────────────────────────────────┐
│                      SinhVien                            │
│                      Tệp: Student.js                    │
├─────────────────────────────────────────────────────────┤
│ + maSV: string           // Mã sinh viên                │
│ + hoTen: string          // Họ và tên                   │
│ + ngaySinh: string       // Ngày sinh                   │
│ + gioiTinh: string       // Giới tính                   │
│ + tenLop: string         // Tên lớp                     │
│ + diemTB: number         // Điểm trung bình             │
├─────────────────────────────────────────────────────────┤
│ + layXepLoai(): {tenXepLoai, lop}                       │
│ + layNgaySinhDinhDang(): string                         │
│ + chuyenSangJSON(): Object                              │
│ + [tĩnh] taoTuJSON(duLieu): SinhVien                   │
└─────────────────────────────────────────────────────────┘
```

### 2.4.2. Quy tắc xếp loại

| Điểm trung bình | Xếp loại | Hàm `layXepLoai()` |
|------------------|----------|---------------------|
| 9.0 - 10.0 | Xuất sắc | `grade-excellent` |
| 8.0 - 8.99 | Giỏi | `grade-excellent` |
| 6.5 - 7.99 | Khá | `grade-good` |
| 5.0 - 6.49 | Trung bình | `grade-average` |
| 3.5 - 4.99 | Yếu | `grade-weak` |
| 0.0 - 3.49 | Kém | `grade-fail` |

---

# PHẦN 3: THUẬT TOÁN SỬ DỤNG

## 3.1. Thuật toán Thêm phần tử (hàm `them()`)

### 3.1.1. Mã giả

```
THUẬT TOÁN Them(phanTu)
    ĐẦU VÀO: phanTu - phần tử cần thêm
    ĐẦU RA:  kichThuoc - kích thước mảng sau khi thêm

    BẮT ĐẦU
        // Kiểm tra cần mở rộng không
        NẾU kichThuoc >= dungLuong THÌ
            ThayDoiKichThuoc(dungLuong * 2)
        KẾT THÚC NẾU
        
        // Thêm phần tử vào cuối
        duLieu[kichThuoc] ← phanTu
        kichThuoc ← kichThuoc + 1
        
        TRẢ VỀ kichThuoc
    KẾT THÚC
```

### 3.1.2. Lưu đồ thuật toán

```
        ┌─────────────┐
        │  BẮT ĐẦU    │
        └──────┬──────┘
               │
               ▼
        ┌──────────────┐
        │ kichThuoc ≥  │
        │ dungLuong?   │
        └──────┬───────┘
               │
        ┌──────┴──────┐
        │Đúng         │Sai
        ▼             │
┌────────────────┐    │
│ ThayDoiKichThuoc│    │
│ (dungLuong * 2)│    │
└───────┬────────┘    │
        │             │
        └──────┬──────┘
               │
               ▼
        ┌──────────────┐
        │ duLieu       │
        │ [kichThuoc]  │
        │ = phanTu     │
        └──────┬───────┘
               │
               ▼
        ┌──────────────┐
        │ kichThuoc++  │
        └──────┬───────┘
               │
               ▼
        ┌──────────────┐
        │ TRẢ VỀ       │
        │ kichThuoc    │
        └──────┬───────┘
               │
               ▼
        ┌─────────────┐
        │  KẾT THÚC   │
        └─────────────┘
```

### 3.1.3. Cài đặt (tệp DynamicArray.js)

```javascript
them(phanTu) {
    if (this.kichThuoc >= this.dungLuong) {
        this._thayDoiKichThuoc(this.dungLuong * 2);
    }
    this.duLieu[this.kichThuoc] = phanTu;
    this.kichThuoc++;
    return this.kichThuoc;
}
```

---

## 3.2. Thuật toán Xóa phần tử (hàm `xoaTaiViTri()`)

### 3.2.1. Mã giả

```
THUẬT TOÁN XoaTaiViTri(viTri)
    ĐẦU VÀO: viTri - vị trí cần xóa
    ĐẦU RA:  phanTuDaXoa - phần tử bị xóa

    BẮT ĐẦU
        // Kiểm tra vị trí hợp lệ
        NẾU viTri < 0 HOẶC viTri >= kichThuoc THÌ
            BÁO LỖI "Vị trí nằm ngoài phạm vi mảng!"
        KẾT THÚC NẾU
        
        // Lưu phần tử cần xóa
        phanTuDaXoa ← duLieu[viTri]
        
        // Dịch chuyển các phần tử về trước
        VỚI i TỪ viTri ĐẾN kichThuoc - 2 LÀM
            duLieu[i] ← duLieu[i + 1]
        KẾT THÚC VỚI
        
        // Giảm kích thước
        kichThuoc ← kichThuoc - 1
        duLieu[kichThuoc] ← rỗng
        
        // Thu nhỏ nếu sử dụng < 25%
        NẾU kichThuoc < dungLuong/4 VÀ dungLuong > 4 THÌ
            ThayDoiKichThuoc(dungLuong / 2)
        KẾT THÚC NẾU
        
        TRẢ VỀ phanTuDaXoa
    KẾT THÚC
```

### 3.2.2. Minh họa

```
Xóa phần tử tại viTri = 2:

Trước khi xóa:
┌───┬───┬───┬───┬───┐
│ A │ B │ C │ D │ E │    kichThuoc = 5
└───┴───┴───┴───┴───┘
  0   1   2   3   4
          ↑
        Xóa C

Bước 1: Dịch chuyển D và E về trước
┌───┬───┬───┬───┬───┐
│ A │ B │ D │ E │ E │
└───┴───┴───┴───┴───┘
          ↑   ↑
       D←─┘   E←─┘

Bước 2: Xóa phần tử cuối và giảm kichThuoc
┌───┬───┬───┬───┬───┐
│ A │ B │ D │ E │   │    kichThuoc = 4
└───┴───┴───┴───┴───┘
```

### 3.2.3. Cài đặt (tệp DynamicArray.js)

```javascript
xoaTaiViTri(viTri) {
    if (viTri < 0 || viTri >= this.kichThuoc) {
        throw new Error('Vị trí nằm ngoài phạm vi mảng!');
    }

    const phanTuDaXoa = this.duLieu[viTri];

    // Dịch chuyển các phần tử sang trái
    for (let i = viTri; i < this.kichThuoc - 1; i++) {
        this.duLieu[i] = this.duLieu[i + 1];
    }

    this.kichThuoc--;
    this.duLieu[this.kichThuoc] = undefined;

    // Thu nhỏ mảng nếu sử dụng < 25% dung lượng
    if (this.kichThuoc < this.dungLuong / 4 && this.dungLuong > 4) {
        this._thayDoiKichThuoc(Math.floor(this.dungLuong / 2));
    }

    return phanTuDaXoa;
}
```

---

## 3.3. Thuật toán Tìm kiếm tuyến tính (hàm `timViTri()`)

### 3.3.1. Mã giả

```
THUẬT TOÁN TimKiemTuyenTinh(tuKhoa)
    ĐẦU VÀO: tuKhoa - từ khóa tìm kiếm
    ĐẦU RA:  ketQua - mảng kết quả

    BẮT ĐẦU
        ketQua ← []
        tuKhoa ← chuyen_thuong(tuKhoa)
        
        VỚI i TỪ 0 ĐẾN kichThuoc - 1 LÀM
            sv ← duLieu[i]
            
            NẾU chua(chuyen_thuong(sv.maSV), tuKhoa) HOẶC
               chua(chuyen_thuong(sv.hoTen), tuKhoa) HOẶC
               chua(chuyen_thuong(sv.tenLop), tuKhoa) THÌ
                them(ketQua, sv)
            KẾT THÚC NẾU
        KẾT THÚC VỚI
        
        TRẢ VỀ ketQua
    KẾT THÚC
```

### 3.3.2. Cài đặt (tệp StudentManager.js)

```javascript
timKiemSinhVien(tuKhoa) {
    tuKhoa = tuKhoa.toLowerCase().trim();
    if (!tuKhoa) return this.danhSachSV.chuyenThanhMang();

    return this.danhSachSV.loc(sv =>
        sv.maSV.toLowerCase().includes(tuKhoa) ||
        sv.hoTen.toLowerCase().includes(tuKhoa) ||
        sv.tenLop.toLowerCase().includes(tuKhoa)
    );
}
```

### 3.3.3. Độ phức tạp
- **Thời gian**: O(n × m) với n là số sinh viên, m là độ dài trung bình của chuỗi
- **Không gian**: O(k) với k là số kết quả tìm được
- **Lý do chọn tìm kiếm tuyến tính**: Dữ liệu không sắp xếp sẵn theo mã SV, tìm kiếm nhị phân yêu cầu mảng đã sắp xếp

---

## 3.4. Thuật toán Sắp xếp (hàm `layDanhSachDaSapXep()`)

### 3.4.1. TimSort

JavaScript Engine sử dụng thuật toán **TimSort** - thuật toán lai giữa Merge Sort và Insertion Sort, được phát minh bởi Tim Peters (2002).

**Đặc điểm:**
- Ổn định (stable sort): giữ nguyên thứ tự các phần tử bằng nhau
- Hiệu quả với dữ liệu thực tế (gần sắp xếp sẵn)
- Được dùng trong Python và Java

### 3.4.2. Minh họa sắp xếp theo điểm TB

```
Sắp xếp theo điểm TB tăng dần:

Ban đầu:  [8.5, 3.2, 7.5, 1.0, 5.5]

TimSort chia mảng thành các "run" đã sắp xếp:
  run1: [8.5]  run2: [3.2, 7.5]  run3: [1.0, 5.5]

Gộp (Merge) các run:
  [3.2, 7.5, 8.5]  +  [1.0, 5.5]

Kết quả: [1.0, 3.2, 5.5, 7.5, 8.5]
```

### 3.4.3. Cài đặt (tệp StudentManager.js)

```javascript
layDanhSachDaSapXep(danhSach) {
    const daSapXep = [...danhSach];
    daSapXep.sort((a, b) => {
        let ketQua = 0;
        switch (this.truongSapXep) {
            case 'maSV':
                ketQua = a.maSV.localeCompare(b.maSV);
                break;
            case 'hoTen':
                // localeCompare('vi') để sắp xếp đúng tiếng Việt
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
}
```

**Lưu ý:** Sử dụng `localeCompare('vi')` để sắp xếp đúng thứ tự tiếng Việt (Ă, Â, Đ, Ê, Ô, Ơ, Ư).

---

## 3.5. Thuật toán Thay đổi kích thước (hàm `_thayDoiKichThuoc()`)

### 3.5.1. Mã giả

```
THUẬT TOÁN ThayDoiKichThuoc(dungLuongMoi)
    ĐẦU VÀO: dungLuongMoi - dung lượng mới

    BẮT ĐẦU
        // Tạo mảng mới với kích thước mới
        mangMoi ← Mang_moi(dungLuongMoi)
        
        // Sao chép dữ liệu
        VỚI i TỪ 0 ĐẾN kichThuoc - 1 LÀM
            mangMoi[i] ← duLieu[i]
        KẾT THÚC VỚI
        
        // Cập nhật tham chiếu
        duLieu ← mangMoi
        dungLuong ← dungLuongMoi
        soLanThayDoi ← soLanThayDoi + 1
    KẾT THÚC
```

### 3.5.2. Minh họa

```
Mở rộng từ dungLuong=4 thành dungLuong=8:

Mảng cũ (dungLuong=4):
┌───┬───┬───┬───┐
│ A │ B │ C │ D │
└───┴───┴───┴───┘

Tạo mảng mới (dungLuong=8):
┌───┬───┬───┬───┬───┬───┬───┬───┐
│   │   │   │   │   │   │   │   │
└───┴───┴───┴───┴───┴───┴───┴───┘

Sao chép dữ liệu:
┌───┬───┬───┬───┬───┬───┬───┬───┐
│ A │ B │ C │ D │   │   │   │   │
└───┴───┴───┴───┴───┴───┴───┴───┘
  ↑   ↑   ↑   ↑
  └───┴───┴───┴── Sao chép từ mảng cũ
```

### 3.5.3. Cài đặt (tệp DynamicArray.js)

```javascript
_thayDoiKichThuoc(dungLuongMoi) {
    const dungLuongCu = this.dungLuong;
    const mangMoi = new Array(dungLuongMoi);
    for (let i = 0; i < this.kichThuoc; i++) {
        mangMoi[i] = this.duLieu[i];
    }
    this.duLieu = mangMoi;
    this.dungLuong = dungLuongMoi;
    this.soLanThayDoi++;
}
```

---

# PHẦN 4: ĐÁNH GIÁ ĐỘ PHỨC TẠP

## 4.1. Độ phức tạp thời gian

### 4.1.1. Bảng tổng hợp

| Thao tác | Hàm | Tốt nhất | Trung bình | Xấu nhất | Ghi chú |
|----------|------|----------|------------|----------|---------|
| **Thêm** | `them()` | O(1) | O(1)* | O(n) | *Chi phí khấu hao |
| **Xóa tại vị trí** | `xoaTaiViTri()` | O(1) | O(n) | O(n) | Dịch chuyển phần tử |
| **Truy cập** | `layGiaTri()` | O(1) | O(1) | O(1) | Truy cập trực tiếp |
| **Cập nhật** | `ganGiaTri()` | O(1) | O(1) | O(1) | Gán trực tiếp |
| **Tìm kiếm** | `timViTri()` | O(1) | O(n) | O(n) | Tìm tuyến tính |
| **Lọc** | `loc()` | O(n) | O(n) | O(n) | Duyệt toàn bộ |
| **Sắp xếp** | `sapXep()` | O(n) | O(n log n) | O(n log n) | TimSort |
| **Thay đổi kích thước** | `_thayDoiKichThuoc()` | O(n) | O(n) | O(n) | Sao chép toàn bộ |

### 4.1.2. Biểu đồ so sánh các bậc

```
Thời gian
    │
    │     
  n │                              ╱ O(n²) 
    │                           ╱
    │                        ╱
    │                     ╱
    │                  ╱        ╱ O(n log n)
    │               ╱        ╱
    │            ╱        ╱
    │         ╱        ╱
    │      ╱       ╱           ╱ O(n)
    │   ╱      ╱            ╱
    │╱      ╱            ╱
    │    ╱            ╱
    │ ╱           ╱
    │_________╱__________________ O(1)
    └───────────────────────────────── n (số phần tử)
```

---

## 4.2. Độ phức tạp không gian

### 4.2.1. Phân tích

| Thành phần | Không gian | Mô tả |
|------------|------------|-------|
| Mảng `duLieu` | O(dungLuong) | Dung lượng tối đa |
| Biến `kichThuoc` | O(1) | Số nguyên |
| Biến `dungLuong` | O(1) | Số nguyên |
| Mảng tạm khi mở rộng | O(n) | Mảng mới tạm thời |

### 4.2.2. Tổng không gian

```
Không gian = O(dungLuong) + O(1) + O(1) = O(dungLuong)

Với dungLuong ≤ 2 × kichThuoc (do chiến lược nhân đôi):
Không gian = O(2n) = O(n)
```

### 4.2.3. Tỷ lệ lãng phí bộ nhớ

```
Trường hợp tốt nhất: kichThuoc = dungLuong → 0% lãng phí
Trường hợp xấu nhất: kichThuoc = dungLuong/2 + 1 → ~50% lãng phí

Trung bình: ~25% lãng phí
```

---

## 4.3. Phân tích chi phí khấu hao (Amortized Analysis)

### 4.3.1. Khái niệm
**Phân tích chi phí khấu hao** là phương pháp phân tích chi phí trung bình của một chuỗi thao tác, thay vì chỉ xét trường hợp xấu nhất của từng thao tác riêng lẻ.

### 4.3.2. Phân tích thao tác `them()`

**Phương pháp Gộp (Aggregate):**

Giả sử thực hiện n thao tác thêm bắt đầu từ mảng rỗng với dungLuong = 1:

```
Thao tác    | Dung lượng trước | Mở rộng? | Chi phí
------------|------------------|----------|--------
Thêm 1      | 1                | Có       | 1 + 1 = 2
Thêm 2      | 2                | Có       | 1 + 2 = 3
Thêm 3      | 4                | Không    | 1
Thêm 4      | 4                | Có       | 1 + 4 = 5
Thêm 5      | 8                | Không    | 1
Thêm 6      | 8                | Không    | 1
Thêm 7      | 8                | Không    | 1
Thêm 8      | 8                | Có       | 1 + 8 = 9
...
```

**Tính tổng chi phí:**
```
T(n) = n + (1 + 2 + 4 + 8 + ... + 2^k)
     = n + (2^(k+1) - 1)
     = n + 2n - 1
     = 3n - 1
     = O(n)
```

**Chi phí trung bình mỗi thao tác:**
```
T(n) / n = O(n) / n = O(1)
```

### 4.3.3. Phương pháp Kế toán (Accounting)

```
Mỗi thao tác thêm, "trả" 3 đồng:
- 1 đồng cho việc thêm phần tử
- 2 đồng tiết kiệm cho việc mở rộng tương lai

Khi mở rộng (gấp đôi từ k lên 2k):
- Cần sao chép k phần tử
- Đã tiết kiệm được k × 2 = 2k đồng từ k phần tử trước
- Đủ để trả cho việc mở rộng!

→ Chi phí khấu hao = 3 = O(1)
```

---

## 4.4. So sánh hiệu năng thực tế

### 4.4.1. Ước lượng với n = 10,000 sinh viên

| Thao tác | Mảng động | Mảng tĩnh | Danh sách liên kết |
|----------|-----------|-----------|---------------------|
| Thêm 10,000 SV | ~5ms | ~3ms* | ~8ms |
| Tìm kiếm | ~2ms | ~2ms | ~15ms |
| Sắp xếp | ~10ms | ~10ms | ~50ms |
| Truy cập ngẫu nhiên | <0.01ms | <0.01ms | ~5ms |

*Mảng tĩnh cần biết trước kích thước

### 4.4.2. Kết luận

✅ **Mảng động** là lựa chọn phù hợp cho bài toán quản lý sinh viên vì:
1. Số lượng sinh viên thay đổi → cần mảng linh hoạt
2. Cần truy cập ngẫu nhiên nhanh → O(1)
3. Thao tác thêm cuối thường xuyên → O(1) chi phí khấu hao
4. Thao tác xóa không quá thường xuyên → O(n) chấp nhận được

---

# PHẦN 5: CẤU TRÚC MÃ NGUỒN

## 5.1. Sơ đồ module

```
QuanLySinhVien/
│
├── index.html              ← Giao diện HTML chính
├── styles.css              ← Kiểu dáng giao diện (CSS)
│
├── DynamicArray.js         ← Lớp MangDong (cấu trúc mảng động)
│   └── 7 thuật toán: them, xoaTaiViTri, layGiaTri, ganGiaTri,
│       timViTri, sapXep, loc, _thayDoiKichThuoc
│
├── Student.js              ← Lớp SinhVien (đối tượng sinh viên)
│   └── layXepLoai, layNgaySinhDinhDang, chuyenSangJSON, taoTuJSON
│
├── data.js                 ← Hằng số DU_LIEU_MAU (9 sinh viên mẫu)
│
├── StudentManager.js       ← Lớp BoQuanLySinhVien (logic nghiệp vụ)
│   └── CRUD: themSinhVien, capNhatSinhVien, xoaSinhVien
│   └── Tìm kiếm: timKiemSinhVien, locTheoLopHoc
│   └── Sắp xếp: layDanhSachDaSapXep
│   └── Thống kê: tinhDiemTrungBinhChung, demSinhVienDat, demSinhVienChuaDat
│   └── Tiện ích: xuatExcel, taiDuLieuMau, phân trang, localStorage
│
├── UIController.js         ← Lớp DieuKhienGiaoDien (điều khiển giao diện)
│   └── Hiển thị: _capNhatBang, _capNhatThongKe, _capNhatThongTinMangDong
│   └── Sự kiện: _ganSuKien, _xuLyGuiBieuMau
│   └── Tương tác: suaSinhVien, xacNhanXoa, _hienThongBao
│
├── main.js                 ← Điểm khởi tạo ứng dụng
│   └── Tạo boQuanLy (BoQuanLySinhVien)
│   └── Tạo ungDung (DieuKhienGiaoDien)
│
├── app.js                  ← (Không sử dụng - đã tách module)
└── BaoCaoLyThuyet.md       ← Tài liệu báo cáo (tệp này)
```

## 5.2. Mô tả từng tệp

| Tệp | Lớp/Biến | Vai trò | Lý thuyết liên quan |
|------|----------|---------|---------------------|
| `DynamicArray.js` | `MangDong` | Cấu trúc dữ liệu mảng động | Mảng động, chiến lược nhân đôi, chi phí khấu hao |
| `Student.js` | `SinhVien` | Mô hình hóa đối tượng sinh viên | Đối tượng, đóng gói dữ liệu |
| `data.js` | `DU_LIEU_MAU` | Dữ liệu kiểm thử | - |
| `StudentManager.js` | `BoQuanLySinhVien` | Logic CRUD, tìm kiếm, sắp xếp | Tìm kiếm tuyến tính, TimSort, lọc dữ liệu |
| `UIController.js` | `DieuKhienGiaoDien` | Giao diện đồ họa, sự kiện | Mô hình MVC, xử lý sự kiện |
| `main.js` | `boQuanLy`, `ungDung` | Khởi tạo ứng dụng | Điểm vào chương trình |

## 5.3. Thứ tự tải module (trong index.html)

```
1. DynamicArray.js   → Mảng động (không phụ thuộc gì)
2. Student.js        → Đối tượng sinh viên (không phụ thuộc gì)
3. data.js           → Dữ liệu mẫu (không phụ thuộc gì)
4. StudentManager.js → Phụ thuộc: MangDong + SinhVien + DU_LIEU_MAU
5. UIController.js   → Phụ thuộc: BoQuanLySinhVien + SinhVien
6. main.js           → Phụ thuộc: BoQuanLySinhVien + DieuKhienGiaoDien
```

---

# TÀI LIỆU THAM KHẢO

1. **Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C.** (2009). *Introduction to Algorithms* (3rd ed.). MIT Press.

2. **Sedgewick, R., & Wayne, K.** (2011). *Algorithms* (4th ed.). Addison-Wesley.

3. **Goodrich, M. T., & Tamassia, R.** (2014). *Data Structures and Algorithms in Java* (6th ed.). Wiley.

4. **MDN Web Docs.** *Array - JavaScript*. https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array

5. **GeeksforGeeks.** *Dynamic Array*. https://www.geeksforgeeks.org/dynamic-array/

---

**© 2026 - Báo cáo Đề tài Lập trình Nâng cao**
**Đề tài: Xây dựng phần mềm Quản lý Sinh viên sử dụng Cấu trúc Mảng động và Giao diện đồ họa**
