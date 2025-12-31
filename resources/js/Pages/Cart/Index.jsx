import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export default function Index({ cartItems, cartTotal }) {
    const { flash } = usePage().props;
    const [processing, setProcessing] = useState(false);

    // Show toast notifications for flash messages
    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    const handleUpdateQuantity = (cartItemId, currentQuantity, action) => {
        const newQuantity = action === 'increment' ? currentQuantity + 1 : currentQuantity - 1;

        if (newQuantity < 1) return;

        setProcessing(true);
        router.patch(route('cart.update', cartItemId), {
            quantity: newQuantity,
        }, {
            preserveScroll: true,
            onFinish: () => setProcessing(false),
        });
    };

    const handleRemoveItem = (cartItemId) => {
        if (confirm('Are you sure you want to remove this item from your cart?')) {
            setProcessing(true);
            router.delete(route('cart.destroy', cartItemId), {
                preserveScroll: true,
                onFinish: () => setProcessing(false),
            });
        }
    };

    const handleCheckout = () => {
        setProcessing(true);
        router.post(route('orders.store'), {}, {
            onFinish: () => setProcessing(false),
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Shopping Cart
                </h2>
            }
        >
            <Head title="Shopping Cart" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {cartItems.length === 0 ? (
                                <div className="py-12 text-center">
                                    <p className="mb-4 text-gray-500">Your cart is empty</p>
                                    <a
                                        href={route('products.index')}
                                        className="inline-block rounded-md bg-indigo-600 px-6 py-2 text-white hover:bg-indigo-700"
                                    >
                                        Continue Shopping
                                    </a>
                                </div>
                            ) : (
                                <>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                        Product
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                        Price
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                        Quantity
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                        Subtotal
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                        Actions
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200 bg-white">
                                                {cartItems.map((item) => (
                                                    <tr key={item.id}>
                                                        <td className="whitespace-nowrap px-6 py-4">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {item.product.name}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                Stock: {item.product.stock_quantity}
                                                            </div>
                                                        </td>
                                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                                                            ${parseFloat(item.product.price).toFixed(2)}
                                                        </td>
                                                        <td className="whitespace-nowrap px-6 py-4">
                                                            <div className="flex items-center gap-2">
                                                                <button
                                                                    onClick={() =>
                                                                        handleUpdateQuantity(
                                                                            item.id,
                                                                            item.quantity,
                                                                            'decrement',
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        item.quantity <= 1 ||
                                                                        processing
                                                                    }
                                                                    className="rounded-md bg-gray-200 px-3 py-1 text-sm font-semibold hover:bg-gray-300 disabled:cursor-not-allowed disabled:bg-gray-100"
                                                                >
                                                                    -
                                                                </button>
                                                                <span className="w-8 text-center text-sm">
                                                                    {item.quantity}
                                                                </span>
                                                                <button
                                                                    onClick={() =>
                                                                        handleUpdateQuantity(
                                                                            item.id,
                                                                            item.quantity,
                                                                            'increment',
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        item.quantity >=
                                                                            item.product.stock_quantity ||
                                                                        processing
                                                                    }
                                                                    className="rounded-md bg-gray-200 px-3 py-1 text-sm font-semibold hover:bg-gray-300 disabled:cursor-not-allowed disabled:bg-gray-100"
                                                                >
                                                                    +
                                                                </button>
                                                            </div>
                                                        </td>
                                                        <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-gray-900">
                                                            ${(item.quantity * parseFloat(item.product.price)).toFixed(2)}
                                                        </td>
                                                        <td className="whitespace-nowrap px-6 py-4 text-sm">
                                                            <button
                                                                onClick={() => handleRemoveItem(item.id)}
                                                                disabled={processing}
                                                                className="text-red-600 hover:text-red-900 disabled:text-gray-400"
                                                            >
                                                                Remove
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="mt-6 flex flex-col items-end">
                                        <div className="mb-4 text-2xl font-bold">
                                            Total: ${parseFloat(cartTotal).toFixed(2)}
                                        </div>
                                        <div className="flex gap-4">
                                            <a
                                                href={route('products.index')}
                                                className="rounded-md bg-gray-200 px-6 py-2 text-gray-700 hover:bg-gray-300"
                                            >
                                                Continue Shopping
                                            </a>
                                            <button
                                                onClick={handleCheckout}
                                                className="rounded-md bg-indigo-600 px-6 py-2 text-white hover:bg-indigo-700"
                                            >
                                                Checkout
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
