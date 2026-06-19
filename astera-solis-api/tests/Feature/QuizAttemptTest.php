<?php

namespace Tests\Feature;

use App\Models\Collection;
use App\Models\Question;
use App\Models\Quiz;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class QuizAttemptTest extends TestCase
{
    use RefreshDatabase;

    public function test_student_sends_attempt_and_system_calculates_approval(): void
    {
        $student = User::create([
            'name' => 'Estudante Demo',
            'email' => 'student@astera.test',
            'password' => 'password',
            'role' => 'student',
        ]);
        $collection = Collection::create([
            'title' => 'Solis Fundamental Ciencias',
            'slug' => 'solis-fundamental-ciencias',
            'description' => 'Colecao de ciencias.',
            'segment' => 'fundamental',
            'subject' => 'Ciencias',
            'active' => true,
        ]);
        $quiz = Quiz::create([
            'collection_id' => $collection->id,
            'title' => 'Simulado de ciencias naturais',
            'description' => 'Avaliacao sobre ciclo da agua.',
            'passing_score' => 70,
            'active' => true,
        ]);
        $firstQuestion = Question::create([
            'quiz_id' => $quiz->id,
            'statement' => 'No ciclo da agua, a evaporacao acontece quando a agua:',
            'options' => [
                'A' => 'Congela no solo',
                'B' => 'Vira vapor com o calor',
            ],
            'correct_option' => 'B',
            'points' => 1,
        ]);
        $secondQuestion = Question::create([
            'quiz_id' => $quiz->id,
            'statement' => 'Um experimento escolar deve ter:',
            'options' => [
                'A' => 'Pergunta, observacao e registro',
                'B' => 'Somente opiniao',
            ],
            'correct_option' => 'A',
            'points' => 1,
        ]);

        $this->actingAs($student);

        $this->postJson("/api/quizzes/{$quiz->id}/attempts", [
            'answers' => [
                $firstQuestion->id => 'B',
                $secondQuestion->id => 'A',
            ],
        ])
            ->assertSuccessful()
            ->assertJsonPath('data.score', 100)
            ->assertJsonPath('data.approved', true);

        $this->assertDatabaseHas('quiz_attempts', [
            'quiz_id' => $quiz->id,
            'user_id' => $student->id,
            'score' => 100,
            'approved' => true,
        ]);
    }
}
