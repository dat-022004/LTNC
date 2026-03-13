/**
 * ============================================================
 * MODULE: CẤU TRÚC DỮ LIỆU - MẢNG ĐỘNG (Dynamic Array)
 * Tệp: MangDong.js
 * ============================================================
 * 
 * Cơ sở lý thuyết:
 * - Mảng động là cấu trúc dữ liệu tuyến tính có khả năng tự động 
 *   thay đổi kích thước khi cần thiết.
 * - Khác với mảng tĩnh (kích thước cố định), mảng động tự động 
 *   mở rộng khi đầy và thu nhỏ khi sử dụng quá ít.
 * 
 * Chiến lược thay đổi kích thước (Doubling Strategy):
 * - Mở rộng: Khi kichThuoc >= dungLuong → dungLuong *= 2 (gấp đôi)
 * - Thu nhỏ: Khi kichThuoc < dungLuong/4 → dungLuong /= 2 (giảm một nửa)
 * - Điều kiện tối thiểu: dungLuong >= 4 (không thu nhỏ dưới 4)
 * 
 * Phân tích chi phí khấu hao (Amortized Analysis):
 * - Mặc dù thayDoiKichThuoc tốn O(n), nhưng chỉ xảy ra sau n lần thêm
 * - Chi phí trung bình mỗi lần thêm = O(1) (amortized)
 * - Chứng minh bằng phương pháp tổng (Aggregate method):
 *   Tổng chi phí cho n lần thêm = n + (1 + 2 + 4 + ... + n) = n + 2n - 1 = 3n - 1
 *   → Chi phí trung bình = (3n - 1) / n ≈ 3 = O(1)
 * 
 * ============================================================
 */

class MangDong {
    /**
     * Khởi tạo mảng động
     * @param {number} dungLuongBanDau - Dung lượng ban đầu (mặc định: 4)
     */
    constructor(dungLuongBanDau = 4) {
        this.duLieu = new Array(dungLuongBanDau);   // Mảng nội bộ lưu trữ dữ liệu
        this.kichThuoc = 0;                          // Số phần tử hiện tại
        this.dungLuong = dungLuongBanDau;            // Dung lượng tối đa hiện tại
        this.soLanThayDoi = 0;                       // Đếm số lần thay đổi kích thước
    }

    // ========================================
    // THUẬT TOÁN 1: THÊM PHẦN TỬ VÀO CUỐI
    // ========================================
    /**
     * Thêm phần tử vào cuối mảng
     * 
     * Thuật toán:
     *   B1: Kiểm tra kichThuoc >= dungLuong?
     *       - Nếu đúng: Gọi _thayDoiKichThuoc(dungLuong * 2) để mở rộng
     *   B2: Gán duLieu[kichThuoc] = phanTu
     *   B3: Tăng kichThuoc lên 1
     * 
     * Độ phức tạp:
     *   - Trường hợp tốt nhất: O(1) - không cần mở rộng
     *   - Trường hợp xấu nhất: O(n) - phải mở rộng (sao chép n phần tử)
     *   - Trung bình (Amortized): O(1)
     * 
     * @param {*} phanTu - Phần tử cần thêm
     * @returns {number} - Kích thước mảng sau khi thêm
     */
    them(phanTu) {
        if (this.kichThuoc >= this.dungLuong) {
            this._thayDoiKichThuoc(this.dungLuong * 2);
        }
        this.duLieu[this.kichThuoc] = phanTu;
        this.kichThuoc++;
        return this.kichThuoc;
    }

    // ========================================
    // THUẬT TOÁN 2: XÓA PHẦN TỬ TẠI VỊ TRÍ
    // ========================================
    /**
     * Xóa phần tử tại vị trí cho trước
     * 
     * Thuật toán:
     *   B1: Kiểm tra vị trí hợp lệ (0 <= viTri < kichThuoc)
     *   B2: Lưu phần tử cần xóa
     *   B3: Dịch chuyển tất cả phần tử từ viTri+1 đến kichThuoc-1 sang trái 1 vị trí
     *       for i = viTri to kichThuoc-2:
     *           duLieu[i] = duLieu[i+1]
     *   B4: Giảm kichThuoc đi 1, xóa phần tử cuối
     *   B5: Kiểm tra thu nhỏ: nếu kichThuoc < dungLuong/4 và dungLuong > 4
     *       → Gọi _thayDoiKichThuoc(dungLuong / 2)
     * 
     * Độ phức tạp: O(n) - phải dịch chuyển các phần tử
     *   - Xóa đầu: dịch n-1 phần tử → O(n)
     *   - Xóa cuối: không dịch → O(1)
     *   - Trung bình: dịch n/2 phần tử → O(n)
     * 
     * @param {number} viTri - Vị trí cần xóa
     * @returns {*} - Phần tử đã bị xóa
     */
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

    // ========================================
    // THUẬT TOÁN 3: TRUY CẬP / CẬP NHẬT (O(1))
    // ========================================
    /**
     * Cập nhật phần tử tại vị trí cho trước
     * Độ phức tạp: O(1) - truy cập trực tiếp qua chỉ số
     * 
     * Đây là ưu điểm lớn nhất của mảng so với danh sách liên kết:
     * truy cập ngẫu nhiên trong O(1) nhờ bộ nhớ liên tục.
     */
    ganGiaTri(viTri, phanTu) {
        if (viTri < 0 || viTri >= this.kichThuoc) {
            throw new Error('Vị trí nằm ngoài phạm vi mảng!');
        }
        this.duLieu[viTri] = phanTu;
    }

    /**
     * Lấy phần tử tại vị trí cho trước
     * Độ phức tạp: O(1)
     */
    layGiaTri(viTri) {
        if (viTri < 0 || viTri >= this.kichThuoc) {
            throw new Error('Vị trí nằm ngoài phạm vi mảng!');
        }
        return this.duLieu[viTri];
    }

    // ========================================
    // THUẬT TOÁN 4: TÌM KIẾM TUYẾN TÍNH
    // ========================================
    /**
     * Tìm vị trí phần tử đầu tiên thỏa mãn điều kiện
     * 
     * Thuật toán: Tìm kiếm tuyến tính (Linear Search)
     *   B1: Duyệt từ i = 0 đến kichThuoc - 1
     *   B2: Nếu dieuKien(duLieu[i]) == true → trả về i
     *   B3: Nếu duyệt hết mà không tìm thấy → trả về -1
     * 
     * Độ phức tạp:
     *   - Tốt nhất: O(1) - tìm thấy ở vị trí đầu
     *   - Xấu nhất: O(n) - phần tử ở cuối hoặc không tồn tại
     *   - Trung bình: O(n/2) = O(n)
     * 
     * Lý do không dùng tìm kiếm nhị phân (Binary Search):
     *   - Dữ liệu sinh viên không được sắp xếp sẵn theo mã SV
     *   - Tìm kiếm nhị phân yêu cầu mảng đã sắp xếp → O(log n)
     *   - Tìm kiếm tuyến tính phù hợp với dữ liệu không có thứ tự
     * 
     * @param {Function} dieuKien - Hàm điều kiện kiểm tra
     * @returns {number} - Vị trí tìm thấy hoặc -1
     */
    timViTri(dieuKien) {
        for (let i = 0; i < this.kichThuoc; i++) {
            if (dieuKien(this.duLieu[i])) {
                return i;
            }
        }
        return -1;
    }

    // ========================================
    // THUẬT TOÁN 5: SẮP XẾP
    // ========================================
    /**
     * Sắp xếp mảng theo hàm so sánh
     * 
     * Sử dụng: TimSort (thuật toán mặc định của JavaScript Engine)
     * - TimSort là thuật toán lai (hybrid) giữa Merge Sort và Insertion Sort
     * - Ổn định (stable sort): giữ nguyên thứ tự các phần tử bằng nhau
     * - Được phát minh bởi Tim Peters (2002), dùng trong Python và Java
     * 
     * Độ phức tạp:
     *   - Tốt nhất: O(n) - mảng đã sắp xếp
     *   - Trung bình: O(n log n)
     *   - Xấu nhất: O(n log n)
     *   - Không gian: O(n)
     * 
     * @param {Function} hamSoSanh - Hàm so sánh (a, b) => số
     *   - Trả về < 0: a đứng trước b
     *   - Trả về = 0: giữ nguyên thứ tự
     *   - Trả về > 0: b đứng trước a
     */
    sapXep(hamSoSanh) {
        const mang = this.chuyenThanhMang();
        mang.sort(hamSoSanh);
        for (let i = 0; i < mang.length; i++) {
            this.duLieu[i] = mang[i];
        }
    }

    // ========================================
    // THUẬT TOÁN 6: LỌC DỮ LIỆU
    // ========================================
    /**
     * Lọc các phần tử thỏa mãn điều kiện
     * 
     * Thuật toán:
     *   B1: Tạo mảng kết quả rỗng
     *   B2: Duyệt từ i = 0 đến kichThuoc - 1
     *   B3: Nếu dieuKien(duLieu[i]) == true → thêm vào kết quả
     *   B4: Trả về mảng kết quả
     * 
     * Độ phức tạp: O(n) - duyệt toàn bộ mảng 1 lần
     * Không gian: O(k) với k là số phần tử thỏa mãn
     * 
     * @param {Function} dieuKien - Hàm điều kiện kiểm tra
     * @returns {Array} - Mảng các phần tử thỏa mãn
     */
    loc(dieuKien) {
        const ketQua = [];
        for (let i = 0; i < this.kichThuoc; i++) {
            if (dieuKien(this.duLieu[i])) {
                ketQua.push(this.duLieu[i]);
            }
        }
        return ketQua;
    }

    // ========================================
    // THUẬT TOÁN 7: THAY ĐỔI KÍCH THƯỚC (RESIZE)
    // ========================================
    /**
     * Thay đổi dung lượng mảng (phương thức nội bộ)
     * 
     * Thuật toán:
     *   B1: Tạo mảng mới có kích thước dungLuongMoi
     *   B2: Sao chép toàn bộ kichThuoc phần tử từ mảng cũ sang mảng mới
     *       for i = 0 to kichThuoc - 1:
     *           mangMoi[i] = duLieu[i]
     *   B3: Gán duLieu = mangMoi, cập nhật dungLuong
     *   B4: Tăng biến đếm soLanThayDoi
     * 
     * Độ phức tạp: O(n) - phải sao chép n phần tử
     * Không gian: O(n) - cấp phát mảng mới
     * 
     * Minh họa quá trình mở rộng khi thêm liên tục:
     *   Thêm 1-4:  dungLuong=4  [x][x][x][x]
     *   Thêm 5:    dungLuong=8  [x][x][x][x][x][ ][ ][ ]         ← mở rộng!
     *   Thêm 9:    dungLuong=16 [x][x][x][x][x][x][x][x][x][ ]... ← mở rộng!
     * 
     * @param {number} dungLuongMoi - Dung lượng mới
     * @private
     */
    _thayDoiKichThuoc(dungLuongMoi) {
        const dungLuongCu = this.dungLuong;
        const mangMoi = new Array(dungLuongMoi);
        for (let i = 0; i < this.kichThuoc; i++) {
            mangMoi[i] = this.duLieu[i];
        }
        this.duLieu = mangMoi;
        this.dungLuong = dungLuongMoi;
        this.soLanThayDoi++;
        console.log(`[MangDong] Thay đổi kích thước lần #${this.soLanThayDoi}: dung lượng ${dungLuongCu} → ${this.dungLuong}`);
    }

    /**
     * Chuyển đổi sang mảng thường (để hiển thị, xuất dữ liệu)
     * Độ phức tạp: O(n)
     */
    chuyenThanhMang() {
        return this.duLieu.slice(0, this.kichThuoc);
    }

    /**
     * Xóa tất cả phần tử, đặt lại về trạng thái ban đầu
     * Độ phức tạp: O(1)
     */
    xoaTatCa() {
        this.duLieu = new Array(4);
        this.kichThuoc = 0;
        this.dungLuong = 4;
    }
}
