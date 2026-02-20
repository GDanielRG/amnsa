<?php

use Carbon\Carbon;

/*
|--------------------------------------------------------------------------
| Date & Timezone Helpers
|--------------------------------------------------------------------------
|
| Centralized functions for timezone-aware date handling. All date
| comparisons and formatting should use these helpers to ensure
| consistency across the application.
|
*/

/**
 * Get the application timezone string.
 */
if (! function_exists('appTimezone')) {
    function appTimezone(): string
    {
        return config('amnsa.timezone');
    }
}

/**
 * Get current datetime in app timezone.
 */
if (! function_exists('appNow')) {
    function appNow(): Carbon
    {
        return Carbon::now(appTimezone());
    }
}

/**
 * Get today's date at midnight in app timezone.
 */
if (! function_exists('appToday')) {
    function appToday(): Carbon
    {
        return Carbon::today(appTimezone());
    }
}

/**
 * Parse a date string in app timezone for DATE column storage.
 * Use for DATE columns that represent calendar dates (not points in time).
 * Does NOT convert to UTC - preserves the date as-is.
 */
if (! function_exists('parseAppDate')) {
    function parseAppDate(Carbon|string $date): Carbon
    {
        $dateString = $date instanceof Carbon ? $date->toDateString() : $date;

        return Carbon::parse($dateString, appTimezone());
    }
}

/**
 * Convert UTC datetime to app timezone for display.
 * Use for DATETIME/TIMESTAMP columns stored in UTC.
 */
if (! function_exists('utcToAppTimezone')) {
    function utcToAppTimezone(Carbon|string $dateTime): Carbon
    {
        $carbon = $dateTime instanceof Carbon
            ? $dateTime->copy()
            : Carbon::parse($dateTime, 'UTC');

        return $carbon->timezone(appTimezone());
    }
}
