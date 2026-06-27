<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        $permissions = [
            'dashboard' => [
                ['name' => 'view-dashboard', 'description' => 'View dashboard'],
            ],
            'user-management' => [
                ['name' => 'view-users', 'description' => 'View users list'],
                ['name' => 'create-users', 'description' => 'Create new users'],
                ['name' => 'edit-users', 'description' => 'Edit existing users'],
                ['name' => 'delete-users', 'description' => 'Delete users'],
            ],
            'role-management' => [
                ['name' => 'view-roles', 'description' => 'View roles list'],
                ['name' => 'create-roles', 'description' => 'Create new roles'],
                ['name' => 'edit-roles', 'description' => 'Edit existing roles'],
                ['name' => 'delete-roles', 'description' => 'Delete roles'],
            ],
            'master-data' => [
                ['name' => 'view-kategori-bahan', 'description' => 'View kategori bahan list'],
                ['name' => 'create-kategori-bahan', 'description' => 'Create kategori bahan'],
                ['name' => 'edit-kategori-bahan', 'description' => 'Edit kategori bahan'],
                ['name' => 'delete-kategori-bahan', 'description' => 'Delete kategori bahan'],
                ['name' => 'view-bahan-baku', 'description' => 'View bahan baku list'],
                ['name' => 'create-bahan-baku', 'description' => 'Create bahan baku'],
                ['name' => 'edit-bahan-baku', 'description' => 'Edit bahan baku'],
                ['name' => 'delete-bahan-baku', 'description' => 'Delete bahan baku'],
                ['name' => 'view-mesin', 'description' => 'View mesin list'],
                ['name' => 'create-mesin', 'description' => 'Create mesin'],
                ['name' => 'edit-mesin', 'description' => 'Edit mesin'],
                ['name' => 'delete-mesin', 'description' => 'Delete mesin'],
                ['name' => 'view-jenis-layanan', 'description' => 'View jenis layanan list'],
                ['name' => 'create-jenis-layanan', 'description' => 'Create jenis layanan'],
                ['name' => 'edit-jenis-layanan', 'description' => 'Edit jenis layanan'],
                ['name' => 'delete-jenis-layanan', 'description' => 'Delete jenis layanan'],
                ['name' => 'view-komposisi-bahan', 'description' => 'View komposisi bahan'],
                ['name' => 'create-komposisi-bahan', 'description' => 'Create komposisi bahan'],
                ['name' => 'edit-komposisi-bahan', 'description' => 'Edit komposisi bahan'],
                ['name' => 'delete-komposisi-bahan', 'description' => 'Delete komposisi bahan'],
            ],
            'outlet' => [
                ['name' => 'view-outlets', 'description' => 'View outlets list'],
                ['name' => 'create-outlets', 'description' => 'Create new outlet'],
                ['name' => 'edit-outlets', 'description' => 'Edit existing outlet'],
                ['name' => 'delete-outlets', 'description' => 'Delete outlet'],
            ],
            'supplier' => [
                ['name' => 'view-suppliers', 'description' => 'View suppliers list'],
                ['name' => 'create-suppliers', 'description' => 'Create new supplier'],
                ['name' => 'edit-suppliers', 'description' => 'Edit existing supplier'],
                ['name' => 'delete-suppliers', 'description' => 'Delete supplier'],
            ],
            'purchase-order' => [
                ['name' => 'view-purchase-orders', 'description' => 'View purchase orders'],
                ['name' => 'create-purchase-orders', 'description' => 'Create purchase order'],
                ['name' => 'edit-purchase-orders', 'description' => 'Edit draft purchase order'],
                ['name' => 'delete-purchase-orders', 'description' => 'Delete draft purchase order'],
                ['name' => 'send-purchase-orders', 'description' => 'Send purchase order to supplier'],
                ['name' => 'approve-purchase-orders', 'description' => 'Approve purchase order (supplier)'],
                ['name' => 'reject-purchase-orders', 'description' => 'Reject purchase order (supplier)'],
            ],
            'receiving' => [
                ['name' => 'view-receivings', 'description' => 'View receivings'],
                ['name' => 'create-receivings', 'description' => 'Create receiving (receive goods)'],
            ],
            'distribution' => [
                ['name' => 'view-distributions', 'description' => 'View distributions'],
                ['name' => 'create-distributions', 'description' => 'Create distribution'],
                ['name' => 'confirm-distributions', 'description' => 'Confirm distribution (outlet)'],
            ],
            'inventory' => [
                ['name' => 'view-stock', 'description' => 'View stock inventory'],
                ['name' => 'view-stock-mutasi', 'description' => 'View stock mutations'],
                ['name' => 'manage-minimum-stock', 'description' => 'Manage minimum stock settings'],
            ],
            'status' => [
                ['name' => 'view-statuses', 'description' => 'View status master'],
            ],
            'notification' => [
                ['name' => 'view-notifications', 'description' => 'View notifications'],
                ['name' => 'mark-notifications', 'description' => 'Mark notifications as read'],
            ],
            'report' => [
                ['name' => 'view-reports', 'description' => 'View reports'],
                ['name' => 'export-reports', 'description' => 'Export reports'],
            ],
            'setting' => [
                ['name' => 'view-settings', 'description' => 'View system settings'],
                ['name' => 'manage-settings', 'description' => 'Manage system settings'],
            ],
        ];

        // Create all permissions
        foreach ($permissions as $group => $groupPermissions) {
            foreach ($groupPermissions as $permission) {
                Permission::create([
                    'name' => $permission['name'],
                    'description' => $permission['description'],
                    'group' => $group,
                    'guard_name' => 'web',
                ]);
            }
        }

        // ============ ROLES ============

        // 1. IT (Super Admin) - Full access
        $it = Role::create([
            'name' => 'IT',
            'guard_name' => 'web',
            'description' => 'Full access to all system features',
        ]);
        $it->givePermissionTo(Permission::all());

        // 2. Franchisor - Master data, service, machine
        $franchisor = Role::create([
            'name' => 'Franchisor',
            'guard_name' => 'web',
            'description' => 'Manage master data, services, and machines',
        ]);
        $franchisor->givePermissionTo([
            'view-dashboard',
            // Master data full access
            'view-kategori-bahan', 'create-kategori-bahan', 'edit-kategori-bahan', 'delete-kategori-bahan',
            'view-bahan-baku', 'create-bahan-baku', 'edit-bahan-baku', 'delete-bahan-baku',
            'view-mesin', 'create-mesin', 'edit-mesin', 'delete-mesin',
            'view-jenis-layanan', 'create-jenis-layanan', 'edit-jenis-layanan', 'delete-jenis-layanan',
            'view-komposisi-bahan', 'create-komposisi-bahan', 'edit-komposisi-bahan', 'delete-komposisi-bahan',
            // Outlet view
            'view-outlets',
            // Status view
            'view-statuses',
            // Reports
            'view-reports', 'export-reports',
        ]);

        // 3. Tim Pengadaan - Supplier, PO, Receiving, Distribution, Stock view
        $timPengadaan = Role::create([
            'name' => 'Tim Pengadaan',
            'guard_name' => 'web',
            'description' => 'Manage procurement and supply chain',
        ]);
        $timPengadaan->givePermissionTo([
            'view-dashboard',
            // Suppliers full
            'view-suppliers', 'create-suppliers', 'edit-suppliers', 'delete-suppliers',
            // Purchase Orders full
            'view-purchase-orders', 'create-purchase-orders', 'edit-purchase-orders',
            'delete-purchase-orders', 'send-purchase-orders',
            // Receiving
            'view-receivings', 'create-receivings',
            // Distribution
            'view-distributions', 'create-distributions',
            // Stock view only
            'view-stock', 'view-stock-mutasi',
            // Status
            'view-statuses',
            // Notifications
            'view-notifications',
            // Master data view
            'view-kategori-bahan', 'view-bahan-baku', 'view-mesin', 'view-jenis-layanan', 'view-komposisi-bahan',
        ]);

        // 4. Supplier - View own PO, approve/reject
        $supplier = Role::create([
            'name' => 'Supplier',
            'guard_name' => 'web',
            'description' => 'View and respond to purchase orders',
        ]);
        $supplier->givePermissionTo([
            'view-purchase-orders',
            'approve-purchase-orders',
            'reject-purchase-orders',
            'view-notifications',
        ]);

        // 5. Manajer Outlet - Outlet operations
        $manajerOutlet = Role::create([
            'name' => 'Manajer Outlet',
            'guard_name' => 'web',
            'description' => 'Manage daily outlet operations',
        ]);
        $manajerOutlet->givePermissionTo([
            'view-dashboard',
            // Stock view
            'view-stock', 'view-stock-mutasi', 'manage-minimum-stock',
            // Distribution
            'view-distributions', 'confirm-distributions',
            // Master data view
            'view-kategori-bahan', 'view-bahan-baku', 'view-mesin', 'view-jenis-layanan',
            // Notifications
            'view-notifications', 'mark-notifications',
            // Receiving view
            'view-receivings',
        ]);

        $this->command->info('Roles and permissions seeded successfully.');
    }
}
