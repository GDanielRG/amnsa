import type { InertiaLinkProps } from '@inertiajs/react';
import type { LucideIcon } from 'lucide-react';

export type BreadcrumbItem = {
    title: string;
    href: string;
};

export type NavItemQuickAction = {
    text: string;
    icon: LucideIcon;
    destructive?: boolean;
    separator?: boolean;
} & (
    | { href: NonNullable<InertiaLinkProps['href']>; onSelect?: never }
    | { href?: never; onSelect: () => void }
);

export type NavItem = {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    activePaths?: string[];
    quickActions?: NavItemQuickAction[];
};

export type NavCollapsible = {
    title: string;
    icon?: LucideIcon | null;
    defaultOpenPaths?: string[];
    children: NavItem[];
};
