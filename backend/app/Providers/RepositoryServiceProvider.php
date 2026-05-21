<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Repositories\Interfaces\UserRepositoryInterface;
use App\Repositories\Interfaces\RoleRepositoryInterface;
use App\Repositories\Implementations\UserRepository;
use App\Repositories\Implementations\RoleRepository;

class RepositoryServiceProvider extends ServiceProvider
{
    /**
     * All repository bindings.
     *
     * @var array<string, string>
     */
    protected array $repositories = [
        UserRepositoryInterface::class => UserRepository::class,
        RoleRepositoryInterface::class => RoleRepository::class,
    ];

    /**
     * Register services.
     */
    public function register(): void
    {
        foreach ($this->repositories as $interface => $implementation) {
            $this->app->bind($interface, $implementation);
        }
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
