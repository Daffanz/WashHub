<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Status extends Model
{
    protected $fillable = [
        'slug',
        'nama',
        'grup',
        'deskripsi',
    ];

    public function scopeGrup($query, string $grup)
    {
        return $query->where('grup', $grup);
    }

    public function scopeBySlug($query, string $slug)
    {
        return $query->where('slug', $slug);
    }

    public function purchaseOrders(): HasMany
    {
        return $this->hasMany(PurchaseOrder::class);
    }

    public function receivings(): HasMany
    {
        return $this->hasMany(Receiving::class);
    }

    public function distributions(): HasMany
    {
        return $this->hasMany(Distribution::class);
    }

    public function mesins(): HasMany
    {
        return $this->hasMany(Mesin::class);
    }
}
