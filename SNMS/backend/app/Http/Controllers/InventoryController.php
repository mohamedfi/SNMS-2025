<?php

namespace App\Http\Controllers;

use App\Models\InventoryItem;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class InventoryController extends Controller
{
    public function index(): JsonResponse
    {
        $items = InventoryItem::orderBy('created_at', 'desc')->get();
        return response()->json($items);
    }

    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'quantity' => 'required|integer|min:0',
            'minimum_quantity' => 'nullable|integer|min:0',
            'unit_price' => 'nullable|numeric|min:0',
            'unit_of_measure' => 'nullable|string|max:255',
            'supplier' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'last_restocked' => 'nullable|date',
            'status' => 'nullable|in:in_stock,low_stock,out_of_stock',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $item = InventoryItem::create($request->all());

        return response()->json([
            'message' => 'Inventory item created successfully',
            'item' => $item
        ], 201);
    }

    public function show(InventoryItem $inventory): JsonResponse
    {
        return response()->json($inventory);
    }

    public function update(Request $request, InventoryItem $inventory): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'category' => 'sometimes|required|string|max:255',
            'quantity' => 'sometimes|required|integer|min:0',
            'minimum_quantity' => 'nullable|integer|min:0',
            'unit_price' => 'nullable|numeric|min:0',
            'unit_of_measure' => 'nullable|string|max:255',
            'supplier' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'last_restocked' => 'nullable|date',
            'status' => 'nullable|in:in_stock,low_stock,out_of_stock',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $inventory->update($request->all());

        return response()->json([
            'message' => 'Inventory item updated successfully',
            'item' => $inventory
        ]);
    }

    public function destroy(InventoryItem $inventory): JsonResponse
    {
        $inventory->delete();

        return response()->json([
            'message' => 'Inventory item deleted successfully'
        ]);
    }
}
