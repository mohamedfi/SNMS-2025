<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\TeacherController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;

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

    // Students API routes (Admin and Teachers can manage)
    Route::apiResource('students', StudentController::class);

    // Teachers API routes (Admin can manage)
    Route::apiResource('teachers', TeacherController::class);
});
