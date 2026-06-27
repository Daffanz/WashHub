<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\JenisLayananResource;
use App\Http\Requests\StoreJenisLayananRequest;
use App\Http\Requests\UpdateJenisLayananRequest;
use App\Models\JenisLayanan;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class JenisLayananController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        $query = JenisLayanan::query();

        if ($search = $request->input('search')) {
            $query->where('nama', 'like', "%{$search}%");
        }

        if ($request->has('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        $data = $query->latest()->paginate($request->input('per_page', 10));

        return $this->successResponse([
            'items' => JenisLayananResource::collection($data),
            'pagination' => [
                'current_page' => $data->currentPage(),
                'last_page'    => $data->lastPage(),
                'per_page'     => $data->perPage(),
                'total'        => $data->total(),
            ],
        ], 'Jenis layanan retrieved successfully');
    }

    public function show(int $id): JsonResponse
    {
        $data = JenisLayanan::with('komposisiBahans.bahanBaku')->find($id);
        if (!$data) {
            return $this->errorResponse('Jenis layanan not found', 404);
        }
        return $this->successResponse(new JenisLayananResource($data), 'Jenis layanan retrieved successfully');
    }

    public function store(StoreJenisLayananRequest $request): JsonResponse
    {
        $data = JenisLayanan::create($request->validated());
        return $this->successResponse(new JenisLayananResource($data), 'Jenis layanan created successfully', 201);
    }

    public function update(UpdateJenisLayananRequest $request, int $id): JsonResponse
    {
        $data = JenisLayanan::find($id);
        if (!$data) {
            return $this->errorResponse('Jenis layanan not found', 404);
        }
        $data->update($request->validated());
        return $this->successResponse(new JenisLayananResource($data->fresh()), 'Jenis layanan updated successfully');
    }

    public function destroy(int $id): JsonResponse
    {
        $data = JenisLayanan::find($id);
        if (!$data) {
            return $this->errorResponse('Jenis layanan not found', 404);
        }
        $data->delete();
        return $this->successResponse(null, 'Jenis layanan deleted successfully');
    }
}
