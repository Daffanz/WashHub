<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\KomposisiBahanResource;
use App\Http\Requests\StoreKomposisiBahanRequest;
use App\Http\Requests\UpdateKomposisiBahanRequest;
use App\Models\KomposisiBahan;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class KomposisiBahanController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        $query = KomposisiBahan::with(['jenisLayanan', 'bahanBaku']);

        if ($jenisLayananId = $request->input('jenis_layanan_id')) {
            $query->where('jenis_layanan_id', $jenisLayananId);
        }

        if ($bahanBakuId = $request->input('bahan_baku_id')) {
            $query->where('bahan_baku_id', $bahanBakuId);
        }

        $data = $query->latest()->paginate($request->input('per_page', 10));

        return $this->successResponse([
            'items' => KomposisiBahanResource::collection($data),
            'pagination' => [
                'current_page' => $data->currentPage(),
                'last_page'    => $data->lastPage(),
                'per_page'     => $data->perPage(),
                'total'        => $data->total(),
            ],
        ], 'Komposisi bahan retrieved successfully');
    }

    public function show(int $id): JsonResponse
    {
        $data = KomposisiBahan::with(['jenisLayanan', 'bahanBaku'])->find($id);
        if (!$data) {
            return $this->errorResponse('Komposisi bahan not found', 404);
        }
        return $this->successResponse(new KomposisiBahanResource($data), 'Komposisi bahan retrieved successfully');
    }

    public function store(StoreKomposisiBahanRequest $request): JsonResponse
    {
        $data = KomposisiBahan::create($request->validated());
        return $this->successResponse(new KomposisiBahanResource($data->load(['jenisLayanan', 'bahanBaku'])), 'Komposisi bahan created successfully', 201);
    }

    public function update(UpdateKomposisiBahanRequest $request, int $id): JsonResponse
    {
        $data = KomposisiBahan::find($id);
        if (!$data) {
            return $this->errorResponse('Komposisi bahan not found', 404);
        }
        $data->update($request->validated());
        return $this->successResponse(new KomposisiBahanResource($data->fresh()->load(['jenisLayanan', 'bahanBaku'])), 'Komposisi bahan updated successfully');
    }

    public function destroy(int $id): JsonResponse
    {
        $data = KomposisiBahan::find($id);
        if (!$data) {
            return $this->errorResponse('Komposisi bahan not found', 404);
        }
        $data->delete();
        return $this->successResponse(null, 'Komposisi bahan deleted successfully');
    }

    public function byJenisLayanan(int $jenisLayananId): JsonResponse
    {
        $data = KomposisiBahan::with(['jenisLayanan', 'bahanBaku'])
            ->where('jenis_layanan_id', $jenisLayananId)
            ->get();
        return $this->successResponse(KomposisiBahanResource::collection($data), 'Komposisi by jenis layanan retrieved successfully');
    }
}
