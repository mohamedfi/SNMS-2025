<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\InventoryItem;

class InventorySeeder extends Seeder
{
    public function run(): void
    {
        $items = [
            [
                'name' => 'Pencils',
                'category' => 'Stationery',
                'quantity' => 500,
                'minimum_quantity' => 100,
                'unit_price' => 0.50,
                'unit_of_measure' => 'piece',
                'supplier' => 'Office Supplies Co.',
                'description' => 'HB Pencils for students',
                'last_restocked' => '2025-11-01',
                'status' => 'in_stock',
            ],
            [
                'name' => 'Notebooks',
                'category' => 'Stationery',
                'quantity' => 150,
                'minimum_quantity' => 50,
                'unit_price' => 2.50,
                'unit_of_measure' => 'piece',
                'supplier' => 'School Supplies Ltd.',
                'description' => 'A4 ruled notebooks',
                'last_restocked' => '2025-10-15',
                'status' => 'in_stock',
            ],
            [
                'name' => 'Crayons Box',
                'category' => 'Art Supplies',
                'quantity' => 25,
                'minimum_quantity' => 30,
                'unit_price' => 5.00,
                'unit_of_measure' => 'box',
                'supplier' => 'Art World',
                'description' => '24-color crayon sets',
                'last_restocked' => '2025-09-20',
                'status' => 'low_stock',
            ],
            [
                'name' => 'Hand Sanitizer',
                'category' => 'Health & Safety',
                'quantity' => 0,
                'minimum_quantity' => 20,
                'unit_price' => 8.00,
                'unit_of_measure' => 'bottle',
                'supplier' => 'Health Plus',
                'description' => '500ml bottles',
                'last_restocked' => '2025-08-10',
                'status' => 'out_of_stock',
            ],
            [
                'name' => 'First Aid Kits',
                'category' => 'Health & Safety',
                'quantity' => 15,
                'minimum_quantity' => 10,
                'unit_price' => 25.00,
                'unit_of_measure' => 'kit',
                'supplier' => 'MedCare Supplies',
                'description' => 'Standard first aid kits',
                'last_restocked' => '2025-10-01',
                'status' => 'in_stock',
            ],
        ];

        foreach ($items as $item) {
            InventoryItem::create($item);
        }

        echo "Inventory items seeded successfully!\n";
    }
}
