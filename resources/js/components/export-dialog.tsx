import SearchAppliedFilters from '@/components/search/search-applied-filters';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogMedia,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import type { SearchFilter } from '@/types';
import type { RouteMutationFn } from '@/types/wayfinder';
import { Form } from '@inertiajs/react';
import {
    CloudDownloadIcon,
    FileSpreadsheetIcon,
    LoaderCircle,
    SendHorizonalIcon,
} from 'lucide-react';
import { useState } from 'react';

export default function ExportDialog({
    exportAction,
    searchFilters,
    filterValues,
    searchValue,
    title = 'Exportar información',
    showTrigger = true,
    isOpen: controlledIsOpen,
    onOpenChange: controlledOnOpenChange,
}: {
    exportAction: RouteMutationFn;
    searchFilters: SearchFilter[];
    filterValues: Record<string, string[]>;
    searchValue?: string;
    title?: string;
    showTrigger?: boolean;
    isOpen?: boolean;
    onOpenChange?: (isOpen: boolean) => void;
}) {
    const [internalIsOpen, setInternalIsOpen] = useState(false);
    const isOpen = controlledIsOpen ?? internalIsOpen;
    const setIsOpen = controlledOnOpenChange ?? setInternalIsOpen;
    const hasAppliedFilters =
        searchFilters.some(
            (filter) => (filterValues[filter.key] ?? []).length > 0,
        ) || !!searchValue?.trim();

    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            {showTrigger && (
                <AlertDialogTrigger
                    render={<Button variant="outline" />}
                >
                    <CloudDownloadIcon />
                    Exportar
                </AlertDialogTrigger>
            )}
            <AlertDialogContent size="sm">
                <Form
                    {...exportAction.form()}
                    transform={() => {
                        const data: Record<string, string | string[]> = {};

                        if (searchValue) {
                            data.search = searchValue;
                        }

                        for (const [key, values] of Object.entries(
                            filterValues,
                        )) {
                            if (values.length > 0) {
                                data[key] = values;
                            }
                        }

                        return data;
                    }}
                    onSuccess={() => setIsOpen(false)}
                    disableWhileProcessing
                    showProgress={false}
                    className="space-y-6 inert:pointer-events-none"
                >
                    {({ processing }) => (
                        <>
                            <AlertDialogHeader>
                                <AlertDialogMedia>
                                    <FileSpreadsheetIcon />
                                </AlertDialogMedia>
                                <AlertDialogTitle>{title}</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Recibirás la información en tu correo
                                    electrónico
                                    {hasAppliedFilters
                                        ? ' con los siguientes filtros aplicados:'
                                        : '.'}
                                </AlertDialogDescription>
                                {hasAppliedFilters && (
                                    <div className="mt-3 flex justify-center">
                                        <SearchAppliedFilters
                                            filters={searchFilters}
                                            filterValues={filterValues}
                                            searchValue={searchValue}
                                            className="w-fit justify-center"
                                            filtersClassName="w-fit justify-center"
                                            showClearAll={false}
                                        />
                                    </div>
                                )}
                            </AlertDialogHeader>

                            <AlertDialogFooter>
                                <AlertDialogCancel disabled={processing}>
                                    Cancelar
                                </AlertDialogCancel>
                                <AlertDialogAction
                                    type="submit"
                                    disabled={processing}
                                >
                                    {processing ? (
                                        <LoaderCircle className="size-4 animate-spin" />
                                    ) : (
                                        <SendHorizonalIcon className="size-4" />
                                    )}
                                    Enviar
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </>
                    )}
                </Form>
            </AlertDialogContent>
        </AlertDialog>
    );
}
