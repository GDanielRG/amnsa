import ActionsDropdownMenu from '@/components/actions-dropdown-menu';
import { Button } from '@/components/ui/button';
import {
    DropdownMenuItem,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { TableCell } from '@/components/ui/table';
import type { InertiaLinkProps } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import { EyeIcon, MoreHorizontalIcon, PencilIcon, TrashIcon } from 'lucide-react';

type LinkHref = InertiaLinkProps['href'];

type RowActionsCellProps = {
    dataTestPrefix: string;
    showHref?: LinkHref;
    editHref?: LinkHref;
    onDelete?: () => void;
};

export default function RowActionsCell({
    dataTestPrefix,
    showHref,
    editHref,
    onDelete,
}: RowActionsCellProps) {
    const hasViewOrEdit = showHref || editHref;

    return (
        <TableCell>
            <ActionsDropdownMenu
                align="end"
                trigger={(open) => (
                    <Button
                        variant={open ? 'secondary' : 'outline'}
                        size="icon-lg"
                        data-test={`${dataTestPrefix}-actions`}
                    >
                        <MoreHorizontalIcon />
                        <span className="sr-only">Acciones</span>
                    </Button>
                )}
            >
                {showHref && (
                    <DropdownMenuItem
                        data-test={`${dataTestPrefix}-action-view`}
                        render={<Link href={showHref} prefetch />}
                    >
                        <EyeIcon />
                        Ver detalle
                    </DropdownMenuItem>
                )}
                {editHref && (
                    <DropdownMenuItem
                        data-test={`${dataTestPrefix}-action-edit`}
                        render={<Link href={editHref} prefetch />}
                    >
                        <PencilIcon />
                        Editar
                    </DropdownMenuItem>
                )}
                {hasViewOrEdit && onDelete && <DropdownMenuSeparator />}
                {onDelete && (
                    <DropdownMenuItem
                        data-test={`${dataTestPrefix}-action-delete`}
                        variant="destructive"
                        onClick={onDelete}
                    >
                        <TrashIcon />
                        Eliminar
                    </DropdownMenuItem>
                )}
            </ActionsDropdownMenu>
        </TableCell>
    );
}
