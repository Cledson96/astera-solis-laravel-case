<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Quiz\StoreQuizRequest;
use App\Http\Requests\Quiz\UpdateQuizRequest;
use App\Http\Resources\QuizResource;
use App\Models\Quiz;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;

class QuizController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): AnonymousResourceCollection
    {
        $this->authorize('viewAny', Quiz::class);

        return QuizResource::collection(
            Quiz::query()->latest()->paginate()
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreQuizRequest $request): QuizResource
    {
        $this->authorize('create', Quiz::class);

        $quiz = Quiz::create($request->validated());

        return new QuizResource($quiz);
    }

    /**
     * Display the specified resource.
     */
    public function show(Quiz $quiz): QuizResource
    {
        $this->authorize('view', $quiz);

        return new QuizResource($quiz);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateQuizRequest $request, Quiz $quiz): QuizResource
    {
        $this->authorize('update', $quiz);

        $quiz->update($request->validated());

        return new QuizResource($quiz);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Quiz $quiz): Response
    {
        $this->authorize('delete', $quiz);

        $quiz->delete();

        return response()->noContent();
    }
}
