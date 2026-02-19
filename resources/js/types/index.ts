import type { User } from './auth';

export type * from './auth';
export type * from './navigation';
export type * from './pagination';
export type * from './search';
export type * from './ui';

export interface Permission {
    id: number;
    name: string;
    formatted_name: string;
    children: Permission[];
    guard_name: string;
    created_at: string;
    updated_at: string;
}

export interface Role {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
    permissions: Permission[];
}

export interface Division {
    id: number;
    name: string;
    operators_count?: number;
    created_at: string;
    updated_at: string;
}

export interface Operator {
    id: number;
    employee_id: number;
    division_id: number;
    division: Division | null;
    created_at: string;
    updated_at: string;
}

export interface Employee {
    id: number;
    user_id: number;
    get_low_inventory_notification: boolean;
    created_at: string;
    updated_at: string;
    user: User;
    operator: Operator | null;
    roles: Role[];
}
