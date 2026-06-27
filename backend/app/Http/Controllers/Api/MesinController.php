<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\MesinResource;
use App\Http\Requests\StoreMesinRequest;
use App\Http\Requests\UpdateMesinRequest;
use App\Models\Mesin;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MesinController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        $query = Mesin::with(['outlet', 'status']);

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('nama', 'like', "%{$search}%")
                  ->orWhere('kode', 'like', "%{$search}%");
            });
        }

        if ($outletId = $request->input('outlet_id')) {
            $query->where('outlet_id', $outletId);
        }

        if ($statusId = $request->input('status_id')) {
            $query->where('status_id', $statusId);
        }

        if ($request->has('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        $data = $query->latest()->paginate($request->input('per_page', 10));

        return $this->successResponse([
            'items' => MesinResource::collection($data),
            'pagination' => [
                'current_page' => $data->currentPage(),
                'last_page'    => $data->lastPage(),
                'per_page'     => $data->perPage(),
                'total'        => $data->total(),
            ],
        ], 'Mesin retrieved successfully');
    }

    public function show(int $id): JsonResponse
    {
        $data = Mesin::with(['outlet', 'status'])->find($id);
        if (!$data) {
            return $this->errorResponse('Mesin not found', 404);
        }
        return $this->successResponse(new MesinResource($data), 'Mesin retrieved successfully');
    }

    public function store(StoreMesinRequest $request): JsonResponse
    {
        $data = Mesin::create($request->validated());
        return $this->successResponse(new MesinResource($data->load(['outlet', 'status'])), 'Mesin created successfully', 201);
    }

    public function update(UpdateMesinRequest $request, int $id): JsonResponse
    {
        $data = Mesin::find($id);
        if (!$data) {
            return $this->errorResponse('Mesin not found', 404);
        }
        $data->update($request->validated());
        return $this->successResponse(new MesinResource($data->fresh()->load(['outlet', 'status'])), 'Mesin updated successfully');
    }

    public function destroy(int $id): JsonResponse
    {
        $data = Mesin::find($id);
        if (!$data) {
            return $this->errorResponse('Mesin not found', 404);
        }
        $data->delete();
        return $this->successResponse(null, 'Mesin deleted successfully');
    }
}
