<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Update employees status enum
        DB::statement("ALTER TABLE employees MODIFY COLUMN status ENUM('active', 'on_leave', 'inactive') DEFAULT 'active'");

        // Update transactions payment_method enum
        DB::statement("ALTER TABLE transactions MODIFY COLUMN payment_method ENUM('cash', 'card', 'bank_transfer', 'online') DEFAULT 'cash'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revert employees status enum
        DB::statement("ALTER TABLE employees MODIFY COLUMN status ENUM('active', 'on_leave', 'terminated') DEFAULT 'active'");

        // Revert transactions payment_method enum
        DB::statement("ALTER TABLE transactions MODIFY COLUMN payment_method ENUM('cash', 'card', 'bank_transfer', 'cheque') DEFAULT 'cash'");
    }
};
