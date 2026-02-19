import ExportRolesController from '@/actions/App/Http/Controllers/Personnel/ExportRolesController';
import {
    index,
    create,
    show,
    edit,
    destroy,
} from '@/actions/App/Http/Controllers/Personnel/RoleController';
import Container from '@/components/app-container';
import EmptyCard from '@/components/app-empty-card';
import AppPagination from '@/components/app-pagination';
import DeleteConfirmationModal from '@/components/delete-confirmation-modal';
import { PermissionSummary } from '@/components/employees/permission-tree';
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
import RowActionsCell from '@/components/table/row-actions-cell';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import type { PaginatedData, Role } from '@/types';
import { Form, Link } from '@inertiajs/react';
import { Plus, SearchXIcon, ShieldIcon } from 'lucide-react';
import { useState } from 'react';

const toggleableColumns: ColumnDef[] = [
    { key: 'name', label: 'Rol' },
    { key: 'permissions', label: 'Permisos' },
];

export default function Roles({ roles }: { roles: PaginatedData<Role> }) {
    const search = useSearch(index);
    const [columnVisibility, setColumnVisibility] = useState<
        Record<string, boolean>
    >({
        name: true,
        permissions: true,
    });
    const [deletingRole, setDeletingRole] = useState<Role | null>(null);

    const hasActiveFilters = search.hasActiveFilters;
    const showEmptyCard = roles.total === 0 && !hasActiveFilters;
    const showFilteredEmptyCard = roles.total === 0 && hasActiveFilters;

    function handleColumnVisibilityChange(key: string, visible: boolean) {
        setColumnVisibility((prev) => ({ ...prev, [key]: visible }));
    }

    return (
        <AppLayout
            title="Roles"
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
                            placeholder="Buscar roles"
                        />
                    </div>
                </>
            }
        >
            <Container className="my-6 max-w-4xl space-y-6 md:my-4 md:space-y-4">
                {showEmptyCard ? (
                    <EmptyCard
                        icon={ShieldIcon}
                        title="Sin roles"
                        subtitle="Comienza agregando tu primer rol."
                        buttonLabel="Agregar rol"
                        href={create()}
                    />
                ) : showFilteredEmptyCard ? (
                    <EmptyCard
                        icon={SearchXIcon}
                        title="Sin resultados"
                        subtitle="No encontramos roles con los filtros actuales."
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
                            resultsMessage={`Mostrando ${roles.from} a ${roles.to} de ${roles.total} resultados`}
                            exportTitle="Exportar roles y permisos"
                            exportAction={
                                roles.total > 0
                                    ? ExportRolesController
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
                        {roles.data.length > 0 && (
                            <RolesTable
                                roles={roles}
                                columnVisibility={columnVisibility}
                                onColumnVisibilityChange={
                                    handleColumnVisibilityChange
                                }
                                onDelete={setDeletingRole}
                            />
                        )}
                    </>
                )}
            </Container>

            {deletingRole && (
                <Form
                    {...destroy.form(deletingRole)}
                    showProgress={false}
                    disableWhileProcessing
                    onSuccess={() => setDeletingRole(null)}
                >
                    {({ processing, submit }) => (
                        <DeleteConfirmationModal
                            isOpen={true}
                            setIsOpen={(open) => {
                                if (!open && !processing) {
                                    setDeletingRole(null);
                                }
                            }}
                            title="Eliminar rol"
                            description={`¿Estás seguro de que deseas eliminar el rol "${deletingRole.name}"? Esta acción no se puede deshacer.`}
                            processing={processing}
                            onDestroy={submit}
                        />
                    )}
                </Form>
            )}
        </AppLayout>
    );
}

function RolesTable({
    roles,
    columnVisibility,
    onColumnVisibilityChange,
    onDelete,
}: {
    roles: PaginatedData<Role>;
    columnVisibility: Record<string, boolean>;
    onColumnVisibilityChange: (key: string, visible: boolean) => void;
    onDelete: (role: Role) => void;
}) {
    const isVisible = (key: string) => columnVisibility[key] !== false;
    const visibleColumnCount = ['name', 'permissions'].filter(isVisible).length;
    const canHideColumn = visibleColumnCount > 1;

    return (
        <>
            <div className="max-md:-mx-6 md:rounded-md md:ring-1 md:ring-border">
                <Table className="max-md:mx-6">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-10">
                                <Checkbox aria-label="Seleccionar todos" />
                            </TableHead>
                            {isVisible('name') && (
                                <TableHead>
                                    <ColumnHeaderMenu
                                        title="Rol"
                                        canHide={canHideColumn}
                                        onHide={() =>
                                            onColumnVisibilityChange(
                                                'name',
                                                false,
                                            )
                                        }
                                    />
                                </TableHead>
                            )}
                            {isVisible('permissions') && (
                                <TableHead>
                                    <ColumnHeaderMenu
                                        title="Permisos"
                                        canHide={canHideColumn}
                                        onHide={() =>
                                            onColumnVisibilityChange(
                                                'permissions',
                                                false,
                                            )
                                        }
                                    />
                                </TableHead>
                            )}
                            <TableHead className="w-14 min-w-14 text-right">
                                <span className="sr-only">Acciones</span>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {roles.data.map((role: Role) => (
                            <TableRow
                                data-test={`role-${role.id}`}
                                key={role.id}
                            >
                                <TableCell>
                                    <Checkbox
                                        aria-label={`Seleccionar ${role.name}`}
                                    />
                                </TableCell>
                                {isVisible('name') && (
                                    <TableCell>{role.name}</TableCell>
                                )}
                                {isVisible('permissions') && (
                                    <TableCell>
                                        <PermissionSummary
                                            permissions={role.permissions}
                                        />
                                    </TableCell>
                                )}
                                <RowActionsCell
                                    dataTestPrefix={`role-${role.id}`}
                                    showHref={show(role)}
                                    editHref={edit(role)}
                                    onDelete={() => onDelete(role)}
                                />
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <AppPagination paginatedData={roles} />
        </>
    );
}
