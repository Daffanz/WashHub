<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Spatie\Permission\Models\Role as SpatieRole;

class Role extends SpatieRole
{
    /**
     * Override users() to explicitly use App\Models\User,
     * which allows withCount('users') to work correctly.
     */
    public function users(): BelongsToMany
    {
        return $this->morphedByMany(
            User::class,
            'model',
            config('permission.table_names.model_has_roles'),
            config('permission.column_names.role_pivot_key') ?? 'role_id',
            config('permission.column_names.model_morph_key') ?? 'model_id'
        );
    }
}
