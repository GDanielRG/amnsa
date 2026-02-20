import {
    store,
    update,
} from '@/actions/App/Http/Controllers/Personnel/RoleController';
import SaveSubmitButton from '@/components/save-submit-button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import type { Permission, Role } from '@/types';
import { Form } from '@inertiajs/react';
import { useState } from 'react';

interface RoleFormProps {
    role?: Role;
    permissions: Permission[];
    className?: string;
}

export default function RoleForm({
    role,
    permissions,
    className,
}: RoleFormProps) {
    const [selectedPermissionIds, setSelectedPermissionIds] = useState<
        Set<number>
    >(() => new Set(role?.permissions.map((p) => p.id) ?? []));

    function getAllChildIds(permission: Permission): number[] {
        return (permission.children ?? []).flatMap((child) => [
            child.id,
            ...getAllChildIds(child),
        ]);
    }

    function togglePermission(permission: Permission, checked: boolean) {
        setSelectedPermissionIds((previousSelectedPermissionIds) => {
            const updatedSelectedPermissionIds = new Set(
                previousSelectedPermissionIds,
            );

            const children = permission.children ?? [];
            const hasChildren = children.length > 0;

            if (checked) {
                updatedSelectedPermissionIds.add(permission.id);

                if (hasChildren) {
                    for (const childId of getAllChildIds(permission)) {
                        updatedSelectedPermissionIds.add(childId);
                    }
                } else {
                    const parentPermission = permissions.find((p) =>
                        (p.children ?? []).some((c) => c.id === permission.id),
                    );
                    if (parentPermission) {
                        updatedSelectedPermissionIds.add(parentPermission.id);
                    }
                }
            } else {
                if (hasChildren) {
                    const allChildIds = getAllChildIds(permission);
                    const allChildrenSelected = allChildIds.every((id) =>
                        previousSelectedPermissionIds.has(id),
                    );
                    const someChildrenSelected = allChildIds.some((id) =>
                        previousSelectedPermissionIds.has(id),
                    );

                    if (allChildrenSelected) {
                        for (const childId of allChildIds) {
                            updatedSelectedPermissionIds.delete(childId);
                        }
                    } else if (someChildrenSelected) {
                        for (const childId of allChildIds) {
                            updatedSelectedPermissionIds.add(childId);
                        }
                    } else {
                        updatedSelectedPermissionIds.delete(permission.id);
                    }
                } else {
                    updatedSelectedPermissionIds.delete(permission.id);
                }
            }

            return updatedSelectedPermissionIds;
        });
    }

    return (
        <Form
            {...(role ? update.form(role) : store.form())}
            disableWhileProcessing
            showProgress={false}
            transform={(data) => ({
                ...data,
                permissions: Array.from(selectedPermissionIds),
            })}
            className={cn('inert:pointer-events-none', className)}
        >
            {({ errors, processing }) => (
                <>
                    <FieldGroup className="grid grid-cols-1 gap-6 md:gap-4">
                        <Field data-invalid={!!errors.name}>
                            <FieldLabel htmlFor="name">
                                Nombre del rol
                            </FieldLabel>
                            <Input
                                id="name"
                                name="name"
                                autoFocus
                                defaultValue={role?.name}
                                aria-invalid={!!errors.name}
                            />
                            <FieldError>{errors.name}</FieldError>
                        </Field>

                        <Field data-invalid={!!errors.permissions}>
                            <FieldLabel>Permisos</FieldLabel>
                            <div className="space-y-3">
                                {permissions.map((permission) => (
                                    <PermissionNode
                                        key={permission.id}
                                        permission={permission}
                                        selectedPermissionIds={
                                            selectedPermissionIds
                                        }
                                        onToggle={togglePermission}
                                        level={0}
                                    />
                                ))}
                            </div>
                            <FieldError>{errors.permissions}</FieldError>
                        </Field>
                    </FieldGroup>

                    <SaveSubmitButton processing={processing} />
                </>
            )}
        </Form>
    );
}

interface PermissionNodeProps {
    permission: Permission;
    selectedPermissionIds: Set<number>;
    onToggle: (permission: Permission, checked: boolean) => void;
    level: number;
}

function PermissionNode({
    permission,
    selectedPermissionIds,
    onToggle,
    level,
}: PermissionNodeProps) {
    const isChecked = selectedPermissionIds.has(permission.id);
    const children = permission.children ?? [];
    const hasChildren = children.length > 0;
    const isIndeterminate =
        isChecked &&
        hasChildren &&
        children.some((child) => !selectedPermissionIds.has(child.id));

    return (
        <div
            style={level > 0 ? { paddingLeft: `${level * 1.5}rem` } : undefined}
        >
            <Label
                className="cursor-pointer py-0.5"
                data-test={`permission-${permission.id}`}
            >
                <Checkbox
                    checked={isChecked}
                    indeterminate={isIndeterminate}
                    onCheckedChange={(checked) =>
                        onToggle(permission, checked === true)
                    }
                />
                {permission.formatted_name}
            </Label>

            {hasChildren && (
                <div className="mt-2 space-y-2">
                    {permission.children.map((childPermission) => (
                        <PermissionNode
                            key={childPermission.id}
                            permission={childPermission}
                            selectedPermissionIds={selectedPermissionIds}
                            onToggle={onToggle}
                            level={level + 1}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
