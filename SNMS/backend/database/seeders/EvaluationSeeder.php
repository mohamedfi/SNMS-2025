<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Evaluation;
use App\Models\Student;
use App\Models\Teacher;

class EvaluationSeeder extends Seeder
{
    public function run(): void
    {
        $students = Student::take(3)->get();
        $teacher = Teacher::first();
        
        if ($students->isEmpty()) {
            echo "No students found. Please seed students first.\n";
            return;
        }
        
        if (!$teacher) {
            echo "No teachers found. Please seed teachers first.\n";
            return;
        }

        $subjects = ['Math', 'English', 'Science', 'Art'];
        $types = ['quiz', 'test', 'assignment', 'project'];

        foreach ($students as $student) {
            foreach ($subjects as $subject) {
                Evaluation::create([
                    'student_id' => $student->id,
                    'teacher_id' => $teacher->id,
                    'subject' => $subject,
                    'evaluation_date' => date('Y-m-d', strtotime('-' . rand(1, 30) . ' days')),
                    'score' => rand(60, 100),
                    'grade' => ['A', 'B', 'C'][rand(0, 2)],
                    'comments' => 'Good progress, keep up the work!',
                    'type' => $types[array_rand($types)],
                ]);
            }
        }

        echo "Evaluations seeded successfully!\n";
    }
}
