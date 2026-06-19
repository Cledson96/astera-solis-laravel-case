<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CollectionController;
use App\Http\Controllers\Api\MaterialController;
use App\Http\Controllers\Api\MeController;
use App\Http\Controllers\Api\QuizAttemptController;
use App\Http\Controllers\Api\QuizController;
use App\Http\Controllers\Api\SchoolController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/auth/me', MeController::class);
    Route::post('/auth/logout', [AuthController::class, 'logout']);

    Route::apiResource('schools', SchoolController::class);
    Route::apiResource('collections', CollectionController::class);
    Route::apiResource('materials', MaterialController::class);
    Route::apiResource('quizzes', QuizController::class);
    Route::post('/quizzes/{quiz}/attempts', [QuizAttemptController::class, 'store']);
});