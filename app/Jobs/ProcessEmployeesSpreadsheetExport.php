<?php

namespace App\Jobs;

use App\Exports\EmployeesExport;
use App\Models\User;
use App\Notifications\SpreadsheetExportReady;
use App\Support\SearchFilterCatalog;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Facades\Excel;

class ProcessEmployeesSpreadsheetExport implements ShouldBeUnique, ShouldQueue
{
    use Queueable;

    public function __construct(public User $user, public array $filters = []) {}

    public function uniqueId(): string
    {
        return (string) $this->user->id;
    }

    public function handle(SearchFilterCatalog $catalog): void
    {
        $export = new EmployeesExport($this->filters);

        if (! $export->query()->exists()) {
            return;
        }

        $fileName = Str::of(config('amnsa.exports_storage_path'))
            ->append('/empleados/', $this->user->id)
            ->append('/', now()->format('Y-m-d-His-u'), '.xlsx')
            ->toString();

        Excel::store($export, $fileName);

        try {
            $this->user->notify(new SpreadsheetExportReady(
                filePath: $fileName,
                exportName: 'Personal',
                appliedFilters: SearchFilterCatalog::resolveAppliedLabels($this->filters, $catalog->forEmployees()),
            ));
        } finally {
            Storage::delete($fileName);
        }
    }
}
