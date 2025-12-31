<x-mail::message>
# Low Stock Alert

The following products are running low on stock (less than 5 units):

<x-mail::table>
| Product | Current Stock | Status |
|:--------|:-------------:|:-------|
@foreach($products as $product)
| {{ $product->name }} | {{ $product->stock_quantity }} {{ $product->stock_quantity === 1 ? 'unit' : 'units' }} | @if($product->stock_quantity === 0) **OUT OF STOCK** @else Low @endif |
@endforeach
</x-mail::table>

**Total Products:** {{ $products->count() }}

Please restock these products as soon as possible.

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
