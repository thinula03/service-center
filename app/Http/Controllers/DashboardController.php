<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(Request $request): Response|RedirectResponse
    {
        $organization = $request->user()->organizations()->withCount('branches')->first();

        if (! $organization) {
            return to_route('organizations.create');
        }

        return Inertia::render('dashboard', [
            'organization' => [
                'name' => $organization->name,
                'slug' => $organization->slug,
                'branches_count' => $organization->branches_count,
            ],
        ]);
    }
}
