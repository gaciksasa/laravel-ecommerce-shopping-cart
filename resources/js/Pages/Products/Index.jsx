import { Head, Link, router, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';

export default function Index({ products, filters }) {
    const { auth, flash } = usePage().props;
    const [processing, setProcessing] = useState(false);
    const [sort, setSort] = useState(filters.sort || 'name_asc');
    const searchTimeoutRef = useRef(null);
    const searchInputRef = useRef(null);
    const isTyping = useRef(false);

    // Sync input value with server state only when not typing
    useEffect(() => {
        if (!isTyping.current && searchInputRef.current) {
            searchInputRef.current.value = filters.search || '';
        }
    }, [filters.search]);

    // Sync sort with server state
    useEffect(() => {
        if (!isTyping.current) {
            setSort(filters.sort || 'name_asc');
        }
    }, [filters.sort]);

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, []);

    // Show toast notifications for flash messages
    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    const performSearch = (searchValue, sortValue) => {
        router.get(
            route('products.index'),
            { search: searchValue, sort: sortValue },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
                only: ['products', 'filters'],
                preserveFocus: true,
                onSuccess: () => {
                    // Mark typing as complete only after server response
                    isTyping.current = false;

                    // Restore focus to search input after Inertia updates
                    if (searchInputRef.current && document.activeElement !== searchInputRef.current) {
                        searchInputRef.current.focus();
                    }
                }
            }
        );
    };

    const debouncedSearch = (searchValue, sortValue) => {
        // Clear any existing timeout
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        // Set new timeout - search will only trigger 500ms after last character
        searchTimeoutRef.current = setTimeout(() => {
            performSearch(searchValue, sortValue);
        }, 500);
    };

    const handleSearchChange = (e) => {
        const newSearch = e.target.value;

        // Mark as typing to prevent server state from interfering
        isTyping.current = true;

        // Trigger debounced search - will only execute 500ms after user stops typing
        // Read value directly from input, no React state needed
        debouncedSearch(newSearch, sort);
    };

    const handleSortChange = (e) => {
        const newSort = e.target.value;
        setSort(newSort);
        // Read current search value from input
        const currentSearch = searchInputRef.current?.value || '';
        performSearch(currentSearch, newSort);
    };

    const handleClearFilters = () => {
        // Clear the input field directly
        if (searchInputRef.current) {
            searchInputRef.current.value = '';
        }
        setSort('name_asc');
        performSearch('', 'name_asc');
    };

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
                            {/* Search and Sort Filters */}
                            <div className="mb-6 rounded-lg bg-gray-50 p-4">
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                                    {/* Search Input */}
                                    <div className="flex-1">
                                        <label htmlFor="search" className="block text-sm font-medium text-gray-700">
                                            Search Products
                                        </label>
                                        <input
                                            ref={searchInputRef}
                                            type="text"
                                            id="search"
                                            defaultValue={filters.search || ''}
                                            onChange={handleSearchChange}
                                            placeholder="Search by name or description..."
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        />
                                    </div>

                                    {/* Sort Dropdown */}
                                    <div className="flex-1">
                                        <label htmlFor="sort" className="block text-sm font-medium text-gray-700">
                                            Sort By
                                        </label>
                                        <select
                                            id="sort"
                                            value={sort}
                                            onChange={handleSortChange}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        >
                                            <option value="name_asc">Name (A-Z)</option>
                                            <option value="name_desc">Name (Z-A)</option>
                                            <option value="price_asc">Price (Low to High)</option>
                                            <option value="price_desc">Price (High to Low)</option>
                                            <option value="stock_asc">Stock (Low to High)</option>
                                            <option value="stock_desc">Stock (High to Low)</option>
                                        </select>
                                    </div>

                                    {/* Clear Button */}
                                    {(filters.search || sort !== 'name_asc') && (
                                        <div>
                                            <button
                                                type="button"
                                                onClick={handleClearFilters}
                                                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                            >
                                                Clear Filters
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Results Count */}
                            <div className="mb-4 text-sm text-gray-600">
                                Showing {products.data.length} of {products.total} products
                            </div>

                            {products.data.length === 0 ? (
                                <div className="rounded-lg bg-gray-50 p-12 text-center">
                                    <svg
                                        className="mx-auto h-12 w-12 text-gray-400"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">No products found</h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Try adjusting your search or filter to find what you're looking for.
                                    </p>
                                    {(filters.search || sort !== 'name_asc') && (
                                        <button
                                            onClick={handleClearFilters}
                                            className="mt-4 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                                        >
                                            Clear all filters
                                        </button>
                                    )}
                                </div>
                            ) : (
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
                            )}

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
