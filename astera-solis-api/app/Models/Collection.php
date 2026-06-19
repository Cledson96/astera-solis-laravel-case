<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Collection extends Model
{
    /** @use HasFactory<\Database\Factories\CollectionFactory> */
    use HasFactory;

    public function materials()
    {
        return $this->hasMany(Material::class);
    }

    public function quizzes()
    {
        return $this->hasMany(Quiz::class);
    }
}
