<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class AttendanceController extends Controller
{
    public function index(): JsonResponse
    {
        $attendances = Attendance::with('student')->orderBy('date', 'desc')->get();
        return response()->json($attendances);
    }

    public function store(Request $request): JsonResponse
    {
        // Convert empty strings to null for optional time fields
        $data = $request->all();
        $data['check_in_time'] = $data['check_in_time'] ?? null;
        $data['check_out_time'] = $data['check_out_time'] ?? null;
        $data['notes'] = $data['notes'] ?? null;

        // Convert empty strings to null
        if (isset($data['check_in_time']) && $data['check_in_time'] === '') {
            $data['check_in_time'] = null;
        }
        if (isset($data['check_out_time']) && $data['check_out_time'] === '') {
            $data['check_out_time'] = null;
        }
        if (isset($data['notes']) && $data['notes'] === '') {
            $data['notes'] = null;
        }

        $validator = Validator::make($data, [
            'student_id' => 'required|exists:students,id',
            'date' => 'required|date',
            'status' => 'required|in:present,absent,late,excused',
            'check_in_time' => 'nullable|date_format:H:i',
            'check_out_time' => 'nullable|date_format:H:i',
            'notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $attendance = Attendance::create($data);

        return response()->json([
            'message' => 'Attendance recorded successfully',
            'attendance' => $attendance->load('student')
        ], 201);
    }

    public function show(Attendance $attendance): JsonResponse
    {
        return response()->json($attendance->load('student'));
    }

    public function update(Request $request, Attendance $attendance): JsonResponse
    {
        // Convert empty strings to null for optional time fields
        $data = $request->all();
        $data['check_in_time'] = $data['check_in_time'] ?? null;
        $data['check_out_time'] = $data['check_out_time'] ?? null;
        $data['notes'] = $data['notes'] ?? null;

        // Convert empty strings to null
        if (isset($data['check_in_time']) && $data['check_in_time'] === '') {
            $data['check_in_time'] = null;
        }
        if (isset($data['check_out_time']) && $data['check_out_time'] === '') {
            $data['check_out_time'] = null;
        }
        if (isset($data['notes']) && $data['notes'] === '') {
            $data['notes'] = null;
        }

        $validator = Validator::make($data, [
            'student_id' => 'sometimes|required|exists:students,id',
            'date' => 'sometimes|required|date',
            'status' => 'sometimes|required|in:present,absent,late,excused',
            'check_in_time' => 'nullable|date_format:H:i',
            'check_out_time' => 'nullable|date_format:H:i',
            'notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $attendance->update($data);

        return response()->json([
            'message' => 'Attendance updated successfully',
            'attendance' => $attendance->load('student')
        ]);
    }

    public function destroy(Attendance $attendance): JsonResponse
    {
        $attendance->delete();

        return response()->json([
            'message' => 'Attendance deleted successfully'
        ]);
    }
}
