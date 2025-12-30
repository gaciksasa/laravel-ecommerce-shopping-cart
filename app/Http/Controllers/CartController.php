<?php

namespace App\Http\Controllers;

use App\Http\Requests\AddToCartRequest;
use App\Http\Requests\UpdateCartItemRequest;
use App\Models\CartItem;
use App\Services\CartService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class CartController extends Controller
{
    public function __construct(
        private CartService $cartService
    ) {}

    public function index(): Response
    {
        $cartItems = $this->cartService->getCartItems(auth()->user());
        $cartTotal = $this->cartService->getCartTotal(auth()->user());

        return Inertia::render('Cart/Index', [
            'cartItems' => $cartItems->load('product'),
            'cartTotal' => $cartTotal,
        ]);
    }

    public function store(AddToCartRequest $request): RedirectResponse
    {
        try {
            $this->cartService->addToCart(
                auth()->user(),
                $request->product_id,
                $request->quantity
            );

            return redirect()->back()->with('success', 'Product added to cart!');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    public function update(UpdateCartItemRequest $request, CartItem $cartItem): RedirectResponse
    {
        try {
            $this->cartService->updateCartItem($cartItem, $request->quantity);

            return redirect()->back()->with('success', 'Cart updated!');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    public function destroy(CartItem $cartItem): RedirectResponse
    {
        if ($cartItem->user_id !== auth()->id()) {
            abort(403);
        }

        $this->cartService->removeFromCart($cartItem);

        return redirect()->back()->with('success', 'Item removed from cart!');
    }
}
