<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LogoutTest extends TestCase
{
    use RefreshDatabase;

    public function test_logout_invalidates_session(): void
    {
        $user = User::create([
            'name' => 'Admin Astera',
            'email' => 'admin@astera.test',
            'password' => 'password',
            'role' => 'admin',
        ]);

        $this->fromFrontend()->get('/sanctum/csrf-cookie')->assertNoContent();
        $this->fromFrontend()->postJson('/api/auth/login', [
            'email' => $user->email,
            'password' => 'password',
        ])->assertOk();

        $this->fromFrontend()->getJson('/api/auth/me')->assertOk();

        $this->fromFrontend()->postJson('/api/auth/logout')->assertNoContent();
        $this->fromFrontend()->getJson('/api/auth/me')->assertUnauthorized();
    }

    private function fromFrontend(): static
    {
        return $this->withHeader('Origin', 'http://localhost:3000');
    }
}
