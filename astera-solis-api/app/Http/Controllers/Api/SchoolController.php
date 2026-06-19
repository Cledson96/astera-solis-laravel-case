<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\School\StoreSchoolRequest;
use App\Http\Requests\School\UpdateSchoolRequest;
use App\Http\Resources\SchoolResource;
use App\Models\School;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;

class SchoolController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): AnonymousResourceCollection
    {
        $this->authorize('viewAny', School::class);

        return SchoolResource::collection(
            School::query()->latest()->paginate()
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreSchoolRequest $request): SchoolResource
    {
        $this->authorize('create', School::class);

        $school = School::create($request->validated());

        return new SchoolResource($school);
    }

    /**
     * Display the specified resource.
     */
    public function show(School $school): SchoolResource
    {
        $this->authorize('view', $school);

        return new SchoolResource($school);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSchoolRequest $request, School $school): SchoolResource
    {
        $this->authorize('update', $school);

        $school->update($request->validated());

        return new SchoolResource($school);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(School $school): Response
    {
        $this->authorize('delete', $school);

        $school->delete();

        return response()->noContent();
    }
}
