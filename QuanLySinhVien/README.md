# BÁO CÁO ĐỀ TÀI: PHẦN MỀM QUẢN LÝ SINH VIÊN
## Sử dụng Cấu trúc Mảng Động và Giao diện Đồ họa

---

## MỤC LỤC

1. [Giới thiệu](#1-giới-thiệu)
2. [Cơ sở lý thuyết](#2-cơ-sở-lý-thuyết)
3. [Phân tích bài toán](#3-phân-tích-bài-toán)
4. [Thuật toán và Độ phức tạp](#4-thuật-toán-và-độ-phức-tạp)
5. [Thiết kế hệ thống](#5-thiết-kế-hệ-thống)
6. [Hướng dẫn sử dụng](#6-hướng-dẫn-sử-dụng)
7. [Kết luận](#7-kết-luận)

---

## 1. GIỚI THIỆU

### 1.1. Mục đích
Xây dựng phần mềm quản lý sinh viên hoàn chỉnh với các chức năng CRUD (Create, Read, Update, Delete), sử dụng cấu trúc dữ liệu **Mảng động (Dynamic Array)** và giao diện đồ họa web thân thiện.

### 1.2. Công nghệ sử dụng
- **HTML5**: Cấu trúc giao diện
- **CSS3**: Thiết kế responsive, hiệu ứng
- **JavaScript (ES6+)**: Logic xử lý, cài đặt mảng động
- **LocalStorage**: Lưu trữ dữ liệu cục bộ

### 1.3. Tính năng chính
- ✅ Thêm, sửa, xóa sinh viên
- ✅ Tìm kiếm theo mã SV, tên, lớp
- ✅ Lọc theo lớp
- ✅ Sắp xếp theo nhiều tiêu chí
- ✅ Phân trang
- ✅ Thống kê số liệu
- ✅ Hiển thị thông tin mảng động (size, capacity, resize count)

---

## 2. CƠ SỞ LÝ THUYẾT

### 2.1. Mảng Động (Dynamic Array)

#### 2.1.1. Định nghĩa
**Mảng động** là cấu trúc dữ liệu mảng có khả năng tự động thay đổi kích thước khi cần thiết, khác với mảng tĩnh có kích thước cố định.

#### 2.1.2. Nguyên lý hoạt động

```
+---+---+---+---+
| 1 | 2 | 3 |   |   <- Mảng ban đầu (size=3, capacity=4)
+---+---+---+---+

Thêm phần tử 4:
+---+---+---+---+
| 1 | 2 | 3 | 4 |   <- Đầy (size=4, capacity=4)
+---+---+---+---+

Thêm phần tử 5 (Resize x2):
+---+---+---+---+---+---+---+---+
| 1 | 2 | 3 | 4 | 5 |   |   |   |   <- Sau resize (size=5, capacity=8)
+---+---+---+---+---+---+---+---+
```

#### 2.1.3. Chiến lược Resize

| Thao tác | Điều kiện | Hành động |
|----------|-----------|-----------|
| **Mở rộng (Grow)** | size ≥ capacity | capacity = capacity × 2 |
| **Thu nhỏ (Shrink)** | size < capacity/4 | capacity = capacity / 2 |

**Tại sao nhân đôi?**
- Amortized Analysis cho thấy chi phí trung bình mỗi thao tác push là O(1)
- Nếu tăng thêm 1 mỗi lần: O(n) cho mỗi thao tác push → Tổng O(n²)
- Nếu nhân đôi: Tổng chi phí cho n thao tác là O(n) → Trung bình O(1)

### 2.2. So sánh với các cấu trúc dữ liệu khác

| Tiêu chí | Mảng động | Mảng tĩnh | Danh sách liên kết |
|----------|-----------|-----------|-------------------|
| Truy cập ngẫu nhiên | O(1) | O(1) | O(n) |
| Thêm cuối | O(1)* | O(1) | O(1) |
| Xóa cuối | O(1) | O(1) | O(n) |
| Thêm/Xóa giữa | O(n) | O(n) | O(1) |
| Bộ nhớ | Liên tục | Liên tục | Phân tán |

*O(1) amortized, O(n) worst-case khi resize

---

## 3. PHÂN TÍCH BÀI TOÁN

### 3.1. Đối tượng quản lý: Sinh viên

```javascript
class Student {
    id: string        // Mã sinh viên (unique)
    name: string      // Họ và tên
    dob: Date         // Ngày sinh
    gender: string    // Giới tính
    className: string // Lớp
    gpa: number       // Điểm trung bình (0-10)
}
```

### 3.2. Các chức năng yêu cầu

| STT | Chức năng | Mô tả |
|-----|-----------|-------|
| 1 | Thêm sinh viên | Thêm mới với validation |
| 2 | Sửa sinh viên | Cập nhật thông tin |
| 3 | Xóa sinh viên | Xóa với xác nhận |
| 4 | Hiển thị danh sách | Bảng với phân trang |
| 5 | Tìm kiếm | Theo mã, tên, lớp |
| 6 | Sắp xếp | Theo nhiều tiêu chí |
| 7 | Lọc | Theo lớp |
| 8 | Thống kê | Tổng, đạt/không đạt, điểm TB |

### 3.3. Biểu đồ Use Case

```
                    +------------------+
                    |    Người dùng    |
                    +--------+---------+
                             |
         +-------------------+-------------------+
         |         |         |         |         |
    +----v---+ +---v----+ +--v---+ +--v----+ +--v-----+
    | Thêm   | | Sửa    | | Xóa  | | Tìm   | | Thống  |
    | SV     | | SV     | | SV   | | kiếm  | | kê     |
    +--------+ +--------+ +------+ +-------+ +--------+
```

---

## 4. THUẬT TOÁN VÀ ĐỘ PHỨC TẠP

### 4.1. Cài đặt Mảng Động

```javascript
class DynamicArray {
    data: Array      // Mảng lưu trữ
    size: number     // Số phần tử hiện tại
    capacity: number // Dung lượng tối đa
}
```

### 4.2. Các thao tác chính

#### 4.2.1. Thêm phần tử (Push)

```
Algorithm PUSH(element):
    IF size >= capacity THEN
        RESIZE(capacity * 2)    // O(n)
    END IF
    data[size] = element
    size = size + 1
    RETURN size
```

**Độ phức tạp:**
- **Best case**: O(1) - không cần resize
- **Worst case**: O(n) - phải resize
- **Amortized**: O(1) - trung bình qua nhiều thao tác

#### 4.2.2. Xóa phần tử (RemoveAt)

```
Algorithm REMOVE_AT(index):
    IF index < 0 OR index >= size THEN
        THROW "Index out of bounds"
    END IF
    
    removed = data[index]
    
    // Dịch chuyển phần tử - O(n)
    FOR i = index TO size - 2 DO
        data[i] = data[i + 1]
    END FOR
    
    size = size - 1
    
    // Thu nhỏ nếu cần
    IF size < capacity/4 AND capacity > 4 THEN
        RESIZE(capacity / 2)    // O(n)
    END IF
    
    RETURN removed
```

**Độ phức tạp:** O(n) - phải dịch chuyển phần tử

#### 4.2.3. Tìm kiếm (Find)

```
Algorithm FIND_INDEX(predicate):
    FOR i = 0 TO size - 1 DO
        IF predicate(data[i]) = TRUE THEN
            RETURN i
        END IF
    END FOR
    RETURN -1
```

**Độ phức tạp:** O(n) - tìm kiếm tuyến tính

#### 4.2.4. Resize

```
Algorithm RESIZE(newCapacity):
    newData = new Array(newCapacity)
    
    FOR i = 0 TO size - 1 DO
        newData[i] = data[i]    // Copy O(n)
    END FOR
    
    data = newData
    capacity = newCapacity
    resizeCount = resizeCount + 1
```

**Độ phức tạp:** O(n) - phải copy toàn bộ phần tử

### 4.3. Thuật toán sắp xếp

Sử dụng **QuickSort** (built-in Array.sort của JavaScript)

```
Algorithm QUICK_SORT(arr, comparator):
    IF length(arr) <= 1 THEN
        RETURN arr
    END IF
    
    pivot = arr[middle]
    left = elements < pivot
    right = elements > pivot
    
    RETURN QUICK_SORT(left) + [pivot] + QUICK_SORT(right)
```

**Độ phức tạp:**
- **Average**: O(n log n)
- **Worst**: O(n²) - khi mảng đã sắp xếp
- **Space**: O(log n) - recursive stack

### 4.4. Bảng tổng hợp độ phức tạp

| Thao tác | Best Case | Average Case | Worst Case | Space |
|----------|-----------|--------------|------------|-------|
| **Push** | O(1) | O(1)* | O(n) | O(n) |
| **Pop** | O(1) | O(1) | O(1) | O(1) |
| **RemoveAt(i)** | O(1) | O(n) | O(n) | O(1) |
| **Get(i)** | O(1) | O(1) | O(1) | O(1) |
| **Set(i)** | O(1) | O(1) | O(1) | O(1) |
| **Find** | O(1) | O(n) | O(n) | O(1) |
| **Sort** | O(n log n) | O(n log n) | O(n²) | O(log n) |
| **Filter** | O(n) | O(n) | O(n) | O(n) |

*Amortized complexity

---

## 5. THIẾT KẾ HỆ THỐNG

### 5.1. Kiến trúc

```
┌─────────────────────────────────────────────────────┐
│                    VIEW (HTML/CSS)                   │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │
│  │   Header    │  │    Form     │  │    Table    │  │
│  └─────────────┘  └─────────────┘  └─────────────┘  │
└─────────────────────────┬───────────────────────────┘
                          │
┌─────────────────────────┴───────────────────────────┐
│                 CONTROLLER (JavaScript)              │
│  ┌─────────────────────────────────────────────┐    │
│  │              StudentManager                  │    │
│  │  - Event Handlers                           │    │
│  │  - Validation                               │    │
│  │  - UI Updates                               │    │
│  └─────────────────────────────────────────────┘    │
└─────────────────────────┬───────────────────────────┘
                          │
┌─────────────────────────┴───────────────────────────┐
│                   MODEL (JavaScript)                 │
│  ┌──────────────┐      ┌──────────────┐             │
│  │ DynamicArray │      │   Student    │             │
│  │  - push()    │◄─────│  - id        │             │
│  │  - removeAt()│      │  - name      │             │
│  │  - get()     │      │  - gpa       │             │
│  │  - find()    │      │  - ...       │             │
│  └──────────────┘      └──────────────┘             │
└─────────────────────────┬───────────────────────────┘
                          │
┌─────────────────────────┴───────────────────────────┐
│                 STORAGE (LocalStorage)               │
│              ┌─────────────────────┐                 │
│              │   JSON Data Store   │                 │
│              └─────────────────────┘                 │
└─────────────────────────────────────────────────────┘
```

### 5.2. Class Diagram

```
┌─────────────────────────────────────────┐
│              DynamicArray               │
├─────────────────────────────────────────┤
│ - data: Array                           │
│ - size: number                          │
│ - capacity: number                      │
│ - resizeCount: number                   │
├─────────────────────────────────────────┤
│ + push(element): number                 │
│ + removeAt(index): any                  │
│ + get(index): any                       │
│ + set(index, element): void             │
│ + findIndex(predicate): number          │
│ + filter(predicate): Array              │
│ + sort(comparator): void                │
│ + toArray(): Array                      │
│ + clear(): void                         │
│ - _resize(newCapacity): void            │
└─────────────────────────────────────────┘
                    ▲
                    │ contains
                    │
┌─────────────────────────────────────────┐
│             StudentManager              │
├─────────────────────────────────────────┤
│ - students: DynamicArray<Student>       │
│ - currentPage: number                   │
│ - itemsPerPage: number                  │
│ - sortField: string                     │
│ - sortAscending: boolean                │
│ - filterClass: string                   │
│ - searchQuery: string                   │
├─────────────────────────────────────────┤
│ + addStudent(student): boolean          │
│ + updateStudent(index, student): boolean│
│ + deleteStudent(index): boolean         │
│ + searchStudents(query): Student[]      │
│ + filterByClass(className): Student[]   │
│ + getSortedStudents(): Student[]        │
│ + getAverageGPA(): number               │
│ + countPassed(): number                 │
│ + countFailed(): number                 │
└─────────────────────────────────────────┘
                    │
                    │ manages
                    ▼
┌─────────────────────────────────────────┐
│               Student                   │
├─────────────────────────────────────────┤
│ + id: string                            │
│ + name: string                          │
│ + dob: string                           │
│ + gender: string                        │
│ + className: string                     │
│ + gpa: number                           │
├─────────────────────────────────────────┤
│ + getGrade(): {text, class}             │
│ + getFormattedDob(): string             │
└─────────────────────────────────────────┘
```

### 5.3. Cấu trúc thư mục

```
QuanLySinhVien/
├── index.html          # Giao diện chính
├── styles.css          # Styling
├── app.js              # Logic xử lý
└── README.md           # Tài liệu
```

---

## 6. HƯỚNG DẪN SỬ DỤNG

### 6.1. Cài đặt và Chạy

1. **Tải mã nguồn** về máy
2. **Mở file `index.html`** bằng trình duyệt web (Chrome, Firefox, Edge...)
3. **Hoặc** sử dụng Live Server trong VS Code

### 6.2. Các chức năng

#### 6.2.1. Thêm sinh viên mới
1. Điền đầy đủ thông tin vào form bên trái
2. Nhấn nút **"Thêm sinh viên"**
3. Sinh viên mới sẽ xuất hiện trong bảng

#### 6.2.2. Sửa thông tin
1. Nhấn nút **✏️ (Edit)** ở cột Thao tác
2. Thông tin được load vào form
3. Chỉnh sửa và nhấn **"Cập nhật"**

#### 6.2.3. Xóa sinh viên
1. Nhấn nút **🗑️ (Delete)** ở cột Thao tác
2. Xác nhận trong hộp thoại popup
3. Sinh viên bị xóa khỏi danh sách

#### 6.2.4. Tìm kiếm
- Nhập từ khóa vào ô **"Tìm kiếm sinh viên..."**
- Kết quả tự động lọc theo mã SV, tên, lớp

#### 6.2.5. Sắp xếp
- Chọn tiêu chí từ dropdown **"Sắp xếp theo"**
- Nhấn nút ⬆️⬇️ để đổi chiều sắp xếp

#### 6.2.6. Tải dữ liệu mẫu
- Nhấn nút **"Tải dữ liệu mẫu"** để thêm 15 sinh viên demo

### 6.3. Xếp loại học lực

| Điểm TB | Xếp loại |
|---------|----------|
| 9.0 - 10.0 | Xuất sắc |
| 8.0 - 8.99 | Giỏi |
| 6.5 - 7.99 | Khá |
| 5.0 - 6.49 | Trung bình |
| 3.5 - 4.99 | Yếu |
| 0.0 - 3.49 | Kém |

---

## 7. KẾT LUẬN

### 7.1. Kết quả đạt được

✅ **Về lý thuyết:**
- Trình bày đầy đủ cơ sở lý thuyết về Mảng động
- Phân tích chi tiết các thuật toán và độ phức tạp
- So sánh với các cấu trúc dữ liệu khác

✅ **Về thực nghiệm:**
- Xây dựng phần mềm hoàn chỉnh với giao diện đẹp, responsive
- Cài đặt đầy đủ các chức năng CRUD
- Hiển thị trực quan thông tin mảng động (size, capacity, resize count)
- Dữ liệu được lưu trữ persistent qua LocalStorage

### 7.2. Hướng phát triển

- [ ] Thêm chức năng import/export Excel, CSV
- [ ] Tích hợp backend (Node.js, Python) với database thực
- [ ] Thêm biểu đồ thống kê (Chart.js)
- [ ] Thêm chức năng in ấn
- [ ] Hỗ trợ đa ngôn ngữ

### 7.3. Tài liệu tham khảo

1. Introduction to Algorithms - CLRS
2. Data Structures and Algorithms in JavaScript
3. MDN Web Docs - Array
4. JavaScript: The Definitive Guide

---

**© 2026 - Đề tài Lập trình Nâng cao**
