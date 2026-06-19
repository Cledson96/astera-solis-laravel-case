<?php

use Database\Seeders\DemoSeeder;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;
use Symfony\Component\Console\Command\Command;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('app:seed-once {--name=demo : Nome usado para controlar se o seed ja rodou}', function (): int {
    $seedName = (string) $this->option('name');

    if (DB::table('seed_runs')->where('name', $seedName)->exists()) {
        $this->info("Seed '{$seedName}' ja executado. Pulando.");

        return Command::SUCCESS;
    }

    $this->info("Executando seed '{$seedName}' pela primeira vez.");

    $exitCode = $this->call('db:seed', [
        '--class' => DemoSeeder::class,
        '--force' => true,
    ]);

    if ($exitCode !== Command::SUCCESS) {
        return $exitCode;
    }

    DB::table('seed_runs')->insert([
        'name' => $seedName,
        'ran_at' => now(),
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    $this->info("Seed '{$seedName}' registrado como executado.");

    return Command::SUCCESS;
})->purpose('Run demo seed only once per database');
