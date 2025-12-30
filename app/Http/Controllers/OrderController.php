<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Services\OrderService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function __construct(
        private OrderService $orderService
    ) {}

    public function index(): Response
    {
        $orders = Order::where('user_id', auth()->id())
            ->with('orderItems.product')
            ->orderByDesc('created_at')
            ->paginate(10);

        return Inertia::render('Orders/Index', [
            'orders' => $orders,
        ]);
    }

    public function store(): RedirectResponse
    {
        try {
            $order = $this->orderService->createOrderFromCart(auth()->user());

            return redirect()->route('orders.index')
                ->with('success', "Order #{$order->id} created successfully!");
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }
}
