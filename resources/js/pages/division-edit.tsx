import { show } from '@/actions/App/Http/Controllers/Personnel/DivisionController';
import Container from '@/components/app-container';
import DivisionForm from '@/components/divisions/division-form';
import AppLayout from '@/layouts/app-layout';
import type { Division } from '@/types';

export default function DivisionEdit({ division }: { division: Division }) {
    return (
        <AppLayout backAction={show(division)} title="Editar nave">
            <Container className="my-6 md:my-4">
                <DivisionForm
                    division={division}
                    className="max-w-xl space-y-6 md:space-y-4"
                />
            </Container>
        </AppLayout>
    );
}
