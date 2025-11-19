<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Transaction;
use App\Models\Student;

class TransactionSeeder extends Seeder
{
    public function run(): void
    {
        // Get first student if exists
        $student = Student::first();
        
        $transactions = [
            [
                'student_id' => $student ? $student->id : null,
                'transaction_type' => 'Tuition Fee',
                'amount' => 5000.00,
                'transaction_date' => '2025-11-01',
                'payment_method' => 'bank_transfer',
                'status' => 'completed',
                'reference_number' => 'TXN-2025-001',
                'description' => 'Semester 1 tuition payment',
            ],
            [
                'student_id' => $student ? $student->id : null,
                'transaction_type' => 'Registration Fee',
                'amount' => 500.00,
                'transaction_date' => '2025-09-01',
                'payment_method' => 'card',
                'status' => 'completed',
                'reference_number' => 'TXN-2025-002',
                'description' => 'Annual registration fee',
            ],
            [
                'student_id' => null,
                'transaction_type' => 'School Supplies',
                'amount' => 1200.00,
                'transaction_date' => '2025-10-15',
                'payment_method' => 'cash',
                'status' => 'completed',
                'reference_number' => 'TXN-2025-003',
                'description' => 'Bulk purchase of stationery',
            ],
            [
                'student_id' => $student ? $student->id : null,
                'transaction_type' => 'Activity Fee',
                'amount' => 300.00,
                'transaction_date' => '2025-11-15',
                'payment_method' => 'card',
                'status' => 'pending',
                'reference_number' => 'TXN-2025-004',
                'description' => 'Sports day participation fee',
            ],
        ];

        foreach ($transactions as $transaction) {
            Transaction::create($transaction);
        }

        echo "Transactions seeded successfully!\n";
    }
}
