# Laravel E-Commerce Shopping Cart

A full-featured e-commerce shopping cart application built with Laravel Breeze and React (Inertia.js), featuring database-backed cart storage, automated stock management, queue-based email notifications, and scheduled reporting.

## Features

### Core Functionality
- **Product Catalog**: Browse products with pagination, stock levels, and pricing
- **Database-Backed Shopping Cart**: Persistent cart storage associated with authenticated users
- **Cart Management**: Add items, update quantities, remove items with real-time validation
- **Order Checkout**: Secure order processing with database transactions and stock locking
- **Stock Management**: Automatic stock reduction on checkout with concurrency protection
- **Order History**: View past orders with expandable item details

### Background Jobs & Notifications
- **Low Stock Reports**: Daily consolidated report at 09:00 listing all products with stock < 5 units
- **Daily Sales Reports**: Scheduled reports sent at 23:59 daily with sales breakdown
- **Queue System**: Database-driven queue for reliable background processing

### Technical Features
- **Authentication**: Laravel Breeze with React (Inertia.js)
- **TypeScript**: Full TypeScript support with TSX components for type safety
- **Service Layer Pattern**: Separation of business logic (CartService, OrderService, StockService)
- **Form Request Validation**: Request validation with authorization checks
- **Database Transactions**: ACID compliance with row-level locking to prevent overselling
- **Price Snapshots**: Historical price accuracy in order items
- **Real-Time Stock Updates**: User-specific available stock display with color-coded indicators
- **Modern UI**: Contemporary light color scheme with Slate/Sky palette
- **Responsive Design**: Mobile-friendly UI with Tailwind CSS

### UI/UX Features
- **Real-Time Stock Display**: Available stock updates instantly when adding to cart
- **Color-Coded Stock Indicators**:
  - 🟢 Green: More than 5 units available
  - 🟡 Yellow: 1-5 units available (low stock warning)
  - 🔴 Red: Out of stock
- **User-Specific Stock**: Shows `stock_quantity - quantity_in_cart` for personalized availability
- **Toast Notifications**: Non-intrusive success/error messages using react-hot-toast
- **Streamlined Navigation**: Orders moved to user dropdown for cleaner interface
- **Modern Color Palette**: Slate and Sky tones for contemporary, professional look

## Tech Stack

- **Backend**: Laravel 12.44.0 (PHP 8.2+)
- **Frontend**: React 18 with Inertia.js and TypeScript
- **Styling**: Tailwind CSS 3.x
- **Database**: MySQL
- **Queue**: Database driver
- **Email**: Mailtrap (development), SMTP (production)

## Installation

### Prerequisites
- PHP 8.2 or higher
- Composer
- Node.js & npm
- MySQL database
- Git

### Setup Instructions

1. **Clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/laravel-ecommerce-shopping-cart.git
cd laravel-ecommerce-shopping-cart
```

2. **Install PHP dependencies**
```bash
composer install
```

3. **Install JavaScript dependencies**
```bash
npm install
```

4. **Environment configuration**
```bash
cp .env.example .env
php artisan key:generate
```

5. **Configure database in `.env`**
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=laravel_ecommerce
DB_USERNAME=root
DB_PASSWORD=your_password

QUEUE_CONNECTION=database
```

6. **Configure email testing (Mailtrap)**

For development, use [Mailtrap](https://mailtrap.io) to test email functionality without sending real emails:

1. Sign up for free at [mailtrap.io](https://mailtrap.io)
2. Go to **Email Testing** → **Inboxes** → **My Inbox**
3. Select **Laravel 9+** from integrations
4. Update `.env` with your Mailtrap credentials:

```env
MAIL_MAILER=smtp
MAIL_HOST=sandbox.smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=your_mailtrap_username
MAIL_PASSWORD=your_mailtrap_password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="hello@example.com"
MAIL_FROM_NAME="${APP_NAME}"
```

All emails (low stock alerts, daily sales reports) will appear in your Mailtrap inbox instead of being sent to real addresses.

**For production**, update `.env` with real SMTP settings (e.g., Gmail, SendGrid, Loopia).

7. **Create database**
```bash
# Using MySQL CLI
mysql -u root -p -e "CREATE DATABASE laravel_ecommerce CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci"

# Or using PHP script (if MySQL CLI not available)
php -r "
\$pdo = new PDO('mysql:host=127.0.0.1', 'root', 'your_password');
\$pdo->exec('CREATE DATABASE IF NOT EXISTS laravel_ecommerce CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci');
echo 'Database created successfully!';
"
```

8. **Run migrations and seeders**
```bash
php artisan migrate --seed
```

This will create all tables and seed:
- Admin user (email: `admin@example.com`, password: `password`)
- 10 sample products with varying stock levels

9. **Build frontend assets**
```bash
# Development
npm run dev

# Production
npm run build
```

10. **Start the application**

Terminal 1 - Web server:
```bash
php artisan serve
```

Terminal 2 - Queue worker:
```bash
php artisan queue:work --tries=3
```

Terminal 3 - Task scheduler (for daily reports):
```bash
# Development
php artisan schedule:work

# Production: Add to crontab
* * * * * cd /path-to-project && php artisan schedule:run >> /dev/null 2>&1
```

11. **Access the application**
```
http://localhost:8000
```

## Default Credentials

- **Admin User**
  - Email: `admin@example.com`
  - Password: `password`

## Database Schema

### Products Table
- `id`, `name`, `description`, `price`, `stock_quantity`, `timestamps`
- Index on `stock_quantity` for low stock queries

### Cart Items Table
- `id`, `user_id`, `product_id`, `quantity`, `timestamps`
- Unique constraint on (`user_id`, `product_id`)
- Foreign keys: `user_id` → users, `product_id` → products

### Orders Table
- `id`, `user_id`, `total_amount`, `status` (enum: pending/processing/completed/cancelled), `timestamps`
- Indexes on `user_id`, `created_at`, `status`

### Order Items Table
- `id`, `order_id`, `product_id`, `quantity`, `price` (snapshot), `timestamps`
- Foreign keys: `order_id` → orders, `product_id` → products (restrict on delete)

## Application Architecture

### Service Layer

**CartService** ([app/Services/CartService.php](app/Services/CartService.php))
- `addToCart($user, $productId, $quantity)` - Adds items with stock validation
- `updateCartItem($cartItem, $quantity)` - Updates quantity with validation
- `removeFromCart($cartItem)` - Removes item from cart
- `getCartItems($user)` - Retrieves user's cart items
- `getCartTotal($user)` - Calculates total cart value
- `clearCart($user)` - Empties user's cart

**OrderService** ([app/Services/OrderService.php](app/Services/OrderService.php))
- `createOrderFromCart($user)` - Creates order with transaction & locks

**StockService** ([app/Services/StockService.php](app/Services/StockService.php))
- `reduceStock($product, $quantity)` - Decrements stock
- `checkAndNotifyLowStock($product)` - Dispatches low stock job if ≤ 5

### Queue Jobs

**SendLowStockReport** ([app/Jobs/SendLowStockReport.php](app/Jobs/SendLowStockReport.php))
- Scheduled daily at 09:00 (configured in [routes/console.php](routes/console.php#L17-L19))
- Checks all products with `stock_quantity < 5`
- Sends consolidated report to `info@gacikdesign.com`
- Includes product names, current stock levels, and status indicators
- Only sends email if low stock products are found

**SendDailySalesReport** ([app/Jobs/SendDailySalesReport.php](app/Jobs/SendDailySalesReport.php))
- Scheduled daily at 23:59 (configured in [routes/console.php](routes/console.php#L13-L15))
- Aggregates orders created that day
- Sends report with total orders, revenue, products sold breakdown
- Sent to `info@gacikdesign.com`

### Form Requests

**AddToCartRequest** ([app/Http/Requests/AddToCartRequest.php](app/Http/Requests/AddToCartRequest.php))
- Validates `product_id` (exists) and `quantity` (integer, min: 1)
- Authorization: User must be authenticated

**UpdateCartItemRequest** ([app/Http/Requests/UpdateCartItemRequest.php](app/Http/Requests/UpdateCartItemRequest.php#L14))
- Validates `quantity` (integer, min: 1)
- Authorization: Cart item must belong to authenticated user

## Routes

### Public Routes
- `GET /` - Product listing (redirects to products.index)

### Authenticated Routes
- `GET /cart` - View cart
- `POST /cart` - Add item to cart
- `PATCH /cart/{cartItem}` - Update cart item quantity
- `DELETE /cart/{cartItem}` - Remove cart item
- `GET /orders` - View order history
- `POST /orders` - Checkout (create order from cart)

## Testing Guide

### Manual Testing Workflow

1. **Register a new user**
   - Navigate to `/register`
   - Create an account and verify email (auto-verified)

2. **Browse products**
   - Visit homepage to see 15 products per page
   - Note available stock levels (user-specific: stock_quantity - quantity_in_cart)
   - Color indicators: green (> 5), yellow (1-5), red (out of stock)

3. **Add items to cart**
   - Click "Add to Cart" on available products
   - Verify success message appears via toast notification
   - Watch available stock decrease in real-time
   - Try adding out-of-stock items (button should be disabled)
   - On product details page, adjust quantity with +/- buttons

4. **View and manage cart**
   - Navigate to Cart page
   - Increase/decrease quantities using +/- buttons
   - Verify subtotals update correctly
   - Remove items using "Remove" button
   - Verify total calculation

5. **Checkout**
   - Click "Checkout" button
   - Verify redirect to Orders page with success message
   - Check that cart is now empty
   - Return to Products page and verify stock quantities decreased

6. **View orders**
   - Navigate to Orders page
   - Expand order to view items
   - Verify prices match purchase time (not current prices)

7. **Test low stock report**
```bash
# Manually trigger the low stock report
php artisan tinker
>>> dispatch(new \App\Jobs\SendLowStockReport);
>>> exit

# Check your Mailtrap inbox for the consolidated low stock report
# Report lists all products with stock < 5 in a table format
```

8. **Test daily sales report**
```bash
# Manually trigger the job
php artisan tinker
>>> dispatch(new \App\Jobs\SendDailySalesReport);
>>> exit

# Check your Mailtrap inbox for the daily sales report email
# Report includes: total orders, revenue, and products sold breakdown
```

9. **Test concurrency (optional)**
   - Open cart in two browser tabs
   - Try checking out simultaneously with products having low stock
   - Verify only one checkout succeeds or stock validation prevents overselling

### Queue Testing

Start the queue worker in a separate terminal:
```bash
php artisan queue:work --verbose
```

Watch for job processing:
- Low stock notifications appear when stock ≤ 5
- Failed jobs are logged with stack traces
- Retry failed jobs: `php artisan queue:retry all`

### Email Inspection

**With Mailtrap (Recommended for Development)**:
1. Log in to [mailtrap.io](https://mailtrap.io)
2. Navigate to your inbox
3. View all sent emails with full HTML rendering, headers, and attachments
4. Test spam scores and email client compatibility

**With Log Driver (Alternative)**:
If using `MAIL_MAILER=log` in `.env`, emails are written to `storage/logs/laravel.log`:
```bash
# Tail the log file
tail -f storage/logs/laravel.log

# Or view on Windows
Get-Content storage\logs\laravel.log -Wait
```

## Project Structure

```
app/
├── Http/
│   ├── Controllers/
│   │   ├── CartController.php
│   │   ├── OrderController.php
│   │   └── ProductController.php
│   └── Requests/
│       ├── AddToCartRequest.php
│       └── UpdateCartItemRequest.php
├── Jobs/
│   ├── SendLowStockReport.php
│   └── SendDailySalesReport.php
├── Mail/
│   ├── DailySalesReport.php
│   ├── LowStockAlert.php (legacy)
│   └── LowStockReport.php
├── Models/
│   ├── CartItem.php
│   ├── Order.php
│   ├── OrderItem.php
│   ├── Product.php
│   └── User.php
└── Services/
    ├── CartService.php
    ├── OrderService.php
    └── StockService.php

resources/
├── js/
│   ├── Components/
│   ├── Layouts/
│   │   └── AuthenticatedLayout.tsx
│   ├── Pages/
│   │   ├── Cart/
│   │   │   └── Index.tsx
│   │   ├── Orders/
│   │   │   └── Index.tsx
│   │   ├── Products/
│   │   │   ├── Index.tsx
│   │   │   └── Show.tsx
│   │   └── Profile/
│   │       └── Edit.tsx
│   └── types/
│       └── index.d.ts
└── views/
    └── emails/
        ├── daily-sales-report.blade.php
        ├── low-stock-alert.blade.php (legacy)
        └── low-stock-report.blade.php
```

## GitHub Repository Setup

To push this project to GitHub:

1. **Create a new repository on GitHub**
   - Go to https://github.com/new
   - Name: `laravel-ecommerce-shopping-cart`
   - Visibility: Public or Private
   - Do NOT initialize with README (we already have one)

2. **Add remote and push**
```bash
git remote add origin https://github.com/YOUR_USERNAME/laravel-ecommerce-shopping-cart.git
git branch -M main
git push -u origin main
```

3. **Add collaborator** (GitHub web interface)
   - Go to repository Settings → Collaborators
   - Click "Add people"
   - Search for and add: `dylanmichaelryan`

## Key Implementation Details

### Stock Concurrency Control
Order creation uses database transactions with row-level locks ([app/Services/OrderService.php](app/Services/OrderService.php#L20-L56)):
```php
DB::transaction(function () {
    $product = Product::lockForUpdate()->find($productId);
    // Verify stock and create order...
});
```

### Low Stock Notification Trigger
Dispatched after stock reduction ([app/Services/StockService.php](app/Services/StockService.php#L20-L25)):
```php
if ($product->isLowStock()) {
    ProcessLowStockNotification::dispatch($product);
}
```

### Task Scheduler Configuration
Scheduled jobs configured in [routes/console.php](routes/console.php):

**Daily Sales Report** (runs at 23:59):
```php
Schedule::job(new SendDailySalesReport)
    ->dailyAt('23:59')
    ->timezone(config('app.timezone'));
```

**Low Stock Report** (runs at 09:00):
```php
Schedule::job(new SendLowStockReport)
    ->dailyAt('09:00')
    ->timezone(config('app.timezone'));
```

## Troubleshooting

### Issue: Queue jobs not processing
**Solution**: Ensure queue worker is running:
```bash
php artisan queue:work --verbose
```

### Issue: Emails not being sent to Mailtrap
**Solution**:
1. Verify `.env` has correct Mailtrap credentials
2. Check queue worker is running: `php artisan queue:work`
3. Check failed jobs: `php artisan queue:failed`
4. Clear config cache: `php artisan config:clear`
5. Verify internet connection (Mailtrap requires outbound SMTP access)

### Issue: Stock quantity not updating
**Solution**: Check database transaction isolation level and ensure queue worker is processing jobs

### Issue: Frontend changes not reflecting
**Solution**:
```bash
npm run build
php artisan optimize:clear
```

### Issue: MySQL string length error
**Solution**: Already configured in [app/Providers/AppServiceProvider.php](app/Providers/AppServiceProvider.php#L15-L17):
```php
Schema::defaultStringLength(191);
```

## Development Commands

```bash
# Clear all caches
php artisan optimize:clear

# View scheduled tasks
php artisan schedule:list

# View queue jobs
php artisan queue:monitor

# Fresh migration with seed
php artisan migrate:fresh --seed

# Run tests (if configured)
php artisan test

# Check routes
php artisan route:list

# Format code (if configured)
./vendor/bin/pint
```

## License

This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).

## Credits

Built with [Laravel](https://laravel.com) and [Laravel Breeze](https://laravel.com/docs/starter-kits#laravel-breeze).

---

🤖 Generated with [Claude Code](https://claude.com/claude-code)
