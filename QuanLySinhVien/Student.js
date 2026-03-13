/**
 * ============================================================
 * MODULE: ĐỐI TƯỢNG SINH VIÊN
 * Tệp: Student.js
 * ============================================================
 * 
 * Mô hình hóa dữ liệu:
 * - Mỗi sinh viên là một đối tượng với các thuộc tính:
 *   + maSV (chuỗi):       Mã sinh viên - khóa chính, duy nhất
 *   + hoTen (chuỗi):      Họ và tên
 *   + ngaySinh (chuỗi):   Ngày sinh (định dạng YYYY-MM-DD)
 *   + gioiTinh (chuỗi):   Giới tính (Nam/Nữ)
 *   + tenLop (chuỗi):     Tên lớp
 *   + diemTB (số):         Điểm trung bình (0.0 - 10.0)
 * 
 * Xếp loại học lực theo thang điểm 10:
 *   >= 9.0: Xuất sắc
 *   >= 8.0: Giỏi
 *   >= 6.5: Khá
 *   >= 5.0: Trung bình
 *   >= 3.5: Yếu
 *   <  3.5: Kém
 * 
 * ============================================================
 */

class SinhVien {
    /**
     * Khởi tạo đối tượng sinh viên
     * @param {string} maSV - Mã sinh viên (VD: SV001)
     * @param {string} hoTen - Họ và tên
     * @param {string} ngaySinh - Ngày sinh (YYYY-MM-DD)
     * @param {string} gioiTinh - Giới tính
     * @param {string} tenLop - Tên lớp
     * @param {number} diemTB - Điểm trung bình
     */
    constructor(maSV, hoTen, ngaySinh, gioiTinh, tenLop, diemTB) {
        this.maSV = maSV;
        this.hoTen = hoTen;
        this.ngaySinh = ngaySinh;
        this.gioiTinh = gioiTinh;
        this.tenLop = tenLop;
        this.diemTB = parseFloat(diemTB);
    }

    /**
     * Xếp loại học lực dựa trên điểm trung bình
     * 
     * Thuật toán: So sánh tuần tự (Sequential Comparison)
     *   - Kiểm tra từ mức cao nhất đến thấp nhất
     *   - Trả về ngay khi tìm được mức phù hợp
     * 
     * Độ phức tạp: O(1) - tối đa 6 phép so sánh
     * 
     * @returns {Object} { tenXepLoai: string, lop: string }
     */
    layXepLoai() {
        if (this.diemTB >= 9.0) return { tenXepLoai: 'Xuất sắc', lop: 'grade-excellent' };
        if (this.diemTB >= 8.0) return { tenXepLoai: 'Giỏi', lop: 'grade-excellent' };
        if (this.diemTB >= 6.5) return { tenXepLoai: 'Khá', lop: 'grade-good' };
        if (this.diemTB >= 5.0) return { tenXepLoai: 'Trung bình', lop: 'grade-average' };
        if (this.diemTB >= 3.5) return { tenXepLoai: 'Yếu', lop: 'grade-weak' };
        return { tenXepLoai: 'Kém', lop: 'grade-fail' };
    }

    /**
     * Định dạng ngày sinh sang kiểu Việt Nam (dd/mm/yyyy)
     * @returns {string} Ngày sinh đã định dạng
     */
    layNgaySinhDinhDang() {
        const ngay = new Date(this.ngaySinh);
        return ngay.toLocaleDateString('vi-VN');
    }

    /**
     * Chuyển đối tượng sang dạng đối tượng thuần (để lưu localStorage)
     * @returns {Object}
     */
    chuyenSangJSON() {
        return {
            maSV: this.maSV,
            hoTen: this.hoTen,
            ngaySinh: this.ngaySinh,
            gioiTinh: this.gioiTinh,
            tenLop: this.tenLop,
            diemTB: this.diemTB
        };
    }

    /**
     * Tạo đối tượng SinhVien từ đối tượng thuần
     * @param {Object} duLieu - Dữ liệu đối tượng thuần
     * @returns {SinhVien}
     */
    static taoTuJSON(duLieu) {
        return new SinhVien(duLieu.maSV, duLieu.hoTen, duLieu.ngaySinh, duLieu.gioiTinh, duLieu.tenLop, duLieu.diemTB);
    }
}
