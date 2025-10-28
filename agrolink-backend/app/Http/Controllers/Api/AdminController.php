<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use App\Models\Product;
use Illuminate\Support\Facades\Storage;
use App\Models\Order;

class AdminController extends Controller
{
    // 🧩 Get all users
    public function allUsers()
    {
        return response()->json(User::all());
    }

    // 🧩 Delete user
    public function deleteUser($id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        // Admin নিজেকে delete করতে পারবে না
        if ($user->role === 'admin') {
            return response()->json(['error' => 'Cannot delete another admin'], 403);
        }

        $user->delete();
        return response()->json(['message' => 'User deleted successfully']);
    }

    // 🧩 Update User
    public function updateUser(Request $request, $id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        if ($user->role === 'admin') {
            return response()->json(['error' => 'Cannot edit another admin'], 403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $id,
            'role' => 'required|in:farmer,buyer,transporter',
        ]);

        $user->update($validated);

        return response()->json(['message' => 'User updated successfully', 'user' => $user]);
    }

    public function updateProduct(Request $request, $id)
    {
        $product = Product::find($id);
        if (!$product) {
            return response()->json(['error' => 'Product not found'], 404);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'nullable|string|max:255',
            'price' => 'required|numeric|min:0',
            'quantity' => 'required|integer|min:1',
            'location' => 'required|string|max:255',
        ]);

        $product->update($validated);
        return response()->json(['message' => 'Product updated successfully', 'product' => $product]);
    }
    public function updateProductImage(Request $request, $id)
    {
        $product = Product::find($id);
        if (!$product) {
            return response()->json(['error' => 'Product not found'], 404);
        }

        $request->validate([
            'image' => 'required|image|mimes:jpg,jpeg,png|max:2048'
        ]);

        // পুরনো ইমেজ থাকলে delete করো
        if ($product->image && Storage::exists('public/' . $product->image)) {
            Storage::delete('public/' . $product->image);
        }

        // নতুন ইমেজ আপলোড
        $path = $request->file('image')->store('products', 'public');
        $product->update(['image' => $path]);

        return response()->json([
            'message' => 'Product image updated successfully',
            'image_url' => asset('storage/' . $path)
        ]);
    }

    // 🧾 Commission & Revenue Report
    public function revenueReport()
    {
        $commissionRate = 0.10; // 10% কমিশন হার

        // ✅ শুধু delivered অর্ডারগুলো নাও
        $deliveredOrders = Order::where('status', 'delivered')
            ->with(['product.user'])
            ->get();

        // 🧮 Farmer অনুযায়ী বিক্রির হিসাব
        $farmers = User::where('role', 'farmer')
            ->get()
            ->map(function ($farmer) use ($deliveredOrders, $commissionRate) {
                $sales = $deliveredOrders->where('product.user_id', $farmer->id);
                $totalSales = $sales->sum('total_price');
                $commission = $totalSales * $commissionRate;

                return [
                    'id' => $farmer->id,
                    'name' => $farmer->name,
                    'email' => $farmer->email,
                    'total_sales' => round($totalSales, 2),
                    'commission' => round($commission, 2),
                ];
            })
            ->filter(fn($farmer) => $farmer['total_sales'] > 0)
            ->values();

        // ✅ মোট হিসাব
        $totalRevenue = $farmers->sum('total_sales');
        $totalCommission = $farmers->sum('commission');

        return response()->json([
            'commission_rate' => $commissionRate,
            'total_revenue' => $totalRevenue,
            'total_commission' => $totalCommission,
            'farmers' => $farmers,
        ], 200);
    }

    public function getAllOrders()
    {
        $orders = Order::with(['product', 'buyer'])->latest()->get();
        return response()->json($orders);
    }

    public function updateOrderStatus(Request $request, $id)
    {
        $order = Order::findOrFail($id);

        // ✅ যদি transporter_id পাঠানো হয় তাহলে সেট করো
        if ($request->has('transporter_id')) {
            $order->transporter_id = $request->transporter_id;
        }

        $order->status = $request->status ?? $order->status;
        $order->save();

        return response()->json([
            'message' => 'Order updated successfully',
            'order' => $order
        ]);
    }
}
