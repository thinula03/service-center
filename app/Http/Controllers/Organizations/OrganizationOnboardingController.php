<?php

namespace App\Http\Controllers\Organizations;

use App\Domains\Organizations\Application\Actions\CreateOrganization;
use App\Http\Controllers\Controller;
use App\Http\Requests\Organizations\StoreOrganizationRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OrganizationOnboardingController extends Controller
{
    public function create(Request $request): Response|RedirectResponse
    {
        if ($request->user()->organizations()->exists()) {
            return to_route('dashboard');
        }

        return Inertia::render('organizations/create');
    }

    public function store(StoreOrganizationRequest $request, CreateOrganization $createOrganization): RedirectResponse
    {
        if ($request->user()->organizations()->exists()) {
            return to_route('dashboard');
        }

        $createOrganization->handle($request->user(), $request->validated());

        return to_route('dashboard')->with('success', 'Your organization and first branch are ready.');
    }
}
