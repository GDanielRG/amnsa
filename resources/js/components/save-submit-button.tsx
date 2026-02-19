import { Button } from '@/components/ui/button';
import { Loader2Icon, SaveIcon } from 'lucide-react';


export default function SaveSubmitButton({
    processing,
    label = 'Guardar',
}: {
    processing: boolean;
    label?: string;
}) {
    return (
        <div className="col-span-full flex justify-end">
            <Button
                type="submit"
                className="max-sm:w-full"
                disabled={processing}
                data-test="save-button"
            >
                {processing ? (
                    <Loader2Icon className="animate-spin" />
                ) : (
                    <SaveIcon />
                )}
                {label}
            </Button>
        </div>
    );
}
