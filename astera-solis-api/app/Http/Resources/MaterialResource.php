<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MaterialResource extends JsonResource
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
            'type' => $this->type,
            'summary' => $this->summary,
            'url' => $this->url,
            'estimated_minutes' => $this->estimated_minutes,
            'active' => $this->active,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
