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
        // Create or update Admin User
        User::updateOrCreate(
            ['email' => 'admin@steps.com'],
            [
                'name' => 'Admin User',
                'password' => Hash::make('password123'),
                'role' => 'admin',
            ]
        );

        // Create or update Teacher User
        User::updateOrCreate(
            ['email' => 'sarah.johnson@steps.com'],
            [
                'name' => 'Sarah Johnson',
                'password' => Hash::make('teacher123'),
                'role' => 'teacher',
            ]
        );

        // Create or update Parent User
        User::updateOrCreate(
            ['email' => 'robert.smith@email.com'],
            [
                'name' => 'Robert Smith',
                'password' => Hash::make('parent123'),
                'role' => 'parent',
            ]
        );

        echo "\n=================================\n";
        echo "Users created/updated successfully!\n";
        echo "=================================\n";
        echo "Admin: admin@steps.com / password123\n";
        echo "Teacher: sarah.johnson@steps.com / teacher123\n";
        echo "Parent: robert.smith@email.com / parent123\n";
        echo "=================================\n\n";
    }
}
