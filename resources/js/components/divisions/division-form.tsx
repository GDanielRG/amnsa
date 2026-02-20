import {
    store,
    update,
} from '@/actions/App/Http/Controllers/Personnel/DivisionController';
import SaveSubmitButton from '@/components/save-submit-button';
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import type { Division } from '@/types';
import { Form } from '@inertiajs/react';

interface DivisionFormProps {
    division?: Division;
    className?: string;
}

export default function DivisionForm({
    division,
    className,
}: DivisionFormProps) {
    return (
        <Form
            {...(division ? update.form(division) : store.form())}
            disableWhileProcessing
            showProgress={false}
            className={cn('inert:pointer-events-none', className)}
        >
            {({ errors, processing }) => (
                <>
                    <FieldGroup className="grid grid-cols-1 gap-6 md:gap-4">
                        <Field data-invalid={!!errors.name}>
                            <FieldLabel htmlFor="name">
                                Nombre de la nave
                            </FieldLabel>
                            <Input
                                id="name"
                                name="name"
                                autoFocus
                                defaultValue={division?.name}
                                aria-invalid={!!errors.name}
                            />
                            <FieldError>{errors.name}</FieldError>
                        </Field>
                    </FieldGroup>

                    <SaveSubmitButton processing={processing} />
                </>
            )}
        </Form>
    );
}
