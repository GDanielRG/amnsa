<?php

use App\Http\Controllers\Personnel\DivisionController;
use App\Http\Controllers\Personnel\EmployeeController;
use App\Http\Controllers\Personnel\ExportDivisionsController;
use App\Http\Controllers\Personnel\ExportEmployeesController;
use App\Http\Controllers\Personnel\ExportRolesController;
use App\Http\Controllers\Personnel\RoleController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::post('divisions/export', ExportDivisionsController::class)->name('divisions.export');
    Route::post('employees/export', ExportEmployeesController::class)->name('employees.export');
    Route::post('roles/export', ExportRolesController::class)->name('roles.export');

    Route::resource('divisions', DivisionController::class);
    Route::resource('employees', EmployeeController::class);
    Route::resource('roles', RoleController::class);
});

require __DIR__.'/settings.php';
