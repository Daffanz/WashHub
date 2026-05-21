Prompt Utama

Buatkan project fullstack bernama WashHub menggunakan:

Frontend: React + Vite
Backend: Laravel REST API
Database: MySQL
Authentication: Laravel Sanctum / JWT
Styling: TailwindCSS
State Management: React Context / Redux Toolkit
HTTP Client: Axios
Architecture Backend: Repository Pattern + Service Layer
Struktur project harus clean architecture dan mudah dibaca
Gunakan naming convention yang konsisten
Pisahkan folder berdasarkan responsibility
Tujuan Sistem

WashHub adalah sistem manajemen franchise laundry yang mengintegrasikan:

Manajemen supplier
Pengadaan bahan
Operasional laundry
Monitoring outlet franchise
Dashboard KPI pusat

Tahap pertama yang dibuat hanya:

Landing Page
Admin Panel
Scope Tahap Pertama
Landing Page

Buat landing page modern, clean, responsive, dan profesional untuk sistem franchise laundry.

Section Landing Page
1. Navbar

Menu:

Home
Features
About
Contact
Login

Navbar sticky dengan efek blur saat scroll.

2. Hero Section

Isi:

Headline:
"Smart Franchise Laundry Management System"
Subheadline:
"Mengintegrasikan operasional laundry, supplier, franchise, dan monitoring outlet dalam satu platform terpusat."
CTA Button:
Get Started
View Demo

Tambahkan ilustrasi dashboard modern.

3. Features Section

Tampilkan card fitur:

Supplier Management
Inventory Management
Laundry Operations
Franchise Monitoring
KPI Dashboard
Reporting & Analytics

Gunakan icon modern.

4. About Section

Jelaskan tujuan WashHub:

Standardisasi operasional franchise
Monitoring outlet real-time
Efisiensi supply chain
Kontrol kualitas layanan
5. Statistics Section

Contoh statistik:

10+ Franchise Outlet
95% Stock Accuracy
40% Faster Procurement
Real-time KPI Monitoring
6. CTA Section

Ajakan menggunakan sistem:
"Transform Your Laundry Franchise Management"

7. Footer

Isi:

Company Info
Quick Links
Contact
Social Media
Admin Panel

Buat admin dashboard modern seperti SaaS ERP.

Layout Admin

Gunakan struktur:

Sidebar
Topbar
Main Content
Breadcrumb
Responsive drawer
Menu Sidebar
Dashboard
KPI Cards
Revenue Chart
Outlet Performance
Recent Activity
Supplier Management
Supplier List
Add/Edit/Delete Supplier
Inventory
Material Stock
Incoming Goods
Stock History
Laundry Operations
Washing Process
Machine Status
Service Schedule
Franchise Management
Outlet List
Franchise Contract
Royalty Monitoring
Reports
Operational Reports
KPI Reports
Export PDF/Excel
User Management
Admin
Staff Outlet
Roles & Permissions
Settings
Profile
System Settings
Backend Laravel Requirements

Gunakan:

Laravel terbaru
REST API
Repository Pattern
Service Layer
Request Validation
API Resource
Middleware Auth
Role Permission
Struktur Backend

Gunakan struktur berikut:

app/
├── Http/
│   ├── Controllers/
│   ├── Requests/
│   ├── Resources/
│
├── Models/
│
├── Repositories/
│   ├── Interfaces/
│   ├── Implementations/
│
├── Services/
│
├── Traits/
│
├── Helpers/
Struktur Frontend React

Gunakan struktur berikut:

src/
├── api/
├── assets/
├── components/
│   ├── ui/
│   ├── forms/
│   ├── cards/
│   ├── tables/
│
├── layouts/
│   ├── LandingLayout/
│   ├── AdminLayout/
│
├── pages/
│   ├── landing/
│   ├── admin/
│
├── routes/
├── hooks/
├── context/
├── services/
├── utils/
├── constants/
├── types/
Routing React

Gunakan React Router dengan route:

/
/about
/contact
/login

/admin/dashboard
/admin/suppliers
/admin/inventory
/admin/operations
/admin/franchise
/admin/reports
/admin/users
/admin/settings
UI Requirements

Gunakan:

TailwindCSS
Dark mode support
Reusable component
Clean card design
Soft shadow
Rounded modern UI
Responsive mobile-first
Skeleton loading
Toast notification
Dashboard Requirements

Dashboard admin harus memiliki:

KPI cards
Revenue analytics chart
Outlet activity
Machine status monitoring
Inventory alerts
Franchise performance table

Gunakan:

Recharts / ApexCharts
Authentication

Buat:

Login
Logout
Protected Routes
Role-based Access

Role:

Super Admin
Franchise Manager
Outlet Staff
API Standard

Gunakan response format:

{
  "success": true,
  "message": "Data retrieved successfully",
  "data": []
}

Error format:

{
  "success": false,
  "message": "Validation failed",
  "errors": {}
}
Coding Standard

Wajib:

SOLID Principle
DRY
Clean Code
Reusable Components
Consistent naming
Service abstraction
No hardcoded values
Use environment config
Use constants folder
Output yang Diharapkan

Generate:

Struktur folder project lengkap
Setup backend Laravel
Setup frontend React
Landing page modern
Admin dashboard modern
API authentication
Dummy data dashboard
Responsive UI
Reusable component architecture
Base repository implementation
Tambahan Penting
Pisahkan layout ke folder layouts
Pisahkan reusable component
Gunakan custom hooks
Gunakan service untuk API call
Gunakan repository untuk database logic
Jangan campur business logic di controller
gunakan request folder
Controller hanya menangani logika bisnis saja
Semua logic bisnis masuk ke service
Query database melalui repository
web harus responsive semua device