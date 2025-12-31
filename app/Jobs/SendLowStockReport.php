<?php

namespace App\Jobs;

use App\Mail\LowStockReport as LowStockReportMail;
use App\Models\Product;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class SendLowStockReport implements ShouldQueue
{
    use Queueable;

    private const LOW_STOCK_THRESHOLD = 5;

    /**
     * Create a new job instance.
     */
    public function __construct() {}

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $lowStockProducts = Product::where('stock_quantity', '<', self::LOW_STOCK_THRESHOLD)
            ->orderBy('stock_quantity', 'asc')
            ->get();

        // Only send email if there are low stock products
        if ($lowStockProducts->isNotEmpty()) {
            Mail::to('info@gacikdesign.com')
                ->send(new LowStockReportMail($lowStockProducts));
        }
    }

    /**
     * Handle a job failure.
     */
    public function failed(\Throwable $exception): void
    {
        Log::error('Low stock report failed', [
            'error' => $exception->getMessage(),
        ]);
    }
}
