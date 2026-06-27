<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\KategoriBahanResource;
use App\Http\Requests\StoreKategoriBahanRequest;
use App\Http\Requests\UpdateKategoriBahanRequest;
use App\Models\KategoriBahan;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class KategoriBahanController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        $query = KategoriBahan::query();

        if ($search = $request->input('search')) {
            $query->where('nama', 'like', "%{$search}%");
        }

        if ($request->has('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        $data = $query->latest()->paginate($request->input('per_page', 10));

        return $this->successResponse([
            'items' => KategoriBahanResource::collection($data),
            'pagination' => [
                'current_page' => $data->currentPage(),
                'last_page'    => $data->lastPage(),
                'per_page'     => $data->perPage(),
                'total'        => $data->total(),
            ],
        ], 'Kategori bahan retrieved successfully');
    }

    public function show(int $id): JsonResponse
    {
        $data = KategoriBahan::with('bahanBakus')->find($id);
        if (!$data) {
            return $this->errorResponse('Kategori bahan not found', 404);
        }
        return $this->successResponse(new KategoriBahanResource($data), 'Kategori bahan retrieved successfully');
    }

    public function store(StoreKategoriBahanRequest $request): JsonResponse
    {
        $data = KategoriBahan::create($request->validated());
        return $this->successResponse(new KategoriBahanResource($data), 'Kategori bahan created successfully', 201);
    }

    public function update(UpdateKategoriBahanRequest $request, int $id): JsonResponse
    {
        $data = KategoriBahan::find($id);
        if (!$data) {
            return $this->errorResponse('Kategori bahan not found', 404);
        }
        $data->update($request->validated());
        return $this->successResponse(new KategoriBahanResource($data->fresh()), 'Kategori bahan updated successfully');
    }

    public function destroy(int $id): JsonResponse
    {
        $data = KategoriBahan::find($id);
        if (!$data) {
            return $this->errorResponse('Kategori bahan not found', 404);
        }
        if ($data->bahanBakus()->count() > 0) {
            return $this->errorResponse('Cannot delete kategori that has bahan baku. Remove or reassign them first.', 422);
        }
        $data->delete();
        return $this->successResponse(null, 'Kategori bahan deleted successfully');
    }

    public function active(): JsonResponse
    {
        $data = KategoriBahan::where('is_active', true)->get();
        return $this->successResponse($data, 'Active kategori retrieved successfully');
    }
}
