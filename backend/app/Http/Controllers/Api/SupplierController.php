<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\SupplierResource;
use App\Models\Supplier;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SupplierController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        $query = Supplier::query();

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('nama', 'like', "%{$search}%")
                  ->orWhere('kode', 'like', "%{$search}%");
            });
        }

        if ($request->has('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        $data = $query->latest()->paginate($request->input('per_page', 10));

        return $this->successResponse([
            'items' => SupplierResource::collection($data),
            'pagination' => [
                'current_page' => $data->currentPage(),
                'last_page'    => $data->lastPage(),
                'per_page'     => $data->perPage(),
                'total'        => $data->total(),
            ],
        ], 'Suppliers retrieved successfully');
    }

    public function show(int $id): JsonResponse
    {
        $data = Supplier::find($id);
        if (!$data) {
            return $this->errorResponse('Supplier not found', 404);
        }
        return $this->successResponse(new SupplierResource($data), 'Supplier retrieved successfully');
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'kode'      => 'required|string|max:50|unique:suppliers,kode',
            'nama'      => 'required|string|max:255',
            'kontak'    => 'nullable|string|max:255',
            'telepon'   => 'nullable|string|max:20',
            'email'     => 'nullable|email|max:255',
            'alamat'    => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $data = Supplier::create($validated);
        return $this->successResponse(new SupplierResource($data), 'Supplier created successfully', 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $data = Supplier::find($id);
        if (!$data) {
            return $this->errorResponse('Supplier not found', 404);
        }

        $validated = $request->validate([
            'kode'      => 'required|string|max:50|unique:suppliers,kode,' . $id,
            'nama'      => 'required|string|max:255',
            'kontak'    => 'nullable|string|max:255',
            'telepon'   => 'nullable|string|max:20',
            'email'     => 'nullable|email|max:255',
            'alamat'    => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $data->update($validated);
        return $this->successResponse(new SupplierResource($data->fresh()), 'Supplier updated successfully');
    }

    public function destroy(int $id): JsonResponse
    {
        $data = Supplier::find($id);
        if (!$data) {
            return $this->errorResponse('Supplier not found', 404);
        }
        $data->delete();
        return $this->successResponse(null, 'Supplier deleted successfully');
    }
}
