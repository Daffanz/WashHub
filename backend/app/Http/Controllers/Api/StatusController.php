<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Status;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StatusController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        $query = Status::query();

        if ($grup = $request->input('grup')) {
            $query->where('grup', $grup);
        }

        $data = $query->orderBy('grup')->orderBy('id')->get();
        return $this->successResponse($data, 'Statuses retrieved successfully');
    }

    public function byGroup(string $grup): JsonResponse
    {
        $data = Status::where('grup', $grup)->orderBy('id')->get();
        return $this->successResponse($data, "Statuses for group {$grup} retrieved successfully");
    }
}
