import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Columns3CogIcon, EyeClosedIcon, EyeIcon } from 'lucide-react';
import { useState } from 'react';

export interface ColumnDef {
    key: string;
    label: string;
}

/**
 * Dropdown menu for toggling column visibility.
 *
 * Controlled by a `Record<string, boolean>` where keys are column identifiers
 * and values indicate whether the column is visible.
 */
export default function ColumnVisibilityMenu({
    columns,
    visibility,
    onVisibilityChange,
}: {
    columns: ColumnDef[];
    visibility: Record<string, boolean>;
    onVisibilityChange: (key: string, visible: boolean) => void;
}) {
    const [open, setOpen] = useState(false);
    const visibleColumnCount = columns.filter(
        (column) => visibility[column.key] !== false,
    ).length;

    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger
                render={
                    <Button
                        variant={open ? 'secondary' : 'outline'}
                        size="icon"
                    />
                }
            >
                <Columns3CogIcon />
                <span className="sr-only">Columnas</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-fit">
                <DropdownMenuGroup>
                    <DropdownMenuLabel>
                        Columnas
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {columns.map((column) => {
                        const isVisible = visibility[column.key] !== false;
                        const isLastVisibleColumn =
                            isVisible && visibleColumnCount <= 1;

                        return (
                            <DropdownMenuCheckboxItem
                                key={column.key}
                                disabled={isLastVisibleColumn}
                                className={
                                    isVisible
                                        ? '[&_[data-slot=dropdown-menu-checkbox-item-indicator]]:hidden'
                                        : 'text-destructive [&_[data-slot=dropdown-menu-checkbox-item-indicator]]:hidden'
                                }
                                checked={isVisible}
                                onCheckedChange={(checked) => {
                                    if (!checked && isLastVisibleColumn) {
                                        return;
                                    }

                                    onVisibilityChange(column.key, !!checked);
                                }}
                            >
                                {isVisible ? <EyeIcon /> : <EyeClosedIcon />}
                                {column.label}
                            </DropdownMenuCheckboxItem>
                        );
                    })}
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
