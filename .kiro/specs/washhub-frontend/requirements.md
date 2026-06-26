# Requirements Document

## Introduction

WashHub Frontend adalah aplikasi web modern berbasis React JS yang berfungsi sebagai antarmuka manajemen untuk Smart Laundry Management System. Aplikasi ini terintegrasi dengan backend Laravel API yang sudah ada, menyediakan tampilan yang modern, responsif, dan efisien untuk mengelola pengguna, role & permission, serta menampilkan statistik dashboard. Aplikasi menggunakan Tailwind CSS dengan color palette yang telah ditentukan (Primary: #2f74de, Secondary: #6377a2, Tertiary: #C46300), font Poppins, dan ikon Lucide React.

## Glossary

- **App**: Aplikasi WashHub Frontend secara keseluruhan
- **AuthContext**: Context API React yang menyimpan state autentikasi pengguna
- **AuthService**: Modul service yang menangani komunikasi dengan endpoint autentikasi API
- **DashboardService**: Modul service yang menangani komunikasi dengan endpoint dashboard API
- **RoleService**: Modul service yang menangani komunikasi dengan endpoint role & permission API
- **UserService**: Modul service yang menangani komunikasi dengan endpoint user management API
- **Router**: React Router DOM yang mengelola navigasi antar halaman
- **ProtectedRoute**: Komponen yang memblokir akses ke halaman tertentu jika pengguna belum terautentikasi
- **Token**: Bearer token Sanctum yang diterima dari API setelah login berhasil
- **Authenticated User**: Pengguna yang telah berhasil login dan memiliki Token yang valid
- **Guest**: Pengguna yang belum login
- **DashboardLayout**: Layout wrapper yang menyertakan sidebar dan top navbar untuk halaman-halaman terproteksi
- **AuthLayout**: Layout wrapper untuk halaman autentikasi (login)
- **MainLayout**: Layout wrapper untuk halaman publik (landing page)
- **Sidebar**: Panel navigasi vertikal di sisi kiri pada DashboardLayout
- **TopNavbar**: Bar navigasi horizontal di bagian atas pada DashboardLayout
- **LandingNavbar**: Navbar sticky untuk halaman landing page
- **KPI Card**: Kartu statistik yang menampilkan angka metrik utama di dashboard
- **Role**: Entitas yang merepresentasikan peran pengguna dalam sistem (misal: Admin, Kasir)
- **Permission**: Entitas yang merepresentasikan izin akses spesifik yang dapat ditetapkan ke Role
- **Pagination**: Mekanisme pembagian data dalam beberapa halaman untuk efisiensi tampilan

---

## Requirements

### Requirement 1: Inisialisasi Proyek dan Konfigurasi Dasar

**User Story:** Sebagai developer, saya ingin proyek React JS dikonfigurasi dengan benar, sehingga semua dependensi, routing, styling, dan struktur folder siap digunakan sebelum pengembangan fitur dimulai.

#### Acceptance Criteria

1. THE App SHALL menggunakan struktur folder sesuai spesifikasi: `src/components/`, `src/pages/`, `src/layouts/`, `src/routes/`, `src/services/`, dan `src/styles/`.
2. THE App SHALL menggunakan font Poppins yang dimuat dari Google Fonts sebagai font utama di seluruh halaman.
3. THE App SHALL menerapkan color palette dengan variabel CSS: primary `#2f74de`, secondary `#6377a2`, dan tertiary `#C46300`.
4. THE App SHALL menggunakan Tailwind CSS sebagai framework styling utama.
5. THE App SHALL menggunakan React Router DOM untuk mengelola navigasi antar halaman.
6. THE App SHALL menggunakan Axios sebagai HTTP client untuk semua komunikasi dengan backend API.
7. THE App SHALL menggunakan Lucide React sebagai library ikon.
8. THE Router SHALL mendefinisikan rute: `/` (Landing), `/login` (Login), `/dashboard` (Dashboard), `/roles` (Role & Permission), dan `/profile` (Profile).
9. WHEN pengguna mengakses rute yang tidak terdaftar, THE Router SHALL mengarahkan pengguna ke halaman `/`.

---

### Requirement 2: Sistem Autentikasi

**User Story:** Sebagai pengguna, saya ingin dapat login dan logout dengan aman, sehingga hanya pengguna yang berwenang yang dapat mengakses fitur manajemen.

#### Acceptance Criteria

1. THE AuthContext SHALL menyimpan state: `user` (data pengguna), `token` (Bearer token), dan `isAuthenticated` (boolean status login).
2. THE AuthContext SHALL memuat ulang state autentikasi dari `localStorage` saat aplikasi pertama kali diinisialisasi.
3. WHEN login berhasil, THE AuthContext SHALL menyimpan `token` dan data `user` ke `localStorage` dan memperbarui state `isAuthenticated` menjadi `true`.
4. WHEN logout dilakukan, THE AuthContext SHALL menghapus `token` dan data `user` dari `localStorage` dan memperbarui state `isAuthenticated` menjadi `false`.
5. THE AuthService SHALL mengirim request `POST /api/auth/login` dengan body `{ email, password }` untuk proses login.
6. THE AuthService SHALL mengirim request `POST /api/auth/logout` dengan Bearer token di header Authorization untuk proses logout.
7. THE AuthService SHALL mengirim request `GET /api/auth/me` dengan Bearer token di header Authorization untuk mengambil data pengguna yang sedang login.
8. THE ProtectedRoute SHALL memeriksa nilai `isAuthenticated` dari AuthContext.
9. WHEN pengguna yang belum terautentikasi mengakses rute terproteksi (`/dashboard`, `/roles`, `/profile`), THE ProtectedRoute SHALL mengarahkan pengguna ke halaman `/login`.
10. WHEN pengguna yang sudah terautentikasi mengakses halaman `/login`, THE Router SHALL mengarahkan pengguna ke halaman `/dashboard`.
11. THE App SHALL menyertakan Bearer token di header `Authorization` pada setiap request API ke endpoint yang terproteksi.
12. WHEN API mengembalikan response dengan status `401 Unauthorized`, THE App SHALL menghapus sesi autentikasi dan mengarahkan pengguna ke halaman `/login`.

---

### Requirement 3: Landing Page

**User Story:** Sebagai calon pengguna, saya ingin melihat halaman utama yang informatif dan menarik, sehingga saya dapat memahami fitur WashHub dan termotivasi untuk mendaftar atau login.

#### Acceptance Criteria

1. THE App SHALL merender halaman Landing Page pada rute `/`.
2. THE LandingNavbar SHALL menampilkan logo WashHub, tautan navigasi (Home, About Us), dan tombol Login.
3. WHILE pengguna menggulir halaman ke bawah, THE LandingNavbar SHALL tetap terlihat di bagian atas layar (sticky).
4. WHEN pengguna mengklik tombol Login di LandingNavbar, THE Router SHALL mengarahkan pengguna ke halaman `/login`.
5. THE App SHALL menampilkan Hero Section yang memuat judul "Smart Laundry Management System", subheadline deskriptif, tombol CTA "Get Started" yang mengarah ke `/login`, tombol "Learn More" yang menggulir ke Features Section, dan elemen visual berupa ilustrasi atau preview dashboard.
6. THE App SHALL menampilkan Features Section yang memuat minimal 6 kartu fitur: Laundry Tracking, Customer Management, Employee Monitoring, Reports & Analytics, Quality Control, dan Order Management.
7. WHEN pengguna mengarahkan kursor ke kartu fitur, THE App SHALL menampilkan animasi hover yang halus pada kartu tersebut.
8. Setiap kartu fitur SHALL menampilkan ikon Lucide React yang relevan, judul fitur, dan deskripsi singkat.
9. THE App SHALL menampilkan Testimonials Section yang memuat minimal 3 testimoni pengguna.
10. THE App SHALL menampilkan CTA Section dengan tombol yang mengarahkan pengguna ke halaman `/login`.
11. THE App SHALL menampilkan Footer yang memuat tautan navigasi, tautan media sosial, dan teks copyright.
12. THE App SHALL merender Landing Page secara responsif pada lebar layar mobile (< 768px), tablet (768px–1023px), dan desktop (≥ 1024px).

---

### Requirement 4: Halaman Login

**User Story:** Sebagai pengguna terdaftar, saya ingin dapat login menggunakan email dan password, sehingga saya dapat mengakses fitur manajemen yang terproteksi.

#### Acceptance Criteria

1. THE App SHALL merender halaman Login pada rute `/login` menggunakan AuthLayout.
2. THE App SHALL menampilkan form login dalam sebuah card putih yang terpusat di atas background dengan gradient biru muda.
3. THE App SHALL menampilkan logo WashHub di atas form login.
4. THE App SHALL menampilkan field input Email dan field input Password dalam form login.
5. THE App SHALL menampilkan tombol toggle show/hide pada field Password untuk menampilkan atau menyembunyikan karakter password.
6. THE App SHALL menampilkan tautan "Forgot Password" di bawah field Password.
7. THE App SHALL menampilkan tombol "Sign In" sebagai tombol submit utama dengan warna primary `#2f74de`.
8. WHEN pengguna mengklik tombol "Sign In" dengan field yang kosong, THE App SHALL menampilkan pesan validasi inline di bawah field yang kosong tanpa mengirim request ke API.
9. WHEN pengguna mengklik tombol "Sign In" dengan data yang valid, THE App SHALL menampilkan indikator loading pada tombol dan menonaktifkan tombol tersebut selama request berlangsung.
10. WHEN login berhasil (API mengembalikan status 200), THE App SHALL menyimpan token dan data user ke AuthContext, lalu mengarahkan pengguna ke halaman `/dashboard`.
11. IF API mengembalikan response error (status 401 atau 422), THEN THE App SHALL menampilkan pesan error yang deskriptif di dalam form tanpa me-refresh halaman.
12. THE App SHALL merender halaman Login secara responsif pada lebar layar mobile, tablet, dan desktop.

---

### Requirement 5: Dashboard

**User Story:** Sebagai Authenticated User, saya ingin melihat ringkasan statistik sistem di dashboard, sehingga saya dapat memantau kondisi sistem secara cepat.

#### Acceptance Criteria

1. THE App SHALL merender halaman Dashboard pada rute `/dashboard` menggunakan DashboardLayout.
2. THE DashboardLayout SHALL menampilkan Sidebar di sisi kiri dan TopNavbar di bagian atas konten utama.
3. THE Sidebar SHALL menampilkan tautan navigasi: Dashboard, Users, Role & Permission, Settings, dan tombol Logout.
4. WHEN pengguna mengklik tombol Logout di Sidebar, THE App SHALL memanggil `POST /api/auth/logout`, menghapus sesi autentikasi, dan mengarahkan pengguna ke halaman `/login`.
5. THE TopNavbar SHALL menampilkan search bar, ikon notifikasi, dan avatar pengguna yang sedang login.
6. THE App SHALL menampilkan minimal 3 KPI Card di halaman Dashboard: Active Users, Total Permissions, dan Total Roles.
7. WHEN halaman Dashboard dimuat, THE DashboardService SHALL mengirim request `GET /api/dashboard/stats` dengan Bearer token untuk mengambil data statistik.
8. WHEN data statistik berhasil diambil, THE App SHALL merender nilai statistik yang diterima dari API ke dalam KPI Card yang sesuai.
9. WHEN request `GET /api/dashboard/stats` sedang berlangsung, THE App SHALL menampilkan skeleton loading pada area KPI Card.
10. IF request `GET /api/dashboard/stats` gagal, THEN THE App SHALL menampilkan pesan error yang informatif di area konten dashboard.
11. THE App SHALL menggunakan background warna `#f0f4ff` untuk area konten utama dashboard.
12. THE App SHALL merender DashboardLayout secara responsif, dengan Sidebar yang dapat disembunyikan pada lebar layar mobile.

---

### Requirement 6: Manajemen Role & Permission

**User Story:** Sebagai Authenticated User, saya ingin dapat melihat, membuat, mengedit, dan menghapus role beserta permission-nya, sehingga saya dapat mengelola hak akses pengguna dalam sistem.

#### Acceptance Criteria

1. THE App SHALL merender halaman Role & Permission pada rute `/roles` menggunakan DashboardLayout.
2. WHEN halaman Role & Permission dimuat, THE RoleService SHALL mengirim request `GET /api/roles` dengan Bearer token untuk mengambil daftar role.
3. THE App SHALL menampilkan daftar role dalam sebuah tabel dengan kolom: Role Name, Permissions, Status, dan Actions.
4. THE App SHALL menampilkan input pencarian yang memfilter daftar role berdasarkan nama role secara real-time di sisi klien.
5. THE App SHALL menampilkan kontrol pagination untuk menavigasi daftar role jika jumlah data melebihi batas tampilan per halaman.
6. THE App SHALL menampilkan tombol "Add Role" yang membuka modal form untuk membuat role baru.
7. WHEN pengguna mengisi form Add Role dan mengklik tombol simpan, THE RoleService SHALL mengirim request `POST /api/roles` dengan data role baru.
8. WHEN request `POST /api/roles` berhasil (API mengembalikan status 201), THE App SHALL menutup modal, menampilkan notifikasi sukses, dan memperbarui daftar role tanpa me-refresh halaman.
9. THE App SHALL menampilkan tombol Edit pada setiap baris role yang membuka modal form untuk mengedit permission role tersebut.
10. WHEN pengguna menyimpan perubahan pada modal Edit, THE RoleService SHALL mengirim request `PUT /api/roles/{id}` dengan data yang diperbarui.
11. WHEN request `PUT /api/roles/{id}` berhasil, THE App SHALL menutup modal, menampilkan notifikasi sukses, dan memperbarui data role di tabel.
12. THE App SHALL menampilkan tombol Delete pada setiap baris role yang memunculkan dialog konfirmasi sebelum penghapusan.
13. WHEN pengguna mengkonfirmasi penghapusan, THE RoleService SHALL mengirim request `DELETE /api/roles/{id}`.
14. WHEN request `DELETE /api/roles/{id}` berhasil, THE App SHALL menampilkan notifikasi sukses dan menghapus baris role dari tabel.
15. WHEN halaman Role & Permission dimuat, THE App SHALL juga mengambil daftar permission yang tersedia melalui request `GET /api/permissions` untuk digunakan dalam modal Add/Edit Role.
16. IF request API pada halaman Role & Permission gagal, THEN THE App SHALL menampilkan pesan error yang deskriptif kepada pengguna.
17. WHEN request API sedang berlangsung, THE App SHALL menampilkan indikator loading yang sesuai.

---

### Requirement 7: Halaman Profile

**User Story:** Sebagai Authenticated User, saya ingin dapat melihat dan memperbarui informasi profil serta mengganti password saya, sehingga data akun saya selalu akurat dan aman.

#### Acceptance Criteria

1. THE App SHALL merender halaman Profile pada rute `/profile` menggunakan DashboardLayout.
2. WHEN halaman Profile dimuat, THE App SHALL mengirim request `GET /api/auth/me` untuk mengambil data profil pengguna yang sedang login.
3. THE App SHALL menampilkan informasi profil pengguna: avatar, nama, email, role, dan nomor telepon.
4. THE App SHALL menampilkan form Edit Profile dengan field yang dapat diedit: nama dan nomor telepon.
5. WHEN pengguna mengklik tombol simpan pada form Edit Profile, THE App SHALL mengirim request `PUT /api/profile` dengan data yang diperbarui.
6. WHEN request `PUT /api/profile` berhasil, THE App SHALL menampilkan notifikasi sukses dan memperbarui tampilan informasi profil dengan data terbaru.
7. THE App SHALL menampilkan form Change Password dengan field: Current Password, New Password, dan Confirm New Password.
8. WHEN pengguna mengisi form Change Password dengan New Password dan Confirm New Password yang tidak sama, THE App SHALL menampilkan pesan validasi inline tanpa mengirim request ke API.
9. WHEN pengguna mengklik tombol simpan pada form Change Password dengan data yang valid, THE App SHALL mengirim request `PUT /api/profile/password`.
10. WHEN request `PUT /api/profile/password` berhasil, THE App SHALL menampilkan notifikasi sukses dan mengosongkan semua field pada form Change Password.
11. IF request API pada halaman Profile gagal, THEN THE App SHALL menampilkan pesan error yang deskriptif kepada pengguna.
12. WHEN request API sedang berlangsung pada halaman Profile, THE App SHALL menampilkan indikator loading pada tombol submit yang aktif.

---

### Requirement 8: Komponen Reusable dan Arsitektur

**User Story:** Sebagai developer, saya ingin komponen UI yang reusable dan arsitektur yang bersih, sehingga kode mudah dipelihara, dikembangkan, dan konsisten di seluruh aplikasi.

#### Acceptance Criteria

1. THE App SHALL memisahkan logika komunikasi API ke dalam modul service (`authService.js`, `userService.js`, `roleService.js`, `dashboardService.js`) di folder `src/services/`.
2. THE App SHALL menggunakan instance Axios terpusat di `src/services/api.js` yang dikonfigurasi dengan `baseURL` dan interceptor untuk menyertakan Bearer token secara otomatis.
3. WHEN Axios interceptor mendeteksi response dengan status `401`, THE App SHALL secara otomatis menghapus sesi autentikasi dan mengarahkan pengguna ke `/login`.
4. THE App SHALL mengimplementasikan komponen reusable di `src/components/common/` yang mencakup minimal: Button, Input, Modal, LoadingSpinner, dan NotificationToast.
5. THE App SHALL mengimplementasikan komponen tabel reusable di `src/components/tables/` yang mendukung konfigurasi kolom, data, dan pagination.
6. THE App SHALL mengimplementasikan komponen kartu statistik reusable di `src/components/cards/` untuk digunakan di halaman Dashboard.
7. THE App SHALL menggunakan functional component dan React Hooks (`useState`, `useEffect`, `useContext`) secara konsisten di seluruh codebase.
8. THE App SHALL menerapkan loading state, error state, dan empty state pada setiap komponen yang melakukan fetch data dari API.
9. THE App SHALL menerapkan styling yang konsisten menggunakan Tailwind CSS utility classes dengan color palette yang telah ditentukan di seluruh komponen.
10. THE App SHALL menerapkan desain responsif menggunakan Tailwind CSS breakpoint (`sm`, `md`, `lg`, `xl`) pada semua halaman dan komponen utama.
