<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'buyer_id',
        'product_id',
        'quantity',
        'total_price',
        'status',
        'delivery_status',
        'delivery_lat',
        'delivery_lng',
        'transporter_id',
    ];

    // 🧑‍🌾 Buyer (user placing the order)
    public function buyer()
    {
        return $this->belongsTo(User::class, 'buyer_id');
    }

    // 🌾 Product
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    // 🚚 Transporter
    public function transporter()
    {
        return $this->belongsTo(User::class, 'transporter_id');
    }
}
