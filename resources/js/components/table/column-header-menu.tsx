import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    ArrowDownIcon,
    ArrowUpIcon,
    ChevronsUpDownIcon,
    EyeClosedIcon,
} from 'lucide-react';
import { useState } from 'react';

export default function ColumnHeaderMenu({
    title,
    onHide,
    canHide = true,
}: {
    title: string;
    onHide: () => void;
    canHide?: boolean;
}) {
    const [open, setOpen] = useState(false);

    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger
                render={
                    <Button
                        variant={open ? 'secondary' : 'ghost'}
                        size="sm"
                        className="h-8 px-2"
                    />
                }
            >
                <span>{title}</span>
                <ChevronsUpDownIcon />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-44">
                <DropdownMenuItem onClick={() => undefined}>
                    <ArrowUpIcon />
                    ascendente
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => undefined}>
                    <ArrowDownIcon />
                    descendente
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    variant="destructive"
                    disabled={!canHide}
                    onClick={onHide}
                >
                    <EyeClosedIcon />
                    Ocultar columna
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
