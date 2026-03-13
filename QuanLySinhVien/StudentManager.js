/**
 * ============================================================
 * MODULE: QUẢN LÝ SINH VIÊN
 * Tệp: StudentManager.js
 * ============================================================
 * 
 * Chức năng chính (CRUD):
 *   - Thêm:    Thêm sinh viên mới vào mảng động
 *   - Đọc:     Đọc, tìm kiếm, lọc, sắp xếp danh sách
 *   - Sửa:     Cập nhật thông tin sinh viên
 *   - Xóa:     Xóa sinh viên khỏi mảng động
 * 
 * Các thuật toán áp dụng:
 *   - Tìm kiếm tuyến tính: O(n) - tìm theo mã, tên, lớp
 *   - Sắp xếp (TimSort):   O(n log n) - sắp xếp theo các trường
 *   - Lọc dữ liệu:         O(n) - lọc theo lớp, điều kiện
 *   - Thống kê:             O(n) - tính điểm TB, đếm đạt/trượt
 * 
 * Phụ thuộc:
 *   - DynamicArray.js (cấu trúc dữ liệu mảng động - lớp MangDong)
 *   - Student.js (đối tượng sinh viên - lớp SinhVien)
 *   - data.js (dữ liệu mẫu - DU_LIEU_MAU)
 * 
 * ============================================================
 */

class BoQuanLySinhVien {
    constructor() {
        // Khởi tạo mảng động với dung lượng ban đầu = 4
        this.danhSachSV = new MangDong(4);

        // Cấu hình phân trang
        this.trangHienTai = 1;
        this.soDongMoiTrang = 10;

        // Cấu hình sắp xếp
        this.truongSapXep = 'maSV';
        this.sapXepTangDan = true;

        // Bộ lọc
        this.locTheoLop = '';
        this.tuKhoaTimKiem = '';

        // Chế độ chỉnh sửa (-1 = đang thêm mới)
        this.viTriDangSua = -1;
    }

    // ========================================
    // THAO TÁC THÊM SINH VIÊN - O(n) trường hợp xấu
    // ========================================
    /**
     * Thêm sinh viên mới vào mảng động
     * 
     * Thuật toán:
     *   B1: Tìm kiếm tuyến tính kiểm tra trùng mã SV → O(n)
     *   B2: Nếu trùng → báo lỗi
     *   B3: Gọi MangDong.them() → O(1) chi phí khấu hao
     *   B4: Lưu vào bộ nhớ cục bộ
     * 
     * Độ phức tạp tổng: O(n) (do bước kiểm tra trùng)
     */
    themSinhVien(sinhVien) {
        const viTriTrung = this.danhSachSV.timViTri(sv => sv.maSV === sinhVien.maSV);
        if (viTriTrung !== -1) {
            throw new Error('Mã sinh viên đã tồn tại!');
        }

        this.danhSachSV.them(sinhVien);
        this._luuVaoBoNhoCucBo();
        return true;
    }

    // ========================================
    // THAO TÁC CẬP NHẬT SINH VIÊN - O(n)
    // ========================================
    /**
     * Cập nhật thông tin sinh viên tại vị trí cho trước
     * 
     * Thuật toán:
     *   B1: Kiểm tra trùng mã SV (ngoại trừ SV đang sửa) → O(n)
     *   B2: Gọi MangDong.ganGiaTri(viTri, sinhVien) → O(1)
     *   B3: Lưu vào bộ nhớ cục bộ
     * 
     * Độ phức tạp tổng: O(n) (do bước kiểm tra trùng)
     */
    capNhatSinhVien(viTri, sinhVien) {
        const viTriTrung = this.danhSachSV.timViTri(sv => sv.maSV === sinhVien.maSV);
        if (viTriTrung !== -1 && viTriTrung !== viTri) {
            throw new Error('Mã sinh viên đã tồn tại!');
        }

        this.danhSachSV.ganGiaTri(viTri, sinhVien);
        this._luuVaoBoNhoCucBo();
        return true;
    }

    // ========================================
    // THAO TÁC XÓA SINH VIÊN - O(n)
    // ========================================
    /**
     * Xóa sinh viên tại vị trí cho trước
     * 
     * Thuật toán:
     *   B1: Gọi MangDong.xoaTaiViTri(viTri) → O(n) dịch chuyển
     *   B2: Tự động thu nhỏ nếu kichThuoc < dungLuong/4
     *   B3: Lưu vào bộ nhớ cục bộ
     * 
     * Độ phức tạp: O(n) - do dịch chuyển phần tử
     */
    xoaSinhVien(viTri) {
        this.danhSachSV.xoaTaiViTri(viTri);
        this._luuVaoBoNhoCucBo();
        return true;
    }

    // ========================================
    // TÌM KIẾM SINH VIÊN - O(n)
    // ========================================
    /**
     * Tìm kiếm sinh viên theo từ khóa
     * 
     * Thuật toán: Tìm kiếm tuyến tính trên nhiều trường
     *   B1: Chuyển từ khóa về chữ thường
     *   B2: Duyệt toàn bộ mảng, kiểm tra:
     *       - Mã SV chứa từ khóa?
     *       - Họ tên chứa từ khóa?
     *       - Tên lớp chứa từ khóa?
     *   B3: Trả về danh sách kết quả
     * 
     * Độ phức tạp: O(n * m) với m là độ dài trung bình chuỗi
     *   - Thực tế m rất nhỏ nên xấp xỉ O(n)
     */
    timKiemSinhVien(tuKhoa) {
        tuKhoa = tuKhoa.toLowerCase().trim();
        if (!tuKhoa) return this.danhSachSV.chuyenThanhMang();

        return this.danhSachSV.loc(sv =>
            sv.maSV.toLowerCase().includes(tuKhoa) ||
            sv.hoTen.toLowerCase().includes(tuKhoa) ||
            sv.tenLop.toLowerCase().includes(tuKhoa)
        );
    }

    // ========================================
    // LỌC THEO LỚP - O(n)
    // ========================================
    /**
     * Lọc sinh viên theo tên lớp
     * 
     * Thuật toán:
     *   B1: Nếu không có tên lớp → trả về toàn bộ
     *   B2: Duyệt mảng, giữ lại phần tử có tenLop trùng khớp
     * 
     * Độ phức tạp: O(n)
     */
    locTheoLopHoc(tenLop) {
        if (!tenLop) return this.danhSachSV.chuyenThanhMang();
        return this.danhSachSV.loc(sv => sv.tenLop === tenLop);
    }

    // ========================================
    // SẮP XẾP DANH SÁCH - O(n log n)
    // ========================================
    /**
     * Sắp xếp danh sách sinh viên theo trường được chọn
     * 
     * Thuật toán: TimSort qua Array.prototype.sort()
     *   - Hỗ trợ sắp xếp theo: Mã SV, Tên, Điểm TB, Lớp
     *   - Hỗ trợ: tăng dần / giảm dần
     * 
     * So sánh chuỗi: sử dụng localeCompare('vi') cho tiếng Việt
     *   - Đảm bảo sắp xếp đúng thứ tự: Ă, Â, Đ, Ê, Ô, Ơ, Ư
     * 
     * Độ phức tạp: O(n log n)
     * 
     * @param {Array} danhSach - Mảng sinh viên cần sắp xếp
     * @returns {Array} - Mảng đã sắp xếp (bản sao)
     */
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
                case 'ngaySinh':
                    ketQua = new Date(a.ngaySinh) - new Date(b.ngaySinh);
                    break;
                case 'gioiTinh':
                    ketQua = a.gioiTinh.localeCompare(b.gioiTinh, 'vi');
                    break;
                case 'xepLoai':
                    // Sắp xếp theo thứ tự: Xuất sắc > Giỏi > Khá > TB > Yếu > Kém
                    ketQua = b.diemTB - a.diemTB;
                    break;
            }
            return this.sapXepTangDan ? ketQua : -ketQua;
        });
        return daSapXep;
    }

    // ========================================
    // THỐNG KÊ - O(n)
    // ========================================
    /**
     * Tính điểm trung bình của toàn bộ sinh viên
     * 
     * Thuật toán:
     *   B1: Duyệt mảng, tính tổng điểm TB → O(n)
     *   B2: Chia tổng cho số lượng sinh viên
     * 
     * Độ phức tạp: O(n)
     */
    tinhDiemTrungBinhChung() {
        if (this.danhSachSV.kichThuoc === 0) return 0;
        let tong = 0;
        for (let i = 0; i < this.danhSachSV.kichThuoc; i++) {
            tong += this.danhSachSV.layGiaTri(i).diemTB;
        }
        return tong / this.danhSachSV.kichThuoc;
    }

    /**
     * Đếm số sinh viên đạt (điểm TB >= 5.0)
     * Độ phức tạp: O(n)
     */
    demSinhVienDat() {
        return this.danhSachSV.loc(sv => sv.diemTB >= 5.0).length;
    }

    /**
     * Đếm số sinh viên chưa đạt (điểm TB < 5.0)
     * Độ phức tạp: O(n)
     */
    demSinhVienChuaDat() {
        return this.danhSachSV.loc(sv => sv.diemTB < 5.0).length;
    }

    /**
     * Lấy danh sách lớp không trùng lặp
     * 
     * Sử dụng Set để loại bỏ trùng lặp → O(n) trung bình
     * (Set dùng bảng băm nội bộ → tra cứu O(1) chi phí khấu hao)
     * 
     * Độ phức tạp: O(n log n) (bao gồm sắp xếp danh sách lớp)
     */
    layDanhSachLopDuyNhat() {
        const danhSachLop = new Set();
        for (let i = 0; i < this.danhSachSV.kichThuoc; i++) {
            danhSachLop.add(this.danhSachSV.layGiaTri(i).tenLop);
        }
        return Array.from(danhSachLop).sort();
    }

    // ========================================
    // PHÂN TRANG
    // ========================================
    /**
     * Lấy dữ liệu cho trang hiện tại
     * 
     * Thuật toán:
     *   batDau = (trangHienTai - 1) * soDongMoiTrang
     *   ketThuc = batDau + soDongMoiTrang
     *   return danhSach[batDau..ketThuc]
     * 
     * Độ phức tạp: O(k) với k = soDongMoiTrang
     */
    layDuLieuTheoTrang(danhSach) {
        const batDau = (this.trangHienTai - 1) * this.soDongMoiTrang;
        const ketThuc = batDau + this.soDongMoiTrang;
        return danhSach.slice(batDau, ketThuc);
    }

    layTongSoTrang(tongSoPhanTu) {
        return Math.ceil(tongSoPhanTu / this.soDongMoiTrang) || 1;
    }

    // ========================================
    // LƯU TRỮ CỤC BỘ (LOCAL STORAGE)
    // ========================================
    /**
     * Lưu dữ liệu vào bộ nhớ cục bộ (JSON serialization)
     * Độ phức tạp: O(n) - chuyển đổi n phần tử
     */
    _luuVaoBoNhoCucBo() {
        const duLieu = this.danhSachSV.chuyenThanhMang().map(sv => sv.chuyenSangJSON());
        localStorage.setItem('danhSachSinhVien', JSON.stringify(duLieu));
    }

    /**
     * Tải dữ liệu từ bộ nhớ cục bộ (JSON deserialization)
     * Độ phức tạp: O(n) - phân tích và thêm n phần tử
     */
    _taiTuBoNhoCucBo() {
        const duLieu = localStorage.getItem('danhSachSinhVien');
        if (duLieu) {
            const danhSach = JSON.parse(duLieu);
            danhSach.forEach(sv => {
                this.danhSachSV.them(SinhVien.taoTuJSON(sv));
            });
        }
    }

    // ========================================
    // TẢI DỮ LIỆU MẪU
    // ========================================
    /**
     * Tải dữ liệu mẫu từ tệp data.js
     * Độ phức tạp: O(m) với m = số sinh viên mẫu
     */
    taiDuLieuMau() {
        const duLieuMau = DU_LIEU_MAU;
        this.danhSachSV.xoaTatCa();

        duLieuMau.forEach(dl => {
            const sv = new SinhVien(dl.maSV, dl.hoTen, dl.ngaySinh, dl.gioiTinh, dl.tenLop, dl.diemTB);
            this.danhSachSV.them(sv);
        });

        this._luuVaoBoNhoCucBo();
        return duLieuMau.length;
    }

    // ========================================
    // XUẤT EXCEL
    // ========================================
    /**
     * Xuất danh sách sinh viên ra tệp Excel (.xlsx)
     * Sử dụng thư viện SheetJS (XLSX)
     * Độ phức tạp: O(n)
     */
    xuatExcel() {
        if (this.danhSachSV.kichThuoc === 0) {
            return false;
        }

        const duLieu = this.danhSachSV.chuyenThanhMang().map((sv, chiSo) => ({
            'STT': chiSo + 1,
            'Mã SV': sv.maSV,
            'Họ và tên': sv.hoTen,
            'Ngày sinh': sv.layNgaySinhDinhDang(),
            'Giới tính': sv.gioiTinh,
            'Lớp': sv.tenLop,
            'Điểm TB': sv.diemTB.toFixed(2),
            'Xếp loại': sv.layXepLoai().tenXepLoai
        }));

        const bangTinh = XLSX.utils.json_to_sheet(duLieu);
        const tapTin = XLSX.utils.book_new();

        bangTinh['!cols'] = [
            { wch: 5 }, { wch: 10 }, { wch: 25 }, { wch: 12 },
            { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 12 }
        ];

        XLSX.utils.book_append_sheet(tapTin, bangTinh, 'Danh sách sinh viên');

        const hienTai = new Date();
        const thoiGian = `${hienTai.getFullYear()}${(hienTai.getMonth()+1).toString().padStart(2,'0')}${hienTai.getDate().toString().padStart(2,'0')}_${hienTai.getHours().toString().padStart(2,'0')}${hienTai.getMinutes().toString().padStart(2,'0')}`;
        const tenTep = `DanhSachSinhVien_${thoiGian}.xlsx`;

        XLSX.writeFile(tapTin, tenTep);
        return tenTep;
    }
}
