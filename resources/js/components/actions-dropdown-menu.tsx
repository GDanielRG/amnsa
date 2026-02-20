import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { ChevronDownIcon } from 'lucide-react';
import { useState, type ReactElement, type ReactNode } from 'react';

export default function ActionsDropdownMenu({
    children,
    trigger,
    align = 'start',
    contentClassName,
}: {
    children: ReactNode;
    trigger?: ReactElement | ((open: boolean) => ReactElement);
    align?: 'start' | 'center' | 'end';
    contentClassName?: string;
}) {
    const [open, setOpen] = useState(false);

    const triggerElement =
        typeof trigger === 'function'
            ? trigger(open)
            : (trigger ?? (
                <Button variant={open ? 'secondary' : 'outline'}>
                    Acciones
                    <ChevronDownIcon />
                </Button>
            ));

    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger render={triggerElement} />
            <DropdownMenuContent
                align={align}
                className={cn('w-fit', contentClassName)}
            >
                {children}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
