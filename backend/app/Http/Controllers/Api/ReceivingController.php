<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ReceivingResource;
use App\Http\Requests\StoreReceivingRequest;
use App\Models\Receiving;
use App\Models\ReceivingItem;
use App\Models\PurchaseOrder;
use App\Models\Status;
use App\Models\Stock;
use App\Models\StockMutasi;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReceivingController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        $query = Receiving::with(['purchaseOrder', 'status', 'createdBy', 'items.bahanBaku']);

        if ($poId = $request->input('purchase_order_id')) {
            $query->where('purchase_order_id', $poId);
        }

        if ($statusId = $request->input('status_id')) {
            $query->where('status_id', $statusId);
        }

        $data = $query->latest()->paginate($request->input('per_page', 10));

        return $this->successResponse([
            'items' => ReceivingResource::collection($data),
            'pagination' => [
                'current_page' => $data->currentPage(),
                'last_page'    => $data->lastPage(),
                'per_page'     => $data->perPage(),
                'total'        => $data->total(),
            ],
        ], 'Receivings retrieved successfully');
    }

    public function show(int $id): JsonResponse
    {
        $data = Receiving::with([
            'purchaseOrder.supplier',
            'purchaseOrder.items.bahanBaku',
            'status',
            'createdBy',
            'items.bahanBaku',
            'items.purchaseOrderItem',
        ])->find($id);

        if (!$data) {
            return $this->errorResponse('Receiving not found', 404);
        }

        return $this->successResponse(new ReceivingResource($data), 'Receiving retrieved successfully');
    }

    public function store(StoreReceivingRequest $request): JsonResponse
    {
        $result = DB::transaction(function () use ($request) {
            $po = PurchaseOrder::with('items.bahanBaku')->findOrFail($request->input('purchase_order_id'));

            $status = Status::where('slug', 'receiving.selesai')->where('grup', 'receiving')->firstOrFail();

            $prefix      = 'RCV-' . date('Ymd') . '-';
            $last        = Receiving::where('nomor_terima', 'like', "{$prefix}%")->orderByDesc('id')->lockForUpdate()->first();
            $seq         = $last ? (int) substr($last->nomor_terima, -4) + 1 : 1;
            $nomorTerima = $prefix . str_pad($seq, 4, '0', STR_PAD_LEFT);

            $outletId  = $po->outlet_id;
            $userId    = $request->user()->id;

            $receiving = Receiving::create([
                'nomor_terima'       => $nomorTerima,
                'purchase_order_id'  => $po->id,
                'status_id'          => $status->id,
                'tanggal_terima'     => $request->input('tanggal_terima'),
                'catatan'            => $request->input('catatan'),
                'created_by'         => $userId,
            ]);

            $poItemIds = $po->items->pluck('id')->toArray();

            foreach ($request->input('items') as $item) {
                if (!in_array($item['purchase_order_item_id'], $poItemIds)) {
                    throw new \RuntimeException("Item {$item['purchase_order_item_id']} is not part of this purchase order.");
                }

                $poItem       = $po->items->firstWhere('id', $item['purchase_order_item_id']);
                $qtyDipesan   = (float) $poItem->kuantitas;
                $qtyDiterima  = (float) $item['kuantitas_diterima'];

                if ($qtyDiterima > $qtyDipesan) {
                    throw new \RuntimeException("Received quantity ({$qtyDiterima}) cannot exceed ordered quantity ({$qtyDipesan}).");
                }

                ReceivingItem::create([
                    'receiving_id'            => $receiving->id,
                    'purchase_order_item_id'  => $item['purchase_order_item_id'],
                    'bahan_baku_id'           => $poItem->bahan_baku_id,
                    'kuantitas_dipesan'       => $qtyDipesan,
                    'kuantitas_diterima'      => $qtyDiterima,
                ]);

                if ($qtyDiterima > 0) {
                    $stock = Stock::firstOrCreate(
                        ['outlet_id' => $outletId, 'bahan_baku_id' => $poItem->bahan_baku_id],
                        ['kuantitas' => 0]
                    );
                    $stokSebelum = (float) $stock->kuantitas;
                    $stock->increment('kuantitas', $qtyDiterima);

                    StockMutasi::create([
                        'outlet_id'       => $outletId,
                        'bahan_baku_id'   => $poItem->bahan_baku_id,
                        'tipe'            => 'in',
                        'kuantitas'       => $qtyDiterima,
                        'stok_sebelum'    => $stokSebelum,
                        'stok_sesudah'    => $stokSebelum + $qtyDiterima,
                        'referensi_type'  => Receiving::class,
                        'referensi_id'    => $receiving->id,
                        'catatan'         => "Receiving PO: {$po->nomor_po}",
                        'created_by'      => $userId,
                    ]);
                }
            }

            return $receiving->load([
                'purchaseOrder.supplier',
                'status',
                'createdBy',
                'items.bahanBaku',
            ]);
        });

        return $this->successResponse(new ReceivingResource($result), 'Receiving created successfully', 201);
    }

    public function destroy(int $id): JsonResponse
    {
        $receiving = Receiving::find($id);
        if (!$receiving) {
            return $this->errorResponse('Receiving not found', 404);
        }

        DB::transaction(function () use ($receiving) {
            $receiving->items()->delete();
            $receiving->delete();
        });

        return $this->successResponse(null, 'Receiving deleted successfully');
    }
}
