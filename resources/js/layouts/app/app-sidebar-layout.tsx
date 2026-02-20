
import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { type InertiaLinkProps } from '@inertiajs/react';
import type { PropsWithChildren, ReactNode } from 'react';

export default function AppSidebarLayout({
    children,
    backAction,
    title,
    titlePrefix,
    header,
}: PropsWithChildren<{
    backAction?: InertiaLinkProps['href'];
    title: string;
    titlePrefix?: ReactNode;
    header?: ReactNode;
}>) {
    return (
        <AppShell variant="sidebar">
            <AppSidebar />
            <AppContent variant="sidebar" className="overflow-x-hidden">
                <AppSidebarHeader
                    backAction={backAction}
                    title={title}
                    titlePrefix={titlePrefix}
                    header={header}
                />
                {children}
            </AppContent>
        </AppShell>
    );
}
