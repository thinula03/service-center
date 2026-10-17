<?php

namespace App\Domains\Inventory\Infrastructure\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['inventory_item_id', 'part_number', 'reference_type', 'manufacturer'])]
class InventoryItemPartNumber extends Model
{
    public function inventoryItem(): BelongsTo
    {
        return $this->belongsTo(InventoryItem::class);
    }
}
