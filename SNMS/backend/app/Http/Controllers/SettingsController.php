<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Teacher;
use App\Models\Student;
use App\Models\Employee;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;

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

    /**
     * Get all teachers for user creation dropdown
     */
    public function getTeachers(): JsonResponse
    {
        $teachers = Teacher::select('id', 'first_name', 'last_name', 'email')->get();
        return response()->json($teachers);
    }

    /**
     * Get all students for user creation dropdown (for parent linking)
     */
    public function getStudents(): JsonResponse
    {
        $students = Student::select('id', 'first_name', 'last_name')->get();
        return response()->json($students);
    }

    /**
     * Get all employees for user creation dropdown (for admin creation)
     */
    public function getEmployees(): JsonResponse
    {
        $employees = Employee::select('id', 'first_name', 'last_name', 'email')->get();
        return response()->json($employees);
    }

    /**
     * Create a new user with role assignment
     */
    public function createUser(Request $request): JsonResponse
    {
        $request->validate([
            'role' => 'required|string|in:admin,teacher,parent,other',
            'username' => 'required|string|unique:users,username|max:255',
            'email' => 'required|email|unique:users,email|max:255',
            'password' => 'required|string|min:8',
            'teacher_id' => 'nullable|exists:teachers,id',
            'student_id' => 'nullable|exists:students,id',
            'employee_id' => 'nullable|exists:employees,id',
        ]);

        // Create the user
        $user = User::create([
            'username' => $request->username,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        // Assign role based on selection
        $roleName = ucfirst($request->role);
        $role = Role::where('name', $roleName)->first();

        if ($role) {
            $user->roles()->attach($role->id);
        }

        // Link to teacher, student, or employee if provided
        if ($request->role === 'teacher' && $request->teacher_id) {
            $teacher = Teacher::find($request->teacher_id);
            if ($teacher) {
                $teacher->user_id = $user->id;
                $teacher->save();
            }
        } elseif ($request->role === 'parent' && $request->student_id) {
            $student = Student::find($request->student_id);
            if ($student) {
                $student->parent_id = $user->id;
                $student->save();
            }
        } elseif ($request->role === 'admin' && $request->employee_id) {
            $employee = Employee::find($request->employee_id);
            if ($employee) {
                $employee->user_id = $user->id;
                $employee->save();
            }
        }

        return response()->json([
            'message' => 'User created successfully',
            'user' => $user->load('roles')
        ], 201);
    }
}
