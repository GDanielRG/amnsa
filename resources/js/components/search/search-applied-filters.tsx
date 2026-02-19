import ActionsDropdownMenu from '@/components/actions-dropdown-menu';
import Filters from '@/components/search/filters';
import {
    buildUrlWithRemovedQueryKeys,
    splitPageUrl,
} from '@/components/search/query-utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import type { SearchFilter } from '@/types';
import { router, usePage } from '@inertiajs/react';
import { FunnelXIcon, SearchIcon } from 'lucide-react';

type SearchAppliedFiltersProps = {
    filters: SearchFilter[];
    filterValues: Record<string, string[]>;
    searchValue?: string;
    className?: string;
    filtersClassName?: string;
    showClearAll?: boolean;
};

export default function SearchAppliedFilters({
    filters,
    filterValues,
    searchValue,
    className,
    filtersClassName,
    showClearAll = true,
}: SearchAppliedFiltersProps) {
    const { url: pageUrl } = usePage();
    const { basePath, currentSearch } = splitPageUrl(pageUrl);

    const hasActiveFacetedFilters = filters.some(
        (filter) => (filterValues[filter.key] ?? []).length > 0,
    );
    const hasSearch = !!searchValue?.trim();

    if (!hasActiveFacetedFilters && !hasSearch) {
        return null;
    }

    const clearSearchHref = buildUrlWithRemovedQueryKeys(
        basePath,
        currentSearch,
        ['search'],
    );

    const clearAllHref = buildUrlWithRemovedQueryKeys(basePath, currentSearch, [
        'search',
        ...filters.map((filter) => filter.key),
    ]);

    function handleClearAll(): void {
        router.visit(clearAllHref, {
            preserveState: true,
            preserveScroll: true,
        });
    }

    function handleClearSearch(): void {
        router.visit(clearSearchHref, {
            preserveState: true,
            preserveScroll: true,
        });
    }

    return (
        <div
            className={cn(
                'flex flex-wrap items-center gap-2',
                className,
            )}
        >
            {hasSearch && (
                <ActionsDropdownMenu
                    contentClassName="w-fit"
                    trigger={(open) => (
                        <Button
                            variant={open ? 'secondary' : 'outline'}
                            className="max-w-full justify-start"
                        >
                            <SearchIcon />
                            <Separator
                                orientation="vertical"
                                className="h-full w-px"
                            />
                            <Badge
                                variant="secondary"
                                className="max-w-64 rounded-sm px-1 font-normal"
                            >
                                <span className="truncate">{searchValue}</span>
                            </Badge>
                        </Button>
                    )}
                >
                    <DropdownMenuItem
                        variant="destructive"
                        onClick={handleClearSearch}
                    >
                        Limpiar búsqueda
                    </DropdownMenuItem>
                </ActionsDropdownMenu>
            )}

            <Filters
                filters={filters}
                filterValues={filterValues}
                mode="active"
                className={filtersClassName}
            />

            {showClearAll && (
                <ActionsDropdownMenu
                    trigger={(open) => (
                        <Button
                            variant={open ? 'secondary' : 'destructive'}
                            size="icon"
                        >
                            <FunnelXIcon />
                        </Button>
                    )}
                >
                    <DropdownMenuItem
                        variant="destructive"
                        onClick={handleClearAll}
                    >
                        Limpiar filtros
                    </DropdownMenuItem>
                </ActionsDropdownMenu>
            )}
        </div>
    );
}
