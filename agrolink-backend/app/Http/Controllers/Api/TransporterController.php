<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;

class TransporterController extends Controller
{
    // 🧾 Get all orders assigned to the logged-in transporter
    public function myOrders(Request $request)
    {
        $user = $request->user();

        $orders = Order::with(['product', 'buyer'])
            ->where('transporter_id', $user->id)
            ->latest()
            ->get();

        return response()->json($orders);
    }


    // 🚚 Update delivery status
    public function updateDeliveryStatus(Request $request, $id)
    {
        $order = Order::findOrFail($id);

        if ($order->transporter_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $order->delivery_status = $request->delivery_status;
        $order->save();

        return response()->json([
            'message' => 'Delivery status updated successfully',
            'order' => $order
        ]);
    }

    public function updateDeliveryLocation(Request $request, $id)
    {
        $request->validate([
            'delivery_lat' => 'required|numeric',
            'delivery_lng' => 'required|numeric',
        ]);

        $order = Order::findOrFail($id);
        $user = auth()->user();

        if ($user->role !== 'transporter' || $order->transporter_id !== $user->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $order->update([
            'delivery_lat' => $request->delivery_lat,
            'delivery_lng' => $request->delivery_lng,
            'delivery_status' => 'in_transit',
        ]);

        return response()->json(['message' => 'Delivery location updated']);
    }
}
