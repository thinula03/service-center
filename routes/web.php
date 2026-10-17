<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Organization\CustomerController;
use App\Http\Controllers\Organization\ServiceOfferingController;
use App\Http\Controllers\Organization\ServiceRequestController;
use App\Http\Controllers\Organizations\OrganizationOnboardingController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified', 'active-user'])->group(function () {
    Route::get('dashboard', DashboardController::class)->name('dashboard');
    Route::get('organization/setup', [OrganizationOnboardingController::class, 'create'])->name('organizations.create');
    Route::post('organizations', [OrganizationOnboardingController::class, 'store'])->name('organizations.store');

    Route::prefix('organization/services')->name('organization.services.')->group(function () {
        Route::get('/', [ServiceOfferingController::class, 'index'])->name('index');
        Route::post('/', [ServiceOfferingController::class, 'store'])->name('store');
        Route::get('{offering}/edit', [ServiceOfferingController::class, 'edit'])->name('edit');
        Route::patch('{offering}', [ServiceOfferingController::class, 'update'])->name('update');
        Route::delete('{offering}', [ServiceOfferingController::class, 'destroy'])->name('destroy');
    });

    Route::prefix('organization/customers')->name('organization.customers.')->group(function () {
        Route::get('/', [CustomerController::class, 'index'])->name('index');
        Route::post('/', [CustomerController::class, 'store'])->name('store');
        Route::get('{customer}', [CustomerController::class, 'show'])->name('show');
        Route::post('{customer}/vehicles', [CustomerController::class, 'storeVehicle'])->name('vehicles.store');
    });

    Route::prefix('organization/requests')->name('organization.requests.')->group(function () {
        Route::get('/', [ServiceRequestController::class, 'index'])->name('index');
        Route::post('/', [ServiceRequestController::class, 'store'])->name('store');
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/admin.php';
