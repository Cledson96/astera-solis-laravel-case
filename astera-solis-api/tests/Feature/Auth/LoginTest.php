<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LoginTest extends TestCase
{
    use RefreshDatabase;

    public function test_login_with_csrf_cookie_works(): void
    {
        User::create([
            'name' => 'Admin Astera',
            'email' => 'admin@astera.test',
            'password' => 'password',
            'role' => 'admin',
        ]);

        $this->fromFrontend()->get('/sanctum/csrf-cookie')->assertNoContent();

        $this->fromFrontend()->postJson('/api/auth/login', [
            'email' => 'admin@astera.test',
            'password' => 'password',
        ])
            ->assertOk()
            ->assertJsonPath('data.email', 'admin@astera.test');

        $this->fromFrontend()->getJson('/api/auth/me')
            ->assertOk()
            ->assertJsonPath('email', 'admin@astera.test');
    }

    public function test_invalid_login_returns_validation_error(): void
    {
        User::create([
            'name' => 'Admin Astera',
            'email' => 'admin@astera.test',
            'password' => 'password',
            'role' => 'admin',
        ]);

        $this->fromFrontend()->get('/sanctum/csrf-cookie')->assertNoContent();

        $this->fromFrontend()->postJson('/api/auth/login', [
            'email' => 'admin@astera.test',
            'password' => 'wrong-password',
        ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('email');
    }

    public function test_protected_route_requires_session(): void
    {
        $this->getJson('/api/auth/me')->assertUnauthorized();
    }

    private function fromFrontend(): static
    {
        return $this->withHeader('Origin', 'http://localhost:3000');
    }
}
