<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Define permissions grouped by module
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
            'supplier' => [
                ['name' => 'view-suppliers', 'description' => 'View suppliers list'],
                ['name' => 'create-suppliers', 'description' => 'Create new suppliers'],
                ['name' => 'edit-suppliers', 'description' => 'Edit existing suppliers'],
                ['name' => 'delete-suppliers', 'description' => 'Delete suppliers'],
            ],
            'inventory' => [
                ['name' => 'view-inventory', 'description' => 'View inventory'],
                ['name' => 'manage-inventory', 'description' => 'Manage inventory stock'],
            ],
            'operation' => [
                ['name' => 'view-operations', 'description' => 'View laundry operations'],
                ['name' => 'manage-operations', 'description' => 'Manage laundry operations'],
            ],
            'franchise' => [
                ['name' => 'view-franchise', 'description' => 'View franchise outlets'],
                ['name' => 'manage-franchise', 'description' => 'Manage franchise outlets'],
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

        // Create roles and assign permissions
        $superAdmin = Role::create([
            'name' => 'Super Admin',
            'guard_name' => 'web',
            'description' => 'Full access to all system features',
        ]);
        $superAdmin->givePermissionTo(Permission::all());

        $franchiseManager = Role::create([
            'name' => 'Franchise Manager',
            'guard_name' => 'web',
            'description' => 'Manage franchise operations and monitoring',
        ]);
        $franchiseManager->givePermissionTo([
            'view-dashboard',
            'view-users',
            'view-suppliers',
            'view-inventory',
            'view-operations',
            'manage-operations',
            'view-franchise',
            'manage-franchise',
            'view-reports',
            'export-reports',
            'view-settings',
        ]);

        $outletStaff = Role::create([
            'name' => 'Outlet Staff',
            'guard_name' => 'web',
            'description' => 'Basic access for outlet daily operations',
        ]);
        $outletStaff->givePermissionTo([
            'view-dashboard',
            'view-inventory',
            'view-operations',
            'manage-operations',
            'view-settings',
        ]);
    }
}
