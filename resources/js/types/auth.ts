export type User = {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
};

export type Auth = {
    user: User;
};

export type Flash = {
    success?: string;
    error?: string;
    info?: string;
    warning?: string;
};

export type SharedData = {
    name: string;
    auth: Auth;
    navigation: {
        sidebar: Record<string, unknown>[];
    };
    sidebarOpen: boolean;
    [key: string]: unknown;
};

export type TwoFactorSetupData = {
    svg: string;
    url: string;
};

export type TwoFactorSecretKey = {
    secretKey: string;
};
