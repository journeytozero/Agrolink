<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    /**
     * 🧩 Show all products
     */
    public function index()
    {
        $user = auth('api')->user();
        $query = Product::with('user')->latest();

        if ($user) {
            if ($user->role === 'admin') {
                $products = $query->get();
            } elseif ($user->role === 'farmer') {
                $products = $query->where('user_id', $user->id)->get();
            } else {
                $products = $query->get();
            }
        } else {
            $products = $query->get();
        }

        // 🧩 প্রতিটা প্রোডাক্টে full image URL যুক্ত করা
        $products->transform(function ($product) {
            if ($product->image) {
                // ✅ Full URL তৈরি
                $product->image_url = asset('storage/' . $product->image);
            } else {
                // 🖼️ default image fallback (optional)
                $product->image_url = asset('images/default.png');
            }
            return $product;
        });

        return response()->json($products);
    }

    /**
     * 🧩 Store a new product (Only Farmer/Admin)
     */
    public function store(Request $request)
    {
        $user = auth()->user();

        if (!in_array($user->role, ['farmer', 'admin'])) {
            return response()->json(['error' => 'Unauthorized: Only farmers or admins can add products'], 403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'price' => 'required|numeric|min:1',
            'quantity' => 'required|integer|min:1',
            'unit' => 'required|string|in:Kg,Liter,Pcs,Packet,Pound',
            'location' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        // 📸 Image upload
        $imagePath = $request->hasFile('image')
            ? $request->file('image')->store('products', 'public')
            : null;

        $product = Product::create([
            'user_id' => $user->id,
            'name' => $validated['name'],
            'category' => $validated['category'],
            'price' => $validated['price'],
            'quantity' => $validated['quantity'],
            'unit' => $validated['unit'],
            'location' => $validated['location'],
            'description' => $validated['description'] ?? null,
            'image' => $imagePath,
        ]);

        // ✅ ইমেজের URL সহ response ফেরত দাও
        $product->image_url = $product->image
            ? asset('storage/' . $product->image)
            : asset('images/default.png');

        return response()->json([
            'message' => '✅ Product added successfully!',
            'product' => $product->load('user'),
        ], 201);
    }

    /**
     * 🧩 Update a product
     */
    public function update(Request $request, Product $product)
    {
        $user = auth()->user();

        if ($user->role !== 'admin' && $user->id !== $product->user_id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'price' => 'required|numeric|min:1',
            'quantity' => 'required|integer|min:1',
            'unit' => 'required|string|in:Kg,Liter,Pcs,Packet,Pound',
            'location' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        // 📸 Update image if new uploaded
        if ($request->hasFile('image')) {
            if ($product->image && Storage::disk('public')->exists($product->image)) {
                Storage::disk('public')->delete($product->image);
            }
            $product->image = $request->file('image')->store('products', 'public');
        }

        $product->update([
            'name' => $validated['name'],
            'category' => $validated['category'],
            'price' => $validated['price'],
            'quantity' => $validated['quantity'],
            'unit' => $validated['unit'],
            'location' => $validated['location'],
            'description' => $validated['description'] ?? $product->description,
            'image' => $product->image,
        ]);

        // ✅ Return updated image URL
        $product->image_url = $product->image
            ? asset('storage/' . $product->image)
            : asset('images/default.png');

        return response()->json([
            'message' => '✅ Product updated successfully!',
            'product' => $product->load('user'),
        ]);
    }

    /**
     * 🧩 Delete product
     */
    public function destroy(Product $product)
    {
        $user = auth()->user();

        if ($user->role !== 'admin' && $user->id !== $product->user_id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        if ($product->image && Storage::disk('public')->exists($product->image)) {
            Storage::disk('public')->delete($product->image);
        }

        $product->delete();

        return response()->json(['message' => '🗑️ Product deleted successfully!']);
    }
}
