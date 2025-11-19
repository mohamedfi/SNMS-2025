<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Student;
use App\Models\Teacher;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create Admin User
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@steps.com',
            'password' => Hash::make('password123'),
            'role' => 'admin',
        ]);

        echo "✓ Admin created - Email: admin@steps.com, Password: password123\n";

        // Create Sample Teachers
        $teachers = [
            [
                'first_name' => 'Sarah',
                'last_name' => 'Johnson',
                'email' => 'sarah.johnson@steps.com',
                'phone' => '+971-50-123-4567',
                'employee_id' => 'T001',
                'date_of_birth' => '1985-03-15',
                'gender' => 'female',
                'hire_date' => '2020-09-01',
                'status' => 'active',
                'qualification' => 'Bachelor of Education',
                'years_of_experience' => 8,
                'specialization' => 'Early Childhood Education',
                'certifications' => 'Montessori Certification, First Aid',
                'address' => 'Dubai, UAE',
                'emergency_contact_name' => 'John Johnson',
                'emergency_contact_phone' => '+971-50-123-4568',
                'emergency_contact_relation' => 'Spouse',
                'employment_type' => 'full_time',
                'salary' => 12000.00,
                'class_assigned' => 'KG1-A',
            ],
            [
                'first_name' => 'Michael',
                'last_name' => 'Brown',
                'email' => 'michael.brown@steps.com',
                'phone' => '+971-50-234-5678',
                'employee_id' => 'T002',
                'date_of_birth' => '1990-07-22',
                'gender' => 'male',
                'hire_date' => '2021-01-15',
                'status' => 'active',
                'qualification' => 'Master of Arts in Teaching',
                'years_of_experience' => 5,
                'specialization' => 'Physical Education',
                'certifications' => 'CPR Certified, Sports Coaching',
                'address' => 'Sharjah, UAE',
                'emergency_contact_name' => 'Emily Brown',
                'emergency_contact_phone' => '+971-50-234-5679',
                'emergency_contact_relation' => 'Sibling',
                'employment_type' => 'full_time',
                'salary' => 11000.00,
                'class_assigned' => 'KG2-B',
            ],
            [
                'first_name' => 'Aisha',
                'last_name' => 'Ahmed',
                'email' => 'aisha.ahmed@steps.com',
                'phone' => '+971-50-345-6789',
                'employee_id' => 'T003',
                'date_of_birth' => '1988-11-10',
                'gender' => 'female',
                'hire_date' => '2019-08-01',
                'status' => 'active',
                'qualification' => 'Bachelor in Child Psychology',
                'years_of_experience' => 10,
                'specialization' => 'Special Needs Education',
                'certifications' => 'SENCO Certified, Child Psychology',
                'address' => 'Abu Dhabi, UAE',
                'emergency_contact_name' => 'Mohammed Ahmed',
                'emergency_contact_phone' => '+971-50-345-6780',
                'emergency_contact_relation' => 'Spouse',
                'employment_type' => 'full_time',
                'salary' => 13000.00,
                'class_assigned' => 'Nursery-A',
            ],
        ];

        $createdTeachers = [];
        foreach ($teachers as $teacherData) {
            $teacher = Teacher::create($teacherData);
            $createdTeachers[] = $teacher;

            // Create user account for each teacher
            User::create([
                'name' => $teacher->first_name . ' ' . $teacher->last_name,
                'email' => $teacher->email,
                'password' => Hash::make('teacher123'),
                'role' => 'teacher',
                'teacher_id' => $teacher->id,
            ]);

            echo "✓ Teacher created - {$teacher->first_name} {$teacher->last_name} (Email: {$teacher->email}, Password: teacher123)\n";
        }

        // Create Sample Students
        $students = [
            [
                'first_name' => 'Emma',
                'last_name' => 'Smith',
                'date_of_birth' => '2020-05-12',
                'gender' => 'female',
                'student_id' => 'S001',
                'enrollment_date' => '2023-09-01',
                'status' => 'active',
                'parent_name' => 'Robert Smith',
                'parent_phone' => '+971-50-111-2222',
                'parent_email' => 'robert.smith@email.com',
                'address' => 'Villa 123, Al Barsha, Dubai, UAE',
                'emergency_contact_name' => 'Lisa Smith',
                'emergency_contact_phone' => '+971-50-111-3333',
                'emergency_contact_relation' => 'Mother',
                'medical_conditions' => 'None',
                'allergies' => 'Peanuts',
                'blood_type' => 'O+',
                'class_assigned' => 'KG1-A',
            ],
            [
                'first_name' => 'Omar',
                'last_name' => 'Al-Hassan',
                'date_of_birth' => '2019-08-20',
                'gender' => 'male',
                'student_id' => 'S002',
                'enrollment_date' => '2023-09-01',
                'status' => 'active',
                'parent_name' => 'Hassan Al-Hassan',
                'parent_phone' => '+971-50-222-3333',
                'parent_email' => 'hassan.alhassan@email.com',
                'address' => 'Apartment 456, Jumeirah, Dubai, UAE',
                'emergency_contact_name' => 'Fatima Al-Hassan',
                'emergency_contact_phone' => '+971-50-222-4444',
                'emergency_contact_relation' => 'Mother',
                'medical_conditions' => 'Asthma (mild)',
                'allergies' => 'None',
                'blood_type' => 'A+',
                'class_assigned' => 'KG2-B',
            ],
            [
                'first_name' => 'Sophia',
                'last_name' => 'Chen',
                'date_of_birth' => '2021-02-14',
                'gender' => 'female',
                'student_id' => 'S003',
                'enrollment_date' => '2023-09-01',
                'status' => 'active',
                'parent_name' => 'Wei Chen',
                'parent_phone' => '+971-50-333-4444',
                'parent_email' => 'wei.chen@email.com',
                'address' => 'Villa 789, Arabian Ranches, Dubai, UAE',
                'emergency_contact_name' => 'Mei Chen',
                'emergency_contact_phone' => '+971-50-333-5555',
                'emergency_contact_relation' => 'Mother',
                'medical_conditions' => 'None',
                'allergies' => 'Lactose intolerant',
                'blood_type' => 'B+',
                'class_assigned' => 'Nursery-A',
            ],
            [
                'first_name' => 'Liam',
                'last_name' => 'Williams',
                'date_of_birth' => '2020-11-03',
                'gender' => 'male',
                'student_id' => 'S004',
                'enrollment_date' => '2023-09-01',
                'status' => 'active',
                'parent_name' => 'David Williams',
                'parent_phone' => '+971-50-444-5555',
                'parent_email' => 'david.williams@email.com',
                'address' => 'Townhouse 234, The Springs, Dubai, UAE',
                'emergency_contact_name' => 'Sarah Williams',
                'emergency_contact_phone' => '+971-50-444-6666',
                'emergency_contact_relation' => 'Mother',
                'medical_conditions' => 'None',
                'allergies' => 'None',
                'blood_type' => 'AB+',
                'class_assigned' => 'KG1-A',
            ],
            [
                'first_name' => 'Zara',
                'last_name' => 'Khan',
                'date_of_birth' => '2019-12-25',
                'gender' => 'female',
                'student_id' => 'S005',
                'enrollment_date' => '2023-09-01',
                'status' => 'active',
                'parent_name' => 'Ahmed Khan',
                'parent_phone' => '+971-50-555-6666',
                'parent_email' => 'ahmed.khan@email.com',
                'address' => 'Villa 567, Emirates Hills, Dubai, UAE',
                'emergency_contact_name' => 'Amina Khan',
                'emergency_contact_phone' => '+971-50-555-7777',
                'emergency_contact_relation' => 'Mother',
                'medical_conditions' => 'None',
                'allergies' => 'Shellfish',
                'blood_type' => 'O-',
                'class_assigned' => 'KG2-B',
            ],
        ];

        foreach ($students as $studentData) {
            $student = Student::create($studentData);

            // Create parent user account for each student
            User::create([
                'name' => $student->parent_name,
                'email' => $student->parent_email,
                'password' => Hash::make('parent123'),
                'role' => 'parent',
                'student_id' => $student->id,
            ]);

            echo "✓ Student created - {$student->first_name} {$student->last_name} (Parent Email: {$student->parent_email}, Password: parent123)\n";
        }

        echo "\n";
        echo "===========================================\n";
        echo "Database seeded successfully!\n";
        echo "===========================================\n";
        echo "Login Credentials:\n\n";
        echo "Admin Portal:\n";
        echo "  Email: admin@steps.com\n";
        echo "  Password: password123\n\n";
        echo "Teacher Portal (use any teacher email):\n";
        echo "  Email: sarah.johnson@steps.com\n";
        echo "  Email: michael.brown@steps.com\n";
        echo "  Email: aisha.ahmed@steps.com\n";
        echo "  Password: teacher123\n\n";
        echo "Parent Portal (use any parent email):\n";
        echo "  Email: robert.smith@email.com\n";
        echo "  Email: hassan.alhassan@email.com\n";
        echo "  Email: wei.chen@email.com\n";
        echo "  Email: david.williams@email.com\n";
        echo "  Email: ahmed.khan@email.com\n";
        echo "  Password: parent123\n";
        echo "===========================================\n";

        // Seed all other modules
        echo "\nSeeding additional modules...\n";
        $this->call([
            AdmissionSeeder::class,
            EventSeeder::class,
            EmployeeSeeder::class,
            InventorySeeder::class,
            TransactionSeeder::class,
            AttendanceSeeder::class,
            EvaluationSeeder::class,
        ]);
    }
}
