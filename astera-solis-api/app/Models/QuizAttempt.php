<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QuizAttempt extends Model
{
    /** @use HasFactory<\Database\Factories\QuizAttemptFactory> */
    use HasFactory;

    protected $casts = [
        'answers' => 'array',
        'submitted_at' => 'datetime',
        'approved' => 'boolean',
    ];

    public function quiz()
    {
        return $this->belongsTo(Quiz::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
