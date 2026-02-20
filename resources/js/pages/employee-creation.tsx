import { index } from '@/actions/App/Http/Controllers/Personnel/EmployeeController';
import Container from '@/components/app-container';
import EmployeeForm from '@/components/employees/employee-form';
import AppLayout from '@/layouts/app-layout';
import type { Division, Role } from '@/types';

export default function EmployeeCreation({
    roles,
    divisions,
    permissionNames,
}: {
    roles: Role[];
    divisions: Division[];
    permissionNames: { [key: string]: string };
}) {
    return (
        <AppLayout backAction={index()} title="Agregar personal">
            <Container className="my-6 md:my-4">
                <EmployeeForm
                    roles={roles}
                    divisions={divisions}
                    permissionNames={permissionNames}
                    className="max-w-3xl space-y-6 md:space-y-4"
                />
            </Container>
        </AppLayout>
    );
}
