import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ orders }) {
    const { flash } = usePage().props;
    const [expandedOrderId, setExpandedOrderId] = useState(null);

    const toggleOrderDetails = (orderId) => {
        setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
    };

    const getStatusBadgeClass = (status) => {
        const classes = {
            pending: 'bg-yellow-100 text-yellow-800',
            processing: 'bg-blue-100 text-blue-800',
            completed: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800',
        };
        return classes[status] || 'bg-gray-100 text-gray-800';
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    My Orders
                </h2>
            }
        >
            <Head title="My Orders" />

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

                            {orders.data.length === 0 ? (
                                <div className="py-12 text-center">
                                    <p className="mb-4 text-gray-500">
                                        You haven't placed any orders yet
                                    </p>
                                    <a
                                        href={route('products.index')}
                                        className="inline-block rounded-md bg-indigo-600 px-6 py-2 text-white hover:bg-indigo-700"
                                    >
                                        Start Shopping
                                    </a>
                                </div>
                            ) : (
                                <>
                                    <div className="space-y-4">
                                        {orders.data.map((order) => (
                                            <div
                                                key={order.id}
                                                className="overflow-hidden rounded-lg border border-gray-200"
                                            >
                                                <div
                                                    className="flex cursor-pointer items-center justify-between bg-gray-50 p-4 hover:bg-gray-100"
                                                    onClick={() => toggleOrderDetails(order.id)}
                                                >
                                                    <div className="flex items-center gap-6">
                                                        <div>
                                                            <p className="font-semibold text-gray-900">
                                                                Order #{order.id}
                                                            </p>
                                                            <p className="text-sm text-gray-500">
                                                                {new Date(
                                                                    order.created_at,
                                                                ).toLocaleDateString('en-US', {
                                                                    year: 'numeric',
                                                                    month: 'long',
                                                                    day: 'numeric',
                                                                    hour: '2-digit',
                                                                    minute: '2-digit',
                                                                })}
                                                            </p>
                                                        </div>
                                                        <span
                                                            className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${getStatusBadgeClass(order.status)}`}
                                                        >
                                                            {order.status}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <p className="text-lg font-bold text-gray-900">
                                                            ${parseFloat(order.total_amount).toFixed(2)}
                                                        </p>
                                                        <svg
                                                            className={`h-5 w-5 transform transition-transform ${
                                                                expandedOrderId === order.id
                                                                    ? 'rotate-180'
                                                                    : ''
                                                            }`}
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M19 9l-7 7-7-7"
                                                            />
                                                        </svg>
                                                    </div>
                                                </div>

                                                {expandedOrderId === order.id && (
                                                    <div className="border-t border-gray-200 p-4">
                                                        <h4 className="mb-3 font-semibold text-gray-900">
                                                            Order Items
                                                        </h4>
                                                        <table className="min-w-full divide-y divide-gray-200">
                                                            <thead className="bg-gray-50">
                                                                <tr>
                                                                    <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                                        Product
                                                                    </th>
                                                                    <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                                        Price
                                                                    </th>
                                                                    <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                                        Quantity
                                                                    </th>
                                                                    <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                                        Subtotal
                                                                    </th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className="divide-y divide-gray-200 bg-white">
                                                                {order.order_items.map((item) => (
                                                                    <tr key={item.id}>
                                                                        <td className="whitespace-nowrap px-4 py-2 text-sm text-gray-900">
                                                                            {item.product.name}
                                                                        </td>
                                                                        <td className="whitespace-nowrap px-4 py-2 text-sm text-gray-900">
                                                                            $
                                                                            {parseFloat(
                                                                                item.price,
                                                                            ).toFixed(2)}
                                                                        </td>
                                                                        <td className="whitespace-nowrap px-4 py-2 text-sm text-gray-900">
                                                                            {item.quantity}
                                                                        </td>
                                                                        <td className="whitespace-nowrap px-4 py-2 text-sm font-semibold text-gray-900">
                                                                            $
                                                                            {(
                                                                                item.quantity *
                                                                                parseFloat(item.price)
                                                                            ).toFixed(2)}
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    {orders.links.length > 3 && (
                                        <div className="mt-6 flex justify-center gap-1">
                                            {orders.links.map((link, index) => (
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
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
