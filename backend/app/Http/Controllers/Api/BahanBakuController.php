<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\BahanBakuResource;
use App\Http\Requests\StoreBahanBakuRequest;
use App\Http\Requests\UpdateBahanBakuRequest;
use App\Models\BahanBaku;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BahanBakuController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        $query = BahanBaku::with('kategoriBahan');

        if ($search = $request->input('search')) {
            $query->where('nama', 'like', "%{$search}%");
        }

        if ($kategoriId = $request->input('kategori_bahan_id')) {
            $query->where('kategori_bahan_id', $kategoriId);
        }

        if ($request->has('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        $data = $query->latest()->paginate($request->input('per_page', 10));

        return $this->successResponse([
            'items' => BahanBakuResource::collection($data),
            'pagination' => [
                'current_page' => $data->currentPage(),
                'last_page'    => $data->lastPage(),
                'per_page'     => $data->perPage(),
                'total'        => $data->total(),
            ],
        ], 'Bahan baku retrieved successfully');
    }

    public function show(int $id): JsonResponse
    {
        $data = BahanBaku::with('kategoriBahan')->find($id);
        if (!$data) {
            return $this->errorResponse('Bahan baku not found', 404);
        }
        return $this->successResponse(new BahanBakuResource($data), 'Bahan baku retrieved successfully');
    }

    public function store(StoreBahanBakuRequest $request): JsonResponse
    {
        $data = BahanBaku::create($request->validated());
        return $this->successResponse(new BahanBakuResource($data->load('kategoriBahan')), 'Bahan baku created successfully', 201);
    }

    public function update(UpdateBahanBakuRequest $request, int $id): JsonResponse
    {
        $data = BahanBaku::find($id);
        if (!$data) {
            return $this->errorResponse('Bahan baku not found', 404);
        }
        $data->update($request->validated());
        return $this->successResponse(new BahanBakuResource($data->fresh()->load('kategoriBahan')), 'Bahan baku updated successfully');
    }

    public function destroy(int $id): JsonResponse
    {
        $data = BahanBaku::find($id);
        if (!$data) {
            return $this->errorResponse('Bahan baku not found', 404);
        }
        $data->delete();
        return $this->successResponse(null, 'Bahan baku deleted successfully');
    }

    public function byKategori(int $kategoriId): JsonResponse
    {
        $data = BahanBaku::with('kategoriBahan')
            ->where('kategori_bahan_id', $kategoriId)
            ->where('is_active', true)
            ->get();
        return $this->successResponse(BahanBakuResource::collection($data), 'Bahan baku by kategori retrieved successfully');
    }
}
