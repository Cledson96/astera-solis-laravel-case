<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class SeedOnceCommandTest extends TestCase
{
    use RefreshDatabase;

    public function test_seed_once_runs_only_on_first_execution(): void
    {
        Artisan::call('app:seed-once');

        $this->assertDatabaseHas('seed_runs', [
            'name' => 'demo',
        ]);

        $firstRanAt = DB::table('seed_runs')
            ->where('name', 'demo')
            ->value('ran_at');

        $this->assertDatabaseHas('users', [
            'email' => 'admin@astera.test',
        ]);

        Artisan::call('app:seed-once');

        $this->assertSame(
            $firstRanAt,
            DB::table('seed_runs')->where('name', 'demo')->value('ran_at'),
        );

        $this->assertSame(1, DB::table('seed_runs')->where('name', 'demo')->count());
    }
}
