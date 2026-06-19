<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\QuizAttempt\SubmitQuizAttemptRequest;
use App\Http\Resources\QuizAttemptResource;
use App\Models\Quiz;
use App\Models\User;
use App\Services\Quiz\SubmitQuizAttempt;

class QuizAttemptController extends Controller
{
    public function store(
        SubmitQuizAttemptRequest $request,
        Quiz $quiz,
        SubmitQuizAttempt $submitQuizAttempt,
    ): QuizAttemptResource {
        $this->authorize('attempt', $quiz);

        /** @var User $user */
        $user = $request->user();
        $attempt = $submitQuizAttempt->handle(
            $user,
            $quiz,
            $request->validated('answers'),
        );

        return new QuizAttemptResource($attempt);
    }
}
