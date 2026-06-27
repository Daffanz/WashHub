<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\PurchaseOrderResource;
use App\Http\Requests\StorePurchaseOrderRequest;
use App\Http\Requests\UpdatePurchaseOrderRequest;
use App\Models\PurchaseOrder;
use App\Models\PurchaseOrderItem;
use App\Models\Status;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PurchaseOrderController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        $query = PurchaseOrder::with(['supplier', 'outlet', 'status', 'createdBy', 'items.bahanBaku']);

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('nomor_po', 'like', "%{$search}%")
                  ->orWhereHas('supplier', fn($s) => $s->where('nama', 'like', "%{$search}%"));
            });
        }

        if ($supplierId = $request->input('supplier_id')) {
            $query->where('supplier_id', $supplierId);
        }

        if ($outletId = $request->input('outlet_id')) {
            $query->where('outlet_id', $outletId);
        }

        if ($statusId = $request->input('status_id')) {
            $query->where('status_id', $statusId);
        }

        if ($statusSlug = $request->input('status_slug')) {
            $query->whereHas('status', fn($s) => $s->where('slug', $statusSlug));
        }

        if ($dateFrom = $request->input('date_from')) {
            $query->whereDate('tanggal_pesan', '>=', $dateFrom);
        }

        if ($dateTo = $request->input('date_to')) {
            $query->whereDate('tanggal_pesan', '<=', $dateTo);
        }

        if ($createdBy = $request->input('created_by')) {
            $query->where('created_by', $createdBy);
        }

        $data = $query->latest()->paginate($request->input('per_page', 10));

        return $this->successResponse([
            'items' => PurchaseOrderResource::collection($data),
            'pagination' => [
                'current_page' => $data->currentPage(),
                'last_page'    => $data->lastPage(),
                'per_page'     => $data->perPage(),
                'total'        => $data->total(),
            ],
        ], 'Purchase orders retrieved successfully');
    }

    public function show(int $id): JsonResponse
    {
        $data = PurchaseOrder::with(['supplier', 'outlet', 'status', 'createdBy', 'items.bahanBaku.kategoriBahan'])->find($id);
        if (!$data) {
            return $this->errorResponse('Purchase order not found', 404);
        }
        return $this->successResponse(new PurchaseOrderResource($data), 'Purchase order retrieved successfully');
    }

    public function store(StorePurchaseOrderRequest $request): JsonResponse
    {
        $data = DB::transaction(function () use ($request) {
            $draftStatus = Status::where('slug', 'po.draft')->where('grup', 'purchase_order')->firstOrFail();

            $prefix   = 'PO-' . date('Ymd') . '-';
            $last     = PurchaseOrder::where('nomor_po', 'like', "{$prefix}%")->orderByDesc('id')->lockForUpdate()->first();
            $seq      = $last ? (int) substr($last->nomor_po, -4) + 1 : 1;
            $nomorPo  = $prefix . str_pad($seq, 4, '0', STR_PAD_LEFT);

            $items    = $request->input('items');
            $subtotal = collect($items)->sum(fn($i) => $i['kuantitas'] * $i['harga_satuan']);

            $po = PurchaseOrder::create([
                'nomor_po'           => $nomorPo,
                'supplier_id'        => $request->input('supplier_id'),
                'outlet_id'          => $request->input('outlet_id'),
                'status_id'          => $draftStatus->id,
                'tanggal_pesan'      => $request->input('tanggal_pesan'),
                'tanggal_diperlukan' => $request->input('tanggal_diperlukan'),
                'catatan'            => $request->input('catatan'),
                'subtotal'           => $subtotal,
                'created_by'         => $request->user()->id,
            ]);

            foreach ($items as $item) {
                PurchaseOrderItem::create([
                    'purchase_order_id' => $po->id,
                    'bahan_baku_id'     => $item['bahan_baku_id'],
                    'kuantitas'         => $item['kuantitas'],
                    'harga_satuan'      => $item['harga_satuan'],
                    'subtotal'          => $item['kuantitas'] * $item['harga_satuan'],
                    'catatan'           => $item['catatan'] ?? null,
                ]);
            }

            return $po->load(['supplier', 'outlet', 'status', 'createdBy', 'items.bahanBaku']);
        });

        return $this->successResponse(new PurchaseOrderResource($data), 'Purchase order created successfully', 201);
    }

    public function update(UpdatePurchaseOrderRequest $request, int $id): JsonResponse
    {
        $po = PurchaseOrder::with(['status', 'items'])->find($id);
        if (!$po) {
            return $this->errorResponse('Purchase order not found', 404);
        }

        if ($po->status->slug !== 'po.draft') {
            return $this->errorResponse('Cannot edit purchase order that is not in draft status.', 422);
        }

        $data = DB::transaction(function () use ($request, $po) {
            $items    = $request->input('items');
            $subtotal = collect($items)->sum(fn($i) => $i['kuantitas'] * $i['harga_satuan']);

            $po->update([
                'supplier_id'        => $request->input('supplier_id'),
                'outlet_id'          => $request->input('outlet_id'),
                'tanggal_pesan'      => $request->input('tanggal_pesan'),
                'tanggal_diperlukan' => $request->input('tanggal_diperlukan'),
                'catatan'            => $request->input('catatan'),
                'subtotal'           => $subtotal,
                'updated_by'         => $request->user()->id,
            ]);

            $existingIds = $po->items->pluck('id')->toArray();
            $incomingIds = collect($items)->pluck('id')->filter()->toArray();
            $toDelete    = array_diff($existingIds, $incomingIds);

            PurchaseOrderItem::whereIn('id', $toDelete)->delete();

            foreach ($items as $item) {
                $itemData = [
                    'purchase_order_id' => $po->id,
                    'bahan_baku_id'     => $item['bahan_baku_id'],
                    'kuantitas'         => $item['kuantitas'],
                    'harga_satuan'      => $item['harga_satuan'],
                    'subtotal'          => $item['kuantitas'] * $item['harga_satuan'],
                    'catatan'           => $item['catatan'] ?? null,
                ];

                if (!empty($item['id'])) {
                    PurchaseOrderItem::where('id', $item['id'])->update($itemData);
                } else {
                    PurchaseOrderItem::create($itemData);
                }
            }

            return $po->fresh()->load(['supplier', 'outlet', 'status', 'createdBy', 'items.bahanBaku']);
        });

        return $this->successResponse(new PurchaseOrderResource($data), 'Purchase order updated successfully');
    }

    public function destroy(int $id): JsonResponse
    {
        $po = PurchaseOrder::with('status')->find($id);
        if (!$po) {
            return $this->errorResponse('Purchase order not found', 404);
        }

        if ($po->status->slug !== 'po.draft') {
            return $this->errorResponse('Cannot delete purchase order that is not in draft status.', 422);
        }

        DB::transaction(function () use ($po) {
            $po->items()->delete();
            $po->delete();
        });

        return $this->successResponse(null, 'Purchase order deleted successfully');
    }

    public function send(int $id, Request $request): JsonResponse
    {
        $po = PurchaseOrder::with(['status', 'items'])->find($id);
        if (!$po) {
            return $this->errorResponse('Purchase order not found', 404);
        }

        if ($po->status->slug !== 'po.draft') {
            return $this->errorResponse('Only draft purchase order can be sent.', 422);
        }

        if ($po->items()->count() === 0) {
            return $this->errorResponse('Purchase order must have at least 1 item before sending.', 422);
        }

        $sentStatus = Status::where('slug', 'po.dikirim')->where('grup', 'purchase_order')->firstOrFail();

        $po->update([
            'status_id'  => $sentStatus->id,
            'updated_by' => $request->user()->id,
        ]);

        return $this->successResponse(
            new PurchaseOrderResource($po->fresh()->load(['supplier', 'outlet', 'status', 'createdBy', 'items.bahanBaku'])),
            'Purchase order sent successfully'
        );
    }

    public function approve(int $id, Request $request): JsonResponse
    {
        $po = PurchaseOrder::with('status')->find($id);
        if (!$po) {
            return $this->errorResponse('Purchase order not found', 404);
        }

        if ($po->status->slug !== 'po.dikirim') {
            return $this->errorResponse('Only sent purchase order can be approved.', 422);
        }

        $approvedStatus = Status::where('slug', 'po.diterima')->where('grup', 'purchase_order')->firstOrFail();

        $po->update([
            'status_id'       => $approvedStatus->id,
            'tanggal_diterima' => now()->toDateString(),
            'updated_by'      => $request->user()->id,
        ]);

        return $this->successResponse(
            new PurchaseOrderResource($po->fresh()->load(['supplier', 'outlet', 'status', 'createdBy', 'items.bahanBaku'])),
            'Purchase order approved successfully'
        );
    }

    public function reject(int $id, Request $request): JsonResponse
    {
        $po = PurchaseOrder::with('status')->find($id);
        if (!$po) {
            return $this->errorResponse('Purchase order not found', 404);
        }

        if ($po->status->slug !== 'po.dikirim') {
            return $this->errorResponse('Only sent purchase order can be rejected.', 422);
        }

        $rejectedStatus = Status::where('slug', 'po.ditolak')->where('grup', 'purchase_order')->firstOrFail();

        $po->update([
            'status_id'  => $rejectedStatus->id,
            'updated_by' => $request->user()->id,
        ]);

        return $this->successResponse(
            new PurchaseOrderResource($po->fresh()->load(['supplier', 'outlet', 'status', 'createdBy', 'items.bahanBaku'])),
            'Purchase order rejected successfully'
        );
    }
}
