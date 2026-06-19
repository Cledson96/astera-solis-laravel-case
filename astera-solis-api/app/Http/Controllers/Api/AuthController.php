<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Services\Auth\LoginUser;
use App\Services\Auth\LogoutUser;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function register(RegisterRequest $request): UserResource
    {
        $user = User::create($request->validated());

        Auth::login($user);
        $request->session()->regenerate();

        return new UserResource($user);
    }

    public function login(LoginRequest $request, LoginUser $loginUser): UserResource
    {
        $user = $loginUser->handle(
            $request->safe()->only(['email', 'password']),
            $request->boolean('remember'),
        );

        $request->session()->regenerate();

        return new UserResource($user);
    }

    public function logout(Request $request, LogoutUser $logoutUser): Response
    {
        $logoutUser->handle($request);

        return response()->noContent();
    }
}
