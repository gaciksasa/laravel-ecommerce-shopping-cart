<x-mail::message>
# Low Stock Alert

The following product is running low on stock:

**Product:** {{ $product->name }}
**Current Stock:** {{ $product->stock_quantity }} units
**Threshold:** 5 units
**Alert Time:** {{ now()->format('Y-m-d H:i:s') }}

Please restock this product as soon as possible.

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
