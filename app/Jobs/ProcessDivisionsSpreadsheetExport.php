<?php

namespace App\Jobs;

use App\Exports\DivisionsExport;
use App\Models\User;
use App\Notifications\SpreadsheetExportReady;
use App\Support\SearchFilterCatalog;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Facades\Excel;

class ProcessDivisionsSpreadsheetExport implements ShouldBeUnique, ShouldQueue
{
    use Queueable;

    public function __construct(public User $user, public array $filters = []) {}

    public function uniqueId(): string
    {
        return (string) $this->user->id;
    }

    public function handle(): void
    {
        $export = new DivisionsExport($this->filters);

        if (! $export->query()->exists()) {
            return;
        }

        $fileName = Str::of(config('amnsa.exports_storage_path'))
            ->append('/divisions/', $this->user->id)
            ->append('/', now()->format('Y-m-d-His-u'), '.xlsx')
            ->toString();

        Excel::store($export, $fileName);

        try {
            $this->user->notify(new SpreadsheetExportReady(
                filePath: $fileName,
                exportName: 'Naves',
                appliedFilters: SearchFilterCatalog::resolveAppliedLabels($this->filters),
            ));
        } finally {
            Storage::delete($fileName);
        }
    }
}
