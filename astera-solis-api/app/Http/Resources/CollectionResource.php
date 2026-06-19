<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CollectionResource extends JsonResource
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
            'title' => $this->title,
            'slug' => $this->slug,
            'description' => $this->description,
            'segment' => $this->segment,
            'subject' => $this->subject,
            'active' => $this->active,
            'materials_count' => $this->whenCounted('materials'),
            'quizzes_count' => $this->whenCounted('quizzes'),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
