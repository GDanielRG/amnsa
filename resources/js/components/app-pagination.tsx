import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import type { PaginatedData } from '@/types';

interface AppPaginationProps<T> {
    paginatedData: PaginatedData<T>;
}

export default function AppPagination<T>({
    paginatedData,
}: AppPaginationProps<T>) {
    return (
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        disabled={!paginatedData.prev_page_url}
                        href={paginatedData.prev_page_url ?? '#'}
                    ></PaginationPrevious>
                </PaginationItem>
                {paginatedData.links
                    .filter(
                        (link) =>
                            link.label !== '&laquo; Anterior' &&
                            link.label !== 'Siguiente &raquo;',
                    )
                    .map((link, index) => (
                        <PaginationItem className="max-lg:hidden" key={index}>
                            {link.label === '...' ? (
                                <PaginationEllipsis />
                            ) : (
                                <PaginationLink
                                    href={link.url ?? '#'}
                                    isActive={link.active}
                                >
                                    {link.label}
                                </PaginationLink>
                            )}
                        </PaginationItem>
                    ))}
                <PaginationItem>
                    <PaginationNext
                        disabled={!paginatedData.next_page_url}
                        href={paginatedData.next_page_url ?? '#'}
                    ></PaginationNext>
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}
