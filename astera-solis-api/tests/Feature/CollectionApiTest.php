<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CollectionApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_student_cannot_create_collection(): void
    {
        $student = User::create([
            'name' => 'Estudante Demo',
            'email' => 'student@astera.test',
            'password' => 'password',
            'role' => 'student',
        ]);

        $this->actingAs($student);

        $this->postJson('/api/collections', [
            'title' => 'Colecao Bloqueada',
            'slug' => 'colecao-bloqueada',
            'description' => 'Estudantes nao podem criar colecoes.',
            'segment' => 'fundamental',
            'subject' => 'Ciencias',
            'active' => true,
        ])->assertForbidden();
    }
}
