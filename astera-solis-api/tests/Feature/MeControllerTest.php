<?php

namespace Tests\Feature;

use App\Models\User;
use Tests\TestCase;

class MeControllerTest extends TestCase
{
    public function test_authenticated_user_can_view_own_profile(): void
    {
        $user = new User([
            'name' => 'Usuario Teste',
            'email' => 'usuario@example.com',
        ]);

        $this->actingAs($user);

        $this->getJson('/api/auth/me')
            ->assertOk()
            ->assertJsonPath('email', 'usuario@example.com');
    }
}
