import { Head, Link, useForm, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Index({ products }) {
    const { auth, flash } = usePage().props;
    const { data, setData, post, processing } = useForm({
        product_id: '',
        quantity: 1,
    });

    const handleAddToCart = (productId) => {
        setData({ product_id: productId, quantity: 1 });
        post(route('cart.store'), {
            preserveScroll: true,
            onSuccess: () => {
                setData({ product_id: '', quantity: 1 });
            },
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Products
                </h2>
            }
        >
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
                                        <div className="p-6">
                                            <h3 className="mb-2 text-xl font-semibold text-gray-900">
                                                {product.name}
                                            </h3>
                                            <p className="mb-4 text-sm text-gray-600">
                                                {product.description}
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
                                            {auth.user ? (
                                                <button
                                                    onClick={() => handleAddToCart(product.id)}
                                                    disabled={
                                                        product.stock_quantity === 0 ||
                                                        processing
                                                    }
                                                    className="w-full rounded-md bg-indigo-600 px-4 py-2 text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-gray-400"
                                                >
                                                    {product.stock_quantity === 0
                                                        ? 'Out of Stock'
                                                        : 'Add to Cart'}
                                                </button>
                                            ) : (
                                                <Link
                                                    href={route('login')}
                                                    className="block w-full rounded-md bg-indigo-600 px-4 py-2 text-center text-white transition hover:bg-indigo-700"
                                                >
                                                    Login to Purchase
                                                </Link>
                                            )}
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
        </AuthenticatedLayout>
    );
}
