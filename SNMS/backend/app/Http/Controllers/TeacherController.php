<?php

namespace App\Http\Controllers;

use App\Models\Teacher;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class TeacherController extends Controller
{
    /**
     * Display a listing of teachers.
     */
    public function index(): JsonResponse
    {
        $teachers = Teacher::orderBy('created_at', 'desc')->get();
        return response()->json($teachers);
    }

    /**
     * Store a newly created teacher.
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:teachers,email',
            'phone' => 'required|string|max:255',
            'employee_id' => 'required|string|unique:teachers,employee_id',
            'date_of_birth' => 'required|date',
            'gender' => 'required|in:male,female',
            'hire_date' => 'required|date',
            'status' => 'nullable|in:active,inactive,on_leave',
            'qualification' => 'required|string|max:255',
            'years_of_experience' => 'nullable|integer|min:0',
            'specialization' => 'nullable|string|max:255',
            'certifications' => 'nullable|string',
            'address' => 'required|string',
            'emergency_contact_name' => 'required|string|max:255',
            'emergency_contact_phone' => 'required|string|max:255',
            'emergency_contact_relation' => 'required|string|max:255',
            'employment_type' => 'nullable|in:full_time,part_time,contract',
            'salary' => 'nullable|numeric|min:0',
            'class_assigned' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
            'photo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $request->except('photo');

        // Handle photo upload
        if ($request->hasFile('photo')) {
            $photo = $request->file('photo');
            $photoPath = $photo->store('teachers', 'public');
            $data['photo_url'] = url(Storage::url($photoPath));
        }

        $teacher = Teacher::create($data);

        return response()->json([
            'message' => 'Teacher created successfully',
            'teacher' => $teacher
        ], 201);
    }

    /**
     * Display the specified teacher.
     */
    public function show(Teacher $teacher): JsonResponse
    {
        return response()->json($teacher);
    }

    /**
     * Update the specified teacher.
     */
    public function update(Request $request, Teacher $teacher): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'first_name' => 'sometimes|required|string|max:255',
            'last_name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|unique:teachers,email,' . $teacher->id,
            'phone' => 'sometimes|required|string|max:255',
            'employee_id' => 'sometimes|required|string|unique:teachers,employee_id,' . $teacher->id,
            'date_of_birth' => 'sometimes|required|date',
            'gender' => 'sometimes|required|in:male,female',
            'hire_date' => 'sometimes|required|date',
            'status' => 'nullable|in:active,inactive,on_leave',
            'qualification' => 'sometimes|required|string|max:255',
            'years_of_experience' => 'nullable|integer|min:0',
            'specialization' => 'nullable|string|max:255',
            'certifications' => 'nullable|string',
            'address' => 'sometimes|required|string',
            'emergency_contact_name' => 'sometimes|required|string|max:255',
            'emergency_contact_phone' => 'sometimes|required|string|max:255',
            'emergency_contact_relation' => 'sometimes|required|string|max:255',
            'employment_type' => 'nullable|in:full_time,part_time,contract',
            'salary' => 'nullable|numeric|min:0',
            'class_assigned' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
            'photo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $request->except('photo');

        // Handle photo upload
        if ($request->hasFile('photo')) {
            // Delete old photo if exists
            if ($teacher->photo_url) {
                // Extract path from URL (remove domain if present)
                $oldPath = str_replace([url('/storage'), '/storage'], ['public', 'public'], $teacher->photo_url);
                Storage::delete($oldPath);
            }

            $photo = $request->file('photo');
            $photoPath = $photo->store('teachers', 'public');
            $data['photo_url'] = url(Storage::url($photoPath));
        }

        $teacher->update($data);

        return response()->json([
            'message' => 'Teacher updated successfully',
            'teacher' => $teacher
        ]);
    }

    /**
     * Remove the specified teacher.
     */
    public function destroy(Teacher $teacher): JsonResponse
    {
        $teacher->delete();

        return response()->json([
            'message' => 'Teacher deleted successfully'
        ]);
    }
}
