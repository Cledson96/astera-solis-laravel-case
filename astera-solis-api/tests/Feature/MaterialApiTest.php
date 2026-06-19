<?php

namespace Tests\Feature;

use App\Models\Collection;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MaterialApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_editor_can_create_material(): void
    {
        $editor = User::create([
            'name' => 'Editor Solis',
            'email' => 'editor@astera.test',
            'password' => 'password',
            'role' => 'editor',
        ]);
        $collection = Collection::create([
            'title' => 'Solis Fundamental Ciencias',
            'slug' => 'solis-fundamental-ciencias',
            'description' => 'Colecao de ciencias.',
            'segment' => 'fundamental',
            'subject' => 'Ciencias',
            'active' => true,
        ]);

        $this->actingAs($editor);

        $this->postJson('/api/materials', [
            'collection_id' => $collection->id,
            'title' => 'Videoaula: Ciclo da Agua',
            'type' => 'video',
            'summary' => 'Aula curta sobre evaporacao e chuva.',
            'url' => 'https://example.com/ciclo-da-agua',
            'estimated_minutes' => 12,
            'active' => true,
        ])
            ->assertSuccessful()
            ->assertJsonPath('data.title', 'Videoaula: Ciclo da Agua');

        $this->assertDatabaseHas('materials', [
            'collection_id' => $collection->id,
            'title' => 'Videoaula: Ciclo da Agua',
            'type' => 'video',
        ]);
    }
}
