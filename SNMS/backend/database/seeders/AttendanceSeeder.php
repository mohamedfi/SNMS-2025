<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Attendance;
use App\Models\Student;

class AttendanceSeeder extends Seeder
{
    public function run(): void
    {
        $students = Student::take(3)->get();
        
        if ($students->isEmpty()) {
            echo "No students found. Please seed students first.\n";
            return;
        }

        $dates = [
            date('Y-m-d'),
            date('Y-m-d', strtotime('-1 day')),
            date('Y-m-d', strtotime('-2 days')),
        ];

        $statuses = ['present', 'absent', 'late', 'excused'];

        foreach ($students as $student) {
            foreach ($dates as $date) {
                Attendance::create([
                    'student_id' => $student->id,
                    'date' => $date,
                    'status' => $statuses[array_rand($statuses)],
                    'check_in_time' => '08:' . str_pad(rand(0, 59), 2, '0', STR_PAD_LEFT),
                    'check_out_time' => '14:' . str_pad(rand(0, 59), 2, '0', STR_PAD_LEFT),
                    'notes' => $date === date('Y-m-d') ? 'Regular day' : null,
                ]);
            }
        }

        echo "Attendance records seeded successfully!\n";
    }
}
