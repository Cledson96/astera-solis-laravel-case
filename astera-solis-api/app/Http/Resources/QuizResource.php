<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class QuizResource extends JsonResource
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
            'collection_id' => $this->collection_id,
            'collection' => new CollectionResource($this->whenLoaded('collection')),
            'title' => $this->title,
            'description' => $this->description,
            'passing_score' => $this->passing_score,
            'active' => $this->active,
            'questions_count' => $this->whenCounted('questions'),
            'questions' => QuestionResource::collection($this->whenLoaded('questions')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
