<?php

namespace App\Services\Auth;

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class LoginUser
{
    /**
     * @param  array{email: string, password: string}  $credentials
     */
    public function handle(array $credentials, bool $remember = false): User
    {
        if (! Auth::attempt($credentials, $remember)) {
            throw ValidationException::withMessages([
                'email' => ['As credenciais informadas estao incorretas.'],
            ]);
        }

        /** @var User $user */
        $user = Auth::user();

        return $user;
    }
}
