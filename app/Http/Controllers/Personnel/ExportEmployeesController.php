<?php

namespace App\Http\Controllers\Personnel;

use App\Actions\Employees\DispatchEmployeesSpreadsheetExportAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Employees\ExportEmployeeRequest;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;

class ExportEmployeesController extends Controller
{
    public function __invoke(
        ExportEmployeeRequest $request,
        DispatchEmployeesSpreadsheetExportAction $action,
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
