<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BahanBakuController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\DistributionController;
use App\Http\Controllers\Api\JenisLayananController;
use App\Http\Controllers\Api\KategoriBahanController;
use App\Http\Controllers\Api\KomposisiBahanController;
use App\Http\Controllers\Api\MesinController;
use App\Http\Controllers\Api\MinimumStockController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\OutletController;
use App\Http\Controllers\Api\PermissionController;
use App\Http\Controllers\Api\PurchaseOrderController;
use App\Http\Controllers\Api\ReceivingController;
use App\Http\Controllers\Api\RoleController;
use App\Http\Controllers\Api\StatusController;
use App\Http\Controllers\Api\StockController;
use App\Http\Controllers\Api\SupplierController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Public routes
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth (no specific permission needed beyond auth)
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Dashboard
    Route::get('/dashboard/stats', [DashboardController::class, 'stats'])
        ->middleware('permission:view-dashboard');

    // ============ USER MANAGEMENT ============
    Route::middleware('permission:view-users')->group(function () {
        Route::get('users', [UserController::class, 'index']);
        Route::get('users/{id}', [UserController::class, 'show']);
    });
    Route::post('users', [UserController::class, 'store'])
        ->middleware('permission:create-users');
    Route::put('users/{id}', [UserController::class, 'update'])
        ->middleware('permission:edit-users');
    Route::patch('users/{id}', [UserController::class, 'update'])
        ->middleware('permission:edit-users');
    Route::delete('users/{id}', [UserController::class, 'destroy'])
        ->middleware('permission:delete-users');

    // ============ ROLE MANAGEMENT ============
    Route::middleware('permission:view-roles')->group(function () {
        Route::get('roles', [RoleController::class, 'index']);
        Route::get('roles/{id}', [RoleController::class, 'show']);
    });
    Route::post('roles', [RoleController::class, 'store'])
        ->middleware('permission:create-roles');
    Route::put('roles/{id}', [RoleController::class, 'update'])
        ->middleware('permission:edit-roles');
    Route::patch('roles/{id}', [RoleController::class, 'update'])
        ->middleware('permission:edit-roles');
    Route::delete('roles/{id}', [RoleController::class, 'destroy'])
        ->middleware('permission:delete-roles');

    // Permission Management
    Route::apiResource('permissions', PermissionController::class);

    // ============ MASTER DATA ============
    // Kategori Bahan
    Route::get('kategori-bahan/active', [KategoriBahanController::class, 'active'])
        ->middleware('permission:view-kategori-bahan');
    Route::middleware('permission:view-kategori-bahan')->group(function () {
        Route::get('kategori-bahan', [KategoriBahanController::class, 'index']);
        Route::get('kategori-bahan/{id}', [KategoriBahanController::class, 'show']);
    });
    Route::post('kategori-bahan', [KategoriBahanController::class, 'store'])
        ->middleware('permission:create-kategori-bahan');
    Route::put('kategori-bahan/{id}', [KategoriBahanController::class, 'update'])
        ->middleware('permission:edit-kategori-bahan');
    Route::patch('kategori-bahan/{id}', [KategoriBahanController::class, 'update'])
        ->middleware('permission:edit-kategori-bahan');
    Route::delete('kategori-bahan/{id}', [KategoriBahanController::class, 'destroy'])
        ->middleware('permission:delete-kategori-bahan');

    // Bahan Baku
    Route::get('bahan-baku/by-kategori/{kategoriId}', [BahanBakuController::class, 'byKategori'])
        ->middleware('permission:view-bahan-baku');
    Route::middleware('permission:view-bahan-baku')->group(function () {
        Route::get('bahan-baku', [BahanBakuController::class, 'index']);
        Route::get('bahan-baku/{id}', [BahanBakuController::class, 'show']);
    });
    Route::post('bahan-baku', [BahanBakuController::class, 'store'])
        ->middleware('permission:create-bahan-baku');
    Route::put('bahan-baku/{id}', [BahanBakuController::class, 'update'])
        ->middleware('permission:edit-bahan-baku');
    Route::patch('bahan-baku/{id}', [BahanBakuController::class, 'update'])
        ->middleware('permission:edit-bahan-baku');
    Route::delete('bahan-baku/{id}', [BahanBakuController::class, 'destroy'])
        ->middleware('permission:delete-bahan-baku');

    // Mesin
    Route::middleware('permission:view-mesin')->group(function () {
        Route::get('mesin', [MesinController::class, 'index']);
        Route::get('mesin/{id}', [MesinController::class, 'show']);
    });
    Route::post('mesin', [MesinController::class, 'store'])
        ->middleware('permission:create-mesin');
    Route::put('mesin/{id}', [MesinController::class, 'update'])
        ->middleware('permission:edit-mesin');
    Route::patch('mesin/{id}', [MesinController::class, 'update'])
        ->middleware('permission:edit-mesin');
    Route::delete('mesin/{id}', [MesinController::class, 'destroy'])
        ->middleware('permission:delete-mesin');

    // Jenis Layanan
    Route::middleware('permission:view-jenis-layanan')->group(function () {
        Route::get('jenis-layanan', [JenisLayananController::class, 'index']);
        Route::get('jenis-layanan/{id}', [JenisLayananController::class, 'show']);
    });
    Route::post('jenis-layanan', [JenisLayananController::class, 'store'])
        ->middleware('permission:create-jenis-layanan');
    Route::put('jenis-layanan/{id}', [JenisLayananController::class, 'update'])
        ->middleware('permission:edit-jenis-layanan');
    Route::patch('jenis-layanan/{id}', [JenisLayananController::class, 'update'])
        ->middleware('permission:edit-jenis-layanan');
    Route::delete('jenis-layanan/{id}', [JenisLayananController::class, 'destroy'])
        ->middleware('permission:delete-jenis-layanan');

    // Komposisi Bahan
    Route::get('komposisi-bahan/by-jenis-layanan/{jenisLayananId}', [KomposisiBahanController::class, 'byJenisLayanan'])
        ->middleware('permission:view-komposisi-bahan');
    Route::middleware('permission:view-komposisi-bahan')->group(function () {
        Route::get('komposisi-bahan', [KomposisiBahanController::class, 'index']);
        Route::get('komposisi-bahan/{id}', [KomposisiBahanController::class, 'show']);
    });
    Route::post('komposisi-bahan', [KomposisiBahanController::class, 'store'])
        ->middleware('permission:create-komposisi-bahan');
    Route::put('komposisi-bahan/{id}', [KomposisiBahanController::class, 'update'])
        ->middleware('permission:edit-komposisi-bahan');
    Route::patch('komposisi-bahan/{id}', [KomposisiBahanController::class, 'update'])
        ->middleware('permission:edit-komposisi-bahan');
    Route::delete('komposisi-bahan/{id}', [KomposisiBahanController::class, 'destroy'])
        ->middleware('permission:delete-komposisi-bahan');

    // ============ OUTLET & SUPPLIER ============
    Route::middleware('permission:view-outlets')->group(function () {
        Route::get('outlets', [OutletController::class, 'index']);
        Route::get('outlets/{id}', [OutletController::class, 'show']);
    });
    Route::post('outlets', [OutletController::class, 'store'])
        ->middleware('permission:create-outlets');
    Route::put('outlets/{id}', [OutletController::class, 'update'])
        ->middleware('permission:edit-outlets');
    Route::patch('outlets/{id}', [OutletController::class, 'update'])
        ->middleware('permission:edit-outlets');
    Route::delete('outlets/{id}', [OutletController::class, 'destroy'])
        ->middleware('permission:delete-outlets');

    Route::middleware('permission:view-suppliers')->group(function () {
        Route::get('suppliers', [SupplierController::class, 'index']);
        Route::get('suppliers/{id}', [SupplierController::class, 'show']);
    });
    Route::post('suppliers', [SupplierController::class, 'store'])
        ->middleware('permission:create-suppliers');
    Route::put('suppliers/{id}', [SupplierController::class, 'update'])
        ->middleware('permission:edit-suppliers');
    Route::patch('suppliers/{id}', [SupplierController::class, 'update'])
        ->middleware('permission:edit-suppliers');
    Route::delete('suppliers/{id}', [SupplierController::class, 'destroy'])
        ->middleware('permission:delete-suppliers');

    // ============ PURCHASE ORDER ============
    Route::middleware('permission:view-purchase-orders')->group(function () {
        Route::get('purchase-orders', [PurchaseOrderController::class, 'index']);
        Route::get('purchase-orders/{id}', [PurchaseOrderController::class, 'show']);
    });
    Route::post('purchase-orders', [PurchaseOrderController::class, 'store'])
        ->middleware('permission:create-purchase-orders');
    Route::put('purchase-orders/{id}', [PurchaseOrderController::class, 'update'])
        ->middleware('permission:edit-purchase-orders');
    Route::patch('purchase-orders/{id}', [PurchaseOrderController::class, 'update'])
        ->middleware('permission:edit-purchase-orders');
    Route::delete('purchase-orders/{id}', [PurchaseOrderController::class, 'destroy'])
        ->middleware('permission:delete-purchase-orders');
    Route::post('purchase-orders/{id}/send', [PurchaseOrderController::class, 'send'])
        ->middleware('permission:send-purchase-orders');
    Route::post('purchase-orders/{id}/approve', [PurchaseOrderController::class, 'approve'])
        ->middleware('permission:approve-purchase-orders');
    Route::post('purchase-orders/{id}/reject', [PurchaseOrderController::class, 'reject'])
        ->middleware('permission:reject-purchase-orders');

    // ============ RECEIVING ============
    Route::middleware('permission:view-receivings')->group(function () {
        Route::get('receivings', [ReceivingController::class, 'index']);
        Route::get('receivings/{id}', [ReceivingController::class, 'show']);
    });
    Route::post('receivings', [ReceivingController::class, 'store'])
        ->middleware('permission:create-receivings');
    Route::delete('receivings/{id}', [ReceivingController::class, 'destroy'])
        ->middleware('permission:create-receivings');

    // ============ DISTRIBUTION ============
    Route::middleware('permission:view-distributions')->group(function () {
        Route::get('distributions', [DistributionController::class, 'index']);
        Route::get('distributions/{id}', [DistributionController::class, 'show']);
    });
    Route::post('distributions', [DistributionController::class, 'store'])
        ->middleware('permission:create-distributions');
    Route::post('distributions/{id}/confirm', [DistributionController::class, 'confirm'])
        ->middleware('permission:confirm-distributions');

    // ============ INVENTORY / STOCK ============
    Route::middleware('permission:view-stock')->group(function () {
        Route::get('stock', [StockController::class, 'index']);
        Route::get('stock/low-stock', [StockController::class, 'lowStock']);
    });
    Route::get('stock/mutasi', [StockController::class, 'mutasi'])
        ->middleware('permission:view-stock-mutasi');

    // Minimum Stock
    Route::middleware('permission:manage-minimum-stock')->group(function () {
        Route::get('minimum-stock', [MinimumStockController::class, 'index']);
        Route::post('minimum-stock', [MinimumStockController::class, 'store']);
        Route::delete('minimum-stock/{id}', [MinimumStockController::class, 'destroy']);
    });

    // ============ STATUS ============
    Route::middleware('permission:view-statuses')->group(function () {
        Route::get('statuses', [StatusController::class, 'index']);
        Route::get('statuses/by-group/{grup}', [StatusController::class, 'byGroup']);
    });

    // ============ NOTIFICATIONS ============
    Route::middleware('permission:view-notifications')->group(function () {
        Route::get('notifications', [NotificationController::class, 'index']);
        Route::get('notifications/unread-count', [NotificationController::class, 'unreadCount']);
    });
    Route::middleware('permission:mark-notifications')->group(function () {
        Route::post('notifications/{id}/read', [NotificationController::class, 'markRead']);
        Route::post('notifications/mark-all-read', [NotificationController::class, 'markAllRead']);
    });
});
