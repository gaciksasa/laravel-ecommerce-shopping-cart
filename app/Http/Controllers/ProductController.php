<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function index(): Response
    {
        $products = Product::query()
            ->orderBy('name')
            ->paginate(15);

        return Inertia::render('Products/Index', [
            'products' => $products,
        ]);
    }
}
