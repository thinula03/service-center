<?php

namespace App\Http\Controllers\Admin;

use App\Domains\Administration\Application\Actions\RecordAdminActivity;
use App\Domains\Organizations\Domain\Enums\OrganizationStatus;
use App\Domains\Organizations\Infrastructure\Models\Organization;
use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OrganizationController extends Controller
{
    public function index(Request $request): Response
    {
        $search = trim((string) $request->string('search'));

        return Inertia::render('admin/organizations/index', [
            'filters' => ['search' => $search],
            'organizations' => Organization::query()
                ->when($search, fn ($query) => $query->where(fn ($inner) => $inner
                    ->where('name', 'like', "%{$search}%")
                    ->orWhere('slug', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")))
                ->withCount(['branches', 'users'])
                ->latest()
                ->paginate(15)
                ->withQueryString(),
        ]);
    }

    public function show(Organization $organization): Response
    {
        $organization->load([
            'branches' => fn ($query) => $query->orderByDesc('is_default')->orderBy('name'),
            'users' => fn ($query) => $query->orderBy('name'),
        ]);

        return Inertia::render('admin/organizations/show', [
            'organization' => $organization,
            'members' => $organization->users->map(fn ($user): array => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'status' => $user->status,
                'role' => $user->pivot->role,
            ]),
        ]);
    }

    public function update(Request $request, Organization $organization, RecordAdminActivity $record): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'email' => ['nullable', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:32'],
        ]);
        $organization->update($data);
        $record->handle($request->user(), 'organization.updated', $organization, [], $request->ip());

        return back()->with('success', 'Organization details were updated.');
    }

    public function updateStatus(Request $request, Organization $organization, RecordAdminActivity $record): RedirectResponse
    {
        $data = $request->validate(['status' => ['required', 'in:active,suspended']]);
        $previous = $organization->status->value;
        $organization->update(['status' => OrganizationStatus::from($data['status'])]);

        $record->handle($request->user(), 'organization.status_changed', $organization, [
            'from' => $previous,
            'to' => $data['status'],
        ], $request->ip());

        return back()->with('success', "{$organization->name} is now {$data['status']}.");
    }
}
