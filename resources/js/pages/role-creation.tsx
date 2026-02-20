import { index } from '@/actions/App/Http/Controllers/Personnel/RoleController';
import Container from '@/components/app-container';
import RoleForm from '@/components/roles/role-form';
import AppLayout from '@/layouts/app-layout';
import type { Permission } from '@/types';

export default function RoleCreation({
    permissions,
}: {
    permissions: Permission[];
}) {
    return (
        <AppLayout backAction={index()} title="Agregar rol">
            <Container className="my-6 md:my-4">
                <RoleForm
                    permissions={permissions}
                    className="max-w-xl space-y-6 md:space-y-4"
                />
            </Container>
        </AppLayout>
    );
}
