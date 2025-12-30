<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = [
            ['name' => 'Laptop', 'description' => 'High-performance laptop', 'price' => 999.99, 'stock_quantity' => 15],
            ['name' => 'Wireless Mouse', 'description' => 'Ergonomic wireless mouse', 'price' => 29.99, 'stock_quantity' => 3],
            ['name' => 'Mechanical Keyboard', 'description' => 'RGB mechanical keyboard', 'price' => 149.99, 'stock_quantity' => 8],
            ['name' => 'USB-C Cable', 'description' => 'Durable USB-C charging cable', 'price' => 12.99, 'stock_quantity' => 2],
            ['name' => '27" Monitor', 'description' => '4K UHD monitor', 'price' => 349.99, 'stock_quantity' => 12],
            ['name' => 'Webcam HD', 'description' => '1080p HD webcam', 'price' => 79.99, 'stock_quantity' => 5],
            ['name' => 'Desk Lamp', 'description' => 'LED desk lamp with adjustable brightness', 'price' => 45.99, 'stock_quantity' => 20],
            ['name' => 'Office Chair', 'description' => 'Ergonomic office chair', 'price' => 299.99, 'stock_quantity' => 7],
            ['name' => 'Standing Desk', 'description' => 'Height-adjustable standing desk', 'price' => 499.99, 'stock_quantity' => 4],
            ['name' => 'Headphones', 'description' => 'Noise-cancelling wireless headphones', 'price' => 199.99, 'stock_quantity' => 18],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}
