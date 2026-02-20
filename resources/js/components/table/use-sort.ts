import { splitPageUrl } from '@/components/search/query-utils';
import { router, usePage } from '@inertiajs/react';

type SortOrder = 'asc' | 'desc';

interface UseSortReturn {
    sort: string | null;
    order: SortOrder | null;
    handleSort: (column: string, direction: SortOrder) => void;
}

export function useSort(): UseSortReturn {
    const { url } = usePage();
    const { basePath, currentSearch } = splitPageUrl(url);
    const params = new URLSearchParams(currentSearch);

    const sort = params.get('sort');
    const order = sort
        ? params.get('order') === 'desc'
            ? 'desc'
            : 'asc'
        : null;

    function handleSort(column: string, direction: SortOrder) {
        const newParams = new URLSearchParams(currentSearch);
        newParams.delete('page');

        if (sort === column && order === direction) {
            newParams.delete('sort');
            newParams.delete('order');
        } else {
            newParams.set('sort', column);
            newParams.set('order', direction);
        }

        const search = newParams.toString();
        const newUrl = search ? `${basePath}?${search}` : basePath;

        router.visit(newUrl, {
            preserveState: true,
            preserveScroll: true,
        });
    }

    return { sort, order, handleSort };
}
