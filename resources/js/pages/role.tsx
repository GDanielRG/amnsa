import {
    destroy,
    edit,
    index,
} from '@/actions/App/Http/Controllers/Personnel/RoleController';
import ActionsDropdownMenu from '@/components/actions-dropdown-menu';
import Container from '@/components/app-container';
import DeleteConfirmationModal from '@/components/delete-confirmation-modal';
import PermissionTree from '@/components/employees/permission-tree';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    DropdownMenuItem,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import AppLayout from '@/layouts/app-layout';
import type { Role } from '@/types';
import { Form, Link } from '@inertiajs/react';
import { PencilIcon, TrashIcon } from 'lucide-react';
import { useState } from 'react';

export default function RoleShow({ role }: { role: Role }) {
    const [deleteIsOpen, setDeleteIsOpen] = useState(false);

    return (
        <AppLayout
            backAction={index()}
            title={role.name}
            header={
                <ActionsDropdownMenu>
                    <DropdownMenuItem render={<Link href={edit(role)} />}>
                        <PencilIcon />
                        Editar rol
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        variant="destructive"
                        onClick={() => setDeleteIsOpen(true)}
                    >
                        <TrashIcon />
                        Eliminar rol
                    </DropdownMenuItem>
                </ActionsDropdownMenu>
            }
        >
            <Container className="my-6 max-w-3xl md:my-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Permisos</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <PermissionTree permissions={role.permissions} />
                    </CardContent>
                </Card>
            </Container>

            <Form
                {...destroy.form(role)}
                showProgress={false}
                disableWhileProcessing
                onSuccess={() => setDeleteIsOpen(false)}
            >
                {({ processing, submit }) => (
                    <DeleteConfirmationModal
                        isOpen={deleteIsOpen || processing}
                        setIsOpen={setDeleteIsOpen}
                        title="Eliminar rol"
                        description={`¿Estás seguro de que deseas eliminar el rol "${role.name}"? Esta acción no se puede deshacer.`}
                        processing={processing}
                        onDestroy={submit}
                    />
                )}
            </Form>
        </AppLayout>
    );
}
