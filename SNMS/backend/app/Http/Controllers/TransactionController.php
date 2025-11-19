<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class TransactionController extends Controller
{
    public function index(): JsonResponse
    {
        $transactions = Transaction::with('student')->orderBy('transaction_date', 'desc')->get();
        return response()->json($transactions);
    }

    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'student_id' => 'nullable|exists:students,id',
            'transaction_type' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0',
            'transaction_date' => 'required|date',
            'payment_method' => 'nullable|in:cash,card,bank_transfer,cheque',
            'status' => 'nullable|in:pending,completed,failed,refunded',
            'reference_number' => 'nullable|string|max:255',
            'description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $transaction = Transaction::create($request->all());

        return response()->json([
            'message' => 'Transaction created successfully',
            'transaction' => $transaction->load('student')
        ], 201);
    }

    public function show(Transaction $transaction): JsonResponse
    {
        return response()->json($transaction->load('student'));
    }

    public function update(Request $request, Transaction $transaction): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'student_id' => 'nullable|exists:students,id',
            'transaction_type' => 'sometimes|required|string|max:255',
            'amount' => 'sometimes|required|numeric|min:0',
            'transaction_date' => 'sometimes|required|date',
            'payment_method' => 'nullable|in:cash,card,bank_transfer,cheque',
            'status' => 'nullable|in:pending,completed,failed,refunded',
            'reference_number' => 'nullable|string|max:255',
            'description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $transaction->update($request->all());

        return response()->json([
            'message' => 'Transaction updated successfully',
            'transaction' => $transaction->load('student')
        ]);
    }

    public function destroy(Transaction $transaction): JsonResponse
    {
        $transaction->delete();

        return response()->json([
            'message' => 'Transaction deleted successfully'
        ]);
    }
}
