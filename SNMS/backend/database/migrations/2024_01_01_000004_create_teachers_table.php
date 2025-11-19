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
        Schema::create('teachers', function (Blueprint $table) {
            $table->id();
            $table->string('first_name');
            $table->string('last_name');
            $table->string('email')->unique();
            $table->string('phone');
            $table->string('employee_id')->unique();
            $table->date('date_of_birth');
            $table->enum('gender', ['male', 'female']);
            $table->date('hire_date');
            $table->enum('status', ['active', 'inactive', 'on_leave'])->default('active');

            // Professional Information
            $table->string('qualification');
            $table->integer('years_of_experience')->default(0);
            $table->string('specialization')->nullable();
            $table->text('certifications')->nullable();

            // Contact Information
            $table->text('address');
            $table->string('emergency_contact_name');
            $table->string('emergency_contact_phone');
            $table->string('emergency_contact_relation');

            // Employment Details
            $table->enum('employment_type', ['full_time', 'part_time', 'contract'])->default('full_time');
            $table->decimal('salary', 10, 2)->nullable();
            $table->string('class_assigned')->nullable();

            // Additional Information
            $table->text('notes')->nullable();
            $table->string('photo_url')->nullable();

            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('teachers');
    }
};
