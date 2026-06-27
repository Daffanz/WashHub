<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Distribution extends Model
{
    protected $table = 'distributions';

    protected $fillable = [
        'nomor_distribusi',
        'outlet_id',
        'asal_outlet_id',
        'status_id',
        'tanggal_distribusi',
        'catatan',
        'created_by',
        'confirmed_by',
        'confirmed_at',
    ];

    protected function casts(): array
    {
        return [
            'tanggal_distribusi' => 'date',
            'confirmed_at' => 'datetime',
        ];
    }

    public function outlet(): BelongsTo
    {
        return $this->belongsTo(Outlet::class)->comment('Tujuan distribusi');
    }

    public function asalOutlet(): BelongsTo
    {
        return $this->belongsTo(Outlet::class, 'asal_outlet_id');
    }

    public function status(): BelongsTo
    {
        return $this->belongsTo(Status::class);
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function confirmedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'confirmed_by');
    }

    public function items(): HasMany
    {
        return $this->hasMany(DistributionItem::class);
    }
}
