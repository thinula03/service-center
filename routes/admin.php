<?php

use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\BranchController;
use App\Http\Controllers\Admin\OrganizationController;
use App\Http\Controllers\Admin\ServiceCatalogueController;
use App\Http\Controllers\Admin\UserController;
use Illuminate\Support\Facades\Route;

Route::prefix('admin')->name('admin.')->middleware(['auth', 'verified', 'system-admin'])->group(function (): void {
    Route::get('/', AdminDashboardController::class)->name('dashboard');
    Route::get('organizations', [OrganizationController::class, 'index'])->name('organizations.index');
    Route::get('organizations/{organization}', [OrganizationController::class, 'show'])->name('organizations.show');
    Route::patch('organizations/{organization}', [OrganizationController::class, 'update'])->name('organizations.update');
    Route::patch('organizations/{organization}/status', [OrganizationController::class, 'updateStatus'])->name('organizations.status');
    Route::post('organizations/{organization}/branches', [BranchController::class, 'store'])->name('organizations.branches.store');
    Route::get('organizations/{organization}/branches/{branch}/edit', [BranchController::class, 'edit'])->name('organizations.branches.edit');
    Route::patch('organizations/{organization}/branches/{branch}', [BranchController::class, 'update'])->name('organizations.branches.update');
    Route::patch('organizations/{organization}/branches/{branch}/default', [BranchController::class, 'setDefault'])->name('organizations.branches.default');
    Route::patch('organizations/{organization}/branches/{branch}/status', [BranchController::class, 'updateStatus'])->name('organizations.branches.status');
    Route::get('users', [UserController::class, 'index'])->name('users.index');
    Route::patch('users/{user}/status', [UserController::class, 'updateStatus'])->name('users.status');
    Route::get('services', [ServiceCatalogueController::class, 'index'])->name('services.index');
    Route::post('service-categories', [ServiceCatalogueController::class, 'storeCategory'])->name('service-categories.store');
    Route::patch('service-categories/{category}/status', [ServiceCatalogueController::class, 'toggleCategory'])->name('service-categories.status');
    Route::post('services', [ServiceCatalogueController::class, 'storeService'])->name('services.store');
    Route::get('services/{service}/edit', [ServiceCatalogueController::class, 'editService'])->name('services.edit');
    Route::patch('services/{service}', [ServiceCatalogueController::class, 'updateService'])->name('services.update');
    Route::patch('services/{service}/status', [ServiceCatalogueController::class, 'toggleService'])->name('services.status');
});
