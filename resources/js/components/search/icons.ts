import { CircleCheckIcon, CircleOffIcon, type LucideIcon } from 'lucide-react';

const optionIconMap: Record<string, LucideIcon> = {
    active: CircleCheckIcon,
    inactive: CircleOffIcon,
};

export function resolveFilterOptionIcon(
    optionIcon?: string,
): LucideIcon | null {
    if (!optionIcon) {
        return null;
    }

    return optionIconMap[optionIcon] ?? null;
}
