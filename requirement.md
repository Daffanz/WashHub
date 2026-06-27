Backend PRD WashHub (Modul 1–4)
Bagian 1
Executive Summary
Scope
Existing System Analysis
Tech Stack
Project Architecture
Authentication Existing (Laravel Auth + Sanctum)
Spatie Permission Existing
Admin Panel Existing
Folder Structure
Bagian 2

Analisis Database

Setiap tabel dijelaskan:

Purpose
Relation
Constraint
Business Rule
CRUD yang menggunakannya
Index yang diperlukan

Misalnya

purchase_order

Purpose:
Menyimpan header Purchase Order.

Relation:
purchase_order_item_bahan_baku
purchase_order_item_mesin
status

Business Rule:
- Draft dapat diedit
- Dikirim tidak dapat diedit
- Harus memiliki minimal 1 item sebelum dikirim
Bagian 3

Status Master

Semua status akan dibuatkan mapping.

Misalnya

STATUS PURCHASE ORDER

DRAFT

DIKIRIM

DITERIMA_SUPPLIER

DITOLAK_SUPPLIER

SELESAI
STATUS MESIN

DI_GUDANG

DIKIRIM

AKTIF

SERVICE

RUSAK

dan seterusnya.

Bagian 4

Modul 1

Untuk setiap fitur akan dibuat:

Flow
Business Rules
Validation
API
Permission
Database
Service
Repository
Transaction
Error Handling
Response JSON
Bagian 5

Modul 2

Master Data

Kategori
Bahan Baku
Mesin
Jenis Layanan
Komposisi Bahan

Semuanya lengkap.

Bagian 6

Modul 3

Purchase Order

Receiving

Distribution

Stock Update

Flow lengkap.

Bagian 7

Modul 4

Inventory

Mutasi

Minimum Stock

Notification

Bagian 8

API Documentation

Semua endpoint.

Contoh

POST

/api/purchase-orders
GET

/api/purchase-orders
PATCH

/api/purchase-orders/{id}/send

dst.

Lengkap dengan

Request

Response

Validation

Permission

Bagian 9

Service Layer

Contoh

PurchaseOrderService

create()

update()

addItem()

send()

approve()

reject()

dst.

Bagian 10

Laravel Transaction

Semua transaksi yang wajib menggunakan

DB::transaction()

Misalnya

Receiving Barang

↓

Insert Header

↓

Insert Detail

↓

Update Stock

↓

Insert Mutasi

↓

Commit

Rollback jika gagal.

Bagian 11

Event & Listener

Misalnya

PurchaseOrderSent

↓

Send Notification
GoodsReceived

↓

Update Stock
DistributionConfirmed

↓

Update Outlet Stock
Bagian 12

Permission Spatie

Role

IT

Permission

user.create

user.update

user.delete

Role

Tim Pengadaan

Permission

supplier.*

purchase-order.*

receiving.*

distribution.*

stock.view

Role

Supplier

Permission

purchase-order.view-own

purchase-order.approve

purchase-order.reject

Role

Franchisor

Permission

master.*

service.*

machine.*


Semua permission akan dibuat satu per satu.

Bagian 13

Seeder

Nah ini menurut saya WAJIB.

Jadi bukan cuma migration.

Saya akan buatkan seluruh seeder.

Contoh

RoleSeeder
IT

Franchisor

Tim Pengadaan

Supplier

Manajer Outlet
PermissionSeeder

Semua permission Spatie.

Kurang lebih 70–100 permission.

StatusSeeder

Misalnya

purchase_order

DRAFT

DIKIRIM

DITERIMA

DITOLAK

SELESAI
outlet

AKTIF

NONAKTIF
mesin

DI_GUDANG

DIKIRIM

AKTIF

SERVICE

RUSAK
OutletSeeder
Pusat

Outlet Surabaya

Outlet Malang

Outlet Sidoarjo
KategoriBahanSeeder
Detergen

Pewangi

Pembersih

Pengemas
BahanBakuSeeder

Contoh data awal.

Detergen Liquid

Softener

Pewangi Sakura

Kantong Laundry

Label
MesinSeeder
Mesin Cuci 15 Kg

Mesin Cuci 20 Kg

Dryer

Steam Boiler
JenisLayananSeeder
Cuci Reguler

Cuci Express

Dry Cleaning

Setrika
JenisLayananBahanSeeder

Sekalian dibuatkan komposisinya.

Misalnya

Cuci Reguler

Detergen

0.02

Softener

0.01
AdminSeeder

Sudah ada.

Kalau belum saya tambahkan.

Bagian 14

Postman Collection

Ini juga saya buatkan.

Bukan hanya list endpoint.

Tetapi langsung file

WashHub Backend.postman_collection.json

Berisi

Folder

Auth

Master

Supplier

Purchase Order

Receiving

Distribution

Stock

Di dalamnya sudah ada:

✅ Login

✅ Refresh Token (jika ada)

✅ Semua CRUD

✅ Kirim PO

✅ Approve PO

✅ Reject PO

✅ Receive Barang

✅ Distribusi

✅ Konfirmasi Outlet

Semua menggunakan variable.

Misalnya

{{base_url}}

{{token}}

{{supplier_id}}

{{po_id}}

{{outlet_id}}

Jadi tinggal import.

Bagian 15

Environment Postman

Saya juga akan buatkan

WashHub.postman_environment.json

Isi

base_url

token

admin_token

supplier_token

po_id

supplier_id

outlet_id

Jadi tidak perlu edit manual.

Bagian 16

Test Case API

Ini yang sering dilupakan.

Saya akan buatkan tabel pengujian seperti berikut.

No	Endpoint	Skenario	Expected
1	POST /login	Login valid	200
2	POST /login	Password salah	401
3	POST /supplier	Nama kosong	422
4	POST /supplier	Berhasil	201
5	POST /purchase-orders	Tanpa item	422
6	PATCH /purchase-orders/send	Berhasil	200
7	PATCH /purchase-orders/send	Status bukan Draft	400
8	PATCH /purchase-orders/{id}/approve	Supplier lain mencoba approve	403
9	POST /receiving	Qty melebihi PO	422
10	POST /distribution	Stok pusat tidak cukup	422
11	PATCH /distribution/{id}/confirm	Berhasil	200

Targetnya sekitar 100–150 test case yang mencakup seluruh Modul 1–4, termasuk validasi, otorisasi (Spatie), alur bisnis, dan skenario gagal.

Deliverables akhir

Dokumen yang dihasilkan akan terdiri dari:

Backend PRD + Technical Design Document (TDD) (±150–250 halaman jika diekspor ke PDF).
ERD final yang sudah disesuaikan dengan Modul 1–4.
Database schema & migration mapping.
Seeder plan beserta data master awal (roles, permissions, status, outlet, kategori, bahan baku, mesin, jenis layanan, dan komposisi).
Spatie Role & Permission matrix.
REST API Specification lengkap.
Postman Collection (.postman_collection.json) siap diimpor.
Postman Environment (.postman_environment.json).
API Test Case lengkap (happy path, validation, authorization, dan business rule).
Development checklist & roadmap sehingga backend bisa dikerjakan modul demi modul tanpa perlu mengubah desain di tengah jalan.