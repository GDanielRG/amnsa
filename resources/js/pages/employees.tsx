import {
    index,
    create,
    show,
    edit,
    destroy,
} from '@/actions/App/Http/Controllers/Personnel/EmployeeController';
import ExportEmployeesController from '@/actions/App/Http/Controllers/Personnel/ExportEmployeesController';
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
import { useSort } from '@/components/table/use-sort';
import RowActionsCell from '@/components/table/row-actions-cell';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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
import { useInitials } from '@/hooks/use-initials';
import AppLayout from '@/layouts/app-layout';
import type { Employee, PaginatedData, Role, SearchFilter } from '@/types';
import { Form, Link } from '@inertiajs/react';
import {
    BanIcon,
    Plus,
    SearchXIcon,
    SquareUserRoundIcon,
    WarehouseIcon,
} from 'lucide-react';
import { useState } from 'react';

const toggleableColumns: ColumnDef[] = [
    { key: 'personal', label: 'Personal' },
    { key: 'operator', label: 'Operador' },
    { key: 'rolesAndPermissions', label: 'Roles y permisos' },
];

export default function Employees({
    employees,
    filters,
}: {
    employees: PaginatedData<Employee>;
    filters: SearchFilter[];
}) {
    const search = useSearch(index, filters);
    const { sort, order, handleSort } = useSort();
    const [columnVisibility, setColumnVisibility] = useState<
        Record<string, boolean>
    >({
        personal: true,
        operator: true,
        rolesAndPermissions: true,
    });
    const [deletingEmployee, setDeletingEmployee] = useState<Employee | null>(
        null,
    );

    const hasActiveFilters = search.hasActiveFilters;
    const showEmptyCard = employees.total === 0 && !hasActiveFilters;
    const showFilteredEmptyCard = employees.total === 0 && hasActiveFilters;

    function handleColumnVisibilityChange(key: string, visible: boolean) {
        setColumnVisibility((prev) => ({ ...prev, [key]: visible }));
    }

    return (
        <AppLayout
            title="Personal"
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
                            placeholder="Buscar por nombre o correo"
                        />
                    </div>
                </>
            }
        >
            <Container className="my-6 max-w-4xl space-y-6 md:my-4 md:space-y-4">
                {showEmptyCard ? (
                    <EmptyCard
                        icon={SquareUserRoundIcon}
                        title="Sin personal"
                        subtitle="Comienza agregando tu primer empleado."
                        buttonLabel="Agregar empleado"
                        href={create()}
                    />
                ) : showFilteredEmptyCard ? (
                    <EmptyCard
                        icon={SearchXIcon}
                        title="Sin resultados"
                        subtitle="No encontramos empleados con los filtros actuales."
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
                            resultsMessage={`Mostrando ${employees.from} a ${employees.to} de ${employees.total} resultados`}
                            exportTitle="Exportar empleados"
                            exportAction={
                                employees.total > 0
                                    ? ExportEmployeesController
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
                        {employees.data.length > 0 && (
                            <EmployeesTable
                                employees={employees}
                                columnVisibility={columnVisibility}
                                onColumnVisibilityChange={
                                    handleColumnVisibilityChange
                                }
                                onDelete={setDeletingEmployee}
                                sort={sort}
                                order={order}
                                onSort={handleSort}
                            />
                        )}
                    </>
                )}
            </Container>

            {deletingEmployee && (
                <Form
                    {...destroy.form(deletingEmployee)}
                    showProgress={false}
                    disableWhileProcessing
                    onSuccess={() => setDeletingEmployee(null)}
                >
                    {({ processing, submit }) => (
                        <DeleteConfirmationModal
                            isOpen={true}
                            setIsOpen={(open) => {
                                if (!open && !processing) {
                                    setDeletingEmployee(null);
                                }
                            }}
                            title="Eliminar empleado"
                            description={`¿Estás seguro de que deseas eliminar a ${deletingEmployee.user.name}? Esta acción no se puede deshacer.`}
                            processing={processing}
                            onDestroy={submit}
                        />
                    )}
                </Form>
            )}
        </AppLayout>
    );
}

function EmployeesTable({
    employees,
    columnVisibility,
    onColumnVisibilityChange,
    onDelete,
    sort,
    order,
    onSort,
}: {
    employees: PaginatedData<Employee>;
    columnVisibility: Record<string, boolean>;
    onColumnVisibilityChange: (key: string, visible: boolean) => void;
    onDelete: (employee: Employee) => void;
    sort: string | null;
    order: 'asc' | 'desc' | null;
    onSort: (key: string, order: 'asc' | 'desc') => void;
}) {
    const getInitials = useInitials();

    const isVisible = (key: string) => columnVisibility[key] !== false;
    const visibleColumnCount = [
        'personal',
        'operator',
        'rolesAndPermissions',
    ].filter(
        isVisible,
    ).length;
    const canHideColumn = visibleColumnCount > 1;

    return (
        <>
            <div className="max-md:-mx-6 md:rounded-md md:ring-1 md:ring-border">
                <Table className="max-md:mx-6">
                    <TableHeader>
                        <TableRow>
                            {isVisible('personal') && (
                                <TableHead>
                                    <ColumnHeaderMenu
                                        title="Personal"
                                        canHide={canHideColumn}
                                        onHide={() =>
                                            onColumnVisibilityChange(
                                                'personal',
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
                            {isVisible('operator') && (
                                <TableHead>
                                    <ColumnHeaderMenu
                                        title="Operador"
                                        canHide={canHideColumn}
                                        onHide={() =>
                                            onColumnVisibilityChange(
                                                'operator',
                                                false,
                                            )
                                        }
                                    />
                                </TableHead>
                            )}
                            {isVisible('rolesAndPermissions') && (
                                <TableHead>
                                    <ColumnHeaderMenu
                                        title="Roles y permisos"
                                        canHide={canHideColumn}
                                        onHide={() =>
                                            onColumnVisibilityChange(
                                                'rolesAndPermissions',
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
                        {employees.data.map((employee: Employee) => (
                            <TableRow
                                data-test={`employee-${employee.id}`}
                                key={employee.id}
                            >
                                {isVisible('personal') && (
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Avatar className="size-10">
                                                <AvatarFallback>
                                                    {getInitials(
                                                        employee.user.name,
                                                    )}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="block">
                                                {employee.user.name}
                                                <br />
                                                {employee.user.email}
                                            </div>
                                        </div>
                                    </TableCell>
                                )}
                                {isVisible('operator') && (
                                    <TableCell>
                                        {employee.operator?.division ? (
                                            <Badge variant="outline">
                                                <WarehouseIcon />
                                                {
                                                    employee.operator.division
                                                        .name
                                                }
                                            </Badge>
                                        ) : (
                                            <Badge variant="outline">
                                                <BanIcon />
                                                Inactivo
                                            </Badge>
                                        )}
                                    </TableCell>
                                )}
                                {isVisible('rolesAndPermissions') && (
                                    <TableCell>
                                        <div className="flex flex-col gap-1">
                                            {employee.roles.length === 0 ? (
                                                <Badge variant="outline">
                                                    <BanIcon />
                                                    Sin roles
                                                </Badge>
                                            ) : (
                                                employee.roles.map(
                                                    (role: Role) => (
                                                        <Badge
                                                            variant="secondary"
                                                            key={role.id}
                                                        >
                                                            {role.name}
                                                        </Badge>
                                                    ),
                                                )
                                            )}
                                            <PermissionSummary
                                                roles={employee.roles}
                                            />
                                        </div>
                                    </TableCell>
                                )}
                                <RowActionsCell
                                    dataTestPrefix={`employee-${employee.id}`}
                                    showHref={show(employee)}
                                    editHref={edit(employee)}
                                    onDelete={() => onDelete(employee)}
                                />
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <AppPagination paginatedData={employees} />
        </>
    );
}
