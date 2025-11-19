<?php

namespace App\Http\Controllers;

use App\Models\Admission;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class AdmissionController extends Controller
{
    /**
     * Display a listing of admissions.
     */
    public function index(): JsonResponse
    {
        $admissions = Admission::orderBy('created_at', 'desc')->get();
        return response()->json($admissions);
    }

    /**
     * Store a newly created admission.
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'student_name' => 'required|string|max:255',
            'parent_name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:255',
            'date_of_birth' => 'required|date',
            'grade_level' => 'required|string|max:255',
            'admission_date' => 'required|date',
            'status' => 'nullable|in:pending,approved,rejected',
            'notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $admission = Admission::create($request->all());

        return response()->json([
            'message' => 'Admission created successfully',
            'admission' => $admission
        ], 201);
    }

    /**
     * Display the specified admission.
     */
    public function show(Admission $admission): JsonResponse
    {
        return response()->json($admission);
    }

    /**
     * Update the specified admission.
     */
    public function update(Request $request, Admission $admission): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'student_name' => 'sometimes|required|string|max:255',
            'parent_name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|max:255',
            'phone' => 'sometimes|required|string|max:255',
            'date_of_birth' => 'sometimes|required|date',
            'grade_level' => 'sometimes|required|string|max:255',
            'admission_date' => 'sometimes|required|date',
            'status' => 'nullable|in:pending,approved,rejected',
            'notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $admission->update($request->all());

        return response()->json([
            'message' => 'Admission updated successfully',
            'admission' => $admission
        ]);
    }

    /**
     * Remove the specified admission.
     */
    public function destroy(Admission $admission): JsonResponse
    {
        $admission->delete();

        return response()->json([
            'message' => 'Admission deleted successfully'
        ]);
    }
}
