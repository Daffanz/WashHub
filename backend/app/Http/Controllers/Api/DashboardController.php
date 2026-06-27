<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\PurchaseOrder;
use App\Models\Receiving;
use App\Models\Distribution;
use App\Models\Stock;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    use ApiResponse;

    public function stats(): JsonResponse
    {
        $stats = [
            'kpi' => [
                'total_users'       => User::count(),
                'total_purchase_orders' => PurchaseOrder::count(),
                'total_receivings'  => Receiving::count(),
                'total_distributions' => Distribution::count(),
            ],
            'user_stats' => [
                'total_users' => User::count(),
                'active_users' => User::where('is_active', true)->count(),
            ],
        ];

        return $this->successResponse($stats, 'Dashboard statistics retrieved successfully');
    }
}
