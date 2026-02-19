import { show } from '@/actions/App/Http/Controllers/Personnel/RoleController';
import Container from '@/components/app-container';
import RoleForm from '@/components/roles/role-form';
import AppLayout from '@/layouts/app-layout';
import type { Permission, Role } from '@/types';

export default function RoleEdit({
    role,
    permissions,
}: {
    role: Role;
    permissions: Permission[];
}) {
    return (
        <AppLayout backAction={show(role)} title="Editar rol">
            <Container className="my-6 md:my-4">
                <RoleForm
                    role={role}
                    permissions={permissions}
                    className="max-w-xl space-y-6 md:space-y-4"
                />
            </Container>
        </AppLayout>
    );
}
