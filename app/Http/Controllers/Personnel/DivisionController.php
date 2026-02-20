<?php

namespace App\Http\Controllers\Personnel;

use App\Actions\Divisions\CreateDivisionAction;
use App\Actions\Divisions\DestroyDivisionAction;
use App\Actions\Divisions\UpdateDivisionAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Divisions\CreateDivisionRequest;
use App\Http\Requests\Divisions\DestroyDivisionRequest;
use App\Http\Requests\Divisions\EditDivisionRequest;
use App\Http\Requests\Divisions\IndexDivisionRequest;
use App\Http\Requests\Divisions\ShowDivisionRequest;
use App\Http\Requests\Divisions\StoreDivisionRequest;
use App\Http\Requests\Divisions\UpdateDivisionRequest;
use App\Models\Division;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class DivisionController extends Controller
{
    public function index(IndexDivisionRequest $request): Response
    {
        return Inertia::render('divisions', [
            'divisions' => Division::filter($request->only('search'))
                ->sort($request->input('sort'), $request->input('order'))
                ->withCount('operators')
                ->paginate()->withQueryString(),
        ]);
    }

    public function create(CreateDivisionRequest $request): Response
    {
        return Inertia::render('division-creation');
    }

    public function store(StoreDivisionRequest $request, CreateDivisionAction $action): RedirectResponse
    {
        $division = $action(name: $request->name);

        Inertia::flash('success', 'Nave creada exitosamente');

        return to_route('divisions.show', ['division' => $division]);
    }

    public function show(ShowDivisionRequest $request, Division $division): Response
    {
        return Inertia::render('division', [
            'division' => $division->loadCount('operators'),
        ]);
    }

    public function edit(EditDivisionRequest $request, Division $division): Response
    {
        return Inertia::render('division-edit', [
            'division' => $division,
        ]);
    }

    public function update(UpdateDivisionRequest $request, Division $division, UpdateDivisionAction $action): RedirectResponse
    {
        Inertia::flash('success', 'Nave actualizada exitosamente');

        return to_route('divisions.show', [
            'division' => $action(
                division: $division,
                name: $request->name
            ),
        ]);
    }

    public function destroy(DestroyDivisionRequest $request, Division $division, DestroyDivisionAction $action): RedirectResponse
    {
        if ($division->operators()->exists()) {
            return Inertia::flash('error', 'No se puede eliminar una nave que tiene operadores asignados.')
                ->back();
        }

        $action($division);

        Inertia::flash('success', 'Nave eliminada exitosamente');

        return to_route('divisions.index');
    }
}
