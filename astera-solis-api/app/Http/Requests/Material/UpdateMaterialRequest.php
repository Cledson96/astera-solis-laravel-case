<?php

namespace App\Http\Requests\Material;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateMaterialRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'collection_id' => ['sometimes', 'required', 'integer', 'exists:collections,id'],
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'type' => ['sometimes', 'required', 'string', 'in:ebook,video,quiz,pdf,game'],
            'summary' => ['sometimes', 'nullable', 'string'],
            'url' => ['sometimes', 'nullable', 'url', 'max:255'],
            'estimated_minutes' => ['sometimes', 'integer', 'min:1'],
            'active' => ['sometimes', 'boolean'],
        ];
    }
}
