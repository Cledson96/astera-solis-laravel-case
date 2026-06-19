<?php

namespace App\Policies;

use App\Models\Material;
use App\Models\User;

class MaterialPolicy
{
    public function before(User $user, string $ability): ?bool
    {
        return $user->isAdmin() ? true : null;
    }

    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->isEditor() || $user->isTeacher() || $user->isStudent();
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Material $material): bool
    {
        return $user->isEditor() || $user->isTeacher() || $user->isStudent();
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->isEditor();
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Material $material): bool
    {
        return $user->isEditor();
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Material $material): bool
    {
        return $user->isEditor();
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Material $material): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Material $material): bool
    {
        return false;
    }
}
