<?php

namespace App\Services\Quiz;

use App\Models\Quiz;
use App\Models\QuizAttempt;
use App\Models\User;

class SubmitQuizAttempt
{
    /**
     * @param  array<int|string, string>  $answers
     */
    public function handle(User $user, Quiz $quiz, array $answers): QuizAttempt
    {
        $questions = $quiz->questions()->get(['id', 'correct_option', 'points']);
        $totalPoints = $questions->sum('points');
        $earnedPoints = $questions->sum(function ($question) use ($answers): int {
            $answer = $answers[$question->id] ?? null;

            return (string) $answer === $question->correct_option
                ? (int) $question->points
                : 0;
        });

        $score = $totalPoints > 0
            ? (int) round(($earnedPoints / $totalPoints) * 100)
            : 0;

        return $quiz->attempts()->create([
            'user_id' => $user->id,
            'answers' => $answers,
            'score' => $score,
            'approved' => $score >= $quiz->passing_score,
            'submitted_at' => now(),
        ]);
    }
}
