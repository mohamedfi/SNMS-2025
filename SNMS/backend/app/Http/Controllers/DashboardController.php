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

    /**
     * Get attendance chart data for the last 7 days
     */
    public function attendanceChart(Request $request)
    {
        try {
            $chartData = [];

            // Get data for the last 7 days
            for ($i = 6; $i >= 0; $i--) {
                $date = Carbon::today()->subDays($i)->toDateString();

                // Count attendances by status for this date
                $presentCount = Attendance::whereDate('date', $date)
                    ->where('status', 'present')
                    ->count();

                $absentCount = Attendance::whereDate('date', $date)
                    ->where('status', 'absent')
                    ->count();

                $lateCount = Attendance::whereDate('date', $date)
                    ->where('status', 'late')
                    ->count();

                $chartData[] = [
                    'date' => $date,
                    'present' => $presentCount,
                    'absent' => $absentCount,
                    'late' => $lateCount
                ];
            }

            return response()->json([
                'success' => true,
                'data' => $chartData
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch attendance chart data',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get student status chart data
     */
    public function studentStatusChart(Request $request)
    {
        try {
            $chartData = [];

            // Count students by status
            $statuses = Student::selectRaw('status, COUNT(*) as count')
                ->groupBy('status')
                ->get();

            foreach ($statuses as $statusData) {
                $chartData[] = [
                    'name' => ucfirst($statusData->status),
                    'value' => $statusData->count
                ];
            }

            return response()->json([
                'success' => true,
                'data' => $chartData
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch student status chart data',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get teacher type chart data
     */
    public function teacherTypeChart(Request $request)
    {
        try {
            $chartData = [];

            // Count teachers by employment_type
            $employmentTypes = Teacher::selectRaw('employment_type, COUNT(*) as count')
                ->groupBy('employment_type')
                ->get();

            foreach ($employmentTypes as $typeData) {
                $chartData[] = [
                    'type' => ucfirst($typeData->employment_type),
                    'count' => $typeData->count
                ];
            }

            return response()->json([
                'success' => true,
                'data' => $chartData
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch teacher type chart data',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
