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
            ['name' => 'Laptop', 'description' => 'High-performance laptop', 'price' => 999.99, 'stock_quantity' => 15, 'image_url' => 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=800&fit=crop'],
            ['name' => 'Wireless Mouse', 'description' => 'Ergonomic wireless mouse', 'price' => 29.99, 'stock_quantity' => 3, 'image_url' => 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&h=800&fit=crop'],
            ['name' => 'Mechanical Keyboard', 'description' => 'RGB mechanical keyboard', 'price' => 149.99, 'stock_quantity' => 8, 'image_url' => 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&h=800&fit=crop'],
            ['name' => 'USB-C Cable', 'description' => 'Durable USB-C charging cable', 'price' => 12.99, 'stock_quantity' => 2, 'image_url' => 'https://images.unsplash.com/photo-1589003077984-894e133dabab?w=800&h=800&fit=crop'],
            ['name' => '27" Monitor', 'description' => '4K UHD monitor', 'price' => 349.99, 'stock_quantity' => 12, 'image_url' => 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&h=800&fit=crop'],
            ['name' => 'Webcam HD', 'description' => '1080p HD webcam', 'price' => 79.99, 'stock_quantity' => 5, 'image_url' => 'https://images.unsplash.com/photo-1617096200347-cb04ae810b1d?w=800&h=800&fit=crop'],
            ['name' => 'Desk Lamp', 'description' => 'LED desk lamp with adjustable brightness', 'price' => 45.99, 'stock_quantity' => 20, 'image_url' => 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&h=800&fit=crop'],
            ['name' => 'Office Chair', 'description' => 'Ergonomic office chair', 'price' => 299.99, 'stock_quantity' => 7, 'image_url' => 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800&h=800&fit=crop'],
            ['name' => 'Standing Desk', 'description' => 'Height-adjustable standing desk', 'price' => 499.99, 'stock_quantity' => 4, 'image_url' => 'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?w=800&h=800&fit=crop'],
            ['name' => 'Headphones', 'description' => 'Noise-cancelling wireless headphones', 'price' => 199.99, 'stock_quantity' => 18, 'image_url' => 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop'],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}
