<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;
use App\Models\Permission;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeder.
     */
    public function run(): void
    {
        // Create Roles
        $admin = Role::create([
            'name' => 'admin',
            'display_name' => 'Administrator',
            'description' => 'Full system access with all permissions'
        ]);

        $teacher = Role::create([
            'name' => 'teacher',
            'display_name' => 'Teacher',
            'description' => 'Can manage students, attendance, and view reports'
        ]);

        $parent = Role::create([
            'name' => 'parent',
            'display_name' => 'Parent',
            'description' => 'Can view their child information and attendance'
        ]);

        // Create Permissions
        $permissions = [
            // Dashboard permissions
            ['name' => 'view_dashboard', 'display_name' => 'View Dashboard', 'module' => 'dashboard'],
            ['name' => 'view_analytics', 'display_name' => 'View Analytics', 'module' => 'dashboard'],

            // Student permissions
            ['name' => 'view_students', 'display_name' => 'View Students', 'module' => 'students'],
            ['name' => 'create_students', 'display_name' => 'Create Students', 'module' => 'students'],
            ['name' => 'edit_students', 'display_name' => 'Edit Students', 'module' => 'students'],
            ['name' => 'delete_students', 'display_name' => 'Delete Students', 'module' => 'students'],

            // Teacher permissions
            ['name' => 'view_teachers', 'display_name' => 'View Teachers', 'module' => 'teachers'],
            ['name' => 'create_teachers', 'display_name' => 'Create Teachers', 'module' => 'teachers'],
            ['name' => 'edit_teachers', 'display_name' => 'Edit Teachers', 'module' => 'teachers'],
            ['name' => 'delete_teachers', 'display_name' => 'Delete Teachers', 'module' => 'teachers'],

            // Attendance permissions
            ['name' => 'view_attendance', 'display_name' => 'View Attendance', 'module' => 'attendance'],
            ['name' => 'create_attendance', 'display_name' => 'Create Attendance', 'module' => 'attendance'],
            ['name' => 'edit_attendance', 'display_name' => 'Edit Attendance', 'module' => 'attendance'],
            ['name' => 'delete_attendance', 'display_name' => 'Delete Attendance', 'module' => 'attendance'],

            // Admissions permissions
            ['name' => 'view_admissions', 'display_name' => 'View Admissions', 'module' => 'admissions'],
            ['name' => 'create_admissions', 'display_name' => 'Create Admissions', 'module' => 'admissions'],
            ['name' => 'edit_admissions', 'display_name' => 'Edit Admissions', 'module' => 'admissions'],
            ['name' => 'delete_admissions', 'display_name' => 'Delete Admissions', 'module' => 'admissions'],

            // Settings permissions
            ['name' => 'view_settings', 'display_name' => 'View Settings', 'module' => 'settings'],
            ['name' => 'manage_roles', 'display_name' => 'Manage Roles', 'module' => 'settings'],
            ['name' => 'manage_permissions', 'display_name' => 'Manage Permissions', 'module' => 'settings'],
        ];

        foreach ($permissions as $permissionData) {
            Permission::create($permissionData);
        }

        // Assign permissions to roles
        // Admin gets all permissions
        $admin->permissions()->attach(Permission::all());

        // Teacher gets limited permissions
        $teacher->permissions()->attach(Permission::whereIn('name', [
            'view_dashboard',
            'view_students',
            'view_attendance',
            'create_attendance',
            'edit_attendance',
            'view_admissions',
        ])->get());

        // Parent gets very limited permissions
        $parent->permissions()->attach(Permission::whereIn('name', [
            'view_dashboard',
            'view_students',
            'view_attendance',
        ])->get());
    }
}
