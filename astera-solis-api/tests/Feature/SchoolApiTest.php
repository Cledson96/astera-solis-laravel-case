<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SchoolApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_manage_schools(): void
    {
        $admin = User::create([
            'name' => 'Admin Astera',
            'email' => 'admin@astera.test',
            'password' => 'password',
            'role' => 'admin',
        ]);

        $this->actingAs($admin);

        $createResponse = $this->postJson('/api/schools', [
            'name' => 'Escola Solar Astera',
            'city' => 'Sao Paulo',
            'state' => 'SP',
            'inep_code' => '35000001',
            'active' => true,
        ])
            ->assertSuccessful()
            ->assertJsonPath('data.name', 'Escola Solar Astera');

        $schoolId = $createResponse->json('data.id');

        $this->patchJson("/api/schools/{$schoolId}", [
            'city' => 'Campinas',
        ])
            ->assertSuccessful()
            ->assertJsonPath('data.city', 'Campinas');

        $this->deleteJson("/api/schools/{$schoolId}")->assertNoContent();

        $this->assertDatabaseMissing('schools', [
            'id' => $schoolId,
        ]);
    }
}
