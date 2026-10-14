<?php

namespace App\Domains\Organizations\Infrastructure\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'name', 'slug', 'email', 'phone', 'address_line_1', 'city', 'country_code',
    'timezone', 'is_default', 'is_active', 'service_hours',
])]
class Branch extends Model
{
    protected function casts(): array
    {
        return [
            'is_default' => 'boolean',
            'is_active' => 'boolean',
            'service_hours' => 'array',
        ];
    }

    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }
}
