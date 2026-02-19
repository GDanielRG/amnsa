import { show } from '@/actions/App/Http/Controllers/Personnel/EmployeeController';
import Container from '@/components/app-container';
import EmployeeForm from '@/components/employees/employee-form';
import AppLayout from '@/layouts/app-layout';
import type { Division, Employee, Role } from '@/types';

export default function EmployeeEdit({
    employee,
    roles,
    divisions,
    permissionNames,
}: {
    employee: Employee;
    roles: Role[];
    divisions: Division[];
    permissionNames: { [key: string]: string };
}) {
    return (
        <AppLayout backAction={show(employee)} title="Editar personal">
            <Container className="my-6 md:my-4">
                <EmployeeForm
                    employee={employee}
                    roles={roles}
                    divisions={divisions}
                    permissionNames={permissionNames}
                    className="max-w-3xl space-y-6 md:space-y-4"
                />
            </Container>
        </AppLayout>
    );
}
