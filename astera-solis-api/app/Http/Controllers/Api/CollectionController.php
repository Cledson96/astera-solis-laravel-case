<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Collection\StoreCollectionRequest;
use App\Http\Requests\Collection\UpdateCollectionRequest;
use App\Http\Resources\CollectionResource;
use App\Models\Collection;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;

class CollectionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): AnonymousResourceCollection
    {
        $this->authorize('viewAny', Collection::class);

        return CollectionResource::collection(
            Collection::query()->latest()->paginate()
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCollectionRequest $request): CollectionResource
    {
        $this->authorize('create', Collection::class);

        $collection = Collection::create($request->validated());

        return new CollectionResource($collection);
    }

    /**
     * Display the specified resource.
     */
    public function show(Collection $collection): CollectionResource
    {
        $this->authorize('view', $collection);

        return new CollectionResource($collection);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCollectionRequest $request, Collection $collection): CollectionResource
    {
        $this->authorize('update', $collection);

        $collection->update($request->validated());

        return new CollectionResource($collection);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Collection $collection): Response
    {
        $this->authorize('delete', $collection);

        $collection->delete();

        return response()->noContent();
    }
}
