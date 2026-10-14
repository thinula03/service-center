<?php

namespace App\Http\Controllers\Admin;

use App\Domains\Administration\Application\Actions\RecordAdminActivity;
use App\Domains\Services\Infrastructure\Models\ServiceCategory;
use App\Domains\Services\Infrastructure\Models\ServiceDefinition;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreServiceCategoryRequest;
use App\Http\Requests\Admin\StoreServiceDefinitionRequest;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ServiceCatalogueController extends Controller
{
    public function index(Request $request): Response
    {
        $search = trim((string) $request->string('search'));

        return Inertia::render('admin/services/index', [
            'filters' => ['search' => $search],
            'categories' => ServiceCategory::query()
                ->withCount('services')
                ->orderBy('sort_order')
                ->orderBy('name')
                ->get(),
            'services' => ServiceDefinition::query()
                ->with('category:id,name')
                ->when($search, fn ($query) => $query->where(fn ($inner) => $inner
                    ->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")))
                ->orderBy('name')
                ->paginate(20)
                ->withQueryString(),
        ]);
    }

    public function storeCategory(StoreServiceCategoryRequest $request, RecordAdminActivity $record): RedirectResponse
    {
        $data = $request->validated();
        $category = ServiceCategory::query()->create([
            ...$data,
            'slug' => $this->uniqueSlug(ServiceCategory::class, $data['name']),
        ]);
        $record->handle($request->user(), 'service_category.created', $category, [], $request->ip());

        return back()->with('success', "{$category->name} was added.");
    }

    public function toggleCategory(Request $request, ServiceCategory $category, RecordAdminActivity $record): RedirectResponse
    {
        $category->update(['is_active' => ! $category->is_active]);
        $record->handle($request->user(), 'service_category.status_changed', $category, ['is_active' => $category->is_active], $request->ip());

        return back()->with('success', "{$category->name} status was updated.");
    }

    public function storeService(StoreServiceDefinitionRequest $request, RecordAdminActivity $record): RedirectResponse
    {
        $data = $request->validated();
        $service = ServiceDefinition::query()->create([
            ...$data,
            'slug' => $this->uniqueSlug(ServiceDefinition::class, $data['name']),
        ]);
        $record->handle($request->user(), 'service_definition.created', $service, [], $request->ip());

        return back()->with('success', "{$service->name} was added to the catalogue.");
    }

    public function editService(ServiceDefinition $service): Response
    {
        return Inertia::render('admin/services/edit', [
            'service' => $service,
            'categories' => ServiceCategory::query()->orderBy('name')->get(['id', 'name', 'is_active']),
        ]);
    }

    public function updateService(StoreServiceDefinitionRequest $request, ServiceDefinition $service, RecordAdminActivity $record): RedirectResponse
    {
        $service->update($request->validated());
        $record->handle($request->user(), 'service_definition.updated', $service, [], $request->ip());

        return to_route('admin.services.index')->with('success', "{$service->name} was updated.");
    }

    public function toggleService(Request $request, ServiceDefinition $service, RecordAdminActivity $record): RedirectResponse
    {
        $service->update(['is_active' => ! $service->is_active]);
        $record->handle($request->user(), 'service_definition.status_changed', $service, ['is_active' => $service->is_active], $request->ip());

        return back()->with('success', "{$service->name} status was updated.");
    }

    /** @param class-string<Model> $model */
    private function uniqueSlug(string $model, string $name): string
    {
        $base = Str::slug($name) ?: 'service';
        $slug = $base;
        $suffix = 2;
        while ($model::query()->where('slug', $slug)->exists()) {
            $slug = "{$base}-{$suffix}";
            $suffix++;
        }

        return $slug;
    }
}
