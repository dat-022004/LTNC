/**
 * ============================================================
 * MODULE: KHỞI TẠO ỨNG DỤNG
 * Tệp: main.js
 * ============================================================
 * 
 * Tệp này là điểm khởi tạo của ứng dụng.
 * Thứ tự tải các module:
 *   1. DynamicArray.js   → Cấu trúc dữ liệu mảng động (lớp MangDong)
 *   2. Student.js        → Đối tượng sinh viên (lớp SinhVien)
 *   3. data.js           → Dữ liệu mẫu (DU_LIEU_MAU)
 *   4. StudentManager.js → Logic nghiệp vụ (lớp BoQuanLySinhVien)
 *   5. UIController.js   → Giao diện đồ họa (lớp DieuKhienGiaoDien)
 *   6. main.js           → Khởi tạo (tệp này)
 * 
 * ============================================================
 */

// Tạo đối tượng quản lý sinh viên (sử dụng mảng động bên trong)
const boQuanLy = new BoQuanLySinhVien();

// Tạo đối tượng điều khiển giao diện
const ungDung = new DieuKhienGiaoDien(boQuanLy);

// ============================================
// HIỂN THỊ THÔNG TIN HỆ THỐNG VÀ ĐỘ PHỨC TẠP
// ============================================
console.log('===========================================');
console.log('HỆ THỐNG QUẢN LÝ SINH VIÊN');
console.log('Cấu trúc dữ liệu: MẢNG ĐỘNG');
console.log('===========================================');
console.log('');
console.log('📁 Cấu trúc module:');
console.log('  ├── DynamicArray.js   - Mảng động (lớp MangDong)');
console.log('  ├── Student.js        - Đối tượng sinh viên (lớp SinhVien)');
console.log('  ├── StudentManager.js - Quản lý CRUD (lớp BoQuanLySinhVien)');
console.log('  ├── UIController.js   - Giao diện (lớp DieuKhienGiaoDien)');
console.log('  └── main.js           - Khởi tạo ứng dụng');
console.log('');
console.log('📊 Bảng độ phức tạp thuật toán:');
console.log('┌──────────────────────┬──────────┬──────────┬────────────┐');
console.log('│ Thao tác             │ Tốt nhất │ Xấu nhất │ Trung bình │');
console.log('├──────────────────────┼──────────┼──────────┼────────────┤');
console.log('│ Thêm (them)          │ O(1)     │ O(n)     │ O(1)*      │');
console.log('│ Xóa (xoaTaiViTri)   │ O(1)     │ O(n)     │ O(n)       │');
console.log('│ Truy cập (layGiaTri) │ O(1)     │ O(1)     │ O(1)       │');
console.log('│ Tìm kiếm (timViTri) │ O(1)     │ O(n)     │ O(n)       │');
console.log('│ Sắp xếp (sapXep)    │ O(n)     │ O(nlogn) │ O(nlogn)   │');
console.log('│ Lọc (loc)            │ O(n)     │ O(n)     │ O(n)       │');
console.log('│ Thay đổi kích thước  │ O(n)     │ O(n)     │ O(n)       │');
console.log('└──────────────────────┴──────────┴──────────┴────────────┘');
console.log('  * Chi phí khấu hao O(1) - Amortized Analysis');
console.log('');
console.log('🔧 Trạng thái mảng động:');
console.log(`  Kích thước: ${boQuanLy.danhSachSV.kichThuoc}, Dung lượng: ${boQuanLy.danhSachSV.dungLuong}`);
console.log('===========================================');
