<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Models\Permission;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class RoleController extends Controller
{
    /**
     * Get all roles with their permissions
     */
    public function index(): JsonResponse
    {
        $roles = Role::with('permissions')->get();
        return response()->json($roles);
    }

    /**
     * Create a new role
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'name' => 'required|string|unique:roles,name|max:255',
            'display_name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'permissions' => 'nullable|array',
            'permissions.*' => 'exists:permissions,id',
        ]);

        $role = Role::create([
            'name' => $request->name,
            'display_name' => $request->display_name,
            'description' => $request->description,
        ]);

        if ($request->has('permissions')) {
            $role->permissions()->attach($request->permissions);
        }

        return response()->json([
            'message' => 'Role created successfully',
            'role' => $role->load('permissions')
        ], 201);
    }

    /**
     * Get all permissions grouped by module
     */
    public function permissions(): JsonResponse
    {
        $permissions = Permission::all()->groupBy('module');
        return response()->json($permissions);
    }

    /**
     * Assign role to user
     */
    public function assignRole(Request $request): JsonResponse
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'role_id' => 'required|exists:roles,id',
        ]);

        $user = User::findOrFail($request->user_id);
        $role = Role::findOrFail($request->role_id);

        if (!$user->roles->contains($role)) {
            $user->roles()->attach($role);
        }

        return response()->json([
            'message' => 'Role assigned successfully',
            'user' => $user->load('roles')
        ]);
    }

    /**
     * Remove role from user
     */
    public function removeRole(Request $request): JsonResponse
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'role_id' => 'required|exists:roles,id',
        ]);

        $user = User::findOrFail($request->user_id);
        $user->roles()->detach($request->role_id);

        return response()->json([
            'message' => 'Role removed successfully',
            'user' => $user->load('roles')
        ]);
    }

    /**
     * Update role permissions
     */
    public function updateRolePermissions(Request $request, Role $role): JsonResponse
    {
        $request->validate([
            'permissions' => 'required|array',
            'permissions.*' => 'exists:permissions,id',
        ]);

        $role->permissions()->sync($request->permissions);

        return response()->json([
            'message' => 'Role permissions updated successfully',
            'role' => $role->load('permissions')
        ]);
    }

    /**
     * Get user's roles and permissions
     */
    public function getUserRoles(User $user): JsonResponse
    {
        return response()->json([
            'roles' => $user->roles,
            'permissions' => $user->roles->load('permissions')->pluck('permissions')->flatten()->unique('id')->values()
        ]);
    }
}
