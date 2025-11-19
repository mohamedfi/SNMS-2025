<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InventoryItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'category',
        'quantity',
        'minimum_quantity',
        'unit_price',
        'unit_of_measure',
        'supplier',
        'description',
        'last_restocked',
        'status',
    ];

    protected $casts = [
        'last_restocked' => 'date',
        'unit_price' => 'decimal:2',
    ];
}
