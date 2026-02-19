import { index } from '@/actions/App/Http/Controllers/Personnel/DivisionController';
import Container from '@/components/app-container';
import DivisionForm from '@/components/divisions/division-form';
import AppLayout from '@/layouts/app-layout';

export default function DivisionCreation() {
    return (
        <AppLayout backAction={index()} title="Agregar nave">
            <Container className="my-6 md:my-4">
                <DivisionForm className="max-w-xl space-y-6 md:space-y-4" />
            </Container>
        </AppLayout>
    );
}
