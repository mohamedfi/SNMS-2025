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
        Schema::table('events', function (Blueprint $table) {
            // Rename type to event_type
            $table->renameColumn('type', 'event_type');
        });

        Schema::table('events', function (Blueprint $table) {
            // Add missing fields
            $table->integer('capacity')->default(100)->after('event_type');
            $table->integer('registered_count')->default(0)->after('capacity');
            $table->decimal('fee', 10, 2)->default(0)->after('registered_count');
            $table->boolean('permission_required')->default(false)->after('fee');
            $table->text('notes')->nullable()->after('permission_required');

            // Change status enum values
            $table->enum('status', ['upcoming', 'ongoing', 'completed', 'cancelled'])->default('upcoming')->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('events', function (Blueprint $table) {
            $table->dropColumn(['capacity', 'registered_count', 'fee', 'permission_required', 'notes']);
            $table->enum('status', ['scheduled', 'ongoing', 'completed', 'cancelled'])->default('scheduled')->change();
        });

        Schema::table('events', function (Blueprint $table) {
            $table->renameColumn('event_type', 'type');
        });
    }
};
