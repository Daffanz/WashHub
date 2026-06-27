<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\StockResource;
use App\Http\Resources\StockMutasiResource;
use App\Models\Stock;
use App\Models\StockMutasi;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StockController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        $query = Stock::with(['bahanBaku.kategoriBahan', 'outlet']);

        if ($outletId = $request->input('outlet_id')) {
            $query->where('outlet_id', $outletId);
        }

        if ($bahanBakuId = $request->input('bahan_baku_id')) {
            $query->where('bahan_baku_id', $bahanBakuId);
        }

        if ($search = $request->input('search')) {
            $query->whereHas('bahanBaku', fn($b) => $b->where('nama', 'like', "%{$search}%"));
        }

        $data = $query->paginate($request->input('per_page', 10));

        return $this->successResponse([
            'items' => StockResource::collection($data),
            'pagination' => [
                'current_page' => $data->currentPage(),
                'last_page'    => $data->lastPage(),
                'per_page'     => $data->perPage(),
                'total'        => $data->total(),
            ],
        ], 'Stock retrieved successfully');
    }

    public function mutasi(Request $request): JsonResponse
    {
        $query = StockMutasi::with(['bahanBaku', 'outlet', 'createdBy']);

        if ($outletId = $request->input('outlet_id')) {
            $query->where('outlet_id', $outletId);
        }

        if ($bahanBakuId = $request->input('bahan_baku_id')) {
            $query->where('bahan_baku_id', $bahanBakuId);
        }

        if ($tipe = $request->input('tipe')) {
            $query->where('tipe', $tipe);
        }

        if ($dateFrom = $request->input('date_from')) {
            $query->whereDate('created_at', '>=', $dateFrom);
        }

        if ($dateTo = $request->input('date_to')) {
            $query->whereDate('created_at', '<=', $dateTo);
        }

        $data = $query->latest()->paginate($request->input('per_page', 10));

        return $this->successResponse([
            'items' => StockMutasiResource::collection($data),
            'pagination' => [
                'current_page' => $data->currentPage(),
                'last_page'    => $data->lastPage(),
                'per_page'     => $data->perPage(),
                'total'        => $data->total(),
            ],
        ], 'Stock mutations retrieved successfully');
    }

    public function lowStock(Request $request): JsonResponse
    {
        $outletId = $request->input('outlet_id');
        if (!$outletId) {
            return $this->errorResponse('outlet_id is required', 400);
        }

        $data = Stock::with('bahanBaku')
            ->where('outlet_id', $outletId)
            ->whereRaw('kuantitas <= (SELECT COALESCE(jumlah_minimum, 0) FROM minimum_stocks WHERE outlet_id = ? AND bahan_baku_id = stocks.bahan_baku_id LIMIT 1)', [$outletId])
            ->get();

        return $this->successResponse($data, 'Low stock items retrieved successfully');
    }
}
