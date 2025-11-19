<?php

namespace App\Http\Controllers;

use App\Models\Evaluation;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class EvaluationController extends Controller
{
    public function index(): JsonResponse
    {
        $evaluations = Evaluation::with(['student', 'teacher'])->orderBy('evaluation_date', 'desc')->get();
        return response()->json($evaluations);
    }

    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'student_id' => 'required|exists:students,id',
            'teacher_id' => 'required|exists:teachers,id',
            'subject' => 'required|string|max:255',
            'evaluation_date' => 'required|date',
            'score' => 'nullable|integer|min:0|max:100',
            'grade' => 'nullable|string|max:10',
            'comments' => 'nullable|string',
            'type' => 'nullable|in:quiz,test,assignment,project,final',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $evaluation = Evaluation::create($request->all());

        return response()->json([
            'message' => 'Evaluation created successfully',
            'evaluation' => $evaluation->load(['student', 'teacher'])
        ], 201);
    }

    public function show(Evaluation $evaluation): JsonResponse
    {
        return response()->json($evaluation->load(['student', 'teacher']));
    }

    public function update(Request $request, Evaluation $evaluation): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'student_id' => 'sometimes|required|exists:students,id',
            'teacher_id' => 'sometimes|required|exists:teachers,id',
            'subject' => 'sometimes|required|string|max:255',
            'evaluation_date' => 'sometimes|required|date',
            'score' => 'nullable|integer|min:0|max:100',
            'grade' => 'nullable|string|max:10',
            'comments' => 'nullable|string',
            'type' => 'nullable|in:quiz,test,assignment,project,final',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $evaluation->update($request->all());

        return response()->json([
            'message' => 'Evaluation updated successfully',
            'evaluation' => $evaluation->load(['student', 'teacher'])
        ]);
    }

    public function destroy(Evaluation $evaluation): JsonResponse
    {
        $evaluation->delete();

        return response()->json([
            'message' => 'Evaluation deleted successfully'
        ]);
    }
}
