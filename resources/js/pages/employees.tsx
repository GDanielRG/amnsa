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
import RowActionsCell from '@/components/table/row-actions-cell';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
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
import { useInitials } from '@/hooks/use-initials';
import AppLayout from '@/layouts/app-layout';
import type { Employee, PaginatedData, Role, SearchFilter } from '@/types';
import { Form, Link } from '@inertiajs/react';
import {
    BanIcon,
    CheckIcon,
    Plus,
    SearchXIcon,
    SquareUserRoundIcon,
} from 'lucide-react';
import { useState } from 'react';

const toggleableColumns: ColumnDef[] = [
    { key: 'personal', label: 'Personal' },
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
    const [columnVisibility, setColumnVisibility] = useState<
        Record<string, boolean>
    >({
        personal: true,
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
}: {
    employees: PaginatedData<Employee>;
    columnVisibility: Record<string, boolean>;
    onColumnVisibilityChange: (key: string, visible: boolean) => void;
    onDelete: (employee: Employee) => void;
}) {
    const getInitials = useInitials();

    const isVisible = (key: string) => columnVisibility[key] !== false;
    const visibleColumnCount = ['personal', 'rolesAndPermissions'].filter(
        isVisible,
    ).length;
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
                            <TableHead className="w-14 min-w-14 text-right">
                                <span className="sr-only">Acciones</span>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {employees.data.map((employee: Employee) => (
                            <TableRow
                                data-test={`employee-${employee.id}`}
                                key={employee.id}
                            >
                                <TableCell>
                                    <Checkbox
                                        aria-label={`Seleccionar ${employee.user.name}`}
                                    />
                                </TableCell>
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
                                                <br />
                                                {employee.operator && (
                                                    <Badge
                                                        className="mt-1"
                                                        variant="outline"
                                                    >
                                                        <CheckIcon />
                                                        Afilador
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
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
