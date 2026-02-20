import FacetedFilters from '@/components/search/faceted-filters';
import {
    buildUrlWithQueryPatch,
    splitPageUrl,
} from '@/components/search/query-utils';
import type { SearchFilter } from '@/types';
import { router, usePage } from '@inertiajs/react';

interface FiltersProps {
    filters: SearchFilter[];
    filterValues: Record<string, string[]>;
    className?: string;
    mode?: 'all' | 'active' | 'inactive';
}

export default function Filters({
    filters,
    filterValues,
    className,
    mode = 'all',
}: FiltersProps) {
    const { url: pageUrl } = usePage();
    const { basePath, currentSearch } = splitPageUrl(pageUrl);

    const scopedFilters = filters.filter((filter) => {
        const hasSelectedValues = (filterValues[filter.key] ?? []).length > 0;

        if (mode === 'active') {
            return hasSelectedValues;
        }

        if (mode === 'inactive') {
            return !hasSelectedValues;
        }

        return true;
    });

    if (scopedFilters.length === 0) {
        return null;
    }

    function handleFilterValuesChange(nextValues: Record<string, string[]>) {
        const patch: Record<string, string[] | null> = {};

        for (const filter of filters) {
            const values = nextValues[filter.key] ?? [];
            patch[filter.key] = values.length > 0 ? values : null;
        }

        const url = buildUrlWithQueryPatch(basePath, currentSearch, patch);

        router.visit(url, {
            preserveState: true,
            preserveScroll: true,
        });
    }

    return (
        <FacetedFilters
            filters={scopedFilters}
            filterValues={filterValues}
            onFilterValuesChange={handleFilterValuesChange}
            className={className}
        />
    );
}
