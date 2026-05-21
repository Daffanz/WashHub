<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\UserService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    use ApiResponse;

    public function __construct(
        protected UserService $userService
    ) {}

    /**
     * Get dashboard statistics.
     */
    public function stats(): JsonResponse
    {
        $userStats = $this->userService->getStats();

        // Dummy data for dashboard - will be replaced with real data in future phases
        $stats = [
            'kpi' => [
                'total_users' => $userStats['total_users'],
                'active_outlets' => 12,
                'monthly_revenue' => 45000000,
                'total_orders' => 1250,
            ],
            'revenue_chart' => [
                ['month' => 'Jan', 'revenue' => 32000000, 'orders' => 180],
                ['month' => 'Feb', 'revenue' => 35000000, 'orders' => 200],
                ['month' => 'Mar', 'revenue' => 38000000, 'orders' => 220],
                ['month' => 'Apr', 'revenue' => 42000000, 'orders' => 250],
                ['month' => 'May', 'revenue' => 45000000, 'orders' => 280],
                ['month' => 'Jun', 'revenue' => 48000000, 'orders' => 310],
            ],
            'recent_activities' => [
                ['id' => 1, 'action' => 'New order received', 'outlet' => 'Outlet Jakarta Pusat', 'time' => '2 minutes ago'],
                ['id' => 2, 'action' => 'Inventory restocked', 'outlet' => 'Outlet Bandung', 'time' => '15 minutes ago'],
                ['id' => 3, 'action' => 'Machine maintenance completed', 'outlet' => 'Outlet Surabaya', 'time' => '1 hour ago'],
                ['id' => 4, 'action' => 'New franchise registered', 'outlet' => 'Outlet Yogyakarta', 'time' => '2 hours ago'],
                ['id' => 5, 'action' => 'Monthly report generated', 'outlet' => 'All Outlets', 'time' => '3 hours ago'],
            ],
            'outlet_performance' => [
                ['name' => 'Jakarta Pusat', 'orders' => 320, 'revenue' => 12000000, 'rating' => 4.8],
                ['name' => 'Bandung', 'orders' => 280, 'revenue' => 10500000, 'rating' => 4.6],
                ['name' => 'Surabaya', 'orders' => 250, 'revenue' => 9800000, 'rating' => 4.7],
                ['name' => 'Yogyakarta', 'orders' => 200, 'revenue' => 7500000, 'rating' => 4.5],
                ['name' => 'Semarang', 'orders' => 200, 'revenue' => 5200000, 'rating' => 4.4],
            ],
            'user_stats' => $userStats,
        ];

        return $this->successResponse($stats, 'Dashboard statistics retrieved successfully');
    }
}
