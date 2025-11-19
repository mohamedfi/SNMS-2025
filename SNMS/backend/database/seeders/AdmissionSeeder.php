<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Admission;

class AdmissionSeeder extends Seeder
{
    public function run(): void
    {
        $admissions = [
            [
                'student_name' => 'Ahmed Mohamed',
                'parent_name' => 'Mohamed Ali',
                'email' => 'mohamed.ali@email.com',
                'phone' => '123-456-7890',
                'date_of_birth' => '2020-03-15',
                'grade_level' => 'Pre-KG',
                'admission_date' => '2025-09-01',
                'status' => 'pending',
                'notes' => 'Interested in morning classes',
            ],
            [
                'student_name' => 'Fatima Hassan',
                'parent_name' => 'Hassan Ibrahim',
                'email' => 'hassan.ibrahim@email.com',
                'phone' => '123-456-7891',
                'date_of_birth' => '2019-07-22',
                'grade_level' => 'KG1',
                'admission_date' => '2025-09-01',
                'status' => 'approved',
                'notes' => 'Brother already enrolled',
            ],
            [
                'student_name' => 'Omar Khalid',
                'parent_name' => 'Khalid Ahmed',
                'email' => 'khalid.ahmed@email.com',
                'phone' => '123-456-7892',
                'date_of_birth' => '2018-11-10',
                'grade_level' => 'KG2',
                'admission_date' => '2025-09-01',
                'status' => 'approved',
                'notes' => 'Transferred from another school',
            ],
        ];

        foreach ($admissions as $admission) {
            Admission::create($admission);
        }

        echo "Admissions seeded successfully!\n";
    }
}
