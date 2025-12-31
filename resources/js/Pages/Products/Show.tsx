import { Head, Link, router, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { PageProps, Product } from '@/types';

export default function Show({ product }: { product: Product }) {
    const { auth, flash } = usePage<PageProps>().props;
    const [quantity, setQuantity] = useState(1);
    const [processing, setProcessing] = useState(false);

    // Calculate available stock (total stock - quantity already in cart)
    const availableStock = product.stock_quantity - product.quantity_in_cart;

    // Show toast notifications for flash messages
    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    const handleAddToCart = () => {
        setProcessing(true);
        router.post(route('cart.store'), {
            product_id: product.id,
            quantity: quantity,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setQuantity(1);
                // Reload page data to get updated stock
                router.reload({
                    preserveScroll: true,
                    onFinish: () => setProcessing(false),
                });
            },
            onError: (errors) => {
                setProcessing(false);
                console.log('Error adding to cart:', errors);
            },
        });
    };

    const incrementQuantity = () => {
        if (quantity < availableStock) {
            setQuantity(quantity + 1);
        }
    };

    const decrementQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const ProductContent = () => (
        <>
            <Head title={product.name} />

            <div className="mb-6">
                <Link
                    href={route('products.index')}
                    className="text-indigo-600 hover:text-indigo-800"
                >
                    ← Back to Products
                </Link>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
                {/* Product Image */}
                <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
                    {product.image_url ? (
                        <img
                            src={product.image_url}
                            alt={product.name}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center text-gray-400">
                            <svg
                                className="h-32 w-32"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                            </svg>
                        </div>
                    )}
                </div>

                {/* Product Details */}
                <div>
                    <h1 className="mb-4 text-3xl font-bold text-gray-900">
                        {product.name}
                    </h1>

                    <div className="mb-6">
                        <p className="text-4xl font-bold text-indigo-600">
                            ${parseFloat(product.price.toString()).toFixed(2)}
                        </p>
                    </div>

                    <div className="mb-6">
                        <p className="text-gray-700">
                            {product.description || 'No description available.'}
                        </p>
                    </div>

                    <div className="mb-6">
                        <p className="text-sm text-gray-600">
                            Stock:{' '}
                            <span
                                className={
                                    availableStock > 0
                                        ? 'font-semibold text-green-600'
                                        : 'font-semibold text-red-600'
                                }
                            >
                                {availableStock > 0
                                    ? `${availableStock} available`
                                    : 'Out of stock'}
                            </span>
                        </p>
                    </div>

                    {auth.user && availableStock > 0 && (
                        <div className="mb-6">
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Quantity
                            </label>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={decrementQuantity}
                                        disabled={quantity <= 1 || processing}
                                        className="rounded-md bg-gray-200 px-4 py-2 font-semibold hover:bg-gray-300 disabled:cursor-not-allowed disabled:bg-gray-100"
                                    >
                                        -
                                    </button>
                                    <span className="w-12 text-center text-lg font-semibold">
                                        {quantity}
                                    </span>
                                    <button
                                        onClick={incrementQuantity}
                                        disabled={
                                            quantity >= availableStock ||
                                            processing
                                        }
                                        className="rounded-md bg-gray-200 px-4 py-2 font-semibold hover:bg-gray-300 disabled:cursor-not-allowed disabled:bg-gray-100"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {auth.user ? (
                        availableStock > 0 ? (
                            <button
                                onClick={handleAddToCart}
                                disabled={processing}
                                className="w-full rounded-md bg-indigo-600 px-6 py-3 text-lg font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-400"
                            >
                                {processing ? 'Adding...' : 'Add to Cart'}
                            </button>
                        ) : (
                            <button
                                disabled
                                className="w-full cursor-not-allowed rounded-md bg-gray-300 px-6 py-3 text-lg font-semibold text-gray-500"
                            >
                                Out of Stock
                            </button>
                        )
                    ) : (
                        <div className="rounded-md bg-gray-50 p-4 text-center">
                            <p className="mb-3 text-gray-700">
                                Please log in to add items to your cart
                            </p>
                            <div className="flex justify-center gap-4">
                                <Link
                                    href={route('login')}
                                    className="rounded-md bg-indigo-600 px-6 py-2 text-white hover:bg-indigo-700"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="rounded-md bg-gray-200 px-6 py-2 text-gray-700 hover:bg-gray-300"
                                >
                                    Register
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );

    if (auth.user) {
        return (
            <AuthenticatedLayout
                header={
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Product Details
                    </h2>
                }
            >
                <div className="py-12">
                    <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                        <div className="overflow-hidden bg-white p-6 shadow-sm sm:rounded-lg">
                            <ProductContent />
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }

    // Guest layout
    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="border-b border-gray-100 bg-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex items-center">
                            <Link href={route('products.index')}>
                                <ApplicationLogo className="h-9 w-auto fill-current text-gray-800" />
                            </Link>
                        </div>
                        <div className="flex items-center gap-4">
                            <Link
                                href={route('login')}
                                className="rounded-md px-3 py-2 text-gray-700 hover:bg-gray-100"
                            >
                                Log in
                            </Link>
                            <Link
                                href={route('register')}
                                className="rounded-md bg-indigo-600 px-3 py-2 text-white hover:bg-indigo-700"
                            >
                                Register
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white p-6 shadow-sm sm:rounded-lg">
                        <ProductContent />
                    </div>
                </div>
            </div>
        </div>
    );
}
