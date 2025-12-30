<?php

namespace App\Services;

use App\Models\Order;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class OrderService
{
    public function __construct(
        private CartService $cartService,
        private StockService $stockService
    ) {}

    public function createOrderFromCart(User $user): Order
    {
        $cartItems = $this->cartService->getCartItems($user);

        if ($cartItems->isEmpty()) {
            throw new \Exception('Cart is empty.');
        }

        return DB::transaction(function () use ($user, $cartItems) {
            // Verify stock availability with row locks
            foreach ($cartItems as $cartItem) {
                $product = $cartItem->product->lockForUpdate()->find($cartItem->product_id);

                if ($product->stock_quantity < $cartItem->quantity) {
                    throw new \Exception("Insufficient stock for {$product->name}");
                }
            }

            // Create order
            $order = Order::create([
                'user_id' => $user->id,
                'total_amount' => $this->cartService->getCartTotal($user),
                'status' => 'pending',
            ]);

            // Create order items and reduce stock
            foreach ($cartItems as $cartItem) {
                $order->orderItems()->create([
                    'product_id' => $cartItem->product_id,
                    'quantity' => $cartItem->quantity,
                    'price' => $cartItem->product->price,
                ]);

                $this->stockService->reduceStock(
                    $cartItem->product,
                    $cartItem->quantity
                );
            }

            // Clear cart
            $this->cartService->clearCart($user);

            return $order;
        });
    }
}
