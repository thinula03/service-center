<?php

namespace App\Http\Controllers\Admin;

use App\Domains\Administration\Application\Actions\RecordAdminActivity;
use App\Domains\Organizations\Infrastructure\Models\Branch;
use App\Domains\Organizations\Infrastructure\Models\Organization;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreBranchRequest;
use App\Http\Requests\Admin\UpdateBranchRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class BranchController extends Controller
{
    public function store(StoreBranchRequest $request, Organization $organization, RecordAdminActivity $record): RedirectResponse
    {
        $data = $request->validated();
        $branch = $organization->branches()->create([
            ...$data,
            'slug' => $this->uniqueSlug($organization, $data['name']),
            'country_code' => 'LK',
            'is_default' => ! $organization->branches()->exists(),
            'service_hours' => $this->defaultServiceHours(),
        ]);

        $record->handle($request->user(), 'branch.created', $branch, ['organization_id' => $organization->id], $request->ip());

        return back()->with('success', "{$branch->name} was created.");
    }

    public function edit(Organization $organization, Branch $branch): Response
    {
        $this->ensureBranchBelongsToOrganization($organization, $branch);

        return Inertia::render('admin/organizations/branches/edit', [
            'organization' => $organization->only(['id', 'name']),
            'branch' => $branch,
        ]);
    }

    public function update(UpdateBranchRequest $request, Organization $organization, Branch $branch, RecordAdminActivity $record): RedirectResponse
    {
        $this->ensureBranchBelongsToOrganization($organization, $branch);
        $branch->update($request->validated());
        $record->handle($request->user(), 'branch.updated', $branch, ['organization_id' => $organization->id], $request->ip());

        return to_route('admin.organizations.show', $organization)->with('success', "{$branch->name} was updated.");
    }

    public function setDefault(Request $request, Organization $organization, Branch $branch, RecordAdminActivity $record): RedirectResponse
    {
        $this->ensureBranchBelongsToOrganization($organization, $branch);

        DB::transaction(function () use ($organization, $branch): void {
            $organization->branches()->update(['is_default' => false]);
            $branch->update(['is_default' => true, 'is_active' => true]);
        });

        $record->handle($request->user(), 'branch.default_changed', $branch, ['organization_id' => $organization->id], $request->ip());

        return back()->with('success', "{$branch->name} is now the default branch.");
    }

    public function updateStatus(Request $request, Organization $organization, Branch $branch, RecordAdminActivity $record): RedirectResponse
    {
        $this->ensureBranchBelongsToOrganization($organization, $branch);
        abort_if($branch->is_default && $branch->is_active, 422, 'The default branch cannot be deactivated.');
        $branch->update(['is_active' => ! $branch->is_active]);
        $record->handle($request->user(), 'branch.status_changed', $branch, ['is_active' => $branch->is_active], $request->ip());

        return back()->with('success', "{$branch->name} status was updated.");
    }

    private function ensureBranchBelongsToOrganization(Organization $organization, Branch $branch): void
    {
        abort_unless($branch->organization_id === $organization->id, 404);
    }

    private function uniqueSlug(Organization $organization, string $name): string
    {
        $base = Str::slug($name) ?: 'branch';
        $slug = $base;
        $suffix = 2;
        while ($organization->branches()->where('slug', $slug)->exists()) {
            $slug = "{$base}-{$suffix}";
            $suffix++;
        }

        return $slug;
    }

    private function defaultServiceHours(): array
    {
        return collect(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'])
            ->mapWithKeys(fn (string $day): array => [$day => ['open' => '08:30', 'close' => '17:30', 'closed' => $day === 'sunday']])
            ->all();
    }
}
