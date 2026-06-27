<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        $query = Notification::byUser($request->user()->id);

        if ($request->boolean('unread_only')) {
            $query->unread();
        }

        if ($type = $request->input('type')) {
            $query->byType($type);
        }

        $data = $query->latest()->paginate($request->input('per_page', 10));

        return $this->successResponse([
            'items' => $data,
            'pagination' => [
                'current_page' => $data->currentPage(),
                'last_page' => $data->lastPage(),
                'per_page' => $data->perPage(),
                'total' => $data->total(),
            ],
        ], 'Notifications retrieved successfully');
    }

    public function markRead(int $id, Request $request): JsonResponse
    {
        $notification = Notification::where('user_id', $request->user()->id)
            ->findOrFail($id);

        $notification->update([
            'is_read' => true,
            'read_at' => now(),
        ]);

        return $this->successResponse($notification, 'Notification marked as read');
    }

    public function markAllRead(Request $request): JsonResponse
    {
        Notification::byUser($request->user()->id)
            ->unread()
            ->update([
                'is_read' => true,
                'read_at' => now(),
            ]);

        return $this->successResponse(null, 'All notifications marked as read');
    }

    public function unreadCount(Request $request): JsonResponse
    {
        $count = Notification::byUser($request->user()->id)->unread()->count();
        return $this->successResponse(['count' => $count], 'Unread count retrieved');
    }
}
