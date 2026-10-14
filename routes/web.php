<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Organizations\OrganizationOnboardingController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified', 'active-user'])->group(function () {
    Route::get('dashboard', DashboardController::class)->name('dashboard');
    Route::get('organization/setup', [OrganizationOnboardingController::class, 'create'])->name('organizations.create');
    Route::post('organizations', [OrganizationOnboardingController::class, 'store'])->name('organizations.store');
});

require __DIR__.'/settings.php';
require __DIR__.'/admin.php';
