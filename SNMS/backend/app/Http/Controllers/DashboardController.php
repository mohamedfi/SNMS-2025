<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Models\Teacher;
use App\Models\Attendance;
use Illuminate\Http\Request;
use Carbon\Carbon;

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

            // Calculate today's attendance percentage
            $today = Carbon::today()->toDateString();
            $todayPresentCount = Attendance::whereDate('date', $today)
                ->where('status', 'present')
                ->count();

            $todayAttendance = $totalStudents > 0
                ? round(($todayPresentCount / $totalStudents) * 100)
                : 0;

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
