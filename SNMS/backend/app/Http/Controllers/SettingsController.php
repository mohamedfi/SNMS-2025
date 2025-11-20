<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class SettingsController extends Controller
{
    /**
     * Get all users with their roles
     */
    public function users(): JsonResponse
    {
        $users = User::with('roles')->get();
        return response()->json($users);
    }

    /**
     * Get current user's permissions
     */
    public function myPermissions(Request $request): JsonResponse
    {
        $user = $request->user();
        $permissions = $user->roles->load('permissions')->pluck('permissions')->flatten()->unique('id')->values();

        return response()->json([
            'permissions' => $permissions,
            'permission_names' => $permissions->pluck('name')
        ]);
    }
}
