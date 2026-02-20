import type { InertiaLinkProps } from '@inertiajs/react';
import type { ReactNode } from 'react';

export type AppLayoutProps = {
    children: ReactNode;
    title: string;
    backAction?: InertiaLinkProps['href'];
    header?: ReactNode;
    titlePrefix?: ReactNode;
};

export type AuthLayoutProps = {
    children?: ReactNode;
    name?: string;
    title?: string;
    description?: string;
};
