import {
    destroy,
    edit,
    index,
} from '@/actions/App/Http/Controllers/Personnel/EmployeeController';
import ActionsDropdownMenu from '@/components/actions-dropdown-menu';
import Container from '@/components/app-container';
import DeleteConfirmationModal from '@/components/delete-confirmation-modal';
import PermissionTree from '@/components/employees/permission-tree';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    DropdownMenuItem,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useInitials } from '@/hooks/use-initials';
import AppLayout from '@/layouts/app-layout';
import type { Employee, Permission, Role } from '@/types';
import { Form, Link } from '@inertiajs/react';
import {
    BanIcon,
    BellIcon,
    BellOffIcon,
    CheckIcon,
    MailIcon,
    PencilIcon,
    ShieldIcon,
    TrashIcon,
} from 'lucide-react';
import { useState } from 'react';

export default function EmployeeShow({
    employee,
    permissionNames,
}: {
    employee: Employee;
    permissionNames: { [key: string]: string };
}) {
    const [deleteIsOpen, setDeleteIsOpen] = useState(false);
    const getInitials = useInitials();

    return (
        <AppLayout
            backAction={index()}
            title={employee.user.name}
            titlePrefix={
                <Avatar>
                    <AvatarFallback>
                        {getInitials(employee.user.name)}
                    </AvatarFallback>
                </Avatar>
            }
            header={
                <>
                    <ActionsDropdownMenu>
                        <DropdownMenuItem
                            render={<Link href={edit(employee)} />}
                        >
                            <PencilIcon />
                            Editar personal
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            variant="destructive"
                            onClick={() => setDeleteIsOpen(true)}
                        >
                            <TrashIcon />
                            Eliminar personal
                        </DropdownMenuItem>
                    </ActionsDropdownMenu>
                    <div className="flex w-full flex-wrap items-center gap-2">
                        <a href={'mailto:' + employee.user.email}>
                            <Badge variant="outline">
                                <MailIcon />
                                {employee.user.email}
                            </Badge>
                        </a>
                        <Badge variant="outline">
                            {employee.operator ? (
                                <>
                                    <CheckIcon />
                                    Afilador
                                </>
                            ) : (
                                <>
                                    <BanIcon />
                                    No afilador
                                </>
                            )}
                        </Badge>
                        <Badge variant="outline">
                            {employee.get_low_inventory_notification ? (
                                <>
                                    <BellIcon />
                                    Notificaciones de inventario
                                </>
                            ) : (
                                <>
                                    <BellOffIcon />
                                    Sin notificaciones de inventario
                                </>
                            )}
                        </Badge>
                    </div>
                </>
            }
        >
            <Container className="my-6 max-w-2xl md:my-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Roles y permisos</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6 md:space-y-4">
                        <div className="flex flex-wrap gap-2">
                            {employee.roles.length === 0 ? (
                                <Badge variant="outline">
                                    <BanIcon />
                                    Sin roles
                                </Badge>
                            ) : (
                                employee.roles.map((role: Role) => (
                                    <Badge variant="secondary" key={role.id}>
                                        <ShieldIcon />
                                        {role.name}
                                    </Badge>
                                ))
                            )}
                        </div>
                        <PermissionTree
                            selectedPermissions={
                                [
                                    ...new Set(
                                        employee.roles.flatMap((role: Role) =>
                                            role.permissions.map(
                                                (permission: Permission) =>
                                                    permission.name as string,
                                            ),
                                        ),
                                    ),
                                ] as string[]
                            }
                            permissionNames={permissionNames}
                        />
                    </CardContent>
                </Card>
            </Container>

            <Form
                {...destroy.form(employee)}
                showProgress={false}
                disableWhileProcessing
                onSuccess={() => setDeleteIsOpen(false)}
            >
                {({ processing, submit }) => (
                    <DeleteConfirmationModal
                        isOpen={deleteIsOpen || processing}
                        setIsOpen={setDeleteIsOpen}
                        title="Eliminar personal"
                        description={`¿Estás seguro de que deseas eliminar a "${employee.user.name}"? Esta acción no se puede deshacer.`}
                        processing={processing}
                        onDestroy={submit}
                    />
                )}
            </Form>
        </AppLayout>
    );
}
