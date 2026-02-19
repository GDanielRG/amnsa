import ActionsDropdownMenu from '@/components/actions-dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontalIcon } from 'lucide-react';
import { type ReactNode } from 'react';

export default function RowActionsMenu({
    children,
    triggerDataTest,
}: {
    children: ReactNode;
    triggerDataTest?: string;
}) {
    return (
        <ActionsDropdownMenu
            align="end"
            contentClassName="w-fit"
            trigger={(open) => (
                <Button
                    className="dark:bg-[#181818] dark:hover:bg-[#1c1c1c]"
                    variant={open ? 'secondary' : 'outline'}
                    size="icon-lg"
                    {...(triggerDataTest && { 'data-test': triggerDataTest })}
                >
                    <MoreHorizontalIcon />
                    <span className="sr-only">Acciones</span>
                </Button>
            )}
        >
            {children}
        </ActionsDropdownMenu>
    );
}
