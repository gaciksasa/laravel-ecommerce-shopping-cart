<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Product::query();

        // Search filter
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Sort filter
        $sort = $request->input('sort', 'name_asc');
        match ($sort) {
            'name_asc' => $query->orderBy('name', 'asc'),
            'name_desc' => $query->orderBy('name', 'desc'),
            'price_asc' => $query->orderBy('price', 'asc'),
            'price_desc' => $query->orderBy('price', 'desc'),
            'stock_asc' => $query->orderBy('stock_quantity', 'asc'),
            'stock_desc' => $query->orderBy('stock_quantity', 'desc'),
            default => $query->orderBy('name', 'asc'),
        };

        $products = $query->paginate(15)->withQueryString();

        // Add quantity in cart for authenticated users
        if (auth()->check()) {
            $cartItems = auth()->user()->cartItems()->pluck('quantity', 'product_id');
            $products->getCollection()->transform(function ($product) use ($cartItems) {
                $product->quantity_in_cart = $cartItems->get($product->id, 0);
                return $product;
            });
        } else {
            $products->getCollection()->transform(function ($product) {
                $product->quantity_in_cart = 0;
                return $product;
            });
        }

        return Inertia::render('Products/Index', [
            'products' => $products,
            'filters' => [
                'search' => $request->input('search', ''),
                'sort' => $sort,
            ],
        ]);
    }

    public function show(Product $product): Response
    {
        // Add quantity in cart for authenticated users
        if (auth()->check()) {
            $cartItem = auth()->user()->cartItems()->where('product_id', $product->id)->first();
            $product->quantity_in_cart = $cartItem ? $cartItem->quantity : 0;
        } else {
            $product->quantity_in_cart = 0;
        }

        return Inertia::render('Products/Show', [
            'product' => $product,
        ]);
    }
}
