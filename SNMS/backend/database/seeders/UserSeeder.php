<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create Admin User
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@steps.com',
            'password' => Hash::make('password123'),
            'role' => 'admin',
        ]);

        // Create Teacher User
        User::create([
            'name' => 'Sarah Johnson',
            'email' => 'sarah.johnson@steps.com',
            'password' => Hash::make('teacher123'),
            'role' => 'teacher',
            'teacher_id' => 1, // Link to first teacher if exists
        ]);

        // Create Parent User
        User::create([
            'name' => 'Robert Smith',
            'email' => 'robert.smith@email.com',
            'password' => Hash::make('parent123'),
            'role' => 'parent',
            'student_id' => 1, // Link to first student if exists
        ]);

        echo "Users created successfully!\n";
        echo "Admin: admin@steps.com / password123\n";
        echo "Teacher: sarah.johnson@steps.com / teacher123\n";
        echo "Parent: robert.smith@email.com / parent123\n";
    }
}
