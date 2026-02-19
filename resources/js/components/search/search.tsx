import ExportDialog from '@/components/export-dialog';
import Filters from '@/components/search/filters';
import {
    parseFilterValues,
    splitPageUrl,
} from '@/components/search/query-utils';
import SearchAppliedFilters from '@/components/search/search-applied-filters';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import type { SearchFilter } from '@/types';
import type { RouteFn, RouteMutationFn } from '@/types/wayfinder';
import { Form, usePage } from '@inertiajs/react';
import { SearchIcon } from 'lucide-react';
import type { ReactNode } from 'react';

interface UseSearchReturn {
    routeFn: RouteFn;
    filters: SearchFilter[];
    initialSearch: string;
    filterValues: Record<string, string[]>;
    hasActiveFilters: boolean;
}

export function useSearch(
    routeFn: RouteFn,
    filters: SearchFilter[] = [],
): UseSearchReturn {
    const { url } = usePage();

    const { currentSearch: queryString } = splitPageUrl(url);
    const queryParams = new URLSearchParams(queryString ?? '');

    const filterValues: Record<string, string[]> = {};
    for (const filter of filters) {
        filterValues[filter.key] = parseFilterValues(queryParams, filter.key);
    }

    const initialSearch = queryParams.get('search') ?? '';
    const hasActiveFilterValues = Object.values(filterValues).some(
        (values) => values.length > 0,
    );

    return {
        routeFn,
        filters,
        initialSearch,
        filterValues,
        hasActiveFilters: hasActiveFilterValues || initialSearch.length > 0,
    };
}

export function SearchControls({
    search,
    placeholder = 'Buscar...',
    className,
}: {
    search: UseSearchReturn;
    placeholder?: string;
    className?: string;
}) {
    return (
        <Form
            {...search.routeFn.form()}
            method="get"
            transform={(data) => {
                const merged: Record<string, string> = {};

                for (const [key, values] of Object.entries(
                    search.filterValues,
                )) {
                    if (values.length === 1) {
                        merged[key] = values[0];
                    } else if (values.length > 1) {
                        values.forEach((value, index) => {
                            merged[`${key}[${index}]`] = value;
                        });
                    }
                }

                const searchValue =
                    (data as Record<string, string>).search ?? '';
                if (searchValue) merged.search = searchValue;

                return merged;
            }}
            className={cn('flex flex-wrap items-center gap-3', className)}
        >
            <ButtonGroup className="w-full sm:w-min sm:min-w-xs">
                <Input
                    type="search"
                    name="search"
                    placeholder={placeholder}
                    defaultValue={search.initialSearch}
                    data-test="search-input"
                />
                <Button
                    data-test="search-button"
                    type="submit"
                    variant="outline"
                >
                    <SearchIcon />
                </Button>
            </ButtonGroup>

            {search.filters.length > 0 && (
                <Filters
                    filters={search.filters}
                    filterValues={search.filterValues}
                    mode="inactive"
                />
            )}
        </Form>
    );
}

export function SearchResults({
    search,
    resultsMessage,
    exportAction,
    exportTitle,
    toolbar,
}: {
    search: UseSearchReturn;
    resultsMessage: string;
    exportAction?: RouteMutationFn;
    exportTitle?: string;
    toolbar?: ReactNode;
}) {
    return (
        <div className="flex flex-wrap justify-between gap-3">
            <div className="self-center space-y-2">
                <p className="line-clamp-2 text-xs leading-none text-muted-foreground">
                    {resultsMessage}
                </p>
                <SearchAppliedFilters
                    filters={search.filters}
                    filterValues={search.filterValues}
                    searchValue={search.initialSearch}
                />
            </div>
            {(toolbar || exportAction) && (
                <ButtonGroup className="ml-auto shrink-0 self-end">
                    {exportAction && (
                        <ExportDialog
                            exportAction={exportAction}
                            searchFilters={search.filters}
                            filterValues={search.filterValues}
                            searchValue={search.initialSearch}
                            title={exportTitle}
                        />
                    )}
                    {toolbar}
                </ButtonGroup>
            )}
        </div>
    );
}
