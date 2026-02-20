import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import type { Flash } from '@/types';
import type { AppLayoutProps } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast, Toaster } from 'sonner';


export default function AppLayout({
    children,
    backAction,
    title,
    header,
    ...props
}: AppLayoutProps) {
    useEffect(() => {
        const removeListener = router.on('flash', (event) => {
            const flash = event.detail.flash as Flash;

            if (flash?.success) toast.success(flash.success);
            if (flash?.error) toast.error(flash.error);
            if (flash?.info) toast.info(flash.info);
            if (flash?.warning) toast.warning(flash.warning);
        });

        return () => removeListener();
    }, []);

    return (
        <>
            <Head title={title} />
            <AppLayoutTemplate
                backAction={backAction}
                title={title}
                header={header}
                {...props}
            >
                {children}
                <Toaster duration={8000} />
            </AppLayoutTemplate>
        </>
    );
}
