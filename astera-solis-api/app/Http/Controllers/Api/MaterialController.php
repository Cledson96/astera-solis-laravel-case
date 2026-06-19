<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Material\StoreMaterialRequest;
use App\Http\Requests\Material\UpdateMaterialRequest;
use App\Http\Resources\MaterialResource;
use App\Models\Material;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;

class MaterialController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): AnonymousResourceCollection
    {
        $this->authorize('viewAny', Material::class);

        return MaterialResource::collection(
            Material::query()
                ->with('collection')
                ->latest()
                ->paginate()
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreMaterialRequest $request): MaterialResource
    {
        $this->authorize('create', Material::class);

        $material = Material::create($request->validated());

        return new MaterialResource($material);
    }

    /**
     * Display the specified resource.
     */
    public function show(Material $material): MaterialResource
    {
        $this->authorize('view', $material);

        $material->load('collection');

        return new MaterialResource($material);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateMaterialRequest $request, Material $material): MaterialResource
    {
        $this->authorize('update', $material);

        $material->update($request->validated());

        return new MaterialResource($material);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Material $material): Response
    {
        $this->authorize('delete', $material);

        $material->delete();

        return response()->noContent();
    }
}
