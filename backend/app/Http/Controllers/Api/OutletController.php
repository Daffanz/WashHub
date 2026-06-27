<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\OutletResource;
use App\Models\Outlet;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OutletController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        $query = Outlet::query();

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
            'items' => OutletResource::collection($data),
            'pagination' => [
                'current_page' => $data->currentPage(),
                'last_page'    => $data->lastPage(),
                'per_page'     => $data->perPage(),
                'total'        => $data->total(),
            ],
        ], 'Outlets retrieved successfully');
    }

    public function show(int $id): JsonResponse
    {
        $data = Outlet::find($id);
        if (!$data) {
            return $this->errorResponse('Outlet not found', 404);
        }
        return $this->successResponse(new OutletResource($data), 'Outlet retrieved successfully');
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'kode'        => 'required|string|max:50|unique:outlets,kode',
            'nama'        => 'required|string|max:255',
            'alamat'      => 'nullable|string',
            'telepon'     => 'nullable|string|max:20',
            'email'       => 'nullable|email|max:255',
            'pic_nama'    => 'nullable|string|max:255',
            'pic_telepon' => 'nullable|string|max:20',
            'is_active'   => 'boolean',
        ]);

        $data = Outlet::create($validated);
        return $this->successResponse(new OutletResource($data), 'Outlet created successfully', 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $data = Outlet::find($id);
        if (!$data) {
            return $this->errorResponse('Outlet not found', 404);
        }

        $validated = $request->validate([
            'kode'        => 'required|string|max:50|unique:outlets,kode,' . $id,
            'nama'        => 'required|string|max:255',
            'alamat'      => 'nullable|string',
            'telepon'     => 'nullable|string|max:20',
            'email'       => 'nullable|email|max:255',
            'pic_nama'    => 'nullable|string|max:255',
            'pic_telepon' => 'nullable|string|max:20',
            'is_active'   => 'boolean',
        ]);

        $data->update($validated);
        return $this->successResponse(new OutletResource($data->fresh()), 'Outlet updated successfully');
    }

    public function destroy(int $id): JsonResponse
    {
        $data = Outlet::find($id);
        if (!$data) {
            return $this->errorResponse('Outlet not found', 404);
        }
        $data->delete();
        return $this->successResponse(null, 'Outlet deleted successfully');
    }
}
