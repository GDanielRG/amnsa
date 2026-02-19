<?php

namespace App\Http\Controllers\Personnel;

use App\Actions\Divisions\DispatchDivisionsSpreadsheetExportAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Divisions\ExportDivisionRequest;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;

class ExportDivisionsController extends Controller
{
    public function __invoke(
        ExportDivisionRequest $request,
        DispatchDivisionsSpreadsheetExportAction $action,
    ): RedirectResponse {
        $dispatched = $action(
            user: $request->user(),
            filters: $request->validated(),
        );

        if ($dispatched) {
            Inertia::flash('success', 'Tu reporte se está generando. Te llegará por correo en unos minutos.');
        }

        return back();
    }
}
