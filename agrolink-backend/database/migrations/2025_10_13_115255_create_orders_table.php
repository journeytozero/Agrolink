<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();

            // 👥 Buyer (the user placing the order)
            $table->foreignId('buyer_id')
                  ->constrained('users')
                  ->onDelete('cascade');

            // 🌾 Product being ordered
            $table->foreignId('product_id')
                  ->constrained('products')
                  ->onDelete('cascade');

            // 🚚 Optional: Transporter assigned later
            $table->foreignId('transporter_id')
                  ->nullable()
                  ->constrained('users')
                  ->onDelete('set null');

            // 📦 Order details
            $table->integer('quantity');
            $table->decimal('total_price', 10, 2);
            $table->enum('status', ['pending', 'approved', 'delivered', 'cancelled'])->default('pending');
            $table->enum('delivery_status', ['pending', 'picked', 'in_transit', 'delivered'])->default('pending');

            // 🗺️ Delivery tracking
            $table->decimal('delivery_lat', 10, 7)->nullable();
            $table->decimal('delivery_lng', 10, 7)->nullable();

            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('orders');
    }
};
