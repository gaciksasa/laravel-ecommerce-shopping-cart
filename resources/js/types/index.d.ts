export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string;
}

export interface Product {
    id: number;
    name: string;
    description: string | null;
    price: string | number;
    stock_quantity: number;
    quantity_in_cart: number;
    image_url: string | null;
    created_at: string;
    updated_at: string;
}

export interface CartItem {
    id: number;
    user_id: number;
    product_id: number;
    quantity: number;
    product: Product;
    created_at: string;
    updated_at: string;
}

export interface OrderItem {
    id: number;
    order_id: number;
    product_id: number;
    quantity: number;
    price: string | number;
    product: Product;
    created_at: string;
    updated_at: string;
}

export interface Order {
    id: number;
    user_id: number;
    total_amount: string | number;
    status: 'pending' | 'processing' | 'completed' | 'cancelled';
    order_items: OrderItem[];
    created_at: string;
    updated_at: string;
}

export interface PaginatedData<T> {
    data: T[];
    links: PaginationLink[];
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
}

export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

export interface Flash {
    success?: string;
    error?: string;
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    auth: {
        user: User;
        cartCount: number;
    };
    flash: Flash;
};
