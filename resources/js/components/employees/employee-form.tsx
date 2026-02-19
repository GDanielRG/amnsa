import {
    store,
    update,
} from '@/actions/App/Http/Controllers/Personnel/EmployeeController';
import PermissionTree from '@/components/employees/permission-tree';
import SaveSubmitButton from '@/components/save-submit-button';
import {
    Combobox,
    ComboboxChip,
    ComboboxChips,
    ComboboxChipsInput,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxItem,
    ComboboxList,
    ComboboxValue,
    useComboboxAnchor,
} from '@/components/ui/combobox';
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from '@/components/ui/input-group';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import type { Employee, Role } from '@/types';
import { Form } from '@inertiajs/react';
import { Mail } from 'lucide-react';
import { useState } from 'react';

interface RoleOption {
    label: string;
    value: string;
}

interface EmployeeFormProps {
    employee?: Employee;
    roles: Role[];
    permissionNames: { [key: string]: string };
    className?: string;
}

export default function EmployeeForm({
    employee,
    roles,
    permissionNames,
    className,
}: EmployeeFormProps) {
    const roleOptions: RoleOption[] = roles.map((role) => ({
        label: role.name,
        value: role.id.toString(),
    }));

    const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>(
        employee?.roles.map((role) => role.id.toString()) ?? [],
    );

    const [getLowInventoryNotification, setGetLowInventoryNotification] =
        useState(employee?.get_low_inventory_notification ?? false);

    const selectedRoles = roleOptions.filter((opt) =>
        selectedRoleIds.includes(opt.value),
    );

    const includedRoles = roles.filter((role) =>
        selectedRoleIds.includes(role.id.toString()),
    );
    const permissions = includedRoles.flatMap((role) =>
        role.permissions.map((permission) => permission.name),
    );
    const selectedPermissions = [...new Set(permissions)];

    return (
        <Form
            {...(employee ? update.form(employee) : store.form())}
            disableWhileProcessing
            showProgress={false}
            transform={(data) => ({
                ...data,
                roles: selectedRoleIds,
                get_low_inventory_notification: getLowInventoryNotification,
            })}
            className={cn('inert:pointer-events-none', className)}
        >
            {({ errors, processing }) => (
                <EmployeeFormFields
                    employee={employee}
                    roleOptions={roleOptions}
                    selectedRoles={selectedRoles}
                    onRolesChange={(roles) =>
                        setSelectedRoleIds(roles.map((r) => r.value))
                    }
                    selectedPermissions={selectedPermissions}
                    permissionNames={permissionNames}
                    getLowInventoryNotification={getLowInventoryNotification}
                    onGetLowInventoryNotificationChange={
                        setGetLowInventoryNotification
                    }
                    errors={errors}
                    processing={processing}
                />
            )}
        </Form>
    );
}

interface EmployeeFormFieldsProps {
    employee?: Employee;
    roleOptions: RoleOption[];
    selectedRoles: RoleOption[];
    onRolesChange: (roles: RoleOption[]) => void;
    selectedPermissions: string[];
    permissionNames: { [key: string]: string };
    getLowInventoryNotification: boolean;
    onGetLowInventoryNotificationChange: (value: boolean) => void;
    errors: Record<string, string | undefined>;
    processing: boolean;
}

function EmployeeFormFields({
    employee,
    roleOptions,
    selectedRoles,
    onRolesChange,
    selectedPermissions,
    permissionNames,
    getLowInventoryNotification,
    onGetLowInventoryNotificationChange,
    errors,
    processing,
}: EmployeeFormFieldsProps) {
    return (
        <>
            <FieldGroup className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-4">
                <Field data-invalid={!!errors.name}>
                    <FieldLabel htmlFor="name">Nombre</FieldLabel>
                    <Input
                        id="name"
                        name="name"
                        autoFocus
                        defaultValue={employee?.user.name}
                        aria-invalid={!!errors.name}
                    />
                    <FieldError>{errors.name}</FieldError>
                </Field>

                <Field data-invalid={!!errors.email}>
                    <FieldLabel htmlFor="email">Correo electrónico</FieldLabel>
                    <InputGroup>
                        <InputGroupAddon>
                            <Mail />
                        </InputGroupAddon>
                        <InputGroupInput
                            id="email"
                            name="email"
                            type="email"
                            defaultValue={employee?.user.email}
                            aria-invalid={!!errors.email}
                        />
                    </InputGroup>
                    <FieldError>{errors.email}</FieldError>
                </Field>

                <Field
                    data-invalid={!!errors.has_operator_account}
                    className="md:col-span-2"
                >
                    <FieldLabel htmlFor="has_operator_account">
                        Tipo de cuenta
                    </FieldLabel>

                    <RadioGroup
                        id="has_operator_account"
                        name="has_operator_account"
                        defaultValue={employee?.operator ? '1' : '0'}
                        className="gap-4 md:grid md:grid-cols-2"
                        aria-invalid={!!errors.has_operator_account}
                    >
                        {[
                            {
                                value: '0',
                                name: 'Regular',
                                description:
                                    'No podrá realizar operaciones de afilado, pero sí funciones administrativas según los roles asignados.',
                            },
                            {
                                value: '1',
                                name: 'Afilador',
                                description:
                                    'Sí podrá realizar operaciones de afilado y funciones administrativas según los roles asignados.',
                            },
                        ].map((plan) => (
                            <Label
                                className="flex items-start gap-3 rounded-lg border p-4 hover:bg-accent/50 has-data-checked:border-neutral-950 has-data-checked:bg-neutral-50 dark:has-data-checked:border-white dark:has-data-checked:bg-neutral-900"
                                key={plan.value}
                                data-test={`has_operator_account_${plan.value}`}
                            >
                                <RadioGroupItem
                                    value={plan.value}
                                    id={plan.value}
                                    className="shadow-none data-checked:border-neutral-950 data-checked:bg-neutral-950 dark:data-checked:border-white dark:data-checked:bg-white *:data-[slot=radio-group-indicator]:[&>svg]:fill-white *:data-[slot=radio-group-indicator]:[&>svg]:stroke-white dark:*:data-[slot=radio-group-indicator]:[&>svg]:fill-neutral-800 dark:*:data-[slot=radio-group-indicator]:[&>svg]:stroke-neutral-900"
                                />
                                <div className="grid gap-1 font-normal">
                                    <div className="font-medium">
                                        {plan.name}
                                    </div>
                                    <div className="leading-snug text-muted-foreground">
                                        {plan.description}
                                    </div>
                                </div>
                            </Label>
                        ))}
                    </RadioGroup>

                    <FieldError>{errors.has_operator_account}</FieldError>
                </Field>

                <Field
                    data-invalid={!!errors.get_low_inventory_notification}
                    className="md:col-span-2"
                >
                    <div className="flex items-center gap-3">
                        <Switch
                            id="get_low_inventory_notification"
                            checked={getLowInventoryNotification}
                            onCheckedChange={
                                onGetLowInventoryNotificationChange
                            }
                            aria-invalid={
                                !!errors.get_low_inventory_notification
                            }
                            data-test="get_low_inventory_notification"
                        />
                        <FieldLabel htmlFor="get_low_inventory_notification">
                            Recibe notificaciones de inventario bajo
                        </FieldLabel>
                    </div>
                    <FieldError>
                        {errors.get_low_inventory_notification}
                    </FieldError>
                </Field>

                <RolesField
                    roleOptions={roleOptions}
                    selectedRoles={selectedRoles}
                    onValueChange={onRolesChange}
                    selectedPermissions={selectedPermissions}
                    permissionNames={permissionNames}
                    error={errors.roles}
                />
            </FieldGroup>

            <SaveSubmitButton processing={processing} />
        </>
    );
}

interface RolesFieldProps {
    roleOptions: RoleOption[];
    selectedRoles: RoleOption[];
    onValueChange: (roles: RoleOption[]) => void;
    selectedPermissions: string[];
    permissionNames: { [key: string]: string };
    error?: string;
}

function RolesField({
    roleOptions,
    selectedRoles,
    onValueChange,
    selectedPermissions,
    permissionNames,
    error,
}: RolesFieldProps) {
    const anchor = useComboboxAnchor();

    return (
        <Field data-invalid={!!error}>
            <FieldLabel htmlFor="roles">Roles</FieldLabel>
            <FieldDescription>
                Puedes seleccionar varias opciones
            </FieldDescription>
            <Combobox
                items={roleOptions}
                multiple
                value={selectedRoles}
                onValueChange={onValueChange}
            >
                <ComboboxChips ref={anchor}>
                    <ComboboxValue>
                        {(values: RoleOption[]) =>
                            values.map((role) => (
                                <ComboboxChip key={role.value}>
                                    {role.label}
                                </ComboboxChip>
                            ))
                        }
                    </ComboboxValue>
                    <ComboboxChipsInput
                        data-test="combobox-chips-input"
                        placeholder="Buscar roles..."
                        aria-invalid={!!error}
                    />
                </ComboboxChips>
                <ComboboxContent anchor={anchor}>
                    <ComboboxEmpty>No se encontraron roles</ComboboxEmpty>
                    <ComboboxList>
                        {(item: RoleOption) => (
                            <ComboboxItem
                                data-test={`combobox-option-${item.value}`}
                                key={item.value}
                                value={item}
                            >
                                {item.label}
                            </ComboboxItem>
                        )}
                    </ComboboxList>
                </ComboboxContent>
            </Combobox>
            {selectedPermissions.length > 0 && (
                <FieldDescription>
                    Tendrá los siguientes permisos
                </FieldDescription>
            )}
            <PermissionTree
                selectedPermissions={selectedPermissions}
                permissionNames={permissionNames}
            />
            <FieldError>{error}</FieldError>
        </Field>
    );
}
