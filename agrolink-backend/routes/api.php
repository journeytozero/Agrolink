<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\TransporterController;

// 🔓 Public routes (registration, login)
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// 🌾 Public product listing (home page)
Route::get('/products', [ProductController::class, 'index']);

// 🔒 Protected routes (JWT required)
Route::middleware(['auth:api'])->group(function () {

    // ✅ Auth-related
    Route::get('/user', [AuthController::class, 'userProfile']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/refresh', [AuthController::class, 'refresh'])->name('auth.refresh');

    // ✅ Product routes (Farmer/Admin)
    Route::post('/products', [ProductController::class, 'store']);
    Route::put('/products/{product}', [ProductController::class, 'update']);
    Route::delete('/products/{product}', [ProductController::class, 'destroy']);

    // ✅ Category routes (e.g., for Admin/Farmer managing categories)
    // Route::get('/categories', [CategoryController::class, 'index']);
    // Route::post('/categories', [CategoryController::class, 'store']);
    // Route::put('/categories/{category}', [CategoryController::class, 'update']);
    // Route::delete('/categories/{category}', [CategoryController::class, 'destroy']);

    // 🛒 Buyer routes
    Route::post('/orders', [OrderController::class, 'store']);
    Route::get('/my-orders', [OrderController::class, 'myOrders']);
    Route::get('/orders', [OrderController::class, 'index']);
    Route::post('/orders/{id}/location', [OrderController::class, 'updateLocation']);
    Route::post('/orders/{id}/delivered', [OrderController::class, 'markDelivered']);
    // 🚚 Transporter routes
    Route::get('/transporter/orders', [TransporterController::class, 'myOrders']);
    Route::put('/transporter/orders/{id}', [TransporterController::class, 'updateDeliveryStatus']);
    Route::put('/transporter/orders/{id}/location', [TransporterController::class, 'updateDeliveryLocation']);

    // 👑 Admin-only routes
    Route::middleware('role:admin')->group(function () {
        // 👤 User management
        Route::get('/admin/users', [AdminController::class, 'allUsers']);
        Route::put('/admin/users/{id}', [AdminController::class, 'updateUser']);
        Route::delete('/admin/users/{id}', [AdminController::class, 'deleteUser']);

        // 📦 Product management
        Route::put('/admin/products/{id}', [AdminController::class, 'updateProduct']);
        Route::post('/admin/products/{id}/image', [AdminController::class, 'updateProductImage']);

        // 💰 Reports & analytics
        Route::get('/admin/revenue-report', [AdminController::class, 'revenueReport']);

        // 🧾 Order management
        Route::get('/admin/orders', [AdminController::class, 'getAllOrders']);
        Route::put('/admin/orders/{id}', [AdminController::class, 'updateOrderStatus']);
        Route::post('/checkout', [OrderController::class, 'checkout']);
    });
});
