<?php

namespace App\Jobs;

use App\Mail\DailySalesReport as DailySalesReportMail;
use App\Models\Order;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class SendDailySalesReport implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct() {}

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $today = now()->startOfDay();

        $orders = Order::whereDate('created_at', $today)
            ->with('orderItems.product')
            ->get();

        $salesData = [
            'date' => $today->format('Y-m-d'),
            'total_orders' => $orders->count(),
            'total_revenue' => $orders->sum('total_amount'),
            'products_sold' => $this->getProductsSold($orders),
        ];

        Mail::to('info@gacikdesign.com')
            ->send(new DailySalesReportMail($salesData));
    }

    /**
     * Get products sold aggregated by product.
     */
    private function getProductsSold($orders): array
    {
        $products = [];

        foreach ($orders as $order) {
            foreach ($order->orderItems as $item) {
                $productId = $item->product_id;

                if (!isset($products[$productId])) {
                    $products[$productId] = [
                        'name' => $item->product->name,
                        'quantity' => 0,
                        'revenue' => 0,
                    ];
                }

                $products[$productId]['quantity'] += $item->quantity;
                $products[$productId]['revenue'] += $item->subtotal;
            }
        }

        return array_values($products);
    }

    /**
     * Handle a job failure.
     */
    public function failed(\Throwable $exception): void
    {
        Log::error('Daily sales report failed', [
            'error' => $exception->getMessage(),
        ]);
    }
}
