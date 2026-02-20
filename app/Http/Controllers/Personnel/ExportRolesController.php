<?php

namespace App\Http\Controllers\Personnel;

use App\Actions\Roles\DispatchRolesSpreadsheetExportAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Roles\ExportRoleRequest;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;

class ExportRolesController extends Controller
{
    public function __invoke(
        ExportRoleRequest $request,
        DispatchRolesSpreadsheetExportAction $action,
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
