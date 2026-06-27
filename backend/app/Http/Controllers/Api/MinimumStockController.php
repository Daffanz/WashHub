<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MinimumStock;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class MinimumStockController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        $query = MinimumStock::with(['bahanBaku', 'outlet']);

        if ($outletId = $request->input('outlet_id')) {
            $query->where('outlet_id', $outletId);
        }

        if ($bahanBakuId = $request->input('bahan_baku_id')) {
            $query->where('bahan_baku_id', $bahanBakuId);
        }

        $data = $query->paginate($request->input('per_page', 10));

        return $this->successResponse([
            'items' => $data,
            'pagination' => [
                'current_page' => $data->currentPage(),
                'last_page' => $data->lastPage(),
                'per_page' => $data->perPage(),
                'total' => $data->total(),
            ],
        ], 'Minimum stocks retrieved successfully');
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'outlet_id' => 'required|exists:outlets,id',
            'bahan_baku_id' => 'required|exists:bahan_bakus,id',
            'jumlah_minimum' => 'required|numeric|min:0',
        ]);

        $data = MinimumStock::updateOrCreate(
            ['outlet_id' => $validated['outlet_id'], 'bahan_baku_id' => $validated['bahan_baku_id']],
            ['jumlah_minimum' => $validated['jumlah_minimum']]
        );

        return $this->successResponse($data, 'Minimum stock set successfully', 201);
    }

    public function destroy(int $id): JsonResponse
    {
        try {
            $record = MinimumStock::findOrFail($id);
            $record->delete();
            return $this->successResponse(null, 'Minimum stock deleted successfully');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 404);
        }
    }
}
