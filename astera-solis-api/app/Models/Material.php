<?php

namespace App\Models;

use Database\Factories\MaterialFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['collection_id', 'title', 'type', 'summary', 'url', 'estimated_minutes', 'active'])]
class Material extends Model
{
    /** @use HasFactory<MaterialFactory> */
    use HasFactory;

    protected $attributes = [
        'estimated_minutes' => 10,
        'active' => true,
    ];

    public function collection()
    {
        return $this->belongsTo(Collection::class);
    }
}
