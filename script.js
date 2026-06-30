/**
 * ============================================================
 * HỆ THỐNG QUẢN LÝ HỌC SINH TIỂU HỌC - JavaScript ES6
 * ============================================================
 * Trường Tiểu học Trần Quốc Toản - Đặc khu Kiên Hải - An Giang
 * Giáo viên: Võ Thanh Đậm
 * Khối: 3, 4, 5
 * ============================================================
 */

// ============================================================
// 1. STATE & DỮ LIỆU MẪU
// ============================================================
const APP_STATE = {
    currentPage: 'dashboard',
    students: [],
    classes: [],
    scores: [],
    attendance: [],
    rewards: [],
    disciplines: [],
    files: [],
    settings: {
        schoolName: 'Trường Tiểu học Trần Quốc Toản',
        schoolYear: '2025-2026',
        theme: 'light',
        logo: '',
        teacherName: 'Võ Thanh Đậm'
    },
    selectedStudents: [],
    currentStudentId: null,
    darkMode: false
};

// Tạo dữ liệu mẫu cho học sinh tiểu học (khối 3,4,5)
function generateSampleStudents() {
    const firstNames = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Vũ', 'Đặng', 'Bùi', 'Đỗ', 'Hồ', 'Ngô', 'Dương', 'Lý', 'Vương'];
    const lastNames = ['Anh', 'Bình', 'Chi', 'Dũng', 'Giang', 'Hà', 'Hùng', 'Hương', 'Khoa', 'Linh', 'Mai', 'Nam', 'Phương', 'Quân', 'Sơn', 'Tâm', 'Thảo', 'Thắng', 'Thu', 'Trang', 'Tuấn', 'Vân', 'Việt', 'Xuân', 'Yến'];
    const genders = ['Nam', 'Nữ'];
    const classNames = [];
    for (let g = 3; g <= 5; g++) {
        classNames.push(`${g}B1`, `${g}B2`, `${g}C`);
    }
    const statuses = ['Đang học', 'Đã chuyển', 'Đã tốt nghiệp', 'Bảo lưu'];
    const academic = ['Giỏi', 'Khá', 'Trung bình', 'Yếu'];
    const conduct = ['Tốt', 'Khá', 'Trung bình', 'Yếu'];
    const students = [];

    for (let i = 1; i <= 50; i++) {
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const gender = genders[Math.floor(Math.random() * genders.length)];
        const cls = classNames[Math.floor(Math.random() * classNames.length)];
        const grade = cls.charAt(0);
        const birthYear = 2014 + Math.floor(Math.random() * 4);
        const birth = new Date(birthYear, Math.floor(Math.random() * 12), 1 + Math.floor(Math.random() * 28));
        const dob = birth.toISOString().split('T')[0];
        const avg = (Math.random() * 4 + 4).toFixed(1);
        const acad = avg >= 8 ? 'Giỏi' : avg >= 6.5 ? 'Khá' : avg >= 5 ? 'Trung bình' : 'Yếu';
        const cond = conduct[Math.floor(Math.random() * conduct.length)];
        const status = statuses[Math.floor(Math.random() * statuses.length)];

        students.push({
            id: `HS${String(10000 + i).padStart(5, '0')}`,
            firstName: firstName,
            lastName: lastName,
            fullName: firstName + ' ' + lastName,
            dob: dob,
            gender: gender,
            address: `${Math.floor(Math.random() * 100) + 1} Đường ${['Lê Lợi', 'Nguyễn Huệ', 'Trần Hưng Đạo', 'Phạm Ngũ Lão', 'Hai Bà Trưng', 'Lý Tự Trọng'][Math.floor(Math.random() * 6)]}, Khu phố ${Math.floor(Math.random() * 5) + 1}, Đặc khu Kiên Hải`,
            phone: `09${String(10000000 + Math.floor(Math.random() * 90000000)).slice(0, 8)}`,
            email: `student${i}@gmail.com`,
            class: cls,
            grade: grade,
            fatherName: firstNames[Math.floor(Math.random() * firstNames.length)] + ' ' + lastNames[Math.floor(Math.random() * lastNames.length)],
            motherName: firstNames[Math.floor(Math.random() * firstNames.length)] + ' ' + lastNames[Math.floor(Math.random() * lastNames.length)],
            parentPhone: `09${String(10000000 + Math.floor(Math.random() * 90000000)).slice(0, 8)}`,
            academic: acad,
            conduct: cond,
            avgScore: parseFloat(avg),
            enrollmentDate: new Date(2024, Math.floor(Math.random() * 12), 1 + Math.floor(Math.random() * 28)).toISOString().split('T')[0],
            status: status,
            note: '',
            avatar: 'images/avatar-default.png'
        });
    }
    return students;
}

// ============================================================
// 2. KHỞI TẠO DỮ LIỆU
// ============================================================
function initData() {
    let students = JSON.parse(localStorage.getItem('students'));
    if (!students || students.length === 0) {
        students = generateSampleStudents();
        localStorage.setItem('students', JSON.stringify(students));
    }
    APP_STATE.students = students;

    let classes = JSON.parse(localStorage.getItem('classes'));
    if (!classes) {
        const classSet = new Set(students.map(s => s.class));
        classes = Array.from(classSet).map(name => {
            const grade = name.charAt(0);
            return {
                id: 'L' + name,
                name: name,
                grade: grade,
                teacher: 'Võ Thanh Đậm',
                count: 0,
                male: 0,
                female: 0
            };
        });
        localStorage.setItem('classes', JSON.stringify(classes));
    }
    APP_STATE.classes = classes;
    updateClassCounts();

    // Khởi tạo điểm mới (4 cột)
    let scores = JSON.parse(localStorage.getItem('scores'));
    if (!scores) {
        scores = [];
        const danhGia = ['Tốt', 'Hoàn thành', 'Chưa hoàn thành'];
        APP_STATE.students.forEach(s => {
            const gk1 = danhGia[Math.floor(Math.random() * danhGia.length)];
            const gk2 = danhGia[Math.floor(Math.random() * danhGia.length)];
            const ck1 = Math.floor(Math.random() * 10) + 1;
            const ck2 = Math.floor(Math.random() * 10) + 1;
            scores.push({
                studentId: s.id,
                giuaKy1: gk1,
                cuoiKy1: ck1,
                giuaKy2: gk2,
                cuoiKy2: ck2,
                avg: parseFloat(((ck1 + ck2) / 2).toFixed(1))
            });
        });
        localStorage.setItem('scores', JSON.stringify(scores));
    }
    APP_STATE.scores = scores;

    if (!localStorage.getItem('attendance')) localStorage.setItem('attendance', JSON.stringify([]));
    if (!localStorage.getItem('rewards')) {
        localStorage.setItem('rewards', JSON.stringify(generateSampleRewards()));
    }
    if (!localStorage.getItem('disciplines')) {
        localStorage.setItem('disciplines', JSON.stringify(generateSampleDisciplines()));
    }
    if (!localStorage.getItem('files')) {
        localStorage.setItem('files', JSON.stringify(generateSampleFiles()));
    }
    if (!localStorage.getItem('settings')) {
        localStorage.setItem('settings', JSON.stringify(APP_STATE.settings));
    }
    APP_STATE.attendance = JSON.parse(localStorage.getItem('attendance'));
    APP_STATE.rewards = JSON.parse(localStorage.getItem('rewards'));
    APP_STATE.disciplines = JSON.parse(localStorage.getItem('disciplines'));
    APP_STATE.files = JSON.parse(localStorage.getItem('files'));
    APP_STATE.settings = JSON.parse(localStorage.getItem('settings'));

    if (APP_STATE.settings.theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        APP_STATE.darkMode = true;
    }
}

function updateClassCounts() {
    const classes = APP_STATE.classes;
    const students = APP_STATE.students;
    classes.forEach(cls => {
        const list = students.filter(s => s.class === cls.name);
        cls.count = list.length;
        cls.male = list.filter(s => s.gender === 'Nam').length;
        cls.female = list.filter(s => s.gender === 'Nữ').length;
    });
    localStorage.setItem('classes', JSON.stringify(classes));
}

// ============================================================
// 3. UTILITY FUNCTIONS
// ============================================================
function formatDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return `${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()}`;
}

function getStatusBadge(status) {
    const map = {
        'Đang học': 'badge-success',
        'Đã chuyển': 'badge-warning',
        'Đã tốt nghiệp': 'badge-info',
        'Bảo lưu': 'badge-danger'
    };
    return `<span class="badge ${map[status] || 'badge-info'}">${status}</span>`;
}

function getAcademicBadge(level) {
    const map = {
        'Giỏi': 'badge-success',
        'Khá': 'badge-info',
        'Trung bình': 'badge-warning',
        'Yếu': 'badge-danger'
    };
    return `<span class="badge ${map[level] || 'badge-info'}">${level}</span>`;
}

function showToast(message, type = 'success', duration = 3000) {
    const container = document.getElementById('toastContainer');
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    };
    const colors = {
        success: '#16a34a',
        error: '#dc2626',
        warning: '#f59e0b',
        info: '#2563eb'
    };
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <i class="${icons[type] || icons.info}" style="color:${colors[type] || colors.info};"></i>
        <span>${message}</span>
        <button class="toast-close"><i class="fas fa-times"></i></button>
    `;
    container.appendChild(toast);
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => removeToast(toast));
    setTimeout(() => removeToast(toast), duration);
}

function removeToast(toast) {
    toast.classList.add('toast-removing');
    setTimeout(() => toast.remove(), 300);
}

let modalResolve = null;
function showModal(title, bodyHTML, confirmText = 'Xác nhận', cancelText = 'Hủy') {
    return new Promise((resolve) => {
        const container = document.getElementById('modalContainer');
        document.getElementById('modalTitle').textContent = title;
        document.getElementById('modalBody').innerHTML = bodyHTML;
        document.getElementById('modalConfirm').textContent = confirmText;
        document.getElementById('modalCancel').textContent = cancelText;
        container.classList.remove('hidden');
        modalResolve = resolve;
    });
}

document.getElementById('modalConfirm').addEventListener('click', () => {
    document.getElementById('modalContainer').classList.add('hidden');
    if (modalResolve) modalResolve(true);
});
document.getElementById('modalCancel').addEventListener('click', () => {
    document.getElementById('modalContainer').classList.add('hidden');
    if (modalResolve) modalResolve(false);
});
document.getElementById('modalClose').addEventListener('click', () => {
    document.getElementById('modalContainer').classList.add('hidden');
    if (modalResolve) modalResolve(false);
});

function showLoading() { document.getElementById('loadingOverlay').classList.remove('hidden'); }
function hideLoading() { document.getElementById('loadingOverlay').classList.add('hidden'); }

// ============================================================
// 4. RENDER PAGES
// ============================================================
function renderPage(page) {
    APP_STATE.currentPage = page;
    document.getElementById('pageTitle').textContent = getPageTitle(page);
    const container = document.getElementById('pageContainer');
    switch (page) {
        case 'dashboard': container.innerHTML = renderDashboard(); break;
        case 'students': container.innerHTML = renderStudents(); break;
        case 'classes': container.innerHTML = renderClasses(); break;
        case 'scores': container.innerHTML = renderScores(); break;
        case 'attendance': container.innerHTML = renderAttendance(); break;
        case 'rewards': container.innerHTML = renderRewards(); break;
        case 'disciplines': container.innerHTML = renderDisciplines(); break;
        case 'files': container.innerHTML = renderFiles(); break;
        case 'statistics': container.innerHTML = renderStatistics(); break;
        case 'search': container.innerHTML = renderSearch(); break;
        case 'settings': container.innerHTML = renderSettings(); break;
        default: container.innerHTML = '<p>Trang không tồn tại.</p>';
    }
    setTimeout(() => {
        if (page === 'dashboard') initCharts();
        if (page === 'students') initStudentTable();
        if (page === 'classes') initClassTable();
        if (page === 'scores') initScoreTable();
        if (page === 'attendance') loadAttendance();
        if (page === 'settings') initSettings();
        if (page === 'search') initSearch();
        if (page === 'statistics') initStatCharts();
    }, 50);
}

function getPageTitle(page) {
    const titles = {
        dashboard: 'Dashboard',
        students: 'Học sinh',
        classes: 'Lớp',
        scores: 'Điểm',
        attendance: 'Điểm danh',
        rewards: 'Khen thưởng',
        disciplines: 'Kỷ luật',
        files: 'File',
        statistics: 'Thống kê',
        search: 'Tìm kiếm',
        settings: 'Cài đặt'
    };
    return titles[page] || page;
}

// ============================================================
// 5. DASHBOARD & CHARTS
// ============================================================
function renderDashboard() {
    const students = APP_STATE.students;
    const total = students.length;
    const male = students.filter(s => s.gender === 'Nam').length;
    const female = total - male;
    const good = students.filter(s => s.academic === 'Giỏi').length;
    const khá = students.filter(s => s.academic === 'Khá').length;
    const tb = students.filter(s => s.academic === 'Trung bình').length;
    const yếu = students.filter(s => s.academic === 'Yếu').length;
    const classes = APP_STATE.classes;

    return `
        <div class="stats-grid">
            <div class="stat-card"><div class="stat-icon"><i class="fas fa-user-graduate"></i></div><div class="stat-value">${total}</div><div class="stat-label">Tổng HS</div></div>
            <div class="stat-card"><div class="stat-icon"><i class="fas fa-chalkboard"></i></div><div class="stat-value">${classes.length}</div><div class="stat-label">Số lớp</div></div>
            <div class="stat-card"><div class="stat-icon"><i class="fas fa-male" style="color:#2563eb;"></i></div><div class="stat-value">${male}</div><div class="stat-label">Nam</div></div>
            <div class="stat-card"><div class="stat-icon"><i class="fas fa-female" style="color:#ec4899;"></i></div><div class="stat-value">${female}</div><div class="stat-label">Nữ</div></div>
            <div class="stat-card"><div class="stat-icon"><i class="fas fa-star" style="color:#f59e0b;"></i></div><div class="stat-value">${good}</div><div class="stat-label">Giỏi</div></div>
            <div class="stat-card"><div class="stat-icon"><i class="fas fa-thumbs-up" style="color:#16a34a;"></i></div><div class="stat-value">${khá}</div><div class="stat-label">Khá</div></div>
            <div class="stat-card"><div class="stat-icon"><i class="fas fa-minus" style="color:#f97316;"></i></div><div class="stat-value">${tb}</div><div class="stat-label">Trung bình</div></div>
            <div class="stat-card"><div class="stat-icon"><i class="fas fa-exclamation-triangle" style="color:#dc2626;"></i></div><div class="stat-value">${yếu}</div><div class="stat-label">Yếu</div></div>
        </div>
        <div class="chart-grid">
            <div class="chart-box"><canvas id="chartGender"></canvas></div>
            <div class="chart-box"><canvas id="chartAcademic"></canvas></div>
            <div class="chart-box"><canvas id="chartClass"></canvas></div>
        </div>
    `;
}

let chartInstances = {};

function initCharts() {
    const students = APP_STATE.students;
    const classes = APP_STATE.classes;

    const male = students.filter(s => s.gender === 'Nam').length;
    const female = students.length - male;
    if (chartInstances.gender) chartInstances.gender.destroy();
    chartInstances.gender = new Chart(document.getElementById('chartGender'), {
        type: 'doughnut',
        data: {
            labels: ['Nam', 'Nữ'],
            datasets: [{
                data: [male, female],
                backgroundColor: ['#2563eb', '#ec4899'],
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'bottom', labels: { font: { size: 12 } } } }
        }
    });

    const good = students.filter(s => s.academic === 'Giỏi').length;
    const khá = students.filter(s => s.academic === 'Khá').length;
    const tb = students.filter(s => s.academic === 'Trung bình').length;
    const yếu = students.filter(s => s.academic === 'Yếu').length;
    if (chartInstances.academic) chartInstances.academic.destroy();
    chartInstances.academic = new Chart(document.getElementById('chartAcademic'), {
        type: 'bar',
        data: {
            labels: ['Giỏi', 'Khá', 'Trung bình', 'Yếu'],
            datasets: [{
                label: 'Số lượng',
                data: [good, khá, tb, yếu],
                backgroundColor: ['#16a34a', '#2563eb', '#f59e0b', '#dc2626'],
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } } }
        }
    });

    const classNames = classes.map(c => c.name);
    const classCounts = classes.map(c => c.count);
    if (chartInstances.class) chartInstances.class.destroy();
    chartInstances.class = new Chart(document.getElementById('chartClass'), {
        type: 'bar',
        data: {
            labels: classNames,
            datasets: [{
                label: 'Sĩ số',
                data: classCounts,
                backgroundColor: '#60a5fa',
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } } }
        }
    });
}

// ============================================================
// 6. QUẢN LÝ HỌC SINH (CRUD + IMPORT/EXCEL)
// ============================================================
let studentPage = 1;
const STUDENT_PAGE_SIZE = 10;
let studentSort = { field: 'fullName', order: 'asc' };

function renderStudents() {
    return `
        <div class="card">
            <div class="flex-between mb-2">
                <h3 class="card-title"><i class="fas fa-user-graduate"></i> Danh sách học sinh</h3>
                <div class="flex gap-2">
                    <button class="btn btn-primary btn-sm" onclick="openAddStudent()"><i class="fas fa-plus"></i> Thêm</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteSelectedStudents()"><i class="fas fa-trash"></i> Xóa nhiều</button>
                    <button class="btn btn-success btn-sm" onclick="exportExcel()"><i class="fas fa-file-excel"></i> Excel</button>
                    <button class="btn btn-secondary btn-sm" onclick="downloadSampleExcel()"><i class="fas fa-file-excel"></i> Tải mẫu</button>
                    <button class="btn btn-secondary btn-sm" onclick="document.getElementById('importFileInput').click()"><i class="fas fa-upload"></i> Import Excel</button>
                    <input type="file" id="importFileInput" accept=".xlsx,.xls" style="display:none" onchange="importExcel(event)">
                    <button class="btn btn-secondary btn-sm" onclick="printStudents()"><i class="fas fa-print"></i> In</button>
                </div>
            </div>
            <div class="search-bar">
                <input type="text" id="studentSearch" placeholder="Tìm theo tên, mã HS..." oninput="filterStudents()">
                <select id="filterClass" onchange="filterStudents()"><option value="">Tất cả lớp</option>${APP_STATE.classes.map(c => `<option value="${c.name}">${c.name}</option>`).join('')}</select>
                <select id="filterGrade" onchange="filterStudents()"><option value="">Tất cả khối</option><option value="3">3</option><option value="4">4</option><option value="5">5</option></select>
                <select id="filterGender" onchange="filterStudents()"><option value="">Giới tính</option><option value="Nam">Nam</option><option value="Nữ">Nữ</option></select>
                <button class="btn btn-secondary btn-sm" onclick="resetFilters()"><i class="fas fa-undo"></i> Reset</button>
            </div>
            <div class="table-wrapper">
                <table id="studentTable">
                    <thead><tr>
                        <th><input type="checkbox" id="selectAll" onchange="toggleSelectAll()"></th>
                        <th>STT</th>
                        <th>Ảnh</th>
                        <th data-sort="id">Mã HS</th>
                        <th data-sort="fullName">Họ tên</th>
                        <th data-sort="dob">Ngày sinh</th>
                        <th data-sort="gender">Giới tính</th>
                        <th data-sort="class">Lớp</th>
                        <th data-sort="academic">Học lực</th>
                        <th data-sort="status">Trạng thái</th>
                        <th>Thao tác</th>
                    </tr></thead>
                    <tbody id="studentTableBody"></tbody>
                </table>
            </div>
            <div class="pagination" id="studentPagination"></div>
        </div>
    `;
}

function getFilteredStudents() {
    let list = [...APP_STATE.students];
    const k = document.getElementById('studentSearch')?.value?.toLowerCase() || '';
    if (k) list = list.filter(s => s.fullName.toLowerCase().includes(k) || s.id.toLowerCase().includes(k));
    const cls = document.getElementById('filterClass')?.value || '';
    if (cls) list = list.filter(s => s.class === cls);
    const grd = document.getElementById('filterGrade')?.value || '';
    if (grd) list = list.filter(s => s.grade === grd);
    const gen = document.getElementById('filterGender')?.value || '';
    if (gen) list = list.filter(s => s.gender === gen);
    const field = studentSort.field;
    const order = studentSort.order;
    list.sort((a, b) => {
        let va = a[field] || '';
        let vb = b[field] || '';
        if (typeof va === 'string') va = va.toLowerCase();
        if (typeof vb === 'string') vb = vb.toLowerCase();
        if (va < vb) return order === 'asc' ? -1 : 1;
        if (va > vb) return order === 'asc' ? 1 : -1;
        return 0;
    });
    return list;
}

function initStudentTable() {
    const list = getFilteredStudents();
    const total = list.length;
    const totalPages = Math.ceil(total / STUDENT_PAGE_SIZE);
    if (studentPage > totalPages) studentPage = totalPages || 1;
    const start = (studentPage - 1) * STUDENT_PAGE_SIZE;
    const pageData = list.slice(start, start + STUDENT_PAGE_SIZE);
    const tbody = document.getElementById('studentTableBody');
    if (!tbody) return;
    tbody.innerHTML = pageData.map((s, idx) => {
        const stt = start + idx + 1;
        const checked = APP_STATE.selectedStudents.includes(s.id) ? 'checked' : '';
        return `<tr>
            <td><input type="checkbox" class="student-check" data-id="${s.id}" ${checked} onchange="toggleStudent('${s.id}')"></td>
            <td>${stt}</td>
            <td><img src="${s.avatar || 'images/avatar-default.png'}" class="avatar-sm" alt="avatar"></td>
            <td><strong>${s.id}</strong></td>
            <td>${s.fullName}</td>
            <td>${formatDate(s.dob)}</td>
            <td>${s.gender}</td>
            <td>${s.class}</td>
            <td>${getAcademicBadge(s.academic)}</td>
            <td>${getStatusBadge(s.status)}</td>
            <td>
                <div class="table-actions">
                    <button class="btn-icon" title="Xem" onclick="viewStudent('${s.id}')"><i class="fas fa-eye"></i></button>
                    <button class="btn-icon" title="Sửa" onclick="editStudent('${s.id}')"><i class="fas fa-edit"></i></button>
                    <button class="btn-icon" title="Xóa" onclick="deleteStudent('${s.id}')" style="color:#dc2626;"><i class="fas fa-trash"></i></button>
                </div>
            </td>
        </tr>`;
    }).join('');

    const pag = document.getElementById('studentPagination');
    if (pag) {
        let html = `<button onclick="goStudentPage(${studentPage - 1})" ${studentPage <= 1 ? 'disabled' : ''}><i class="fas fa-chevron-left"></i></button>`;
        for (let i = 1; i <= totalPages; i++) {
            html += `<button class="${i === studentPage ? 'active' : ''}" onclick="goStudentPage(${i})">${i}</button>`;
        }
        html += `<button onclick="goStudentPage(${studentPage + 1})" ${studentPage >= totalPages ? 'disabled' : ''}><i class="fas fa-chevron-right"></i></button>`;
        pag.innerHTML = html;
    }
    document.querySelectorAll('#studentTable thead th[data-sort]').forEach(th => {
        th.style.cursor = 'pointer';
        th.onclick = () => {
            const field = th.dataset.sort;
            if (studentSort.field === field) {
                studentSort.order = studentSort.order === 'asc' ? 'desc' : 'asc';
            } else {
                studentSort.field = field;
                studentSort.order = 'asc';
            }
            initStudentTable();
        };
    });
}

function filterStudents() { studentPage = 1; initStudentTable(); }
function resetFilters() {
    document.getElementById('studentSearch').value = '';
    document.getElementById('filterClass').value = '';
    document.getElementById('filterGrade').value = '';
    document.getElementById('filterGender').value = '';
    filterStudents();
}
function goStudentPage(p) {
    const list = getFilteredStudents();
    const totalPages = Math.ceil(list.length / STUDENT_PAGE_SIZE);
    if (p < 1 || p > totalPages) return;
    studentPage = p;
    initStudentTable();
}

function toggleStudent(id) {
    const idx = APP_STATE.selectedStudents.indexOf(id);
    if (idx > -1) APP_STATE.selectedStudents.splice(idx, 1);
    else APP_STATE.selectedStudents.push(id);
    initStudentTable();
}
function toggleSelectAll() {
    const checked = document.getElementById('selectAll').checked;
    const list = getFilteredStudents();
    const start = (studentPage - 1) * STUDENT_PAGE_SIZE;
    const pageData = list.slice(start, start + STUDENT_PAGE_SIZE);
    if (checked) {
        pageData.forEach(s => { if (!APP_STATE.selectedStudents.includes(s.id)) APP_STATE.selectedStudents.push(s.id); });
    } else {
        pageData.forEach(s => {
            const idx = APP_STATE.selectedStudents.indexOf(s.id);
            if (idx > -1) APP_STATE.selectedStudents.splice(idx, 1);
        });
    }
    initStudentTable();
}

function openAddStudent() {
    showModal('Thêm học sinh', getStudentFormHTML(), 'Thêm', 'Hủy').then(confirmed => {
        if (confirmed) {
            const data = getStudentFormData();
            if (!data.fullName || !data.dob) {
                showToast('Vui lòng điền đầy đủ thông tin!', 'error');
                return;
            }
            data.id = `HS${String(10000 + APP_STATE.students.length + 1).padStart(5, '0')}`;
            data.avatar = 'images/avatar-default.png';
            data.avgScore = 0;
            APP_STATE.students.push(data);
            localStorage.setItem('students', JSON.stringify(APP_STATE.students));
            updateClassCounts();
            showToast('Thêm học sinh thành công!');
            renderPage('students');
        }
    });
}

function editStudent(id) {
    const student = APP_STATE.students.find(s => s.id === id);
    if (!student) return;
    showModal('Sửa học sinh', getStudentFormHTML(student), 'Cập nhật', 'Hủy').then(confirmed => {
        if (confirmed) {
            const data = getStudentFormData();
            if (!data.fullName || !data.dob) {
                showToast('Vui lòng điền đầy đủ thông tin!', 'error');
                return;
            }
            Object.assign(student, data);
            localStorage.setItem('students', JSON.stringify(APP_STATE.students));
            updateClassCounts();
            showToast('Cập nhật thành công!');
            renderPage('students');
        }
    });
}

function viewStudent(id) {
    const s = APP_STATE.students.find(st => st.id === id);
    if (!s) return;
    const html = `
        <div class="profile-header">
            <img src="${s.avatar || 'images/avatar-default.png'}" class="profile-avatar">
            <div class="profile-info">
                <h2>${s.fullName}</h2>
                <p><strong>Mã HS:</strong> ${s.id} | <strong>Lớp:</strong> ${s.class} | <strong>Khối:</strong> ${s.grade}</p>
                <p>${getStatusBadge(s.status)} ${getAcademicBadge(s.academic)}</p>
            </div>
        </div>
        <div class="form-grid">
            <div><label>Ngày sinh</label><p><strong>${formatDate(s.dob)}</strong></p></div>
            <div><label>Giới tính</label><p><strong>${s.gender}</strong></p></div>
            <div><label>Địa chỉ</label><p><strong>${s.address || ''}</strong></p></div>
            <div><label>SĐT</label><p><strong>${s.phone || ''}</strong></p></div>
            <div><label>Email</label><p><strong>${s.email || ''}</strong></p></div>
            <div><label>Hạnh kiểm</label><p><strong>${s.conduct || ''}</strong></p></div>
            <div><label>Điểm TB</label><p><strong>${s.avgScore || 0}</strong></p></div>
            <div><label>Ngày nhập học</label><p><strong>${formatDate(s.enrollmentDate)}</strong></p></div>
            <div><label>Tên cha</label><p><strong>${s.fatherName || ''}</strong></p></div>
            <div><label>Tên mẹ</label><p><strong>${s.motherName || ''}</strong></p></div>
            <div><label>SĐT phụ huynh</label><p><strong>${s.parentPhone || ''}</strong></p></div>
            <div><label>Ghi chú</label><p><strong>${s.note || ''}</strong></p></div>
        </div>
        <div class="flex gap-2 mt-2">
            <button class="btn btn-primary btn-sm" onclick="printStudent('${s.id}')"><i class="fas fa-print"></i> In hồ sơ</button>
        </div>
    `;
    showModal('Hồ sơ học sinh', html, 'Đóng', '');
}

function getStudentFormHTML(student = null) {
    const s = student || {};
    const classes = APP_STATE.classes.map(c => c.name);
    return `
        <div class="form-grid">
            <div class="form-group"><label>Họ và tên *</label><input type="text" id="sfFullName" value="${s.fullName || ''}" placeholder="Nguyễn Văn A"></div>
            <div class="form-group"><label>Ngày sinh *</label><input type="date" id="sfDob" value="${s.dob || ''}"></div>
            <div class="form-group"><label>Giới tính</label>
                <select id="sfGender"><option value="Nam" ${s.gender === 'Nam' ? 'selected' : ''}>Nam</option><option value="Nữ" ${s.gender === 'Nữ' ? 'selected' : ''}>Nữ</option></select>
            </div>
            <div class="form-group"><label>Lớp</label>
                <select id="sfClass">${classes.map(c => `<option value="${c}" ${s.class === c ? 'selected' : ''}>${c}</option>`).join('')}</select>
            </div>
            <div class="form-group"><label>Khối</label>
                <select id="sfGrade"><option value="3" ${s.grade === '3' ? 'selected' : ''}>3</option><option value="4" ${s.grade === '4' ? 'selected' : ''}>4</option><option value="5" ${s.grade === '5' ? 'selected' : ''}>5</option></select>
            </div>
            <div class="form-group"><label>Địa chỉ</label><input type="text" id="sfAddress" value="${s.address || ''}"></div>
            <div class="form-group"><label>Số điện thoại</label><input type="text" id="sfPhone" value="${s.phone || ''}"></div>
            <div class="form-group"><label>Email</label><input type="email" id="sfEmail" value="${s.email || ''}"></div>
            <div class="form-group"><label>Tên cha</label><input type="text" id="sfFather" value="${s.fatherName || ''}"></div>
            <div class="form-group"><label>Tên mẹ</label><input type="text" id="sfMother" value="${s.motherName || ''}"></div>
            <div class="form-group"><label>SĐT phụ huynh</label><input type="text" id="sfParentPhone" value="${s.parentPhone || ''}"></div>
            <div class="form-group"><label>Trạng thái</label>
                <select id="sfStatus"><option value="Đang học" ${s.status === 'Đang học' ? 'selected' : ''}>Đang học</option><option value="Đã chuyển" ${s.status === 'Đã chuyển' ? 'selected' : ''}>Đã chuyển</option><option value="Đã tốt nghiệp" ${s.status === 'Đã tốt nghiệp' ? 'selected' : ''}>Đã tốt nghiệp</option><option value="Bảo lưu" ${s.status === 'Bảo lưu' ? 'selected' : ''}>Bảo lưu</option></select>
            </div>
            <div class="form-group"><label>Ghi chú</label><textarea id="sfNote">${s.note || ''}</textarea></div>
        </div>
    `;
}

function getStudentFormData() {
    const dob = document.getElementById('sfDob').value;
    return {
        fullName: document.getElementById('sfFullName').value.trim(),
        dob: dob,
        gender: document.getElementById('sfGender').value,
        class: document.getElementById('sfClass').value,
        grade: document.getElementById('sfGrade').value,
        address: document.getElementById('sfAddress').value.trim(),
        phone: document.getElementById('sfPhone').value.trim(),
        email: document.getElementById('sfEmail').value.trim(),
        fatherName: document.getElementById('sfFather').value.trim(),
        motherName: document.getElementById('sfMother').value.trim(),
        parentPhone: document.getElementById('sfParentPhone').value.trim(),
        status: document.getElementById('sfStatus').value,
        note: document.getElementById('sfNote').value.trim(),
        academic: 'Trung bình',
        conduct: 'Tốt',
        avgScore: 0,
        enrollmentDate: new Date().toISOString().split('T')[0]
    };
}

async function deleteStudent(id) {
    const confirmed = await showModal('Xóa học sinh', `Bạn có chắc muốn xóa học sinh <strong>${APP_STATE.students.find(s => s.id === id)?.fullName}</strong>?`, 'Xóa', 'Hủy');
    if (confirmed) {
        APP_STATE.students = APP_STATE.students.filter(s => s.id !== id);
        APP_STATE.selectedStudents = APP_STATE.selectedStudents.filter(sid => sid !== id);
        localStorage.setItem('students', JSON.stringify(APP_STATE.students));
        updateClassCounts();
        showToast('Đã xóa học sinh!', 'warning');
        renderPage('students');
    }
}

async function deleteSelectedStudents() {
    if (APP_STATE.selectedStudents.length === 0) {
        showToast('Vui lòng chọn ít nhất một học sinh.', 'warning');
        return;
    }
    const confirmed = await showModal('Xóa nhiều học sinh', `Bạn có chắc muốn xóa <strong>${APP_STATE.selectedStudents.length}</strong> học sinh?`, 'Xóa tất cả', 'Hủy');
    if (confirmed) {
        APP_STATE.students = APP_STATE.students.filter(s => !APP_STATE.selectedStudents.includes(s.id));
        APP_STATE.selectedStudents = [];
        localStorage.setItem('students', JSON.stringify(APP_STATE.students));
        updateClassCounts();
        showToast('Đã xóa các học sinh đã chọn!', 'warning');
        renderPage('students');
    }
}

// ============================================================
// 7. IMPORT / EXPORT EXCEL (học sinh)
// ============================================================
function exportExcel() {
    const data = APP_STATE.students.map(s => ({
        'Mã HS': s.id,
        'Họ tên': s.fullName,
        'Ngày sinh': s.dob,
        'Giới tính': s.gender,
        'Lớp': s.class,
        'Khối': s.grade,
        'Địa chỉ': s.address,
        'SĐT': s.phone,
        'Email': s.email,
        'Học lực': s.academic,
        'Hạnh kiểm': s.conduct,
        'Điểm TB': s.avgScore,
        'Trạng thái': s.status
    }));
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, 'HocSinh');
    XLSX.writeFile(wb, `Danh_sach_hoc_sinh_${new Date().toISOString().slice(0,10)}.xlsx`);
    showToast('Xuất Excel thành công!');
}

function downloadSampleExcel() {
    const sampleData = [{
        'Mã HS': 'HS10001',
        'Họ tên': 'Nguyễn Văn A',
        'Ngày sinh': '2015-05-15',
        'Giới tính': 'Nam',
        'Lớp': '3B1',
        'Khối': '3',
        'Địa chỉ': '123 Đường Lê Lợi, Khu phố 1, Đặc khu Kiên Hải',
        'SĐT': '0912345678',
        'Email': 'vana@gmail.com',
        'Học lực': 'Giỏi',
        'Hạnh kiểm': 'Tốt',
        'Điểm TB': 8.5,
        'Trạng thái': 'Đang học'
    }, {
        'Mã HS': 'HS10002',
        'Họ tên': 'Trần Thị B',
        'Ngày sinh': '2015-08-20',
        'Giới tính': 'Nữ',
        'Lớp': '4B2',
        'Khối': '4',
        'Địa chỉ': '456 Đường Nguyễn Huệ, Khu phố 2, Đặc khu Kiên Hải',
        'SĐT': '0987654321',
        'Email': 'thib@gmail.com',
        'Học lực': 'Khá',
        'Hạnh kiểm': 'Tốt',
        'Điểm TB': 7.2,
        'Trạng thái': 'Đang học'
    }];
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(sampleData);
    XLSX.utils.book_append_sheet(wb, ws, 'Mau');
    XLSX.writeFile(wb, 'Mau_import_hoc_sinh.xlsx');
    showToast('Đã tải file mẫu!');
}

function importExcel(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            const rows = XLSX.utils.sheet_to_json(firstSheet);
            let imported = 0;
            let errors = 0;
            const newStudents = [];
            const classNames = new Set(APP_STATE.classes.map(c => c.name));

            rows.forEach((row, index) => {
                const fullName = row['Họ tên'] || row['Họ và tên'] || '';
                const dob = row['Ngày sinh'] || '';
                const gender = row['Giới tính'] || '';
                const cls = row['Lớp'] || '';
                const grade = String(row['Khối'] || '').trim();
                const address = row['Địa chỉ'] || '';
                const phone = row['SĐT'] || '';
                const email = row['Email'] || '';
                const fatherName = row['Tên cha'] || '';
                const motherName = row['Tên mẹ'] || '';
                const parentPhone = row['SĐT phụ huynh'] || '';
                const status = row['Trạng thái'] || 'Đang học';
                const note = row['Ghi chú'] || '';

                if (!fullName || !dob || !gender || !cls) {
                    errors++;
                    return;
                }

                const newStudent = {
                    id: `HS${String(10000 + APP_STATE.students.length + newStudents.length + 1).padStart(5, '0')}`,
                    fullName: fullName.trim(),
                    dob: dob.trim(),
                    gender: gender.trim(),
                    class: cls.trim(),
                    grade: grade || cls.trim().charAt(0),
                    address: address.trim(),
                    phone: phone.trim(),
                    email: email.trim(),
                    fatherName: fatherName.trim(),
                    motherName: motherName.trim(),
                    parentPhone: parentPhone.trim(),
                    status: status.trim(),
                    note: note.trim(),
                    academic: 'Trung bình',
                    conduct: 'Tốt',
                    avgScore: 0,
                    enrollmentDate: new Date().toISOString().split('T')[0],
                    avatar: 'images/avatar-default.png'
                };

                if (!classNames.has(newStudent.class)) {
                    APP_STATE.classes.push({
                        id: 'L' + newStudent.class,
                        name: newStudent.class,
                        grade: newStudent.grade,
                        teacher: 'Võ Thanh Đậm',
                        count: 0,
                        male: 0,
                        female: 0
                    });
                    classNames.add(newStudent.class);
                }

                newStudents.push(newStudent);
                imported++;
            });

            if (newStudents.length > 0) {
                APP_STATE.students.push(...newStudents);
                localStorage.setItem('students', JSON.stringify(APP_STATE.students));
                localStorage.setItem('classes', JSON.stringify(APP_STATE.classes));
                updateClassCounts();
                showToast(`Import thành công ${imported} học sinh. ${errors > 0 ? 'Có ' + errors + ' dòng bị lỗi (thiếu thông tin).' : ''}`);
            } else {
                showToast('Không có dữ liệu hợp lệ để import.', 'error');
            }
            renderPage('students');
            document.getElementById('importFileInput').value = '';
        } catch (err) {
            showToast('Lỗi đọc file: ' + err.message, 'error');
        }
    };
    reader.readAsArrayBuffer(file);
}

// ============================================================
// 8. QUẢN LÝ LỚP (có xuất danh sách lớp)
// ============================================================
function renderClasses() {
    const classOptions = APP_STATE.classes.map(c => `<option value="${c.name}">${c.name}</option>`).join('');
    return `
        <div class="card">
            <div class="flex-between mb-2">
                <h3 class="card-title"><i class="fas fa-chalkboard-teacher"></i> Danh sách lớp</h3>
                <div class="flex gap-2">
                    <button class="btn btn-primary btn-sm" onclick="openAddClass()"><i class="fas fa-plus"></i> Thêm lớp</button>
                    <div class="flex gap-1" style="align-items:center;">
                        <select id="exportClassSelect" style="padding:0.3rem 0.6rem;border:1px solid var(--border);border-radius:4px;">
                            <option value="">Chọn lớp</option>
                            ${classOptions}
                        </select>
                        <button class="btn btn-success btn-sm" onclick="exportClassList()"><i class="fas fa-file-excel"></i> Xuất danh sách</button>
                    </div>
                </div>
            </div>
            <div class="table-wrapper">
                <table>
                    <thead><tr><th>STT</th><th>Tên lớp</th><th>Khối</th><th>GVCN</th><th>Sĩ số</th><th>Nam</th><th>Nữ</th><th>Thao tác</th></tr></thead>
                    <tbody id="classTableBody"></tbody>
                </table>
            </div>
        </div>
    `;
}

function initClassTable() {
    const tbody = document.getElementById('classTableBody');
    if (!tbody) return;
    const list = APP_STATE.classes;
    tbody.innerHTML = list.map((c, idx) => `
        <tr>
            <td>${idx + 1}</td>
            <td><strong>${c.name}</strong></td>
            <td>${c.grade}</td>
            <td>${c.teacher || 'Võ Thanh Đậm'}</td>
            <td>${c.count || 0}</td>
            <td>${c.male || 0}</td>
            <td>${c.female || 0}</td>
            <td>
                <div class="table-actions">
                    <button class="btn-icon" onclick="editClass('${c.id}')"><i class="fas fa-edit"></i></button>
                    <button class="btn-icon" onclick="deleteClass('${c.id}')" style="color:#dc2626;"><i class="fas fa-trash"></i></button>
                </div>
            </td>
        </tr>
    `).join('');
}

function openAddClass() {
    showModal('Thêm lớp', `
        <div class="form-grid">
            <div class="form-group"><label>Tên lớp *</label><input type="text" id="cfName" placeholder="5B1"></div>
            <div class="form-group"><label>Khối *</label><select id="cfGrade"><option value="3">3</option><option value="4">4</option><option value="5">5</option></select></div>
            <div class="form-group"><label>Giáo viên chủ nhiệm</label><input type="text" id="cfTeacher" placeholder="Võ Thanh Đậm" value="Võ Thanh Đậm"></div>
        </div>
    `, 'Thêm', 'Hủy').then(confirmed => {
        if (confirmed) {
            const name = document.getElementById('cfName').value.trim();
            const grade = document.getElementById('cfGrade').value;
            const teacher = document.getElementById('cfTeacher').value.trim() || 'Võ Thanh Đậm';
            if (!name) { showToast('Vui lòng nhập tên lớp!', 'error'); return; }
            if (APP_STATE.classes.some(c => c.name === name)) {
                showToast('Lớp đã tồn tại!', 'error'); return;
            }
            APP_STATE.classes.push({ id: 'L' + Date.now().toString(36), name, grade, teacher, count: 0, male: 0, female: 0 });
            localStorage.setItem('classes', JSON.stringify(APP_STATE.classes));
            showToast('Thêm lớp thành công!');
            renderPage('classes');
        }
    });
}

function editClass(id) {
    const c = APP_STATE.classes.find(cls => cls.id === id);
    if (!c) return;
    showModal('Sửa lớp', `
        <div class="form-grid">
            <div class="form-group"><label>Tên lớp *</label><input type="text" id="cfName" value="${c.name}"></div>
            <div class="form-group"><label>Khối *</label><select id="cfGrade"><option value="3" ${c.grade === '3' ? 'selected' : ''}>3</option><option value="4" ${c.grade === '4' ? 'selected' : ''}>4</option><option value="5" ${c.grade === '5' ? 'selected' : ''}>5</option></select></div>
            <div class="form-group"><label>Giáo viên chủ nhiệm</label><input type="text" id="cfTeacher" value="${c.teacher || 'Võ Thanh Đậm'}"></div>
        </div>
    `, 'Cập nhật', 'Hủy').then(confirmed => {
        if (confirmed) {
            const name = document.getElementById('cfName').value.trim();
            if (!name) { showToast('Vui lòng nhập tên lớp!', 'error'); return; }
            c.name = name;
            c.grade = document.getElementById('cfGrade').value;
            c.teacher = document.getElementById('cfTeacher').value.trim() || 'Võ Thanh Đậm';
            localStorage.setItem('classes', JSON.stringify(APP_STATE.classes));
            showToast('Cập nhật thành công!');
            renderPage('classes');
        }
    });
}

async function deleteClass(id) {
    const c = APP_STATE.classes.find(cls => cls.id === id);
    if (!c) return;
    const confirmed = await showModal('Xóa lớp', `Bạn có chắc muốn xóa lớp <strong>${c.name}</strong>?`, 'Xóa', 'Hủy');
    if (confirmed) {
        APP_STATE.classes = APP_STATE.classes.filter(cls => cls.id !== id);
        localStorage.setItem('classes', JSON.stringify(APP_STATE.classes));
        showToast('Đã xóa lớp!', 'warning');
        renderPage('classes');
    }
}

// ============================================================
// 9. QUẢN LÝ ĐIỂM (có xuất điểm lớp)
// ============================================================
function renderScores() {
    const classOptions = APP_STATE.classes.map(c => `<option value="${c.name}">${c.name}</option>`).join('');
    return `
        <div class="card">
            <div class="flex-between mb-2">
                <h3 class="card-title"><i class="fas fa-pencil-alt"></i> Quản lý điểm</h3>
                <div class="flex gap-2">
                    <select id="exportScoreClass" style="padding:0.3rem 0.6rem;border:1px solid var(--border);border-radius:4px;">
                        <option value="">Chọn lớp</option>
                        ${classOptions}
                    </select>
                    <button class="btn btn-success btn-sm" onclick="exportScoreClass()"><i class="fas fa-file-excel"></i> Xuất điểm lớp</button>
                </div>
            </div>
            <p class="text-muted mb-2">Nhập điểm và nhận xét cho học sinh.</p>
            <div class="search-bar">
                <input type="text" id="scoreSearch" placeholder="Tìm học sinh..." oninput="initScoreTable()">
                <select id="scoreClass" onchange="initScoreTable()"><option value="">Tất cả lớp</option>${classOptions}</select>
            </div>
            <div class="table-wrapper">
                <table>
                    <thead><tr>
                        <th>STT</th><th>Mã HS</th><th>Họ tên</th><th>Lớp</th>
                        <th>Giữa kỳ 1</th><th>Cuối kỳ 1</th>
                        <th>Giữa kỳ 2</th><th>Cuối kỳ 2</th>
                        <th>ĐTB</th><th>Thao tác</th>
                    </tr></thead>
                    <tbody id="scoreTableBody"></tbody>
                </table>
            </div>
        </div>
    `;
}

function initScoreTable() {
    const tbody = document.getElementById('scoreTableBody');
    if (!tbody) return;
    let list = APP_STATE.students;
    const kw = document.getElementById('scoreSearch')?.value?.toLowerCase() || '';
    if (kw) list = list.filter(s => s.fullName.toLowerCase().includes(kw) || s.id.toLowerCase().includes(kw));
    const cls = document.getElementById('scoreClass')?.value || '';
    if (cls) list = list.filter(s => s.class === cls);
    const danhGiaOptions = ['Tốt', 'Hoàn thành', 'Chưa hoàn thành'];
    tbody.innerHTML = list.map((s, idx) => {
        const sc = APP_STATE.scores.find(sc => sc.studentId === s.id) || { giuaKy1: 'Tốt', cuoiKy1: 0, giuaKy2: 'Tốt', cuoiKy2: 0, avg: 0 };
        const gk1Options = danhGiaOptions.map(opt => `<option value="${opt}" ${opt === sc.giuaKy1 ? 'selected' : ''}>${opt}</option>`).join('');
        const gk2Options = danhGiaOptions.map(opt => `<option value="${opt}" ${opt === sc.giuaKy2 ? 'selected' : ''}>${opt}</option>`).join('');
        return `<tr>
            <td>${idx + 1}</td>
            <td>${s.id}</td>
            <td>${s.fullName}</td>
            <td>${s.class}</td>
            <td>
                <select style="width:100px;" onchange="updateScore('${s.id}','giuaKy1',this.value)">
                    ${gk1Options}
                </select>
            </td>
            <td>
                <input type="number" min="0" max="10" value="${sc.cuoiKy1}" style="width:60px;" onchange="updateScore('${s.id}','cuoiKy1',this.value)">
            </td>
            <td>
                <select style="width:100px;" onchange="updateScore('${s.id}','giuaKy2',this.value)">
                    ${gk2Options}
                </select>
            </td>
            <td>
                <input type="number" min="0" max="10" value="${sc.cuoiKy2}" style="width:60px;" onchange="updateScore('${s.id}','cuoiKy2',this.value)">
            </td>
            <td><strong>${sc.avg.toFixed(1)}</strong></td>
            <td><button class="btn btn-primary btn-sm" onclick="saveScore('${s.id}')"><i class="fas fa-save"></i></button></td>
        </tr>`;
    }).join('');
}

function updateScore(studentId, field, value) {
    let sc = APP_STATE.scores.find(s => s.studentId === studentId);
    if (!sc) {
        sc = { studentId, giuaKy1: 'Tốt', cuoiKy1: 0, giuaKy2: 'Tốt', cuoiKy2: 0, avg: 0 };
        APP_STATE.scores.push(sc);
    }
    if (field === 'giuaKy1' || field === 'giuaKy2') {
        sc[field] = value;
    } else {
        sc[field] = parseFloat(value) || 0;
    }
    const ck1 = sc.cuoiKy1 || 0;
    const ck2 = sc.cuoiKy2 || 0;
    sc.avg = parseFloat(((ck1 + ck2) / 2).toFixed(1));
    const student = APP_STATE.students.find(s => s.id === studentId);
    if (student) {
        student.avgScore = sc.avg;
        student.academic = sc.avg >= 8 ? 'Giỏi' : sc.avg >= 6.5 ? 'Khá' : sc.avg >= 5 ? 'Trung bình' : 'Yếu';
        localStorage.setItem('students', JSON.stringify(APP_STATE.students));
    }
}

function saveScore(studentId) {
    localStorage.setItem('scores', JSON.stringify(APP_STATE.scores));
    showToast('Đã lưu điểm!');
    initScoreTable();
}

// ============================================================
// 10. ĐIỂM DANH (có xuất Excel)
// ============================================================
function renderAttendance() {
    const today = new Date().toISOString().split('T')[0];
    const classOptions = APP_STATE.classes.map(c => `<option value="${c.name}">${c.name}</option>`).join('');

    return `
        <div class="card">
            <div class="flex-between mb-2">
                <h3 class="card-title"><i class="fas fa-clipboard-check"></i> Điểm danh</h3>
                <button class="btn btn-success btn-sm" onclick="exportAttendanceExcel()"><i class="fas fa-file-excel"></i> Xuất Excel</button>
            </div>
            <div class="flex gap-2 mb-2" style="flex-wrap:wrap;">
                <div class="form-group" style="flex:1; min-width:150px;">
                    <label>Chọn lớp</label>
                    <select id="attendanceClass" onchange="loadAttendance()">${classOptions}</select>
                </div>
                <div class="form-group" style="flex:1; min-width:150px;">
                    <label>Ngày</label>
                    <input type="date" id="attendanceDate" value="${today}" onchange="loadAttendance()">
                </div>
                <div class="form-group" style="align-self:flex-end;">
                    <button class="btn btn-primary" onclick="saveAttendance()"><i class="fas fa-save"></i> Lưu điểm danh</button>
                </div>
            </div>
            <div id="attendanceTableWrapper">
                <p class="text-muted">Chọn lớp và ngày để xem danh sách điểm danh.</p>
            </div>
        </div>
    `;
}

function loadAttendance() {
    const cls = document.getElementById('attendanceClass').value;
    const date = document.getElementById('attendanceDate').value;
    const wrapper = document.getElementById('attendanceTableWrapper');
    if (!cls || !date) {
        wrapper.innerHTML = '<p class="text-muted">Vui lòng chọn lớp và ngày.</p>';
        return;
    }

    const students = APP_STATE.students.filter(s => s.class === cls);
    if (students.length === 0) {
        wrapper.innerHTML = '<p class="text-muted">Lớp này chưa có học sinh.</p>';
        return;
    }

    let record = APP_STATE.attendance.find(a => a.date === date && a.class === cls);
    if (!record) {
        record = {
            date: date,
            class: cls,
            records: students.map(s => ({ studentId: s.id, status: 'Có mặt' }))
        };
        APP_STATE.attendance.push(record);
        localStorage.setItem('attendance', JSON.stringify(APP_STATE.attendance));
    }

    const existingIds = record.records.map(r => r.studentId);
    students.forEach(s => {
        if (!existingIds.includes(s.id)) {
            record.records.push({ studentId: s.id, status: 'Có mặt' });
        }
    });

    const statusOptions = ['Có mặt', 'Vắng', 'Phép', 'Không phép', 'Muộn'];
    let html = `
        <div class="table-wrapper">
            <table>
                <thead><tr><th>STT</th><th>Mã HS</th><th>Họ tên</th><th>Trạng thái</th></tr></thead>
                <tbody>
    `;
    students.forEach((s, idx) => {
        const rec = record.records.find(r => r.studentId === s.id);
        const status = rec ? rec.status : 'Có mặt';
        const options = statusOptions.map(opt => `<option value="${opt}" ${opt === status ? 'selected' : ''}>${opt}</option>`).join('');
        html += `
            <tr>
                <td>${idx + 1}</td>
                <td>${s.id}</td>
                <td>${s.fullName}</td>
                <td>
                    <select class="attendance-status" data-student="${s.id}" onchange="updateAttendanceStatus('${date}','${cls}','${s.id}',this.value)">
                        ${options}
                    </select>
                </td>
            </tr>
        `;
    });
    html += `</tbody></table></div>`;
    wrapper.innerHTML = html;
}

function updateAttendanceStatus(date, cls, studentId, status) {
    let record = APP_STATE.attendance.find(a => a.date === date && a.class === cls);
    if (!record) {
        const students = APP_STATE.students.filter(s => s.class === cls);
        record = {
            date: date,
            class: cls,
            records: students.map(s => ({ studentId: s.id, status: 'Có mặt' }))
        };
        APP_STATE.attendance.push(record);
    }
    const rec = record.records.find(r => r.studentId === studentId);
    if (rec) {
        rec.status = status;
    } else {
        record.records.push({ studentId, status });
    }
    localStorage.setItem('attendance', JSON.stringify(APP_STATE.attendance));
}

function saveAttendance() {
    showToast('Đã lưu điểm danh!');
    loadAttendance();
}

function exportAttendanceExcel() {
    const cls = document.getElementById('attendanceClass')?.value;
    const date = document.getElementById('attendanceDate')?.value;
    if (!cls || !date) {
        showToast('Vui lòng chọn lớp và ngày trước khi xuất.', 'warning');
        return;
    }

    const record = APP_STATE.attendance.find(a => a.date === date && a.class === cls);
    if (!record || record.records.length === 0) {
        showToast('Không có dữ liệu điểm danh cho ngày và lớp này.', 'warning');
        return;
    }

    const data = record.records.map(r => {
        const student = APP_STATE.students.find(s => s.id === r.studentId);
        return {
            'Mã HS': r.studentId,
            'Họ tên': student ? student.fullName : 'Không xác định',
            'Lớp': cls,
            'Ngày': date,
            'Trạng thái': r.status
        };
    });

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, 'DiemDanh');
    XLSX.writeFile(wb, `DiemDanh_${cls}_${date}.xlsx`);
    showToast('Xuất Excel điểm danh thành công!');
}

// ============================================================
// 11. QUẢN LÝ KHEN THƯỞNG (có xuất Excel)
// ============================================================
function generateSampleRewards() {
    return [
        { id: 'R1', studentId: APP_STATE.students[0]?.id || '', date: '2025-09-10', content: 'Đạt giải Nhất văn nghệ toàn trường', decisionBy: 'Võ Thanh Đậm' },
        { id: 'R2', studentId: APP_STATE.students[4]?.id || '', date: '2025-09-15', content: 'Học sinh xuất sắc tháng 9', decisionBy: 'Võ Thanh Đậm' }
    ];
}

function renderRewards() {
    const rewards = APP_STATE.rewards;
    const studentMap = Object.fromEntries(APP_STATE.students.map(s => [s.id, s.fullName]));
    return `
        <div class="card">
            <div class="flex-between mb-2">
                <h3 class="card-title"><i class="fas fa-medal"></i> Khen thưởng</h3>
                <div class="flex gap-2">
                    <button class="btn btn-primary btn-sm" onclick="openAddReward()"><i class="fas fa-plus"></i> Thêm</button>
                    <button class="btn btn-success btn-sm" onclick="exportRewards()"><i class="fas fa-file-excel"></i> Xuất Excel</button>
                </div>
            </div>
            <div class="table-wrapper">
                <table>
                    <thead><tr><th>STT</th><th>Học sinh</th><th>Ngày</th><th>Nội dung</th><th>Người quyết định</th><th>Thao tác</th></tr></thead>
                    <tbody>
                        ${rewards.length === 0 ? '<tr><td colspan="6" class="text-center text-muted">Chưa có khen thưởng nào.</td></tr>' :
                        rewards.map((r, i) => `
                            <tr>
                                <td>${i+1}</td>
                                <td>${studentMap[r.studentId] || 'Không xác định'}</td>
                                <td>${formatDate(r.date)}</td>
                                <td>${r.content}</td>
                                <td>${r.decisionBy}</td>
                                <td>
                                    <button class="btn-icon" onclick="deleteReward('${r.id}')" style="color:#dc2626;"><i class="fas fa-trash"></i></button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function openAddReward() {
    const studentOptions = APP_STATE.students.map(s => `<option value="${s.id}">${s.fullName}</option>`).join('');
    showModal('Thêm khen thưởng', `
        <div class="form-group"><label>Chọn học sinh *</label><select id="rewardStudent">${studentOptions}</select></div>
        <div class="form-group"><label>Ngày</label><input type="date" id="rewardDate" value="${new Date().toISOString().split('T')[0]}"></div>
        <div class="form-group"><label>Nội dung khen thưởng *</label><textarea id="rewardContent" placeholder="VD: Đạt giải nhất văn nghệ..."></textarea></div>
        <div class="form-group"><label>Người quyết định</label><input type="text" id="rewardDecision" value="Võ Thanh Đậm"></div>
    `, 'Thêm', 'Hủy').then(confirmed => {
        if (confirmed) {
            const studentId = document.getElementById('rewardStudent').value;
            const date = document.getElementById('rewardDate').value;
            const content = document.getElementById('rewardContent').value.trim();
            const decision = document.getElementById('rewardDecision').value.trim() || 'Võ Thanh Đậm';
            if (!studentId || !content) {
                showToast('Vui lòng chọn học sinh và nhập nội dung!', 'error');
                return;
            }
            APP_STATE.rewards.push({ id: 'R' + Date.now().toString(36), studentId, date, content, decisionBy: decision });
            localStorage.setItem('rewards', JSON.stringify(APP_STATE.rewards));
            showToast('Thêm khen thưởng thành công!');
            renderPage('rewards');
        }
    });
}

async function deleteReward(id) {
    const r = APP_STATE.rewards.find(rew => rew.id === id);
    if (!r) return;
    const confirmed = await showModal('Xóa khen thưởng', `Bạn có chắc muốn xóa khen thưởng này?`, 'Xóa', 'Hủy');
    if (confirmed) {
        APP_STATE.rewards = APP_STATE.rewards.filter(rew => rew.id !== id);
        localStorage.setItem('rewards', JSON.stringify(APP_STATE.rewards));
        showToast('Đã xóa!', 'warning');
        renderPage('rewards');
    }
}

// ============================================================
// 12. QUẢN LÝ KỶ LUẬT (có xuất Excel)
// ============================================================
function generateSampleDisciplines() {
    return [
        { id: 'D1', studentId: APP_STATE.students[2]?.id || '', date: '2025-09-12', content: 'Đi học muộn nhiều lần', decisionBy: 'Võ Thanh Đậm' },
        { id: 'D2', studentId: APP_STATE.students[8]?.id || '', date: '2025-09-20', content: 'Không làm bài tập về nhà', decisionBy: 'Võ Thanh Đậm' }
    ];
}

function renderDisciplines() {
    const disciplines = APP_STATE.disciplines;
    const studentMap = Object.fromEntries(APP_STATE.students.map(s => [s.id, s.fullName]));
    return `
        <div class="card">
            <div class="flex-between mb-2">
                <h3 class="card-title"><i class="fas fa-gavel"></i> Kỷ luật</h3>
                <div class="flex gap-2">
                    <button class="btn btn-primary btn-sm" onclick="openAddDiscipline()"><i class="fas fa-plus"></i> Thêm</button>
                    <button class="btn btn-success btn-sm" onclick="exportDisciplines()"><i class="fas fa-file-excel"></i> Xuất Excel</button>
                </div>
            </div>
            <div class="table-wrapper">
                <table>
                    <thead><tr><th>STT</th><th>Học sinh</th><th>Ngày</th><th>Nội dung</th><th>Người quyết định</th><th>Thao tác</th></tr></thead>
                    <tbody>
                        ${disciplines.length === 0 ? '<tr><td colspan="6" class="text-center text-muted">Chưa có kỷ luật nào.</td></tr>' :
                        disciplines.map((d, i) => `
                            <tr>
                                <td>${i+1}</td>
                                <td>${studentMap[d.studentId] || 'Không xác định'}</td>
                                <td>${formatDate(d.date)}</td>
                                <td>${d.content}</td>
                                <td>${d.decisionBy}</td>
                                <td>
                                    <button class="btn-icon" onclick="deleteDiscipline('${d.id}')" style="color:#dc2626;"><i class="fas fa-trash"></i></button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function openAddDiscipline() {
    const studentOptions = APP_STATE.students.map(s => `<option value="${s.id}">${s.fullName}</option>`).join('');
    showModal('Thêm kỷ luật', `
        <div class="form-group"><label>Chọn học sinh *</label><select id="disciplineStudent">${studentOptions}</select></div>
        <div class="form-group"><label>Ngày</label><input type="date" id="disciplineDate" value="${new Date().toISOString().split('T')[0]}"></div>
        <div class="form-group"><label>Nội dung kỷ luật *</label><textarea id="disciplineContent" placeholder="VD: Đi học muộn..."></textarea></div>
        <div class="form-group"><label>Người quyết định</label><input type="text" id="disciplineDecision" value="Võ Thanh Đậm"></div>
    `, 'Thêm', 'Hủy').then(confirmed => {
        if (confirmed) {
            const studentId = document.getElementById('disciplineStudent').value;
            const date = document.getElementById('disciplineDate').value;
            const content = document.getElementById('disciplineContent').value.trim();
            const decision = document.getElementById('disciplineDecision').value.trim() || 'Võ Thanh Đậm';
            if (!studentId || !content) {
                showToast('Vui lòng chọn học sinh và nhập nội dung!', 'error');
                return;
            }
            APP_STATE.disciplines.push({ id: 'D' + Date.now().toString(36), studentId, date, content, decisionBy: decision });
            localStorage.setItem('disciplines', JSON.stringify(APP_STATE.disciplines));
            showToast('Thêm kỷ luật thành công!');
            renderPage('disciplines');
        }
    });
}

async function deleteDiscipline(id) {
    const d = APP_STATE.disciplines.find(dis => dis.id === id);
    if (!d) return;
    const confirmed = await showModal('Xóa kỷ luật', `Bạn có chắc muốn xóa kỷ luật này?`, 'Xóa', 'Hủy');
    if (confirmed) {
        APP_STATE.disciplines = APP_STATE.disciplines.filter(dis => dis.id !== id);
        localStorage.setItem('disciplines', JSON.stringify(APP_STATE.disciplines));
        showToast('Đã xóa!', 'warning');
        renderPage('disciplines');
    }
}

// ============================================================
// 13. QUẢN LÝ FILE
// ============================================================
function generateSampleFiles() {
    return [
        { id: 'F1', name: 'Kế hoạch năm học 2025-2026.pdf', type: 'pdf', size: '2.4 MB', uploadDate: '2025-09-01', studentId: null, desc: 'Kế hoạch chung' },
        { id: 'F2', name: 'Danh sách lớp 3B1.xlsx', type: 'excel', size: '156 KB', uploadDate: '2025-09-05', studentId: null, desc: '' },
        { id: 'F3', name: 'Ảnh hoạt động ngoại khóa.jpg', type: 'image', size: '3.1 MB', uploadDate: '2025-09-10', studentId: null, desc: '' }
    ];
}

function renderFiles() {
    const files = APP_STATE.files;
    return `
        <div class="card">
            <div class="flex-between mb-2">
                <h3 class="card-title"><i class="fas fa-folder-open"></i> Quản lý file</h3>
                <button class="btn btn-primary btn-sm" onclick="openUploadFile()"><i class="fas fa-upload"></i> Tải lên</button>
            </div>
            <div class="table-wrapper">
                <table>
                    <thead><tr><th>STT</th><th>Tên file</th><th>Loại</th><th>Dung lượng</th><th>Ngày tải</th><th>Mô tả</th><th>Thao tác</th></tr></thead>
                    <tbody>
                        ${files.length === 0 ? '<tr><td colspan="7" class="text-center text-muted">Chưa có file nào.</td></tr>' :
                        files.map((f, i) => `
                            <tr>
                                <td>${i+1}</td>
                                <td>${f.name}</td>
                                <td>${f.type}</td>
                                <td>${f.size}</td>
                                <td>${formatDate(f.uploadDate)}</td>
                                <td>${f.desc || ''}</td>
                                <td>
                                    <button class="btn-icon" onclick="downloadFile('${f.id}')"><i class="fas fa-download"></i></button>
                                    <button class="btn-icon" onclick="deleteFile('${f.id}')" style="color:#dc2626;"><i class="fas fa-trash"></i></button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function openUploadFile() {
    showModal('Tải file lên', `
        <div class="form-group"><label>Chọn file</label><input type="file" id="fileInput" style="padding:0.5rem;"></div>
        <div class="form-group"><label>Mô tả (không bắt buộc)</label><input type="text" id="fileDesc" placeholder="Ghi chú..."></div>
    `, 'Tải lên', 'Hủy').then(confirmed => {
        if (confirmed) {
            const input = document.getElementById('fileInput');
            if (!input.files || input.files.length === 0) {
                showToast('Vui lòng chọn file!', 'error');
                return;
            }
            const file = input.files[0];
            const newFile = {
                id: 'F' + Date.now().toString(36),
                name: file.name,
                type: file.type.split('/')[0] || 'unknown',
                size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
                uploadDate: new Date().toISOString().split('T')[0],
                studentId: null,
                desc: document.getElementById('fileDesc').value.trim()
            };
            APP_STATE.files.push(newFile);
            localStorage.setItem('files', JSON.stringify(APP_STATE.files));
            showToast('Tải file thành công!');
            renderPage('files');
        }
    });
}

function downloadFile(id) {
    const file = APP_STATE.files.find(f => f.id === id);
    if (!file) return;
    showToast(`Đang tải file: ${file.name}`, 'info');
    const blob = new Blob(['Nội dung mẫu của file ' + file.name], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

async function deleteFile(id) {
    const file = APP_STATE.files.find(f => f.id === id);
    if (!file) return;
    const confirmed = await showModal('Xóa file', `Bạn có chắc muốn xóa file <strong>${file.name}</strong>?`, 'Xóa', 'Hủy');
    if (confirmed) {
        APP_STATE.files = APP_STATE.files.filter(f => f.id !== id);
        localStorage.setItem('files', JSON.stringify(APP_STATE.files));
        showToast('Đã xóa file!', 'warning');
        renderPage('files');
    }
}

// ============================================================
// 14. THỐNG KÊ
// ============================================================
function renderStatistics() {
    return `
        <div class="card">
            <h3 class="card-title"><i class="fas fa-chart-bar"></i> Thống kê chi tiết</h3>
            <div class="chart-grid">
                <div class="chart-box"><canvas id="statGradeChart"></canvas></div>
                <div class="chart-box"><canvas id="statGenderChart"></canvas></div>
            </div>
            <div class="stats-grid mt-2">
                <div class="stat-card"><div class="stat-label">Tổng học sinh</div><div class="stat-value">${APP_STATE.students.length}</div></div>
                <div class="stat-card"><div class="stat-label">Số lớp</div><div class="stat-value">${APP_STATE.classes.length}</div></div>
                <div class="stat-card"><div class="stat-label">Khen thưởng</div><div class="stat-value">${APP_STATE.rewards.length}</div></div>
                <div class="stat-card"><div class="stat-label">Kỷ luật</div><div class="stat-value">${APP_STATE.disciplines.length}</div></div>
            </div>
        </div>
    `;
}

function initStatCharts() {
    const grades = ['3', '4', '5'];
    const counts = grades.map(g => APP_STATE.students.filter(s => s.grade === g).length);
    if (chartInstances.statGrade) chartInstances.statGrade.destroy();
    chartInstances.statGrade = new Chart(document.getElementById('statGradeChart'), {
        type: 'bar',
        data: {
            labels: ['Khối 3', 'Khối 4', 'Khối 5'],
            datasets: [{ label: 'Số học sinh', data: counts, backgroundColor: ['#60a5fa', '#34d399', '#fbbf24'], borderRadius: 6 }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }
    });

    const male = APP_STATE.students.filter(s => s.gender === 'Nam').length;
    const female = APP_STATE.students.length - male;
    if (chartInstances.statGender) chartInstances.statGender.destroy();
    chartInstances.statGender = new Chart(document.getElementById('statGenderChart'), {
        type: 'doughnut',
        data: {
            labels: ['Nam', 'Nữ'],
            datasets: [{ data: [male, female], backgroundColor: ['#2563eb', '#ec4899'], borderWidth: 2 }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }
    });
}

// ============================================================
// 15. TÌM KIẾM, CÀI ĐẶT, IN ẤN
// ============================================================
function renderSearch() {
    return `
        <div class="card">
            <h3 class="card-title"><i class="fas fa-search"></i> Tìm kiếm nâng cao</h3>
            <div class="search-bar">
                <input type="text" id="globalSearch" placeholder="Nhập từ khóa..." oninput="globalSearch()">
                <select id="searchField" onchange="globalSearch()"><option value="all">Tất cả</option><option value="id">Mã HS</option><option value="fullName">Họ tên</option><option value="class">Lớp</option><option value="grade">Khối</option></select>
                <button class="btn btn-primary btn-sm" onclick="globalSearch()"><i class="fas fa-search"></i> Tìm</button>
            </div>
            <div id="searchResults"></div>
        </div>
    `;
}

function globalSearch() {
    const kw = document.getElementById('globalSearch')?.value?.toLowerCase() || '';
    const field = document.getElementById('searchField')?.value || 'all';
    const container = document.getElementById('searchResults');
    if (!container) return;
    if (!kw) { container.innerHTML = '<p class="text-muted">Nhập từ khóa để tìm kiếm.</p>'; return; }
    let results = APP_STATE.students.filter(s => {
        if (field === 'all') {
            return s.fullName.toLowerCase().includes(kw) || s.id.toLowerCase().includes(kw) || s.class.toLowerCase().includes(kw) || s.grade.includes(kw);
        }
        return String(s[field] || '').toLowerCase().includes(kw);
    });
    if (results.length === 0) {
        container.innerHTML = '<p class="text-muted">Không tìm thấy kết quả.</p>';
        return;
    }
    container.innerHTML = `
        <div class="table-wrapper">
            <table>
                <thead><tr><th>STT</th><th>Mã HS</th><th>Họ tên</th><th>Lớp</th><th>Học lực</th><th>Trạng thái</th></tr></thead>
                <tbody>${results.map((s, i) => `
                    <tr>
                        <td>${i + 1}</td>
                        <td>${s.id}</td>
                        <td>${s.fullName}</td>
                        <td>${s.class}</td>
                        <td>${getAcademicBadge(s.academic)}</td>
                        <td>${getStatusBadge(s.status)}</td>
                    </tr>
                `).join('')}</tbody>
            </table>
        </div>
        <p class="text-muted mt-2">Tìm thấy ${results.length} kết quả.</p>
    `;
}

function renderSettings() {
    const settings = APP_STATE.settings;
    return `
        <div class="card">
            <h3 class="card-title"><i class="fas fa-cog"></i> Cài đặt</h3>
            <div class="form-grid">
                <div class="form-group"><label>Tên trường</label><input type="text" id="setSchoolName" value="${settings.schoolName || ''}"></div>
                <div class="form-group"><label>Năm học</label><input type="text" id="setSchoolYear" value="${settings.schoolYear || ''}"></div>
                <div class="form-group"><label>Giáo viên</label><input type="text" id="setTeacherName" value="${settings.teacherName || ''}"></div>
                <div class="form-group"><label>Giao diện</label>
                    <select id="setTheme"><option value="light" ${settings.theme === 'light' ? 'selected' : ''}>Sáng</option><option value="dark" ${settings.theme === 'dark' ? 'selected' : ''}>Tối</option></select>
                </div>
            </div>
            <button class="btn btn-primary" onclick="saveSettings()"><i class="fas fa-save"></i> Lưu cài đặt</button>
            <hr class="my-3">
            <h4>Đổi mật khẩu</h4>
            <div class="form-grid">
                <div class="form-group"><label>Mật khẩu mới</label><input type="password" id="newPassword" placeholder="••••••••"></div>
                <div class="form-group"><label>Xác nhận</label><input type="password" id="confirmPassword" placeholder="••••••••"></div>
            </div>
            <button class="btn btn-warning" onclick="changePassword()"><i class="fas fa-key"></i> Đổi mật khẩu</button>
        </div>
    `;
}

function initSettings() {}
function initSearch() {}

function saveSettings() {
    const settings = APP_STATE.settings;
    settings.schoolName = document.getElementById('setSchoolName').value.trim();
    settings.schoolYear = document.getElementById('setSchoolYear').value.trim();
    settings.teacherName = document.getElementById('setTeacherName').value.trim();
    settings.theme = document.getElementById('setTheme').value;
    if (settings.theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        APP_STATE.darkMode = true;
    } else {
        document.documentElement.removeAttribute('data-theme');
        APP_STATE.darkMode = false;
    }
    localStorage.setItem('settings', JSON.stringify(settings));
    showToast('Đã lưu cài đặt!');
}

function changePassword() {
    const pwd = document.getElementById('newPassword').value;
    const confirm = document.getElementById('confirmPassword').value;
    if (!pwd || pwd.length < 6) { showToast('Mật khẩu phải có ít nhất 6 ký tự.', 'error'); return; }
    if (pwd !== confirm) { showToast('Mật khẩu xác nhận không khớp.', 'error'); return; }
    showToast('Đổi mật khẩu thành công! (Demo)');
}

function printStudents() {
    window.print();
}

function printStudent(id) {
    const s = APP_STATE.students.find(st => st.id === id);
    if (!s) return;
    const win = window.open('', '_blank');
    win.document.write(`
        <html><head><title>Hồ sơ học sinh</title>
        <style>body { font-family: Arial, sans-serif; padding: 2rem; } table { width: 100%; border-collapse: collapse; } td { padding: 0.5rem; border: 1px solid #ccc; }</style>
        </head><body>
        <h1>HỒ SƠ HỌC SINH</h1>
        <p><strong>Mã HS:</strong> ${s.id}</p>
        <p><strong>Họ tên:</strong> ${s.fullName}</p>
        <p><strong>Ngày sinh:</strong> ${formatDate(s.dob)}</p>
        <p><strong>Giới tính:</strong> ${s.gender}</p>
        <p><strong>Lớp:</strong> ${s.class} - Khối ${s.grade}</p>
        <p><strong>Địa chỉ:</strong> ${s.address || ''}</p>
        <p><strong>SĐT:</strong> ${s.phone || ''}</p>
        <p><strong>Email:</strong> ${s.email || ''}</p>
        <p><strong>Học lực:</strong> ${s.academic}</p>
        <p><strong>Hạnh kiểm:</strong> ${s.conduct}</p>
        <p><strong>Điểm TB:</strong> ${s.avgScore}</p>
        <p><strong>Trạng thái:</strong> ${s.status}</p>
        <p><strong>Ngày nhập học:</strong> ${formatDate(s.enrollmentDate)}</p>
        <script>window.print();<\/script>
        </body></html>
    `);
    win.document.close();
}

// ============================================================
// 16. CÁC HÀM XUẤT EXCEL MỚI (theo yêu cầu)
// ============================================================
// Xuất danh sách học sinh của một lớp
function exportClassList() {
    const cls = document.getElementById('exportClassSelect')?.value;
    if (!cls) {
        showToast('Vui lòng chọn lớp để xuất.', 'warning');
        return;
    }
    const students = APP_STATE.students.filter(s => s.class === cls);
    if (students.length === 0) {
        showToast('Lớp này chưa có học sinh.', 'warning');
        return;
    }
    const data = students.map(s => ({
        'Mã HS': s.id,
        'Họ tên': s.fullName,
        'Ngày sinh': s.dob,
        'Giới tính': s.gender,
        'Lớp': s.class,
        'Khối': s.grade,
        'Địa chỉ': s.address,
        'SĐT': s.phone,
        'Email': s.email,
        'Học lực': s.academic,
        'Hạnh kiểm': s.conduct,
        'Điểm TB': s.avgScore,
        'Trạng thái': s.status
    }));
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, 'DanhSachLop');
    XLSX.writeFile(wb, `Danh_sach_lop_${cls}_${new Date().toISOString().slice(0,10)}.xlsx`);
    showToast(`Xuất danh sách lớp ${cls} thành công!`);
}

// Xuất điểm của một lớp (bao gồm cả nhận xét)
function exportScoreClass() {
    const cls = document.getElementById('exportScoreClass')?.value;
    if (!cls) {
        showToast('Vui lòng chọn lớp để xuất điểm.', 'warning');
        return;
    }
    const students = APP_STATE.students.filter(s => s.class === cls);
    if (students.length === 0) {
        showToast('Lớp này chưa có học sinh.', 'warning');
        return;
    }
    const data = students.map(s => {
        const sc = APP_STATE.scores.find(sc => sc.studentId === s.id) || { giuaKy1: 'Tốt', cuoiKy1: 0, giuaKy2: 'Tốt', cuoiKy2: 0, avg: 0 };
        return {
            'Mã HS': s.id,
            'Họ tên': s.fullName,
            'Lớp': s.class,
            'Giữa kỳ 1': sc.giuaKy1,
            'Cuối kỳ 1': sc.cuoiKy1,
            'Giữa kỳ 2': sc.giuaKy2,
            'Cuối kỳ 2': sc.cuoiKy2,
            'Điểm trung bình': sc.avg
        };
    });
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, 'DiemLop');
    XLSX.writeFile(wb, `Diem_lop_${cls}_${new Date().toISOString().slice(0,10)}.xlsx`);
    showToast(`Xuất điểm lớp ${cls} thành công!`);
}

// Xuất danh sách khen thưởng
function exportRewards() {
    if (APP_STATE.rewards.length === 0) {
        showToast('Chưa có dữ liệu khen thưởng.', 'warning');
        return;
    }
    const studentMap = Object.fromEntries(APP_STATE.students.map(s => [s.id, s.fullName]));
    const data = APP_STATE.rewards.map(r => ({
        'Học sinh': studentMap[r.studentId] || 'Không xác định',
        'Ngày': r.date,
        'Nội dung': r.content,
        'Người quyết định': r.decisionBy
    }));
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, 'KhenThuong');
    XLSX.writeFile(wb, `Khen_thuong_${new Date().toISOString().slice(0,10)}.xlsx`);
    showToast('Xuất khen thưởng thành công!');
}

// Xuất danh sách kỷ luật
function exportDisciplines() {
    if (APP_STATE.disciplines.length === 0) {
        showToast('Chưa có dữ liệu kỷ luật.', 'warning');
        return;
    }
    const studentMap = Object.fromEntries(APP_STATE.students.map(s => [s.id, s.fullName]));
    const data = APP_STATE.disciplines.map(d => ({
        'Học sinh': studentMap[d.studentId] || 'Không xác định',
        'Ngày': d.date,
        'Nội dung': d.content,
        'Người quyết định': d.decisionBy
    }));
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, 'KyLuat');
    XLSX.writeFile(wb, `Ky_luat_${new Date().toISOString().slice(0,10)}.xlsx`);
    showToast('Xuất kỷ luật thành công!');
}

// ============================================================
// 17. NAVIGATION & LOGIN
// ============================================================
function initNavigation() {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function() {
            const page = this.dataset.page;
            if (!page) return;
            document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
            this.classList.add('active');
            renderPage(page);
            if (window.innerWidth <= 768) {
                document.getElementById('sidebar').classList.remove('open');
            }
        });
    });

    document.getElementById('toggleSidebar').addEventListener('click', () => {
        document.getElementById('sidebar').classList.toggle('collapsed');
    });

    document.getElementById('toggleSidebarMobile').addEventListener('click', () => {
        document.getElementById('sidebar').classList.toggle('open');
    });

    document.getElementById('darkModeToggle').addEventListener('click', () => {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        if (isDark) {
            document.documentElement.removeAttribute('data-theme');
            APP_STATE.settings.theme = 'light';
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            APP_STATE.settings.theme = 'dark';
        }
        localStorage.setItem('settings', JSON.stringify(APP_STATE.settings));
        APP_STATE.darkMode = !isDark;
        const icon = document.querySelector('#darkModeToggle i');
        if (icon) {
            icon.className = isDark ? 'fas fa-moon' : 'fas fa-sun';
        }
    });
}

function initLogin() {
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('loginUsername').value.trim();
        const password = document.getElementById('loginPassword').value.trim();
        if (username === 'admin' && password === 'admin123') {
            document.getElementById('loginScreen').style.display = 'none';
            document.getElementById('app').classList.remove('hidden');
            if (document.getElementById('rememberMe').checked) {
                localStorage.setItem('remembered', 'true');
            }
            showToast('Đăng nhập thành công!');
            renderPage('dashboard');
        } else {
            showToast('Tên đăng nhập hoặc mật khẩu không đúng!', 'error');
        }
    });

    document.getElementById('togglePassword').addEventListener('click', function() {
        const input = document.getElementById('loginPassword');
        const icon = this.querySelector('i');
        if (input.type === 'password') {
            input.type = 'text';
            icon.className = 'fas fa-eye-slash';
        } else {
            input.type = 'password';
            icon.className = 'fas fa-eye';
        }
    });

    document.getElementById('forgotPassword').addEventListener('click', function(e) {
        e.preventDefault();
        showToast('Vui lòng liên hệ quản trị viên để đặt lại mật khẩu.', 'info');
    });

    document.getElementById('logoutBtn').addEventListener('click', function() {
        document.getElementById('loginScreen').style.display = 'flex';
        document.getElementById('app').classList.add('hidden');
        showToast('Đã đăng xuất.', 'info');
    });

    if (localStorage.getItem('remembered') === 'true') {
        document.getElementById('loginUsername').value = 'admin';
        document.getElementById('loginPassword').value = 'admin123';
        document.getElementById('rememberMe').checked = true;
    }
}

// ============================================================
// 18. KHỞI ĐỘNG
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
    initData();
    initLogin();
    initNavigation();

    if (APP_STATE.darkMode) {
        const icon = document.querySelector('#darkModeToggle i');
        if (icon) icon.className = 'fas fa-sun';
    }

    if (localStorage.getItem('remembered') === 'true') {
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('app').classList.remove('hidden');
        renderPage('dashboard');
    }

    // Export functions to window
    window.openAddStudent = openAddStudent;
    window.editStudent = editStudent;
    window.viewStudent = viewStudent;
    window.deleteStudent = deleteStudent;
    window.deleteSelectedStudents = deleteSelectedStudents;
    window.toggleStudent = toggleStudent;
    window.toggleSelectAll = toggleSelectAll;
    window.filterStudents = filterStudents;
    window.resetFilters = resetFilters;
    window.goStudentPage = goStudentPage;
    window.openAddClass = openAddClass;
    window.editClass = editClass;
    window.deleteClass = deleteClass;
    window.initStudentTable = initStudentTable;
    window.initClassTable = initClassTable;
    window.initScoreTable = initScoreTable;
    window.updateScore = updateScore;
    window.saveScore = saveScore;
    window.globalSearch = globalSearch;
    window.saveSettings = saveSettings;
    window.changePassword = changePassword;
    window.exportExcel = exportExcel;
    window.downloadSampleExcel = downloadSampleExcel;
    window.importExcel = importExcel;
    window.printStudents = printStudents;
    window.printStudent = printStudent;
    window.loadAttendance = loadAttendance;
    window.saveAttendance = saveAttendance;
    window.updateAttendanceStatus = updateAttendanceStatus;
    window.exportAttendanceExcel = exportAttendanceExcel;
    window.openAddReward = openAddReward;
    window.deleteReward = deleteReward;
    window.openAddDiscipline = openAddDiscipline;
    window.deleteDiscipline = deleteDiscipline;
    window.openUploadFile = openUploadFile;
    window.downloadFile = downloadFile;
    window.deleteFile = deleteFile;
    // Thêm các hàm xuất mới
    window.exportClassList = exportClassList;
    window.exportScoreClass = exportScoreClass;
    window.exportRewards = exportRewards;
    window.exportDisciplines = exportDisciplines;
});