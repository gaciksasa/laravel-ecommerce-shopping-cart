<?php

namespace App\Services;

use App\Models\CartItem;
use App\Models\Product;
use App\Models\User;
use Illuminate\Support\Collection;

class CartService
{
    public function addToCart(User $user, int $productId, int $quantity): CartItem
    {
        $product = Product::findOrFail($productId);

        if ($product->stock_quantity < $quantity) {
            throw new \Exception('Insufficient stock available.');
        }

        $cartItem = CartItem::where('user_id', $user->id)
            ->where('product_id', $productId)
            ->first();

        if ($cartItem) {
            $newQuantity = $cartItem->quantity + $quantity;
            if ($product->stock_quantity < $newQuantity) {
                throw new \Exception('Insufficient stock available.');
            }
            $cartItem->update(['quantity' => $newQuantity]);
        } else {
            $cartItem = CartItem::create([
                'user_id' => $user->id,
                'product_id' => $productId,
                'quantity' => $quantity,
            ]);
        }

        return $cartItem->fresh();
    }

    public function updateCartItem(CartItem $cartItem, int $quantity): CartItem
    {
        if ($cartItem->product->stock_quantity < $quantity) {
            throw new \Exception('Insufficient stock available.');
        }

        $cartItem->update(['quantity' => $quantity]);

        return $cartItem->fresh();
    }

    public function removeFromCart(CartItem $cartItem): void
    {
        $cartItem->delete();
    }

    public function getCartItems(User $user): Collection
    {
        return CartItem::where('user_id', $user->id)
            ->with('product')
            ->get();
    }

    public function getCartTotal(User $user): float
    {
        return $this->getCartItems($user)
            ->sum(fn($item) => $item->quantity * $item->product->price);
    }

    public function clearCart(User $user): void
    {
        CartItem::where('user_id', $user->id)->delete();
    }
}
