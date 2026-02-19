import { Badge } from '@/components/ui/badge';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import type { Permission } from '@/types';
import { CheckIcon, ChevronDownIcon } from 'lucide-react';

type PermissionGroup = {
    key: string;
    label: string;
    children: { key: string; label: string }[];
};

type PermissionTreeProps = {
    className?: string;
} & (
        | {
            selectedPermissions: string[];
            permissionNames: Record<string, string>;
            permissions?: never;
        }
        | {
            permissions: Permission[];
            selectedPermissions?: never;
            permissionNames?: never;
        }
    );

type TreeNode = {
    _key: string;
    label: string;
    children: Record<string, TreeNode>;
};

function buildTreeFromStrings(
    selectedPermissions: string[],
    permissionNames: Record<string, string>,
): Record<string, TreeNode> {
    const result: Record<string, TreeNode> = {};

    selectedPermissions.forEach((permission) => {
        const parts = permission.split('.');
        let current = result;
        let key = '';

        parts.forEach((part) => {
            key = key ? `${key}.${part}` : part;
            if (!current[part]) {
                current[part] = {
                    _key: key,
                    label: permissionNames[key] || part,
                    children: {},
                };
            }
            current = current[part].children;
        });
    });

    return result;
}

function buildTreeFromPermissions(
    permissions: Permission[],
): Record<string, TreeNode> {
    const permissionNames: Record<string, string> = {};
    const selectedPermissions: string[] = [];

    function collectPermissions(permissionList: Permission[]) {
        for (const permission of permissionList) {
            permissionNames[permission.name] = permission.formatted_name;
            selectedPermissions.push(permission.name);

            if (permission.children?.length > 0) {
                collectPermissions(permission.children);
            }
        }
    }

    collectPermissions(permissions);

    return buildTreeFromStrings(selectedPermissions, permissionNames);
}

function collectGroups(tree: Record<string, TreeNode>): PermissionGroup[] {
    const groups: PermissionGroup[] = [];

    function traverse(nodes: Record<string, TreeNode>) {
        for (const node of Object.values(nodes)) {
            if (node.label === node._key) {
                traverse(node.children);
                continue;
            }

            const group: PermissionGroup = {
                key: node._key,
                label: node.label,
                children: [],
            };

            function collectChildren(childNodes: Record<string, TreeNode>) {
                for (const child of Object.values(childNodes)) {
                    if (child.label === child._key) {
                        collectChildren(child.children);
                    } else {
                        group.children.push({
                            key: child._key,
                            label: child.label,
                        });
                    }
                }
            }

            collectChildren(node.children);
            groups.push(group);
        }
    }

    traverse(tree);

    return groups;
}

type PermissionSummaryProps = {
    variant?: 'secondary' | 'outline';
} & (
        | { permissions: Permission[]; roles?: never }
        | { roles: { permissions: { name: string }[] }[]; permissions?: never }
    );

export function PermissionSummary({ ...props }: PermissionSummaryProps) {
    const permissionCount = props.permissions
        ? props.permissions.length
        : new Set(
            props.roles.flatMap((role) =>
                role.permissions.map((p) => p.name),
            ),
        ).size;

    if (permissionCount === 0) {
        return null;
    }

    const treeProps: PermissionTreeProps = props.permissions
        ? { permissions: props.permissions }
        : {
            selectedPermissions: [
                ...new Set(
                    props.roles.flatMap((role) =>
                        role.permissions.map((p) => p.name),
                    ),
                ),
            ],
            permissionNames: Object.fromEntries(
                props.roles.flatMap((role) =>
                    role.permissions.map((p) => [
                        p.name,
                        'formatted_name' in p
                            ? (p as { formatted_name: string }).formatted_name
                            : p.name,
                    ]),
                ),
            ),
        };

    return (
        <Popover>
            <Badge
                variant="outline"
                className="group"
                render={<PopoverTrigger />}
            >
                <ChevronDownIcon className="transition-transform duration-200 group-data-[popup-open]:rotate-180" />
                {permissionCount}{' '}
                {permissionCount === 1 ? 'permiso' : 'permisos'}
            </Badge>
            <PopoverContent
                side="bottom"
                align="start"
                sideOffset={8}
                className="max-w-md gap-0 p-3"
            >
                <PermissionTree {...treeProps} />
            </PopoverContent>
        </Popover>
    );
}

export default function PermissionTree(props: PermissionTreeProps) {
    const tree = props.permissions
        ? buildTreeFromPermissions(props.permissions)
        : buildTreeFromStrings(
            props.selectedPermissions,
            props.permissionNames,
        );

    const groups = collectGroups(tree);

    if (groups.length === 0) {
        return null;
    }

    return (
        <div className={cn('space-y-1.5', props.className)}>
            {groups.map((group) => (
                <div key={group.key} className="relative">
                    {group.children.length > 0 && (
                        <div className="absolute top-5 bottom-[0.625rem] left-[0.4375rem] w-px bg-border" />
                    )}
                    <div className="flex items-start gap-1.5">
                        <CheckIcon className="mt-0.5 size-3.5 shrink-0 text-primary" />
                        <span className="text-sm font-medium">
                            {group.label}
                        </span>
                    </div>
                    {group.children.length > 0 && (
                        <div className="mt-0.5 ml-5 space-y-0.5">
                            {group.children.map((child) => (
                                <span
                                    key={child.key}
                                    className="block text-sm text-muted-foreground"
                                >
                                    {child.label}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
