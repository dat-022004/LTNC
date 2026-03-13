/**
 * ============================================================
 * MODULE: ĐIỀU KHIỂN GIAO DIỆN ĐỒ HỌA
 * Tệp: UIController.js
 * ============================================================
 * 
 * Chức năng:
 *   - Hiển thị bảng danh sách sinh viên
 *   - Xử lý biểu mẫu thêm/sửa sinh viên
 *   - Cập nhật thống kê, thông tin mảng động
 *   - Quản lý hộp thoại xác nhận, thông báo
 *   - Gắn sự kiện cho các thành phần giao diện
 * 
 * Mô hình: MVC (Model-View-Controller)
 *   - Model:      MangDong + SinhVien (dữ liệu)
 *   - View:       index.html + styles.css (giao diện)
 *   - Controller: DieuKhienGiaoDien (điều khiển logic hiển thị)
 * 
 * Phụ thuộc:
 *   - StudentManager.js (lớp BoQuanLySinhVien - logic nghiệp vụ)
 *   - Student.js (lớp SinhVien - đối tượng sinh viên)
 * 
 * ============================================================
 */

class DieuKhienGiaoDien {
    /**
     * Khởi tạo bộ điều khiển giao diện
     * @param {BoQuanLySinhVien} boQuanLy - Đối tượng quản lý sinh viên
     */
    constructor(boQuanLy) {
        this.boQuanLy = boQuanLy;
        this._viTriChoXoa = -1;

        this._ganSuKien();
        this._taiDuLieu();
        this._capNhatGiaoDien();
    }

    // ========================================
    // TẢI DỮ LIỆU BAN ĐẦU
    // ========================================
    _taiDuLieu() {
        this.boQuanLy._taiTuBoNhoCucBo();
    }

    // ========================================
    // CẬP NHẬT GIAO DIỆN
    // ========================================

    /**
     * Cập nhật toàn bộ giao diện
     * Gọi sau mỗi thao tác thêm/sửa/xóa
     */
    _capNhatGiaoDien() {
        this._capNhatThongKe();
        this._capNhatThongTinMangDong();
        this._capNhatBoLocLop();
        this._capNhatBang();
    }

    /**
     * Cập nhật các thẻ thống kê
     * Hiển thị: Tổng SV, SV đạt, SV chưa đạt, Điểm TB
     */
    _capNhatThongKe() {
        document.getElementById('totalStudents').textContent = this.boQuanLy.danhSachSV.kichThuoc;
        document.getElementById('passedStudents').textContent = this.boQuanLy.demSinhVienDat();
        document.getElementById('failedStudents').textContent = this.boQuanLy.demSinhVienChuaDat();
        document.getElementById('averageGPA').textContent = this.boQuanLy.tinhDiemTrungBinhChung().toFixed(2);
    }

    /**
     * Cập nhật thông tin mảng động (bảng điều khiển)
     * Hiển thị: Kích thước, Dung lượng, Số lần thay đổi
     * → Giúp quan sát hành vi mảng động trực quan
     */
    _capNhatThongTinMangDong() {
        document.getElementById('arraySize').textContent = this.boQuanLy.danhSachSV.kichThuoc;
        document.getElementById('arrayCapacity').textContent = this.boQuanLy.danhSachSV.dungLuong;
        document.getElementById('resizeCount').textContent = this.boQuanLy.danhSachSV.soLanThayDoi;
    }

    /**
     * Cập nhật bộ lọc lớp (danh sách thả xuống)
     * Lấy danh sách lớp duy nhất từ dữ liệu hiện tại
     */
    _capNhatBoLocLop() {
        const oPhanChon = document.getElementById('filterClass');
        const giaTriHienTai = oPhanChon.value;

        const luaChonDauTien = oPhanChon.options[0];
        oPhanChon.innerHTML = '';
        oPhanChon.appendChild(luaChonDauTien);

        this.boQuanLy.layDanhSachLopDuyNhat().forEach(tenLop => {
            const luaChon = document.createElement('option');
            luaChon.value = tenLop;
            luaChon.textContent = tenLop;
            oPhanChon.appendChild(luaChon);
        });

        oPhanChon.value = giaTriHienTai;
    }

    /**
     * Cập nhật bảng danh sách sinh viên
     * 
     * Quy trình xử lý dữ liệu:
     *   Dữ liệu gốc → Lọc theo lớp → Tìm kiếm → Sắp xếp → Phân trang → Hiển thị
     * 
     * Độ phức tạp tổng: O(n log n) (do bước sắp xếp chiếm ưu thế)
     */
    _capNhatBang() {
        const thanBang = document.getElementById('studentTableBody');

        // Bước 1: Lấy toàn bộ dữ liệu - O(n)
        let danhSachDaLoc = this.boQuanLy.danhSachSV.chuyenThanhMang();

        // Bước 2: Lọc theo lớp - O(n)
        if (this.boQuanLy.locTheoLop) {
            danhSachDaLoc = danhSachDaLoc.filter(sv => sv.tenLop === this.boQuanLy.locTheoLop);
        }

        // Bước 3: Tìm kiếm - O(n)
        if (this.boQuanLy.tuKhoaTimKiem) {
            const tuKhoa = this.boQuanLy.tuKhoaTimKiem.toLowerCase();
            danhSachDaLoc = danhSachDaLoc.filter(sv =>
                sv.maSV.toLowerCase().includes(tuKhoa) ||
                sv.hoTen.toLowerCase().includes(tuKhoa) ||
                sv.tenLop.toLowerCase().includes(tuKhoa)
            );
        }

        // Bước 4: Sắp xếp - O(n log n)
        danhSachDaLoc = this.boQuanLy.layDanhSachDaSapXep(danhSachDaLoc);

        // Bước 5: Phân trang - O(k)
        const tongSoTrang = this.boQuanLy.layTongSoTrang(danhSachDaLoc.length);
        if (this.boQuanLy.trangHienTai > tongSoTrang) {
            this.boQuanLy.trangHienTai = tongSoTrang;
        }

        const danhSachTheoTrang = this.boQuanLy.layDuLieuTheoTrang(danhSachDaLoc);

        // Cập nhật phân trang trên giao diện
        document.getElementById('currentPage').textContent = this.boQuanLy.trangHienTai;
        document.getElementById('totalPages').textContent = tongSoTrang;
        document.getElementById('prevPage').disabled = this.boQuanLy.trangHienTai <= 1;
        document.getElementById('nextPage').disabled = this.boQuanLy.trangHienTai >= tongSoTrang;

        // Bước 6: Hiển thị bảng HTML
        if (danhSachTheoTrang.length === 0) {
            thanBang.innerHTML = `
                <tr class="empty-row">
                    <td colspan="9">
                        <div class="empty-state">
                            <i class="fas fa-inbox"></i>
                            <p>Không tìm thấy sinh viên</p>
                            <span>Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</span>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }

        const chiSoBatDau = (this.boQuanLy.trangHienTai - 1) * this.boQuanLy.soDongMoiTrang;

        thanBang.innerHTML = danhSachTheoTrang.map((sv, i) => {
            const xepLoai = sv.layXepLoai();
            const viTriTrongMang = this.boQuanLy.danhSachSV.timViTri(s => s.maSV === sv.maSV);

            return `
                <tr data-index="${viTriTrongMang}">
                    <td>${chiSoBatDau + i + 1}</td>
                    <td><strong>${sv.maSV}</strong></td>
                    <td>${sv.hoTen}</td>
                    <td>${sv.layNgaySinhDinhDang()}</td>
                    <td>${sv.gioiTinh}</td>
                    <td>${sv.tenLop}</td>
                    <td><strong>${sv.diemTB.toFixed(2)}</strong></td>
                    <td><span class="grade-badge ${xepLoai.lop}">${xepLoai.tenXepLoai}</span></td>
                    <td>
                        <div class="action-buttons">
                            <button class="btn-action btn-edit" onclick="ungDung.suaSinhVien(${viTriTrongMang})" title="Sửa">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn-action btn-delete" onclick="ungDung.xacNhanXoa(${viTriTrongMang})" title="Xóa">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }

    // ========================================
    // GẮN SỰ KIỆN CHO GIAO DIỆN
    // ========================================

    _ganSuKien() {
        // ---- Gửi biểu mẫu: Thêm / Cập nhật sinh viên ----
        document.getElementById('studentForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this._xuLyGuiBieuMau();
        });

        // ---- Nút làm mới biểu mẫu ----
        document.getElementById('resetBtn').addEventListener('click', () => {
            this._datLaiBieuMau();
        });

        // ---- Tìm kiếm theo thời gian thực ----
        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.boQuanLy.tuKhoaTimKiem = e.target.value;
            this.boQuanLy.trangHienTai = 1;
            this._capNhatBang();
        });

        // ---- Lọc theo lớp ----
        document.getElementById('filterClass').addEventListener('change', (e) => {
            this.boQuanLy.locTheoLop = e.target.value;
            this.boQuanLy.trangHienTai = 1;
            this._capNhatBang();
        });

        // ---- Sắp xếp theo trường ----
        document.getElementById('sortBy').addEventListener('change', (e) => {
            this.boQuanLy.truongSapXep = e.target.value;
            this._capNhatBang();
        });

        // ---- Đổi chiều sắp xếp ----
        document.getElementById('sortOrder').addEventListener('click', (e) => {
            this.boQuanLy.sapXepTangDan = !this.boQuanLy.sapXepTangDan;
            const bieuTuong = e.currentTarget.querySelector('i');
            bieuTuong.className = this.boQuanLy.sapXepTangDan ? 'fas fa-sort-amount-down' : 'fas fa-sort-amount-up';
            e.currentTarget.classList.toggle('asc', !this.boQuanLy.sapXepTangDan);
            this._capNhatBang();
        });

        // ---- Phân trang ----
        document.getElementById('prevPage').addEventListener('click', () => {
            if (this.boQuanLy.trangHienTai > 1) {
                this.boQuanLy.trangHienTai--;
                this._capNhatBang();
            }
        });

        document.getElementById('nextPage').addEventListener('click', () => {
            this.boQuanLy.trangHienTai++;
            this._capNhatBang();
        });

        document.getElementById('itemsPerPage').addEventListener('change', (e) => {
            this.boQuanLy.soDongMoiTrang = parseInt(e.target.value);
            this.boQuanLy.trangHienTai = 1;
            this._capNhatBang();
        });

        // ---- Tải dữ liệu mẫu ----
        document.getElementById('loadSampleBtn').addEventListener('click', () => {
            const soLuong = this.boQuanLy.taiDuLieuMau();
            this._capNhatGiaoDien();
            this._hienThongBao(`Đã tải ${soLuong} sinh viên mẫu!`, 'success');
        });

        // ---- Xuất Excel ----
        document.getElementById('exportExcelBtn').addEventListener('click', () => {
            const tenTep = this.boQuanLy.xuatExcel();
            if (tenTep) {
                this._hienThongBao(`Đã xuất tệp ${tenTep}!`, 'success');
            } else {
                this._hienThongBao('Không có dữ liệu để xuất!', 'warning');
            }
        });

        // ---- Hộp thoại ----
        document.getElementById('closeModal').addEventListener('click', () => {
            this._anHopThoai();
        });

        document.getElementById('cancelModal').addEventListener('click', () => {
            this._anHopThoai();
        });
    }

    // ========================================
    // XỬ LÝ BIỂU MẪU
    // ========================================

    /**
     * Xử lý khi gửi biểu mẫu (thêm mới hoặc cập nhật)
     * Bao gồm kiểm tra dữ liệu đầu vào
     */
    _xuLyGuiBieuMau() {
        const maSV = document.getElementById('studentId').value.trim();
        const hoTen = document.getElementById('studentName').value.trim();
        const ngaySinh = document.getElementById('studentDob').value;
        const gioiTinh = document.getElementById('studentGender').value;
        const tenLop = document.getElementById('studentClass').value.trim();
        const diemTB = parseFloat(document.getElementById('studentGPA').value);

        // Kiểm tra dữ liệu
        if (!maSV || !hoTen || !ngaySinh || !gioiTinh || !tenLop || isNaN(diemTB)) {
            this._hienThongBao('Vui lòng điền đầy đủ thông tin!', 'error');
            return;
        }

        if (diemTB < 0 || diemTB > 10) {
            this._hienThongBao('Điểm trung bình phải từ 0 đến 10!', 'error');
            return;
        }

        const sinhVien = new SinhVien(maSV, hoTen, ngaySinh, gioiTinh, tenLop, diemTB);

        try {
            if (this.boQuanLy.viTriDangSua >= 0) {
                this.boQuanLy.capNhatSinhVien(this.boQuanLy.viTriDangSua, sinhVien);
                this._hienThongBao('Cập nhật sinh viên thành công!', 'success');
            } else {
                this.boQuanLy.themSinhVien(sinhVien);
                this._hienThongBao('Thêm sinh viên thành công!', 'success');
            }
            this._capNhatGiaoDien();
            this._datLaiBieuMau();
        } catch (loi) {
            this._hienThongBao(loi.message, 'error');
        }
    }

    /**
     * Điền dữ liệu sinh viên vào biểu mẫu để chỉnh sửa
     * @param {number} viTri - Vị trí trong mảng động
     */
    suaSinhVien(viTri) {
        const sv = this.boQuanLy.danhSachSV.layGiaTri(viTri);

        document.getElementById('studentId').value = sv.maSV;
        document.getElementById('studentName').value = sv.hoTen;
        document.getElementById('studentDob').value = sv.ngaySinh;
        document.getElementById('studentGender').value = sv.gioiTinh;
        document.getElementById('studentClass').value = sv.tenLop;
        document.getElementById('studentGPA').value = sv.diemTB;

        this.boQuanLy.viTriDangSua = viTri;

        const nutGui = document.getElementById('submitBtn');
        nutGui.innerHTML = '<i class="fas fa-save"></i> Cập nhật';
        nutGui.classList.remove('btn-primary');
        nutGui.classList.add('btn-warning');

        document.querySelector('.form-panel').scrollIntoView({ behavior: 'smooth' });
    }

    /**
     * Hiển thị hộp thoại xác nhận xóa
     * @param {number} viTri - Vị trí trong mảng động
     */
    xacNhanXoa(viTri) {
        const sv = this.boQuanLy.danhSachSV.layGiaTri(viTri);
        this._viTriChoXoa = viTri;

        document.getElementById('modalTitle').textContent = 'Xác nhận xóa';
        document.getElementById('modalBody').innerHTML = `
            <p>Bạn có chắc chắn muốn xóa sinh viên:</p>
            <p><strong>${sv.maSV} - ${sv.hoTen}</strong>?</p>
            <p style="color: #d32f2f; margin-top: 10px;">
                <i class="fas fa-exclamation-triangle"></i> Hành động này không thể hoàn tác!
            </p>
        `;

        document.getElementById('confirmModalBtn').onclick = () => {
            this.boQuanLy.xoaSinhVien(this._viTriChoXoa);
            this._anHopThoai();
            this._capNhatGiaoDien();
            this._hienThongBao('Đã xóa sinh viên!', 'success');
        };

        this._hienHopThoai();
    }

    /**
     * Đặt lại biểu mẫu về trạng thái thêm mới
     */
    _datLaiBieuMau() {
        document.getElementById('studentForm').reset();
        this.boQuanLy.viTriDangSua = -1;

        const nutGui = document.getElementById('submitBtn');
        nutGui.innerHTML = '<i class="fas fa-plus"></i> Thêm sinh viên';
        nutGui.classList.remove('btn-warning');
        nutGui.classList.add('btn-primary');
    }

    // ========================================
    // HỘP THOẠI & THÔNG BÁO
    // ========================================

    _hienHopThoai() {
        document.getElementById('confirmModal').classList.add('active');
    }

    _anHopThoai() {
        document.getElementById('confirmModal').classList.remove('active');
    }

    /**
     * Hiển thị thông báo dạng nổi (toast)
     * @param {string} noiDung - Nội dung thông báo
     * @param {string} loai - Loại: success, error, warning, info
     */
    _hienThongBao(noiDung, loai = 'info') {
        const khungChua = document.getElementById('toastContainer');
        const thongBao = document.createElement('div');
        thongBao.className = `toast ${loai}`;

        let bieuTuong;
        switch (loai) {
            case 'success': bieuTuong = 'check-circle'; break;
            case 'error':   bieuTuong = 'times-circle'; break;
            case 'warning': bieuTuong = 'exclamation-triangle'; break;
            default:        bieuTuong = 'info-circle';
        }

        thongBao.innerHTML = `<i class="fas fa-${bieuTuong}"></i><span>${noiDung}</span>`;
        khungChua.appendChild(thongBao);

        // Tự động ẩn sau 3 giây
        setTimeout(() => {
            thongBao.style.opacity = '0';
            thongBao.style.transform = 'translateX(100px)';
            setTimeout(() => thongBao.remove(), 300);
        }, 3000);
    }
}
