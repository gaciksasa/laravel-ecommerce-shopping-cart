import { Head, Link, router, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { useState } from 'react';

export default function Index({ products }) {
    const { auth, flash } = usePage().props;
    const [processing, setProcessing] = useState(false);

    const handleAddToCart = (productId) => {
        setProcessing(true);
        router.post(route('cart.store'), {
            product_id: productId,
            quantity: 1,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setProcessing(false);
                console.log('Item added to cart successfully!');
            },
            onError: (errors) => {
                setProcessing(false);
                console.log('Error adding to cart:', errors);
            },
            onFinish: () => {
                setProcessing(false);
            },
        });
    };

    const ProductContent = () => (
        <>
            <Head title="Products" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {flash?.success && (
                                <div className="mb-4 rounded-lg bg-green-50 p-4 text-green-800">
                                    {flash.success}
                                </div>
                            )}

                            {flash?.error && (
                                <div className="mb-4 rounded-lg bg-red-50 p-4 text-red-800">
                                    {flash.error}
                                </div>
                            )}

                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {products.data.map((product) => (
                                    <div
                                        key={product.id}
                                        className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
                                    >
                                        {/* Product Image */}
                                        <Link href={route('products.show', product.id)}>
                                            <div className="aspect-square overflow-hidden bg-gray-100">
                                                {product.image_url ? (
                                                    <img
                                                        src={product.image_url}
                                                        alt={product.name}
                                                        className="h-full w-full object-cover transition hover:scale-105"
                                                    />
                                                ) : (
                                                    <div className="flex h-full items-center justify-center text-gray-400">
                                                        <svg
                                                            className="h-16 w-16"
                                                            fill="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>
                                        </Link>
                                        <div className="p-6">
                                            <Link
                                                href={route('products.show', product.id)}
                                                className="group"
                                            >
                                                <h3 className="mb-2 text-xl font-semibold text-gray-900 group-hover:text-indigo-600">
                                                    {product.name}
                                                </h3>
                                            </Link>
                                            <p className="mb-4 line-clamp-2 text-sm text-gray-600">
                                                {product.description || 'No description available'}
                                            </p>
                                            <div className="mb-4 flex items-center justify-between">
                                                <span className="text-2xl font-bold text-gray-900">
                                                    ${parseFloat(product.price).toFixed(2)}
                                                </span>
                                                <span
                                                    className={`text-sm ${
                                                        product.stock_quantity === 0
                                                            ? 'text-red-600'
                                                            : product.stock_quantity <= 5
                                                              ? 'text-yellow-600'
                                                              : 'text-green-600'
                                                    }`}
                                                >
                                                    {product.stock_quantity === 0
                                                        ? 'Out of Stock'
                                                        : `${product.stock_quantity} in stock`}
                                                </span>
                                            </div>
                                            <div className="flex gap-2">
                                                <Link
                                                    href={route('products.show', product.id)}
                                                    className="flex-1 rounded-md border border-indigo-600 px-4 py-2 text-center text-indigo-600 transition hover:bg-indigo-50"
                                                >
                                                    View Details
                                                </Link>
                                                {auth.user && (
                                                    <button
                                                        onClick={() => handleAddToCart(product.id)}
                                                        disabled={
                                                            product.stock_quantity === 0 ||
                                                            processing
                                                        }
                                                        className="flex-1 rounded-md bg-indigo-600 px-4 py-2 text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-gray-400"
                                                    >
                                                        {product.stock_quantity === 0
                                                            ? 'Out of Stock'
                                                            : 'Add to Cart'}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {products.links.length > 3 && (
                                <div className="mt-6 flex justify-center gap-1">
                                    {products.links.map((link, index) => (
                                        <Link
                                            key={index}
                                            href={link.url || '#'}
                                            preserveScroll
                                            className={`rounded px-3 py-2 text-sm ${
                                                link.active
                                                    ? 'bg-indigo-600 text-white'
                                                    : link.url
                                                      ? 'bg-white text-gray-700 hover:bg-gray-50'
                                                      : 'cursor-not-allowed bg-gray-100 text-gray-400'
                                            }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );

    // If user is authenticated, use AuthenticatedLayout
    if (auth.user) {
        return (
            <AuthenticatedLayout
                header={
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Products
                    </h2>
                }
            >
                <ProductContent />
            </AuthenticatedLayout>
        );
    }

    // If user is a guest, use a simple public layout
    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="border-b border-gray-100 bg-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex shrink-0 items-center">
                            <Link href="/">
                                <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800" />
                            </Link>
                            <span className="ml-4 text-xl font-semibold text-gray-800">
                                Laravel E-Commerce
                            </span>
                        </div>
                        <div className="flex items-center gap-4">
                            <Link
                                href={route('login')}
                                className="rounded-md px-4 py-2 text-gray-700 hover:text-gray-900"
                            >
                                Log in
                            </Link>
                            <Link
                                href={route('register')}
                                className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
                            >
                                Register
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>
            <ProductContent />
        </div>
    );
}
