<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class QuestionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'quiz_id' => $this->quiz_id,
            'statement' => $this->statement,
            'options' => $this->options,
            'points' => $this->points,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
