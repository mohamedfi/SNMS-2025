<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->enum('role', ['admin', 'teacher', 'parent'])->default('parent')->after('email');
            $table->foreignId('teacher_id')->nullable()->constrained('teachers')->onDelete('cascade')->after('role');
            $table->foreignId('student_id')->nullable()->constrained('students')->onDelete('cascade')->after('teacher_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['teacher_id']);
            $table->dropForeign(['student_id']);
            $table->dropColumn(['role', 'teacher_id', 'student_id']);
        });
    }
};
