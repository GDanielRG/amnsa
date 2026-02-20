import ExportDivisionsController from '@/actions/App/Http/Controllers/Personnel/ExportDivisionsController';
import ExportEmployeesController from '@/actions/App/Http/Controllers/Personnel/ExportEmployeesController';
import ExportRolesController from '@/actions/App/Http/Controllers/Personnel/ExportRolesController';
import AppLogo from '@/components/app-logo';
import ExportDialog from '@/components/export-dialog';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Button } from '@/components/ui/button';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import type {
    NavCollapsible,
    NavItem,
    NavItemQuickAction,
    SharedData,
} from '@/types';
import { Link, usePage } from '@inertiajs/react';
import {
    CloudDownloadIcon,
    HouseIcon,
    PanelLeftCloseIcon,
    PanelLeftOpenIcon,
    PlusIcon,
    ShieldIcon,
    ShieldUserIcon,
    SquareUserRoundIcon,
    WarehouseIcon,
    type LucideIcon,
} from 'lucide-react';
import { useState } from 'react';

type SidebarExportTarget = 'divisions' | 'employees' | 'roles';

const iconMap: Record<string, LucideIcon> = {
    'cloud-download': CloudDownloadIcon,
    house: HouseIcon,
    plus: PlusIcon,
    shield: ShieldIcon,
    'shield-user': ShieldUserIcon,
    'square-user-round': SquareUserRoundIcon,
    warehouse: WarehouseIcon,
};

const resolveIcon = (iconKey?: string | null): LucideIcon | null => {
    if (!iconKey) {
        return null;
    }

    return iconMap[iconKey] ?? null;
};

const resolveQuickAction = (
    action: Record<string, unknown>,
    setActiveSidebarExport: (target: SidebarExportTarget) => void,
): NavItemQuickAction | null => {
    const icon = iconMap[action.iconKey as string] ?? CloudDownloadIcon;

    if (action.type === 'link') {
        if (!action.href) {
            return null;
        }

        return {
            text: action.text as string,
            icon,
            href: action.href as string,
            destructive: action.destructive as boolean | undefined,
            separator: action.separator as boolean | undefined,
        };
    }

    if (!action.exportTarget) {
        return null;
    }

    return {
        text: action.text as string,
        icon,
        onSelect: () =>
            setActiveSidebarExport(action.exportTarget as SidebarExportTarget),
        destructive: action.destructive as boolean | undefined,
        separator: action.separator as boolean | undefined,
    };
};

const resolveNavItem = (
    item: Record<string, unknown>,
    setActiveSidebarExport: (target: SidebarExportTarget) => void,
): NavItem => {
    const quickActions = (
        (item.quickActions as Record<string, unknown>[]) ?? []
    )
        .map((action) => resolveQuickAction(action, setActiveSidebarExport))
        .filter((action): action is NavItemQuickAction => action !== null);

    return {
        title: item.title as string,
        href: item.href as string,
        icon: resolveIcon(item.iconKey as string | null),
        activePaths: item.activePaths as string[] | undefined,
        ...(quickActions.length > 0 ? { quickActions } : {}),
    };
};

const buildMainNavItems = (
    entries: Record<string, unknown>[],
    setActiveSidebarExport: (target: SidebarExportTarget) => void,
): (NavItem | NavCollapsible)[] => {
    return entries.map((entry) => {
        if ('children' in entry) {
            return {
                title: entry.title as string,
                icon: resolveIcon(entry.iconKey as string | null),
                defaultOpenPaths: entry.defaultOpenPaths as
                    | string[]
                    | undefined,
                children: (entry.children as Record<string, unknown>[]).map(
                    (child) => resolveNavItem(child, setActiveSidebarExport),
                ),
            };
        }

        return resolveNavItem(entry, setActiveSidebarExport);
    });
};

export function AppSidebar() {
    const [activeSidebarExport, setActiveSidebarExport] =
        useState<SidebarExportTarget | null>(null);

    const { navigation } = usePage<SharedData>().props;
    const mainNavItems = buildMainNavItems(
        navigation.sidebar,
        setActiveSidebarExport,
    );

    const closeSidebarExportDialog = (isOpen: boolean): void => {
        if (!isOpen) {
            setActiveSidebarExport(null);
        }
    };

    const { state, isMobile, toggleSidebar, open } = useSidebar();

    return (
        <>
            <Sidebar collapsible="icon" variant="inset">
                <SidebarHeader>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                size="lg"
                                render={<Link href="/dashboard" prefetch />}
                            >
                                <AppLogo />
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                    <SidebarMenu className="hidden md:block">
                        <Tooltip>
                            <TooltipTrigger render={<SidebarMenuItem />}>
                                <SidebarMenuButton
                                    render={
                                        <Button
                                            data-sidebar="trigger"
                                            data-slot="sidebar-trigger"
                                            variant="ghost"
                                            size="sm"
                                            className="text-muted-foreground"
                                            onClick={() => {
                                                toggleSidebar();
                                            }}
                                        />
                                    }
                                >
                                    {open ? (
                                        <PanelLeftCloseIcon />
                                    ) : (
                                        <PanelLeftOpenIcon />
                                    )}
                                    {open && (
                                        <span className="text-xs">
                                            Ocultar menu
                                        </span>
                                    )}
                                </SidebarMenuButton>
                            </TooltipTrigger>
                            <TooltipContent
                                side="right"
                                align="center"
                                hidden={state !== 'collapsed' || isMobile}
                            >
                                <span>Mostrar menu</span>
                            </TooltipContent>
                        </Tooltip>
                    </SidebarMenu>
                </SidebarHeader>
                <SidebarContent>
                    <NavMain items={mainNavItems} />
                </SidebarContent>

                <SidebarFooter>
                    <NavUser />
                </SidebarFooter>
            </Sidebar>

            <ExportDialog
                showTrigger={false}
                isOpen={activeSidebarExport === 'divisions'}
                onOpenChange={closeSidebarExportDialog}
                exportAction={ExportDivisionsController}
                title="Exportar naves"
                searchFilters={[]}
                filterValues={{}}
            />
            <ExportDialog
                showTrigger={false}
                isOpen={activeSidebarExport === 'employees'}
                onOpenChange={closeSidebarExportDialog}
                exportAction={ExportEmployeesController}
                title="Exportar empleados"
                searchFilters={[]}
                filterValues={{}}
            />
            <ExportDialog
                showTrigger={false}
                isOpen={activeSidebarExport === 'roles'}
                onOpenChange={closeSidebarExportDialog}
                exportAction={ExportRolesController}
                title="Exportar roles y permisos"
                searchFilters={[]}
                filterValues={{}}
            />
        </>
    );
}
