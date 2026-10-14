<?php

namespace App\Http\Controllers\Admin;

use App\Domains\Administration\Infrastructure\Models\AdminActivityLog;
use App\Domains\Organizations\Infrastructure\Models\Branch;
use App\Domains\Organizations\Infrastructure\Models\Organization;
use App\Http\Controllers\Controller;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class AdminDashboardController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('admin/dashboard', [
            'metrics' => [
                'organizations' => Organization::query()->count(),
                'activeOrganizations' => Organization::query()->where('status', 'active')->count(),
                'branches' => Branch::query()->count(),
                'users' => User::query()->count(),
            ],
            'recentOrganizations' => Organization::query()
                ->withCount(['branches', 'users'])
                ->latest()
                ->limit(5)
                ->get(['id', 'name', 'slug', 'status', 'created_at']),
            'recentActivity' => AdminActivityLog::query()
                ->with('actor:id,name')
                ->latest()
                ->limit(8)
                ->get()
                ->map(fn (AdminActivityLog $log): array => [
                    'id' => $log->id,
                    'action' => $log->action,
                    'actor' => $log->actor?->name,
                    'created_at' => $log->created_at?->diffForHumans(),
                ]),
        ]);
    }
}
