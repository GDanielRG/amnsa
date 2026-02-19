<?php

namespace App\Notifications;

use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class SpreadsheetExportReady extends Notification
{
    /**
     * @param  array<string, string>  $appliedFilters
     */
    public function __construct(
        private string $filePath,
        private string $exportName,
        private array $appliedFilters = [],
    ) {}

    /**
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $displayName = Str::afterLast($this->filePath, '/');
        $timezone = (string) config('amnsa.timezone');
        $generatedAt = now()->timezone($timezone)->format('d/m/Y H:i');

        $message = (new MailMessage)
            ->subject('Tu reporte de ' . config('app.name') . ' está listo')
            ->line('Hemos terminado de generar tu reporte. Adjunto encontrarás el archivo.')
            ->line("**Reporte:** {$this->exportName}")
            ->line("**Generado:** {$generatedAt}");

        if ($this->appliedFilters !== []) {
            $message->line('**Filtros aplicados:**');

            foreach ($this->appliedFilters as $label => $value) {
                $message->line("- {$label}: {$value}");
            }
        }

        return $message->attach(Storage::path($this->filePath), [
            'as' => $displayName,
            'mime' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ]);
    }
}
