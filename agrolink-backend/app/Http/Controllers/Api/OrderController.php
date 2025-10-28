<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Support\Facades\Auth;

class OrderController extends Controller
{
    /**
     * 🛒 Create a new order (Buyer)
     */
    public function store(Request $request)
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
        ]);

        $product = Product::findOrFail($request->product_id);

        if ($request->quantity > $product->quantity) {
            return response()->json([
                'error' => 'Quantity exceeds available stock!',
            ], 400);
        }

        $totalPrice = $product->price * $request->quantity;

        // ✅ Create order
        $order = Order::create([
            'buyer_id' => $user->id,
            'product_id' => $product->id,
            'quantity' => $request->quantity,
            'total_price' => $totalPrice,
            'status' => 'pending',
            'delivery_status' => 'pending',
        ]);

        // ✅ Decrease stock
        $product->decrement('quantity', $request->quantity);

        return response()->json([
            'message' => '✅ Order placed successfully!',
            'order' => $order->load(['product', 'buyer']),
        ], 201);
    }

    /**
     * 🧾 Get all orders of the logged-in user (Buyer)
     */
    public function myOrders()
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $orders = Order::with(['product', 'transporter'])
            ->where('buyer_id', $user->id)
            ->latest()
            ->get();

        return response()->json($orders, 200);
    }

    /**
     * 👨‍🌾 Admin or Farmer: View all related orders
     */
    public function index()
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        // ✅ ADMIN: See all orders
        if ($user->role === 'admin') {
            $orders = Order::with([
                'buyer:id,name,email',
                'product:id,name,user_id',
                'transporter:id,name,email',
            ])->latest()->get();

        // 👨‍🌾 FARMER: See only their own product orders
        } elseif ($user->role === 'farmer') {
            $orders = Order::whereHas('product', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            })
            ->with([
                'buyer:id,name,email',
                'product:id,name,user_id',
                'transporter:id,name,email',
            ])
            ->latest()
            ->get();
        } else {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        // ✅ Format response
        $formatted = $orders->map(function ($order) {
            return [
                'id' => $order->id,
                'product_name' => optional($order->product)->name ?? 'N/A',
                'buyer_name' => optional($order->buyer)->name ?? 'N/A',
                'quantity' => $order->quantity,
                'total_price' => $order->total_price,
                'status' => $order->status,
                'created_at' => $order->created_at?->format('Y-m-d') ?? '',
            ];
        });

        return response()->json($formatted, 200);
    }

    /**
     * 🚚 Update delivery location (for transport tracking)
     */
    public function updateLocation(Request $request, $id)
    {
        $request->validate([
            'delivery_lat' => 'required|string',
            'delivery_lng' => 'required|string',
        ]);

        $order = Order::findOrFail($id);
        $order->update([
            'delivery_lat' => $request->delivery_lat,
            'delivery_lng' => $request->delivery_lng,
        ]);

        return response()->json(['message' => '✅ Delivery location updated successfully!']);
    }

    /**
     * ✅ Mark order as delivered (Admin/Farmer)
     */
    public function markDelivered($id)
    {
        $order = Order::findOrFail($id);
        $user = Auth::user();

        if (!in_array($user->role, ['admin', 'farmer'])) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $order->update([
            'status' => 'delivered',
            'delivery_status' => 'delivered',
        ]);

        return response()->json(['message' => '✅ Order marked as delivered!']);
    }
}
