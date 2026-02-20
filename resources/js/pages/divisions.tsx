import ExportDivisionsController from '@/actions/App/Http/Controllers/Personnel/ExportDivisionsController';
import {
    index,
    create,
    show,
    edit,
    destroy,
} from '@/actions/App/Http/Controllers/Personnel/DivisionController';
import Container from '@/components/app-container';
import EmptyCard from '@/components/app-empty-card';
import AppPagination from '@/components/app-pagination';
import DeleteConfirmationModal from '@/components/delete-confirmation-modal';
import {
    SearchAppliedFilters,
    SearchControls,
    SearchResults,
    useSearch,
} from '@/components/search';
import ColumnHeaderMenu from '@/components/table/column-header-menu';
import ColumnVisibilityMenu, {
    type ColumnDef,
} from '@/components/table/column-visibility-menu';
import { useSort } from '@/components/table/use-sort';
import RowActionsCell from '@/components/table/row-actions-cell';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import type { Division, PaginatedData } from '@/types';
import { Form, Link } from '@inertiajs/react';
import { Plus, SearchXIcon, WarehouseIcon } from 'lucide-react';
import { useState } from 'react';

const toggleableColumns: ColumnDef[] = [
    { key: 'name', label: 'Nave' },
    { key: 'operators_count', label: 'Operadores' },
];

export default function Divisions({
    divisions,
}: {
    divisions: PaginatedData<Division>;
}) {
    const search = useSearch(index);
    const { sort, order, handleSort } = useSort();
    const [columnVisibility, setColumnVisibility] = useState<
        Record<string, boolean>
    >({
        name: true,
        operators_count: true,
    });
    const [deletingDivision, setDeletingDivision] = useState<Division | null>(
        null,
    );

    const hasActiveFilters = search.hasActiveFilters;
    const showEmptyCard = divisions.total === 0 && !hasActiveFilters;
    const showFilteredEmptyCard = divisions.total === 0 && hasActiveFilters;

    function handleColumnVisibilityChange(key: string, visible: boolean) {
        setColumnVisibility((prev) => ({ ...prev, [key]: visible }));
    }

    return (
        <AppLayout
            title="Naves"
            header={
                <>
                    <Button
                        render={<Link as="button" href={create()} prefetch />}
                    >
                        <Plus />
                        Agregar
                    </Button>
                    <div className="w-full">
                        <SearchControls
                            search={search}
                            placeholder="Buscar naves"
                        />
                    </div>
                </>
            }
        >
            <Container className="my-6 max-w-3xl space-y-6 md:my-4 md:space-y-4">
                {showEmptyCard ? (
                    <EmptyCard
                        icon={WarehouseIcon}
                        title="Sin naves"
                        subtitle="Comienza agregando tu primera nave."
                        buttonLabel="Agregar nave"
                        href={create()}
                    />
                ) : showFilteredEmptyCard ? (
                    <EmptyCard
                        icon={SearchXIcon}
                        title="Sin resultados"
                        subtitle="No encontramos naves con los filtros actuales."
                        content={
                            <SearchAppliedFilters
                                filters={search.filters}
                                filterValues={search.filterValues}
                                searchValue={search.initialSearch}
                                className="justify-center"
                                filtersClassName="w-fit justify-center"
                            />
                        }
                    />
                ) : (
                    <>
                        <SearchResults
                            search={search}
                            resultsMessage={`Mostrando ${divisions.from} a ${divisions.to} de ${divisions.total} resultados`}
                            exportTitle="Exportar naves"
                            exportAction={
                                divisions.total > 0
                                    ? ExportDivisionsController
                                    : undefined
                            }
                            toolbar={
                                <ColumnVisibilityMenu
                                    columns={toggleableColumns}
                                    visibility={columnVisibility}
                                    onVisibilityChange={
                                        handleColumnVisibilityChange
                                    }
                                />
                            }
                        />
                        {divisions.data.length > 0 && (
                            <DivisionsTable
                                divisions={divisions}
                                columnVisibility={columnVisibility}
                                onColumnVisibilityChange={
                                    handleColumnVisibilityChange
                                }
                                onDelete={setDeletingDivision}
                                sort={sort}
                                order={order}
                                onSort={handleSort}
                            />
                        )}
                    </>
                )}
            </Container>

            {deletingDivision && (
                <Form
                    {...destroy.form(deletingDivision)}
                    showProgress={false}
                    disableWhileProcessing
                    onSuccess={() => setDeletingDivision(null)}
                >
                    {({ processing, submit }) => (
                        <DeleteConfirmationModal
                            isOpen={true}
                            setIsOpen={(open) => {
                                if (!open && !processing) {
                                    setDeletingDivision(null);
                                }
                            }}
                            title="Eliminar nave"
                            description={`¿Estás seguro de que deseas eliminar la nave "${deletingDivision.name}"? Esta acción no se puede deshacer.`}
                            processing={processing}
                            onDestroy={submit}
                        />
                    )}
                </Form>
            )}
        </AppLayout>
    );
}

function DivisionsTable({
    divisions,
    columnVisibility,
    onColumnVisibilityChange,
    onDelete,
    sort,
    order,
    onSort,
}: {
    divisions: PaginatedData<Division>;
    columnVisibility: Record<string, boolean>;
    onColumnVisibilityChange: (key: string, visible: boolean) => void;
    onDelete: (division: Division) => void;
    sort: string | null;
    order: 'asc' | 'desc' | null;
    onSort: (key: string, order: 'asc' | 'desc') => void;
}) {
    const isVisible = (key: string) => columnVisibility[key] !== false;
    const visibleColumnCount = ['name', 'operators_count'].filter(
        isVisible,
    ).length;
    const canHideColumn = visibleColumnCount > 1;

    return (
        <>
            <div className="max-md:-mx-6 md:rounded-md md:ring-1 md:ring-border">
                <Table className="max-md:mx-6">
                    <TableHeader>
                        <TableRow>
                            {isVisible('name') && (
                                <TableHead>
                                    <ColumnHeaderMenu
                                        title="Nave"
                                        canHide={canHideColumn}
                                        onHide={() =>
                                            onColumnVisibilityChange(
                                                'name',
                                                false,
                                            )
                                        }
                                        sortKey="name"
                                        currentSort={sort}
                                        currentOrder={order}
                                        onSort={onSort}
                                    />
                                </TableHead>
                            )}
                            {isVisible('operators_count') && (
                                <TableHead>
                                    <ColumnHeaderMenu
                                        title="Operadores"
                                        canHide={canHideColumn}
                                        onHide={() =>
                                            onColumnVisibilityChange(
                                                'operators_count',
                                                false,
                                            )
                                        }
                                    />
                                </TableHead>
                            )}
                                <TableHead />

                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {divisions.data.map((division: Division) => (
                            <TableRow
                                data-test={`division-${division.id}`}
                                key={division.id}
                            >
                                {isVisible('name') && (
                                    <TableCell>{division.name}</TableCell>
                                )}
                                {isVisible('operators_count') && (
                                    <TableCell>
                                        <Badge variant="outline">
                                            {division.operators_count ?? 0}{' '}
                                            {(division.operators_count ?? 0) ===
                                            1
                                                ? 'operador'
                                                : 'operadores'}
                                        </Badge>
                                    </TableCell>
                                )}
                                <RowActionsCell
                                    dataTestPrefix={`division-${division.id}`}
                                    showHref={show(division)}
                                    editHref={edit(division)}
                                    onDelete={() => onDelete(division)}
                                />
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <AppPagination paginatedData={divisions} />
        </>
    );
}
