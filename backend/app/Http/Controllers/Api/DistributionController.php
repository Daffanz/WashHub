<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\DistributionResource;
use App\Http\Requests\StoreDistributionRequest;
use App\Models\Distribution;
use App\Models\DistributionItem;
use App\Models\Status;
use App\Models\Stock;
use App\Models\StockMutasi;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DistributionController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        $query = Distribution::with(['outlet', 'asalOutlet', 'status', 'createdBy', 'items.bahanBaku']);

        if ($outletId = $request->input('outlet_id')) {
            $query->where('outlet_id', $outletId);
        }

        if ($statusId = $request->input('status_id')) {
            $query->where('status_id', $statusId);
        }

        if ($statusSlug = $request->input('status_slug')) {
            $query->whereHas('status', fn($s) => $s->where('slug', $statusSlug));
        }

        $data = $query->latest()->paginate($request->input('per_page', 10));

        return $this->successResponse([
            'items' => DistributionResource::collection($data),
            'pagination' => [
                'current_page' => $data->currentPage(),
                'last_page'    => $data->lastPage(),
                'per_page'     => $data->perPage(),
                'total'        => $data->total(),
            ],
        ], 'Distributions retrieved successfully');
    }

    public function show(int $id): JsonResponse
    {
        $data = Distribution::with(['outlet', 'asalOutlet', 'status', 'createdBy', 'confirmedBy', 'items.bahanBaku'])->find($id);
        if (!$data) {
            return $this->errorResponse('Distribution not found', 404);
        }
        return $this->successResponse(new DistributionResource($data), 'Distribution retrieved successfully');
    }

    public function store(StoreDistributionRequest $request): JsonResponse
    {
        $result = DB::transaction(function () use ($request) {
            $status = Status::where('slug', 'dist.dikirim')->where('grup', 'distribution')->firstOrFail();

            $prefix           = 'DST-' . date('Ymd') . '-';
            $last             = Distribution::where('nomor_distribusi', 'like', "{$prefix}%")->orderByDesc('id')->lockForUpdate()->first();
            $seq              = $last ? (int) substr($last->nomor_distribusi, -4) + 1 : 1;
            $nomorDistribusi  = $prefix . str_pad($seq, 4, '0', STR_PAD_LEFT);

            $asalOutletId = $request->input('asal_outlet_id');
            $userId       = $request->user()->id;

            $distribution = Distribution::create([
                'nomor_distribusi'  => $nomorDistribusi,
                'outlet_id'         => $request->input('outlet_id'),
                'asal_outlet_id'    => $asalOutletId,
                'status_id'         => $status->id,
                'tanggal_distribusi' => $request->input('tanggal_distribusi'),
                'catatan'           => $request->input('catatan'),
                'created_by'        => $userId,
            ]);

            foreach ($request->input('items') as $item) {
                DistributionItem::create([
                    'distribution_id'     => $distribution->id,
                    'bahan_baku_id'       => $item['bahan_baku_id'],
                    'kuantitas'           => $item['kuantitas'],
                    'kuantitas_diterima'  => 0,
                ]);

                // Deduct stock from source outlet
                if ($asalOutletId) {
                    $stock = Stock::where('outlet_id', $asalOutletId)
                        ->where('bahan_baku_id', $item['bahan_baku_id'])
                        ->firstOrFail();

                    $qty = (float) $item['kuantitas'];
                    if ((float) $stock->kuantitas < $qty) {
                        throw new \RuntimeException("Insufficient stock for bahan_baku_id {$item['bahan_baku_id']}. Available: {$stock->kuantitas}, requested: {$qty}");
                    }

                    $stokSebelum = (float) $stock->kuantitas;
                    $stock->decrement('kuantitas', $qty);

                    StockMutasi::create([
                        'outlet_id'       => $asalOutletId,
                        'bahan_baku_id'   => $item['bahan_baku_id'],
                        'tipe'            => 'out',
                        'kuantitas'       => $qty,
                        'stok_sebelum'    => $stokSebelum,
                        'stok_sesudah'    => $stokSebelum - $qty,
                        'referensi_type'  => Distribution::class,
                        'referensi_id'    => $distribution->id,
                        'catatan'         => "Distribution to outlet_id: {$request->input('outlet_id')}",
                        'created_by'      => $userId,
                    ]);
                }
            }

            return $distribution->load(['outlet', 'asalOutlet', 'status', 'createdBy', 'items.bahanBaku']);
        });

        return $this->successResponse(new DistributionResource($result), 'Distribution created successfully', 201);
    }

    public function confirm(int $id, Request $request): JsonResponse
    {
        $distribution = Distribution::with(['status', 'items'])->find($id);
        if (!$distribution) {
            return $this->errorResponse('Distribution not found', 404);
        }

        if ($distribution->status->slug !== 'dist.dikirim') {
            return $this->errorResponse('Only sent distribution can be confirmed.', 422);
        }

        $userId = $request->user()->id;

        DB::transaction(function () use ($distribution, $userId) {
            $confirmedStatus = Status::where('slug', 'dist.selesai')->where('grup', 'distribution')->firstOrFail();

            foreach ($distribution->items as $item) {
                $stock = Stock::firstOrCreate(
                    ['outlet_id' => $distribution->outlet_id, 'bahan_baku_id' => $item->bahan_baku_id],
                    ['kuantitas' => 0]
                );
                $qty         = (float) $item->kuantitas;
                $stokSebelum = (float) $stock->kuantitas;
                $stock->increment('kuantitas', $qty);

                StockMutasi::create([
                    'outlet_id'       => $distribution->outlet_id,
                    'bahan_baku_id'   => $item->bahan_baku_id,
                    'tipe'            => 'in',
                    'kuantitas'       => $qty,
                    'stok_sebelum'    => $stokSebelum,
                    'stok_sesudah'    => $stokSebelum + $qty,
                    'referensi_type'  => Distribution::class,
                    'referensi_id'    => $distribution->id,
                    'catatan'         => "Distribution confirmed: {$distribution->nomor_distribusi}",
                    'created_by'      => $userId,
                ]);

                $item->update(['kuantitas_diterima' => $item->kuantitas]);
            }

            $distribution->update([
                'status_id'    => $confirmedStatus->id,
                'confirmed_by' => $userId,
                'confirmed_at' => now(),
            ]);
        });

        return $this->successResponse(
            new DistributionResource($distribution->fresh()->load(['outlet', 'asalOutlet', 'status', 'createdBy', 'confirmedBy', 'items.bahanBaku'])),
            'Distribution confirmed successfully'
        );
    }
}
