<?php

namespace App\Services;

use App\Jobs\ProcessLowStockNotification;
use App\Models\Product;

class StockService
{
    public function reduceStock(Product $product, int $quantity): void
    {
        $product->decrement('stock_quantity', $quantity);
        $product->refresh();

        $this->checkAndNotifyLowStock($product);
    }

    public function checkAndNotifyLowStock(Product $product): void
    {
        if ($product->isLowStock()) {
            ProcessLowStockNotification::dispatch($product);
        }
    }
}
