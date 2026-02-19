import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuAction,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubAction,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    useSidebar,
} from '@/components/ui/sidebar';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import type { NavCollapsible, NavItem, NavItemQuickAction } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ChevronRightIcon, EllipsisIcon } from 'lucide-react';

const hasQuickActions = (
    item: NavItem,
): item is NavItem & { quickActions: NavItemQuickAction[] } =>
    'quickActions' in item && Array.isArray(item.quickActions);

const checkNavItemActive = (
    item: NavItem | NavCollapsible,
    currentUrl: string,
): boolean => {
    const urlWithoutQuery = currentUrl.split('?')[0];

    if ('activePaths' in item && item.activePaths) {
        return item.activePaths.some((activePath: string) => {
            return (
                urlWithoutQuery === activePath ||
                urlWithoutQuery.startsWith(activePath + '/')
            );
        });
    }

    if ('defaultOpenPaths' in item && item.defaultOpenPaths) {
        return item.defaultOpenPaths.some((activePath: string) => {
            return (
                urlWithoutQuery === activePath ||
                urlWithoutQuery.startsWith(activePath + '/')
            );
        });
    }

    return false;
};

function NavMenuItem({ item, isActive }: { item: NavItem; isActive: boolean }) {
    const { state, isMobile } = useSidebar();
    const showTooltip = state === 'collapsed' && !isMobile;

    const buttonContent = (
        <>
            {item.icon && <item.icon />}
            <span>{item.title}</span>
        </>
    );

    return (
        <SidebarMenuItem>
            {showTooltip ? (
                <Tooltip>
                    <TooltipTrigger
                        render={
                            <SidebarMenuButton
                                render={<Link href={item.href} prefetch />}
                                isActive={isActive}
                            />
                        }
                    >
                        {buttonContent}
                    </TooltipTrigger>
                    <TooltipContent side="right" align="center">
                        {item.title}
                    </TooltipContent>
                </Tooltip>
            ) : (
                <SidebarMenuButton
                    render={<Link href={item.href} prefetch />}
                    isActive={isActive}
                >
                    {buttonContent}
                </SidebarMenuButton>
            )}
            {hasQuickActions(item) && (
                <SidebarQuickActionsDropdown quickActions={item.quickActions} />
            )}
        </SidebarMenuItem>
    );
}

export function NavMain({
    items = [],
}: {
    items: (NavItem | NavCollapsible)[];
}) {
    const page = usePage();

    const isNavItemActive = (item: NavItem | NavCollapsible) => {
        return checkNavItemActive(item, page.url);
    };

    return (
        <SidebarGroup>
            <SidebarGroupContent>
                <SidebarMenu>
                    {items.map((item, index) =>
                        'children' in item ? (
                            <CollapsibleNavItem
                                key={index}
                                item={item as NavCollapsible}
                            />
                        ) : (
                            <NavMenuItem
                                key={index}
                                item={item}
                                isActive={isNavItemActive(item)}
                            />
                        ),
                    )}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    );
}

function CollapsibleNavItem({ item }: { item: NavCollapsible }) {
    const { state, isMobile } = useSidebar();
    const isDesktopCollapsed = state === 'collapsed' && !isMobile;

    const page = usePage();

    const isNavItemActive = (item: NavItem | NavCollapsible) => {
        return checkNavItemActive(item, page.url);
    };

    if (isDesktopCollapsed) {
        return (
            <SidebarMenuItem>
                <DropdownMenu modal={false}>
                    <DropdownMenuTrigger
                        render={
                            <SidebarMenuButton
                                tooltip={item.title}
                                isActive={isNavItemActive(item)}
                            />
                        }
                    >
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="right" className="w-fit">
                        {item.children?.map((subItem) => (
                            <div
                                key={subItem.title}
                                className="group/menu-item relative"
                            >
                                <DropdownMenuItem
                                    render={
                                        <Link href={subItem.href} prefetch />
                                    }
                                    data-active={isNavItemActive(subItem)}
                                    className={cn(
                                        'data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground',
                                        hasQuickActions(subItem) && 'pr-8',
                                    )}
                                >
                                    {subItem.icon && <subItem.icon />}
                                    <span>{subItem.title}</span>
                                </DropdownMenuItem>
                                {hasQuickActions(subItem) && (
                                    <SidebarQuickActionsDropdown
                                        quickActions={subItem.quickActions}
                                        side="right"
                                        align="start"
                                    />
                                )}
                            </div>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        );
    }

    return (
        <Collapsible
            className="group/collapsible"
            defaultOpen={isNavItemActive(item)}
        >
            <SidebarMenuItem>
                <CollapsibleTrigger
                    render={<SidebarMenuButton tooltip={item.title} />}
                >
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                    <ChevronRightIcon className="ml-auto transition-transform duration-300 group-data-panel-open/collapsible:rotate-90" />
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <SidebarMenuSub>
                        {item.children?.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                                <SidebarMenuSubButton
                                    render={
                                        <Link href={subItem.href} prefetch />
                                    }
                                    isActive={isNavItemActive(subItem)}
                                >
                                    {subItem.icon && <subItem.icon />}
                                    <span>{subItem.title}</span>
                                </SidebarMenuSubButton>
                                {hasQuickActions(subItem) && (
                                    <SidebarQuickActionsDropdown
                                        quickActions={subItem.quickActions}
                                        isSubItem={true}
                                        side="bottom"
                                        align="start"
                                    />
                                )}
                            </SidebarMenuSubItem>
                        ))}
                    </SidebarMenuSub>
                </CollapsibleContent>
            </SidebarMenuItem>
        </Collapsible>
    );
}

function SidebarQuickActionsDropdown({
    quickActions,
    isSubItem,
    side,
    align,
}: {
    quickActions: NavItemQuickAction[];
    isSubItem?: boolean;
    side?: 'bottom' | 'right';
    align?: 'end' | 'start';
}) {
    const { isMobile } = useSidebar();
    const ActionComponent = isSubItem
        ? SidebarMenuSubAction
        : SidebarMenuAction;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                openOnHover
                render={
                    <ActionComponent
                        showOnHover={true}
                        className={cn(
                            'data-popup-open:bg-accent data-popup-open:opacity-100',
                        )}
                    />
                }
            >
                <EllipsisIcon />
                <span className="sr-only">Más</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                side={side || (isMobile ? 'bottom' : 'right')}
                align={align || (isMobile ? 'end' : 'start')}
                className="w-fit"
            >
                {quickActions.map((action, index) => (
                    <div key={index}>
                        {'href' in action && action.href ? (
                            <DropdownMenuItem
                                variant={
                                    action.destructive
                                        ? 'destructive'
                                        : 'default'
                                }
                                render={<Link href={action.href} />}
                            >
                                <action.icon />
                                <span>{action.text}</span>
                            </DropdownMenuItem>
                        ) : (
                            <DropdownMenuItem
                                variant={
                                    action.destructive
                                        ? 'destructive'
                                        : 'default'
                                }
                                onClick={action.onSelect}
                            >
                                <action.icon />
                                <span>{action.text}</span>
                            </DropdownMenuItem>
                        )}
                        {action.separator && <DropdownMenuSeparator />}
                    </div>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
