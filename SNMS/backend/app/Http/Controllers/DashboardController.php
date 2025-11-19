<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Models\Teacher;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    /**
     * Get dashboard statistics
     */
    public function stats(Request $request)
    {
        try {
            $totalStudents = Student::count();
            $totalTeachers = Teacher::count();

            // Get today's attendance (you can implement this later)
            $todayAttendance = 0;

            // Get pending payments (you can implement this later)
            $pendingPayments = 0;

            return response()->json([
                'success' => true,
                'data' => [
                    'total_students' => $totalStudents,
                    'total_teachers' => $totalTeachers,
                    'today_attendance' => $todayAttendance,
                    'pending_payments' => $pendingPayments
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch dashboard statistics',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
