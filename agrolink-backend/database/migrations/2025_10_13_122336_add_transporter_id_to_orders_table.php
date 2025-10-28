<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->foreignId('transporter_id')
                ->nullable()
                ->constrained('users')
                ->onDelete('set null');
            $table->enum('delivery_status', ['pending', 'picked', 'in_transit', 'delivered'])
                ->default('pending');
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->unsignedBigInteger('transporter_id')->nullable()->after('buyer_id');
            $table->foreign('transporter_id')->references('id')->on('users')->onDelete('set null');
        });
    }
};
