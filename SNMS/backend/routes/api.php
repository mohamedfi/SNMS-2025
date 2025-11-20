<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\TeacherController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\AdmissionController;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\EvaluationController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\InventoryController;

// Handle OPTIONS requests for CORS preflight
Route::options('{any}', function () {
    return response('', 200);
})->where('any', '.*');

// Public API routes
Route::get('/', function () {
    return response()->json(['Laravel' => app()->version()]);
});

// Health check endpoint
Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'message' => 'SNMS API is running',
        'version' => app()->version(),
        'timestamp' => now()->toIso8601String()
    ]);
});

// Authentication routes
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

// Protected API routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth routes
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Dashboard statistics
    Route::get('/dashboard/stats', [DashboardController::class, 'stats']);
    Route::get('/dashboard/attendance-chart', [DashboardController::class, 'attendanceChart']);
    Route::get('/dashboard/student-status-chart', [DashboardController::class, 'studentStatusChart']);
    Route::get('/dashboard/teacher-type-chart', [DashboardController::class, 'teacherTypeChart']);

    // Students API routes (Admin and Teachers can manage)
    Route::apiResource('students', StudentController::class);

    // Teachers API routes (Admin can manage)
    Route::apiResource('teachers', TeacherController::class);

    // Admissions API routes
    Route::apiResource('admissions', AdmissionController::class);

    // Attendance API routes
    Route::apiResource('attendances', AttendanceController::class);

    // Evaluations API routes
    Route::apiResource('evaluations', EvaluationController::class);

    // Events API routes
    Route::apiResource('events', EventController::class);

    // HR/Employees API routes
    Route::apiResource('employees', EmployeeController::class);

    // Finance/Transactions API routes
    Route::apiResource('transactions', TransactionController::class);

    // Inventory API routes
    Route::apiResource('inventory', InventoryController::class);
});
