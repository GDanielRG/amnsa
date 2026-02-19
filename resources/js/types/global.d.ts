import type { Auth, Flash } from '@/types/auth';

declare module '@inertiajs/core' {
    export interface InertiaConfig {
        sharedPageProps: {
            name: string;
            auth: Auth;
            navigation: {
                sidebar: Record<string, unknown>[];
            };
            sidebarOpen: boolean;
            [key: string]: unknown;
        };
        flashDataType: Flash;
    }
}
