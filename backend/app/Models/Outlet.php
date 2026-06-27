<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\Permission\Traits\HasRoles;

class Outlet extends Model
{
    use HasRoles;

    protected $fillable = [
        'kode',
        'nama',
        'alamat',
        'telepon',
        'email',
        'pic_nama',
        'pic_telepon',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    public function stocks(): HasMany
    {
        return $this->hasMany(Stock::class);
    }

    public function stockMutasis(): HasMany
    {
        return $this->hasMany(StockMutasi::class);
    }

    public function minimumStocks(): HasMany
    {
        return $this->hasMany(MinimumStock::class);
    }
}
