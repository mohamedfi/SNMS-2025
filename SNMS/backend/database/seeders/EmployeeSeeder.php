<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Employee;

class EmployeeSeeder extends Seeder
{
    public function run(): void
    {
        $employees = [
            [
                'name' => 'Sarah Johnson',
                'email' => 'sarah.j@steps.com',
                'phone' => '555-0101',
                'position' => 'Lead Teacher',
                'department' => 'Education',
                'hire_date' => '2023-01-15',
                'salary' => 45000.00,
                'employment_type' => 'full_time',
                'status' => 'active',
                'address' => '123 Main St, Dubai',
            ],
            [
                'name' => 'Ahmed Al-Rashid',
                'email' => 'ahmed.r@steps.com',
                'phone' => '555-0102',
                'position' => 'Assistant Teacher',
                'department' => 'Education',
                'hire_date' => '2023-06-01',
                'salary' => 35000.00,
                'employment_type' => 'full_time',
                'status' => 'active',
                'address' => '456 Park Ave, Dubai',
            ],
            [
                'name' => 'Layla Hassan',
                'email' => 'layla.h@steps.com',
                'phone' => '555-0103',
                'position' => 'Receptionist',
                'department' => 'Administration',
                'hire_date' => '2024-01-10',
                'salary' => 25000.00,
                'employment_type' => 'full_time',
                'status' => 'active',
                'address' => '789 School Rd, Dubai',
            ],
            [
                'name' => 'Omar Khalifa',
                'email' => 'omar.k@steps.com',
                'phone' => '555-0104',
                'position' => 'IT Support',
                'department' => 'Technology',
                'hire_date' => '2023-09-15',
                'salary' => 40000.00,
                'employment_type' => 'part_time',
                'status' => 'active',
                'address' => '321 Tech Blvd, Dubai',
            ],
        ];

        foreach ($employees as $employee) {
            Employee::create($employee);
        }

        echo "Employees seeded successfully!\n";
    }
}
