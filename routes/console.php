<?php

use App\Jobs\SendDailySalesReport;
use App\Jobs\SendLowStockReport;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Schedule::job(new SendDailySalesReport)
    ->dailyAt('23:59')
    ->timezone(config('app.timezone'));

Schedule::job(new SendLowStockReport)
    ->dailyAt('09:00')
    ->timezone(config('app.timezone'));
