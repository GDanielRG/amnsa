import {
    destroy,
    edit,
    index,
} from '@/actions/App/Http/Controllers/Personnel/DivisionController';
import ActionsDropdownMenu from '@/components/actions-dropdown-menu';
import Container from '@/components/app-container';
import DeleteConfirmationModal from '@/components/delete-confirmation-modal';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    DropdownMenuItem,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import AppLayout from '@/layouts/app-layout';
import type { Division } from '@/types';
import { Form, Link } from '@inertiajs/react';
import { PencilIcon, TrashIcon, UsersIcon } from 'lucide-react';
import { useState } from 'react';

export default function DivisionShow({ division }: { division: Division }) {
    const [deleteIsOpen, setDeleteIsOpen] = useState(false);

    return (
        <AppLayout
            backAction={index()}
            title={division.name}
            header={
                <ActionsDropdownMenu>
                    <DropdownMenuItem
                        render={<Link href={edit(division)} />}
                    >
                        <PencilIcon />
                        Editar nave
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        variant="destructive"
                        onClick={() => setDeleteIsOpen(true)}
                    >
                        <TrashIcon />
                        Eliminar nave
                    </DropdownMenuItem>
                </ActionsDropdownMenu>
            }
        >
            <Container className="my-6 max-w-2xl md:my-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Detalles</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="text-sm text-muted-foreground">
                                Operadores asignados
                            </p>
                            <Badge variant="outline" className="mt-1">
                                <UsersIcon />
                                {division.operators_count ?? 0}{' '}
                                {(division.operators_count ?? 0) === 1
                                    ? 'operador'
                                    : 'operadores'}
                            </Badge>
                        </div>
                    </CardContent>
                </Card>
            </Container>

            <Form
                {...destroy.form(division)}
                showProgress={false}
                disableWhileProcessing
                onSuccess={() => setDeleteIsOpen(false)}
            >
                {({ processing, submit }) => (
                    <DeleteConfirmationModal
                        isOpen={deleteIsOpen || processing}
                        setIsOpen={setDeleteIsOpen}
                        title="Eliminar nave"
                        description={`¿Estás seguro de que deseas eliminar la nave "${division.name}"? Esta acción no se puede deshacer.`}
                        processing={processing}
                        onDestroy={submit}
                    />
                )}
            </Form>
        </AppLayout>
    );
}
