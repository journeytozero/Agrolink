<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'product_id',
        'quantity',
        'price',
        'subtotal',
    ];

    // প্রতিটা OrderItem এর প্রোডাক্ট সম্পর্ক
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    // প্রতিটা OrderItem একটি অর্ডারের অন্তর্ভুক্ত
    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}
