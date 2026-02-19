
import Container from '@/components/app-container';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { type InertiaLinkProps, Link } from '@inertiajs/react';
import { ArrowLeftIcon } from 'lucide-react';
import type { ReactNode } from 'react';

export function AppSidebarHeader({
    backAction,
    title,
    titlePrefix,
    header,
}: {
    title: string;
    titlePrefix?: ReactNode;
    backAction?: InertiaLinkProps['href'];
    header?: ReactNode;
}) {
    const backButton = backAction ? (
        <Button
            variant="outline"
            size="icon"
            render={<Link as="button" href={backAction} />}
        >
            <ArrowLeftIcon />
        </Button>
    ) : null;

    return (
        <header>
            <Container className="flex flex-wrap items-center gap-3 border-b border-sidebar-border/50 py-6 md:py-4">
                <div className="flex min-w-0 items-center gap-3">
                    {backButton ? (
                        <>
                            <ButtonGroup className="md:hidden">
                                <SidebarTrigger />
                                {backButton}
                            </ButtonGroup>
                            <div className="hidden md:block">{backButton}</div>
                        </>
                    ) : (
                        <SidebarTrigger className="md:hidden" />
                    )}
                    {titlePrefix}
                    <h1 className="min-w-0 truncate text-2xl font-medium">
                        {title}
                    </h1>
                </div>
                {header}
            </Container>
        </header>
    );
}
