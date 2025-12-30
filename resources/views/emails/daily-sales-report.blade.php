<x-mail::message>
# Daily Sales Report

**Date:** {{ $salesData['date'] }}

## Summary

- **Total Orders:** {{ $salesData['total_orders'] }}
- **Total Revenue:** ${{ number_format($salesData['total_revenue'], 2) }}

## Products Sold

@if(count($salesData['products_sold']) > 0)
<x-mail::table>
| Product | Quantity | Revenue |
|:--------|:--------:|--------:|
@foreach($salesData['products_sold'] as $product)
| {{ $product['name'] }} | {{ $product['quantity'] }} | ${{ number_format($product['revenue'], 2) }} |
@endforeach
</x-mail::table>
@else
No products were sold today.
@endif

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
